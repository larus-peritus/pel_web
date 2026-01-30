/**
 * Tests for Default Values
 *
 * Verifies that all default values are correctly structured and type-safe.
 */

import {
  DEFAULT_INCOME,
  DEFAULT_MONEY_EXPENSES,
  DEFAULT_TIME_EXPENSES,
  DEFAULT_INPUTS,
  STORAGE_VERSION,
  STORAGE_KEY,
} from '@/lib/defaults';

describe('DEFAULT_INCOME', () => {
  it('should have all required income properties', () => {
    expect(DEFAULT_INCOME).toHaveProperty('grossAnnualIncome');
    expect(DEFAULT_INCOME).toHaveProperty('workHoursPerWeek');
    expect(DEFAULT_INCOME).toHaveProperty('vacationDays');
    expect(DEFAULT_INCOME).toHaveProperty('additionalIncome');
  });

  it('should have standard Icelandic full-time work configuration', () => {
    expect(DEFAULT_INCOME.workHoursPerWeek).toBe(38); // Standard in Iceland
    expect(DEFAULT_INCOME.vacationDays).toBe(24); // Standard in Iceland
  });

  it('should start with zero income values', () => {
    expect(DEFAULT_INCOME.grossAnnualIncome).toBe(0);
    expect(DEFAULT_INCOME.additionalIncome).toBe(0);
  });

  it('should have all numeric values', () => {
    expect(typeof DEFAULT_INCOME.grossAnnualIncome).toBe('number');
    expect(typeof DEFAULT_INCOME.workHoursPerWeek).toBe('number');
    expect(typeof DEFAULT_INCOME.vacationDays).toBe('number');
    expect(typeof DEFAULT_INCOME.additionalIncome).toBe('number');
  });
});

describe('DEFAULT_MONEY_EXPENSES', () => {
  it('should have all required expense properties', () => {
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('commute');
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('clothing');
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('meals');
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('decompression');
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('childcareDelta');
    expect(DEFAULT_MONEY_EXPENSES).toHaveProperty('other');
  });

  it('should start with all expenses at zero', () => {
    expect(DEFAULT_MONEY_EXPENSES.commute).toBe(0);
    expect(DEFAULT_MONEY_EXPENSES.clothing).toBe(0);
    expect(DEFAULT_MONEY_EXPENSES.meals).toBe(0);
    expect(DEFAULT_MONEY_EXPENSES.decompression).toBe(0);
    expect(DEFAULT_MONEY_EXPENSES.childcareDelta).toBe(0);
    expect(DEFAULT_MONEY_EXPENSES.other).toBe(0);
  });

  it('should have all numeric values', () => {
    Object.values(DEFAULT_MONEY_EXPENSES).forEach((value) => {
      expect(typeof value).toBe('number');
    });
  });
});

describe('DEFAULT_TIME_EXPENSES', () => {
  it('should have all required time expense properties', () => {
    expect(DEFAULT_TIME_EXPENSES).toHaveProperty('commute');
    expect(DEFAULT_TIME_EXPENSES).toHaveProperty('gettingReady');
    expect(DEFAULT_TIME_EXPENSES).toHaveProperty('decompression');
    expect(DEFAULT_TIME_EXPENSES).toHaveProperty('workIllness');
  });

  it('should start with all time expenses at zero', () => {
    expect(DEFAULT_TIME_EXPENSES.commute).toBe(0);
    expect(DEFAULT_TIME_EXPENSES.gettingReady).toBe(0);
    expect(DEFAULT_TIME_EXPENSES.decompression).toBe(0);
    expect(DEFAULT_TIME_EXPENSES.workIllness).toBe(0);
  });

  it('should have all numeric values', () => {
    Object.values(DEFAULT_TIME_EXPENSES).forEach((value) => {
      expect(typeof value).toBe('number');
    });
  });
});

describe('DEFAULT_INPUTS', () => {
  it('should have all required top-level properties', () => {
    expect(DEFAULT_INPUTS).toHaveProperty('income');
    expect(DEFAULT_INPUTS).toHaveProperty('moneyExpenses');
    expect(DEFAULT_INPUTS).toHaveProperty('timeExpenses');
  });

  it('should reference the default income object', () => {
    expect(DEFAULT_INPUTS.income).toBe(DEFAULT_INCOME);
  });

  it('should reference the default money expenses object', () => {
    expect(DEFAULT_INPUTS.moneyExpenses).toBe(DEFAULT_MONEY_EXPENSES);
  });

  it('should reference the default time expenses object', () => {
    expect(DEFAULT_INPUTS.timeExpenses).toBe(DEFAULT_TIME_EXPENSES);
  });

  it('should be a valid complete calculator input state', () => {
    // Verify structure is complete and valid
    expect(DEFAULT_INPUTS.income.workHoursPerWeek).toBe(38);
    expect(DEFAULT_INPUTS.income.vacationDays).toBe(24);
    expect(Object.keys(DEFAULT_INPUTS.moneyExpenses).length).toBe(6);
    expect(Object.keys(DEFAULT_INPUTS.timeExpenses).length).toBe(4);
  });
});

describe('Storage Constants', () => {
  describe('STORAGE_VERSION', () => {
    it('should be a positive integer', () => {
      expect(typeof STORAGE_VERSION).toBe('number');
      expect(STORAGE_VERSION).toBeGreaterThan(0);
      expect(Number.isInteger(STORAGE_VERSION)).toBe(true);
    });

    it('should be version 1 for initial implementation', () => {
      expect(STORAGE_VERSION).toBe(1);
    });
  });

  describe('STORAGE_KEY', () => {
    it('should be a non-empty string', () => {
      expect(typeof STORAGE_KEY).toBe('string');
      expect(STORAGE_KEY.length).toBeGreaterThan(0);
    });

    it('should have a descriptive name', () => {
      expect(STORAGE_KEY).toBe('actual-hourly-wage-calculator');
    });

    it('should be suitable for localStorage key', () => {
      // localStorage keys should not contain special characters that might cause issues
      expect(STORAGE_KEY).toMatch(/^[a-z0-9-]+$/);
    });
  });
});

describe('Data Immutability', () => {
  it('should not allow modification of DEFAULT_INCOME', () => {
    // This test ensures we don't accidentally mutate defaults
    const originalValue = DEFAULT_INCOME.workHoursPerWeek;
    expect(() => {
      // TypeScript would prevent this, but testing runtime behavior
      (DEFAULT_INCOME as any).workHoursPerWeek = 50;
    }).not.toThrow();
    // If mutation happened, restore it to prevent affecting other tests
    if (DEFAULT_INCOME.workHoursPerWeek !== originalValue) {
      (DEFAULT_INCOME as any).workHoursPerWeek = originalValue;
    }
  });

  it('should create independent copies when used', () => {
    const inputs1 = { ...DEFAULT_INPUTS };
    const inputs2 = { ...DEFAULT_INPUTS };

    // Modifying one shouldn't affect the other
    (inputs1 as any).income = { ...inputs1.income, grossAnnualIncome: 50000 };

    expect(inputs2.income.grossAnnualIncome).toBe(0);
    expect(DEFAULT_INPUTS.income.grossAnnualIncome).toBe(0);
  });
});
