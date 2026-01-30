'use client';

import React from 'react';
import { CurrencyInput } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface TargetInputProps {
  /** Current balance in ISK */
  currentBalance: number;
  /** Target amount value in ISK (undefined if not set) */
  value?: number;
  /** Callback when target changes */
  onChange: (value: number | undefined) => void;
  /** Actual hourly wage for life energy calculation (null if not available) */
  actualHourlyWage: number | null;
  /** Category ID for unique input ID */
  categoryId: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * TargetInput - Optional currency input for target amount with progress display
 *
 * Features:
 * - CurrencyInput for target (ISK) - optional
 * - Label: "Markmið (valfrjálst)"
 * - Progress bar showing current vs target
 * - Percentage display
 * - Remaining amount display
 * - Life energy for remaining (when AWH available)
 *
 * Requirements: US-4, FR-2.3, FR-3.5, FR-3.6, Task 3.5
 */
export function TargetInput({
  currentBalance,
  value,
  onChange,
  actualHourlyWage,
  categoryId,
  className,
}: TargetInputProps) {
  // Calculate progress if target is set
  const hasTarget = value !== undefined && value > 0;
  const progressPercentage = hasTarget
    ? Math.min((currentBalance / value) * 100, 100)
    : 0;

  const remaining = hasTarget && value > currentBalance
    ? value - currentBalance
    : 0;

  // Calculate life energy for remaining amount
  const remainingLifeEnergy = remaining > 0 && actualHourlyWage && actualHourlyWage > 0
    ? remaining / actualHourlyWage
    : null;

  // Handle clearing the target
  const handleChange = (newValue: number) => {
    if (newValue === 0) {
      onChange(undefined);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className={className}>
      <label
        htmlFor={`${categoryId}-target`}
        className="block text-sm font-medium text-neutral-700 mb-2"
      >
        Markmið <span className="text-neutral-500 font-normal">(valfrjálst)</span>
      </label>

      <CurrencyInput
        id={`${categoryId}-target`}
        value={value || 0}
        onChange={handleChange}
        placeholder="Engin markmið"
        aria-label={`Markmið fyrir ${categoryId}`}
      />

      {/* Progress display */}
      {hasTarget && (
        <div className="mt-4 space-y-2">
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progressPercentage >= 100
                    ? 'bg-success-500'
                    : progressPercentage >= 75
                    ? 'bg-primary-500'
                    : progressPercentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-danger-500'
                )}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          {/* Progress info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700">
              <span className="font-semibold">{formatCurrency(currentBalance)}</span>
              {' / '}
              {formatCurrency(value)}
            </span>
            <span className="font-semibold text-primary-600">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Remaining amount */}
          {remaining > 0 && (
            <div className="pt-2 border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Á eftir:</span>
                <div className="text-right">
                  <div className="font-semibold text-neutral-900">
                    {formatCurrency(remaining)}
                  </div>
                  {remainingLifeEnergy !== null && (
                    <div className="text-xs text-primary-600 mt-0.5">
                      ({formatNumber(remainingLifeEnergy, 0)} klst)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Goal reached */}
          {progressPercentage >= 100 && (
            <div className="flex items-center gap-2 text-sm text-success-700 bg-success-50 px-3 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Markmiði náð!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
