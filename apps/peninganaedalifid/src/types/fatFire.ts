/**
 * TypeScript types for the FatFIRE Planner (Lúxus FIRE Áætlun)
 *
 * The FatFIRE Planner helps users plan for a high-comfort retirement lifestyle.
 * Unlike LeanFIRE, FatFIRE embraces abundance - premium housing, travel, experiences.
 *
 * Key concepts:
 * - FatFIRE = Deluxe expenses + wish list items + annual splurge budget
 * - Higher multiplier (30x-33x) for extra safety margin
 * - Wish list builder for lifestyle dreams
 * - Splurge budget for annual discretionary spending
 *
 * Based on "Your Money or Your Life" Deluxe tier philosophy,
 * adapted for Icelandic premium cost of living.
 */

import type { ExpenseTier } from './expenseBaseline';

/**
 * Premium wish list categories for FatFIRE lifestyle
 *
 * Each category represents a premium spending area that users
 * can add to their wish list for retirement planning.
 */
export type WishListCategory =
  | 'premium-housing' // Luxury housing, second homes
  | 'international-travel' // Premium travel, first class
  | 'premium-healthcare' // Private healthcare, wellness
  | 'luxury-experiences' // Fine dining, concerts, spa
  | 'high-end-dining' // Restaurant subscriptions, wine clubs
  | 'premium-vehicles' // Luxury cars, boats
  | 'hobby-collections' // Art, watches, collections
  | 'other'; // Custom premium items

/**
 * Wish list item priority levels
 *
 * Helps distinguish between essential lifestyle desires
 * and nice-to-have items for scenario planning.
 */
export type WishListPriority = 'must-have' | 'nice-to-have';

/**
 * Individual wish list item for FatFIRE planning
 *
 * Represents a single lifestyle desire with monthly cost
 * and priority for scenario comparison.
 */
export interface WishListItem {
  id: string; // Unique identifier
  category: WishListCategory; // Category of item
  name: string; // User-defined name (Icelandic)
  monthlyCost: number; // Monthly cost in ISK
  priority: WishListPriority; // Must-have or nice-to-have
  description?: string; // Optional user notes
  createdAt: Date; // When item was added
}

/**
 * Stored wish list item for localStorage persistence
 */
export interface StoredWishListItem {
  id: string;
  category: WishListCategory;
  name: string;
  monthlyCost: number;
  priority: WishListPriority;
  description?: string;
  createdAt: string; // ISO date string
}

/**
 * FatFIRE expense scenario for comparison
 *
 * Allows users to compare different expense levels
 * to see impact on FI number and timeline.
 */
export interface FatFireScenario {
  id: string;
  name: string; // Scenario name (e.g., "Current", "With Summer House")
  baseExpenses: number; // Monthly base expenses (ISK)
  wishListTotal: number; // Monthly wish list total (ISK)
  splurgeBudget: number; // Annual splurge budget (ISK)
  totalMonthly: number; // Total monthly expenses (ISK)
}

/**
 * Milestone markers for FatFIRE progress
 *
 * Shows progress markers at 25%, 50%, 75%, and 100% of FI number.
 * Each milestone includes the amount and projected date.
 */
export interface Milestone {
  percentage: number; // 25, 50, 75, or 100
  amount: number; // Amount in ISK at this milestone
  projectedDate: Date | null; // Projected date to reach (null if cannot calculate)
  yearsFromNow: number | null; // Years from now to reach (null if cannot calculate)
  label: string; // Icelandic label for display
}

/**
 * Life energy metrics for FatFIRE
 *
 * Converts FI number to years of work and compares with LeanFIRE
 * to show the "cost" of premium lifestyle in life energy.
 */
export interface FatFireLifeEnergy {
  actualHourlyWage: number; // User's actual hourly wage (ISK/hour)
  annualNetIncome: number; // Annual net income (ISK)
  yearsOfWork: number; // FatFIRE number in years of work
  yearsToFI: number | null; // Years remaining to reach FI (null if no savings data)
  leanFireComparison?: {
    leanFINumber: number; // LeanFIRE FI number for comparison
    yearsOfWork: number; // LeanFIRE years of work
    difference: number; // Extra years for FatFIRE lifestyle
  };
}

/**
 * Complete FatFIRE input state
 *
 * Stores all user configuration for FatFIRE calculations.
 * This state is persisted to localStorage and managed by CalculatorContext.
 */
export interface FatFireState {
  // Expense source
  useExpenseBaseline: boolean; // Use Expense Baseline Tool or custom
  selectedTier: ExpenseTier; // Default: 'deluxe' for FatFIRE
  customMonthlyExpense: number | null; // Custom base expenses if not using baseline

  // Wish list
  wishListItems: WishListItem[]; // List of lifestyle desires

  // Splurge budget
  splurgeBudgetAnnual: number; // Annual discretionary splurge budget (ISK)

  // FI multiplier
  multiplier: number; // Default: 30x for FatFIRE
  customMultiplier: number | null; // Custom multiplier if set

  // Timeline inputs
  currentSavings: number | null; // Current portfolio value (ISK)
  expectedReturnRate: number; // Expected annual return (default: 0.06 = 6%)
  annualSavings: number | null; // Annual savings amount (ISK)

  // Scenarios (for comparison)
  scenarios: FatFireScenario[];

  // Metadata
  lastUpdated: Date;
}

/**
 * Stored FatFIRE state for localStorage persistence
 */
export interface StoredFatFireState {
  useExpenseBaseline: boolean;
  selectedTier: ExpenseTier;
  customMonthlyExpense: number | null;
  wishListItems: StoredWishListItem[];
  splurgeBudgetAnnual: number;
  multiplier: number;
  customMultiplier: number | null;
  currentSavings: number | null;
  expectedReturnRate: number;
  annualSavings: number | null;
  scenarios: FatFireScenario[];
  lastUpdated: string; // ISO date string
}

/**
 * Expense breakdown item for visualization
 *
 * Used for pie charts and expense composition displays.
 */
export interface ExpenseBreakdownItem {
  category: string; // Category name in Icelandic
  amount: number; // Monthly amount in ISK
  percentage: number; // Percentage of total
  color: string; // Chart color (Tailwind class or hex)
}

/**
 * Timeline chart data point
 *
 * Used for growth projection charts showing path to FI.
 */
export interface TimelineChartDataPoint {
  year: number; // Year number (0 = now)
  date: Date; // Actual date
  portfolioValue: number; // Projected portfolio value (ISK)
  fiPercentage: number; // Percentage of FI number reached
}

/**
 * Scenario comparison result
 *
 * Shows calculation results for one scenario in comparison mode.
 */
export interface ScenarioResult {
  scenario: FatFireScenario;
  monthlyExpenses: number; // Total monthly expenses (ISK)
  annualExpenses: number; // Total annual expenses (ISK)
  fiNumber: number; // FI number for this scenario (ISK)
  yearsToFI: number | null; // Years to reach FI (null if cannot calculate)
  difference?: {
    isk: number; // ISK difference from base scenario
    years: number; // Years difference in timeline
  };
}

/**
 * FatFIRE validation result
 *
 * Used to validate input state and show appropriate warnings.
 */
export interface FatFireValidationResult {
  isValid: boolean;
  errors: string[]; // Critical errors preventing calculation
  warnings: string[]; // Non-blocking warnings for user
}

/**
 * Complete FatFIRE calculation results
 *
 * Contains all calculated values derived from FatFIRE state:
 * - Expense breakdown
 * - FI number calculation
 * - Timeline projections
 * - Milestones
 * - Life energy metrics
 * - Scenario comparisons
 */
export interface FatFireResults {
  // Expense composition
  baseMonthlyExpenses: number; // Base expenses from baseline or custom (ISK)
  wishListMonthlyTotal: number; // Total wish list monthly cost (ISK)
  splurgeBudgetMonthly: number; // Splurge budget per month (annual / 12) (ISK)
  totalMonthlyExpenses: number; // Total monthly expenses (ISK)
  totalAnnualExpenses: number; // Total annual expenses (ISK)

  // Expense breakdown for visualization
  expenseBreakdown: ExpenseBreakdownItem[];

  // FI calculation
  multiplier: number; // Multiplier used (28x, 30x, 33x, or custom)
  withdrawalRate: number; // Withdrawal rate (1 / multiplier)
  fiNumber: number; // FatFIRE number (annual expenses × multiplier)

  // Must-have vs nice-to-have breakdown
  mustHaveTotal: number; // Monthly total of must-have wish list items
  niceToHaveTotal: number; // Monthly total of nice-to-have items
  mustHaveFINumber: number; // FI number with only must-have items
  fullFINumber: number; // FI number with all items

  // Timeline projections
  hasTimelineData: boolean; // Whether timeline can be calculated
  timeline?: {
    yearsToFI: number; // Years to reach FI number
    fiDate: Date; // Projected FI date
    chartData: TimelineChartDataPoint[]; // Data for growth chart
  };

  // Milestones
  milestones: Milestone[];

  // Progress (if current savings available)
  currentProgress?: {
    percentage: number; // Current savings as % of FI number
    remaining: number; // ISK remaining to reach FI
    currentSavings: number; // Current savings value
  };

  // Life energy (if AWH available)
  lifeEnergy?: FatFireLifeEnergy;

  // Scenario comparison (if multiple scenarios)
  scenarioResults?: ScenarioResult[];
}

/**
 * Wish list category configuration
 *
 * Contains display information for each wish list category.
 */
export interface WishListCategoryConfig {
  id: WishListCategory;
  labelIs: string; // Icelandic label
  labelEn: string; // English label for reference
  icon: string; // Emoji icon
  examples: string; // Example items in Icelandic
  defaultMonthlyCost: number; // Suggested default cost (ISK)
}
