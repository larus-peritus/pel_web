# Barista FIRE Core Calculations

## Location
`apps/peninganaedalifid/src/lib/calculations/baristaFire.ts`

## Purpose
Pure calculation functions for the Barista FIRE Planner. Handles gap calculation, timeline projection, part-time income scenarios, life energy calculations, and Coast FIRE baseline comparison.

## Exports

### Gap Calculation Functions
- `calculateGapToFI(fiNumber, currentSavings): number` - Calculate amount needed to reach FI
- `isCoastFIRE(fiNumber, currentSavings): boolean` - Check if user has reached Coast FIRE

### Income Calculation Functions
- `calculateNetIncome(grossIncome, pensionRate): number` - Apply 16% Icelandic pension deduction
- `calculatePartTimeAnnualIncome(hourlyWage, hoursPerWeek, weeksPerYear): number` - Convert hourly work to annual income
- `calculateReducedFINumber(fullFI, partTimeAnnualIncome, multiplier): number` - FI number reduced by part-time income

### Timeline Projection
- `calculateTimelineProjection(gap, annualSavings, returnRate): TimelineProjection` - Project years/months to reach FI with monthly data points

### Life Energy Calculation
- `calculateLifeEnergy(partTimeHours, actualHourlyWage): LifeEnergy` - Convert part-time income to work hours

### Scenario Calculation
- `calculateScenarioResult(scenario, fiNumber, currentSavings, returnRate, annualExpenses, actualHourlyWage, currentAge, coastFIRETimeline): BaristaFireScenarioResult` - Complete calculation for single scenario

### Main Orchestrator
- `calculateBaristaFireResults(state, fiNumber, monthlyExpenses, actualHourlyWage): BaristaFireResults` - Master function orchestrating all calculations

## Key Functionality

### Gap Calculation
- Calculates gap between current savings and FI target
- Returns 0 if user has reached Coast FIRE (savings >= FI)
- All calculations work with ISK (Icelandic króna)

### Timeline Projection
- Uses monthly compounding for accuracy
- Handles both active savings (part-time income > expenses) and Coast FIRE (income = expenses)
- Generates month-by-month data points for visualization
- Projects up to 600 months (50 years) maximum
- Accounts for investment growth during gap period

### Income Calculations
- Applies mandatory 16% pension contribution (12% employer + 4% employee)
- Converts hourly work to annual income using Icelandic standard (47 working weeks/year)
- Calculates net income after pension deduction

### Life Energy Integration
- Converts required income to work hours when actualHourlyWage available
- Shows hours per week, month, year, and total over gap period
- Calculates percentage of full-time work (40 hours/week standard)

### Scenario Comparison
- Calculates acceleration factor vs Coast FIRE baseline
- Categorizes scenarios as faster/slower/same compared to Coast FIRE
- 10% threshold for significant difference

## Dependencies
- `@/types/baristaFire` - TypeScript types
- `@/lib/constants/baristaFire` - Constants and defaults

## Integration
- Used by Barista FIRE Calculator components
- Integrates with Expense Baseline Tool for annual expenses
- Integrates with FI Number Builder for FI target
- Integrates with Actual Hourly Wage Calculator for life energy

## Icelandic Context
- Universal healthcare (not tied to employment) - noted in documentation
- Mandatory 16% pension contribution applied to all income
- All income shown as NET after pension
- 47 working weeks per year (5 weeks vacation standard in Iceland)
- 40 hours/week as full-time standard

## Performance
- All functions are pure (no side effects)
- Monthly precision for timeline accuracy
- Efficient calculation even with 5 scenarios
- Performance budget: <100ms for all calculations

## Edge Cases Handled
- Negative values (returns 0 or default)
- Gap <= 0 (Coast FIRE status)
- Zero annual savings (Coast FIRE path, only investment growth)
- Zero return rate with zero savings (infinite timeline)
- Very long timelines (max 600 months safety limit)
- Missing actualHourlyWage (life energy returns undefined)

## Testing
- Comprehensive unit tests in `src/lib/calculations/__tests__/baristaFire.test.ts`
- Tests cover all calculation functions
- Edge cases tested (zero values, Coast FIRE, unsustainable scenarios)
- Validation of timeline accuracy
- Pension deduction correctness verified

## Related
- Implements: Requirements FR-1 through FR-3 from specs/barista-fire/requirements-barista-fire.md
- Part of: specs/barista-fire/design-barista-fire.md (Section 5: Calculation Logic)
- Task: Task 1.3 from specs/barista-fire/tasks-barista-fire.md
