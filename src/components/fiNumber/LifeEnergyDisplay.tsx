'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils/formatters';
import type { FINumberLifeEnergy } from '@/types/fiNumber';

/**
 * Props for LifeEnergyDisplay component
 */
export interface LifeEnergyDisplayProps {
  lifeEnergy: FINumberLifeEnergy;
  fiNumber: number;
  currentSavings?: number;
}

/**
 * LifeEnergyDisplay Component
 *
 * Displays the FI number in terms of "life energy" (years of work) based on
 * the user's Actual Hourly Wage (AWH). This helps users understand their FI
 * number in time terms rather than just money.
 *
 * Features:
 * - Shows FI number as "years of work" (FI ÷ annual net income)
 * - Shows "years to FI" if savings data is available
 * - Visual progress indicators with progress bars
 * - Explanation text about life energy concept
 * - Only renders if AWH is available
 * - All text in Icelandic
 *
 * Based on "Your Money or Your Life" life energy philosophy.
 *
 * @example
 * ```tsx
 * <LifeEnergyDisplay
 *   lifeEnergy={{
 *     actualHourlyWage: 5000,
 *     annualNetIncome: 9_600_000,
 *     yearsOfWork: 18.75,
 *     yearsToFI: 12.5
 *   }}
 *   fiNumber={180_000_000}
 *   currentSavings={60_000_000}
 * />
 * ```
 */
export function LifeEnergyDisplay({
  lifeEnergy,
  fiNumber,
  currentSavings = 0,
}: LifeEnergyDisplayProps) {
  const { yearsOfWork, yearsToFI, annualNetIncome } = lifeEnergy;

  // Calculate progress if we have yearsToFI (meaning we have savings data)
  const hasYearsToFI = yearsToFI !== undefined && yearsToFI !== null;
  const progressPercentage = hasYearsToFI
    ? Math.min(100, ((yearsOfWork - yearsToFI) / yearsOfWork) * 100)
    : (currentSavings / fiNumber) * 100;

  // Determine progress bar color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-success-500';
    if (progress >= 50) return 'bg-primary-500';
    if (progress >= 25) return 'bg-warning-500';
    return 'bg-orange-500';
  };

  const progressColor = getProgressColor(progressPercentage);

  return (
    <Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-primary-100 to-indigo-100 border-b-2 border-primary-200">
        <div className="flex items-center gap-3">
          <div className="text-3xl">⏳</div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-primary-900">
              FI-talan í lífsorku
            </h3>
            <p className="text-sm text-primary-700 mt-1">
              Skilningur á fjármálafrelsi í tíma í stað peninga
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Years of Work Display */}
        <div className="text-center py-6 bg-white rounded-xl border-2 border-primary-200 shadow-sm">
          <p className="text-sm md:text-base text-neutral-600 mb-2">
            FI-talan þín jafngildir
          </p>
          <p className="text-4xl md:text-5xl font-bold text-primary-900 mb-2">
            {formatNumber(yearsOfWork, 1)} árum
          </p>
          <p className="text-sm md:text-base text-neutral-600">
            af vinnu með núverandi tekjum
          </p>
          <p className="text-xs text-neutral-700 mt-3">
            ({formatNumber(annualNetIncome, 0)} kr á ári)
          </p>
        </div>

        {/* Years to FI (if available) */}
        {hasYearsToFI && yearsToFI > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-neutral-800">Framvinda til FI</h4>
              <span className="text-sm font-bold text-primary-700">
                {formatNumber(progressPercentage, 0)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out relative`}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Framvinda í átt að fjármálafrelsi"
              >
                {progressPercentage >= 10 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {formatNumber(progressPercentage, 0)}%
                  </span>
                )}
              </div>
            </div>

            {/* Years Remaining */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <p className="text-xs text-neutral-600 mb-1">Unnið</p>
                <p className="text-2xl font-bold text-success-700">
                  {formatNumber(yearsOfWork - yearsToFI, 1)}
                </p>
                <p className="text-xs text-neutral-700">ár</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-neutral-200">
                <p className="text-xs text-neutral-600 mb-1">Eftir</p>
                <p className="text-2xl font-bold text-primary-700">
                  {formatNumber(yearsToFI, 1)}
                </p>
                <p className="text-xs text-neutral-700">ár</p>
              </div>
            </div>

            {/* Timeline visualization */}
            <div className="relative pt-6 pb-2">
              <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-200 rounded-full"></div>
              <div
                className={`absolute top-0 left-0 h-2 ${progressColor} rounded-full`}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              ></div>

              {/* Start marker */}
              <div className="absolute top-0 left-0 transform -translate-y-1">
                <div className="w-4 h-4 bg-neutral-400 rounded-full border-2 border-white"></div>
                <p className="text-xs text-neutral-600 mt-1 whitespace-nowrap">Byrjun</p>
              </div>

              {/* Current position marker */}
              <div
                className="absolute top-0 transform -translate-y-1 transition-all duration-500"
                style={{ left: `${Math.min(100, progressPercentage)}%` }}
              >
                <div className={`w-4 h-4 ${progressColor} rounded-full border-2 border-white`}></div>
                <p className="text-xs font-semibold text-primary-700 mt-1 whitespace-nowrap transform -translate-x-1/3">
                  Þú
                </p>
              </div>

              {/* End marker */}
              <div className="absolute top-0 right-0 transform -translate-y-1">
                <div className="w-4 h-4 bg-success-500 rounded-full border-2 border-white"></div>
                <p className="text-xs text-neutral-600 mt-1 whitespace-nowrap transform -translate-x-full">FI Markmið</p>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-primary-100 rounded-lg p-4 border border-primary-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">💡</div>
            <div className="text-sm text-primary-900">
              <p className="font-semibold mb-2">Hvað er lífsorka?</p>
              <p className="leading-relaxed">
                Lífsorka er hugmynd úr bókinni "Your Money or Your Life" sem hjálpar þér að
                skilja peninga sem <strong>tíma úr lífi þínu</strong>. FI-talan þín ({formatNumber(yearsOfWork, 1)} ár)
                sýnir hversu mörg ár þú þarft að vinna til að spara nóg til að lifa af
                sparnaðinum að eilífu.
              </p>
              {hasYearsToFI && yearsToFI > 0 && (
                <p className="mt-3 leading-relaxed">
                  Þú hefur þegar "unnið" {formatNumber(yearsOfWork - yearsToFI, 1)} ár í átt
                  að FI markmiðinu. Eftir eru {formatNumber(yearsToFI, 1)} ár til að ná
                  fjármálafrelsi á núverandi sparnaðarhraða.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Motivational message based on progress */}
        {hasYearsToFI && yearsToFI > 0 && (
          <div className="text-center">
            {progressPercentage >= 75 ? (
              <p className="text-sm font-medium text-success-700">
                🎉 Frábært! Þú ert kominn langt á leiðinni til fjármálafrelsis!
              </p>
            ) : progressPercentage >= 50 ? (
              <p className="text-sm font-medium text-primary-700">
                💪 Vel gert! Þú ert komin/n yfir helminginn!
              </p>
            ) : progressPercentage >= 25 ? (
              <p className="text-sm font-medium text-neutral-700">
                🚀 Góð byrjun! Haltu áfram að spara!
              </p>
            ) : (
              <p className="text-sm font-medium text-neutral-700">
                🌱 Sérhver ferð byrjar með einu skrefi. Þú ert byrjuð/aður!
              </p>
            )}
          </div>
        )}

        {/* No years to FI - show savings needed */}
        {!hasYearsToFI && currentSavings > 0 && (
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <p className="text-sm text-neutral-700">
              Til að sjá hversu mörg ár eru eftir til FI, sláðu inn núverandi sparnað
              og árlegan sparnað í sparnaðarskýrslunni.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
