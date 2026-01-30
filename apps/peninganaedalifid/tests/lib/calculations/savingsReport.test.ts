/**
 * Unit tests for Savings Report calculation functions
 * Tests all calculation logic with edge cases
 */

import { describe, it, expect } from 'vitest';
import type { SavingsCategory, SavingsReport } from '@/types/savingsReport';
import {
  calculateTotalSavings,
  calculateTotalMonthlyContribution,
  calculateAnnualContribution,
  calculateSavingsRate,
  getSavingsRateLevel,
  getSavingsRateContext,
  calculateSavingsLifeEnergy,
  calculateCategoryBreakdown,
  calculateSavingsReportResults,
} from '@/lib/calculations/savingsReport';

// Test fixtures
const mockCategory1: SavingsCategory = {
  id: 'neydarsjodur',
  name: 'Neyðarsjóður',
  icon: '🛡️',
  description: 'Emergency fund',
  order: 1,
  data: {
    balance: 1000000,
    monthlyContribution: 50000,
  },
  isHidden: false,
};

const mockCategory2: SavingsCategory = {
  id: 'fjarfestingar',
  name: 'Fjárfestingar',
  icon: '📈',
  description: 'Investments',
  order: 2,
  data: {
    balance: 5000000,
    monthlyContribution: 100000,
  },
  isHidden: false,
};

const mockHiddenCategory: SavingsCategory = {
  id: 'annad',
  name: 'Annað',
  icon: '📦',
  description: 'Other',
  order: 3,
  data: {
    balance: 500000,
    monthlyContribution: 25000,
  },
  isHidden: true,
};

describe('calculateTotalSavings', () => {
  it('sums all non-hidden category balances', () => {
    const categories = [mockCategory1, mockCategory2];
    const total = calculateTotalSavings(categories);
    expect(total).toBe(6000000);
  });

  it('excludes hidden categories from sum', () => {
    const categories = [mockCategory1, mockCategory2, mockHiddenCategory];
    const total = calculateTotalSavings(categories);
    expect(total).toBe(6000000);
  });

  it('returns 0 for empty array', () => {
    const total = calculateTotalSavings([]);
    expect(total).toBe(0);
  });

  it('returns 0 when all categories are hidden', () => {
    const categories = [mockHiddenCategory];
    const total = calculateTotalSavings(categories);
    expect(total).toBe(0);
  });

  it('handles categories with zero balance', () => {
    const zeroCategory: SavingsCategory = {
      ...mockCategory1,
      data: { ...mockCategory1.data, balance: 0 },
    };
    const total = calculateTotalSavings([zeroCategory, mockCategory2]);
    expect(total).toBe(5000000);
  });
});

describe('calculateTotalMonthlyContribution', () => {
  it('sums all non-hidden category contributions', () => {
    const categories = [mockCategory1, mockCategory2];
    const total = calculateTotalMonthlyContribution(categories);
    expect(total).toBe(150000);
  });

  it('excludes hidden categories from sum', () => {
    const categories = [mockCategory1, mockCategory2, mockHiddenCategory];
    const total = calculateTotalMonthlyContribution(categories);
    expect(total).toBe(150000);
  });

  it('returns 0 for empty array', () => {
    const total = calculateTotalMonthlyContribution([]);
    expect(total).toBe(0);
  });

  it('handles categories with zero contribution', () => {
    const zeroCategory: SavingsCategory = {
      ...mockCategory1,
      data: { ...mockCategory1.data, monthlyContribution: 0 },
    };
    const total = calculateTotalMonthlyContribution([zeroCategory, mockCategory2]);
    expect(total).toBe(100000);
  });
});

describe('calculateAnnualContribution', () => {
  it('calculates annual from monthly (monthly * 12)', () => {
    expect(calculateAnnualContribution(150000)).toBe(1800000);
  });

  it('handles zero contribution', () => {
    expect(calculateAnnualContribution(0)).toBe(0);
  });

  it('handles large numbers', () => {
    expect(calculateAnnualContribution(1000000)).toBe(12000000);
  });
});

describe('calculateSavingsRate', () => {
  it('calculates percentage correctly', () => {
    const rate = calculateSavingsRate(150000, 500000);
    expect(rate).toBe(30);
  });

  it('returns null when income is null', () => {
    const rate = calculateSavingsRate(150000, null);
    expect(rate).toBeNull();
  });

  it('returns null when income is undefined', () => {
    const rate = calculateSavingsRate(150000, undefined);
    expect(rate).toBeNull();
  });

  it('returns null when income is 0', () => {
    const rate = calculateSavingsRate(150000, 0);
    expect(rate).toBeNull();
  });

  it('returns null when income is negative', () => {
    const rate = calculateSavingsRate(150000, -100000);
    expect(rate).toBeNull();
  });

  it('handles 100% savings rate', () => {
    const rate = calculateSavingsRate(500000, 500000);
    expect(rate).toBe(100);
  });

  it('handles savings rate over 100%', () => {
    const rate = calculateSavingsRate(600000, 500000);
    expect(rate).toBe(120);
  });

  it('handles very small savings rate', () => {
    const rate = calculateSavingsRate(5000, 500000);
    expect(rate).toBe(1);
  });
});

describe('getSavingsRateLevel', () => {
  it('returns "critical" for rate < 10%', () => {
    expect(getSavingsRateLevel(5)).toBe('critical');
    expect(getSavingsRateLevel(9.99)).toBe('critical');
  });

  it('returns "low" for rate 10-20%', () => {
    expect(getSavingsRateLevel(10)).toBe('low');
    expect(getSavingsRateLevel(15)).toBe('low');
    expect(getSavingsRateLevel(19.99)).toBe('low');
  });

  it('returns "moderate" for rate 20-30%', () => {
    expect(getSavingsRateLevel(20)).toBe('moderate');
    expect(getSavingsRateLevel(25)).toBe('moderate');
    expect(getSavingsRateLevel(29.99)).toBe('moderate');
  });

  it('returns "good" for rate 30-50%', () => {
    expect(getSavingsRateLevel(30)).toBe('good');
    expect(getSavingsRateLevel(40)).toBe('good');
    expect(getSavingsRateLevel(49.99)).toBe('good');
  });

  it('returns "excellent" for rate 50-70%', () => {
    expect(getSavingsRateLevel(50)).toBe('excellent');
    expect(getSavingsRateLevel(60)).toBe('excellent');
    expect(getSavingsRateLevel(69.99)).toBe('excellent');
  });

  it('returns "exceptional" for rate >= 70%', () => {
    expect(getSavingsRateLevel(70)).toBe('exceptional');
    expect(getSavingsRateLevel(80)).toBe('exceptional');
    expect(getSavingsRateLevel(100)).toBe('exceptional');
  });
});

describe('getSavingsRateContext', () => {
  it('returns null when rate is null', () => {
    const context = getSavingsRateContext(null);
    expect(context).toBeNull();
  });

  it('returns context for valid rate', () => {
    const context = getSavingsRateContext(25);
    expect(context).not.toBeNull();
    expect(context?.rate).toBe(25);
    expect(context?.level).toBe('moderate');
    expect(context?.messageIs).toBeTruthy();
    expect(typeof context?.messageIs).toBe('string');
    expect(typeof context?.fiEstimateYears === 'number' || context?.fiEstimateYears === null).toBe(true);
  });

  it('includes Icelandic message', () => {
    const context = getSavingsRateContext(35);
    expect(context?.messageIs).toContain('fjárhagsfrelsis');
  });

  it('has FI estimate for moderate rates', () => {
    const context = getSavingsRateContext(25);
    expect(context?.fiEstimateYears).toBeTypeOf('number');
  });

  it('may have null FI estimate for critical rates', () => {
    const context = getSavingsRateContext(5);
    expect(context?.fiEstimateYears === null || typeof context?.fiEstimateYears === 'number').toBe(true);
  });
});

describe('calculateSavingsLifeEnergy', () => {
  it('calculates life energy correctly', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(6000000, 150000, 2500);
    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy?.totalBalanceHours).toBe(2400);
    expect(lifeEnergy?.totalContributionHoursPerMonth).toBe(60);
    expect(lifeEnergy?.totalContributionHoursPerYear).toBe(720);
  });

  it('returns null when AWH is null', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(6000000, 150000, null);
    expect(lifeEnergy).toBeNull();
  });

  it('returns null when AWH is undefined', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(6000000, 150000, undefined);
    expect(lifeEnergy).toBeNull();
  });

  it('returns null when AWH is 0', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(6000000, 150000, 0);
    expect(lifeEnergy).toBeNull();
  });

  it('returns null when AWH is negative', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(6000000, 150000, -2500);
    expect(lifeEnergy).toBeNull();
  });

  it('handles zero balance and contribution', () => {
    const lifeEnergy = calculateSavingsLifeEnergy(0, 0, 2500);
    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy?.totalBalanceHours).toBe(0);
    expect(lifeEnergy?.totalContributionHoursPerMonth).toBe(0);
    expect(lifeEnergy?.totalContributionHoursPerYear).toBe(0);
  });
});

describe('calculateCategoryBreakdown', () => {
  it('calculates breakdown for all visible categories', () => {
    const categories = [mockCategory1, mockCategory2];
    const breakdown = calculateCategoryBreakdown(categories, 6000000, 2500);

    expect(breakdown).toHaveLength(2);
    expect(breakdown[0].categoryId).toBe('neydarsjodur');
    expect(breakdown[0].balance).toBe(1000000);
    expect(breakdown[0].monthlyContribution).toBe(50000);
    expect(breakdown[0].percentageOfTotal).toBeCloseTo(16.67, 1);
    expect(breakdown[0].lifeEnergyBalance).toBe(400);
    expect(breakdown[0].lifeEnergyContribution).toBe(20);
  });

  it('excludes hidden categories', () => {
    const categories = [mockCategory1, mockCategory2, mockHiddenCategory];
    const breakdown = calculateCategoryBreakdown(categories, 6000000, 2500);
    expect(breakdown).toHaveLength(2);
  });

  it('handles zero total savings', () => {
    const categories = [
      { ...mockCategory1, data: { balance: 0, monthlyContribution: 0 } },
    ];
    const breakdown = calculateCategoryBreakdown(categories, 0, 2500);
    expect(breakdown[0].percentageOfTotal).toBe(0);
  });

  it('returns undefined life energy when AWH is null', () => {
    const categories = [mockCategory1];
    const breakdown = calculateCategoryBreakdown(categories, 1000000, null);
    expect(breakdown[0].lifeEnergyBalance).toBeUndefined();
    expect(breakdown[0].lifeEnergyContribution).toBeUndefined();
  });

  it('returns undefined life energy when AWH is 0', () => {
    const categories = [mockCategory1];
    const breakdown = calculateCategoryBreakdown(categories, 1000000, 0);
    expect(breakdown[0].lifeEnergyBalance).toBeUndefined();
    expect(breakdown[0].lifeEnergyContribution).toBeUndefined();
  });

  it('includes all category metadata', () => {
    const categories = [mockCategory1];
    const breakdown = calculateCategoryBreakdown(categories, 1000000, 2500);
    expect(breakdown[0].categoryName).toBe('Neyðarsjóður');
    expect(breakdown[0].icon).toBe('🛡️');
  });
});

describe('calculateSavingsReportResults', () => {
  const mockReport: SavingsReport = {
    categories: [mockCategory1, mockCategory2],
    lastUpdated: new Date(),
    version: 1,
  };

  it('calculates complete results with all data', () => {
    const results = calculateSavingsReportResults(mockReport, 2500, 500000);

    expect(results).not.toBeNull();
    expect(results?.totalSavings).toBe(6000000);
    expect(results?.totalMonthlyContribution).toBe(150000);
    expect(results?.totalAnnualContribution).toBe(1800000);
    expect(results?.savingsRate).toBe(30);
    expect(results?.savingsRateContext).not.toBeNull();
    expect(results?.categoryBreakdown).toHaveLength(2);
    expect(results?.lifeEnergy).not.toBeNull();
  });

  it('returns null when report is null', () => {
    const results = calculateSavingsReportResults(null, 2500, 500000);
    expect(results).toBeNull();
  });

  it('returns null when categories array is empty', () => {
    const emptyReport: SavingsReport = {
      categories: [],
      lastUpdated: new Date(),
      version: 1,
    };
    const results = calculateSavingsReportResults(emptyReport, 2500, 500000);
    expect(results).toBeNull();
  });

  it('handles missing AWH (null life energy)', () => {
    const results = calculateSavingsReportResults(mockReport, null, 500000);
    expect(results).not.toBeNull();
    expect(results?.lifeEnergy).toBeNull();
    expect(results?.categoryBreakdown[0].lifeEnergyBalance).toBeUndefined();
  });

  it('handles missing income (null savings rate)', () => {
    const results = calculateSavingsReportResults(mockReport, 2500, null);
    expect(results).not.toBeNull();
    expect(results?.savingsRate).toBeNull();
    expect(results?.savingsRateContext).toBeNull();
  });

  it('works without AWH or income', () => {
    const results = calculateSavingsReportResults(mockReport, null, null);
    expect(results).not.toBeNull();
    expect(results?.totalSavings).toBe(6000000);
    expect(results?.savingsRate).toBeNull();
    expect(results?.lifeEnergy).toBeNull();
  });
});
