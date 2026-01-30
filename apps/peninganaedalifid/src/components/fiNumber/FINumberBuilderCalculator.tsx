'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThreePhasePlanningSection } from './ThreePhasePlanningSection';
import { ExpenseSourceSelector } from './ExpenseSourceSelector';
import { MultiplierSelector } from './MultiplierSelector';
import { PensionIncomeSection } from './PensionIncomeSection';
import { ResultsDisplay } from './ResultsDisplay';
import { ScenarioComparison } from './ScenarioComparison';
import {
  WithdrawalSequenceOptimizer,
  InflationStressTester,
  TaxPlanningCalculator,
  CurrencyRiskEducation,
} from '@/components/shared';

/**
 * FI Number Builder Calculator (FI-tala reiknivél)
 *
 * Main page-level component for calculating Financial Independence target nest egg.
 * Integrates with Expense Baseline Tool and Actual Hourly Wage Calculator.
 *
 * Features:
 * - Calculate FI number from expense baseline or custom input
 * - Choose standard multipliers (25x, 30x, 33x) or custom
 * - Icelandic context: Conservative multipliers recommended (30x-33x)
 * - Optional pension integration for lífeyrissjóður
 * - Life energy display when AWH available
 * - Scenario comparison across all three expense tiers
 *
 * Based on "Your Money or Your Life" and Trinity Study principles,
 * adapted for Icelandic inflation and pension system.
 */
export function FINumberBuilderCalculator() {
  const {
    fiNumberBuilder,
    fiNumberResults,
    expenseBaseline,
    expenseBaselineResults,
    results,
    setExpenseSource,
    setSelectedTier,
    setCustomMonthlyExpense,
    setMultiplier,
    setPensionIncome,
    setTargetRetirementAge,
    setOccupationalPension,
    setSereignBalance,
    initializeFINumberBuilder,
  } = useCalculator();

  // Initialize FI Number Builder if not already initialized
  useEffect(() => {
    if (!fiNumberBuilder) {
      initializeFINumberBuilder();
    }
  }, [fiNumberBuilder, initializeFINumberBuilder]);

  // Check if dependencies are available
  const hasBaseline = expenseBaseline !== null;
  const actualHourlyWage = results?.actualHourlyWage ?? null;
  const hasAWH = actualHourlyWage !== null && actualHourlyWage > 0;

  // Get monthly expenses for three-phase planning
  const monthlyExpenses = fiNumberResults?.monthlyExpenses ?? 500000;
  const multiplier = fiNumberBuilder?.multiplier ?? 30;
  const targetRetirementAge = fiNumberBuilder?.targetRetirementAge ?? 55;
  const occupationalPension = fiNumberBuilder?.occupationalPension ?? null;
  const sereignBalance = fiNumberBuilder?.sereignBalance ?? null;

  // Advanced analysis section state
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  // Current age default - could be enhanced with user input in the future
  const currentAge = 35;
  const fiNumber = fiNumberResults?.fiNumber ?? monthlyExpenses * 12 * multiplier;

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-blue-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 py-8 md:py-12">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
              FIRE Plönun
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
              FI-tala reiknivél
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Reiknaðu markmið þitt fyrir fjárhagslegt frelsi (Financial Independence)
              með íslenskum aðstæðum í huga.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Calculator Section */}
      <Section>
        <Container size="xl">
          {/* Missing Dependencies Alert */}
          {!hasBaseline && (
            <Alert variant="info" className="mb-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Engin útgjaldagrundur fannst
                </h3>
                <p className="mb-3">
                  Til að nota útgjaldagrunn verður þú að setja hann upp fyrst.
                  Það gerir þér kleift að bera saman FI tölur fyrir mismunandi
                  lífsstíl (lágmarks, þægilegt, lúxus).
                </p>
                <p className="text-sm">
                  Þú getur samt notað reiknivélina með sérsniðnum mánaðarlegum útgjöldum.
                </p>
              </div>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Section (Left Column) */}
            <div className="space-y-6">
              {/* Expense Source Selector */}
              <ExpenseSourceSelector
                expenseSource={fiNumberBuilder?.expenseSource ?? 'custom'}
                selectedTier={fiNumberBuilder?.selectedTier ?? null}
                customMonthlyExpense={fiNumberBuilder?.customMonthlyExpense ?? 500000}
                hasBaseline={hasBaseline}
                baselineExpenses={
                  expenseBaselineResults
                    ? {
                        barebones: expenseBaselineResults.totals.barebones ?? 0,
                        comfortable: expenseBaselineResults.totals.comfortable ?? 0,
                        deluxe: expenseBaselineResults.totals.deluxe ?? 0,
                      }
                    : undefined
                }
                onSourceChange={(source) => setExpenseSource(source)}
                onTierChange={(tier) => setSelectedTier(tier)}
                onCustomExpenseChange={(amount) => setCustomMonthlyExpense(amount)}
              />

              {/* Multiplier Selector */}
              <MultiplierSelector
                multiplier={fiNumberBuilder?.multiplier ?? 30}
                onMultiplierChange={(mult) => setMultiplier(mult)}
              />

              {/* Pension Income Section */}
              <PensionIncomeSection
                pensionMonthlyIncome={fiNumberBuilder?.pensionMonthlyIncome ?? null}
                targetRetirementAge={fiNumberBuilder?.targetRetirementAge ?? null}
                monthlyExpenses={monthlyExpenses}
                onPensionIncomeChange={(income) => setPensionIncome(income)}
                onRetirementAgeChange={(age) => setTargetRetirementAge(age)}
              />
            </div>

            {/* Results Section (Right Column) */}
            <div className="space-y-6">
              <ResultsDisplay
                fiNumber={fiNumberResults?.fiNumber ?? null}
                monthlyExpenses={fiNumberResults?.monthlyExpenses ?? monthlyExpenses}
                annualExpenses={fiNumberResults?.annualExpenses ?? monthlyExpenses * 12}
                multiplier={fiNumberResults?.multiplier ?? multiplier}
                withdrawalRate={fiNumberResults?.withdrawalRate ?? (1 / multiplier) * 100}
                pensionAdjusted={fiNumberResults?.pensionAdjusted ?? null}
                lifeEnergy={fiNumberResults?.lifeEnergy ?? null}
                currentSavings={0}
                showAWHPrompt={!hasAWH}
              />
            </div>
          </div>

          {/* Three-Phase Planning Section (Iceland) */}
          {fiNumberBuilder && (
            <div className="mt-8">
              <ThreePhasePlanningSection
                targetRetirementAge={targetRetirementAge}
                monthlyExpenses={monthlyExpenses}
                multiplier={multiplier}
                occupationalPension={occupationalPension}
                sereignBalance={sereignBalance}
                onRetirementAgeChange={(age) => setTargetRetirementAge(age)}
                onOccupationalPensionChange={(pension) => setOccupationalPension(pension)}
                onSereignBalanceChange={(balance) => setSereignBalance(balance)}
              />
            </div>
          )}

          {/* Advanced Analysis Section */}
          {fiNumberBuilder && (
            <div className="mt-8">
              <Card variant="elevated" className="border-2 border-slate-200">
                <CardHeader
                  className="cursor-pointer bg-gradient-to-r from-slate-50 to-gray-50"
                  onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Ítarleg greining
                        </h3>
                        <Badge variant="info" size="sm">Framhaldsstig</Badge>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">
                        Skattaáætlun, verðbólguálagspróf, úttektaröð og gjaldmiðlaáhætta
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={showAdvancedAnalysis ? 'Loka' : 'Opna'}
                      aria-expanded={showAdvancedAnalysis}
                    >
                      <svg
                        className={`h-5 w-5 transition-transform duration-200 ${showAdvancedAnalysis ? 'rotate-180' : ''}`}
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

                {showAdvancedAnalysis && (
                  <CardContent className="space-y-6 pt-6">
                    {/* Withdrawal Sequence Optimizer */}
                    <WithdrawalSequenceOptimizer
                      currentAge={currentAge}
                      retirementAge={targetRetirementAge}
                      monthlyExpenses={monthlyExpenses}
                      taxableBalance={fiNumber * 0.3}
                      sereignBalance={sereignBalance ?? fiNumber * 0.2}
                      occupationalPension={occupationalPension ?? 200000}
                      compact
                    />

                    {/* Tax Planning Calculator */}
                    <TaxPlanningCalculator
                      pensionIncome={occupationalPension ?? 200000}
                      sereignWithdrawal={0}
                      capitalGainsIncome={0}
                      trPension={0}
                      compact
                    />

                    {/* Inflation Stress Tester */}
                    <InflationStressTester
                      portfolioValue={fiNumber}
                      annualExpenses={monthlyExpenses * 12}
                      currentAge={currentAge}
                      retirementAge={targetRetirementAge}
                      compact
                    />

                    {/* Currency Risk Education */}
                    <CurrencyRiskEducation
                      portfolioValue={fiNumber}
                      annualExpenses={monthlyExpenses * 12}
                      travelBudgetPercent={10}
                      compact
                    />
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </Container>
      </Section>

      {/* Scenario Comparison Section */}
      {fiNumberBuilder && fiNumberResults?.scenarios && fiNumberBuilder.selectedTier && (
        <Section className="bg-neutral-50">
          <Container size="xl">
            <ScenarioComparison
              scenarios={fiNumberResults.scenarios}
              selectedTier={fiNumberBuilder.selectedTier}
              multiplier={fiNumberBuilder.multiplier}
              onTierSelect={setSelectedTier}
            />
          </Container>
        </Section>
      )}

      {/* Educational Content Section */}
      <Section>
        <Container size="lg">
          <Card className="p-6 md:p-8 bg-blue-50 border-blue-200">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Hvað er FI tala?
              </h3>
              <p className="text-neutral-700">
                FI talan þín (Financial Independence number) er sú upphæð sem þú þarft
                að hafa sparað og fjárfest til að geta lifað af fjárfestingarávöxtuninni
                án þess að þurfa að vinna. Þetta er grundvöllur FIRE hreyfingar (Financial
                Independence, Retire Early).
              </p>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Hvernig er FI talan reiknuð?
                </h4>
                <p className="text-neutral-700">
                  <strong>FI tala = Árleg útgjöld × Margfaldari</strong>
                </p>
                <ul className="mt-2 space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>25x margfaldari (4% regla):</strong> Bandarísk staðall,
                      gæti verið of árásargjarn fyrir Ísland
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>30x margfaldari (3,33% regla):</strong> Mælt með fyrir Ísland
                      vegna hærri verðbólgu
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>33x margfaldari (3% regla):</strong> Íhaldssöm nálgun fyrir
                      aukið öryggi
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Hvers vegna íslenskt samhengi skiptir máli
                </h4>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>
                      <strong>Hærri verðbólga:</strong> Ísland hefur söguleg meðaltal
                      3-4% verðbólgu á móti 2-3% í Bandaríkjunum
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>
                      <strong>Lífeyrissjóður:</strong> Skyldubundin lífeyrisiðgjöld
                      (16% samtals) geta lækkað FI töluna þína ef þú fyrirhugað að
                      nota lífeyri eftir 67 ára aldur
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>
                      <strong>Minni markaður:</strong> Íslenska hlutabréfamarkaðurinn
                      er minni og sveiflukenndari en alþjóðlegir markaðir
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-blue-200">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Dæmi: Ef þú þarft 500.000 kr á mánuði
                </h4>
                <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-800">Árleg útgjöld:</span>
                    <span className="font-semibold text-neutral-900">6.000.000 kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-800">25x margfaldari (US):</span>
                    <span className="font-semibold text-neutral-900">150.000.000 kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-800">30x margfaldari (mælt með):</span>
                    <span className="font-semibold text-blue-700">180.000.000 kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-800">33x margfaldari (íhaldssamt):</span>
                    <span className="font-semibold text-neutral-900">198.000.000 kr</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Icelandic Context Alert */}
      {fiNumberBuilder?.multiplier && fiNumberBuilder.multiplier < 28 && (
        <Section>
          <Container size="lg">
            <Alert variant="warning">
              <div>
                <h3 className="font-semibold mb-2">
                  ⚠️ Varúð: Margfaldari gæti verið of árásargjarn fyrir Ísland
                </h3>
                <p className="mb-3">
                  Þú hefur valið {fiNumberBuilder.multiplier}x margfaldara, sem jafngildir{' '}
                  {((1 / fiNumberBuilder.multiplier) * 100).toFixed(2)}% árlegri úttekt.
                </p>
                <p className="mb-3">
                  Vegna hærri verðbólgu á Íslandi (3-4% á móti 2-3% í Bandaríkjunum) mælum
                  við með að nota 30x eða 33x margfaldara fyrir öruggari FI áætlun.
                </p>
                <div className="text-sm">
                  <strong>Söguleg verðbólga:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>Ísland: ~3-4% á ári að meðaltali</li>
                    <li>Bandaríkin: ~2-3% á ári að meðaltali</li>
                  </ul>
                </div>
              </div>
            </Alert>
          </Container>
        </Section>
      )}
    </>
  );
}
