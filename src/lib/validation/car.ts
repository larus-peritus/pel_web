/**
 * Validation functions for Car Ownership Cost Calculator
 * Icelandic error messages for user-facing validation
 */

import type { CarOwnershipInputs } from '@/types/car-ownership';

/**
 * Validation result interface
 */
export interface CarValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

/**
 * Validate all car ownership inputs
 * Returns validation result with Icelandic error messages
 */
export function validateCarOwnershipInputs(
  inputs: Partial<CarOwnershipInputs>
): CarValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Purchase price validation
  if (inputs.purchasePrice !== undefined) {
    if (inputs.purchasePrice <= 0) {
      errors.purchasePrice = 'Kaupverð verður að vera hærra en 0 kr';
    }
  } else {
    errors.purchasePrice = 'Kaupverð er nauðsynlegt';
  }

  // Estimated lifetime validation
  if (inputs.estimatedLifetimeYears !== undefined) {
    if (inputs.estimatedLifetimeYears <= 0) {
      errors.estimatedLifetimeYears = 'Líftími verður að vera hærri en 0 ár';
    } else if (inputs.estimatedLifetimeYears > 30) {
      errors.estimatedLifetimeYears = 'Líftími verður að vera 30 ár eða minna';
    }
  } else {
    errors.estimatedLifetimeYears = 'Áætlaður líftími er nauðsynlegur';
  }

  // Monthly km validation
  if (inputs.monthlyKm !== undefined) {
    if (inputs.monthlyKm <= 0) {
      errors.monthlyKm = 'Mánaðarlegur akstur verður að vera hærri en 0 km';
    } else if (inputs.monthlyKm > 10000) {
      errors.monthlyKm = 'Mánaðarlegur akstur virðist of hár (yfir 10.000 km)';
    } else if (inputs.monthlyKm > 5000) {
      warnings.monthlyKm =
        'Mánaðarlegur akstur er mjög hár - ertu viss um að þetta sé rétt?';
    }
  } else {
    errors.monthlyKm = 'Mánaðarlegur akstur er nauðsynlegur';
  }

  // Financing validation
  if (inputs.hasFinancing === undefined) {
    errors.hasFinancing = 'Fjármögnun (já/nei) er nauðsynleg';
  } else if (inputs.hasFinancing === true) {
    // Validate financing details if financing is enabled
    if (!inputs.financing) {
      errors.financing = 'Fjármögnunarupplýsingar vantar';
    } else {
      const { downPayment, loanAmount, annualInterestRate, loanTermYears } =
        inputs.financing;

      if (downPayment < 0) {
        errors['financing.downPayment'] = 'Útborgun má ekki vera neikvæð';
      }

      if (loanAmount <= 0) {
        errors['financing.loanAmount'] =
          'Lánsupphæð verður að vera hærri en 0 kr';
      }

      if (annualInterestRate <= 0) {
        errors['financing.annualInterestRate'] =
          'Vextir verða að vera hærri en 0%';
      } else if (annualInterestRate > 30) {
        errors['financing.annualInterestRate'] =
          'Vextir verða að vera 30% eða lægri';
      } else if (annualInterestRate > 15) {
        warnings['financing.annualInterestRate'] =
          'Vextir eru mjög háir - ertu viss um að þetta sé rétt?';
      }

      if (loanTermYears <= 0) {
        errors['financing.loanTermYears'] =
          'Lánstími verður að vera hærri en 0 ár';
      } else if (loanTermYears > 15) {
        errors['financing.loanTermYears'] =
          'Lánstími verður að vera 15 ár eða styttri';
      }

      // Warning if down payment + loan amount doesn't match purchase price (±5%)
      if (
        inputs.purchasePrice &&
        downPayment !== undefined &&
        loanAmount !== undefined
      ) {
        const totalFinancing = downPayment + loanAmount;
        const diff = Math.abs(totalFinancing - inputs.purchasePrice);
        const diffPercent = (diff / inputs.purchasePrice) * 100;

        if (diffPercent > 5) {
          warnings['financing.total'] =
            'Athugið: Útborgun + lán passa ekki við kaupverð';
        }
      }
    }
  }

  // Fuel consumption validation
  if (inputs.fuelConsumption !== undefined) {
    if (inputs.fuelConsumption <= 0) {
      errors.fuelConsumption = 'Eyðsla verður að vera hærri en 0';
    } else if (inputs.fuelConsumption > 50) {
      errors.fuelConsumption = 'Eyðsla verður að vera 50 eða lægri';
    } else if (inputs.fuelConsumption > 20) {
      warnings.fuelConsumption =
        'Eyðsla er mjög há - ertu viss um að þetta sé rétt?';
    }
  } else {
    errors.fuelConsumption = 'Eyðsla er nauðsynleg';
  }

  // Fuel price validation
  if (inputs.fuelPrice !== undefined) {
    if (inputs.fuelPrice <= 0) {
      errors.fuelPrice = 'Eldsneytisverð verður að vera hærra en 0 kr';
    } else if (inputs.fuelPrice > 1000) {
      errors.fuelPrice = 'Eldsneytisverð virðist of hátt (yfir 1.000 kr)';
    }
  } else {
    errors.fuelPrice = 'Eldsneytisverð er nauðsynlegt';
  }

  // Annual insurance validation
  if (inputs.annualInsurance !== undefined && inputs.annualInsurance < 0) {
    errors.annualInsurance = 'Tryggingar mega ekki vera neikvæðar';
  }

  // Annual registration tax validation
  if (
    inputs.annualRegistrationTax !== undefined &&
    inputs.annualRegistrationTax < 0
  ) {
    errors.annualRegistrationTax = 'Bifreiðagjald má ekki vera neikvætt';
  }

  // Biannual inspection validation
  if (
    inputs.biannualInspection !== undefined &&
    inputs.biannualInspection < 0
  ) {
    errors.biannualInspection = 'Skoðun má ekki vera neikvæð';
  }

  // Annual maintenance validation
  if (
    inputs.annualMaintenance !== undefined &&
    inputs.annualMaintenance < 0
  ) {
    errors.annualMaintenance = 'Viðhald má ekki vera neikvætt';
  }

  // Tires validation
  if (inputs.tiresEveryNYears !== undefined) {
    if (inputs.tiresEveryNYears <= 0) {
      errors.tiresEveryNYears = 'Dekktíðni verður að vera hærri en 0 ár';
    } else if (inputs.tiresEveryNYears > 10) {
      warnings.tiresEveryNYears =
        'Dekktíðni virðist mjög löng - venjulega 2-5 ár';
    }
  }

  if (inputs.tiresCost !== undefined && inputs.tiresCost < 0) {
    errors.tiresCost = 'Dekkkostnaður má ekki vera neikvæður';
  }

  // Monthly parking validation
  if (inputs.monthlyParking !== undefined && inputs.monthlyParking < 0) {
    errors.monthlyParking = 'Bílastæðagjöld mega ekki vera neikvæð';
  }

  // Monthly tolls validation
  if (inputs.monthlyTolls !== undefined && inputs.monthlyTolls < 0) {
    errors.monthlyTolls = 'Veggjöld mega ekki vera neikvæð';
  }

  // Fuel type validation
  if (!inputs.fuelType) {
    errors.fuelType = 'Eldsneytistegund er nauðsynleg';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    warnings: Object.keys(warnings).length > 0 ? warnings : undefined,
  };
}
