/**
 * BaristaFIRECalculator - Main Barista FIRE calculator page component
 *
 * Coordinates:
 * - Hero section with title
 * - Educational intro (collapsible)
 * - Integration with expense baseline
 * - Financial inputs
 * - Scenario management
 * - Results display
 * - Timeline visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Alert } from '@/components/ui/Alert';
import { BaristaFIREInputs } from './BaristaFIREInputs';
import { ScenarioManager } from './ScenarioManager';
import { BaristaFIREResults } from './BaristaFIREResults';
import { TimelineChart } from './TimelineChart';
import { EducationalIntro } from './EducationalIntro';
import { TRMeansTestCalculator, WageExemptionCalculator } from '@/components/shared';

export interface BaristaFIRECalculatorProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

export function BaristaFIRECalculator({ onBack }: BaristaFIRECalculatorProps = {}) {
  const {
    baristaFireState,
    baristaFireResults,
    updateBaristaFireState,
    addBaristaFireScenario,
    updateBaristaFireScenario,
    removeBaristaFireScenario,
    initializeBaristaFireState,
    expenseBaseline,
    expenseBaselineResults,
  } = useCalculator();

  const [introCollapsed, setIntroCollapsed] = useState(true); // Start collapsed
  const [introDismissed, setIntroDismissed] = useState(false);
  const [occupationalPension, setOccupationalPension] = useState(0);
  const [monthlyWages, setMonthlyWages] = useState(150000); // Default to under exemption

  // Initialize state if needed
  useEffect(() => {
    if (!baristaFireState) {
      initializeBaristaFireState();
    }
  }, [baristaFireState, initializeBaristaFireState]);

  // Loading state
  if (!baristaFireState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-50">
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
  const hasResults = baristaFireResults !== null;
  const hasScenarios = baristaFireState.scenarios.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 py-12">
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
              <span className="text-2xl">☕</span>
              <span>Kaffiþjóna FIRE</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              Kaffiþjóna FIRE Reiknivél
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
              Reiknaðu hvenær þú getur unnið hlutastarf og látið fjárfestingar vaxa að fullu FI
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-8 space-y-8">
          {/* Educational Intro */}
          {!introDismissed && (
            <EducationalIntro
              collapsed={introCollapsed}
              onToggle={() => setIntroCollapsed(!introCollapsed)}
              onDismiss={() => setIntroDismissed(true)}
            />
          )}

          {/* Expense Baseline Integration Check */}
          {!hasExpenseBaseline && (
            <Alert variant="info">
              <p className="font-semibold mb-1">
                Sláðu inn mánaðarleg útgjöld
              </p>
              <p className="text-sm">
                Sláðu inn mánaðarleg útgjöld þín hér að neðan til að reikna út FI tölu.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <em>Valfrjálst:</em> Notaðu{' '}
                <a
                  href="/utgjaldareiknivel"
                  className="font-semibold underline hover:text-primary-700"
                >
                  Útgjaldagrunnstofa
                </a>{' '}
                til að fá nákvæmari grunnútgjöld sjálfkrafa.
              </p>
            </Alert>
          )}

          {/* Financial Inputs */}
          <BaristaFIREInputs
            currentSavings={baristaFireState.currentSavings}
            selectedTier={baristaFireState.selectedTier}
            customMonthlyExpense={baristaFireState.customMonthlyExpense}
            investmentReturnRate={baristaFireState.investmentReturnRate}
            fiMultiplier={baristaFireState.fiMultiplier}
            currentAge={baristaFireState.currentAge}
            expenseBaselineResults={expenseBaselineResults}
            onCurrentSavingsChange={(value) =>
              updateBaristaFireState({ currentSavings: value })
            }
            onTierChange={(tier) =>
              updateBaristaFireState({ selectedTier: tier })
            }
            onCustomExpenseChange={(value) =>
              updateBaristaFireState({ customMonthlyExpense: value })
            }
            onReturnRateChange={(value) =>
              updateBaristaFireState({ investmentReturnRate: value })
            }
            onFIMultiplierChange={(value) =>
              updateBaristaFireState({ fiMultiplier: value })
            }
            onCurrentAgeChange={(value) =>
              updateBaristaFireState({ currentAge: value })
            }
          />

          {/* TR Means-Test Calculator (Iceland pension planning) */}
          <TRMeansTestCalculator
            occupationalPension={occupationalPension}
            onOccupationalPensionChange={setOccupationalPension}
            showEducation={true}
            variant="compact"
          />

          {/* Wage Exemption Calculator (Barista FIRE specific) */}
          <WageExemptionCalculator
            monthlyWages={monthlyWages}
            occupationalPension={occupationalPension}
            onWagesChange={setMonthlyWages}
            onOccupationalPensionChange={setOccupationalPension}
            compact={true}
          />

          {/* Scenario Manager */}
          <ScenarioManager
            scenarios={baristaFireState.scenarios}
            scenarioResults={baristaFireResults?.scenarioResults}
            onAddScenario={addBaristaFireScenario}
            onUpdateScenario={updateBaristaFireScenario}
            onDeleteScenario={removeBaristaFireScenario}
          />

          {/* Results */}
          {hasResults && hasScenarios && (
            <>
              <BaristaFIREResults results={baristaFireResults} />
              <TimelineChart results={baristaFireResults} />
            </>
          )}

          {/* No Results Yet */}
          {!hasResults && hasScenarios && (
            <Alert variant="info">
              <p className="font-semibold mb-1">
                Settu inn laun sviðsmyndar
              </p>
              <p className="text-sm">
                Sláðu inn brúttótekjur fyrir að minnsta kosti eina sviðsmynd til að sjá niðurstöður.
              </p>
            </Alert>
          )}

          {/* Expense Reduction Suggestion */}
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-3xl">💡</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  Viltu byrja fyrr á Kaffiþjóna FIRE?
                </h3>
                <p className="text-sm text-amber-800 mb-4">
                  Með því að lækka mánaðarleg útgjöld þín getur þú náð Kaffiþjóna FIRE fyrr —
                  og þarft minna hlutastarf til að standa undir lífinu. Minni útgjöld þýðir
                  lægri FI tölu og styttri tíma til markmiðs.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/utgjaldareiknivel"
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                  >
                    <span>📊</span>
                    <span>Útgjaldagrunnstofa</span>
                  </a>
                  <a
                    href="/cut-impact"
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50"
                  >
                    <span>✂️</span>
                    <span>Niðurskurðarreiknivél</span>
                  </a>
                  <a
                    href="/leanfire"
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50"
                  >
                    <span>🌿</span>
                    <span>LeanFIRE skipulag</span>
                  </a>
                </div>
                <p className="text-xs text-amber-600 mt-3">
                  Dæmi: Ef þú lækkar útgjöld um 50.000 kr/mán, lækkar FI talan þín um 15-20 milljónir
                  og þú gætir náð markmiði 2-4 árum fyrr.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
