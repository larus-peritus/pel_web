# ResultsSummarySection Component

## Location
`src/components/expenseBaseline/ResultsSummarySection.tsx`

## Purpose
Container component for all expense baseline results visualizations. Orchestrates the display of tier comparisons, category breakdowns, life energy analysis, and tier differences.

## Exports
- `ResultsSummarySection` - Main results summary container component

## Props
```typescript
interface ResultsSummarySectionProps {
  baseline: ExpenseBaseline;           // Full baseline data with categories
  results: ExpenseBaselineResults;     // Calculated results
  actualHourlyWage: number | null;     // AWH from main calculator (for life energy)
}
```

## Key Functionality
- **Section Header**: Displays title and three tier totals in color-coded cards
- **Category Count**: Shows active categories and hidden category count
- **Grid Layout**: Responsive 2-column grid for sub-components (mobile stacks)
- **Sub-component Integration**: Renders 4 child components:
  - TierComparisonDisplay
  - CategoryBreakdownChart
  - LifeEnergyComparison
  - TierDifferenceTable
- **AWH Alert**: Shows info alert when actualHourlyWage is not available

## Visual Design
- **Header**: Gradient background (primary-50 to success-50) with rounded corners
- **Tier Cards**: Color-coded borders (Amber/Green/Purple) with white backgrounds
- **Grid**: 1 column on mobile, 2 columns on desktop (lg breakpoint)
- **Spacing**: 8-unit vertical spacing between sections

## Conditional Rendering
- Returns `null` if no results provided
- Shows AWH alert only when `actualHourlyWage === null`
- Hidden category count only shown when `categoryCount > activeCategories`

## Dependencies
- Card component from @/components/ui/Card
- Alert component from @/components/ui/Alert
- formatCurrency from @/lib/utils/formatters
- All 4 EPIC 5 sub-components

## Tests
- Location: tests/components/expenseBaseline/ResultsSummarySection.test.tsx
- Coverage: 10 tests covering rendering, tier display, category counts, alerts

## Integration
- Used by: ExpenseBaselineCalculator main page
- Requires: expenseBaselineResults from useCalculator hook
- Displays: Results for all three tiers simultaneously

## Related
- Implements: Task 5.1 from tasks-expense-baseline.md
- Part of: EPIC 5 - Results Summary Display
- Consumes: ExpenseBaselineResults from calculation engine
