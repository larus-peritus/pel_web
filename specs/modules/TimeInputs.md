# TimeInputs Component

## Location
`apps/peninganaedalifid/src/components/calculator/TimeInputs.tsx`

## Purpose
Provides a user interface for entering time-related work expenses (weekly hours) for the Actual Hourly Wage Calculator. This component displays input fields for all categories of hidden time costs associated with work.

## Component Type
Client-side React component (`'use client'` directive)

## Props
None - uses CalculatorContext for state management

## Key Functionality

### Time Expense Fields
- **Commute Time**: Total round-trip commute time per week
- **Getting Ready**: Extra preparation time for work beyond normal
- **Decompression Time**: Time needed to recover from work each week
- **Work-Related Illness**: Average weekly hours lost to work stress/illness

### Features
- All fields use `NumberInput` component with:
  - Min: 0 hours
  - Max: 40 hours
  - Step: 0.5 hours (30-minute increments)
- Displays "hrs/week" suffix for clarity
- Shows real-time total of all extra hours
- Integrates with CalculatorContext for automatic state updates
- Full accessibility support with labels and descriptions

### Display
- Organized in a Card with elevated variant
- Header shows title and total extra hours
- Total displayed in warning color to emphasize impact
- Each field includes:
  - Label
  - Number input
  - Unit suffix (hrs/week)
  - Description text

## Dependencies
- `@/context/CalculatorContext` - State management
- `@/components/ui/NumberInput` - Number input component
- `@/components/ui/Card` - Card container components
- `@/types/calculator` - TypeScript types

## Exports
- `TimeInputs` - Main component function

## State Management
Uses `useCalculator()` hook to:
- Read current time expenses from context
- Update time expenses via `updateTimeExpenses()`
- Automatically trigger recalculation of actual wage

## Internal State
- TIME_FIELDS constant defining all time expense categories
- Memoized total calculation using `useCallback`

## Styling
- Card layout with header and content sections
- Flexbox layout for input + suffix alignment
- Responsive spacing with Tailwind CSS
- Warning color (#f59e0b) for total to highlight impact

## Accessibility
- All inputs have proper labels via `<label>` elements
- Unique IDs for each input (e.g., `time-commute`)
- Description paragraphs with matching IDs (e.g., `time-commute-desc`)
- Semantic HTML structure
- Type="number" for appropriate mobile keyboards

## Tests
- Location: `tests/components/calculator/TimeInputs.test.tsx`
- Coverage: 21 tests, all passing
- Test categories:
  - Rendering (5 tests)
  - Input functionality (6 tests)
  - Total calculation (2 tests)
  - Input constraints (3 tests)
  - Accessibility (5 tests)

## Usage Example
```tsx
import { TimeInputs } from '@/components/calculator/TimeInputs';
import { CalculatorProvider } from '@/context/CalculatorContext';

function CalculatorPage() {
  return (
    <CalculatorProvider>
      <TimeInputs />
    </CalculatorProvider>
  );
}
```

## Integration
- Part of the Actual Hourly Wage Calculator feature
- Implements requirements from US-1 (input time expenses)
- Data flows to calculation engine via context
- Used alongside IncomeInputs and ExpenseInputs components

## Related
- Implements: Requirements US-1 from `specs/actual-hourly-wage-calculator/requirements.md`
- Part of: Task 13 from `specs/actual-hourly-wage-calculator/tasks.md`
- Uses: CalculatorContext, NumberInput, Card components
- Design: `specs/actual-hourly-wage-calculator/design.md`
