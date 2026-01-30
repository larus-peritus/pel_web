/**
 * Period helper functions
 * Utilities for working with lifestyle inflation periods
 */

import type { Period, SpendingData } from '@/types/calculator';

/**
 * Default empty spending data (all zeros)
 */
export const DEFAULT_SPENDING: SpendingData = {
  housing: 0,
  food: 0,
  transportation: 0,
  subscriptions: 0,
  convenience: 0,
  clothing: 0,
  entertainment: 0,
  health: 0,
  other: 0,
};

/**
 * Get empty spending data
 */
export function getEmptySpending(): SpendingData {
  return { ...DEFAULT_SPENDING };
}

/**
 * Calculate total spending from spending data
 */
export function getTotalSpending(spending: SpendingData): number {
  return Object.values(spending).reduce((sum, val) => sum + val, 0);
}

/**
 * Create a default period with basic info
 * @param name - Period name (e.g., "Janúar 2024")
 * @param year - Year (2020-2030)
 * @param month - Optional month (1-12), null for yearly periods
 * @returns Period data without ID (for creation)
 */
export function createDefaultPeriod(
  name: string,
  year: number,
  month?: number
): Omit<Period, 'id'> {
  const now = new Date();

  // Calculate start and end dates
  const startDate = month
    ? new Date(year, month - 1, 1).toISOString()
    : new Date(year, 0, 1).toISOString();

  const endDate = month
    ? new Date(year, month, 0).toISOString() // Last day of month
    : new Date(year, 11, 31).toISOString(); // Dec 31

  return {
    name,
    month,
    year,
    startDate,
    endDate,
    income: 0,
    spending: getEmptySpending(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Month names in Icelandic
 */
const MONTH_NAMES: string[] = [
  'Janúar',
  'Febrúar',
  'Mars',
  'Apríl',
  'Maí',
  'Júní',
  'Júlí',
  'Ágúst',
  'September',
  'Október',
  'Nóvember',
  'Desember',
];

/**
 * Format period name from month and year
 * @param month - Month (1-12) or null for yearly
 * @param year - Year
 * @returns Formatted period name (e.g., "Janúar 2024" or "Árið 2024")
 */
export function formatPeriodName(month: number | null | undefined, year: number): string {
  if (month === null || month === undefined) {
    return `Árið ${year}`;
  }

  if (month < 1 || month > 12) {
    return `Árið ${year}`;
  }

  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/**
 * Compare two periods for sorting (newest first)
 * @param a - First period
 * @param b - Second period
 * @returns Negative if a is newer, positive if b is newer, 0 if equal
 */
export function comparePeriods(a: Period, b: Period): number {
  // Compare by year first
  if (a.year !== b.year) {
    return b.year - a.year; // Descending (newest first)
  }

  // If same year, compare by month
  const aMonth = a.month ?? 13; // Yearly periods sort to end of year
  const bMonth = b.month ?? 13;

  return bMonth - aMonth; // Descending (newest first)
}

/**
 * Generate unique ID for a period
 */
export function generatePeriodId(): string {
  return `period-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
