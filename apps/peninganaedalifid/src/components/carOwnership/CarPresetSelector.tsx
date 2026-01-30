'use client';

import { Select, SelectOption } from '@/components/ui/Select';
import { CAR_PRESETS } from '@/lib/presets/car';
import type { CarPreset } from '@/types/car-ownership';

/**
 * Props for CarPresetSelector component
 */
export interface CarPresetSelectorProps {
  onSelect: (preset: CarPreset) => void;
  className?: string;
}

/**
 * CarPresetSelector - Preset selection dropdown for car ownership calculator
 *
 * Displays 5 Icelandic car presets:
 * - Lítill bensínbíll (Toyota Yaris)
 * - Meðalstór bensínbíll (Toyota Corolla)
 * - Stór jeppi (Toyota RAV4)
 * - Rafbíll (Tesla Model 3 / Nissan Leaf)
 * - Gamall bíll (> 15 ára)
 *
 * When a preset is selected, it calls onSelect with the full preset data
 * which can be used to populate the form.
 *
 * @example
 * ```tsx
 * <CarPresetSelector
 *   onSelect={(preset) => {
 *     // Populate form with preset.inputs
 *     setInputs(preset.inputs);
 *   }}
 * />
 * ```
 */
export function CarPresetSelector({
  onSelect,
  className,
}: CarPresetSelectorProps) {
  const handleChange = (value: string) => {
    const preset = CAR_PRESETS.find((p) => p.id === value);
    if (preset) {
      onSelect(preset);
    }
  };

  const options: SelectOption[] = CAR_PRESETS.map((preset) => ({
    value: preset.id,
    label: preset.label,
  }));

  return (
    <div className={className}>
      <Select
        label="Velja forskilgreindan bíl"
        value=""
        onChange={handleChange}
        options={[
          { value: '', label: 'Veldu forskilgreindan bíl...' },
          ...options,
        ]}
      />
      <p className="mt-1 text-sm text-gray-500">
        Veldu bíl til að fylla út formið sjálfkrafa með dæmigerðum gildum
      </p>
    </div>
  );
}
