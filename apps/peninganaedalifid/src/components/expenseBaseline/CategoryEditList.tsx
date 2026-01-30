'use client';

import React, { useState, useMemo } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { useCalculator } from '@/context/CalculatorContext';
import { CategoryEditRow } from './CategoryEditRow';
import { AddCustomCategoryModal } from './AddCustomCategoryModal';
import type { ExpenseTier } from '@/types/expenseBaseline';

export interface CategoryEditListProps {
  activeTier: ExpenseTier;
}

/**
 * Category Edit List Component
 *
 * List of editable category rows for the selected tier.
 *
 * Features:
 * - Maps over visible categories
 * - Renders CategoryEditRow for each
 * - Add custom category button
 * - Show/hide hidden categories section
 * - Proper ordering of categories
 *
 * Requirements: FR-1.2, FR-1.3, US-5
 */
export function CategoryEditList({ activeTier }: CategoryEditListProps) {
  const { expenseBaseline, toggleCategoryVisibility } = useCalculator();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showHiddenCategories, setShowHiddenCategories] = useState(false);

  // Split categories into visible and hidden
  const { visibleCategories, hiddenCategories } = useMemo(() => {
    if (!expenseBaseline) {
      return { visibleCategories: [], hiddenCategories: [] };
    }

    const visible = expenseBaseline.categories
      .filter((cat) => !cat.isHidden)
      .sort((a, b) => a.order - b.order);

    const hidden = expenseBaseline.categories
      .filter((cat) => cat.isHidden)
      .sort((a, b) => a.order - b.order);

    return { visibleCategories: visible, hiddenCategories: hidden };
  }, [expenseBaseline]);

  if (!expenseBaseline) {
    return (
      <Card variant="outlined">
        <CardContent>
          <p className="text-neutral-600">
            Enginn útgjaldagrunnur fundinn. Byrjaðu á leiðsögn til að setja upp útgjaldagrunn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visible Categories Section */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Flokkar
        </h3>

        <div className="space-y-3">
          {visibleCategories.map((category) => (
            <CategoryEditRow
              key={category.id}
              category={category}
              activeTier={activeTier}
            />
          ))}
        </div>

        {/* Add Custom Category Button */}
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto"
          >
            + Bæta við flokki
          </Button>
        </div>
      </div>

      {/* Hidden Categories Section */}
      {hiddenCategories.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowHiddenCategories(!showHiddenCategories)}
            className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900 focus:outline-none focus:text-neutral-900"
          >
            <span className="mr-2">
              {showHiddenCategories ? '▼' : '▶'}
            </span>
            Faldir flokkar ({hiddenCategories.length})
          </button>

          {showHiddenCategories && (
            <div className="mt-3 space-y-3 opacity-50">
              {hiddenCategories.map((category) => (
                <CategoryEditRow
                  key={category.id}
                  category={category}
                  activeTier={activeTier}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Custom Category Modal */}
      {isAddModalOpen && (
        <AddCustomCategoryModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
