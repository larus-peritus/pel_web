# Meal Cost Calculations Module

## Location
`src/lib/calculations/mealCost.ts`

## Purpose
Pure calculation functions for the Meal Cost Calculator (Matkostnaðarmælir) feature. Analyzes the true cost of eating out vs home cooking, including both monetary costs and time investment converted to "life energy."

## Exports

### Eating Out Calculations
- `calculateEatingOutWeeklyCost(data: EatingOutData): number` - Calculates total weekly cost
- `calculateEatingOutMonthlyCost(data: EatingOutData): number` - Calculates monthly cost using WEEKS_PER_MONTH
- `calculateEatingOutYearlyCost(data: EatingOutData): number` - Calculates yearly cost using WEEKS_PER_YEAR
- `generateEatingOutBreakdown(data, wage): MealCostBreakdownItem[]` - Creates breakdown by meal category

### Home Cooking Calculations
- `calculateWeeklyGroceryCost(monthlyGroceryCost): number` - Converts monthly to weekly
- `calculateWeeklyTimeCost(shopping, cooking, wage): number` - Calculates time cost in ISK
- `calculateHomeCookingWeeklyCost(data, wage): number` - Total weekly cost (groceries + time)
- `calculateHomeCookingMonthlyCost(data, wage): number` - Total monthly cost
- `calculateHomeCookingYearlyCost(data, wage): number` - Total yearly cost
- `calculateCostPerPerson(cost, householdSize): number` - Divides by household size
- `generateHomeCookingBreakdown(data, wage): MealCostBreakdownItem[]` - Creates 3-item breakdown (groceries, shopping time, cooking time)

### Summary Calculations
- `calculateEatingOutSummary(data, wage): MealCostSummary` - Complete summary with costs, life energy, and breakdown
- `calculateHomeCookingSummary(data, wage): MealCostSummary` - Complete summary for home cooking

### Comparison Calculations
- `compareEatingOutVsHome(eatingOut, homeCooking, wage): MealCostComparisonResults` - Full comparison with future value projections and recommendation

### Life Energy
- `calculateLifeEnergy(cost, hourlyWage): number` - Converts cost to hours using dollarsToLifeEnergy

### Validation
- `isValidEatingOutData(data): boolean` - Validates meal counts (0-21) and costs (> 0)
- `isValidHomeCookingData(data): boolean` - Validates grocery cost, household size (>= 1), hours (>= 0)

### Constants
- `MEAL_CATEGORY_LABELS` - Icelandic labels for all meal categories

## Key Functionality

### Eating Out Cost Formula
```
Weekly Cost = (breakfastCount × breakfastCost) +
              (lunchCount × lunchCost) +
              (dinnerCount × dinnerCost) +
              (coffeeCount × coffeeCost) +
              (fastFoodCount × fastFoodCost)

Monthly Cost = Weekly Cost × 4.33
Yearly Cost = Weekly Cost × 52
```

### Home Cooking Cost Formula
```
Weekly Grocery Cost = Monthly Grocery Cost / 4.33
Weekly Time Cost = (shoppingHours + cookingHours) × actualHourlyWage
Weekly Total = Weekly Grocery Cost + Weekly Time Cost

Monthly Cost = Weekly Total × 4.33
Yearly Cost = Weekly Total × 52
```

### Life Energy for Home Cooking
Home cooking life energy includes BOTH:
1. Money spent (converted to hours)
2. Actual time spent shopping and cooking

This makes it a true "total life cost" calculation.

### Comparison Logic
- Calculates difference (eating out - home cooking)
- Positive difference = home cooking is cheaper
- Negative difference = eating out is cheaper
- < 5% difference = considered "similar"
- Future value calculated using compound interest at 7% annual return
- Generates Icelandic recommendation text based on results

## Dependencies
- `dollarsToLifeEnergy` from `@/lib/calculations/lifeEnergy` - Converts ISK to hours
- `calculateFutureValue` from `@/lib/calculations/subscriptions` - FI impact projections
- Constants from `@/lib/constants/mealCost` - WEEKS_PER_MONTH, WEEKS_PER_YEAR, ANNUAL_RETURN_RATE
- Types from `@/types/calculator` - All meal cost interfaces

## Tests
- Location: `tests/lib/calculations/mealCost.test.ts`
- Coverage: 35 tests, all passing
- Test categories:
  - Eating out calculations (7 tests)
  - Home cooking calculations (10 tests)
  - Life energy calculations (3 tests)
  - Summary calculations (2 tests)
  - Comparison calculations (5 tests)
  - Validation functions (8 tests)

## Integration
- Used by: MealCostCalculator components (to be implemented)
- Uses: Existing life energy and FI calculations
- Part of: Meal Cost Calculator feature

## Edge Cases Handled
- Zero hourly wage - returns 0 for life energy calculations
- Zero household size - returns 0 for cost per person
- Negative costs - prevented by validation
- Zero meal counts - filtered out of breakdowns
- All costs rounded to nearest ISK (no decimals)

## Performance Notes
- All functions are pure (no side effects)
- No async operations
- Calculations complete in < 1ms
- Breakdown generation uses filter and sort
- Future value uses Math.pow for compound interest

## Related
- Implements: Requirements NS-1 through NS-7 from `specs/matkostnadur/requirements.md`
- Part of: `specs/matkostnadur/design.md` - Calculation Engine section
- Complements: Subscription calculator (similar pattern)
- Follows: Same pure function pattern as wage calculations
