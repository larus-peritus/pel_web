/**
 * Housing Input Validation
 *
 * Validates all housing inputs with Icelandic error messages.
 * Implements conditional validation based on housing type and loan type.
 */

import type {
  HousingInputs,
  RentalDetails,
  LoanDetails,
  OwnedPaidOffDetails,
  ValidationResult,
} from '../../types/calculator';

/**
 * Validate scenario name
 */
export function validateScenarioName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Heiti má ekki vera tómt';
  }
  if (name.length > 50) {
    return 'Heiti má ekki vera lengra en 50 stafir';
  }
  return null;
}

/**
 * Validate rental details
 */
function validateRentalDetails(
  rental: Partial<RentalDetails>
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Monthly rent validation
  if (rental.monthlyRent === undefined || rental.monthlyRent === null) {
    errors.monthlyRent = 'Mánaðarleg leiga er áskilin';
  } else if (rental.monthlyRent <= 0) {
    errors.monthlyRent = 'Mánaðarleg leiga verður að vera hærri en 0 kr';
  } else if (rental.monthlyRent > 1000000) {
    errors.monthlyRent =
      'Mánaðarleg leiga verður að vera lægri en 1.000.000 kr';
  }

  // Heat cost validation (if not included)
  if (rental.heatIncluded === false) {
    if (
      rental.monthlyHeatCost === undefined ||
      rental.monthlyHeatCost === null
    ) {
      errors.monthlyHeatCost =
        'Hitakostnaður er áskilinn þegar hann er ekki innifalinn';
    } else if (rental.monthlyHeatCost < 0) {
      errors.monthlyHeatCost = 'Hitakostnaður má ekki vera neikvæður';
    }
  }

  // Electricity cost validation (if not included)
  if (rental.electricityIncluded === false) {
    if (
      rental.monthlyElectricityCost === undefined ||
      rental.monthlyElectricityCost === null
    ) {
      errors.monthlyElectricityCost =
        'Rafmagnskostnaður er áskilinn þegar hann er ekki innifalinn';
    } else if (rental.monthlyElectricityCost < 0) {
      errors.monthlyElectricityCost =
        'Rafmagnskostnaður má ekki vera neikvæður';
    }
  }

  return errors;
}

/**
 * Validate loan details
 */
function validateLoanDetails(loan: Partial<LoanDetails>): Record<string, string> {
  const errors: Record<string, string> = {};

  // Loan type validation
  if (!loan.loanType) {
    errors.loanType = 'Lánstegund er áskilin';
  }

  // Total loan amount validation
  if (loan.totalLoanAmount === undefined || loan.totalLoanAmount === null) {
    errors.totalLoanAmount = 'Lánsupphæð er áskilin';
  } else if (loan.totalLoanAmount <= 0) {
    errors.totalLoanAmount = 'Lánsupphæð verður að vera hærri en 0 kr';
  } else if (loan.totalLoanAmount > 500000000) {
    errors.totalLoanAmount = 'Lánsupphæð verður að vera lægri en 500.000.000 kr';
  }

  // Annual interest rate validation
  if (
    loan.annualInterestRate === undefined ||
    loan.annualInterestRate === null
  ) {
    errors.annualInterestRate = 'Ársvextir eru áskildir';
  } else if (loan.annualInterestRate <= 0) {
    errors.annualInterestRate = 'Ársvextir verða að vera hærri en 0%';
  } else if (loan.annualInterestRate > 20) {
    errors.annualInterestRate = 'Ársvextir verða að vera lægri en 20%';
  }

  // Loan term validation
  if (loan.loanTermYears === undefined || loan.loanTermYears === null) {
    errors.loanTermYears = 'Lánstími er áskilinn';
  } else if (loan.loanTermYears < 1) {
    errors.loanTermYears = 'Lánstími verður að vera að minnsta kosti 1 ár';
  } else if (loan.loanTermYears > 40) {
    errors.loanTermYears = 'Lánstími verður að vera að hámarki 40 ár';
  } else if (!Number.isInteger(loan.loanTermYears)) {
    errors.loanTermYears = 'Lánstími verður að vera heiltala';
  }

  // Inflation rate validation (only for indexed loans)
  if (loan.loanType === 'indexed') {
    if (
      loan.annualInflationRate === undefined ||
      loan.annualInflationRate === null
    ) {
      errors.annualInflationRate =
        'Verðbólga er áskilin fyrir verðtryggð lán';
    } else if (loan.annualInflationRate < 0) {
      errors.annualInflationRate = 'Verðbólga má ekki vera neikvæð';
    } else if (loan.annualInflationRate > 20) {
      errors.annualInflationRate = 'Verðbólga verður að vera lægri en 20%';
    }
  }

  // Property tax validation
  if (loan.annualPropertyTax === undefined || loan.annualPropertyTax === null) {
    errors.annualPropertyTax = 'Fasteignagjöld eru áskilin';
  } else if (loan.annualPropertyTax < 0) {
    errors.annualPropertyTax = 'Fasteignagjöld mega ekki vera neikvæð';
  }

  // Home insurance validation
  if (
    loan.annualHomeInsurance === undefined ||
    loan.annualHomeInsurance === null
  ) {
    errors.annualHomeInsurance = 'Húseigendatrygging er áskilin';
  } else if (loan.annualHomeInsurance < 0) {
    errors.annualHomeInsurance = 'Húseigendatrygging má ekki vera neikvæð';
  }

  // Maintenance cost validation
  if (
    loan.annualMaintenanceCost === undefined ||
    loan.annualMaintenanceCost === null
  ) {
    errors.annualMaintenanceCost = 'Viðhaldskostnaður er áskilinn';
  } else if (loan.annualMaintenanceCost < 0) {
    errors.annualMaintenanceCost = 'Viðhaldskostnaður má ekki vera neikvæður';
  }

  // HOA fees validation
  if (loan.monthlyHOAFees === undefined || loan.monthlyHOAFees === null) {
    errors.monthlyHOAFees = 'Félagsgjöld eru áskilin (sláðu inn 0 ef engin)';
  } else if (loan.monthlyHOAFees < 0) {
    errors.monthlyHOAFees = 'Félagsgjöld mega ekki vera neikvæð';
  }

  // Heat cost validation
  if (loan.monthlyHeatCost === undefined || loan.monthlyHeatCost === null) {
    errors.monthlyHeatCost = 'Hitakostnaður er áskilinn';
  } else if (loan.monthlyHeatCost < 0) {
    errors.monthlyHeatCost = 'Hitakostnaður má ekki vera neikvæður';
  }

  // Electricity cost validation
  if (
    loan.monthlyElectricityCost === undefined ||
    loan.monthlyElectricityCost === null
  ) {
    errors.monthlyElectricityCost = 'Rafmagnskostnaður er áskilinn';
  } else if (loan.monthlyElectricityCost < 0) {
    errors.monthlyElectricityCost = 'Rafmagnskostnaður má ekki vera neikvæður';
  }

  return errors;
}

/**
 * Validate owned paid off details
 */
function validateOwnedPaidOffDetails(
  ownedPaidOff: Partial<OwnedPaidOffDetails>
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Property value validation (optional, but if provided must be valid)
  if (
    ownedPaidOff.estimatedPropertyValue !== undefined &&
    ownedPaidOff.estimatedPropertyValue !== null &&
    ownedPaidOff.estimatedPropertyValue < 0
  ) {
    errors.estimatedPropertyValue =
      'Áætlað verðmæti eignar má ekki vera neikvætt';
  }

  // Property tax validation
  if (
    ownedPaidOff.annualPropertyTax === undefined ||
    ownedPaidOff.annualPropertyTax === null
  ) {
    errors.annualPropertyTax = 'Fasteignagjöld eru áskilin';
  } else if (ownedPaidOff.annualPropertyTax < 0) {
    errors.annualPropertyTax = 'Fasteignagjöld mega ekki vera neikvæð';
  }

  // Home insurance validation
  if (
    ownedPaidOff.annualHomeInsurance === undefined ||
    ownedPaidOff.annualHomeInsurance === null
  ) {
    errors.annualHomeInsurance = 'Húseigendatrygging er áskilin';
  } else if (ownedPaidOff.annualHomeInsurance < 0) {
    errors.annualHomeInsurance = 'Húseigendatrygging má ekki vera neikvæð';
  }

  // Maintenance cost validation
  if (
    ownedPaidOff.annualMaintenanceCost === undefined ||
    ownedPaidOff.annualMaintenanceCost === null
  ) {
    errors.annualMaintenanceCost = 'Viðhaldskostnaður er áskilinn';
  } else if (ownedPaidOff.annualMaintenanceCost < 0) {
    errors.annualMaintenanceCost = 'Viðhaldskostnaður má ekki vera neikvæður';
  }

  // HOA fees validation
  if (
    ownedPaidOff.monthlyHOAFees === undefined ||
    ownedPaidOff.monthlyHOAFees === null
  ) {
    errors.monthlyHOAFees = 'Félagsgjöld eru áskilin (sláðu inn 0 ef engin)';
  } else if (ownedPaidOff.monthlyHOAFees < 0) {
    errors.monthlyHOAFees = 'Félagsgjöld mega ekki vera neikvæð';
  }

  // Heat cost validation
  if (
    ownedPaidOff.monthlyHeatCost === undefined ||
    ownedPaidOff.monthlyHeatCost === null
  ) {
    errors.monthlyHeatCost = 'Hitakostnaður er áskilinn';
  } else if (ownedPaidOff.monthlyHeatCost < 0) {
    errors.monthlyHeatCost = 'Hitakostnaður má ekki vera neikvæður';
  }

  // Electricity cost validation
  if (
    ownedPaidOff.monthlyElectricityCost === undefined ||
    ownedPaidOff.monthlyElectricityCost === null
  ) {
    errors.monthlyElectricityCost = 'Rafmagnskostnaður er áskilinn';
  } else if (ownedPaidOff.monthlyElectricityCost < 0) {
    errors.monthlyElectricityCost = 'Rafmagnskostnaður má ekki vera neikvæður';
  }

  return errors;
}

/**
 * Main validation function for housing inputs
 */
export function validateHousingInputs(
  inputs: Partial<HousingInputs>
): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate housing type
  if (!inputs.housingType) {
    errors.housingType = 'Veldu húsnæðistegund';
    return { isValid: false, errors };
  }

  // Conditional validation based on housing type
  if (inputs.housingType === 'rental') {
    if (!inputs.rental) {
      errors.rental = 'Leiguupplýsingar eru áskildar';
    } else {
      const rentalErrors = validateRentalDetails(inputs.rental);
      Object.assign(errors, rentalErrors);
    }
  } else if (inputs.housingType === 'owned_with_loan') {
    if (!inputs.loan) {
      errors.loan = 'Lánsupplýsingar eru áskildar';
    } else {
      const loanErrors = validateLoanDetails(inputs.loan);
      Object.assign(errors, loanErrors);
    }
  } else if (inputs.housingType === 'owned_paid_off') {
    if (!inputs.ownedPaidOff) {
      errors.ownedPaidOff = 'Eignarhaldsupplýsingar eru áskildar';
    } else {
      const ownedPaidOffErrors = validateOwnedPaidOffDetails(
        inputs.ownedPaidOff
      );
      Object.assign(errors, ownedPaidOffErrors);
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
