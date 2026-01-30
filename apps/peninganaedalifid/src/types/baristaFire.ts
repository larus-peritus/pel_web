/**
 * TypeScript types for the Barista FIRE Planner
 *
 * Barista FIRE Strategy:
 * - Semi-retirement with part-time income covering expenses
 * - Existing savings grow to full FI without additional contributions
 * - Gap period: time working part-time until reaching full FI
 *
 * Icelandic Context:
 * - Universal healthcare (not tied to employment)
 * - Mandatory 16% pension contribution (12% employer + 4% employee)
 * - All income shown as NET after pension deduction
 */

/**
 * Expense tier from Expense Baseline Tool
 * Used to determine annual expenses for FI calculation
 */
export type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';

/**
 * Main Barista FIRE state
 * Stored in CalculatorContext and persisted to localStorage
 */
export interface BaristaFireState {
  // Current financial status
  currentSavings: number; // ISK - current investment/savings balance
  selectedTier: ExpenseTier | null; // from expense baseline tool
  customMonthlyExpense: number | null; // manual override if no baseline

  // Assumptions
  investmentReturnRate: number; // decimal (e.g., 0.05 = 5% annual return)
  fiMultiplier: number; // FI multiplier (25, 30, or 33) - default 25
  currentAge: number | null; // optional for age projections (18-100)

  // Scenarios
  scenarios: BaristaFireScenario[]; // max 5 scenarios

  // Metadata
  lastUpdated: string; // ISO 8601 timestamp
  version: number; // for migration handling
}

/**
 * Individual part-time income scenario
 * Each scenario represents a different work arrangement
 */
export interface BaristaFireScenario {
  id: string; // unique identifier (auto-generated)
  name: string; // user-defined name (e.g., "20 klst/viku", "Ráðgjöf")
  grossAnnualIncome: number; // ISK per year (before pension deduction)
  netAnnualIncome: number; // ISK per year (after 16% pension) - auto-calculated
  workHoursPerWeek: number | null; // optional user input
  order: number; // display order (0-4)
}

/**
 * Complete calculation results for Barista FIRE
 * Includes gap calculation and results for all scenarios
 */
export interface BaristaFireResults {
  // Gap calculation
  fiNumber: number; // Target FI amount (annual expenses × multiplier)
  fiMultiplier: number; // FI multiplier used (25, 30, or 33)
  currentSavings: number; // From state
  gap: number; // fiNumber - currentSavings (0 if Coast FIRE)
  isCoastFIRE: boolean; // true if gap <= 0

  // User info
  currentAge: number | null; // User's current age (for timeline display)

  // Expenses
  monthlyExpenses: number; // ISK per month
  annualExpenses: number; // ISK per year (monthlyExpenses × 12)

  // Scenario results
  scenarioResults: BaristaFireScenarioResult[]; // one per scenario

  // Coast FIRE baseline (income = expenses, no additional savings)
  coastFIRETimeline: TimelineProjection;
}

/**
 * Calculation results for a single scenario
 * Shows timeline, life energy, and comparison to Coast FIRE
 */
export interface BaristaFireScenarioResult {
  scenarioId: string; // matches BaristaFireScenario.id
  scenarioName: string; // display name

  // Income breakdown
  grossAnnualIncome: number; // ISK
  netAnnualIncome: number; // ISK (gross × 0.84)
  netMonthlyIncome: number; // ISK (netAnnual / 12)

  // Savings calculation
  monthlySavings: number; // ISK (net income - expenses) - can be negative!
  annualSavings: number; // ISK (monthlySavings × 12)
  savingsRate: number; // decimal (savings / net income)

  // Interest vs shortfall breakdown (for understanding the math)
  monthlyInterestAtStart: number; // ISK - interest income at current savings level
  netMonthlyChange: number; // ISK - interest + savings (positive = growing, negative = depleting)
  scenarioType: 'growing' | 'depleting' | 'sustainable'; // overall trajectory

  // Timeline
  yearsToFI: number; // whole years (Infinity if never reaches FI)
  monthsToFI: number; // remaining months (0-11)
  projectedFIAge: number | null; // if currentAge provided
  finalNestEgg: number; // projected balance at FI or at depletion/max years

  // Depletion info (if scenario leads to savings running out)
  willDeplete: boolean; // true if savings will eventually run out
  yearsToDepletion: number | null; // years until savings hit 0 (null if growing)
  ageAtDepletion: number | null; // age when savings run out (if currentAge provided)

  // Full timeline data for accurate charting
  timeline: TimelineProjection;

  // Life energy (if actualHourlyWage available)
  lifeEnergy?: {
    hoursPerWeek: number; // work hours needed per week
    hoursPerMonth: number; // work hours needed per month
    hoursPerYear: number; // work hours needed per year
    totalHoursOverGap: number; // total work hours over entire gap period
    percentageOfFullTime: number; // % compared to 40 hours/week
  };

  // Comparison to Coast FIRE
  accelerationFactor: number; // ratio vs Coast FIRE timeline
  compareToCoastFIRE: 'faster' | 'slower' | 'same'; // human-readable comparison
}

/**
 * Timeline projection showing path to full FI
 * Contains month-by-month data points
 */
export interface TimelineProjection {
  yearsToFI: number; // total years (fractional)
  monthsToFI: number; // total months (for display)
  dataPoints: TimelineDataPoint[]; // monthly snapshots
}

/**
 * Single data point in timeline
 * Used for chart visualization
 */
export interface TimelineDataPoint {
  year: number; // year offset from start (0, 1, 2...)
  month: number; // month within year (0-11)
  age: number | null; // projected age (if currentAge provided)
  savings: number; // ISK balance at this point
  additionalSavings: number; // ISK added this month from income
  investmentGrowth: number; // ISK gained from returns this month
}

/**
 * Barista FIRE constants
 * Default values and Icelandic pension rates
 */
export const BARISTA_FIRE_DEFAULTS = {
  investmentReturnRate: 0.05, // 5% real annual return
  pensionContributionRate: 0.16, // 16% total (12% employer + 4% employee)
  employerPensionRate: 0.12, // 12% employer contribution
  employeePensionRate: 0.04, // 4% employee contribution
  fullTimeHoursPerWeek: 40, // standard Icelandic work week
  maxScenarios: 5, // maximum number of scenarios
} as const;

/**
 * Scenario preset templates
 * Quick-start scenarios for common part-time arrangements
 */
export interface ScenarioPreset {
  name: string; // Icelandic name
  description: string; // Icelandic description
  hoursPerWeek: number; // typical hours for this arrangement
}

/**
 * Icelandic scenario presets
 */
export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    name: '20 klst/viku',
    description: 'Hálft starf',
    hoursPerWeek: 20,
  },
  {
    name: '30 klst/viku',
    description: '75% starf',
    hoursPerWeek: 30,
  },
  {
    name: 'Ráðgjöf/Freelance',
    description: 'Sveigjanleg vinna',
    hoursPerWeek: 25,
  },
];

/**
 * Validation result for Barista FIRE inputs
 */
export interface BaristaFireValidationResult {
  valid: boolean;
  errors: {
    currentSavings?: string;
    investmentReturnRate?: string;
    currentAge?: string;
    scenario?: Record<string, string>; // keyed by scenario ID
  };
  warnings: {
    currentSavings?: string;
    investmentReturnRate?: string;
    scenario?: Record<string, string>; // keyed by scenario ID
  };
}

/**
 * Barista FIRE scenario validation result
 */
export interface ScenarioValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    grossAnnualIncome?: string;
    workHoursPerWeek?: string;
  };
  warnings: {
    grossAnnualIncome?: string;
    workHoursPerWeek?: string;
  };
}
