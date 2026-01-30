/**
 * Main container component for Cascading Expense Cut Calculator
 * Orchestrates all child components and manages state
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ExpenseBaseline, ExpenseTier } from '@/types/expenseBaseline';
import type {
  CascadingCutCategory,
  CascadingCutSettings,
  FIInputs,
} from '@/types/cascadingCut';
import {
  initializeCategoriesFromExpenseReport,
  calculateCascadingCuts,
  calculateCascadingImpact,
  reorderCategories,
  getCategoryPriorities,
} from '@/lib/calculations/cascadingCut';
import { safeGetItem, safeSetItem } from '@/lib/storage/localStorage';
import { formatCurrency } from '@/lib/utils/formatters';

import { TargetAmountInput } from './TargetAmountInput';
import { CategoryPriorityList } from './CategoryPriorityList';
import { CascadingImpactSummary } from './CascadingImpactSummary';
import { NoExpenseDataNotice } from './NoExpenseDataNotice';

interface CascadingCutCalculatorProps {
  expenseBaseline: ExpenseBaseline | null;
  actualHourlyWage: number;
  fiInputs?: FIInputs;
  tier?: ExpenseTier;
  className?: string;
}

const STORAGE_KEY = 'cascadingCutSettings';

export function CascadingCutCalculator({
  expenseBaseline,
  actualHourlyWage,
  fiInputs,
  tier = 'comfortable',
  className = '',
}: CascadingCutCalculatorProps) {
  // State
  const [targetAmount, setTargetAmount] = useState<number>(50000);
  const [categories, setCategories] = useState<CascadingCutCategory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize categories from expense baseline
  useEffect(() => {
    if (!expenseBaseline?.categories?.length) {
      setCategories([]);
      setIsInitialized(true);
      return;
    }

    // Load saved settings
    const savedSettings = safeGetItem<CascadingCutSettings>(STORAGE_KEY);

    // Initialize categories with saved priorities
    const initialCategories = initializeCategoriesFromExpenseReport(
      expenseBaseline.categories,
      tier,
      savedSettings?.categoryPriorities
    );

    setCategories(initialCategories);

    // Restore target amount if saved
    if (savedSettings?.targetAmount !== undefined) {
      setTargetAmount(savedSettings.targetAmount);
    }

    setIsInitialized(true);
  }, [expenseBaseline, tier]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isInitialized) return;

    const settings: CascadingCutSettings = {
      targetAmount,
      categoryPriorities: getCategoryPriorities(categories),
      lastUpdated: new Date().toISOString(),
    };
    safeSetItem(STORAGE_KEY, settings);
  }, [targetAmount, categories, isInitialized]);

  // Handle category reorder
  const handleReorder = useCallback(
    (categoryId: string, direction: 'up' | 'down') => {
      setCategories((prev) => reorderCategories(prev, categoryId, direction));
    },
    []
  );

  // Calculate cuts with cascade algorithm
  const cutResult = useMemo(() => {
    return calculateCascadingCuts(categories, targetAmount);
  }, [categories, targetAmount]);

  // Calculate aggregate impact
  const impact = useMemo(() => {
    return calculateCascadingImpact(cutResult, actualHourlyWage, fiInputs);
  }, [cutResult, actualHourlyWage, fiInputs]);

  // Check if we have expense data
  const hasExpenseData =
    expenseBaseline?.categories?.some(
      (cat) => !cat.isHidden && cat.values[tier] > 0
    ) ?? false;

  // Show empty state if no expense data
  if (isInitialized && !hasExpenseData) {
    return <NoExpenseDataNotice className={className} />;
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-20 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <TargetAmountInput
        value={targetAmount}
        onChange={setTargetAmount}
        maxAmount={cutResult.totalExpenses}
      />

      {cutResult.unallocatedAmount > 0 && (
        <aside className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p>
            <strong>⚠️ Ath:</strong> Markmiðið ({formatCurrency(targetAmount)}) er
            hærra en heildar útgjöld ({formatCurrency(cutResult.totalExpenses)}).
            Hámarks niðurskurður er{' '}
            {formatCurrency(cutResult.allocatedAmount)}/mán.
          </p>
        </aside>
      )}

      <CategoryPriorityList
        categories={cutResult.categories}
        onReorder={handleReorder}
      />

      <CascadingImpactSummary impact={impact} hasFIInputs={!!fiInputs} />

      {!fiInputs && (
        <aside className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p>
            <strong>💡 Ábending:</strong> Settu upp FI markmið til að sjá hversu
            miklu skiptir fyrir FI dagsetninguna þína.
          </p>
        </aside>
      )}
    </section>
  );
}
