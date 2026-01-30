/**
 * Automatic Savings Impact Calculator - Core Calculations
 *
 * Implements compound interest calculations for periodic savings to show
 * the long-term impact of automatic "pay yourself first" savings strategies.
 */

import type {
  SavingsInputs,
  SavingsResults,
  YearlyBreakdown,
  FrequencyKey,
} from '@/types/savings';
import { FREQUENCY_OPTIONS } from '@/lib/constants/savings';

/**
 * Calculate future value of periodic savings using compound interest
 *
 * Formula: FV = PMT × ((1 + r)^n - 1) / r
 * Special case: If r = 0, then FV = PMT × n
 *
 * @param payment - Payment amount per period
 * @param rate - Interest rate per period (decimal, e.g., 0.07/12 for 7% annual monthly)
 * @param periods - Number of payment periods
 * @returns Future value
 */
export function calculateFutureValue(
  payment: number,
  rate: number,
  periods: number
): number {
  // Edge case: No periods means no savings
  if (periods === 0) {
    return 0;
  }

  // Edge case: No payment means no savings
  if (payment === 0) {
    return 0;
  }

  // Edge case: No interest - simple multiplication
  if (rate === 0) {
    return payment * periods;
  }

  // Standard FV formula for ordinary annuity (payments at end of period)
  return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/**
 * Calculate yearly breakdown for charting
 *
 * @param paymentPerPeriod - Payment amount per period
 * @param ratePerPeriod - Interest rate per period (decimal)
 * @param timesPerYear - Number of periods per year
 * @param years - Total years
 * @param inflationRate - Optional annual inflation rate (%)
 * @returns Array of yearly breakdowns
 */
function calculateYearlyBreakdown(
  paymentPerPeriod: number,
  ratePerPeriod: number,
  timesPerYear: number,
  years: number,
  inflationRate?: number
): YearlyBreakdown[] {
  const breakdown: YearlyBreakdown[] = [];

  for (let year = 0; year <= years; year++) {
    const periods = year * timesPerYear;

    const fv = periods === 0
      ? 0
      : calculateFutureValue(paymentPerPeriod, ratePerPeriod, periods);

    const principal = paymentPerPeriod * periods;
    const growth = fv - principal;

    let realValue: number | undefined;
    if (inflationRate !== undefined && year > 0) {
      realValue = fv / Math.pow(1 + inflationRate / 100, year);
    }

    breakdown.push({
      year,
      principal,
      growth,
      futureValue: fv,
      realValue,
    });
  }

  return breakdown;
}

/**
 * Calculate complete savings results
 *
 * @param inputs - Savings inputs
 * @param actualHourlyWage - Optional actual hourly wage for life energy calculations
 * @param monthlyExpenses - Optional monthly expenses for freedom months calculation
 * @returns Complete savings results
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage?: number,
  monthlyExpenses?: number
): SavingsResults {
  // 1. Determine frequency
  const timesPerYear = inputs.frequency === 'custom'
    ? (inputs.customFrequency ?? 12)
    : FREQUENCY_OPTIONS.find(f => f.key === inputs.frequency)!.timesPerYear;

  // 2. Calculate per-period values
  const paymentPerPeriod = inputs.monthlyAmount * (12 / timesPerYear);
  const ratePerPeriod = inputs.returnRate / 100 / timesPerYear;
  const totalPeriods = inputs.years * timesPerYear;

  // 3. Future value
  const futureValue = calculateFutureValue(
    paymentPerPeriod,
    ratePerPeriod,
    totalPeriods
  );

  // 4. Principal and growth
  const totalContributions = paymentPerPeriod * totalPeriods;
  const totalGrowth = futureValue - totalContributions;
  const growthPercentage = futureValue > 0 ? (totalGrowth / futureValue) * 100 : 0;

  // 5. Inflation adjustment
  let realValue: number | undefined;
  if (inputs.adjustForInflation && inputs.years > 0) {
    realValue = futureValue / Math.pow(1 + inputs.inflationRate / 100, inputs.years);
  }

  // 6. Life energy calculations
  let lifeEnergyContributed: number | undefined;
  let lifeEnergyEarnedPassively: number | undefined;
  let totalLifeEnergy: number | undefined;
  let freedomMonths: number | undefined;

  if (actualHourlyWage && actualHourlyWage > 0) {
    lifeEnergyContributed = totalContributions / actualHourlyWage;
    lifeEnergyEarnedPassively = totalGrowth / actualHourlyWage;
    totalLifeEnergy = futureValue / actualHourlyWage;

    if (monthlyExpenses && monthlyExpenses > 0) {
      freedomMonths = futureValue / monthlyExpenses;
    }
  }

  // 7. Yearly breakdown for charting
  const yearlyBreakdown = calculateYearlyBreakdown(
    paymentPerPeriod,
    ratePerPeriod,
    timesPerYear,
    inputs.years,
    inputs.adjustForInflation ? inputs.inflationRate : undefined
  );

  return {
    futureValue,
    totalContributions,
    totalGrowth,
    growthPercentage,
    lifeEnergyContributed,
    lifeEnergyEarnedPassively,
    totalLifeEnergy,
    freedomMonths,
    realValue,
    yearlyBreakdown,
  };
}
