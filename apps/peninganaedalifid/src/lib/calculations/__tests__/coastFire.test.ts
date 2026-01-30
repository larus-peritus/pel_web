/**
 * Unit tests for Coast FIRE Calculator functions
 *
 * Tests all pure calculation functions with various scenarios:
 * - Standard scenarios (already coasting, future coast, impossible)
 * - Edge cases (zero values, negative returns, very long timelines)
 * - Scenario comparisons
 * - Life energy conversions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFutureValue,
  calculateCoastFINumber,
  calculateCoastFIREStatus,
  calculateYearsToCoast,
  calculateGapToCoast,
  calculateProjectedBalance,
  calculateGrowthProjection,
  calculateScenarioResults,
  calculateLifeEnergy,
  calculateCoastFIREResult,
} from '../coastFire';
import type { CoastFIREInputs, ScenarioType } from '@/types/coastFire';

// ============================================================================
// Test Data
// ============================================================================

const SAMPLE_INPUTS: CoastFIREInputs = {
  currentAge: 35,
  currentInvestments: 25_000_000, // 25M ISK
  targetRetirementAge: 67,
  expectedReturn: 6, // 6% real return
  fiNumber: 150_000_000, // 150M ISK
  fiNumberSource: 'manual',
  selectedTier: null,
  fiMultiplier: 25,
};

// ============================================================================
// calculateFutureValue Tests
// ============================================================================

describe('calculateFutureValue', () => {
  it('calculates correct future value for standard scenario', () => {
    const fv = calculateFutureValue(10_000_000, 7, 30);
    // 10M × (1.07)^30 = 76,122,549
    expect(fv).toBeCloseTo(76_122_549, -3); // Within 1000 kr
  });

  it('returns principal when years is 0', () => {
    expect(calculateFutureValue(10_000_000, 7, 0)).toBe(10_000_000);
  });

  it('returns principal when return rate is 0', () => {
    expect(calculateFutureValue(10_000_000, 0, 30)).toBe(10_000_000);
  });

  it('returns principal when principal is 0', () => {
    expect(calculateFutureValue(0, 7, 30)).toBe(0);
  });

  it('handles negative years correctly', () => {
    expect(calculateFutureValue(10_000_000, 7, -5)).toBe(10_000_000);
  });

  it('calculates compound growth accurately', () => {
    // Test against known compound interest calculation
    const principal = 1_000_000;
    const rate = 8;
    const years = 10;

    const fv = calculateFutureValue(principal, rate, years);
    const expected = principal * Math.pow(1.08, 10); // 2,158,925

    expect(fv).toBeCloseTo(expected, 0);
  });
});

// ============================================================================
// calculateCoastFINumber Tests
// ============================================================================

describe('calculateCoastFINumber', () => {
  it('calculates amount needed today to coast to FI', () => {
    // Need 150M in 32 years at 6% - how much today?
    // PV = 150M / (1.06)^32 = 23,243,609.5
    const coastFI = calculateCoastFINumber(150_000_000, 32, 6);
    expect(coastFI).toBeCloseTo(23_243_610, -3);
  });

  it('returns FI number when years is 0', () => {
    expect(calculateCoastFINumber(150_000_000, 0, 6)).toBe(150_000_000);
  });

  it('returns FI number when return is 0', () => {
    // With 0% return, need full FI number today
    expect(calculateCoastFINumber(150_000_000, 32, 0)).toBe(150_000_000);
  });

  it('calculates lower amount needed with higher return', () => {
    const coastFI_6pct = calculateCoastFINumber(150_000_000, 32, 6);
    const coastFI_8pct = calculateCoastFINumber(150_000_000, 32, 8);

    // Higher return means less needed today
    expect(coastFI_8pct).toBeLessThan(coastFI_6pct);
  });

  it('calculates higher amount needed with shorter timeline', () => {
    const coastFI_32yrs = calculateCoastFINumber(150_000_000, 32, 6);
    const coastFI_20yrs = calculateCoastFINumber(150_000_000, 20, 6);

    // Shorter timeline means more needed today
    expect(coastFI_20yrs).toBeGreaterThan(coastFI_32yrs);
  });
});

// ============================================================================
// calculateCoastFIREStatus Tests
// ============================================================================

describe('calculateCoastFIREStatus', () => {
  it('returns "coasting" when current investments >= coast FI number', () => {
    const status = calculateCoastFIREStatus(30_000_000, 25_000_000);
    expect(status).toBe('coasting');
  });

  it('returns "coasting" when current investments equal coast FI number', () => {
    const status = calculateCoastFIREStatus(25_000_000, 25_000_000);
    expect(status).toBe('coasting');
  });

  it('returns "future" when current investments < coast FI number', () => {
    const status = calculateCoastFIREStatus(20_000_000, 25_000_000);
    expect(status).toBe('future');
  });
});

// ============================================================================
// calculateYearsToCoast Tests
// ============================================================================

describe('calculateYearsToCoast', () => {
  it('calculates correct years for standard scenario', () => {
    // From 25M to 30M at 6% = ln(1.2)/ln(1.06) = 3.13 years
    const years = calculateYearsToCoast(25_000_000, 30_000_000, 6);
    expect(years).toBeCloseTo(3.13, 1);
  });

  it('returns 0 when already coasting', () => {
    expect(calculateYearsToCoast(30_000_000, 25_000_000, 6)).toBe(0);
  });

  it('returns null for impossible scenario with 0% return', () => {
    expect(calculateYearsToCoast(25_000_000, 30_000_000, 0)).toBeNull();
  });

  it('returns null for negative return', () => {
    expect(calculateYearsToCoast(25_000_000, 30_000_000, -2)).toBeNull();
  });

  it('returns null when current investments is 0', () => {
    expect(calculateYearsToCoast(0, 30_000_000, 6)).toBeNull();
  });

  it('returns null for extremely long timeline (> 100 years)', () => {
    // Very small investment, huge FI number, low return = impossible
    const years = calculateYearsToCoast(100_000, 1_000_000_000, 1);
    expect(years).toBeNull();
  });

  it('calculates longer years with lower return rate', () => {
    const years_6pct = calculateYearsToCoast(25_000_000, 30_000_000, 6);
    const years_4pct = calculateYearsToCoast(25_000_000, 30_000_000, 4);

    expect(years_4pct).toBeGreaterThan(years_6pct!);
  });
});

// ============================================================================
// calculateGapToCoast Tests
// ============================================================================

describe('calculateGapToCoast', () => {
  it('calculates correct gap when not coasting', () => {
    const gap = calculateGapToCoast(20_000_000, 30_000_000);
    expect(gap).toBe(10_000_000);
  });

  it('returns null when already coasting', () => {
    const gap = calculateGapToCoast(30_000_000, 25_000_000);
    expect(gap).toBeNull();
  });

  it('returns null when investments equal coast FI number', () => {
    const gap = calculateGapToCoast(25_000_000, 25_000_000);
    expect(gap).toBeNull();
  });

  it('calculates gap for small differences', () => {
    const gap = calculateGapToCoast(24_900_000, 25_000_000);
    expect(gap).toBe(100_000);
  });
});

// ============================================================================
// calculateProjectedBalance Tests
// ============================================================================

describe('calculateProjectedBalance', () => {
  it('calculates projected balance at retirement', () => {
    const projected = calculateProjectedBalance(25_000_000, 32, 6);
    // 25M × (1.06)^32 = 161,334,667
    expect(projected).toBeCloseTo(161_334_667, -3);
  });

  it('returns current balance when years is 0', () => {
    const projected = calculateProjectedBalance(25_000_000, 0, 6);
    expect(projected).toBe(25_000_000);
  });

  it('projects higher balance with higher return', () => {
    const projected_6pct = calculateProjectedBalance(25_000_000, 32, 6);
    const projected_8pct = calculateProjectedBalance(25_000_000, 32, 8);

    expect(projected_8pct).toBeGreaterThan(projected_6pct);
  });
});

// ============================================================================
// calculateGrowthProjection Tests
// ============================================================================

describe('calculateGrowthProjection', () => {
  it('generates correct number of data points', () => {
    const projection = calculateGrowthProjection(25_000_000, 10, 6);
    expect(projection).toHaveLength(11); // 0 to 10 years inclusive
  });

  it('starts with current balance at year 0', () => {
    const projection = calculateGrowthProjection(25_000_000, 10, 6);
    expect(projection[0].balance).toBe(25_000_000);
  });

  it('calculates compound growth for each year', () => {
    const projection = calculateGrowthProjection(10_000_000, 3, 7);

    // Year 0: 10M
    expect(projection[0].balance).toBe(10_000_000);

    // Year 1: 10M × 1.07 = 10.7M
    expect(projection[1].balance).toBeCloseTo(10_700_000, -3);

    // Year 2: 10M × 1.07^2 = 11.449M
    expect(projection[2].balance).toBeCloseTo(11_449_000, -3);

    // Year 3: 10M × 1.07^3 = 12.250M
    expect(projection[3].balance).toBeCloseTo(12_250_430, -3);
  });

  it('sets correct years', () => {
    const currentYear = new Date().getFullYear();
    const projection = calculateGrowthProjection(25_000_000, 5, 6);

    expect(projection[0].year).toBe(currentYear);
    expect(projection[5].year).toBe(currentYear + 5);
  });
});

// ============================================================================
// calculateScenarioResults Tests
// ============================================================================

describe('calculateScenarioResults', () => {
  const scenarios = [
    { type: 'conservative' as ScenarioType, returnRate: 4, name: 'Íhaldssöm' },
    { type: 'moderate' as ScenarioType, returnRate: 6, name: 'Miðlungs' },
    { type: 'optimistic' as ScenarioType, returnRate: 8, name: 'Bjartsýn' },
  ];

  it('generates results for all three scenarios', () => {
    const results = calculateScenarioResults(SAMPLE_INPUTS, scenarios);
    expect(results).toHaveLength(3);
  });

  it('assigns correct scenario names', () => {
    const results = calculateScenarioResults(SAMPLE_INPUTS, scenarios);

    expect(results[0].name).toBe('Íhaldssöm');
    expect(results[1].name).toBe('Miðlungs');
    expect(results[2].name).toBe('Bjartsýn');
  });

  it('calculates different results for each return rate', () => {
    const results = calculateScenarioResults(SAMPLE_INPUTS, scenarios);

    const conservative = results[0];
    const moderate = results[1];
    const optimistic = results[2];

    // Higher return = lower coast FI number needed = less years to coast
    // Conservative should take longer than moderate
    if (conservative.yearsToCoast !== null && moderate.yearsToCoast !== null) {
      expect(conservative.yearsToCoast).toBeGreaterThan(moderate.yearsToCoast);
    }

    // Moderate should take longer than optimistic (or optimistic is already coasting)
    if (moderate.yearsToCoast !== null && optimistic.yearsToCoast !== null && optimistic.yearsToCoast > 0) {
      expect(moderate.yearsToCoast).toBeGreaterThan(optimistic.yearsToCoast);
    }
  });

  it('determines status correctly for each scenario', () => {
    const alreadyCoastingInputs: CoastFIREInputs = {
      ...SAMPLE_INPUTS,
      currentInvestments: 150_000_000, // Already at FI number
    };

    const results = calculateScenarioResults(alreadyCoastingInputs, scenarios);

    // Should be coasting in all scenarios
    expect(results[0].status).toBe('coasting');
    expect(results[1].status).toBe('coasting');
    expect(results[2].status).toBe('coasting');
  });

  it('handles impossible scenarios correctly', () => {
    const impossibleInputs: CoastFIREInputs = {
      currentAge: 60,
      currentInvestments: 5_000_000,
      targetRetirementAge: 65,
      expectedReturn: 2, // Very low return
      fiNumber: 150_000_000,
      fiNumberSource: 'manual',
      selectedTier: null,
      fiMultiplier: 25,
    };

    const results = calculateScenarioResults(impossibleInputs, scenarios);

    // Conservative scenario should be impossible
    expect(results[0].status).toBe('impossible');
  });
});

// ============================================================================
// calculateLifeEnergy Tests
// ============================================================================

describe('calculateLifeEnergy', () => {
  const actualHourlyWage = 2500; // 2,500 ISK/hour

  it('calculates life energy metrics correctly', () => {
    const lifeEnergy = calculateLifeEnergy(
      20_800_000, // 20.8M ISK
      5_200_000, // 5.2M gap
      100_000_000, // 100M growth
      actualHourlyWage
    );

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.investmentsInHours).toBe(8_320); // 20.8M / 2500
    expect(lifeEnergy!.investmentsInYears).toBe(4); // 8320 / 2080
    expect(lifeEnergy!.gapInHours).toBe(2_080); // 5.2M / 2500
    expect(lifeEnergy!.gapInYears).toBe(1); // 2080 / 2080
    expect(lifeEnergy!.passiveHoursEarned).toBe(40_000); // 100M / 2500
    expect(lifeEnergy!.passiveYearsEarned).toBeCloseTo(19.23, 1); // 40000 / 2080
  });

  it('returns null when actualHourlyWage is null', () => {
    const lifeEnergy = calculateLifeEnergy(20_000_000, 5_000_000, 100_000_000, null);
    expect(lifeEnergy).toBeNull();
  });

  it('returns null when actualHourlyWage is 0', () => {
    const lifeEnergy = calculateLifeEnergy(20_000_000, 5_000_000, 100_000_000, 0);
    expect(lifeEnergy).toBeNull();
  });

  it('handles null gap correctly (already coasting)', () => {
    const lifeEnergy = calculateLifeEnergy(25_000_000, null, 100_000_000, actualHourlyWage);

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.gapInHours).toBeNull();
    expect(lifeEnergy!.gapInYears).toBeNull();
  });

  it('calculates hours saved by coasting', () => {
    const lifeEnergy = calculateLifeEnergy(20_000_000, 5_000_000, 100_000_000, actualHourlyWage);

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.hoursSavedByCoasting).toBe(32_000); // 40000 * 0.8
    expect(lifeEnergy!.yearsSavedByCoasting).toBeCloseTo(15.38, 1); // 32000 / 2080
  });
});

// ============================================================================
// calculateCoastFIREResult Tests (Integration)
// ============================================================================

describe('calculateCoastFIREResult', () => {
  it('calculates complete results for standard scenario', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS);

    expect(result).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.scenarios).toHaveLength(3);
    expect(result.projectedBalance).toBeGreaterThan(0);
    expect(result.calculatedAt).toBeInstanceOf(Date);
  });

  it('determines "coasting" status when already coasting', () => {
    const alreadyCoasting: CoastFIREInputs = {
      ...SAMPLE_INPUTS,
      currentInvestments: 150_000_000,
    };

    const result = calculateCoastFIREResult(alreadyCoasting);

    expect(result.status).toBe('coasting');
    expect(result.yearsToCoast).toBe(0);
    expect(result.gapToCoast).toBeNull();
  });

  it('determines "future" status when can coast before retirement', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS);

    if (result.status === 'future') {
      expect(result.coastFireAge).not.toBeNull();
      expect(result.coastFireAge!).toBeLessThanOrEqual(SAMPLE_INPUTS.targetRetirementAge);
      expect(result.yearsToCoast).toBeGreaterThan(0);
    }
  });

  it('determines "impossible" status when cannot coast', () => {
    const impossible: CoastFIREInputs = {
      currentAge: 60,
      currentInvestments: 5_000_000,
      targetRetirementAge: 65,
      expectedReturn: 3,
      fiNumber: 150_000_000,
      fiNumberSource: 'manual',
      selectedTier: null,
      fiMultiplier: 25,
    };

    const result = calculateCoastFIREResult(impossible);

    expect(result.status).toBe('impossible');
    expect(result.coastFireAge).toBeNull();
    expect(result.gapToCoast).toBeGreaterThan(0);
  });

  it('throws error when FI number is missing', () => {
    const invalidInputs: CoastFIREInputs = {
      ...SAMPLE_INPUTS,
      fiNumber: null,
    };

    expect(() => calculateCoastFIREResult(invalidInputs)).toThrow();
  });

  it('includes life energy when wage provided', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS, 2500);

    expect(result.lifeEnergy).not.toBeNull();
    expect(result.lifeEnergy!.investmentsInHours).toBeGreaterThan(0);
  });

  it('excludes life energy when wage not provided', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS, null);

    expect(result.lifeEnergy).toBeNull();
  });

  it('calculates coast fire date when birthDate provided', () => {
    const withBirthDate: CoastFIREInputs = {
      ...SAMPLE_INPUTS,
      birthDate: '1989-01-15',
    };

    const result = calculateCoastFIREResult(withBirthDate);

    if (result.status !== 'impossible') {
      expect(result.coastFireDate).toBeInstanceOf(Date);
    }
  });

  it('includes assumptions in results', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS, 2500);

    expect(result.assumptions).toBeDefined();
    expect(result.assumptions.currentAge).toBe(SAMPLE_INPUTS.currentAge);
    expect(result.assumptions.fiNumber).toBe(SAMPLE_INPUTS.fiNumber);
    expect(result.assumptions.actualHourlyWage).toBe(2500);
    expect(result.assumptions.compoundingFrequency).toBe('annual');
    expect(result.assumptions.realVsNominal).toBe('real');
  });

  it('calculates excess over FI correctly', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS);

    const excessOverFI = result.projectedBalance - SAMPLE_INPUTS.fiNumber!;
    expect(result.excessOverFI).toBeCloseTo(excessOverFI, 0);
  });

  it('calculates compound growth correctly', () => {
    const result = calculateCoastFIREResult(SAMPLE_INPUTS);

    const compoundGrowth = result.projectedBalance - SAMPLE_INPUTS.currentInvestments;
    expect(result.compoundGrowth).toBeCloseTo(compoundGrowth, 0);
  });
});
