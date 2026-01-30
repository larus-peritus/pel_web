/**
 * RecommendationCard Component
 *
 * Displays a single FIRE type recommendation with:
 * - FIRE type name, icon, and color-coded styling
 * - Score display (0-100)
 * - Confidence level (high/medium/low)
 * - Reasoning list (why this type fits)
 * - Action steps list (what to do)
 * - Timeline summary string
 * - Obstacles/warnings list
 * - "Select this type" button
 * - Visual ranking badges for top 3 (gold/silver/bronze)
 * - Card layout with type-specific color accent
 *
 * Used in RecommendationsSection to display personalized FIRE type recommendations.
 */

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { FIRERecommendation, FIRECalculation } from '@/types/fireTypes';
import { getFIRETypeDefinition, getFIRETypeColors } from '@/lib/constants/fireTypes';
import { generateActionSteps, generateTimelineString, generateObstacles } from '@/lib/calculations/fireTypes';

/**
 * Props for RecommendationCard
 */
export interface RecommendationCardProps {
  /** Recommendation data with score, confidence, reasons, etc. */
  recommendation: FIRERecommendation;
  /** Full calculation data for this FIRE type */
  calculation: FIRECalculation;
  /** Callback when user selects this FIRE type */
  onSelect: (fireTypeId: string) => void;
  /** Whether this is the top recommendation (larger, more prominent) */
  isTopRecommendation?: boolean;
  /** Optional custom className */
  className?: string;
}

/**
 * Get ranking badge for top 3 recommendations
 */
const getRankingBadge = (rank: number): { emoji: string; label: string; variant: 'success' | 'warning' | 'info' } | null => {
  switch (rank) {
    case 1:
      return { emoji: '🥇', label: 'Besta valkosturinn', variant: 'success' };
    case 2:
      return { emoji: '🥈', label: 'Góður valkostur', variant: 'info' };
    case 3:
      return { emoji: '🥉', label: 'Sæmilegur valkostur', variant: 'warning' };
    default:
      return null;
  }
};

/**
 * Get confidence badge label and variant
 */
const getConfidenceBadge = (confidence: FIRERecommendation['confidence']): { label: string; variant: 'success' | 'warning' | 'neutral' } => {
  switch (confidence) {
    case 'high':
      return { label: 'Mikil vissa', variant: 'success' };
    case 'medium':
      return { label: 'Miðlungs vissa', variant: 'warning' };
    case 'low':
      return { label: 'Lítil vissa', variant: 'neutral' };
  }
};

/**
 * RecommendationCard Component
 */
export function RecommendationCard({
  recommendation,
  calculation,
  onSelect,
  isTopRecommendation = false,
  className,
}: RecommendationCardProps) {
  const definition = getFIRETypeDefinition(recommendation.fireTypeId);
  const colors = getFIRETypeColors(recommendation.fireTypeId);
  const rankingBadge = getRankingBadge(recommendation.rank);
  const confidenceBadge = getConfidenceBadge(recommendation.confidence);
  const actionSteps = generateActionSteps(calculation);
  const timelineString = generateTimelineString(calculation);
  const obstacles = recommendation.warnings;

  return (
    <Card
      variant="elevated"
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        isTopRecommendation && 'ring-2 ring-primary-500 ring-offset-2',
        className
      )}
    >
      {/* Header with type name, icon, and badges */}
      <CardHeader
        className={cn(
          'border-l-4',
          colors.bg,
          colors.border,
          'border-b border-neutral-200'
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Icon and Name */}
          <div className="flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label={definition.nameIs}>
              {definition.icon}
            </span>
            <div>
              <h3 className={cn('text-xl font-bold', colors.text)}>
                {definition.nameIs}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                {definition.tagline}
              </p>
            </div>
          </div>

          {/* Right: Ranking Badge */}
          {rankingBadge && (
            <Badge variant={rankingBadge.variant} size="md" className="shrink-0">
              <span className="mr-1">{rankingBadge.emoji}</span>
              {rankingBadge.label}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-6 py-6">
        {/* Score and Confidence */}
        <div className="flex items-center gap-4">
          {/* Score Display */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className={cn('text-4xl font-bold', colors.text)}>
                {recommendation.score}
              </span>
              <span className="text-lg text-neutral-600">/100</span>
            </div>
            <p className="text-sm text-neutral-600 mt-1">Samsvörunarskor</p>
          </div>

          {/* Confidence Badge */}
          <div>
            <Badge variant={confidenceBadge.variant} size="md">
              {confidenceBadge.label}
            </Badge>
          </div>
        </div>

        {/* Timeline Summary */}
        {timelineString && (
          <div className={cn('p-4 rounded-lg', colors.bg)}>
            <div className="flex items-start gap-3">
              <span className="text-2xl" role="img" aria-label="Tímalína">
                ⏱️
              </span>
              <div>
                <h4 className="font-semibold text-neutral-900">Tímalína</h4>
                <p className="text-sm text-neutral-700 mt-1">{timelineString}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reasoning - Why this fits */}
        {recommendation.reasons.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <span role="img" aria-label="Ástæður">✓</span>
              Hvers vegna þetta hentar þér
            </h4>
            <ul className="space-y-2">
              {recommendation.reasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className={cn('shrink-0 w-1.5 h-1.5 rounded-full mt-1.5', colors.accent)} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Steps */}
        {actionSteps.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <span role="img" aria-label="Skref">🎯</span>
              Næstu skref
            </h4>
            <ol className="space-y-2">
              {actionSteps.map((step, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-neutral-700"
                >
                  <span className={cn(
                    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
                    colors.accent
                  )}>
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Obstacles/Warnings */}
        {obstacles.length > 0 && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <h4 className="font-semibold text-warning-900 mb-3 flex items-center gap-2">
              <span role="img" aria-label="Áskoranir">⚠️</span>
              Áskoranir og atriði til að hafa í huga
            </h4>
            <ul className="space-y-2">
              {obstacles.map((obstacle, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-warning-800"
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-warning-500 mt-1.5" />
                  <span>{obstacle}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      {/* Footer with Select button */}
      <CardFooter className="border-t border-neutral-200 py-4">
        <Button
          variant="primary"
          size={isTopRecommendation ? 'lg' : 'md'}
          onClick={() => onSelect(recommendation.fireTypeId)}
          className={cn(
            'w-full',
            isTopRecommendation && 'shadow-md hover:shadow-lg'
          )}
        >
          Velja þessa leið
        </Button>
      </CardFooter>
    </Card>
  );
}
