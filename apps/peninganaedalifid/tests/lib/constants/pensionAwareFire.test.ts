/**
 * Tests for Pension-Aware FIRE Constants
 *
 * Verifies all Icelandic pension system constants, default values,
 * validation ranges, and helper functions.
 */

import { describe, expect, it } from 'vitest';
import {
  PENSION_AWARE_DEFAULTS,
  ICELANDIC_PENSION_SYSTEM,
  PENSION_INPUT_RANGES,
  PHASE_COLORS,
  WARNING_THRESHOLDS,
  DEFAULT_LIFEYRISSJODUR,
  DEFAULT_SEREIGN,
  DEFAULT_TR,
  FI_MULTIPLIER_OPTIONS,
  EMPLOYER_MATCH_OPTIONS,
  TYPICAL_PENSION_SCENARIOS,
  EDUCATIONAL_EXAMPLES,
  getPhaseColor,
  getFIMultiplierDetails,
  getEmployerMatchLabel,
  isValidRetirementAge,
  isValidLifeyrissjodurAge,
  getTypicalScenario,
  yearsUntilSereignAccess,
  yearsUntilLifeyrissjodur,
  yearsUntilTR,
  formatISK,
  getPhaseDuration,
  willHaveGapPeriod,
  willHaveSereignBridge,
  getNumberOfPhases,
} from '@/lib/constants/pensionAwareFire';

describe('PENSION_AWARE_DEFAULTS', () => {
  it('should have reasonable default values for Iceland', () => {
    expect(PENSION_AWARE_DEFAULTS.currentAge).toBe(35);
    expect(PENSION_AWARE_DEFAULTS.targetRetirementAge).toBe(55);
    expect(PENSION_AWARE_DEFAULTS.monthlyExpenses).toBe(300_000);
    expect(PENSION_AWARE_DEFAULTS.currentSavings).toBe(0);
    expect(PENSION_AWARE_DEFAULTS.monthlySavings).toBe(200_000);
    expect(PENSION_AWARE_DEFAULTS.investmentReturn).toBe(0.05);
    expect(PENSION_AWARE_DEFAULTS.fiMultiplier).toBe(30);
    expect(PENSION_AWARE_DEFAULTS.version).toBe(1);
  });

  it('should have valid expense source and tier', () => {
    expect(PENSION_AWARE_DEFAULTS.expenseSource).toBe('manual');
    expect(PENSION_AWARE_DEFAULTS.expenseTier).toBe('comfortable');
  });

  it('should use 30x multiplier (recommended for Iceland)', () => {
    expect(PENSION_AWARE_DEFAULTS.fiMultiplier).toBe(30);
  });
});

describe('ICELANDIC_PENSION_SYSTEM', () => {
  describe('Séreign (Private Pension)', () => {
    it('should have correct access age (60)', () => {
      expect(ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE).toBe(60);
    });

    it('should have typical return rate', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TYPICAL_SEREIGN_RETURN).toBe(0.05);
    });
  });

  describe('Lífeyrissjóður (Occupational Pension)', () => {
    it('should have correct age ranges', () => {
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE).toBe(62);
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE).toBe(67);
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_LATE_AGE).toBe(72);
    });

    it('should have early age before standard age', () => {
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE).toBeLessThan(
        ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE
      );
    });

    it('should have standard age before late age', () => {
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE).toBeLessThan(
        ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_LATE_AGE
      );
    });

    it('should have typical monthly amount', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TYPICAL_LIFEYRISSJODUR_MONTHLY).toBe(300_000);
    });
  });

  describe('TR Ellilífeyrir (State Pension)', () => {
    it('should start at age 67', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TR_START_AGE).toBe(67);
    });

    it('should have max single amount', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE).toBe(380_000);
    });

    it('should have income exemption threshold', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION).toBe(36_500);
    });

    it('should have 45% reduction rate', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE).toBe(0.45);
    });

    it('should have TR start at same age as standard lífeyrissjóður', () => {
      expect(ICELANDIC_PENSION_SYSTEM.TR_START_AGE).toBe(
        ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE
      );
    });
  });

  describe('Age progression', () => {
    it('should have séreign before lífeyrissjóður', () => {
      expect(ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE).toBeLessThan(
        ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE
      );
    });

    it('should have lífeyrissjóður before TR', () => {
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE).toBeLessThanOrEqual(
        ICELANDIC_PENSION_SYSTEM.TR_START_AGE
      );
    });

    it('should have progression: 60 → 62 → 67', () => {
      expect(ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE).toBe(60);
      expect(ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_EARLY_AGE).toBe(62);
      expect(ICELANDIC_PENSION_SYSTEM.TR_START_AGE).toBe(67);
    });
  });

  describe('Life expectancy', () => {
    it('should assume life expectancy of 90', () => {
      expect(ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY).toBe(90);
    });

    it('should have life expectancy after TR start age', () => {
      expect(ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY).toBeGreaterThan(
        ICELANDIC_PENSION_SYSTEM.TR_START_AGE
      );
    });
  });
});

describe('PENSION_INPUT_RANGES', () => {
  describe('Age ranges', () => {
    it('should allow ages 18-70', () => {
      expect(PENSION_INPUT_RANGES.currentAge.min).toBe(18);
      expect(PENSION_INPUT_RANGES.currentAge.max).toBe(70);
    });

    it('should allow retirement ages 30-80', () => {
      expect(PENSION_INPUT_RANGES.targetRetirementAge.min).toBe(30);
      expect(PENSION_INPUT_RANGES.targetRetirementAge.max).toBe(80);
    });

    it('should allow lífeyrissjóður ages 62-72', () => {
      expect(PENSION_INPUT_RANGES.lifeyrissjodurStartAge.min).toBe(62);
      expect(PENSION_INPUT_RANGES.lifeyrissjodurStartAge.max).toBe(72);
    });
  });

  describe('Financial ranges', () => {
    it('should allow monthly expenses 100k-2M', () => {
      expect(PENSION_INPUT_RANGES.monthlyExpenses.min).toBe(100_000);
      expect(PENSION_INPUT_RANGES.monthlyExpenses.max).toBe(2_000_000);
    });

    it('should allow current savings up to 500M', () => {
      expect(PENSION_INPUT_RANGES.currentSavings.min).toBe(0);
      expect(PENSION_INPUT_RANGES.currentSavings.max).toBe(500_000_000);
    });

    it('should allow monthly savings up to 2M', () => {
      expect(PENSION_INPUT_RANGES.monthlySavings.min).toBe(0);
      expect(PENSION_INPUT_RANGES.monthlySavings.max).toBe(2_000_000);
    });

    it('should allow investment returns 0-15%', () => {
      expect(PENSION_INPUT_RANGES.investmentReturn.min).toBe(0);
      expect(PENSION_INPUT_RANGES.investmentReturn.max).toBe(0.15);
    });
  });

  describe('Pension ranges', () => {
    it('should allow lífeyrissjóður up to 1M/month', () => {
      expect(PENSION_INPUT_RANGES.lifeyrissjodurMonthly.min).toBe(0);
      expect(PENSION_INPUT_RANGES.lifeyrissjodurMonthly.max).toBe(1_000_000);
    });

    it('should allow séreign balance up to 100M', () => {
      expect(PENSION_INPUT_RANGES.sereignBalance.min).toBe(0);
      expect(PENSION_INPUT_RANGES.sereignBalance.max).toBe(100_000_000);
    });

    it('should allow séreign contribution up to 500k/month', () => {
      expect(PENSION_INPUT_RANGES.sereignMonthlyContribution.min).toBe(0);
      expect(PENSION_INPUT_RANGES.sereignMonthlyContribution.max).toBe(500_000);
    });

    it('should allow employer match 0-15%', () => {
      expect(PENSION_INPUT_RANGES.sereignEmployerMatch.min).toBe(0);
      expect(PENSION_INPUT_RANGES.sereignEmployerMatch.max).toBe(0.15);
    });

    it('should allow TR manual override up to max TR', () => {
      expect(PENSION_INPUT_RANGES.trManualOverride.min).toBe(0);
      expect(PENSION_INPUT_RANGES.trManualOverride.max).toBe(
        ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE
      );
    });
  });
});

describe('PHASE_COLORS', () => {
  it('should have colors for all phase types', () => {
    expect(PHASE_COLORS.working).toBeDefined();
    expect(PHASE_COLORS.gap).toBeDefined();
    expect(PHASE_COLORS['sereign-bridge']).toBeDefined();
    expect(PHASE_COLORS['full-pension']).toBeDefined();
  });

  it('should have primary, light, dark, and hex colors for each phase', () => {
    const phases = ['working', 'gap', 'sereign-bridge', 'full-pension'] as const;
    phases.forEach((phase) => {
      expect(PHASE_COLORS[phase].primary).toBeDefined();
      expect(PHASE_COLORS[phase].light).toBeDefined();
      expect(PHASE_COLORS[phase].dark).toBeDefined();
      expect(PHASE_COLORS[phase].hex).toBeDefined();
      expect(PHASE_COLORS[phase].hex).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  it('should use appropriate colors for each phase', () => {
    expect(PHASE_COLORS.working.hex).toBe('#3B82F6'); // blue
    expect(PHASE_COLORS.gap.hex).toBe('#EF4444'); // red
    expect(PHASE_COLORS['sereign-bridge'].hex).toBe('#F59E0B'); // amber
    expect(PHASE_COLORS['full-pension'].hex).toBe('#10B981'); // green
  });
});

describe('WARNING_THRESHOLDS', () => {
  it('should have reasonable threshold values', () => {
    expect(WARNING_THRESHOLDS.LONG_GAP_YEARS).toBe(15);
    expect(WARNING_THRESHOLDS.LOW_SAVINGS_RATE_PERCENT).toBe(10);
    expect(WARNING_THRESHOLDS.UNSUSTAINABLE_TIMELINE_MONTHS).toBe(600);
    expect(WARNING_THRESHOLDS.HIGH_EXPENSE_RATIO).toBe(2.0);
    expect(WARNING_THRESHOLDS.LARGE_SURPLUS_ISK).toBe(50_000_000);
    expect(WARNING_THRESHOLDS.HIGH_TR_REDUCTION_PERCENT).toBe(75);
  });

  it('should have very early retirement before séreign access', () => {
    expect(WARNING_THRESHOLDS.VERY_EARLY_RETIREMENT_AGE).toBeLessThan(
      ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE
    );
  });

  it('should have late retirement before standard lífeyrissjóður age', () => {
    expect(WARNING_THRESHOLDS.LATE_RETIREMENT_AGE).toBeLessThan(
      ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE
    );
  });
});

describe('DEFAULT_LIFEYRISSJODUR', () => {
  it('should use typical monthly amount', () => {
    expect(DEFAULT_LIFEYRISSJODUR.expectedMonthlyAmount).toBe(300_000);
  });

  it('should use standard age (67)', () => {
    expect(DEFAULT_LIFEYRISSJODUR.startAge).toBe(67);
  });
});

describe('DEFAULT_SEREIGN', () => {
  it('should start with zero balance', () => {
    expect(DEFAULT_SEREIGN.currentBalance).toBe(0);
  });

  it('should have zero contribution', () => {
    expect(DEFAULT_SEREIGN.monthlyContribution).toBe(0);
  });

  it('should have 2% employer match', () => {
    expect(DEFAULT_SEREIGN.employerMatchPercent).toBe(0.02);
  });
});

describe('DEFAULT_TR', () => {
  it('should expect full TR by default', () => {
    expect(DEFAULT_TR.expectFullTR).toBe(true);
  });

  it('should not have manual override', () => {
    expect(DEFAULT_TR.manualOverrideAmount).toBeNull();
  });
});

describe('FI_MULTIPLIER_OPTIONS', () => {
  it('should have 25x and 30x options', () => {
    expect(FI_MULTIPLIER_OPTIONS).toHaveLength(2);
    expect(FI_MULTIPLIER_OPTIONS[0].value).toBe(25);
    expect(FI_MULTIPLIER_OPTIONS[1].value).toBe(30);
  });

  it('should recommend 30x for Iceland', () => {
    const recommended = FI_MULTIPLIER_OPTIONS.find((opt) => opt.recommended);
    expect(recommended?.value).toBe(30);
  });

  it('should have correct withdrawal rates', () => {
    const opt25 = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 25);
    const opt30 = FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === 30);
    expect(opt25?.withdrawalRate).toBe(0.04);
    expect(opt30?.withdrawalRate).toBe(0.0333);
  });
});

describe('EMPLOYER_MATCH_OPTIONS', () => {
  it('should have options from 0% to 10%', () => {
    expect(EMPLOYER_MATCH_OPTIONS[0].value).toBe(0);
    expect(EMPLOYER_MATCH_OPTIONS[EMPLOYER_MATCH_OPTIONS.length - 1].value).toBe(0.1);
  });

  it('should have Icelandic labels', () => {
    EMPLOYER_MATCH_OPTIONS.forEach((opt) => {
      expect(opt.label).toBeDefined();
      expect(typeof opt.label).toBe('string');
    });
  });
});

describe('TYPICAL_PENSION_SCENARIOS', () => {
  it('should have average, conservative, and optimistic scenarios', () => {
    expect(TYPICAL_PENSION_SCENARIOS.average).toBeDefined();
    expect(TYPICAL_PENSION_SCENARIOS.conservative).toBeDefined();
    expect(TYPICAL_PENSION_SCENARIOS.optimistic).toBeDefined();
  });

  it('should have names in Icelandic', () => {
    expect(TYPICAL_PENSION_SCENARIOS.average.name).toBe('Meðalstarfsmaður');
    expect(TYPICAL_PENSION_SCENARIOS.conservative.name).toBe('Varkár áætlun');
    expect(TYPICAL_PENSION_SCENARIOS.optimistic.name).toBe('Bjartsýn áætlun');
  });

  it('should have complete pension data', () => {
    const scenarios = Object.values(TYPICAL_PENSION_SCENARIOS);
    scenarios.forEach((scenario) => {
      expect(scenario.lifeyrissjodur).toBeDefined();
      expect(scenario.sereign).toBeDefined();
      expect(scenario.tr).toBeDefined();
    });
  });
});

describe('EDUCATIONAL_EXAMPLES', () => {
  it('should show traditional vs pension-aware comparison', () => {
    expect(EDUCATIONAL_EXAMPLES.traditional.traditionalFI).toBe(144_000_000);
    expect(EDUCATIONAL_EXAMPLES.pensionAware.pensionAdjustedFI).toBe(38_500_000);
  });

  it('should calculate savings correctly', () => {
    const savings =
      EDUCATIONAL_EXAMPLES.traditional.traditionalFI -
      EDUCATIONAL_EXAMPLES.pensionAware.pensionAdjustedFI;
    expect(EDUCATIONAL_EXAMPLES.pensionAware.savings).toBe(savings);
    expect(EDUCATIONAL_EXAMPLES.pensionAware.savings).toBe(105_500_000);
  });
});

describe('Helper Functions', () => {
  describe('getPhaseColor', () => {
    it('should return color object for valid phase', () => {
      const color = getPhaseColor('gap');
      expect(color).toBeDefined();
      expect(color.primary).toBe('bg-red-500');
      expect(color.hex).toBe('#EF4444');
    });

    it('should work for all phase types', () => {
      expect(getPhaseColor('working')).toBeDefined();
      expect(getPhaseColor('gap')).toBeDefined();
      expect(getPhaseColor('sereign-bridge')).toBeDefined();
      expect(getPhaseColor('full-pension')).toBeDefined();
    });
  });

  describe('getFIMultiplierDetails', () => {
    it('should return details for 25x', () => {
      const details = getFIMultiplierDetails(25);
      expect(details?.value).toBe(25);
      expect(details?.withdrawalRate).toBe(0.04);
    });

    it('should return details for 30x', () => {
      const details = getFIMultiplierDetails(30);
      expect(details?.value).toBe(30);
      expect(details?.withdrawalRate).toBe(0.0333);
    });
  });

  describe('getEmployerMatchLabel', () => {
    it('should return label for common matches', () => {
      expect(getEmployerMatchLabel(0)).toBe('Engin mótframlag');
      expect(getEmployerMatchLabel(0.02)).toBe('2% (algeng)');
    });

    it('should return percentage for custom values', () => {
      expect(getEmployerMatchLabel(0.05)).toBe('5%');
    });
  });

  describe('isValidRetirementAge', () => {
    it('should reject retirement at or before current age', () => {
      expect(isValidRetirementAge(35, 35)).toBe(false);
      expect(isValidRetirementAge(35, 34)).toBe(false);
    });

    it('should accept valid retirement ages', () => {
      expect(isValidRetirementAge(35, 55)).toBe(true);
      expect(isValidRetirementAge(40, 65)).toBe(true);
    });

    it('should reject ages outside range', () => {
      expect(isValidRetirementAge(35, 25)).toBe(false);
      expect(isValidRetirementAge(35, 85)).toBe(false);
    });
  });

  describe('isValidLifeyrissjodurAge', () => {
    it('should accept ages 62-72', () => {
      expect(isValidLifeyrissjodurAge(62)).toBe(true);
      expect(isValidLifeyrissjodurAge(67)).toBe(true);
      expect(isValidLifeyrissjodurAge(72)).toBe(true);
    });

    it('should reject ages outside range', () => {
      expect(isValidLifeyrissjodurAge(61)).toBe(false);
      expect(isValidLifeyrissjodurAge(73)).toBe(false);
    });
  });

  describe('getTypicalScenario', () => {
    it('should return scenario by name', () => {
      const average = getTypicalScenario('average');
      expect(average.name).toBe('Meðalstarfsmaður');
      expect(average.lifeyrissjodur.expectedMonthlyAmount).toBe(300_000);
    });

    it('should work for all scenario types', () => {
      expect(getTypicalScenario('average')).toBeDefined();
      expect(getTypicalScenario('conservative')).toBeDefined();
      expect(getTypicalScenario('optimistic')).toBeDefined();
    });
  });

  describe('yearsUntilSereignAccess', () => {
    it('should calculate years correctly', () => {
      expect(yearsUntilSereignAccess(35)).toBe(25);
      expect(yearsUntilSereignAccess(50)).toBe(10);
      expect(yearsUntilSereignAccess(59)).toBe(1);
    });

    it('should return 0 if already at or past age 60', () => {
      expect(yearsUntilSereignAccess(60)).toBe(0);
      expect(yearsUntilSereignAccess(65)).toBe(0);
    });
  });

  describe('yearsUntilLifeyrissjodur', () => {
    it('should calculate years until age 67', () => {
      expect(yearsUntilLifeyrissjodur(35)).toBe(32);
      expect(yearsUntilLifeyrissjodur(60)).toBe(7);
    });

    it('should return 0 if already at or past age 67', () => {
      expect(yearsUntilLifeyrissjodur(67)).toBe(0);
      expect(yearsUntilLifeyrissjodur(70)).toBe(0);
    });
  });

  describe('yearsUntilTR', () => {
    it('should calculate years until age 67', () => {
      expect(yearsUntilTR(35)).toBe(32);
      expect(yearsUntilTR(60)).toBe(7);
    });

    it('should return 0 if already at or past age 67', () => {
      expect(yearsUntilTR(67)).toBe(0);
      expect(yearsUntilTR(70)).toBe(0);
    });
  });

  describe('formatISK', () => {
    it('should format millions with M suffix', () => {
      expect(formatISK(1_000_000)).toBe('1M kr');
      expect(formatISK(50_000_000)).toBe('50M kr');
      expect(formatISK(144_000_000)).toBe('144M kr');
    });

    it('should format smaller amounts with locale', () => {
      expect(formatISK(500_000)).toContain('500');
      expect(formatISK(250_000)).toContain('250');
    });

    it('should include decimals when requested', () => {
      expect(formatISK(1_500_000, true)).toBe('1.5M kr');
      expect(formatISK(38_500_000, true)).toBe('38.5M kr');
    });
  });

  describe('getPhaseDuration', () => {
    it('should calculate duration correctly', () => {
      expect(getPhaseDuration(55, 60)).toBe(5);
      expect(getPhaseDuration(60, 67)).toBe(7);
      expect(getPhaseDuration(67, 90)).toBe(23);
    });

    it('should return 0 for invalid ranges', () => {
      expect(getPhaseDuration(60, 55)).toBe(0);
      expect(getPhaseDuration(60, 60)).toBe(0);
    });
  });

  describe('willHaveGapPeriod', () => {
    it('should return true for retirement before 60', () => {
      expect(willHaveGapPeriod(50)).toBe(true);
      expect(willHaveGapPeriod(55)).toBe(true);
      expect(willHaveGapPeriod(59)).toBe(true);
    });

    it('should return false for retirement at or after 60', () => {
      expect(willHaveGapPeriod(60)).toBe(false);
      expect(willHaveGapPeriod(65)).toBe(false);
    });
  });

  describe('willHaveSereignBridge', () => {
    it('should return true for retirement before 67', () => {
      expect(willHaveSereignBridge(55)).toBe(true);
      expect(willHaveSereignBridge(60)).toBe(true);
      expect(willHaveSereignBridge(66)).toBe(true);
    });

    it('should return false for retirement at or after 67', () => {
      expect(willHaveSereignBridge(67)).toBe(false);
      expect(willHaveSereignBridge(70)).toBe(false);
    });
  });

  describe('getNumberOfPhases', () => {
    it('should return 3 phases for retirement before 60', () => {
      expect(getNumberOfPhases(50)).toBe(3);
      expect(getNumberOfPhases(55)).toBe(3);
    });

    it('should return 2 phases for retirement 60-66', () => {
      expect(getNumberOfPhases(60)).toBe(2);
      expect(getNumberOfPhases(65)).toBe(2);
    });

    it('should return 1 phase for retirement at or after 67', () => {
      expect(getNumberOfPhases(67)).toBe(1);
      expect(getNumberOfPhases(70)).toBe(1);
    });
  });
});
