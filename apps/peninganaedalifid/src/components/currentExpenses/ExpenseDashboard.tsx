/**
 * ExpenseDashboard - Main container for dashboard summary view
 *
 * Displays visual summary with:
 * - Quick stats cards
 * - Category breakdown chart
 * - Top expenses list
 * - Recommendations
 */

import React from 'react';
import type { CurrentExpenseResults } from '@/types/currentExpenses';
import { QuickStats } from './QuickStats';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { EssentialBreakdownChart } from './EssentialBreakdownChart';
import { TopExpensesList } from './TopExpensesList';
import { RecommendationPanel } from './RecommendationPanel';
import { Button } from '@/components/ui/Button';

export interface ExpenseDashboardProps {
  results: CurrentExpenseResults;
  actualHourlyWage: number | null;
  onToggleToEditor: () => void;
}

/**
 * ExpenseDashboard - Main container for expense summary and insights
 */
export function ExpenseDashboard({
  results,
  actualHourlyWage,
  onToggleToEditor,
}: ExpenseDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header with toggle button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Yfirlit
        </h2>
        <Button
          variant="secondary"
          size="md"
          onClick={onToggleToEditor}
        >
          Breyta útgjöldum
        </Button>
      </div>

      {/* Quick Stats */}
      <QuickStats
        results={results}
        actualHourlyWage={actualHourlyWage}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <CategoryBreakdownChart
          categoryBreakdown={results.categoryBreakdown}
        />

        {/* Essential vs Non-Essential Chart */}
        {results.essentialBreakdown && (
          <EssentialBreakdownChart
            essentialBreakdown={results.essentialBreakdown}
          />
        )}
      </div>

      {/* Top Expenses List */}
      <TopExpensesList
        topExpenses={results.topExpenses}
        actualHourlyWage={actualHourlyWage}
      />

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <RecommendationPanel
          recommendations={results.recommendations}
        />
      )}
    </div>
  );
}
