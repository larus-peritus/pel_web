/**
 * Validation functions for savings goals
 */

import type { SavingsGoalInput, ValidationResult, SavingsGoal } from '@/types/savingsGoal';

/**
 * Validate savings goal input
 * @param input - The goal input data
 * @returns Validation result with errors if any
 */
export function validateSavingsGoalInput(input: SavingsGoalInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Name validation
  const trimmedName = input.name.trim();
  if (!trimmedName || trimmedName.length === 0) {
    errors.name = 'Nafn er áskilið';
  } else if (input.name.length > 100) {
    errors.name = 'Nafn má ekki vera lengra en 100 stafir';
  }

  // Target amount validation
  if (input.targetAmount <= 0) {
    errors.targetAmount = 'Markkrónutala verður að vera stærri en 0';
  } else if (input.targetAmount > 1_000_000_000) {
    errors.targetAmount = 'Markkrónutala má ekki vera yfir 1.000.000.000 kr';
  }

  // Current amount validation
  if (input.currentAmount < 0) {
    errors.currentAmount = 'Núverandi sparnaður getur ekki verið neikvæður';
  } else if (input.currentAmount > input.targetAmount) {
    errors.currentAmount = 'Núverandi sparnaður getur ekki verið meiri en markkrónutala';
  }

  // Monthly contribution validation
  if (input.monthlyContribution < 0) {
    errors.monthlyContribution = 'Mánaðarlegt framlag getur ekki verið neikvætt';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Check if user can add more goals
 * @param currentGoals - Array of current goals
 * @returns True if can add more goals (< 5 active)
 */
export function canAddGoal(currentGoals: SavingsGoal[]): boolean {
  const activeGoals = currentGoals.filter((g) => !g.isCompleted);
  return activeGoals.length < 5;
}
