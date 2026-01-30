/**
 * CategoryComparisonTable - Detailed category-by-category comparison
 *
 * Table showing:
 * - Category name
 * - Current spending
 * - Baseline amount (from matched tier)
 * - Difference (ISK and %)
 * - Status (over/under/match)
 *
 * Features:
 * - Color-coded rows (red=over, green=under, neutral=match)
 * - Sorted by absolute difference (largest first)
 * - Responsive design
 */

import React from 'react';
import type { BaselineComparisonData, CategoryComparison } from '@/types/currentExpenses';
import { formatCurrency } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

export interface CategoryComparisonTableProps {
  baselineComparison: BaselineComparisonData;
}

interface ComparisonRowProps {
  comparison: CategoryComparison;
}

function ComparisonRow({ comparison }: ComparisonRowProps) {
  const { categoryName, currentAmount, baselineAmount, difference, status } = comparison;

  const percentageDiff = baselineAmount > 0
    ? ((difference / baselineAmount) * 100)
    : 0;

  // Color coding based on status
  const statusConfig = {
    over: {
      bgColor: 'bg-danger-50',
      textColor: 'text-danger-900',
      diffColor: 'text-danger-700',
      badge: 'bg-danger-100 text-danger-800',
      badgeLabel: 'Yfir',
      icon: '⬆️',
    },
    under: {
      bgColor: 'bg-success-50',
      textColor: 'text-success-900',
      diffColor: 'text-success-700',
      badge: 'bg-success-100 text-success-800',
      badgeLabel: 'Undir',
      icon: '⬇️',
    },
    match: {
      bgColor: 'bg-neutral-50',
      textColor: 'text-neutral-900',
      diffColor: 'text-neutral-700',
      badge: 'bg-neutral-100 text-neutral-800',
      badgeLabel: 'Passar',
      icon: '✓',
    },
  };

  const config = statusConfig[status];

  return (
    <tr className={cn('border-b border-neutral-200 transition-colors', config.bgColor)}>
      {/* Category Name */}
      <td className="px-4 py-3">
        <div className={cn('font-medium', config.textColor)}>
          {categoryName}
        </div>
      </td>

      {/* Current Amount */}
      <td className="px-4 py-3 text-right">
        <div className="font-semibold text-neutral-900">
          {formatCurrency(currentAmount)}
        </div>
      </td>

      {/* Baseline Amount */}
      <td className="px-4 py-3 text-right">
        <div className="text-neutral-700">
          {formatCurrency(baselineAmount)}
        </div>
      </td>

      {/* Difference */}
      <td className="px-4 py-3 text-right">
        <div className={cn('font-semibold', config.diffColor)}>
          {difference > 0 ? '+' : ''}{formatCurrency(difference)}
        </div>
        <div className={cn('text-xs mt-0.5', config.diffColor)}>
          ({percentageDiff > 0 ? '+' : ''}{percentageDiff.toFixed(0)}%)
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-4 py-3 text-center">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
            config.badge
          )}
        >
          <span>{config.icon}</span>
          <span>{config.badgeLabel}</span>
        </span>
      </td>
    </tr>
  );
}

/**
 * CategoryComparisonTable - Full comparison table
 */
export function CategoryComparisonTable({
  baselineComparison,
}: CategoryComparisonTableProps) {
  // Sort by absolute difference (largest first)
  const sortedComparisons = [...baselineComparison.categoryComparisons].sort(
    (a, b) => Math.abs(b.difference) - Math.abs(a.difference)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-100 border-b-2 border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Flokkur
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Núverandi
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Áætlun
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Mismunur
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Staða
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {sortedComparisons.map((comparison) => (
            <ComparisonRow
              key={comparison.categoryId}
              comparison={comparison}
            />
          ))}
        </tbody>
      </table>

      {/* Summary Footer */}
      <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div>
            <span className="font-medium text-neutral-700">
              {sortedComparisons.filter(c => c.status === 'over').length}
            </span>
            {' '}flokkar yfir áætlun
            {' • '}
            <span className="font-medium text-neutral-700">
              {sortedComparisons.filter(c => c.status === 'under').length}
            </span>
            {' '}flokkar undir áætlun
            {' • '}
            <span className="font-medium text-neutral-700">
              {sortedComparisons.filter(c => c.status === 'match').length}
            </span>
            {' '}flokkar passa
          </div>
        </div>
      </div>
    </div>
  );
}
