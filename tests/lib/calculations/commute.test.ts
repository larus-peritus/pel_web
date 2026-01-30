/**
 * Tests for commute calculation functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCommuteResults,
  generateCommuteId,
  COMMUTE_PRESETS,
} from '@/lib/calculations/commute';
import type { CommuteInputs } from '@/types/calculator';

describe('calculateCommuteResults', () => {
  const actualHourlyWage = 5000; // 5000 kr/hour

  describe('Remote work', () => {
    it('should return all zeros for remote work', () => {
      const inputs: CommuteInputs = {
        distanceKm: 0,
        daysPerWeek: 5,
        commuteMethod: 'remote',
        timeMinutesOneWay: 0,
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      expect(results.totalMonthlyCost).toBe(0);
      expect(results.totalYearlyCost).toBe(0);
      expect(results.timePerMonthHours).toBe(0);
      expect(results.lifeEnergyFromTime).toBe(0);
      expect(results.totalLifeEnergyHoursPerMonth).toBe(0);
      expect(results.futureValue10Years).toBe(0);
    });
  });

  describe('Car commute', () => {
    it('should calculate gasoline car costs correctly', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350, // kr/liter
          fuelConsumption: 8, // liters/100km
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // Trips: 5 days * 4.33 weeks * 2 (round trip) = 43.3 trips/month
      // Distance: 10 km * 43.3 = 433 km/month
      // Fuel: 433 km * 8 L/100km = 34.64 liters
      // Fuel cost: 34.64 * 350 = 12,124 kr/month
      expect(results.directMonthlyCost).toBeCloseTo(12124, 0);

      // Indirect: 35000 + 15000 + 10000 + 500 = 60,500 kr/month
      expect(results.indirectMonthlyCost).toBeCloseTo(60500, 0);

      // Total: 12124 + 60500 = 72,624 kr/month
      expect(results.totalMonthlyCost).toBeCloseTo(72624, 0);

      // Time: 20 min * 43.3 trips = 866 min/month = 14.43 hours/month
      expect(results.timePerMonthHours).toBeCloseTo(14.43, 1);

      // Life energy from time: 14.43 hours
      expect(results.lifeEnergyFromTime).toBeCloseTo(14.43, 1);

      // Life energy from money: 72624 / 5000 = 14.52 hours
      expect(results.lifeEnergyFromMoney).toBeCloseTo(14.52, 1);

      // Total life energy: 14.43 + 14.52 = 28.95 hours/month
      expect(results.totalLifeEnergyHoursPerMonth).toBeCloseTo(28.95, 1);
    });

    it('should calculate electric car costs correctly', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'electric',
          fuelPrice: 30, // kr/kWh
          fuelConsumption: 20, // kWh/100km
          parkingCostPerDay: 0,
          tollsPerDay: 0,
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // Distance: 10 km * 43.3 trips = 433 km/month
      // Electric: 433 km * 20 kWh/100km = 86.6 kWh
      // Electric cost: 86.6 * 30 = 2,598 kr/month
      expect(results.directMonthlyCost).toBeCloseTo(2598, 0);
    });

    it('should include parking and tolls in direct costs', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 20,
        car: {
          fuelType: 'gasoline',
          fuelPrice: 350,
          fuelConsumption: 8,
          parkingCostPerDay: 1000, // 1000 kr/day
          tollsPerDay: 500, // 500 kr/day
          monthlyDepreciation: 35000,
          monthlyInsurance: 15000,
          monthlyMaintenance: 10000,
          inspectionCost: 12000,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // Days: 5 * 4.33 = 21.65 days/month
      // Parking: 1000 * 21.65 = 21,650 kr/month
      // Tolls: 500 * 21.65 = 10,825 kr/month
      // Fuel: ~12,124 kr/month
      // Total direct: 12124 + 21650 + 10825 = 44,599 kr/month
      expect(results.directMonthlyCost).toBeCloseTo(44599, 0);
    });

    it('should create cost breakdown for car', () => {
      const inputs: CommuteInputs = {
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
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      expect(results.costBreakdown.length).toBeGreaterThan(0);
      expect(results.costBreakdown.some((item) => item.category === 'fuel')).toBe(
        true
      );
      expect(
        results.costBreakdown.some((item) => item.category === 'depreciation')
      ).toBe(true);

      // Percentages should sum to 100
      const totalPercentage = results.costBreakdown.reduce(
        (sum, item) => sum + item.percentage,
        0
      );
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });

  describe('Transit commute', () => {
    it('should calculate monthly pass cost correctly', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
        transit: {
          ticketType: 'monthly',
          monthlyCost: 10500,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      expect(results.directMonthlyCost).toBe(10500);
      expect(results.indirectMonthlyCost).toBe(0); // No indirect costs for transit
      expect(results.totalMonthlyCost).toBe(10500);
    });

    it('should calculate per-ride cost correctly', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'transit',
        timeMinutesOneWay: 35,
        transit: {
          ticketType: 'per_ride',
          costPerRide: 550,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // Rides: 5 days * 4.33 weeks * 2 (round trip) = 43.3 rides/month
      // Cost: 550 * 43.3 = 23,815 kr/month
      expect(results.directMonthlyCost).toBeCloseTo(23815, 0);
    });
  });

  describe('Active commute (bike/walk)', () => {
    it('should calculate bike maintenance costs', () => {
      const inputs: CommuteInputs = {
        distanceKm: 5,
        daysPerWeek: 5,
        commuteMethod: 'bike',
        timeMinutesOneWay: 20,
        active: {
          monthlyMaintenanceCost: 2000,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      expect(results.directMonthlyCost).toBe(2000);
      expect(results.indirectMonthlyCost).toBe(0);
      expect(results.totalMonthlyCost).toBe(2000);
    });

    it('should handle zero maintenance cost for walking', () => {
      const inputs: CommuteInputs = {
        distanceKm: 3,
        daysPerWeek: 5,
        commuteMethod: 'walk',
        timeMinutesOneWay: 30,
        active: {
          monthlyMaintenanceCost: 0,
        },
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      expect(results.directMonthlyCost).toBe(0);
      expect(results.totalMonthlyCost).toBe(0);
    });
  });

  describe('Time calculations', () => {
    it('should calculate time correctly', () => {
      const inputs: CommuteInputs = {
        distanceKm: 10,
        daysPerWeek: 5,
        commuteMethod: 'car',
        timeMinutesOneWay: 30,
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
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // Trips: 5 days * 4.33 weeks * 2 = 43.3 trips/month
      // Minutes: 30 * 43.3 = 1299 min/month
      expect(results.timePerMonthMinutes).toBeCloseTo(1299, 0);

      // Hours: 1299 / 60 = 21.65 hours/month
      expect(results.timePerMonthHours).toBeCloseTo(21.65, 1);

      // Year: 21.65 * 12 = 259.8 hours/year
      expect(results.timePerYearHours).toBeCloseTo(259.8, 1);

      // Days: 259.8 / 24 = 10.825 days/year
      expect(results.timePerYearDays).toBeCloseTo(10.825, 2);
    });
  });

  describe('Life energy calculations', () => {
    it('should handle zero actualHourlyWage gracefully', () => {
      const inputs: CommuteInputs = {
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
      };

      const results = calculateCommuteResults(inputs, 0);

      // Life energy from time should still be calculated
      expect(results.lifeEnergyFromTime).toBeGreaterThan(0);

      // Life energy from money should be 0 (division by zero protection)
      expect(results.lifeEnergyFromMoney).toBe(0);
    });
  });

  describe('Future value calculations', () => {
    it('should calculate FV for 5, 10, 20 years', () => {
      const inputs: CommuteInputs = {
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
      };

      const results = calculateCommuteResults(inputs, actualHourlyWage);

      // All future values should be positive
      expect(results.futureValue5Years).toBeGreaterThan(0);
      expect(results.futureValue10Years).toBeGreaterThan(0);
      expect(results.futureValue20Years).toBeGreaterThan(0);

      // Future values should increase over time
      expect(results.futureValue10Years).toBeGreaterThan(results.futureValue5Years);
      expect(results.futureValue20Years).toBeGreaterThan(
        results.futureValue10Years
      );
    });
  });
});

describe('generateCommuteId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateCommuteId();
    const id2 = generateCommuteId();

    expect(id1).toContain('commute-');
    expect(id2).toContain('commute-');
    expect(id1).not.toBe(id2);
  });
});

describe('COMMUTE_PRESETS', () => {
  it('should have at least 11 presets', () => {
    expect(COMMUTE_PRESETS.length).toBeGreaterThanOrEqual(11);
  });

  it('should have presets for all categories', () => {
    const categories = COMMUTE_PRESETS.map((p) => p.category);
    expect(categories).toContain('car');
    expect(categories).toContain('transit');
    expect(categories).toContain('active');
    expect(categories).toContain('remote');
  });

  it('should have valid input structures for all presets', () => {
    COMMUTE_PRESETS.forEach((preset) => {
      expect(preset.inputs.distanceKm).toBeGreaterThanOrEqual(0);
      expect(preset.inputs.daysPerWeek).toBeGreaterThanOrEqual(1);
      expect(preset.inputs.daysPerWeek).toBeLessThanOrEqual(7);
      expect(preset.inputs.timeMinutesOneWay).toBeGreaterThanOrEqual(0);
    });
  });

  it('car presets should have car details', () => {
    const carPresets = COMMUTE_PRESETS.filter((p) => p.category === 'car');
    carPresets.forEach((preset) => {
      expect(preset.inputs.car).toBeDefined();
      expect(preset.inputs.car?.fuelType).toBeDefined();
      expect(preset.inputs.car?.fuelPrice).toBeGreaterThan(0);
      expect(preset.inputs.car?.fuelConsumption).toBeGreaterThan(0);
    });
  });

  it('transit presets should have transit details', () => {
    const transitPresets = COMMUTE_PRESETS.filter((p) => p.category === 'transit');
    transitPresets.forEach((preset) => {
      expect(preset.inputs.transit).toBeDefined();
      expect(preset.inputs.transit?.ticketType).toBeDefined();
    });
  });

  it('remote preset should have zero distance and time', () => {
    const remotePreset = COMMUTE_PRESETS.find((p) => p.category === 'remote');
    expect(remotePreset).toBeDefined();
    expect(remotePreset?.inputs.distanceKm).toBe(0);
    expect(remotePreset?.inputs.timeMinutesOneWay).toBe(0);
  });
});
