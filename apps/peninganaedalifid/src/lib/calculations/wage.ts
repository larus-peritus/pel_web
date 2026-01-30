/**
 * Core Wage Calculation Functions
 *
 * Pure functions for calculating nominal and actual hourly wages.
 * Based on "Your Money or Your Life" Chapter 2 methodology.
 *
 * Key concepts:
 * - Nominal wage: Simple division of income by hours
 * - Actual wage: Accounts for work expenses and extra time
 * - Life Energy: Total time invested in earning money
 */

import type {
  IncomeInputs,
  MoneyExpenses,
  TimeExpenses,
  CalculatorInputs,
  CalculationResults,
} from '@/types/calculator';
import { generateExpenseBreakdown, generateTimeBreakdown } from './breakdown';

/**
 * Convert vacation days to work weeks per year
 *
 * Formula: 52 weeks - (vacationDays / 5 days per week)
 * Example: 24 vacation days = 52 - 4.8 = 47.2 work weeks
 *
 * @param vacationDays - Number of vacation days per year
 * @returns Work weeks per year
 */
export function vacationDaysToWorkWeeks(vacationDays: number): number {
  return 52 - vacationDays / 5;
}

/**
 * Calculate nominal hourly wage (simple division)
 * This is what you'd normally calculate: income / hours
 *
 * @param income - Income configuration (salary, hours, vacation days)
 * @returns Nominal hourly wage in ISK
 *
 * @example
 * const income = {
 *   grossAnnualIncome: 6000000,
 *   workHoursPerWeek: 38,
 *   vacationDays: 24,
 *   additionalIncome: 0
 * };
 * const wage = calculateNominalWage(income); // Returns ~3346
 */
export function calculateNominalWage(income: IncomeInputs): number {
  const totalAnnualIncome = income.grossAnnualIncome + income.additionalIncome;
  const workWeeksPerYear = vacationDaysToWorkWeeks(income.vacationDays);
  const totalAnnualHours = income.workHoursPerWeek * workWeeksPerYear;

  if (totalAnnualHours === 0) return 0;
  return totalAnnualIncome / totalAnnualHours;
}

/**
 * Calculate total annual money expenses related to work
 *
 * Sums all work-related monetary costs: commute, clothing, meals,
 * decompression, childcare, and other expenses.
 *
 * @param expenses - Work-related money expenses
 * @returns Total annual expenses in dollars
 *
 * @example
 * const expenses = {
 *   commute: 2400,
 *   clothing: 500,
 *   meals: 1300,
 *   decompression: 800,
 *   childcareDelta: 0,
 *   other: 200
 * };
 * const total = calculateTotalMoneyExpenses(expenses); // Returns 5200
 */
export function calculateTotalMoneyExpenses(expenses: MoneyExpenses): number {
  return Object.values(expenses).reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate total extra weekly time spent on work (beyond base hours)
 *
 * Sums all work-related time costs: commute, getting ready,
 * decompression, and work-related illness.
 *
 * @param time - Work-related time expenses
 * @returns Total extra weekly hours
 *
 * @example
 * const time = {
 *   commute: 5,
 *   gettingReady: 2.5,
 *   decompression: 3,
 *   workIllness: 0.5
 * };
 * const total = calculateTotalExtraTime(time); // Returns 11
 */
export function calculateTotalExtraTime(time: TimeExpenses): number {
  return Object.values(time).reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate actual hourly wage
 *
 * This accounts for work expenses and extra time, revealing the
 * true cost of earning money. The formula:
 * (Income - Expenses) / (Base Hours + Extra Hours) per year
 *
 * @param inputs - Complete calculator inputs
 * @returns Actual hourly wage in ISK
 *
 * @example
 * const inputs = {
 *   income: {
 *     grossAnnualIncome: 6000000,
 *     workHoursPerWeek: 38,
 *     vacationDays: 24,
 *     additionalIncome: 0
 *   },
 *   moneyExpenses: {
 *     commute: 400000,
 *     clothing: 100000,
 *     meals: 200000,
 *     decompression: 100000,
 *     childcareDelta: 0,
 *     other: 50000
 *   },
 *   timeExpenses: {
 *     commute: 5,
 *     gettingReady: 2.5,
 *     decompression: 3,
 *     workIllness: 0.5
 *   }
 * };
 * // With 24 vacation days: 47.2 work weeks
 * // Nominal: 6,000,000 / (38 × 47.2) = ~3346 kr/hr
 * // Actual: (6,000,000 - 850,000) / ((38 + 11) × 47.2) = ~2227 kr/hr
 * const wage = calculateActualWage(inputs);
 */
export function calculateActualWage(inputs: CalculatorInputs): number {
  const { income, moneyExpenses, timeExpenses } = inputs;

  // Net income after work expenses
  const totalIncome = income.grossAnnualIncome + income.additionalIncome;
  const totalExpenses = calculateTotalMoneyExpenses(moneyExpenses);
  const netIncome = totalIncome - totalExpenses;

  // Total time investment
  const workWeeksPerYear = vacationDaysToWorkWeeks(income.vacationDays);
  const baseWeeklyHours = income.workHoursPerWeek;
  const extraWeeklyHours = calculateTotalExtraTime(timeExpenses);
  const totalWeeklyHours = baseWeeklyHours + extraWeeklyHours;
  const totalAnnualHours = totalWeeklyHours * workWeeksPerYear;

  if (totalAnnualHours === 0) return 0;
  return netIncome / totalAnnualHours;
}

/**
 * Calculate complete results with all derived values
 *
 * Performs all calculations and returns a complete results object
 * including wages, breakdowns, and life energy hours.
 *
 * @param inputs - Complete calculator inputs
 * @returns Complete calculation results
 *
 * @example
 * const results = calculateResults(inputs);
 * console.log(results.nominalHourlyWage); // 3346
 * console.log(results.actualHourlyWage); // 2227
 * console.log(results.percentageReduction); // 33.4
 */
export function calculateResults(inputs: CalculatorInputs): CalculationResults {
  const nominalWage = calculateNominalWage(inputs.income);
  const actualWage = calculateActualWage(inputs);

  const percentageReduction =
    nominalWage > 0 ? ((nominalWage - actualWage) / nominalWage) * 100 : 0;

  const totalExpenses = calculateTotalMoneyExpenses(inputs.moneyExpenses);
  const totalIncome =
    inputs.income.grossAnnualIncome + inputs.income.additionalIncome;
  const netIncome = totalIncome - totalExpenses;

  const workWeeksPerYear = vacationDaysToWorkWeeks(inputs.income.vacationDays);
  const baseHours = inputs.income.workHoursPerWeek;
  const extraHours = calculateTotalExtraTime(inputs.timeExpenses);
  const totalHours = baseHours + extraHours;
  const annualHours = totalHours * workWeeksPerYear;

  return {
    nominalHourlyWage: nominalWage,
    actualHourlyWage: actualWage,
    percentageReduction,
    netAnnualIncome: netIncome,
    totalMoneyExpenses: totalExpenses,
    baseWeeklyHours: baseHours,
    totalWeeklyHours: totalHours,
    totalExtraHours: extraHours,
    annualLifeEnergyHours: annualHours,
    expenseBreakdown: generateExpenseBreakdown(inputs.moneyExpenses, actualWage),
    timeBreakdown: generateTimeBreakdown(
      inputs.timeExpenses,
      baseHours,
      workWeeksPerYear
    ),
  };
}
