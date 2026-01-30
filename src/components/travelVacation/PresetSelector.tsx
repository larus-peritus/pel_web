/**
 * Preset selector component
 * Allows users to quickly select common trip types
 */

import React from 'react';
import { TRIP_PRESETS, type TripPreset } from '@/types/travelVacation';
import { formatCurrency } from '@/lib/utils/formatters';

export interface PresetSelectorProps {
  onSelect: (preset: TripPreset) => void;
}

/**
 * PresetSelector - Quick preset selection for common trips
 */
export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 mb-1">
          Fljótlegar forstillingar
        </h4>
        <p className="text-xs text-neutral-600">
          Veldu forstillingu til að fylla út eyðublað með dæmigerðum gildum
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TRIP_PRESETS.map((preset) => (
          <PresetCard key={preset.name} preset={preset} onSelect={onSelect} />
        ))}
      </div>

      <p className="text-xs text-neutral-500 italic">
        Athugið: Þetta eru áætlanir - raunverulegur kostnaður getur verið
        mismunandi. Þú getur breytt öllum gildum eftir á.
      </p>
    </div>
  );
}

interface PresetCardProps {
  preset: TripPreset;
  onSelect: (preset: TripPreset) => void;
}

function PresetCard({ preset, onSelect }: PresetCardProps) {
  // Calculate estimated total (use midpoint)
  const estimatedMin =
    preset.estimatedCosts.transportation.min +
    preset.estimatedCosts.accommodation.min +
    preset.estimatedCosts.foodPerDay.min * preset.typicalDays +
    preset.estimatedCosts.activities.min +
    preset.estimatedCosts.localTransport.min +
    preset.estimatedCosts.other.min;

  const estimatedMax =
    preset.estimatedCosts.transportation.max +
    preset.estimatedCosts.accommodation.max +
    preset.estimatedCosts.foodPerDay.max * preset.typicalDays +
    preset.estimatedCosts.activities.max +
    preset.estimatedCosts.localTransport.max +
    preset.estimatedCosts.other.max;

  return (
    <button
      onClick={() => onSelect(preset)}
      className="text-left p-4 rounded-lg border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div className="space-y-2">
        <h5 className="font-semibold text-neutral-900">{preset.name}</h5>
        <p className="text-sm text-neutral-600">{preset.description}</p>
        <div className="pt-2 border-t border-neutral-200">
          <div className="text-xs text-neutral-500">
            {preset.typicalDays} dagar
          </div>
          <div className="text-sm font-medium text-neutral-700 mt-1">
            {formatCurrency(estimatedMin)} - {formatCurrency(estimatedMax)}
          </div>
        </div>
      </div>
    </button>
  );
}
