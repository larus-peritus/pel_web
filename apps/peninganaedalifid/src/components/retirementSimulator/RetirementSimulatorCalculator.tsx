'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { RetirementInputs } from './RetirementInputs';
import { PortfolioSettings } from './PortfolioSettings';
import { WithdrawalStrategySelector } from './WithdrawalStrategySelector';
import { PensionInputs } from './PensionInputs';
import { SimulationResults } from './SimulationResults';
import { TrajectoryChart } from './TrajectoryChart';
import { FlexibilityAnalysis } from './FlexibilityAnalysis';
import { runMonteCarloSimulation } from '@/lib/calculations/monteCarloSimulator';
import type {
  RetirementSimulation,
  SimulationResults as SimulationResultsType,
  WithdrawalStrategy,
} from '@/types/retirementSimulator';
import {
  DEFAULT_LIFE_EXPECTANCY,
  DEFAULT_EXPECTED_RETURN,
  DEFAULT_RETURN_VOLATILITY,
  DEFAULT_INFLATION_RATE,
  DEFAULT_WITHDRAWAL_STRATEGY,
  DEFAULT_SIMULATION_ASSUMPTIONS,
  ICELANDIC_PENSION_DEFAULTS,
} from '@/lib/constants/retirementSimulator';

/**
 * Retirement Simulator Calculator (Eftirlaunahermir)
 *
 * Main calculator component that uses Monte Carlo simulation to project
 * retirement success probability. Integrates with Icelandic pension system.
 *
 * Features:
 * - Monte Carlo simulation (1000+ scenarios)
 * - Multiple withdrawal strategies (4% rule, variable, guardrails)
 * - Icelandic pension integration (lífeyrissjóður, ellilífeyrir)
 * - Success probability visualization
 * - Portfolio trajectory confidence bands
 * - Sensitivity analysis
 */
export function RetirementSimulatorCalculator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SimulationResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation inputs
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(DEFAULT_LIFE_EXPECTANCY);
  const [currentBalance, setCurrentBalance] = useState(10_000_000);
  const [monthlySavings, setMonthlySavings] = useState(200_000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(500_000);

  // Portfolio settings
  const [expectedReturn, setExpectedReturn] = useState(DEFAULT_EXPECTED_RETURN);
  const [volatility, setVolatility] = useState(DEFAULT_RETURN_VOLATILITY);
  const [inflationRate, setInflationRate] = useState(DEFAULT_INFLATION_RATE);

  // Withdrawal strategy
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>(
    DEFAULT_WITHDRAWAL_STRATEGY
  );

  // Pension inputs
  const [lifeyrissjodurEnabled, setLifeyrissjodurEnabled] = useState(false);
  const [lifeyrissjodurAge, setLifeyrissjodurAge] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.LIFEYRISSJODUR_AGE
  );
  const [lifeyrissjodurAmount, setLifeyrissjodurAmount] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY
  );
  const [lifeyrissjodurInflation, setLifeyrissjodurInflation] = useState(true);

  // Séreignarlífeyrir (private pension) - NOT means-tested
  const [sereignEnabled, setSereignEnabled] = useState(false);
  const [sereignAge, setSereignAge] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.SEREIGN_AGE
  );
  const [sereignAmount, setSereignAmount] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.TYPICAL_SEREIGN_MONTHLY
  );
  const [sereignInflation, setSereignInflation] = useState(true);

  const [ellilifeyririEnabled, setEllilifeyririEnabled] = useState(false);
  const [ellilifeyririAge, setEllilifeyririAge] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE
  );
  const [ellilifeyririAmount, setEllilifeyririAmount] = useState<number>(
    ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY
  );
  const [ellilifeyririInflation, setEllilifeyririInflation] = useState(true);

  /**
   * Run Monte Carlo simulation
   */
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    setProgress(0);

    try {
      // Prepare simulation configuration
      const simulation: RetirementSimulation = {
        retirementDate: new Date(
          new Date().getFullYear() + (retirementAge - currentAge),
          new Date().getMonth(),
          new Date().getDate()
        ),
        currentAge,
        currentDate: new Date(),
        lifeExpectancy,
        portfolio: {
          currentBalance,
          monthlySavings,
          expectedRealReturn: expectedReturn,
          inflationRate,
          returnVolatility: volatility,
        },
        expenses: {
          source: 'manual',
          monthlyExpenses,
          retirementAdjustment: 1.0,
        },
        pensions: {
          lifeyrissjodur: {
            enabled: lifeyrissjodurEnabled,
            startAge: lifeyrissjodurAge,
            monthlyAmount: lifeyrissjodurAmount,
            inflationAdjusted: lifeyrissjodurInflation,
          },
          sereign: {
            enabled: sereignEnabled,
            startAge: sereignAge,
            monthlyAmount: sereignAmount,
            inflationAdjusted: sereignInflation,
          },
          ellilifeyrir: {
            enabled: ellilifeyririEnabled,
            startAge: ellilifeyririAge,
            monthlyAmount: ellilifeyririAmount,
            inflationAdjusted: ellilifeyririInflation,
          },
        },
        assumptions: DEFAULT_SIMULATION_ASSUMPTIONS,
        withdrawalStrategy,
      };

      // Run simulation with progress callback
      const simulationResults = await runMonteCarloSimulation(simulation, (p) => {
        setProgress(p);
      });

      setResults(simulationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Villa kom upp við hermun');
    } finally {
      setIsSimulating(false);
      setProgress(0);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-purple-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 py-8 md:py-12">
            <div className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-2">
              Monte Carlo Hermun
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
              Eftirlaunahermir
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
              Mettu líkur á árangri eftirlaunaplansins þíns með Monte Carlo hermun.
              Tekur tillit til markaðssveifla, verðbólgu og íslensks lífeyriskerfis.
            </p>
          </div>
        </Container>
      </Section>

      {/* Educational Introduction */}
      <Section>
        <Container size="lg">
          <Alert variant="info">
            <div>
              <h3 className="font-semibold mb-2">Hvað er Monte Carlo hermun?</h3>
              <p className="text-sm mb-2">
                Monte Carlo hermun keyrir þúsundir mismunandi atburðarása með
                tilviljunarkenndum markaðsávöxtun til að meta hversu líklegt er að
                eignasafn þitt endist alla eftirlaun. Þetta tekur tillit til
                röðunaráhættu (sequence risk) þar sem slæm ár snemma á eftirlaun
                geta haft meiri áhrif en slæm ár seinna.
              </p>
              <p className="text-sm">
                Niðurstöðurnar sýna árangurslíkur (t.d. 85% = safnið endist í 850 af
                1000 atburðarásum) og traust bil fyrir eignasafnsstöðu.
              </p>
            </div>
          </Alert>
        </Container>
      </Section>

      {/* Main Calculator Section */}
      <Section>
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              {/* Basic Retirement Inputs */}
              <RetirementInputs
                currentAge={currentAge}
                retirementAge={retirementAge}
                lifeExpectancy={lifeExpectancy}
                currentBalance={currentBalance}
                monthlySavings={monthlySavings}
                monthlyExpenses={monthlyExpenses}
                onCurrentAgeChange={setCurrentAge}
                onRetirementAgeChange={setRetirementAge}
                onLifeExpectancyChange={setLifeExpectancy}
                onCurrentBalanceChange={setCurrentBalance}
                onMonthlySavingsChange={setMonthlySavings}
                onMonthlyExpensesChange={setMonthlyExpenses}
              />

              {/* Portfolio Settings */}
              <PortfolioSettings
                expectedReturn={expectedReturn}
                volatility={volatility}
                inflationRate={inflationRate}
                onExpectedReturnChange={setExpectedReturn}
                onVolatilityChange={setVolatility}
                onInflationRateChange={setInflationRate}
              />

              {/* Withdrawal Strategy */}
              <WithdrawalStrategySelector
                strategy={withdrawalStrategy}
                onStrategyChange={setWithdrawalStrategy}
              />

              {/* Pension Inputs */}
              <PensionInputs
                lifeyrissjodurEnabled={lifeyrissjodurEnabled}
                lifeyrissjodurAge={lifeyrissjodurAge}
                lifeyrissjodurAmount={lifeyrissjodurAmount}
                lifeyrissjodurInflation={lifeyrissjodurInflation}
                sereignEnabled={sereignEnabled}
                sereignAge={sereignAge}
                sereignAmount={sereignAmount}
                sereignInflation={sereignInflation}
                ellilifeyririEnabled={ellilifeyririEnabled}
                ellilifeyririAge={ellilifeyririAge}
                ellilifeyririAmount={ellilifeyririAmount}
                ellilifeyririInflation={ellilifeyririInflation}
                onLifeyrissjodurEnabledChange={setLifeyrissjodurEnabled}
                onLifeyrissjodurAgeChange={setLifeyrissjodurAge}
                onLifeyrissjodurAmountChange={setLifeyrissjodurAmount}
                onLifeyrissjodurInflationChange={setLifeyrissjodurInflation}
                onSereignEnabledChange={setSereignEnabled}
                onSereignAgeChange={setSereignAge}
                onSereignAmountChange={setSereignAmount}
                onSereignInflationChange={setSereignInflation}
                onEllilifeyririEnabledChange={setEllilifeyririEnabled}
                onEllilifeyririAgeChange={setEllilifeyririAge}
                onEllilifeyririAmountChange={setEllilifeyririAmount}
                onEllilifeyririInflationChange={setEllilifeyririInflation}
              />

              {/* Run Simulation Button */}
              <Card>
                <CardContent>
                  <Button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    isLoading={isSimulating}
                    size="lg"
                    className="w-full"
                  >
                    {isSimulating
                      ? `Keyri hermun... ${progress}%`
                      : 'Keyra Monte Carlo hermun'}
                  </Button>
                  {isSimulating && (
                    <div className="mt-4">
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Results */}
            <div className="space-y-6">
              {error && (
                <Alert variant="error">
                  <h3 className="font-semibold mb-2">Villa</h3>
                  <p className="text-sm">{error}</p>
                </Alert>
              )}

              {results ? (
                <>
                  {/* Success Probability & Key Stats */}
                  <SimulationResults results={results} />

                  {/* Portfolio Trajectory Chart */}
                  <TrajectoryChart
                    results={results}
                    retirementAge={retirementAge}
                    lifeExpectancy={lifeExpectancy}
                    lifeyrissjodurEnabled={lifeyrissjodurEnabled}
                    lifeyrissjodurAge={lifeyrissjodurAge}
                    sereignEnabled={sereignEnabled}
                    sereignAge={sereignAge}
                    ellilifeyririEnabled={ellilifeyririEnabled}
                    ellilifeyririAge={ellilifeyririAge}
                  />

                  {/* Flexibility & Sensitivity Analysis */}
                  <FlexibilityAnalysis flexibility={results.flexibility} />
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Tilbúin/n að herma eftirlaunin þín?
                    </h3>
                    <p className="text-neutral-600">
                      Stilltu breyturnar vinstra megin og smelltu á "Keyra Monte Carlo
                      hermun" til að sjá líkur á árangri.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Educational Content */}
      <Section className="bg-neutral-50">
        <Container size="lg">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Skilningur á niðurstöðum
            </h2>
            <div className="space-y-4 text-neutral-700">
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Árangurslíkur
                </h3>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>90%+: Framúrskarandi - Mjög örugg eftirlaunaáætlun</li>
                  <li>80-90%: Gott - Ásættanleg áhætta fyrir flesta</li>
                  <li>70-80%: Ásættanlegt - Íhugaðu valkosti til að bæta</li>
                  <li>60-70%: Áhættusamt - Þarfnast lagfæringa</li>
                  <li>&lt;60%: Háhætta - Mælt með breytingum</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Traust bil (Confidence Bands)
                </h3>
                <p className="text-sm">
                  Skuggasvæðið á línuritinu sýnir hvar eignasafn þitt er líklegt til að
                  vera. 90% traust bil þýðir að í 90% atburðarása er eignasafnið innan
                  þessa sviðs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Íslenskt lífeyriskerfi
                </h3>
                <ul className="space-y-1 ml-4 list-disc text-sm">
                  <li>
                    <strong>Lífeyrissjóður:</strong> Skylduframlag, venjulega í boði frá 60-67 ára aldri
                  </li>
                  <li>
                    <strong>Séreignarlífeyrir:</strong> Frjálst framlag, í boði frá 60 ára aldri.{' '}
                    <span className="text-green-700 font-medium">Telst EKKI til tekna hjá TR!</span>
                  </li>
                  <li>
                    <strong>Ellilífeyrir:</strong> Ríkislífeyrir frá 67 ára aldri (tekjutengdur)
                  </li>
                  <li>
                    Lífeyristekjur lækka þörf fyrir úttektir úr eignasafni og bæta
                    árangurslíkur
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
