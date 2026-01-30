'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import type { FIImpact } from '@/types/calculator';
import { formatCurrency } from '@/lib/utils/formatters';

interface FIImpactCardProps {
  impact: FIImpact;
}

/**
 * Display FI impact of lifestyle inflation
 * Shows years delayed and lost future value
 */
export function FIImpactCard({ impact }: FIImpactCardProps) {
  const hasNegativeImpact = impact.increasedAnnualExpenses > 0;

  return (
    <Card className={hasNegativeImpact ? 'border-2 border-red-200 bg-red-50' : 'border-2 border-green-200 bg-green-50'}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Áhrif á fjárhagslegt frelsi (FI)
        </h3>

        {hasNegativeImpact ? (
          <div className="space-y-4">
            {/* Years delayed */}
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-1">FI-seinkun</p>
              <p className="text-4xl font-bold text-red-600">
                {impact.fiDelayYears >= 1
                  ? `${impact.fiDelayYears.toFixed(1)} ár`
                  : `${impact.fiDelayMonths} mán`
                }
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Aukinn kostnaður seinkar FI-markmiði þínu
              </p>
            </div>

            {/* Increased FI target */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Aukin árleg útgjöld</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(impact.increasedAnnualExpenses)}
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Aukið FI-markmið</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(impact.increasedFITarget)}
                </p>
                <p className="text-xs text-gray-500 mt-1">(×25 reglan)</p>
              </div>
            </div>

            {/* Lost future value */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Tap á framtíðarverðmæti (ef fjárfest í staðinn við 7% ávöxtun)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Á 10 árum</p>
                  <p className="text-base font-bold text-red-600">
                    {formatCurrency(impact.lostFutureValue10Years)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Á 20 árum</p>
                  <p className="text-base font-bold text-red-600">
                    {formatCurrency(impact.lostFutureValue20Years)}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual timeline */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3 text-center">
                Tímalína til fjárhagslegs frelsis
              </p>
              <div className="relative">
                {/* Timeline bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 bg-green-200 rounded-l-lg flex items-center justify-center text-xs font-medium text-green-800">
                    Upprunaleg áætlun
                  </div>
                  <div className="w-px h-8 bg-gray-400"></div>
                  <div
                    className="h-8 bg-red-200 rounded-r-lg flex items-center justify-center text-xs font-medium text-red-800 px-3"
                    style={{
                      width: impact.fiDelayYears >= 1 ? `${Math.min(impact.fiDelayYears * 20, 100)}px` : '60px'
                    }}
                  >
                    +{impact.fiDelayYears >= 1
                      ? `${impact.fiDelayYears.toFixed(1)}ár`
                      : `${impact.fiDelayMonths}m`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">✓</div>
            <p className="text-lg font-semibold text-green-700 mb-2">
              Engin neikvæð áhrif á FI
            </p>
            <p className="text-sm text-gray-600">
              Útgjöldin þín hafa ekki aukist eða þú ert að spara meira en áður.
              {impact.increasedAnnualExpenses < 0 && (
                <span className="block mt-2 font-medium text-green-700">
                  Þú ert að flýta fyrir FI um {Math.abs(impact.fiDelayMonths)} mánuði!
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
