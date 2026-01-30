/**
 * Tests for commute validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  validateCommuteInputs,
  validateScenarioName,
  type CommuteValidationResult,
} from '@/lib/validation/commute';
import type { CommuteInputs } from '@/types/calculator';

describe('validateCommuteInputs', () => {
  describe('Basic field validation', () => {
    it('validates distance correctly', () => {
      // Missing distance
      let result = validateCommuteInputs({ daysPerWeek: 5, commuteMethod: 'car', timeMinutesOneWay: 20 } as Partial<CommuteInputs>);
      expect(result.isValid).toBe(false);
      expect(result.errors.distanceKm).toBe('Fjarlægð er nauðsynleg');

      // Negative distance
      result = validateCommuteInputs({ distanceKm: -10, daysPerWeek: 5, commuteMethod: 'car', timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.distanceKm).toBe('Fjarlægð getur ekki verið neikvæð');

      // Too high distance
      result = validateCommuteInputs({ distanceKm: 201, daysPerWeek: 5, commuteMethod: 'car', timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.distanceKm).toBe('Fjarlægð verður að vera 200 km eða minna');

      // Valid distance
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'remote', timeMinutesOneWay: 0 });
      expect(result.errors.distanceKm).toBeUndefined();
    });

    it('validates days per week correctly', () => {
      // Missing days
      let result = validateCommuteInputs({ distanceKm: 10, commuteMethod: 'car', timeMinutesOneWay: 20 } as Partial<CommuteInputs>);
      expect(result.isValid).toBe(false);
      expect(result.errors.daysPerWeek).toBe('Dagar á viku eru nauðsynlegir');

      // Too few days
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 0, commuteMethod: 'car', timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.daysPerWeek).toBe('Dagar á viku verða að vera að minnsta kosti 1');

      // Too many days
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 8, commuteMethod: 'car', timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.daysPerWeek).toBe('Dagar á viku geta ekki verið fleiri en 7');

      // Not an integer
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5.5, commuteMethod: 'car', timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.daysPerWeek).toBe('Dagar á viku verða að vera heiltala');

      // Valid days
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'remote', timeMinutesOneWay: 0 });
      expect(result.errors.daysPerWeek).toBeUndefined();
    });

    it('validates time correctly', () => {
      // Missing time
      let result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'car' } as Partial<CommuteInputs>);
      expect(result.isValid).toBe(false);
      expect(result.errors.timeMinutesOneWay).toBe('Ferðatími er nauðsynlegur');

      // Negative time
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'car', timeMinutesOneWay: -5 });
      expect(result.isValid).toBe(false);
      expect(result.errors.timeMinutesOneWay).toBe('Ferðatími getur ekki verið neikvæður');

      // Too high time
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'car', timeMinutesOneWay: 301 });
      expect(result.isValid).toBe(false);
      expect(result.errors.timeMinutesOneWay).toBe('Ferðatími verður að vera 300 mínútur eða minna');

      // Valid time
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'remote', timeMinutesOneWay: 30 });
      expect(result.errors.timeMinutesOneWay).toBeUndefined();
    });

    it('validates commute method correctly', () => {
      // Missing method
      let result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, timeMinutesOneWay: 20 } as Partial<CommuteInputs>);
      expect(result.isValid).toBe(false);
      expect(result.errors.commuteMethod).toBe('Ferðamáti er nauðsynlegur');

      // Invalid method
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'invalid' as any, timeMinutesOneWay: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors.commuteMethod).toBe('Ógildur ferðamáti');

      // Valid method
      result = validateCommuteInputs({ distanceKm: 10, daysPerWeek: 5, commuteMethod: 'remote', timeMinutesOneWay: 0 });
      expect(result.errors.commuteMethod).toBeUndefined();
    });
  });

  describe('Car-specific validation', () => {
    it('requires car object for car commute', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.car).toBe('Bílaupplýsingar eru nauðsynlegar fyrir bílferðir');
    });

    it('validates fuel price range', () => {
      // Missing fuel price
      let result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelConsumption: 8,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        } as any,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.fuelPrice']).toBe('Eldsneytisverð er nauðsynlegt');

      // Zero fuel price
      result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 0,
          fuelConsumption: 8,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.fuelPrice']).toBe('Eldsneytisverð verður að vera hærra en 0');

      // Too high fuel price
      result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 1000,
          fuelConsumption: 8,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.fuelPrice']).toBe('Eldsneytisverð virðist óvenjulega hátt (hámark 1000 kr)');
    });

    it('validates fuel consumption range', () => {
      // Zero consumption
      let result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350,
          fuelConsumption: 0,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.fuelConsumption']).toBe('Eyðsla verður að vera hærri en 0');

      // Too high consumption
      result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350,
          fuelConsumption: 50,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.fuelConsumption']).toBe('Eyðsla virðist óvenjulega há (hámark 50)');
    });

    it('validates all car costs are non-negative', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350,
          fuelConsumption: 8,
          parkingCostPerDay: -100,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['car.parkingCostPerDay']).toBe('Stæðakostnaður getur ekki verið neikvæður');
    });

    it('accepts valid car inputs', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350,
          fuelConsumption: 8,
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });

  describe('Transit-specific validation', () => {
    it('requires transit object for transit commute', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.transit).toBe('Upplýsingar um almenningssamgöngur eru nauðsynlegar');
    });

    it('validates monthly ticket requires monthlyCost', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
        transit: {
          ticketType: 'monthly',
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['transit.monthlyCost']).toBe('Mánaðarkostnaður er nauðsynlegur fyrir mánaðarkort');
    });

    it('validates per-ride ticket requires costPerRide', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
        transit: {
          ticketType: 'per_ride',
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['transit.costPerRide']).toBe('Kostnaður á hvern farmiða er nauðsynlegur');
    });

    it('accepts valid transit inputs', () => {
      const result = validateCommuteInputs({
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
        transit: {
          ticketType: 'monthly',
          monthlyCost: 10500,
        },
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });

  describe('Active commute validation', () => {
    it('requires active object for bike commute', () => {
      const result = validateCommuteInputs({
        distanceKm: 5,
        daysPerWeek: 5,
        commuteMethod: 'bike',
        timeMinutesOneWay: 15,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.active).toBe('Viðhaldsupplýsingar eru nauðsynlegar');
    });

    it('validates maintenance cost is non-negative', () => {
      const result = validateCommuteInputs({
        distanceKm: 5,
        daysPerWeek: 5,
        commuteMethod: 'bike',
        timeMinutesOneWay: 15,
        active: {
          monthlyMaintenanceCost: -100,
        },
      });
      expect(result.isValid).toBe(false);
      expect(result.errors['active.monthlyMaintenanceCost']).toBe('Viðhald getur ekki verið neikvætt');
    });

    it('accepts valid active commute inputs', () => {
      const result = validateCommuteInputs({
        distanceKm: 5,
        daysPerWeek: 5,
        commuteMethod: 'bike',
        timeMinutesOneWay: 15,
        active: {
          monthlyMaintenanceCost: 2000,
        },
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });

  describe('Remote commute validation', () => {
    it('accepts valid remote inputs with no extra fields', () => {
      const result = validateCommuteInputs({
        distanceKm: 0,
        daysPerWeek: 5,
        commuteMethod: 'remote',
        timeMinutesOneWay: 0,
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });
});

describe('validateScenarioName', () => {
  it('rejects empty name', () => {
    const result = validateScenarioName('');
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Heiti má ekki vera tómt');
  });

  it('rejects whitespace-only name', () => {
    const result = validateScenarioName('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Heiti má ekki vera tómt');
  });

  it('rejects name longer than 50 characters', () => {
    const longName = 'a'.repeat(51);
    const result = validateScenarioName(longName);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Heiti má ekki vera lengra en 50 stafir');
  });

  it('accepts valid name', () => {
    const result = validateScenarioName('Núverandi vinnuferð');
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('accepts name with exactly 50 characters', () => {
    const name = 'a'.repeat(50);
    const result = validateScenarioName(name);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});
