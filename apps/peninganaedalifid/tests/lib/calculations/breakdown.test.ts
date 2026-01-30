/**
 * Tests for breakdown calculation functions
 */

import { describe, it, expect } from 'vitest';
import {
  generateExpenseBreakdown,
  generateTimeBreakdown,
  getTotalExpenses,
  getTotalWeeklyHours,
} from '@/lib/calculations/breakdown';
import type { MoneyExpenses, TimeExpenses } from '@/types/calculator';

describe('generateExpenseBreakdown', () => {
  it('returns sorted items (highest first)', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 500,
      meals: 2000,
      decompression: 1500,
      childcareDelta: 300,
      other: 700,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    expect(breakdown).toHaveLength(6);
    expect(breakdown[0].category).toBe('meals');
    expect(breakdown[0].amount).toBe(2000);
    expect(breakdown[1].category).toBe('decompression');
    expect(breakdown[1].amount).toBe(1500);
    expect(breakdown[5].category).toBe('childcareDelta');
    expect(breakdown[5].amount).toBe(300);
  });

  it('filters out zero values', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 0,
      meals: 500,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    expect(breakdown).toHaveLength(2);
    expect(breakdown[0].category).toBe('commute');
    expect(breakdown[1].category).toBe('meals');
  });

  it('filters out negative values', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: -500,
      meals: 500,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    expect(breakdown).toHaveLength(2);
    expect(breakdown.find((item) => item.category === 'clothing')).toBeUndefined();
  });

  it('calculates percentages correctly', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 500,
      meals: 1500,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    // Total: 3000
    expect(breakdown[0].percentage).toBeCloseTo(50, 1); // 1500/3000 = 50%
    expect(breakdown[1].percentage).toBeCloseTo(33.33, 1); // 1000/3000 = 33.33%
    expect(breakdown[2].percentage).toBeCloseTo(16.67, 1); // 500/3000 = 16.67%
  });

  it('calculates life energy hours correctly', () => {
    const expenses: MoneyExpenses = {
      commute: 2000,
      clothing: 500,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 25);

    expect(breakdown[0].lifeEnergyHours).toBe(80); // 2000 / 25 = 80
    expect(breakdown[1].lifeEnergyHours).toBe(20); // 500 / 25 = 20
  });

  it('handles all zeros (returns empty array)', () => {
    const expenses: MoneyExpenses = {
      commute: 0,
      clothing: 0,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    expect(breakdown).toHaveLength(0);
  });

  it('includes correct labels', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 500,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);

    expect(breakdown[0].label).toBe('Commute Costs');
    expect(breakdown[1].label).toBe('Work Clothing');
  });

  it('handles zero actual wage (returns zero life energy hours)', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 0,
      meals: 0,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 0);

    expect(breakdown[0].lifeEnergyHours).toBe(0);
  });
});

describe('generateTimeBreakdown', () => {
  it('includes base work hours as first item', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 2,
      decompression: 3,
      workIllness: 1,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    expect(breakdown[0].category).toBe('baseWork');
    expect(breakdown[0].label).toBe('Base Work Hours');
    expect(breakdown[0].hoursPerWeek).toBe(40);
  });

  it('filters out zero time expenses', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 0,
      decompression: 0,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    expect(breakdown).toHaveLength(2); // base work + commute only
    expect(breakdown[1].category).toBe('commute');
  });

  it('calculates annual hours correctly', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 2,
      decompression: 0,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    expect(breakdown[0].hoursPerYear).toBe(2000); // 40 * 50
    expect(breakdown[1].hoursPerYear).toBe(250); // 5 * 50
    expect(breakdown[2].hoursPerYear).toBe(100); // 2 * 50
  });

  it('calculates percentages correctly', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 5,
      decompression: 0,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    // Total weekly hours: 40 + 5 + 5 = 50
    expect(breakdown[0].percentage).toBe(80); // 40/50 = 80%
    expect(breakdown[1].percentage).toBe(10); // 5/50 = 10%
    expect(breakdown[2].percentage).toBe(10); // 5/50 = 10%
  });

  it('handles zero extra time', () => {
    const timeExpenses: TimeExpenses = {
      commute: 0,
      gettingReady: 0,
      decompression: 0,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    expect(breakdown).toHaveLength(1); // Only base work hours
    expect(breakdown[0].percentage).toBe(100);
  });

  it('includes correct labels', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 2,
      decompression: 3,
      workIllness: 1,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);

    expect(breakdown[0].label).toBe('Base Work Hours');
    expect(breakdown[1].label).toBe('Commute Time');
    expect(breakdown[2].label).toBe('Getting Ready');
    expect(breakdown[3].label).toBe('Decompression Time');
    expect(breakdown[4].label).toBe('Work-Related Illness');
  });

  it('handles zero base work hours edge case', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 0,
      decompression: 0,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 0, 50);

    expect(breakdown).toHaveLength(2);
    expect(breakdown[0].hoursPerWeek).toBe(0);
    expect(breakdown[1].percentage).toBe(100); // commute is 100% since base is 0
  });
});

describe('getTotalExpenses', () => {
  it('sums all expense amounts', () => {
    const expenses: MoneyExpenses = {
      commute: 1000,
      clothing: 500,
      meals: 2000,
      decompression: 0,
      childcareDelta: 0,
      other: 0,
    };

    const breakdown = generateExpenseBreakdown(expenses, 20);
    const total = getTotalExpenses(breakdown);

    expect(total).toBe(3500);
  });

  it('returns zero for empty breakdown', () => {
    const total = getTotalExpenses([]);
    expect(total).toBe(0);
  });
});

describe('getTotalWeeklyHours', () => {
  it('sums all hours', () => {
    const timeExpenses: TimeExpenses = {
      commute: 5,
      gettingReady: 2,
      decompression: 3,
      workIllness: 0,
    };

    const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);
    const total = getTotalWeeklyHours(breakdown);

    expect(total).toBe(50); // 40 + 5 + 2 + 3
  });

  it('returns zero for empty breakdown', () => {
    const total = getTotalWeeklyHours([]);
    expect(total).toBe(0);
  });
});
