'use client';

import { useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatMonthlyCurrency } from '@/lib/utils/formatters';
import type { MoneyExpenses } from '@/types/calculator';

interface ExpenseField {
  key: keyof MoneyExpenses;
  label: string;
  description: string;
  placeholder: string; // Monthly placeholder
}

const EXPENSE_FIELDS: ExpenseField[] = [
  {
    key: 'commute',
    label: 'Ferðakostnaður',
    description: 'Bensín, strætó, bílastæði, veggjöld, bifreiðaslit',
    placeholder: '33000',
  },
  {
    key: 'clothing',
    label: 'Vinnufatnaður',
    description: 'Faglegar fatir, einkennisfatnaður, þurrhreinsun',
    placeholder: '6000',
  },
  {
    key: 'meals',
    label: 'Vinnumáltíðir',
    description: 'Hádegisverðir, kaffi, snarl í vinnu',
    placeholder: '23000',
  },
  {
    key: 'decompression',
    label: 'Afslöppunarútgjöld',
    description: 'Gleðikaup og streitulosun',
    placeholder: '12000',
  },
  {
    key: 'childcareDelta',
    label: 'Aukakostnaður við barnagæslu',
    description: 'Aukakostnaður við barnagæslu vegna vinnu',
    placeholder: '0',
  },
  {
    key: 'other',
    label: 'Annar vinnukostnaður',
    description: 'Tæki, félagsgjöld, menntun, heimaskrifstofa',
    placeholder: '6000',
  },
];

/**
 * Money expenses input section for the calculator
 * Displays monthly values, stores yearly internally.
 */
export function ExpenseInputs() {
  const { inputs, updateMoneyExpenses } = useCalculator();
  const { moneyExpenses } = inputs;

  // Handle monthly input -> yearly storage
  const handleExpenseChange = useCallback(
    (key: keyof MoneyExpenses, monthlyValue: number) => {
      updateMoneyExpenses({ [key]: monthlyValue * 12 });
    },
    [updateMoneyExpenses]
  );

  // Calculate total monthly expenses (yearly total / 12)
  const totalYearlyExpenses = Object.values(moneyExpenses).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalMonthlyExpenses = Math.round(totalYearlyExpenses / 12);

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Vinnukostnaður
            </h2>
            <p className="text-sm text-neutral-600">
              Mánaðarlegur kostnaður tengdur vinnunni þinni
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Samtals</p>
            <p className="text-lg font-semibold text-danger-600">
              {formatMonthlyCurrency(totalMonthlyExpenses)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {EXPENSE_FIELDS.map((field) => {
          // Convert yearly stored value to monthly display
          const monthlyValue = Math.round(moneyExpenses[field.key] / 12);

          return (
            <div key={field.key}>
              <label
                htmlFor={`expense-${field.key}`}
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                {field.label}
              </label>
              <CurrencyInput
                id={`expense-${field.key}`}
                value={monthlyValue}
                onChange={(value) => handleExpenseChange(field.key, value)}
                placeholder={field.placeholder}
                aria-describedby={`expense-${field.key}-desc`}
              />
              <p
                id={`expense-${field.key}-desc`}
                className="mt-1 text-xs text-neutral-500"
              >
                {field.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
