'use client';

import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { usePresets } from '@/hooks/usePresets';
import { cn } from '@/lib/utils';
import type { PresetCategory, Preset } from '@/types/calculator';

/**
 * Category type for preset selector (excludes commute which is handled separately)
 */
type PresetSelectorCategory = Exclude<PresetCategory, 'commute'>;

interface PresetSelectorProps {
  category: PresetSelectorCategory;
  className?: string;
}

/**
 * Preset selector component for clothing and meals
 * Note: Commute presets are handled separately in QuickSettingsSlider with combined cost/time UI
 */
export function PresetSelector({ category, className }: PresetSelectorProps) {
  const { inputs, applyPreset } = useCalculator();

  // Get current values based on category
  const currentValues = {
    clothing: inputs.moneyExpenses.clothing,
    meals: inputs.moneyExpenses.meals,
  };

  const { presets, currentPreset, isCustom } = usePresets(
    category,
    currentValues,
    applyPreset
  );

  const handlePresetClick = useCallback((preset: Preset) => {
    applyPreset(preset);
  }, [applyPreset]);

  // Category labels
  const categoryLabels: Record<PresetSelectorCategory, string> = {
    clothing: 'Vinnufatnaður',
    meals: 'Hádegismatur',
  };

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-neutral-700">
        {categoryLabels[category]}
      </p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isActive = currentPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full border transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isActive
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
              )}
              aria-pressed={isActive}
              title={preset.description}
            >
              {preset.label}
            </button>
          );
        })}
        {isCustom && (
          <span className="px-3 py-1.5 text-sm rounded-full bg-neutral-100 border border-neutral-300 text-neutral-600">
            Sérsniðið
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Combined preset selectors for clothing and meals
 * Note: Commute presets are in QuickSettingsSlider with combined cost/time UI
 */
export function PresetSelectors({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-neutral-900">Flýtistillingar</h3>
      <p className="text-sm text-neutral-600">
        Veldu stillingar til að setja dæmigerð gildi
      </p>
      <div className="space-y-4">
        <PresetSelector category="clothing" />
        <PresetSelector category="meals" />
      </div>
    </div>
  );
}
