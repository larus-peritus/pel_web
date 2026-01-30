/**
 * LeanFIREInputs - Basic financial inputs for LeanFIRE calculator
 *
 * Features:
 * - Integration with expense baseline (all three tiers)
 * - Custom expense input for "what-if" scenarios
 * - FI multiplier selector (25x or 30x)
 * - Current savings (optional)
 * - Current age (optional)
 * - Monthly savings rate (optional)
 * - Investment return slider
 * - Shows comparison of tiers and their impact on FI
 */

'use client';

import { useState, useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import {
  FI_MULTIPLIER_OPTIONS,
  LEANFIRE_RANGES,
} from '@/lib/constants/leanFire';
import { getTotalMonthly } from '@/lib/constants/leanFire';
import { formatCurrency } from '@/lib/utils';

type ExpenseSourceOption = 'barebones' | 'comfortable' | 'deluxe' | 'custom';

export function LeanFIREInputs() {
  const {
    leanFire,
    updateLeanFireState,
    expenseBaselineResults,
  } = useCalculator();

  // Track which expense source is selected and custom amount
  const [selectedSource, setSelectedSource] = useState<ExpenseSourceOption>('barebones');
  const [customExpense, setCustomExpense] = useState<number>(240000);

  if (!leanFire) return null;

  // Get expense values from baseline
  const hasBaseline = expenseBaselineResults !== null;
  const barebonesFromBaseline = expenseBaselineResults?.totals.barebones || 240000;
  const comfortableFromBaseline = expenseBaselineResults?.totals.comfortable || 400000;
  const deluxeFromBaseline = expenseBaselineResults?.totals.deluxe || 600000;

  // Calculate current active expense based on selection
  const activeExpense = useMemo(() => {
    switch (selectedSource) {
      case 'barebones':
        return barebonesFromBaseline;
      case 'comfortable':
        return comfortableFromBaseline;
      case 'deluxe':
        return deluxeFromBaseline;
      case 'custom':
        return customExpense;
      default:
        return barebonesFromBaseline;
    }
  }, [selectedSource, barebonesFromBaseline, comfortableFromBaseline, deluxeFromBaseline, customExpense]);

  // Calculate FI numbers for comparison
  const calculateFI = (monthly: number, multiplier: number) => monthly * 12 * multiplier;
  const calculateYearsToFI = (fiNumber: number, currentSavings: number, monthlySavings: number, returnRate: number) => {
    if (!monthlySavings || monthlySavings <= 0) return null;
    const monthlyRate = returnRate / 12;
    const targetAmount = fiNumber - currentSavings;
    if (targetAmount <= 0) return 0;
    // Using future value of annuity formula solved for n
    const months = Math.log((targetAmount * monthlyRate / monthlySavings) + 1) / Math.log(1 + monthlyRate);
    return months / 12;
  };

  const fiNumber = calculateFI(activeExpense, leanFire.fiMultiplier);
  const yearsToFI = leanFire.currentSavings !== null && leanFire.savingsRate !== null
    ? calculateYearsToFI(fiNumber, leanFire.currentSavings, leanFire.savingsRate, leanFire.investmentReturn)
    : null;

  const handleSourceChange = (source: ExpenseSourceOption) => {
    setSelectedSource(source);
    // Update state to reflect the change
    updateLeanFireState({
      expenseSource: source === 'custom' ? 'custom' : 'baseline',
    });
  };

  const handleCustomExpenseChange = (value: number) => {
    setCustomExpense(value);
    if (selectedSource === 'custom') {
      updateLeanFireState({ expenseSource: 'custom' });
    }
  };

  const handleFIMultiplierChange = (value: string) => {
    const multiplier = parseInt(value) as 25 | 30;
    updateLeanFireState({ fiMultiplier: multiplier });
  };

  const handleCurrentSavingsChange = (value: number) => {
    updateLeanFireState({ currentSavings: value || null });
  };

  const handleCurrentAgeChange = (value: number) => {
    updateLeanFireState({ currentAge: value || null });
  };

  const handleSavingsRateChange = (value: number) => {
    updateLeanFireState({ savingsRate: value || null });
  };

  const handleInvestmentReturnChange = (value: number) => {
    updateLeanFireState({ investmentReturn: value });
  };

  // Expense tier options for comparison
  const tierOptions = [
    {
      id: 'barebones' as const,
      label: 'Lágmark (Barebones)',
      icon: '🍃',
      amount: barebonesFromBaseline,
      description: 'Lágmarksútgjöld til að lifa',
      color: 'green',
    },
    {
      id: 'comfortable' as const,
      label: 'Þægilegt (Comfortable)',
      icon: '😊',
      amount: comfortableFromBaseline,
      description: 'Þægileg lífsgæði',
      color: 'blue',
    },
    {
      id: 'deluxe' as const,
      label: 'Lúxus (Deluxe)',
      icon: '👑',
      amount: deluxeFromBaseline,
      description: 'Ríkuleg lífsgæði',
      color: 'purple',
    },
    {
      id: 'custom' as const,
      label: 'Sérsniðið',
      icon: '✏️',
      amount: customExpense,
      description: 'Sláðu inn eigin upphæð',
      color: 'amber',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Grunnupplýsingar
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Veldu útgjaldaflokk eða sláðu inn sérsniðna upphæð til að sjá áhrif á FI tölu
          </p>
        </div>

        {/* Expense Baseline Status */}
        {hasBaseline ? (
          <Alert variant="success" className="bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm text-green-800">
                Útgjaldagrunnlína tengd — öll gildi sótt úr{' '}
                <a href="/utgjaldareiknivel" className="font-medium underline hover:no-underline">
                  útgjaldaskýrslu
                </a>
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

        {/* Expense Tier Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Veldu útgjaldaflokk
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tierOptions.map((tier) => {
              const isSelected = selectedSource === tier.id;
              const tierFI = calculateFI(tier.amount, leanFire.fiMultiplier);
              const tierYears = leanFire.currentSavings !== null && leanFire.savingsRate !== null
                ? calculateYearsToFI(tierFI, leanFire.currentSavings, leanFire.savingsRate, leanFire.investmentReturn)
                : null;

              return (
                <button
                  key={tier.id}
                  onClick={() => handleSourceChange(tier.id)}
                  className={`
                    relative p-4 rounded-lg border-2 text-left transition-all
                    ${isSelected
                      ? 'border-green-500 bg-white shadow-md ring-2 ring-green-200'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{tier.icon}</span>
                    <span className="font-semibold text-gray-900">{tier.label}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(tier.amount)}/mán
                    </p>
                    <p className="text-xs text-gray-500">{tier.description}</p>

                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <p className="text-xs text-gray-600">
                        FI tala: <span className="font-semibold">{formatCurrency(tierFI)}</span>
                      </p>
                      {tierYears !== null && (
                        <p className="text-xs text-gray-600">
                          Tími til FI: <span className="font-semibold">
                            {tierYears <= 0 ? 'Náð!' : `~${tierYears.toFixed(1)} ár`}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Expense Input (only shown when custom is selected) */}
        {selectedSource === 'custom' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Sérsniðin mánaðarleg útgjöld
            </label>
            <CurrencyInput
              value={customExpense}
              onChange={handleCustomExpenseChange}
              helpText="Sláðu inn upphæð til að sjá áhrif á FI tölu og tímalínu"
            />
          </div>
        )}

        {/* Active Selection Summary */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Valið</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700">Mánaðarleg útgjöld:</p>
              <p className="text-xl font-bold text-green-900">{formatCurrency(activeExpense)}</p>
            </div>
            <div>
              <p className="text-green-700">FI tala ({leanFire.fiMultiplier}x):</p>
              <p className="text-xl font-bold text-green-900">{formatCurrency(fiNumber)}</p>
            </div>
            {yearsToFI !== null && (
              <>
                <div>
                  <p className="text-green-700">Áætlaður tími til FI:</p>
                  <p className="text-xl font-bold text-green-900">
                    {yearsToFI <= 0 ? 'Þú ert þegar FI!' : `~${yearsToFI.toFixed(1)} ár`}
                  </p>
                </div>
                {leanFire.currentAge !== null && yearsToFI > 0 && (
                  <div>
                    <p className="text-green-700">Aldur við FI:</p>
                    <p className="text-xl font-bold text-green-900">
                      ~{Math.round(leanFire.currentAge + yearsToFI)} ára
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FI Multiplier */}
        <div>
          <Select
            label="FI margfaldari (úttektarhlutfall)"
            value={leanFire.fiMultiplier.toString()}
            onChange={handleFIMultiplierChange}
            options={FI_MULTIPLIER_OPTIONS.map((opt) => ({
              value: opt.value.toString(),
              label: `${opt.label} - ${opt.description}`,
            }))}
          />
          <p className="mt-1 text-xs text-gray-700">
            30x er mælt með fyrir Ísland vegna hærri verðbólgu
          </p>

          {leanFire.fiMultiplier === 30 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
              <span>✓</span>
              <span>Ráðlagt fyrir íslenskar aðstæður</span>
            </div>
          )}
        </div>

        {/* Optional Timeline Inputs */}
        <div className="border-t border-green-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tímalína (valkvætt)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Gefðu upp núverandi stöðu til að sjá hvenær þú nærð FI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Savings */}
            <div>
              <CurrencyInput
                label="Núverandi sparnaður"
                value={leanFire.currentSavings ?? 0}
                onChange={handleCurrentSavingsChange}
              />
            </div>

            {/* Monthly Savings Rate */}
            <div>
              <CurrencyInput
                label="Mánaðarlegur sparnaður"
                value={leanFire.savingsRate ?? 0}
                onChange={handleSavingsRateChange}
              />
            </div>

            {/* Current Age */}
            <div>
              <NumberInput
                label="Núverandi aldur"
                value={leanFire.currentAge ?? 0}
                onChange={handleCurrentAgeChange}
                min={LEANFIRE_RANGES.currentAge.min}
                max={LEANFIRE_RANGES.currentAge.max}
              />
            </div>

            {/* Investment Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Árlegt ávöxtun ({(leanFire.investmentReturn * 100).toFixed(1)}%)
              </label>
              <Slider
                value={leanFire.investmentReturn}
                onChange={handleInvestmentReturnChange}
                min={LEANFIRE_RANGES.investmentReturn.min}
                max={LEANFIRE_RANGES.investmentReturn.max}
                step={0.005}
                formatValue={(v) => `${(v * 100).toFixed(1)}%`}
              />
              <p className="mt-1 text-xs text-gray-700">
                5-7% er dæmigerð langtíma ávöxtun
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
