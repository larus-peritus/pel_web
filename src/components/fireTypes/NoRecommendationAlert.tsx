/**
 * NoRecommendationAlert Component
 *
 * Displays an informative alert when recommendations cannot be generated.
 * Shows:
 * - Explanation of why no recommendations
 * - List of missing/needed inputs
 * - Links to provide missing inputs (scroll to inputs section)
 * - Friendly, encouraging tone in Icelandic
 * - Optional example recommendations to show what user would see
 *
 * Used in RecommendationsSection when user hasn't provided enough data.
 */

import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Props for NoRecommendationAlert
 */
export interface NoRecommendationAlertProps {
  /** List of missing inputs that are needed */
  missingInputs: string[];
  /** Callback to scroll to inputs section */
  onGoToInputs?: () => void;
  /** Whether to show example recommendations */
  showExamples?: boolean;
  /** Optional custom className */
  className?: string;
}

/**
 * Example recommendation data to show what user will see
 */
const EXAMPLE_RECOMMENDATIONS = [
  {
    type: 'Venjulegt FIRE',
    icon: '🌱',
    description: 'Jafnvægi milli lífsstíls og sparnaðar',
  },
  {
    type: 'CoastFIRE',
    icon: '🏖️',
    description: 'Láttu fjárfestingar vaxa á meðan þú vinnur',
  },
  {
    type: 'BaristaFIRE',
    icon: '☕',
    description: 'Hálftímavinna í stað fulls starfs',
  },
];

/**
 * Get user-friendly label for missing input types
 */
const getMissingInputLabel = (inputType: string): string => {
  const labels: Record<string, string> = {
    age: 'Aldur þinn',
    income: 'Árstekjur',
    currentSavings: 'Núverandi sparnaður',
    monthlyExpenses: 'Mánaðarleg útgjöld',
    monthlySavings: 'Mánaðarlegur sparnaður',
  };
  return labels[inputType] || inputType;
};

/**
 * NoRecommendationAlert Component
 */
export function NoRecommendationAlert({
  missingInputs,
  onGoToInputs,
  showExamples = true,
  className,
}: NoRecommendationAlertProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Alert */}
      <Alert variant="info" title="Við þurfum meiri upplýsingar">
        <div className="space-y-4">
          {/* Explanation */}
          <p className="text-sm text-primary-800">
            Til að geta gefið þér persónulegar ráðleggingar um hvaða FIRE leið hentar þér best,
            þurfum við að vita meira um fjárhagsstöðu þína og markmið.
          </p>

          {/* Missing Inputs List */}
          {missingInputs.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-primary-900 mb-2">
                Upplýsingar sem vantar:
              </p>
              <ul className="space-y-1.5">
                {missingInputs.map((input, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-primary-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {getMissingInputLabel(input)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call to Action */}
          {onGoToInputs && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={onGoToInputs}
                className="w-full sm:w-auto"
              >
                Fylla inn upplýsingar
              </Button>
            </div>
          )}
        </div>
      </Alert>

      {/* Example Recommendations (Optional) */}
      {showExamples && (
        <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-xl p-6 border border-neutral-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Hvað munt þú sjá?
            </h3>
            <p className="text-sm text-neutral-700">
              Þegar þú hefur gefið okkur nauðsynlegar upplýsingar munum við greina
              hvaða FIRE leiðir henta þér best og gefa þér persónulegar ráðleggingar.
            </p>
          </div>

          {/* Example Cards */}
          <div className="space-y-3">
            {EXAMPLE_RECOMMENDATIONS.map((example, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" role="img" aria-label={example.type}>
                    {example.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {example.type}
                    </h4>
                    <p className="text-sm text-neutral-600 mt-1">
                      {example.description}
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-50 text-success-700 border border-success-200">
                        Besti valkosturinn
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-primary-800">
              <span className="font-semibold">Ábending:</span> Því meiri upplýsingar sem þú gefur,
              þeim mun nákvæmari verða ráðleggingarnar okkar fyrir þig.
            </p>
          </div>
        </div>
      )}

      {/* Educational Section */}
      <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <span role="img" aria-label="Upplýsingar">💡</span>
          Hvað er FIRE?
        </h3>
        <p className="text-sm text-neutral-700 mb-3">
          FIRE stendur fyrir <strong>Financial Independence, Retire Early</strong>
          (Fjárhagslegt frelsi, snemma starfslok). Það eru til mismunandi leiðir að þessu markmiði:
        </p>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0">🔥</span>
            <span>
              <strong>LeanFIRE:</strong> Lágmarksútgjöld, stysta leiðin
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🌱</span>
            <span>
              <strong>RegularFIRE:</strong> Þægilegur lífsstíll, klassísk leið
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">🏖️</span>
            <span>
              <strong>CoastFIRE:</strong> Láttu sparnaðinn vaxa, vinndu fyrir útgjöldum
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">☕</span>
            <span>
              <strong>BaristaFIRE:</strong> Hálftímavinna statt fulls starfs
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">💰</span>
            <span>
              <strong>FatFIRE:</strong> Ríkulegur lífsstíl án skerðinga
            </span>
          </li>
        </ul>
        <p className="text-sm text-neutral-600 mt-4 italic">
          Við hjálpum þér að finna út hvaða leið hentar þér best út frá þínum aðstæðum og markmiðum.
        </p>
      </div>
    </div>
  );
}
