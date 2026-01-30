/**
 * Validation functions for Debt Payoff vs Invest Analyzer
 * Comprehensive input validation with Icelandic error messages
 */

import type { DebtInput, InvestmentAssumptions } from '@/types/debtPayoff';
import type { ValidationResult } from '@/types/calculator';
import { ERROR_MESSAGES } from '@/lib/content/debtPayoff';

/**
 * Validation errors object
 */
export interface DebtValidationErrors {
  balance?: string;
  interestRate?: string;
  inflationRate?: string;
  minimumPayment?: string;
  extraPayment?: string;
  name?: string;
}

/**
 * Investment validation errors object
 */
export interface InvestmentValidationErrors {
  expectedReturn?: string;
}

/**
 * Validate a single debt input field
 *
 * @param fieldName - Name of the field to validate
 * @param value - Value to validate
 * @param debt - Full debt input (for context-dependent validation)
 * @returns Error message or null if valid
 */
export function validateDebtField(
  fieldName: keyof DebtInput,
  value: unknown,
  debt?: Partial<DebtInput>
): string | null {
  switch (fieldName) {
    case 'currentBalance':
      if (typeof value !== 'number' || value <= 0) {
        return ERROR_MESSAGES.balanceTooLow;
      }
      if (value > 100_000_000) {
        // Over 100 million kr
        return ERROR_MESSAGES.balanceTooHigh;
      }
      return null;

    case 'nominalInterestRate':
      if (typeof value !== 'number' || value < 0) {
        return ERROR_MESSAGES.rateTooLow;
      }
      if (value > 0.5) {
        // Over 50%
        return ERROR_MESSAGES.rateTooHigh;
      }
      return null;

    case 'inflationRate':
      if (debt?.loanType === 'verdtryggd') {
        if (typeof value !== 'number' || value < 0) {
          return ERROR_MESSAGES.inflationTooLow;
        }
        if (value > 0.2) {
          // Over 20%
          return ERROR_MESSAGES.inflationTooHigh;
        }
      }
      return null;

    case 'minimumPayment':
      if (typeof value !== 'number' || value <= 0) {
        return ERROR_MESSAGES.minimumPaymentTooLow;
      }
      // Check if payment exceeds monthly interest (context-dependent)
      if (debt?.currentBalance && debt?.nominalInterestRate) {
        const monthlyRate = debt.nominalInterestRate / 12;
        const monthlyInterest = debt.currentBalance * monthlyRate;
        if (value <= monthlyInterest) {
          return ERROR_MESSAGES.minimumPaymentInsufficient;
        }
      }
      return null;

    case 'extraPayment':
      if (typeof value !== 'number' || value < 0) {
        return ERROR_MESSAGES.extraPaymentNegative;
      }
      if (value > 1_000_000) {
        // Over 1 million kr per month
        return ERROR_MESSAGES.extraPaymentTooHigh;
      }
      return null;

    case 'name':
      if (value && typeof value === 'string' && value.length > 50) {
        return ERROR_MESSAGES.nameTooLong;
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validate minimum payment against current debt state
 *
 * @param payment - Monthly payment amount
 * @param balance - Current debt balance
 * @param annualRate - Annual interest rate
 * @returns Error message or null if valid
 */
export function validateMinimumPayment(payment: number, balance: number, annualRate: number): string | null {
  if (payment <= 0) {
    return ERROR_MESSAGES.minimumPaymentTooLow;
  }

  const monthlyRate = annualRate / 12;
  const monthlyInterest = balance * monthlyRate;

  if (payment <= monthlyInterest) {
    return ERROR_MESSAGES.minimumPaymentInsufficient;
  }

  return null;
}

/**
 * Validate complete debt input
 *
 * @param debt - Debt input to validate
 * @returns Validation errors object
 */
export function validateDebtInput(debt: DebtInput): DebtValidationErrors {
  const errors: DebtValidationErrors = {};

  // Validate balance
  const balanceError = validateDebtField('currentBalance', debt.currentBalance);
  if (balanceError) errors.balance = balanceError;

  // Validate interest rate
  const rateError = validateDebtField('nominalInterestRate', debt.nominalInterestRate);
  if (rateError) errors.interestRate = rateError;

  // Validate inflation rate (if applicable)
  if (debt.loanType === 'verdtryggd') {
    const inflationError = validateDebtField('inflationRate', debt.inflationRate, debt);
    if (inflationError) errors.inflationRate = inflationError;
  }

  // Validate minimum payment
  const minPaymentError = validateDebtField('minimumPayment', debt.minimumPayment, debt);
  if (minPaymentError) errors.minimumPayment = minPaymentError;

  // Validate extra payment
  const extraPaymentError = validateDebtField('extraPayment', debt.extraPayment);
  if (extraPaymentError) errors.extraPayment = extraPaymentError;

  // Validate name (if provided)
  if (debt.name) {
    const nameError = validateDebtField('name', debt.name);
    if (nameError) errors.name = nameError;
  }

  return errors;
}

/**
 * Validate investment assumptions
 *
 * @param investment - Investment assumptions to validate
 * @returns Validation errors object
 */
export function validateInvestmentAssumptions(investment: InvestmentAssumptions): InvestmentValidationErrors {
  const errors: InvestmentValidationErrors = {};

  // Validate expected return
  if (investment.expectedAnnualReturn < 0) {
    errors.expectedReturn = ERROR_MESSAGES.returnTooLow;
  } else if (investment.expectedAnnualReturn > 0.2) {
    // Over 20% annually
    errors.expectedReturn = ERROR_MESSAGES.returnTooHigh;
  }

  return errors;
}

/**
 * Validate peace of mind factor
 *
 * @param factor - Peace of mind factor (0-10)
 * @returns Error message or null if valid
 */
export function validatePeaceOfMindFactor(factor: number): string | null {
  if (factor < 0) {
    return ERROR_MESSAGES.peacOfMindTooLow;
  }
  if (factor > 10) {
    return ERROR_MESSAGES.peacOfMindTooHigh;
  }
  return null;
}

/**
 * Validate scenario name
 *
 * @param name - Scenario name to validate
 * @returns Error message or null if valid
 */
export function validateScenarioName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return ERROR_MESSAGES.nameRequired;
  }
  if (name.length > 50) {
    return ERROR_MESSAGES.nameTooLong;
  }
  return null;
}

/**
 * Check if debt input is valid (no errors)
 *
 * @param debt - Debt input to check
 * @returns True if valid, false otherwise
 */
export function isDebtInputValid(debt: DebtInput): boolean {
  const errors = validateDebtInput(debt);
  return Object.keys(errors).length === 0;
}

/**
 * Check if investment assumptions are valid (no errors)
 *
 * @param investment - Investment assumptions to check
 * @returns True if valid, false otherwise
 */
export function isInvestmentValid(investment: InvestmentAssumptions): boolean {
  const errors = validateInvestmentAssumptions(investment);
  return Object.keys(errors).length === 0;
}

/**
 * Convert validation errors to ValidationResult format
 *
 * @param errors - Debt validation errors
 * @returns ValidationResult object
 */
export function debtErrorsToValidationResult(errors: DebtValidationErrors): ValidationResult {
  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors as Record<string, string>,
  };
}
