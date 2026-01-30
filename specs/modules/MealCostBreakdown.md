# MealCostBreakdown Component

## Location
`src/components/mealCost/MealCostBreakdown.tsx`

## Purpose
Displays detailed breakdown of meal costs by category with amounts, life energy, and percentages. Supports both eating out and home cooking breakdowns with collapsible mobile view.

## Exports
- `MealCostBreakdown` - React component for meal cost category breakdown
- `MealCostBreakdownProps` - TypeScript interface for props

## Key Functionality
- **Category breakdown table**: Shows each meal category with detailed metrics
- **Dual type support**: Handles both eating out and home cooking breakdowns
- **Color-coded categories**: Visual indicators for each category
- **Life energy display**: Hours of work per category
- **Percentage calculation**: Shows portion of total spending
- **Mobile collapsible**: Expandable/collapsible on mobile for space efficiency
- **Responsive layout**: Table on desktop, stacked cards on mobile
- **Zero-cost filtering**: Automatically hides categories with no spending
- **Total row**: Summary at bottom showing 100% and totals

## Component Interface
```typescript
interface MealCostBreakdownProps {
  summary: MealCostSummary;
  type: 'eatingOut' | 'homeCooking';
  actualHourlyWage: number;
  className?: string;
}
```

## Dependencies
- `@/components/ui/Card` - Card layout component
- `@/lib/utils` - formatCurrency, formatNumber
- `@/lib/calculations/lifeEnergy` - formatLifeEnergy
- `@/types/calculator` - MealCostSummary type

## Behavior
1. Filters breakdown items to show only categories with monthlyCost > 0
2. Returns null if no active breakdown items
3. Displays title based on type ("Mat úti - Sundurliðun" or "Heimaeldun - Sundurliðun")
4. Shows collapse/expand button on mobile only
5. Displays color-coded dot for each category
6. Shows four columns: Category, Amount, Life Energy, Percentage
7. Displays "—" for life energy when actualHourlyWage is 0
8. Shows special note for home cooking about time costs
9. Displays total row with bold text and 100% percentage

## Category Color Mapping
- Eating out:
  - breakfast: warning-500 (yellow/orange)
  - lunch: primary-500 (blue)
  - dinner: purple-500
  - coffee: orange-500
  - fastFood: error-500 (red)
- Home cooking:
  - groceries: success-500 (green)
  - shoppingTime: info-500 (blue)
  - cookingTime: warning-500 (yellow/orange)
- Fallback: Index-based rotation through primary, success, warning, error, purple, orange

## Testing
- Location: `tests/components/mealCost/MealCostBreakdown.test.tsx`
- Coverage: 16 tests, all passing
- Tests cover:
  - Rendering for both types
  - Category display
  - Amount formatting
  - Life energy display and hiding
  - Percentage calculation
  - Total row
  - Special note for home cooking
  - Zero-cost filtering
  - Mobile collapse/expand
  - Custom className
  - Color indicators
  - Responsive layouts

## Integration
- Used by: MealCostCalculator container component
- Receives: MealCostSummary from context calculation
- Displays: breakdown array from summary

## Accessibility
- Semantic table headers (hidden on mobile, shown on desktop)
- ARIA expanded attribute on mobile toggle button
- ARIA label on toggle button
- Color supplemented with labels
- Keyboard accessible toggle button
- Mobile-friendly labels for each field

## Performance
- Filters items once on render
- Static color mapping function
- No unnecessary re-renders (no internal state except collapse)
- Efficient responsive classes

## Responsive Design
- Desktop (md+): Full table with header row
- Mobile (< md):
  - Stacked card layout
  - Labels inline with values
  - Collapse/expand functionality
  - "Sýna" / "Fela" toggle button

## Related
- Implements: Task 11 from specs/matkostnadur/tasks.md
- Part of: Meal Cost Calculator feature (NS-5)
- Context: context/features/meal-cost-calculator.md
- Displays data from: generateEatingOutBreakdown(), generateHomeCookingBreakdown()

## Notes
- All text in Icelandic
- Uses outlined Card variant for subtle appearance
- Special note explains that home cooking includes time costs
- Mobile-first approach with progressive enhancement
- Zero-cost items filtered automatically for cleaner display
- Returns null when no data (graceful degradation)
