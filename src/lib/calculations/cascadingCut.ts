/**
 * Calculation functions for the Cascading Expense Cut Calculator
 *
 * These functions handle:
 * - Converting expense baseline data to cut categories
 * - Allocating cuts by priority (cascading)
 * - Calculating aggregate impact metrics
 * - Reordering categories by priority
 */

import type { ExpenseCategory, ExpenseTier } from '@/types/expenseBaseline';
import type {
  CascadingCutCategory,
  CascadingCutResult,
  CascadingCutImpact,
  CutStatus,
  FIInputs,
} from '@/types/cascadingCut';
import {
  calculateLifeEnergy,
  calculateFutureValue,
  calculateFIDateShift,
} from './cutImpact';

/**
 * Initialize categories from expense baseline data
 *
 * Converts ExpenseCategory[] to CascadingCutCategory[] with default priorities.
 * Only includes visible (non-hidden) categories with expenses > 0.
 *
 * @param categories - Expense categories from expense baseline
 * @param tier - Which tier to use for expense amounts (default: 'comfortable')
 * @param savedPriorities - Optional saved priorities from localStorage
 */
export function initializeCategoriesFromExpenseReport(
  categories: ExpenseCategory[],
  tier: ExpenseTier = 'comfortable',
  savedPriorities?: { id: string; priority: number }[]
): CascadingCutCategory[] {
  // Filter to visible categories with non-zero expenses
  const visibleCategories = categories.filter(
    (cat) => !cat.isHidden && cat.values[tier] > 0
  );

  // Build priority map from saved priorities
  const priorityMap = new Map<string, number>();
  if (savedPriorities) {
    savedPriorities.forEach((p) => priorityMap.set(p.id, p.priority));
  }

  // Convert to cascading cut categories
  const cutCategories: CascadingCutCategory[] = visibleCategories.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    expenseAmount: cat.values[tier],
    priority: priorityMap.get(cat.id) ?? index + 1, // Use saved priority or default order
    cutAmount: 0,
    cutPercentage: 0,
    status: 'untouched' as CutStatus,
  }));

  // Sort by priority
  return cutCategories.sort((a, b) => a.priority - b.priority);
}

/**
 * Calculate cascading cuts based on target amount and priorities
 *
 * Algorithm:
 * 1. Sort categories by priority (1 = cut first)
 * 2. For each category in priority order:
 *    - cutAmount = min(categoryExpense, remainingToCut)
 *    - remainingToCut -= cutAmount
 *    - Mark as: fullyCut / partiallyCut / untouched
 *
 * @param categories - Categories with priorities
 * @param targetAmount - Target monthly cut amount in ISK
 */
export function calculateCascadingCuts(
  categories: CascadingCutCategory[],
  targetAmount: number
): CascadingCutResult {
  // Sort by priority
  const sortedCategories = [...categories].sort((a, b) => a.priority - b.priority);

  // Calculate total expenses
  const totalExpenses = sortedCategories.reduce((sum, cat) => sum + cat.expenseAmount, 0);

  // Allocate cuts
  let remainingToCut = Math.min(targetAmount, totalExpenses);
  let allocatedAmount = 0;

  const resultCategories: CascadingCutCategory[] = sortedCategories.map((cat) => {
    if (remainingToCut <= 0 || cat.expenseAmount <= 0) {
      return {
        ...cat,
        cutAmount: 0,
        cutPercentage: 0,
        status: 'untouched' as CutStatus,
      };
    }

    const cutAmount = Math.min(cat.expenseAmount, remainingToCut);
    remainingToCut -= cutAmount;
    allocatedAmount += cutAmount;

    const cutPercentage = (cutAmount / cat.expenseAmount) * 100;
    let status: CutStatus;

    if (cutPercentage >= 100) {
      status = 'fully-cut';
    } else if (cutPercentage > 0) {
      status = 'partially-cut';
    } else {
      status = 'untouched';
    }

    return {
      ...cat,
      cutAmount,
      cutPercentage,
      status,
    };
  });

  return {
    categories: resultCategories,
    targetAmount,
    allocatedAmount,
    unallocatedAmount: Math.max(0, targetAmount - totalExpenses),
    totalExpenses,
  };
}

/**
 * Calculate aggregate impact from cascading cuts
 *
 * Combines impact across all categories that have cuts allocated.
 *
 * @param result - Cascading cut result with allocated cuts
 * @param actualHourlyWage - User's actual hourly wage for life energy calculation
 * @param fiInputs - Optional FI planning inputs for FI date calculation
 */
export function calculateCascadingImpact(
  result: CascadingCutResult,
  actualHourlyWage: number,
  fiInputs?: FIInputs
): CascadingCutImpact {
  const totalCutAmount = result.allocatedAmount;

  // Calculate life energy from total cuts
  const lifeEnergy = calculateLifeEnergy(totalCutAmount, actualHourlyWage);

  // Calculate future value projections
  const futureValue10 = calculateFutureValue(totalCutAmount, 10);
  const futureValue20 = calculateFutureValue(totalCutAmount, 20);

  // Calculate FI date shift
  const fiDateShift = fiInputs ? calculateFIDateShift(totalCutAmount, fiInputs) : null;

  return {
    totalCutAmount,
    lifeEnergy,
    futureValue10,
    futureValue20,
    fiDateShift,
  };
}

/**
 * Reorder categories by moving one category up or down
 *
 * @param categories - Current categories with priorities
 * @param categoryId - ID of category to move
 * @param direction - 'up' (lower priority number) or 'down' (higher priority number)
 */
export function reorderCategories(
  categories: CascadingCutCategory[],
  categoryId: string,
  direction: 'up' | 'down'
): CascadingCutCategory[] {
  // Sort by current priority
  const sorted = [...categories].sort((a, b) => a.priority - b.priority);

  // Find index of category to move
  const currentIndex = sorted.findIndex((cat) => cat.id === categoryId);
  if (currentIndex === -1) return categories;

  // Calculate new index
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  // Check bounds
  if (newIndex < 0 || newIndex >= sorted.length) return categories;

  // Swap categories
  const temp = sorted[currentIndex];
  sorted[currentIndex] = sorted[newIndex];
  sorted[newIndex] = temp;

  // Reassign priorities (1-based)
  return sorted.map((cat, index) => ({
    ...cat,
    priority: index + 1,
  }));
}

/**
 * Get category priority map for persistence
 */
export function getCategoryPriorities(
  categories: CascadingCutCategory[]
): { id: string; priority: number }[] {
  return categories.map((cat) => ({
    id: cat.id,
    priority: cat.priority,
  }));
}

/**
 * Get CSS classes for cut status styling
 */
export function getCutStatusStyles(status: CutStatus): {
  bg: string;
  text: string;
  bar: string;
} {
  switch (status) {
    case 'fully-cut':
      return {
        bg: 'bg-green-50',
        text: 'text-green-800 line-through',
        bar: 'bg-green-500',
      };
    case 'partially-cut':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        bar: 'bg-amber-500',
      };
    case 'untouched':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        bar: 'bg-gray-200',
      };
  }
}
