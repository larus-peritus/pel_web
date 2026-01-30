'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ExpenseItem } from './ExpenseItem';
import { groupExpensesByDate } from '@/lib/utils/dateUtils';
import type { ConvenienceExpense } from '@/types/calculator';

interface ExpenseListProps {
  expenses: ConvenienceExpense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  maxVisible?: number;
}

type FilterType = 'all' | 'workdays' | 'weekends';

/**
 * List of convenience expenses with filtering and grouping
 */
export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  maxVisible = 7,
}: ExpenseListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAll, setShowAll] = useState(false);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Apply filter
    if (filter === 'workdays') {
      filtered = filtered.filter((exp) => exp.isWorkday);
    } else if (filter === 'weekends') {
      filtered = filtered.filter((exp) => !exp.isWorkday);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [expenses, filter]);

  // Limit visible expenses
  const visibleExpenses = useMemo(() => {
    if (showAll) return filteredExpenses;
    return filteredExpenses.slice(0, maxVisible);
  }, [filteredExpenses, showAll, maxVisible]);

  // Group by date
  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(visibleExpenses);
  }, [visibleExpenses]);

  // Get sorted date keys
  const dateKeys = useMemo(() => {
    return Object.keys(groupedExpenses).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedExpenses]);

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Nýlegur kostnaður
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Enginn kostnaður skráður
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Byrjaðu að skrá þreytukosnað til að sjá innsýn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Nýlegur kostnaður
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'færsla' : 'færslur'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter */}
        <div className="mb-4">
          <Select
            label="Sía"
            value={filter}
            onChange={(value) => setFilter(value as FilterType)}
            options={[
              { value: 'all', label: 'Allt' },
              { value: 'workdays', label: 'Aðeins vinnudagar' },
              { value: 'weekends', label: 'Aðeins frídagar' },
            ]}
          />
        </div>

        {/* Expense list grouped by date */}
        <div className="space-y-6">
          {dateKeys.map((dateKey) => {
            const dateExpenses = groupedExpenses[dateKey];
            const date = new Date(dateKey);
            const dateLabel = date.toLocaleDateString('is-IS', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <div key={dateKey}>
                {/* Date header */}
                <h4 className="text-sm font-medium text-gray-700 mb-2 sticky top-0 bg-white py-1">
                  {dateLabel}
                </h4>

                {/* Expenses for this date */}
                <div className="space-y-2">
                  {dateExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more button */}
        {filteredExpenses.length > maxVisible && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              aria-expanded={showAll}
            >
              {showAll
                ? 'Sýna minna'
                : `Sýna allt (${filteredExpenses.length - maxVisible} til viðbótar)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
