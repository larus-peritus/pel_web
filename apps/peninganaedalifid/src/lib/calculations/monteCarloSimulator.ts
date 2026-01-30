/**
 * Monte Carlo Simulator for Retirement Planning
 *
 * Runs thousands of retirement scenarios with random market returns to estimate
 * probability of success. Integrates withdrawal strategies and Icelandic pension system.
 */

/**
 * Generate a cryptographically secure random number in the range (0, 1)
 *
 * Uses Web Crypto API for better randomness than Math.random().
 * Returns a value strictly between 0 and 1 (exclusive) to avoid
 * Math.log(0) = -Infinity in the Box-Muller transform.
 */
function secureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Convert to (0, 1) range - never exactly 0 or 1
  // Adding 1 and dividing by 2^32 + 1 ensures we're always in (0, 1)
  return (array[0] + 1) / 0x100000001;
}

import type {
  RetirementSimulation,
  SimulationResults,
  SimulationConfig,
  Trajectory,
  FlexibilityAnalysis,
  MonteCarloScenario,
  PensionSchedule,
} from '@/types/retirementSimulator';
import {
  prepareSimulationConfig,
  calculateWithdrawal,
  calculateTotalPensionIncome,
} from './retirementSimulator';
import {
  DEFAULT_SCENARIO_COUNT,
  TARGET_SUCCESS_RATE,
  BUFFER_TARGET_SUCCESS_RATE,
  SENSITIVITY_ANALYSIS,
} from '../constants/retirementSimulator';

/**
 * Generate random return using lognormal distribution
 *
 * Markets tend to follow lognormal distribution (can't go below -100% but unbounded upside)
 * Uses cryptographically secure random numbers for better simulation accuracy.
 */
function generateRandomReturn(expectedReturn: number, volatility: number): number {
  // Box-Muller transform for normal distribution
  // Using secureRandom() which returns values in (0, 1) - never 0, avoiding Math.log(0) = -Infinity
  const u1 = secureRandom();
  const u2 = secureRandom();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Convert to lognormal
  const logReturn = expectedReturn - (volatility * volatility) / 2 + volatility * z;

  return Math.exp(logReturn) - 1;
}

/**
 * Run a single retirement scenario
 */
function runScenario(config: SimulationConfig): MonteCarloScenario {
  const {
    retirementAge,
    currentAge,
    lifeExpectancy,
    currentPortfolio,
    monthlySavings,
    monthlyExpenses,
    expectedReturn,
    returnVolatility,
    inflationRate,
    withdrawalStrategy,
    pensionIncomes,
  } = config;

  const ages: number[] = [];
  const portfolioBalances: number[] = [];
  const withdrawals: number[] = [];
  const pensionIncomes_array: number[] = [];
  const returns: number[] = [];

  let portfolio = currentPortfolio;
  const initialRetirementPortfolio = currentPortfolio; // Will be updated after accumulation
  let age = currentAge;
  let yearsIntoRetirement = 0;
  let depletionAge: number | null = null;
  let actualInitialRetirementPortfolio = 0;

  // Accumulation phase (before retirement)
  while (age < retirementAge) {
    const annualReturn = generateRandomReturn(expectedReturn, returnVolatility);

    // Add monthly savings throughout the year
    portfolio += monthlySavings * 12;

    // Apply annual return
    portfolio *= 1 + annualReturn;

    ages.push(age);
    portfolioBalances.push(portfolio);
    withdrawals.push(0); // No withdrawals during accumulation
    pensionIncomes_array.push(0);
    returns.push(annualReturn);

    age++;
  }

  actualInitialRetirementPortfolio = portfolio;

  // Retirement phase (withdrawal)
  while (age <= lifeExpectancy) {
    // Calculate pension income at this age
    const pensionIncome = calculateTotalPensionIncome(
      age,
      pensionIncomes,
      inflationRate,
      yearsIntoRetirement
    );

    // Calculate withdrawal needed (monthly)
    const monthlyWithdrawal = calculateWithdrawal(
      withdrawalStrategy,
      portfolio,
      actualInitialRetirementPortfolio,
      yearsIntoRetirement,
      inflationRate
    );

    // Annual withdrawal
    const annualWithdrawal = monthlyWithdrawal * 12;

    // Net expenses = withdrawals needed - pension income
    const netExpenses = Math.max(0, annualWithdrawal - pensionIncome * 12);

    // Deduct net expenses at start of year
    portfolio -= netExpenses;

    // Check for depletion
    if (portfolio <= 0 && depletionAge === null) {
      depletionAge = age;
      portfolio = 0;
    }

    // Generate return for the year
    const annualReturn = generateRandomReturn(expectedReturn, returnVolatility);

    // Apply return (if portfolio still positive)
    if (portfolio > 0) {
      portfolio *= 1 + annualReturn;
    }

    ages.push(age);
    portfolioBalances.push(Math.max(0, portfolio));
    withdrawals.push(annualWithdrawal);
    pensionIncomes_array.push(pensionIncome * 12);
    returns.push(annualReturn);

    age++;
    yearsIntoRetirement++;
  }

  const trajectory: Trajectory = {
    ages,
    portfolioBalances,
    withdrawals,
    pensionIncomes: pensionIncomes_array,
    returns,
  };

  const success = portfolio > 0;

  return {
    trajectory,
    success,
    depletionAge,
    portfolioAtDeath: portfolio,
  };
}

/**
 * Calculate percentile trajectory from scenarios
 */
function calculatePercentileTrajectory(
  scenarios: MonteCarloScenario[],
  percentile: number
): Trajectory {
  const allAges = scenarios[0].trajectory.ages;
  const ages: number[] = [];
  const portfolioBalances: number[] = [];
  const withdrawals: number[] = [];
  const pensionIncomes: number[] = [];
  const returns: number[] = [];

  for (let i = 0; i < allAges.length; i++) {
    const balancesAtAge = scenarios.map((s) => s.trajectory.portfolioBalances[i]);
    const withdrawalsAtAge = scenarios.map((s) => s.trajectory.withdrawals[i]);
    const pensionsAtAge = scenarios.map((s) => s.trajectory.pensionIncomes[i]);
    const returnsAtAge = scenarios.map((s) => s.trajectory.returns[i]);

    balancesAtAge.sort((a, b) => a - b);
    withdrawalsAtAge.sort((a, b) => a - b);
    pensionsAtAge.sort((a, b) => a - b);
    returnsAtAge.sort((a, b) => a - b);

    const index = Math.floor(scenarios.length * percentile);

    ages.push(allAges[i]);
    portfolioBalances.push(balancesAtAge[index]);
    withdrawals.push(withdrawalsAtAge[index]);
    pensionIncomes.push(pensionsAtAge[index]);
    returns.push(returnsAtAge[index]);
  }

  return {
    ages,
    portfolioBalances,
    withdrawals,
    pensionIncomes,
    returns,
  };
}

/**
 * Calculate flexibility analysis
 */
function calculateFlexibility(
  config: SimulationConfig,
  successRate: number
): FlexibilityAnalysis {
  // Simplified flexibility analysis for now
  // In production, you'd run additional simulations with variations

  const yearsOfBuffer = successRate > 0.9 ? Math.floor((successRate - 0.8) * 20) : 0;
  const additionalYearsNeeded = successRate < 0.8 ? Math.ceil((0.8 - successRate) * 20) : 0;
  const spendingIncreaseCapacity = successRate > 0.9 ? (successRate - 0.9) * 0.5 : 0;
  const spendingDecreaseNeeded = successRate < 0.8 ? (0.8 - successRate) * 0.4 : 0;

  // Sensitivity analysis - approximate impact
  const returnDelta = SENSITIVITY_ANALYSIS.RETURN_DELTA;
  const inflationDelta = SENSITIVITY_ANALYSIS.INFLATION_DELTA;

  const sensitivity = {
    returnRatePlus1: Math.min(1, successRate + 0.08),
    returnRateMinus1: Math.max(0, successRate - 0.12),
    inflationPlus0_5: Math.max(0, successRate - 0.05),
    inflationMinus0_5: Math.min(1, successRate + 0.04),
    lifeExpectancyPlus5: Math.max(0, successRate - 0.06),
    lifeExpectancyMinus5: Math.min(1, successRate + 0.08),
  };

  // Recommendation
  let confidence: 'high' | 'medium' | 'low';
  let reasoning: string;

  if (successRate >= 0.9) {
    confidence = 'high';
    reasoning = `Eftirlaunaáætlunin þín er mjög örugg með ${(successRate * 100).toFixed(0)}% árangurslíkum. Þú hefur gott svigrúm til að fara fyrr á eftirlaun eða auka útgjöld.`;
  } else if (successRate >= 0.75) {
    confidence = 'medium';
    reasoning = `Eftirlaunaáætlunin þín hefur ásættanlegar líkur (${(successRate * 100).toFixed(0)}%). Íhugaðu að vinna aðeins lengur eða lækka útgjöld lítillega til að bæta öryggi.`;
  } else {
    confidence = 'low';
    reasoning = `Eftirlaunaáætlunin þín er áhættusöm með aðeins ${(successRate * 100).toFixed(0)}% árangurslíkum. Mælt er með að vinna lengur, auka sparnað, eða lækka útgjöld verulega.`;
  }

  const adjustedRetirementDate = new Date(config.retirementDate);
  if (additionalYearsNeeded > 0) {
    adjustedRetirementDate.setFullYear(adjustedRetirementDate.getFullYear() + additionalYearsNeeded);
  } else if (yearsOfBuffer > 0) {
    adjustedRetirementDate.setFullYear(adjustedRetirementDate.getFullYear() - Math.min(yearsOfBuffer, 2));
  }

  return {
    yearsOfBuffer,
    additionalYearsNeeded,
    spendingIncreaseCapacity,
    spendingDecreaseNeeded,
    sensitivity,
    recommendation: {
      retirementDate: adjustedRetirementDate,
      reasoning,
      confidence,
    },
  };
}

/**
 * Run Monte Carlo simulation
 *
 * @param simulation - Retirement simulation configuration
 * @param onProgress - Optional progress callback (0-100)
 * @returns Simulation results with trajectories and statistics
 */
export async function runMonteCarloSimulation(
  simulation: RetirementSimulation,
  onProgress?: (progress: number) => void
): Promise<SimulationResults> {
  const startTime = Date.now();

  // Prepare configuration
  const config = prepareSimulationConfig(simulation);

  // Run scenarios
  const scenarios: MonteCarloScenario[] = [];
  const scenarioCount = config.scenarioCount;

  for (let i = 0; i < scenarioCount; i++) {
    scenarios.push(runScenario(config));

    // Report progress every 50 scenarios
    if (onProgress && i % 50 === 0) {
      onProgress(Math.floor((i / scenarioCount) * 100));
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  // Calculate success metrics
  const successfulScenarios = scenarios.filter((s) => s.success);
  const successCount = successfulScenarios.length;
  const failureCount = scenarioCount - successCount;
  const successProbability = successCount / scenarioCount;

  // Calculate trajectories
  const trajectories = {
    median: calculatePercentileTrajectory(scenarios, 0.5),
    percentile25: calculatePercentileTrajectory(scenarios, 0.25),
    percentile75: calculatePercentileTrajectory(scenarios, 0.75),
    percentile5: calculatePercentileTrajectory(scenarios, 0.05),
    percentile95: calculatePercentileTrajectory(scenarios, 0.95),
  };

  // Depletion analysis
  const depletionAges = scenarios
    .filter((s) => s.depletionAge !== null)
    .map((s) => s.depletionAge as number);

  depletionAges.sort((a, b) => a - b);
  const medianDepletionAge =
    depletionAges.length > 0 ? depletionAges[Math.floor(depletionAges.length / 2)] : null;

  // Portfolio at death statistics
  const portfoliosAtDeath = scenarios.map((s) => s.portfolioAtDeath).sort((a, b) => a - b);
  const portfolioAtDeathMedian = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length / 2)];
  const portfolioAtDeath25th = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length * 0.25)];
  const portfolioAtDeath75th = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length * 0.75)];

  // Flexibility analysis
  const flexibility = calculateFlexibility(config, successProbability);

  const endTime = Date.now();

  return {
    successProbability,
    successCount,
    failureCount,
    trajectories,
    depletionAges,
    medianDepletionAge,
    portfolioAtDeathMedian,
    portfolioAtDeath25th,
    portfolioAtDeath75th,
    flexibility,
    simulationConfig: config,
    runDate: new Date(),
    computeTime: endTime - startTime,
  };
}
