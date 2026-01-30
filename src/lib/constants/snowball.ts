/**
 * Constants and default values for Interest Savings Snowball Calculator
 * (Vaxtasparnaður Snjóboltareiknivél)
 */

import type { SnowballLoanInput } from '@/types/snowball';

/**
 * Default expected annual investment return (7%)
 * Based on historical long-term stock market average
 */
export const DEFAULT_INVESTMENT_RETURN = 0.07;

/**
 * Maximum projection length in months (600 months = 50 years)
 * Safety limit to prevent infinite loops in calculations
 */
export const MAX_PROJECTION_MONTHS = 600;

/**
 * Minimum balance threshold in ISK (0.01 kr)
 * Consider debt paid off when balance drops below this amount
 */
export const MIN_BALANCE_THRESHOLD = 0.01;

/**
 * Close call threshold percentage (0.05 = 5%)
 * Scenarios within this percentage are considered too close to call definitively
 */
export const CLOSE_CALL_THRESHOLD = 0.05;

/**
 * Default loan input values for a typical Icelandic mortgage
 * Based on average housing loan in Iceland (~2024-2025)
 */
export const DEFAULT_LOAN_INPUT: SnowballLoanInput = {
  /** Typical small apartment or starter home loan */
  originalLoanAmount: 30_000_000, // 30 million ISK

  /** Assuming ~10 years into a 30-year mortgage */
  currentBalance: 25_000_000, // 25 million ISK

  /** Real interest rate for indexed housing loans (3.5%) */
  annualInterestRate: 0.035,

  /** 30-year mortgage = 360 months */
  loanTermMonths: 360,

  /** 20 years remaining = 240 payments */
  remainingPayments: 240,

  /** Most common type in Iceland for housing */
  loanType: 'verdtryggd',

  /** Indexed loans use annuity method */
  paymentMethod: 'annuity',

  /** Average inflation in Iceland (~5% as of 2025) */
  inflationRate: 0.05,
};

/**
 * Default extra payment amount in ISK
 * Represents a modest extra payment (~10,000 kr/month)
 */
export const DEFAULT_EXTRA_PAYMENT = 10_000;

/**
 * Typical inflation rate for verðtryggð loans in Iceland
 * Historical average around 5%, though it varies significantly
 */
export const TYPICAL_INFLATION_RATE = 0.05;

/**
 * Range of realistic investment returns for validation
 */
export const INVESTMENT_RETURN_RANGE = {
  /** Minimum reasonable return (0%) */
  min: 0,
  /** Maximum reasonable return (50% - warn user if higher) */
  max: 0.5,
  /** Warning threshold for unrealistically high returns (20%) */
  warningThreshold: 0.2,
} as const;

/**
 * Range of realistic interest rates for validation
 */
export const INTEREST_RATE_RANGE = {
  /** Minimum interest rate (0%) */
  min: 0,
  /** Maximum interest rate (100% - likely an error) */
  max: 1.0,
} as const;

/**
 * Helper function to get default loan input
 * Useful for resetting forms or initializing state
 */
export function getDefaultLoanInput(): SnowballLoanInput {
  return { ...DEFAULT_LOAN_INPUT };
}

/**
 * Helper function to check if investment return is unrealistically high
 * Returns true if return exceeds warning threshold (20%)
 */
export function isInvestmentReturnUnrealistic(annualReturn: number): boolean {
  return annualReturn > INVESTMENT_RETURN_RANGE.warningThreshold;
}

/**
 * Helper function to check if loan term is very long
 * Returns true if loan term exceeds 50 years (600 months)
 * @param termMonths - Loan term in months
 */
export function isLoanTermVeryLong(termMonths: number): boolean {
  return termMonths > MAX_PROJECTION_MONTHS;
}
