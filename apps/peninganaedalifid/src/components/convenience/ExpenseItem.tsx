'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CONVENIENCE_CATEGORY_LABELS } from '@/lib/calculations/convenienceExpenses';
import { formatRelativeDate } from '@/lib/utils/dateUtils';
import type { ConvenienceExpense } from '@/types/calculator';

interface ExpenseItemProps {
  expense: ConvenienceExpense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Individual expense item with edit/delete actions
 */
export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Category colors
  const categoryColors: Record<string, string> = {
    delivery: 'bg-orange-100 text-orange-800',
    taxi: 'bg-yellow-100 text-yellow-800',
    prepared: 'bg-green-100 text-green-800',
    restaurant: 'bg-purple-100 text-purple-800',
    impulse: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(expense.id);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
      role="article"
      aria-label={`Kostnaður: ${CONVENIENCE_CATEGORY_LABELS[expense.category]}, ${expense.amount} krónur`}
    >
      {/* Left side: Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-semibold text-gray-900">
            {expense.amount.toLocaleString('is-IS')} kr
          </span>
          <Badge
            variant="neutral"
            className={categoryColors[expense.category] || categoryColors.other}
          >
            {CONVENIENCE_CATEGORY_LABELS[expense.category]}
          </Badge>
          <Badge variant={expense.isWorkday ? 'info' : 'neutral'}>
            {expense.isWorkday ? 'Vinnudagur' : 'Frídagur'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <time dateTime={expense.date}>
            {formatRelativeDate(new Date(expense.date))}
          </time>
        </div>

        {expense.note && (
          <p className="mt-1 text-sm text-gray-700 truncate">{expense.note}</p>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          onClick={() => onEdit(expense.id)}
          aria-label="Breyta kostnaði"
          title="Breyta"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Button>

        <Button
          variant="ghost"
          onClick={handleDelete}
          aria-label={
            showDeleteConfirm ? 'Staðfesta eyðingu' : 'Eyða kostnaði'
          }
          title={showDeleteConfirm ? 'Smelltu aftur til að eyða' : 'Eyða'}
          className={showDeleteConfirm ? 'text-red-600 hover:text-red-700' : ''}
        >
          {showDeleteConfirm ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
