# Tasks: LeanFIRE Planner

## Document Information

- **Feature Name**: LeanFIRE Planner (Lágmarks FIRE Skipuleggjandi)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-lean-fire.md
- **Design**: design-lean-fire.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Layers

**Strategy**: Build calculation engine first, then layer UI features (minimum FI → geographic comparison → expense reduction → frugality optimization → visualization).

**Rationale**:
- Calculations can be tested independently
- Each layer adds value incrementally
- Complex features (frugality tips, trade-off chart) built on solid foundation
- Integration with expense baseline happens early
- Iceland-specific data is central to all features

**Sequence**:
1. Foundation: Types, Iceland constants, core calculations
2. State: CalculatorContext integration with expense baseline
3. Basic UI: Minimum FI summary
4. Geographic: Location comparison
5. Scenarios: Expense reduction modeling
6. Optimization: Frugality tips engine
7. Visualization: Trade-off chart
8. Polish: Context panel, educational content, accessibility

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-8 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Epic 2 (State) depends on Epic 1 (Foundation)
- Epic 3 (Basic UI) depends on Epic 2
- Epics 4-6 can partially overlap after Epic 3
- Epic 7 (Visualization) depends on Epics 2-5
- Epic 8 (Polish) depends on all previous epics

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Iceland Constants, Core Calculations

**Objective**: Create type definitions, Iceland-specific constants, and pure calculation functions for LeanFIRE.

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Iceland barebones cost constants
- Location profiles (Reykjavík, Landsbyggð)
- Frugality tips database
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for LeanFIRE data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/leanFire.ts` (new)

**Functionality**:
```typescript
// Define types for:
- LeanFireState (inputs)
- LeanFireResults (calculated results)
- CategoryExpenses (housing, food, transport, etc.)
- ReductionScenario (expense reduction scenario)
- GeographicComparison (location comparison)
- LocationProfile (Reykjavík or Landsbyggð)
- FrugalityTip (personalized tip)
```

**Tests**: N/A (types only)

**Requirements Addressed**: All (foundational)

**Acceptance Criteria**:
- [x] All types exported from single file
- [x] JSDoc comments for each interface
- [x] Consistent with existing calculator types
- [x] No TypeScript errors

---

#### Task 1.2: Create Iceland Constants and Defaults

**Objective**: Define Iceland-specific barebones expenses and location data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/constants/leanFire.ts` (new)

**Functionality**:
```typescript
// Define constants:
- ICELAND_BAREBONES_REYKJAVIK: CategoryExpenses (240k/month)
- ICELAND_BAREBONES_LANDSBYGGD: CategoryExpenses (200k/month)
- LOCATION_PROS_CONS: { reykjavik, landsbyggd }
- LEANFIRE_DEFAULTS: { fiMultiplier: 30, investmentReturn: 0.05 }
- REDUCTION_PERCENT_OPTIONS: [10, 25, 50, 100]
- LEANFIRE_COLORS: color scheme for UI
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-2 (Geographic), NFR-5 (Icelandic context)

**Acceptance Criteria**:
- [x] Reykjavík barebones: 240,000 kr/month total ✅ Completed 2026-01-29
- [x] Landsbyggð barebones: 200,000 kr/month total ✅ Completed 2026-01-29
- [x] Pros/cons lists for each location (Icelandic) ✅ Completed 2026-01-29
- [x] All constants documented ✅ Completed 2026-01-29
- [x] Exportable for use across components ✅ Completed 2026-01-29

**Implementation**:
- Created: apps/peninganaedalifid/src/lib/constants/leanFire.ts (548 lines)
- Tests: apps/peninganaedalifid/src/lib/constants/__tests__/leanFire.test.ts (341 lines, 46 tests passing)
- Context: context/modules/LeanFireConstants.md
- Includes DEFAULT_BAREBONES_REYKJAVIK and DEFAULT_BAREBONES_LANDSBYGGD with all 9 expense categories
- FI_MULTIPLIER_OPTIONS (25x and 30x with Icelandic descriptions)
- REDUCTION_PERCENTAGE_OPTIONS (10%, 25%, 50%, 100%)
- LOCATION_PROS_CONS with comprehensive Icelandic pros/cons lists
- FRUGALITY_TIP_TEMPLATES with 30+ Iceland-specific tips across all categories
- 6 helper functions for accessing and manipulating constants
- All text in Icelandic, references actual Icelandic businesses/services

---

#### Task 1.3: Create Frugality Tips Database

**Objective**: Define Iceland-specific frugality tips template database.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/constants/leanFire.ts` (modify)

**Functionality**:
```typescript
// Define FRUGALITY_TIPS_DATABASE:
- Housing tips (5-7 tips): roommates, rural, long-term leases
- Food tips (6-8 tips): Bónus, meal prep, bring lunch
- Transport tips (5-7 tips): Strætó, cycling, used car
- Entertainment tips (5-6 tips): libraries, free events
- Personal tips (4-5 tips): secondhand, DIY
- Utilities tips (3-4 tips): compare providers, energy saving

Each tip includes:
- category, title, description (actionable)
- difficulty ('easy' | 'moderate' | 'hard')
- icelandicResources (e.g., ["Bónus", "Krónan"])
```

**Tests**: N/A (data only)

**Requirements Addressed**: FR-4 (Frugality optimization)

**Acceptance Criteria**:
- [x] 30+ tips covering all major categories
- [x] All descriptions actionable and Iceland-specific
- [x] Icelandic resources included where applicable
- [x] Difficulty ratings assigned
- [x] Tips ready for personalization engine

---

#### Task 1.4: Implement Core Calculation Functions ✅ Completed 2026-01-29

**Objective**: Create pure functions for LeanFIRE calculations.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/leanFire.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateMinimumFINumber(barebonesMonthly, fiMultiplier): number
- calculateTotalMonthly(expenses: CategoryExpenses): number
- compareLocations(...): GeographicComparison
- calculateReductionImpact(...): ReductionScenario
- calculateCumulativeImpact(scenarios, ...): CumulativeResults
- generateFrugalityTips(...): FrugalityTip[]
- calculateYearsToFI(currentSavings, fiNumber, savingsRate, return): number
```

**Tests**:
- `/tests/lib/calculations/leanFire.test.ts` (new)
  - Test minimum FI number calculation (25x and 30x)
  - Test total monthly calculation
  - Test location comparison (Reykjavík vs Landsbyggð)
  - Test reduction scenario impact
  - Test cumulative scenarios
  - Test frugality tips generation
  - Test edge cases: 0 expenses, 100% reduction

**Requirements Addressed**: FR-1, FR-2, FR-3, FR-4

**Acceptance Criteria**:
- [x] All calculation functions implemented ✅
- [x] Pure functions (no side effects) ✅
- [x] Handles edge cases ✅
- [x] Unit tests pass with >90% coverage ✅ (48 tests, 100% passing)
- [x] Calculations match design examples ✅

**Implementation**:
- Created: apps/peninganaedalifid/src/lib/calculations/leanFire.ts (615 lines)
- Tests: apps/peninganaedalifid/src/lib/calculations/__tests__/leanFire.test.ts (673 lines, 48 tests passing)
- Context: context/modules/LeanFireCalculations.md
- Exports: 9 calculation functions (calculateMinimumFINumber, calculateGeographicComparison, calculateReductionScenario, calculateTotalReductions, calculateYearsToFI, generateFrugalityTips, calculateFrugalityTipImpact, calculateLifeEnergy, calculateLeanFireResults)
- All functions are pure with comprehensive edge case handling
- Implements FR-1 (Minimum FI), FR-2 (Geographic), FR-3 (Reduction), FR-4 (Frugality), FR-5 (Visualization data)

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage LeanFIRE state with persistence and expense baseline integration.

**Duration**: 4-5 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for LeanFIRE
- CRUD operations for LeanFIRE data
- LocalStorage persistence
- Expense baseline integration

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add LeanFIRE state and results to context.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add leanFire to StoredState)

**Functionality**:
```typescript
// Add to context state:
- leanFire: LeanFireState | null
- leanFireResults: LeanFireResults | null

// Add to context type:
- updateLeanFire: (state: Partial<LeanFireState>) => void
- setLocation: (location: LocationType) => void
- addReductionScenario: (scenario) => void
- removeReductionScenario: (id: string) => void
- implementFrugalityTip: (tipId: string) => void
- resetLeanFire: () => void
- getMinimumFINumber: () => number
- getBarebonesExpenses: () => CategoryExpenses
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-8 (Data persistence)

**Acceptance Criteria**:
- [x] State added to CalculatorContext
- [x] Results auto-calculated on state change
- [x] TypeScript types updated
- [x] No breaking changes to existing context

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for LeanFIRE state.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateLeanFire: Merge partial updates, recalculate results
- setLocation: Update location and recalculate
- addReductionScenario: Add scenario with ID generation
- removeReductionScenario: Remove by ID, recalculate
- implementFrugalityTip: Apply tip to expenses, update
- resetLeanFire: Clear all LeanFIRE data
- getMinimumFINumber: Return minimum FI number
- getBarebonesExpenses: Return barebones CategoryExpenses
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-7 (Integration), FR-8 (Persistence)

**Acceptance Criteria**:
- [x] All actions implemented with useCallback
- [x] Immutable state updates
- [x] Auto-recalculate results after each action
- [x] Load barebones from expense baseline if available

---

#### Task 2.3: Implement Expense Baseline Integration

**Objective**: Fetch barebones tier from expense baseline.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Integration:
- On mount: Check if expense baseline exists
- If baseline exists: Load barebones tier expenses
- If no baseline: Use ICELAND_BAREBONES_REYKJAVIK defaults
- Auto-update when baseline changes
- Set expenseSource: 'baseline' | 'default'
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-7 (Integration with Expense Baseline)

**Acceptance Criteria**:
- [x] Detects expense baseline existence
- [x] Loads barebones tier if available
- [x] Falls back to Iceland defaults gracefully
- [x] Auto-updates when baseline changes
- [x] Stores expense source for transparency

---

#### Task 2.4: Implement LocalStorage Persistence

**Objective**: Save and load LeanFIRE state from localStorage.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load leanFire on mount
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-8 (Data persistence), NFR-1 (Performance)

**Acceptance Criteria**:
- [x] Loads LeanFIRE state on mount
- [x] Debounced auto-save (500ms)
- [x] Included in export/import
- [x] Cleared in resetAll

---

### EPIC 3: Basic UI - Minimum FI Summary

**Objective**: Create UI for displaying minimum FI number based on barebones expenses.

**Duration**: 4-5 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Main calculator page component
- Minimum FI Summary component
- Multiplier selector
- Life energy display (if AWH available)

---

#### Task 3.1: Create LeanFireCalculator Main Component

**Objective**: Page-level container component.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/LeanFireCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Load state from context
- Coordinate all display sections
- Handle loading and error states
- Educational intro (collapsible)
- Check for expense baseline dependency
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: Overall structure

**Acceptance Criteria**:
- [x] Loads state from CalculatorContext
- [x] Renders all sections
- [x] Checks for expense baseline
- [x] Prompts to create baseline if missing
- [x] Loading states handled

---

#### Task 3.2: Create MinimumFISummary Component

**Objective**: Display minimum FI number based on barebones expenses.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/MinimumFISummary.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display barebones monthly/annual expenses
- Multiplier selector (25x or 30x radio buttons)
- Calculate and display minimum FI number
- Show calculation breakdown
- Life energy display (if AWH available)
- Emphasis on "MINIMUM" (not comfortable)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-1, FR-1

**Acceptance Criteria**:
- [x] Shows barebones monthly and annual expenses
- [x] Multiplier selector (25x, 30x)
- [x] Displays minimum FI number prominently
- [x] Shows calculation breakdown
- [x] Life energy shown if AWH available
- [x] Icelandic text and ISK formatting

---

### EPIC 4: Geographic Comparison

**Objective**: Create location comparison between Reykjavík and Landsbyggð.

**Duration**: 5-6 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Geographic comparison panel
- Location selector
- Cost breakdown table
- Pros/cons lists
- Timeline comparison

---

#### Task 4.1: Create GeographicComparisonPanel Component

**Objective**: Main container for location comparison.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/leanFire/GeographicComparisonPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Location selector (Reykjavík | Landsbyggð | Custom)
- Cost breakdown table by category
- Difference column (+ higher, - lower)
- FI number comparison
- Timeline comparison (if current savings known)
- Net savings display
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-2, FR-2

**Acceptance Criteria**:
- [x] Location selector with 3 options
- [x] Category-by-category cost table
- [x] Visual indicators for differences (↑↓)
- [x] FI number comparison shown
- [x] Timeline difference calculated (if savings known)
- [x] Net savings highlighted

---

#### Task 4.2: Create LocationProsConsList Component

**Objective**: Display pros/cons for each location.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/leanFire/LocationProsConsList.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Two-column layout (Reykjavík | Landsbyggð)
- Pros section per location (✓ checkmarks)
- Cons section per location (✗ X marks)
- Icelandic text
- Mobile: stack vertically
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-2, FR-2.5

**Acceptance Criteria**:
- [x] Pros/cons displayed for both locations
- [x] Visual indicators (✓ ✗)
- [x] Icelandic text
- [x] Responsive design
- [x] Easy to scan

---

### EPIC 5: Expense Reduction Scenarios

**Objective**: Create scenario builder for "what if I cut X?" modeling.

**Duration**: 6-7 hours

**Dependencies**: Epics 2-3 complete

**Deliverables**:
- Scenario builder
- Active scenarios list
- Cumulative impact display
- Scenario ranking by efficiency

---

#### Task 5.1: Create ScenarioBuilder Component

**Objective**: UI for creating expense reduction scenarios.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/ScenarioBuilder.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Category dropdown selector
- Reduction level slider (10%, 25%, 50%, 100%)
- Current expense display
- New expense preview
- Savings preview
- Add scenario button
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-3, FR-3

**Acceptance Criteria**:
- [x] Category selector dropdown
- [x] Reduction level options (10, 25, 50, 100%)
- [x] Live preview of new expense
- [x] Savings calculation shown
- [x] Add scenario functionality works

---

#### Task 5.2: Create ActiveScenariosList Component

**Objective**: Display active reduction scenarios with metrics.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/ActiveScenariosList.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of active scenarios
- Per scenario: name, reduction %, savings
- FI number impact
- Timeline impact (months saved)
- Efficiency rating (★★★ stars)
- Remove button per scenario
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-3, FR-3

**Acceptance Criteria**:
- [x] All active scenarios displayed
- [x] Metrics shown per scenario
- [x] Efficiency rating visual (stars)
- [x] Remove scenario works
- [x] Updates in real-time

---

#### Task 5.3: Create CumulativeImpact Component

**Objective**: Show cumulative impact of all scenarios.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/CumulativeImpact.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Total expense reduction (all scenarios)
- New total monthly expenses
- New FI number
- Total months saved
- Prominent display (highlighted box)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-3, FR-3.3

**Acceptance Criteria**:
- [x] Shows cumulative totals
- [x] New FI number calculated
- [x] Total timeline impact shown
- [x] Prominent visual treatment
- [x] Updates when scenarios change

---

### EPIC 6: Frugality Optimization

**Objective**: Generate and display personalized frugality tips.

**Duration**: 6-7 hours

**Dependencies**: Epics 2-3 complete

**Deliverables**:
- Expense analysis component
- Personalized tips display
- Implement tip functionality
- Iceland-specific resources panel

---

#### Task 6.1: Implement Frugality Tips Generation Logic

**Objective**: Add tip generation logic to calculation functions.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/leanFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- generateFrugalityTips(current, minimum, ...): FrugalityTip[]
  - Identify high-spend categories
  - Select relevant tips from database
  - Calculate potentialSavings per tip
  - Calculate timelineImpact per tip
  - Sort by timeline impact
- estimateSavingsForTip(tip, currentExpense): number
```

**Tests**:
- Add to `/tests/lib/calculations/leanFire.test.ts`
  - Test tip generation for high-spend categories
  - Test tip sorting by impact
  - Test savings estimation
  - Test no tips when all categories minimal

**Requirements Addressed**: FR-4

**Acceptance Criteria**:
- [x] Generates tips for high-spend categories
- [x] Calculates savings per tip
- [x] Calculates timeline impact
- [x] Sorts by impact (biggest first)
- [x] Unit tests pass

---

#### Task 6.2: Create FrugalityOptimizer Component

**Objective**: Display personalized frugality tips.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/leanFire/FrugalityOptimizer.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Expense analysis table (current vs minimum)
- High-spend category indicators
- Personalized tips list
- Per tip: title, description, savings, impact, difficulty
- Icelandic resources display
- Implement button per tip
- Sort by impact
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-4, FR-4

**Acceptance Criteria**:
- [x] Expense analysis shown
- [x] Tips generated and displayed
- [x] All tip details visible
- [x] Icelandic resources included
- [x] Implement button updates expenses
- [x] Sorted by impact

---

#### Task 6.3: Implement Tip Application Logic

**Objective**: Allow users to implement tips and update expenses.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/components/leanFire/FrugalityOptimizer.tsx` (modify)

**Functionality**:
```typescript
// Implementation:
- implementFrugalityTip(tipId) action
- Find tip and category
- Apply estimated savings to category expense
- Update barebonesExpenses
- Recalculate results
- Mark tip as implemented
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: US-4, FR-4

**Acceptance Criteria**:
- [x] Implement button applies tip
- [x] Expenses updated correctly
- [x] Results recalculated
- [x] Tip marked as implemented
- [x] Visual feedback provided

---

### EPIC 7: Lifestyle Trade-Off Visualization

**Objective**: Create chart showing expense level vs years to FI trade-off.

**Duration**: 5-6 hours

**Dependencies**: Epics 2-5 complete

**Deliverables**:
- Trade-off chart component
- Interactive hover features
- Life energy cost display

---

#### Task 7.1: Create LifestyleTradeOffChart Component

**Objective**: Visualize expense → timeline trade-off curve.

**Duration**: 4 hours

**Files to Create/Modify**:
- `/src/components/leanFire/LifestyleTradeOffChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Recharts line chart
- X-axis: Monthly expenses (200k to 1.2M)
- Y-axis: Years to FI
- Trade-off curve (calculated for expense levels)
- Mark barebones, comfortable, deluxe points
- Mark user's current position (if data available)
- Interactive hover (click for details)
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: US-5, FR-5

**Acceptance Criteria**:
- [x] Chart renders correctly
- [x] Trade-off curve shows relationship
- [x] Three lifestyle points marked
- [x] User position shown (if available)
- [x] Hover shows details
- [x] Responsive design

---

#### Task 7.2: Add Life Energy Cost Display

**Objective**: Show life energy cost for each lifestyle level.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/LifestyleTradeOffChart.tsx` (modify)

**Functionality**:
```typescript
// Features:
- Calculate life energy (work years) for each lifestyle
- Display below chart:
  - Barebones: X years of work
  - Comfortable: Y years of work (+Z more)
  - Deluxe: W years of work (+Q more)
- Insight: "Each 100k kr reduction saves ~7 years"
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-5, FR-5.5

**Acceptance Criteria**:
- [x] Life energy shown for 3 lifestyles
- [x] Differences highlighted
- [x] Educational insight provided
- [x] Icelandic text
- [x] Only shown if AWH available

---

### EPIC 8: Context Panel and Polish

**Objective**: Add Icelandic context panel, educational content, ensure accessibility.

**Duration**: 5-6 hours

**Dependencies**: Epics 1-7 complete

**Deliverables**:
- Icelandic context panel
- Educational intro
- Accessibility audit and fixes
- Final testing

---

#### Task 8.1: Create IcelandicContextPanel Component

**Objective**: Explain Iceland-specific LeanFIRE considerations.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/leanFire/IcelandicContextPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section
- Universal healthcare note
- Seasonal work opportunities
- Rural housing realities
- Transportation considerations
- Safety net availability (unemployment, disability)
- Pension system continuation note
```

**Tests**: Manual review for clarity

**Requirements Addressed**: US-6, FR-6, NFR-5

**Acceptance Criteria**:
- [x] All Iceland-specific considerations covered
- [x] Clear, informative content
- [x] Collapsible (remembers state)
- [x] Icelandic text
- [x] Easy to understand

---

#### Task 8.2: Create EducationalIntro Component

**Objective**: Educational intro explaining LeanFIRE concept.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/EducationalIntro.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section
- "What is LeanFIRE?" explainer
- LeanFIRE vs Regular FIRE
- Geographic arbitrage explanation
- Frugality vs Sacrifice discussion
- FAQ section
```

**Tests**: Manual review

**Requirements Addressed**: NFR-2 (Usability), educational

**Acceptance Criteria**:
- [x] Clear LeanFIRE explanation
- [x] Distinguishes from regular FIRE
- [x] FAQ helpful
- [x] Collapsible
- [x] Icelandic text

---

#### Task 8.3: Implement Accessibility Features

**Objective**: Ensure WCAG 2.1 AA compliance.

**Duration**: 2 hours

**Files to Create/Modify**:
- All components (modify for accessibility)

**Functionality**:
```typescript
// Accessibility enhancements:
- ARIA labels on all inputs
- Status region for result announcements
- Chart text alternative (aria-label)
- Keyboard navigation (tab order)
- Focus indicators visible
- Color contrast audit
- Screen reader testing
```

**Tests**:
- Automated: axe DevTools
- Manual: Screen reader testing (VoiceOver)
- Keyboard navigation testing

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [x] All inputs have proper labels
- [x] Charts have text alternatives
- [x] Keyboard navigation works
- [x] Color contrast meets WCAG AA (4.5:1)
- [x] Focus indicators visible
- [x] Screen reader announces results
- [x] No axe violations

---

#### Task 8.4: Final Testing and Bug Fixes

**Objective**: Comprehensive testing and bug fixes.

**Duration**: 2 hours

**Tests**:
- Unit tests for all calculations
- Component tests for UI components
- Integration tests for context
- Manual testing: all user flows
- Mobile testing: iOS and Android
- Cross-browser testing: Chrome, Safari, Firefox
- Edge case testing

**Requirements Addressed**: All

**Acceptance Criteria**:
- [x] All unit tests pass
- [x] Component tests pass
- [x] Integration tests pass
- [x] No console errors or warnings
- [x] Works on mobile devices
- [x] Works on all major browsers
- [x] Edge cases handled gracefully

---

### EPIC 9: Main Page and Routing

**Objective**: Create main page and integrate into app navigation.

**Duration**: 2-3 hours

**Dependencies**: Epics 1-8 complete

**Deliverables**:
- Main calculator page
- Route page
- Navigation integration

---

#### Task 9.1: Create Route Page

**Objective**: Next.js page component for LeanFIRE route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/lagmarks-fire/page.tsx` (new) OR
- Add to existing FIRE planning section

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary with loading fallback
- LeanFireCalculator component
- Metadata for SEO
- Hero section with title and description
```

**Tests**: N/A (routing)

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [x] Route works at /lagmarks-fire
- [x] Wrapped in CalculatorProvider
- [x] Loading fallback shown
- [x] SEO metadata present

---

#### Task 9.2: Add to Calculator Navigation

**Objective**: Add LeanFIRE to calculator list.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to FIRE_PLANNING_CALCULATORS array:
{
  id: 'lagmarks-fire',
  name: 'Lágmarks FIRE Skipuleggjandi',
  description: 'Skipuleggja lágmarks útgjöld FIRE með landfræðilegri hagræðingu',
  icon: '🏔️',
  available: true,
  category: 'fire-planning'
}
```

**Tests**: Manual testing

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [x] Appears in FIRE planning calculators
- [x] Icon and description correct
- [x] Navigation works
- [x] Listed in appropriate order

---

#### Task 9.3: Create Component Barrel Export

**Objective**: Export all LeanFIRE components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/leanFire/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { LeanFireCalculator } from './LeanFireCalculator';
export { MinimumFISummary } from './MinimumFISummary';
export { GeographicComparisonPanel } from './GeographicComparisonPanel';
export { ExpenseReductionScenarios } from './ExpenseReductionScenarios';
export { FrugalityOptimizer } from './FrugalityOptimizer';
export { LifestyleTradeOffChart } from './LifestyleTradeOffChart';
// Export types:
export type { LeanFireState, LeanFireResults } from '@/types/leanFire';
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [x] All public components exported
- [x] No circular dependencies
- [x] Clean import paths

---

## 3. Implementation Schedule

### Phase 1: Foundation and State (Days 1-2)
- Epic 1: Types, Iceland constants, calculations, frugality database
- Epic 2: CalculatorContext integration with expense baseline

### Phase 2: Core UI (Days 3-4)
- Epic 3: Minimum FI Summary
- Epic 4: Geographic Comparison

### Phase 3: Advanced Features (Days 5-7)
- Epic 5: Expense Reduction Scenarios
- Epic 6: Frugality Optimization

### Phase 4: Visualization and Polish (Days 8-9)
- Epic 7: Lifestyle Trade-Off Chart
- Epic 8: Context panel, educational content, accessibility

### Phase 5: Integration and Deploy (Day 10)
- Epic 9: Main page and routing
- Final review and adjustments

---

## 4. Risk Mitigation

### Risk 1: Frugality Tips Complexity
**Mitigation**: Start with template-based system, allow manual adjustment, gather user feedback for improvement.

### Risk 2: Iceland Data Accuracy
**Mitigation**: Source from Statistics Iceland, provide last-updated date, allow custom overrides, review quarterly.

### Risk 3: Trade-Off Chart Complexity
**Mitigation**: Use simplified model initially, make interactive features optional, focus on relative comparisons.

### Risk 4: Expense Baseline Dependency
**Mitigation**: Graceful fallback to Iceland defaults, clear prompt to create baseline, allow custom input.

---

## 5. Testing Strategy

### Unit Tests (Epic 1, Task 1.4)
- All calculation functions
- Edge cases (0 values, 100% reduction, no scenarios)
- Location comparison accuracy
- Frugality tips generation
- Coverage target: >90%

### Component Tests (Epic 8, Task 8.4)
- Minimum FI summary rendering
- Geographic comparison display
- Scenario builder functionality
- Frugality tips display
- Trade-off chart rendering

### Integration Tests (Epic 8, Task 8.4)
- CalculatorContext state updates
- Expense baseline integration
- Scenario CRUD operations
- LocalStorage persistence
- Tip implementation

### Accessibility Tests (Epic 8, Task 8.3)
- Automated: axe DevTools
- Manual: Screen reader (VoiceOver/NVDA)
- Keyboard navigation
- Color contrast

### Manual Tests (Epic 8, Task 8.4)
- User flows (all features)
- Mobile devices (iOS, Android)
- Cross-browser (Chrome, Safari, Firefox)
- Edge cases (extreme values, missing data)

---

## 6. Definition of Done

Each task is complete when:
- [x] Code implemented and compiles without errors
- [x] Unit tests pass (where applicable)
- [x] Component tests pass (where applicable)
- [x] TypeScript strict mode passes
- [x] No console errors or warnings
- [x] Accessibility requirements met (WCAG 2.1 AA)
- [x] Icelandic text used for all UI
- [x] Code reviewed or self-reviewed
- [x] Responsive on mobile, tablet, desktop
- [x] Integrated with CalculatorContext
- [x] LocalStorage persistence works
- [x] Educational content clear and helpful

---

## 7. Dependencies Summary

**Epic Dependencies:**
- Epic 2 depends on Epic 1 (needs types and calculations)
- Epic 3 depends on Epic 2 (needs state management)
- Epic 4 can start after Epic 2 (independent of Epic 3)
- Epic 5 depends on Epics 2-3 (needs state and basic UI)
- Epic 6 depends on Epics 2-3 (needs state and basic UI)
- Epic 7 depends on Epics 2-5 (needs data for visualization)
- Epic 8 depends on Epics 1-7 (polish after features)
- Epic 9 depends on Epics 1-8 (final integration)

**Critical Path:**
Epic 1 → Epic 2 → Epic 3 → Epic 5 → Epic 6 → Epic 7 → Epic 8 → Epic 9

**Parallel Work Opportunities:**
- Epic 4 (Geographic) can overlap with Epic 3 (Basic UI)
- Epic 5 (Scenarios) and Epic 6 (Frugality) can partially overlap
- Educational content (Epic 8.2) can be drafted during Epic 6

---

## 8. Success Metrics

### Functional Success
- [x] Accurate minimum FI calculation (matches manual verification)
- [x] Geographic comparison shows realistic Iceland differences
- [x] Expense reduction scenarios calculate correctly
- [x] Frugality tips are personalized and actionable
- [x] Trade-off chart visualizes relationship clearly

### User Experience Success
- [x] User can calculate minimum FI in < 2 minutes
- [x] Location comparison is immediately understandable
- [x] Scenarios are easy to create and compare
- [x] Frugality tips are specific and helpful
- [x] Trade-offs are visually clear

### Technical Success
- [x] All tests pass (>90% coverage)
- [x] No console errors
- [x] Performance meets targets (<100ms calculations)
- [x] Code follows existing patterns
- [x] TypeScript strict mode compliant

---

**Tasks Phase Complete: Ready for Implementation**
