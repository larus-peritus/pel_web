/**
 * Single row in the priority list with up/down buttons
 * Shows category details, cut amount, and progress bar
 */

'use client';

import type { CascadingCutCategory } from '@/types/cascadingCut';
import { getCutStatusStyles } from '@/lib/calculations/cascadingCut';
import { formatCurrency } from '@/lib/utils/formatters';

interface CategoryPriorityItemProps {
  category: CascadingCutCategory;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function CategoryPriorityItem({
  category,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: CategoryPriorityItemProps) {
  const styles = getCutStatusStyles(category.status);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${styles.bg} border-gray-200`}
    >
      {/* Priority controls */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className={`p-1 rounded text-sm leading-none ${
            isFirst
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
          aria-label={`Færa ${category.name} upp`}
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className={`p-1 rounded text-sm leading-none ${
            isLast
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }`}
          aria-label={`Færa ${category.name} niður`}
        >
          ▼
        </button>
      </div>

      {/* Priority number */}
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
        {category.priority}
      </div>

      {/* Icon and name */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        <span className="text-xl" aria-hidden="true">
          {category.icon}
        </span>
        <span className={`font-medium ${styles.text}`}>{category.name}</span>
      </div>

      {/* Expense amount */}
      <div className="text-sm text-gray-600 whitespace-nowrap">
        {formatCurrency(category.expenseAmount)}
      </div>

      {/* Progress bar */}
      <div className="flex-1 mx-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.bar} transition-all duration-300`}
            style={{ width: `${Math.min(category.cutPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Cut percentage and amount */}
      <div className="text-right whitespace-nowrap">
        <div className="font-semibold text-sm">
          {Math.round(category.cutPercentage)}% niðurskurður
        </div>
        {category.cutAmount > 0 && (
          <div className="text-xs text-gray-500">
            -{formatCurrency(category.cutAmount)}
          </div>
        )}
      </div>
    </div>
  );
}
