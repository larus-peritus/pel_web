/**
 * TypeScript types for Car Ownership Cost Calculator
 * Separate file to keep calculator.ts from growing too large
 */

// ============================================================================
// CAR OWNERSHIP COST CALCULATOR TYPES
// ============================================================================

/**
 * Car ownership scenario (saved for comparison)
 */
export interface CarOwnershipScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name, max 50 chars (e.g., "Toyota Corolla 2018", "Nýr rafbíll")
  inputs: CarOwnershipInputs; // All input data
  results: CarOwnershipResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current car"
}

/**
 * Car ownership inputs
 */
export interface CarOwnershipInputs {
  // Basic info
  purchasePrice: number; // Kaupverð (kr), required, > 0
  currentMarketValue?: number; // Núverandi markaðsverð (optional, for used cars)
  estimatedLifetimeYears: number; // Áætlaður líftími (ár), default 10

  // Financing (optional)
  hasFinancing: boolean; // Lán já/nei
  financing?: FinancingDetails; // Required if hasFinancing === true

  // Driving
  monthlyKm: number; // Mánaðarlegur akstur (km), required, > 0
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'; // Required
  fuelConsumption: number; // L/100km or kWh/100km, required, > 0
  fuelPrice: number; // kr/L or kr/kWh, required, > 0

  // Annual costs (kr)
  annualInsurance: number; // Tryggingar, required, >= 0
  annualRegistrationTax: number; // Bifreiðagjald, required, >= 0
  biannualInspection: number; // Skoðun á 2 ár, default 12000
  annualMaintenance: number; // Viðhald, required, >= 0
  tiresEveryNYears: number; // Gúmmí á hverja N ár, default 4
  tiresCost: number; // Kostnaður gúmmí, default 60000

  // Monthly costs (kr)
  monthlyParking: number; // Bílastæðagjöld, >= 0, default 0
  monthlyTolls: number; // Veggjöld, >= 0, default 0

  // Kilometer-based costs (kr per km)
  kilometerTaxPerKm: number; // Kílómetragjald (kr/km), >= 0, default 0
}

/**
 * Financing details for car loan
 */
export interface FinancingDetails {
  downPayment: number; // Útborgun (kr), >= 0
  loanAmount: number; // Lánsupphæð (kr), > 0
  annualInterestRate: number; // Árleg vextir (%), > 0
  loanTermYears: number; // Lánstími (ár), > 0
}

/**
 * Car ownership calculation results
 */
export interface CarOwnershipResults {
  // Cost breakdown
  directMonthlyCost: number; // Beinn mánaðarlegur kostnaður
  indirectMonthlyCost: number; // Óbeinn mánaðarlegur kostnaður
  totalMonthlyCost: number; // Heildar mánaðarlegur kostnaður
  totalYearlyCost: number; // Heildar árlegur kostnaður

  // Cost breakdown details (for charts/display)
  costBreakdown: CarCostBreakdownItem[];

  // Direct costs (monthly)
  fuelCostMonthly: number;
  parkingCostMonthly: number;
  tollsCostMonthly: number;
  kilometerTaxMonthly: number; // Kílómetragjald per month
  loanPaymentMonthly: number; // 0 if no financing

  // Indirect costs (annual → monthly average)
  depreciationMonthly: number;
  insuranceMonthly: number;
  registrationTaxMonthly: number;
  inspectionMonthly: number;
  maintenanceMonthly: number;
  tiresMonthly: number;

  // Life energy calculations
  lifeEnergyHoursPerMonth: number; // Total cost / actualHourlyWage
  lifeEnergyHoursPerYear: number; // lifeEnergyHoursPerMonth * 12

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;

  // Loan info (if applicable)
  totalInterestPaid?: number; // Total vextir yfir lánstíma
  totalLoanCost?: number; // Lánsupphæð + vextir
}

/**
 * Individual cost breakdown item for charts
 */
export interface CarCostBreakdownItem {
  category: string; // e.g., "fuel", "depreciation", "insurance"
  label: string; // Display label in Icelandic
  monthlyCost: number; // ISK per month
  percentage: number; // % of total cost
  isDirect: boolean; // true for direct costs, false for indirect
}

/**
 * Car preset for quick setup
 */
export interface CarPreset {
  id: string;
  category: 'small' | 'medium' | 'suv' | 'electric' | 'old';
  label: string; // e.g., "Lítill bensínbíll (Toyota Yaris)"
  description: string; // Brief description
  inputs: Omit<CarOwnershipInputs, 'name'>; // Pre-filled input values
}

/**
 * Icelandic labels for fuel types
 */
export const FUEL_TYPE_LABELS: Record<string, string> = {
  gasoline: 'Bensín',
  diesel: 'Dísel',
  electric: 'Rafmagn',
  hybrid: 'Tvinnbíll',
};

/**
 * Icelandic labels for car categories
 */
export const CAR_CATEGORY_LABELS: Record<string, string> = {
  small: 'Lítill bíll',
  medium: 'Meðalstór bíll',
  suv: 'Jeppi',
  electric: 'Rafbíll',
  old: 'Gamall bíll',
};
