/**
 * Default Values for Actual Hourly Wage Calculator
 *
 * This module provides default values for all calculator inputs,
 * storage configuration, and version tracking for migrations.
 *
 * UI CONVENTION: All money values are displayed as MONTHLY in the UI,
 * but stored as YEARLY internally for calculation accuracy.
 * Multiply monthly UI value by 12 before storing, divide by 12 for display.
 */

import type {
  IncomeInputs,
  MoneyExpenses,
  TimeExpenses,
  CalculatorInputs,
} from '@/types/calculator';

/**
 * Slider range configuration for quick settings (MONTHLY values in ISK)
 */
export const SLIDER_RANGES = {
  income: { min: 200_000, max: 2_000_000, step: 25_000 },
  commute: { min: 0, max: 120_000, step: 5_000 },
  commuteTime: { min: 0, max: 75, step: 5 }, // One-way minutes (0-75 min)
  clothing: { min: 0, max: 25_000, step: 2_500 },
  meals: { min: 0, max: 45_000, step: 2_500 },
  decompression: { min: 0, max: 50_000, step: 5_000 },
  childcareDelta: { min: 0, max: 150_000, step: 10_000 },
  other: { min: 0, max: 50_000, step: 5_000 },
} as const;

/**
 * Default income configuration
 *
 * Represents a typical full-time worker in Iceland with no additional income.
 * - 38 hours/week is the standard full-time work week in Iceland
 * - 24 vacation days is the standard in Iceland (minimum by law)
 * - Income values stored as yearly (UI displays monthly)
 */
export const DEFAULT_INCOME: IncomeInputs = {
  grossAnnualIncome: 0, // Stored yearly, UI shows monthly
  workHoursPerWeek: 38,
  vacationDays: 24,
  additionalIncome: 0, // Stored yearly, UI shows monthly
};

/**
 * Default work-related money expenses
 *
 * All values start at 0 to encourage users to enter their actual expenses.
 * Values stored as YEARLY internally, displayed as MONTHLY in UI.
 */
export const DEFAULT_MONEY_EXPENSES: MoneyExpenses = {
  commute: 0, // Yearly stored (UI shows monthly): gas, transit, parking, tolls
  clothing: 0, // Yearly stored (UI shows monthly): work-specific clothing
  meals: 0, // Yearly stored (UI shows monthly): lunches, coffee, snacks
  decompression: 0, // Yearly stored (UI shows monthly): "retail therapy" costs
  childcareDelta: 0, // Yearly stored (UI shows monthly): extra childcare costs
  other: 0, // Yearly stored (UI shows monthly): tools, dues, education, etc.
};

/**
 * Default work-related time expenses
 *
 * All values start at 0 to encourage users to enter their actual time costs.
 * These are weekly hours.
 */
export const DEFAULT_TIME_EXPENSES: TimeExpenses = {
  commute: 0, // Weekly hours: round-trip total
  gettingReady: 0, // Weekly hours: extra prep time for work (showering, dressing, etc.)
  decompression: 0, // Weekly hours: time needed to "recover" from work
  workIllness: 0, // Weekly hours: average sick time due to work stress/exposure
};

/**
 * Complete default calculator inputs
 *
 * Combines all default values into a single object matching the CalculatorInputs interface.
 * This is the initial state for a new calculator session.
 */
export const DEFAULT_INPUTS: CalculatorInputs = {
  income: DEFAULT_INCOME,
  moneyExpenses: DEFAULT_MONEY_EXPENSES,
  timeExpenses: DEFAULT_TIME_EXPENSES,
};

/**
 * Storage version for data migrations
 *
 * Increment this when the data structure changes to trigger migration logic.
 * Version 1: Initial implementation
 */
export const STORAGE_VERSION = 1;

/**
 * localStorage key for persisting calculator state
 *
 * Used by the storage layer to save and retrieve calculator data.
 */
export const STORAGE_KEY = 'actual-hourly-wage-calculator';

/**
 * Re-export period helpers for consistency
 */
export { DEFAULT_SPENDING, getEmptySpending, getTotalSpending } from './utils/periodHelpers';
