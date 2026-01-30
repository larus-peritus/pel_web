'use client';

import { Select, SelectOption } from '@/components/ui/Select';
import { COMMUTE_PRESETS } from '@/lib/calculations/commute';
import type { CommutePreset } from '@/types/calculator';

/**
 * Props for CommutePresetSelector component
 */
export interface CommutePresetSelectorProps {
  onSelect: (preset: CommutePreset) => void;
  className?: string;
}

/**
 * CommutePresetSelector - Dropdown for selecting preset commute scenarios
 *
 * Features:
 * - Groups presets by category (car, transit, active, remote)
 * - Displays label and description
 * - Calls onSelect callback with full preset data
 * - Resets to blank after selection (ready for next preset)
 *
 * @example
 * ```tsx
 * <CommutePresetSelector
 *   onSelect={(preset) => populateFormWithPreset(preset)}
 * />
 * ```
 */
export function CommutePresetSelector({
  onSelect,
  className,
}: CommutePresetSelectorProps) {
  // Group presets by category
  const carPresets = COMMUTE_PRESETS.filter((p) => p.category === 'car');
  const transitPresets = COMMUTE_PRESETS.filter((p) => p.category === 'transit');
  const activePresets = COMMUTE_PRESETS.filter((p) => p.category === 'active');
  const remotePresets = COMMUTE_PRESETS.filter((p) => p.category === 'remote');

  // Build select options with category groupings
  const options: SelectOption[] = [
    { value: '', label: '-- Veldu forstillingu --' },

    // Car presets
    ...(carPresets.length > 0
      ? [
          { value: 'header-car', label: '🚗 Bíll', disabled: true },
          ...carPresets.map((preset) => ({
            value: preset.id,
            label: `  ${preset.label}`,
          })),
        ]
      : []),

    // Transit presets
    ...(transitPresets.length > 0
      ? [
          { value: 'header-transit', label: '🚌 Strætó', disabled: true },
          ...transitPresets.map((preset) => ({
            value: preset.id,
            label: `  ${preset.label}`,
          })),
        ]
      : []),

    // Active presets (bike/walk)
    ...(activePresets.length > 0
      ? [
          { value: 'header-active', label: '🚴 Hjól/Ganga', disabled: true },
          ...activePresets.map((preset) => ({
            value: preset.id,
            label: `  ${preset.label}`,
          })),
        ]
      : []),

    // Remote presets
    ...(remotePresets.length > 0
      ? [
          { value: 'header-remote', label: '🏠 Fjarvinnu', disabled: true },
          ...remotePresets.map((preset) => ({
            value: preset.id,
            label: `  ${preset.label}`,
          })),
        ]
      : []),
  ];

  // Handle preset selection
  const handleChange = (value: string) => {
    if (!value || value.startsWith('header-')) {
      return;
    }

    const preset = COMMUTE_PRESETS.find((p) => p.id === value);
    if (preset) {
      onSelect(preset);
    }
  };

  return (
    <div className={className}>
      <Select
        label="Flýtival forstillinga"
        value=""
        onChange={handleChange}
        options={options}
      />
      <p className="mt-1 text-sm text-neutral-600">
        Veldu algeng leið til að fylla út form sjálfkrafa
      </p>
    </div>
  );
}
