/**
 * TypeScript types for Current Expense Report (Rauntímaútgjöld)
 * Tracks actual current monthly expenses with granular line items
 */

/**
 * Individual expense line item within a category
 */
export interface LineItem {
  id: string; // Unique identifier
  label: string; // Description (e.g., "Bónus groceries", "Netflix")
  amount: number; // Monthly amount in ISK
  isRecurring: boolean; // True for subscriptions/regular payments
  isEssential: boolean; // True for necessary expenses (rent, groceries, childcare)
  notes?: string; // Optional user notes
}

/**
 * Expense category with line items
 */
export interface ExpenseCategory {
  id: string; // Unique identifier
  name: string; // Icelandic display name (e.g., "Húsnæði")
  icon: string; // Emoji icon for display
  lineItems: LineItem[]; // Expense line items in this category
  isCustom: boolean; // User-created category
  isHidden: boolean; // Hidden from display
  order: number; // Display order
}

/**
 * Complete current expense report
 */
export interface CurrentExpenseReport {
  categories: ExpenseCategory[]; // All expense categories
  lastUpdated: Date; // Last modification timestamp
  version: number; // Schema version for migrations
}

/**
 * Category breakdown with calculations
 */
export interface CategoryBreakdown {
  categoryId: string; // Category identifier
  categoryName: string; // Display name
  categoryIcon: string; // Emoji icon
  total: number; // Total ISK for this category
  percentage: number; // Percentage of total expenses
  lifeEnergyHours: number | null; // Work hours equivalent (null if no AWH)
  lineItemCount: number; // Number of line items
}

/**
 * Line item summary for top expenses list
 */
export interface LineItemSummary {
  categoryId: string; // Parent category ID
  categoryName: string; // Category display name
  lineItemId: string; // Line item ID
  label: string; // Line item description
  amount: number; // Amount in ISK
  lifeEnergyHours: number | null; // Work hours equivalent (null if no AWH)
  isRecurring: boolean; // Whether this is a recurring expense
  isEssential: boolean; // Whether this is an essential expense
}

/**
 * Life energy breakdown across expenses
 */
export interface LifeEnergyBreakdown {
  totalMonthlyHours: number; // Total monthly hours
  totalAnnualHours: number; // Total annual hours
  categoryHours: Record<string, number>; // Hours per category (categoryId -> hours)
  lineItemHours: Record<string, number>; // Hours per line item (lineItemId -> hours)
}

/**
 * Baseline comparison data
 */
export interface BaselineComparisonData {
  closestTier: 'barebones' | 'comfortable' | 'deluxe'; // Which tier matches best
  currentTotal: number; // Current total monthly expenses
  tierTotal: number; // Closest tier total
  difference: number; // ISK difference from tier
  differencePercentage: number; // Percentage difference
  categoryComparisons: CategoryComparison[]; // Per-category comparisons
}

/**
 * Category comparison against baseline
 */
export interface CategoryComparison {
  categoryId: string; // Category identifier
  categoryName: string; // Display name
  currentAmount: number; // Current spending in ISK
  baselineAmount: number; // Baseline amount for matched tier
  difference: number; // ISK difference
  status: 'over' | 'under' | 'match'; // Over/under/within 10%
}

/**
 * Smart recommendation
 */
export interface Recommendation {
  id: string; // Unique identifier
  type: 'subscription' | 'commute' | 'housing' | 'baseline' | 'essential' | 'dining' | 'convenience'; // Recommendation type
  title: string; // Icelandic title
  message: string; // Icelandic message
  actionUrl?: string; // URL to relevant calculator (optional)
  actionLabel?: string; // Icelandic action button label (optional)
  priority: 'high' | 'medium' | 'low'; // Priority level
  dismissable: boolean; // Whether user can dismiss
}

/**
 * Essential vs Non-Essential breakdown
 */
export interface EssentialBreakdown {
  essentialMonthly: number; // Essential expenses per month
  nonEssentialMonthly: number; // Non-essential (discretionary) expenses per month
  essentialPercentage: number; // Percentage that is essential
  nonEssentialPercentage: number; // Percentage that is discretionary
  essentialLifeEnergy: number | null; // Work hours for essentials
  nonEssentialLifeEnergy: number | null; // Work hours for non-essentials
}

/**
 * Complete calculation results
 */
export interface CurrentExpenseResults {
  totalMonthly: number; // Total monthly expenses in ISK
  totalAnnual: number; // Total annual expenses in ISK
  categoryBreakdown: CategoryBreakdown[]; // Breakdown by category
  topExpenses: LineItemSummary[]; // Top expenses (default: 10)
  lifeEnergy: LifeEnergyBreakdown | null; // Life energy data (null if no AWH)
  essentialBreakdown: EssentialBreakdown; // Essential vs non-essential split
  recommendations: Recommendation[]; // Smart recommendations
  baselineComparison: BaselineComparisonData | null; // Baseline comparison (null if no baseline)
}

/**
 * Expense category configuration template
 */
export interface ExpenseCategoryConfig {
  id: string; // Category identifier
  name: string; // Icelandic display name
  icon: string; // Emoji icon
  suggestedLineItems: string[]; // Pre-populated line item labels
  order: number; // Display order
}
