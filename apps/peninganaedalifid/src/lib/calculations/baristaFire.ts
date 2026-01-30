/**
 * Barista FIRE Planner Core Calculation Functions
 *
 * Pure calculation functions for the Barista FIRE (semi-retirement) calculator.
 * Handles gap calculation, timeline projection, part-time income scenarios,
 * life energy calculations, and Coast FIRE baseline comparison.
 *
 * Key Icelandic considerations:
 * - Universal healthcare (not tied to employment)
 * - Mandatory 16% pension contribution (12% employer + 4% employee)
 * - All income shown as NET after pension deduction
 *
 * All functions are pure (no side effects) and handle edge cases.
 */

import type {
  BaristaFireState,
  BaristaFireScenario,
  BaristaFireResults,
  BaristaFireScenarioResult,
  TimelineProjection,
  TimelineDataPoint,
} from '@/types/baristaFire';

import {
  BARISTA_FIRE_DEFAULTS,
  NET_INCOME_MULTIPLIER,
  TIMELINE_DEFAULTS,
  calculateNetIncome as applyPensionDeduction,
} from '@/lib/constants/baristaFire';

// ============================================================================
// GAP CALCULATION
// ============================================================================

/**
 * Calculate gap between current savings and FI number
 *
 * Returns the amount of additional savings needed to reach full FI.
 * Returns 0 if user has already reached Coast FIRE (savings >= FI number).
 *
 * @param fiNumber - Target FI amount (annual expenses × multiplier)
 * @param currentSavings - Current investment/savings balance (ISK)
 * @returns Gap amount in ISK (0 if Coast FIRE)
 *
 * @example
 * const gap = calculateGapToFI(15_600_000, 10_000_000);
 * // Returns: 5,600,000 ISK
 */
export function calculateGapToFI(fiNumber: number, currentSavings: number): number {
  if (fiNumber < 0 || currentSavings < 0) return 0;
  const gap = fiNumber - currentSavings;
  return Math.max(0, gap);
}

/**
 * Check if user has reached Coast FIRE
 *
 * Coast FIRE: Current savings will grow to full FI without additional
 * contributions. User only needs part-time income to cover expenses.
 *
 * @param fiNumber - Target FI amount
 * @param currentSavings - Current savings balance
 * @returns True if savings >= FI number
 *
 * @example
 * const isCoast = isCoastFIRE(15_600_000, 16_000_000);
 * // Returns: true
 */
export function isCoastFIRE(fiNumber: number, currentSavings: number): boolean {
  return currentSavings >= fiNumber;
}

// ============================================================================
// INCOME CALCULATIONS
// ============================================================================

/**
 * Calculate net income after mandatory pension deduction
 *
 * Applies 16% pension contribution (12% employer + 4% employee) to gross income.
 * All part-time work in Iceland is subject to this mandatory contribution.
 *
 * @param grossIncome - Gross annual income (ISK)
 * @param pensionRate - Pension contribution rate (default 0.16)
 * @returns Net annual income after pension deduction (ISK)
 *
 * @example
 * const netIncome = calculateNetIncome(3_600_000, 0.16);
 * // Returns: 3,024,000 ISK (gross × 0.84)
 */
export function calculateNetIncome(
  grossIncome: number,
  pensionRate: number = BARISTA_FIRE_DEFAULTS.PENSION_CONTRIBUTION_RATE
): number {
  if (grossIncome < 0) return 0;
  return grossIncome * (1 - pensionRate);
}

/**
 * Calculate annual income from part-time work
 *
 * Converts hourly wage and work hours per week to annual gross income.
 * Accounts for Icelandic working weeks per year (47 weeks, including 5 weeks vacation).
 *
 * @param hourlyWage - Hourly wage (ISK)
 * @param hoursPerWeek - Work hours per week
 * @param weeksPerYear - Working weeks per year (default 47)
 * @returns Annual gross income (ISK)
 *
 * @example
 * const annualIncome = calculatePartTimeAnnualIncome(2500, 20, 47);
 * // Returns: 2,350,000 ISK (2500 × 20 × 47)
 */
export function calculatePartTimeAnnualIncome(
  hourlyWage: number,
  hoursPerWeek: number,
  weeksPerYear: number = 47
): number {
  if (hourlyWage < 0 || hoursPerWeek < 0 || weeksPerYear < 0) return 0;
  return hourlyWage * hoursPerWeek * weeksPerYear;
}

/**
 * Calculate reduced FI number with part-time income
 *
 * In Barista FIRE, part-time income reduces the required FI number because
 * you only need investments to cover the gap between expenses and income.
 *
 * @param fullFI - Full FI number (annual expenses × multiplier)
 * @param partTimeAnnualIncome - Net annual income from part-time work
 * @param multiplier - FI multiplier (default 25)
 * @returns Reduced FI number (ISK)
 *
 * @example
 * const reducedFI = calculateReducedFINumber(15_600_000, 3_024_000, 25);
 * // With 3,024,000 annual income covering part of expenses,
 * // the FI number is reduced accordingly
 */
export function calculateReducedFINumber(
  fullFI: number,
  partTimeAnnualIncome: number,
  multiplier: number = 25
): number {
  if (fullFI < 0 || partTimeAnnualIncome < 0 || multiplier <= 0) return fullFI;

  const annualExpenses = fullFI / multiplier;
  const uncoveredExpenses = Math.max(0, annualExpenses - partTimeAnnualIncome);
  return uncoveredExpenses * multiplier;
}

// ============================================================================
// TIMELINE PROJECTION
// ============================================================================

/**
 * Calculate years and months to reach FI goal
 *
 * Projects timeline based on current savings, additional annual savings,
 * and investment returns. Uses monthly compounding for accuracy.
 *
 * @param currentSavings - Current savings/investments (ISK)
 * @param fiNumber - Target FI amount (ISK)
 * @param annualSavings - Additional savings per year from part-time income (ISK)
 * @param returnRate - Annual investment return rate (decimal, e.g., 0.05 = 5%)
 * @returns Timeline projection with years, months, and monthly data points
 *
 * @example
 * const timeline = calculateTimelineProjection(30_000_000, 100_000_000, 0, 0.05);
 * // Returns: { yearsToFI: ~24, monthsToFI: 8, dataPoints: [...] }
 */
export function calculateTimelineProjection(
  currentSavings: number,
  fiNumber: number,
  annualSavings: number,
  returnRate: number
): TimelineProjection {
  const gap = fiNumber - currentSavings;

  // Edge cases: already at FI
  if (gap <= 0 || currentSavings >= fiNumber) {
    return {
      yearsToFI: 0,
      monthsToFI: 0,
      dataPoints: [],
    };
  }

  // Can't reach FI with negative savings and no return
  if (annualSavings < 0 && returnRate <= 0) {
    return {
      yearsToFI: Infinity,
      monthsToFI: 0,
      dataPoints: [],
    };
  }

  // Coast FIRE path (no additional savings, only growth from existing savings)
  if (annualSavings === 0) {
    if (returnRate === 0) {
      // No growth, no savings = never reach FI
      return {
        yearsToFI: Infinity,
        monthsToFI: 0,
        dataPoints: [],
      };
    }

    // Pure Coast FIRE: only investment growth on existing savings
    // FV = PV * (1 + r)^t → t = ln(FV/PV) / ln(1 + r)
    const yearsToFI = Math.log(fiNumber / currentSavings) / Math.log(1 + returnRate);

    return {
      yearsToFI: Math.floor(yearsToFI),
      monthsToFI: Math.round((yearsToFI - Math.floor(yearsToFI)) * 12),
      dataPoints: generateCoastFIREDataPoints(currentSavings, fiNumber, returnRate),
    };
  }

  // Active savings path (savings + growth)
  // Even with negative monthly savings (expenses > income), existing savings still grow
  const monthlySavings = annualSavings / 12;
  const monthlyRate = returnRate / 12;

  let balance = currentSavings;
  let totalMonths = 0;
  const dataPoints: TimelineDataPoint[] = [];
  const maxMonths = TIMELINE_DEFAULTS.MAX_MONTHS;

  while (balance < fiNumber && totalMonths < maxMonths && balance > 0) {
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    const growth = balance * monthlyRate;

    dataPoints.push({
      year,
      month,
      age: null, // populated later if currentAge provided
      savings: balance,
      additionalSavings: monthlySavings,
      investmentGrowth: growth,
    });

    balance += monthlySavings + growth;
    totalMonths++;
  }

  // Check if we can never reach FI (balance went to 0 or maxMonths reached without reaching FI)
  if (balance <= 0 || (totalMonths >= maxMonths && balance < fiNumber)) {
    return {
      yearsToFI: Infinity,
      monthsToFI: 0,
      dataPoints,
    };
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    yearsToFI: years,
    monthsToFI: months,
    dataPoints,
  };
}

/**
 * Generate data points for Coast FIRE timeline (no additional savings)
 *
 * Helper function for timeline projection when annualSavings = 0.
 * Shows how existing savings grow via compound interest.
 *
 * @param currentSavings - Current savings/investments (ISK)
 * @param fiNumber - Target FI amount (ISK)
 * @param returnRate - Annual investment return rate
 * @returns Array of timeline data points
 */
function generateCoastFIREDataPoints(
  currentSavings: number,
  fiNumber: number,
  returnRate: number
): TimelineDataPoint[] {
  const dataPoints: TimelineDataPoint[] = [];
  const monthlyRate = returnRate / 12;
  const maxMonths = TIMELINE_DEFAULTS.MAX_MONTHS;

  let balance = currentSavings;
  let totalMonths = 0;

  while (balance < fiNumber && totalMonths < maxMonths) {
    const year = Math.floor(totalMonths / 12);
    const month = totalMonths % 12;
    const growth = balance * monthlyRate;

    dataPoints.push({
      year,
      month,
      age: null,
      savings: balance,
      additionalSavings: 0, // Coast FIRE = no additional savings
      investmentGrowth: growth,
    });

    balance += growth;
    totalMonths++;
  }

  return dataPoints;
}

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

/**
 * Calculate life energy (work hours) required for part-time income
 *
 * Converts required income to work hours using actual hourly wage.
 * Returns hours per week, month, year, and total over gap period.
 *
 * @param partTimeHours - Hours needed per week for part-time income
 * @param actualHourlyWage - Actual hourly wage from AWH calculator (ISK)
 * @returns Life energy breakdown by time period
 *
 * @example
 * const lifeEnergy = calculateLifeEnergy(20, 2500);
 * // Returns: { hoursPerWeek: 20, hoursPerMonth: ~87, ... }
 */
export function calculateLifeEnergy(
  partTimeHours: number,
  actualHourlyWage: number
): BaristaFireScenarioResult['lifeEnergy'] {
  if (partTimeHours < 0 || actualHourlyWage <= 0) {
    return undefined;
  }

  const hoursPerWeek = partTimeHours;
  const hoursPerMonth = (partTimeHours * 52) / 12; // Annual hours / 12 months
  const hoursPerYear = partTimeHours * 47; // 47 working weeks in Iceland
  const percentageOfFullTime =
    (partTimeHours / BARISTA_FIRE_DEFAULTS.FULL_TIME_HOURS_PER_WEEK) * 100;

  return {
    hoursPerWeek,
    hoursPerMonth,
    hoursPerYear,
    totalHoursOverGap: 0, // Calculated separately with timeline
    percentageOfFullTime,
  };
}

// ============================================================================
// SCENARIO CALCULATION
// ============================================================================

/**
 * Calculate complete results for a single scenario
 *
 * Orchestrates all calculations for one part-time income scenario:
 * - Net income after pension
 * - Monthly/annual savings
 * - Timeline to FI
 * - Life energy (if actualHourlyWage provided)
 * - Acceleration factor vs Coast FIRE
 *
 * @param scenario - Barista FIRE scenario
 * @param fiNumber - Target FI amount
 * @param currentSavings - Current savings balance
 * @param returnRate - Investment return rate
 * @param annualExpenses - Annual expenses to cover
 * @param actualHourlyWage - Optional actual hourly wage for life energy
 * @param currentAge - Optional current age for age projections
 * @param coastFIRETimeline - Coast FIRE baseline for comparison
 * @returns Complete scenario result with all metrics
 */
export function calculateScenarioResult(
  scenario: BaristaFireScenario,
  fiNumber: number,
  currentSavings: number,
  returnRate: number,
  annualExpenses: number,
  actualHourlyWage: number | null = null,
  currentAge: number | null = null,
  coastFIRETimeline: TimelineProjection
): BaristaFireScenarioResult {
  // Income calculations
  const netAnnualIncome = scenario.netAnnualIncome;
  const netMonthlyIncome = netAnnualIncome / 12;
  const monthlyExpenses = annualExpenses / 12;

  // Savings calculation (can be negative if expenses > income)
  const monthlySavings = netMonthlyIncome - monthlyExpenses;
  const annualSavings = monthlySavings * 12;
  const savingsRate = netAnnualIncome > 0 ? annualSavings / netAnnualIncome : 0;

  // Interest calculation at current savings level
  const monthlyRate = returnRate / 12;
  const monthlyInterestAtStart = currentSavings * monthlyRate;

  // Net monthly change = interest earned + savings (which can be negative)
  // This shows whether the portfolio is growing or shrinking each month
  const netMonthlyChange = monthlyInterestAtStart + monthlySavings;

  // Determine scenario type based on trajectory
  // - Growing: interest + savings > 0, balance increases over time
  // - Sustainable: income roughly covers expenses, interest keeps growing
  // - Depleting: withdrawals exceed interest, balance decreases over time
  let scenarioType: 'growing' | 'depleting' | 'sustainable';
  if (netMonthlyChange > monthlyExpenses * 0.01) {
    // Net positive by more than 1% of expenses = clearly growing
    scenarioType = 'growing';
  } else if (netMonthlyChange < -monthlyExpenses * 0.01) {
    // Net negative by more than 1% of expenses = depleting
    scenarioType = 'depleting';
  } else {
    // Roughly break-even = sustainable
    scenarioType = 'sustainable';
  }

  // Timeline projection - handles both positive and negative savings
  const timeline = calculateTimelineProjection(currentSavings, fiNumber, annualSavings, returnRate);

  // Age projection
  const yearsToFI = timeline.yearsToFI;
  const monthsToFI = timeline.monthsToFI;
  const projectedFIAge = currentAge && Number.isFinite(yearsToFI) ? currentAge + yearsToFI : null;

  // Final nest egg (last data point savings or FI number if reached)
  const finalNestEgg =
    timeline.dataPoints.length > 0
      ? timeline.dataPoints[timeline.dataPoints.length - 1].savings
      : (currentSavings >= fiNumber ? currentSavings : fiNumber);

  // Depletion calculation - check if savings will ever run out
  let willDeplete = false;
  let yearsToDepletion: number | null = null;
  let ageAtDepletion: number | null = null;

  // If savings rate is negative, check if it will deplete
  if (monthlySavings < 0) {
    // Find where balance hits 0 in timeline data
    const depletionPoint = timeline.dataPoints.find(dp => dp.savings <= 0);
    if (depletionPoint) {
      willDeplete = true;
      yearsToDepletion = depletionPoint.year + depletionPoint.month / 12;
      ageAtDepletion = currentAge ? currentAge + yearsToDepletion : null;
    } else if (!Number.isFinite(yearsToFI)) {
      // If we can't reach FI and didn't find depletion, calculate it
      // This happens when the simulation hit max years without reaching FI or depleting
      // For truly depleting scenarios, simulate until depletion
      if (netMonthlyChange < 0) {
        willDeplete = true;
        // Approximate depletion time using iterative approach
        let balance = currentSavings;
        let months = 0;
        const maxMonths = 1200; // 100 years max
        while (balance > 0 && months < maxMonths) {
          const interest = balance * monthlyRate;
          balance = balance + monthlySavings + interest;
          months++;
        }
        if (balance <= 0) {
          yearsToDepletion = months / 12;
          ageAtDepletion = currentAge ? currentAge + yearsToDepletion : null;
        }
      }
    }
  }

  // Life energy calculation (if AWH available)
  let lifeEnergy: BaristaFireScenarioResult['lifeEnergy'] = undefined;
  if (actualHourlyWage && actualHourlyWage > 0 && scenario.workHoursPerWeek) {
    const baseLifeEnergy = calculateLifeEnergy(scenario.workHoursPerWeek, actualHourlyWage);
    if (baseLifeEnergy) {
      lifeEnergy = {
        ...baseLifeEnergy,
        totalHoursOverGap: baseLifeEnergy.hoursPerYear * (Number.isFinite(yearsToFI) ? yearsToFI + monthsToFI / 12 : 0),
      };
    }
  }

  // Acceleration factor (vs Coast FIRE)
  const coastYears = coastFIRETimeline.yearsToFI + coastFIRETimeline.monthsToFI / 12;
  const scenarioYears = Number.isFinite(yearsToFI) ? yearsToFI + monthsToFI / 12 : Infinity;
  const accelerationFactor =
    coastYears > 0 && Number.isFinite(scenarioYears) && scenarioYears > 0
      ? coastYears / scenarioYears
      : (willDeplete ? 0 : 1);

  // Comparison to Coast FIRE
  let compareToCoastFIRE: 'faster' | 'slower' | 'same' = 'same';
  if (willDeplete) {
    compareToCoastFIRE = 'slower'; // Depleting is always worse than Coast FIRE
  } else if (accelerationFactor > 1.1) {
    compareToCoastFIRE = 'faster'; // 10% faster
  } else if (accelerationFactor < 0.9) {
    compareToCoastFIRE = 'slower'; // 10% slower
  }

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    grossAnnualIncome: scenario.grossAnnualIncome,
    netAnnualIncome,
    netMonthlyIncome,
    monthlySavings,
    annualSavings,
    savingsRate,
    monthlyInterestAtStart,
    netMonthlyChange,
    scenarioType,
    yearsToFI,
    monthsToFI,
    projectedFIAge,
    finalNestEgg,
    willDeplete,
    yearsToDepletion,
    ageAtDepletion,
    timeline,
    lifeEnergy,
    accelerationFactor,
    compareToCoastFIRE,
  };
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

/**
 * Calculate all Barista FIRE results
 *
 * Master function that orchestrates all calculations:
 * - Gap calculation
 * - Coast FIRE baseline
 * - Results for all scenarios
 * - Comparison metrics
 *
 * @param state - Current Barista FIRE state
 * @param fiNumber - Target FI amount
 * @param monthlyExpenses - Monthly expenses to cover
 * @param actualHourlyWage - Optional actual hourly wage for life energy
 * @returns Complete Barista FIRE results
 */
export function calculateBaristaFireResults(
  state: BaristaFireState,
  fiNumber: number,
  monthlyExpenses: number,
  actualHourlyWage: number | null = null
): BaristaFireResults {
  const annualExpenses = monthlyExpenses * 12;
  const gap = calculateGapToFI(fiNumber, state.currentSavings);
  const isCoast = isCoastFIRE(fiNumber, state.currentSavings);

  // Calculate Coast FIRE baseline (income = expenses, no additional savings)
  // This shows how existing savings grow via compound interest
  const coastFIRETimeline = calculateTimelineProjection(
    state.currentSavings,
    fiNumber,
    0, // No additional savings in Coast FIRE
    state.investmentReturnRate
  );

  // Calculate results for each scenario
  const scenarioResults: BaristaFireScenarioResult[] = state.scenarios.map((scenario) =>
    calculateScenarioResult(
      scenario,
      fiNumber,
      state.currentSavings,
      state.investmentReturnRate,
      annualExpenses,
      actualHourlyWage,
      state.currentAge,
      coastFIRETimeline
    )
  );

  return {
    fiNumber,
    fiMultiplier: state.fiMultiplier || 25, // Include multiplier for display
    currentSavings: state.currentSavings,
    gap,
    isCoastFIRE: isCoast,
    currentAge: state.currentAge, // For timeline display
    monthlyExpenses,
    annualExpenses,
    scenarioResults,
    coastFIRETimeline,
  };
}
