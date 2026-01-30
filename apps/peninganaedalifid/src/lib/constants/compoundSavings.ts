/**
 * Compound savings calculator constants
 */

import type { SavingsPreset, SavingsInputs } from '@/types/calculator';

/**
 * Savings calculator limits
 */
export const SAVINGS_LIMITS = {
  MIN_MONTHLY_SAVINGS: 1_000, // 1,000 ISK
  MAX_MONTHLY_SAVINGS: 1_000_000, // 1,000,000 ISK
  MIN_INTEREST_RATE: 0,
  MAX_INTEREST_RATE: 20,
  MIN_TIME_HORIZON: 1,
  MAX_TIME_HORIZON: 50,
  MAX_SCENARIOS: 3,
} as const;

/**
 * Icelandic savings account presets
 */
export const ICELANDIC_SAVINGS_PRESETS: SavingsPreset[] = [
  {
    id: 'verdtryggt',
    label: 'Verðtryggt',
    rate: 3.0,
    description: 'Verðtryggður sparnaður: vextir + verðbólga',
  },
  {
    id: 'venjulegur',
    label: 'Venjulegur sparnaður',
    rate: 1.5,
    description: 'Hefðbundinn bankainnstæða',
  },
  {
    id: 'havaxtasparnadur',
    label: 'Hávaxtasparnaður',
    rate: 6.5,
    description: 'Hávaxtareikningur með binditíma',
  },
];

/**
 * Default savings inputs
 */
export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlySavings: 50_000,
  annualInterestRate: 3.0,
  timeHorizonYears: 10,
};
