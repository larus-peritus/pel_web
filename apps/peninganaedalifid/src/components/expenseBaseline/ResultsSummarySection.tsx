'use client';

/**
 * Results Summary Section Component
 *
 * Container for all expense baseline results visualizations.
 * Displays tier comparisons, category breakdowns, life energy analysis,
 * and tier differences in a responsive grid layout.
 *
 * Task 5.1: Create ResultsSummarySection Component
 * Epic 5: Results Summary Display
 */

import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import type { ExpenseBaseline, ExpenseBaselineResults } from '@/types/expenseBaseline';
import { TierComparisonDisplay } from './TierComparisonDisplay';
import { CategoryBreakdownChart } from './CategoryBreakdownChart';
import { LifeEnergyComparison } from './LifeEnergyComparison';
import { TierDifferenceTable } from './TierDifferenceTable';
import { formatCurrency } from '@/lib/utils/formatters';

interface ResultsSummarySectionProps {
  baseline: ExpenseBaseline;
  results: ExpenseBaselineResults;
  actualHourlyWage: number | null;
}

export function ResultsSummarySection({
  baseline,
  results,
  actualHourlyWage,
}: ResultsSummarySectionProps) {
  // Don't render if no results
  if (!results) return null;

  return (
    <section className="space-y-8">
      {/* Section Header with Totals */}
      <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-6 border border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Yfirlit útgjaldagrunns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Barebones Total */}
          <div className="bg-white rounded-lg p-4 border border-amber-300">
            <div className="text-sm text-amber-700 font-medium mb-1">
              Lágmarks
            </div>
            <div className="text-2xl font-bold text-amber-900">
              {formatCurrency(results.totals.barebones)}
            </div>
            <div className="text-xs text-amber-600 mt-1">
              á mánuði
            </div>
          </div>

          {/* Comfortable Total */}
          <div className="bg-white rounded-lg p-4 border border-green-300">
            <div className="text-sm text-green-700 font-medium mb-1">
              Þægilegt
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(results.totals.comfortable)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              á mánuði
            </div>
          </div>

          {/* Deluxe Total */}
          <div className="bg-white rounded-lg p-4 border border-purple-300">
            <div className="text-sm text-purple-700 font-medium mb-1">
              Lúxus
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(results.totals.deluxe)}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              á mánuði
            </div>
          </div>
        </div>

        {/* Category count info */}
        <div className="mt-4 text-sm text-gray-600">
          {results.activeCategories} {results.activeCategories === 1 ? 'flokkur' : 'flokkar'} virkir
          {results.categoryCount > results.activeCategories && (
            <span className="ml-2">
              ({results.categoryCount - results.activeCategories} {results.categoryCount - results.activeCategories === 1 ? 'falinn' : 'faldir'})
            </span>
          )}
        </div>
      </div>

      {/* Main visualizations grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Comparison */}
        <TierComparisonDisplay results={results} />

        {/* Category Breakdown Chart */}
        <CategoryBreakdownChart
          baseline={baseline}
          results={results}
        />

        {/* Life Energy Comparison */}
        <LifeEnergyComparison
          results={results}
          actualHourlyWage={actualHourlyWage}
        />

        {/* Tier Difference Table */}
        <TierDifferenceTable results={results} />
      </div>

      {/* Warning if AWH not available */}
      {!actualHourlyWage && (
        <Alert variant="info">
          <p className="font-medium mb-2">Lífsorka ekki reiknuð</p>
          <p>
            Reiknaðu raunverulegt tímakaup þitt til að sjá hve margar klukkustundir
            þú þarft að vinna fyrir hvert útgjaldastig.
          </p>
        </Alert>
      )}
    </section>
  );
}
