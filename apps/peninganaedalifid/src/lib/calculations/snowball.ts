/**
 * Interest Savings Snowball Calculator
 * Core calculation engine for comparing three scenarios:
 * 1. Base case: Extra payment only
 * 2. Snowball to loan: Interest savings reinvested in loan
 * 3. Snowball to investment: Interest savings invested
 */

import type {
  SnowballLoanInput,
  SnowballInput,
  SnowballResults,
  MonthlyRow,
  ScenarioSummary,
} from '@/types/snowball';
import {
  MAX_PROJECTION_MONTHS,
  MIN_BALANCE_THRESHOLD,
  CLOSE_CALL_THRESHOLD,
} from '@/lib/constants/snowball';

/**
 * Get the number of days in a specific month
 * Used for actual/360 day count convention (Icelandic banking standard)
 */
function getDaysInMonth(year: number, month: number): number {
  // month is 0-indexed (0 = January, 11 = December)
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculate interest using actual/360 day count convention
 * This matches Icelandic bank calculations (e.g., Islandsbanki)
 * Interest = Principal × Annual Rate × (actual days in month / 360)
 */
function calculateMonthlyInterest(
  balance: number,
  annualRate: number,
  year: number,
  month: number
): number {
  const daysInMonth = getDaysInMonth(year, month);
  return balance * annualRate * (daysInMonth / 360);
}

/**
 * Calculate base monthly payment for a loan
 *
 * Supports:
 * - Verðtryggð loans: Annuity method on real interest rate
 * - Óverðtryggð loans: Annuity or linear payment methods
 *
 * @param loan - Loan configuration
 * @returns Monthly payment amount in ISK
 *
 * Formula for annuity payment:
 * P = L * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   P = monthly payment
 *   L = original loan amount
 *   r = monthly interest rate
 *   n = number of payments
 *
 * For linear payments:
 * P = (L / n) + (remaining balance * r)
 * Where principal portion is constant, interest varies
 */
export function calculateBasePayment(loan: SnowballLoanInput): number {
  // Handle edge cases
  if (loan.loanTermMonths <= 0 || loan.originalLoanAmount <= 0) {
    return 0;
  }

  // Special case: zero interest rate
  if (loan.annualInterestRate === 0) {
    return loan.originalLoanAmount / loan.loanTermMonths;
  }

  const n = loan.loanTermMonths;
  const L = loan.originalLoanAmount;

  // For verðtryggð loans (Icelandic indexed loans):
  // - Use ONLY the real interest rate for payment calculation
  // - The payment will grow with inflation each month in the simulation
  // - This matches Islandsbanki's calculation method
  const monthlyRate = loan.annualInterestRate / 12;

  // Both verðtryggð and óverðtryggð loans can use either payment method in Iceland
  if (loan.paymentMethod === 'linear') {
    // Linear payment (jafnar afborganir): equal principal + varying interest
    // Principal portion is constant (in real terms for verðtryggð)
    const principalPayment = L / n;
    // Interest on CURRENT balance
    const interestPayment = loan.currentBalance * monthlyRate;
    return principalPayment + interestPayment;
  }

  // Default: Annuity method (jafngreiðslulán - equal total payments)
  // For verðtryggð loans, this is the REAL payment that will be inflated each month
  const factor = Math.pow(1 + monthlyRate, n);
  return L * (monthlyRate * factor) / (factor - 1);
}

/**
 * Main snowball calculation engine
 *
 * Processes three scenarios in parallel, month by month:
 * 1. Base case: Minimum payment ONLY (no extra payment)
 * 2. Snowball to loan: Minimum + extra payment, PLUS interest savings reinvested in loan
 * 3. Snowball to investment: Minimum + extra payment, interest savings invested monthly
 *
 * The "snowball effect" comes from the fact that scenarios 2 & 3 pay extra,
 * which reduces the balance faster, which reduces interest charges. This interest
 * savings is then either applied to the loan (scenario 2) or invested (scenario 3).
 *
 * Handles inflation adjustment for verðtryggð loans each month.
 * Stops when all scenarios are paid off or hits max months (600).
 *
 * @param input - Complete snowball input configuration
 * @returns Detailed results with monthly schedule and summaries
 */
export function calculateSnowball(input: SnowballInput): SnowballResults {
  const {
    loan,
    extraPayment,
    expectedInvestmentReturn,
    actualHourlyWage,
    includePostPayoffInvesting = true,  // Default to true
  } = input;

  // Calculate base monthly payment (without extra)
  const baseMonthlyPayment = calculateBasePayment(loan);

  // Initialize tracking for all three scenarios
  const monthlySchedule: MonthlyRow[] = [];

  // Reference balance: tracks hypothetical "minimum payment only" scenario
  // Used to calculate interest savings (not displayed, just for comparison)
  let referenceBalance = loan.currentBalance;

  // Scenario balances
  let baseBalance = loan.currentBalance;
  let snowballLoanBalance = loan.currentBalance;
  let snowballInvestBalance = loan.currentBalance;

  // Investment balances for ALL scenarios (post-payoff investing)
  let baseInvestmentBalance = 0;
  let snowballLoanInvestmentBalance = 0;
  let snowballInvestInvestmentBalance = 0;

  // Track when each scenario pays off (for post-payoff investment phase)
  let basePayoffMonth = 0;
  let snowballLoanPayoffMonth = 0;
  let snowballInvestPayoffMonth = 0;

  // Snowball accumulator for loan scenario
  let accumulatedSnowball = 0;

  // Calculate monthly rates (for investment return, we still use simple monthly)
  const monthlyInvestReturn = Math.pow(1 + expectedInvestmentReturn, 1 / 12) - 1;
  const monthlyInflation = loan.loanType === 'verdtryggd' && loan.inflationRate
    ? Math.pow(1 + loan.inflationRate, 1 / 12) - 1
    : 0;

  // Track current date for actual/360 day count calculation
  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth(); // 0-indexed

  // For verðtryggð loans (Islandsbanki-style):
  // - Base payment is calculated using REAL interest rate only
  // - Payment GROWS with inflation each month
  // This tracks the current inflation-adjusted payment
  let currentPayment = baseMonthlyPayment;

  let month = 0;

  // Continue until all scenarios are paid off
  while (
    (baseBalance > MIN_BALANCE_THRESHOLD ||
      snowballLoanBalance > MIN_BALANCE_THRESHOLD ||
      snowballInvestBalance > MIN_BALANCE_THRESHOLD) &&
    month < MAX_PROJECTION_MONTHS
  ) {
    month++;

    // Store opening balances
    const baseOpeningBalance = baseBalance;
    const snowballLoanOpeningBalance = snowballLoanBalance;
    const snowballInvestOpeningBalance = snowballInvestBalance;

    // Apply inflation adjustment for verðtryggð loans FIRST
    // Both balance AND payment grow with inflation (Islandsbanki-style)
    if (loan.loanType === 'verdtryggd' && monthlyInflation > 0) {
      referenceBalance = referenceBalance * (1 + monthlyInflation);
      baseBalance = baseBalance * (1 + monthlyInflation);
      snowballLoanBalance = snowballLoanBalance * (1 + monthlyInflation);
      snowballInvestBalance = snowballInvestBalance * (1 + monthlyInflation);
      // Payment also grows with inflation for verðtryggð loans
      currentPayment = currentPayment * (1 + monthlyInflation);
    }

    // === REFERENCE: Minimum payment only (for interest savings calculation) ===
    // Using actual/360 day count convention (Icelandic banking standard)
    const referenceInterest = calculateMonthlyInterest(
      referenceBalance,
      loan.annualInterestRate,
      currentYear,
      currentMonth
    );
    const referenceTotalPayment = Math.min(
      referenceBalance + referenceInterest,
      currentPayment  // Minimum payment only (inflation-adjusted for verðtryggð), no extra
    );
    const referencePrincipal = referenceTotalPayment - referenceInterest;
    const referenceNewBalance = Math.max(0, referenceBalance - referencePrincipal);

    // === SCENARIO 1: Base Case (extra payment only, no snowball effect) ===
    let baseInterest = 0;
    let baseTotalPayment = 0;
    let basePrincipal = 0;
    let baseNewBalance = baseBalance;
    let baseInvestContribution = 0;

    if (baseBalance > MIN_BALANCE_THRESHOLD) {
      // Still paying off loan
      baseInterest = calculateMonthlyInterest(
        baseBalance,
        loan.annualInterestRate,
        currentYear,
        currentMonth
      );
      baseTotalPayment = Math.min(
        baseBalance + baseInterest,
        currentPayment + extraPayment
      );
      basePrincipal = baseTotalPayment - baseInterest;
      baseNewBalance = Math.max(0, baseBalance - basePrincipal);
      if (baseNewBalance <= MIN_BALANCE_THRESHOLD && basePayoffMonth === 0) {
        basePayoffMonth = month;
      }
    } else if (includePostPayoffInvesting) {
      // Loan paid off - invest the full payment amount (only if post-payoff investing enabled)
      baseInvestContribution = currentPayment + extraPayment;
    }
    // Grow investment and add any contribution
    baseInvestmentBalance = baseInvestmentBalance * (1 + monthlyInvestReturn) + baseInvestContribution;

    // === SCENARIO 2: Snowball to Loan ===
    let snowballLoanInterest = 0;
    let snowballLoanTotalPayment = 0;
    let snowballLoanPrincipal = 0;
    let snowballLoanNewBalance = snowballLoanBalance;
    let snowballLoanInvestContribution = 0;

    // Interest savings = reference interest (minimum only) - snowball loan interest
    // This captures the benefit of paying extra compared to paying minimum
    const snowballLoanInterestForSavings = snowballLoanBalance > MIN_BALANCE_THRESHOLD
      ? calculateMonthlyInterest(snowballLoanBalance, loan.annualInterestRate, currentYear, currentMonth)
      : 0;
    const interestSavings = Math.max(0, referenceInterest - snowballLoanInterestForSavings);

    // Track cumulative savings for display/reporting purposes
    accumulatedSnowball += interestSavings;

    if (snowballLoanBalance > MIN_BALANCE_THRESHOLD) {
      // Still paying off loan
      snowballLoanInterest = calculateMonthlyInterest(
        snowballLoanBalance,
        loan.annualInterestRate,
        currentYear,
        currentMonth
      );
      // Apply THIS MONTH's interest savings as additional payment
      snowballLoanTotalPayment = Math.min(
        snowballLoanBalance + snowballLoanInterest,
        currentPayment + extraPayment + interestSavings
      );
      snowballLoanPrincipal = snowballLoanTotalPayment - snowballLoanInterest;
      snowballLoanNewBalance = Math.max(0, snowballLoanBalance - snowballLoanPrincipal);
      if (snowballLoanNewBalance <= MIN_BALANCE_THRESHOLD && snowballLoanPayoffMonth === 0) {
        snowballLoanPayoffMonth = month;
      }
    } else if (includePostPayoffInvesting) {
      // Loan paid off - invest the full payment amount (base + extra + what would have been interest savings)
      snowballLoanInvestContribution = currentPayment + extraPayment + interestSavings;
    }
    // Grow investment and add any contribution
    snowballLoanInvestmentBalance = snowballLoanInvestmentBalance * (1 + monthlyInvestReturn) + snowballLoanInvestContribution;

    // === SCENARIO 3: Snowball to Investment ===
    let snowballInvestInterest = 0;
    let snowballInvestTotalPayment = 0;
    let snowballInvestPrincipal = 0;
    let snowballInvestNewBalance = snowballInvestBalance;
    let snowballInvestInvestContribution = 0;

    if (snowballInvestBalance > MIN_BALANCE_THRESHOLD) {
      // Still paying off loan
      snowballInvestInterest = calculateMonthlyInterest(
        snowballInvestBalance,
        loan.annualInterestRate,
        currentYear,
        currentMonth
      );
      snowballInvestTotalPayment = Math.min(
        snowballInvestBalance + snowballInvestInterest,
        currentPayment + extraPayment
      );
      snowballInvestPrincipal = snowballInvestTotalPayment - snowballInvestInterest;
      snowballInvestNewBalance = Math.max(0, snowballInvestBalance - snowballInvestPrincipal);
      if (snowballInvestNewBalance <= MIN_BALANCE_THRESHOLD && snowballInvestPayoffMonth === 0) {
        snowballInvestPayoffMonth = month;
      }
      // Invest the interest savings (compared to minimum payment only) while paying loan
      snowballInvestInvestContribution = Math.max(0, referenceInterest - snowballInvestInterest);
    } else if (includePostPayoffInvesting) {
      // Loan paid off - invest the full payment amount (only if post-payoff investing enabled)
      snowballInvestInvestContribution = currentPayment + extraPayment;
    }
    // Grow investment and add contribution
    snowballInvestInvestmentBalance = snowballInvestInvestmentBalance * (1 + monthlyInvestReturn) + snowballInvestInvestContribution;

    // Record this month's data
    monthlySchedule.push({
      month,

      // Base case
      baseOpeningBalance,
      basePayment: baseTotalPayment,
      baseInterest,
      basePrincipal,
      baseClosingBalance: baseNewBalance,

      // Snowball to loan
      snowballLoanOpeningBalance,
      snowballLoanPayment: snowballLoanTotalPayment,
      snowballLoanExtraFromSavings: accumulatedSnowball,
      snowballLoanInterest,
      snowballLoanPrincipal,
      snowballLoanClosingBalance: snowballLoanNewBalance,

      // Snowball to investment
      snowballInvestOpeningBalance,
      snowballInvestPayment: snowballInvestTotalPayment,
      snowballInvestInterest,
      snowballInvestPrincipal,
      snowballInvestClosingBalance: snowballInvestNewBalance,
      snowballInvestmentBalance: snowballInvestInvestmentBalance,
      snowballInvestmentContribution: snowballInvestInvestContribution,

      // Comparison metrics
      interestSavingsThisMonth: interestSavings,
      cumulativeInterestSavings: accumulatedSnowball,
    });

    // Update balances for next iteration
    referenceBalance = referenceNewBalance;
    baseBalance = baseNewBalance;
    snowballLoanBalance = snowballLoanNewBalance;
    snowballInvestBalance = snowballInvestNewBalance;

    // Advance to next month for day count calculation
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  // Build final results with summaries and recommendation
  return buildResults(
    monthlySchedule,
    {
      base: baseInvestmentBalance,
      snowballLoan: snowballLoanInvestmentBalance,
      snowballInvest: snowballInvestInvestmentBalance,
    },
    actualHourlyWage,
    input
  );
}

/**
 * Build final results with scenario summaries and recommendation
 *
 * Calculates:
 * - Months to payoff for each scenario
 * - Total interest paid for each scenario
 * - Total payments for each scenario
 * - Final investment balance (for each scenario, including post-payoff investing)
 * - Total wealth created (debt eliminated + investment value)
 * - Life energy conversions if wage provided
 * - Recommendation with reasoning
 *
 * @param schedule - Monthly breakdown data
 * @param investmentBalances - Final investment balances for all scenarios
 * @param actualHourlyWage - For life energy calculations
 * @param input - Original input for recommendation reasoning
 * @returns Complete results object
 */
function buildResults(
  schedule: MonthlyRow[],
  investmentBalances: {
    base: number;
    snowballLoan: number;
    snowballInvest: number;
  },
  actualHourlyWage: number | undefined,
  input: SnowballInput
): SnowballResults {
  // Handle empty schedule edge case
  if (schedule.length === 0) {
    const emptyScenario: ScenarioSummary = {
      monthsToPayoff: 0,
      totalInterestPaid: 0,
      totalPayments: 0,
      finalInvestmentBalance: 0,
      totalWealthCreated: 0,
      lifeEnergyHours: {
        totalInterest: 0,
        totalPayments: 0,
        investmentGains: 0,
        netBenefit: 0,
      },
    };

    return {
      monthlySchedule: [],
      baseCase: emptyScenario,
      snowballToLoan: emptyScenario,
      snowballToInvestment: emptyScenario,
      recommendation: {
        bestScenario: 'base',
        isCloseCall: false,
        reasoning: 'Engin gögn til að greina.',
        lifeEnergyDifference: 0,
      },
    };
  }

  // Find payoff months (first month with zero balance)
  const basePayoffMonth = schedule.findIndex(r => r.baseClosingBalance <= MIN_BALANCE_THRESHOLD);
  const snowballLoanPayoffMonth = schedule.findIndex(r => r.snowballLoanClosingBalance <= MIN_BALANCE_THRESHOLD);
  const snowballInvestPayoffMonth = schedule.findIndex(r => r.snowballInvestClosingBalance <= MIN_BALANCE_THRESHOLD);

  // Convert -1 (not found) to schedule length
  const baseMonths = basePayoffMonth >= 0 ? basePayoffMonth + 1 : schedule.length;
  const snowballLoanMonths = snowballLoanPayoffMonth >= 0 ? snowballLoanPayoffMonth + 1 : schedule.length;
  const snowballInvestMonths = snowballInvestPayoffMonth >= 0 ? snowballInvestPayoffMonth + 1 : schedule.length;

  // Calculate totals
  const baseTotalInterest = schedule.reduce((sum, r) => sum + r.baseInterest, 0);
  const snowballLoanTotalInterest = schedule.reduce((sum, r) => sum + r.snowballLoanInterest, 0);
  const snowballInvestTotalInterest = schedule.reduce((sum, r) => sum + r.snowballInvestInterest, 0);

  const baseTotalPayments = schedule.reduce((sum, r) => sum + r.basePayment, 0);
  const snowballLoanTotalPayments = schedule.reduce((sum, r) => sum + r.snowballLoanPayment, 0);
  const snowballInvestTotalPayments = schedule.reduce((sum, r) => sum + r.snowballInvestPayment, 0);

  // Original debt = wealth created when paid off
  const originalDebt = schedule[0].baseOpeningBalance;

  // Life energy conversion helper
  const toLifeEnergy = (amount: number) => (actualHourlyWage ? amount / actualHourlyWage : 0);

  // Build scenario summaries (all scenarios now include post-payoff investment)
  const baseCase: ScenarioSummary = {
    monthsToPayoff: baseMonths,
    totalInterestPaid: baseTotalInterest,
    totalPayments: baseTotalPayments,
    finalInvestmentBalance: investmentBalances.base,
    totalWealthCreated: originalDebt + investmentBalances.base, // Debt eliminated + investment
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(baseTotalInterest),
      totalPayments: toLifeEnergy(baseTotalPayments),
      investmentGains: toLifeEnergy(investmentBalances.base),
      netBenefit: toLifeEnergy(originalDebt - baseTotalInterest + investmentBalances.base),
    },
  };

  const snowballToLoan: ScenarioSummary = {
    monthsToPayoff: snowballLoanMonths,
    totalInterestPaid: snowballLoanTotalInterest,
    totalPayments: snowballLoanTotalPayments,
    finalInvestmentBalance: investmentBalances.snowballLoan,
    totalWealthCreated: originalDebt + investmentBalances.snowballLoan, // Debt eliminated + post-payoff investment
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(snowballLoanTotalInterest),
      totalPayments: toLifeEnergy(snowballLoanTotalPayments),
      investmentGains: toLifeEnergy(investmentBalances.snowballLoan),
      netBenefit: toLifeEnergy(originalDebt - snowballLoanTotalInterest + investmentBalances.snowballLoan),
    },
  };

  const snowballToInvestment: ScenarioSummary = {
    monthsToPayoff: snowballInvestMonths,
    totalInterestPaid: snowballInvestTotalInterest,
    totalPayments: snowballInvestTotalPayments,
    finalInvestmentBalance: investmentBalances.snowballInvest,
    totalWealthCreated: originalDebt + investmentBalances.snowballInvest, // Debt eliminated + investment
    lifeEnergyHours: {
      totalInterest: toLifeEnergy(snowballInvestTotalInterest),
      totalPayments: toLifeEnergy(snowballInvestTotalPayments),
      investmentGains: toLifeEnergy(investmentBalances.snowballInvest),
      netBenefit: toLifeEnergy(originalDebt - snowballInvestTotalInterest + investmentBalances.snowballInvest),
    },
  };

  // Determine recommendation
  const scenarios = [
    { name: 'base' as const, summary: baseCase },
    { name: 'snowballLoan' as const, summary: snowballToLoan },
    { name: 'snowballInvest' as const, summary: snowballToInvestment },
  ];

  // Sort by total wealth created (descending)
  scenarios.sort((a, b) => b.summary.totalWealthCreated - a.summary.totalWealthCreated);

  const best = scenarios[0];
  const secondBest = scenarios[1];
  const worst = scenarios[2];

  // Calculate percentage difference between best and second-best
  const percentDifference =
    best.summary.totalWealthCreated > 0
      ? ((best.summary.totalWealthCreated - secondBest.summary.totalWealthCreated) /
          best.summary.totalWealthCreated) *
        100
      : 0;

  const isCloseCall = percentDifference < CLOSE_CALL_THRESHOLD * 100;

  // Calculate life energy difference between best and worst
  const lifeEnergyDifference =
    best.summary.lifeEnergyHours.netBenefit - worst.summary.lifeEnergyHours.netBenefit;

  // Generate reasoning
  const reasoning = generateReasoning(
    best.name,
    isCloseCall,
    lifeEnergyDifference,
    input,
    baseCase,
    snowballToLoan,
    snowballToInvestment
  );

  return {
    monthlySchedule: schedule,
    baseCase,
    snowballToLoan,
    snowballToInvestment,
    recommendation: {
      bestScenario: best.name,
      isCloseCall,
      reasoning,
      lifeEnergyDifference,
    },
  };
}

/**
 * Generate plain-language reasoning for recommendation (Icelandic)
 *
 * Provides context-aware explanation of why one scenario is recommended,
 * considering:
 * - Interest rate vs investment return comparison
 * - Time horizon
 * - Risk factors
 * - Life energy impact
 *
 * @param bestScenario - The recommended scenario
 * @param isCloseCall - Whether scenarios are within 5% of each other
 * @param lifeEnergyDiff - Life energy hours difference
 * @param input - Original input for context
 * @param baseCase - Base case summary
 * @param snowballLoan - Snowball to loan summary
 * @param snowballInvest - Snowball to investment summary
 * @returns Icelandic explanation text
 */
function generateReasoning(
  bestScenario: 'base' | 'snowballLoan' | 'snowballInvest',
  isCloseCall: boolean,
  lifeEnergyDiff: number,
  input: SnowballInput,
  baseCase: ScenarioSummary,
  snowballLoan: ScenarioSummary,
  snowballInvest: ScenarioSummary
): string {
  const { loan, expectedInvestmentReturn } = input;

  // Calculate effective loan rate (including inflation for indexed loans)
  const effectiveLoanRate =
    loan.loanType === 'verdtryggd'
      ? loan.annualInterestRate + (loan.inflationRate || 0)
      : loan.annualInterestRate;

  const loanRatePercent = (effectiveLoanRate * 100).toFixed(1);
  const investReturnPercent = (expectedInvestmentReturn * 100).toFixed(1);

  // Close call - let user decide
  if (isCloseCall) {
    return `Þessar aðferðir eru nánast jafntefli (innan við 5% munur). Persónulegt val skiptir máli hér. Skoðaðu hvað hentar þér best miðað við áhættuvilja og fjárhagsleg markmið.`;
  }

  // Build reasoning based on best scenario
  const reasons: string[] = [];

  // Rate comparison
  if (effectiveLoanRate > expectedInvestmentReturn) {
    reasons.push(
      `Vextir á láni (${loanRatePercent}%) eru hærri en vænt ávöxtun (${investReturnPercent}%)`
    );
  } else {
    reasons.push(
      `Vænt ávöxtun (${investReturnPercent}%) er hærri en vextir á láni (${loanRatePercent}%)`
    );
  }

  // Time savings
  if (bestScenario === 'snowballLoan') {
    const monthsSaved = baseCase.monthsToPayoff - snowballLoan.monthsToPayoff;
    if (monthsSaved > 0) {
      const yearsSaved = Math.floor(monthsSaved / 12);
      const monthsRemainder = monthsSaved % 12;
      const timeText =
        yearsSaved > 0
          ? `${yearsSaved} ár${monthsRemainder > 0 ? ` og ${monthsRemainder} mánuði` : ''}`
          : `${monthsRemainder} mánuði`;
      reasons.push(`Verður skuldlaus ${timeText} fyrr með snjóboltaaðferð`);
    }
  }

  // Interest savings
  const interestSaved =
    bestScenario === 'snowballLoan'
      ? baseCase.totalInterestPaid - snowballLoan.totalInterestPaid
      : baseCase.totalInterestPaid - snowballInvest.totalInterestPaid;

  if (interestSaved > 0) {
    reasons.push(`Sparar ${(interestSaved / 1_000_000).toFixed(1)}M kr í vöxtum`);
  }

  // Investment gains
  if (bestScenario === 'snowballInvest' && snowballInvest.finalInvestmentBalance > 0) {
    reasons.push(
      `Býr til ${(snowballInvest.finalInvestmentBalance / 1_000_000).toFixed(1)}M kr fjárfestingarvirði`
    );
  }

  // Risk consideration
  if (bestScenario === 'snowballLoan') {
    reasons.push('Minni áhætta - tryggður "ávöxtun" með vaxtasparnaði');
  } else if (bestScenario === 'snowballInvest') {
    reasons.push('Meiri áhætta - ávöxtun ekki tryggð en getur verið hærri');
  }

  // Life energy impact
  if (lifeEnergyDiff > 0) {
    const hours = Math.round(lifeEnergyDiff);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      reasons.push(`Gefur þér ${days} daga meira frítíma á ævinni`);
    } else {
      reasons.push(`Gefur þér ${hours} klst meira frítíma á ævinni`);
    }
  }

  return reasons.join('. ') + '.';
}
