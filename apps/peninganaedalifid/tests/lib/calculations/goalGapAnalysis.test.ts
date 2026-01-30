/**
 * Tests for Goal Gap Analysis calculation functions
 */

import { describe, it, expect } from 'vitest';
import {
  projectSavingsToRetirement,
  calculateExpenseReductionNeeded,
  calculateAdditionalSavingsNeeded,
  calculateGoalGapAnalysis,
} from '@/lib/calculations/pensionAwareFire';
import type { PensionAwareFireState } from '@/types/pensionAwareFire';

// Helper to create a full state object for testing
function createTestState(overrides: Partial<PensionAwareFireState> = {}): PensionAwareFireState {
  return {
    currentAge: 45,
    targetRetirementAge: 55,
    monthlyExpenses: 400_000,
    expenseSource: 'manual',
    expenseTier: 'comfortable',
    currentSavings: 20_000_000,
    monthlySavings: 250_000,
    investmentReturn: 0.05,
    lifeyrissjodur: {
      expectedMonthlyAmount: 300_000,
      startAge: 67,
    },
    sereign: {
      currentBalance: 5_000_000,
      monthlyContribution: 50_000,
      employeeContributionPercent: 0.04,
      employerMatchPercent: 0.02,
    },
    tr: {
      expectFullTR: true,
      manualOverrideAmount: null,
    },
    savedScenarios: [],
    lastUpdated: new Date(),
    version: 1,
    ...overrides,
  };
}

describe('projectSavingsToRetirement', () => {
  it('returns current savings when already retired', () => {
    const result = projectSavingsToRetirement(10_000_000, 100_000, 0.05, 0);
    expect(result).toBe(10_000_000);
  });

  it('returns current savings when years is negative', () => {
    const result = projectSavingsToRetirement(10_000_000, 100_000, 0.05, -5);
    expect(result).toBe(10_000_000);
  });

  it('calculates simple growth without return rate', () => {
    const result = projectSavingsToRetirement(0, 100_000, 0, 10);
    // 100,000 * 12 months * 10 years = 12,000,000
    expect(result).toBe(12_000_000);
  });

  it('calculates lump sum growth correctly', () => {
    // 10M at 5% annual (monthly compounding) for 10 years
    // = 10M * (1 + 0.05/12)^120 ≈ 16.47M
    const result = projectSavingsToRetirement(10_000_000, 0, 0.05, 10);
    expect(result).toBeCloseTo(16_470_095, -2); // Within hundreds
  });

  it('calculates combined lump sum and contributions', () => {
    const result = projectSavingsToRetirement(20_000_000, 250_000, 0.05, 10);
    // Should be greater than simple sum
    expect(result).toBeGreaterThan(20_000_000 + 250_000 * 12 * 10);
  });
});

describe('calculateExpenseReductionNeeded', () => {
  it('returns zero reduction when no shortfall', () => {
    const result = calculateExpenseReductionNeeded(0, 5, 400_000);
    expect(result.monthlyAmount).toBe(0);
    expect(result.percentReduction).toBe(0);
    expect(result.newMonthlyExpenses).toBe(400_000);
  });

  it('returns zero reduction when no gap years', () => {
    const result = calculateExpenseReductionNeeded(1_000_000, 0, 400_000);
    expect(result.monthlyAmount).toBe(0);
  });

  it('calculates correct reduction for shortfall', () => {
    // 12M shortfall over 5 years = 12M / (5*12) = 200,000/month
    const result = calculateExpenseReductionNeeded(12_000_000, 5, 400_000);
    expect(result.monthlyAmount).toBe(200_000);
    expect(result.percentReduction).toBe(50);
    expect(result.newMonthlyExpenses).toBe(200_000);
  });
});

describe('calculateAdditionalSavingsNeeded', () => {
  it('returns zero when no shortfall', () => {
    const result = calculateAdditionalSavingsNeeded(0, 0.05, 10, 100_000);
    expect(result.monthlyAmount).toBe(0);
    expect(result.percentIncrease).toBe(0);
    expect(result.newMonthlySavings).toBe(100_000);
  });

  it('returns zero when already retired', () => {
    const result = calculateAdditionalSavingsNeeded(1_000_000, 0.05, 0, 100_000);
    expect(result.monthlyAmount).toBe(0);
  });

  it('calculates simple additional savings without return', () => {
    // 12M shortfall over 10 years = 12M / (10*12) = 100,000/month
    const result = calculateAdditionalSavingsNeeded(12_000_000, 0, 10, 150_000);
    expect(result.monthlyAmount).toBe(100_000);
    expect(result.newMonthlySavings).toBe(250_000);
  });

  it('calculates less with compound growth', () => {
    // With 5% return, need less monthly since it grows
    const result = calculateAdditionalSavingsNeeded(12_000_000, 0.05, 10, 150_000);
    expect(result.monthlyAmount).toBeLessThan(100_000);
    expect(result.monthlyAmount).toBeGreaterThan(0);
  });
});

describe('calculateGoalGapAnalysis', () => {
  it('returns null when already retired', () => {
    const state = createTestState({ currentAge: 60, targetRetirementAge: 55 });
    const result = calculateGoalGapAnalysis(state);
    expect(result).toBeNull();
  });

  it('returns null when monthly savings is negative', () => {
    const state = createTestState({ monthlySavings: -50_000 });
    const result = calculateGoalGapAnalysis(state);
    expect(result).toBeNull();
  });

  it('calculates years to retirement correctly', () => {
    const state = createTestState({ currentAge: 45, targetRetirementAge: 55 });
    const result = calculateGoalGapAnalysis(state);
    expect(result).not.toBeNull();
    expect(result!.yearsToRetirement).toBe(10);
  });

  it('identifies on-track scenario', () => {
    // High savings rate should be on track
    const state = createTestState({
      currentSavings: 30_000_000,
      monthlySavings: 500_000,
      monthlyExpenses: 300_000,
    });
    const result = calculateGoalGapAnalysis(state);
    expect(result).not.toBeNull();
    expect(result!.projection.isOnTrack).toBe(true);
    expect(result!.projection.surplus).toBeGreaterThan(0);
    expect(result!.projection.shortfall).toBe(0);
    expect(result!.recommendations).toBeNull();
  });

  it('identifies shortfall scenario and provides recommendations', () => {
    // Low savings rate with high expenses should have shortfall
    const state = createTestState({
      currentSavings: 5_000_000,
      monthlySavings: 100_000,
      monthlyExpenses: 500_000,
    });
    const result = calculateGoalGapAnalysis(state);
    expect(result).not.toBeNull();
    expect(result!.projection.isOnTrack).toBe(false);
    expect(result!.projection.shortfall).toBeGreaterThan(0);
    expect(result!.projection.surplus).toBe(0);
    expect(result!.recommendations).not.toBeNull();
    expect(result!.recommendations!.expenseReduction.monthlyAmount).toBeGreaterThan(0);
    expect(result!.recommendations!.additionalSavings.monthlyAmount).toBeGreaterThan(0);
    expect(result!.recommendations!.lumpSum.amountNeeded).toBe(result!.projection.shortfall);
  });

  it('handles zero current savings', () => {
    const state = createTestState({
      currentSavings: 0,
      monthlySavings: 200_000,
    });
    const result = calculateGoalGapAnalysis(state);
    expect(result).not.toBeNull();
    expect(result!.projection.projectedAtRetirement).toBeGreaterThan(0);
  });
});
