/**
 * Savings Report Calculation Functions
 * Pure functions for calculating savings totals, rates, life energy, and breakdowns
 * All calculations are side-effect free and handle edge cases
 */

import type {
  SavingsCategory,
  SavingsReport,
  SavingsReportResults,
  CategoryBreakdown,
  SavingsRateContext,
  SavingsRateLevel,
  SavingsLifeEnergy,
} from '@/types/savingsReport';
import { SAVINGS_RATE_THRESHOLDS, SAVINGS_RATE_MESSAGES } from '@/lib/constants/savingsReport';

/**
 * Calculate total savings across all visible categories
 *
 * @param categories - Array of savings categories
 * @returns Total balance across all non-hidden categories
 *
 * @example
 * const categories = [
 *   { id: 'emergency', data: { balance: 1000000 }, isHidden: false },
 *   { id: 'investment', data: { balance: 5000000 }, isHidden: false },
 *   { id: 'other', data: { balance: 500000 }, isHidden: true }, // Excluded
 * ];
 * calculateTotalSavings(categories); // Returns 6000000
 */
export function calculateTotalSavings(categories: SavingsCategory[]): number {
  return categories
    .filter(cat => !cat.isHidden)
    .reduce((sum, cat) => sum + cat.data.balance, 0);
}

/**
 * Calculate total monthly contribution across all visible categories
 *
 * @param categories - Array of savings categories
 * @returns Total monthly contribution across all non-hidden categories
 *
 * @example
 * const categories = [
 *   { id: 'emergency', data: { monthlyContribution: 50000 }, isHidden: false },
 *   { id: 'investment', data: { monthlyContribution: 100000 }, isHidden: false },
 * ];
 * calculateTotalMonthlyContribution(categories); // Returns 150000
 */
export function calculateTotalMonthlyContribution(categories: SavingsCategory[]): number {
  return categories
    .filter(cat => !cat.isHidden)
    .reduce((sum, cat) => sum + cat.data.monthlyContribution, 0);
}

/**
 * Calculate annual contribution from monthly
 *
 * @param monthlyContribution - Monthly contribution amount
 * @returns Annual contribution (monthly * 12)
 *
 * @example
 * calculateAnnualContribution(150000); // Returns 1800000
 */
export function calculateAnnualContribution(monthlyContribution: number): number {
  return monthlyContribution * 12;
}

/**
 * Calculate savings rate as percentage of gross monthly income
 * Returns null if income is 0 or not provided
 *
 * @param monthlyContribution - Total monthly savings contribution
 * @param monthlyGrossIncome - Gross monthly income (before taxes)
 * @returns Savings rate as percentage (0-100+) or null if income unavailable
 *
 * @example
 * calculateSavingsRate(150000, 500000); // Returns 30 (30%)
 * calculateSavingsRate(150000, null); // Returns null
 * calculateSavingsRate(150000, 0); // Returns null
 */
export function calculateSavingsRate(
  monthlyContribution: number,
  monthlyGrossIncome: number | null | undefined
): number | null {
  if (!monthlyGrossIncome || monthlyGrossIncome <= 0) {
    return null;
  }
  return (monthlyContribution / monthlyGrossIncome) * 100;
}

/**
 * Get savings rate level based on thresholds
 *
 * @param rate - Savings rate as percentage
 * @returns Savings rate level classification
 *
 * @example
 * getSavingsRateLevel(5);  // Returns 'critical'
 * getSavingsRateLevel(15); // Returns 'low'
 * getSavingsRateLevel(25); // Returns 'moderate'
 * getSavingsRateLevel(35); // Returns 'good'
 * getSavingsRateLevel(55); // Returns 'excellent'
 * getSavingsRateLevel(75); // Returns 'exceptional'
 */
export function getSavingsRateLevel(rate: number): SavingsRateLevel {
  if (rate < SAVINGS_RATE_THRESHOLDS.critical.max) return 'critical';
  if (rate < SAVINGS_RATE_THRESHOLDS.low.max) return 'low';
  if (rate < SAVINGS_RATE_THRESHOLDS.moderate.max) return 'moderate';
  if (rate < SAVINGS_RATE_THRESHOLDS.good.max) return 'good';
  if (rate < SAVINGS_RATE_THRESHOLDS.excellent.max) return 'excellent';
  return 'exceptional';
}

/**
 * Get contextual information about savings rate
 *
 * @param rate - Savings rate as percentage or null
 * @returns Contextual information including level and message, or null if rate is null
 *
 * @example
 * getSavingsRateContext(25);
 * // Returns { rate: 25, level: 'moderate', messageIs: '...', fiEstimateYears: 25 }
 * getSavingsRateContext(null); // Returns null
 */
export function getSavingsRateContext(rate: number | null): SavingsRateContext | null {
  if (rate === null) return null;

  const level = getSavingsRateLevel(rate);
  const messageData = SAVINGS_RATE_MESSAGES[level];

  return {
    rate,
    level,
    messageIs: messageData.messageIs,
    fiEstimateYears: messageData.fiEstimateYears,
  };
}

/**
 * Calculate life energy for savings
 * Converts monetary values to work hours based on actual hourly wage
 *
 * @param totalBalance - Total savings balance
 * @param totalMonthlyContribution - Total monthly contribution
 * @param actualHourlyWage - Actual hourly wage (after expenses)
 * @returns Life energy calculations or null if wage unavailable
 *
 * @example
 * calculateSavingsLifeEnergy(6000000, 150000, 2500);
 * // Returns {
 * //   totalBalanceHours: 2400,
 * //   totalContributionHoursPerMonth: 60,
 * //   totalContributionHoursPerYear: 720
 * // }
 * calculateSavingsLifeEnergy(6000000, 150000, null); // Returns null
 */
export function calculateSavingsLifeEnergy(
  totalBalance: number,
  totalMonthlyContribution: number,
  actualHourlyWage: number | null | undefined
): SavingsLifeEnergy | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) {
    return null;
  }

  return {
    totalBalanceHours: totalBalance / actualHourlyWage,
    totalContributionHoursPerMonth: totalMonthlyContribution / actualHourlyWage,
    totalContributionHoursPerYear: (totalMonthlyContribution * 12) / actualHourlyWage,
  };
}

/**
 * Calculate breakdown per category
 *
 * @param categories - Array of savings categories
 * @param totalSavings - Total savings amount (for percentage calculation)
 * @param actualHourlyWage - Actual hourly wage for life energy calculations
 * @returns Array of category breakdowns with percentages and life energy
 *
 * @example
 * const categories = [
 *   {
 *     id: 'emergency',
 *     name: 'Neyðarsjóður',
 *     icon: '🛡️',
 *     data: { balance: 2000000, monthlyContribution: 50000 },
 *     isHidden: false
 *   },
 *   {
 *     id: 'investment',
 *     name: 'Fjárfestingar',
 *     icon: '📈',
 *     data: { balance: 4000000, monthlyContribution: 100000 },
 *     isHidden: false
 *   },
 * ];
 * calculateCategoryBreakdown(categories, 6000000, 2500);
 * // Returns array with percentages and life energy for each category
 */
export function calculateCategoryBreakdown(
  categories: SavingsCategory[],
  totalSavings: number,
  actualHourlyWage: number | null | undefined
): CategoryBreakdown[] {
  const visibleCategories = categories.filter(cat => !cat.isHidden);

  return visibleCategories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    icon: cat.icon,
    balance: cat.data.balance,
    monthlyContribution: cat.data.monthlyContribution,
    percentageOfTotal: totalSavings > 0 ? (cat.data.balance / totalSavings) * 100 : 0,
    lifeEnergyBalance: actualHourlyWage && actualHourlyWage > 0
      ? cat.data.balance / actualHourlyWage
      : undefined,
    lifeEnergyContribution: actualHourlyWage && actualHourlyWage > 0
      ? cat.data.monthlyContribution / actualHourlyWage
      : undefined,
  }));
}

/**
 * Calculate all savings report results
 * Main orchestrator function that computes all savings metrics
 *
 * @param report - Complete savings report with categories
 * @param actualHourlyWage - Actual hourly wage for life energy calculations
 * @param monthlyGrossIncome - Gross monthly income for savings rate calculation
 * @returns Complete savings report results or null if no report
 *
 * @example
 * const report = {
 *   categories: [...],
 *   lastUpdated: new Date(),
 *   version: 1
 * };
 * calculateSavingsReportResults(report, 2500, 500000);
 * // Returns complete results with totals, rate, breakdown, and life energy
 */
export function calculateSavingsReportResults(
  report: SavingsReport | null,
  actualHourlyWage: number | null | undefined,
  monthlyGrossIncome: number | null | undefined
): SavingsReportResults | null {
  if (!report || report.categories.length === 0) {
    return null;
  }

  const totalSavings = calculateTotalSavings(report.categories);
  const totalMonthlyContribution = calculateTotalMonthlyContribution(report.categories);
  const totalAnnualContribution = calculateAnnualContribution(totalMonthlyContribution);
  const savingsRate = calculateSavingsRate(totalMonthlyContribution, monthlyGrossIncome);
  const savingsRateContext = getSavingsRateContext(savingsRate);
  const categoryBreakdown = calculateCategoryBreakdown(
    report.categories,
    totalSavings,
    actualHourlyWage
  );
  const lifeEnergy = calculateSavingsLifeEnergy(
    totalSavings,
    totalMonthlyContribution,
    actualHourlyWage
  );

  return {
    totalSavings,
    totalMonthlyContribution,
    totalAnnualContribution,
    savingsRate,
    savingsRateContext,
    categoryBreakdown,
    lifeEnergy,
  };
}
