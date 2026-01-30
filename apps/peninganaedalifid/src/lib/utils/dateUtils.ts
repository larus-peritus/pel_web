/**
 * Date utility functions for convenience expense tracking
 * Handles workday detection and date range filtering
 */

import type { ConvenienceExpense } from '@/types/calculator';

/**
 * Check if a given date is a weekday (Monday-Friday)
 *
 * @param date - Date to check
 * @returns true if Monday-Friday, false if Saturday-Sunday
 *
 * @example
 * ```ts
 * isWeekday(new Date('2025-01-20')) // Monday => true
 * isWeekday(new Date('2025-01-25')) // Saturday => false
 * ```
 */
export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  // 0 = Sunday, 6 = Saturday
  // 1-5 = Monday-Friday
  return day >= 1 && day <= 5;
}

/**
 * Get expenses within a date range (inclusive)
 *
 * @param expenses - Array of expenses to filter
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Filtered expenses within the date range
 *
 * @example
 * ```ts
 * const expenses = [
 *   { date: '2025-01-15', ... },
 *   { date: '2025-01-20', ... },
 *   { date: '2025-01-25', ... }
 * ];
 * getExpensesInDateRange(expenses, new Date('2025-01-18'), new Date('2025-01-22'));
 * // Returns expense from 2025-01-20
 * ```
 */
export function getExpensesInDateRange(
  expenses: ConvenienceExpense[],
  startDate: Date,
  endDate: Date
): ConvenienceExpense[] {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseTime = expenseDate.getTime();
    return expenseTime >= startTime && expenseTime <= endTime;
  });
}

/**
 * Group expenses by date (YYYY-MM-DD format)
 *
 * @param expenses - Array of expenses to group
 * @returns Map of date string to array of expenses on that date
 *
 * @example
 * ```ts
 * const grouped = groupExpensesByDate(expenses);
 * // {
 * //   '2025-01-20': [expense1, expense2],
 * //   '2025-01-21': [expense3]
 * // }
 * ```
 */
export function groupExpensesByDate(
  expenses: ConvenienceExpense[]
): Record<string, ConvenienceExpense[]> {
  const grouped: Record<string, ConvenienceExpense[]> = {};

  expenses.forEach((expense) => {
    const dateKey = expense.date.split('T')[0]; // Get YYYY-MM-DD part
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(expense);
  });

  return grouped;
}

/**
 * Get date range for the last N days (inclusive of today)
 *
 * @param days - Number of days to go back
 * @returns Object with start and end dates
 *
 * @example
 * ```ts
 * getLast7Days(); // Returns dates for last 7 days including today
 * ```
 */
export function getLast7Days(): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6); // -6 because we include today
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

/**
 * Get date range for the last 30 days (inclusive of today)
 *
 * @returns Object with start and end dates
 *
 * @example
 * ```ts
 * getLast30Days(); // Returns dates for last 30 days including today
 * ```
 */
export function getLast30Days(): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29); // -29 because we include today
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

/**
 * Format a date as relative time in Icelandic
 *
 * @param date - Date to format
 * @returns Icelandic relative time string
 *
 * @example
 * ```ts
 * formatRelativeDate(new Date()); // "Í dag"
 * formatRelativeDate(yesterday); // "Í gær"
 * ```
 */
export function formatRelativeDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Í dag';
  if (diffDays === 1) return 'Í gær';
  if (diffDays < 7) return `${diffDays} dögum síðan`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 viku síðan' : `${weeks} vikum síðan`;
  }

  // Format as DD.MM.YYYY for older dates
  const day = targetDate.getDate().toString().padStart(2, '0');
  const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
  const year = targetDate.getFullYear();
  return `${day}.${month}.${year}`;
}
