/**
 * FatFIREResults - Main results display component
 *
 * Features:
 * - Total FI number with premium styling
 * - Expense breakdown (base + wish list + splurge)
 * - Must-have vs Nice-to-have FI numbers
 * - Progress meter (if savings data available)
 * - Timeline summary
 * - Life energy conversion
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';

export function FatFIREResults() {
  const { fatFireResults, fatFireState } = useCalculator();

  if (!fatFireResults || !fatFireState) return null;

  const {
    fiNumber,
    totalMonthlyExpenses,
    totalAnnualExpenses,
    baseMonthlyExpenses,
    wishListMonthlyTotal,
    splurgeBudgetMonthly,
    mustHaveFINumber,
    fullFINumber,
    mustHaveTotal,
    niceToHaveTotal,
    multiplier,
    withdrawalRate,
    currentProgress,
    timeline,
    lifeEnergy,
  } = fatFireResults;

  const hasProgress = currentProgress !== undefined;
  const hasTimeline = timeline !== undefined;
  const hasLifeEnergy = lifeEnergy !== undefined;

  return (
    <div className="space-y-6">
      {/* Main FI Number */}
      <Card variant="elevated" className="border-amber-300 shadow-lg">
        <CardContent className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 p-8">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
              <span className="text-xl">👑</span>
              <span>FatFIRE Númer þitt</span>
            </div>

            <div className="mb-4">
              <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
                {formatCurrency(fiNumber)}
              </div>
              <p className="mt-2 text-sm font-medium text-amber-700">
                {multiplier}x margfaldari · {withdrawalRate.toFixed(2)}%
                úttektarhlutfall
              </p>
            </div>

            {/* Progress Bar */}
            {hasProgress && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-amber-900">Framvinda</span>
                  <span className="font-semibold text-amber-900">
                    {currentProgress.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-amber-200">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(currentProgress.percentage, 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-amber-700">
                  <span>
                    Núverandi: {formatCurrency(currentProgress.currentSavings)}
                  </span>
                  <span>
                    Eftir: {formatCurrency(currentProgress.remaining)}
                  </span>
                </div>
              </div>
            )}

            {/* Timeline Summary */}
            {hasTimeline && (
              <div className="mt-6 rounded-lg border-2 border-amber-300 bg-white p-4">
                <p className="text-sm font-medium text-amber-900">
                  Áætluð tímalína
                </p>
                <p className="mt-1 text-3xl font-bold text-amber-600">
                  {timeline.yearsToFI.toFixed(1)} ár
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  FI dagsetning:{' '}
                  {timeline.fiDate.toLocaleDateString('is-IS', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card variant="elevated" className="border-amber-200">
        <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
          <h3 className="text-lg font-semibold text-amber-900">
            Útgjaldaskipting
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Expenses */}
          <div className="flex items-center justify-between rounded-lg bg-amber-50 p-4">
            <div>
              <p className="font-medium text-gray-900">Grunnútgjöld (Lúxus)</p>
              <p className="text-sm text-gray-600">Mánaðarleg grunnkostnaður</p>
            </div>
            <p className="text-xl font-bold text-amber-600">
              {formatCurrency(baseMonthlyExpenses)}
            </p>
          </div>

          {/* Wish List */}
          {wishListMonthlyTotal > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
              <div>
                <p className="font-medium text-gray-900">Óskarlisti</p>
                <p className="text-sm text-gray-600">
                  {mustHaveTotal > 0 && (
                    <span>
                      Nauðsynlegt: {formatCurrency(mustHaveTotal)}
                    </span>
                  )}
                  {mustHaveTotal > 0 && niceToHaveTotal > 0 && (
                    <span> · </span>
                  )}
                  {niceToHaveTotal > 0 && (
                    <span>
                      Gott-að-hafa: {formatCurrency(niceToHaveTotal)}
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xl font-bold text-yellow-600">
                {formatCurrency(wishListMonthlyTotal)}
              </p>
            </div>
          )}

          {/* Splurge Budget */}
          {splurgeBudgetMonthly > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4">
              <div>
                <p className="font-medium text-gray-900">Aukaútgjaldaáætlun</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(fatFireState.splurgeBudgetAnnual)}/ár
                </p>
              </div>
              <p className="text-xl font-bold text-orange-600">
                {formatCurrency(splurgeBudgetMonthly)}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="border-t-2 border-amber-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Heildarútgjöld
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(totalAnnualExpenses)}/ár
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(totalMonthlyExpenses)}/mán
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Must-Have vs Nice-to-Have Comparison */}
      {niceToHaveTotal > 0 && (
        <Card variant="elevated" className="border-amber-200">
          <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
            <h3 className="text-lg font-semibold text-amber-900">
              Samanburður
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Must-Have FI */}
              <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="success">Nauðsynlegt</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Með aðeins nauðsynlegum óskum
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {formatCurrency(mustHaveFINumber)}
                </p>
              </div>

              {/* Full FI */}
              <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="warning">Allt</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Með öllum óskum (nauðsynlegt + gott-að-hafa)
                </p>
                <p className="mt-2 text-2xl font-bold text-yellow-600">
                  {formatCurrency(fullFINumber)}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p>
                <strong>Mismunur:</strong>{' '}
                {formatCurrency(fullFINumber - mustHaveFINumber)}
                <br />
                <em>
                  Þú getur náð FatFIRE fyrr með því að einbeita þér að
                  nauðsynlegum óskum, síðan bætt við gott-að-hafa hlutum
                  seinna.
                </em>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Life Energy */}
      {hasLifeEnergy && (
        <Card variant="elevated" className="border-amber-200">
          <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
            <h3 className="text-lg font-semibold text-amber-900">
              Lífsorkumæling
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-gray-600">
                FatFIRE númer þitt jafngildir:
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {lifeEnergy.yearsOfWork.toFixed(1)} ár vinnu
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Byggt á {formatCurrency(lifeEnergy.actualHourlyWage)}/klst
                raunverulegu tímakaup
              </p>
            </div>

            {lifeEnergy.leanFireComparison && (
              <div className="rounded-lg border border-amber-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-900">
                  Samanburður við LeanFIRE:
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  LeanFIRE:{' '}
                  {lifeEnergy.leanFireComparison.yearsOfWork.toFixed(1)} ár
                  <br />
                  FatFIRE: {lifeEnergy.yearsOfWork.toFixed(1)} ár
                  <br />
                  <strong className="text-amber-600">
                    Mismunur:{' '}
                    {lifeEnergy.leanFireComparison.difference.toFixed(1)} ár
                    aukalega
                  </strong>
                </p>
                <p className="mt-2 text-xs text-gray-700">
                  💡 FatFIRE krefst meiri sparnaðar en veitir fullkomna
                  lífsstílsfrelsi
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
