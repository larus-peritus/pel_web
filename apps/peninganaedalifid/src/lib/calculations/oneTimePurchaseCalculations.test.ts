/**
 * Tests for One-Time Purchase calculations
 */

import { describe, test, expect } from 'vitest';
import {
  calculateLifeEnergyCost,
  formatLifeEnergy,
  calculateFutureValue,
  calculateFutureValues,
  formatCurrency,
  calculateFIImpact,
  formatDelay,
  calculatePurchaseResult,
  compareOptions,
} from './oneTimePurchaseCalculations';
import type {
  PurchaseInput,
  RequiredUserData,
  PurchaseCalculationSettings,
} from '../../types/oneTimePurchase.types';
import { DEFAULT_SETTINGS } from '../../types/oneTimePurchase.types';

describe('calculateLifeEnergyCost', () => {
  test('calculates correctly for typical purchase', () => {
    const result = calculateLifeEnergyCost(2_000_000, 4500);
    expect(result.totalHours).toBeCloseTo(444.44, 1);
    expect(result.workDays).toBeCloseTo(55.56, 1);
    expect(result.workWeeks).toBeCloseTo(11.11, 1);
    expect(result.formattedString).toBeDefined();
  });

  test('calculates exactly 1 week', () => {
    const result = calculateLifeEnergyCost(180_000, 4500);
    expect(result.totalHours).toBe(40);
    expect(result.workWeeks).toBe(1);
    expect(result.formattedString).toBe('1 vika');
  });

  test('calculates exactly 2 weeks', () => {
    const result = calculateLifeEnergyCost(360_000, 4500);
    expect(result.totalHours).toBe(80);
    expect(result.workWeeks).toBe(2);
    expect(result.formattedString).toBe('2 vikur');
  });

  test('throws error for zero wage', () => {
    expect(() => calculateLifeEnergyCost(1000, 0)).toThrow();
  });

  test('throws error for negative wage', () => {
    expect(() => calculateLifeEnergyCost(1000, -100)).toThrow();
  });
});

describe('formatLifeEnergy', () => {
  test('formats small amounts in hours with decimal', () => {
    expect(formatLifeEnergy(3.5)).toBe('3.5 klukkustundir');
    expect(formatLifeEnergy(0.5)).toBe('0.5 klukkustundir');
  });

  test('formats exactly 1 hour', () => {
    expect(formatLifeEnergy(1)).toBe('1 klukkustund');
  });

  test('formats less than 8 hours', () => {
    expect(formatLifeEnergy(5)).toBe('5 klukkustundir');
  });

  test('formats exactly 1 day', () => {
    expect(formatLifeEnergy(8)).toBe('1 dagur');
  });

  test('formats exactly 1 week', () => {
    expect(formatLifeEnergy(40)).toBe('1 vika');
  });

  test('formats exactly 2 weeks (no trailing zeros)', () => {
    expect(formatLifeEnergy(80)).toBe('2 vikur');
  });

  test('formats weeks and days', () => {
    expect(formatLifeEnergy(88)).toBe('2 vikur og 1 dagur');
  });

  test('formats weeks, days, and hours', () => {
    expect(formatLifeEnergy(90)).toBe('2 vikur og 1 dagur og 2 klukkustundir');
  });

  test('formats negative as zero', () => {
    expect(formatLifeEnergy(-10)).toBe('0 klukkustundir');
  });

  test('formats zero', () => {
    expect(formatLifeEnergy(0)).toBe('0 klukkustundir');
  });

  test('handles singular and plural correctly', () => {
    expect(formatLifeEnergy(41)).toContain('1 vika og 1 klukkustund');
    expect(formatLifeEnergy(42)).toContain('1 vika og 2 klukkustundir');
    expect(formatLifeEnergy(48)).toContain('1 vika og 1 dagur');
    expect(formatLifeEnergy(56)).toContain('1 vika og 2 dagar');
  });
});

describe('calculateFutureValue', () => {
  test('calculates correctly for 10 years at 7%', () => {
    const result = calculateFutureValue(2_000_000, 0.07, 10);
    expect(result).toBeCloseTo(3_934_303, 0);
  });

  test('returns principal at 0% return', () => {
    const result = calculateFutureValue(2_000_000, 0, 10);
    expect(result).toBe(2_000_000);
  });

  test('calculates correctly for 20 years at 10%', () => {
    const result = calculateFutureValue(1_000_000, 0.1, 20);
    expect(result).toBeCloseTo(6_727_500, 0);
  });

  test('handles fractional years', () => {
    const result = calculateFutureValue(1_000_000, 0.07, 5.5);
    expect(result).toBeGreaterThan(1_000_000);
  });
});

describe('calculateFutureValues', () => {
  test('calculates all three default periods', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.07,
      futureValueYears: [10, 20, 30],
    };
    const results = calculateFutureValues(2_000_000, settings);

    expect(results).toHaveLength(3);
    expect(results[0].years).toBe(10);
    expect(results[1].years).toBe(20);
    expect(results[2].years).toBe(30);
    expect(results[0].value).toBeCloseTo(3_934_303, 0);
  });

  test('includes formatted values', () => {
    const settings = DEFAULT_SETTINGS;
    const results = calculateFutureValues(2_000_000, settings);

    results.forEach((result) => {
      expect(result.formattedValue).toContain('kr');
    });
  });
});

describe('formatCurrency', () => {
  test('formats with thousands separator', () => {
    expect(formatCurrency(2_000_000)).toBe('2.000.000 kr');
  });

  test('formats small amounts', () => {
    expect(formatCurrency(1500)).toBe('1.500 kr');
  });

  test('rounds to nearest integer', () => {
    expect(formatCurrency(1234.56)).toBe('1.235 kr');
  });

  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('0 kr');
  });
});

describe('calculateFIImpact', () => {
  test('calculates delay correctly', () => {
    const lifeEnergyCost = {
      totalHours: 444,
      workDays: 55,
      workWeeks: 11,
      formattedString: '',
    };
    const fiData = { annualSavings: 1_200_000 };

    const result = calculateFIImpact(2_000_000, lifeEnergyCost, fiData);

    expect(result).toBeDefined();
    expect(result!.additionalWorkHours).toBe(444);
    expect(result!.delayMonths).toBeCloseTo(20, 0);
    expect(result!.delayDays).toBeGreaterThan(0);
    expect(result!.formattedDelay).toBeDefined();
  });

  test('returns undefined if no fiData', () => {
    const lifeEnergyCost = {
      totalHours: 444,
      workDays: 55,
      workWeeks: 11,
      formattedString: '',
    };
    const result = calculateFIImpact(2_000_000, lifeEnergyCost, undefined);

    expect(result).toBeUndefined();
  });

  test('returns undefined if annualSavings is zero', () => {
    const lifeEnergyCost = {
      totalHours: 444,
      workDays: 55,
      workWeeks: 11,
      formattedString: '',
    };
    const fiData = { annualSavings: 0 };

    const result = calculateFIImpact(2_000_000, lifeEnergyCost, fiData);

    expect(result).toBeUndefined();
  });

  test('returns undefined if annualSavings is negative', () => {
    const lifeEnergyCost = {
      totalHours: 444,
      workDays: 55,
      workWeeks: 11,
      formattedString: '',
    };
    const fiData = { annualSavings: -1000 };

    const result = calculateFIImpact(2_000_000, lifeEnergyCost, fiData);

    expect(result).toBeUndefined();
  });
});

describe('formatDelay', () => {
  test('formats months only', () => {
    expect(formatDelay(3)).toBe('3 mánuðir');
    expect(formatDelay(1)).toBe('1 mánuður');
    expect(formatDelay(6)).toBe('6 mánuðir');
  });

  test('formats exact years', () => {
    expect(formatDelay(12)).toBe('1 ár');
    expect(formatDelay(24)).toBe('2 ár');
  });

  test('formats years and months', () => {
    expect(formatDelay(18)).toBe('1 ár og 6 mánuðir');
    expect(formatDelay(13)).toBe('1 ár og 1 mánuður');
    expect(formatDelay(26)).toBe('2 ár og 2 mánuðir');
  });
});

describe('calculatePurchaseResult', () => {
  const mockUserData: RequiredUserData = {
    actualHourlyWage: 4500,
    fiData: {
      annualSavings: 1_200_000,
    },
  };

  const mockInput: PurchaseInput = {
    price: 2_000_000,
    name: 'Nýr bíll',
  };

  test('calculates complete result with all data', () => {
    const result = calculatePurchaseResult(
      mockInput,
      mockUserData,
      DEFAULT_SETTINGS,
    );

    expect(result.input).toEqual(mockInput);
    expect(result.lifeEnergyCost.totalHours).toBeCloseTo(444.44, 1);
    expect(result.futureValues).toHaveLength(3);
    expect(result.fiImpact).toBeDefined();
  });

  test('calculates without FI data', () => {
    const userDataNoFI: RequiredUserData = {
      actualHourlyWage: 4500,
    };

    const result = calculatePurchaseResult(
      mockInput,
      userDataNoFI,
      DEFAULT_SETTINGS,
    );

    expect(result.lifeEnergyCost.totalHours).toBeCloseTo(444.44, 1);
    expect(result.futureValues).toHaveLength(3);
    expect(result.fiImpact).toBeUndefined();
  });

  test('throws error if actualHourlyWage missing', () => {
    const invalidUserData: RequiredUserData = {
      actualHourlyWage: null,
    };

    expect(() =>
      calculatePurchaseResult(mockInput, invalidUserData, DEFAULT_SETTINGS),
    ).toThrow('Raunverulegt tímakaup vantar');
  });

  test('throws error if price is zero', () => {
    const invalidInput: PurchaseInput = {
      price: 0,
      name: 'Test',
    };

    expect(() =>
      calculatePurchaseResult(invalidInput, mockUserData, DEFAULT_SETTINGS),
    ).toThrow('Kaupverð verður að vera stærra en 0');
  });

  test('throws error if price is negative', () => {
    const invalidInput: PurchaseInput = {
      price: -1000,
      name: 'Test',
    };

    expect(() =>
      calculatePurchaseResult(invalidInput, mockUserData, DEFAULT_SETTINGS),
    ).toThrow('Kaupverð verður að vera stærra en 0');
  });
});

describe('compareOptions', () => {
  const mockUserData: RequiredUserData = {
    actualHourlyWage: 4500,
  };

  test('compares two options correctly', () => {
    const options: PurchaseInput[] = [
      { price: 2_000_000, name: 'Option 1' },
      { price: 1_500_000, name: 'Option 2' },
    ];

    const result = compareOptions(options, mockUserData, DEFAULT_SETTINGS);

    expect(result.options).toHaveLength(2);
    expect(result.cheapestOptionIndex).toBe(1); // Option 2 is cheaper
    expect(result.maxLifeEnergyDifference).toBeGreaterThan(0);
  });

  test('compares three options correctly', () => {
    const options: PurchaseInput[] = [
      { price: 2_000_000, name: 'Option 1' },
      { price: 1_500_000, name: 'Option 2' },
      { price: 2_500_000, name: 'Option 3' },
    ];

    const result = compareOptions(options, mockUserData, DEFAULT_SETTINGS);

    expect(result.options).toHaveLength(3);
    expect(result.cheapestOptionIndex).toBe(1);
    expect(result.maxLifeEnergyDifference).toBeCloseTo(
      (1_000_000 / 4500),
      1,
    ); // 2.5M - 1.5M = 1M difference
  });

  test('throws error if actualHourlyWage missing', () => {
    const invalidUserData: RequiredUserData = {
      actualHourlyWage: null,
    };
    const options: PurchaseInput[] = [
      { price: 1000, name: 'Option 1' },
    ];

    expect(() =>
      compareOptions(options, invalidUserData, DEFAULT_SETTINGS),
    ).toThrow();
  });
});
