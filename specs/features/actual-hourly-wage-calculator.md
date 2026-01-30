# Feature: Actual Hourly Wage Calculator

## Overview
The Actual Hourly Wage Calculator helps users understand their true hourly wage by accounting for all work-related costs (money and time). Based on the methodology from "Your Money or Your Life" by Vicki Robin, Chapter 2.

This calculator reveals that the actual hourly wage is often 40-60% lower than the nominal wage due to hidden costs like commuting, work clothing, meals, and extra time spent getting ready and decompressing.

## Status
In Progress - 14/30 tasks complete

## Architecture
The calculator follows a clean architecture pattern:
- **Types Layer**: TypeScript interfaces for type safety
- **Calculation Engine**: Pure functions for wage calculations
- **Components**: React components for UI
- **Context**: State management with React Context
- **Storage**: localStorage for persistence

## Modules

### Core Types
- CalculatorTypes - context/modules/CalculatorTypes.md
  - Location: src/types/calculator.ts
  - Defines all TypeScript interfaces for inputs, results, scenarios, and presets

- CalculatorDefaults - context/modules/CalculatorDefaults.md
  - Location: src/lib/defaults.ts
  - Default values and storage configuration constants

### Calculation Engine
- WageCalculations - context/modules/WageCalculations.md
  - Location: src/lib/calculations/wage.ts
  - Core wage calculation functions (nominal, actual, totals)
  - Barrel export: src/lib/calculations/index.ts

- LifeEnergyFunctions - context/modules/LifeEnergyFunctions.md
  - Location: src/lib/calculations/lifeEnergy.ts
  - Life energy conversion and formatting functions
  - Barrel export: src/lib/calculations/index.ts

- BreakdownFunctions - context/modules/BreakdownFunctions.md
  - Location: src/lib/calculations/breakdown.ts
  - Expense and time breakdown generation for charts
  - Barrel export: src/lib/calculations/index.ts

### Presets
- PresetsConfiguration - context/modules/PresetsConfiguration.md
  - Location: src/lib/presets/index.ts
  - Preset configurations for commute, clothing, and meals

### State Management
- CalculatorContext - context/modules/CalculatorContext.md
  - Location: src/context/CalculatorContext.tsx
  - Provides calculator state and actions via React Context
  - Auto-calculation, persistence, scenario management

- CustomHooks - context/modules/CustomHooks.md
  - Location: src/hooks/
  - useWageCalculator, usePresets, useDebounce hooks

### Components
- IncomeInputsComponent - context/modules/IncomeInputsComponent.md
  - Location: src/components/calculator/IncomeInputs.tsx
  - Income input section (4 fields: gross income, hours, weeks, additional income)
  - Barrel export: src/components/calculator/index.ts

- TimeInputs - context/modules/TimeInputs.md
  - Location: src/components/calculator/TimeInputs.tsx
  - Time expense input section (4 fields: commute, getting ready, decompression, work illness)
  - Barrel export: src/components/calculator/index.ts

- LifeEnergyConverter - context/modules/LifeEnergyConverter.md
  - Location: src/components/calculator/LifeEnergyConverter.tsx
  - Interactive dollar-to-time converter with quick amount buttons
  - Barrel export: src/components/calculator/index.ts

- ResultsDisplay - context/modules/ResultsDisplayComponent.md
  - Location: src/components/calculator/ResultsDisplay.tsx
  - Main results display showing actual vs nominal hourly wage
  - Barrel export: src/components/calculator/index.ts

- PlainLanguageSummary - context/modules/PlainLanguageSummaryComponent.md
  - Location: src/components/calculator/PlainLanguageSummary.tsx
  - Plain language explanation of results with insights
  - Barrel export: src/components/calculator/index.ts

- ExpenseRankings - context/modules/ExpenseRankingsComponent.md
  - Location: src/components/calculator/ExpenseRankings.tsx
  - Ranked list of expenses by life-energy impact with progress bars
  - Barrel export: src/components/calculator/index.ts

- ScenarioManager - context/modules/ScenarioManagerComponent.md
  - Location: src/components/calculator/ScenarioManager.tsx
  - Scenario management UI for saving, loading, and deleting scenarios
  - Barrel export: src/components/calculator/index.ts

- TimeChart - context/modules/TimeChartComponent.md
  - Location: src/components/calculator/TimeChart.tsx
  - Donut/pie chart showing time allocation breakdown
  - Barrel export: src/components/calculator/index.ts

### Components (Pending)
- Input Components: ExpenseInputs
- Chart Components: BreakdownChart
- Preset Components: PresetSelector

## Dependencies
- React (18+)
- Next.js (15+)
- TypeScript (5+)
- Tailwind CSS (4+)
- Chart library (Recharts - to be added)

## Key Features
1. Calculate actual hourly wage accounting for money and time costs
2. Visual breakdowns of expenses and time allocation
3. Life energy converter (dollars to hours of life)
4. Plain language summaries and insights
5. Save and compare multiple scenarios
6. Export/import data for backup
7. Preset configurations for common situations
8. Mobile-responsive design
9. Full accessibility (WCAG 2.1 AA)

## Testing
- Unit tests for calculation functions
- Component tests for React components
- Integration tests for context and storage
- E2E tests for complete user flows

## Implementation Notes

### 2026-01-19
- Completed Task 1: Create TypeScript Types
  - Created src/types/calculator.ts with all calculator-related interfaces
  - Created src/types/index.ts barrel export for clean imports
  - All types follow design specification exactly
  - Zero TypeScript errors
  - Documented in context/modules/CalculatorTypes.md

- Completed Task 2: Create Default Values
  - Created src/lib/defaults.ts with all default values
  - Includes DEFAULT_INCOME, DEFAULT_MONEY_EXPENSES, DEFAULT_TIME_EXPENSES
  - Storage constants: STORAGE_VERSION, STORAGE_KEY
  - 22 tests, all passing
  - Documented in context/modules/CalculatorDefaults.md

- Completed Task 3: Create Calculation Engine - Core Functions
  - Created src/lib/calculations/wage.ts with pure calculation functions
  - Implemented calculateNominalWage, calculateActualWage, calculateResults
  - Implemented helper functions for totaling expenses and time
  - All functions are pure with no side effects
  - Handles edge cases (zero division returns 0)
  - 22 tests, all passing
  - Documented in context/modules/WageCalculations.md

- Completed Task 8: Create Presets Configuration
  - Created src/lib/presets/index.ts with preset configurations
  - 3 preset categories: commute, clothing, meals
  - Helper functions: getPresetsByCategory, detectPreset, getPresetById
  - 21 tests, all passing
  - Documented in context/modules/PresetsConfiguration.md

- Completed Task 4: Implement Life Energy Functions
  - Created src/lib/calculations/lifeEnergy.ts with life energy conversion functions
  - Implemented dollarsToLifeEnergy, formatLifeEnergy, formatDollarsAsLifeEnergy
  - Adaptive formatting: minutes, hours+minutes, or work days+hours
  - All functions pure with comprehensive edge case handling
  - 30 tests, all passing
  - Documented in context/modules/LifeEnergyFunctions.md

- Completed Task 5: Implement Breakdown Functions
  - Created src/lib/calculations/breakdown.ts with breakdown generation functions
  - Implemented generateExpenseBreakdown() with sorting, filtering, and life energy calculations
  - Implemented generateTimeBreakdown() with base hours and percentage calculations
  - Implemented getTotalExpenses() and getTotalWeeklyHours() aggregation functions
  - Human-readable labels for all categories (EXPENSE_LABELS, TIME_LABELS)
  - Automatic zero-value filtering and descending sort for expenses
  - 19 tests, all passing
  - Documented in context/modules/BreakdownFunctions.md

- Completed Task 9: Create Calculator Context
  - Created CalculatorProvider with full state management
  - Implemented useCalculator hook with error handling
  - Auto-calculation, debounced auto-save, scenario management
  - Export/import functionality with validation
  - 27 tests, all passing
  - Documented in context/modules/CalculatorContext.md

- Completed Task 10: Create Custom Hooks
  - Created useWageCalculator, usePresets, useDebounce hooks
  - Memoized calculations and stable callbacks
  - 40 tests, all passing
  - Documented in context/modules/CustomHooks.md

- Completed Task 11: Create Income Input Component
  - Created IncomeInputs component with Card layout
  - Four input fields: gross income, hours per week, weeks per year, additional income
  - Integration with CalculatorContext via useCalculator hook
  - CurrencyInput for monetary fields, NumberInput for numeric fields
  - Full accessibility (ARIA attributes, labels, help text)
  - Responsive 2-column grid layout for hours/weeks
  - 23 tests, all passing
  - Documented in context/modules/IncomeInputsComponent.md

- Completed Task 13: Create Time Expense Input Component
  - Created TimeInputs component with Card layout
  - Four time expense fields with NumberInput (min=0, max=40, step=0.5)
  - Real-time total extra hours calculation and display
  - Full accessibility with labels, IDs, and descriptions
  - 21 tests, all passing
  - Documented in context/modules/TimeInputs.md

- Completed Task 17: Create Life Energy Converter Component
  - Created LifeEnergyConverter component for interactive dollar-to-time conversion
  - CurrencyInput for entering dollar amounts
  - Quick amount buttons ($50, $100, $500, $1000) with active highlighting
  - Real-time life energy calculation using actual hourly wage
  - Human-readable time formatting (minutes, hours, or work days)
  - Graceful null return when results unavailable
  - useMemo optimization for calculation performance
  - 21 tests, all passing
  - Documented in context/modules/LifeEnergyConverter.md

- Completed Task 22: Implement Scenario Management
  - Created ScenarioManager component for saving/loading/deleting scenarios
  - Save current inputs as named scenario (up to 3 scenarios enforced)
  - Load scenario functionality to restore inputs
  - Delete scenario functionality
  - Scenario list display showing name and actual wage
  - Input validation with whitespace trimming
  - Keyboard shortcuts (Enter to save, Escape to cancel)
  - Autofocus on input for quick naming
  - Count badge showing scenarios saved (e.g., "2/3")
  - Empty state message when no scenarios saved
  - Integration with CalculatorContext scenario CRUD functions
  - 18 tests, all passing
  - Documented in context/modules/ScenarioManagerComponent.md

- Completed Task 19: Create Time Breakdown Chart Component
  - Created TimeChart component with donut/pie chart visualization
  - Pure CSS conic-gradient for chart rendering (no external libraries)
  - Five color-coded time segments (work, commute, ready, decompression, illness)
  - Donut chart with center display showing total weekly hours
  - Color legend with hours and percentages for each category
  - Responsive layout (chart + legend stack on mobile, side-by-side on desktop)
  - Total annotation showing weekly and annual hours
  - Decimal formatting (1 decimal place for hours and percentages)
  - Design system color mapping (primary, warning, error, purple, orange)
  - 13 tests, all passing
  - Documented in context/modules/TimeChartComponent.md

## Related Specs
- Requirements: /Users/larusperitus/Documents/code/peritus/pel_web/specs/actual-hourly-wage-calculator/requirements.md
- Design: /Users/larusperitus/Documents/code/peritus/pel_web/specs/actual-hourly-wage-calculator/design.md
- Tasks: /Users/larusperitus/Documents/code/peritus/pel_web/specs/actual-hourly-wage-calculator/tasks.md

## Next Steps
1. Task 6: Implement Input Validation Functions
2. Continue with remaining tasks per tasks.md
