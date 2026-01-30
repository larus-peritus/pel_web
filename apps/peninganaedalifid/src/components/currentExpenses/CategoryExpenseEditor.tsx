'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui';
import { CategoryAccordion } from './CategoryAccordion';
import { AddCustomCategoryModal } from './AddCustomCategoryModal';
import { useCalculator } from '@/context/CalculatorContext';
import { getCategoryTotal } from '@/lib/calculations/currentExpenses';
import type { ExpenseCategory } from '@/types/currentExpenses';

export interface CategoryExpenseEditorProps {
  className?: string;
}

/**
 * CategoryExpenseEditor - Main container for editing expense categories
 *
 * Features:
 * - Accordion interface for all expense categories
 * - Track expanded/collapsed state per category
 * - Display category totals in headers
 * - Add custom category button
 * - Manage category visibility
 *
 * Requirements: FR-3.1, FR-3.2, US-3
 */
export function CategoryExpenseEditor({ className }: CategoryExpenseEditorProps) {
  const { currentExpenses, currentExpenseResults } = useCalculator();

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Modal state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // Expand all categories
  const expandAll = useCallback(() => {
    if (!currentExpenses) return;
    const allCategoryIds = currentExpenses.categories
      .filter((cat) => !cat.isHidden)
      .map((cat) => cat.id);
    setExpandedCategories(new Set(allCategoryIds));
  }, [currentExpenses]);

  // Collapse all categories
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  if (!currentExpenses) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <p className="text-neutral-600 text-center">
          Engin gögn um rauntímaútgjöld. Byrjaðu að bæta við útgjöldum.
        </p>
      </div>
    );
  }

  // Get visible categories sorted by order
  const visibleCategories = currentExpenses.categories
    .filter((cat) => !cat.isHidden)
    .sort((a, b) => a.order - b.order);

  const totalMonthly = currentExpenseResults?.totalMonthly || 0;
  const actualHourlyWage = currentExpenseResults?.lifeEnergy
    ? totalMonthly / currentExpenseResults.lifeEnergy.totalMonthlyHours
    : null;

  return (
    <div className={className}>
      {/* Header with expand/collapse controls */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Útgjaldaflokkar
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Smelltu á flokk til að bæta við eða breyta útgjöldum
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={expandAll}
            aria-label="Opna alla flokka"
          >
            Opna alla
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            aria-label="Loka öllum flokkum"
          >
            Loka öllum
          </Button>
        </div>
      </div>

      {/* Category accordions */}
      <div className="space-y-2">
        {visibleCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const categoryTotal = getCategoryTotal(category);
          const percentage = totalMonthly > 0 ? (categoryTotal / totalMonthly) * 100 : 0;
          const lifeEnergyHours =
            actualHourlyWage && actualHourlyWage > 0
              ? categoryTotal / actualHourlyWage
              : null;

          return (
            <CategoryAccordion
              key={category.id}
              category={category}
              isExpanded={isExpanded}
              onToggle={() => toggleCategory(category.id)}
              total={categoryTotal}
              percentage={percentage}
              lifeEnergyHours={lifeEnergyHours}
            />
          );
        })}
      </div>

      {/* Add custom category button */}
      <div className="mt-6">
        <Button
          variant="secondary"
          onClick={() => setShowAddCategoryModal(true)}
          className="w-full"
        >
          + Bæta við sérsniðnum flokki
        </Button>
      </div>

      {/* Add custom category modal */}
      {showAddCategoryModal && (
        <AddCustomCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
        />
      )}
    </div>
  );
}
