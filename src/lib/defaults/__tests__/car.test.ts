/**
 * Unit tests for Car Ownership default values
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CAR_INPUTS,
  DEFAULT_FUEL_PRICES,
  TYPICAL_FUEL_CONSUMPTION,
  TYPICAL_ANNUAL_COSTS,
  DEFAULT_BIANNUAL_INSPECTION,
  DEFAULT_TIRE_INTERVAL,
  getDefaultFuelPrice,
  getTypicalFuelConsumption,
  getTypicalAnnualCosts,
  FUEL_TYPE_LABELS,
  CAR_CATEGORY_LABELS,
} from '../car';
import { validateCarOwnershipInputs } from '@/lib/validation/car';

describe('Car ownership defaults', () => {
  describe('DEFAULT_CAR_INPUTS', () => {
    it('provides valid default inputs', () => {
      const result = validateCarOwnershipInputs(DEFAULT_CAR_INPUTS);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('has reasonable Icelandic values', () => {
      expect(DEFAULT_CAR_INPUTS.fuelPrice).toBe(300); // Bensín ~300 kr/L
      expect(DEFAULT_CAR_INPUTS.fuelConsumption).toBe(7.5); // Typical car
      expect(DEFAULT_CAR_INPUTS.annualInsurance).toBeGreaterThan(0);
      expect(DEFAULT_CAR_INPUTS.annualRegistrationTax).toBeGreaterThan(0);
      expect(DEFAULT_CAR_INPUTS.monthlyKm).toBe(1500); // Reasonable monthly km
    });

    it('has hasFinancing set to false by default', () => {
      expect(DEFAULT_CAR_INPUTS.hasFinancing).toBe(false);
    });

    it('has zero parking and tolls by default', () => {
      expect(DEFAULT_CAR_INPUTS.monthlyParking).toBe(0);
      expect(DEFAULT_CAR_INPUTS.monthlyTolls).toBe(0);
    });
  });

  describe('FUEL_TYPE_LABELS', () => {
    it('has Icelandic labels for all fuel types', () => {
      expect(FUEL_TYPE_LABELS.gasoline).toBe('Bensín');
      expect(FUEL_TYPE_LABELS.diesel).toBe('Dísel');
      expect(FUEL_TYPE_LABELS.electric).toBe('Rafmagn');
      expect(FUEL_TYPE_LABELS.hybrid).toBe('Tvinnbíll');
    });

    it('has labels for all possible fuel types', () => {
      const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid'];
      fuelTypes.forEach((type) => {
        expect(FUEL_TYPE_LABELS[type]).toBeDefined();
        expect(typeof FUEL_TYPE_LABELS[type]).toBe('string');
      });
    });
  });

  describe('CAR_CATEGORY_LABELS', () => {
    it('has Icelandic labels for all car categories', () => {
      expect(CAR_CATEGORY_LABELS.small).toBe('Lítill bíll');
      expect(CAR_CATEGORY_LABELS.medium).toBe('Meðalstór bíll');
      expect(CAR_CATEGORY_LABELS.suv).toBe('Jeppi');
      expect(CAR_CATEGORY_LABELS.electric).toBe('Rafbíll');
      expect(CAR_CATEGORY_LABELS.old).toBe('Gamall bíll');
    });
  });

  describe('DEFAULT_FUEL_PRICES', () => {
    it('has realistic Icelandic fuel prices', () => {
      expect(DEFAULT_FUEL_PRICES.gasoline).toBe(300); // ~300 kr/L
      expect(DEFAULT_FUEL_PRICES.diesel).toBe(290); // ~290 kr/L
      expect(DEFAULT_FUEL_PRICES.electric).toBe(30); // ~30 kr/kWh
      expect(DEFAULT_FUEL_PRICES.hybrid).toBe(300); // Uses gasoline
    });

    it('has positive prices for all fuel types', () => {
      expect(DEFAULT_FUEL_PRICES.gasoline).toBeGreaterThan(0);
      expect(DEFAULT_FUEL_PRICES.diesel).toBeGreaterThan(0);
      expect(DEFAULT_FUEL_PRICES.electric).toBeGreaterThan(0);
      expect(DEFAULT_FUEL_PRICES.hybrid).toBeGreaterThan(0);
    });
  });

  describe('TYPICAL_FUEL_CONSUMPTION', () => {
    it('has consumption ranges for all fuel types', () => {
      expect(TYPICAL_FUEL_CONSUMPTION.gasoline).toBeDefined();
      expect(TYPICAL_FUEL_CONSUMPTION.diesel).toBeDefined();
      expect(TYPICAL_FUEL_CONSUMPTION.electric).toBeDefined();
      expect(TYPICAL_FUEL_CONSUMPTION.hybrid).toBeDefined();
    });

    it('has min < typical < max for all fuel types', () => {
      Object.values(TYPICAL_FUEL_CONSUMPTION).forEach((range) => {
        expect(range.min).toBeLessThan(range.typical);
        expect(range.typical).toBeLessThan(range.max);
      });
    });

    it('has realistic consumption values', () => {
      expect(TYPICAL_FUEL_CONSUMPTION.gasoline.typical).toBe(7.5);
      expect(TYPICAL_FUEL_CONSUMPTION.diesel.typical).toBe(6.5);
      expect(TYPICAL_FUEL_CONSUMPTION.electric.typical).toBe(18);
      expect(TYPICAL_FUEL_CONSUMPTION.hybrid.typical).toBe(5.5);
    });
  });

  describe('TYPICAL_ANNUAL_COSTS', () => {
    it('has costs for all car categories', () => {
      expect(TYPICAL_ANNUAL_COSTS.small).toBeDefined();
      expect(TYPICAL_ANNUAL_COSTS.medium).toBeDefined();
      expect(TYPICAL_ANNUAL_COSTS.suv).toBeDefined();
      expect(TYPICAL_ANNUAL_COSTS.electric).toBeDefined();
      expect(TYPICAL_ANNUAL_COSTS.old).toBeDefined();
    });

    it('has all cost types for each category', () => {
      Object.values(TYPICAL_ANNUAL_COSTS).forEach((costs) => {
        expect(costs.insurance).toBeGreaterThan(0);
        expect(costs.registrationTax).toBeGreaterThan(0);
        expect(costs.maintenance).toBeGreaterThan(0);
        expect(costs.tiresCost).toBeGreaterThan(0);
      });
    });

    it('has higher costs for SUV than small car', () => {
      expect(TYPICAL_ANNUAL_COSTS.suv.insurance).toBeGreaterThan(
        TYPICAL_ANNUAL_COSTS.small.insurance
      );
      expect(TYPICAL_ANNUAL_COSTS.suv.maintenance).toBeGreaterThan(
        TYPICAL_ANNUAL_COSTS.small.maintenance
      );
    });

    it('has lower registration tax for electric cars', () => {
      expect(TYPICAL_ANNUAL_COSTS.electric.registrationTax).toBeLessThan(
        TYPICAL_ANNUAL_COSTS.medium.registrationTax
      );
    });

    it('has higher maintenance for old cars', () => {
      expect(TYPICAL_ANNUAL_COSTS.old.maintenance).toBeGreaterThanOrEqual(
        TYPICAL_ANNUAL_COSTS.medium.maintenance
      );
    });
  });

  describe('Helper functions', () => {
    describe('getDefaultFuelPrice', () => {
      it('returns correct price for each fuel type', () => {
        expect(getDefaultFuelPrice('gasoline')).toBe(300);
        expect(getDefaultFuelPrice('diesel')).toBe(290);
        expect(getDefaultFuelPrice('electric')).toBe(30);
        expect(getDefaultFuelPrice('hybrid')).toBe(300);
      });
    });

    describe('getTypicalFuelConsumption', () => {
      it('returns typical consumption for each fuel type', () => {
        expect(getTypicalFuelConsumption('gasoline')).toBe(7.5);
        expect(getTypicalFuelConsumption('diesel')).toBe(6.5);
        expect(getTypicalFuelConsumption('electric')).toBe(18);
        expect(getTypicalFuelConsumption('hybrid')).toBe(5.5);
      });
    });

    describe('getTypicalAnnualCosts', () => {
      it('returns costs object for each category', () => {
        const smallCosts = getTypicalAnnualCosts('small');
        expect(smallCosts).toBeDefined();
        expect(smallCosts.insurance).toBe(130000);
        expect(smallCosts.registrationTax).toBe(40000);
        expect(smallCosts.maintenance).toBe(100000);
        expect(smallCosts.tiresCost).toBe(50000);
      });

      it('returns different costs for different categories', () => {
        const smallCosts = getTypicalAnnualCosts('small');
        const suvCosts = getTypicalAnnualCosts('suv');
        expect(suvCosts.insurance).toBeGreaterThan(smallCosts.insurance);
      });
    });
  });

  describe('Constants', () => {
    it('DEFAULT_BIANNUAL_INSPECTION has reasonable value', () => {
      expect(DEFAULT_BIANNUAL_INSPECTION).toBe(12000);
      expect(DEFAULT_BIANNUAL_INSPECTION).toBeGreaterThan(0);
    });

    it('DEFAULT_TIRE_INTERVAL has reasonable value', () => {
      expect(DEFAULT_TIRE_INTERVAL).toBe(4);
      expect(DEFAULT_TIRE_INTERVAL).toBeGreaterThan(0);
    });
  });
});
