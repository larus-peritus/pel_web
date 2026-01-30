# Meal Cost Constants and Presets Module

## Location
`src/lib/constants/mealCost.ts`

## Purpose
Centralized constants and preset data for the Meal Cost Calculator. Provides realistic Icelandic meal prices, scenario presets, and time conversion constants.

## Exports

### Time Conversion Constants
- `WEEKS_PER_MONTH = 4.33` - Average weeks per month (52/12)
- `WEEKS_PER_YEAR = 52` - Weeks in a year
- `MONTHS_PER_YEAR = 12` - Months in a year

### Financial Constants
- `ANNUAL_RETURN_RATE = 0.07` - 7% annual return for FI projections

### Price Presets
All prices in ISK (Icelandic króna), based on 2026 Reykjavík area market prices:

- `BREAKFAST_PRICE_PRESETS: MealPricePreset[]` - 3 options (1.500-3.500 kr)
  - Kaffihús morgunverður: 1.500 kr
  - Veitingahús morgunverður: 2.500 kr
  - Hótel morgunhlaðborð: 3.500 kr

- `LUNCH_PRICE_PRESETS: MealPricePreset[]` - 4 options (1.800-4.500 kr)
  - Skyndibitastaður: 1.800 kr
  - Góður skyndibitastaður: 2.500 kr
  - Veitingahús: 3.500 kr
  - Góður veitingahús: 4.500 kr

- `DINNER_PRICE_PRESETS: MealPricePreset[]` - 4 options (2.000-10.000 kr)
  - Skyndibitastaður: 2.000 kr
  - Venjulegur veitingahús: 4.000 kr
  - Góður veitingahús: 6.000 kr
  - Fínir veitingahús: 10.000 kr

- `COFFEE_PRICE_PRESETS: MealPricePreset[]` - 3 options (400-1.000 kr)
  - Bensínstöð kaffi: 400 kr
  - Kaffihús espresso: 650 kr
  - Kaffihús specialty: 1.000 kr

- `FAST_FOOD_PRICE_PRESETS: MealPricePreset[]` - 3 options (1.500-2.500 kr)
  - Lítil máltíð: 1.500 kr
  - Venjuleg máltíð: 2.000 kr
  - Stór máltíð: 2.500 kr

- `MEAL_PRICE_PRESETS` - Object grouping all price presets by category

### Scenario Presets
- `MEAL_SCENARIO_PRESETS: MealScenarioPreset[]` - 5 preset scenarios for comparison

#### Scenario 1: "Borða úti alla daga"
- All 21 meals per week eating out
- 7 breakfast, 7 lunch, 7 dinner, 10 coffee
- Minimal home cooking (10.000 kr groceries)

#### Scenario 2: "Venjulegur vinnandi"
- Typical worker pattern
- Lunch out 5 days/week during work
- 1 dinner out, 5 coffee, 1 fast food
- 60.000 kr groceries, 2h shopping, 7h cooking

#### Scenario 3: "Hóflega heimaeldun"
- Moderate home cooking
- Eating out mostly on weekends (2 of each meal type)
- 70.000 kr groceries, 2.5h shopping, 8h cooking

#### Scenario 4: "Mikil heimaeldun"
- Mostly home cooking
- Only 1 lunch and 1 dinner out per week
- 80.000 kr groceries, 3h shopping, 10h cooking

#### Scenario 5: "100% heimaeldun"
- All meals at home, no eating out
- 90.000 kr groceries, 3h shopping, 12h cooking

### Default Values
- `DEFAULT_EATING_OUT_DATA: EatingOutData` - Default form values (typical worker pattern)
- `DEFAULT_HOME_COOKING_DATA: HomeCookingData` - Default form values (2-person household)

## Key Functionality

### MealPricePreset Interface
```typescript
interface MealPricePreset {
  label: string;  // Icelandic label for UI
  value: number;  // Price in ISK
}
```

### Price Preset Usage
Presets allow users to quickly select realistic meal prices without guessing. Each category has 3-4 options representing different quality/price levels.

### Scenario Preset Usage
Scenarios allow users to instantly compare different eating patterns:
- "What if I ate out every day?"
- "What's a typical working person's meal cost?"
- "How much would I save with 100% home cooking?"

All scenarios use realistic grocery costs that scale with cooking frequency.

## Dependencies
- Types from `@/types/calculator` - EatingOutData, HomeCookingData, MealScenarioPreset

## Tests
- No unit tests needed (constants only)
- Integration tests verify presets work correctly in components

## Integration
- Used by: MealCost calculation functions for time/financial conversions
- Used by: UI components for price selection dropdowns
- Used by: Scenario comparison components
- Part of: Meal Cost Calculator feature

## Icelandic Context

### Price Research (2026 Reykjavík Area)
Prices based on:
- Typical café breakfast: 1.500-2.500 kr
- Restaurant lunch: 2.500-4.500 kr
- Restaurant dinner: 4.000-10.000 kr
- Coffee shop coffee: 400-1.000 kr
- Fast food meal: 1.500-2.500 kr

### Grocery Cost Assumptions
- 80.000 kr/month for 2-person household (typical)
- Scales down for eating out scenarios
- Scales up for 100% home cooking

### Time Assumptions
- Shopping: 2-3 hours/week typical
- Cooking: 7-12 hours/week depending on frequency
- Less time for eating out scenarios
- More time for 100% home cooking

## Related
- Implements: Requirements NS-7, NS-8 from `specs/matkostnadur/requirements.md`
- Part of: `specs/matkostnadur/design.md` - Constants section
- Similar to: COMMON_SUBSCRIPTIONS preset pattern
- Currency: All amounts in ISK (Icelandic króna)
