/**
 * TypeScript types for the Actual Hourly Wage Calculator
 * Based on "Your Money or Your Life" Chapter 2
 *
 * UI CONVENTION: All money inputs are entered/displayed as MONTHLY amounts.
 * The CalculatorContext converts monthly UI values to yearly for internal calculations.
 * Time inputs remain as weekly hours.
 */

/**
 * User's income inputs
 * NOTE: grossAnnualIncome is stored yearly internally, but UI shows monthly
 */
export interface IncomeInputs {
  grossAnnualIncome: number; // Stored yearly, UI shows monthly (divide by 12)
  workHoursPerWeek: number; // Standard work hours (default: 38 in Iceland)
  vacationDays: number; // Vacation days per year (default: 24 in Iceland)
  additionalIncome: number; // Stored yearly, UI shows monthly
}

/**
 * Work-related money expenses
 * NOTE: All values stored yearly internally, but UI shows monthly (divide by 12)
 */
export interface MoneyExpenses {
  commute: number; // Gas, transit, parking, tolls, wear (yearly stored, monthly displayed)
  clothing: number; // Work-specific clothing (yearly stored, monthly displayed)
  meals: number; // Lunches, coffee, snacks (yearly stored, monthly displayed)
  decompression: number; // "Retail therapy", unwinding costs (yearly stored, monthly displayed)
  childcareDelta: number; // Extra childcare due to work (yearly stored, monthly displayed)
  other: number; // Tools, dues, education, etc. (yearly stored, monthly displayed)
}

/**
 * Work-related time expenses (weekly hours)
 */
export interface TimeExpenses {
  commute: number; // Round-trip weekly total
  gettingReady: number; // Extra prep time for work
  decompression: number; // Time to "recover" from work
  workIllness: number; // Weekly average of sick time
}

/**
 * Complete calculator input state
 */
export interface CalculatorInputs {
  income: IncomeInputs;
  moneyExpenses: MoneyExpenses;
  timeExpenses: TimeExpenses;
}

/**
 * Calculation results
 */
export interface CalculationResults {
  nominalHourlyWage: number;
  actualHourlyWage: number;
  percentageReduction: number;

  netAnnualIncome: number;
  totalMoneyExpenses: number;

  baseWeeklyHours: number;
  totalWeeklyHours: number;
  totalExtraHours: number;

  annualLifeEnergyHours: number; // Total hours devoted to work per year

  // Breakdown for charts
  expenseBreakdown: ExpenseBreakdownItem[];
  timeBreakdown: TimeBreakdownItem[];
}

/**
 * Individual expense item for breakdown display
 */
export interface ExpenseBreakdownItem {
  category: string;
  label: string;
  amount: number;
  lifeEnergyHours: number; // Hours of life this costs
  percentage: number; // % of total expenses
}

/**
 * Individual time item for breakdown display
 */
export interface TimeBreakdownItem {
  category: string;
  label: string;
  hoursPerWeek: number;
  hoursPerYear: number;
  percentage: number; // % of total time
}

/**
 * Saved scenario for comparison
 */
export interface Scenario {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  results: CalculationResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Preset configuration
 */
export interface Preset {
  id: string;
  category: 'commute' | 'clothing' | 'meals';
  label: string;
  description: string;
  values: Partial<MoneyExpenses & TimeExpenses>;
}

/**
 * Complete app state stored in localStorage
 */
export interface StoredState {
  version: number; // For migration handling
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[]; // User's subscription list
  commuteScenarios: CommuteScenario[]; // User's commute scenarios (max 4)
  housingScenarios?: HousingScenario[]; // User's housing scenarios (max 4, optional for backwards compatibility)
  mealCostData?: MealCostData; // User's meal cost data (optional for backwards compatibility)
  periods?: Period[]; // Lifestyle inflation periods (optional for backwards compatibility)
  convenienceExpenses?: ConvenienceExpense[]; // Work convenience expenses (optional for backwards compatibility)
  convenienceGoal?: ConvenienceGoal; // Monthly goal for convenience spending (optional)
  carOwnershipScenarios?: import('./car-ownership').CarOwnershipScenario[]; // Car ownership scenarios (max 4, optional for backwards compatibility)
  childcareItems?: import('./childcare').ChildcareItem[]; // Childcare/education expense items (optional for backwards compatibility)
  savingsScenarios?: SavingsScenario[]; // Compound savings scenarios (max 3, optional for backwards compatibility)
  debtScenarios?: import('./debtPayoff').DebtPayoffScenario[]; // Debt payoff scenarios (max 3, optional for backwards compatibility)

  // Automatic Savings Impact data
  automaticSavingsInputs?: import('./savings').SavingsInputs; // User's automatic savings inputs (optional for backwards compatibility)

  // Savings Goal Tracker data
  savingsGoals?: import('./savingsGoal').SavingsGoal[]; // Savings goals (max 5 active, optional for backwards compatibility)
  automaticSavingsScenarios?: import('./savings').SavingsScenario[]; // Automatic savings scenarios for comparison (optional for backwards compatibility)

  // Emergency Fund Freedom Meter
  emergencyFundData?: import('./emergencyFund').EmergencyFundData; // Emergency fund data (optional for backwards compatibility)

  // Expense Baseline Tool
  expenseBaseline?: {
    categories: {
      id: string;
      name: string;
      icon: string;
      values: {
        barebones: number;
        comfortable: number;
        deluxe: number;
      };
      isCustom: boolean;
      isHidden: boolean;
      order: number;
    }[];
    lastUpdated: string;
    wizardCompleted: boolean;
    version: number;
  };

  // Current Expense Report
  currentExpenses?: {
    categories: {
      id: string;
      name: string;
      icon: string;
      lineItems: {
        id: string;
        label: string;
        amount: number;
        isRecurring: boolean;
        notes?: string;
      }[];
      isCustom: boolean;
      isHidden: boolean;
      order: number;
    }[];
    lastUpdated: string;
    version: number;
  };

  // Savings Report (Sparnaðarskýrsla)
  savingsReport?: {
    categories: {
      id: string;
      name: string;
      icon: string;
      description: string;
      order: number;
      data: {
        balance: number;
        monthlyContribution: number;
        targetAmount?: number;
        notes?: string;
      };
      isHidden: boolean;
    }[];
    lastUpdated: string;
    version: number;
  };

  // FatFIRE Planner (Lúxus FIRE Áætlun)
  fatFireState?: import('./fatFire').StoredFatFireState; // FatFIRE state (optional for backwards compatibility)

  // FI Number Builder (with string date for JSON serialization)
  fiNumberBuilder?: Omit<import('./fiNumber').FINumberBuilderState, 'lastUpdated'> & { lastUpdated: string };

  // LeanFIRE Planner (with string date for JSON serialization)
  leanFire?: Omit<import('./leanFire').LeanFireState, 'lastUpdated'> & { lastUpdated: string };

  // Barista FIRE Planner (with string date for JSON serialization)
  baristaFire?: Omit<import('./baristaFire').BaristaFireState, 'lastUpdated'> & { lastUpdated: string };

  // Coast FIRE Calculator
  coastFire?: import('./coastFire').CoastFIREState; // Coast FIRE state - lastUpdated is already string

  // FIRE Type Explorer (FIRE Leiðarvísir)
  fireTypePreferences?: import('./fireTypes').StoredFIRETypePreferences; // FIRE Type Explorer preferences (optional for backwards compatibility)

  // Retirement Date Simulator (Eftirlaunadagsetningarhermir)
  retirementSimulator?: import('./retirementSimulator').RetirementSimulatorState; // Retirement simulator state (optional for backwards compatibility)

  lastUpdated: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Preset category type
 */
export type PresetCategory = 'commute' | 'clothing' | 'meals';

/**
 * Subscription category for categorizing recurring expenses
 */
export type SubscriptionCategory =
  | 'streaming' // Streymi (Netflix, Spotify, etc.)
  | 'software' // Hugbúnaður (apps, cloud services)
  | 'fitness' // Líkamsrækt (gym, fitness apps)
  | 'news' // Fréttir (newspapers, magazines)
  | 'gaming' // Tölvuleikir (game subscriptions)
  | 'other'; // Annað

/**
 * Individual subscription entry
 */
export interface Subscription {
  id: string;
  name: string;
  monthlyCost: number; // Monthly cost in ISK
  category: SubscriptionCategory;
  isActive: boolean; // Whether currently paying for it
}

/**
 * Subscription summary calculations
 */
export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  lifeEnergyHoursPerMonth: number;
  lifeEnergyHoursPerYear: number;
  // FI impact (if invested at 7% return over 10 years)
  futureValueIn10Years: number;
  futureValueIn20Years: number;
  // Breakdown by category
  byCategory: {
    category: SubscriptionCategory;
    label: string;
    totalMonthly: number;
    count: number;
  }[];
}

// ============================================================================
// COMMUTE COST CALCULATOR TYPES
// ============================================================================

/**
 * Commute method type
 */
export type CommuteMethod = 'car' | 'transit' | 'bike' | 'walk' | 'remote';

/**
 * Icelandic labels for commute methods
 */
export const COMMUTE_METHOD_LABELS: Record<CommuteMethod, string> = {
  car: 'Bíll',
  transit: 'Almenningssamgöngur',
  bike: 'Hjólreiðar',
  walk: 'Ganga',
  remote: 'Fjarvinnu',
};

/**
 * Car-specific commute details
 */
export interface CarCommuteDetails {
  fuelType: 'gasoline' | 'diesel' | 'electric';
  fuelPrice: number; // kr/liter or kr/kWh
  fuelConsumption: number; // liters/100km or kWh/100km
  parkingCostPerDay: number; // ISK per work day
  tollsPerDay: number; // ISK per work day
  monthlyDepreciation: number; // ISK per month
  monthlyInsurance: number; // ISK per month
  monthlyMaintenance: number; // ISK per month
  inspectionCost: number; // ISK every 2 years
}

/**
 * Public transit commute details
 */
export interface TransitCommuteDetails {
  ticketType: 'monthly' | 'per_ride';
  monthlyCost?: number; // Required if ticketType === 'monthly'
  costPerRide?: number; // Required if ticketType === 'per_ride'
}

/**
 * Active commute details (bike/walk)
 */
export interface ActiveCommuteDetails {
  monthlyMaintenanceCost: number; // ISK per month
}

/**
 * Commute inputs (conditional based on method)
 */
export interface CommuteInputs {
  // Basic info (always required)
  distanceKm: number; // Distance one-way in km
  daysPerWeek: number; // Work days per week (1-7)
  commuteMethod: CommuteMethod;
  timeMinutesOneWay: number; // Time one-way in minutes

  // Method-specific details (conditional)
  car?: CarCommuteDetails;
  transit?: TransitCommuteDetails;
  active?: ActiveCommuteDetails;
}

/**
 * Cost breakdown item for charts
 */
export interface CommuteCostBreakdownItem {
  category: string; // e.g., "fuel", "depreciation", "insurance"
  label: string; // Display label in Icelandic
  monthlyCost: number; // ISK per month
  percentage: number; // % of total cost
}

/**
 * Commute calculation results
 */
export interface CommuteResults {
  // Cost breakdown
  directMonthlyCost: number; // Fuel/transit/maintenance costs
  indirectMonthlyCost: number; // Depreciation, insurance, etc. (car only)
  totalMonthlyCost: number; // Direct + indirect
  totalYearlyCost: number; // Monthly * 12

  // Cost breakdown details (for charts/display)
  costBreakdown: CommuteCostBreakdownItem[];

  // Time breakdown
  timePerMonthMinutes: number; // Total commute time per month
  timePerMonthHours: number; // timePerMonthMinutes / 60
  timePerYearHours: number; // timePerMonthHours * 12
  timePerYearDays: number; // timePerYearHours / 24

  // Life energy calculations
  lifeEnergyFromTime: number; // Hours of life energy from time spent
  lifeEnergyFromMoney: number; // Hours of life energy from money (cost / actualHourlyWage)
  totalLifeEnergyHoursPerMonth: number; // lifeEnergyFromTime + lifeEnergyFromMoney
  totalLifeEnergyHoursPerYear: number; // totalLifeEnergyHoursPerMonth * 12

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;
  futureValueAtRetirement?: number; // If user age is known
}

/**
 * Commute scenario (saved for comparison)
 */
export interface CommuteScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name (max 50 chars)
  inputs: CommuteInputs; // All input data
  results: CommuteResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current commute"
}

/**
 * Commute preset for quick setup
 */
export interface CommutePreset {
  id: string;
  category: 'car' | 'transit' | 'active' | 'remote';
  label: string; // e.g., "Kópavogur ↔ Reykjavík (10 km)"
  description: string; // Brief description
  inputs: CommuteInputs; // Pre-filled input values
}

// ============================================================================
// MEAL COST CALCULATOR TYPES
// ============================================================================

/**
 * Data for tracking convenience food expenses (meals bought instead of made at home)
 * All counts are weekly, costs are per person per item in ISK
 *
 * The focus is on the EXTRA cost of buying convenience food vs making it at home.
 * - Breakfast: coffee shop pastry vs homemade breakfast
 * - Lunch: bought lunch vs packed lunch from home
 * - Dinner: restaurant/takeout vs home-cooked meal
 * - Coffee: café coffee vs home-brewed
 * - Fast food: quick snacks/meals vs prepared snacks
 */
export interface EatingOutData {
  // Household size for multiplying costs
  householdSize: number; // Number of people eating convenience meals (>= 1)
  // Meal counts per week per person (0-21)
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  coffeeCount: number;
  fastFoodCount: number;
  // Average costs per item per person (in ISK)
  breakfastCost: number;
  lunchCost: number;
  dinnerCost: number;
  coffeeCost: number;
  fastFoodCost: number;
}

/**
 * Lunch situation type - many get free/subsidized lunch at work or school
 */
export type LunchType = 'free' | 'subsidized' | 'homePacked';

/**
 * Icelandic labels for lunch types
 */
export const LUNCH_TYPE_LABELS: Record<LunchType, string> = {
  free: 'Ókeypis (vinna/skóli)',
  subsidized: 'Niðurgreitt (vinna/skóli)',
  homePacked: 'Nesti að heiman',
};

/**
 * Data for tracking home cooking expenses and time
 *
 * Model:
 * - Baseline: Monthly cost for breakfast ingredients + pantry staples (always paid)
 * - Lunch: Can be free (work/school), subsidized, or home-packed
 * - Dinner: Per-meal cost for the household - REDUCED when eating out
 *
 * This allows calculating the NET extra cost of convenience food:
 * Net extra = Eating out cost - Saved home cooking cost
 */
export interface HomeCookingData {
  householdSize: number; // Number of people in household (>= 1)

  // Baseline costs (always incurred regardless of eating out)
  monthlyBreakfastBaseline: number; // Breakfast ingredients + pantry staples (ISK/month)

  // Lunch situation
  lunchType: LunchType;
  lunchCostPerMeal: number; // Cost per packed lunch if homePacked, or subsidized amount (ISK)

  // Dinner costs (reduced when eating out)
  dinnerCostPerMeal: number; // Cost to cook ONE dinner for the whole household (ISK)

  // Time costs
  shoppingHoursPerWeek: number; // Time spent shopping for groceries
  cookingHoursPerWeek: number; // Time spent cooking
}

/**
 * Complete meal cost data
 */
export interface MealCostData {
  eatingOut: EatingOutData;
  homeCooking: HomeCookingData;
}

/**
 * Summary of meal costs for a given time period
 */
export interface MealCostSummary {
  // Costs
  weeklyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  // Life energy (hours)
  weeklyLifeEnergy: number;
  monthlyLifeEnergy: number;
  yearlyLifeEnergy: number;
  // Breakdown items
  breakdown: MealCostBreakdownItem[];
}

/**
 * Individual breakdown item for meal cost categories
 */
export interface MealCostBreakdownItem {
  category: string; // breakfast, lunch, dinner, coffee, fastFood, groceries, shoppingTime, cookingTime
  label: string; // Icelandic label
  weeklyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  lifeEnergyHours: number; // Monthly life energy
  percentage: number; // % of total monthly cost
}

/**
 * Comparison results showing the NET EXTRA cost of convenience food
 *
 * Key insight: When you eat out, you SAVE on home cooking costs.
 * Net extra cost = Cost of eating out - Saved home cooking cost
 *
 * Example: 4 restaurant dinners at 14,000 kr = 56,000 kr
 *          But you save 4 home dinners at 5,000 kr = 20,000 kr
 *          Net extra cost = 36,000 kr
 */
export interface MealCostComparisonResults {
  // Summary of convenience food costs
  eatingOutSummary: MealCostSummary;
  // Summary of home cooking costs (baseline + remaining meals)
  homeCookingSummary: MealCostSummary;

  // Net extra cost analysis (the key insight!)
  savedHomeCookingMonthly: number; // Money saved by not cooking meals eaten out
  savedHomeCookingYearly: number;
  netExtraCostMonthly: number; // Eating out cost - Saved home cooking
  netExtraCostYearly: number;

  // Legacy fields for backward compatibility
  monthlyDifference: number;
  yearlyDifference: number;
  lifeEnergyDifference: number; // Monthly hours
  percentageDifference: number;

  // Future value projections (if net extra cost invested instead)
  futureValue10Years: number;
  futureValue20Years: number;
  futureValue30Years: number;

  // Analysis
  cheaperOption: 'eatingOut' | 'homeCooking' | 'similar';
  recommendation: string; // Icelandic recommendation text
}

/**
 * Preset scenario for meal cost comparisons
 */
export interface MealScenarioPreset {
  id: string;
  name: string; // Icelandic name
  description: string; // Icelandic description
  eatingOut: EatingOutData;
  homeCooking: HomeCookingData;
}

// ============================================================================
// LIFESTYLE INFLATION DETECTOR TYPES
// ============================================================================

/**
 * Spending category for lifestyle inflation tracking
 */
export type SpendingCategory =
  | 'housing'
  | 'food'
  | 'transportation'
  | 'subscriptions'
  | 'convenience'
  | 'clothing'
  | 'entertainment'
  | 'health'
  | 'other';

/**
 * Spending data by category (monthly amounts in ISK)
 */
export interface SpendingData {
  housing: number; // Húsnæði (leiga/veð, rafmagn, hiti)
  food: number; // Matur (matvörur, veitingastaðir)
  transportation: number; // Samgöngur (bensín, strætó, viðhald)
  subscriptions: number; // Áskriftir (streymi, hugbúnaður, líkamsrækt)
  convenience: number; // Þægindi (matur heim, skyndikaupur)
  clothing: number; // Fatnaður
  entertainment: number; // Skemmtun (kvikmyndir, tónleikar)
  health: number; // Heilsa (lyfseðlar, sjúkraþjálfun)
  other: number; // Annað
}

/**
 * A period (month or year) with spending data
 */
export interface Period {
  id: string; // Unique identifier
  name: string; // e.g., "Janúar 2024", "Árið 2023"
  month?: number; // 1-12, null if yearly
  year: number; // 2020-2030
  startDate: string; // ISO date
  endDate: string; // ISO date
  income: number; // Income for the period (ISK)
  spending: SpendingData; // Spending by category
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Inflation score levels
 */
export type InflationScore = 'healthy' | 'caution' | 'warning' | 'critical';

/**
 * Category change severity
 */
export type ChangeSeverity = 'decrease' | 'stable' | 'minor' | 'moderate' | 'major';

/**
 * Change in one spending category
 */
export interface CategoryChange {
  category: SpendingCategory;
  label: string; // Icelandic label
  oldAmount: number;
  newAmount: number;
  change: number; // Króna change
  changePercent: number; // Percentage change
  lifeEnergyHours: number; // Life energy cost of change (hours)
  severity: ChangeSeverity;
}

/**
 * FI impact of lifestyle inflation
 */
export interface FIImpact {
  increasedAnnualExpenses: number; // Increased annual spending
  increasedFITarget: number; // Increased FI need (× 25)
  fiDelayYears: number; // Delay in years
  fiDelayMonths: number; // Delay in months (total)
  lostFutureValue10Years: number; // Lost future value in 10 years
  lostFutureValue20Years: number; // Lost future value in 20 years
}

/**
 * Salary utilization (how raise is used)
 */
export interface SalaryUtilization {
  incomeIncrease: number; // Króna income increase
  expenseIncrease: number; // Króna expense increase
  savingsIncrease: number; // Króna savings increase
  utilizationPercent: number; // % of raise spent on lifestyle
  status: 'healthy' | 'acceptable' | 'concerning' | 'critical';
}

/**
 * Lifestyle inflation alert
 */
export interface InflationAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  category?: SpendingCategory; // null if overall warning
  message: string; // Main warning message
  detail: string; // More detailed explanation
  fiImpact: string; // FI impact in readable text
  suggestions: string[]; // Action suggestions
  canDismiss: boolean; // Whether can be dismissed
  dismissed: boolean; // Whether dismissed
}

/**
 * Analysis results for a period comparison
 */
export interface InflationAnalysis {
  currentPeriod: Period;
  comparisonPeriod: Period | null; // null if no previous period

  // Total spending
  totalSpendingChange: number; // Króna change
  totalSpendingChangePercent: number; // Percentage change

  // Income comparison
  incomeChange: number; // Króna change
  incomeChangePercent: number; // Percentage change

  // Lifestyle inflation
  lifestyleCreep: number; // % spending increase beyond income increase
  inflationScore: InflationScore; // 'healthy' | 'caution' | 'warning' | 'critical'

  // Category breakdown
  categoryChanges: CategoryChange[];
  quietUpgrades: CategoryChange[]; // Categories with small increases that add up

  // FI impact
  fiImpact: FIImpact;

  // Salary utilization
  salaryUtilization?: SalaryUtilization; // null if no income change

  // Alerts
  alerts: InflationAlert[];
}

// ============================================================================
// WORK CONVENIENCE EXPENSE TRACKER TYPES
// ============================================================================

/**
 * Category for convenience expenses (work exhaustion spending)
 */
export type ConvenienceCategory =
  | 'delivery' // Heimsending (Wolt, AHA, etc.)
  | 'taxi' // Leigubíll (Hreyfill, Bolt, etc.)
  | 'prepared' // Tilbúinn matur (10-11, Bónus, etc.)
  | 'restaurant' // Mathús
  | 'impulse' // Kaup í vinnu (impulse purchases)
  | 'other'; // Annað

/**
 * Individual convenience expense entry
 */
export interface ConvenienceExpense {
  id: string; // Unique identifier (auto-generated)
  amount: number; // Amount in ISK
  category: ConvenienceCategory; // Expense category
  date: string; // ISO date string
  isWorkday: boolean; // Whether this was a workday
  note?: string; // Optional note (max 200 chars)
}

/**
 * Summary of convenience expenses with calculations
 */
export interface ConvenienceExpenseSummary {
  totalWeekly: number; // Total cost last 7 days
  totalMonthly: number; // Total cost last 30 days
  totalAnnualized: number; // Annualized (monthly × 12)

  lifeEnergyWeekly: number; // Life energy hours per week
  lifeEnergyMonthly: number; // Life energy hours per month
  lifeEnergyAnnualized: number; // Life energy days per year

  workdayAverage: number; // Average spending on workdays
  weekendAverage: number; // Average spending on weekends
  workdayPremium: number; // Difference (workday - weekend)
  annualWorkdayPremium: number; // Annual impact of the difference

  byCategory: {
    category: ConvenienceCategory;
    label: string;
    total: number;
    count: number;
    percentage: number;
  }[];
}

/**
 * Monthly goal for convenience expenses
 */
export interface ConvenienceGoal {
  monthlyTarget: number; // Target in ISK/month
  startDate: string; // ISO date when goal starts
}

// ============================================================================
// HOUSING IMPACT CALCULATOR TYPES
// ============================================================================

/**
 * Housing type
 */
export type HousingType = 'rental' | 'owned_with_loan' | 'owned_paid_off';

/**
 * Loan type for Icelandic housing loans
 */
export type LoanType = 'indexed' | 'non_indexed';

/**
 * Icelandic labels for housing types
 */
export const HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  rental: 'Leiguhúsnæði',
  owned_with_loan: 'Eignarhúsnæði með láni',
  owned_paid_off: 'Eignarhúsnæði greitt upp',
};

/**
 * Icelandic labels for loan types
 */
export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  indexed: 'Verðtryggt lán',
  non_indexed: 'Óverðtryggt lán',
};

/**
 * Rental housing details
 */
export interface RentalDetails {
  monthlyRent: number; // ISK per month
  heatIncluded: boolean; // Whether heat is included in rent
  electricityIncluded: boolean; // Whether electricity is included in rent
  monthlyHeatCost: number; // ISK per month (0 if included)
  monthlyElectricityCost: number; // ISK per month (0 if included)
}

/**
 * Loan details for owned housing with mortgage
 */
export interface LoanDetails {
  loanType: LoanType; // indexed (verðtryggt) or non_indexed (óverðtryggt)
  totalLoanAmount: number; // ISK total loan amount
  annualInterestRate: number; // % annual interest rate
  loanTermYears: number; // Years (1-40)
  annualInflationRate?: number; // % annual inflation (required if indexed)

  // Ownership costs
  annualPropertyTax: number; // ISK per year (fasteignagjöld)
  annualHomeInsurance: number; // ISK per year (húseigendatrygging)
  annualMaintenanceCost: number; // ISK per year (viðhaldskostnaður)
  monthlyHOAFees: number; // ISK per month (félagsgjöld)
  monthlyHeatCost: number; // ISK per month
  monthlyElectricityCost: number; // ISK per month
}

/**
 * Owned paid off housing details
 */
export interface OwnedPaidOffDetails {
  estimatedPropertyValue?: number; // ISK (optional, for opportunity cost calculation)
  annualPropertyTax: number; // ISK per year
  annualHomeInsurance: number; // ISK per year
  annualMaintenanceCost: number; // ISK per year
  monthlyHOAFees: number; // ISK per month
  monthlyHeatCost: number; // ISK per month
  monthlyElectricityCost: number; // ISK per month
}

/**
 * Housing inputs (conditional based on housingType)
 */
export interface HousingInputs {
  housingType: HousingType;

  // Conditional details based on housing type
  rental?: RentalDetails;
  loan?: LoanDetails;
  ownedPaidOff?: OwnedPaidOffDetails;
}

/**
 * Loan calculation info (for owned_with_loan)
 */
export interface LoanInfo {
  monthlyPayment: number; // Monthly loan payment
  totalPaymentsOverLife: number; // Total amount paid over loan life
  totalInterestPaid: number; // Total interest paid
  interestPercentage: number; // Interest as % of total payments
}

/**
 * Housing calculation results
 */
export interface HousingResults {
  // Cost breakdown
  monthlyHousingPayment: number; // Rent or loan payment
  monthlyPropertyTax: number; // annualPropertyTax / 12
  monthlyInsurance: number; // annualHomeInsurance / 12
  monthlyMaintenance: number; // annualMaintenanceCost / 12
  monthlyHOAFees: number;
  monthlyHeatCost: number;
  monthlyElectricityCost: number;
  totalMonthlyCost: number; // Sum of all above
  totalYearlyCost: number; // totalMonthlyCost * 12

  // Loan-specific (only if housingType === 'owned_with_loan')
  loanInfo?: LoanInfo;

  // Life energy calculations
  lifeEnergyMonthlyHours: number; // totalMonthlyCost / actualHourlyWage
  lifeEnergyYearlyHours: number; // lifeEnergyMonthlyHours * 12
  lifeEnergyYearlyDays: number; // lifeEnergyYearlyHours / 24
  lifeEnergyYearlyWorkDays: number; // lifeEnergyYearlyHours / 8
  lifeEnergyYearlyWorkWeeks: number; // lifeEnergyYearlyHours / 40

  // FI Impact (future value if invested instead at 7% annual return)
  futureValue5Years: number;
  futureValue10Years: number;
  futureValue20Years: number;

  // Opportunity cost (only if owned_paid_off with estimatedPropertyValue)
  monthlyOpportunityCost?: number; // (estimatedPropertyValue * 0.07) / 12
}

/**
 * Housing scenario (saved for comparison)
 */
export interface HousingScenario {
  id: string; // Auto-generated unique ID
  name: string; // User-defined name (max 50 chars)
  inputs: HousingInputs; // All input data
  results: HousingResults; // Calculated results
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  isCurrent?: boolean; // Optional flag to mark "current housing"
}

// ============================================================================
// JOB PROFIT/LOSS SCORECARD TYPES
// ============================================================================

/**
 * Profitability grade based on percentage reduction from gross to actual hourly wage
 */
export type ProfitabilityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Complete profitability assessment for a job
 *
 * The "invisible hours" concept:
 * - You invest X hours/week (work + commute + extra time)
 * - Your net income (after work expenses) equals Y hours at your nominal rate
 * - The gap (X - Y) = "invisible hours" lost to costs and unpaid time
 */
export interface ProfitabilityAssessment {
  grade: ProfitabilityGrade; // Letter grade (A-F)
  percentageReduction: number; // Percentage reduction from nominal to actual wage

  // Invisible hours calculation
  totalHoursInvested: number; // Total weekly hours (work + commute + extra)
  equivalentHoursAtNominal: number; // Hours needed at nominal rate to earn net income
  invisibleHours: number; // Gap: totalHoursInvested - equivalentHoursAtNominal

  // Monthly equivalents
  totalHoursInvestedMonthly: number;
  equivalentHoursAtNominalMonthly: number;
  invisibleHoursMonthly: number;

  gradeLabel: string; // Icelandic label for grade
  gradeExplanation: string; // Icelandic explanation for grade
  isProfit: boolean; // Whether net income is positive
  severity: 'success' | 'warning' | 'error'; // Color coding severity
}

// ============================================================================
// COMPOUND SAVINGS LIFE ENERGY CALCULATOR TYPES
// ============================================================================

/**
 * Compound savings calculator inputs
 */
export interface SavingsInputs {
  monthlySavings: number; // ISK per month (1,000 - 1,000,000)
  annualInterestRate: number; // Percentage (0.00 - 20.00)
  timeHorizonYears: number; // Years (1 - 50)
}

/**
 * Compound savings calculation results
 */
export interface SavingsResults {
  futureValue: number; // Total ISK after time horizon
  totalContributions: number; // Sum of all monthly savings
  totalInterestEarned: number; // futureValue - totalContributions
  futureValueLifeEnergy: number; // Hours
  interestEarnedLifeEnergy: number; // Hours (key insight!)
  yearlyBreakdown: YearlySavingsData[];
}

/**
 * Year-by-year savings data for visualization
 */
export interface YearlySavingsData {
  year: number;
  totalValue: number; // Accumulated value (principal + interest)
  totalContributions: number; // Accumulated contributions only
  yearlyInterest: number; // Interest earned this year
  lifeEnergyHours: number; // Total value in life energy
}

/**
 * Saved savings scenario
 */
export interface SavingsScenario {
  id: string;
  name: string;
  inputs: SavingsInputs;
  results: SavingsResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Icelandic savings presets
 */
export interface SavingsPreset {
  id: 'verdtryggt' | 'venjulegur' | 'havaxtasparnadur';
  label: string;
  rate: number;
  description: string;
}
