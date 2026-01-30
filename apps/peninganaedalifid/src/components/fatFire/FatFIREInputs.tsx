/**
 * FatFIREInputs - Base expense and financial inputs
 *
 * Features:
 * - Integration with expense baseline (deluxe tier default)
 * - Custom expense override option
 * - FI multiplier selector (28x, 30x, 33x, or custom)
 * - Current savings input
 * - Annual savings input
 * - Expected return rate slider
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  MULTIPLIER_OPTIONS,
  RETURN_PRESETS,
  FATFIRE_TOOLTIPS,
} from '@/lib/constants/fatFire';
import { formatCurrency } from '@/lib/utils/formatters';

export function FatFIREInputs() {
  const {
    fatFireState,
    updateFatFireState,
    expenseBaseline,
    expenseBaselineResults,
  } = useCalculator();

  if (!fatFireState) return null;

  // Determine base expenses from expense baseline or custom
  const deluxeExpenses = expenseBaselineResults?.totals?.deluxe ?? 0;
  const baseExpenses = fatFireState.useExpenseBaseline
    ? deluxeExpenses
    : fatFireState.customMonthlyExpense ?? 0;

  const handleToggleExpenseSource = () => {
    updateFatFireState({
      useExpenseBaseline: !fatFireState.useExpenseBaseline,
    });
  };

  const handleMultiplierChange = (multiplier: number) => {
    updateFatFireState({
      multiplier,
      customMultiplier: null, // Clear custom when selecting preset
    });
  };

  const handleCustomMultiplierChange = (value: number) => {
    updateFatFireState({
      customMultiplier: value,
    });
  };

  const handleReturnRateChange = (value: number) => {
    updateFatFireState({
      expectedReturnRate: value / 100, // Convert percentage to decimal
    });
  };

  const currentMultiplier =
    fatFireState.customMultiplier ?? fatFireState.multiplier;
  const returnRatePercent = fatFireState.expectedReturnRate * 100;

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">
              Grunnstillingar
            </h2>
            <p className="mt-1 text-sm text-amber-700">
              Stilltu grunnútgjöld og fjárhagslegar áætlanir
            </p>
          </div>
          <span className="text-3xl">⚙️</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Expense Source Toggle */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Grunnútgjöld
          </label>

          {/* Toggle between expense baseline and custom */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleToggleExpenseSource}
              className={`flex-1 rounded-lg border-2 p-4 text-left transition-all ${
                fatFireState.useExpenseBaseline
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    fatFireState.useExpenseBaseline
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-gray-300'
                  }`}
                >
                  {fatFireState.useExpenseBaseline && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Nota Lúxus-stig{' '}
                    <Tooltip content="Notar Lúxus-stig frá Útgjaldareiknitólinu fyrir raunverulegar íslenskar fjárhæðir.">
                      <span className="text-xs text-gray-700">ℹ️</span>
                    </Tooltip>
                  </p>
                  {deluxeExpenses > 0 && (
                    <p className="text-sm text-amber-600">
                      {formatCurrency(deluxeExpenses)}/mán
                    </p>
                  )}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleToggleExpenseSource}
              className={`flex-1 rounded-lg border-2 p-4 text-left transition-all ${
                !fatFireState.useExpenseBaseline
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    !fatFireState.useExpenseBaseline
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-gray-300'
                  }`}
                >
                  {!fatFireState.useExpenseBaseline && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <p className="font-medium text-gray-900">Sérsniðin upphæð</p>
              </div>
            </button>
          </div>

          {/* Custom expense input */}
          {!fatFireState.useExpenseBaseline && (
            <NumberInput
              label="Mánaðarleg grunnútgjöld"
              value={fatFireState.customMonthlyExpense ?? 0}
              onChange={(value) =>
                updateFatFireState({ customMonthlyExpense: value })
              }
              min={0}
              suffix="kr"
              helpText="Mánaðarleg lúxusútgjöld þín (húsnæði, matur, samgöngur, o.fl.)"
            />
          )}
        </div>

        {/* FI Multiplier Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            FI Margfaldari{' '}
            <Tooltip content={FATFIRE_TOOLTIPS.MULTIPLIER_30X}>
              <span className="text-xs text-gray-700">ℹ️</span>
            </Tooltip>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {MULTIPLIER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMultiplierChange(option.value)}
                className={`rounded-lg border-2 p-3 text-center transition-all ${
                  currentMultiplier === option.value &&
                  !fatFireState.customMultiplier
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-lg font-semibold text-gray-900">
                  {option.label}
                </p>
                <p className="text-xs text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>

          {/* Custom multiplier */}
          <details className="rounded-lg border border-gray-200 p-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Sérsniðinn margfaldari
            </summary>
            <div className="mt-3">
              <NumberInput
                value={fatFireState.customMultiplier ?? currentMultiplier}
                onChange={handleCustomMultiplierChange}
                min={25}
                max={40}
                step={1}
                helpText={`Úttektarhlutfall: ${(100 / currentMultiplier).toFixed(2)}%`}
              />
            </div>
          </details>
        </div>

        {/* Timeline Inputs */}
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900">
            Tímalína (valfrjálst)
          </h3>
          <p className="text-sm text-gray-600">
            Fylltu út til að sjá hvenær þú nærð FatFIRE markmiði þínu
          </p>

          <NumberInput
            label="Núverandi sparnaður"
            value={fatFireState.currentSavings ?? 0}
            onChange={(value) =>
              updateFatFireState({ currentSavings: value })
            }
            min={0}
            suffix="kr"
            helpText="Heildarverðmæti eignasafns þíns í dag"
          />

          <NumberInput
            label="Árlegt framlag"
            value={fatFireState.annualSavings ?? 0}
            onChange={(value) =>
              updateFatFireState({ annualSavings: value })
            }
            min={0}
            suffix="kr"
            helpText="Hversu miklu sparar þú á ári?"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Væntanleg ávöxtun: {returnRatePercent.toFixed(1)}%
            </label>
            <Slider
              value={returnRatePercent}
              onChange={handleReturnRateChange}
              min={0}
              max={15}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-gray-700">
              <span>0%</span>
              <span>15%</span>
            </div>

            {/* Return presets */}
            <div className="flex gap-2 pt-2">
              {RETURN_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() =>
                    handleReturnRateChange(preset.value * 100)
                  }
                  className={`flex-1 rounded border px-2 py-1 text-xs transition-colors ${
                    Math.abs(returnRatePercent - preset.value * 100) < 0.1
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-900">
              Mánaðarleg grunnútgjöld:
            </span>
            <span className="text-lg font-bold text-amber-900">
              {formatCurrency(baseExpenses)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
