# Wage Calculations Module

## Location
`apps/peninganaedalifid/src/lib/calculations/wage.ts`

## Purpose
Provides pure calculation functions for computing nominal and actual hourly wages based on the "Your Money or Your Life" methodology. These functions form the core calculation engine of the Actual Hourly Wage Calculator.

## Exports

### Core Calculation Functions

- **`calculateNominalWage(income: IncomeInputs): number`** - Calculate simple hourly wage
  - Formula: (gross income + additional income) / (hours per week × weeks per year)
  - Returns nominal wage in dollars per hour
  - Returns 0 if total hours is 0 (prevents division by zero)

- **`calculateTotalMoneyExpenses(expenses: MoneyExpenses): number`** - Sum work-related expenses
  - Sums all expense categories: commute, clothing, meals, decompression, childcare, other
  - Returns total annual expenses in dollars
  - Pure calculation with no side effects

- **`calculateTotalExtraTime(time: TimeExpenses): number`** - Sum extra time spent on work
  - Sums all time categories: commute, getting ready, decompression, work illness
  - Returns total extra weekly hours
  - Supports decimal hour values (e.g., 1.5 for 1 hour 30 minutes)

- **`calculateActualWage(inputs: CalculatorInputs): number`** - Calculate true hourly wage
  - Formula: (total income - total expenses) / (base hours + extra hours) × weeks per year
  - Accounts for both money expenses and extra time investment
  - Reveals the real cost of earning money
  - Returns 0 if total hours is 0

- **`calculateResults(inputs: CalculatorInputs): CalculationResults`** - Complete calculation
  - Performs all calculations and returns comprehensive results object
  - Calculates both nominal and actual wages
  - Computes percentage reduction from nominal to actual
  - Includes net income, total expenses, and time breakdowns
  - Returns empty arrays for expenseBreakdown and timeBreakdown (filled by breakdown.ts)

## Key Functionality

### Nominal Wage Calculation
Simple division of total income by total hours:
```typescript
const nominalWage = (grossIncome + additionalIncome) / (hoursPerWeek * weeksPerYear);
```

### Actual Wage Calculation
Accounts for the hidden costs of work:
```typescript
const netIncome = totalIncome - totalExpenses;
const totalHours = (baseHours + extraHours) * weeksPerYear;
const actualWage = netIncome / totalHours;
```

### Life Energy Concept
Total hours invested in earning money = (work hours + extra hours) × weeks per year

### Percentage Reduction
Shows how much your "real" wage differs from nominal:
```typescript
percentageReduction = ((nominal - actual) / nominal) × 100
```

## Dependencies
- `@/types/calculator` - TypeScript types for all calculation interfaces

## Tests
- **Location**: `apps/peninganaedalifid/tests/lib/calculations/wage.test.ts`
- **Coverage**: 22 tests covering all functions and edge cases
  - calculateNominalWage: 5 tests (standard case, zero hours, zero weeks, additional income, part-time)
  - calculateTotalMoneyExpenses: 4 tests (all categories, all zeros, single category, large values)
  - calculateTotalExtraTime: 3 tests (all categories, all zeros, decimal values)
  - calculateActualWage: 6 tests (with expenses, with extra time, with both, zero hours, no reductions, same as nominal)
  - calculateResults: 4 tests (complete object, percentage reduction, zero wage, empty breakdowns, high-income scenario)

## Integration

### Used By
- Breakdown calculation functions (future)
- Calculator context/hooks (future)
- Results display components (future)
- Comparison/scenario features (future)

### Uses
- Calculator types from `@/types/calculator`

### Barrel Export
All functions exported from `src/lib/calculations/index.ts`:
```typescript
import { calculateResults } from '@/lib/calculations';
```

## Related
- **Implements**: Requirements REQ-CALC-001, REQ-CALC-002 from specs/actual-hourly-wage-calculator-requirements.md
- **Part of**: specs/actual-hourly-wage-calculator-design.md - Calculation Engine section
- **Task**: Task 3 from specs/actual-hourly-wage-calculator-tasks.md

## Design Decisions

### Pure Functions
All functions are pure (no side effects):
- Same inputs always produce same outputs
- No mutations of input data
- No external state dependencies
- Easy to test and reason about

### Zero Division Handling
Returns 0 instead of throwing errors when hours are zero:
- Safer for UI (no crashes)
- Allows graceful handling of edge cases
- Clear signal that calculation is invalid

### Decimal Hours Support
Time values stored and calculated as decimal hours:
- Example: 1.5 hours = 1 hour 30 minutes
- Simpler arithmetic than hours/minutes
- More precise for calculations

### Separation of Concerns
Each function has a single responsibility:
- `calculateNominalWage` - Simple wage calculation
- `calculateActualWage` - Real wage calculation
- `calculateResults` - Orchestrates all calculations
- Breakdown calculations delegated to separate module (Task 4)

## Example Usage

### Basic Wage Calculation
```typescript
const income = {
  grossAnnualIncome: 50000,
  workHoursPerWeek: 40,
  weeksWorkedPerYear: 50,
  additionalIncome: 0
};

const nominal = calculateNominalWage(income);
// Returns: 25 ($/hr)
```

### Complete Calculation
```typescript
const inputs = {
  income: {
    grossAnnualIncome: 50000,
    workHoursPerWeek: 40,
    weeksWorkedPerYear: 50,
    additionalIncome: 0
  },
  moneyExpenses: {
    commute: 2400,
    clothing: 500,
    meals: 1300,
    decompression: 800,
    childcareDelta: 0,
    other: 200
  },
  timeExpenses: {
    commute: 5,
    gettingReady: 2.5,
    decompression: 3,
    workIllness: 0.5
  }
};

const results = calculateResults(inputs);
// Returns: {
//   nominalHourlyWage: 25,
//   actualHourlyWage: 17.57,
//   percentageReduction: 29.72,
//   netAnnualIncome: 44800,
//   totalMoneyExpenses: 5200,
//   baseWeeklyHours: 40,
//   totalWeeklyHours: 51,
//   totalExtraHours: 11,
//   annualLifeEnergyHours: 2550,
//   expenseBreakdown: [],
//   timeBreakdown: []
// }
```

## Future Enhancements
- Add tax calculations (net vs gross income)
- Support multiple income sources
- Add inflation adjustments
- Include benefits valuation (health insurance, retirement matching)
