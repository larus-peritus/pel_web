# BreakdownChart Component

## Location
`apps/peninganaedalifid/src/components/calculator/BreakdownChart.tsx`

## Purpose
Displays a visual breakdown of how gross income is reduced by work-related expenses, showing a waterfall-style chart from gross income to net income using pure CSS (no external chart library).

## Exports
- `BreakdownChart` - React component displaying income breakdown chart

## Key Functionality
- Displays gross income bar at the top with success color (green)
- Shows each expense category as a deduction with error color (red)
- Progress bars sized relative to gross income
- Displays net income at the bottom with color-coded bar based on retention percentage:
  - Success (green) when retention >= 80%
  - Primary (blue) when retention >= 60% and < 80%
  - Warning (yellow) when retention >= 40% and < 60%
  - Error (red) when retention < 40%
- Shows percentage of gross income retained
- Smooth animations with 500ms transitions
- Gracefully returns null when no results are available

## Component Structure
```tsx
<Card variant="outlined">
  <CardHeader>
    <h3>Income Breakdown</h3>
    <p>How work expenses reduce your take-home pay</p>
  </CardHeader>
  <CardContent>
    {/* Gross Income Bar */}
    <div>Gross Income: $55,000</div>

    {/* Expense Deductions */}
    {expenseBreakdown.map(expense => (
      <div>- {expense.label}: -${expense.amount}</div>
    ))}

    {/* Net Income Bar */}
    <div>Net Work Income: $45,000 (81.8% retained)</div>
  </CardContent>
</Card>
```

## Props
None - Component uses `useCalculator` hook to access calculator state directly.

## Dependencies
- `@/context/CalculatorContext` - For accessing results and inputs via useCalculator hook
- `@/components/ui/Card` - For Card, CardHeader, CardContent components
- `@/lib/utils` - For formatCurrency and cn utilities
- React - For component functionality

## CSS Implementation Details
- Uses CSS for all visualizations (no chart library required for MVP)
- Progress bars created with nested divs and width percentages
- Gradient backgrounds for visual depth
- Color-coded based on semantic meaning:
  - Success colors (green) for positive values
  - Error colors (red) for expenses and deductions
  - Dynamic colors (success/primary/warning/error) for net income based on retention
- Expense bars scaled by 5x for better visibility (expense width * 5)
- All bars use `transition-all duration-500` for smooth value changes

## Visual Design
- Gross income: Full-width green bar with gradient
- Expense items: Red bars scaled to show relative impact
- Net income: Color-coded bar showing percentage of gross income
- Spacing: 6-unit vertical spacing between sections
- Border separator between expenses and net income

## Integration
- Used by: Main calculator page to display income/expense waterfall
- Uses:
  - CalculatorContext for results.expenseBreakdown, results.totalMoneyExpenses, results.netAnnualIncome
  - CalculatorContext for inputs.income (to calculate gross income)

## Edge Cases Handled
- Returns null when results is null (before calculation or with invalid inputs)
- Handles zero gross income (displays $0.00 and 0.0% retained)
- Handles empty expense breakdown (only shows gross and net income)
- Handles negative net income (expenses > income)
- Prevents progress bars from exceeding 100% width with Math.min()
- Zero-division safety for percentage calculations

## Accessibility
- Semantic HTML with h3 heading for section title
- Descriptive text for all currency values
- Color-coded with sufficient contrast ratios
- Text labels supplement color coding (not color-dependent)

## Testing
- Location: `tests/components/calculator/BreakdownChart.test.tsx`
- Coverage: 22 tests covering all functionality
- Test categories:
  - Rendering (null handling, basic rendering)
  - Gross income display (label, amount, additional income)
  - Expense breakdown display (categories, amounts, progress bars, empty state)
  - Net income display (label, amount, percentage retained)
  - Color coding (all 4 retention percentage tiers)
  - Edge cases (zero income, negative income, high expenses, transitions)
  - Accessibility (semantic HTML, currency formatting)

## Related
- Implements: Task 18 from specs/actual-hourly-wage-calculator/tasks.md
- Part of: Actual Hourly Wage Calculator feature
- Related components: ExpenseRankings (alternative expense visualization)
- Uses calculation functions: generateExpenseBreakdown from breakdown.ts

## Performance Considerations
- No external chart library (reduces bundle size)
- Pure CSS rendering (no canvas/SVG overhead)
- Smooth transitions without JavaScript animation
- Component returns null early when no data (skip rendering)
- Memoization handled by parent CalculatorContext

## Future Enhancements
- Interactive tooltips on hover (show expense details)
- Responsive layout adjustments for mobile
- Export chart as image functionality
- Animation on initial render (fade in/slide in)
- Compare mode showing multiple scenarios side-by-side
