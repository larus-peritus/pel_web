/**
 * TypeScript types for Additional Income Impact Calculator
 * Feature 2.3.3: Aukatekjur og aukavinna
 */

/**
 * New expenses incurred from additional work
 * All values are annual (ISK per year)
 */
export interface NewExpenses {
  transportation: number; // Extra commute/travel costs
  equipment: number; // Tools, software, supplies needed
  meals: number; // Extra meals/coffee while doing additional work
  childcare: number; // Extra childcare costs
  other: number; // Other work-related expenses
}

/**
 * Additional non-billable time required for additional work
 * All values are weekly hours
 */
export interface AdditionalTime {
  commuteHours: number; // Weekly commute time for additional work
  preparationHours: number; // Setup, admin, invoicing, etc.
  recoveryHours: number; // Extra recovery time needed
}

/**
 * Tax bracket selection options
 */
export type TaxBracketSelection = 'low' | 'mid' | 'high';

/**
 * Inputs for additional income calculator
 */
export interface AdditionalIncomeInputs {
  grossHourlyRate: number; // Gross hourly rate for additional work (ISK/hour)
  hoursPerWeek: number; // Hours per week on additional work
  weeksPerYear: number; // Weeks per year (default 50)
  newExpenses: NewExpenses; // New expenses from this work
  additionalTime: AdditionalTime; // Non-billable time
  currentAnnualIncome: number; // Current annual income (for reference only)
  considerTax: boolean; // Whether to apply marginal tax to the additional income
  selectedTaxBracket: TaxBracketSelection; // User-selected tax bracket
}

/**
 * Recommendation levels based on comparison to actual wage
 */
export type RecommendationLevel = 'excellent' | 'good' | 'modest' | 'poor' | 'negative';

/**
 * Results from additional income calculation
 */
export interface AdditionalIncomeResults {
  // Income
  grossAnnualIncome: number; // Gross income from additional work
  grossMonthlyIncome: number; // Gross monthly income (yearly / 12)
  marginalTaxRate: number; // Marginal tax rate (percentage)
  marginalTax: number; // Total marginal tax paid (ISK/year)
  totalNewExpenses: number; // Sum of all new expenses (ISK/year)
  netAnnualIncome: number; // Net income after tax and expenses
  netMonthlyIncome: number; // Net monthly income (yearly / 12)

  // Time accounting
  billableHoursPerYear: number; // Actual working hours
  totalHoursPerYear: number; // billable + additional time
  hoursPerWeek: number; // Total hours per week (for display)

  // Net rate for additional work only
  netHourlyRate: number; // Net income / total hours for this work

  // Combined average calculation
  combinedAverageHourlyWage: number; // Average hourly wage with both jobs combined
  averageWageChange: number; // How much the average changes (+/-)
  averageWageChangePercent: number; // Percentage change in average wage

  // Comparison to actual wage
  comparisonToActualWage: number; // Difference from main job (ISK/hour)
  percentageDifference: number; // Percentage difference

  // Recommendation
  recommendation: RecommendationLevel;

  // Tax info
  taxApplied: boolean; // Whether tax was applied
  selectedTaxRate: number; // The tax rate applied

  // Time and money summary
  extraHoursPerWeek: number; // Additional hours per week
  extraHoursPerYear: number; // Additional hours per year
}

/**
 * Tax bracket for Icelandic tax system
 */
export interface TaxBracket {
  min: number; // Minimum income in bracket (ISK)
  max: number | null; // Maximum income (null = infinite)
  rate: number; // Tax rate (percentage)
}

/**
 * Marginal tax calculation results
 */
export interface MarginalTaxResult {
  marginalTax: number; // Tax on additional income
  marginalRate: number; // Effective marginal rate (percentage)
  currentTax: number; // Tax on current income
  newTotalTax: number; // Total tax with additional income
  bracketJump: boolean; // Whether additional income causes bracket jump
}
