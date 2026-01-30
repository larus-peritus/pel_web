# Feature: Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)

## Overview
A calculator that shows the true FI number needed for early retirement in Iceland by accounting for the three-tier pension system (Séreign at 60, Lífeyrissjóður at 62-67, TR at 67). Breaks retirement into phases and shows how much less users need to save compared to traditional FIRE approaches.

## Status
In Progress - Epic 1 Complete (1/18 tasks complete)

## Architecture
Based on phase-based retirement planning with three distinct periods:
1. Gap Period (retirement to 60) - fully self-funded
2. Séreign Bridge (60 to 67) - private pension + savings
3. Full Pension (67+) - all pension sources active

### Key Components (Planned)
- Types: PensionAwareFireState, RetirementPhase, PensionAwareFireResults
- Constants: Icelandic pension system parameters
- Calculations: Phase calculations, present value, FI number adjustments
- State: CalculatorContext integration
- Components: Input forms, timeline visualization, phase breakdown, scenario comparison
- Page: /lifeyristengd-fire route

## Modules

### Completed
- PensionAwareFireTypes - context/modules/PensionAwareFireTypes.md
  - Complete type system
  - All pension inputs modeled
  - Phase structure defined
  - Results and warnings types
  - Scenario comparison types

### In Progress
None

### Planned
- PensionAwareFireConstants (Epic 2)
- PensionAwareFireCalculations (Epic 3)
- PensionAwareFireContext (Epic 4)
- Input components (Epic 5)
- Results components (Epic 6)
- Main calculator (Epic 7)

## Dependencies

### Internal Dependencies
- Expense Baseline Tool (for expense data integration)
- CalculatorContext (state management)
- UI Components (Card, CurrencyInput, Slider, etc.)

### External Dependencies
None (all calculations in-app)

## Testing

### Unit Tests
- [ ] Calculation functions (Epic 3)
- [ ] Phase calculations
- [ ] Present value calculations
- [ ] TR means-testing
- [ ] Séreign projections

### Component Tests
- [ ] Input components (Epic 5)
- [ ] Results components (Epic 6)
- [ ] Main calculator (Epic 7)

### Integration Tests
- [ ] Full flow (Epic 8)

## Implementation Notes

### 2026-01-30 - Task 1.1 Complete
- Created comprehensive type definitions (359 lines)
- All types from design document implemented
- TypeScript compilation successful
- Module documentation created
- Ready for constants and calculation implementation

### Design Decisions
- **Phase-Based Model**: Discrete phases align with pension access dates (easier to understand)
- **Present Value Approach**: Use investment return as discount rate (simpler, represents opportunity cost)
- **Simplified TR**: Link to official calculator for accuracy (TR rules are complex and change)
- **Even Séreign Withdrawal**: Default strategy from 60-67 (can be enhanced in v2)

### Icelandic Context
- All monetary amounts in ISK
- Pension ages: 60 (Séreign), 62-67 (Lífeyrissjóður), 67 (TR)
- FI multiplier: 30x (Icelandic context, more conservative)
- Life expectancy: 90 (for calculations)

## Progress Tracking

### Epic 1: Foundation Types ✅ COMPLETE (1/1 tasks)
- [x] Task 1.1: Create Type Definitions - 2026-01-30

### Epic 2: Constants & Defaults (0/1 tasks)
- [ ] Task 2.1: Create Constants File

### Epic 3: Calculation Engine (0/4 tasks)
- [ ] Task 3.1: Phase Calculation Functions
- [ ] Task 3.2: Present Value Calculations
- [ ] Task 3.3: TR Means-Testing Integration
- [ ] Task 3.4: Séreign Projection Functions

### Epic 4: State Management (0/1 tasks)
- [ ] Task 4.1: Context Integration

### Epic 5: Core Input Components (0/3 tasks)
- [ ] Task 5.1: BasicInputs Component
- [ ] Task 5.2: PensionInputs Component
- [ ] Task 5.3: PensionEducationalIntro Component

### Epic 6: Results Components (0/4 tasks)
- [ ] Task 6.1: PhaseTimeline Component
- [ ] Task 6.2: FINumberComparison Component
- [ ] Task 6.3: PhaseBreakdown Component
- [ ] Task 6.4: ScenarioComparison Component

### Epic 7: Main Calculator & Page (0/2 tasks)
- [ ] Task 7.1: PensionAwareFIRECalculator Main Component
- [ ] Task 7.2: Create Page Route

### Epic 8: Polish & Testing (0/2 tasks)
- [ ] Task 8.1: Unit Tests for Calculations
- [ ] Task 8.2: Add to Navigation & Calculator Hub

## Success Metrics
- [ ] Users understand why pension-adjusted FI is lower than traditional FI
- [ ] Users know exactly how much to save for each retirement phase
- [ ] Calculator seamlessly uses expense baseline data
- [ ] Educational content clarifies Icelandic pension system
- [ ] Mobile responsive and accessible
- [ ] No console errors
- [ ] Unit tests pass

## Related Documentation
- Requirements: specs/requirements-pension-aware-fire.md
- Design: specs/design-pension-aware-fire.md
- Tasks: specs/tasks-pension-aware-fire.md
