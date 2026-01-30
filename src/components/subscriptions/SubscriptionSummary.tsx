'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';

/**
 * Props for SubscriptionSummary component
 */
export interface SubscriptionSummaryProps {
  className?: string;
}

/**
 * SubscriptionSummary Component
 *
 * Displays summary of all subscription costs with life energy and future value calculations.
 * Shows total monthly/yearly costs, life energy hours, and potential investment value.
 *
 * Requires actual hourly wage from calculator context to calculate life energy impact.
 */
export function SubscriptionSummary({ className }: SubscriptionSummaryProps) {
  const { subscriptionSummary, results } = useCalculator();

  // Check if actual hourly wage is available
  const hasActualWage = results?.actualHourlyWage && results.actualHourlyWage > 0;

  // If no subscriptions, don't render anything
  if (!subscriptionSummary || subscriptionSummary.totalMonthly === 0) {
    return null;
  }

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="bg-gradient-to-r from-warning-50 to-primary-50">
        <h2 className="text-xl font-bold text-neutral-800">Heildaráskriftir</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning if no actual wage */}
        {!hasActualWage && (
          <Alert variant="warning">
            <p className="text-sm">
              Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað
            </p>
          </Alert>
        )}

        {/* Monthly and Yearly costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly */}
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <p className="text-sm font-medium text-neutral-600 mb-1">Mánaðarlega</p>
            <p className="text-3xl font-bold text-primary-700">
              {formatCurrency(subscriptionSummary.totalMonthly)}
            </p>
          </div>

          {/* Yearly */}
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <p className="text-sm font-medium text-neutral-600 mb-1">Árlega</p>
            <p className="text-3xl font-bold text-primary-700">
              {formatCurrency(subscriptionSummary.totalYearly)}
            </p>
          </div>
        </div>

        {/* Life Energy - only show if we have actual wage */}
        {hasActualWage && (
          <div className="space-y-4">
            <div className="border-t border-neutral-200 pt-4">
              <h3 className="text-lg font-semibold text-neutral-700 mb-3">
                Lífsorka kostnaður
              </h3>

              {/* Life energy per month */}
              <div className="bg-warning-50 rounded-lg p-4 border border-warning-200 mb-3">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Lífsorka á mánuði
                </p>
                <p className="text-2xl font-bold text-warning-700">
                  {formatLifeEnergy(subscriptionSummary.lifeEnergyHoursPerMonth)}
                </p>
              </div>

              {/* Life energy per year */}
              <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Lífsorka á ári
                </p>
                <p className="text-2xl font-bold text-warning-700">
                  {subscriptionSummary.lifeEnergyHoursPerYear >= 24
                    ? `${formatNumber(
                        Math.round(subscriptionSummary.lifeEnergyHoursPerYear / 8)
                      )} ${
                        Math.round(subscriptionSummary.lifeEnergyHoursPerYear / 8) === 1
                          ? 'dagur'
                          : 'dagar'
                      }`
                    : formatLifeEnergy(subscriptionSummary.lifeEnergyHoursPerYear)}
                </p>
              </div>
            </div>

            {/* Future Value */}
            <div className="border-t border-neutral-200 pt-4">
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                Ef fjárfest í staðinn
              </h3>
              <p className="text-xs text-neutral-500 mb-3">
                Miðað við 7% ársávöxtun
              </p>

              <div className="space-y-3">
                {/* 10 years */}
                <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    Ef fjárfest í 10 ár
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(subscriptionSummary.futureValueIn10Years)}
                  </p>
                </div>

                {/* 20 years */}
                <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    Ef fjárfest í 20 ár
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(subscriptionSummary.futureValueIn20Years)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
