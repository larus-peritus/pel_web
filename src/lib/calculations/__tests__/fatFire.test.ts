/**
 * Tests for FatFIRE calculation functions
 *
 * Comprehensive test coverage for all pure calculation functions
 * in the FatFIRE planner module.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTotalAnnualExpenses,
  calculateWishListTotals,
  calculateFINumber,
  calculateWithdrawalRate,
  calculateTimelineProjection,
  calculateMilestones,
  calculateLifeEnergy,
  generateTimelineChartData,
  generateExpenseBreakdown,
  calculateFatFireResults,
} from '../fatFire';
import type { WishListItem, FatFireState } from '@/types/fatFire';
import { FATFIRE_DEFAULTS } from '@/lib/constants/fatFire';

// Helper to create mock wish list items
function createMockWishListItem(
  monthlyCost: number,
  priority: 'must-have' | 'nice-to-have' = 'must-have'
): WishListItem {
  return {
    id: `item-${Math.random()}`,
    category: 'premium-housing',
    name: 'Test Item',
    monthlyCost,
    priority,
    description: 'Test description',
    createdAt: new Date(),
  };
}

describe('calculateTotalAnnualExpenses', () => {
  it('calculates total with base, wish list, and splurge', () => {
    const baseMonthly = 700_000; // 8.4M annual
    const wishList = [
      createMockWishListItem(100_000, 'must-have'), // 1.2M annual
      createMockWishListItem(50_000, 'nice-to-have'), // Not included
    ];
    const splurge = 2_000_000; // Annual

    const total = calculateTotalAnnualExpenses(baseMonthly, wishList, splurge);

    // Expected: (700k * 12) + (100k * 12) + 2M = 8.4M + 1.2M + 2M = 11.6M
    expect(total).toBe(11_600_000);
  });

  it('handles empty wish list', () => {
    const total = calculateTotalAnnualExpenses(700_000, [], 2_000_000);
    expect(total).toBe(10_400_000); // (700k * 12) + 2M
  });

  it('handles zero splurge budget', () => {
    const wishList = [createMockWishListItem(100_000, 'must-have')];
    const total = calculateTotalAnnualExpenses(700_000, wishList, 0);
    expect(total).toBe(9_600_000); // (700k * 12) + (100k * 12)
  });

  it('handles negative values gracefully', () => {
    const total = calculateTotalAnnualExpenses(-100, [], -1000);
    expect(total).toBe(0); // Should clamp to 0
  });

  it('excludes nice-to-have items from total', () => {
    const wishList = [
      createMockWishListItem(100_000, 'must-have'),
      createMockWishListItem(50_000, 'nice-to-have'),
    ];
    const total = calculateTotalAnnualExpenses(0, wishList, 0);
    expect(total).toBe(1_200_000); // Only must-have: 100k * 12
  });
});

describe('calculateWishListTotals', () => {
  it('separates must-have and nice-to-have items', () => {
    const wishList = [
      createMockWishListItem(100_000, 'must-have'),
      createMockWishListItem(75_000, 'must-have'),
      createMockWishListItem(50_000, 'nice-to-have'),
      createMockWishListItem(25_000, 'nice-to-have'),
    ];

    const totals = calculateWishListTotals(wishList);

    expect(totals.mustHave).toBe(175_000); // 100k + 75k
    expect(totals.niceToHave).toBe(75_000); // 50k + 25k
    expect(totals.total).toBe(250_000); // 175k + 75k
  });

  it('handles empty list', () => {
    const totals = calculateWishListTotals([]);
    expect(totals.mustHave).toBe(0);
    expect(totals.niceToHave).toBe(0);
    expect(totals.total).toBe(0);
  });

  it('handles only must-have items', () => {
    const wishList = [
      createMockWishListItem(100_000, 'must-have'),
      createMockWishListItem(50_000, 'must-have'),
    ];

    const totals = calculateWishListTotals(wishList);

    expect(totals.mustHave).toBe(150_000);
    expect(totals.niceToHave).toBe(0);
    expect(totals.total).toBe(150_000);
  });

  it('handles only nice-to-have items', () => {
    const wishList = [
      createMockWishListItem(100_000, 'nice-to-have'),
      createMockWishListItem(50_000, 'nice-to-have'),
    ];

    const totals = calculateWishListTotals(wishList);

    expect(totals.mustHave).toBe(0);
    expect(totals.niceToHave).toBe(150_000);
    expect(totals.total).toBe(150_000);
  });

  it('ignores negative costs', () => {
    const wishList = [
      createMockWishListItem(100_000, 'must-have'),
      createMockWishListItem(-50_000, 'must-have'), // Should be ignored/clamped
    ];

    const totals = calculateWishListTotals(wishList);

    expect(totals.mustHave).toBe(100_000);
    expect(totals.total).toBe(100_000);
  });
});

describe('calculateFINumber', () => {
  it('calculates FI number with 30x multiplier (FatFIRE default)', () => {
    const fiNumber = calculateFINumber(16_100_000, 30);
    expect(fiNumber).toBe(483_000_000);
  });

  it('calculates FI number with 25x multiplier (standard FIRE)', () => {
    const fiNumber = calculateFINumber(10_000_000, 25);
    expect(fiNumber).toBe(250_000_000);
  });

  it('calculates FI number with 33x multiplier (very conservative)', () => {
    const fiNumber = calculateFINumber(12_000_000, 33);
    expect(fiNumber).toBe(396_000_000);
  });

  it('handles zero expenses', () => {
    const fiNumber = calculateFINumber(0, 30);
    expect(fiNumber).toBe(0);
  });

  it('handles zero multiplier', () => {
    const fiNumber = calculateFINumber(10_000_000, 0);
    expect(fiNumber).toBe(10_000_000); // Clamped to min 1x
  });

  it('handles negative values gracefully', () => {
    const fiNumber = calculateFINumber(-100, 30);
    expect(fiNumber).toBe(0); // Clamped
  });
});

describe('calculateWithdrawalRate', () => {
  it('calculates 3.33% for 30x multiplier', () => {
    const rate = calculateWithdrawalRate(30);
    expect(rate).toBeCloseTo(3.33, 2);
  });

  it('calculates 4% for 25x multiplier', () => {
    const rate = calculateWithdrawalRate(25);
    expect(rate).toBe(4);
  });

  it('calculates 3.03% for 33x multiplier', () => {
    const rate = calculateWithdrawalRate(33);
    expect(rate).toBeCloseTo(3.03, 2);
  });

  it('handles zero multiplier', () => {
    const rate = calculateWithdrawalRate(0);
    expect(rate).toBe(0);
  });
});

describe('calculateTimelineProjection', () => {
  it('calculates years to FI with savings and growth', () => {
    const years = calculateTimelineProjection(
      50_000_000, // Current savings
      483_000_000, // FI number
      6_000_000, // Annual savings
      0.06 // 6% return
    );

    expect(years).not.toBeNull();
    expect(years!).toBeGreaterThan(15);
    expect(years!).toBeLessThan(25);
  });

  it('returns 0 when already at FI', () => {
    const years = calculateTimelineProjection(
      500_000_000,
      483_000_000,
      6_000_000,
      0.06
    );

    expect(years).toBe(0);
  });

  it('returns null for unrealistic timelines', () => {
    const years = calculateTimelineProjection(
      1_000_000, // Very low starting point
      483_000_000, // High FI number
      100_000, // Very low savings
      0.01 // Very low return
    );

    expect(years).toBeNull();
  });

  it('handles zero interest rate', () => {
    const years = calculateTimelineProjection(
      10_000_000,
      20_000_000,
      1_000_000,
      0 // No growth, just savings
    );

    expect(years).toBe(10); // Simple: (20M - 10M) / 1M = 10 years
  });

  it('handles Coast FIRE scenario (no savings, only growth)', () => {
    const years = calculateTimelineProjection(
      50_000_000,
      100_000_000,
      0, // No additional savings
      0.07 // 7% growth
    );

    expect(years).not.toBeNull();
    expect(years!).toBeGreaterThan(10);
    expect(years!).toBeLessThan(12); // log(100M/50M) / log(1.07) ≈ 10.24
  });

  it('returns null for impossible scenarios', () => {
    const years = calculateTimelineProjection(
      0,
      483_000_000,
      0, // No savings
      0 // No growth
    );

    expect(years).toBeNull();
  });

  it('handles negative inputs gracefully', () => {
    const years = calculateTimelineProjection(-100, 1000, -500, 0.06);
    expect(years).toBeNull();
  });

  it('caps unrealistic return rates', () => {
    const years = calculateTimelineProjection(
      10_000_000,
      20_000_000,
      1_000_000,
      5.0 // 500% return - unrealistic
    );

    expect(years).toBeNull(); // Should be rejected
  });
});

describe('calculateMilestones', () => {
  it('generates 4 milestones (25%, 50%, 75%, 100%)', () => {
    const milestones = calculateMilestones(
      483_000_000, // FI number
      50_000_000, // Current savings
      6_000_000, // Annual savings
      0.06 // Return rate
    );

    expect(milestones).toHaveLength(4);
    expect(milestones[0].percentage).toBe(25);
    expect(milestones[1].percentage).toBe(50);
    expect(milestones[2].percentage).toBe(75);
    expect(milestones[3].percentage).toBe(100);
  });

  it('calculates correct milestone amounts', () => {
    const fiNumber = 400_000_000;
    const milestones = calculateMilestones(fiNumber, 0, 5_000_000, 0.06);

    expect(milestones[0].amount).toBe(100_000_000); // 25%
    expect(milestones[1].amount).toBe(200_000_000); // 50%
    expect(milestones[2].amount).toBe(300_000_000); // 75%
    expect(milestones[3].amount).toBe(400_000_000); // 100%
  });

  it('marks already-reached milestones', () => {
    const milestones = calculateMilestones(
      400_000_000,
      150_000_000, // Already past 25% (100M)
      5_000_000,
      0.06
    );

    expect(milestones[0].yearsFromNow).toBe(0); // 25% already reached
    expect(milestones[1].yearsFromNow).not.toBe(0); // 50% not yet reached
  });

  it('includes Icelandic labels', () => {
    const milestones = calculateMilestones(400_000_000, 0, 5_000_000, 0.06);

    expect(milestones[0].label).toContain('25%');
    expect(milestones[3].label).toContain('100%');
    expect(milestones[3].label).toContain('náð'); // Icelandic
  });

  it('projects future dates for milestones', () => {
    const milestones = calculateMilestones(400_000_000, 100_000_000, 10_000_000, 0.06);

    const now = new Date();
    milestones.forEach((milestone) => {
      if (milestone.projectedDate && milestone.yearsFromNow! > 0) {
        expect(milestone.projectedDate.getTime()).toBeGreaterThan(now.getTime());
      }
    });
  });
});

describe('calculateLifeEnergy', () => {
  it('converts FI number to years of work', () => {
    const lifeEnergy = calculateLifeEnergy(
      483_000_000, // FI number
      2_500, // Actual hourly wage
      18.5, // Years to FI
      undefined // No LeanFIRE comparison
    );

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.yearsOfWork).toBeGreaterThan(90); // 483M / (2500 * 2080) ≈ 92.9 years
  });

  it('includes LeanFIRE comparison when provided', () => {
    const lifeEnergy = calculateLifeEnergy(
      483_000_000, // FatFIRE
      2_500,
      18.5,
      93_000_000 // LeanFIRE
    );

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.leanFireComparison).toBeDefined();
    expect(lifeEnergy!.leanFireComparison!.leanFINumber).toBe(93_000_000);
    expect(lifeEnergy!.leanFireComparison!.difference).toBeGreaterThan(70); // ~75 years extra
  });

  it('returns null when no wage provided', () => {
    const lifeEnergy = calculateLifeEnergy(483_000_000, 0, 18.5);
    expect(lifeEnergy).toBeNull();
  });

  it('returns null for negative wage', () => {
    const lifeEnergy = calculateLifeEnergy(483_000_000, -100, 18.5);
    expect(lifeEnergy).toBeNull();
  });

  it('calculates annual net income correctly', () => {
    const lifeEnergy = calculateLifeEnergy(483_000_000, 2_500, 18.5);
    expect(lifeEnergy!.annualNetIncome).toBe(5_200_000); // 2500 * 2080
  });
});

describe('generateTimelineChartData', () => {
  it('generates data points for each year', () => {
    const data = generateTimelineChartData(
      50_000_000,
      483_000_000,
      6_000_000,
      0.06,
      18.5
    );

    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBeLessThanOrEqual(20); // ~18.5 years + 1
  });

  it('includes year, date, portfolioValue, and fiPercentage', () => {
    const data = generateTimelineChartData(50_000_000, 200_000_000, 10_000_000, 0.06, 10);

    data.forEach((point) => {
      expect(point).toHaveProperty('year');
      expect(point).toHaveProperty('date');
      expect(point).toHaveProperty('portfolioValue');
      expect(point).toHaveProperty('fiPercentage');
    });
  });

  it('shows increasing portfolio values', () => {
    const data = generateTimelineChartData(50_000_000, 200_000_000, 10_000_000, 0.06, 10);

    for (let i = 1; i < data.length; i++) {
      expect(data[i].portfolioValue).toBeGreaterThan(data[i - 1].portfolioValue);
    }
  });

  it('handles already at FI', () => {
    const data = generateTimelineChartData(500_000_000, 483_000_000, 6_000_000, 0.06, 0);

    expect(data.length).toBe(1);
    expect(data[0].fiPercentage).toBeGreaterThanOrEqual(100);
  });

  it('caps FI percentage at 100%', () => {
    const data = generateTimelineChartData(50_000_000, 200_000_000, 10_000_000, 0.06, 10);

    data.forEach((point) => {
      expect(point.fiPercentage).toBeLessThanOrEqual(100);
    });
  });
});

describe('generateExpenseBreakdown', () => {
  it('generates breakdown with percentages', () => {
    const breakdown = generateExpenseBreakdown(700_000, 100_000, 166_667);

    expect(breakdown).toHaveLength(3);

    const total = breakdown.reduce((sum, item) => sum + item.percentage, 0);
    expect(total).toBeCloseTo(100, 1); // Should sum to ~100%
  });

  it('includes category names in Icelandic', () => {
    const breakdown = generateExpenseBreakdown(700_000, 100_000, 166_667);

    expect(breakdown[0].category).toContain('Grunn'); // Grunnútgjöld
    expect(breakdown[1].category).toContain('Óska'); // Óskarlisti
    expect(breakdown[2].category).toContain('Auka'); // Aukaútgjaldaáætlun
  });

  it('assigns colors for visualization', () => {
    const breakdown = generateExpenseBreakdown(700_000, 100_000, 166_667);

    breakdown.forEach((item) => {
      expect(item.color).toBeDefined();
      expect(item.color.length).toBeGreaterThan(0);
    });
  });

  it('handles zero values', () => {
    const breakdown = generateExpenseBreakdown(700_000, 0, 0);

    expect(breakdown).toHaveLength(1); // Only base
    expect(breakdown[0].percentage).toBe(100);
  });

  it('handles all zero (empty breakdown)', () => {
    const breakdown = generateExpenseBreakdown(0, 0, 0);
    expect(breakdown).toHaveLength(0);
  });
});

describe('calculateFatFireResults (integration)', () => {
  const mockState: FatFireState = {
    useExpenseBaseline: false,
    selectedTier: 'deluxe',
    customMonthlyExpense: 700_000,
    wishListItems: [
      createMockWishListItem(100_000, 'must-have'),
      createMockWishListItem(50_000, 'nice-to-have'),
    ],
    splurgeBudgetAnnual: 2_000_000,
    multiplier: 30,
    customMultiplier: null,
    currentSavings: 50_000_000,
    expectedReturnRate: 0.06,
    annualSavings: 6_000_000,
    scenarios: [],
    lastUpdated: new Date(),
  };

  it('calculates complete FatFIRE results', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.baseMonthlyExpenses).toBe(700_000);
    expect(results.wishListMonthlyTotal).toBe(150_000); // 100k + 50k
    expect(results.totalMonthlyExpenses).toBeGreaterThan(0);
    expect(results.fiNumber).toBeGreaterThan(0);
    expect(results.multiplier).toBe(30);
  });

  it('includes timeline when savings data available', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.hasTimelineData).toBe(true);
    expect(results.timeline).toBeDefined();
    expect(results.timeline!.yearsToFI).toBeGreaterThan(0);
  });

  it('includes milestones', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.milestones).toHaveLength(4);
  });

  it('includes current progress', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.currentProgress).toBeDefined();
    expect(results.currentProgress!.percentage).toBeGreaterThan(0);
    expect(results.currentProgress!.percentage).toBeLessThan(100);
  });

  it('includes life energy when AWH provided', () => {
    const results = calculateFatFireResults(mockState, 2_500);

    expect(results.lifeEnergy).toBeDefined();
    expect(results.lifeEnergy!.actualHourlyWage).toBe(2_500);
    expect(results.lifeEnergy!.yearsOfWork).toBeGreaterThan(0);
  });

  it('excludes life energy when AWH not provided', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.lifeEnergy).toBeUndefined();
  });

  it('separates must-have and nice-to-have totals', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.mustHaveTotal).toBe(100_000);
    expect(results.niceToHaveTotal).toBe(50_000);
  });

  it('uses default base expenses when custom is null', () => {
    const stateWithoutCustom = { ...mockState, customMonthlyExpense: null };
    const results = calculateFatFireResults(stateWithoutCustom);

    expect(results.baseMonthlyExpenses).toBe(FATFIRE_DEFAULTS.BASE_MONTHLY_EXPENSES);
  });

  it('handles missing timeline data gracefully', () => {
    const stateWithoutTimeline = {
      ...mockState,
      currentSavings: null,
      annualSavings: null,
    };
    const results = calculateFatFireResults(stateWithoutTimeline);

    expect(results.hasTimelineData).toBe(false);
    expect(results.timeline).toBeUndefined();
    expect(results.currentProgress).toBeUndefined();
  });

  it('generates expense breakdown', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.expenseBreakdown).toHaveLength(3);
  });

  it('calculates withdrawal rate', () => {
    const results = calculateFatFireResults(mockState);

    expect(results.withdrawalRate).toBeCloseTo(3.33, 2);
  });
});
