/**
 * LeanFIRECalculator - Main LeanFIRE calculator page component
 *
 * Coordinates:
 * - Hero section with title and intro
 * - Educational content about LeanFIRE concept
 * - Integration with expense baseline (barebones tier)
 * - Financial inputs (FI multiplier, savings, etc.)
 * - Geographic comparison (Reykjavík vs Landsbyggð)
 * - Expense reduction scenarios
 * - Frugality tips
 * - Results display
 */

'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Alert } from '@/components/ui/Alert';
import { LeanFIREInputs } from './LeanFIREInputs';
import { GeographicComparison } from './GeographicComparison';
import { ExpenseReductionPanel } from './ExpenseReductionPanel';
import { FrugalityTips } from './FrugalityTips';
import { LeanFIREResults } from './LeanFIREResults';
import { CostComparisonChart } from './CostComparisonChart';
import { TRMeansTestCalculator } from '@/components/shared/TRMeansTestCalculator';
import { EducationalIntro } from './EducationalIntro';

export interface LeanFIRECalculatorProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

export function LeanFIRECalculator({ onBack }: LeanFIRECalculatorProps = {}) {
  const {
    leanFire,
    leanFireResults,
    updateLeanFireState,
    initializeLeanFire,
    expenseBaselineResults,
  } = useCalculator();

  const [introCollapsed, setIntroCollapsed] = useState(true); // Start collapsed
  const [introDismissed, setIntroDismissed] = useState(false);
  const [occupationalPension, setOccupationalPension] = useState(0);

  // Initialize state if needed
  useEffect(() => {
    if (!leanFire) {
      initializeLeanFire();
    }
  }, [leanFire, initializeLeanFire]);

  // Loading state
  if (!leanFire) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-neutral-50">
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
  const hasResults = leanFireResults !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 py-12">
        <Container>
          {/* Back Button */}
          {onBack && (
            <div className="mb-6">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
              >
                <span>←</span>
                <span>Til baka í FIRE reiknivélalista</span>
              </button>
            </div>
          )}

          <div className="text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              <span className="text-2xl">🍃</span>
              <span>LeanFIRE</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lágmarks FIRE Reiknivél
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg text-gray-700">
              Náðu fjárhagslegu frelsi með lágmarksútgjöldum og einfaldleikanum
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8 space-y-8">
        {/* Educational Intro */}
        {!introDismissed && (
          <EducationalIntro
            collapsed={introCollapsed}
            onToggle={() => setIntroCollapsed(!introCollapsed)}
            onDismiss={() => setIntroDismissed(true)}
          />
        )}

        {/* Expense Baseline Info */}
        {!hasExpenseBaseline && (
          <Alert variant="info" title="Sjálfgefin gildi notuð">
            <p className="text-sm">
              Reiknivélin notar sjálfgefin lágmarksútgjöld fyrir Ísland (240.000 kr/mán).
              Þú getur breytt þessum gildum hér að neðan.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <em>Valfrjálst:</em> Fylltu út{' '}
              <a
                href="/utgjaldareiknivel"
                className="font-medium underline hover:no-underline"
              >
                Útgjaldagrunnlínu
              </a>{' '}
              til að fá persónuleg "barebones" útgjöld sjálfkrafa.
            </p>
          </Alert>
        )}

        {/* Basic Inputs */}
        <LeanFIREInputs />

        {/* TR Means-Test Calculator (Iceland pension planning) */}
        <TRMeansTestCalculator
          occupationalPension={occupationalPension}
          onOccupationalPensionChange={setOccupationalPension}
          showEducation={true}
          variant="compact"
        />

        {/* Results Display */}
        {hasResults && (
          <>
            <LeanFIREResults />

            {/* Cost Comparison Chart */}
            <CostComparisonChart />

            {/* Geographic Comparison */}
            <GeographicComparison />

            {/* Expense Reduction Scenarios - only show when using baseline/default expenses, not custom */}
            {leanFire.expenseSource !== 'custom' && <ExpenseReductionPanel />}

            {/* Frugality Tips */}
            <FrugalityTips />
          </>
        )}
      </Container>
    </div>
  );
}
