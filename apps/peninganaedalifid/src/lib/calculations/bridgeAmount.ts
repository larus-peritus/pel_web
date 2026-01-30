/**
 * Bridge Amount Calculations for Iceland FIRE Planning
 *
 * Calculates the savings needed to bridge early retirement to pension age,
 * accounting for Iceland's three-pillar pension system.
 *
 * Three Phases:
 * - Phase 1: Early retirement → Age 60 (personal savings only)
 * - Phase 2: Age 60 → Age 67 (séreign available, doesn't affect TR!)
 * - Phase 3: Age 67+ (occupational pension + TR pension)
 */

import {
  ICELAND_PENSION_AGES,
  TR_MEANS_TEST,
  SEREIGN_PENSION,
  OCCUPATIONAL_PENSION,
} from '@/lib/constants/fiNumber';

/**
 * Input parameters for bridge amount calculation
 */
export interface BridgeAmountInput {
  /** Target early retirement age */
  retirementAge: number;
  /** Monthly expenses in retirement (ISK) */
  monthlyExpenses: number;
  /** FI multiplier for Phase 3 (default 30x) */
  multiplier: number;
  /** Expected séreign balance at age 60 (ISK) */
  sereignBalanceAt60: number;
  /** Expected monthly occupational pension at 67 (ISK) */
  occupationalPensionMonthly: number;
  /** Whether person is single (affects TR max) */
  isSingle?: boolean;
  /** Expected real return rate for Phase 3 FI calculation */
  expectedReturn?: number;
}

/**
 * Phase calculation result
 */
export interface PhaseResult {
  /** Phase number (1, 2, or 3) */
  phase: 1 | 2 | 3;
  /** Start age of this phase */
  startAge: number;
  /** End age of this phase (null for Phase 3 = lifelong) */
  endAge: number | null;
  /** Duration in years */
  years: number;
  /** Total expenses during this phase */
  totalExpenses: number;
  /** Income/coverage available during this phase */
  coverage: number;
  /** Gap that needs to be funded from savings */
  gap: number;
  /** Description of funding source */
  fundingSource: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Complete bridge amount calculation result
 */
export interface BridgeAmountResult {
  /** Phase 1: Early retirement to age 60 */
  phase1: PhaseResult;
  /** Phase 2: Age 60 to 67 (séreign available) */
  phase2: PhaseResult;
  /** Phase 3: Age 67+ (pensions available) */
  phase3: PhaseResult & {
    /** Monthly TR pension expected */
    trPensionMonthly: number;
    /** Monthly occupational pension */
    occupationalPensionMonthly: number;
    /** Total monthly pension income */
    totalPensionMonthly: number;
    /** Monthly gap after pensions */
    monthlyGap: number;
    /** FI number needed to cover gap */
    fiNumberForGap: number;
  };
  /** Summary totals */
  totals: {
    /** Total personal savings needed across all phases */
    totalPersonalSavingsNeeded: number;
    /** What traditional FI would be (without pension consideration) */
    traditionalFINumber: number;
    /** Savings from using Iceland pension system */
    savingsFromPensions: number;
    /** Percentage reduction from traditional FI */
    savingsPercentage: number;
  };
  /** Input parameters used */
  inputs: BridgeAmountInput;
}

/**
 * Calculate TR pension based on other income (means-testing)
 *
 * Important: Séreign withdrawals do NOT count against TR!
 */
export function calculateTRPension(
  otherMonthlyIncome: number,
  isSingle: boolean = true
): number {
  const maxTR = isSingle
    ? TR_MEANS_TEST.MAX_MONTHLY_SINGLE
    : TR_MEANS_TEST.MAX_MONTHLY_COUPLE;

  // If no other income or below exemption, get full TR
  if (otherMonthlyIncome <= TR_MEANS_TEST.INCOME_EXEMPTION) {
    return maxTR;
  }

  // Calculate reduction (45% of income above exemption)
  const incomeAboveExemption = otherMonthlyIncome - TR_MEANS_TEST.INCOME_EXEMPTION;
  const reduction = incomeAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;
  const trPension = Math.max(0, maxTR - reduction);

  return Math.round(trPension);
}

/**
 * Calculate TR pension with detailed breakdown
 */
export function calculateTRPensionDetailed(
  otherMonthlyIncome: number,
  isSingle: boolean = true
): {
  trPension: number;
  maxTR: number;
  incomeAboveExemption: number;
  reductionAmount: number;
  percentageOfMax: number;
} {
  const maxTR = isSingle
    ? TR_MEANS_TEST.MAX_MONTHLY_SINGLE
    : TR_MEANS_TEST.MAX_MONTHLY_COUPLE;

  if (otherMonthlyIncome <= TR_MEANS_TEST.INCOME_EXEMPTION) {
    return {
      trPension: maxTR,
      maxTR,
      incomeAboveExemption: 0,
      reductionAmount: 0,
      percentageOfMax: 100,
    };
  }

  const incomeAboveExemption = otherMonthlyIncome - TR_MEANS_TEST.INCOME_EXEMPTION;
  const reductionAmount = incomeAboveExemption * TR_MEANS_TEST.REDUCTION_RATE;
  const trPension = Math.max(0, maxTR - reductionAmount);

  return {
    trPension: Math.round(trPension),
    maxTR,
    incomeAboveExemption: Math.round(incomeAboveExemption),
    reductionAmount: Math.round(reductionAmount),
    percentageOfMax: maxTR > 0 ? Math.round((trPension / maxTR) * 100) : 0,
  };
}

/**
 * Estimate occupational pension based on contribution years and salary
 *
 * Based on Iceland law: 40 years = 56% replacement rate
 */
export function estimateOccupationalPension(
  yearsContributed: number,
  averageMonthlySalary: number
): number {
  // Pro-rate the replacement rate based on years (40 years = 56%)
  const effectiveYears = Math.min(yearsContributed, OCCUPATIONAL_PENSION.FULL_BENEFIT_YEARS);
  const replacementRate =
    (effectiveYears / OCCUPATIONAL_PENSION.FULL_BENEFIT_YEARS) *
    OCCUPATIONAL_PENSION.TARGET_REPLACEMENT_RATE;

  return Math.round(averageMonthlySalary * replacementRate);
}

/**
 * Calculate early withdrawal reduction for occupational pension
 *
 * Starting pension before 67 permanently reduces monthly payments
 */
export function calculateEarlyWithdrawalReduction(
  fullPensionAt67: number,
  withdrawalAge: number
): {
  reducedMonthlyPension: number;
  reductionPercentage: number;
  yearsEarly: number;
} {
  const standardAge = ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE;
  const yearsEarly = Math.max(0, standardAge - withdrawalAge);

  // Typical reduction is about 6-7% per year early (varies by fund)
  // Using 6.5% as average
  const reductionPerYear = 0.065;
  const totalReduction = Math.min(yearsEarly * reductionPerYear, 0.45); // Cap at 45%

  const reducedPension = fullPensionAt67 * (1 - totalReduction);

  return {
    reducedMonthlyPension: Math.round(reducedPension),
    reductionPercentage: Math.round(totalReduction * 100),
    yearsEarly,
  };
}

/**
 * Project séreign balance at age 60
 */
export function projectSereignBalance(
  currentBalance: number,
  currentAge: number,
  monthlyContribution: number,
  annualReturnRate: number = 0.06
): number {
  const yearsToAge60 = Math.max(0, SEREIGN_PENSION.ACCESS_AGE - currentAge);

  if (yearsToAge60 <= 0) {
    return currentBalance;
  }

  // Monthly return rate
  const monthlyReturn = annualReturnRate / 12;
  const months = yearsToAge60 * 12;

  // Future value of current balance
  const fvBalance = currentBalance * Math.pow(1 + annualReturnRate, yearsToAge60);

  // Future value of monthly contributions (annuity)
  const fvContributions =
    monthlyContribution * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);

  return Math.round(fvBalance + fvContributions);
}

/**
 * Calculate bridge amounts for all three phases
 */
export function calculateBridgeAmounts(input: BridgeAmountInput): BridgeAmountResult {
  const {
    retirementAge,
    monthlyExpenses,
    multiplier,
    sereignBalanceAt60,
    occupationalPensionMonthly,
    isSingle = true,
  } = input;

  const annualExpenses = monthlyExpenses * 12;

  // === PHASE 1: Early retirement to age 60 ===
  const phase1StartAge = retirementAge;
  const phase1EndAge = ICELAND_PENSION_AGES.SEREIGN_ACCESS_AGE;
  const phase1Years = Math.max(0, phase1EndAge - phase1StartAge);
  const phase1TotalExpenses = phase1Years * annualExpenses;

  const phase1: PhaseResult = {
    phase: 1,
    startAge: phase1StartAge,
    endAge: phase1EndAge,
    years: phase1Years,
    totalExpenses: phase1TotalExpenses,
    coverage: 0, // No pension income available
    gap: phase1TotalExpenses,
    fundingSource: 'Persónulegur sparnaður eingöngu',
    notes:
      phase1Years > 0
        ? 'Enginn lífeyrir tiltækur - þarf að nota persónulegan sparnað'
        : 'Engin brú þarf - starfslok við 60+',
  };

  // === PHASE 2: Age 60 to 67 (séreign available) ===
  const phase2StartAge = ICELAND_PENSION_AGES.SEREIGN_ACCESS_AGE;
  const phase2EndAge = ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE;
  const phase2Years = phase2EndAge - phase2StartAge; // Always 7 years
  const phase2TotalExpenses = phase2Years * annualExpenses;

  // Séreign can cover part of Phase 2
  const sereignCoverage = Math.min(sereignBalanceAt60, phase2TotalExpenses);
  const phase2Gap = Math.max(0, phase2TotalExpenses - sereignCoverage);

  const phase2: PhaseResult = {
    phase: 2,
    startAge: phase2StartAge,
    endAge: phase2EndAge,
    years: phase2Years,
    totalExpenses: phase2TotalExpenses,
    coverage: sereignCoverage,
    gap: phase2Gap,
    fundingSource: 'Séreign (hefur EKKI áhrif á TR réttindi!)',
    notes:
      sereignCoverage >= phase2TotalExpenses
        ? 'Séreign dekkar allan kostnað á þessu tímabili!'
        : `Séreign dekkar ${Math.round((sereignCoverage / phase2TotalExpenses) * 100)}% af kostnaði`,
  };

  // === PHASE 3: Age 67+ (pensions available) ===
  // TR is means-tested based on occupational pension (NOT séreign!)
  const trPensionMonthly = calculateTRPension(occupationalPensionMonthly, isSingle);
  const totalPensionMonthly = occupationalPensionMonthly + trPensionMonthly;
  const monthlyGap = Math.max(0, monthlyExpenses - totalPensionMonthly);
  const annualGap = monthlyGap * 12;

  // FI number needed to cover the gap (using multiplier)
  const fiNumberForGap = annualGap * multiplier;

  const phase3: BridgeAmountResult['phase3'] = {
    phase: 3,
    startAge: ICELAND_PENSION_AGES.OCCUPATIONAL_STANDARD_AGE,
    endAge: null,
    years: 0, // Lifelong
    totalExpenses: 0, // Ongoing
    coverage: totalPensionMonthly * 12,
    gap: fiNumberForGap,
    fundingSource: 'Lífeyrissjóður + TR lífeyrir',
    trPensionMonthly,
    occupationalPensionMonthly,
    totalPensionMonthly,
    monthlyGap,
    fiNumberForGap,
    notes:
      monthlyGap === 0
        ? 'Lífeyrir dekkar öll útgjöld - engin FI-tala þarf!'
        : `Þarf ${Math.round(fiNumberForGap).toLocaleString('is-IS')} kr til að dekka bil`,
  };

  // === TOTALS ===
  const totalPersonalSavingsNeeded = phase1.gap + phase2.gap + phase3.fiNumberForGap;
  const traditionalFINumber = annualExpenses * multiplier;
  const savingsFromPensions = traditionalFINumber - totalPersonalSavingsNeeded;
  const savingsPercentage =
    traditionalFINumber > 0
      ? Math.round((savingsFromPensions / traditionalFINumber) * 100)
      : 0;

  return {
    phase1,
    phase2,
    phase3,
    totals: {
      totalPersonalSavingsNeeded,
      traditionalFINumber,
      savingsFromPensions,
      savingsPercentage,
    },
    inputs: input,
  };
}

/**
 * Calculate optimal séreign withdrawal schedule for Phase 2
 *
 * Determines how much to withdraw monthly from séreign to last exactly 7 years
 */
export function calculateOptimalSereignWithdrawal(
  sereignBalance: number,
  monthlyExpenses: number,
  expectedReturn: number = 0.04
): {
  monthlyWithdrawal: number;
  coversFullExpenses: boolean;
  monthsCovered: number;
  shortfall: number;
} {
  const months = 7 * 12; // 60-67 is 7 years = 84 months
  const monthlyReturn = expectedReturn / 12;

  // Calculate PMT that depletes balance over 84 months with returns
  // Using annuity formula: PMT = PV * (r * (1+r)^n) / ((1+r)^n - 1)
  const factor = (monthlyReturn * Math.pow(1 + monthlyReturn, months)) /
    (Math.pow(1 + monthlyReturn, months) - 1);
  const monthlyWithdrawal = Math.round(sereignBalance * factor);

  const coversFullExpenses = monthlyWithdrawal >= monthlyExpenses;
  const monthsCovered = coversFullExpenses
    ? months
    : Math.floor(sereignBalance / monthlyExpenses);
  const shortfall = coversFullExpenses ? 0 : monthlyExpenses - monthlyWithdrawal;

  return {
    monthlyWithdrawal,
    coversFullExpenses,
    monthsCovered,
    shortfall,
  };
}

/**
 * Generate a withdrawal timeline showing income sources by age
 */
export function generateWithdrawalTimeline(
  result: BridgeAmountResult,
  currentAge: number
): Array<{
  age: number;
  phase: 1 | 2 | 3;
  incomeSources: string[];
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyGap: number;
  fundingSource: string;
}> {
  const timeline: Array<{
    age: number;
    phase: 1 | 2 | 3;
    incomeSources: string[];
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyGap: number;
    fundingSource: string;
  }> = [];

  const { inputs, phase2, phase3 } = result;
  const retirementAge = inputs.retirementAge;
  const monthlyExpenses = inputs.monthlyExpenses;

  // Generate for each year from retirement to 75
  for (let age = retirementAge; age <= 75; age++) {
    let phase: 1 | 2 | 3;
    let incomeSources: string[] = [];
    let monthlyIncome = 0;
    let fundingSource: string;

    if (age < 60) {
      // Phase 1
      phase = 1;
      incomeSources = ['Persónulegur sparnaður'];
      monthlyIncome = 0;
      fundingSource = 'Persónulegur sparnaður';
    } else if (age < 67) {
      // Phase 2
      phase = 2;
      incomeSources = ['Séreign'];
      // Calculate monthly séreign withdrawal
      const sereignMonthly = phase2.coverage / (7 * 12);
      monthlyIncome = sereignMonthly;
      fundingSource = 'Séreign + Sparnaður';
    } else {
      // Phase 3
      phase = 3;
      incomeSources = ['Lífeyrissjóður', 'TR lífeyrir'];
      monthlyIncome = phase3.totalPensionMonthly;
      fundingSource = monthlyIncome >= monthlyExpenses
        ? 'Lífeyrir eingöngu'
        : 'Lífeyrir + FI sparnaður';
    }

    const monthlyGap = Math.max(0, monthlyExpenses - monthlyIncome);

    timeline.push({
      age,
      phase,
      incomeSources,
      monthlyIncome: Math.round(monthlyIncome),
      monthlyExpenses,
      monthlyGap,
      fundingSource,
    });
  }

  return timeline;
}
