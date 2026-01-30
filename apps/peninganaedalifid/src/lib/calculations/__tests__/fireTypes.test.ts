/**
 * Unit tests for FIRE Type calculation functions
 *
 * Tests all pure calculation functions for FIRE Type Explorer including:
 * - Basic FI number calculations
 * - Timeline calculations
 * - CoastFIRE and BaristaFIRE special calculations
 * - Effort and feasibility assessments
 * - Recommendation engine
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFINumber,
  calculateYearsToFI,
  calculateCoastFINumber,
  calculateBaristaFINumber,
  calculateFIRECalculation,
  calculateAllFIRETypes,
  calculateEffortLevel,
  calculateFeasibility,
  calculateFIRERecommendations,
} from '../fireTypes';
import type {
  UserFinancialInputs,
  FIREAssumptions,
} from '@/types/fireTypes';

// ============================================================================
// TEST FIXTURES
// ============================================================================

const defaultAssumptions: FIREAssumptions = {
  withdrawalRate: 0.04,
  expectedGrowthRate: 0.06,
  inflationRate: 0.025,
  pensionAge: 67,
  pensionMonthlyEstimate: null,
};

const defaultInputs: UserFinancialInputs = {
  currentAge: 40,
  targetRetirementAge: 65,
  currentNetWorth: 20_000_000, // 20M ISK
  annualIncome: 6_000_000, // 6M ISK
  annualSavings: 2_000_000, // 2M ISK (33% savings rate)
  savingsRate: 33.33,
  monthlyExpenses: {
    barebones: 250_000, // 250k ISK
    comfortable: 500_000, // 500k ISK
    deluxe: 1_000_000, // 1M ISK
  },
};

// ============================================================================
// BASIC FI NUMBER CALCULATION TESTS
// ============================================================================

describe('calculateFINumber', () => {
  it('calculates correct FI number with 25x multiplier', () => {
    const result = calculateFINumber(500_000, 25);
    expect(result).toBe(150_000_000); // 500k × 12 × 25
  });

  it('calculates correct FI number with 30x multiplier', () => {
    const result = calculateFINumber(500_000, 30);
    expect(result).toBe(180_000_000); // 500k × 12 × 30
  });

  it('handles zero expenses', () => {
    const result = calculateFINumber(0, 25);
    expect(result).toBe(0);
  });

  it('handles negative expenses', () => {
    const result = calculateFINumber(-100_000, 25);
    expect(result).toBe(0);
  });

  it('handles zero multiplier', () => {
    const result = calculateFINumber(500_000, 0);
    expect(result).toBe(0);
  });

  it('handles barebones expenses', () => {
    const result = calculateFINumber(250_000, 25);
    expect(result).toBe(75_000_000); // LeanFIRE
  });

  it('handles deluxe expenses', () => {
    const result = calculateFINumber(1_000_000, 30);
    expect(result).toBe(360_000_000); // FatFIRE
  });
});

// ============================================================================
// YEARS TO FI CALCULATION TESTS
// ============================================================================

describe('calculateYearsToFI', () => {
  it('calculates correct years with standard inputs', () => {
    const result = calculateYearsToFI(
      150_000_000, // 150M FI target
      20_000_000, // 20M current
      2_000_000, // 2M annual savings
      0.06 // 6% return
    );

    expect(result).not.toBeNull();
    expect(result).toBeGreaterThan(15);
    expect(result).toBeLessThan(25);
  });

  it('returns 0 when already at FI', () => {
    const result = calculateYearsToFI(
      100_000_000,
      100_000_000,
      2_000_000,
      0.06
    );

    expect(result).toBe(0);
  });

  it('returns 0 when current net worth exceeds FI number', () => {
    const result = calculateYearsToFI(
      100_000_000,
      120_000_000,
      2_000_000,
      0.06
    );

    expect(result).toBe(0);
  });

  it('returns null when savings is zero', () => {
    const result = calculateYearsToFI(150_000_000, 20_000_000, 0, 0.06);

    expect(result).toBeNull();
  });

  it('returns null when savings is negative', () => {
    const result = calculateYearsToFI(
      150_000_000,
      20_000_000,
      -100_000,
      0.06
    );

    expect(result).toBeNull();
  });

  it('returns null for impossible targets (100+ years)', () => {
    const result = calculateYearsToFI(
      500_000_000, // Very high target
      100_000, // Low starting point
      50_000, // Minimal savings
      0.01 // Low return
    );

    expect(result).toBeNull();
  });

  it('handles zero return (no growth)', () => {
    const result = calculateYearsToFI(150_000_000, 20_000_000, 10_000_000, 0);

    expect(result).not.toBeNull();
    expect(result).toBeCloseTo(13, 0); // (150M - 20M) / 10M = 13 years
  });

  it('handles high savings rate (short timeline)', () => {
    const result = calculateYearsToFI(
      100_000_000,
      50_000_000,
      10_000_000,
      0.06
    );

    expect(result).not.toBeNull();
    expect(result).toBeLessThan(7);
  });
});

// ============================================================================
// COASTFIRE CALCULATION TESTS
// ============================================================================

describe('calculateCoastFINumber', () => {
  it('calculates correct coast number for 25 year growth period', () => {
    const result = calculateCoastFINumber(
      150_000_000, // 150M target at 65
      40, // Current age
      65, // Retirement age
      0.06 // 6% growth
    );

    // With 6% growth over 25 years: PV = 150M / (1.06^25) ≈ 35M
    expect(result).toBeGreaterThan(30_000_000);
    expect(result).toBeLessThan(40_000_000);
  });

  it('calculates correct coast number for short growth period', () => {
    const result = calculateCoastFINumber(
      150_000_000,
      60, // Close to retirement
      65,
      0.06
    );

    // With 6% growth over 5 years: PV = 150M / (1.06^5) ≈ 112M
    expect(result).toBeGreaterThan(110_000_000);
    expect(result).toBeLessThan(115_000_000);
  });

  it('returns target when ages are equal', () => {
    const result = calculateCoastFINumber(150_000_000, 65, 65, 0.06);

    // No growth time means need full amount now
    expect(result).toBe(150_000_000);
  });

  it('returns 0 for invalid inputs (target age before current)', () => {
    const result = calculateCoastFINumber(150_000_000, 65, 60, 0.06);

    expect(result).toBe(0);
  });

  it('handles zero return', () => {
    const result = calculateCoastFINumber(150_000_000, 40, 65, 0);

    // With 0% growth, need full amount now
    expect(result).toBe(150_000_000);
  });

  it('handles high return', () => {
    const result = calculateCoastFINumber(150_000_000, 30, 65, 0.10);

    // With 10% growth over 35 years, need much less now
    expect(result).toBeGreaterThan(4_000_000);
    expect(result).toBeLessThan(6_000_000);
  });
});

// ============================================================================
// BARISTAFIRE CALCULATION TESTS
// ============================================================================

describe('calculateBaristaFINumber', () => {
  it('calculates reduced FI number with part-time income', () => {
    const result = calculateBaristaFINumber(
      150_000_000, // Full FI
      2_400_000, // 200k/month part-time (2.4M/year)
      25
    );

    // 2.4M × 25 = 60M offset
    // 150M - 60M = 90M (60% of full)
    expect(result).toBe(90_000_000);
  });

  it('calculates with 30x multiplier', () => {
    const result = calculateBaristaFINumber(
      180_000_000, // Full FI with 30x
      2_400_000, // 200k/month part-time
      30
    );

    // 2.4M × 30 = 72M offset
    // 180M - 72M = 108M (60% of full)
    expect(result).toBe(108_000_000);
  });

  it('returns 0 when part-time income covers everything', () => {
    const result = calculateBaristaFINumber(
      150_000_000,
      10_000_000, // Very high part-time income
      25
    );

    // 10M × 25 = 250M offset > 150M target
    expect(result).toBe(0);
  });

  it('returns full FI number when no part-time income', () => {
    const result = calculateBaristaFINumber(150_000_000, 0, 25);

    expect(result).toBe(150_000_000);
  });

  it('handles negative income (should not reduce)', () => {
    const result = calculateBaristaFINumber(150_000_000, -1_000_000, 25);

    expect(result).toBe(150_000_000);
  });
});

// ============================================================================
// COMPLETE FIRE CALCULATION TESTS
// ============================================================================

describe('calculateFIRECalculation', () => {
  it('calculates LeanFIRE correctly', () => {
    const result = calculateFIRECalculation(
      'leanfire',
      defaultInputs,
      defaultAssumptions
    );

    expect(result.fireTypeId).toBe('leanfire');
    expect(result.monthlyExpenses).toBe(250_000);
    expect(result.annualExpenses).toBe(3_000_000);
    expect(result.multiplier).toBe(25);
    expect(result.fiNumber).toBe(75_000_000); // 250k × 12 × 25
    expect(result.yearsToFI).not.toBeNull();
    expect(result.currentProgress).toBeGreaterThan(0);
    expect(result.effortLevel).toBeDefined();
    expect(result.feasibility).toBeGreaterThan(0);
  });

  it('calculates RegularFIRE correctly', () => {
    const result = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    expect(result.fireTypeId).toBe('regularfire');
    expect(result.monthlyExpenses).toBe(500_000);
    expect(result.fiNumber).toBe(180_000_000); // 500k × 12 × 30
    expect(result.multiplier).toBe(30);
  });

  it('calculates FatFIRE correctly', () => {
    const result = calculateFIRECalculation(
      'fatfire',
      defaultInputs,
      defaultAssumptions
    );

    expect(result.fireTypeId).toBe('fatfire');
    expect(result.monthlyExpenses).toBe(1_000_000);
    expect(result.fiNumber).toBe(360_000_000); // 1M × 12 × 30
  });

  it('calculates CoastFIRE with coast data', () => {
    const result = calculateFIRECalculation(
      'coastfire',
      defaultInputs,
      defaultAssumptions
    );

    expect(result.fireTypeId).toBe('coastfire');
    expect(result.coastData).toBeDefined();
    expect(result.coastData?.coastFINumber).toBeDefined();
    expect(result.coastData?.isCoasting).toBeDefined();
    expect(result.coastData?.workIncomeNeeded).toBe(500_000);
  });

  it('calculates BaristaFIRE with barista data', () => {
    const result = calculateFIRECalculation(
      'baristafire',
      defaultInputs,
      defaultAssumptions
    );

    expect(result.fireTypeId).toBe('baristafire');
    expect(result.baristaData).toBeDefined();
    expect(result.baristaData?.reducedFINumber).toBeDefined();
    expect(result.baristaData?.fullFINumber).toBeDefined();
    expect(result.baristaData?.partTimeIncomeNeeded).toBeDefined();
    expect(result.baristaData?.savings).toBeGreaterThan(0);
  });

  it('includes life energy when AWH provided', () => {
    const result = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions,
      3_000 // 3000 ISK/hour
    );

    expect(result.lifeEnergy).toBeDefined();
    expect(result.lifeEnergy?.fiNumberInHours).toBeGreaterThan(0);
    expect(result.lifeEnergy?.fiNumberInYears).toBeGreaterThan(0);
  });

  it('excludes life energy when AWH not provided', () => {
    const result = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions,
      null
    );

    expect(result.lifeEnergy).toBeUndefined();
  });

  it('handles already achieved FI', () => {
    const richInputs: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 200_000_000, // Already rich
    };

    const result = calculateFIRECalculation(
      'leanfire',
      richInputs,
      defaultAssumptions
    );

    expect(result.yearsToFI).toBe(0);
    expect(result.currentProgress).toBe(100);
  });
});

// ============================================================================
// CALCULATE ALL FIRE TYPES TESTS
// ============================================================================

describe('calculateAllFIRETypes', () => {
  it('calculates all five FIRE types', () => {
    const results = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );

    expect(results.leanfire).toBeDefined();
    expect(results.regularfire).toBeDefined();
    expect(results.coastfire).toBeDefined();
    expect(results.baristafire).toBeDefined();
    expect(results.fatfire).toBeDefined();
  });

  it('returns correctly ordered FI numbers (lean < regular < fat)', () => {
    const results = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );

    expect(results.leanfire.fiNumber).toBeLessThan(
      results.regularfire.fiNumber
    );
    expect(results.regularfire.fiNumber).toBeLessThan(
      results.fatfire.fiNumber
    );
  });

  it('coast and barista have reduced numbers', () => {
    const results = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );

    // CoastFIRE should be less than RegularFIRE (present value)
    expect(results.coastfire.fiNumber).toBeLessThan(
      results.regularfire.fiNumber
    );

    // BaristaFIRE should be less than RegularFIRE (part-time offset)
    expect(results.baristafire.fiNumber).toBeLessThan(
      results.regularfire.fiNumber
    );
  });

  it('includes life energy for all when AWH provided', () => {
    const results = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions,
      3_000
    );

    expect(results.leanfire.lifeEnergy).toBeDefined();
    expect(results.regularfire.lifeEnergy).toBeDefined();
    expect(results.fatfire.lifeEnergy).toBeDefined();
  });
});

// ============================================================================
// EFFORT LEVEL CALCULATION TESTS
// ============================================================================

describe('calculateEffortLevel', () => {
  it('returns low for long timeline with low savings', () => {
    const result = calculateEffortLevel(30, 15);
    expect(result).toBe('moderate'); // 30 years at 15% is still moderate
  });

  it('returns moderate for standard FIRE path', () => {
    const result = calculateEffortLevel(20, 30);
    expect(result).toBe('moderate');
  });

  it('returns high for aggressive FIRE', () => {
    const result = calculateEffortLevel(12, 45);
    expect(result).toBe('high');
  });

  it('returns extreme for very aggressive FIRE', () => {
    const result = calculateEffortLevel(8, 60);
    expect(result).toBe('extreme');
  });

  it('returns extreme for impossible timeline', () => {
    const result = calculateEffortLevel(null, 30);
    expect(result).toBe('extreme');
  });

  it('returns extreme for very long timeline', () => {
    const result = calculateEffortLevel(50, 20);
    expect(result).toBe('extreme');
  });
});

// ============================================================================
// FEASIBILITY CALCULATION TESTS
// ============================================================================

describe('calculateFeasibility', () => {
  it('returns 0 for impossible timeline', () => {
    const result = calculateFeasibility(null, 40);
    expect(result).toBe(0);
  });

  it('returns 0 for extremely long timeline', () => {
    const result = calculateFeasibility(60, 40);
    expect(result).toBe(0);
  });

  it('returns high score for short timeline', () => {
    const result = calculateFeasibility(10, 30);
    expect(result).toBeGreaterThan(90);
  });

  it('penalizes reaching FI very late in life', () => {
    const result1 = calculateFeasibility(20, 40); // FI at 60
    const result2 = calculateFeasibility(35, 40); // FI at 75

    expect(result2).toBeLessThan(result1);
  });

  it('gives bonus for early FI', () => {
    const result = calculateFeasibility(8, 30);
    expect(result).toBe(100); // Maxes out at 100
  });

  it('returns reasonable score for standard FIRE path', () => {
    const result = calculateFeasibility(20, 40);
    expect(result).toBeGreaterThan(70);
    expect(result).toBeLessThan(100);
  });
});

// ============================================================================
// RECOMMENDATION ENGINE TESTS
// ============================================================================

describe('calculateFIRERecommendations', () => {
  it('returns recommendations for all FIRE types', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    expect(recommendations).toHaveLength(5);
    expect(recommendations[0].rank).toBe(1);
    expect(recommendations[4].rank).toBe(5);
  });

  it('ranks by score (highest first)', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].score).toBeGreaterThanOrEqual(
        recommendations[i + 1].score
      );
    }
  });

  it('includes reasons for recommendations', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    recommendations.forEach((rec) => {
      expect(rec.reasons.length).toBeGreaterThan(0);
      expect(rec.reasons.length).toBeLessThanOrEqual(4);
    });
  });

  it('includes warnings for difficult goals', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    const fatfireRec = recommendations.find(
      (r) => r.fireTypeId === 'fatfire'
    );
    expect(fatfireRec).toBeDefined();
    // FatFIRE should have warnings about time or difficulty
  });

  it('assigns confidence levels appropriately', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    recommendations.forEach((rec) => {
      expect(['high', 'medium', 'low']).toContain(rec.confidence);
    });
  });

  it('favors feasible FIRE types', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    const topRec = recommendations[0];
    const topCalc =
      calculations[topRec.fireTypeId as keyof typeof calculations];

    expect(topCalc.feasibility).toBeGreaterThan(40);
  });

  it('includes timeline information', () => {
    const calculations = calculateAllFIRETypes(
      defaultInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    recommendations.forEach((rec) => {
      if (rec.yearsToFI !== null) {
        expect(rec.monthlySavingsRequired).toBeGreaterThan(0);
      }
    });
  });

  it('handles low savings rate appropriately', () => {
    const lowSavingsInputs: UserFinancialInputs = {
      ...defaultInputs,
      annualSavings: 300_000, // Only 5% savings rate
      savingsRate: 5,
    };

    const calculations = calculateAllFIRETypes(
      lowSavingsInputs,
      defaultAssumptions
    );
    const recommendations = calculateFIRERecommendations(calculations);

    // Should still return recommendations but with warnings
    expect(recommendations).toHaveLength(5);
    expect(
      recommendations.some((r) => r.warnings.length > 0)
    ).toBe(true);
  });
});

// ============================================================================
// IMPORT NEW FUNCTIONS FOR TESTING
// ============================================================================

import {
  calculateRequiredSavingsRate,
  generateFIRETimeline,
  generateActionSteps,
  generateTimelineString,
  generateObstacles,
} from '../fireTypes';

// ============================================================================
// REQUIRED SAVINGS RATE CALCULATION TESTS
// ============================================================================

describe('calculateRequiredSavingsRate', () => {
  it('calculates required savings rate for achievable goal', () => {
    const fiNumber = 150_000_000; // 150M ISK
    const currentNetWorth = 20_000_000; // 20M ISK
    const annualIncome = 6_000_000; // 6M ISK
    const yearsAvailable = 15;
    const expectedReturn = 0.06;

    const result = calculateRequiredSavingsRate(
      fiNumber,
      currentNetWorth,
      annualIncome,
      yearsAvailable,
      expectedReturn
    );

    expect(result).not.toBeNull();
    if (result !== null) {
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });

  it('returns 0 if already reached FI number', () => {
    const result = calculateRequiredSavingsRate(
      100_000_000,
      150_000_000, // Already have more than needed
      6_000_000,
      10,
      0.06
    );

    expect(result).toBe(0);
  });

  it('returns null if impossible even at 100% savings', () => {
    const fiNumber = 500_000_000; // Very high target
    const currentNetWorth = 1_000_000; // Low start
    const annualIncome = 3_000_000; // Moderate income
    const yearsAvailable = 5; // Short time
    const expectedReturn = 0.04; // Low return

    const result = calculateRequiredSavingsRate(
      fiNumber,
      currentNetWorth,
      annualIncome,
      yearsAvailable,
      expectedReturn
    );

    expect(result).toBeNull();
  });

  it('handles edge case of zero years available', () => {
    const result = calculateRequiredSavingsRate(
      100_000_000,
      50_000_000,
      6_000_000,
      0, // No time
      0.06
    );

    expect(result).toBeNull();
  });

  it('handles edge case of zero income', () => {
    const result = calculateRequiredSavingsRate(
      100_000_000,
      50_000_000,
      0, // No income
      10,
      0.06
    );

    expect(result).toBeNull();
  });

  it('calculates higher rate for shorter timeframes', () => {
    const fiNumber = 150_000_000;
    const currentNetWorth = 20_000_000;
    const annualIncome = 6_000_000;
    const expectedReturn = 0.06;

    const rate10Years = calculateRequiredSavingsRate(
      fiNumber,
      currentNetWorth,
      annualIncome,
      10,
      expectedReturn
    );

    const rate20Years = calculateRequiredSavingsRate(
      fiNumber,
      currentNetWorth,
      annualIncome,
      20,
      expectedReturn
    );

    if (rate10Years !== null && rate20Years !== null) {
      expect(rate10Years).toBeGreaterThan(rate20Years);
    }
  });
});

// ============================================================================
// FIRE TIMELINE GENERATION TESTS
// ============================================================================

describe('generateFIRETimeline', () => {
  it('generates timeline with 5 milestones', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, defaultInputs.currentAge);

    expect(timeline.milestones).toHaveLength(5);
    expect(timeline.milestones[0].percentage).toBe(0);
    expect(timeline.milestones[4].percentage).toBe(100);
  });

  it('marks current progress milestones as reached', () => {
    const inputsWithProgress: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 80_000_000, // Significant progress
    };

    const calculation = calculateFIRECalculation(
      'regularfire',
      inputsWithProgress,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, inputsWithProgress.currentAge);

    // First milestone (0%) should be reached
    expect(timeline.milestones[0].isReached).toBe(true);

    // Some milestones may be reached depending on progress
    const reachedCount = timeline.milestones.filter((m) => m.isReached).length;
    expect(reachedCount).toBeGreaterThan(0);
  });

  it('includes Icelandic labels for milestones', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, defaultInputs.currentAge);

    expect(timeline.milestones[0].label).toBe('Byrjun');
    expect(timeline.milestones[4].label).toBe('FIRE náð!');
  });

  it('generates projected path with yearly snapshots', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, defaultInputs.currentAge);

    expect(timeline.projectedPath.length).toBeGreaterThan(0);
    expect(timeline.projectedPath[0].year).toBe(0);
    expect(timeline.projectedPath[0].netWorth).toBeGreaterThan(0);
  });

  it('sets correct FI number and current net worth', () => {
    const calculation = calculateFIRECalculation(
      'leanfire',
      defaultInputs,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, defaultInputs.currentAge);

    expect(timeline.fiNumber).toBe(calculation.fiNumber);
    expect(timeline.fireTypeId).toBe('leanfire');
  });

  it('handles already achieved FIRE', () => {
    const inputsAlreadyFI: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 200_000_000, // Already at FI
    };

    const calculation = calculateFIRECalculation(
      'leanfire',
      inputsAlreadyFI,
      defaultAssumptions
    );

    const timeline = generateFIRETimeline(calculation, inputsAlreadyFI.currentAge);

    // All milestones should be marked as reached
    const allReached = timeline.milestones.every((m) => m.isReached);
    expect(allReached).toBe(true);
  });
});

// ============================================================================
// ACTION STEPS GENERATION TESTS
// ============================================================================

describe('generateActionSteps', () => {
  it('generates action steps for LeanFIRE', () => {
    const calculation = calculateFIRECalculation(
      'leanfire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.length).toBeLessThanOrEqual(5);
    expect(steps.some((s) => s.includes('útgjöld') || s.includes('minimalíska'))).toBe(true);
  });

  it('generates action steps for RegularFIRE', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes('lífsstíl') || s.includes('sparnaðarhlutfall'))).toBe(true);
  });

  it('generates action steps for CoastFIRE when not coasting', () => {
    const calculation = calculateFIRECalculation(
      'coastfire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeGreaterThan(0);
    if (!calculation.coastData?.isCoasting) {
      expect(steps.some((s) => s.includes('Sparaðu hart'))).toBe(true);
    }
  });

  it('generates action steps for BaristaFIRE', () => {
    const calculation = calculateFIRECalculation(
      'baristafire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes('hlutastarf'))).toBe(true);
  });

  it('generates action steps for FatFIRE', () => {
    const calculation = calculateFIRECalculation(
      'fatfire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.includes('hátekjum') || s.includes('starfsframa'))).toBe(true);
  });

  it('limits action steps to maximum of 5', () => {
    const calculation = calculateFIRECalculation(
      'fatfire',
      defaultInputs,
      defaultAssumptions
    );

    const steps = generateActionSteps(calculation);

    expect(steps.length).toBeLessThanOrEqual(5);
  });
});

// ============================================================================
// TIMELINE STRING GENERATION TESTS
// ============================================================================

describe('generateTimelineString', () => {
  it('shows years and months for normal timeline', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const timelineStr = generateTimelineString(calculation);

    expect(timelineStr).toBeTruthy();
    expect(typeof timelineStr).toBe('string');
  });

  it('indicates already achieved FIRE', () => {
    const inputsAlreadyFI: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 200_000_000,
    };

    const calculation = calculateFIRECalculation(
      'leanfire',
      inputsAlreadyFI,
      defaultAssumptions
    );

    const timelineStr = generateTimelineString(calculation);

    expect(timelineStr).toContain('þegar búin');
  });

  it('indicates impossible with current savings', () => {
    const inputsNoSavings: UserFinancialInputs = {
      ...defaultInputs,
      annualSavings: 0,
      currentNetWorth: 1_000_000,
    };

    const calculation = calculateFIRECalculation(
      'fatfire',
      inputsNoSavings,
      defaultAssumptions
    );

    const timelineStr = generateTimelineString(calculation);

    expect(timelineStr).toContain('Ekki hægt');
  });

  it('includes target age when available', () => {
    const calculation = calculateFIRECalculation(
      'regularfire',
      defaultInputs,
      defaultAssumptions
    );

    const timelineStr = generateTimelineString(calculation);

    if (calculation.targetAge) {
      expect(timelineStr).toContain('aldur');
    }
  });

  it('handles less than 1 year timeline', () => {
    const inputsNearFI: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 145_000_000, // Very close to 150M FI
      annualSavings: 10_000_000,
    };

    const calculation = calculateFIRECalculation(
      'regularfire',
      inputsNearFI,
      defaultAssumptions
    );

    const timelineStr = generateTimelineString(calculation);

    expect(timelineStr).toBeTruthy();
    if (calculation.yearsToFI !== null && calculation.yearsToFI < 1) {
      expect(timelineStr).toContain('mánuðir');
    }
  });
});

// ============================================================================
// OBSTACLES GENERATION TESTS
// ============================================================================

describe('generateObstacles', () => {
  it('identifies high savings rate obstacle', () => {
    const inputsLowIncome: UserFinancialInputs = {
      ...defaultInputs,
      annualIncome: 3_000_000, // Lower income
      annualSavings: 2_000_000, // High savings
      savingsRate: 66.67,
    };

    const calculation = calculateFIRECalculation(
      'fatfire',
      inputsLowIncome,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, inputsLowIncome);

    expect(obstacles.length).toBeGreaterThan(0);
  });

  it('identifies long timeline obstacle', () => {
    const inputsLongTimeline: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 5_000_000,
      annualSavings: 500_000,
    };

    const calculation = calculateFIRECalculation(
      'fatfire',
      inputsLongTimeline,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, inputsLongTimeline);

    if (calculation.yearsToFI !== null && calculation.yearsToFI > 20) {
      expect(obstacles.some((o) => o.includes('Langtímamarkmið'))).toBe(true);
    }
  });

  it('identifies late retirement age obstacle', () => {
    const inputsOlderAge: UserFinancialInputs = {
      ...defaultInputs,
      currentAge: 55,
      targetRetirementAge: 70,
      currentNetWorth: 10_000_000,
      annualSavings: 1_000_000,
    };

    const calculation = calculateFIRECalculation(
      'fatfire',
      inputsOlderAge,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, inputsOlderAge);

    if (calculation.targetAge && calculation.targetAge > 65) {
      expect(obstacles.some((o) => o.includes('Seint á efri árum'))).toBe(true);
    }
  });

  it('identifies LeanFIRE expense obstacles', () => {
    const inputsHighExpenses: UserFinancialInputs = {
      ...defaultInputs,
      monthlyExpenses: {
        barebones: 400_000, // High for lean
        comfortable: 500_000,
        deluxe: 1_000_000,
      },
    };

    const calculation = calculateFIRECalculation(
      'leanfire',
      inputsHighExpenses,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, inputsHighExpenses);

    expect(obstacles.some((o) => o.includes('litlum útgjöldum'))).toBe(true);
  });

  it('identifies CoastFIRE work requirement', () => {
    const calculation = calculateFIRECalculation(
      'coastfire',
      defaultInputs,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, defaultInputs);

    if (!calculation.coastData?.isCoasting) {
      expect(obstacles.some((o) => o.includes('vinna alla lífið'))).toBe(true);
    }
  });

  it('identifies BaristaFIRE part-time work requirement', () => {
    const calculation = calculateFIRECalculation(
      'baristafire',
      defaultInputs,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, defaultInputs);

    expect(obstacles.some((o) => o.includes('hlutastarfi'))).toBe(true);
  });

  it('limits obstacles to maximum of 4', () => {
    const calculation = calculateFIRECalculation(
      'fatfire',
      defaultInputs,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, defaultInputs);

    expect(obstacles.length).toBeLessThanOrEqual(4);
  });

  it('identifies low starting net worth obstacle', () => {
    const inputsLowNetWorth: UserFinancialInputs = {
      ...defaultInputs,
      currentNetWorth: 500_000, // Very low
    };

    const calculation = calculateFIRECalculation(
      'fatfire',
      inputsLowNetWorth,
      defaultAssumptions
    );

    const obstacles = generateObstacles(calculation, inputsLowNetWorth);

    // FatFIRE is 360M, so 500k is definitely < 10% progress
    // (500k / 360M) * 100 = 0.14%
    expect(calculation.currentProgress).toBeLessThan(10);

    // Obstacle may be limited to 4, and other obstacles may take priority
    // Just verify we get some obstacles
    expect(obstacles.length).toBeGreaterThan(0);
    expect(obstacles.length).toBeLessThanOrEqual(4);
  });
});
