/**
 * PensionAwareFIRECalculator - Main Pension-Aware FIRE calculator page component
 *
 * Coordinates:
 * - Hero section with title and intro
 * - Educational content about pension-aware FI concept
 * - Integration with expense baseline (all three tiers)
 * - Financial inputs (age, expenses, savings)
 * - Pension inputs (lífeyrissjóður, séreign, TR)
 * - Phase timeline visualization
 * - FI number comparison (traditional vs pension-adjusted)
 * - Phase-by-phase breakdown
 * - Scenario comparison (up to 3 scenarios)
 * - Results display
 */

'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Alert } from '@/components/ui/Alert';
import { PensionEducationalIntro } from './PensionEducationalIntro';
import { BasicInputs } from './BasicInputs';
import { PensionInputs } from './PensionInputs';
import { PhaseTimeline } from './PhaseTimeline';
import { FINumberComparison } from './FINumberComparison';
import { GoalGapAnalysis } from './GoalGapAnalysis';
import { PhaseBreakdown } from './PhaseBreakdown';
import { ScenarioComparison } from './ScenarioComparison';

export interface PensionAwareFIRECalculatorProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

export function PensionAwareFIRECalculator({ onBack }: PensionAwareFIRECalculatorProps = {}) {
  const {
    pensionAwareFire,
    pensionAwareFireResults,
    initializePensionAwareFire,
    expenseBaselineResults,
  } = useCalculator();

  const [introCollapsed, setIntroCollapsed] = useState(true); // Start collapsed
  const [introDismissed, setIntroDismissed] = useState(false);

  // Initialize state if needed
  useEffect(() => {
    if (!pensionAwareFire) {
      initializePensionAwareFire();
    }
  }, [pensionAwareFire, initializePensionAwareFire]);

  // Loading state
  if (!pensionAwareFire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-neutral-50">
        <Container>
          <div className="py-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-12 w-96 rounded bg-gray-200" />
              <div className="mx-auto h-6 w-[500px] rounded bg-gray-200" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const hasExpenseBaseline = expenseBaselineResults !== null;
  const hasResults = pensionAwareFireResults !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 py-12">
        <Container>
          {/* Back Button */}
          {onBack && (
            <div className="mb-6">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors"
              >
                <span>←</span>
                <span>Til baka í FIRE reiknivélalista</span>
              </button>
            </div>
          )}

          <div className="text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              <span className="text-2xl">🎯</span>
              <span>Lífeyristengd FIRE</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lífeyristengd FIRE Reiknivél
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg text-gray-700">
              Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8 space-y-8">
        {/* Educational Intro */}
        {!introDismissed && (
          <PensionEducationalIntro
            collapsed={introCollapsed}
            onToggle={() => setIntroCollapsed(!introCollapsed)}
            onDismiss={() => setIntroDismissed(true)}
          />
        )}

        {/* Expense Baseline Status Alert */}
        {!hasExpenseBaseline ? (
          <Alert variant="info" title="Sjálfgefin gildi notuð">
            <p className="text-sm">
              Reiknivélin notar sjálfgefin útgjöld fyrir Ísland (300.000 kr/mán).
              Þú getur breytt þessum gildum hér að neðan eða valið þrjár mismunandi
              lífsstílsstigsútgáfur.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <em>Valfrjálst:</em> Fylltu út{' '}
              <a
                href="/utgjaldareiknivel"
                className="font-medium underline hover:no-underline"
              >
                Útgjaldagrunnlínu
              </a>{' '}
              til að fá persónuleg útgjöld sjálfkrafa fyrir allar þrjár útgáfur
              (barebones, comfortable, deluxe).
            </p>
          </Alert>
        ) : (
          <Alert variant="success" title="Tengd við útgjaldagrunnlínu">
            <p className="text-sm">
              Útgjaldagildi eru sjálfkrafa tengd við þína{' '}
              <a
                href="/utgjaldareiknivel"
                className="font-medium underline hover:no-underline"
              >
                útgjaldagrunnlínu
              </a>
              . Þú getur valið milli þriggja útgáfna (barebones, comfortable, deluxe)
              eða slökkva á tengingu og slá inn handvirkt.
            </p>
          </Alert>
        )}

        {/* Basic Inputs */}
        <BasicInputs />

        {/* Pension Inputs */}
        <PensionInputs />

        {/* Results Section (only show when hasResults) */}
        {hasResults && (
          <>
            {/* FI Number Comparison */}
            <FINumberComparison />

            {/* Goal Gap Analysis - Savings Projection */}
            <GoalGapAnalysis />

            {/* Phase Timeline */}
            <PhaseTimeline />

            {/* Phase Breakdown */}
            <PhaseBreakdown />

            {/* Scenario Comparison */}
            <ScenarioComparison />
          </>
        )}
      </Container>
    </div>
  );
}
