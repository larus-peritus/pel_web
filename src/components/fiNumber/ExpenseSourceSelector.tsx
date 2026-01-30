'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { TierSelector } from '@/components/expenseBaseline/TierSelector';
import type { ExpenseTier } from '@/types/expenseBaseline';
import type { ExpenseSource } from '@/types/fiNumber';

export interface ExpenseSourceSelectorProps {
  expenseSource: 'baseline' | 'custom';
  selectedTier: ExpenseTier | null;
  customMonthlyExpense: number;
  hasBaseline: boolean;
  baselineExpenses?: {
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
  onSourceChange: (source: ExpenseSource) => void;
  onTierChange: (tier: ExpenseTier) => void;
  onCustomExpenseChange: (amount: number) => void;
}

/**
 * ExpenseSourceSelector - Component to toggle between expense baseline and custom input
 *
 * Features:
 * - Radio group to select expense source (baseline vs custom)
 * - If baseline selected and exists: show TierSelector
 * - If baseline selected but doesn't exist: show warning prompt
 * - If custom selected: show CurrencyInput for monthly expense
 * - Validation on custom input (must be > 0)
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <ExpenseSourceSelector
 *   expenseSource="baseline"
 *   selectedTier="comfortable"
 *   customMonthlyExpense={500000}
 *   hasBaseline={true}
 *   baselineExpenses={{ barebones: 250000, comfortable: 520000, deluxe: 1000000 }}
 *   onSourceChange={(source) => setExpenseSource(source)}
 *   onTierChange={(tier) => setSelectedTier(tier)}
 *   onCustomExpenseChange={(amount) => setCustomExpense(amount)}
 * />
 * ```
 */
export function ExpenseSourceSelector({
  expenseSource,
  selectedTier,
  customMonthlyExpense,
  hasBaseline,
  baselineExpenses,
  onSourceChange,
  onTierChange,
  onCustomExpenseChange,
}: ExpenseSourceSelectorProps) {
  // Validation state for custom expense
  const [customExpenseError, setCustomExpenseError] = React.useState<string | null>(null);
  const [customExpenseWarning, setCustomExpenseWarning] = React.useState<string | null>(null);

  /**
   * Handle custom expense change with validation
   */
  const handleCustomExpenseChange = (amount: number) => {
    // Reset validation states
    setCustomExpenseError(null);
    setCustomExpenseWarning(null);

    // Validate amount - Errors (blocking)
    if (amount <= 0) {
      setCustomExpenseError('Útgjöld verða að vera jákvæð');
    } else if (amount > 10_000_000) {
      setCustomExpenseError('Útgjöld virðast óraunhæf (> 10M kr/mán)');
    }
    // Warnings (non-blocking)
    else if (amount < 50_000) {
      setCustomExpenseWarning('Þetta virðist mjög lágt - tryggðu að þú hafir tekið alla útgjöld með');
    } else if (amount > 2_000_000) {
      setCustomExpenseWarning('Þetta eru há útgjöld - tryggðu að talan sé rétt');
    }

    // Update parent state
    onCustomExpenseChange(amount);
  };

  /**
   * Handle source change
   */
  const handleSourceChange = (source: ExpenseSource) => {
    onSourceChange(source);

    // If switching to baseline and no tier selected, default to comfortable
    if (source === 'baseline' && !selectedTier && hasBaseline) {
      onTierChange('comfortable');
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 mb-4">
            Veldu útgjaldauppruna
          </h3>

          {/* Radio group for expense source */}
          <div role="radiogroup" aria-label="Veldu útgjaldauppruna" className="space-y-4">
            {/* Option 1: Use expense baseline */}
            <div className="space-y-3">
              <button
                type="button"
                role="radio"
                aria-checked={expenseSource === 'baseline'}
                onClick={() => handleSourceChange('baseline')}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                  expenseSource === 'baseline'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                )}
              >
                {/* Radio indicator */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    'transition-colors',
                    expenseSource === 'baseline'
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-400'
                  )}
                >
                  {expenseSource === 'baseline' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'font-medium text-left',
                    expenseSource === 'baseline' ? 'text-primary-900' : 'text-neutral-700'
                  )}
                >
                  Nota útgjaldagrunn
                </span>
              </button>

              {/* Show TierSelector if baseline selected and exists */}
              {expenseSource === 'baseline' && hasBaseline && (
                <div className="ml-8">
                  <TierSelector
                    selectedTier={selectedTier}
                    onSelectTier={onTierChange}
                    showExpenseAmount
                    tierExpenses={baselineExpenses}
                  />
                </div>
              )}

              {/* Show warning if baseline selected but doesn't exist */}
              {expenseSource === 'baseline' && !hasBaseline && (
                <div className="ml-8">
                  <Alert variant="warning">
                    <p className="font-medium mb-2">Útgjaldagrunnur ekki til staðar</p>
                    <p className="text-sm mb-3">
                      Til að nota útgjaldagrunn verður þú að setja hann upp fyrst. Þetta tekur
                      aðeins nokkrar mínútur og gefur þér nákvæmari yfirsýn yfir útgjöld þín.
                    </p>
                    <a
                      href="/utgjaldareiknivel"
                      className="inline-flex items-center gap-2 text-sm font-medium text-warning-800 hover:text-warning-900 underline"
                    >
                      Setja upp útgjaldagrunn
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </Alert>
                </div>
              )}
            </div>

            {/* Option 2: Custom expense input */}
            <div className="space-y-3">
              <button
                type="button"
                role="radio"
                aria-checked={expenseSource === 'custom'}
                onClick={() => handleSourceChange('custom')}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                  expenseSource === 'custom'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                )}
              >
                {/* Radio indicator */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    'transition-colors',
                    expenseSource === 'custom'
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-400'
                  )}
                >
                  {expenseSource === 'custom' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'font-medium text-left',
                    expenseSource === 'custom' ? 'text-primary-900' : 'text-neutral-700'
                  )}
                >
                  Slá inn sérsniðin útgjöld
                </span>
              </button>

              {/* Show CurrencyInput if custom selected */}
              {expenseSource === 'custom' && (
                <div className="ml-8 space-y-2">
                  <CurrencyInput
                    label="Mánaðarleg útgjöld"
                    value={customMonthlyExpense}
                    onChange={handleCustomExpenseChange}
                    error={customExpenseError || undefined}
                    helpText="Áætluð mánaðarleg útgjöld í ISK"
                    placeholder="0 kr"
                    required
                  />
                  {/* Warning message (non-blocking) */}
                  {customExpenseWarning && !customExpenseError && (
                    <div className="flex gap-2 p-3 rounded-md bg-warning-50 border border-warning-200">
                      <svg
                        className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-warning-700">{customExpenseWarning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info alert explaining the purpose */}
        <Alert variant="info">
          <p className="text-sm">
            <strong>Ábending:</strong> Ef þú hefur sett upp útgjaldagrunn mælum við með að nota
            hann hér. Hann gefur þér nákvæmari yfirsýn og gerir þér kleift að bera saman
            mismunandi FI atburðarásir (lágmarks, þægilegt, lúxus).
          </p>
        </Alert>
      </CardContent>
    </Card>
  );
}
