# Calculator Types

## Location
`apps/peninganaedalifid/src/types/calculator.ts`

## Purpose
Defines all TypeScript interfaces and types for the Actual Hourly Wage Calculator feature, providing type safety and clear contracts for all calculator-related data structures.

## Exports

### Core Input Types
- `interface IncomeInputs` - User's income information (gross annual, hours per week, weeks per year, additional income)
- `interface MoneyExpenses` - Annual work-related monetary costs (commute, clothing, meals, decompression, childcare, other)
- `interface TimeExpenses` - Weekly work-related time costs (commute, getting ready, decompression, work illness)
- `interface CalculatorInputs` - Complete input state combining income, money expenses, and time expenses

### Result Types
- `interface CalculationResults` - Complete calculation output including wages, breakdowns, and life energy hours
- `interface ExpenseBreakdownItem` - Individual expense category data for charts (category, label, amount, life energy hours, percentage)
- `interface TimeBreakdownItem` - Individual time category data for charts (category, label, hours per week/year, percentage)

### Scenario Management Types
- `interface Scenario` - Saved scenario for comparison (id, name, inputs, results, timestamps)
- `interface StoredState` - Complete app state for localStorage persistence (version, current inputs, scenarios, last updated)

### Preset Types
- `interface Preset` - Preset configuration (id, category, label, description, values)
- `type PresetCategory` - Union type for preset categories: 'commute' | 'clothing' | 'meals'

### Validation Types
- `interface ValidationResult` - Input validation result (isValid flag, errors map)

## Key Functionality

### Type Safety
- Ensures all calculator inputs have correct types and structure
- Prevents runtime errors from incorrect data shapes
- Provides IntelliSense and autocomplete in IDEs

### Data Contracts
- Defines clear interfaces between components and calculation engine
- Documents expected data structure for persistence layer
- Standardizes breakdown data for chart components

### Domain Modeling
- Models real-world concepts from "Your Money or Your Life" methodology
- Separates income, money expenses, and time expenses logically
- Represents life energy calculations in type system

## Dependencies
None - pure TypeScript type definitions

## Integration

### Used By
- All calculator components (input forms, results display, charts)
- Calculation engine functions (wage.ts, lifeEnergy.ts, breakdown.ts)
- Storage utilities (localStorage.ts, exportImport.ts)
- Context provider (CalculatorContext.tsx)
- Custom hooks (useWageCalculator.ts, usePresets.ts)

### Barrel Export
All types are re-exported from `src/types/index.ts` for clean imports:
```typescript
import type { CalculatorInputs, CalculationResults } from '@/types';
```

## Related
- Implements: Requirements from specs/actual-hourly-wage-calculator/requirements.md
- Part of: specs/actual-hourly-wage-calculator/design.md - Data Models section
- Task: Task 1 from specs/actual-hourly-wage-calculator/tasks.md

## Notes

### Design Decisions
- All monetary values stored as numbers (cents converted to dollars for display)
- Time values stored as decimal hours (e.g., 1.5 for 1 hour 30 minutes)
- Scenarios include both inputs and results to avoid recalculation on load
- StoredState includes version number for future migration support

### Validation Requirements
From requirements.md:
- grossAnnualIncome: Required, > 0
- workHoursPerWeek: 1-100
- weeksWorkedPerYear: 1-52
- All money expenses: >= 0
- All time expenses: >= 0, reasonable limits (< 40 hours for each category)

### Future Considerations
- May add tax-aware calculations (after-tax income)
- May add currency localization (ISK, EUR, etc.)
- May extend Scenario to include historical tracking data
