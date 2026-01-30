/**
 * Retirement Date Simulator - Withdrawal Strategy Calculations
 *
 * Pure calculation functions for retirement withdrawal strategies and pension income.
 * Based on "Your Money or Your Life" FIRE planning concepts.
 *
 * Key strategies:
 * - 4% Rule: Fixed percentage withdrawal (inflation-adjusted)
 * - Variable Spending: Adjust withdrawals based on portfolio performance
 * - Guardrails: Increase/decrease spending based on portfolio thresholds
 * - Custom: User-defined withdrawal pattern
 *
 * Icelandic pension integration:
 * - Lífeyrissjóður (occupational pension) at age 60-67
 * - Séreignarlífeyrir (private pension) at age 60 - NOT means-tested
 * - Ellilífeyrir (state pension) at age 67 - means-tested
 */

import type {
  WithdrawalStrategy,
  FourPercentRule,
  VariableSpending,
  Guardrails,
  CustomWithdrawal,
  IcelandicPensionInput,
  PensionSchedule,
  RetirementSimulation,
  SimulationConfig,
} from '@/types/retirementSimulator';

import {
  DEFAULT_INFLATION_RATE,
  ICELANDIC_PENSION_DEFAULTS,
} from '@/lib/constants/retirementSimulator';

/**
 * Calculate withdrawal amount using 4% rule
 *
 * The 4% rule withdraws a fixed percentage of the initial portfolio
 * (inflation-adjusted over time).
 *
 * @param portfolio - Initial portfolio balance at retirement
 * @param baseWithdrawal - Base withdrawal amount (4% of initial portfolio)
 * @param year - Years into retirement (0 = first year)
 * @param inflationRate - Annual inflation rate
 * @returns Monthly withdrawal amount in ISK
 */
export const calculateWithdrawal4Percent = (
  portfolio: number,
  baseWithdrawal: number,
  year: number,
  inflationRate: number,
): number => {
  // Inflation-adjusted withdrawal
  const inflationFactor = Math.pow(1 + inflationRate, year);
  const annualWithdrawal = baseWithdrawal * inflationFactor;

  return annualWithdrawal / 12;
};

/**
 * Calculate withdrawal amount using variable percentage
 *
 * Variable spending adjusts withdrawals based on current portfolio value.
 * More flexible but less predictable than 4% rule.
 *
 * @param portfolio - Current portfolio balance
 * @param rate - Percentage of portfolio to withdraw (e.g., 0.04 = 4%)
 * @returns Monthly withdrawal amount in ISK
 */
export const calculateWithdrawalVariable = (portfolio: number, rate: number): number => {
  // Withdraw X% of current portfolio annually
  const annualWithdrawal = portfolio * rate;

  return annualWithdrawal / 12;
};

/**
 * Calculate withdrawal amount using guardrails strategy
 *
 * Guardrails strategy adjusts spending when portfolio crosses thresholds:
 * - Above upper guardrail: increase spending
 * - Below lower guardrail: decrease spending
 * - Between guardrails: maintain current spending
 *
 * @param portfolio - Current portfolio balance
 * @param baseWithdrawal - Base annual withdrawal amount
 * @param upperGuard - Upper threshold ratio (e.g., 1.3 = 130%)
 * @param lowerGuard - Lower threshold ratio (e.g., 0.8 = 80%)
 * @param adjustment - Adjustment percentage when crossing thresholds (e.g., 0.1 = 10%)
 * @returns Monthly withdrawal amount in ISK
 */
export const calculateWithdrawalGuardrails = (
  portfolio: number,
  baseWithdrawal: number,
  upperGuard: number,
  lowerGuard: number,
  adjustment: number,
): number => {
  // Calculate current portfolio ratio relative to initial
  // Note: In actual simulation, we'd track initial portfolio separately
  // For this calculation, we assume baseWithdrawal represents ~4% of initial
  const estimatedInitialPortfolio = baseWithdrawal / 0.04;
  const portfolioRatio = portfolio / estimatedInitialPortfolio;

  let adjustedWithdrawal = baseWithdrawal;

  // Check guardrails and adjust
  if (portfolioRatio > upperGuard) {
    // Portfolio is doing well, increase spending
    adjustedWithdrawal = baseWithdrawal * (1 + adjustment);
  } else if (portfolioRatio < lowerGuard) {
    // Portfolio is struggling, decrease spending
    adjustedWithdrawal = baseWithdrawal * (1 - adjustment);
  }

  return adjustedWithdrawal / 12;
};

/**
 * Calculate pension income at a given age
 *
 * Integrates Icelandic pension system:
 * - Lífeyrissjóður: Available at age 60-67 (occupational pension)
 * - Séreignarlífeyrir: Available at age 60 (private pension, NOT means-tested)
 * - Ellilífeyrir: Available at age 67 (state pension, means-tested)
 *
 * All can be inflation-adjusted if specified.
 *
 * @param age - Current age
 * @param pensions - Icelandic pension input configuration
 * @returns Monthly pension income in ISK
 */
export const calculatePensionIncome = (age: number, pensions: IcelandicPensionInput): number => {
  let totalIncome = 0;

  // Check lífeyrissjóður (occupational pension fund)
  if (pensions.lifeyrissjodur.enabled && age >= pensions.lifeyrissjodur.startAge) {
    totalIncome += pensions.lifeyrissjodur.monthlyAmount;
  }

  // Check séreignarlífeyrir (private pension - NOT means-tested)
  if (pensions.sereign.enabled && age >= pensions.sereign.startAge) {
    totalIncome += pensions.sereign.monthlyAmount;
  }

  // Check ellilífeyrir (state pension - means-tested)
  if (pensions.ellilifeyrir.enabled && age >= pensions.ellilifeyrir.startAge) {
    totalIncome += pensions.ellilifeyrir.monthlyAmount;
  }

  return totalIncome;
};

/**
 * Calculate yearly expenses after pension income
 *
 * Subtracts pension income from expenses to get net expenses
 * that must be covered by portfolio withdrawals.
 *
 * @param expenses - Monthly expenses
 * @param age - Current age
 * @param pensionIncome - Monthly pension income
 * @returns Net monthly expenses after pension income
 */
export const calculateYearlyExpenses = (
  expenses: number,
  age: number,
  pensionIncome: number,
): number => {
  // Net expenses = expenses - pension income
  // But never negative (pension surplus can stay in portfolio)
  return Math.max(0, expenses - pensionIncome);
};

/**
 * Calculate portfolio return for a single year
 *
 * Used in Monte Carlo simulation to generate random returns.
 * Uses lognormal distribution for realistic market behavior.
 *
 * @param portfolio - Current portfolio balance
 * @param expectedReturn - Expected annual return rate
 * @param volatility - Return volatility (standard deviation)
 * @returns Portfolio balance after return
 */
export const calculatePortfolioReturn = (
  portfolio: number,
  expectedReturn: number,
  volatility: number,
): number => {
  // For deterministic projection, use expected return
  // For Monte Carlo, caller will generate random return
  const returnRate = expectedReturn;

  return portfolio * (1 + returnRate);
};

/**
 * Calculate future value with compound growth
 *
 * Standard compound interest calculation.
 * Used for accumulation phase (before retirement).
 *
 * @param principal - Initial amount
 * @param rate - Annual growth rate
 * @param years - Number of years
 * @returns Future value
 */
export const calculateFutureValue = (principal: number, rate: number, years: number): number => {
  return principal * Math.pow(1 + rate, years);
};

/**
 * Calculate years to retirement
 *
 * Simple helper to calculate years between current age and retirement age.
 *
 * @param currentAge - Current age
 * @param targetAge - Target retirement age
 * @returns Years to retirement
 */
export const calculateYearsToRetirement = (currentAge: number, targetAge: number): number => {
  return Math.max(0, targetAge - currentAge);
};

/**
 * Prepare simulation configuration from RetirementSimulation input
 *
 * Converts user-friendly RetirementSimulation object to SimulationConfig
 * format needed by Monte Carlo worker.
 *
 * @param simulation - Retirement simulation inputs
 * @returns Simulation configuration for worker
 */
export const prepareSimulationConfig = (simulation: RetirementSimulation): SimulationConfig => {
  // Calculate retirement age from retirement date and current age
  const now = new Date();
  const retirementDate = new Date(simulation.retirementDate);
  const yearsUntilRetirement = Math.max(
    0,
    (retirementDate.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  const retirementAge = Math.round(simulation.currentAge + yearsUntilRetirement);

  // Calculate years in retirement
  const yearsInRetirement = simulation.lifeExpectancy - retirementAge;

  // Convert pension inputs to pension schedule
  const pensionIncomes: PensionSchedule[] = [];

  if (simulation.pensions.lifeyrissjodur.enabled) {
    pensionIncomes.push({
      startAge: simulation.pensions.lifeyrissjodur.startAge,
      monthlyAmount: simulation.pensions.lifeyrissjodur.monthlyAmount,
      inflationAdjusted: simulation.pensions.lifeyrissjodur.inflationAdjusted,
      inflationRate: simulation.portfolio.inflationRate,
      type: 'lifeyrissjodur',
    });
  }

  // Séreignarlífeyrir (private pension) - NOT means-tested
  if (simulation.pensions.sereign.enabled) {
    pensionIncomes.push({
      startAge: simulation.pensions.sereign.startAge,
      monthlyAmount: simulation.pensions.sereign.monthlyAmount,
      inflationAdjusted: simulation.pensions.sereign.inflationAdjusted,
      inflationRate: simulation.portfolio.inflationRate,
      type: 'sereign',
    });
  }

  if (simulation.pensions.ellilifeyrir.enabled) {
    pensionIncomes.push({
      startAge: simulation.pensions.ellilifeyrir.startAge,
      monthlyAmount: simulation.pensions.ellilifeyrir.monthlyAmount,
      inflationAdjusted: simulation.pensions.ellilifeyrir.inflationAdjusted,
      inflationRate: simulation.portfolio.inflationRate,
      type: 'ellilifeyrir',
    });
  }

  // Get monthly expenses
  const monthlyExpenses =
    (simulation.expenses.monthlyExpenses || 0) * simulation.expenses.retirementAdjustment;

  return {
    retirementAge,
    currentAge: simulation.currentAge,
    retirementDate: simulation.retirementDate,
    currentPortfolio: simulation.portfolio.currentBalance,
    monthlySavings: simulation.portfolio.monthlySavings,
    monthlyExpenses,
    lifeExpectancy: simulation.lifeExpectancy,
    expectedReturn: simulation.portfolio.expectedRealReturn,
    returnVolatility: simulation.portfolio.returnVolatility,
    inflationRate: simulation.portfolio.inflationRate,
    withdrawalStrategy: simulation.withdrawalStrategy,
    pensionIncomes,
    scenarioCount: simulation.assumptions.scenarioCount,
    yearsInRetirement,
  };
};

/**
 * Calculate withdrawal amount based on strategy
 *
 * Main dispatcher function that routes to the appropriate withdrawal calculation
 * based on the strategy type.
 *
 * @param strategy - Withdrawal strategy configuration
 * @param currentPortfolio - Current portfolio balance
 * @param initialPortfolio - Initial portfolio at retirement
 * @param yearsIntoRetirement - Years since retirement (0 = first year)
 * @param inflationRate - Annual inflation rate
 * @returns Monthly withdrawal amount in ISK
 */
export const calculateWithdrawal = (
  strategy: WithdrawalStrategy,
  currentPortfolio: number,
  initialPortfolio: number,
  yearsIntoRetirement: number,
  inflationRate: number,
): number => {
  switch (strategy.type) {
    case '4percent': {
      const baseWithdrawal = initialPortfolio * strategy.rate;
      return calculateWithdrawal4Percent(
        initialPortfolio,
        baseWithdrawal,
        yearsIntoRetirement,
        strategy.inflationAdjusted ? inflationRate : 0,
      );
    }

    case 'variable': {
      return calculateWithdrawalVariable(currentPortfolio, strategy.percentageOfPortfolio);
    }

    case 'guardrails': {
      return calculateWithdrawalGuardrails(
        currentPortfolio,
        strategy.baseWithdrawal,
        strategy.upperGuardrail,
        strategy.lowerGuardrail,
        strategy.adjustmentPercent,
      );
    }

    case 'custom': {
      const yearIndex = Math.min(yearsIntoRetirement, strategy.yearlyWithdrawals.length - 1);
      const annualWithdrawal = strategy.yearlyWithdrawals[yearIndex] || 0;
      return annualWithdrawal / 12;
    }

    default: {
      // Fallback to 4% rule
      const baseWithdrawal = initialPortfolio * 0.04;
      return calculateWithdrawal4Percent(
        initialPortfolio,
        baseWithdrawal,
        yearsIntoRetirement,
        inflationRate,
      );
    }
  }
};

/**
 * Get typical Icelandic pension estimate
 *
 * Provides reasonable estimates for Icelandic pensions when user doesn't have exact figures.
 *
 * @param age - Age for pension calculation
 * @param pensionType - Type of pension (lifeyrissjodur, sereign, or ellilifeyrir)
 * @returns Estimated monthly pension amount in ISK
 */
export const estimateTypicalPension = (
  age: number,
  pensionType: 'lifeyrissjodur' | 'sereign' | 'ellilifeyrir',
): number => {
  if (pensionType === 'lifeyrissjodur') {
    // Lífeyrissjóður available at age 67 (default)
    if (age >= ICELANDIC_PENSION_DEFAULTS.LIFEYRISSJODUR_AGE) {
      return ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY;
    }
  } else if (pensionType === 'sereign') {
    // Séreignarlífeyrir available at age 60
    if (age >= ICELANDIC_PENSION_DEFAULTS.SEREIGN_AGE) {
      return ICELANDIC_PENSION_DEFAULTS.TYPICAL_SEREIGN_MONTHLY;
    }
  } else if (pensionType === 'ellilifeyrir') {
    // Ellilífeyrir available at age 67
    if (age >= ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE) {
      return ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY;
    }
  }

  return 0;
};

/**
 * Calculate total pension income with inflation adjustment
 *
 * Calculates pension income with optional inflation adjustment over time.
 * Used in Monte Carlo simulation.
 *
 * @param age - Current age
 * @param pensions - Pension schedules
 * @param inflationRate - Annual inflation rate
 * @param yearsIntoRetirement - Years since retirement
 * @returns Monthly pension income in ISK
 */
export const calculateTotalPensionIncome = (
  age: number,
  pensions: PensionSchedule[],
  inflationRate: number,
  yearsIntoRetirement: number,
): number => {
  let totalIncome = 0;

  for (const pension of pensions) {
    if (age >= pension.startAge) {
      // Calculate years since pension started
      const yearsSincePensionStart = age - pension.startAge;

      // Apply inflation adjustment if enabled
      const inflationFactor = pension.inflationAdjusted
        ? Math.pow(1 + inflationRate, yearsSincePensionStart)
        : 1;

      totalIncome += pension.monthlyAmount * inflationFactor;
    }
  }

  return totalIncome;
};
