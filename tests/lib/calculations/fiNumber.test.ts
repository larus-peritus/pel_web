/**
 * Unit tests for FI Number Builder calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFINumber,
  calculateWithdrawalRate,
  getMonthlyExpenses,
  calculatePensionAdjustedFI,
  calculateBridgeAmount,
  calculateFINumberLifeEnergy,
  calculateScenarioComparison,
  calculateFINumberResults,
} from '@/lib/calculations/fiNumber';
import type {
  FINumberBuilderState,
  ExpenseSource,
} from '@/types/fiNumber';
import type { ExpenseBaseline, ExpenseTier } from '@/types/expenseBaseline';

// ============================================================================
// calculateFINumber Tests
// ============================================================================

describe('calculateFINumber', () => {
  it('calculates basic FI number correctly', () => {
    // 500,000 ISK/month × 12 × 30 = 180,000,000 ISK
    expect(calculateFINumber(6_000_000, 30)).toBe(180_000_000);
  });

  it('handles different multipliers correctly', () => {
    const annualExpenses = 6_000_000; // 500k/month

    // 25x multiplier (4% rule)
    expect(calculateFINumber(annualExpenses, 25)).toBe(150_000_000);

    // 30x multiplier (3.33% rule, Iceland recommended)
    expect(calculateFINumber(annualExpenses, 30)).toBe(180_000_000);

    // 33x multiplier (3% rule, conservative)
    expect(calculateFINumber(annualExpenses, 33)).toBe(198_000_000);
  });

  it('handles custom multipliers', () => {
    const annualExpenses = 6_000_000;

    // Custom 40x (very conservative)
    expect(calculateFINumber(annualExpenses, 40)).toBe(240_000_000);

    // Custom 20x (aggressive)
    expect(calculateFINumber(annualExpenses, 20)).toBe(120_000_000);
  });

  it('handles zero expenses', () => {
    expect(calculateFINumber(0, 30)).toBe(0);
  });

  it('handles negative expenses', () => {
    expect(calculateFINumber(-1000, 30)).toBe(0);
  });

  it('handles zero multiplier', () => {
    expect(calculateFINumber(6_000_000, 0)).toBe(0);
  });

  it('handles negative multiplier', () => {
    expect(calculateFINumber(6_000_000, -10)).toBe(0);
  });
});

// ============================================================================
// calculateWithdrawalRate Tests
// ============================================================================

describe('calculateWithdrawalRate', () => {
  it('calculates 4% withdrawal rate for 25x', () => {
    expect(calculateWithdrawalRate(25)).toBeCloseTo(0.04, 4);
  });

  it('calculates 3.33% withdrawal rate for 30x', () => {
    expect(calculateWithdrawalRate(30)).toBeCloseTo(0.0333, 4);
  });

  it('calculates 3% withdrawal rate for 33x', () => {
    expect(calculateWithdrawalRate(33)).toBeCloseTo(0.0303, 4);
  });

  it('handles custom multipliers', () => {
    expect(calculateWithdrawalRate(50)).toBeCloseTo(0.02, 4);
    expect(calculateWithdrawalRate(20)).toBeCloseTo(0.05, 4);
  });

  it('handles zero multiplier', () => {
    expect(calculateWithdrawalRate(0)).toBe(0);
  });
});

// ============================================================================
// getMonthlyExpenses Tests
// ============================================================================

describe('getMonthlyExpenses', () => {
  const mockBaseline: ExpenseBaseline = {
    categories: [
      {
        id: 'housing',
        name: 'Húsnæði',
        icon: '🏠',
        values: { barebones: 150_000, comfortable: 300_000, deluxe: 600_000 },
        isCustom: false,
        isHidden: false,
        order: 0,
      },
      {
        id: 'food',
        name: 'Matur',
        icon: '🍽️',
        values: { barebones: 100_000, comfortable: 220_000, deluxe: 400_000 },
        isCustom: false,
        isHidden: false,
        order: 1,
      },
    ],
    lastUpdated: new Date(),
    wizardCompleted: true,
    version: 1,
  };

  it('returns custom expense when using custom source', () => {
    const result = getMonthlyExpenses(
      'custom',
      450_000,
      null,
      null
    );
    expect(result).toBe(450_000);
  });

  it('returns baseline expense for barebones tier', () => {
    const result = getMonthlyExpenses(
      'baseline',
      null,
      mockBaseline,
      'barebones'
    );
    expect(result).toBe(250_000);
  });

  it('returns baseline expense for comfortable tier', () => {
    const result = getMonthlyExpenses(
      'baseline',
      null,
      mockBaseline,
      'comfortable'
    );
    expect(result).toBe(520_000);
  });

  it('returns baseline expense for deluxe tier', () => {
    const result = getMonthlyExpenses(
      'baseline',
      null,
      mockBaseline,
      'deluxe'
    );
    expect(result).toBe(1_000_000);
  });

  it('returns 0 when baseline missing', () => {
    const result = getMonthlyExpenses(
      'baseline',
      null,
      null,
      'comfortable'
    );
    expect(result).toBe(0);
  });

  it('returns 0 when tier not selected', () => {
    const result = getMonthlyExpenses(
      'baseline',
      null,
      mockBaseline,
      null
    );
    expect(result).toBe(0);
  });

  it('returns 0 when custom expense is null', () => {
    const result = getMonthlyExpenses(
      'custom',
      null,
      null,
      null
    );
    expect(result).toBe(0);
  });
});

// ============================================================================
// calculatePensionAdjustedFI Tests
// ============================================================================

describe('calculatePensionAdjustedFI', () => {
  it('reduces FI number when pension covers expenses', () => {
    const annualExpenses = 6_000_000; // 500k/month
    const pensionMonthly = 200_000; // 200k/month pension
    const multiplier = 30;
    const retirementAge = 55;

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    // Pension covers 2.4M/year, so need FI for only 3.6M/year
    expect(result.pensionAnnualIncome).toBe(2_400_000);
    expect(result.reducedAnnualExpenses).toBe(3_600_000);
    expect(result.pensionAdjustedFI).toBe(108_000_000); // 3.6M × 30
  });

  it('calculates bridge amount for early retirement', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 200_000;
    const multiplier = 30;
    const retirementAge = 55;

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    // Bridge from 55 to 67 = 12 years
    expect(result.bridgeYears).toBe(12);
    // 12 years × 6M = 72M
    expect(result.bridgeAmount).toBe(72_000_000);
  });

  it('calculates total needed (bridge + pension-adjusted FI)', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 200_000;
    const multiplier = 30;
    const retirementAge = 55;

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    // Bridge (72M) + Pension-adjusted FI (108M) = 180M
    expect(result.totalNeeded).toBe(180_000_000);
  });

  it('handles no bridge when retiring at pension age', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 200_000;
    const multiplier = 30;
    const retirementAge = 67; // Same as pension age

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    expect(result.bridgeYears).toBe(0);
    expect(result.bridgeAmount).toBe(0);
    // Total = just pension-adjusted FI
    expect(result.totalNeeded).toBe(108_000_000);
  });

  it('handles no bridge when retiring after pension age', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 200_000;
    const multiplier = 30;
    const retirementAge = 70; // After pension age

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    expect(result.bridgeYears).toBe(0);
    expect(result.bridgeAmount).toBe(0);
  });

  it('handles pension covering all expenses', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 500_000; // Covers all 500k/month
    const multiplier = 30;
    const retirementAge = 67;

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    // Reduced expenses should be 0
    expect(result.reducedAnnualExpenses).toBe(0);
    expect(result.pensionAdjustedFI).toBe(0);
  });

  it('handles pension exceeding expenses', () => {
    const annualExpenses = 6_000_000;
    const pensionMonthly = 600_000; // More than 500k/month
    const multiplier = 30;
    const retirementAge = 67;

    const result = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      pensionMonthly,
      retirementAge
    );

    // Reduced expenses capped at 0 (not negative)
    expect(result.reducedAnnualExpenses).toBe(0);
    expect(result.pensionAdjustedFI).toBe(0);
  });
});

// ============================================================================
// calculateBridgeAmount Tests
// ============================================================================

describe('calculateBridgeAmount', () => {
  it('calculates bridge amount for early retirement', () => {
    const annualExpenses = 6_000_000;
    const retirementAge = 55;

    const bridge = calculateBridgeAmount(annualExpenses, retirementAge);

    // 67 - 55 = 12 years × 6M = 72M
    expect(bridge).toBe(72_000_000);
  });

  it('returns 0 when retiring at pension age', () => {
    const annualExpenses = 6_000_000;
    const retirementAge = 67;

    const bridge = calculateBridgeAmount(annualExpenses, retirementAge);

    expect(bridge).toBe(0);
  });

  it('returns 0 when retiring after pension age', () => {
    const annualExpenses = 6_000_000;
    const retirementAge = 70;

    const bridge = calculateBridgeAmount(annualExpenses, retirementAge);

    expect(bridge).toBe(0);
  });

  it('handles custom pension start age', () => {
    const annualExpenses = 6_000_000;
    const retirementAge = 60;
    const pensionAge = 70; // Different pension age

    const bridge = calculateBridgeAmount(annualExpenses, retirementAge, pensionAge);

    // 70 - 60 = 10 years × 6M = 60M
    expect(bridge).toBe(60_000_000);
  });
});

// ============================================================================
// calculateFINumberLifeEnergy Tests
// ============================================================================

describe('calculateFINumberLifeEnergy', () => {
  it('calculates years of work correctly', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = 5_000; // 5k ISK/hour
    const annualHours = 2080; // 40h/week × 52 weeks

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );

    // Annual income = 5000 × 2080 = 10,400,000
    expect(result.annualNetIncome).toBe(10_400_000);

    // Years = 180M / 10.4M ≈ 17.31
    expect(result.yearsOfWork).toBeCloseTo(17.31, 2);
  });

  it('calculates years to FI when savings provided', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = 5_000;
    const annualHours = 2080;
    const currentSavings = 50_000_000;
    const annualSavings = 5_000_000;

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours,
      currentSavings,
      annualSavings
    );

    // Remaining = 180M - 50M = 130M
    // Years to FI = 130M / 5M = 26 years
    expect(result.yearsToFI).toBe(26);
  });

  it('does not calculate years to FI when savings not provided', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = 5_000;
    const annualHours = 2080;

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );

    expect(result.yearsToFI).toBeUndefined();
  });

  it('handles zero savings rate', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = 5_000;
    const annualHours = 2080;
    const currentSavings = 50_000_000;
    const annualSavings = 0;

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours,
      currentSavings,
      annualSavings
    );

    expect(result.yearsToFI).toBeUndefined();
  });

  it('handles zero hourly wage', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = 0;
    const annualHours = 2080;

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );

    expect(result.yearsOfWork).toBe(0);
  });

  it('handles negative hourly wage', () => {
    const fiNumber = 180_000_000;
    const actualHourlyWage = -1000;
    const annualHours = 2080;

    const result = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );

    // Should handle gracefully (returns 0 or negative)
    expect(result.yearsOfWork).toBeLessThanOrEqual(0);
  });
});

// ============================================================================
// calculateScenarioComparison Tests
// ============================================================================

describe('calculateScenarioComparison', () => {
  const mockBaseline: ExpenseBaseline = {
    categories: [
      {
        id: 'housing',
        name: 'Húsnæði',
        icon: '🏠',
        values: { barebones: 150_000, comfortable: 300_000, deluxe: 600_000 },
        isCustom: false,
        isHidden: false,
        order: 0,
      },
      {
        id: 'food',
        name: 'Matur',
        icon: '🍽️',
        values: { barebones: 100_000, comfortable: 220_000, deluxe: 400_000 },
        isCustom: false,
        isHidden: false,
        order: 1,
      },
    ],
    lastUpdated: new Date(),
    wizardCompleted: true,
    version: 1,
  };

  it('compares all three tiers', () => {
    const multiplier = 30;
    const scenarios = calculateScenarioComparison(mockBaseline, multiplier, 'comfortable');

    // Barebones: 250k × 12 × 30 = 90M
    expect(scenarios.barebones.tier).toBe('barebones');
    expect(scenarios.barebones.monthlyExpenses).toBe(250_000);
    expect(scenarios.barebones.annualExpenses).toBe(3_000_000);
    expect(scenarios.barebones.fiNumber).toBe(90_000_000);

    // Comfortable: 520k × 12 × 30 = 187.2M
    expect(scenarios.comfortable.tier).toBe('comfortable');
    expect(scenarios.comfortable.monthlyExpenses).toBe(520_000);
    expect(scenarios.comfortable.annualExpenses).toBe(6_240_000);
    expect(scenarios.comfortable.fiNumber).toBe(187_200_000);

    // Deluxe: 1000k × 12 × 30 = 360M
    expect(scenarios.deluxe.tier).toBe('deluxe');
    expect(scenarios.deluxe.monthlyExpenses).toBe(1_000_000);
    expect(scenarios.deluxe.annualExpenses).toBe(12_000_000);
    expect(scenarios.deluxe.fiNumber).toBe(360_000_000);
  });

  it('calculates differences from selected tier', () => {
    const multiplier = 30;
    const scenarios = calculateScenarioComparison(mockBaseline, multiplier, 'comfortable');

    // Selected tier has no difference
    expect(scenarios.comfortable.difference).toBeUndefined();

    // Barebones is less than comfortable
    expect(scenarios.barebones.difference?.isk).toBe(90_000_000 - 187_200_000);
    expect(scenarios.barebones.difference?.percentage).toBeCloseTo(-51.92, 1);

    // Deluxe is more than comfortable
    expect(scenarios.deluxe.difference?.isk).toBe(360_000_000 - 187_200_000);
    expect(scenarios.deluxe.difference?.percentage).toBeCloseTo(92.31, 1);
  });

  it('handles different multipliers', () => {
    const multiplier = 25;
    const scenarios = calculateScenarioComparison(mockBaseline, multiplier, 'comfortable');

    // Comfortable with 25x: 520k × 12 × 25 = 156M
    expect(scenarios.comfortable.fiNumber).toBe(156_000_000);
  });
});

// ============================================================================
// calculateFINumberResults Tests (Integration)
// ============================================================================

describe('calculateFINumberResults', () => {
  const mockBaseline: ExpenseBaseline = {
    categories: [
      {
        id: 'housing',
        name: 'Húsnæði',
        icon: '🏠',
        values: { barebones: 150_000, comfortable: 300_000, deluxe: 600_000 },
        isCustom: false,
        isHidden: false,
        order: 0,
      },
      {
        id: 'food',
        name: 'Matur',
        icon: '🍽️',
        values: { barebones: 100_000, comfortable: 220_000, deluxe: 400_000 },
        isCustom: false,
        isHidden: false,
        order: 1,
      },
    ],
    lastUpdated: new Date(),
    wizardCompleted: true,
    version: 1,
  };

  it('calculates complete results with custom expense', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'custom',
      selectedTier: null,
      customMonthlyExpense: 500_000,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, null, null, null);

    expect(results.monthlyExpenses).toBe(500_000);
    expect(results.annualExpenses).toBe(6_000_000);
    expect(results.multiplier).toBe(30);
    expect(results.withdrawalRate).toBeCloseTo(0.0333, 4);
    expect(results.fiNumber).toBe(180_000_000);
    expect(results.hasPension).toBe(false);
  });

  it('calculates complete results with baseline expense', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'baseline',
      selectedTier: 'comfortable',
      customMonthlyExpense: null,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, mockBaseline, null, null);

    expect(results.monthlyExpenses).toBe(520_000);
    expect(results.annualExpenses).toBe(6_240_000);
    expect(results.fiNumber).toBe(187_200_000);
  });

  it('includes pension adjustment when pension configured', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'custom',
      selectedTier: null,
      customMonthlyExpense: 500_000,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: 200_000,
      targetRetirementAge: 55,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, null, null, null);

    expect(results.hasPension).toBe(true);
    expect(results.pensionAdjusted).toBeDefined();
    expect(results.pensionAdjusted?.pensionAdjustedFI).toBe(108_000_000);
    expect(results.pensionAdjusted?.bridgeAmount).toBe(72_000_000);
    expect(results.pensionAdjusted?.totalNeeded).toBe(180_000_000);
  });

  it('includes life energy when AWH available', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'custom',
      selectedTier: null,
      customMonthlyExpense: 500_000,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, null, 5_000, 2080);

    expect(results.lifeEnergy).toBeDefined();
    expect(results.lifeEnergy?.annualNetIncome).toBe(10_400_000);
    expect(results.lifeEnergy?.yearsOfWork).toBeCloseTo(17.31, 2);
  });

  it('includes scenarios when using baseline', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'baseline',
      selectedTier: 'comfortable',
      customMonthlyExpense: null,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, mockBaseline, null, null);

    expect(results.scenarios).toBeDefined();
    expect(results.scenarios?.barebones.fiNumber).toBe(90_000_000);
    expect(results.scenarios?.comfortable.fiNumber).toBe(187_200_000);
    expect(results.scenarios?.deluxe.fiNumber).toBe(360_000_000);
  });

  it('does not include scenarios when using custom expense', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'custom',
      selectedTier: null,
      customMonthlyExpense: 500_000,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, mockBaseline, null, null);

    expect(results.scenarios).toBeUndefined();
  });

  it('handles missing expense baseline gracefully', () => {
    const state: FINumberBuilderState = {
      expenseSource: 'baseline',
      selectedTier: 'comfortable',
      customMonthlyExpense: null,
      multiplier: 30,
      customMultiplier: null,
      pensionMonthlyIncome: null,
      targetRetirementAge: null,
      lastUpdated: new Date(),
    };

    const results = calculateFINumberResults(state, null, null, null);

    // Should return 0 expenses when baseline missing
    expect(results.monthlyExpenses).toBe(0);
    expect(results.annualExpenses).toBe(0);
    expect(results.fiNumber).toBe(0);
  });
});
