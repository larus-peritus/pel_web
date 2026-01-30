/**
 * TypeScript types for the Coast FIRE Calculator (Ró FIRE Reiknivél)
 *
 * Coast FIRE: When your current investments will grow to meet your FI number
 * without additional contributions, allowing you to "coast" to financial independence.
 */

import type { ExpenseTier } from './expenseBaseline';

/**
 * Coast FIRE status types
 */
export type CoastFIREStatus = 'coasting' | 'future' | 'impossible';

/**
 * Scenario types for return rate comparisons
 */
export type ScenarioType = 'conservative' | 'moderate' | 'optimistic';

/**
 * Source of FI number (manual entry or calculated from expense baseline)
 */
export type FINumberSource = 'manual' | 'baseline';

/**
 * Coast FIRE calculator input state
 */
export interface CoastFIREInputs {
  // Basic inputs
  currentAge: number; // User's current age (18-100)
  currentInvestments: number; // Current investment balance (ISK)
  targetRetirementAge: number; // Desired retirement age (currentAge+1 to 100)
  expectedReturn: number; // Expected annual return rate (percentage, 0-15)

  // FI Number inputs
  fiNumber: number | null; // Target FI number (ISK)
  fiNumberSource: FINumberSource; // How FI number was determined
  selectedTier: ExpenseTier | null; // Selected tier if using baseline
  fiMultiplier: number; // Multiplier for FI calculation (20-40, default 25)

  // Optional metadata
  birthDate?: string; // ISO date string for calendar date calculations
}

/**
 * Coast FIRE calculation results
 */
export interface CoastFIREResult {
  // Status
  status: CoastFIREStatus; // Whether coasting, can coast in future, or impossible
  coastFireAge: number | null; // Age when Coast FIRE is achieved (null if impossible)
  coastFireDate: Date | null; // Calendar date of Coast FIRE (null if impossible or no birthDate)
  yearsToCoast: number | null; // Years until Coast FIRE (fractional, null if impossible)

  // Financial projections
  gapToCoast: number | null; // ISK needed today to reach Coast FIRE (null if already coasting)
  projectedBalance: number; // Balance at target retirement age
  compoundGrowth: number; // Total growth from current age to target age
  excessOverFI: number; // Amount above FI number at target age (can be negative)

  // Life energy metrics (null if actualHourlyWage not available)
  lifeEnergy: CoastFIRELifeEnergy | null;

  // Scenario comparisons
  scenarios: ScenarioResult[];

  // Metadata
  calculatedAt: Date; // When this calculation was performed
  assumptions: CalculationAssumptions; // Assumptions used in calculation
}

/**
 * Single scenario result (conservative/moderate/optimistic)
 */
export interface ScenarioResult {
  type: ScenarioType; // Scenario type
  name: string; // Icelandic name ('Íhaldssöm' | 'Miðlungs' | 'Bjartsýn')
  returnRate: number; // Return rate percentage used
  status: CoastFIREStatus; // Status for this scenario
  coastFireAge: number | null; // Coast age for this scenario
  yearsToCoast: number | null; // Years to coast for this scenario
  gapToCoast: number | null; // Gap for this scenario
  projectedBalance: number; // Balance at target age
  compoundGrowth: number; // Total growth
  excessOverFI: number; // Amount above/below FI number
}

/**
 * Life energy representation of Coast FIRE
 */
export interface CoastFIRELifeEnergy {
  // Current state
  investmentsInHours: number; // Current balance in work hours
  investmentsInYears: number; // Current balance in work years (hours / 2080)
  gapInHours: number | null; // Gap to Coast FIRE in work hours
  gapInYears: number | null; // Gap in work years

  // Future projections
  passiveHoursEarned: number; // Work hours equivalent of compound growth
  passiveYearsEarned: number; // Work years equivalent of compound growth
  totalWorkYearsRepresented: number; // Total years of work represented by final balance

  // Comparison vs continuing to save
  hoursSavedByCoasting: number | null; // Hours saved by coasting vs manual saving (estimated)
  yearsSavedByCoasting: number | null; // Years saved by coasting
}

/**
 * Assumptions used in Coast FIRE calculation
 */
export interface CalculationAssumptions {
  currentAge: number;
  currentInvestments: number;
  fiNumber: number;
  expectedReturn: number; // Percentage
  targetRetirementAge: number;
  fiMultiplier: number;
  compoundingFrequency: 'annual' | 'monthly'; // Default: annual
  realVsNominal: 'real'; // Always real (after inflation)
  actualHourlyWage: number | null; // For life energy calculations
}

/**
 * Data point for growth projection chart
 */
export interface GrowthProjection {
  age: number; // Age at this point
  year: number; // Calendar year
  balance: number; // Investment balance (ISK)
  scenario?: ScenarioType; // Optional: for multi-scenario charts
}

/**
 * Action suggestion when Coast FIRE is impossible
 */
export interface ActionSuggestion {
  type: 'increase-return' | 'delay-retirement' | 'reduce-fi' | 'continue-saving';
  title: string; // Icelandic title
  description: string; // Icelandic description
  calculation: string; // What would need to change
  feasibility: 'easy' | 'moderate' | 'difficult'; // How realistic this is
  warning?: string; // Optional warning (e.g., for risky return increases)
}

/**
 * Coast FIRE state stored in calculator context
 */
export interface CoastFIREState extends CoastFIREInputs {
  // Metadata
  lastUpdated: string; // ISO timestamp
  version: number; // Schema version for migrations
}

/**
 * Complete Coast FIRE data (inputs + results)
 */
export interface CoastFIREData {
  inputs: CoastFIREInputs;
  result: CoastFIREResult | null;
}

/**
 * Validation result for Coast FIRE inputs
 */
export interface CoastFIREValidation {
  valid: boolean;
  errors: string[]; // Blocking errors
  warnings: string[]; // Non-blocking warnings
}

/**
 * FI Number breakdown (when using expense baseline)
 */
export interface FINumberBreakdown {
  monthlyExpenses: number; // Monthly expenses for selected tier
  annualExpenses: number; // monthlyExpenses * 12
  multiplier: number; // FI multiplier (25, 30, etc.)
  fiNumber: number; // annualExpenses * multiplier
  tier: ExpenseTier; // Which tier was used
  tierLabel: string; // Icelandic label for tier
}

/**
 * Coast FIRE milestone marker for chart
 */
export interface ChartMilestone {
  age: number;
  year: number;
  balance: number;
  type: 'current' | 'coast' | 'target'; // Milestone type
  label: string; // Display label
  color: string; // Color for marker
}
