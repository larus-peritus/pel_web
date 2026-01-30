/**
 * ScenarioManager - Manage Barista FIRE scenarios
 *
 * Handles:
 * - Adding new scenarios (max 5)
 * - Scenario presets (20 klst/viku, 30 klst/viku, Ráðgjöf)
 * - Deleting scenarios
 * - Displaying all scenarios with ScenarioCard
 */

'use client';

import { Button } from '@/components/ui/Button';
import { ScenarioCard } from './ScenarioCard';
import type {
  BaristaFireScenario,
  BaristaFireScenarioResult,
} from '@/types/baristaFire';
import { PART_TIME_PRESETS, BARISTA_FIRE_DEFAULTS } from '@/lib/constants/baristaFire';
import { Alert } from '@/components/ui/Alert';

export interface ScenarioManagerProps {
  scenarios: BaristaFireScenario[];
  scenarioResults?: BaristaFireScenarioResult[];
  onAddScenario: (scenario: Omit<BaristaFireScenario, 'id' | 'order'>) => void;
  onUpdateScenario: (id: string, updates: Partial<BaristaFireScenario>) => void;
  onDeleteScenario: (id: string) => void;
}

export function ScenarioManager({
  scenarios,
  scenarioResults = [],
  onAddScenario,
  onUpdateScenario,
  onDeleteScenario,
}: ScenarioManagerProps) {
  const maxScenarios = BARISTA_FIRE_DEFAULTS.MAX_SCENARIOS;
  const canAddMore = scenarios.length < maxScenarios;

  // Handle adding a scenario from preset
  const handleAddPreset = (presetIndex: number) => {
    if (!canAddMore) return;

    const preset = PART_TIME_PRESETS[presetIndex];
    const newScenario: Omit<BaristaFireScenario, 'id' | 'order'> = {
      name: preset.name,
      grossAnnualIncome: 0, // User must input
      netAnnualIncome: 0,
      workHoursPerWeek: preset.hoursPerWeek,
    };

    onAddScenario(newScenario);
  };

  // Handle adding a blank scenario
  const handleAddBlank = () => {
    if (!canAddMore) return;

    const newScenario: Omit<BaristaFireScenario, 'id' | 'order'> = {
      name: `Sviðsmynd ${scenarios.length + 1}`,
      grossAnnualIncome: 0,
      netAnnualIncome: 0,
      workHoursPerWeek: null,
    };

    onAddScenario(newScenario);
  };

  // Get result for a scenario
  const getResultForScenario = (scenarioId: string): BaristaFireScenarioResult | undefined => {
    return scenarioResults.find((r) => r.scenarioId === scenarioId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Hlutastarf Sviðsmyndir
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Búðu til allt að {maxScenarios} sviðsmyndir með mismunandi launum
          </p>
        </div>
        <div className="text-sm text-neutral-600">
          {scenarios.length} / {maxScenarios} sviðsmyndir
        </div>
      </div>

      {/* Empty state */}
      {scenarios.length === 0 && (
        <Alert variant="info">
          <p className="font-semibold mb-2">Byrjaðu með því að búa til sviðsmynd</p>
          <p className="text-sm">
            Veldu eina af tilbúnum sviðsmyndum eða búðu til þína eigin með sérsniðnum launum og vinnustundum.
          </p>
        </Alert>
      )}

      {/* Scenario Cards */}
      {scenarios.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              result={getResultForScenario(scenario.id)}
              onUpdate={onUpdateScenario}
              onDelete={onDeleteScenario}
              canDelete={scenarios.length > 1}
            />
          ))}
        </div>
      )}

      {/* Add Scenario Section */}
      {canAddMore && (
        <div className="space-y-4">
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              Bæta við sviðsmynd
            </h3>

            {/* Preset Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {PART_TIME_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleAddPreset(index)}
                  className="flex flex-col items-start rounded-lg border-2 border-neutral-200 p-4 text-left transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="text-sm font-semibold text-neutral-900">
                    {preset.name}
                  </span>
                  <span className="text-xs text-neutral-600 mt-1">
                    {preset.description}
                  </span>
                  <span className="text-xs text-neutral-700 mt-1">
                    {preset.hoursPerWeek} klst/viku
                  </span>
                </button>
              ))}
            </div>

            {/* Blank Scenario Button */}
            <Button
              variant="secondary"
              onClick={handleAddBlank}
              className="w-full"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Auð sviðsmynd (sérsniðin)
            </Button>
          </div>
        </div>
      )}

      {/* Max scenarios reached */}
      {!canAddMore && (
        <Alert variant="warning">
          Þú hefur náð hámarki ({maxScenarios} sviðsmyndir). Eyddu sviðsmynd til að bæta við nýrri.
        </Alert>
      )}
    </div>
  );
}
