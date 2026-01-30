/**
 * Tests for LeanFIRE Calculation Functions
 *
 * Comprehensive unit tests for all LeanFIRE calculator functions.
 * Tests cover normal cases, edge cases, and calculation accuracy.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateMinimumFINumber,
  calculateGeographicComparison,
  calculateReductionScenario,
  calculateTotalReductions,
  calculateYearsToFI,
  generateFrugalityTips,
  calculateFrugalityTipImpact,
  calculateLifeEnergy,
  calculateLeanFireResults,
} from '../leanFire';

import {
  DEFAULT_BAREBONES_REYKJAVIK,
  DEFAULT_BAREBONES_LANDSBYGGD,
  getTotalMonthly,
} from '@/lib/constants/leanFire';

import type {
  CategoryExpenses,
  ReductionScenario,
  FrugalityTip,
} from '@/types/leanFire';

// ============================================================================
// MINIMUM FI NUMBER CALCULATION
// ============================================================================

describe('calculateMinimumFINumber', () => {
  it('calculates FI number with 25x multiplier correctly', () => {
    const result = calculateMinimumFINumber(250_000, 25);
    expect(result).toBe(75_000_000); // 250k × 12 × 25
  });

  it('calculates FI number with 30x multiplier correctly', () => {
    const result = calculateMinimumFINumber(250_000, 30);
    expect(result).toBe(90_000_000); // 250k × 12 × 30
  });

  it('handles zero expenses', () => {
    const result = calculateMinimumFINumber(0, 30);
    expect(result).toBe(0);
  });

  it('handles negative expenses (edge case)', () => {
    const result = calculateMinimumFINumber(-100, 30);
    expect(result).toBe(0);
  });

  it('handles very large expenses', () => {
    const result = calculateMinimumFINumber(1_000_000, 30);
    expect(result).toBe(360_000_000); // 1M × 12 × 30
  });
});

// ============================================================================
// GEOGRAPHIC COMPARISON
// ============================================================================

describe('calculateGeographicComparison', () => {
  it('compares Reykjavík and Landsbyggð correctly', () => {
    const comparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      30
    );

    const reykjavikTotal = getTotalMonthly(DEFAULT_BAREBONES_REYKJAVIK);
    const landsbyggdTotal = getTotalMonthly(DEFAULT_BAREBONES_LANDSBYGGD);

    expect(comparison.reykjavik.totalMonthly).toBe(reykjavikTotal);
    expect(comparison.landsbyggd.totalMonthly).toBe(landsbyggdTotal);
    expect(comparison.netSavings).toBe(reykjavikTotal - landsbyggdTotal);
  });

  it('calculates FI number difference correctly', () => {
    const comparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      30
    );

    const reykjavikFI =
      getTotalMonthly(DEFAULT_BAREBONES_REYKJAVIK) * 12 * 30;
    const landsbyggdFI =
      getTotalMonthly(DEFAULT_BAREBONES_LANDSBYGGD) * 12 * 30;

    expect(comparison.reykjavik.fiNumber).toBe(reykjavikFI);
    expect(comparison.landsbyggd.fiNumber).toBe(landsbyggdFI);
    expect(comparison.fiNumberDifference).toBe(reykjavikFI - landsbyggdFI);
  });

  it('calculates category differences correctly', () => {
    const comparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      30
    );

    // Housing should be more expensive in Reykjavík (positive)
    expect(comparison.differences.housing).toBeGreaterThan(0);

    // Transport should be cheaper in Reykjavík (negative) due to public transit
    expect(comparison.differences.transport).toBeLessThan(0);
  });

  it('includes pros and cons for both locations', () => {
    const comparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      30
    );

    expect(comparison.reykjavik.pros.length).toBeGreaterThan(0);
    expect(comparison.reykjavik.cons.length).toBeGreaterThan(0);
    expect(comparison.landsbyggd.pros.length).toBeGreaterThan(0);
    expect(comparison.landsbyggd.cons.length).toBeGreaterThan(0);
  });

  it('works with 25x multiplier', () => {
    const comparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      25
    );

    expect(comparison.reykjavik.fiNumber).toBeGreaterThan(0);
    expect(comparison.landsbyggd.fiNumber).toBeGreaterThan(0);
  });
});

// ============================================================================
// EXPENSE REDUCTION SCENARIOS
// ============================================================================

describe('calculateReductionScenario', () => {
  it('calculates 50% reduction correctly', () => {
    const scenario = calculateReductionScenario(
      'housing',
      120_000,
      50,
      30,
      50_000
    );

    expect(scenario.category).toBe('housing');
    expect(scenario.currentAmount).toBe(120_000);
    expect(scenario.newAmount).toBe(60_000);
    expect(scenario.monthlySavings).toBe(60_000);
    expect(scenario.annualSavings).toBe(720_000);
    expect(scenario.fiNumberImpact).toBe(21_600_000); // 720k × 30
  });

  it('calculates 100% reduction (elimination)', () => {
    const scenario = calculateReductionScenario(
      'entertainment',
      15_000,
      100,
      30,
      50_000
    );

    expect(scenario.newAmount).toBe(0);
    expect(scenario.monthlySavings).toBe(15_000);
  });

  it('calculates 10% reduction correctly', () => {
    const scenario = calculateReductionScenario('food', 40_000, 10, 30, 50_000);

    expect(scenario.newAmount).toBe(36_000);
    expect(scenario.monthlySavings).toBe(4_000);
    expect(scenario.annualSavings).toBe(48_000);
  });

  it('calculates 25% reduction correctly', () => {
    const scenario = calculateReductionScenario('food', 40_000, 25, 30, 50_000);

    expect(scenario.newAmount).toBe(30_000);
    expect(scenario.monthlySavings).toBe(10_000);
  });

  it('calculates efficiency rating', () => {
    const scenario = calculateReductionScenario(
      'housing',
      120_000,
      50,
      30,
      50_000
    );

    expect(scenario.efficiency).toBeGreaterThan(0);
  });

  it('handles zero savings rate', () => {
    const scenario = calculateReductionScenario('housing', 120_000, 50, 30, 0);

    expect(scenario.timelineImpact).toBe(0);
    expect(scenario.efficiency).toBe(0);
  });
});

describe('calculateTotalReductions', () => {
  it('sums multiple scenarios correctly', () => {
    const scenarios: ReductionScenario[] = [
      {
        id: '1',
        name: 'Housing -50%',
        category: 'housing',
        currentAmount: 120_000,
        reductionPercent: 50,
        newAmount: 60_000,
        monthlySavings: 60_000,
        annualSavings: 720_000,
        fiNumberImpact: 21_600_000,
        timelineImpact: 36,
        efficiency: 6,
        order: 1,
      },
      {
        id: '2',
        name: 'Transport -100%',
        category: 'transport',
        currentAmount: 12_000,
        reductionPercent: 100,
        newAmount: 0,
        monthlySavings: 12_000,
        annualSavings: 144_000,
        fiNumberImpact: 4_320_000,
        timelineImpact: 7.2,
        efficiency: 6,
        order: 2,
      },
    ];

    const result = calculateTotalReductions(scenarios);

    expect(result.totalReductions).toBe(72_000); // 60k + 12k
    expect(result.totalFIReduction).toBe(25_920_000); // 21.6M + 4.32M
    expect(result.totalMonthsSaved).toBe(43.2); // 36 + 7.2
  });

  it('handles empty scenario array', () => {
    const result = calculateTotalReductions([]);

    expect(result.totalReductions).toBe(0);
    expect(result.totalFIReduction).toBe(0);
    expect(result.totalMonthsSaved).toBe(0);
  });

  it('handles single scenario', () => {
    const scenarios: ReductionScenario[] = [
      {
        id: '1',
        name: 'Food -25%',
        category: 'food',
        currentAmount: 40_000,
        reductionPercent: 25,
        newAmount: 30_000,
        monthlySavings: 10_000,
        annualSavings: 120_000,
        fiNumberImpact: 3_600_000,
        timelineImpact: 6,
        efficiency: 6,
        order: 1,
      },
    ];

    const result = calculateTotalReductions(scenarios);

    expect(result.totalReductions).toBe(10_000);
  });
});

// ============================================================================
// TIMELINE CALCULATION
// ============================================================================

describe('calculateYearsToFI', () => {
  it('returns 0 if already at FI', () => {
    const years = calculateYearsToFI(50_000_000, 60_000_000, 100_000, 0.05);
    expect(years).toBe(0);
  });

  it('returns 999 if no savings', () => {
    const years = calculateYearsToFI(50_000_000, 10_000_000, 0, 0.05);
    expect(years).toBe(999);
  });

  it('calculates years for typical scenario', () => {
    // FI: 90M, Current: 10M, Monthly: 100k, Return: 5%
    const years = calculateYearsToFI(90_000_000, 10_000_000, 100_000, 0.05);

    // Should be somewhere between 20-30 years
    expect(years).toBeGreaterThan(15);
    expect(years).toBeLessThan(40);
  });

  it('handles zero return rate', () => {
    // With no return, purely savings-based
    const years = calculateYearsToFI(10_000_000, 0, 100_000, 0);

    // 10M / (100k × 12) = 8.33 years
    expect(years).toBeCloseTo(8.33, 0);
  });

  it('completes faster with higher return rate', () => {
    const years5 = calculateYearsToFI(50_000_000, 10_000_000, 100_000, 0.05);
    const years10 = calculateYearsToFI(50_000_000, 10_000_000, 100_000, 0.1);

    expect(years10).toBeLessThan(years5);
  });

  it('respects safety limit (50 years)', () => {
    // Very small savings, very large FI number
    const years = calculateYearsToFI(100_000_000, 0, 1_000, 0.01);

    expect(years).toBeLessThanOrEqual(50);
  });
});

// ============================================================================
// FRUGALITY OPTIMIZATION
// ============================================================================

describe('generateFrugalityTips', () => {
  const currentExpenses: CategoryExpenses = {
    housing: 120_000,
    food: 50_000, // Higher than minimum
    transport: 12_000,
    healthcare: 5_000,
    insurance: 8_000,
    utilities: 25_000,
    personal: 10_000,
    entertainment: 20_000, // Higher than minimum
    other: 5_000,
  };

  const minimumExpenses = DEFAULT_BAREBONES_REYKJAVIK;

  it('generates tips for high-spend categories', () => {
    const tips = generateFrugalityTips(
      currentExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    expect(tips.length).toBeGreaterThan(0);
  });

  it('only generates tips for categories above minimum', () => {
    const tips = generateFrugalityTips(
      currentExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    // Should have tips for food and entertainment (overspending)
    const foodTips = tips.filter((tip) => tip.category === 'food');
    const entertainmentTips = tips.filter(
      (tip) => tip.category === 'entertainment'
    );

    expect(foodTips.length).toBeGreaterThan(0);
    expect(entertainmentTips.length).toBeGreaterThan(0);
  });

  it('sorts tips by timeline impact', () => {
    const tips = generateFrugalityTips(
      currentExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    // Verify sorted descending by timelineImpact
    for (let i = 1; i < tips.length; i++) {
      expect(tips[i - 1].timelineImpact).toBeGreaterThanOrEqual(
        tips[i].timelineImpact
      );
    }
  });

  it('includes Iceland-specific resources', () => {
    const tips = generateFrugalityTips(
      currentExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    const tipsWithResources = tips.filter(
      (tip) => tip.icelandicResources && tip.icelandicResources.length > 0
    );

    expect(tipsWithResources.length).toBeGreaterThan(0);
  });

  it('caps potential savings at excess spending', () => {
    const tips = generateFrugalityTips(
      currentExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    tips.forEach((tip) => {
      const excess =
        currentExpenses[tip.category] - minimumExpenses[tip.category];
      expect(tip.potentialSavings).toBeLessThanOrEqual(excess);
    });
  });

  it('handles no high-spend categories', () => {
    const lowExpenses = DEFAULT_BAREBONES_REYKJAVIK;

    const tips = generateFrugalityTips(
      lowExpenses,
      minimumExpenses,
      5_000,
      30,
      90_000_000,
      50_000
    );

    // Should generate very few or no tips
    expect(tips.length).toBeLessThanOrEqual(5);
  });
});

describe('calculateFrugalityTipImpact', () => {
  const sampleTip: FrugalityTip = {
    id: 'food-1',
    category: 'food',
    title: 'Test tip',
    description: 'Test description',
    potentialSavings: 10_000,
    timelineImpact: 0,
    difficulty: 'easy',
    implemented: false,
  };

  it('calculates FI reduction correctly', () => {
    const impact = calculateFrugalityTipImpact(sampleTip, 50_000, 30);

    expect(impact.fiReduction).toBe(3_600_000); // 10k × 12 × 30
  });

  it('calculates timeline months saved', () => {
    const impact = calculateFrugalityTipImpact(sampleTip, 50_000, 30);

    expect(impact.timelineMonthsSaved).toBeGreaterThan(0);
  });

  it('handles zero savings rate', () => {
    const impact = calculateFrugalityTipImpact(sampleTip, 0, 30);

    expect(impact.timelineMonthsSaved).toBe(0);
  });
});

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

describe('calculateLifeEnergy', () => {
  it('calculates hours and years correctly', () => {
    const result = calculateLifeEnergy(90_000_000, 5_000);

    expect(result.hours).toBe(18_000); // 90M / 5k
    expect(result.years).toBeCloseTo(8.65, 1); // 18k / 2080
  });

  it('handles zero wage', () => {
    const result = calculateLifeEnergy(90_000_000, 0);

    expect(result.hours).toBe(0);
    expect(result.years).toBe(0);
  });

  it('handles negative wage (edge case)', () => {
    const result = calculateLifeEnergy(90_000_000, -100);

    expect(result.hours).toBe(0);
    expect(result.years).toBe(0);
  });

  it('works with very high FI numbers', () => {
    const result = calculateLifeEnergy(500_000_000, 10_000);

    expect(result.hours).toBe(50_000);
    expect(result.years).toBeCloseTo(24, 0);
  });
});

// ============================================================================
// MASTER CALCULATION FUNCTION
// ============================================================================

describe('calculateLeanFireResults', () => {
  const state = {
    barebonesExpenses: DEFAULT_BAREBONES_REYKJAVIK,
    fiMultiplier: 30 as const,
    selectedLocation: 'reykjavik' as const,
    reductionScenarios: [],
    currentSavings: 10_000_000,
    savingsRate: 100_000,
    investmentReturn: 0.05,
  };

  it('calculates all basic metrics', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.barebonesMonthly).toBeGreaterThan(0);
    expect(results.barebonesAnnual).toBeGreaterThan(0);
    expect(results.minimumFINumber).toBeGreaterThan(0);
    expect(results.fiMultiplier).toBe(30);
  });

  it('includes location comparison for non-custom location', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.locationComparison).toBeDefined();
    expect(results.locationComparison?.reykjavik).toBeDefined();
    expect(results.locationComparison?.landsbyggd).toBeDefined();
  });

  it('excludes location comparison for custom location', () => {
    const customState = {
      ...state,
      selectedLocation: 'custom' as const,
    };

    const results = calculateLeanFireResults(customState, 5_000);

    expect(results.locationComparison).toBeUndefined();
  });

  it('calculates reduction impact correctly', () => {
    const stateWithReductions = {
      ...state,
      reductionScenarios: [
        {
          id: '1',
          name: 'Housing -50%',
          category: 'housing' as const,
          currentAmount: 120_000,
          reductionPercent: 50 as const,
          newAmount: 60_000,
          monthlySavings: 60_000,
          annualSavings: 720_000,
          fiNumberImpact: 21_600_000,
          timelineImpact: 36,
          efficiency: 6,
          order: 1,
        },
      ],
    };

    const results = calculateLeanFireResults(stateWithReductions, 5_000);

    expect(results.totalReductions).toBe(60_000);
    expect(results.newMonthlyExpenses).toBeLessThan(results.barebonesMonthly);
    expect(results.newFINumber).toBeLessThan(results.minimumFINumber);
  });

  it('calculates timeline when savings data available', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.yearsToFI).toBeDefined();
    expect(results.monthsToFI).toBeDefined();
  });

  it('skips timeline when savings data missing', () => {
    const stateNoSavings = {
      ...state,
      currentSavings: null,
      savingsRate: null,
    };

    const results = calculateLeanFireResults(stateNoSavings, 5_000);

    expect(results.yearsToFI).toBeUndefined();
    expect(results.monthsToFI).toBeUndefined();
  });

  it('generates frugality tips', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.frugalityTips).toBeDefined();
    expect(Array.isArray(results.frugalityTips)).toBe(true);
  });

  it('calculates life energy when wage provided', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.lifeEnergy).toBeDefined();
    expect(results.lifeEnergy?.minimumFIInHours).toBeGreaterThan(0);
    expect(results.lifeEnergy?.minimumFIInYears).toBeGreaterThan(0);
    expect(results.lifeEnergy?.comfortableFIInYears).toBeGreaterThan(0);
    expect(results.lifeEnergy?.deluxeFIInYears).toBeGreaterThan(0);
  });

  it('skips life energy when wage not provided', () => {
    const results = calculateLeanFireResults(state, null);

    expect(results.lifeEnergy).toBeUndefined();
  });

  it('calculates comfortable and deluxe life energy correctly', () => {
    const results = calculateLeanFireResults(state, 5_000);

    expect(results.lifeEnergy?.comfortableFIInYears).toBeGreaterThan(
      results.lifeEnergy?.minimumFIInYears || 0
    );
    expect(results.lifeEnergy?.deluxeFIInYears).toBeGreaterThan(
      results.lifeEnergy?.comfortableFIInYears || 0
    );
  });
});
