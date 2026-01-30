'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { TIER_LABELS, TIER_COLORS } from '@/lib/constants/expenseBaseline';
import { cn } from '@/lib/utils';
import type { ScenarioComparisonResult, ScenarioResult } from '@/types/fiNumber';
import type { ExpenseTier } from '@/types/expenseBaseline';

/**
 * Props for ScenarioComparison component
 */
export interface ScenarioComparisonProps {
  scenarios: ScenarioComparisonResult;
  selectedTier: ExpenseTier;
  multiplier: number;
  onTierSelect?: (tier: ExpenseTier) => void;
}

/**
 * ScenarioComparison Component
 *
 * Displays a comparison of FI numbers across all three expense tiers
 * (barebones, comfortable, deluxe) using the same multiplier.
 *
 * Features:
 * - Three-row comparison table/cards
 * - Highlights selected tier
 * - Shows differences from selected tier (+/- ISK)
 * - Responsive design (table on desktop, cards on mobile)
 * - Color-coded tiers matching expense baseline
 * - Click to select tier (optional callback)
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <ScenarioComparison
 *   scenarios={scenarios}
 *   selectedTier="comfortable"
 *   multiplier={30}
 *   onTierSelect={handleTierSelect}
 * />
 * ```
 */
export function ScenarioComparison({
  scenarios,
  selectedTier,
  multiplier,
  onTierSelect,
}: ScenarioComparisonProps) {
  const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

  /**
   * Format difference display (+15M kr or -20M kr)
   */
  const formatDifference = (diff: number): string => {
    if (diff === 0) return '±0 kr';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${formatCurrency(diff)}`;
  };

  /**
   * Get percentage display for difference
   */
  const formatPercentageDiff = (percentage: number): string => {
    if (percentage === 0) return '';
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${formatNumber(percentage, 1)}%`;
  };

  return (
    <Card variant="elevated">
      <CardHeader className="bg-neutral-50">
        <h3 className="text-lg md:text-xl font-bold text-neutral-800">
          Samanburður á FI-tölum
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          Hvernig mismunandi útgjaldaþrep hafa áhrif á FI-töluna þína ({formatNumber(multiplier, 0)}x margfaldari)
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-neutral-100 border-b-2 border-neutral-300">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700">
                  Útgjaldaþrep
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700">
                  Árleg útgjöld
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700">
                  FI-tala
                </th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700">
                  Mismunur
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => {
                const scenario = scenarios[tier];
                const isSelected = tier === selectedTier;
                const tierColor = TIER_COLORS[tier];
                const tierLabel = TIER_LABELS[tier];

                return (
                  <tr
                    key={tier}
                    className={cn(
                      'border-b border-neutral-200 transition-all',
                      isSelected && [
                        tierColor.bg,
                        'border-l-4',
                        tierColor.border,
                      ],
                      onTierSelect && 'cursor-pointer hover:bg-neutral-50',
                      !isSelected && 'hover:bg-neutral-50'
                    )}
                    onClick={() => onTierSelect?.(tier)}
                    role={onTierSelect ? 'button' : undefined}
                    tabIndex={onTierSelect ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (onTierSelect && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onTierSelect(tier);
                      }
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <div className={cn('w-1 h-1 rounded-full', tierColor.accent)} />
                        )}
                        <span className={cn(
                          'font-semibold',
                          isSelected ? tierColor.text : 'text-neutral-800'
                        )}>
                          {tierLabel}
                        </span>
                        {isSelected && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                            Valið
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        'font-medium',
                        isSelected ? tierColor.text : 'text-neutral-700'
                      )}>
                        {formatCurrency(scenario.annualExpenses)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        'text-lg font-bold',
                        isSelected ? tierColor.text : 'text-neutral-900'
                      )}>
                        {formatCurrency(scenario.fiNumber)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {scenario.difference ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={cn(
                            'font-medium',
                            scenario.difference.isk > 0 ? 'text-amber-700' : 'text-success-700'
                          )}>
                            {formatDifference(scenario.difference.isk)}
                          </span>
                          <span className="text-xs text-neutral-700">
                            {formatPercentageDiff(scenario.difference.percentage)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-700 italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 p-4">
          {tiers.map((tier) => {
            const scenario = scenarios[tier];
            const isSelected = tier === selectedTier;
            const tierColor = TIER_COLORS[tier];
            const tierLabel = TIER_LABELS[tier];

            return (
              <div
                key={tier}
                className={cn(
                  'border-2 rounded-lg p-4 transition-all',
                  isSelected
                    ? [tierColor.border, tierColor.bg, 'border-opacity-100']
                    : 'border-neutral-200 bg-white',
                  onTierSelect && 'cursor-pointer active:scale-98'
                )}
                onClick={() => onTierSelect?.(tier)}
                role={onTierSelect ? 'button' : undefined}
                tabIndex={onTierSelect ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onTierSelect && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onTierSelect(tier);
                  }
                }}
              >
                {/* Tier Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-bold text-base',
                      isSelected ? tierColor.text : 'text-neutral-800'
                    )}>
                      {tierLabel}
                    </span>
                    {isSelected && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                        Valið
                      </span>
                    )}
                  </div>
                </div>

                {/* Annual Expenses */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">Árleg útgjöld:</span>
                  <span className={cn(
                    'font-semibold',
                    isSelected ? tierColor.text : 'text-neutral-700'
                  )}>
                    {formatCurrency(scenario.annualExpenses)}
                  </span>
                </div>

                {/* FI Number */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600">FI-tala:</span>
                  <span className={cn(
                    'text-lg font-bold',
                    isSelected ? tierColor.text : 'text-neutral-900'
                  )}>
                    {formatCurrency(scenario.fiNumber)}
                  </span>
                </div>

                {/* Difference */}
                {scenario.difference && (
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                    <span className="text-sm text-neutral-600">Mismunur:</span>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={cn(
                        'font-medium',
                        scenario.difference.isk > 0 ? 'text-amber-700' : 'text-success-700'
                      )}>
                        {formatDifference(scenario.difference.isk)}
                      </span>
                      <span className="text-xs text-neutral-700">
                        {formatPercentageDiff(scenario.difference.percentage)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            <span className="font-semibold">Ábending:</span> Þetta sýnir hvernig valið á útgjaldaþrepi hefur áhrif á heildar FI-tölu þína.
            Hærri útgjöld krefjast stærri FI-tölu til að viðhalda sama lífsstíl.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
