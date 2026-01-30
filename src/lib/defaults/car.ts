/**
 * Default values and constants for Car Ownership Cost Calculator
 * Icelandic context with realistic default values
 */

import type { CarOwnershipInputs } from '@/types/car-ownership';
import {
  FUEL_TYPE_LABELS,
  CAR_CATEGORY_LABELS,
} from '@/types/car-ownership';

/**
 * Default car ownership inputs
 * These represent typical values for an average car in Iceland
 */
export const DEFAULT_CAR_INPUTS: CarOwnershipInputs = {
  purchasePrice: 3000000, // Default purchase price (3M ISK - typical medium car)
  estimatedLifetimeYears: 10,
  hasFinancing: false,
  monthlyKm: 1500,
  fuelType: 'gasoline',
  fuelConsumption: 7.5,
  fuelPrice: 300, // kr/L for gasoline
  annualInsurance: 150000, // ISK
  annualRegistrationTax: 50000, // ISK
  biannualInspection: 12000, // ISK
  annualMaintenance: 150000, // ISK
  tiresEveryNYears: 4,
  tiresCost: 60000, // ISK
  monthlyParking: 0,
  monthlyTolls: 0,
  kilometerTaxPerKm: 0, // Kílómetragjald (new Icelandic per-km road tax), default 0
};

/**
 * Icelandic fuel type labels
 * Re-exported from types for convenience
 */
export { FUEL_TYPE_LABELS };

/**
 * Icelandic car category labels
 * Re-exported from types for convenience
 */
export { CAR_CATEGORY_LABELS };

/**
 * Default fuel prices in ISK
 * Updated based on typical Icelandic fuel prices (2024)
 */
export const DEFAULT_FUEL_PRICES = {
  gasoline: 300, // kr/L
  diesel: 290, // kr/L
  electric: 30, // kr/kWh
  hybrid: 300, // kr/L (uses gasoline price for simplicity)
} as const;

/**
 * Typical fuel consumption ranges by fuel type
 */
export const TYPICAL_FUEL_CONSUMPTION = {
  gasoline: {
    min: 5,
    typical: 7.5,
    max: 12,
  },
  diesel: {
    min: 5,
    typical: 6.5,
    max: 10,
  },
  electric: {
    min: 14,
    typical: 18,
    max: 25,
  },
  hybrid: {
    min: 4,
    typical: 5.5,
    max: 8,
  },
} as const;

/**
 * Typical annual costs by car type (ISK)
 */
export const TYPICAL_ANNUAL_COSTS = {
  small: {
    insurance: 130000,
    registrationTax: 40000,
    maintenance: 100000,
    tiresCost: 50000,
  },
  medium: {
    insurance: 150000,
    registrationTax: 50000,
    maintenance: 150000,
    tiresCost: 60000,
  },
  suv: {
    insurance: 200000,
    registrationTax: 80000,
    maintenance: 200000,
    tiresCost: 80000,
  },
  electric: {
    insurance: 120000,
    registrationTax: 6600, // Lower due to emissions
    maintenance: 80000, // Less maintenance needed
    tiresCost: 70000,
  },
  old: {
    insurance: 100000,
    registrationTax: 40000,
    maintenance: 200000, // Higher maintenance for older cars
    tiresCost: 50000,
  },
} as const;

/**
 * Default biannual inspection cost (ISK)
 * Typical cost for mandatory vehicle inspection every 2 years
 */
export const DEFAULT_BIANNUAL_INSPECTION = 12000; // ISK

/**
 * Typical tire replacement interval (years)
 */
export const DEFAULT_TIRE_INTERVAL = 4; // years

/**
 * Helper function to get default fuel price for a fuel type
 */
export function getDefaultFuelPrice(
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
): number {
  return DEFAULT_FUEL_PRICES[fuelType];
}

/**
 * Helper function to get typical fuel consumption for a fuel type
 */
export function getTypicalFuelConsumption(
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
): number {
  return TYPICAL_FUEL_CONSUMPTION[fuelType].typical;
}

/**
 * Helper function to get typical annual costs for a car category
 */
export function getTypicalAnnualCosts(
  category: 'small' | 'medium' | 'suv' | 'electric' | 'old'
) {
  return TYPICAL_ANNUAL_COSTS[category];
}
