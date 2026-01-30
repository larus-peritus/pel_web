/**
 * CoastFIREInputs Component
 *
 * Input form for Coast FIRE calculator with all required fields.
 * Integrates with CalculatorContext for state management.
 *
 * Features:
 * - Current age input
 * - Current investments input (ISK)
 * - Target retirement age input
 * - Expected return rate selector with scenario presets
 * - FI number input with auto-calculate from expense baseline
 * - Help text and validation
 * - Icelandic labels and formatting
 *
 * Epic 3, Task 3.2
 */

'use client';

import React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  COAST_FIRE_AGES,
  DEFAULT_RETURN_RATE,
  RETURN_RATE_SCENARIOS,
  RETURN_RATE_RANGE,
  FI_MULTIPLIER_DEFAULTS,
  SCENARIO_DESCRIPTIONS,
} from '@/lib/constants/coastFire';
import { formatCurrency } from '@/lib/utils';
import type { ExpenseTier } from '@/types/expenseBaseline';

export interface CoastFIREInputsProps {
  className?: string;
}

export function CoastFIREInputs({ className }: CoastFIREInputsProps) {
  const {
    coastFireState,
    expenseBaselineResults,
    setCoastCurrentAge,
    setCoastCurrentInvestments,
    setCoastTargetRetirementAge,
    setCoastExpectedReturn,
    setCoastFINumber,
    setCoastFINumberSource,
    setCoastSelectedTier,
    setCoastFIMultiplier,
  } = useCalculator();

  // Local state for FI number mode toggle
  const [useBaseline, setUseBaseline] = React.useState(
    coastFireState?.fiNumberSource === 'baseline'
  );

  // Get current values or defaults
  const currentAge = coastFireState?.currentAge ?? COAST_FIRE_AGES.DEFAULT_CURRENT_AGE;
  const currentInvestments = coastFireState?.currentInvestments ?? 0;
  const targetRetirementAge =
    coastFireState?.targetRetirementAge ?? COAST_FIRE_AGES.DEFAULT_RETIREMENT_AGE;
  const expectedReturn = coastFireState?.expectedReturn ?? DEFAULT_RETURN_RATE;
  const fiNumber = coastFireState?.fiNumber ?? null;
  const fiMultiplier = coastFireState?.fiMultiplier ?? FI_MULTIPLIER_DEFAULTS.DEFAULT;
  const selectedTier = coastFireState?.selectedTier ?? 'comfortable';

  // Check if we have expense baseline results
  const hasExpenseBaseline = expenseBaselineResults !== null;

  // Validation
  const ageValid = currentAge >= COAST_FIRE_AGES.MIN_AGE && currentAge <= COAST_FIRE_AGES.MAX_AGE;
  const retirementAgeValid =
    targetRetirementAge > currentAge && targetRetirementAge <= COAST_FIRE_AGES.MAX_AGE;
  const returnRateWarning =
    expectedReturn < RETURN_RATE_RANGE.WARNING_LOW || expectedReturn > RETURN_RATE_RANGE.WARNING_HIGH;

  /**
   * Handle return rate scenario preset selection
   */
  const handleScenarioPreset = (scenario: keyof typeof RETURN_RATE_SCENARIOS) => {
    setCoastExpectedReturn(RETURN_RATE_SCENARIOS[scenario]);
  };

  /**
   * Toggle between manual FI number and baseline calculation
   */
  const handleToggleBaseline = () => {
    if (!hasExpenseBaseline) return;

    const newUseBaseline = !useBaseline;
    setUseBaseline(newUseBaseline);

    if (newUseBaseline) {
      setCoastFINumberSource('baseline');
      // Auto-select tier if not already set
      setCoastSelectedTier(selectedTier);
    } else {
      setCoastFINumberSource('manual');
    }
  };

  /**
   * Calculate FI number from baseline when tier or multiplier changes
   */
  React.useEffect(() => {
    if (useBaseline && hasExpenseBaseline && expenseBaselineResults) {
      const monthlyExpense = expenseBaselineResults.totals[selectedTier];
      const calculatedFI = monthlyExpense * 12 * fiMultiplier;
      setCoastFINumber(calculatedFI);
    }
  }, [useBaseline, hasExpenseBaseline, expenseBaselineResults, selectedTier, fiMultiplier, setCoastFINumber]);

  /**
   * Get tier label in Icelandic
   */
  const getTierLabel = (tier: ExpenseTier): string => {
    const labels: Record<ExpenseTier, string> = {
      barebones: 'Lágmarks',
      comfortable: 'Þægileg',
      deluxe: 'Lúxus',
    };
    return labels[tier];
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Grunnupplýsingar
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Gefðu upp núverandi stöðu og markmið þín
          </p>
        </CardHeader>

        <CardContent className="space-y-6" role="form" aria-label="Innsláttarform fyrir Sjálfvirkt FIRE reiknivél">
          {/* Age Inputs */}
          <div className="space-y-4" role="group" aria-labelledby="age-heading">
            <h3 id="age-heading" className="text-base font-medium text-neutral-900">Aldur</h3>

            <NumberInput
              label="Núverandi aldur"
              value={currentAge}
              onChange={setCoastCurrentAge}
              min={COAST_FIRE_AGES.MIN_AGE}
              max={COAST_FIRE_AGES.MAX_AGE}
              suffix="ára"
              required
              helpText="Aldurinn þinn í dag"
              error={!ageValid ? 'Aldur verður að vera á milli 18 og 100 ára' : undefined}
            />

            <NumberInput
              label="Eftirlaunaaldur"
              value={targetRetirementAge}
              onChange={setCoastTargetRetirementAge}
              min={currentAge + 1}
              max={COAST_FIRE_AGES.MAX_AGE}
              suffix="ára"
              required
              helpText="Á hvaða aldri viltu hætta að vinna?"
              error={
                !retirementAgeValid
                  ? `Eftirlaunaaldur verður að vera meiri en núverandi aldur (${currentAge})`
                  : undefined
              }
            />

            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
              Tímabil til starfsloka: <strong>{targetRetirementAge - currentAge} ár</strong>
            </div>
          </div>

          {/* Current Investments */}
          <div className="space-y-4" role="group" aria-labelledby="investments-heading">
            <h3 id="investments-heading" className="text-base font-medium text-neutral-900">
              Núverandi fjárfestingar
            </h3>

            <CurrencyInput
              label="Fjárfestingar núna"
              value={currentInvestments}
              onChange={setCoastCurrentInvestments}
              required
              helpText="Heildarverðmæti fjárfestinga þinna í dag (hlutabréf, sjóðir, lífeyrissjóður, o.fl.)"
            />
          </div>

          {/* Expected Return Rate (with guidance, Task 7.2) */}
          <div className="space-y-4" role="group" aria-labelledby="return-heading">
            <div className="flex items-center gap-2">
              <h3 id="return-heading" className="text-base font-medium text-neutral-900">
                Vænt ávöxtun
              </h3>
              <Tooltip
                content="Þetta er raunávöxtun (eftir verðbólgu). Söguleg meðalávöxtun hlutabréfa er 6-7%."
                position="right"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold cursor-help">
                  ?
                </span>
              </Tooltip>
            </div>

            <NumberInput
              label="Vænt árleg ávöxtun"
              value={expectedReturn}
              onChange={setCoastExpectedReturn}
              min={RETURN_RATE_RANGE.MIN}
              max={RETURN_RATE_RANGE.MAX}
              step={0.1}
              suffix="%"
              required
              helpText="Raunávöxtun (eftir verðbólgu) sem þú býst við"
            />

            {/* Historical Context */}
            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                📊 Söguleg samhengi:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>S&P 500 (1926-2023):</strong> ~7% raunávöxtun</li>
                <li>• <strong>Íslenskir lífeyrissjóðir:</strong> 6-8% raunávöxtun til langs tíma</li>
                <li>• <strong>60/40 safn (hlutabréf/skuldabréf):</strong> ~5-6% raunávöxtun</li>
                <li>• <strong>Íhaldssöm ráðgjöf:</strong> 4-5% raunávöxtun</li>
              </ul>
            </div>

            {/* Impact visualization */}
            <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200">
              <p className="text-xs font-semibold text-neutral-900 mb-2">
                💡 Áhrif ávöxtunar á Sjálfvirkt FIRE dagsetningu:
              </p>
              <div className="space-y-1 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span>Við 4% ávöxtun:</span>
                  <span className="font-medium">
                    Peningar tvöfaldast á ~18 árum
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Við 6% ávöxtun:</span>
                  <span className="font-medium text-primary-600">
                    Peningar tvöfaldast á ~12 árum
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Við 8% ávöxtun:</span>
                  <span className="font-medium">
                    Peningar tvöfaldast á ~9 árum
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-2 italic">
                <strong>Regla 72:</strong> Deila 72 með ávöxtunarprósentu til að fá tvöföldunar-tíma.
              </p>
            </div>

            {/* Scenario Presets */}
            <div className="space-y-2" role="group" aria-label="Ávöxtunarforsendur">
              <p className="text-sm font-medium text-neutral-700">
                Algeng atburðarás:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={expectedReturn === RETURN_RATE_SCENARIOS.conservative ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleScenarioPreset('conservative')}
                  aria-pressed={expectedReturn === RETURN_RATE_SCENARIOS.conservative}
                  aria-label="Velja íhaldssama ávöxtun, 4 prósent"
                >
                  Íhaldssöm (4%)
                </Button>
                <Button
                  variant={expectedReturn === RETURN_RATE_SCENARIOS.moderate ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleScenarioPreset('moderate')}
                  aria-pressed={expectedReturn === RETURN_RATE_SCENARIOS.moderate}
                  aria-label="Velja miðlungs ávöxtun, 6 prósent"
                >
                  Miðlungs (6%)
                </Button>
                <Button
                  variant={expectedReturn === RETURN_RATE_SCENARIOS.optimistic ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleScenarioPreset('optimistic')}
                  aria-pressed={expectedReturn === RETURN_RATE_SCENARIOS.optimistic}
                  aria-label="Velja bjartsýna ávöxtun, 8 prósent"
                >
                  Bjartsýn (8%)
                </Button>
              </div>
              <p className="text-xs text-neutral-600">
                {SCENARIO_DESCRIPTIONS.moderate}
              </p>
            </div>

            {returnRateWarning && (
              <Alert variant="warning">
                {expectedReturn < RETURN_RATE_RANGE.WARNING_LOW &&
                  'Þetta er mjög íhaldssöm ávöxtun. Íslenskir lífeyrissjóðir hafa skilað 6-8% raunávöxtun til langs tíma.'}
                {expectedReturn > RETURN_RATE_RANGE.WARNING_HIGH &&
                  'Þetta er mjög bjartsýn ávöxtun. Hærri ávöxtun fylgir meiri áhætta. Íhugaðu íhaldssama áætlun.'}
              </Alert>
            )}
          </div>

          {/* FI Number Input */}
          <div className="space-y-4" role="group" aria-labelledby="fi-number-heading">
            <h3 id="fi-number-heading" className="text-base font-medium text-neutral-900">FI-tala</h3>

            {/* Toggle between manual and baseline */}
            {hasExpenseBaseline && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-700" id="fi-source-label">
                  {useBaseline ? 'Nota útgjaldagrunn' : 'Handvirk innsláttur'}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToggleBaseline}
                  aria-labelledby="fi-source-label"
                  aria-pressed={useBaseline}
                >
                  {useBaseline ? 'Breyta í handvirka' : 'Nota útgjaldagrunn'}
                </Button>
              </div>
            )}

            {!hasExpenseBaseline && (
              <Alert variant="info">
                <div>
                  <p className="text-sm">
                    Þú getur notað <strong>útgjaldagrunn</strong> til að reikna FI-tölu sjálfvirkt.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      window.location.href = '/reiknivaelir?calc=utgjaldareiknivel';
                    }}
                  >
                    Setja upp útgjaldagrunn
                  </Button>
                </div>
              </Alert>
            )}

            {/* Baseline mode: Tier selector + Multiplier */}
            {useBaseline && hasExpenseBaseline && (
              <div className="space-y-4 rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700" id="tier-label">
                    Lífsstíll
                  </label>
                  <div className="flex gap-2" role="group" aria-labelledby="tier-label">
                    {(['barebones', 'comfortable', 'deluxe'] as ExpenseTier[]).map((tier) => (
                      <Button
                        key={tier}
                        variant={selectedTier === tier ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCoastSelectedTier(tier)}
                        aria-pressed={selectedTier === tier}
                        aria-label={`Velja ${getTierLabel(tier)} lífsstíl`}
                      >
                        {getTierLabel(tier)}
                      </Button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-600">
                    Mánaðarleg útgjöld:{' '}
                    <strong>
                      {expenseBaselineResults ? formatCurrency(expenseBaselineResults.totals[selectedTier]) : '—'}
                    </strong>
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      FI Margfaldari
                    </label>
                    <Tooltip
                      content="Margfaldari ákvarðar hversu mikið þú þarft miðað við ársútgjöld. 25x = 4% úttekt, 30x = 3.33% úttekt."
                      position="right"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold cursor-help">
                        ?
                      </span>
                    </Tooltip>
                  </div>
                  <div className="flex gap-2" role="group" aria-label="FI margfaldari valmöguleikar">
                    <Button
                      variant={fiMultiplier === 25 ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setCoastFIMultiplier(25)}
                      aria-pressed={fiMultiplier === 25}
                      aria-label="Velja 25 sinnum margfaldara, 4 prósent úttektarhlutfall"
                    >
                      25x (4%)
                    </Button>
                    <Button
                      variant={fiMultiplier === 30 ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setCoastFIMultiplier(30)}
                      aria-pressed={fiMultiplier === 30}
                      aria-label="Velja 30 sinnum margfaldara, 3.33 prósent úttektarhlutfall"
                    >
                      30x (3.33%)
                    </Button>
                    <NumberInput
                      value={fiMultiplier}
                      onChange={setCoastFIMultiplier}
                      min={FI_MULTIPLIER_DEFAULTS.MIN}
                      max={FI_MULTIPLIER_DEFAULTS.MAX}
                      className="w-24"
                      aria-label="Sérsniðinn FI margfaldari"
                    />
                  </div>

                  {/* Multiplier explanation (Task 7.2) */}
                  <div className="mt-3 rounded-lg bg-purple-50 p-3 border border-purple-200">
                    <p className="text-xs font-semibold text-purple-900 mb-2">
                      📖 Hvað þýðir margfaldarinn?
                    </p>
                    <ul className="text-xs text-purple-800 space-y-1.5">
                      <li>
                        <strong>25x (4% regla):</strong> Trinity Study niðurstöður. Sögulega
                        95% líkur á að peningur duga í 30 ár með 4% árlega úttekt.
                      </li>
                      <li>
                        <strong>30x (3.33% regla):</strong> Íhaldssamt fyrir Ísland vegna
                        hærri verðbólgu og minni markaða. Ráðlagt fyrir langlífi.
                      </li>
                      <li>
                        <strong>33x (3% regla):</strong> Mjög íhaldssamt. Næstum engin áhætta
                        á því að peningar klárist.
                      </li>
                    </ul>
                  </div>

                  {/* Impact comparison */}
                  <div className="mt-2 rounded-lg bg-neutral-50 p-3 border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-900 mb-1">
                      🔢 Dæmi: Ef mánaðarútgjöld eru {formatCurrency(500_000)}
                    </p>
                    <div className="space-y-1 text-xs text-neutral-700">
                      <div className="flex justify-between">
                        <span>25x margfaldari:</span>
                        <span className="font-medium">
                          {formatCurrency(500_000 * 12 * 25)} FI-tala
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>30x margfaldari:</span>
                        <span className="font-medium text-primary-600">
                          {formatCurrency(500_000 * 12 * 30)} FI-tala
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>33x margfaldari:</span>
                        <span className="font-medium">
                          {formatCurrency(500_000 * 12 * 33)} FI-tala
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculated FI Number Breakdown */}
                <div className="rounded-lg bg-white p-3">
                  <p className="text-sm font-medium text-neutral-900">
                    Reiknuð FI-tala:
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    {expenseBaselineResults ? formatCurrency(expenseBaselineResults.totals[selectedTier]) : '—'} kr/mán × 12 × {fiMultiplier} ={' '}
                    <strong className="text-lg text-primary-600">
                      {fiNumber ? formatCurrency(fiNumber) : '—'}
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {/* Manual mode: Direct FI number input */}
            {!useBaseline && (
              <CurrencyInput
                label="FI-tala (fjárhagsleg sjálfstæði)"
                value={fiNumber ?? 0}
                onChange={setCoastFINumber}
                required
                helpText="Heildarupphæðin sem þú þarft til að lifa á fjárfestingum þínum (ársútgjöld × 25-30)"
              />
            )}
          </div>

          {/* Submit info */}
          <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
            Allar breytingar eru vistaðar sjálfkrafa í vafranum þínum.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
