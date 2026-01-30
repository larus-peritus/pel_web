/**
 * Commute Cost Calculation Functions
 *
 * Calculates the true cost of commuting including:
 * - Direct costs (fuel, transit, parking, tolls)
 * - Indirect costs (depreciation, insurance, maintenance for cars)
 * - Time spent commuting
 * - Life energy impact
 * - FI (Financial Independence) impact
 */

import type {
  CommuteInputs,
  CommuteResults,
  CommuteCostBreakdownItem,
  CommutePreset,
} from '@/types/calculator';
import { dollarsToLifeEnergy } from './lifeEnergy';
import { calculateFutureValue } from './subscriptions';

/**
 * Average weeks per month for calculations
 */
const WEEKS_PER_MONTH = 4.33;

/**
 * Standard annual return rate for FI calculations (7%)
 */
const ANNUAL_RETURN_RATE = 0.07;

/**
 * Kílómetragjald - Icelandic state fee per km driven
 * This is charged by the state for every km driven
 * Rate as of 2026: 6.95 kr/km
 */
const KILOMETRAGJALD_PER_KM = 6.95;

/**
 * Calculate car commute costs
 */
function calculateCarCosts(
  inputs: CommuteInputs
): { direct: number; indirect: number; breakdown: CommuteCostBreakdownItem[] } {
  if (!inputs.car) {
    return { direct: 0, indirect: 0, breakdown: [] };
  }

  const { car } = inputs;
  const tripsPerMonth = inputs.daysPerWeek * WEEKS_PER_MONTH * 2; // Round trip
  const kmPerMonth = inputs.distanceKm * tripsPerMonth;
  const daysPerMonth = inputs.daysPerWeek * WEEKS_PER_MONTH;

  // Direct costs
  let fuelCost = 0;
  if (car.fuelType === 'electric') {
    // kWh consumption
    const kwhPerMonth = (kmPerMonth * car.fuelConsumption) / 100;
    fuelCost = kwhPerMonth * car.fuelPrice;
  } else {
    // Gasoline or diesel (liters)
    const litersPerMonth = (kmPerMonth * car.fuelConsumption) / 100;
    fuelCost = litersPerMonth * car.fuelPrice;
  }

  const parkingCost = car.parkingCostPerDay * daysPerMonth;
  const tollsCost = car.tollsPerDay * daysPerMonth;

  // Kílómetragjald - state fee per km driven
  const kilometragjaldCost = kmPerMonth * KILOMETRAGJALD_PER_KM;

  const directCost = fuelCost + parkingCost + tollsCost + kilometragjaldCost;

  // Indirect costs (already monthly)
  const inspectionCostPerMonth = car.inspectionCost / 24; // Every 2 years
  const indirectCost =
    car.monthlyDepreciation +
    car.monthlyInsurance +
    car.monthlyMaintenance +
    inspectionCostPerMonth;

  // Create breakdown
  const totalCost = directCost + indirectCost;
  const breakdown: CommuteCostBreakdownItem[] = [];

  if (fuelCost > 0) {
    breakdown.push({
      category: 'fuel',
      label:
        car.fuelType === 'electric'
          ? 'Rafmagn'
          : car.fuelType === 'diesel'
            ? 'Díselolía'
            : 'Bensín',
      monthlyCost: fuelCost,
      percentage: (fuelCost / totalCost) * 100,
    });
  }

  if (parkingCost > 0) {
    breakdown.push({
      category: 'parking',
      label: 'Stæði',
      monthlyCost: parkingCost,
      percentage: (parkingCost / totalCost) * 100,
    });
  }

  if (tollsCost > 0) {
    breakdown.push({
      category: 'tolls',
      label: 'Umferðargjöld',
      monthlyCost: tollsCost,
      percentage: (tollsCost / totalCost) * 100,
    });
  }

  if (kilometragjaldCost > 0) {
    breakdown.push({
      category: 'kilometragjald',
      label: 'Kílómetragjald',
      monthlyCost: kilometragjaldCost,
      percentage: (kilometragjaldCost / totalCost) * 100,
    });
  }

  if (car.monthlyDepreciation > 0) {
    breakdown.push({
      category: 'depreciation',
      label: 'Afskriftir',
      monthlyCost: car.monthlyDepreciation,
      percentage: (car.monthlyDepreciation / totalCost) * 100,
    });
  }

  if (car.monthlyInsurance > 0) {
    breakdown.push({
      category: 'insurance',
      label: 'Tryggingar',
      monthlyCost: car.monthlyInsurance,
      percentage: (car.monthlyInsurance / totalCost) * 100,
    });
  }

  if (car.monthlyMaintenance > 0) {
    breakdown.push({
      category: 'maintenance',
      label: 'Viðhald',
      monthlyCost: car.monthlyMaintenance,
      percentage: (car.monthlyMaintenance / totalCost) * 100,
    });
  }

  if (inspectionCostPerMonth > 0) {
    breakdown.push({
      category: 'inspection',
      label: 'Skoðun',
      monthlyCost: inspectionCostPerMonth,
      percentage: (inspectionCostPerMonth / totalCost) * 100,
    });
  }

  return { direct: directCost, indirect: indirectCost, breakdown };
}

/**
 * Calculate transit commute costs
 */
function calculateTransitCosts(inputs: CommuteInputs): number {
  if (!inputs.transit) {
    return 0;
  }

  const { transit } = inputs;

  if (transit.ticketType === 'monthly') {
    return transit.monthlyCost || 0;
  } else {
    // Per-ride calculation
    const ridesPerMonth = inputs.daysPerWeek * WEEKS_PER_MONTH * 2; // Round trip
    return (transit.costPerRide || 0) * ridesPerMonth;
  }
}

/**
 * Calculate active commute costs (bike/walk)
 */
function calculateActiveCosts(inputs: CommuteInputs): number {
  if (!inputs.active) {
    return 0;
  }

  return inputs.active.monthlyMaintenanceCost;
}

/**
 * Calculate time spent commuting
 */
function calculateTimeCosts(inputs: CommuteInputs): {
  minutesPerMonth: number;
  hoursPerMonth: number;
  hoursPerYear: number;
  daysPerYear: number;
} {
  if (inputs.commuteMethod === 'remote') {
    return {
      minutesPerMonth: 0,
      hoursPerMonth: 0,
      hoursPerYear: 0,
      daysPerYear: 0,
    };
  }

  const tripsPerMonth = inputs.daysPerWeek * WEEKS_PER_MONTH * 2; // Round trip
  const minutesPerMonth = inputs.timeMinutesOneWay * tripsPerMonth;
  const hoursPerMonth = minutesPerMonth / 60;
  const hoursPerYear = hoursPerMonth * 12;
  const daysPerYear = hoursPerYear / 24;

  return {
    minutesPerMonth,
    hoursPerMonth,
    hoursPerYear,
    daysPerYear,
  };
}

/**
 * Calculate life energy costs
 */
function calculateLifeEnergyCosts(
  monthlyCost: number,
  hoursPerMonth: number,
  actualHourlyWage: number
): {
  lifeEnergyFromTime: number;
  lifeEnergyFromMoney: number;
  totalPerMonth: number;
  totalPerYear: number;
} {
  const lifeEnergyFromTime = hoursPerMonth;
  const lifeEnergyFromMoney =
    actualHourlyWage > 0 ? dollarsToLifeEnergy(monthlyCost, actualHourlyWage) : 0;
  const totalPerMonth = lifeEnergyFromTime + lifeEnergyFromMoney;
  const totalPerYear = totalPerMonth * 12;

  return {
    lifeEnergyFromTime,
    lifeEnergyFromMoney,
    totalPerMonth,
    totalPerYear,
  };
}

/**
 * Main calculation function for commute results
 *
 * @param inputs - Commute input data
 * @param actualHourlyWage - User's actual hourly wage from main calculator
 * @returns Complete commute results with all calculations
 */
export function calculateCommuteResults(
  inputs: CommuteInputs,
  actualHourlyWage: number
): CommuteResults {
  // Handle remote work (all zeros)
  if (inputs.commuteMethod === 'remote') {
    return {
      directMonthlyCost: 0,
      indirectMonthlyCost: 0,
      totalMonthlyCost: 0,
      totalYearlyCost: 0,
      costBreakdown: [],
      timePerMonthMinutes: 0,
      timePerMonthHours: 0,
      timePerYearHours: 0,
      timePerYearDays: 0,
      lifeEnergyFromTime: 0,
      lifeEnergyFromMoney: 0,
      totalLifeEnergyHoursPerMonth: 0,
      totalLifeEnergyHoursPerYear: 0,
      futureValue5Years: 0,
      futureValue10Years: 0,
      futureValue20Years: 0,
    };
  }

  // Calculate costs based on method
  let directCost = 0;
  let indirectCost = 0;
  let costBreakdown: CommuteCostBreakdownItem[] = [];

  if (inputs.commuteMethod === 'car') {
    const carCosts = calculateCarCosts(inputs);
    directCost = carCosts.direct;
    indirectCost = carCosts.indirect;
    costBreakdown = carCosts.breakdown;
  } else if (inputs.commuteMethod === 'transit') {
    directCost = calculateTransitCosts(inputs);
    costBreakdown = [
      {
        category: 'transit',
        label: 'Almenningssamgöngur',
        monthlyCost: directCost,
        percentage: 100,
      },
    ];
  } else if (inputs.commuteMethod === 'bike' || inputs.commuteMethod === 'walk') {
    directCost = calculateActiveCosts(inputs);
    if (directCost > 0) {
      costBreakdown = [
        {
          category: 'maintenance',
          label: inputs.commuteMethod === 'bike' ? 'Viðhald hjóls' : 'Viðhald',
          monthlyCost: directCost,
          percentage: 100,
        },
      ];
    }
  }

  const totalMonthlyCost = directCost + indirectCost;
  const totalYearlyCost = totalMonthlyCost * 12;

  // Calculate time
  const timeCosts = calculateTimeCosts(inputs);

  // Calculate life energy
  const lifeEnergy = calculateLifeEnergyCosts(
    totalMonthlyCost,
    timeCosts.hoursPerMonth,
    actualHourlyWage
  );

  // Calculate future value if invested instead
  const futureValue5Years = calculateFutureValue(
    totalMonthlyCost,
    ANNUAL_RETURN_RATE,
    5
  );
  const futureValue10Years = calculateFutureValue(
    totalMonthlyCost,
    ANNUAL_RETURN_RATE,
    10
  );
  const futureValue20Years = calculateFutureValue(
    totalMonthlyCost,
    ANNUAL_RETURN_RATE,
    20
  );

  return {
    directMonthlyCost: directCost,
    indirectMonthlyCost: indirectCost,
    totalMonthlyCost,
    totalYearlyCost,
    costBreakdown,
    timePerMonthMinutes: timeCosts.minutesPerMonth,
    timePerMonthHours: timeCosts.hoursPerMonth,
    timePerYearHours: timeCosts.hoursPerYear,
    timePerYearDays: timeCosts.daysPerYear,
    lifeEnergyFromTime: lifeEnergy.lifeEnergyFromTime,
    lifeEnergyFromMoney: lifeEnergy.lifeEnergyFromMoney,
    totalLifeEnergyHoursPerMonth: lifeEnergy.totalPerMonth,
    totalLifeEnergyHoursPerYear: lifeEnergy.totalPerYear,
    futureValue5Years,
    futureValue10Years,
    futureValue20Years,
  };
}

/**
 * Generate a unique ID for a commute scenario
 */
export function generateCommuteId(): string {
  return `commute-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================================================
// PRESET SCENARIOS FOR COMMON ICELANDIC COMMUTE ROUTES
// ============================================================================

/**
 * Current fuel/energy prices in Iceland (2024 estimates)
 */
const FUEL_PRICES = {
  gasoline: 200, // kr/liter
  diesel: 220, // kr/liter
  electric: 12, // kr/kWh (home charging)
};

/**
 * Typical fuel consumption rates
 */
const FUEL_CONSUMPTION = {
  gasoline: 8, // liters/100km
  diesel: 7, // liters/100km
  electric: 23, // kWh/100km
};

/**
 * Default car costs (Icelandic market averages)
 */
const DEFAULT_CAR_COSTS = {
  monthlyDepreciation: 35000,
  monthlyInsurance: 15000,
  monthlyMaintenance: 10000,
  inspectionCost: 12000,
};

/**
 * Strætó (public transit) prices
 */
const STRAETO_PRICES = {
  monthlyPass: 10500, // kr/month
  perRide: 550, // kr/ride
};

/**
 * Common Icelandic commute presets
 */
export const COMMUTE_PRESETS: CommutePreset[] = [
  // Car presets
  {
    id: 'car-kopavogur-reykjavik',
    category: 'car',
    label: 'Kópavogur ↔ Reykjavík (10 km)',
    description: 'Bensínbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 10,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 20,
      car: {
        fuelType: 'gasoline',
        fuelPrice: FUEL_PRICES.gasoline,
        fuelConsumption: FUEL_CONSUMPTION.gasoline,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },
  {
    id: 'car-hafnarfjordur-reykjavik',
    category: 'car',
    label: 'Hafnarfjörður ↔ Reykjavík (12 km)',
    description: 'Bensínbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 12,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 25,
      car: {
        fuelType: 'gasoline',
        fuelPrice: FUEL_PRICES.gasoline,
        fuelConsumption: FUEL_CONSUMPTION.gasoline,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },
  {
    id: 'car-gardabaer-reykjavik',
    category: 'car',
    label: 'Garðabær ↔ Reykjavík (8 km)',
    description: 'Rafbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 8,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 15,
      car: {
        fuelType: 'electric',
        fuelPrice: FUEL_PRICES.electric,
        fuelConsumption: FUEL_CONSUMPTION.electric,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },
  {
    id: 'car-mosfellsbaer-reykjavik',
    category: 'car',
    label: 'Mosfellsbær ↔ Reykjavík (15 km)',
    description: 'Bensínbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 15,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 25,
      car: {
        fuelType: 'gasoline',
        fuelPrice: FUEL_PRICES.gasoline,
        fuelConsumption: FUEL_CONSUMPTION.gasoline,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },
  {
    id: 'car-akranes-reykjavik',
    category: 'car',
    label: 'Akranes ↔ Reykjavík (50 km)',
    description: 'Bensínbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 50,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 45,
      car: {
        fuelType: 'gasoline',
        fuelPrice: FUEL_PRICES.gasoline,
        fuelConsumption: FUEL_CONSUMPTION.gasoline,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },
  {
    id: 'car-selfoss-reykjavik',
    category: 'car',
    label: 'Selfoss ↔ Reykjavík (60 km)',
    description: 'Dísilbíll, 5 dagar/viku',
    inputs: {
      distanceKm: 60,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 50,
      car: {
        fuelType: 'diesel',
        fuelPrice: FUEL_PRICES.diesel,
        fuelConsumption: FUEL_CONSUMPTION.diesel,
        parkingCostPerDay: 0,
        tollsPerDay: 0,
        ...DEFAULT_CAR_COSTS,
      },
    },
  },

  // Transit presets
  {
    id: 'transit-straeto-monthly',
    category: 'transit',
    label: 'Strætó - Mánaðarkort',
    description: 'Almenningssamgöngur með mánaðarkorti',
    inputs: {
      distanceKm: 10,
      daysPerWeek: 5,
      commuteMethod: 'transit',
      timeMinutesOneWay: 35,
      transit: {
        ticketType: 'monthly',
        monthlyCost: STRAETO_PRICES.monthlyPass,
      },
    },
  },
  {
    id: 'transit-straeto-per-ride',
    category: 'transit',
    label: 'Strætó - Stakir farmiðar',
    description: 'Almenningssamgöngur með stökum farmiðum',
    inputs: {
      distanceKm: 10,
      daysPerWeek: 5,
      commuteMethod: 'transit',
      timeMinutesOneWay: 35,
      transit: {
        ticketType: 'per_ride',
        costPerRide: STRAETO_PRICES.perRide,
      },
    },
  },

  // Active commute presets
  {
    id: 'bike-short',
    category: 'active',
    label: 'Hjólreiðar - stutt vegalengd (<5 km)',
    description: 'Hjólreiðar með vegalengd undir 5 km',
    inputs: {
      distanceKm: 4,
      daysPerWeek: 5,
      commuteMethod: 'bike',
      timeMinutesOneWay: 15,
      active: {
        monthlyMaintenanceCost: 2000,
      },
    },
  },
  {
    id: 'bike-medium',
    category: 'active',
    label: 'Hjólreiðar - miðlungs vegalengd (5-10 km)',
    description: 'Hjólreiðar með vegalengd 5-10 km',
    inputs: {
      distanceKm: 7,
      daysPerWeek: 5,
      commuteMethod: 'bike',
      timeMinutesOneWay: 25,
      active: {
        monthlyMaintenanceCost: 2000,
      },
    },
  },

  // Remote work preset
  {
    id: 'remote-100',
    category: 'remote',
    label: 'Fjarvinnu - 100%',
    description: 'Engar vinnuferðir - 100% fjarvinnu',
    inputs: {
      distanceKm: 0,
      daysPerWeek: 5,
      commuteMethod: 'remote',
      timeMinutesOneWay: 0,
    },
  },
];
