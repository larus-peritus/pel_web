/**
 * CoastFIRECalculator - Main Page Component
 *
 * Orchestrates all Coast FIRE calculator sections into a complete calculator page.
 * Integrates with CalculatorContext for state management and localStorage persistence.
 *
 * Page Structure:
 * 1. Hero/Introduction
 * 2. Educational intro (collapsible)
 * 3. Baseline change notification (if applicable)
 * 4. Input section
 * 5. Results display
 * 6. Action buttons
 *
 * Epic 3, Task 3.1
 * Epic 6, Task 6.2: Auto-update on baseline changes
 */

'use client';

import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CoastFIREInputs } from './CoastFIREInputs';
import { CoastFIREResults } from './CoastFIREResults';
import { BaselineChangeNotification } from './BaselineChangeNotification';
import { EducationalIntro } from './EducationalIntro';
import {
  TRMeansTestCalculator,
  OccupationalPensionEstimator,
  SereignOptimizer,
  WithdrawalSequenceOptimizer,
  InflationStressTester,
  TaxPlanningCalculator,
  CurrencyRiskEducation,
} from '@/components/shared';
import { calculateCoastFIREResult } from '@/lib/calculations/coastFire';
import type { CoastFIREResult } from '@/types/coastFire';

export interface CoastFIRECalculatorProps {
  /** Optional: Show back button for integration in calculator hub */
  onBack?: () => void;
}

export function CoastFIRECalculator({ onBack }: CoastFIRECalculatorProps) {
  const {
    coastFireState,
    expenseBaseline,
    results,
    initializeCoastFireState,
  } = useCalculator();

  // Get actualHourlyWage from results
  const actualHourlyWage = results?.actualHourlyWage ?? null;

  // Iceland pension planning state
  const [showPensionPlanning, setShowPensionPlanning] = React.useState(false);
  const [yearsContributed, setYearsContributed] = React.useState(15);
  const [averageMonthlySalary, setAverageMonthlySalary] = React.useState(800000);
  const [occupationalPension, setOccupationalPension] = React.useState(0);
  const [currentSereignBalance, setCurrentSereignBalance] = React.useState(0);
  const [currentMonthlySalary, setCurrentMonthlySalary] = React.useState(800000);

  // Educational intro state (persisted in localStorage)
  const [introCollapsed, setIntroCollapsed] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('coastFire.introCollapsed');
      return stored === 'true';
    }
    return false;
  });

  const [introDismissed, setIntroDismissed] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('coastFire.introDismissed');
      return stored === 'true';
    }
    return false;
  });

  // Track previous baseline state for change detection
  const [showBaselineNotification, setShowBaselineNotification] = React.useState(false);
  const [previousFINumber, setPreviousFINumber] = React.useState<number | null>(null);
  const prevExpenseBaselineRef = React.useRef(expenseBaseline);

  // Initialize state if needed
  React.useEffect(() => {
    if (!coastFireState) {
      initializeCoastFireState();
    }
  }, [coastFireState, initializeCoastFireState]);

  // Detect expense baseline changes and show notification (Task 6.2)
  React.useEffect(() => {
    // Only track changes if using baseline mode
    if (
      coastFireState?.fiNumberSource === 'baseline' &&
      coastFireState.selectedTier &&
      expenseBaseline
    ) {
      const prevBaseline = prevExpenseBaselineRef.current;
      const currentFINumber = coastFireState.fiNumber;

      // Check if baseline actually changed (not just initial load)
      if (
        prevBaseline &&
        prevBaseline.lastUpdated !== expenseBaseline.lastUpdated &&
        currentFINumber !== null
      ) {
        // Baseline changed - show notification
        setShowBaselineNotification(true);
        setPreviousFINumber(previousFINumber ?? currentFINumber);
      }

      // Update ref
      prevExpenseBaselineRef.current = expenseBaseline;
    }
  }, [expenseBaseline, coastFireState, previousFINumber]);

  // Calculate results
  const result: CoastFIREResult | null = React.useMemo(() => {
    if (!coastFireState) return null;

    try {
      return calculateCoastFIREResult(
        coastFireState,
        actualHourlyWage ?? undefined
      );
    } catch (error) {
      console.error('Failed to calculate Coast FIRE results:', error);
      return null;
    }
  }, [coastFireState, actualHourlyWage]);

  /**
   * Toggle intro collapsed state
   */
  const handleToggleIntro = () => {
    const newState = !introCollapsed;
    setIntroCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('coastFire.introCollapsed', String(newState));
    }
  };

  /**
   * Dismiss intro permanently
   */
  const handleDismissIntro = () => {
    setIntroDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('coastFire.introDismissed', 'true');
    }
  };

  /**
   * Show intro again
   */
  const handleShowIntroAgain = () => {
    setIntroDismissed(false);
    setIntroCollapsed(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coastFire.introDismissed');
      localStorage.setItem('coastFire.introCollapsed', 'false');
    }
  };

  /**
   * Check if we have minimum required data
   */
  const hasMinimumData =
    coastFireState &&
    coastFireState.currentAge > 0 &&
    coastFireState.targetRetirementAge > coastFireState.currentAge &&
    coastFireState.fiNumber !== null &&
    coastFireState.fiNumber > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button (if integrated in calculator hub) */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              <span>←</span>
              <span>Til baka</span>
            </button>
          )}

          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 text-sm font-semibold text-blue-800">
              <span className="text-xl" role="img" aria-label="Coast FIRE">
                🏖️
              </span>
              <span>Sjálfvirkt FIRE</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Hvenær getur þú "coastað" til FI?
            </h1>
            <p className="mt-4 text-lg text-gray-700 sm:text-xl">
              Reiknaðu hvenær fjárfestingar þínar vaxa í FI-töluna án frekari innborgunar
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Educational Intro (Enhanced, Task 7.1) */}
          {!introDismissed ? (
            <EducationalIntro
              collapsed={introCollapsed}
              onToggle={handleToggleIntro}
              onDismiss={handleDismissIntro}
            />
          ) : (
            <div className="text-center">
              <Button variant="secondary" size="sm" onClick={handleShowIntroAgain}>
                📚 Sýna fræðsluhluta aftur
              </Button>
            </div>
          )}

          {/* Alert if expense baseline not set */}
          {!expenseBaseline && (
            <Alert variant="info">
              <div>
                <h3 className="font-semibold">Tip: Notaðu útgjaldagrunn</h3>
                <p className="mt-1 text-sm">
                  Ef þú setur upp <strong>útgjaldagrunn</strong> fyrst getur reiknivélin reiknað
                  FI-töluna þína sjálfvirkt út frá lífsstíl þínum.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    window.location.href = '/reiknivaelir?calc=utgjaldareiknivel';
                  }}
                >
                  Setja upp útgjaldagrunn
                </Button>
              </div>
            </Alert>
          )}

          {/* Baseline Change Notification (Task 6.2) */}
          {showBaselineNotification &&
            coastFireState?.selectedTier &&
            coastFireState?.fiNumber !== null && (
              <BaselineChangeNotification
                selectedTier={coastFireState.selectedTier}
                newFINumber={coastFireState.fiNumber}
                previousFINumber={previousFINumber}
                onDismiss={() => {
                  setShowBaselineNotification(false);
                  setPreviousFINumber(coastFireState.fiNumber);
                }}
              />
            )}

          {/* Input Section */}
          <CoastFIREInputs />

          {/* Results Section */}
          {hasMinimumData && result && coastFireState && coastFireState.fiNumber && (
            <CoastFIREResults
              result={result}
              currentAge={coastFireState.currentAge}
              currentInvestments={coastFireState.currentInvestments}
              targetRetirementAge={coastFireState.targetRetirementAge}
              fiNumber={coastFireState.fiNumber}
              expectedReturn={coastFireState.expectedReturn}
              actualHourlyWage={actualHourlyWage}
            />
          )}

          {/* Missing data prompt */}
          {!hasMinimumData && (
            <Alert variant="info">
              <p className="text-sm">
                Fylltu út alla reiti hér að ofan til að sjá niðurstöður.
              </p>
            </Alert>
          )}

          {/* Iceland Pension Planning Section */}
          {hasMinimumData && coastFireState && (
            <Card variant="elevated" className="border-2 border-primary-200">
              <CardHeader
                className="cursor-pointer bg-gradient-to-r from-primary-50 to-blue-50"
                onClick={() => setShowPensionPlanning(!showPensionPlanning)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-primary-900">
                        Íslensk lífeyrisáætlun
                      </h3>
                      <Badge variant="primary" size="sm">Ísland</Badge>
                    </div>
                    <p className="text-sm text-primary-700 mt-1">
                      Áætlaðu lífeyrissjóð, séreign og TR til að lækka FI-tölu þína
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={showPensionPlanning ? 'Loka' : 'Opna'}
                    aria-expanded={showPensionPlanning}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${showPensionPlanning ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>

              {showPensionPlanning && (
                <CardContent className="space-y-6 pt-6">
                  {/* Educational Alert */}
                  <Alert variant="info">
                    <div className="space-y-2">
                      <p className="font-semibold">Hvers vegna skipti íslenska lífeyriskerfið máli fyrir Coast FIRE?</p>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li><strong>Lífeyrissjóður:</strong> Heldur áfram að vaxa jafnvel eftir að þú hættir að greiða inn</li>
                        <li><strong>Séreign:</strong> Sameinar skattfrestun + hefur EKKI áhrif á TR</li>
                        <li><strong>TR lífeyrir:</strong> Ríkislífeyrir sem getur dekkað stóran hluta útgjalda eftir 67 ára</li>
                      </ul>
                    </div>
                  </Alert>

                  {/* Occupational Pension Estimator */}
                  <OccupationalPensionEstimator
                    currentAge={coastFireState.currentAge}
                    yearsContributed={yearsContributed}
                    averageMonthlySalary={averageMonthlySalary}
                    plannedRetirementAge={67}
                    onYearsContributedChange={setYearsContributed}
                    onAverageSalaryChange={setAverageMonthlySalary}
                    onPensionEstimateChange={setOccupationalPension}
                    compact
                  />

                  {/* Séreign Optimizer */}
                  <SereignOptimizer
                    currentAge={coastFireState.currentAge}
                    currentMonthlySalary={currentMonthlySalary}
                    currentSereignBalance={currentSereignBalance}
                    monthlyExpenses={coastFireState.fiNumber ? coastFireState.fiNumber / 30 / 12 : 500000}
                    onSalaryChange={setCurrentMonthlySalary}
                    onBalanceChange={setCurrentSereignBalance}
                    compact
                  />

                  {/* TR Means-Test Calculator */}
                  <TRMeansTestCalculator
                    occupationalPension={occupationalPension}
                    onOccupationalPensionChange={setOccupationalPension}
                    showEducation={true}
                    variant="compact"
                  />

                  {/* Summary */}
                  <Alert variant="success">
                    <div className="space-y-2">
                      <p className="font-semibold">Hvernig þetta tengist Coast FIRE:</p>
                      <p className="text-sm">
                        Með Coast FIRE hefur þú náð sparnaðarmarkmiði þínu og getur "coastað" -
                        þú þarft ekki að leggja meira inn, bara láta fjárfestingar vaxa.
                        Íslenska lífeyriskerfið gerir þetta enn betra vegna þess að lífeyrissjóður
                        þinn heldur áfram að vaxa og séreign getur verið brúin frá 60-67 án þess
                        að hafa áhrif á TR réttindi þín.
                      </p>
                    </div>
                  </Alert>

                  {/* Advanced Analysis - Phase 3 Components */}
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-4">Ítarleg greining</h4>

                    {/* Withdrawal Sequence Optimizer */}
                    <WithdrawalSequenceOptimizer
                      currentAge={coastFireState.currentAge}
                      retirementAge={coastFireState.targetRetirementAge}
                      monthlyExpenses={coastFireState.fiNumber ? coastFireState.fiNumber / 30 / 12 : 500000}
                      taxableBalance={coastFireState.currentInvestments * 0.5}
                      sereignBalance={currentSereignBalance}
                      occupationalPension={occupationalPension}
                      compact
                    />

                    {/* Tax Planning Calculator */}
                    <TaxPlanningCalculator
                      pensionIncome={occupationalPension}
                      sereignWithdrawal={0}
                      capitalGainsIncome={0}
                      trPension={0}
                      compact
                    />

                    {/* Inflation Stress Tester */}
                    <InflationStressTester
                      portfolioValue={coastFireState.fiNumber ?? 100000000}
                      annualExpenses={(coastFireState.fiNumber ?? 100000000) / 30}
                      currentAge={coastFireState.currentAge}
                      retirementAge={coastFireState.targetRetirementAge}
                      compact
                    />

                    {/* Currency Risk Education */}
                    <CurrencyRiskEducation
                      portfolioValue={coastFireState.fiNumber ?? 100000000}
                      annualExpenses={(coastFireState.fiNumber ?? 100000000) / 30}
                      travelBudgetPercent={10}
                      compact
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Privacy Notice */}
          <div className="rounded-lg bg-neutral-100 p-4 text-center">
            <p className="text-xs text-neutral-600">
              <strong>Persónuvernd:</strong> Allir útreikningar fara fram í vafranum þínum.
              Fjárhagsgögn þín eru geymd á þínu tæki og aldrei send á neinn netþjón.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
