/**
 * Coast FIRE Calculator constants and defaults
 *
 * Default values, scenario configurations, and Icelandic-specific settings
 * for the Coast FIRE (Ró FIRE) Calculator.
 *
 * Coast FIRE: When your current investments will grow to meet your FI number
 * without additional contributions, allowing you to "coast" to financial independence.
 *
 * Key Icelandic considerations:
 * - Standard retirement age: 67 (lífeyrissjóður)
 * - Conservative return assumptions for real (inflation-adjusted) returns
 * - Educational focus on long-term compound growth
 */

import type { ScenarioType } from '../../types/coastFire';

/**
 * Default ages for Coast FIRE calculator
 */
export const COAST_FIRE_AGES = {
  DEFAULT_CURRENT_AGE: 30, // Starting age placeholder
  DEFAULT_RETIREMENT_AGE: 67, // Icelandic retirement age
  MIN_AGE: 18, // Minimum valid age
  MAX_AGE: 100, // Maximum valid age
  MIN_RETIREMENT_OFFSET: 1, // Retirement must be at least 1 year after current age
} as const;

/**
 * Return rate scenarios for Coast FIRE projections
 *
 * These are REAL returns (after inflation), not nominal returns.
 * Based on historical long-term averages for diversified portfolios.
 */
export const RETURN_RATE_SCENARIOS = {
  conservative: 4, // 4% real return (bonds + some stocks)
  moderate: 6, // 6% real return (balanced portfolio) - default
  optimistic: 8, // 8% real return (stock-heavy portfolio)
} as const;

/**
 * Default expected return rate (percentage)
 *
 * 6% real return is historically reasonable for a balanced portfolio.
 */
export const DEFAULT_RETURN_RATE = RETURN_RATE_SCENARIOS.moderate;

/**
 * Return rate constraints
 */
export const RETURN_RATE_RANGE = {
  MIN: -10, // Allow negative for extreme scenarios
  MAX: 15, // Maximum allowed return
  WARNING_LOW: 3, // Warn if below 3%
  WARNING_HIGH: 10, // Warn if above 10%
} as const;

/**
 * Scenario labels in Icelandic
 *
 * User-friendly names for each return rate scenario.
 */
export const SCENARIO_LABELS: Record<ScenarioType, string> = {
  conservative: 'Íhaldssöm',
  moderate: 'Miðlungs',
  optimistic: 'Bjartsýn',
};

/**
 * Scenario descriptions in Icelandic
 *
 * Explains what each scenario represents.
 */
export const SCENARIO_DESCRIPTIONS: Record<ScenarioType, string> = {
  conservative: 'Íhaldssöm (4% raunávöxtun) - Skuldabréf og sumum hlutabréfum',
  moderate: 'Miðlungs (6% raunávöxtun) - Jafnvægi milli skuldabréfa og hlutabréfa',
  optimistic: 'Bjartsýn (8% raunávöxtun) - Hlutabréfamiðað',
};

/**
 * FI multiplier defaults
 *
 * Used when calculating FI number from expense baseline.
 */
export const FI_MULTIPLIER_DEFAULTS = {
  DEFAULT: 30, // 3.33% withdrawal (recommended for Iceland due to higher inflation)
  AGGRESSIVE: 25, // 4% withdrawal rule (US standard, riskier in Iceland)
  CONSERVATIVE: 33, // 3.0% withdrawal (very safe)
  MIN: 20, // Minimum allowed
  MAX: 40, // Maximum allowed
} as const;

/**
 * Investment amount constraints
 */
export const INVESTMENT_RANGE = {
  MIN: 0, // Can start with zero investments
  MAX: 10_000_000_000, // 10 billion ISK (sanity check)
} as const;

/**
 * FI number constraints
 */
export const FI_NUMBER_RANGE = {
  MIN: 1, // Must be positive
  MAX: 10_000_000_000, // 10 billion ISK (sanity check)
} as const;

/**
 * Age limit validation ranges
 */
export const AGE_LIMITS = {
  current: {
    min: COAST_FIRE_AGES.MIN_AGE,
    max: COAST_FIRE_AGES.MAX_AGE,
  },
  retirement: {
    min: COAST_FIRE_AGES.MIN_AGE + COAST_FIRE_AGES.MIN_RETIREMENT_OFFSET,
    max: COAST_FIRE_AGES.MAX_AGE,
  },
} as const;

/**
 * Coast FIRE default input values
 *
 * Initial state when user first opens the calculator.
 */
export const COAST_FIRE_DEFAULTS = {
  currentAge: COAST_FIRE_AGES.DEFAULT_CURRENT_AGE,
  currentInvestments: 0,
  targetRetirementAge: COAST_FIRE_AGES.DEFAULT_RETIREMENT_AGE,
  expectedReturn: DEFAULT_RETURN_RATE,
  fiNumber: null,
  fiNumberSource: 'manual' as const,
  selectedTier: null,
  fiMultiplier: FI_MULTIPLIER_DEFAULTS.DEFAULT,
  birthDate: undefined,
} as const;

/**
 * Calculation constants
 */
export const CALCULATION_CONSTANTS = {
  COMPOUNDING_FREQUENCY: 'annual' as const, // Default to annual compounding
  WORK_HOURS_PER_YEAR: 2080, // Standard work hours (40h/week * 52 weeks)
  MAX_PROJECTION_YEARS: 100, // Don't project beyond 100 years (effectively impossible)
  CLOSE_CALL_THRESHOLD: 0.05, // 5% - scenarios within 5% are "close calls"
} as const;

/**
 * Action suggestion templates (Icelandic)
 *
 * Templates for suggestions when Coast FIRE is impossible.
 * Use {placeholders} for dynamic values.
 */
export const ACTION_SUGGESTIONS = {
  delayRetirement: {
    title: 'Fresta eftirlaunum',
    descriptionTemplate:
      'Við að fresta til {targetAge} ára aldurs næðirðu Ró FIRE.',
    calculationTemplate: '{years} ár viðbótar',
    feasibilityThreshold: {
      easy: 2, // < 2 years = easy
      moderate: 5, // < 5 years = moderate
      // > 5 years = difficult
    },
  },
  reduceFI: {
    title: 'Minnka FI Tölu',
    descriptionTemplate: 'Lækka markmið í {achievableFI} kr',
    calculationTemplate: '{difference} kr minna',
    feasibilityThreshold: {
      easy: 0.9, // If achievable FI is 90%+ of target = easy
      moderate: 0.7, // If achievable FI is 70%+ of target = moderate
      // < 70% = difficult
    },
  },
  increaseReturn: {
    title: 'Auka ávöxtun (áhætta)',
    descriptionTemplate: 'Þú þarft {requiredReturn}% ávöxtun',
    calculationTemplate: '{difference}% hærri',
    warningThreshold: 10, // Warn if required return > 10%
    feasibilityThreshold: {
      moderate: 10, // < 10% required = moderate
      // > 10% = difficult
    },
  },
  continueSaving: {
    title: 'Halda áfram að spara',
    descriptionTemplate: 'Leggja til {monthlySavings} kr/mánuð',
    calculationTemplate: 'Ná FI við {targetAge} ára aldur',
    feasibility: 'moderate' as const, // Always moderate difficulty
  },
} as const;

/**
 * Chart visualization defaults
 */
export const CHART_DEFAULTS = {
  HEIGHT: 400, // Chart height in pixels
  MOBILE_HEIGHT: 300, // Chart height on mobile
  MAX_DATA_POINTS: 100, // Limit data points for performance
  SAMPLE_INTERVAL: 1, // Sample every N years if timeline is long
} as const;

/**
 * Status colors (Tailwind classes)
 *
 * Color scheme for Coast FIRE status indicators.
 */
export const STATUS_COLORS = {
  coasting: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-500',
  },
  future: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-800',
    accent: 'bg-blue-500',
  },
  impossible: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
} as const;

/**
 * Chart color scheme
 */
export const CHART_COLORS = {
  projectedGrowth: '#10b981', // Green - main projection line
  fiNumberLine: '#3b82f6', // Blue - FI number target line
  currentBalance: '#6b7280', // Gray - current balance marker
  coastingArea: '#fef3c7', // Light amber - coasting period fill
  coastMilestone: '#f59e0b', // Amber - Coast FIRE milestone marker
  targetMilestone: '#8b5cf6', // Purple - target retirement marker
  scenarios: {
    conservative: '#ef4444', // Red
    moderate: '#3b82f6', // Blue
    optimistic: '#10b981', // Green
  },
} as const;

/**
 * Educational content keys
 *
 * Keys for educational tooltips and help text.
 */
export const EDUCATION_KEYS = {
  WHAT_IS_COAST_FIRE: 'whatIsCoastFire',
  RETURN_RATE_GUIDANCE: 'returnRateGuidance',
  MULTIPLIER_EXPLANATION: 'multiplierExplanation',
  REAL_VS_NOMINAL: 'realVsNominal',
  COMPOUND_GROWTH: 'compoundGrowth',
  IMPOSSIBLE_SCENARIOS: 'impossibleScenarios',
} as const;

/**
 * Validation error messages (Icelandic)
 */
export const VALIDATION_ERRORS = {
  CURRENT_AGE_TOO_LOW: `Aldur verður að vera að minnsta kosti ${AGE_LIMITS.current.min} ára`,
  CURRENT_AGE_TOO_HIGH: `Aldur verður að vera í mesta lagi ${AGE_LIMITS.current.max} ára`,
  RETIREMENT_AGE_TOO_LOW: 'Eftirlaunaaldur verður að vera hærri en núverandi aldur',
  RETIREMENT_AGE_TOO_HIGH: `Eftirlaunaaldur verður að vera í mesta lagi ${AGE_LIMITS.retirement.max} ára`,
  INVESTMENTS_NEGATIVE: 'Fjárfestingar geta ekki verið neikvæðar',
  INVESTMENTS_TOO_HIGH: 'Fjárfestingarupphæð virðist óraunhæf',
  FI_NUMBER_MISSING: 'FI Tala er nauðsynleg',
  FI_NUMBER_TOO_LOW: 'FI Tala verður að vera jákvæð',
  FI_NUMBER_TOO_HIGH: 'FI Tala virðist óraunhæf',
  RETURN_RATE_TOO_LOW: `Ávöxtunarkrafa verður að vera að minnsta kosti ${RETURN_RATE_RANGE.MIN}%`,
  RETURN_RATE_TOO_HIGH: `Ávöxtunarkrafa verður að vera í mesta lagi ${RETURN_RATE_RANGE.MAX}%`,
  MULTIPLIER_TOO_LOW: `Margfaldari verður að vera að minnsta kosti ${FI_MULTIPLIER_DEFAULTS.MIN}x`,
  MULTIPLIER_TOO_HIGH: `Margfaldari verður að vera í mesta lagi ${FI_MULTIPLIER_DEFAULTS.MAX}x`,
} as const;

/**
 * Validation warning messages (Icelandic)
 */
export const VALIDATION_WARNINGS = {
  ZERO_INVESTMENTS:
    'Með 0 kr í fjárfestingum muntu aldrei ná Ró FIRE án þess að leggja til',
  LOW_RETURN_RATE: 'Ávöxtunarkrafa undir 3% er mjög íhaldssöm',
  HIGH_RETURN_RATE: 'Ávöxtunarkrafa yfir 10% er mjög bjartsýn og áhættusöm',
  NEGATIVE_RETURN: 'Með neikvæða ávöxtun muntu ekki ná Ró FIRE',
  ZERO_RETURN: 'Með 0% ávöxtun muntu ekki ná Ró FIRE',
  LONG_TIMELINE: 'Spár lengri en 40 ár eru mjög óvissar',
  OLD_RETIREMENT: 'Eftirlaunaaldur yfir 75 ára er óvenjulegur',
  LOW_MULTIPLIER: 'Margfaldari undir 25x er mjög árásargjarn (4%+ úttekt)',
} as const;

/**
 * Status messages (Icelandic)
 *
 * User-facing messages for each Coast FIRE status.
 */
export const STATUS_MESSAGES = {
  coasting: {
    title: 'Til hamingju! Þú ert nú þegar í Ró FIRE! 🎉',
    shortMessage: 'Þú ert í Ró FIRE',
    descriptionTemplate:
      'Núverandi fjárfestingar þínar ({currentBalance} kr) munu vaxa í {projectedBalance} kr við {targetAge} ára aldur, sem er umfram FI Tölu þína ({fiNumber} kr).',
  },
  future: {
    title: 'Þú getur farið í Ró FIRE við {coastAge} ára aldur 🎯',
    shortMessage: 'Ró FIRE við {coastAge} ára',
    descriptionTemplate:
      'Ef þú hættir að leggja til við {coastAge} ára aldur, munu fjárfestingar þínar vaxa til að ná FI Tölunni við {targetAge} ára aldur með {returnRate}% ávöxtun.',
  },
  impossible: {
    title: 'Ró FIRE ekki mögulegt með þessum forsendum ⚠️',
    shortMessage: 'Ekki mögulegt',
    descriptionTemplate:
      'Fjárfestingar munu vaxa í {projectedBalance} kr við {targetAge} ára aldur, sem er minna en FI Tala ({fiNumber} kr). Bil: {gap} kr.',
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get scenario configuration by type
 */
export const getScenarioConfig = (type: ScenarioType) => {
  return {
    type,
    name: SCENARIO_LABELS[type],
    description: SCENARIO_DESCRIPTIONS[type],
    returnRate: RETURN_RATE_SCENARIOS[type],
    color: CHART_COLORS.scenarios[type],
  };
};

/**
 * Get all scenario configurations
 */
export const getAllScenarios = (): Array<{
  type: ScenarioType;
  name: string;
  description: string;
  returnRate: number;
  color: string;
}> => {
  return (['conservative', 'moderate', 'optimistic'] as ScenarioType[]).map(getScenarioConfig);
};

/**
 * Check if return rate needs warning
 */
export const needsReturnRateWarning = (rate: number): boolean => {
  return rate < RETURN_RATE_RANGE.WARNING_LOW || rate > RETURN_RATE_RANGE.WARNING_HIGH;
};

/**
 * Check if timeline is very long (> 40 years)
 */
export const isVeryLongTimeline = (years: number): boolean => {
  return years > 40;
};

/**
 * Check if Coast FIRE years to target is effectively impossible (> 100 years)
 */
export const isEffectivelyImpossible = (years: number | null): boolean => {
  return years === null || years > CALCULATION_CONSTANTS.MAX_PROJECTION_YEARS;
};

/**
 * Validate current age
 */
export const isValidCurrentAge = (age: number): boolean => {
  return age >= AGE_LIMITS.current.min && age <= AGE_LIMITS.current.max;
};

/**
 * Validate retirement age (must be > current age)
 */
export const isValidRetirementAge = (retirementAge: number, currentAge: number): boolean => {
  return (
    retirementAge > currentAge &&
    retirementAge >= AGE_LIMITS.retirement.min &&
    retirementAge <= AGE_LIMITS.retirement.max
  );
};

/**
 * Validate return rate
 */
export const isValidReturnRate = (rate: number): boolean => {
  return rate >= RETURN_RATE_RANGE.MIN && rate <= RETURN_RATE_RANGE.MAX;
};

/**
 * Validate investment amount
 */
export const isValidInvestmentAmount = (amount: number): boolean => {
  return amount >= INVESTMENT_RANGE.MIN && amount <= INVESTMENT_RANGE.MAX;
};

/**
 * Validate FI number
 */
export const isValidFINumber = (fiNumber: number): boolean => {
  return fiNumber >= FI_NUMBER_RANGE.MIN && fiNumber <= FI_NUMBER_RANGE.MAX;
};

/**
 * Validate FI multiplier
 */
export const isValidMultiplier = (multiplier: number): boolean => {
  return multiplier >= FI_MULTIPLIER_DEFAULTS.MIN && multiplier <= FI_MULTIPLIER_DEFAULTS.MAX;
};

/**
 * Get status color classes
 */
export const getStatusColors = (status: 'coasting' | 'future' | 'impossible') => {
  return STATUS_COLORS[status];
};

/**
 * Calculate optimal data point interval for chart
 *
 * Returns sampling interval to keep chart data points under MAX_DATA_POINTS.
 */
export const getChartSampleInterval = (yearSpan: number): number => {
  const maxPoints = CHART_DEFAULTS.MAX_DATA_POINTS;
  if (yearSpan <= maxPoints) return 1;

  // Sample every N years to stay under max points
  return Math.ceil(yearSpan / maxPoints);
};
