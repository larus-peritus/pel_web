/**
 * TypeScript types for the Retirement Date Simulator (Eftirlaunadagsetningarhermir)
 * Based on "Your Money or Your Life" FIRE planning concepts and Monte Carlo simulation
 *
 * This calculator helps users project retirement success probability using Monte Carlo simulations,
 * integrates with Icelandic pension system (lífeyrissjóður, ellilífeyrir), and provides
 * flexibility analysis for different retirement dates.
 */

/**
 * Main retirement simulation configuration
 */
export interface RetirementSimulation {
  // Basic retirement timing
  retirementDate: Date;
  currentAge: number;
  currentDate: Date;
  lifeExpectancy: number; // Default: 92

  // Portfolio inputs
  portfolio: PortfolioInput;

  // Expense inputs
  expenses: ExpenseInput;

  // Icelandic pension inputs
  pensions: IcelandicPensionInput;

  // Simulation assumptions
  assumptions: SimulationAssumptions;

  // Withdrawal strategy
  withdrawalStrategy: WithdrawalStrategy;
}

/**
 * Portfolio and savings inputs
 */
export interface PortfolioInput {
  currentBalance: number; // ISK
  monthlySavings: number; // ISK until retirement
  expectedRealReturn: number; // Default: 0.07 (7%)
  inflationRate: number; // Default: 0.03 (3%)
  returnVolatility: number; // Default: 0.18 (18%)
}

/**
 * Expense input configuration
 * Can pull from Expense Baseline Tool or be entered manually
 */
export interface ExpenseInput {
  source: 'baseline' | 'manual' | 'custom';
  baselineTier?: 'barebones' | 'comfortable' | 'deluxe';
  monthlyExpenses?: number; // If manual or baseline selected
  retirementAdjustment: number; // Default: 1.0 (100% of working expenses)
  expenseSchedule?: ExpensePhase[]; // Optional: different spending over time
}

/**
 * Different expense levels during retirement phases
 * Example: Higher spending early retirement (travel), lower later
 */
export interface ExpensePhase {
  startAge: number;
  endAge: number;
  monthlyExpenses: number;
}

/**
 * Icelandic pension system integration
 * Lífeyrissjóður: Occupational pension fund (available at age 60-67)
 * Séreignarlífeyrir: Private pension (available at age 60, NOT means-tested)
 * Ellilífeyrir: State pension from TR (available at age 67, means-tested)
 */
export interface IcelandicPensionInput {
  lifeyrissjodur: {
    enabled: boolean;
    startAge: number; // Default: 67
    monthlyAmount: number; // ISK
    inflationAdjusted: boolean; // Default: true
  };
  sereign: {
    enabled: boolean;
    startAge: number; // Default: 60
    monthlyAmount: number; // ISK
    inflationAdjusted: boolean; // Default: true
  };
  ellilifeyrir: {
    enabled: boolean;
    startAge: number; // Default: 67
    monthlyAmount: number; // ISK
    inflationAdjusted: boolean; // Default: true
  };
}

/**
 * Simulation configuration and parameters
 */
export interface SimulationAssumptions {
  scenarioCount: number; // Default: 1000
  simulationType: 'monteCarlo' | 'deterministic';
  returnDistribution: 'historical' | 'lognormal' | 'custom';
  sequenceRiskEnabled: boolean; // Default: true
}

/**
 * Withdrawal strategy types
 * Four different approaches to retirement withdrawals
 */
export type WithdrawalStrategy =
  | FourPercentRule
  | VariableSpending
  | Guardrails
  | CustomWithdrawal;

/**
 * 4% Rule: Fixed percentage withdrawal (inflation-adjusted)
 * Based on Trinity Study safe withdrawal rate research
 */
export interface FourPercentRule {
  type: '4percent';
  rate: number; // Default: 0.04
  inflationAdjusted: boolean; // Default: true
}

/**
 * Variable Spending: Adjust withdrawals based on portfolio performance
 * Withdraw X% of current portfolio each year
 */
export interface VariableSpending {
  type: 'variable';
  percentageOfPortfolio: number; // Default: 0.04
}

/**
 * Guardrails: Increase/decrease spending based on portfolio thresholds
 * More sophisticated approach balancing fixed and variable strategies
 */
export interface Guardrails {
  type: 'guardrails';
  baseWithdrawal: number; // ISK
  upperGuardrail: number; // Portfolio % to trigger spending increase (e.g., 1.3 = 130%)
  lowerGuardrail: number; // Portfolio % to trigger spending decrease (e.g., 0.8 = 80%)
  adjustmentPercent: number; // Default: 0.1 (10% increase/decrease)
}

/**
 * Custom: User-defined withdrawal pattern
 * For specific retirement needs (e.g., higher spending early retirement)
 */
export interface CustomWithdrawal {
  type: 'custom';
  yearlyWithdrawals: number[]; // ISK per year
}

/**
 * Complete simulation results
 * Output from Monte Carlo or deterministic simulation
 */
export interface SimulationResults {
  // Success metrics
  successProbability: number; // 0-1 (e.g., 0.87 = 87%)
  successCount: number;
  failureCount: number;

  // Portfolio trajectories
  trajectories: {
    median: Trajectory;
    percentile25: Trajectory;
    percentile75: Trajectory;
    percentile5: Trajectory;
    percentile95: Trajectory;
  };

  // Failure analysis
  depletionAges: number[]; // Ages when portfolio hits zero (in failure scenarios)
  medianDepletionAge: number | null; // Median of depletion ages

  // Portfolio at life expectancy
  portfolioAtDeathMedian: number;
  portfolioAtDeath25th: number;
  portfolioAtDeath75th: number;

  // Flexibility analysis
  flexibility: FlexibilityAnalysis;

  // Metadata
  simulationConfig: SimulationConfig;
  runDate: Date;
  computeTime: number; // milliseconds
}

/**
 * Portfolio trajectory over time
 * Year-by-year projection of portfolio balance, withdrawals, etc.
 */
export interface Trajectory {
  ages: number[];
  portfolioBalances: number[];
  withdrawals: number[];
  pensionIncomes: number[];
  returns: number[];
}

/**
 * Flexibility analysis results
 * Helps user understand margin of safety and trade-offs
 */
export interface FlexibilityAnalysis {
  // Retirement timing flexibility
  yearsOfBuffer: number; // How many years earlier retirement is possible with >80% success
  additionalYearsNeeded: number; // If success rate < 80%, how many more years to work

  // Spending flexibility
  spendingIncreaseCapacity: number; // Percentage (e.g., 0.15 = 15% increase possible)
  spendingDecreaseNeeded: number; // Percentage (e.g., 0.10 = 10% decrease needed)

  // Sensitivity analysis
  sensitivity: {
    returnRatePlus1: number; // Success rate if return +1%
    returnRateMinus1: number; // Success rate if return -1%
    inflationPlus0_5: number; // Success rate if inflation +0.5%
    inflationMinus0_5: number; // Success rate if inflation -0.5%
    lifeExpectancyPlus5: number; // Success rate if live 5 years longer
    lifeExpectancyMinus5: number; // Success rate if live 5 years shorter
  };

  // Recommendation
  recommendation: {
    retirementDate: Date;
    reasoning: string; // Icelandic text explaining recommendation
    confidence: 'high' | 'medium' | 'low';
  };
}

/**
 * Simulation configuration for Web Worker
 * Serializable format for passing to Monte Carlo worker
 */
export interface SimulationConfig {
  retirementAge: number;
  currentAge: number;
  retirementDate: Date;
  currentPortfolio: number;
  monthlySavings: number;
  monthlyExpenses: number;
  lifeExpectancy: number;
  expectedReturn: number;
  returnVolatility: number;
  inflationRate: number;
  withdrawalStrategy: WithdrawalStrategy;
  pensionIncomes: PensionSchedule[];
  scenarioCount: number;
  yearsInRetirement: number;
}

/**
 * Pension income schedule
 * Defines when and how much pension income is received
 */
export interface PensionSchedule {
  startAge: number;
  monthlyAmount: number;
  inflationAdjusted: boolean;
  inflationRate: number;
  type: 'lifeyrissjodur' | 'sereign' | 'ellilifeyrir';
}

/**
 * Single scenario result from Monte Carlo simulation
 * Used internally during simulation aggregation
 */
export interface MonteCarloScenario {
  trajectory: Trajectory;
  success: boolean;
  depletionAge: number | null;
  portfolioAtDeath: number;
}

/**
 * Comparison scenario for side-by-side analysis
 * Allows comparing different retirement dates or strategies
 */
export interface ComparisonScenario {
  id: string;
  name: string;
  simulation: RetirementSimulation;
  results: SimulationResults | null;
}

/**
 * Success rate interpretation levels
 * Color-coded thresholds for user feedback
 */
export type SuccessRateLevel =
  | 'excellent'
  | 'good'
  | 'acceptable'
  | 'risky'
  | 'highRisk';

/**
 * Success rate threshold constants
 * Used for color coding and recommendations
 */
export interface SuccessRateThresholds {
  excellent: number; // >= 0.90
  good: number; // >= 0.80
  acceptable: number; // >= 0.70
  risky: number; // >= 0.60
  highRisk: number; // < 0.60
}

/**
 * Message types for Web Worker communication
 */
export type WorkerMessageType =
  | 'RUN_SIMULATION'
  | 'SIMULATION_COMPLETE'
  | 'SIMULATION_PROGRESS'
  | 'SIMULATION_ERROR'
  | 'CANCEL_SIMULATION';

/**
 * Message to worker: Run simulation
 */
export interface WorkerSimulationRequest {
  type: 'RUN_SIMULATION';
  config: SimulationConfig;
}

/**
 * Message from worker: Simulation complete
 */
export interface WorkerSimulationResponse {
  type: 'SIMULATION_COMPLETE';
  results: SimulationResults;
}

/**
 * Message from worker: Progress update
 */
export interface WorkerSimulationProgress {
  type: 'SIMULATION_PROGRESS';
  progress: number; // 0-100
  scenariosComplete: number;
  totalScenarios: number;
}

/**
 * Message from worker: Error occurred
 */
export interface WorkerSimulationError {
  type: 'SIMULATION_ERROR';
  error: string;
}

/**
 * Union type for all worker messages
 */
export type WorkerMessage =
  | WorkerSimulationRequest
  | WorkerSimulationResponse
  | WorkerSimulationProgress
  | WorkerSimulationError;

/**
 * Validation result for retirement simulation inputs
 */
export interface RetirementValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Life energy impact analysis (if Actual Hourly Wage available)
 * Converts financial metrics to work hours for better understanding
 */
export interface LifeEnergyImpact {
  retirementExpensesInHours: number; // Monthly expenses as work hours
  yearsOfLifeGained: number; // Years gained by retiring
  additionalWorkHoursNeeded: number; // If low success rate, hours needed to improve
  totalLifeEnergyToRetirement: number; // Total work hours from now to retirement
}

/**
 * Chart data point for portfolio projection visualization
 */
export interface ChartDataPoint {
  age: number;
  medianBalance: number;
  percentile25Balance: number;
  percentile75Balance: number;
  percentile5Balance: number;
  percentile95Balance: number;
  withdrawal: number;
  pensionIncome: number;
  isDepletionAge?: boolean; // True if portfolio depletes at this age in failure scenarios
}

/**
 * Pension income marker for chart visualization
 */
export interface PensionMarker {
  age: number;
  type: 'lifeyrissjodur' | 'sereign' | 'ellilifeyrir';
  label: string;
  amount: number;
}

/**
 * Stored state for Retirement Simulator
 */
export interface RetirementSimulatorState {
  simulation: RetirementSimulation;
  results: SimulationResults | null;
  comparisons: ComparisonScenario[];
  lastUpdated: string; // ISO timestamp
  version: number;
}
