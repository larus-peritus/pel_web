/**
 * Additional Income Impact Calculations
 * Feature 2.3.3: Aukatekjur og aukavinna
 *
 * Calculates net hourly rate from additional work after marginal taxes and expenses.
 */

import type {
  AdditionalIncomeInputs,
  AdditionalIncomeResults,
  MarginalTaxResult,
  TaxBracket,
  RecommendationLevel,
  TaxBracketSelection,
} from '@/types/additionalIncome';

/**
 * Icelandic Tax Brackets (2026)
 * Source: Skatturinn (RSK)
 * https://www.skatturinn.is/einstaklingar/stadgreidsla/stadgreidsla/2026
 *
 * Monthly brackets × 12 = yearly brackets
 * These include income tax + average municipal tax (útsvar ~14.94%)
 */
export const ICELANDIC_TAX_BRACKETS_2026: TaxBracket[] = [
  { min: 0, max: 5977464, rate: 31.49 }, // 0 - 498,122 kr/month
  { min: 5977465, max: 16781400, rate: 37.99 }, // 498,123 - 1,398,450 kr/month
  { min: 16781401, max: null, rate: 46.29 }, // Over 1,398,450 kr/month
];

// Monthly thresholds for UI display
export const TAX_BRACKET_THRESHOLDS_MONTHLY = {
  bracket1Max: 498122,
  bracket2Max: 1398450,
};

// For backwards compatibility
export const ICELANDIC_TAX_BRACKETS = ICELANDIC_TAX_BRACKETS_2026;

/**
 * Tax rates by bracket selection
 */
export const TAX_RATES_BY_BRACKET: Record<TaxBracketSelection, number> = {
  low: 31.49,
  mid: 37.99,
  high: 46.29,
};

/**
 * Get tax rate from bracket selection
 */
export function getTaxRateFromSelection(bracket: TaxBracketSelection): number {
  return TAX_RATES_BY_BRACKET[bracket];
}

/**
 * Calculate total Icelandic tax on income using progressive brackets
 */
export function calculateIcelandicTax(income: number): number {
  if (income <= 0) return 0;

  let totalTax = 0;
  let remainingIncome = income;

  for (const bracket of ICELANDIC_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max ?? Infinity;
    const bracketSize = bracketMax - bracketMin;

    // How much income falls in this bracket?
    const incomeInBracket = Math.min(remainingIncome, bracketSize);

    // Calculate tax for this bracket
    const taxInBracket = incomeInBracket * (bracket.rate / 100);
    totalTax += taxInBracket;

    remainingIncome -= incomeInBracket;
  }

  return Math.round(totalTax);
}

/**
 * Get the tax bracket for a given income level
 */
export function getTaxBracket(income: number): TaxBracket {
  for (const bracket of ICELANDIC_TAX_BRACKETS) {
    if (income >= bracket.min && (bracket.max === null || income <= bracket.max)) {
      return bracket;
    }
  }
  // Fallback to highest bracket
  return ICELANDIC_TAX_BRACKETS[ICELANDIC_TAX_BRACKETS.length - 1];
}

/**
 * Calculate marginal tax on additional income
 *
 * This calculates the tax you pay on ADDITIONAL income on top of current income.
 * The marginal rate may be higher than the average rate if you jump tax brackets.
 */
export function calculateMarginalTax(
  currentIncome: number,
  additionalIncome: number
): MarginalTaxResult {
  if (currentIncome < 0 || additionalIncome <= 0) {
    return {
      marginalTax: 0,
      marginalRate: 0,
      currentTax: 0,
      newTotalTax: 0,
      bracketJump: false,
    };
  }

  const currentTax = calculateIcelandicTax(currentIncome);
  const newTotalIncome = currentIncome + additionalIncome;
  const newTotalTax = calculateIcelandicTax(newTotalIncome);

  const marginalTax = newTotalTax - currentTax;
  const marginalRate = (marginalTax / additionalIncome) * 100;

  // Check if we jumped brackets
  const currentBracket = getTaxBracket(currentIncome);
  const newBracket = getTaxBracket(newTotalIncome);
  const bracketJump = currentBracket.rate !== newBracket.rate;

  return {
    marginalTax: Math.round(marginalTax),
    marginalRate: Math.round(marginalRate * 100) / 100,
    currentTax: Math.round(currentTax),
    newTotalTax: Math.round(newTotalTax),
    bracketJump,
  };
}

/**
 * Generate recommendation based on net rate comparison to actual wage
 */
export function generateRecommendation(
  netHourlyRate: number,
  actualWage: number
): RecommendationLevel {
  if (netHourlyRate <= 0) return 'negative';

  const difference = ((netHourlyRate - actualWage) / actualWage) * 100;

  if (difference > 50) return 'excellent';
  if (difference >= 15) return 'good';
  if (difference >= -15) return 'modest';
  if (difference >= -50) return 'poor';
  return 'negative';
}

/**
 * Calculate net hourly rate from additional income
 *
 * Takes into account:
 * - Tax at user-selected bracket rate (if considerTax is true)
 * - New expenses incurred by additional work
 * - Additional non-billable time (commute, prep, recovery)
 *
 * Returns net hourly rate and combined average calculations.
 */
export function calculateAdditionalIncomeResults(
  inputs: AdditionalIncomeInputs,
  actualHourlyWage: number,
  mainJobAnnualHours?: number // Optional: hours from main job for combined calculation
): AdditionalIncomeResults {
  // Calculate gross annual income from additional work
  const billableHoursPerYear = inputs.hoursPerWeek * inputs.weeksPerYear;
  const grossAnnualIncome = inputs.grossHourlyRate * billableHoursPerYear;
  const grossMonthlyIncome = grossAnnualIncome / 12;

  // Calculate tax based on user-selected bracket
  let marginalTax = 0;
  let marginalTaxRate = 0;

  if (inputs.considerTax) {
    marginalTaxRate = getTaxRateFromSelection(inputs.selectedTaxBracket);
    marginalTax = Math.round(grossAnnualIncome * (marginalTaxRate / 100));
  }

  // Sum new expenses
  const totalNewExpenses =
    inputs.newExpenses.transportation +
    inputs.newExpenses.equipment +
    inputs.newExpenses.meals +
    inputs.newExpenses.childcare +
    inputs.newExpenses.other;

  // Calculate net annual income (after tax and expenses)
  const netAnnualIncome = grossAnnualIncome - marginalTax - totalNewExpenses;
  const netMonthlyIncome = netAnnualIncome / 12;

  // Calculate total time investment (billable + additional unpaid time)
  const additionalHoursPerWeek =
    inputs.additionalTime.commuteHours +
    inputs.additionalTime.preparationHours +
    inputs.additionalTime.recoveryHours;
  const totalHoursPerWeek = inputs.hoursPerWeek + additionalHoursPerWeek;
  const totalHoursPerYear = totalHoursPerWeek * inputs.weeksPerYear;

  // Calculate net hourly rate for additional work only
  const netHourlyRate = totalHoursPerYear > 0 ? netAnnualIncome / totalHoursPerYear : 0;

  // Calculate combined average hourly wage
  // Use main job hours from context or estimate from annual income and actual wage
  const estimatedMainJobHours = mainJobAnnualHours ||
    (actualHourlyWage > 0 ? inputs.currentAnnualIncome / actualHourlyWage : 2000);

  const totalCombinedIncome = inputs.currentAnnualIncome + netAnnualIncome;
  const totalCombinedHours = estimatedMainJobHours + totalHoursPerYear;

  const combinedAverageHourlyWage = totalCombinedHours > 0
    ? totalCombinedIncome / totalCombinedHours
    : 0;

  const averageWageChange = combinedAverageHourlyWage - actualHourlyWage;
  const averageWageChangePercent = actualHourlyWage > 0
    ? (averageWageChange / actualHourlyWage) * 100
    : 0;

  // Compare additional work rate to main job rate
  const comparisonToActualWage = netHourlyRate - actualHourlyWage;
  const percentageDifference =
    actualHourlyWage > 0 ? (comparisonToActualWage / actualHourlyWage) * 100 : 0;

  // Generate recommendation based on how additional work affects average
  const recommendation = generateRecommendation(netHourlyRate, actualHourlyWage);

  return {
    grossAnnualIncome: Math.round(grossAnnualIncome),
    grossMonthlyIncome: Math.round(grossMonthlyIncome),
    marginalTaxRate,
    marginalTax,
    totalNewExpenses: Math.round(totalNewExpenses),
    netAnnualIncome: Math.round(netAnnualIncome),
    netMonthlyIncome: Math.round(netMonthlyIncome),
    billableHoursPerYear: Math.round(billableHoursPerYear),
    totalHoursPerYear: Math.round(totalHoursPerYear),
    hoursPerWeek: totalHoursPerWeek,
    netHourlyRate: Math.round(netHourlyRate),
    combinedAverageHourlyWage: Math.round(combinedAverageHourlyWage),
    averageWageChange: Math.round(averageWageChange),
    averageWageChangePercent: Math.round(averageWageChangePercent * 10) / 10,
    comparisonToActualWage: Math.round(comparisonToActualWage),
    percentageDifference: Math.round(percentageDifference * 100) / 100,
    recommendation,
    taxApplied: inputs.considerTax,
    selectedTaxRate: marginalTaxRate,
    extraHoursPerWeek: totalHoursPerWeek,
    extraHoursPerYear: Math.round(totalHoursPerYear),
  };
}
