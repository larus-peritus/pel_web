/**
 * ScenarioComparison - Compare different retirement scenarios side-by-side
 *
 * Features:
 * - Save current scenario with custom name (max 3 scenarios)
 * - Comparison table with key metrics
 * - Highlight best values across scenarios
 * - Delete scenarios with confirmation
 * - Persists across page reloads via context
 * - Empty state when no scenarios saved
 */

'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatISK } from '@/lib/constants/pensionAwareFire';
import type { SavedScenario } from '@/types/pensionAwareFire';

interface ScenarioComparisonProps {
  maxScenarios?: number;
}

export function ScenarioComparison({ maxScenarios = 3 }: ScenarioComparisonProps) {
  const {
    pensionAwareFire,
    pensionAwareFireResults,
    savePensionScenario,
    deletePensionScenario,
  } = useCalculator();

  const [isAddingScenario, setIsAddingScenario] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!pensionAwareFire) return null;

  const scenarios = pensionAwareFire.savedScenarios || [];
  const canAddMore = scenarios.length < maxScenarios;
  const hasResults = pensionAwareFireResults !== null;

  // Handle save scenario
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      alert('Vinsamlegast sláðu inn nafn fyrir atburðarásina');
      return;
    }

    savePensionScenario(scenarioName.trim());
    setScenarioName('');
    setIsAddingScenario(false);
  };

  // Handle delete scenario
  const handleDeleteScenario = (id: string, name: string) => {
    if (deletingId === id) {
      // Confirmed - delete
      deletePensionScenario(id);
      setDeletingId(null);
    } else {
      // Ask for confirmation
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000); // Reset after 3 seconds
    }
  };

  // Get metric comparison data
  const getMetricComparison = (
    key: 'pensionAdjustedFINumber' | 'totalGapYears' | 'yearsToPensionAdjustedFI' | 'estimatedSurplusAt90'
  ) => {
    const values = scenarios.map((s) => {
      const value = s.results[key];
      return typeof value === 'number' ? value : 0;
    });

    if (values.length === 0) return { min: 0, max: 0 };

    // For gap years and time to FI, lower is better
    // For surplus, higher is better
    // For FI needed, lower is better
    const isBetterWhenLower = key !== 'estimatedSurplusAt90';

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      bestValue: isBetterWhenLower ? Math.min(...values) : Math.max(...values),
    };
  };

  // Check if a value is the best in its row
  const isBestValue = (
    value: number | null,
    key: 'pensionAdjustedFINumber' | 'totalGapYears' | 'yearsToPensionAdjustedFI' | 'estimatedSurplusAt90'
  ): boolean => {
    if (value === null || scenarios.length <= 1) return false;
    const comparison = getMetricComparison(key);
    return value === comparison.bestValue;
  };

  // Format years
  const formatYears = (years: number | null): string => {
    if (years === null || years === 0) return '0 ár';
    return `${years} ár`;
  };

  // Empty state
  if (scenarios.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Atburðarásir
          </h3>
          {hasResults && canAddMore && (
            <Button
              onClick={() => setIsAddingScenario(true)}
              variant="primary"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              + Vista núverandi
            </Button>
          )}
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            Engar atburðarásir vistaðar
          </h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Vista mismunandi atburðarásir til að bera saman eftirlaunaáætlanir með
            mismunandi aldri, útgjöldum eða lífeyrissparnaði.
          </p>
          {!hasResults && (
            <p className="text-sm text-amber-600 mt-4">
              Vinsamlegast fylltu út inntaksgögn og fáðu niðurstöður fyrst.
            </p>
          )}
        </div>

        {/* Add scenario modal */}
        {isAddingScenario && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nafn atburðarás:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveScenario()}
                placeholder="t.d. Snemmbúin (hætta 50)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <Button
                onClick={handleSaveScenario}
                variant="primary"
                size="sm"
              >
                Vista
              </Button>
              <Button
                onClick={() => {
                  setIsAddingScenario(false);
                  setScenarioName('');
                }}
                variant="secondary"
                size="sm"
              >
                Hætta við
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Comparison table
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Atburðarásir
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Berðu saman mismunandi eftirlaunaáætlanir
          </p>
        </div>
        {hasResults && canAddMore && !isAddingScenario && (
          <Button
            onClick={() => setIsAddingScenario(true)}
            variant="primary"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            + Vista núverandi
          </Button>
        )}
        {!canAddMore && (
          <span className="text-sm text-amber-600 font-medium">
            Hámark náð ({maxScenarios} atburðarásir)
          </span>
        )}
      </div>

      {/* Add scenario modal */}
      {isAddingScenario && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nafn atburðarás:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveScenario()}
              placeholder="t.d. Snemmbúin (hætta 50)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <Button
              onClick={handleSaveScenario}
              variant="primary"
              size="sm"
            >
              Vista
            </Button>
            <Button
              onClick={() => {
                setIsAddingScenario(false);
                setScenarioName('');
              }}
              variant="secondary"
              size="sm"
            >
              Hætta við
            </Button>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                {/* Metric name column */}
              </th>
              {scenarios.map((scenario) => (
                <th
                  key={scenario.id}
                  className="text-center py-3 px-4 min-w-[160px]"
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {scenario.name}
                  </div>
                  <div className="text-xs text-gray-500 font-normal">
                    (hætta {scenario.inputs.targetRetirementAge} ára)
                  </div>
                  <button
                    onClick={() => handleDeleteScenario(scenario.id, scenario.name)}
                    className={`mt-2 text-xs px-2 py-1 rounded transition-colors ${
                      deletingId === scenario.id
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                    title={deletingId === scenario.id ? 'Smelltu aftur til að staðfesta' : 'Eyða'}
                  >
                    {deletingId === scenario.id ? '✓ Staðfesta eyðingu' : '🗑 Eyða'}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row: FI þörf (FI needed) */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium text-gray-700">
                FI þörf
              </td>
              {scenarios.map((scenario) => {
                const value = scenario.results.pensionAdjustedFINumber;
                const best = isBestValue(value, 'pensionAdjustedFINumber');
                return (
                  <td
                    key={scenario.id}
                    className={`text-center py-3 px-4 text-sm font-semibold ${
                      best ? 'text-green-600 bg-green-50' : 'text-gray-900'
                    }`}
                  >
                    {formatISK(value, true)}
                    {best && (
                      <span className="ml-1 text-xs" title="Lægsta FI þörf">
                        ✓
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Biðtími (Gap years) */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium text-gray-700">
                Biðtími
                <div className="text-xs text-gray-500 font-normal">
                  (til séreign)
                </div>
              </td>
              {scenarios.map((scenario) => {
                const value = scenario.results.totalGapYears;
                const best = isBestValue(value, 'totalGapYears');
                return (
                  <td
                    key={scenario.id}
                    className={`text-center py-3 px-4 text-sm font-semibold ${
                      best ? 'text-green-600 bg-green-50' : 'text-gray-900'
                    }`}
                  >
                    {formatYears(value)}
                    {best && value > 0 && (
                      <span className="ml-1 text-xs" title="Stysti biðtími">
                        ✓
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Tími til FI (Time to FI) */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium text-gray-700">
                Tími til FI
                <div className="text-xs text-gray-500 font-normal">
                  (frá núverandi aldri)
                </div>
              </td>
              {scenarios.map((scenario) => {
                const value = scenario.results.yearsToPensionAdjustedFI;
                const best = value !== null && isBestValue(value, 'yearsToPensionAdjustedFI');
                return (
                  <td
                    key={scenario.id}
                    className={`text-center py-3 px-4 text-sm font-semibold ${
                      best ? 'text-green-600 bg-green-50' : 'text-gray-900'
                    }`}
                  >
                    {formatYears(value)}
                    {best && value !== null && value > 0 && (
                      <span className="ml-1 text-xs" title="Stystur tími til FI">
                        ✓
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Afgangur við 90 (Surplus at 90) */}
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium text-gray-700">
                Afgangur við 90
                <div className="text-xs text-gray-500 font-normal">
                  (áætlaður)
                </div>
              </td>
              {scenarios.map((scenario) => {
                const value = scenario.results.estimatedSurplusAt90;
                const best = isBestValue(value, 'estimatedSurplusAt90');
                const isPositive = value > 0;
                return (
                  <td
                    key={scenario.id}
                    className={`text-center py-3 px-4 text-sm font-semibold ${
                      best
                        ? 'text-green-600 bg-green-50'
                        : isPositive
                        ? 'text-gray-900'
                        : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatISK(value, true)}
                    {best && (
                      <span className="ml-1 text-xs" title="Mestur afgangur">
                        ✓
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Besta gildið í hverri röð</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Lægsti kostnaður / stystur tími / mestur afgangur</span>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Ábending:</strong> Berðu saman mismunandi markaldur til að sjá
          hvernig nokkur ár geta haft mikil áhrif á nauðsynlegan sparnað og biðtíma.
          Grænir reitir sýna bestu gildin í hverri línu.
        </p>
      </div>
    </Card>
  );
}
