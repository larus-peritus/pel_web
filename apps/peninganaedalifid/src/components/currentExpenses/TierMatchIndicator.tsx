/**
 * TierMatchIndicator - Shows which tier the user's current expenses match
 *
 * Displays:
 * - Three tier buttons (Lágmark/Þægilegt/Lúxus)
 * - Highlights the closest matching tier
 * - Shows current total and difference from closest tier
 * - Visual indicator of over/under spending
 */

import React from 'react';
import type { BaselineComparisonData } from '@/types/currentExpenses';
import type { ExpenseTier } from '@/types/expenseBaseline';
import { formatCurrency } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

export interface TierMatchIndicatorProps {
  baselineComparison: BaselineComparisonData;
}

interface TierInfo {
  tier: ExpenseTier;
  label: string;
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    activeBg: string;
    activeBorder: string;
    activeText: string;
  };
}

const TIER_INFO: Record<ExpenseTier, TierInfo> = {
  barebones: {
    tier: 'barebones',
    label: 'Lágmark',
    icon: '🥉',
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      activeBg: 'bg-amber-100',
      activeBorder: 'border-amber-400',
      activeText: 'text-amber-900',
    },
  },
  comfortable: {
    tier: 'comfortable',
    label: 'Þægilegt',
    icon: '🥈',
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      activeBg: 'bg-blue-100',
      activeBorder: 'border-blue-400',
      activeText: 'text-blue-900',
    },
  },
  deluxe: {
    tier: 'deluxe',
    label: 'Lúxus',
    icon: '🥇',
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      activeBg: 'bg-purple-100',
      activeBorder: 'border-purple-400',
      activeText: 'text-purple-900',
    },
  },
};

/**
 * TierMatchIndicator - Visual display of tier matching
 */
export function TierMatchIndicator({
  baselineComparison,
}: TierMatchIndicatorProps) {
  const { closestTier, currentTotal, tierTotal, difference, differencePercentage } = baselineComparison;

  const isOver = difference > 0;
  const isSignificant = Math.abs(differencePercentage) >= 10; // 10% or more is significant

  return (
    <div className="space-y-6">
      {/* Tier Buttons */}
      <div className="grid grid-cols-3 gap-4">
        {Object.values(TIER_INFO).map((info) => {
          const isActive = info.tier === closestTier;
          const colors = info.color;

          return (
            <div
              key={info.tier}
              className={cn(
                'relative rounded-xl border-2 p-4 text-center transition-all',
                isActive
                  ? `${colors.activeBg} ${colors.activeBorder} shadow-md scale-105`
                  : `${colors.bg} ${colors.border} opacity-60`
              )}
            >
              <div className="text-3xl mb-2">{info.icon}</div>
              <div
                className={cn(
                  'font-semibold text-sm',
                  isActive ? colors.activeText : colors.text
                )}
              >
                {info.label}
              </div>
              {isActive && (
                <div className="mt-2 pt-2 border-t border-current/20">
                  <div className={cn('text-xs font-medium', colors.activeText)}>
                    Næst þínum útgjöldum
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Total vs Tier Total */}
      <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Núverandi útgjöld</div>
            <div className="text-2xl font-bold text-neutral-900">
              {formatCurrency(currentTotal)}
            </div>
          </div>
          <div className="text-3xl text-neutral-400">vs</div>
          <div className="text-right">
            <div className="text-sm text-neutral-600 mb-1">
              Áætlun ({TIER_INFO[closestTier].label})
            </div>
            <div className="text-2xl font-bold text-neutral-700">
              {formatCurrency(tierTotal)}
            </div>
          </div>
        </div>

        {/* Difference Display */}
        <div
          className={cn(
            'rounded-lg p-4 text-center border-2',
            isOver
              ? 'bg-danger-50 border-danger-200'
              : 'bg-success-50 border-success-200'
          )}
        >
          <div className={cn(
            'text-sm font-medium mb-1',
            isOver ? 'text-danger-700' : 'text-success-700'
          )}>
            {isOver ? 'Yfir áætlun' : 'Undir áætlun'}
          </div>
          <div className={cn(
            'text-3xl font-bold',
            isOver ? 'text-danger-900' : 'text-success-900'
          )}>
            {isOver ? '+' : ''}{formatCurrency(Math.abs(difference))}
          </div>
          <div className={cn(
            'text-sm mt-1',
            isOver ? 'text-danger-600' : 'text-success-600'
          )}>
            ({differencePercentage > 0 ? '+' : ''}{differencePercentage.toFixed(1)}%)
          </div>
        </div>

        {/* Interpretation Message */}
        {isSignificant && (
          <div className="text-sm text-neutral-600 text-center bg-white rounded-lg p-3 border border-neutral-200">
            {isOver ? (
              <>
                💡 Þú ert að eyða <strong>{Math.abs(differencePercentage).toFixed(0)}%</strong> meira en áætlað.
                Íhugaðu að skoða flokkasamanburð hér að neðan til að finna tækifæri til sparnaðar.
              </>
            ) : (
              <>
                🎉 Frábært! Þú ert að eyða <strong>{Math.abs(differencePercentage).toFixed(0)}%</strong> minna en áætlað.
                Þetta gæti verið tækifæri til að auka sparnað eða uppfæra áætlun.
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
