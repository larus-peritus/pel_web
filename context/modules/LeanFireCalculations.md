# LeanFIRE Core Calculation Functions

## Location
`apps/peninganaedalifid/src/lib/calculations/leanFire.ts`

## Purpose
Pure calculation functions for the LeanFIRE (Lágmarks FIRE) calculator. Handles minimum FI number calculation, geographic comparison, expense reduction scenarios, frugality optimization, timeline projection, and life energy conversions.

## Exports

### Basic FI Calculation
- `calculateMinimumFINumber(barebonesMonthly, multiplier)` - Calculates minimum FI number from barebones expenses using formula: Monthly × 12 × Multiplier

### Geographic Comparison
- `calculateGeographicComparison(reykjavikExpenses, landsbyggdExpenses, multiplier)` - Compares living costs between Reykjavík and Landsbyggð with category-by-category differences, FI number impact, and pros/cons

### Expense Reduction Scenarios
- `calculateReductionScenario(category, currentAmount, reductionPercent, multiplier, savingsRate)` - Models "what if I cut X?" scenarios with detailed impact metrics (FI reduction, timeline impact, efficiency rating)
- `calculateTotalReductions(scenarios)` - Sums multiple scenarios and calculates cumulative impact

### Timeline Calculation
- `calculateYearsToFI(fiNumber, currentSavings, monthlySavings, returnRate)` - Calculates years to reach FI using month-by-month compound growth simulation (max 50 years safety limit)

### Frugality Optimization
- `generateFrugalityTips(currentExpenses, minimumExpenses, actualHourlyWage, fiMultiplier, currentFINumber, savingsRate)` - Generates personalized Iceland-specific frugality tips based on high-spend category analysis
- `calculateFrugalityTipImpact(tip, savingsRate, multiplier)` - Calculates FI reduction and timeline impact of implementing a tip

### Life Energy
- `calculateLifeEnergy(fiNumber, actualHourlyWage)` - Converts FI number to work hours and work years using 2080 hours/year standard

### Master Calculation
- `calculateLeanFireResults(state, actualHourlyWage)` - Main orchestrator combining all calculations into complete results

## Key Functionality

### FI Number Calculation
- Supports 25x (4% withdrawal) and 30x (3.33% withdrawal) multipliers
- Formula: Monthly barebones × 12 months × FI multiplier
- Handles edge cases: zero/negative expenses

### Geographic Comparison
- Compares Reykjavík vs Landsbyggð living costs
- Category-by-category breakdown with differences
- Net savings and FI number impact
- Includes location-specific pros/cons from constants

### Reduction Scenarios
- Models expense cuts at 10%, 25%, 50%, or 100% levels
- Calculates monthly/annual savings
- FI number impact (annual savings × multiplier)
- Timeline impact (rough approximation)
- Efficiency rating (months saved per 10k kr cut)

### Timeline Projection
- Month-by-month compound growth simulation
- Adds monthly savings and applies monthly return
- Returns 0 if already at FI
- Returns 999 if no savings (infinite timeline)
- Safety limit: 600 months (50 years)

### Frugality Tips
- Analyzes spending vs minimum in each category
- Only generates tips for categories >10% above minimum
- Uses Iceland-specific tip templates with savings ranges
- Estimates potential savings based on current spend level
- Calculates timeline impact for each tip
- Sorts by timeline impact (biggest first)

### Life Energy
- Converts monetary amounts to work hours
- Uses user's actual hourly wage
- Calculates years using 2080 hours/year
- Calculates for minimum, comfortable (2x), and deluxe (4x) lifestyles

## Dependencies
- `@/types/leanFire` - All LeanFIRE TypeScript types
- `@/lib/constants/leanFire` - Iceland constants, expense defaults, frugality tip templates

## Integration
- Called by LeanFireCalculator main component
- Results feed into UI components (MinimumFISummary, GeographicComparisonPanel, etc.)
- Integrates with CalculatorContext for actualHourlyWage

## Tests
- Location: `apps/peninganaedalifid/src/lib/calculations/__tests__/leanFire.test.ts`
- Coverage: 48 unit tests covering all functions
- Test types: Normal cases, edge cases (zero/negative values), calculation accuracy, safety limits
- All tests passing (100%)

## Edge Cases Handled
- Zero or negative expenses (returns 0 or safe fallback)
- Zero savings rate (timeline impact = 0)
- Zero actual hourly wage (life energy = 0)
- Already at FI (returns 0 years)
- No savings (returns 999 years infinite timeline)
- Very large numbers (no overflow issues)
- Empty scenario arrays (returns zeros)
- Missing optional parameters (graceful degradation)

## Performance
- All calculations complete in <1ms
- Pure functions with no side effects
- No async operations
- Efficient month-by-month loops with safety limits

## Calculation Accuracy
- FI numbers match manual verification
- Geographic comparisons use real Iceland data
- Reduction scenarios calculate correctly
- Timeline projections use standard compound formulas
- Life energy conversions verified against examples

## Related
- Implements: Requirements FR-1 through FR-5 from `specs/lean-fire/requirements-lean-fire.md`
- Part of: Epic 1 (Foundation) from `specs/lean-fire/design-lean-fire.md`
- Uses: Constants from `context/modules/LeanFireConstants.md`
- Types: Defined in `apps/peninganaedalifid/src/types/leanFire.ts`
