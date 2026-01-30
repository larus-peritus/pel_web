'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  PENSION_START_AGE,
  RETIREMENT_AGE_RANGE,
  PENSION_INCOME_RANGE,
} from '@/lib/constants/fiNumber';

/**
 * PensionIncomeSection Component Props
 */
export interface PensionIncomeSectionProps {
  /** Expected monthly pension income at age 67 (ISK) */
  pensionMonthlyIncome: number | null;
  /** Target retirement age (40-80) */
  targetRetirementAge: number | null;
  /** Monthly expenses to validate pension against */
  monthlyExpenses: number;
  /** Callback when pension income changes */
  onPensionIncomeChange: (income: number | null) => void;
  /** Callback when retirement age changes */
  onRetirementAgeChange: (age: number | null) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PensionIncomeSection Component
 *
 * Collapsible section for entering pension income and retirement age.
 * Important for Icelandic context where lífeyrissjóður starts at age 67.
 *
 * Features:
 * - Collapsible section (closed by default)
 * - Pension income input (ISK/month) with CurrencyInput
 * - Retirement age input (default: 67, range: 40-80)
 * - Validation: pension must be less than monthly expenses
 * - Warning alert if retirement age < 67 (early retirement)
 * - Explanation text about how pension reduces FI number
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * <PensionIncomeSection
 *   pensionMonthlyIncome={200000}
 *   targetRetirementAge={55}
 *   monthlyExpenses={500000}
 *   onPensionIncomeChange={(income) => setPensionIncome(income)}
 *   onRetirementAgeChange={(age) => setRetirementAge(age)}
 * />
 * ```
 */
export const PensionIncomeSection: React.FC<PensionIncomeSectionProps> = ({
  pensionMonthlyIncome,
  targetRetirementAge,
  monthlyExpenses,
  onPensionIncomeChange,
  onRetirementAgeChange,
  className,
}) => {
  // Collapsible state (closed by default)
  const [isOpen, setIsOpen] = useState(false);

  // Validation errors and warnings
  const [pensionError, setPensionError] = useState<string | null>(null);
  const [pensionWarning, setPensionWarning] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [ageWarning, setAgeWarning] = useState<string | null>(null);

  /**
   * Handle pension income change with validation
   */
  const handlePensionIncomeChange = (income: number) => {
    // Reset validation states
    setPensionError(null);
    setPensionWarning(null);

    // Validate income - Errors (blocking)
    if (income < 0) {
      setPensionError('Lífeyrir getur ekki verið neikvæður');
    } else if (income > PENSION_INCOME_RANGE.MAX) {
      setPensionError(`Lífeyrir virðist óraunhæfur (> ${PENSION_INCOME_RANGE.MAX.toLocaleString('is-IS')} kr/mán)`);
    } else if (income >= monthlyExpenses && monthlyExpenses > 0) {
      setPensionError('Lífeyrir ætti að vera lægri en mánaðarleg útgjöld');
    }
    // Warnings (non-blocking)
    else if (income > monthlyExpenses * 0.8 && monthlyExpenses > 0) {
      setPensionWarning('Lífeyrir þinn nær yfir megnið af útgjöldum - FI-talan þín verður mjög lág!');
    } else if (income < 50_000 && income > 0) {
      setPensionWarning('Þetta virðist mjög lágur lífeyrir - ertu viss um að þú sért með rétta upphæð?');
    }

    // Update value (even if error, allow user to type)
    onPensionIncomeChange(income > 0 ? income : null);
  };

  /**
   * Handle retirement age change with validation
   */
  const handleRetirementAgeChange = (age: number) => {
    // Reset validation states
    setAgeError(null);
    setAgeWarning(null);

    // Validate age - Errors (blocking)
    if (age < RETIREMENT_AGE_RANGE.MIN) {
      setAgeError(`Starfslokaaldur verður að vera að minnsta kosti ${RETIREMENT_AGE_RANGE.MIN} ára`);
    } else if (age > RETIREMENT_AGE_RANGE.MAX) {
      setAgeError(`Starfslokaaldur virðist óraunhæfur (> ${RETIREMENT_AGE_RANGE.MAX} ára)`);
    }
    // Warnings (non-blocking)
    else if (age < 50) {
      setAgeWarning('Mjög snemmbúnir starfslok - tryggðu að FI-talan þín sé nógu há!');
    } else if (age > 70) {
      setAgeWarning('Seinar starfslok - lífeyrissjóðurinn hefur þá byrjað að greiða');
    }

    // Update value (even if error, allow user to type)
    onRetirementAgeChange(age > 0 ? age : null);
  };

  /**
   * Clear all pension data
   */
  const handleClearPension = () => {
    onPensionIncomeChange(null);
    onRetirementAgeChange(null);
    setPensionError(null);
    setAgeError(null);
  };

  /**
   * Toggle collapsible section
   */
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Check if early retirement (before pension starts)
  const isEarlyRetirement = targetRetirementAge !== null && targetRetirementAge < PENSION_START_AGE;

  return (
    <Card variant="outlined" className={className}>
      <CardHeader className="cursor-pointer" onClick={toggleOpen}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Lífeyrissjóður (valfrjálst)
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              {isOpen
                ? 'Sláðu inn áætlaða lífeyrisgreiðslu til að lækka FI-tölu'
                : 'Smelltu til að bæta við lífeyrisáætlun'}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-4"
            aria-label={isOpen ? 'Loka hluta' : 'Opna hluta'}
            aria-expanded={isOpen}
          >
            <svg
              className={cn(
                'h-5 w-5 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
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

      {isOpen && (
        <CardContent className="space-y-5 border-t border-neutral-200 pt-5">
          {/* Explanation */}
          <Alert variant="info">
            <p className="text-sm">
              Ef þú átt von á lífeyrisgreiðslum frá lífeyrissjóði við 67 ára aldur, getur það lækkað FI-töluna þína verulega.
              Lífeyrissjóðurinn greiðir hluta af útgjöldum þínum, þannig að þú þarft minni sparnað.
            </p>
          </Alert>

          {/* Pension Income Input */}
          <div className="space-y-2">
            <CurrencyInput
              label="Áætlaðar mánaðarlegar lífeyrisgreiðslur"
              value={pensionMonthlyIncome ?? 0}
              onChange={handlePensionIncomeChange}
              placeholder="0 kr"
              helpText="Áætlaðar greiðslur frá lífeyrissjóði við 67 ára aldur (kr/mán)"
              error={pensionError ?? undefined}
              min={0}
              max={PENSION_INCOME_RANGE.MAX}
            />
            {/* Warning message (non-blocking) */}
            {pensionWarning && !pensionError && (
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
                <p className="text-sm text-warning-700">{pensionWarning}</p>
              </div>
            )}
          </div>

          {/* Retirement Age Input */}
          <div className="space-y-2">
            <NumberInput
              label="Markmið starfslokaaldurs"
              value={targetRetirementAge ?? PENSION_START_AGE}
              onChange={handleRetirementAgeChange}
              placeholder={String(PENSION_START_AGE)}
              helpText="Á hvaða aldri viltu hætta að vinna? (40-80 ára)"
              error={ageError ?? undefined}
              min={RETIREMENT_AGE_RANGE.MIN}
              max={RETIREMENT_AGE_RANGE.MAX}
              step={1}
            />
            {/* Warning message (non-blocking) */}
            {ageWarning && !ageError && (
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
                <p className="text-sm text-warning-700">{ageWarning}</p>
              </div>
            )}
          </div>

          {/* Early Retirement Warning */}
          {isEarlyRetirement && pensionMonthlyIncome !== null && pensionMonthlyIncome > 0 && (
            <Alert variant="warning" title="Snemmbúinn starfslok">
              <p className="text-sm">
                Þú ætlar að hætta störfum við {targetRetirementAge} ára aldur, en lífeyrissjóður byrjar ekki að greiða fyrr en við 67 ára aldur.
                Þú þarft <strong>{PENSION_START_AGE - (targetRetirementAge ?? 0)} ára brú</strong> af sparnaði til að standa straum af útgjöldum þínum
                þar til lífeyrissjóðurinn byrjar að greiða.
              </p>
            </Alert>
          )}

          {/* Clear Button */}
          {(pensionMonthlyIncome !== null || targetRetirementAge !== null) && (
            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearPension}
                className="text-neutral-600 hover:text-neutral-900"
              >
                Hreinsa lífeyrisupplýsingar
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
