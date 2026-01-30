/**
 * Expense Baseline Calculation Functions
 *
 * Pure functions for calculating expense baseline results including:
 * - Tier totals (monthly and annual)
 * - Percentage breakdowns per category
 * - Life energy calculations (work hours required)
 * - Tier differences (cost to upgrade lifestyle)
 *
 * Based on "Your Money or Your Life" three-tier lifestyle philosophy
 */

/**
 * Three spending tiers representing different lifestyle levels
 */
export type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';

/**
 * Monthly expense values for each of the three tiers
 */
export interface TierValues {
  barebones: number; // ISK monthly - minimum needed to survive
  comfortable: number; // ISK monthly - pleasant quality of life
  deluxe: number; // ISK monthly - ideal circumstances without worry
}

/**
 * Individual expense category with values for all three tiers
 */
export interface ExpenseCategory {
  id: string; // Unique identifier (e.g., 'husnaedi', 'matur')
  name: string; // Icelandic display name (e.g., 'Húsnæði', 'Matur')
  icon: string; // Emoji icon for visual identification
  values: TierValues; // Monthly expense values for each tier
  isCustom: boolean; // User-created category vs default
  isHidden: boolean; // Hidden from display (but can be unhidden)
  order: number; // Display order
}

/**
 * Complete expense baseline data structure
 */
export interface ExpenseBaseline {
  categories: ExpenseCategory[];
  lastUpdated: Date;
  wizardCompleted: boolean; // Has user completed setup wizard
  version: number; // Schema version for migrations
}

/**
 * Life energy results showing work hours required
 */
export interface LifeEnergyResults {
  monthly: TierValues; // Work hours per month per tier
  annual: TierValues; // Work hours per year per tier
  perCategory: Record<string, TierValues>; // Hours per category per tier
}

/**
 * Difference between tiers in ISK and work hours
 */
export interface TierDifference {
  isk: number; // ISK difference
  hours: number | null; // Work hours difference (null if no AWH)
}

/**
 * Complete tier differences between all tier combinations
 */
export interface TierDifferences {
  bareToComfortable: TierDifference;
  comfortableToDeluxe: TierDifference;
  bareToDeluxe: TierDifference;
}

/**
 * Complete expense baseline calculation results
 */
export interface ExpenseBaselineResults {
  // Totals per tier (monthly)
  totals: TierValues;

  // Annual totals
  annualTotals: TierValues;

  // Percentage breakdown per category per tier
  percentageBreakdown: Record<string, TierValues>; // category id -> percentages

  // Life energy (null if AWH not available)
  lifeEnergy: LifeEnergyResults | null;

  // Tier differences
  tierDifferences: TierDifferences;

  // Category counts
  categoryCount: number;
  activeCategories: number; // Non-hidden
}

/**
 * Calculate total expenses per tier
 *
 * Sums all non-hidden categories to get monthly totals for each tier.
 * Hidden categories are excluded from calculations.
 *
 * @param categories - Array of expense categories
 * @returns Monthly totals for each tier
 *
 * @example
 * const categories = [
 *   { id: 'husnaedi', values: { barebones: 120000, comfortable: 200000, deluxe: 350000 }, isHidden: false },
 *   { id: 'matur', values: { barebones: 40000, comfortable: 70000, deluxe: 120000 }, isHidden: false }
 * ];
 * const totals = calculateTierTotals(categories);
 * // Returns: { barebones: 160000, comfortable: 270000, deluxe: 470000 }
 */
export function calculateTierTotals(categories: ExpenseCategory[]): TierValues {
  const activeCategories = categories.filter((c) => !c.isHidden);

  return {
    barebones: activeCategories.reduce((sum, c) => sum + c.values.barebones, 0),
    comfortable: activeCategories.reduce(
      (sum, c) => sum + c.values.comfortable,
      0
    ),
    deluxe: activeCategories.reduce((sum, c) => sum + c.values.deluxe, 0),
  };
}

/**
 * Calculate annual totals from monthly totals
 *
 * Simple multiplication by 12 to get yearly expenses.
 *
 * @param monthlyTotals - Monthly expense totals per tier
 * @returns Annual expense totals per tier
 *
 * @example
 * const monthly = { barebones: 250000, comfortable: 520000, deluxe: 1000000 };
 * const annual = calculateAnnualTotals(monthly);
 * // Returns: { barebones: 3000000, comfortable: 6240000, deluxe: 12000000 }
 */
export function calculateAnnualTotals(monthlyTotals: TierValues): TierValues {
  return {
    barebones: monthlyTotals.barebones * 12,
    comfortable: monthlyTotals.comfortable * 12,
    deluxe: monthlyTotals.deluxe * 12,
  };
}

/**
 * Calculate percentage each category represents of total
 *
 * For each category and each tier, calculates what percentage of
 * the total that category represents. Used for pie charts.
 *
 * @param categories - Array of expense categories
 * @param totals - Total expenses per tier
 * @returns Map of category ID to percentage per tier
 *
 * @example
 * const categories = [
 *   { id: 'husnaedi', values: { barebones: 120000, comfortable: 200000, deluxe: 350000 }, isHidden: false },
 *   { id: 'matur', values: { barebones: 40000, comfortable: 70000, deluxe: 120000 }, isHidden: false }
 * ];
 * const totals = { barebones: 160000, comfortable: 270000, deluxe: 470000 };
 * const breakdown = calculatePercentageBreakdown(categories, totals);
 * // Returns: {
 * //   husnaedi: { barebones: 75, comfortable: 74.07, deluxe: 74.47 },
 * //   matur: { barebones: 25, comfortable: 25.93, deluxe: 25.53 }
 * // }
 */
export function calculatePercentageBreakdown(
  categories: ExpenseCategory[],
  totals: TierValues
): Record<string, TierValues> {
  const result: Record<string, TierValues> = {};

  const activeCategories = categories.filter((c) => !c.isHidden);

  for (const category of activeCategories) {
    result[category.id] = {
      barebones:
        totals.barebones > 0
          ? (category.values.barebones / totals.barebones) * 100
          : 0,
      comfortable:
        totals.comfortable > 0
          ? (category.values.comfortable / totals.comfortable) * 100
          : 0,
      deluxe:
        totals.deluxe > 0 ? (category.values.deluxe / totals.deluxe) * 100 : 0,
    };
  }

  return result;
}

/**
 * Calculate life energy (work hours) for expenses
 *
 * Converts ISK expenses to work hours based on actual hourly wage.
 * Requires actual hourly wage from main calculator. Returns null if
 * wage is not available or is zero/negative.
 *
 * @param totals - Total expenses per tier
 * @param categories - Array of expense categories
 * @param actualHourlyWage - Actual hourly wage from AWH calculator (ISK/hour)
 * @returns Life energy results or null if AWH not available
 *
 * @example
 * const totals = { barebones: 250000, comfortable: 520000, deluxe: 1000000 };
 * const categories = [
 *   { id: 'husnaedi', values: { barebones: 120000, comfortable: 200000, deluxe: 350000 }, isHidden: false }
 * ];
 * const wage = 2500; // ISK per hour
 * const lifeEnergy = calculateLifeEnergy(totals, categories, wage);
 * // Returns: {
 * //   monthly: { barebones: 100, comfortable: 208, deluxe: 400 },
 * //   annual: { barebones: 1200, comfortable: 2496, deluxe: 4800 },
 * //   perCategory: { husnaedi: { barebones: 48, comfortable: 80, deluxe: 140 } }
 * // }
 */
export function calculateLifeEnergy(
  totals: TierValues,
  categories: ExpenseCategory[],
  actualHourlyWage: number | null
): LifeEnergyResults | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) {
    return null;
  }

  const activeCategories = categories.filter((c) => !c.isHidden);

  // Monthly hours per tier
  const monthly: TierValues = {
    barebones: totals.barebones / actualHourlyWage,
    comfortable: totals.comfortable / actualHourlyWage,
    deluxe: totals.deluxe / actualHourlyWage,
  };

  // Annual hours (monthly * 12)
  const annual: TierValues = {
    barebones: monthly.barebones * 12,
    comfortable: monthly.comfortable * 12,
    deluxe: monthly.deluxe * 12,
  };

  // Per category hours
  const perCategory: Record<string, TierValues> = {};
  for (const category of activeCategories) {
    perCategory[category.id] = {
      barebones: category.values.barebones / actualHourlyWage,
      comfortable: category.values.comfortable / actualHourlyWage,
      deluxe: category.values.deluxe / actualHourlyWage,
    };
  }

  return { monthly, annual, perCategory };
}

/**
 * Calculate differences between tiers
 *
 * Shows how much more (in ISK and work hours) each tier costs
 * compared to the tier below it. Useful for understanding the
 * cost of lifestyle upgrades.
 *
 * @param totals - Total expenses per tier
 * @param actualHourlyWage - Actual hourly wage (null if not available)
 * @returns Differences between all tier combinations
 *
 * @example
 * const totals = { barebones: 250000, comfortable: 520000, deluxe: 1000000 };
 * const wage = 2500;
 * const diffs = calculateTierDifferences(totals, wage);
 * // Returns: {
 * //   bareToComfortable: { isk: 270000, hours: 108 },
 * //   comfortableToDeluxe: { isk: 480000, hours: 192 },
 * //   bareToDeluxe: { isk: 750000, hours: 300 }
 * // }
 */
export function calculateTierDifferences(
  totals: TierValues,
  actualHourlyWage: number | null
): TierDifferences {
  const iskBareToComf = totals.comfortable - totals.barebones;
  const iskConfToDeluxe = totals.deluxe - totals.comfortable;
  const iskBareToDeluxe = totals.deluxe - totals.barebones;

  return {
    bareToComfortable: {
      isk: iskBareToComf,
      hours:
        actualHourlyWage && actualHourlyWage > 0
          ? iskBareToComf / actualHourlyWage
          : null,
    },
    comfortableToDeluxe: {
      isk: iskConfToDeluxe,
      hours:
        actualHourlyWage && actualHourlyWage > 0
          ? iskConfToDeluxe / actualHourlyWage
          : null,
    },
    bareToDeluxe: {
      isk: iskBareToDeluxe,
      hours:
        actualHourlyWage && actualHourlyWage > 0
          ? iskBareToDeluxe / actualHourlyWage
          : null,
    },
  };
}

/**
 * Calculate all expense baseline results
 *
 * Main orchestration function that performs all calculations and
 * returns a complete results object. This is called whenever the
 * baseline or actual hourly wage changes.
 *
 * @param baseline - Complete expense baseline data
 * @param actualHourlyWage - Actual hourly wage from AWH calculator
 * @returns Complete expense baseline results
 *
 * @example
 * const baseline = {
 *   categories: [...],
 *   lastUpdated: new Date(),
 *   wizardCompleted: true,
 *   version: 1
 * };
 * const results = calculateExpenseBaselineResults(baseline, 2500);
 */
export function calculateExpenseBaselineResults(
  baseline: ExpenseBaseline,
  actualHourlyWage: number | null
): ExpenseBaselineResults {
  const { categories } = baseline;

  // Calculate totals
  const totals = calculateTierTotals(categories);
  const annualTotals = calculateAnnualTotals(totals);

  // Calculate breakdowns
  const percentageBreakdown = calculatePercentageBreakdown(categories, totals);

  // Calculate life energy
  const lifeEnergy = calculateLifeEnergy(totals, categories, actualHourlyWage);

  // Calculate tier differences
  const tierDifferences = calculateTierDifferences(totals, actualHourlyWage);

  // Count categories
  const activeCategories = categories.filter((c) => !c.isHidden);

  return {
    totals,
    annualTotals,
    percentageBreakdown,
    lifeEnergy,
    tierDifferences,
    categoryCount: categories.length,
    activeCategories: activeCategories.length,
  };
}

/**
 * Get monthly expense for a specific tier
 *
 * Helper function for other calculators to get the expense amount
 * for a selected tier. Used by FI Number, Savings Rate, and other calculators.
 *
 * @param baseline - Complete expense baseline data
 * @param tier - Which tier to get expenses for
 * @returns Monthly expense in ISK for selected tier
 *
 * @example
 * const expense = getExpenseByTier(baseline, 'comfortable');
 * // Returns: 520000
 */
export function getExpenseByTier(
  baseline: ExpenseBaseline,
  tier: ExpenseTier
): number {
  const totals = calculateTierTotals(baseline.categories);
  return totals[tier];
}

/**
 * Get annual expense for a specific tier
 *
 * Helper function to get yearly expenses for a tier.
 * Simply multiplies monthly by 12.
 *
 * @param baseline - Complete expense baseline data
 * @param tier - Which tier to get expenses for
 * @returns Annual expense in ISK for selected tier
 *
 * @example
 * const annualExpense = getAnnualExpenseByTier(baseline, 'comfortable');
 * // Returns: 6240000 (520000 * 12)
 */
export function getAnnualExpenseByTier(
  baseline: ExpenseBaseline,
  tier: ExpenseTier
): number {
  return getExpenseByTier(baseline, tier) * 12;
}

/**
 * Check if user has set up expense baseline
 *
 * Used by other calculators to determine if they should show
 * the tier selector or prompt user to set up baseline first.
 *
 * @param baseline - Expense baseline data (can be null)
 * @returns True if baseline exists and wizard was completed
 *
 * @example
 * if (!hasExpenseBaseline(baseline)) {
 *   return <BaselinePrompt />;
 * }
 */
export function hasExpenseBaseline(
  baseline: ExpenseBaseline | null
): boolean {
  if (!baseline) {
    return false;
  }
  return baseline.wizardCompleted;
}
