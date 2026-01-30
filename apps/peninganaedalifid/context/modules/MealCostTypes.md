# Meal Cost TypeScript Types Module

## Location
`src/types/calculator.ts` (lines 320-417)

## Purpose
TypeScript interface definitions for the Meal Cost Calculator feature. Provides type safety for all meal cost data structures, calculation results, and comparison outputs.

## Exports

### Core Data Interfaces

#### `EatingOutData`
Tracks eating out expenses across 5 meal categories.
- Properties:
  - `breakfastCount: number` - Meals per week (0-21)
  - `lunchCount: number` - Meals per week (0-21)
  - `dinnerCount: number` - Meals per week (0-21)
  - `coffeeCount: number` - Drinks per week (0+)
  - `fastFoodCount: number` - Meals per week (0-21)
  - `breakfastCost: number` - Average cost per meal (ISK, > 0)
  - `lunchCost: number` - Average cost per meal (ISK, > 0)
  - `dinnerCost: number` - Average cost per meal (ISK, > 0)
  - `coffeeCost: number` - Average cost per drink (ISK, > 0)
  - `fastFoodCost: number` - Average cost per meal (ISK, > 0)

#### `HomeCookingData`
Tracks home cooking expenses and time investment.
- Properties:
  - `monthlyGroceryCost: number` - Monthly grocery bill (ISK, > 0)
  - `householdSize: number` - People in household (>= 1)
  - `shoppingHoursPerWeek: number` - Time spent shopping (>= 0)
  - `cookingHoursPerWeek: number` - Time spent cooking (>= 0)

#### `MealCostData`
Complete meal cost data combining both aspects.
- Properties:
  - `eatingOut: EatingOutData`
  - `homeCooking: HomeCookingData`

### Result Interfaces

#### `MealCostSummary`
Summary of costs for a given approach (eating out OR home cooking).
- Properties:
  - `weeklyCost: number` - Total weekly cost (ISK)
  - `monthlyCost: number` - Total monthly cost (ISK)
  - `yearlyCost: number` - Total yearly cost (ISK)
  - `weeklyLifeEnergy: number` - Weekly life energy (hours)
  - `monthlyLifeEnergy: number` - Monthly life energy (hours)
  - `yearlyLifeEnergy: number` - Yearly life energy (hours)
  - `breakdown: MealCostBreakdownItem[]` - Category breakdown

#### `MealCostBreakdownItem`
Individual category in cost breakdown.
- Properties:
  - `category: string` - Category ID (breakfast, lunch, groceries, etc.)
  - `label: string` - Icelandic display label
  - `weeklyCost: number` - Weekly cost (ISK)
  - `monthlyCost: number` - Monthly cost (ISK)
  - `yearlyCost: number` - Yearly cost (ISK)
  - `lifeEnergyHours: number` - Monthly life energy (hours)
  - `percentage: number` - % of total monthly cost

#### `MealCostComparisonResults`
Complete comparison between eating out and home cooking.
- Properties:
  - `eatingOutSummary: MealCostSummary` - Eating out calculations
  - `homeCookingSummary: MealCostSummary` - Home cooking calculations
  - `monthlyDifference: number` - Monthly cost difference (ISK)
  - `yearlyDifference: number` - Yearly cost difference (ISK)
  - `lifeEnergyDifference: number` - Monthly life energy difference (hours)
  - `percentageDifference: number` - Percentage difference
  - `futureValue10Years: number` - FI impact at 10 years (ISK)
  - `futureValue20Years: number` - FI impact at 20 years (ISK)
  - `futureValue30Years: number` - FI impact at 30 years (ISK)
  - `cheaperOption: 'eatingOut' | 'homeCooking' | 'similar'` - Which is cheaper
  - `recommendation: string` - Icelandic recommendation text

### Preset Interfaces

#### `MealScenarioPreset`
Preset scenario for quick comparison.
- Properties:
  - `id: string` - Unique identifier
  - `name: string` - Icelandic name
  - `description: string` - Icelandic description
  - `eatingOut: EatingOutData` - Preset eating out data
  - `homeCooking: HomeCookingData` - Preset home cooking data

## Key Design Decisions

### Weekly Counts
Meal counts are weekly (not daily or monthly) because:
- People think in weekly patterns ("I eat lunch out 5 days a week")
- Easier to accommodate weekend vs weekday differences
- Converts easily to monthly (× 4.33) and yearly (× 52)

### Separate Eating Out Categories
Five categories (breakfast, lunch, dinner, coffee, fast food) because:
- Different price points
- Different frequency patterns
- Coffee tracked separately (often daily, lower cost)
- Fast food distinct from sit-down restaurants

### Life Energy for Home Cooking
Home cooking life energy includes BOTH:
1. Money spent (converted to hours via wage)
2. Actual time spent (shopping + cooking hours)

This makes it a "total life cost" that's comparable to eating out.

### Comparison Difference Sign
Positive `monthlyDifference` means eating out costs MORE than home cooking.
This is intuitive: "eating out - home cooking = savings if positive"

### Similar Threshold
Costs within 5% are considered "similar" to avoid over-optimizing small differences.

## Validation Rules

### EatingOutData Validation
- All counts: 0-21 (max 3 meals/day × 7 days)
- All costs: > 0 (must have positive price)
- Coffee count: 0+ (no upper limit, can have multiple per day)

### HomeCookingData Validation
- monthlyGroceryCost: > 0
- householdSize: >= 1
- shoppingHoursPerWeek: >= 0
- cookingHoursPerWeek: >= 0

## Dependencies
- No external dependencies (pure type definitions)
- Part of: `src/types/calculator.ts` (same file as other calculator types)

## Tests
- Type definitions tested indirectly through function tests
- TypeScript compiler validates type correctness
- Runtime validation in `isValidEatingOutData()` and `isValidHomeCookingData()`

## Integration
- Used by: All meal cost calculation functions
- Used by: MealCost UI components (to be implemented)
- Part of: Meal Cost Calculator feature

## Related
- Implements: Data model from `specs/matkostnadur/design.md`
- Requirements: NS-1 through NS-7 from `specs/matkostnadur/requirements.md`
- Similar to: SubscriptionSummary pattern
- Currency: All monetary values in ISK (Icelandic króna)
- Time: Hours per week for time inputs

## Example Usage

```typescript
const eatingOut: EatingOutData = {
  breakfastCount: 0,
  lunchCount: 5,
  dinnerCount: 2,
  coffeeCount: 5,
  fastFoodCount: 1,
  breakfastCost: 1500,
  lunchCost: 2500,
  dinnerCost: 4000,
  coffeeCost: 650,
  fastFoodCost: 2000,
};

const homeCooking: HomeCookingData = {
  monthlyGroceryCost: 80000,
  householdSize: 2,
  shoppingHoursPerWeek: 2,
  cookingHoursPerWeek: 7,
};

const comparison: MealCostComparisonResults = compareEatingOutVsHome(
  eatingOut,
  homeCooking,
  2000 // actualHourlyWage
);

console.log(comparison.recommendation);
// "Heimaeldun sparar 45.000 kr á mánuði"
```
