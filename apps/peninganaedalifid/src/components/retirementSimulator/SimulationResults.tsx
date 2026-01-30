'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import type { SimulationResults as SimulationResultsType } from '@/types/retirementSimulator';
import {
  getSuccessRateLevel,
  SUCCESS_RATE_LABELS,
  SUCCESS_RATE_COLORS,
} from '@/lib/constants/retirementSimulator';
import { formatCurrency } from '@/lib/utils';

export interface SimulationResultsProps {
  results: SimulationResultsType;
}

/**
 * Simulation Results Display Component
 *
 * Shows key results from Monte Carlo simulation:
 * - Success probability (color-coded)
 * - Confidence interpretation
 * - Portfolio at death statistics
 * - Median depletion age (if applicable)
 * - Computation time
 */
export function SimulationResults({ results }: SimulationResultsProps) {
  const successRate = results.successProbability;
  const level = getSuccessRateLevel(successRate);
  const colors = SUCCESS_RATE_COLORS[level];
  const label = SUCCESS_RATE_LABELS[level];

  const successPercentage = (successRate * 100).toFixed(1);
  const failurePercentage = ((1 - successRate) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Niðurstöður hermun
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          {results.simulationConfig.scenarioCount.toLocaleString('is-IS')} atburðarásir
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Probability - Main Metric */}
        <div
          className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 text-center`}
        >
          <div className="mb-2">
            <div className="text-sm font-medium text-neutral-600 mb-1">
              ÁRANGURSLÍKUR
            </div>
            <div className={`text-5xl font-bold ${colors.text}`}>
              {successPercentage}%
            </div>
          </div>
          <div className={`inline-block px-4 py-1 ${colors.bg} ${colors.text} border ${colors.border} rounded-full text-sm font-semibold`}>
            {label}
          </div>
          <p className="mt-4 text-sm text-neutral-700">
            Í {results.successCount.toLocaleString('is-IS')} af{' '}
            {results.simulationConfig.scenarioCount.toLocaleString('is-IS')} atburðarásum
            endist eignasafnið alla eftirlaun.
          </p>
        </div>

        {/* Interpretation */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 mb-2 text-sm">
            Hvað þýðir þetta?
          </h3>
          <p className="text-sm text-neutral-700">
            {successRate >= 0.9 && (
              <>
                Mjög örugg eftirlaunaáætlun. Eignasafnið þitt er líklegt til að endist
                vel fram yfir lífslíkur þínar í flestum markaðsaðstæðum.
              </>
            )}
            {successRate >= 0.8 && successRate < 0.9 && (
              <>
                Góð eftirlaunaáætlun með ásættanlegri áhættu. Eignasafnið þitt ætti að
                endist í flestum tilvikum, en íhugaðu valkosti til að bæta öryggi.
              </>
            )}
            {successRate >= 0.7 && successRate < 0.8 && (
              <>
                Ásættanleg áætlun, en það er nokkur áhætta. Íhugaðu að vinna lengur,
                spara meira, eða lækka útgjöld til að bæta árangurslíkur.
              </>
            )}
            {successRate >= 0.6 && successRate < 0.7 && (
              <>
                Áhættusöm áætlun. {failurePercentage}% líkur á að eignasafnið tæmist.
                Mælt er með að gera breytingar á áætlun.
              </>
            )}
            {successRate < 0.6 && (
              <>
                Háhætta áætlun. Mjög líklegt að eignasafnið tæmist. Þarfnast verulegra
                breytinga á eftirlaunaáætlun.
              </>
            )}
          </p>
        </div>

        {/* Key Statistics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-neutral-900 text-sm">
            Lykilupplýsingar
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Portfolio at Death - Median */}
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="text-xs text-neutral-600 mb-1">
                Miðgildi safns við andlát
              </div>
              <div className="text-lg font-semibold text-neutral-900">
                {formatCurrency(results.portfolioAtDeathMedian)}
              </div>
            </div>

            {/* Portfolio at Death - 25th percentile */}
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="text-xs text-neutral-600 mb-1">
                25. hundraðshluti
              </div>
              <div className="text-lg font-semibold text-neutral-900">
                {formatCurrency(results.portfolioAtDeath25th)}
              </div>
            </div>
          </div>

          {/* Depletion Info */}
          {results.failureCount > 0 && results.medianDepletionAge && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-xs text-orange-800 mb-1">
                Miðaldur þegar safn tæmist (í misheppnuðum atburðarásum)
              </div>
              <div className="text-lg font-semibold text-orange-900">
                {results.medianDepletionAge} ára
              </div>
              <div className="text-xs text-orange-700 mt-1">
                Í {results.failureCount} af {results.simulationConfig.scenarioCount} atburðarásum
              </div>
            </div>
          )}

          {/* Perfect Success */}
          {results.failureCount === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold text-green-900">
                100% árangur
              </div>
              <div className="text-xs text-green-700 mt-1">
                Eignasafnið endist í öllum atburðarásum
              </div>
            </div>
          )}
        </div>

        {/* Computation Time */}
        <div className="text-xs text-neutral-700 text-center pt-4 border-t border-neutral-200">
          Hermun keyrð á {(results.computeTime / 1000).toFixed(2)} sekúndum
        </div>
      </CardContent>
    </Card>
  );
}
