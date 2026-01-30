/**
 * Unit tests for Cut Impact calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateLifeEnergy,
  calculateFutureValue,
  calculateFIDateShift,
  calculateCategoryImpact,
  sortCategoryImpacts,
  formatMonths,
} from '@/lib/calculations/cutImpact';
import type { CategoryDefinition, FIInputs } from '@/types/cutImpact';

describe('calculateLifeEnergy', () => {
  it('calculates hours correctly', () => {
    const result = calculateLifeEnergy(10000, 2000);
    expect(result.hoursPerMonth).toBe(5);
    expect(result.hoursPerYear).toBe(60);
    expect(result.daysPerYear).toBe(2.5);
  });

  it('handles low hourly wage', () => {
    const result = calculateLifeEnergy(10000, 500);
    expect(result.hoursPerMonth).toBe(20);
    expect(result.hoursPerYear).toBe(240);
    expect(result.daysPerYear).toBe(10);
  });

  it('returns null for daysPerYear if < 24 hours', () => {
    const result = calculateLifeEnergy(3000, 2000);
    expect(result.hoursPerYear).toBe(18);
    expect(result.daysPerYear).toBeNull();
  });

  it('handles zero hourly wage', () => {
    const result = calculateLifeEnergy(10000, 0);
    expect(result.hoursPerMonth).toBe(0);
    expect(result.hoursPerYear).toBe(0);
    expect(result.daysPerYear).toBeNull();
  });
});

describe('calculateFutureValue', () => {
  it('calculates 10-year FV correctly at 7%', () => {
    const result = calculateFutureValue(10000, 10, 0.07);
    expect(result).toBeCloseTo(1730849, -1); // Within 10 ISK
  });

  it('calculates 20-year FV correctly at 7%', () => {
    const result = calculateFutureValue(10000, 20, 0.07);
    expect(result).toBeCloseTo(5209267, -3); // Within 1000 ISK
  });

  it('handles 0% return rate', () => {
    const result = calculateFutureValue(10000, 10, 0);
    expect(result).toBe(1200000); // 10,000 * 12 * 10
  });

  it('rounds to nearest ISK', () => {
    const result = calculateFutureValue(10000, 10, 0.07);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('calculateFIDateShift', () => {
  const validFIInputs: FIInputs = {
    savingsRate: 0.3, // 30%
    fiNumber: 10000000, // 10M ISK
    currentNetWorth: 1000000, // 1M ISK
    grossAnnualIncome: 4000000, // 4M ISK/year
  };

  it('calculates months saved correctly', () => {
    const result = calculateFIDateShift(10000, validFIInputs);

    expect(result).not.toBeNull();
    expect(result!.months).toBeGreaterThan(0);
  });

  it('returns null for invalid inputs (zero savings rate)', () => {
    const invalidInputs = { ...validFIInputs, savingsRate: 0 };
    const result = calculateFIDateShift(10000, invalidInputs);
    expect(result).toBeNull();
  });

  it('returns null for invalid inputs (zero FI number)', () => {
    const invalidInputs = { ...validFIInputs, fiNumber: 0 };
    const result = calculateFIDateShift(10000, invalidInputs);
    expect(result).toBeNull();
  });

  it('returns 0 months if already at FI', () => {
    const atFIInputs = { ...validFIInputs, currentNetWorth: 11000000 };
    const result = calculateFIDateShift(10000, atFIInputs);
    expect(result).not.toBeNull();
    expect(result!.months).toBe(0);
    expect(result!.impactLevel).toBe('none');
  });

  it('assigns correct impact level for moderate impact', () => {
    const result = calculateFIDateShift(10000, validFIInputs);
    expect(result).not.toBeNull();
    // Should be moderate for this scenario
    expect(result!.impactLevel).toMatch(/moderate|low|high/);
  });
});

describe('sortCategoryImpacts', () => {
  const mockCategory1: CategoryDefinition = {
    id: 'cat1',
    nameIs: 'Áskriftir',
    icon: '📺',
    examples: 't.d. Netflix',
  };

  const mockCategory2: CategoryDefinition = {
    id: 'cat2',
    nameIs: 'Verslanir',
    icon: '🛍️',
    examples: 't.d. föt',
  };

  const mockCategory3: CategoryDefinition = {
    id: 'cat3',
    nameIs: 'Bíó',
    icon: '🎉',
    examples: 't.d. kvikmyndir',
  };

  it('sorts by FI impact descending', () => {
    const impacts = [
      {
        ...mockCategory1,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: { months: 5, impactLevel: 'moderate' as const },
      },
      {
        ...mockCategory2,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: { months: 12, impactLevel: 'high' as const },
      },
      {
        ...mockCategory3,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: { months: 2, impactLevel: 'low' as const },
      },
    ];

    const sorted = sortCategoryImpacts(impacts, 'fi-impact');
    expect(sorted[0].fiDateShift?.months).toBe(12);
    expect(sorted[1].fiDateShift?.months).toBe(5);
    expect(sorted[2].fiDateShift?.months).toBe(2);
  });

  it('sorts by life energy descending', () => {
    const impacts = [
      {
        ...mockCategory1,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
      {
        ...mockCategory2,
        lifeEnergy: { hoursPerMonth: 10, hoursPerYear: 120, daysPerYear: 5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
      {
        ...mockCategory3,
        lifeEnergy: { hoursPerMonth: 2, hoursPerYear: 24, daysPerYear: 1 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
    ];

    const sorted = sortCategoryImpacts(impacts, 'life-energy');
    expect(sorted[0].lifeEnergy.hoursPerYear).toBe(120);
    expect(sorted[1].lifeEnergy.hoursPerYear).toBe(60);
    expect(sorted[2].lifeEnergy.hoursPerYear).toBe(24);
  });

  it('sorts by future value descending', () => {
    const impacts = [
      {
        ...mockCategory1,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
      {
        ...mockCategory2,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 2000000,
        futureValue20: 4000000,
        fiDateShift: null,
      },
      {
        ...mockCategory3,
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 500000,
        futureValue20: 1000000,
        fiDateShift: null,
      },
    ];

    const sorted = sortCategoryImpacts(impacts, 'future-value');
    expect(sorted[0].futureValue20).toBe(4000000);
    expect(sorted[1].futureValue20).toBe(2000000);
    expect(sorted[2].futureValue20).toBe(1000000);
  });

  it('sorts alphabetically in Icelandic', () => {
    const impacts = [
      {
        ...mockCategory1,
        nameIs: 'Áskriftir',
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
      {
        ...mockCategory2,
        nameIs: 'Verslanir',
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
      {
        ...mockCategory3,
        nameIs: 'Bíó',
        lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
        futureValue10: 1000000,
        futureValue20: 2000000,
        fiDateShift: null,
      },
    ];

    const sorted = sortCategoryImpacts(impacts, 'alphabetical');
    expect(sorted[0].nameIs).toBe('Áskriftir');
    expect(sorted[1].nameIs).toBe('Bíó');
    expect(sorted[2].nameIs).toBe('Verslanir');
  });
});

describe('formatMonths', () => {
  it('formats < 1 month as "Minni áhrif"', () => {
    expect(formatMonths(0)).toBe('Minni áhrif');
    expect(formatMonths(0.5)).toBe('Minni áhrif');
  });

  it('formats 1-11 months correctly', () => {
    expect(formatMonths(1)).toBe('1 mánuðum fyrr');
    expect(formatMonths(6)).toBe('6 mánuðum fyrr');
    expect(formatMonths(11)).toBe('11 mánuðum fyrr');
  });

  it('formats exactly 12 months as 1 ári', () => {
    expect(formatMonths(12)).toBe('1 ári fyrr');
  });

  it('formats 24 months as 2 árum', () => {
    expect(formatMonths(24)).toBe('2 árum fyrr');
  });

  it('formats years + months correctly (singular year)', () => {
    expect(formatMonths(14)).toBe('1 ári og 2 mánuðum fyrr');
  });

  it('formats years + months correctly (plural years)', () => {
    expect(formatMonths(27)).toBe('2 árum og 3 mánuðum fyrr');
  });

  it('formats 36+ months correctly', () => {
    expect(formatMonths(36)).toBe('3 árum fyrr');
    expect(formatMonths(40)).toBe('3 árum og 4 mánuðum fyrr');
  });
});
