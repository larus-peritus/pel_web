/**
 * Cascading Expense Cut Calculator Page
 * Shows the impact of cutting spending with priority-based cascading cuts
 */

'use client';

import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import { CascadingCutCalculator } from '@/components/cascading-cut';

function CutImpactContent() {
  const { results, inputs, fiNumberResults, savingsReportResults, expenseBaseline } =
    useCalculator();
  const actualHourlyWage = results?.actualHourlyWage || 0;

  // Build FI inputs for impact calculation
  const fiInputs =
    fiNumberResults &&
    savingsReportResults &&
    inputs.income.grossAnnualIncome > 0
      ? {
          fiNumber:
            fiNumberResults.pensionAdjusted?.totalNeeded ??
            fiNumberResults.fiNumber,
          savingsRate: (savingsReportResults.savingsRate ?? 0) / 100, // Convert percentage to decimal
          currentNetWorth: savingsReportResults.totalSavings,
          grossAnnualIncome: inputs.income.grossAnnualIncome,
        }
      : undefined;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <CascadingCutCalculator
          expenseBaseline={expenseBaseline}
          actualHourlyWage={actualHourlyWage}
          fiInputs={fiInputs}
          tier="comfortable"
        />
      </div>
    </main>
  );
}

export default function CutImpactPage() {
  return (
    <CalculatorProvider>
      <CutImpactContent />
    </CalculatorProvider>
  );
}
