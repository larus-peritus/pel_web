/**
 * FIRE Type Calculation Functions
 *
 * Pure calculation functions for the FIRE Type Explorer (FIRE Leiðarvísir).
 * All functions are side-effect-free and testable.
 *
 * Functions include:
 * - Basic FI number calculations for each FIRE type
 * - Timeline calculations (years to FI)
 * - CoastFIRE present value calculations
 * - BaristaFIRE part-time work calculations
 * - Effort and feasibility assessments
 * - Recommendation engine
 *
 * Based on FIRE community concepts adapted for Icelandic context.
 */

import type {
  FIRETypeId,
  FIREAssumptions,
  UserFinancialInputs,
  FIRECalculation,
  FIRERecommendation,
  EffortLevel,
  RecommendationConfidence,
  CoastFIREData,
  BaristaFIREData,
} from '@/types/fireTypes';
import { FIRE_TYPE_DEFINITIONS } from '@/lib/constants/fireTypes';

// ============================================================================
// BASIC FI NUMBER CALCULATIONS
// ============================================================================

/**
 * Calculate basic FI number (target nest egg)
 *
 * Formula: Monthly expenses × 12 × Multiplier
 * Standard multiplier is 25 (for 4% SWR) or 30 (for 3.33% SWR)
 *
 * @param monthlyExpenses - Monthly expenses (ISK)
 * @param multiplier - FI multiplier (typically 25-33)
 * @returns Target nest egg (ISK)
 */
export const calculateFINumber = (
  monthlyExpenses: number,
  multiplier: number
): number => {
  if (monthlyExpenses < 0 || multiplier <= 0) {
    return 0;
  }

  const annualExpenses = monthlyExpenses * 12;
  return annualExpenses * multiplier;
};

// ============================================================================
// YEARS TO FI CALCULATION
// ============================================================================

/**
 * Calculate years to reach FI number
 *
 * Uses future value of series formula with monthly compounding.
 * Iteratively calculates month-by-month growth until target is reached.
 *
 * @param fiNumber - Target FI number (ISK)
 * @param currentNetWorth - Current invested assets (ISK)
 * @param annualSavings - Annual savings amount (ISK)
 * @param expectedReturn - Expected annual return (e.g., 0.06 = 6%)
 * @returns Years to reach FI (null if impossible within 100 years)
 */
export const calculateYearsToFI = (
  fiNumber: number,
  currentNetWorth: number,
  annualSavings: number,
  expectedReturn: number
): number | null => {
  // Edge cases
  if (fiNumber <= 0) return null;
  if (currentNetWorth >= fiNumber) return 0;
  if (annualSavings <= 0 && currentNetWorth < fiNumber) return null;
  if (expectedReturn < 0) return null;

  // Convert to monthly values
  const monthlySavings = annualSavings / 12;
  const monthlyReturn = expectedReturn / 12;

  // Simulate month by month
  let balance = currentNetWorth;
  let months = 0;
  const maxMonths = 100 * 12; // 100 years max

  while (balance < fiNumber && months < maxMonths) {
    // Add monthly savings
    balance += monthlySavings;
    // Apply monthly growth
    balance *= 1 + monthlyReturn;
    months++;
  }

  if (months >= maxMonths) {
    return null; // Impossible within 100 years
  }

  return months / 12; // Convert to years
};

// ============================================================================
// COASTFIRE CALCULATIONS
// ============================================================================

/**
 * Calculate CoastFIRE number (amount needed today)
 *
 * CoastFIRE means you have enough invested today that it will grow
 * to your FI number by retirement without additional contributions.
 *
 * Formula: Present Value = FV / (1 + r)^n
 *
 * @param targetFI - Target FI number at retirement (ISK)
 * @param currentAge - Current age
 * @param targetAge - Target retirement age
 * @param expectedReturn - Expected annual return (e.g., 0.06 = 6%)
 * @returns Amount needed today to "coast" (ISK)
 */
export const calculateCoastFINumber = (
  targetFI: number,
  currentAge: number,
  targetAge: number,
  expectedReturn: number
): number => {
  if (targetFI <= 0 || targetAge < currentAge || expectedReturn < 0) {
    return 0;
  }

  const yearsToGrow = targetAge - currentAge;

  // If no time to grow (ages equal), need full amount now
  if (yearsToGrow === 0) {
    return targetFI;
  }

  // Present value formula
  const presentValue = targetFI / Math.pow(1 + expectedReturn, yearsToGrow);

  return presentValue;
};

// ============================================================================
// BARISTAFIRE CALCULATIONS
// ============================================================================

/**
 * Calculate BaristaFIRE part-time income needed
 *
 * BaristaFIRE means you have partial FI (e.g., 50-70% of full FI number)
 * and work part-time to cover the remaining expenses.
 *
 * @param targetFI - Full FI number for comfortable lifestyle (ISK)
 * @param partTimeAnnualIncome - Annual part-time income (ISK)
 * @param multiplier - FI multiplier (typically 25-33)
 * @returns Reduced FI number needed (ISK)
 */
export const calculateBaristaFINumber = (
  targetFI: number,
  partTimeAnnualIncome: number,
  multiplier: number
): number => {
  if (targetFI <= 0 || partTimeAnnualIncome < 0 || multiplier <= 0) {
    return targetFI;
  }

  // Calculate how much the part-time income reduces the FI number
  const incomeOffset = partTimeAnnualIncome * multiplier;
  const reducedFI = targetFI - incomeOffset;

  // Never go below 0
  return Math.max(0, reducedFI);
};

// ============================================================================
// COMPLETE FIRE CALCULATION FOR ONE TYPE
// ============================================================================

/**
 * Calculate complete FIRE metrics for one FIRE type
 *
 * Performs all calculations for a specific FIRE type including:
 * - FI number target
 * - Years to reach FI
 * - Current progress
 * - Effort level
 * - Feasibility assessment
 * - Type-specific data (CoastFIRE, BaristaFIRE)
 *
 * @param fireTypeId - Which FIRE type to calculate
 * @param inputs - User financial inputs
 * @param assumptions - Calculation assumptions
 * @param actualHourlyWage - Optional AWH for life energy (ISK/hour)
 * @returns Complete FIRE calculation result
 */
export const calculateFIRECalculation = (
  fireTypeId: FIRETypeId,
  inputs: UserFinancialInputs,
  assumptions: FIREAssumptions,
  actualHourlyWage: number | null = null
): FIRECalculation => {
  const definition = FIRE_TYPE_DEFINITIONS.find((d) => d.id === fireTypeId);
  if (!definition) {
    throw new Error(`Unknown FIRE type: ${fireTypeId}`);
  }

  // Determine monthly expenses for this FIRE type
  let monthlyExpenses: number;
  if (definition.expenseTier) {
    monthlyExpenses = inputs.monthlyExpenses[definition.expenseTier];
  } else {
    // CoastFIRE and BaristaFIRE use comfortable as baseline
    monthlyExpenses = inputs.monthlyExpenses.comfortable;
  }

  const annualExpenses = monthlyExpenses * 12;
  const multiplier = definition.multiplier;

  // Calculate base FI number
  let fiNumber = calculateFINumber(monthlyExpenses, multiplier);

  // Type-specific adjustments and data
  let coastData: CoastFIREData | undefined;
  let baristaData: BaristaFIREData | undefined;

  if (fireTypeId === 'coastfire') {
    // CoastFIRE: Calculate present value needed today
    const retirementAge =
      inputs.targetRetirementAge || assumptions.pensionAge;
    const coastFINumber = calculateCoastFINumber(
      fiNumber,
      inputs.currentAge,
      retirementAge,
      assumptions.expectedGrowthRate
    );

    const isCoasting = inputs.currentNetWorth >= coastFINumber;
    const yearsUntilCoast = isCoasting
      ? null
      : calculateYearsToFI(
          coastFINumber,
          inputs.currentNetWorth,
          inputs.annualSavings,
          assumptions.expectedGrowthRate
        );

    coastData = {
      coastFINumber,
      isCoasting,
      yearsUntilCoast,
      coastDate:
        yearsUntilCoast !== null
          ? new Date(
              new Date().getFullYear() + yearsUntilCoast,
              new Date().getMonth(),
              new Date().getDate()
            )
          : null,
      workIncomeNeeded: monthlyExpenses, // Need to cover current expenses with work
    };

    // For CoastFIRE, use the coast number as the FI target
    fiNumber = coastFINumber;
  } else if (fireTypeId === 'baristafire') {
    // BaristaFIRE: Assume 20 hours/week at minimum wage
    const estimatedPartTimeIncome = actualHourlyWage
      ? actualHourlyWage * 20 * 52 // 20 hrs/week for 52 weeks
      : 1_500 * 20 * 52; // Default 1500 ISK/hour

    const fullFINumber = fiNumber;
    const reducedFINumber = calculateBaristaFINumber(
      fullFINumber,
      estimatedPartTimeIncome,
      multiplier
    );

    const partTimeIncomeNeeded =
      (fullFINumber - reducedFINumber) / multiplier;

    baristaData = {
      partTimeIncomeNeeded: partTimeIncomeNeeded / 12, // Monthly
      hoursPerWeekNeeded: actualHourlyWage
        ? (partTimeIncomeNeeded / 52 / actualHourlyWage)
        : null,
      reducedFINumber,
      fullFINumber,
      savings: fullFINumber - reducedFINumber,
    };

    // For BaristaFIRE, use the reduced number
    fiNumber = reducedFINumber;
  }

  // Calculate timeline
  const yearsToFI = calculateYearsToFI(
    fiNumber,
    inputs.currentNetWorth,
    inputs.annualSavings,
    assumptions.expectedGrowthRate
  );

  const monthsToFI = yearsToFI !== null ? yearsToFI * 12 : null;
  const targetDate =
    yearsToFI !== null
      ? new Date(
          new Date().getFullYear() + yearsToFI,
          new Date().getMonth(),
          new Date().getDate()
        )
      : null;
  const targetAge =
    yearsToFI !== null ? inputs.currentAge + yearsToFI : null;

  // Calculate progress
  const currentProgress = Math.min(
    100,
    (inputs.currentNetWorth / fiNumber) * 100
  );
  const amountRemaining = Math.max(0, fiNumber - inputs.currentNetWorth);

  // Calculate effort level
  const savingsRate = inputs.savingsRate;
  const effortLevel = calculateEffortLevel(yearsToFI, savingsRate);

  // Calculate feasibility
  const feasibility = calculateFeasibility(yearsToFI, inputs.currentAge);

  // Life energy calculations
  let lifeEnergy:
    | { fiNumberInHours: number; fiNumberInYears: number }
    | undefined;
  if (actualHourlyWage && actualHourlyWage > 0) {
    const fiNumberInHours = fiNumber / actualHourlyWage;
    const fiNumberInYears = fiNumberInHours / (47 * 40); // 47 weeks, 40 hrs/week (Icelandic)
    lifeEnergy = { fiNumberInHours, fiNumberInYears };
  }

  return {
    fireTypeId,
    monthlyExpenses,
    annualExpenses,
    multiplier,
    fiNumber,
    yearsToFI,
    monthsToFI,
    targetDate,
    targetAge,
    currentProgress,
    amountRemaining,
    effortLevel,
    feasibility,
    coastData,
    baristaData,
    lifeEnergy,
  };
};

// ============================================================================
// CALCULATE ALL FIRE TYPES
// ============================================================================

/**
 * Calculate all five FIRE types at once
 *
 * Convenience function that calculates metrics for all FIRE types.
 *
 * @param inputs - User financial inputs
 * @param assumptions - Calculation assumptions
 * @param actualHourlyWage - Optional AWH for life energy (ISK/hour)
 * @returns Object with calculations for all FIRE types
 */
export const calculateAllFIRETypes = (
  inputs: UserFinancialInputs,
  assumptions: FIREAssumptions,
  actualHourlyWage: number | null = null
): {
  leanfire: FIRECalculation;
  regularfire: FIRECalculation;
  coastfire: FIRECalculation;
  baristafire: FIRECalculation;
  fatfire: FIRECalculation;
} => {
  return {
    leanfire: calculateFIRECalculation(
      'leanfire',
      inputs,
      assumptions,
      actualHourlyWage
    ),
    regularfire: calculateFIRECalculation(
      'regularfire',
      inputs,
      assumptions,
      actualHourlyWage
    ),
    coastfire: calculateFIRECalculation(
      'coastfire',
      inputs,
      assumptions,
      actualHourlyWage
    ),
    baristafire: calculateFIRECalculation(
      'baristafire',
      inputs,
      assumptions,
      actualHourlyWage
    ),
    fatfire: calculateFIRECalculation(
      'fatfire',
      inputs,
      assumptions,
      actualHourlyWage
    ),
  };
};

// ============================================================================
// EFFORT LEVEL CALCULATION
// ============================================================================

/**
 * Calculate effort level required to reach FIRE
 *
 * Categorizes the difficulty based on years to FI and savings rate.
 *
 * @param yearsToFI - Years to reach FI (null if impossible)
 * @param savingsRate - Current savings rate (0-100)
 * @returns Effort level category
 */
export const calculateEffortLevel = (
  yearsToFI: number | null,
  savingsRate: number
): EffortLevel => {
  // Impossible or extremely long
  if (yearsToFI === null || yearsToFI > 40) {
    return 'extreme';
  }

  // Combined score based on time and savings rate
  if (yearsToFI <= 10 && savingsRate >= 50) {
    return 'extreme'; // Very aggressive
  }

  if (yearsToFI <= 15 && savingsRate >= 40) {
    return 'high'; // Aggressive
  }

  if (yearsToFI <= 20 && savingsRate >= 25) {
    return 'moderate'; // Reasonable
  }

  if (yearsToFI <= 30 && savingsRate >= 15) {
    return 'moderate'; // Standard FIRE path
  }

  if (yearsToFI <= 40) {
    return 'low'; // Long-term, modest savings
  }

  return 'extreme';
};

// ============================================================================
// FEASIBILITY CALCULATION
// ============================================================================

/**
 * Calculate feasibility score (0-100)
 *
 * Assesses how realistic/achievable a FIRE goal is based on:
 * - Time to reach (shorter is better)
 * - Age at achievement (younger is better)
 *
 * @param yearsToFI - Years to reach FI (null if impossible)
 * @param currentAge - Current age
 * @returns Feasibility score (0-100, higher is better)
 */
export const calculateFeasibility = (
  yearsToFI: number | null,
  currentAge: number
): number => {
  if (yearsToFI === null || yearsToFI > 50) {
    return 0; // Not feasible
  }

  const ageAtFI = currentAge + yearsToFI;

  let score = 100;

  // Penalize long timelines
  if (yearsToFI > 30) {
    score -= (yearsToFI - 30) * 3;
  } else if (yearsToFI > 20) {
    score -= (yearsToFI - 20) * 2;
  } else if (yearsToFI > 10) {
    score -= (yearsToFI - 10) * 1;
  }

  // Penalize reaching FI very late in life
  if (ageAtFI > 70) {
    score -= (ageAtFI - 70) * 5;
  } else if (ageAtFI > 65) {
    score -= (ageAtFI - 65) * 2;
  }

  // Bonus for reaching FI early
  if (yearsToFI <= 10) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
};

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

/**
 * Generate FIRE type recommendations
 *
 * Ranks all FIRE types and provides reasoning for top recommendations.
 * Considers age, savings rate, timeline, and feasibility.
 *
 * @param calculations - Calculations for all FIRE types
 * @returns Array of recommendations sorted by rank
 */
export const calculateFIRERecommendations = (calculations: {
  leanfire: FIRECalculation;
  regularfire: FIRECalculation;
  coastfire: FIRECalculation;
  baristafire: FIRECalculation;
  fatfire: FIRECalculation;
}): FIRERecommendation[] => {
  const recommendations: FIRERecommendation[] = [];

  // Score each FIRE type
  Object.entries(calculations).forEach(([typeId, calc]) => {
    const fireTypeId = typeId as FIRETypeId;
    let score = 50; // Base score
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Feasibility impact
    if (calc.feasibility >= 80) {
      score += 20;
      reasons.push('Mjög raunhæft markmið');
    } else if (calc.feasibility >= 60) {
      score += 10;
      reasons.push('Raunhæft markmið');
    } else if (calc.feasibility < 40) {
      score -= 20;
      warnings.push('Erfitt markmið að ná');
    }

    // Timeline impact
    if (calc.yearsToFI !== null) {
      if (calc.yearsToFI <= 10) {
        score += 15;
        reasons.push('Hægt að ná fljótt (innan 10 ára)');
      } else if (calc.yearsToFI <= 15) {
        score += 10;
        reasons.push('Raunhæfur tími til marks');
      } else if (calc.yearsToFI > 25) {
        score -= 10;
        warnings.push('Tekur langan tíma (yfir 25 ár)');
      }
    } else {
      score -= 30;
      warnings.push('Ekki hægt að ná með núverandi sparnaði');
    }

    // Effort level impact
    switch (calc.effortLevel) {
      case 'low':
        score += 15;
        reasons.push('Lítil fórn í lífsstíl');
        break;
      case 'moderate':
        score += 10;
        reasons.push('Hófleg fórn í lífsstíl');
        break;
      case 'high':
        score -= 5;
        warnings.push('Krefst mikillar fórnar');
        break;
      case 'extreme':
        score -= 15;
        warnings.push('Krefst öfgafullrar fórnar');
        break;
    }

    // Type-specific bonuses/penalties
    switch (fireTypeId) {
      case 'regularfire':
        score += 5; // Default balanced option
        reasons.push('Klassísk og vel þekkt leið');
        break;
      case 'leanfire':
        if (calc.monthlyExpenses < 300_000) {
          score += 5;
          reasons.push('Þú ert þegar að lifa sparlega');
        } else {
          warnings.push('Krefst mjög lítilla útgjalda');
        }
        break;
      case 'coastfire':
        if (
          calc.coastData?.isCoasting ||
          (calc.coastData?.yearsUntilCoast !== null &&
            calc.coastData?.yearsUntilCoast !== undefined &&
            calc.coastData.yearsUntilCoast < 10)
        ) {
          score += 10;
          reasons.push('Nálægt eða þegar kominn í coast mode');
        }
        break;
      case 'baristafire':
        if (calc.yearsToFI !== null && calc.yearsToFI < 15) {
          score += 8;
          reasons.push('Fljótari en full FIRE');
        }
        break;
      case 'fatfire':
        if (calc.yearsToFI !== null && calc.yearsToFI > 20) {
          warnings.push('Tekur mjög langan tíma');
        }
        break;
    }

    // Determine confidence
    let confidence: RecommendationConfidence = 'medium';
    if (score >= 70 && calc.feasibility >= 70) {
      confidence = 'high';
    } else if (score < 50 || calc.feasibility < 40) {
      confidence = 'low';
    }

    recommendations.push({
      fireTypeId,
      rank: 0, // Will be set after sorting
      score: Math.max(0, Math.min(100, score)),
      confidence,
      reasons: reasons.slice(0, 4), // Top 4 reasons
      warnings: warnings.slice(0, 3), // Top 3 warnings
      yearsToFI: calc.yearsToFI,
      monthlySavingsRequired:
        calc.yearsToFI !== null
          ? (calc.amountRemaining / (calc.yearsToFI * 12))
          : null,
    });
  });

  // Sort by score and assign ranks
  recommendations.sort((a, b) => b.score - a.score);
  recommendations.forEach((rec, index) => {
    rec.rank = index + 1;
  });

  return recommendations;
};

// ============================================================================
// TIMELINE GENERATION
// ============================================================================

/**
 * Calculate required savings rate to reach FI
 *
 * Iteratively solves for the savings rate needed to reach a FI number
 * within a given timeframe.
 *
 * @param fiNumber - Target FI number (ISK)
 * @param currentNetWorth - Current invested assets (ISK)
 * @param annualIncome - Annual income (ISK)
 * @param yearsAvailable - Years available to reach FI
 * @param expectedReturn - Expected annual return (e.g., 0.06 = 6%)
 * @returns Required savings rate (0-100), or null if impossible
 */
export const calculateRequiredSavingsRate = (
  fiNumber: number,
  currentNetWorth: number,
  annualIncome: number,
  yearsAvailable: number,
  expectedReturn: number
): number | null => {
  // Edge cases
  if (fiNumber <= 0 || yearsAvailable <= 0 || annualIncome <= 0) {
    return null;
  }
  if (currentNetWorth >= fiNumber) {
    return 0; // Already reached
  }

  // Binary search for savings rate
  let low = 0;
  let high = 100;
  const tolerance = 0.01; // 0.01% accuracy
  const maxIterations = 100;
  let iterations = 0;

  while (high - low > tolerance && iterations < maxIterations) {
    iterations++;
    const midRate = (low + high) / 2;
    const annualSavings = (annualIncome * midRate) / 100;

    // Simulate growth with this savings rate
    const yearsToReach = calculateYearsToFI(
      fiNumber,
      currentNetWorth,
      annualSavings,
      expectedReturn
    );

    if (yearsToReach === null) {
      // Too slow, need higher savings rate
      low = midRate;
    } else if (yearsToReach > yearsAvailable) {
      // Too slow, need higher savings rate
      low = midRate;
    } else {
      // Too fast or just right, can reduce savings rate
      high = midRate;
    }
  }

  const finalRate = (low + high) / 2;

  // Verify this rate actually works
  const annualSavings = (annualIncome * finalRate) / 100;
  const yearsToReach = calculateYearsToFI(
    fiNumber,
    currentNetWorth,
    annualSavings,
    expectedReturn
  );

  if (yearsToReach === null || yearsToReach > yearsAvailable) {
    return null; // Impossible even at 100% savings
  }

  return Math.min(100, finalRate);
};

/**
 * Generate FIRE timeline with milestones
 *
 * Creates a timeline object showing progress milestones (0%, 25%, 50%, 75%, 100%)
 * and projected yearly net worth growth.
 *
 * @param calculation - FIRE calculation result
 * @param currentAge - Current age
 * @returns Complete timeline with milestones
 */
export const generateFIRETimeline = (
  calculation: FIRECalculation,
  currentAge: number
): import('@/types/fireTypes').FIRETimeline => {
  const milestones: import('@/types/fireTypes').TimelineMilestone[] = [];
  const projectedPath: Array<{
    year: number;
    date: Date;
    netWorth: number;
    progress: number;
  }> = [];

  const percentages = [0, 25, 50, 75, 100];
  const labels = [
    'Byrjun',
    '25% á leiðinni',
    'Hálfnað',
    '75% á leiðinni',
    'FIRE náð!',
  ];

  // Calculate milestones
  percentages.forEach((percentage, index) => {
    const amount = (calculation.fiNumber * percentage) / 100;
    const isReached = calculation.currentProgress >= percentage;

    let date: Date | null = null;
    let yearsFromNow: number | null = null;

    if (percentage === 0) {
      // Starting point (now)
      date = new Date();
      yearsFromNow = 0;
    } else if (isReached) {
      // Already reached (approximate past date)
      date = new Date(); // Could calculate backwards if desired
      yearsFromNow = 0;
    } else if (calculation.yearsToFI !== null) {
      // Calculate when this milestone will be reached
      // Simplified: linear interpolation based on progress
      const remainingProgress = percentage - calculation.currentProgress;
      const totalProgress = 100 - calculation.currentProgress;
      const ratioRemaining = remainingProgress / totalProgress;
      yearsFromNow = calculation.yearsToFI * ratioRemaining;
      date = new Date(
        new Date().getFullYear() + yearsFromNow,
        new Date().getMonth(),
        new Date().getDate()
      );
    }

    milestones.push({
      percentage,
      amount,
      date,
      yearsFromNow,
      label: labels[index],
      isReached,
    });
  });

  // Generate projected path (yearly snapshots for next 30 years or until FI)
  const maxYears = calculation.yearsToFI
    ? Math.min(Math.ceil(calculation.yearsToFI) + 2, 30)
    : 30;

  for (let year = 0; year <= maxYears; year++) {
    const yearDate = new Date(
      new Date().getFullYear() + year,
      new Date().getMonth(),
      new Date().getDate()
    );

    // Simple compound growth projection
    // This is approximate; actual path may vary with contributions
    let projectedNetWorth: number;
    if (year === 0) {
      projectedNetWorth = calculation.currentProgress * calculation.fiNumber / 100;
    } else {
      // Rough approximation using linear growth
      if (calculation.yearsToFI !== null && calculation.yearsToFI > 0) {
        const yearProgress = Math.min(100, calculation.currentProgress + (year / calculation.yearsToFI) * (100 - calculation.currentProgress));
        projectedNetWorth = (yearProgress / 100) * calculation.fiNumber;
      } else {
        projectedNetWorth = calculation.currentProgress * calculation.fiNumber / 100;
      }
    }

    const progress = Math.min(
      100,
      (projectedNetWorth / calculation.fiNumber) * 100
    );

    projectedPath.push({
      year,
      date: yearDate,
      netWorth: projectedNetWorth,
      progress,
    });

    // Stop if FI reached
    if (progress >= 100) {
      break;
    }
  }

  return {
    fireTypeId: calculation.fireTypeId,
    fiNumber: calculation.fiNumber,
    currentNetWorth: (calculation.currentProgress / 100) * calculation.fiNumber,
    milestones,
    projectedPath,
  };
};

// ============================================================================
// HELPER FUNCTIONS FOR RECOMMENDATIONS
// ============================================================================

/**
 * Generate action steps for a FIRE type
 *
 * Provides specific, actionable steps to pursue this FIRE path.
 *
 * @param calculation - FIRE calculation result
 * @returns Array of action steps in Icelandic
 */
export const generateActionSteps = (
  calculation: FIRECalculation
): string[] => {
  const steps: string[] = [];
  const typeId = calculation.fireTypeId;

  // Common steps for all types
  if (calculation.yearsToFI !== null) {
    steps.push(
      `Settu að markmiði að spara ${Math.round(calculation.amountRemaining / (calculation.yearsToFI * 12) / 1000)}þ kr á mánuði`
    );
  }

  // Type-specific steps
  switch (typeId) {
    case 'leanfire':
      steps.push('Farðu yfir útgjöld og finndu möguleika á að draga úr');
      steps.push('Íhugaðu minimalíska lífsstíl og sparnaðaráætlun');
      steps.push('Veldu ódýran búseta (minna húsnæði eða landsbyggð)');
      break;

    case 'regularfire':
      steps.push('Haltu núverandi lífsstíl en hækkaðu sparnaðarhlutfall');
      steps.push('Fjárfestu í víðtækum vísitölusjóðum');
      steps.push('Hafðu neysluna stöðuga á meðan tekjur hækka');
      break;

    case 'coastfire':
      if (calculation.coastData?.isCoasting) {
        steps.push('Þú ert þegar í coast mode - hættu að spara ef þú vilt');
        steps.push('Vinnudu bara fyrir núverandi útgjöld');
        steps.push('Íhugaðu að skipta um starf eða minnka vinnustundir');
      } else {
        steps.push(
          `Sparaðu hart næstu ${Math.round(calculation.coastData?.yearsUntilCoast || 0)} árin`
        );
        steps.push('Þegar þú nærð coast FI númerinu getur þú slakað á');
        steps.push('Eftir það þarf ekki að spara - láta bara peningana vaxa');
      }
      break;

    case 'baristafire':
      steps.push('Sparaðu fyrir minni egg en full FIRE');
      steps.push('Skipulagðu hvernig þú vinnur hlutastarf eftir að hætta');
      steps.push('Finndu launamöguleika sem eru sveigjanlegir og skemmtilegir');
      if (calculation.baristaData?.hoursPerWeekNeeded) {
        steps.push(
          `Áætlaðu ${Math.round(calculation.baristaData.hoursPerWeekNeeded)} klukkustundir á viku í hlutastarfi`
        );
      }
      break;

    case 'fatfire':
      steps.push('Einbeittu þér að hátekjum og starfsframa');
      steps.push('Hækkaðu bæði tekjur og sparnaðarhlutfall');
      steps.push('Fjárfestu árásargjarnt en með áhættudreifingu');
      steps.push('Hafðu í huga að þetta tekur lengri tíma');
      break;
  }

  // Add investment step if not already FI
  if (
    calculation.currentProgress < 100 &&
    !steps.some((s) => s.includes('Fjárfestu'))
  ) {
    steps.push('Fjárfestu sparnað í verðbréfasjóðum með lágu gjaldi');
  }

  return steps.slice(0, 5); // Max 5 steps
};

/**
 * Generate timeline string summary
 *
 * Creates a human-readable timeline summary in Icelandic.
 *
 * @param calculation - FIRE calculation result
 * @returns Timeline summary string
 */
export const generateTimelineString = (
  calculation: FIRECalculation
): string => {
  if (calculation.currentProgress >= 100) {
    return 'Þú ert þegar búin/n að ná FIRE!';
  }

  if (calculation.yearsToFI === null) {
    return 'Ekki hægt að ná með núverandi sparnaði';
  }

  const years = Math.floor(calculation.yearsToFI);
  const months = Math.round((calculation.yearsToFI - years) * 12);

  if (calculation.targetAge) {
    if (years === 0) {
      return `${months} mánuðir (aldur ${Math.round(calculation.targetAge)})`;
    } else if (months === 0) {
      return `${years} ár (aldur ${Math.round(calculation.targetAge)})`;
    } else {
      return `${years} ár og ${months} mánuðir (aldur ${Math.round(calculation.targetAge)})`;
    }
  }

  if (years === 0) {
    return `${months} mánuðir`;
  } else if (months === 0) {
    return `${years} ár`;
  } else {
    return `${years} ár og ${months} mánuðir`;
  }
};

/**
 * Generate obstacles/warnings for a FIRE type
 *
 * Identifies potential challenges and obstacles for pursuing this path.
 *
 * @param calculation - FIRE calculation result
 * @param inputs - User financial inputs
 * @returns Array of obstacle descriptions in Icelandic
 */
export const generateObstacles = (
  calculation: FIRECalculation,
  inputs: UserFinancialInputs
): string[] => {
  const obstacles: string[] = [];

  // High savings rate required
  const requiredMonthlySavings =
    calculation.yearsToFI !== null
      ? calculation.amountRemaining / (calculation.yearsToFI * 12)
      : null;

  if (requiredMonthlySavings && inputs.annualIncome > 0) {
    const requiredRate =
      (requiredMonthlySavings * 12 * 100) / inputs.annualIncome;
    if (requiredRate > 50) {
      obstacles.push('Krefst mjög hátt sparnaðarhlutfall (yfir 50%)');
    }
  }

  // Long timeline
  if (calculation.yearsToFI !== null && calculation.yearsToFI > 20) {
    obstacles.push('Langtímamarkmið - krefst mikils þrautseigju');
  }

  // Late retirement age
  if (calculation.targetAge && calculation.targetAge > 65) {
    obstacles.push('Seint á efri árum - kannski nær þú eðlilegum eftirlaunaaldri áður');
  }

  // Type-specific obstacles
  switch (calculation.fireTypeId) {
    case 'leanfire':
      if (calculation.monthlyExpenses < 300_000) {
        // Already lean, no obstacle
      } else {
        obstacles.push(
          'Krefst þess að lifa af mjög litlum útgjöldum (undir 300þ/mán)'
        );
      }
      obstacles.push('Lítill svigrúm fyrir óvæntum útgjöldum');
      break;

    case 'coastfire':
      if (!calculation.coastData?.isCoasting) {
        obstacles.push('Þarft að vinna alla lífið fyrir núverandi útgjöld');
        obstacles.push('Engin raunveruleg "eftirlaun" - bara minni sparnaðarþörf');
      }
      break;

    case 'baristafire':
      obstacles.push('Þarft að finna og halda hlutastarfi á eftirlaunaárum');
      obstacles.push('Óvissa um heilsu og vinnugetu síðar í lífinu');
      break;

    case 'fatfire':
      if (calculation.yearsToFI !== null && calculation.yearsToFI > 25) {
        obstacles.push('Tekur mjög langan tíma (yfir 25 ár)');
      }
      obstacles.push('Krefst mjög háar tekjur og mikils sparnaðar');
      break;
  }

  // Current progress obstacles
  if (calculation.currentProgress < 10) {
    obstacles.push('Þarft að byrja frá grunni - engin núverandi eignir');
  }

  return obstacles.slice(0, 4); // Max 4 obstacles
};
