/**
 * Coast FIRE Calculator - Core Calculation Functions
 *
 * Implements all pure calculation functions for the Coast FIRE (Ró FIRE) calculator.
 * Coast FIRE: When your current investments will grow to meet your FI number
 * without additional contributions, allowing you to "coast" to financial independence.
 *
 * All functions are pure (no side effects) and handle edge cases gracefully.
 * Returns are assumed to be REAL returns (inflation-adjusted).
 */

import type {
  CoastFIREInputs,
  CoastFIREResult,
  CoastFIREStatus,
  ScenarioResult,
  ScenarioType,
  GrowthProjection,
  CoastFIRELifeEnergy,
  CalculationAssumptions,
} from '@/types/coastFire';
import {
  RETURN_RATE_SCENARIOS,
  SCENARIO_LABELS,
  CALCULATION_CONSTANTS,
  getAllScenarios,
} from '@/lib/constants/coastFire';

// ============================================================================
// Core Compound Growth Calculations
// ============================================================================

/**
 * Calculate future value using compound interest
 *
 * Formula: FV = PV × (1 + r)^t
 * Where:
 * - PV = Present Value (current balance)
 * - r = Annual return rate (as decimal, e.g., 0.07 for 7%)
 * - t = Time in years
 *
 * @param principal - Current investment balance (ISK)
 * @param annualReturnRate - Expected annual return rate (percentage, e.g., 7 for 7%)
 * @param years - Number of years to project
 * @returns Future value (ISK)
 */
export function calculateFutureValue(
  principal: number,
  annualReturnRate: number,
  years: number
): number {
  // Edge cases
  if (principal <= 0 || years <= 0) return principal;
  if (annualReturnRate === 0) return principal; // No growth with 0% return

  const rate = annualReturnRate / 100; // Convert percentage to decimal
  return principal * Math.pow(1 + rate, years);
}

/**
 * Calculate Coast FIRE number (amount needed today to coast to FI)
 *
 * This is the present value calculation: PV = FV / (1 + r)^t
 * Where FV is the FI number and we solve for how much is needed today.
 *
 * @param fiNumber - Target FI number at retirement (ISK)
 * @param yearsToRetirement - Years until target retirement age
 * @param expectedReturn - Expected annual return rate (percentage)
 * @returns Amount needed today to reach FI number by retirement
 */
export function calculateCoastFINumber(
  fiNumber: number,
  yearsToRetirement: number,
  expectedReturn: number
): number {
  if (fiNumber <= 0 || yearsToRetirement <= 0) return fiNumber;
  if (expectedReturn === 0) return fiNumber; // Need full FI number today

  const rate = expectedReturn / 100;
  return fiNumber / Math.pow(1 + rate, yearsToRetirement);
}

// ============================================================================
// Coast FIRE Status Determination
// ============================================================================

/**
 * Calculate Coast FIRE status based on current investments vs Coast FI number
 *
 * Three possible statuses:
 * - 'coasting': Already have enough to coast (currentInvestments >= coastFINumber)
 * - 'future': Will be able to coast before retirement (coastFireAge <= targetRetirementAge)
 * - 'impossible': Cannot coast with current parameters (would reach target age before FI)
 *
 * @param currentInvestments - Current investment balance (ISK)
 * @param coastFINumber - Amount needed today to coast
 * @returns Coast FIRE status
 */
export function calculateCoastFIREStatus(
  currentInvestments: number,
  coastFINumber: number
): CoastFIREStatus {
  if (currentInvestments >= coastFINumber) {
    return 'coasting'; // Already coasting
  }

  // If not already coasting, caller will determine if 'future' or 'impossible'
  // based on whether coast age is before target age
  return 'future';
}

// ============================================================================
// Time Calculations
// ============================================================================

/**
 * Calculate years until Coast FIRE is reached
 *
 * Solves the compound interest equation for time:
 * coastFINumber = currentInvestments × (1 + r)^t
 * t = ln(coastFINumber / currentInvestments) / ln(1 + r)
 *
 * @param currentInvestments - Current investment balance (ISK)
 * @param coastFINumber - Amount needed to coast (ISK)
 * @param expectedReturn - Expected annual return rate (percentage)
 * @returns Years until Coast FIRE, or null if impossible
 */
export function calculateYearsToCoast(
  currentInvestments: number,
  coastFINumber: number,
  expectedReturn: number
): number | null {
  // Edge cases
  if (currentInvestments <= 0 || coastFINumber <= 0) return null;
  if (currentInvestments >= coastFINumber) return 0; // Already coasting
  if (expectedReturn <= 0) return null; // Can't reach with no/negative growth

  const rate = expectedReturn / 100;
  const ratio = coastFINumber / currentInvestments;

  // Calculate years using logarithms
  const years = Math.log(ratio) / Math.log(1 + rate);

  // Sanity check: if > 100 years, effectively impossible
  if (years > CALCULATION_CONSTANTS.MAX_PROJECTION_YEARS) {
    return null;
  }

  return years;
}

// ============================================================================
// Gap Calculations
// ============================================================================

/**
 * Calculate gap to Coast FIRE (additional ISK needed today to start coasting)
 *
 * @param currentInvestments - Current investment balance (ISK)
 * @param coastFINumber - Amount needed to coast (ISK)
 * @returns ISK needed to reach Coast FIRE, or null if already coasting
 */
export function calculateGapToCoast(
  currentInvestments: number,
  coastFINumber: number
): number | null {
  if (currentInvestments >= coastFINumber) return null; // Already coasting

  const gap = coastFINumber - currentInvestments;
  return gap > 0 ? gap : null;
}

// ============================================================================
// Projection Calculations
// ============================================================================

/**
 * Calculate projected balance at target retirement age
 *
 * @param currentInvestments - Current investment balance (ISK)
 * @param years - Years until retirement
 * @param expectedReturn - Expected annual return rate (percentage)
 * @returns Projected balance at retirement
 */
export function calculateProjectedBalance(
  currentInvestments: number,
  years: number,
  expectedReturn: number
): number {
  return calculateFutureValue(currentInvestments, expectedReturn, years);
}

/**
 * Generate year-by-year growth projection for charting
 *
 * @param currentInvestments - Current investment balance (ISK)
 * @param years - Number of years to project
 * @param expectedReturn - Expected annual return rate (percentage)
 * @returns Array of growth projections for each year
 */
export function calculateGrowthProjection(
  currentInvestments: number,
  years: number,
  expectedReturn: number
): GrowthProjection[] {
  const projections: GrowthProjection[] = [];
  const currentYear = new Date().getFullYear();

  for (let year = 0; year <= years; year++) {
    const balance = calculateFutureValue(currentInvestments, expectedReturn, year);

    projections.push({
      age: 0, // Will be filled in by caller with actual age
      year: currentYear + year,
      balance,
    });
  }

  return projections;
}

// ============================================================================
// Scenario Calculations
// ============================================================================

/**
 * Calculate results for all three return rate scenarios
 *
 * Runs calculations for conservative (4%), moderate (6%), and optimistic (8%) scenarios.
 *
 * @param inputs - Coast FIRE inputs
 * @param scenarios - Array of scenario configurations
 * @returns Array of scenario results
 */
export function calculateScenarioResults(
  inputs: CoastFIREInputs,
  scenarios: Array<{ type: ScenarioType; returnRate: number; name: string }>
): ScenarioResult[] {
  const { currentAge, currentInvestments, fiNumber, targetRetirementAge } = inputs;

  if (!fiNumber || fiNumber <= 0) {
    return [];
  }

  const yearsToRetirement = targetRetirementAge - currentAge;

  return scenarios.map(({ type, returnRate, name }) => {
    // Calculate Coast FI number for this scenario
    const coastFINumber = calculateCoastFINumber(fiNumber, yearsToRetirement, returnRate);

    // Calculate years to coast
    const yearsToCoast = calculateYearsToCoast(currentInvestments, coastFINumber, returnRate);

    // Determine status
    let status: CoastFIREStatus;
    const coastFireAge = yearsToCoast !== null ? currentAge + yearsToCoast : null;

    if (yearsToCoast === 0) {
      status = 'coasting';
    } else if (coastFireAge !== null && coastFireAge <= targetRetirementAge) {
      status = 'future';
    } else {
      status = 'impossible';
    }

    // Calculate gap
    const gapToCoast = calculateGapToCoast(currentInvestments, coastFINumber);

    // Calculate projected balance at retirement
    const projectedBalance = calculateProjectedBalance(
      currentInvestments,
      yearsToRetirement,
      returnRate
    );

    const compoundGrowth = projectedBalance - currentInvestments;
    const excessOverFI = projectedBalance - fiNumber;

    return {
      type,
      name,
      returnRate,
      status,
      coastFireAge,
      yearsToCoast,
      gapToCoast,
      projectedBalance,
      compoundGrowth,
      excessOverFI,
    };
  });
}

// ============================================================================
// Life Energy Calculations
// ============================================================================

/**
 * Calculate life energy metrics for Coast FIRE
 *
 * Converts financial amounts to work hours and years based on actual hourly wage.
 *
 * @param investments - Current investments (ISK)
 * @param gap - Gap to Coast FIRE (ISK, or null if coasting)
 * @param growth - Compound growth to retirement (ISK)
 * @param actualHourlyWage - Actual hourly wage (ISK/hour, or null if not available)
 * @returns Life energy metrics, or null if wage not available
 */
export function calculateLifeEnergy(
  investments: number,
  gap: number | null,
  growth: number,
  actualHourlyWage: number | null
): CoastFIRELifeEnergy | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) {
    return null; // Cannot calculate without wage
  }

  const workHoursPerYear = CALCULATION_CONSTANTS.WORK_HOURS_PER_YEAR;

  // Current investments in work time
  const investmentsInHours = investments / actualHourlyWage;
  const investmentsInYears = investmentsInHours / workHoursPerYear;

  // Gap to Coast FIRE in work time
  const gapInHours = gap !== null ? gap / actualHourlyWage : null;
  const gapInYears = gapInHours !== null ? gapInHours / workHoursPerYear : null;

  // Passive hours earned from compound growth
  const passiveHoursEarned = growth / actualHourlyWage;
  const passiveYearsEarned = passiveHoursEarned / workHoursPerYear;

  // Total work time represented by final balance
  const finalBalance = investments + growth;
  const totalWorkYearsRepresented = finalBalance / actualHourlyWage / workHoursPerYear;

  // Hours saved by coasting vs continuing to save
  // Simplified estimate: assume coasting saves ~80% of the growth hours
  // (Real calculation would need savings rate and trajectory comparison)
  const hoursSavedByCoasting = passiveHoursEarned * 0.8;
  const yearsSavedByCoasting = hoursSavedByCoasting / workHoursPerYear;

  return {
    investmentsInHours,
    investmentsInYears,
    gapInHours,
    gapInYears,
    passiveHoursEarned,
    passiveYearsEarned,
    totalWorkYearsRepresented,
    hoursSavedByCoasting,
    yearsSavedByCoasting,
  };
}

// ============================================================================
// Master Calculation Function
// ============================================================================

/**
 * Calculate complete Coast FIRE results from inputs
 *
 * This is the main orchestrator function that coordinates all calculations.
 *
 * @param inputs - Coast FIRE calculator inputs
 * @param actualHourlyWage - Actual hourly wage for life energy (optional)
 * @returns Complete Coast FIRE calculation results
 * @throws Error if FI number is missing or invalid
 */
export function calculateCoastFIREResult(
  inputs: CoastFIREInputs,
  actualHourlyWage: number | null = null
): CoastFIREResult {
  const {
    currentAge,
    currentInvestments,
    fiNumber,
    expectedReturn,
    targetRetirementAge,
    fiMultiplier,
    birthDate,
  } = inputs;

  // Validate required inputs
  if (!fiNumber || fiNumber <= 0) {
    throw new Error('FI Number is required and must be greater than 0');
  }

  const yearsToRetirement = targetRetirementAge - currentAge;

  // Calculate Coast FI number (amount needed today to coast)
  const coastFINumber = calculateCoastFINumber(fiNumber, yearsToRetirement, expectedReturn);

  // Calculate years to Coast FIRE
  const yearsToCoast = calculateYearsToCoast(currentInvestments, coastFINumber, expectedReturn);

  // Calculate Coast FIRE age
  const coastFireAge = yearsToCoast !== null ? currentAge + yearsToCoast : null;

  // Determine status
  let status: CoastFIREStatus;
  if (yearsToCoast === 0) {
    status = 'coasting';
  } else if (coastFireAge !== null && coastFireAge <= targetRetirementAge) {
    status = 'future';
  } else {
    status = 'impossible';
  }

  // Calculate Coast FIRE date (if birthDate provided)
  let coastFireDate: Date | null = null;
  if (birthDate && coastFireAge !== null) {
    const birth = new Date(birthDate);
    coastFireDate = new Date(birth);
    coastFireDate.setFullYear(birth.getFullYear() + coastFireAge);
  }

  // Calculate gap to Coast FIRE
  const gapToCoast = calculateGapToCoast(currentInvestments, coastFINumber);

  // Calculate projected balance at retirement
  const projectedBalance = calculateProjectedBalance(
    currentInvestments,
    yearsToRetirement,
    expectedReturn
  );

  const compoundGrowth = projectedBalance - currentInvestments;
  const excessOverFI = projectedBalance - fiNumber;

  // Generate scenario comparisons
  const scenarioConfigs = getAllScenarios();
  const scenarios = calculateScenarioResults(inputs, scenarioConfigs);

  // Calculate life energy metrics
  const lifeEnergy = calculateLifeEnergy(
    currentInvestments,
    gapToCoast,
    compoundGrowth,
    actualHourlyWage
  );

  // Build assumptions metadata
  const assumptions: CalculationAssumptions = {
    currentAge,
    currentInvestments,
    fiNumber,
    expectedReturn,
    targetRetirementAge,
    fiMultiplier,
    compoundingFrequency: CALCULATION_CONSTANTS.COMPOUNDING_FREQUENCY,
    realVsNominal: 'real',
    actualHourlyWage,
  };

  return {
    status,
    coastFireAge,
    coastFireDate,
    yearsToCoast,
    gapToCoast,
    projectedBalance,
    compoundGrowth,
    excessOverFI,
    lifeEnergy,
    scenarios,
    calculatedAt: new Date(),
    assumptions,
  };
}

// ============================================================================
// Export all functions
// ============================================================================

export default {
  calculateCoastFINumber,
  calculateCoastFIREStatus,
  calculateYearsToCoast,
  calculateGapToCoast,
  calculateProjectedBalance,
  calculateScenarioResults,
  calculateGrowthProjection,
  calculateLifeEnergy,
  calculateCoastFIREResult,
  calculateFutureValue,
};
