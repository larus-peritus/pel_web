/**
 * Tests for Core Wage Calculation Functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateNominalWage,
  calculateTotalMoneyExpenses,
  calculateTotalExtraTime,
  calculateActualWage,
  calculateResults,
} from '@/lib/calculations/wage';
import type {
  IncomeInputs,
  MoneyExpenses,
  TimeExpenses,
  CalculatorInputs,
} from '@/types/calculator';

describe('calculateNominalWage', () => {
  it('should calculate $25/hr for $50,000 at 40hrs/week for 50 weeks', () => {
    const income: IncomeInputs = {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 10,
      additionalIncome: 0,
    };

    const result = calculateNominalWage(income);
    expect(result).toBe(25);
  });

  it('should return 0 when hours are zero', () => {
    const income: IncomeInputs = {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 0,
      vacationDays: 10,
      additionalIncome: 0,
    };

    const result = calculateNominalWage(income);
    expect(result).toBe(0);
  });

  it('should return 0 when all vacation (260 days = 0 work weeks)', () => {
    const income: IncomeInputs = {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 260, // 52 - 260/5 = 0 work weeks
      additionalIncome: 0,
    };

    const result = calculateNominalWage(income);
    expect(result).toBe(0);
  });

  it('should include additional income in calculation', () => {
    const income: IncomeInputs = {
      grossAnnualIncome: 50000,
      workHoursPerWeek: 40,
      vacationDays: 10,
      additionalIncome: 10000, // +$10k bonus
    };

    // ($50,000 + $10,000) / 2000 hours = $30/hr
    const result = calculateNominalWage(income);
    expect(result).toBe(30);
  });

  it('should handle part-time work correctly', () => {
    const income: IncomeInputs = {
      grossAnnualIncome: 25000,
      workHoursPerWeek: 20, // Part-time
      vacationDays: 10,
      additionalIncome: 0,
    };

    // $25,000 / (20 * 50) = $25/hr
    const result = calculateNominalWage(income);
    expect(result).toBe(25);
  });
});

describe('calculateTotalMoneyExpenses', () => {
  it('should sum all expense categories correctly', () => {
    const expenses: MoneyExpenses = {
      commute: 2400,
      clothing: 500,
      meals: 1300,
      decompression: 800,
      childcareDelta: 0,
      other: 200,
    };

    const result = calculateTotalMoneyExpenses(expenses);
    expect(result).toBe(5200);
  });

  it('should return 0 when all expenses are zero', () => {
    const expenses: MoneyExpenses = {
      commute: 0,
      clothing: 0,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const result = calculateTotalMoneyExpenses(expenses);
    expect(result).toBe(0);
  });

  it('should handle single expense category', () => {
    const expenses: MoneyExpenses = {
      commute: 3600, // Only commute expense
      clothing: 0,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const result = calculateTotalMoneyExpenses(expenses);
    expect(result).toBe(3600);
  });

  it('should handle large expense values', () => {
    const expenses: MoneyExpenses = {
      commute: 5000,
      clothing: 2000,
      meals: 3000,
      decompression: 1500,
      childcareDelta: 10000, // Significant childcare costs
      other: 1000,
    };

    const result = calculateTotalMoneyExpenses(expenses);
    expect(result).toBe(22500);
  });
});

describe('calculateTotalExtraTime', () => {
  it('should sum all time categories correctly', () => {
    const time: TimeExpenses = {
      commute: 5,
      gettingReady: 2.5,
      decompression: 3,
      workIllness: 0.5,
    };

    const result = calculateTotalExtraTime(time);
    expect(result).toBe(11);
  });

  it('should return 0 when all time expenses are zero', () => {
    const time: TimeExpenses = {
      commute: 0,
      gettingReady: 0,
      decompression: 0,
      workIllness: 0,
    };

    const result = calculateTotalExtraTime(time);
    expect(result).toBe(0);
  });

  it('should handle decimal hour values', () => {
    const time: TimeExpenses = {
      commute: 7.5, // 7.5 hours per week
      gettingReady: 3.25,
      decompression: 4.75,
      workIllness: 1.0,
    };

    const result = calculateTotalExtraTime(time);
    expect(result).toBe(16.5);
  });
});

describe('calculateActualWage', () => {
  it('should reduce wage when expenses are present', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
      moneyExpenses: {
        commute: 2400,
        clothing: 500,
        meals: 1300,
        decompression: 800,
        childcareDelta: 0,
        other: 200,
      },
      timeExpenses: {
        commute: 0,
        gettingReady: 0,
        decompression: 0,
        workIllness: 0,
      },
    };

    // Nominal: $50,000 / 2000h = $25/hr
    // Actual: ($50,000 - $5,200) / 2000h = $22.40/hr
    const result = calculateActualWage(inputs);
    expect(result).toBe(22.4);
  });

  it('should reduce wage when extra time is present', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
      moneyExpenses: {
        commute: 0,
        clothing: 0,
        meals: 0,
        decompression: 0,
        childcareDelta: 0,
        other: 0,
      },
      timeExpenses: {
        commute: 5, // 5 extra hours per week
        gettingReady: 2.5,
        decompression: 3,
        workIllness: 0.5,
      },
    };

    // Nominal: $50,000 / 2000h = $25/hr
    // Actual: $50,000 / (40 + 11)h * 50 weeks = $50,000 / 2550h = $19.607...
    const result = calculateActualWage(inputs);
    expect(result).toBeCloseTo(19.607843137254903, 2);
  });

  it('should reduce wage when both expenses and extra time are present', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
      moneyExpenses: {
        commute: 2400,
        clothing: 500,
        meals: 1300,
        decompression: 800,
        childcareDelta: 0,
        other: 200,
      },
      timeExpenses: {
        commute: 5,
        gettingReady: 2.5,
        decompression: 3,
        workIllness: 0.5,
      },
    };

    // Nominal: $50,000 / 2000h = $25/hr
    // Actual: ($50,000 - $5,200) / (40 + 11)h * 50 weeks = $44,800 / 2550h = $17.568...
    const result = calculateActualWage(inputs);
    expect(result).toBeCloseTo(17.568627450980394, 2);
  });

  it('should handle zero hours gracefully', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 0,
        vacationDays: 10,
        additionalIncome: 0,
      },
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

    const result = calculateActualWage(inputs);
    expect(result).toBe(0);
  });

  it('should return same as nominal when no expenses or extra time', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
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

    const result = calculateActualWage(inputs);
    expect(result).toBe(25); // Same as nominal
  });
});

describe('calculateResults', () => {
  it('should return complete calculation results object', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
      moneyExpenses: {
        commute: 2400,
        clothing: 500,
        meals: 1300,
        decompression: 800,
        childcareDelta: 0,
        other: 200,
      },
      timeExpenses: {
        commute: 5,
        gettingReady: 2.5,
        decompression: 3,
        workIllness: 0.5,
      },
    };

    const results = calculateResults(inputs);

    // Verify structure
    expect(results).toHaveProperty('nominalHourlyWage');
    expect(results).toHaveProperty('actualHourlyWage');
    expect(results).toHaveProperty('percentageReduction');
    expect(results).toHaveProperty('netAnnualIncome');
    expect(results).toHaveProperty('totalMoneyExpenses');
    expect(results).toHaveProperty('baseWeeklyHours');
    expect(results).toHaveProperty('totalWeeklyHours');
    expect(results).toHaveProperty('totalExtraHours');
    expect(results).toHaveProperty('annualLifeEnergyHours');
    expect(results).toHaveProperty('expenseBreakdown');
    expect(results).toHaveProperty('timeBreakdown');

    // Verify values
    expect(results.nominalHourlyWage).toBe(25);
    expect(results.actualHourlyWage).toBeCloseTo(17.568627450980394, 2);
    expect(results.netAnnualIncome).toBe(44800);
    expect(results.totalMoneyExpenses).toBe(5200);
    expect(results.baseWeeklyHours).toBe(40);
    expect(results.totalWeeklyHours).toBe(51);
    expect(results.totalExtraHours).toBe(11);
    expect(results.annualLifeEnergyHours).toBe(2550);
  });

  it('should calculate percentage reduction correctly', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
      moneyExpenses: {
        commute: 2400,
        clothing: 500,
        meals: 1300,
        decompression: 800,
        childcareDelta: 0,
        other: 200,
      },
      timeExpenses: {
        commute: 5,
        gettingReady: 2.5,
        decompression: 3,
        workIllness: 0.5,
      },
    };

    const results = calculateResults(inputs);

    // Nominal: $25/hr, Actual: ~$17.57/hr
    // Reduction: (25 - 17.57) / 25 * 100 = 29.72%
    expect(results.percentageReduction).toBeCloseTo(29.725490196078434, 2);
  });

  it('should handle zero nominal wage without division by zero', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 0,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
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

    const results = calculateResults(inputs);

    expect(results.nominalHourlyWage).toBe(0);
    expect(results.actualHourlyWage).toBe(0);
    expect(results.percentageReduction).toBe(0);
  });

  it('should return empty arrays for breakdowns (to be filled by breakdown.ts)', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 50000,
        workHoursPerWeek: 40,
        vacationDays: 10,
        additionalIncome: 0,
      },
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

    const results = calculateResults(inputs);

    // With zero expenses, expense breakdown should be empty
    expect(results.expenseBreakdown).toEqual([]);
    // Time breakdown always includes base work hours
    expect(results.timeBreakdown).toEqual([
      {
        category: 'baseWork',
        label: 'Grunnvinnustundir', // Icelandic
        hoursPerWeek: 40,
        hoursPerYear: 2000,
        percentage: 100,
      },
    ]);
  });

  it('should calculate with high-income scenario', () => {
    const inputs: CalculatorInputs = {
      income: {
        grossAnnualIncome: 150000,
        workHoursPerWeek: 50, // Long hours
        vacationDays: 0, // No vacation
        additionalIncome: 20000, // Bonus
      },
      moneyExpenses: {
        commute: 5000,
        clothing: 3000,
        meals: 5000,
        decompression: 2000,
        childcareDelta: 15000,
        other: 2000,
      },
      timeExpenses: {
        commute: 10, // Long commute
        gettingReady: 5,
        decompression: 5,
        workIllness: 1,
      },
    };

    const results = calculateResults(inputs);

    // Nominal: $170,000 / (50 * 52) = $65.38/hr
    expect(results.nominalHourlyWage).toBeCloseTo(65.38461538461539, 2);

    // Actual: ($170,000 - $32,000) / (50 + 21) * 52 = $138,000 / 3692 = $37.38/hr
    expect(results.actualHourlyWage).toBeCloseTo(37.37840868591654, 2);

    // Reduction: ~42.83%
    expect(results.percentageReduction).toBeCloseTo(42.833333333333336, 2);
  });
});
