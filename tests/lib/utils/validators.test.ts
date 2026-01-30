import { describe, it, expect } from 'vitest';
import { validateInputs, validateField } from '@/lib/utils/validators';
import type { CalculatorInputs } from '@/types/calculator';

describe('validateInputs', () => {
  const validInputs: CalculatorInputs = {
    income: {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 38,
      vacationDays: 24,
      additionalIncome: 0,
    },
    moneyExpenses: {
      commute: 3000,
      clothing: 500,
      meals: 2000,
      decompression: 1000,
      childcareDelta: 0,
      other: 500,
    },
    timeExpenses: {
      commute: 5,
      gettingReady: 2,
      decompression: 3,
      workIllness: 1,
    },
  };

  it('should validate valid inputs successfully', () => {
    const result = validateInputs(validInputs);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should reject negative gross annual income', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, grossAnnualIncome: -1000 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.grossAnnualIncome']).toBe('Income must be positive');
  });

  it('should reject unusually high gross annual income', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, grossAnnualIncome: 150000000 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.grossAnnualIncome']).toBe('Income seems unusually high');
  });

  it('should reject work hours below minimum', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, workHoursPerWeek: 0 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.workHoursPerWeek']).toBe('Hours must be between 1 and 100');
  });

  it('should reject work hours above maximum', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, workHoursPerWeek: 101 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.workHoursPerWeek']).toBe('Hours must be between 1 and 100');
  });

  it('should reject negative vacation days', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, vacationDays: -1 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.vacationDays']).toBe('Vacation days must be between 0 and 60');
  });

  it('should reject vacation days above maximum', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, vacationDays: 61 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.vacationDays']).toBe('Vacation days must be between 0 and 60');
  });

  it('should reject negative additional income', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, additionalIncome: -500 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['income.additionalIncome']).toBe('Additional income cannot be negative');
  });

  it('should reject negative money expenses', () => {
    const inputs = {
      ...validInputs,
      moneyExpenses: { ...validInputs.moneyExpenses, commute: -100 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['moneyExpenses.commute']).toBe('Expenses cannot be negative');
  });

  it('should reject unusually high money expenses', () => {
    const inputs = {
      ...validInputs,
      moneyExpenses: { ...validInputs.moneyExpenses, meals: 1500000 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['moneyExpenses.meals']).toBe('Expense amount seems unusually high');
  });

  it('should reject negative time expenses', () => {
    const inputs = {
      ...validInputs,
      timeExpenses: { ...validInputs.timeExpenses, commute: -2 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['timeExpenses.commute']).toBe('Time cannot be negative');
  });

  it('should reject unusually high time expenses', () => {
    const inputs = {
      ...validInputs,
      timeExpenses: { ...validInputs.timeExpenses, gettingReady: 50 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(result.errors['timeExpenses.gettingReady']).toBe('Time seems unusually high (max 40 hours/week)');
  });

  it('should collect multiple validation errors', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, workHoursPerWeek: 0, vacationDays: 61 },
      moneyExpenses: { ...validInputs.moneyExpenses, commute: -100 },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(1);
  });

  it('should accept zero values for optional fields', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, additionalIncome: 0 },
      moneyExpenses: {
        commute: 0,
        clothing: 0,
        meals: 0,
        decompression: 0,
        childcareDelta: 0,
        other: 0,
      },
      timeExpenses: {
        commute: 0,
        gettingReady: 0,
        decompression: 0,
        workIllness: 0,
      },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(true);
  });

  it('should accept edge case valid values', () => {
    const inputs = {
      ...validInputs,
      income: { ...validInputs.income, workHoursPerWeek: 1, vacationDays: 60 },
      timeExpenses: {
        commute: 40,
        gettingReady: 0,
        decompression: 0,
        workIllness: 0,
      },
    };
    const result = validateInputs(inputs);
    expect(result.isValid).toBe(true);
  });
});

describe('validateField', () => {
  it('should reject negative values', () => {
    const error = validateField('income', 'grossAnnualIncome', -1000);
    expect(error).toBe('Value cannot be negative');
  });

  it('should validate work hours per week range', () => {
    expect(validateField('income', 'workHoursPerWeek', 0)).toBe('Hours must be between 1 and 100');
    expect(validateField('income', 'workHoursPerWeek', 101)).toBe('Hours must be between 1 and 100');
    expect(validateField('income', 'workHoursPerWeek', 40)).toBeNull();
  });

  it('should validate vacation days range', () => {
    // -1 first fails generic negative check
    expect(validateField('income', 'vacationDays', -1)).toBe('Value cannot be negative');
    expect(validateField('income', 'vacationDays', 61)).toBe('Vacation days must be between 0 and 60');
    expect(validateField('income', 'vacationDays', 24)).toBeNull();
  });

  it('should validate gross annual income upper limit', () => {
    expect(validateField('income', 'grossAnnualIncome', 150000000)).toBe('Income seems unusually high');
    expect(validateField('income', 'grossAnnualIncome', 50000)).toBeNull();
  });

  it('should validate money expenses upper limit', () => {
    expect(validateField('moneyExpenses', 'commute', 1500000)).toBe('Expense amount seems unusually high');
    expect(validateField('moneyExpenses', 'meals', 3000)).toBeNull();
  });

  it('should validate time expenses upper limit', () => {
    expect(validateField('timeExpenses', 'commute', 50)).toBe('Time seems unusually high (max 40 hours/week)');
    expect(validateField('timeExpenses', 'commute', 5)).toBeNull();
  });

  it('should accept zero for valid fields', () => {
    expect(validateField('income', 'additionalIncome', 0)).toBeNull();
    expect(validateField('moneyExpenses', 'clothing', 0)).toBeNull();
    expect(validateField('timeExpenses', 'gettingReady', 0)).toBeNull();
  });

  it('should return null for valid values', () => {
    expect(validateField('income', 'grossAnnualIncome', 75000)).toBeNull();
    expect(validateField('moneyExpenses', 'meals', 2500)).toBeNull();
    expect(validateField('timeExpenses', 'decompression', 5)).toBeNull();
  });
});
