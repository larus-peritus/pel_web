# Calculator Types

## Location
`apps/peninganaedalifid/src/types/calculator.ts`

## Purpose
Defines all TypeScript interfaces and types for the Actual Hourly Wage Calculator feature, providing type safety and documentation for the entire calculator system.

## Exports

### Input Types
- `interface IncomeInputs` - User's income and work schedule inputs
- `interface MoneyExpenses` - Annual work-related money expenses
- `interface TimeExpenses` - Weekly work-related time expenses
- `interface CalculatorInputs` - Complete calculator input state

### Result Types
- `interface CalculationResults` - Calculated wage and breakdown results
- `interface ExpenseBreakdownItem` - Individual expense item for charts
- `interface TimeBreakdownItem` - Individual time allocation item for charts

### State Management Types
- `interface Scenario` - Saved scenario for comparison
- `interface Preset` - Preset configuration for quick input
- `interface StoredState` - Complete app state for localStorage persistence

### Validation Types
- `interface ValidationResult` - Validation result with errors

## Key Functionality

### IncomeInputs
Fields:
- `grossAnnualIncome: number` - Annual salary before taxes
- `workHoursPerWeek: number` - Standard work hours (default: 40)
- `weeksWorkedPerYear: number` - Weeks worked (default: 50)
- `additionalIncome: number` - Bonuses, etc. (default: 0)

### MoneyExpenses
Fields (all annual amounts):
- `commute: number` - Gas, transit, parking, tolls, vehicle wear
- `clothing: number` - Work-specific clothing
- `meals: number` - Lunches, coffee, snacks at work
- `decompression: number` - "Retail therapy", unwinding costs
- `childcareDelta: number` - Extra childcare due to work
- `other: number` - Tools, dues, education, etc.

### TimeExpenses
Fields (all weekly hours):
- `commute: number` - Round-trip weekly commute time
- `gettingReady: number` - Extra prep time for work
- `decompression: number` - Time to "recover" from work
- `workIllness: number` - Weekly average of sick time

### CalculationResults
Comprehensive results including:
- Wage calculations (nominal, actual, percentage reduction)
- Financial totals (net income, total expenses)
- Time totals (base hours, extra hours, total hours)
- Life energy calculations (annual hours)
- Breakdown arrays for visualization

## Dependencies
None (pure TypeScript type definitions)

## Tests
Type definitions are validated through TypeScript compiler and usage in dependent modules.

## Integration
- Used by: All calculator modules and components
- Foundation for: Validation, calculations, state management, UI components

## Related
- Implements: Task 1 from specs/actual-hourly-wage-calculator/tasks.md
- Based on: Design spec in specs/actual-hourly-wage-calculator/design.md
- Book reference: "Your Money or Your Life" Chapter 2
