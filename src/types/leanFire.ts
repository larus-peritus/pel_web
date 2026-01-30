/**
 * TypeScript types for LeanFIRE Planner (Lágmarks FIRE Skipuleggjandi)
 *
 * This module defines all types for the LeanFIRE calculator, which helps users
 * plan for minimal-expense early retirement by analyzing barebones living costs,
 * comparing geographic options within Iceland, modeling expense reduction scenarios,
 * and providing personalized frugality optimization.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Geographic location type for Iceland
 */
export type GeographicLocation = 'reykjavik' | 'landsbyggd' | 'custom';

/**
 * FI multiplier options (withdrawal rate)
 * - 25x = 4% withdrawal rate
 * - 30x = 3.33% withdrawal rate (more conservative)
 */
export type FIMultiplier = 25 | 30;

/**
 * Expense source type
 */
export type ExpenseSource = 'baseline' | 'default' | 'custom';

/**
 * Spending category keys for LeanFIRE expense tracking
 */
export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'healthcare'
  | 'insurance'
  | 'utilities'
  | 'personal'
  | 'entertainment'
  | 'other';

/**
 * Reduction percentage options for expense reduction scenarios
 */
export type ReductionPercent = 10 | 25 | 50 | 100;

/**
 * Frugality tip difficulty level
 */
export type TipDifficulty = 'easy' | 'moderate' | 'hard';

// ============================================================================
// EXPENSE STRUCTURES
// ============================================================================

/**
 * Monthly expenses by category (in ISK)
 * Used for barebones/minimum living cost calculations
 */
export interface CategoryExpenses {
  /** Húsnæði - Housing costs (rent/mortgage) */
  housing: number;

  /** Matur - Food costs */
  food: number;

  /** Samgöngur - Transportation costs */
  transport: number;

  /** Heilsa - Healthcare costs */
  healthcare: number;

  /** Tryggingar - Insurance costs */
  insurance: number;

  /** Veitur - Utilities (electricity, internet, phone) */
  utilities: number;

  /** Persónuleg - Personal spending */
  personal: number;

  /** Afþreying - Entertainment */
  entertainment: number;

  /** Annað - Other expenses */
  other: number;
}

// ============================================================================
// STATE AND RESULTS
// ============================================================================

/**
 * Complete LeanFIRE calculator state
 */
export interface LeanFireState {
  /** Selected geographic location */
  selectedLocation: GeographicLocation;

  /** Custom location expenses (if selectedLocation === 'custom') */
  customLocationExpenses?: CategoryExpenses;

  /** Barebones expenses (from baseline or defaults) */
  barebonesExpenses: CategoryExpenses;

  /** Source of expense data */
  expenseSource: ExpenseSource;

  /** FI calculation multiplier */
  fiMultiplier: FIMultiplier;

  /** Active expense reduction scenarios */
  reductionScenarios: ReductionScenario[];

  /** Current savings amount (optional, for timeline calculations) */
  currentSavings: number | null;

  /** Current age (optional, for timeline calculations) */
  currentAge: number | null;

  /** Monthly savings rate (optional, for timeline calculations) */
  savingsRate: number | null;

  /** Expected investment return (default 0.05 = 5%) */
  investmentReturn: number;

  /** Last updated timestamp */
  lastUpdated: Date;

  /** State version for migrations */
  version: number;
}

/**
 * Complete LeanFIRE calculation results
 */
export interface LeanFireResults {
  /** Monthly barebones expenses */
  barebonesMonthly: number;

  /** Annual barebones expenses */
  barebonesAnnual: number;

  /** Minimum FI number (barebones annual × multiplier) */
  minimumFINumber: number;

  /** FI multiplier used */
  fiMultiplier: FIMultiplier;

  /** Geographic comparison (if applicable) */
  locationComparison?: GeographicComparison;

  /** Total monthly savings from all reduction scenarios */
  totalReductions: number;

  /** New monthly expenses after reductions */
  newMonthlyExpenses: number;

  /** New FI number after reductions */
  newFINumber: number;

  /** Total months saved from all reductions */
  totalMonthsSaved: number;

  /** Years to FI (if current savings known) */
  yearsToFI?: number;

  /** Months to FI (if current savings known) */
  monthsToFI?: number;

  /** Personalized frugality tips */
  frugalityTips: FrugalityTip[];

  /** Life energy calculations (if AWH available) */
  lifeEnergy?: {
    /** Minimum FI number in life energy hours */
    minimumFIInHours: number;
    /** Minimum FI number in work years */
    minimumFIInYears: number;
    /** Comfortable FI in work years */
    comfortableFIInYears: number;
    /** Deluxe FI in work years */
    deluxeFIInYears: number;
  };
}

// ============================================================================
// GEOGRAPHIC COMPARISON
// ============================================================================

/**
 * Complete geographic comparison between locations
 */
export interface GeographicComparison {
  /** Reykjavík (capital) profile */
  reykjavik: LocationProfile;

  /** Landsbyggð (rural) profile */
  landsbyggd: LocationProfile;

  /** Differences by category (positive = more expensive in Reykjavík) */
  differences: CategoryExpenses;

  /** Difference in FI numbers */
  fiNumberDifference: number;

  /** Timeline difference in months (if savings known) */
  timelineDifference?: number;

  /** Net monthly savings (rural vs urban) */
  netSavings: number;
}

/**
 * Location profile with expenses and pros/cons
 */
export interface LocationProfile {
  /** Location identifier */
  location: 'reykjavik' | 'landsbyggd';

  /** Monthly expenses by category */
  expenses: CategoryExpenses;

  /** Total monthly expenses */
  totalMonthly: number;

  /** Total annual expenses */
  totalAnnual: number;

  /** FI number for this location */
  fiNumber: number;

  /** Advantages of this location (Icelandic text) */
  pros: string[];

  /** Disadvantages of this location (Icelandic text) */
  cons: string[];
}

// ============================================================================
// EXPENSE REDUCTION SCENARIOS
// ============================================================================

/**
 * Expense reduction scenario ("what if I cut X?")
 */
export interface ReductionScenario {
  /** Unique identifier */
  id: string;

  /** User-defined scenario name */
  name: string;

  /** Expense category being reduced */
  category: ExpenseCategory;

  /** Current expense amount */
  currentAmount: number;

  /** Reduction percentage */
  reductionPercent: ReductionPercent;

  /** New expense amount after reduction */
  newAmount: number;

  /** Monthly savings amount */
  monthlySavings: number;

  /** Annual savings amount */
  annualSavings: number;

  /** Impact on FI number */
  fiNumberImpact: number;

  /** Timeline impact in months saved */
  timelineImpact: number;

  /** Efficiency rating (months saved per 10k kr cut) */
  efficiency: number;

  /** Display order */
  order: number;
}

// ============================================================================
// FRUGALITY OPTIMIZATION
// ============================================================================

/**
 * Personalized frugality tip
 */
export interface FrugalityTip {
  /** Unique identifier */
  id: string;

  /** Related expense category */
  category: ExpenseCategory;

  /** Tip title (Icelandic) */
  title: string;

  /** Actionable description (Icelandic) */
  description: string;

  /** Potential monthly savings in ISK */
  potentialSavings: number;

  /** Timeline impact in months saved */
  timelineImpact: number;

  /** Implementation difficulty */
  difficulty: TipDifficulty;

  /** Iceland-specific resources (stores, services, etc.) */
  icelandicResources?: string[];

  /** Whether user has implemented this tip */
  implemented: boolean;
}

// ============================================================================
// COST OF LIVING COMPARISON
// ============================================================================

/**
 * Cost of living comparison between lifestyle tiers
 * Used for trade-off visualization
 */
export interface CostOfLivingComparison {
  /** Barebones/minimum viable lifestyle */
  barebones: {
    /** Monthly expenses */
    monthlyExpenses: number;
    /** FI number */
    fiNumber: number;
    /** Years to FI (if data available) */
    yearsToFI?: number;
    /** Life energy in work years (if AWH available) */
    lifeEnergyYears?: number;
  };

  /** Comfortable lifestyle */
  comfortable: {
    /** Monthly expenses */
    monthlyExpenses: number;
    /** FI number */
    fiNumber: number;
    /** Years to FI (if data available) */
    yearsToFI?: number;
    /** Life energy in work years (if AWH available) */
    lifeEnergyYears?: number;
  };

  /** Deluxe/luxury lifestyle */
  deluxe: {
    /** Monthly expenses */
    monthlyExpenses: number;
    /** FI number */
    fiNumber: number;
    /** Years to FI (if data available) */
    yearsToFI?: number;
    /** Life energy in work years (if AWH available) */
    lifeEnergyYears?: number;
  };

  /** User's current position (if data available) */
  current?: {
    /** Monthly expenses */
    monthlyExpenses: number;
    /** FI number */
    fiNumber: number;
    /** Years to FI (if data available) */
    yearsToFI?: number;
    /** Life energy in work years (if AWH available) */
    lifeEnergyYears?: number;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Icelandic labels for geographic locations
 */
export const GEOGRAPHIC_LOCATION_LABELS: Record<GeographicLocation, string> = {
  reykjavik: 'Reykjavík',
  landsbyggd: 'Landsbyggð',
  custom: 'Sérsniðið',
};

/**
 * Icelandic labels for expense categories
 */
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  housing: 'Húsnæði',
  food: 'Matur',
  transport: 'Samgöngur',
  healthcare: 'Heilsa',
  insurance: 'Tryggingar',
  utilities: 'Veitur',
  personal: 'Persónuleg',
  entertainment: 'Afþreying',
  other: 'Annað',
};

/**
 * Icelandic labels for difficulty levels
 */
export const DIFFICULTY_LABELS: Record<TipDifficulty, string> = {
  easy: 'Auðvelt',
  moderate: 'Í meðallagi',
  hard: 'Erfitt',
};

/**
 * localStorage key for LeanFIRE state
 */
export const STORAGE_KEY = 'leanFire_state';
