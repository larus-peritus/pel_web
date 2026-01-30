'use client';

/**
 * RaiseForm Component
 * Feature ID: 2.3.2
 *
 * Input form for raise/bonus calculations.
 * Collects current and proposed salary (monthly), municipality, work hours,
 * deduction rates, and optional FI context.
 *
 * Now supports:
 * - Monthly salary input
 * - Import from main calculator with reverse calculation (nettó → brúttó)
 * - Pre-tax deduction configuration (lífeyrissjóður, séreignarsparnaður, stéttarfélag)
 *
 * References:
 * - Section 9: UI/UX Requirements - Form Layout
 * - US-1, US-2, US-3
 */

import { useState } from 'react';
import type { RaiseInputs, RaiseResults } from '@/types/raise';
import { calculateRaiseResults } from '@/lib/calculations/raiseCalculations';
import { calculateGrossFromNet, type SalaryDeductions } from '@/lib/calculations/icelandicTax';
import { DEFAULT_DEDUCTIONS, SALARY_DEDUCTIONS } from '@/lib/constants/icelandicTax';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

interface RaiseFormProps {
  initialInputs?: RaiseInputs;
  onSubmit: (inputs: RaiseInputs, results: RaiseResults) => void;
  onCancel?: () => void;
  actualHourlyWage: number;
  // For importing from main calculator
  grossAnnualIncome?: number;
  workHoursPerWeek?: number;
}

/**
 * Format number with Icelandic thousands separator
 */
function formatISK(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse ISK formatted string to number (remove dots)
 */
function parseISK(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function RaiseForm({
  initialInputs,
  onSubmit,
  onCancel,
  actualHourlyWage,
  grossAnnualIncome,
  workHoursPerWeek,
}: RaiseFormProps) {
  // Use monthly values for UI (convert from annual if initial values provided)
  const [currentGrossMonthly, setCurrentGrossMonthly] = useState(
    initialInputs?.currentGrossAnnual ? initialInputs.currentGrossAnnual / 12 : 500000
  );
  const [proposedGrossMonthly, setProposedGrossMonthly] = useState(
    initialInputs?.proposedGrossAnnual ? initialInputs.proposedGrossAnnual / 12 : 550000
  );
  const [currentWorkHoursWeek, setCurrentWorkHoursWeek] = useState(
    initialInputs?.currentWorkHoursWeek ?? workHoursPerWeek ?? 40
  );
  const [proposedWorkHoursWeek, setProposedWorkHoursWeek] = useState(
    initialInputs?.proposedWorkHoursWeek ?? workHoursPerWeek ?? 40
  );
  const [sameHours, setSameHours] = useState(
    !initialInputs?.proposedWorkHoursWeek ||
      initialInputs?.proposedWorkHoursWeek === initialInputs?.currentWorkHoursWeek
  );

  // Deduction rates
  const [showDeductions, setShowDeductions] = useState(false);
  const [lifeyrissjodur, setLifeyrissjodur] = useState(
    DEFAULT_DEDUCTIONS.lifeyrissjodur * 100
  );
  const [sereignarsjodur, setSereignarsjodur] = useState(
    DEFAULT_DEDUCTIONS.sereignarsjodur * 100
  );
  const [stettarfelag, setStettarfelag] = useState(
    DEFAULT_DEDUCTIONS.stettarfelag * 100
  );

  // FI context state
  const [showFIContext, setShowFIContext] = useState(!!initialInputs?.fiContext);
  const [annualExpenses, setAnnualExpenses] = useState(
    initialInputs?.fiContext?.annualExpenses ?? 3600000
  );
  const [savingsRate, setSavingsRate] = useState(
    initialInputs?.fiContext?.savingsRate ?? 50
  );
  const [currentPortfolio, setCurrentPortfolio] = useState(
    initialInputs?.fiContext?.currentPortfolio ?? 0
  );
  const [expectedReturn, setExpectedReturn] = useState(
    initialInputs?.fiContext?.expectedReturn ?? 7
  );

  // Import status
  const [hasImported, setHasImported] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if we can import from main calculator
  const canImport = grossAnnualIncome && grossAnnualIncome > 0;

  // Get deductions object
  const getDeductions = (): SalaryDeductions => ({
    lifeyrissjodur: lifeyrissjodur / 100,
    sereignarsjodur: sereignarsjodur / 100,
    stettarfelag: stettarfelag / 100,
  });

  // Default útsvar rate (Reykjavík 14.48%)
  const DEFAULT_UTSVAR_RATE = 14.48;

  // Import from main calculator
  // The main calculator stores nettó (after tax), so we reverse-calculate to get brúttó
  const handleImportFromCalculator = () => {
    if (!grossAnnualIncome) return;

    // The value from main calculator is nettó (eftir skatta) despite variable name
    const nettoMonthly = grossAnnualIncome / 12;
    const deductions = getDeductions();

    // Reverse calculate: nettó → brúttó
    const salaryResult = calculateGrossFromNet(nettoMonthly, DEFAULT_UTSVAR_RATE, deductions);

    setCurrentGrossMonthly(Math.round(salaryResult.grossMonthly));
    if (workHoursPerWeek) {
      setCurrentWorkHoursWeek(workHoursPerWeek);
    }
    setHasImported(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert monthly to annual for calculation
    const currentGrossAnnual = currentGrossMonthly * 12;
    const proposedGrossAnnual = proposedGrossMonthly * 12;

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (currentGrossMonthly <= 0) {
      newErrors.currentGrossMonthly = 'Núverandi laun verða að vera hærri en 0';
    }

    if (proposedGrossMonthly <= 0) {
      newErrors.proposedGrossMonthly = 'Ný laun verða að vera hærri en 0';
    }

    if (currentGrossMonthly === proposedGrossMonthly) {
      newErrors.proposedGrossMonthly = 'Ný laun verða að vera ólík núverandi launum';
    }

    if (currentWorkHoursWeek < 1 || currentWorkHoursWeek > 100) {
      newErrors.currentWorkHoursWeek = 'Vinnustundir verða að vera á milli 1 og 100';
    }

    if (!sameHours && (proposedWorkHoursWeek < 1 || proposedWorkHoursWeek > 100)) {
      newErrors.proposedWorkHoursWeek = 'Vinnustundir verða að vera á milli 1 og 100';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build inputs object
    const inputs: RaiseInputs = {
      currentGrossAnnual,
      proposedGrossAnnual,
      municipality: '0000', // Default to Reykjavík
      currentWorkHoursWeek,
      proposedWorkHoursWeek: sameHours ? undefined : proposedWorkHoursWeek,
      fiContext: showFIContext
        ? {
            annualExpenses,
            savingsRate,
            currentPortfolio,
            expectedReturn,
          }
        : undefined,
    };

    // Calculate results
    const results = calculateRaiseResults(inputs, actualHourlyWage);

    // Submit
    onSubmit(inputs, results);
  };

  // Calculate total deduction rate for display
  const totalDeductionRate = lifeyrissjodur + sereignarsjodur + stettarfelag;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Import from Calculator Button */}
      {canImport && !hasImported && (
        <Alert variant="info">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium">Sækja úr aðalreiknivél?</p>
              <p className="text-sm opacity-80">
                Nettó mánaðarlaun: {formatISK(grossAnnualIncome / 12)} kr/mán (eftir skatta)
              </p>
              <p className="text-xs opacity-60 mt-1">
                Brúttó verður reiknað út frá nettó
              </p>
              <p className="text-xs opacity-60">
                Brúttó = fyrir skatta | Nettó = eftir skatta
              </p>
            </div>
            <Button
              type="button"
              onClick={handleImportFromCalculator}
              size="sm"
            >
              Sækja gögn
            </Button>
          </div>
        </Alert>
      )}

      {hasImported && (
        <Alert variant="success">
          <p className="text-sm">
            ✓ Gögn sótt. Brúttó reiknað út frá nettó.
          </p>
        </Alert>
      )}

      {/* Current Situation Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Núverandi staða</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mánaðarlaun (brúttó - fyrir skatta)
            </label>
            <Input
              type="text"
              inputMode="numeric"
              value={formatISK(currentGrossMonthly)}
              onChange={(e) => setCurrentGrossMonthly(parseISK(e.target.value))}
              placeholder="500.000"
              className={errors.currentGrossMonthly ? 'border-red-500' : ''}
            />
            <p className="text-xs text-neutral-500 mt-1">
              = {formatISK(currentGrossMonthly * 12)} kr/ári
            </p>
            {errors.currentGrossMonthly && (
              <p className="text-sm text-red-600 mt-1">{errors.currentGrossMonthly}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Vinnustundir á viku
            </label>
            <Input
              type="number"
              value={currentWorkHoursWeek}
              onChange={(e) => setCurrentWorkHoursWeek(Number(e.target.value))}
              placeholder="40"
              className={errors.currentWorkHoursWeek ? 'border-red-500' : ''}
            />
            {errors.currentWorkHoursWeek && (
              <p className="text-sm text-red-600 mt-1">{errors.currentWorkHoursWeek}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Deductions Section (Collapsible) */}
      <Card className="p-6">
        <button
          type="button"
          onClick={() => setShowDeductions(!showDeductions)}
          className="w-full flex items-center justify-between text-lg font-semibold"
        >
          <span>Frádráttarliðir ({totalDeductionRate.toFixed(1)}%)</span>
          <span>{showDeductions ? '▼' : '▶'}</span>
        </button>

        {showDeductions && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-neutral-600">
              Þessir liðir eru dregnir frá brúttólaunum áður en skattur er reiknaður.
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">
                {SALARY_DEDUCTIONS.lifeyrissjodur.label} (%)
              </label>
              <Input
                type="number"
                step="0.5"
                min={SALARY_DEDUCTIONS.lifeyrissjodur.min * 100}
                max={SALARY_DEDUCTIONS.lifeyrissjodur.max * 100}
                value={lifeyrissjodur}
                onChange={(e) => setLifeyrissjodur(Number(e.target.value))}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Skylduiðgjald: 4%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {SALARY_DEDUCTIONS.sereignarsjodur.label} (%)
              </label>
              <Input
                type="number"
                step="0.5"
                min={SALARY_DEDUCTIONS.sereignarsjodur.min * 100}
                max={SALARY_DEDUCTIONS.sereignarsjodur.max * 100}
                value={sereignarsjodur}
                onChange={(e) => setSereignarsjodur(Number(e.target.value))}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Valfrjálst: 0-4% (launagreiðandi mótframlag oft 2%)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {SALARY_DEDUCTIONS.stettarfelag.label} (%)
              </label>
              <Input
                type="number"
                step="0.1"
                min={SALARY_DEDUCTIONS.stettarfelag.min * 100}
                max={SALARY_DEDUCTIONS.stettarfelag.max * 100}
                value={stettarfelag}
                onChange={(e) => setStettarfelag(Number(e.target.value))}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Fer eftir stéttarfélagi, oft 0.5-2.5%
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Heildarfrádráttur:</span>
                <span className="font-medium">{totalDeductionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Á mánaðarlaunum:</span>
                <span>{formatISK(currentGrossMonthly * totalDeductionRate / 100)} kr</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Proposed Situation Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ný staða / launahækkun</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Ný mánaðarlaun (brúttó - fyrir skatta)
            </label>
            <Input
              type="text"
              inputMode="numeric"
              value={formatISK(proposedGrossMonthly)}
              onChange={(e) => setProposedGrossMonthly(parseISK(e.target.value))}
              placeholder="550.000"
              className={errors.proposedGrossMonthly ? 'border-red-500' : ''}
            />
            <p className="text-xs text-neutral-500 mt-1">
              = {formatISK(proposedGrossMonthly * 12)} kr/ári
              {proposedGrossMonthly > currentGrossMonthly && (
                <span className="text-success-600 ml-2">
                  (+{formatISK(proposedGrossMonthly - currentGrossMonthly)} kr/mán,{' '}
                  +{((proposedGrossMonthly - currentGrossMonthly) / currentGrossMonthly * 100).toFixed(1)}%)
                </span>
              )}
            </p>
            {errors.proposedGrossMonthly && (
              <p className="text-sm text-red-600 mt-1">{errors.proposedGrossMonthly}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameHours}
                onChange={(e) => setSameHours(e.target.checked)}
                className="rounded border-neutral-300"
              />
              <span className="text-sm">Sömu vinnustundir</span>
            </label>
          </div>

          {!sameHours && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Nýjar vinnustundir á viku
              </label>
              <Input
                type="number"
                value={proposedWorkHoursWeek}
                onChange={(e) => setProposedWorkHoursWeek(Number(e.target.value))}
                placeholder="40"
                className={errors.proposedWorkHoursWeek ? 'border-red-500' : ''}
              />
              {errors.proposedWorkHoursWeek && (
                <p className="text-sm text-red-600 mt-1">{errors.proposedWorkHoursWeek}</p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* FI Context Section (Optional) */}
      <Card className="p-6">
        <button
          type="button"
          onClick={() => setShowFIContext(!showFIContext)}
          className="w-full flex items-center justify-between text-lg font-semibold"
        >
          <span>FI samhengi (valfrjálst)</span>
          <span>{showFIContext ? '▼' : '▶'}</span>
        </button>

        {showFIContext && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mánaðarleg útgjöld
              </label>
              <Input
                type="number"
                value={annualExpenses / 12}
                onChange={(e) => setAnnualExpenses(Number(e.target.value) * 12)}
                placeholder="300.000"
              />
              <p className="text-xs text-neutral-500 mt-1">
                = {formatISK(annualExpenses)} kr/ári
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sparnaðarhlutfall (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={savingsRate}
                onChange={(e) => setSavingsRate(Number(e.target.value))}
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Núverandi eignasafn
              </label>
              <Input
                type="number"
                value={currentPortfolio}
                onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Vænt ávöxtun (%)
              </label>
              <Input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                placeholder="7.0"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          Reikna
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Hætta við
          </Button>
        )}
      </div>
    </form>
  );
}
