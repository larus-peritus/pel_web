/**
 * BaselineChangeNotification Component
 *
 * Displays a notification when expense baseline changes affect Coast FIRE results.
 * Provides user feedback about automatic recalculation and option to review.
 *
 * Features:
 * - Auto-dismiss after 5 seconds
 * - Manual dismiss option
 * - Shows which tier is being used
 * - Link to expense baseline tool
 * - Icelandic labels and formatting
 *
 * Epic 6, Task 6.2
 */

'use client';

import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import type { ExpenseTier } from '@/types/expenseBaseline';

export interface BaselineChangeNotificationProps {
  /** Which tier is currently selected */
  selectedTier: ExpenseTier;
  /** New FI number calculated from baseline */
  newFINumber: number;
  /** Previous FI number (for comparison) */
  previousFINumber: number | null;
  /** Callback when notification is dismissed */
  onDismiss: () => void;
  /** Optional: Auto-dismiss after milliseconds (default 5000) */
  autoDismissMs?: number;
  className?: string;
}

/**
 * Get tier label in Icelandic
 */
const getTierLabel = (tier: ExpenseTier): string => {
  const labels: Record<ExpenseTier, string> = {
    barebones: 'Lágmarks',
    comfortable: 'Þægileg',
    deluxe: 'Lúxus',
  };
  return labels[tier];
};

export function BaselineChangeNotification({
  selectedTier,
  newFINumber,
  previousFINumber,
  onDismiss,
  autoDismissMs = 5000,
  className,
}: BaselineChangeNotificationProps) {
  // Auto-dismiss timer
  React.useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);

      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  // Calculate change
  const hasChanged = previousFINumber !== null && previousFINumber !== newFINumber;
  const changeAmount = previousFINumber ? newFINumber - previousFINumber : 0;
  const changeDirection = changeAmount > 0 ? 'hækkaði' : 'lækkaði';
  const changePercent = previousFINumber
    ? Math.abs((changeAmount / previousFINumber) * 100)
    : 0;

  return (
    <Alert
      variant="info"
      className={className}
      onDismiss={onDismiss}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Útgjaldagrunnur uppfærður
          </h3>
          <p className="mt-1 text-sm text-blue-800">
            FI-talan þín hefur verið uppfærð sjálfkrafa út frá breyttum útgjaldagrunni.
          </p>
        </div>

        <div className="rounded-lg bg-blue-100 p-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Lífsstíll:</span>
              <span className="font-semibold text-blue-900">
                {getTierLabel(selectedTier)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Ný FI-tala:</span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(newFINumber)}
              </span>
            </div>
            {hasChanged && (
              <div className="flex items-center justify-between pt-1 border-t border-blue-200">
                <span className="text-blue-700">Breyting:</span>
                <span
                  className={`font-semibold ${
                    changeAmount > 0 ? 'text-amber-700' : 'text-green-700'
                  }`}
                >
                  {changeAmount > 0 ? '+' : ''}
                  {formatCurrency(changeAmount)} ({changeDirection}{' '}
                  {changePercent.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.location.href = '/reiknivaelir?calc=utgjaldareiknivel';
            }}
          >
            Skoða útgjaldagrunn
          </Button>
          <Button variant="secondary" size="sm" onClick={onDismiss}>
            Í lagi
          </Button>
        </div>

        <p className="text-xs text-blue-600">
          Þessi tilkynning hverfur sjálfkrafa eftir {autoDismissMs / 1000} sekúndur
        </p>
      </div>
    </Alert>
  );
}
