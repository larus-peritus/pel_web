/**
 * Barista FIRE Planner constants
 *
 * Default values, presets, and Icelandic-specific configuration
 * for the Barista FIRE (semi-retirement) strategy calculator.
 *
 * Key Icelandic considerations:
 * - Universal healthcare (not tied to employment)
 * - Mandatory 16% pension contribution (12% employer + 4% employee)
 * - All income shown as NET after pension deduction
 * - Part-time work culture less common but growing
 */

import type { ExpenseTier } from '@/types/baristaFire';

/**
 * Icelandic pension contribution rates
 *
 * Mandatory lífeyrissjóður (pension fund) contributions in Iceland.
 * These rates apply to ALL income including part-time work.
 */
export const ICELANDIC_PENSION_RATES = {
  /** Total pension contribution rate (employer + employee) */
  TOTAL: 0.16, // 16%
  /** Employer contribution to pension fund */
  EMPLOYER: 0.12, // 12%
  /** Employee contribution to pension fund */
  EMPLOYEE: 0.04, // 4%
} as const;

/**
 * Net income multiplier after pension deduction
 *
 * Gross income × 0.84 = Net income (after 16% pension contribution)
 */
export const NET_INCOME_MULTIPLIER = 1 - ICELANDIC_PENSION_RATES.TOTAL; // 0.84

/**
 * Default values for Barista FIRE calculator
 *
 * Initial state when user first opens the calculator.
 */
export const BARISTA_FIRE_DEFAULTS = {
  /** Default investment return rate (5% real annual return) */
  INVESTMENT_RETURN_RATE: 0.05, // 5%
  /** Default FI multiplier (25x = 4% withdrawal rate) */
  FI_MULTIPLIER: 25,
  /** Default pension contribution rate */
  PENSION_CONTRIBUTION_RATE: ICELANDIC_PENSION_RATES.TOTAL,
  /** Default employer pension rate */
  EMPLOYER_PENSION_RATE: ICELANDIC_PENSION_RATES.EMPLOYER,
  /** Default employee pension rate */
  EMPLOYEE_PENSION_RATE: ICELANDIC_PENSION_RATES.EMPLOYEE,
  /** Standard full-time hours per week in Iceland */
  FULL_TIME_HOURS_PER_WEEK: 40,
  /** Default current savings (0 ISK - user must enter) */
  CURRENT_SAVINGS: 0,
  /** Default selected tier (null - user must select) */
  SELECTED_TIER: null as ExpenseTier | null,
  /** Default custom monthly expense (null - use tier if available) */
  CUSTOM_MONTHLY_EXPENSE: null as number | null,
  /** Default current age (null - optional) */
  CURRENT_AGE: null as number | null,
  /** Maximum number of scenarios */
  MAX_SCENARIOS: 5,
} as const;

/**
 * Part-time work hour presets
 *
 * Common part-time work arrangements in Iceland with Icelandic labels.
 */
export const PART_TIME_PRESETS = [
  {
    /** Icelandic name for this preset */
    name: '20 klst/viku',
    /** Icelandic description */
    description: 'Hálft starf',
    /** Work hours per week */
    hoursPerWeek: 20,
    /** Percentage of full-time (40 hours) */
    percentageOfFullTime: 0.5,
  },
  {
    name: '30 klst/viku',
    description: '75% starf',
    hoursPerWeek: 30,
    percentageOfFullTime: 0.75,
  },
  {
    name: 'Ráðgjöf/Freelance',
    description: 'Sveigjanleg vinna',
    hoursPerWeek: 25,
    percentageOfFullTime: 0.625,
  },
] as const;

/**
 * Work hour constraints for validation
 *
 * Reasonable limits for part-time work hours per week.
 */
export const WORK_HOUR_LIMITS = {
  /** Minimum hours per week (very part-time) */
  MIN: 1,
  /** Maximum hours per week (approaching full-time) */
  MAX: 40,
  /** Warning threshold - approaching full-time */
  WARNING_THRESHOLD: 35,
} as const;

/**
 * Hourly wage constraints for Icelandic context
 *
 * Realistic hourly wage ranges in Iceland (ISK per hour).
 */
export const HOURLY_WAGE_LIMITS = {
  /** Minimum hourly wage (below minimum wage - warning) */
  MIN: 500, // ~500 ISK/hour
  /** Maximum reasonable hourly wage (sanity check) */
  MAX: 50_000, // ~50,000 ISK/hour
  /** Iceland minimum wage (approximate, 2024) */
  MINIMUM_WAGE: 1_500, // ~1,500 ISK/hour
  /** Warning threshold for unrealistic wages */
  UNREALISTIC_THRESHOLD: 20_000, // ~20,000 ISK/hour
} as const;

/**
 * FI multiplier options for Barista FIRE calculations
 *
 * Standard multipliers for calculating FI number from annual expenses.
 * These align with the FI Number Builder but are included here for reference.
 */
export const FI_MULTIPLIER_OPTIONS = [
  {
    /** Multiplier value */
    multiplier: 25,
    /** Withdrawal rate (4%) */
    withdrawalRate: 0.04,
    /** Icelandic label */
    label: '25x',
    /** Icelandic description */
    description: '4,0% úttektarhlutfall (árásargjarn)',
    /** Recommended for Iceland? */
    recommendedForIceland: false,
  },
  {
    multiplier: 30,
    withdrawalRate: 0.0333,
    label: '30x',
    description: '3,33% úttektarhlutfall (mælt með)',
    recommendedForIceland: true, // Recommended due to higher inflation
  },
  {
    multiplier: 33,
    withdrawalRate: 0.0303,
    label: '33x',
    description: '3,0% úttektarhlutfall (íhaldssöm)',
    recommendedForIceland: true,
  },
] as const;

/**
 * Investment return rate constraints
 *
 * Realistic annual return rates for validation.
 */
export const RETURN_RATE_RANGE = {
  /** Minimum return rate (0% - no growth) */
  MIN: 0,
  /** Maximum return rate (15% - very aggressive) */
  MAX: 0.15,
  /** Warning threshold for unrealistic returns */
  WARNING_THRESHOLD: 0.1, // 10%
  /** Default recommended rate */
  DEFAULT: BARISTA_FIRE_DEFAULTS.INVESTMENT_RETURN_RATE,
} as const;

/**
 * Current age constraints for validation
 *
 * Reasonable age range for FIRE planning.
 */
export const AGE_RANGE = {
  /** Minimum age (young adult) */
  MIN: 18,
  /** Maximum age (approaching traditional retirement) */
  MAX: 100,
  /** Warning threshold - approaching pension age */
  PENSION_AGE: 67, // Iceland pension start age
} as const;

/**
 * Current savings constraints for validation
 *
 * Reasonable savings range for calculations.
 */
export const SAVINGS_RANGE = {
  /** Minimum savings (0 ISK) */
  MIN: 0,
  /** Maximum savings (100M ISK - sanity check) */
  MAX: 100_000_000, // 100 million ISK
} as const;

/**
 * Annual income constraints for validation
 *
 * Reasonable income range for part-time work in Iceland.
 */
export const ANNUAL_INCOME_RANGE = {
  /** Minimum annual income (very part-time) */
  MIN: 100_000, // ~100k ISK/year
  /** Maximum annual income (full-time+) */
  MAX: 30_000_000, // ~30M ISK/year
  /** Warning threshold for very low income */
  LOW_INCOME_THRESHOLD: 1_000_000, // ~1M ISK/year
} as const;

/**
 * Icelandic labels for expense tiers
 *
 * User-friendly Icelandic labels for expense baseline tiers.
 */
export const TIER_LABELS: Record<ExpenseTier, string> = {
  barebones: 'Lágmarksútgjöld',
  comfortable: 'Þægileg útgjöld',
  deluxe: 'Lúxusútgjöld',
};

/**
 * Icelandic tier descriptions
 *
 * Brief descriptions for each expense tier.
 */
export const TIER_DESCRIPTIONS: Record<ExpenseTier, string> = {
  barebones: 'Það lágmarki sem þarf til að lifa',
  comfortable: 'Gott líf með svigrúmi',
  deluxe: 'Hátt lífsgæði og lúxus',
};

/**
 * Timeline calculation defaults
 *
 * Constants for timeline projection calculations.
 */
export const TIMELINE_DEFAULTS = {
  /** Maximum projection period (months) */
  MAX_MONTHS: 600, // 50 years
  /** Minimum balance threshold (ISK) - treat as zero */
  MIN_BALANCE_THRESHOLD: 0.01,
  /** Months per year */
  MONTHS_PER_YEAR: 12,
} as const;

/**
 * Icelandic context messages
 *
 * Educational messages about Iceland-specific factors.
 */
export const ICELANDIC_CONTEXT = {
  /** Healthcare message */
  HEALTHCARE:
    'Sjúkratryggingar Íslands veita alhliða heilbrigðisþjónustu óháð atvinnu. Þú þarft ekki að hafa áhyggjur af sjúkratryggingu í hlutastarfi.',
  /** Pension contribution message */
  PENSION:
    'Lífeyrissjóðsframlög (16% af launum) halda áfram í hlutastarfi og byggja upp lífeyrisréttindi þín.',
  /** Part-time work culture message */
  WORK_CULTURE:
    'Hlutastarf er minna algengt á Íslandi en rekstur / ráðgjöf býður upp á meiri sveigjanleika.',
} as const;

/**
 * Scenario validation defaults
 *
 * Validation parameters for scenarios.
 */
export const SCENARIO_VALIDATION = {
  /** Maximum scenario name length */
  MAX_NAME_LENGTH: 100,
  /** Minimum scenario name length */
  MIN_NAME_LENGTH: 1,
  /** Default scenario name prefix */
  DEFAULT_NAME_PREFIX: 'Sviðsmynd',
} as const;

/**
 * Life energy calculation defaults
 *
 * Constants for life energy calculations when AWH is available.
 */
export const LIFE_ENERGY_DEFAULTS = {
  /** Hours per day */
  HOURS_PER_DAY: 24,
  /** Working days per week (standard) */
  WORKING_DAYS_PER_WEEK: 5,
  /** Weeks per year (accounting for vacation) */
  WORKING_WEEKS_PER_YEAR: 47, // 52 weeks - 5 weeks vacation (Iceland standard)
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate net income from gross income
 *
 * Applies 16% pension deduction to gross income.
 *
 * @param grossIncome - Gross annual income (ISK)
 * @returns Net annual income after pension deduction (ISK)
 */
export const calculateNetIncome = (grossIncome: number): number => {
  return grossIncome * NET_INCOME_MULTIPLIER;
};

/**
 * Calculate gross income from net income
 *
 * Reverses pension deduction to get gross income.
 *
 * @param netIncome - Net annual income (ISK)
 * @returns Gross annual income before pension deduction (ISK)
 */
export const calculateGrossIncome = (netIncome: number): number => {
  return netIncome / NET_INCOME_MULTIPLIER;
};

/**
 * Check if work hours are approaching full-time
 *
 * Returns true if hours per week exceed warning threshold.
 *
 * @param hoursPerWeek - Weekly work hours
 * @returns True if approaching full-time
 */
export const isApproachingFullTime = (hoursPerWeek: number): boolean => {
  return hoursPerWeek >= WORK_HOUR_LIMITS.WARNING_THRESHOLD;
};

/**
 * Check if hourly wage is unrealistic
 *
 * Returns true if wage exceeds threshold or is below minimum.
 *
 * @param hourlyWage - Hourly wage (ISK)
 * @returns True if wage is unrealistic
 */
export const isUnrealisticWage = (hourlyWage: number): boolean => {
  return (
    hourlyWage > HOURLY_WAGE_LIMITS.UNREALISTIC_THRESHOLD ||
    hourlyWage < HOURLY_WAGE_LIMITS.MINIMUM_WAGE
  );
};

/**
 * Check if investment return rate is unrealistic
 *
 * Returns true if return exceeds warning threshold.
 *
 * @param returnRate - Annual return rate (decimal)
 * @returns True if return is unrealistic
 */
export const isUnrealisticReturn = (returnRate: number): boolean => {
  return returnRate > RETURN_RATE_RANGE.WARNING_THRESHOLD;
};

/**
 * Check if age is approaching pension age
 *
 * Returns true if age is within 5 years of Iceland pension start (67).
 *
 * @param age - Current age
 * @returns True if approaching pension age
 */
export const isApproachingPensionAge = (age: number): boolean => {
  return age >= AGE_RANGE.PENSION_AGE - 5;
};

/**
 * Get preset by hours per week
 *
 * Finds a part-time preset matching the given hours.
 *
 * @param hoursPerWeek - Work hours per week
 * @returns Matching preset or undefined
 */
export const getPresetByHours = (hoursPerWeek: number) => {
  return PART_TIME_PRESETS.find((preset) => preset.hoursPerWeek === hoursPerWeek);
};

/**
 * Get FI multiplier option by value
 *
 * Finds a multiplier option matching the given value.
 *
 * @param multiplier - Multiplier value (25, 30, 33)
 * @returns Matching multiplier option or undefined
 */
export const getMultiplierOption = (multiplier: number) => {
  return FI_MULTIPLIER_OPTIONS.find((option) => option.multiplier === multiplier);
};

/**
 * Check if scenario count is at maximum
 *
 * Returns true if scenario count has reached max limit.
 *
 * @param scenarioCount - Current number of scenarios
 * @returns True if at maximum
 */
export const isAtMaxScenarios = (scenarioCount: number): boolean => {
  return scenarioCount >= BARISTA_FIRE_DEFAULTS.MAX_SCENARIOS;
};

/**
 * Validate current savings range
 *
 * Checks if savings are within valid range.
 *
 * @param savings - Current savings amount (ISK)
 * @returns True if valid
 */
export const isValidSavings = (savings: number): boolean => {
  return savings >= SAVINGS_RANGE.MIN && savings <= SAVINGS_RANGE.MAX;
};

/**
 * Validate annual income range
 *
 * Checks if annual income is within valid range.
 *
 * @param annualIncome - Annual income (ISK)
 * @returns True if valid
 */
export const isValidAnnualIncome = (annualIncome: number): boolean => {
  return annualIncome >= ANNUAL_INCOME_RANGE.MIN && annualIncome <= ANNUAL_INCOME_RANGE.MAX;
};

/**
 * Validate work hours range
 *
 * Checks if work hours are within valid range.
 *
 * @param hoursPerWeek - Weekly work hours
 * @returns True if valid
 */
export const isValidWorkHours = (hoursPerWeek: number): boolean => {
  return hoursPerWeek >= WORK_HOUR_LIMITS.MIN && hoursPerWeek <= WORK_HOUR_LIMITS.MAX;
};

/**
 * Validate investment return rate range
 *
 * Checks if return rate is within valid range.
 *
 * @param returnRate - Annual return rate (decimal)
 * @returns True if valid
 */
export const isValidReturnRate = (returnRate: number): boolean => {
  return returnRate >= RETURN_RATE_RANGE.MIN && returnRate <= RETURN_RATE_RANGE.MAX;
};

/**
 * Validate current age range
 *
 * Checks if age is within valid range.
 *
 * @param age - Current age
 * @returns True if valid
 */
export const isValidAge = (age: number): boolean => {
  return age >= AGE_RANGE.MIN && age <= AGE_RANGE.MAX;
};

/**
 * Generate default scenario name
 *
 * Creates a default name for a new scenario.
 *
 * @param index - Scenario index (1-based)
 * @returns Default scenario name in Icelandic
 */
export const generateDefaultScenarioName = (index: number): string => {
  return `${SCENARIO_VALIDATION.DEFAULT_NAME_PREFIX} ${index}`;
};
