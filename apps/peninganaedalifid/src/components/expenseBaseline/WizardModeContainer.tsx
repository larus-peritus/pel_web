'use client';

import React, { useState, useCallback } from 'react';
import { DEFAULT_EXPENSE_CATEGORIES } from '@/lib/constants/expenseBaseline';
import type { TierValues, ExpenseCategoryConfig } from '@/types/expenseBaseline';
import { WizardProgress } from './WizardProgress';
import { CategoryWizardStep } from './CategoryWizardStep';
import { WizardSummaryStep } from './WizardSummaryStep';

export interface WizardModeContainerProps {
  onComplete: (categories: Record<string, TierValues>) => void;
  onCancel: () => void;
}

interface WizardState {
  currentStep: number; // 0 = intro, 1-10 = categories, 11 = summary
  values: Record<string, TierValues>;
  skippedCategories: string[];
}

/**
 * WizardModeContainer - Step-by-step guided builder for expense baseline
 *
 * Guides first-time users through setting up their expense baseline by
 * presenting one category at a time. Users can accept defaults, customize
 * values, or skip categories.
 *
 * Steps:
 * - Step 0: Introduction (not yet implemented, goes straight to categories)
 * - Steps 1-10: One step per category
 * - Step 11: Summary and confirmation
 */
export function WizardModeContainer({
  onComplete,
  onCancel,
}: WizardModeContainerProps) {
  // Initialize state with default values for all categories
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    const initialValues: Record<string, TierValues> = {};
    DEFAULT_EXPENSE_CATEGORIES.forEach((category) => {
      initialValues[category.id] = { ...category.defaults };
    });

    return {
      currentStep: 0, // Start at step 0 (first category)
      values: initialValues,
      skippedCategories: [],
    };
  });

  const totalSteps = DEFAULT_EXPENSE_CATEGORIES.length + 1; // categories + summary

  // Get current category (null for summary step)
  const getCurrentCategory = useCallback((): ExpenseCategoryConfig | null => {
    if (wizardState.currentStep >= DEFAULT_EXPENSE_CATEGORIES.length) {
      return null; // Summary step
    }
    return DEFAULT_EXPENSE_CATEGORIES[wizardState.currentStep];
  }, [wizardState.currentStep]);

  // Update values for current category
  const handleCategoryChange = useCallback((values: TierValues) => {
    const category = getCurrentCategory();
    if (!category) return;

    setWizardState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [category.id]: values,
      },
    }));
  }, [getCurrentCategory]);

  // Navigate to next step
  const handleNext = useCallback(() => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, totalSteps - 1),
    }));
  }, [totalSteps]);

  // Navigate to previous step
  const handleBack = useCallback(() => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Skip current category (use defaults)
  const handleSkip = useCallback(() => {
    const category = getCurrentCategory();
    if (!category) return;

    setWizardState((prev) => ({
      ...prev,
      skippedCategories: [...prev.skippedCategories, category.id],
      currentStep: prev.currentStep + 1,
    }));
  }, [getCurrentCategory]);

  // Use default values for current category
  const handleUseDefaults = useCallback(() => {
    const category = getCurrentCategory();
    if (!category) return;

    setWizardState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [category.id]: { ...category.defaults },
      },
    }));
  }, [getCurrentCategory]);

  // Navigate to specific step (from summary)
  const handleGoToStep = useCallback((stepIndex: number) => {
    setWizardState((prev) => ({
      ...prev,
      currentStep: stepIndex,
    }));
  }, []);

  // Complete wizard
  const handleFinish = useCallback(() => {
    onComplete(wizardState.values);
  }, [wizardState.values, onComplete]);

  const currentCategory = getCurrentCategory();
  const isSummaryStep = wizardState.currentStep >= DEFAULT_EXPENSE_CATEGORIES.length;
  const isFirstStep = wizardState.currentStep === 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress indicator */}
      <WizardProgress
        currentStep={wizardState.currentStep}
        totalSteps={totalSteps}
        currentCategoryName={currentCategory?.nameIs || 'Yfirlit'}
      />

      {/* Step content */}
      <div className="mt-6">
        {isSummaryStep ? (
          // Summary step
          <WizardSummaryStep
            values={wizardState.values}
            categories={DEFAULT_EXPENSE_CATEGORIES}
            onBack={handleBack}
            onFinish={handleFinish}
            onEditCategory={handleGoToStep}
          />
        ) : currentCategory ? (
          // Category step
          <CategoryWizardStep
            category={currentCategory}
            values={wizardState.values[currentCategory.id]}
            onChange={handleCategoryChange}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
            onUseDefaults={handleUseDefaults}
            isFirstStep={isFirstStep}
            isLastStep={wizardState.currentStep === DEFAULT_EXPENSE_CATEGORIES.length - 1}
          />
        ) : null}
      </div>

      {/* Cancel button (always available) */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-neutral-600 hover:text-neutral-800 underline"
        >
          Hætta við og loka leiðsögn
        </button>
      </div>
    </div>
  );
}
