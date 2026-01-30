/**
 * FatFIRECard - Calculator hub card for FatFIRE
 *
 * Features:
 * - Premium styling (gold/amber theme)
 * - Quick status display
 * - FI number if calculated
 * - Link to full calculator
 * - Progress indicator if available
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';

export function FatFIRECard() {
  const { fatFireResults, fatFireState } = useCalculator();

  const hasResults = fatFireResults !== null;
  const hasProgress = fatFireResults?.currentProgress !== undefined;

  return (
    <Link href="/fatfire" className="block transition-transform hover:scale-[1.02]">
      <Card
        variant="elevated"
        className="h-full border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 hover:shadow-xl transition-all"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                <span className="text-lg">💎</span>
                <span>FatFIRE</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900">
                Lúxus FIRE Áætlun
              </h3>
            </div>
            <span className="text-3xl">👑</span>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm text-amber-800">
            Skipuleggðu eftirlaunaárin með lúxus lífsstíl - engir málamiðlanir,
            algjört frelsi
          </p>

          {/* Results Preview */}
          {hasResults && fatFireResults ? (
            <div className="space-y-3">
              {/* FI Number */}
              <div className="rounded-lg border-2 border-amber-400 bg-white p-4">
                <p className="text-xs font-medium text-amber-700">
                  FatFIRE Númer
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-900">
                  {formatCurrency(fatFireResults.fiNumber)}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {fatFireResults.multiplier}x margfaldari ·{' '}
                  {fatFireResults.withdrawalRate.toFixed(2)}% úttekt
                </p>
              </div>

              {/* Progress */}
              {hasProgress && fatFireResults.currentProgress && (
                <div className="rounded-lg bg-amber-100 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-900">
                      Framvinda
                    </span>
                    <span className="text-sm font-bold text-amber-900">
                      {fatFireResults.currentProgress.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                      style={{
                        width: `${Math.min(
                          fatFireResults.currentProgress.percentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-white p-2">
                  <p className="text-gray-600">Mánaðarútgjöld</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(fatFireResults.totalMonthlyExpenses)}
                  </p>
                </div>
                <div className="rounded bg-white p-2">
                  <p className="text-gray-600">Óskalisti</p>
                  <p className="font-semibold text-gray-900">
                    {fatFireState?.wishListItems.length ?? 0} atriði
                  </p>
                </div>
              </div>

              {/* Timeline if available */}
              {fatFireResults.timeline && (
                <div className="rounded-lg border border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 p-3">
                  <p className="text-xs text-amber-800">
                    <strong>Tímalína til FI:</strong>{' '}
                    {fatFireResults.timeline.yearsToFI.toFixed(1)} ár
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-amber-300 bg-white p-4 text-center">
              <span className="text-2xl">✨</span>
              <p className="mt-2 text-sm text-gray-600">
                Byrjaðu að skipuleggja
                <br />
                lúxus eftirlaunaárin þín
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-3 text-center font-semibold text-white shadow-md">
            {hasResults ? 'Sjá nánar →' : 'Byrja áætlun →'}
          </div>

          {/* Features */}
          <div className="mt-4 space-y-1 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Lúxus grunnútgjöld</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Óskalisti fyrir draumalífsstíl</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Aukaútgjaldaáætlun</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>30x margfaldari fyrir öryggi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
