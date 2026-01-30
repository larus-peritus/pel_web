'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { TIER_LABELS, TIER_COLORS } from '@/lib/constants/expenseBaseline';
import type { TierValues, ExpenseCategoryConfig, ExpenseTier } from '@/types/expenseBaseline';
import { cn } from '@/lib/utils';

export interface WizardSummaryStepProps {
  values: Record<string, TierValues>;
  categories: ExpenseCategoryConfig[];
  onBack: () => void;
  onFinish: () => void;
  onEditCategory: (stepIndex: number) => void;
}

/**
 * WizardSummaryStep - Final summary before saving baseline
 *
 * Shows totals for all three tiers in summary cards.
 * Lists all categories with their values.
 * Allows editing specific categories.
 * Confirms and saves the baseline.
 */
export function WizardSummaryStep({
  values,
  categories,
  onBack,
  onFinish,
  onEditCategory,
}: WizardSummaryStepProps) {
  // Calculate totals for each tier
  const totals = useMemo(() => {
    const result: TierValues = {
      barebones: 0,
      comfortable: 0,
      deluxe: 0,
    };

    categories.forEach((category) => {
      const categoryValues = values[category.id];
      if (categoryValues) {
        result.barebones += categoryValues.barebones;
        result.comfortable += categoryValues.comfortable;
        result.deluxe += categoryValues.deluxe;
      }
    });

    return result;
  }, [values, categories]);

  // Handle edit category click
  const handleEditCategory = (categoryIndex: number) => {
    onEditCategory(categoryIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900">
          Yfirlit
        </h2>
        <p className="mt-2 text-neutral-600">
          Yfirfarðu útgjaldagrunn þinn áður en þú vistar
        </p>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(['barebones', 'comfortable', 'deluxe'] as ExpenseTier[]).map((tier) => (
          <Card
            key={tier}
            variant="outlined"
            className={cn(
              'border-2 transition-shadow hover:shadow-md',
              TIER_COLORS[tier].border
            )}
          >
            <CardContent className={cn('py-6 text-center', TIER_COLORS[tier].bg)}>
              <h3 className={cn('text-lg font-semibold', TIER_COLORS[tier].text)}>
                {TIER_LABELS[tier]}
              </h3>
              <p className="mt-3 text-3xl font-bold text-neutral-900">
                {formatCurrency(totals[tier])}
              </p>
              <p className="mt-1 text-sm text-neutral-600">á mánuði</p>
              <p className="mt-2 text-sm font-medium text-neutral-700">
                {formatCurrency(totals[tier] * 12)} á ári
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Breakdown */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold text-neutral-900">
            Sundurliðun eftir flokkum
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category, index) => {
              const categoryValues = values[category.id];
              if (!categoryValues) return null;

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-b-0"
                >
                  {/* Category Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={category.nameEn}>
                      {category.icon}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {category.nameIs}
                    </span>
                  </div>

                  {/* Values */}
                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-right">
                        <p className="text-neutral-600">
                          {formatCurrency(categoryValues.barebones)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">
                          {formatCurrency(categoryValues.comfortable)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-600">
                          {formatCurrency(categoryValues.deluxe)}
                        </p>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(index)}
                      className="ml-2"
                    >
                      Breyta
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
        >
          ← Til baka
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={onFinish}
        >
          Vista útgjaldagrunn
        </Button>
      </div>

      {/* Help Text */}
      <div className="rounded-lg bg-primary-50 border border-primary-200 px-4 py-3">
        <p className="text-sm text-primary-800">
          Eftir að þú vistar getur þú alltaf breytt útgjaldagrunni þínum í
          Fljótlegri breytingu (Quick Edit) hamnum.
        </p>
      </div>
    </div>
  );
}
