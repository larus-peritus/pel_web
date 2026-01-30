'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Button } from '@/components/ui/Button';
import {
  DEFAULT_SAVINGS_INPUTS,
  ICELANDIC_SAVINGS_PRESETS,
  SAVINGS_LIMITS,
} from '@/lib/constants/compoundSavings';
import { calculateSavingsResults } from '@/lib/calculations/savings';
import { formatCurrency } from '@/lib/utils/formatters';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { SavingsInputs } from '@/types/calculator';
import { useCalculator } from '@/context/CalculatorContext';
import { Alert } from '@/components/ui/Alert';

/**
 * Compound Savings Life Energy Calculator
 *
 * Helps users visualize how regular savings grow over time with compound interest,
 * expressed in both ISK and life energy hours.
 */
export function CompoundSavingsCalculator() {
  const [inputs, setInputs] = useState<SavingsInputs>(DEFAULT_SAVINGS_INPUTS);
  const { results } = useCalculator();

  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  // Calculate results in real-time
  const savingsResults = useMemo(() => {
    return calculateSavingsResults(inputs, actualHourlyWage);
  }, [inputs, actualHourlyWage]);

  return (
    <div className="space-y-6">
      {/* Missing wage prompt */}
      {!actualHourlyWage && (
        <Alert variant="info">
          <div>
            <h4 className="font-semibold text-info-900">Lífsorka ekki tiltæk</h4>
            <p className="text-sm text-info-700 mt-1">
              Til að sjá hversu mikilli lífsorku sparnaður þinn samsvarar, þarftu að
              reikna út raunverulegt tímakaup þitt í aðalreiknivélinni.
            </p>
          </div>
        </Alert>
      )}

      {/* Input Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Sparnaðaráætlun</h3>
          <p className="text-sm text-neutral-600">
            Stilltu mánaðarlegan sparnað, vexti og tímabil
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly savings */}
            <CurrencyInput
              label="Mánaðarlegur sparnaður"
              value={inputs.monthlySavings}
              onChange={(val) => setInputs({ ...inputs, monthlySavings: val })}
              min={SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS}
              max={SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS}
            />

            {/* Interest rate with presets */}
            <div>
              <NumberInput
                label="Árlegir vextir (%)"
                value={inputs.annualInterestRate}
                onChange={(val) => setInputs({ ...inputs, annualInterestRate: val })}
                min={SAVINGS_LIMITS.MIN_INTEREST_RATE}
                max={SAVINGS_LIMITS.MAX_INTEREST_RATE}
                step={0.1}
              />
              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {ICELANDIC_SAVINGS_PRESETS.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={
                      inputs.annualInterestRate === preset.rate
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={() =>
                      setInputs({ ...inputs, annualInterestRate: preset.rate })
                    }
                    size="sm"
                    type="button"
                    title={preset.description}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Time horizon */}
            <div className="md:col-span-2">
              <NumberInput
                label="Tímabil (ár)"
                value={inputs.timeHorizonYears}
                onChange={(val) => setInputs({ ...inputs, timeHorizonYears: val })}
                min={SAVINGS_LIMITS.MIN_TIME_HORIZON}
                max={SAVINGS_LIMITS.MAX_TIME_HORIZON}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Future Value Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-primary-700">
              Framtíðarvirði
            </h3>
            <p className="text-sm text-neutral-600">
              Heildarvirði eftir {inputs.timeHorizonYears} ár
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-700">
              {formatCurrency(savingsResults.futureValue)}
            </div>
            {actualHourlyWage > 0 && (
              <div className="mt-2 text-lg text-primary-600">
                {formatLifeEnergy(savingsResults.futureValueLifeEnergy)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interest Earned Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-success-700">
              Vextir aflað
            </h3>
            <p className="text-sm text-neutral-600">
              Lífsorka sem peningarnir þínir afla
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-700">
              {formatCurrency(savingsResults.totalInterestEarned)}
            </div>
            {actualHourlyWage > 0 && (
              <div className="mt-2 text-lg text-success-600">
                {formatLifeEnergy(savingsResults.interestEarnedLifeEnergy)}
                <span className="ml-2 text-xs bg-success-100 text-success-800 px-2 py-1 rounded">
                  Gjöf!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Contributions Card */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-700">
              Heildarframlag
            </h3>
            <p className="text-sm text-neutral-600">Samtals innborgað</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-700">
              {formatCurrency(savingsResults.totalContributions)}
            </div>
            <div className="mt-2 text-sm text-neutral-600">
              {formatCurrency(inputs.monthlySavings)}/mán ×{' '}
              {inputs.timeHorizonYears * 12} mán
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current wage indicator */}
      {actualHourlyWage > 0 && (
        <div className="text-xs text-neutral-500 text-center">
          Reiknað með launum: {formatCurrency(actualHourlyWage)}/klst
        </div>
      )}
    </div>
  );
}
