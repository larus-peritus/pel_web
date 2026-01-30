import React from 'react';
import { cn } from '@/lib/utils';
import type { ExpenseTier } from '@/types/expenseBaseline';
import { TIER_LABELS, TIER_COLORS } from '@/lib/constants/expenseBaseline';
import { formatCurrency } from '@/lib/utils/formatters';

export interface TierSelectorProps {
  selectedTier: ExpenseTier | null;
  onSelectTier: (tier: ExpenseTier) => void;
  showExpenseAmount?: boolean;
  compact?: boolean;
  disabled?: boolean;
  tierExpenses?: {
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
}

/**
 * TierSelector - Embeddable tier selector for other calculators
 *
 * This component can work standalone without accessing context directly.
 * Parent components pass tierExpenses via props.
 *
 * Features:
 * - Three tier radio buttons (Lágmarks, Þægilegt, Lúxus)
 * - Optional expense amount display
 * - Compact mode for sidebars
 * - Accessible radio group pattern
 * - Color-coded tiers (Amber/Green/Purple)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TierSelector
 *   selectedTier={selectedTier}
 *   onSelectTier={setSelectedTier}
 * />
 *
 * // With expense amounts
 * <TierSelector
 *   selectedTier={selectedTier}
 *   onSelectTier={setSelectedTier}
 *   showExpenseAmount
 *   tierExpenses={{ barebones: 250000, comfortable: 520000, deluxe: 1000000 }}
 * />
 *
 * // Compact mode
 * <TierSelector
 *   selectedTier={selectedTier}
 *   onSelectTier={setSelectedTier}
 *   compact
 * />
 * ```
 */
export function TierSelector({
  selectedTier,
  onSelectTier,
  showExpenseAmount = false,
  compact = false,
  disabled = false,
  tierExpenses,
}: TierSelectorProps) {
  const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Veldu útgjaldagrunn
      </label>

      <div
        role="radiogroup"
        aria-label="Veldu útgjaldagrunn"
        className={cn(
          'grid gap-3',
          compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'
        )}
      >
        {tiers.map((tier) => {
          const isSelected = selectedTier === tier;
          const tierColor = TIER_COLORS[tier];
          const tierLabel = TIER_LABELS[tier];
          const expense = tierExpenses?.[tier];

          return (
            <button
              key={tier}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => !disabled && onSelectTier(tier)}
              className={cn(
                'relative rounded-lg border-2 p-4 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? [
                      tierColor.border,
                      tierColor.bg,
                      'border-opacity-100',
                      'focus:ring-primary-500',
                    ]
                  : [
                      'border-neutral-200',
                      'bg-white',
                      'hover:border-neutral-300',
                      'focus:ring-primary-500',
                    ],
                compact ? 'py-3' : ''
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* Radio indicator */}
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        'transition-colors',
                        isSelected
                          ? [tierColor.accent, 'border-current']
                          : 'border-neutral-400'
                      )}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Tier label */}
                    <span
                      className={cn(
                        'font-medium',
                        compact ? 'text-sm' : 'text-base',
                        isSelected ? tierColor.text : 'text-neutral-700'
                      )}
                    >
                      {tierLabel}
                    </span>
                  </div>

                  {/* Expense amount */}
                  {showExpenseAmount && expense !== undefined && (
                    <div
                      className={cn(
                        'mt-1 ml-7',
                        compact ? 'text-xs' : 'text-sm',
                        isSelected ? tierColor.text : 'text-neutral-600'
                      )}
                    >
                      {formatCurrency(expense)}/mán
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
