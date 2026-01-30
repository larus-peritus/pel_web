/**
 * TypeScript types for the One-Time Purchase Decision Tool
 * Based on "Your Money or Your Life" philosophy
 *
 * Helps users evaluate large purchases in terms of:
 * - Life energy cost (hours of work required)
 * - Opportunity cost (future value if invested)
 * - FI impact (delay on financial independence timeline)
 */

/**
 * Input for a single purchase evaluation
 */
export interface PurchaseInput {
  /** Purchase price in ISK */
  price: number;
  /** Optional name/description of the purchase */
  name?: string;
}

/**
 * Settings for purchase calculations
 */
export interface PurchaseCalculationSettings {
  /** Expected annual investment return rate (0-1, e.g., 0.07 for 7%) */
  expectedReturnRate: number;
  /** Time periods in years for future value calculations */
  futureValueYears: number[];
}

/**
 * Life energy cost results
 */
export interface LifeEnergyCost {
  /** Total hours of work required */
  totalHours: number;
  /** Work days (assuming 8 hours per day) */
  workDays: number;
  /** Work weeks (assuming 40 hours per week) */
  workWeeks: number;
  /** Human-readable formatted string (e.g., "2 vikur og 3 dagar") */
  formattedString: string;
}

/**
 * Future value result for a specific time period
 */
export interface FutureValueResult {
  /** Number of years */
  years: number;
  /** Future value in ISK */
  value: number;
  /** Human-readable formatted value */
  formattedValue: string;
}

/**
 * Financial Independence impact (optional)
 */
export interface FIImpact {
  /** Additional work hours needed to reach FI */
  additionalWorkHours: number;
  /** Delay on FI date in days */
  delayDays: number;
  /** Delay in months (rounded) */
  delayMonths: number;
  /** Human-readable formatted delay */
  formattedDelay: string;
}

/**
 * Complete calculation result for a single purchase
 */
export interface PurchaseCalculationResult {
  /** Input data */
  input: PurchaseInput;
  /** Life energy cost */
  lifeEnergyCost: LifeEnergyCost;
  /** Future values for all time periods */
  futureValues: FutureValueResult[];
  /** FI impact (if FI data available) */
  fiImpact?: FIImpact;
}

/**
 * Comparison of multiple purchase options
 */
export interface PurchaseComparison {
  /** List of results (2-3 options) */
  options: PurchaseCalculationResult[];
  /** Index of the cheapest option */
  cheapestOptionIndex: number;
  /** Maximum difference in life energy hours between options */
  maxLifeEnergyDifference: number;
}

/**
 * Complete state for the One-Time Purchase component
 */
export interface OneTimePurchaseState {
  /** Main purchase being evaluated */
  mainPurchase: PurchaseInput;
  /** Comparison options (0-2 additional) */
  comparisonOptions: PurchaseInput[];
  /** Calculation settings */
  settings: PurchaseCalculationSettings;
  /** Whether to show comparison mode */
  showComparison: boolean;
}

/**
 * User data required from context/profile
 */
export interface RequiredUserData {
  /** Actual hourly wage from the Actual Hourly Wage Calculator */
  actualHourlyWage: number | null;
  /** Optional FI data for FI impact calculations */
  fiData?: {
    /** Annual savings rate */
    annualSavings: number;
    /** Projected FI date (optional) */
    fiDate?: Date;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the data is valid */
  isValid: boolean;
  /** List of error messages */
  errors: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default calculation settings
 */
export const DEFAULT_SETTINGS: PurchaseCalculationSettings = {
  expectedReturnRate: 0.07, // 7%
  futureValueYears: [10, 20, 30],
};

/**
 * Initial state for the component
 */
export const INITIAL_STATE: OneTimePurchaseState = {
  mainPurchase: { price: 0, name: '' },
  comparisonOptions: [],
  settings: DEFAULT_SETTINGS,
  showComparison: false,
};

/**
 * localStorage key for persisting state
 */
export const STORAGE_KEY = 'oneTimePurchase_state';
