'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { getSuccessRateLevel, SUCCESS_RATE_LABELS, SUCCESS_RATE_COLORS } from '@/lib/constants/retirementSimulator';

export interface RetirementSimulatorCardProps {
  successProbability?: number;
  hasResults?: boolean;
}

/**
 * Retirement Simulator Card for Calculator Hub
 *
 * Shows quick status if simulation results exist:
 * - Success probability badge
 * - Quick link to full calculator
 * - Monte Carlo simulation indicator
 *
 * If no results, shows intro and call-to-action.
 */
export function RetirementSimulatorCard({
  successProbability,
  hasResults = false,
}: RetirementSimulatorCardProps) {
  const level = successProbability ? getSuccessRateLevel(successProbability) : null;
  const label = level ? SUCCESS_RATE_LABELS[level] : null;
  const colors = level ? SUCCESS_RATE_COLORS[level] : null;

  return (
    <Link href="/eftirlaunahermir" className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Eftirlaunahermir
                </h3>
                <p className="text-sm text-neutral-600">
                  Monte Carlo hermun
                </p>
              </div>
            </div>
            {hasResults && successProbability !== undefined && level && (
              <span className={`inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full border ${colors?.bg} ${colors?.text} ${colors?.border}`}>
                {(successProbability * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-700 mb-4">
            Mettu líkur á árangri eftirlaunaplansins þíns með Monte Carlo hermun.
            Tekur tillit til markaðssveifla, verðbólgu og íslensks lífeyriskerfis.
          </p>

          {/* Results Summary or CTA */}
          {hasResults && successProbability !== undefined && label ? (
            <div className="bg-neutral-50 rounded-lg p-3 space-y-1">
              <div className="text-xs text-neutral-600">Árangurslíkur:</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-neutral-900">
                  {(successProbability * 100).toFixed(1)}%
                </span>
                <span className="text-sm text-neutral-600">({label})</span>
              </div>
            </div>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                Keyra þúsundir atburðarása til að áætla hversu líklegt er að
                eignasafnið endist alla eftirlaun.
              </p>
            </div>
          )}

          {/* Features */}
          <div className="mt-4 space-y-1 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Margfaldar úttektarstefnur</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Lífeyrissjóður og ellilífeyrir</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Viðkvæmnigreining</span>
            </div>
          </div>

          {/* View Calculator Link */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
              {hasResults ? 'Skoða niðurstöður →' : 'Byrja hermun →'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
