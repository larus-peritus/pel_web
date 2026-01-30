/**
 * Tests for Emergency Fund Freedom Meter calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateMonthsOfFreedom,
  calculateWeeksOfFreedom,
  calculateLifeEnergyHours,
  hoursToWorkWeeks,
  hoursToYears,
  calculateRiskRating,
  calculateTargetProgress,
  calculateEmergencyFundResults,
} from '@/lib/calculations/emergencyFund';
import type { EmergencyFundData } from '@/types/emergencyFund';

describe('calculateMonthsOfFreedom', () => {
  it('calculates correct months for valid inputs', () => {
    expect(calculateMonthsOfFreedom(300000, 100000)).toBe(3);
    expect(calculateMonthsOfFreedom(600000, 100000)).toBe(6);
    expect(calculateMonthsOfFreedom(1200000, 100000)).toBe(12);
  });

  it('handles decimal results correctly', () => {
    expect(calculateMonthsOfFreedom(350000, 100000)).toBe(3.5);
    expect(calculateMonthsOfFreedom(275000, 100000)).toBe(2.75);
  });

  it('returns 0 for zero monthly expenses', () => {
    expect(calculateMonthsOfFreedom(300000, 0)).toBe(0);
  });

  it('handles zero balance', () => {
    expect(calculateMonthsOfFreedom(0, 100000)).toBe(0);
  });

  it('handles very large numbers', () => {
    expect(calculateMonthsOfFreedom(10000000, 100000)).toBe(100);
  });
});

describe('calculateWeeksOfFreedom', () => {
  it('converts months to weeks correctly', () => {
    expect(calculateWeeksOfFreedom(1)).toBeCloseTo(4.33, 2);
    expect(calculateWeeksOfFreedom(0.5)).toBeCloseTo(2.165, 2);
  });

  it('handles zero months', () => {
    expect(calculateWeeksOfFreedom(0)).toBe(0);
  });
});

describe('calculateLifeEnergyHours', () => {
  it('calculates hours when AWH available', () => {
    expect(calculateLifeEnergyHours(300000, 2500)).toBe(120);
    expect(calculateLifeEnergyHours(500000, 2000)).toBe(250);
  });

  it('returns null when AWH unavailable', () => {
    expect(calculateLifeEnergyHours(300000, null)).toBeNull();
  });

  it('returns null when AWH is zero', () => {
    expect(calculateLifeEnergyHours(300000, 0)).toBeNull();
  });

  it('returns null when AWH is negative', () => {
    expect(calculateLifeEnergyHours(300000, -100)).toBeNull();
  });

  it('handles very large balances', () => {
    expect(calculateLifeEnergyHours(10000000, 2500)).toBe(4000);
  });
});

describe('hoursToWorkWeeks', () => {
  it('converts hours to work-weeks correctly', () => {
    expect(hoursToWorkWeeks(40)).toBe(1);
    expect(hoursToWorkWeeks(120)).toBe(3);
    expect(hoursToWorkWeeks(2000)).toBe(50);
  });

  it('handles decimal work-weeks', () => {
    expect(hoursToWorkWeeks(100)).toBe(2.5);
  });

  it('handles zero hours', () => {
    expect(hoursToWorkWeeks(0)).toBe(0);
  });
});

describe('hoursToYears', () => {
  it('converts hours to years correctly', () => {
    expect(hoursToYears(8760)).toBe(1);
    expect(hoursToYears(17520)).toBe(2);
  });

  it('handles decimal years', () => {
    expect(hoursToYears(4380)).toBeCloseTo(0.5, 2);
  });

  it('handles zero hours', () => {
    expect(hoursToYears(0)).toBe(0);
  });
});

describe('calculateRiskRating', () => {
  it('assigns underfunded for < 1 month', () => {
    const rating = calculateRiskRating(0.5);
    expect(rating.level).toBe('underfunded');
    expect(rating.label).toBe('Vanfjármögnuð');
    expect(rating.color.bg).toBe('bg-red-100');
    expect(rating.recommendation).not.toBeNull();
  });

  it('assigns minimal for 1-3 months', () => {
    const rating1 = calculateRiskRating(1);
    expect(rating1.level).toBe('minimal');
    expect(rating1.label).toBe('Lágmarks');
    expect(rating1.color.bg).toBe('bg-orange-100');

    const rating2 = calculateRiskRating(2.5);
    expect(rating2.level).toBe('minimal');
  });

  it('assigns moderate for 3-6 months', () => {
    const rating3 = calculateRiskRating(3);
    expect(rating3.level).toBe('moderate');
    expect(rating3.label).toBe('Hóflegt');
    expect(rating3.color.bg).toBe('bg-amber-100');

    const rating5 = calculateRiskRating(5);
    expect(rating5.level).toBe('moderate');
  });

  it('assigns strong for 6-12 months', () => {
    const rating6 = calculateRiskRating(6);
    expect(rating6.level).toBe('strong');
    expect(rating6.label).toBe('Sterkur');
    expect(rating6.color.bg).toBe('bg-green-100');

    const rating10 = calculateRiskRating(10);
    expect(rating10.level).toBe('strong');
  });

  it('assigns excellent for >= 12 months', () => {
    const rating12 = calculateRiskRating(12);
    expect(rating12.level).toBe('excellent');
    expect(rating12.label).toBe('Framúrskarandi');
    expect(rating12.color.bg).toBe('bg-emerald-100');

    const rating20 = calculateRiskRating(20);
    expect(rating20.level).toBe('excellent');
  });

  it('includes explanations for all levels', () => {
    const levels = [0.5, 2, 4, 8, 15];
    levels.forEach((months) => {
      const rating = calculateRiskRating(months);
      expect(rating.explanation).toBeTruthy();
      expect(rating.explanation.length).toBeGreaterThan(0);
    });
  });

  it('includes recommendation only for underfunded and minimal', () => {
    expect(calculateRiskRating(0.5).recommendation).not.toBeNull();
    expect(calculateRiskRating(2).recommendation).not.toBeNull();
    expect(calculateRiskRating(4).recommendation).toBeNull();
    expect(calculateRiskRating(8).recommendation).toBeNull();
    expect(calculateRiskRating(15).recommendation).toBeNull();
  });
});

describe('calculateTargetProgress', () => {
  it('calculates progress for all three targets', () => {
    const targets = calculateTargetProgress(300000, 100000);
    expect(targets).toHaveLength(3);
    expect(targets[0].months).toBe(3);
    expect(targets[1].months).toBe(6);
    expect(targets[2].months).toBe(12);
  });

  it('calculates target amounts correctly', () => {
    const targets = calculateTargetProgress(300000, 100000);
    expect(targets[0].targetAmount).toBe(300000);
    expect(targets[1].targetAmount).toBe(600000);
    expect(targets[2].targetAmount).toBe(1200000);
  });

  it('calculates progress percentage correctly', () => {
    const targets = calculateTargetProgress(300000, 100000);
    expect(targets[0].progress).toBe(100); // 3 month target met
    expect(targets[1].progress).toBe(50); // 50% to 6 months
    expect(targets[2].progress).toBe(25); // 25% to 12 months
  });

  it('caps progress at 100%', () => {
    const targets = calculateTargetProgress(1500000, 100000);
    expect(targets[0].progress).toBe(100);
    expect(targets[1].progress).toBe(100);
    expect(targets[2].progress).toBe(100);
  });

  it('marks targets as achieved correctly', () => {
    const targets = calculateTargetProgress(700000, 100000);
    expect(targets[0].isAchieved).toBe(true); // 3 months
    expect(targets[1].isAchieved).toBe(true); // 6 months
    expect(targets[2].isAchieved).toBe(false); // 12 months
  });

  it('calculates amount remaining correctly', () => {
    const targets = calculateTargetProgress(400000, 100000);
    expect(targets[0].amountRemaining).toBe(0); // 3 months achieved
    expect(targets[1].amountRemaining).toBe(200000); // 6 months
    expect(targets[2].amountRemaining).toBe(800000); // 12 months
  });

  it('includes purpose for all targets', () => {
    const targets = calculateTargetProgress(100000, 100000);
    targets.forEach((target) => {
      expect(target.purpose).toBeTruthy();
      expect(target.purpose.length).toBeGreaterThan(0);
    });
  });
});

describe('calculateEmergencyFundResults', () => {
  const mockData: EmergencyFundData = {
    balance: 600000,
    monthlyExpenses: 200000,
    lastUpdated: new Date(),
  };

  it('calculates all metrics correctly', () => {
    const results = calculateEmergencyFundResults(mockData, 2500);

    expect(results.monthsOfFreedom).toBe(3);
    expect(results.weeksOfFreedom).toBeNull(); // Only shown if < 1 month
    expect(results.lifeEnergyHours).toBe(240);
    expect(results.lifeEnergyWorkWeeks).toBe(6);
    expect(results.lifeEnergyYears).toBeCloseTo(0.0274, 3);
    expect(results.riskLevel).toBe('moderate');
    expect(results.targets).toHaveLength(3);
  });

  it('shows weeks when < 1 month', () => {
    const lowData: EmergencyFundData = {
      balance: 50000,
      monthlyExpenses: 200000,
      lastUpdated: new Date(),
    };
    const results = calculateEmergencyFundResults(lowData, 2500);

    expect(results.monthsOfFreedom).toBe(0.25);
    expect(results.weeksOfFreedom).toBeCloseTo(1.0825, 3);
  });

  it('handles missing AWH gracefully', () => {
    const results = calculateEmergencyFundResults(mockData, null);

    expect(results.lifeEnergyHours).toBeNull();
    expect(results.lifeEnergyWorkWeeks).toBeNull();
    expect(results.lifeEnergyYears).toBeNull();
    expect(results.monthsOfFreedom).toBe(3); // Other calculations still work
  });

  it('includes risk rating object', () => {
    const results = calculateEmergencyFundResults(mockData, 2500);

    expect(results.riskRating).toBeDefined();
    expect(results.riskRating.level).toBe('moderate');
    expect(results.riskRating.label).toBe('Hóflegt');
    expect(results.riskRating.color).toBeDefined();
  });

  it('calculates correct risk levels for different balances', () => {
    const scenarios = [
      { balance: 50000, expected: 'underfunded' },
      { balance: 200000, expected: 'minimal' },
      { balance: 800000, expected: 'moderate' },
      { balance: 1600000, expected: 'strong' },
      { balance: 2400000, expected: 'excellent' },
    ];

    scenarios.forEach(({ balance, expected }) => {
      const data = { ...mockData, balance };
      const results = calculateEmergencyFundResults(data, 2500);
      expect(results.riskLevel).toBe(expected);
    });
  });
});
