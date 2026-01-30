# CommuteComparison Component

## Location
`apps/peninganaedalifid/src/components/commute/CommuteComparison.tsx`

## Purpose
Display side-by-side comparison of 2-4 commute scenarios with color-coded highlighting to help users identify the best and worst commute options.

## Exports
- `CommuteComparison` (React component) - Main comparison component
- `CommuteComparisonProps` (TypeScript interface) - Component props

## Key Functionality
- **Multi-Scenario Comparison**: Compares 2-4 scenarios side-by-side
- **Best/Worst Identification**: Automatically identifies cheapest (green) and most expensive (red) options
- **Savings Calculation**: Shows savings message comparing most expensive to cheapest
- **Responsive Design**: Table view on desktop (≥1024px), card view on mobile (<1024px)
- **Method Icons**: Visual icons for each commute method (🚗 🚌 🚴 🚶 🏠)
- **Comprehensive Metrics**: Monthly cost, time, life energy, 10-year future value, difference from cheapest
- **Empty State**: Friendly message when < 2 scenarios available
- **Conditional Display**: Hides life energy column when actualHourlyWage is 0

## Dependencies
- `@/components/ui/Card` - Card layout components
- `@/components/ui/Alert` - Alert messages
- `@/lib/utils` - formatCurrency utility
- `@/lib/calculations/lifeEnergy` - formatLifeEnergy function
- `@/types/calculator` - CommuteScenario, COMMUTE_METHOD_LABELS

## Props Interface
```typescript
interface CommuteComparisonProps {
  scenarios: CommuteScenario[];   // Array of 2-4 scenarios to compare
  actualHourlyWage: number;        // Actual hourly wage for life energy calculations
  className?: string;              // Optional CSS classes
}
```

## Comparison Logic
- **Cheapest Scenario**: Scenario with minimum totalMonthlyCost
- **Most Expensive**: Scenario with maximum totalMonthlyCost (only marked if different from cheapest)
- **Difference Calculation**: Each scenario shows cost difference from cheapest option
- **Color Coding**: Success (green) for best, error (red) for worst, neutral for middle options

## Desktop Table Columns
1. Heiti (Name)
2. Ferðamáti (Method with icon)
3. Kostnaður/mán (Monthly cost)
4. Tími/mán (Time per month in hours)
5. Lífsorka/mán (Life energy per month - conditional)
6. FV (10 ár) (Future value at 10 years)
7. Munur (Difference from cheapest)

## Mobile Card Layout
- Stacked cards with all same information
- Best/worst badges prominent
- Grid layout for stats (2 columns)
- Difference shown at bottom

## Tests
- Location: tests/components/commute/CommuteComparison.test.tsx
- Coverage: 27 tests covering empty state, comparison logic, desktop/mobile views, formatting, accessibility, and edge cases

## Integration
- Used in: CommuteCalculator main container (to be implemented)
- Consumes: Array of CommuteScenario from CalculatorContext
- Requires: actualHourlyWage from CalculatorContext

## Icelandic Content
All text is in Icelandic per app requirements:
- Headers: "Samanburður vinnuferða"
- Table columns: "Heiti", "Ferðamáti", "Kostnaður/mán", "Tími/mán", "Lífsorka/mán", "Munur"
- Badges: "Besta", "Dýrasta"
- Empty state: "Engar sviðsmyndir til að bera saman"
- Savings message: "Með því að skipta úr [worst] yfir í [best] sparar þú X kr og Y klst á mánuði"
- Method labels from COMMUTE_METHOD_LABELS

## Related
- Implements: Task 5.2 from specs/vinnuferdakostnadur/tasks.md
- Part of: Commute Cost Calculator feature (Epic 5: Display Components)
- Requirements: NS-5 from design document
