'use client';

/**
 * Tier Comparison Display Component
 *
 * Visual comparison of three spending tiers showing monthly and annual totals
 * with color-coded cards and relative size indicators.
 *
 * Task 5.2: Create TierComparisonDisplay Component
 * Epic 5: Results Summary Display
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { ExpenseBaselineResults } from '@/types/expenseBaseline';
import { formatCurrency } from '@/lib/utils/formatters';
import { useMemo } from 'react';

interface TierComparisonDisplayProps {
  results: ExpenseBaselineResults;
}

export function TierComparisonDisplay({ results }: TierComparisonDisplayProps) {
  // Calculate relative percentages for visual bars (relative to deluxe tier)
  const percentages = useMemo(() => {
    const max = results.totals.deluxe;
    return {
      barebones: (results.totals.barebones / max) * 100,
      comfortable: (results.totals.comfortable / max) * 100,
      deluxe: 100,
    };
  }, [results.totals]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Samanburður útgjaldastig
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Mánaðarleg og árleg útgjöld fyrir hvert stig
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Barebones Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="font-medium text-amber-900">Lágmarks</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {formatCurrency(results.totals.barebones)}
                </div>
                <div className="text-xs text-gray-600">á mánuði</div>
              </div>
            </div>

            {/* Visual bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentages.barebones}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600 text-right">
              {formatCurrency(results.annualTotals.barebones)} á ári
            </div>
          </div>

          {/* Comfortable Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-green-900">Þægilegt</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {formatCurrency(results.totals.comfortable)}
                </div>
                <div className="text-xs text-gray-600">á mánuði</div>
              </div>
            </div>

            {/* Visual bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentages.comfortable}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600 text-right">
              {formatCurrency(results.annualTotals.comfortable)} á ári
            </div>
          </div>

          {/* Deluxe Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-medium text-purple-900">Lúxus</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {formatCurrency(results.totals.deluxe)}
                </div>
                <div className="text-xs text-gray-600">á mánuði</div>
              </div>
            </div>

            {/* Visual bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentages.deluxe}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600 text-right">
              {formatCurrency(results.annualTotals.deluxe)} á ári
            </div>
          </div>
        </div>

        {/* Summary insight */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Munur milli lægsta og hæsta stigs:{' '}
            <span className="font-semibold text-gray-900">
              {formatCurrency(results.tierDifferences.bareToDeluxe.isk)}
            </span>{' '}
            á mánuði
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
