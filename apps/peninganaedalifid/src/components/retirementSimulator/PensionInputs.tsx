'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Slider } from '@/components/ui/Slider';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Alert } from '@/components/ui/Alert';
import {
  PENSION_AGE_RANGE,
  ICELANDIC_PENSION_DEFAULTS,
} from '@/lib/constants/retirementSimulator';

export interface PensionInputsProps {
  lifeyrissjodurEnabled: boolean;
  lifeyrissjodurAge: number;
  lifeyrissjodurAmount: number;
  lifeyrissjodurInflation: boolean;
  sereignEnabled: boolean;
  sereignAge: number;
  sereignAmount: number;
  sereignInflation: boolean;
  ellilifeyririEnabled: boolean;
  ellilifeyririAge: number;
  ellilifeyririAmount: number;
  ellilifeyririInflation: boolean;
  onLifeyrissjodurEnabledChange: (enabled: boolean) => void;
  onLifeyrissjodurAgeChange: (age: number) => void;
  onLifeyrissjodurAmountChange: (amount: number) => void;
  onLifeyrissjodurInflationChange: (enabled: boolean) => void;
  onSereignEnabledChange: (enabled: boolean) => void;
  onSereignAgeChange: (age: number) => void;
  onSereignAmountChange: (amount: number) => void;
  onSereignInflationChange: (enabled: boolean) => void;
  onEllilifeyririEnabledChange: (enabled: boolean) => void;
  onEllilifeyririAgeChange: (age: number) => void;
  onEllilifeyririAmountChange: (amount: number) => void;
  onEllilifeyririInflationChange: (enabled: boolean) => void;
}

/**
 * Pension Inputs Component
 *
 * Configuration for Icelandic pension system:
 * - Lífeyrissjóður (occupational pension fund) - typically age 60-67
 * - Séreignarlífeyrir (private pension) - available at age 60, NOT means-tested
 * - Ellilífeyrir (state pension from TR) - typically age 67+, means-tested
 *
 * All can be inflation-adjusted and have configurable start ages and amounts.
 */
export function PensionInputs({
  lifeyrissjodurEnabled,
  lifeyrissjodurAge,
  lifeyrissjodurAmount,
  lifeyrissjodurInflation,
  sereignEnabled,
  sereignAge,
  sereignAmount,
  sereignInflation,
  ellilifeyririEnabled,
  ellilifeyririAge,
  ellilifeyririAmount,
  ellilifeyririInflation,
  onLifeyrissjodurEnabledChange,
  onLifeyrissjodurAgeChange,
  onLifeyrissjodurAmountChange,
  onLifeyrissjodurInflationChange,
  onSereignEnabledChange,
  onSereignAgeChange,
  onSereignAmountChange,
  onSereignInflationChange,
  onEllilifeyririEnabledChange,
  onEllilifeyririAgeChange,
  onEllilifeyririAmountChange,
  onEllilifeyririInflationChange,
}: PensionInputsProps) {
  const totalMonthlyPension =
    (lifeyrissjodurEnabled ? lifeyrissjodurAmount : 0) +
    (sereignEnabled ? sereignAmount : 0) +
    (ellilifeyririEnabled ? ellilifeyririAmount : 0);

  const hasAnyPension = lifeyrissjodurEnabled || sereignEnabled || ellilifeyririEnabled;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Íslenskt lífeyriskerfi
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Lífeyrissjóður og ellilífeyrir (valfrjálst)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Information Alert */}
        <Alert variant="info">
          <div>
            <p className="text-sm mb-2">
              Lífeyristekjur lækka þörf fyrir úttektir úr eignasafni og bæta
              árangurslíkur eftirlaunaáætlunarinnar.
            </p>
            <ul className="text-xs space-y-1 ml-4 list-disc">
              <li>
                <strong>Lífeyrissjóður:</strong> Skylduframlag, venjulega frá 67 ára aldri
              </li>
              <li>
                <strong>Séreignarlífeyrir:</strong> Frjálst framlag, í boði frá 60 ára aldri.{' '}
                <span className="text-green-700 font-medium">Telst EKKI til tekna hjá TR!</span>
              </li>
              <li>
                <strong>Ellilífeyrir (TR):</strong> Ríkislífeyrir frá 67 ára aldri (tekjutengdur)
              </li>
            </ul>
          </div>
        </Alert>

        {/* Lífeyrissjóður Section */}
        <div className="space-y-4">
          <Checkbox
            label="Telja með lífeyrissjóð"
            checked={lifeyrissjodurEnabled}
            onChange={onLifeyrissjodurEnabledChange}
            helpText="Lífeyrir frá lífeyrissjóði (t.d. Birtu, LSR)"
          />

          {lifeyrissjodurEnabled && (
            <div className="ml-6 space-y-4 border-l-2 border-primary-200 pl-4">
              <Slider
                label="Aldur þegar lífeyrissjóður hefst"
                value={lifeyrissjodurAge}
                onChange={onLifeyrissjodurAgeChange}
                min={PENSION_AGE_RANGE.LIFEYRISSJODUR_MIN}
                max={PENSION_AGE_RANGE.LIFEYRISSJODUR_MAX}
                step={1}
                showValue
                formatValue={(v) => `${v} ára`}
              />

              <CurrencyInput
                label="Mánaðarleg greiðsla úr lífeyrissjóði"
                value={lifeyrissjodurAmount}
                onChange={onLifeyrissjodurAmountChange}
                helpText="Áætluð mánaðarleg greiðsla í núvirði"
              />

              <Checkbox
                label="Verðtryggt"
                checked={lifeyrissjodurInflation}
                onChange={onLifeyrissjodurInflationChange}
                helpText="Lífeyrir fylgir verðbólgu"
              />
            </div>
          )}
        </div>

        {/* Séreignarlífeyrir Section */}
        <div className="space-y-4">
          <Checkbox
            label="Telja með séreignarlífeyri"
            checked={sereignEnabled}
            onChange={onSereignEnabledChange}
            helpText="Frjálst framlag — telst EKKI til tekna hjá TR"
          />

          {sereignEnabled && (
            <div className="ml-6 space-y-4 border-l-2 border-green-200 pl-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                <strong>Mikilvægt:</strong> Séreignarlífeyrir hefur ekki áhrif á ellilífeyri frá TR.
                Þetta gerir hann að framúrskarandi tekjulind fyrir FIRE skipulag!
              </div>

              <Slider
                label="Aldur þegar séreignarlífeyrir hefst"
                value={sereignAge}
                onChange={onSereignAgeChange}
                min={PENSION_AGE_RANGE.SEREIGN_MIN}
                max={PENSION_AGE_RANGE.SEREIGN_MAX}
                step={1}
                showValue
                formatValue={(v) => `${v} ára`}
              />

              <CurrencyInput
                label="Mánaðarleg greiðsla úr séreignarlífeyri"
                value={sereignAmount}
                onChange={onSereignAmountChange}
                helpText="Áætluð mánaðarleg greiðsla í núvirði"
              />

              <Checkbox
                label="Verðtryggt"
                checked={sereignInflation}
                onChange={onSereignInflationChange}
                helpText="Séreignarlífeyrir fylgir verðbólgu"
              />
            </div>
          )}
        </div>

        {/* Ellilífeyrir Section */}
        <div className="space-y-4">
          <Checkbox
            label="Telja með ellilífeyri"
            checked={ellilifeyririEnabled}
            onChange={onEllilifeyririEnabledChange}
            helpText="Ríkislífeyrir frá Tryggingastofnun (tekjutengdur)"
          />

          {ellilifeyririEnabled && (
            <div className="ml-6 space-y-4 border-l-2 border-primary-200 pl-4">
              <Slider
                label="Aldur þegar ellilífeyrir hefst"
                value={ellilifeyririAge}
                onChange={onEllilifeyririAgeChange}
                min={PENSION_AGE_RANGE.ELLILIFEYRIR_MIN}
                max={PENSION_AGE_RANGE.ELLILIFEYRIR_MAX}
                step={1}
                showValue
                formatValue={(v) => `${v} ára`}
              />

              <CurrencyInput
                label="Mánaðarleg greiðsla úr ellilífeyri"
                value={ellilifeyririAmount}
                onChange={onEllilifeyririAmountChange}
                helpText="Áætluð mánaðarleg greiðsla í núvirði"
              />

              <Checkbox
                label="Verðtryggt"
                checked={ellilifeyririInflation}
                onChange={onEllilifeyririInflationChange}
                helpText="Ellilífeyrir fylgir verðbólgu"
              />
            </div>
          )}
        </div>

        {/* Total Pension Summary */}
        {hasAnyPension && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 text-sm mb-2">
              Samtals lífeyristekjur
            </h4>
            <div className="space-y-2">
              {lifeyrissjodurEnabled && (
                <div className="flex justify-between text-sm text-green-800">
                  <span>Lífeyrissjóður (frá {lifeyrissjodurAge} ára):</span>
                  <span className="font-semibold">
                    {lifeyrissjodurAmount.toLocaleString('is-IS')} kr/mán
                  </span>
                </div>
              )}
              {sereignEnabled && (
                <div className="flex justify-between text-sm text-green-800">
                  <span>Séreignarlífeyrir (frá {sereignAge} ára):</span>
                  <span className="font-semibold">
                    {sereignAmount.toLocaleString('is-IS')} kr/mán
                  </span>
                </div>
              )}
              {ellilifeyririEnabled && (
                <div className="flex justify-between text-sm text-green-800">
                  <span>Ellilífeyrir (frá {ellilifeyririAge} ára):</span>
                  <span className="font-semibold">
                    {ellilifeyririAmount.toLocaleString('is-IS')} kr/mán
                  </span>
                </div>
              )}
              {(lifeyrissjodurEnabled || sereignEnabled || ellilifeyririEnabled) &&
               (lifeyrissjodurEnabled ? 1 : 0) + (sereignEnabled ? 1 : 0) + (ellilifeyririEnabled ? 1 : 0) > 1 && (
                <div className="flex justify-between text-sm text-green-900 font-semibold pt-2 border-t border-green-200">
                  <span>Samtals (þegar allt er í gildi):</span>
                  <span>
                    {totalMonthlyPension.toLocaleString('is-IS')} kr/mán
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Default Values Reference */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-neutral-900 mb-2">
            Dæmigerðar upphæðir
          </h4>
          <div className="space-y-1 text-neutral-600">
            <div className="flex justify-between">
              <span>Lífeyrissjóður:</span>
              <span>
                {ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY.toLocaleString('is-IS')} kr/mán
              </span>
            </div>
            <div className="flex justify-between">
              <span>Séreignarlífeyrir:</span>
              <span>
                {ICELANDIC_PENSION_DEFAULTS.TYPICAL_SEREIGN_MONTHLY.toLocaleString('is-IS')} kr/mán
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ellilífeyrir:</span>
              <span>
                {ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY.toLocaleString('is-IS')} kr/mán
              </span>
            </div>
            <p className="text-xs mt-2">
              Þetta eru áætluð meðalgildi. Raunverulegar upphæðir fara eftir
              iðgjaldagreiðslum, tekjum og hjúskaparstöðu.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
