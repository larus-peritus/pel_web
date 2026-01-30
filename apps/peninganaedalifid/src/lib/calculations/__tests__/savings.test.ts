/**
 * Unit tests for compound savings calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSavingsResults,
  validateSavingsInputs,
  generateSavingsId,
} from '../savings';

describe('calculateSavingsResults', () => {
  it('calculates future value with compound interest correctly', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 50000,
        annualInterestRate: 3.0,
        timeHorizonYears: 10,
      },
      5000
    );

    // Expected future value with annuity due (beginning-of-period payments)
    expect(result.futureValue).toBeCloseTo(7004539, 0);
    expect(result.totalContributions).toBe(6000000);
    expect(result.totalInterestEarned).toBeCloseTo(1004539, 0);
  });

  it('handles zero interest rate (simple sum)', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 50000,
        annualInterestRate: 0,
        timeHorizonYears: 10,
      },
      5000
    );

    expect(result.futureValue).toBe(6000000);
    expect(result.totalInterestEarned).toBe(0);
  });

  it('converts to life energy correctly', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 50000,
        annualInterestRate: 3.0,
        timeHorizonYears: 10,
      },
      5000
    );

    expect(result.futureValueLifeEnergy).toBeCloseTo(7004539 / 5000, 1);
    expect(result.interestEarnedLifeEnergy).toBeCloseTo(1004539 / 5000, 1);
  });

  it('returns 0 life energy when wage is 0', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 50000,
        annualInterestRate: 3.0,
        timeHorizonYears: 10,
      },
      0
    );

    expect(result.futureValueLifeEnergy).toBe(0);
    expect(result.interestEarnedLifeEnergy).toBe(0);
  });

  it('generates correct yearly breakdown', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 50000,
        annualInterestRate: 3.0,
        timeHorizonYears: 10,
      },
      5000
    );

    expect(result.yearlyBreakdown).toHaveLength(10);
    expect(result.yearlyBreakdown[0].year).toBe(1);
    expect(result.yearlyBreakdown[0].totalContributions).toBe(600000);
    expect(result.yearlyBreakdown[9].year).toBe(10);
  });

  it('handles very long time horizons', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 10000,
        annualInterestRate: 5.0,
        timeHorizonYears: 50,
      },
      5000
    );

    expect(result.futureValue).toBeGreaterThan(0);
    expect(result.yearlyBreakdown).toHaveLength(50);
  });

  it('handles large interest rates', () => {
    const result = calculateSavingsResults(
      {
        monthlySavings: 1000,
        annualInterestRate: 15.0,
        timeHorizonYears: 5,
      },
      5000
    );

    // Should handle calculation
    expect(result.futureValue).toBeGreaterThan(result.totalContributions);
    expect(result.totalContributions).toBe(60000);
  });
});

describe('validateSavingsInputs', () => {
  it('validates valid inputs', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects monthlySavings below minimum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 500,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlySavings).toBeDefined();
  });

  it('rejects monthlySavings above maximum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 2000000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlySavings).toBeDefined();
  });

  it('rejects negative interest rate', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: -1,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.annualInterestRate).toBeDefined();
  });

  it('rejects time horizon below minimum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 0,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.timeHorizonYears).toBeDefined();
  });

  it('rejects time horizon above maximum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 60,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.timeHorizonYears).toBeDefined();
  });
});

describe('generateSavingsId', () => {
  it('generates unique IDs', () => {
    const id1 = generateSavingsId();
    const id2 = generateSavingsId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^savings-\d+-[a-z0-9]+$/);
  });
});
