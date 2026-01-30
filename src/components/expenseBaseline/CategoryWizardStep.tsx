'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TIER_LABELS } from '@/lib/constants/expenseBaseline';
import type { ExpenseCategoryConfig, TierValues } from '@/types/expenseBaseline';
import { WizardNavigation } from './WizardNavigation';
import { useCalculator } from '@/context/CalculatorContext';

/**
 * Map expense baseline category IDs to current expense category IDs
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

export interface CategoryWizardStepProps {
  category: ExpenseCategoryConfig;
  values: TierValues;
  onChange: (values: TierValues) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onUseDefaults: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * CategoryWizardStep - Single category input step in wizard
 *
 * Displays one expense category with three tier inputs (barebones, comfortable, deluxe).
 * Shows category header with icon, name, and description.
 * Provides "Use defaults" button and default value hints.
 * Validates that tiers are in ascending order (warning, not blocking).
 */
export function CategoryWizardStep({
  category,
  values,
  onChange,
  onNext,
  onBack,
  onSkip,
  onUseDefaults,
  isFirstStep,
  isLastStep,
}: CategoryWizardStepProps) {
  const { currentExpenses } = useCalculator();
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Get the matching current expense category
  const currentExpenseCategory = useMemo(() => {
    if (!currentExpenses) return null;
    const mappedId = CATEGORY_MAPPING[category.id] || category.id;
    return currentExpenses.categories.find((c) => c.id === mappedId) || null;
  }, [currentExpenses, category.id]);

  // Calculate essential amount (for barebones)
  const essentialAmount = useMemo(() => {
    if (!currentExpenseCategory) return null;
    return currentExpenseCategory.lineItems
      .filter((item) => item.isEssential)
      .reduce((sum, item) => sum + item.amount, 0);
  }, [currentExpenseCategory]);

  // Calculate total amount (for comfortable)
  const totalAmount = useMemo(() => {
    if (!currentExpenseCategory) return null;
    return currentExpenseCategory.lineItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }, [currentExpenseCategory]);

  // Handle fetching from expense report
  const handleFetchBarebones = useCallback(() => {
    if (essentialAmount !== null) {
      onChange({ ...values, barebones: essentialAmount });
    }
  }, [essentialAmount, values, onChange]);

  const handleFetchComfortable = useCallback(() => {
    if (totalAmount !== null) {
      onChange({ ...values, comfortable: totalAmount });
    }
  }, [totalAmount, values, onChange]);

  const canFetchBarebones = essentialAmount !== null && essentialAmount > 0;
  const canFetchComfortable = totalAmount !== null && totalAmount > 0;

  // Update a specific tier value
  const handleTierChange = (tier: keyof TierValues, value: number) => {
    const newValues = { ...values, [tier]: value };
    onChange(newValues);

    // Validate tier ordering (warning only, not blocking)
    validateTierOrder(newValues);
  };

  // Validate that tiers are in ascending order
  const validateTierOrder = (tierValues: TierValues) => {
    if (tierValues.barebones > tierValues.comfortable) {
      setValidationWarning('Lágmarks ætti að vera lægra en Þægilegt');
    } else if (tierValues.comfortable > tierValues.deluxe) {
      setValidationWarning('Þægilegt ætti að vera lægra en Lúxus');
    } else {
      setValidationWarning(null);
    }
  };

  // Use default values for all tiers
  const handleUseDefaultsClick = () => {
    onChange({ ...category.defaults });
    setValidationWarning(null);
    onUseDefaults();
  };

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Category Header */}
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-4xl" role="img" aria-label={category.nameEn}>
            {category.icon}
          </div>

          {/* Name and Description */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-neutral-900">
              {category.nameIs}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {category.description}
            </p>

            {/* Subcategories (if available) */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-neutral-500">
                  T.d.: {category.subcategories.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 py-8">
        {/* Barebones Tier */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <CurrencyInput
              label={TIER_LABELS.barebones}
              value={values.barebones}
              onChange={(value) => handleTierChange('barebones', value)}
              helpText={`Sjálfgefið: ${formatCurrency(category.defaults.barebones)}`}
              id={`${category.id}-barebones`}
            />
          </div>
          <button
            type="button"
            onClick={handleFetchBarebones}
            disabled={!canFetchBarebones}
            className={`mb-1 text-xs px-2 py-1.5 rounded transition-colors whitespace-nowrap ${
              canFetchBarebones
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
            title={
              canFetchBarebones
                ? `Sækja nauðsynleg útgjöld (${formatNumber(essentialAmount!, 0)} kr)`
                : 'Engin gögn í útgjaldaskýrslu'
            }
          >
            {canFetchBarebones
              ? 'Sækja úr útgjaldaskýrslu'
              : 'Engin gögn'
            }
          </button>
        </div>

        {/* Comfortable Tier */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <CurrencyInput
              label={TIER_LABELS.comfortable}
              value={values.comfortable}
              onChange={(value) => handleTierChange('comfortable', value)}
              helpText={`Sjálfgefið: ${formatCurrency(category.defaults.comfortable)}`}
              id={`${category.id}-comfortable`}
            />
          </div>
          <button
            type="button"
            onClick={handleFetchComfortable}
            disabled={!canFetchComfortable}
            className={`mb-1 text-xs px-2 py-1.5 rounded transition-colors whitespace-nowrap ${
              canFetchComfortable
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
            title={
              canFetchComfortable
                ? `Sækja öll útgjöld (${formatNumber(totalAmount!, 0)} kr)`
                : 'Engin gögn í útgjaldaskýrslu'
            }
          >
            {canFetchComfortable
              ? 'Sækja úr útgjaldaskýrslu'
              : 'Engin gögn'
            }
          </button>
        </div>

        {/* Deluxe Tier */}
        <div>
          <CurrencyInput
            label={TIER_LABELS.deluxe}
            value={values.deluxe}
            onChange={(value) => handleTierChange('deluxe', value)}
            helpText={`Sjálfgefið: ${formatCurrency(category.defaults.deluxe)}`}
            id={`${category.id}-deluxe`}
          />
        </div>

        {/* Validation Warning */}
        {validationWarning && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Athugið:</span> {validationWarning}
            </p>
          </div>
        )}

        {/* Use Defaults Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUseDefaultsClick}
          >
            Nota sjálfgefin gildi
          </Button>
        </div>
      </CardContent>

      {/* Navigation */}
      <div className="border-t border-neutral-200 px-6 py-4">
        <WizardNavigation
          onBack={onBack}
          onNext={onNext}
          onSkip={onSkip}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          canProceed={true} // Always allow proceeding (validation is warning only)
        />
      </div>
    </Card>
  );
}
