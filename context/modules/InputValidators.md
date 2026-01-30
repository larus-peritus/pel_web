# Input Validators

## Location
`apps/peninganaedalifid/src/lib/utils/validators.ts`

## Purpose
Provides comprehensive input validation for the Actual Hourly Wage Calculator, ensuring all user inputs meet requirements and constraints before calculations are performed.

## Exports
- `function validateInputs(inputs: CalculatorInputs): ValidationResult` - Validates all calculator inputs at once
- `function validateField(section, field, value): string | null` - Validates a single field value

## Key Functionality

### Full Input Validation
The `validateInputs` function validates all calculator inputs comprehensively:
- Income validation (gross income, work hours, weeks worked, additional income)
- Money expenses validation (all 6 expense categories)
- Time expenses validation (all 4 time categories)
- Returns structured validation result with field-specific error messages

### Single Field Validation
The `validateField` function validates individual fields for real-time feedback:
- Section-aware validation (income, moneyExpenses, timeExpenses)
- Field-specific rules (hours range, weeks range, etc.)
- Returns error message string or null if valid

## Validation Rules

### Income Section
- `grossAnnualIncome`: Must be >= 0, warns if > $100M
- `workHoursPerWeek`: Must be 1-100 hours
- `weeksWorkedPerYear`: Must be 1-52 weeks
- `additionalIncome`: Must be >= 0

### Money Expenses Section
All fields (commute, clothing, meals, decompression, childcareDelta, other):
- Must be >= 0
- Warns if > $1M

### Time Expenses Section
All fields (commute, gettingReady, decompression, workIllness):
- Must be >= 0
- Warns if > 40 hours/week

## Dependencies
- `@/types/calculator` - TypeScript interfaces (CalculatorInputs, ValidationResult)

## Tests
- Location: `apps/peninganaedalifid/tests/lib/utils/validators.test.ts`
- Coverage: 23 test cases covering:
  - Valid inputs pass validation
  - Negative values rejected
  - Out-of-range values rejected
  - Upper limit warnings
  - Multiple error accumulation
  - Edge cases (zero values, boundary values)
  - Single field validation

## Integration
- Used by: Calculator input components (future)
- Uses: Calculator types from `@/types/calculator`

## Related
- Implements: Requirements US-1 from specs/actual-hourly-wage-calculator/requirements.md
- Part of: Task 6 from specs/actual-hourly-wage-calculator/tasks.md
- Dependencies: Task 1 (TypeScript Types)
