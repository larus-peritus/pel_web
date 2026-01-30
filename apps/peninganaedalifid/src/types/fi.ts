/**
 * TypeScript types for the FI (Financial Independence) / Savings Rate Slider Calculator
 * Based on "Your Money or Your Life" Chapter 9 - Financial Independence
 */

/**
 * FI (Financial Independence) inputs
 */
export interface FIInputs {
  fiNumber: number; // Target nest egg (ISK)
  annualIncome: number; // After work expenses (ISK)
  annualExpenses: number; // Annual spending (ISK)
  currentNetWorth: number; // Optional starting point (ISK)
  expectedReturnRate: number; // Annual % (default: 7)
  fiMultiplier: number; // 25x, 30x, etc. (default: 25)
  currentSavingsRate?: number; // (Income - Expenses) / Income * 100
}

/**
 * Marginal impact of savings rate change
 */
export interface MarginalImpact {
  months: number; // Time saved/lost in months
  years: number; // Time saved/lost in years
  workHours: number; // Work-hours saved/lost (if actualHourlyWage available)
}

/**
 * FI calculation results
 */
export interface FIResults {
  // Primary results
  yearsToFI: number; // Decimal years (e.g., 8.5)
  fiDate: Date; // Projected FI date
  monthsToFI: number; // Total months (for display)

  // Marginal impact
  impactPer1Percent: MarginalImpact; // Change per 1% savings rate
  impactPer5Percent: MarginalImpact; // Change per 5% savings rate
  impactPer10Percent: MarginalImpact; // Change per 10% savings rate

  // Life energy
  totalWorkHoursToFI: number; // Total work-hours remaining
  totalWorkDaysToFI: number; // Total work-days (8-hour days)
  totalWorkYearsToFI: number; // Total work-years (2000 hours/year)

  // Progress metrics
  currentProgress: number; // % progress to FI (0-100)
  monthlyInvestment: number; // Monthly savings amount
  annualInvestment: number; // Annual savings amount

  // Comparison (optional)
  changeFromBaseline?: {
    months: number; // Difference from baseline scenario
    years: number;
    percentage: number;
  };
}

/**
 * Savings rate scenario for comparison
 */
export interface FIScenario {
  id: string; // Unique identifier
  name: string; // User-defined name
  inputs: FIInputs; // Scenario inputs
  results: FIResults; // Calculated results
  savingsRate: number; // Primary differentiator
  isBaseline: boolean; // Is this the baseline scenario?
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Historical snapshot for progress tracking
 */
export interface FISnapshot {
  id: string; // Unique identifier
  timestamp: string; // ISO timestamp
  savingsRate: number; // Savings rate at this point
  fiDate: Date; // FI date projection at this point
  yearsToFI: number; // Years to FI at this point
  currentNetWorth: number; // Net worth at this point
  notes?: string; // Optional user notes
}

/**
 * FI curve data point for visualization
 */
export interface FICurveDataPoint {
  savingsRate: number; // X-axis value (0-100)
  yearsToFI: number; // Y-axis value
  monthsToFI: number; // For tooltip
  isCurrent: boolean; // Is this the current savings rate?
  isReference: boolean; // Is this a reference point?
}

/**
 * What-if scenario (temporary adjustment)
 */
export interface WhatIfScenario {
  type: 'expense-reduction' | 'income-increase' | 'quit-work' | 'custom';
  label: string; // Display label
  adjustment: {
    incomeChange?: number; // % or absolute
    expenseChange?: number; // % or absolute
    savingsRateChange?: number; // Direct savings rate change
  };
  result: FIResults; // Calculated impact
  isActive: boolean; // Currently being previewed
}
