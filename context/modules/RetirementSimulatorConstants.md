# Retirement Simulator Constants

## Location
`apps/peninganaedalifid/src/lib/constants/retirementSimulator.ts`

## Purpose
Centralized constants, default values, and helper functions for the Retirement Date Simulator feature. Provides Iceland-specific pension parameters, simulation assumptions, withdrawal strategy presets, and validation ranges.

## Key Constants

### Simulation Defaults
- `DEFAULT_LIFE_EXPECTANCY`: 92 years (conservative planning assumption)
- `DEFAULT_EXPECTED_RETURN`: 7% real return (after inflation)
- `DEFAULT_INFLATION_RATE`: 3% (historical Icelandic average)
- `DEFAULT_RETURN_VOLATILITY`: 18% (equity market standard deviation)
- `DEFAULT_SCENARIO_COUNT`: 1,000 (balance of accuracy and performance)
- `TARGET_SUCCESS_RATE`: 85% (recommended planning target)

### Icelandic Pension System
- `ICELANDIC_PENSION_DEFAULTS.LIFEYRISSJODUR_AGE`: 60 years
- `ICELANDIC_PENSION_DEFAULTS.ELLILIFEYRIR_AGE`: 67 years
- `ICELANDIC_PENSION_DEFAULTS.TYPICAL_LIFEYRISSJODUR_MONTHLY`: 150,000 ISK
- `ICELANDIC_PENSION_DEFAULTS.TYPICAL_ELLILIFEYRIR_MONTHLY`: 200,000 ISK

### Success Rate Thresholds
- Excellent: >= 90% (green)
- Good: >= 80% (blue)
- Acceptable: >= 70% (yellow)
- Risky: >= 60% (orange)
- High Risk: < 60% (red)

### Withdrawal Strategy Presets
Three pre-configured withdrawal strategies:

1. **4% Rule** (`FOUR_PERCENT`)
   - Fixed 4% of initial portfolio (inflation-adjusted)
   - Based on Trinity Study
   - Icelandic label: "4% reglan"

2. **Variable Spending** (`VARIABLE`)
   - 4% of current portfolio each year
   - Adjusts with portfolio performance
   - Icelandic label: "Breytileg útgjöld"

3. **Guardrails** (`GUARDRAILS`)
   - Base withdrawal with 130% upper / 80% lower guardrails
   - 10% adjustment when guardrails crossed
   - Icelandic label: "Girðingar"

### Return Rate Assumptions
Historical data for reference and validation:

- **Iceland Equity**: 6.5% real return, 22% volatility
- **Global Equity**: 7% real return, 18% volatility
- **Balanced (60/40)**: 5.5% real return, 12% volatility
- **Conservative**: 4% real return, 8% volatility

## Validation Ranges

### Portfolio & Savings
- Portfolio balance: 0 - 1,000,000,000 ISK
- Monthly savings: 0 - 10,000,000 ISK
- Monthly expenses: 0 - 10,000,000 ISK

### Age Constraints
- Current age: 18 - 100 years
- Retirement age: 40 - 80 years
- Life expectancy: 80 - 105 years
- Lífeyrissjóður age: 60 - 70 years
- Ellilífeyrir age: 67 - 75 years

### Rate Constraints
- Expected return: 0% - 15% (warn if > 12%)
- Inflation rate: 0% - 10%
- Return volatility: 5% - 35%
- Retirement adjustment: 50% - 150% of working expenses

### Pension Income
- Pension amount: 0 - 1,000,000 ISK/month

## Success Rate Display

### Color Coding
Each success rate level has corresponding Tailwind CSS classes:

- **Excellent** (>= 90%): `bg-green-100 text-green-800 border-green-500`
- **Good** (>= 80%): `bg-blue-100 text-blue-800 border-blue-500`
- **Acceptable** (>= 70%): `bg-yellow-100 text-yellow-800 border-yellow-500`
- **Risky** (>= 60%): `bg-orange-100 text-orange-800 border-orange-500`
- **High Risk** (< 60%): `bg-red-100 text-red-800 border-red-500`

### Icelandic Labels
- Excellent: "Framúrskarandi"
- Good: "Gott"
- Acceptable: "Ásættanlegt"
- Risky: "Áhættusamt"
- High Risk: "Háhætta"

## Helper Functions

### Success Rate Analysis
- `getSuccessRateLevel(successRate)` - Returns level based on thresholds
- `isExpectedReturnUnrealistic(returnRate)` - Warns if > 12%

### Retirement Timing
- `isEarlyRetirement(retirementAge)` - Checks if before 67 (ellilífeyrir)
- `getYearsToPension(retirementAge, pensionAge?)` - Calculates bridge years

### Validation Helpers
All validation functions return boolean:
- `isValidPortfolioBalance(balance)`
- `isValidMonthlySavings(savings)`
- `isValidMonthlyExpenses(expenses)`
- `isValidRetirementAge(age)`
- `isValidCurrentAge(age)`
- `isValidLifeExpectancy(age, retirementAge)`
- `isValidExpectedReturn(returnRate)`
- `isValidInflationRate(inflationRate)`
- `isValidReturnVolatility(volatility)`
- `isValidLifeyrissjodurAge(age)`
- `isValidEllilifeyririAge(age)`
- `isValidPensionAmount(amount)`

## Performance Targets
- 1,000 scenarios: < 2 seconds
- 5,000 scenarios: < 5 seconds
- Chart render: < 500ms
- UI update: < 100ms

## Sensitivity Analysis Parameters
- Return rate delta: +/- 1%
- Inflation delta: +/- 0.5%
- Life expectancy delta: +/- 5 years

## Buffer Calculation
- Target success rate for buffer: 80%
- Used to calculate "years of buffer" (how many years earlier retirement possible)

## Safety Limits
- `MAX_PROJECTION_MONTHS`: 600 (50 years maximum)
- `MIN_BALANCE_THRESHOLD`: 0.01 ISK (prevents rounding errors)
- `CLOSE_CALL_THRESHOLD`: 5% (for recommendation confidence)

## Iceland-Specific Considerations

### Higher Inflation
Default inflation (3%) and return assumptions account for Iceland's historically higher inflation compared to US markets.

### Conservative Defaults
Defaults lean conservative for Iceland:
- Life expectancy: 92 (vs 90 often used in US)
- No pension by default (must opt-in)
- Inflation-adjusted pension income enabled

### Pension System Integration
Native support for Iceland's two-tier pension system:
1. Lífeyrissjóður (pension fund) at 60
2. Ellilífeyrir (state pension) at 67

## Dependencies
- Types: `@/types/retirementSimulator`

## Tests
- Location: `apps/peninganaedalifid/src/lib/constants/__tests__/retirementSimulator.test.ts`
- Coverage: 51 tests, all passing
- Test areas:
  - Default values validation
  - Success rate thresholds
  - Icelandic pension defaults
  - Withdrawal strategy presets
  - Return rate assumptions
  - Helper function logic
  - All validation functions

## Integration
Used by:
- Simulation engine (Web Worker)
- Withdrawal strategy calculations
- Pension income calculations
- Input validation
- UI display components
- Flexibility analysis

## Related
- Implements: Requirements FR-4, FR-6, NFR-7 from `specs/retirement-simulator/requirements-retirement-simulator.md`
- Part of: Epic 1 (Foundation) from `specs/retirement-simulator/design-retirement-simulator.md`
- Follows patterns from: `src/lib/constants/fiNumber.ts`
