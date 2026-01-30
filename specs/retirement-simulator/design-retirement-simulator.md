# Design: Retirement Date Simulator

## Document Information

- **Feature Name**: Retirement Date Simulator (Eftirlaunadagsetningarhermir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-retirement-simulator.md

---

## 1. System Overview

### 1.1 Purpose

The Retirement Date Simulator is a comprehensive FIRE planning tool that uses Monte Carlo simulations to project portfolio sustainability across different retirement dates. It integrates with the Icelandic pension system (lífeyrissjóður and ellilífeyrir) and provides success probability calculations, portfolio trajectory visualizations, and flexibility analysis to help users make informed retirement timing decisions.

### 1.2 Architecture Style

**Client-Side React Application with Intensive Calculations**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management
- Web Workers for Monte Carlo calculations (offload from main thread)
- Chart.js or Recharts for portfolio projections
- LocalStorage for scenario persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Performance-First**: Monte Carlo simulations run in Web Workers to prevent UI blocking
2. **Transparent Methodology**: All assumptions clearly stated, methodology explained
3. **Icelandic Integration**: Native support for lífeyrissjóður and ellilífeyrir
4. **Visual Clarity**: Success probability and portfolio projections front and center
5. **Flexibility Focus**: Help users understand their margin of safety
6. **Comparison-Friendly**: Easy side-by-side comparison of retirement dates
7. **Life Energy Integration**: Convert financial results to work hours when possible

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Input Panel      │  │ Results Panel    │  │ Comparison Panel     │  │
│  │ (Date, Portfolio,│  │ (Success Rate,   │  │ (Side-by-side)       │  │
│  │  Expenses)       │  │  Projections)    │  │                      │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  retirementSimulation: RetirementSimulation                      │   │
│  │    - retirementDate: Date                                        │   │
│  │    - currentAge: number                                          │   │
│  │    - portfolio: PortfolioInput                                   │   │
│  │    - expenses: ExpenseInput                                      │   │
│  │    - pensions: IcelandicPensionInput                             │   │
│  │    - assumptions: SimulationAssumptions                          │   │
│  │  simulationResults: SimulationResults | null                     │   │
│  │    - successProbability: number                                  │   │
│  │    - portfolioTrajectories: Trajectory[]                         │   │
│  │    - flexibility: FlexibilityAnalysis                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Simulation Engine Layer                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Web Worker: MonteCarloWorker                                    │   │
│  │    - runSimulation(config): SimulationResults                    │   │
│  │    - generateScenarios(count): Scenario[]                        │   │
│  │    - calculateSuccessRate(scenarios): number                     │   │
│  │    - projectPortfolio(scenario): Trajectory                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Calculation Engine: retirementCalculations.ts                   │   │
│  │    - deterministicProjection(): Trajectory                       │   │
│  │    - applyWithdrawalStrategy(): number                           │   │
│  │    - calculatePensionIncome(): number                            │   │
│  │    - analyzeFlexibility(): FlexibilityAnalysis                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Scenario Cache    │  │ Export/Import     │  │
│  │ (Inputs)          │  │ (Recent Runs)     │  │ Functions         │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
RetirementSimulatorCalculator (Page Component)
├── SimulationInputPanel
│   ├── RetirementDateInput
│   │   ├── DatePicker (or Age Input)
│   │   ├── RetirementDateSlider (+/- 5 years)
│   │   └── YearsUntilRetirementDisplay
│   ├── PortfolioInput
│   │   ├── CurrentBalanceInput
│   │   ├── MonthlySavingsInput (until retirement)
│   │   ├── ExpectedReturnInput (default: 7%)
│   │   └── InflationRateInput (default: 3%)
│   ├── ExpenseInput
│   │   ├── ExpenseBaselineSelector (pull from context)
│   │   ├── ManualExpenseInput (if no baseline)
│   │   ├── RetirementExpenseAdjustment (e.g., 80% of working)
│   │   └── ExpenseScheduleEditor (optional: different phases)
│   ├── IcelandicPensionInput (collapsible)
│   │   ├── LífeyrissjóðurToggle (age 60+)
│   │   ├── LífeyrissjóðurAmountInput
│   │   ├── EllilífeyririToggle (age 67+)
│   │   ├── EllilífeyririAmountInput
│   │   └── EstimateButton (provide typical values)
│   ├── LifeExpectancyInput (default: 92)
│   └── WithdrawalStrategySelector
│       ├── FourPercentRuleOption
│       ├── VariableSpendingOption
│       ├── GuardrailsOption
│       └── CustomOption
│
├── SimulationControlPanel
│   ├── SimulationTypeToggle (Monte Carlo / Deterministic)
│   ├── ScenarioCountInput (1,000 / 5,000 / 10,000)
│   ├── RunSimulationButton
│   └── SimulationProgress (when running)
│
├── ResultsSummaryPanel
│   ├── SuccessProbabilityCard
│   │   ├── SuccessRateDisplay (large percentage with color)
│   │   ├── SuccessRateGauge (visual indicator)
│   │   └── InterpretationText ("Excellent" / "Good" / "Risky")
│   ├── KeyMetricsGrid
│   │   ├── MedianPortfolioAtDeathCard
│   │   ├── WorstCaseDepletionAgeCard
│   │   ├── YearsOfBufferCard
│   │   └── SpendingFlexibilityCard
│   └── LifeEnergyImpactCard (if AWH available)
│       ├── YearsOfLifeGained (early retirement)
│       └── AdditionalWorkHoursNeeded (if low success rate)
│
├── PortfolioProjectionChart
│   ├── LineChart (portfolio balance over time)
│   │   ├── MedianTrajectory (bold line)
│   │   ├── PercentileBands (25th-75th shaded area)
│   │   ├── BestCaseTrajectory (95th percentile, dotted)
│   │   └── WorstCaseTrajectory (5th percentile, dotted)
│   ├── WithdrawalOverlay (annual withdrawal amounts)
│   ├── PensionIncomeMarkers (age 60, 67)
│   ├── PortfolioDepletionMarkers (failure scenarios)
│   └── InteractiveTooltip (hover for details)
│
├── FlexibilityAnalysisPanel
│   ├── BufferAnalysisCard
│   │   ├── EarlierRetirementPossible (years)
│   │   ├── SpendingIncreaseCapacity (percentage)
│   │   └── AdditionalYearsNeeded (if underfunded)
│   ├── SensitivityAnalysisTable
│   │   ├── ReturnRateSensitivity (+/- 1%)
│   │   ├── InflationSensitivity (+/- 0.5%)
│   │   └── LifeExpectancySensitivity (+/- 5 years)
│   └── RecommendationCard
│       ├── RecommendedRetirementDate
│       └── Reasoning
│
├── ComparisonModePanel (optional)
│   ├── ScenarioTabs (Scenario A / B / C)
│   ├── SideBySideMetricsTable
│   │   ├── RetirementDate
│   │   ├── SuccessProbability
│   │   ├── MedianPortfolio
│   │   └── Buffer
│   ├── OverlayedProjectionChart (all scenarios)
│   └── TradeOffAnalysis (work years vs success rate)
│
├── MethodologyExplainer (collapsible)
│   ├── MonteCarloExplanation
│   ├── AssumptionsStatement
│   ├── WithdrawalStrategyDetails
│   └── DisclaimerText
│
└── EducationalPanel (collapsible)
    ├── SuccessProbabilityExplainer
    ├── SequenceOfReturnsRiskInfo
    ├── IcelandicPensionSystemGuide
    └── FAQSection
```

### 2.3 Data Flow

**Simulation Flow:**
```
User Input → Validation → CalculatorContext → Simulation Request
                                                      ↓
                                              Web Worker Spawned
                                                      ↓
                                        Generate 1,000+ Scenarios
                                                      ↓
                                        For each scenario:
                                          - Randomize returns
                                          - Project portfolio year-by-year
                                          - Apply withdrawals + pensions
                                          - Check if portfolio lasts
                                                      ↓
                                        Aggregate Results
                                                      ↓
                                        Calculate Success Rate
                                        Calculate Percentiles
                                        Analyze Flexibility
                                                      ↓
                                        Return to Main Thread
                                                      ↓
                                        Update CalculatorContext
                                                      ↓
                                        UI Re-renders with Results
```

**Comparison Flow:**
```
User Adds Comparison Scenario → Duplicate Input State → Run Simulation
                                                              ↓
                                                  Store Results A and B
                                                              ↓
                                                    Display Side-by-Side
                                                              ↓
                                            Overlay Portfolio Trajectories
                                                              ↓
                                            Calculate Trade-Offs
```

---

## 3. Component Design

### 3.1 RetirementSimulatorCalculator (Main Component)

**Responsibility**: Page-level container and orchestration

**Interface:**
```typescript
interface RetirementSimulatorCalculatorProps {
  // No props - gets data from CalculatorContext
}
```

**Key Features:**
- Coordinates input, simulation, and results display
- Manages simulation loading state
- Handles comparison mode toggle
- Integrates with CalculatorContext

---

### 3.2 SimulationInputPanel Component

**Responsibility**: Collect all inputs needed for simulation

**Interface:**
```typescript
interface SimulationInputPanelProps {
  simulation: RetirementSimulation;
  onUpdateSimulation: (updates: Partial<RetirementSimulation>) => void;
  onRunSimulation: () => void;
  isSimulationRunning: boolean;
}
```

**Key Features:**
- Grouped input sections (retirement date, portfolio, expenses, pensions)
- Real-time validation
- Integration with Expense Baseline Tool
- Default value suggestions for Icelandic users

---

### 3.3 PortfolioProjectionChart Component

**Responsibility**: Visualize portfolio trajectories over time

**Interface:**
```typescript
interface PortfolioProjectionChartProps {
  results: SimulationResults;
  retirementAge: number;
  lifeExpectancy: number;
  highlightScenarios?: 'success' | 'failure' | 'all';
  comparisonResults?: SimulationResults[]; // For overlay
}

interface SimulationResults {
  successProbability: number;
  trajectories: {
    median: Trajectory;
    percentile25: Trajectory;
    percentile75: Trajectory;
    percentile5: Trajectory;
    percentile95: Trajectory;
  };
  depletionAges: number[]; // Ages when portfolio depletes in failure scenarios
  flexibility: FlexibilityAnalysis;
}

interface Trajectory {
  ages: number[];
  portfolioBalances: number[];
  withdrawals: number[];
  pensionIncomes: number[];
}
```

**Chart Features:**
- X-axis: Age (from retirement to life expectancy)
- Y-axis: Portfolio Balance (ISK)
- Median line: Bold, color-coded by success rate
- Percentile bands: Shaded area (25th-75th)
- Best/worst case: Dotted lines
- Pension income markers: Vertical lines at age 60, 67
- Depletion markers: Red dots where portfolio hits zero
- Interactive tooltips: Hover for exact values

---

### 3.4 MonteCarloWorker (Web Worker)

**Responsibility**: Run Monte Carlo simulations off the main thread

**Interface:**
```typescript
// Message to worker
interface SimulationRequest {
  type: 'RUN_SIMULATION';
  config: SimulationConfig;
}

interface SimulationConfig {
  retirementAge: number;
  currentAge: number;
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
}

// Message from worker
interface SimulationResponse {
  type: 'SIMULATION_COMPLETE';
  results: SimulationResults;
}

interface SimulationProgress {
  type: 'SIMULATION_PROGRESS';
  progress: number; // 0-100
}
```

**Algorithm:**
```
For each scenario (1 to N):
  1. Initialize portfolio = currentPortfolio
  2. Generate random return sequence (lognormal distribution)
  3. For each year from currentAge to retirementAge:
       - Apply return to portfolio
       - Add savings (inflation-adjusted)
  4. For each year from retirementAge to lifeExpectancy:
       - Apply return to portfolio
       - Calculate withdrawal (based on strategy)
       - Add pension income (if applicable)
       - Subtract withdrawal
       - If portfolio < 0: mark as failure, record depletion age
  5. Record trajectory for percentile calculation

After all scenarios:
  1. Calculate success rate (% where portfolio > 0 at life expectancy)
  2. Calculate percentiles (5th, 25th, 50th, 75th, 95th)
  3. Aggregate depletion ages
  4. Return results
```

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Retirement Simulation Types
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

export interface PortfolioInput {
  currentBalance: number; // ISK
  monthlySavings: number; // ISK until retirement
  expectedRealReturn: number; // Default: 0.07 (7%)
  inflationRate: number; // Default: 0.03 (3%)
  returnVolatility: number; // Default: 0.18 (18%)
}

export interface ExpenseInput {
  source: 'baseline' | 'manual' | 'custom';
  baselineTier?: 'barebones' | 'comfortable' | 'deluxe';
  monthlyExpenses?: number; // If manual
  retirementAdjustment: number; // Default: 1.0 (100% of working expenses)
  expenseSchedule?: ExpensePhase[]; // Optional: different spending over time
}

export interface ExpensePhase {
  startAge: number;
  endAge: number;
  monthlyExpenses: number;
}

export interface IcelandicPensionInput {
  lifeyrissjodur: {
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

export interface SimulationAssumptions {
  scenarioCount: number; // Default: 1000
  simulationType: 'monteCarlo' | 'deterministic';
  returnDistribution: 'historical' | 'lognormal' | 'custom';
  sequenceRiskEnabled: boolean; // Default: true
}

export type WithdrawalStrategy =
  | FourPercentRule
  | VariableSpending
  | Guardrails
  | CustomWithdrawal;

export interface FourPercentRule {
  type: '4percent';
  rate: number; // Default: 0.04
  inflationAdjusted: boolean; // Default: true
}

export interface VariableSpending {
  type: 'variable';
  percentageOfPortfolio: number; // Default: 0.04
}

export interface Guardrails {
  type: 'guardrails';
  baseWithdrawal: number; // ISK
  upperGuardrail: number; // Portfolio % to trigger spending increase (e.g., 1.3)
  lowerGuardrail: number; // Portfolio % to trigger spending decrease (e.g., 0.8)
  adjustmentPercent: number; // Default: 0.1 (10% increase/decrease)
}

export interface CustomWithdrawal {
  type: 'custom';
  yearlyWithdrawals: number[]; // ISK per year
}
```

### 4.2 Simulation Results Types

```typescript
export interface SimulationResults {
  // Success metrics
  successProbability: number; // 0-1
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

export interface Trajectory {
  ages: number[];
  portfolioBalances: number[];
  withdrawals: number[];
  pensionIncomes: number[];
  returns: number[];
}

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
    reasoning: string;
    confidence: 'high' | 'medium' | 'low';
  };
}
```

### 4.3 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // Retirement Simulation
  retirementSimulation: RetirementSimulation | null;
  simulationResults: SimulationResults | null;
  isSimulationRunning: boolean;
  simulationProgress: number; // 0-100

  // Retirement Simulation Actions
  updateRetirementSimulation: (updates: Partial<RetirementSimulation>) => void;
  runSimulation: () => Promise<void>;
  clearSimulation: () => void;

  // Comparison mode
  comparisonScenarios: ComparisonScenario[];
  addComparisonScenario: (name: string) => void;
  removeComparisonScenario: (id: string) => void;
  updateComparisonScenario: (id: string, updates: Partial<RetirementSimulation>) => void;
  runComparisonSimulations: () => Promise<void>;
}

export interface ComparisonScenario {
  id: string;
  name: string;
  simulation: RetirementSimulation;
  results: SimulationResults | null;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  retirementSimulation?: {
    retirementDate: string; // ISO date string
    currentAge: number;
    lifeExpectancy: number;
    portfolio: PortfolioInput;
    expenses: {
      source: string;
      baselineTier?: string;
      monthlyExpenses?: number;
      retirementAdjustment: number;
    };
    pensions: IcelandicPensionInput;
    assumptions: SimulationAssumptions;
    withdrawalStrategy: WithdrawalStrategy;
  };

  // Note: Results not stored (recalculated on demand)
}
```

---

## 5. Calculation Logic

### 5.1 Monte Carlo Simulation Engine

**File**: `/src/workers/monteCarloWorker.ts`

```typescript
/**
 * Main simulation runner
 */
function runMonteCarloSimulation(config: SimulationConfig): SimulationResults {
  const scenarios: Scenario[] = [];

  for (let i = 0; i < config.scenarioCount; i++) {
    // Generate random return sequence
    const returnSequence = generateReturnSequence(
      config.yearsInRetirement,
      config.expectedReturn,
      config.returnVolatility
    );

    // Run single scenario
    const scenario = runSingleScenario(config, returnSequence);
    scenarios.push(scenario);

    // Report progress
    if (i % 100 === 0) {
      postMessage({ type: 'SIMULATION_PROGRESS', progress: (i / config.scenarioCount) * 100 });
    }
  }

  // Aggregate results
  return aggregateScenarios(scenarios, config);
}

/**
 * Generate random return sequence using lognormal distribution
 */
function generateReturnSequence(
  years: number,
  expectedReturn: number,
  volatility: number
): number[] {
  const returns: number[] = [];

  for (let i = 0; i < years; i++) {
    // Lognormal distribution
    const mu = Math.log(1 + expectedReturn) - (volatility ** 2) / 2;
    const sigma = volatility;
    const randomNormal = boxMullerTransform(); // Standard normal random variable
    const returnRate = Math.exp(mu + sigma * randomNormal) - 1;

    returns.push(returnRate);
  }

  return returns;
}

/**
 * Box-Muller transform for normal distribution
 */
function boxMullerTransform(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Run single scenario with specific return sequence
 */
function runSingleScenario(
  config: SimulationConfig,
  returnSequence: number[]
): Scenario {
  let portfolio = config.currentPortfolio;
  const trajectory: Trajectory = {
    ages: [],
    portfolioBalances: [],
    withdrawals: [],
    pensionIncomes: [],
    returns: [],
  };

  // Accumulation phase (current age to retirement age)
  for (let age = config.currentAge; age < config.retirementAge; age++) {
    const yearIndex = age - config.currentAge;
    const returnRate = returnSequence[yearIndex];

    // Apply return
    portfolio *= (1 + returnRate);

    // Add savings (inflation-adjusted)
    const yearsUntilRetirement = config.retirementAge - age;
    const inflationFactor = Math.pow(1 + config.inflationRate, yearsUntilRetirement);
    portfolio += config.monthlySavings * 12 / inflationFactor;

    trajectory.ages.push(age);
    trajectory.portfolioBalances.push(portfolio);
    trajectory.withdrawals.push(0);
    trajectory.pensionIncomes.push(0);
    trajectory.returns.push(returnRate);
  }

  // Withdrawal phase (retirement age to life expectancy)
  let initialPortfolio = portfolio; // For 4% rule
  let portfolioDepleted = false;
  let depletionAge: number | null = null;

  for (let age = config.retirementAge; age <= config.lifeExpectancy; age++) {
    const yearIndex = age - config.currentAge;
    const returnRate = yearIndex < returnSequence.length ? returnSequence[yearIndex] : generateReturnSequence(1, config.expectedReturn, config.returnVolatility)[0];

    // Apply return
    portfolio *= (1 + returnRate);

    // Calculate pension income
    const pensionIncome = calculatePensionIncome(age, config.pensionIncomes);
    portfolio += pensionIncome * 12;

    // Calculate withdrawal
    const withdrawal = calculateWithdrawal(
      config.withdrawalStrategy,
      portfolio,
      initialPortfolio,
      age - config.retirementAge,
      config.monthlyExpenses
    );

    // Subtract withdrawal
    portfolio -= withdrawal * 12;

    // Check for depletion
    if (portfolio <= 0 && !portfolioDepleted) {
      portfolioDepleted = true;
      depletionAge = age;
    }

    trajectory.ages.push(age);
    trajectory.portfolioBalances.push(Math.max(0, portfolio));
    trajectory.withdrawals.push(withdrawal);
    trajectory.pensionIncomes.push(pensionIncome);
    trajectory.returns.push(returnRate);
  }

  return {
    trajectory,
    success: portfolio > 0,
    depletionAge,
    portfolioAtDeath: Math.max(0, portfolio),
  };
}

/**
 * Calculate pension income for a given age
 */
function calculatePensionIncome(age: number, pensions: PensionSchedule[]): number {
  let income = 0;

  for (const pension of pensions) {
    if (age >= pension.startAge) {
      const yearsIntoRetirement = age - pension.startAge;
      const inflationFactor = pension.inflationAdjusted
        ? Math.pow(1 + pension.inflationRate, yearsIntoRetirement)
        : 1;
      income += pension.monthlyAmount * inflationFactor;
    }
  }

  return income;
}

/**
 * Calculate withdrawal based on strategy
 */
function calculateWithdrawal(
  strategy: WithdrawalStrategy,
  currentPortfolio: number,
  initialPortfolio: number,
  yearsIntoRetirement: number,
  baseMonthlyExpenses: number
): number {
  switch (strategy.type) {
    case '4percent':
      // 4% of initial portfolio, inflation-adjusted
      const inflationFactor = strategy.inflationAdjusted
        ? Math.pow(1.03, yearsIntoRetirement) // Assuming 3% inflation
        : 1;
      return (initialPortfolio * strategy.rate) / 12 * inflationFactor;

    case 'variable':
      // X% of current portfolio
      return (currentPortfolio * strategy.percentageOfPortfolio) / 12;

    case 'guardrails':
      // Check if portfolio crossed guardrails
      const portfolioRatio = currentPortfolio / initialPortfolio;
      let adjustment = 1.0;

      if (portfolioRatio > strategy.upperGuardrail) {
        adjustment = 1 + strategy.adjustmentPercent;
      } else if (portfolioRatio < strategy.lowerGuardrail) {
        adjustment = 1 - strategy.adjustmentPercent;
      }

      return strategy.baseWithdrawal * adjustment;

    case 'custom':
      return strategy.yearlyWithdrawals[yearsIntoRetirement] / 12;

    default:
      return baseMonthlyExpenses;
  }
}

/**
 * Aggregate scenarios into results
 */
function aggregateScenarios(scenarios: Scenario[], config: SimulationConfig): SimulationResults {
  const successCount = scenarios.filter(s => s.success).length;
  const successProbability = successCount / scenarios.length;

  // Calculate percentiles
  const trajectories = calculatePercentileTrajectories(scenarios);

  // Analyze failures
  const depletionAges = scenarios
    .filter(s => !s.success && s.depletionAge !== null)
    .map(s => s.depletionAge as number)
    .sort((a, b) => a - b);

  const medianDepletionAge = depletionAges.length > 0
    ? depletionAges[Math.floor(depletionAges.length / 2)]
    : null;

  // Portfolio at death
  const portfoliosAtDeath = scenarios.map(s => s.portfolioAtDeath).sort((a, b) => a - b);
  const portfolioAtDeathMedian = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length / 2)];
  const portfolioAtDeath25th = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length * 0.25)];
  const portfolioAtDeath75th = portfoliosAtDeath[Math.floor(portfoliosAtDeath.length * 0.75)];

  // Flexibility analysis
  const flexibility = analyzeFlexibility(config, scenarios, successProbability);

  return {
    successProbability,
    successCount,
    failureCount: scenarios.length - successCount,
    trajectories,
    depletionAges,
    medianDepletionAge,
    portfolioAtDeathMedian,
    portfolioAtDeath25th,
    portfolioAtDeath75th,
    flexibility,
    simulationConfig: config,
    runDate: new Date(),
    computeTime: 0, // Set by caller
  };
}

/**
 * Calculate percentile trajectories
 */
function calculatePercentileTrajectories(scenarios: Scenario[]): {
  median: Trajectory;
  percentile25: Trajectory;
  percentile75: Trajectory;
  percentile5: Trajectory;
  percentile95: Trajectory;
} {
  // Group by age, calculate percentiles for each age
  const ageGroups: Map<number, number[]> = new Map();

  for (const scenario of scenarios) {
    for (let i = 0; i < scenario.trajectory.ages.length; i++) {
      const age = scenario.trajectory.ages[i];
      const balance = scenario.trajectory.portfolioBalances[i];

      if (!ageGroups.has(age)) {
        ageGroups.set(age, []);
      }
      ageGroups.get(age)!.push(balance);
    }
  }

  // Calculate percentiles for each age
  const ages = Array.from(ageGroups.keys()).sort((a, b) => a - b);
  const median: Trajectory = { ages: [], portfolioBalances: [], withdrawals: [], pensionIncomes: [], returns: [] };
  const percentile25: Trajectory = { ages: [], portfolioBalances: [], withdrawals: [], pensionIncomes: [], returns: [] };
  const percentile75: Trajectory = { ages: [], portfolioBalances: [], withdrawals: [], pensionIncomes: [], returns: [] };
  const percentile5: Trajectory = { ages: [], portfolioBalances: [], withdrawals: [], pensionIncomes: [], returns: [] };
  const percentile95: Trajectory = { ages: [], portfolioBalances: [], withdrawals: [], pensionIncomes: [], returns: [] };

  for (const age of ages) {
    const balances = ageGroups.get(age)!.sort((a, b) => a - b);

    median.ages.push(age);
    median.portfolioBalances.push(balances[Math.floor(balances.length * 0.50)]);

    percentile25.ages.push(age);
    percentile25.portfolioBalances.push(balances[Math.floor(balances.length * 0.25)]);

    percentile75.ages.push(age);
    percentile75.portfolioBalances.push(balances[Math.floor(balances.length * 0.75)]);

    percentile5.ages.push(age);
    percentile5.portfolioBalances.push(balances[Math.floor(balances.length * 0.05)]);

    percentile95.ages.push(age);
    percentile95.portfolioBalances.push(balances[Math.floor(balances.length * 0.95)]);
  }

  return { median, percentile25, percentile75, percentile5, percentile95 };
}
```

### 5.2 Flexibility Analysis

```typescript
/**
 * Analyze retirement flexibility
 */
function analyzeFlexibility(
  config: SimulationConfig,
  scenarios: Scenario[],
  currentSuccessRate: number
): FlexibilityAnalysis {
  // Years of buffer: How many years earlier retirement is possible with >80% success
  const yearsOfBuffer = calculateYearsOfBuffer(config, currentSuccessRate);

  // Additional years needed: If success rate < 80%, how many more years to work
  const additionalYearsNeeded = currentSuccessRate < 0.80
    ? calculateAdditionalYearsNeeded(config, currentSuccessRate)
    : 0;

  // Spending flexibility: How much expenses can increase
  const spendingIncreaseCapacity = calculateSpendingFlexibility(config, scenarios, 'increase');
  const spendingDecreaseNeeded = currentSuccessRate < 0.80
    ? calculateSpendingFlexibility(config, scenarios, 'decrease')
    : 0;

  // Sensitivity analysis
  const sensitivity = {
    returnRatePlus1: estimateSuccessRateWithReturnChange(config, +0.01),
    returnRateMinus1: estimateSuccessRateWithReturnChange(config, -0.01),
    inflationPlus0_5: estimateSuccessRateWithInflationChange(config, +0.005),
    inflationMinus0_5: estimateSuccessRateWithInflationChange(config, -0.005),
    lifeExpectancyPlus5: estimateSuccessRateWithLifeExpectancyChange(config, +5),
    lifeExpectancyMinus5: estimateSuccessRateWithLifeExpectancyChange(config, -5),
  };

  // Recommendation
  const recommendation = generateRecommendation(config, currentSuccessRate, yearsOfBuffer, additionalYearsNeeded);

  return {
    yearsOfBuffer,
    additionalYearsNeeded,
    spendingIncreaseCapacity,
    spendingDecreaseNeeded,
    sensitivity,
    recommendation,
  };
}

/**
 * Calculate years of buffer
 */
function calculateYearsOfBuffer(config: SimulationConfig, currentSuccessRate: number): number {
  if (currentSuccessRate < 0.80) return 0;

  // Binary search for earliest retirement age with >80% success
  // (Simplified - actual implementation would run simulations)
  const targetSuccessRate = 0.80;
  let buffer = 0;

  while (buffer < 10 && estimateSuccessRateWithRetirementChange(config, -buffer - 1) >= targetSuccessRate) {
    buffer++;
  }

  return buffer;
}

/**
 * Calculate additional years needed to reach 80% success
 */
function calculateAdditionalYearsNeeded(config: SimulationConfig, currentSuccessRate: number): number {
  const targetSuccessRate = 0.80;
  let yearsNeeded = 0;

  while (yearsNeeded < 15 && estimateSuccessRateWithRetirementChange(config, yearsNeeded + 1) < targetSuccessRate) {
    yearsNeeded++;
  }

  return yearsNeeded;
}

/**
 * Generate recommendation
 */
function generateRecommendation(
  config: SimulationConfig,
  successRate: number,
  buffer: number,
  yearsNeeded: number
): FlexibilityAnalysis['recommendation'] {
  if (successRate >= 0.90) {
    return {
      retirementDate: new Date(config.retirementDate),
      reasoning: `Með ${Math.round(successRate * 100)}% árangurshlutfall hefurðu mjög örugga áætlun. Þú gætir hugsanlega farið í eftirlaun ${buffer} árum fyrr.`,
      confidence: 'high',
    };
  } else if (successRate >= 0.80) {
    return {
      retirementDate: new Date(config.retirementDate),
      reasoning: `Með ${Math.round(successRate * 100)}% árangurshlutfall hefurðu ásættanlega áætlun. Íhugaðu örlítinn varasjóð eða sveigjanleika í útgjöldum.`,
      confidence: 'medium',
    };
  } else {
    const adjustedDate = new Date(config.retirementDate);
    adjustedDate.setFullYear(adjustedDate.getFullYear() + yearsNeeded);

    return {
      retirementDate: adjustedDate,
      reasoning: `Með ${Math.round(successRate * 100)}% árangurshlutfall er hætta á að eignir klárast. Mælt er með að vinna ${yearsNeeded} ár lengur eða minnka útgjöld.`,
      confidence: 'low',
    };
  }
}
```

### 5.3 Deterministic Projection

```typescript
/**
 * Simple deterministic projection (no randomness)
 */
export function calculateDeterministicProjection(
  config: SimulationConfig
): Trajectory {
  let portfolio = config.currentPortfolio;
  const trajectory: Trajectory = {
    ages: [],
    portfolioBalances: [],
    withdrawals: [],
    pensionIncomes: [],
    returns: [],
  };

  // Accumulation phase
  for (let age = config.currentAge; age < config.retirementAge; age++) {
    portfolio *= (1 + config.expectedReturn);
    portfolio += config.monthlySavings * 12;

    trajectory.ages.push(age);
    trajectory.portfolioBalances.push(portfolio);
    trajectory.withdrawals.push(0);
    trajectory.pensionIncomes.push(0);
    trajectory.returns.push(config.expectedReturn);
  }

  // Withdrawal phase
  const initialPortfolio = portfolio;

  for (let age = config.retirementAge; age <= config.lifeExpectancy; age++) {
    portfolio *= (1 + config.expectedReturn);

    const pensionIncome = calculatePensionIncome(age, config.pensionIncomes);
    portfolio += pensionIncome * 12;

    const withdrawal = calculateWithdrawal(
      config.withdrawalStrategy,
      portfolio,
      initialPortfolio,
      age - config.retirementAge,
      config.monthlyExpenses
    );

    portfolio -= withdrawal * 12;

    trajectory.ages.push(age);
    trajectory.portfolioBalances.push(Math.max(0, portfolio));
    trajectory.withdrawals.push(withdrawal);
    trajectory.pensionIncomes.push(pensionIncome);
    trajectory.returns.push(config.expectedReturn);
  }

  return trajectory;
}
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

```typescript
// In RetirementSimulatorCalculator
const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();

// Auto-populate expenses if baseline exists
useEffect(() => {
  if (hasExpenseBaseline() && !retirementSimulation?.expenses.monthlyExpenses) {
    const tier = 'comfortable'; // Default tier
    const monthlyExpenses = getExpenseByTier(tier);

    updateRetirementSimulation({
      expenses: {
        source: 'baseline',
        baselineTier: tier,
        monthlyExpenses,
        retirementAdjustment: 1.0,
      },
    });
  }
}, [expenseBaseline]);
```

### 6.2 Integration with Actual Hourly Wage Calculator

```typescript
// In ResultsSummaryPanel
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// Display life energy impact
{actualHourlyWage && simulationResults && (
  <LifeEnergyImpactCard
    yearsGained={retirementAge - currentAge}
    hourlyWage={actualHourlyWage}
    additionalWorkNeeded={simulationResults.flexibility.additionalYearsNeeded}
  />
)}
```

### 6.3 Integration with Other Calculators

```typescript
// Other calculators can reference retirement simulation
const { retirementSimulation, simulationResults } = useCalculator();

// Example: FI Number calculator shows retirement date impact
{simulationResults && (
  <Alert variant="info">
    Based on your retirement simulation, your FI Number should be {formatCurrency(fiNumber)}.
    Success rate: {Math.round(simulationResults.successProbability * 100)}%
  </Alert>
)}
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateRetirementSimulation = (simulation: RetirementSimulation): ValidationResult => {
  // Check retirement date is in future
  if (simulation.retirementDate <= new Date()) {
    return { valid: false, error: 'Eftirlaunadagsetning verður að vera í framtíðinni' };
  }

  // Check current age is reasonable
  if (simulation.currentAge < 18 || simulation.currentAge > 100) {
    return { valid: false, error: 'Aldur verður að vera á milli 18 og 100 ára' };
  }

  // Check life expectancy is after retirement
  const retirementAge = simulation.currentAge +
    Math.floor((simulation.retirementDate.getTime() - new Date().getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  if (simulation.lifeExpectancy <= retirementAge) {
    return { valid: false, error: 'Lífslíkur verða að vera eftir eftirlaunaaldur' };
  }

  // Check portfolio is non-negative
  if (simulation.portfolio.currentBalance < 0) {
    return { valid: false, error: 'Safnstaða getur ekki verið neikvæð' };
  }

  // Warn if expected return is unrealistic
  if (simulation.portfolio.expectedRealReturn > 0.12 || simulation.portfolio.expectedRealReturn < 0) {
    return {
      valid: true,
      warning: 'Vænt ávöxtun virðist óraunhæf. Dæmigerð raun ávöxtun er 5-9%.',
    };
  }

  return { valid: true };
};
```

### 7.2 Simulation Errors

```typescript
try {
  const results = await runSimulation();
  setSimulationResults(results);
} catch (error) {
  console.error('Simulation failed:', error);

  if (error instanceof WorkerError) {
    showToast({
      type: 'error',
      message: 'Hermingin mistókst. Vinsamlegast athugaðu inntök og reyndu aftur.',
    });
  } else {
    showToast({
      type: 'error',
      message: 'Óvænt villa kom upp. Vinsamlegast endurræstu vafrann.',
    });
  }
}
```

### 7.3 Web Worker Timeout

```typescript
const runSimulationWithTimeout = (config: SimulationConfig, timeout: number = 30000): Promise<SimulationResults> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/monteCarloWorker.ts', import.meta.url));

    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('Simulation timed out after 30 seconds'));
    }, timeout);

    worker.onmessage = (e) => {
      if (e.data.type === 'SIMULATION_COMPLETE') {
        clearTimeout(timeoutId);
        worker.terminate();
        resolve(e.data.results);
      } else if (e.data.type === 'SIMULATION_PROGRESS') {
        setSimulationProgress(e.data.progress);
      }
    };

    worker.onerror = (error) => {
      clearTimeout(timeoutId);
      worker.terminate();
      reject(error);
    };

    worker.postMessage({ type: 'RUN_SIMULATION', config });
  });
};
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Main Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Eftirlaunadagsetningarhermir                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Inntök (Input Panel)                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │ Dagsetning  │  │ Safn        │  │ Útgjöld     │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Lífeyrir    │  │ Aðferð      │  [Keyra hermi]  │   │
│  │  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Árangurshlutfall: 87%  ✓ Gott                      │   │
│  │  ████████████████████░░░░░░░░░░                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Framtíðarspá safns                                 │   │
│  │                                                     │   │
│  │         ╱‾‾‾‾‾‾‾‾╲                                   │   │
│  │      ╱‾‾          ‾‾╲                                │   │
│  │   ╱‾‾                ‾‾╲___                          │   │
│  │  ─────────────────────────────────                  │   │
│  │  60    65    70    75    80    85    90             │   │
│  │  Aldur                                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────┬────────────┬────────────┬────────────┐    │
│  │ Miðgildi   │ Versta     │ Árabil í   │ Sveigjanl. │    │
│  │ við dauða  │ tilviki    │ varasjóði  │ í útgjöld. │    │
│  │ 15.2M kr   │ Klárast 82 │ +2 ár      │ +18%       │    │
│  └────────────┴────────────┴────────────┴────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Success Probability Display

**Color-Coded Indicators:**
```typescript
const getSuccessRateColor = (rate: number) => {
  if (rate >= 0.90) return { bg: 'bg-green-100', text: 'text-green-800', label: 'Framúrskarandi' };
  if (rate >= 0.80) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Gott' };
  if (rate >= 0.70) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ásættanlegt' };
  if (rate >= 0.60) return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Áhættusamt' };
  return { bg: 'bg-red-100', text: 'text-red-800', label: 'Háhætta' };
};
```

**Visual Gauge:**
```
┌─────────────────────────────────────────────┐
│  Árangurshlutfall                           │
│                                             │
│              87%                            │
│         ╱╲  ✓ Gott  ╱╲                      │
│        ◀───────────▶                        │
│    0%   50%   80%   90%   100%              │
│    └────┴────┴────┴────┴────┘              │
│    Háhætta  │  Ásætt.  │  Framúrskarandi   │
└─────────────────────────────────────────────┘
```

### 8.3 Responsive Breakpoints

**Mobile (<640px):**
- Input sections stacked vertically
- Chart full-width, scrollable on Y-axis if needed
- Metrics grid: 2 columns

**Tablet (640px-1024px):**
- Input sections: 2 columns
- Chart full-width
- Metrics grid: 4 columns

**Desktop (>1024px):**
- Input panel: Sidebar (left, 30% width)
- Results panel: Main area (right, 70% width)
- Chart expanded with better tooltips

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `monteCarloWorker.test.ts` - Simulation engine
- `retirementCalculations.test.ts` - Calculation functions
- `RetirementSimulatorCalculator.test.tsx` - Main component
- `PortfolioProjectionChart.test.tsx` - Chart component

**Test Coverage:**

```typescript
// monteCarloWorker.test.ts
describe('Monte Carlo Simulation', () => {
  it('generates correct number of scenarios', () => {
    const config = createMockConfig({ scenarioCount: 100 });
    const results = runMonteCarloSimulation(config);
    expect(results.successCount + results.failureCount).toBe(100);
  });

  it('calculates success probability correctly', () => {
    // Test with scenarios that should succeed
    const config = createMockConfig({
      currentPortfolio: 10000000,
      monthlyExpenses: 100000,
      expectedReturn: 0.07,
    });
    const results = runMonteCarloSimulation(config);
    expect(results.successProbability).toBeGreaterThan(0.90);
  });

  it('handles portfolio depletion', () => {
    // Test with insufficient portfolio
    const config = createMockConfig({
      currentPortfolio: 1000000,
      monthlyExpenses: 200000,
      expectedReturn: 0.03,
    });
    const results = runMonteCarloSimulation(config);
    expect(results.successProbability).toBeLessThan(0.20);
    expect(results.depletionAges.length).toBeGreaterThan(0);
  });

  it('incorporates pension income correctly', () => {
    const config = createMockConfig({
      pensionIncomes: [
        { startAge: 67, monthlyAmount: 200000, inflationAdjusted: true }
      ],
    });
    const results = runMonteCarloSimulation(config);
    // Success rate should improve with pension
    expect(results.successProbability).toBeGreaterThan(0.80);
  });
});

describe('Withdrawal Strategies', () => {
  it('4% rule withdraws correct amount', () => {
    const withdrawal = calculateWithdrawal(
      { type: '4percent', rate: 0.04, inflationAdjusted: false },
      10000000,
      10000000,
      0,
      0
    );
    expect(withdrawal).toBeCloseTo(10000000 * 0.04 / 12);
  });

  it('variable spending adjusts to portfolio', () => {
    const strategy: VariableSpending = { type: 'variable', percentageOfPortfolio: 0.04 };

    const withdrawal1 = calculateWithdrawal(strategy, 10000000, 10000000, 0, 0);
    const withdrawal2 = calculateWithdrawal(strategy, 5000000, 10000000, 1, 0);

    expect(withdrawal2).toBeLessThan(withdrawal1);
  });
});
```

### 9.2 Integration Testing

```typescript
describe('Retirement Simulator Integration', () => {
  it('runs full simulation from input to results', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateRetirementSimulation({
        retirementDate: new Date('2030-01-01'),
        currentAge: 35,
        portfolio: {
          currentBalance: 5000000,
          monthlySavings: 200000,
          expectedRealReturn: 0.07,
          inflationRate: 0.03,
          returnVolatility: 0.18,
        },
        expenses: {
          source: 'manual',
          monthlyExpenses: 300000,
          retirementAdjustment: 1.0,
        },
        // ...
      });
    });

    await act(async () => {
      await result.current.runSimulation();
    });

    expect(result.current.simulationResults).not.toBeNull();
    expect(result.current.simulationResults!.successProbability).toBeGreaterThan(0);
  });

  it('integrates with expense baseline', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up expense baseline
    act(() => {
      result.current.updateExpenseBaseline({
        wizardCompleted: true,
        categories: DEFAULT_EXPENSE_CATEGORIES.map(c => ({
          ...c,
          values: c.defaults,
          isCustom: false,
          isHidden: false,
          order: 0,
        })),
      });
    });

    // Retirement simulator should auto-populate expenses
    act(() => {
      result.current.updateRetirementSimulation({
        expenses: {
          source: 'baseline',
          baselineTier: 'comfortable',
        },
      });
    });

    const monthlyExpenses = result.current.getExpenseByTier('comfortable');
    expect(result.current.retirementSimulation!.expenses.monthlyExpenses).toBe(monthlyExpenses);
  });
});
```

### 9.3 Performance Testing

```typescript
describe('Performance', () => {
  it('completes 1,000 scenarios in < 2 seconds', async () => {
    const config = createMockConfig({ scenarioCount: 1000 });

    const startTime = Date.now();
    const results = await runMonteCarloSimulation(config);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(2000);
  });

  it('completes 5,000 scenarios in < 5 seconds', async () => {
    const config = createMockConfig({ scenarioCount: 5000 });

    const startTime = Date.now();
    const results = await runMonteCarloSimulation(config);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000);
  });
});
```

---

## 10. Performance Considerations

### 10.1 Web Worker Optimization

```typescript
// Use Web Workers for Monte Carlo to prevent UI blocking
const worker = useMemo(() => {
  return new Worker(new URL('../workers/monteCarloWorker.ts', import.meta.url));
}, []);

useEffect(() => {
  worker.onmessage = (e) => {
    if (e.data.type === 'SIMULATION_COMPLETE') {
      setSimulationResults(e.data.results);
      setIsSimulationRunning(false);
    } else if (e.data.type === 'SIMULATION_PROGRESS') {
      setSimulationProgress(e.data.progress);
    }
  };

  return () => worker.terminate();
}, [worker]);
```

### 10.2 Chart Rendering Optimization

```typescript
// Memoize chart data to prevent unnecessary re-renders
const chartData = useMemo(() => {
  if (!simulationResults) return null;

  return {
    labels: simulationResults.trajectories.median.ages,
    datasets: [
      {
        label: 'Miðgildi',
        data: simulationResults.trajectories.median.portfolioBalances,
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 3,
      },
      // ... percentile bands
    ],
  };
}, [simulationResults]);

// Use Chart.js with decimation plugin for large datasets
const chartOptions = {
  plugins: {
    decimation: {
      enabled: true,
      algorithm: 'lttb',
      samples: 100,
    },
  },
};
```

### 10.3 Caching Strategy

```typescript
// Cache recent simulation results to avoid re-running
const simulationCache = useRef<Map<string, SimulationResults>>(new Map());

const getCacheKey = (simulation: RetirementSimulation): string => {
  return JSON.stringify({
    retirementDate: simulation.retirementDate.toISOString(),
    currentAge: simulation.currentAge,
    portfolio: simulation.portfolio,
    expenses: simulation.expenses,
    // ... other relevant fields
  });
};

const runSimulationWithCache = async () => {
  const cacheKey = getCacheKey(retirementSimulation);

  if (simulationCache.current.has(cacheKey)) {
    setSimulationResults(simulationCache.current.get(cacheKey)!);
    return;
  }

  const results = await runSimulation();
  simulationCache.current.set(cacheKey, results);
  setSimulationResults(results);
};
```

---

## 11. Accessibility Implementation

### 11.1 Chart Accessibility

```typescript
// Provide table alternative for chart data
<div>
  <PortfolioProjectionChart results={simulationResults} />

  <details className="sr-only">
    <summary>Gögn í töfluformi</summary>
    <table>
      <thead>
        <tr>
          <th>Aldur</th>
          <th>Safnstaða (miðgildi)</th>
          <th>Úttektir</th>
          <th>Lífeyrir</th>
        </tr>
      </thead>
      <tbody>
        {simulationResults.trajectories.median.ages.map((age, i) => (
          <tr key={age}>
            <td>{age}</td>
            <td>{formatCurrency(simulationResults.trajectories.median.portfolioBalances[i])}</td>
            <td>{formatCurrency(simulationResults.trajectories.median.withdrawals[i])}</td>
            <td>{formatCurrency(simulationResults.trajectories.median.pensionIncomes[i])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </details>
</div>

// ARIA labels for success rate
<div
  role="status"
  aria-live="polite"
  aria-label={`Árangurshlutfall: ${Math.round(simulationResults.successProbability * 100)} prósent`}
>
  <SuccessRateDisplay rate={simulationResults.successProbability} />
</div>
```

### 11.2 Keyboard Navigation

```typescript
// Retirement date slider keyboard accessible
<input
  type="range"
  min={currentAge + 1}
  max={currentAge + 40}
  value={retirementAge}
  onChange={(e) => updateRetirementAge(Number(e.target.value))}
  aria-label="Eftirlaunaaldur"
  aria-valuetext={`${retirementAge} ára`}
/>

// Tab navigation through input sections
<div role="form" aria-label="Inntök fyrir eftirlaun">
  <section aria-labelledby="retirement-date-heading">
    <h3 id="retirement-date-heading">Eftirlaunadagsetning</h3>
    {/* inputs */}
  </section>

  <section aria-labelledby="portfolio-heading">
    <h3 id="portfolio-heading">Safn og sparnaður</h3>
    {/* inputs */}
  </section>

  {/* more sections */}
</div>
```

---

## 12. Localization (Icelandic)

### 12.1 Text Content

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'Eftirlaunadagsetningarhermir',
  subtitle: 'Sjáðu hvernig mismunandi eftirlaunadagsetningar hafa áhrif á fjárhagslegt öryggi',

  // Input labels
  inputs: {
    retirementDate: 'Eftirlaunadagsetning',
    currentAge: 'Núverandi aldur',
    lifeExpectancy: 'Lífslíkur',
    currentBalance: 'Núverandi safnstaða',
    monthlySavings: 'Mánaðarlegur sparnaður',
    expectedReturn: 'Vænt ávöxtun (raun)',
    inflationRate: 'Verðbólga',
    monthlyExpenses: 'Mánaðarleg útgjöld',
    retirementAdjustment: 'Útgjaldaaðlögun við eftirlaun',
  },

  // Pension inputs
  pensions: {
    lifeyrissjodur: 'Lífeyrissjóður',
    lifeyrissjodurStartAge: 'Byrjunaaldur (venjulega 60)',
    lifeyrissjodurAmount: 'Mánaðarleg upphæð',
    ellilifeyrir: 'Ellilífeyrir',
    ellilífeyriStartAge: 'Byrjunaaldur (venjulega 67)',
    ellilífeyriAmount: 'Mánaðarleg upphæð',
    useEstimate: 'Nota áætlun',
  },

  // Withdrawal strategies
  withdrawalStrategies: {
    fourPercent: '4% reglan',
    fourPercentDescription: 'Fasta prósentutaka (verðtryggð)',
    variableSpending: 'Breytileg útgjöld',
    variableSpendingDescription: 'Aðlaga úttektir eftir afkomu safns',
    guardrails: 'Girðingar',
    guardrailsDescription: 'Auka/minnka útgjöld eftir viðmiðunarmörkum',
    custom: 'Sérsniðið',
    customDescription: 'Skilgreina eigin úttektarmynstur',
  },

  // Results
  results: {
    successProbability: 'Árangurshlutfall',
    successLabels: {
      excellent: 'Framúrskarandi',
      good: 'Gott',
      acceptable: 'Ásættanlegt',
      risky: 'Áhættusamt',
      highRisk: 'Háhætta',
    },
    medianAtDeath: 'Miðgildi safns við dauða',
    worstCase: 'Versta tilviki',
    portfolioDepletes: 'Safn klárast',
    buffer: 'Árabil í varasjóði',
    earlierRetirement: 'Getur farið í eftirlaun {years} árum fyrr',
    additionalYearsNeeded: 'Þarf að vinna {years} ár lengur',
    spendingFlexibility: 'Sveigjanleiki í útgjöldum',
    canIncrease: 'Getur aukið útgjöld um {percent}%',
    shouldDecrease: 'Ætti að minnka útgjöld um {percent}%',
  },

  // Life energy
  lifeEnergy: {
    yearsGained: 'Ár lífsorku aflað',
    additionalWorkNeeded: 'Viðbótarvinnustundir nauðsynlegar',
  },

  // Actions
  actions: {
    runSimulation: 'Keyra hermi',
    compareScenarios: 'Bera saman aðstæður',
    exportResults: 'Flytja út niðurstöður',
    resetInputs: 'Núllstilla inntök',
  },

  // Explanations
  explanations: {
    monteCarlo: 'Monte Carlo hermi keyrir þúsundir aðstæðna með tilviljunarkenndum markaðsávöxtunum til að meta útkomur.',
    successProbability: 'Hlutfall aðstæðna þar sem safnið endist til lífslíkna.',
    sequenceRisk: 'Lélegar ávöxtanir snemma á starfslokum geta skaðað langtíma sjálfbærni safnsins.',
  },
};
```

---

## 13. Technical Decisions

### 13.1 Web Workers for Monte Carlo

**Decision**: Run Monte Carlo simulations in Web Worker

**Rationale**:
- Prevents UI blocking during intensive calculations
- 1,000+ scenarios can take 1-2 seconds
- Better user experience with progress updates
- Allows UI to remain responsive

**Trade-offs**:
- Slightly more complex code (worker communication)
- Cannot access DOM from worker
- Data serialization overhead (minimal for this use case)

### 13.2 Monte Carlo vs Deterministic

**Decision**: Offer both Monte Carlo (default) and deterministic projection

**Rationale**:
- Monte Carlo: More realistic, accounts for uncertainty
- Deterministic: Faster, easier to understand for beginners
- Some users prefer "average case" projection
- Deterministic useful for quick "what-if" scenarios

**Implementation**:
- Monte Carlo: Run 1,000-5,000 scenarios with random returns
- Deterministic: Single projection with expected return

### 13.3 Percentile Bands vs Individual Scenarios

**Decision**: Display percentile bands (25th-75th, 5th-95th) instead of individual scenarios

**Rationale**:
- Clearer visualization (avoid spaghetti chart)
- Communicates uncertainty effectively
- Industry standard for retirement projections
- Easier to interpret success/failure ranges

### 13.4 Icelandic Pension Integration

**Decision**: Optional inputs for lífeyrissjóður and ellilífeyrir with typical estimates

**Rationale**:
- Most Icelanders have pension income
- Pension significantly improves success rates
- Providing typical estimates reduces friction
- Optional to accommodate edge cases

---

## 14. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Compare Retirement Dates | RetirementDateSlider, ComparisonModePanel | Slider adjusts date, comparison shows side-by-side |
| **US-2**: Monte Carlo Success Probability | MonteCarloWorker, SuccessProbabilityCard | 1,000+ scenarios, aggregate success rate |
| **US-3**: Icelandic Pension Integration | IcelandicPensionInput, calculatePensionIncome() | Optional inputs at age 60/67, inflation-adjusted |
| **US-4**: Withdrawal Strategy Impact | WithdrawalStrategySelector, calculateWithdrawal() | 4% rule, variable, guardrails, custom |
| **US-5**: Portfolio Projections | PortfolioProjectionChart | Line chart with percentile bands |
| **US-6**: Flexibility Analysis | FlexibilityAnalysisPanel, analyzeFlexibility() | Buffer, additional years, spending flexibility |
| **FR-1**: Retirement Date Input | RetirementDateInput | Date picker + slider |
| **FR-2**: Portfolio Input | PortfolioInput | Current balance, savings, return, inflation |
| **FR-3**: Expense Input | ExpenseInput | Pull from baseline or manual |
| **FR-4**: Icelandic Pension | IcelandicPensionInput | Lífeyrissjóður + ellilífeyrir |
| **FR-5**: Simulation Engine | MonteCarloWorker | 1,000+ scenarios, sequence risk |
| **FR-6**: Withdrawal Strategies | calculateWithdrawal() | 4 strategies implemented |
| **FR-7**: Success Probability | calculateSuccessRate() | % where portfolio > 0 at life expectancy |
| **FR-8**: Portfolio Projections | calculatePercentileTrajectories() | Median, 25th, 75th, 5th, 95th |
| **FR-9**: Flexibility Analysis | analyzeFlexibility() | Buffer, years needed, spending capacity |
| **FR-10**: Comparison Mode | ComparisonModePanel | Side-by-side 2-3 scenarios |
| **FR-11**: Life Energy Integration | LifeEnergyImpactCard | Years gained, additional work needed |

---

## 15. Implementation Risks and Mitigations

### Risk 1: Monte Carlo Performance

**Risk**: 5,000+ scenarios may take too long, frustrating users

**Mitigation**:
- Default to 1,000 scenarios (< 2 seconds)
- Offer 5,000 as "high accuracy" option with warning
- Use Web Workers to keep UI responsive
- Show progress bar during calculation
- Cache recent results

### Risk 2: Complex Inputs Overwhelming Users

**Risk**: Too many inputs may confuse or deter users

**Mitigation**:
- Smart defaults for all inputs
- Progressive disclosure (pension inputs collapsible)
- Integration with Expense Baseline Tool (auto-populate)
- "Quick Start" mode with minimal inputs
- Tooltips and help text throughout

### Risk 3: Misinterpretation of Results

**Risk**: Users may misunderstand success probability or projections

**Mitigation**:
- Clear disclaimers about assumptions
- Visual indicators (color-coded success rates)
- Explanatory text for each metric
- Methodology explainer (collapsible)
- Conservative defaults (e.g., 92 years life expectancy)

### Risk 4: Icelandic Pension Estimates Accuracy

**Risk**: Typical pension estimates may not match user's actual situation

**Mitigation**:
- Make estimates optional (user can input exact amounts)
- Clearly label as "typical" or "average"
- Provide link to official pension calculator
- Disclaimer about variability
- Allow full customization

---

## 16. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed (Monte Carlo algorithm)
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Accessibility implementation planned

### Feasibility
- [x] Uses existing technology stack (React, TypeScript, Web Workers)
- [x] Integrates with existing CalculatorContext
- [x] Follows established patterns
- [x] Performance requirements achievable (< 2 sec for 1,000 scenarios)

### Quality
- [x] Privacy-first design maintained (client-side only)
- [x] Icelandic localization complete
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized (progress bar, caching)

### Integration
- [x] Integrates with Expense Baseline Tool
- [x] Integrates with Actual Hourly Wage Calculator
- [x] Comparison mode designed
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
