/**
 * BasicInputs - Basic financial inputs for Pension-Aware FIRE calculator
 *
 * Features:
 * - Integration with expense baseline (all three tiers)
 * - Age and retirement age inputs with validation
 * - Current savings and monthly savings rate
 * - Investment return slider
 * - Auto-population from expense baseline
 * - Clear visual feedback on expense source (baseline vs manual)
 */

'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import {
  PENSION_INPUT_RANGES,
  PENSION_AWARE_DEFAULTS,
} from '@/lib/constants/pensionAwareFire';
import type { ExpenseTier } from '@/types/pensionAwareFire';

export function BasicInputs() {
  const {
    pensionAwareFire,
    updatePensionAwareFireState,
    expenseBaselineResults,
  } = useCalculator();

  // Local state for expense tier selection
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');

  if (!pensionAwareFire) return null;

  // Get expense values from baseline or use defaults
  const hasBaseline = expenseBaselineResults !== null;
  const barebonesExpense = expenseBaselineResults?.totals.barebones || 240_000;
  const comfortableExpense = expenseBaselineResults?.totals.comfortable || 300_000;
  const deluxeExpense = expenseBaselineResults?.totals.deluxe || 400_000;

  // Sync selected tier with state on mount and when baseline changes
  useEffect(() => {
    if (hasBaseline && pensionAwareFire.expenseSource === 'baseline') {
      setSelectedTier(pensionAwareFire.expenseTier);
    }
  }, [hasBaseline, pensionAwareFire.expenseSource, pensionAwareFire.expenseTier]);

  // Get current expense amount based on source
  const getCurrentExpense = (): number => {
    if (pensionAwareFire.expenseSource === 'baseline' && hasBaseline) {
      switch (selectedTier) {
        case 'barebones':
          return barebonesExpense;
        case 'comfortable':
          return comfortableExpense;
        case 'deluxe':
          return deluxeExpense;
        default:
          return comfortableExpense;
      }
    }
    return pensionAwareFire.monthlyExpenses;
  };

  const currentExpense = getCurrentExpense();

  // Handlers
  const handleCurrentAgeChange = (value: number) => {
    // Ensure retirement age is at least 1 year greater
    const newAge = value;
    updatePensionAwareFireState({
      currentAge: newAge,
      targetRetirementAge: Math.max(
        pensionAwareFire.targetRetirementAge,
        newAge + 1
      ),
    });
  };

  const handleRetirementAgeChange = (value: number) => {
    updatePensionAwareFireState({ targetRetirementAge: value });
  };

  const handleTierChange = (tier: ExpenseTier) => {
    setSelectedTier(tier);
    let expenseAmount: number;
    switch (tier) {
      case 'barebones':
        expenseAmount = barebonesExpense;
        break;
      case 'comfortable':
        expenseAmount = comfortableExpense;
        break;
      case 'deluxe':
        expenseAmount = deluxeExpense;
        break;
      default:
        expenseAmount = comfortableExpense;
    }
    updatePensionAwareFireState({
      expenseSource: 'baseline',
      expenseTier: tier,
      monthlyExpenses: expenseAmount,
    });
  };

  const handleManualExpenseChange = (value: number) => {
    updatePensionAwareFireState({
      expenseSource: 'manual',
      monthlyExpenses: value,
    });
  };

  const handleCurrentSavingsChange = (value: number) => {
    updatePensionAwareFireState({ currentSavings: value });
  };

  const handleMonthlySavingsChange = (value: number) => {
    updatePensionAwareFireState({ monthlySavings: value });
  };

  const handleInvestmentReturnChange = (value: number) => {
    updatePensionAwareFireState({ investmentReturn: value });
  };

  // Tier options for selection
  const tierOptions = [
    {
      value: 'barebones' as ExpenseTier,
      label: 'Lágmark',
      icon: '🍃',
      amount: barebonesExpense,
      description: 'Lágmarksútgjöld',
    },
    {
      value: 'comfortable' as ExpenseTier,
      label: 'Þægilegt',
      icon: '😊',
      amount: comfortableExpense,
      description: 'Þægileg lífsgæði',
    },
    {
      value: 'deluxe' as ExpenseTier,
      label: 'Lúxus',
      icon: '👑',
      amount: deluxeExpense,
      description: 'Ríkuleg lífsgæði',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Grunnupplýsingar
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Upplýsingar um aldur, útgjöld og sparnað
          </p>
        </div>

        {/* Expense Baseline Status */}
        {hasBaseline ? (
          <Alert variant="success" className="bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">✓</span>
              <span className="text-sm text-blue-800">
                Útgjaldagrunnlína tengd — gildi sótt úr{' '}
                <a href="/utgjaldareiknivel" className="font-medium underline hover:no-underline">
                  útgjaldaskýrslu
                </a>
              </span>
            </div>
          </Alert>
        ) : (
          <Alert variant="info">
            <p className="text-sm">
              Fylltu út{' '}
              <a href="/utgjaldareiknivel" className="font-medium underline hover:no-underline">
                útgjaldagrunnlínu
              </a>{' '}
              til að fá nákvæmari útreikninga með persónulegum útgjöldum.
            </p>
          </Alert>
        )}

        {/* Age Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Age */}
          <div>
            <NumberInput
              label="Núverandi aldur"
              value={pensionAwareFire.currentAge}
              onChange={handleCurrentAgeChange}
              min={PENSION_INPUT_RANGES.currentAge.min}
              max={PENSION_INPUT_RANGES.currentAge.max}
              helpText="Aldur þinn í dag"
            />
          </div>

          {/* Target Retirement Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Markaldur starfsloka ({pensionAwareFire.targetRetirementAge} ára)
            </label>
            <Slider
              value={pensionAwareFire.targetRetirementAge}
              onChange={handleRetirementAgeChange}
              min={Math.max(
                PENSION_INPUT_RANGES.targetRetirementAge.min,
                pensionAwareFire.currentAge + 1
              )}
              max={PENSION_INPUT_RANGES.targetRetirementAge.max}
              step={1}
              formatValue={(v) => `${v} ára`}
            />
            <p className="mt-1 text-xs text-gray-600">
              Á hvaða aldri viltu hætta að vinna?
            </p>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mánaðarleg útgjöld í starfslokum
          </label>

          {/* Tier Selection (when baseline available) */}
          {hasBaseline && pensionAwareFire.expenseSource === 'baseline' && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tierOptions.map((tier) => {
                const isSelected = selectedTier === tier.value;
                return (
                  <button
                    key={tier.value}
                    onClick={() => handleTierChange(tier.value)}
                    className={`
                      relative p-4 rounded-lg border-2 text-left transition-all
                      ${isSelected
                        ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-200'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-blue-600">
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
                        {tier.amount.toLocaleString('is-IS')} kr/mán
                      </p>
                      <p className="text-xs text-gray-500">{tier.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Manual Entry or Toggle */}
          {hasBaseline && pensionAwareFire.expenseSource === 'baseline' ? (
            <button
              onClick={() => handleManualExpenseChange(pensionAwareFire.monthlyExpenses)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Skipta yfir í handvirka innfærslu
            </button>
          ) : (
            <div>
              <CurrencyInput
                value={pensionAwareFire.monthlyExpenses}
                onChange={handleManualExpenseChange}
                min={PENSION_INPUT_RANGES.monthlyExpenses.min}
                max={PENSION_INPUT_RANGES.monthlyExpenses.max}
                helpText="Hversu mikið þarftu á mánuði í starfslokum?"
              />
              {hasBaseline && (
                <button
                  onClick={() => handleTierChange('comfortable')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Nota gildi úr útgjaldagrunnlínu
                </button>
              )}
            </div>
          )}
        </div>

        {/* Savings Inputs */}
        <div className="border-t border-blue-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sparnaður
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Savings */}
            <div>
              <CurrencyInput
                label="Núverandi sparnaður"
                value={pensionAwareFire.currentSavings}
                onChange={handleCurrentSavingsChange}
                min={PENSION_INPUT_RANGES.currentSavings.min}
                max={PENSION_INPUT_RANGES.currentSavings.max}
                helpText="Heildareignir sem þú getur notað til starfsloka"
              />
            </div>

            {/* Monthly Savings Rate */}
            <div>
              <CurrencyInput
                label="Mánaðarlegur sparnaður"
                value={pensionAwareFire.monthlySavings}
                onChange={handleMonthlySavingsChange}
                min={PENSION_INPUT_RANGES.monthlySavings.min}
                max={PENSION_INPUT_RANGES.monthlySavings.max}
                helpText="Hversu mikið sparar þú á mánuði?"
              />
            </div>
          </div>
        </div>

        {/* Investment Return */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Áætluð árleg ávöxtun ({(pensionAwareFire.investmentReturn * 100).toFixed(1)}%)
          </label>
          <Slider
            value={pensionAwareFire.investmentReturn}
            onChange={handleInvestmentReturnChange}
            min={PENSION_INPUT_RANGES.investmentReturn.min}
            max={PENSION_INPUT_RANGES.investmentReturn.max}
            step={0.005}
            formatValue={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <p className="mt-1 text-xs text-gray-600">
            5-7% er dæmigerð langtíma ávöxtun fyrir dreifða eignasafnið
          </p>
        </div>

        {/* Summary Box */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Samantekt</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Aldur núna:</p>
              <p className="text-xl font-bold text-blue-900">
                {pensionAwareFire.currentAge} ára
              </p>
            </div>
            <div>
              <p className="text-blue-700">Markaldur starfsloka:</p>
              <p className="text-xl font-bold text-blue-900">
                {pensionAwareFire.targetRetirementAge} ára
              </p>
            </div>
            <div>
              <p className="text-blue-700">Mánaðarleg útgjöld:</p>
              <p className="text-xl font-bold text-blue-900">
                {currentExpense.toLocaleString('is-IS')} kr
              </p>
            </div>
            <div>
              <p className="text-blue-700">Ár til starfsloka:</p>
              <p className="text-xl font-bold text-blue-900">
                {pensionAwareFire.targetRetirementAge - pensionAwareFire.currentAge} ár
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
