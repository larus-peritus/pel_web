'use client';

/**
 * Recommendation Card Component
 * Displays the best scenario recommendation with reasoning and life energy impact
 */

import type { SnowballResults } from '@/types/snowball';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RecommendationCardProps {
  recommendation: SnowballResults['recommendation'];
}

const SCENARIO_NAMES: Record<string, string> = {
  base: 'Grunnur (aukagreiðsla eingöngu)',
  snowballLoan: 'Snjóbolti á lán',
  snowballInvest: 'Snjóbolti í fjárfestingu',
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { bestScenario, isCloseCall, reasoning, lifeEnergyDifference } = recommendation;

  // Determine border color based on close call status
  const borderColor = isCloseCall ? 'border-warning-300' : 'border-success-300';

  return (
    <Card className={`border-2 ${borderColor} mb-6`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-neutral-900">Tilmæli</h3>
          {isCloseCall && (
            <Badge variant="warning" size="md">
              Jafntefli - persónuleg val
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Best scenario name */}
          <div>
            <div className="text-sm text-neutral-600 mb-1">Besta aðferðin fyrir þig</div>
            <div className="text-2xl font-bold text-neutral-900">
              {SCENARIO_NAMES[bestScenario]}
            </div>
          </div>

          {/* Reasoning */}
          <div className="prose prose-sm max-w-none">
            <div className="text-neutral-700 whitespace-pre-line">{reasoning}</div>
          </div>

          {/* Life energy difference - prominent purple panel */}
          {lifeEnergyDifference > 0 && (
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Munur í lífsorku</div>
              <div className="text-3xl font-bold text-purple-900 mb-2">
                {lifeEnergyDifference.toFixed(1)} klst
              </div>
              <div className="text-sm text-purple-600">
                meira frítíma á ævinni með bestu aðferðinni
              </div>
            </div>
          )}

          {/* Close call explanation */}
          {isCloseCall && (
            <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
              <p className="text-sm text-warning-800">
                <strong>Athugið:</strong> Aðferðirnar eru næstum jafn góðar. Veldu þá aðferð sem
                hentar þínum persónulegu óskum og áhættusækni best.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
