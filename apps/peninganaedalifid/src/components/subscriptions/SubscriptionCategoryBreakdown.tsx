'use client';

import React, { useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import type { SubscriptionCategory } from '@/types/calculator';
import { cn } from '@/lib/utils';

/**
 * Props for SubscriptionCategoryBreakdown component
 */
export interface SubscriptionCategoryBreakdownProps {
  className?: string;
}

/**
 * Color mapping for subscription categories
 * Uses Tailwind CSS color classes
 */
const CATEGORY_COLORS: Record<
  SubscriptionCategory,
  { bg: string; text: string }
> = {
  streaming: { bg: 'bg-blue-500', text: 'text-blue-700' },
  software: { bg: 'bg-purple-500', text: 'text-purple-700' },
  fitness: { bg: 'bg-green-500', text: 'text-green-700' },
  news: { bg: 'bg-orange-500', text: 'text-orange-700' },
  gaming: { bg: 'bg-red-500', text: 'text-red-700' },
  other: { bg: 'bg-gray-500', text: 'text-gray-700' },
};

/**
 * Icon mapping for subscription categories
 */
const CATEGORY_ICONS: Record<SubscriptionCategory, string> = {
  streaming: '\u{1F3AC}', // 🎬
  software: '\u{1F4BB}', // 💻
  fitness: '\u{1F4AA}', // 💪
  news: '\u{1F4F0}', // 📰
  gaming: '\u{1F3AE}', // 🎮
  other: '\u{1F4CB}', // 📋
};

/**
 * SubscriptionCategoryBreakdown Component
 *
 * Displays a breakdown of subscriptions by category, showing:
 * - Category name with icon
 * - Count of subscriptions in category
 * - Total monthly cost for category
 * - Progress bar showing percentage of total
 *
 * Categories are sorted by cost (highest first) from the context.
 *
 * @example
 * ```tsx
 * <SubscriptionCategoryBreakdown />
 * ```
 */
export function SubscriptionCategoryBreakdown({
  className,
}: SubscriptionCategoryBreakdownProps) {
  const { subscriptionSummary } = useCalculator();

  // Calculate total for percentage calculations
  const total = useMemo(() => {
    if (!subscriptionSummary) return 0;
    return subscriptionSummary.totalMonthly;
  }, [subscriptionSummary]);

  // Don't render if no summary or no categories with subscriptions
  if (!subscriptionSummary || subscriptionSummary.byCategory.length === 0) {
    return null;
  }

  // Filter out categories with no subscriptions
  const categoriesWithSubs = subscriptionSummary.byCategory.filter(
    (cat) => cat.count > 0
  );

  if (categoriesWithSubs.length === 0) {
    return null;
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Kostnaður eftir flokkum
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoriesWithSubs.map((category) => {
            const percentage =
              total > 0 ? (category.totalMonthly / total) * 100 : 0;
            const colors = CATEGORY_COLORS[category.category];
            const icon = CATEGORY_ICONS[category.category];

            return (
              <div key={category.category} className="space-y-2">
                {/* Category header with count and total */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {icon}
                    </span>
                    <span className={cn('font-medium', colors.text)}>
                      {category.label}
                    </span>
                    <span className="text-sm text-neutral-600">
                      ({category.count}{' '}
                      {category.count === 1 ? 'áskrift' : 'áskriftir'})
                    </span>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(category.totalMonthly)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          colors.bg
                        )}
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(percentage)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${category.label}: ${Math.round(percentage)}% af heildarkostnaði`}
                      />
                    </div>
                    <span className="min-w-[3rem] text-right text-sm font-medium text-neutral-700">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
