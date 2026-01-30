/**
 * LeanFIRE Planner Core Calculation Functions
 *
 * Pure calculation functions for the LeanFIRE (Lágmarks FIRE) calculator.
 * Handles minimum FI number calculation, geographic comparison, expense reduction
 * scenarios, frugality optimization, and timeline projection.
 *
 * All functions are pure (no side effects) and handle edge cases.
 */

import type {
  CategoryExpenses,
  FIMultiplier,
  ReductionPercent,
  GeographicComparison,
  LocationProfile,
  ReductionScenario,
  FrugalityTip,
  ExpenseCategory,
} from '@/types/leanFire';

import {
  DEFAULT_BAREBONES_REYKJAVIK,
  DEFAULT_BAREBONES_LANDSBYGGD,
  LOCATION_PROS_CONS,
  FRUGALITY_TIP_TEMPLATES,
  getTotalMonthly,
  estimateTipSavings,
} from '@/lib/constants/leanFire';

// ============================================================================
// BASIC FI CALCULATION
// ============================================================================

/**
 * Calculate minimum FI number from barebones expenses
 *
 * Formula: Monthly barebones × 12 months × FI multiplier
 *
 * @param barebonesExpenses - Monthly barebones expenses by category
 * @param multiplier - FI multiplier (25x = 4% withdrawal, 30x = 3.33% withdrawal)
 * @returns Minimum FI number in ISK
 *
 * @example
 * const fiNumber = calculateMinimumFINumber(240000, 30);
 * // Returns: 86,400,000 ISK (240k × 12 × 30)
 */
export function calculateMinimumFINumber(
  barebonesMonthly: number,
  multiplier: FIMultiplier
): number {
  if (barebonesMonthly < 0) return 0;
  const annual = barebonesMonthly * 12;
  return annual * multiplier;
}

// ============================================================================
// GEOGRAPHIC COMPARISON
// ============================================================================

/**
 * Compare living costs between Reykjavík and Landsbyggð
 *
 * Calculates cost differences by category, FI number impact, and timeline impact
 *
 * @param reykjavikExpenses - Monthly expenses in Reykjavík
 * @param landsbyggdExpenses - Monthly expenses in Landsbyggð
 * @param multiplier - FI multiplier for FI number calculation
 * @returns Complete geographic comparison with differences and impacts
 *
 * @example
 * const comparison = calculateGeographicComparison(
 *   DEFAULT_BAREBONES_REYKJAVIK,
 *   DEFAULT_BAREBONES_LANDSBYGGD,
 *   30
 * );
 * // Returns: { reykjavik: {...}, landsbyggd: {...}, differences: {...}, ... }
 */
export function calculateGeographicComparison(
  reykjavikExpenses: CategoryExpenses,
  landsbyggdExpenses: CategoryExpenses,
  multiplier: FIMultiplier
): GeographicComparison {
  // Calculate totals
  const reykjavikTotal = getTotalMonthly(reykjavikExpenses);
  const landsbyggdTotal = getTotalMonthly(landsbyggdExpenses);

  // Calculate FI numbers
  const reykjavikFI = calculateMinimumFINumber(reykjavikTotal, multiplier);
  const landsbyggdFI = calculateMinimumFINumber(landsbyggdTotal, multiplier);

  // Calculate differences by category (positive = more expensive in Reykjavík)
  const differences: CategoryExpenses = {
    housing: reykjavikExpenses.housing - landsbyggdExpenses.housing,
    food: reykjavikExpenses.food - landsbyggdExpenses.food,
    transport: reykjavikExpenses.transport - landsbyggdExpenses.transport,
    healthcare: reykjavikExpenses.healthcare - landsbyggdExpenses.healthcare,
    insurance: reykjavikExpenses.insurance - landsbyggdExpenses.insurance,
    utilities: reykjavikExpenses.utilities - landsbyggdExpenses.utilities,
    personal: reykjavikExpenses.personal - landsbyggdExpenses.personal,
    entertainment:
      reykjavikExpenses.entertainment - landsbyggdExpenses.entertainment,
    other: reykjavikExpenses.other - landsbyggdExpenses.other,
  };

  const netSavings = reykjavikTotal - landsbyggdTotal;
  const fiNumberDifference = reykjavikFI - landsbyggdFI;

  // Build location profiles
  const reykjavik: LocationProfile = {
    location: 'reykjavik',
    expenses: reykjavikExpenses,
    totalMonthly: reykjavikTotal,
    totalAnnual: reykjavikTotal * 12,
    fiNumber: reykjavikFI,
    pros: LOCATION_PROS_CONS.reykjavik.pros,
    cons: LOCATION_PROS_CONS.reykjavik.cons,
  };

  const landsbyggd: LocationProfile = {
    location: 'landsbyggd',
    expenses: landsbyggdExpenses,
    totalMonthly: landsbyggdTotal,
    totalAnnual: landsbyggdTotal * 12,
    fiNumber: landsbyggdFI,
    pros: LOCATION_PROS_CONS.landsbyggd.pros,
    cons: LOCATION_PROS_CONS.landsbyggd.cons,
  };

  return {
    reykjavik,
    landsbyggd,
    differences,
    fiNumberDifference,
    netSavings,
  };
}

// ============================================================================
// EXPENSE REDUCTION SCENARIOS
// ============================================================================

/**
 * Calculate impact of reducing a specific expense category
 *
 * Models "what if I cut X?" scenarios with detailed impact metrics
 *
 * @param category - Expense category to reduce
 * @param currentAmount - Current monthly expense in this category
 * @param reductionPercent - Percentage to reduce (10, 25, 50, or 100)
 * @param multiplier - FI multiplier for impact calculation
 * @param savingsRate - Monthly savings rate (for timeline calculation, optional)
 * @returns Reduction scenario with savings, FI impact, and timeline impact
 *
 * @example
 * const scenario = calculateReductionScenario('housing', 120000, 50, 30, 50000);
 * // Returns: { category: 'housing', newAmount: 60000, monthlySavings: 60000, ... }
 */
export function calculateReductionScenario(
  category: ExpenseCategory,
  currentAmount: number,
  reductionPercent: ReductionPercent,
  multiplier: FIMultiplier,
  savingsRate: number = 0
): Omit<ReductionScenario, 'id' | 'name' | 'order'> {
  // Calculate new amount after reduction
  const reductionFraction = reductionPercent / 100;
  const newAmount = currentAmount * (1 - reductionFraction);

  // Calculate savings
  const monthlySavings = currentAmount - newAmount;
  const annualSavings = monthlySavings * 12;

  // Calculate FI number impact
  const fiNumberImpact = annualSavings * multiplier;

  // Calculate timeline impact (simplified: savings / monthly rate ≈ months saved)
  // This is a rough approximation - actual timeline depends on compound growth
  let timelineImpact = 0;
  if (savingsRate > 0 && monthlySavings > 0) {
    // Rough estimate: how many months of savings this represents
    timelineImpact = fiNumberImpact / (savingsRate * 12);
  }

  // Calculate efficiency: months saved per 10k kr cut
  let efficiency = 0;
  if (monthlySavings > 0 && timelineImpact > 0) {
    efficiency = timelineImpact / (monthlySavings / 10_000);
  }

  return {
    category,
    currentAmount,
    reductionPercent,
    newAmount,
    monthlySavings,
    annualSavings,
    fiNumberImpact,
    timelineImpact,
    efficiency,
  };
}

/**
 * Calculate cumulative impact of multiple reduction scenarios
 *
 * Sums all reductions and calculates combined FI number and timeline impact
 *
 * @param scenarios - Array of active reduction scenarios
 * @returns Total reductions, new expenses, new FI number, total months saved
 *
 * @example
 * const impact = calculateTotalReductions([scenario1, scenario2]);
 * // Returns: { totalReductions: 80000, newMonthlyExpenses: 160000, ... }
 */
export function calculateTotalReductions(
  scenarios: ReductionScenario[]
): {
  totalReductions: number;
  totalMonthsSaved: number;
  totalFIReduction: number;
} {
  const totalReductions = scenarios.reduce(
    (sum, scenario) => sum + scenario.monthlySavings,
    0
  );

  const totalMonthsSaved = scenarios.reduce(
    (sum, scenario) => sum + scenario.timelineImpact,
    0
  );

  const totalFIReduction = scenarios.reduce(
    (sum, scenario) => sum + scenario.fiNumberImpact,
    0
  );

  return {
    totalReductions,
    totalMonthsSaved,
    totalFIReduction,
  };
}

// ============================================================================
// TIMELINE CALCULATION
// ============================================================================

/**
 * Calculate years to FI given current savings and parameters
 *
 * Uses simplified compound growth calculation with annual contributions
 *
 * @param fiNumber - Target FI number
 * @param currentSavings - Current savings amount
 * @param monthlySavings - Monthly savings rate
 * @param returnRate - Annual investment return rate (e.g., 0.05 = 5%)
 * @returns Years to reach FI number (or 0 if already reached)
 *
 * @example
 * const years = calculateYearsToFI(90000000, 10000000, 100000, 0.05);
 * // Returns: number of years to reach 90M ISK FI number
 */
export function calculateYearsToFI(
  fiNumber: number,
  currentSavings: number,
  monthlySavings: number,
  returnRate: number
): number {
  // Already at FI
  if (currentSavings >= fiNumber) {
    return 0;
  }

  // No savings = infinite timeline
  if (monthlySavings <= 0) {
    return 999;
  }

  const annualSavings = monthlySavings * 12;
  const monthlyReturnRate = returnRate / 12;

  let balance = currentSavings;
  let months = 0;
  const maxMonths = 600; // Safety limit (50 years)

  // Month-by-month compound calculation
  while (balance < fiNumber && months < maxMonths) {
    // Add monthly savings
    balance += monthlySavings;

    // Apply monthly return
    balance *= 1 + monthlyReturnRate;

    months++;
  }

  return months / 12; // Convert to years
}

// ============================================================================
// FRUGALITY OPTIMIZATION
// ============================================================================

/**
 * Generate personalized frugality tips based on expense analysis
 *
 * Identifies high-spend categories and suggests Iceland-specific tips
 *
 * @param currentExpenses - User's current expenses
 * @param minimumExpenses - Minimum/barebones expenses for comparison
 * @param actualHourlyWage - User's actual hourly wage (for timeline impact)
 * @param fiMultiplier - FI multiplier
 * @param currentFINumber - Current FI number
 * @param savingsRate - Current monthly savings rate
 * @returns Array of personalized frugality tips sorted by impact
 *
 * @example
 * const tips = calculateFrugalityTipImpact(currentExpenses, barebonesExpenses, 5000, 30);
 * // Returns: [{ id: '...', category: 'food', potentialSavings: 12000, ... }, ...]
 */
export function generateFrugalityTips(
  currentExpenses: CategoryExpenses,
  minimumExpenses: CategoryExpenses,
  actualHourlyWage: number,
  fiMultiplier: FIMultiplier,
  currentFINumber: number,
  savingsRate: number = 0
): FrugalityTip[] {
  const tips: FrugalityTip[] = [];

  // Identify high-spend categories (spending more than 10% above minimum)
  const categories = Object.keys(currentExpenses) as ExpenseCategory[];

  categories.forEach((category) => {
    const current = currentExpenses[category];
    const minimum = minimumExpenses[category];

    // Only generate tips if spending significantly more than minimum
    if (current > minimum * 1.1) {
      // Get tips for this category
      const categoryTips = FRUGALITY_TIP_TEMPLATES.filter(
        (tip) => tip.category === category
      );

      categoryTips.forEach((tipTemplate) => {
        // Estimate potential savings
        const potentialSavings = Math.min(
          current - minimum, // Can't save more than excess
          estimateTipSavings(tipTemplate, current)
        );

        // Calculate timeline impact
        let timelineImpact = 0;
        if (potentialSavings > 0 && savingsRate > 0) {
          const annualSavings = potentialSavings * 12;
          const fiReduction = annualSavings * fiMultiplier;
          // Rough estimate: FI reduction / annual savings rate
          timelineImpact = fiReduction / (savingsRate * 12);
        }

        tips.push({
          id: `${category}-${tipTemplate.title}`,
          category,
          title: tipTemplate.title,
          description: tipTemplate.description,
          potentialSavings,
          timelineImpact,
          difficulty: tipTemplate.difficulty,
          icelandicResources: tipTemplate.icelandicResources,
          implemented: false,
        });
      });
    }
  });

  // Sort by timeline impact (biggest first)
  tips.sort((a, b) => b.timelineImpact - a.timelineImpact);

  return tips;
}

/**
 * Calculate impact of implementing a frugality tip
 *
 * @param tip - Frugality tip to implement
 * @param savingsRate - Current monthly savings rate
 * @param multiplier - FI multiplier
 * @returns Impact metrics (FI reduction, timeline impact)
 */
export function calculateFrugalityTipImpact(
  tip: FrugalityTip,
  savingsRate: number,
  multiplier: FIMultiplier
): {
  fiReduction: number;
  timelineMonthsSaved: number;
} {
  const annualSavings = tip.potentialSavings * 12;
  const fiReduction = annualSavings * multiplier;

  let timelineMonthsSaved = 0;
  if (savingsRate > 0) {
    timelineMonthsSaved = fiReduction / savingsRate;
  }

  return {
    fiReduction,
    timelineMonthsSaved,
  };
}

// ============================================================================
// LIFE ENERGY CALCULATIONS
// ============================================================================

/**
 * Calculate life energy metrics for LeanFIRE scenarios
 *
 * Converts FI numbers to work hours and work years
 *
 * @param fiNumber - Minimum FI number
 * @param actualHourlyWage - User's actual hourly wage
 * @returns Life energy in hours and years
 *
 * @example
 * const lifeEnergy = calculateLifeEnergy(90000000, 5000);
 * // Returns: { hours: 18000, years: 8.65 }
 */
export function calculateLifeEnergy(
  fiNumber: number,
  actualHourlyWage: number
): {
  hours: number;
  years: number;
} {
  if (actualHourlyWage <= 0) {
    return { hours: 0, years: 0 };
  }

  const hours = fiNumber / actualHourlyWage;
  const years = hours / 2080; // Standard work hours per year

  return { hours, years };
}

// ============================================================================
// MASTER CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate complete LeanFIRE results from state
 *
 * Master orchestrator function that combines all calculations
 *
 * @param state - Complete LeanFIRE state
 * @param actualHourlyWage - User's actual hourly wage (optional)
 * @returns Complete LeanFIRE calculation results
 */
export function calculateLeanFireResults(
  state: {
    barebonesExpenses: CategoryExpenses;
    fiMultiplier: FIMultiplier;
    selectedLocation: 'reykjavik' | 'landsbyggd' | 'custom';
    reductionScenarios: ReductionScenario[];
    currentSavings: number | null;
    savingsRate: number | null;
    investmentReturn: number;
  },
  actualHourlyWage: number | null = null
): {
  barebonesMonthly: number;
  barebonesAnnual: number;
  minimumFINumber: number;
  fiMultiplier: FIMultiplier;
  locationComparison?: GeographicComparison;
  totalReductions: number;
  newMonthlyExpenses: number;
  newFINumber: number;
  totalMonthsSaved: number;
  yearsToFI?: number;
  monthsToFI?: number;
  frugalityTips: FrugalityTip[];
  lifeEnergy?: {
    minimumFIInHours: number;
    minimumFIInYears: number;
    comfortableFIInYears: number;
    deluxeFIInYears: number;
  };
} {
  const {
    barebonesExpenses,
    fiMultiplier,
    selectedLocation,
    reductionScenarios,
    currentSavings,
    savingsRate,
    investmentReturn,
  } = state;

  // Basic calculations
  const barebonesMonthly = getTotalMonthly(barebonesExpenses);
  const barebonesAnnual = barebonesMonthly * 12;
  const minimumFINumber = calculateMinimumFINumber(
    barebonesMonthly,
    fiMultiplier
  );

  // Geographic comparison (if not custom)
  let locationComparison: GeographicComparison | undefined;
  if (selectedLocation !== 'custom') {
    locationComparison = calculateGeographicComparison(
      DEFAULT_BAREBONES_REYKJAVIK,
      DEFAULT_BAREBONES_LANDSBYGGD,
      fiMultiplier
    );
  }

  // Reduction scenarios impact
  const reductionImpact = calculateTotalReductions(reductionScenarios);
  const newMonthlyExpenses = barebonesMonthly - reductionImpact.totalReductions;
  const newFINumber = calculateMinimumFINumber(newMonthlyExpenses, fiMultiplier);

  // Timeline calculations (if data available)
  let yearsToFI: number | undefined;
  let monthsToFI: number | undefined;
  if (
    currentSavings !== null &&
    savingsRate !== null &&
    currentSavings >= 0 &&
    savingsRate >= 0
  ) {
    const years = calculateYearsToFI(
      newFINumber,
      currentSavings,
      savingsRate,
      investmentReturn
    );
    yearsToFI = Math.floor(years);
    monthsToFI = Math.round((years - yearsToFI) * 12);
  }

  // Frugality tips
  const frugalityTips = generateFrugalityTips(
    barebonesExpenses,
    DEFAULT_BAREBONES_REYKJAVIK, // Use Reykjavík as baseline minimum
    actualHourlyWage || 0,
    fiMultiplier,
    minimumFINumber,
    savingsRate || 0
  );

  // Life energy calculations (if AWH available)
  let lifeEnergy:
    | {
        minimumFIInHours: number;
        minimumFIInYears: number;
        comfortableFIInYears: number;
        deluxeFIInYears: number;
      }
    | undefined;

  if (actualHourlyWage && actualHourlyWage > 0) {
    const minimumLE = calculateLifeEnergy(minimumFINumber, actualHourlyWage);

    // Comfortable = 2x barebones, Deluxe = 4x barebones
    const comfortableFI = calculateMinimumFINumber(
      barebonesMonthly * 2,
      fiMultiplier
    );
    const deluxeFI = calculateMinimumFINumber(
      barebonesMonthly * 4,
      fiMultiplier
    );

    const comfortableLE = calculateLifeEnergy(comfortableFI, actualHourlyWage);
    const deluxeLE = calculateLifeEnergy(deluxeFI, actualHourlyWage);

    lifeEnergy = {
      minimumFIInHours: minimumLE.hours,
      minimumFIInYears: minimumLE.years,
      comfortableFIInYears: comfortableLE.years,
      deluxeFIInYears: deluxeLE.years,
    };
  }

  return {
    barebonesMonthly,
    barebonesAnnual,
    minimumFINumber,
    fiMultiplier,
    locationComparison,
    totalReductions: reductionImpact.totalReductions,
    newMonthlyExpenses,
    newFINumber,
    totalMonthsSaved: reductionImpact.totalMonthsSaved,
    yearsToFI,
    monthsToFI,
    frugalityTips,
    lifeEnergy,
  };
}
