'use client';

import { useMemo } from 'react';
import type { CalculatorInputs, CalculationResults } from '@/types/calculator';
import { calculateResults } from '@/lib/calculations';

/**
 * Hook that calculates wage results from inputs
 * Returns memoized results that update when inputs change
 *
 * @param inputs - Calculator inputs
 * @returns Calculation results or null if inputs are invalid
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
 *   const results = useWageCalculator(inputs);
 *
 *   if (!results) {
 *     return <div>Enter your income to see results</div>;
 *   }
 *
 *   return <div>Actual wage: ${results.actualHourlyWage}</div>;
 * }
 * ```
 */
export function useWageCalculator(inputs: CalculatorInputs): CalculationResults | null {
  return useMemo(() => {
    // Don't calculate if no income
    if (inputs.income.grossAnnualIncome <= 0) {
      return null;
    }
    return calculateResults(inputs);
  }, [inputs]);
}
