/**
 * Type definitions for Raise/Bonus Reality Check Calculator
 * Feature ID: 2.3.2
 *
 * Helps Icelandic employees understand the TRUE value of salary increases
 * by calculating after-tax gain, impact on FI timeline, and life energy cost.
 */

/**
 * Municipality with name and útsvar rate
 */
export interface Municipality {
  code: string; // e.g., "0000" for Reykjavík
  name: string; // e.g., "Reykjavík"
  utsvarRate: number; // e.g., 14.48 (percentage)
}

/**
 * Tax bracket definition
 */
export interface TaxBracket {
  upToMonthly: number | null; // null = no upper limit
  rate: number; // e.g., 0.3145 (31.45%)
}

/**
 * Icelandic tax configuration for a given year
 */
export interface TaxConfig {
  year: number; // e.g., 2026
  personalCreditMonthly: number; // e.g., 70950 ISK/month
  nationalTaxBrackets: TaxBracket[];
  pensionRates: {
    employeeMin: number; // e.g., 0.04 (4%)
    employerMin: number; // e.g., 0.08 (8%)
  };
}

/**
 * FI (Financial Independence) context for timeline calculations
 */
export interface FIContext {
  annualExpenses: number; // ISK/year
  savingsRate: number; // Percentage (0-100)
  currentPortfolio: number; // ISK
  expectedReturn: number; // Percentage (default: 7%)
}

/**
 * Raise/bonus calculation inputs
 */
export interface RaiseInputs {
  // Basic income comparison
  currentGrossAnnual: number; // ISK
  proposedGrossAnnual: number; // ISK

  // Tax context
  municipality?: string; // Municipality code (e.g., "0000")
  customUtsvarRate?: number; // Manual override (12-15%)

  // Time investment
  currentWorkHoursWeek: number; // Default: 40
  proposedWorkHoursWeek?: number; // Optional if unchanged

  // FI context (optional for FI calculations)
  fiContext?: FIContext;
}

/**
 * Tax calculation results
 */
export interface TaxResults {
  grossAnnual: number;
  taxableIncome: number; // After pension deduction
  nationalTax: number;
  municipalTax: number;
  totalTax: number;
  personalCredit: number;
  netTax: number; // Total tax - credit
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number; // Percentage
}

/**
 * FI timeline calculation results
 */
export interface FIResults {
  fiNumber: number; // Annual expenses × 25
  currentYearsToFI: number; // Years with current income
  proposedYearsToFI: number; // Years with proposed income
  accelerationMonths: number; // Difference in months (negative = delay)
  currentAnnualSavings: number; // ISK/year
  proposedAnnualSavings: number; // ISK/year
  savingsDifferenceAnnual: number; // ISK/year increase
}

/**
 * Life energy calculation results
 */
export interface LifeEnergyResults {
  currentTrueHourlyWage: number; // ISK/hour
  proposedTrueHourlyWage: number; // ISK/hour
  hourlyWageChange: number; // ISK/hour difference
  hourlyWageChangePercent: number; // Percentage change
  annualLifeEnergyGain: number; // Hours of freedom per year
}

/**
 * Plain language summary
 */
export interface RaiseSummary {
  headline: string; // e.g., "Þú færð 45.000 kr/mánuð aukalega eftir skatta"
  fiImpact?: string; // e.g., "FI dagsetning færist 8 mánuðum nær"
  lifeEnergyImpact: string; // e.g., "Þetta er jafngildir 240 klukkustundum af frelsi á ári"
  hourlyWageChange: string; // e.g., "Raunveruleg tímakaup þín hækka um 350 kr"
}

/**
 * Complete raise calculation results
 */
export interface RaiseResults {
  // Tax calculations
  currentTax: TaxResults;
  proposedTax: TaxResults;

  // Income difference
  grossIncreaseAnnual: number;
  grossIncreaseMonthly: number;
  netIncreaseAnnual: number;
  netIncreaseMonthly: number;
  effectiveTaxRateOnIncrease: number;

  // FI impact (optional - undefined if no FI context)
  fiImpact?: FIResults;

  // Life energy analysis
  lifeEnergy: LifeEnergyResults;

  // Plain language summary
  summary: RaiseSummary;
  warnings: string[];
}

/**
 * Saved raise scenario
 */
export interface RaiseScenario {
  id: string; // UUID
  name: string; // User-defined (max 50 chars)
  inputs: RaiseInputs;
  results: RaiseResults;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isCurrent?: boolean; // Optional marker
}
