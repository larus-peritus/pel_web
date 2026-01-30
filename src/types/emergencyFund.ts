/**
 * TypeScript types for the Emergency Fund Freedom Meter
 * Transforms emergency fund balance into meaningful metrics:
 * - Months of freedom (financial runway)
 * - Life energy hours protected
 * - Risk assessment
 * - Progress toward 3/6/12 month targets
 */

/**
 * Emergency Fund Calculator Input Data
 */
export interface EmergencyFundData {
  /** Current emergency fund balance in ISK */
  balance: number;
  /** Monthly essential expenses in ISK */
  monthlyExpenses: number;
  /** Last time data was updated */
  lastUpdated: Date;
}

/**
 * Complete calculation results for emergency fund
 */
export interface EmergencyFundResults {
  // Primary metrics
  /** Financial runway in months */
  monthsOfFreedom: number;
  /** Runway in weeks (only shown if < 1 month) */
  weeksOfFreedom: number | null;

  // Life energy metrics (null if Actual Hourly Wage not available)
  /** Total life energy hours protected by emergency fund */
  lifeEnergyHours: number | null;
  /** Life energy in work-weeks (hours / 40) */
  lifeEnergyWorkWeeks: number | null;
  /** Life energy in years (hours / 8760) */
  lifeEnergyYears: number | null;

  // Risk assessment
  /** Full risk rating object with explanation */
  riskRating: RiskRating;
  /** Quick access to risk level */
  riskLevel: RiskLevel;

  // Target progress
  /** Progress toward 3, 6, and 12 month targets */
  targets: TargetProgress[];
}

/**
 * Risk level for emergency fund adequacy
 */
export type RiskLevel =
  | 'underfunded' // < 1 month
  | 'minimal' // 1-3 months
  | 'moderate' // 3-6 months
  | 'strong' // 6-12 months
  | 'excellent'; // 12+ months

/**
 * Comprehensive risk rating with visual styling
 */
export interface RiskRating {
  /** Risk level classification */
  level: RiskLevel;
  /** Icelandic label for risk level */
  label: string;
  /** Tailwind color scheme for display */
  color: ColorScheme;
  /** Explanation of what this risk level means */
  explanation: string;
  /** Actionable recommendation (null if not needed) */
  recommendation: string | null;
}

/**
 * Progress toward a specific emergency fund target
 */
export interface TargetProgress {
  /** Target in months (3, 6, or 12) */
  months: number;
  /** Target amount in ISK (months * monthlyExpenses) */
  targetAmount: number;
  /** Current balance */
  currentAmount: number;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether target is achieved */
  isAchieved: boolean;
  /** Amount remaining to reach target (0 if achieved) */
  amountRemaining: number;
  /** Icelandic explanation of target purpose */
  purpose: string;
}

/**
 * Tailwind CSS color scheme for consistent styling
 */
export interface ColorScheme {
  /** Background color class (e.g., 'bg-red-100') */
  bg: string;
  /** Text color class (e.g., 'text-red-800') */
  text: string;
  /** Border color class (e.g., 'border-red-300') */
  border: string;
}

/**
 * Validation result for input fields
 */
export interface ValidationResult {
  /** Whether input is valid */
  valid: boolean;
  /** Error message in Icelandic (if invalid) */
  error?: string;
}

/**
 * Icelandic expense example preset
 */
export interface ExpenseExample {
  /** Unique identifier */
  id: string;
  /** Icelandic label */
  label: string;
  /** Monthly expense amount in ISK */
  amount: number;
  /** Description of what this covers */
  description: string;
}
