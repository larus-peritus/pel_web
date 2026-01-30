/**
 * RecommendationPanel - Display smart recommendations based on expense patterns
 *
 * Features:
 * - Display 1-4 recommendations
 * - Priority-based ordering (high, medium, low)
 * - Recommendation card with icon, title, message
 * - Action button (link to calculator)
 * - Dismissable recommendations (local state)
 */

import React, { useState } from 'react';
import type { Recommendation } from '@/types/currentExpenses';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export interface RecommendationPanelProps {
  recommendations: Recommendation[];
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onDismiss: () => void;
}

// Icons for recommendation types
const RECOMMENDATION_ICONS: Record<Recommendation['type'], string> = {
  subscription: '📱',
  commute: '🚗',
  housing: '🏠',
  baseline: '📊',
  essential: '⚖️',
  dining: '🍽️',
  convenience: '☕',
};

// Priority styling
const PRIORITY_STYLES: Record<Recommendation['priority'], string> = {
  high: 'border-l-4 border-l-red-500 bg-red-50',
  medium: 'border-l-4 border-l-amber-500 bg-amber-50',
  low: 'border-l-4 border-l-blue-500 bg-blue-50',
};

// Priority labels
const PRIORITY_LABELS: Record<Recommendation['priority'], string> = {
  high: 'Mikilvægt',
  medium: 'Athugavert',
  low: 'Ábending',
};

function RecommendationCard({ recommendation, onDismiss }: RecommendationCardProps) {
  const icon = RECOMMENDATION_ICONS[recommendation.type];
  const priorityStyle = PRIORITY_STYLES[recommendation.priority];
  const priorityLabel = PRIORITY_LABELS[recommendation.priority];

  return (
    <Card variant="outlined" className={priorityStyle}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-3xl flex-shrink-0">
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Priority badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white border border-neutral-200">
                {priorityLabel}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-semibold text-neutral-900 mb-1">
              {recommendation.title}
            </h4>

            {/* Message */}
            <p className="text-sm text-neutral-700 mb-3">
              {recommendation.message}
            </p>

            {/* Actions */}
            {(recommendation.actionUrl || recommendation.dismissable) && (
              <div className="flex items-center gap-2">
                {recommendation.actionUrl && recommendation.actionLabel && (
                  <Link href={recommendation.actionUrl}>
                    <Button
                      variant="primary"
                      size="sm"
                    >
                      {recommendation.actionLabel}
                    </Button>
                  </Link>
                )}

                {recommendation.dismissable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                  >
                    Hunsa
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * RecommendationPanel - Display list of recommendations
 */
export function RecommendationPanel({
  recommendations,
}: RecommendationPanelProps) {
  // Track dismissed recommendations (local state only, not persisted)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Filter out dismissed recommendations
  const visibleRecommendations = recommendations.filter(
    rec => !dismissedIds.has(rec.id)
  );

  // Limit to top 4 recommendations
  const displayedRecommendations = visibleRecommendations.slice(0, 4);

  if (displayedRecommendations.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        Tillögur
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRecommendations.map(recommendation => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onDismiss={() => handleDismiss(recommendation.id)}
          />
        ))}
      </div>
    </div>
  );
}
