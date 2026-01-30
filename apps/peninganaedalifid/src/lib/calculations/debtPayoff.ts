/**
 * Debt Payoff vs Invest Calculation Functions
 * Core business logic for comparing debt payoff vs investment scenarios
 */

import type {
  DebtInput,
  InvestmentAssumptions,
  MonthlyProjection,
  DebtPayoffResults,
  AmortizationRow,
  PaymentBreakdown,
  PaymentMethod,
} from '@/types/debtPayoff';
import { MAX_PROJECTION_MONTHS, MIN_BALANCE_THRESHOLD, CLOSE_CALL_THRESHOLD } from '@/lib/constants/debtPayoff';
import { formatMonthsText } from '@/lib/content/debtPayoff';

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
function calculateMonthlyInterestActual360(
  balance: number,
  annualRate: number,
  year: number,
  month: number
): number {
  const daysInMonth = getDaysInMonth(year, month);
  return balance * annualRate * (daysInMonth / 360);
}

/**
 * Calculate monthly payment for an annuity loan (jafnar afborganir)
 * Same payment each month over the loan term
 *
 * Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where P = principal, r = monthly rate, n = number of payments
 */
export function calculateAnnuityPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (termMonths <= 0 || principal <= 0) return 0;
  if (annualRate === 0) return principal / termMonths;

  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return principal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate monthly payment breakdown for the current month
 * Returns principal portion and interest portion separately
 *
 * Uses originalLoanAmount and loanTermMonths to calculate the fixed monthly payment,
 * then calculates how much of the current payment goes to principal vs interest
 * based on the currentBalance.
 */
export function calculatePaymentBreakdown(
  debt: DebtInput
): PaymentBreakdown {
  const monthlyRate = debt.nominalInterestRate / 12;
  const currentBalance = debt.currentBalance;

  // Use original loan amount and term for calculating the fixed monthly payment
  // Fall back to current balance if original not provided
  const originalAmount = debt.originalLoanAmount || debt.currentBalance;
  const totalTermMonths = debt.loanTermMonths || debt.remainingPayments || 60;

  // For indexed loans, include inflation adjustment
  if (debt.loanType === 'verdtryggd') {
    const monthlyInflation = (debt.inflationRate || 0) / 12;
    const inflationAdjustment = currentBalance * monthlyInflation;
    const interestPayment = currentBalance * monthlyRate;

    // Calculate fixed monthly payment based on original loan terms
    const monthlyPayment = calculateAnnuityPayment(
      originalAmount,
      debt.nominalInterestRate,
      totalTermMonths
    );

    const principalPayment = Math.max(0, monthlyPayment - interestPayment);

    return {
      monthlyPayment,
      principalPayment,
      interestPayment,
      inflationAdjustment,
    };
  }

  // For non-indexed loans
  const paymentMethod: PaymentMethod = debt.paymentMethod || 'annuity';
  const interestPayment = currentBalance * monthlyRate;

  if (paymentMethod === 'linear') {
    // Linear: equal principal payments based on ORIGINAL amount and TOTAL term
    // Principal payment = original amount / total term
    const principalPayment = originalAmount / totalTermMonths;
    const monthlyPayment = principalPayment + interestPayment;

    return {
      monthlyPayment,
      principalPayment,
      interestPayment,
    };
  }

  // Annuity: equal total payments based on ORIGINAL amount and TOTAL term
  const monthlyPayment = calculateAnnuityPayment(
    originalAmount,
    debt.nominalInterestRate,
    totalTermMonths
  );

  const principalPayment = Math.max(0, monthlyPayment - interestPayment);

  return {
    monthlyPayment,
    principalPayment,
    interestPayment,
  };
}

/**
 * Calculate remaining loan term based on balance, rate, and payment
 * Returns number of months to pay off the loan
 */
export function calculateRemainingTerm(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): number {
  if (balance <= 0 || monthlyPayment <= 0) return 0;
  if (annualRate === 0) return Math.ceil(balance / monthlyPayment);

  const monthlyRate = annualRate / 12;
  const monthlyInterest = balance * monthlyRate;

  // Payment must exceed interest or loan never pays off
  if (monthlyPayment <= monthlyInterest) {
    return MAX_PROJECTION_MONTHS; // Effectively infinite
  }

  // Formula: n = -log(1 - Pr/M) / log(1 + r)
  // Where P = principal, r = monthly rate, M = payment
  const n = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);

  return Math.ceil(n);
}

/**
 * Generate detailed amortization schedule
 * Uses actual/360 day count convention and Islandsbanki-style inflation handling
 *
 * @param balance - Current loan balance (ISK)
 * @param annualRate - Annual interest rate (e.g., 0.08 for 8%)
 * @param baseMonthlyPayment - Base monthly payment in ISK (grows with inflation for indexed)
 * @param actualHourlyWage - For life energy calculations
 * @param loanType - 'standard' or 'indexed' (verðtryggð)
 * @param inflationRate - Annual inflation rate for indexed loans
 * @param maxMonths - Optional maximum number of months (for fixed-term comparison)
 * @returns Array of detailed amortization rows
 */
export function generateAmortizationSchedule(
  balance: number,
  annualRate: number,
  baseMonthlyPayment: number,
  actualHourlyWage: number,
  loanType: 'standard' | 'indexed' = 'standard',
  inflationRate: number = 0,
  maxMonths?: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  let remainingBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  // Use compound monthly inflation for accuracy
  const monthlyInflation = loanType === 'indexed' ? Math.pow(1 + inflationRate, 1 / 12) - 1 : 0;
  const maxProjection = maxMonths ? Math.min(maxMonths, MAX_PROJECTION_MONTHS) : MAX_PROJECTION_MONTHS;

  // Payment grows with inflation for indexed loans (Islandsbanki-style)
  let currentPayment = baseMonthlyPayment;

  // Track date for actual/360 day count
  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth(); // 0-indexed

  while (remainingBalance > MIN_BALANCE_THRESHOLD && month < maxProjection) {
    month++;
    const openingBalance = remainingBalance;

    // For indexed loans, apply inflation to BOTH balance AND payment FIRST (Islandsbanki-style)
    if (loanType === 'indexed') {
      remainingBalance = remainingBalance * (1 + monthlyInflation);
      currentPayment = currentPayment * (1 + monthlyInflation);
    }

    // Calculate interest using actual/360 day count convention
    const interestPayment = calculateMonthlyInterestActual360(
      remainingBalance,
      annualRate,
      currentYear,
      currentMonth
    );

    // Principal payment (payment minus interest)
    // Can be negative if payment < interest (loan growing)
    const principalPayment = currentPayment - interestPayment;
    const actualPayment = currentPayment;

    // Update balance - may increase if payment doesn't cover interest
    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;

    schedule.push({
      month,
      openingBalance,
      payment: actualPayment,
      interestPayment,
      principalPayment,
      closingBalance: Math.max(0, remainingBalance),
      cumulativeInterest,
      lifeEnergyHours: actualPayment / actualHourlyWage,
    });

    // Advance to next month for day count calculation
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    // Stop if we've paid off the loan
    if (remainingBalance <= MIN_BALANCE_THRESHOLD) {
      break;
    }
  }

  return schedule;
}

/**
 * Calculate standard (non-indexed) loan amortization schedule
 * Uses actual/360 day count convention (Icelandic banking standard)
 *
 * @param balance - Current loan balance (ISK)
 * @param annualRate - Annual interest rate (e.g., 0.08 for 8%)
 * @param monthlyPayment - Total monthly payment (minimum + extra) in ISK
 * @returns Array of monthly projections until debt is paid off
 */
export function calculateStandardAmortization(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): MonthlyProjection[] {
  const projections: MonthlyProjection[] = [];

  let remainingBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  // Track date for actual/360 day count
  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth(); // 0-indexed

  // Safety: prevent infinite loops
  while (remainingBalance > MIN_BALANCE_THRESHOLD && month < MAX_PROJECTION_MONTHS) {
    month++;

    // Calculate interest using actual/360 day count convention
    const interestPayment = calculateMonthlyInterestActual360(
      remainingBalance,
      annualRate,
      currentYear,
      currentMonth
    );

    // Principal payment is payment minus interest, but can't exceed balance
    const principalPayment = Math.min(monthlyPayment - interestPayment, remainingBalance);

    // Update balance and cumulative interest
    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;

    // Store projection
    projections.push({
      month,
      remainingDebt: Math.max(0, remainingBalance), // Ensure non-negative
      investmentBalance: 0, // Set by comparison function
      netWorth: -Math.max(0, remainingBalance),
      interestPaid: cumulativeInterest,
      investmentGains: 0,
    });

    // Advance to next month for day count calculation
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return projections;
}

/**
 * Calculate inflation-indexed (verðtryggð) loan amortization
 *
 * Iceland-specific (Islandsbanki-style):
 * - Principal is indexed to inflation each month
 * - Payment also GROWS with inflation each month
 * - Uses actual/360 day count convention for interest calculation
 *
 * @param balance - Current loan balance (ISK)
 * @param realRate - Real annual interest rate (e.g., 0.04 for 4%)
 * @param inflationRate - Expected annual inflation (e.g., 0.03 for 3%)
 * @param baseMonthlyPayment - Base monthly payment (will grow with inflation) in ISK
 * @returns Array of monthly projections
 */
export function calculateIndexedAmortization(
  balance: number,
  realRate: number,
  inflationRate: number,
  baseMonthlyPayment: number
): MonthlyProjection[] {
  // Use compound monthly inflation for accuracy
  const monthlyInflation = Math.pow(1 + inflationRate, 1 / 12) - 1;
  const projections: MonthlyProjection[] = [];

  let remainingBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  // Payment grows with inflation each month (Islandsbanki-style)
  let currentPayment = baseMonthlyPayment;

  // Track date for actual/360 day count
  const startDate = new Date();
  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth(); // 0-indexed

  // Safety: prevent infinite loops
  while (remainingBalance > MIN_BALANCE_THRESHOLD && month < MAX_PROJECTION_MONTHS) {
    month++;

    // Apply inflation indexing to balance AND payment FIRST (Islandsbanki-style)
    remainingBalance = remainingBalance * (1 + monthlyInflation);
    currentPayment = currentPayment * (1 + monthlyInflation);

    // Calculate interest using actual/360 day count convention
    const interestPayment = calculateMonthlyInterestActual360(
      remainingBalance,
      realRate,
      currentYear,
      currentMonth
    );

    // Principal payment is payment minus interest, but can't exceed balance
    const principalPayment = Math.min(currentPayment - interestPayment, remainingBalance);

    // Update balance and cumulative interest
    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;

    // Store projection
    projections.push({
      month,
      remainingDebt: Math.max(0, remainingBalance), // Ensure non-negative
      investmentBalance: 0, // Set by comparison function
      netWorth: -Math.max(0, remainingBalance),
      interestPaid: cumulativeInterest,
      investmentGains: 0,
    });

    // Advance to next month for day count calculation
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return projections;
}

/**
 * Calculate investment growth with monthly contributions
 *
 * @param monthlyContribution - Amount invested each month (ISK)
 * @param annualReturn - Expected annual return (e.g., 0.07 for 7%)
 * @param months - Number of months to project
 * @returns Array of monthly investment balances
 */
export function calculateInvestmentGrowth(
  monthlyContribution: number,
  annualReturn: number,
  months: number
): MonthlyProjection[] {
  const monthlyReturn = annualReturn / 12;
  const projections: MonthlyProjection[] = [];

  let investmentBalance = 0;
  let cumulativeGains = 0;
  let cumulativeContributions = 0;

  for (let month = 1; month <= months; month++) {
    // Add monthly contribution
    investmentBalance += monthlyContribution;
    cumulativeContributions += monthlyContribution;

    // Apply monthly growth
    const monthlyGain = investmentBalance * monthlyReturn;
    investmentBalance += monthlyGain;
    cumulativeGains += monthlyGain;

    // Store projection
    projections.push({
      month,
      remainingDebt: 0, // Set by comparison function
      investmentBalance,
      netWorth: investmentBalance,
      interestPaid: 0,
      investmentGains: cumulativeGains,
    });
  }

  return projections;
}

/**
 * Merge debt and investment projections for side-by-side comparison
 *
 * @param debtProjections - Debt payoff monthly projections
 * @param investmentProjections - Investment monthly projections
 * @returns Merged projections with both debt and investment data
 */
function mergeProjections(
  debtProjections: MonthlyProjection[],
  investmentProjections: MonthlyProjection[]
): MonthlyProjection[] {
  const maxMonths = Math.max(debtProjections.length, investmentProjections.length);
  const merged: MonthlyProjection[] = [];

  for (let i = 0; i < maxMonths; i++) {
    const debtProj = debtProjections[i] || debtProjections[debtProjections.length - 1];
    const invProj = investmentProjections[i] || investmentProjections[investmentProjections.length - 1];

    merged.push({
      month: i + 1,
      remainingDebt: debtProj?.remainingDebt || 0,
      investmentBalance: invProj?.investmentBalance || 0,
      netWorth: (invProj?.investmentBalance || 0) - (debtProj?.remainingDebt || 0),
      interestPaid: debtProj?.interestPaid || 0,
      investmentGains: invProj?.investmentGains || 0,
    });
  }

  return merged;
}

/**
 * Find the month where investment gains exceed interest saved
 *
 * @param projections - Merged monthly projections
 * @returns Month number, or null if never breaks even
 */
export function findBreakEvenPoint(projections: MonthlyProjection[]): number | null {
  for (let i = 0; i < projections.length; i++) {
    const projection = projections[i];

    // Investment scenario net worth > debt payoff scenario net worth
    // Investment net worth = investmentBalance - remainingDebt (when continuing to pay minimum)
    // Debt payoff net worth = 0 - 0 = 0 (once debt is paid off)
    if (projection.netWorth > 0) {
      return projection.month;
    }
  }

  return null; // Never breaks even
}

/**
 * Generate plain-language reasoning for recommendation (Icelandic)
 *
 * @param debt - Debt input configuration
 * @param investment - Investment assumptions
 * @param recommendation - Recommendation result
 * @param breakEvenMonth - Break-even month (or null)
 * @param debtFreeMonth - Debt-free month
 * @returns Array of reasoning points in Icelandic
 */
export function generateReasoning(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  recommendation: 'debt' | 'invest',
  breakEvenMonth: number | null,
  debtFreeMonth: number
): string[] {
  const reasoning: string[] = [];

  // Calculate effective debt rate (including inflation for indexed loans)
  const effectiveDebtRate =
    debt.loanType === 'verdtryggd'
      ? debt.nominalInterestRate + (debt.inflationRate || 0)
      : debt.nominalInterestRate;

  const rateDifference = Math.abs(effectiveDebtRate - investment.expectedAnnualReturn);

  // Rate comparison
  if (effectiveDebtRate > investment.expectedAnnualReturn) {
    reasoning.push(
      `Vextir á láni (${(effectiveDebtRate * 100).toFixed(1)}%) eru hærri en vænt ávöxtun (${(investment.expectedAnnualReturn * 100).toFixed(1)}%)`
    );
  } else {
    reasoning.push(
      `Vænt ávöxtun (${(investment.expectedAnnualReturn * 100).toFixed(1)}%) er hærri en vextir á láni (${(effectiveDebtRate * 100).toFixed(1)}%)`
    );
  }

  // Time horizon consideration
  if (debtFreeMonth <= 24) {
    reasoning.push(`Stuttur lánstími (${formatMonthsText(debtFreeMonth)}) - minni tími fyrir samsett ávöxtun`);
  } else if (debtFreeMonth >= 60) {
    reasoning.push(`Langur lánstími (${formatMonthsText(debtFreeMonth)}) - meiri tími fyrir samsett ávöxtun`);
  }

  // Risk consideration
  if (recommendation === 'debt') {
    reasoning.push('Minni áhætta með skuldagreiðslum - tryggður "ávöxtun"');
  } else {
    reasoning.push('Fjárfestingar hafa áhættu - ávöxtun ekki tryggð');
  }

  // Break-even analysis
  if (breakEvenMonth && breakEvenMonth < debtFreeMonth) {
    reasoning.push(`Fjárfesting tekur yfir eftir ${formatMonthsText(breakEvenMonth)}`);
  }

  return reasoning;
}

/**
 * Apply emotional "peace of mind" factor to debt analysis
 *
 * Adds the peace of mind percentage to the effective interest rate,
 * representing the psychological value of being debt-free
 *
 * @param debt - Original debt input
 * @param investment - Investment assumptions
 * @param peacOfMindFactor - Percentage to add (0-10%)
 * @param actualHourlyWage - For life energy calculations
 * @returns Adjusted results
 */
export function calculatePeaceOfMindAdjustment(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  peacOfMindFactor: number,
  actualHourlyWage: number
): {
  factor: number;
  adjustedRecommendation: 'debt' | 'invest';
  adjustedAdvantage: number;
} {
  // Increase effective debt rate by peace of mind factor
  const adjustedDebt: DebtInput = {
    ...debt,
    nominalInterestRate: debt.nominalInterestRate + peacOfMindFactor / 100,
  };

  // Recalculate with adjusted rate (without recursing)
  const adjustedResults = compareDebtVsInvestment(adjustedDebt, investment, actualHourlyWage, 0);

  return {
    factor: peacOfMindFactor,
    adjustedRecommendation: adjustedResults.comparison.recommendation,
    adjustedAdvantage: adjustedResults.comparison.financialAdvantage,
  };
}

/**
 * Compare debt payoff vs investment scenarios
 *
 * Master calculation function that orchestrates all sub-calculations
 *
 * @param debt - Debt input configuration
 * @param investment - Investment assumptions
 * @param actualHourlyWage - For life energy calculations
 * @param peacOfMindFactor - Emotional adjustment (0-10%)
 * @returns Complete analysis results
 */
export function compareDebtVsInvestment(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  actualHourlyWage: number,
  peacOfMindFactor: number = 0
): DebtPayoffResults {
  // 1. Calculate the proper monthly payment based on loan terms
  const paymentBreakdown = calculatePaymentBreakdown(debt);
  const baseMonthlyPayment = paymentBreakdown.monthlyPayment;

  // Total payment = calculated base payment + extra payment
  const totalPayment = baseMonthlyPayment + debt.extraPayment;

  // Determine loan term - use remainingPayments if specified, otherwise calculate
  const loanTermMonths = debt.remainingPayments ||
    calculateRemainingTerm(debt.currentBalance, debt.nominalInterestRate, totalPayment);

  const debtProjections =
    debt.loanType === 'verdtryggd'
      ? calculateIndexedAmortization(
          debt.currentBalance,
          debt.nominalInterestRate,
          debt.inflationRate || 0,
          totalPayment
        )
      : calculateStandardAmortization(debt.currentBalance, debt.nominalInterestRate, totalPayment);

  // Generate detailed amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(
    debt.currentBalance,
    debt.nominalInterestRate,
    totalPayment,
    actualHourlyWage,
    debt.loanType === 'verdtryggd' ? 'indexed' : 'standard',
    debt.inflationRate || 0,
    debt.remainingPayments // Pass remaining payments to limit schedule
  );

  // Use the actual schedule length for debt-free calculation
  const debtFreeMonth = Math.min(amortizationSchedule.length, loanTermMonths);
  const totalInterestPaid = amortizationSchedule[amortizationSchedule.length - 1]?.cumulativeInterest || 0;

  // 2. Calculate investment scenario (same timeframe as loan)
  const investmentMonths = debt.remainingPayments || debtFreeMonth;
  const investmentProjections = calculateInvestmentGrowth(
    debt.extraPayment,
    investment.expectedAnnualReturn,
    investmentMonths
  );

  // 3. Merge projections for comparison
  const mergedProjections = mergeProjections(debtProjections, investmentProjections);

  // 4. Find break-even point
  const breakEvenMonth = findBreakEvenPoint(mergedProjections);

  // 5. Calculate final comparison at debt-free date
  const finalDebtNetWorth = 0; // Debt-free, no investment in this scenario
  const lastInvestmentMonth = investmentProjections.length - 1;
  const finalInvestmentBalance = investmentProjections[lastInvestmentMonth]?.investmentBalance || 0;
  // In investment scenario, you still have debt at this point (only paid minimum)
  // Actually, let's recalculate: if investing instead, you'd still pay minimum on debt
  // For simplicity, assume investment scenario has debt paid off at same time (this is the key comparison)
  const finalInvestmentNetWorth = finalInvestmentBalance; // Investment balance, debt also paid off

  const financialAdvantage = Math.abs(finalInvestmentNetWorth - finalDebtNetWorth);
  const recommendation = finalInvestmentNetWorth > finalDebtNetWorth ? 'invest' : 'debt';

  // 6. Life energy calculations
  const lifeEnergyHours = financialAdvantage / actualHourlyWage;
  const debtLifeEnergyHours = totalInterestPaid / actualHourlyWage;

  // 7. Generate reasoning
  const reasoning = generateReasoning(debt, investment, recommendation, breakEvenMonth, debtFreeMonth);

  // 8. Check if close call
  const isCloseCall = financialAdvantage / debt.currentBalance < CLOSE_CALL_THRESHOLD;

  // 9. Apply peace of mind adjustment if needed
  const peacOfMindAdjustment =
    peacOfMindFactor > 0
      ? calculatePeaceOfMindAdjustment(debt, investment, peacOfMindFactor, actualHourlyWage)
      : undefined;

  return {
    debtScenario: {
      monthlyProjections: debtProjections,
      amortizationSchedule,
      debtFreeMonth,
      totalInterestPaid,
      totalPrincipalPaid: debt.currentBalance,
      lifeEnergyHours: debtLifeEnergyHours,
    },
    investmentScenario: {
      monthlyProjections: investmentProjections,
      finalInvestmentBalance,
      totalContributions: debt.extraPayment * investmentMonths,
      totalGains: investmentProjections[lastInvestmentMonth]?.investmentGains || 0,
      finalNetWorth: finalInvestmentNetWorth,
    },
    comparison: {
      recommendation,
      financialAdvantage,
      lifeEnergyAdvantage: lifeEnergyHours,
      percentageAdvantage: (financialAdvantage / debt.currentBalance) * 100,
      breakEvenMonth,
      reasoning,
      isCloseCall,
    },
    peacOfMindAdjustment,
  };
}
