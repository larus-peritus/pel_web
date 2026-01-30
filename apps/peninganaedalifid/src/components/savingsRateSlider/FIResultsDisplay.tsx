'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { FI_STRINGS } from '@/lib/constants/icelandic';
import { ICELANDIC_MONTHS } from '@/lib/constants/fi';
import type { FIResults } from '@/types/fi';

interface FIResultsDisplayProps {
  results: FIResults;
  actualHourlyWage?: number;
}

/**
 * FI Results Display Component
 *
 * Displays:
 * - FI date (absolute and relative)
 * - Years and months to FI
 * - Life energy (work hours, days, years)
 * - Marginal impacts (+1%, +5%, +10%)
 * - Progress indicator
 */
export function FIResultsDisplay({ results, actualHourlyWage }: FIResultsDisplayProps) {
  const formatIcelandicDate = (date: Date): string => {
    const month = ICELANDIC_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const formatRelativeTime = (years: number): string => {
    if (!isFinite(years)) {
      return 'Aldrei (neikvæður sparnaður)';
    }

    if (years === 0) {
      return 'Núna! Þú hefur náð FI markmiðinu';
    }

    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);

    if (wholeYears === 0) {
      return `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`;
    }

    if (months === 0) {
      return `${wholeYears} ${wholeYears === 1 ? 'ár' : 'ár'}`;
    }

    return `${wholeYears} ${wholeYears === 1 ? 'ár' : 'ár'} og ${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`;
  };

  const formatLifeEnergy = (hours: number): string => {
    if (!isFinite(hours) || hours <= 0) return '0 klst';

    if (hours < 8) {
      return `${hours.toFixed(0)} klst`;
    }

    if (hours < 160) {
      return `${(hours / 8).toFixed(1)} vinnudagar`;
    }

    return `${(hours / 2000).toFixed(1)} vinnuár`;
  };

  const formatMarginalImpact = (months: number): string => {
    if (!isFinite(months)) return 'N/A';

    const absMonths = Math.abs(months);
    const years = Math.floor(absMonths / 12);
    const remainingMonths = Math.round(absMonths % 12);

    const prefix = months > 0 ? '' : '-';

    if (years === 0) {
      return `${prefix}${remainingMonths} ${remainingMonths === 1 ? 'mánuður' : 'mánuðir'}`;
    }

    if (remainingMonths === 0) {
      return `${prefix}${years} ${years === 1 ? 'ár' : 'ár'}`;
    }

    return `${prefix}${years} ár, ${remainingMonths} mán`;
  };

  const isAchieved = results.yearsToFI === 0;
  const isFarAway = !isFinite(results.yearsToFI) || results.yearsToFI > 100;

  return (
    <div className="space-y-6">
      {/* Main FI Date Card */}
      <Card className={`${isAchieved ? 'bg-success-50 border-success-300' : isFarAway ? 'bg-warning-50 border-warning-300' : 'bg-primary-50 border-primary-300'}`}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            {FI_STRINGS.results.fiDate}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            {/* FI Date */}
            <div>
              <p className="text-4xl font-bold text-neutral-900">
                {formatIcelandicDate(results.fiDate)}
              </p>
              <p className="text-lg text-neutral-600 mt-1">
                {formatRelativeTime(results.yearsToFI)}
              </p>
            </div>

            {/* Special Messages */}
            {isAchieved && (
              <div className="p-3 bg-success-100 rounded-lg">
                <p className="text-sm font-medium text-success-800">
                  {FI_STRINGS.messages.achieved}
                </p>
                <p className="text-xs text-success-700 mt-1">
                  {FI_STRINGS.messages.achievedDetail}
                </p>
              </div>
            )}

            {isFarAway && !isAchieved && (
              <div className="p-3 bg-warning-100 rounded-lg">
                <p className="text-sm font-medium text-warning-800">
                  {FI_STRINGS.messages.farAway}
                </p>
                <p className="text-xs text-warning-700 mt-1">
                  {FI_STRINGS.messages.farAwayDetail}
                </p>
              </div>
            )}

            {/* Progress Bar */}
            {!isAchieved && !isFarAway && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                  <span>{FI_STRINGS.results.currentProgress}</span>
                  <span>{results.currentProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, results.currentProgress)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Life Energy Card */}
      {actualHourlyWage && actualHourlyWage > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-900">
              {FI_STRINGS.results.lifeEnergy}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Vinnuár þar til þú nærð fjármálafrelsi
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {FI_STRINGS.results.workHours}
                </p>
                <p className="text-xl font-bold text-neutral-900 mt-1">
                  {results.totalWorkHoursToFI.toLocaleString('is-IS', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {FI_STRINGS.results.workDays}
                </p>
                <p className="text-xl font-bold text-neutral-900 mt-1">
                  {results.totalWorkDaysToFI.toLocaleString('is-IS', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {FI_STRINGS.results.workYears}
                </p>
                <p className="text-xl font-bold text-primary-700 mt-1">
                  {results.totalWorkYearsToFI.toFixed(1)}
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-500 text-center mt-3">
              Miðað við tímakaup: {actualHourlyWage.toLocaleString('is-IS', { maximumFractionDigits: 0 })} kr/klst
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-neutral-50">
          <CardContent className="text-center py-6">
            <p className="text-sm font-medium text-neutral-700">
              {FI_STRINGS.messages.missingWage}
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              {FI_STRINGS.messages.missingWageDetail}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Marginal Impact Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            Áhrif meiri sparnaðar
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Sjáðu hversu mikið þú sparar með hækkuðu sparnaðarhlutfalli
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* +1% Impact */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {FI_STRINGS.results.impactPer1}
                </p>
                <p className="text-xs text-neutral-600">
                  Hver 1% sparar þér:
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-700">
                  {formatMarginalImpact(results.impactPer1Percent.months)}
                </p>
                {actualHourlyWage && results.impactPer1Percent.workHours > 0 && (
                  <p className="text-xs text-neutral-600">
                    {formatLifeEnergy(results.impactPer1Percent.workHours)}
                  </p>
                )}
              </div>
            </div>

            {/* +5% Impact */}
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {FI_STRINGS.results.impactPer5}
                </p>
                <p className="text-xs text-neutral-600">
                  5% meiri sparnaður:
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary-700">
                  {formatMarginalImpact(results.impactPer5Percent.months)} fyrr
                </p>
                {actualHourlyWage && results.impactPer5Percent.workHours > 0 && (
                  <p className="text-xs text-neutral-600">
                    {formatLifeEnergy(results.impactPer5Percent.workHours)} sparað
                  </p>
                )}
              </div>
            </div>

            {/* +10% Impact */}
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {FI_STRINGS.results.impactPer10}
                </p>
                <p className="text-xs text-neutral-600">
                  10% meiri sparnaður:
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-success-700">
                  {formatMarginalImpact(results.impactPer10Percent.months)} fyrr
                </p>
                {actualHourlyWage && results.impactPer10Percent.workHours > 0 && (
                  <p className="text-xs text-neutral-600">
                    {formatLifeEnergy(results.impactPer10Percent.workHours)} sparað
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Investment Info */}
      <Card>
        <CardContent className="text-center py-4">
          <p className="text-sm text-neutral-600">
            {FI_STRINGS.results.monthlyInvestment}
          </p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {results.monthlyInvestment.toLocaleString('is-IS', { maximumFractionDigits: 0 })} kr
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            ({results.annualInvestment.toLocaleString('is-IS', { maximumFractionDigits: 0 })} kr á ári)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
