# Tasks: Retirement Date Simulator

## Document Information

- **Feature Name**: Retirement Date Simulator (Eftirlaunadagsetningarhermir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-retirement-simulator.md
- **Design**: design-retirement-simulator.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Parallel Feature Development

**Strategy**: Build foundational types and calculation engine first (including Web Worker), then develop UI components and integrations in parallel where possible.

**Rationale**:
- Types and calculation engine are dependencies for all UI work
- Web Worker for Monte Carlo can be developed and tested independently
- Input panel and results panel can be developed in parallel once foundation is complete
- Chart visualization can be built once simulation results structure is defined
- Integration with existing calculators happens toward the end

**Sequence**:
1. Foundation: Types, constants, calculation functions
2. Simulation Engine: Monte Carlo Web Worker, deterministic projection
3. State Management: CalculatorContext integration
4. Input UI: All input panels (can parallelize with results UI)
5. Results UI: Success rate, portfolio chart, flexibility analysis
6. Integration: Expense Baseline, Actual Hourly Wage, comparison mode
7. Polish: Accessibility, testing, educational content

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-10 hours each)
- **Tasks**: Specific, actionable work items (2-6 hours each)

**Dependency Management**:
- Epic 1 (Foundation) must complete first
- Epic 2 (Simulation Engine) depends on Epic 1
- Epic 3 (State Management) depends on Epics 1-2
- Epics 4-5 (Input/Results UI) can parallelize after Epic 3
- Epic 6 (Integration) requires Epics 3-5 complete
- Epic 7 (Polish) is final

**Estimated Total Duration**: 50-70 hours

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Core Calculations

**Objective**: Create type definitions, constants, and pure calculation functions (non-Monte Carlo).

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Icelandic pension constants
- Withdrawal strategy calculation functions
- Helper utilities

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for retirement simulation data.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/types/retirementSimulation.ts` (new)

**Functionality**:
```typescript
// Define types for:
- RetirementSimulation (main input type)
- PortfolioInput (portfolio and savings)
- ExpenseInput (expenses with baseline integration)
- IcelandicPensionInput (lífeyrissjóður, ellilífeyrir)
- SimulationAssumptions (scenario count, type, distribution)
- WithdrawalStrategy (4%, variable, guardrails, custom)
- SimulationResults (success rate, trajectories, flexibility)
- Trajectory (ages, balances, withdrawals, pensions)
- FlexibilityAnalysis (buffer, additional years, sensitivity)
- ComparisonScenario (for comparison mode)
```

**Tests**: N/A (types only)

**Requirements Addressed**: All FRs (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors
- [ ] Types support optional fields where appropriate

---

#### Task 1.2: Create Constants and Defaults

**Objective**: Define Icelandic pension constants and default simulation parameters.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/constants/retirementSimulation.ts` (new)

**Functionality**:
```typescript
// Define constants:
- DEFAULT_LIFE_EXPECTANCY: 92
- DEFAULT_EXPECTED_RETURN: 0.07
- DEFAULT_INFLATION_RATE: 0.03
- DEFAULT_RETURN_VOLATILITY: 0.18
- DEFAULT_SCENARIO_COUNT: 1000
- TARGET_SUCCESS_RATE: 0.85

// Icelandic pension milestones
- LIFEYRISSJODUR_AGE: 60
- ELLILIFEYRIR_AGE: 67
- TYPICAL_LIFEYRISSJODUR_MONTHLY: 150000 (ISK)
- TYPICAL_ELLILIFEYRIR_MONTHLY: 200000 (ISK)

// Withdrawal strategy defaults
- DEFAULT_4PERCENT_RATE: 0.04
- DEFAULT_VARIABLE_PERCENTAGE: 0.04
- DEFAULT_GUARDRAIL_UPPER: 1.3
- DEFAULT_GUARDRAIL_LOWER: 0.8

// Success rate thresholds
- SUCCESS_RATE_EXCELLENT: 0.90
- SUCCESS_RATE_GOOD: 0.80
- SUCCESS_RATE_ACCEPTABLE: 0.70
- SUCCESS_RATE_RISKY: 0.60

// Color mappings for success rates (Icelandic labels)
- SUCCESS_RATE_LABELS and COLORS
```

**Tests**: 51 unit tests, all passing
- Location: apps/peninganaedalifid/src/lib/constants/__tests__/retirementSimulator.test.ts

**Requirements Addressed**: NFR-7 (Icelandic context), FR-4 (pension ages)

**Acceptance Criteria**:
- [x] All constants defined with sensible defaults ✅ Completed 2026-01-29
- [x] Icelandic pension ages accurate (60, 67)
- [x] Typical pension amounts realistic for Iceland
- [x] Exportable for use throughout app
  - Implemented: apps/peninganaedalifid/src/lib/constants/retirementSimulator.ts (462 lines)
  - Tests: apps/peninganaedalifid/src/lib/constants/__tests__/retirementSimulator.test.ts (357 lines)
  - Context: context/modules/RetirementSimulatorConstants.md
  - Includes: DEFAULT_SIMULATION_ASSUMPTIONS, ICELANDIC_PENSION_DEFAULTS, WITHDRAWAL_STRATEGY_PRESETS, SUCCESS_RATE_THRESHOLDS/LABELS/COLORS, RETURN_RATE_ASSUMPTIONS, AGE_LIMITS, validation ranges, and 18 helper functions

---

#### Task 1.3: Implement Withdrawal Strategy Calculations

**Objective**: Create functions to calculate withdrawals based on different strategies.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/calculations/withdrawalStrategies.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateFourPercentWithdrawal(
    initialPortfolio: number,
    yearsIntoRetirement: number,
    inflationRate: number
  ): number

- calculateVariableWithdrawal(
    currentPortfolio: number,
    percentage: number
  ): number

- calculateGuardrailWithdrawal(
    currentPortfolio: number,
    initialPortfolio: number,
    baseWithdrawal: number,
    upperGuardrail: number,
    lowerGuardrail: number,
    adjustmentPercent: number
  ): number

- calculateCustomWithdrawal(
    yearlyWithdrawals: number[],
    yearsIntoRetirement: number
  ): number

- calculateWithdrawal(
    strategy: WithdrawalStrategy,
    currentPortfolio: number,
    initialPortfolio: number,
    yearsIntoRetirement: number,
    inflationRate: number
  ): number  // Main dispatcher
```

**Tests**:
- `/tests/lib/calculations/withdrawalStrategies.test.ts` (new)
  - Test 4% rule with inflation adjustment
  - Test variable spending scales with portfolio
  - Test guardrails trigger adjustments correctly
  - Test custom withdrawal sequence

**Requirements Addressed**: FR-6 (withdrawal strategies), US-4

**Acceptance Criteria**:
- [x] All withdrawal strategies implemented ✅
- [x] Pure functions (no side effects) ✅
- [x] 4% rule inflation-adjusts correctly ✅
- [x] Guardrails trigger at correct thresholds ✅
- [x] Unit tests pass with >90% coverage ✅

**Completed**: 2026-01-29
- Implemented: apps/peninganaedalifid/src/lib/calculations/retirementSimulator.ts
- Tests: apps/peninganaedalifid/tests/lib/calculations/retirementSimulator.test.ts (39 tests, all passing)
- Context: context/modules/RetirementSimulatorCalculations.md
- Notes: Implemented all 4 withdrawal strategies (4% rule, variable, guardrails, custom) plus Icelandic pension integration (lífeyrissjóður, ellilífeyrir), helper functions for expense calculations, and prepareSimulationConfig() converter. All functions pure with comprehensive test coverage.

---

#### Task 1.4: Implement Pension Income Calculations

**Objective**: Calculate Icelandic pension income (lífeyrissjóður, ellilífeyrir).

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/pensionIncome.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateLifeyrissjodurIncome(
    age: number,
    startAge: number,
    monthlyAmount: number,
    inflationAdjusted: boolean,
    inflationRate: number,
    yearsIntoRetirement: number
  ): number

- calculateEllilífeyririIncome(
    age: number,
    startAge: number,
    monthlyAmount: number,
    inflationAdjusted: boolean,
    inflationRate: number,
    yearsIntoRetirement: number
  ): number

- calculateTotalPensionIncome(
    age: number,
    pensions: IcelandicPensionInput,
    inflationRate: number,
    yearsIntoRetirement: number
  ): number  // Main function

- estimateTypicalPension(
    age: number,
    pensionType: 'lifeyrissjodur' | 'ellilifeyrir'
  ): number
```

**Tests**:
- `/tests/lib/calculations/pensionIncome.test.ts` (new)
  - Test pension starts at correct age
  - Test inflation adjustment works
  - Test pension does not start before age threshold
  - Test typical estimates return reasonable values

**Requirements Addressed**: FR-4 (Icelandic pension), US-3

**Acceptance Criteria**:
- [ ] Pension starts only when age >= startAge
- [ ] Inflation adjustment applied correctly
- [ ] Typical estimates realistic for Iceland
- [ ] Unit tests pass with >90% coverage

---

### EPIC 2: Simulation Engine - Monte Carlo and Deterministic Projections

**Objective**: Implement Monte Carlo Web Worker and deterministic projection calculations.

**Duration**: 10-12 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Monte Carlo Web Worker
- Random return generation
- Single scenario runner
- Percentile trajectory aggregation
- Deterministic projection function
- Flexibility analysis calculator

---

#### Task 2.1: Set Up Web Worker Infrastructure

**Objective**: Create Web Worker setup for running Monte Carlo simulations.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/workers/monteCarloWorker.ts` (new)
- `/src/hooks/useMonteCarloWorker.ts` (new)

**Functionality**:
```typescript
// Web Worker (monteCarloWorker.ts):
- Message handler for 'RUN_SIMULATION'
- Message handler for 'CANCEL_SIMULATION'
- Progress reporting via postMessage
- Error handling and reporting

// React Hook (useMonteCarloWorker.ts):
- Create and manage worker instance
- Send simulation requests
- Receive progress updates
- Receive results
- Handle errors
- Cleanup on unmount
```

**Tests**:
- `/tests/workers/monteCarloWorker.test.ts` (new)
  - Test worker can be created and terminated
  - Test worker responds to simulation request
  - Test progress messages are sent

**Requirements Addressed**: NFR-1 (performance), FR-5 (simulation engine)

**Acceptance Criteria**:
- [ ] Worker spawns and terminates correctly
- [ ] Messages sent/received properly
- [ ] Progress updates work
- [ ] Error handling implemented
- [ ] Hook manages worker lifecycle

---

#### Task 2.2: Implement Random Return Generation

**Objective**: Generate realistic random market return sequences using lognormal distribution.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/calculations/returnGeneration.ts` (new)
  - Can be used in both worker and main thread

**Functionality**:
```typescript
// Implement functions:
- boxMullerTransform(): number
  // Generate standard normal random variable

- generateLognormalReturn(
    expectedReturn: number,
    volatility: number
  ): number
  // Generate single return using lognormal distribution

- generateReturnSequence(
    years: number,
    expectedReturn: number,
    volatility: number
  ): number[]
  // Generate sequence of returns for entire retirement

- generateHistoricalBootstrap(
    historicalReturns: number[],
    years: number
  ): number[]
  // Alternative: Bootstrap from historical data (optional)
```

**Tests**:
- `/tests/lib/calculations/returnGeneration.test.ts` (new)
  - Test Box-Muller produces standard normal distribution
  - Test lognormal returns have correct mean and volatility
  - Test sequence length matches requested years
  - Test returns are reasonable (not extreme outliers)

**Requirements Addressed**: FR-5.3 (historical/configurable returns), US-2

**Acceptance Criteria**:
- [ ] Box-Muller transform produces correct distribution
- [ ] Lognormal returns have expected statistical properties
- [ ] Return sequences realistic
- [ ] Unit tests verify distribution properties

---

#### Task 2.3: Implement Single Scenario Runner

**Objective**: Run a single retirement scenario with given return sequence.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/scenarioRunner.ts` (new)
  - Can be used in worker or main thread

**Functionality**:
```typescript
// Implement functions:
- runSingleScenario(
    config: SimulationConfig,
    returnSequence: number[]
  ): Scenario
  // Run one scenario with specific returns

// Within runSingleScenario:
// 1. Accumulation phase (current age → retirement age)
//    - Apply returns, add savings
// 2. Withdrawal phase (retirement age → life expectancy)
//    - Apply returns, add pensions, subtract withdrawals
//    - Check for portfolio depletion
// 3. Return trajectory and success/failure

interface Scenario {
  trajectory: Trajectory;
  success: boolean;
  depletionAge: number | null;
  portfolioAtDeath: number;
}
```

**Tests**:
- `/tests/lib/calculations/scenarioRunner.test.ts` (new)
  - Test accumulation phase increases portfolio
  - Test withdrawal phase depletes portfolio over time
  - Test pension income added correctly
  - Test portfolio depletion detected
  - Test success determination correct

**Requirements Addressed**: FR-5 (simulation engine), FR-6 (withdrawals), FR-4 (pensions)

**Acceptance Criteria**:
- [ ] Accumulation phase correct (returns + savings)
- [ ] Withdrawal phase correct (returns + pensions - withdrawals)
- [ ] Depletion age recorded accurately
- [ ] Success/failure determined correctly
- [ ] Unit tests pass with >90% coverage

---

#### Task 2.4: Implement Monte Carlo Aggregation

**Objective**: Run multiple scenarios and aggregate results into percentiles and statistics.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/workers/monteCarloWorker.ts` (modify - add main simulation loop)
- `/src/lib/calculations/resultAggregation.ts` (new)

**Functionality**:
```typescript
// In monteCarloWorker.ts:
- runMonteCarloSimulation(config: SimulationConfig): SimulationResults
  // Main loop: run N scenarios, aggregate, return

// In resultAggregation.ts:
- calculateSuccessRate(scenarios: Scenario[]): number
- calculatePercentileTrajectories(scenarios: Scenario[]): PercentileTrajectories
- calculateDepletionStatistics(scenarios: Scenario[]): DepletionStats
- calculatePortfolioAtDeathStatistics(scenarios: Scenario[]): PortfolioStats
- aggregateResults(scenarios: Scenario[], config: SimulationConfig): SimulationResults
```

**Tests**:
- `/tests/lib/calculations/resultAggregation.test.ts` (new)
  - Test success rate calculation correct
  - Test percentile trajectories calculated correctly
  - Test depletion ages sorted and aggregated
  - Test portfolio at death statistics accurate

**Requirements Addressed**: FR-7 (success probability), FR-8 (portfolio projections)

**Acceptance Criteria**:
- [ ] Success rate calculated correctly
- [ ] Percentiles (5th, 25th, 50th, 75th, 95th) accurate
- [ ] Depletion ages aggregated correctly
- [ ] Portfolio at death statistics correct
- [ ] Unit tests pass with >90% coverage
- [ ] 1,000 scenarios run in < 2 seconds

---

#### Task 2.5: Implement Flexibility Analysis

**Objective**: Analyze retirement flexibility (buffer, additional years, sensitivity).

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/flexibilityAnalysis.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateYearsOfBuffer(
    config: SimulationConfig,
    currentSuccessRate: number
  ): number
  // How many years earlier retirement possible with >80% success

- calculateAdditionalYearsNeeded(
    config: SimulationConfig,
    currentSuccessRate: number
  ): number
  // If success < 80%, how many more years to work

- calculateSpendingFlexibility(
    config: SimulationConfig,
    scenarios: Scenario[],
    direction: 'increase' | 'decrease'
  ): number
  // How much spending can increase/decrease

- calculateSensitivityAnalysis(
    config: SimulationConfig
  ): SensitivityResults
  // Impact of +/- 1% return, +/- 0.5% inflation, +/- 5 years life expectancy

- generateRecommendation(
    config: SimulationConfig,
    successRate: number,
    buffer: number,
    yearsNeeded: number
  ): Recommendation

- analyzeFlexibility(
    config: SimulationConfig,
    scenarios: Scenario[],
    successRate: number
  ): FlexibilityAnalysis
  // Main function combining all analyses
```

**Tests**:
- `/tests/lib/calculations/flexibilityAnalysis.test.ts` (new)
  - Test buffer calculation with high success rate
  - Test additional years needed with low success rate
  - Test spending flexibility estimates reasonable
  - Test recommendation logic correct

**Requirements Addressed**: FR-9 (flexibility analysis), US-6

**Acceptance Criteria**:
- [ ] Buffer calculation correct
- [ ] Additional years calculation correct
- [ ] Sensitivity analysis implemented
- [ ] Recommendation logic sound
- [ ] Unit tests pass with >85% coverage

---

#### Task 2.6: Implement Deterministic Projection

**Objective**: Create simple deterministic projection (no randomness) for quick calculations.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/deterministicProjection.ts` (new)

**Functionality**:
```typescript
// Implement function:
- calculateDeterministicProjection(
    config: SimulationConfig
  ): Trajectory
  // Single projection with expected returns (no randomness)
  // Useful for quick "average case" view
```

**Tests**:
- `/tests/lib/calculations/deterministicProjection.test.ts` (new)
  - Test projection uses expected return consistently
  - Test portfolio grows in accumulation phase
  - Test portfolio depletes in withdrawal phase
  - Test pension income added correctly

**Requirements Addressed**: FR-5.2 (deterministic option)

**Acceptance Criteria**:
- [ ] Projection uses expected return (no randomness)
- [ ] Results consistent with Monte Carlo median
- [ ] Faster than Monte Carlo (< 100ms)
- [ ] Unit tests pass

---

### EPIC 3: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage retirement simulation state and results.

**Duration**: 5-6 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Context state for retirement simulation
- Simulation trigger and results handling
- LocalStorage persistence
- Comparison scenario management

---

#### Task 3.1: Extend CalculatorContext State

**Objective**: Add retirement simulation state to CalculatorContext.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add retirementSimulation to StoredState)

**Functionality**:
```typescript
// Add to context state:
- retirementSimulation: RetirementSimulation | null
- simulationResults: SimulationResults | null
- isSimulationRunning: boolean
- simulationProgress: number  // 0-100

// Add to context type:
- updateRetirementSimulation: (updates: Partial<RetirementSimulation>) => void
- runSimulation: () => Promise<void>
- clearSimulation: () => void

// Comparison mode (optional, can be separate task)
- comparisonScenarios: ComparisonScenario[]
- addComparisonScenario: (name: string) => void
- removeComparisonScenario: (id: string) => void
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: All FRs (state foundation)

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context
- [ ] Running simulation updates isSimulationRunning

---

#### Task 3.2: Implement Simulation Trigger

**Objective**: Connect UI to Monte Carlo worker, handle simulation lifecycle.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// In CalculatorContext:
const runSimulation = useCallback(async () => {
  if (!retirementSimulation) return;

  // Validate inputs
  const validation = validateRetirementSimulation(retirementSimulation);
  if (!validation.valid) {
    showToast({ type: 'error', message: validation.error });
    return;
  }

  setIsSimulationRunning(true);
  setSimulationProgress(0);

  try {
    // Convert to SimulationConfig
    const config = convertToSimulationConfig(retirementSimulation);

    // Run simulation (via worker hook)
    const results = await runMonteCarloSimulation(config);

    setSimulationResults(results);
    showToast({ type: 'success', message: 'Herming tókst' });
  } catch (error) {
    console.error('Simulation failed:', error);
    showToast({ type: 'error', message: 'Herming mistókst' });
  } finally {
    setIsSimulationRunning(false);
  }
}, [retirementSimulation]);
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-5 (trigger simulation)

**Acceptance Criteria**:
- [ ] runSimulation validates inputs
- [ ] Simulation runs via worker
- [ ] Progress updates during simulation
- [ ] Results stored in context
- [ ] Error handling implemented

---

#### Task 3.3: Implement LocalStorage Persistence

**Objective**: Save and load retirement simulation inputs (not results).

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load retirementSimulation on mount
- Auto-save on input changes (debounced 500ms)
- Include in exportData function (JSON export)
- Include in importData function (JSON import)
- Add to resetAll function

// Note: Results NOT persisted (recalculated on demand)
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: NFR-6 (privacy), FR-5

**Acceptance Criteria**:
- [ ] Loads simulation inputs on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Results not saved (privacy)

---

#### Task 3.4: Implement Comparison Mode State

**Objective**: Support multiple comparison scenarios.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Add comparison state:
- comparisonScenarios: ComparisonScenario[]

// Add comparison actions:
- addComparisonScenario(name: string): void
  // Duplicate current simulation, assign ID and name

- removeComparisonScenario(id: string): void
  // Remove scenario from array

- updateComparisonScenario(id: string, updates: Partial<RetirementSimulation>): void
  // Update specific scenario

- runComparisonSimulations(): Promise<void>
  // Run simulations for all comparison scenarios in parallel
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-10 (comparison mode)

**Acceptance Criteria**:
- [ ] Can add up to 3 comparison scenarios
- [ ] Each scenario independent
- [ ] Parallel simulation execution
- [ ] Results stored per scenario

---

### EPIC 4: Input UI - Simulation Input Panels

**Objective**: Build all input panels for collecting simulation parameters.

**Duration**: 10-12 hours

**Dependencies**: Epic 3 complete

**Deliverables**:
- Retirement date input with slider
- Portfolio input panel
- Expense input panel with baseline integration
- Icelandic pension input panel
- Withdrawal strategy selector
- Life expectancy input

---

#### Task 4.1: Create SimulationInputPanel Container

**Objective**: Main container for all input sections.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/SimulationInputPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Layout container for input sections
- Collapsible sections (accordion style)
- Integration with CalculatorContext
- Pass updateRetirementSimulation to child inputs
- Validation status display
- "Run Simulation" button
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-1 to FR-6 (inputs)

**Acceptance Criteria**:
- [ ] All input sections rendered
- [ ] Collapsible sections work
- [ ] Updates flow to context
- [ ] Responsive layout

---

#### Task 4.2: Create RetirementDateInput Component

**Objective**: Input for retirement date/age with slider.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/RetirementDateInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Date picker for retirement date
- OR age input (converted to date)
- Slider for +/- 5 years adjustment
- Display "Years until retirement"
- Display "Years in retirement" (retirement to life expectancy)
- Icelandic labels and formatting
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-1 (retirement date input)

**Acceptance Criteria**:
- [ ] Date picker functional
- [ ] Slider adjusts date/age
- [ ] Years calculations correct
- [ ] Validation (date must be future)
- [ ] Responsive design

---

#### Task 4.3: Create PortfolioInput Component

**Objective**: Input for portfolio balance, savings, return, inflation.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/PortfolioInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Current portfolio balance (CurrencyInput)
- Monthly savings until retirement (CurrencyInput)
- Expected real return (PercentageInput, default 7%)
- Inflation rate (PercentageInput, default 3%)
- Return volatility (PercentageInput, default 18%)
- Tooltips explaining each input
- Icelandic labels
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-2 (portfolio input)

**Acceptance Criteria**:
- [ ] All portfolio inputs functional
- [ ] Default values pre-filled
- [ ] Validation (non-negative, reasonable ranges)
- [ ] Tooltips helpful
- [ ] Responsive design

---

#### Task 4.4: Create ExpenseInput Component with Baseline Integration

**Objective**: Input for expenses with integration to Expense Baseline Tool.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/ExpenseInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Check if Expense Baseline exists (from context)
- If baseline exists:
  - Show TierSelector (Barebones/Comfortable/Deluxe)
  - Auto-populate monthly expenses from selected tier
  - Display breakdown by category (expandable)
- If no baseline:
  - Show manual expense input (CurrencyInput)
  - Prompt to create baseline (link to Expense Baseline Tool)
- Retirement adjustment slider (50%-150%, default 100%)
  - Label: "Adjust expenses for retirement" (e.g., 80% of working expenses)
- Optional: Expense schedule (different phases)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-3 (expense input), integration with Expense Baseline

**Acceptance Criteria**:
- [ ] Auto-detects expense baseline
- [ ] TierSelector integration works
- [ ] Manual input available if no baseline
- [ ] Retirement adjustment functional
- [ ] Link to Expense Baseline Tool if not set
- [ ] Responsive design

---

#### Task 4.5: Create IcelandicPensionInput Component

**Objective**: Input for lífeyrissjóður and ellilífeyrir.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/IcelandicPensionInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section (optional input)
- Lífeyrissjóður section:
  - Toggle enabled/disabled
  - Start age input (default: 60)
  - Monthly amount input (CurrencyInput)
  - Inflation-adjusted toggle (default: true)
  - "Use typical estimate" button (populates default)
- Ellilífeyrir section:
  - Toggle enabled/disabled
  - Start age input (default: 67)
  - Monthly amount input (CurrencyInput)
  - Inflation-adjusted toggle (default: true)
  - "Use typical estimate" button (populates default)
- Explanation tooltip (Icelandic pension system)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-4 (Icelandic pension), US-3

**Acceptance Criteria**:
- [ ] Both pension types supported
- [ ] Toggles enable/disable inputs
- [ ] Typical estimates work
- [ ] Start ages validated (60, 67)
- [ ] Explanation clear
- [ ] Responsive design

---

#### Task 4.6: Create WithdrawalStrategySelector Component

**Objective**: Select and configure withdrawal strategy.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/WithdrawalStrategySelector.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Radio buttons for strategy selection:
  - 4% Rule
  - Variable Spending
  - Guardrails
  - Custom
- Conditional inputs based on selection:
  - 4% Rule: rate input (default 4%), inflation-adjusted toggle
  - Variable: percentage input (default 4%)
  - Guardrails: upper/lower guardrails, base withdrawal, adjustment %
  - Custom: table for yearly withdrawals (advanced)
- Explanation for each strategy
- Icelandic labels
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-6 (withdrawal strategies), US-4

**Acceptance Criteria**:
- [ ] All 4 strategies selectable
- [ ] Conditional inputs render correctly
- [ ] Default values sensible
- [ ] Explanations clear
- [ ] Responsive design

---

#### Task 4.7: Create LifeExpectancyInput and SimulationSettings

**Objective**: Input for life expectancy and simulation parameters.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/retirementSimulator/SimulationSettings.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Life expectancy input (default: 92)
- Simulation type toggle (Monte Carlo / Deterministic)
- Scenario count input (1,000 / 5,000 / 10,000) - if Monte Carlo
- Tooltips for each setting
- Icelandic labels
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-1.4 (life expectancy), FR-5 (simulation type)

**Acceptance Criteria**:
- [ ] Life expectancy input functional
- [ ] Simulation type toggle works
- [ ] Scenario count input visible only for Monte Carlo
- [ ] Validation (reasonable ranges)
- [ ] Responsive design

---

### EPIC 5: Results UI - Success Rate, Portfolio Chart, Flexibility

**Objective**: Build results display panels showing success probability, portfolio projections, and flexibility analysis.

**Duration**: 12-14 hours

**Dependencies**: Epic 3 complete (can parallelize with Epic 4)

**Deliverables**:
- Success probability card with gauge
- Key metrics grid
- Portfolio projection chart (Recharts or Chart.js)
- Flexibility analysis panel
- Life energy impact card (if AWH available)
- Comparison mode display

---

#### Task 5.1: Create ResultsSummaryPanel Container

**Objective**: Container for all results sections.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/retirementSimulator/ResultsSummaryPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Layout container for results
- Conditional rendering (show only if simulationResults exists)
- Loading state (show during simulation)
- Error state (if simulation failed)
- Tabbed sections (Summary / Chart / Flexibility)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: All result FRs

**Acceptance Criteria**:
- [ ] Renders when results available
- [ ] Loading state during simulation
- [ ] Organized layout
- [ ] Responsive design

---

#### Task 5.2: Create SuccessProbabilityCard Component

**Objective**: Display success rate with visual gauge and interpretation.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/SuccessProbabilityCard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Large percentage display (e.g., "87%")
- Color-coded background (green >90%, blue 80-90%, yellow 70-80%, orange 60-70%, red <60%)
- Visual gauge (progress bar or circular gauge)
- Interpretation text:
  - "Framúrskarandi" (Excellent) >90%
  - "Gott" (Good) 80-90%
  - "Ásættanlegt" (Acceptable) 70-80%
  - "Áhættusamt" (Risky) 60-70%
  - "Háhætta" (High Risk) <60%
- Explanation tooltip
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-7 (success probability), US-2

**Acceptance Criteria**:
- [ ] Success rate displayed prominently
- [ ] Color coding correct
- [ ] Gauge visual clear
- [ ] Interpretation helpful
- [ ] Accessible (ARIA labels)

---

#### Task 5.3: Create KeyMetricsGrid Component

**Objective**: Display 4 key metrics in grid layout.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/KeyMetricsGrid.tsx` (new)

**Functionality**:
```typescript
// Component features:
// Four metric cards:
// 1. Median Portfolio at Death
//    - Value in ISK
//    - Life energy hours (if AWH available)
// 2. Worst Case Depletion Age
//    - Age when portfolio depletes (in failure scenarios)
//    - "N/A" if success rate 100%
// 3. Years of Buffer
//    - How many years earlier retirement possible
//    - "+X ár" format
// 4. Spending Flexibility
//    - Percentage spending can increase
//    - "+X%" format

// Grid layout: 4 columns on desktop, 2 on tablet, 1 on mobile
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-7, FR-9 (key metrics)

**Acceptance Criteria**:
- [ ] All 4 metrics display correctly
- [ ] Formatting clear (ISK, percentages)
- [ ] Responsive grid layout
- [ ] Life energy displayed if AWH available

---

#### Task 5.4: Create PortfolioProjectionChart Component

**Objective**: Line chart showing portfolio trajectories over time.

**Duration**: 4 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/PortfolioProjectionChart.tsx` (new)

**Functionality**:
```typescript
// Component features (using Recharts or Chart.js):
// - X-axis: Age (retirement age to life expectancy)
// - Y-axis: Portfolio Balance (ISK)
// - Lines/Areas:
//   - Median trajectory (bold line)
//   - 25th-75th percentile band (shaded area)
//   - 5th percentile (dotted line)
//   - 95th percentile (dotted line)
// - Markers:
//   - Vertical line at age 60 (lífeyrissjóður)
//   - Vertical line at age 67 (ellilífeyrir)
//   - Red dots at portfolio depletion ages (failure scenarios)
// - Interactive tooltip:
//   - Age, median balance, percentile ranges
//   - Withdrawal amount
//   - Pension income
// - Legend explaining lines and areas
// - Responsive design (full-width on mobile)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-8 (portfolio projections), US-5

**Acceptance Criteria**:
- [ ] Chart renders correctly
- [ ] Median and percentile bands displayed
- [ ] Pension markers at age 60, 67
- [ ] Depletion markers for failures
- [ ] Interactive tooltip works
- [ ] Responsive design
- [ ] Accessible (table alternative)

---

#### Task 5.5: Create FlexibilityAnalysisPanel Component

**Objective**: Display flexibility analysis (buffer, sensitivity).

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/FlexibilityAnalysisPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
// - Buffer Analysis Card:
//   - "You can retire X years earlier with 80% success"
//   - OR "You need to work X more years to reach 80% success"
//   - Visual indicator (green/red)
// - Spending Flexibility Card:
//   - "You can increase spending by X% and maintain success rate"
//   - OR "You should decrease spending by X% to improve success rate"
// - Sensitivity Analysis Table:
//   - Rows: Return +1%, Return -1%, Inflation +0.5%, Inflation -0.5%, Life +5yr, Life -5yr
//   - Column: Success Rate impact
//   - Visual: up/down arrows
// - Recommendation Card:
//   - Recommended retirement date
//   - Reasoning text
//   - Confidence level (high/medium/low)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-9 (flexibility analysis), US-6

**Acceptance Criteria**:
- [ ] Buffer analysis clear
- [ ] Spending flexibility displayed
- [ ] Sensitivity table readable
- [ ] Recommendation helpful
- [ ] Responsive design

---

#### Task 5.6: Create LifeEnergyImpactCard Component

**Objective**: Display life energy impact if Actual Hourly Wage available.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/LifeEnergyImpactCard.tsx` (new)

**Functionality**:
```typescript
// Component features:
// - Check if AWH available from context
// - If available, display:
//   - "Years of life gained by retiring at [date]"
//     - Calculate: (current age to retirement age) converted to work hours
//   - "Additional work hours needed to improve success rate"
//     - If success rate < 80%, calculate additional years * work hours/year
// - If not available:
//   - Prompt to calculate AWH
//   - Link to Actual Hourly Wage Calculator
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-11 (life energy integration)

**Acceptance Criteria**:
- [ ] Detects AWH availability
- [ ] Life energy calculations correct
- [ ] Clear display of years/hours gained
- [ ] Prompt to calculate AWH if missing
- [ ] Responsive design

---

#### Task 5.7: Create ComparisonModePanel Component

**Objective**: Side-by-side comparison of multiple scenarios.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/ComparisonModePanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
// - Scenario tabs (Scenario A / B / C)
// - Side-by-side metrics table:
//   - Rows: Retirement Date, Success Rate, Median Portfolio, Buffer, etc.
//   - Columns: Scenario A, B, C
//   - Highlight differences (bold or color)
// - Overlayed portfolio projection chart:
//   - Show median trajectories for all scenarios
//   - Different colors per scenario
//   - Legend
// - Trade-off analysis:
//   - "Retiring 2 years earlier reduces success rate by 8%"
//   - "Working 1 more year increases buffer by 3 years"
// - Add/remove scenario buttons
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: FR-10 (comparison mode), US-1

**Acceptance Criteria**:
- [ ] Up to 3 scenarios supported
- [ ] Metrics table clear
- [ ] Overlayed chart readable
- [ ] Trade-off analysis helpful
- [ ] Responsive design

---

### EPIC 6: Integration and Refinement

**Objective**: Integrate with existing calculators, add polish, handle edge cases.

**Duration**: 6-8 hours

**Dependencies**: Epics 4-5 complete

**Deliverables**:
- Integration with Expense Baseline Tool
- Integration with Actual Hourly Wage Calculator
- Input validation and error handling
- Educational content and tooltips
- Methodology explainer

---

#### Task 6.1: Integrate with Expense Baseline Tool

**Objective**: Auto-populate expenses from Expense Baseline if available.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/ExpenseInput.tsx` (modify)
- `/src/context/CalculatorContext.tsx` (modify if needed)

**Functionality**:
```typescript
// In ExpenseInput component:
useEffect(() => {
  if (hasExpenseBaseline() && !retirementSimulation?.expenses.monthlyExpenses) {
    // Auto-populate from baseline
    const tier = 'comfortable'; // Default
    const monthlyExpenses = getExpenseByTier(tier);

    updateRetirementSimulation({
      expenses: {
        source: 'baseline',
        baselineTier: tier,
        monthlyExpenses,
        retirementAdjustment: 1.0,
      },
    });

    showToast({
      type: 'success',
      message: 'Útgjöld sjálfkrafa fyllt út frá útgjaldagrunni þínum',
    });
  }
}, [expenseBaseline]);

// Display breakdown by category (from baseline)
// Allow switching tiers
// Update simulation when tier changes
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-3.1 (pull from baseline), US-3

**Acceptance Criteria**:
- [ ] Auto-detects expense baseline
- [ ] Auto-populates expenses on first load
- [ ] Tier selector updates expenses
- [ ] Category breakdown displayed
- [ ] Works without baseline (manual input)

---

#### Task 6.2: Integrate with Actual Hourly Wage Calculator

**Objective**: Display life energy impact if AWH available.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/retirementSimulator/LifeEnergyImpactCard.tsx` (already created in Task 5.6, refine integration)

**Functionality**:
```typescript
// In ResultsSummaryPanel or LifeEnergyImpactCard:
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// If AWH available:
// - Convert retirement expenses to work hours
// - Show years of life gained by retiring
// - Show additional work hours needed if low success rate

// If AWH not available:
// - Display prompt with link to AWH calculator
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-11 (life energy), integration

**Acceptance Criteria**:
- [ ] Detects AWH from context
- [ ] Converts expenses to hours correctly
- [ ] Displays years/hours gained
- [ ] Prompt to calculate AWH clear
- [ ] Link to AWH calculator works

---

#### Task 6.3: Implement Input Validation

**Objective**: Validate all inputs before running simulation.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/validation/retirementSimulation.ts` (new)
- `/src/context/CalculatorContext.tsx` (modify runSimulation to validate)

**Functionality**:
```typescript
// Implement validation function:
export const validateRetirementSimulation = (
  simulation: RetirementSimulation
): ValidationResult => {
  // Check retirement date in future
  // Check current age reasonable (18-100)
  // Check life expectancy after retirement age
  // Check portfolio non-negative
  // Check expected return reasonable (0-15%)
  // Check inflation reasonable (0-10%)
  // Warn if expenses seem unrealistic
  // Warn if expected return > 12% (unrealistic)

  return { valid: true } or { valid: false, error: '...' }
};

// In CalculatorContext runSimulation:
const validation = validateRetirementSimulation(retirementSimulation);
if (!validation.valid) {
  showToast({ type: 'error', message: validation.error });
  return;
}
```

**Tests**:
- `/tests/lib/validation/retirementSimulation.test.ts` (new)
  - Test each validation rule
  - Test valid inputs pass
  - Test invalid inputs fail with correct error

**Requirements Addressed**: Error handling, user experience

**Acceptance Criteria**:
- [ ] All inputs validated before simulation
- [ ] Clear error messages
- [ ] Warnings for suspicious values
- [ ] Validation prevents invalid simulations
- [ ] Unit tests pass

---

#### Task 6.4: Add Educational Content and Tooltips

**Objective**: Explain concepts and assumptions throughout UI.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/MethodologyExplainer.tsx` (new)
- `/src/components/retirementSimulator/EducationalPanel.tsx` (new)
- Add tooltips to input components

**Functionality**:
```typescript
// MethodologyExplainer (collapsible):
// - Explain Monte Carlo simulation
// - Explain success probability
// - List assumptions (returns, inflation, life expectancy)
// - Disclaimers (not financial advice)
// - References (Trinity Study, etc.)

// EducationalPanel (collapsible):
// - Success probability explainer
// - Sequence-of-returns risk info
// - Icelandic pension system guide
// - FAQ section

// Tooltips:
// - Expected return: "Historical average is 7% real return"
// - Inflation: "Icelandic average 3% per year"
// - 4% rule: "Based on Trinity Study..."
// - Success rate: "Percentage of scenarios where portfolio lasts..."
```

**Tests**: Content review (no automated tests)

**Requirements Addressed**: NFR-4 (transparency), NFR-2 (usability)

**Acceptance Criteria**:
- [ ] Methodology explained clearly
- [ ] Assumptions stated
- [ ] Disclaimers prominent
- [ ] FAQ addresses common questions
- [ ] Tooltips helpful
- [ ] All text in Icelandic

---

#### Task 6.5: Add Deterministic Projection Toggle

**Objective**: Allow users to switch between Monte Carlo and deterministic projection.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/retirementSimulator/SimulationSettings.tsx` (modify)
- `/src/context/CalculatorContext.tsx` (modify runSimulation to support both)

**Functionality**:
```typescript
// In SimulationSettings:
// - Radio buttons: Monte Carlo / Deterministic
// - If Deterministic selected:
//   - Hide scenario count input
//   - Show explanation: "Single projection with expected returns"
// - If Monte Carlo selected:
//   - Show scenario count input

// In runSimulation:
if (simulation.assumptions.simulationType === 'deterministic') {
  // Run deterministic projection (fast)
  const trajectory = calculateDeterministicProjection(config);
  // Convert to SimulationResults format (success = true if portfolio > 0)
} else {
  // Run Monte Carlo (via worker)
}
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-5.2 (deterministic option)

**Acceptance Criteria**:
- [ ] Toggle between Monte Carlo and deterministic
- [ ] Deterministic runs fast (< 100ms)
- [ ] Deterministic results displayed correctly
- [ ] Monte Carlo still available
- [ ] UI adapts based on selection

---

### EPIC 7: Testing, Accessibility, and Polish

**Objective**: Comprehensive testing, accessibility compliance, final polish.

**Duration**: 8-10 hours

**Dependencies**: Epics 1-6 complete

**Deliverables**:
- Unit tests for all calculations
- Integration tests for context and components
- Accessibility review and fixes
- Performance optimization
- Final UI polish

---

#### Task 7.1: Write Unit Tests for Calculations

**Objective**: Comprehensive unit tests for all calculation functions.

**Duration**: 3 hours

**Files to Create/Modify**:
- All test files created in previous tasks (ensure complete coverage)

**Tests to Cover**:
```typescript
// withdrawalStrategies.test.ts (Task 1.3)
- All 4 withdrawal strategies
- Edge cases (zero portfolio, extreme values)

// pensionIncome.test.ts (Task 1.4)
- Pension starts at correct age
- Inflation adjustment
- Typical estimates

// returnGeneration.test.ts (Task 2.2)
- Box-Muller distribution
- Lognormal properties
- Sequence length

// scenarioRunner.test.ts (Task 2.3)
- Accumulation phase
- Withdrawal phase
- Depletion detection

// resultAggregation.test.ts (Task 2.4)
- Success rate calculation
- Percentile trajectories
- Depletion statistics

// flexibilityAnalysis.test.ts (Task 2.5)
- Buffer calculation
- Additional years needed
- Sensitivity analysis

// deterministicProjection.test.ts (Task 2.6)
- Deterministic projection
- Consistency with Monte Carlo median
```

**Requirements Addressed**: NFR-3 (accuracy)

**Acceptance Criteria**:
- [ ] All calculation functions have tests
- [ ] >90% code coverage for calculations
- [ ] Edge cases covered
- [ ] Tests pass consistently

---

#### Task 7.2: Write Integration Tests

**Objective**: Test full simulation flow from input to results.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/tests/integration/retirementSimulator.test.tsx` (new)

**Tests to Cover**:
```typescript
describe('Retirement Simulator Integration', () => {
  it('runs full Monte Carlo simulation', async () => {
    // Set up simulation inputs
    // Trigger runSimulation
    // Verify results returned
    // Verify success rate calculated
    // Verify trajectories present
  });

  it('integrates with expense baseline', () => {
    // Set up expense baseline
    // Open retirement simulator
    // Verify expenses auto-populated
    // Change tier, verify expenses update
  });

  it('integrates with actual hourly wage', () => {
    // Set up AWH
    // Run simulation
    // Verify life energy impact displayed
  });

  it('comparison mode works', async () => {
    // Add comparison scenario
    // Modify scenario
    // Run comparison simulations
    // Verify results for all scenarios
  });

  it('persists to localStorage', () => {
    // Update simulation inputs
    // Wait for debounce
    // Verify saved to localStorage
    // Reload, verify inputs restored
  });
});
```

**Requirements Addressed**: All functional requirements (end-to-end)

**Acceptance Criteria**:
- [ ] Full simulation flow tested
- [ ] Integrations tested
- [ ] LocalStorage persistence tested
- [ ] Tests pass consistently

---

#### Task 7.3: Accessibility Review and Fixes

**Objective**: Ensure WCAG 2.1 AA compliance.

**Duration**: 2 hours

**Files to Create/Modify**:
- All component files (add/fix ARIA labels, keyboard nav, etc.)

**Accessibility Checklist**:
```typescript
// Chart accessibility:
- [ ] Table alternative for chart data (sr-only)
- [ ] ARIA labels for chart elements

// Success rate:
- [ ] ARIA live region for success rate updates
- [ ] Color-blind friendly indicators (icons + color)

// Inputs:
- [ ] All inputs have labels
- [ ] Form sections have headings
- [ ] Error messages associated with inputs (aria-describedby)

// Keyboard navigation:
- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Retirement date slider keyboard accessible

// Screen reader:
- [ ] Test with VoiceOver/NVDA
- [ ] All content readable
- [ ] Loading states announced
```

**Requirements Addressed**: NFR-5 (accessibility)

**Acceptance Criteria**:
- [ ] WCAG 2.1 AA compliant
- [ ] Color contrast meets standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] No accessibility violations in tests

---

#### Task 7.4: Performance Optimization

**Objective**: Ensure simulations run fast and UI stays responsive.

**Duration**: 2 hours

**Files to Create/Modify**:
- Various calculation and component files (memoization, caching)

**Optimizations**:
```typescript
// Web Worker performance:
- [ ] 1,000 scenarios in < 2 seconds (verify)
- [ ] 5,000 scenarios in < 5 seconds (verify)
- [ ] Progress updates don't slow simulation

// Chart rendering:
- [ ] Memoize chart data
- [ ] Use decimation for large datasets
- [ ] Chart renders in < 500ms

// Input debouncing:
- [ ] Inputs debounced (don't trigger recalc on every keystroke)
- [ ] Context updates batched

// Caching:
- [ ] Cache recent simulation results (by input hash)
- [ ] Avoid re-running identical simulations
```

**Requirements Addressed**: NFR-1 (performance)

**Acceptance Criteria**:
- [ ] 1,000 scenarios complete in < 2 seconds
- [ ] UI remains responsive during simulation
- [ ] Chart renders quickly
- [ ] No unnecessary re-renders

---

#### Task 7.5: Final UI Polish

**Objective**: Visual refinements, error states, loading states, copy review.

**Duration**: 2 hours

**Files to Create/Modify**:
- All component files (visual tweaks)

**Polish Checklist**:
```typescript
// Loading states:
- [ ] Skeleton loaders for results while simulating
- [ ] Progress bar during Monte Carlo
- [ ] Spinner with progress percentage

// Error states:
- [ ] Friendly error messages
- [ ] Suggestions for fixing errors
- [ ] No crashes on invalid input

// Empty states:
- [ ] "Run simulation to see results" message
- [ ] "No comparison scenarios yet" in comparison mode

// Visual refinement:
- [ ] Consistent spacing and typography
- [ ] Success rate colors consistent with design system
- [ ] Chart colors accessible and clear
- [ ] Mobile layout optimized

// Copy review:
- [ ] All text in Icelandic
- [ ] Tooltips clear and helpful
- [ ] Error messages user-friendly
- [ ] Disclaimers prominent but not intrusive
```

**Requirements Addressed**: NFR-2 (usability), NFR-7 (Icelandic)

**Acceptance Criteria**:
- [ ] Loading states clear
- [ ] Error states handled gracefully
- [ ] Visual design consistent
- [ ] All text reviewed and polished
- [ ] Mobile experience optimized

---

## 3. Testing Strategy Summary

### Unit Tests (35-40 tests)
- Withdrawal strategies (4 tests)
- Pension income calculations (4 tests)
- Return generation (3 tests)
- Scenario runner (5 tests)
- Result aggregation (4 tests)
- Flexibility analysis (4 tests)
- Deterministic projection (3 tests)
- Input validation (8 tests)

### Integration Tests (5-8 tests)
- Full simulation flow
- Expense baseline integration
- Actual hourly wage integration
- Comparison mode
- LocalStorage persistence

### Component Tests (15-20 tests)
- Input components render correctly
- Results components display correctly
- Chart component renders
- Comparison mode displays

### Accessibility Tests
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility

### Performance Tests
- 1,000 scenarios in < 2 seconds
- 5,000 scenarios in < 5 seconds
- Chart renders in < 500ms

---

## 4. Success Criteria

**MVP Complete When**:
- [ ] User can input retirement date, portfolio, expenses
- [ ] Monte Carlo simulation runs with 1,000 scenarios
- [ ] Success probability displayed with interpretation
- [ ] Portfolio projection chart shows trajectories
- [ ] Flexibility analysis shows buffer and recommendations
- [ ] Integration with Expense Baseline Tool works
- [ ] All calculations accurate (verified against reference calculators)
- [ ] Performance targets met (< 2 sec for 1,000 scenarios)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] All text in Icelandic
- [ ] Unit tests pass with >90% coverage
- [ ] Integration tests pass

**Enhanced Features (Optional Post-MVP)**:
- [ ] Comparison mode fully functional
- [ ] Icelandic pension estimates refined
- [ ] Historical return bootstrapping option
- [ ] Export results as PDF
- [ ] Shareable scenario links

---

## 5. Implementation Order Recommendation

**Week 1** (16-20 hours):
- Epic 1: Foundation (6-8 hours)
- Epic 2: Simulation Engine (10-12 hours)

**Week 2** (16-20 hours):
- Epic 3: State Management (5-6 hours)
- Epic 4: Input UI (10-12 hours)

**Week 3** (16-20 hours):
- Epic 5: Results UI (12-14 hours)
- Epic 6: Integration (start, 4-6 hours)

**Week 4** (12-16 hours):
- Epic 6: Integration (finish, 2 hours)
- Epic 7: Testing and Polish (8-10 hours)
- Final review and bug fixes

**Total Estimated Time**: 60-76 hours (7.5-9.5 working days)

---

## 6. Risk Management

### High-Priority Risks

**Risk**: Monte Carlo performance not meeting targets
- **Mitigation**: Optimize early, profile, consider WebAssembly if needed
- **Fallback**: Reduce default scenario count to 500

**Risk**: Chart rendering slow on large datasets
- **Mitigation**: Use decimation, memoization, consider lighter chart library
- **Fallback**: Simplify chart (show fewer percentiles)

**Risk**: Complex inputs overwhelming users
- **Mitigation**: Progressive disclosure, smart defaults, guided flow
- **Fallback**: Create "Simple Mode" with minimal inputs

**Risk**: Icelandic pension estimates inaccurate
- **Mitigation**: Consult official sources, allow full customization
- **Fallback**: Make pension inputs optional, emphasize disclaimer

---

## 7. Post-Implementation

### Documentation Needed
- User guide (Icelandic)
- Methodology explanation
- API documentation for integrations
- Contribution guide for future enhancements

### Future Enhancements
- Tax optimization strategies
- Social Security / pension optimization (advanced)
- Healthcare cost projections
- Part-time work income (Barista FIRE integration)
- Scenario sharing / templates
- Mobile app version

---

**Tasks Phase Complete: Ready for Implementation**
