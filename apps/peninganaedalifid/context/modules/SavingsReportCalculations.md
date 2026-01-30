# Savings Report Calculations

## Location
`apps/peninganaedalifid/src/lib/calculations/savingsReport.ts`

## Purpose
Pure calculation functions for the Savings Report feature. Computes totals, savings rates, life energy equivalents, and category breakdowns.

## Exports

### Core Calculation Functions

- `calculateTotalSavings(categories)` - Sums balances of all visible categories
- `calculateTotalMonthlyContribution(categories)` - Sums monthly contributions of all visible categories
- `calculateAnnualContribution(monthlyContribution)` - Calculates annual from monthly (× 12)

### Savings Rate Functions

- `calculateSavingsRate(monthlyContribution, monthlyGrossIncome)` - Calculates savings rate as percentage
- `getSavingsRateLevel(rate)` - Classifies rate into levels (critical/low/moderate/good/excellent/exceptional)
- `getSavingsRateContext(rate)` - Returns contextual message and FI estimate for a given rate

### Life Energy Functions

- `calculateSavingsLifeEnergy(totalBalance, totalMonthlyContribution, actualHourlyWage)` - Converts savings to work hours

### Breakdown Functions

- `calculateCategoryBreakdown(categories, totalSavings, actualHourlyWage)` - Generates per-category breakdown with percentages
- `calculateSavingsReportResults(report, actualHourlyWage, monthlyGrossIncome)` - Main orchestrator that computes all metrics

## Key Functionality

### Total Calculations
- Sums all non-hidden category balances and contributions
- Handles empty arrays and zero values gracefully
- Excludes hidden categories from all calculations

### Savings Rate Calculation
- Calculates as percentage of gross monthly income
- Returns null if income is unavailable, zero, or negative
- Supports rates over 100% (saving more than earning via investments)

### Life Energy Conversion
- Converts all monetary values to work hours
- Requires actual hourly wage from AWH calculator
- Returns null if AWH is unavailable or invalid
- Calculates for total balance, monthly, and annual contributions

### Category Breakdown
- Computes percentage of total for each category
- Includes life energy per category when AWH available
- Preserves category metadata (name, icon)

### Savings Rate Context
- Maps rate to 6 levels with Icelandic messages
- Provides FI timeline estimates based on rate
- Critical rates may have null FI estimate (too low to calculate)

## Dependencies

- `@/types/savingsReport` - All TypeScript types
- `@/lib/constants/savingsReport` - Thresholds and messages

## Tests

- Location: `apps/peninganaedalifid/tests/lib/calculations/savingsReport.test.ts`
- Coverage: 49 tests covering all functions
- Edge Cases:
  - Empty category arrays
  - Hidden categories
  - Zero balances and contributions
  - Null/undefined/zero/negative AWH and income
  - Savings rates over 100%
  - All savings rate threshold boundaries

## Integration

- Used by: CalculatorContext (planned) for auto-calculating results
- Part of: Savings Report feature (Epic 1)
- Related: Current Expense Report calculations pattern

## Related

- Implements: FR-3.1-3.7 from specs/savings-report/requirements-savings-report.md
- Part of: Task 1.3 from specs/savings-report/tasks-savings-report.md
- Follows: Calculation pattern from wage.ts and breakdown.ts

## Design Decisions

### Pure Functions
All functions are pure with no side effects, making them easy to test and reason about.

### Null Returns for Missing Data
Functions return null (not zero) when required data is unavailable, allowing UI to distinguish between "zero" and "not calculated".

### Hidden Category Handling
Hidden categories are filtered at the calculation level, not in the UI, ensuring consistent totals.

### Life Energy Optional
Life energy calculations gracefully degrade when AWH is unavailable, allowing the feature to work without it.
