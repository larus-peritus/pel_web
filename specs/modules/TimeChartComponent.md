# TimeChart Component

## Location
`apps/peninganaedalifid/src/components/calculator/TimeChart.tsx`

## Purpose
Visual component that displays a donut/pie chart showing the breakdown of weekly time allocation devoted to work-related activities. Uses pure CSS conic-gradient for chart rendering without external chart libraries.

## Exports
- `function TimeChart()` - Main component that renders time allocation donut chart

## Key Functionality

### Chart Visualization
- **Donut Chart**: Uses CSS `conic-gradient` to create pie chart segments
- **Color-Coded Segments**: Each time category has a distinct color from design system
- **Center Display**: Shows total weekly hours in center of donut
- **Responsive Layout**: Chart and legend stack on mobile, side-by-side on desktop

### Data Display
- **Legend**: Shows all time categories with color squares, labels, hours, and percentages
- **Total Summary**: Displays weekly and annual hour totals
- **Percentage Calculation**: Shows each category as percentage of total time
- **Decimal Formatting**: Hours formatted to 1 decimal place

### Color Mapping
- **primary-500** (#0ea5e9): Base work hours
- **warning-500** (#f59e0b): Commute time
- **error-500** (#ef4444): Getting ready time
- **purple-500** (#a855f7): Decompression time
- **orange-500** (#f97316): Work illness time

## Component Structure

```tsx
<Card variant="outlined">
  <CardHeader>
    <h3>Time Allocation</h3>
    <p>Your weekly hours devoted to work</p>
  </CardHeader>
  <CardContent>
    {/* Chart + Legend Row */}
    <div className="flex flex-col md:flex-row">
      {/* Donut Chart */}
      <div className="relative">
        <div style={{ background: conic-gradient(...) }} />
        <div className="absolute inset-8">
          <p>{totalWeeklyHours}</p>
          <p>hrs/week</p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {segments.map(segment => (
          <div>
            <div className={segment.bgClass} /> {/* Color square */}
            <div>
              <p>{segment.label}</p>
              <p>{hours} hrs ({percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Total Annotation */}
    <div className="mt-4 pt-4 border-t">
      <p>Total work-related time: {totalWeeklyHours} hours per week</p>
      <p>({annualHours} hours per year)</p>
    </div>
  </CardContent>
</Card>
```

## Props
None - component reads data from CalculatorContext

## State Management
- **useCalculator()**: Accesses `results.timeBreakdown` and `results.totalWeeklyHours`
- **useMemo**: Calculates segment positions and cumulative percentages

## Edge Cases Handled
- **No Results**: Returns null when `results` is null
- **Empty Breakdown**: Returns null when `timeBreakdown` is empty array
- **Zero Hours**: Displays 0.0 gracefully
- **Single Category**: Handles 100% segment correctly
- **Very Large/Small Values**: Formats all values consistently

## Accessibility
- Semantic HTML with proper heading hierarchy (h3)
- Descriptive text for all data points
- Color not sole indicator (labels provided)
- Responsive design for various screen sizes

## Dependencies
- `react` - useMemo hook
- `@/context/CalculatorContext` - useCalculator hook
- `@/components/ui/Card` - Card, CardHeader, CardContent
- `@/lib/utils` - cn utility for className merging

## Testing
- Location: `tests/components/calculator/TimeChart.test.tsx`
- Coverage: 13 tests covering:
  - Null/empty state handling (2 tests)
  - Data rendering with various category counts (2 tests)
  - Number formatting (3 tests)
  - Chart visualization (2 tests)
  - Edge cases: zero, small, large values (3 tests)
  - Accessibility (1 test)

## Integration
- Used by: Calculator results page
- Uses: CalculatorContext for time breakdown data
- Complements: ExpenseRankings, PlainLanguageSummary for complete results view

## Design Notes
- **Pure CSS Chart**: No external chart library needed for MVP
- **Donut vs Pie**: Donut chosen to display total in center
- **Gradient Calculation**: Segments calculated as cumulative percentages for conic-gradient
- **Mobile-First**: Chart shrinks appropriately on mobile, legend stacks vertically

## Related
- Implements: REQ-2.2 (Time breakdown visualization) from `specs/actual-hourly-wage-calculator/requirements.md`
- Part of: Task 19 from `specs/actual-hourly-wage-calculator/tasks.md`
- Designed per: `specs/actual-hourly-wage-calculator/design.md` visualization section
