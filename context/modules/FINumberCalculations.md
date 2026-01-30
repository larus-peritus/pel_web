# FI Number Calculations Module

## Location
`apps/peninganaedalifid/src/lib/calculations/fiNumber.ts`

## Purpose
Core calculation functions for the FI Number Builder (FI-tala reiknivél), implementing Financial Independence calculations based on "Your Money or Your Life" philosophy and Trinity Study principles, adapted for Iceland's higher inflation and lífeyrissjóður (pension) system.

## Exports

### Core Calculations

#### `calculateFINumber(annualExpenses: number, multiplier: number): number`
Calculates basic FI number using the formula: FI Number = Annual Expenses × Multiplier

**Parameters:**
- `annualExpenses` - Annual expenses in ISK
- `multiplier` - FI multiplier (25, 30, 33, or custom 20-50)

**Returns:** FI number in ISK

**Example:**
```typescript
calculateFINumber(6_000_000, 30) // => 180_000_000
```

**Edge cases handled:**
- Zero or negative expenses → returns 0
- Zero or negative multiplier → returns 0

#### `calculateWithdrawalRate(multiplier: number): number`
Converts multiplier to withdrawal rate using formula: Withdrawal Rate = 1 / Multiplier

**Parameters:**
- `multiplier` - FI multiplier

**Returns:** Withdrawal rate as decimal (e.g., 0.0333 for 30x)

**Examples:**
```typescript
calculateWithdrawalRate(25) // => 0.04 (4%)
calculateWithdrawalRate(30) // => 0.0333 (3.33%)
calculateWithdrawalRate(33) // => 0.0303 (3%)
```

**Edge cases handled:**
- Zero multiplier → returns 0

#### `getMonthlyExpenses(expenseSource, customExpense, expenseBaseline, selectedTier): number`
Retrieves monthly expenses from either expense baseline (selected tier) or custom input.

**Parameters:**
- `expenseSource` - 'baseline' or 'custom'
- `customExpense` - Custom monthly expense amount (ISK, nullable)
- `expenseBaseline` - Expense baseline data (nullable)
- `selectedTier` - Selected expense tier (nullable)

**Returns:** Monthly expenses in ISK

**Logic:**
- Custom source → returns customExpense
- Baseline source → returns expenseBaseline.expenses[selectedTier]
- Missing data → returns 0

### Pension Calculations

#### `calculatePensionAdjustedFI(...): PensionAdjustedResult`
Calculates pension-adjusted FI when user has expected lífeyrissjóður income.

**Parameters:**
- `annualExpenses` - Full annual expenses without pension (ISK)
- `multiplier` - FI multiplier
- `pensionMonthlyIncome` - Expected monthly pension at age 67 (ISK)
- `targetRetirementAge` - Desired retirement age
- `pensionStartAge` - When pension starts (default: 67)

**Returns:** PensionAdjustedResult object containing:
- `pensionMonthlyIncome` - Monthly pension amount
- `pensionAnnualIncome` - Annual pension (monthly × 12)
- `reducedAnnualExpenses` - Expenses after pension covers part
- `pensionAdjustedFI` - FI number for reduced expenses
- `targetRetirementAge` - Desired retirement age
- `pensionStartAge` - When pension starts
- `bridgeYears` - Years between retirement and pension start
- `bridgeAmount` - Funds needed for bridge period
- `totalNeeded` - Bridge + pension-adjusted FI

**Example:**
```typescript
calculatePensionAdjustedFI(6_000_000, 30, 200_000, 55)
// => {
//   pensionAnnualIncome: 2_400_000,
//   reducedAnnualExpenses: 3_600_000,
//   pensionAdjustedFI: 108_000_000,
//   bridgeYears: 12,
//   bridgeAmount: 72_000_000,
//   totalNeeded: 180_000_000
// }
```

**Edge cases handled:**
- Pension covers all expenses → reducedAnnualExpenses = 0
- Pension exceeds expenses → reducedAnnualExpenses = 0 (capped)
- Retirement at/after pension age → bridgeYears = 0, bridgeAmount = 0

#### `calculateBridgeAmount(annualExpenses, targetRetirementAge, pensionStartAge?): number`
Convenience function to calculate just the bridge amount needed from early retirement to pension start.

**Parameters:**
- `annualExpenses` - Annual expenses during bridge period (ISK)
- `targetRetirementAge` - Desired retirement age
- `pensionStartAge` - When pension starts (default: 67)

**Returns:** Bridge amount in ISK

**Examples:**
```typescript
calculateBridgeAmount(6_000_000, 55) // => 72_000_000 (12 years × 6M)
calculateBridgeAmount(6_000_000, 70) // => 0 (no bridge needed)
```

### Life Energy Calculations

#### `calculateFINumberLifeEnergy(...): FINumberLifeEnergy`
Converts FI number to years of work based on actual hourly wage, implementing "Your Money or Your Life" life energy philosophy.

**Parameters:**
- `fiNumber` - FI number in ISK
- `actualHourlyWage` - Actual hourly wage (ISK/hour)
- `annualHours` - Annual work hours (default: 2080 = 40h/week × 52 weeks)
- `currentSavings` - Current savings (optional, for years-to-FI)
- `annualSavings` - Annual savings amount (optional, for years-to-FI)

**Returns:** FINumberLifeEnergy object containing:
- `actualHourlyWage` - Hourly wage
- `annualNetIncome` - Annual net income (wage × hours)
- `yearsOfWork` - Years the FI number represents
- `yearsToFI` - Years remaining to reach FI (if savings provided)

**Example:**
```typescript
calculateFINumberLifeEnergy(180_000_000, 5_000, 2080)
// => {
//   actualHourlyWage: 5_000,
//   annualNetIncome: 10_400_000,
//   yearsOfWork: 17.3,
//   yearsToFI: undefined
// }
```

**Edge cases handled:**
- Zero or negative wage → yearsOfWork = 0
- Zero savings rate → yearsToFI = undefined

### Scenario Comparison

#### `calculateScenarioComparison(...): ScenarioComparisonResult`
Compares FI numbers across all three expense tiers (barebones, comfortable, deluxe) using the same multiplier.

**Parameters:**
- `expenseBaseline` - Expense baseline data with all three tiers
- `multiplier` - FI multiplier to use for all scenarios
- `selectedTier` - Currently selected tier for difference calculation

**Returns:** ScenarioComparisonResult object with:
- `barebones` - ScenarioResult for barebones tier
- `comfortable` - ScenarioResult for comfortable tier
- `deluxe` - ScenarioResult for deluxe tier

Each ScenarioResult contains:
- `tier` - Tier name
- `monthlyExpenses` - Monthly expenses for tier
- `annualExpenses` - Annual expenses (monthly × 12)
- `fiNumber` - FI number (annual × multiplier)
- `difference` - ISK and percentage difference from selected tier (undefined for selected tier)

**Example:**
```typescript
calculateScenarioComparison(baseline, 30, 'comfortable')
// => {
//   barebones: { fiNumber: 90_000_000, difference: { isk: -97_200_000, percentage: -51.92 } },
//   comfortable: { fiNumber: 187_200_000, difference: undefined },
//   deluxe: { fiNumber: 360_000_000, difference: { isk: 172_800_000, percentage: 92.31 } }
// }
```

### Master Orchestrator

#### `calculateFINumberResults(state, expenseBaseline, actualHourlyWage, annualHours): FINumberResults`
Master orchestration function that calculates all FI number metrics from current state.

**Parameters:**
- `state` - FINumberBuilderState with all user inputs
- `expenseBaseline` - Expense baseline data (nullable)
- `actualHourlyWage` - Actual hourly wage (nullable)
- `annualHours` - Annual work hours (nullable)

**Returns:** Complete FINumberResults object containing:
- `monthlyExpenses` - Monthly expenses used
- `annualExpenses` - Annual expenses (monthly × 12)
- `multiplier` - Multiplier used
- `withdrawalRate` - Withdrawal rate (1 / multiplier)
- `fiNumber` - Basic FI number
- `hasPension` - Whether pension income configured
- `pensionAdjusted` - PensionAdjustedResult (if pension configured)
- `lifeEnergy` - FINumberLifeEnergy (if AWH available)
- `scenarios` - ScenarioComparisonResult (if using baseline)

**Calculation flow:**
1. Get monthly expenses from source (baseline or custom)
2. Calculate annual expenses (monthly × 12)
3. Calculate withdrawal rate from multiplier
4. Calculate basic FI number
5. Add pension adjustment (if applicable)
6. Add life energy metrics (if AWH available)
7. Add scenario comparison (if using baseline)

**Example:**
```typescript
const results = calculateFINumberResults(state, baseline, 5000, 2080);
// => Complete FINumberResults with all applicable sections
```

## Key Functionality
- Basic FI number calculation (Annual Expenses × Multiplier)
- Withdrawal rate conversion (1 / Multiplier)
- Pension-adjusted FI calculation for Icelandic lífeyrissjóður
- Bridge amount calculation for early retirement
- Life energy conversion (FI number → years of work)
- Scenario comparison across all expense tiers
- Master orchestration function for complete results

## Dependencies
- `@/types/fiNumber` - All FI number types (FINumberBuilderState, FINumberResults, PensionAdjustedResult, FINumberLifeEnergy, ScenarioResult, ScenarioComparisonResult, ExpenseSource)
- `@/types/expenseBaseline` - ExpenseTier, ExpenseBaseline
- `@/lib/constants/fiNumber` - PENSION_START_AGE (67), CALCULATION_DEFAULTS (MONTHS_PER_YEAR: 12)

## Tests
**Location:** `apps/peninganaedalifid/tests/lib/calculations/fiNumber.test.ts`

**Coverage:** 46 unit tests, all passing (100% coverage)

**Test suites:**
1. **calculateFINumber** (7 tests)
   - Basic calculation with different multipliers (25x, 30x, 33x)
   - Custom multipliers (20x, 40x)
   - Edge cases: zero expenses, negative expenses, zero/negative multiplier

2. **calculateWithdrawalRate** (5 tests)
   - Standard multipliers (25x = 4%, 30x = 3.33%, 33x = 3%)
   - Custom multipliers
   - Edge case: zero multiplier

3. **getMonthlyExpenses** (7 tests)
   - Custom expense source
   - Baseline source (all three tiers)
   - Missing data scenarios (baseline missing, tier not selected, null custom)

4. **calculatePensionAdjustedFI** (8 tests)
   - Pension reduction calculation
   - Bridge amount for early retirement
   - Total needed calculation
   - No bridge when retiring at/after pension age
   - Pension covering all/exceeding expenses

5. **calculateBridgeAmount** (4 tests)
   - Early retirement bridge calculation
   - No bridge at/after pension age
   - Custom pension start age

6. **calculateFINumberLifeEnergy** (6 tests)
   - Years of work calculation
   - Years to FI when savings provided
   - No years to FI when savings not provided
   - Zero/negative hourly wage handling

7. **calculateScenarioComparison** (3 tests)
   - All three tiers comparison
   - Difference calculations from selected tier
   - Different multipliers

8. **calculateFINumberResults** (7 tests - Integration)
   - Complete results with custom expense
   - Complete results with baseline expense
   - Pension adjustment inclusion
   - Life energy inclusion (when AWH available)
   - Scenarios inclusion (when using baseline)
   - No scenarios when using custom
   - Missing baseline handling

## Integration
- **Used by:** FI Number Builder UI components, CalculatorContext
- **Uses:** Expense Baseline API (via getExpenseByTier pattern)
- **Related modules:** FINumberConstants, CalculatorTypes

## Design Patterns
- **Pure functions:** All calculation functions are pure with no side effects
- **Edge case handling:** Comprehensive handling of zero/negative/null values
- **Defensive programming:** Guards against division by zero, negative results
- **Progressive enhancement:** Optional features (pension, life energy, scenarios) only calculated when data available

## Icelandic Context
- **Default pension age:** 67 (Icelandic lífeyrissjóður start age)
- **Recommended multipliers:** 30x-33x (more conservative than US 25x due to higher inflation)
- **Pension integration:** Reduces FI number when pension covers expenses
- **Bridge calculation:** Critical for early retirement planning before pension

## Performance
- All calculations complete in < 1ms
- No expensive operations (logarithms, exponents)
- Optimized for real-time UI updates

## Related
- **Implements:** Requirements FR-1.1-1.5, FR-3.1-3.3, FR-5.1-5.5, FR-6.1-6.4 from specs/fi-number-builder/requirements-fi-number-builder.md
- **Part of:** specs/fi-number-builder/design-fi-number-builder.md (Section 5: Calculation Logic)
- **Task:** Task 1.3 from specs/fi-number-builder/tasks-fi-number-builder.md (Epic 1: Foundation)
