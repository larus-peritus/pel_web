# Tasks: FatFIRE Planner

## Document Information

- **Feature Name**: FatFIRE Planner (Lúxus FIRE Áætlun)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-fat-fire.md
- **Design**: design-fat-fire.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build core calculations first, then UI components in feature slices (expenses → wish list → splurge → FI number → timeline → scenarios → integration).

**Rationale**:
- Calculations can be tested independently before UI
- Wish list and splurge budget are core differentiators
- Premium visual theme applied throughout
- Integration leverages existing Expense Baseline patterns
- Abundance mindset reflected in UX

**Sequence**:
1. Foundation: Types, constants, core calculations
2. State: CalculatorContext integration
3. Expense Input: Deluxe tier display and editing
4. Wish List: Builder component with CRUD
5. Splurge & FI: Budget input and FI number calculation
6. Timeline: Projections with milestones and chart
7. Scenarios: Comparison and analysis
8. Life Energy: AWH integration
9. Polish: Educational content, premium theme, accessibility

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-8 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Epic 3 (Expense Input) depends on Epic 2 (State) complete
- Epic 4 (Wish List) can start after Epic 3.1
- Epic 6 (Timeline) can partially overlap with Epic 5
- Epic 7 (Scenarios) requires Epics 3-6 mostly complete
- Epic 9 (Polish) depends on all features complete

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Core Calculations

**Objective**: Create type definitions, constants, and pure calculation functions for FatFIRE.

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Icelandic premium constants
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for FatFIRE data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/fatFire.ts` (new)

**Functionality**:
```typescript
// Define types for:
- FatFireState (inputs)
- WishListItem (wish list items)
- WishListCategory (category enum)
- FatFireScenario (scenario comparison)
- FatFireResults (calculated results)
- Milestone (25%, 50%, 75%, 100% markers)
- ScenarioResult (scenario comparison results)
- FatFireLifeEnergy (life energy metrics)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-3 (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors
- [ ] WishListCategory covers all premium categories

---

#### Task 1.2: Create Constants and Defaults

**Objective**: Define Icelandic premium defaults and wish list categories.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/constants/fatFire.ts` (new)

**Functionality**:
```typescript
// Define constants:
- FATFIRE_DEFAULTS (multiplier: 30, expectedReturn: 0.06, premium housing, etc.)
- WISH_LIST_CATEGORIES (with Icelandic labels and examples)
- SPLURGE_PRESETS (modest: 1M, comfortable: 2M, generous: 3M)
- MULTIPLIER_OPTIONS (28x, 30x, 33x with explanations)
- RETURN_PRESETS (conservative: 5%, moderate: 6%, optimistic: 7%)
- PREMIUM_COLORS (gold/amber theme)
```

**Tests**: N/A (constants only)

**Requirements Addressed**: NFR-5 (Icelandic context), NFR-6 (visual design)

**Acceptance Criteria**:
- [x] All constants defined with Icelandic premium defaults ✅ Completed 2026-01-29
- [x] Wish list categories cover all premium areas (8 categories)
- [x] Splurge presets realistic for Iceland (1M, 2M, 3M ISK)
- [x] Multiplier default is 30x
- [x] Premium color palette defined (gold/amber theme)
- [x] Exportable for use across components

**Implementation Details**:
- Implemented: apps/peninganaedalifid/src/lib/constants/fatFire.ts (382 lines)
- Context: context/modules/FatFireConstants.md
- Includes 9 helper functions for validation and lookups
- All text in Icelandic with Reykjavík premium market defaults

---

#### Task 1.3: Implement Core FI Calculation Functions

**Objective**: Create pure functions for FI number and expense calculations.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fatFire.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateTotalAnnualExpenses(baseMonthly, wishListMustHave, splurge): number
- calculateFINumber(totalAnnual, multiplier): number
- calculateWishListTotals(wishList): { mustHave, niceToHave, total }
```

**Tests**:
- `/tests/lib/calculations/fatFire.test.ts` (new)
  - Test FI number with 30x multiplier
  - Test wish list totals (must-have vs nice-to-have)
  - Test total expenses calculation
  - Test edge cases: 0 values, negative inputs

**Requirements Addressed**: FR-1, FR-3

**Acceptance Criteria**:
- [x] FI number calculation accurate: (base + wish + splurge) × multiplier ✅ Completed 2026-01-29
- [x] Wish list totals separated by priority
- [x] Pure functions (no side effects)
- [x] Unit tests pass with >90% coverage (59 tests, 100% passing)
- [x] Handles edge cases gracefully

**Implementation Details**:
- Implemented: apps/peninganaedalifid/src/lib/calculations/fatFire.ts (723 lines)
- Tests: apps/peninganaedalifid/src/lib/calculations/__tests__/fatFire.test.ts (59 tests)
- Context: context/modules/FatFireCalculations.md
- All core calculation functions implemented as pure functions
- Master orchestration function: calculateFatFireResults()
- Comprehensive edge case handling and validation
- All 59 unit tests passing

---

#### Task 1.4: Implement Timeline Calculation Functions

**Objective**: Create timeline projection and milestone calculation functions.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fatFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- calculateYearsToFatFIRE(currentSavings, fiNumber, monthlySavings, returnRate): number | null
- calculateMilestones(currentSavings, fiNumber, monthlySavings, returnRate, currentAge): Milestone[]
- calculateRequiredMonthlySavings(currentSavings, fiNumber, targetYears, returnRate): number
```

**Tests**:
- Add to `/tests/lib/calculations/fatFire.test.ts`
  - Test years to FatFIRE with savings and growth
  - Test milestones (25%, 50%, 75%, 100%)
  - Test "already at FatFIRE" (returns 0)
  - Test unrealistic timelines (returns null)
  - Test required savings calculation

**Requirements Addressed**: FR-5

**Acceptance Criteria**:
- [ ] Timeline calculation uses monthly compounding
- [ ] Milestones calculated at 25%, 50%, 75%, 100% FI
- [ ] Returns 0 when already at FatFIRE
- [ ] Returns null for unrealistic timelines (>100 years)
- [ ] Unit tests pass

---

#### Task 1.5: Implement Life Energy Calculations

**Objective**: Add life energy conversion functions.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fatFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- calculateFatFireLifeEnergy(fiNumber, yearsToFatFIRE, awh, leanFINumber): FatFireLifeEnergy | null
```

**Tests**:
- Add to `/tests/lib/calculations/fatFire.test.ts`
  - Test life energy with valid AWH
  - Test life energy returns null without AWH
  - Test comparison to LeanFIRE
  - Test work years conversion

**Requirements Addressed**: FR-7, US-8

**Acceptance Criteria**:
- [ ] Life energy calculations implemented
- [ ] Returns null when AWH not available
- [ ] Converts FI number to work hours
- [ ] Compares to LeanFIRE correctly
- [ ] Unit tests pass

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage FatFIRE state with persistence.

**Duration**: 5-6 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for FatFIRE
- CRUD operations for wish list and scenarios
- LocalStorage persistence
- Integration hooks for Expense Baseline

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add FatFIRE state and results to context.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add fatFire to StoredState)

**Functionality**:
```typescript
// Add to context state:
- fatFire: FatFireState | null
- fatFireResults: FatFireResults | null

// Add to context type:
- updateFatFire: (state: Partial<FatFireState>) => void
- setSplurgeBudget: (budget: number) => void
- setFIMultiplier: (multiplier: number) => void
- addWishListItem: (item: Omit<WishListItem, 'id' | 'order'>) => void
- updateWishListItem: (id: string, updates: Partial<WishListItem>) => void
- deleteWishListItem: (id: string) => void
- reorderWishList: (fromIndex: number, toIndex: number) => void
- addFatFireScenario: (scenario: Omit<FatFireScenario, 'id'>) => void
- deleteFatFireScenario: (id: string) => void
- clearFatFire: () => void
- getFatFINumber: () => number | null
- getYearsToFatFIRE: () => number | null
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-10.1, FR-10.2

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] Results auto-calculated on state change
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context
- [ ] Wish list order maintained

---

#### Task 2.2: Implement Wish List Actions

**Objective**: Create all CRUD operations for wish list.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- addWishListItem: Generate unique ID, assign order, add to list
- updateWishListItem: Merge partial updates, maintain order
- deleteWishListItem: Remove from list, re-assign orders
- reorderWishList: Swap items and update order property
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-3

**Acceptance Criteria**:
- [ ] All CRUD actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Order property maintained correctly
- [ ] Auto-recalculate results after each action
- [ ] Unique IDs generated (uuid or nanoid)

---

#### Task 2.3: Implement Scenario Actions

**Objective**: Create CRUD operations for scenarios.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- addFatFireScenario: Generate unique ID, add to scenarios
- deleteFatFireScenario: Remove scenario by ID
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-6

**Acceptance Criteria**:
- [ ] Scenario CRUD implemented
- [ ] Immutable state updates
- [ ] Auto-recalculate results after changes
- [ ] Maximum 5 scenarios enforced

---

#### Task 2.4: Implement LocalStorage Persistence

**Objective**: Save and load FatFIRE state from localStorage.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load fatFire on mount
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-10.1-10.5, NFR-1

**Acceptance Criteria**:
- [ ] Loads FatFIRE state on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Cleared in resetAll
- [ ] Wish list order preserved

---

### EPIC 3: Expense Input - Deluxe Tier and Display

**Objective**: Display and integrate Deluxe tier from Expense Baseline.

**Duration**: 4-5 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Deluxe tier display component
- Category breakdown
- Integration with Expense Baseline
- Auto-sync on baseline changes

---

#### Task 3.1: Create FatFireCalculator Main Component

**Objective**: Page-level container component with premium theme.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/FatFireCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Load state from context
- Check for Deluxe tier existence
- Apply premium visual theme (gold/amber)
- Coordinate all sections
- Handle loading and error states
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: Overall structure, NFR-6

**Acceptance Criteria**:
- [ ] Loads state from CalculatorContext
- [ ] Checks for Deluxe tier in expense baseline
- [ ] Renders all sections with premium theme
- [ ] Responsive layout
- [ ] Loading states handled
- [ ] Gold/amber accent colors applied

---

#### Task 3.2: Create DeluxeTierDisplay Component

**Objective**: Display Deluxe tier expenses from baseline.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/DeluxeTierDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display base monthly Deluxe expenses
- Show category breakdown with Icelandic context
- Link to expense baseline for editing
- Auto-update when baseline changes
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-2, US-7

**Acceptance Criteria**:
- [ ] Displays monthly and annual Deluxe expenses
- [ ] Shows category breakdown (housing, food, transport, etc.)
- [ ] Icelandic premium context for each category
- [ ] Edit button links to expense baseline
- [ ] Auto-syncs when baseline changes
- [ ] Formatted with Icelandic number formatting

---

#### Task 3.3: Implement Expense Baseline Integration

**Objective**: Fetch and sync Deluxe tier from Expense Baseline.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/FatFireCalculator.tsx` (modify)
- `/src/components/fatFire/DeluxeTierDisplay.tsx` (modify)

**Functionality**:
```typescript
// Integration features:
- Check if expense baseline exists on load
- Fetch Deluxe tier monthly expenses
- Auto-update FatFIRE state when baseline changes
- Show prompt if Deluxe tier missing
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-2, US-3

**Acceptance Criteria**:
- [ ] Detects expense baseline existence
- [ ] Fetches Deluxe tier expenses correctly
- [ ] Updates FatFIRE state automatically
- [ ] Shows notification on baseline change
- [ ] Handles missing Deluxe tier gracefully (prompt to create)

---

### EPIC 4: Wish List Builder

**Objective**: Create and manage lifestyle wish list with premium items.

**Duration**: 6-7 hours

**Dependencies**: Epic 3 complete

**Deliverables**:
- Wish list builder component
- Wish list item component
- CRUD operations UI
- Drag-and-drop reordering (optional)
- Wish list summary

---

#### Task 4.1: Create WishListItem Component

**Objective**: Single wish list item with edit/delete.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/WishListItem.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display item name, cost, priority, category
- Edit mode toggle
- Priority toggle (must-have/nice-to-have)
- Category selector
- Delete button with confirmation
- Notes field (optional)
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-3, US-4

**Acceptance Criteria**:
- [ ] Displays all item properties
- [ ] Edit mode works inline
- [ ] Priority toggle between must-have/nice-to-have
- [ ] Category selector with Icelandic labels
- [ ] Delete confirmation dialog
- [ ] Notes field optional
- [ ] Formatted with Icelandic currency

---

#### Task 4.2: Create WishListBuilder Component

**Objective**: Container for wish list with CRUD operations.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/WishListBuilder.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of WishListItem components
- Add new item button
- Add item form (modal or inline)
- Wish list summary (totals by priority)
- Impact on FI number display
- Drag-and-drop reordering (optional)
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-3, US-4

**Acceptance Criteria**:
- [ ] Displays all wish list items
- [ ] Add item button opens form
- [ ] Add item form with all fields
- [ ] Summary shows must-have and nice-to-have totals
- [ ] Impact on FI number calculated and displayed
- [ ] Reordering works (drag-and-drop or up/down buttons)
- [ ] Empty state: "Bæta við fyrstu ósk"

---

#### Task 4.3: Implement Wish List Summary

**Objective**: Display wish list totals and impact.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/WishListSummary.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Total wish list cost (must-have + nice-to-have)
- Breakdown by priority
- Impact on FI number
- Percentage of base expenses
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-3.3, FR-3.4

**Acceptance Criteria**:
- [ ] Shows must-have total
- [ ] Shows nice-to-have total
- [ ] Shows overall total
- [ ] Impact on FI number displayed: "+ X kr (30x)"
- [ ] Percentage of base expenses shown
- [ ] Formatted with Icelandic numbers

---

### EPIC 5: Splurge Budget and FI Number

**Objective**: Input splurge budget and calculate FI number with multiplier.

**Duration**: 4-5 hours

**Dependencies**: Epic 4 complete

**Deliverables**:
- Splurge budget input component
- FI number section component
- Multiplier selector
- Expense breakdown display

---

#### Task 5.1: Create SplurgeBudgetInput Component

**Objective**: Input and explain splurge budget.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/SplurgeBudgetInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Annual splurge budget input
- Monthly/weekly equivalent display
- Example uses display
- Percentage of base expenses
- Status indicator (modest/comfortable/generous)
- Warning if >30% of base
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-4, US-3

**Acceptance Criteria**:
- [ ] Annual splurge budget input
- [ ] Monthly equivalent: annual ÷ 12
- [ ] Weekly equivalent: annual ÷ 52
- [ ] Example uses displayed
- [ ] Percentage of base expenses calculated
- [ ] Status indicator shows appropriate label
- [ ] Warning shown if >30%

---

#### Task 5.2: Create FINumberSection Component

**Objective**: Display FI number with multiplier options and breakdown.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/FINumberSection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Multiplier selector (28x, 30x, 33x, custom)
- Total annual expense breakdown
- FI number display (prominent)
- Safety margin explanation
- Warning if multiplier <28x
- Monthly equivalent
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-1, US-2

**Acceptance Criteria**:
- [ ] Multiplier selector with presets
- [ ] Custom multiplier input (25-40 range)
- [ ] Expense breakdown: base + wish + splurge
- [ ] FI number prominently displayed
- [ ] Safety margin tooltip/explanation
- [ ] Warning if multiplier <28x for FatFIRE
- [ ] Monthly equivalent shown
- [ ] Gold/amber premium styling

---

### EPIC 6: Timeline Projections

**Objective**: Calculate and visualize timeline to FatFIRE with milestones.

**Duration**: 7-8 hours

**Dependencies**: Epic 5 complete

**Deliverables**:
- Timeline section with inputs
- Timeline results display
- Timeline chart with milestones
- Milestone markers

---

#### Task 6.1: Create TimelineSection Component

**Objective**: Inputs and results for timeline.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/TimelineSection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Current savings input
- Monthly savings rate input
- Expected return slider (with presets)
- Current age input (optional)
- Timeline results display
- Milestone list
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-5, US-5

**Acceptance Criteria**:
- [ ] All inputs present and functional
- [ ] Return rate slider with presets (5%, 6%, 7%)
- [ ] Timeline results: years, months, age, date
- [ ] Milestones: 25%, 50%, 75%, 100% FI
- [ ] Each milestone shows: amount, years, age, date
- [ ] Formatted with Icelandic dates/numbers
- [ ] Real-time updates

---

#### Task 6.2: Create TimelineChart Component

**Objective**: Visualize savings growth to FatFIRE.

**Duration**: 3.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/TimelineChart.tsx` (new)
- `package.json` (add recharts if not already present)

**Functionality**:
```typescript
// Component features:
- Line chart showing savings growth
- FI number target line (horizontal)
- Milestone markers (25%, 50%, 75%, 100%)
- Current savings starting point
- Hover tooltip with balance
- Age axis (if current age provided)
- Responsive design
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-8, US-2

**Acceptance Criteria**:
- [ ] Growth projection line displayed
- [ ] FI number target line (horizontal)
- [ ] Milestones marked on chart
- [ ] Current savings starting point marked
- [ ] Hover shows exact balance at any point
- [ ] Age axis if current age provided
- [ ] Responsive to container size
- [ ] Mobile-friendly (pinch-to-zoom)
- [ ] Premium styling (gold/amber accents)

---

#### Task 6.3: Implement Timeline Data Generation

**Objective**: Generate chart data points for visualization.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fatFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- generateTimelineChartData(currentSavings, fiNumber, monthlySavings, returnRate, currentAge): ChartDataPoint[]
```

**Tests**:
- Add to `/tests/lib/calculations/fatFire.test.ts`
  - Test chart data generation
  - Test data point count
  - Test balance progression

**Requirements Addressed**: FR-8

**Acceptance Criteria**:
- [ ] Generates monthly data points
- [ ] Includes age if provided
- [ ] Balances increase correctly (savings + growth)
- [ ] Stops at FI number or max years
- [ ] Unit tests pass

---

### EPIC 7: Scenario Comparison

**Objective**: Compare multiple FatFIRE expense scenarios side-by-side.

**Duration**: 5-6 hours

**Dependencies**: Epics 3-6 complete

**Deliverables**:
- Scenario comparison section
- Scenario list with results
- Comparison table
- Scenario creation/deletion

---

#### Task 7.1: Create ScenarioComparisonSection Component

**Objective**: Container for scenario comparison.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/ScenarioComparisonSection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of scenarios (Current, Optimized, Custom)
- Add scenario button
- Delete scenario button per scenario
- Comparison table
- Highlight differences
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-6, US-6

**Acceptance Criteria**:
- [ ] Displays up to 5 scenarios
- [ ] Preset scenarios: "Current Lifestyle", "Optimized Deluxe"
- [ ] Add custom scenario button
- [ ] Delete scenario with confirmation
- [ ] Comparison table shows all scenarios
- [ ] Highlights best/worst scenarios
- [ ] Mobile-responsive (horizontal scroll or tabs)

---

#### Task 7.2: Create ScenarioComparisonTable Component

**Objective**: Side-by-side comparison table.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/ScenarioComparisonTable.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Table with columns: Name, FI Number, Years, Savings/Month, Lifestyle
- Highlight differences
- Visual indicators for best/worst
- Recommendations based on comparison
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-6, US-6

**Acceptance Criteria**:
- [ ] All scenario data displayed
- [ ] Columns: Name, FI, Years, Savings, Lifestyle
- [ ] Differences highlighted
- [ ] Best scenario indicated (e.g., ⭐)
- [ ] Recommendations shown
- [ ] Formatted with Icelandic numbers
- [ ] Mobile-responsive

---

#### Task 7.3: Implement Scenario Calculation

**Objective**: Calculate results for each scenario.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/fatFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- calculateScenarioResult(scenario, currentSavings, monthlySavings, returnRate): ScenarioResult
```

**Tests**:
- Add to `/tests/lib/calculations/fatFire.test.ts`
  - Test scenario result calculation
  - Test comparison to optimized scenario

**Requirements Addressed**: FR-6

**Acceptance Criteria**:
- [ ] Calculates FI number for scenario
- [ ] Calculates years to FatFIRE
- [ ] Calculates required monthly savings
- [ ] Generates lifestyle description
- [ ] Unit tests pass

---

### EPIC 8: Life Energy Integration

**Objective**: Display FatFIRE in life energy terms with AWH integration.

**Duration**: 3-4 hours

**Dependencies**: Epics 1-7 complete

**Deliverables**:
- Life energy section component
- AWH integration
- Comparison to LeanFIRE

---

#### Task 8.1: Create LifeEnergySection Component

**Objective**: Display FatFIRE in life energy terms.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/LifeEnergySection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- FI number in work hours
- Timeline in work years
- Comparison to LeanFIRE
- Trade-off explanation
- Prompt if AWH not available
```

**Tests**: Component tests in Epic 9

**Requirements Addressed**: FR-7, US-8

**Acceptance Criteria**:
- [ ] Shows FI number in work hours
- [ ] Shows timeline in work years
- [ ] Comparison to LeanFIRE displayed
- [ ] Trade-off explanation clear
- [ ] Prompt shown if AWH not available
- [ ] Link to AWH calculator works
- [ ] Formatted with Icelandic numbers

---

#### Task 8.2: Implement AWH Integration

**Objective**: Fetch AWH and use for life energy calculations.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/LifeEnergySection.tsx` (modify)
- `/src/components/fatFire/FatFireCalculator.tsx` (modify)

**Functionality**:
```typescript
// AWH integration:
- Fetch actualHourlyWage from context
- Pass to life energy calculations
- If null, show prompt to calculate AWH
- Link to AWH calculator page
```

**Tests**: Integration tests in Epic 9

**Requirements Addressed**: FR-7, US-8

**Acceptance Criteria**:
- [ ] Fetches AWH from context
- [ ] Calculates life energy when AWH available
- [ ] Shows prompt when AWH not available
- [ ] Link to AWH calculator works
- [ ] Handles null AWH gracefully

---

### EPIC 9: Educational Content and Polish

**Objective**: Add educational content, improve UX, ensure accessibility, apply premium theme.

**Duration**: 6-7 hours

**Dependencies**: Epics 1-8 complete

**Deliverables**:
- Educational intro component
- Tooltips and guidance
- Accessibility audit and fixes
- Premium visual theme polish
- Final testing

---

#### Task 9.1: Create EducationalIntro Component

**Objective**: Educational intro explaining FatFIRE concept.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/fatFire/EducationalIntro.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section (default closed for returning users)
- "What is FatFIRE?" explainer
- Safety margin (30x multiplier) explanation
- Splurge budget concept
- Wish list philosophy
- Icelandic premium context
- Real-world example with ISK amounts
```

**Tests**: Manual review for clarity

**Requirements Addressed**: FR-9, US-10, NFR-2

**Acceptance Criteria**:
- [ ] Clear explanation of FatFIRE
- [ ] Safety margin explanation
- [ ] Splurge budget concept explained
- [ ] Wish list philosophy described
- [ ] Icelandic premium context included
- [ ] Example with Icelandic amounts
- [ ] Collapsible (localStorage remembers state)
- [ ] Easy to understand
- [ ] Icelandic text throughout

---

#### Task 9.2: Add Tooltips and Guidance

**Objective**: Educational tooltips and guidance throughout.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- Various components (add tooltips)

**Functionality**:
```typescript
// Guidance features:
- Multiplier tooltip: "30x = 3.33% withdrawal, Trinity Study reference"
- Wish list tooltip: "Must-have vs nice-to-have priority"
- Splurge budget tooltip: "Spontaneous luxury without guilt"
- Icelandic premium costs tooltip: "Reykjavík 101/105, international travel"
```

**Tests**: Manual review

**Requirements Addressed**: FR-9, NFR-2

**Acceptance Criteria**:
- [ ] Multiplier explanation clear
- [ ] Wish list priority explained
- [ ] Splurge budget concept clear
- [ ] Icelandic costs context provided
- [ ] Tooltips easy to access
- [ ] Icelandic language

---

#### Task 9.3: Apply Premium Visual Theme

**Objective**: Apply gold/amber premium theme throughout.

**Duration**: 2 hours

**Files to Create/Modify**:
- All components (apply premium styling)

**Functionality**:
```typescript
// Premium theme:
- Gold/amber accent colors
- Refined typography (serif for headings)
- Generous whitespace
- High-quality iconography
- Celebratory tone (abundance mindset)
- Aspirational but realistic messaging
```

**Tests**: Visual review

**Requirements Addressed**: NFR-6

**Acceptance Criteria**:
- [ ] Gold/amber accents consistent throughout
- [ ] Serif headings (or elegant sans-serif)
- [ ] Generous whitespace
- [ ] High-quality icons
- [ ] Celebratory tone in messaging
- [ ] Aspirational yet realistic
- [ ] Contrast ratios meet WCAG AA (4.5:1)

---

#### Task 9.4: Implement Accessibility Features

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
- Color contrast audit (gold/amber theme)
- Screen reader testing
```

**Tests**:
- Automated: axe DevTools
- Manual: Screen reader testing (VoiceOver)
- Keyboard navigation testing

**Requirements Addressed**: NFR-4

**Acceptance Criteria**:
- [ ] All inputs have proper labels
- [ ] Chart has text alternative
- [ ] Keyboard navigation works throughout
- [ ] Color contrast meets WCAG AA (4.5:1) even with gold theme
- [ ] Focus indicators visible
- [ ] Screen reader announces results
- [ ] No axe violations

---

#### Task 9.5: Final Testing and Bug Fixes

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
- [ ] All unit tests pass
- [ ] Component tests pass
- [ ] Integration tests pass
- [ ] No console errors or warnings
- [ ] Works on mobile devices
- [ ] Works on all major browsers
- [ ] Edge cases handled gracefully
- [ ] Wish list reordering works
- [ ] Auto-sync with expense baseline works

---

### EPIC 10: Main Page and Routing

**Objective**: Create main page and integrate into app navigation.

**Duration**: 2-3 hours

**Dependencies**: Epics 1-9 complete

**Deliverables**:
- Main calculator page
- Route page
- Navigation integration

---

#### Task 10.1: Create Route Page

**Objective**: Next.js page component for FatFIRE route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/luxus-fire/page.tsx` (new) OR
- Add to existing FIRE planning section

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary with loading fallback
- FatFireCalculator component
- Metadata for SEO
- Hero section with title and description
```

**Tests**: N/A (routing)

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [ ] Route works at /luxus-fire or similar
- [ ] Wrapped in CalculatorProvider
- [ ] Loading fallback shown
- [ ] SEO metadata present (title, description)
- [ ] Hero section with premium styling

---

#### Task 10.2: Add to Calculator Navigation

**Objective**: Add FatFIRE to calculator list.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to FIRE_PLANNING_CALCULATORS array:
{
  id: 'luxus-fire',
  name: 'Lúxus FIRE Áætlun',
  description: 'Skipuleggðu lúxus snemmbúin eftirlaun án málamiðlana',
  icon: '💎',
  available: true,
  category: 'fire-planning'
}
```

**Tests**: Manual testing

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [ ] Appears in FIRE planning calculators
- [ ] Icon and description correct (premium feel)
- [ ] Navigation works
- [ ] Listed in appropriate order (after Coast/Barista FIRE)

---

#### Task 10.3: Create Component Barrel Export

**Objective**: Export all FatFIRE components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/fatFire/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { FatFireCalculator } from './FatFireCalculator';
export { WishListBuilder } from './WishListBuilder';
export { TimelineChart } from './TimelineChart';
// Export types:
export type { FatFireState, FatFireResults, WishListItem } from '@/types/fatFire';
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [ ] All public components exported
- [ ] No circular dependencies
- [ ] Clean import paths

---

## 3. Implementation Schedule

### Phase 1: Foundation and State (Days 1-2)
- Epic 1: Types, constants, calculations
- Epic 2: CalculatorContext integration

### Phase 2: Core UI (Days 3-5)
- Epic 3: Expense input and Deluxe tier display
- Epic 4: Wish list builder
- Epic 5: Splurge budget and FI number

### Phase 3: Timeline and Visualization (Days 6-7)
- Epic 6: Timeline projections with chart

### Phase 4: Scenarios and Life Energy (Days 8-9)
- Epic 7: Scenario comparison
- Epic 8: Life energy integration

### Phase 5: Polish and Deploy (Days 10-11)
- Epic 9: Educational content, accessibility, premium theme
- Epic 10: Main page and routing
- Final review and adjustments

---

## 4. Risk Mitigation

### Risk 1: Complex Wish List Management
**Mitigation**: Use established patterns, comprehensive validation, fallback to up/down buttons if drag-and-drop fails.

### Risk 2: Deluxe Tier Dependency
**Mitigation**: Detect early, prominent prompt, fallback to manual input, clear guidance on creating Deluxe tier.

### Risk 3: Calculation Performance
**Mitigation**: Memoization, debounced inputs, limit scenarios to 5, performance budget <200ms.

### Risk 4: Premium Theme Accessibility
**Mitigation**: Test contrast ratios, ensure gold/amber accents don't compromise readability, WCAG AA compliance.

---

## 5. Testing Strategy

### Unit Tests (Epic 1, Tasks 1.3-1.5)
- All calculation functions
- Edge cases (0 values, negative inputs, already at FatFIRE, unrealistic timelines)
- Wish list totals by priority
- Timeline and milestones
- Life energy conversions
- Coverage target: >90%

### Component Tests (Epic 9, Task 9.5)
- Input validation
- Wish list CRUD operations
- Scenario comparison
- Timeline chart rendering (snapshot tests)
- Life energy display (with/without AWH)
- Splurge budget calculations

### Integration Tests (Epic 9, Task 9.5)
- CalculatorContext state updates
- Expense baseline Deluxe tier integration
- AWH integration
- LocalStorage persistence
- Auto-sync on baseline changes
- Wish list order preservation

### Accessibility Tests (Epic 9, Task 9.4)
- Automated: axe DevTools
- Manual: Screen reader (VoiceOver/NVDA)
- Keyboard navigation
- Color contrast (gold/amber theme)

### Manual Tests (Epic 9, Task 9.5)
- User flows (all scenarios)
- Mobile devices (iOS, Android)
- Cross-browser (Chrome, Safari, Firefox)
- Edge cases (extreme values, missing data)
- Premium theme visual review

---

## 6. Definition of Done

Each task is complete when:
- [ ] Code implemented and compiles without errors
- [ ] Unit tests pass (where applicable)
- [ ] Component tests pass (where applicable)
- [ ] TypeScript strict mode passes
- [ ] No console errors or warnings
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Icelandic text used for all UI
- [ ] Premium visual theme applied (gold/amber)
- [ ] Code reviewed or self-reviewed
- [ ] Responsive on mobile, tablet, desktop
- [ ] Integrated with CalculatorContext
- [ ] LocalStorage persistence works
- [ ] Educational content clear and helpful

---

## 7. Dependencies Summary

**Epic Dependencies:**
- Epic 2 depends on Epic 1 (needs types and calculations)
- Epic 3 depends on Epic 2 (needs state management)
- Epic 4 depends on Epic 3 (needs expense input foundation)
- Epic 5 depends on Epic 4 (needs wish list for FI calculation)
- Epic 6 depends on Epic 5 (needs FI number for timeline)
- Epic 7 depends on Epics 3-6 (needs all inputs for scenarios)
- Epic 8 depends on Epics 1-7 (needs results for life energy)
- Epic 9 depends on Epics 1-8 (polish after features)
- Epic 10 depends on Epics 1-9 (final integration)

**Critical Path:**
Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 6 → Epic 7 → Epic 8 → Epic 9 → Epic 10

**Parallel Work Opportunities:**
- Epic 8 (Life Energy) can start after Epic 6 (doesn't depend on Epic 7)
- Educational content (Epic 9.1-9.2) can be drafted during Epics 6-7

---

## 8. Success Metrics

### Functional Success
- [ ] Accurate FI number calculation (matches manual verification)
- [ ] Deluxe tier integration works seamlessly
- [ ] Wish list CRUD operations work
- [ ] Timeline with milestones displayed correctly
- [ ] Scenario comparison accurate
- [ ] Life energy conversions correct

### User Experience Success
- [ ] User can plan FatFIRE in < 15 minutes
- [ ] Wish list easy to build and edit
- [ ] Premium theme feels aspirational
- [ ] Educational content makes FatFIRE clear
- [ ] Mobile experience smooth
- [ ] Accessibility meets WCAG 2.1 AA

### Technical Success
- [ ] All tests pass (>90% coverage)
- [ ] No console errors
- [ ] Performance meets targets (<200ms calculations, <300ms chart)
- [ ] Code follows existing patterns
- [ ] TypeScript strict mode compliant

---

**Tasks Phase Complete: Ready for Implementation**
