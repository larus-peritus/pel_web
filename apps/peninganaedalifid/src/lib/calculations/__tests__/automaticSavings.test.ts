/**
 * Tests for Automatic Savings Impact Calculator
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFutureValue,
  calculateSavingsResults,
} from '../automaticSavings';
import type { SavingsInputs } from '@/types/savings';

describe('calculateFutureValue', () => {
  it('calculates FV with 0% interest correctly', () => {
    const fv = calculateFutureValue(10000, 0, 120);
    expect(fv).toBe(1200000); // Simply 10000 × 120
  });

  it('calculates FV for 10k/month, 7% annual, 10 years', () => {
    const payment = 10000;
    const rate = 0.07 / 12; // Monthly rate
    const periods = 10 * 12; // 120 months

    const fv = calculateFutureValue(payment, rate, periods);

    // Expected: ~1,730,850 kr (from requirements example)
    expect(fv).toBeCloseTo(1730850, -2); // Within 100 kr
  });

  it('calculates FV for 25k/month, 7% annual, 20 years', () => {
    const payment = 25000;
    const rate = 0.07 / 12;
    const periods = 20 * 12;

    const fv = calculateFutureValue(payment, rate, periods);

    // Expected: ~13,023,166 kr (slightly different from example due to compounding method)
    expect(fv).toBeCloseTo(13023166, -2);
  });

  it('handles edge case: 0 periods', () => {
    const fv = calculateFutureValue(10000, 0.07 / 12, 0);
    expect(fv).toBe(0);
  });

  it('handles edge case: 0 payment', () => {
    const fv = calculateFutureValue(0, 0.07 / 12, 120);
    expect(fv).toBe(0);
  });
});

describe('calculateSavingsResults', () => {
  it('calculates all values correctly for basic scenario', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.futureValue).toBeCloseTo(1730850, -2);
    expect(results.totalContributions).toBe(1200000);
    expect(results.totalGrowth).toBeCloseTo(530850, -2);
    expect(results.growthPercentage).toBeCloseTo(30.68, 1); // ~30.68%
    expect(results.yearlyBreakdown).toHaveLength(11); // 0 to 10 inclusive
    expect(results.lifeEnergyContributed).toBeUndefined(); // No wage provided
  });

  it('calculates life energy when actualHourlyWage provided', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs, 2000);

    expect(results.lifeEnergyContributed).toBe(600); // 1,200,000 / 2,000
    expect(results.lifeEnergyEarnedPassively).toBeCloseTo(265, 0); // ~530,850 / 2,000
    expect(results.totalLifeEnergy).toBeCloseTo(865, 0); // ~1,730,850 / 2,000
  });

  it('calculates freedom months when expenses provided', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const monthlyExpenses = 50000;
    const results = calculateSavingsResults(inputs, 2000, monthlyExpenses);

    expect(results.freedomMonths).toBeCloseTo(34.6, 1); // ~1,730,850 / 50,000
  });

  it('calculates real value when inflation adjustment enabled', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: true,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.realValue).toBeDefined();
    expect(results.realValue).toBeCloseTo(1352136, -2); // Inflation-adjusted
    expect(results.realValue).toBeLessThan(results.futureValue);
  });

  it('handles weekly frequency correctly', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'weekly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    // Weekly contributions: 10000 * 12 / 52 = ~2307.69 per week
    // Should have slightly higher FV due to more frequent compounding
    expect(results.futureValue).toBeGreaterThan(1730850);
    expect(results.totalContributions).toBeCloseTo(1200000, -2); // Same total
  });

  it('handles custom frequency correctly', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'custom',
      customFrequency: 24, // Twice a month
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    // Should be between monthly and biweekly
    expect(results.totalContributions).toBeCloseTo(1200000, -2);
    expect(results.futureValue).toBeGreaterThan(1730850);
  });

  it('generates correct yearly breakdown', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.yearlyBreakdown).toHaveLength(11); // 0 to 10
    expect(results.yearlyBreakdown[0].futureValue).toBe(0); // Year 0
    expect(results.yearlyBreakdown[10].futureValue).toBeCloseTo(1730850, -2); // Year 10
  });

  it('includes inflation adjustment in yearly breakdown when enabled', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: true,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.yearlyBreakdown[10].realValue).toBeDefined();
    expect(results.yearlyBreakdown[10].realValue).toBeLessThan(results.yearlyBreakdown[10].futureValue);
    expect(results.yearlyBreakdown[10].realValue).toBeCloseTo(1352136, -2);
  });
});
