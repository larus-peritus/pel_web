/**
 * Tests for LeanFIRE constants
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_BAREBONES_REYKJAVIK,
  DEFAULT_BAREBONES_LANDSBYGGD,
  FI_MULTIPLIER_OPTIONS,
  DEFAULT_FI_MULTIPLIER,
  REDUCTION_PERCENTAGE_OPTIONS,
  LOCATION_PROS_CONS,
  FRUGALITY_TIP_TEMPLATES,
  LEANFIRE_DEFAULTS,
  LEANFIRE_RANGES,
  getDefaultBarebonesExpenses,
  getTotalMonthly,
  getFIMultiplierDetails,
  getReductionPercentageDetails,
  getTipsForCategory,
  estimateTipSavings,
} from '../leanFire';

describe('LeanFIRE Constants', () => {
  describe('Default Barebones Expenses', () => {
    it('should have Reykjavík expenses totaling 240,000 ISK/month', () => {
      const total = getTotalMonthly(DEFAULT_BAREBONES_REYKJAVIK);
      expect(total).toBe(240_000);
    });

    it('should have Landsbyggð expenses totaling 200,000 ISK/month', () => {
      const total = getTotalMonthly(DEFAULT_BAREBONES_LANDSBYGGD);
      expect(total).toBe(200_000);
    });

    it('should have Landsbyggð cheaper than Reykjavík', () => {
      const reykjavikTotal = getTotalMonthly(DEFAULT_BAREBONES_REYKJAVIK);
      const landsbyggdTotal = getTotalMonthly(DEFAULT_BAREBONES_LANDSBYGGD);
      expect(landsbyggdTotal).toBeLessThan(reykjavikTotal);
    });

    it('should have all expense categories defined for Reykjavík', () => {
      expect(DEFAULT_BAREBONES_REYKJAVIK.housing).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.food).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.transport).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.healthcare).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.insurance).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.utilities).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.personal).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.entertainment).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_REYKJAVIK.other).toBeGreaterThanOrEqual(0);
    });

    it('should have all expense categories defined for Landsbyggð', () => {
      expect(DEFAULT_BAREBONES_LANDSBYGGD.housing).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.food).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.transport).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.healthcare).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.insurance).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.utilities).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.personal).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.entertainment).toBeGreaterThan(0);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.other).toBeGreaterThanOrEqual(0);
    });

    it('should have realistic Iceland housing costs', () => {
      // Reykjavík housing should be 80k-150k
      expect(DEFAULT_BAREBONES_REYKJAVIK.housing).toBeGreaterThanOrEqual(80_000);
      expect(DEFAULT_BAREBONES_REYKJAVIK.housing).toBeLessThanOrEqual(150_000);

      // Landsbyggð housing should be 50k-100k
      expect(DEFAULT_BAREBONES_LANDSBYGGD.housing).toBeGreaterThanOrEqual(50_000);
      expect(DEFAULT_BAREBONES_LANDSBYGGD.housing).toBeLessThanOrEqual(100_000);
    });
  });

  describe('FI Multiplier Options', () => {
    it('should have 2 multiplier options', () => {
      expect(FI_MULTIPLIER_OPTIONS).toHaveLength(2);
    });

    it('should include 25x and 30x multipliers', () => {
      const values = FI_MULTIPLIER_OPTIONS.map((opt) => opt.value);
      expect(values).toContain(25);
      expect(values).toContain(30);
    });

    it('should have 30x as recommended multiplier', () => {
      const option30x = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 30);
      expect(option30x?.recommended).toBe(true);
    });

    it('should have 25x as not recommended', () => {
      const option25x = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 25);
      expect(option25x?.recommended).toBe(false);
    });

    it('should have correct withdrawal rates', () => {
      const option25x = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 25);
      const option30x = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 30);

      expect(option25x?.withdrawalRate).toBe(0.04); // 4%
      expect(option30x?.withdrawalRate).toBeCloseTo(0.0333, 4); // 3.33%
    });

    it('should have default multiplier of 30', () => {
      expect(DEFAULT_FI_MULTIPLIER).toBe(30);
    });

    it('should have Icelandic labels', () => {
      FI_MULTIPLIER_OPTIONS.forEach((opt) => {
        expect(opt.label).toBeTruthy();
        expect(opt.description).toBeTruthy();
        expect(opt.description).toContain('úttektarhlutfall');
      });
    });
  });

  describe('Reduction Percentage Options', () => {
    it('should have 4 reduction percentage options', () => {
      expect(REDUCTION_PERCENTAGE_OPTIONS).toHaveLength(4);
    });

    it('should include 10%, 25%, 50%, and 100% options', () => {
      const values = REDUCTION_PERCENTAGE_OPTIONS.map((opt) => opt.value);
      expect(values).toContain(10);
      expect(values).toContain(25);
      expect(values).toContain(50);
      expect(values).toContain(100);
    });

    it('should have Icelandic labels and descriptions', () => {
      REDUCTION_PERCENTAGE_OPTIONS.forEach((opt) => {
        expect(opt.label).toBeTruthy();
        expect(opt.description).toBeTruthy();
      });
    });
  });

  describe('Location Pros and Cons', () => {
    it('should have data for both Reykjavík and Landsbyggð', () => {
      expect(LOCATION_PROS_CONS.reykjavik).toBeDefined();
      expect(LOCATION_PROS_CONS.landsbyggd).toBeDefined();
    });

    it('should have multiple pros for each location', () => {
      expect(LOCATION_PROS_CONS.reykjavik.pros.length).toBeGreaterThanOrEqual(5);
      expect(LOCATION_PROS_CONS.landsbyggd.pros.length).toBeGreaterThanOrEqual(5);
    });

    it('should have multiple cons for each location', () => {
      expect(LOCATION_PROS_CONS.reykjavik.cons.length).toBeGreaterThanOrEqual(4);
      expect(LOCATION_PROS_CONS.landsbyggd.cons.length).toBeGreaterThanOrEqual(4);
    });

    it('should have all pros/cons as non-empty strings', () => {
      [...LOCATION_PROS_CONS.reykjavik.pros, ...LOCATION_PROS_CONS.reykjavik.cons].forEach(
        (item) => {
          expect(item).toBeTruthy();
          expect(typeof item).toBe('string');
          expect(item.length).toBeGreaterThan(10);
        }
      );

      [...LOCATION_PROS_CONS.landsbyggd.pros, ...LOCATION_PROS_CONS.landsbyggd.cons].forEach(
        (item) => {
          expect(item).toBeTruthy();
          expect(typeof item).toBe('string');
          expect(item.length).toBeGreaterThan(10);
        }
      );
    });
  });

  describe('Frugality Tip Templates', () => {
    it('should have at least 30 tips', () => {
      expect(FRUGALITY_TIP_TEMPLATES.length).toBeGreaterThanOrEqual(30);
    });

    it('should have tips for all major categories', () => {
      const categories = new Set(FRUGALITY_TIP_TEMPLATES.map((tip) => tip.category));

      expect(categories.has('housing')).toBe(true);
      expect(categories.has('food')).toBe(true);
      expect(categories.has('transport')).toBe(true);
      expect(categories.has('entertainment')).toBe(true);
      expect(categories.has('personal')).toBe(true);
      expect(categories.has('utilities')).toBe(true);
    });

    it('should have valid difficulty levels for all tips', () => {
      const validDifficulties = ['easy', 'moderate', 'hard'];

      FRUGALITY_TIP_TEMPLATES.forEach((tip) => {
        expect(validDifficulties).toContain(tip.difficulty);
      });
    });

    it('should have realistic savings ranges', () => {
      FRUGALITY_TIP_TEMPLATES.forEach((tip) => {
        const [minSavings, maxSavings] = tip.potentialSavingsRange;

        expect(minSavings).toBeGreaterThan(0);
        expect(maxSavings).toBeGreaterThan(0);
        expect(maxSavings).toBeGreaterThanOrEqual(minSavings);
        expect(maxSavings).toBeLessThanOrEqual(100_000); // Sanity check
      });
    });

    it('should have Icelandic titles and descriptions', () => {
      FRUGALITY_TIP_TEMPLATES.forEach((tip) => {
        expect(tip.title).toBeTruthy();
        expect(tip.description).toBeTruthy();
        expect(tip.title.length).toBeGreaterThan(5);
        expect(tip.description.length).toBeGreaterThan(20);
      });
    });

    it('should have Iceland-specific resources where applicable', () => {
      const tipsWithResources = FRUGALITY_TIP_TEMPLATES.filter(
        (tip) => tip.icelandicResources && tip.icelandicResources.length > 0
      );

      // At least some tips should have resources
      expect(tipsWithResources.length).toBeGreaterThan(10);

      // Resources should be non-empty strings
      tipsWithResources.forEach((tip) => {
        tip.icelandicResources!.forEach((resource) => {
          expect(resource).toBeTruthy();
          expect(typeof resource).toBe('string');
        });
      });
    });

    it('should have multiple housing tips', () => {
      const housingTips = getTipsForCategory('housing');
      expect(housingTips.length).toBeGreaterThanOrEqual(4);
    });

    it('should have multiple food tips', () => {
      const foodTips = getTipsForCategory('food');
      expect(foodTips.length).toBeGreaterThanOrEqual(6);
    });

    it('should have multiple transport tips', () => {
      const transportTips = getTipsForCategory('transport');
      expect(transportTips.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Defaults and Ranges', () => {
    it('should have correct default values', () => {
      expect(LEANFIRE_DEFAULTS.fiMultiplier).toBe(30);
      expect(LEANFIRE_DEFAULTS.investmentReturn).toBe(0.05);
      expect(LEANFIRE_DEFAULTS.selectedLocation).toBe('reykjavik');
      expect(LEANFIRE_DEFAULTS.version).toBe(1);
    });

    it('should have valid ranges for all inputs', () => {
      expect(LEANFIRE_RANGES.monthlyExpenses.min).toBe(0);
      expect(LEANFIRE_RANGES.monthlyExpenses.max).toBeGreaterThan(0);

      expect(LEANFIRE_RANGES.currentSavings.min).toBe(0);
      expect(LEANFIRE_RANGES.currentSavings.max).toBeGreaterThan(0);

      expect(LEANFIRE_RANGES.currentAge.min).toBeGreaterThanOrEqual(18);
      expect(LEANFIRE_RANGES.currentAge.max).toBeLessThanOrEqual(100);

      expect(LEANFIRE_RANGES.savingsRate.min).toBe(0);
      expect(LEANFIRE_RANGES.savingsRate.max).toBeGreaterThan(0);

      expect(LEANFIRE_RANGES.investmentReturn.min).toBe(0);
      expect(LEANFIRE_RANGES.investmentReturn.max).toBeLessThanOrEqual(0.2);
    });
  });

  describe('Helper Functions', () => {
    describe('getDefaultBarebonesExpenses', () => {
      it('should return Reykjavík expenses for reykjavik location', () => {
        const expenses = getDefaultBarebonesExpenses('reykjavik');
        expect(expenses).toEqual(DEFAULT_BAREBONES_REYKJAVIK);
      });

      it('should return Landsbyggð expenses for landsbyggd location', () => {
        const expenses = getDefaultBarebonesExpenses('landsbyggd');
        expect(expenses).toEqual(DEFAULT_BAREBONES_LANDSBYGGD);
      });
    });

    describe('getTotalMonthly', () => {
      it('should correctly sum all expense categories', () => {
        const mockExpenses = {
          housing: 100_000,
          food: 40_000,
          transport: 15_000,
          healthcare: 5_000,
          insurance: 8_000,
          utilities: 25_000,
          personal: 10_000,
          entertainment: 12_000,
          other: 5_000,
        };

        const total = getTotalMonthly(mockExpenses);
        expect(total).toBe(220_000);
      });

      it('should handle zero values', () => {
        const mockExpenses = {
          housing: 0,
          food: 0,
          transport: 0,
          healthcare: 0,
          insurance: 0,
          utilities: 0,
          personal: 0,
          entertainment: 0,
          other: 0,
        };

        const total = getTotalMonthly(mockExpenses);
        expect(total).toBe(0);
      });
    });

    describe('getFIMultiplierDetails', () => {
      it('should return details for 25x multiplier', () => {
        const details = getFIMultiplierDetails(25);
        expect(details).toBeDefined();
        expect(details?.value).toBe(25);
        expect(details?.withdrawalRate).toBe(0.04);
      });

      it('should return details for 30x multiplier', () => {
        const details = getFIMultiplierDetails(30);
        expect(details).toBeDefined();
        expect(details?.value).toBe(30);
        expect(details?.recommended).toBe(true);
      });
    });

    describe('getReductionPercentageDetails', () => {
      it('should return details for 10% reduction', () => {
        const details = getReductionPercentageDetails(10);
        expect(details).toBeDefined();
        expect(details?.value).toBe(10);
      });

      it('should return details for 100% reduction', () => {
        const details = getReductionPercentageDetails(100);
        expect(details).toBeDefined();
        expect(details?.value).toBe(100);
      });
    });

    describe('getTipsForCategory', () => {
      it('should return housing tips', () => {
        const tips = getTipsForCategory('housing');
        expect(tips.length).toBeGreaterThan(0);
        tips.forEach((tip) => {
          expect(tip.category).toBe('housing');
        });
      });

      it('should return food tips', () => {
        const tips = getTipsForCategory('food');
        expect(tips.length).toBeGreaterThan(0);
        tips.forEach((tip) => {
          expect(tip.category).toBe('food');
        });
      });

      it('should return empty array for category with no tips', () => {
        const tips = getTipsForCategory('other');
        expect(Array.isArray(tips)).toBe(true);
      });
    });

    describe('estimateTipSavings', () => {
      const mockTip = {
        category: 'food' as const,
        title: 'Test tip',
        description: 'Test description',
        difficulty: 'easy' as const,
        potentialSavingsRange: [5_000, 15_000] as [number, number],
      };

      it('should return midpoint for normal expense levels', () => {
        const savings = estimateTipSavings(mockTip, 50_000);
        expect(savings).toBe(10_000); // Midpoint of [5000, 15000]
      });

      it('should return lower estimate for very low expenses', () => {
        const savings = estimateTipSavings(mockTip, 2_000);
        expect(savings).toBeLessThanOrEqual(5_000);
      });

      it('should return positive number', () => {
        const savings = estimateTipSavings(mockTip, 20_000);
        expect(savings).toBeGreaterThan(0);
      });

      it('should handle edge case of zero current expense', () => {
        const savings = estimateTipSavings(mockTip, 0);
        expect(savings).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
