/**
 * GoalGapAnalysis - Savings projection and gap analysis component
 *
 * Shows whether the user is on track to reach their retirement savings goal,
 * and provides actionable recommendations if there's a shortfall.
 *
 * Features:
 * - Current savings and monthly savings summary
 * - Projected savings at retirement age
 * - Required amount for gap phase (biðtími)
 * - On-track vs shortfall status indicator
 * - Three recommendation options if behind:
 *   A) Reduce expenses
 *   B) Increase savings
 *   C) Lump sum (house sale)
 */

'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatMonthlyCurrency, formatPercentage } from '@/lib/utils/formatters';
import { calculateGoalGapAnalysis } from '@/lib/calculations/pensionAwareFire';
import type { GoalGapAnalysis as GoalGapAnalysisType } from '@/types/pensionAwareFire';

export interface GoalGapAnalysisProps {
  /** Override gap analysis (for testing/preview) */
  analysis?: GoalGapAnalysisType | null;
}

export function GoalGapAnalysis({ analysis: propAnalysis }: GoalGapAnalysisProps = {}) {
  const { pensionAwareFire } = useCalculator();

  // Calculate analysis from state or use prop
  const analysis = propAnalysis ?? (pensionAwareFire ? calculateGoalGapAnalysis(pensionAwareFire) : null);

  // Return null if no analysis available or no state
  if (!analysis || !pensionAwareFire) {
    return null;
  }

  // Return null if already retired (edge case)
  if (pensionAwareFire.currentAge >= pensionAwareFire.targetRetirementAge) {
    return null;
  }

  const { projection, recommendations, yearsToRetirement, gapPhaseDuration } = analysis;
  const { currentSavings, monthlySavings, targetRetirementAge, currentAge, monthlyExpenses } = pensionAwareFire;

  // Determine status styling
  const isOnTrack = projection.isOnTrack;

  return (
    <Card className="bg-white border border-neutral-200 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Staða sparnaðar
            </h3>
            <p className="text-sm text-neutral-500">
              Ertu á réttri leið til að ná eftirlaunamarkmiðinu?
            </p>
          </div>
        </div>

        {/* Current Status Summary */}
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-600">Núverandi sparnaður</div>
              <div className="text-lg font-semibold text-neutral-900">
                {formatCurrency(currentSavings)}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Mánaðarlegur sparnaður</div>
              <div className="text-lg font-semibold text-neutral-900">
                {formatMonthlyCurrency(monthlySavings)}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Ár til eftirlauna</div>
              <div className="text-lg font-semibold text-neutral-900">
                {yearsToRetirement} ár ({currentAge} → {targetRetirementAge})
              </div>
            </div>
          </div>
        </div>

        {/* Projection Comparison */}
        <div className="space-y-4">
          {/* Projected Amount */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">
              Áætlaður sparnaður við {targetRetirementAge} ára:
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-800">
              {formatCurrency(projection.projectedAtRetirement)}
            </div>
          </div>

          {/* Required Amount */}
          <div className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
            <div className="text-sm font-medium text-neutral-600 mb-1">
              Þarf fyrir biðtíma ({targetRetirementAge}-{Math.min(targetRetirementAge + gapPhaseDuration, 67)}):
            </div>
            <div className="text-2xl md:text-3xl font-bold text-neutral-800">
              {formatCurrency(projection.requiredForGapPhase)}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {isOnTrack ? (
          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div className="space-y-2">
                <div className="text-lg font-semibold text-green-800">
                  Þú ert á réttri leið!
                </div>
                <div className="text-sm text-green-700">
                  Afgangur: <span className="font-semibold">{formatCurrency(projection.surplus)}</span>
                </div>
                {projection.surplus > 5_000_000 && (
                  <p className="text-sm text-green-600 mt-2">
                    Þetta þýðir að þú gætir hugsanlega hætt fyrr eða lifað á hærri lífsstíl á eftirlaunum.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-lg p-5 border border-amber-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="text-lg font-semibold text-amber-800">
                  Vantar: {formatCurrency(projection.shortfall)}
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  Með núverandi sparnaðarhraða náirðu ekki markmiðinu.
                  Sjá tillögur hér að neðan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section (only shown if shortfall) */}
        {!isOnTrack && recommendations && (
          <div className="border-t border-neutral-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h4 className="text-lg font-semibold text-neutral-900">
                Leiðir til að ná markmiðinu
              </h4>
            </div>

            <div className="space-y-4">
              {/* Option A: Reduce Expenses */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-blue-700 bg-blue-100 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                    A
                  </span>
                  <div>
                    <div className="font-semibold text-blue-800">Lækka útgjöld</div>
                    <p className="text-sm text-blue-700 mt-1">
                      Lækkaðu mánaðarleg útgjöld um{' '}
                      <span className="font-semibold">{formatCurrency(recommendations.expenseReduction.monthlyAmount)}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      (úr {formatCurrency(monthlyExpenses)} → {formatCurrency(recommendations.expenseReduction.newMonthlyExpenses)})
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Þannig minnkar þörfin fyrir biðtímann.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option B: Increase Savings */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-blue-700 bg-blue-100 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                    B
                  </span>
                  <div>
                    <div className="font-semibold text-blue-800">Auka sparnað</div>
                    <p className="text-sm text-blue-700 mt-1">
                      Sparaðu{' '}
                      <span className="font-semibold">{formatCurrency(recommendations.additionalSavings.monthlyAmount)}</span>{' '}
                      meira á mánuði
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      (úr {formatMonthlyCurrency(monthlySavings)} → {formatMonthlyCurrency(recommendations.additionalSavings.newMonthlySavings)})
                    </p>
                  </div>
                </div>
              </div>

              {/* Option C: Lump Sum */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-lg font-bold text-blue-700 bg-blue-100 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                    C
                  </span>
                  <div>
                    <div className="font-semibold text-blue-800">Eingreiðsla / húsnæði</div>
                    <p className="text-sm text-blue-700 mt-1">
                      {recommendations.lumpSum.note}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Ef þú losar um{' '}
                      <span className="font-semibold">{formatCurrency(recommendations.lumpSum.amountNeeded)}</span>{' '}
                      færðu nægan pening.
                    </p>
                  </div>
                </div>
              </div>

              {/* Combination Note */}
              <div className="flex items-start gap-2 text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                <span>ℹ️</span>
                <span>
                  Þú getur líka blandað saman þessum aðgerðum - til dæmis lækkað útgjöld aðeins og aukið sparnað aðeins.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-center text-neutral-500 pt-2 border-t border-neutral-100">
          <p>
            Þessi spá gerir ráð fyrir {formatPercentage(pensionAwareFire.investmentReturn * 100, 0)} árlegri ávöxtun.
            Séreign er ekki meðtalin hér þar sem hún er aðeins aðgengileg frá 60 ára aldri.
          </p>
        </div>
      </div>
    </Card>
  );
}
