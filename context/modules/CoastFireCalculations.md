# Coast FIRE Calculations Module

## Location
`apps/peninganaedalifid/src/lib/calculations/coastFire.ts`

## Purpose
Provides all pure calculation functions for the Coast FIRE (Ró FIRE) Calculator. Implements compound interest calculations to determine when current investments will grow to meet FI number without additional contributions.

## Key Concept
**Coast FIRE**: The point where your current investments will compound to reach your FI number by target retirement age without any additional contributions. This allows you to "coast" to financial independence while reducing work intensity or pursuing other goals.

## Core Calculations

### 1. Future Value Calculation
```typescript
calculateFutureValue(principal, annualReturnRate, years): number
```
- Calculates compound growth: `FV = PV × (1 + r)^t`
- Used for all growth projections
- Returns future value in ISK

### 2. Coast FI Number Calculation
```typescript
calculateCoastFINumber(fiNumber, yearsToRetirement, expectedReturn): number
```
- Calculates present value: `PV = FV / (1 + r)^t`
- Determines how much is needed **today** to coast to FI
- Returns amount needed today in ISK

### 3. Years to Coast Calculation
```typescript
calculateYearsToCoast(currentInvestments, coastFINumber, expectedReturn): number | null
```
- Solves for time: `t = ln(coastFI / current) / ln(1 + r)`
- Returns years until Coast FIRE reached
- Returns null if impossible (negative/zero return, > 100 years)

### 4. Coast FIRE Status
```typescript
calculateCoastFIREStatus(currentInvestments, coastFINumber): CoastFIREStatus
```
- Determines current status: 'coasting', 'future', or 'impossible'
- 'coasting': Already have enough to coast
- 'future': Will be able to coast before retirement
- 'impossible': Cannot coast with current parameters

### 5. Gap to Coast
```typescript
calculateGapToCoast(currentInvestments, coastFINumber): number | null
```
- Calculates additional ISK needed today to start coasting
- Returns null if already coasting
- Used to show actionable gap amount

## Advanced Features

### Scenario Analysis
```typescript
calculateScenarioResults(inputs, scenarios): ScenarioResult[]
```
- Runs calculations for three scenarios:
  - Conservative: 4% real return
  - Moderate: 6% real return (default)
  - Optimistic: 8% real return
- Returns complete results for each scenario
- Enables sensitivity analysis and conservative planning

### Growth Projections
```typescript
calculateGrowthProjection(currentInvestments, years, expectedReturn): GrowthProjection[]
```
- Generates year-by-year growth data for charting
- Returns array of data points (age, year, balance)
- Used for visualization of growth trajectory

### Life Energy Conversions
```typescript
calculateLifeEnergy(investments, gap, growth, actualHourlyWage): CoastFIRELifeEnergy | null
```
- Converts ISK amounts to work hours and years
- Requires actual hourly wage from AWH calculator
- Returns null if wage not available
- Shows:
  - Current investments in hours/years
  - Gap to Coast FIRE in hours/years
  - Passive hours earned from compound growth
  - Hours saved by coasting vs continuing to save

## Master Function

### Complete Coast FIRE Calculation
```typescript
calculateCoastFIREResult(inputs, actualHourlyWage?): CoastFIREResult
```
- Main orchestrator function coordinating all calculations
- Takes full input state and optional wage
- Returns complete results including:
  - Status determination
  - Coast FIRE age and date
  - Gap calculation
  - Projected balance at retirement
  - All three scenario results
  - Life energy metrics (if wage provided)
  - Calculation assumptions metadata

**Parameters:**
- `inputs: CoastFIREInputs` - All user inputs
- `actualHourlyWage: number | null` - Optional wage for life energy

**Returns:** `CoastFIREResult` - Complete calculation results

**Throws:** Error if FI number is missing or invalid

## Edge Case Handling

### Already Coasting
- `yearsToCoast` returns 0
- `gapToCoast` returns null
- Status: 'coasting'
- Projected balance shows excess over FI

### Impossible Scenarios
- `yearsToCoast` returns null when:
  - Return rate ≤ 0%
  - Years needed > 100 (effectively impossible)
  - Current investments is 0
- Status: 'impossible'
- Gap shows how much more is needed

### Zero/Negative Returns
- Handled gracefully in all functions
- Returns null or appropriate default
- Never throws errors on edge cases

### Long Timelines
- Projections limited to 100 years (sanity check)
- Beyond 100 years considered "effectively impossible"
- Prevents unrealistic future projections

## Constants Used

From `@/lib/constants/coastFire`:
- `RETURN_RATE_SCENARIOS`: Conservative/Moderate/Optimistic rates
- `CALCULATION_CONSTANTS.WORK_HOURS_PER_YEAR`: 2080 hours
- `CALCULATION_CONSTANTS.MAX_PROJECTION_YEARS`: 100 years
- `CALCULATION_CONSTANTS.COMPOUNDING_FREQUENCY`: 'annual'

## Return Assumptions

All return rates are **REAL RETURNS** (inflation-adjusted), not nominal:
- Conservative: 4% real return (bonds + some stocks)
- Moderate: 6% real return (balanced portfolio) - **default**
- Optimistic: 8% real return (stock-heavy portfolio)

Iceland context: Real returns account for Iceland's historically higher inflation.

## Testing

**Test File:** `src/lib/calculations/__tests__/coastFire.test.ts`

**Coverage:** 53 unit tests, all passing

**Test Categories:**
- Future value calculations (6 tests)
- Coast FI number calculations (5 tests)
- Status determination (3 tests)
- Years to coast calculations (7 tests)
- Gap calculations (4 tests)
- Projected balance (3 tests)
- Growth projections (4 tests)
- Scenario results (5 tests)
- Life energy conversions (5 tests)
- Integration tests for master function (11 tests)

**Edge Cases Tested:**
- Already coasting (returns 0 years)
- Impossible scenarios (returns null)
- Zero/negative returns
- Zero investments
- Very long timelines (> 100 years)
- Missing/invalid inputs

## Performance

All calculations are pure functions with O(1) or O(n) complexity:
- Individual calculations: < 1ms
- Scenario analysis (3 scenarios): < 5ms
- Growth projection (50 years): < 10ms
- Master function: < 20ms

Meets requirement: All calculations < 50ms

## Dependencies

**Type Imports:**
- `@/types/coastFire`: All Coast FIRE types
- `CoastFIREInputs`, `CoastFIREResult`, `ScenarioResult`, etc.

**Constant Imports:**
- `@/lib/constants/coastFire`: Return rates, limits, scenarios

**No External Libraries:**
- Pure JavaScript Math functions only
- No date/time libraries (uses native Date)
- No validation libraries (validation in separate module)

## Integration Points

### With Calculator Context
- Results stored in `coastFireResults` state
- Triggered on input changes via `updateCoastFire()`
- Auto-recalculates when dependencies change

### With Expense Baseline
- FI number can be calculated from expense tiers
- `fiNumber = monthlyExpenses × 12 × fiMultiplier`
- Integration handled in context layer, not calculations

### With Actual Hourly Wage Calculator
- Wage passed as optional parameter to master function
- Life energy calculations only run if wage provided
- Gracefully handles null wage (returns null for life energy)

## Export Structure

All functions exported individually plus default export:

```typescript
export {
  calculateFutureValue,
  calculateCoastFINumber,
  calculateCoastFIREStatus,
  calculateYearsToCoast,
  calculateGapToCoast,
  calculateProjectedBalance,
  calculateScenarioResults,
  calculateGrowthProjection,
  calculateLifeEnergy,
  calculateCoastFIREResult,
}

export default {
  // All functions as properties
}
```

## Usage Example

```typescript
import { calculateCoastFIREResult } from '@/lib/calculations/coastFire';

const inputs: CoastFIREInputs = {
  currentAge: 35,
  currentInvestments: 25_000_000,
  targetRetirementAge: 67,
  expectedReturn: 6,
  fiNumber: 150_000_000,
  fiNumberSource: 'manual',
  selectedTier: null,
  fiMultiplier: 25,
};

const actualHourlyWage = 2500; // From AWH calculator

const result = calculateCoastFIREResult(inputs, actualHourlyWage);

// Result includes:
// - result.status: 'coasting' | 'future' | 'impossible'
// - result.coastFireAge: Age when Coast FIRE reached
// - result.yearsToCoast: Years until Coast FIRE
// - result.gapToCoast: ISK needed to start coasting
// - result.projectedBalance: Balance at retirement
// - result.scenarios: [conservative, moderate, optimistic]
// - result.lifeEnergy: Hours/years representation
```

## Related Modules

- **Types:** `context/modules/CoastFireTypes.md` - Type definitions
- **Constants:** `context/modules/CoastFireConstants.md` - Default values
- **Validation:** (TBD) - Input validation functions
- **Context:** (TBD) - State management integration

## Implementation Notes

**Completed:** 2026-01-29
**Task:** Epic 1, Task 1.3 - Implement Core Calculation Functions
**Requirements Fulfilled:** FR-1 (Core Calculation), FR-3.2 (Scenarios), FR-5 (Life Energy)
**Design Reference:** `specs/coast-fire/design-coast-fire.md` Section 5

**Key Decisions:**
1. **Annual Compounding Only:** Simplified to annual for clarity (monthly option in design but not needed)
2. **Real Returns:** All returns are real (inflation-adjusted) to match Iceland context
3. **100 Year Limit:** Projections beyond 100 years considered impossible for practicality
4. **Life Energy Estimate:** Simplified calculation for hours saved (80% of passive growth)
5. **Pure Functions:** All functions are pure with no side effects for testability

**Future Enhancements:**
- Monthly compounding option (currently annual only)
- More sophisticated life energy savings calculation
- Monte Carlo simulation support (Phase 2)
- Historical return analysis (Phase 2)
