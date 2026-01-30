/**
 * BaristaFIRECard - Compact card for calculator navigation
 *
 * Displays:
 * - Icon and title
 * - Brief description
 * - Quick status if data exists
 * - Link to full calculator
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { useCalculator } from '@/context/CalculatorContext';
import { formatCurrency } from '@/lib/utils';

export function BaristaFIRECard() {
  const { baristaFireState, baristaFireResults } = useCalculator();

  const hasData = baristaFireState !== null;
  const hasResults = baristaFireResults !== null;
  const scenarioCount = baristaFireState?.scenarios.length || 0;

  // Get fastest scenario if results exist
  const fastestScenario =
    hasResults && baristaFireResults.scenarioResults.length > 0
      ? baristaFireResults.scenarioResults.reduce((fastest, current) => {
          const fastestMonths = fastest.yearsToFI * 12 + fastest.monthsToFI;
          const currentMonths = current.yearsToFI * 12 + current.monthsToFI;
          return currentMonths < fastestMonths ? current : fastest;
        })
      : null;

  return (
    <Link href="/barista-fire" className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-amber-300">
        <CardContent className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 text-4xl">☕</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                Kaffiþjóna FIRE
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Hlutastarf til að dekka útgjöld á meðan sparnaður vex
              </p>
            </div>
          </div>

          {/* Status/Quick Info */}
          {hasData ? (
            <div className="space-y-3">
              {/* Scenario Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Sviðsmyndir:</span>
                <span className="font-semibold text-neutral-900">
                  {scenarioCount} sviðsmynd{scenarioCount !== 1 ? 'ir' : ''}
                </span>
              </div>

              {/* Current Savings */}
              {baristaFireState.currentSavings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Núverandi sparnaður:</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(baristaFireState.currentSavings)}
                  </span>
                </div>
              )}

              {/* Fastest Timeline */}
              {fastestScenario && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mt-3">
                  <p className="text-xs text-amber-900 font-semibold mb-1">
                    Hraðasta sviðsmyndin
                  </p>
                  <p className="text-sm font-bold text-amber-700">
                    {fastestScenario.scenarioName}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {fastestScenario.yearsToFI} ár
                    {fastestScenario.monthsToFI > 0 &&
                      `, ${fastestScenario.monthsToFI} mán`}{' '}
                    til FI
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="pt-2">
                <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700">
                  Skoða nánar →
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600">
                Reiknaðu hversu lengi það tekur að ná FI með hlutastarfi sem dekkar útgjöld þín.
              </p>

              {/* Key Features */}
              <ul className="text-xs text-neutral-600 space-y-1 ml-4 list-disc">
                <li>Margir hlutastarf sviðsmyndir</li>
                <li>Tímalína til full FI</li>
                <li>Lífsorka útreikningar</li>
                <li>Samanburður við Coast FIRE</li>
              </ul>

              {/* CTA */}
              <div className="pt-2">
                <span className="text-sm font-semibold text-amber-600 group-hover:text-amber-700">
                  Byrja núna →
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
