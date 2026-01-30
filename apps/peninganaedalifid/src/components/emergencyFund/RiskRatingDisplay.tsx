'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';

/**
 * Risk Rating Display
 *
 * Shows risk level assessment with:
 * - Color-coded badge
 * - Explanation of risk level
 * - Recommendation (if applicable)
 */
export function RiskRatingDisplay() {
  const { emergencyFundResults } = useCalculator();

  if (!emergencyFundResults) return null;

  const { riskRating } = emergencyFundResults;

  // Icon for each risk level
  const getRiskIcon = () => {
    switch (riskRating.level) {
      case 'underfunded':
        return '🚨';
      case 'minimal':
        return '⚠️';
      case 'moderate':
        return '👍';
      case 'strong':
        return '💪';
      case 'excellent':
        return '🌟';
      default:
        return '📊';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            Áhættumat
          </h3>
          <div className="text-2xl">{getRiskIcon()}</div>
        </div>

        {/* Risk Badge */}
        <div className="inline-flex items-center">
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${riskRating.color.bg} ${riskRating.color.text} border ${riskRating.color.border}`}>
            {riskRating.label}
          </span>
        </div>

        {/* Explanation */}
        <p className="text-neutral-700">
          {riskRating.explanation}
        </p>

        {/* Recommendation */}
        {riskRating.recommendation && (
          <div className="pt-3 border-t border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-900 mb-1">
              Ráðlegging:
            </h4>
            <p className="text-sm text-neutral-700">
              {riskRating.recommendation}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
