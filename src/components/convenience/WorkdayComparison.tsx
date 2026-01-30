'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import type { WorkdayComparisonData } from '@/lib/calculations/convenienceExpenses';

interface WorkdayComparisonProps {
  comparison: WorkdayComparisonData;
}

/**
 * Workday vs weekend spending comparison
 */
export function WorkdayComparison({ comparison }: WorkdayComparisonProps) {
  const {
    workdayAverage,
    weekendAverage,
    difference,
    differencePercent,
    annualImpact,
    workdayCount,
    weekendCount,
  } = comparison;

  // Calculate percentage for bar chart
  const maxAverage = Math.max(workdayAverage, weekendAverage) || 1;
  const workdayPercent = (workdayAverage / maxAverage) * 100;
  const weekendPercent = (weekendAverage / maxAverage) * 100;

  if (workdayCount === 0 && weekendCount === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Vinnudagar vs Frídagar
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center py-8">
            Engin gögn til að bera saman. Skráðu kostnað til að sjá mun á
            vinnudögum og frídögum.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vinnudagar vs Frídagar
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Meðaltal kostnaðar síðustu 30 daga
            </p>
          </div>
          <Tooltip content="Þetta sýnir hvað þú eyðir að meðaltali á vinnudögum samanborið við frídaga. Mikill munur getur bent til þreytu-skatta.">
            <button
              className="text-gray-400 hover:text-gray-600"
              aria-label="Hjálp"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bar chart comparison */}
          <div className="space-y-4">
            {/* Workday bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Vinnudagur ({workdayCount} dagar)
                </span>
                <span className="text-sm font-semibold text-red-600">
                  {workdayAverage.toLocaleString('is-IS', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kr
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${workdayPercent}%` }}
                  role="progressbar"
                  aria-valuenow={workdayPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {workdayPercent > 20 && (
                    <span className="text-xs font-medium text-white">
                      {workdayPercent.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Weekend bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Frídagur ({weekendCount} dagar)
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {weekendAverage.toLocaleString('is-IS', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kr
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${weekendPercent}%` }}
                  role="progressbar"
                  aria-valuenow={weekendPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {weekendPercent > 20 && (
                    <span className="text-xs font-medium text-white">
                      {weekendPercent.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Difference summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Munur á dag
              </span>
              <span
                className={`text-lg font-bold ${
                  difference > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {difference > 0 ? '+' : ''}
                {difference.toLocaleString('is-IS', {
                  maximumFractionDigits: 0,
                })}{' '}
                kr
              </span>
            </div>

            {differencePercent !== 0 && (
              <p className="text-xs text-gray-600 mb-3">
                {difference > 0
                  ? `${differencePercent.toFixed(0)}% hærri kostnaður á vinnudögum`
                  : `${Math.abs(differencePercent).toFixed(0)}% lægri kostnaður á vinnudögum`}
              </p>
            )}

            {/* Annual impact */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Áhrifin á ári (260 vinnudagar)
                </span>
                <span
                  className={`text-xl font-bold ${
                    annualImpact > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {annualImpact > 0 ? '+' : ''}
                  {annualImpact.toLocaleString('is-IS', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  kr
                </span>
              </div>
              {annualImpact > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Þetta er þreytu-skatturinn þinn - kostnaður vegna vinnuþreyta
                </p>
              )}
            </div>
          </div>

          {/* Insight */}
          {difference > 1000 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Þreytu-skattur greindur
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Þú eyðir mun meira á vinnudögum. Íhugaðu hvort vinnan sé
                    þess virði fyrir þennan aukakostnað.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
