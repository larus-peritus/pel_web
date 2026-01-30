/**
 * TypeScript types for FIRE Type Explorer (FIRE Leiðarvísir)
 *
 * The FIRE Type Explorer helps users understand and compare different FIRE
 * (Financial Independence, Retire Early) strategies:
 * - LeanFIRE: Minimal expenses, earliest retirement
 * - RegularFIRE: Comfortable expenses, standard approach
 * - CoastFIRE: Let investments grow, work for current expenses only
 * - BaristaFIRE: Part-time work covers some expenses in retirement
 * - FatFIRE: Premium lifestyle, higher target
 *
 * Based on FIRE community concepts adapted for Icelandic context.
 */

import type { ExpenseTier } from './expenseBaseline';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * FIRE type identifiers
 *
 * The five main FIRE strategies with distinct approaches and targets.
 */
export type FIRETypeId =
  | 'leanfire'
  | 'regularfire'
  | 'coastfire'
  | 'baristafire'
  | 'fatfire';

/**
 * Effort level categorization for reaching FIRE
 */
export type EffortLevel = 'low' | 'moderate' | 'high' | 'extreme';

/**
 * Confidence level for recommendations
 */
export type RecommendationConfidence = 'high' | 'medium' | 'low';

// ============================================================================
// FIRE TYPE DEFINITIONS
// ============================================================================

/**
 * Example scenario for a FIRE type
 *
 * Real-world example showing how someone might live this FIRE lifestyle.
 */
export interface FIREExample {
  title: string; // Example title (Icelandic)
  description: string; // Detailed description (Icelandic)
  monthlyExpenses: number; // Example monthly expenses (ISK)
  fiNumber: number; // Example FI number (ISK)
}

/**
 * Complete FIRE type definition
 *
 * Contains all metadata for one FIRE type including names, descriptions,
 * pros/cons, examples, and visual styling.
 */
export interface FIRETypeDefinition {
  id: FIRETypeId; // Unique identifier
  nameIs: string; // Icelandic name
  nameEn: string; // English name for reference
  tagline: string; // Short tagline (Icelandic)
  description: string; // Full description (Icelandic)
  expenseTier: ExpenseTier | null; // Mapped expense tier (null for CoastFIRE/BaristaFIRE)
  multiplier: number; // Default FI multiplier (25x or 30x)

  // Characteristics
  pros: string[]; // Advantages (Icelandic)
  cons: string[]; // Disadvantages (Icelandic)
  bestFor: string[]; // Who this is best for (Icelandic)
  notFor: string[]; // Who should avoid this (Icelandic)

  // Examples
  examples: FIREExample[];

  // Visual styling
  color: string; // Primary color (Tailwind class)
  icon: string; // Emoji icon
}

// ============================================================================
// CALCULATION ASSUMPTIONS
// ============================================================================

/**
 * Configurable assumptions for FIRE calculations
 *
 * Users can adjust these to see how different assumptions affect results.
 */
export interface FIREAssumptions {
  withdrawalRate: number; // Safe withdrawal rate (default: 0.04 = 4%)
  expectedGrowthRate: number; // Expected investment growth (default: 0.06 = 6%)
  inflationRate: number; // Expected inflation (default: 0.025 = 2.5%)
  pensionAge: number; // Icelandic pension age (default: 67)
  pensionMonthlyEstimate: number | null; // Estimated pension income (ISK)
}

/**
 * Default FIRE assumptions for Iceland
 */
export const DEFAULT_FIRE_ASSUMPTIONS: FIREAssumptions = {
  withdrawalRate: 0.04,
  expectedGrowthRate: 0.06,
  inflationRate: 0.025,
  pensionAge: 67,
  pensionMonthlyEstimate: null,
};

// ============================================================================
// USER INPUTS
// ============================================================================

/**
 * User's financial inputs for FIRE calculations
 *
 * The basic financial data needed to calculate FIRE timelines and targets.
 */
export interface UserFinancialInputs {
  currentAge: number; // Current age
  targetRetirementAge: number | null; // Target retirement age (optional)
  currentNetWorth: number; // Current invested assets (ISK)
  annualIncome: number; // Annual gross income (ISK)
  annualSavings: number; // Annual savings amount (ISK)
  savingsRate: number; // Savings rate as percentage (0-100)
  monthlyExpenses: {
    barebones: number; // Barebones monthly expenses (ISK)
    comfortable: number; // Comfortable monthly expenses (ISK)
    deluxe: number; // Deluxe monthly expenses (ISK)
  };
}

/**
 * Input validation constraints
 */
export const FIRE_INPUT_LIMITS = {
  age: { min: 18, max: 80 },
  targetAge: { min: 25, max: 90 },
  netWorth: { min: 0, max: 10_000_000_000 }, // 10 billion ISK
  income: { min: 0, max: 500_000_000 }, // 500 million ISK
  savings: { min: 0, max: 100_000_000 }, // 100 million ISK
  savingsRate: { min: 0, max: 100 },
  expenses: { min: 50_000, max: 5_000_000 }, // 50k - 5M ISK monthly
} as const;

// ============================================================================
// CALCULATION RESULTS
// ============================================================================

/**
 * CoastFIRE-specific calculation data
 */
export interface CoastFIREData {
  coastFINumber: number; // Amount needed to "coast" (ISK)
  isCoasting: boolean; // Already have enough to coast
  yearsUntilCoast: number | null; // Years until can coast (null if already there)
  coastDate: Date | null; // Date when can start coasting
  workIncomeNeeded: number; // Monthly work income needed while coasting (ISK)
}

/**
 * BaristaFIRE-specific calculation data
 */
export interface BaristaFIREData {
  partTimeIncomeNeeded: number; // Monthly part-time income needed (ISK)
  hoursPerWeekNeeded: number | null; // Hours per week at minimum wage (null if no AWH)
  reducedFINumber: number; // FI number with part-time income offset
  fullFINumber: number; // Standard FI number without part-time work
  savings: number; // ISK saved by using BaristaFIRE approach
}

/**
 * Complete FIRE calculation result for one FIRE type
 *
 * Contains all calculated values for a specific FIRE strategy.
 */
export interface FIRECalculation {
  fireTypeId: FIRETypeId; // Which FIRE type this is for

  // Target calculation
  monthlyExpenses: number; // Monthly expenses for this FIRE type (ISK)
  annualExpenses: number; // Annual expenses (ISK)
  multiplier: number; // FI multiplier used
  fiNumber: number; // Target FI number (ISK)

  // Timeline
  yearsToFI: number | null; // Years to reach FI (null if impossible)
  monthsToFI: number | null; // Months to reach FI (null if impossible)
  targetDate: Date | null; // Projected FI date (null if impossible)
  targetAge: number | null; // Age at FI (null if impossible)

  // Progress
  currentProgress: number; // Current net worth as % of FI number (0-100+)
  amountRemaining: number; // ISK remaining to reach FI

  // Effort assessment
  effortLevel: EffortLevel; // How difficult to achieve
  feasibility: number; // 0-100 feasibility score

  // Type-specific data
  coastData?: CoastFIREData; // CoastFIRE-specific (if applicable)
  baristaData?: BaristaFIREData; // BaristaFIRE-specific (if applicable)

  // Life energy (if AWH available)
  lifeEnergy?: {
    fiNumberInHours: number; // FI number in work hours
    fiNumberInYears: number; // FI number in work years
  };
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

/**
 * Personalized FIRE type recommendation
 *
 * Provides reasoning for why a particular FIRE type is recommended
 * based on user's inputs and preferences.
 */
export interface FIRERecommendation {
  fireTypeId: FIRETypeId; // Recommended FIRE type
  rank: number; // Ranking (1 = best match)
  score: number; // Match score (0-100)
  confidence: RecommendationConfidence; // Confidence in recommendation

  // Reasoning
  reasons: string[]; // Why this is recommended (Icelandic)
  warnings: string[]; // Potential concerns (Icelandic)

  // Key metrics
  yearsToFI: number | null; // Years to reach this FIRE type
  monthlySavingsRequired: number | null; // Monthly savings needed
}

// ============================================================================
// TIMELINE
// ============================================================================

/**
 * Timeline milestone for progress visualization
 */
export interface TimelineMilestone {
  percentage: number; // 0, 25, 50, 75, 100
  amount: number; // Amount at this milestone (ISK)
  date: Date | null; // Projected date (null if cannot calculate)
  yearsFromNow: number | null; // Years from now
  label: string; // Icelandic label
  isReached: boolean; // Already reached this milestone
}

/**
 * Complete FIRE timeline for visualization
 */
export interface FIRETimeline {
  fireTypeId: FIRETypeId; // Which FIRE type
  fiNumber: number; // Target FI number
  currentNetWorth: number; // Current position
  milestones: TimelineMilestone[]; // Progress milestones (0%, 25%, 50%, 75%, 100%)
  projectedPath: Array<{
    year: number; // Year offset from now
    date: Date; // Actual date
    netWorth: number; // Projected net worth (ISK)
    progress: number; // Progress percentage
  }>;
}

// ============================================================================
// COMPLETE RESULTS
// ============================================================================

/**
 * Complete FIRE Type Explorer results
 *
 * Contains all calculations, recommendations, and timelines for all FIRE types.
 */
export interface FIRETypeResults {
  // User inputs used
  inputs: UserFinancialInputs;
  assumptions: FIREAssumptions;

  // Calculations for each FIRE type
  calculations: {
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  };

  // Recommendations (sorted by rank)
  recommendations: FIRERecommendation[];
  topRecommendation: FIRETypeId;

  // Timelines for each type
  timelines: {
    leanfire: FIRETimeline;
    regularfire: FIRETimeline;
    coastfire: FIRETimeline;
    baristafire: FIRETimeline;
    fatfire: FIRETimeline;
  };

  // Metadata
  calculatedAt: Date;
}

// ============================================================================
// USER PREFERENCES & STATE
// ============================================================================

/**
 * User's saved preferences for FIRE Type Explorer
 *
 * Persisted to localStorage via CalculatorContext.
 */
export interface FIRETypePreferences {
  // Selected FIRE type (user's current focus)
  selectedType: FIRETypeId | null;

  // Custom assumptions (overrides defaults)
  customAssumptions: Partial<FIREAssumptions>;

  // UI preferences
  showAllTypes: boolean; // Show all types or just recommended
  expandedSections: string[]; // Which accordion sections are expanded

  // Last updated
  lastUpdated: Date;
}

/**
 * Stored preferences for localStorage
 */
export interface StoredFIRETypePreferences {
  selectedType: FIRETypeId | null;
  customAssumptions: Partial<FIREAssumptions>;
  showAllTypes: boolean;
  expandedSections: string[];
  lastUpdated: string; // ISO date string
}

// ============================================================================
// COMPARISON
// ============================================================================

/**
 * Side-by-side comparison of FIRE types
 */
export interface FIRETypeComparison {
  types: FIRETypeId[]; // Types being compared (2-5)

  rows: Array<{
    label: string; // Row label (Icelandic)
    values: Record<FIRETypeId, string | number>; // Value for each type
    highlight?: FIRETypeId; // Which type to highlight (best value)
  }>;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Input validation result
 */
export interface FIREInputValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string; // Icelandic error message
  }>;
  warnings: Array<{
    field: string;
    message: string; // Icelandic warning message
  }>;
}
