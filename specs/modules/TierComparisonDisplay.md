# TierComparisonDisplay Component

## Location
`src/components/expenseBaseline/TierComparisonDisplay.tsx`

## Purpose
Visual comparison of three spending tiers showing monthly and annual totals with color-coded progress bars and relative size indicators.

## Exports
- `TierComparisonDisplay` - Tier comparison visualization component

## Props
```typescript
interface TierComparisonDisplayProps {
  results: ExpenseBaselineResults;  // Calculated results with tier totals
}
```

## Key Functionality
- **Tier Display**: Shows all three tiers (Barebones/Comfortable/Deluxe)
- **Visual Bars**: Progress bars scaled relative to deluxe tier (100%)
- **Monthly Totals**: Prominent display of monthly expense per tier
- **Annual Totals**: Secondary display of annual expense (monthly × 12)
- **Color Coding**: Consistent tier colors (Amber 500, Green 500, Purple 500)
- **Difference Insight**: Shows total difference between lowest and highest tiers

## Visual Design
- **Progress Bars**: Full-width bars with rounded edges (h-3)
- **Color Indicators**: Small colored dots (w-3 h-3) next to tier names
- **Smooth Transitions**: 500ms duration on bar width changes
- **Responsive Layout**: Single column, stacks vertically

## Calculation
- Percentages calculated relative to deluxe tier (always 100%)
- Barebones and comfortable scaled proportionally
- Uses useMemo for performance optimization

## Color Scheme
- **Barebones**: Amber (bg-amber-500, text-amber-900)
- **Comfortable**: Green (bg-green-500, text-green-900)
- **Deluxe**: Purple (bg-purple-500, text-purple-900)

## Dependencies
- Card, CardHeader, CardContent from @/components/ui/Card
- formatCurrency from @/lib/utils/formatters
- useMemo from React

## Tests
- Implicitly tested via ResultsSummarySection tests
- Visual testing recommended for bar scaling

## Integration
- Used by: ResultsSummarySection
- Displays: Totals from ExpenseBaselineResults

## Related
- Implements: Task 5.2 from tasks-expense-baseline.md
- Part of: EPIC 5 - Results Summary Display
- Requirements: US-1, NFR-2 (visual distinction)
