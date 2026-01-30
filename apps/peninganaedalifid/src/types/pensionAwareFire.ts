/**
 * TypeScript types for Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)
 *
 * This module defines all types for the Pension-Aware FIRE calculator, which helps users
 * calculate their true FI number by accounting for Iceland's three-tier pension system:
 * - Séreign (Private Pension) - accessible from age 60
 * - Lífeyrissjóður (Occupational Pension) - typically starts at 62-67
 * - TR Ellilífeyrir (State Pension) - starts at 67 with means-testing
 *
 * The calculator breaks retirement into phases and shows how much less you need to save
 * compared to traditional FIRE approaches that ignore pension income.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Expense source type - where monthly expense data comes from
 */
export type ExpenseSource = 'baseline' | 'manual';

/**
 * Expense tier when using baseline data
 */
export type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';

/**
 * Retirement phase identifier
 */
export type RetirementPhaseId = 'gap' | 'sereign-bridge' | 'full-pension';

/**
 * Warning severity level
 */
export type WarningSeverity = 'info' | 'warning' | 'error';

// ============================================================================
// INPUT SUB-TYPES
// ============================================================================

/**
 * Lífeyrissjóður (Occupational Pension) input data
 */
export interface LifeyrissjodurInput {
  /** Expected monthly pension amount at start age (ISK) */
  expectedMonthlyAmount: number;

  /** Age when lífeyrissjóður starts (62-70, default 67) */
  startAge: number;
}

/**
 * Séreign (Private Pension) input data
 */
export interface SereignInput {
  /** Current séreign balance (ISK) */
  currentBalance: number;

  /** Monthly contribution to séreign (ISK) */
  monthlyContribution: number;

  /** Employee contribution percentage (decimal, e.g., 0.04 for 4%) */
  employeeContributionPercent: number;

  /** Employer match percentage (decimal, e.g., 0.02 for 2%) */
  employerMatchPercent: number;
}

/**
 * TR Ellilífeyrir (State Pension) input data
 */
export interface TRInput {
  /** Whether user expects to receive full TR */
  expectFullTR: boolean;

  /** Manual override amount if user wants to set custom TR (ISK, optional) */
  manualOverrideAmount: number | null;
}

// ============================================================================
// STATE
// ============================================================================

/**
 * Complete input state for Pension-Aware FIRE calculator
 * This represents all user inputs and configuration
 */
export interface PensionAwareFireState {
  // ============ Basic Financial Inputs ============

  /** User's current age (18-70) */
  currentAge: number;

  /** Target early retirement age (current age + 1 to 80) */
  targetRetirementAge: number;

  /** Monthly living expenses in retirement (ISK) */
  monthlyExpenses: number;

  /** Source of expense data */
  expenseSource: ExpenseSource;

  /** Which expense tier to use when source is 'baseline' */
  expenseTier: ExpenseTier;

  /** Current savings/investments (ISK) */
  currentSavings: number;

  /** Monthly savings rate (ISK) */
  monthlySavings: number;

  /** Expected annual investment return (decimal, e.g., 0.05 for 5%) */
  investmentReturn: number;

  // ============ Pension Inputs ============

  /** Lífeyrissjóður (Occupational Pension) configuration */
  lifeyrissjodur: LifeyrissjodurInput;

  /** Séreign (Private Pension) configuration */
  sereign: SereignInput;

  /** TR Ellilífeyrir (State Pension) configuration */
  tr: TRInput;

  // ============ Scenarios & Meta ============

  /** Saved scenarios for comparison */
  savedScenarios: SavedScenario[];

  /** Last updated timestamp */
  lastUpdated: Date;

  /** State version for migrations */
  version: number;
}

// ============================================================================
// RETIREMENT PHASES
// ============================================================================

/**
 * Income sources breakdown for a retirement phase
 */
export interface PhaseIncomeSources {
  /** Monthly withdrawal from personal savings (ISK) */
  savingsWithdrawal: number;

  /** Average monthly investment returns during phase (ISK) */
  investmentReturns: number;

  /** Monthly séreign pension (ISK, 0 if not in this phase) */
  sereign: number;

  /** Monthly lífeyrissjóður pension (ISK, 0 if not in this phase) */
  lifeyrissjodur: number;

  /** Monthly TR pension (ISK, 0 if not in this phase) */
  tr: number;

  /** Total monthly income from all sources (ISK) */
  total: number;
}

/**
 * A single retirement phase with all calculations
 * Phases represent distinct periods with different income sources
 */
export interface RetirementPhase {
  /** Unique identifier for this phase type */
  id: RetirementPhaseId;

  /** Icelandic name for this phase */
  nameIs: string;

  /** English name for this phase */
  nameEn: string;

  /** Age when this phase starts */
  startAge: number;

  /** Age when this phase ends */
  endAge: number;

  /** Duration of this phase in years */
  durationYears: number;

  /** All income sources during this phase */
  incomeSources: PhaseIncomeSources;

  /** Monthly living expenses during phase (ISK) */
  monthlyExpenses: number;

  /** Amount required at start of this phase (ISK) */
  requiredAtStart: number;

  /** Amount remaining at end of phase, passed to next phase (ISK) */
  remainingAtEnd: number;

  /** Whether this phase is fully self-funded (no pension income) */
  isSelfFunded: boolean;

  /** Whether income exceeds expenses (surplus) */
  hasSurplus: boolean;

  /** Monthly surplus amount if hasSurplus is true (ISK) */
  surplusAmount: number;
}

// ============================================================================
// RESULTS
// ============================================================================

/**
 * Séreign projection results
 */
export interface SereignProjection {
  /** Projected séreign balance at age 60 (ISK) */
  balanceAt60: number;

  /** Monthly withdrawal amount if spread evenly from 60-67 (ISK) */
  monthlyWithdrawal60to67: number;
}

/**
 * TR means-testing calculation results
 */
export interface TREstimate {
  /** Estimated monthly TR after means-testing (ISK) */
  estimatedMonthly: number;

  /** Percentage reduction due to means-testing (0-100) */
  reductionPercent: number;

  /** Lífeyrissjóður income above exemption threshold (ISK) */
  incomeAboveExemption: number;

  /** Whether user receives full TR (no reduction) */
  isFullTR: boolean;

  /** Whether user receives zero TR (income too high) */
  isZeroTR: boolean;
}

/**
 * Warning about retirement plan viability or concerns
 */
export interface PlanWarning {
  /** Severity level of this warning */
  severity: WarningSeverity;

  /** Unique warning code (e.g., "LONG_GAP", "INSUFFICIENT_SAVINGS") */
  code: string;

  /** Warning message in Icelandic */
  messageIs: string;

  /** Warning message in English */
  messageEn: string;
}

/**
 * Complete calculation results for Pension-Aware FIRE calculator
 * This is the output that drives all visualizations and displays
 */
export interface PensionAwareFireResults {
  // ============ FI Numbers ============

  /** Traditional FI number (25x or 30x annual expenses, no pension considered) (ISK) */
  traditionalFINumber: number;

  /** Pension-adjusted FI number (what you actually need) (ISK) */
  pensionAdjustedFINumber: number;

  /** FI multiplier used (25 or 30) */
  fiMultiplier: number;

  // ============ Savings Comparison ============

  /** Amount saved by accounting for pensions (traditionalFI - pensionAdjustedFI) (ISK) */
  savingsDifference: number;

  /** Percentage reduction in required savings (0-100) */
  savingsPercentageReduction: number;

  // ============ Retirement Phases ============

  /** Array of retirement phases with all calculations */
  phases: RetirementPhase[];

  /** Total years in gap period (self-funded before any pensions) */
  totalGapYears: number;

  // ============ Timeline ============

  /** Years to reach traditional FI with current savings rate (null if not calculable) */
  yearsToTraditionalFI: number | null;

  /** Years to reach pension-adjusted FI with current savings rate (null if not calculable) */
  yearsToPensionAdjustedFI: number | null;

  /** Years earlier you can retire with pension-aware planning (null if not calculable) */
  yearsEarlierRetirement: number | null;

  // ============ Pension Projections ============

  /** Séreign (private pension) projections */
  projectedSereign: SereignProjection;

  /** TR (state pension) estimate with means-testing */
  projectedTR: TREstimate;

  // ============ End State ============

  /** Estimated remaining funds at age 90 (ISK) */
  estimatedSurplusAt90: number;

  // ============ Validation ============

  /** Whether the retirement plan is mathematically viable */
  isViable: boolean;

  /** Array of warnings about the plan (empty if none) */
  warnings: PlanWarning[];
}

// ============================================================================
// SCENARIO COMPARISON
// ============================================================================

/**
 * Saved scenario for comparison feature
 * Allows users to save and compare different retirement strategies
 */
export interface SavedScenario {
  /** Unique identifier */
  id: string;

  /** User-provided name for this scenario */
  name: string;

  /** When this scenario was created */
  createdAt: Date;

  /** Snapshot of inputs that generated this scenario */
  inputs: Partial<PensionAwareFireState>;

  /** Snapshot of results for this scenario */
  results: PensionAwareFireResults;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Icelandic labels for expense tiers
 */
export const EXPENSE_TIER_LABELS: Record<ExpenseTier, string> = {
  barebones: 'Lágmarkslífsstíll',
  comfortable: 'Þægilegur lífsstíll',
  deluxe: 'Vandaður lífsstíll',
};

/**
 * Icelandic labels for retirement phases
 */
export const PHASE_LABELS: Record<RetirementPhaseId, { nameIs: string; nameEn: string }> = {
  gap: {
    nameIs: 'Biðtími (sjálfsfjármagnað)',
    nameEn: 'Gap Period (Self-Funded)',
  },
  'sereign-bridge': {
    nameIs: 'Séreign-brú',
    nameEn: 'Private Pension Bridge',
  },
  'full-pension': {
    nameIs: 'Full lífeyrir',
    nameEn: 'Full Pension',
  },
};

/**
 * localStorage key for pension-aware FIRE state
 */
export const STORAGE_KEY = 'pensionAwareFire_state';

// ============================================================================
// GOAL GAP ANALYSIS TYPES
// ============================================================================

/**
 * Savings projection to retirement age
 * Shows whether current savings trajectory will meet gap phase requirements
 */
export interface SavingsProjection {
  /** Projected total savings at retirement age (ISK) */
  projectedAtRetirement: number;

  /** Amount required for gap phase at retirement (ISK) */
  requiredForGapPhase: number;

  /** Whether projected savings meet or exceed requirements */
  isOnTrack: boolean;

  /** Shortfall amount if behind (0 if on track) (ISK) */
  shortfall: number;

  /** Surplus amount if ahead (0 if behind) (ISK) */
  surplus: number;
}

/**
 * Recommendations for closing a savings gap
 * Three options: reduce expenses, increase savings, or lump sum
 */
export interface GapRecommendations {
  /** Option A: Reduce monthly expenses */
  expenseReduction: {
    /** Monthly amount to reduce expenses by (ISK) */
    monthlyAmount: number;
    /** Percentage reduction required */
    percentReduction: number;
    /** New monthly expenses after reduction (ISK) */
    newMonthlyExpenses: number;
  };

  /** Option B: Increase monthly savings */
  additionalSavings: {
    /** Additional monthly savings needed (ISK) */
    monthlyAmount: number;
    /** Percentage increase required */
    percentIncrease: number;
    /** New monthly savings after increase (ISK) */
    newMonthlySavings: number;
  };

  /** Option C: Lump sum (e.g., from house sale) */
  lumpSum: {
    /** Amount needed as one-time contribution (ISK) */
    amountNeeded: number;
    /** Explanatory note about lump sum option */
    note: string;
  };
}

/**
 * Complete goal gap analysis result
 * Combines projection, recommendations, and context
 */
export interface GoalGapAnalysis {
  /** Savings projection to retirement */
  projection: SavingsProjection;

  /** Recommendations if shortfall exists (null if on track) */
  recommendations: GapRecommendations | null;

  /** Years remaining until retirement */
  yearsToRetirement: number;

  /** Duration of gap phase in years */
  gapPhaseDuration: number;
}
