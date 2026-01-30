/**
 * BaselineComparisonView - Container for baseline comparison display
 *
 * Shows:
 * - Tier match indicator with three tier buttons
 * - Overall difference from closest tier
 * - Category-by-category comparison table
 * - Overspending highlights and suggestions
 *
 * Only renders if baseline comparison data exists.
 */

import React from 'react';
import type { BaselineComparisonData } from '@/types/currentExpenses';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TierMatchIndicator } from './TierMatchIndicator';
import { CategoryComparisonTable } from './CategoryComparisonTable';
import { OverspendingHighlights } from './OverspendingHighlights';

export interface BaselineComparisonViewProps {
  baselineComparison: BaselineComparisonData | null;
}

/**
 * BaselineComparisonView - Full comparison display container
 */
export function BaselineComparisonView({
  baselineComparison,
}: BaselineComparisonViewProps) {
  // Don't render if no baseline exists
  if (!baselineComparison) {
    return (
      <Card variant="outlined" className="bg-neutral-50">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">
            Engin útgjaldaáætlun til samanburðar
          </h3>
          <p className="text-neutral-600 mb-4">
            Búðu til útgjaldaáætlun í Útgjaldareikni til að bera saman við raunveruleg útgjöld.
          </p>
          <a
            href="/utgjaldareiknivel"
            className="inline-block text-primary-600 hover:text-primary-700 font-medium hover:underline"
          >
            Fara í Útgjaldareikni →
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier Match Indicator */}
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Samanburður við útgjaldaáætlun
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Hvernig standast núverandi útgjöld samanborið við áætlaðar lífstílsþrep?
          </p>
        </CardHeader>
        <CardContent>
          <TierMatchIndicator baselineComparison={baselineComparison} />
        </CardContent>
      </Card>

      {/* Overspending Highlights (if any categories are over) */}
      <OverspendingHighlights baselineComparison={baselineComparison} />

      {/* Category Comparison Table */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-800">
            Samanburður eftir flokkum
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Ítarleg greining á hverjum útgjaldaflokki miðað við áætlun
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <CategoryComparisonTable baselineComparison={baselineComparison} />
        </CardContent>
      </Card>
    </div>
  );
}
