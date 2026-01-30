/**
 * Combined impact display showing aggregated metrics from all cuts
 * Shows life energy, future value, and FI impact
 */

'use client';

import type { CascadingCutImpact } from '@/types/cascadingCut';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  getImpactIndicator,
  formatMonths as formatMonthsImpact,
} from '@/lib/calculations/cutImpact';

interface CascadingImpactSummaryProps {
  impact: CascadingCutImpact;
  hasFIInputs: boolean;
  className?: string;
}

export function CascadingImpactSummary({
  impact,
  hasFIInputs,
  className = '',
}: CascadingImpactSummaryProps) {
  const { lifeEnergy, futureValue10, futureValue20, fiDateShift, totalCutAmount } = impact;

  if (totalCutAmount === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <p className="text-gray-500">
          Veldu niðurskurðarmarkmið til að sjá áhrif
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Áhrif niðurskurðar: {formatCurrency(totalCutAmount)}/mán
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Life Energy */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl mb-2" aria-hidden="true">
            ⏰
          </div>
          <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">
            Lífsorka
          </h4>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-900">
              {lifeEnergy.hoursPerMonth.toFixed(1)} klst/mán
            </div>
            <div className="text-sm text-blue-700">
              {lifeEnergy.hoursPerYear.toFixed(1)} klst/ári
            </div>
            {lifeEnergy.daysPerYear !== null && lifeEnergy.daysPerYear >= 1 && (
              <div className="text-xs text-blue-600">
                ({lifeEnergy.daysPerYear.toFixed(1)} dagar/ári)
              </div>
            )}
          </div>
        </div>

        {/* Future Value */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl mb-2" aria-hidden="true">
            📈
          </div>
          <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-3">
            Framtíðarvirði (7% ávöxtun)
          </h4>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(futureValue10)}
            </div>
            <div className="text-sm text-green-700">eftir 10 ár</div>
            <div className="text-lg font-semibold text-green-800 mt-2">
              {formatCurrency(futureValue20)}
            </div>
            <div className="text-xs text-green-600">eftir 20 ár</div>
          </div>
        </div>

        {/* FI Impact */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl mb-2" aria-hidden="true">
            📅
          </div>
          <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wide mb-3">
            FI Áhrif
          </h4>
          {fiDateShift ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-900">
                {formatMonthsImpact(fiDateShift.months)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span
                  className="text-xs font-mono text-purple-600"
                  aria-hidden="true"
                >
                  {getImpactIndicator(fiDateShift.impactLevel).bars}
                </span>
              </div>
              <div className="text-sm text-purple-700">
                {getImpactIndicator(fiDateShift.impactLevel).label}
              </div>
            </div>
          ) : (
            <div className="text-sm text-purple-600">
              {hasFIInputs ? (
                <span>Ekki hægt að reikna</span>
              ) : (
                <span>
                  Settu upp FI markmið til að sjá áhrif á FI dagsetningu
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
