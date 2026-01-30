/**
 * FatFIRECalculator - Main FatFIRE calculator page component
 *
 * Coordinates:
 * - Hero section with title "Lúxus FIRE Áætlun"
 * - Educational intro explaining FatFIRE philosophy
 * - Integration with expense baseline (deluxe tier)
 * - Premium purple/gold theme
 * - All sub-components for inputs, wish list, results
 */

'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Alert } from '@/components/ui/Alert';
import { FatFIREInputs } from './FatFIREInputs';
import { WishListBuilder } from './WishListBuilder';
import { SplurgeBudget } from './SplurgeBudget';
import { FatFIREResults } from './FatFIREResults';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { MilestoneTracker } from './MilestoneTracker';
import { TimelineProjection } from './TimelineProjection';

export interface FatFIRECalculatorProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

export function FatFIRECalculator({ onBack }: FatFIRECalculatorProps = {}) {
  const {
    fatFireState,
    fatFireResults,
    updateFatFireState,
    initializeFatFireState,
    expenseBaselineResults,
    results,
  } = useCalculator();

  const [showIntro, setShowIntro] = useState(true);

  // Initialize state if needed
  useEffect(() => {
    if (!fatFireState) {
      initializeFatFireState();
    }
  }, [fatFireState, initializeFatFireState]);

  // Loading state
  if (!fatFireState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-50">
        <Container>
          <div className="py-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-12 w-96 rounded bg-amber-200" />
              <div className="mx-auto h-6 w-[500px] rounded bg-gray-200" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const hasExpenseBaseline = expenseBaselineResults !== null;
  const hasResults = fatFireResults !== null;
  const actualHourlyWage = results?.actualHourlyWage ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 py-12">
        <Container>
          {/* Back Button */}
          {onBack && (
            <div className="mb-6">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                <span>←</span>
                <span>Til baka í FIRE reiknivélalista</span>
              </button>
            </div>
          )}

          <div className="text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
              <span className="text-2xl">💎</span>
              <span>FatFIRE</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lúxus FIRE Áætlun
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Skipuleggðu eftirlaunaárin með lúxus lífsstíl - engir málamiðlanir, algjört frelsi
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-12">
        <div className="space-y-8">
          {/* Educational Introduction */}
          {showIntro && (
            <Alert
              variant="info"
              onDismiss={() => setShowIntro(false)}
              className="border-amber-200 bg-amber-50"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-900">
                  Hvað er FatFIRE? 💰
                </h3>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>
                    <strong>FatFIRE</strong> er Financial Independence með{' '}
                    <em>framúrskarandi lífsstíl</em>. Þetta er ekki um
                    sparnaðarbúskap - það er um að lifa fullkomlega án
                    fjárhagslegra áhyggna.
                  </p>
                  <ul className="ml-5 list-disc space-y-1">
                    <li>
                      <strong>Lúxus grunnútgjöld:</strong> Premium húsnæði,
                      ferðir, upplifanir
                    </li>
                    <li>
                      <strong>Óskarlisti:</strong> Byggðu lista yfir lífsstíl
                      draumana þinna
                    </li>
                    <li>
                      <strong>Aukaútgjaldaáætlun:</strong> Árleg áætlun fyrir
                      sjálfsprottnar lúxusvörur
                    </li>
                    <li>
                      <strong>Öruggt:</strong> 30x margfaldari (3.33% úttekt)
                      fyrir hámarks öryggi
                    </li>
                  </ul>
                  <p className="pt-2 text-xs">
                    💡 <em>FatFIRE krefst meiri sparnaðar en veitir fullkomna
                    lífsstílsfrelsi</em>
                  </p>
                </div>
              </div>
            </Alert>
          )}

          {/* Info if no expense baseline */}
          {!hasExpenseBaseline && (
            <Alert variant="info">
              <p className="text-sm">
                Sláðu inn lúxusútgjöld þín í <strong>Grunnstillingar</strong> hér að neðan.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <em>Valfrjálst:</em> Fylltu út{' '}
                <a
                  href="/utgjaldareiknivel"
                  className="underline hover:no-underline"
                >
                  Útgjaldareiknitólið
                </a>{' '}
                til að fá Lúxus-stig sjálfkrafa.
              </p>
            </Alert>
          )}

          {/* Base Inputs */}
          <FatFIREInputs />

          {/* Wish List Builder */}
          <WishListBuilder />

          {/* Splurge Budget */}
          <SplurgeBudget />

          {/* Results Section */}
          {hasResults && fatFireResults && (
            <>
              {/* Main Results */}
              <FatFIREResults />

              {/* Expense Breakdown Chart */}
              <ExpenseBreakdownChart />

              {/* Timeline Projection */}
              {fatFireResults.hasTimelineData && fatFireResults.timeline && (
                <TimelineProjection />
              )}

              {/* Milestone Tracker */}
              {fatFireResults.milestones.length > 0 && (
                <MilestoneTracker />
              )}
            </>
          )}

          {/* Educational Footer */}
          <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-amber-900">
              💡 FatFIRE vs önnur FIRE-aðferðir
            </h3>
            <div className="space-y-2 text-sm text-amber-800">
              <p>
                <strong>LeanFIRE:</strong> Lágmarks útgjöld, náð fljótt (
                <a href="/leanfire" className="underline hover:no-underline">
                  sjá LeanFIRE reiknivél
                </a>
                )
              </p>
              <p>
                <strong>BaristaFIRE:</strong> Hlutastarf eftir að náð er
                delvis FI (
                <a
                  href="/baristafire"
                  className="underline hover:no-underline"
                >
                  sjá BaristaFIRE reiknivél
                </a>
                )
              </p>
              <p>
                <strong>FatFIRE:</strong> Lúxus lífsstíl, engir málamiðlanir -
                þarfnast mest sparnaðar
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
