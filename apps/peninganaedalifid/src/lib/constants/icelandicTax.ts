/**
 * Icelandic Tax Constants for 2024/2025
 * Feature ID: 2.3.2
 *
 * Tax rates and configurations for accurate Icelandic income tax calculations.
 * Data sources:
 * - payday.is calculator (verified with multiple test cases)
 * - Skatturinn.is
 *
 * Last updated: 2025-01
 *
 * IMPORTANT: The tax bracket rates are COMBINED rates (staðgreiðsla)
 * that include both national tax (tekjuskattur) and municipal tax (útsvar).
 * This matches the payday.is calculator behavior.
 */

import type { TaxConfig, Municipality } from '@/types/raise';

/**
 * 2024/2025 Icelandic tax configuration (verified against payday.is)
 *
 * Combined tax brackets (staðgreiðsla = national + municipal):
 * - 1. þrep: 31.49% on taxable income up to 498,124 kr/month
 * - 2. þrep: 37.99% on taxable income from 498,124 to 1,398,436 kr/month
 * - 3. þrep: 46.29% on taxable income above 1,398,436 kr/month
 *
 * Taxable income = Gross - Lífeyrissjóður (4%) - Séreignarsparnaður (2%)
 *
 * Personal credit (persónuafsláttur): 72,492 kr/month (869,904 kr/year)
 * This credit reduces total tax liability, not taxable income.
 *
 * Verified test cases from payday.is:
 * - 900,000 brúttó → 620,474 nettó ✓
 * - 1,200,000 brúttó → 792,342 nettó ✓
 * - 1,673,566 brúttó → 1,049,144 nettó ✓
 */
export const TAX_CONFIG_2024: TaxConfig = {
  year: 2024,
  personalCreditMonthly: 72492, // 869,904 kr/year (verified from payday.is)
  nationalTaxBrackets: [
    {
      upToMonthly: 498124, // ~5,977,488 kr/year (1. þrep limit)
      rate: 0.3149, // 31.49% combined rate
    },
    {
      upToMonthly: 1398436, // ~16,781,232 kr/year (2. þrep limit)
      rate: 0.3799, // 37.99% combined rate
    },
    {
      upToMonthly: null, // No upper limit (3. þrep)
      rate: 0.4629, // 46.29% combined rate
    },
  ],
  pensionRates: {
    employeeMin: 0.04, // 4% mandatory employee pension
    employerMin: 0.115, // 11.5% employer pension contribution
  },
};

// Alias for backwards compatibility
export const TAX_CONFIG_2026 = TAX_CONFIG_2024;

/**
 * Standard Icelandic salary deduction rates
 *
 * These are the common pre-tax deductions from gross salary.
 * Data source: payday.is, skatturinn.is
 */
export const SALARY_DEDUCTIONS = {
  // Employee deductions (deducted from employee's gross)
  lifeyrissjodur: {
    default: 0.04, // 4% mandatory employee pension contribution
    min: 0.04,
    max: 0.04,
    label: 'Lífeyrissjóður (iðgjald launþega)',
  },
  sereignarsjodur: {
    default: 0.02, // 2% optional private pension (common)
    min: 0,
    max: 0.04,
    label: 'Séreignarsparnaður',
  },
  stettarfelag: {
    default: 0.01, // ~1% union fee (varies by union)
    min: 0.005,
    max: 0.025,
    label: 'Stéttarfélagsgjald',
  },

  // Employer contributions (not deducted from employee, but important for total cost)
  framlagLaunagreidanda: {
    default: 0.115, // 11.5% employer pension contribution
    min: 0.115,
    max: 0.155,
    label: 'Framlag launagreiðanda',
  },
  endurhaefingarsjodur: {
    default: 0.001, // 0.1% rehabilitation fund (employer pays)
    label: 'Endurhæfingarsjóður',
  },
  tryggingagjald: {
    default: 0.0645, // 6.45% social security (employer pays)
    label: 'Tryggingagjald',
  },
};

/**
 * Default salary deduction configuration
 * Used when importing from main calculator or creating new scenarios
 */
export const DEFAULT_DEDUCTIONS = {
  lifeyrissjodur: SALARY_DEDUCTIONS.lifeyrissjodur.default,
  sereignarsjodur: SALARY_DEDUCTIONS.sereignarsjodur.default,
  stettarfelag: SALARY_DEDUCTIONS.stettarfelag.default,
};

/**
 * Top 10 Icelandic municipalities by population with útsvar rates (2026)
 *
 * Útsvar (municipal tax) is a flat percentage rate that varies by municipality.
 * Range: 12.00% - 14.95%
 *
 * Data source: Samband Íslenskra Sveitarfélaga (Association of Icelandic Municipalities)
 */
export const MUNICIPALITIES: Municipality[] = [
  { code: '0000', name: 'Reykjavík', utsvarRate: 14.48 },
  { code: '1000', name: 'Kópavogur', utsvarRate: 13.13 },
  { code: '1100', name: 'Seltjarnarnes', utsvarRate: 13.13 },
  { code: '1300', name: 'Garðabær', utsvarRate: 12.53 },
  { code: '1400', name: 'Hafnarfjörður', utsvarRate: 13.68 },
  { code: '1604', name: 'Reykjanesbær', utsvarRate: 14.45 },
  { code: '2000', name: 'Mosfellsbær', utsvarRate: 13.31 },
  { code: '3000', name: 'Akranes', utsvarRate: 14.52 },
  { code: '6000', name: 'Akureyri', utsvarRate: 14.52 },
  { code: '7000', name: 'Fjarðabyggð', utsvarRate: 14.48 },
  { code: 'other', name: 'Annað (handfært)', utsvarRate: 14.0 }, // Manual override option
];

/**
 * Default FI calculation assumptions
 *
 * Based on "Your Money or Your Life" and common FIRE community standards.
 */
export const FI_DEFAULTS = {
  expectedReturn: 7.0, // 7% annual return (real, after inflation)
  safeWithdrawalRate: 4.0, // 4% SWR (Trinity Study)
  weeksPerYear: 50, // Standard work year (52 weeks - 2 weeks unpaid time off)
};

/**
 * Helper function to get útsvar rate for a municipality
 *
 * @param municipalityCode - Municipality code or 'other'
 * @returns Útsvar rate as percentage (e.g., 14.48)
 */
export function getUtsvarRate(municipalityCode: string): number {
  const municipality = MUNICIPALITIES.find((m) => m.code === municipalityCode);
  return municipality?.utsvarRate ?? 14.0; // Default to 14% if not found
}

/**
 * Helper function to get municipality by code
 *
 * @param municipalityCode - Municipality code
 * @returns Municipality object or undefined
 */
export function getMunicipalityByCode(
  municipalityCode: string
): Municipality | undefined {
  return MUNICIPALITIES.find((m) => m.code === municipalityCode);
}
