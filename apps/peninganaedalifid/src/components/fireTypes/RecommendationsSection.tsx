/**
 * RecommendationsSection Component
 *
 * Main section component for displaying FIRE type recommendations.
 * Shows:
 * - Section header "Ráðleggingar fyrir þig"
 * - Check if enough data exists for recommendations
 * - If no data: show NoRecommendationAlert
 * - If data exists:
 *   - Top recommendation (larger, prominent card)
 *   - Alternative recommendations (2-3 smaller cards)
 * - Brief explanation of scoring methodology
 * - Responsive grid layout
 *
 * This is the main orchestration component for Epic 6.
 */

import React, { useMemo } from 'react';
import { RecommendationCard } from './RecommendationCard';
import { NoRecommendationAlert } from './NoRecommendationAlert';
import { cn } from '@/lib/utils';
import type { FIRERecommendation, FIRECalculation, UserFinancialInputs } from '@/types/fireTypes';
import { calculateFIRERecommendations } from '@/lib/calculations/fireTypes';

/**
 * Props for RecommendationsSection
 */
export interface RecommendationsSectionProps {
  /** All FIRE type calculations */
  calculations: {
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  } | null;
  /** User financial inputs (for validation) */
  userInputs: UserFinancialInputs | null;
  /** Callback when user selects a FIRE type */
  onSelectType: (fireTypeId: string) => void;
  /** Callback to scroll to inputs section */
  onGoToInputs?: () => void;
  /** Optional custom className */
  className?: string;
}

/**
 * Check if user has provided minimum required data
 */
const hasMinimumData = (inputs: UserFinancialInputs | null): boolean => {
  if (!inputs) return false;

  // Check for minimum required fields from UserFinancialInputs type
  const hasAge = inputs.currentAge > 0;
  const hasIncome = inputs.annualIncome > 0;
  const hasNetWorth = inputs.currentNetWorth >= 0;
  const hasExpenses =
    inputs.monthlyExpenses.barebones > 0 ||
    inputs.monthlyExpenses.comfortable > 0 ||
    inputs.monthlyExpenses.deluxe > 0;

  return hasAge && hasIncome && hasNetWorth && hasExpenses;
};

/**
 * Get list of missing inputs
 */
const getMissingInputs = (inputs: UserFinancialInputs | null): string[] => {
  const missing: string[] = [];

  if (!inputs) {
    return ['age', 'income', 'currentNetWorth', 'monthlyExpenses', 'annualSavings'];
  }

  if (inputs.currentAge <= 0) missing.push('age');
  if (inputs.annualIncome <= 0) missing.push('income');
  if (inputs.currentNetWorth < 0) missing.push('currentNetWorth');
  const hasExpenses =
    inputs.monthlyExpenses.barebones > 0 ||
    inputs.monthlyExpenses.comfortable > 0 ||
    inputs.monthlyExpenses.deluxe > 0;
  if (!hasExpenses) missing.push('monthlyExpenses');
  if (inputs.annualSavings <= 0) missing.push('annualSavings');

  return missing;
};

/**
 * RecommendationsSection Component
 */
export function RecommendationsSection({
  calculations,
  userInputs,
  onSelectType,
  onGoToInputs,
  className,
}: RecommendationsSectionProps) {
  // Check if we have enough data
  const hasData = hasMinimumData(userInputs);
  const missingInputs = getMissingInputs(userInputs);

  // Generate recommendations
  const recommendations = useMemo(() => {
    if (!hasData || !calculations) return null;
    return calculateFIRERecommendations(calculations);
  }, [hasData, calculations]);

  // Split into top recommendation and alternatives
  const topRecommendation = recommendations?.[0] || null;
  const alternativeRecommendations = recommendations?.slice(1, 4) || [];

  return (
    <section className={cn('space-y-8', className)}>
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-3">
          Ráðleggingar fyrir þig
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Byggt á fjárhagsstöðu þinni og markmiðum höfum við greint hvaða FIRE leiðir
          henta þér best. Sjá nánar niðurstöður hér að neðan.
        </p>
      </div>

      {/* Show NoRecommendationAlert if no data or no calculations */}
      {(!hasData || !recommendations) && (
        <NoRecommendationAlert
          missingInputs={missingInputs}
          onGoToInputs={onGoToInputs}
          showExamples={true}
        />
      )}

      {/* Show Recommendations if data exists and recommendations generated */}
      {hasData && recommendations && topRecommendation && (
        <div className="space-y-8">
          {/* Methodology Explanation */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0" role="img" aria-label="Aðferðafræði">
                📊
              </span>
              <div>
                <h3 className="font-semibold text-primary-900 mb-1">
                  Hvernig reiknum við út skorin?
                </h3>
                <p className="text-sm text-primary-800">
                  Við greinum hverja FIRE leið út frá mörgum þáttum: raunhæfi markmiðsins (hversu auðvelt
                  er að ná því), tímalengd til marks, nauðsynleg fórn í lífsstíl, og hversu vel leiðin
                  passar við þínar núverandi aðstæður. Hærra skor þýðir betri samsvörun.
                </p>
              </div>
            </div>
          </div>

          {/* Top Recommendation - Prominent Display */}
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <span role="img" aria-label="Besta valkosturinn">🌟</span>
              Besta valkosturinn fyrir þig
            </h3>
            <RecommendationCard
              recommendation={topRecommendation}
              calculation={calculations![topRecommendation.fireTypeId as keyof typeof calculations]}
              onSelect={onSelectType}
              isTopRecommendation={true}
            />
          </div>

          {/* Alternative Recommendations - Grid Layout */}
          {alternativeRecommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <span role="img" aria-label="Aðrir valkostir">🔍</span>
                Aðrir valkostir
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Þessir valkostir gætu einnig hentað þér vel. Skoðaðu hvern og einn til að sjá
                hvað hentar þér best.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alternativeRecommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.fireTypeId}
                    recommendation={recommendation}
                    calculation={calculations![recommendation.fireTypeId as keyof typeof calculations]}
                    onSelect={onSelectType}
                    isTopRecommendation={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Additional Context */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0" role="img" aria-label="Ábending">
                💡
              </span>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Mundu
                </h3>
                <p className="text-sm text-neutral-700">
                  Þessar ráðleggingar eru byggðar á núverandi upplýsingum þínum. Þú getur alltaf
                  breytt markmiðum þínum seinna eða skoðað aðrar leiðir. Enginn valkostur er
                  "rangur" - það sem skiptir máli er að finna leið sem hentar <strong>þér</strong> og
                  þínum markmiðum.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
