# Meal Cost Context Integration

## Location
`src/context/CalculatorContext.tsx` (integrated into existing CalculatorContext)

## Purpose
Extends the CalculatorContext to manage meal cost calculator state, including eating out expenses, home cooking costs, and comparison calculations. Provides seamless integration with actualHourlyWage for life energy calculations and localStorage persistence.

## State Management

### State Properties
- `mealCostData: MealCostData` - Combined eating out and home cooking data
  - `eatingOut: EatingOutData` - Eating out expenses (meal counts and costs)
  - `homeCooking: HomeCookingData` - Home cooking costs (groceries, time)

### Computed Properties
- `mealCostSummary: MealCostComparisonResults | null` - Memoized comparison results
  - Recalculates when `mealCostData` or `actualHourlyWage` changes
  - Includes eating out summary, home cooking summary, and comparison metrics
  - Gracefully handles wage = 0 (allows cost calculations, life energy shows 0)

## Update Methods

### updateMealCostData(data: Partial<MealCostData>)
Updates the entire meal cost data object with partial updates.

**Example:**
```typescript
updateMealCostData({
  eatingOut: { ...newEatingOutData },
  homeCooking: { ...newHomeCookingData },
});
```

### updateEatingOut(data: Partial<EatingOutData>)
Updates only the eating out data with partial updates. Preserves home cooking data.

**Example:**
```typescript
updateEatingOut({
  lunchCount: 7,
  lunchCost: 3000,
});
```

### updateHomeCooking(data: Partial<HomeCookingData>)
Updates only the home cooking data with partial updates. Preserves eating out data.

**Example:**
```typescript
updateHomeCooking({
  monthlyGroceryCost: 90000,
  cookingHoursPerWeek: 10,
});
```

## Calculation Integration

### Memoized Calculation
The `mealCostSummary` is calculated using `useMemo` with dependencies:
- `mealCostData` - Triggers recalculation when user updates meal data
- `results?.actualHourlyWage` - Triggers recalculation when wage changes

**Calculation Flow:**
1. Gets `actualHourlyWage` from main calculator results (defaults to 0)
2. Calls `compareEatingOutVsHome()` with current data and wage
3. Returns comparison results with:
   - Eating out summary (costs, life energy, breakdown)
   - Home cooking summary (costs, life energy, breakdown)
   - Comparison metrics (difference, cheaper option, future value)
   - Icelandic recommendation text

### Error Handling
Wrapped in try-catch to gracefully handle calculation errors:
- Logs error to console
- Returns null on failure
- UI can show appropriate error message

## Persistence Integration

### localStorage Save
Meal cost data is automatically included in all persistence operations:
- **Auto-save:** Debounced 500ms after any change to `mealCostData`
- **Manual save:** `saveToStorage()` includes `mealCostData`
- **Export:** JSON export includes `mealCostData`

### localStorage Load
Meal cost data is restored on app initialization:
- **Initial load:** Loads `mealCostData` from localStorage if available
- **Fallback:** Uses `DEFAULT_EATING_OUT_DATA` and `DEFAULT_HOME_COOKING_DATA` if not found
- **Backwards compatibility:** Optional `mealCostData?` in StoredState allows older data to load

### Import/Export
- **Export:** Includes `mealCostData` in JSON file
- **Import:** Restores `mealCostData` with fallback to defaults
- **Version check:** Validates data version before importing

### Reset
`resetAll()` resets meal cost data to default values:
```typescript
setMealCostData({
  eatingOut: DEFAULT_EATING_OUT_DATA,
  homeCooking: DEFAULT_HOME_COOKING_DATA,
});
```

## Usage Example

```typescript
import { useCalculator } from '@/context/CalculatorContext';

function MealCostCalculator() {
  const {
    mealCostData,
    updateEatingOut,
    updateHomeCooking,
    mealCostSummary,
    results,
  } = useCalculator();

  const handleLunchChange = (count: number, cost: number) => {
    updateEatingOut({ lunchCount: count, lunchCost: cost });
  };

  const handleGroceryChange = (cost: number) => {
    updateHomeCooking({ monthlyGroceryCost: cost });
  };

  // Warn if no wage available
  if (!results?.actualHourlyWage) {
    return <Alert>Vinsamlegast fylltu út raunverulegt tímakaup fyrst.</Alert>;
  }

  return (
    <div>
      <EatingOutInputs
        data={mealCostData.eatingOut}
        onChange={updateEatingOut}
      />
      <HomeCookingInputs
        data={mealCostData.homeCooking}
        onChange={updateHomeCooking}
      />
      {mealCostSummary && (
        <MealCostComparison comparison={mealCostSummary} />
      )}
    </div>
  );
}
```

## Default Values

From `src/lib/constants/mealCost.ts`:

**DEFAULT_EATING_OUT_DATA:**
- breakfast: 0 meals/week, 1.500 kr
- lunch: 5 meals/week, 2.500 kr
- dinner: 2 meals/week, 4.000 kr
- coffee: 5 drinks/week, 650 kr
- fastFood: 1 meal/week, 2.000 kr

**DEFAULT_HOME_COOKING_DATA:**
- monthlyGroceryCost: 80.000 kr
- householdSize: 2 people
- shoppingHoursPerWeek: 2 hours
- cookingHoursPerWeek: 7 hours

## Dependencies
- `@/lib/calculations/mealCost` - Pure calculation functions
- `@/lib/constants/mealCost` - Default values and presets
- `@/types/calculator` - TypeScript types
- `@/lib/storage/localStorage` - Safe storage utilities

## Implementation Notes

### Performance
- Calculations use `useMemo` to prevent unnecessary recalculations
- Only recalculates when dependencies change
- Debounced auto-save prevents excessive localStorage writes

### Error Handling
- Try-catch around calculation prevents crashes
- Zero wage handled gracefully (costs work, life energy = 0)
- localStorage quota exceeded handled by safeSetItem utility
- Missing data uses fallback defaults

### Backwards Compatibility
- `mealCostData?` is optional in StoredState
- Existing users without meal data get defaults
- No data migration needed

## Testing
Test coverage in `tests/context/CalculatorContext.mealCost.test.tsx`:
- Initial state and defaults
- Update functions (partial updates)
- Memoized calculation
- localStorage persistence
- Reset functionality
- Zero wage edge case

**All tests passing:** 11/11

## Integration Points
- **Main Calculator:** Uses `actualHourlyWage` for life energy calculations
- **Subscriptions:** Follows same patterns for state management
- **localStorage:** Uses same storage key and debounce strategy
- **Export/Import:** Included in all data operations

## Related Files
- Types: `src/types/calculator.ts` (MealCostData, MealCostSummary, MealCostComparisonResults)
- Constants: `src/lib/constants/mealCost.ts` (defaults, presets)
- Calculations: `src/lib/calculations/mealCost.ts` (pure functions)
- Tests: `tests/context/CalculatorContext.mealCost.test.tsx`

## Icelandic Text
All user-facing text in Icelandic:
- Recommendation messages in comparison results
- Category labels in breakdowns
- Error messages when wage not available
