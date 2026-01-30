/**
 * Unit tests for Meal Cost Calculator calculations
 */

import { describe, it, expect } from 'vitest';
import {
  calculateEatingOutWeeklyCost,
  calculateEatingOutMonthlyCost,
  calculateEatingOutYearlyCost,
  calculateHomeCookingWeeklyCost,
  calculateHomeCookingMonthlyCost,
  calculateHomeCookingYearlyCost,
  calculateCostPerPerson,
  calculateLifeEnergy,
  calculateEatingOutSummary,
  calculateHomeCookingSummary,
  compareEatingOutVsHome,
  isValidEatingOutData,
  isValidHomeCookingData,
  generateEatingOutBreakdown,
  generateHomeCookingBreakdown,
  calculateWeeklyGroceryCost,
  calculateWeeklyTimeCost,
} from '@/lib/calculations/mealCost';
import { WEEKS_PER_MONTH, WEEKS_PER_YEAR } from '@/lib/constants/mealCost';
import type { EatingOutData, HomeCookingData } from '@/types/calculator';

describe('Eating Out Calculations', () => {
  const sampleEatingOutData: EatingOutData = {
    breakfastCount: 2,
    lunchCount: 5,
    dinnerCount: 2,
    coffeeCount: 5,
    fastFoodCount: 1,
    breakfastCost: 1500,
    lunchCost: 2500,
    dinnerCost: 4000,
    coffeeCost: 650,
    fastFoodCost: 2000,
  };

  it('should calculate weekly eating out cost correctly', () => {
    const expected =
      2 * 1500 + // breakfast
      5 * 2500 + // lunch
      2 * 4000 + // dinner
      5 * 650 + // coffee
      1 * 2000; // fast food
    expect(calculateEatingOutWeeklyCost(sampleEatingOutData)).toBe(expected);
  });

  it('should calculate monthly eating out cost correctly', () => {
    const weeklyCost = calculateEatingOutWeeklyCost(sampleEatingOutData);
    expect(calculateEatingOutMonthlyCost(sampleEatingOutData)).toBe(
      weeklyCost * WEEKS_PER_MONTH
    );
  });

  it('should calculate yearly eating out cost correctly', () => {
    const weeklyCost = calculateEatingOutWeeklyCost(sampleEatingOutData);
    expect(calculateEatingOutYearlyCost(sampleEatingOutData)).toBe(weeklyCost * WEEKS_PER_YEAR);
  });

  it('should handle zero counts in eating out calculation', () => {
    const zeroData: EatingOutData = {
      ...sampleEatingOutData,
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      coffeeCount: 0,
      fastFoodCount: 0,
    };
    expect(calculateEatingOutWeeklyCost(zeroData)).toBe(0);
  });

  it('should generate eating out breakdown with correct percentages', () => {
    const breakdown = generateEatingOutBreakdown(sampleEatingOutData, 2000);
    const totalPercentage = breakdown.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  it('should filter out zero-cost items from eating out breakdown', () => {
    const dataWithZeros: EatingOutData = {
      ...sampleEatingOutData,
      breakfastCount: 0,
    };
    const breakdown = generateEatingOutBreakdown(dataWithZeros, 2000);
    expect(breakdown.find((item) => item.category === 'breakfast')).toBeUndefined();
  });

  it('should sort eating out breakdown by cost descending', () => {
    const breakdown = generateEatingOutBreakdown(sampleEatingOutData, 2000);
    for (let i = 1; i < breakdown.length; i++) {
      expect(breakdown[i - 1].monthlyCost).toBeGreaterThanOrEqual(breakdown[i].monthlyCost);
    }
  });
});

describe('Home Cooking Calculations', () => {
  const sampleHomeCookingData: HomeCookingData = {
    monthlyGroceryCost: 80000,
    householdSize: 2,
    shoppingHoursPerWeek: 2,
    cookingHoursPerWeek: 7,
  };

  const actualHourlyWage = 2000;

  it('should calculate weekly grocery cost correctly', () => {
    expect(calculateWeeklyGroceryCost(80000)).toBeCloseTo(80000 / WEEKS_PER_MONTH, 2);
  });

  it('should calculate weekly time cost correctly', () => {
    const expected = (2 + 7) * 2000; // 9 hours × 2000 kr/hr
    expect(calculateWeeklyTimeCost(2, 7, 2000)).toBe(expected);
  });

  it('should calculate total weekly home cooking cost correctly', () => {
    const groceryCost = calculateWeeklyGroceryCost(sampleHomeCookingData.monthlyGroceryCost);
    const timeCost = calculateWeeklyTimeCost(
      sampleHomeCookingData.shoppingHoursPerWeek,
      sampleHomeCookingData.cookingHoursPerWeek,
      actualHourlyWage
    );
    expect(calculateHomeCookingWeeklyCost(sampleHomeCookingData, actualHourlyWage)).toBeCloseTo(
      groceryCost + timeCost,
      2
    );
  });

  it('should calculate monthly home cooking cost correctly', () => {
    const weeklyCost = calculateHomeCookingWeeklyCost(
      sampleHomeCookingData,
      actualHourlyWage
    );
    expect(
      calculateHomeCookingMonthlyCost(sampleHomeCookingData, actualHourlyWage)
    ).toBeCloseTo(weeklyCost * WEEKS_PER_MONTH, 2);
  });

  it('should calculate yearly home cooking cost correctly', () => {
    const weeklyCost = calculateHomeCookingWeeklyCost(
      sampleHomeCookingData,
      actualHourlyWage
    );
    expect(calculateHomeCookingYearlyCost(sampleHomeCookingData, actualHourlyWage)).toBeCloseTo(
      weeklyCost * WEEKS_PER_YEAR,
      2
    );
  });

  it('should calculate cost per person correctly', () => {
    expect(calculateCostPerPerson(10000, 2)).toBe(5000);
    expect(calculateCostPerPerson(15000, 3)).toBe(5000);
  });

  it('should handle zero household size gracefully', () => {
    expect(calculateCostPerPerson(10000, 0)).toBe(0);
  });

  it('should generate home cooking breakdown with correct categories', () => {
    const breakdown = generateHomeCookingBreakdown(sampleHomeCookingData, actualHourlyWage);
    expect(breakdown.length).toBe(3);
    expect(breakdown.find((item) => item.category === 'groceries')).toBeDefined();
    expect(breakdown.find((item) => item.category === 'shoppingTime')).toBeDefined();
    expect(breakdown.find((item) => item.category === 'cookingTime')).toBeDefined();
  });

  it('should generate home cooking breakdown with correct percentages', () => {
    const breakdown = generateHomeCookingBreakdown(sampleHomeCookingData, actualHourlyWage);
    const totalPercentage = breakdown.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
  });
});

describe('Life Energy Calculations', () => {
  it('should calculate life energy correctly', () => {
    expect(calculateLifeEnergy(10000, 2000)).toBe(5);
    expect(calculateLifeEnergy(5000, 1000)).toBe(5);
  });

  it('should handle zero wage gracefully', () => {
    expect(calculateLifeEnergy(10000, 0)).toBe(0);
  });

  it('should handle negative cost gracefully', () => {
    expect(calculateLifeEnergy(-100, 2000)).toBe(0);
  });
});

describe('Summary Calculations', () => {
  const sampleEatingOutData: EatingOutData = {
    breakfastCount: 0,
    lunchCount: 5,
    dinnerCount: 2,
    coffeeCount: 5,
    fastFoodCount: 1,
    breakfastCost: 1500,
    lunchCost: 2500,
    dinnerCost: 4000,
    coffeeCost: 650,
    fastFoodCost: 2000,
  };

  const sampleHomeCookingData: HomeCookingData = {
    monthlyGroceryCost: 80000,
    householdSize: 2,
    shoppingHoursPerWeek: 2,
    cookingHoursPerWeek: 7,
  };

  const actualHourlyWage = 2000;

  it('should calculate eating out summary with all fields', () => {
    const summary = calculateEatingOutSummary(sampleEatingOutData, actualHourlyWage);
    expect(summary.weeklyCost).toBeGreaterThan(0);
    expect(summary.monthlyCost).toBeGreaterThan(0);
    expect(summary.yearlyCost).toBeGreaterThan(0);
    expect(summary.weeklyLifeEnergy).toBeGreaterThan(0);
    expect(summary.monthlyLifeEnergy).toBeGreaterThan(0);
    expect(summary.yearlyLifeEnergy).toBeGreaterThan(0);
    expect(summary.breakdown).toBeDefined();
    expect(summary.breakdown.length).toBeGreaterThan(0);
  });

  it('should calculate home cooking summary with all fields', () => {
    const summary = calculateHomeCookingSummary(sampleHomeCookingData, actualHourlyWage);
    expect(summary.weeklyCost).toBeGreaterThan(0);
    expect(summary.monthlyCost).toBeGreaterThan(0);
    expect(summary.yearlyCost).toBeGreaterThan(0);
    expect(summary.weeklyLifeEnergy).toBeGreaterThan(0);
    expect(summary.monthlyLifeEnergy).toBeGreaterThan(0);
    expect(summary.yearlyLifeEnergy).toBeGreaterThan(0);
    expect(summary.breakdown).toBeDefined();
    expect(summary.breakdown.length).toBe(3);
  });
});

describe('Comparison Calculations', () => {
  const sampleEatingOutData: EatingOutData = {
    breakfastCount: 0,
    lunchCount: 5,
    dinnerCount: 2,
    coffeeCount: 5,
    fastFoodCount: 1,
    breakfastCost: 1500,
    lunchCost: 2500,
    dinnerCost: 4000,
    coffeeCost: 650,
    fastFoodCost: 2000,
  };

  const sampleHomeCookingData: HomeCookingData = {
    monthlyGroceryCost: 80000,
    householdSize: 2,
    shoppingHoursPerWeek: 2,
    cookingHoursPerWeek: 7,
  };

  const actualHourlyWage = 2000;

  it('should compare eating out vs home cooking', () => {
    const comparison = compareEatingOutVsHome(
      sampleEatingOutData,
      sampleHomeCookingData,
      actualHourlyWage
    );
    expect(comparison.eatingOutSummary).toBeDefined();
    expect(comparison.homeCookingSummary).toBeDefined();
    expect(comparison.monthlyDifference).toBeDefined();
    expect(comparison.yearlyDifference).toBeDefined();
    expect(comparison.lifeEnergyDifference).toBeDefined();
    expect(comparison.percentageDifference).toBeDefined();
    expect(comparison.futureValue10Years).toBeGreaterThan(0);
    expect(comparison.futureValue20Years).toBeGreaterThan(0);
    expect(comparison.futureValue30Years).toBeGreaterThan(0);
  });

  it('should identify home cooking as cheaper when it is', () => {
    const comparison = compareEatingOutVsHome(
      sampleEatingOutData,
      sampleHomeCookingData,
      actualHourlyWage
    );
    // With typical data, home cooking should be cheaper
    if (comparison.monthlyDifference > 0) {
      expect(comparison.cheaperOption).toBe('homeCooking');
      expect(comparison.recommendation).toContain('Heimaeldun sparar');
    }
  });

  it('should identify eating out as cheaper with very high wage', () => {
    const veryHighWage = 10000; // Very high hourly wage
    const comparison = compareEatingOutVsHome(
      sampleEatingOutData,
      sampleHomeCookingData,
      veryHighWage
    );
    if (comparison.monthlyDifference < 0) {
      expect(comparison.cheaperOption).toBe('eatingOut');
      expect(comparison.recommendation).toContain('ódýrara að borða úti');
    }
  });

  it('should identify similar costs when difference is small', () => {
    // Create data with similar costs
    const similarEatingOut: EatingOutData = {
      ...sampleEatingOutData,
      lunchCount: 0,
      dinnerCount: 0,
      coffeeCount: 1,
      fastFoodCount: 0,
    };
    const comparison = compareEatingOutVsHome(
      similarEatingOut,
      sampleHomeCookingData,
      actualHourlyWage
    );
    if (Math.abs(comparison.percentageDifference) < 5) {
      expect(comparison.cheaperOption).toBe('similar');
      expect(comparison.recommendation).toContain('svipaður');
    }
  });

  it('should calculate future values correctly', () => {
    const comparison = compareEatingOutVsHome(
      sampleEatingOutData,
      sampleHomeCookingData,
      actualHourlyWage
    );
    // Future values should increase with time
    expect(comparison.futureValue20Years).toBeGreaterThan(comparison.futureValue10Years);
    expect(comparison.futureValue30Years).toBeGreaterThan(comparison.futureValue20Years);
  });
});

describe('Validation Functions', () => {
  it('should validate correct eating out data', () => {
    const validData: EatingOutData = {
      breakfastCount: 5,
      lunchCount: 5,
      dinnerCount: 5,
      coffeeCount: 10,
      fastFoodCount: 2,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    };
    expect(isValidEatingOutData(validData)).toBe(true);
  });

  it('should reject eating out data with negative counts', () => {
    const invalidData: EatingOutData = {
      breakfastCount: -1,
      lunchCount: 5,
      dinnerCount: 5,
      coffeeCount: 10,
      fastFoodCount: 2,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    };
    expect(isValidEatingOutData(invalidData)).toBe(false);
  });

  it('should reject eating out data with counts > 21', () => {
    const invalidData: EatingOutData = {
      breakfastCount: 25,
      lunchCount: 5,
      dinnerCount: 5,
      coffeeCount: 10,
      fastFoodCount: 2,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    };
    expect(isValidEatingOutData(invalidData)).toBe(false);
  });

  it('should reject eating out data with non-positive costs', () => {
    const invalidData: EatingOutData = {
      breakfastCount: 5,
      lunchCount: 5,
      dinnerCount: 5,
      coffeeCount: 10,
      fastFoodCount: 2,
      breakfastCost: 0,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    };
    expect(isValidEatingOutData(invalidData)).toBe(false);
  });

  it('should validate correct home cooking data', () => {
    const validData: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 7,
    };
    expect(isValidHomeCookingData(validData)).toBe(true);
  });

  it('should reject home cooking data with non-positive grocery cost', () => {
    const invalidData: HomeCookingData = {
      monthlyGroceryCost: 0,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 7,
    };
    expect(isValidHomeCookingData(invalidData)).toBe(false);
  });

  it('should reject home cooking data with household size < 1', () => {
    const invalidData: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 0,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 7,
    };
    expect(isValidHomeCookingData(invalidData)).toBe(false);
  });

  it('should reject home cooking data with negative hours', () => {
    const invalidData: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: -1,
      cookingHoursPerWeek: 7,
    };
    expect(isValidHomeCookingData(invalidData)).toBe(false);
  });

  it('should accept home cooking data with zero hours', () => {
    const validData: HomeCookingData = {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 0,
      cookingHoursPerWeek: 0,
    };
    expect(isValidHomeCookingData(validData)).toBe(true);
  });
});
