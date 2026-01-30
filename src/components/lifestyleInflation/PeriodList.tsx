'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Period } from '@/types/calculator';
import { getTotalSpending, comparePeriods } from '@/lib/utils/periodHelpers';
import { formatCurrency } from '@/lib/utils/formatters';

interface PeriodListProps {
  periods: Period[];
  onEdit: (period: Period) => void;
  onDelete: (id: string) => void;
}

/**
 * List of spending periods
 * Shows periods in chronological order (newest first)
 * with income, total spending, and savings rate
 */
export function PeriodList({ periods, onEdit, onDelete }: PeriodListProps) {
  // Sort periods newest first
  const sortedPeriods = [...periods].sort(comparePeriods);

  if (periods.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Engin tímabil skráð</p>
          <p className="text-sm text-gray-500 mt-1">
            Bættu við minnst tveimur tímabilum til að bera saman lífsstílsverðbólgu
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedPeriods.map((period) => {
        const totalSpending = getTotalSpending(period.spending);
        const savings = period.income - totalSpending;
        const savingsRate = period.income > 0 ? (savings / period.income) * 100 : 0;

        return (
          <Card key={period.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Period info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{period.name}</h4>

                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    {/* Income */}
                    <div>
                      <p className="text-gray-500">Tekjur</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(period.income)}
                      </p>
                    </div>

                    {/* Spending */}
                    <div>
                      <p className="text-gray-500">Útgjöld</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(totalSpending)}
                      </p>
                    </div>

                    {/* Savings rate */}
                    <div>
                      <p className="text-gray-500">Sparnaðarhlutfall</p>
                      <p className={`font-medium ${
                        savingsRate >= 30 ? 'text-green-600' :
                        savingsRate >= 10 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {savingsRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(period)}
                    aria-label={`Breyta ${period.name}`}
                  >
                    Breyta
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Ertu viss um að þú viljir eyða tímabilinu "${period.name}"?`)) {
                        onDelete(period.id);
                      }
                    }}
                    aria-label={`Eyða ${period.name}`}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Eyða
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Minimum periods notice */}
      {periods.length === 1 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-2">
            <span className="text-yellow-600">ℹ️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Bættu við öðru tímabili
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Þú þarft minnst tvö tímabil til að greina lífsstílsverðbólgu. Bættu við öðru tímabili til að sjá samanburð.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
