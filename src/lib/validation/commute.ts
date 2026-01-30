/**
 * Validation functions for commute cost calculator inputs
 *
 * All error messages are in Icelandic as per app requirements.
 */

import type { CommuteInputs } from '@/types/calculator';

/**
 * Validation result type
 */
export interface CommuteValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate commute inputs
 *
 * Performs comprehensive validation on all commute input fields with conditional
 * validation based on commute method (car, transit, bike, walk, remote).
 *
 * @param inputs - Partial commute inputs to validate
 * @returns Validation result with isValid flag and error messages in Icelandic
 *
 * @example
 * ```ts
 * const result = validateCommuteInputs({
 *   distanceKm: 10,
 *   daysPerWeek: 5,
 *   commuteMethod: 'car',
 *   timeMinutesOneWay: 20,
 *   car: { ... }
 * });
 *
 * if (!result.isValid) {
 *   console.log(result.errors); // { distanceKm: 'Fjarlægð verður að vera...', ... }
 * }
 * ```
 */
export function validateCommuteInputs(
  inputs: Partial<CommuteInputs>
): CommuteValidationResult {
  const errors: Record<string, string> = {};

  // Basic field validation

  // Distance validation (0-200 km)
  if (inputs.distanceKm === undefined || inputs.distanceKm === null) {
    errors.distanceKm = 'Fjarlægð er nauðsynleg';
  } else if (inputs.distanceKm < 0) {
    errors.distanceKm = 'Fjarlægð getur ekki verið neikvæð';
  } else if (inputs.distanceKm > 200) {
    errors.distanceKm = 'Fjarlægð verður að vera 200 km eða minna';
  }

  // Days per week validation (1-7)
  if (inputs.daysPerWeek === undefined || inputs.daysPerWeek === null) {
    errors.daysPerWeek = 'Dagar á viku eru nauðsynlegir';
  } else if (inputs.daysPerWeek < 1) {
    errors.daysPerWeek = 'Dagar á viku verða að vera að minnsta kosti 1';
  } else if (inputs.daysPerWeek > 7) {
    errors.daysPerWeek = 'Dagar á viku geta ekki verið fleiri en 7';
  } else if (!Number.isInteger(inputs.daysPerWeek)) {
    errors.daysPerWeek = 'Dagar á viku verða að vera heiltala';
  }

  // Time validation (0-300 minutes)
  if (inputs.timeMinutesOneWay === undefined || inputs.timeMinutesOneWay === null) {
    errors.timeMinutesOneWay = 'Ferðatími er nauðsynlegur';
  } else if (inputs.timeMinutesOneWay < 0) {
    errors.timeMinutesOneWay = 'Ferðatími getur ekki verið neikvæður';
  } else if (inputs.timeMinutesOneWay > 300) {
    errors.timeMinutesOneWay = 'Ferðatími verður að vera 300 mínútur eða minna';
  }

  // Commute method validation
  if (!inputs.commuteMethod) {
    errors.commuteMethod = 'Ferðamáti er nauðsynlegur';
  } else {
    const validMethods = ['car', 'transit', 'bike', 'walk', 'remote'];
    if (!validMethods.includes(inputs.commuteMethod)) {
      errors.commuteMethod = 'Ógildur ferðamáti';
    }
  }

  // Conditional validation based on commute method
  if (inputs.commuteMethod === 'car') {
    validateCarInputs(inputs, errors);
  } else if (inputs.commuteMethod === 'transit') {
    validateTransitInputs(inputs, errors);
  } else if (inputs.commuteMethod === 'bike' || inputs.commuteMethod === 'walk') {
    validateActiveInputs(inputs, errors);
  } else if (inputs.commuteMethod === 'remote') {
    // Remote has no additional fields to validate
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate car-specific inputs
 */
function validateCarInputs(
  inputs: Partial<CommuteInputs>,
  errors: Record<string, string>
): void {
  if (!inputs.car) {
    errors.car = 'Bílaupplýsingar eru nauðsynlegar fyrir bílferðir';
    return;
  }

  const { car } = inputs;

  // Fuel type validation
  if (!car.fuelType) {
    errors['car.fuelType'] = 'Eldsneytistegund er nauðsynleg';
  } else {
    const validFuelTypes = ['gasoline', 'diesel', 'electric'];
    if (!validFuelTypes.includes(car.fuelType)) {
      errors['car.fuelType'] = 'Ógild eldsneytistegund';
    }
  }

  // Fuel price validation (>0, <1000)
  if (car.fuelPrice === undefined || car.fuelPrice === null) {
    errors['car.fuelPrice'] = 'Eldsneytisverð er nauðsynlegt';
  } else if (car.fuelPrice <= 0) {
    errors['car.fuelPrice'] = 'Eldsneytisverð verður að vera hærra en 0';
  } else if (car.fuelPrice >= 1000) {
    errors['car.fuelPrice'] = 'Eldsneytisverð virðist óvenjulega hátt (hámark 1000 kr)';
  }

  // Fuel consumption validation (>0, <50)
  if (car.fuelConsumption === undefined || car.fuelConsumption === null) {
    errors['car.fuelConsumption'] = 'Eyðsla er nauðsynleg';
  } else if (car.fuelConsumption <= 0) {
    errors['car.fuelConsumption'] = 'Eyðsla verður að vera hærri en 0';
  } else if (car.fuelConsumption >= 50) {
    errors['car.fuelConsumption'] = 'Eyðsla virðist óvenjulega há (hámark 50)';
  }

  // Parking cost validation (>=0)
  if (car.parkingCostPerDay === undefined || car.parkingCostPerDay === null) {
    errors['car.parkingCostPerDay'] = 'Stæðakostnaður er nauðsynlegur (0 ef ekkert)';
  } else if (car.parkingCostPerDay < 0) {
    errors['car.parkingCostPerDay'] = 'Stæðakostnaður getur ekki verið neikvæður';
  }

  // Tolls validation (>=0)
  if (car.tollsPerDay === undefined || car.tollsPerDay === null) {
    errors['car.tollsPerDay'] = 'Umferðargjöld eru nauðsynleg (0 ef engin)';
  } else if (car.tollsPerDay < 0) {
    errors['car.tollsPerDay'] = 'Umferðargjöld geta ekki verið neikvæð';
  }

  // Depreciation validation (>=0)
  if (car.monthlyDepreciation === undefined || car.monthlyDepreciation === null) {
    errors['car.monthlyDepreciation'] = 'Mánaðarlegar afskriftir eru nauðsynlegar';
  } else if (car.monthlyDepreciation < 0) {
    errors['car.monthlyDepreciation'] = 'Afskriftir geta ekki verið neikvæðar';
  }

  // Insurance validation (>=0)
  if (car.monthlyInsurance === undefined || car.monthlyInsurance === null) {
    errors['car.monthlyInsurance'] = 'Mánaðarlegar tryggingar eru nauðsynlegar';
  } else if (car.monthlyInsurance < 0) {
    errors['car.monthlyInsurance'] = 'Tryggingar geta ekki verið neikvæðar';
  }

  // Maintenance validation (>=0)
  if (car.monthlyMaintenance === undefined || car.monthlyMaintenance === null) {
    errors['car.monthlyMaintenance'] = 'Mánaðarlegt viðhald er nauðsynlegt';
  } else if (car.monthlyMaintenance < 0) {
    errors['car.monthlyMaintenance'] = 'Viðhald getur ekki verið neikvætt';
  }

  // Inspection cost validation (>=0)
  if (car.inspectionCost === undefined || car.inspectionCost === null) {
    errors['car.inspectionCost'] = 'Skoðunarkostnaður er nauðsynlegur';
  } else if (car.inspectionCost < 0) {
    errors['car.inspectionCost'] = 'Skoðunarkostnaður getur ekki verið neikvæður';
  }
}

/**
 * Validate transit-specific inputs
 */
function validateTransitInputs(
  inputs: Partial<CommuteInputs>,
  errors: Record<string, string>
): void {
  if (!inputs.transit) {
    errors.transit = 'Upplýsingar um almenningssamgöngur eru nauðsynlegar';
    return;
  }

  const { transit } = inputs;

  // Ticket type validation
  if (!transit.ticketType) {
    errors['transit.ticketType'] = 'Tegund miða er nauðsynleg';
  } else {
    const validTicketTypes = ['monthly', 'per_ride'];
    if (!validTicketTypes.includes(transit.ticketType)) {
      errors['transit.ticketType'] = 'Ógild tegund miða';
    }

    // Conditional validation based on ticket type
    if (transit.ticketType === 'monthly') {
      if (transit.monthlyCost === undefined || transit.monthlyCost === null) {
        errors['transit.monthlyCost'] = 'Mánaðarkostnaður er nauðsynlegur fyrir mánaðarkort';
      } else if (transit.monthlyCost <= 0) {
        errors['transit.monthlyCost'] = 'Mánaðarkostnaður verður að vera hærri en 0';
      }
    } else if (transit.ticketType === 'per_ride') {
      if (transit.costPerRide === undefined || transit.costPerRide === null) {
        errors['transit.costPerRide'] = 'Kostnaður á hvern farmiða er nauðsynlegur';
      } else if (transit.costPerRide <= 0) {
        errors['transit.costPerRide'] = 'Kostnaður á hvern farmiða verður að vera hærri en 0';
      }
    }
  }
}

/**
 * Validate active commute inputs (bike/walk)
 */
function validateActiveInputs(
  inputs: Partial<CommuteInputs>,
  errors: Record<string, string>
): void {
  if (!inputs.active) {
    errors.active = 'Viðhaldsupplýsingar eru nauðsynlegar';
    return;
  }

  const { active } = inputs;

  // Monthly maintenance cost validation (>=0)
  if (active.monthlyMaintenanceCost === undefined || active.monthlyMaintenanceCost === null) {
    errors['active.monthlyMaintenanceCost'] = 'Mánaðarlegt viðhald er nauðsynlegt (0 ef ekkert)';
  } else if (active.monthlyMaintenanceCost < 0) {
    errors['active.monthlyMaintenanceCost'] = 'Viðhald getur ekki verið neikvætt';
  }
}

/**
 * Validate scenario name
 *
 * @param name - Scenario name to validate
 * @returns Validation result
 */
export function validateScenarioName(name: string): CommuteValidationResult {
  const errors: Record<string, string> = {};

  if (!name || name.trim().length === 0) {
    errors.name = 'Heiti má ekki vera tómt';
  } else if (name.trim().length > 50) {
    errors.name = 'Heiti má ekki vera lengra en 50 stafir';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
