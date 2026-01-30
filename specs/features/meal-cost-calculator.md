# Feature: Matkostnaðarmælir (Meal Cost Calculator)

## Overview
The Meal Cost Calculator helps users understand the true cost of their eating habits by comparing eating out vs home cooking. It analyzes both monetary costs and time investment, converting everything to "life energy" (hours of life) using the user's actual hourly wage.

## Status
In Progress - Phase 1 Foundation Complete (3/16 tasks)

**Completion**: 19% (3 of 16 main tasks)

## Architecture
The feature follows the established peninganaedalifid.is pattern:
- Pure TypeScript calculation functions (no side effects)
- React components with TypeScript
- Integration with CalculatorContext for actualHourlyWage
- localStorage for data persistence
- Icelandic language throughout

## Modules

### Core Modules (Completed)
- **MealCostTypes** - context/modules/MealCostTypes.md
  - TypeScript interfaces for all data structures
  - Location: src/types/calculator.ts (lines 320-417)

- **MealCostConstants** - context/modules/MealCostConstants.md
  - Price presets, scenario presets, time constants
  - Location: src/lib/constants/mealCost.ts

- **MealCostCalculations** - context/modules/MealCostCalculations.md
  - Pure calculation functions for costs, life energy, comparisons
  - Location: src/lib/calculations/mealCost.ts
  - Tests: tests/lib/calculations/mealCost.test.ts (35 tests)

### UI Components (Pending)
- EatingOutInputs (Task 4)
- HomeCookingInputs (Task 5)
- MealCostCalculator container (Task 6)
- MealCostComparison (Task 10)
- MealCostBreakdown (Task 11)
- MealPresetSelector (Task 12)

## Key Features

### Eating Out Tracking
- 5 meal categories: breakfast, lunch, dinner, coffee, fast food
- Weekly meal counts (0-21 per category)
- Cost per item (ISK)
- Price presets for quick selection (17 realistic Icelandic prices)

### Home Cooking Tracking
- Monthly grocery cost
- Household size (for per-person calculations)
- Shopping time per week
- Cooking time per week
- Time costs calculated using actual hourly wage

### Life Energy Calculations
**For Eating Out**: Cost / hourly wage = hours of life energy

**For Home Cooking**:
- Money spent / hourly wage = money-based life energy
- PLUS actual time spent (shopping + cooking)
- This gives "total life cost" including time investment

### Comparison & Analysis
- Side-by-side cost comparison
- Life energy difference
- Future value projections (10, 20, 30 years at 7% return)
- Automatic recommendation in Icelandic
- 5% similarity threshold for "costs are similar"

### Preset Scenarios
5 scenarios for quick comparison:
1. **"Borða úti alla daga"** - Eat out every meal
2. **"Venjulegur vinnandi"** - Typical worker (lunch out 5x/week)
3. **"Hóflega heimaeldun"** - Moderate home cooking
4. **"Mikil heimaeldun"** - Mostly home cooking
5. **"100% heimaeldun"** - All meals at home

## Dependencies

### Internal Dependencies
- `dollarsToLifeEnergy()` from src/lib/calculations/lifeEnergy.ts
- `calculateFutureValue()` from src/lib/calculations/subscriptions.ts
- `formatCurrency()`, `formatLifeEnergy()` from src/lib/utils/formatters.ts
- `CalculatorContext` for actualHourlyWage (to be integrated in Task 7)

### External Dependencies
- React 18+
- TypeScript 5+
- Tailwind CSS 4
- Next.js (App Router)

## Data Model

### Storage
Will be stored in localStorage under key: `peninganaedalifid_matkostnadur`
- Auto-save with 500ms debounce
- Included in app export/import functionality
- Privacy-first: all client-side, no server communication

### Data Structure
```typescript
MealCostData {
  eatingOut: {
    breakfastCount, lunchCount, dinnerCount, coffeeCount, fastFoodCount,
    breakfastCost, lunchCost, dinnerCost, coffeeCost, fastFoodCost
  },
  homeCooking: {
    monthlyGroceryCost,
    householdSize,
    shoppingHoursPerWeek,
    cookingHoursPerWeek
  }
}
```

## Testing

### Unit Tests (Completed)
- 35 tests covering all calculation functions
- Test coverage:
  - Eating out calculations (7 tests)
  - Home cooking calculations (10 tests)
  - Life energy calculations (3 tests)
  - Summary calculations (2 tests)
  - Comparison calculations (5 tests)
  - Validation functions (8 tests)
- All tests passing
- File: tests/lib/calculations/mealCost.test.ts

### Integration Tests (Pending)
- Component integration tests (Task 14)
- Context integration tests (Task 14)
- localStorage persistence tests (Task 14)

### Accessibility Tests (Pending)
- WCAG 2.1 AA compliance (Task 15)
- Keyboard navigation (Task 15)
- Screen reader testing (Task 15)

## Implementation Notes

### Icelandic Language
- All user-facing text in Icelandic
- Currency format: "50.000 kr" (period as thousands separator)
- Proper plural forms: "1 klukkustund" vs "2 klukkustundir"
- Category labels use correct Icelandic terms

### Calculation Methodology
- Weekly calculations are base (users think in weeks)
- Monthly: weekly × 4.33 (average weeks per month)
- Yearly: weekly × 52
- Life energy always in hours (not days/weeks) for precision
- Future value uses compound interest formula at 7% annual return

### Edge Cases Handled
- Zero hourly wage → life energy = 0
- Zero household size → cost per person = 0
- Negative costs → validation prevents
- Zero meal counts → filtered from breakdowns
- Very high wages → eating out may be cheaper

### Performance
- All calculations pure functions (< 1ms execution)
- No async operations
- Debounced auto-save (500ms)
- Memoized calculations in components (useMemo)

## Related Features
- **Actual Hourly Wage Calculator** - Provides actualHourlyWage input
- **Subscription Burn Meter** - Similar life energy + FI impact pattern
- **Commute Cost Calculator** - Similar comparison methodology

## Requirements Fulfilled

### User Stories Implemented (Foundation)
- NS-1: Eating out tracking ✅ (types, calculations ready)
- NS-2: Coffee/drink tracking ✅ (types, calculations ready)
- NS-3: Fast food tracking ✅ (types, calculations ready)
- NS-4: Home cooking tracking ✅ (types, calculations ready)
- NS-5: Cost comparison ✅ (calculations ready)
- NS-6: FI impact projections ✅ (calculations ready)
- NS-7: Scenario presets ✅ (5 presets defined)
- NS-8: Price presets ✅ (17 presets across 5 categories)

### User Stories Pending (UI)
- All stories need UI components to be fully functional
- Input components (Tasks 4-6)
- Display components (Tasks 10-11)
- Preset selector (Task 12)

## Next Steps

### Immediate (Phase 2)
1. Task 4: Create EatingOutInputs component
2. Task 5: Create HomeCookingInputs component
3. Task 6: Create MealCostCalculator container
4. Vertical slice demo: Input → Calculate → Display

### Near-term (Phase 3)
1. Task 7: Integrate with CalculatorContext
2. Task 8: Implement localStorage persistence
3. Task 9: Error handling and edge cases

### Future (Phase 4-5)
1. Tasks 10-12: Rich comparison UI
2. Tasks 13: Responsive layout
3. Tasks 14-16: Testing, accessibility, polish

## Success Metrics
- All 35 calculation tests passing ✅
- Types provide full type safety ✅
- Realistic Icelandic presets defined ✅
- Foundation ready for UI development ✅

**Next Milestone**: Complete Phase 2 (Tasks 4-6) for working vertical slice

## Timeline
- **Phase 1 (Foundation)**: Completed 2026-01-20 ✅
- **Phase 2 (Core Slice)**: Estimated 8-12 hours
- **Phase 3 (Context/Persistence)**: Estimated 6-8 hours
- **Phase 4 (Features)**: Estimated 8-10 hours
- **Phase 5 (Testing/Polish)**: Estimated 6-8 hours

**Total Remaining**: ~28-38 hours for full feature completion
