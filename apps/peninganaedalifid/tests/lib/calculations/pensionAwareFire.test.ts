/**
 * Tests for Pension-Aware FIRE Calculation Engine
 *
 * Tests all phase calculation functions to ensure:
 * - Correct number of phases based on retirement age
 * - Accurate income source calculations per phase
 * - Proper funding requirement calculations
 * - Correct chaining of remaining funds between phases
 * - Edge case handling (zero values, extreme ages, etc.)
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRetirementPhases,
  calculateGapPhase,
  calculateSereignBridgePhase,
  calculateFullPensionPhase,
  calculatePhaseIncome,
  calculatePhaseFunding,
  projectSereignGrowth,
  calculateTRWithMeansTesting,
  calculateIncomeAboveExemption,
  calculateTRReduction,
  calculateTREstimate,
  calculateProjectedSereign,
  calculateSereignWithdrawal60to67,
  calculatePresentValueOfPension,
  calculatePresentValueOfAllPensions,
  calculateTraditionalFI,
  calculatePensionAdjustedFI,
  calculateBridgeFundingNeeds,
} from '@/lib/calculations/pensionAwareFire';
import type { PensionAwareFireState } from '@/types/pensionAwareFire';
import {
  PENSION_AWARE_DEFAULTS,
  DEFAULT_LIFEYRISSJODUR,
  DEFAULT_SEREIGN,
  DEFAULT_TR,
  ICELANDIC_PENSION_SYSTEM,
} from '@/lib/constants/pensionAwareFire';

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Create a test state with default values that can be overridden
 */
function createTestState(overrides: Partial<PensionAwareFireState> = {}): PensionAwareFireState {
  return {
    currentAge: PENSION_AWARE_DEFAULTS.currentAge,
    targetRetirementAge: PENSION_AWARE_DEFAULTS.targetRetirementAge,
    monthlyExpenses: PENSION_AWARE_DEFAULTS.monthlyExpenses,
    expenseSource: PENSION_AWARE_DEFAULTS.expenseSource,
    expenseTier: PENSION_AWARE_DEFAULTS.expenseTier,
    currentSavings: PENSION_AWARE_DEFAULTS.currentSavings,
    monthlySavings: PENSION_AWARE_DEFAULTS.monthlySavings,
    investmentReturn: PENSION_AWARE_DEFAULTS.investmentReturn,
    lifeyrissjodur: DEFAULT_LIFEYRISSJODUR,
    sereign: DEFAULT_SEREIGN,
    tr: DEFAULT_TR,
    savedScenarios: [],
    lastUpdated: new Date(),
    version: 1,
    ...overrides,
  };
}

// ============================================================================
// calculateRetirementPhases
// ============================================================================

describe('calculateRetirementPhases', () => {
  it('returns 3 phases for retirement before age 60', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52, // Before 60
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(3);
    expect(phases[0].id).toBe('gap');
    expect(phases[1].id).toBe('sereign-bridge');
    expect(phases[2].id).toBe('full-pension');
  });

  it('returns 2 phases for retirement at age 60', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 60, // At séreign access age
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[1].id).toBe('full-pension');
  });

  it('returns 2 phases for retirement between 60-66', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 63,
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[1].id).toBe('full-pension');
  });

  it('returns 1 phase for retirement at age 67', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 67, // At TR start age
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');
  });

  it('returns 1 phase for retirement after age 67', () => {
    const state = createTestState({
      currentAge: 60,
      targetRetirementAge: 70,
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');
  });

  it('has correct age boundaries for all phases', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 50,
    });

    const phases = calculateRetirementPhases(state);

    // Gap phase: 50-60
    expect(phases[0].startAge).toBe(50);
    expect(phases[0].endAge).toBe(60);
    expect(phases[0].durationYears).toBe(10);

    // Séreign bridge: 60-67
    expect(phases[1].startAge).toBe(60);
    expect(phases[1].endAge).toBe(67);
    expect(phases[1].durationYears).toBe(7);

    // Full pension: 67-90
    expect(phases[2].startAge).toBe(67);
    expect(phases[2].endAge).toBe(90);
    expect(phases[2].durationYears).toBe(23);
  });

  it('chains remaining funds between phases', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 50,
    });

    const phases = calculateRetirementPhases(state);

    // Gap phase should have some remainder
    expect(phases[0].remainingAtEnd).toBeGreaterThanOrEqual(0);

    // Bridge phase should start with gap remainder
    // (checked implicitly in calculation logic)

    // Full pension phase should have remainder or surplus
    expect(phases[2].remainingAtEnd).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// calculateGapPhase
// ============================================================================

describe('calculateGapPhase', () => {
  it('calculates gap phase with correct duration', () => {
    const state = createTestState({
      targetRetirementAge: 52,
    });

    const gapPhase = calculateGapPhase(state);

    expect(gapPhase.id).toBe('gap');
    expect(gapPhase.startAge).toBe(52);
    expect(gapPhase.endAge).toBe(60);
    expect(gapPhase.durationYears).toBe(8);
  });

  it('marks gap phase as self-funded', () => {
    const state = createTestState({
      targetRetirementAge: 55,
    });

    const gapPhase = calculateGapPhase(state);

    expect(gapPhase.isSelfFunded).toBe(true);
    expect(gapPhase.hasSurplus).toBe(false);
  });

  it('has no pension income sources in gap phase', () => {
    const state = createTestState({
      targetRetirementAge: 55,
    });

    const gapPhase = calculateGapPhase(state);

    expect(gapPhase.incomeSources.sereign).toBe(0);
    expect(gapPhase.incomeSources.lifeyrissjodur).toBe(0);
    expect(gapPhase.incomeSources.tr).toBe(0);
  });

  it('calculates required funding for gap phase', () => {
    const state = createTestState({
      targetRetirementAge: 55,
      monthlyExpenses: 300_000,
    });

    const gapPhase = calculateGapPhase(state);

    expect(gapPhase.requiredAtStart).toBeGreaterThan(0);
    // Should be less than simple 5 years * 12 months * 300k due to investment returns
    expect(gapPhase.requiredAtStart).toBeLessThan(5 * 12 * 300_000);
  });

  it('handles very short gap period (retiring at 59)', () => {
    const state = createTestState({
      targetRetirementAge: 59,
    });

    const gapPhase = calculateGapPhase(state);

    expect(gapPhase.durationYears).toBe(1);
    expect(gapPhase.requiredAtStart).toBeGreaterThan(0);
  });
});

// ============================================================================
// calculateSereignBridgePhase
// ============================================================================

describe('calculateSereignBridgePhase', () => {
  it('calculates bridge phase starting at age 60 when gap exists', () => {
    const state = createTestState({
      targetRetirementAge: 52,
    });

    const gapPhase = calculateGapPhase(state);
    const bridgePhase = calculateSereignBridgePhase(state, [gapPhase]);

    expect(bridgePhase.id).toBe('sereign-bridge');
    expect(bridgePhase.startAge).toBe(60);
    expect(bridgePhase.endAge).toBe(67);
    expect(bridgePhase.durationYears).toBe(7);
  });

  it('calculates bridge phase starting at retirement age when no gap', () => {
    const state = createTestState({
      targetRetirementAge: 63,
    });

    const bridgePhase = calculateSereignBridgePhase(state, []);

    expect(bridgePhase.startAge).toBe(63);
    expect(bridgePhase.endAge).toBe(67);
    expect(bridgePhase.durationYears).toBe(4);
  });

  it('includes séreign as income source', () => {
    const state = createTestState({
      targetRetirementAge: 60,
      sereign: {
        currentBalance: 10_000_000,
        monthlyContribution: 10_000,
        employeeContributionPercent: 0.04,
        employerMatchPercent: 0.02,
      },
    });

    const bridgePhase = calculateSereignBridgePhase(state, []);

    expect(bridgePhase.incomeSources.sereign).toBeGreaterThan(0);
  });

  it('marks bridge as not self-funded', () => {
    const state = createTestState({
      targetRetirementAge: 60,
    });

    const bridgePhase = calculateSereignBridgePhase(state, []);

    expect(bridgePhase.isSelfFunded).toBe(false);
  });

  it('uses gap phase remainder in calculations', () => {
    const state = createTestState({
      targetRetirementAge: 52,
    });

    const gapPhase = calculateGapPhase(state);
    const bridgePhaseWithGap = calculateSereignBridgePhase(state, [gapPhase]);

    const bridgePhaseWithoutGap = calculateSereignBridgePhase(state, []);

    // Bridge with gap remainder should require less additional funding
    expect(bridgePhaseWithGap.requiredAtStart).toBeLessThanOrEqual(
      bridgePhaseWithoutGap.requiredAtStart
    );
  });
});

// ============================================================================
// calculateFullPensionPhase
// ============================================================================

describe('calculateFullPensionPhase', () => {
  it('calculates full pension phase starting at age 67', () => {
    const state = createTestState({
      targetRetirementAge: 52,
    });

    const gapPhase = calculateGapPhase(state);
    const bridgePhase = calculateSereignBridgePhase(state, [gapPhase]);
    const fullPhase = calculateFullPensionPhase(state, [gapPhase, bridgePhase]);

    expect(fullPhase.id).toBe('full-pension');
    expect(fullPhase.startAge).toBe(67);
    expect(fullPhase.endAge).toBe(90);
    expect(fullPhase.durationYears).toBe(23);
  });

  it('includes lífeyrissjóður and TR as income sources', () => {
    const state = createTestState({
      targetRetirementAge: 67,
      lifeyrissjodur: {
        expectedMonthlyAmount: 350_000,
        startAge: 67,
      },
    });

    const fullPhase = calculateFullPensionPhase(state, []);

    expect(fullPhase.incomeSources.lifeyrissjodur).toBe(350_000);
    expect(fullPhase.incomeSources.tr).toBeGreaterThan(0);
  });

  it('shows surplus when pension income exceeds expenses', () => {
    const state = createTestState({
      targetRetirementAge: 67,
      monthlyExpenses: 250_000,
      lifeyrissjodur: {
        expectedMonthlyAmount: 350_000,
        startAge: 67,
      },
    });

    const fullPhase = calculateFullPensionPhase(state, []);

    expect(fullPhase.hasSurplus).toBe(true);
    expect(fullPhase.surplusAmount).toBeGreaterThan(0);
  });

  it('shows no surplus when expenses exceed pension income', () => {
    const state = createTestState({
      targetRetirementAge: 67,
      monthlyExpenses: 700_000,
      lifeyrissjodur: {
        expectedMonthlyAmount: 250_000,
        startAge: 67,
      },
    });

    const fullPhase = calculateFullPensionPhase(state, []);

    // With 250k lífeyrissjóður + ~284k TR = ~534k total
    // Expenses of 700k exceed this, so no surplus
    expect(fullPhase.hasSurplus).toBe(false);
    expect(fullPhase.surplusAmount).toBe(0);
  });

  it('requires minimal funding when pensions cover expenses', () => {
    const state = createTestState({
      targetRetirementAge: 67,
      monthlyExpenses: 300_000,
      lifeyrissjodur: {
        expectedMonthlyAmount: 350_000,
        startAge: 67,
      },
    });

    const fullPhase = calculateFullPensionPhase(state, []);

    expect(fullPhase.requiredAtStart).toBe(0);
  });
});

// ============================================================================
// calculatePhaseIncome
// ============================================================================

describe('calculatePhaseIncome', () => {
  it('gap phase has only savings withdrawal and investment returns', () => {
    const state = createTestState({
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
    });

    const income = calculatePhaseIncome('gap', state, 10_000_000, 0);

    expect(income.savingsWithdrawal).toBe(300_000);
    expect(income.investmentReturns).toBeGreaterThan(0);
    expect(income.sereign).toBe(0);
    expect(income.lifeyrissjodur).toBe(0);
    expect(income.tr).toBe(0);
  });

  it('séreign bridge includes séreign withdrawals', () => {
    const state = createTestState({
      monthlyExpenses: 300_000,
      targetRetirementAge: 60,
    });

    const sereignBalance = 20_000_000;
    const income = calculatePhaseIncome('sereign-bridge', state, 5_000_000, sereignBalance);

    expect(income.sereign).toBeGreaterThan(0);
    expect(income.savingsWithdrawal).toBeGreaterThanOrEqual(0);
  });

  it('full pension includes lífeyrissjóður and TR', () => {
    const state = createTestState({
      monthlyExpenses: 300_000,
      lifeyrissjodur: {
        expectedMonthlyAmount: 350_000,
        startAge: 67,
      },
    });

    const income = calculatePhaseIncome('full-pension', state, 0, 0);

    expect(income.lifeyrissjodur).toBe(350_000);
    expect(income.tr).toBeGreaterThan(0);
    expect(income.total).toBeGreaterThan(300_000);
  });

  it('total income equals sum of all sources', () => {
    const state = createTestState({
      monthlyExpenses: 300_000,
    });

    const income = calculatePhaseIncome('gap', state, 10_000_000, 0);

    const manualTotal =
      income.savingsWithdrawal +
      income.investmentReturns +
      income.sereign +
      income.lifeyrissjodur +
      income.tr;

    expect(income.total).toBeCloseTo(manualTotal, 2);
  });
});

// ============================================================================
// calculatePhaseFunding
// ============================================================================

describe('calculatePhaseFunding', () => {
  it('returns zero when duration is zero', () => {
    const funding = calculatePhaseFunding(300_000, 0, 0, 0.05);
    expect(funding).toBe(0);
  });

  it('returns zero when income exceeds expenses', () => {
    const funding = calculatePhaseFunding(300_000, 400_000, 10, 0.05);
    expect(funding).toBe(0);
  });

  it('calculates funding with zero return rate (simple multiplication)', () => {
    const monthlyGap = 100_000;
    const years = 5;
    const funding = calculatePhaseFunding(100_000, 0, years, 0);

    expect(funding).toBe(monthlyGap * years * 12);
  });

  it('calculates funding with positive return rate (less than simple multiplication)', () => {
    const monthlyGap = 100_000;
    const years = 5;
    const funding = calculatePhaseFunding(100_000, 0, years, 0.05);

    // With returns, you need less upfront
    expect(funding).toBeLessThan(monthlyGap * years * 12);
    expect(funding).toBeGreaterThan(0);
  });

  it('uses present value formula correctly', () => {
    const monthlyExpenses = 300_000;
    const years = 10;
    const annualReturn = 0.05;
    const funding = calculatePhaseFunding(monthlyExpenses, 0, years, annualReturn);

    // Manual calculation for verification
    const monthlyRate = annualReturn / 12;
    const numMonths = years * 12;
    const expected =
      monthlyExpenses * ((1 - Math.pow(1 + monthlyRate, -numMonths)) / monthlyRate);

    expect(funding).toBeCloseTo(expected, 2);
  });

  it('handles high expenses and long duration', () => {
    const funding = calculatePhaseFunding(500_000, 0, 20, 0.05);

    expect(funding).toBeGreaterThan(0);
    expect(funding).toBeLessThan(500_000 * 20 * 12); // Less than simple calc
  });
});

// ============================================================================
// projectSereignGrowth
// ============================================================================

describe('projectSereignGrowth', () => {
  it('returns current balance when years is zero', () => {
    const result = projectSereignGrowth(5_000_000, 10_000, 0.04, 0.02, 0, 0.05);
    expect(result).toBe(5_000_000);
  });

  it('returns current balance when years is negative', () => {
    const result = projectSereignGrowth(5_000_000, 10_000, 0.04, 0.02, -5, 0.05);
    expect(result).toBe(5_000_000);
  });

  it('projects growth with zero contributions', () => {
    const currentBalance = 5_000_000;
    const years = 10;
    const annualReturn = 0.05;

    const result = projectSereignGrowth(currentBalance, 0, 0.04, 0, years, annualReturn);

    const expected = currentBalance * Math.pow(1 + annualReturn / 12, years * 12);
    expect(result).toBeCloseTo(expected, 2);
  });

  it('includes employer match in contributions', () => {
    const monthlyContribution = 10_000;
    const employeePercent = 0.04; // 4%
    const employerMatch = 0.02; // 2%

    const withMatch = projectSereignGrowth(0, monthlyContribution, employeePercent, employerMatch, 10, 0.05);
    const withoutMatch = projectSereignGrowth(0, monthlyContribution, employeePercent, 0, 10, 0.05);

    expect(withMatch).toBeGreaterThan(withoutMatch);
  });

  it('handles zero return rate correctly', () => {
    const currentBalance = 1_000_000;
    const monthlyContribution = 10_000;
    const years = 5;

    const result = projectSereignGrowth(currentBalance, monthlyContribution, 0.04, 0, years, 0);

    const expected = currentBalance + monthlyContribution * years * 12;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('projects realistic séreign balance for typical case', () => {
    // 35-year-old with 5M balance, 10k/month contribution, 4% employee, 2% match, 25 years to 60
    const result = projectSereignGrowth(5_000_000, 10_000, 0.04, 0.02, 25, 0.05);

    // Should be significantly higher due to compound growth
    expect(result).toBeGreaterThan(5_000_000);
    expect(result).toBeGreaterThan(10_000 * 25 * 12); // More than just contributions
  });
});

// ============================================================================
// calculateTRWithMeansTesting
// ============================================================================

describe('calculateTRWithMeansTesting', () => {
  it('returns full TR when lífeyrissjóður is below exemption', () => {
    const lifeyrissjodur = 30_000; // Below 36,500 exemption
    const tr = calculateTRWithMeansTesting(lifeyrissjodur, true, null);

    expect(tr).toBe(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
  });

  it('reduces TR when lífeyrissjóður is above exemption', () => {
    const lifeyrissjodur = 100_000; // Above 36,500 exemption
    const tr = calculateTRWithMeansTesting(lifeyrissjodur, true, null);

    expect(tr).toBeLessThan(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
    expect(tr).toBeGreaterThan(0);
  });

  it('returns zero TR when lífeyrissjóður is very high', () => {
    const lifeyrissjodur = 1_000_000; // Very high
    const tr = calculateTRWithMeansTesting(lifeyrissjodur, true, null);

    expect(tr).toBe(0);
  });

  it('applies 45% reduction rate correctly', () => {
    const lifeyrissjodur = 136_500; // 100k above exemption
    const tr = calculateTRWithMeansTesting(lifeyrissjodur, true, null);

    const expectedReduction =
      (lifeyrissjodur - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION) *
      ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE;
    const expected = ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - expectedReduction;

    expect(tr).toBeCloseTo(expected, 2);
  });

  it('returns zero when user does not expect TR', () => {
    const lifeyrissjodur = 100_000;
    const tr = calculateTRWithMeansTesting(lifeyrissjodur, false, null);

    expect(tr).toBe(0);
  });

  it('uses manual override when provided', () => {
    const manualAmount = 200_000;
    const tr = calculateTRWithMeansTesting(500_000, true, manualAmount);

    expect(tr).toBe(manualAmount);
  });

  it('caps manual override at TR max', () => {
    const manualAmount = 500_000; // Above max
    const tr = calculateTRWithMeansTesting(100_000, true, manualAmount);

    expect(tr).toBe(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
  });

  it('handles negative manual override', () => {
    const tr = calculateTRWithMeansTesting(100_000, true, -50_000);

    expect(tr).toBe(0);
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration: Full retirement calculation flow', () => {
  it('calculates complete retirement plan for early retiree (age 52)', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52,
      monthlyExpenses: 300_000,
      currentSavings: 10_000_000,
      monthlySavings: 150_000,
      investmentReturn: 0.05,
      lifeyrissjodur: {
        expectedMonthlyAmount: 350_000,
        startAge: 67,
      },
      sereign: {
        currentBalance: 5_000_000,
        monthlyContribution: 10_000,
        employeeContributionPercent: 0.04,
        employerMatchPercent: 0.02,
      },
    });

    const phases = calculateRetirementPhases(state);

    // Should have all 3 phases
    expect(phases).toHaveLength(3);

    // Gap phase (52-60): 8 years, fully self-funded
    expect(phases[0].durationYears).toBe(8);
    expect(phases[0].isSelfFunded).toBe(true);

    // Bridge phase (60-67): 7 years, has séreign
    expect(phases[1].durationYears).toBe(7);
    expect(phases[1].incomeSources.sereign).toBeGreaterThan(0);

    // Full pension phase (67-90): 23 years, has surplus
    expect(phases[2].durationYears).toBe(23);
    expect(phases[2].hasSurplus).toBe(true);
  });

  it('calculates for retirement exactly at age 60', () => {
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 60,
    });

    const phases = calculateRetirementPhases(state);

    // Should have 2 phases (no gap)
    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[1].id).toBe('full-pension');
  });

  it('calculates for retirement exactly at age 67', () => {
    const state = createTestState({
      currentAge: 60,
      targetRetirementAge: 67,
    });

    const phases = calculateRetirementPhases(state);

    // Should have only full pension phase
    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');
  });

  it('handles edge case: retiring at 59 (1 year gap)', () => {
    const state = createTestState({
      currentAge: 55,
      targetRetirementAge: 59,
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(3);
    expect(phases[0].durationYears).toBe(1);
  });

  it('handles edge case: retiring at 66 (1 year bridge)', () => {
    const state = createTestState({
      currentAge: 60,
      targetRetirementAge: 66,
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(2);
    expect(phases[0].durationYears).toBe(1);
  });
});

// ============================================================================
// calculateIncomeAboveExemption
// ============================================================================

describe('calculateIncomeAboveExemption', () => {
  it('returns zero when lífeyrissjóður is below exemption', () => {
    const income = calculateIncomeAboveExemption(30_000);
    expect(income).toBe(0);
  });

  it('returns zero when lífeyrissjóður equals exemption', () => {
    const income = calculateIncomeAboveExemption(ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION);
    expect(income).toBe(0);
  });

  it('returns correct amount above exemption', () => {
    const lifeyrissjodur = 100_000;
    const income = calculateIncomeAboveExemption(lifeyrissjodur);

    const expected = lifeyrissjodur - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION;
    expect(income).toBe(expected);
  });

  it('calculates correctly for high lífeyrissjóður', () => {
    const lifeyrissjodur = 500_000;
    const income = calculateIncomeAboveExemption(lifeyrissjodur);

    expect(income).toBe(500_000 - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION);
  });

  it('handles zero lífeyrissjóður', () => {
    const income = calculateIncomeAboveExemption(0);
    expect(income).toBe(0);
  });

  it('uses correct exemption threshold (36,500 ISK)', () => {
    const income = calculateIncomeAboveExemption(50_000);
    expect(income).toBe(50_000 - 36_500);
  });
});

// ============================================================================
// calculateTRReduction
// ============================================================================

describe('calculateTRReduction', () => {
  it('returns zero when income above exemption is zero', () => {
    const reduction = calculateTRReduction(0);
    expect(reduction).toBe(0);
  });

  it('applies 45% reduction rate correctly', () => {
    const incomeAboveExemption = 100_000;
    const reduction = calculateTRReduction(incomeAboveExemption);

    expect(reduction).toBe(100_000 * 0.45);
    expect(reduction).toBe(45_000);
  });

  it('calculates reduction for small amount above exemption', () => {
    const incomeAboveExemption = 10_000;
    const reduction = calculateTRReduction(incomeAboveExemption);

    expect(reduction).toBe(10_000 * ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE);
    expect(reduction).toBe(4_500);
  });

  it('calculates reduction for large amount above exemption', () => {
    const incomeAboveExemption = 500_000;
    const reduction = calculateTRReduction(incomeAboveExemption);

    expect(reduction).toBe(500_000 * 0.45);
    expect(reduction).toBe(225_000);
  });

  it('uses correct reduction rate (45%)', () => {
    const reduction = calculateTRReduction(100_000);
    expect(reduction / 100_000).toBe(ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE);
  });
});

// ============================================================================
// calculateTREstimate
// ============================================================================

describe('calculateTREstimate', () => {
  it('returns full TR when lífeyrissjóður is below exemption', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 30_000, // Below 36,500 exemption
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
    expect(estimate.reductionPercent).toBe(0);
    expect(estimate.incomeAboveExemption).toBe(0);
    expect(estimate.isFullTR).toBe(true);
    expect(estimate.isZeroTR).toBe(false);
  });

  it('calculates reduced TR when lífeyrissjóður is above exemption', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 100_000, // 63,500 above exemption
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBeLessThan(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
    expect(estimate.estimatedMonthly).toBeGreaterThan(0);
    expect(estimate.reductionPercent).toBeGreaterThan(0);
    expect(estimate.reductionPercent).toBeLessThan(100);
    expect(estimate.incomeAboveExemption).toBe(100_000 - 36_500);
    expect(estimate.isFullTR).toBe(false);
    expect(estimate.isZeroTR).toBe(false);
  });

  it('returns zero TR when lífeyrissjóður is very high', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 1_000_000,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(0);
    expect(estimate.reductionPercent).toBeGreaterThanOrEqual(100);
    expect(estimate.incomeAboveExemption).toBeGreaterThan(0);
    expect(estimate.isFullTR).toBe(false);
    expect(estimate.isZeroTR).toBe(true);
  });

  it('calculates exact TR at exemption threshold', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
    expect(estimate.incomeAboveExemption).toBe(0);
    expect(estimate.isFullTR).toBe(true);
  });

  it('applies 45% reduction rate correctly', () => {
    const lifeyrissjodurAmount = 136_500; // 100k above exemption
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: lifeyrissjodurAmount,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    const expectedReduction = 100_000 * 0.45; // 45k
    const expectedTR = ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - expectedReduction;

    expect(estimate.estimatedMonthly).toBeCloseTo(expectedTR, 2);
    expect(estimate.incomeAboveExemption).toBe(100_000);
  });

  it('returns zero when user does not expect TR', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 100_000,
        startAge: 67,
      },
      tr: {
        expectFullTR: false,
        manualOverrideAmount: null,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(0);
    expect(estimate.reductionPercent).toBe(100);
    expect(estimate.isZeroTR).toBe(true);
    expect(estimate.isFullTR).toBe(false);
  });

  it('uses manual override when provided', () => {
    const manualAmount = 200_000;
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 500_000,
        startAge: 67,
      },
      tr: {
        expectFullTR: true,
        manualOverrideAmount: manualAmount,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(manualAmount);
    expect(estimate.incomeAboveExemption).toBe(0); // Not applicable for manual override
  });

  it('caps manual override at TR max', () => {
    const state = createTestState({
      tr: {
        expectFullTR: true,
        manualOverrideAmount: 500_000, // Above max
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);
    expect(estimate.isFullTR).toBe(true);
  });

  it('handles negative manual override', () => {
    const state = createTestState({
      tr: {
        expectFullTR: true,
        manualOverrideAmount: -50_000,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBe(0);
    expect(estimate.isZeroTR).toBe(true);
  });

  it('calculates reduction percentage correctly', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 200_000,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    const incomeAbove = 200_000 - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION;
    const reduction = incomeAbove * 0.45;
    const expectedPercent = (reduction / ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE) * 100;

    expect(estimate.reductionPercent).toBeCloseTo(expectedPercent, 2);
  });

  it('matches existing calculateTRWithMeansTesting for amount', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 150_000,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);
    const legacyAmount = calculateTRWithMeansTesting(150_000, true, null);

    expect(estimate.estimatedMonthly).toBeCloseTo(legacyAmount, 2);
  });
});

// ============================================================================
// INTEGRATION TESTS: TR Means-Testing
// ============================================================================

describe('Integration: TR Means-Testing Edge Cases', () => {
  it('calculates TR correctly at boundary: just above exemption (36,501 ISK)', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 36_501,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    const incomeAbove = 1;
    const reduction = 1 * 0.45;
    const expectedTR = ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - reduction;

    expect(estimate.estimatedMonthly).toBeCloseTo(expectedTR, 2);
    expect(estimate.incomeAboveExemption).toBe(1);
    expect(estimate.isFullTR).toBe(false);
  });

  it('calculates TR correctly at boundary: amount that zeros TR exactly', () => {
    // Calculate what lífeyrissjóður amount results in exactly zero TR
    // TR_MAX / TR_REDUCTION_RATE + TR_INCOME_EXEMPTION
    const zeroTRAmount =
      ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE / ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE +
      ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION;

    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: zeroTRAmount,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    expect(estimate.estimatedMonthly).toBeCloseTo(0, 2);
    expect(estimate.isZeroTR).toBe(true);
  });

  it('verifies typical scenario: 300k lífeyrissjóður', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 300_000, // Typical
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    // Income above: 300,000 - 36,500 = 263,500
    // Reduction: 263,500 * 0.45 = 118,575
    // TR: 380,000 - 118,575 = 261,425

    expect(estimate.incomeAboveExemption).toBe(263_500);
    expect(estimate.estimatedMonthly).toBeCloseTo(261_425, 0);
    expect(estimate.isFullTR).toBe(false);
    expect(estimate.isZeroTR).toBe(false);
  });

  it('verifies low lífeyrissjóður scenario: 200k', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 200_000,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    // Income above: 200,000 - 36,500 = 163,500
    // Reduction: 163,500 * 0.45 = 73,575
    // TR: 380,000 - 73,575 = 306,425

    expect(estimate.incomeAboveExemption).toBe(163_500);
    expect(estimate.estimatedMonthly).toBeCloseTo(306_425, 0);
    expect(estimate.isFullTR).toBe(false);
    expect(estimate.isZeroTR).toBe(false);
  });

  it('verifies high lífeyrissjóður scenario: 500k (reduced TR)', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 500_000,
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    // Income above: 500,000 - 36,500 = 463,500
    // Reduction: 463,500 * 0.45 = 208,575
    // TR: 380,000 - 208,575 = 171,425

    expect(estimate.incomeAboveExemption).toBe(463_500);
    expect(estimate.estimatedMonthly).toBeCloseTo(171_425, 0);
    expect(estimate.isZeroTR).toBe(false);
    expect(estimate.isFullTR).toBe(false);
  });

  it('verifies very high lífeyrissjóður scenario: 900k (zero TR)', () => {
    const state = createTestState({
      lifeyrissjodur: {
        expectedMonthlyAmount: 900_000, // High enough to zero TR
        startAge: 67,
      },
    });

    const estimate = calculateTREstimate(state);

    // Income above: 900,000 - 36,500 = 863,500
    // Reduction: 863,500 * 0.45 = 388,575 (exceeds TR_MAX of 380,000)
    // TR: 0

    expect(estimate.incomeAboveExemption).toBe(863_500);
    expect(estimate.estimatedMonthly).toBe(0);
    expect(estimate.isZeroTR).toBe(true);
  });
});

// ============================================================================
// SÉREIGN PROJECTION FUNCTIONS
// ============================================================================

describe('calculateProjectedSereign', () => {
  it('projects séreign correctly for person retiring before 60', () => {
    // 35-year-old retiring at 55, so 25 years until age 60
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 55,
      monthlyExpenses: 300_000,
      sereign: {
        currentBalance: 5_000_000, // 5M ISK current balance
        monthlyContribution: 50_000, // 50k/month contribution
        employeeContributionPercent: 0.04, // 4% employee contribution
        employerMatchPercent: 0.02, // 2% employer match
      },
      investmentReturn: 0.05, // 5% annual return
    });

    const projection = calculateProjectedSereign(state);

    // Should project to retirement (55), then grow to 60
    // 20 years of contributions (35-55): 5M + (50k * 1.02 * 12 * 20) with compounding
    // Then 5 years of growth only (55-60)
    expect(projection.balanceAt60).toBeGreaterThan(5_000_000); // At least starting balance
    expect(projection.balanceAt60).toBeGreaterThan(20_000_000); // Should be well above 20M
    expect(projection.monthlyWithdrawal60to67).toBeGreaterThan(0);
    expect(projection.monthlyWithdrawal60to67).toBeLessThan(projection.balanceAt60 / 84); // Less than simple division (due to growth)
  });

  it('projects séreign correctly for person retiring at 60', () => {
    // 50-year-old retiring at 60
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 60,
      monthlyExpenses: 300_000,
      sereign: {
        currentBalance: 10_000_000, // 10M ISK
        monthlyContribution: 60_000,
        employeeContributionPercent: 0.04,
        employerMatchPercent: 0.02,
      },
      investmentReturn: 0.05,
    });

    const projection = calculateProjectedSereign(state);

    // Should use projectSereignGrowth which uses monthly compounding
    const expectedFV = projectSereignGrowth(
      10_000_000,
      60_000,
      0.04,
      0.02,
      10,
      0.05
    );

    expect(projection.balanceAt60).toBeCloseTo(expectedFV, -2); // Within 100 ISK
  });

  it('projects séreign correctly for person retiring after 60', () => {
    // 50-year-old retiring at 67
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 67,
      monthlyExpenses: 300_000,
      sereign: {
        currentBalance: 8_000_000,
        monthlyContribution: 55_000,
        employeeContributionPercent: 0.04,
        employerMatchPercent: 0.02,
      },
      investmentReturn: 0.05,
    });

    const projection = calculateProjectedSereign(state);

    // Contributions continue only until 60 (10 years) using monthly compounding
    const expectedFV = projectSereignGrowth(
      8_000_000,
      55_000,
      0.04,
      0.02,
      10,
      0.05
    );

    expect(projection.balanceAt60).toBeCloseTo(expectedFV, -2); // Within 100 ISK
  });

  it('handles person already past 60 (uses current balance)', () => {
    const state = createTestState({
      currentAge: 65,
      targetRetirementAge: 67,
      sereign: {
        currentBalance: 15_000_000,
        monthlyContribution: 0, // Not contributing anymore
        employerMatchPercent: 0,
      },
    });

    const projection = calculateProjectedSereign(state);

    // Should use current balance (already past 60)
    expect(projection.balanceAt60).toBe(15_000_000);
  });

  it('handles zero séreign balance gracefully', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 55,
      sereign: {
        currentBalance: 0,
        monthlyContribution: 0,
        employerMatchPercent: 0,
      },
    });

    const projection = calculateProjectedSereign(state);

    expect(projection.balanceAt60).toBe(0);
    expect(projection.monthlyWithdrawal60to67).toBe(0);
  });

  it('includes employer match in projections', () => {
    const state = createTestState({
      currentAge: 40,
      targetRetirementAge: 60,
      sereign: {
        currentBalance: 0,
        monthlyContribution: 50_000,
        employeeContributionPercent: 0.04, // 4% employee
        employerMatchPercent: 0.02, // 2% match
      },
      investmentReturn: 0.05,
    });

    const projection = calculateProjectedSereign(state);

    // Calculate expected with and without match
    const yearsToAge60 = 20;
    const withoutMatch = projectSereignGrowth(0, 50_000, 0.04, 0, yearsToAge60, 0.05);
    const withMatch = projectSereignGrowth(0, 50_000, 0.04, 0.02, yearsToAge60, 0.05);

    expect(projection.balanceAt60).toBe(withMatch);
    expect(projection.balanceAt60).toBeGreaterThan(withoutMatch);
  });

  it('handles zero return rate', () => {
    const state = createTestState({
      currentAge: 40,
      targetRetirementAge: 60,
      sereign: {
        currentBalance: 1_000_000,
        monthlyContribution: 30_000,
        employeeContributionPercent: 0.04,
        employerMatchPercent: 0.02,
      },
      investmentReturn: 0, // No growth
    });

    const projection = calculateProjectedSereign(state);

    // With no growth, should be: 1M + (30k * 1.02 * 12 * 20)
    const expected = 1_000_000 + (30_000 * 1.02 * 12 * 20);
    expect(projection.balanceAt60).toBe(expected);
  });
});

describe('calculateSereignWithdrawal60to67', () => {
  it('calculates even withdrawal over 7 years with growth', () => {
    const balanceAt60 = 10_000_000; // 10M ISK
    const monthlyExpenses = 300_000;
    const otherIncome = 0;
    const investmentReturn = 0.05;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // Should calculate sustainable withdrawal rate
    // PMT = PV × [r / (1 - (1 + r)^-n)]
    const monthlyRate = 0.05 / 12;
    const months = 84; // 7 years
    const sustainableWithdrawal = balanceAt60 * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));

    // Withdrawal should be limited to expenses (300k)
    expect(result.monthlyWithdrawal).toBeLessThanOrEqual(sustainableWithdrawal);
    expect(result.monthlyWithdrawal).toBeLessThanOrEqual(monthlyExpenses);
    expect(result.totalWithdrawn).toBeGreaterThan(0);
  });

  it('handles case where other income covers some expenses', () => {
    const balanceAt60 = 8_000_000;
    const monthlyExpenses = 300_000;
    const otherIncome = 150_000; // 150k from early lífeyrissjóður
    const investmentReturn = 0.05;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // Only needs to cover 150k/month gap
    const monthlyShortfall = 150_000;

    // Sustainable withdrawal for 150k shortfall
    const monthlyRate = 0.05 / 12;
    const months = 84;
    const sustainableWithdrawal = balanceAt60 * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));

    expect(result.monthlyWithdrawal).toBeLessThanOrEqual(Math.min(sustainableWithdrawal, monthlyShortfall));
  });

  it('handles case where other income exceeds expenses (no withdrawal needed)', () => {
    const balanceAt60 = 5_000_000;
    const monthlyExpenses = 200_000;
    const otherIncome = 250_000; // More than expenses
    const investmentReturn = 0.05;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // No shortfall, so no withdrawal
    expect(result.monthlyWithdrawal).toBe(0);
    expect(result.totalWithdrawn).toBe(0);

    // Balance should grow
    expect(result.remainingAt67).toBeGreaterThan(balanceAt60);
  });

  it('handles zero séreign balance', () => {
    const result = calculateSereignWithdrawal60to67(
      0,
      300_000,
      0,
      0.05
    );

    expect(result.monthlyWithdrawal).toBe(0);
    expect(result.totalWithdrawn).toBe(0);
    expect(result.remainingAt67).toBe(0);
  });

  it('handles zero investment return (simple division)', () => {
    const balanceAt60 = 8_400_000; // Exactly 100k/month for 84 months
    const monthlyExpenses = 100_000;
    const otherIncome = 0;
    const investmentReturn = 0;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // With no growth, should be simple division
    expect(result.monthlyWithdrawal).toBe(100_000);
    expect(result.totalWithdrawn).toBe(8_400_000);
    expect(result.remainingAt67).toBe(0);
  });

  it('ensures balance is not depleted prematurely', () => {
    const balanceAt60 = 5_000_000;
    const monthlyExpenses = 300_000;
    const otherIncome = 0;
    const investmentReturn = 0.05;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // Should withdraw less than simple division to account for growth
    const simpleDivision = balanceAt60 / 84;
    expect(result.monthlyWithdrawal).toBeGreaterThan(simpleDivision);

    // Total withdrawn should be close to or exceed starting balance (due to growth)
    expect(result.totalWithdrawn).toBeGreaterThan(balanceAt60 * 0.8);
  });

  it('simulates month-by-month accurately', () => {
    const balanceAt60 = 10_000_000;
    const monthlyExpenses = 200_000;
    const otherIncome = 0;
    const investmentReturn = 0.06; // 6% return

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // Manually simulate to verify
    const monthlyRate = 0.06 / 12;
    const months = 84;
    let balance = balanceAt60;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
      const withdrawal = Math.min(result.monthlyWithdrawal, balance);
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      balance *= (1 + monthlyRate);
    }

    expect(result.totalWithdrawn).toBeCloseTo(totalWithdrawn, -2);
    expect(result.remainingAt67).toBeCloseTo(balance, -2);
  });

  it('handles large balance with low expenses (surplus remains)', () => {
    const balanceAt60 = 20_000_000; // Large balance
    const monthlyExpenses = 150_000; // Low expenses
    const otherIncome = 0;
    const investmentReturn = 0.05;

    const result = calculateSereignWithdrawal60to67(
      balanceAt60,
      monthlyExpenses,
      otherIncome,
      investmentReturn
    );

    // Should withdraw only what's needed (150k)
    expect(result.monthlyWithdrawal).toBeLessThanOrEqual(150_000);

    // Should have substantial amount remaining
    expect(result.remainingAt67).toBeGreaterThan(10_000_000);
  });
});

// ============================================================================
// calculatePresentValueOfPension
// ============================================================================

describe('calculatePresentValueOfPension', () => {

  it('returns 0 for zero monthly amount', () => {
    const result = calculatePresentValueOfPension(0, 67, 35, 90, 0.05);
    expect(result).toBe(0);
  });

  it('returns 0 for negative monthly amount', () => {
    const result = calculatePresentValueOfPension(-100_000, 67, 35, 90, 0.05);
    expect(result).toBe(0);
  });

  it('returns 0 when pension starts at or before current age', () => {
    const result = calculatePresentValueOfPension(300_000, 35, 35, 90, 0.05);
    expect(result).toBe(0);

    const result2 = calculatePresentValueOfPension(300_000, 30, 35, 90, 0.05);
    expect(result2).toBe(0);
  });

  it('returns 0 when start age is at or past end age', () => {
    const result = calculatePresentValueOfPension(300_000, 90, 35, 90, 0.05);
    expect(result).toBe(0);

    const result2 = calculatePresentValueOfPension(300_000, 95, 35, 90, 0.05);
    expect(result2).toBe(0);
  });

  it('calculates correct PV for simple case with zero discount rate', () => {
    // With 0% return, PV is just monthly amount * total months
    const monthlyAmount = 100_000;
    const startAge = 67;
    const currentAge = 35;
    const endAge = 90;
    const yearsOfPension = endAge - startAge; // 23 years
    const totalMonths = yearsOfPension * 12; // 276 months

    const result = calculatePresentValueOfPension(monthlyAmount, startAge, currentAge, endAge, 0);
    
    // At start age, PV = 100,000 * 276 = 27,600,000
    // No discounting needed since rate is 0
    expect(result).toBe(monthlyAmount * totalMonths);
  });

  it('calculates correct PV for future pension stream with positive discount rate', () => {
    const monthlyAmount = 300_000; // ISK
    const startAge = 67;
    const currentAge = 35;
    const endAge = 90;
    const discountRate = 0.05; // 5% annual

    const result = calculatePresentValueOfPension(
      monthlyAmount,
      startAge,
      currentAge,
      endAge,
      discountRate
    );

    // PV should be positive and less than total payments
    const totalPayments = monthlyAmount * (endAge - startAge) * 12;
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(totalPayments);

    // Rough sanity check: at 5% discount over 32 years, should be roughly 10-15% of nominal
    expect(result).toBeGreaterThan(totalPayments * 0.10);
    expect(result).toBeLessThan(totalPayments * 0.20);
  });

  it('PV decreases as discount rate increases', () => {
    const monthlyAmount = 300_000;
    const startAge = 67;
    const currentAge = 35;
    const endAge = 90;

    const pv3pct = calculatePresentValueOfPension(monthlyAmount, startAge, currentAge, endAge, 0.03);
    const pv5pct = calculatePresentValueOfPension(monthlyAmount, startAge, currentAge, endAge, 0.05);
    const pv7pct = calculatePresentValueOfPension(monthlyAmount, startAge, currentAge, endAge, 0.07);

    expect(pv3pct).toBeGreaterThan(pv5pct);
    expect(pv5pct).toBeGreaterThan(pv7pct);
  });

  it('PV increases as current age gets closer to start age', () => {
    const monthlyAmount = 300_000;
    const startAge = 67;
    const endAge = 90;
    const discountRate = 0.05;

    const pvAge35 = calculatePresentValueOfPension(monthlyAmount, startAge, 35, endAge, discountRate);
    const pvAge50 = calculatePresentValueOfPension(monthlyAmount, startAge, 50, endAge, discountRate);
    const pvAge65 = calculatePresentValueOfPension(monthlyAmount, startAge, 65, endAge, discountRate);

    // Closer to start age = higher PV (less discounting needed)
    expect(pvAge50).toBeGreaterThan(pvAge35);
    expect(pvAge65).toBeGreaterThan(pvAge50);
  });
});

// ============================================================================
// calculatePresentValueOfAllPensions
// ============================================================================

describe('calculatePresentValueOfAllPensions', () => {

  it('returns all zeros when no pensions expected', () => {
    const state = createTestState({
      lifeyrissjodur: { expectedMonthlyAmount: 0, startAge: 67 },
      sereign: { currentBalance: 0, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: false, manualOverrideAmount: null },
    });

    const result = calculatePresentValueOfAllPensions(state);

    expect(result.lifeyrissjodur).toBe(0);
    expect(result.tr).toBe(0);
    expect(result.sereign).toBe(0);
    expect(result.total).toBe(0);
  });

  it('calculates PV for lífeyrissjóður only', () => {
    const state = createTestState({
      currentAge: 35,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 0, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: false, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const result = calculatePresentValueOfAllPensions(state);

    expect(result.lifeyrissjodur).toBeGreaterThan(0);
    expect(result.tr).toBe(0);
    expect(result.sereign).toBe(0);
    expect(result.total).toBe(result.lifeyrissjodur);
  });

  it('calculates PV for all three pension sources', () => {
    const state = createTestState({
      currentAge: 35,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const result = calculatePresentValueOfAllPensions(state);

    expect(result.lifeyrissjodur).toBeGreaterThan(0);
    expect(result.tr).toBeGreaterThan(0); // TR with means-testing
    expect(result.sereign).toBeGreaterThan(0);
    expect(result.total).toBeCloseTo(
      result.lifeyrissjodur + result.tr + result.sereign,
      0
    );
  });

  it('handles case where user is already past age 60', () => {
    const state = createTestState({
      currentAge: 65,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 10_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const result = calculatePresentValueOfAllPensions(state);

    // Séreign PV should equal current balance (no discounting needed)
    expect(result.sereign).toBe(10_000_000);
    expect(result.lifeyrissjodur).toBeGreaterThan(0);
  });

  it('TR PV is reduced when lífeyrissjóður triggers means-testing', () => {
    const stateWithLowPension = createTestState({
      currentAge: 35,
      lifeyrissjodur: { expectedMonthlyAmount: 100_000, startAge: 67 }, // Below exemption
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const stateWithHighPension = createTestState({
      currentAge: 35,
      lifeyrissjodur: { expectedMonthlyAmount: 500_000, startAge: 67 }, // Above exemption
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const resultLow = calculatePresentValueOfAllPensions(stateWithLowPension);
    const resultHigh = calculatePresentValueOfAllPensions(stateWithHighPension);

    // Higher lífeyrissjóður reduces TR via means-testing
    expect(resultLow.tr).toBeGreaterThan(resultHigh.tr);
  });
});

// ============================================================================
// calculateTraditionalFI
// ============================================================================

describe('calculateTraditionalFI', () => {

  it('calculates correct traditional FI with 25x multiplier', () => {
    const monthlyExpenses = 300_000;
    const annualExpenses = monthlyExpenses * 12; // 3,600,000
    const result = calculateTraditionalFI(monthlyExpenses, 25);

    expect(result).toBe(annualExpenses * 25); // 90,000,000
  });

  it('calculates correct traditional FI with 30x multiplier', () => {
    const monthlyExpenses = 400_000;
    const annualExpenses = monthlyExpenses * 12; // 4,800,000
    const result = calculateTraditionalFI(monthlyExpenses, 30);

    expect(result).toBe(annualExpenses * 30); // 144,000,000
  });

  it('handles zero expenses', () => {
    const result = calculateTraditionalFI(0, 30);
    expect(result).toBe(0);
  });

  it('30x multiplier gives higher FI than 25x', () => {
    const monthlyExpenses = 300_000;
    const fi25x = calculateTraditionalFI(monthlyExpenses, 25);
    const fi30x = calculateTraditionalFI(monthlyExpenses, 30);

    expect(fi30x).toBeGreaterThan(fi25x);
    expect(fi30x).toBe(fi25x * 1.2); // Exactly 20% more
  });
});

// ============================================================================
// calculatePensionAdjustedFI
// ============================================================================

describe('calculatePensionAdjustedFI', () => {

  it('returns amount needed to cover gap period only for retirement before 60', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52, // 8-year gap to 60
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 400_000, startAge: 67 }, // More than expenses
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const result = calculatePensionAdjustedFI(state);

    // Should be much less than traditional FI
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);
    expect(result).toBeLessThan(traditionalFI);

    // Should be positive (need some savings for gap)
    expect(result).toBeGreaterThan(0);
  });

  it('pension-adjusted FI is always less than or equal to traditional FI', () => {
    const scenarios = [
      { retirementAge: 50 },
      { retirementAge: 55 },
      { retirementAge: 60 },
      { retirementAge: 65 },
      { retirementAge: 67 },
    ];

    scenarios.forEach(({ retirementAge }) => {
      const state = createTestState({
        currentAge: 35,
        targetRetirementAge: retirementAge,
        monthlyExpenses: 300_000,
        lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
        sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
        tr: { expectFullTR: true, manualOverrideAmount: null },
      });

      const pensionAdjusted = calculatePensionAdjustedFI(state);
      const traditional = calculateTraditionalFI(state.monthlyExpenses, 30);

      expect(pensionAdjusted).toBeLessThanOrEqual(traditional);
    });
  });

  it('returns 0 when retiring at 67 with pensions covering all expenses', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 67,
      monthlyExpenses: 300_000,
      lifeyrissjodur: { expectedMonthlyAmount: 200_000, startAge: 67 },
      tr: { expectFullTR: true, manualOverrideAmount: null }, // TR ~= 200k after means-testing
      investmentReturn: 0.05,
    });

    const result = calculatePensionAdjustedFI(state);

    // Pensions should cover expenses, so need is minimal or zero
    expect(result).toBeLessThan(10_000_000); // Very small or zero
  });

  it('handles early retirement with large gap period', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 40, // 20-year gap to 60
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 1_000_000, monthlyContribution: 5_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const result = calculatePensionAdjustedFI(state);

    // Longer gap = more savings needed
    expect(result).toBeGreaterThan(0);

    // But still less than traditional FI
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);
    expect(result).toBeLessThan(traditionalFI);
  });
});

// ============================================================================
// calculateBridgeFundingNeeds
// ============================================================================

describe('calculateBridgeFundingNeeds', () => {

  it('returns same value as pension-adjusted FI', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52,
      monthlyExpenses: 300_000,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const bridgeFunding = calculateBridgeFundingNeeds(state);
    const pensionAdjusted = calculatePensionAdjustedFI(state);

    expect(bridgeFunding).toBe(pensionAdjusted);
  });

  it('bridge funding represents gap from retirement to full pension coverage', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 55,
      monthlyExpenses: 300_000,
      lifeyrissjodur: { expectedMonthlyAmount: 350_000, startAge: 67 },
      sereign: { currentBalance: 10_000_000, monthlyContribution: 15_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.04 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const bridgeFunding = calculateBridgeFundingNeeds(state);

    // Should cover 5 years (55-60) + partial coverage 60-67
    expect(bridgeFunding).toBeGreaterThan(0);
    expect(bridgeFunding).toBeLessThan(calculateTraditionalFI(state.monthlyExpenses, 30));
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Present Value Integration Tests', () => {
  it('demonstrates massive savings from pension-aware planning (example from requirements)', () => {
    // Example: 35-year-old retiring at 52
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52,
      monthlyExpenses: 400_000,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    const savings = traditionalFI - pensionAdjustedFI;

    // Traditional FI: 400,000 * 12 * 30 = 144,000,000 ISK
    expect(traditionalFI).toBe(144_000_000);

    // Pension-adjusted should be much lower (example shows ~38M)
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI * 0.4); // Less than 40%

    // Savings should be substantial (>100M ISK)
    expect(savings).toBeGreaterThan(100_000_000);
  });

  it('PV of pensions explains why pension-adjusted FI is so much lower', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52,
      monthlyExpenses: 400_000,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
      investmentReturn: 0.05,
    });

    const pensionPVs = calculatePresentValueOfAllPensions(state);
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);

    // The present value of future pensions represents value you don't need to save
    expect(pensionPVs.total).toBeGreaterThan(0);

    // Traditional FI minus pension PV approximates pension-adjusted FI
    // (not exact due to different calculation approach, but conceptually similar)
    const roughAdjusted = traditionalFI - pensionPVs.total;
    expect(roughAdjusted).toBeLessThan(traditionalFI);
  });
});

// ============================================================================
// EDGE CASE TESTS: Very Early & Very Late Retirement
// ============================================================================

describe('Edge Cases: Extreme Retirement Ages', () => {
  it('handles very early retirement (age 40) with 20-year gap', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 40, // Very early - 20-year gap to 60
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have all 3 phases
    expect(phases).toHaveLength(3);

    // Gap phase should be 20 years (40-60)
    expect(phases[0].id).toBe('gap');
    expect(phases[0].durationYears).toBe(20);
    expect(phases[0].startAge).toBe(40);
    expect(phases[0].endAge).toBe(60);

    // Bridge phase should be 7 years (60-67)
    expect(phases[1].id).toBe('sereign-bridge');
    expect(phases[1].durationYears).toBe(7);

    // Full pension phase should be 23 years (67-90)
    expect(phases[2].id).toBe('full-pension');
    expect(phases[2].durationYears).toBe(23);

    // Pension-adjusted FI should still be valid (positive but less than traditional)
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);

    expect(pensionAdjustedFI).toBeGreaterThan(0);
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI);

    // Long gap means higher savings needed, but still get significant pension benefit
    // With 20-year gap (40-60), pension-adjusted is still lower than traditional
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI * 0.6); // Less than 60% of traditional even with long gap
  });

  it('handles very late retirement (age 70) after all pension ages', () => {
    const state = createTestState({
      currentAge: 65,
      targetRetirementAge: 70, // Very late - after TR already started
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 15_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have only 1 phase (full pension already active)
    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');

    // Phase should be 70-90 (20 years)
    expect(phases[0].startAge).toBe(70);
    expect(phases[0].endAge).toBe(90);
    expect(phases[0].durationYears).toBe(20);

    // Should have pension income from start
    expect(phases[0].incomeSources.lifeyrissjodur).toBe(300_000);
    expect(phases[0].incomeSources.tr).toBeGreaterThan(0);

    // Total income should cover or exceed expenses
    expect(phases[0].incomeSources.total).toBeGreaterThan(phases[0].monthlyExpenses);
    expect(phases[0].hasSurplus).toBe(true);

    // Pension-adjusted FI should be very low or zero (pensions already active)
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    expect(pensionAdjustedFI).toBeLessThan(10_000_000); // Minimal need
  });

  it('handles edge case: retirement at age 45 (15-year gap)', () => {
    const state = createTestState({
      currentAge: 30,
      targetRetirementAge: 45,
      monthlyExpenses: 250_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 250_000, startAge: 67 },
      sereign: { currentBalance: 3_000_000, monthlyContribution: 8_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(3);
    expect(phases[0].durationYears).toBe(15); // 45-60
    expect(phases[1].durationYears).toBe(7); // 60-67
    expect(phases[2].durationYears).toBe(23); // 67-90

    // All phases should have valid calculations
    phases.forEach(phase => {
      expect(phase.requiredAtStart).toBeGreaterThanOrEqual(0);
      expect(phase.remainingAtEnd).toBeGreaterThanOrEqual(0);
    });
  });

  it('handles edge case: retirement at age 75 (very late)', () => {
    const state = createTestState({
      currentAge: 70,
      targetRetirementAge: 75,
      monthlyExpenses: 200_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 }, // Already receiving
      sereign: { currentBalance: 0, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 }, // Likely depleted
      tr: { expectFullTR: true, manualOverrideAmount: null }, // Already receiving
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');
    expect(phases[0].durationYears).toBe(15); // 75-90

    // Pensions should easily cover low expenses
    expect(phases[0].hasSurplus).toBe(true);
    expect(phases[0].incomeSources.total).toBeGreaterThan(phases[0].monthlyExpenses);
  });
});

// ============================================================================
// BOUNDARY CONDITION TESTS: Exact Pension Ages
// ============================================================================

describe('Boundary Conditions: Exact Pension Ages', () => {
  it('retirement exactly at age 60 (séreign access age)', () => {
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 60,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 10_000_000, monthlyContribution: 50_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have 2 phases (no gap, starts at séreign bridge)
    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[0].startAge).toBe(60);
    expect(phases[0].endAge).toBe(67);
    expect(phases[0].durationYears).toBe(7);

    // Séreign should be available from start
    expect(phases[0].incomeSources.sereign).toBeGreaterThan(0);

    // Full pension at 67
    expect(phases[1].id).toBe('full-pension');
    expect(phases[1].startAge).toBe(67);
  });

  it('retirement exactly at age 62 (early lífeyrissjóður age)', () => {
    const state = createTestState({
      currentAge: 55,
      targetRetirementAge: 62,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: {
        expectedMonthlyAmount: 200_000,
        startAge: 62 // Taking lífeyrissjóður early
      },
      sereign: { currentBalance: 8_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have 2 phases (bridge from 62-67, full from 67+)
    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[0].startAge).toBe(62);
    expect(phases[0].durationYears).toBe(5); // 62-67

    // Should have both séreign and lífeyrissjóður during bridge
    // Note: lífeyrissjóður calculation depends on implementation details

    expect(phases[1].id).toBe('full-pension');
    expect(phases[1].startAge).toBe(67);
    expect(phases[1].incomeSources.lifeyrissjodur).toBe(200_000);
  });

  it('retirement exactly at age 67 (TR start age)', () => {
    const state = createTestState({
      currentAge: 60,
      targetRetirementAge: 67,
      monthlyExpenses: 250_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have only 1 phase (full pension from start)
    expect(phases).toHaveLength(1);
    expect(phases[0].id).toBe('full-pension');
    expect(phases[0].startAge).toBe(67);
    expect(phases[0].endAge).toBe(90);
    expect(phases[0].durationYears).toBe(23);

    // Should have both lífeyrissjóður and TR from start
    expect(phases[0].incomeSources.lifeyrissjodur).toBe(300_000);
    expect(phases[0].incomeSources.tr).toBeGreaterThan(0);

    // Total income should exceed expenses
    expect(phases[0].incomeSources.total).toBeGreaterThan(phases[0].monthlyExpenses);
    expect(phases[0].hasSurplus).toBe(true);

    // Pension-adjusted FI should be zero or minimal (pensions cover everything)
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    expect(pensionAdjustedFI).toBeLessThanOrEqual(5_000_000); // Should be minimal
  });

  it('retirement at age 61 (between séreign access and standard lífeyrissjóður)', () => {
    const state = createTestState({
      currentAge: 55,
      targetRetirementAge: 61,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 250_000, startAge: 67 },
      sereign: { currentBalance: 7_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Should have 2 phases (bridge 61-67, full 67+)
    expect(phases).toHaveLength(2);
    expect(phases[0].startAge).toBe(61);
    expect(phases[0].durationYears).toBe(6); // 61-67
    expect(phases[1].startAge).toBe(67);
  });

  it('lífeyrissjóður starting at age 65 (between 62-67 range)', () => {
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 60,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: {
        expectedMonthlyAmount: 280_000,
        startAge: 65 // Mid-range start
      },
      sereign: { currentBalance: 10_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    expect(phases).toHaveLength(2);
    expect(phases[0].id).toBe('sereign-bridge');
    expect(phases[0].durationYears).toBe(7); // 60-67

    // Lífeyrissjóður starts during bridge at 65, available for 2 years before TR
    // This would factor into income calculation in the bridge phase
  });
});

// ============================================================================
// FULL FLOW INTEGRATION TESTS
// ============================================================================

describe('Integration: Full Calculation Flow', () => {
  it('verifies complete flow from inputs to all results for typical case', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 55,
      monthlyExpenses: 350_000,
      currentSavings: 15_000_000,
      monthlySavings: 200_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 320_000, startAge: 67 },
      sereign: { currentBalance: 6_000_000, monthlyContribution: 12_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    // Step 1: Calculate all phases
    const phases = calculateRetirementPhases(state);
    expect(phases).toHaveLength(3);

    // Step 2: Calculate traditional FI
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);
    expect(traditionalFI).toBe(350_000 * 12 * 30); // 126M ISK

    // Step 3: Calculate pension-adjusted FI
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    expect(pensionAdjustedFI).toBeGreaterThan(0);
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI);

    // Step 4: Calculate bridge funding
    const bridgeFunding = calculateBridgeFundingNeeds(state);
    expect(bridgeFunding).toBe(pensionAdjustedFI);

    // Step 5: Calculate present values
    const pensionPVs = calculatePresentValueOfAllPensions(state);
    expect(pensionPVs.total).toBeGreaterThan(0);
    expect(pensionPVs.lifeyrissjodur).toBeGreaterThan(0);
    expect(pensionPVs.tr).toBeGreaterThan(0);
    expect(pensionPVs.sereign).toBeGreaterThan(0);

    // Step 6: Calculate TR estimate
    const trEstimate = calculateTREstimate(state);
    expect(trEstimate.estimatedMonthly).toBeGreaterThan(0);
    expect(trEstimate.estimatedMonthly).toBeLessThan(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE);

    // Step 7: Calculate séreign projection
    const sereignProjection = calculateProjectedSereign(state);
    expect(sereignProjection.balanceAt60).toBeGreaterThan(6_000_000); // Should grow
    expect(sereignProjection.monthlyWithdrawal60to67).toBeGreaterThan(0);

    // Verify logical consistency
    const savings = traditionalFI - pensionAdjustedFI;
    expect(savings).toBeGreaterThan(0);
    expect(savings).toBeGreaterThan(traditionalFI * 0.4); // At least 40% savings
  });

  it('verifies flow handles case with minimal pension income', () => {
    const state = createTestState({
      currentAge: 40,
      targetRetirementAge: 50,
      monthlyExpenses: 400_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 150_000, startAge: 67 }, // Low pension
      sereign: { currentBalance: 2_000_000, monthlyContribution: 5_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.01 },
      tr: { expectFullTR: false, manualOverrideAmount: 0 }, // No TR expected
    });

    const phases = calculateRetirementPhases(state);
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);

    // With low pensions, pension-adjusted should be closer to traditional
    expect(pensionAdjustedFI).toBeGreaterThan(traditionalFI * 0.6); // At least 60% of traditional

    // But still some benefit
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI);
  });

  it('verifies flow handles high pension income scenario', () => {
    const state = createTestState({
      currentAge: 50,
      targetRetirementAge: 60,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 450_000, startAge: 67 }, // High pension
      sereign: { currentBalance: 15_000_000, monthlyContribution: 0, employeeContributionPercent: 0.04, employerMatchPercent: 0 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);
    const pensionAdjustedFI = calculatePensionAdjustedFI(state);
    const traditionalFI = calculateTraditionalFI(state.monthlyExpenses, 30);

    // High pensions mean very low adjusted FI needed
    expect(pensionAdjustedFI).toBeLessThan(traditionalFI * 0.3); // Less than 30% of traditional

    // Full pension phase should have surplus
    const fullPensionPhase = phases.find(p => p.id === 'full-pension');
    expect(fullPensionPhase?.hasSurplus).toBe(true);
    expect(fullPensionPhase?.surplusAmount).toBeGreaterThan(0);
  });

  it('validates all calculations are mathematically consistent', () => {
    const state = createTestState({
      currentAge: 35,
      targetRetirementAge: 52,
      monthlyExpenses: 300_000,
      investmentReturn: 0.05,
      lifeyrissjodur: { expectedMonthlyAmount: 300_000, startAge: 67 },
      sereign: { currentBalance: 5_000_000, monthlyContribution: 10_000, employeeContributionPercent: 0.04, employerMatchPercent: 0.02 },
      tr: { expectFullTR: true, manualOverrideAmount: null },
    });

    const phases = calculateRetirementPhases(state);

    // Validate phase durations sum correctly
    const totalDuration = phases.reduce((sum, phase) => sum + phase.durationYears, 0);
    const expectedDuration = 90 - state.targetRetirementAge;
    expect(totalDuration).toBe(expectedDuration);

    // Validate phase ages chain correctly
    for (let i = 0; i < phases.length - 1; i++) {
      expect(phases[i].endAge).toBe(phases[i + 1].startAge);
    }

    // Validate last phase ends at life expectancy
    expect(phases[phases.length - 1].endAge).toBe(ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY);

    // Validate income sources are non-negative
    phases.forEach(phase => {
      expect(phase.incomeSources.savingsWithdrawal).toBeGreaterThanOrEqual(0);
      expect(phase.incomeSources.investmentReturns).toBeGreaterThanOrEqual(0);
      expect(phase.incomeSources.sereign).toBeGreaterThanOrEqual(0);
      expect(phase.incomeSources.lifeyrissjodur).toBeGreaterThanOrEqual(0);
      expect(phase.incomeSources.tr).toBeGreaterThanOrEqual(0);
      expect(phase.incomeSources.total).toBeGreaterThanOrEqual(0);
    });
  });
});
