/**
 * SavingsProgressList - Progress bars for categories with targets
 *
 * Features:
 * - Only show categories that have targetAmount set
 * - Progress bar for each category
 * - Display: icon, name, current/target, percentage
 * - Remaining amount with life energy
 * - Empty state: "Engin markmið sett" if no targets
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { useCalculator } from '@/context/CalculatorContext';
import type { SavingsCategory } from '@/types/savingsReport';

export interface SavingsProgressListProps {
  categories: SavingsCategory[];
}

/**
 * SavingsProgressList - List of categories with targets and progress
 */
export function SavingsProgressList({ categories }: SavingsProgressListProps) {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? null;

  // Filter to only categories with targets set
  const categoriesWithTargets = categories
    .filter(cat => !cat.isHidden && cat.data.targetAmount && cat.data.targetAmount > 0)
    .sort((a, b) => a.order - b.order);

  if (categoriesWithTargets.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Framvinda markmiða
          </h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-neutral-500">
            Engin markmið sett
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Framvinda markmiða
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoriesWithTargets.map((category) => {
          const { balance, targetAmount } = category.data;
          const target = targetAmount || 0;
          const percentage = target > 0 ? Math.min((balance / target) * 100, 100) : 0;
          const remaining = Math.max(target - balance, 0);
          const remainingHours = actualHourlyWage && actualHourlyWage > 0
            ? remaining / actualHourlyWage
            : null;

          return (
            <div key={category.id} className="space-y-2">
              {/* Category header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary-600">
                  {formatNumber(percentage, 0)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Current vs target */}
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>
                  {formatCurrency(balance)} / {formatCurrency(target)}
                </span>
                <span className="text-neutral-500">
                  {remaining > 0 && (
                    <>
                      {formatCurrency(remaining)} eftir
                      {remainingHours !== null && (
                        <> ({formatNumber(remainingHours, 0)} klst)</>
                      )}
                    </>
                  )}
                  {remaining === 0 && '✓ Náð markmiði!'}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
