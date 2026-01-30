/**
 * FI Number Builder constants
 *
 * Standard multipliers, default values, and Icelandic context configuration
 * for the Financial Independence (FI) number calculator.
 *
 * Key Icelandic considerations:
 * - Higher inflation history (3-4% vs US 2-3%)
 * - Lífeyrissjóður (pension) starts at age 67
 * - Recommended 30x-33x multiplier (more conservative than US 25x)
 */

import type { StandardMultiplier } from '@/types/fiNumber';

/**
 * Standard FI multipliers based on withdrawal rates
 *
 * - 25x = 4.0% withdrawal (US standard, aggressive for Iceland)
 * - 30x = 3.33% withdrawal (recommended for Iceland)
 * - 33x = 3.0% withdrawal (conservative)
 */
export const STANDARD_MULTIPLIERS: readonly StandardMultiplier[] = [25, 30, 33] as const;

/**
 * Default multiplier recommended for Iceland
 *
 * 30x (3.33% withdrawal rate) is more conservative than the US standard 25x (4% rule)
 * to account for Iceland's historically higher inflation.
 */
export const DEFAULT_MULTIPLIER: StandardMultiplier = 30;

/**
 * Multiplier range for custom values
 */
export const MULTIPLIER_RANGE = {
  MIN: 20, // Very aggressive
  MAX: 50, // Very conservative
} as const;

/**
 * Iceland Three-Pillar Pension System Ages
 *
 * Pillar I:   Tryggingastofnun (TR) - state pension, means-tested
 * Pillar II:  Lífeyrissjóður - mandatory occupational pension (15.5% of salary)
 * Pillar III: Séreign - voluntary private pension (2-4% + employer match)
 */
export const ICELAND_PENSION_AGES = {
  /** Séreign (private pension) accessible from age 60 */
  SEREIGN_ACCESS_AGE: 60,
  /** Occupational pension can start early at 60 (with reduced payout) */
  OCCUPATIONAL_EARLY_AGE: 60,
  /** Standard retirement age for full occupational pension */
  OCCUPATIONAL_STANDARD_AGE: 67,
  /** TR (state pension) standard start age */
  TR_STANDARD_AGE: 67,
  /** TR can start early at 65 with conditions */
  TR_EARLY_AGE: 65,
} as const;

/**
 * Tryggingastofnun (TR) State Pension Means-Testing Constants
 *
 * The TR pension is means-tested based on other income.
 * Source: https://island.is/s/tryggingastofnun/ellilifeyrir
 *
 * IMPORTANT NOTES:
 * - These are estimates based on published TR rules
 * - Actual amounts change annually with fjárlög (state budget)
 * - For accurate calculations, use TR's official calculator
 * - Séreign withdrawals treatment is complex - consult TR directly
 *
 * Last updated: January 2025 (based on 2024/2025 published rates)
 */
export const TR_MEANS_TEST = {
  /** Full monthly ellilífeyrir (ISK) - requires 40 years residency */
  ELLILIFEYRIR_FULL: 365_592,
  /** Half monthly ellilífeyrir (ISK) */
  ELLILIFEYRIR_HALF: 182_796,
  /** Heimilisuppbót for those living alone (ISK/month) */
  HEIMILISUPPBOT_FULL: 92_384,
  /** Maximum monthly TR pension for single person - ESTIMATE for backwards compatibility */
  MAX_MONTHLY_SINGLE: 365_592,
  /** Maximum monthly TR pension for couple (per person) - ESTIMATE */
  MAX_MONTHLY_COUPLE: 320_000,
  /** Other income exemption (lífeyrissjóður, etc.) (ISK/month) */
  INCOME_EXEMPTION: 36_500,
  /** Wage income exemption (ISK/month) - up to 200k wages don't reduce ellilífeyrir */
  WAGE_EXEMPTION: 200_000,
  /** Capital income exemption - NO EXEMPTION for ellilífeyrir */
  CAPITAL_INCOME_EXEMPTION: 0,
  /** Reduction rate for ellilífeyrir (45% of income above exemption) */
  REDUCTION_RATE: 0.45,
  /** Reduction rate for heimilisuppbót (11.9% of all income) */
  HEIMILISUPPBOT_REDUCTION_RATE: 0.119,
  /** Income level at which ellilífeyrir becomes zero (approx) */
  ZERO_BENEFIT_INCOME: 850_000, // Approximate: (365,592 / 0.45) + 36,500
  /** Link to official TR calculator */
  OFFICIAL_CALCULATOR_URL: 'https://island.is/s/tryggingastofnun/reiknivel',
  /** Link to official TR information */
  OFFICIAL_INFO_URL: 'https://island.is/s/tryggingastofnun/ellilifeyrir',
} as const;

/**
 * Mandatory Occupational Pension (Lífeyrissjóður) Constants
 */
export const OCCUPATIONAL_PENSION = {
  /** Total contribution rate (employer + employee) */
  TOTAL_CONTRIBUTION_RATE: 0.155, // 15.5%
  /** Employer contribution */
  EMPLOYER_CONTRIBUTION: 0.115, // 11.5%
  /** Employee contribution */
  EMPLOYEE_CONTRIBUTION: 0.04, // 4%
  /** Target replacement rate after 40 years (56% of average salary) */
  TARGET_REPLACEMENT_RATE: 0.56,
  /** Years of contribution for full benefits */
  FULL_BENEFIT_YEARS: 40,
} as const;

/**
 * Voluntary Private Pension (Séreign) Constants
 */
export const SEREIGN_PENSION = {
  /** Common voluntary contribution rate */
  TYPICAL_CONTRIBUTION_RATE: 0.04, // 4%
  /** Typical employer match */
  TYPICAL_EMPLOYER_MATCH: 0.02, // 2%
  /** Access age */
  ACCESS_AGE: 60,
  /** Key benefit: Does NOT reduce TR pension */
  COUNTS_AGAINST_TR: false,
} as const;

/**
 * Icelandic pension start age (legacy - use ICELAND_PENSION_AGES instead)
 */
export const PENSION_START_AGE = 67;

/**
 * Retirement age constraints
 */
export const RETIREMENT_AGE_RANGE = {
  MIN: 40, // Early retirement
  MAX: 80, // Late retirement
} as const;

/**
 * Multiplier warning threshold
 *
 * Show warning if multiplier is below this value due to Iceland's higher inflation risk.
 */
export const MULTIPLIER_WARNING_THRESHOLD = 28;

/**
 * Expense input constraints
 */
export const EXPENSE_RANGE = {
  MIN: 0, // Minimum monthly expenses (ISK)
  MAX: 10_000_000, // Maximum monthly expenses (ISK) - sanity check
} as const;

/**
 * Pension income constraints
 */
export const PENSION_INCOME_RANGE = {
  MIN: 0, // No pension
  MAX: 1_000_000, // Maximum monthly pension (ISK)
} as const;

/**
 * Multiplier labels (Icelandic)
 *
 * User-friendly labels for each standard multiplier option.
 */
export const MULTIPLIER_LABELS: Record<StandardMultiplier, string> = {
  25: '25x',
  30: '30x',
  33: '33x',
};

/**
 * Multiplier descriptions (Icelandic)
 *
 * Explains the withdrawal rate for each multiplier.
 */
export const MULTIPLIER_DESCRIPTIONS: Record<StandardMultiplier, string> = {
  25: '4,0% úttektarhlutfall (árásargjarn)',
  30: '3,33% úttektarhlutfall (mælt með)',
  33: '3,0% úttektarhlutfall (íhaldssöm)',
};

/**
 * Multiplier withdrawal rates
 *
 * Actual percentage for each multiplier (1 / multiplier).
 */
export const MULTIPLIER_WITHDRAWAL_RATES: Record<StandardMultiplier, number> = {
  25: 0.04, // 4.0%
  30: 0.0333, // 3.33%
  33: 0.0303, // 3.03%
};

/**
 * Default FI number builder values
 *
 * Initial state when user first opens the calculator.
 */
export const FI_NUMBER_DEFAULTS = {
  EXPENSE_SOURCE: 'baseline' as const, // Prefer baseline if available
  MULTIPLIER: DEFAULT_MULTIPLIER, // 30x recommended for Iceland
  CUSTOM_MULTIPLIER: null, // No custom multiplier initially
  PENSION_MONTHLY_INCOME: null, // No pension configured initially
  TARGET_RETIREMENT_AGE: null, // No retirement age set initially
  CUSTOM_MONTHLY_EXPENSE: null, // No custom expense initially
  // Three-phase planning (Iceland)
  OCCUPATIONAL_PENSION: null, // No occupational pension estimate initially
  SEREIGN_BALANCE: null, // No séreign balance initially
} as const;

/**
 * Icelandic context warnings
 *
 * Educational messages about Iceland-specific factors.
 */
export const ICELANDIC_WARNINGS = {
  LOW_MULTIPLIER:
    'Vegna hærri verðbólgu á Íslandi mælum við með 30x eða 33x margfaldara fyrir öruggari FI.',
  HIGH_PENSION:
    'Lífeyrir þinn dekur öll eða fleiri útgjöld þín - þú þarft ekki FI töluna!',
  EARLY_RETIREMENT:
    'Þú þarft brúarupphæð til að ná frá {age} til {pensionAge} ára.',
} as const;

/**
 * Default values for calculations
 */
export const CALCULATION_DEFAULTS = {
  MONTHS_PER_YEAR: 12,
  PENSION_START_AGE,
  DEFAULT_RETIREMENT_AGE: 67,
} as const;

/**
 * Helper: Get withdrawal rate from multiplier
 */
export const getWithdrawalRate = (multiplier: number): number => {
  return 1 / multiplier;
};

/**
 * Helper: Get multiplier from withdrawal rate
 */
export const getMultiplierFromWithdrawalRate = (withdrawalRate: number): number => {
  return 1 / withdrawalRate;
};

/**
 * Helper: Check if multiplier is standard
 */
export const isStandardMultiplier = (multiplier: number): multiplier is StandardMultiplier => {
  return STANDARD_MULTIPLIERS.includes(multiplier as StandardMultiplier);
};

/**
 * Helper: Check if multiplier needs warning
 */
export const needsMultiplierWarning = (multiplier: number): boolean => {
  return multiplier < MULTIPLIER_WARNING_THRESHOLD;
};

/**
 * Helper: Validate multiplier range
 */
export const isValidMultiplier = (multiplier: number): boolean => {
  return multiplier >= MULTIPLIER_RANGE.MIN && multiplier <= MULTIPLIER_RANGE.MAX;
};

/**
 * Helper: Validate retirement age range
 */
export const isValidRetirementAge = (age: number): boolean => {
  return age >= RETIREMENT_AGE_RANGE.MIN && age <= RETIREMENT_AGE_RANGE.MAX;
};

/**
 * Helper: Validate monthly expenses
 */
export const isValidMonthlyExpense = (expense: number): boolean => {
  return expense > EXPENSE_RANGE.MIN && expense <= EXPENSE_RANGE.MAX;
};

/**
 * Helper: Validate pension income
 */
export const isValidPensionIncome = (income: number): boolean => {
  return income >= PENSION_INCOME_RANGE.MIN && income <= PENSION_INCOME_RANGE.MAX;
};
