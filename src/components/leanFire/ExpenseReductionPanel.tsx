/**
 * ExpenseReductionPanel - What-if expense reduction scenarios
 *
 * Features:
 * - Add/remove reduction scenarios (max 5)
 * - Category selector dropdown
 * - Reduction percentage slider (10%, 25%, 50%, 100%)
 * - Impact display (monthly savings, FI impact, timeline impact)
 * - Efficiency rating
 */

'use client';

import { useState, useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { EXPENSE_CATEGORY_LABELS, type ExpenseCategory } from '@/types/leanFire';
import {
  REDUCTION_PERCENTAGE_OPTIONS,
  getTotalMonthly,
  getExpenseFromBaseline,
} from '@/lib/constants/leanFire';
import { calculateReductionScenario } from '@/lib/calculations/leanFire';
import { formatCurrency } from '@/lib/utils';
import type { ReductionPercent, ReductionScenario } from '@/types/leanFire';

const MAX_SCENARIOS = 5;

export function ExpenseReductionPanel() {
  const { leanFire, updateLeanFireState, expenseBaseline } = useCalculator();

  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('housing');
  const [selectedPercent, setSelectedPercent] = useState<ReductionPercent>(25);

  // Helper to get expense value: prefer expense baseline, fall back to hardcoded defaults
  const getExpenseValue = useMemo(() => {
    return (category: ExpenseCategory): number => {
      // Try to get from expense baseline (barebones tier)
      const baselineValue = getExpenseFromBaseline(expenseBaseline, category, 'barebones');
      if (baselineValue !== null) {
        return baselineValue;
      }
      // Fall back to hardcoded defaults
      return leanFire?.barebonesExpenses[category] ?? 0;
    };
  }, [expenseBaseline, leanFire?.barebonesExpenses]);

  if (!leanFire) return null;

  const scenarios = leanFire.reductionScenarios || [];
  const canAddMore = scenarios.length < MAX_SCENARIOS;

  // Check if we have expense baseline data
  const hasExpenseBaseline = expenseBaseline !== null && expenseBaseline.categories.length > 0;

  const handleAddScenario = () => {
    if (!canAddMore) return;

    const currentAmount = getExpenseValue(selectedCategory);

    // Check if scenario already exists for this category
    const exists = scenarios.some((s) => s.category === selectedCategory);
    if (exists) {
      alert('Þú ert þegar með minnkunaratburðarás fyrir þennan flokk');
      return;
    }

    const scenario = calculateReductionScenario(
      selectedCategory,
      currentAmount,
      selectedPercent,
      leanFire.fiMultiplier,
      leanFire.savingsRate || 0
    );

    const newScenario: ReductionScenario = {
      id: `${Date.now()}-${selectedCategory}`,
      name: `${EXPENSE_CATEGORY_LABELS[selectedCategory]} -${selectedPercent}%`,
      ...scenario,
      order: scenarios.length,
    };

    updateLeanFireState({
      reductionScenarios: [...scenarios, newScenario],
    });
  };

  const handleRemoveScenario = (id: string) => {
    updateLeanFireState({
      reductionScenarios: scenarios.filter((s) => s.id !== id),
    });
  };

  const categoryOptions = (Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map(
    (key) => ({
      value: key,
      label: `${EXPENSE_CATEGORY_LABELS[key]} (${formatCurrency(getExpenseValue(key))})`,
    })
  );

  const percentOptions = REDUCTION_PERCENTAGE_OPTIONS.map((opt) => ({
    value: opt.value.toString(),
    label: opt.label,
  }));

  // Calculate total impact
  const totalMonthlySavings = scenarios.reduce(
    (sum, s) => sum + s.monthlySavings,
    0
  );
  const totalFIReduction = scenarios.reduce(
    (sum, s) => sum + s.fiNumberImpact,
    0
  );
  const totalMonthsSaved = scenarios.reduce(
    (sum, s) => sum + s.timelineImpact,
    0
  );

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Útgjaldaminnkunar atburðarás
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Prufa "hvað ef ég sker niður X?" atburðarás
          </p>
        </div>

        {/* Data Source Info */}
        {hasExpenseBaseline ? (
          <Alert variant="success" className="bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-800">
                Útgjöld sótt úr{' '}
                <a href="/utgjaldareiknivel" className="font-medium underline hover:no-underline">
                  útgjaldagrunnlínu þinni
                </a>
                {' '}(lágmarksflokkur)
              </span>
            </div>
          </Alert>
        ) : (
          <Alert variant="info">
            <p className="text-sm">
              Sjálfgefin gildi notuð. Fylltu út{' '}
              <a href="/utgjaldareiknivel" className="font-medium underline hover:no-underline">
                útgjaldagrunnlínu
              </a>{' '}
              til að fá persónuleg gildi.
            </p>
          </Alert>
        )}

        {/* Add New Scenario */}
        <div className="bg-white rounded-lg p-5 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Bæta við atburðarás
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Útgjaldflokkur
              </label>
              <Select
                value={selectedCategory}
                onChange={(v) => setSelectedCategory(v as ExpenseCategory)}
                options={categoryOptions}
              />
            </div>

            {/* Percentage selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minnkunarprósenta
              </label>
              <Select
                value={selectedPercent.toString()}
                onChange={(v) => setSelectedPercent(parseInt(v) as ReductionPercent)}
                options={percentOptions}
              />
            </div>

            {/* Add button */}
            <div className="flex items-end">
              <Button
                onClick={handleAddScenario}
                disabled={!canAddMore}
                variant="primary"
                className="w-full"
              >
                {canAddMore ? 'Bæta við' : `Hámark (${MAX_SCENARIOS})`}
              </Button>
            </div>
          </div>

          {/* Current expense value display */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-700">
                Núverandi {EXPENSE_CATEGORY_LABELS[selectedCategory].toLowerCase()}:
              </span>
              <span className="font-bold text-purple-900">
                {formatCurrency(getExpenseValue(selectedCategory))} / mán
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-purple-700">
                Eftir {selectedPercent}% minnkun:
              </span>
              <span className="font-bold text-purple-900">
                {formatCurrency(getExpenseValue(selectedCategory) * (1 - selectedPercent / 100))} / mán
              </span>
            </div>
          </div>

          {!canAddMore && (
            <Alert variant="warning">
              <p className="text-sm">
                Þú hefur náð hámarki ({MAX_SCENARIOS} atburðarás). Fjarlægðu eina til að bæta
                við fleiri.
              </p>
            </Alert>
          )}
        </div>

        {/* Active Scenarios */}
        {scenarios.length > 0 && (
          <>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white rounded-lg p-4 border-2 border-purple-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {scenario.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {scenario.currentAmount.toLocaleString()} kr →{' '}
                        {scenario.newAmount.toLocaleString()} kr
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveScenario(scenario.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Fjarlægja
                    </button>
                  </div>

                  {/* Impact metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-xs text-gray-600">Mánaðarlegur sparnaður</div>
                      <div className="text-sm font-bold text-purple-700">
                        {scenario.monthlySavings.toLocaleString()} kr
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-xs text-gray-600">FI-tölu áhrif</div>
                      <div className="text-sm font-bold text-purple-700">
                        -{scenario.fiNumberImpact.toLocaleString()} kr
                      </div>
                    </div>

                    {scenario.timelineImpact > 0 && (
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-xs text-gray-600">Mánuðir sparaðir</div>
                        <div className="text-sm font-bold text-purple-700">
                          {scenario.timelineImpact.toFixed(1)} mán
                        </div>
                      </div>
                    )}

                    {scenario.efficiency > 0 && (
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-xs text-gray-600">Hagkvæmni</div>
                        <div className="text-sm font-bold text-purple-700">
                          {scenario.efficiency.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Impact Summary */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Heildaráhrif allra atburðarása
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalMonthlySavings.toLocaleString()} kr
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Heildar mánaðarlegur sparnaður
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    -{totalFIReduction.toLocaleString()} kr
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Lækkun á FI-tölu
                  </div>
                </div>

                {totalMonthsSaved > 0 && (
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalMonthsSaved.toFixed(1)} mán
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Heildar mánuðir sparaðir
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {scenarios.length === 0 && (
          <Alert variant="info">
            <p className="text-sm">
              Engar minnkunaratburðarás enn. Bættu við að ofan til að sjá áhrif
              útgjaldaminnkunar.
            </p>
          </Alert>
        )}
      </div>
    </Card>
  );
}
