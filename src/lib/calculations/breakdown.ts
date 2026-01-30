/**
 * Breakdown Functions for Charts and Visualizations
 *
 * These functions transform expense and time data into structured breakdowns
 * suitable for charts, tables, and detailed views.
 */

import type {
  MoneyExpenses,
  TimeExpenses,
  ExpenseBreakdownItem,
  TimeBreakdownItem,
} from '@/types/calculator';
import { dollarsToLifeEnergy } from './lifeEnergy';

/**
 * Human-readable labels for expense categories (Icelandic)
 */
const EXPENSE_LABELS: Record<keyof MoneyExpenses, string> = {
  commute: 'Ferðakostnaður',
  clothing: 'Vinnufatnaður',
  meals: 'Vinnumáltíðir',
  decompression: 'Afslöppunarútgjöld',
  childcareDelta: 'Aukakostnaður við barnagæslu',
  other: 'Annar vinnukostnaður',
};

/**
 * Human-readable labels for time categories (Icelandic)
 */
const TIME_LABELS: Record<keyof TimeExpenses, string> = {
  commute: 'Ferðatími',
  gettingReady: 'Undirbúningur',
  decompression: 'Afslöppunartími',
  workIllness: 'Vinnutengd veikindi',
};

/**
 * Generate expense breakdown for charts and tables
 *
 * Returns a sorted list of expense items (highest to lowest) with:
 * - Life energy hours calculation
 * - Percentage of total expenses
 * - Human-readable labels
 *
 * Zero-value items are filtered out.
 *
 * @param expenses - Money expenses object
 * @param actualWage - Actual hourly wage for life energy calculation
 * @returns Array of expense breakdown items sorted by amount (descending)
 *
 * @example
 * ```ts
 * const expenses = { commute: 5000, meals: 2000, clothing: 0 };
 * const breakdown = generateExpenseBreakdown(expenses, 20);
 * // Returns: [
 * //   { category: 'commute', label: 'Commute Costs', amount: 5000, lifeEnergyHours: 250, percentage: 71.43 },
 * //   { category: 'meals', label: 'Work Meals', amount: 2000, lifeEnergyHours: 100, percentage: 28.57 }
 * // ]
 * ```
 */
export function generateExpenseBreakdown(
  expenses: MoneyExpenses,
  actualWage: number
): ExpenseBreakdownItem[] {
  const totalExpenses = Object.values(expenses).reduce(
    (sum, val) => sum + val,
    0
  );

  const items: ExpenseBreakdownItem[] = [];

  for (const [key, amount] of Object.entries(expenses)) {
    if (amount <= 0) continue; // Filter out zero/negative values

    const category = key as keyof MoneyExpenses;
    items.push({
      category,
      label: EXPENSE_LABELS[category],
      amount,
      lifeEnergyHours: dollarsToLifeEnergy(amount, actualWage),
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    });
  }

  // Sort by amount (descending)
  return items.sort((a, b) => b.amount - a.amount);
}

/**
 * Generate time breakdown for charts and tables
 *
 * Returns all time allocations including base work hours with:
 * - Weekly and annual hours
 * - Percentage of total time
 * - Human-readable labels
 *
 * Base work hours are included as the first category.
 * Zero-value time expenses are filtered out.
 *
 * @param timeExpenses - Time expenses object
 * @param baseWorkHours - Base work hours per week
 * @param weeksPerYear - Weeks worked per year
 * @returns Array of time breakdown items
 *
 * @example
 * ```ts
 * const timeExpenses = { commute: 5, gettingReady: 2, decompression: 0, workIllness: 0 };
 * const breakdown = generateTimeBreakdown(timeExpenses, 40, 50);
 * // Returns: [
 * //   { category: 'baseWork', label: 'Base Work Hours', hoursPerWeek: 40, hoursPerYear: 2000, percentage: 85.11 },
 * //   { category: 'commute', label: 'Commute Time', hoursPerWeek: 5, hoursPerYear: 250, percentage: 10.64 },
 * //   { category: 'gettingReady', label: 'Getting Ready', hoursPerWeek: 2, hoursPerYear: 100, percentage: 4.26 }
 * // ]
 * ```
 */
export function generateTimeBreakdown(
  timeExpenses: TimeExpenses,
  baseWorkHours: number,
  weeksPerYear: number
): TimeBreakdownItem[] {
  // Calculate total weekly hours (base + extra)
  const extraHours = Object.values(timeExpenses).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalWeeklyHours = baseWorkHours + extraHours;

  const items: TimeBreakdownItem[] = [];

  // Add base work hours first
  items.push({
    category: 'baseWork',
    label: 'Grunnvinnustundir',
    hoursPerWeek: baseWorkHours,
    hoursPerYear: baseWorkHours * weeksPerYear,
    percentage:
      totalWeeklyHours > 0 ? (baseWorkHours / totalWeeklyHours) * 100 : 0,
  });

  // Add each time expense category (only if > 0)
  for (const [key, hoursPerWeek] of Object.entries(timeExpenses)) {
    if (hoursPerWeek <= 0) continue;

    const category = key as keyof TimeExpenses;
    items.push({
      category,
      label: TIME_LABELS[category],
      hoursPerWeek,
      hoursPerYear: hoursPerWeek * weeksPerYear,
      percentage:
        totalWeeklyHours > 0 ? (hoursPerWeek / totalWeeklyHours) * 100 : 0,
    });
  }

  return items;
}

/**
 * Get total annual expenses from breakdown
 *
 * @param breakdown - Expense breakdown array
 * @returns Total of all expenses
 */
export function getTotalExpenses(breakdown: ExpenseBreakdownItem[]): number {
  return breakdown.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Get total weekly hours from breakdown
 *
 * @param breakdown - Time breakdown array
 * @returns Total of all weekly hours
 */
export function getTotalWeeklyHours(breakdown: TimeBreakdownItem[]): number {
  return breakdown.reduce((sum, item) => sum + item.hoursPerWeek, 0);
}
