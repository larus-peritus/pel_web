# Expense Baseline Types

## Location
`/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/src/types/expenseBaseline.ts`

## Purpose
TypeScript type definitions for the Expense Baseline Tool. Defines the data structures for three-tier expense tracking, categories, calculation results, and localStorage persistence.

## Exports

### Core Types

#### `ExpenseTier`
Type representing the three spending levels:
- `'barebones'` - Minimum needed to survive
- `'comfortable'` - Pleasant quality of life
- `'deluxe'` - Ideal circumstances without worry

#### `TierValues`
Interface for monetary or numeric values across all three tiers:
```typescript
interface TierValues {
  barebones: number;
  comfortable: number;
  deluxe: number;
}
```

### Configuration Types

#### `ExpenseCategoryConfig`
Default category configuration with Icelandic defaults:
- `id: string` - Unique identifier
- `nameIs: string` - Icelandic name
- `nameEn: string` - English reference name
- `icon: string` - Emoji icon
- `description: string` - Icelandic help text
- `defaults: TierValues` - Default ISK values
- `subcategories?: string[]` - Optional subcategories

### Data Structures

#### `ExpenseCategory`
Individual expense category with user values:
- `id: string` - Unique identifier
- `name: string` - Icelandic display name
- `icon: string` - Emoji icon
- `values: TierValues` - Monthly expense values
- `isCustom: boolean` - User-created vs default
- `isHidden: boolean` - Hidden from display
- `order: number` - Display order

#### `ExpenseBaseline`
Complete baseline data structure:
- `categories: ExpenseCategory[]` - All categories
- `lastUpdated: Date` - Last modification timestamp
- `wizardCompleted: boolean` - Setup wizard completion status
- `version: number` - Schema version for migrations

### Results Types

#### `LifeEnergyResults`
Life energy calculation results:
- `monthly: TierValues` - Work hours per month
- `annual: TierValues` - Work hours per year
- `perCategory: Record<string, TierValues>` - Hours per category

#### `TierDifference`
Cost difference between two tiers:
- `isk: number` - ISK difference per month
- `hours: number | null` - Work hours difference

#### `TierDifferences`
All tier combinations:
- `bareToComfortable: TierDifference`
- `comfortableToDeluxe: TierDifference`
- `bareToDeluxe: TierDifference`

#### `ExpenseBaselineResults`
Complete calculation results:
- `totals: TierValues` - Monthly totals
- `annualTotals: TierValues` - Annual totals
- `percentageBreakdown: Record<string, TierValues>` - Category percentages
- `lifeEnergy: LifeEnergyResults | null` - Work hours (null if no AWH)
- `tierDifferences: TierDifferences` - Tier upgrade costs
- `categoryCount: number` - Total categories
- `activeCategories: number` - Visible categories

### Persistence Types

#### `StoredExpenseCategory`
Simplified category for JSON serialization:
- Same structure as `ExpenseCategory`

#### `StoredExpenseBaseline`
Simplified baseline for localStorage:
- `categories: StoredExpenseCategory[]`
- `lastUpdated: string` - ISO date string
- `wizardCompleted: boolean`
- `version: number`

## Key Concepts

### Three-Tier Philosophy
Based on "Your Money or Your Life" methodology:
1. **Barebones** - Survival minimum, bare essentials only
2. **Comfortable** - Enjoyable life without excess
3. **Deluxe** - All wants satisfied, no financial worry

### Category Structure
Categories can be:
- Default (10 pre-defined Icelandic categories)
- Custom (user-created categories)
- Hidden (temporarily excluded from calculations)

### Life Energy
Converts money to time (work hours) based on actual hourly wage. Central concept in YMYL philosophy - shows how much life energy (time) is required to pay for different expense levels.

## Dependencies
None - this is a pure types module

## Integration
- Used by: `src/lib/calculations/expenseBaseline.ts`
- Used by: UI components (to be implemented)
- Used by: CalculatorContext (to be implemented)

## Related
- Implements: Requirements FR-1, FR-2, FR-3 from `specs/expense-baseline/requirements-expense-baseline.md`
- Part of: EPIC 1 Task 1.1 from `specs/expense-baseline/tasks-expense-baseline.md`
- Referenced in: Design document `specs/expense-baseline/design-expense-baseline.md` Section 4.1

## Implementation Notes

### All Values in ISK
All monetary values are in Icelandic Króna (ISK). No currency abstraction needed for this Iceland-specific application.

### Monthly vs Annual
Base values are monthly. Annual values are calculated (monthly * 12).

### Null Safety
Life energy results can be null when actual hourly wage is not available. This is intentional and should be handled by UI components.

### Schema Versioning
The `version` field enables future data migrations if the schema changes.
