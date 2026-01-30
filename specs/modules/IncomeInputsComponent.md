# IncomeInputs Component

## Location
`apps/peninganaedalifid/src/components/calculator/IncomeInputs.tsx`

## Purpose
Provides the income input section for the Actual Hourly Wage Calculator, allowing users to enter their gross annual income, work schedule (hours and weeks), and any additional income sources.

## Exports
- `function IncomeInputs()` - React component for income data entry

## Key Functionality
- Displays four income-related inputs in a clean card layout
- Uses CurrencyInput for monetary values (gross income, additional income)
- Uses NumberInput for schedule values (hours per week, weeks per year)
- Connects to CalculatorContext for state management
- Provides real-time updates to calculator state
- Includes descriptive help text for each field
- Full accessibility with ARIA attributes and proper labels

## Component Structure

### Inputs
1. **Gross Annual Income** (CurrencyInput)
   - User's total salary before taxes
   - Currency formatted display
   - Default: $0.00

2. **Hours per Week** (NumberInput)
   - Work hours per week
   - Range: 1-100 hours
   - Default: 40 hours

3. **Weeks per Year** (NumberInput)
   - Weeks worked per year
   - Range: 1-52 weeks
   - Default: 50 weeks

4. **Additional Income** (CurrencyInput, Optional)
   - Bonuses, side income, or other earnings
   - Currency formatted display
   - Default: $0.00

### Layout
- Card component with elevated variant (shadow)
- CardHeader with title and description
- CardContent with 4px spacing between fields
- Hours and weeks in 2-column grid on desktop
- All fields stack on mobile

## Dependencies
- React (useState, useCallback)
- @/context/CalculatorContext - State management
- @/components/ui/CurrencyInput - Currency input component
- @/components/ui/NumberInput - Number input component
- @/components/ui/Card - Card container and sub-components

## Integration
- **Used by**: Calculator page (to be implemented in Task 24)
- **Uses**:
  - CalculatorContext via useCalculator hook
  - updateIncome() function for partial updates
  - Card components for layout
  - CurrencyInput and NumberInput for form controls

## Accessibility Features
- All inputs have associated labels via htmlFor/id
- ARIA describedby attributes link help text to inputs
- Semantic HTML structure
- Keyboard navigable
- Screen reader compatible
- Proper input types and attributes

## State Management
- All inputs are controlled components
- Values come from CalculatorContext.inputs.income
- Updates use useCallback memoization for performance
- Each input has dedicated change handler
- Changes trigger auto-save to localStorage (via context)

## Testing
- Location: `tests/components/calculator/IncomeInputs.test.tsx`
- Coverage: 23 unit tests, all passing
- Tests cover:
  - Component rendering
  - Default values display
  - Input interactions
  - Accessibility attributes
  - Validation constraints
  - Layout structure

## Related
- Implements: Requirements from `specs/actual-hourly-wage-calculator/requirements.md`
- Part of: Task 11 in `specs/actual-hourly-wage-calculator/tasks.md`
- Follows design: `specs/actual-hourly-wage-calculator/design.md`

## Implementation Date
2026-01-19
