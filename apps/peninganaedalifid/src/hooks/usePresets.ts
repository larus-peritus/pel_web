'use client';

import { useMemo, useCallback } from 'react';
import type { Preset, PresetCategory, MoneyExpenses, TimeExpenses } from '@/types/calculator';
import { getPresetsByCategory, detectPreset } from '@/lib/presets';

interface UsePresetsReturn {
  presets: Preset[];
  currentPreset: Preset | null;
  applyPreset: (preset: Preset) => void;
  isCustom: boolean;
}

/**
 * Hook for preset selection and detection (for clothing and meals only)
 * Note: Commute presets are handled separately with CommutePreset type
 *
 * @param category - Preset category ('clothing' | 'meals')
 * @param currentValues - Current expense/time values
 * @param onApply - Callback when preset is applied
 * @returns Preset utilities
 *
 * @example
 * ```tsx
 * function ClothingPresetSelector() {
 *   const { inputs, updateMoneyExpense } = useCalculator();
 *
 *   const { presets, currentPreset, applyPreset, isCustom } = usePresets(
 *     'clothing',
 *     inputs.moneyExpenses,
 *     (preset) => {
 *       updateMoneyExpense('clothing', preset.values.clothing || 0);
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       {presets.map(preset => (
 *         <button
 *           key={preset.id}
 *           onClick={() => applyPreset(preset)}
 *           className={currentPreset?.id === preset.id ? 'active' : ''}
 *         >
 *           {preset.label}
 *         </button>
 *       ))}
 *       {isCustom && <span>Custom values</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePresets(
  category: Exclude<PresetCategory, 'commute'>,
  currentValues: Partial<MoneyExpenses & TimeExpenses>,
  onApply: (preset: Preset) => void
): UsePresetsReturn {
  const presets = useMemo(() => getPresetsByCategory(category), [category]);

  const currentPreset = useMemo(() =>
    detectPreset(category, currentValues),
    [category, currentValues]
  );

  const isCustom = currentPreset === null;

  const applyPreset = useCallback((preset: Preset) => {
    onApply(preset);
  }, [onApply]);

  return {
    presets,
    currentPreset,
    applyPreset,
    isCustom,
  };
}
