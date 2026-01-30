/**
 * Unit tests for expense baseline calculation functions
 */

import {
  calculateTierTotals,
  calculateAnnualTotals,
  calculatePercentageBreakdown,
  calculateLifeEnergy,
  calculateTierDifferences,
  calculateExpenseBaselineResults,
  getExpenseByTier,
  getAnnualExpenseByTier,
  hasExpenseBaseline,
  type ExpenseCategory,
  type ExpenseBaseline,
  type TierValues,
} from '../expenseBaseline';

// Test fixtures
const createMockCategory = (
  id: string,
  values: TierValues,
  isHidden = false
): ExpenseCategory => ({
  id,
  name: `Category ${id}`,
  icon: '📦',
  values,
  isCustom: false,
  isHidden,
  order: 0,
});

const mockCategories: ExpenseCategory[] = [
  createMockCategory('husnaedi', {
    barebones: 120000,
    comfortable: 200000,
    deluxe: 350000,
  }),
  createMockCategory('matur', {
    barebones: 40000,
    comfortable: 70000,
    deluxe: 120000,
  }),
  createMockCategory('samgongur', {
    barebones: 15000,
    comfortable: 40000,
    deluxe: 80000,
  }),
];

const mockBaseline: ExpenseBaseline = {
  categories: mockCategories,
  lastUpdated: new Date('2026-01-22'),
  wizardCompleted: true,
  version: 1,
};

describe('calculateTierTotals', () => {
  it('sums all non-hidden categories', () => {
    const totals = calculateTierTotals(mockCategories);

    expect(totals.barebones).toBe(175000); // 120000 + 40000 + 15000
    expect(totals.comfortable).toBe(310000); // 200000 + 70000 + 40000
    expect(totals.deluxe).toBe(550000); // 350000 + 120000 + 80000
  });

  it('excludes hidden categories', () => {
    const categories = [
      createMockCategory('a', {
        barebones: 100000,
        comfortable: 200000,
        deluxe: 300000,
      }),
      createMockCategory(
        'b',
        { barebones: 50000, comfortable: 100000, deluxe: 150000 },
        true
      ), // hidden
    ];

    const totals = calculateTierTotals(categories);

    expect(totals.barebones).toBe(100000);
    expect(totals.comfortable).toBe(200000);
    expect(totals.deluxe).toBe(300000);
  });

  it('returns zeros for empty category array', () => {
    const totals = calculateTierTotals([]);

    expect(totals.barebones).toBe(0);
    expect(totals.comfortable).toBe(0);
    expect(totals.deluxe).toBe(0);
  });

  it('returns zeros when all categories are hidden', () => {
    const categories = [
      createMockCategory(
        'a',
        { barebones: 100000, comfortable: 200000, deluxe: 300000 },
        true
      ),
      createMockCategory(
        'b',
        { barebones: 50000, comfortable: 100000, deluxe: 150000 },
        true
      ),
    ];

    const totals = calculateTierTotals(categories);

    expect(totals.barebones).toBe(0);
    expect(totals.comfortable).toBe(0);
    expect(totals.deluxe).toBe(0);
  });
});

describe('calculateAnnualTotals', () => {
  it('multiplies monthly totals by 12', () => {
    const monthly: TierValues = {
      barebones: 250000,
      comfortable: 520000,
      deluxe: 1000000,
    };

    const annual = calculateAnnualTotals(monthly);

    expect(annual.barebones).toBe(3000000);
    expect(annual.comfortable).toBe(6240000);
    expect(annual.deluxe).toBe(12000000);
  });

  it('handles zero values', () => {
    const monthly: TierValues = {
      barebones: 0,
      comfortable: 0,
      deluxe: 0,
    };

    const annual = calculateAnnualTotals(monthly);

    expect(annual.barebones).toBe(0);
    expect(annual.comfortable).toBe(0);
    expect(annual.deluxe).toBe(0);
  });

  it('handles partial zero values', () => {
    const monthly: TierValues = {
      barebones: 100000,
      comfortable: 0,
      deluxe: 500000,
    };

    const annual = calculateAnnualTotals(monthly);

    expect(annual.barebones).toBe(1200000);
    expect(annual.comfortable).toBe(0);
    expect(annual.deluxe).toBe(6000000);
  });
});

describe('calculatePercentageBreakdown', () => {
  it('calculates correct percentages for each category', () => {
    const categories = [
      createMockCategory('a', {
        barebones: 80000,
        comfortable: 160000,
        deluxe: 240000,
      }),
      createMockCategory('b', {
        barebones: 20000,
        comfortable: 40000,
        deluxe: 60000,
      }),
    ];

    const totals: TierValues = {
      barebones: 100000,
      comfortable: 200000,
      deluxe: 300000,
    };

    const breakdown = calculatePercentageBreakdown(categories, totals);

    expect(breakdown.a.barebones).toBe(80);
    expect(breakdown.a.comfortable).toBe(80);
    expect(breakdown.a.deluxe).toBe(80);
    expect(breakdown.b.barebones).toBe(20);
    expect(breakdown.b.comfortable).toBe(20);
    expect(breakdown.b.deluxe).toBe(20);
  });

  it('excludes hidden categories', () => {
    const categories = [
      createMockCategory('visible', {
        barebones: 100000,
        comfortable: 200000,
        deluxe: 300000,
      }),
      createMockCategory(
        'hidden',
        { barebones: 50000, comfortable: 100000, deluxe: 150000 },
        true
      ),
    ];

    const totals: TierValues = {
      barebones: 100000,
      comfortable: 200000,
      deluxe: 300000,
    };

    const breakdown = calculatePercentageBreakdown(categories, totals);

    expect(breakdown.visible).toBeDefined();
    expect(breakdown.hidden).toBeUndefined();
  });

  it('returns zeros when total is zero', () => {
    const categories = [
      createMockCategory('a', {
        barebones: 100000,
        comfortable: 200000,
        deluxe: 300000,
      }),
    ];

    const totals: TierValues = {
      barebones: 0,
      comfortable: 0,
      deluxe: 0,
    };

    const breakdown = calculatePercentageBreakdown(categories, totals);

    expect(breakdown.a.barebones).toBe(0);
    expect(breakdown.a.comfortable).toBe(0);
    expect(breakdown.a.deluxe).toBe(0);
  });

  it('handles single tier being zero', () => {
    const categories = [
      createMockCategory('a', {
        barebones: 100000,
        comfortable: 200000,
        deluxe: 300000,
      }),
    ];

    const totals: TierValues = {
      barebones: 0,
      comfortable: 200000,
      deluxe: 300000,
    };

    const breakdown = calculatePercentageBreakdown(categories, totals);

    expect(breakdown.a.barebones).toBe(0);
    expect(breakdown.a.comfortable).toBe(100);
    expect(breakdown.a.deluxe).toBe(100);
  });
});

describe('calculateLifeEnergy', () => {
  const totals: TierValues = {
    barebones: 250000,
    comfortable: 520000,
    deluxe: 1000000,
  };

  it('calculates life energy hours when AWH provided', () => {
    const actualHourlyWage = 2500; // 2500 ISK per hour

    const lifeEnergy = calculateLifeEnergy(
      totals,
      mockCategories,
      actualHourlyWage
    );

    expect(lifeEnergy).not.toBeNull();
    expect(lifeEnergy!.monthly.barebones).toBe(100); // 250000 / 2500
    expect(lifeEnergy!.monthly.comfortable).toBe(208); // 520000 / 2500
    expect(lifeEnergy!.monthly.deluxe).toBe(400); // 1000000 / 2500

    expect(lifeEnergy!.annual.barebones).toBe(1200); // 100 * 12
    expect(lifeEnergy!.annual.comfortable).toBe(2496); // 208 * 12
    expect(lifeEnergy!.annual.deluxe).toBe(4800); // 400 * 12
  });

  it('calculates per-category life energy', () => {
    const actualHourlyWage = 2500;

    const lifeEnergy = calculateLifeEnergy(
      totals,
      mockCategories,
      actualHourlyWage
    );

    expect(lifeEnergy!.perCategory.husnaedi.barebones).toBe(48); // 120000 / 2500
    expect(lifeEnergy!.perCategory.husnaedi.comfortable).toBe(80); // 200000 / 2500
    expect(lifeEnergy!.perCategory.husnaedi.deluxe).toBe(140); // 350000 / 2500

    expect(lifeEnergy!.perCategory.matur.barebones).toBe(16); // 40000 / 2500
    expect(lifeEnergy!.perCategory.matur.comfortable).toBe(28); // 70000 / 2500
    expect(lifeEnergy!.perCategory.matur.deluxe).toBe(48); // 120000 / 2500
  });

  it('excludes hidden categories from per-category breakdown', () => {
    const categories = [
      ...mockCategories,
      createMockCategory(
        'hidden',
        { barebones: 50000, comfortable: 100000, deluxe: 150000 },
        true
      ),
    ];

    const lifeEnergy = calculateLifeEnergy(totals, categories, 2500);

    expect(lifeEnergy!.perCategory.husnaedi).toBeDefined();
    expect(lifeEnergy!.perCategory.hidden).toBeUndefined();
  });

  it('returns null when AWH is null', () => {
    const lifeEnergy = calculateLifeEnergy(totals, mockCategories, null);

    expect(lifeEnergy).toBeNull();
  });

  it('returns null when AWH is zero', () => {
    const lifeEnergy = calculateLifeEnergy(totals, mockCategories, 0);

    expect(lifeEnergy).toBeNull();
  });

  it('returns null when AWH is negative', () => {
    const lifeEnergy = calculateLifeEnergy(totals, mockCategories, -1000);

    expect(lifeEnergy).toBeNull();
  });
});

describe('calculateTierDifferences', () => {
  const totals: TierValues = {
    barebones: 250000,
    comfortable: 520000,
    deluxe: 1000000,
  };

  it('calculates ISK differences between tiers', () => {
    const diffs = calculateTierDifferences(totals, 2500);

    expect(diffs.bareToComfortable.isk).toBe(270000); // 520000 - 250000
    expect(diffs.comfortableToDeluxe.isk).toBe(480000); // 1000000 - 520000
    expect(diffs.bareToDeluxe.isk).toBe(750000); // 1000000 - 250000
  });

  it('calculates hour differences when AWH provided', () => {
    const actualHourlyWage = 2500;
    const diffs = calculateTierDifferences(totals, actualHourlyWage);

    expect(diffs.bareToComfortable.hours).toBe(108); // 270000 / 2500
    expect(diffs.comfortableToDeluxe.hours).toBe(192); // 480000 / 2500
    expect(diffs.bareToDeluxe.hours).toBe(300); // 750000 / 2500
  });

  it('returns null hours when AWH is null', () => {
    const diffs = calculateTierDifferences(totals, null);

    expect(diffs.bareToComfortable.isk).toBe(270000);
    expect(diffs.bareToComfortable.hours).toBeNull();
    expect(diffs.comfortableToDeluxe.isk).toBe(480000);
    expect(diffs.comfortableToDeluxe.hours).toBeNull();
    expect(diffs.bareToDeluxe.isk).toBe(750000);
    expect(diffs.bareToDeluxe.hours).toBeNull();
  });

  it('returns null hours when AWH is zero', () => {
    const diffs = calculateTierDifferences(totals, 0);

    expect(diffs.bareToComfortable.hours).toBeNull();
    expect(diffs.comfortableToDeluxe.hours).toBeNull();
    expect(diffs.bareToDeluxe.hours).toBeNull();
  });

  it('handles negative differences correctly', () => {
    const reverseTotals: TierValues = {
      barebones: 1000000,
      comfortable: 500000,
      deluxe: 250000,
    };

    const diffs = calculateTierDifferences(reverseTotals, 2500);

    expect(diffs.bareToComfortable.isk).toBe(-500000);
    expect(diffs.bareToComfortable.hours).toBe(-200);
    expect(diffs.comfortableToDeluxe.isk).toBe(-250000);
    expect(diffs.comfortableToDeluxe.hours).toBe(-100);
  });
});

describe('calculateExpenseBaselineResults', () => {
  const actualHourlyWage = 2500;

  it('calculates complete results with all components', () => {
    const results = calculateExpenseBaselineResults(
      mockBaseline,
      actualHourlyWage
    );

    // Totals
    expect(results.totals.barebones).toBe(175000);
    expect(results.totals.comfortable).toBe(310000);
    expect(results.totals.deluxe).toBe(550000);

    // Annual totals
    expect(results.annualTotals.barebones).toBe(2100000);
    expect(results.annualTotals.comfortable).toBe(3720000);
    expect(results.annualTotals.deluxe).toBe(6600000);

    // Percentage breakdown
    expect(results.percentageBreakdown).toBeDefined();
    expect(Object.keys(results.percentageBreakdown)).toHaveLength(3);

    // Life energy
    expect(results.lifeEnergy).not.toBeNull();
    expect(results.lifeEnergy!.monthly.barebones).toBe(70);
    expect(results.lifeEnergy!.monthly.comfortable).toBe(124);
    expect(results.lifeEnergy!.monthly.deluxe).toBe(220);

    // Tier differences
    expect(results.tierDifferences.bareToComfortable.isk).toBe(135000);
    expect(results.tierDifferences.bareToComfortable.hours).toBe(54);

    // Category counts
    expect(results.categoryCount).toBe(3);
    expect(results.activeCategories).toBe(3);
  });

  it('calculates results without AWH', () => {
    const results = calculateExpenseBaselineResults(mockBaseline, null);

    expect(results.totals).toBeDefined();
    expect(results.annualTotals).toBeDefined();
    expect(results.percentageBreakdown).toBeDefined();

    // Life energy should be null
    expect(results.lifeEnergy).toBeNull();

    // Tier differences should have ISK but no hours
    expect(results.tierDifferences.bareToComfortable.isk).toBe(135000);
    expect(results.tierDifferences.bareToComfortable.hours).toBeNull();
  });

  it('handles baseline with hidden categories', () => {
    const baselineWithHidden: ExpenseBaseline = {
      ...mockBaseline,
      categories: [
        ...mockCategories,
        createMockCategory(
          'hidden',
          { barebones: 50000, comfortable: 100000, deluxe: 150000 },
          true
        ),
      ],
    };

    const results = calculateExpenseBaselineResults(
      baselineWithHidden,
      actualHourlyWage
    );

    expect(results.categoryCount).toBe(4);
    expect(results.activeCategories).toBe(3);

    // Totals should not include hidden category
    expect(results.totals.barebones).toBe(175000);
  });

  it('handles empty categories array', () => {
    const emptyBaseline: ExpenseBaseline = {
      ...mockBaseline,
      categories: [],
    };

    const results = calculateExpenseBaselineResults(
      emptyBaseline,
      actualHourlyWage
    );

    expect(results.totals.barebones).toBe(0);
    expect(results.categoryCount).toBe(0);
    expect(results.activeCategories).toBe(0);
  });
});

describe('getExpenseByTier', () => {
  it('returns correct monthly expense for barebones tier', () => {
    const expense = getExpenseByTier(mockBaseline, 'barebones');
    expect(expense).toBe(175000);
  });

  it('returns correct monthly expense for comfortable tier', () => {
    const expense = getExpenseByTier(mockBaseline, 'comfortable');
    expect(expense).toBe(310000);
  });

  it('returns correct monthly expense for deluxe tier', () => {
    const expense = getExpenseByTier(mockBaseline, 'deluxe');
    expect(expense).toBe(550000);
  });

  it('excludes hidden categories', () => {
    const baselineWithHidden: ExpenseBaseline = {
      ...mockBaseline,
      categories: [
        ...mockCategories,
        createMockCategory(
          'hidden',
          { barebones: 50000, comfortable: 100000, deluxe: 150000 },
          true
        ),
      ],
    };

    const expense = getExpenseByTier(baselineWithHidden, 'barebones');
    expect(expense).toBe(175000); // Should not include 50000 from hidden
  });
});

describe('getAnnualExpenseByTier', () => {
  it('returns annual expense for barebones tier', () => {
    const expense = getAnnualExpenseByTier(mockBaseline, 'barebones');
    expect(expense).toBe(2100000); // 175000 * 12
  });

  it('returns annual expense for comfortable tier', () => {
    const expense = getAnnualExpenseByTier(mockBaseline, 'comfortable');
    expect(expense).toBe(3720000); // 310000 * 12
  });

  it('returns annual expense for deluxe tier', () => {
    const expense = getAnnualExpenseByTier(mockBaseline, 'deluxe');
    expect(expense).toBe(6600000); // 550000 * 12
  });
});

describe('hasExpenseBaseline', () => {
  it('returns true when baseline exists and wizard completed', () => {
    const baseline: ExpenseBaseline = {
      categories: mockCategories,
      lastUpdated: new Date(),
      wizardCompleted: true,
      version: 1,
    };

    expect(hasExpenseBaseline(baseline)).toBe(true);
  });

  it('returns false when wizard not completed', () => {
    const baseline: ExpenseBaseline = {
      categories: mockCategories,
      lastUpdated: new Date(),
      wizardCompleted: false,
      version: 1,
    };

    expect(hasExpenseBaseline(baseline)).toBe(false);
  });

  it('returns false when baseline is null', () => {
    expect(hasExpenseBaseline(null)).toBe(false);
  });

  it('returns true even with empty categories if wizard completed', () => {
    const baseline: ExpenseBaseline = {
      categories: [],
      lastUpdated: new Date(),
      wizardCompleted: true,
      version: 1,
    };

    expect(hasExpenseBaseline(baseline)).toBe(true);
  });
});
