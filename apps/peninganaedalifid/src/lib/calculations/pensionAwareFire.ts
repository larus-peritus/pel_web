/**
 * Calculation Engine for Pension-Aware FIRE Calculator
 *
 * This module implements the core calculation logic for the Lífeyristengd FIRE Reiknivél.
 * It breaks retirement into phases based on Iceland's pension system and calculates
 * the true FI number by accounting for future pension income.
 *
 * Key Functions:
 * - calculateRetirementPhases: Main orchestrator returning all phases
 * - calculateGapPhase: Self-funded period (retirement to 60)
 * - calculateSereignBridgePhase: Private pension period (60-67)
 * - calculateFullPensionPhase: Full pension period (67+)
 * - calculatePhaseIncome: Income sources for a specific phase
 * - calculatePhaseFunding: Required funding at start of phase
 */

import type {
  PensionAwareFireState,
  RetirementPhase,
  RetirementPhaseId,
  PhaseIncomeSources,
  TREstimate,
  SavingsProjection,
  GapRecommendations,
  GoalGapAnalysis,
} from '@/types/pensionAwareFire';

import {
  ICELANDIC_PENSION_SYSTEM,
  PHASE_COLORS,
  PENSION_AWARE_DEFAULTS,
} from '@/lib/constants/pensionAwareFire';

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

/**
 * Calculate all retirement phases based on inputs
 *
 * Returns different number of phases based on retirement age:
 * - Retire before 60: 3 phases (Gap → Séreign Bridge → Full Pension)
 * - Retire 60-66: 2 phases (Séreign Bridge → Full Pension)
 * - Retire 67+: 1 phase (Full Pension only)
 *
 * Phases are chained - remaining funds from one phase feed into the next.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Array of retirement phases with calculations
 */
export function calculateRetirementPhases(
  state: PensionAwareFireState
): RetirementPhase[] {
  const phases: RetirementPhase[] = [];
  const { targetRetirementAge } = state;

  // Determine which phases apply based on retirement age
  const hasGapPhase = targetRetirementAge < ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE;
  const hasSereignBridge = targetRetirementAge < ICELANDIC_PENSION_SYSTEM.TR_START_AGE;

  // Phase 1: Gap Period (retirement to age 60) - if retiring before 60
  if (hasGapPhase) {
    const gapPhase = calculateGapPhase(state);
    phases.push(gapPhase);
  }

  // Phase 2: Séreign Bridge (60-67 or retirement-67 if retiring after 60) - if retiring before 67
  if (hasSereignBridge) {
    const bridgePhase = calculateSereignBridgePhase(state, phases);
    phases.push(bridgePhase);
  }

  // Phase 3: Full Pension (67+) - everyone has this phase
  const fullPensionPhase = calculateFullPensionPhase(state, phases);
  phases.push(fullPensionPhase);

  return phases;
}

// ============================================================================
// PHASE-SPECIFIC CALCULATORS
// ============================================================================

/**
 * Calculate the gap phase (retirement to age 60)
 *
 * This is the most challenging phase - fully self-funded from savings.
 * The user must have enough savings to cover expenses until séreign becomes accessible.
 *
 * Income sources: Savings withdrawal + investment returns only
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Gap phase with all calculations
 */
export function calculateGapPhase(state: PensionAwareFireState): RetirementPhase {
  const { targetRetirementAge, monthlyExpenses, investmentReturn } = state;

  const startAge = targetRetirementAge;
  const endAge = ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE;
  const durationYears = endAge - startAge;

  // Calculate income sources (no pension income in gap phase)
  const incomeSources = calculatePhaseIncome(
    'gap',
    state,
    0, // availableSavings determined by funding calculation
    0 // no séreign available yet
  );

  // Calculate required funding at start of this phase
  const requiredAtStart = calculatePhaseFunding(
    monthlyExpenses,
    0, // No pension income during gap
    durationYears,
    investmentReturn
  );

  // Calculate remaining at end (simplified - actual calculation would track monthly)
  // For gap phase, we assume most funds are depleted, leaving a small buffer
  const monthlyWithdrawal = monthlyExpenses;
  const totalMonths = durationYears * 12;
  const remainingAtEnd = Math.max(
    0,
    requiredAtStart - monthlyWithdrawal * totalMonths * 0.9 // 10% remains due to growth
  );

  return {
    id: 'gap',
    nameIs: 'Biðtími (sjálfsfjármagnað)',
    nameEn: 'Gap Period (Self-Funded)',
    startAge,
    endAge,
    durationYears,
    incomeSources,
    monthlyExpenses,
    requiredAtStart,
    remainingAtEnd,
    isSelfFunded: true,
    hasSurplus: false,
    surplusAmount: 0,
  };
}

/**
 * Calculate the séreign bridge phase (60-67 or retirement age to 67)
 *
 * This phase uses séreign withdrawals plus any remaining savings from gap phase.
 * Séreign balance is projected to age 60, then withdrawn evenly over the bridge period.
 *
 * Income sources: Séreign + savings withdrawal + investment returns
 *
 * @param state - Complete pension-aware FIRE state
 * @param previousPhases - Array of already calculated phases (gap phase if exists)
 * @returns Séreign bridge phase with all calculations
 */
export function calculateSereignBridgePhase(
  state: PensionAwareFireState,
  previousPhases: RetirementPhase[]
): RetirementPhase {
  const { targetRetirementAge, monthlyExpenses, investmentReturn, sereign } = state;

  // Start age is either 60 (if gap phase exists) or retirement age
  const startAge = Math.max(targetRetirementAge, ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE);
  const endAge = ICELANDIC_PENSION_SYSTEM.TR_START_AGE;
  const durationYears = endAge - startAge;

  // Get any remaining funds from gap phase
  const gapPhaseRemainder = previousPhases[0]?.remainingAtEnd || 0;

  // Project séreign balance to age 60
  const yearsUntilSereignAccess = Math.max(
    0,
    ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - state.currentAge
  );

  const projectedSereignAt60 = projectSereignGrowth(
    sereign.currentBalance,
    sereign.monthlyContribution,
    sereign.employeeContributionPercent,
    sereign.employerMatchPercent,
    yearsUntilSereignAccess,
    investmentReturn
  );

  // Calculate monthly séreign withdrawal over bridge period
  const monthlySereignWithdrawal =
    durationYears > 0 ? projectedSereignAt60 / (durationYears * 12) : 0;

  // Calculate income sources
  const incomeSources = calculatePhaseIncome(
    'sereign-bridge',
    state,
    gapPhaseRemainder,
    projectedSereignAt60
  );

  // Calculate gap to fill (expenses - séreign)
  const monthlyGap = Math.max(0, monthlyExpenses - monthlySereignWithdrawal);

  // Calculate required savings at start (in addition to séreign)
  const requiredSavingsForGap = calculatePhaseFunding(
    monthlyGap,
    0,
    durationYears,
    investmentReturn
  );

  const requiredAtStart = gapPhaseRemainder + requiredSavingsForGap;

  // Calculate if there's surplus or deficit
  const totalIncome = incomeSources.total;
  const hasSurplus = totalIncome > monthlyExpenses;
  const surplusAmount = hasSurplus ? totalIncome - monthlyExpenses : 0;

  // Estimate remaining at end (séreign depleted, some savings may remain)
  const remainingAtEnd = hasSurplus ? gapPhaseRemainder * 1.1 : 0;

  return {
    id: 'sereign-bridge',
    nameIs: 'Séreign-brú (60-67)',
    nameEn: 'Private Pension Bridge (60-67)',
    startAge,
    endAge,
    durationYears,
    incomeSources,
    monthlyExpenses,
    requiredAtStart,
    remainingAtEnd,
    isSelfFunded: false,
    hasSurplus,
    surplusAmount,
  };
}

/**
 * Calculate the full pension phase (67+)
 *
 * This phase has all pension sources active:
 * - Lífeyrissjóður (starts at user-specified age, typically 67)
 * - TR Ellilífeyrir (starts at 67, with means-testing)
 * - Any remaining séreign or savings
 *
 * Income sources: Lífeyrissjóður + TR + remaining séreign/savings + investment returns
 *
 * @param state - Complete pension-aware FIRE state
 * @param previousPhases - Array of already calculated phases
 * @returns Full pension phase with all calculations
 */
export function calculateFullPensionPhase(
  state: PensionAwareFireState,
  previousPhases: RetirementPhase[]
): RetirementPhase {
  const { targetRetirementAge, monthlyExpenses, lifeyrissjodur } = state;

  // Start age is either 67 (if previous phases exist) or retirement age
  const startAge = Math.max(targetRetirementAge, ICELANDIC_PENSION_SYSTEM.TR_START_AGE);
  const endAge = ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY;
  const durationYears = endAge - startAge;

  // Get any remaining funds from previous phases
  const previousPhaseRemainder =
    previousPhases.length > 0
      ? previousPhases[previousPhases.length - 1].remainingAtEnd
      : 0;

  // Calculate income sources (includes all pensions)
  const incomeSources = calculatePhaseIncome(
    'full-pension',
    state,
    previousPhaseRemainder,
    0 // Séreign already accounted for in bridge phase
  );

  // Calculate TR with means-testing
  const trMonthly = calculateTRWithMeansTesting(
    lifeyrissjodur.expectedMonthlyAmount,
    state.tr.expectFullTR,
    state.tr.manualOverrideAmount
  );

  // Update income sources with calculated TR
  incomeSources.tr = trMonthly;
  incomeSources.lifeyrissjodur = lifeyrissjodur.expectedMonthlyAmount;
  incomeSources.total =
    incomeSources.savingsWithdrawal +
    incomeSources.investmentReturns +
    incomeSources.lifeyrissjodur +
    incomeSources.tr;

  // Check if pension income covers expenses
  const pensionIncome = lifeyrissjodur.expectedMonthlyAmount + trMonthly;
  const hasSurplus = pensionIncome >= monthlyExpenses;
  const surplusAmount = Math.max(0, pensionIncome - monthlyExpenses);

  // Required at start (usually minimal or zero if pensions cover expenses)
  const monthlyGap = Math.max(0, monthlyExpenses - pensionIncome);
  const requiredAtStart =
    monthlyGap > 0
      ? calculatePhaseFunding(monthlyGap, 0, durationYears, state.investmentReturn)
      : 0;

  // Estimate remaining at end (if surplus, savings grow significantly)
  const remainingAtEnd = hasSurplus
    ? previousPhaseRemainder + surplusAmount * 12 * durationYears * 0.5
    : 0;

  return {
    id: 'full-pension',
    nameIs: 'Full lífeyrir (67+)',
    nameEn: 'Full Pension (67+)',
    startAge,
    endAge,
    durationYears,
    incomeSources,
    monthlyExpenses,
    requiredAtStart,
    remainingAtEnd,
    isSelfFunded: false,
    hasSurplus,
    surplusAmount,
  };
}

// ============================================================================
// INCOME & FUNDING CALCULATIONS
// ============================================================================

/**
 * Calculate income sources for a retirement phase
 *
 * Different phases have different income sources:
 * - Gap: Savings + investment returns only
 * - Séreign Bridge: Séreign + savings + investment returns
 * - Full Pension: Lífeyrissjóður + TR + savings + investment returns
 *
 * @param phase - Which phase to calculate for
 * @param state - Complete pension-aware FIRE state
 * @param availableSavings - Available savings at start of phase (ISK)
 * @param availableSereign - Available séreign at start of phase (ISK)
 * @returns Breakdown of all income sources for this phase
 */
export function calculatePhaseIncome(
  phase: RetirementPhaseId,
  state: PensionAwareFireState,
  availableSavings: number,
  availableSereign: number
): PhaseIncomeSources {
  const { monthlyExpenses, investmentReturn, lifeyrissjodur } = state;

  const incomeSources: PhaseIncomeSources = {
    savingsWithdrawal: 0,
    investmentReturns: 0,
    sereign: 0,
    lifeyrissjodur: 0,
    tr: 0,
    total: 0,
  };

  switch (phase) {
    case 'gap': {
      // Gap phase: Only savings and investment returns
      incomeSources.savingsWithdrawal = monthlyExpenses;
      incomeSources.investmentReturns = (availableSavings * investmentReturn) / 12;
      break;
    }

    case 'sereign-bridge': {
      // Séreign bridge: Séreign + savings + investment returns
      const bridgeDurationYears =
        ICELANDIC_PENSION_SYSTEM.TR_START_AGE -
        Math.max(state.targetRetirementAge, ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE);

      const monthlySereignWithdrawal =
        bridgeDurationYears > 0 ? availableSereign / (bridgeDurationYears * 12) : 0;

      incomeSources.sereign = monthlySereignWithdrawal;

      // Remaining gap filled by savings
      const gap = Math.max(0, monthlyExpenses - monthlySereignWithdrawal);
      incomeSources.savingsWithdrawal = gap;
      incomeSources.investmentReturns = (availableSavings * investmentReturn) / 12;
      break;
    }

    case 'full-pension': {
      // Full pension: All sources active
      incomeSources.lifeyrissjodur = lifeyrissjodur.expectedMonthlyAmount;
      incomeSources.tr = calculateTRWithMeansTesting(
        lifeyrissjodur.expectedMonthlyAmount,
        state.tr.expectFullTR,
        state.tr.manualOverrideAmount
      );

      const pensionIncome = incomeSources.lifeyrissjodur + incomeSources.tr;
      const gap = Math.max(0, monthlyExpenses - pensionIncome);

      incomeSources.savingsWithdrawal = gap;
      incomeSources.investmentReturns = gap > 0 ? (availableSavings * investmentReturn) / 12 : 0;
      break;
    }
  }

  // Calculate total
  incomeSources.total =
    incomeSources.savingsWithdrawal +
    incomeSources.investmentReturns +
    incomeSources.sereign +
    incomeSources.lifeyrissjodur +
    incomeSources.tr;

  return incomeSources;
}

/**
 * Calculate funding required at start of phase
 *
 * Uses present value of annuity formula to determine how much you need
 * at the start of a phase to cover a monthly shortfall for a given duration.
 *
 * Formula: PV = PMT × [(1 - (1 + r)^-n) / r]
 * Where:
 * - PMT = monthly payment (expenses - income)
 * - r = monthly return rate
 * - n = number of months
 *
 * @param monthlyExpenses - Monthly expenses during phase (ISK)
 * @param monthlyIncome - Monthly income during phase (ISK)
 * @param durationYears - Duration of phase in years
 * @param investmentReturn - Annual investment return rate (decimal)
 * @returns Required funding at start of phase (ISK)
 */
export function calculatePhaseFunding(
  monthlyExpenses: number,
  monthlyIncome: number,
  durationYears: number,
  investmentReturn: number
): number {
  // Edge case: no duration
  if (durationYears <= 0) {
    return 0;
  }

  const monthlyGap = monthlyExpenses - monthlyIncome;

  // Edge case: income exceeds expenses (no funding needed)
  if (monthlyGap <= 0) {
    return 0;
  }

  const monthlyRate = investmentReturn / 12;
  const numMonths = durationYears * 12;

  // Edge case: zero return rate (simple multiplication)
  if (monthlyRate === 0) {
    return Math.round(monthlyGap * numMonths);
  }

  // Present value of annuity formula
  const presentValue =
    monthlyGap * ((1 - Math.pow(1 + monthlyRate, -numMonths)) / monthlyRate);

  // @security Validate result and round to whole ISK (no decimals in ISK)
  // This prevents floating-point precision errors from accumulating
  if (!Number.isFinite(presentValue) || presentValue < 0) {
    return 0;
  }

  return Math.round(presentValue);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate employer match amount based on employee contribution and percentages
 *
 * @param monthlyContribution - Monthly employee contribution (ISK)
 * @param employeeContributionPercent - Employee contribution as % of salary (decimal, e.g., 0.04)
 * @param employerMatchPercent - Employer match as % of salary (decimal, e.g., 0.02)
 * @returns Monthly employer match amount (ISK)
 */
export function calculateEmployerMatch(
  monthlyContribution: number,
  employeeContributionPercent: number,
  employerMatchPercent: number
): number {
  // If no employee contribution or percentage, no match
  if (monthlyContribution <= 0 || employeeContributionPercent <= 0) {
    return 0;
  }

  // Calculate: employerMatch = contribution * (employerPercent / employeePercent)
  // Example: 50,000 kr * (0.02 / 0.04) = 50,000 * 0.5 = 25,000 kr
  return monthlyContribution * (employerMatchPercent / employeeContributionPercent);
}

/**
 * Project séreign growth to age 60
 *
 * Calculates future value of séreign account including:
 * - Current balance growth
 * - Monthly contributions (employee + employer match)
 * - Compound growth over time
 *
 * Formula: FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
 *
 * @param currentBalance - Current séreign balance (ISK)
 * @param monthlyContribution - Monthly employee contribution (ISK)
 * @param employeeContributionPercent - Employee contribution as % of salary (decimal)
 * @param employerMatchPercent - Employer match as % of salary (decimal)
 * @param years - Years until age 60
 * @param annualReturn - Annual return rate (decimal)
 * @returns Projected séreign balance at age 60 (ISK)
 */
export function projectSereignGrowth(
  currentBalance: number,
  monthlyContribution: number,
  employeeContributionPercent: number,
  employerMatchPercent: number,
  years: number,
  annualReturn: number
): number {
  // Edge case: already at or past age 60
  if (years <= 0) {
    return currentBalance;
  }

  const monthlyRate = annualReturn / 12;
  const numMonths = years * 12;

  // Calculate employer match based on salary percentages
  const employerMatch = calculateEmployerMatch(
    monthlyContribution,
    employeeContributionPercent,
    employerMatchPercent
  );

  // Total monthly contribution (employee + employer match)
  const totalMonthlyContribution = monthlyContribution + employerMatch;

  // Future value of current balance
  const futureValueOfBalance = currentBalance * Math.pow(1 + monthlyRate, numMonths);

  // Future value of monthly contributions (annuity)
  let futureValueOfContributions = 0;
  if (monthlyRate === 0) {
    // Edge case: no growth
    futureValueOfContributions = totalMonthlyContribution * numMonths;
  } else {
    futureValueOfContributions =
      totalMonthlyContribution * ((Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate);
  }

  return futureValueOfBalance + futureValueOfContributions;
}

/**
 * Calculate TR pension amount with means-testing
 *
 * TR (Tryggingastofnun Ellilífeyrir) is reduced based on other pension income.
 * Rules (2024):
 * - Income exemption: 36,500 ISK/month
 * - Reduction: 45% of income above exemption
 * - Maximum TR: 380,000 ISK/month (single person)
 *
 * @param lifeyrissjodurMonthly - Monthly lífeyrissjóður amount (ISK)
 * @param expectFullTR - Whether user expects full TR
 * @param manualOverride - Manual TR amount if user wants to override (ISK)
 * @returns Estimated monthly TR after means-testing (ISK)
 */
export function calculateTRWithMeansTesting(
  lifeyrissjodurMonthly: number,
  expectFullTR: boolean,
  manualOverride: number | null
): number {
  // Manual override takes precedence
  if (manualOverride !== null) {
    return Math.max(0, Math.min(manualOverride, ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE));
  }

  // If user doesn't expect TR, return 0
  if (!expectFullTR) {
    return 0;
  }

  // Calculate income above exemption
  const incomeAboveExemption = Math.max(
    0,
    lifeyrissjodurMonthly - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION
  );

  // Calculate TR reduction
  const reduction = incomeAboveExemption * ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE;

  // Calculate final TR amount
  const trAmount = Math.max(0, ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - reduction);

  return trAmount;
}

// ============================================================================
// TR MEANS-TESTING DETAILED CALCULATIONS
// ============================================================================

/**
 * Calculate income that counts against TR means-testing
 *
 * Only lífeyrissjóður income counts toward the means-testing exemption.
 * Séreign (private pension) withdrawals do NOT count against TR.
 *
 * TR Rules (2024):
 * - Income exemption: 36,500 ISK/month
 * - Only lífeyrissjóður counts; séreign does not
 * - Income above exemption triggers 45% reduction
 *
 * @param lifeyrissjodurMonthly - Monthly lífeyrissjóður amount (ISK)
 * @returns Amount above exemption threshold (ISK, 0 if below)
 */
export function calculateIncomeAboveExemption(lifeyrissjodurMonthly: number): number {
  return Math.max(0, lifeyrissjodurMonthly - ICELANDIC_PENSION_SYSTEM.TR_INCOME_EXEMPTION);
}

/**
 * Calculate TR reduction amount based on income above exemption
 *
 * TR is reduced by 45% of income above the exemption threshold.
 *
 * @param incomeAboveExemption - Income above exemption (ISK)
 * @returns TR reduction amount (ISK)
 */
export function calculateTRReduction(incomeAboveExemption: number): number {
  return incomeAboveExemption * ICELANDIC_PENSION_SYSTEM.TR_REDUCTION_RATE;
}

/**
 * Full TR means-testing calculation with detailed breakdown
 *
 * Returns complete TR estimate including whether user gets full or zero TR,
 * percentage reduction, and income above exemption.
 *
 * This is the main public API for TR calculation. It provides all the details
 * needed for UI display and educational purposes.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Detailed TR estimate with breakdown
 */
export function calculateTREstimate(state: PensionAwareFireState): TREstimate {
  const { lifeyrissjodur, tr } = state;
  const lifeyrissjodurMonthly = lifeyrissjodur.expectedMonthlyAmount;

  // Handle manual override
  if (tr.manualOverrideAmount !== null) {
    const overrideAmount = Math.max(
      0,
      Math.min(tr.manualOverrideAmount, ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE)
    );

    return {
      estimatedMonthly: overrideAmount,
      reductionPercent: ((ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - overrideAmount) / ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE) * 100,
      incomeAboveExemption: 0, // Not applicable for manual override
      isFullTR: overrideAmount === ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE,
      isZeroTR: overrideAmount === 0,
    };
  }

  // If user doesn't expect TR
  if (!tr.expectFullTR) {
    return {
      estimatedMonthly: 0,
      reductionPercent: 100,
      incomeAboveExemption: 0,
      isFullTR: false,
      isZeroTR: true,
    };
  }

  // Calculate income above exemption
  const incomeAboveExemption = calculateIncomeAboveExemption(lifeyrissjodurMonthly);

  // Calculate TR reduction
  const reduction = calculateTRReduction(incomeAboveExemption);

  // Calculate final TR amount
  const estimatedMonthly = Math.max(0, ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE - reduction);

  // Calculate reduction percentage
  const reductionPercent = (reduction / ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE) * 100;

  // Determine flags
  const isFullTR = estimatedMonthly === ICELANDIC_PENSION_SYSTEM.TR_MAX_SINGLE;
  const isZeroTR = estimatedMonthly === 0;

  return {
    estimatedMonthly,
    reductionPercent,
    incomeAboveExemption,
    isFullTR,
    isZeroTR,
  };
}

// ============================================================================
// SÉREIGN PROJECTION FUNCTIONS
// ============================================================================

/**
 * Calculate full séreign projection with detailed breakdown
 *
 * This function provides complete séreign planning information:
 * - Current balance and contribution details
 * - Years remaining until age 60 (when séreign becomes accessible)
 * - Projected balance at age 60 (with compound growth and employer match)
 * - Recommended monthly withdrawal for 60-67 bridge period
 * - Estimated remaining balance at age 67
 *
 * The projection assumes:
 * - Continuous contributions until retirement or age 60 (whichever comes first)
 * - Employer match applies to all contributions
 * - Even withdrawal strategy from 60-67 (default approach)
 * - Continued investment growth during withdrawal period
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Complete séreign projection with all details
 */
export function calculateProjectedSereign(
  state: PensionAwareFireState
): import('@/types/pensionAwareFire').SereignProjection {
  const { currentAge, targetRetirementAge, sereign, investmentReturn } = state;

  // Determine contribution period (stop at retirement or age 60, whichever comes first)
  const contributionEndAge = Math.min(targetRetirementAge, ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE);
  const yearsOfContributions = Math.max(0, contributionEndAge - currentAge);

  // Project balance at age 60 (or current balance if already past 60)
  const yearsToAge60 = Math.max(0, ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - currentAge);

  let projectedBalanceAt60: number;

  if (currentAge >= ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE) {
    // Already at or past 60 - use current balance
    projectedBalanceAt60 = sereign.currentBalance;
  } else if (targetRetirementAge <= ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE) {
    // Retire before 60 - contributions stop at retirement, then just growth
    const balanceAtRetirement = projectSereignGrowth(
      sereign.currentBalance,
      sereign.monthlyContribution,
      sereign.employeeContributionPercent,
      sereign.employerMatchPercent,
      yearsOfContributions,
      investmentReturn
    );

    // Additional years of pure growth (no contributions) until 60
    const yearsOfGrowthOnly = ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - targetRetirementAge;
    const monthlyRate = investmentReturn / 12;
    const growthMonths = yearsOfGrowthOnly * 12;
    projectedBalanceAt60 = balanceAtRetirement * Math.pow(1 + monthlyRate, growthMonths);
  } else {
    // Retire at or after 60 - contributions continue until 60
    projectedBalanceAt60 = projectSereignGrowth(
      sereign.currentBalance,
      sereign.monthlyContribution,
      sereign.employeeContributionPercent,
      sereign.employerMatchPercent,
      yearsToAge60,
      investmentReturn
    );
  }

  // Calculate withdrawal strategy for 60-67 bridge period
  // Check if lífeyrissjóður starts during the bridge period
  const lifeyrissjodurDuringBridge =
    state.lifeyrissjodur.startAge >= ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE &&
    state.lifeyrissjodur.startAge < ICELANDIC_PENSION_SYSTEM.TR_START_AGE
      ? state.lifeyrissjodur.expectedMonthlyAmount
      : 0;

  const withdrawalInfo = calculateSereignWithdrawal60to67(
    projectedBalanceAt60,
    state.monthlyExpenses,
    lifeyrissjodurDuringBridge,
    investmentReturn
  );

  return {
    balanceAt60: projectedBalanceAt60,
    monthlyWithdrawal60to67: withdrawalInfo.monthlyWithdrawal,
  };
}

/**
 * Calculate optimal séreign withdrawal strategy for 60-67 bridge period
 *
 * This function determines how to withdraw from séreign during the critical
 * 60-67 bridge period (before TR and full lífeyrissjóður kick in).
 *
 * Strategy:
 * - Calculate monthly shortfall (expenses - other income)
 * - Withdraw evenly over 7-year bridge period
 * - Account for continued investment growth during withdrawals
 * - Ensure withdrawals don't deplete the account too quickly
 *
 * The calculation uses a simplified approach assuming:
 * - Even monthly withdrawals (easier to plan and understand)
 * - Remaining balance continues to grow at investment return rate
 * - Other income (if any) reduces the withdrawal need
 *
 * @param balanceAt60 - Projected séreign balance at age 60 (ISK)
 * @param monthlyExpenses - Monthly living expenses (ISK)
 * @param otherMonthlyIncome - Other monthly income during 60-67 (e.g., early lífeyrissjóður) (ISK)
 * @param investmentReturn - Annual investment return rate (decimal)
 * @returns Withdrawal details: monthly amount, total withdrawn, remaining at 67
 */
export function calculateSereignWithdrawal60to67(
  balanceAt60: number,
  monthlyExpenses: number,
  otherMonthlyIncome: number,
  investmentReturn: number
): {
  monthlyWithdrawal: number;
  totalWithdrawn: number;
  remainingAt67: number;
} {
  // Bridge period is always 7 years (60 to 67)
  const bridgeDurationYears = ICELANDIC_PENSION_SYSTEM.TR_START_AGE - ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE;
  const bridgeMonths = bridgeDurationYears * 12;

  // Handle edge cases
  if (balanceAt60 <= 0) {
    return {
      monthlyWithdrawal: 0,
      totalWithdrawn: 0,
      remainingAt67: 0,
    };
  }

  // Calculate monthly shortfall that séreign needs to cover
  const monthlyShortfall = Math.max(0, monthlyExpenses - otherMonthlyIncome);

  // If no shortfall, no withdrawal needed
  if (monthlyShortfall === 0) {
    // Séreign continues to grow
    const monthlyRate = investmentReturn / 12;
    const remainingAt67 = balanceAt60 * Math.pow(1 + monthlyRate, bridgeMonths);
    return {
      monthlyWithdrawal: 0,
      totalWithdrawn: 0,
      remainingAt67,
    };
  }

  // Calculate sustainable monthly withdrawal using present value formula
  // We want to find PMT such that the balance lasts exactly 7 years
  // This is the inverse of the PV annuity formula: PMT = PV × [r / (1 - (1 + r)^-n)]

  const monthlyRate = investmentReturn / 12;

  let monthlyWithdrawal: number;
  let totalWithdrawn: number;
  let remainingAt67: number;

  if (monthlyRate === 0) {
    // Edge case: no growth - simple division
    monthlyWithdrawal = balanceAt60 / bridgeMonths;
    totalWithdrawn = balanceAt60;
    remainingAt67 = 0;
  } else {
    // Sustainable withdrawal rate (account lasts exactly until 67)
    monthlyWithdrawal = balanceAt60 * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -bridgeMonths)));

    // However, limit to actual shortfall (don't withdraw more than needed)
    monthlyWithdrawal = Math.min(monthlyWithdrawal, monthlyShortfall);

    // Calculate what remains after withdrawals with growth
    // Simulate month-by-month to be accurate
    let balance = balanceAt60;
    let withdrawn = 0;

    for (let month = 0; month < bridgeMonths; month++) {
      // Withdraw at start of month
      const withdrawal = Math.min(monthlyWithdrawal, balance);
      balance -= withdrawal;
      withdrawn += withdrawal;

      // Apply growth to remaining balance
      balance *= (1 + monthlyRate);
    }

    totalWithdrawn = withdrawn;
    remainingAt67 = Math.max(0, balance);
  }

  return {
    monthlyWithdrawal,
    totalWithdrawn,
    remainingAt67,
  };
}
// ============================================================================
// PRESENT VALUE CALCULATIONS
// ============================================================================

/**
 * Calculate present value of a future pension stream
 *
 * This function discounts future pension income back to today's value.
 * It's used to determine how much less you need to save today because
 * you'll have pension income in the future.
 *
 * Formula breakdown:
 * 1. Calculate PV of annuity starting at startAge: PV = PMT × [(1 - (1 + r)^-n) / r]
 * 2. Discount that PV back to today: PV_today = PV_start / (1 + r)^years_until_start
 *
 * @param monthlyAmount - Monthly pension amount (ISK)
 * @param startAge - Age when pension starts
 * @param currentAge - User's current age
 * @param endAge - Age when pension ends (typically 90)
 * @param discountRate - Annual discount rate (typically investment return rate)
 * @returns Present value of pension stream in today's ISK
 */
export function calculatePresentValueOfPension(
  monthlyAmount: number,
  startAge: number,
  currentAge: number,
  endAge: number,
  discountRate: number
): number {
  // Edge case: zero amount
  if (monthlyAmount <= 0) {
    return 0;
  }

  // Edge case: pension already started or will never start
  if (startAge <= currentAge || startAge >= endAge) {
    return 0;
  }

  // Edge case: end age is in the past or same as start
  if (endAge <= startAge) {
    return 0;
  }

  const monthlyRate = discountRate / 12;
  const yearsUntilStart = startAge - currentAge;
  const durationYears = endAge - startAge;
  const numMonths = durationYears * 12;

  // Step 1: Calculate PV of annuity at start age
  let pvAtStart: number;

  if (monthlyRate === 0) {
    // Edge case: zero discount rate (simple multiplication)
    pvAtStart = monthlyAmount * numMonths;
  } else {
    // Present value of annuity formula
    pvAtStart = monthlyAmount * ((1 - Math.pow(1 + monthlyRate, -numMonths)) / monthlyRate);
  }

  // Step 2: Discount back to today
  const annualRate = discountRate;
  const discountFactor = Math.pow(1 + annualRate, yearsUntilStart);

  const pvToday = pvAtStart / discountFactor;

  return pvToday;
}

/**
 * Calculate present value of all pension streams combined
 *
 * Returns the total value of all future pension income (lífeyrissjóður, TR, séreign)
 * discounted to today's value. This shows how much these future pensions are worth
 * in today's money.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Object with PV of each pension source and total
 */
export function calculatePresentValueOfAllPensions(
  state: PensionAwareFireState
): { lifeyrissjodur: number; tr: number; sereign: number; total: number } {
  const { currentAge, lifeyrissjodur, sereign, investmentReturn } = state;
  const endAge = ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY;

  // 1. Calculate PV of lífeyrissjóður
  const pvLifeyrissjodur = calculatePresentValueOfPension(
    lifeyrissjodur.expectedMonthlyAmount,
    lifeyrissjodur.startAge,
    currentAge,
    endAge,
    investmentReturn
  );

  // 2. Calculate PV of TR (starts at 67, with means-testing)
  const trMonthly = calculateTRWithMeansTesting(
    lifeyrissjodur.expectedMonthlyAmount,
    state.tr.expectFullTR,
    state.tr.manualOverrideAmount
  );

  const pvTR = calculatePresentValueOfPension(
    trMonthly,
    ICELANDIC_PENSION_SYSTEM.TR_START_AGE,
    currentAge,
    endAge,
    investmentReturn
  );

  // 3. Calculate PV of séreign (accessible from 60-67)
  // Séreign is a bit different - it's a lump sum that gets drawn down
  // We'll calculate it as the projected balance at 60, then discount to today
  const yearsUntilSereignAccess = Math.max(
    0,
    ICELANDIC_PENSION_SYSTEM.SEREIGN_ACCESS_AGE - currentAge
  );

  const projectedSereignAt60 = projectSereignGrowth(
    sereign.currentBalance,
    sereign.monthlyContribution,
    sereign.employeeContributionPercent,
    sereign.employerMatchPercent,
    yearsUntilSereignAccess,
    investmentReturn
  );

  // Discount séreign balance back to today
  let pvSereign: number;
  if (yearsUntilSereignAccess === 0) {
    // Already at or past age 60
    pvSereign = projectedSereignAt60;
  } else {
    const discountFactor = Math.pow(1 + investmentReturn, yearsUntilSereignAccess);
    pvSereign = projectedSereignAt60 / discountFactor;
  }

  const total = pvLifeyrissjodur + pvTR + pvSereign;

  return {
    lifeyrissjodur: pvLifeyrissjodur,
    tr: pvTR,
    sereign: pvSereign,
    total,
  };
}

/**
 * Calculate traditional FI number (25x or 30x annual expenses)
 *
 * This is the standard FIRE calculation that assumes you need a nest egg
 * large enough to support your expenses forever, with no pension income.
 *
 * Traditional FIRE ignores pension income, which leads to massive over-saving
 * in countries like Iceland with strong pension systems.
 *
 * @param monthlyExpenses - Monthly living expenses (ISK)
 * @param fiMultiplier - Multiplier (25 or 30, typically 30 for Iceland)
 * @returns Traditional FI number (ISK)
 */
export function calculateTraditionalFI(
  monthlyExpenses: number,
  fiMultiplier: number
): number {
  const annualExpenses = monthlyExpenses * 12;
  return annualExpenses * fiMultiplier;
}

/**
 * Calculate pension-adjusted FI number
 *
 * This is the TRUE amount you need to save - the pension-aware FI number.
 *
 * Key insight: You don't need 30x expenses forever. You only need enough to:
 * 1. Cover the gap period (retirement to age 60) - fully self-funded
 * 2. Cover the bridge period (60-67) - supplemented by séreign
 * 3. Cover any shortfall in full pension period (67+) - usually none!
 *
 * This is almost always MUCH less than the traditional FI number because
 * Iceland's pension system provides significant income from age 60 onwards.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Pension-adjusted FI number (ISK)
 */
export function calculatePensionAdjustedFI(state: PensionAwareFireState): number {
  const phases = calculateRetirementPhases(state);

  // The pension-adjusted FI is the sum of required funding for each phase
  // This chains correctly - each phase's "requiredAtStart" accounts for
  // what's remaining from the previous phase

  // For the first phase, we need the full requiredAtStart amount
  // For subsequent phases, the remaining funds from previous phases
  // reduce what we need to save upfront

  let totalRequired = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];

    if (i === 0) {
      // First phase: need the full amount
      totalRequired += phase.requiredAtStart;
    } else {
      // Subsequent phases: only need to cover the gap
      // (previous phase remainder is already accounted for in requiredAtStart)
      const previousPhaseRemainder = phases[i - 1].remainingAtEnd;
      const additionalNeeded = Math.max(0, phase.requiredAtStart - previousPhaseRemainder);
      totalRequired += additionalNeeded;
    }
  }

  return totalRequired;
}

/**
 * Calculate total bridge funding needs
 *
 * This is a simpler version of pension-adjusted FI that focuses specifically
 * on the bridge period - how much you need to get from retirement to when
 * pensions fully cover your expenses.
 *
 * In most cases, this equals the pension-adjusted FI number, but this function
 * makes the concept clearer: you're "bridging" from retirement to full pension.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Bridge funding amount needed (ISK)
 */
export function calculateBridgeFundingNeeds(state: PensionAwareFireState): number {
  // Bridge funding is essentially the same as pension-adjusted FI
  // It's the amount needed to bridge from retirement until pensions cover expenses
  return calculatePensionAdjustedFI(state);
}

// ============================================================================
// GOAL GAP ANALYSIS CALCULATIONS
// ============================================================================

/**
 * Project savings forward to retirement age
 *
 * Uses future value formula to calculate how much the user will have
 * at retirement based on current savings and ongoing monthly contributions.
 *
 * Formula: FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 * Where:
 * - PV = current savings (lump sum)
 * - PMT = monthly savings contribution
 * - r = monthly return rate
 * - n = number of months until retirement
 *
 * @param currentSavings - Current savings balance (ISK)
 * @param monthlySavings - Monthly savings contribution (ISK)
 * @param annualReturn - Annual investment return rate (decimal, e.g., 0.05)
 * @param yearsToRetirement - Years until retirement
 * @returns Projected savings at retirement (ISK)
 */
export function projectSavingsToRetirement(
  currentSavings: number,
  monthlySavings: number,
  annualReturn: number,
  yearsToRetirement: number
): number {
  // Edge case: already retired or past retirement
  if (yearsToRetirement <= 0) {
    return currentSavings;
  }

  const monthlyRate = annualReturn / 12;
  const months = yearsToRetirement * 12;

  // Edge case: zero return rate
  if (monthlyRate === 0) {
    return currentSavings + monthlySavings * months;
  }

  // Future value of lump sum: PV × (1 + r)^n
  const lumpSumGrowth = currentSavings * Math.pow(1 + monthlyRate, months);

  // Future value of annuity: PMT × [((1 + r)^n - 1) / r]
  const contributionGrowth =
    monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return lumpSumGrowth + contributionGrowth;
}

/**
 * Calculate expense reduction needed to close a savings gap
 *
 * If the user has a shortfall, they can reduce monthly expenses to lower
 * the amount needed for the gap phase. This function calculates how much
 * to reduce expenses by.
 *
 * Simplified approach: shortfall / (gapYears × 12) gives monthly reduction
 * This is conservative as it doesn't account for reduced compound growth needs.
 *
 * @param shortfall - Amount short of gap phase requirement (ISK)
 * @param gapYears - Duration of gap phase in years
 * @param currentExpenses - Current monthly expenses (ISK)
 * @returns Object with reduction details
 */
export function calculateExpenseReductionNeeded(
  shortfall: number,
  gapYears: number,
  currentExpenses: number
): {
  monthlyAmount: number;
  percentReduction: number;
  newMonthlyExpenses: number;
} {
  // Edge case: no gap phase or no shortfall
  if (gapYears <= 0 || shortfall <= 0) {
    return {
      monthlyAmount: 0,
      percentReduction: 0,
      newMonthlyExpenses: currentExpenses,
    };
  }

  // Simple approach: reduce expenses by shortfall / (gap months)
  const monthlyReduction = shortfall / (gapYears * 12);
  const newMonthlyExpenses = Math.max(0, currentExpenses - monthlyReduction);
  const percentReduction = currentExpenses > 0 ? (monthlyReduction / currentExpenses) * 100 : 0;

  return {
    monthlyAmount: monthlyReduction,
    percentReduction,
    newMonthlyExpenses,
  };
}

/**
 * Calculate additional monthly savings needed to close a gap
 *
 * Uses the future value of annuity formula solved for PMT to determine
 * how much more the user needs to save each month to close the shortfall.
 *
 * Formula: PMT = FV × r / ((1 + r)^n - 1)
 *
 * @param shortfall - Amount short of gap phase requirement (ISK)
 * @param annualReturn - Annual investment return rate (decimal)
 * @param yearsToRetirement - Years until retirement
 * @param currentMonthlySavings - Current monthly savings amount (ISK)
 * @returns Object with savings increase details
 */
export function calculateAdditionalSavingsNeeded(
  shortfall: number,
  annualReturn: number,
  yearsToRetirement: number,
  currentMonthlySavings: number
): {
  monthlyAmount: number;
  percentIncrease: number;
  newMonthlySavings: number;
} {
  // Edge case: no shortfall or already retired
  if (shortfall <= 0 || yearsToRetirement <= 0) {
    return {
      monthlyAmount: 0,
      percentIncrease: 0,
      newMonthlySavings: currentMonthlySavings,
    };
  }

  const monthlyRate = annualReturn / 12;
  const months = yearsToRetirement * 12;

  let additionalMonthly: number;

  if (monthlyRate === 0) {
    // Edge case: zero return - simple division
    additionalMonthly = shortfall / months;
  } else {
    // Solve for PMT: FV = PMT × [((1 + r)^n - 1) / r]
    // PMT = FV × r / ((1 + r)^n - 1)
    additionalMonthly = shortfall * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const newMonthlySavings = currentMonthlySavings + additionalMonthly;
  const percentIncrease =
    currentMonthlySavings > 0 ? (additionalMonthly / currentMonthlySavings) * 100 : 100;

  return {
    monthlyAmount: additionalMonthly,
    percentIncrease,
    newMonthlySavings,
  };
}

/**
 * Calculate complete goal gap analysis
 *
 * This is the main function that combines savings projection with
 * gap phase requirements to determine if the user is on track,
 * and provides actionable recommendations if not.
 *
 * @param state - Complete pension-aware FIRE state
 * @returns Complete goal gap analysis with projection and recommendations
 */
export function calculateGoalGapAnalysis(state: PensionAwareFireState): GoalGapAnalysis | null {
  const {
    currentAge,
    targetRetirementAge,
    currentSavings,
    monthlySavings,
    investmentReturn,
    monthlyExpenses,
  } = state;

  // Edge case: already retired
  if (currentAge >= targetRetirementAge) {
    return null;
  }

  // Edge case: negative savings (shouldn't happen but be safe)
  if (monthlySavings < 0) {
    return null;
  }

  const yearsToRetirement = targetRetirementAge - currentAge;

  // Calculate retirement phases to get gap phase requirement
  const phases = calculateRetirementPhases(state);
  const gapPhase = phases.find((p) => p.id === 'gap');

  // Determine gap phase duration and required amount
  let gapPhaseDuration = 0;
  let requiredForGapPhase = 0;

  if (gapPhase) {
    // User retires before 60 - has a self-funded gap phase
    gapPhaseDuration = gapPhase.durationYears;
    requiredForGapPhase = gapPhase.requiredAtStart;
  } else if (targetRetirementAge < ICELANDIC_PENSION_SYSTEM.TR_START_AGE) {
    // User retires between 60-67 - use séreign bridge phase requirement
    const bridgePhase = phases.find((p) => p.id === 'sereign-bridge');
    if (bridgePhase) {
      gapPhaseDuration = bridgePhase.durationYears;
      requiredForGapPhase = bridgePhase.requiredAtStart;
    }
  } else {
    // User retires at 67+ - use full pension phase requirement (usually minimal)
    const fullPensionPhase = phases.find((p) => p.id === 'full-pension');
    if (fullPensionPhase) {
      gapPhaseDuration = 0; // No gap before pensions
      requiredForGapPhase = fullPensionPhase.requiredAtStart;
    }
  }

  // Project savings to retirement
  const projectedAtRetirement = projectSavingsToRetirement(
    currentSavings,
    monthlySavings,
    investmentReturn,
    yearsToRetirement
  );

  // Compare projection to requirement
  const difference = projectedAtRetirement - requiredForGapPhase;
  const isOnTrack = difference >= 0;
  const shortfall = isOnTrack ? 0 : Math.abs(difference);
  const surplus = isOnTrack ? difference : 0;

  const projection: SavingsProjection = {
    projectedAtRetirement,
    requiredForGapPhase,
    isOnTrack,
    shortfall,
    surplus,
  };

  // Generate recommendations if there's a shortfall
  let recommendations: GapRecommendations | null = null;

  if (!isOnTrack && shortfall > 0) {
    // Calculate effective gap years for expense reduction
    // Use the gap phase duration, or estimate based on retirement to 60/67
    const effectiveGapYears = gapPhaseDuration > 0 ? gapPhaseDuration : yearsToRetirement;

    const expenseReduction = calculateExpenseReductionNeeded(
      shortfall,
      effectiveGapYears,
      monthlyExpenses
    );

    const additionalSavings = calculateAdditionalSavingsNeeded(
      shortfall,
      investmentReturn,
      yearsToRetirement,
      monthlySavings
    );

    recommendations = {
      expenseReduction,
      additionalSavings,
      lumpSum: {
        amountNeeded: shortfall,
        note: 'Þú gætir selt húsið og keypt minni íbúð til að losa um fjármagn.',
      },
    };
  }

  return {
    projection,
    recommendations,
    yearsToRetirement,
    gapPhaseDuration,
  };
}
