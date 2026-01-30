/**
 * SavingsRateInsights - Contextual savings rate information and FI estimate
 *
 * Features:
 * - Large savings rate display with visual indicator
 * - Context message from savingsRateContext.messageIs
 * - FI timeline estimate when available
 * - Color coding based on rate level (critical=red, low=orange, moderate=yellow, good=green, excellent=blue, exceptional=purple)
 * - Handle missing income: "Fylltu út tekjur til að sjá sparnaðarhlutfall"
 */

import React from 'react';
import { Card, CardHeader, CardContent, Alert } from '@/components/ui';
import { formatNumber } from '@/lib/utils/formatters';
import type { SavingsReportResults } from '@/types/savingsReport';

export interface SavingsRateInsightsProps {
  results: SavingsReportResults;
}

// Color mappings for different rate levels
const levelColors = {
  critical: {
    bg: 'bg-danger-50',
    text: 'text-danger-700',
    border: 'border-danger-200',
  },
  low: {
    bg: 'bg-warning-50',
    text: 'text-warning-700',
    border: 'border-warning-200',
  },
  moderate: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  good: {
    bg: 'bg-success-50',
    text: 'text-success-700',
    border: 'border-success-200',
  },
  excellent: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  exceptional: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
};

/**
 * SavingsRateInsights - Display savings rate context and FI estimate
 */
export function SavingsRateInsights({ results }: SavingsRateInsightsProps) {
  const { savingsRate, savingsRateContext } = results;

  // Handle missing income case
  if (savingsRate === null || !savingsRateContext) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Sparnaðarhlutfall
          </h3>
        </CardHeader>
        <CardContent>
          <Alert variant="info">
            <p className="text-sm">
              Fylltu út tekjur í{' '}
              <a
                href="/"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                reiknivélinni
              </a>
              {' '}til að sjá sparnaðarhlutfall og fjárhagsfrelsis áætlun.
            </p>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const colors = levelColors[savingsRateContext.level];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Sparnaðarhlutfall
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Large rate display */}
        <div
          className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 text-center`}
        >
          <div className="text-sm font-medium text-neutral-600 mb-2">
            Þú sparar
          </div>
          <div className={`text-5xl font-bold ${colors.text}`}>
            {formatNumber(savingsRate, 1)}%
          </div>
          <div className="text-sm text-neutral-600 mt-2">
            af tekjum þínum
          </div>
        </div>

        {/* Context message */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-sm text-neutral-700 leading-relaxed">
            {savingsRateContext.messageIs}
          </p>
        </div>

        {/* FI estimate if available */}
        {savingsRateContext.fiEstimateYears !== null && (
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                  Áætluð leið til fjárhagsfrelsis
                </h4>
                <p className="text-sm text-neutral-600">
                  Með þessum sparnaðarhraða gætirðu náð fjárhagsfrelsi á um{' '}
                  <span className="font-semibold text-primary-700">
                    {savingsRateContext.fiEstimateYears} árum
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
