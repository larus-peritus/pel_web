/**
 * TypeScript types for the FI Number Builder (FI-tala reiknivél)
 *
 * The FI Number Builder calculates the target nest egg needed for Financial Independence
 * by multiplying annual expenses by a withdrawal rate multiplier (25x, 30x, 33x, or custom).
 *
 * Key concepts:
 * - FI Number = Annual Expenses × Multiplier
 * - Multiplier = 1 / Withdrawal Rate (e.g., 30x = 3.33% withdrawal rate)
 * - Icelandic context: 30x-33x recommended vs US standard 25x (4% rule)
 * - Pension integration: Reduces FI number when lífeyrissjóður income available
 * - Bridge amount: Extra funds needed for early retirement before pension age (67)
 *
 * Based on "Your Money or Your Life" and Trinity Study principles,
 * adapted for Icelandic inflation and pension system.
 */

import type { ExpenseTier } from './expenseBaseline';

/**
 * Expense source type - baseline from expense baseline tool or custom input
 */
export type ExpenseSource = 'baseline' | 'custom';

/**
 * Standard FI multipliers representing different withdrawal rates
 *
 * - 25x = 4.0% withdrawal (US standard, aggressive for Iceland)
 * - 30x = 3.33% withdrawal (recommended for Iceland)
 * - 33x = 3.0% withdrawal (conservative)
 */
export type StandardMultiplier = 25 | 30 | 33;

/**
 * FI Number Builder state
 *
 * Stores user configuration for calculating their FI number.
 * This state is persisted to localStorage and managed by CalculatorContext.
 */
export interface FINumberBuilderState {
  // Expense source configuration
  expenseSource: ExpenseSource; // 'baseline' or 'custom'
  selectedTier: ExpenseTier | null; // Which tier if using baseline ('barebones' | 'comfortable' | 'deluxe')
  customMonthlyExpense: number | null; // Monthly expense amount if using custom (ISK)

  // Multiplier configuration
  multiplier: number; // Current multiplier (25, 30, 33, or custom value 20-50)
  customMultiplier: number | null; // Custom multiplier if not using standard

  // Pension configuration (optional)
  pensionMonthlyIncome: number | null; // Expected monthly pension at age 67 (ISK)
  targetRetirementAge: number | null; // Desired retirement age (40-80)

  // Iceland three-phase planning (optional)
  occupationalPension: number | null; // Expected monthly occupational pension (lífeyrissjóður) at age 67 (ISK)
  sereignBalance: number | null; // Expected séreign balance at age 60 (ISK)

  // Metadata
  lastUpdated: Date; // Last update timestamp
}

/**
 * Scenario result for tier comparison
 *
 * Shows FI number calculation for one expense tier, including
 * difference from the selected tier for comparison purposes.
 */
export interface ScenarioResult {
  tier: ExpenseTier; // Which tier this scenario represents
  monthlyExpenses: number; // Monthly expenses for this tier (ISK)
  annualExpenses: number; // Annual expenses (monthlyExpenses × 12)
  fiNumber: number; // FI number (annualExpenses × multiplier)
  difference?: {
    // Difference from selected tier (undefined if this IS the selected tier)
    isk: number; // ISK difference from selected tier's FI number
    percentage: number; // Percentage difference from selected tier's FI number
  };
}

/**
 * Pension-adjusted FI calculation result
 *
 * When pension income is entered, this shows:
 * - Full FI number (without pension)
 * - Pension-adjusted FI number (reduced by pension income)
 * - Bridge amount (funds needed from retirement age to pension start at 67)
 * - Total needed (bridge + pension-adjusted FI)
 */
export interface PensionAdjustedResult {
  pensionMonthlyIncome: number; // Monthly pension amount (ISK)
  pensionAnnualIncome: number; // Annual pension (monthly × 12)
  reducedAnnualExpenses: number; // Annual expenses after subtracting pension
  pensionAdjustedFI: number; // FI number for reduced expenses
  targetRetirementAge: number; // Desired retirement age
  pensionStartAge: number; // When pension starts (default: 67)
  bridgeYears: number; // Years between retirement and pension start
  bridgeAmount: number; // Funds needed for bridge period
  totalNeeded: number; // Total needed (bridge + pension-adjusted FI)
}

/**
 * Life energy metrics for FI number
 *
 * Converts FI number to years of work based on actual hourly wage.
 * Shows both how many years it represents and (if savings data available)
 * how many years remain to reach FI.
 */
export interface FINumberLifeEnergy {
  actualHourlyWage: number; // User's actual hourly wage (ISK/hour)
  annualNetIncome: number; // Annual net income (AWH × annual hours)
  yearsOfWork: number; // FI number ÷ annual net income
  yearsToFI?: number; // Years remaining to reach FI (if savings rate available)
}

/**
 * Complete FI Number calculation results
 *
 * Contains all calculated values derived from the FI number builder state:
 * - Basic FI calculation
 * - Pension adjustments (if applicable)
 * - Life energy metrics (if AWH available)
 * - Scenario comparison (if using baseline)
 */
export interface FINumberResults {
  // Basic FI calculation
  monthlyExpenses: number; // Monthly expenses used (ISK)
  annualExpenses: number; // Annual expenses (monthly × 12)
  multiplier: number; // Multiplier used (25, 30, 33, or custom)
  withdrawalRate: number; // Withdrawal rate (1 / multiplier, e.g., 0.0333 for 30x)
  fiNumber: number; // FI number (annual expenses × multiplier)

  // Pension adjustments (if applicable)
  hasPension: boolean; // Whether pension income was entered
  pensionAdjusted?: PensionAdjustedResult; // Pension-adjusted calculations

  // Life energy (if AWH available)
  lifeEnergy?: FINumberLifeEnergy; // Life energy metrics

  // Scenario comparison (if using baseline)
  scenarios?: {
    barebones: ScenarioResult;
    comfortable: ScenarioResult;
    deluxe: ScenarioResult;
  };
}

/**
 * Scenario comparison result
 *
 * Contains FI numbers for all three expense tiers for comparison.
 */
export interface ScenarioComparisonResult {
  barebones: ScenarioResult;
  comfortable: ScenarioResult;
  deluxe: ScenarioResult;
}

/**
 * Pension estimate for calculating pension-adjusted FI
 *
 * Used to estimate typical Icelandic pension income based on
 * final salary or work history.
 */
export interface PensionEstimate {
  finalSalaryMonthly?: number; // Final monthly salary before retirement (ISK)
  yearsOfWork?: number; // Total years contributing to pension fund
  estimatedPensionMonthly: number; // Estimated monthly pension at age 67 (ISK)
  confidenceLevel: 'low' | 'medium' | 'high'; // Confidence in estimate
}
