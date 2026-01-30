'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import type {
  CalculatorInputs,
  CalculationResults,
  IncomeInputs,
  MoneyExpenses,
  TimeExpenses,
  Scenario,
  Preset,
  StoredState,
  Subscription,
  SubscriptionSummary,
  MealCostData,
  EatingOutData,
  HomeCookingData,
  MealCostComparisonResults,
  CommuteScenario,
  CommuteInputs,
  ConvenienceExpense,
  ConvenienceExpenseSummary,
  ConvenienceGoal,
  HousingScenario,
  HousingInputs,
  Period,
} from '@/types/calculator';
import {
  calculateSubscriptionSummary,
  generateSubscriptionId,
} from '@/lib/calculations/subscriptions';
import {
  calculateEatingOutSummary,
  calculateHomeCookingSummary,
  compareEatingOutVsHome,
} from '@/lib/calculations/mealCost';
import {
  calculateCommuteResults,
  generateCommuteId,
} from '@/lib/calculations/commute';
import {
  calculateExpenseSummary,
  generateExpenseId,
} from '@/lib/calculations/convenienceExpenses';
import {
  DEFAULT_EATING_OUT_DATA,
  DEFAULT_HOME_COOKING_DATA,
} from '@/lib/constants/mealCost';
import { DEFAULT_INPUTS, STORAGE_KEY, STORAGE_VERSION } from '@/lib/defaults';
import { calculateResults } from '@/lib/calculations';
import { safeGetItem, safeSetItem } from '@/lib/storage/localStorage';
import type {
  ChildcareItem,
  ChildcareSummary,
} from '@/types/childcare';
import {
  calculateChildcareSummary,
  generateChildcareId,
} from '@/lib/calculations/childcare';
import {
  calculateHousingResults,
  generateHousingId,
} from '@/lib/calculations/housing';
import { generatePeriodId } from '@/lib/utils/periodHelpers';
import type {
  CarOwnershipScenario,
} from '@/types/car-ownership';
import {
  calculateCarOwnershipResults,
  generateCarOwnershipId,
} from '@/lib/calculations/car';
import type {
  EmergencyFundData,
  EmergencyFundResults,
} from '@/types/emergencyFund';
import { calculateEmergencyFundResults } from '@/lib/calculations/emergencyFund';
import type {
  ExpenseBaseline,
  ExpenseBaselineResults,
  ExpenseTier,
  TierValues,
  ExpenseCategory,
} from '@/types/expenseBaseline';
import {
  calculateExpenseBaselineResults,
  getExpenseByTier as getExpenseByTierHelper,
  hasExpenseBaseline as hasExpenseBaselineHelper,
} from '@/lib/calculations/expenseBaseline';
import type {
  CurrentExpenseReport,
  CurrentExpenseResults,
  LineItem,
  ExpenseCategory as CurrentExpenseCategory,
} from '@/types/currentExpenses';
import {
  calculateCurrentExpenseResults,
  extractSubscriptions,
  extractCommuteExpenses,
  extractHousingExpenses,
  extractCategoryExpenses,
} from '@/lib/calculations/currentExpenses';
import type {
  SavingsReport,
  SavingsReportResults,
  SavingsCategoryData,
} from '@/types/savingsReport';
import { calculateSavingsReportResults } from '@/lib/calculations/savingsReport';
import { DEFAULT_SAVINGS_CATEGORIES } from '@/lib/constants/savingsReport';
import type {
  FatFireState,
  StoredFatFireState,
  WishListItem,
  StoredWishListItem,
  FatFireScenario,
  FatFireResults,
} from '@/types/fatFire';
import { calculateFatFireResults } from '@/lib/calculations/fatFire';
import { FATFIRE_DEFAULTS } from '@/lib/constants/fatFire';
import type {
  FINumberBuilderState,
  FINumberResults,
  ExpenseSource,
} from '@/types/fiNumber';
import { calculateFINumberResults } from '@/lib/calculations/fiNumber';
import { FI_NUMBER_DEFAULTS } from '@/lib/constants/fiNumber';
import type {
  BaristaFireState,
  BaristaFireResults,
  BaristaFireScenario,
} from '@/types/baristaFire';
import { calculateBaristaFireResults } from '@/lib/calculations/baristaFire';
import { BARISTA_FIRE_DEFAULTS } from '@/lib/constants/baristaFire';
import type {
  LeanFireState,
  LeanFireResults,
  GeographicLocation,
  FIMultiplier,
  ReductionScenario,
} from '@/types/leanFire';
import { calculateLeanFireResults } from '@/lib/calculations/leanFire';
import {
  LEANFIRE_DEFAULTS,
  DEFAULT_BAREBONES_REYKJAVIK,
  getDefaultBarebonesExpenses,
} from '@/lib/constants/leanFire';
import type {
  FIRETypePreferences,
  StoredFIRETypePreferences,
  FIRETypeId,
  FIREAssumptions,
} from '@/types/fireTypes';
import { DEFAULT_FIRE_ASSUMPTIONS } from '@/types/fireTypes';
import type {
  CoastFIREState,
  CoastFIREResult,
  FINumberSource,
} from '@/types/coastFire';
import { calculateCoastFIREResult } from '@/lib/calculations/coastFire';
import { COAST_FIRE_DEFAULTS } from '@/lib/constants/coastFire';
import type {
  RetirementSimulatorState,
  RetirementSimulation,
  SimulationResults,
  ComparisonScenario,
  WithdrawalStrategy,
  PortfolioInput,
  ExpenseInput,
  IcelandicPensionInput,
} from '@/types/retirementSimulator';

/**
 * Context type for calculator state management
 */
interface CalculatorContextType {
  // Current inputs
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
  updateIncome: (income: Partial<IncomeInputs>) => void;
  updateMoneyExpenses: (expenses: Partial<MoneyExpenses>) => void;
  updateTimeExpenses: (time: Partial<TimeExpenses>) => void;

  // Calculation results (derived from inputs)
  results: CalculationResults | null;

  // Scenarios
  scenarios: Scenario[];
  saveCurrentAsScenario: (name: string) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;

  // Subscriptions
  subscriptions: Subscription[];
  subscriptionSummary: SubscriptionSummary | null;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscription: (id: string) => void;

  // Meal Cost Calculator
  mealCostData: MealCostData;
  updateMealCostData: (data: Partial<MealCostData>) => void;
  updateEatingOut: (data: Partial<EatingOutData>) => void;
  updateHomeCooking: (data: Partial<HomeCookingData>) => void;
  mealCostSummary: MealCostComparisonResults | null;

  // Commute Cost Calculator
  commuteScenarios: CommuteScenario[];
  addCommuteScenario: (scenario: Omit<CommuteScenario, 'id' | 'results'>) => void;
  updateCommuteScenario: (
    id: string,
    updates: Partial<Omit<CommuteScenario, 'id' | 'results'>>
  ) => void;
  deleteCommuteScenario: (id: string) => void;
  duplicateCommuteScenario: (id: string) => void;

  // Convenience Expense Tracker
  convenienceExpenses: ConvenienceExpense[];
  expenseSummary: ConvenienceExpenseSummary | null;
  convenienceGoal: ConvenienceGoal | null;
  addConvenienceExpense: (expense: Omit<ConvenienceExpense, 'id'>) => void;
  updateConvenienceExpense: (id: string, updates: Partial<ConvenienceExpense>) => void;
  deleteConvenienceExpense: (id: string) => void;
  setConvenienceGoal: (goal: ConvenienceGoal) => void;
  deleteConvenienceGoal: () => void;

  // Childcare & Education Calculator
  childcareItems: ChildcareItem[];
  childcareSummary: ChildcareSummary | null;
  addChildcareItem: (item: Omit<ChildcareItem, 'id'>) => void;
  updateChildcareItem: (id: string, updates: Partial<ChildcareItem>) => void;
  deleteChildcareItem: (id: string) => void;

  // Housing Impact Calculator
  housingScenarios: HousingScenario[];
  addHousingScenario: (scenario: Omit<HousingScenario, 'id' | 'results'>) => void;
  updateHousingScenario: (
    id: string,
    updates: Partial<Omit<HousingScenario, 'id' | 'results'>>
  ) => void;
  deleteHousingScenario: (id: string) => void;
  duplicateHousingScenario: (id: string) => void;

  // Lifestyle Inflation Detector
  periods: Period[];
  addPeriod: (period: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePeriod: (id: string, updates: Partial<Period>) => void;
  deletePeriod: (id: string) => void;

  // Car Ownership Calculator
  carOwnershipScenarios: CarOwnershipScenario[];
  addCarOwnershipScenario: (scenario: Omit<CarOwnershipScenario, 'id' | 'results'>) => void;
  updateCarOwnershipScenario: (
    id: string,
    updates: Partial<Omit<CarOwnershipScenario, 'id' | 'results'>>
  ) => void;
  deleteCarOwnershipScenario: (id: string) => void;
  duplicateCarOwnershipScenario: (id: string) => void;

  // Emergency Fund Freedom Meter
  emergencyFundData: EmergencyFundData | null;
  emergencyFundResults: EmergencyFundResults | null;
  updateEmergencyFundData: (data: Partial<EmergencyFundData>) => void;
  clearEmergencyFundData: () => void;

  // Expense Baseline Tool
  expenseBaseline: ExpenseBaseline | null;
  expenseBaselineResults: ExpenseBaselineResults | null;
  updateExpenseBaseline: (baseline: Partial<ExpenseBaseline>) => void;
  updateCategoryValues: (categoryId: string, values: Partial<TierValues>) => void;
  addCustomCategory: (name: string, icon: string, values: TierValues) => void;
  removeCategory: (categoryId: string) => void;
  toggleCategoryVisibility: (categoryId: string) => void;
  resetExpenseBaselineToDefaults: () => void;
  clearExpenseBaseline: () => void;
  getExpenseBaseline: () => ExpenseBaseline | null;
  getExpenseByTier: (tier: ExpenseTier) => number;
  hasExpenseBaseline: () => boolean;

  // Current Expense Report
  currentExpenses: CurrentExpenseReport | null;
  currentExpenseResults: CurrentExpenseResults | null;
  updateCurrentExpenses: (expenses: Partial<CurrentExpenseReport>) => void;
  addCurrentExpenseLineItem: (categoryId: string, lineItem: Omit<LineItem, 'id'>) => void;
  updateCurrentExpenseLineItem: (categoryId: string, lineItemId: string, updates: Partial<LineItem>) => void;
  deleteCurrentExpenseLineItem: (categoryId: string, lineItemId: string) => void;
  addCurrentExpenseCategory: (category: Omit<CurrentExpenseCategory, 'id' | 'lineItems'>) => void;
  removeCurrentExpenseCategory: (categoryId: string) => void;
  toggleCurrentExpenseCategoryVisibility: (categoryId: string) => void;
  clearCurrentExpenses: () => void;
  // Integration API
  getCurrentExpenses: () => CurrentExpenseReport | null;
  getExpensesByCategory: (categoryId: string) => CurrentExpenseCategory | null;
  getSubscriptions: () => LineItem[];
  getCommuteExpenses: () => number;
  getHousingExpenses: () => number;
  hasCurrentExpenses: () => boolean;

  // Savings Report
  savingsReport: SavingsReport | null;
  savingsReportResults: SavingsReportResults | null;
  updateSavingsReport: (report: Partial<SavingsReport>) => void;
  updateSavingsCategory: (categoryId: string, data: Partial<SavingsCategoryData>) => void;
  toggleSavingsCategoryVisibility: (categoryId: string) => void;
  clearSavingsReport: () => void;
  initializeSavingsReport: () => void;
  // Integration API
  getSavingsReport: () => SavingsReport | null;
  getTotalSavings: () => number;
  getTotalMonthlyContribution: () => number;
  getSavingsRate: () => number | null;
  hasSavingsReport: () => boolean;

  // FatFIRE Planner
  fatFireState: FatFireState | null;
  fatFireResults: FatFireResults | null;
  updateFatFireState: (updates: Partial<FatFireState>) => void;
  addWishListItem: (item: Omit<WishListItem, 'id' | 'createdAt'>) => void;
  updateWishListItem: (id: string, updates: Partial<Omit<WishListItem, 'id' | 'createdAt'>>) => void;
  removeWishListItem: (id: string) => void;
  setSplurgeBudget: (amount: number) => void;
  addScenario: (scenario: Omit<FatFireScenario, 'id'>) => void;
  removeScenario: (id: string) => void;
  clearFatFireState: () => void;
  initializeFatFireState: () => void;
  // Integration API
  getFatFireState: () => FatFireState | null;

  // FI Number Builder
  fiNumberBuilder: FINumberBuilderState | null;
  fiNumberResults: FINumberResults | null;
  updateFINumberState: (state: Partial<FINumberBuilderState>) => void;
  setExpenseSource: (source: ExpenseSource, tier?: ExpenseTier) => void;
  setSelectedTier: (tier: ExpenseTier) => void;
  setCustomMonthlyExpense: (amount: number) => void;
  setMultiplier: (multiplier: number) => void;
  setPensionIncome: (amount: number | null, retirementAge?: number | null) => void;
  setTargetRetirementAge: (age: number | null) => void;
  setOccupationalPension: (amount: number | null) => void;
  setSereignBalance: (amount: number | null) => void;
  clearFINumberBuilder: () => void;
  initializeFINumberBuilder: () => void;
  // Integration API
  getFINumberBuilder: () => FINumberBuilderState | null;
  hasFINumber: () => boolean;
  hasFatFireState: () => boolean;

  // Barista FIRE Planner
  baristaFireState: BaristaFireState | null;
  baristaFireResults: BaristaFireResults | null;
  updateBaristaFireState: (state: Partial<BaristaFireState>) => void;
  setFINumber: (amount: number) => void;
  setCurrentSavings: (amount: number) => void;
  addBaristaFireScenario: (scenario: Omit<BaristaFireScenario, 'id' | 'order'>) => void;
  removeBaristaFireScenario: (id: string) => void;
  updateBaristaFireScenario: (id: string, updates: Partial<BaristaFireScenario>) => void;
  clearBaristaFireState: () => void;
  initializeBaristaFireState: () => void;
  // Integration API
  getBaristaFireState: () => BaristaFireState | null;
  hasBaristaFireState: () => boolean;

  // LeanFIRE Planner
  leanFire: LeanFireState | null;
  leanFireResults: LeanFireResults | null;
  updateLeanFireState: (state: Partial<LeanFireState>) => void;
  setSelectedLocation: (location: GeographicLocation) => void;
  setFIMultiplier: (multiplier: FIMultiplier) => void;
  addReductionScenario: (scenario: Omit<ReductionScenario, 'id' | 'order'>) => void;
  removeReductionScenario: (id: string) => void;
  updateReductionScenario: (id: string, updates: Partial<ReductionScenario>) => void;
  toggleFrugalityTip: (tipId: string) => void;
  clearLeanFire: () => void;
  initializeLeanFire: () => void;
  // Integration API
  getLeanFireState: () => LeanFireState | null;
  hasLeanFire: () => boolean;

  // FIRE Type Explorer (FIRE Leiðarvísir)
  fireTypePreferences: FIRETypePreferences | null;
  updateFIRETypePreferences: (prefs: Partial<FIRETypePreferences>) => void;
  setSelectedType: (type: FIRETypeId | null) => void;
  setCustomAssumptions: (assumptions: Partial<FIREAssumptions>) => void;
  updateFIREAssumptions: (assumptions: Partial<FIREAssumptions>) => void;
  selectFIREType: (type: FIRETypeId) => void;
  resetFIREAssumptions: () => void;
  toggleShowAllTypes: () => void;
  toggleExpandedSection: (sectionId: string) => void;
  clearFIRETypePreferences: () => void;
  initializeFIRETypePreferences: () => void;
  // Integration API
  getFIRETypePreferences: () => FIRETypePreferences | null;
  hasFIRETypePreferences: () => boolean;

  // Coast FIRE Calculator (Ró FIRE Reiknivél)
  coastFireState: CoastFIREState | null;
  coastFireResults: CoastFIREResult | null;
  updateCoastFireState: (state: Partial<CoastFIREState>) => void;
  setCoastCurrentAge: (age: number) => void;
  setCoastCurrentInvestments: (amount: number) => void;
  setCoastTargetRetirementAge: (age: number) => void;
  setCoastExpectedReturn: (rate: number) => void;
  setCoastFINumber: (amount: number | null) => void;
  setCoastFINumberSource: (source: FINumberSource) => void;
  setCoastSelectedTier: (tier: ExpenseTier | null) => void;
  setCoastFIMultiplier: (multiplier: number) => void;
  clearCoastFireState: () => void;
  initializeCoastFireState: () => void;
  // Integration API
  getCoastFireState: () => CoastFIREState | null;
  hasCoastFireState: () => boolean;

  // Retirement Date Simulator (Eftirlaunadagsetningarhermir)
  retirementSimulator: RetirementSimulatorState | null;
  updateRetirementSimulator: (updates: Partial<RetirementSimulation>) => void;
  setRetirementDate: (date: Date) => void;
  setCurrentAge: (age: number) => void;
  setLifeExpectancy: (age: number) => void;
  updatePortfolio: (portfolio: Partial<PortfolioInput>) => void;
  updateExpenses: (expenses: Partial<ExpenseInput>) => void;
  updatePensions: (pensions: Partial<IcelandicPensionInput>) => void;
  setWithdrawalStrategy: (strategy: WithdrawalStrategy) => void;
  addComparisonScenario: (scenario: ComparisonScenario) => void;
  removeComparisonScenario: (id: string) => void;
  clearRetirementSimulator: () => void;
  // Integration API
  getRetirementSimulator: () => RetirementSimulatorState | null;
  hasRetirementSimulator: () => boolean;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetAll: () => void;

  // Presets
  applyPreset: (preset: Preset) => void;

  // Status
  isHydrated: boolean;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

/**
 * Calculator Provider Component
 *
 * Provides calculator state management to all child components.
 * Handles automatic calculation, persistence, and scenario management.
 */
export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [mealCostData, setMealCostData] = useState<MealCostData>({
    eatingOut: DEFAULT_EATING_OUT_DATA,
    homeCooking: DEFAULT_HOME_COOKING_DATA,
  });
  const [commuteScenarios, setCommuteScenarios] = useState<CommuteScenario[]>([]);
  const [convenienceExpenses, setConvenienceExpenses] = useState<ConvenienceExpense[]>([]);
  const [convenienceGoal, setConvenienceGoalState] = useState<ConvenienceGoal | null>(null);
  const [childcareItems, setChildcareItems] = useState<ChildcareItem[]>([]);
  const [housingScenarios, setHousingScenarios] = useState<HousingScenario[]>([]);
  const [periods, setPeriodsState] = useState<Period[]>([]);
  const [carOwnershipScenarios, setCarOwnershipScenarios] = useState<CarOwnershipScenario[]>([]);
  const [emergencyFundData, setEmergencyFundData] = useState<EmergencyFundData | null>(null);
  const [expenseBaseline, setExpenseBaseline] = useState<ExpenseBaseline | null>(null);
  const [currentExpenses, setCurrentExpenses] = useState<CurrentExpenseReport | null>(null);
  const [savingsReport, setSavingsReport] = useState<SavingsReport | null>(null);
  const [fatFireState, setFatFireState] = useState<FatFireState | null>(null);
  const [fiNumberBuilder, setFINumberBuilder] = useState<FINumberBuilderState | null>(null);
  const [baristaFireState, setBaristaFireState] = useState<BaristaFireState | null>(null);
  const [leanFire, setLeanFire] = useState<LeanFireState | null>(null);
  const [fireTypePreferences, setFireTypePreferences] = useState<FIRETypePreferences | null>(null);
  const [coastFireState, setCoastFireState] = useState<CoastFIREState | null>(null);
  const [retirementSimulator, setRetirementSimulator] = useState<RetirementSimulatorState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Calculate results whenever inputs change
  const results = useMemo(() => {
    // Only calculate if we have valid income data
    if (inputs.income.grossAnnualIncome <= 0) return null;
    return calculateResults(inputs);
  }, [inputs]);

  // Calculate subscription summary whenever subscriptions or actual wage changes
  const subscriptionSummary = useMemo(() => {
    const actualHourlyWage = results?.actualHourlyWage ?? 0;
    return calculateSubscriptionSummary(subscriptions, actualHourlyWage);
  }, [subscriptions, results?.actualHourlyWage]);

  // Calculate meal cost summary whenever mealCostData or actual wage changes
  const mealCostSummary = useMemo(() => {
    const actualHourlyWage = results?.actualHourlyWage ?? 0;

    // If no wage, we can still calculate costs but not life energy
    // The comparison function handles wage = 0 gracefully
    try {
      return compareEatingOutVsHome(
        mealCostData.eatingOut,
        mealCostData.homeCooking,
        actualHourlyWage
      );
    } catch (error) {
      console.error('Error calculating meal cost summary:', error);
      return null;
    }
  }, [mealCostData, results?.actualHourlyWage]);

  // Calculate convenience expense summary whenever expenses or actual wage changes
  const expenseSummary = useMemo(() => {
    const actualHourlyWage = results?.actualHourlyWage ?? 0;
    if (!actualHourlyWage || convenienceExpenses.length === 0) return null;
    return calculateExpenseSummary(convenienceExpenses, actualHourlyWage);
  }, [convenienceExpenses, results?.actualHourlyWage]);

  // Calculate childcare summary whenever childcare items or actual wage changes
  const childcareSummary = useMemo(() => {
    const actualHourlyWage = results?.actualHourlyWage ?? 0;
    // We can calculate even without wage (life energy will be 0)
    return calculateChildcareSummary(childcareItems, actualHourlyWage);
  }, [childcareItems, results?.actualHourlyWage]);

  // Calculate emergency fund results whenever emergency fund data or actual wage changes
  const emergencyFundResults = useMemo(() => {
    if (!emergencyFundData) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateEmergencyFundResults(emergencyFundData, actualHourlyWage);
    } catch (error) {
      console.error('Error calculating emergency fund results:', error);
      return null;
    }
  }, [emergencyFundData, results?.actualHourlyWage]);

  // Calculate expense baseline results whenever expense baseline or actual wage changes
  const expenseBaselineResults = useMemo(() => {
    if (!expenseBaseline) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateExpenseBaselineResults(expenseBaseline, actualHourlyWage);
    } catch (error) {
      console.error('Error calculating expense baseline results:', error);
      return null;
    }
  }, [expenseBaseline, results?.actualHourlyWage]);

  // Calculate current expense results whenever current expenses or actual wage changes
  const currentExpenseResults = useMemo(() => {
    if (!currentExpenses) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateCurrentExpenseResults(
        currentExpenses,
        actualHourlyWage,
        expenseBaseline
      );
    } catch (error) {
      console.error('Error calculating current expense results:', error);
      return null;
    }
  }, [currentExpenses, results?.actualHourlyWage, expenseBaseline]);

  // Calculate savings report results whenever savingsReport, actualHourlyWage, or grossMonthlyIncome changes
  const savingsReportResults = useMemo(() => {
    if (!savingsReport) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;
    // Use gross annual income (pre-tax) for savings rate calculation to be consistent
    // with how the Sparnaðarhlutfallsmælir calculates savings rate
    const grossMonthlyIncome = inputs.income.grossAnnualIncome > 0
      ? inputs.income.grossAnnualIncome / 12
      : null;

    try {
      return calculateSavingsReportResults(
        savingsReport,
        actualHourlyWage,
        grossMonthlyIncome
      );
    } catch (error) {
      console.error('Error calculating savings report results:', error);
      return null;
    }
  }, [savingsReport, results?.actualHourlyWage, inputs.income.grossAnnualIncome]);

  // Calculate FatFIRE results whenever state or actual wage changes
  const fatFireResults = useMemo(() => {
    if (!fatFireState) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateFatFireResults(
        fatFireState,
        actualHourlyWage
      );
    } catch (error) {
      console.error('Error calculating FatFIRE results:', error);
      return null;
    }
  }, [fatFireState, results?.actualHourlyWage]);

  // Calculate FI Number results whenever state or dependencies change
  const fiNumberResults = useMemo(() => {
    if (!fiNumberBuilder) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;
    const annualNetIncome = results?.netAnnualIncome ?? null;
    const annualHours = results?.annualLifeEnergyHours ?? null;

    try {
      return calculateFINumberResults(
        fiNumberBuilder,
        expenseBaseline,
        actualHourlyWage,
        annualHours
      );
    } catch (error) {
      console.error('Error calculating FI Number results:', error);
      return null;
    }
  }, [fiNumberBuilder, expenseBaseline, results?.actualHourlyWage, results?.annualLifeEnergyHours]);

  // Calculate Barista FIRE results whenever state or dependencies change
  const baristaFireResults = useMemo(() => {
    if (!baristaFireState) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;
    const multiplier = baristaFireState.fiMultiplier || 25; // Default to 25x if not set

    // Get FI number from state or calculate from expenses
    let fiNumber = 0;
    let monthlyExpenses = 0;

    if (baristaFireState.selectedTier && expenseBaseline) {
      // Use selected tier from expense baseline
      monthlyExpenses = getExpenseByTierHelper(expenseBaseline, baristaFireState.selectedTier);
      fiNumber = monthlyExpenses * 12 * multiplier;
    } else if (baristaFireState.customMonthlyExpense) {
      // Use custom monthly expense
      monthlyExpenses = baristaFireState.customMonthlyExpense;
      fiNumber = monthlyExpenses * 12 * multiplier;
    }

    // Only calculate if we have valid expenses
    if (monthlyExpenses === 0) return null;

    try {
      return calculateBaristaFireResults(
        baristaFireState,
        fiNumber,
        monthlyExpenses,
        actualHourlyWage
      );
    } catch (error) {
      console.error('Error calculating Barista FIRE results:', error);
      return null;
    }
  }, [baristaFireState, expenseBaseline, results?.actualHourlyWage]);

  // Calculate Coast FIRE results whenever state or dependencies change
  const coastFireResults = useMemo(() => {
    // Guard: require coastFireState with valid fiNumber
    if (!coastFireState || !coastFireState.fiNumber || coastFireState.fiNumber <= 0) {
      return null;
    }

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateCoastFIREResult(
        coastFireState,
        actualHourlyWage
      );
    } catch (error) {
      console.error('Error calculating Coast FIRE results:', error);
      return null;
    }
  }, [coastFireState, results?.actualHourlyWage]);

  // Calculate LeanFIRE results whenever state or dependencies change
  const leanFireResults = useMemo(() => {
    if (!leanFire || !leanFire.barebonesExpenses) return null;

    const actualHourlyWage = results?.actualHourlyWage ?? null;

    try {
      return calculateLeanFireResults(
        leanFire,
        actualHourlyWage
      );
    } catch (error) {
      console.error('Error calculating LeanFIRE results:', error);
      return null;
    }
  }, [leanFire, results?.actualHourlyWage]);

  // Auto-recalculate commute results when actualHourlyWage changes
  useEffect(() => {
    if (!isHydrated || commuteScenarios.length === 0) return;

    const actualHourlyWage = results?.actualHourlyWage ?? 0;

    setCommuteScenarios((prevScenarios) =>
      prevScenarios.map((scenario) => ({
        ...scenario,
        results: calculateCommuteResults(scenario.inputs, actualHourlyWage),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, [results?.actualHourlyWage, isHydrated]);

  // Auto-recalculate housing results when actualHourlyWage changes
  useEffect(() => {
    if (!isHydrated || housingScenarios.length === 0) return;

    const actualHourlyWage = results?.actualHourlyWage ?? 0;

    setHousingScenarios((prevScenarios) =>
      prevScenarios.map((scenario) => ({
        ...scenario,
        results: calculateHousingResults(scenario.inputs, actualHourlyWage),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, [results?.actualHourlyWage, isHydrated]);

  // Auto-recalculate car ownership results when actualHourlyWage changes
  useEffect(() => {
    if (!isHydrated || carOwnershipScenarios.length === 0) return;

    const actualHourlyWage = results?.actualHourlyWage ?? 0;

    setCarOwnershipScenarios((prevScenarios) =>
      prevScenarios.map((scenario) => ({
        ...scenario,
        results: calculateCarOwnershipResults(scenario.inputs, actualHourlyWage),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, [results?.actualHourlyWage, isHydrated]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = safeGetItem<StoredState>(STORAGE_KEY);
    if (stored && stored.version === STORAGE_VERSION) {
      setInputs(stored.currentInputs);
      setScenarios(stored.scenarios || []);
      setSubscriptions(stored.subscriptions || []);
      // Load mealCostData with fallback to defaults for backwards compatibility
      if (stored.mealCostData) {
        setMealCostData(stored.mealCostData);
      }
      // Load commute scenarios
      setCommuteScenarios(stored.commuteScenarios || []);
      // Load convenience expenses and goal
      setConvenienceExpenses(stored.convenienceExpenses || []);
      setConvenienceGoalState(stored.convenienceGoal || null);
      // Load childcare items
      setChildcareItems(stored.childcareItems || []);
      // Load housing scenarios
      setHousingScenarios(stored.housingScenarios || []);
      // Load periods
      setPeriodsState(stored.periods || []);
      // Load car ownership scenarios
      setCarOwnershipScenarios(stored.carOwnershipScenarios || []);
      // Load expense baseline
      if (stored.expenseBaseline) {
        setExpenseBaseline({
          categories: stored.expenseBaseline.categories,
          lastUpdated: new Date(stored.expenseBaseline.lastUpdated),
          wizardCompleted: stored.expenseBaseline.wizardCompleted,
          version: stored.expenseBaseline.version,
        });
      }
      // Load current expenses (with backwards compatibility for isEssential)
      if (stored.currentExpenses) {
        setCurrentExpenses({
          categories: stored.currentExpenses.categories.map(cat => ({
            ...cat,
            lineItems: cat.lineItems.map(item => ({
              ...item,
              // Add default isEssential if missing (backwards compatibility)
              isEssential: (item as { isEssential?: boolean }).isEssential ?? true,
            })),
          })),
          lastUpdated: new Date(stored.currentExpenses.lastUpdated),
          version: stored.currentExpenses.version,
        });
      }
      // Load savings report
      if (stored.savingsReport) {
        setSavingsReport({
          categories: stored.savingsReport.categories,
          lastUpdated: new Date(stored.savingsReport.lastUpdated),
          version: stored.savingsReport.version,
        });
      }
      // Load FI Number Builder state
      if (stored.fiNumberBuilder) {
        setFINumberBuilder({
          ...stored.fiNumberBuilder,
          // Ensure new fields have defaults for backward compatibility
          occupationalPension: stored.fiNumberBuilder.occupationalPension ?? FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
          sereignBalance: stored.fiNumberBuilder.sereignBalance ?? FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
          lastUpdated: new Date(stored.fiNumberBuilder.lastUpdated),
        });
      }
      // Load FIRE Type Explorer preferences
      if (stored.fireTypePreferences) {
        setFireTypePreferences({
          selectedType: stored.fireTypePreferences.selectedType,
          customAssumptions: stored.fireTypePreferences.customAssumptions,
          showAllTypes: stored.fireTypePreferences.showAllTypes,
          expandedSections: stored.fireTypePreferences.expandedSections,
          lastUpdated: new Date(stored.fireTypePreferences.lastUpdated),
        });
      }
      // Load Coast FIRE Calculator state
      if (stored.coastFire) {
        setCoastFireState({
          ...stored.coastFire,
          lastUpdated: stored.coastFire.lastUpdated,
        });
      }
    }
    setIsHydrated(true);
  }, []);

  // Auto-save to localStorage when inputs change (debounced)
  useEffect(() => {
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      const state: StoredState = {
        version: STORAGE_VERSION,
        currentInputs: inputs,
        scenarios,
        subscriptions,
        commuteScenarios,
        housingScenarios,
        mealCostData,
        convenienceExpenses,
        convenienceGoal: convenienceGoal ?? undefined,
        childcareItems,
        periods,
        carOwnershipScenarios,
        emergencyFundData: emergencyFundData ?? undefined,
        expenseBaseline: expenseBaseline
          ? {
              categories: expenseBaseline.categories,
              lastUpdated: expenseBaseline.lastUpdated.toISOString(),
              wizardCompleted: expenseBaseline.wizardCompleted,
              version: expenseBaseline.version,
            }
          : undefined,
        currentExpenses: currentExpenses
          ? {
              categories: currentExpenses.categories,
              lastUpdated: currentExpenses.lastUpdated.toISOString(),
              version: currentExpenses.version,
            }
          : undefined,
        savingsReport: savingsReport
          ? {
              categories: savingsReport.categories,
              lastUpdated: savingsReport.lastUpdated.toISOString(),
              version: savingsReport.version,
            }
          : undefined,
        fiNumberBuilder: fiNumberBuilder
          ? {
              ...fiNumberBuilder,
              lastUpdated: fiNumberBuilder.lastUpdated.toISOString(),
            }
          : undefined,
        fireTypePreferences: fireTypePreferences
          ? {
              selectedType: fireTypePreferences.selectedType,
              customAssumptions: fireTypePreferences.customAssumptions,
              showAllTypes: fireTypePreferences.showAllTypes,
              expandedSections: fireTypePreferences.expandedSections,
              lastUpdated: fireTypePreferences.lastUpdated.toISOString(),
            }
          : undefined,
        coastFire: coastFireState
          ? {
              ...coastFireState,
              lastUpdated: coastFireState.lastUpdated,
            }
          : undefined,
        lastUpdated: new Date().toISOString(),
      };
      safeSetItem(STORAGE_KEY, state);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [inputs, scenarios, subscriptions, commuteScenarios, housingScenarios, mealCostData, convenienceExpenses, convenienceGoal, childcareItems, periods, carOwnershipScenarios, emergencyFundData, expenseBaseline, currentExpenses, savingsReport, fiNumberBuilder, fireTypePreferences, coastFireState, isHydrated]);

  // Update functions
  const updateIncome = useCallback((updates: Partial<IncomeInputs>) => {
    setInputs((prev) => ({
      ...prev,
      income: { ...prev.income, ...updates },
    }));
  }, []);

  const updateMoneyExpenses = useCallback(
    (updates: Partial<MoneyExpenses>) => {
      setInputs((prev) => ({
        ...prev,
        moneyExpenses: { ...prev.moneyExpenses, ...updates },
      }));
    },
    []
  );

  const updateTimeExpenses = useCallback((updates: Partial<TimeExpenses>) => {
    setInputs((prev) => ({
      ...prev,
      timeExpenses: { ...prev.timeExpenses, ...updates },
    }));
  }, []);

  // Meal cost update functions
  const updateMealCostData = useCallback(
    (updates: Partial<MealCostData>) => {
      setMealCostData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  const updateEatingOut = useCallback((updates: Partial<EatingOutData>) => {
    setMealCostData((prev) => ({
      ...prev,
      eatingOut: { ...prev.eatingOut, ...updates },
    }));
  }, []);

  const updateHomeCooking = useCallback(
    (updates: Partial<HomeCookingData>) => {
      setMealCostData((prev) => ({
        ...prev,
        homeCooking: { ...prev.homeCooking, ...updates },
      }));
    },
    []
  );

  // Scenario management
  const saveCurrentAsScenario = useCallback(
    (name: string) => {
      if (!results) return;

      // Max 3 scenarios
      if (scenarios.length >= 3) {
        console.warn('Maximum 3 scenarios allowed');
        return;
      }

      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        name,
        inputs: { ...inputs },
        results: { ...results },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setScenarios((prev) => [...prev, newScenario]);
    },
    [inputs, results, scenarios.length]
  );

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const loadScenario = useCallback(
    (id: string) => {
      const scenario = scenarios.find((s) => s.id === id);
      if (scenario) {
        setInputs(scenario.inputs);
      }
    },
    [scenarios]
  );

  // Subscription management
  const addSubscription = useCallback(
    (subscription: Omit<Subscription, 'id'>) => {
      const newSubscription: Subscription = {
        ...subscription,
        id: generateSubscriptionId(),
      };
      setSubscriptions((prev) => [...prev, newSubscription]);
    },
    []
  );

  const updateSubscription = useCallback(
    (id: string, updates: Partial<Subscription>) => {
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
      );
    },
    []
  );

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  }, []);

  const toggleSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
  }, []);

  // Commute scenario management
  const addCommuteScenario = useCallback(
    (scenario: Omit<CommuteScenario, 'id' | 'results'>) => {
      // Max 4 scenarios
      if (commuteScenarios.length >= 4) {
        console.warn('Maximum 4 commute scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateCommuteResults(scenario.inputs, actualHourlyWage);

      const newScenario: CommuteScenario = {
        id: generateCommuteId(),
        name: scenario.name,
        inputs: scenario.inputs,
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: scenario.isCurrent,
      };

      setCommuteScenarios((prev) => [...prev, newScenario]);
    },
    [commuteScenarios.length, results?.actualHourlyWage]
  );

  const updateCommuteScenario = useCallback(
    (id: string, updates: Partial<Omit<CommuteScenario, 'id' | 'results'>>) => {
      setCommuteScenarios((prev) =>
        prev.map((scenario) => {
          if (scenario.id !== id) return scenario;

          const actualHourlyWage = results?.actualHourlyWage ?? 0;
          const updatedInputs = updates.inputs ? updates.inputs : scenario.inputs;
          const recalculatedResults = calculateCommuteResults(updatedInputs, actualHourlyWage);

          return {
            ...scenario,
            ...updates,
            inputs: updatedInputs,
            results: recalculatedResults,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [results?.actualHourlyWage]
  );

  const deleteCommuteScenario = useCallback((id: string) => {
    setCommuteScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  }, []);

  const duplicateCommuteScenario = useCallback(
    (id: string) => {
      const scenario = commuteScenarios.find((s) => s.id === id);
      if (!scenario) {
        console.warn('Scenario not found:', id);
        return;
      }

      // Max 4 scenarios
      if (commuteScenarios.length >= 4) {
        console.warn('Maximum 4 commute scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateCommuteResults(scenario.inputs, actualHourlyWage);

      const duplicatedScenario: CommuteScenario = {
        id: generateCommuteId(),
        name: `${scenario.name} (afrit)`,
        inputs: { ...scenario.inputs },
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: false,
      };

      setCommuteScenarios((prev) => [...prev, duplicatedScenario]);
    },
    [commuteScenarios, results?.actualHourlyWage]
  );

  // Convenience expense management
  const addConvenienceExpense = useCallback(
    (expense: Omit<ConvenienceExpense, 'id'>) => {
      const newExpense: ConvenienceExpense = {
        ...expense,
        id: generateExpenseId(),
      };
      setConvenienceExpenses((prev) => [...prev, newExpense]);
    },
    []
  );

  const updateConvenienceExpense = useCallback(
    (id: string, updates: Partial<ConvenienceExpense>) => {
      setConvenienceExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
      );
    },
    []
  );

  const deleteConvenienceExpense = useCallback((id: string) => {
    setConvenienceExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }, []);

  const setConvenienceGoal = useCallback((goal: ConvenienceGoal) => {
    setConvenienceGoalState(goal);
  }, []);

  const deleteConvenienceGoal = useCallback(() => {
    setConvenienceGoalState(null);
  }, []);

  // Childcare item management
  const addChildcareItem = useCallback(
    (item: Omit<ChildcareItem, 'id'>) => {
      const newItem: ChildcareItem = {
        ...item,
        id: generateChildcareId(),
      };
      setChildcareItems((prev) => [...prev, newItem]);
    },
    []
  );

  const updateChildcareItem = useCallback(
    (id: string, updates: Partial<ChildcareItem>) => {
      setChildcareItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const deleteChildcareItem = useCallback((id: string) => {
    setChildcareItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Housing scenario management
  const addHousingScenario = useCallback(
    (scenario: Omit<HousingScenario, 'id' | 'results'>) => {
      // Max 4 scenarios
      if (housingScenarios.length >= 4) {
        console.warn('Maximum 4 housing scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateHousingResults(scenario.inputs, actualHourlyWage);

      const newScenario: HousingScenario = {
        id: generateHousingId(),
        name: scenario.name,
        inputs: scenario.inputs,
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: scenario.isCurrent,
      };

      setHousingScenarios((prev) => [...prev, newScenario]);
    },
    [housingScenarios.length, results?.actualHourlyWage]
  );

  const updateHousingScenario = useCallback(
    (id: string, updates: Partial<Omit<HousingScenario, 'id' | 'results'>>) => {
      setHousingScenarios((prev) =>
        prev.map((scenario) => {
          if (scenario.id !== id) return scenario;

          const actualHourlyWage = results?.actualHourlyWage ?? 0;
          const updatedInputs = updates.inputs ? updates.inputs : scenario.inputs;
          const recalculatedResults = calculateHousingResults(updatedInputs, actualHourlyWage);

          return {
            ...scenario,
            ...updates,
            inputs: updatedInputs,
            results: recalculatedResults,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [results?.actualHourlyWage]
  );

  const deleteHousingScenario = useCallback((id: string) => {
    setHousingScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  }, []);

  const duplicateHousingScenario = useCallback(
    (id: string) => {
      const scenario = housingScenarios.find((s) => s.id === id);
      if (!scenario) {
        console.warn('Scenario not found:', id);
        return;
      }

      // Max 4 scenarios
      if (housingScenarios.length >= 4) {
        console.warn('Maximum 4 housing scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateHousingResults(scenario.inputs, actualHourlyWage);

      const duplicatedScenario: HousingScenario = {
        id: generateHousingId(),
        name: `${scenario.name} (afrit)`,
        inputs: { ...scenario.inputs },
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: false,
      };

      setHousingScenarios((prev) => [...prev, duplicatedScenario]);
    },
    [housingScenarios, results?.actualHourlyWage]
  );

  // Period management (Lifestyle Inflation Detector)
  const addPeriod = useCallback(
    (period: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newPeriod: Period = {
        ...period,
        id: generatePeriodId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPeriodsState((prev) => [...prev, newPeriod]);
    },
    []
  );

  const updatePeriod = useCallback(
    (id: string, updates: Partial<Period>) => {
      setPeriodsState((prev) =>
        prev.map((period) =>
          period.id === id
            ? { ...period, ...updates, updatedAt: new Date().toISOString() }
            : period
        )
      );
    },
    []
  );

  const deletePeriod = useCallback((id: string) => {
    setPeriodsState((prev) => prev.filter((period) => period.id !== id));
  }, []);

  // Car ownership scenario management
  const addCarOwnershipScenario = useCallback(
    (scenario: Omit<CarOwnershipScenario, 'id' | 'results'>) => {
      // Max 4 scenarios
      if (carOwnershipScenarios.length >= 4) {
        console.warn('Maximum 4 car ownership scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 bíla í einu. Eyddu einum til að búa til nýjan.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateCarOwnershipResults(scenario.inputs, actualHourlyWage);

      const newScenario: CarOwnershipScenario = {
        id: generateCarOwnershipId(),
        name: scenario.name,
        inputs: scenario.inputs,
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: scenario.isCurrent,
      };

      setCarOwnershipScenarios((prev) => [...prev, newScenario]);
    },
    [carOwnershipScenarios.length, results?.actualHourlyWage]
  );

  const updateCarOwnershipScenario = useCallback(
    (id: string, updates: Partial<Omit<CarOwnershipScenario, 'id' | 'results'>>) => {
      setCarOwnershipScenarios((prev) =>
        prev.map((scenario) => {
          if (scenario.id !== id) return scenario;

          const actualHourlyWage = results?.actualHourlyWage ?? 0;
          const updatedInputs = updates.inputs ? updates.inputs : scenario.inputs;
          const recalculatedResults = calculateCarOwnershipResults(updatedInputs, actualHourlyWage);

          return {
            ...scenario,
            ...updates,
            inputs: updatedInputs,
            results: recalculatedResults,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [results?.actualHourlyWage]
  );

  const deleteCarOwnershipScenario = useCallback((id: string) => {
    setCarOwnershipScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  }, []);

  const duplicateCarOwnershipScenario = useCallback(
    (id: string) => {
      const scenario = carOwnershipScenarios.find((s) => s.id === id);
      if (!scenario) {
        console.warn('Scenario not found:', id);
        return;
      }

      // Max 4 scenarios
      if (carOwnershipScenarios.length >= 4) {
        console.warn('Maximum 4 car ownership scenarios allowed');
        throw new Error('Þú getur aðeins haft 4 bíla í einu. Eyddu einum til að búa til nýjan.');
      }

      const actualHourlyWage = results?.actualHourlyWage ?? 0;
      const calculatedResults = calculateCarOwnershipResults(scenario.inputs, actualHourlyWage);

      const duplicatedScenario: CarOwnershipScenario = {
        id: generateCarOwnershipId(),
        name: `${scenario.name} (afrit)`,
        inputs: { ...scenario.inputs },
        results: calculatedResults,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isCurrent: false,
      };

      setCarOwnershipScenarios((prev) => [...prev, duplicatedScenario]);
    },
    [carOwnershipScenarios, results?.actualHourlyWage]
  );

  // Emergency Fund management
  const updateEmergencyFundData = useCallback(
    (updates: Partial<EmergencyFundData>) => {
      setEmergencyFundData((prev) => {
        if (!prev) {
          // Initialize with defaults if no data exists
          return {
            balance: updates.balance ?? 0,
            monthlyExpenses: updates.monthlyExpenses ?? 0,
            lastUpdated: new Date(),
          };
        }

        return {
          ...prev,
          ...updates,
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  const clearEmergencyFundData = useCallback(() => {
    setEmergencyFundData(null);
  }, []);

  // Expense Baseline management
  const updateExpenseBaseline = useCallback(
    (updates: Partial<ExpenseBaseline>) => {
      setExpenseBaseline((prev) => {
        if (!prev) {
          // Initialize with defaults if no baseline exists
          return {
            categories: updates.categories ?? [],
            lastUpdated: updates.lastUpdated ?? new Date(),
            wizardCompleted: updates.wizardCompleted ?? false,
            version: updates.version ?? 1,
          };
        }

        return {
          ...prev,
          ...updates,
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  const updateCategoryValues = useCallback(
    (categoryId: string, values: Partial<TierValues>) => {
      setExpenseBaseline((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          categories: prev.categories.map((c) =>
            c.id === categoryId
              ? { ...c, values: { ...c.values, ...values } }
              : c
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  const addCustomCategory = useCallback(
    (name: string, icon: string, values: TierValues) => {
      setExpenseBaseline((prev) => {
        if (!prev) return prev;

        // Generate unique ID
        const customId = `custom-${Date.now()}`;

        const newCategory: ExpenseCategory = {
          id: customId,
          name,
          icon,
          values,
          isCustom: true,
          isHidden: false,
          order: prev.categories.length,
        };

        return {
          ...prev,
          categories: [...prev.categories, newCategory],
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  const removeCategory = useCallback((categoryId: string) => {
    setExpenseBaseline((prev) => {
      if (!prev) return prev;

      // Only allow removing custom categories
      const category = prev.categories.find((c) => c.id === categoryId);
      if (!category || !category.isCustom) {
        console.warn('Cannot remove default category:', categoryId);
        return prev;
      }

      return {
        ...prev,
        categories: prev.categories.filter((c) => c.id !== categoryId),
        lastUpdated: new Date(),
      };
    });
  }, []);

  const toggleCategoryVisibility = useCallback((categoryId: string) => {
    setExpenseBaseline((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === categoryId ? { ...c, isHidden: !c.isHidden } : c
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  const resetExpenseBaselineToDefaults = useCallback(() => {
    // This will be implemented when we have DEFAULT_EXPENSE_CATEGORIES constant
    // For now, just clear the baseline
    setExpenseBaseline(null);
  }, []);

  const clearExpenseBaseline = useCallback(() => {
    setExpenseBaseline(null);
  }, []);

  // Expense Baseline API methods (for other calculators)
  const getExpenseBaseline = useCallback(() => {
    return expenseBaseline;
  }, [expenseBaseline]);

  const getExpenseByTier = useCallback(
    (tier: ExpenseTier) => {
      if (!expenseBaseline) return 0;
      return getExpenseByTierHelper(expenseBaseline, tier);
    },
    [expenseBaseline]
  );

  const hasExpenseBaselineFunc = useCallback(() => {
    return hasExpenseBaselineHelper(expenseBaseline);
  }, [expenseBaseline]);

  // ===== CURRENT EXPENSE REPORT FUNCTIONS =====

  /**
   * Update current expenses with partial data
   * Creates a new expense report if none exists
   */
  const updateCurrentExpenses = useCallback((updates: Partial<CurrentExpenseReport>) => {
    setCurrentExpenses((prev) => {
      if (!prev) {
        // Create new expense report if none exists
        return {
          categories: updates.categories ?? [],
          lastUpdated: updates.lastUpdated ?? new Date(),
          version: updates.version ?? 1,
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Add a line item to a category
   */
  const addCurrentExpenseLineItem = useCallback(
    (categoryId: string, lineItem: Omit<LineItem, 'id'>) => {
      setCurrentExpenses((prev) => {
        if (!prev) return prev;

        const newLineItem: LineItem = {
          ...lineItem,
          id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        return {
          ...prev,
          categories: prev.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  lineItems: [...cat.lineItems, newLineItem],
                }
              : cat
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Update a specific line item
   */
  const updateCurrentExpenseLineItem = useCallback(
    (categoryId: string, lineItemId: string, updates: Partial<LineItem>) => {
      setCurrentExpenses((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          categories: prev.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  lineItems: cat.lineItems.map((item) =>
                    item.id === lineItemId ? { ...item, ...updates } : item
                  ),
                }
              : cat
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Delete a line item from a category
   */
  const deleteCurrentExpenseLineItem = useCallback(
    (categoryId: string, lineItemId: string) => {
      setCurrentExpenses((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          categories: prev.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  lineItems: cat.lineItems.filter((item) => item.id !== lineItemId),
                }
              : cat
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Add a custom category
   */
  const addCurrentExpenseCategory = useCallback(
    (category: Omit<CurrentExpenseCategory, 'id' | 'lineItems'>) => {
      setCurrentExpenses((prev) => {
        if (!prev) return prev;

        const newCategory: CurrentExpenseCategory = {
          ...category,
          id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lineItems: [],
          isCustom: true,
        };

        return {
          ...prev,
          categories: [...prev.categories, newCategory],
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Remove a custom category (cannot remove default categories)
   */
  const removeCurrentExpenseCategory = useCallback((categoryId: string) => {
    setCurrentExpenses((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        categories: prev.categories.filter(
          (cat) => !(cat.id === categoryId && cat.isCustom)
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Toggle category visibility
   */
  const toggleCurrentExpenseCategoryVisibility = useCallback((categoryId: string) => {
    setCurrentExpenses((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, isHidden: !cat.isHidden } : cat
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Clear all current expenses
   */
  const clearCurrentExpenses = useCallback(() => {
    setCurrentExpenses(null);
  }, []);

  // ===== INTEGRATION API =====

  /**
   * Get current expenses (integration API)
   */
  const getCurrentExpenses = useCallback(() => {
    return currentExpenses;
  }, [currentExpenses]);

  /**
   * Get expenses for a specific category
   */
  const getExpensesByCategory = useCallback(
    (categoryId: string) => {
      if (!currentExpenses) return null;
      return currentExpenses.categories.find((cat) => cat.id === categoryId) || null;
    },
    [currentExpenses]
  );

  /**
   * Get all subscriptions (recurring line items)
   */
  const getSubscriptions = useCallback(() => {
    if (!currentExpenses) return [];
    return extractSubscriptions(currentExpenses);
  }, [currentExpenses]);

  /**
   * Get total commute expenses
   */
  const getCommuteExpenses = useCallback(() => {
    if (!currentExpenses) return 0;
    return extractCommuteExpenses(currentExpenses);
  }, [currentExpenses]);

  /**
   * Get total housing expenses
   */
  const getHousingExpenses = useCallback(() => {
    if (!currentExpenses) return 0;
    return extractHousingExpenses(currentExpenses);
  }, [currentExpenses]);

  /**
   * Check if current expenses exist
   */
  const hasCurrentExpenses = useCallback(() => {
    return currentExpenses !== null && currentExpenses.categories.length > 0;
  }, [currentExpenses]);

  // ===== SAVINGS REPORT FUNCTIONS =====

  /**
   * Update savings report with partial data
   */
  const updateSavingsReport = useCallback((updates: Partial<SavingsReport>) => {
    setSavingsReport((prev) => {
      if (!prev) {
        // Create new savings report if none exists
        return {
          categories: updates.categories ?? [],
          lastUpdated: updates.lastUpdated ?? new Date(),
          version: updates.version ?? 1,
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Update a specific category's data
   */
  const updateSavingsCategory = useCallback(
    (categoryId: string, data: Partial<SavingsCategoryData>) => {
      setSavingsReport((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          categories: prev.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  data: {
                    ...cat.data,
                    ...data,
                  },
                }
              : cat
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Toggle category visibility (hide/show)
   */
  const toggleSavingsCategoryVisibility = useCallback((categoryId: string) => {
    setSavingsReport((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, isHidden: !cat.isHidden } : cat
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Clear all savings report data
   */
  const clearSavingsReport = useCallback(() => {
    setSavingsReport(null);
  }, []);

  /**
   * Initialize savings report with default categories
   */
  const initializeSavingsReport = useCallback(() => {
    setSavingsReport({
      categories: DEFAULT_SAVINGS_CATEGORIES.map((config) => ({
        ...config,
        data: {
          balance: 0,
          monthlyContribution: 0,
        },
        isHidden: false,
      })),
      lastUpdated: new Date(),
      version: 1,
    });
  }, []);

  // ===== SAVINGS REPORT INTEGRATION API =====

  /**
   * Get savings report (integration API)
   */
  const getSavingsReport = useCallback(() => {
    return savingsReport;
  }, [savingsReport]);

  /**
   * Get total savings across all categories
   */
  const getTotalSavings = useCallback(() => {
    if (!savingsReportResults) return 0;
    return savingsReportResults.totalSavings;
  }, [savingsReportResults]);

  /**
   * Get total monthly contribution across all categories
   */
  const getTotalMonthlyContribution = useCallback(() => {
    if (!savingsReportResults) return 0;
    return savingsReportResults.totalMonthlyContribution;
  }, [savingsReportResults]);

  /**
   * Get savings rate as percentage
   */
  const getSavingsRate = useCallback(() => {
    if (!savingsReportResults) return null;
    return savingsReportResults.savingsRate;
  }, [savingsReportResults]);

  /**
   * Check if savings report exists
   */
  const hasSavingsReport = useCallback(() => {
    return savingsReport !== null && savingsReport.categories.length > 0;
  }, [savingsReport]);

  // ===== FI NUMBER BUILDER FUNCTIONS =====

  /**
   * Update FI Number Builder state with partial updates
   */
  const updateFINumberState = useCallback((updates: Partial<FINumberBuilderState>) => {
    setFINumberBuilder((prev) => {
      if (!prev) {
        // Create new FI Number Builder state if none exists
        return {
          expenseSource: updates.expenseSource ?? FI_NUMBER_DEFAULTS.EXPENSE_SOURCE,
          selectedTier: updates.selectedTier ?? null,
          customMonthlyExpense: updates.customMonthlyExpense ?? FI_NUMBER_DEFAULTS.CUSTOM_MONTHLY_EXPENSE,
          multiplier: updates.multiplier ?? FI_NUMBER_DEFAULTS.MULTIPLIER,
          customMultiplier: updates.customMultiplier ?? FI_NUMBER_DEFAULTS.CUSTOM_MULTIPLIER,
          pensionMonthlyIncome: updates.pensionMonthlyIncome ?? FI_NUMBER_DEFAULTS.PENSION_MONTHLY_INCOME,
          targetRetirementAge: updates.targetRetirementAge ?? FI_NUMBER_DEFAULTS.TARGET_RETIREMENT_AGE,
          // Three-phase planning (Iceland)
          occupationalPension: updates.occupationalPension ?? FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
          sereignBalance: updates.sereignBalance ?? FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set expense source (baseline or custom)
   */
  const setExpenseSource = useCallback(
    (source: ExpenseSource, tier?: ExpenseTier) => {
      setFINumberBuilder((prev) => {
        if (!prev) {
          // Initialize if not exists
          return {
            expenseSource: source,
            selectedTier: tier ?? (source === 'baseline' ? 'comfortable' : null),
            customMonthlyExpense: FI_NUMBER_DEFAULTS.CUSTOM_MONTHLY_EXPENSE,
            multiplier: FI_NUMBER_DEFAULTS.MULTIPLIER,
            customMultiplier: FI_NUMBER_DEFAULTS.CUSTOM_MULTIPLIER,
            pensionMonthlyIncome: FI_NUMBER_DEFAULTS.PENSION_MONTHLY_INCOME,
            targetRetirementAge: FI_NUMBER_DEFAULTS.TARGET_RETIREMENT_AGE,
            // Three-phase planning (Iceland)
            occupationalPension: FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
            sereignBalance: FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
            lastUpdated: new Date(),
          };
        }
        return {
          ...prev,
          expenseSource: source,
          selectedTier: tier ?? (source === 'baseline' ? prev.selectedTier ?? 'comfortable' : null),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Set selected expense tier
   */
  const setSelectedTier = useCallback((tier: ExpenseTier) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        selectedTier: tier,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set custom monthly expense amount
   */
  const setCustomMonthlyExpense = useCallback((amount: number) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customMonthlyExpense: amount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set FI multiplier
   */
  const setMultiplier = useCallback((multiplier: number) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        multiplier,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set pension income and optional retirement age
   */
  const setPensionIncome = useCallback(
    (amount: number | null, retirementAge?: number | null) => {
      setFINumberBuilder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pensionMonthlyIncome: amount,
          targetRetirementAge: retirementAge !== undefined ? retirementAge : prev.targetRetirementAge,
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Set target retirement age
   */
  const setTargetRetirementAge = useCallback((age: number | null) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        targetRetirementAge: age,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set occupational pension estimate for three-phase planning
   */
  const setOccupationalPension = useCallback((amount: number | null) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        occupationalPension: amount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set séreign balance estimate for three-phase planning
   */
  const setSereignBalance = useCallback((amount: number | null) => {
    setFINumberBuilder((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        sereignBalance: amount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Clear all FI Number Builder data
   */
  const clearFINumberBuilder = useCallback(() => {
    setFINumberBuilder(null);
  }, []);

  /**
   * Initialize FI Number Builder with defaults
   */
  const initializeFINumberBuilder = useCallback(() => {
    setFINumberBuilder({
      // Default to 'baseline' if expense baseline exists, otherwise 'custom'
      expenseSource: expenseBaseline ? 'baseline' : 'custom',
      selectedTier: expenseBaseline ? 'comfortable' : null,
      customMonthlyExpense: expenseBaseline ? null : 500000, // Default custom expense if no baseline
      multiplier: FI_NUMBER_DEFAULTS.MULTIPLIER,
      customMultiplier: FI_NUMBER_DEFAULTS.CUSTOM_MULTIPLIER,
      pensionMonthlyIncome: FI_NUMBER_DEFAULTS.PENSION_MONTHLY_INCOME,
      targetRetirementAge: FI_NUMBER_DEFAULTS.TARGET_RETIREMENT_AGE,
      // Three-phase planning (Iceland)
      occupationalPension: FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
      sereignBalance: FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
      lastUpdated: new Date(),
    });
  }, [expenseBaseline]);

  // ===== FI NUMBER BUILDER INTEGRATION API =====

  /**
   * Get FI Number Builder state (integration API)
   */
  const getFINumberBuilder = useCallback(() => {
    return fiNumberBuilder;
  }, [fiNumberBuilder]);

  /**
   * Check if FI number has been calculated
   */
  const hasFINumber = useCallback(() => {
    return fiNumberBuilder !== null && fiNumberResults !== null;
  }, [fiNumberBuilder, fiNumberResults]);

  // ===== FATFIRE PLANNER FUNCTIONS =====

  /**
   * Initialize FatFIRE state with defaults
   */
  const initializeFatFireState = useCallback(() => {
    setFatFireState({
      useExpenseBaseline: expenseBaselineResults !== null, // Only use baseline if available
      selectedTier: 'deluxe',
      customMonthlyExpense: null,
      wishListItems: [],
      splurgeBudgetAnnual: FATFIRE_DEFAULTS.SPLURGE_BUDGET_ANNUAL,
      multiplier: FATFIRE_DEFAULTS.MULTIPLIER,
      customMultiplier: null,
      currentSavings: null,
      expectedReturnRate: FATFIRE_DEFAULTS.EXPECTED_RETURN,
      annualSavings: null,
      scenarios: [],
      lastUpdated: new Date(),
    });
  }, [expenseBaselineResults]);

  /**
   * Update FatFIRE state with partial data
   */
  const updateFatFireState = useCallback((updates: Partial<FatFireState>) => {
    setFatFireState((prev) => {
      if (!prev) {
        // Initialize if not exists
        return {
          useExpenseBaseline: updates.useExpenseBaseline ?? true,
          selectedTier: updates.selectedTier ?? 'deluxe',
          customMonthlyExpense: updates.customMonthlyExpense ?? null,
          wishListItems: updates.wishListItems ?? [],
          splurgeBudgetAnnual: updates.splurgeBudgetAnnual ?? FATFIRE_DEFAULTS.SPLURGE_BUDGET_ANNUAL,
          multiplier: updates.multiplier ?? FATFIRE_DEFAULTS.MULTIPLIER,
          customMultiplier: updates.customMultiplier ?? null,
          currentSavings: updates.currentSavings ?? null,
          expectedReturnRate: updates.expectedReturnRate ?? FATFIRE_DEFAULTS.EXPECTED_RETURN,
          annualSavings: updates.annualSavings ?? null,
          scenarios: updates.scenarios ?? [],
          lastUpdated: new Date(),
        };
      }

      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Add a wish list item
   */
  const addWishListItem = useCallback(
    (item: Omit<WishListItem, 'id' | 'createdAt'>) => {
      setFatFireState((prev) => {
        if (!prev) return prev;

        const newItem: WishListItem = {
          ...item,
          id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        return {
          ...prev,
          wishListItems: [...prev.wishListItems, newItem],
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Update a wish list item
   */
  const updateWishListItem = useCallback(
    (id: string, updates: Partial<Omit<WishListItem, 'id' | 'createdAt'>>) => {
      setFatFireState((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          wishListItems: prev.wishListItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  /**
   * Remove a wish list item
   */
  const removeWishListItem = useCallback((id: string) => {
    setFatFireState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        wishListItems: prev.wishListItems.filter((item) => item.id !== id),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set splurge budget (annual amount)
   */
  const setSplurgeBudget = useCallback((amount: number) => {
    setFatFireState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        splurgeBudgetAnnual: amount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Add a scenario for comparison
   */
  const addScenario = useCallback((scenario: Omit<FatFireScenario, 'id'>) => {
    setFatFireState((prev) => {
      if (!prev) return prev;

      // Max 5 scenarios
      if (prev.scenarios.length >= 5) {
        console.warn('Maximum 5 FatFIRE scenarios allowed');
        return prev;
      }

      const newScenario: FatFireScenario = {
        ...scenario,
        id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      return {
        ...prev,
        scenarios: [...prev.scenarios, newScenario],
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Remove a scenario
   */
  const removeScenario = useCallback((id: string) => {
    setFatFireState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        scenarios: prev.scenarios.filter((s) => s.id !== id),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Clear all FatFIRE state
   */
  const clearFatFireState = useCallback(() => {
    setFatFireState(null);
  }, []);

  // ===== FATFIRE INTEGRATION API =====

  /**
   * Get FatFIRE state (integration API)
   */
  const getFatFireState = useCallback(() => {
    return fatFireState;
  }, [fatFireState]);

  /**
   * Check if FatFIRE state exists
   */
  const hasFatFireState = useCallback(() => {
    return fatFireState !== null;
  }, [fatFireState]);

  // ===== BARISTA FIRE PLANNER FUNCTIONS =====

  /**
   * Update Barista FIRE state with partial data
   */
  const updateBaristaFireState = useCallback((updates: Partial<BaristaFireState>) => {
    setBaristaFireState((prev) => {
      if (!prev) {
        // Initialize with defaults if no state exists
        return {
          selectedTier: updates.selectedTier ?? BARISTA_FIRE_DEFAULTS.SELECTED_TIER ?? 'comfortable',
          customMonthlyExpense: updates.customMonthlyExpense ?? BARISTA_FIRE_DEFAULTS.CUSTOM_MONTHLY_EXPENSE,
          currentSavings: updates.currentSavings ?? BARISTA_FIRE_DEFAULTS.CURRENT_SAVINGS,
          currentAge: updates.currentAge ?? BARISTA_FIRE_DEFAULTS.CURRENT_AGE,
          investmentReturnRate: updates.investmentReturnRate ?? BARISTA_FIRE_DEFAULTS.INVESTMENT_RETURN_RATE,
          fiMultiplier: updates.fiMultiplier ?? BARISTA_FIRE_DEFAULTS.FI_MULTIPLIER,
          scenarios: updates.scenarios ?? [],
          lastUpdated: new Date().toISOString(),
          version: 1,
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Set FI Number for Barista FIRE
   */
  const setFINumber = useCallback((amount: number) => {
    updateBaristaFireState({ customMonthlyExpense: amount / 12 / 25 }); // Reverse calculate from FI number
  }, [updateBaristaFireState]);

  /**
   * Set current savings for Barista FIRE
   */
  const setCurrentSavings = useCallback((amount: number) => {
    updateBaristaFireState({ currentSavings: amount });
  }, [updateBaristaFireState]);

  /**
   * Add a Barista FIRE scenario
   */
  const addBaristaFireScenario = useCallback((scenario: Omit<BaristaFireScenario, 'id' | 'order'>) => {
    setBaristaFireState((prev) => {
      if (!prev) return prev;

      // Max 5 scenarios
      if (prev.scenarios.length >= 5) {
        console.warn('Maximum 5 Barista FIRE scenarios allowed');
        return prev;
      }

      const newScenario: BaristaFireScenario = {
        ...scenario,
        id: `barista-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: prev.scenarios.length,
      };

      return {
        ...prev,
        scenarios: [...prev.scenarios, newScenario],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Remove a Barista FIRE scenario
   */
  const removeBaristaFireScenario = useCallback((id: string) => {
    setBaristaFireState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        scenarios: prev.scenarios.filter((s) => s.id !== id),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Update a Barista FIRE scenario
   */
  const updateBaristaFireScenario = useCallback((id: string, updates: Partial<BaristaFireScenario>) => {
    setBaristaFireState((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        scenarios: prev.scenarios.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Clear all Barista FIRE data
   */
  const clearBaristaFireState = useCallback(() => {
    setBaristaFireState(null);
  }, []);

  /**
   * Initialize Barista FIRE with defaults
   */
  const initializeBaristaFireState = useCallback(() => {
    setBaristaFireState({
      selectedTier: expenseBaselineResults ? 'comfortable' : null,
      customMonthlyExpense: BARISTA_FIRE_DEFAULTS.CUSTOM_MONTHLY_EXPENSE,
      currentSavings: BARISTA_FIRE_DEFAULTS.CURRENT_SAVINGS,
      currentAge: BARISTA_FIRE_DEFAULTS.CURRENT_AGE,
      investmentReturnRate: BARISTA_FIRE_DEFAULTS.INVESTMENT_RETURN_RATE,
      fiMultiplier: BARISTA_FIRE_DEFAULTS.FI_MULTIPLIER,
      scenarios: [],
      lastUpdated: new Date().toISOString(),
      version: 1,
    });
  }, [expenseBaselineResults]);

  // ===== BARISTA FIRE INTEGRATION API =====

  /**
   * Get Barista FIRE state (integration API)
   */
  const getBaristaFireState = useCallback(() => {
    return baristaFireState;
  }, [baristaFireState]);

  /**
   * Check if Barista FIRE state exists
   */
  const hasBaristaFireState = useCallback(() => {
    return baristaFireState !== null;
  }, [baristaFireState]);

  // ===== LEANFIRE PLANNER FUNCTIONS =====

  /**
   * Update LeanFIRE state with partial data
   */
  const updateLeanFireState = useCallback((updates: Partial<LeanFireState>) => {
    setLeanFire((prev) => {
      if (!prev) {
        // Initialize with defaults if no state exists
        const defaults = {
          selectedLocation: updates.selectedLocation ?? LEANFIRE_DEFAULTS.selectedLocation,
          barebonesExpenses: updates.barebonesExpenses ?? DEFAULT_BAREBONES_REYKJAVIK,
          expenseSource: updates.expenseSource ?? 'default' as const,
          fiMultiplier: updates.fiMultiplier ?? LEANFIRE_DEFAULTS.fiMultiplier,
          reductionScenarios: updates.reductionScenarios ?? [],
          currentSavings: updates.currentSavings ?? null,
          currentAge: updates.currentAge ?? null,
          savingsRate: updates.savingsRate ?? null,
          investmentReturn: updates.investmentReturn ?? LEANFIRE_DEFAULTS.investmentReturn,
          lastUpdated: new Date(),
          version: LEANFIRE_DEFAULTS.version,
        };
        return {
          ...defaults,
          ...updates,
        };
      }

      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Set selected geographic location
   */
  const setSelectedLocation = useCallback((location: GeographicLocation) => {
    updateLeanFireState({
      selectedLocation: location,
      barebonesExpenses: location === 'custom'
        ? undefined
        : getDefaultBarebonesExpenses(location as 'reykjavik' | 'landsbyggd'),
      expenseSource: location === 'custom' ? 'custom' : 'default',
    });
  }, [updateLeanFireState]);

  /**
   * Set FI multiplier (25x or 30x)
   */
  const setFIMultiplier = useCallback((multiplier: FIMultiplier) => {
    updateLeanFireState({ fiMultiplier: multiplier });
  }, [updateLeanFireState]);

  /**
   * Add a reduction scenario
   */
  const addReductionScenario = useCallback((scenario: Omit<ReductionScenario, 'id' | 'order'>) => {
    setLeanFire((prev) => {
      if (!prev) return prev;

      const newScenario: ReductionScenario = {
        ...scenario,
        id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: prev.reductionScenarios.length,
      };

      return {
        ...prev,
        reductionScenarios: [...prev.reductionScenarios, newScenario],
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Remove a reduction scenario by ID
   */
  const removeReductionScenario = useCallback((id: string) => {
    setLeanFire((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        reductionScenarios: prev.reductionScenarios.filter((s) => s.id !== id),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Update a reduction scenario
   */
  const updateReductionScenario = useCallback((id: string, updates: Partial<ReductionScenario>) => {
    setLeanFire((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        reductionScenarios: prev.reductionScenarios.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /**
   * Toggle a frugality tip (mark as implemented/not implemented)
   */
  const toggleFrugalityTip = useCallback((tipId: string) => {
    // This will be used by the FrugalityOptimizer component
    // to mark tips as implemented and apply their savings
    console.log('Toggle frugality tip:', tipId);
    // Implementation will depend on how frugality tips are stored
  }, []);

  /**
   * Clear all LeanFIRE data
   */
  const clearLeanFire = useCallback(() => {
    setLeanFire(null);
  }, []);

  /**
   * Initialize LeanFIRE with defaults
   */
  const initializeLeanFire = useCallback(() => {
    // Check if expense baseline exists and use barebones tier
    const barebonesExpenses = expenseBaseline
      ? DEFAULT_BAREBONES_REYKJAVIK
      : DEFAULT_BAREBONES_REYKJAVIK;

    const initialState: LeanFireState = {
      selectedLocation: LEANFIRE_DEFAULTS.selectedLocation,
      barebonesExpenses,
      expenseSource: expenseBaseline ? 'baseline' : 'default',
      fiMultiplier: LEANFIRE_DEFAULTS.fiMultiplier,
      reductionScenarios: [],
      currentSavings: null,
      currentAge: null,
      savingsRate: null,
      investmentReturn: LEANFIRE_DEFAULTS.investmentReturn,
      lastUpdated: new Date(),
      version: LEANFIRE_DEFAULTS.version,
    };

    setLeanFire(initialState);
  }, [expenseBaseline]);

  // ===== LEANFIRE INTEGRATION API =====

  /**
   * Get LeanFIRE state (integration API)
   */
  const getLeanFireState = useCallback(() => {
    return leanFire;
  }, [leanFire]);

  /**
   * Check if LeanFIRE state exists
   */
  const hasLeanFire = useCallback(() => {
    return leanFire !== null;
  }, [leanFire]);

  // ===== FIRE TYPE EXPLORER FUNCTIONS =====

  const updateFIRETypePreferences = useCallback((updates: Partial<FIRETypePreferences>) => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: updates.selectedType ?? null,
          customAssumptions: updates.customAssumptions ?? {},
          showAllTypes: updates.showAllTypes ?? true,
          expandedSections: updates.expandedSections ?? [],
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const setSelectedType = useCallback((type: FIRETypeId | null) => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: type,
          customAssumptions: {},
          showAllTypes: true,
          expandedSections: [],
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        selectedType: type,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const setCustomAssumptions = useCallback((assumptions: Partial<FIREAssumptions>) => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: null,
          customAssumptions: assumptions,
          showAllTypes: true,
          expandedSections: [],
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        customAssumptions: {
          ...prev.customAssumptions,
          ...assumptions,
        },
        lastUpdated: new Date(),
      };
    });
  }, []);

  const toggleShowAllTypes = useCallback(() => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: null,
          customAssumptions: {},
          showAllTypes: false,
          expandedSections: [],
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        showAllTypes: !prev.showAllTypes,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const toggleExpandedSection = useCallback((sectionId: string) => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: null,
          customAssumptions: {},
          showAllTypes: true,
          expandedSections: [sectionId],
          lastUpdated: new Date(),
        };
      }
      const isExpanded = prev.expandedSections.includes(sectionId);
      return {
        ...prev,
        expandedSections: isExpanded
          ? prev.expandedSections.filter((id) => id !== sectionId)
          : [...prev.expandedSections, sectionId],
        lastUpdated: new Date(),
      };
    });
  }, []);

  const clearFIRETypePreferences = useCallback(() => {
    setFireTypePreferences(null);
  }, []);

  const initializeFIRETypePreferences = useCallback(() => {
    setFireTypePreferences({
      selectedType: null,
      customAssumptions: {},
      showAllTypes: true,
      expandedSections: [],
      lastUpdated: new Date(),
    });
  }, []);

  const getFIRETypePreferences = useCallback(() => {
    return fireTypePreferences;
  }, [fireTypePreferences]);

  const hasFIRETypePreferences = useCallback(() => {
    return fireTypePreferences !== null;
  }, [fireTypePreferences]);

  /**
   * Update FIRE assumptions (alias for setCustomAssumptions for consistency)
   * Merges partial updates into existing custom assumptions
   */
  const updateFIREAssumptions = useCallback((assumptions: Partial<FIREAssumptions>) => {
    setCustomAssumptions(assumptions);
  }, [setCustomAssumptions]);

  /**
   * Select a FIRE type (alias for setSelectedType for consistency)
   */
  const selectFIREType = useCallback((type: FIRETypeId) => {
    setSelectedType(type);
  }, [setSelectedType]);

  /**
   * Reset FIRE assumptions to defaults
   * Clears all custom assumptions
   */
  const resetFIREAssumptions = useCallback(() => {
    setFireTypePreferences((prev) => {
      if (!prev) {
        return {
          selectedType: null,
          customAssumptions: {},
          showAllTypes: true,
          expandedSections: [],
          lastUpdated: new Date(),
        };
      }
      return {
        ...prev,
        customAssumptions: {},
        lastUpdated: new Date(),
      };
    });
  }, []);

  // Persistence functions
  const saveToStorage = useCallback(() => {
    const state: StoredState = {
      version: STORAGE_VERSION,
      currentInputs: inputs,
      scenarios,
      subscriptions,
      commuteScenarios,
      housingScenarios,
      mealCostData,
      convenienceExpenses,
      convenienceGoal: convenienceGoal ?? undefined,
      childcareItems,
      periods,
      carOwnershipScenarios,
      emergencyFundData: emergencyFundData ?? undefined,
      expenseBaseline: expenseBaseline
        ? {
            categories: expenseBaseline.categories,
            lastUpdated: expenseBaseline.lastUpdated.toISOString(),
            wizardCompleted: expenseBaseline.wizardCompleted,
            version: expenseBaseline.version,
          }
        : undefined,
      savingsReport: savingsReport
        ? {
            categories: savingsReport.categories,
            lastUpdated: savingsReport.lastUpdated.toISOString(),
            version: savingsReport.version,
          }
        : undefined,
      fiNumberBuilder: fiNumberBuilder
        ? {
            ...fiNumberBuilder,
            lastUpdated: fiNumberBuilder.lastUpdated.toISOString(),
          }
        : undefined,
      fireTypePreferences: fireTypePreferences
        ? {
            selectedType: fireTypePreferences.selectedType,
            customAssumptions: fireTypePreferences.customAssumptions,
            showAllTypes: fireTypePreferences.showAllTypes,
            expandedSections: fireTypePreferences.expandedSections,
            lastUpdated: fireTypePreferences.lastUpdated.toISOString(),
          }
        : undefined,
      fatFireState: fatFireState
        ? {
            useExpenseBaseline: fatFireState.useExpenseBaseline,
            selectedTier: fatFireState.selectedTier,
            customMonthlyExpense: fatFireState.customMonthlyExpense,
            wishListItems: fatFireState.wishListItems.map(item => ({
              id: item.id,
              category: item.category,
              name: item.name,
              monthlyCost: item.monthlyCost,
              priority: item.priority,
              description: item.description,
              createdAt: item.createdAt.toISOString(),
            })),
            splurgeBudgetAnnual: fatFireState.splurgeBudgetAnnual,
            multiplier: fatFireState.multiplier,
            customMultiplier: fatFireState.customMultiplier,
            currentSavings: fatFireState.currentSavings,
            expectedReturnRate: fatFireState.expectedReturnRate,
            annualSavings: fatFireState.annualSavings,
            scenarios: fatFireState.scenarios,
            lastUpdated: fatFireState.lastUpdated.toISOString(),
          }
        : undefined,
      baristaFire: baristaFireState
        ? {
            ...baristaFireState,
          }
        : undefined,
      leanFire: leanFire
        ? {
            ...leanFire,
            lastUpdated: leanFire.lastUpdated.toISOString(),
          }
        : undefined,
      coastFire: coastFireState
        ? {
            ...coastFireState,
          }
        : undefined,
      retirementSimulator: retirementSimulator
        ? {
            ...retirementSimulator,
          }
        : undefined,
      lastUpdated: new Date().toISOString(),
    };
    safeSetItem(STORAGE_KEY, state);
  }, [inputs, scenarios, subscriptions, commuteScenarios, housingScenarios, mealCostData, convenienceExpenses, convenienceGoal, childcareItems, periods, carOwnershipScenarios, emergencyFundData, expenseBaseline, savingsReport, fiNumberBuilder, fireTypePreferences, fatFireState, baristaFireState, leanFire, coastFireState, retirementSimulator]);

  const loadFromStorage = useCallback(() => {
    const stored = safeGetItem<StoredState>(STORAGE_KEY);
    if (stored && stored.version === STORAGE_VERSION) {
      setInputs(stored.currentInputs);
      setScenarios(stored.scenarios || []);
      setSubscriptions(stored.subscriptions || []);
      // Load mealCostData with fallback to defaults for backwards compatibility
      if (stored.mealCostData) {
        setMealCostData(stored.mealCostData);
      }
      // Load commute scenarios
      setCommuteScenarios(stored.commuteScenarios || []);
      // Load convenience expenses and goal
      setConvenienceExpenses(stored.convenienceExpenses || []);
      setConvenienceGoalState(stored.convenienceGoal || null);
      // Load childcare items
      setChildcareItems(stored.childcareItems || []);
      // Load housing scenarios
      setHousingScenarios(stored.housingScenarios || []);
      // Load periods
      setPeriodsState(stored.periods || []);
      // Load car ownership scenarios
      setCarOwnershipScenarios(stored.carOwnershipScenarios || []);
      // Load emergency fund data
      if (stored.emergencyFundData) {
        setEmergencyFundData({
          ...stored.emergencyFundData,
          lastUpdated: new Date(stored.emergencyFundData.lastUpdated),
        });
      }
      // Load expense baseline
      if (stored.expenseBaseline) {
        setExpenseBaseline({
          categories: stored.expenseBaseline.categories,
          lastUpdated: new Date(stored.expenseBaseline.lastUpdated),
          wizardCompleted: stored.expenseBaseline.wizardCompleted,
          version: stored.expenseBaseline.version,
        });
      }
      // Load savings report
      if (stored.savingsReport) {
        setSavingsReport({
          categories: stored.savingsReport.categories,
          lastUpdated: new Date(stored.savingsReport.lastUpdated),
          version: stored.savingsReport.version,
        });
      }
      // Load FI Number Builder state
      if (stored.fiNumberBuilder) {
        setFINumberBuilder({
          ...stored.fiNumberBuilder,
          // Ensure new fields have defaults for backward compatibility
          occupationalPension: stored.fiNumberBuilder.occupationalPension ?? FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
          sereignBalance: stored.fiNumberBuilder.sereignBalance ?? FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
          lastUpdated: new Date(stored.fiNumberBuilder.lastUpdated),
        });
      }
      // Load FIRE Type Explorer preferences
      if (stored.fireTypePreferences) {
        setFireTypePreferences({
          selectedType: stored.fireTypePreferences.selectedType,
          customAssumptions: stored.fireTypePreferences.customAssumptions,
          showAllTypes: stored.fireTypePreferences.showAllTypes,
          expandedSections: stored.fireTypePreferences.expandedSections,
          lastUpdated: new Date(stored.fireTypePreferences.lastUpdated),
        });
      }
      // Load FatFIRE state
      if (stored.fatFireState) {
        setFatFireState({
          useExpenseBaseline: stored.fatFireState.useExpenseBaseline,
          selectedTier: stored.fatFireState.selectedTier,
          customMonthlyExpense: stored.fatFireState.customMonthlyExpense,
          wishListItems: stored.fatFireState.wishListItems.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
          })),
          splurgeBudgetAnnual: stored.fatFireState.splurgeBudgetAnnual,
          multiplier: stored.fatFireState.multiplier,
          customMultiplier: stored.fatFireState.customMultiplier,
          currentSavings: stored.fatFireState.currentSavings,
          expectedReturnRate: stored.fatFireState.expectedReturnRate,
          annualSavings: stored.fatFireState.annualSavings,
          scenarios: stored.fatFireState.scenarios,
          lastUpdated: new Date(stored.fatFireState.lastUpdated),
        });
      }
      // Load Barista FIRE state (lastUpdated is already a string)
      if (stored.baristaFire) {
        setBaristaFireState({
          ...stored.baristaFire,
        });
      }
      // Load LeanFIRE state
      if (stored.leanFire) {
        setLeanFire({
          ...stored.leanFire,
          lastUpdated: new Date(stored.leanFire.lastUpdated),
        });
      }
      // Load Coast FIRE state
      if (stored.coastFire) {
        setCoastFireState(stored.coastFire);
      }
      // Load Retirement Simulator state
      if (stored.retirementSimulator) {
        setRetirementSimulator(stored.retirementSimulator);
      }
    }
  }, []);

  const exportDataHandler = useCallback(() => {
    const state: StoredState = {
      version: STORAGE_VERSION,
      currentInputs: inputs,
      scenarios,
      subscriptions,
      commuteScenarios,
      housingScenarios,
      mealCostData,
      convenienceExpenses,
      convenienceGoal: convenienceGoal ?? undefined,
      childcareItems,
      periods,
      carOwnershipScenarios,
      emergencyFundData: emergencyFundData ?? undefined,
      expenseBaseline: expenseBaseline
        ? {
            categories: expenseBaseline.categories,
            lastUpdated: expenseBaseline.lastUpdated.toISOString(),
            wizardCompleted: expenseBaseline.wizardCompleted,
            version: expenseBaseline.version,
          }
        : undefined,
      savingsReport: savingsReport
        ? {
            categories: savingsReport.categories,
            lastUpdated: savingsReport.lastUpdated.toISOString(),
            version: savingsReport.version,
          }
        : undefined,
      fiNumberBuilder: fiNumberBuilder
        ? {
            ...fiNumberBuilder,
            lastUpdated: fiNumberBuilder.lastUpdated.toISOString(),
          }
        : undefined,
      fireTypePreferences: fireTypePreferences
        ? {
            selectedType: fireTypePreferences.selectedType,
            customAssumptions: fireTypePreferences.customAssumptions,
            showAllTypes: fireTypePreferences.showAllTypes,
            expandedSections: fireTypePreferences.expandedSections,
            lastUpdated: fireTypePreferences.lastUpdated.toISOString(),
          }
        : undefined,
      fatFireState: fatFireState
        ? {
            useExpenseBaseline: fatFireState.useExpenseBaseline,
            selectedTier: fatFireState.selectedTier,
            customMonthlyExpense: fatFireState.customMonthlyExpense,
            wishListItems: fatFireState.wishListItems.map(item => ({
              id: item.id,
              category: item.category,
              name: item.name,
              monthlyCost: item.monthlyCost,
              priority: item.priority,
              description: item.description,
              createdAt: item.createdAt.toISOString(),
            })),
            splurgeBudgetAnnual: fatFireState.splurgeBudgetAnnual,
            multiplier: fatFireState.multiplier,
            customMultiplier: fatFireState.customMultiplier,
            currentSavings: fatFireState.currentSavings,
            expectedReturnRate: fatFireState.expectedReturnRate,
            annualSavings: fatFireState.annualSavings,
            scenarios: fatFireState.scenarios,
            lastUpdated: fatFireState.lastUpdated.toISOString(),
          }
        : undefined,
      baristaFire: baristaFireState
        ? {
            ...baristaFireState,
          }
        : undefined,
      leanFire: leanFire
        ? {
            ...leanFire,
            lastUpdated: leanFire.lastUpdated.toISOString(),
          }
        : undefined,
      coastFire: coastFireState
        ? {
            ...coastFireState,
          }
        : undefined,
      retirementSimulator: retirementSimulator
        ? {
            ...retirementSimulator,
          }
        : undefined,
      lastUpdated: new Date().toISOString(),
    };

    // Create JSON blob
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    const filename = `life-energy-calculator-${date}.json`;

    // Trigger download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    // Clean up
    URL.revokeObjectURL(url);
  }, [inputs, scenarios, subscriptions, commuteScenarios, housingScenarios, mealCostData, convenienceExpenses, convenienceGoal, childcareItems, periods, carOwnershipScenarios, emergencyFundData, expenseBaseline, savingsReport, fiNumberBuilder, fireTypePreferences, fatFireState, baristaFireState, leanFire, coastFireState, retirementSimulator]);

  const importDataHandler = useCallback(async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          // Parse JSON
          const result = event.target?.result;
          if (typeof result !== 'string') {
            reject(new Error('Failed to read file contents'));
            return;
          }

          const data = JSON.parse(result) as StoredState;

          // Validate structure
          if (!data.version || !data.currentInputs) {
            reject(
              new Error(
                'Invalid file format. Please select a valid backup file.'
              )
            );
            return;
          }

          // Check version compatibility
          if (data.version !== STORAGE_VERSION) {
            reject(
              new Error(
                'Incompatible file version. Please export your data again from the latest version.'
              )
            );
            return;
          }

          // Load data
          setInputs(data.currentInputs);
          setScenarios(data.scenarios || []);
          setSubscriptions(data.subscriptions || []);
          // Load mealCostData with fallback to defaults for backwards compatibility
          if (data.mealCostData) {
            setMealCostData(data.mealCostData);
          }
          // Load commute scenarios
          setCommuteScenarios(data.commuteScenarios || []);
          // Load convenience expenses and goal
          setConvenienceExpenses(data.convenienceExpenses || []);
          setConvenienceGoalState(data.convenienceGoal || null);
          // Load childcare items
          setChildcareItems(data.childcareItems || []);
          // Load housing scenarios
          setHousingScenarios(data.housingScenarios || []);
          // Load periods
          setPeriodsState(data.periods || []);
          // Load car ownership scenarios
          setCarOwnershipScenarios(data.carOwnershipScenarios || []);
          // Load emergency fund data
          if (data.emergencyFundData) {
            setEmergencyFundData({
              ...data.emergencyFundData,
              lastUpdated: new Date(data.emergencyFundData.lastUpdated),
            });
          }
          // Load expense baseline
          if (data.expenseBaseline) {
            setExpenseBaseline({
              categories: data.expenseBaseline.categories,
              lastUpdated: new Date(data.expenseBaseline.lastUpdated),
              wizardCompleted: data.expenseBaseline.wizardCompleted,
              version: data.expenseBaseline.version,
            });
          }
          // Load savings report
          if (data.savingsReport) {
            setSavingsReport({
              categories: data.savingsReport.categories,
              lastUpdated: new Date(data.savingsReport.lastUpdated),
              version: data.savingsReport.version,
            });
          }
          // Load FI Number Builder state
          if (data.fiNumberBuilder) {
            setFINumberBuilder({
              ...data.fiNumberBuilder,
              // Ensure new fields have defaults for backward compatibility
              occupationalPension: data.fiNumberBuilder.occupationalPension ?? FI_NUMBER_DEFAULTS.OCCUPATIONAL_PENSION,
              sereignBalance: data.fiNumberBuilder.sereignBalance ?? FI_NUMBER_DEFAULTS.SEREIGN_BALANCE,
              lastUpdated: new Date(data.fiNumberBuilder.lastUpdated),
            });
          }
          // Load FIRE Type Explorer preferences
          if (data.fireTypePreferences) {
            setFireTypePreferences({
              selectedType: data.fireTypePreferences.selectedType,
              customAssumptions: data.fireTypePreferences.customAssumptions,
              showAllTypes: data.fireTypePreferences.showAllTypes,
              expandedSections: data.fireTypePreferences.expandedSections,
              lastUpdated: new Date(data.fireTypePreferences.lastUpdated),
            });
          }
          // Load FatFIRE state
          if (data.fatFireState) {
            setFatFireState({
              useExpenseBaseline: data.fatFireState.useExpenseBaseline,
              selectedTier: data.fatFireState.selectedTier,
              customMonthlyExpense: data.fatFireState.customMonthlyExpense,
              wishListItems: data.fatFireState.wishListItems.map(item => ({
                ...item,
                createdAt: new Date(item.createdAt),
              })),
              splurgeBudgetAnnual: data.fatFireState.splurgeBudgetAnnual,
              multiplier: data.fatFireState.multiplier,
              customMultiplier: data.fatFireState.customMultiplier,
              currentSavings: data.fatFireState.currentSavings,
              expectedReturnRate: data.fatFireState.expectedReturnRate,
              annualSavings: data.fatFireState.annualSavings,
              scenarios: data.fatFireState.scenarios,
              lastUpdated: new Date(data.fatFireState.lastUpdated),
            });
          }
          // Load Barista FIRE state (lastUpdated is already a string)
          if (data.baristaFire) {
            setBaristaFireState({
              ...data.baristaFire,
            });
          }
          // Load LeanFIRE state
          if (data.leanFire) {
            setLeanFire({
              ...data.leanFire,
              lastUpdated: new Date(data.leanFire.lastUpdated),
            });
          }
          // Load Coast FIRE state
          if (data.coastFire) {
            setCoastFireState(data.coastFire);
          }
          // Load Retirement Simulator state
          if (data.retirementSimulator) {
            setRetirementSimulator(data.retirementSimulator);
          }

          resolve();
        } catch (error) {
          if (error instanceof SyntaxError) {
            reject(
              new Error(
                'Failed to parse file. The file may be corrupted or not a valid JSON file.'
              )
            );
          } else if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error('An unexpected error occurred while importing data'));
          }
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file. Please try again.'));
      };

      // Read file as text
      reader.readAsText(file);
    });
  }, []);

  const resetAll = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setScenarios([]);
    setSubscriptions([]);
    setMealCostData({
      eatingOut: DEFAULT_EATING_OUT_DATA,
      homeCooking: DEFAULT_HOME_COOKING_DATA,
    });
    setCommuteScenarios([]);
    setConvenienceExpenses([]);
    setConvenienceGoalState(null);
    setCarOwnershipScenarios([]);
    setChildcareItems([]);
    setHousingScenarios([]);
    setPeriodsState([]);
    setEmergencyFundData(null);
    setExpenseBaseline(null);
    setCurrentExpenses(null);
    setSavingsReport(null);
    setFINumberBuilder(null);
    setFireTypePreferences(null);
    setFatFireState(null);
    setBaristaFireState(null);
    setLeanFire(null);
    setCoastFireState(null);
    setRetirementSimulator(null);
  }, []);

  // Preset application
  const applyPreset = useCallback(
    (preset: Preset) => {
      const updates: Partial<MoneyExpenses & TimeExpenses> = {};

      // Apply preset values based on category
      if (preset.category === 'commute' && preset.values.commute !== undefined) {
        updates.commute = preset.values.commute;
      }
      if (
        preset.category === 'clothing' &&
        preset.values.clothing !== undefined
      ) {
        updates.clothing = preset.values.clothing;
      }
      if (preset.category === 'meals' && preset.values.meals !== undefined) {
        updates.meals = preset.values.meals;
      }

      // Apply to money expenses (commute, clothing, meals are money expenses)
      if (
        updates.commute !== undefined ||
        updates.clothing !== undefined ||
        updates.meals !== undefined
      ) {
        updateMoneyExpenses(updates as Partial<MoneyExpenses>);
      }
    },
    [updateMoneyExpenses]
  );

  // ===== COAST FIRE FUNCTIONS =====

  /**
   * Update Coast FIRE state with partial data
   */
  const updateCoastFireState = useCallback((updates: Partial<CoastFIREState>) => {
    setCoastFireState((prev) => {
      if (!prev) {
        // Initialize with defaults if no state exists
        return {
          ...COAST_FIRE_DEFAULTS,
          ...updates,
          lastUpdated: new Date().toISOString(),
          version: 1,
        };
      }
      return {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Set current age for Coast FIRE
   */
  const setCoastCurrentAge = useCallback((age: number) => {
    updateCoastFireState({ currentAge: age });
  }, [updateCoastFireState]);

  /**
   * Set current investments amount
   */
  const setCoastCurrentInvestments = useCallback((amount: number) => {
    updateCoastFireState({ currentInvestments: amount });
  }, [updateCoastFireState]);

  /**
   * Set target retirement age
   */
  const setCoastTargetRetirementAge = useCallback((age: number) => {
    updateCoastFireState({ targetRetirementAge: age });
  }, [updateCoastFireState]);

  /**
   * Set expected return rate
   */
  const setCoastExpectedReturn = useCallback((rate: number) => {
    updateCoastFireState({ expectedReturn: rate });
  }, [updateCoastFireState]);

  /**
   * Set FI number (manual or calculated)
   */
  const setCoastFINumber = useCallback((amount: number | null) => {
    updateCoastFireState({ fiNumber: amount });
  }, [updateCoastFireState]);

  /**
   * Set FI number source (manual or baseline)
   */
  const setCoastFINumberSource = useCallback((source: FINumberSource) => {
    updateCoastFireState({ fiNumberSource: source });
  }, [updateCoastFireState]);

  /**
   * Set selected expense tier (when using baseline)
   */
  const setCoastSelectedTier = useCallback((tier: ExpenseTier | null) => {
    setCoastFireState((prev) => {
      if (!prev) {
        return {
          ...COAST_FIRE_DEFAULTS,
          selectedTier: tier,
          fiNumberSource: 'baseline',
          lastUpdated: new Date().toISOString(),
          version: 1,
        };
      }

      // Calculate FI number from baseline if tier is selected
      if (tier && expenseBaseline) {
        const monthlyExpenses = getExpenseByTierHelper(expenseBaseline, tier);
        const annualExpenses = monthlyExpenses * 12;
        const fiNumber = annualExpenses * prev.fiMultiplier;

        return {
          ...prev,
          selectedTier: tier,
          fiNumberSource: 'baseline',
          fiNumber,
          lastUpdated: new Date().toISOString(),
        };
      }

      return {
        ...prev,
        selectedTier: tier,
        fiNumberSource: tier ? 'baseline' : 'manual',
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [expenseBaseline]);

  /**
   * Set FI multiplier (25x, 30x, etc.)
   */
  const setCoastFIMultiplier = useCallback((multiplier: number) => {
    setCoastFireState((prev) => {
      if (!prev) {
        return {
          ...COAST_FIRE_DEFAULTS,
          fiMultiplier: multiplier,
          lastUpdated: new Date().toISOString(),
          version: 1,
        };
      }

      // Recalculate FI number if using baseline
      if (prev.fiNumberSource === 'baseline' && prev.selectedTier && expenseBaseline) {
        const monthlyExpenses = getExpenseByTierHelper(expenseBaseline, prev.selectedTier);
        const annualExpenses = monthlyExpenses * 12;
        const fiNumber = annualExpenses * multiplier;

        return {
          ...prev,
          fiMultiplier: multiplier,
          fiNumber,
          lastUpdated: new Date().toISOString(),
        };
      }

      return {
        ...prev,
        fiMultiplier: multiplier,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [expenseBaseline]);

  /**
   * Clear all Coast FIRE data
   */
  const clearCoastFireState = useCallback(() => {
    setCoastFireState(null);
  }, []);

  /**
   * Initialize Coast FIRE state with defaults
   */
  const initializeCoastFireState = useCallback(() => {
    setCoastFireState({
      ...COAST_FIRE_DEFAULTS,
      lastUpdated: new Date().toISOString(),
      version: 1,
    });
  }, []);

  /**
   * Get Coast FIRE state (integration API)
   */
  const getCoastFireState = useCallback(() => {
    return coastFireState;
  }, [coastFireState]);

  /**
   * Check if Coast FIRE state exists
   */
  const hasCoastFireState = useCallback(() => {
    return coastFireState !== null && coastFireState.fiNumber !== null;
  }, [coastFireState]);

  // ===== RETIREMENT SIMULATOR FUNCTIONS =====

  /**
   * Update retirement simulation with partial data
   */
  const updateRetirementSimulator = useCallback(
    (updates: Partial<RetirementSimulation>) => {
      setRetirementSimulator((prev) => {
        if (!prev) {
          // Initialize with defaults if no state exists
          const now = new Date();
          const retirementDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

          return {
            simulation: {
              retirementDate,
              currentAge: 35,
              currentDate: now,
              lifeExpectancy: 92,
              portfolio: {
                currentBalance: 0,
                monthlySavings: 0,
                expectedRealReturn: 0.07,
                inflationRate: 0.03,
                returnVolatility: 0.18,
              },
              expenses: {
                source: 'manual',
                monthlyExpenses: 0,
                retirementAdjustment: 1.0,
              },
              pensions: {
                lifeyrissjodur: {
                  enabled: false,
                  startAge: 60,
                  monthlyAmount: 150000,
                  inflationAdjusted: true,
                },
                sereign: {
                  enabled: false,
                  startAge: 60,
                  monthlyAmount: 100000,
                  inflationAdjusted: true,
                },
                ellilifeyrir: {
                  enabled: false,
                  startAge: 67,
                  monthlyAmount: 200000,
                  inflationAdjusted: true,
                },
              },
              assumptions: {
                scenarioCount: 1000,
                simulationType: 'monteCarlo',
                returnDistribution: 'lognormal',
                sequenceRiskEnabled: true,
              },
              withdrawalStrategy: {
                type: '4percent',
                rate: 0.04,
                inflationAdjusted: true,
              },
              ...updates,
            },
            results: null,
            comparisons: [],
            lastUpdated: new Date().toISOString(),
            version: 1,
          };
        }

        return {
          ...prev,
          simulation: {
            ...prev.simulation,
            ...updates,
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const setRetirementDate = useCallback(
    (date: Date) => {
      updateRetirementSimulator({ retirementDate: date });
    },
    [updateRetirementSimulator]
  );

  const setCurrentAge = useCallback(
    (age: number) => {
      updateRetirementSimulator({ currentAge: age });
    },
    [updateRetirementSimulator]
  );

  const setLifeExpectancy = useCallback(
    (age: number) => {
      updateRetirementSimulator({ lifeExpectancy: age });
    },
    [updateRetirementSimulator]
  );

  const updatePortfolio = useCallback((portfolio: Partial<PortfolioInput>) => {
    setRetirementSimulator((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        simulation: {
          ...prev.simulation,
          portfolio: {
            ...prev.simulation.portfolio,
            ...portfolio,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const updateExpenses = useCallback((expenses: Partial<ExpenseInput>) => {
    setRetirementSimulator((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        simulation: {
          ...prev.simulation,
          expenses: {
            ...prev.simulation.expenses,
            ...expenses,
          },
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const updatePensions = useCallback(
    (pensions: Partial<IcelandicPensionInput>) => {
      setRetirementSimulator((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          simulation: {
            ...prev.simulation,
            pensions: {
              lifeyrissjodur: {
                ...prev.simulation.pensions.lifeyrissjodur,
                ...(pensions.lifeyrissjodur || {}),
              },
              sereign: {
                ...prev.simulation.pensions.sereign,
                ...(pensions.sereign || {}),
              },
              ellilifeyrir: {
                ...prev.simulation.pensions.ellilifeyrir,
                ...(pensions.ellilifeyrir || {}),
              },
            },
          },
          lastUpdated: new Date().toISOString(),
        };
      });
    },
    []
  );

  const setWithdrawalStrategy = useCallback(
    (strategy: WithdrawalStrategy) => {
      updateRetirementSimulator({ withdrawalStrategy: strategy });
    },
    [updateRetirementSimulator]
  );

  const addComparisonScenario = useCallback((scenario: ComparisonScenario) => {
    setRetirementSimulator((prev) => {
      if (!prev) return prev;
      // Max 3 comparison scenarios
      if (prev.comparisons.length >= 3) {
        console.warn('Maximum 3 comparison scenarios allowed');
        return prev;
      }
      return {
        ...prev,
        comparisons: [...prev.comparisons, scenario],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const removeComparisonScenario = useCallback((id: string) => {
    setRetirementSimulator((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comparisons: prev.comparisons.filter((s) => s.id !== id),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const clearRetirementSimulator = useCallback(() => {
    setRetirementSimulator(null);
  }, []);

  // Integration API
  const getRetirementSimulator = useCallback(() => {
    return retirementSimulator;
  }, [retirementSimulator]);

  const hasRetirementSimulator = useCallback(() => {
    return retirementSimulator !== null;
  }, [retirementSimulator]);

  const value: CalculatorContextType = {
    inputs,
    setInputs,
    updateIncome,
    updateMoneyExpenses,
    updateTimeExpenses,
    results,
    scenarios,
    saveCurrentAsScenario,
    deleteScenario,
    loadScenario,
    subscriptions,
    subscriptionSummary,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscription,
    mealCostData,
    updateMealCostData,
    updateEatingOut,
    updateHomeCooking,
    mealCostSummary,
    commuteScenarios,
    addCommuteScenario,
    updateCommuteScenario,
    deleteCommuteScenario,
    duplicateCommuteScenario,
    convenienceExpenses,
    expenseSummary,
    convenienceGoal,
    addConvenienceExpense,
    updateConvenienceExpense,
    deleteConvenienceExpense,
    setConvenienceGoal,
    deleteConvenienceGoal,
    childcareItems,
    childcareSummary,
    addChildcareItem,
    updateChildcareItem,
    deleteChildcareItem,
    housingScenarios,
    addHousingScenario,
    updateHousingScenario,
    deleteHousingScenario,
    duplicateHousingScenario,
    periods,
    addPeriod,
    updatePeriod,
    deletePeriod,
    carOwnershipScenarios,
    addCarOwnershipScenario,
    updateCarOwnershipScenario,
    deleteCarOwnershipScenario,
    duplicateCarOwnershipScenario,
    emergencyFundData,
    emergencyFundResults,
    updateEmergencyFundData,
    clearEmergencyFundData,
    expenseBaseline,
    expenseBaselineResults,
    updateExpenseBaseline,
    updateCategoryValues,
    addCustomCategory,
    removeCategory,
    toggleCategoryVisibility,
    resetExpenseBaselineToDefaults,
    clearExpenseBaseline,
    getExpenseBaseline,
    getExpenseByTier,
    hasExpenseBaseline: hasExpenseBaselineFunc,
    currentExpenses,
    currentExpenseResults,
    updateCurrentExpenses,
    addCurrentExpenseLineItem,
    updateCurrentExpenseLineItem,
    deleteCurrentExpenseLineItem,
    addCurrentExpenseCategory,
    removeCurrentExpenseCategory,
    toggleCurrentExpenseCategoryVisibility,
    clearCurrentExpenses,
    getCurrentExpenses,
    getExpensesByCategory,
    getSubscriptions,
    getCommuteExpenses,
    getHousingExpenses,
    hasCurrentExpenses,
    savingsReport,
    savingsReportResults,
    updateSavingsReport,
    updateSavingsCategory,
    toggleSavingsCategoryVisibility,
    clearSavingsReport,
    initializeSavingsReport,
    getSavingsReport,
    getTotalSavings,
    getTotalMonthlyContribution,
    getSavingsRate,
    hasSavingsReport,
    fiNumberBuilder,
    fiNumberResults,
    updateFINumberState,
    setExpenseSource,
    setSelectedTier,
    setCustomMonthlyExpense,
    setMultiplier,
    setPensionIncome,
    setTargetRetirementAge,
    setOccupationalPension,
    setSereignBalance,
    clearFINumberBuilder,
    initializeFINumberBuilder,
    getFINumberBuilder,
    hasFINumber,
    // FatFIRE Planner
    fatFireState,
    fatFireResults,
    updateFatFireState,
    addWishListItem,
    updateWishListItem,
    removeWishListItem,
    setSplurgeBudget,
    addScenario,
    removeScenario,
    clearFatFireState,
    initializeFatFireState,
    getFatFireState,
    hasFatFireState,
    // Barista FIRE Planner
    baristaFireState,
    baristaFireResults,
    updateBaristaFireState,
    setFINumber,
    setCurrentSavings,
    addBaristaFireScenario,
    removeBaristaFireScenario,
    updateBaristaFireScenario,
    clearBaristaFireState,
    initializeBaristaFireState,
    getBaristaFireState,
    hasBaristaFireState,
    // LeanFIRE Planner
    leanFire,
    leanFireResults,
    updateLeanFireState,
    setSelectedLocation,
    setFIMultiplier,
    addReductionScenario,
    removeReductionScenario,
    updateReductionScenario,
    toggleFrugalityTip,
    clearLeanFire,
    initializeLeanFire,
    getLeanFireState,
    hasLeanFire,
    fireTypePreferences,
    updateFIRETypePreferences,
    setSelectedType,
    setCustomAssumptions,
    updateFIREAssumptions,
    selectFIREType,
    resetFIREAssumptions,
    toggleShowAllTypes,
    toggleExpandedSection,
    clearFIRETypePreferences,
    initializeFIRETypePreferences,
    getFIRETypePreferences,
    hasFIRETypePreferences,
    coastFireState,
    coastFireResults,
    updateCoastFireState,
    setCoastCurrentAge,
    setCoastCurrentInvestments,
    setCoastTargetRetirementAge,
    setCoastExpectedReturn,
    setCoastFINumber,
    setCoastFINumberSource,
    setCoastSelectedTier,
    setCoastFIMultiplier,
    clearCoastFireState,
    initializeCoastFireState,
    getCoastFireState,
    hasCoastFireState,
    // Retirement Simulator
    retirementSimulator,
    updateRetirementSimulator,
    setRetirementDate,
    setCurrentAge,
    setLifeExpectancy,
    updatePortfolio,
    updateExpenses,
    updatePensions,
    setWithdrawalStrategy,
    addComparisonScenario,
    removeComparisonScenario,
    clearRetirementSimulator,
    getRetirementSimulator,
    hasRetirementSimulator,
    saveToStorage,
    loadFromStorage,
    exportData: exportDataHandler,
    importData: importDataHandler,
    resetAll,
    applyPreset,
    isHydrated,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

/**
 * Hook to use calculator context
 *
 * Must be used within a CalculatorProvider
 *
 * @throws Error if used outside CalculatorProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { inputs, updateIncome, results } = useCalculator();
 *   return <div>Actual wage: ${results?.actualHourlyWage}</div>
 * }
 * ```
 */
export function useCalculator(): CalculatorContextType {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
