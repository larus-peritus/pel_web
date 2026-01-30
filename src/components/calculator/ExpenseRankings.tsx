'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { formatMonthlyCurrency } from '@/lib/utils/formatters';
import { formatLifeEnergy, dollarsToLifeEnergy } from '@/lib/calculations';

/**
 * Expense impact rankings component
 * Shows expenses sorted by life-energy cost (highest first)
 * Displays monthly values
 */
export function ExpenseRankings() {
  const { results } = useCalculator();

  if (!results || results.expenseBreakdown.length === 0) {
    return null;
  }

  const { expenseBreakdown } = results;

  // Get the maximum amount for progress bar scaling
  const maxAmount = expenseBreakdown[0]?.amount || 1;

  // Calculate total monthly expenses
  const totalMonthlyExpenses = Math.round(results.totalMoneyExpenses / 12);

  return (
    <Card variant="outlined">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Kostnaðarröðun
        </h3>
        <p className="text-sm text-neutral-600">
          Vinnukostnaður raðað eftir lífsorku (á mánuði)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenseBreakdown.map((item, index) => {
            const progressWidth = (item.amount / maxAmount) * 100;
            const monthlyAmount = Math.round(item.amount / 12);
            // Calculate life energy from monthly amount, not yearly
            const monthlyLifeEnergyHours = dollarsToLifeEnergy(monthlyAmount, results.actualHourlyWage);

            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                      index === 0 ? 'bg-danger-50 text-danger-600' :
                      'bg-warning-50 text-warning-600'
                    )}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-neutral-900">
                      {formatMonthlyCurrency(monthlyAmount)}
                    </span>
                    <span className="text-neutral-500 ml-2">
                      ({formatLifeEnergy(monthlyLifeEnergyHours)})
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      index === 0 ? 'bg-danger-500' : 'bg-warning-500'
                    )}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total row */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-neutral-900">Heildar mánaðarkostnaður</span>
            <span className="text-danger-600">
              {formatMonthlyCurrency(totalMonthlyExpenses)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
