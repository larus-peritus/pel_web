/**
 * Compound savings calculations
 */

import type {
  SavingsInputs,
  SavingsResults,
  YearlySavingsData,
  ValidationResult,
} from '@/types/calculator';
import { SAVINGS_LIMITS } from '@/lib/constants/compoundSavings';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Calculate compound savings results
 *
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 *
 * @param inputs - Savings scenario inputs
 * @param actualHourlyWage - User's actual hourly wage for life energy conversion
 * @returns Complete savings calculation results
 *
 * @example
 * const result = calculateSavingsResults({
 *   monthlySavings: 50000,
 *   annualInterestRate: 3.0,
 *   timeHorizonYears: 10
 * }, 5000);
 * // Returns: { futureValue: 6995533, totalContributions: 6000000, ... }
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage: number
): SavingsResults {
  try {
    const { monthlySavings, annualInterestRate, timeHorizonYears } = inputs;

    const monthlyRate = annualInterestRate / 100 / 12;
    const totalMonths = timeHorizonYears * 12;
    const totalContributions = monthlySavings * totalMonths;

    let futureValue: number;

    if (monthlyRate === 0) {
      // No interest: simple sum
      futureValue = totalContributions;
    } else {
      // Compound interest formula (annuity due - payment at beginning of period)
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      futureValue =
        monthlySavings *
        (((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const totalInterestEarned = futureValue - totalContributions;

    // Life energy conversions
    const futureValueLifeEnergy =
      actualHourlyWage > 0 ? futureValue / actualHourlyWage : 0;
    const interestEarnedLifeEnergy =
      actualHourlyWage > 0 ? totalInterestEarned / actualHourlyWage : 0;

    // Generate year-by-year breakdown
    const yearlyBreakdown = generateYearlyBreakdown(
      monthlySavings,
      monthlyRate,
      timeHorizonYears,
      actualHourlyWage
    );

    return {
      futureValue,
      totalContributions,
      totalInterestEarned,
      futureValueLifeEnergy,
      interestEarnedLifeEnergy,
      yearlyBreakdown,
    };
  } catch (error) {
    console.error('Savings calculation error:', error);
    // Return safe fallback
    const totalContributions =
      inputs.monthlySavings * inputs.timeHorizonYears * 12;
    return {
      futureValue: totalContributions,
      totalContributions,
      totalInterestEarned: 0,
      futureValueLifeEnergy: 0,
      interestEarnedLifeEnergy: 0,
      yearlyBreakdown: [],
    };
  }
}

/**
 * Generate year-by-year breakdown for visualization
 */
function generateYearlyBreakdown(
  monthlySavings: number,
  monthlyRate: number,
  timeHorizonYears: number,
  actualHourlyWage: number
): YearlySavingsData[] {
  const breakdown: YearlySavingsData[] = [];

  for (let year = 1; year <= timeHorizonYears; year++) {
    const monthsElapsed = year * 12;
    const contributions = monthlySavings * monthsElapsed;

    let totalValue: number;
    if (monthlyRate === 0) {
      totalValue = contributions;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, monthsElapsed);
      totalValue =
        monthlySavings *
        (((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const yearlyInterest = totalValue - contributions;
    const lifeEnergyHours =
      actualHourlyWage > 0 ? totalValue / actualHourlyWage : 0;

    breakdown.push({
      year,
      totalValue,
      totalContributions: contributions,
      yearlyInterest,
      lifeEnergyHours,
    });
  }

  return breakdown;
}

/**
 * Validate savings inputs
 */
export function validateSavingsInputs(
  inputs: SavingsInputs
): ValidationResult {
  const errors: Record<string, string> = {};

  if (inputs.monthlySavings < SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS) {
    errors.monthlySavings = `Lágmark er ${formatCurrency(
      SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS
    )}`;
  }
  if (inputs.monthlySavings > SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS) {
    errors.monthlySavings = `Hámark er ${formatCurrency(
      SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS
    )}`;
  }

  if (inputs.annualInterestRate < SAVINGS_LIMITS.MIN_INTEREST_RATE) {
    errors.annualInterestRate = `Lágmark er ${SAVINGS_LIMITS.MIN_INTEREST_RATE}%`;
  }
  if (inputs.annualInterestRate > SAVINGS_LIMITS.MAX_INTEREST_RATE) {
    errors.annualInterestRate = `Hámark er ${SAVINGS_LIMITS.MAX_INTEREST_RATE}%`;
  }

  if (inputs.timeHorizonYears < SAVINGS_LIMITS.MIN_TIME_HORIZON) {
    errors.timeHorizonYears = `Lágmark er ${SAVINGS_LIMITS.MIN_TIME_HORIZON} ár`;
  }
  if (inputs.timeHorizonYears > SAVINGS_LIMITS.MAX_TIME_HORIZON) {
    errors.timeHorizonYears = `Hámark er ${SAVINGS_LIMITS.MAX_TIME_HORIZON} ár`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generate unique ID for savings scenario
 */
export function generateSavingsId(): string {
  return `savings-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
