'use client';

import React, { useCallback, useMemo } from 'react';
import { CurrencyInput, Card, CardContent, Button } from '@/components/ui';
import { useCalculator } from '@/context/CalculatorContext';
import { formatNumber } from '@/lib/utils';
import type { ExpenseCategory, ExpenseTier } from '@/types/expenseBaseline';

export interface CategoryEditRowProps {
  category: ExpenseCategory;
  activeTier: ExpenseTier;
}

/**
 * Map expense baseline category IDs to current expense category IDs
 * Most are the same, but some might need mapping
 */
const CATEGORY_MAPPING: Record<string, string> = {
  husnaedi: 'husnaedi',
  matur: 'matur',
  samgongur: 'samgongur',
  veitur: 'veitur',
  tryggingar: 'tryggingar',
  personuleg: 'personuleg',
  askriftir: 'askriftir',
  ferdalog: 'ferdalog',
  afthreying: 'afthreying',
  born: 'born',
  annad: 'annad',
  heilsa: 'heilsa',
};

/**
 * Category Edit Row Component
 *
 * Single category row with inline editing for the active tier.
 *
 * Features:
 * - Category icon and name
 * - CurrencyInput for current tier value
 * - Life energy display (if AWH available)
 * - Hide/delete button (hide for defaults, delete for custom)
 *
 * Requirements: US-4, US-5
 */
export function CategoryEditRow({
  category,
  activeTier,
}: CategoryEditRowProps) {
  const {
    results,
    expenseBaselineResults,
    updateCategoryValues,
    toggleCategoryVisibility,
    removeCategory,
    currentExpenses,
  } = useCalculator();

  const currentValue = category.values[activeTier];

  // Get the matching current expense category
  const currentExpenseCategory = useMemo(() => {
    if (!currentExpenses) return null;
    const mappedId = CATEGORY_MAPPING[category.id] || category.id;
    return currentExpenses.categories.find((c) => c.id === mappedId) || null;
  }, [currentExpenses, category.id]);

  // Calculate amount from current expense report
  // For barebones: only essential items
  // For comfortable: all items
  const expenseReportAmount = useMemo(() => {
    if (!currentExpenseCategory) return null;

    if (activeTier === 'barebones') {
      // Only essential items
      return currentExpenseCategory.lineItems
        .filter((item) => item.isEssential)
        .reduce((sum, item) => sum + item.amount, 0);
    } else if (activeTier === 'comfortable') {
      // All items
      return currentExpenseCategory.lineItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
    }

    return null;
  }, [currentExpenseCategory, activeTier]);

  // Check if we can fetch from expense report
  const canFetchFromReport = expenseReportAmount !== null && expenseReportAmount > 0;

  // Handle fetching from expense report
  const handleFetchFromReport = useCallback(() => {
    if (expenseReportAmount !== null) {
      updateCategoryValues(category.id, {
        [activeTier]: expenseReportAmount,
      });
    }
  }, [updateCategoryValues, category.id, activeTier, expenseReportAmount]);

  // Calculate life energy for this category if AWH available
  const lifeEnergyHours = useMemo(() => {
    if (!results?.actualHourlyWage || !expenseBaselineResults?.lifeEnergy) {
      return null;
    }

    const categoryLifeEnergy =
      expenseBaselineResults.lifeEnergy.perCategory[category.id];
    if (!categoryLifeEnergy) return null;

    return categoryLifeEnergy[activeTier];
  }, [
    results,
    expenseBaselineResults,
    category.id,
    activeTier,
  ]);

  // Handle value change for current tier
  const handleValueChange = useCallback(
    (newValue: number) => {
      updateCategoryValues(category.id, {
        [activeTier]: newValue,
      });
    },
    [updateCategoryValues, category.id, activeTier]
  );

  // Handle hide/delete
  const handleRemove = useCallback(() => {
    if (category.isCustom) {
      // Custom categories are deleted
      if (confirm(`Ertu viss um að þú viljir eyða flokknum "${category.name}"?`)) {
        removeCategory(category.id);
      }
    } else {
      // Default categories are hidden
      toggleCategoryVisibility(category.id);
    }
  }, [category, removeCategory, toggleCategoryVisibility]);

  return (
    <Card variant="outlined" className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon and Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              {category.icon}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-medium text-neutral-900 truncate">
                {category.name}
              </h4>
              {category.isCustom && (
                <span className="text-xs text-neutral-500">
                  Sérsniðinn flokkur
                </span>
              )}
            </div>
          </div>

          {/* Value Input and Life Energy */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="w-full sm:w-40">
              <CurrencyInput
                value={currentValue}
                onChange={handleValueChange}
                placeholder="0"
                aria-label={`${category.name} útgjöld fyrir ${activeTier}`}
              />
            </div>

            {/* Fetch from expense report button - only for barebones and comfortable */}
            {(activeTier === 'barebones' || activeTier === 'comfortable') && (
              <button
                type="button"
                onClick={handleFetchFromReport}
                disabled={!canFetchFromReport}
                className={`text-xs px-2 py-1.5 rounded transition-colors whitespace-nowrap ${
                  canFetchFromReport
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
                title={
                  canFetchFromReport
                    ? activeTier === 'barebones'
                      ? `Sækja nauðsynleg útgjöld (${formatNumber(expenseReportAmount!, 0)} kr)`
                      : `Sækja öll útgjöld (${formatNumber(expenseReportAmount!, 0)} kr)`
                    : 'Engin gögn í útgjaldaskýrslu'
                }
              >
                {canFetchFromReport
                  ? 'Sækja úr útgjaldaskýrslu'
                  : 'Engin gögn'
                }
              </button>
            )}

            {/* Life Energy Display */}
            {lifeEnergyHours !== null && (
              <div className="text-sm text-neutral-600 whitespace-nowrap">
                ({formatNumber(lifeEnergyHours, 1)} klst)
              </div>
            )}

            {/* Hide/Delete Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="text-danger-600 hover:text-danger-700 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label={category.isCustom ? `Eyða ${category.name}` : `Fela ${category.name}`}
            >
              {category.isCustom ? 'Eyða' : 'Fela'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
