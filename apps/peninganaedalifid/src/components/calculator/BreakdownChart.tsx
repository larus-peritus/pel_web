'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatMonthlyCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

/**
 * Expense breakdown chart showing how gross income is reduced by expenses
 * Displays monthly values (internal calculations are yearly)
 */
export function BreakdownChart() {
  const { results, inputs } = useCalculator();

  if (!results) {
    return null;
  }

  const { expenseBreakdown, totalMoneyExpenses, netAnnualIncome } = results;
  const grossIncome = inputs.income.grossAnnualIncome + inputs.income.additionalIncome;

  // Convert to monthly for display
  const monthlyGrossIncome = Math.round(grossIncome / 12);
  const monthlyNetIncome = Math.round(netAnnualIncome / 12);

  // Calculate percentages for visualization
  const netPercent = grossIncome > 0 ? (netAnnualIncome / grossIncome) * 100 : 0;

  return (
    <Card variant="outlined">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Tekjusundurliðun
        </h3>
        <p className="text-sm text-neutral-600">
          Hvernig vinnukostnaður dregur úr tekjum þínum (á mánuði)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gross Income Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-700">Heildartekjur</span>
            <span className="font-semibold text-success-600">
              {formatMonthlyCurrency(monthlyGrossIncome)}
            </span>
          </div>
          <div className="h-6 bg-success-500 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-success-400 to-success-600" />
          </div>
        </div>

        {/* Expense deductions */}
        {expenseBreakdown.map((expense, index) => {
          const monthlyExpense = Math.round(expense.amount / 12);
          const expenseWidth = grossIncome > 0 ? (expense.amount / grossIncome) * 100 : 0;
          return (
            <div key={expense.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">- {expense.label}</span>
                <span className="font-medium text-danger-600">
                  -{formatMonthlyCurrency(monthlyExpense)}
                </span>
              </div>
              <div className="h-4 bg-neutral-100 rounded-md overflow-hidden">
                <div
                  className="h-full bg-danger-500 rounded-md transition-all duration-500"
                  style={{ width: `${Math.min(expenseWidth * 5, 100)}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Net Income Bar */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-700">Hreinar vinnutekjur</span>
              <span className="font-semibold text-primary-600">
                {formatMonthlyCurrency(monthlyNetIncome)}
              </span>
            </div>
            <div className="h-6 bg-neutral-100 rounded-md overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-md transition-all duration-500",
                  netPercent >= 80 ? "bg-success-500" :
                  netPercent >= 60 ? "bg-primary-500" :
                  netPercent >= 40 ? "bg-warning-500" :
                  "bg-danger-500"
                )}
                style={{ width: `${netPercent}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 text-center">
              {netPercent.toFixed(1)}% af heildartekjum
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
