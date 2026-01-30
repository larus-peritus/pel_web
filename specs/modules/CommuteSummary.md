# CommuteSummary Component

## Location
`apps/peninganaedalifid/src/components/commute/CommuteSummary.tsx`

## Purpose
Display comprehensive results for a single commute scenario with detailed cost breakdown, time analysis, life energy impact, and financial independence (FI) projections.

## Exports
- `CommuteSummary` (React component) - Main summary display component
- `CommuteSummaryProps` (TypeScript interface) - Component props

## Key Functionality
- **Cost Display**: Shows direct costs, indirect costs (for cars), total monthly, and yearly costs
- **Cost Breakdown**: Pie chart-style breakdown for car scenarios showing fuel, parking, tolls, depreciation, insurance, maintenance, and inspection costs
- **Time Display**: Hours and minutes per month, hours and days per year
- **Life Energy Calculation**: Separates time-based life energy from money-based life energy with total monthly and yearly summaries
- **FI Impact**: Future value projections at 5, 10, and 20 years assuming 7% annual return
- **Conditional Rendering**: Shows indirect costs only for cars, hides life energy if actualHourlyWage is 0
- **Impactful Messaging**: Warning when life energy > 40 hours/month

## Dependencies
- `@/components/ui/Card` - Card layout components
- `@/components/ui/Alert` - Alert messages
- `@/lib/utils` - formatCurrency, formatNumber utilities
- `@/lib/calculations/lifeEnergy` - formatLifeEnergy function
- `@/types/calculator` - CommuteScenario type

## Props Interface
```typescript
interface CommuteSummaryProps {
  scenario: CommuteScenario;      // Full scenario with inputs and results
  actualHourlyWage: number;        // Actual hourly wage for life energy calculations
  className?: string;              // Optional CSS classes
}
```

## Tests
- Location: tests/components/commute/CommuteSummary.test.tsx
- Coverage: 21 tests covering all display sections, conditional rendering, different commute methods, and accessibility

## Integration
- Used in: CommuteCalculator main container (to be implemented)
- Consumes: CommuteScenario data from CalculatorContext
- Requires: actualHourlyWage from CalculatorContext

## Icelandic Content
All text is in Icelandic per app requirements:
- Cost labels: "Beinn kostnaður", "Óbeinn kostnaður", "Heildarkostnaður"
- Time labels: "Á mánuði", "Á ári", "Tími í vinnuferð"
- Life energy: "Lífsorka kostnaður", "Heildar lífsorka kostnaður"
- FI section: "Áhrif á fjárhagslegt frelsi"
- Warning messages in Icelandic

## Related
- Implements: Task 5.1 from specs/vinnuferdakostnadur/tasks.md
- Part of: Commute Cost Calculator feature (Epic 5: Display Components)
- Requirements: NS-2, NS-3, NS-4 from design document
