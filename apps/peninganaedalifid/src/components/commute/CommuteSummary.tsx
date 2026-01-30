'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatLifeEnergy } from '@/lib/calculations/lifeEnergy';
import type { CommuteScenario } from '@/types/calculator';

/**
 * Props for CommuteSummary component
 */
export interface CommuteSummaryProps {
  scenario: CommuteScenario;
  actualHourlyWage: number;
  className?: string;
}

/**
 * CommuteSummary Component
 *
 * Displays comprehensive results for a single commute scenario including:
 * - Cost breakdown (direct, indirect for cars, total monthly/yearly)
 * - Time spent commuting
 * - Life energy impact
 * - Future value (FI impact) projections
 *
 * All text in Icelandic per app requirements.
 */
export function CommuteSummary({
  scenario,
  actualHourlyWage,
  className,
}: CommuteSummaryProps) {
  const { results, inputs } = scenario;
  const hasActualWage = actualHourlyWage > 0;
  const isCar = inputs.commuteMethod === 'car';

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="bg-gradient-to-r from-primary-50 to-neutral-50">
        <h2 className="text-xl font-bold text-neutral-800">{scenario.name}</h2>
        <p className="text-sm text-neutral-600">
          {inputs.distanceKm} km • {inputs.daysPerWeek} dagar/viku • {inputs.timeMinutesOneWay}{' '}
          mín
        </p>
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

        {/* Cost Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-700">Kostnaður</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct costs */}
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
              <p className="text-sm font-medium text-neutral-600 mb-1">Beinn kostnaður</p>
              <p className="text-2xl font-bold text-primary-700">
                {formatCurrency(results.directMonthlyCost)}
              </p>
              <p className="text-xs text-neutral-500">á mánuði</p>
            </div>

            {/* Indirect costs (only for cars) */}
            {isCar && results.indirectMonthlyCost > 0 && (
              <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
                <p className="text-sm font-medium text-neutral-600 mb-1">Óbeinn kostnaður</p>
                <p className="text-2xl font-bold text-warning-700">
                  {formatCurrency(results.indirectMonthlyCost)}
                </p>
                <p className="text-xs text-neutral-500">á mánuði</p>
              </div>
            )}

            {/* Total monthly */}
            <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-300">
              <p className="text-sm font-medium text-neutral-600 mb-1">Heildarkostnaður</p>
              <p className="text-3xl font-bold text-neutral-800">
                {formatCurrency(results.totalMonthlyCost)}
              </p>
              <p className="text-xs text-neutral-500">á mánuði</p>
            </div>

            {/* Total yearly */}
            <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-300">
              <p className="text-sm font-medium text-neutral-600 mb-1">Árlega</p>
              <p className="text-3xl font-bold text-neutral-800">
                {formatCurrency(results.totalYearlyCost)}
              </p>
              <p className="text-xs text-neutral-500">á ári</p>
            </div>
          </div>

          {/* Cost breakdown for cars */}
          {isCar && results.costBreakdown.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-600 mb-2">Sundurliðun kostnaðar:</p>
              <div className="space-y-2">
                {results.costBreakdown.map((item) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span className="text-sm text-neutral-700">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-800">
                        {formatCurrency(item.monthlyCost)}
                      </span>
                      <span className="text-xs text-neutral-500 w-12 text-right">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Alert variant="info" className="mt-4">
                <p className="text-xs">
                  <strong>Athugið:</strong> Raunverulegur bílakostnaður inniheldur óbeinan
                  kostnað eins og afskriftir, tryggingar og viðhald sem margir gleyma að telja
                  með.
                </p>
              </Alert>
            </div>
          )}
        </div>

        {/* Time Section */}
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-semibold text-neutral-700">Tími í vinnuferð</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hours per month */}
            <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
              <p className="text-sm font-medium text-neutral-600 mb-1">Á mánuði</p>
              <p className="text-2xl font-bold text-warning-700">
                {results.timePerMonthHours.toFixed(1)} klst
              </p>
              <p className="text-xs text-neutral-500">
                {formatNumber(Math.round(results.timePerMonthMinutes))} mínútur
              </p>
            </div>

            {/* Hours per year */}
            <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
              <p className="text-sm font-medium text-neutral-600 mb-1">Á ári</p>
              <p className="text-2xl font-bold text-warning-700">
                {formatNumber(Math.round(results.timePerYearHours))} klst
              </p>
              <p className="text-xs text-neutral-500">
                {results.timePerYearDays.toFixed(1)} dagar
              </p>
            </div>
          </div>
        </div>

        {/* Life Energy Section - only show if we have actual wage */}
        {hasActualWage && (
          <div className="space-y-4 border-t border-neutral-200 pt-6">
            <h3 className="text-lg font-semibold text-neutral-700">Lífsorka kostnaður</h3>

            <div className="space-y-3">
              {/* Time as life energy */}
              <div className="bg-error-50 rounded-lg p-4 border border-error-200">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Tími (lífsorka frá ferðalögum)
                </p>
                <p className="text-xl font-bold text-error-700">
                  {formatLifeEnergy(results.lifeEnergyFromTime)}
                </p>
                <p className="text-xs text-neutral-500">á mánuði</p>
              </div>

              {/* Money as life energy */}
              <div className="bg-error-50 rounded-lg p-4 border border-error-200">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Peningar (lífsorka til að greiða kostnað)
                </p>
                <p className="text-xl font-bold text-error-700">
                  {formatLifeEnergy(results.lifeEnergyFromMoney)}
                </p>
                <p className="text-xs text-neutral-500">á mánuði</p>
              </div>

              {/* Total life energy */}
              <div className="bg-error-100 rounded-lg p-4 border-2 border-error-300">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Heildar lífsorka kostnaður
                </p>
                <p className="text-3xl font-bold text-error-800">
                  {formatLifeEnergy(results.totalLifeEnergyHoursPerMonth)}
                </p>
                <p className="text-xs text-neutral-600 mb-2">á mánuði</p>
                <p className="text-sm font-medium text-error-700">
                  {formatLifeEnergy(results.totalLifeEnergyHoursPerYear)} á ári
                </p>
              </div>

              {/* Impactful message */}
              {results.totalLifeEnergyHoursPerMonth > 40 && (
                <Alert variant="warning">
                  <p className="text-sm font-medium">
                    Vinnuferðir þínar kosta þig meira en vinnuviku af lífsorku á mánuði!
                  </p>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* FI Impact Section */}
        <div className="space-y-4 border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-semibold text-neutral-700">
            Áhrif á fjárhagslegt frelsi (FI)
          </h3>
          <p className="text-sm text-neutral-600">
            Ef þú myndir fjárfesta þennan kostnað í staðinn við 7% ávöxtun:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 5 years */}
            <div className="bg-success-50 rounded-lg p-4 border border-success-200">
              <p className="text-sm font-medium text-neutral-600 mb-1">Eftir 5 ár</p>
              <p className="text-2xl font-bold text-success-700">
                {formatCurrency(results.futureValue5Years)}
              </p>
            </div>

            {/* 10 years */}
            <div className="bg-success-100 rounded-lg p-4 border border-success-300">
              <p className="text-sm font-medium text-neutral-600 mb-1">Eftir 10 ár</p>
              <p className="text-2xl font-bold text-success-800">
                {formatCurrency(results.futureValue10Years)}
              </p>
            </div>

            {/* 20 years */}
            <div className="bg-success-200 rounded-lg p-4 border border-success-400">
              <p className="text-sm font-medium text-neutral-600 mb-1">Eftir 20 ár</p>
              <p className="text-2xl font-bold text-success-900">
                {formatCurrency(results.futureValue20Years)}
              </p>
            </div>
          </div>

          <Alert variant="info">
            <p className="text-sm">
              Með því að lækka eða eyða vinnuferðakostnaði gætirðu hraðað fjárhagslegu frelsi þínu
              verulega.
            </p>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
