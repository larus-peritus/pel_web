'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import type { FlexibilityAnalysis as FlexibilityAnalysisType } from '@/types/retirementSimulator';

export interface FlexibilityAnalysisProps {
  flexibility: FlexibilityAnalysisType;
}

/**
 * Flexibility Analysis Component
 *
 * Shows sensitivity analysis and margin of safety:
 * - Years of buffer (can retire earlier with acceptable success)
 * - Additional years needed (if success rate too low)
 * - Spending flexibility (increase/decrease capacity)
 * - Sensitivity to market returns, inflation, life expectancy
 * - Recommendation with reasoning
 */
export function FlexibilityAnalysis({ flexibility }: FlexibilityAnalysisProps) {
  const hasBuffer = flexibility.yearsOfBuffer > 0;
  const needsMoreTime = flexibility.additionalYearsNeeded > 0;
  const canIncreaseSpending = flexibility.spendingIncreaseCapacity > 0;
  const needsDecreaseSpending = flexibility.spendingDecreaseNeeded > 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Sveigjanleiki og viðkvæmni
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Hversu örugg er eftirlaunaáætlunin?
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Retirement Timing Flexibility */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 text-sm">
            Tímasetning eftirlauна
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hasBuffer ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-1">
                  Sveigjanleiki í átt að fyrri eftirlaun
                </div>
                <div className="text-2xl font-bold text-green-900">
                  +{flexibility.yearsOfBuffer} ár
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Þú gætir farið {flexibility.yearsOfBuffer} ári/árum fyrr á eftirlaun
                  og samt haft &gt;80% árangurslíkur.
                </p>
              </div>
            ) : null}

            {needsMoreTime ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-xs text-orange-700 mb-1">
                  Ár sem vantar fyrir 80% árangur
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  +{flexibility.additionalYearsNeeded} ár
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  Íhugaðu að vinna {flexibility.additionalYearsNeeded} ári/árum lengur
                  til að ná 80% árangurslíkum.
                </p>
              </div>
            ) : null}

            {!hasBuffer && !needsMoreTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-xs text-blue-700 mb-1">
                  Eftirlaunaáætlun
                </div>
                <div className="text-lg font-bold text-blue-900">
                  Á markmiði
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Núverandi eftirlaunaaldur er vel í takt við markmið þitt.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Spending Flexibility */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 text-sm">
            Sveigjanleiki í útgjöldum
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {canIncreaseSpending && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs text-green-700 mb-1">
                  Getu til að auka útgjöld
                </div>
                <div className="text-2xl font-bold text-green-900">
                  +{(flexibility.spendingIncreaseCapacity * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Þú gætir aukið útgjöld um{' '}
                  {(flexibility.spendingIncreaseCapacity * 100).toFixed(0)}% og samt
                  haldið góðum árangurslíkum.
                </p>
              </div>
            )}

            {needsDecreaseSpending && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-xs text-orange-700 mb-1">
                  Minnkun á útgjöldum sem þarf
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  -{(flexibility.spendingDecreaseNeeded * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  Til að ná betri árangurslíkum, íhugaðu að lækka útgjöld um{' '}
                  {(flexibility.spendingDecreaseNeeded * 100).toFixed(0)}%.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 text-sm">
            Viðkvæmnigreining
          </h3>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Ávöxtun +1%:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.returnRatePlus1 * 100).toFixed(1)}%
                  <span className="text-xs text-green-600 ml-2">
                    (+
                    {(
                      (flexibility.sensitivity.returnRatePlus1 - flexibility.sensitivity.returnRateMinus1) *
                      50
                    ).toFixed(1)}
                    %)
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Ávöxtun -1%:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.returnRateMinus1 * 100).toFixed(1)}%
                  <span className="text-xs text-red-600 ml-2">
                    (
                    {(
                      (flexibility.sensitivity.returnRateMinus1 - flexibility.sensitivity.returnRatePlus1) *
                      50
                    ).toFixed(1)}
                    %)
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                <span className="text-neutral-700">Verðbólga +0.5%:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.inflationPlus0_5 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Verðbólga -0.5%:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.inflationMinus0_5 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                <span className="text-neutral-700">Lífslíkur +5 ár:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.lifeExpectancyPlus5 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-700">Lífslíkur -5 ár:</span>
                <span className="font-semibold text-neutral-900">
                  {(flexibility.sensitivity.lifeExpectancyMinus5 * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Sýnir hvernig árangurslíkur breytast við mismunandi forsendur. Þetta hjálpar
            þér að skilja hvaða þættir hafa mest áhrif á eftirlaunaáætlunina.
          </p>
        </div>

        {/* Recommendation */}
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 text-sm">
            Tilmæli
          </h3>
          <Alert
            variant={
              flexibility.recommendation.confidence === 'high'
                ? 'success'
                : flexibility.recommendation.confidence === 'medium'
                ? 'info'
                : 'warning'
            }
          >
            <div>
              <h4 className="font-semibold mb-2">
                {flexibility.recommendation.confidence === 'high' && '✓ Örugg áætlun'}
                {flexibility.recommendation.confidence === 'medium' && 'ℹ Ásættanleg áætlun'}
                {flexibility.recommendation.confidence === 'low' && '⚠ Þarfnast athygli'}
              </h4>
              <p className="text-sm">{flexibility.recommendation.reasoning}</p>
              <div className="mt-3 text-xs">
                <strong>Ráðlagður eftirlaunadagur:</strong>{' '}
                {new Date(flexibility.recommendation.retirementDate).toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
