'use client';

import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

/**
 * Income inputs section for the calculator
 * Displays monthly values, stores yearly internally.
 * Displays: gross monthly income, hours per week, weeks per year, additional income
 */
export function IncomeInputs() {
  const { inputs, updateIncome } = useCalculator();
  const { income } = inputs;

  // Convert yearly stored value to monthly display
  const monthlyGrossIncome = Math.round(income.grossAnnualIncome / 12);
  const monthlyAdditionalIncome = Math.round(income.additionalIncome / 12);

  // Handle monthly input -> yearly storage
  const handleGrossIncomeChange = useCallback(
    (monthlyValue: number) => {
      updateIncome({ grossAnnualIncome: monthlyValue * 12 });
    },
    [updateIncome]
  );

  const handleHoursChange = useCallback(
    (value: number) => {
      updateIncome({ workHoursPerWeek: value });
    },
    [updateIncome]
  );

  const handleVacationDaysChange = useCallback(
    (value: number) => {
      updateIncome({ vacationDays: value });
    },
    [updateIncome]
  );

  const handleAdditionalIncomeChange = useCallback(
    (monthlyValue: number) => {
      updateIncome({ additionalIncome: monthlyValue * 12 });
    },
    [updateIncome]
  );

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">Tekjur</h2>
        <p className="text-sm text-neutral-600">
          Sláðu inn mánaðartekjur þínar og vinnufyrirkomulag
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            htmlFor="gross-income"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Heildartekjur á mánuði
          </label>
          <CurrencyInput
            id="gross-income"
            value={monthlyGrossIncome}
            onChange={handleGrossIncomeChange}
            placeholder="580000"
            aria-describedby="gross-income-desc"
          />
          <p id="gross-income-desc" className="mt-1 text-xs text-neutral-500">
            Heildarlaun þín eftir skatta og frádrætti
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="hours-per-week"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Stundir á viku
            </label>
            <NumberInput
              id="hours-per-week"
              value={income.workHoursPerWeek}
              onChange={handleHoursChange}
              min={1}
              max={100}
              step={1}
            />
          </div>
          <div>
            <label
              htmlFor="vacation-days"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Orlofsdagar
            </label>
            <NumberInput
              id="vacation-days"
              value={income.vacationDays}
              onChange={handleVacationDaysChange}
              min={0}
              max={60}
              step={1}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="additional-income"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Viðbótartekjur á mánuði (valkvætt)
          </label>
          <CurrencyInput
            id="additional-income"
            value={monthlyAdditionalIncome}
            onChange={handleAdditionalIncomeChange}
            placeholder="0"
            aria-describedby="additional-income-desc"
          />
          <p id="additional-income-desc" className="mt-1 text-xs text-neutral-500">
            Bónusar, aukatekjur, eða aðrar tekjur (mánaðarlegt meðaltal)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
