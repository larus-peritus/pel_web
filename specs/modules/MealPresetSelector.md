# MealPresetSelector Component

## Location
`src/components/mealCost/MealPresetSelector.tsx`

## Purpose
Provides quick selection of preset meal scenarios and optional comparison table showing all scenarios side-by-side with costs, life energy, and potential savings.

## Exports
- `MealPresetSelector` - React component for preset scenario selection
- `MealPresetSelectorProps` - TypeScript interface for props

## Key Functionality
- **5 preset scenarios**: Displays all MEAL_SCENARIO_PRESETS as selectable cards
- **Quick selection**: Click to apply preset to current data
- **Scenario descriptions**: Shows name and description in Icelandic
- **Comparison table toggle**: Optional detailed comparison of all scenarios
- **Current vs preset comparison**: Calculates savings relative to user's current choices
- **Future value display**: Shows 20-year FI impact for each scenario
- **Life energy calculations**: Displays hours per month for each preset
- **Responsive table**: Desktop table layout, mobile card layout
- **Conditional rendering**: Only shows comparison when currentData and wage available

## Component Interface
```typescript
interface MealPresetSelectorProps {
  onSelect: (preset: MealScenarioPreset) => void;
  currentData?: MealCostData;
  actualHourlyWage: number;
  className?: string;
}
```

## Dependencies
- `@/components/ui/Card` - Card layout component
- `@/components/ui/Button` - Table toggle button
- `@/lib/utils` - formatCurrency, formatNumber
- `@/lib/calculations/lifeEnergy` - formatLifeEnergy
- `@/lib/constants/mealCost` - MEAL_SCENARIO_PRESETS
- `@/lib/calculations/mealCost` - compareEatingOutVsHome
- `@/types/calculator` - MealScenarioPreset, MealCostData

## Behavior
1. **Preset Cards**:
   - Displays 5 preset scenarios as clickable buttons
   - Shows scenario name, description, and arrow icon
   - Calls onSelect callback with selected preset
   - Hover effects and focus indicators
2. **Comparison Table**:
   - Only shown when currentData is provided and actualHourlyWage > 0
   - Toggle button shows/hides table
   - Calculates comparison data for all presets on render
   - Determines cheaper option for each preset
   - Compares each preset to user's current data
   - Shows positive savings in green, negative in red
   - Displays future value for scenarios with positive savings
3. **Responsive Layout**:
   - Desktop: Full table with 5 columns
   - Mobile: Card-based layout with labels

## Comparison Table Columns
1. **Atburðarás**: Scenario name
2. **Mán. kostnaður**: Monthly cost (cheaper of eating out vs home cooking)
3. **Lífsorka**: Life energy hours per month
4. **Sparnaður**: Savings compared to current (positive = green, negative = red)
5. **FV (20 ár)**: Future value at 20 years (only if positive savings)

## Preset Scenarios (from MEAL_SCENARIO_PRESETS)
1. **Borða úti alla daga**: Eat out for all meals
2. **Venjulegur vinnandi**: Typical worker pattern
3. **Hóflega heimaeldun**: Moderate home cooking
4. **Mikil heimaeldun**: Mostly home cooking
5. **100% heimaeldun**: Full home cooking

## Testing
- Location: `tests/components/mealCost/MealPresetSelector.test.tsx`
- Coverage: 16 tests, all passing
- Tests cover:
  - Rendering preset cards
  - All 5 presets displayed
  - onSelect callback
  - Comparison table toggle
  - Table columns and data
  - Savings color coding
  - Mobile card view
  - Conditional rendering (no data, zero wage)
  - Custom className
  - Keyboard navigation
  - Arrow icons

## Integration
- Used by: MealCostCalculator container component
- Calls: onSelect callback to update meal cost data
- Uses: MEAL_SCENARIO_PRESETS constant
- Calculates: Live comparison using compareEatingOutVsHome()

## Accessibility
- Semantic button elements for presets
- Clear focus indicators
- Keyboard navigable
- ARIA labels where appropriate
- Descriptive button text
- Mobile-friendly touch targets
- Responsive text sizing

## Performance
- Comparison data memoized via useMemo (within component logic)
- Only calculates when currentData or actualHourlyWage changes
- Lightweight preset rendering (static data)
- Conditional table rendering (not calculated if hidden)

## Responsive Design
- Desktop:
  - Full width table with 5 columns
  - Side-by-side preset cards (could be grid)
- Mobile:
  - Stacked preset buttons (full width)
  - Card-based comparison table
  - Labels inline with values
  - Horizontal scroll if needed

## Related
- Implements: Task 12 from specs/matkostnadur/tasks.md
- Part of: Meal Cost Calculator feature (NS-7)
- Context: context/features/meal-cost-calculator.md
- Uses constants from: src/lib/constants/mealCost.ts
- Uses calculations from: src/lib/calculations/mealCost.ts

## Notes
- All text in Icelandic
- Uses elevated Card variant for preset selector
- Gradient header (primary-50 to success-50)
- Comparison table uses outlined Card
- Savings calculation: currentCost - presetCost (positive = preset saves money)
- Future value only shown for scenarios with positive savings
- Note explains wage is used in calculations
- Toggle button has "Sýna" / "Fela" states
- Comparison table hidden by default (progressive disclosure)
- Returns null for comparison elements when data unavailable
