'use client';

import React, { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui';
import { CategoryAccordion } from './CategoryAccordion';
import type { SavingsCategory, SavingsCategoryData } from '@/types/savingsReport';

/**
 * SavingsEditor - Main container for editing savings categories
 *
 * Features:
 * - Track expanded/collapsed state per category
 * - Display category accordions sorted by order
 * - Expand all / collapse all controls
 * - Hidden categories section
 *
 * Requirements: FR-1.3, US-1, Task 3.1
 */
export function SavingsEditor() {
  const {
    savingsReport,
    updateSavingsCategory,
    toggleSavingsCategoryVisibility,
    results
  } = useCalculator();

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showHidden, setShowHidden] = useState(false);

  // If no savings report yet, show loading/empty state
  if (!savingsReport) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600">Hleður sparnaðarflokka...</p>
      </div>
    );
  }

  // Get actual hourly wage for life energy calculations
  const actualHourlyWage = results?.actualHourlyWage || null;

  // Separate visible and hidden categories
  const visibleCategories = savingsReport.categories
    .filter(cat => !cat.isHidden)
    .sort((a, b) => a.order - b.order);

  const hiddenCategories = savingsReport.categories
    .filter(cat => cat.isHidden)
    .sort((a, b) => a.order - b.order);

  // Toggle individual category
  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Expand all visible categories
  const handleExpandAll = () => {
    const expanded: Record<string, boolean> = {};
    visibleCategories.forEach(cat => {
      expanded[cat.id] = true;
    });
    setExpandedCategories(expanded);
  };

  // Collapse all categories
  const handleCollapseAll = () => {
    setExpandedCategories({});
  };

  // Update category data
  const handleCategoryUpdate = (categoryId: string, data: Partial<SavingsCategoryData>) => {
    updateSavingsCategory(categoryId, data);
  };

  // Toggle category visibility
  const handleToggleVisibility = (categoryId: string) => {
    toggleSavingsCategoryVisibility(categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Breyta sparnaði
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Smelltu á flokk til að bæta við eða breyta sparnaði
          </p>
        </div>

        {/* Expand/collapse controls */}
        {visibleCategories.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExpandAll}
            >
              Opna alla
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCollapseAll}
            >
              Loka öllum
            </Button>
          </div>
        )}
      </div>

      {/* Visible categories */}
      <div className="space-y-3">
        {visibleCategories.map(category => (
          <CategoryAccordion
            key={category.id}
            category={category}
            isExpanded={expandedCategories[category.id] || false}
            onToggle={() => handleToggleCategory(category.id)}
            actualHourlyWage={actualHourlyWage}
            onChange={(data) => handleCategoryUpdate(category.id, data)}
            onToggleVisibility={() => handleToggleVisibility(category.id)}
          />
        ))}
      </div>

      {/* Hidden categories section */}
      {hiddenCategories.length > 0 && (
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showHidden ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Faldir flokkar ({hiddenCategories.length})</span>
          </button>

          {showHidden && (
            <div className="mt-4 space-y-3">
              {hiddenCategories.map(category => (
                <CategoryAccordion
                  key={category.id}
                  category={category}
                  isExpanded={expandedCategories[category.id] || false}
                  onToggle={() => handleToggleCategory(category.id)}
                  actualHourlyWage={actualHourlyWage}
                  onChange={(data) => handleCategoryUpdate(category.id, data)}
                  onToggleVisibility={() => handleToggleVisibility(category.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {visibleCategories.length === 0 && (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-600">
            Allir flokkar eru faldir. Smelltu á "Faldir flokkar" til að sýna þá aftur.
          </p>
        </div>
      )}
    </div>
  );
}
