/**
 * TypeScript types for the Automatic Savings Impact Calculator
 * Based on "Your Money or Your Life" philosophy of compound interest and life energy
 */

/**
 * Frequency of automatic savings
 */
export type FrequencyKey = 'weekly' | 'biweekly' | 'monthly' | 'custom';

/**
 * Frequency configuration
 */
export interface FrequencyOption {
  key: FrequencyKey;
  label: string; // Icelandic label
  timesPerYear: number; // How many times per year
}

/**
 * Savings inputs
 */
export interface SavingsInputs {
  monthlyAmount: number; // ISK per month
  frequency: FrequencyKey;
  customFrequency?: number; // Required if frequency === 'custom'
  years: number; // 1-50
  returnRate: number; // % (0-20)
  adjustForInflation: boolean;
  inflationRate: number; // % (0-10)
}

/**
 * Yearly breakdown for charting
 */
export interface YearlyBreakdown {
  year: number; // 0 to years
  principal: number; // Cumulative principal at this year
  growth: number; // Cumulative growth at this year
  futureValue: number; // Total FV at this year
  realValue?: number; // Inflation-adjusted (if applicable)
}

/**
 * Savings calculation results
 */
export interface SavingsResults {
  // Future value
  futureValue: number; // Total future value
  totalContributions: number; // Total money contributed (principal)
  totalGrowth: number; // Total interest earned
  growthPercentage: number; // Growth as % of total

  // Life energy (only if actualHourlyWage provided)
  lifeEnergyContributed?: number; // Hours spent earning contributions
  lifeEnergyEarnedPassively?: number; // Hours "earned" from interest
  totalLifeEnergy?: number; // Total life energy value
  freedomMonths?: number; // Months of freedom

  // Inflation-adjusted (only if adjustForInflation === true)
  realValue?: number; // Inflation-adjusted future value

  // Breakdown for charts
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * Preset scenario for quick comparisons
 */
export interface SavingsPreset {
  id: string;
  label: string; // "5.000 kr/mán", "10.000 kr/mán"
  monthlyAmount: number;
  frequency: FrequencyKey;
  years: number;
}

/**
 * Saved savings scenario
 */
export interface SavingsScenario {
  id: string;
  name: string;
  inputs: SavingsInputs;
  results: SavingsResults;
  createdAt: string;
  updatedAt: string;
}
