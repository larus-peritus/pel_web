'use client';

import React from 'react';
import { CurrencyInput } from '@/components/ui';
import { formatNumber } from '@/lib/utils';

export interface BalanceInputProps {
  /** Current balance value in ISK */
  value: number;
  /** Callback when balance changes */
  onChange: (value: number) => void;
  /** Actual hourly wage for life energy calculation (null if not available) */
  actualHourlyWage: number | null;
  /** Category ID for unique input ID */
  categoryId: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * BalanceInput - Currency input for current balance with life energy display
 *
 * Features:
 * - CurrencyInput component for ISK amounts
 * - Label: "Núverandi staða"
 * - Life energy display (X klst) when AWH available
 * - Validation (non-negative)
 *
 * Requirements: US-2, FR-2.1, Task 3.3
 */
export function BalanceInput({
  value,
  onChange,
  actualHourlyWage,
  categoryId,
  className,
}: BalanceInputProps) {
  // Calculate life energy hours if AWH available
  const lifeEnergyHours = actualHourlyWage && actualHourlyWage > 0
    ? value / actualHourlyWage
    : null;

  // Format life energy display
  const lifeEnergyText = lifeEnergyHours !== null
    ? `(${formatNumber(lifeEnergyHours, 0)} klst)`
    : null;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={`${categoryId}-balance`}
          className="block text-sm font-medium text-neutral-700"
        >
          Núverandi staða
        </label>
        {lifeEnergyText && (
          <span
            className="text-sm text-primary-600 font-medium"
            title="Lífsorka - vinnustundir"
          >
            {lifeEnergyText}
          </span>
        )}
      </div>

      <CurrencyInput
        id={`${categoryId}-balance`}
        value={value}
        onChange={onChange}
        placeholder="0 kr"
        aria-label={`Núverandi staða fyrir ${categoryId}`}
      />

      {!actualHourlyWage && (
        <p className="mt-1.5 text-xs text-neutral-500">
          Reiknaðu raunverulegt tímakaup til að sjá lífsorku
        </p>
      )}
    </div>
  );
}
