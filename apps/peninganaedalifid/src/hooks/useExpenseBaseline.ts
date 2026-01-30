import { useState, useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import type { ExpenseTier, ExpenseBaseline, ExpenseBaselineResults } from '@/types/expenseBaseline';

/**
 * Custom hook return type for useExpenseBaseline
 */
export interface UseExpenseBaselineReturn {
  baseline: ExpenseBaseline | null;
  results: ExpenseBaselineResults | null;
  hasBaseline: boolean;
}

/**
 * useExpenseBaseline - Access expense baseline data from context
 *
 * Provides easy access to expense baseline state and results.
 *
 * @returns {UseExpenseBaselineReturn} Baseline data, results, and existence flag
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { baseline, results, hasBaseline } = useExpenseBaseline();
 *
 *   if (!hasBaseline) {
 *     return <BaselinePrompt />;
 *   }
 *
 *   return <div>Total: {results?.totals.comfortable}</div>;
 * }
 * ```
 */
export function useExpenseBaseline(): UseExpenseBaselineReturn {
  const { expenseBaseline, expenseBaselineResults, hasExpenseBaseline } = useCalculator();

  return {
    baseline: expenseBaseline,
    results: expenseBaselineResults,
    hasBaseline: hasExpenseBaseline(),
  };
}

/**
 * Custom hook return type for useSelectedTier
 */
export type UseSelectedTierReturn = [
  ExpenseTier,
  (tier: ExpenseTier) => void,
  number
];

/**
 * useSelectedTier - Manage selected tier state with expense lookup
 *
 * Provides state management for a selected tier and automatically
 * returns the expense amount for that tier.
 *
 * @param {ExpenseTier} initialTier - Initial tier selection (default: 'comfortable')
 * @returns {UseSelectedTierReturn} [selectedTier, setSelectedTier, expenseAmount]
 *
 * @example
 * ```tsx
 * function FINumberCalculator() {
 *   const [tier, setTier, monthlyExpense] = useSelectedTier('comfortable');
 *
 *   const annualExpense = monthlyExpense * 12;
 *   const fiNumber = annualExpense * 25;
 *
 *   return (
 *     <div>
 *       <TierSelector selectedTier={tier} onSelectTier={setTier} />
 *       <p>FI Number: {formatCurrency(fiNumber)}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSelectedTier(
  initialTier: ExpenseTier = 'comfortable'
): UseSelectedTierReturn {
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>(initialTier);
  const { getExpenseByTier } = useCalculator();

  const expense = useMemo(() => {
    return getExpenseByTier(selectedTier);
  }, [selectedTier, getExpenseByTier]);

  return [selectedTier, setSelectedTier, expense];
}

/**
 * useExpenseByTier - Get expense amount for a specific tier
 *
 * Returns the monthly expense amount for the specified tier.
 * Memoized to avoid recalculation on every render.
 *
 * @param {ExpenseTier} tier - The tier to get expense for
 * @returns {number} Monthly expense amount for the tier (0 if no baseline)
 *
 * @example
 * ```tsx
 * function ExpenseDisplay() {
 *   const bareExpense = useExpenseByTier('barebones');
 *   const comfExpense = useExpenseByTier('comfortable');
 *   const deluxeExpense = useExpenseByTier('deluxe');
 *
 *   return (
 *     <div>
 *       <p>Barebones: {formatCurrency(bareExpense)}</p>
 *       <p>Comfortable: {formatCurrency(comfExpense)}</p>
 *       <p>Deluxe: {formatCurrency(deluxeExpense)}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useExpenseByTier(tier: ExpenseTier): number {
  const { getExpenseByTier } = useCalculator();

  return useMemo(() => {
    return getExpenseByTier(tier);
  }, [tier, getExpenseByTier]);
}
