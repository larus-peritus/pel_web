# Retirement Simulator - Withdrawal Strategy Calculations

## Location
`apps/peninganaedalifid/src/lib/calculations/retirementSimulator.ts`

## Purpose
Pure calculation functions for retirement withdrawal strategies and Icelandic pension income calculations. Supports Monte Carlo simulation engine for the Retirement Date Simulator.

## Exports

### Withdrawal Strategy Functions
- `calculateWithdrawal4Percent(portfolio, baseWithdrawal, year, inflationRate)` - 4% rule with inflation adjustment
- `calculateWithdrawalVariable(portfolio, rate)` - Variable percentage withdrawal based on current portfolio
- `calculateWithdrawalGuardrails(portfolio, baseWithdrawal, upperGuard, lowerGuard, adjustment)` - Guardrails strategy with spending triggers
- `calculateWithdrawal(strategy, currentPortfolio, initialPortfolio, yearsIntoRetirement, inflationRate)` - Main dispatcher function

### Pension Income Functions
- `calculatePensionIncome(age, pensions)` - Calculate Icelandic pension income (lífeyrissjóður + ellilífeyrir)
- `calculateTotalPensionIncome(age, pensions, inflationRate, yearsIntoRetirement)` - Pension income with inflation adjustment
- `estimateTypicalPension(age, pensionType)` - Get typical Icelandic pension estimates

### Helper Functions
- `calculateYearlyExpenses(expenses, age, pensionIncome)` - Net expenses after pension income
- `calculatePortfolioReturn(portfolio, expectedReturn, volatility)` - Apply return to portfolio
- `calculateFutureValue(principal, rate, years)` - Compound growth calculation
- `calculateYearsToRetirement(currentAge, targetAge)` - Years until retirement
- `prepareSimulationConfig(simulation)` - Convert RetirementSimulation to SimulationConfig

## Key Functionality

### Withdrawal Strategies

**4% Rule** (Trinity Study):
- Withdraw fixed 4% of initial portfolio annually
- Inflation-adjusted over time
- Most conservative approach

**Variable Spending**:
- Withdraw X% of current portfolio each year
- Automatically adjusts to portfolio performance
- More flexible but less predictable

**Guardrails**:
- Increase spending when portfolio > upper threshold (e.g., 130%)
- Decrease spending when portfolio < lower threshold (e.g., 80%)
- Balances fixed and variable approaches

**Custom**:
- User-defined withdrawal pattern
- Supports specific needs (e.g., higher early retirement spending)

### Icelandic Pension Integration

**Lífeyrissjóður** (Pension Fund):
- Available at age 60
- Typical estimate: 150,000 ISK/month
- Optional inflation adjustment

**Ellilífeyrir** (State Pension):
- Available at age 67
- Typical estimate: 200,000 ISK/month
- Optional inflation adjustment

Both pensions reduce required portfolio withdrawals and improve success rates.

### Calculation Patterns

All functions are **pure** (no side effects):
- Deterministic output for given inputs
- No state mutation
- Easy to test and reason about

Used by:
- Monte Carlo Web Worker (simulation engine)
- Deterministic projection calculator
- Sensitivity analysis
- Flexibility analysis

## Dependencies
- `@/types/retirementSimulator` - TypeScript types
- `@/lib/constants/retirementSimulator` - Default values and thresholds

## Tests
- Location: `apps/peninganaedalifid/tests/lib/calculations/retirementSimulator.test.ts`
- Coverage: 39 unit tests covering all functions and edge cases
- All tests passing

## Integration
- Used by: Monte Carlo Web Worker (to be implemented)
- Uses: Types, constants
- Integrates with: Icelandic pension system

## Related
- Implements: FR-6 (withdrawal strategies), FR-4 (Icelandic pension) from `specs/retirement-simulator/requirements-retirement-simulator.md`
- Part of: Task 1.3 from `specs/retirement-simulator/tasks-retirement-simulator.md`
- Design: `specs/retirement-simulator/design-retirement-simulator.md`

## Examples

```typescript
// 4% Rule Withdrawal
const portfolio = 10_000_000; // 10M ISK
const baseWithdrawal = portfolio * 0.04; // 400k ISK/year
const monthlyWithdrawal = calculateWithdrawal4Percent(
  portfolio,
  baseWithdrawal,
  0, // First year
  0.03 // 3% inflation
);
// Result: 33,333.33 ISK/month

// Variable Spending
const monthlyWithdrawal = calculateWithdrawalVariable(
  8_000_000, // Current portfolio after market downturn
  0.04 // 4% rate
);
// Result: 26,666.67 ISK/month (adjusts automatically)

// Icelandic Pension Income
const pensions: IcelandicPensionInput = {
  lifeyrissjodur: {
    enabled: true,
    startAge: 60,
    monthlyAmount: 150_000,
    inflationAdjusted: true,
  },
  ellilifeyrir: {
    enabled: true,
    startAge: 67,
    monthlyAmount: 200_000,
    inflationAdjusted: true,
  },
};

const income = calculatePensionIncome(70, pensions);
// Result: 350,000 ISK/month (both pensions active)
```

## Performance
- All calculations complete in < 1ms
- Pure functions enable memoization
- No I/O or async operations
- Suitable for high-frequency Monte Carlo simulation (1,000+ scenarios)
