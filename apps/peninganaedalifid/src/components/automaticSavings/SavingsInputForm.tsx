'use client';

import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { FREQUENCY_OPTIONS, SAVINGS_RANGES } from '@/lib/constants/savings';
import type { SavingsInputs, FrequencyKey } from '@/types/savings';

interface SavingsInputFormProps {
  inputs: SavingsInputs;
  onInputsChange: (inputs: Partial<SavingsInputs>) => void;
}

/**
 * Input form for automatic savings settings
 *
 * Allows users to configure:
 * - Monthly savings amount
 * - Frequency (weekly, biweekly, monthly, custom)
 * - Time period in years
 * - Expected return rate
 * - Inflation adjustment (optional)
 */
export function SavingsInputForm({ inputs, onInputsChange }: SavingsInputFormProps) {
  return (
    <div className="space-y-6">
      {/* Monthly Amount */}
      <CurrencyInput
        label="Mánaðarleg upphæð"
        value={inputs.monthlyAmount}
        onChange={(value) => onInputsChange({ monthlyAmount: value })}
        min={SAVINGS_RANGES.monthlyAmount.min}
        max={SAVINGS_RANGES.monthlyAmount.max}
        step={SAVINGS_RANGES.monthlyAmount.step}
        helpText="Hversu mikið viltu spara sjálfvirkt?"
        required
      />

      {/* Frequency */}
      <div>
        <Select
          label="Tíðni"
          value={inputs.frequency}
          onChange={(value) => onInputsChange({ frequency: value as FrequencyKey })}
          options={FREQUENCY_OPTIONS.map(f => ({ value: f.key, label: f.label }))}
        />
        <p className="text-sm text-neutral-600 mt-1">
          Hversu oft viltu spara?
        </p>
      </div>

      {/* Custom Frequency (conditional) */}
      {inputs.frequency === 'custom' && (
        <NumberInput
          label="Sérsniðin tíðni (sinnum á ári)"
          value={inputs.customFrequency ?? 12}
          onChange={(value) => onInputsChange({ customFrequency: value })}
          min={SAVINGS_RANGES.customFrequency.min}
          max={SAVINGS_RANGES.customFrequency.max}
          step={SAVINGS_RANGES.customFrequency.step}
          helpText="T.d. 26 fyrir launaseðil á tveggja vikna fresti"
        />
      )}

      {/* Years */}
      <NumberInput
        label="Tímabil (ár)"
        value={inputs.years}
        onChange={(value) => onInputsChange({ years: value })}
        min={SAVINGS_RANGES.years.min}
        max={SAVINGS_RANGES.years.max}
        step={SAVINGS_RANGES.years.step}
        helpText="Hversu lengi viltu spara?"
        required
      />

      {/* Return Rate */}
      <NumberInput
        label="Væntanleg ávöxtun (%)"
        value={inputs.returnRate}
        onChange={(value) => onInputsChange({ returnRate: value })}
        min={SAVINGS_RANGES.returnRate.min}
        max={SAVINGS_RANGES.returnRate.max}
        step={SAVINGS_RANGES.returnRate.step}
        helpText="7% er raunhæf áætlun fyrir alþjóðlega hlutabréfavísitölu"
        required
      />

      {/* Inflation Adjustment */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="adjustForInflation"
            checked={inputs.adjustForInflation}
            onChange={(e) => onInputsChange({ adjustForInflation: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
          />
          <label htmlFor="adjustForInflation" className="ml-2 block text-sm font-medium text-neutral-900">
            Leiðrétta fyrir verðbólgu
          </label>
        </div>
        <p className="text-sm text-neutral-600 ml-6">
          Sýna raunverðmæti í núverandi krónum
        </p>

        {inputs.adjustForInflation && (
          <div className="ml-6">
            <NumberInput
              label="Verðbólguprósenta (%)"
              value={inputs.inflationRate}
              onChange={(value) => onInputsChange({ inflationRate: value })}
              min={SAVINGS_RANGES.inflationRate.min}
              max={SAVINGS_RANGES.inflationRate.max}
              step={SAVINGS_RANGES.inflationRate.step}
              helpText="2.5% er sögulegt meðaltal á Íslandi"
            />
          </div>
        )}
      </div>
    </div>
  );
}
