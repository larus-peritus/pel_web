/**
 * OverspendingHighlights - Alert-style highlights for overspending categories
 *
 * Features:
 * - Only shows if there are categories over budget
 * - Alert-style warning display
 * - Lists top 3 overspending categories
 * - Provides actionable suggestions
 * - Links to review specific categories
 */

import React from 'react';
import type { BaselineComparisonData, CategoryComparison } from '@/types/currentExpenses';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/lib/utils/formatting';

export interface OverspendingHighlightsProps {
  baselineComparison: BaselineComparisonData;
}

/**
 * OverspendingHighlights - Warning display for overspending
 */
export function OverspendingHighlights({
  baselineComparison,
}: OverspendingHighlightsProps) {
  // Get categories that are over budget
  const overspendingCategories = baselineComparison.categoryComparisons
    .filter((c) => c.status === 'over')
    .sort((a, b) => b.difference - a.difference); // Sort by highest overspending first

  // Don't render if no overspending
  if (overspendingCategories.length === 0) {
    return (
      <Alert variant="success" title="Frábært! Öll útgjöld innan áætlunar">
        <p>
          Þú ert að halda þig innan áætlunar í öllum flokkum. Haltu áfram með góða fjármálastjórnun!
        </p>
      </Alert>
    );
  }

  // Take top 3 overspending categories
  const topOverspending = overspendingCategories.slice(0, 3);
  const totalOverspending = overspendingCategories.reduce(
    (sum, cat) => sum + cat.difference,
    0
  );

  return (
    <Alert
      variant="warning"
      title={`⚠️ ${overspendingCategories.length} flokkar yfir áætlun`}
    >
      <div className="space-y-3">
        <p className="font-medium">
          Þú ert að eyða samtals{' '}
          <span className="text-warning-900 font-bold">
            {formatCurrency(totalOverspending)}
          </span>{' '}
          meira en áætlað í eftirfarandi flokkum:
        </p>

        {/* Top Overspending Categories */}
        <ul className="space-y-2">
          {topOverspending.map((category) => {
            const percentOver = category.baselineAmount > 0
              ? ((category.difference / category.baselineAmount) * 100)
              : 0;

            return (
              <li
                key={category.categoryId}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-warning-200"
              >
                <div className="flex-1">
                  <div className="font-semibold text-warning-900">
                    {category.categoryName}
                  </div>
                  <div className="text-sm text-warning-700">
                    Áætlun: {formatCurrency(category.baselineAmount)} → Raunverulegt: {formatCurrency(category.currentAmount)}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-bold text-warning-900">
                    +{formatCurrency(category.difference)}
                  </div>
                  <div className="text-xs text-warning-700">
                    (+{percentOver.toFixed(0)}%)
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Show count if there are more */}
        {overspendingCategories.length > 3 && (
          <p className="text-sm text-warning-700 italic">
            ... og {overspendingCategories.length - 3} flokkar til viðbótar
          </p>
        )}

        {/* Actionable Suggestions */}
        <div className="bg-warning-100 rounded-lg p-3 mt-3">
          <div className="font-semibold text-warning-900 mb-2">💡 Tillögur:</div>
          <ul className="text-sm text-warning-800 space-y-1 list-disc list-inside">
            <li>Skoðaðu línuatriði í hverjum flokki til að finna sparnaðartækifæri</li>
            <li>Bera saman við fyrri mánuði til að sjá þróun</li>
            {overspendingCategories.some(c => c.categoryId === 'askriftir') && (
              <li>
                Notaðu{' '}
                <a
                  href="/subscription-burn-meter"
                  className="underline font-medium hover:text-warning-900"
                >
                  Áskriftarmæli
                </a>
                {' '}til að fínstilla áskriftir
              </li>
            )}
            {overspendingCategories.some(c => c.categoryId === 'samgongur') && (
              <li>
                Notaðu{' '}
                <a
                  href="/commute-calculator"
                  className="underline font-medium hover:text-warning-900"
                >
                  Ferðakostnað
                </a>
                {' '}til að greina samgöngukostnað
              </li>
            )}
            {overspendingCategories.some(c => c.categoryId === 'husnaedi') && (
              <li>
                Notaðu{' '}
                <a
                  href="/housing-calculator"
                  className="underline font-medium hover:text-warning-900"
                >
                  Húsnæðisreiknivél
                </a>
                {' '}til að greina húsnæðiskostnað
              </li>
            )}
            <li>
              Íhugaðu að uppfæra{' '}
              <a
                href="/utgjaldareiknivel"
                className="underline font-medium hover:text-warning-900"
              >
                útgjaldaáætlun
              </a>
              {' '}ef þetta eru raunhæf útgjöld
            </li>
          </ul>
        </div>
      </div>
    </Alert>
  );
}
