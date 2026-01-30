/**
 * Savings Report Types
 * TypeScript interfaces and types for the Savings Report (Sparnaðarskýrsla) feature
 */

/**
 * Configuration for a savings category
 * Defines the immutable properties of a category
 */
export interface SavingsCategoryConfig {
  /** Unique identifier for the category */
  id: string;
  /** Icelandic display name */
  name: string;
  /** Emoji icon for visual identification */
  icon: string;
  /** Icelandic description/help text */
  description: string;
  /** Display order (1-7) */
  order: number;
}

/**
 * Data for a single savings category
 * User-entered values that can be updated
 */
export interface SavingsCategoryData {
  /** Current balance in ISK */
  balance: number;
  /** Monthly contribution in ISK */
  monthlyContribution: number;
  /** Optional target amount in ISK */
  targetAmount?: number;
  /** Optional user notes */
  notes?: string;
}

/**
 * Full savings category (config + data)
 * Combines configuration with user data
 */
export interface SavingsCategory extends SavingsCategoryConfig {
  /** User-entered data for this category */
  data: SavingsCategoryData;
  /** Whether this category is hidden from display */
  isHidden: boolean;
}

/**
 * Complete savings report
 * Top-level data structure stored in context and localStorage
 */
export interface SavingsReport {
  /** Array of all savings categories */
  categories: SavingsCategory[];
  /** Last time the report was updated */
  lastUpdated: Date;
  /** Schema version for migrations */
  version: number;
}

/**
 * Savings rate level classification
 */
export type SavingsRateLevel =
  | 'critical'     // < 10%
  | 'low'          // 10-20%
  | 'moderate'     // 20-30%
  | 'good'         // 30-50%
  | 'excellent'    // 50-70%
  | 'exceptional'; // 70%+

/**
 * Savings rate context message
 * Provides contextual information and FI estimate based on savings rate
 */
export interface SavingsRateContext {
  /** Savings rate as percentage (0-100+) */
  rate: number;
  /** Classification level */
  level: SavingsRateLevel;
  /** Icelandic contextual message */
  messageIs: string;
  /** Rough estimate of years to FI (null if too low to estimate) */
  fiEstimateYears: number | null;
}

/**
 * Life energy calculations for savings
 * Converts monetary values to work hours
 */
export interface SavingsLifeEnergy {
  /** Total balance in work hours */
  totalBalanceHours: number;
  /** Monthly contribution in work hours */
  totalContributionHoursPerMonth: number;
  /** Annual contribution in work hours */
  totalContributionHoursPerYear: number;
}

/**
 * Category breakdown for display
 * Calculated breakdown of a single category with percentages and life energy
 */
export interface CategoryBreakdown {
  /** Category unique ID */
  categoryId: string;
  /** Category display name */
  categoryName: string;
  /** Category icon */
  icon: string;
  /** Current balance in ISK */
  balance: number;
  /** Monthly contribution in ISK */
  monthlyContribution: number;
  /** Percentage of total balance */
  percentageOfTotal: number;
  /** Balance in work hours (if AWH available) */
  lifeEnergyBalance?: number;
  /** Monthly contribution in work hours (if AWH available) */
  lifeEnergyContribution?: number;
}

/**
 * Complete calculation results
 * All computed values for the savings report
 */
export interface SavingsReportResults {
  /** Sum of all balances */
  totalSavings: number;
  /** Sum of all monthly contributions */
  totalMonthlyContribution: number;
  /** Total annual contribution (monthly * 12) */
  totalAnnualContribution: number;
  /** Savings rate as percentage (null if income unavailable) */
  savingsRate: number | null;
  /** Savings rate context with message and FI estimate */
  savingsRateContext: SavingsRateContext | null;
  /** Breakdown per category */
  categoryBreakdown: CategoryBreakdown[];
  /** Life energy calculations (null if AWH unavailable) */
  lifeEnergy: SavingsLifeEnergy | null;
}
