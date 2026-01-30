# Expense Baseline Calculations

## Location
`/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/src/lib/calculations/expenseBaseline.ts`

## Purpose
Pure calculation functions for the Expense Baseline Tool. Performs all mathematical operations for calculating expense totals, percentages, life energy (work hours), and tier differences across the three spending tiers (Barebones/Comfortable/Deluxe).

## Exports

### Types (re-exported from @/types/expenseBaseline)
- `ExpenseTier` - Type representing three spending levels
- `TierValues` - Interface for values across all three tiers
- `ExpenseCategory` - Individual expense category structure
- `ExpenseBaseline` - Complete baseline data structure
- `LifeEnergyResults` - Life energy calculation results
- `TierDifference` - Difference between two tiers
- `TierDifferences` - All tier combinations
- `ExpenseBaselineResults` - Complete calculation results

### Functions

#### Core Calculations
- `calculateTierTotals(categories): TierValues` - Sum all non-hidden categories per tier
- `calculateAnnualTotals(monthlyTotals): TierValues` - Multiply monthly by 12
- `calculatePercentageBreakdown(categories, totals): Record<string, TierValues>` - Category percentages
- `calculateLifeEnergy(totals, categories, actualHourlyWage): LifeEnergyResults | null` - Work hours required
- `calculateTierDifferences(totals, actualHourlyWage): TierDifferences` - Cost to upgrade lifestyle
- `calculateExpenseBaselineResults(baseline, actualHourlyWage): ExpenseBaselineResults` - Main orchestrator

#### Helper Functions
- `getExpenseByTier(baseline, tier): number` - Get monthly expense for specific tier
- `getAnnualExpenseByTier(baseline, tier): number` - Get annual expense for specific tier
- `hasExpenseBaseline(baseline): boolean` - Check if baseline is set up

## Key Functionality

### Tier Totals Calculation
Sums all non-hidden expense categories to get monthly totals for each of the three tiers. Hidden categories are explicitly excluded from all calculations.

**Example:**
```typescript
const totals = calculateTierTotals(categories);
// Returns: { barebones: 175000, comfortable: 310000, deluxe: 550000 }
```

### Life Energy Calculation
Converts ISK expenses to work hours based on actual hourly wage from the AWH calculator. Returns null if AWH is not available, zero, or negative. Calculates both monthly and annual hours, plus per-category breakdown.

**Example:**
```typescript
const lifeEnergy = calculateLifeEnergy(totals, categories, 2500);
// Returns: {
//   monthly: { barebones: 100, comfortable: 208, deluxe: 400 },
//   annual: { barebones: 1200, comfortable: 2496, deluxe: 4800 },
//   perCategory: { husnaedi: { barebones: 48, comfortable: 80, deluxe: 140 } }
// }
```

### Tier Differences
Calculates how much more (in ISK and work hours) each tier costs compared to the tier below it. Useful for understanding the cost of lifestyle upgrades.

**Example:**
```typescript
const diffs = calculateTierDifferences(totals, 2500);
// Returns: {
//   bareToComfortable: { isk: 270000, hours: 108 },
//   comfortableToDeluxe: { isk: 480000, hours: 192 },
//   bareToDeluxe: { isk: 750000, hours: 300 }
// }
```

## Dependencies
- `@/types/expenseBaseline` - Type definitions

## Tests
- Location: `src/lib/calculations/__tests__/expenseBaseline.test.ts`
- Coverage: 37 test cases covering:
  - Tier totals with various category configurations
  - Hidden category exclusion
  - Annual total calculations
  - Percentage breakdown accuracy
  - Life energy with and without AWH
  - Tier differences (ISK and hours)
  - Edge cases (empty arrays, zero values, null AWH)
  - Complete results orchestration

## Integration
- Used by: ExpenseBaseline UI components (to be implemented)
- Uses: Actual hourly wage from main calculator context
- Consumed by: FI Number calculator, Savings Rate calculator, other FIRE tools

## Related
- Implements: Requirements FR-3.1 through FR-3.5 from `specs/expense-baseline/requirements-expense-baseline.md`
- Part of: EPIC 1 Task 1.3 from `specs/expense-baseline/tasks-expense-baseline.md`
- Types defined in: `src/types/expenseBaseline.ts`

## Implementation Notes

### Pure Functions
All functions are pure (no side effects) and deterministic. Given the same inputs, they always return the same outputs. This makes them easy to test and reason about.

### Hidden Category Handling
All calculation functions explicitly filter out hidden categories before performing calculations. This ensures that categories marked as hidden do not affect totals, percentages, or life energy calculations.

### Null Safety
Life energy calculations return `null` when actual hourly wage is not available, zero, or negative. Consuming components should check for null before displaying life energy results.

### Icelandic ISK
All monetary values are in Icelandic Króna (ISK). No currency conversion is performed.
