/**
 * Constants and default values for FI (Financial Independence) Calculator
 * Based on Icelandic financial planning conventions
 *
 * Note: Iceland recommends 30x multiplier (3.33% withdrawal) instead of US 25x (4%)
 * due to higher historical inflation (~4.4% vs ~2.5% in US)
 */

import type { FIInputs } from '@/types/fi';

/**
 * Default FI inputs
 */
export const DEFAULT_FI_INPUTS: FIInputs = {
  fiNumber: 0, // Must be calculated or entered
  annualIncome: 0, // From user
  annualExpenses: 0, // From user
  currentNetWorth: 0, // Optional
  expectedReturnRate: 7, // 7% default (conservative)
  fiMultiplier: 30, // 3.33% rule recommended for Iceland (30x expenses)
  currentSavingsRate: 0, // Calculated
};

/**
 * FI calculation constants and limits
 */
export const FI_CONSTANTS = {
  // Return rate limits
  MIN_RETURN_RATE: 0,
  MAX_RETURN_RATE: 15,
  DEFAULT_RETURN_RATE: 7,

  // FI multiplier limits (inverse of withdrawal rate)
  MIN_FI_MULTIPLIER: 20, // Aggressive (5% withdrawal)
  MAX_FI_MULTIPLIER: 40, // Conservative (2.5% withdrawal)
  DEFAULT_FI_MULTIPLIER: 30, // Recommended for Iceland (3.33% rule)

  // Savings rate limits
  MIN_SAVINGS_RATE: 0,
  MAX_SAVINGS_RATE: 100,

  // Scenario and snapshot limits
  MAX_SCENARIOS: 4, // Maximum comparison scenarios
  MAX_SNAPSHOTS: 100, // Maximum progress snapshots

  // Work hours constants (for life energy calculations)
  WORK_HOURS_PER_DAY: 8,
  WORK_DAYS_PER_YEAR: 250, // 50 weeks × 5 days
  WORK_HOURS_PER_YEAR: 2000, // 50 weeks × 40 hours
};

/**
 * Icelandic month names for date formatting
 */
export const ICELANDIC_MONTHS = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
] as const;

/**
 * Quick "what if" presets for common scenarios
 */
export const QUICK_WHAT_IF_PRESETS = [
  {
    type: 'expense-reduction' as const,
    label: 'Hvað ef ég lækka útgjöld um 10%?',
    adjustment: { expenseChange: -10 }, // -10%
  },
  {
    type: 'expense-reduction' as const,
    label: 'Hvað ef ég lækka útgjöld um 20%?',
    adjustment: { expenseChange: -20 }, // -20%
  },
  {
    type: 'income-increase' as const,
    label: 'Hvað ef ég auka tekjur um 20%?',
    adjustment: { incomeChange: 20 }, // +20%
  },
  {
    type: 'custom' as const,
    label: 'Hvað ef ég hætti núna?',
    adjustment: { savingsRateChange: 0 }, // 0% savings (living off net worth)
  },
] as const;
