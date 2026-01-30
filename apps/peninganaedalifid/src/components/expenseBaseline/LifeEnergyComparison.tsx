'use client';

/**
 * Life Energy Comparison Component
 *
 * Displays work hours required per tier (monthly and annual).
 * Shows alert if actual hourly wage is not available.
 *
 * Task 5.4: Create LifeEnergyComparison Component
 * Epic 5: Results Summary Display
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import type { ExpenseBaselineResults } from '@/types/expenseBaseline';
import { formatNumber } from '@/lib/utils/formatters';
import { useMemo } from 'react';

interface LifeEnergyComparisonProps {
  results: ExpenseBaselineResults;
  actualHourlyWage: number | null;
}

export function LifeEnergyComparison({
  results,
  actualHourlyWage,
}: LifeEnergyComparisonProps) {
  // Calculate work days per year (assuming 8-hour workdays)
  const workDaysPerYear = useMemo(() => {
    if (!results.lifeEnergy) return null;

    return {
      barebones: results.lifeEnergy.annual.barebones / 8,
      comfortable: results.lifeEnergy.annual.comfortable / 8,
      deluxe: results.lifeEnergy.annual.deluxe / 8,
    };
  }, [results.lifeEnergy]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          Lífsorka - Vinnustundir
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Hve margar klukkustundir þarft þú að vinna fyrir hvert stig
        </p>
      </CardHeader>

      <CardContent>
        {!actualHourlyWage || !results.lifeEnergy ? (
          // Alert when AWH not available
          <Alert variant="warning">
            <p className="font-medium mb-2">
              Raunverulegt tímakaup ekki reiknað
            </p>
            <p className="text-sm">
              Reiknaðu raunverulegt tímakaup þitt á forsíðu til að sjá hve margar
              klukkustundir þú þarft að vinna fyrir hvert útgjaldastig.
            </p>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Monthly hours */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Vinnustundir á mánuði
              </h4>

              <div className="space-y-3">
                {/* Barebones */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-700">Lágmarks</span>
                  </div>
                  <span className="font-bold text-amber-900">
                    {formatNumber(results.lifeEnergy.monthly.barebones, 1)} klst
                  </span>
                </div>

                {/* Comfortable */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">Þægilegt</span>
                  </div>
                  <span className="font-bold text-green-900">
                    {formatNumber(results.lifeEnergy.monthly.comfortable, 1)} klst
                  </span>
                </div>

                {/* Deluxe */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-700">Lúxus</span>
                  </div>
                  <span className="font-bold text-purple-900">
                    {formatNumber(results.lifeEnergy.monthly.deluxe, 1)} klst
                  </span>
                </div>
              </div>
            </div>

            {/* Annual hours */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Vinnustundir á ári
              </h4>

              <div className="space-y-3">
                {/* Barebones */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-700">Lágmarks</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-900">
                      {formatNumber(results.lifeEnergy.annual.barebones, 0)} klst
                    </div>
                    {workDaysPerYear && (
                      <div className="text-xs text-gray-600">
                        ≈ {formatNumber(workDaysPerYear.barebones, 0)} vinnudagar
                      </div>
                    )}
                  </div>
                </div>

                {/* Comfortable */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">Þægilegt</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-900">
                      {formatNumber(results.lifeEnergy.annual.comfortable, 0)} klst
                    </div>
                    {workDaysPerYear && (
                      <div className="text-xs text-gray-600">
                        ≈ {formatNumber(workDaysPerYear.comfortable, 0)} vinnudagar
                      </div>
                    )}
                  </div>
                </div>

                {/* Deluxe */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-700">Lúxus</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-900">
                      {formatNumber(results.lifeEnergy.annual.deluxe, 0)} klst
                    </div>
                    {workDaysPerYear && (
                      <div className="text-xs text-gray-600">
                        ≈ {formatNumber(workDaysPerYear.deluxe, 0)} vinnudagar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Insight */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Byggir á raunverulegu tímakaupи:{' '}
                <span className="font-semibold text-gray-900">
                  {formatNumber(actualHourlyWage, 0)} kr/klst
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
