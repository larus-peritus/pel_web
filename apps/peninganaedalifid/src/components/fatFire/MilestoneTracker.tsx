/**
 * MilestoneTracker - Progress milestones display
 *
 * Features:
 * - 25%, 50%, 75%, 100% milestones
 * - Amount at each milestone
 * - Projected date (if timeline data available)
 * - Visual progress bar
 * - Highlight achieved milestones
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';

export function MilestoneTracker() {
  const { fatFireResults, fatFireState } = useCalculator();

  if (!fatFireResults || !fatFireState) return null;

  const { milestones, currentProgress } = fatFireResults;

  if (milestones.length === 0) return null;

  const currentSavings = fatFireState.currentSavings ?? 0;

  return (
    <Card variant="elevated" className="border-amber-200">
      <CardHeader className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-amber-900">
              Áfangar á leiðinni
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Markmiðspunktar til FatFIRE
            </p>
          </div>
          <span className="text-2xl">🎯</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        {currentProgress && (
          <div className="rounded-lg bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-amber-900">
                Heildarframvinda
              </span>
              <span className="text-lg font-bold text-amber-900">
                {currentProgress.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                style={{
                  width: `${Math.min(currentProgress.percentage, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const isAchieved =
              currentSavings >= milestone.amount;
            const isCurrent =
              !isAchieved &&
              (index === 0 ||
                currentSavings >= milestones[index - 1].amount);

            return (
              <div
                key={milestone.percentage}
                className={`rounded-lg border-2 p-4 transition-all ${
                  isAchieved
                    ? 'border-green-300 bg-green-50'
                    : isCurrent
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Milestone Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-2xl ${
                          isAchieved
                            ? ''
                            : isCurrent
                            ? 'opacity-100'
                            : 'opacity-50'
                        }`}
                      >
                        {milestone.percentage === 25
                          ? '🥉'
                          : milestone.percentage === 50
                          ? '🥈'
                          : milestone.percentage === 75
                          ? '🥇'
                          : '👑'}
                      </span>
                      <h4
                        className={`font-semibold ${
                          isAchieved
                            ? 'text-green-900'
                            : isCurrent
                            ? 'text-amber-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {milestone.label}
                      </h4>
                      {isAchieved && (
                        <Badge variant="success">✓ Náð</Badge>
                      )}
                      {!isAchieved && isCurrent && (
                        <Badge variant="warning">Núverandi</Badge>
                      )}
                    </div>

                    <p
                      className={`text-2xl font-bold ${
                        isAchieved
                          ? 'text-green-600'
                          : isCurrent
                          ? 'text-amber-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {formatCurrency(milestone.amount)}
                    </p>

                    {/* Date projection */}
                    {milestone.projectedDate && milestone.yearsFromNow !== null && (
                      <div className="mt-2 text-sm">
                        {isAchieved ? (
                          <p className="text-green-700">
                            ✓ Þegar náð
                          </p>
                        ) : (
                          <>
                            <p
                              className={
                                isCurrent
                                  ? 'text-amber-700'
                                  : 'text-gray-600'
                              }
                            >
                              <strong>Áætlaður tími:</strong>{' '}
                              {milestone.yearsFromNow < 1
                                ? 'Innan árs'
                                : `${milestone.yearsFromNow.toFixed(1)} ár`}
                            </p>
                            <p
                              className={
                                isCurrent
                                  ? 'text-amber-600'
                                  : 'text-gray-700'
                              }
                            >
                              {milestone.projectedDate.toLocaleDateString(
                                'is-IS',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                }
                              )}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {!milestone.projectedDate && !isAchieved && (
                      <p className="mt-2 text-sm text-gray-700">
                        Fylltu út núverandi sparnað og árlegt framlag til að
                        sjá áætlaða dagsetningu
                      </p>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-current">
                    <span
                      className={`text-xl font-bold ${
                        isAchieved
                          ? 'text-green-600'
                          : isCurrent
                          ? 'text-amber-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {milestone.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        <div className="rounded-lg border-2 border-amber-300 bg-gradient-to-r from-amber-100 to-yellow-100 p-4">
          <p className="text-sm text-amber-900">
            <strong>💪 Haltu áfram!</strong> Hver áfangi færir þig nær
            fullkomnu fjárhagslegu frelsi. FatFIRE er ferðin til lúxuslífsstíls
            án málamiðlana!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
