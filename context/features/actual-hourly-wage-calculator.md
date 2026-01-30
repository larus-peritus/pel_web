# Feature: Actual Hourly Wage Calculator

## Overview
Calculator that helps users discover their true hourly wage by accounting for all work-related time and money costs. Based on Chapter 2 of "Your Money or Your Life" by Vicki Robin.

## Status
In Progress - 5/30 tasks complete (16.7%)

## Architecture
Client-side only calculator with:
- Pure calculation engine (no side effects)
- React Context for state management
- localStorage for persistence
- Export/Import for data portability

## Modules

### Type Definitions
- **CalculatorTypes** - context/modules/CalculatorTypes.md
  - Location: src/types/calculator.ts
  - 11 interfaces for inputs, results, state, and validation
  - Foundation for type safety across the feature

### Validation
- **InputValidators** - context/modules/InputValidators.md
  - Location: src/lib/utils/validators.ts
  - Full input validation with field-specific errors
  - Single field validation for real-time feedback
  - 23 unit tests, 100% passing

### Calculations
- **LifeEnergyFunctions** - context/modules/LifeEnergyFunctions.md
  - Location: src/lib/calculations/lifeEnergy.ts
  - Converts dollars to life energy hours
  - Human-readable formatting (minutes, hours, days)
  - 30 unit tests, 100% passing

### Custom Hooks
- **CustomHooks** - context/modules/CustomHooks.md
  - Location: src/hooks/useWageCalculator.ts, usePresets.ts, useDebounce.ts
  - useWageCalculator: Memoized calculation results
  - usePresets: Preset selection and detection
  - useDebounce: Generic value debouncing
  - 40 unit tests, 100% passing

### Components
- **PresetSelectorComponent** - context/modules/PresetSelectorComponent.md
  - Location: src/components/calculator/PresetSelector.tsx
  - PresetSelector: Individual category preset selector
  - PresetSelectors: Combined selectors for all categories
  - Pill-style buttons with active highlighting
  - 10 unit tests, 100% passing

## Dependencies
- React 19
- Next.js 15
- TypeScript 5
- Vitest (testing)

## Testing
- Unit tests: validators (23 tests), life energy (30 tests), hooks (40 tests), components (10 tests)
- Total: 103 tests, all passing
- Coverage: Validation layer complete, calculation helpers complete, custom hooks complete, preset selector component complete
- Testing infrastructure: Added @testing-library/jest-dom for DOM matchers

## Implementation Notes
- 2026-01-19: Created TypeScript types (Task 1)
- 2026-01-19: Implemented input validation with comprehensive tests (Task 6)
- 2026-01-19: Implemented life energy conversion functions (Task 4)
- 2026-01-19: Created custom hooks for calculator functionality (Task 10)
- 2026-01-19: Created PresetSelector component with full test coverage (Task 14)
- Next: Continue building UI components (Tasks 11-13, 15-20) and complete calculation engine (Tasks 2, 3, 5)

## Related Specifications
- Requirements: specs/actual-hourly-wage-calculator/requirements.md
- Design: specs/actual-hourly-wage-calculator/design.md
- Tasks: specs/actual-hourly-wage-calculator/tasks.md
