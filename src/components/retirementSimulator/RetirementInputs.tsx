'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Alert } from '@/components/ui/Alert';
import {
  CURRENT_AGE_RANGE,
  RETIREMENT_AGE_RANGE,
  LIFE_EXPECTANCY_RANGE,
} from '@/lib/constants/retirementSimulator';

export interface RetirementInputsProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentBalance: number;
  monthlySavings: number;
  monthlyExpenses: number;
  onCurrentAgeChange: (value: number) => void;
  onRetirementAgeChange: (value: number) => void;
  onLifeExpectancyChange: (value: number) => void;
  onCurrentBalanceChange: (value: number) => void;
  onMonthlySavingsChange: (value: number) => void;
  onMonthlyExpensesChange: (value: number) => void;
}

/**
 * Retirement Inputs Component
 *
 * Core inputs for retirement planning:
 * - Current age and retirement age
 * - Life expectancy
 * - Current portfolio balance
 * - Monthly savings until retirement
 * - Monthly expenses in retirement
 */
export function RetirementInputs({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentBalance,
  monthlySavings,
  monthlyExpenses,
  onCurrentAgeChange,
  onRetirementAgeChange,
  onLifeExpectancyChange,
  onCurrentBalanceChange,
  onMonthlySavingsChange,
  onMonthlyExpensesChange,
}: RetirementInputsProps) {
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

  // Validation warnings
  const showEarlyRetirementWarning = retirementAge < 60;
  const showLongRetirementWarning = yearsInRetirement > 40;
  const showAgeValidationError = retirementAge <= currentAge;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Grunnupplýsingar um eftirlaun
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Aldur, tímabil og fjárhagsstöðu
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Inputs */}
        <div className="space-y-4">
          <Slider
            label="Núverandi aldur"
            value={currentAge}
            onChange={onCurrentAgeChange}
            min={CURRENT_AGE_RANGE.MIN}
            max={CURRENT_AGE_RANGE.MAX}
            step={1}
            showValue
            formatValue={(v) => `${v} ára`}
          />

          <Slider
            label="Eftirlaunaaldur"
            value={retirementAge}
            onChange={onRetirementAgeChange}
            min={RETIREMENT_AGE_RANGE.MIN}
            max={RETIREMENT_AGE_RANGE.MAX}
            step={1}
            showValue
            formatValue={(v) => `${v} ára`}
          />

          <Slider
            label="Lífslíkur"
            value={lifeExpectancy}
            onChange={onLifeExpectancyChange}
            min={LIFE_EXPECTANCY_RANGE.MIN}
            max={LIFE_EXPECTANCY_RANGE.MAX}
            step={1}
            showValue
            formatValue={(v) => `${v} ára`}
          />
        </div>

        {/* Timeline Summary */}
        <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Ár til starfsloka:</span>
            <span className="font-semibold text-neutral-900">
              {yearsToRetirement} ár
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Ár á eftirlaunum:</span>
            <span className="font-semibold text-neutral-900">
              {yearsInRetirement} ár
            </span>
          </div>
        </div>

        {/* Age Validation Errors */}
        {showAgeValidationError && (
          <Alert variant="error">
            <p className="text-sm">
              Eftirlaunaaldur verður að vera hærri en núverandi aldur.
            </p>
          </Alert>
        )}

        {/* Early Retirement Warning */}
        {showEarlyRetirementWarning && !showAgeValidationError && (
          <Alert variant="warning">
            <p className="text-sm">
              <strong>Snemmbúin eftirlaun:</strong> Lífeyrissjóður er venjulega í boði
              frá 60 ára aldri og ellilífeyrir frá 67 ára aldri. Eignasafnið þitt þarf að
              endist lengur áður en lífeyristekjur hefjast.
            </p>
          </Alert>
        )}

        {/* Long Retirement Warning */}
        {showLongRetirementWarning && (
          <Alert variant="info">
            <p className="text-sm">
              Þú ert að áætla {yearsInRetirement} ár á eftirlaunum. Íhugaðu íhaldssama
              nálgun með hærra margfaldara eða lægri úttektarhlutfalli.
            </p>
          </Alert>
        )}

        <div className="border-t border-neutral-200 pt-6 space-y-4">
          <h3 className="font-semibold text-neutral-900">Fjárhagsstaða</h3>

          <CurrencyInput
            label="Núverandi eignasafn"
            value={currentBalance}
            onChange={onCurrentBalanceChange}
            helpText="Heildarverðmæti fjárfestinga (hlutabréf, sjóðir, o.fl.)"
          />

          <CurrencyInput
            label="Mánaðarlegur sparnaður"
            value={monthlySavings}
            onChange={onMonthlySavingsChange}
            helpText="Upphæð sem þú sparar á mánuði þar til þú ferð á eftirlaun"
          />

          <CurrencyInput
            label="Mánaðarleg útgjöld á eftirlaunum"
            value={monthlyExpenses}
            onChange={onMonthlyExpensesChange}
            helpText="Áætluð mánaðarútgjöld á eftirlaunum (í núvirði)"
          />
        </div>

        {/* FI Number Reference */}
        {monthlyExpenses > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">
              FI tala tilvísun
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Árleg útgjöld:</span>
                <span className="font-semibold">
                  {(monthlyExpenses * 12).toLocaleString('is-IS')} kr
                </span>
              </div>
              <div className="flex justify-between">
                <span>FI tala (25x):</span>
                <span className="font-semibold">
                  {(monthlyExpenses * 12 * 25).toLocaleString('is-IS')} kr
                </span>
              </div>
              <div className="flex justify-between">
                <span>FI tala (30x):</span>
                <span className="font-semibold">
                  {(monthlyExpenses * 12 * 30).toLocaleString('is-IS')} kr
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
