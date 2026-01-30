'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useCalculator } from '@/context/CalculatorContext';
import { SavingsInputForm } from './SavingsInputForm';
import { SavingsSummary } from './SavingsSummary';
import { calculateSavingsResults } from '@/lib/calculations/automaticSavings';
import { DEFAULT_SAVINGS_INPUTS } from '@/lib/constants/savings';
import { formatCurrency } from '@/lib/utils/formatters';
import type { SavingsInputs } from '@/types/savings';

/**
 * Automatic Savings Impact Calculator
 *
 * Helps users visualize long-term impact of automatic savings
 * with compound interest and life energy context.
 *
 * Based on "Your Money or Your Life" philosophy of "Pay Yourself First"
 */
export function AutomaticSavingsCalculator() {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  // State
  const [inputs, setInputs] = useState<SavingsInputs>(DEFAULT_SAVINGS_INPUTS);

  // Handle input changes
  const handleInputsChange = (updates: Partial<SavingsInputs>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  // Calculate results (memoized)
  const savingsResults = useMemo(() => {
    // For monthlyExpenses, we could get from CalculatorContext if available
    // For MVP, we'll omit it (freedomMonths will be undefined)
    return calculateSavingsResults(
      inputs,
      actualHourlyWage > 0 ? actualHourlyWage : undefined
    );
  }, [inputs, actualHourlyWage]);

  // Calculate 10 & 20 year comparisons (only if current years is different)
  const show10And20YearComparison = inputs.years !== 10 && inputs.years !== 20;

  const results10Years = useMemo(() => {
    if (!show10And20YearComparison) return null;
    return calculateSavingsResults(
      { ...inputs, years: 10 },
      actualHourlyWage > 0 ? actualHourlyWage : undefined
    );
  }, [inputs, actualHourlyWage, show10And20YearComparison]);

  const results20Years = useMemo(() => {
    if (!show10And20YearComparison) return null;
    return calculateSavingsResults(
      { ...inputs, years: 20 },
      actualHourlyWage > 0 ? actualHourlyWage : undefined
    );
  }, [inputs, actualHourlyWage, show10And20YearComparison]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="py-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sjálfvirk sparnaðaráhrif reiknivél
          </h2>
          <p className="text-neutral-700">
            Sjáðu hvernig sjálfvirkur sparnaður vex yfir tíma með krafti samsettrar ávöxtunar.
            Tengdu við þitt raunverulega tímakaup til að sjá lífsorku áhrif.
          </p>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold">Sparnaðar upplýsingar</h3>
        </CardHeader>
        <CardContent>
          <SavingsInputForm inputs={inputs} onInputsChange={handleInputsChange} />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <SavingsSummary
        results={savingsResults}
        actualHourlyWage={actualHourlyWage > 0 ? actualHourlyWage : undefined}
        years={inputs.years}
        monthlyAmount={inputs.monthlyAmount}
      />

      {/* Show 10 & 20 year comparison (NS-1.3) */}
      {show10And20YearComparison && results10Years && results20Years && (
        <Card variant="outlined">
          <CardHeader>
            <h3 className="text-lg font-semibold">Samanburður: 10 ár vs 20 ár</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Eftir 10 ár</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results10Years.futureValue)}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Eftir 20 ár</p>
                <p className="text-lg font-semibold text-primary-600">
                  {formatCurrency(results20Years.futureValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
