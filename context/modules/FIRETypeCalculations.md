# FIRE Type Calculation Functions

## Location
`apps/peninganaedalifid/src/lib/calculations/fireTypes.ts`

## Purpose
Pure calculation functions for the FIRE Type Explorer (FIRE Leiðarvísir). Provides all mathematical calculations needed to compare and evaluate different FIRE (Financial Independence, Retire Early) strategies.

## Exports

### Basic FI Number Calculation

- `calculateFINumber(monthlyExpenses, multiplier)` - Calculate target nest egg
  - Formula: Monthly expenses × 12 × Multiplier
  - Standard multiplier: 25 (4% SWR) or 30 (3.33% SWR)
  - Returns: Target FI number in ISK

### Timeline Calculations

- `calculateYearsToFI(fiNumber, currentNetWorth, annualSavings, expectedReturn)` - Years to reach FI
  - Uses future value of series formula with monthly compounding
  - Iteratively simulates month-by-month growth
  - Returns: Years to reach FI (null if impossible within 100 years)

### CoastFIRE Calculations

- `calculateCoastFINumber(targetFI, currentAge, targetAge, expectedReturn)` - Present value needed to "coast"
  - Formula: PV = FV / (1 + r)^n
  - Calculates amount needed today to grow to FI by retirement
  - Returns: Amount needed today in ISK

### BaristaFIRE Calculations

- `calculateBaristaFINumber(targetFI, partTimeAnnualIncome, multiplier)` - Reduced FI with part-time income
  - Calculates how much part-time income reduces FI number
  - Formula: Reduced FI = Full FI - (Part-time income × Multiplier)
  - Returns: Reduced FI number in ISK

### Complete FIRE Calculation

- `calculateFIRECalculation(fireTypeId, inputs, assumptions, actualHourlyWage?)` - Complete calculation for one FIRE type
  - Calculates FI number, timeline, progress, effort, feasibility
  - Includes type-specific data (CoastFIRE, BaristaFIRE)
  - Optional life energy conversion with AWH
  - Returns: Complete FIRECalculation object

### Calculate All Types

- `calculateAllFIRETypes(inputs, assumptions, actualHourlyWage?)` - Calculate all 5 FIRE types at once
  - Convenience wrapper for all types
  - Returns: Object with calculations for leanfire, regularfire, coastfire, baristafire, fatfire

### Effort and Feasibility

- `calculateEffortLevel(yearsToFI, savingsRate)` - Categorize difficulty
  - Categories: 'low' | 'moderate' | 'high' | 'extreme'
  - Based on timeline and savings rate requirements
  - Returns: EffortLevel

- `calculateFeasibility(yearsToFI, currentAge)` - Score feasibility (0-100)
  - Considers time to FI and age at achievement
  - Penalizes long timelines and reaching FI late in life
  - Returns: Feasibility score (higher is better)

### Recommendation Engine

- `calculateFIRERecommendations(calculations)` - Generate personalized recommendations
  - Scores all FIRE types based on feasibility, timeline, effort
  - Provides reasoning and warnings in Icelandic
  - Returns: Array of FIRERecommendation sorted by rank

## Key Functionality

### Basic Calculations
- FI number calculation with configurable multipliers (25x-33x)
- Years to FI using compound growth simulation
- Handles edge cases (zero savings, already achieved, impossible goals)

### CoastFIRE
- Present value calculation to determine "coast point"
- Determines if already coasting
- Calculates years until can coast
- Work income needed while coasting

### BaristaFIRE
- Reduced FI number with part-time income offset
- Part-time income requirements (monthly)
- Hours per week needed (with AWH)
- Savings from using BaristaFIRE approach

### Progress Tracking
- Current progress percentage
- Amount remaining to FI
- Target date and target age
- Milestones

### Effort Assessment
- Categorizes difficulty level
- Based on savings rate and timeline
- Icelandic-contextualized thresholds

### Feasibility Scoring
- 0-100 score for achievability
- Considers timeline and age factors
- Penalizes unrealistic goals

### Recommendation Engine
- Scores all 5 FIRE types
- Ranks by feasibility and suitability
- Provides reasoning in Icelandic
- Identifies warnings and concerns
- Assigns confidence levels (high/medium/low)

## Dependencies
- `@/types/fireTypes` - TypeScript types
- `@/lib/constants/fireTypes` - FIRE type definitions

## Tests
- Location: `apps/peninganaedalifid/src/lib/calculations/__tests__/fireTypes.test.ts`
- Coverage: 58 unit tests, all passing
- Test categories:
  - Basic FI number calculations (7 tests)
  - Years to FI calculations (8 tests)
  - CoastFIRE calculations (6 tests)
  - BaristaFIRE calculations (5 tests)
  - Complete FIRE calculation (8 tests)
  - Calculate all types (4 tests)
  - Effort level calculation (6 tests)
  - Feasibility calculation (6 tests)
  - Recommendation engine (8 tests)

## Edge Cases Handled
- Zero or negative expenses
- Zero or negative savings
- Already achieved FI (current net worth ≥ FI number)
- Impossible timelines (>100 years)
- Zero return rate (no growth)
- Ages equal (CoastFIRE)
- Part-time income exceeds needs (BaristaFIRE)
- Very high or low savings rates
- Young and old starting ages

## Performance
- All calculations are pure functions (no side effects)
- Timeline simulation capped at 100 years (1200 months)
- Typical calculation time: <1ms per FIRE type
- All 5 types calculated in <5ms

## Icelandic Context
- Default multiplier: 30x (vs US standard 25x)
  - Accounts for Iceland's higher inflation
  - More conservative approach
- Work year: 47 weeks, 40 hours/week
  - Accounts for Icelandic vacation standards
- Pension age: 67 (Icelandic standard)
- All monetary values in ISK
- Recommendations and reasoning in Icelandic

## Integration
- Used by: FIRE Type Explorer UI components
- Part of: specs/fire-type-explorer/tasks-fire-type-explorer.md Task 1.3
- Related modules:
  - FIRETypeConstants.md (type definitions)
  - BaristaFireCalculations.md (BaristaFIRE specific)
  - CoastFireCalculations.md (CoastFIRE specific)
  - FatFireCalculations.md (FatFIRE specific)
  - LeanFireCalculations.md (LeanFIRE specific)

## Example Usage

```typescript
import {
  calculateAllFIRETypes,
  calculateFIRERecommendations
} from '@/lib/calculations/fireTypes';

const inputs: UserFinancialInputs = {
  currentAge: 40,
  targetRetirementAge: 65,
  currentNetWorth: 20_000_000,
  annualIncome: 6_000_000,
  annualSavings: 2_000_000,
  savingsRate: 33.33,
  monthlyExpenses: {
    barebones: 250_000,
    comfortable: 500_000,
    deluxe: 1_000_000,
  },
};

const assumptions: FIREAssumptions = {
  withdrawalRate: 0.04,
  expectedGrowthRate: 0.06,
  inflationRate: 0.025,
  pensionAge: 67,
  pensionMonthlyEstimate: null,
};

// Calculate all FIRE types
const calculations = calculateAllFIRETypes(
  inputs,
  assumptions,
  3_000 // Optional: AWH for life energy
);

// Get recommendations
const recommendations = calculateFIRERecommendations(calculations);

console.log(recommendations[0]); // Top recommendation
// {
//   fireTypeId: 'regularfire',
//   rank: 1,
//   score: 87,
//   confidence: 'high',
//   reasons: ['Mjög raunhæft markmið', 'Raunhæfur tími til marks', ...],
//   warnings: [],
//   yearsToFI: 18.5,
//   monthlySavingsRequired: 166_667
// }
```

## Related
- Implements: Requirements FR-2 from specs/fire-type-explorer/requirements-fire-type-explorer.md
- Part of: Epic 1 (Foundation) in specs/fire-type-explorer/tasks-fire-type-explorer.md
- Design: specs/fire-type-explorer/design-fire-type-explorer.md Section 5 (Calculation Logic)
