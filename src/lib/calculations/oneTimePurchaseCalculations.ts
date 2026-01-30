/**
 * Calculation functions for One-Time Purchase Decision Tool
 *
 * Implements calculations for:
 * - Life energy cost (hours of work required)
 * - Future value (opportunity cost if invested)
 * - FI impact (delay on financial independence)
 */

import type {
  LifeEnergyCost,
  FutureValueResult,
  FIImpact,
  PurchaseCalculationResult,
  PurchaseCalculationSettings,
  PurchaseInput,
  RequiredUserData,
  PurchaseComparison,
} from '../../types/oneTimePurchase.types';

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

/**
 * Calculates life energy cost for a purchase
 *
 * @param purchasePrice - Price of the purchase in ISK
 * @param actualHourlyWage - Actual hourly wage from calculator (ISK/hour)
 * @returns Life energy cost breakdown
 */
export function calculateLifeEnergyCost(
  purchasePrice: number,
  actualHourlyWage: number,
): LifeEnergyCost {
  if (actualHourlyWage <= 0) {
    throw new Error('Actual hourly wage must be greater than 0');
  }

  const totalHours = purchasePrice / actualHourlyWage;
  const workDays = totalHours / 8; // 8-hour workday
  const workWeeks = totalHours / 40; // 40-hour workweek

  const formattedString = formatLifeEnergy(totalHours);

  return {
    totalHours,
    workDays,
    workWeeks,
    formattedString,
  };
}

/**
 * Formats hours into human-readable Icelandic string
 *
 * Examples:
 * - 3 hours → "3 klukkustundir"
 * - 40 hours → "1 vika"
 * - 88 hours → "2 vikur og 1 dagur"
 *
 * @param hours - Number of hours
 * @returns Formatted Icelandic string
 */
export function formatLifeEnergy(hours: number): string {
  if (hours < 0) {
    return '0 klukkustundir';
  }

  const weeks = Math.floor(hours / 40);
  const remainingAfterWeeks = hours % 40;
  const days = Math.floor(remainingAfterWeeks / 8);
  const finalHours = Math.floor(remainingAfterWeeks % 8);

  const parts: string[] = [];

  if (weeks > 0) {
    parts.push(`${weeks} ${weeks === 1 ? 'vika' : 'vikur'}`);
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dagur' : 'dagar'}`);
  }

  // Only show hours if < 1 week OR if there are remaining hours after weeks/days
  if (finalHours > 0 || parts.length === 0) {
    if (parts.length === 0 && hours < 8) {
      // For very small amounts, show with decimal
      const roundedHours = Math.round(hours * 10) / 10;
      parts.push(
        `${roundedHours} ${roundedHours === 1 ? 'klukkustund' : 'klukkustundir'}`,
      );
    } else if (finalHours > 0) {
      parts.push(
        `${finalHours} ${finalHours === 1 ? 'klukkustund' : 'klukkustundir'}`,
      );
    }
  }

  // If we somehow have no parts, default to hours
  if (parts.length === 0) {
    const roundedHours = Math.round(hours * 10) / 10;
    return `${roundedHours} ${roundedHours === 1 ? 'klukkustund' : 'klukkustundir'}`;
  }

  return parts.join(' og ');
}

// ============================================================================
// FUTURE VALUE CALCULATIONS
// ============================================================================

/**
 * Calculates future value of an investment
 *
 * Formula: FV = PV × (1 + r)^n
 *
 * @param presentValue - Present value in ISK
 * @param annualReturnRate - Annual return rate (0-1, e.g., 0.07 for 7%)
 * @param years - Number of years
 * @returns Future value in ISK
 */
export function calculateFutureValue(
  presentValue: number,
  annualReturnRate: number,
  years: number,
): number {
  return presentValue * Math.pow(1 + annualReturnRate, years);
}

/**
 * Calculates future values for all configured time periods
 *
 * @param purchasePrice - Purchase price in ISK
 * @param settings - Calculation settings
 * @returns Array of future value results
 */
export function calculateFutureValues(
  purchasePrice: number,
  settings: PurchaseCalculationSettings,
): FutureValueResult[] {
  return settings.futureValueYears.map((years) => {
    const value = calculateFutureValue(
      purchasePrice,
      settings.expectedReturnRate,
      years,
    );

    return {
      years,
      value,
      formattedValue: formatCurrency(value),
    };
  });
}

/**
 * Formats ISK currency with thousands separators
 *
 * @param amount - Amount in ISK
 * @returns Formatted string (e.g., "2.000.000 kr")
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('is-IS');
  return `${formatted} kr`;
}

// ============================================================================
// FI IMPACT CALCULATIONS
// ============================================================================

/**
 * Calculates impact on Financial Independence timeline
 *
 * Simple model: delay = purchasePrice / annualSavings
 *
 * @param purchasePrice - Purchase price in ISK
 * @param lifeEnergyCost - Life energy cost result
 * @param fiData - FI data from user profile
 * @returns FI impact or undefined if data unavailable
 */
export function calculateFIImpact(
  purchasePrice: number,
  lifeEnergyCost: LifeEnergyCost,
  fiData?: RequiredUserData['fiData'],
): FIImpact | undefined {
  if (!fiData || !fiData.annualSavings || fiData.annualSavings <= 0) {
    return undefined;
  }

  const additionalWorkHours = lifeEnergyCost.totalHours;

  // Calculate delay in years, then convert to days and months
  const delayYears = purchasePrice / fiData.annualSavings;
  const delayDays = Math.round(delayYears * 365);
  const delayMonths = Math.round(delayYears * 12);

  const formattedDelay = formatDelay(delayMonths);

  return {
    additionalWorkHours,
    delayDays,
    delayMonths,
    formattedDelay,
  };
}

/**
 * Formats delay in months to human-readable Icelandic string
 *
 * Examples:
 * - 3 months → "3 mánuðir"
 * - 18 months → "1 ár og 6 mánuðir"
 * - 24 months → "2 ár"
 *
 * @param months - Number of months
 * @returns Formatted Icelandic string
 */
export function formatDelay(months: number): string {
  if (months < 12) {
    return `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ár`;
  }

  return `${years} ár og ${remainingMonths} ${remainingMonths === 1 ? 'mánuður' : 'mánuðir'}`;
}

// ============================================================================
// MASTER CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates complete purchase result
 *
 * @param input - Purchase input
 * @param userData - Required user data (actualHourlyWage, fiData)
 * @param settings - Calculation settings
 * @returns Complete calculation result
 * @throws Error if actualHourlyWage is missing or price is invalid
 */
export function calculatePurchaseResult(
  input: PurchaseInput,
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings,
): PurchaseCalculationResult {
  if (!userData.actualHourlyWage || userData.actualHourlyWage <= 0) {
    throw new Error(
      'Raunverulegt tímakaup vantar. Vinsamlegast fylltu út reiknivélina fyrst.',
    );
  }

  if (input.price <= 0) {
    throw new Error('Kaupverð verður að vera stærra en 0');
  }

  // 1. Calculate life energy cost
  const lifeEnergyCost = calculateLifeEnergyCost(
    input.price,
    userData.actualHourlyWage,
  );

  // 2. Calculate future values
  const futureValues = calculateFutureValues(input.price, settings);

  // 3. Calculate FI impact (optional)
  const fiImpact = calculateFIImpact(
    input.price,
    lifeEnergyCost,
    userData.fiData,
  );

  return {
    input,
    lifeEnergyCost,
    futureValues,
    fiImpact,
  };
}

/**
 * Compares multiple purchase options
 *
 * @param options - Array of purchase inputs (2-3 items)
 * @param userData - Required user data
 * @param settings - Calculation settings
 * @returns Comparison result
 * @throws Error if actualHourlyWage is missing
 */
export function compareOptions(
  options: PurchaseInput[],
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings,
): PurchaseComparison {
  if (!userData.actualHourlyWage) {
    throw new Error('Raunverulegt tímakaup vantar fyrir samanburð');
  }

  // Calculate results for each option
  const results = options.map((option) =>
    calculatePurchaseResult(option, userData, settings),
  );

  // Find cheapest option (minimum life energy hours)
  const cheapestOptionIndex = results.reduce(
    (minIdx, result, idx, arr) =>
      result.lifeEnergyCost.totalHours < arr[minIdx].lifeEnergyCost.totalHours
        ? idx
        : minIdx,
    0,
  );

  // Calculate maximum difference in life energy hours
  const hourValues = results.map((r) => r.lifeEnergyCost.totalHours);
  const maxLifeEnergyDifference = Math.max(...hourValues) - Math.min(...hourValues);

  return {
    options: results,
    cheapestOptionIndex,
    maxLifeEnergyDifference,
  };
}
