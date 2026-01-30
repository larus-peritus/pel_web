# MealCostComparison Component

## Location
`src/components/mealCost/MealCostComparison.tsx`

## Purpose
Displays comprehensive side-by-side comparison of eating out vs home cooking costs, highlighting the cheaper option and showing future value projections.

## Exports
- `MealCostComparison` - React component for meal cost comparison display
- `MealCostComparisonProps` - TypeScript interface for props

## Key Functionality
- **Side-by-side comparison**: Eating out vs home cooking with monthly/yearly costs
- **Life energy display**: Hours of work required for each option
- **Difference calculations**: Shows kr and percentage difference
- **Cheaper option highlighting**: Visual indicator (green border + badge) for better option
- **Future value projections**: 10, 20, and 30-year investment potential at 7% return
- **Recommendation text**: Contextual advice based on comparison results
- **Responsive design**: Stacked on mobile, side-by-side on desktop

## Component Interface
```typescript
interface MealCostComparisonProps {
  comparison: MealCostComparisonResults;
  actualHourlyWage: number;
  className?: string;
}
```

## Dependencies
- `@/components/ui/Card` - Card layout component
- `@/components/ui/Alert` - Recommendation display
- `@/lib/utils` - formatCurrency, formatNumber
- `@/lib/calculations/lifeEnergy` - formatLifeEnergy
- `@/types/calculator` - MealCostComparisonResults type

## Behavior
1. Displays eating out summary in left column (mobile: top)
2. Displays home cooking summary in right column (mobile: bottom)
3. Highlights cheaper option with success-500 border and "ÓDÝRARA" badge
4. Shows absolute difference in dedicated section
5. Displays future value projections when options are not similar
6. Shows recommendation in Alert component with appropriate variant:
   - Success (green) when home cooking is cheaper
   - Warning (yellow) when eating out is cheaper
   - Info (blue) when costs are similar
7. Hides life energy when actualHourlyWage is 0
8. Handles negative differences correctly (displays absolute values)

## Testing
- Location: `tests/components/mealCost/MealCostComparison.test.tsx`
- Coverage: 17 tests, all passing
- Tests cover:
  - Rendering and layout
  - Cost displays for both options
  - Cheaper option highlighting
  - Difference calculations
  - Life energy display
  - Future value projections
  - Recommendation variants
  - Edge cases (zero wage, negative differences, similar costs)
  - Custom className application

## Integration
- Used by: MealCostCalculator container component
- Receives: MealCostComparisonResults from context calculation
- Requires: actualHourlyWage from CalculatorContext

## Accessibility
- Semantic HTML with proper headings
- ARIA role="alert" for recommendation
- Color coding supplemented with text badges
- Keyboard accessible (no interactive elements beyond container)
- Responsive text sizing

## Performance
- Lightweight component (no calculations)
- Static rendering (no state)
- Optimized with proper key usage in lists

## Related
- Implements: Task 10 from specs/matkostnadur/tasks.md
- Part of: Meal Cost Calculator feature (NS-5, NS-6)
- Context: context/features/meal-cost-calculator.md
- Displays data from: src/lib/calculations/mealCost.ts

## Notes
- All text in Icelandic
- Currency formatted with Icelandic separators (period for thousands)
- Future value projections hidden when costs are similar (< 5% difference)
- Life energy hidden when wage is zero (with Alert in parent component)
- Uses elevated Card variant for prominence
- Gradient header background (warning-50 to primary-50)
