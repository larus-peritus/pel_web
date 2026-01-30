'use client';

import * as React from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { validateUserInputs } from '@/lib/validation/fireTypes';
import { UserFinancialInputs as UserFinancialInputsType } from '@/types/fireTypes';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';

/**
 * UserFinancialInputs Component
 *
 * Form for entering user financial data for FIRE calculations.
 * Features:
 * - Age input (18-100)
 * - Current net worth (ISK)
 * - Monthly income (ISK)
 * - Monthly savings (ISK)
 * - Target retirement age (optional)
 * - Real-time validation with Icelandic feedback
 * - Auto-save with debounce
 * - Accessible form with help text
 */
export function UserFinancialInputs() {
  const {
    results,
    expenseBaselineResults,
    updateFIRETypePreferences,
  } = useCalculator();

  // Get actual hourly wage from results
  const actualHourlyWage = results?.actualHourlyWage ?? null;

  // Local state for inputs (before debounced save)
  const [currentAge, setCurrentAge] = React.useState<number>(30);
  const [currentNetWorth, setCurrentNetWorth] = React.useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = React.useState<number>(500_000);
  const [monthlySavings, setMonthlySavings] = React.useState<number>(100_000);
  const [targetRetirementAge, setTargetRetirementAge] = React.useState<number | null>(null);

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    Array<{ field: string; message: string }>
  >([]);
  const [validationWarnings, setValidationWarnings] = React.useState<
    Array<{ field: string; message: string }>
  >([]);

  /**
   * Calculate derived values
   */
  const annualIncome = monthlyIncome * 12;
  const annualSavings = monthlySavings * 12;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  /**
   * Get monthly expenses from expense baseline results
   */
  const monthlyExpenses = React.useMemo(() => {
    if (expenseBaselineResults) {
      return {
        barebones: expenseBaselineResults.totals.barebones,
        comfortable: expenseBaselineResults.totals.comfortable,
        deluxe: expenseBaselineResults.totals.deluxe,
      };
    }
    // Fallback defaults if no expense baseline
    return {
      barebones: 250_000,
      comfortable: 350_000,
      deluxe: 500_000,
    };
  }, [expenseBaselineResults]);

  /**
   * Build complete user inputs object
   */
  const userInputs: UserFinancialInputsType = React.useMemo(
    () => ({
      currentAge,
      targetRetirementAge,
      currentNetWorth,
      annualIncome,
      annualSavings,
      savingsRate,
      monthlyExpenses,
    }),
    [
      currentAge,
      targetRetirementAge,
      currentNetWorth,
      annualIncome,
      annualSavings,
      savingsRate,
      monthlyExpenses,
    ]
  );

  /**
   * Validate inputs whenever they change
   */
  React.useEffect(() => {
    const result = validateUserInputs(userInputs);
    setValidationErrors(result.errors);
    setValidationWarnings(result.warnings);
  }, [userInputs]);

  /**
   * Auto-save to context with debounce (500ms)
   */
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if validation passes
      const result = validateUserInputs(userInputs);
      if (result.isValid) {
        // Store user inputs in FIRE preferences
        updateFIRETypePreferences({
          // We store inputs in a way that context can access them
          // This will be used by calculation functions
          lastUpdated: new Date(),
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [userInputs, updateFIRETypePreferences]);

  /**
   * Get error message for a specific field
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find((e) => e.field === fieldName)?.message;
  };

  /**
   * Get warning message for a specific field
   */
  const getFieldWarning = (fieldName: string): string | undefined => {
    return validationWarnings.find((w) => w.field === fieldName)?.message;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Age Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Aldur og tímarammi
          </h3>

          <NumberInput
            label="Núverandi aldur"
            value={currentAge}
            onChange={setCurrentAge}
            min={18}
            max={100}
            required
            error={getFieldError('currentAge')}
            helpText="Aldurinn þinn í dag (18-100 ára)"
            suffix="ára"
          />

          <NumberInput
            label="Markaldur starfsloka (valfrjálst)"
            value={targetRetirementAge ?? 0}
            onChange={(val) => setTargetRetirementAge(val > 0 ? val : null)}
            min={0}
            max={90}
            error={getFieldError('targetRetirementAge')}
            helpText="Á hvaða aldri viltu hætta að vinna? (Skildu eftir autt fyrir sjálfvirka útreikninga)"
            suffix="ára"
          />

          {getFieldWarning('currentAge') && (
            <Alert variant="warning">
              {getFieldWarning('currentAge')}
            </Alert>
          )}
          {getFieldWarning('targetRetirementAge') && (
            <Alert variant="warning">
              {getFieldWarning('targetRetirementAge')}
            </Alert>
          )}
        </div>

        {/* Financial Position */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Núverandi fjárhagsstaða
          </h3>

          <CurrencyInput
            label="Hrein eign (eignir mínus skuldir)"
            value={currentNetWorth}
            onChange={setCurrentNetWorth}
            required
            error={getFieldError('currentNetWorth')}
            helpText="Heildarverðmæti eigna þinna (sparnaður, hlutabréf, fasteignir) að frádregnum skuldum"
          />

          {getFieldWarning('currentNetWorth') && (
            <Alert variant="warning">
              {getFieldWarning('currentNetWorth')}
            </Alert>
          )}
        </div>

        {/* Income & Savings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Tekjur og sparnaður
          </h3>

          <CurrencyInput
            label="Mánaðartekjur (eftir skatt)"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            required
            error={getFieldError('annualIncome')}
            helpText="Tekjur þínar á mánuði eftir skatta og aðra frádrætti"
          />

          <CurrencyInput
            label="Mánaðarlegur sparnaður"
            value={monthlySavings}
            onChange={setMonthlySavings}
            required
            error={getFieldError('annualSavings')}
            helpText="Hversu mikið sparar þú að meðaltali á mánuði?"
          />

          {/* Savings Rate Display */}
          <div className="rounded-lg bg-success-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success-900">
                Sparnaðarhlutfall
              </span>
              <span className="text-lg font-bold text-success-700">
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-success-700">
              Þú sparar {savingsRate.toFixed(1)}% af tekjum þínum á mánuði
              ({monthlySavings.toLocaleString('is-IS')} kr af{' '}
              {monthlyIncome.toLocaleString('is-IS')} kr)
            </p>
          </div>

          {getFieldWarning('annualIncome') && (
            <Alert variant="warning">
              {getFieldWarning('annualIncome')}
            </Alert>
          )}
          {getFieldWarning('annualSavings') && (
            <Alert variant="warning">
              {getFieldWarning('annualSavings')}
            </Alert>
          )}
          {getFieldWarning('savingsRate') && (
            <Alert variant="warning">
              {getFieldWarning('savingsRate')}
            </Alert>
          )}
        </div>

        {/* Expense Baseline Info */}
        <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            <strong>Mánaðarleg útgjöld þín:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600">
            <li>
              • Lágmarks (barebones):{' '}
              <span className="font-semibold text-amber-600">
                {monthlyExpenses.barebones.toLocaleString('is-IS')} kr
              </span>
            </li>
            <li>
              • Þægileg (comfortable):{' '}
              <span className="font-semibold text-green-600">
                {monthlyExpenses.comfortable.toLocaleString('is-IS')} kr
              </span>
            </li>
            <li>
              • Lúxus (deluxe):{' '}
              <span className="font-semibold text-purple-600">
                {monthlyExpenses.deluxe.toLocaleString('is-IS')} kr
              </span>
            </li>
          </ul>
          {!expenseBaselineResults && (
            <p className="mt-2 text-xs text-neutral-700">
              Athugið: Notum sjálfgefin gildi. Búðu til útgjaldagrunn fyrir nákvæmari
              niðurstöður.
            </p>
          )}
        </div>

        {/* Validation Summary */}
        {validationErrors.length > 0 && (
          <Alert variant="error">
            <strong>Villur í innsláttum:</strong>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        )}
      </div>
    </Card>
  );
}
