/**
 * QuickStats - Summary stat cards at top of dashboard
 *
 * Features:
 * - Total savings card
 * - Monthly contribution card
 * - Savings rate card (if income available)
 * - Life energy card (if AWH available)
 * - Responsive grid layout (4→2→1 columns)
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { formatCurrency, formatNumber, formatHours } from '@/lib/utils/formatters';
import type { SavingsReportResults } from '@/types/savingsReport';

export interface QuickStatsProps {
  results: SavingsReportResults;
}

/**
 * QuickStats - Summary statistics cards
 */
export function QuickStats({ results }: QuickStatsProps) {
  const {
    totalSavings,
    totalMonthlyContribution,
    savingsRate,
    lifeEnergy,
  } = results;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Savings */}
      <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white">
        <CardContent className="p-6">
          <div className="text-sm font-medium text-neutral-600 mb-1">
            Heildarsparnaður
          </div>
          <div className="text-3xl font-bold text-primary-700">
            {formatCurrency(totalSavings)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Samtals í öllum flokkum
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Monthly Contribution */}
      <Card variant="elevated" className="bg-gradient-to-br from-success-50 to-white">
        <CardContent className="p-6">
          <div className="text-sm font-medium text-neutral-600 mb-1">
            Mánaðarleg framlög
          </div>
          <div className="text-3xl font-bold text-success-700">
            {formatCurrency(totalMonthlyContribution)}
          </div>
          <div className="text-xs text-neutral-500 mt-2">
            Samtals á mánuði
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Savings Rate (only if income available) */}
      {savingsRate !== null && (
        <Card variant="elevated" className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-neutral-600 mb-1">
              Sparnaðarhlutfall
            </div>
            <div className="text-3xl font-bold text-amber-700">
              {formatNumber(savingsRate, 1)}%
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              Af tekjum
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card 4: Life Energy (only if AWH available) */}
      {lifeEnergy && (
        <Card variant="elevated" className="bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-neutral-600 mb-1">
              Lífsorka
            </div>
            <div className="text-3xl font-bold text-purple-700">
              {formatNumber(lifeEnergy.totalBalanceHours, 0)} klst
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              Heildar vinnustundir
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
