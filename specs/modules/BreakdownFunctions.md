# Breakdown Functions Module

## Location
`apps/peninganaedalifid/src/lib/calculations/breakdown.ts`

## Purpose
Transforms expense and time data into structured breakdown items suitable for charts, tables, and detailed visualizations. Provides formatted data with life energy calculations, percentages, and human-readable labels.

## Exports

### Functions

- `generateExpenseBreakdown(expenses: MoneyExpenses, actualWage: number): ExpenseBreakdownItem[]`
  - Converts money expenses into breakdown items for visualization
  - Calculates life energy hours for each expense
  - Calculates percentage of total expenses
  - Filters out zero-value items
  - Returns items sorted by amount (descending)

- `generateTimeBreakdown(timeExpenses: TimeExpenses, baseWorkHours: number, weeksPerYear: number): TimeBreakdownItem[]`
  - Converts time expenses into breakdown items
  - Includes base work hours as first category
  - Calculates annual hours for each category
  - Calculates percentage of total time
  - Filters out zero-value time expenses

- `getTotalExpenses(breakdown: ExpenseBreakdownItem[]): number`
  - Sums all expense amounts from a breakdown array

- `getTotalWeeklyHours(breakdown: TimeBreakdownItem[]): number`
  - Sums all weekly hours from a breakdown array

### Constants

- `EXPENSE_LABELS`: Record of human-readable labels for expense categories
  - commute: "Commute Costs"
  - clothing: "Work Clothing"
  - meals: "Work Meals"
  - decompression: "Decompression Spending"
  - childcareDelta: "Extra Childcare"
  - other: "Other Work Expenses"

- `TIME_LABELS`: Record of human-readable labels for time categories
  - commute: "Commute Time"
  - gettingReady: "Getting Ready"
  - decompression: "Decompression Time"
  - workIllness: "Work-Related Illness"

## Key Functionality

### Expense Breakdown Generation
- Maps raw expense data to structured breakdown items
- Each item includes:
  - Category identifier
  - Human-readable label
  - Dollar amount
  - Life energy hours (calculated using actual wage)
  - Percentage of total expenses
- Zero and negative values are filtered out
- Results sorted by amount (highest to lowest)

### Time Breakdown Generation
- Includes base work hours as primary category
- Maps time expenses to breakdown items
- Each item includes:
  - Category identifier
  - Human-readable label
  - Hours per week
  - Hours per year (calculated using weeks per year)
  - Percentage of total time
- Zero-value time expenses filtered out
- Base work hours always included as first item

### Data Aggregation
- Helper functions to sum totals from breakdown arrays
- Useful for verification and display of totals

## Dependencies
- `@/types/calculator` - Type definitions for MoneyExpenses, TimeExpenses, ExpenseBreakdownItem, TimeBreakdownItem
- `./lifeEnergy` - dollarsToLifeEnergy function for life energy calculations

## Tests
- Location: `tests/lib/calculations/breakdown.test.ts`
- Coverage: 19 comprehensive tests
  - generateExpenseBreakdown: sorting, filtering, percentages, life energy, edge cases
  - generateTimeBreakdown: base hours, filtering, annual calculation, percentages, edge cases
  - getTotalExpenses: summation and empty array handling
  - getTotalWeeklyHours: summation and empty array handling

### Test Categories
1. **Expense Breakdown Tests (8 tests)**
   - Sorting by amount (descending)
   - Filtering zero values
   - Filtering negative values
   - Percentage calculation accuracy
   - Life energy hours calculation
   - Empty expense handling
   - Label correctness
   - Zero wage edge case

2. **Time Breakdown Tests (7 tests)**
   - Base work hours as first item
   - Zero time expense filtering
   - Annual hours calculation
   - Percentage calculation accuracy
   - Zero extra time handling
   - Label correctness
   - Zero base hours edge case

3. **Aggregation Tests (4 tests)**
   - Expense total calculation
   - Empty expense breakdown handling
   - Weekly hours total calculation
   - Empty time breakdown handling

## Integration

### Used by
- `calculateResults()` in wage.ts (for complete calculation results)
- Chart components (future implementation)
- Breakdown display components (future implementation)

### Uses
- `dollarsToLifeEnergy()` from lifeEnergy.ts
- Type definitions from calculator types

## Related
- Implements: Requirements REQ-CALC-1, REQ-VIS-1 from `specs/actual-hourly-wage-calculator/requirements.md`
- Part of: Actual Hourly Wage Calculator feature design
- Task: Task 5 from `specs/actual-hourly-wage-calculator/tasks.md`

## Implementation Notes
- All functions are pure (no side effects)
- Zero division safety built-in (percentages default to 0 if total is 0)
- Comprehensive edge case handling
- Performance optimized with single-pass processing
- Human-readable labels separated from logic for easy maintenance
