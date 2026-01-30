/**
 * Tests for One-Time Purchase validation functions
 */

import { describe, test, expect } from 'vitest';
import { validatePurchaseInput, validateSettings } from './oneTimePurchaseValidation';
import type {
  PurchaseInput,
  PurchaseCalculationSettings,
} from '../../types/oneTimePurchase.types';

describe('validatePurchaseInput', () => {
  test('accepts valid input', () => {
    const input: PurchaseInput = {
      price: 2_000_000,
      name: 'Nýr bíll',
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('accepts valid input without name', () => {
    const input: PurchaseInput = {
      price: 500_000,
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(true);
  });

  test('rejects zero price', () => {
    const input: PurchaseInput = {
      price: 0,
      name: 'Test',
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Kaupverð verður að vera stærra en 0');
  });

  test('rejects negative price', () => {
    const input: PurchaseInput = {
      price: -100,
      name: 'Test',
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Kaupverð verður að vera stærra en 0');
  });

  test('rejects extremely high price', () => {
    const input: PurchaseInput = {
      price: 2_000_000_000,
      name: 'Too expensive',
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('óraunhæft'))).toBe(true);
  });

  test('rejects name longer than 100 characters', () => {
    const longName = 'A'.repeat(101);
    const input: PurchaseInput = {
      price: 1000,
      name: longName,
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Lýsing má vera að hámarki 100 stafir');
  });

  test('accepts name exactly 100 characters', () => {
    const maxLengthName = 'A'.repeat(100);
    const input: PurchaseInput = {
      price: 1000,
      name: maxLengthName,
    };

    const result = validatePurchaseInput(input);

    expect(result.isValid).toBe(true);
  });
});

describe('validateSettings', () => {
  test('accepts valid settings', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.07,
      futureValueYears: [10, 20, 30],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('accepts 0% return rate', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0,
      futureValueYears: [10],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(true);
  });

  test('accepts 15% return rate', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.15,
      futureValueYears: [10],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(true);
  });

  test('rejects negative return rate', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: -0.05,
      futureValueYears: [10],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Ávöxtunarkrafa getur ekki verið neikvæð');
  });

  test('rejects return rate above 15%', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.20,
      futureValueYears: [10],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('óraunhæft'))).toBe(true);
  });

  test('rejects empty future value years', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.07,
      futureValueYears: [],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('tímabil'))).toBe(true);
  });

  test('rejects negative years', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.07,
      futureValueYears: [10, -5, 30],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Öll tímabil verða að vera jákvæð');
  });

  test('rejects zero years', () => {
    const settings: PurchaseCalculationSettings = {
      expectedReturnRate: 0.07,
      futureValueYears: [0, 10],
    };

    const result = validateSettings(settings);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Öll tímabil verða að vera jákvæð');
  });
});
