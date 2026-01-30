/**
 * ActionSuggestionsPanel Component
 *
 * Provide actionable suggestions when Coast FIRE is impossible with current parameters.
 * Helps users understand what they can change to make Coast FIRE achievable.
 *
 * Features:
 * - Four types of suggestions:
 *   1. Delay retirement (calculate new age needed)
 *   2. Reduce FI number (calculate achievable FI with current parameters)
 *   3. Increase return rate (calculate required return, warn about risk)
 *   4. Continue saving (calculate monthly savings needed)
 * - Feasibility rating for each (easy/moderate/difficult)
 * - Calculations shown for each suggestion
 * - Only shown when status is 'impossible'
 * - Clear, actionable language in Icelandic
 *
 * Epic 5, Task 5.3
 */

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import type { CoastFIREInputs, ActionSuggestion } from '@/types/coastFire';
import { cn } from '@/lib/utils';
import { calculateFutureValue } from '@/lib/calculations/coastFire';
import { RETURN_RATE_RANGE } from '@/lib/constants/coastFire';

export interface ActionSuggestionsPanelProps {
  inputs: CoastFIREInputs;
  projectedBalance: number;
  className?: string;
}

/**
 * Calculate age needed to achieve Coast FIRE with current parameters
 */
function calculateDelayRetirementSuggestion(
  inputs: CoastFIREInputs,
  projectedBalance: number
): ActionSuggestion | null {
  const { currentAge, currentInvestments, fiNumber, expectedReturn } = inputs;

  if (!fiNumber || fiNumber <= 0) return null;

  // If projected balance already exceeds FI number, not applicable
  if (projectedBalance >= fiNumber) return null;

  // Calculate years needed for current investments to grow to FI number
  const rate = expectedReturn / 100;
  const ratio = fiNumber / currentInvestments;
  const yearsNeeded = Math.log(ratio) / Math.log(1 + rate);
  const targetAge = Math.round(currentAge + yearsNeeded);
  const additionalYears = Math.round(yearsNeeded - (inputs.targetRetirementAge - currentAge));

  // Feasibility
  let feasibility: 'easy' | 'moderate' | 'difficult';
  if (additionalYears <= 2) {
    feasibility = 'easy';
  } else if (additionalYears <= 5) {
    feasibility = 'moderate';
  } else {
    feasibility = 'difficult';
  }

  return {
    type: 'delay-retirement',
    title: 'Fresta eftirlaunum',
    description: `Við að fresta til ${targetAge} ára aldurs næðirðu Sjálfvirku FIRE.`,
    calculation: `${additionalYears} ár viðbótar (til ${targetAge} ára)`,
    feasibility,
  };
}

/**
 * Calculate achievable FI number with current parameters
 */
function calculateReduceFISuggestion(
  inputs: CoastFIREInputs,
  projectedBalance: number
): ActionSuggestion | null {
  const { fiNumber } = inputs;

  if (!fiNumber || fiNumber <= 0) return null;

  // If projected balance already exceeds FI number, not applicable
  if (projectedBalance >= fiNumber) return null;

  const achievableFI = projectedBalance;
  const difference = fiNumber - achievableFI;
  const percentageOfTarget = achievableFI / fiNumber;

  // Feasibility based on how close to target
  let feasibility: 'easy' | 'moderate' | 'difficult';
  if (percentageOfTarget >= 0.9) {
    feasibility = 'easy';
  } else if (percentageOfTarget >= 0.7) {
    feasibility = 'moderate';
  } else {
    feasibility = 'difficult';
  }

  return {
    type: 'reduce-fi',
    title: 'Minnka FI Tölu',
    description: `Lækka markmið í ${formatCurrency(achievableFI)}`,
    calculation: `${formatCurrency(difference)} minna (${Math.round(percentageOfTarget * 100)}% af markmiði)`,
    feasibility,
  };
}

/**
 * Calculate required return rate to achieve Coast FIRE
 */
function calculateIncreaseReturnSuggestion(
  inputs: CoastFIREInputs
): ActionSuggestion | null {
  const { currentAge, currentInvestments, fiNumber, targetRetirementAge } = inputs;

  if (!fiNumber || fiNumber <= 0) return null;

  const yearsToRetirement = targetRetirementAge - currentAge;

  // Calculate required return rate
  // FV = PV * (1 + r)^t
  // r = (FV / PV)^(1/t) - 1
  const ratio = fiNumber / currentInvestments;
  const requiredRate = (Math.pow(ratio, 1 / yearsToRetirement) - 1) * 100;
  const difference = requiredRate - inputs.expectedReturn;

  // Check if required rate is realistic
  if (requiredRate > RETURN_RATE_RANGE.MAX || requiredRate < 0) {
    return null; // Not feasible
  }

  // Feasibility based on required return
  let feasibility: 'easy' | 'moderate' | 'difficult';
  let warning: string | undefined;

  if (requiredRate <= 8) {
    feasibility = 'moderate';
  } else if (requiredRate <= 10) {
    feasibility = 'moderate';
    warning = 'Ávöxtun yfir 8% krefst hlutabréfamiðaðs safns með meiri áhættu.';
  } else {
    feasibility = 'difficult';
    warning = 'Ávöxtun yfir 10% er mjög árásargjörn og óáreiðanleg til langs tíma.';
  }

  return {
    type: 'increase-return',
    title: 'Auka ávöxtun (áhætta)',
    description: `Þú þarft ${formatPercentage(requiredRate, 1)} ávöxtun`,
    calculation: `${formatPercentage(difference, 1)} hærri ávöxtun`,
    feasibility,
    warning,
  };
}

/**
 * Calculate monthly savings needed to reach FI number
 */
function calculateContinueSavingSuggestion(
  inputs: CoastFIREInputs
): ActionSuggestion | null {
  const { currentAge, currentInvestments, fiNumber, targetRetirementAge, expectedReturn } = inputs;

  if (!fiNumber || fiNumber <= 0) return null;

  const yearsToRetirement = targetRetirementAge - currentAge;
  const rate = expectedReturn / 100;

  // Future value of current investments
  const futureValueCurrent = calculateFutureValue(
    currentInvestments,
    expectedReturn,
    yearsToRetirement
  );

  // Gap that needs to be filled by additional savings
  const gapToFill = fiNumber - futureValueCurrent;

  if (gapToFill <= 0) return null; // Already on track

  // Calculate monthly savings needed using future value of annuity formula
  // FV = PMT * [((1 + r)^n - 1) / r]
  // PMT = FV / [((1 + r)^n - 1) / r]
  const monthlyRate = rate / 12;
  const totalMonths = yearsToRetirement * 12;
  const denominator = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  const monthlySavings = Math.round(gapToFill / denominator);

  return {
    type: 'continue-saving',
    title: 'Halda áfram að spara',
    description: `Leggja til ${formatCurrency(monthlySavings)}/mán`,
    calculation: `Ná FI við ${targetRetirementAge} ára aldur`,
    feasibility: 'moderate',
  };
}

/**
 * Get feasibility badge color
 */
function getFeasibilityColors(feasibility: 'easy' | 'moderate' | 'difficult') {
  switch (feasibility) {
    case 'easy':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        label: 'Auðvelt',
      };
    case 'moderate':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        label: 'Í meðallagi',
      };
    case 'difficult':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        label: 'Erfitt',
      };
  }
}

/**
 * Get suggestion icon
 */
function getSuggestionIcon(type: ActionSuggestion['type']): string {
  switch (type) {
    case 'delay-retirement':
      return '📅';
    case 'reduce-fi':
      return '📉';
    case 'increase-return':
      return '📈';
    case 'continue-saving':
      return '💰';
  }
}

export function ActionSuggestionsPanel({
  inputs,
  projectedBalance,
  className,
}: ActionSuggestionsPanelProps) {
  // Generate suggestions
  const suggestions = useMemo(() => {
    const allSuggestions: ActionSuggestion[] = [];

    const delaySuggestion = calculateDelayRetirementSuggestion(inputs, projectedBalance);
    if (delaySuggestion) allSuggestions.push(delaySuggestion);

    const reduceSuggestion = calculateReduceFISuggestion(inputs, projectedBalance);
    if (reduceSuggestion) allSuggestions.push(reduceSuggestion);

    const returnSuggestion = calculateIncreaseReturnSuggestion(inputs);
    if (returnSuggestion) allSuggestions.push(returnSuggestion);

    const savingSuggestion = calculateContinueSavingSuggestion(inputs);
    if (savingSuggestion) allSuggestions.push(savingSuggestion);

    return allSuggestions;
  }, [inputs, projectedBalance]);

  // Don't show if no suggestions
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className={cn('border-2 border-amber-300', className)}>
      <CardHeader className="bg-amber-50">
        <h2 className="text-xl font-semibold text-amber-900">
          Ráðleggingar til að ná Sjálfvirku FIRE
        </h2>
        <p className="mt-1 text-sm text-amber-700">
          Með núverandi forsendum er Sjálfvirkt FIRE ekki mögulegt. Hér eru nokkrar
          leiðir til að breyta því:
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const colors = getFeasibilityColors(suggestion.feasibility);

            return (
              <div
                key={suggestion.type}
                className="rounded-lg border-2 border-neutral-200 bg-white p-4 hover:border-neutral-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl" role="img" aria-label={suggestion.title}>
                      {getSuggestionIcon(suggestion.type)}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-neutral-900">
                        {suggestion.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                      colors.bg,
                      colors.text,
                      colors.border
                    )}
                  >
                    {colors.label}
                  </span>
                </div>

                {/* Calculation */}
                <div className="ml-11 pl-3 border-l-2 border-neutral-200">
                  <p className="text-sm font-medium text-neutral-600">
                    📊 {suggestion.calculation}
                  </p>
                </div>

                {/* Warning (if applicable) */}
                {suggestion.warning && (
                  <div className="ml-11 mt-3 rounded-md bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs text-amber-800">
                      <strong>⚠️ Athugasemd:</strong> {suggestion.warning}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* General advice */}
        <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">
            Almennar ráðleggingar
          </h3>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• Þú getur sameinað margar af þessum aðferðum (t.d. fresta um 2 ár OG auka ávöxtun lítillega)</li>
            <li>• Íhugaðu að skoða Útgjaldalínu þína til að sjá hvort þú getir lækkað FI-töluna</li>
            <li>• Aukinn sparnaður í nokkur ár getur gert mikinn mun með vaxtavexti</li>
            <li>• Skoðaðu "Íhaldssamur" og "Bjartsýn" sviðsmyndir til að sjá hvernig ávöxtun hefur áhrif</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
