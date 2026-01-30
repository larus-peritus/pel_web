/**
 * Constants and Defaults for Pension-Aware FIRE Calculator
 *
 * Icelandic pension system constants, calculator defaults, validation ranges,
 * and visualization settings for the Lífeyristengd FIRE Reiknivél.
 *
 * This file contains:
 * - PENSION_AWARE_DEFAULTS: Default input values
 * - ICELANDIC_PENSION_SYSTEM: Ages, amounts, and rates for Iceland's pension system
 * - PENSION_INPUT_RANGES: Validation ranges for all inputs
 * - PHASE_COLORS: Color scheme for timeline visualization
 * - WARNING_THRESHOLDS: When to show plan warnings
 * - DEFAULT_LIFEYRISSJODUR, DEFAULT_SEREIGN, DEFAULT_TR: Default pension inputs
 */

import type {
  LifeyrissjodurInput,
  SereignInput,
  TRInput,
  ExpenseTier,
  ExpenseSource,
  RetirementPhaseId,
} from '@/types/pensionAwareFire';

// ============================================================================
// CALCULATOR DEFAULTS
// ============================================================================

/**
 * Default input values for Pension-Aware FIRE calculator
 *
 * Based on a typical early FIRE scenario:
 * - 35-year-old planning to retire at 55
 * - Moderate monthly expenses (300,000 ISK)
 * - No current savings (starting from scratch)
 * - Healthy monthly savings rate (200,000 ISK)
 * - Conservative investment return (5%)
 * - 30x multiplier (recommended for Iceland due to higher inflation)
 */
export const PENSION_AWARE_DEFAULTS = {
  // Basic financial inputs
  currentAge: 35,
  targetRetirementAge: 55,
  monthlyExpenses: 300_000, // ISK
  expenseSource: 'manual' as ExpenseSource,
  expenseTier: 'comfortable' as ExpenseTier,
  currentSavings: 0, // ISK
  monthlySavings: 200_000, // ISK
  investmentReturn: 0.05, // 5% annual return

  // Meta
  fiMultiplier: 30, // 3.33% withdrawal rate (recommended for Iceland)
  version: 1,
};

// ============================================================================
// ICELANDIC PENSION SYSTEM
// ============================================================================

/**
 * Official ages, amounts, and rates for Iceland's three-tier pension system
 *
 * Sources:
 * - Séreign: Private pension regulations (accessible from age 60)
 * - Lífeyrissjóður: Occupational pension fund rules (typically starts 62-67)
 * - TR Ellilífeyrir: State pension (Tryggingastofnun) - starts at 67
 *
 * Note: TR means-testing values from 2024 (subject to annual adjustments)
 * Life expectancy from Statistics Iceland
 */
export const ICELANDIC_PENSION_SYSTEM = {
  // ============ Séreign (Private Pension) ============
  /** Age when séreign becomes accessible */
  SEREIGN_ACCESS_AGE: 60,

  /** Typical annual return for séreign funds (conservative estimate) */
  TYPICAL_SEREIGN_RETURN: 0.05, // 5%

  // ============ Lífeyrissjóður (Occupational Pension) ============
  /** Earliest age for lífeyrissjóður (early retirement) */
  LIFEYRISSJODUR_EARLY_AGE: 62,

  /** Standard retirement age for lífeyrissjóður */
  LIFEYRISSJODUR_STANDARD_AGE: 67,

  /** Latest age to start lífeyrissjóður (deferred retirement) */
  LIFEYRISSJODUR_LATE_AGE: 72,

  /** Typical monthly lífeyrissjóður amount for average worker (ISK) */
  TYPICAL_LIFEYRISSJODUR_MONTHLY: 300_000,

  // ============ TR Ellilífeyrir (State Pension) ============
  /** Age when TR starts (state pension age) */
  TR_START_AGE: 67,

  /** Maximum monthly TR for single person (ISK, 2024 rates) */
  TR_MAX_SINGLE: 380_000,

  /** Income exemption threshold before TR reduction kicks in (ISK/month) */
  TR_INCOME_EXEMPTION: 36_500,

  /** Reduction rate for TR means-testing (45% of income above exemption) */
  TR_REDUCTION_RATE: 0.45,

  // ============ Life Expectancy ============
  /** Assumed life expectancy for calculations (conservative estimate) */
  ASSUMED_LIFE_EXPECTANCY: 90,
} as const;

// ============================================================================
// PENSION INPUT RANGES
// ============================================================================

/**
 * Validation ranges for all calculator inputs
 *
 * These ranges ensure realistic scenarios and prevent calculation errors.
 * Ranges are based on Icelandic economic context.
 */
export const PENSION_INPUT_RANGES = {
  // Basic inputs
  currentAge: {
    min: 18, // Legal working age
    max: 70, // Reasonable max age for FIRE planning
  },

  targetRetirementAge: {
    min: 30, // Extreme early retirement
    max: 80, // Latest realistic retirement
    // Note: Must be greater than currentAge (validated separately)
  },

  monthlyExpenses: {
    min: 100_000, // Minimum viable (very lean)
    max: 2_000_000, // Upper bound for calculator
  },

  currentSavings: {
    min: 0, // Starting from scratch
    max: 500_000_000, // 500M ISK upper bound
  },

  monthlySavings: {
    min: 0, // Not currently saving
    max: 2_000_000, // Very high savings rate
  },

  investmentReturn: {
    min: 0, // No growth
    max: 0.15, // 15% (optimistic upper bound)
  },

  // Lífeyrissjóður inputs
  lifeyrissjodurMonthly: {
    min: 0, // No occupational pension
    max: 1_000_000, // Very high pension
  },

  lifeyrissjodurStartAge: {
    min: 62, // Earliest allowed
    max: 72, // Latest allowed
  },

  // Séreign inputs
  sereignBalance: {
    min: 0, // No séreign
    max: 100_000_000, // 100M ISK upper bound
  },

  sereignMonthlyContribution: {
    min: 0, // Not contributing
    max: 500_000, // Very high contribution
  },

  sereignEmployerMatch: {
    min: 0, // No employer match
    max: 0.15, // 15% (generous)
  },

  // TR inputs
  trManualOverride: {
    min: 0, // No TR
    max: ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE, // Cannot exceed max
  },
} as const;

// ============================================================================
// DEFAULT PENSION INPUTS
// ============================================================================

/**
 * Default Lífeyrissjóður (Occupational Pension) inputs
 *
 * Represents typical scenario for average Icelandic worker
 */
export const DEFAULT_LIFEYRISSJODUR: LifeyrissjodurInput = {
  expectedMonthlyAmount: ICELANDIC_PENSION_SYSTEM.TYPICAL_LIFEYRISSJODUR_MONTHLY,
  startAge: ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE,
};

/**
 * Default Séreign (Private Pension) inputs
 *
 * Assumes no existing balance or contributions (user fills in)
 */
export const DEFAULT_SEREIGN: SereignInput = {
  currentBalance: 0,
  monthlyContribution: 0,
  employerMatchPercent: 0.02, // 2% (common employer match)
};

/**
 * Default TR Ellilífeyrir (State Pension) inputs
 *
 * Assumes full TR expected (calculator will adjust based on means-testing)
 */
export const DEFAULT_TR: TRInput = {
  expectFullTR: true,
  manualOverrideAmount: null, // Let calculator auto-calculate
};

// ============================================================================
// PHASE VISUALIZATION COLORS
// ============================================================================

/**
 * Color scheme for retirement phase timeline visualization
 *
 * Each phase has a distinct color to make the timeline easy to understand:
 * - Working years: Blue (accumulation phase)
 * - Gap period: Red/Orange (self-funded, challenging)
 * - Séreign bridge: Amber (partial support)
 * - Full pension: Green (fully supported)
 */
export const PHASE_COLORS: Record<
  'working' | RetirementPhaseId,
  {
    primary: string; // Main color (Tailwind class)
    light: string; // Light variant for backgrounds
    dark: string; // Dark variant for text
    hex: string; // Hex code for charts
  }
> = {
  working: {
    primary: 'bg-blue-500',
    light: 'bg-blue-100',
    dark: 'text-blue-900',
    hex: '#3B82F6', // blue-500
  },
  gap: {
    primary: 'bg-red-500',
    light: 'bg-red-100',
    dark: 'text-red-900',
    hex: '#EF4444', // red-500
  },
  'sereign-bridge': {
    primary: 'bg-amber-500',
    light: 'bg-amber-100',
    dark: 'text-amber-900',
    hex: '#F59E0B', // amber-500
  },
  'full-pension': {
    primary: 'bg-green-500',
    light: 'bg-green-100',
    dark: 'text-green-900',
    hex: '#10B981', // green-500
  },
} as const;

// ============================================================================
// WARNING THRESHOLDS
// ============================================================================

/**
 * Thresholds for displaying warnings about retirement plan viability
 *
 * Used by the calculation engine to generate PlanWarning objects
 */
export const WARNING_THRESHOLDS = {
  /** Show warning if gap period (self-funded) is longer than this many years */
  LONG_GAP_YEARS: 15,

  /** Show warning if savings rate is below this percentage of monthly income */
  LOW_SAVINGS_RATE_PERCENT: 10,

  /** Show warning if FI number divided by monthly savings exceeds this (unsustainable) */
  UNSUSTAINABLE_TIMELINE_MONTHS: 600, // 50 years

  /** Show warning if monthly expenses exceed this percentage of typical lífeyrissjóður */
  HIGH_EXPENSE_RATIO: 2.0, // 200% of pension

  /** Show info if projected surplus at 90 exceeds this amount (could retire earlier) */
  LARGE_SURPLUS_ISK: 50_000_000, // 50M ISK

  /** Show warning if TR reduction exceeds this percentage */
  HIGH_TR_REDUCTION_PERCENT: 75, // 75% reduced

  /** Show warning if retirement age is very early (before séreign access) */
  VERY_EARLY_RETIREMENT_AGE: ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - 10, // Age 50

  /** Show warning if retirement age is close to or past lífeyrissjóður age */
  LATE_RETIREMENT_AGE: ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE - 2, // Age 65
} as const;

// ============================================================================
// HELPER CONSTANTS
// ============================================================================

/**
 * FI multiplier options with Icelandic context
 *
 * - 25x = 4% withdrawal rate (US standard, more aggressive)
 * - 30x = 3.33% withdrawal rate (recommended for Iceland due to higher inflation)
 */
export const FI_MULTIPLIER_OPTIONS = [
  {
    value: 25,
    label: '25x',
    description: '4% úttektarhlutfall (árásargjarn)',
    withdrawalRate: 0.04,
    recommended: false,
  },
  {
    value: 30,
    label: '30x',
    description: '3.33% úttektarhlutfall (mælt með fyrir Ísland)',
    withdrawalRate: 0.0333,
    recommended: true,
  },
] as const;

/**
 * Typical employer match percentages in Iceland
 */
export const EMPLOYER_MATCH_OPTIONS = [
  { value: 0, label: 'Engin mótframlag' },
  { value: 0.02, label: '2% (algeng)' },
  { value: 0.04, label: '4%' },
  { value: 0.06, label: '6%' },
  { value: 0.08, label: '8%' },
  { value: 0.1, label: '10%' },
] as const;

/**
 * Quick-fill scenarios for "Use typical values" button
 */
export const TYPICAL_PENSION_SCENARIOS = {
  average: {
    name: 'Meðalstarfsmaður',
    lifeyrissjodur: {
      expectedMonthlyAmount: 300_000,
      startAge: 67,
    },
    sereign: {
      currentBalance: 5_000_000, // Typical at age 35
      monthlyContribution: 10_000,
      employerMatchPercent: 0.02,
    },
    tr: {
      expectFullTR: true,
      manualOverrideAmount: null,
    },
  },
  conservative: {
    name: 'Varkár áætlun',
    lifeyrissjodur: {
      expectedMonthlyAmount: 200_000, // Lower estimate
      startAge: 67,
    },
    sereign: {
      currentBalance: 0,
      monthlyContribution: 0,
      employerMatchPercent: 0,
    },
    tr: {
      expectFullTR: false, // Assume reduced
      manualOverrideAmount: null,
    },
  },
  optimistic: {
    name: 'Bjartsýn áætlun',
    lifeyrissjodur: {
      expectedMonthlyAmount: 450_000, // Higher estimate
      startAge: 62, // Early retirement
    },
    sereign: {
      currentBalance: 10_000_000,
      monthlyContribution: 20_000,
      employerMatchPercent: 0.04,
    },
    tr: {
      expectFullTR: true,
      manualOverrideAmount: null,
    },
  },
} as const;

// ============================================================================
// EDUCATIONAL CONTENT HELPERS
// ============================================================================

/**
 * Example scenarios for educational intro
 * Used to demonstrate how pension-aware planning saves money
 */
export const EDUCATIONAL_EXAMPLES = {
  traditional: {
    age: 35,
    retirementAge: 52,
    monthlyExpenses: 400_000,
    traditionalFI: 144_000_000, // 30x annual expenses (400k * 12 * 30)
    description: 'Hefðbundin FIRE-tala (30x árleg útgjöld)',
  },
  pensionAware: {
    age: 35,
    retirementAge: 52,
    monthlyExpenses: 400_000,
    pensionAdjustedFI: 38_500_000, // What you actually need (covers gap to 60)
    savings: 105_500_000, // 144M - 38.5M
    description: 'Lífeyristengd FIRE-tala (raunveruleg þörf)',
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color scheme for a specific phase
 */
export function getPhaseColor(phaseId: 'working' | RetirementPhaseId) {
  return PHASE_COLORS[phaseId];
}

/**
 * Get FI multiplier details
 */
export function getFIMultiplierDetails(multiplier: 25 | 30) {
  return FI_MULTIPLIER_OPTIONS.find((opt) => opt.value === multiplier);
}

/**
 * Get employer match label
 */
export function getEmployerMatchLabel(percent: number): string {
  const option = EMPLOYER_MATCH_OPTIONS.find((opt) => opt.value === percent);
  return option ? option.label : `${(percent * 100).toFixed(0)}%`;
}

/**
 * Validate if age is within allowed range for target retirement
 */
export function isValidRetirementAge(currentAge: number, targetAge: number): boolean {
  if (targetAge <= currentAge) return false;
  if (targetAge < PENSION_INPUT_RANGES.targetRetirementAge.min) return false;
  if (targetAge > PENSION_INPUT_RANGES.targetRetirementAge.max) return false;
  return true;
}

/**
 * Validate if lífeyrissjóður start age is valid
 */
export function isValidLifeyrissjodurAge(age: number): boolean {
  return (
    age >= PENSION_INPUT_RANGES.lifeyrissjodurStartAge.min &&
    age <= PENSION_INPUT_RANGES.lifeyrissjodurStartAge.max
  );
}

/**
 * Get typical pension scenario by name
 */
export function getTypicalScenario(scenarioName: keyof typeof TYPICAL_PENSION_SCENARIOS) {
  return TYPICAL_PENSION_SCENARIOS[scenarioName];
}

/**
 * Calculate how many years until séreign access
 */
export function yearsUntilSereignAccess(currentAge: number): number {
  return Math.max(0, ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - currentAge);
}

/**
 * Calculate how many years until lífeyrissjóður (standard age)
 */
export function yearsUntilLifeyrissjodur(currentAge: number): number {
  return Math.max(0, ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE - currentAge);
}

/**
 * Calculate how many years until TR (state pension)
 */
export function yearsUntilTR(currentAge: number): number {
  return Math.max(0, ICELANDIC_PENSION_SYSTEM.TR_START_AGE - currentAge);
}

/**
 * Format ISK amount for display
 * @param amount - Amount in ISK
 * @param includeDecimals - Whether to include decimals (default: false for millions)
 */
export function formatISK(amount: number, includeDecimals = false): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return includeDecimals
      ? `${millions.toFixed(1)}M kr`
      : `${Math.round(millions)}M kr`;
  }
  return `${Math.round(amount).toLocaleString('is-IS')} kr`;
}

/**
 * Get phase duration in years
 */
export function getPhaseDuration(startAge: number, endAge: number): number {
  return Math.max(0, endAge - startAge);
}

/**
 * Check if user will have a gap period (retiring before age 60)
 */
export function willHaveGapPeriod(retirementAge: number): boolean {
  return retirementAge < ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE;
}

/**
 * Check if user will have a séreign bridge period (retiring before age 67)
 */
export function willHaveSereignBridge(retirementAge: number): boolean {
  return (
    retirementAge < ICELANDIC_PENSION_SYSTEM.LIFEYRISSJODUR_STANDARD_AGE &&
    retirementAge < ICELANDIC_PENSION_SYSTEM.TR_START_AGE
  );
}

/**
 * Get number of retirement phases based on retirement age
 */
export function getNumberOfPhases(retirementAge: number): number {
  if (retirementAge >= ICELANDIC_PENSION_SYSTEM.TR_START_AGE) return 1;
  if (retirementAge >= ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE) return 2;
  return 3;
}
