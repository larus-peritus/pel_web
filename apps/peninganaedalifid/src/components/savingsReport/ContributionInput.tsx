'use client';

import React from 'react';
import { CurrencyInput } from '@/components/ui';
import { formatNumber } from '@/lib/utils';

export interface ContributionInputProps {
  /** Monthly contribution value in ISK */
  value: number;
  /** Callback when contribution changes */
  onChange: (value: number) => void;
  /** Actual hourly wage for life energy calculation (null if not available) */
  actualHourlyWage: number | null;
  /** Category ID for unique input ID */
  categoryId: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ContributionInput - Currency input for monthly contribution with life energy display
 *
 * Features:
 * - CurrencyInput component for ISK amounts
 * - Label: "Mánaðarleg framlög"
 * - Life energy display (X klst/mán) when AWH available
 * - Validation (non-negative)
 *
 * Requirements: US-3, FR-2.2, Task 3.4
 */
export function ContributionInput({
  value,
  onChange,
  actualHourlyWage,
  categoryId,
  className,
}: ContributionInputProps) {
  // Calculate life energy hours per month if AWH available
  const lifeEnergyHoursPerMonth = actualHourlyWage && actualHourlyWage > 0
    ? value / actualHourlyWage
    : null;

  // Format life energy display
  const lifeEnergyText = lifeEnergyHoursPerMonth !== null
    ? `(${formatNumber(lifeEnergyHoursPerMonth, 0)} klst/mán)`
    : null;

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-2">
        <label
          htmlFor={`${categoryId}-contribution`}
          className="block text-sm font-medium text-neutral-700"
        >
          Mánaðarleg framlög
        </label>
        {lifeEnergyText && (
          <span
            className="text-sm text-primary-600 font-medium"
            title="Lífsorka - vinnustundir á mánuði"
          >
            {lifeEnergyText}
          </span>
        )}
      </div>

      <CurrencyInput
        id={`${categoryId}-contribution`}
        value={value}
        onChange={onChange}
        placeholder="0 kr"
        aria-label={`Mánaðarleg framlög fyrir ${categoryId}`}
      />

      {!actualHourlyWage && (
        <p className="mt-1.5 text-xs text-neutral-500">
          Reiknaðu raunverulegt tímakaup til að sjá lífsorku
        </p>
      )}
    </div>
  );
}
