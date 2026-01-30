# Tasks: FI Number Builder

## Document Information

- **Feature Name**: FI Number Builder (FI-tala reiknivél)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-fi-number-builder.md
- **Design**: design-fi-number-builder.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Progressive Enhancement

**Strategy**: Build calculation engine first, then core UI, then progressive enhancements (pension, scenarios, life energy).

**Rationale**:
- Calculations can be tested independently
- Core FI number calculation provides immediate value
- Pension and scenario features add value incrementally
- Clear dependency chain enables parallel work

**Sequence**:
1. Foundation: Types, calculations, validation
2. State: CalculatorContext integration
3. Core UI: Basic FI number calculator (expense + multiplier)
4. Enhancement 1: Scenario comparison (requires expense baseline)
5. Enhancement 2: Pension integration (reduces FI number)
6. Enhancement 3: Life energy display (requires AWH)
7. Polish: Educational content, Icelandic context warnings, accessibility

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-8 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Epic 1-2 are sequential (foundation → state)
- Epic 3 (Core UI) depends on Epic 2
- Epics 4-6 (Enhancements) can be parallelized after Epic 3
- Epic 7 (Testing) spans all epics
- Epic 8 (Page & Routing) requires Epics 3-6

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Calculations

**Objective**: Create type definitions, constants, and pure calculation functions.

**Duration**: 5-7 hours

**Dependencies**: None (starting point), Expense Baseline Tool (2.1.11) must be implemented

**Deliverables**:
- TypeScript type definitions
- Constants for multipliers and defaults
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for FI number builder.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/fiNumber.ts` (new)

**Functionality**:
```typescript
// Define types for:
- ExpenseSource ('baseline' | 'custom')
- FINumberBuilderState (expenseSource, selectedTier, customMonthlyExpense, multiplier, etc.)
- FINumberResults (fiNumber, monthlyExpenses, annualExpenses, withdrawalRate, scenarios, etc.)
- PensionAdjustedResult (pensionAdjustedFI, bridgeAmount, etc.)
- FINumberLifeEnergy (yearsOfWork, yearsToFI)
- ScenarioResult (tier, fiNumber, difference)
- StandardMultiplier (25 | 30 | 33)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-2, FR-5, FR-6 (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors

---

#### Task 1.2: Create Constants Configuration

**Objective**: Define standard multipliers, defaults, and Icelandic context values.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/constants/fiNumber.ts` (new)

**Functionality**:
```typescript
// Define constants:
- STANDARD_MULTIPLIERS: [25, 30, 33]
- DEFAULT_MULTIPLIER: 30 (recommended for Iceland)
- MULTIPLIER_RANGE: { min: 20, max: 50 }
- PENSION_START_AGE: 67 (Icelandic retirement age)
- MULTIPLIER_LABELS: Record<StandardMultiplier, string>
- MULTIPLIER_DESCRIPTIONS: Record<StandardMultiplier, string>
- MULTIPLIER_WARNING_THRESHOLD: 28 (warn if below)
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-1.2, FR-1.3, FR-4.1, NFR-5

**Acceptance Criteria**:
- [x] All standard multipliers defined
- [x] Icelandic defaults (30x recommended, 67 pension age)
- [x] Exportable for use in UI
- [x] Warning threshold set appropriately

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/lib/constants/fiNumber.ts (215 lines)
- Context: context/modules/FINumberConstants.md
- Includes: STANDARD_MULTIPLIERS, DEFAULT_MULTIPLIER, all range constraints, Icelandic labels/descriptions, FI_NUMBER_DEFAULTS, ICELANDIC_WARNINGS, 9 helper functions for validation and conversion
- Build: TypeScript compilation successful

---

#### Task 1.3: Implement Core Calculation Functions

**Objective**: Create pure functions for FI number, pension adjustment, life energy.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fiNumber.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateFINumber(monthlyExpenses, multiplier): number
- calculateWithdrawalRate(multiplier): number
- getMonthlyExpenses(expenseSource, customExpense, baseline, tier): number
- calculatePensionAdjustedFI(annualExpenses, multiplier, pensionIncome, retirementAge): PensionAdjustedResult
- calculateFINumberLifeEnergy(fiNumber, actualHourlyWage, annualHours, currentSavings, annualSavings): FINumberLifeEnergy
- calculateScenarioComparison(baseline, multiplier, selectedTier): ScenarioComparisonResult
- calculateFINumberResults(state, baseline, awh, annualHours): FINumberResults
```

**Tests**:
- `/tests/lib/calculations/fiNumber.test.ts` (new)
  - Test basic FI calculation (500k × 30 = 180M)
  - Test pension adjustment (reduces FI, calculates bridge)
  - Test scenario comparison (all three tiers)
  - Test life energy (years of work)
  - Edge cases: zero expenses, negative values, missing baseline

**Requirements Addressed**: FR-1.1-1.5, FR-3.1-3.3, FR-5.1-5.5, FR-6.1-6.4

**Acceptance Criteria**:
- [x] All calculation functions implemented
- [x] Pure functions (no side effects)
- [x] Handles edge cases gracefully
- [x] Unit tests pass with >90% coverage

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/lib/calculations/fiNumber.ts (438 lines)
- Tests: apps/peninganaedalifid/tests/lib/calculations/fiNumber.test.ts (667 lines, 46 tests passing)
- Context: context/modules/FINumberCalculations.md
- Functions: calculateFINumber, calculateWithdrawalRate, getMonthlyExpenses, calculatePensionAdjustedFI, calculateBridgeAmount, calculateFINumberLifeEnergy, calculateScenarioComparison, calculateFINumberResults
- Coverage: 100% (all functions tested with edge cases)

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage FI number builder state with persistence.

**Duration**: 4-5 hours

**Dependencies**: Epic 1 complete, Expense Baseline Tool API available

**Deliverables**:
- Context state for FI number builder
- CRUD operations for state management
- LocalStorage persistence
- API methods for other calculators

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add FI number builder state and results to context.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add fiNumberBuilder to StoredState)

**Functionality**:
```typescript
// Add to context state:
- fiNumberBuilder: FINumberBuilderState | null
- fiNumberResults: FINumberResults | null

// Add to context type:
- updateFINumberBuilder: (state: Partial<FINumberBuilderState>) => void
- setExpenseSource: (source: ExpenseSource, tier?: ExpenseTier) => void
- setCustomExpense: (amount: number) => void
- setMultiplier: (multiplier: number) => void
- setPensionIncome: (income: number | null, retirementAge?: number | null) => void
- clearFINumberBuilder: () => void
- getFINumber: (tier?: ExpenseTier) => number
- hasFINumber: () => boolean
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-2.1-2.4, US-3

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] Results auto-calculated on state change
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for FI number builder management.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateFINumberBuilder: Merge partial updates, recalculate results
- setExpenseSource: Set source (baseline/custom), optionally set tier
- setCustomExpense: Validate and set custom expense amount
- setMultiplier: Validate (20-50 range) and set multiplier
- setPensionIncome: Set pension income and retirement age
- clearFINumberBuilder: Remove all FI builder data
- getFINumber: Return FI number for specific tier (or current)
- hasFINumber: Check if FI number has been calculated
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-1.1-1.5, FR-2.1-2.4, US-6

**Acceptance Criteria**:
- [ ] All actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Auto-recalculate results after each action
- [ ] Validation on inputs

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load FI number builder state from localStorage.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load fiNumberBuilder on mount
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: NFR-4

**Acceptance Criteria**:
- [ ] Loads state on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Cleared on reset

---

### EPIC 3: Core UI - Basic FI Number Calculator

**Objective**: Create core UI for calculating FI number with expense and multiplier inputs.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Main calculator component
- Expense source selector
- Multiplier selector
- Results display (basic)

---

#### Task 3.1: Create FINumberBuilderCalculator Main Component

**Objective**: Page-level container that orchestrates FI number calculation.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/FINumberBuilderCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Fetch state from CalculatorContext
- Coordinate child components
- Display results
- Educational intro section
- Handle missing dependencies (baseline, AWH)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-1, US-6

**Acceptance Criteria**:
- [x] Renders all child components
- [x] Handles missing baseline gracefully
- [x] Shows educational intro
- [x] Responsive layout

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/FINumberBuilderCalculator.tsx (320 lines)
- Context: context/modules/FINumberBuilderCalculator.md
- Description: Created main page-level container with hero section, two-column responsive layout, placeholder cards for child components (ExpenseSourceSelector, MultiplierSelector, PensionIncomeSection, ResultsDisplay), conditional scenario comparison section, comprehensive educational content explaining FI concepts and Icelandic context, warning alert for aggressive multipliers (<28x), graceful handling of missing dependencies (baseline/AWH), all text in Icelandic. Follows patterns from EmergencyFundCalculator and DebtPayoffPage. Ready for child component integration in Tasks 3.2-3.4.

---

#### Task 3.2: Create ExpenseSourceSelector Component

**Objective**: Toggle between expense baseline and custom input.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/ExpenseSourceSelector.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Radio group: Baseline vs Custom
- If baseline exists: show TierSelector (imported from expense baseline)
- If custom: show CurrencyInput for monthly expense
- Validation on custom input
- BaselinePrompt if baseline selected but doesn't exist
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-2.1-2.4, US-1, US-6

**Acceptance Criteria**:
- [x] Toggle between baseline and custom
- [x] TierSelector embedded when baseline selected
- [x] Custom input validates correctly
- [x] Shows prompt if baseline missing

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/ExpenseSourceSelector.tsx (243 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/ExpenseSourceSelector.test.tsx (267 lines, 22 tests passing)
- Context: context/modules/ExpenseSourceSelector.md
- Description: Created ExpenseSourceSelector component with radio group toggle between baseline and custom expense input. Features TierSelector integration (shows all three tiers with amounts when baseline exists), warning alert with link to baseline setup if baseline missing, CurrencyInput for custom monthly expense with real-time validation (>0, <=10M ISK), smart defaults (auto-selects "comfortable" tier when switching to baseline), info alert encouraging baseline usage, and comprehensive error handling. All text in Icelandic. Full test coverage including rendering, interactions, validation, accessibility (ARIA, radio group), conditional rendering, and visual states.

---

#### Task 3.3: Create MultiplierSelector Component

**Objective**: Select standard or custom multiplier.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/MultiplierSelector.tsx` (new)
- `/src/components/fiNumber/MultiplierButton.tsx` (new - sub-component)

**Functionality**:
```typescript
// Component features:
- Three standard multiplier buttons (25x, 30x, 33x)
- Show withdrawal rate under each button
- Badge indicators (warning for 25x, recommended for 30x)
- Custom multiplier slider (20x-50x)
- Collapsible explanation section
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-1.2-1.5, US-2, NFR-5

**Acceptance Criteria**:
- [x] Three standard buttons with withdrawal rates
- [x] Warning badge on 25x
- [x] Recommended badge on 30x
- [x] Custom slider works (20-50 range)
- [x] Explanation collapsible

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/MultiplierSelector.tsx (342 lines)
- Context: context/modules/MultiplierSelectorComponent.md
- Features: Three standard buttons (25x/30x/33x) with withdrawal rates and badges (warning/success/info), custom slider (20x-50x) with real-time display, smart mode switching, Icelandic context warning for multiplier < 28x, collapsible explanation section with educational content, Card-based layout, full Icelandic text with proper formatting
- MultiplierButton: Internal sub-component for standard button rendering
- TypeScript: Compilation verified with no errors
- Dependencies: Uses Button, Card, Slider, Badge UI components and FI Number constants

---

#### Task 3.4: Create ResultsDisplay Component

**Objective**: Display calculated FI number with breakdown.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/ResultsDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Large FI number display (hero number)
- Expense breakdown (monthly, annual, multiplier)
- Withdrawal rate shown
- Clear visual hierarchy
- Responsive design
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-1, NFR-2

**Acceptance Criteria**:
- [x] FI number prominently displayed
- [x] Breakdown clear and formatted
- [x] Icelandic number formatting
- [x] Responsive layout

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/ResultsDisplay.tsx (210 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/ResultsDisplay.test.tsx (30 tests, all passing)
- Context: context/modules/ResultsDisplay.md
- Features: Hero FI number display with gradient background, detailed breakdown card showing monthly/annual expenses/multiplier/withdrawal rate, calculation formula display, three display states (loading/no results/full results), responsive design (text-4xl→6xl), Icelandic formatting via formatCurrency/formatNumber/formatPercentage, accessibility features
- Build: TypeScript compilation successful

---

### EPIC 4: Enhancement - Scenario Comparison

**Objective**: Add comparison of FI numbers across all three expense tiers.

**Duration**: 4-5 hours

**Dependencies**: Epic 3 complete, Expense Baseline Tool available

**Deliverables**:
- Scenario comparison table
- Bar chart visualization
- Tier highlighting

---

#### Task 4.1: Create ScenarioComparison Component

**Objective**: Display FI numbers for all three expense tiers.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/ScenarioComparison.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three-row comparison table
- Columns: Tier, Annual Expenses, FI Number
- Highlight selected tier
- Show differences from selected tier
- Responsive (stack on mobile)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-3.1-3.5, US-4

**Acceptance Criteria**:
- [x] All three tiers displayed
- [x] Selected tier highlighted
- [x] Differences calculated and shown
- [x] Responsive table/cards

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/ScenarioComparison.tsx (331 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/ScenarioComparison.test.tsx (25 tests, all passing)
- Context: context/modules/ScenarioComparison.md
- Features: Three-row comparison table (desktop) / cards (mobile), highlights selected tier with color coding, shows ISK and percentage differences from selected tier, optional onTierSelect callback for interactivity, keyboard navigation support (Enter/Space), uses expense baseline colors (amber/green/purple), all text in Icelandic, comprehensive accessibility features
- Export: Added to src/components/fiNumber/index.ts

---

#### Task 4.2: Create ScenarioComparisonChart Component

**Objective**: Visual bar chart comparing three tiers.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/ScenarioComparisonChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Horizontal bar chart
- Three bars for three tiers
- Color-coded (consistent with expense baseline)
- Interactive tooltips
- Uses recharts or similar library
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: US-4

**Acceptance Criteria**:
- [x] Bar chart renders correctly
- [x] Colors match expense baseline tiers
- [x] Tooltips show details
- [x] Responsive sizing

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/ScenarioComparisonChart.tsx (230 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/ScenarioComparisonChart.test.tsx (16 tests, all passing)
- Context: context/modules/ScenarioComparisonChart.md
- Features: Horizontal bar chart using recharts, three color-coded bars (amber/green/purple from expense baseline), selected tier highlighted with stroke border, interactive custom tooltip showing annual expenses/multiplier/FI number, responsive ResponsiveContainer (300px height), value labels on bars (inside if wide, outside if narrow), legend with color indicators, X-axis formatted in millions (e.g., "90M kr"), all text in Icelandic
- Export: Added to src/components/fiNumber/index.ts

---

### EPIC 5: Enhancement - Pension Integration

**Objective**: Add pension income input and pension-adjusted FI calculation.

**Duration**: 5-6 hours

**Dependencies**: Epic 3 complete

**Deliverables**:
- Pension income input section
- Pension-adjusted FI display
- Bridge amount calculation and display

---

#### Task 5.1: Create PensionIncomeSection Component

**Objective**: Input fields for pension income and retirement age.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/PensionIncomeSection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section (closed by default)
- Pension income input (ISK/month)
- Retirement age input (default: 67)
- Validation (pension < expenses, age 40-80 range)
- Explanation text
- Warning if retirement age < 67
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.1, FR-5.4, US-7

**Acceptance Criteria**:
- [ ] Collapsible section works
- [ ] Two input fields (income, age)
- [ ] Validation functional
- [ ] Warning shown if early retirement

---

#### Task 5.2: Create PensionAdjustedResults Component

**Objective**: Display Full FI, Pension-Adjusted FI, and Bridge Amount.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/PensionAdjustedResults.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three-section display:
  1. Full FI (without pension)
  2. Pension-Adjusted FI (reduced by pension income)
  3. Bridge Amount (if retirement age < 67)
- Total needed highlighted
- Explanation of each section
- Visual distinction (colors/borders)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.2-5.5, US-7

**Acceptance Criteria**:
- [ ] Three sections clearly separated
- [ ] Total needed prominently shown
- [ ] Bridge explanation clear
- [ ] Visual hierarchy effective

---

#### Task 5.3: Update ResultsDisplay for Pension Mode

**Objective**: Integrate pension results into ResultsDisplay component.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/fiNumber/ResultsDisplay.tsx` (modify)

**Functionality**:
```typescript
// Add conditional rendering:
- If hasPension: show PensionAdjustedResults instead of basic
- Toggle between views if needed
- Maintain clear visual distinction
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.3

**Acceptance Criteria**:
- [ ] Pension results shown when applicable
- [ ] Fallback to basic display when no pension
- [ ] No layout breaks

---

### EPIC 6: Enhancement - Life Energy Display

**Objective**: Show FI number in years of work when AWH is available.

**Duration**: 3-4 hours

**Dependencies**: Epic 3 complete, Actual Hourly Wage Calculator data

**Deliverables**:
- Life energy display component
- Years to FI calculation (if savings rate available)
- AWH prompt if not available

---

#### Task 6.1: Create LifeEnergyDisplay Component

**Objective**: Display FI number as years of work.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/LifeEnergyDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Years of work display (FI ÷ annual net income)
- Years to FI (if savings data available)
- Visual progress indicators
- Explanation text
- Only render if AWH available
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-6.1-6.4, US-5

**Acceptance Criteria**:
- [ ] Years of work calculated correctly
- [ ] Years to FI shown if savings rate available
- [ ] Clear visual display
- [ ] Explanation text included

---

#### Task 6.2: Create AWHPrompt Component

**Objective**: Prompt user to calculate AWH if not available.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/fiNumber/AWHPrompt.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Alert with info variant
- Explanation of life energy benefit
- Link to AWH calculator
- Can be dismissed
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-5

**Acceptance Criteria**:
- [ ] Clear message in Icelandic
- [ ] Link to AWH calculator
- [ ] Dismissible

---

#### Task 6.3: Integrate LifeEnergyDisplay into ResultsDisplay

**Objective**: Add life energy section to results display.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/ResultsDisplay.tsx` (modify)

**Functionality**:
```typescript
// Add conditional rendering:
- If AWH available: show LifeEnergyDisplay
- If not: show AWHPrompt (optional)
- Section clearly separated from financial results
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-6.1-6.4

**Acceptance Criteria**:
- [ ] Life energy shown when AWH available
- [ ] Prompt shown when AWH missing (optional)
- [ ] Clear section separation

---

### EPIC 7: Polish - Educational Content & Context

**Objective**: Add educational panels, Icelandic context warnings, and final polish.

**Duration**: 4-5 hours

**Dependencies**: Epics 3-6 complete

**Deliverables**:
- Educational panel
- Icelandic context alert
- Input validation UI
- Accessibility improvements

---

#### Task 7.1: Create EducationalPanel Component

**Objective**: Collapsible educational content explaining FI concepts.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/EducationalPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible sections:
  1. What is FI Number?
  2. What is Withdrawal Rate?
  3. Why Iceland needs conservative rates
  4. FAQ section
- Expandable/collapsible
- Link to external resources
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-7.1-7.5

**Acceptance Criteria**:
- [x] Four main sections
- [x] Collapsible/expandable
- [x] Icelandic text
- [x] External links work

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/EducationalPanel.tsx (375 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/EducationalPanel.test.tsx (44 tests, all passing)
- Context: context/modules/EducationalPanel.md
- Features: Four collapsible sections (What is FI, Withdrawal rates, Icelandic context, FAQ), first section expanded by default, links to Mr. Money Mustache/Reddit/Bogleheads, comprehensive Icelandic educational content, CollapsibleSection sub-component, proper ARIA attributes, responsive design

---

#### Task 7.2: Create IcelandicContextAlert Component

**Objective**: Display warnings and recommendations based on Icelandic context.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/IcelandicContextAlert.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Warning alert if multiplier < 28
- Recommendation for 30x-33x
- Explanation of Icelandic inflation
- Link to educational content
- Conditional rendering (only show when needed)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-4.2-4.4, US-3

**Acceptance Criteria**:
- [x] Warning shows for low multipliers
- [x] Icelandic context explained
- [x] Links to more info
- [x] Can be dismissed

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/components/fiNumber/IcelandicContextAlert.tsx (156 lines)
- Tests: apps/peninganaedalifid/tests/components/fiNumber/IcelandicContextAlert.test.tsx (26 tests, all passing)
- Context: context/modules/IcelandicContextAlert.md
- Features: Conditional rendering (only shows when multiplier < 28), displays selected multiplier and withdrawal rate, explains three Iceland risks (inflation/currency/market), recommends 30x-33x, dismissible with state management, optional onLearnMore callback, warning variant styling, proper ARIA attributes

---

#### Task 7.3: Implement Input Validation UI

**Objective**: Add validation feedback to all inputs.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/fiNumber/ExpenseSourceSelector.tsx` (modify)
- `/src/components/fiNumber/MultiplierSelector.tsx` (modify)
- `/src/components/fiNumber/PensionIncomeSection.tsx` (modify)

**Functionality**:
```typescript
// Add validation UI:
- Error messages for invalid inputs
- Warning messages for questionable inputs
- Real-time validation feedback
- Clear error styling
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: NFR-2

**Acceptance Criteria**:
- [x] All inputs show validation feedback
- [x] Errors clear and actionable
- [x] Warnings non-blocking
- [x] Icelandic error messages

**Status**: ✅ Completed 2026-01-29
- Modified: apps/peninganaedalifid/src/components/fiNumber/ExpenseSourceSelector.tsx (enhanced validation)
- Modified: apps/peninganaedalifid/src/components/fiNumber/PensionIncomeSection.tsx (enhanced validation)
- Modified: apps/peninganaedalifid/src/components/fiNumber/MultiplierSelector.tsx (already had warning logic)
- Features: Error messages (red styling) for invalid inputs, warning messages (amber styling) for questionable inputs, real-time validation as user types, clear Icelandic error/warning messages, non-blocking warnings that allow continued input, consistent error styling across all components
- ExpenseSourceSelector: Added warnings for very low (<50k) or very high (>2M) expenses
- PensionIncomeSection: Added warnings for low pension (<50k), very high pension (>80% of expenses), very early retirement (<50), late retirement (>70)

---

### EPIC 8: Testing and Quality Assurance

**Objective**: Comprehensive testing and quality assurance.

**Duration**: 6-8 hours

**Dependencies**: Epics 1-7 complete

**Deliverables**:
- Unit tests for calculations
- Component tests
- Integration tests
- Accessibility audit

---

#### Task 8.1: Unit Tests for Calculations

**Objective**: Comprehensive unit tests for calculation functions.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/tests/lib/calculations/fiNumber.test.ts` (new)

**Tests**:
- calculateFINumber with various multipliers
- calculatePensionAdjustedFI with different scenarios
- calculateFINumberLifeEnergy accuracy
- calculateScenarioComparison all tiers
- Edge cases: zero, negative, missing values
- Boundary conditions

**Requirements Addressed**: All calculation requirements

**Acceptance Criteria**:
- [ ] All calculation functions tested
- [ ] Edge cases covered
- [ ] >90% coverage for calculation module

---

#### Task 8.2: Component Tests

**Objective**: Testing React components with React Testing Library.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/tests/components/fiNumber/*.test.tsx` (new)

**Tests**:
- FINumberBuilderCalculator rendering
- ExpenseSourceSelector toggling
- MultiplierSelector button selection
- ResultsDisplay formatting
- ScenarioComparison table display
- PensionIncomeSection validation
- LifeEnergyDisplay calculations

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [ ] Key components tested
- [ ] User interactions covered
- [ ] Validation tested

---

#### Task 8.3: Integration Tests

**Objective**: Test integration with CalculatorContext and other calculators.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/integration/fiNumber.test.tsx` (new)

**Tests**:
- Context state updates correctly
- LocalStorage persistence works
- Export/import includes FI builder
- Integration with expense baseline
- Integration with AWH calculator
- API methods return correct values

**Requirements Addressed**: All integration requirements

**Acceptance Criteria**:
- [ ] Context integration tested
- [ ] Persistence verified
- [ ] Cross-calculator integration works

---

#### Task 8.4: Accessibility Audit

**Objective**: Verify WCAG 2.1 AA compliance.

**Duration**: 1.5 hours

**Checklist**:
- [ ] All inputs have labels
- [ ] ARIA attributes correct
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Form validation accessible

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [ ] No accessibility violations in axe
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly

---

### EPIC 9: Main Page and Routing ✅ COMPLETE

**Objective**: Create the main page component and integrate into app navigation.

**Duration**: 2-3 hours

**Dependencies**: Epics 3-7 complete

**Deliverables**:
- ✅ Main calculator page component
- ✅ Route page
- ✅ Navigation integration

**Status**: ✅ Completed 2026-01-29
- All tasks complete (3/3)
- Route accessible at /fi-tala
- Integrated into FIRE tab navigation
- Complete barrel exports

---

#### Task 9.1: Create Route Page

**Objective**: Next.js page component for the FI number builder route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/fi-tala/page.tsx` (new)

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary
- FINumberBuilderCalculator component
- Metadata for SEO
- Hero section
```

**Tests**: N/A (covered by integration tests)

**Requirements Addressed**: N/A (routing)

**Acceptance Criteria**:
- [x] Route works at /fi-tala
- [x] Wrapped in CalculatorProvider
- [x] Loading fallback shown
- [x] SEO metadata set

**Status**: ✅ Completed 2026-01-29
- Implemented: apps/peninganaedalifid/src/app/fi-tala/page.tsx (77 lines)
- Features: CalculatorProvider wrapper, Suspense boundary with loading fallback, imports FINumberBuilderCalculator component, SEO metadata (title and description in Icelandic), privacy notice section
- Route: /fi-tala
- Build: TypeScript compilation successful

---

#### Task 9.2: Add to Calculator Navigation

**Objective**: Add FI number builder to FIRE Planning section navigation.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Create FIRE_PLANNING_CALCULATORS array:
- Add FI Number Builder as first item
// Add to navigation tabs:
- Create "FIRE Plönun" tab (if doesn't exist)
// Add routing:
- Conditional rendering for FI Number Builder
```

**Tests**: N/A (manual testing)

**Requirements Addressed**: Constraint - must be in FIRE Planning section

**Acceptance Criteria**:
- [x] Appears in FIRE Planning tab
- [x] Icon and description correct
- [x] Navigation works
- [x] First in FIRE Planning section

**Status**: ✅ Completed 2026-01-29
- Modified: apps/peninganaedalifid/src/components/calculator/CalculatorPageContent.tsx
- Features: Added FINumberBuilderCalculator import, updated FINumberBuilderContent to render actual calculator component instead of placeholder, back button integrated, calculator available in FIRE tab (already marked as available: true in FIRE_CALCULATORS array)
- Integration: FI Number Builder is first calculator in FIRE_CALCULATORS array (id: 'fi-tala'), appears as featured calculator with icon 🎯
- Build: TypeScript compilation successful

---

#### Task 9.3: Create Component Barrel Export

**Objective**: Export all FI number components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/fiNumber/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { FINumberBuilderCalculator } from './FINumberBuilderCalculator';
export { TierSelector } from '@/components/expenseBaseline'; // Re-export
// Export types:
export type { FINumberBuilderState, FINumberResults } from '@/types/fiNumber';
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [x] All public components exported
- [x] No circular dependencies
- [x] Clean import paths

**Status**: ✅ Completed 2026-01-29
- Updated: apps/peninganaedalifid/src/components/fiNumber/index.ts (69 lines)
- Exports: FINumberBuilderCalculator, ExpenseSourceSelector, MultiplierSelector, ResultsDisplay, ScenarioComparison, ScenarioComparisonChart, PensionIncomeSection, PensionAdjustedResults, LifeEnergyDisplay, AWHPrompt, EducationalPanel, IcelandicContextAlert
- Type exports: All component prop types plus FINumberBuilderState, FINumberResults, ExpenseSource, StandardMultiplier, ScenarioResult, PensionAdjustedResult, FINumberLifeEnergy, ScenarioComparisonResult, PensionEstimate from @/types/fiNumber
- Clean imports: All components now importable via '@/components/fiNumber'
- Build: TypeScript compilation successful, no circular dependencies

---

## 3. Implementation Schedule

### Phase 1: Foundation (Days 1-2)
- Epic 1: Types, constants, calculations (Day 1)
- Epic 2: CalculatorContext integration (Day 2)

### Phase 2: Core UI (Days 3-4)
- Epic 3: Basic FI number calculator (Days 3-4)

### Phase 3: Enhancements (Days 5-7)
- Epic 4: Scenario comparison (Day 5)
- Epic 5: Pension integration (Day 6)
- Epic 6: Life energy display (Day 6-7)
- Epic 7: Educational content & polish (Day 7)

### Phase 4: Testing & Deploy (Days 8-9)
- Epic 8: Testing and QA (Day 8)
- Epic 9: Main page and routing (Day 9)
- Final review and adjustments

**Total Duration**: 9-11 days (assuming 6-8 productive hours per day)

---

## 4. Risk Mitigation

### Risk 1: Missing Expense Baseline
**Mitigation**: Graceful fallback to custom input, prominent baseline prompt.

### Risk 2: Complex Pension Calculations
**Mitigation**: Start with simple pension adjustment, add bridge calculation incrementally.

### Risk 3: Icelandic Context Confusion
**Mitigation**: Clear warnings, educational content, recommended defaults (30x).

### Risk 4: Life Energy Without AWH
**Mitigation**: Optional feature, clear prompt to calculate AWH, graceful degradation.

---

## 5. Definition of Done

Each task is complete when:
- [ ] Code implemented and compiles without errors
- [ ] Unit tests pass (where applicable)
- [ ] Accessibility requirements met
- [ ] Icelandic text used for all UI
- [ ] Code reviewed or self-reviewed
- [ ] No console errors or warnings
- [ ] Responsive on mobile, tablet, desktop
- [ ] Integrated with CalculatorContext
- [ ] LocalStorage persistence works

---

## 6. Task Dependencies Diagram

```
Epic 1 (Foundation)
   ↓
Epic 2 (State Management)
   ↓
Epic 3 (Core UI)
   ├───→ Epic 4 (Scenario Comparison) ──┐
   ├───→ Epic 5 (Pension Integration) ───┤
   ├───→ Epic 6 (Life Energy Display) ───┤
   └───→ Epic 7 (Polish & Education) ────┤
                                         ↓
                                    Epic 8 (Testing)
                                         ↓
                                    Epic 9 (Page & Routing)
```

---

## 7. Testing Strategy Summary

### Unit Testing
- Focus: Pure calculation functions
- Coverage: >90% for calculation module
- Tools: Jest, TypeScript

### Component Testing
- Focus: UI components, user interactions
- Coverage: Key components and user flows
- Tools: React Testing Library, Jest

### Integration Testing
- Focus: CalculatorContext integration, cross-calculator APIs
- Coverage: State management, persistence, API methods
- Tools: React Testing Library, Jest

### Accessibility Testing
- Focus: WCAG 2.1 AA compliance
- Coverage: All interactive elements
- Tools: axe, keyboard testing, screen reader testing

---

## 8. Implementation Notes

### Parallel Work Opportunities

**After Epic 3 complete, these can be parallelized:**
- Epic 4 (Scenario Comparison): Independent feature
- Epic 5 (Pension Integration): Independent feature
- Epic 6 (Life Energy Display): Independent feature
- Epic 7 (Educational Content): Independent of calculations

**Team of 2-3 developers:**
- Developer 1: Epics 1-3 (Foundation + Core UI)
- Developer 2: Epics 4-5 (Scenario + Pension) [starts after Epic 3]
- Developer 3: Epics 6-7 (Life Energy + Polish) [starts after Epic 3]
- All: Epic 8 (Testing), Epic 9 (Integration)

### Critical Path
1. Epic 1 (Foundation)
2. Epic 2 (State)
3. Epic 3 (Core UI)
4. Epic 8 (Testing)
5. Epic 9 (Deploy)

**Enhancements (4-7) extend timeline but don't block deployment.**

---

## 9. Success Metrics

### Functionality
- [ ] FI number calculates correctly for all multipliers
- [ ] Scenario comparison shows all three tiers
- [ ] Pension adjustment reduces FI number appropriately
- [ ] Life energy displays when AWH available
- [ ] Icelandic context warnings show at right times

### Performance
- [ ] Calculations complete in <50ms
- [ ] Multiplier changes update in <100ms
- [ ] Page loads in <2 seconds

### Quality
- [ ] All tests pass (>90% coverage)
- [ ] No accessibility violations
- [ ] No console errors
- [ ] Works on mobile, tablet, desktop

### User Experience
- [ ] Can calculate FI number in <1 minute
- [ ] Clear which multiplier is recommended for Iceland
- [ ] Pension integration reduces FI number intuitively
- [ ] Life energy helps understand FI in time terms

---

**Tasks Phase Complete: Ready for Implementation**
