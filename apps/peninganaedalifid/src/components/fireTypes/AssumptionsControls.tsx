'use client';

import * as React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { validateAssumptions } from '@/lib/validation/fireTypes';
import { DEFAULT_FIRE_ASSUMPTIONS } from '@/types/fireTypes';
import { Slider } from '@/components/ui/Slider';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

/**
 * AssumptionsControls Component
 *
 * Advanced settings for FIRE calculation assumptions.
 * Features:
 * - Withdrawal rate slider (3-5%, default 4%)
 * - Growth rate slider (4-8%, default 6%)
 * - Show current values
 * - Reset to defaults button
 * - Collapsible section
 * - Help tooltips
 * - Real-time validation
 */
export function AssumptionsControls() {
  const { fireTypePreferences, updateFIREAssumptions, resetFIREAssumptions } =
    useCalculator();

  // Collapsible state
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Get current assumptions (custom or defaults)
  const customAssumptions = fireTypePreferences?.customAssumptions || {};
  const withdrawalRate =
    customAssumptions.withdrawalRate ?? DEFAULT_FIRE_ASSUMPTIONS.withdrawalRate;
  const expectedGrowthRate =
    customAssumptions.expectedGrowthRate ??
    DEFAULT_FIRE_ASSUMPTIONS.expectedGrowthRate;

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    Array<{ field: string; message: string }>
  >([]);
  const [validationWarnings, setValidationWarnings] = React.useState<
    Array<{ field: string; message: string }>
  >([]);

  /**
   * Validate assumptions whenever they change
   */
  React.useEffect(() => {
    const result = validateAssumptions({
      withdrawalRate,
      expectedGrowthRate,
    });
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
  }, [withdrawalRate, expectedGrowthRate]);

  /**
   * Handle withdrawal rate change
   */
  const handleWithdrawalRateChange = (value: number) => {
    updateFIREAssumptions({ withdrawalRate: value / 100 });
  };

  /**
   * Handle growth rate change
   */
  const handleGrowthRateChange = (value: number) => {
    updateFIREAssumptions({ expectedGrowthRate: value / 100 });
  };

  /**
   * Reset to default assumptions
   */
  const handleReset = () => {
    resetFIREAssumptions();
  };

  /**
   * Get warning for a specific field
   */
  const getFieldWarning = (fieldName: string): string | undefined => {
    return validationWarnings.find((w) => w.field === fieldName)?.message;
  };

  /**
   * Check if using custom values (different from defaults)
   */
  const isCustom =
    withdrawalRate !== DEFAULT_FIRE_ASSUMPTIONS.withdrawalRate ||
    expectedGrowthRate !== DEFAULT_FIRE_ASSUMPTIONS.expectedGrowthRate;

  return (
    <Card className="overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50"
        aria-expanded={isExpanded}
        aria-controls="assumptions-content"
      >
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Ítarlegri stillingar
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Breyttu forsendum fyrir útreikninga (valfrjálst)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCustom && (
            <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
              Sérsniðið
            </span>
          )}
          <svg
            className={`h-5 w-5 text-neutral-700 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
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
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div id="assumptions-content" className="border-t border-neutral-200 p-6">
          <div className="space-y-6">
            {/* Info Alert */}
            <Alert variant="info">
              Þessar stillingar hafa áhrif á alla FIRE útreikninga. Sjálfgefin gildi eru
              byggð á alþjóðlegum rannsóknum og íslenskum aðstæðum.
            </Alert>

            {/* Withdrawal Rate */}
            <div className="space-y-2">
              <Slider
                label="Úttektarhlutfall"
                value={withdrawalRate * 100}
                onChange={handleWithdrawalRateChange}
                min={3}
                max={5}
                step={0.1}
                showValue
                formatValue={(val) => `${val.toFixed(1)}%`}
              />
              <div className="rounded-lg bg-neutral-50 p-3">
                <p className="text-xs text-neutral-700">
                  <strong>Hvað er þetta?</strong> Hlutfall FI-tölunnar sem þú getur tekið
                  út á ári án þess að tæma sparnaðinn. 4% úttektarhlutfall þýðir að þú
                  þarft 25x árlega útgjöld (100 ÷ 4 = 25).
                </p>
                <p className="mt-2 text-xs text-neutral-600">
                  <strong>Dæmi:</strong> Með {(withdrawalRate * 100).toFixed(1)}%
                  úttektarhlutfall þarftu{' '}
                  {(1 / withdrawalRate).toFixed(1)}x árlega útgjöld þín.
                </p>
              </div>
              {getFieldWarning('withdrawalRate') && (
                <Alert variant="warning">
                  {getFieldWarning('withdrawalRate')}
                </Alert>
              )}
            </div>

            {/* Growth Rate */}
            <div className="space-y-2">
              <Slider
                label="Vænt ávöxtun (á ári)"
                value={expectedGrowthRate * 100}
                onChange={handleGrowthRateChange}
                min={4}
                max={8}
                step={0.25}
                showValue
                formatValue={(val) => `${val.toFixed(2)}%`}
              />
              <div className="rounded-lg bg-neutral-50 p-3">
                <p className="text-xs text-neutral-700">
                  <strong>Hvað er þetta?</strong> Vænt árleg ávöxtun fjárfestinga þinna að
                  frádregnum kostnaði og verðbólgu. Söguleg langtíma raunávöxtun á
                  alþjóðlegum hlutabréfamarkaði er um 6-7%.
                </p>
                <p className="mt-2 text-xs text-neutral-600">
                  <strong>Dæmi:</strong> Með {(expectedGrowthRate * 100).toFixed(2)}%
                  ávöxtun tvöfaldast fjárfestingar þínar á{' '}
                  {(72 / (expectedGrowthRate * 100)).toFixed(1)} árum (regla 72).
                </p>
              </div>
              {getFieldWarning('expectedGrowthRate') && (
                <Alert variant="warning">
                  {getFieldWarning('expectedGrowthRate')}
                </Alert>
              )}
            </div>

            {/* Real Return Display */}
            <div className="rounded-lg border-2 border-success-200 bg-success-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-success-900">
                  Raunávöxtun (ávöxtun - verðbólga)
                </span>
                <span className="text-lg font-bold text-success-700">
                  {((expectedGrowthRate - DEFAULT_FIRE_ASSUMPTIONS.inflationRate) * 100).toFixed(
                    2
                  )}%
                </span>
              </div>
              <p className="mt-1 text-xs text-success-700">
                Þetta er raunveruleg ávöxtun þín að teknu tilliti til verðbólgu (
                {(DEFAULT_FIRE_ASSUMPTIONS.inflationRate * 100).toFixed(1)}%)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={!isCustom}
              >
                Endurstilla sjálfgefin gildi
              </Button>
              {isCustom && (
                <span className="text-xs text-neutral-600">
                  Notum sérsniðin gildi
                </span>
              )}
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="error">
                <strong>Villur í stillingum:</strong>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error.message}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* General Warnings */}
            {validationWarnings.length > 2 && (
              <Alert variant="warning">
                <strong>Athugaðu:</strong> Margar viðvaranir um forsendur - gakktu úr
                skugga um að þær séu raunhæfar fyrir þínar aðstæður.
              </Alert>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
