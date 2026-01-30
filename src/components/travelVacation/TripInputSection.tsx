/**
 * Trip input section component
 * Combines trip details, cost inputs, and settings
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { NumberInput } from '../ui/NumberInput';
import { CostInputs } from './CostInputs';
import { PresetSelector } from './PresetSelector';
import type {
  TripInput,
  TravelCalculationSettings,
  TripPreset,
} from '@/types/travelVacation';

export interface TripInputSectionProps {
  trip: TripInput;
  settings: TravelCalculationSettings;
  onTripChange: (trip: TripInput) => void;
  onSettingsChange: (settings: TravelCalculationSettings) => void;
  onApplyPreset: (preset: TripPreset) => void;
}

/**
 * TripInputSection - Main input section for trip planning
 */
export function TripInputSection({
  trip,
  settings,
  onTripChange,
  onSettingsChange,
  onApplyPreset,
}: TripInputSectionProps) {
  const handleDetailsChange = (updates: Partial<typeof trip.details>) => {
    onTripChange({
      ...trip,
      details: {
        ...trip.details,
        ...updates,
      },
    });
  };

  const handleCostsChange = (costs: typeof trip.costs) => {
    onTripChange({
      ...trip,
      costs,
    });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-neutral-900">
          Upplýsingar um ferð
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Byrjaðu með forstillingu eða sláðu inn þínar eigin upplýsingar
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Preset selector */}
          <PresetSelector onSelect={onApplyPreset} />

          <div className="border-t border-neutral-200" />

          {/* Trip details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Grunnupplýsingar
            </h3>

            <Input
              label="Heiti ferðar (valfrjálst)"
              type="text"
              value={trip.details.name || ''}
              onChange={(e) => handleDetailsChange({ name: e.target.value })}
              placeholder="t.d. Spánarferð júlí 2026"
            />

            <NumberInput
              label="Lengd ferðar (dagar)"
              value={trip.details.days}
              onChange={(value) => handleDetailsChange({ days: value })}
              min={1}
              max={90}
              required
            />

            <Input
              label="Áfangastaður (valfrjálst)"
              type="text"
              value={trip.details.destination || ''}
              onChange={(e) =>
                handleDetailsChange({ destination: e.target.value })
              }
              placeholder="t.d. Barcelona"
            />
          </div>

          <div className="border-t border-neutral-200" />

          {/* Cost inputs */}
          <CostInputs
            costs={trip.costs}
            days={trip.details.days}
            onCostsChange={handleCostsChange}
          />

          <div className="border-t border-neutral-200" />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Stillingar
            </h3>

            <NumberInput
              label="Vænt ávöxtun"
              value={settings.expectedReturnRate * 100}
              onChange={(value) =>
                onSettingsChange({
                  ...settings,
                  expectedReturnRate: value / 100,
                })
              }
              min={0}
              max={15}
              step={0.5}
              suffix="%"
              helpText="Sjálfgefið 7% miðast við langtíma hlutabréfaávöxtun"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="staycation-toggle"
                checked={settings.showStaycationComparison}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    showStaycationComparison: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="staycation-toggle"
                className="text-sm font-medium text-neutral-700 cursor-pointer"
              >
                Bera saman við að vera heima (staycation)
              </label>
            </div>

            {settings.showStaycationComparison && (
              <NumberInput
                label="Daglegur kostnaður ef heima (kr/dag)"
                value={settings.staycationDailyCost}
                onChange={(value) =>
                  onSettingsChange({
                    ...settings,
                    staycationDailyCost: value,
                  })
                }
                min={0}
                placeholder="0"
                helpText="T.d. áætlaður matarkostnaður heima"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
