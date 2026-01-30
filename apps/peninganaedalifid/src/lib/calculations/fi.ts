/**
 * FI (Financial Independence) calculation functions
 * Based on standard FIRE mathematics and compound interest formulas
 */

import type {
  FIInputs,
  FIResults,
  MarginalImpact,
  FICurveDataPoint,
} from '@/types/fi';
import { FI_CONSTANTS } from '@/lib/constants/fi';

/**
 * Calculate years to FI using logarithmic formula
 * Based on standard FIRE mathematics with compound growth
 *
 * Formula: Years = ln((FI × r / Savings) + 1) / ln(1 + r)
 * where r = return rate as decimal
 */
export function calculateYearsToFI(
  fiNumber: number,
  annualSavings: number,
  currentNetWorth: number,
  returnRate: number
): number {
  // Edge case: Already at FI
  if (currentNetWorth >= fiNumber) {
    return 0;
  }

  // Edge case: Zero or negative savings
  if (annualSavings <= 0) {
    return Infinity;
  }

  const r = returnRate / 100; // Convert percentage to decimal
  const gap = fiNumber - currentNetWorth;

  // Special case: Zero return rate (no investment returns)
  if (r === 0) {
    return gap / annualSavings;
  }

  // Standard formula with compound growth
  // Formula: Years = ln((FI × r / Savings) + 1) / ln(1 + r)
  const numerator = Math.log((fiNumber * r / annualSavings) + 1);
  const denominator = Math.log(1 + r);

  const years = numerator / denominator;

  // Sanity check: return Infinity for invalid or extreme values
  if (!isFinite(years) || years < 0 || years > 100) {
    return Infinity;
  }

  return years;
}

/**
 * Calculate FI date from years to FI
 */
export function calculateFIDate(yearsToFI: number): Date {
  if (!isFinite(yearsToFI)) {
    // Return very far future date for display
    return new Date(2100, 0, 1);
  }

  const now = new Date();
  const millisToAdd = yearsToFI * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + millisToAdd);
}

/**
 * Calculate savings rate from income and expenses
 */
export function calculateSavingsRate(
  annualIncome: number,
  annualExpenses: number
): number {
  if (annualIncome <= 0) {
    return 0;
  }

  const savingsRate = ((annualIncome - annualExpenses) / annualIncome) * 100;

  // Clamp to valid range (0-100%)
  return Math.max(0, Math.min(100, savingsRate));
}

/**
 * Calculate annual savings from income and savings rate
 */
export function calculateAnnualSavings(
  annualIncome: number,
  savingsRate: number
): number {
  return annualIncome * (savingsRate / 100);
}

/**
 * Calculate FI number from expenses and multiplier
 */
export function calculateFINumber(
  annualExpenses: number,
  fiMultiplier: number
): number {
  return annualExpenses * fiMultiplier;
}

/**
 * Calculate marginal impact of savings rate change
 *
 * Shows how much faster (or slower) you'll reach FI by changing your savings rate
 */
export function calculateMarginalImpact(
  inputs: FIInputs,
  currentYearsToFI: number,
  savingsRateChange: number,
  actualHourlyWage?: number
): MarginalImpact {
  // Calculate years to FI with adjusted savings rate
  const newSavingsRate = (inputs.currentSavingsRate || 0) + savingsRateChange;
  const newAnnualSavings = calculateAnnualSavings(inputs.annualIncome, newSavingsRate);

  const newYearsToFI = calculateYearsToFI(
    inputs.fiNumber,
    newAnnualSavings,
    inputs.currentNetWorth,
    inputs.expectedReturnRate
  );

  const yearsDifference = currentYearsToFI - newYearsToFI;
  const monthsDifference = yearsDifference * 12;

  // Calculate work hours impact (if wage provided)
  let workHours = 0;
  if (actualHourlyWage && actualHourlyWage > 0) {
    workHours = yearsDifference * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
  }

  return {
    months: monthsDifference,
    years: yearsDifference,
    workHours,
  };
}

/**
 * Calculate complete FI results
 *
 * This is the main calculation function that orchestrates all other calculations
 */
export function calculateFIResults(
  inputs: FIInputs,
  actualHourlyWage?: number,
  baselineResults?: FIResults
): FIResults {
  // Calculate savings rate if not provided
  const savingsRate =
    inputs.currentSavingsRate ||
    calculateSavingsRate(inputs.annualIncome, inputs.annualExpenses);

  const annualSavings = calculateAnnualSavings(inputs.annualIncome, savingsRate);
  const monthlyInvestment = annualSavings / 12;

  // Calculate years to FI
  const yearsToFI = calculateYearsToFI(
    inputs.fiNumber,
    annualSavings,
    inputs.currentNetWorth,
    inputs.expectedReturnRate
  );

  const monthsToFI = yearsToFI * 12;
  const fiDate = calculateFIDate(yearsToFI);

  // Calculate marginal impacts
  const impactPer1Percent = calculateMarginalImpact(
    inputs,
    yearsToFI,
    1,
    actualHourlyWage
  );
  const impactPer5Percent = calculateMarginalImpact(
    inputs,
    yearsToFI,
    5,
    actualHourlyWage
  );
  const impactPer10Percent = calculateMarginalImpact(
    inputs,
    yearsToFI,
    10,
    actualHourlyWage
  );

  // Calculate life energy totals
  const totalWorkHoursToFI = yearsToFI * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
  const totalWorkDaysToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_DAY;
  const totalWorkYearsToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_YEAR;

  // Calculate progress to FI
  const currentProgress =
    inputs.fiNumber > 0 ? (inputs.currentNetWorth / inputs.fiNumber) * 100 : 0;

  // Calculate change from baseline if provided
  let changeFromBaseline;
  if (baselineResults) {
    const monthsDiff = baselineResults.monthsToFI - monthsToFI;
    const yearsDiff = monthsDiff / 12;
    const percentageDiff =
      baselineResults.yearsToFI > 0
        ? (yearsDiff / baselineResults.yearsToFI) * 100
        : 0;

    changeFromBaseline = {
      months: monthsDiff,
      years: yearsDiff,
      percentage: percentageDiff,
    };
  }

  return {
    yearsToFI,
    fiDate,
    monthsToFI,
    impactPer1Percent,
    impactPer5Percent,
    impactPer10Percent,
    totalWorkHoursToFI,
    totalWorkDaysToFI,
    totalWorkYearsToFI,
    currentProgress,
    monthlyInvestment,
    annualInvestment: annualSavings,
    changeFromBaseline,
  };
}

/**
 * Generate FI curve data for visualization
 *
 * Creates data points showing the relationship between savings rate and years to FI
 */
export function generateFICurveData(
  inputs: FIInputs,
  currentSavingsRate: number,
  step: number = 5
): FICurveDataPoint[] {
  const dataPoints: FICurveDataPoint[] = [];

  for (let rate = 0; rate <= 100; rate += step) {
    const annualSavings = calculateAnnualSavings(inputs.annualIncome, rate);
    const yearsToFI = calculateYearsToFI(
      inputs.fiNumber,
      annualSavings,
      inputs.currentNetWorth,
      inputs.expectedReturnRate
    );

    // Cap at 40 years for chart display
    const displayYears = Math.min(yearsToFI, 40);

    dataPoints.push({
      savingsRate: rate,
      yearsToFI: isFinite(displayYears) ? displayYears : 40,
      monthsToFI: displayYears * 12,
      isCurrent: Math.abs(rate - currentSavingsRate) < step / 2,
      isReference: rate === 25 || rate === 50 || rate === 75,
    });
  }

  return dataPoints;
}
