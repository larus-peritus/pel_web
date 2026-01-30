/**
 * Retirement Date Simulator Constants
 *
 * Default values, thresholds, and Icelandic pension system constants
 * for the Retirement Date Simulator (Eftirlaunadagsetningarhermir).
 *
 * Key Icelandic considerations:
 * - Lífeyrissjóður (pension fund) starts at age 60
 * - Ellilífeyrir (state pension) starts at age 67
 * - Higher inflation environment (3-4% historical average)
 * - Life expectancy ~92 years for planning purposes
 */

import type {
  WithdrawalStrategy,
  SuccessRateThresholds,
  SuccessRateLevel,
} from '@/types/retirementSimulator';

/**
 * Default life expectancy for retirement planning
 *
 * Conservative estimate based on Icelandic life expectancy data.
 */
export const DEFAULT_LIFE_EXPECTANCY = 92;

/**
 * Life expectancy range constraints
 */
export const LIFE_EXPECTANCY_RANGE = {
  MIN: 80,
  MAX: 105,
} as const;

/**
 * Default expected real return (after inflation)
 *
 * Based on historical market returns. Conservative 7% for long-term planning.
 */
export const DEFAULT_EXPECTED_RETURN = 0.07; // 7%

/**
 * Expected return range for validation
 */
export const EXPECTED_RETURN_RANGE = {
  MIN: 0.0, // 0%
  MAX: 0.15, // 15%
  WARNING_THRESHOLD: 0.12, // Warn if > 12% (unrealistic)
} as const;

/**
 * Default inflation rate for Iceland
 *
 * Historical average is 3-4%, using 3% as conservative default.
 */
export const DEFAULT_INFLATION_RATE = 0.03; // 3%

/**
 * Inflation rate range
 */
export const INFLATION_RATE_RANGE = {
  MIN: 0.0, // 0%
  MAX: 0.1, // 10%
} as const;

/**
 * Default return volatility (standard deviation)
 *
 * Based on historical equity market volatility (~18% annual).
 */
export const DEFAULT_RETURN_VOLATILITY = 0.18; // 18%

/**
 * Return volatility range
 */
export const RETURN_VOLATILITY_RANGE = {
  MIN: 0.05, // 5% (very low volatility)
  MAX: 0.35, // 35% (very high volatility)
} as const;

/**
 * Default number of scenarios for Monte Carlo simulation
 *
 * 1,000 scenarios provide good balance of accuracy and speed (<2 seconds).
 */
export const DEFAULT_SCENARIO_COUNT = 1000;

/**
 * Scenario count options for user selection
 */
export const SCENARIO_COUNT_OPTIONS = [1000, 5000, 10000] as const;

/**
 * Target success rate for retirement planning
 *
 * 85% is a reasonable balance between confidence and resource efficiency.
 */
export const TARGET_SUCCESS_RATE = 0.85; // 85%

/**
 * Success rate thresholds for color coding and recommendations
 */
export const SUCCESS_RATE_THRESHOLDS: SuccessRateThresholds = {
  excellent: 0.9, // >= 90%
  good: 0.8, // >= 80%
  acceptable: 0.7, // >= 70%
  risky: 0.6, // >= 60%
  highRisk: 0.0, // < 60%
} as const;

/**
 * Success rate level labels (Icelandic)
 */
export const SUCCESS_RATE_LABELS: Record<SuccessRateLevel, string> = {
  excellent: 'Framúrskarandi',
  good: 'Gott',
  acceptable: 'Ásættanlegt',
  risky: 'Áhættusamt',
  highRisk: 'Háhætta',
} as const;

/**
 * Success rate color scheme for UI
 */
export const SUCCESS_RATE_COLORS: Record<
  SuccessRateLevel,
  { bg: string; text: string; border: string }
> = {
  excellent: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  good: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  acceptable: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  risky: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  highRisk: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
} as const;

/**
 * Icelandic pension system age milestones
 */
export const ICELANDIC_PENSION_DEFAULTS = {
  LIFEYRISSJODUR_AGE: 67, // Occupational pension (lífeyrissjóður) default start
  SEREIGN_AGE: 60, // Private pension (séreignarlífeyrir) available at 60
  ELLILIFEYRIR_AGE: 67, // State pension (TR) starts at 67
  TYPICAL_LIFEYRISSJODUR_MONTHLY: 150_000, // ISK (typical estimate)
  TYPICAL_SEREIGN_MONTHLY: 100_000, // ISK (typical private pension estimate)
  TYPICAL_ELLILIFEYRIR_MONTHLY: 200_000, // ISK (typical estimate)
} as const;

/**
 * Pension age range for validation
 */
export const PENSION_AGE_RANGE = {
  LIFEYRISSJODUR_MIN: 60,
  LIFEYRISSJODUR_MAX: 70,
  SEREIGN_MIN: 60, // Private pension available from 60
  SEREIGN_MAX: 75,
  ELLILIFEYRIR_MIN: 67,
  ELLILIFEYRIR_MAX: 75,
} as const;

/**
 * Pension amount range for validation (ISK)
 */
export const PENSION_AMOUNT_RANGE = {
  MIN: 0,
  MAX: 1_000_000, // 1 million ISK/month
} as const;

/**
 * Withdrawal strategy defaults
 */
export const WITHDRAWAL_STRATEGY_PRESETS = {
  FOUR_PERCENT: {
    type: '4percent' as const,
    rate: 0.04,
    inflationAdjusted: true,
    label: '4% reglan',
    description: 'Fasta 4% úttekt af upphafslegri safnstöðu (verðtryggð)',
  },
  VARIABLE: {
    type: 'variable' as const,
    percentageOfPortfolio: 0.04,
    label: 'Breytileg útgjöld',
    description: 'Aðlaga úttektir eftir núverandi stöðu safns',
  },
  GUARDRAILS: {
    type: 'guardrails' as const,
    baseWithdrawal: 0,
    upperGuardrail: 1.3, // 130% triggers spending increase
    lowerGuardrail: 0.8, // 80% triggers spending decrease
    adjustmentPercent: 0.1, // 10% adjustment
    label: 'Girðingar',
    description: 'Auka/minnka útgjöld þegar safn fer yfir/undir viðmiðunarmörk',
  },
} as const;

/**
 * Default 4% rule withdrawal strategy
 */
export const DEFAULT_WITHDRAWAL_STRATEGY: WithdrawalStrategy = {
  type: '4percent',
  rate: 0.04,
  inflationAdjusted: true,
};

/**
 * Portfolio balance range for validation (ISK)
 */
export const PORTFOLIO_BALANCE_RANGE = {
  MIN: 0,
  MAX: 1_000_000_000, // 1 billion ISK
} as const;

/**
 * Monthly savings range for validation (ISK)
 */
export const MONTHLY_SAVINGS_RANGE = {
  MIN: 0,
  MAX: 10_000_000, // 10 million ISK/month
} as const;

/**
 * Monthly expenses range for validation (ISK)
 */
export const MONTHLY_EXPENSES_RANGE = {
  MIN: 0,
  MAX: 10_000_000, // 10 million ISK/month
} as const;

/**
 * Retirement age range for validation
 */
export const RETIREMENT_AGE_RANGE = {
  MIN: 40, // Early retirement
  MAX: 80, // Late retirement
} as const;

/**
 * Current age range for validation
 */
export const CURRENT_AGE_RANGE = {
  MIN: 18,
  MAX: 100,
} as const;

/**
 * Retirement adjustment factor range
 *
 * Multiplier for expenses in retirement (e.g., 0.8 = 80% of working expenses)
 */
export const RETIREMENT_ADJUSTMENT_RANGE = {
  MIN: 0.5, // 50% of working expenses
  MAX: 1.5, // 150% of working expenses
} as const;

/**
 * Default simulation assumptions
 */
export const DEFAULT_SIMULATION_ASSUMPTIONS = {
  scenarioCount: DEFAULT_SCENARIO_COUNT,
  simulationType: 'monteCarlo' as const,
  returnDistribution: 'lognormal' as const,
  sequenceRiskEnabled: true,
} as const;

/**
 * Maximum projection months (safety limit)
 *
 * Prevents infinite loops in calculations (600 months = 50 years)
 */
export const MAX_PROJECTION_MONTHS = 600;

/**
 * Minimum portfolio balance threshold (ISK)
 *
 * Below this is considered depleted (accounts for rounding errors)
 */
export const MIN_BALANCE_THRESHOLD = 0.01;

/**
 * Close call threshold for recommendations
 *
 * If difference between scenarios is < 5%, it's a "close call"
 */
export const CLOSE_CALL_THRESHOLD = 0.05; // 5%

/**
 * Historical return data for Iceland/global markets
 *
 * Used for reference and validation
 */
export const RETURN_RATE_ASSUMPTIONS = {
  ICELAND_EQUITY: {
    realReturn: 0.065, // 6.5%
    volatility: 0.22, // 22%
    label: 'Íslenskir hlutabréfavísitölur',
  },
  GLOBAL_EQUITY: {
    realReturn: 0.07, // 7%
    volatility: 0.18, // 18%
    label: 'Alþjóðlegir hlutabréfamarkaðir',
  },
  BALANCED: {
    realReturn: 0.055, // 5.5%
    volatility: 0.12, // 12%
    label: 'Blandað safn (60/40)',
  },
  CONSERVATIVE: {
    realReturn: 0.04, // 4%
    volatility: 0.08, // 8%
    label: 'Íhaldssamt safn',
  },
} as const;

/**
 * Performance targets for simulation
 */
export const PERFORMANCE_TARGETS = {
  SCENARIOS_1000_MS: 2000, // 1,000 scenarios in < 2 seconds
  SCENARIOS_5000_MS: 5000, // 5,000 scenarios in < 5 seconds
  CHART_RENDER_MS: 500, // Chart renders in < 500ms
  UI_UPDATE_MS: 100, // UI updates in < 100ms
} as const;

/**
 * Buffer calculation target success rate
 *
 * When calculating "years of buffer", target this success rate
 */
export const BUFFER_TARGET_SUCCESS_RATE = 0.8; // 80%

/**
 * Sensitivity analysis parameters
 */
export const SENSITIVITY_ANALYSIS = {
  RETURN_DELTA: 0.01, // +/- 1% return
  INFLATION_DELTA: 0.005, // +/- 0.5% inflation
  LIFE_EXPECTANCY_DELTA: 5, // +/- 5 years
} as const;

/**
 * Age limits for various calculations
 */
export const AGE_LIMITS = {
  MIN_CURRENT_AGE: 18,
  MAX_CURRENT_AGE: 100,
  MIN_RETIREMENT_AGE: 40,
  MAX_RETIREMENT_AGE: 80,
  MIN_LIFE_EXPECTANCY: 80,
  MAX_LIFE_EXPECTANCY: 105,
  TYPICAL_RETIREMENT_AGE: 67, // Standard in Iceland
} as const;

/**
 * Helper: Get success rate level based on percentage
 */
export const getSuccessRateLevel = (successRate: number): SuccessRateLevel => {
  if (successRate >= SUCCESS_RATE_THRESHOLDS.excellent) return 'excellent';
  if (successRate >= SUCCESS_RATE_THRESHOLDS.good) return 'good';
  if (successRate >= SUCCESS_RATE_THRESHOLDS.acceptable) return 'acceptable';
  if (successRate >= SUCCESS_RATE_THRESHOLDS.risky) return 'risky';
  return 'highRisk';
};

/**
 * Helper: Check if expected return is unrealistic
 */
export const isExpectedReturnUnrealistic = (returnRate: number): boolean => {
  return returnRate > EXPECTED_RETURN_RANGE.WARNING_THRESHOLD;
};

/**
 * Helper: Check if retirement age is before pension eligibility
 */
export const isEarlyRetirement = (retirementAge: number): boolean => {
  return retirementAge < ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE;
};

/**
 * Helper: Calculate years until pension eligibility
 */
export const getYearsToPension = (
  retirementAge: number,
  pensionAge: number = ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE,
): number => {
  return Math.max(0, pensionAge - retirementAge);
};

/**
 * Helper: Validate portfolio balance
 */
export const isValidPortfolioBalance = (balance: number): boolean => {
  return balance >= PORTFOLIO_BALANCE_RANGE.MIN && balance <= PORTFOLIO_BALANCE_RANGE.MAX;
};

/**
 * Helper: Validate monthly savings
 */
export const isValidMonthlySavings = (savings: number): boolean => {
  return savings >= MONTHLY_SAVINGS_RANGE.MIN && savings <= MONTHLY_SAVINGS_RANGE.MAX;
};

/**
 * Helper: Validate monthly expenses
 */
export const isValidMonthlyExpenses = (expenses: number): boolean => {
  return expenses >= MONTHLY_EXPENSES_RANGE.MIN && expenses <= MONTHLY_EXPENSES_RANGE.MAX;
};

/**
 * Helper: Validate retirement age
 */
export const isValidRetirementAge = (age: number): boolean => {
  return age >= RETIREMENT_AGE_RANGE.MIN && age <= RETIREMENT_AGE_RANGE.MAX;
};

/**
 * Helper: Validate current age
 */
export const isValidCurrentAge = (age: number): boolean => {
  return age >= CURRENT_AGE_RANGE.MIN && age <= CURRENT_AGE_RANGE.MAX;
};

/**
 * Helper: Validate life expectancy
 */
export const isValidLifeExpectancy = (age: number, retirementAge: number): boolean => {
  return (
    age >= LIFE_EXPECTANCY_RANGE.MIN &&
    age <= LIFE_EXPECTANCY_RANGE.MAX &&
    age > retirementAge
  );
};

/**
 * Helper: Validate expected return
 */
export const isValidExpectedReturn = (returnRate: number): boolean => {
  return returnRate >= EXPECTED_RETURN_RANGE.MIN && returnRate <= EXPECTED_RETURN_RANGE.MAX;
};

/**
 * Helper: Validate inflation rate
 */
export const isValidInflationRate = (inflationRate: number): boolean => {
  return inflationRate >= INFLATION_RATE_RANGE.MIN && inflationRate <= INFLATION_RATE_RANGE.MAX;
};

/**
 * Helper: Validate return volatility
 */
export const isValidReturnVolatility = (volatility: number): boolean => {
  return (
    volatility >= RETURN_VOLATILITY_RANGE.MIN && volatility <= RETURN_VOLATILITY_RANGE.MAX
  );
};

/**
 * Helper: Validate pension age for lífeyrissjóður
 */
export const isValidLifeyrissjodurAge = (age: number): boolean => {
  return age >= PENSION_AGE_RANGE.LIFEYRISSJODUR_MIN && age <= PENSION_AGE_RANGE.LIFEYRISSJODUR_MAX;
};

/**
 * Helper: Validate pension age for séreignarlífeyrir
 */
export const isValidSereignAge = (age: number): boolean => {
  return age >= PENSION_AGE_RANGE.SEREIGN_MIN && age <= PENSION_AGE_RANGE.SEREIGN_MAX;
};

/**
 * Helper: Validate pension age for ellilífeyrir
 */
export const isValidEllilifeyririAge = (age: number): boolean => {
  return age >= PENSION_AGE_RANGE.ELLILIFEYRIR_MIN && age <= PENSION_AGE_RANGE.ELLILIFEYRIR_MAX;
};

/**
 * Helper: Validate pension amount
 */
export const isValidPensionAmount = (amount: number): boolean => {
  return amount >= PENSION_AMOUNT_RANGE.MIN && amount <= PENSION_AMOUNT_RANGE.MAX;
};
