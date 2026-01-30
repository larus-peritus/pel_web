/**
 * Staycation comparison card component
 * Shows additional cost of traveling vs staying home
 */

import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import type { StaycationComparison } from '@/types/travelVacation';

export interface StaycationComparisonCardProps {
  comparison: StaycationComparison;
}

/**
 * StaycationComparisonCard - Shows staycation vs travel comparison
 */
export function StaycationComparisonCard({
  comparison,
}: StaycationComparisonCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Samanburður við að vera heima
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Staycation cost */}
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm font-medium text-neutral-700">
              Kostnaður að vera heima:
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              {formatCurrency(comparison.staycationTotalCost)}
            </span>
          </div>

          {/* Additional cost */}
          <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-200">
            <span className="text-sm font-medium text-primary-700">
              Aukakostnaður ferðar:
            </span>
            <span className="text-lg font-bold text-primary-900">
              {formatCurrency(comparison.additionalCostToTravel)}
            </span>
          </div>

          {/* Life energy hours */}
          <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm font-medium text-neutral-700">
              Í lífsorku:
            </span>
            <span className="text-lg font-semibold text-neutral-900">
              {comparison.additionalLifeEnergyHours.toFixed(1)} klukkustundir
            </span>
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-neutral-200 bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-900">{comparison.formattedSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
