/**
 * Financial Independence (FI) Calculations
 * Feature ID: 2.3.2
 *
 * Calculates years to FI using compound interest math and the 4% rule.
 * Based on "Your Money or Your Life" methodology and Trinity Study.
 *
 * References:
 * - REQ-CALC-002: FI date impact
 * - US-2: Understand FI timeline impact
 */

import type { FIResults, FIContext } from '@/types/raise';
import { FI_DEFAULTS } from '@/lib/constants/icelandicTax';

/**
 * Calculate years to financial independence
 *
 * Formula: Years = ln((FI Number × r / Annual Savings) + 1) / ln(1 + r)
 *
 * This accounts for compound growth of investments while contributing.
 *
 * @param annualExpenses - Annual spending in ISK
 * @param annualSavings - Annual savings in ISK
 * @param currentPortfolio - Current portfolio value in ISK
 * @param expectedReturn - Expected annual return (percentage, e.g., 7)
 * @returns Years to FI (can be fractional, Infinity if not achievable)
 */
export function calculateYearsToFI(
  annualExpenses: number,
  annualSavings: number,
  currentPortfolio: number,
  expectedReturn: number = FI_DEFAULTS.expectedReturn
): number {
  const fiNumber = calculateFINumber(annualExpenses);

  // Already FI
  if (currentPortfolio >= fiNumber) {
    return 0;
  }

  // Cannot reach FI with zero or negative savings
  if (annualSavings <= 0) {
    return Infinity;
  }

  // Convert percentage to decimal
  const r = expectedReturn / 100;

  // Calculate years using compound interest formula
  // Years = ln((FI Number - PV) × r / PMT + 1) / ln(1 + r)
  // Where:
  //   FI Number = target portfolio value
  //   PV = present value (current portfolio)
  //   PMT = annual savings
  //   r = return rate
  const remainingNeeded = fiNumber - currentPortfolio;
  const years = Math.log((remainingNeeded * r) / annualSavings + 1) / Math.log(1 + r);

  return years;
}

/**
 * Calculate FI number (25× annual expenses for 4% rule)
 *
 * The 4% rule: You can safely withdraw 4% of your portfolio annually
 * Therefore, you need 25× your annual expenses to be FI.
 *
 * @param annualExpenses - Annual spending in ISK
 * @returns FI number (portfolio target)
 */
export function calculateFINumber(annualExpenses: number): number {
  return annualExpenses * 25; // 4% rule = 25× multiplier
}

/**
 * Calculate future value with annual contributions
 *
 * Formula: FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 *
 * @param principal - Starting amount
 * @param annualContribution - Yearly contribution
 * @param years - Number of years
 * @param rate - Annual return rate (percentage)
 * @returns Future value in ISK
 */
export function calculateFutureValue(
  principal: number,
  annualContribution: number,
  years: number,
  rate: number
): number {
  const r = rate / 100;
  const growth = Math.pow(1 + r, years);

  // Future value of principal
  const fvPrincipal = principal * growth;

  // Future value of annuity (annual contributions)
  const fvAnnuity = annualContribution * ((growth - 1) / r);

  return fvPrincipal + fvAnnuity;
}

/**
 * Compare FI impact between two income scenarios
 *
 * Calculates how a raise affects:
 * - Years to FI
 * - Annual savings
 * - Time saved (in months)
 *
 * @param currentNetAnnual - Current annual net income in ISK
 * @param proposedNetAnnual - Proposed annual net income in ISK
 * @param fiContext - FI calculation context
 * @returns Complete FI comparison results
 */
export function compareFIImpact(
  currentNetAnnual: number,
  proposedNetAnnual: number,
  fiContext: FIContext
): FIResults {
  const { annualExpenses, savingsRate, currentPortfolio, expectedReturn } =
    fiContext;

  // Calculate annual savings for each scenario
  // Savings = Net Income × Savings Rate
  const currentAnnualSavings = currentNetAnnual * (savingsRate / 100);
  const proposedAnnualSavings = proposedNetAnnual * (savingsRate / 100);

  // Calculate years to FI for each scenario
  const currentYearsToFI = calculateYearsToFI(
    annualExpenses,
    currentAnnualSavings,
    currentPortfolio,
    expectedReturn
  );

  const proposedYearsToFI = calculateYearsToFI(
    annualExpenses,
    proposedAnnualSavings,
    currentPortfolio,
    expectedReturn
  );

  // Calculate difference in months
  // Negative = FI delayed, Positive = FI accelerated
  const accelerationYears = currentYearsToFI - proposedYearsToFI;
  const accelerationMonths = Math.round(accelerationYears * 12);

  // FI number (same for both scenarios)
  const fiNumber = calculateFINumber(annualExpenses);

  return {
    fiNumber,
    currentYearsToFI,
    proposedYearsToFI,
    accelerationMonths,
    currentAnnualSavings,
    proposedAnnualSavings,
    savingsDifferenceAnnual: proposedAnnualSavings - currentAnnualSavings,
  };
}
