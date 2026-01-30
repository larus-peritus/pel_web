/**
 * Unit tests for Car Ownership calculation functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFuelCost,
  calculateDirectMonthlyCost,
  calculateLoanPayment,
  calculateTotalInterest,
  calculateDepreciation,
  calculateIndirectMonthlyCost,
  calculateLifeEnergy,
  calculateCarFutureValue,
  generateCostBreakdown,
  calculateCarOwnershipResults,
} from '../car';
import type { CarOwnershipInputs } from '@/types/car-ownership';

describe('Car ownership calculations', () => {
  // Helper to create valid base inputs
  const createValidInputs = (): CarOwnershipInputs => ({
    purchasePrice: 3000000,
    estimatedLifetimeYears: 10,
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
  });

  describe('calculateFuelCost', () => {
    it('calculates fuel cost correctly for gasoline car', () => {
      // 1500 km/month, 7.5 L/100km, 300 kr/L
      // = (1500 * 7.5 / 100) * 300 = 112.5 * 300 = 33,750 kr
      const result = calculateFuelCost(1500, 7.5, 300);
      expect(result).toBeCloseTo(33750, 0);
    });

    it('calculates fuel cost correctly for electric car', () => {
      // 1500 km/month, 18 kWh/100km, 30 kr/kWh
      // = (1500 * 18 / 100) * 30 = 270 * 30 = 8,100 kr
      const result = calculateFuelCost(1500, 18, 30);
      expect(result).toBeCloseTo(8100, 0);
    });

    it('returns 0 for 0 km', () => {
      const result = calculateFuelCost(0, 7.5, 300);
      expect(result).toBe(0);
    });

    it('handles very high consumption', () => {
      const result = calculateFuelCost(1500, 15, 300);
      expect(result).toBeCloseTo(67500, 0);
    });
  });

  describe('calculateDirectMonthlyCost', () => {
    it('aggregates direct costs correctly', () => {
      const inputs = {
        ...createValidInputs(),
        monthlyKm: 1500,
        fuelConsumption: 7.5,
        fuelPrice: 300,
        monthlyParking: 20000,
        monthlyTolls: 5000,
      };

      const result = calculateDirectMonthlyCost(inputs);

      expect(result.fuelCostMonthly).toBeCloseTo(33750, 0);
      expect(result.parkingCostMonthly).toBe(20000);
      expect(result.tollsCostMonthly).toBe(5000);
      expect(result.directMonthlyCost).toBeCloseTo(58750, 0);
    });

    it('handles zero parking and tolls', () => {
      const inputs = createValidInputs();
      const result = calculateDirectMonthlyCost(inputs);

      expect(result.parkingCostMonthly).toBe(0);
      expect(result.tollsCostMonthly).toBe(0);
      expect(result.directMonthlyCost).toBeCloseTo(33750, 0);
    });
  });

  describe('calculateLoanPayment', () => {
    it('calculates monthly payment correctly', () => {
      // 3M kr loan, 5 years, 7% interest
      // Expected: ~59,404 kr/month
      const result = calculateLoanPayment(3000000, 7, 5);
      expect(result).toBeCloseTo(59404, 0);
    });

    it('returns 0 for zero loan amount', () => {
      const result = calculateLoanPayment(0, 7, 5);
      expect(result).toBe(0);
    });

    it('returns 0 for zero interest rate', () => {
      const result = calculateLoanPayment(3000000, 0, 5);
      expect(result).toBe(0);
    });

    it('returns 0 for zero term', () => {
      const result = calculateLoanPayment(3000000, 7, 0);
      expect(result).toBe(0);
    });

    it('handles different loan terms', () => {
      const result3Years = calculateLoanPayment(3000000, 7, 3);
      const result10Years = calculateLoanPayment(3000000, 7, 10);

      // Shorter term = higher monthly payment
      expect(result3Years).toBeGreaterThan(result10Years);
    });

    it('handles different interest rates', () => {
      const result5Percent = calculateLoanPayment(3000000, 5, 5);
      const result10Percent = calculateLoanPayment(3000000, 10, 5);

      // Higher interest = higher monthly payment
      expect(result10Percent).toBeGreaterThan(result5Percent);
    });
  });

  describe('calculateTotalInterest', () => {
    it('calculates total interest correctly', () => {
      const monthlyPayment = 59406;
      const loanAmount = 3000000;
      const termYears = 5;

      const totalInterest = calculateTotalInterest(
        monthlyPayment,
        loanAmount,
        termYears
      );

      // Total payments = 59406 * 60 = 3,564,360
      // Interest = 3,564,360 - 3,000,000 = 564,360
      expect(totalInterest).toBeCloseTo(564360, 0);
    });

    it('returns 0 for no interest scenario', () => {
      const monthlyPayment = 50000; // 3M / 60 months
      const loanAmount = 3000000;
      const termYears = 5;

      const totalInterest = calculateTotalInterest(
        monthlyPayment,
        loanAmount,
        termYears
      );

      // Total = 50000 * 60 = 3,000,000
      // Interest = 0
      expect(totalInterest).toBe(0);
    });
  });

  describe('calculateDepreciation', () => {
    it('calculates linear depreciation correctly', () => {
      // 4M kr, 10 years
      // = 4,000,000 / 10 / 12 = 33,333.33 kr/month
      const result = calculateDepreciation(4000000, 10);
      expect(result).toBeCloseTo(33333.33, 1);
    });

    it('uses currentMarketValue when provided', () => {
      // Purchase 3M, current value 2.5M
      // Depreciation = (3M - 2.5M) / 12 = 41,666.67 kr/month
      const result = calculateDepreciation(3000000, 10, 2500000);
      expect(result).toBeCloseTo(41666.67, 1);
    });

    it('handles zero current market value', () => {
      // Total depreciation = purchase price
      const result = calculateDepreciation(3000000, 10, 0);
      expect(result).toBeCloseTo(250000, 0);
    });

    it('falls back to default lifetime if <= 0', () => {
      // Should use 10 years as fallback
      const result = calculateDepreciation(3000000, 0);
      expect(result).toBeCloseTo(25000, 0);
    });
  });

  describe('calculateIndirectMonthlyCost', () => {
    it('aggregates all indirect costs correctly', () => {
      const inputs = {
        ...createValidInputs(),
        purchasePrice: 4000000,
        estimatedLifetimeYears: 10,
        annualInsurance: 150000,
        annualRegistrationTax: 50000,
        biannualInspection: 12000,
        annualMaintenance: 150000,
        tiresEveryNYears: 4,
        tiresCost: 60000,
      };

      const result = calculateIndirectMonthlyCost(inputs);

      // Depreciation: 4M / 10 / 12 = 33,333.33
      expect(result.depreciationMonthly).toBeCloseTo(33333.33, 1);

      // Insurance: 150,000 / 12 = 12,500
      expect(result.insuranceMonthly).toBeCloseTo(12500, 0);

      // Registration tax: 50,000 / 12 = 4,166.67
      expect(result.registrationTaxMonthly).toBeCloseTo(4166.67, 1);

      // Inspection: 12,000 / 24 = 500
      expect(result.inspectionMonthly).toBeCloseTo(500, 0);

      // Maintenance: 150,000 / 12 = 12,500
      expect(result.maintenanceMonthly).toBeCloseTo(12500, 0);

      // Tires: 60,000 / (4 * 12) = 1,250
      expect(result.tiresMonthly).toBeCloseTo(1250, 0);

      // Total indirect: sum of all above
      const expectedTotal = 33333.33 + 12500 + 4166.67 + 500 + 12500 + 1250;
      expect(result.indirectMonthlyCost).toBeCloseTo(expectedTotal, 0);
    });

    it('handles different tire intervals', () => {
      const inputs2Years = {
        ...createValidInputs(),
        tiresEveryNYears: 2,
        tiresCost: 60000,
      };
      const inputs4Years = {
        ...createValidInputs(),
        tiresEveryNYears: 4,
        tiresCost: 60000,
      };

      const result2Years = calculateIndirectMonthlyCost(inputs2Years);
      const result4Years = calculateIndirectMonthlyCost(inputs4Years);

      // 2 years interval should cost more per month
      expect(result2Years.tiresMonthly).toBeGreaterThan(
        result4Years.tiresMonthly
      );
    });
  });

  describe('calculateLifeEnergy', () => {
    it('calculates life energy hours correctly', () => {
      // 80,000 kr/month, 5,000 kr/hour wage
      // = 80,000 / 5,000 = 16 hours/month
      const result = calculateLifeEnergy(80000, 5000);

      expect(result.lifeEnergyHoursPerMonth).toBeCloseTo(16, 1);
      expect(result.lifeEnergyHoursPerYear).toBeCloseTo(192, 1);
    });

    it('returns 0 when wage is 0', () => {
      const result = calculateLifeEnergy(80000, 0);

      expect(result.lifeEnergyHoursPerMonth).toBe(0);
      expect(result.lifeEnergyHoursPerYear).toBe(0);
    });

    it('returns 0 when wage is negative', () => {
      const result = calculateLifeEnergy(80000, -1000);

      expect(result.lifeEnergyHoursPerMonth).toBe(0);
      expect(result.lifeEnergyHoursPerYear).toBe(0);
    });

    it('handles high costs relative to wage', () => {
      // Low wage, high cost = many hours
      const result = calculateLifeEnergy(100000, 1000);

      expect(result.lifeEnergyHoursPerMonth).toBeCloseTo(100, 1);
      expect(result.lifeEnergyHoursPerYear).toBeCloseTo(1200, 1);
    });
  });

  describe('calculateCarFutureValue', () => {
    it('calculates future value for 5, 10, 20 years', () => {
      const monthlyCost = 80000;
      const result = calculateCarFutureValue(monthlyCost);

      // At 7% annual return:
      // 5 years: ~5.7M
      expect(result.futureValue5Years).toBeGreaterThan(5000000);
      expect(result.futureValue5Years).toBeLessThan(6000000);

      // 10 years: ~13.8M
      expect(result.futureValue10Years).toBeGreaterThan(13000000);
      expect(result.futureValue10Years).toBeLessThan(15000000);

      // 20 years: ~41M
      expect(result.futureValue20Years).toBeGreaterThan(40000000);
      expect(result.futureValue20Years).toBeLessThan(45000000);
    });

    it('handles 0 monthly cost', () => {
      const result = calculateCarFutureValue(0);

      expect(result.futureValue5Years).toBe(0);
      expect(result.futureValue10Years).toBe(0);
      expect(result.futureValue20Years).toBe(0);
    });

    it('scales with monthly cost', () => {
      const result40k = calculateCarFutureValue(40000);
      const result80k = calculateCarFutureValue(80000);

      // Double the monthly cost = double the future value
      expect(result80k.futureValue10Years).toBeCloseTo(
        result40k.futureValue10Years * 2,
        -3
      );
    });
  });

  describe('generateCostBreakdown', () => {
    it('creates breakdown items with correct percentages', () => {
      const breakdown = generateCostBreakdown(
        30000, // fuel
        10000, // parking
        5000, // tolls
        50000, // loan
        25000, // depreciation
        12500, // insurance
        4167, // registration tax
        500, // inspection
        12500, // maintenance
        1250, // tires
        150917 // total
      );

      expect(breakdown).toHaveLength(10);

      // Check percentages sum to ~100
      const totalPercentage = breakdown.reduce(
        (sum, item) => sum + item.percentage,
        0
      );
      expect(totalPercentage).toBeCloseTo(100, 0);

      // Check sorted by cost descending
      expect(breakdown[0].monthlyCost).toBeGreaterThanOrEqual(
        breakdown[1].monthlyCost
      );
    });

    it('sorts items by cost descending', () => {
      const breakdown = generateCostBreakdown(
        10000, 0, 0, 50000, 30000, 20000, 5000, 1000, 15000, 2000, 133000
      );

      expect(breakdown[0].monthlyCost).toBe(50000); // loan
      expect(breakdown[1].monthlyCost).toBe(30000); // depreciation
      expect(breakdown[2].monthlyCost).toBe(20000); // insurance
    });

    it('excludes zero-cost items for parking and tolls', () => {
      const breakdown = generateCostBreakdown(
        30000, 0, 0, 0, 25000, 12500, 4167, 500, 12500, 1250, 85917
      );

      const hasParking = breakdown.some((item) => item.category === 'parking');
      const hasTolls = breakdown.some((item) => item.category === 'tolls');
      const hasLoan = breakdown.some((item) => item.category === 'loan');

      expect(hasParking).toBe(false);
      expect(hasTolls).toBe(false);
      expect(hasLoan).toBe(false);
    });

    it('includes parking, tolls, and loan when > 0', () => {
      const breakdown = generateCostBreakdown(
        30000, 10000, 5000, 20000, 25000, 12500, 4167, 500, 12500, 1250,
        120917
      );

      const hasParking = breakdown.some((item) => item.category === 'parking');
      const hasTolls = breakdown.some((item) => item.category === 'tolls');
      const hasLoan = breakdown.some((item) => item.category === 'loan');

      expect(hasParking).toBe(true);
      expect(hasTolls).toBe(true);
      expect(hasLoan).toBe(true);
    });

    it('marks direct vs indirect correctly', () => {
      const breakdown = generateCostBreakdown(
        30000, 10000, 5000, 20000, 25000, 12500, 4167, 500, 12500, 1250,
        120917
      );

      const fuel = breakdown.find((item) => item.category === 'fuel');
      const depreciation = breakdown.find(
        (item) => item.category === 'depreciation'
      );

      expect(fuel?.isDirect).toBe(true);
      expect(depreciation?.isDirect).toBe(false);
    });

    it('returns empty array for 0 total cost', () => {
      const breakdown = generateCostBreakdown(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      expect(breakdown).toEqual([]);
    });
  });

  describe('calculateCarOwnershipResults - Integration', () => {
    it('calculates complete results without financing', () => {
      const inputs = createValidInputs();
      const actualHourlyWage = 5000;

      const results = calculateCarOwnershipResults(inputs, actualHourlyWage);

      // Direct costs
      expect(results.fuelCostMonthly).toBeCloseTo(33750, 0);
      expect(results.parkingCostMonthly).toBe(0);
      expect(results.tollsCostMonthly).toBe(0);
      expect(results.loanPaymentMonthly).toBe(0);

      // Indirect costs
      expect(results.depreciationMonthly).toBeCloseTo(25000, 0);
      expect(results.insuranceMonthly).toBeCloseTo(12500, 0);

      // Totals
      expect(results.totalMonthlyCost).toBeGreaterThan(0);
      expect(results.totalYearlyCost).toBe(results.totalMonthlyCost * 12);

      // Life energy
      expect(results.lifeEnergyHoursPerMonth).toBeGreaterThan(0);
      expect(results.lifeEnergyHoursPerYear).toBe(
        results.lifeEnergyHoursPerMonth * 12
      );

      // Future value
      expect(results.futureValue5Years).toBeGreaterThan(0);
      expect(results.futureValue10Years).toBeGreaterThan(
        results.futureValue5Years
      );
      expect(results.futureValue20Years).toBeGreaterThan(
        results.futureValue10Years
      );

      // Cost breakdown
      expect(results.costBreakdown).toHaveLength(7); // No parking, tolls, or loan

      // No loan info
      expect(results.totalInterestPaid).toBeUndefined();
      expect(results.totalLoanCost).toBeUndefined();
    });

    it('calculates complete results with financing', () => {
      const inputs: CarOwnershipInputs = {
        ...createValidInputs(),
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };
      const actualHourlyWage = 5000;

      const results = calculateCarOwnershipResults(inputs, actualHourlyWage);

      // Loan payment should be present
      expect(results.loanPaymentMonthly).toBeGreaterThan(0);
      expect(results.loanPaymentMonthly).toBeCloseTo(49503, 0);

      // Total cost is direct + loan + indirect
      const expectedTotal =
        results.directMonthlyCost +
        results.loanPaymentMonthly +
        results.indirectMonthlyCost;
      expect(results.totalMonthlyCost).toBeCloseTo(expectedTotal, 0);

      // Loan info should be present
      expect(results.totalInterestPaid).toBeGreaterThan(0);
      expect(results.totalLoanCost).toBeGreaterThan(inputs.financing.loanAmount);

      // Cost breakdown includes loan
      const hasLoan = results.costBreakdown.some(
        (item) => item.category === 'loan'
      );
      expect(hasLoan).toBe(true);
    });

    it('handles zero actualHourlyWage gracefully', () => {
      const inputs = createValidInputs();
      const actualHourlyWage = 0;

      const results = calculateCarOwnershipResults(inputs, actualHourlyWage);

      expect(results.lifeEnergyHoursPerMonth).toBe(0);
      expect(results.lifeEnergyHoursPerYear).toBe(0);

      // Other calculations should still work
      expect(results.totalMonthlyCost).toBeGreaterThan(0);
      expect(results.futureValue10Years).toBeGreaterThan(0);
    });

    it('includes all cost types when present', () => {
      const inputs: CarOwnershipInputs = {
        ...createValidInputs(),
        monthlyParking: 20000,
        monthlyTolls: 5000,
        hasFinancing: true,
        financing: {
          downPayment: 500000,
          loanAmount: 2500000,
          annualInterestRate: 7,
          loanTermYears: 5,
        },
      };

      const results = calculateCarOwnershipResults(inputs, 5000);

      expect(results.parkingCostMonthly).toBe(20000);
      expect(results.tollsCostMonthly).toBe(5000);
      expect(results.loanPaymentMonthly).toBeGreaterThan(0);
      expect(results.costBreakdown.length).toBe(10); // All categories
    });

    it('performs calculations in < 100ms', () => {
      const inputs = createValidInputs();
      const start = performance.now();

      calculateCarOwnershipResults(inputs, 5000);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
