/**
 * Controls for sorting savings goals
 */

'use client';

import { Select } from '@/components/ui/Select';
import type { SortOption } from '@/types/savingsGoal';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'progress-desc', label: 'Framfarir (hæst fyrst)' },
  { value: 'progress-asc', label: 'Framfarir (lægst fyrst)' },
  { value: 'amount-desc', label: 'Upphæð (stærst fyrst)' },
  { value: 'amount-asc', label: 'Upphæð (minnst fyrst)' },
  { value: 'time-desc', label: 'Tími til markmiðs (lengst fyrst)' },
  { value: 'time-asc', label: 'Tími til markmiðs (styðst fyrst)' },
  { value: 'manual', label: 'Handvirk röð' },
];

export function SortControls({ sortBy, onChange }: SortControlsProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Raða eftir:
      </label>
      <Select
        id="sort-select"
        value={sortBy}
        onChange={(value: string) => onChange(value as SortOption)}
        options={SORT_OPTIONS}
        className="w-auto"
      />
    </div>
  );
}
