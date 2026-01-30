'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { MealCostSummary } from '@/types/calculator';

/**
 * Props for MealCostBreakdown component
 */
export interface MealCostBreakdownProps {
  summary: MealCostSummary;
  type: 'eatingOut' | 'homeCooking';
  actualHourlyWage: number;
  className?: string;
}

/**
 * MealCostBreakdown Component
 *
 * Displays detailed breakdown of meal costs by category with:
 * - Category name
 * - Amount (kr)
 * - Life energy (hours)
 * - Percentage of total
 * - Color-coded categories
 * - Collapsible on mobile
 */
export function MealCostBreakdown({
  summary,
  type,
  actualHourlyWage,
  className,
}: MealCostBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const title = type === 'eatingOut' ? 'Mat úti - Sundurliðun' : 'Heimaeldun - Sundurliðun';
  const { breakdown, monthlyCost } = summary;

  // Filter out zero-cost items
  const activeBreakdown = breakdown.filter((item) => item.monthlyCost > 0);

  if (activeBreakdown.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined" className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          {/* Mobile collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-primary-600 hover:text-primary-700 font-medium text-sm"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Fela sundurliðun' : 'Sýna sundurliðun'}
          >
            {isExpanded ? 'Fela' : 'Sýna'}
          </button>
        </div>
      </CardHeader>

      {/* Show content on desktop always, on mobile only when expanded */}
      <CardContent className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="space-y-3">
          {/* Header row - hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 text-sm font-medium text-neutral-600 pb-2 border-b border-neutral-200">
            <div>Flokkur</div>
            <div className="text-right">Upphæð</div>
            <div className="text-right">Lífsorka</div>
            <div className="text-right">Prósenta</div>
          </div>

          {/* Breakdown items */}
          {activeBreakdown.map((item, index) => (
            <div
              key={item.category}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 py-3 md:py-2 border-b border-neutral-100 last:border-b-0"
            >
              {/* Category */}
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(
                    item.category,
                    index
                  )}`}
                  aria-hidden="true"
                />
                <span className="font-medium text-neutral-800">{item.label}</span>
              </div>

              {/* Amount */}
              <div className="md:text-right">
                <span className="text-sm text-neutral-600 md:hidden mr-2">
                  Upphæð:
                </span>
                <span className="font-semibold text-neutral-800">
                  {formatCurrency(item.monthlyCost)}
                </span>
              </div>

              {/* Life Energy */}
              <div className="md:text-right">
                <span className="text-sm text-neutral-600 md:hidden mr-2">
                  Lífsorka:
                </span>
                <span className="font-medium text-warning-700">
                  {actualHourlyWage > 0
                    ? formatLifeEnergy(item.lifeEnergyHours)
                    : '—'}
                </span>
              </div>

              {/* Percentage */}
              <div className="md:text-right">
                <span className="text-sm text-neutral-600 md:hidden mr-2">
                  Prósenta:
                </span>
                <span className="font-medium text-neutral-700">
                  {formatNumber(Math.round(item.percentage))}%
                </span>
              </div>
            </div>
          ))}

          {/* Total row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 pt-3 border-t-2 border-neutral-300">
            <div className="font-bold text-neutral-800">Samtals</div>
            <div className="md:text-right">
              <span className="text-sm text-neutral-600 md:hidden mr-2">
                Upphæð:
              </span>
              <span className="font-bold text-neutral-900">
                {formatCurrency(monthlyCost)}
              </span>
            </div>
            <div className="md:text-right">
              <span className="text-sm text-neutral-600 md:hidden mr-2">
                Lífsorka:
              </span>
              <span className="font-bold text-warning-700">
                {actualHourlyWage > 0
                  ? formatLifeEnergy(summary.monthlyLifeEnergy)
                  : '—'}
              </span>
            </div>
            <div className="md:text-right">
              <span className="font-medium text-neutral-700">100%</span>
            </div>
          </div>
        </div>

        {/* Special note for home cooking time costs */}
        {type === 'homeCooking' && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              <strong>Athugið:</strong> Heimaeldunar kostnaður inniheldur bæði
              matvörukaup og tíma sem þú eyðir í innkaup og eldun, umreiknaður í
              krónutölur með raunverulegu tímakaupi þínu.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Get color class for category indicator dot
 */
function getCategoryColor(category: string, index: number): string {
  // Eating out categories
  if (category === 'breakfast') return 'bg-warning-500';
  if (category === 'lunch') return 'bg-primary-500';
  if (category === 'dinner') return 'bg-purple-500';
  if (category === 'coffee') return 'bg-orange-500';
  if (category === 'fastFood') return 'bg-error-500';

  // Home cooking categories
  if (category === 'groceries') return 'bg-success-500';
  if (category === 'shoppingTime') return 'bg-info-500';
  if (category === 'cookingTime') return 'bg-warning-500';

  // Fallback to index-based colors
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500',
    'bg-purple-500',
    'bg-orange-500',
  ];
  return colors[index % colors.length];
}
