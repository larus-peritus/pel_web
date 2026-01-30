/**
 * Housing Cost Calculator - Calculation Functions
 *
 * Handles loan calculations (indexed and non-indexed), housing cost calculations,
 * life energy calculations, and future value projections for housing scenarios.
 *
 * Uses Islandsbanki-style calculation for Icelandic loans:
 * - Actual/360 day count convention for interest
 * - For verðtryggð loans: both balance AND payment grow with inflation
 */

import type {
  HousingInputs,
  HousingResults,
  LoanDetails,
  LoanInfo,
  RentalDetails,
  OwnedPaidOffDetails,
  HousingScenario,
} from '../../types/calculator';

// Minimum balance threshold to consider loan paid off
const MIN_BALANCE_THRESHOLD = 100;
// Maximum months to prevent infinite loops
const MAX_PROJECTION_MONTHS = 600;

/**
 * Get the number of days in a specific month
 * Used for actual/360 day count convention (Icelandic banking standard)
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculate interest using actual/360 day count convention
 * This matches Icelandic bank calculations (e.g., Islandsbanki)
 */
function calculateMonthlyInterestActual360(
  balance: number,
  annualRate: number,
  year: number,
  month: number
): number {
  const daysInMonth = getDaysInMonth(year, month);
  return balance * annualRate * (daysInMonth / 360);
}

/**
 * Calculate base monthly payment using annuity formula
 * For verðtryggð loans, use only the real rate (payment grows with inflation)
 */
function calculateBasePayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (termMonths <= 0 || principal <= 0) return 0;
  if (annualRate === 0) return principal / termMonths;

  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return principal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate standard (non-indexed) loan using actual/360 day count
 * Uses Icelandic banking standard for interest calculation
 */
function calculateStandardLoan(
  principal: number,
  annualRate: number,
  termYears: number
): LoanInfo {
  const annualRateDecimal = annualRate / 100;
  const numPayments = termYears * 12;

  // Handle edge case: 0% interest
  if (annualRateDecimal === 0) {
    const monthlyPayment = principal / numPayments;
    return {
      monthlyPayment,
      totalPaymentsOverLife: principal,
      totalInterestPaid: 0,
      interestPercentage: 0,
    };
  }

  // Calculate base payment
  const monthlyPayment = calculateBasePayment(principal, annualRateDecimal, numPayments);

  // Simulate full amortization with actual/360 day count
  let balance = principal;
  let totalInterest = 0;
  let totalPayments = 0;

  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth();

  for (let month = 0; month < numPayments && balance > MIN_BALANCE_THRESHOLD; month++) {
    const interest = calculateMonthlyInterestActual360(balance, annualRateDecimal, currentYear, currentMonth);
    const payment = Math.min(balance + interest, monthlyPayment);
    const principalPaid = payment - interest;

    totalInterest += interest;
    totalPayments += payment;
    balance = Math.max(0, balance - principalPaid);

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return {
    monthlyPayment,
    totalPaymentsOverLife: totalPayments,
    totalInterestPaid: totalInterest,
    interestPercentage: totalPayments > 0 ? (totalInterest / totalPayments) * 100 : 0,
  };
}

/**
 * Calculate indexed (verðtryggt) loan payment - Islandsbanki style
 *
 * Key differences from simple calculation:
 * - Balance grows with inflation each month
 * - Payment grows with inflation each month
 * - Interest calculated using actual/360 day count
 * - Uses only real interest rate (not combined with inflation)
 */
function calculateIndexedLoan(
  principal: number,
  annualInterestRate: number,
  annualInflationRate: number,
  termYears: number
): LoanInfo {
  const realRateDecimal = annualInterestRate / 100;
  const inflationRateDecimal = annualInflationRate / 100;
  const numPayments = termYears * 12;

  // Handle edge case: 0% interest
  if (realRateDecimal === 0 && inflationRateDecimal === 0) {
    const monthlyPayment = principal / numPayments;
    return {
      monthlyPayment,
      totalPaymentsOverLife: principal,
      totalInterestPaid: 0,
      interestPercentage: 0,
    };
  }

  // Calculate base payment using ONLY real rate (Islandsbanki style)
  const basePayment = calculateBasePayment(principal, realRateDecimal, numPayments);

  // Monthly inflation rate (compound)
  const monthlyInflation = Math.pow(1 + inflationRateDecimal, 1 / 12) - 1;

  // Simulate full amortization with inflation adjustments
  let balance = principal;
  let currentPayment = basePayment;
  let totalInterest = 0;
  let totalPayments = 0;

  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth();

  for (let month = 0; month < MAX_PROJECTION_MONTHS && balance > MIN_BALANCE_THRESHOLD; month++) {
    // Apply inflation to balance AND payment FIRST (Islandsbanki style)
    balance = balance * (1 + monthlyInflation);
    currentPayment = currentPayment * (1 + monthlyInflation);

    // Calculate interest using actual/360 day count
    const interest = calculateMonthlyInterestActual360(balance, realRateDecimal, currentYear, currentMonth);
    const payment = Math.min(balance + interest, currentPayment);
    const principalPaid = payment - interest;

    totalInterest += interest;
    totalPayments += payment;
    balance = Math.max(0, balance - principalPaid);

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  // Return the BASE payment (first month) for display purposes
  // Note: actual payment grows with inflation each month
  return {
    monthlyPayment: basePayment,
    totalPaymentsOverLife: totalPayments,
    totalInterestPaid: totalInterest,
    interestPercentage: totalPayments > 0 ? (totalInterest / totalPayments) * 100 : 0,
  };
}

/**
 * Calculate loan payment for both indexed and non-indexed loans
 */
export function calculateLoanPayment(loanDetails: LoanDetails): LoanInfo {
  const {
    loanType,
    totalLoanAmount,
    annualInterestRate,
    loanTermYears,
    annualInflationRate,
  } = loanDetails;

  if (loanType === 'indexed') {
    // Indexed loan requires inflation rate
    const inflationRate = annualInflationRate ?? 3.5; // Default 3.5% if not provided
    return calculateIndexedLoan(
      totalLoanAmount,
      annualInterestRate,
      inflationRate,
      loanTermYears
    );
  } else {
    // Non-indexed (standard) loan
    return calculateStandardLoan(
      totalLoanAmount,
      annualInterestRate,
      loanTermYears
    );
  }
}

/**
 * Calculate rental housing costs
 */
function calculateRentalCosts(rental: RentalDetails): {
  monthlyHousingPayment: number;
  monthlyHeatCost: number;
  monthlyElectricityCost: number;
  totalMonthlyCost: number;
} {
  const monthlyHousingPayment = rental.monthlyRent;
  const monthlyHeatCost = rental.heatIncluded ? 0 : rental.monthlyHeatCost;
  const monthlyElectricityCost = rental.electricityIncluded
    ? 0
    : rental.monthlyElectricityCost;

  const totalMonthlyCost =
    monthlyHousingPayment + monthlyHeatCost + monthlyElectricityCost;

  return {
    monthlyHousingPayment,
    monthlyHeatCost,
    monthlyElectricityCost,
    totalMonthlyCost,
  };
}

/**
 * Calculate owned with loan housing costs
 */
function calculateOwnedWithLoanCosts(loan: LoanDetails): {
  monthlyHousingPayment: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  monthlyHOAFees: number;
  monthlyHeatCost: number;
  monthlyElectricityCost: number;
  totalMonthlyCost: number;
  loanInfo: LoanInfo;
} {
  // Calculate loan payment
  const loanInfo = calculateLoanPayment(loan);
  const monthlyHousingPayment = loanInfo.monthlyPayment;

  // Convert annual costs to monthly
  const monthlyPropertyTax = loan.annualPropertyTax / 12;
  const monthlyInsurance = loan.annualHomeInsurance / 12;
  const monthlyMaintenance = loan.annualMaintenanceCost / 12;

  const totalMonthlyCost =
    monthlyHousingPayment +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyMaintenance +
    loan.monthlyHOAFees +
    loan.monthlyHeatCost +
    loan.monthlyElectricityCost;

  return {
    monthlyHousingPayment,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyMaintenance,
    monthlyHOAFees: loan.monthlyHOAFees,
    monthlyHeatCost: loan.monthlyHeatCost,
    monthlyElectricityCost: loan.monthlyElectricityCost,
    totalMonthlyCost,
    loanInfo,
  };
}

/**
 * Calculate owned paid off housing costs
 */
function calculateOwnedPaidOffCosts(ownedPaidOff: OwnedPaidOffDetails): {
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  monthlyHOAFees: number;
  monthlyHeatCost: number;
  monthlyElectricityCost: number;
  totalMonthlyCost: number;
  monthlyOpportunityCost?: number;
} {
  // Convert annual costs to monthly
  const monthlyPropertyTax = ownedPaidOff.annualPropertyTax / 12;
  const monthlyInsurance = ownedPaidOff.annualHomeInsurance / 12;
  const monthlyMaintenance = ownedPaidOff.annualMaintenanceCost / 12;

  const totalMonthlyCost =
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyMaintenance +
    ownedPaidOff.monthlyHOAFees +
    ownedPaidOff.monthlyHeatCost +
    ownedPaidOff.monthlyElectricityCost;

  // Calculate opportunity cost if property value is provided
  const monthlyOpportunityCost = ownedPaidOff.estimatedPropertyValue
    ? (ownedPaidOff.estimatedPropertyValue * 0.07) / 12
    : undefined;

  return {
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyMaintenance,
    monthlyHOAFees: ownedPaidOff.monthlyHOAFees,
    monthlyHeatCost: ownedPaidOff.monthlyHeatCost,
    monthlyElectricityCost: ownedPaidOff.monthlyElectricityCost,
    totalMonthlyCost,
    monthlyOpportunityCost,
  };
}

/**
 * Calculate life energy from monthly cost
 */
function calculateLifeEnergy(
  monthlyCost: number,
  actualHourlyWage: number
): {
  lifeEnergyMonthlyHours: number;
  lifeEnergyYearlyHours: number;
  lifeEnergyYearlyDays: number;
  lifeEnergyYearlyWorkDays: number;
  lifeEnergyYearlyWorkWeeks: number;
} {
  // Handle division by zero
  if (actualHourlyWage === 0) {
    return {
      lifeEnergyMonthlyHours: 0,
      lifeEnergyYearlyHours: 0,
      lifeEnergyYearlyDays: 0,
      lifeEnergyYearlyWorkDays: 0,
      lifeEnergyYearlyWorkWeeks: 0,
    };
  }

  const lifeEnergyMonthlyHours = monthlyCost / actualHourlyWage;
  const lifeEnergyYearlyHours = lifeEnergyMonthlyHours * 12;
  const lifeEnergyYearlyDays = lifeEnergyYearlyHours / 24;
  const lifeEnergyYearlyWorkDays = lifeEnergyYearlyHours / 8;
  const lifeEnergyYearlyWorkWeeks = lifeEnergyYearlyHours / 40;

  return {
    lifeEnergyMonthlyHours,
    lifeEnergyYearlyHours,
    lifeEnergyYearlyDays,
    lifeEnergyYearlyWorkDays,
    lifeEnergyYearlyWorkWeeks,
  };
}

/**
 * Calculate future value of monthly investment at 7% annual return
 *
 * Formula: FV = PMT * ((1 + r)^n - 1) / r
 * where:
 *   PMT = monthly payment
 *   r = monthly return rate (0.07 / 12)
 *   n = number of months
 */
export function calculateFutureValue(
  monthlyAmount: number,
  years: number
): number {
  if (monthlyAmount === 0) return 0;

  const monthlyRate = 0.07 / 12; // 7% annual = ~0.583% monthly
  const numMonths = years * 12;

  const futureValue =
    monthlyAmount * ((Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate);

  return futureValue;
}

/**
 * Main function: Calculate housing results from inputs
 */
export function calculateHousingResults(
  inputs: HousingInputs,
  actualHourlyWage: number
): HousingResults {
  const { housingType } = inputs;

  // Initialize base result structure
  let result: Omit<
    HousingResults,
    | 'lifeEnergyMonthlyHours'
    | 'lifeEnergyYearlyHours'
    | 'lifeEnergyYearlyDays'
    | 'lifeEnergyYearlyWorkDays'
    | 'lifeEnergyYearlyWorkWeeks'
    | 'futureValue5Years'
    | 'futureValue10Years'
    | 'futureValue20Years'
  > = {
    monthlyHousingPayment: 0,
    monthlyPropertyTax: 0,
    monthlyInsurance: 0,
    monthlyMaintenance: 0,
    monthlyHOAFees: 0,
    monthlyHeatCost: 0,
    monthlyElectricityCost: 0,
    totalMonthlyCost: 0,
    totalYearlyCost: 0,
  };

  // Calculate based on housing type
  if (housingType === 'rental' && inputs.rental) {
    const rentalCosts = calculateRentalCosts(inputs.rental);
    result = {
      ...result,
      monthlyHousingPayment: rentalCosts.monthlyHousingPayment,
      monthlyHeatCost: rentalCosts.monthlyHeatCost,
      monthlyElectricityCost: rentalCosts.monthlyElectricityCost,
      totalMonthlyCost: rentalCosts.totalMonthlyCost,
      totalYearlyCost: rentalCosts.totalMonthlyCost * 12,
    };
  } else if (housingType === 'owned_with_loan' && inputs.loan) {
    const loanCosts = calculateOwnedWithLoanCosts(inputs.loan);
    result = {
      ...result,
      monthlyHousingPayment: loanCosts.monthlyHousingPayment,
      monthlyPropertyTax: loanCosts.monthlyPropertyTax,
      monthlyInsurance: loanCosts.monthlyInsurance,
      monthlyMaintenance: loanCosts.monthlyMaintenance,
      monthlyHOAFees: loanCosts.monthlyHOAFees,
      monthlyHeatCost: loanCosts.monthlyHeatCost,
      monthlyElectricityCost: loanCosts.monthlyElectricityCost,
      totalMonthlyCost: loanCosts.totalMonthlyCost,
      totalYearlyCost: loanCosts.totalMonthlyCost * 12,
      loanInfo: loanCosts.loanInfo,
    };
  } else if (housingType === 'owned_paid_off' && inputs.ownedPaidOff) {
    const paidOffCosts = calculateOwnedPaidOffCosts(inputs.ownedPaidOff);
    result = {
      ...result,
      monthlyPropertyTax: paidOffCosts.monthlyPropertyTax,
      monthlyInsurance: paidOffCosts.monthlyInsurance,
      monthlyMaintenance: paidOffCosts.monthlyMaintenance,
      monthlyHOAFees: paidOffCosts.monthlyHOAFees,
      monthlyHeatCost: paidOffCosts.monthlyHeatCost,
      monthlyElectricityCost: paidOffCosts.monthlyElectricityCost,
      totalMonthlyCost: paidOffCosts.totalMonthlyCost,
      totalYearlyCost: paidOffCosts.totalMonthlyCost * 12,
      monthlyOpportunityCost: paidOffCosts.monthlyOpportunityCost,
    };
  }

  // Calculate life energy
  const lifeEnergy = calculateLifeEnergy(
    result.totalMonthlyCost,
    actualHourlyWage
  );

  // Calculate future values
  const futureValue5Years = calculateFutureValue(result.totalMonthlyCost, 5);
  const futureValue10Years = calculateFutureValue(result.totalMonthlyCost, 10);
  const futureValue20Years = calculateFutureValue(result.totalMonthlyCost, 20);

  return {
    ...result,
    ...lifeEnergy,
    futureValue5Years,
    futureValue10Years,
    futureValue20Years,
  };
}

/**
 * Identify cheapest and most expensive scenarios
 */
export function identifyBestAndWorst(scenarios: HousingScenario[]): {
  cheapestIndex: number;
  mostExpensiveIndex: number;
} {
  if (scenarios.length === 0) {
    return { cheapestIndex: -1, mostExpensiveIndex: -1 };
  }

  let cheapestIndex = 0;
  let mostExpensiveIndex = 0;
  let cheapestCost = scenarios[0].results.totalMonthlyCost;
  let mostExpensiveCost = scenarios[0].results.totalMonthlyCost;

  for (let i = 1; i < scenarios.length; i++) {
    const cost = scenarios[i].results.totalMonthlyCost;
    if (cost < cheapestCost) {
      cheapestCost = cost;
      cheapestIndex = i;
    }
    if (cost > mostExpensiveCost) {
      mostExpensiveCost = cost;
      mostExpensiveIndex = i;
    }
  }

  return { cheapestIndex, mostExpensiveIndex };
}

/**
 * Calculate savings between two scenarios
 */
export function calculateSavings(
  scenario1: HousingScenario,
  scenario2: HousingScenario
): {
  monthlySavings: number;
  yearlySavings: number;
  lifeEnergySavingsMonthly: number;
  futureValue10YearsDifference: number;
} {
  const monthlySavings =
    scenario1.results.totalMonthlyCost - scenario2.results.totalMonthlyCost;
  const yearlySavings = monthlySavings * 12;
  const lifeEnergySavingsMonthly =
    scenario1.results.lifeEnergyMonthlyHours -
    scenario2.results.lifeEnergyMonthlyHours;
  const futureValue10YearsDifference =
    scenario1.results.futureValue10Years - scenario2.results.futureValue10Years;

  return {
    monthlySavings,
    yearlySavings,
    lifeEnergySavingsMonthly,
    futureValue10YearsDifference,
  };
}

/**
 * Calculate rent vs buy breakeven (simplified)
 * Returns number of years until buying becomes cheaper than renting
 */
export function calculateRentVsBuyBreakeven(
  rentalScenario: HousingScenario,
  ownedScenario: HousingScenario
): number | null {
  const rentMonthly = rentalScenario.results.totalMonthlyCost;
  const ownedMonthly = ownedScenario.results.totalMonthlyCost;

  // If owned is already cheaper, breakeven is immediate
  if (ownedMonthly <= rentMonthly) {
    return 0;
  }

  // For simplicity, assume breakeven when accumulated equity equals extra cost
  // This is a very simplified model - real analysis requires more factors
  const monthlyDifference = ownedMonthly - rentMonthly;

  // If there's a loan, assume we're building equity
  if (ownedScenario.inputs.loan) {
    const loanInfo = ownedScenario.results.loanInfo;
    if (loanInfo) {
      // Simplified: assume half of payment goes to principal on average
      const averagePrincipalPayment = loanInfo.monthlyPayment * 0.5;

      // Never breaks even if difference is too high
      if (monthlyDifference > averagePrincipalPayment * 2) {
        return null; // No breakeven in reasonable timeframe
      }

      // Rough estimate: years until equity catches up
      return Math.ceil(5 + (monthlyDifference / averagePrincipalPayment) * 2);
    }
  }

  return null; // Can't calculate without loan info
}

/**
 * Calculate refinance savings
 */
export function calculateRefinanceSavings(
  currentLoan: HousingScenario,
  newLoan: HousingScenario,
  refinanceCost: number
): {
  monthlySavings: number;
  totalInterestSavings: number;
  breakevenMonths: number;
} {
  const currentLoanInfo = currentLoan.results.loanInfo;
  const newLoanInfo = newLoan.results.loanInfo;

  if (!currentLoanInfo || !newLoanInfo) {
    return {
      monthlySavings: 0,
      totalInterestSavings: 0,
      breakevenMonths: 0,
    };
  }

  const monthlySavings =
    currentLoanInfo.monthlyPayment - newLoanInfo.monthlyPayment;
  const totalInterestSavings =
    currentLoanInfo.totalInterestPaid - newLoanInfo.totalInterestPaid;
  const breakevenMonths =
    monthlySavings > 0 ? Math.ceil(refinanceCost / monthlySavings) : 0;

  return {
    monthlySavings,
    totalInterestSavings,
    breakevenMonths,
  };
}

/**
 * Generate unique ID for housing scenario
 */
export function generateHousingId(): string {
  return `housing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
