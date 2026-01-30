'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Button } from '@/components/ui/Button';
import { ICELANDIC_EXPENSE_EXAMPLES } from '@/lib/constants/emergencyFund';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';

/**
 * Emergency Fund Input Form
 *
 * Collects balance and monthly expenses with:
 * - Real-time validation
 * - Debounced updates to context
 * - Integration with Savings Report (emergency fund balance)
 * - Integration with Current Expense Report (essential expenses)
 * - Icelandic expense presets as fallback
 */
export function EmergencyFundInputs() {
  const {
    emergencyFundData,
    updateEmergencyFundData,
    clearEmergencyFundData,
    savingsReport,
    currentExpenseResults,
  } = useCalculator();

  // Local state for inputs (debounced before updating context)
  const [balance, setBalance] = useState(emergencyFundData?.balance ?? 0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(emergencyFundData?.monthlyExpenses ?? 0);

  // Validation states
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [expensesError, setExpensesError] = useState<string | null>(null);

  // Get emergency fund balance from savings report
  const emergencyFundFromSavings = savingsReport?.categories?.find(
    (cat) => cat.id === 'neydarsjodur'
  )?.data?.balance;

  // Get essential expenses from current expense report
  const essentialExpensesFromReport = currentExpenseResults?.essentialBreakdown?.essentialMonthly;

  // Check if we have data from other reports
  const hasEmergencyFundInSavings = emergencyFundFromSavings !== undefined && emergencyFundFromSavings > 0;
  const hasEssentialExpenses = essentialExpensesFromReport !== undefined && essentialExpensesFromReport > 0;

  // Update local state when context data changes (from load/import)
  useEffect(() => {
    if (emergencyFundData) {
      setBalance(emergencyFundData.balance);
      setMonthlyExpenses(emergencyFundData.monthlyExpenses);
    }
  }, [emergencyFundData]);

  // Debounced update to context
  useEffect(() => {
    // Validate
    let hasError = false;

    if (balance < 0) {
      setBalanceError('Staða getur ekki verið neikvæð');
      hasError = true;
    } else {
      setBalanceError(null);
    }

    if (monthlyExpenses <= 0) {
      setExpensesError('Útgjöld verða að vera jákvæð tala');
      hasError = true;
    } else {
      setExpensesError(null);
    }

    if (hasError) return;

    // Debounce: wait 300ms before updating context
    const timeoutId = setTimeout(() => {
      updateEmergencyFundData({
        balance,
        monthlyExpenses,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [balance, monthlyExpenses, updateEmergencyFundData]);

  // Pull from savings report
  const handlePullFromSavings = useCallback(() => {
    if (emergencyFundFromSavings !== undefined) {
      setBalance(emergencyFundFromSavings);
    }
  }, [emergencyFundFromSavings]);

  // Pull from expense report
  const handlePullFromExpenses = useCallback(() => {
    if (essentialExpensesFromReport !== undefined) {
      setMonthlyExpenses(essentialExpensesFromReport);
    }
  }, [essentialExpensesFromReport]);

  // Preset handlers
  const handlePresetClick = useCallback((amount: number) => {
    setMonthlyExpenses(amount);
  }, []);

  // Clear handler
  const handleClear = useCallback(() => {
    setBalance(0);
    setMonthlyExpenses(0);
    clearEmergencyFundData();
  }, [clearEmergencyFundData]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Upplýsingar um neyðarsjóð
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            Sláðu inn núverandi stöðu neyðarsjóðsins þíns og mánaðarleg nauðsynleg útgjöld.
          </p>
        </div>

        {/* Balance Input */}
        <div className="space-y-2">
          <CurrencyInput
            label="Staða neyðarsjóðs"
            value={balance}
            onChange={setBalance}
            placeholder="0"
            helpText="Heildarupphæð sem þú hefur í neyðarsjóði"
            error={balanceError ?? undefined}
            required
          />

          {/* Pull from Savings Report option */}
          {hasEmergencyFundInSavings ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePullFromSavings}
              className="flex items-center gap-2"
            >
              <span>🛡️</span>
              <span>
                Sækja úr sparnaðarskýrslu ({formatCurrency(emergencyFundFromSavings!)})
              </span>
            </Button>
          ) : (
            <p className="text-xs text-neutral-500">
              💡 Fylltu út{' '}
              <Link href="/sparnadarskyrsla" className="text-emerald-600 hover:underline">
                sparnaðarskýrslu
              </Link>{' '}
              til að sækja stöðu sjálfkrafa
            </p>
          )}
        </div>

        {/* Monthly Expenses Input */}
        <div className="space-y-2">
          <CurrencyInput
            label="Mánaðarleg nauðsynleg útgjöld"
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            placeholder="0"
            helpText="Grunnútgjöld til að lifa (húsaleiga, matur, veitur, etc.)"
            error={expensesError ?? undefined}
            required
          />

          {/* Pull from Expense Report option */}
          {hasEssentialExpenses ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePullFromExpenses}
              className="flex items-center gap-2"
            >
              <span>📊</span>
              <span>
                Sækja úr útgjaldaskýrslu ({formatCurrency(essentialExpensesFromReport!)})
              </span>
            </Button>
          ) : (
            <p className="text-xs text-neutral-500">
              💡 Fylltu út{' '}
              <Link href="/utgjaldareiknivel" className="text-blue-600 hover:underline">
                útgjaldaskýrslu
              </Link>{' '}
              til að sækja nauðsynleg útgjöld sjálfkrafa
            </p>
          )}
        </div>

        {/* Expense Presets - only show if no expense report data */}
        {!hasEssentialExpenses && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Íslensk dæmi um útgjöld:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ICELANDIC_EXPENSE_EXAMPLES.map((example) => (
                <button
                  key={example.id}
                  onClick={() => handlePresetClick(example.amount)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    monthlyExpenses === example.amount
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-neutral-900">{example.label}</div>
                      <div className="text-xs text-neutral-600">{example.description}</div>
                    </div>
                    <div className="text-sm font-semibold text-neutral-700">
                      {example.amount.toLocaleString('is-IS')} kr
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Button */}
        {(balance > 0 || monthlyExpenses > 0) && (
          <div className="pt-4 border-t border-neutral-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClear}
              className="w-full"
            >
              Hreinsa gildi
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
