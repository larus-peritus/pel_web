/**
 * CoastFIRECard Component
 *
 * Summary card for dashboard integration showing key Coast FIRE metrics.
 * Compact display with link to full calculator.
 *
 * Features:
 * - Key metrics at a glance
 * - Status indicator
 * - Link to full calculator
 * - Compact design for dashboard
 *
 * Epic 3, Task 3.5
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { CoastFIREResult, CoastFIREStatus } from '@/types/coastFire';

export interface CoastFIRECardProps {
  result: CoastFIREResult | null;
  onViewDetails?: () => void;
  className?: string;
}

/**
 * Get status badge variant
 */
const getStatusBadgeVariant = (
  status: CoastFIREStatus
): 'success' | 'info' | 'warning' => {
  switch (status) {
    case 'coasting':
      return 'success';
    case 'future':
      return 'info';
    case 'impossible':
      return 'warning';
  }
};

/**
 * Get status label in Icelandic
 */
const getStatusLabel = (status: CoastFIREStatus): string => {
  switch (status) {
    case 'coasting':
      return 'Á ró núna!';
    case 'future':
      return 'Ró framundan';
    case 'impossible':
      return 'Ómögulegt';
  }
};

/**
 * Get status icon
 */
const getStatusIcon = (status: CoastFIREStatus): string => {
  switch (status) {
    case 'coasting':
      return '🎉';
    case 'future':
      return '🎯';
    case 'impossible':
      return '⚠️';
  }
};

export function CoastFIRECard({ result, onViewDetails, className }: CoastFIRECardProps) {
  // If no result, show empty state
  if (!result) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">
              Sjálfvirkt FIRE
            </h3>
            <span className="text-2xl" role="img" aria-label="Coast FIRE">
              🏖️
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Engar niðurstöður enn. Byrjaðu að setja inn upplýsingar.
          </p>
          {onViewDetails && (
            <Button
              variant="primary"
              size="sm"
              onClick={onViewDetails}
              className="mt-4 w-full"
            >
              Opna reiknivél
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const {
    status,
    coastFireAge,
    yearsToCoast,
    gapToCoast,
    projectedBalance,
  } = result;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">
              Sjálfvirkt FIRE
            </h3>
            <Badge variant={getStatusBadgeVariant(status)} size="sm">
              {getStatusLabel(status)}
            </Badge>
          </div>
          <span className="text-2xl" role="img" aria-label={getStatusLabel(status)}>
            {getStatusIcon(status)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Coast Age or Years to Coast */}
          {status !== 'impossible' && (
            <div className="rounded-lg bg-primary-50 p-3">
              <p className="text-xs font-medium text-primary-900">
                {status === 'coasting' ? 'Núna!' : 'Sjálfvirkt FIRE aldur'}
              </p>
              <p className="mt-1 text-lg font-bold text-primary-700">
                {status === 'coasting'
                  ? '🎉'
                  : coastFireAge
                  ? `${Math.round(coastFireAge)} ára`
                  : '—'}
              </p>
            </div>
          )}

          {/* Gap to Coast (if applicable) */}
          {status === 'future' && gapToCoast !== null && gapToCoast > 0 && (
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-900">
                Vantar
              </p>
              <p className="mt-1 text-base font-bold text-amber-700">
                {formatCurrency(gapToCoast)}
              </p>
            </div>
          )}

          {/* Projected Balance */}
          <div
            className={cn(
              'rounded-lg p-3',
              status === 'impossible' ? 'bg-red-50' : 'bg-neutral-50'
            )}
          >
            <p
              className={cn(
                'text-xs font-medium',
                status === 'impossible' ? 'text-red-900' : 'text-neutral-900'
              )}
            >
              Við starfslok
            </p>
            <p
              className={cn(
                'mt-1 text-base font-bold',
                status === 'impossible' ? 'text-red-700' : 'text-neutral-900'
              )}
            >
              {formatCurrency(projectedBalance)}
            </p>
          </div>

          {/* Time to Coast (if future) */}
          {status === 'future' && yearsToCoast !== null && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-900">
                Ár til róar
              </p>
              <p className="mt-1 text-lg font-bold text-blue-700">
                {yearsToCoast.toFixed(1)}
              </p>
            </div>
          )}
        </div>

        {/* Summary message */}
        <p className="text-xs text-neutral-600">
          {status === 'coasting' &&
            'Þú hefur náð Sjálfvirkt FIRE! Fjárfestingar þínar vaxa í FI-töluna án frekari sparnaðar.'}
          {status === 'future' &&
            `Þú munt ná Sjálfvirkt FIRE við ${Math.round(coastFireAge ?? 0)} ára aldur. Haltu áfram!`}
          {status === 'impossible' &&
            'Með núverandi forsendum er Sjálfvirkt FIRE ómögulegt. Skoðaðu breytingar.'}
        </p>

        {/* View details button */}
        {onViewDetails && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onViewDetails}
            className="w-full"
          >
            Sjá nánar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
