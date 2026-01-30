/**
 * Icelandic Income Tax Calculator
 * Feature ID: 2.3.2
 *
 * Implements accurate Icelandic income tax calculations using:
 * - Progressive national tax brackets
 * - Flat municipal tax (útsvar)
 * - Personal tax credit (persónuafsláttur)
 * - Pension contributions
 *
 * References:
 * - REQ-CALC-001: After-tax calculation
 * - NFR-001: Accuracy
 * - Section 11: Icelandic Tax Context
 */

import type { TaxResults, TaxConfig, TaxBracket } from '@/types/raise';
import { TAX_CONFIG_2026, DEFAULT_DEDUCTIONS } from '@/lib/constants/icelandicTax';

/**
 * Salary deduction rates for comprehensive calculation
 */
export interface SalaryDeductions {
  lifeyrissjodur: number; // 4% default
  sereignarsjodur: number; // 0-4%, often 2%
  stettarfelag: number; // ~1%
}

/**
 * Calculate Icelandic income tax for a given gross annual income
 *
 * Verified against payday.is calculator (2024/2025 rates)
 *
 * Algorithm:
 * 1. Deduct pension (4%) and séreignar (2%) to get taxable income
 * 2. Apply COMBINED tax brackets (staðgreiðsla = national + municipal)
 * 3. Deduct personal tax credit (up to total tax)
 * 4. Deduct stéttarfélag (1%) separately
 * 5. Calculate net income
 *
 * IMPORTANT: The tax bracket rates (31.49%, 37.99%, 46.29%) already include
 * both national tax and municipal tax. Do NOT add municipal tax separately.
 *
 * @param grossAnnual - Gross annual income in ISK
 * @param _utsvarRate - Municipal tax rate (UNUSED - rates are combined in brackets)
 * @param includePension - Whether to deduct pension (default: true)
 * @param taxConfig - Tax configuration (default: 2026 config)
 * @returns Complete tax calculation results
 */
export function calculateIcelandicTax(
  grossAnnual: number,
  _utsvarRate: number, // Kept for API compatibility but not used (rates are combined)
  includePension: boolean = true,
  taxConfig: TaxConfig = TAX_CONFIG_2026
): TaxResults {
  // Standard deduction rates (verified against payday.is)
  const pensionRate = includePension ? taxConfig.pensionRates.employeeMin : 0; // 4%
  const sereignarRate = 0.02; // 2% séreignarsparnaður
  const stettarfelagRate = 0.01; // 1% stéttarfélag

  // 1. Calculate pre-tax deductions
  const pensionDeduction = grossAnnual * pensionRate;
  const sereignarDeduction = grossAnnual * sereignarRate;
  const stettarfelagDeduction = grossAnnual * stettarfelagRate;

  // 2. Calculate taxable income (for tax calculation)
  // Note: Stéttarfélag is NOT deducted from taxable base for tax calculation
  const taxableIncome = grossAnnual - pensionDeduction - sereignarDeduction;

  // 3. Convert to monthly for tax calculation
  const monthlyTaxable = taxableIncome / 12;

  // 4. Calculate combined tax (staðgreiðsla) using progressive brackets
  // NOTE: The bracket rates already include both national and municipal tax
  const combinedTaxMonthly = calculateNationalTax(
    monthlyTaxable,
    taxConfig.nationalTaxBrackets
  );

  // 5. Apply personal credit (cannot exceed total tax)
  const personalCredit = Math.min(
    combinedTaxMonthly,
    taxConfig.personalCreditMonthly
  );
  const netTaxMonthly = Math.max(0, combinedTaxMonthly - personalCredit);

  // 6. Calculate net income
  // Net = Taxable - Tax after credit - Stéttarfélag
  const netMonthly = monthlyTaxable - netTaxMonthly - (stettarfelagDeduction / 12);
  const netAnnual = netMonthly * 12;

  // 7. Calculate effective tax rate
  const effectiveTaxRate = grossAnnual > 0 ? (netTaxMonthly * 12) / grossAnnual : 0;

  return {
    grossAnnual,
    taxableIncome,
    nationalTax: combinedTaxMonthly * 12, // Combined tax (national + municipal)
    municipalTax: 0, // Included in combined rate
    totalTax: combinedTaxMonthly * 12,
    personalCredit: personalCredit * 12,
    netTax: netTaxMonthly * 12,
    netAnnual,
    netMonthly,
    effectiveTaxRate: effectiveTaxRate * 100, // Convert to percentage
  };
}

/**
 * Calculate marginal tax rate at a specific income level
 *
 * This is useful for understanding the effective rate on a raise
 * (e.g., "42% of your raise goes to taxes").
 *
 * NOTE: The bracket rates are already combined (national + municipal),
 * so we just return the bracket rate directly.
 *
 * @param monthlyIncome - Monthly taxable income in ISK
 * @param _utsvarRate - Unused (rates are combined in brackets)
 * @param taxConfig - Tax configuration
 * @returns Marginal tax rate as percentage
 */
export function calculateMarginalRate(
  monthlyIncome: number,
  _utsvarRate: number,
  taxConfig: TaxConfig = TAX_CONFIG_2026
): number {
  const bracket = findTaxBracket(monthlyIncome, taxConfig.nationalTaxBrackets);
  return bracket.rate * 100; // Rate is already combined (national + municipal)
}

/**
 * Find which tax bracket applies to a given monthly income
 *
 * @param monthlyIncome - Monthly income in ISK
 * @param brackets - Array of tax brackets
 * @returns Applicable tax bracket
 */
function findTaxBracket(
  monthlyIncome: number,
  brackets: TaxBracket[]
): TaxBracket {
  for (const bracket of brackets) {
    if (bracket.upToMonthly === null || monthlyIncome <= bracket.upToMonthly) {
      return bracket;
    }
  }
  // Fallback to highest bracket (should never reach here if brackets are correct)
  return brackets[brackets.length - 1];
}

/**
 * Calculate national income tax using progressive brackets
 *
 * Progressive taxation means:
 * - First X kr taxed at rate 1
 * - Next Y kr taxed at rate 2
 * - Remaining taxed at rate 3
 *
 * Example with simplified brackets:
 * - 0-100k: 30%
 * - 100k-200k: 40%
 * - 200k+: 50%
 *
 * Income of 250k:
 * - First 100k × 30% = 30k
 * - Next 100k × 40% = 40k
 * - Final 50k × 50% = 25k
 * - Total tax: 95k (38% effective rate)
 *
 * @param monthlyTaxableIncome - Monthly taxable income in ISK
 * @param brackets - Array of tax brackets
 * @returns National tax amount (monthly)
 */
function calculateNationalTax(
  monthlyTaxableIncome: number,
  brackets: TaxBracket[]
): number {
  let totalTax = 0;
  let previousBracketLimit = 0;

  for (const bracket of brackets) {
    if (monthlyTaxableIncome <= previousBracketLimit) {
      break; // Income doesn't reach this bracket
    }

    const bracketLimit = bracket.upToMonthly ?? Infinity;
    const incomeInBracket = Math.min(
      monthlyTaxableIncome - previousBracketLimit,
      bracketLimit - previousBracketLimit
    );

    totalTax += incomeInBracket * bracket.rate;
    previousBracketLimit = bracketLimit;

    if (bracket.upToMonthly === null || monthlyTaxableIncome <= bracketLimit) {
      break; // All income has been taxed
    }
  }

  return totalTax;
}

/**
 * Comprehensive salary calculation result
 */
export interface ComprehensiveSalaryResult {
  grossMonthly: number;
  grossAnnual: number;

  // Pre-tax deductions
  lifeyrissjodurMonthly: number;
  sereignarsjodurMonthly: number;
  stettarfelagMonthly: number;
  totalPreTaxDeductionsMonthly: number;

  // Taxable income
  taxableMonthly: number;
  taxableAnnual: number;

  // Tax calculations
  nationalTaxMonthly: number;
  municipalTaxMonthly: number;
  totalTaxMonthly: number;
  personalCreditMonthly: number;
  netTaxMonthly: number;

  // Net salary
  netMonthly: number;
  netAnnual: number;

  // Effective rates
  effectiveTaxRate: number;
  totalDeductionRate: number;
}

/**
 * Calculate comprehensive salary breakdown from brúttó (gross) to nettó (net)
 *
 * This implements the full Icelandic salary calculation verified against payday.is:
 *
 * 1. Brúttó (gross)
 * 2. - Lífeyrissjóður (4%) → for tax base calculation
 * 3. - Séreignarsparnaður (2%) → for tax base calculation
 * 4. = Skattstofn (taxable income for tax calculation)
 * 5. - Combined tax (staðgreiðsla = national + municipal) using progressive brackets
 * 6. + Persónuafsláttur
 * 7. - Stéttarfélag (~1%) → deducted from take-home, NOT from taxable base
 * 8. = Nettó (take-home)
 *
 * IMPORTANT: The tax bracket rates (31.49%, 37.99%, 46.29%) are COMBINED rates
 * that already include both national tax (tekjuskattur) and municipal tax (útsvar).
 * Do NOT add municipal tax separately.
 *
 * Verified test cases from payday.is:
 * - 900,000 brúttó → 620,474 nettó
 * - 1,200,000 brúttó → 792,342 nettó
 * - 1,673,566 brúttó → 1,049,144 nettó
 *
 * @param grossMonthly - Monthly gross salary in ISK
 * @param _utsvarRate - Municipal tax rate (UNUSED - rates are combined in brackets)
 * @param deductions - Pre-tax deduction rates
 * @param taxConfig - Tax configuration
 */
export function calculateSalaryFromGross(
  grossMonthly: number,
  _utsvarRate: number, // Kept for API compatibility but not used (rates are combined)
  deductions: SalaryDeductions = DEFAULT_DEDUCTIONS,
  taxConfig: TaxConfig = TAX_CONFIG_2026
): ComprehensiveSalaryResult {
  // 1. Calculate pre-tax deductions
  const lifeyrissjodurMonthly = grossMonthly * deductions.lifeyrissjodur;
  const sereignarsjodurMonthly = grossMonthly * deductions.sereignarsjodur;
  const stettarfelagMonthly = grossMonthly * deductions.stettarfelag;

  // 2. Calculate taxable income (for TAX calculation purposes)
  // IMPORTANT: Stéttarfélag is NOT deducted from taxable base for tax calculation
  // Only lífeyrissjóður and séreignarsparnaður reduce the taxable base
  const taxableMonthly = grossMonthly - lifeyrissjodurMonthly - sereignarsjodurMonthly;

  // 3. Calculate combined tax (staðgreiðsla) using progressive brackets
  // NOTE: The bracket rates already include both national and municipal tax
  const combinedTaxMonthly = calculateNationalTax(
    taxableMonthly,
    taxConfig.nationalTaxBrackets
  );

  // 4. Municipal tax is already included in combined rates, so we track it as 0 separately
  // This maintains backward compatibility while being semantically accurate
  const municipalTaxMonthly = 0;
  const nationalTaxMonthly = combinedTaxMonthly; // Combined rate displayed as "national"

  // 5. Total tax before personal credit
  const totalTaxMonthly = combinedTaxMonthly;

  // 6. Apply personal credit (cannot exceed total tax)
  const personalCreditMonthly = Math.min(
    totalTaxMonthly,
    taxConfig.personalCreditMonthly
  );
  const netTaxMonthly = Math.max(0, totalTaxMonthly - personalCreditMonthly);

  // 7. Calculate net salary
  // Net = Taxable - Tax after credit - Stéttarfélag
  const netMonthly = taxableMonthly - netTaxMonthly - stettarfelagMonthly;

  // Total pre-tax deductions (for display purposes)
  const totalPreTaxDeductionsMonthly =
    lifeyrissjodurMonthly + sereignarsjodurMonthly + stettarfelagMonthly;

  // 8. Calculate effective rates
  const effectiveTaxRate = grossMonthly > 0 ? (netTaxMonthly / grossMonthly) * 100 : 0;
  const totalDeductionRate =
    grossMonthly > 0
      ? ((grossMonthly - netMonthly) / grossMonthly) * 100
      : 0;

  return {
    grossMonthly,
    grossAnnual: grossMonthly * 12,
    lifeyrissjodurMonthly,
    sereignarsjodurMonthly,
    stettarfelagMonthly,
    totalPreTaxDeductionsMonthly,
    taxableMonthly,
    taxableAnnual: taxableMonthly * 12,
    nationalTaxMonthly, // This is actually combined tax (national + municipal)
    municipalTaxMonthly, // Always 0 (included in combined rate)
    totalTaxMonthly,
    personalCreditMonthly,
    netTaxMonthly,
    netMonthly,
    netAnnual: netMonthly * 12,
    effectiveTaxRate,
    totalDeductionRate,
  };
}

/**
 * Reverse calculate brúttó (gross) from nettó (net) salary
 *
 * Uses binary search to find the gross salary that produces
 * the given net salary after all deductions and taxes.
 *
 * @param netMonthly - Target monthly net salary in ISK
 * @param utsvarRate - Municipal tax rate (e.g., 14.48)
 * @param deductions - Pre-tax deduction rates
 * @param taxConfig - Tax configuration
 * @param tolerance - Acceptable error in ISK (default: 1)
 * @param maxIterations - Maximum iterations (default: 100)
 */
export function calculateGrossFromNet(
  netMonthly: number,
  utsvarRate: number,
  deductions: SalaryDeductions = DEFAULT_DEDUCTIONS,
  taxConfig: TaxConfig = TAX_CONFIG_2026,
  tolerance: number = 1,
  maxIterations: number = 100
): ComprehensiveSalaryResult {
  // Edge case: zero net salary
  if (netMonthly <= 0) {
    return calculateSalaryFromGross(0, utsvarRate, deductions, taxConfig);
  }

  // Binary search bounds
  // Minimum gross is at least the net (ignoring negative tax credit scenarios)
  // Maximum gross is approximately net / (1 - max deduction rate - max tax rate)
  // For safety, use net * 3 as upper bound
  let low = netMonthly;
  let high = netMonthly * 3;
  let bestResult = calculateSalaryFromGross(low, utsvarRate, deductions, taxConfig);

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const result = calculateSalaryFromGross(mid, utsvarRate, deductions, taxConfig);

    const diff = result.netMonthly - netMonthly;

    if (Math.abs(diff) <= tolerance) {
      return result;
    }

    if (diff < 0) {
      // Calculated net is too low, need higher gross
      low = mid;
    } else {
      // Calculated net is too high, need lower gross
      high = mid;
    }

    bestResult = result;
  }

  // Return best approximation if we hit max iterations
  return bestResult;
}

/**
 * Get the pre-tax deduction total rate
 */
export function getTotalDeductionRate(deductions: SalaryDeductions): number {
  return deductions.lifeyrissjodur + deductions.sereignarsjodur + deductions.stettarfelag;
}
