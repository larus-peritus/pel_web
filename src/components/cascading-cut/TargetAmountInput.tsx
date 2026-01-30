/**
 * Target amount input with slider for total cut target
 * Allows user to set how much they want to cut from monthly expenses
 */

'use client';

import { formatCurrency } from '@/lib/utils/formatters';

interface TargetAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  maxAmount: number;
  className?: string;
}

export function TargetAmountInput({
  value,
  onChange,
  maxAmount,
  className = '',
}: TargetAmountInputProps) {
  // Calculate reasonable step and bounds
  const step = 5000;
  const min = 0;
  const max = Math.max(maxAmount, step);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Handle direct input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue, 10) || 0;
    onChange(Math.min(numValue, max));
  };

  // Calculate percentage of max for visual feedback
  const percentage = maxAmount > 0 ? Math.round((value / maxAmount) * 100) : 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <label
            htmlFor="target-amount-slider"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Markmið niðurskurðar
          </label>

          <input
            id="target-amount-slider"
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 kr</span>
            <span>{formatCurrency(max)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={value.toLocaleString('is-IS')}
              onChange={handleInputChange}
              className="w-32 px-3 py-2 pr-8 text-right font-semibold text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Niðurskurður í krónum"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              kr
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{percentage}%</span>
            <span className="text-gray-400"> af útgjöldum</span>
          </div>
        </div>
      </div>
    </div>
  );
}
