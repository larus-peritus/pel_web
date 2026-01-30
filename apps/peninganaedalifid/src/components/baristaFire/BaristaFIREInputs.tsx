/**
 * BaristaFIREInputs - Financial inputs for Barista FIRE calculator
 *
 * Handles:
 * - Current savings input
 * - Expense tier selector OR custom expense input
 * - Investment return rate slider (4-10%, default 5%)
 * - Optional current age input
 * - Integration with expense baseline results
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { Alert } from '@/components/ui/Alert';
import type { ExpenseTier } from '@/types/baristaFire';
import type { ExpenseBaselineResults } from '@/types/expenseBaseline';
import { TIER_LABELS, TIER_DESCRIPTIONS, FI_MULTIPLIER_OPTIONS } from '@/lib/constants/baristaFire';
import { formatCurrency } from '@/lib/utils';

export interface BaristaFIREInputsProps {
  currentSavings: number;
  selectedTier: ExpenseTier | null;
  customMonthlyExpense: number | null;
  investmentReturnRate: number;
  fiMultiplier: number;
  currentAge: number | null;
  expenseBaselineResults: ExpenseBaselineResults | null;
  onCurrentSavingsChange: (value: number) => void;
  onTierChange: (tier: ExpenseTier | null) => void;
  onCustomExpenseChange: (value: number | null) => void;
  onReturnRateChange: (value: number) => void;
  onFIMultiplierChange: (value: number) => void;
  onCurrentAgeChange: (value: number | null) => void;
}

export function BaristaFIREInputs({
  currentSavings,
  selectedTier,
  customMonthlyExpense,
  investmentReturnRate,
  fiMultiplier,
  currentAge,
  expenseBaselineResults,
  onCurrentSavingsChange,
  onTierChange,
  onCustomExpenseChange,
  onReturnRateChange,
  onFIMultiplierChange,
  onCurrentAgeChange,
}: BaristaFIREInputsProps) {
  const hasExpenseBaseline = expenseBaselineResults !== null;

  // Handle tier selection
  const handleTierSelect = (tier: ExpenseTier) => {
    onTierChange(tier);
    onCustomExpenseChange(null); // Clear custom expense when tier is selected
  };

  // Handle custom expense mode
  const handleCustomMode = () => {
    onTierChange(null);
    onCustomExpenseChange(customMonthlyExpense || 0);
  };

  // Handle age toggle
  const handleAgeToggle = (enabled: boolean) => {
    if (enabled) {
      onCurrentAgeChange(currentAge || 30);
    } else {
      onCurrentAgeChange(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold text-neutral-900">
          Þínar tölur
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Núverandi staða og áætlanir
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Savings */}
        <div>
          <CurrencyInput
            label="Núverandi sparnaður / fjárfestingar"
            value={currentSavings}
            onChange={onCurrentSavingsChange}
            helpText="Heildarfjárhæð sem þú hefur nú þegar sparað eða fjárfest"
          />
        </div>

        {/* Expense Selection */}
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">
            Árlegt útgjöld
          </label>

          {/* Expense Baseline Integration */}
          {hasExpenseBaseline ? (
            <div className="space-y-3">
              <Alert variant="success">
                <p className="text-sm">
                  Útgjaldagrunnstofa greindur! Veldu útgjaldastig eða sláðu inn sérsniðnar útgjöld.
                </p>
              </Alert>

              {/* Tier Selector */}
              <div className="grid grid-cols-3 gap-3">
                {(['barebones', 'comfortable', 'deluxe'] as ExpenseTier[]).map((tier) => {
                  const tierExpense = expenseBaselineResults?.totals?.[tier] ?? 0;
                  const isSelected = selectedTier === tier;

                  return (
                    <button
                      key={tier}
                      onClick={() => handleTierSelect(tier)}
                      className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    >
                      <span className="text-sm font-semibold text-neutral-900">
                        {TIER_LABELS[tier]}
                      </span>
                      <span className="text-xs text-neutral-600 mt-1">
                        {TIER_DESCRIPTIONS[tier]}
                      </span>
                      <span className="text-xs font-semibold text-primary-600 mt-2">
                        {formatCurrency(tierExpense)}/mán
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Expense Option */}
              <button
                onClick={handleCustomMode}
                className={`w-full rounded-lg border-2 p-3 text-left text-sm transition-all ${
                  selectedTier === null
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                Sérsniðin útgjöld
              </button>
            </div>
          ) : null}

          {/* Custom Monthly Expense Input - shows when no baseline OR when custom mode selected */}
          {(selectedTier === null || !hasExpenseBaseline) && (
            <CurrencyInput
              label="Mánaðarleg útgjöld"
              value={customMonthlyExpense || 0}
              onChange={(value) => onCustomExpenseChange(value)}
              helpText="Sláðu inn meðaltal mánaðarlegra útgjalda þinna"
            />
          )}
        </div>

        {/* Investment Return Rate */}
        <div>
          <Slider
            label="Árleg ávöxtun fjárfestinga"
            value={investmentReturnRate * 100} // Convert to percentage
            onChange={(value) => onReturnRateChange(value / 100)} // Convert back to decimal
            min={4}
            max={10}
            step={0.5}
            showValue={true}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <p className="mt-1 text-xs text-neutral-700">
            Raunávöxtun (eftir verðbólgu). 5-7% er dæmigert fyrir blandað safn.
          </p>
        </div>

        {/* FI Multiplier Selector */}
        <div>
          <label className="mb-3 block text-sm font-medium text-neutral-700">
            FI margfaldari (úttektarhlutfall)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FI_MULTIPLIER_OPTIONS.map((option) => {
              const isSelected = fiMultiplier === option.multiplier;
              return (
                <button
                  key={option.multiplier}
                  onClick={() => onFIMultiplierChange(option.multiplier)}
                  className={`flex flex-col items-center rounded-lg border-2 p-3 text-center transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <span className="text-lg font-bold text-neutral-900">
                    {option.label}
                  </span>
                  <span className="text-xs text-neutral-600 mt-1">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-neutral-700">
            25x = árásargjarn (4% úttekt), 30x = miðlungs (3,3%), 33x = varfærinn (3%)
          </p>
        </div>

        {/* Age Input (Optional) */}
        <div className="border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-neutral-700">
              Núverandi aldur (valfrjálst)
            </label>
            <button
              onClick={() => handleAgeToggle(currentAge === null)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentAge !== null ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentAge !== null ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {currentAge !== null && (
            <NumberInput
              label="Aldur"
              value={currentAge}
              onChange={(value) => onCurrentAgeChange(value)}
              min={18}
              max={100}
              helpText="Notað til að sýna aldur við mismunandi áfanga"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
