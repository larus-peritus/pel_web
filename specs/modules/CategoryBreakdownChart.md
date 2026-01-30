# CategoryBreakdownChart Component

## Location
`src/components/expenseBaseline/CategoryBreakdownChart.tsx`

## Purpose
Interactive pie/donut chart showing category distribution with tier toggle functionality. Uses recharts library for visualization.

## Exports
- `CategoryBreakdownChart` - Category distribution chart component

## Props
```typescript
interface CategoryBreakdownChartProps {
  baseline: ExpenseBaseline;           // Baseline with category data
  results: ExpenseBaselineResults;     // Results with percentage breakdown
}
```

## Key Functionality
- **Tier Toggle**: Buttons to switch between barebones/comfortable/deluxe views
- **Donut Chart**: Pie chart with inner radius (60px) for donut effect
- **Custom Tooltip**: Shows category icon, name, amount, and percentage
- **Custom Legend**: Grid layout with colors and percentages
- **Zero Filtering**: Automatically hides categories with zero value
- **Sorting**: Categories sorted by value (highest first)

## Chart Configuration
- **Dimensions**: 300px height, 100% width (responsive)
- **Inner Radius**: 60px (creates donut hole)
- **Outer Radius**: 100px
- **Padding Angle**: 2 degrees between slices
- **Labels**: Percentage shown on each slice

## Color Palette
10 distinct vibrant colors:
1. Blue (#3b82f6) - Húsnæði
2. Green (#10b981) - Matur
3. Amber (#f59e0b) - Samgöngur
4. Red (#ef4444) - Heilsa
5. Purple (#8b5cf6) - Tryggingar
6. Cyan (#06b6d4) - Veitur
7. Pink (#ec4899) - Persónuleg
8. Orange (#f97316) - Afþreying
9. Teal (#14b8a6) - Sparnaður
10. Gray (#6b7280) - Annað

## State Management
- `selectedTier`: useState tracking active tier (defaults to 'comfortable')
- Chart data recalculated via useMemo when tier changes

## Dependencies
- recharts: PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
- Card components from @/components/ui/Card
- formatCurrency, formatPercentage from @/lib/utils/formatters

## Tests
- Implicitly tested via ResultsSummarySection tests
- Visual testing recommended for chart rendering

## Integration
- Used by: ResultsSummarySection
- Displays: percentageBreakdown from ExpenseBaselineResults

## Related
- Implements: Task 5.3 from tasks-expense-baseline.md
- Part of: EPIC 5 - Results Summary Display
- Requirements: FR-3.3 (percentage breakdown)
