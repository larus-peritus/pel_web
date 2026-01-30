/**
 * Car ownership presets for common Icelandic car scenarios
 * Realistic values based on typical Icelandic car ownership costs
 */

import type { CarPreset } from '@/types/car-ownership';

/**
 * Pre-configured car ownership presets for common scenarios
 * All prices in ISK, typical Icelandic values
 */
export const CAR_PRESETS: CarPreset[] = [
  {
    id: 'small-gasoline',
    category: 'small',
    label: 'Lítill bensínbíll (t.d. Toyota Yaris)',
    description: 'Sparneytin lítill bíll, lágur rekstrarkostnaður',
    inputs: {
      purchasePrice: 2500000,
      estimatedLifetimeYears: 12,
      hasFinancing: false,
      monthlyKm: 1200,
      fuelType: 'gasoline',
      fuelConsumption: 6.5,
      fuelPrice: 300,
      annualInsurance: 130000,
      annualRegistrationTax: 40000,
      biannualInspection: 12000,
      annualMaintenance: 100000,
      tiresEveryNYears: 4,
      tiresCost: 50000,
      monthlyParking: 0,
      monthlyTolls: 0,
      kilometerTaxPerKm: 0,
    },
  },
  {
    id: 'medium-gasoline',
    category: 'medium',
    label: 'Meðalstór bensínbíll (t.d. Toyota Corolla)',
    description: 'Fjölskyldubíll, góður allt í einu',
    inputs: {
      purchasePrice: 4000000,
      estimatedLifetimeYears: 12,
      hasFinancing: false,
      monthlyKm: 1500,
      fuelType: 'gasoline',
      fuelConsumption: 7.5,
      fuelPrice: 300,
      annualInsurance: 150000,
      annualRegistrationTax: 50000,
      biannualInspection: 12000,
      annualMaintenance: 150000,
      tiresEveryNYears: 4,
      tiresCost: 60000,
      monthlyParking: 0,
      monthlyTolls: 0,
      kilometerTaxPerKm: 0,
    },
  },
  {
    id: 'suv',
    category: 'suv',
    label: 'Stór jeppi (t.d. Toyota RAV4)',
    description: 'Fjórhjóladrifinn, hár rekstrarkostnaður',
    inputs: {
      purchasePrice: 7000000,
      estimatedLifetimeYears: 12,
      hasFinancing: false,
      monthlyKm: 1800,
      fuelType: 'gasoline',
      fuelConsumption: 9,
      fuelPrice: 300,
      annualInsurance: 200000,
      annualRegistrationTax: 80000,
      biannualInspection: 12000,
      annualMaintenance: 200000,
      tiresEveryNYears: 3,
      tiresCost: 80000,
      monthlyParking: 0,
      monthlyTolls: 0,
      kilometerTaxPerKm: 0,
    },
  },
  {
    id: 'electric',
    category: 'electric',
    label: 'Rafbíll (t.d. Tesla Model 3 / Nissan Leaf)',
    description: 'Umhverfisvænn, lágur rekstrarkostnaður',
    inputs: {
      purchasePrice: 5000000,
      estimatedLifetimeYears: 10,
      hasFinancing: false,
      monthlyKm: 1500,
      fuelType: 'electric',
      fuelConsumption: 18, // kWh/100km
      fuelPrice: 30, // kr/kWh
      annualInsurance: 120000,
      annualRegistrationTax: 6600, // Lower due to emissions
      biannualInspection: 12000,
      annualMaintenance: 80000, // Less maintenance needed
      tiresEveryNYears: 4,
      tiresCost: 70000,
      monthlyParking: 0,
      monthlyTolls: 0,
      kilometerTaxPerKm: 0,
    },
  },
  {
    id: 'old',
    category: 'old',
    label: 'Gamall bíll (> 15 ára)',
    description: 'Lítill kaupkostnaður, hár viðhaldskostnaður',
    inputs: {
      purchasePrice: 800000,
      estimatedLifetimeYears: 5,
      hasFinancing: false,
      monthlyKm: 1000,
      fuelType: 'gasoline',
      fuelConsumption: 10,
      fuelPrice: 300,
      annualInsurance: 100000,
      annualRegistrationTax: 40000,
      biannualInspection: 12000,
      annualMaintenance: 200000, // Higher maintenance for older cars
      tiresEveryNYears: 4,
      tiresCost: 50000,
      monthlyParking: 0,
      monthlyTolls: 0,
      kilometerTaxPerKm: 0,
    },
  },
];

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): CarPreset | undefined {
  return CAR_PRESETS.find((preset) => preset.id === id);
}

/**
 * Get all presets for a specific category
 */
export function getPresetsByCategory(
  category: 'small' | 'medium' | 'suv' | 'electric' | 'old'
): CarPreset[] {
  return CAR_PRESETS.filter((preset) => preset.category === category);
}
