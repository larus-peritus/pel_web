/**
 * Validation functions for One-Time Purchase inputs
 */

import type {
  PurchaseInput,
  PurchaseCalculationSettings,
  ValidationResult,
} from '../../types/oneTimePurchase.types';

/**
 * Validates a purchase input
 *
 * @param input - Purchase input to validate
 * @returns Validation result with errors
 */
export function validatePurchaseInput(input: PurchaseInput): ValidationResult {
  const errors: string[] = [];

  // Price validation
  if (input.price <= 0) {
    errors.push('Kaupverð verður að vera stærra en 0');
  }

  if (input.price > 1_000_000_000) {
    errors.push('Kaupverð virðist óraunhæft hátt (hámark 1 milljarður kr)');
  }

  // Name validation (optional field)
  if (input.name && input.name.length > 100) {
    errors.push('Lýsing má vera að hámarki 100 stafir');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates calculation settings
 *
 * @param settings - Settings to validate
 * @returns Validation result with errors
 */
export function validateSettings(
  settings: PurchaseCalculationSettings,
): ValidationResult {
  const errors: string[] = [];

  // Return rate validation
  if (settings.expectedReturnRate < 0) {
    errors.push('Ávöxtunarkrafa getur ekki verið neikvæð');
  }

  if (settings.expectedReturnRate > 0.15) {
    errors.push('Ávöxtunarkrafa virðist óraunhæft há (hámark 15%)');
  }

  // Future value years validation
  if (!settings.futureValueYears || settings.futureValueYears.length === 0) {
    errors.push('Að minnsta kosti eitt tímabil þarf að vera skilgreint');
  }

  if (settings.futureValueYears.some((year) => year <= 0)) {
    errors.push('Öll tímabil verða að vera jákvæð');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
