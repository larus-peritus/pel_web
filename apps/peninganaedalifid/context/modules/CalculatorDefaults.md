# Calculator Defaults Module

## Location
`apps/peninganaedalifid/src/lib/defaults.ts`

## Purpose
Provides default values and configuration constants for the Actual Hourly Wage Calculator. This module serves as the single source of truth for initial calculator state, ensuring consistency across the application.

## Exports

### Default Input Values

- **`DEFAULT_INCOME: IncomeInputs`** - Default income configuration
  - `grossAnnualIncome: 0` - User must enter their salary
  - `workHoursPerWeek: 40` - Standard full-time work week
  - `weeksWorkedPerYear: 50` - Accounts for 2 weeks vacation
  - `additionalIncome: 0` - No bonuses by default

- **`DEFAULT_MONEY_EXPENSES: MoneyExpenses`** - Default work-related money expenses (all annual amounts)
  - `commute: 0` - Gas, transit, parking, tolls, vehicle wear
  - `clothing: 0` - Work-specific clothing and maintenance
  - `meals: 0` - Lunches, coffee, snacks purchased due to work
  - `decompression: 0` - "Retail therapy" and unwinding costs
  - `childcareDelta: 0` - Extra childcare costs due to work
  - `other: 0` - Tools, professional dues, required education

- **`DEFAULT_TIME_EXPENSES: TimeExpenses`** - Default work-related time expenses (all weekly hours)
  - `commute: 0` - Round-trip weekly total
  - `gettingReady: 0` - Extra prep time for work
  - `decompression: 0` - Time needed to "recover" from work
  - `workIllness: 0` - Average sick time due to work stress/exposure

- **`DEFAULT_INPUTS: CalculatorInputs`** - Complete default calculator state
  - Combines all default values into a single object
  - Used as initial state for new calculator sessions

### Storage Configuration

- **`STORAGE_VERSION: number`** - Data structure version for migrations
  - Current value: `1` (initial implementation)
  - Increment when data structure changes to trigger migration logic

- **`STORAGE_KEY: string`** - localStorage key for persisting calculator state
  - Value: `'actual-hourly-wage-calculator'`
  - Used by storage layer to save/retrieve data

## Key Functionality

### Initial State Provider
- Provides sensible defaults for first-time users
- Most values start at 0 to encourage users to enter actual data
- Work configuration defaults to standard full-time (40h/week, 50 weeks/year)

### Type Safety
- Includes inline type definitions (temporary until Task 1 types are available)
- Will be refactored to import from `@/types/calculator` once types module exists
- Ensures all defaults match the expected calculator input structure

### Documentation
- Each export has comprehensive JSDoc comments
- Explains the purpose and units of each default value
- Provides context for why specific defaults were chosen

## Dependencies
- None (standalone module)
- Will import types from `@/types/calculator` after Task 1 is complete

## Tests
- **Location**: `apps/peninganaedalifid/tests/lib/defaults.test.ts`
- **Coverage**: 22 tests covering all exports and validation
  - Verifies all required properties exist
  - Validates default values (40h/week, 50 weeks/year)
  - Ensures all expense/time values start at 0
  - Checks type correctness (all numbers)
  - Validates storage constants (version = 1, valid key format)
  - Tests data immutability and independence

## Integration
- **Used by**:
  - Calculator state initialization (future)
  - Form reset functionality (future)
  - Storage layer for migration detection (future)

- **Uses**: None

## Related
- **Implements**: Task 2 from `specs/actual-hourly-wage-calculator/tasks.md`
- **Part of**: Actual Hourly Wage Calculator feature
- **Requires**: Type definitions from Task 1 (temporary inline types used for now)

## Design Decisions

### Why Start Most Values at Zero?
All expense and time values default to 0 to encourage users to actively consider and enter their actual costs. This prevents users from accepting potentially inaccurate preset values.

### Why 40 Hours and 50 Weeks?
These are standard US work expectations (40-hour full-time week, 52 weeks minus ~2 weeks vacation). Users can adjust if their situation differs.

### Storage Version System
Version tracking enables future data migrations when the calculator's data structure evolves. Version 1 represents the initial implementation.

## Future Enhancements
- Add preset configurations for common scenarios (e.g., "Tech Worker", "Retail Employee")
- Support different regional defaults (hours/vacation vary by country)
- Add validation ranges or warnings for unusual values
- Import types from centralized type definitions (after Task 1)
