/**
 * TypeScript types for the Expense Baseline Tool
 *
 * The Expense Baseline Tool enables users to define their monthly expenses
 * at three spending tiers (Barebones/Comfortable/Deluxe) across multiple categories.
 * This baseline serves as the foundation for FI Number calculations, savings rate
 * analysis, and other FIRE planning tools.
 *
 * Based on "Your Money or Your Life" three-tier lifestyle philosophy
 */

/**
 * Three spending tiers representing different lifestyle levels
 *
 * - **Barebones**: Minimum needed to survive - the bare essentials
 * - **Comfortable**: Pleasant quality of life - enjoyable but not excessive
 * - **Deluxe**: Ideal circumstances without worry - all wants satisfied
 */
export type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';

/**
 * Monthly expense values for each of the three tiers
 *
 * All values in ISK (Icelandic Króna) representing monthly expenses.
 */
export interface TierValues {
  barebones: number; // ISK monthly - minimum needed to survive
  comfortable: number; // ISK monthly - pleasant quality of life
  deluxe: number; // ISK monthly - ideal circumstances without worry
}

/**
 * Configuration for a default expense category
 *
 * Used to define the 10 default Icelandic expense categories with
 * their default values, descriptions, and subcategories.
 */
export interface ExpenseCategoryConfig {
  id: string; // Unique identifier (e.g., 'husnaedi', 'matur')
  nameIs: string; // Icelandic name (e.g., 'Húsnæði', 'Matur')
  nameEn: string; // English name for reference (e.g., 'Housing', 'Food')
  icon: string; // Emoji icon for visual identification
  description: string; // Icelandic help text explaining category
  defaults: TierValues; // Default values for Icelandic cost of living
  subcategories?: string[]; // Optional subcategories for guidance
}

/**
 * Individual expense category with values for all three tiers
 *
 * Represents a single expense category (e.g., Housing, Food, Transport)
 * with user-defined or default values for each spending tier.
 */
export interface ExpenseCategory {
  id: string; // Unique identifier (e.g., 'husnaedi', 'matur')
  name: string; // Icelandic display name (e.g., 'Húsnæði', 'Matur')
  icon: string; // Emoji icon for visual identification
  values: TierValues; // Monthly expense values for each tier
  isCustom: boolean; // User-created category vs default category
  isHidden: boolean; // Hidden from display (but can be unhidden)
  order: number; // Display order in lists
}

/**
 * Complete expense baseline data structure
 *
 * Contains all expense categories and metadata about the baseline setup.
 * This is the core data structure that gets saved to localStorage.
 */
export interface ExpenseBaseline {
  categories: ExpenseCategory[];
  lastUpdated: Date;
  wizardCompleted: boolean; // Has user completed setup wizard at least once
  version: number; // Schema version for migrations
}

/**
 * Life energy results showing work hours required
 *
 * Converts ISK expenses to work hours based on actual hourly wage.
 * Shows how much of your life energy (time) is required to pay for
 * different expense levels.
 */
export interface LifeEnergyResults {
  monthly: TierValues; // Work hours per month per tier
  annual: TierValues; // Work hours per year per tier
  perCategory: Record<string, TierValues>; // Hours per category per tier
}

/**
 * Difference between tiers in ISK and work hours
 *
 * Shows the cost (in both money and time) of upgrading from one
 * lifestyle tier to another.
 */
export interface TierDifference {
  isk: number; // ISK difference per month
  hours: number | null; // Work hours difference (null if no AWH available)
}

/**
 * Complete tier differences between all tier combinations
 *
 * Provides comparison data for understanding the incremental cost
 * of each lifestyle upgrade.
 */
export interface TierDifferences {
  bareToComfortable: TierDifference; // Cost to upgrade from Barebones to Comfortable
  comfortableToDeluxe: TierDifference; // Cost to upgrade from Comfortable to Deluxe
  bareToDeluxe: TierDifference; // Total cost difference from Barebones to Deluxe
}

/**
 * Complete expense baseline calculation results
 *
 * Contains all calculated values derived from the expense baseline:
 * totals, percentages, life energy, and tier differences.
 * This is what gets displayed in the results section.
 */
export interface ExpenseBaselineResults {
  // Totals per tier (monthly)
  totals: TierValues;

  // Annual totals (monthly * 12)
  annualTotals: TierValues;

  // Percentage breakdown per category per tier
  // Maps category ID to percentage of total for each tier
  percentageBreakdown: Record<string, TierValues>;

  // Life energy calculations (null if AWH not available)
  // Shows work hours required to pay for expenses
  lifeEnergy: LifeEnergyResults | null;

  // Tier differences showing upgrade costs
  tierDifferences: TierDifferences;

  // Category counts
  categoryCount: number; // Total categories (including hidden)
  activeCategories: number; // Visible categories only
}

/**
 * Stored expense category for localStorage persistence
 *
 * Simplified version of ExpenseCategory for JSON serialization.
 * Date fields are converted to ISO strings for storage.
 */
export interface StoredExpenseCategory {
  id: string;
  name: string;
  icon: string;
  values: TierValues;
  isCustom: boolean;
  isHidden: boolean;
  order: number;
}

/**
 * Stored expense baseline for localStorage persistence
 *
 * Simplified version of ExpenseBaseline with dates as strings.
 */
export interface StoredExpenseBaseline {
  categories: StoredExpenseCategory[];
  lastUpdated: string; // ISO date string
  wizardCompleted: boolean;
  version: number;
}

/**
 * Color scheme for tier visual distinction
 *
 * Tailwind CSS classes for styling each tier with distinct colors.
 * Used for tabs, badges, and visual differentiation.
 */
export interface TierColorScheme {
  bg: string; // Background color class (e.g., 'bg-amber-50')
  border: string; // Border color class (e.g., 'border-amber-300')
  text: string; // Text color class (e.g., 'text-amber-800')
  accent: string; // Accent color class (e.g., 'bg-amber-500')
}
