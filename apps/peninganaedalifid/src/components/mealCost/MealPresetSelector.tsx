'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import { MEAL_SCENARIO_PRESETS } from '@/lib/constants/mealCost';
import { compareEatingOutVsHome } from '@/lib/calculations/mealCost';
import type { MealScenarioPreset, MealCostData } from '@/types/calculator';

/**
 * Props for MealPresetSelector component
 */
export interface MealPresetSelectorProps {
  onSelect: (preset: MealScenarioPreset) => void;
  currentData?: MealCostData;
  actualHourlyWage: number;
  className?: string;
}

/**
 * MealPresetSelector Component
 *
 * Displays preset meal scenarios for quick comparison with:
 * - 5 preset scenario cards
 * - Scenario name and description
 * - Quick selection buttons
 * - Optional comparison table with all scenarios
 * - Columns: Scenario, Monthly Cost, Life Energy, Savings vs Current, FV (20yr)
 */
export function MealPresetSelector({
  onSelect,
  currentData,
  actualHourlyWage,
  className,
}: MealPresetSelectorProps) {
  const [showComparison, setShowComparison] = useState(false);

  // Calculate comparison data for table if current data exists
  const comparisonData =
    currentData && actualHourlyWage > 0
      ? MEAL_SCENARIO_PRESETS.map((preset) => {
          const presetComparison = compareEatingOutVsHome(
            preset.eatingOut,
            preset.homeCooking,
            actualHourlyWage
          );
          const currentComparison = compareEatingOutVsHome(
            currentData.eatingOut,
            currentData.homeCooking,
            actualHourlyWage
          );

          // Calculate cheaper option cost for each preset
          const presetCost =
            presetComparison.cheaperOption === 'eatingOut'
              ? presetComparison.eatingOutSummary.monthlyCost
              : presetComparison.cheaperOption === 'homeCooking'
              ? presetComparison.homeCookingSummary.monthlyCost
              : (presetComparison.eatingOutSummary.monthlyCost +
                  presetComparison.homeCookingSummary.monthlyCost) /
                2;

          const currentCost =
            currentComparison.cheaperOption === 'eatingOut'
              ? currentComparison.eatingOutSummary.monthlyCost
              : currentComparison.cheaperOption === 'homeCooking'
              ? currentComparison.homeCookingSummary.monthlyCost
              : (currentComparison.eatingOutSummary.monthlyCost +
                  currentComparison.homeCookingSummary.monthlyCost) /
                2;

          const savingsVsCurrent = currentCost - presetCost;
          const lifeEnergy =
            presetComparison.cheaperOption === 'eatingOut'
              ? presetComparison.eatingOutSummary.monthlyLifeEnergy
              : presetComparison.cheaperOption === 'homeCooking'
              ? presetComparison.homeCookingSummary.monthlyLifeEnergy
              : (presetComparison.eatingOutSummary.monthlyLifeEnergy +
                  presetComparison.homeCookingSummary.monthlyLifeEnergy) /
                2;

          return {
            preset,
            monthlyCost: presetCost,
            lifeEnergy,
            savingsVsCurrent,
            futureValue20Years: presetComparison.futureValue20Years,
          };
        })
      : null;

  return (
    <div className={className}>
      {/* Preset scenario cards */}
      <Card variant="elevated">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-success-50">
          <h2 className="text-xl font-bold text-neutral-800">
            Forstilltar atburðarásir
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Veldu atburðarás til að sjá dæmigerðan kostnað
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {MEAL_SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className="w-full text-left p-4 rounded-lg border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{preset.description}</p>
                </div>
                <svg
                  className="w-5 h-5 text-primary-600 ml-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Comparison table toggle */}
      {comparisonData && (
        <div className="mt-6">
          <Button
            variant="secondary"
            onClick={() => setShowComparison(!showComparison)}
            className="w-full"
          >
            {showComparison
              ? 'Fela samanburðartöflu'
              : 'Sýna samanburðartöflu allra atburðarása'}
          </Button>

          {/* Comparison table */}
          {showComparison && (
            <Card variant="outlined" className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-800">
                  Samanburður allra atburðarása
                </h3>
              </CardHeader>
              <CardContent>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-neutral-300">
                        <th className="text-left py-3 px-2 font-semibold text-neutral-700">
                          Atburðarás
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-neutral-700">
                          Mán. kostnaður
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-neutral-700">
                          Lífsorka
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-neutral-700">
                          Sparnaður
                        </th>
                        <th className="text-right py-3 px-2 font-semibold text-neutral-700">
                          FV (20 ár)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map(
                        ({
                          preset,
                          monthlyCost,
                          lifeEnergy,
                          savingsVsCurrent,
                          futureValue20Years,
                        }) => (
                          <tr
                            key={preset.id}
                            className="border-b border-neutral-200 hover:bg-neutral-50"
                          >
                            <td className="py-3 px-2 font-medium text-neutral-800">
                              {preset.name}
                            </td>
                            <td className="py-3 px-2 text-right text-neutral-800">
                              {formatCurrency(monthlyCost)}
                            </td>
                            <td className="py-3 px-2 text-right text-warning-700">
                              {formatLifeEnergy(lifeEnergy)}
                            </td>
                            <td
                              className={`py-3 px-2 text-right font-medium ${
                                savingsVsCurrent > 0
                                  ? 'text-success-700'
                                  : savingsVsCurrent < 0
                                  ? 'text-error-700'
                                  : 'text-neutral-600'
                              }`}
                            >
                              {savingsVsCurrent > 0
                                ? `+${formatCurrency(savingsVsCurrent)}`
                                : savingsVsCurrent < 0
                                ? formatCurrency(savingsVsCurrent)
                                : '—'}
                            </td>
                            <td className="py-3 px-2 text-right text-success-700 font-medium">
                              {savingsVsCurrent > 0
                                ? formatCurrency(futureValue20Years)
                                : '—'}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-4">
                  {comparisonData.map(
                    ({
                      preset,
                      monthlyCost,
                      lifeEnergy,
                      savingsVsCurrent,
                      futureValue20Years,
                    }) => (
                      <div
                        key={preset.id}
                        className="border border-neutral-200 rounded-lg p-4 space-y-2"
                      >
                        <h4 className="font-semibold text-neutral-800 mb-2">
                          {preset.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-neutral-600">Mánaðarlega:</span>
                          </div>
                          <div className="text-right font-medium text-neutral-800">
                            {formatCurrency(monthlyCost)}
                          </div>

                          <div>
                            <span className="text-neutral-600">Lífsorka:</span>
                          </div>
                          <div className="text-right font-medium text-warning-700">
                            {formatLifeEnergy(lifeEnergy)}
                          </div>

                          <div>
                            <span className="text-neutral-600">Sparnaður:</span>
                          </div>
                          <div
                            className={`text-right font-medium ${
                              savingsVsCurrent > 0
                                ? 'text-success-700'
                                : savingsVsCurrent < 0
                                ? 'text-error-700'
                                : 'text-neutral-600'
                            }`}
                          >
                            {savingsVsCurrent > 0
                              ? `+${formatCurrency(savingsVsCurrent)}`
                              : savingsVsCurrent < 0
                              ? formatCurrency(savingsVsCurrent)
                              : '—'}
                          </div>

                          {savingsVsCurrent > 0 && (
                            <>
                              <div>
                                <span className="text-neutral-600">FV (20 ár):</span>
                              </div>
                              <div className="text-right font-medium text-success-700">
                                {formatCurrency(futureValue20Years)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600">
                    <strong>Athugið:</strong> Samanburðurinn notar núverandi
                    raunverulegt tímakaup þitt ({formatCurrency(actualHourlyWage)}/klst).
                    Sparnaður er reiknaður miðað við núverandi val þitt.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
