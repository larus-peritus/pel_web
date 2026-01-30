/**
 * Car Ownership Cost Calculator - Calculation Functions
 * All calculations for car ownership costs, life energy, and FI impact
 */

import type {
  CarOwnershipInputs,
  CarOwnershipResults,
  CarCostBreakdownItem,
} from '@/types/car-ownership';

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate unique ID for car ownership scenario
 * Uses timestamp-based ID for simplicity and uniqueness
 */
export function generateCarOwnershipId(): string {
  return `car-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// DIRECT MONTHLY COSTS
// ============================================================================

/**
 * Calculate monthly fuel cost
 * Formula: (monthlyKm * fuelConsumption / 100) * fuelPrice
 */
export function calculateFuelCost(
  monthlyKm: number,
  fuelConsumption: number,
  fuelPrice: number
): number {
  return (monthlyKm * fuelConsumption) / 100 * fuelPrice;
}

/**
 * Calculate all direct monthly costs (fuel, parking, tolls, kilometer tax, loan payment)
 */
export function calculateDirectMonthlyCost(inputs: CarOwnershipInputs): {
  fuelCostMonthly: number;
  parkingCostMonthly: number;
  tollsCostMonthly: number;
  kilometerTaxMonthly: number;
  directMonthlyCost: number;
} {
  const fuelCostMonthly = calculateFuelCost(
    inputs.monthlyKm,
    inputs.fuelConsumption,
    inputs.fuelPrice
  );
  const parkingCostMonthly = inputs.monthlyParking;
  const tollsCostMonthly = inputs.monthlyTolls;
  // Kílómetragjald: per-km tax * monthly kilometers
  const kilometerTaxMonthly = (inputs.kilometerTaxPerKm || 0) * inputs.monthlyKm;

  const directMonthlyCost =
    fuelCostMonthly + parkingCostMonthly + tollsCostMonthly + kilometerTaxMonthly;

  return {
    fuelCostMonthly,
    parkingCostMonthly,
    tollsCostMonthly,
    kilometerTaxMonthly,
    directMonthlyCost,
  };
}

// ============================================================================
// LOAN CALCULATIONS
// ============================================================================

/**
 * Calculate monthly loan payment using standard loan formula
 * Formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
 * Where:
 *   P = loan amount
 *   r = monthly interest rate (annual rate / 12 / 100)
 *   n = total number of payments (years * 12)
 */
export function calculateLoanPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (loanAmount <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
    return 0;
  }

  const r = annualInterestRate / 12 / 100; // Monthly interest rate
  const n = loanTermYears * 12; // Total months

  // Loan payment formula
  const payment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  return payment;
}

/**
 * Calculate total interest paid over the life of the loan
 */
export function calculateTotalInterest(
  loanPaymentMonthly: number,
  loanAmount: number,
  loanTermYears: number
): number {
  const totalPayments = loanPaymentMonthly * (loanTermYears * 12);
  return totalPayments - loanAmount;
}

// ============================================================================
// INDIRECT MONTHLY COSTS
// ============================================================================

/**
 * Calculate monthly depreciation
 * Uses linear depreciation unless currentMarketValue is provided
 */
export function calculateDepreciation(
  purchasePrice: number,
  estimatedLifetimeYears: number,
  currentMarketValue?: number
): number {
  if (estimatedLifetimeYears <= 0) {
    estimatedLifetimeYears = 10; // Fallback to default
  }

  if (currentMarketValue !== undefined && currentMarketValue >= 0) {
    // More accurate if market value is known
    // Assume the depreciation from purchase to current value happened over time
    // This gives depreciation per month based on current value
    const totalDepreciation = purchasePrice - currentMarketValue;
    return totalDepreciation / 12; // Monthly depreciation
  }

  // Linear depreciation over estimated lifetime
  const depreciationPerYear = purchasePrice / estimatedLifetimeYears;
  return depreciationPerYear / 12;
}

/**
 * Calculate all indirect monthly costs (depreciation, insurance, etc.)
 */
export function calculateIndirectMonthlyCost(inputs: CarOwnershipInputs): {
  depreciationMonthly: number;
  insuranceMonthly: number;
  registrationTaxMonthly: number;
  inspectionMonthly: number;
  maintenanceMonthly: number;
  tiresMonthly: number;
  indirectMonthlyCost: number;
} {
  const depreciationMonthly = calculateDepreciation(
    inputs.purchasePrice,
    inputs.estimatedLifetimeYears,
    inputs.currentMarketValue
  );

  const insuranceMonthly = inputs.annualInsurance / 12;
  const registrationTaxMonthly = inputs.annualRegistrationTax / 12;
  const inspectionMonthly = inputs.biannualInspection / 24; // Every 2 years
  const maintenanceMonthly = inputs.annualMaintenance / 12;
  const tiresMonthly = inputs.tiresCost / (inputs.tiresEveryNYears * 12);

  const indirectMonthlyCost =
    depreciationMonthly +
    insuranceMonthly +
    registrationTaxMonthly +
    inspectionMonthly +
    maintenanceMonthly +
    tiresMonthly;

  return {
    depreciationMonthly,
    insuranceMonthly,
    registrationTaxMonthly,
    inspectionMonthly,
    maintenanceMonthly,
    tiresMonthly,
    indirectMonthlyCost,
  };
}

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

/**
 * Calculate life energy cost in hours
 * Formula: totalMonthlyCost / actualHourlyWage
 */
export function calculateLifeEnergy(
  totalMonthlyCost: number,
  actualHourlyWage: number
): {
  lifeEnergyHoursPerMonth: number;
  lifeEnergyHoursPerYear: number;
} {
  if (actualHourlyWage <= 0) {
    return {
      lifeEnergyHoursPerMonth: 0,
      lifeEnergyHoursPerYear: 0,
    };
  }

  const hoursPerMonth = totalMonthlyCost / actualHourlyWage;

  return {
    lifeEnergyHoursPerMonth: hoursPerMonth,
    lifeEnergyHoursPerYear: hoursPerMonth * 12,
  };
}

// ============================================================================
// FUTURE VALUE CALCULATIONS
// ============================================================================

/**
 * Calculate future value if monthly cost were invested instead
 * Uses 7% annual return (standard FI assumption)
 * Formula: monthlySavings * ((1 + r)^n - 1) / r
 * Where:
 *   r = monthly rate (0.07 / 12)
 *   n = total months (years * 12)
 */
export function calculateCarFutureValue(totalMonthlyCost: number): {
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;
} {
  const monthlyRate = 0.07 / 12; // 7% annual return

  const calculateFV = (years: number): number => {
    const months = years * 12;
    return (
      totalMonthlyCost *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    );
  };

  return {
    futureValue5Years: calculateFV(5),
    futureValue10Years: calculateFV(10),
    futureValue20Years: calculateFV(20),
  };
}

// ============================================================================
// COST BREAKDOWN
// ============================================================================

/**
 * Generate cost breakdown items for charts
 * Sorted by cost descending
 */
export function generateCostBreakdown(
  fuelCostMonthly: number,
  parkingCostMonthly: number,
  tollsCostMonthly: number,
  kilometerTaxMonthly: number,
  loanPaymentMonthly: number,
  depreciationMonthly: number,
  insuranceMonthly: number,
  registrationTaxMonthly: number,
  inspectionMonthly: number,
  maintenanceMonthly: number,
  tiresMonthly: number,
  totalMonthlyCost: number
): CarCostBreakdownItem[] {
  if (totalMonthlyCost === 0) {
    return [];
  }

  const items: CarCostBreakdownItem[] = [
    {
      category: 'fuel',
      label: 'Eldsneytis',
      monthlyCost: fuelCostMonthly,
      percentage: (fuelCostMonthly / totalMonthlyCost) * 100,
      isDirect: true,
    },
    {
      category: 'depreciation',
      label: 'Afskriftir',
      monthlyCost: depreciationMonthly,
      percentage: (depreciationMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
    {
      category: 'insurance',
      label: 'Tryggingar',
      monthlyCost: insuranceMonthly,
      percentage: (insuranceMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
    {
      category: 'maintenance',
      label: 'Viðhald',
      monthlyCost: maintenanceMonthly,
      percentage: (maintenanceMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
    {
      category: 'registrationTax',
      label: 'Bifreiðagjald',
      monthlyCost: registrationTaxMonthly,
      percentage: (registrationTaxMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
    {
      category: 'tires',
      label: 'Dekk',
      monthlyCost: tiresMonthly,
      percentage: (tiresMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
    {
      category: 'inspection',
      label: 'Skoðun',
      monthlyCost: inspectionMonthly,
      percentage: (inspectionMonthly / totalMonthlyCost) * 100,
      isDirect: false,
    },
  ];

  // Add parking if > 0
  if (parkingCostMonthly > 0) {
    items.push({
      category: 'parking',
      label: 'Bílastæðagjöld',
      monthlyCost: parkingCostMonthly,
      percentage: (parkingCostMonthly / totalMonthlyCost) * 100,
      isDirect: true,
    });
  }

  // Add tolls if > 0
  if (tollsCostMonthly > 0) {
    items.push({
      category: 'tolls',
      label: 'Veggjöld',
      monthlyCost: tollsCostMonthly,
      percentage: (tollsCostMonthly / totalMonthlyCost) * 100,
      isDirect: true,
    });
  }

  // Add kilometer tax if > 0
  if (kilometerTaxMonthly > 0) {
    items.push({
      category: 'kilometerTax',
      label: 'Kílómetragjald',
      monthlyCost: kilometerTaxMonthly,
      percentage: (kilometerTaxMonthly / totalMonthlyCost) * 100,
      isDirect: true,
    });
  }

  // Add loan payment if > 0
  if (loanPaymentMonthly > 0) {
    items.push({
      category: 'loan',
      label: 'Lánagreiðslur',
      monthlyCost: loanPaymentMonthly,
      percentage: (loanPaymentMonthly / totalMonthlyCost) * 100,
      isDirect: true,
    });
  }

  // Sort by cost descending
  return items.sort((a, b) => b.monthlyCost - a.monthlyCost);
}

// ============================================================================
// MAIN CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate complete car ownership results
 * This is the main function that orchestrates all calculations
 */
export function calculateCarOwnershipResults(
  inputs: CarOwnershipInputs,
  actualHourlyWage: number
): CarOwnershipResults {
  // Calculate direct costs
  const {
    fuelCostMonthly,
    parkingCostMonthly,
    tollsCostMonthly,
    kilometerTaxMonthly,
    directMonthlyCost,
  } = calculateDirectMonthlyCost(inputs);

  // Calculate loan payment
  const loanPaymentMonthly =
    inputs.hasFinancing && inputs.financing
      ? calculateLoanPayment(
          inputs.financing.loanAmount,
          inputs.financing.annualInterestRate,
          inputs.financing.loanTermYears
        )
      : 0;

  // Calculate indirect costs
  const {
    depreciationMonthly,
    insuranceMonthly,
    registrationTaxMonthly,
    inspectionMonthly,
    maintenanceMonthly,
    tiresMonthly,
    indirectMonthlyCost,
  } = calculateIndirectMonthlyCost(inputs);

  // Total costs
  const totalMonthlyCost =
    directMonthlyCost + loanPaymentMonthly + indirectMonthlyCost;
  const totalYearlyCost = totalMonthlyCost * 12;

  // Life energy
  const { lifeEnergyHoursPerMonth, lifeEnergyHoursPerYear } =
    calculateLifeEnergy(totalMonthlyCost, actualHourlyWage);

  // Future value
  const { futureValue5Years, futureValue10Years, futureValue20Years } =
    calculateCarFutureValue(totalMonthlyCost);

  // Cost breakdown
  const costBreakdown = generateCostBreakdown(
    fuelCostMonthly,
    parkingCostMonthly,
    tollsCostMonthly,
    kilometerTaxMonthly,
    loanPaymentMonthly,
    depreciationMonthly,
    insuranceMonthly,
    registrationTaxMonthly,
    inspectionMonthly,
    maintenanceMonthly,
    tiresMonthly,
    totalMonthlyCost
  );

  // Loan info (if applicable)
  let totalInterestPaid: number | undefined;
  let totalLoanCost: number | undefined;

  if (inputs.hasFinancing && inputs.financing && loanPaymentMonthly > 0) {
    totalInterestPaid = calculateTotalInterest(
      loanPaymentMonthly,
      inputs.financing.loanAmount,
      inputs.financing.loanTermYears
    );
    totalLoanCost = loanPaymentMonthly * (inputs.financing.loanTermYears * 12);
  }

  return {
    directMonthlyCost,
    indirectMonthlyCost,
    totalMonthlyCost,
    totalYearlyCost,
    costBreakdown,
    fuelCostMonthly,
    parkingCostMonthly,
    tollsCostMonthly,
    kilometerTaxMonthly,
    loanPaymentMonthly,
    depreciationMonthly,
    insuranceMonthly,
    registrationTaxMonthly,
    inspectionMonthly,
    maintenanceMonthly,
    tiresMonthly,
    lifeEnergyHoursPerMonth,
    lifeEnergyHoursPerYear,
    futureValue5Years,
    futureValue10Years,
    futureValue20Years,
    totalInterestPaid,
    totalLoanCost,
  };
}
