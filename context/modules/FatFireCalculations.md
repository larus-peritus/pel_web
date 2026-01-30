# FatFIRE Core Calculations

## Location
`apps/peninganaedalifid/src/lib/calculations/fatFire.ts`

## Purpose
Pure calculation functions for FatFIRE (Lúxus FIRE) planning. Implements all core formulas for calculating FI numbers with premium lifestyle expenses, timeline projections, milestones, and life energy conversions.

## Key Concepts
- **FatFIRE**: Financial Independence with luxurious lifestyle, no compromise
- **Higher Multiplier**: 30x default (3.33% withdrawal rate) vs standard 25x FIRE
- **Wish List**: Must-have vs nice-to-have lifestyle items
- **Splurge Budget**: Annual discretionary luxury spending budget
- **Icelandic Context**: Premium costs for Reykjavík 101/105 living

## Exports

### Primary Calculation Functions

#### `calculateTotalAnnualExpenses(baseMonthly, wishListItems, splurgeAnnual): number`
Calculates total annual expenses combining all sources.

**Formula**: `(baseMonthly × 12) + (wishListMustHave × 12) + splurgeAnnual`

**Parameters**:
- `baseMonthly`: Base monthly expenses from baseline or custom (ISK)
- `wishListItems`: Array of WishListItem objects
- `splurgeAnnual`: Annual splurge budget (ISK)

**Returns**: Total annual expenses in ISK

**Example**:
```typescript
const total = calculateTotalAnnualExpenses(700000, [item1, item2], 2000000);
// Returns: 16100000 (8.4M base + 5.7M wish + 2M splurge)
```

**Notes**:
- Only must-have wish list items are included
- Nice-to-have items are shown separately for comparison
- Negative values are clamped to 0

---

#### `calculateWishListTotals(items): { mustHave, niceToHave, total }`
Separates wish list items by priority for FI calculation.

**Parameters**:
- `items`: Array of WishListItem objects

**Returns**: Object with monthly totals:
- `mustHave`: Monthly total of must-have items (ISK)
- `niceToHave`: Monthly total of nice-to-have items (ISK)
- `total`: Combined monthly total (ISK)

**Example**:
```typescript
const totals = calculateWishListTotals([
  { priority: 'must-have', monthlyCost: 100000, ... },
  { priority: 'nice-to-have', monthlyCost: 50000, ... }
]);
// Returns: { mustHave: 100000, niceToHave: 50000, total: 150000 }
```

---

#### `calculateFINumber(totalAnnual, multiplier): number`
Calculates FI number with specified multiplier.

**Formula**: `Total Annual Expenses × Multiplier`

**Parameters**:
- `totalAnnual`: Total annual expenses (ISK)
- `multiplier`: FI multiplier (default 30 for FatFIRE)

**Returns**: FI number in ISK

**Example**:
```typescript
const fiNumber = calculateFINumber(16100000, 30);
// Returns: 483000000 (483M ISK)
```

**Multiplier Context**:
- **25x**: Standard FIRE (4% withdrawal rate)
- **28x**: Conservative FatFIRE (3.57% withdrawal)
- **30x**: Default FatFIRE (3.33% withdrawal) - **Recommended**
- **33x**: Very conservative FatFIRE (3.03% withdrawal)

---

#### `calculateWithdrawalRate(multiplier): number`
Converts multiplier to withdrawal rate percentage.

**Formula**: `(1 / multiplier) × 100`

**Example**:
```typescript
const rate = calculateWithdrawalRate(30);
// Returns: 3.33 (3.33%)
```

---

#### `calculateTimelineProjection(currentSavings, fiNumber, annualSavings, returnRate): number | null`
Calculates years to reach FI number with compound growth.

**Method**: Month-by-month iteration with compound interest

**Parameters**:
- `currentSavings`: Current portfolio value (ISK)
- `fiNumber`: Target FI number (ISK)
- `annualSavings`: Annual savings amount (ISK)
- `returnRate`: Expected annual return rate (e.g., 0.06 = 6%)

**Returns**:
- Years to reach FI (decimal)
- `0` if already at FI
- `null` if unreachable or unrealistic (>100 years)

**Example**:
```typescript
const years = calculateTimelineProjection(50000000, 483000000, 6000000, 0.06);
// Returns: 18.5 (approximately 18.5 years)
```

**Edge Cases**:
- Already at FI: Returns 0
- No savings + no growth: Returns null
- Coast FIRE (no savings, only growth): Calculates via logarithm
- Unrealistic timeline (>100 years): Returns null

---

#### `calculateMilestones(fiNumber, currentSavings, annualSavings, returnRate): Milestone[]`
Calculates progress milestones at 25%, 50%, 75%, and 100% of FI.

**Returns**: Array of Milestone objects with:
- `percentage`: 25, 50, 75, or 100
- `amount`: ISK amount at this milestone
- `projectedDate`: Date when milestone will be reached (null if cannot calculate)
- `yearsFromNow`: Years until milestone (null if cannot calculate)
- `label`: Icelandic label for display

**Example**:
```typescript
const milestones = calculateMilestones(483000000, 50000000, 6000000, 0.06);
// Returns: [
//   { percentage: 25, amount: 120750000, yearsFromNow: 4.75, ... },
//   { percentage: 50, amount: 241500000, yearsFromNow: 10.2, ... },
//   { percentage: 75, amount: 362250000, yearsFromNow: 14.8, ... },
//   { percentage: 100, amount: 483000000, yearsFromNow: 18.5, ... }
// ]
```

**Labels** (Icelandic):
- 25%: "25% FI - Fyrsta fjórðungur"
- 50%: "50% FI - Helmingi náð"
- 75%: "75% FI - Þrír fjórðu"
- 100%: "100% FI - FatFIRE náð! 🎉"

---

#### `calculateLifeEnergy(fiNumber, actualHourlyWage, yearsToFI, leanFireNumber?): FatFireLifeEnergy | null`
Converts FI number and timeline to work hours and years.

**Parameters**:
- `fiNumber`: FatFIRE number (ISK)
- `actualHourlyWage`: User's actual hourly wage (ISK/hour)
- `yearsToFI`: Years to reach FI (null if not applicable)
- `leanFireNumber`: Optional LeanFIRE number for comparison (ISK)

**Returns**: FatFireLifeEnergy object or null if no wage

**Example**:
```typescript
const lifeEnergy = calculateLifeEnergy(483000000, 2500, 18.5, 93000000);
// Returns: {
//   actualHourlyWage: 2500,
//   annualNetIncome: 5200000,
//   yearsOfWork: 92.9,  // FatFIRE requires 92.9 years of work
//   yearsToFI: 18.5,
//   leanFireComparison: {
//     leanFINumber: 93000000,
//     yearsOfWork: 17.9,  // LeanFIRE requires 17.9 years
//     difference: 75.0    // FatFIRE requires 75 extra years
//   }
// }
```

**Notes**:
- Returns null if actualHourlyWage is 0 or negative
- Annual net income assumes 2080 work hours/year
- LeanFIRE comparison shows "cost" of premium lifestyle

---

### Supporting Functions

#### `generateTimelineChartData(currentSavings, fiNumber, annualSavings, returnRate, yearsToFI): TimelineChartDataPoint[]`
Generates data points for portfolio growth visualization.

**Returns**: Array of yearly data points with:
- `year`: Year number (0 = now)
- `date`: Actual date
- `portfolioValue`: Projected portfolio value (ISK)
- `fiPercentage`: Percentage of FI number reached

**Usage**: For recharts LineChart component

---

#### `generateExpenseBreakdown(baseMonthly, wishListMonthly, splurgeMonthly): ExpenseBreakdownItem[]`
Creates expense breakdown for pie charts.

**Returns**: Array of breakdown items with:
- `category`: Category name in Icelandic
- `amount`: Monthly amount (ISK)
- `percentage`: Percentage of total
- `color`: Premium color for chart (gold/amber theme)

**Categories**:
- "Grunnútgjöld (Lúxus)" - Base deluxe expenses
- "Óskarlisti" - Wish list items
- "Aukaútgjaldaáætlun" - Splurge budget

---

#### `calculateFatFireResults(state, actualHourlyWage?, leanFireNumber?): FatFireResults`
**Master orchestration function** - Calculates all FatFIRE metrics from state.

**Parameters**:
- `state`: Complete FatFireState
- `actualHourlyWage`: Optional AWH for life energy
- `leanFireNumber`: Optional LeanFIRE number for comparison

**Returns**: Complete FatFireResults object with:
- Expense totals (base, wish list, splurge, total)
- Expense breakdown for visualization
- FI number with multiplier and withdrawal rate
- Must-have vs nice-to-have breakdowns
- Timeline projections (if savings data available)
- Milestones (25%, 50%, 75%, 100%)
- Current progress (if current savings available)
- Life energy metrics (if AWH available)
- Scenario comparisons (if scenarios exist)

**Example**:
```typescript
const results = calculateFatFireResults(state, 2500, 93000000);
```

**This is the main entry point for UI components.**

---

## Key Formulas

### FI Number
```
FI Number = Total Annual Expenses × Multiplier
```

### Total Annual Expenses
```
Total = (Base Monthly × 12) + (Wish List Must-Have × 12) + Splurge Annual
```

### Withdrawal Rate
```
Withdrawal Rate = (1 / Multiplier) × 100
```

### Timeline (Compound Interest)
```
Month-by-month iteration:
  balance += monthly_savings
  balance *= (1 + monthly_rate)

Continue until balance >= FI_number or max_months reached
```

### Years of Work (Life Energy)
```
Years of Work = FI Number / Annual Net Income
Annual Net Income = Actual Hourly Wage × 2080
```

---

## Dependencies
- `@/types/fatFire` - TypeScript types
- `@/lib/constants/fatFire` - Constants and defaults

## Tests
- **Location**: `apps/peninganaedalifid/src/lib/calculations/__tests__/fatFire.test.ts`
- **Coverage**: 59 unit tests, all passing
- **Test Groups**:
  - Total expenses calculation (6 tests)
  - Wish list totals (5 tests)
  - FI number calculation (6 tests)
  - Withdrawal rate (4 tests)
  - Timeline projection (10 tests)
  - Milestones (5 tests)
  - Life energy (6 tests)
  - Chart data generation (5 tests)
  - Expense breakdown (5 tests)
  - Integration (calculateFatFireResults) (17 tests)

## Integration
- **Used by**: FatFIRE UI components (to be implemented in Epic 3+)
- **Uses**: Constants from `fatFire.ts`
- **State Source**: FatFireState from CalculatorContext
- **Results Consumer**: FatFireCalculator page component

## Performance
- All calculations complete in <50ms
- Timeline projection capped at 100 years (1200 months)
- Memoization recommended in UI components
- No side effects - all pure functions

## Related
- Implements: Requirements FR-1, FR-3, FR-5, FR-7 from `specs/fat-fire/requirements-fat-fire.md`
- Part of: Epic 1 (Foundation) from `specs/fat-fire/tasks-fat-fire.md`
- Similar to: `calculations/savings.ts` (compound interest patterns)

## Icelandic Context
- Premium defaults: 700k ISK/month base (Reykjavík 101/105)
- Splurge budget: 1-3M ISK/year typical
- Higher multiplier: 30x standard (vs 25x for standard FIRE)
- International travel: 600k ISK/year (Iceland is remote)
- Labels and messages in Icelandic throughout

## Edge Cases Handled
- Negative values clamped to 0
- Already at FI returns 0 years
- Unrealistic timelines (>100 years) return null
- Coast FIRE scenario (no savings, only growth)
- Zero interest rate (simple savings calculation)
- Missing actual hourly wage (life energy returns null)
- Empty wish lists
- Zero splurge budgets

## Future Enhancements
- Monte Carlo simulations (Phase 2)
- Tax optimization (complex, varies by situation)
- Inflation adjustment over time
- Variable savings rates
- Sequence of returns risk analysis
