/**
 * TypeScript types for the Travel/Vacation Cost Calculator
 * Based on "Your Money or Your Life" philosophy
 *
 * This calculator helps users understand the TRUE cost of travel
 * in terms of life energy (hours of life) and opportunity cost.
 */

/**
 * Cost breakdown for a trip
 */
export interface TripCosts {
  /** Flight or transportation to destination (ISK) */
  transportation: number;
  /** Total accommodation cost (ISK) */
  accommodation: number;
  /** Daily food cost (ISK/day) */
  foodPerDay: number;
  /** Total cost for activities and entertainment (ISK) */
  activities: number;
  /** Local transportation (car rental, taxis, public transit) (ISK) */
  localTransport: number;
  /** Other expenses (ISK) */
  other: number;
}

/**
 * Basic trip information
 */
export interface TripDetails {
  /** Trip name (optional) */
  name?: string;
  /** Trip length in days */
  days: number;
  /** Destination (optional) */
  destination?: string;
}

/**
 * Complete input data for a trip
 */
export interface TripInput {
  /** Basic trip information */
  details: TripDetails;
  /** Cost breakdown */
  costs: TripCosts;
}

/**
 * Settings for calculations
 */
export interface TravelCalculationSettings {
  /** Expected annual return rate (0-1, e.g., 0.07 for 7%) */
  expectedReturnRate: number;
  /** Time periods for future value calculations (years) */
  futureValueYears: number[];
  /** Daily staycation cost (0 if not used) */
  staycationDailyCost: number;
  /** Whether to show staycation comparison */
  showStaycationComparison: boolean;
}

/**
 * Total cost breakdown
 */
export interface TotalCostBreakdown {
  /** Total cost (ISK) */
  total: number;
  /** Breakdown by category */
  breakdown: {
    transportation: number;
    accommodation: number;
    food: number; // foodPerDay × days
    activities: number;
    localTransport: number;
    other: number;
  };
  /** Cost per day (ISK/day) */
  costPerDay: number;
}

/**
 * Life energy cost of trip
 */
export interface LifeEnergyCost {
  /** Total work hours needed */
  totalHours: number;
  /** Work days (based on 8 hour day) */
  workDays: number;
  /** Work weeks (based on 40 hour week) */
  workWeeks: number;
  /** Life energy hours per trip day */
  hoursPerTripDay: number;
  /** Formatted readable string */
  formattedString: string;
}

/**
 * Future value for one time period
 */
export interface FutureValueResult {
  /** Number of years */
  years: number;
  /** Future value in ISK */
  value: number;
  /** Formatted readable string */
  formattedValue: string;
}

/**
 * Opportunity cost (what money could grow to if invested)
 */
export interface OpportunityCost {
  /** Future values for all time periods */
  futureValues: FutureValueResult[];
  /** Opportunity cost per trip day (20 year FV / trip length) */
  opportunityCostPerDay: number;
}

/**
 * Staycation comparison (optional)
 */
export interface StaycationComparison {
  /** Total cost to stay home */
  staycationTotalCost: number;
  /** Additional cost to travel (trip cost - staycation cost) */
  additionalCostToTravel: number;
  /** Additional cost in life energy hours */
  additionalLifeEnergyHours: number;
  /** Formatted summary text */
  formattedSummary: string;
}

/**
 * Impact on FI timeline (optional)
 */
export interface FIImpact {
  /** Additional work hours until FI */
  additionalWorkHours: number;
  /** Delay in FI date (days) */
  delayDays: number;
  /** Delay in months (rounded) */
  delayMonths: number;
  /** Number of similar trips that delays FI by 1 month */
  tripsPerMonthDelay: number;
  /** Formatted delay string */
  formattedDelay: string;
}

/**
 * Complete results for one trip
 */
export interface TripCalculationResult {
  /** Input data */
  input: TripInput;
  /** Total cost with breakdown */
  totalCost: TotalCostBreakdown;
  /** Life energy cost */
  lifeEnergyCost: LifeEnergyCost;
  /** Opportunity cost */
  opportunityCost: OpportunityCost;
  /** Staycation comparison (if enabled) */
  staycationComparison?: StaycationComparison;
  /** FI impact (if data available) */
  fiImpact?: FIImpact;
}

/**
 * Comparison of multiple trip options
 */
export interface TripComparison {
  /** List of results (2-3 options) */
  trips: TripCalculationResult[];
  /** Index of cheapest trip */
  cheapestTripIndex: number;
  /** Maximum life energy difference between options */
  maxLifeEnergyDifference: number;
  /** Savings with cheapest option */
  savingsWithCheapest: {
    currency: number;
    lifeEnergyHours: number;
  };
}

/**
 * Preset for common trips
 */
export interface TripPreset {
  /** Preset name */
  name: string;
  /** Description */
  description: string;
  /** Typical length (days) */
  typicalDays: number;
  /** Estimated cost ranges */
  estimatedCosts: {
    transportation: { min: number; max: number };
    accommodation: { min: number; max: number };
    foodPerDay: { min: number; max: number };
    activities: { min: number; max: number };
    localTransport: { min: number; max: number };
    other: { min: number; max: number };
  };
}

/**
 * Saved state for component
 */
export interface TravelVacationState {
  /** Main trip being analyzed */
  mainTrip: TripInput;
  /** Comparison trips (0-2 additional) */
  comparisonTrips: TripInput[];
  /** Settings */
  settings: TravelCalculationSettings;
  /** Whether to show comparison mode */
  showComparison: boolean;
}

/**
 * Required data from CalculatorContext
 */
export interface RequiredCalculatorData {
  /** Actual hourly wage from main calculator */
  actualHourlyWage: number | null;
  /** FI data (optional) */
  fiData?: {
    /** Annual savings */
    annualSavings: number;
    /** Current FI date (if calculated) */
    fiDate?: Date;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether input is valid */
  isValid: boolean;
  /** Error messages in Icelandic */
  errors: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: TravelCalculationSettings = {
  expectedReturnRate: 0.07, // 7% annual return
  futureValueYears: [10, 20, 30],
  staycationDailyCost: 0,
  showStaycationComparison: false,
};

/**
 * Initial trip input (empty state)
 */
export const INITIAL_TRIP_INPUT: TripInput = {
  details: {
    name: '',
    days: 7,
    destination: '',
  },
  costs: {
    transportation: 0,
    accommodation: 0,
    foodPerDay: 0,
    activities: 0,
    localTransport: 0,
    other: 0,
  },
};

/**
 * Initial application state
 */
export const INITIAL_STATE: TravelVacationState = {
  mainTrip: INITIAL_TRIP_INPUT,
  comparisonTrips: [],
  settings: DEFAULT_SETTINGS,
  showComparison: false,
};

/**
 * Presets for common trips from Iceland
 */
export const TRIP_PRESETS: TripPreset[] = [
  {
    name: 'Helgarferð til Evrópu',
    description: '3-4 daga borgarferð til Evrópu',
    typicalDays: 4,
    estimatedCosts: {
      transportation: { min: 40000, max: 80000 },
      accommodation: { min: 80000, max: 160000 }, // 20k-40k/night × 4
      foodPerDay: { min: 8000, max: 15000 },
      activities: { min: 10000, max: 30000 },
      localTransport: { min: 5000, max: 15000 },
      other: { min: 5000, max: 15000 },
    },
  },
  {
    name: 'Viku sumarhús á Íslandi',
    description: 'Einnar viku dvöl í sumarbústað',
    typicalDays: 7,
    estimatedCosts: {
      transportation: { min: 0, max: 0 },
      accommodation: { min: 150000, max: 300000 },
      foodPerDay: { min: 8000, max: 12000 },
      activities: { min: 20000, max: 50000 },
      localTransport: { min: 15000, max: 30000 }, // gas
      other: { min: 10000, max: 30000 },
    },
  },
  {
    name: 'Tveggja vikna langhryðjuferð',
    description: 'Langhryðjuferð til USA/Asíu',
    typicalDays: 14,
    estimatedCosts: {
      transportation: { min: 150000, max: 300000 },
      accommodation: { min: 210000, max: 560000 }, // 15k-40k/night × 14
      foodPerDay: { min: 10000, max: 20000 },
      activities: { min: 50000, max: 150000 },
      localTransport: { min: 30000, max: 80000 },
      other: { min: 20000, max: 50000 },
    },
  },
];

/**
 * localStorage key
 */
export const STORAGE_KEY = 'travelVacation_state';
