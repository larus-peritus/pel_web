# Module: Barista FIRE Types

## Basic Information

**Module Name**: BaristaFireTypes
**Location**: `apps/peninganaedalifid/src/types/baristaFire.ts`
**Created**: 2026-01-29
**Last Updated**: 2026-01-29
**Status**: ✅ Stable

## Purpose

Defines comprehensive TypeScript types and interfaces for the Barista FIRE Planner feature. The Barista FIRE strategy enables users to plan semi-retirement by working part-time to cover expenses while existing savings grow to full financial independence. These types are designed for the Icelandic context with universal healthcare and mandatory 16% pension contributions.

## Exports

### Types
- **`type ExpenseTier`** - Expense tier from Expense Baseline Tool ('barebones' | 'comfortable' | 'deluxe')

### Interfaces
- **`interface BaristaFireState`** - Main state for Barista FIRE calculator
- **`interface BaristaFireScenario`** - Individual part-time income scenario
- **`interface BaristaFireResults`** - Complete calculation results
- **`interface BaristaFireScenarioResult`** - Results for a single scenario
- **`interface TimelineProjection`** - Timeline showing path to full FI
- **`interface TimelineDataPoint`** - Single data point in timeline for visualization
- **`interface ScenarioPreset`** - Preset template for quick scenario setup
- **`interface BaristaFireValidationResult`** - Validation result for all inputs
- **`interface ScenarioValidationResult`** - Validation result for single scenario

### Constants
- **`const BARISTA_FIRE_DEFAULTS`** - Default values and Icelandic pension rates
- **`const SCENARIO_PRESETS`** - Icelandic scenario presets (20h/week, 30h/week, consulting)

## API Reference

### Type: ExpenseTier

```typescript
type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';
```

**Purpose**: References expense tier from Expense Baseline Tool to determine annual expenses for FI calculation.

---

### Interface: BaristaFireState

```typescript
interface BaristaFireState {
  currentSavings: number;
  selectedTier: ExpenseTier | null;
  customMonthlyExpense: number | null;
  investmentReturnRate: number;
  currentAge: number | null;
  scenarios: BaristaFireScenario[];
  lastUpdated: string;
  version: number;
}
```

**Purpose**: Main state structure stored in CalculatorContext and persisted to localStorage.

**Properties**:
- `currentSavings` - ISK - current investment/savings balance
- `selectedTier` - Expense tier from baseline tool (null if using custom)
- `customMonthlyExpense` - Manual override if no baseline (null if using tier)
- `investmentReturnRate` - Decimal (e.g., 0.05 = 5% annual return, default 0.05)
- `currentAge` - Optional for age projections (18-100, null if not provided)
- `scenarios` - Array of part-time income scenarios (max 5)
- `lastUpdated` - ISO 8601 timestamp of last modification
- `version` - Schema version for migration handling

---

### Interface: BaristaFireScenario

```typescript
interface BaristaFireScenario {
  id: string;
  name: string;
  grossAnnualIncome: number;
  netAnnualIncome: number;
  workHoursPerWeek: number | null;
  order: number;
}
```

**Purpose**: Represents a single part-time work scenario with income and optional work hours.

**Properties**:
- `id` - Unique identifier (auto-generated)
- `name` - User-defined name (e.g., "20 klst/viku", "Ráðgjöf")
- `grossAnnualIncome` - ISK per year before pension deduction
- `netAnnualIncome` - ISK per year after 16% pension (auto-calculated)
- `workHoursPerWeek` - Optional user input for work hours
- `order` - Display order (0-4)

---

### Interface: BaristaFireResults

```typescript
interface BaristaFireResults {
  fiNumber: number;
  currentSavings: number;
  gap: number;
  isCoastFIRE: boolean;
  monthlyExpenses: number;
  annualExpenses: number;
  scenarioResults: BaristaFireScenarioResult[];
  coastFIRETimeline: TimelineProjection;
}
```

**Purpose**: Complete calculation results including gap analysis and all scenario projections.

**Properties**:
- `fiNumber` - Target FI amount (annual expenses × 25)
- `currentSavings` - From state
- `gap` - Difference between FI number and current savings (0 if Coast FIRE)
- `isCoastFIRE` - True if gap <= 0 (already have enough to coast to FI)
- `monthlyExpenses` - ISK per month
- `annualExpenses` - ISK per year (monthlyExpenses × 12)
- `scenarioResults` - Array of results, one per scenario
- `coastFIRETimeline` - Baseline timeline (income = expenses, no additional savings)

---

### Interface: BaristaFireScenarioResult

```typescript
interface BaristaFireScenarioResult {
  scenarioId: string;
  scenarioName: string;
  grossAnnualIncome: number;
  netAnnualIncome: number;
  netMonthlyIncome: number;
  monthlySavings: number;
  annualSavings: number;
  savingsRate: number;
  yearsToFI: number;
  monthsToFI: number;
  projectedFIAge: number | null;
  finalNestEgg: number;
  lifeEnergy?: {
    hoursPerWeek: number;
    hoursPerMonth: number;
    hoursPerYear: number;
    totalHoursOverGap: number;
    percentageOfFullTime: number;
  };
  accelerationFactor: number;
  compareToCoastFIRE: 'faster' | 'slower' | 'same';
}
```

**Purpose**: Calculation results for a single scenario showing timeline, savings, and life energy.

**Key Fields**:
- `yearsToFI` / `monthsToFI` - Timeline to reach FI
- `lifeEnergy` - Optional work hours breakdown (only if actualHourlyWage available)
- `accelerationFactor` - Ratio vs Coast FIRE timeline
- `compareToCoastFIRE` - Human-readable comparison ('faster' if saves more than expenses)

---

### Interface: TimelineProjection

```typescript
interface TimelineProjection {
  yearsToFI: number;
  monthsToFI: number;
  dataPoints: TimelineDataPoint[];
}
```

**Purpose**: Timeline showing month-by-month progression to full FI.

**Properties**:
- `yearsToFI` - Total years (fractional)
- `monthsToFI` - Total months for display (0-11 remaining months)
- `dataPoints` - Monthly snapshots for chart visualization

---

### Interface: TimelineDataPoint

```typescript
interface TimelineDataPoint {
  year: number;
  month: number;
  age: number | null;
  savings: number;
  additionalSavings: number;
  investmentGrowth: number;
}
```

**Purpose**: Single month snapshot in timeline for visualization.

**Properties**:
- `year` - Year offset from start (0, 1, 2...)
- `month` - Month within year (0-11)
- `age` - Projected age at this point (null if currentAge not provided)
- `savings` - ISK balance at start of month
- `additionalSavings` - ISK added this month from income
- `investmentGrowth` - ISK gained from returns this month

---

### Constants: BARISTA_FIRE_DEFAULTS

```typescript
const BARISTA_FIRE_DEFAULTS = {
  investmentReturnRate: 0.05,
  pensionContributionRate: 0.16,
  employerPensionRate: 0.12,
  employeePensionRate: 0.04,
  fullTimeHoursPerWeek: 40,
  maxScenarios: 5,
} as const;
```

**Purpose**: Default values and Icelandic pension contribution rates.

**Values**:
- `investmentReturnRate: 0.05` - 5% real annual return (conservative)
- `pensionContributionRate: 0.16` - 16% total (mandatory in Iceland)
- `employerPensionRate: 0.12` - 12% employer contribution
- `employeePensionRate: 0.04` - 4% employee contribution
- `fullTimeHoursPerWeek: 40` - Standard Icelandic work week
- `maxScenarios: 5` - Maximum number of scenarios to prevent performance issues

---

### Constants: SCENARIO_PRESETS

```typescript
const SCENARIO_PRESETS: ScenarioPreset[] = [
  { name: '20 klst/viku', description: 'Hálft starf', hoursPerWeek: 20 },
  { name: '30 klst/viku', description: '75% starf', hoursPerWeek: 30 },
  { name: 'Ráðgjöf/Freelance', description: 'Sveigjanleg vinna', hoursPerWeek: 25 },
];
```

**Purpose**: Quick-start scenario templates for common Icelandic part-time arrangements.

**Presets**:
- **20 klst/viku** - Half-time work (50% of full-time)
- **30 klst/viku** - 75% work (common hlutastarf arrangement)
- **Ráðgjöf/Freelance** - Flexible consulting work (25 hours/week)

## Dependencies

### External Dependencies
None. This is a pure TypeScript type definition file.

### Internal Dependencies
None. Types are standalone and imported by other modules.

### Used By
- **BaristaFireCalculations** - Calculation functions use these types
- **BaristaFireComponents** - UI components use these types
- **CalculatorContext** - State management uses BaristaFireState
- **BaristaFireValidation** - Validation functions use these types

## Implementation Details

### Key Design Decisions

**1. Icelandic Pension Integration**
- All income automatically calculated as NET after 16% pension deduction
- Reflects mandatory Icelandic pension system (lífeyrissjóður)
- No option to disable pension deduction (it's required by law)

**2. Coast FIRE Baseline**
- Always calculate Coast FIRE timeline (income = expenses, no additional savings)
- Provides comparison baseline for all scenarios
- Shows minimum viable strategy

**3. Life Energy Optional**
- Life energy calculations only included if actualHourlyWage available
- Graceful degradation when wage not calculated
- Enables integration with Actual Hourly Wage Calculator

**4. Multiple Scenarios Support**
- Max 5 scenarios to prevent performance issues
- Each scenario independently calculated
- All compared to Coast FIRE baseline

### Data Validation Strategy

**BaristaFireValidationResult**:
- Separate `errors` (blocking) and `warnings` (non-blocking)
- Scenario-specific errors keyed by scenario ID
- Supports partial validation (can validate individual fields)

**ScenarioValidationResult**:
- Validates single scenario inputs
- Checks name length (max 50 chars)
- Validates income range (reasonable limits)
- Optional work hours validation

## Examples

### Basic Usage

```typescript
import {
  BaristaFireState,
  BaristaFireScenario,
  BARISTA_FIRE_DEFAULTS,
  SCENARIO_PRESETS,
} from '@/types/baristaFire';

// Create initial state
const initialState: BaristaFireState = {
  currentSavings: 10000000, // 10M ISK
  selectedTier: 'comfortable',
  customMonthlyExpense: null,
  investmentReturnRate: BARISTA_FIRE_DEFAULTS.investmentReturnRate,
  currentAge: 40,
  scenarios: [],
  lastUpdated: new Date().toISOString(),
  version: 1,
};

// Create a scenario
const scenario: BaristaFireScenario = {
  id: crypto.randomUUID(),
  name: '20 klst/viku',
  grossAnnualIncome: 3600000, // 300k/month
  netAnnualIncome: 3600000 * 0.84, // After 16% pension
  workHoursPerWeek: 20,
  order: 0,
};
```

### Using Presets

```typescript
import { SCENARIO_PRESETS } from '@/types/baristaFire';

// Apply preset to scenario
const preset = SCENARIO_PRESETS[0]; // 20 klst/viku
console.log(preset.name); // "20 klst/viku"
console.log(preset.hoursPerWeek); // 20
```

### Accessing Results

```typescript
import { BaristaFireResults } from '@/types/baristaFire';

function displayResults(results: BaristaFireResults) {
  if (results.isCoastFIRE) {
    console.log('You have reached Coast FIRE!');
    console.log(`Timeline: ${results.coastFIRETimeline.yearsToFI} years`);
  } else {
    console.log(`Gap to FI: ${results.gap.toLocaleString('is-IS')} kr`);
  }

  results.scenarioResults.forEach((scenario) => {
    console.log(`${scenario.scenarioName}:`);
    console.log(`  Years to FI: ${scenario.yearsToFI}`);
    if (scenario.lifeEnergy) {
      console.log(`  Work hours: ${scenario.lifeEnergy.hoursPerWeek} klst/viku`);
    }
  });
}
```

## Related

### Implements Requirements
- FR-1 (Gap Calculation) from [specs/barista-fire/requirements-barista-fire.md](/Users/larusperitus/Documents/code/peritus/pel_web/specs/barista-fire/requirements-barista-fire.md)
- FR-2 (Part-Time Income Scenarios) from requirements
- FR-3 (Timeline Projections) from requirements
- FR-4 (Icelandic Context) from requirements
- FR-5 (Integration with Expense Baseline) from requirements
- FR-6 (Integration with Life Energy) from requirements

### Part of Feature
- **Barista FIRE Planner** - Epic 1: Foundation (Task 1.1)

### Related Modules
- **BaristaFireCalculations** - Uses these types for calculation functions
- **CalculatorContext** - Stores BaristaFireState
- **ExpenseBaseline** - Provides ExpenseTier data

## References

### Design Documents
- [specs/barista-fire/design-barista-fire.md](/Users/larusperitus/Documents/code/peritus/pel_web/specs/barista-fire/design-barista-fire.md) - Section 4: Data Models
- [specs/barista-fire/tasks-barista-fire.md](/Users/larusperitus/Documents/code/peritus/pel_web/specs/barista-fire/tasks-barista-fire.md) - Task 1.1

### Icelandic Context
- Lífeyrissjóður (pension fund): 16% mandatory contribution
- Universal healthcare: Not tied to employment
- Work culture: Part-time less common but growing

---

**Maintained by**: Builder agents
**Last Review**: 2026-01-29
