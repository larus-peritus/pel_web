/**
 * Meal Cost Calculator - Calculation Functions
 * Pure functions for analyzing eating out vs home cooking costs
 *
 * All calculations use Icelandic króna (ISK) as currency
 * Time is measured in hours per week, converted to monthly/yearly as needed
 */

import type {
  EatingOutData,
  HomeCookingData,
  MealCostSummary,
  MealCostBreakdownItem,
  MealCostComparisonResults,
} from '@/types/calculator';
import { dollarsToLifeEnergy } from './lifeEnergy';
import { calculateFutureValue } from './subscriptions';
import {
  WEEKS_PER_MONTH,
  WEEKS_PER_YEAR,
  MONTHS_PER_YEAR,
  ANNUAL_RETURN_RATE,
} from '../constants/mealCost';

/**
 * Category labels in Icelandic for breakdown display
 */
export const MEAL_CATEGORY_LABELS: Record<string, string> = {
  breakfast: 'Morgunverður',
  lunch: 'Hádegisverður',
  dinner: 'Kvöldverður',
  coffee: 'Kaffi/drykkir',
  fastFood: 'Skyndibitir',
  groceries: 'Matvörukaup',
  shoppingTime: 'Tími í innkaupum',
  cookingTime: 'Tími í eldhúsi',
};

// ============================================================================
// CONVENIENCE FOOD CALCULATIONS
// ============================================================================

/**
 * Calculate total weekly cost of convenience food (meals bought instead of made at home)
 * Multiplies per-person costs by household size for family totals
 *
 * @param data - Convenience food data (meal counts, costs, and household size)
 * @returns Total weekly cost in ISK for the entire household
 */
export function calculateEatingOutWeeklyCost(data: EatingOutData): number {
  const householdSize = data.householdSize || 1;
  const perPersonWeeklyCost =
    data.breakfastCount * data.breakfastCost +
    data.lunchCount * data.lunchCost +
    data.dinnerCount * data.dinnerCost +
    data.coffeeCount * data.coffeeCost +
    data.fastFoodCount * data.fastFoodCost;

  return perPersonWeeklyCost * householdSize;
}

/**
 * Calculate per-person weekly cost (without household multiplier)
 *
 * @param data - Convenience food data
 * @returns Weekly cost per person in ISK
 */
export function calculateEatingOutWeeklyCostPerPerson(data: EatingOutData): number {
  return (
    data.breakfastCount * data.breakfastCost +
    data.lunchCount * data.lunchCost +
    data.dinnerCount * data.dinnerCost +
    data.coffeeCount * data.coffeeCost +
    data.fastFoodCount * data.fastFoodCost
  );
}

/**
 * Calculate total monthly cost of eating out
 *
 * @param data - Eating out data
 * @returns Total monthly cost in ISK
 */
export function calculateEatingOutMonthlyCost(data: EatingOutData): number {
  return calculateEatingOutWeeklyCost(data) * WEEKS_PER_MONTH;
}

/**
 * Calculate total yearly cost of eating out
 *
 * @param data - Eating out data
 * @returns Total yearly cost in ISK
 */
export function calculateEatingOutYearlyCost(data: EatingOutData): number {
  return calculateEatingOutWeeklyCost(data) * WEEKS_PER_YEAR;
}

/**
 * Generate breakdown of convenience food costs by category
 * All costs are multiplied by household size
 *
 * @param data - Convenience food data
 * @param actualHourlyWage - User's actual hourly wage for life energy calculation
 * @returns Array of breakdown items (with household totals)
 */
export function generateEatingOutBreakdown(
  data: EatingOutData,
  actualHourlyWage: number
): MealCostBreakdownItem[] {
  const householdSize = data.householdSize || 1;
  const totalMonthlyCost = calculateEatingOutMonthlyCost(data);

  const categories: Array<{
    category: string;
    count: number;
    cost: number;
  }> = [
    { category: 'breakfast', count: data.breakfastCount, cost: data.breakfastCost },
    { category: 'lunch', count: data.lunchCount, cost: data.lunchCost },
    { category: 'dinner', count: data.dinnerCount, cost: data.dinnerCost },
    { category: 'coffee', count: data.coffeeCount, cost: data.coffeeCost },
    { category: 'fastFood', count: data.fastFoodCount, cost: data.fastFoodCost },
  ];

  return categories
    .map(({ category, count, cost }) => {
      // Multiply by household size for total cost
      const weeklyCost = count * cost * householdSize;
      const monthlyCost = weeklyCost * WEEKS_PER_MONTH;
      const yearlyCost = weeklyCost * WEEKS_PER_YEAR;
      const lifeEnergyHours = dollarsToLifeEnergy(monthlyCost, actualHourlyWage);
      const percentage = totalMonthlyCost > 0 ? (monthlyCost / totalMonthlyCost) * 100 : 0;

      return {
        category,
        label: MEAL_CATEGORY_LABELS[category],
        weeklyCost,
        monthlyCost,
        yearlyCost,
        lifeEnergyHours,
        percentage,
      };
    })
    .filter((item) => item.monthlyCost > 0) // Only include non-zero items
    .sort((a, b) => b.monthlyCost - a.monthlyCost); // Sort by cost descending
}

// ============================================================================
// HOME COOKING CALCULATIONS (NEW MODEL)
// ============================================================================

/**
 * Model overview:
 * - Baseline: Monthly breakfast/pantry cost (always paid)
 * - Lunch: Can be free (work/school), subsidized, or home-packed
 * - Dinner: Per-meal cost × number of dinners cooked at home
 *
 * Key insight: When you eat out, you DON'T cook that meal at home, so you SAVE money.
 * Net extra cost = Eating out cost - Saved home cooking cost
 */

/**
 * Calculate weekly lunch cost based on lunch type
 */
export function calculateWeeklyLunchCost(data: HomeCookingData): number {
  if (data.lunchType === 'free') {
    return 0;
  }
  // 5 workday lunches per week × cost × household size
  return 5 * data.lunchCostPerMeal * data.householdSize;
}

/**
 * Calculate weekly dinner cost for all 7 dinners at home
 */
export function calculateWeeklyDinnerCostAllHome(data: HomeCookingData): number {
  // 7 dinners per week × cost per dinner (already for whole household)
  return 7 * data.dinnerCostPerMeal;
}

/**
 * Calculate weekly time cost for home cooking
 * Time cost = hours spent × hourly wage
 */
export function calculateWeeklyTimeCost(
  shoppingHours: number,
  cookingHours: number,
  actualHourlyWage: number
): number {
  const totalHours = shoppingHours + cookingHours;
  return totalHours * actualHourlyWage;
}

/**
 * Calculate weekly cost if cooking ALL meals at home (baseline for comparison)
 * NOTE: Time is NOT included in cost - it's shown separately as information
 */
export function calculateHomeCookingWeeklyCost(
  data: HomeCookingData,
  _actualHourlyWage: number // Kept for API compatibility, not used
): number {
  // Weekly baseline (breakfast + pantry divided by weeks)
  const weeklyBaseline = data.monthlyBreakfastBaseline / WEEKS_PER_MONTH;
  // Lunch (may be 0 if free)
  const weeklyLunch = calculateWeeklyLunchCost(data);
  // All 7 dinners at home
  const weeklyDinner = calculateWeeklyDinnerCostAllHome(data);

  // Time is NOT included in monetary cost - it's informational only
  return weeklyBaseline + weeklyLunch + weeklyDinner;
}

/**
 * Calculate monthly cost if cooking ALL meals at home
 */
export function calculateHomeCookingMonthlyCost(
  data: HomeCookingData,
  actualHourlyWage: number
): number {
  return calculateHomeCookingWeeklyCost(data, actualHourlyWage) * WEEKS_PER_MONTH;
}

/**
 * Calculate yearly cost if cooking ALL meals at home
 */
export function calculateHomeCookingYearlyCost(
  data: HomeCookingData,
  actualHourlyWage: number
): number {
  return calculateHomeCookingWeeklyCost(data, actualHourlyWage) * WEEKS_PER_YEAR;
}

/**
 * Calculate the SAVED home cooking cost when eating out
 * This is what you DON'T spend at home because you ate out instead
 */
export function calculateSavedHomeCookingWeekly(
  eatingOutData: EatingOutData,
  homeCookingData: HomeCookingData
): number {
  // Saved dinners (dinners eaten out = dinners NOT cooked at home)
  const savedDinnerCost = eatingOutData.dinnerCount * homeCookingData.dinnerCostPerMeal;

  // Saved lunch (only if normally packing lunch at home)
  let savedLunchCost = 0;
  if (homeCookingData.lunchType === 'homePacked') {
    // If you'd normally pack lunch, buying lunch saves the packing cost
    savedLunchCost = eatingOutData.lunchCount * homeCookingData.lunchCostPerMeal * eatingOutData.householdSize;
  }

  // Breakfasts, coffee, and fast food don't really save much at home
  // (breakfast is part of baseline, coffee is cheap at home, snacks minimal)

  return savedDinnerCost + savedLunchCost;
}

/**
 * Calculate saved home cooking cost monthly
 */
export function calculateSavedHomeCookingMonthly(
  eatingOutData: EatingOutData,
  homeCookingData: HomeCookingData
): number {
  return calculateSavedHomeCookingWeekly(eatingOutData, homeCookingData) * WEEKS_PER_MONTH;
}

/**
 * Calculate saved home cooking cost yearly
 */
export function calculateSavedHomeCookingYearly(
  eatingOutData: EatingOutData,
  homeCookingData: HomeCookingData
): number {
  return calculateSavedHomeCookingWeekly(eatingOutData, homeCookingData) * WEEKS_PER_YEAR;
}

/**
 * Calculate cost per person in household
 */
export function calculateCostPerPerson(totalCost: number, householdSize: number): number {
  if (householdSize <= 0) return 0;
  return totalCost / householdSize;
}

/**
 * Generate breakdown of home cooking costs by category
 * NOTE: Time is NOT included - only monetary costs
 */
export function generateHomeCookingBreakdown(
  data: HomeCookingData,
  actualHourlyWage: number
): MealCostBreakdownItem[] {
  const totalMonthlyCost = calculateHomeCookingMonthlyCost(data, actualHourlyWage);

  const items: MealCostBreakdownItem[] = [];

  // Baseline (breakfast + pantry)
  items.push({
    category: 'baseline',
    label: 'Grunnur (morgunverður + búr)',
    weeklyCost: data.monthlyBreakfastBaseline / WEEKS_PER_MONTH,
    monthlyCost: data.monthlyBreakfastBaseline,
    yearlyCost: data.monthlyBreakfastBaseline * MONTHS_PER_YEAR,
    lifeEnergyHours: dollarsToLifeEnergy(data.monthlyBreakfastBaseline, actualHourlyWage),
    percentage: totalMonthlyCost > 0 ? (data.monthlyBreakfastBaseline / totalMonthlyCost) * 100 : 0,
  });

  // Lunch (if not free)
  const weeklyLunch = calculateWeeklyLunchCost(data);
  if (weeklyLunch > 0) {
    const monthlyLunch = weeklyLunch * WEEKS_PER_MONTH;
    items.push({
      category: 'lunch',
      label: data.lunchType === 'homePacked' ? 'Nesti (hádegisverður)' : 'Niðurgreiddur hádegisverður',
      weeklyCost: weeklyLunch,
      monthlyCost: monthlyLunch,
      yearlyCost: weeklyLunch * WEEKS_PER_YEAR,
      lifeEnergyHours: dollarsToLifeEnergy(monthlyLunch, actualHourlyWage),
      percentage: totalMonthlyCost > 0 ? (monthlyLunch / totalMonthlyCost) * 100 : 0,
    });
  }

  // Dinners at home
  const weeklyDinner = calculateWeeklyDinnerCostAllHome(data);
  const monthlyDinner = weeklyDinner * WEEKS_PER_MONTH;
  items.push({
    category: 'dinner',
    label: `Kvöldverður (${data.dinnerCostPerMeal.toLocaleString('is-IS')} kr/máltíð)`,
    weeklyCost: weeklyDinner,
    monthlyCost: monthlyDinner,
    yearlyCost: weeklyDinner * WEEKS_PER_YEAR,
    lifeEnergyHours: dollarsToLifeEnergy(monthlyDinner, actualHourlyWage),
    percentage: totalMonthlyCost > 0 ? (monthlyDinner / totalMonthlyCost) * 100 : 0,
  });

  // Time is NOT included in cost breakdown - it's informational only

  return items
    .filter((item) => item.monthlyCost > 0)
    .sort((a, b) => b.monthlyCost - a.monthlyCost);
}

/**
 * Get time spent on home cooking (informational only, not a cost)
 */
export function getHomeCookingTimeInfo(data: HomeCookingData): {
  shoppingHoursPerWeek: number;
  cookingHoursPerWeek: number;
  totalHoursPerWeek: number;
  totalHoursPerMonth: number;
} {
  const totalHoursPerWeek = data.shoppingHoursPerWeek + data.cookingHoursPerWeek;
  return {
    shoppingHoursPerWeek: data.shoppingHoursPerWeek,
    cookingHoursPerWeek: data.cookingHoursPerWeek,
    totalHoursPerWeek,
    totalHoursPerMonth: totalHoursPerWeek * WEEKS_PER_MONTH,
  };
}

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

/**
 * Calculate life energy cost for a given amount
 *
 * @param cost - Cost in ISK
 * @param hourlyWage - Actual hourly wage
 * @returns Life energy in hours
 */
export function calculateLifeEnergy(cost: number, hourlyWage: number): number {
  return dollarsToLifeEnergy(cost, hourlyWage);
}

// ============================================================================
// SUMMARY CALCULATIONS
// ============================================================================

/**
 * Calculate complete meal cost summary for eating out
 *
 * @param data - Eating out data
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Meal cost summary with all calculations
 */
export function calculateEatingOutSummary(
  data: EatingOutData,
  actualHourlyWage: number
): MealCostSummary {
  const weeklyCost = calculateEatingOutWeeklyCost(data);
  const monthlyCost = calculateEatingOutMonthlyCost(data);
  const yearlyCost = calculateEatingOutYearlyCost(data);

  const weeklyLifeEnergy = calculateLifeEnergy(weeklyCost, actualHourlyWage);
  const monthlyLifeEnergy = calculateLifeEnergy(monthlyCost, actualHourlyWage);
  const yearlyLifeEnergy = calculateLifeEnergy(yearlyCost, actualHourlyWage);

  const breakdown = generateEatingOutBreakdown(data, actualHourlyWage);

  return {
    weeklyCost,
    monthlyCost,
    yearlyCost,
    weeklyLifeEnergy,
    monthlyLifeEnergy,
    yearlyLifeEnergy,
    breakdown,
  };
}

/**
 * Calculate complete meal cost summary for home cooking
 *
 * @param data - Home cooking data
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Meal cost summary with all calculations
 */
export function calculateHomeCookingSummary(
  data: HomeCookingData,
  actualHourlyWage: number
): MealCostSummary {
  const weeklyCost = calculateHomeCookingWeeklyCost(data, actualHourlyWage);
  const monthlyCost = calculateHomeCookingMonthlyCost(data, actualHourlyWage);
  const yearlyCost = calculateHomeCookingYearlyCost(data, actualHourlyWage);

  // For home cooking, life energy includes both money AND actual time spent
  const weeklyMoneyEnergy = calculateLifeEnergy(weeklyCost, actualHourlyWage);
  const monthlyMoneyEnergy = calculateLifeEnergy(monthlyCost, actualHourlyWage);
  const yearlyMoneyEnergy = calculateLifeEnergy(yearlyCost, actualHourlyWage);

  const breakdown = generateHomeCookingBreakdown(data, actualHourlyWage);

  return {
    weeklyCost,
    monthlyCost,
    yearlyCost,
    weeklyLifeEnergy: weeklyMoneyEnergy,
    monthlyLifeEnergy: monthlyMoneyEnergy,
    yearlyLifeEnergy: yearlyMoneyEnergy,
    breakdown,
  };
}

// ============================================================================
// COMPARISON CALCULATIONS
// ============================================================================

/**
 * Compare convenience food costs vs home cooking and generate recommendations
 *
 * KEY INSIGHT: When you eat out, you SAVE on home cooking costs.
 * Net extra cost = Eating out cost - Saved home cooking cost
 *
 * Example: 2 restaurant dinners at 4,000 kr × 2 people = 16,000 kr/week
 *          But you save 2 home dinners at 3,500 kr = 7,000 kr/week
 *          Net extra cost = 9,000 kr/week
 *
 * @param eatingOutData - Convenience food data (meals bought instead of homemade)
 * @param homeCookingData - Home cooking data (baseline + per-meal costs)
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Complete comparison results with NET extra cost emphasis
 */
export function compareEatingOutVsHome(
  eatingOutData: EatingOutData,
  homeCookingData: HomeCookingData,
  actualHourlyWage: number
): MealCostComparisonResults {
  const eatingOutSummary = calculateEatingOutSummary(eatingOutData, actualHourlyWage);
  const homeCookingSummary = calculateHomeCookingSummary(homeCookingData, actualHourlyWage);

  // Calculate SAVED home cooking costs (meals NOT cooked because eaten out)
  const savedHomeCookingMonthly = calculateSavedHomeCookingMonthly(eatingOutData, homeCookingData);
  const savedHomeCookingYearly = calculateSavedHomeCookingYearly(eatingOutData, homeCookingData);

  // NET extra cost = What you pay eating out - What you save by not cooking those meals
  const netExtraCostMonthly = eatingOutSummary.monthlyCost - savedHomeCookingMonthly;
  const netExtraCostYearly = eatingOutSummary.yearlyCost - savedHomeCookingYearly;

  // Legacy difference (total comparison, kept for backward compatibility)
  const monthlyDifference = eatingOutSummary.monthlyCost - homeCookingSummary.monthlyCost;
  const yearlyDifference = eatingOutSummary.yearlyCost - homeCookingSummary.yearlyCost;
  const lifeEnergyDifference =
    eatingOutSummary.monthlyLifeEnergy - homeCookingSummary.monthlyLifeEnergy;

  const percentageDifference =
    savedHomeCookingMonthly > 0
      ? (netExtraCostMonthly / savedHomeCookingMonthly) * 100
      : netExtraCostMonthly > 0 ? 100 : 0;

  // Calculate future value if net extra cost was invested instead
  const futureValue10Years = netExtraCostMonthly > 0
    ? calculateFutureValue(netExtraCostMonthly, ANNUAL_RETURN_RATE, 10)
    : 0;
  const futureValue20Years = netExtraCostMonthly > 0
    ? calculateFutureValue(netExtraCostMonthly, ANNUAL_RETURN_RATE, 20)
    : 0;
  const futureValue30Years = netExtraCostMonthly > 0
    ? calculateFutureValue(netExtraCostMonthly, ANNUAL_RETURN_RATE, 30)
    : 0;

  // Determine analysis (based on net extra cost, not raw comparison)
  let cheaperOption: 'eatingOut' | 'homeCooking' | 'similar';
  if (netExtraCostMonthly < 1000 && netExtraCostMonthly > -1000) {
    cheaperOption = 'similar';
  } else if (netExtraCostMonthly > 0) {
    cheaperOption = 'homeCooking'; // Convenience food has net extra cost
  } else {
    cheaperOption = 'eatingOut'; // Rare: convenience cheaper than cooking
  }

  // Generate recommendation in Icelandic - emphasize NET extra cost
  let recommendation: string;
  const netMonthlyFormatted = Math.abs(netExtraCostMonthly).toLocaleString('is-IS', {
    maximumFractionDigits: 0,
  });
  const netYearlyFormatted = Math.abs(netExtraCostYearly).toLocaleString('is-IS', {
    maximumFractionDigits: 0,
  });
  const savedFormatted = savedHomeCookingMonthly.toLocaleString('is-IS', {
    maximumFractionDigits: 0,
  });

  if (netExtraCostMonthly > 1000) {
    recommendation = `Þægindamatur kostar þig ${netMonthlyFormatted} kr aukalega á mánuði (${netYearlyFormatted} kr á ári). Þetta er NETTÓ aukakostnaður - þú sparar ${savedFormatted} kr á mánuði með því að elda ekki þessar máltíðir heima.`;
  } else if (netExtraCostMonthly < -1000) {
    recommendation = `Með þínu tímakaupi er ${netMonthlyFormatted} kr ódýrara á mánuði að kaupa mat en elda hann heima. Tíminn sem fer í heimaeldun kostar meira en þægindamaturinn.`;
  } else {
    recommendation = 'Nettó aukakostnaður er lítill. Veldu eftir þægindaþáttum og tíma frekar en kostnaði.';
  }

  return {
    eatingOutSummary,
    homeCookingSummary,
    savedHomeCookingMonthly,
    savedHomeCookingYearly,
    netExtraCostMonthly,
    netExtraCostYearly,
    monthlyDifference,
    yearlyDifference,
    lifeEnergyDifference,
    percentageDifference,
    futureValue10Years,
    futureValue20Years,
    futureValue30Years,
    cheaperOption,
    recommendation,
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate convenience food data
 *
 * @param data - Convenience food data to validate
 * @returns True if valid, false otherwise
 */
export function isValidEatingOutData(data: EatingOutData): boolean {
  // Household size must be >= 1
  const validHouseholdSize = (data.householdSize || 1) >= 1;

  // All meal counts must be 0-21 (max 3 meals/day × 7 days)
  const validCounts =
    data.breakfastCount >= 0 &&
    data.breakfastCount <= 21 &&
    data.lunchCount >= 0 &&
    data.lunchCount <= 21 &&
    data.dinnerCount >= 0 &&
    data.dinnerCount <= 21 &&
    data.coffeeCount >= 0 &&
    data.fastFoodCount >= 0 &&
    data.fastFoodCount <= 21;

  // All costs must be > 0
  const validCosts =
    data.breakfastCost > 0 &&
    data.lunchCost > 0 &&
    data.dinnerCost > 0 &&
    data.coffeeCost > 0 &&
    data.fastFoodCost > 0;

  return validHouseholdSize && validCounts && validCosts;
}

/**
 * Validate home cooking data (new model)
 *
 * @param data - Home cooking data to validate
 * @returns True if valid, false otherwise
 */
export function isValidHomeCookingData(data: HomeCookingData): boolean {
  // Household size must be >= 1
  const validHouseholdSize = data.householdSize >= 1;

  // Baseline must be >= 0
  const validBaseline = data.monthlyBreakfastBaseline >= 0;

  // Lunch type must be valid and cost appropriate
  const validLunchType = ['free', 'subsidized', 'homePacked'].includes(data.lunchType);
  const validLunchCost =
    data.lunchType === 'free' ? true : data.lunchCostPerMeal >= 0;

  // Dinner cost must be > 0
  const validDinnerCost = data.dinnerCostPerMeal > 0;

  // Time must be >= 0
  const validTime =
    data.shoppingHoursPerWeek >= 0 && data.cookingHoursPerWeek >= 0;

  return (
    validHouseholdSize &&
    validBaseline &&
    validLunchType &&
    validLunchCost &&
    validDinnerCost &&
    validTime
  );
}
