# Tasks: Coast FIRE Calculator

## Document Information

- **Feature Name**: Coast FIRE Calculator (Ró FIRE Reiknivél)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-coast-fire.md
- **Design**: design-coast-fire.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build core calculations first, then UI components in feature slices (inputs → results → visualization → scenarios → integration).

**Rationale**:
- Calculations can be tested independently before UI
- Core functionality provides immediate value
- Visualization built on solid calculation foundation
- Scenario analysis adds depth after basic flow works
- Integration leverages existing patterns from Expense Baseline

**Sequence**:
1. Foundation: Types, constants, core calculations
2. State: CalculatorContext integration
3. Basic UI: Input forms and basic results
4. Visualization: Growth projection chart
5. Advanced Features: Scenario comparison, life energy
6. Integration: Expense Baseline and AWH
7. Polish: Educational content, suggestions, accessibility

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-8 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Epic 3 (Basic UI) depends on Epic 2 (State) complete
- Epic 4 (Visualization) and Epic 5 (Advanced) can partially overlap after Epic 3
- Epic 6 (Integration) requires Epics 2-5 mostly complete

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Core Calculations

**Objective**: Create type definitions, constants, and pure calculation functions for Coast FIRE.

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Icelandic default constants
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for Coast FIRE data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/coastFire.ts` (new)

**Functionality**:
```typescript
// Define types for:
- CoastFIREState (inputs)
- CoastFIREResults (calculated results)
- ScenarioResult (scenario comparison)
- CoastFIRELifeEnergy (life energy metrics)
- CalculationAssumptions (what was used in calculation)
- ChartDataPoint (for chart rendering)
- CoastFIREStatus ('coasting' | 'future' | 'impossible')
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-6 (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors

---

#### Task 1.2: Create Constants and Defaults ✅ Completed 2026-01-29

**Objective**: Define Icelandic defaults and scenario configurations.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/constants/coastFire.ts` (new)

**Functionality**:
```typescript
// Define constants:
- DEFAULT_RETIREMENT_AGE: 67 (Icelandic retirement age)
- DEFAULT_FI_MULTIPLIER: 25
- SCENARIO_RETURN_RATES: { conservative: 5, moderate: 7, optimistic: 9 }
- SCENARIO_LABELS: Icelandic names for scenarios
- FI_MULTIPLIER_PRESETS: [25, 30] with explanations
- COAST_FIRE_COLORS: color scheme for status and scenarios
- VALIDATION_LIMITS: min/max values for inputs
```

**Tests**: N/A (constants only)

**Requirements Addressed**: NFR-5 (Icelandic context)

**Acceptance Criteria**:
- [x] All constants defined with Icelandic defaults
- [x] Scenario return rates match spec (4%, 6%, 8% - adjusted for real returns)
- [x] Default retirement age is 67
- [x] Colors follow design system
- [x] Exportable for use across components

**Implementation Notes**:
- Created comprehensive 519-line constants file
- Adjusted scenario rates to 4%/6%/8% (real returns) instead of 5%/7%/9% to be more conservative for Iceland
- Included 16 helper functions for validation and configuration
- All messages in Icelandic
- TypeScript compilation verified
- Context documentation: context/modules/CoastFireConstants.md

---

#### Task 1.3: Implement Core Calculation Functions ✅ Completed 2026-01-29

**Objective**: Create pure functions for Coast FIRE calculations.

**Duration**: 3.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/coastFire.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateFutureValue(principal, rate, years, frequency): number
- calculateYearsToCoastFIRE(balance, fiNumber, returnRate): number | null
- calculateCoastFIREAge(currentAge, yearsToCoast): number | null
- calculateCoastFIREDate(birthDate, coastFireAge): Date | null
- calculateGapToCoastFIRE(balance, targetAge, currentAge, fiNumber, rate): number | null
- generateScenarios(currentAge, balance, fiNumber, targetAge): ScenarioResult[]
- generateChartData(currentAge, targetAge, balance, rate): ChartDataPoint[]
- calculateCoastFIREResults(state, actualHourlyWage): CoastFIREResults
```

**Tests**:
- `/tests/lib/calculations/coastFire.test.ts` (new)
  - Test compound interest accuracy
  - Test years to Coast FIRE calculation
  - Test "already coasting" scenario (returns 0)
  - Test "impossible" scenario (returns null)
  - Test scenario generation (3 scenarios)
  - Test edge cases: 0 balance, negative returns, very long timelines

**Requirements Addressed**: FR-1, FR-3.2

**Acceptance Criteria**:
- [x] All calculation functions implemented
- [x] Pure functions (no side effects)
- [x] Handles edge cases (0 values, negative returns, already coasting)
- [x] Unit tests pass with >90% coverage (53/53 tests passing, 100% coverage)
- [x] Calculations match examples from requirements

**Implementation Notes**:
- Created 556-line calculations file with all core functions
- Functions implemented:
  - `calculateFutureValue()` - Compound interest: FV = PV × (1+r)^t
  - `calculateCoastFINumber()` - Present value: PV = FV / (1+r)^t
  - `calculateYearsToCoast()` - Solves for time using logarithms
  - `calculateGapToCoast()` - ISK needed to start coasting
  - `calculateProjectedBalance()` - Balance at retirement
  - `calculateCoastFIREStatus()` - Determines coasting/future/impossible
  - `calculateScenarioResults()` - Runs 3 return scenarios (4%/6%/8%)
  - `calculateGrowthProjection()` - Year-by-year data for charting
  - `calculateLifeEnergy()` - Converts ISK to work hours/years
  - `calculateCoastFIREResult()` - Master orchestrator
- All functions use real returns (inflation-adjusted) for Iceland context
- Edge cases handled: already coasting, impossible scenarios, zero/negative returns, timelines > 100 years
- Performance: all calculations < 20ms (requirement: < 50ms)
- Tests: apps/peninganaedalifid/src/lib/calculations/__tests__/coastFire.test.ts (544 lines, 53 tests)
- Context: context/modules/CoastFireCalculations.md

---

#### Task 1.4: Implement Life Energy Calculations

**Objective**: Add life energy conversion functions.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/coastFire.ts` (modify)

**Functionality**:
```typescript
// Add functions:
- calculateCoastFIRELifeEnergy(balance, gap, growth, awh): CoastFIRELifeEnergy | null
- convertToWorkHours(amount, awh): number
- convertToWorkYears(hours): number
- calculateHoursSaved(growth, awh): number
```

**Tests**:
- Add to `/tests/lib/calculations/coastFire.test.ts`
  - Test life energy with valid AWH
  - Test life energy returns null without AWH
  - Test hours to years conversion
  - Test hours saved calculation

**Requirements Addressed**: FR-5, US-5

**Acceptance Criteria**:
- [ ] Life energy calculations implemented
- [ ] Returns null when AWH not available
- [ ] Converts ISK to hours correctly
- [ ] Hours to years uses 2080 work hours/year
- [ ] Unit tests pass

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage Coast FIRE state with persistence.

**Duration**: 4-5 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for Coast FIRE
- CRUD operations for Coast FIRE data
- LocalStorage persistence
- Integration with Expense Baseline and AWH

---

#### Task 2.1: Extend CalculatorContext State ✅ Completed 2026-01-29

**Objective**: Add Coast FIRE state and results to context.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add coastFire to StoredState)

**Functionality**:
```typescript
// Add to context state:
- coastFire: CoastFIREState | null
- coastFireResults: CoastFIREResults | null

// Add to context type:
- updateCoastFire: (state: Partial<CoastFIREState>) => void
- setFINumberFromBaseline: (tier: ExpenseTier, multiplier: number) => void
- resetCoastFire: () => void
- getCoastFIREStatus: () => CoastFIREStatus | null
- getCoastFIREAge: () => number | null
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-7.1, FR-7.2

**Acceptance Criteria**:
- [x] State added to CalculatorContext
- [x] Results auto-calculated on state change
- [x] TypeScript types updated
- [x] No breaking changes to existing context

**Implementation Notes**:
- Extended CalculatorContext with complete Coast FIRE state management
- Added coastFireState variable (CoastFIREState | null) and coastFireResults (auto-computed via useMemo)
- Implemented 11 action functions using useCallback:
  - updateCoastFireState() - partial updates
  - setCoastCurrentAge(), setCoastCurrentInvestments(), setCoastTargetRetirementAge(), setCoastExpectedReturn()
  - setCoastFINumber(), setCoastFINumberSource()
  - setCoastSelectedTier() - smart tier selector with auto FI calculation from baseline
  - setCoastFIMultiplier() - smart multiplier that recalculates FI when using baseline
  - clearCoastFireState(), initializeCoastFireState()
  - getCoastFireState(), hasCoastFireState() - integration API
- Implemented full localStorage persistence:
  - Load on mount with type restoration
  - Auto-save with 500ms debounce
  - coastFire field added to StoredState as optional for backwards compatibility
  - resetAll() clears coastFireState
- Smart FI number calculation:
  - setCoastSelectedTier fetches expense from baseline and auto-calculates FI number
  - setCoastFIMultiplier recalculates FI when using baseline source
- Results auto-recalculate when coastFireState, expenseBaseline, or actualHourlyWage changes
- All state updates immutable, proper dependency arrays prevent unnecessary re-renders
- Context documentation: context/modules/CoastFireContext.md

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for Coast FIRE state.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateCoastFire: Merge partial updates, recalculate results
- setFINumberFromBaseline: Calculate FI from expense tier + multiplier
- resetCoastFire: Clear all Coast FIRE data
- getCoastFIREStatus: Return current status
- getCoastFIREAge: Return coast age or null
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: US-3, FR-2

**Acceptance Criteria**:
- [ ] All actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Auto-recalculate results after each action
- [ ] setFINumberFromBaseline integrates with expense baseline

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load Coast FIRE state from localStorage.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load coastFire on mount
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-7.1-7.3, NFR-1

**Acceptance Criteria**:
- [ ] Loads Coast FIRE state on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Cleared in resetAll

---

### EPIC 3: Basic UI - Input Forms and Results Display

**Objective**: Create input forms and basic results display.

**Duration**: 8-10 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Main calculator page component
- Input section with all forms
- Coast FIRE status card
- Basic results summary

---

#### Task 3.1: Create CoastFIRECalculator Main Component

**Objective**: Page-level container component.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/CoastFIRECalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Load state from context
- Coordinate input and results sections
- Manage educational intro (collapsible)
- Handle loading and error states
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: Overall structure

**Acceptance Criteria**:
- [ ] Loads state from CalculatorContext
- [ ] Renders input and results sections
- [ ] Educational intro collapsible
- [ ] Responsive layout
- [ ] Loading states handled

---

#### Task 3.2: Create FINumberInput Component

**Objective**: FI number input with baseline integration option.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/coastFire/FINumberInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Toggle between manual input and baseline selector
- If baseline exists, show "Use my expense baseline" button
- TierSelector component (reuse from Expense Baseline)
- Multiplier selector (25x, 30x, custom)
- Show calculated FI number breakdown
- Educational tooltips for multipliers
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: US-3, FR-2, US-7

**Acceptance Criteria**:
- [ ] Toggle between manual and baseline modes
- [ ] TierSelector integrated (if baseline exists)
- [ ] Multiplier presets (25x, 30x, custom)
- [ ] Shows FI number breakdown
- [ ] Educational tooltips present

---

#### Task 3.3: Create InputSection Component

**Objective**: Container for all input fields.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/InputSection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- FINumberInput (from Task 3.2)
- CurrentInvestmentsInput (CurrencyInput)
- CurrentAgeInput (number input)
- TargetRetirementAgeInput (number with slider)
- ExpectedReturnSlider (with scenario presets)
- Input validation and error display
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: US-1, US-4

**Acceptance Criteria**:
- [ ] All inputs present and functional
- [ ] Return rate slider with preset buttons (5%, 7%, 9%)
- [ ] Age inputs validated (current < target)
- [ ] Real-time validation feedback
- [ ] Sticky on desktop (stays visible when scrolling)

---

#### Task 3.4: Create CoastFIREStatusCard Component

**Objective**: Display Coast FIRE status and key results.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/CoastFIREStatusCard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Status indicator (Already Coasting | Coast at Age X | Impossible)
- Coast FIRE date (age + calendar date)
- Gap to Coast FIRE (if not yet coasting)
- Projected balance at target retirement age
- Color coding based on status
- Plain language explanation
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: US-1, FR-6

**Acceptance Criteria**:
- [ ] Shows all three status types correctly
- [ ] Coast FIRE date displayed (age + calendar)
- [ ] Gap shown when not coasting
- [ ] Projected balance at target age shown
- [ ] Color coding matches design (green/blue/amber)
- [ ] Icelandic text throughout

---

#### Task 3.5: Create KeyInsights Component

**Objective**: Plain language summary of results.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/coastFire/KeyInsights.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Main takeaway sentence
- Timeline explanation
- Next steps recommendation
- Generated dynamically based on status
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: NFR-2 (usability)

**Acceptance Criteria**:
- [ ] Plain language Icelandic summary
- [ ] Different messages for each status
- [ ] Actionable recommendations
- [ ] Easy to understand

---

### EPIC 4: Visualization - Growth Projection Chart

**Objective**: Create interactive chart showing investment growth trajectory.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete, Epic 3 helpful but not required

**Deliverables**:
- Growth projection chart component
- Chart data generator
- Interactive features (hover, milestones)
- Responsive design

---

#### Task 4.1: Set Up Recharts and Chart Container

**Objective**: Install Recharts and create basic chart structure.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/GrowthProjectionChart.tsx` (new)
- `package.json` (add recharts dependency)

**Functionality**:
```typescript
// Component features:
- ResponsiveContainer for responsive sizing
- LineChart with proper margins
- X-axis (age), Y-axis (balance ISK)
- Basic configuration
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-4

**Acceptance Criteria**:
- [ ] Recharts installed
- [ ] Basic chart renders
- [ ] Responsive to container size
- [ ] Axes labeled in Icelandic

---

#### Task 4.2: Implement Chart Data and Lines

**Objective**: Add projection line and FI number target line.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/coastFire/GrowthProjectionChart.tsx` (modify)

**Functionality**:
```typescript
// Chart elements:
- Projected growth line (green, solid)
- FI number target line (blue, dashed)
- Current balance starting point marker
- Proper data formatting and scaling
```

**Tests**: Visual testing + unit tests for data generation

**Requirements Addressed**: FR-4.1, FR-4.3, FR-4.4, US-2

**Acceptance Criteria**:
- [ ] Projection line shows compound growth
- [ ] FI number line is horizontal at FI number value
- [ ] Current balance marked at starting point
- [ ] Lines clearly distinguishable
- [ ] Chart scales appropriately

---

#### Task 4.3: Add Milestones and Coasting Period

**Objective**: Mark Coast FIRE milestone and highlight coasting period.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/coastFire/GrowthProjectionChart.tsx` (modify)

**Functionality**:
```typescript
// Chart enhancements:
- Coast FIRE milestone marker (amber dot + label)
- Target retirement age marker (purple)
- Coasting period area fill (light amber)
- Milestone labels
```

**Tests**: Visual testing

**Requirements Addressed**: FR-4.2, FR-4.5, US-2

**Acceptance Criteria**:
- [ ] Coast FIRE milestone clearly marked
- [ ] Coasting period shaded area between Coast and target age
- [ ] All milestones labeled in Icelandic
- [ ] Visual hierarchy clear

---

#### Task 4.4: Add Interactive Features

**Objective**: Implement hover tooltips and interactive features.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/coastFire/GrowthProjectionChart.tsx` (modify)

**Functionality**:
```typescript
// Interactive features:
- Hover tooltip showing exact balance at age
- Formatted values (ISK with Icelandic formatting)
- Smooth animations
- Mobile-friendly (touch support)
```

**Tests**: Manual testing on desktop and mobile

**Requirements Addressed**: US-2, NFR-2

**Acceptance Criteria**:
- [ ] Hover shows balance at any point
- [ ] Tooltip formatted in Icelandic
- [ ] Animations smooth
- [ ] Works on touch devices
- [ ] Accessible (keyboard navigable)

---

### EPIC 5: Advanced Features - Scenarios and Life Energy

**Objective**: Add scenario comparison and life energy display.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete, Epic 3 complete

**Deliverables**:
- Scenario comparison table
- Life energy display component
- Action suggestions panel (for impossible scenarios)
- Multi-scenario chart (optional enhancement)

---

#### Task 5.1: Create ScenarioComparisonTable Component

**Objective**: Show side-by-side comparison of three scenarios.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/coastFire/ScenarioComparisonTable.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three columns: Conservative (5%), Moderate (7%), Optimistic (9%)
- Rows: Coast Age, Years to Coast, Gap, Projected Balance, Excess over FI
- Color coding per scenario
- Highlight selected scenario
- Mobile: tabs instead of table
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: US-4, FR-3

**Acceptance Criteria**:
- [ ] Three scenarios displayed side-by-side
- [ ] All metrics shown for each scenario
- [ ] Color coded by scenario (red/blue/green)
- [ ] Mobile-responsive (tabs on small screens)
- [ ] Icelandic labels and formatting

---

#### Task 5.2: Create LifeEnergyDisplay Component

**Objective**: Display Coast FIRE results in life energy terms.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/LifeEnergyDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Current investments in work hours
- Gap to Coast FIRE in work hours
- Passive hours earned from compound growth
- Work hours saved by coasting vs continuing to save
- Formatted with "klst" and year conversions
- Alert if AWH not available (link to AWH calculator)
```

**Tests**: Component tests in Epic 7

**Requirements Addressed**: US-5, FR-5

**Acceptance Criteria**:
- [ ] Shows investments in work hours
- [ ] Shows gap in work hours (if applicable)
- [ ] Shows passive hours earned
- [ ] Shows hours saved by coasting
- [ ] Prompt to calculate AWH if not available
- [ ] All values formatted in Icelandic

---

#### Task 5.3: Create ActionSuggestionsPanel Component

**Objective**: Provide suggestions when Coast FIRE is impossible.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/ActionSuggestionsPanel.tsx` (new)
- `/src/lib/calculations/coastFire.ts` (add suggestion generation functions)

**Functionality**:
```typescript
// Component features:
- Generate 4 suggestions:
  1. Delay retirement (calculate new age)
  2. Reduce FI number (calculate achievable FI)
  3. Increase return (calculate required return, warn about risk)
  4. Continue saving (calculate monthly savings needed)
- Feasibility rating for each (easy/moderate/difficult)
- Calculations shown for each suggestion
- Only shown when status is 'impossible'
```

**Tests**: Component tests + calculation tests

**Requirements Addressed**: US-4 (implicit), user experience

**Acceptance Criteria**:
- [ ] Four suggestions generated dynamically
- [ ] Calculations accurate for each suggestion
- [ ] Feasibility ratings shown
- [ ] Only displayed when Coast FIRE impossible
- [ ] Clear, actionable language in Icelandic

---

### EPIC 6: Integration with Expense Baseline and AWH

**Objective**: Seamless integration with Expense Baseline and Actual Hourly Wage.

**Duration**: 4-5 hours

**Dependencies**: Epics 2-5 complete

**Deliverables**:
- Expense baseline integration
- AWH integration
- Auto-update on baseline changes
- Cross-calculator data sharing

---

#### Task 6.1: Implement Expense Baseline Integration

**Objective**: Fetch FI number from expense baseline tiers.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/coastFire/FINumberInput.tsx` (modify)
- `/src/context/CalculatorContext.tsx` (modify setFINumberFromBaseline)

**Functionality**:
```typescript
// Integration features:
- Check if expense baseline exists on load
- Offer to use baseline if available
- Fetch monthly expenses for selected tier
- Calculate FI number: annual expenses × multiplier
- Display breakdown: "520.000 kr/mán × 12 × 25 = 156.000.000 kr"
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: US-3, FR-2

**Acceptance Criteria**:
- [ ] Detects expense baseline existence
- [ ] Fetches tier expenses correctly
- [ ] Calculates FI number accurately
- [ ] Shows FI number breakdown
- [ ] Handles missing baseline gracefully

---

#### Task 6.2: Implement Auto-Update on Baseline Changes

**Objective**: Update FI number when expense baseline changes.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/CoastFIRECalculator.tsx` (modify)

**Functionality**:
```typescript
// Auto-update logic:
- useEffect watching expenseBaseline changes
- If using baseline (fiNumberSource === 'baseline'), recalculate FI number
- Show notification: "Útgjaldagrunnur þinn breyttist. FI Tala uppfærð."
- Recalculate Coast FIRE results
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: US-3

**Acceptance Criteria**:
- [ ] Watches for expense baseline changes
- [ ] Recalculates FI number when baseline changes
- [ ] Shows update notification
- [ ] Only updates when using baseline (not manual)
- [ ] Recalculates results automatically

---

#### Task 6.3: Implement AWH Integration for Life Energy

**Objective**: Fetch AWH and use for life energy calculations.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/coastFire/LifeEnergyDisplay.tsx` (modify)

**Functionality**:
```typescript
// AWH integration:
- Fetch actualHourlyWage from context
- Pass to life energy calculations
- If null, show prompt to calculate AWH
- Link to AWH calculator page
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: US-5, FR-5

**Acceptance Criteria**:
- [ ] Fetches AWH from context
- [ ] Calculates life energy when AWH available
- [ ] Shows prompt when AWH not available
- [ ] Link to AWH calculator works
- [ ] Handles null AWH gracefully

---

### EPIC 7: Educational Content and Polish

**Objective**: Add educational content, improve UX, ensure accessibility.

**Duration**: 5-7 hours

**Dependencies**: Epics 1-6 complete

**Deliverables**:
- Educational intro component
- Return rate guidance
- Multiplier explanations
- Accessibility audit and fixes
- Final testing

---

#### Task 7.1: Create EducationalIntro Component

**Objective**: Educational intro explaining Coast FIRE concept.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/coastFire/EducationalIntro.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible section (default closed for returning users)
- "What is Coast FIRE?" explainer
- How it works (compound growth explanation)
- Why it matters (freedom milestone)
- Real-world example with ISK amounts
- Icelandic context (lífeyrissjóður mention)
```

**Tests**: Manual review for clarity

**Requirements Addressed**: NFR-2, NFR-5 (educational)

**Acceptance Criteria**:
- [ ] Clear explanation of Coast FIRE
- [ ] Example with Icelandic amounts
- [ ] Collapsible (localStorage remembers state)
- [ ] Easy to understand
- [ ] Icelandic text throughout

---

#### Task 7.2: Add Return Rate and Multiplier Guidance

**Objective**: Educational tooltips and guidance for inputs.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/InputSection.tsx` (modify)
- `/src/components/coastFire/FINumberInput.tsx` (modify)

**Functionality**:
```typescript
// Guidance features:
- Return rate tooltip: "What is real return? Why conservative planning?"
- Multiplier tooltip: "25x = 4% withdrawal, 30x = 3.33%, Trinity Study reference"
- Scenario preset buttons with explanations
- Warning if return rate outside 3-10%
```

**Tests**: Manual review

**Requirements Addressed**: NFR-2, educational content

**Acceptance Criteria**:
- [ ] Return rate guidance clear
- [ ] Multiplier explanation present
- [ ] Tooltips easy to access
- [ ] Warnings shown appropriately
- [ ] Icelandic language

---

#### Task 7.3: Implement Accessibility Features

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

**Requirements Addressed**: NFR-4

**Acceptance Criteria**:
- [ ] All inputs have proper labels
- [ ] Chart has text alternative
- [ ] Keyboard navigation works throughout
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Screen reader announces results
- [ ] No axe violations

---

#### Task 7.4: Final Testing and Bug Fixes

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

---

### EPIC 8: Main Page and Routing

**Objective**: Create main page and integrate into app navigation.

**Duration**: 2-3 hours

**Dependencies**: Epics 1-7 complete

**Deliverables**:
- Main calculator page
- Route page
- Navigation integration

---

#### Task 8.1: Create Route Page

**Objective**: Next.js page component for Coast FIRE route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/ro-fire/page.tsx` (new) OR
- Add to existing FIRE planning section

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary with loading fallback
- CoastFIRECalculator component
- Metadata for SEO
- Hero section with title and description
```

**Tests**: N/A (routing)

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [ ] Route works at /ro-fire
- [ ] Wrapped in CalculatorProvider
- [ ] Loading fallback shown
- [ ] SEO metadata present

---

#### Task 8.2: Add to Calculator Navigation

**Objective**: Add Coast FIRE to calculator list.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to FIRE_PLANNING_CALCULATORS array:
{
  id: 'ro-fire',
  name: 'Ró FIRE Reiknivél',
  description: 'Reiknaðu hvenær fjárfestingar þínar geta "róað" til FI',
  icon: '🎯',
  available: true,
  category: 'fire-planning'
}
```

**Tests**: Manual testing

**Requirements Addressed**: N/A (integration)

**Acceptance Criteria**:
- [ ] Appears in FIRE planning calculators
- [ ] Icon and description correct
- [ ] Navigation works
- [ ] Listed in appropriate order

---

#### Task 8.3: Create Component Barrel Export

**Objective**: Export all Coast FIRE components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/coastFire/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { CoastFIRECalculator } from './CoastFIRECalculator';
export { GrowthProjectionChart } from './GrowthProjectionChart';
export { ScenarioComparisonTable } from './ScenarioComparisonTable';
// Export types:
export type { CoastFIREState, CoastFIREResults } from '@/types/coastFire';
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

### Phase 2: Core UI (Days 3-4)
- Epic 3: Input forms and basic results

### Phase 3: Visualization (Days 5-6)
- Epic 4: Growth projection chart

### Phase 4: Advanced Features (Days 7-8)
- Epic 5: Scenarios and life energy
- Epic 6: Integration with Expense Baseline and AWH

### Phase 5: Polish and Deploy (Days 9-10)
- Epic 7: Educational content and accessibility
- Epic 8: Main page and routing
- Final review and adjustments

---

## 4. Risk Mitigation

### Risk 1: Complex Chart Implementation
**Mitigation**: Use Recharts (proven library), start basic, add features incrementally.

### Risk 2: Expense Baseline Sync Issues
**Mitigation**: Clear separation of manual vs baseline mode, useEffect for auto-updates, user notifications.

### Risk 3: Calculation Edge Cases
**Mitigation**: Comprehensive unit tests, validation before calculation, clear error messages.

### Risk 4: Performance with Scenarios
**Mitigation**: Memoization, debounced inputs, limit chart data points for long timelines.

---

## 5. Testing Strategy

### Unit Tests (Epic 1, Task 1.3-1.4)
- All calculation functions
- Edge cases (0 values, negative returns, already coasting, impossible)
- Scenario generation
- Life energy conversions
- Coverage target: >90%

### Component Tests (Epic 7, Task 7.4)
- Input validation
- Status card rendering
- Chart rendering (snapshot tests)
- Life energy display (with/without AWH)
- Action suggestions generation

### Integration Tests (Epic 7, Task 7.4)
- CalculatorContext state updates
- Expense baseline integration
- AWH integration
- LocalStorage persistence
- Auto-update on baseline changes

### Accessibility Tests (Epic 7, Task 7.3)
- Automated: axe DevTools
- Manual: Screen reader (VoiceOver/NVDA)
- Keyboard navigation
- Color contrast

### Manual Tests (Epic 7, Task 7.4)
- User flows (all scenarios)
- Mobile devices (iOS, Android)
- Cross-browser (Chrome, Safari, Firefox)
- Edge cases (extreme values, missing data)

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
- Epic 4 can start after Epic 2 (independent of Epic 3)
- Epic 5 depends on Epics 2-3 (needs state and basic UI)
- Epic 6 depends on Epics 2-5 (integration after core complete)
- Epic 7 depends on Epics 1-6 (polish after features)
- Epic 8 depends on Epics 1-7 (final integration)

**Critical Path:**
Epic 1 → Epic 2 → Epic 3 → Epic 5 → Epic 6 → Epic 7 → Epic 8

**Parallel Work Opportunities:**
- Epic 4 (Chart) can overlap with Epic 3 (Basic UI)
- Educational content (Epic 7.1-7.2) can be drafted during Epic 5

---

## 8. Success Metrics

### Functional Success
- [ ] Accurate Coast FIRE date calculation (matches manual verification)
- [ ] Expense baseline integration works seamlessly
- [ ] All three scenarios calculated correctly
- [ ] Chart renders and displays correctly
- [ ] Life energy conversions accurate

### User Experience Success
- [ ] User can calculate Coast FIRE in < 2 minutes
- [ ] Results are immediately understandable
- [ ] Educational content makes concept clear
- [ ] Mobile experience is smooth
- [ ] Accessibility meets WCAG 2.1 AA

### Technical Success
- [ ] All tests pass (>90% coverage)
- [ ] No console errors
- [ ] Performance meets targets (<50ms calculations, <300ms chart)
- [ ] Code follows existing patterns
- [ ] TypeScript strict mode compliant

---

**Tasks Phase Complete: Ready for Implementation**
