/**
 * SavingsDashboard - Main container for dashboard view
 *
 * Features:
 * - Header with "Yfirlit" title and edit button (calls onEditClick prop)
 * - QuickStats section at top
 * - CategoryBreakdownChart
 * - SavingsProgressList (categories with targets)
 * - SavingsRateInsights
 * - Show empty state if no savings data
 */

import React from 'react';
import { Button } from '@/components/ui';
import { useCalculator } from '@/context/CalculatorContext';
import { QuickStats } from './QuickStats';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { SavingsProgressList } from './SavingsProgressList';
import { SavingsRateInsights } from './SavingsRateInsights';

export interface SavingsDashboardProps {
  onEditClick: () => void;
}

/**
 * SavingsDashboard - Dashboard view with stats and charts
 */
export function SavingsDashboard({ onEditClick }: SavingsDashboardProps) {
  const { savingsReport, savingsReportResults } = useCalculator();

  // Show empty state if no savings data
  if (!savingsReport || !savingsReportResults || savingsReport.categories.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Yfirlit</h2>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border-2 border-neutral-200 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">💰</div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Enginn sparnaður skráður
            </h3>
            <p className="text-neutral-600">
              Byrjaðu að fylgjast með sparnaðinum þínum með því að fylla út upplýsingar í hverjum flokki.
            </p>
            <Button onClick={onEditClick} size="lg">
              Byrja að skrá sparnaður
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Yfirlit</h2>
        <Button onClick={onEditClick} variant="secondary" size="md">
          ✏️ Breyta
        </Button>
      </div>

      {/* Quick Stats */}
      <QuickStats results={savingsReportResults} />

      {/* Two column layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <CategoryBreakdownChart
          categoryBreakdown={savingsReportResults.categoryBreakdown}
        />

        {/* Savings Rate Insights */}
        <SavingsRateInsights results={savingsReportResults} />
      </div>

      {/* Savings Progress List (full width) */}
      <SavingsProgressList categories={savingsReport.categories} />
    </div>
  );
}
