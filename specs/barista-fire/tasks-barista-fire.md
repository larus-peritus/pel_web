# Tasks: Barista FIRE Planner

## Document Information

- **Feature Name**: Barista FIRE Planner (Barista FIRE Áætlun)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-barista-fire.md
- **Design**: design-barista-fire.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Incremental Enhancement

**Strategy**: Build calculation engine first, then core UI with single scenario, then multi-scenario support, then visualizations and polish.

**Rationale**:
- Calculations can be tested independently
- Single scenario provides immediate value
- Multi-scenario adds comparison capability
- Visualizations enhance but don't block core functionality
- Clear dependency chain enables systematic progress

**Sequence**:
1. Foundation: Types, constants, core calculations
2. State: CalculatorContext integration
3. Core UI: Current savings, gap display, single scenario
4. Multi-Scenario: Scenario builder, comparison table
5. Visualizations: Timeline chart, comparison chart
6. Polish: Icelandic context panel, educational content, accessibility
7. Testing: Unit, integration, accessibility tests
8. Deploy: Page routing, navigation integration

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-10 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Epic 1-2 are sequential (foundation → state)
- Epic 3 (Core UI) depends on Epic 2
- Epic 4 (Multi-Scenario) depends on Epic 3
- Epic 5 (Visualizations) can parallelize with Epic 4
- Epic 6 (Polish) depends on Epics 3-5
- Epic 7 (Testing) spans all epics
- Epic 8 (Deploy) requires Epics 3-6

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Calculations

**Objective**: Create type definitions, constants, and pure calculation functions.

**Duration**: 6-8 hours

**Dependencies**: FI Number Calculator (Epic 1-2), Expense Baseline Tool (Epic 1-2)

**Deliverables**:
- TypeScript type definitions
- Barista FIRE constants
- Pure calculation functions (gap, timeline, life energy)
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for Barista FIRE.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/baristaFire.ts` (new)

**Functionality**:
```typescript
// Define types for:
- BaristaFireState (currentSavings, selectedTier, investmentReturnRate, scenarios, currentAge)
- BaristaFireScenario (id, name, grossAnnualIncome, netAnnualIncome, workHoursPerWeek, order)
- BaristaFireResults (fiNumber, gap, isCoastFIRE, scenarioResults, coastFIRETimeline)
- BaristaFireScenarioResult (income, savings, timeline, lifeEnergy, accelerationFactor)
- TimelineProjection (yearsToFI, monthsToFI, dataPoints)
- TimelineDataPoint (year, month, age, savings, additionalSavings, investmentGrowth)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-2, FR-3 (foundational)

**Acceptance Criteria**:
- [x] All types exported from single file ✅ Completed 2026-01-29
- [x] JSDoc comments for each interface ✅ Completed 2026-01-29
- [x] Consistent with existing calculator types ✅ Completed 2026-01-29
- [x] No TypeScript errors ✅ Completed 2026-01-29

**Implemented**:
- File: apps/peninganaedalifid/src/types/baristaFire.ts (216 lines)
- Context: context/modules/BaristaFireTypes.md
- Status: Complete
- Verified: TypeScript compilation successful

---

#### Task 1.2: Create Constants Configuration

**Objective**: Define Barista FIRE constants and defaults.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/constants/baristaFire.ts` (new)

**Functionality**:
```typescript
// Define constants:
- BARISTA_FIRE_DEFAULTS:
  - investmentReturnRate: 0.05 (5%)
  - pensionContributionRate: 0.16 (16%)
  - employerPensionRate: 0.12 (12%)
  - employeePensionRate: 0.04 (4%)
  - fullTimeHoursPerWeek: 40
- SCENARIO_PRESETS: [
  { name: '20 klst/viku', hoursPerWeek: 20 },
  { name: '30 klst/viku', hoursPerWeek: 30 },
  { name: 'Ráðgjöf/Freelance', hoursPerWeek: 25 },
]
- MAX_SCENARIOS: 5
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-4.2, FR-4.3, NFR-5

**Acceptance Criteria**:
- [x] All constants defined with Icelandic context ✅ Completed 2026-01-29
- [x] Pension rate matches Iceland (16%) ✅ Completed 2026-01-29
- [x] Scenario presets in Icelandic ✅ Completed 2026-01-29
- [x] Exportable for use in calculations and UI ✅ Completed 2026-01-29

**Implemented**:
- File: apps/peninganaedalifid/src/lib/constants/baristaFire.ts (483 lines)
- Context: context/modules/BaristaFireConstants.md
- Status: Complete
- Verification: TypeScript compilation successful, all exports available

---

#### Task 1.3: Implement Core Calculation Functions

**Objective**: Create pure functions for gap, timeline, life energy, and pension calculations.

**Duration**: 4 hours

**Files to Create/Modify**:
- `/src/lib/calculations/baristaFire.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateGap(currentSavings, fiNumber): number
- isCoastFIRE(currentSavings, fiNumber): boolean
- calculateMinimumAnnualIncome(annualExpenses): number
- calculateNetIncome(grossIncome): number (after 16% pension)
- calculateRequiredGrossIncome(targetNetIncome): number
- calculateTimelineToFI(currentSavings, fiNumber, netAnnualIncome, annualExpenses, returnRate): TimelineProjection
- calculateCoastFIRETimeline(currentSavings, fiNumber, returnRate): TimelineProjection
- calculateScenarioLifeEnergy(netAnnualIncome, actualHourlyWage, yearsToFI): LifeEnergy
- calculateAccelerationFactor(scenarioYears, coastYears): number
- compareToCoastFIRE(accelerationFactor): string
- calculateBaristaFireResults(state, fiNumber, annualExpenses, actualHourlyWage, currentAge): BaristaFireResults
```

**Tests**:
- `/tests/lib/calculations/baristaFire.test.ts` (new)
  - Test gap calculation (positive gap, Coast FIRE)
  - Test net income after pension (16% deduction)
  - Test timeline projection (with savings, Coast FIRE only)
  - Test life energy calculations
  - Test acceleration factor
  - Edge cases: zero/negative values, infinity scenarios

**Requirements Addressed**: FR-1.1-1.5, FR-2.3, FR-3.1-3.4, FR-6.2-6.3

**Acceptance Criteria**:
- [x] All calculation functions implemented ✅ Completed 2026-01-29
- [x] Pure functions (no side effects) ✅ Completed 2026-01-29
- [x] Monthly precision for timeline calculations ✅ Completed 2026-01-29
- [x] Handles edge cases (unsustainable scenarios, Coast FIRE) ✅ Completed 2026-01-29
- [ ] Unit tests pass with >90% coverage (Pending - to be completed in Epic 7)

**Implemented**:
- File: apps/peninganaedalifid/src/lib/calculations/baristaFire.ts (570 lines)
- Exports: apps/peninganaedalifid/src/lib/calculations/index.ts (updated)
- Context: context/modules/BaristaFireCalculations.md
- Status: Complete (tests pending)
- Verification: All functions implemented with comprehensive edge case handling

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage Barista FIRE state with persistence.

**Duration**: 4-5 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for Barista FIRE
- CRUD operations for scenarios
- LocalStorage persistence
- API methods for other calculators

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add Barista FIRE state and results to context.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add baristaFire to StoredState)

**Functionality**:
```typescript
// Add to context state:
- baristaFire: BaristaFireState | null
- baristaFireResults: BaristaFireResults | null

// Add to context type:
- updateBaristaFire: (state: Partial<BaristaFireState>) => void
- setCurrentSavings: (savings: number) => void
- setInvestmentReturnRate: (rate: number) => void
- setCurrentAge: (age: number | null) => void
- addScenario: (scenario: Omit<BaristaFireScenario, 'id' | 'order'>) => void
- updateScenario: (id: string, updates: Partial<BaristaFireScenario>) => void
- deleteScenario: (id: string) => void
- clearBaristaFire: () => void
- getGapAmount: () => number
- isCoastFIRE: () => boolean
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-8.1-8.2, US-1, US-2

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] Results auto-calculated on state change
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for Barista FIRE management.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateBaristaFire: Merge partial updates, recalculate results
- setCurrentSavings: Validate and set current savings
- setInvestmentReturnRate: Validate (0-15%) and set return rate
- setCurrentAge: Validate (18-100) and set age
- addScenario: Generate unique ID, calculate net income, add to array
- updateScenario: Update specific scenario, recalculate net income
- deleteScenario: Remove scenario by ID
- clearBaristaFire: Remove all Barista FIRE data
- getGapAmount: Return gap between savings and FI
- isCoastFIRE: Return true if gap <= 0
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-2.1, FR-2.2, US-3

**Acceptance Criteria**:
- [ ] All actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Auto-recalculate results after each action
- [ ] Scenario ID generation unique
- [ ] Net income calculated on scenario add/update (gross × 0.84)

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load Barista FIRE state from localStorage.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load baristaFire on mount
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-8.1-8.5, NFR-4

**Acceptance Criteria**:
- [ ] Loads state on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Cleared on reset

---

### EPIC 3: Core UI - Current Savings and Gap Display

**Objective**: Create core UI for entering current savings and displaying gap to FI.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete, Expense Baseline Tool, FI Number Calculator

**Deliverables**:
- Main calculator component
- Current savings input section
- Gap summary card
- Single scenario input (foundation for multi-scenario)

---

#### Task 3.1: Create BaristaFireCalculator Main Component

**Objective**: Page-level container that orchestrates Barista FIRE calculation.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/BaristaFireCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Fetch state from CalculatorContext
- Check for expense baseline and FI number
- Show prompts if dependencies missing
- Coordinate child components
- Handle missing AWH gracefully
- Educational intro section
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-1, US-6

**Acceptance Criteria**:
- [ ] Renders all child components
- [ ] Checks for expense baseline
- [ ] Checks for FI number
- [ ] Shows prompts for missing dependencies
- [ ] Responsive layout

---

#### Task 3.2: Create CurrentSavingsInput Component

**Objective**: Input section for current savings, tier selection, and return rate.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/CurrentSavingsInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Current savings CurrencyInput
- Tier selector (if expense baseline exists) or custom expense input
- Investment return rate slider (1%-15%, default 5%)
- Current age input (optional)
- Real-time validation
- Integration with TierSelector component
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-1.5, FR-5.1-5.4, US-6

**Acceptance Criteria**:
- [ ] Current savings input with validation
- [ ] TierSelector embedded when baseline exists
- [ ] Custom expense input as fallback
- [ ] Return rate slider with default 5%
- [ ] Current age input (optional)
- [ ] All inputs have proper labels

---

#### Task 3.3: Create GapSummaryCard Component

**Objective**: Display gap between current savings and FI number.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/GapSummaryCard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display current savings
- Display FI number
- Display gap amount
- Coast FIRE status indicator (if gap <= 0)
- Explanation of Barista FIRE strategy
- Visual distinction (gap vs Coast FIRE)
- Icelandic formatting
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-1.1-1.3, US-1

**Acceptance Criteria**:
- [ ] Shows current savings, FI number, gap
- [ ] Different display for Coast FIRE vs gap
- [ ] Explanation text clear
- [ ] Visual hierarchy effective
- [ ] Responsive design

---

#### Task 3.4: Create ScenarioCard Component (Single)

**Objective**: Single scenario input and results display (foundation for multi-scenario).

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/ScenarioCard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Scenario name input
- Gross annual income input (or monthly × 12)
- Net income display (after 16% pension)
- Work hours per week (optional, converts to income if AWH available)
- Gap period display (years + months)
- Projected FI age (if current age provided)
- Life energy display (if AWH available)
- Edit/view mode toggle
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-2.1-2.3, FR-3.1-3.2, FR-6.2, US-1, US-2

**Acceptance Criteria**:
- [ ] Name and income inputs
- [ ] Net income calculated (gross × 0.84)
- [ ] Work hours optional
- [ ] Gap period displayed
- [ ] Life energy shown if AWH available
- [ ] Edit mode functional

---

### EPIC 4: Multi-Scenario Support

**Objective**: Enable multiple scenarios with comparison capability.

**Duration**: 5-7 hours

**Dependencies**: Epic 3 complete

**Deliverables**:
- Scenario builder (add/edit/delete multiple scenarios)
- Scenario comparison table
- Acceleration factor calculations
- Coast FIRE baseline display

---

#### Task 4.1: Create ScenarioBuilder Component

**Objective**: Container for managing multiple scenarios.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/ScenarioBuilder.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of scenario cards
- Add scenario button (max 5 scenarios)
- Delete scenario confirmation
- Scenario presets dropdown (20h/week, 30h/week, consulting)
- Order management (drag to reorder, optional)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-2.1, US-3

**Acceptance Criteria**:
- [ ] Multiple ScenarioCard components rendered
- [ ] Add button creates new scenario
- [ ] Delete button removes scenario
- [ ] Max 5 scenarios enforced
- [ ] Preset scenarios available

---

#### Task 4.2: Update ScenarioCard for Multi-Scenario

**Objective**: Enhance ScenarioCard with delete button and comparison context.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/baristaFire/ScenarioCard.tsx` (modify)

**Functionality**:
```typescript
// Add features:
- Delete button (with confirmation)
- Show acceleration factor vs Coast FIRE
- Highlight if faster/slower/same as Coast FIRE
- Scenario order indicator
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-2.5, FR-8.4

**Acceptance Criteria**:
- [ ] Delete button functional
- [ ] Confirmation dialog shown
- [ ] Acceleration factor displayed
- [ ] Visual indication of comparison to Coast FIRE

---

#### Task 4.3: Create ScenarioComparisonTable Component

**Objective**: Side-by-side comparison table of all scenarios.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/ScenarioComparisonTable.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Table with columns: Name, Gross Income, Work Hours, Gap Period, Life Energy
- Coast FIRE baseline row (highlighted)
- Best scenario indicator (shortest gap period)
- Acceleration factor per scenario
- Responsive (horizontal scroll on mobile, or stack cards)
- Sort by gap period
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-3.5, US-3, US-4

**Acceptance Criteria**:
- [ ] All scenarios in table
- [ ] Coast FIRE row included as baseline
- [ ] Best scenario highlighted
- [ ] Acceleration factors shown
- [ ] Responsive table

---

#### Task 4.4: Implement Coast FIRE Baseline Calculation

**Objective**: Always calculate Coast FIRE timeline as comparison baseline.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/calculations/baristaFire.ts` (modify)

**Functionality**:
```typescript
// Add to calculateBaristaFireResults:
- Calculate Coast FIRE timeline (income = expenses, no savings)
- Include in results as coastFIRETimeline
- Use for acceleration factor calculations
```

**Tests**: Unit tests in Task 7.1

**Requirements Addressed**: FR-2.5, FR-3.5

**Acceptance Criteria**:
- [ ] Coast FIRE timeline calculated
- [ ] Included in results
- [ ] Used for comparisons
- [ ] Highlighted in comparison table

---

### EPIC 5: Visualizations

**Objective**: Add timeline chart and comparison visualizations.

**Duration**: 5-6 hours

**Dependencies**: Epic 4 complete

**Deliverables**:
- Timeline chart showing savings growth to FI
- Comparison bar chart for scenarios
- Interactive chart features

---

#### Task 5.1: Create TimelineVisualization Component

**Objective**: Chart showing savings growth over time to full FI.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/TimelineVisualization.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Line chart showing savings over time
- Current savings marker
- FI number target line
- Gap period shaded
- Scenario selector dropdown
- Age progression on x-axis (if current age provided)
- Investment growth visible
- Uses recharts library
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-7.1, FR-7.3

**Acceptance Criteria**:
- [ ] Line chart renders correctly
- [ ] Current savings and FI marked
- [ ] Gap period visually clear
- [ ] Scenario selector works
- [ ] Responsive sizing

---

#### Task 5.2: Create ScenarioComparisonChart Component

**Objective**: Bar chart comparing gap periods across scenarios.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/ScenarioComparisonChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Horizontal bar chart
- Bars for each scenario (gap period in years)
- Coast FIRE baseline marked
- Color-coded bars (faster/slower than Coast)
- Interactive tooltips
- Uses recharts library
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-7.2, FR-7.5

**Acceptance Criteria**:
- [ ] Bar chart renders correctly
- [ ] All scenarios shown
- [ ] Coast FIRE baseline visible
- [ ] Color coding meaningful
- [ ] Responsive sizing

---

#### Task 5.3: Add Chart Accessibility

**Objective**: Ensure charts have text alternatives and ARIA attributes.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/baristaFire/TimelineVisualization.tsx` (modify)
- `/src/components/baristaFire/ScenarioComparisonChart.tsx` (modify)

**Functionality**:
```typescript
// Add accessibility:
- ARIA labels for charts
- Text alternative summaries
- Keyboard navigation for scenario selector
- Screen reader announcements
```

**Tests**: Accessibility tests in Task 7.4

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [ ] Charts have ARIA labels
- [ ] Text alternatives provided
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

### EPIC 6: Polish - Icelandic Context and Educational Content

**Objective**: Add Icelandic-specific context, educational content, and final polish.

**Duration**: 4-5 hours

**Dependencies**: Epics 3-5 complete

**Deliverables**:
- Icelandic context panel (healthcare, pension, work culture)
- Educational panel (What is Barista FIRE, Coast FIRE, etc.)
- Input validation UI
- Final UI polish

---

#### Task 6.1: Create IcelandicContextPanel Component

**Objective**: Explain Icelandic-specific considerations.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/IcelandicContextPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible panel
- Section 1: Universal Healthcare
  - Explanation of Sjúkratryggingar Íslands
  - Note that it's NOT tied to employment
  - Comparison to US (where Barista FIRE often focuses on health insurance)
- Section 2: Lífeyrissjóður (Pension)
  - 16% breakdown (12% employer + 4% employee)
  - Continues in part-time work
  - Builds pension benefits
  - All income shown as NET after pension
- Section 3: Work Culture
  - Part-time less common but growing
  - Freelance/consulting more flexible
  - "Hlutastarf" typically 50-80%
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-4.1-4.5, US-4

**Acceptance Criteria**:
- [ ] Three clear sections
- [ ] Healthcare explained
- [ ] Pension breakdown shown
- [ ] Work culture context provided
- [ ] Collapsible/expandable
- [ ] All text in Icelandic

---

#### Task 6.2: Create EducationalPanel Component

**Objective**: Educational content about Barista FIRE and Coast FIRE.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/EducationalPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible sections:
  1. Hvað er Barista FIRE? (What is Barista FIRE?)
  2. Hvað er Coast FIRE? (What is Coast FIRE?)
  3. Bil Tímabil Stefna (Gap Period Strategy)
  4. Algengar Spurningar (FAQ)
- Expandable/collapsible
- Links to external resources (optional)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-7.1-7.5 (educational)

**Acceptance Criteria**:
- [ ] Four main sections
- [ ] Clear explanations in Icelandic
- [ ] Collapsible/expandable
- [ ] Examples provided

---

#### Task 6.3: Implement Input Validation UI

**Objective**: Add validation feedback to all inputs.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/baristaFire/CurrentSavingsInput.tsx` (modify)
- `/src/components/baristaFire/ScenarioCard.tsx` (modify)

**Functionality**:
```typescript
// Add validation UI:
- Error messages for invalid inputs
- Warning messages for questionable inputs (e.g., very low income)
- Real-time validation feedback
- Clear error styling
- Icelandic error messages
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: NFR-2

**Acceptance Criteria**:
- [ ] All inputs show validation feedback
- [ ] Errors clear and actionable
- [ ] Warnings non-blocking
- [ ] Icelandic error messages

---

#### Task 6.4: Final UI Polish

**Objective**: Visual polish and refinements.

**Duration**: 1 hour

**Files to Create/Modify**:
- All Barista FIRE components (minor adjustments)

**Functionality**:
- Consistent spacing and alignment
- Color coding refinements
- Icon additions
- Loading states
- Empty states
- Responsive adjustments

**Tests**: Manual visual testing

**Requirements Addressed**: NFR-2

**Acceptance Criteria**:
- [ ] Consistent visual design
- [ ] Proper spacing and alignment
- [ ] Icons meaningful
- [ ] Loading states shown
- [ ] Empty states handled

---

### EPIC 7: Testing and Quality Assurance

**Objective**: Comprehensive testing and quality assurance.

**Duration**: 6-8 hours

**Dependencies**: Epics 1-6 complete

**Deliverables**:
- Unit tests for calculations
- Component tests
- Integration tests
- Accessibility audit

---

#### Task 7.1: Unit Tests for Calculations

**Objective**: Comprehensive unit tests for calculation functions.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/tests/lib/calculations/baristaFire.test.ts` (new)

**Tests**:
- calculateGap with various inputs (positive gap, Coast FIRE)
- calculateNetIncome pension deduction (16%)
- calculateTimelineToFI with positive savings
- calculateTimelineToFI with Coast FIRE (income = expenses)
- calculateCoastFIRETimeline accuracy
- calculateScenarioLifeEnergy work hours
- calculateAccelerationFactor comparisons
- Edge cases: zero values, negative values, unsustainable scenarios, infinity

**Requirements Addressed**: All calculation requirements

**Acceptance Criteria**:
- [ ] All calculation functions tested
- [ ] Edge cases covered
- [ ] >90% coverage for calculation module

---

#### Task 7.2: Component Tests

**Objective**: Testing React components with React Testing Library.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/tests/components/baristaFire/*.test.tsx` (new)

**Tests**:
- BaristaFireCalculator rendering and dependency checks
- CurrentSavingsInput validation
- GapSummaryCard display (gap vs Coast FIRE)
- ScenarioCard income calculations
- ScenarioBuilder add/delete scenarios
- ScenarioComparisonTable sorting and highlighting
- IcelandicContextPanel collapsible sections
- EducationalPanel collapsible sections

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [ ] Key components tested
- [ ] User interactions covered
- [ ] Validation tested

---

#### Task 7.3: Integration Tests

**Objective**: Test integration with CalculatorContext and other calculators.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/integration/baristaFire.test.tsx` (new)

**Tests**:
- Context state updates correctly
- LocalStorage persistence works
- Export/import includes Barista FIRE
- Integration with expense baseline
- Integration with FI number calculator
- Integration with AWH calculator
- API methods return correct values

**Requirements Addressed**: All integration requirements

**Acceptance Criteria**:
- [ ] Context integration tested
- [ ] Persistence verified
- [ ] Cross-calculator integration works

---

#### Task 7.4: Accessibility Audit

**Objective**: Verify WCAG 2.1 AA compliance.

**Duration**: 1.5 hours

**Checklist**:
- [ ] All inputs have labels
- [ ] ARIA attributes correct
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Charts have text alternatives
- [ ] Form validation accessible

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [ ] No accessibility violations in axe
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly

---

### EPIC 8: Main Page and Routing

**Objective**: Create the main page component and integrate into app navigation.

**Duration**: 2-3 hours

**Dependencies**: Epics 3-6 complete

**Deliverables**:
- Main calculator page component
- Route page
- Navigation integration

---

#### Task 8.1: Create Route Page

**Objective**: Next.js page component for the Barista FIRE planner route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/barista-fire/page.tsx` (new)

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary
- BaristaFireCalculator component
- Metadata for SEO
- Hero section
```

**Tests**: N/A (covered by integration tests)

**Requirements Addressed**: N/A (routing)

**Acceptance Criteria**:
- [ ] Route works at /barista-fire
- [ ] Wrapped in CalculatorProvider
- [ ] Loading fallback shown
- [ ] SEO metadata set

---

#### Task 8.2: Add to Calculator Navigation

**Objective**: Add Barista FIRE to FIRE Planning section navigation.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to FIRE_PLANNING_CALCULATORS array:
- Add Barista FIRE Planner (after FI Number Builder)
// Add routing:
- Conditional rendering for Barista FIRE
```

**Tests**: N/A (manual testing)

**Requirements Addressed**: Constraint - must be in FIRE Planning section

**Acceptance Criteria**:
- [ ] Appears in FIRE Planning tab
- [ ] Icon and description correct
- [ ] Navigation works
- [ ] Second in FIRE Planning section (after FI Number)

---

#### Task 8.3: Create Component Barrel Export

**Objective**: Export all Barista FIRE components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/baristaFire/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { BaristaFireCalculator } from './BaristaFireCalculator';
// Export types:
export type { BaristaFireState, BaristaFireResults } from '@/types/baristaFire';
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [ ] All public components exported
- [ ] No circular dependencies
- [ ] Clean import paths

---

## 3. Implementation Schedule

### Phase 1: Foundation (Days 1-2)
- Epic 1: Types, constants, calculations (Day 1)
- Epic 2: CalculatorContext integration (Day 2)

### Phase 2: Core UI (Days 3-4)
- Epic 3: Current savings and gap display (Days 3-4)

### Phase 3: Enhancements (Days 5-7)
- Epic 4: Multi-scenario support (Day 5)
- Epic 5: Visualizations (Day 6, can parallelize with Epic 4)
- Epic 6: Polish and context (Day 7)

### Phase 4: Testing & Deploy (Days 8-9)
- Epic 7: Testing and QA (Day 8)
- Epic 8: Main page and routing (Day 9)
- Final review and adjustments

**Total Duration**: 9-11 days (assuming 6-8 productive hours per day)

---

## 4. Risk Mitigation

### Risk 1: Missing FI Number or Expense Baseline
**Mitigation**: Graceful prompts, links to setup, custom expense fallback.

### Risk 2: Unsustainable Scenarios (Income < Expenses)
**Mitigation**: Validate and warn, show timeline as "infinity", explain need for income ≥ expenses.

### Risk 3: Timeline Calculation Performance
**Mitigation**: Limit to 5 scenarios, memoize calculations, monthly precision only.

### Risk 4: Chart Rendering on Mobile
**Mitigation**: Reduce data points for mobile, lightweight charting library (recharts), text fallback.

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
   ↓
Epic 4 (Multi-Scenario) ─────┐
   │                         │
Epic 5 (Visualizations) ─────┤
   │                         │
Epic 6 (Polish) ─────────────┤
                             ↓
                        Epic 7 (Testing)
                             ↓
                        Epic 8 (Page & Routing)
```

**Parallel Opportunities**:
- Epic 5 can start after Epic 4 Task 4.1 (doesn't need comparison table)
- Epic 6 Tasks 6.1-6.2 can parallelize with Epic 5

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
- Coverage: All interactive elements, charts
- Tools: axe, keyboard testing, screen reader testing

---

## 8. Implementation Notes

### Parallel Work Opportunities

**After Epic 3 complete, these can be parallelized:**
- Epic 4 (Multi-Scenario): Depends on ScenarioCard foundation
- Epic 5 (Visualizations): Can start after Epic 4 Task 4.1
- Epic 6 (Polish): Independent educational content can start early

**Team of 2-3 developers:**
- Developer 1: Epics 1-3 (Foundation + Core UI)
- Developer 2: Epics 4-5 (Multi-Scenario + Visualizations) [starts after Epic 3]
- Developer 3: Epic 6 (Polish + Context) [starts after Epic 3]
- All: Epic 7 (Testing), Epic 8 (Integration)

### Critical Path
1. Epic 1 (Foundation)
2. Epic 2 (State)
3. Epic 3 (Core UI)
4. Epic 4 (Multi-Scenario)
5. Epic 7 (Testing)
6. Epic 8 (Deploy)

**Epics 5-6 extend timeline but don't block basic functionality.**

---

## 9. Success Metrics

### Functionality
- [ ] Gap calculation accurate for all scenarios
- [ ] Timeline projections correct (monthly precision)
- [ ] Pension deduction (16%) applied correctly
- [ ] Coast FIRE baseline calculated
- [ ] Life energy displayed when AWH available
- [ ] Multiple scenarios comparable side-by-side

### Performance
- [ ] Calculations complete in <100ms (even with 5 scenarios)
- [ ] Timeline chart renders in <200ms
- [ ] Scenario input updates in <50ms
- [ ] Page loads in <2 seconds

### Quality
- [ ] All tests pass (>90% coverage)
- [ ] No accessibility violations
- [ ] No console errors
- [ ] Works on mobile, tablet, desktop
- [ ] Icelandic text throughout

### User Experience
- [ ] Can set up Barista FIRE plan in <5 minutes
- [ ] Clear understanding of gap period
- [ ] Icelandic context (healthcare, pension) clearly explained
- [ ] Scenarios easy to add and compare
- [ ] Visual timeline helps planning

---

## 10. Example User Flows

### Flow 1: First-Time User (Has Expense Baseline and FI Number)

1. Navigate to /barista-fire
2. See current savings input (prefilled from context if available)
3. Select expense tier from baseline (Comfortable)
4. See gap summary: "You need 5,600,000 kr to reach FI"
5. Add scenario: "20 hours/week"
   - Enter gross income: 3,600,000 kr/year
   - See net income: 3,024,000 kr/year (after 16% pension)
   - See gap period: 7 years 3 months
   - See work hours: 20 hours/week (if AWH available)
6. Add second scenario: "Consulting"
   - Enter gross income: 4,800,000 kr/year
   - See faster timeline: 5 years 1 month
7. Compare scenarios side-by-side in table
8. View timeline chart showing path to FI
9. Read Icelandic context panel (healthcare, pension)
10. Save and exit

### Flow 2: User at Coast FIRE

1. Navigate to /barista-fire
2. Enter current savings: 16,000,000 kr
3. Select tier: Comfortable (FI number: 15,600,000 kr)
4. See Coast FIRE status: "You've reached Coast FIRE!"
5. Explanation: "Your savings will grow to full FI without additional contributions. You only need to cover expenses with part-time income."
6. Add scenario matching expenses: 6,240,000 kr/year gross
7. See timeline: 8 years 7 months (only growth, no savings)
8. Compare to accelerated scenario with higher income

### Flow 3: Missing Dependencies

1. Navigate to /barista-fire
2. No expense baseline set up
3. See prompt: "Barista FIRE needs your expense baseline"
4. Click link to expense baseline tool
5. Return after setting up baseline
6. Continue with Barista FIRE planning

---

**Tasks Phase Complete: Ready for Implementation**
