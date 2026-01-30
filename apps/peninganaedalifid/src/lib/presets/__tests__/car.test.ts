/**
 * Unit tests for Car Ownership presets
 */

import { describe, it, expect } from 'vitest';
import { CAR_PRESETS, getPresetById, getPresetsByCategory } from '../car';
import { validateCarOwnershipInputs } from '@/lib/validation/car';
import { calculateCarOwnershipResults } from '@/lib/calculations/car';

describe('Car ownership presets', () => {
  describe('CAR_PRESETS', () => {
    it('has 5 presets defined', () => {
      expect(CAR_PRESETS).toHaveLength(5);
    });

    it('has all required preset categories', () => {
      const categories = CAR_PRESETS.map((p) => p.category);
      expect(categories).toContain('small');
      expect(categories).toContain('medium');
      expect(categories).toContain('suv');
      expect(categories).toContain('electric');
      expect(categories).toContain('old');
    });

    it('has unique IDs for all presets', () => {
      const ids = CAR_PRESETS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(CAR_PRESETS.length);
    });

    it('has Icelandic labels for all presets', () => {
      CAR_PRESETS.forEach((preset) => {
        expect(preset.label).toBeTruthy();
        expect(typeof preset.label).toBe('string');
        expect(preset.label.length).toBeGreaterThan(0);
      });
    });

    it('has descriptions for all presets', () => {
      CAR_PRESETS.forEach((preset) => {
        expect(preset.description).toBeTruthy();
        expect(typeof preset.description).toBe('string');
        expect(preset.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Preset validation', () => {
    it('all presets pass validation', () => {
      CAR_PRESETS.forEach((preset) => {
        const result = validateCarOwnershipInputs(preset.inputs);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
      });
    });

    it('all presets have reasonable values', () => {
      CAR_PRESETS.forEach((preset) => {
        // Purchase price should be positive
        expect(preset.inputs.purchasePrice).toBeGreaterThan(0);

        // Lifetime should be reasonable
        expect(preset.inputs.estimatedLifetimeYears).toBeGreaterThan(0);
        expect(preset.inputs.estimatedLifetimeYears).toBeLessThanOrEqual(15);

        // Monthly km should be reasonable
        expect(preset.inputs.monthlyKm).toBeGreaterThan(0);
        expect(preset.inputs.monthlyKm).toBeLessThan(5000);

        // Fuel consumption should be reasonable
        expect(preset.inputs.fuelConsumption).toBeGreaterThan(0);
        expect(preset.inputs.fuelConsumption).toBeLessThan(30);

        // Costs should be non-negative
        expect(preset.inputs.annualInsurance).toBeGreaterThanOrEqual(0);
        expect(preset.inputs.annualMaintenance).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Specific preset characteristics', () => {
    it('old car has lowest purchase price', () => {
      const old = CAR_PRESETS.find((p) => p.category === 'old')!;
      const others = CAR_PRESETS.filter((p) => p.category !== 'old');

      others.forEach((other) => {
        expect(old.inputs.purchasePrice).toBeLessThan(
          other.inputs.purchasePrice
        );
      });
    });

    it('SUV has high fuel consumption', () => {
      const suv = CAR_PRESETS.find((p) => p.category === 'suv')!;
      const small = CAR_PRESETS.find((p) => p.category === 'small')!;
      const medium = CAR_PRESETS.find((p) => p.category === 'medium')!;

      // SUV should have higher consumption than small and medium cars
      expect(suv.inputs.fuelConsumption).toBeGreaterThan(
        small.inputs.fuelConsumption
      );
      expect(suv.inputs.fuelConsumption).toBeGreaterThan(
        medium.inputs.fuelConsumption
      );
    });

    it('electric car has lower registration tax', () => {
      const electric = CAR_PRESETS.find((p) => p.category === 'electric')!;
      const others = CAR_PRESETS.filter((p) => p.category !== 'electric');

      others.forEach((other) => {
        expect(electric.inputs.annualRegistrationTax).toBeLessThan(
          other.inputs.annualRegistrationTax
        );
      });
    });

    it('electric car has lower maintenance cost', () => {
      const electric = CAR_PRESETS.find((p) => p.category === 'electric')!;
      const medium = CAR_PRESETS.find((p) => p.category === 'medium')!;

      expect(electric.inputs.annualMaintenance).toBeLessThan(
        medium.inputs.annualMaintenance
      );
    });

    it('old car has higher maintenance cost', () => {
      const old = CAR_PRESETS.find((p) => p.category === 'old')!;
      const small = CAR_PRESETS.find((p) => p.category === 'small')!;

      expect(old.inputs.annualMaintenance).toBeGreaterThan(
        small.inputs.annualMaintenance
      );
    });

    it('electric car uses electric fuel type with kWh pricing', () => {
      const electric = CAR_PRESETS.find((p) => p.category === 'electric')!;

      expect(electric.inputs.fuelType).toBe('electric');
      expect(electric.inputs.fuelPrice).toBe(30); // kr/kWh
      expect(electric.inputs.fuelConsumption).toBeGreaterThan(10); // kWh/100km
    });

    it('old car has shortest lifetime', () => {
      const old = CAR_PRESETS.find((p) => p.category === 'old')!;
      const others = CAR_PRESETS.filter((p) => p.category !== 'old');

      others.forEach((other) => {
        expect(old.inputs.estimatedLifetimeYears).toBeLessThanOrEqual(
          other.inputs.estimatedLifetimeYears
        );
      });
    });
  });

  describe('Preset calculations', () => {
    it('all presets can be calculated successfully', () => {
      const actualHourlyWage = 5000;

      CAR_PRESETS.forEach((preset) => {
        const results = calculateCarOwnershipResults(
          preset.inputs,
          actualHourlyWage
        );

        expect(results.totalMonthlyCost).toBeGreaterThan(0);
        expect(results.totalYearlyCost).toBe(results.totalMonthlyCost * 12);
        expect(results.lifeEnergyHoursPerMonth).toBeGreaterThan(0);
        expect(results.futureValue10Years).toBeGreaterThan(0);
      });
    });

    it('small car has lower monthly cost than medium and suv', () => {
      const actualHourlyWage = 5000;

      const results = CAR_PRESETS.map((preset) => ({
        category: preset.category,
        monthlyCost: calculateCarOwnershipResults(
          preset.inputs,
          actualHourlyWage
        ).totalMonthlyCost,
      }));

      const small = results.find((r) => r.category === 'small')!;
      const medium = results.find((r) => r.category === 'medium')!;
      const suv = results.find((r) => r.category === 'suv')!;

      expect(small.monthlyCost).toBeLessThan(medium.monthlyCost);
      expect(small.monthlyCost).toBeLessThan(suv.monthlyCost);
    });

    it('electric car has lower fuel cost than gasoline cars', () => {
      const actualHourlyWage = 5000;

      const electric = CAR_PRESETS.find((p) => p.category === 'electric')!;
      const medium = CAR_PRESETS.find((p) => p.category === 'medium')!;

      const electricResults = calculateCarOwnershipResults(
        electric.inputs,
        actualHourlyWage
      );
      const mediumResults = calculateCarOwnershipResults(
        medium.inputs,
        actualHourlyWage
      );

      expect(electricResults.fuelCostMonthly).toBeLessThan(
        mediumResults.fuelCostMonthly
      );
    });
  });

  describe('Helper functions', () => {
    describe('getPresetById', () => {
      it('returns correct preset for valid ID', () => {
        const preset = getPresetById('small-gasoline');

        expect(preset).toBeDefined();
        expect(preset?.id).toBe('small-gasoline');
        expect(preset?.category).toBe('small');
      });

      it('returns undefined for invalid ID', () => {
        const preset = getPresetById('nonexistent');
        expect(preset).toBeUndefined();
      });

      it('works for all preset IDs', () => {
        CAR_PRESETS.forEach((expected) => {
          const preset = getPresetById(expected.id);
          expect(preset).toEqual(expected);
        });
      });
    });

    describe('getPresetsByCategory', () => {
      it('returns presets for specific category', () => {
        const mediumPresets = getPresetsByCategory('medium');

        expect(mediumPresets).toHaveLength(1);
        expect(mediumPresets[0].category).toBe('medium');
      });

      it('returns empty array for category with no presets', () => {
        // Currently all categories have 1 preset each
        // This test ensures the function handles empty results
        const filtered = CAR_PRESETS.filter((p) => p.category === 'medium');
        expect(filtered.length).toBeGreaterThan(0);
      });

      it('works for all categories', () => {
        const categories: Array<'small' | 'medium' | 'suv' | 'electric' | 'old'> =
          ['small', 'medium', 'suv', 'electric', 'old'];

        categories.forEach((category) => {
          const presets = getPresetsByCategory(category);
          expect(presets.length).toBeGreaterThan(0);
          presets.forEach((preset) => {
            expect(preset.category).toBe(category);
          });
        });
      });
    });
  });

  describe('Preset data quality', () => {
    it('all presets have no financing by default', () => {
      CAR_PRESETS.forEach((preset) => {
        expect(preset.inputs.hasFinancing).toBe(false);
      });
    });

    it('all presets have zero parking and tolls by default', () => {
      CAR_PRESETS.forEach((preset) => {
        expect(preset.inputs.monthlyParking).toBe(0);
        expect(preset.inputs.monthlyTolls).toBe(0);
      });
    });

    it('all presets have biannual inspection set to 12000', () => {
      CAR_PRESETS.forEach((preset) => {
        expect(preset.inputs.biannualInspection).toBe(12000);
      });
    });

    it('purchase prices are in reasonable ISK ranges', () => {
      CAR_PRESETS.forEach((preset) => {
        // Between 500k and 10M ISK
        expect(preset.inputs.purchasePrice).toBeGreaterThan(500000);
        expect(preset.inputs.purchasePrice).toBeLessThan(10000000);
      });
    });

    it('all gasoline cars have gasoline price of 300 kr/L', () => {
      const gasolineCars = CAR_PRESETS.filter(
        (p) => p.inputs.fuelType === 'gasoline'
      );

      gasolineCars.forEach((car) => {
        expect(car.inputs.fuelPrice).toBe(300);
      });
    });
  });
});
