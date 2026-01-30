# Expense Inputs Component

## Location
`apps/peninganaedalifid/src/components/calculator/ExpenseInputs.tsx`

## Purpose
Provides a comprehensive input interface for all work-related money expenses in the Life Energy Calculator. Displays six expense categories with real-time total calculation and formatted currency inputs.

## Exports
- `ExpenseInputs` - Main component for money expense inputs

## Key Functionality

### Expense Categories
Displays inputs for all 6 work-related money expense categories:
1. **Commute Costs** - Gas, transit, parking, tolls, vehicle wear
2. **Work Clothing** - Professional attire, uniforms, dry cleaning
3. **Work Meals** - Lunches out, coffee, snacks at work
4. **Decompression Spending** - "Retail therapy" and unwinding costs
5. **Extra Childcare** - Additional childcare costs due to work
6. **Other Work Expenses** - Tools, dues, education, home office

### Real-time Total Calculation
- Automatically calculates sum of all expense categories
- Displays total prominently in card header
- Updates instantly when any expense changes
- Total displayed in error-600 color (red) to indicate costs

### Currency Input Integration
- Uses CurrencyInput component for all fields
- Automatic formatting (displays as $X,XXX.XX when not focused)
- Accepts numeric input only
- Handles decimals and paste operations correctly

### Accessibility Features
- Proper label associations for all inputs
- Unique IDs for each input field
- ARIA `aria-describedby` linking inputs to descriptions
- Help text for each field explaining what to include
- Screen reader friendly

### Card-based Layout
- Wrapped in elevated Card component
- CardHeader with title, subtitle, and total display
- CardContent with vertically stacked inputs
- Consistent spacing (space-y-4) between fields

## Component Structure

```tsx
<Card variant="elevated">
  <CardHeader>
    <div> // Title and subtitle
    <div> // Total calculation display
  </CardHeader>
  <CardContent>
    {EXPENSE_FIELDS.map(field => (
      <div>
        <label>
        <CurrencyInput>
        <p> // Help text
      ))}
  </CardContent>
</Card>
```

## Dependencies
- `@/context/CalculatorContext` - State management and updateMoneyExpenses
- `@/components/ui/CurrencyInput` - Formatted currency input component
- `@/components/ui/Card` - Card container components
- `@/lib/utils` - formatCurrency utility function
- `@/types/calculator` - MoneyExpenses type definition
- `react` - useCallback hook

## Tests
- Location: `tests/components/calculator/ExpenseInputs.test.tsx`
- Coverage: 18 tests, all passing
  - Rendering: 4 tests (card, fields, descriptions, total)
  - Accessibility: 3 tests (labels, aria-describedby, IDs)
  - User Interaction: 7 tests (single/multiple updates, totals, decimals, zeros)
  - Total Calculation: 2 tests (all expenses, recalculation)
  - Styling: 2 tests (error color, spacing)
  - Integration: 1 test (default values)

## Integration
- Used by: Main calculator page (will be integrated in Task 24)
- Uses:
  - CalculatorContext for state management
  - CurrencyInput for all expense inputs
  - Card components for layout structure
  - formatCurrency for total display

## Related
- Implements: Task 12 from specs/actual-hourly-wage-calculator/tasks.md
- Requirements: US-1 (Calculate Actual Hourly Wage), US-2 (See Detailed Breakdown)
- Design: specs/actual-hourly-wage-calculator/design.md (ExpenseInputs section)
- Dependencies: Task 9 (Calculator Context), base UI components

## Implementation Details

### Field Configuration
All expense fields are defined in the `EXPENSE_FIELDS` constant array with:
- `key`: Property name in MoneyExpenses interface
- `label`: Display label for the input
- `description`: Help text explaining what to include
- `placeholder`: Example value for user guidance

### State Management
- Reads current expense values from `inputs.moneyExpenses` in context
- Uses `updateMoneyExpenses` callback to update individual expenses
- Memoizes `handleExpenseChange` with useCallback for performance

### Total Calculation
```typescript
const totalExpenses = Object.values(moneyExpenses).reduce(
  (sum, val) => sum + val,
  0
);
```
- Sums all expense values from the moneyExpenses object
- Recalculates automatically when any expense changes (React re-render)
- Formatted using formatCurrency for display

### Styling Classes
- Card: `variant="elevated"` for shadow and border
- Header Title: `text-xl font-semibold text-neutral-900`
- Header Subtitle: `text-sm text-neutral-600`
- Total Label: `text-sm text-neutral-600`
- Total Amount: `text-lg font-semibold text-error-600` (red to indicate costs)
- Field Labels: `text-sm font-medium text-neutral-700 mb-1`
- Help Text: `text-xs text-neutral-500 mt-1`
- Content Spacing: `space-y-4` (1rem between fields)

## User Experience

### Expected Workflow
1. User sees card with "Work Expenses" title
2. Total starts at $0.00
3. User enters values in any expense field
4. Total updates automatically as each field is modified
5. Currency formatting applies when user moves to next field
6. All values persist automatically via context

### Visual Feedback
- Total displayed prominently in card header for easy reference
- Red color (error-600) for total emphasizes these are costs
- Help text under each field guides user on what to include
- Currency formatting provides immediate validation

## Future Enhancements (Out of Scope)
- Preset selector integration for common expense profiles
- Expense comparison charts/visualizations
- Breakdown by category percentage
- Import from previous year's expenses
- Expense trend analysis
