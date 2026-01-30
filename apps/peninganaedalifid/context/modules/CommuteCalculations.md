# Commute Calculations

## Location
`src/lib/calculations/commute.ts`

## Purpose
Provides comprehensive calculation functions for determining the true cost of commuting, including direct costs, indirect costs (for cars), time spent, life energy impact, and financial independence (FI) impact.

## Exports

### Main Function

- `calculateCommuteResults(inputs: CommuteInputs, actualHourlyWage: number): CommuteResults` - Main calculation function that orchestrates all commute cost calculations

### Helper Functions

- `generateCommuteId(): string` - Generates unique IDs for commute scenarios

### Constants

- `COMMUTE_PRESETS: CommutePreset[]` - Array of 11 preset scenarios for common Icelandic commute routes
- `FUEL_PRICES` - Current Icelandic fuel/energy prices (gasoline: 350 kr/L, diesel: 340 kr/L, electric: 30 kr/kWh)
- `FUEL_CONSUMPTION` - Typical consumption rates
- `DEFAULT_CAR_COSTS` - Icelandic market averages for car costs
- `STRAETO_PRICES` - Strætó public transit prices

## Key Functionality

### Cost Calculations

#### Car Costs (`calculateCarCosts`)
- **Direct costs**: Fuel/electricity, parking, tolls
- **Indirect costs**: Depreciation, insurance, maintenance, inspection (prorated monthly)
- **Breakdown**: Creates detailed breakdown with percentages for chart visualization
- Handles all fuel types: gasoline, diesel, electric

#### Transit Costs (`calculateTransitCosts`)
- Monthly pass calculation
- Per-ride calculation (trips per month based on days per week)

#### Active Costs (`calculateActiveCosts`)
- Bike/walk maintenance costs
- Typically minimal or zero for walking

### Time Calculations (`calculateTimeCosts`)
- Converts one-way time to monthly minutes
- Calculates hours per month and year
- Converts to days per year for better visualization
- Round-trip calculation (multiplies by 2)

### Life Energy Calculations (`calculateLifeEnergyCosts`)
- **Time component**: Direct hours spent commuting
- **Money component**: Cost converted to hours using actual hourly wage
- **Total**: Time + Money as hours of life energy
- **Annual**: Monthly totals × 12
- Handles zero wage gracefully (money component = 0)

### Future Value Calculations
- Uses existing `calculateFutureValue()` function
- Projects savings if commute cost was invested at 7% annual return
- Calculates for 5, 10, and 20 year horizons

### Special Cases

#### Remote Work
- Returns all zeros for costs, time, and life energy
- Future value projections are zero

#### Division by Zero
- Gracefully handles `actualHourlyWage === 0`
- Life energy from money returns 0 instead of error

## Dependencies

### Internal
- `dollarsToLifeEnergy()` from `@/lib/calculations/lifeEnergy` - Converts money to life energy hours
- `calculateFutureValue()` from `@/lib/calculations/subscriptions` - Calculates compound interest projections

### External
- None - pure calculation functions

## Tests

- Location: `tests/lib/calculations/commute.test.ts`
- Coverage: 19 tests covering all commute methods, edge cases, and preset validation
- All tests passing

### Test Categories
1. Remote work (all zeros)
2. Car commute (gasoline, diesel, electric)
3. Transit commute (monthly pass, per-ride)
4. Active commute (bike, walk)
5. Time calculations
6. Life energy calculations (including zero wage handling)
7. Future value calculations
8. Preset validation

## Integration

### Used by
- Future `CommuteForm` component - For real-time calculation display
- Future `CommuteSummary` component - For result visualization
- Future `CommuteComparison` component - For scenario comparison
- CalculatorContext (future) - For managing commute scenarios

### Uses
- Life energy utilities for time/money conversions
- Subscription utilities for future value calculations
- Commute types for type safety

## Related

- Implements: Requirements NS-2, NS-3, NS-4 from `specs/vinnuferdakostnadur/requirements.md`
- Part of: `specs/vinnuferdakostnadur/design.md` - Calculation Logic section
- See also: `context/modules/CommuteTypes.md` for type definitions

## Preset Scenarios

### Car Presets (6)
1. Kópavogur ↔ Reykjavík (10 km) - Gasoline
2. Hafnarfjörður ↔ Reykjavík (12 km) - Gasoline
3. Garðabær ↔ Reykjavík (8 km) - Electric
4. Mosfellsbær ↔ Reykjavík (15 km) - Gasoline
5. Akranes ↔ Reykjavík (50 km) - Gasoline
6. Selfoss ↔ Reykjavík (60 km) - Diesel

### Transit Presets (2)
1. Strætó - Mánaðarkort (Monthly pass - 10,500 kr)
2. Strætó - Stakir farmiðar (Per-ride - 550 kr)

### Active Presets (2)
1. Hjólreiðar - stutt (<5 km)
2. Hjólreiðar - miðlungs (5-10 km)

### Remote Preset (1)
1. Fjarvinnu - 100% (Zero cost, zero time)

## Calculation Examples

### Example: Kópavogur ↔ Reykjavík (Gasoline Car)
```
Input:
- Distance: 10 km one-way
- Days/week: 5
- Time: 20 minutes one-way
- Fuel: Gasoline, 350 kr/L, 8 L/100km

Calculation:
- Trips/month: 5 days × 4.33 weeks × 2 = 43.3 trips
- Distance/month: 10 km × 43.3 = 433 km
- Fuel used: 433 × 8/100 = 34.64 liters
- Fuel cost: 34.64 × 350 = 12,124 kr/month
- Time/month: 20 min × 43.3 = 866 min = 14.4 hours
- Indirect costs: 35,000 + 15,000 + 10,000 + 500 = 60,500 kr/month
- Total cost: 12,124 + 60,500 = 72,624 kr/month

With 5,000 kr/hour wage:
- Life energy from time: 14.4 hours
- Life energy from money: 72,624 / 5,000 = 14.5 hours
- Total life energy: 28.9 hours/month
```

## Constants and Defaults

### Weeks per Month
- `WEEKS_PER_MONTH = 4.33` - Average weeks per month (52/12)

### Annual Return Rate
- `ANNUAL_RETURN_RATE = 0.07` - 7% standard for FIRE calculations

### Inspection Cost Calculation
- Prorated to monthly: `inspectionCost / 24` (every 2 years)

## Notes

- All calculations are pure functions with no side effects
- Results are deterministic for the same inputs
- Currency is ISK (Icelandic króna)
- All user-facing labels are in Icelandic
- Follows existing patterns from subscription calculations
- Optimized for performance (< 50ms calculation time)
