/**
 * TopExpensesList - Display expense line items with expand/collapse
 *
 * Features:
 * - Shows top 10 by default
 * - Expandable to show all expenses
 * - Shows category, label, amount, life energy
 * - Ranked numbering
 */

'use client';

import React, { useState } from 'react';
import type { LineItemSummary } from '@/types/currentExpenses';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/lib/utils/formatting';

export interface TopExpensesListProps {
  topExpenses: LineItemSummary[];
  actualHourlyWage: number | null;
}

interface ExpenseItemProps {
  rank: number;
  expense: LineItemSummary;
  showLifeEnergy: boolean;
}

function ExpenseItem({ rank, expense, showLifeEnergy }: ExpenseItemProps) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-neutral-100 last:border-0">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
        {rank}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {expense.label}
            </p>
            <p className="text-xs text-neutral-500">
              {expense.categoryName}
              {expense.isEssential && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Nauðsyn
                </span>
              )}
            </p>
          </div>

          {/* Amount and Life Energy */}
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-semibold text-neutral-900">
              {formatCurrency(expense.amount)}
            </p>
            {showLifeEnergy && expense.lifeEnergyHours !== null && (
              <p className="text-xs text-amber-600 mt-0.5">
                {formatNumber(expense.lifeEnergyHours, 1)} klst
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TopExpensesList - List component showing expenses with expand option
 */
export function TopExpensesList({
  topExpenses,
  actualHourlyWage,
}: TopExpensesListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showLifeEnergy = actualHourlyWage !== null && actualHourlyWage > 0;

  const DEFAULT_LIMIT = 10;
  const hasMore = topExpenses.length > DEFAULT_LIMIT;
  const displayedExpenses = isExpanded ? topExpenses : topExpenses.slice(0, DEFAULT_LIMIT);

  if (topExpenses.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Stærstu útgjöldin
          </h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-neutral-500">
            Engin útgjöld skráð
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            {isExpanded ? 'Öll útgjöld' : 'Stærstu útgjöldin'}
          </h3>
          <span className="text-sm text-neutral-500">
            {isExpanded ? `${topExpenses.length} liðir` : `Top ${Math.min(topExpenses.length, DEFAULT_LIMIT)}`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-0">
          {displayedExpenses.map((expense, index) => (
            <ExpenseItem
              key={expense.lineItemId}
              rank={index + 1}
              expense={expense}
              showLifeEnergy={showLifeEnergy}
            />
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {hasMore && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full"
            >
              {isExpanded
                ? `Sýna minna ▲`
                : `Sýna öll útgjöld (${topExpenses.length}) ▼`
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
