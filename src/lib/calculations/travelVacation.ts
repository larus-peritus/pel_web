/**
 * Calculation functions for Travel/Vacation Cost Calculator
 * Based on "Your Money or Your Life" philosophy
 */

import { formatCurrency } from '../utils/formatters';
import type {
  TripCosts,
  TripInput,
  TravelCalculationSettings,
  TotalCostBreakdown,
  LifeEnergyCost,
  FutureValueResult,
  OpportunityCost,
  StaycationComparison,
  FIImpact,
  TripCalculationResult,
  TripComparison,
  TripPreset,
  RequiredCalculatorData,
} from '../../types/travelVacation';

// ============================================================================
// TOTAL COST CALCULATIONS (Task 1.2)
// ============================================================================

/**
 * Calculates total cost of trip with breakdown
 *
 * @param costs - Trip cost breakdown
 * @param days - Trip length in days
 * @returns Total cost breakdown
 */
export function calculateTotalCost(
  costs: TripCosts,
  days: number,
): TotalCostBreakdown {
  const foodTotal = costs.foodPerDay * days;

  const total =
    costs.transportation +
    costs.accommodation +
    foodTotal +
    costs.activities +
    costs.localTransport +
    costs.other;

  const costPerDay = total / days;

  return {
    total,
    breakdown: {
      transportation: costs.transportation,
      accommodation: costs.accommodation,
      food: foodTotal,
      activities: costs.activities,
      localTransport: costs.localTransport,
      other: costs.other,
    },
    costPerDay,
  };
}

// ============================================================================
// LIFE ENERGY CALCULATIONS (Task 1.3)
// ============================================================================

/**
 * Formats hours into Icelandic readable string
 *
 * @param hours - Number of hours
 * @returns Formatted string (e.g., "2 vikur og 3 dagar")
 */
export function formatLifeEnergy(hours: number): string {
  const weeks = Math.floor(hours / 40);
  const remainingHours = hours % 40;
  const days = Math.floor(remainingHours / 8);
  const finalHours = Math.floor(remainingHours % 8);

  const parts: string[] = [];

  if (weeks > 0) {
    parts.push(`${weeks} ${weeks === 1 ? 'vika' : 'vikur'}`);
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dagur' : 'dagar'}`);
  }

  if (finalHours > 0 || parts.length === 0) {
    parts.push(
      `${finalHours} ${finalHours === 1 ? 'klukkustund' : 'klukkustundir'}`,
    );
  }

  return parts.join(' og ');
}

/**
 * Calculates life energy cost of trip
 *
 * @param totalCost - Total trip cost
 * @param actualHourlyWage - Actual hourly wage
 * @param tripDays - Length of trip in days
 * @returns Life energy cost breakdown
 */
export function calculateLifeEnergyCost(
  totalCost: number,
  actualHourlyWage: number,
  tripDays: number,
): LifeEnergyCost {
  if (actualHourlyWage <= 0) {
    throw new Error('actualHourlyWage must be greater than 0');
  }

  const totalHours = totalCost / actualHourlyWage;
  const workDays = totalHours / 8;
  const workWeeks = totalHours / 40;
  const hoursPerTripDay = totalHours / tripDays;

  const formattedString = formatLifeEnergy(totalHours);

  return {
    totalHours,
    workDays,
    workWeeks,
    hoursPerTripDay,
    formattedString,
  };
}

// ============================================================================
// OPPORTUNITY COST CALCULATIONS (Task 1.4)
// ============================================================================

/**
 * Calculates future value
 *
 * @param presentValue - Present value (initial investment)
 * @param annualReturnRate - Annual return rate (0-1)
 * @param years - Number of years
 * @returns Future value
 */
export function calculateFutureValue(
  presentValue: number,
  annualReturnRate: number,
  years: number,
): number {
  return presentValue * Math.pow(1 + annualReturnRate, years);
}

/**
 * Calculates opportunity cost (future value if invested instead)
 *
 * @param totalCost - Total trip cost
 * @param settings - Calculation settings
 * @param tripDays - Length of trip in days
 * @returns Opportunity cost breakdown
 */
export function calculateOpportunityCost(
  totalCost: number,
  settings: TravelCalculationSettings,
  tripDays: number,
): OpportunityCost {
  const futureValues = settings.futureValueYears.map((years) => {
    const value = calculateFutureValue(
      totalCost,
      settings.expectedReturnRate,
      years,
    );

    return {
      years,
      value,
      formattedValue: formatCurrency(value),
    };
  });

  // Opportunity cost per day = 20 year future value / trip length
  const fv20 = futureValues.find((fv) => fv.years === 20);
  const opportunityCostPerDay = fv20 ? fv20.value / tripDays : 0;

  return {
    futureValues,
    opportunityCostPerDay,
  };
}

// ============================================================================
// STAYCATION COMPARISON (Task 1.5)
// ============================================================================

/**
 * Calculates staycation comparison
 *
 * @param totalTripCost - Total cost of trip
 * @param staycationDailyCost - Daily cost of staying home
 * @param tripDays - Length of trip in days
 * @param actualHourlyWage - Actual hourly wage
 * @returns Staycation comparison
 */
export function calculateStaycationComparison(
  totalTripCost: number,
  staycationDailyCost: number,
  tripDays: number,
  actualHourlyWage: number,
): StaycationComparison {
  const staycationTotalCost = staycationDailyCost * tripDays;
  const additionalCostToTravel = totalTripCost - staycationTotalCost;
  const additionalLifeEnergyHours = additionalCostToTravel / actualHourlyWage;

  const formattedSummary = `Þú borgir ${formatCurrency(additionalCostToTravel)} (${additionalLifeEnergyHours.toFixed(1)} klukkustundir) aukalega til að ferðast.`;

  return {
    staycationTotalCost,
    additionalCostToTravel,
    additionalLifeEnergyHours,
    formattedSummary,
  };
}

// ============================================================================
// FI IMPACT CALCULATION (Task 1.6)
// ============================================================================

/**
 * Formats delay into Icelandic readable string
 *
 * @param months - Number of months
 * @returns Formatted string (e.g., "2 mánuðir", "1 ár og 3 mánuðir")
 */
export function formatDelay(months: number): string {
  if (months < 1) {
    return 'minna en mánuð';
  }

  if (months < 12) {
    return `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'ár' : 'ár'}`;
  }

  return `${years} ${years === 1 ? 'ár' : 'ár'} og ${remainingMonths} ${remainingMonths === 1 ? 'mánuður' : 'mánuðir'}`;
}

/**
 * Calculates impact on FI timeline
 *
 * @param totalCost - Total trip cost
 * @param lifeEnergyCost - Life energy cost
 * @param fiData - FI data (optional)
 * @returns FI impact (undefined if no data)
 */
export function calculateFIImpact(
  totalCost: number,
  lifeEnergyCost: LifeEnergyCost,
  fiData?: RequiredCalculatorData['fiData'],
): FIImpact | undefined {
  if (!fiData || !fiData.annualSavings || fiData.annualSavings <= 0) {
    return undefined;
  }

  const additionalWorkHours = lifeEnergyCost.totalHours;

  // Delay in years
  const delayYears = totalCost / fiData.annualSavings;
  const delayDays = Math.round(delayYears * 365);
  const delayMonths = Math.round(delayYears * 12);

  // Number of trips that delays FI by 1 month
  const monthlySavings = fiData.annualSavings / 12;
  const tripsPerMonthDelay = monthlySavings / totalCost;

  const formattedDelay = formatDelay(delayMonths);

  return {
    additionalWorkHours,
    delayDays,
    delayMonths,
    tripsPerMonthDelay,
    formattedDelay,
  };
}

// ============================================================================
// MASTER CALCULATION FUNCTIONS (Task 1.7)
// ============================================================================

/**
 * Calculates complete results for one trip
 *
 * @param trip - Trip input
 * @param calculatorData - Required calculator data
 * @param settings - Calculation settings
 * @returns Complete trip calculation result
 */
export function calculateTripResult(
  trip: TripInput,
  calculatorData: RequiredCalculatorData,
  settings: TravelCalculationSettings,
): TripCalculationResult {
  if (!calculatorData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required');
  }

  if (trip.details.days <= 0) {
    throw new Error('Trip days must be greater than 0');
  }

  // 1. Total cost
  const totalCost = calculateTotalCost(trip.costs, trip.details.days);

  // 2. Life energy cost
  const lifeEnergyCost = calculateLifeEnergyCost(
    totalCost.total,
    calculatorData.actualHourlyWage,
    trip.details.days,
  );

  // 3. Opportunity cost
  const opportunityCost = calculateOpportunityCost(
    totalCost.total,
    settings,
    trip.details.days,
  );

  // 4. Staycation comparison (if enabled)
  let staycationComparison: StaycationComparison | undefined;
  if (settings.showStaycationComparison) {
    staycationComparison = calculateStaycationComparison(
      totalCost.total,
      settings.staycationDailyCost,
      trip.details.days,
      calculatorData.actualHourlyWage,
    );
  }

  // 5. FI impact (if data available)
  const fiImpact = calculateFIImpact(
    totalCost.total,
    lifeEnergyCost,
    calculatorData.fiData,
  );

  return {
    input: trip,
    totalCost,
    lifeEnergyCost,
    opportunityCost,
    staycationComparison,
    fiImpact,
  };
}

/**
 * Compares multiple trip options
 *
 * @param trips - Array of trip inputs (2-3 items)
 * @param calculatorData - Required calculator data
 * @param settings - Calculation settings
 * @returns Trip comparison
 */
export function compareTrips(
  trips: TripInput[],
  calculatorData: RequiredCalculatorData,
  settings: TravelCalculationSettings,
): TripComparison {
  if (!calculatorData.actualHourlyWage) {
    throw new Error('actualHourlyWage is required for comparison');
  }

  // Calculate results for each trip
  const results = trips.map((trip) =>
    calculateTripResult(trip, calculatorData, settings),
  );

  // Find cheapest trip
  const cheapestTripIndex = results.reduce(
    (minIdx, result, idx, arr) =>
      result.totalCost.total < arr[minIdx].totalCost.total ? idx : minIdx,
    0,
  );

  // Calculate maximum differences
  const costs = results.map((r) => r.totalCost.total);
  const lifeEnergyHours = results.map((r) => r.lifeEnergyCost.totalHours);

  const maxCost = Math.max(...costs);
  const minCost = Math.min(...costs);
  const maxLifeEnergy = Math.max(...lifeEnergyHours);
  const minLifeEnergy = Math.min(...lifeEnergyHours);

  const maxLifeEnergyDifference = maxLifeEnergy - minLifeEnergy;

  const savingsWithCheapest = {
    currency: maxCost - minCost,
    lifeEnergyHours: maxLifeEnergyDifference,
  };

  return {
    trips: results,
    cheapestTripIndex,
    maxLifeEnergyDifference,
    savingsWithCheapest,
  };
}

/**
 * Applies a preset to create trip input
 *
 * @param preset - Trip preset
 * @returns Trip input with filled values
 */
export function applyPreset(preset: TripPreset): TripInput {
  // Use midpoint for all cost ranges
  const costs: TripCosts = {
    transportation: getMidpoint(preset.estimatedCosts.transportation),
    accommodation: getMidpoint(preset.estimatedCosts.accommodation),
    foodPerDay: getMidpoint(preset.estimatedCosts.foodPerDay),
    activities: getMidpoint(preset.estimatedCosts.activities),
    localTransport: getMidpoint(preset.estimatedCosts.localTransport),
    other: getMidpoint(preset.estimatedCosts.other),
  };

  return {
    details: {
      name: preset.name,
      days: preset.typicalDays,
      destination: '',
    },
    costs,
  };
}

/**
 * Finds midpoint between min and max
 *
 * @param range - Min/max range
 * @returns Midpoint value (rounded)
 */
function getMidpoint(range: { min: number; max: number }): number {
  return Math.round((range.min + range.max) / 2);
}
