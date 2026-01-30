/**
 * Constants and defaults for Automatic Savings Impact Calculator
 */

import type { FrequencyOption, SavingsPreset, SavingsInputs } from '@/types/savings';

/**
 * Frequency options
 */
export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { key: 'weekly', label: 'Vikulega', timesPerYear: 52 },
  { key: 'biweekly', label: 'Á tveggja vikna fresti', timesPerYear: 26 },
  { key: 'monthly', label: 'Mánaðarlega', timesPerYear: 12 },
  { key: 'custom', label: 'Sérsniðin', timesPerYear: 12 }, // User defines
];

/**
 * Preset scenarios
 */
export const SAVINGS_PRESETS: SavingsPreset[] = [
  {
    id: 'small',
    label: '5.000 kr/mán',
    monthlyAmount: 5000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'medium',
    label: '10.000 kr/mán',
    monthlyAmount: 10000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'large',
    label: '25.000 kr/mán',
    monthlyAmount: 25000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'xlarge',
    label: '50.000 kr/mán',
    monthlyAmount: 50000,
    frequency: 'monthly',
    years: 10,
  },
];

/**
 * Default savings inputs
 */
export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlyAmount: 10000,
  frequency: 'monthly',
  years: 10,
  returnRate: 7,
  adjustForInflation: false,
  inflationRate: 2.5,
};

/**
 * Input validation ranges
 */
export const SAVINGS_RANGES = {
  monthlyAmount: { min: 1000, max: 10_000_000, step: 1000 },
  years: { min: 1, max: 50, step: 1 },
  returnRate: { min: 0, max: 20, step: 0.5 },
  inflationRate: { min: 0, max: 10, step: 0.1 },
  customFrequency: { min: 1, max: 365, step: 1 },
};
