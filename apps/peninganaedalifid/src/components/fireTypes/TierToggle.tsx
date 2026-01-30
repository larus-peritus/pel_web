'use client';

/**
 * Tier Toggle Component
 *
 * Toggle between expense tiers (Lágmarks/Þægilegt/Lúxus).
 * Features:
 * - Three tier buttons (Barebones/Comfortable/Deluxe)
 * - Show expense amount per tier
 * - Active tier highlighted
 * - Instant recalculation trigger on change
 * - Disabled state when only one tier has data
 *
 * Task 4.3: Create TierToggle Component
 * Epic 4: Comparison Table
 * FIRE Type Explorer Feature
 */

import type { ExpenseTier } from '@/types/expenseBaseline';
import { formatCurrency } from '@/lib/utils/formatters';

export interface TierToggleProps {
  activeTier: ExpenseTier;
  onTierChange: (tier: ExpenseTier) => void;
  tiers: {
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
  disabled?: boolean;
}

interface TierOption {
  id: ExpenseTier;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}

const tierOptions: TierOption[] = [
  {
    id: 'barebones',
    label: 'Lágmarks',
    description: 'Sparsamt',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    activeBg: 'bg-amber-100',
    activeBorder: 'border-amber-500',
    activeText: 'text-amber-900',
  },
  {
    id: 'comfortable',
    label: 'Þægilegt',
    description: 'Venjulegt',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    activeBg: 'bg-green-100',
    activeBorder: 'border-green-500',
    activeText: 'text-green-900',
  },
  {
    id: 'deluxe',
    label: 'Lúxus',
    description: 'Glæsilegt',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    activeBg: 'bg-purple-100',
    activeBorder: 'border-purple-500',
    activeText: 'text-purple-900',
  },
];

export function TierToggle({
  activeTier,
  onTierChange,
  tiers,
  disabled = false,
}: TierToggleProps) {
  // Check if all tiers have the same value (effectively one tier)
  const allSame = tiers.barebones === tiers.comfortable && tiers.comfortable === tiers.deluxe;
  const isDisabled = disabled || allSame;

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Útgjaldaprofíll
        </label>
        {isDisabled && allSame && (
          <span className="text-xs text-gray-700">
            (öll stig jöfn)
          </span>
        )}
      </div>

      {/* Tier buttons */}
      <div className="grid grid-cols-3 gap-2">
        {tierOptions.map((option) => {
          const isActive = activeTier === option.id;
          const amount = tiers[option.id];

          return (
            <button
              key={option.id}
              onClick={() => !isDisabled && onTierChange(option.id)}
              disabled={isDisabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${isActive
                  ? `${option.activeBg} ${option.activeBorder} ${option.activeText} shadow-sm`
                  : `${option.bgColor} ${option.borderColor} ${option.color} hover:bg-opacity-80`
                }
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              `}
              aria-pressed={isActive}
              aria-label={`${option.label} stig - ${formatCurrency(amount)}`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Label */}
              <div className={`text-sm font-semibold mb-1 ${isActive ? 'font-bold' : ''}`}>
                {option.label}
              </div>

              {/* Description */}
              <div className="text-xs opacity-75 mb-2">
                {option.description}
              </div>

              {/* Amount */}
              <div className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {formatCurrency(amount)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-600">
        {isDisabled && allSame ? (
          'Þú hefur ekki sett upp mismunandi útgjaldaprofíl. Farðu í Grunnútgjöld til að búa til mismunandi profíla.'
        ) : (
          'Veldu útgjaldaprofíl til að sjá mismunandi FIRE markmið'
        )}
      </p>

      {/* Accessibility announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {!isDisabled && `${tierOptions.find(t => t.id === activeTier)?.label} stig valið`}
      </div>
    </div>
  );
}
