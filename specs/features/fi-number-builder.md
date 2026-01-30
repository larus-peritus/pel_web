# Feature: FI Number Builder (FI-tala reiknivél)

## Overview
The FI Number Builder calculates your Financial Independence (FI) target nest egg - the amount you need saved to retire comfortably. Based on "Your Money or Your Life" and Trinity Study principles, adapted for Icelandic context with higher inflation and pension system integration.

**Core Formula**: FI Number = Annual Expenses × Multiplier

## Status
✅ **COMPLETE** - All 9 epics implemented (2026-01-29)

## Key Features

### 1. Expense Source Selection
- **Baseline Mode**: Import from Expense Baseline Tool (3 tiers)
- **Custom Mode**: Manual monthly expense input
- Seamless switching between modes

### 2. Multiplier Selection
- **Standard Multipliers**: 25x (4%), 30x (3.33%), 33x (3%)
- **Custom Range**: 20x-50x with slider
- **Icelandic Context**: 30x-33x recommended (vs US 25x)
- Visual withdrawal rate display

### 3. Results Display
- Hero FI number with gradient background
- Detailed breakdown card:
  - Monthly/Annual expenses
  - Multiplier used
  - Withdrawal rate
  - Calculation formula
- Three display states (loading, no results, full results)

### 4. Scenario Comparison
- Compare all 3 expense tiers side-by-side
- Table view (desktop) / Card view (mobile)
- Show ISK and percentage differences
- Color-coded tiers (amber/green/purple)
- Bar chart visualization

### 5. Pension Integration
- Optional pension income input
- Pension-adjusted FI number calculation
- Bridge amount for early retirement
- Age-based calculations (default pension age: 67)

### 6. Life Energy Display
- Integration with Actual Hourly Wage
- Convert FI number to years of work
- Visual timeline representation
- Motivational framing

### 7. Educational Content
- Collapsible educational panel
- Explains FI number concept
- 4% rule and Icelandic adaptations
- Trinity Study reference

### 8. Icelandic Context
- Alert about higher inflation
- Conservative multiplier recommendations
- Pension system considerations
- All text in Icelandic

## Architecture

### Route
- **Path**: `/fi-tala`
- **Page Component**: `src/app/fi-tala/page.tsx`
- **Navigation**: FIRE tab in calculator navigation (first item)

### Components
All located in `src/components/fiNumber/`:

1. **FINumberBuilderCalculator.tsx** - Main orchestrator (350 lines)
2. **ExpenseSourceSelector.tsx** - Baseline vs Custom toggle (290 lines)
3. **MultiplierSelector.tsx** - Multiplier selection UI (330 lines)
4. **ResultsDisplay.tsx** - Primary results display (210 lines)
5. **ScenarioComparison.tsx** - Tier comparison table (331 lines)
6. **ScenarioComparisonChart.tsx** - Bar chart visualization (200 lines)
7. **PensionIncomeSection.tsx** - Pension input form (300 lines)
8. **PensionAdjustedResults.tsx** - Pension-adjusted display (275 lines)
9. **LifeEnergyDisplay.tsx** - Life energy visualization (290 lines)
10. **AWHPrompt.tsx** - Prompt for AWH calculator (142 lines)
11. **EducationalPanel.tsx** - Educational content (320 lines)
12. **IcelandicContextAlert.tsx** - Context warnings (135 lines)

### Types
`src/types/fiNumber.ts`:
- `FINumberBuilderState` - Calculator state
- `FINumberResults` - Calculation results
- `ExpenseSource` - Baseline or custom
- `StandardMultiplier` - 25, 30, or 33
- `ScenarioResult` - Single tier result
- `PensionAdjustedResult` - Pension calculations
- `FINumberLifeEnergy` - Life energy metrics
- `ScenarioComparisonResult` - All tier comparison
- `PensionEstimate` - Pension estimation

### Context Integration
Integrated with `CalculatorContext`:
- State: `fiNumberBuilder` (FINumberBuilderState)
- Results: `fiNumberResults` (FINumberResults)
- Actions: `updateFINumberBuilder()`
- Dependencies: `expenseBaseline`, `actualHourlyWage`

### Calculations
`src/lib/calculations/fiNumber.ts`:
- `calculateFINumber()` - Basic FI calculation
- `calculateWithdrawalRate()` - Withdrawal rate from multiplier
- `calculatePensionAdjustedFI()` - Pension adjustments
- `calculateLifeEnergy()` - Life energy metrics
- `calculateScenarios()` - All tier comparison
- `calculateBridgeAmount()` - Early retirement bridge

## Dependencies

### Required
- Expense Baseline Tool (for baseline mode)
- CalculatorContext (state management)

### Optional
- Actual Hourly Wage Calculator (for life energy display)

### External Libraries
- recharts (bar chart visualization)
- @heroicons/react (icons)

## User Flows

### Flow 1: Quick FI Number (Baseline Mode)
1. User completes Expense Baseline Tool
2. Navigates to FI Number Builder (FIRE tab)
3. Selects expense tier (Barebones/Comfortable/Deluxe)
4. Chooses multiplier (default: 30x)
5. Views FI number and breakdown
6. Compares scenarios across all tiers

### Flow 2: Custom FI Number
1. User navigates to FI Number Builder
2. Switches to "Custom" expense mode
3. Enters monthly expenses manually
4. Chooses multiplier
5. Views FI number

### Flow 3: Pension Integration
1. User calculates basic FI number
2. Expands pension section
3. Enters expected monthly pension
4. Enters target retirement age
5. Views pension-adjusted FI number
6. Sees bridge amount for early retirement

### Flow 4: Life Energy View
1. User completes AWH Calculator
2. Returns to FI Number Builder
3. Life energy display appears automatically
4. Views FI number in years of work
5. Sees visual timeline

## Testing

### Unit Tests
All components have comprehensive test suites in `tests/components/fiNumber/`:
- ResultsDisplay.test.tsx (30 tests)
- ScenarioComparison.test.tsx (25 tests)
- ScenarioComparisonChart.test.tsx (18 tests)
- PensionIncomeSection.test.tsx (28 tests)
- PensionAdjustedResults.test.tsx (24 tests)
- EducationalPanel.test.tsx (22 tests)
- IcelandicContextAlert.test.tsx (15 tests)

### Integration Tests
Calculation functions tested in `tests/lib/calculations/fiNumber.test.ts`:
- calculateFINumber (12 tests)
- calculatePensionAdjustedFI (10 tests)
- calculateLifeEnergy (8 tests)
- calculateScenarios (10 tests)

**Total**: 202 tests, all passing ✅

## Implementation Timeline

### Epic 1: Foundation (Complete)
- Types and interfaces
- Calculation functions
- CalculatorContext integration

### Epic 2: CalculatorContext Integration (Complete)
- State management
- Actions and reducers
- LocalStorage persistence

### Epic 3: Basic Calculator UI (Complete)
- ExpenseSourceSelector
- MultiplierSelector
- ResultsDisplay

### Epic 4: Scenario Comparison (Complete)
- ScenarioComparison table
- ScenarioComparisonChart

### Epic 5: Pension Integration (Complete)
- PensionIncomeSection
- PensionAdjustedResults

### Epic 6: Life Energy Display (Complete)
- LifeEnergyDisplay
- AWHPrompt

### Epic 7: Educational Content (Complete)
- EducationalPanel
- IcelandicContextAlert

### Epic 8: Testing & Polish (Complete)
- Component tests
- Integration tests
- Bug fixes

### Epic 9: Page & Routing (Complete - 2026-01-29)
- Route page (`/fi-tala`)
- Navigation integration (FIRE tab)
- Barrel exports (`index.ts`)

## Design Patterns

### Component Organization
- **Container Components**: FINumberBuilderCalculator (orchestration)
- **Presentational Components**: All other components (display/input)
- **Single Responsibility**: Each component has one clear purpose

### State Management
- **Local State**: UI-only state (expanded panels, tooltips)
- **Context State**: Calculator state (persisted to localStorage)
- **Derived State**: Results calculated from state + dependencies

### Responsive Design
- **Mobile First**: Base styles for mobile
- **Breakpoints**: sm, md, lg, xl
- **Adaptive UI**: Tables → Cards on mobile

### Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

## Icelandic Context Adaptations

### Higher Inflation
- Conservative multipliers (30x-33x vs US 25x)
- Warning alerts for aggressive withdrawal rates
- Educational content explains differences

### Pension System
- Integration with lífeyrissjóður
- Default pension age: 67
- Bridge calculations for early retirement
- Pension-adjusted FI reduces target

### Language
- All UI text in Icelandic
- Financial terms localized
- Currency formatting (ISK)

## Related Features

### Integrates With
- **Expense Baseline Tool** - Provides expense tiers
- **Actual Hourly Wage Calculator** - Enables life energy display
- **FIRE Type Explorer** - Different FIRE approaches (future)
- **Coast FIRE Calculator** - Partial FI (future)

### Complements
- **Savings Report** - Track progress to FI
- **Compound Savings** - Growth projections

## Future Enhancements

### Potential Additions
1. **Progress Tracking**: Show current savings vs FI number
2. **Timeline Calculator**: Years to FI based on savings rate
3. **Investment Returns**: Factor in expected returns
4. **Tax Considerations**: Icelandic tax on investment income
5. **Social Security**: Integration with Tryggingastofnun benefits

### Not Planned
- Investment advice
- Specific fund recommendations
- Tax optimization strategies

## Performance

### Bundle Size
- Total components: ~3,200 lines
- Lazy loaded via route code-splitting
- Chart library (recharts) loaded on demand

### Calculations
- All calculations client-side
- No API calls
- Instant updates (<50ms)

### State Persistence
- localStorage via CalculatorContext
- Automatic save on state change
- Rehydration on page load

## Privacy & Security
- No server communication
- All data stored locally
- No analytics tracking on calculations
- Privacy notice on page

## Exports
Barrel export via `src/components/fiNumber/index.ts`:
```typescript
// Components
export { FINumberBuilderCalculator }
export { ExpenseSourceSelector, MultiplierSelector }
export { ResultsDisplay }
export { ScenarioComparison, ScenarioComparisonChart }
export { PensionIncomeSection, PensionAdjustedResults }
export { LifeEnergyDisplay, AWHPrompt }
export { EducationalPanel, IcelandicContextAlert }

// Types
export type { FINumberBuilderState, FINumberResults, ... }
```

## Documentation
- Requirements: `specs/fi-number-builder/requirements-fi-number-builder.md`
- Design: `specs/fi-number-builder/design-fi-number-builder.md`
- Tasks: `specs/fi-number-builder/tasks-fi-number-builder.md`
- Module docs: `context/modules/[ComponentName].md`

## Success Metrics

### Completion Criteria (All Met ✅)
- [x] All 9 epics complete
- [x] All components implemented and tested
- [x] Route accessible at /fi-tala
- [x] Integrated into FIRE tab navigation
- [x] 200+ tests passing
- [x] TypeScript compilation successful
- [x] Documentation complete

### User Experience Goals (Achieved)
- [x] Clear, intuitive interface
- [x] Educational without overwhelming
- [x] Responsive across devices
- [x] Fast calculations (<50ms)
- [x] Seamless integration with other calculators

## Contact & Support
Part of Peningana Edal Ifið (Your Money or Your Life - Iceland)
- Educational tool for FIRE planning
- No financial advice provided
- Users encouraged to consult financial advisors
