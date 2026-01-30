/**
 * Tests for FI (Financial Independence) calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateYearsToFI,
  calculateFIDate,
  calculateSavingsRate,
  calculateAnnualSavings,
  calculateFINumber,
  calculateMarginalImpact,
  calculateFIResults,
  generateFICurveData,
} from '../fi';
import type { FIInputs } from '@/types/fi';

describe('calculateYearsToFI', () => {
  it('should calculate years to FI with normal inputs', () => {
    // 25M FI number, 3M annual savings, 0 current worth, 7% return
    const years = calculateYearsToFI(25_000_000, 3_000_000, 0, 7);

    // Should be around 6-7 years
    expect(years).toBeGreaterThan(6);
    expect(years).toBeLessThan(8);
    expect(isFinite(years)).toBe(true);
  });

  it('should return 0 if already at FI', () => {
    const years = calculateYearsToFI(25_000_000, 3_000_000, 30_000_000, 7);
    expect(years).toBe(0);
  });

  it('should return Infinity with zero savings', () => {
    const years = calculateYearsToFI(25_000_000, 0, 0, 7);
    expect(years).toBe(Infinity);
  });

  it('should return Infinity with negative savings', () => {
    const years = calculateYearsToFI(25_000_000, -1_000_000, 0, 7);
    expect(years).toBe(Infinity);
  });

  it('should handle zero return rate (simple division)', () => {
    const years = calculateYearsToFI(25_000_000, 2_500_000, 0, 0);
    expect(years).toBe(10); // 25M / 2.5M = 10 years
  });

  it('should factor in current net worth', () => {
    const yearsWithout = calculateYearsToFI(25_000_000, 3_000_000, 0, 7);
    const yearsWith = calculateYearsToFI(25_000_000, 3_000_000, 10_000_000, 7);

    expect(yearsWith).toBeLessThan(yearsWithout);
  });

  it('should return Infinity for very long time horizons', () => {
    // Very small savings relative to target
    const years = calculateYearsToFI(100_000_000, 10_000, 0, 7);
    expect(years).toBe(Infinity);
  });
});

describe('calculateFIDate', () => {
  it('should calculate FI date in the future', () => {
    const years = 8.5;
    const fiDate = calculateFIDate(years);
    const now = new Date();

    expect(fiDate.getTime()).toBeGreaterThan(now.getTime());

    // Should be roughly 8.5 years from now
    const yearsDiff = (fiDate.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    expect(yearsDiff).toBeGreaterThan(8);
    expect(yearsDiff).toBeLessThan(9);
  });

  it('should return far future date for Infinity', () => {
    const fiDate = calculateFIDate(Infinity);
    expect(fiDate.getFullYear()).toBe(2100);
  });
});

describe('calculateSavingsRate', () => {
  it('should calculate savings rate correctly', () => {
    const rate = calculateSavingsRate(8_000_000, 5_000_000);
    expect(rate).toBe(37.5); // (8M - 5M) / 8M * 100 = 37.5%
  });

  it('should return 0 for zero income', () => {
    const rate = calculateSavingsRate(0, 5_000_000);
    expect(rate).toBe(0);
  });

  it('should return 0 when expenses exceed income', () => {
    const rate = calculateSavingsRate(5_000_000, 8_000_000);
    expect(rate).toBe(0); // Clamped to 0
  });

  it('should return 100 for zero expenses', () => {
    const rate = calculateSavingsRate(8_000_000, 0);
    expect(rate).toBe(100);
  });

  it('should clamp to valid range', () => {
    const rate = calculateSavingsRate(1_000_000, 1_000_000);
    expect(rate).toBeGreaterThanOrEqual(0);
    expect(rate).toBeLessThanOrEqual(100);
  });
});

describe('calculateAnnualSavings', () => {
  it('should calculate annual savings correctly', () => {
    const savings = calculateAnnualSavings(8_000_000, 37.5);
    expect(savings).toBe(3_000_000); // 8M * 0.375 = 3M
  });

  it('should return 0 for 0% savings rate', () => {
    const savings = calculateAnnualSavings(8_000_000, 0);
    expect(savings).toBe(0);
  });

  it('should return full income for 100% savings rate', () => {
    const savings = calculateAnnualSavings(8_000_000, 100);
    expect(savings).toBe(8_000_000);
  });
});

describe('calculateFINumber', () => {
  it('should calculate FI number correctly', () => {
    const fiNumber = calculateFINumber(1_000_000, 25);
    expect(fiNumber).toBe(25_000_000); // 1M * 25 = 25M
  });

  it('should handle different multipliers', () => {
    const fi20x = calculateFINumber(1_000_000, 20);
    const fi30x = calculateFINumber(1_000_000, 30);
    const fi40x = calculateFINumber(1_000_000, 40);

    expect(fi20x).toBe(20_000_000);
    expect(fi30x).toBe(30_000_000);
    expect(fi40x).toBe(40_000_000);
  });
});

describe('calculateMarginalImpact', () => {
  const baseInputs: FIInputs = {
    fiNumber: 25_000_000,
    annualIncome: 8_000_000,
    annualExpenses: 5_000_000,
    currentNetWorth: 0,
    expectedReturnRate: 7,
    fiMultiplier: 25,
    currentSavingsRate: 37.5,
  };

  it('should calculate impact of 1% increase', () => {
    const currentYears = 8;
    const impact = calculateMarginalImpact(baseInputs, currentYears, 1);

    expect(impact.months).toBeGreaterThan(0);
    expect(impact.years).toBeGreaterThan(0);
    expect(impact.years).toBeLessThan(1); // 1% shouldn't save a full year
  });

  it('should calculate impact of 5% increase', () => {
    const currentYears = 8;
    const impact = calculateMarginalImpact(baseInputs, currentYears, 5);

    expect(impact.months).toBeGreaterThan(0);
    expect(impact.years).toBeGreaterThan(0);
  });

  it('should calculate work hours when wage provided', () => {
    const currentYears = 8;
    const actualHourlyWage = 1500; // ISK per hour
    const impact = calculateMarginalImpact(baseInputs, currentYears, 5, actualHourlyWage);

    expect(impact.workHours).toBeGreaterThan(0);
  });

  it('should return 0 work hours when wage is 0', () => {
    const currentYears = 8;
    const impact = calculateMarginalImpact(baseInputs, currentYears, 5, 0);

    expect(impact.workHours).toBe(0);
  });

  it('should return 0 work hours when wage is not provided', () => {
    const currentYears = 8;
    const impact = calculateMarginalImpact(baseInputs, currentYears, 5);

    expect(impact.workHours).toBe(0);
  });
});

describe('calculateFIResults', () => {
  const baseInputs: FIInputs = {
    fiNumber: 25_000_000,
    annualIncome: 8_000_000,
    annualExpenses: 5_000_000,
    currentNetWorth: 0,
    expectedReturnRate: 7,
    fiMultiplier: 25,
    currentSavingsRate: 37.5,
  };

  it('should calculate complete FI results', () => {
    const results = calculateFIResults(baseInputs);

    expect(results).toBeDefined();
    expect(results.yearsToFI).toBeGreaterThan(0);
    expect(results.fiDate).toBeInstanceOf(Date);
    expect(results.monthsToFI).toBeGreaterThan(0);
    expect(results.currentProgress).toBe(0); // No current net worth
    expect(results.monthlyInvestment).toBeGreaterThan(0);
    expect(results.annualInvestment).toBeGreaterThan(0);
  });

  it('should calculate marginal impacts', () => {
    const results = calculateFIResults(baseInputs);

    expect(results.impactPer1Percent).toBeDefined();
    expect(results.impactPer5Percent).toBeDefined();
    expect(results.impactPer10Percent).toBeDefined();

    expect(results.impactPer1Percent.months).toBeGreaterThan(0);
    expect(results.impactPer5Percent.months).toBeGreaterThan(results.impactPer1Percent.months);
    expect(results.impactPer10Percent.months).toBeGreaterThan(results.impactPer5Percent.months);
  });

  it('should calculate life energy totals', () => {
    const results = calculateFIResults(baseInputs);

    expect(results.totalWorkHoursToFI).toBeGreaterThan(0);
    expect(results.totalWorkDaysToFI).toBeGreaterThan(0);
    expect(results.totalWorkYearsToFI).toBeGreaterThan(0);

    // Work years should be roughly equal to years to FI
    expect(Math.abs(results.totalWorkYearsToFI - results.yearsToFI)).toBeLessThan(1);
  });

  it('should calculate change from baseline when provided', () => {
    const baselineResults = calculateFIResults(baseInputs);

    const improvedInputs = { ...baseInputs, currentSavingsRate: 50 };
    const improvedResults = calculateFIResults(improvedInputs, undefined, baselineResults);

    expect(improvedResults.changeFromBaseline).toBeDefined();
    expect(improvedResults.changeFromBaseline!.months).toBeGreaterThan(0);
    expect(improvedResults.changeFromBaseline!.years).toBeGreaterThan(0);
  });

  it('should calculate progress when net worth exists', () => {
    const withNetWorth = { ...baseInputs, currentNetWorth: 10_000_000 };
    const results = calculateFIResults(withNetWorth);

    expect(results.currentProgress).toBe(40); // 10M / 25M = 40%
  });

  it('should use calculated savings rate when not provided', () => {
    const inputsWithoutRate = { ...baseInputs, currentSavingsRate: undefined };
    const results = calculateFIResults(inputsWithoutRate);

    expect(results.annualInvestment).toBe(3_000_000); // 8M income - 5M expenses
  });
});

describe('generateFICurveData', () => {
  const baseInputs: FIInputs = {
    fiNumber: 25_000_000,
    annualIncome: 8_000_000,
    annualExpenses: 5_000_000,
    currentNetWorth: 0,
    expectedReturnRate: 7,
    fiMultiplier: 25,
  };

  it('should generate curve data points', () => {
    const curveData = generateFICurveData(baseInputs, 37.5);

    expect(curveData.length).toBeGreaterThan(0);
    expect(curveData.length).toBe(21); // 0 to 100 in steps of 5 = 21 points
  });

  it('should mark current position', () => {
    const curveData = generateFICurveData(baseInputs, 50);

    const currentPoint = curveData.find((point) => point.isCurrent);
    expect(currentPoint).toBeDefined();
    expect(currentPoint!.savingsRate).toBe(50);
  });

  it('should mark reference points', () => {
    const curveData = generateFICurveData(baseInputs, 37.5);

    const referencePoints = curveData.filter((point) => point.isReference);
    expect(referencePoints.length).toBe(3); // 25%, 50%, 75%

    const rates = referencePoints.map((p) => p.savingsRate);
    expect(rates).toContain(25);
    expect(rates).toContain(50);
    expect(rates).toContain(75);
  });

  it('should show decreasing years as savings rate increases', () => {
    const curveData = generateFICurveData(baseInputs, 37.5);

    // Filter out 0% (which will be Infinity)
    const validPoints = curveData.filter((p) => p.savingsRate > 0);

    for (let i = 1; i < validPoints.length; i++) {
      expect(validPoints[i].yearsToFI).toBeLessThanOrEqual(validPoints[i - 1].yearsToFI);
    }
  });

  it('should cap years at 40 for display', () => {
    const curveData = generateFICurveData(baseInputs, 37.5);

    curveData.forEach((point) => {
      expect(point.yearsToFI).toBeLessThanOrEqual(40);
    });
  });

  it('should handle custom step size', () => {
    const curveData = generateFICurveData(baseInputs, 50, 10);

    expect(curveData.length).toBe(11); // 0 to 100 in steps of 10 = 11 points
  });
});
