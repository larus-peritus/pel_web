/**
 * Validation functions for Travel/Vacation Cost Calculator
 */

import type {
  TripInput,
  TravelCalculationSettings,
  ValidationResult,
} from '../../types/travelVacation';

/**
 * Validates trip input
 *
 * @param trip - Trip input to validate
 * @returns Validation result
 */
export function validateTripInput(trip: TripInput): ValidationResult {
  const errors: string[] = [];

  // Validate days
  if (trip.details.days <= 0) {
    errors.push('Lengd ferðar verður að vera að minnsta kosti 1 dagur');
  }

  if (trip.details.days > 90) {
    errors.push('Lengd ferðar verður að vera 90 dagar eða minna');
  }

  // Validate name length
  if (trip.details.name && trip.details.name.length > 100) {
    errors.push('Heiti má vera að hámarki 100 stafir');
  }

  // Check if at least some costs are entered
  const totalCost = Object.values(trip.costs).reduce(
    (sum, cost) => sum + cost,
    0,
  );
  if (totalCost === 0) {
    errors.push('Sláðu inn að minnsta kosti einn kostnaðarlið');
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
 * @returns Validation result
 */
export function validateSettings(
  settings: TravelCalculationSettings,
): ValidationResult {
  const errors: string[] = [];

  // Validate return rate
  if (settings.expectedReturnRate < 0 || settings.expectedReturnRate > 0.15) {
    errors.push('Ávöxtunarkrafa verður að vera á milli 0% og 15%');
  }

  // Validate staycation cost
  if (settings.staycationDailyCost < 0) {
    errors.push('Staycation kostnaður getur ekki verið neikvæður');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
