/**
 * Constants and presets for the Meal Cost Calculator
 * Matarkostnaðarmælir - Icelandic meal cost analysis
 */

import type {
  EatingOutData,
  HomeCookingData,
  MealScenarioPreset,
} from '@/types/calculator';

/**
 * Time conversion constants
 */
export const WEEKS_PER_MONTH = 4.33; // Average weeks per month (52/12)
export const WEEKS_PER_YEAR = 52; // Weeks in a year
export const MONTHS_PER_YEAR = 12; // Months in a year

/**
 * Financial constants
 */
export const ANNUAL_RETURN_RATE = 0.07; // 7% annual return for FI projections

/**
 * Price preset options for Icelandic meal costs (2026 Reykjavík area)
 * Amounts in ISK
 */

export interface MealPricePreset {
  label: string;
  value: number;
}

/**
 * Breakfast price presets
 */
export const BREAKFAST_PRICE_PRESETS: MealPricePreset[] = [
  { label: 'Kaffihús morgunverður', value: 1500 },
  { label: 'Veitingahús morgunverður', value: 2500 },
  { label: 'Hótel morgunhlaðborð', value: 3500 },
];

/**
 * Lunch price presets
 */
export const LUNCH_PRICE_PRESETS: MealPricePreset[] = [
  { label: 'Skyndibitastaður', value: 1800 },
  { label: 'Góður skyndibitastaður', value: 2500 },
  { label: 'Veitingahús', value: 3500 },
  { label: 'Góður veitingahús', value: 4500 },
];

/**
 * Dinner price presets
 */
export const DINNER_PRICE_PRESETS: MealPricePreset[] = [
  { label: 'Skyndibitastaður', value: 2000 },
  { label: 'Venjulegur veitingahús', value: 4000 },
  { label: 'Góður veitingahús', value: 6000 },
  { label: 'Fínir veitingahús', value: 10000 },
];

/**
 * Coffee/beverage price presets
 */
export const COFFEE_PRICE_PRESETS: MealPricePreset[] = [
  { label: 'Bensínstöð kaffi', value: 400 },
  { label: 'Kaffihús espresso', value: 650 },
  { label: 'Kaffihús specialty', value: 1000 },
];

/**
 * Fast food price presets
 */
export const FAST_FOOD_PRICE_PRESETS: MealPricePreset[] = [
  { label: 'Lítil máltíð', value: 1500 },
  { label: 'Venjuleg máltíð', value: 2000 },
  { label: 'Stór máltíð', value: 2500 },
];

/**
 * All meal price presets grouped by category
 */
export const MEAL_PRICE_PRESETS = {
  breakfast: BREAKFAST_PRICE_PRESETS,
  lunch: LUNCH_PRICE_PRESETS,
  dinner: DINNER_PRICE_PRESETS,
  coffee: COFFEE_PRICE_PRESETS,
  fastFood: FAST_FOOD_PRICE_PRESETS,
} as const;

/**
 * Preset meal scenarios for quick comparison
 * Updated to use new HomeCookingData model with per-meal costs
 */
export const MEAL_SCENARIO_PRESETS: MealScenarioPreset[] = [
  {
    id: 'free-lunch-worker',
    name: 'Ókeypis hádegisverður í vinnu',
    description: 'Fær hádegisverð í vinnu, eldar kvöldmat heima, kaffi á leiðinni',
    eatingOut: {
      householdSize: 1,
      breakfastCount: 0,
      lunchCount: 0, // Free at work!
      dinnerCount: 1, // One dinner out per week
      coffeeCount: 5, // Daily café coffee
      fastFoodCount: 1,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 1,
      monthlyBreakfastBaseline: 60000, // Single person baseline
      lunchType: 'free',
      lunchCostPerMeal: 0,
      dinnerCostPerMeal: 2000,
      shoppingHoursPerWeek: 1.5,
      cookingHoursPerWeek: 5,
    },
  },
  {
    id: 'family-free-lunch',
    name: 'Fjölskylda - ókeypis hádegismatur',
    description: 'Foreldrar og börn fá hádegismat í vinnu/skóla',
    eatingOut: {
      householdSize: 4,
      breakfastCount: 0,
      lunchCount: 0, // All get free lunch
      dinnerCount: 2, // Weekend dinners out
      coffeeCount: 3, // Parents coffee
      fastFoodCount: 1,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 5000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 4,
      monthlyBreakfastBaseline: 100000, // Family of 4 breakfast + pantry
      lunchType: 'free',
      lunchCostPerMeal: 0,
      dinnerCostPerMeal: 5000, // Family dinner at home
      shoppingHoursPerWeek: 3,
      cookingHoursPerWeek: 10,
    },
  },
  {
    id: 'typical-worker-buys-lunch',
    name: 'Kaupir hádegisverð í vinnu',
    description: 'Kaupir hádegisverð daglega í stað þess að taka nesti',
    eatingOut: {
      householdSize: 1,
      breakfastCount: 0,
      lunchCount: 5, // Buying lunch every workday
      dinnerCount: 1,
      coffeeCount: 5,
      fastFoodCount: 1,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 1,
      monthlyBreakfastBaseline: 60000, // Single person baseline
      lunchType: 'homePacked',
      lunchCostPerMeal: 500, // Cost to pack lunch
      dinnerCostPerMeal: 2000,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 5,
    },
  },
  {
    id: 'family-weekends',
    name: 'Fjölskylda - úti um helgar',
    description: 'Fjölskylda (4 manns) borðar úti um helgar',
    eatingOut: {
      householdSize: 4,
      breakfastCount: 1, // Weekend brunch
      lunchCount: 0,
      dinnerCount: 2, // Friday + Saturday dinner out
      coffeeCount: 0,
      fastFoodCount: 1,
      breakfastCost: 2000,
      lunchCost: 2500,
      dinnerCost: 5000, // Per person
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 4,
      monthlyBreakfastBaseline: 100000, // Family of 4 baseline
      lunchType: 'free',
      lunchCostPerMeal: 0,
      dinnerCostPerMeal: 5000,
      shoppingHoursPerWeek: 3,
      cookingHoursPerWeek: 10,
    },
  },
  {
    id: 'eat-out-always',
    name: 'Þægindamatur alla daga',
    description: 'Allar máltíðir keyptar - hámarks þægindi, hámarks kostnaður',
    eatingOut: {
      householdSize: 1,
      breakfastCount: 7,
      lunchCount: 7,
      dinnerCount: 7,
      coffeeCount: 10,
      fastFoodCount: 0,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 1,
      monthlyBreakfastBaseline: 60000, // Still need baseline even if eating out
      lunchType: 'free',
      lunchCostPerMeal: 0,
      dinnerCostPerMeal: 2000,
      shoppingHoursPerWeek: 0.5,
      cookingHoursPerWeek: 0,
    },
  },
  {
    id: 'all-home-cooking',
    name: '100% heimaeldun',
    description: 'Allar máltíðir eldaðar heima - enginn þægindamatur',
    eatingOut: {
      householdSize: 2,
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      coffeeCount: 0,
      fastFoodCount: 0,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      householdSize: 2,
      monthlyBreakfastBaseline: 70000, // Couple baseline
      lunchType: 'homePacked',
      lunchCostPerMeal: 500,
      dinnerCostPerMeal: 3500,
      shoppingHoursPerWeek: 3,
      cookingHoursPerWeek: 12,
    },
  },
];

/**
 * Default values for convenience food data
 * Focus: meals bought instead of made at home
 */
export const DEFAULT_EATING_OUT_DATA: EatingOutData = {
  householdSize: 2, // Default to couple/small family
  breakfastCount: 0, // Most people eat breakfast at home
  lunchCount: 0, // Many have free/subsidized lunch at work - set separately
  dinnerCount: 2, // Weekend restaurant/takeout
  coffeeCount: 5, // Daily café coffee instead of home-brewed
  fastFoodCount: 1, // Weekly convenience snack
  breakfastCost: 1500,
  lunchCost: 2500,
  dinnerCost: 4000, // Per person
  coffeeCost: 650,
  fastFoodCost: 2000,
};

/**
 * Home cooking cost presets for dinner
 * Cost to cook ONE dinner for the whole household
 */
export const HOME_DINNER_COST_PRESETS: MealPricePreset[] = [
  { label: 'Einföld máltíð (1-2 manns)', value: 2000 },
  { label: 'Venjuleg máltíð (2-3 manns)', value: 3500 },
  { label: 'Fjölskylda (4 manns)', value: 5000 },
  { label: 'Stór fjölskylda (5+ manns)', value: 7000 },
];

/**
 * Default values for home cooking data
 *
 * Model:
 * - Baseline: Breakfast ingredients + pantry staples (always paid)
 * - Lunch: Free at work/school by default (very common in Iceland)
 * - Dinner: Per-meal cost that gets reduced when eating out
 */
export const DEFAULT_HOME_COOKING_DATA: HomeCookingData = {
  householdSize: 2,

  // Baseline (breakfast + pantry)
  monthlyBreakfastBaseline: 70000, // Couple: ~16000 kr/week for breakfast + basics

  // Lunch - default to free (work/school meals common in Iceland)
  lunchType: 'free',
  lunchCostPerMeal: 0, // Free at work/school

  // Dinner - cost to cook one dinner for the household
  dinnerCostPerMeal: 3500, // Average dinner for 2 people

  // Time
  shoppingHoursPerWeek: 2,
  cookingHoursPerWeek: 7,
};
