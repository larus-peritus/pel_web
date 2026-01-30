/**
 * FI Number Builder - Core Calculations
 *
 * Implements calculations for Financial Independence (FI) number based on
 * the "Your Money or Your Life" philosophy and Trinity Study principles,
 * adapted for Iceland's higher inflation and lífeyrissjóður (pension) system.
 *
 * Key concepts:
 * - FI Number = Annual Expenses × Multiplier
 * - Multiplier = 1 / Withdrawal Rate (e.g., 30x = 3.33% withdrawal)
 * - Iceland recommendation: 30x-33x (more conservative than US 25x)
 * - Pension adjustment: Reduces FI number when lífeyrissjóður income available
 * - Bridge amount: Extra funds needed before pension starts at age 67
 */

import type {
  FINumberBuilderState,
  FINumberResults,
  PensionAdjustedResult,
  FINumberLifeEnergy,
  ScenarioResult,
  ScenarioComparisonResult,
  ExpenseSource,
} from '@/types/fiNumber';
import type { ExpenseTier, ExpenseBaseline } from '@/types/expenseBaseline';
import {
  PENSION_START_AGE,
  CALCULATION_DEFAULTS,
} from '@/lib/constants/fiNumber';
import { getExpenseByTier as getExpenseByTierHelper } from '@/lib/calculations/expenseBaseline';

/**
 * Calculate basic FI number
 *
 * Formula: FI Number = Annual Expenses × Multiplier
 *
 * @param annualExpenses - Annual expenses in ISK
 * @param multiplier - FI multiplier (25, 30, 33, or custom 20-50)
 * @returns FI number in ISK
 *
 * @example
 * calculateFINumber(6_000_000, 30) // => 180_000_000
 */
export function calculateFINumber(
  annualExpenses: number,
  multiplier: number
): number {
  // Edge case: Zero or negative expenses
  if (annualExpenses <= 0) {
    return 0;
  }

  // Edge case: Invalid multiplier
  if (multiplier <= 0) {
    return 0;
  }

  return annualExpenses * multiplier;
}

/**
 * Calculate withdrawal rate from multiplier
 *
 * Formula: Withdrawal Rate = 1 / Multiplier
 *
 * @param multiplier - FI multiplier (25, 30, 33, or custom)
 * @returns Withdrawal rate as decimal (e.g., 0.0333 for 30x)
 *
 * @example
 * calculateWithdrawalRate(30) // => 0.0333
 * calculateWithdrawalRate(25) // => 0.04
 */
export function calculateWithdrawalRate(multiplier: number): number {
  // Edge case: Zero multiplier
  if (multiplier === 0) {
    return 0;
  }

  return 1 / multiplier;
}

/**
 * Get monthly expenses from expense source
 *
 * Retrieves monthly expenses from either the expense baseline (selected tier)
 * or custom input amount.
 *
 * @param expenseSource - Source type ('baseline' or 'custom')
 * @param customExpense - Custom monthly expense amount (if using custom source)
 * @param expenseBaseline - Expense baseline data (if using baseline source)
 * @param selectedTier - Selected expense tier (if using baseline source)
 * @returns Monthly expenses in ISK
 */
export function getMonthlyExpenses(
  expenseSource: ExpenseSource,
  customExpense: number | null,
  expenseBaseline: ExpenseBaseline | null,
  selectedTier: ExpenseTier | null
): number {
  // Custom expense source
  if (expenseSource === 'custom' && customExpense !== null) {
    return customExpense;
  }

  // Baseline expense source
  if (expenseSource === 'baseline' && expenseBaseline && selectedTier) {
    // Use expense baseline API to get expense for tier
    return getExpenseByTierHelper(expenseBaseline, selectedTier);
  }

  // No valid expense source
  return 0;
}

/**
 * Calculate pension-adjusted FI number
 *
 * When user has expected pension income (lífeyrissjóður), this reduces
 * the required FI number because pension will cover part of expenses
 * after age 67.
 *
 * Calculates:
 * - Reduced annual expenses (after pension income)
 * - Pension-adjusted FI number (for reduced expenses)
 * - Bridge amount (if retiring before pension age)
 * - Total needed (bridge + pension-adjusted FI)
 *
 * @param annualExpenses - Full annual expenses without pension (ISK)
 * @param multiplier - FI multiplier (25, 30, 33, or custom)
 * @param pensionMonthlyIncome - Expected monthly pension at age 67 (ISK)
 * @param targetRetirementAge - Desired retirement age
 * @param pensionStartAge - When pension starts (default: 67)
 * @returns Pension-adjusted calculation results
 *
 * @example
 * calculatePensionAdjustedFI(6_000_000, 30, 200_000, 55)
 * // => {
 * //   pensionMonthlyIncome: 200_000,
 * //   pensionAnnualIncome: 2_400_000,
 * //   reducedAnnualExpenses: 3_600_000,
 * //   pensionAdjustedFI: 108_000_000,
 * //   targetRetirementAge: 55,
 * //   pensionStartAge: 67,
 * //   bridgeYears: 12,
 * //   bridgeAmount: 72_000_000,
 * //   totalNeeded: 180_000_000
 * // }
 */
export function calculatePensionAdjustedFI(
  annualExpenses: number,
  multiplier: number,
  pensionMonthlyIncome: number,
  targetRetirementAge: number,
  pensionStartAge: number = PENSION_START_AGE
): PensionAdjustedResult {
  // Calculate annual pension income
  const pensionAnnualIncome = pensionMonthlyIncome * CALCULATION_DEFAULTS.MONTHS_PER_YEAR;

  // Calculate reduced annual expenses (after pension covers part)
  // Ensure it doesn't go negative
  const reducedAnnualExpenses = Math.max(0, annualExpenses - pensionAnnualIncome);

  // Calculate FI number for reduced expenses
  const pensionAdjustedFI = calculateFINumber(reducedAnnualExpenses, multiplier);

  // Calculate bridge years (years before pension starts)
  // If retiring at or after pension age, no bridge needed
  const bridgeYears = Math.max(0, pensionStartAge - targetRetirementAge);

  // Calculate bridge amount (full expenses for bridge period)
  // During bridge years, pension doesn't cover expenses yet
  const bridgeAmount = bridgeYears * annualExpenses;

  // Total needed = bridge funds + pension-adjusted FI
  const totalNeeded = bridgeAmount + pensionAdjustedFI;

  return {
    pensionMonthlyIncome,
    pensionAnnualIncome,
    reducedAnnualExpenses,
    pensionAdjustedFI,
    targetRetirementAge,
    pensionStartAge,
    bridgeYears,
    bridgeAmount,
    totalNeeded,
  };
}

/**
 * Calculate bridge amount only
 *
 * Convenience function to calculate just the bridge amount needed
 * from early retirement age to pension start age.
 *
 * @param annualExpenses - Annual expenses during bridge period (ISK)
 * @param targetRetirementAge - Desired retirement age
 * @param pensionStartAge - When pension starts (default: 67)
 * @returns Bridge amount in ISK
 *
 * @example
 * calculateBridgeAmount(6_000_000, 55, 67) // => 72_000_000
 * calculateBridgeAmount(6_000_000, 70, 67) // => 0 (no bridge needed)
 */
export function calculateBridgeAmount(
  annualExpenses: number,
  targetRetirementAge: number,
  pensionStartAge: number = PENSION_START_AGE
): number {
  const bridgeYears = Math.max(0, pensionStartAge - targetRetirementAge);
  return bridgeYears * annualExpenses;
}

/**
 * Calculate life energy metrics for FI number
 *
 * Converts FI number to years of work based on actual hourly wage,
 * implementing the "Your Money or Your Life" life energy philosophy.
 *
 * @param fiNumber - FI number in ISK
 * @param actualHourlyWage - Actual hourly wage in ISK/hour
 * @param annualHours - Annual work hours (default: 2080 = 40h/week × 52 weeks)
 * @param currentSavings - Current savings (optional, for years-to-FI calculation)
 * @param annualSavings - Annual savings amount (optional, for years-to-FI calculation)
 * @returns Life energy metrics
 *
 * @example
 * calculateFINumberLifeEnergy(180_000_000, 5_000, 2080)
 * // => {
 * //   actualHourlyWage: 5_000,
 * //   annualNetIncome: 10_400_000,
 * //   yearsOfWork: 17.3,
 * //   yearsToFI: undefined
 * // }
 */
export function calculateFINumberLifeEnergy(
  fiNumber: number,
  actualHourlyWage: number,
  annualHours: number = 2080,
  currentSavings: number = 0,
  annualSavings: number = 0
): FINumberLifeEnergy {
  // Calculate annual net income
  const annualNetIncome = actualHourlyWage * annualHours;

  // Calculate years of work the FI number represents
  // Edge case: Handle zero or negative income
  const yearsOfWork = annualNetIncome > 0 ? fiNumber / annualNetIncome : 0;

  // Calculate years to FI (if savings rate available)
  let yearsToFI: number | undefined;
  if (annualSavings > 0) {
    const remainingNeeded = Math.max(0, fiNumber - currentSavings);
    yearsToFI = remainingNeeded / annualSavings;
  }

  return {
    actualHourlyWage,
    annualNetIncome,
    yearsOfWork,
    yearsToFI,
  };
}

/**
 * Calculate scenario comparison across all three expense tiers
 *
 * Compares FI numbers for barebones, comfortable, and deluxe expense tiers
 * using the same multiplier, showing differences from selected tier.
 *
 * @param expenseBaseline - Expense baseline data with all three tiers
 * @param multiplier - FI multiplier to use for all scenarios
 * @param selectedTier - Currently selected tier for difference calculation
 * @returns Scenario comparison results for all three tiers
 *
 * @example
 * calculateScenarioComparison(baseline, 30, 'comfortable')
 * // => {
 * //   barebones: { tier: 'barebones', fiNumber: 90_000_000, ... },
 * //   comfortable: { tier: 'comfortable', fiNumber: 180_000_000, ... },
 * //   deluxe: { tier: 'deluxe', fiNumber: 360_000_000, ... }
 * // }
 */
export function calculateScenarioComparison(
  expenseBaseline: ExpenseBaseline,
  multiplier: number,
  selectedTier: ExpenseTier
): ScenarioComparisonResult {
  const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

  // Calculate selected tier's FI number for comparison
  const selectedMonthlyExpenses = getExpenseByTierHelper(expenseBaseline, selectedTier);
  const selectedAnnualExpenses = selectedMonthlyExpenses * CALCULATION_DEFAULTS.MONTHS_PER_YEAR;
  const selectedFI = calculateFINumber(selectedAnnualExpenses, multiplier);

  // Calculate for all tiers
  const scenarios: Record<ExpenseTier, ScenarioResult> = {} as any;

  for (const tier of tiers) {
    const monthlyExpenses = getExpenseByTierHelper(expenseBaseline, tier);
    const annualExpenses = monthlyExpenses * CALCULATION_DEFAULTS.MONTHS_PER_YEAR;
    const fiNumber = calculateFINumber(annualExpenses, multiplier);

    // Calculate difference from selected tier
    const difference = tier === selectedTier
      ? undefined
      : {
          isk: fiNumber - selectedFI,
          percentage: selectedFI > 0 ? ((fiNumber - selectedFI) / selectedFI) * 100 : 0,
        };

    scenarios[tier] = {
      tier,
      monthlyExpenses,
      annualExpenses,
      fiNumber,
      difference,
    };
  }

  return {
    barebones: scenarios.barebones,
    comfortable: scenarios.comfortable,
    deluxe: scenarios.deluxe,
  };
}

/**
 * Calculate complete FI number results
 *
 * Master orchestration function that calculates all FI number metrics
 * from the current state, including:
 * - Basic FI number
 * - Pension adjustments (if applicable)
 * - Life energy metrics (if AWH available)
 * - Scenario comparison (if using baseline)
 *
 * @param state - FI number builder state
 * @param expenseBaseline - Expense baseline data (if available)
 * @param actualHourlyWage - Actual hourly wage (if available)
 * @param annualHours - Annual work hours (if available)
 * @returns Complete FI number calculation results
 *
 * @example
 * const results = calculateFINumberResults(state, baseline, 5000, 2080);
 * // => {
 * //   monthlyExpenses: 500_000,
 * //   annualExpenses: 6_000_000,
 * //   multiplier: 30,
 * //   withdrawalRate: 0.0333,
 * //   fiNumber: 180_000_000,
 * //   hasPension: false,
 * //   ... (plus optional pension, life energy, scenarios)
 * // }
 */
export function calculateFINumberResults(
  state: FINumberBuilderState,
  expenseBaseline: ExpenseBaseline | null,
  actualHourlyWage: number | null,
  annualHours: number | null
): FINumberResults {
  // 1. Get monthly expenses from source
  const monthlyExpenses = getMonthlyExpenses(
    state.expenseSource,
    state.customMonthlyExpense,
    expenseBaseline,
    state.selectedTier
  );

  // 2. Calculate annual expenses
  const annualExpenses = monthlyExpenses * CALCULATION_DEFAULTS.MONTHS_PER_YEAR;

  // 3. Get multiplier
  const multiplier = state.multiplier;

  // 4. Calculate withdrawal rate
  const withdrawalRate = calculateWithdrawalRate(multiplier);

  // 5. Calculate basic FI number
  const fiNumber = calculateFINumber(annualExpenses, multiplier);

  // 6. Build base results
  const results: FINumberResults = {
    monthlyExpenses,
    annualExpenses,
    multiplier,
    withdrawalRate,
    fiNumber,
    hasPension: false,
  };

  // 7. Add pension adjustment if applicable
  if (
    state.pensionMonthlyIncome &&
    state.pensionMonthlyIncome > 0 &&
    state.targetRetirementAge !== null
  ) {
    results.hasPension = true;
    results.pensionAdjusted = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      state.pensionMonthlyIncome,
      state.targetRetirementAge
    );
  }

  // 8. Add life energy metrics if AWH available
  if (actualHourlyWage && actualHourlyWage > 0 && annualHours && annualHours > 0) {
    results.lifeEnergy = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );
  }

  // 9. Add scenario comparison if using baseline
  if (
    state.expenseSource === 'baseline' &&
    expenseBaseline &&
    state.selectedTier
  ) {
    results.scenarios = calculateScenarioComparison(
      expenseBaseline,
      multiplier,
      state.selectedTier
    );
  }

  return results;
}
