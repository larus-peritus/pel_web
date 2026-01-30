'use client';

import React, { useMemo } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { useCalculator } from '@/context/CalculatorContext';
import { TIER_LABELS, TIER_COLORS } from '@/lib/constants/expenseBaseline';
import type { ExpenseTier } from '@/types/expenseBaseline';

export interface TierTabSelectorProps {
  activeTier: ExpenseTier;
  onSelectTier: (tier: ExpenseTier) => void;
}

/**
 * Tier Tab Selector Component
 *
 * Tab selector for switching between the three expense tiers.
 *
 * Features:
 * - Three tabs with tier-specific colors
 * - Shows monthly total per tier
 * - Active state indication
 * - ARIA tabs pattern for accessibility
 * - Mobile-friendly (full width)
 *
 * Requirements: NFR-2 (visual distinction)
 */
export function TierTabSelector({
  activeTier,
  onSelectTier,
}: TierTabSelectorProps) {
  const { expenseBaselineResults } = useCalculator();

  const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

  // Get totals for each tier
  const totals = useMemo(() => {
    if (!expenseBaselineResults) {
      return {
        barebones: 0,
        comfortable: 0,
        deluxe: 0,
      };
    }
    return expenseBaselineResults.totals;
  }, [expenseBaselineResults]);

  return (
    <div
      role="tablist"
      aria-label="Veldu útgjaldagrunn"
      className="flex flex-col sm:flex-row gap-3"
    >
      {tiers.map((tier) => {
        const isActive = activeTier === tier;
        const colors = TIER_COLORS[tier];
        const label = TIER_LABELS[tier];
        const total = totals[tier];

        return (
          <button
            key={tier}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tier-panel-${tier}`}
            id={`tier-tab-${tier}`}
            onClick={() => onSelectTier(tier)}
            className={cn(
              // Base styles
              'flex-1 rounded-lg border-2 p-4 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              // Active state
              isActive
                ? cn(
                    colors.bg,
                    colors.border,
                    colors.text,
                    'shadow-md'
                  )
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
            )}
          >
            <div className="text-left">
              <div className={cn('text-sm font-medium mb-1', isActive ? colors.text : 'text-neutral-600')}>
                {label}
              </div>
              <div className={cn('text-2xl font-bold', isActive ? colors.text : 'text-neutral-900')}>
                {formatCurrency(total)}
              </div>
              <div className={cn('text-xs mt-1', isActive ? colors.text : 'text-neutral-500')}>
                kr/mán
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
