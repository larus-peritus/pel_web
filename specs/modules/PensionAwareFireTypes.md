# Pension-Aware FIRE Types Module

## Location
`src/types/pensionAwareFire.ts`

## Purpose
Provides comprehensive TypeScript type definitions for the Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél). This module defines all interfaces, types, and constants needed to model Iceland's three-tier pension system and calculate true FI numbers accounting for future pension income.

## Exports

### Core Types
- `type ExpenseSource` - Source of expense data ('baseline' | 'manual')
- `type ExpenseTier` - Baseline expense tier ('barebones' | 'comfortable' | 'deluxe')
- `type RetirementPhaseId` - Phase identifier ('gap' | 'sereign-bridge' | 'full-pension')
- `type WarningSeverity` - Warning level ('info' | 'warning' | 'error')

### Input Types
- `interface LifeyrissjodurInput` - Occupational pension input data
  - expectedMonthlyAmount: number
  - startAge: number (62-70)
- `interface SereignInput` - Private pension input data
  - currentBalance: number
  - monthlyContribution: number
  - employerMatchPercent: number
- `interface TRInput` - State pension input data
  - expectFullTR: boolean
  - manualOverrideAmount: number | null

### State
- `interface PensionAwareFireState` - Complete calculator input state
  - Basic financial inputs (age, retirement age, expenses, savings)
  - Pension inputs (lífeyrissjóður, séreign, TR)
  - Scenarios and metadata

### Phases
- `interface PhaseIncomeSources` - Income breakdown for a phase
  - Savings withdrawal, investment returns, pension sources
- `interface RetirementPhase` - Complete phase definition
  - Phase metadata (id, names, ages, duration)
  - Income sources breakdown
  - Funding requirements (required at start, remaining at end)
  - Status flags (isSelfFunded, hasSurplus)

### Results
- `interface SereignProjection` - Séreign growth projections
  - balanceAt60: number
  - monthlyWithdrawal60to67: number
- `interface TREstimate` - TR means-testing results
  - estimatedMonthly: number
  - reductionPercent: number
  - incomeAboveExemption: number
- `interface PlanWarning` - Plan viability warning
  - severity, code, messageIs, messageEn
- `interface PensionAwareFireResults` - Complete calculation output
  - FI numbers (traditional vs pension-adjusted)
  - Savings comparison
  - Phases array
  - Timeline projections
  - Pension projections
  - Viability and warnings

### Scenarios
- `interface SavedScenario` - Saved scenario for comparison
  - id, name, createdAt
  - inputs snapshot (Partial<PensionAwareFireState>)
  - results snapshot (PensionAwareFireResults)

### Constants
- `EXPENSE_TIER_LABELS` - Icelandic labels for expense tiers
- `PHASE_LABELS` - Icelandic/English labels for retirement phases
- `STORAGE_KEY` - localStorage key ('pensionAwareFire_state')

## Key Functionality

### Type Safety
- Ensures all pension inputs are properly structured
- Validates phase calculations have required fields
- Type-safe state management for CalculatorContext

### Phase Modeling
- Models Iceland's three retirement phases:
  1. Gap Period (retirement to 60) - fully self-funded
  2. Séreign Bridge (60 to 67) - private pension + savings
  3. Full Pension (67+) - all pension sources active

### Pension System Integration
- Séreign: Private pension accessible at 60
- Lífeyrissjóður: Occupational pension (typically 62-67)
- TR: State pension at 67 with means-testing

### Scenario Comparison
- Type-safe scenario storage
- Partial input snapshots for flexibility
- Complete results snapshots for comparison

## Dependencies
None - this is a pure type definition module.

## Tests
No direct tests (type definitions), but types are validated by:
- TypeScript compiler (tsc --noEmit)
- Usage in calculation functions (will be tested)
- Usage in components (will be tested)

## Integration
- Used by: Calculation functions, state management, components
- Implements: Requirements from specs/requirements-pension-aware-fire.md
- Part of: specs/design-pension-aware-fire.md type system

## Related
- Implements: FR-1, FR-2, FR-4 from requirements
- Supports: US-1, US-2, US-3, US-4 user stories
- Foundation for: All pension-aware FIRE calculator features

## Design Decisions

### Why Three Phase Types?
Iceland's pension system has three distinct access ages (60, 62-67, 67), creating natural phase boundaries.

### Why Partial<PensionAwareFireState> for Scenarios?
Allows saving only changed inputs, reducing storage size and making comparisons clearer.

### Why Separate Income Sources?
Transparency - users need to see exactly where retirement income comes from in each phase.

### Why Both Icelandic and English Labels?
Icelandic for UI (primary audience), English for code clarity and potential future internationalization.

## Implementation Notes
- All monetary amounts in ISK (Icelandic Króna)
- Percentages stored as decimals (0.05 = 5%)
- Ages stored as integers
- Dates stored as Date objects
- Version field enables future state migrations
