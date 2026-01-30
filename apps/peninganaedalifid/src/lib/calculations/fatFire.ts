/**
 * Core FatFIRE calculation functions (Lúxus FIRE Áætlun)
 *
 * Pure calculation functions for FatFIRE planning:
 * - Total expenses (base + wish list + splurge)
 * - FI number with multiplier (30x default)
 * - Timeline projections with milestones
 * - Life energy conversions
 * - Scenario comparisons
 *
 * All functions are pure (no side effects) and follow established patterns
 * from other calculators in this application.
 */

import type {
  FatFireState,
  FatFireResults,
  WishListItem,
  Milestone,
  TimelineChartDataPoint,
  ScenarioResult,
  FatFireScenario,
  FatFireLifeEnergy,
  ExpenseBreakdownItem,
} from '@/types/fatFire';
import {
  FATFIRE_DEFAULTS,
  MILESTONE_PERCENTAGES,
  MILESTONE_LABELS,
  PREMIUM_COLORS,
} from '@/lib/constants/fatFire';

/**
 * Calculate total annual expenses
 *
 * Formula: (baseMonthly × 12) + wishListMustHaveMonthly × 12 + splurgeAnnual
 *
 * @param baseExpensesMonthly - Base monthly expenses from baseline or custom (ISK)
 * @param wishListItems - Array of wish list items
 * @param splurgeBudgetAnnual - Annual splurge budget (ISK)
 * @returns Total annual expenses in ISK
 *
 * @example
 * const total = calculateTotalAnnualExpenses(700000, [item1, item2], 2000000);
 * // Returns: 16100000 (base 8.4M + wish 5.7M + splurge 2M)
 */
export function calculateTotalAnnualExpenses(
  baseExpensesMonthly: number,
  wishListItems: WishListItem[],
  splurgeBudgetAnnual: number
): number {
  try {
    // Base expenses annual
    const baseAnnual = Math.max(0, baseExpensesMonthly) * 12;

    // Wish list must-have items annual (nice-to-have excluded from base FI)
    const wishListTotals = calculateWishListTotals(wishListItems);
    const wishListAnnual = wishListTotals.mustHave * 12;

    // Splurge budget
    const splurgeAnnual = Math.max(0, splurgeBudgetAnnual);

    return baseAnnual + wishListAnnual + splurgeAnnual;
  } catch (error) {
    console.error('Error calculating total annual expenses:', error);
    return 0;
  }
}

/**
 * Calculate wish list totals by priority
 *
 * Separates must-have items (included in base FI) from nice-to-have items.
 *
 * @param items - Array of wish list items
 * @returns Object with mustHave, niceToHave, and total monthly costs
 *
 * @example
 * const totals = calculateWishListTotals([
 *   { priority: 'must-have', monthlyCost: 100000, ... },
 *   { priority: 'nice-to-have', monthlyCost: 50000, ... }
 * ]);
 * // Returns: { mustHave: 100000, niceToHave: 50000, total: 150000 }
 */
export function calculateWishListTotals(items: WishListItem[]): {
  mustHave: number;
  niceToHave: number;
  total: number;
} {
  try {
    const mustHave = items
      .filter((item) => item.priority === 'must-have')
      .reduce((sum, item) => sum + Math.max(0, item.monthlyCost), 0);

    const niceToHave = items
      .filter((item) => item.priority === 'nice-to-have')
      .reduce((sum, item) => sum + Math.max(0, item.monthlyCost), 0);

    return {
      mustHave,
      niceToHave,
      total: mustHave + niceToHave,
    };
  } catch (error) {
    console.error('Error calculating wish list totals:', error);
    return { mustHave: 0, niceToHave: 0, total: 0 };
  }
}

/**
 * Calculate FI number with multiplier
 *
 * Formula: Total Annual Expenses × Multiplier
 *
 * FatFIRE typically uses 30x multiplier (3.33% withdrawal rate) for extra safety.
 * Standard FIRE uses 25x (4% withdrawal rate).
 *
 * @param totalAnnualExpenses - Total annual expenses (ISK)
 * @param multiplier - FI multiplier (default 30x for FatFIRE)
 * @returns FI number in ISK
 *
 * @example
 * const fiNumber = calculateFINumber(16100000, 30);
 * // Returns: 483000000 (483M ISK)
 */
export function calculateFINumber(totalAnnualExpenses: number, multiplier: number): number {
  try {
    const expenses = Math.max(0, totalAnnualExpenses);
    const mult = Math.max(1, multiplier);
    return expenses * mult;
  } catch (error) {
    console.error('Error calculating FI number:', error);
    return 0;
  }
}

/**
 * Calculate withdrawal rate from multiplier
 *
 * Formula: (1 / multiplier) × 100
 *
 * @param multiplier - FI multiplier
 * @returns Withdrawal rate as percentage (e.g., 3.33 for 30x)
 *
 * @example
 * const rate = calculateWithdrawalRate(30);
 * // Returns: 3.33 (3.33%)
 */
export function calculateWithdrawalRate(multiplier: number): number {
  try {
    if (multiplier <= 0) return 0;
    return (1 / multiplier) * 100;
  } catch (error) {
    console.error('Error calculating withdrawal rate:', error);
    return 0;
  }
}

/**
 * Calculate years to reach FatFIRE
 *
 * Uses compound interest formula with monthly contributions and growth.
 * Iterates month by month until FI number is reached or max iterations.
 *
 * @param currentSavings - Current portfolio value (ISK)
 * @param fiNumber - Target FI number (ISK)
 * @param annualSavings - Annual savings amount (ISK)
 * @param expectedReturnRate - Expected annual return rate (e.g., 0.06 = 6%)
 * @returns Years to FI (null if unreachable or already there)
 *
 * @example
 * const years = calculateTimelineProjection(50000000, 483000000, 6000000, 0.06);
 * // Returns: 18.5 (approximately 18.5 years)
 */
export function calculateTimelineProjection(
  currentSavings: number,
  fiNumber: number,
  annualSavings: number,
  expectedReturnRate: number
): number | null {
  try {
    // Validation
    if (fiNumber <= 0) return null;
    if (currentSavings < 0) return null;
    if (annualSavings < 0) return null;
    if (expectedReturnRate < 0 || expectedReturnRate > 0.5) return null; // Cap at 50%

    // Already at or past FI
    if (currentSavings >= fiNumber) {
      return 0;
    }

    // No savings and no growth: impossible
    if (annualSavings === 0 && expectedReturnRate === 0) {
      return null;
    }

    // If no savings, only growth can reach FI (Coast FIRE scenario)
    if (annualSavings === 0) {
      if (currentSavings === 0) return null;
      const years = Math.log(fiNumber / currentSavings) / Math.log(1 + expectedReturnRate);
      return years > 100 ? null : years;
    }

    // Monthly calculation
    const monthlySavings = annualSavings / 12;
    const monthlyRate = expectedReturnRate / 12;
    let balance = currentSavings;
    let months = 0;
    const maxMonths = 100 * 12; // 100 years maximum

    while (balance < fiNumber && months < maxMonths) {
      // Add monthly savings
      balance += monthlySavings;
      // Apply monthly growth
      balance *= 1 + monthlyRate;
      months++;

      // @security Check for overflow - if balance becomes Infinity or NaN, exit
      if (!Number.isFinite(balance)) {
        return null;
      }
    }

    if (months >= maxMonths) {
      // Unreachable within reasonable timeframe
      return null;
    }

    return months / 12;
  } catch (error) {
    console.error('Error calculating timeline projection:', error);
    return null;
  }
}

/**
 * Calculate milestones (25%, 50%, 75%, 100% FI)
 *
 * Projects when each milestone will be reached based on current
 * savings trajectory and growth assumptions.
 *
 * @param fiNumber - Target FI number (ISK)
 * @param currentSavings - Current portfolio value (ISK)
 * @param annualSavings - Annual savings amount (ISK)
 * @param expectedReturnRate - Expected annual return rate
 * @returns Array of milestone objects with dates and amounts
 *
 * @example
 * const milestones = calculateMilestones(483000000, 50000000, 6000000, 0.06);
 * // Returns: [
 * //   { percentage: 25, amount: 120750000, yearsFromNow: 4.75, ... },
 * //   { percentage: 50, amount: 241500000, yearsFromNow: 10.2, ... },
 * //   ...
 * // ]
 */
export function calculateMilestones(
  fiNumber: number,
  currentSavings: number,
  annualSavings: number,
  expectedReturnRate: number
): Milestone[] {
  try {
    const milestones: Milestone[] = [];

    for (const percentage of MILESTONE_PERCENTAGES) {
      const targetAmount = (fiNumber * percentage) / 100;

      // Already reached this milestone
      if (currentSavings >= targetAmount) {
        milestones.push({
          percentage,
          amount: targetAmount,
          projectedDate: new Date(),
          yearsFromNow: 0,
          label: MILESTONE_LABELS[percentage as keyof typeof MILESTONE_LABELS],
        });
        continue;
      }

      // Calculate years to reach this milestone
      const yearsToMilestone = calculateTimelineProjection(
        currentSavings,
        targetAmount,
        annualSavings,
        expectedReturnRate
      );

      if (yearsToMilestone === null) {
        // Cannot calculate milestone
        milestones.push({
          percentage,
          amount: targetAmount,
          projectedDate: null,
          yearsFromNow: null,
          label: MILESTONE_LABELS[percentage as keyof typeof MILESTONE_LABELS],
        });
        continue;
      }

      // Calculate projected date
      const projectedDate = new Date();
      projectedDate.setFullYear(projectedDate.getFullYear() + Math.floor(yearsToMilestone));
      const remainingMonths = Math.round((yearsToMilestone % 1) * 12);
      projectedDate.setMonth(projectedDate.getMonth() + remainingMonths);

      milestones.push({
        percentage,
        amount: targetAmount,
        projectedDate,
        yearsFromNow: yearsToMilestone,
        label: MILESTONE_LABELS[percentage as keyof typeof MILESTONE_LABELS],
      });
    }

    return milestones;
  } catch (error) {
    console.error('Error calculating milestones:', error);
    return [];
  }
}

/**
 * Calculate life energy for FatFIRE
 *
 * Converts FI number and timeline to work hours and years.
 * Optionally compares to LeanFIRE to show the "cost" of luxury lifestyle.
 *
 * @param fiNumber - FatFIRE number (ISK)
 * @param actualHourlyWage - User's actual hourly wage (ISK/hour)
 * @param yearsToFI - Years to reach FI (null if not applicable)
 * @param leanFireNumber - Optional LeanFIRE number for comparison (ISK)
 * @returns Life energy metrics or null if no wage available
 *
 * @example
 * const lifeEnergy = calculateLifeEnergy(483000000, 2500, 18.5, 93000000);
 * // Returns: {
 * //   yearsOfWork: 92.9,
 * //   yearsToFI: 18.5,
 * //   leanFireComparison: { difference: 75 years, ... }
 * // }
 */
export function calculateLifeEnergy(
  fiNumber: number,
  actualHourlyWage: number,
  yearsToFI: number | null,
  leanFireNumber?: number
): FatFireLifeEnergy | null {
  try {
    if (!actualHourlyWage || actualHourlyWage <= 0) return null;
    if (fiNumber <= 0) return null;

    // Annual net income (assuming 2080 work hours/year)
    const annualNetIncome = actualHourlyWage * 2080;

    // FatFIRE number in years of work
    const yearsOfWork = fiNumber / annualNetIncome;

    // Build result
    const result: FatFireLifeEnergy = {
      actualHourlyWage,
      annualNetIncome,
      yearsOfWork,
      yearsToFI,
    };

    // Add LeanFIRE comparison if provided
    if (leanFireNumber && leanFireNumber > 0) {
      const leanYearsOfWork = leanFireNumber / annualNetIncome;
      result.leanFireComparison = {
        leanFINumber: leanFireNumber,
        yearsOfWork: leanYearsOfWork,
        difference: yearsOfWork - leanYearsOfWork,
      };
    }

    return result;
  } catch (error) {
    console.error('Error calculating life energy:', error);
    return null;
  }
}

/**
 * Generate timeline chart data points
 *
 * Creates data points for visualization showing portfolio growth
 * from current savings to FI number.
 *
 * @param currentSavings - Starting portfolio value (ISK)
 * @param fiNumber - Target FI number (ISK)
 * @param annualSavings - Annual savings amount (ISK)
 * @param expectedReturnRate - Expected annual return rate
 * @param yearsToFI - Years to reach FI (from calculateTimelineProjection)
 * @returns Array of data points for charting
 */
export function generateTimelineChartData(
  currentSavings: number,
  fiNumber: number,
  annualSavings: number,
  expectedReturnRate: number,
  yearsToFI: number | null
): TimelineChartDataPoint[] {
  try {
    if (yearsToFI === null || yearsToFI === 0) {
      // If already at FI or cannot calculate, return single point
      return [
        {
          year: 0,
          date: new Date(),
          portfolioValue: currentSavings,
          fiPercentage: (currentSavings / fiNumber) * 100,
        },
      ];
    }

    const dataPoints: TimelineChartDataPoint[] = [];
    const monthlySavings = annualSavings / 12;
    const monthlyRate = expectedReturnRate / 12;
    let balance = currentSavings;
    const totalYears = Math.ceil(yearsToFI);

    // Generate yearly data points
    for (let year = 0; year <= totalYears; year++) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + year);

      dataPoints.push({
        year,
        date,
        portfolioValue: Math.round(balance),
        fiPercentage: Math.min(100, (balance / fiNumber) * 100),
      });

      // Project forward 12 months
      for (let month = 0; month < 12; month++) {
        balance += monthlySavings;
        balance *= 1 + monthlyRate;
      }

      // @security Check for overflow - if balance becomes Infinity or NaN, exit
      if (!Number.isFinite(balance)) break;

      // Stop if we've reached FI
      if (balance >= fiNumber) break;
    }

    return dataPoints;
  } catch (error) {
    console.error('Error generating timeline chart data:', error);
    return [];
  }
}

/**
 * Generate expense breakdown for visualization
 *
 * Creates breakdown items for pie charts showing composition
 * of total expenses (base, wish list, splurge).
 *
 * @param baseMonthly - Base monthly expenses (ISK)
 * @param wishListMonthly - Total wish list monthly cost (ISK)
 * @param splurgeMonthly - Splurge budget per month (ISK)
 * @returns Array of breakdown items with percentages
 */
export function generateExpenseBreakdown(
  baseMonthly: number,
  wishListMonthly: number,
  splurgeMonthly: number
): ExpenseBreakdownItem[] {
  try {
    const total = baseMonthly + wishListMonthly + splurgeMonthly;

    if (total === 0) return [];

    const breakdown: ExpenseBreakdownItem[] = [];

    if (baseMonthly > 0) {
      breakdown.push({
        category: 'Grunnútgjöld (Lúxus)',
        amount: baseMonthly,
        percentage: (baseMonthly / total) * 100,
        color: PREMIUM_COLORS.primary,
      });
    }

    if (wishListMonthly > 0) {
      breakdown.push({
        category: 'Óskarlisti',
        amount: wishListMonthly,
        percentage: (wishListMonthly / total) * 100,
        color: PREMIUM_COLORS.amber,
      });
    }

    if (splurgeMonthly > 0) {
      breakdown.push({
        category: 'Aukaútgjaldaáætlun',
        amount: splurgeMonthly,
        percentage: (splurgeMonthly / total) * 100,
        color: PREMIUM_COLORS.rose,
      });
    }

    return breakdown;
  } catch (error) {
    console.error('Error generating expense breakdown:', error);
    return [];
  }
}

/**
 * Calculate complete FatFIRE results from state
 *
 * Master orchestration function that calculates all FatFIRE metrics
 * from the current state. This is the main entry point for the UI.
 *
 * @param state - Complete FatFIRE state
 * @param actualHourlyWage - Optional AWH for life energy calculations
 * @param leanFireNumber - Optional LeanFIRE number for comparison
 * @returns Complete FatFIRE results with all calculations
 *
 * @example
 * const results = calculateFatFireResults(state, 2500, 93000000);
 */
export function calculateFatFireResults(
  state: FatFireState,
  actualHourlyWage?: number | null,
  leanFireNumber?: number
): FatFireResults {
  try {
    // Determine base expenses
    const baseMonthlyExpenses = state.customMonthlyExpense ?? FATFIRE_DEFAULTS.BASE_MONTHLY_EXPENSES;

    // Calculate wish list totals
    const wishListTotals = calculateWishListTotals(state.wishListItems);
    const wishListMonthlyTotal = wishListTotals.mustHave + wishListTotals.niceToHave;

    // Splurge budget monthly
    const splurgeBudgetMonthly = state.splurgeBudgetAnnual / 12;

    // Total expenses
    const totalMonthlyExpenses = baseMonthlyExpenses + wishListTotals.mustHave + splurgeBudgetMonthly;
    const totalAnnualExpenses = calculateTotalAnnualExpenses(
      baseMonthlyExpenses,
      state.wishListItems,
      state.splurgeBudgetAnnual
    );

    // FI calculation
    const multiplier = state.customMultiplier ?? state.multiplier;
    const withdrawalRate = calculateWithdrawalRate(multiplier);
    const fiNumber = calculateFINumber(totalAnnualExpenses, multiplier);

    // Must-have vs nice-to-have breakdown
    const mustHaveTotal = wishListTotals.mustHave;
    const niceToHaveTotal = wishListTotals.niceToHave;
    const mustHaveFINumber = fiNumber; // Base FI includes must-haves
    const fullFINumber = calculateFINumber(
      totalAnnualExpenses + niceToHaveTotal * 12,
      multiplier
    );

    // Expense breakdown for visualization
    const expenseBreakdown = generateExpenseBreakdown(
      baseMonthlyExpenses,
      wishListMonthlyTotal,
      splurgeBudgetMonthly
    );

    // Timeline calculations
    const hasTimelineData = state.currentSavings !== null && state.annualSavings !== null;
    let timeline: FatFireResults['timeline'] | undefined;

    if (hasTimelineData && state.currentSavings !== null && state.annualSavings !== null) {
      const yearsToFI = calculateTimelineProjection(
        state.currentSavings,
        fiNumber,
        state.annualSavings,
        state.expectedReturnRate
      );

      if (yearsToFI !== null) {
        const fiDate = new Date();
        fiDate.setFullYear(fiDate.getFullYear() + Math.floor(yearsToFI));
        const remainingMonths = Math.round((yearsToFI % 1) * 12);
        fiDate.setMonth(fiDate.getMonth() + remainingMonths);

        const chartData = generateTimelineChartData(
          state.currentSavings,
          fiNumber,
          state.annualSavings,
          state.expectedReturnRate,
          yearsToFI
        );

        timeline = {
          yearsToFI,
          fiDate,
          chartData,
        };
      }
    }

    // Milestones
    const milestones = hasTimelineData && state.currentSavings !== null && state.annualSavings !== null
      ? calculateMilestones(
          fiNumber,
          state.currentSavings,
          state.annualSavings,
          state.expectedReturnRate
        )
      : [];

    // Current progress
    let currentProgress: FatFireResults['currentProgress'] | undefined;
    if (state.currentSavings !== null && state.currentSavings > 0) {
      currentProgress = {
        percentage: (state.currentSavings / fiNumber) * 100,
        remaining: Math.max(0, fiNumber - state.currentSavings),
        currentSavings: state.currentSavings,
      };
    }

    // Life energy
    let lifeEnergy: FatFireLifeEnergy | undefined;
    if (actualHourlyWage && actualHourlyWage > 0) {
      const yearsToFI = timeline?.yearsToFI ?? null;
      const calculated = calculateLifeEnergy(
        fiNumber,
        actualHourlyWage,
        yearsToFI,
        leanFireNumber
      );
      if (calculated) {
        lifeEnergy = calculated;
      }
    }

    // Scenario comparison (if scenarios exist)
    const scenarioResults: ScenarioResult[] | undefined =
      state.scenarios.length > 0
        ? state.scenarios.map((scenario) => calculateScenarioResult(scenario, state, actualHourlyWage))
        : undefined;

    return {
      baseMonthlyExpenses,
      wishListMonthlyTotal,
      splurgeBudgetMonthly,
      totalMonthlyExpenses,
      totalAnnualExpenses,
      expenseBreakdown,
      multiplier,
      withdrawalRate,
      fiNumber,
      mustHaveTotal,
      niceToHaveTotal,
      mustHaveFINumber,
      fullFINumber,
      hasTimelineData,
      timeline,
      milestones,
      currentProgress,
      lifeEnergy,
      scenarioResults,
    };
  } catch (error) {
    console.error('Error calculating FatFIRE results:', error);
    // Return safe fallback
    return {
      baseMonthlyExpenses: 0,
      wishListMonthlyTotal: 0,
      splurgeBudgetMonthly: 0,
      totalMonthlyExpenses: 0,
      totalAnnualExpenses: 0,
      expenseBreakdown: [],
      multiplier: FATFIRE_DEFAULTS.MULTIPLIER,
      withdrawalRate: calculateWithdrawalRate(FATFIRE_DEFAULTS.MULTIPLIER),
      fiNumber: 0,
      mustHaveTotal: 0,
      niceToHaveTotal: 0,
      mustHaveFINumber: 0,
      fullFINumber: 0,
      hasTimelineData: false,
      milestones: [],
    };
  }
}

/**
 * Calculate scenario result for comparison
 *
 * Helper function to calculate FI metrics for a single scenario.
 * Used in scenario comparison feature.
 *
 * @param scenario - Scenario configuration
 * @param state - Current FatFIRE state (for timeline inputs)
 * @param actualHourlyWage - Optional AWH for life energy
 * @returns Scenario result with FI number and timeline
 */
function calculateScenarioResult(
  scenario: FatFireScenario,
  state: FatFireState,
  actualHourlyWage?: number | null
): ScenarioResult {
  try {
    const monthlyExpenses = scenario.totalMonthly;
    const annualExpenses = monthlyExpenses * 12;
    const multiplier = state.customMultiplier ?? state.multiplier;
    const fiNumber = calculateFINumber(annualExpenses, multiplier);

    let yearsToFI: number | null = null;
    if (state.currentSavings !== null && state.annualSavings !== null) {
      yearsToFI = calculateTimelineProjection(
        state.currentSavings,
        fiNumber,
        state.annualSavings,
        state.expectedReturnRate
      );
    }

    return {
      scenario,
      monthlyExpenses,
      annualExpenses,
      fiNumber,
      yearsToFI,
    };
  } catch (error) {
    console.error('Error calculating scenario result:', error);
    return {
      scenario,
      monthlyExpenses: 0,
      annualExpenses: 0,
      fiNumber: 0,
      yearsToFI: null,
    };
  }
}
