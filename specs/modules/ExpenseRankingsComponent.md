# ExpenseRankings Component

## Location
`apps/peninganaedalifid/src/components/calculator/ExpenseRankings.tsx`

## Purpose
Displays work-related expenses in a ranked list, sorted by life-energy impact (highest first). Provides visual indicators to help users identify their most costly expenses.

## Exports
- `ExpenseRankings` - React component that displays expense rankings

## Key Functionality

### Display Features
- **Ranked List**: Shows expenses sorted by dollar amount (highest impact first)
- **Rank Badges**: Numbered badges (1, 2, 3, etc.) with color coding:
  - Rank 1: Error colors (red) - highest impact
  - Rank 2: Warning colors (orange) - second highest
  - Rank 3+: Neutral colors (gray) - remaining expenses
- **Expense Details**: Each item shows:
  - Category label (e.g., "Commute Costs", "Work Meals")
  - Annual dollar amount (formatted currency)
  - Life energy hours (formatted human-readable time)
- **Progress Bars**: Visual representation of relative impact
  - Scaled to the highest expense (100%)
  - Color-coded to match rank badges
  - Smooth transition animations (500ms)
- **Total Display**: Shows total annual expenses at bottom

### Data Source
- Uses `useCalculator()` hook to access results
- Reads `results.expenseBreakdown` array (pre-sorted by breakdown.ts)
- Uses `results.totalMoneyExpenses` for total

### Visibility Logic
- Returns `null` when:
  - `results` is null (no valid calculation)
  - `expenseBreakdown` is empty (no expenses entered)
- Only displays expenses that have been added by breakdown generation (non-zero values)

## Component Structure

```tsx
<Card variant="outlined">
  <CardHeader>
    Title and description
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {expenseBreakdown.map((item, index) => (
        <div key={category}>
          {/* Rank badge + label + amount + life energy */}
          {/* Progress bar */}
        </div>
      ))}
    </div>

    {/* Total section */}
    <div className="mt-6 pt-4 border-t">
      Total Annual Expenses: $X,XXX.XX
    </div>
  </CardContent>
</Card>
```

## Dependencies

### Internal
- `@/context/CalculatorContext` - Provides calculator state via `useCalculator()` hook
- `@/components/ui/Card` - Card container with CardHeader and CardContent
- `@/lib/utils` - `formatCurrency()` for dollar amounts and `cn()` for class names
- `@/lib/calculations` - `formatLifeEnergy()` for human-readable time display

### External
- React - Client component (uses 'use client' directive)

## Usage Example

```tsx
import { ExpenseRankings } from '@/components/calculator';

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <div className="grid gap-6">
        {/* Input components */}

        {/* Results display */}

        {/* Expense rankings */}
        <ExpenseRankings />
      </div>
    </CalculatorProvider>
  );
}
```

## Styling

### Color Coding
- **Rank 1 (Highest Impact)**:
  - Badge: `bg-error-100 text-error-700`
  - Progress bar: `bg-error-500`
- **Rank 2**:
  - Badge: `bg-warning-100 text-warning-700`
  - Progress bar: `bg-warning-500`
- **Rank 3+**:
  - Badge: `bg-neutral-100 text-neutral-600`
  - Progress bar: `bg-neutral-400`

### Layout
- Card uses `outlined` variant (2px border)
- Expense items have `space-y-4` vertical spacing
- Each item has `space-y-2` between text and progress bar
- Total section separated by top border and margin

### Responsive Design
- Flexbox layout for horizontal alignment
- Text wraps naturally on narrow screens
- Progress bars use percentage widths (responsive)

## Testing

### Test Coverage
- **Location**: `tests/components/calculator/ExpenseRankings.test.tsx`
- **Test Count**: 21 tests, all passing
- **Coverage**:
  - Rendering states (null results, empty breakdown)
  - Content display (labels, amounts, life energy hours, totals)
  - Rank badges (numbers and colors)
  - Progress bars (rendering, scaling, colors)
  - Edge cases (single item, many items)
  - Visual styling (Card variant, spacing, animations)

## Integration

### Used By
- Main calculator page (`src/app/page.tsx`)
- Results section alongside charts and other displays

### Uses
- **CalculatorContext**: Provides `results` with `expenseBreakdown` array
- **BreakdownFunctions**: Data is pre-sorted by `generateExpenseBreakdown()`
- **LifeEnergyFunctions**: Formats life energy hours into readable strings
- **UI Components**: Card component for container structure

## Related

### Implements
- **Requirements**: Part of expense breakdown and impact visualization requirements
- **Design**: Follows design specification for expense impact display

### Part of
- Actual Hourly Wage Calculator feature
- Results and visualization section
- Complements BreakdownChart and TimeChart components

## Implementation Notes

### Performance
- Component re-renders only when `results` changes (controlled by context)
- No internal state management (pure display component)
- Uses `key={item.category}` for stable list rendering

### Accessibility
- Semantic HTML structure
- Clear visual hierarchy with headings
- Color is not the only indicator (rank numbers provide text alternative)
- Currency and time information presented in readable format

### Future Enhancements
- Could add click handlers to filter/highlight expenses
- Could add tooltips with additional expense details
- Could support custom sorting options (by amount, by life energy, alphabetically)
- Could add export functionality for individual expense data
