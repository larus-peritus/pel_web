# Implementation Tasks: Savings Rate Slider

## Document Information

- **Feature Name**: Savings Rate Slider
- **Version**: 1.0
- **Date**: 2026-01-22
- **App**: peninganaedalifid.is (Icelandic FIRE Calculator)
- **Feature ID**: 2.2.1
- **Requirements Document**: [requirements.md](requirements.md)
- **Design Document**: [design.md](design.md)

## Overview

The Savings Rate Slider feature enables users to interactively explore how their savings rate impacts their path to financial independence. By adjusting a slider, users immediately see changes in their FI date, understand marginal impacts of each percentage point, and relate abstract savings rates to concrete life energy (work-hours saved).

This feature builds on the foundation of the Actual Hourly Wage Calculator and introduces new concepts (FI planning, scenarios, progress tracking) that will support future FIRE planning features.

## Implementation Strategy

**Strategy**: Hybrid (Foundation-First + Feature Slices)

**Rationale**:
1. **Foundation First**: Build calculation engine and types (Epic 1-2)
2. **Feature Slices**: Implement UI components incrementally, each delivering working functionality
3. **Progressive Enhancement**: Start with core slider functionality, then add visualizations, scenarios, and progress tracking
4. **Parallel Work**: Some UI components can be built while integrations complete

**Estimated Total Time**: 28-34 hours

## Task Hierarchy

### Epic 1: Foundation - Types, Constants, and Calculation Engine
**Goal**: Establish data models and core FI calculation logic
**Time**: 6-8 hours
**Tasks**: 4

### Epic 2: State Management and Context Integration
**Goal**: Integrate FI calculator into CalculatorContext with persistence
**Time**: 5-6 hours
**Tasks**: 4

### Epic 3: Core Slider and Results Display
**Goal**: Build primary user interface for savings rate exploration
**Time**: 6-8 hours
**Tasks**: 4

### Epic 4: Visualization and Scenarios
**Goal**: Add FI curve chart and scenario comparison
**Time**: 6-7 hours
**Tasks**: 3

### Epic 5: Progress Tracking and Polish
**Goal**: Add optional progress tracking and finalize feature
**Time**: 5-6 hours
**Tasks**: 4

---

## Epic 1: Foundation - Types, Constants, and Calculation Engine

**Objective**: Build solid foundation with TypeScript types, constants, and core calculation functions

**Dependencies**: None (starting point)

**Completion Criteria**: All types defined, calculations accurate, unit tests passing

---

### Task 1.1: Define TypeScript Types and Interfaces

**Objective**: Create all TypeScript type definitions for FI calculations, scenarios, and snapshots.

**Files to Create/Modify**:
- `src/types/calculator.ts` (MODIFY - extend existing)

**Functionality**:
1. Add `FIInputs` interface:
   - fiNumber, annualIncome, annualExpenses, currentNetWorth
   - expectedReturnRate, fiMultiplier, currentSavingsRate

2. Add `FIResults` interface:
   - yearsToFI, fiDate, monthsToFI
   - impactPer1Percent, impactPer5Percent, impactPer10Percent (each with months, years, workHours)
   - totalWorkHoursToFI, totalWorkDaysToFI, totalWorkYearsToFI
   - currentProgress, monthlyInvestment, annualInvestment
   - changeFromBaseline (optional)

3. Add `FIScenario` interface:
   - id, name, inputs, results, savingsRate, isBaseline
   - createdAt, updatedAt

4. Add `FISnapshot` interface:
   - id, timestamp, savingsRate, fiDate, yearsToFI, currentNetWorth, notes

5. Add `FICurveDataPoint` interface:
   - savingsRate, yearsToFI, monthsToFI, isCurrent, isReference

6. Add `WhatIfScenario` interface:
   - type, label, adjustment, result, isActive

7. Update `CalculatorState` interface:
   - Add fiInputs, fiResults, scenarios, baselineScenarioId, snapshots, whatIfScenario

**Acceptance Criteria**:
- [ ] All FI-related types defined with JSDoc comments
- [ ] Types export correctly from calculator.ts
- [ ] No TypeScript errors in type definitions
- [ ] All fields have appropriate types (no `any`)
- [ ] Interfaces align with design document data models

**Tests**:
- TypeScript compilation passes (`npm run type-check`)

**Requirements Traceability**: US-1, US-2, US-3, US-5, US-7

**Estimated Time**: 1.5 hours

---

### Task 1.2: Create FI Constants and Presets

**Objective**: Define all constants, limits, and Icelandic-specific presets for FI calculations.

**Files to Create**:
- `src/lib/constants/fi.ts` (NEW)
- `src/lib/constants/icelandic.ts` (NEW - for UI strings)

**Functionality**:
1. Create `fi.ts` with:
   - `DEFAULT_FI_INPUTS`: Default values for FI inputs
   - `FI_CONSTANTS`: Min/max values for inputs, work hours constants
   - `ICELANDIC_MONTHS`: Array of Icelandic month names
   - `QUICK_WHAT_IF_PRESETS`: Predefined "what if" scenarios

2. Create `icelandic.ts` with:
   - `FI_STRINGS`: All Icelandic UI text strings
   - Organized by section: inputs, results, scenarios, messages

**Acceptance Criteria**:
- [ ] Default inputs use realistic Icelandic values
- [ ] All limits defined with appropriate ISK amounts
- [ ] Icelandic month names correctly spelled
- [ ] What-if presets use Icelandic labels
- [ ] All constants properly typed and exported
- [ ] UI strings comprehensive and grammatically correct

**Tests**:
- Import constants in test file and verify values
- Type checking passes

**Requirements Traceability**: US-1, US-6, NFR (Usability - Icelandic)

**Estimated Time**: 1.5 hours

---

### Task 1.3: Implement Core FI Calculation Functions

**Objective**: Build all FI calculation logic with compound interest formulas.

**Files to Create**:
- `src/lib/calculations/fi.ts` (NEW)
- `src/lib/calculations/__tests__/fi.test.ts` (NEW)

**Functionality**:
1. `calculateYearsToFI(fiNumber, annualSavings, currentNetWorth, returnRate): number`
   - Implements logarithmic FI formula
   - Handles edge cases: zero savings, already at FI, negative savings
   - Returns Infinity for impossible scenarios

2. `calculateFIDate(yearsToFI: number): Date`
   - Converts years to future date
   - Handles Infinity case

3. `calculateSavingsRate(annualIncome, annualExpenses): number`
   - Returns percentage (0-100)
   - Clamps to valid range

4. `calculateAnnualSavings(annualIncome, savingsRate): number`
   - Converts rate to ISK amount

5. `calculateFINumber(annualExpenses, fiMultiplier): number`
   - Calculates target nest egg

6. `calculateMarginalImpact(inputs, currentYearsToFI, savingsRateChange, actualHourlyWage?)`
   - Returns {months, years, workHours}
   - Calculates impact of +X% savings rate change

7. `calculateFIResults(inputs, actualHourlyWage?, baselineResults?): FIResults`
   - Main calculation function
   - Calls all helper functions
   - Returns complete FIResults object

8. `generateFICurveData(inputs, currentSavingsRate, step = 5): FICurveDataPoint[]`
   - Generates curve data for visualization
   - Marks current position and reference points

**Acceptance Criteria**:
- [ ] All calculations mathematically accurate (within 0.1%)
- [ ] Edge cases handled gracefully (no crashes)
- [ ] Zero interest rate handled correctly
- [ ] Already-at-FI case returns 0 years
- [ ] Negative/zero savings returns Infinity
- [ ] Life energy conversion correct when wage provided
- [ ] Life energy returns 0 when wage is 0
- [ ] Functions are pure (no side effects)

**Tests**:
- See Task 1.4 for comprehensive test suite

**Requirements Traceability**: US-1, US-2, US-3, US-4

**Estimated Time**: 3 hours

---

### Task 1.4: Write Calculation Unit Tests

**Objective**: Comprehensive unit tests for all calculation functions.

**Files to Create**:
- `src/lib/calculations/__tests__/fi.test.ts` (NEW)

**Functionality**:
- Test `calculateYearsToFI`:
  - Normal case with various inputs
  - Zero savings (returns Infinity)
  - Already at FI (returns 0)
  - Zero return rate (simple division)
  - Very long time horizons (>50 years)

- Test `calculateSavingsRate`:
  - Normal case
  - Zero income (returns 0)
  - Expenses exceed income (returns 0 or negative clamped to 0)

- Test `calculateMarginalImpact`:
  - +1%, +5%, +10% changes
  - With and without actualHourlyWage

- Test `calculateFIResults`:
  - Complete workflow with all fields
  - With baseline comparison
  - Without baseline comparison

- Test `generateFICurveData`:
  - Correct number of data points
  - Current position marked correctly
  - Reference points at 25%, 50%, 75%

**Acceptance Criteria**:
- [ ] All calculation tests pass
- [ ] Test coverage > 90% for fi.ts
- [ ] Edge cases covered (0 savings, 0 wage, very large values)
- [ ] Known financial scenarios verified (e.g., 50% savings rate = ~17 years to FI)

**Tests**:
- Run test suite: `npm test fi.test.ts`

**Requirements Traceability**: US-1, US-2, US-3

**Estimated Time**: 2 hours

---

## Epic 2: State Management and Context Integration

**Objective**: Integrate FI calculator into CalculatorContext with localStorage persistence

**Dependencies**: Epic 1 complete

**Completion Criteria**: FI state managed in context, persists in localStorage, auto-recalculation works

---

### Task 2.1: Extend CalculatorContext with FI State

**Objective**: Add FI-specific state and methods to CalculatorContext.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
1. Add state variables:
   - `fiInputs: FIInputs`
   - `fiResults: FIResults | null`
   - `scenarios: FIScenario[]`
   - `baselineScenarioId: string | null`
   - `snapshots: FISnapshot[]`
   - `whatIfScenario: WhatIfScenario | null`

2. Add method signatures to `CalculatorContextType`:
   - `setFIInputs(inputs: FIInputs): void`
   - `updateFIInputs(partial: Partial<FIInputs>): void`
   - `addScenario(name: string): void`
   - `updateScenario(id: string, updates: Partial<FIScenario>): void`
   - `deleteScenario(id: string): void`
   - `loadScenario(id: string): void`
   - `setBaseline(id: string): void`
   - `addSnapshot(notes?: string): void`
   - `deleteSnapshot(id: string): void`
   - `clearSnapshots(): void`
   - `applyWhatIf(scenario: WhatIfScenario): void`
   - `acceptWhatIf(): void`
   - `cancelWhatIf(): void`

3. Initialize state with defaults from constants

**Acceptance Criteria**:
- [ ] All FI state initialized
- [ ] Context type includes all FI methods
- [ ] No TypeScript errors
- [ ] Context compiles without breaking existing functionality
- [ ] Existing calculator features still work

**Tests**:
- Existing context tests still pass
- Type checking passes

**Requirements Traceability**: US-1, US-5, US-7

**Estimated Time**: 1.5 hours

---

### Task 2.2: Implement Scenario Management

**Objective**: Implement CRUD operations for FI scenarios.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Files to Create**:
- `src/lib/calculations/scenarios.ts` (NEW - helper functions)
- `src/lib/calculations/__tests__/scenarios.test.ts` (NEW)

**Functionality**:
1. Create `scenarios.ts` helpers:
   - `createScenario(name, inputs, results, isBaseline): FIScenario`
   - `compareScenarios(scenarios): FIScenarioComparison[]`
   - `findOptimalScenario(scenarios): FIScenario | null`

2. Implement context methods:
   - `addScenario`: Create new scenario from current inputs, enforce max 4 limit
   - `updateScenario`: Update scenario and recalculate results
   - `deleteScenario`: Remove scenario, handle baseline deletion
   - `loadScenario`: Load scenario inputs into current FI inputs
   - `setBaseline`: Mark scenario as baseline for comparisons

3. Add scenario limit validation (max 4 scenarios)

**Acceptance Criteria**:
- [ ] `addScenario` creates scenario with calculated results
- [ ] Maximum 4 scenarios enforced with Icelandic error message
- [ ] `updateScenario` recalculates results
- [ ] `deleteScenario` removes scenario
- [ ] `loadScenario` populates FI inputs
- [ ] `setBaseline` marks scenario and unmarks previous baseline
- [ ] Scenario IDs are unique (use uuid or timestamp-based)

**Tests**:
- Unit tests for scenario helpers
- Integration tests in Epic 5

**Requirements Traceability**: US-5

**Estimated Time**: 2 hours

---

### Task 2.3: Implement Progress Tracking (Snapshots)

**Objective**: Implement snapshot management for progress tracking over time.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Files to Create**:
- `src/lib/calculations/snapshots.ts` (NEW - helper functions)
- `src/lib/calculations/__tests__/snapshots.test.ts` (NEW)

**Functionality**:
1. Create `snapshots.ts` helpers:
   - `createSnapshot(savingsRate, fiDate, yearsToFI, currentNetWorth, notes?): FISnapshot`
   - `calculateProgressTrend(snapshots): 'improving' | 'stable' | 'declining' | 'insufficient-data'`
   - `calculateProgressMonths(snapshots): number` - Net improvement accounting for time passage

2. Implement context methods:
   - `addSnapshot`: Create snapshot from current FI results
   - `deleteSnapshot`: Remove specific snapshot
   - `clearSnapshots`: Remove all snapshots

3. Add derived property `progressTrend` to context (computed from snapshots)

**Acceptance Criteria**:
- [ ] `addSnapshot` creates timestamped snapshot
- [ ] Snapshots stored in chronological order
- [ ] `calculateProgressTrend` correctly identifies trends
- [ ] `calculateProgressMonths` accounts for time passage
- [ ] Maximum 100 snapshots enforced (auto-remove oldest)

**Tests**:
- Unit tests for snapshot helpers
- Test trend calculation with various scenarios
- Test progress calculation accounting for time

**Requirements Traceability**: US-7

**Estimated Time**: 1.5 hours

---

### Task 2.4: Add LocalStorage Persistence

**Objective**: Persist all FI data to localStorage with auto-save and restore.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
1. Extend `StoredState` interface:
   - Add `fiInputs?: FIInputs`
   - Add `scenarios?: FIScenario[]`
   - Add `snapshots?: FISnapshot[]`
   - Add `baselineScenarioId?: string`

2. Update load from localStorage:
   - Restore fiInputs, scenarios, snapshots, baselineScenarioId
   - Handle missing data (defaults)
   - Recalculate fiResults on load

3. Update auto-save useEffect:
   - Include all FI state in saved data
   - Debounce 500ms

4. Update export/import:
   - Include FI data in JSON export
   - Restore FI data from JSON import

5. Update resetAll:
   - Clear all FI state

**Acceptance Criteria**:
- [ ] FI inputs persist across page refreshes
- [ ] Scenarios persist across page refreshes
- [ ] Snapshots persist across page refreshes
- [ ] Baseline scenario ID persists
- [ ] Auto-save debounced (not on every keystroke)
- [ ] Export includes all FI data
- [ ] Import restores all FI data
- [ ] Reset clears all FI data

**Tests**:
- Manual testing: Enter data, refresh page, verify persistence
- Integration tests in Epic 5

**Requirements Traceability**: US-5, US-7, NFR (Privacy - localStorage only)

**Estimated Time**: 2 hours

---

## Epic 3: Core Slider and Results Display

**Objective**: Build primary user interface for savings rate exploration

**Dependencies**: Epic 1, 2 complete

**Completion Criteria**: Slider functional, results display correctly, real-time updates work

---

### Task 3.1: Create FI Inputs Section Component

**Objective**: Build input form for FI number, income, expenses, and optional advanced inputs.

**Files to Create**:
- `src/components/fi-calculator/FIInputsSection.tsx` (NEW)
- `src/components/fi-calculator/__tests__/FIInputsSection.test.tsx` (NEW)

**Functionality**:
1. Main inputs (always visible):
   - FI Number input (currency)
   - Annual Income input (currency)
   - Annual Expenses input (currency)

2. Advanced inputs (collapsible):
   - Current Net Worth input (currency, optional)
   - Expected Return Rate input (percentage, default 7%)
   - FI Multiplier input (number, default 25, for calculating FI Number)

3. Calculated FI Number display:
   - Show "FI Markmið = Útgjöld × Margföldun"
   - Update button to recalculate FI Number

4. Input validation:
   - All amounts must be > 0
   - Return rate 0-15%
   - FI multiplier 20-40
   - Display inline errors in Icelandic

5. Responsive layout:
   - 2-column grid on desktop
   - Stacked on mobile

**Acceptance Criteria**:
- [ ] All inputs render correctly
- [ ] Validation errors display inline
- [ ] Advanced inputs collapsible
- [ ] FI Number calculation shows formula
- [ ] Responsive layout works on mobile
- [ ] Keyboard accessible
- [ ] ARIA labels for screen readers

**Tests**:
- Component renders with default values
- Input changes trigger onChange
- Validation errors display correctly
- Advanced section toggles

**Requirements Traceability**: US-1, NFR (Usability - Icelandic)

**Estimated Time**: 2 hours

---

### Task 3.2: Create Savings Rate Slider Component

**Objective**: Build main slider control with dual display and quick adjust buttons.

**Files to Create**:
- `src/components/fi-calculator/SavingsRateSlider.tsx` (NEW)
- `src/components/fi-calculator/__tests__/SavingsRateSlider.test.tsx` (NEW)

**Functionality**:
1. Main slider input:
   - Range: 0-100%
   - Step: 1%
   - Large touch target (44px minimum height)
   - Debounced updates (100ms)

2. Numeric input (alternative entry):
   - Synced with slider
   - Percentage input
   - Validation (0-100)

3. Visual markers:
   - Current rate indicator (from calculated defaults)
   - Target rate indicator (if user sets one)
   - Reference lines at 25%, 50%, 75%

4. Quick adjust buttons:
   - +5%, +10%, +15% buttons
   - Reset to current button

5. Display:
   - Large current value display
   - "Núverandi: X%" vs "Markmið: Y% (+Z%)" comparison

**Acceptance Criteria**:
- [ ] Slider updates value smoothly
- [ ] Numeric input syncs with slider
- [ ] Quick adjust buttons work
- [ ] Current and target markers visible
- [ ] Debounced updates (not laggy but not instant)
- [ ] Touch-friendly on mobile (44px+ height)
- [ ] Keyboard accessible (arrow keys)
- [ ] ARIA labels and live region for screen readers

**Tests**:
- Slider value changes trigger onChange
- Numeric input changes trigger onChange
- Quick adjust buttons update value correctly
- Debouncing works (test with timer)

**Requirements Traceability**: US-1, US-2, NFR (Mobile responsive)

**Estimated Time**: 2.5 hours

---

### Task 3.3: Create FI Results Display Component

**Objective**: Display FI date, marginal impacts, and life energy in prominent cards.

**Files to Create**:
- `src/components/fi-calculator/FIResultsDisplay.tsx` (NEW)
- `src/components/fi-calculator/LifeEnergyDisplay.tsx` (NEW)
- `src/components/fi-calculator/MarginalImpactPanel.tsx` (NEW)
- `src/components/fi-calculator/__tests__/FIResultsDisplay.test.tsx` (NEW)

**Functionality**:
1. **FIResultsDisplay** (main component):
   - Large card showing FI date
   - Absolute date: "Ágúst 2035"
   - Relative time: "9 ár og 3 mánuðir"
   - Change from baseline indicator (if comparing scenarios)
   - Color coding: green (earlier), red (later)
   - Animated transitions on value change

2. **LifeEnergyDisplay**:
   - Total work-hours to FI
   - Display options: hours, work-days, work-years
   - Toggle between display modes
   - Show calculation basis: "Miðað við núverandi tímakaup: X kr/klst"
   - Handle missing wage gracefully

3. **MarginalImpactPanel**:
   - "Hver 1% sparar þér:" with months/hours
   - "+5% meiri sparnaður:" with years/months earlier
   - "+10% meiri sparnaður:" with years/months earlier
   - Custom impact calculator (enter any percentage)

4. Plain language summary:
   - "Með 5% meiri sparnaði sparar þú X vinnuár"

**Acceptance Criteria**:
- [ ] FI date displays correctly in Icelandic
- [ ] Relative time formatted correctly (X ár og Y mánuðir)
- [ ] Change indicator shows improvement/decline
- [ ] Life energy displays with correct units
- [ ] Marginal impacts calculated correctly
- [ ] Missing wage case handled (prompt to calculate)
- [ ] Responsive layout
- [ ] Animated transitions smooth

**Tests**:
- Results display with valid data
- Life energy toggle works
- Marginal impacts calculated correctly
- Missing wage case shows prompt
- Change indicator colors correct

**Requirements Traceability**: US-1, US-2, US-3

**Estimated Time**: 2.5 hours

---

### Task 3.4: Create Main Savings Rate Page Component

**Objective**: Main page component orchestrating all sub-components with real-time calculation.

**Files to Create**:
- `src/app/sparnadarhlutfall/page.tsx` (NEW)
- `src/components/fi-calculator/SavingsRateCalculator.tsx` (NEW - container component)

**Functionality**:
1. Layout structure (desktop):
   - Header with title and subtitle
   - Left column: FI Inputs Section
   - Center: Savings Rate Slider (full width)
   - Right column: FI Results Display
   - Bottom sections: Marginal Impact, Life Energy

2. Layout structure (mobile):
   - Stack vertically:
     1. FI Results (prominent)
     2. Savings Rate Slider
     3. Marginal Impact summary
     4. FI Inputs (collapsible)
     5. Advanced sections

3. State management:
   - Consume CalculatorContext for fiInputs, fiResults, actualHourlyWage
   - Local state for current slider value
   - Real-time calculation using useMemo
   - Update context on input changes

4. Real-time calculation hook:
   ```typescript
   const fiResults = useMemo(() => {
     return calculateFIResults(fiInputs, actualHourlyWage);
   }, [fiInputs, actualHourlyWage]);
   ```

5. Missing wage prompt:
   - Show alert if actualHourlyWage === 0
   - Link to Actual Hourly Wage calculator

**Acceptance Criteria**:
- [ ] All sub-components render
- [ ] Real-time calculation on input change
- [ ] Layout responsive (desktop and mobile)
- [ ] Missing wage prompt shows when appropriate
- [ ] Context updates persist
- [ ] No performance issues (calculations < 100ms)

**Tests**:
- Page renders with all components
- Input changes trigger recalculation
- Context integration works
- Mobile layout correct

**Requirements Traceability**: ALL primary user stories (US-1 through US-4)

**Estimated Time**: 2 hours

---

## Epic 4: Visualization and Scenarios

**Objective**: Add FI curve visualization and scenario comparison

**Dependencies**: Epic 3 complete

**Completion Criteria**: Chart renders correctly, scenario comparison functional

---

### Task 4.1: Create FI Curve Chart Component

**Objective**: Build interactive curve chart showing savings rate vs years to FI.

**Files to Create**:
- `src/components/fi-calculator/FICurveChart.tsx` (NEW)
- `src/hooks/useFICurveData.ts` (NEW - data generation hook)
- `src/components/fi-calculator/__tests__/FICurveChart.test.tsx` (NEW)

**Functionality**:
1. Use recharts library (or similar):
   - Line chart with smooth curve
   - X-axis: Savings rate (0-100%)
   - Y-axis: Years to FI (0-40)
   - Responsive sizing

2. Data generation (useFICurveData hook):
   - Generate points every 5% from 0-100%
   - Call generateFICurveData from calculations
   - Memoize data

3. Visual features:
   - Current position: Large highlighted dot
   - Target position: Secondary marker (if target set)
   - Reference lines: Vertical lines at 25%, 50%, 75%
   - Tooltip on hover: "X% sparnaður = Y.Y ár til fjármálafrelsis"

4. Interaction:
   - Click on chart to set savings rate (optional)
   - Hover shows tooltip
   - Keyboard navigation of data points

5. Mobile optimization:
   - Simplified axis labels
   - Larger touch targets
   - Horizontal scroll if needed

**Acceptance Criteria**:
- [ ] Chart renders with correct curve shape
- [ ] Current position highlighted
- [ ] Reference lines visible
- [ ] Tooltip shows on hover
- [ ] Responsive sizing works
- [ ] Mobile-friendly
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Renders in < 500ms

**Tests**:
- Chart renders with sample data
- Current position marked correctly
- Tooltip displays correct values
- useFICurveData hook generates correct data

**Requirements Traceability**: US-4

**Estimated Time**: 3 hours

---

### Task 4.2: Create Scenario Comparison Component

**Objective**: Build scenario comparison table/cards with save/load/delete functionality.

**Files to Create**:
- `src/components/fi-calculator/ScenarioComparison.tsx` (NEW)
- `src/components/fi-calculator/ScenarioCard.tsx` (NEW)
- `src/components/fi-calculator/SaveScenarioDialog.tsx` (NEW)
- `src/components/fi-calculator/__tests__/ScenarioComparison.test.tsx` (NEW)

**Functionality**:
1. **ScenarioComparison** (container):
   - Display all saved scenarios (0-4)
   - Comparison table view (desktop)
   - Card view (mobile)
   - "Bæta við atburðarás" button
   - Handle 0, 1, 2-4 scenario states with appropriate messaging

2. **ScenarioCard**:
   - Scenario name (editable inline or via dialog)
   - Key metrics: Savings rate, FI date, Years to FI
   - Difference from baseline (if not baseline)
   - Actions: Load, Delete, Set as Baseline, Duplicate
   - Highlight: Baseline (star icon), Best (green border)

3. **SaveScenarioDialog**:
   - Modal for naming scenario
   - Input validation (name required, max 50 chars)
   - Save and Cancel buttons
   - Keyboard shortcuts (Enter to save, Esc to cancel)

4. Comparison table columns:
   - Scenario name
   - Savings rate
   - FI date
   - Years to FI
   - Difference from baseline (months/years)
   - Life energy (work-years)
   - Actions

5. Sorting:
   - By FI date (earliest first)
   - By savings rate
   - Manual drag-drop order (optional)

**Acceptance Criteria**:
- [ ] Scenario list displays all scenarios
- [ ] Save dialog validates input
- [ ] Load scenario populates inputs
- [ ] Delete scenario removes with confirmation
- [ ] Set baseline updates comparison
- [ ] Best scenario highlighted
- [ ] Comparison table readable
- [ ] Mobile card view functional
- [ ] Maximum 4 scenarios enforced with message

**Tests**:
- Scenario card renders correctly
- Save dialog validation works
- Load/delete/set baseline actions work
- Comparison calculations correct

**Requirements Traceability**: US-5

**Estimated Time**: 3 hours

---

### Task 4.3: Create What-If Explorer Component

**Objective**: Build quick "what if" scenario tester with temporary results.

**Files to Create**:
- `src/components/fi-calculator/WhatIfExplorer.tsx` (NEW)
- `src/components/fi-calculator/__tests__/WhatIfExplorer.test.tsx` (NEW)

**Functionality**:
1. Quick adjust buttons (presets from constants):
   - "Hvað ef ég lækka útgjöld um 10%?"
   - "Hvað ef ég auka tekjur um 20%?"
   - "Hvað ef ég hætti núna?" (0% savings)

2. Custom what-if:
   - Input for custom percentage change
   - Apply to income or expenses

3. Temporary results overlay:
   - Show "Tímabundin skoðun" banner
   - Display new FI date and comparison
   - "Keep" button: Save adjusted values as new inputs
   - "Cancel" button: Revert to original

4. Context integration:
   - Use applyWhatIf, acceptWhatIf, cancelWhatIf from context

**Acceptance Criteria**:
- [ ] Preset buttons show temporary results
- [ ] Custom input allows any adjustment
- [ ] Temporary banner clearly visible
- [ ] Keep button saves changes
- [ ] Cancel button reverts
- [ ] Invalid scenarios show warning (e.g., negative savings)

**Tests**:
- Preset buttons apply adjustments
- Custom adjustment works
- Keep/Cancel actions work
- Invalid scenarios handled

**Requirements Traceability**: US-6

**Estimated Time**: 2 hours

---

## Epic 5: Progress Tracking and Polish

**Objective**: Add optional progress tracking and finalize feature

**Dependencies**: Epic 4 complete

**Completion Criteria**: Progress tracking functional, accessibility verified, all tests passing

---

### Task 5.1: Create Progress Tracker Component

**Objective**: Build progress tracking visualization showing FI date projections over time.

**Files to Create**:
- `src/components/fi-calculator/ProgressTracker.tsx` (NEW)
- `src/components/fi-calculator/ProgressChart.tsx` (NEW - timeline chart)
- `src/components/fi-calculator/__tests__/ProgressTracker.test.tsx` (NEW)

**Functionality**:
1. **ProgressTracker** (container):
   - "Bæta við eftirfylgni" button (create snapshot)
   - List of historical snapshots
   - Latest snapshot summary
   - Trend indicator (improving/stable/declining)
   - Clear all snapshots button (with confirmation)

2. **ProgressChart**:
   - X-axis: Snapshot date
   - Y-axis: Projected FI date
   - Line chart showing FI date estimates over time
   - Trend line (linear regression optional)
   - Color coding: Improving (green), Declining (red)

3. Snapshot display:
   - Date created
   - FI date projection at that time
   - Savings rate at that time
   - Notes (if any)
   - Change since previous snapshot

4. Encouragement messages:
   - Improving: "Vel gert! Þú ert X mánuðum nær markmiðinu"
   - Declining: "Athugnið útgjöld eða sparnaðarhlutfall"
   - Stable: "Þú ert á réttri braut"

**Acceptance Criteria**:
- [ ] Create snapshot button works
- [ ] Snapshots display chronologically
- [ ] Chart renders correctly
- [ ] Trend calculation correct
- [ ] Encouragement messages appropriate
- [ ] Delete snapshot works
- [ ] Clear all asks for confirmation

**Tests**:
- Snapshot creation works
- Chart renders with multiple snapshots
- Trend calculation correct
- Delete/clear actions work

**Requirements Traceability**: US-7

**Estimated Time**: 2.5 hours

---

### Task 5.2: Implement Date and Number Formatters

**Objective**: Create Icelandic-specific formatting utilities for dates, numbers, and currency.

**Files to Create**:
- `src/lib/utils/dateFormatters.ts` (NEW)
- `src/lib/utils/__tests__/dateFormatters.test.ts` (NEW)

**Functionality**:
1. Date formatting:
   - `formatIcelandicDate(date: Date): string` - "janúar 2035"
   - `formatRelativeTime(years: number): string` - "9 ár og 3 mánuðir"
   - Handle singular/plural correctly

2. Number formatting:
   - `formatISK(amount: number): string` - "10.000.000 kr"
   - Use Icelandic number format (periods, not commas)

3. Life energy formatting:
   - `formatLifeEnergy(hours: number, unit: 'hours' | 'days' | 'years'): string`
   - Smart unit selection based on magnitude

**Acceptance Criteria**:
- [ ] Icelandic month names used
- [ ] Singular/plural handled ("1 ár" vs "2 ár")
- [ ] Number separators use periods
- [ ] ISK suffix included
- [ ] Life energy units sensible

**Tests**:
- Test all formatters with various inputs
- Test edge cases (0, negative, very large)
- Test singular/plural logic

**Requirements Traceability**: NFR (Usability - Icelandic formatting)

**Estimated Time**: 1.5 hours

---

### Task 5.3: Implement FI Input Validators

**Objective**: Create validation functions for all FI inputs with Icelandic error messages.

**Files to Create**:
- `src/lib/utils/fiValidators.ts` (NEW)
- `src/lib/utils/__tests__/fiValidators.test.ts` (NEW)

**Functionality**:
1. `validateFIInputs(inputs: FIInputs): FIValidationResult`
   - Validate all required fields present
   - Validate ranges (amounts > 0, return rate 0-15%, etc.)
   - Return {isValid, errors, warnings}

2. Specific validators:
   - `validateFINumber(fiNumber: number): string | null`
   - `validateAnnualIncome(income: number): string | null`
   - `validateAnnualExpenses(expenses: number, income: number): string | null`
   - `validateReturnRate(rate: number): string | null`
   - `validateFIMultiplier(multiplier: number): string | null`

3. Warning conditions:
   - FI Number very high (> 1 billion ISK)
   - Expenses >= Income (0% or negative savings)
   - Return rate very optimistic (> 12%)
   - Already at FI (net worth >= FI number)
   - Very long timeline (> 100 years)

**Acceptance Criteria**:
- [ ] All validation rules implemented
- [ ] Error messages in Icelandic
- [ ] Warnings vs errors distinguished
- [ ] Edge cases handled (0, negative, very large)

**Tests**:
- Test valid inputs pass
- Test invalid inputs fail with correct messages
- Test warning conditions trigger warnings
- Test edge cases

**Requirements Traceability**: US-1, NFR (Usability)

**Estimated Time**: 1.5 hours

---

### Task 5.4: End-to-End Testing and Polish

**Objective**: Comprehensive E2E testing, accessibility verification, and final polish.

**Files to Create**:
- `src/components/fi-calculator/__tests__/e2e/savings-rate-flow.test.tsx` (NEW)
- `src/components/fi-calculator/__tests__/accessibility.test.tsx` (NEW)

**Functionality**:
1. **E2E Tests**:
   - Complete workflow: Enter inputs → Adjust slider → See results → Save scenario → Compare
   - Preset workflow: Use what-if → Accept changes → Verify persistence
   - Progress tracking: Create snapshots → View trend → Verify calculations
   - Scenario management: Create → Load → Delete → Verify limit
   - Export/import: Export data → Import → Verify restoration

2. **Accessibility Tests**:
   - Keyboard navigation: Tab through all inputs, use arrow keys on slider
   - Screen reader: Verify ARIA labels, live regions
   - Focus indicators: Verify 2px outline visible
   - Color contrast: Verify 4.5:1 minimum
   - Touch targets: Verify 44px minimum on mobile

3. **Manual Testing Checklist**:
   - Desktop browsers (Chrome, Firefox, Safari)
   - Mobile browsers (iOS Safari, Android Chrome)
   - Viewport sizes (320px - 1920px)
   - Performance (calculations < 100ms)
   - No console errors
   - LocalStorage persistence

4. **Polish**:
   - Fix any bugs discovered
   - Smooth animations/transitions
   - Loading states (if calculation > 200ms)
   - Error handling (graceful degradation)
   - Tooltips and help text
   - Icelandic text review

**Acceptance Criteria**:
- [ ] All E2E tests pass
- [ ] Accessibility tests pass (WCAG 2.1 AA)
- [ ] Manual testing checklist 100% complete
- [ ] All bugs fixed
- [ ] No console errors
- [ ] Performance targets met
- [ ] Responsive at all breakpoints
- [ ] Icelandic text verified

**Tests**:
- Run E2E suite: `npm test e2e`
- Run accessibility suite: `npm test accessibility`
- Manual testing checklist

**Requirements Traceability**: ALL, NFR (Performance, Accessibility, Mobile)

**Estimated Time**: 3 hours

---

## Dependencies and Critical Path

### Dependency Diagram
```
Epic 1 (Foundation)
  │
  ├─→ Epic 2 (State Management)
  │     │
  │     └─→ Epic 3 (Core UI)
  │           │
  │           ├─→ Epic 4 (Visualization & Scenarios)
  │           │     │
  │           └─────┴─→ Epic 5 (Progress & Polish)
```

### Critical Path Tasks
1. Task 1.1: Types (blocks everything)
2. Task 1.3: Calculations (blocks Epic 2, 3)
3. Task 2.1: Context integration (blocks Epic 3, 4)
4. Task 3.4: Main page component (blocks Epic 4)
5. Task 5.4: E2E testing (final gate)

### Parallel Work Opportunities
- Task 1.2 (Constants) and Task 1.3 (Calculations) can overlap
- Task 2.2 (Scenarios) and Task 2.3 (Snapshots) can be done in parallel
- Epic 3 UI tasks (3.1, 3.2, 3.3) can be partially parallelized after Task 2.4
- Task 5.1, 5.2, 5.3 can be done in any order

---

## Implementation Sequence (Recommended)

### Week 1: Foundation and State Management
**Days 1-2**: Epic 1
- Task 1.1: Types (1.5h)
- Task 1.2: Constants (1.5h)
- Task 1.3: Calculations (3h)
- Task 1.4: Tests (2h)

**Days 3-4**: Epic 2
- Task 2.1: Context extension (1.5h)
- Task 2.2: Scenario management (2h)
- Task 2.3: Progress tracking (1.5h)
- Task 2.4: LocalStorage (2h)

### Week 2: Core UI
**Days 5-7**: Epic 3
- Task 3.1: FI Inputs Section (2h)
- Task 3.2: Savings Rate Slider (2.5h)
- Task 3.3: Results Display (2.5h)
- Task 3.4: Main page component (2h)

### Week 3: Visualization and Scenarios
**Days 8-9**: Epic 4
- Task 4.1: FI Curve Chart (3h)
- Task 4.2: Scenario Comparison (3h)
- Task 4.3: What-If Explorer (2h)

### Week 4: Progress Tracking and Polish
**Days 10-12**: Epic 5
- Task 5.1: Progress Tracker (2.5h)
- Task 5.2: Formatters (1.5h)
- Task 5.3: Validators (1.5h)
- Task 5.4: E2E Testing & Polish (3h)

**Total Time**: ~32 hours over 12 work sessions

---

## Definition of Done

**Feature is complete when**:

- [ ] All 19 tasks completed and checked off
- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing checklist 100% complete
- [ ] Code reviewed (self or peer)
- [ ] No console errors in browser
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Documentation complete (code comments, JSDoc)
- [ ] Responsive design verified on all breakpoints (320px-1920px)
- [ ] Icelandic text reviewed for grammar/clarity
- [ ] Performance targets met:
  - [ ] Calculations < 100ms
  - [ ] Chart render < 500ms
  - [ ] Page load < 2s on 3G
- [ ] LocalStorage persistence verified
- [ ] Export/import functionality verified
- [ ] All requirements traced and satisfied
- [ ] No accessibility violations (Lighthouse score 95+)

---

## Risk Mitigation

### Identified Risks

**Risk 1: Calculation accuracy issues**
- **Mitigation**: Extensive unit tests with known values, verify against financial calculators
- **Contingency**: Use established financial formula library if custom implementation fails

**Risk 2: Performance issues with curve generation**
- **Mitigation**: Memoize curve data, limit data points, benchmark early
- **Contingency**: Reduce curve resolution (fewer points), add loading indicator

**Risk 3: recharts library integration complexity**
- **Mitigation**: Research recharts documentation early, implement simple version first
- **Contingency**: Use simpler CSS-based visualization (bars instead of curve)

**Risk 4: localStorage quota exceeded**
- **Mitigation**: Monitor storage usage, limit scenarios (4) and snapshots (100)
- **Contingency**: Add storage cleanup utility, compress data

**Risk 5: Accessibility issues discovered late**
- **Mitigation**: Implement accessibility from start, test early with screen reader
- **Contingency**: Budget extra time for fixes in Epic 5

**Risk 6: Icelandic text issues (grammar, clarity)**
- **Mitigation**: Review text with native speaker, use established patterns
- **Contingency**: Iterate on text based on feedback

**Risk 7: Mobile performance issues**
- **Mitigation**: Test on actual devices early, optimize animations
- **Contingency**: Simplify mobile UI, reduce chart complexity

---

## Success Metrics

### Technical Metrics
- **Code coverage**: > 85% for all FI calculator modules
- **Performance**:
  - All calculations < 100ms (95th percentile)
  - Chart render < 500ms
  - Page load < 2s on 3G connection
- **Accessibility**: WCAG 2.1 AA compliance (no violations)
- **Bundle size**: < 50KB gzipped (FI calculator code only)

### User Metrics (if tracking implemented)
- **Feature adoption**: 60%+ of users who complete Actual Hourly Wage calculation try FI slider
- **Engagement**: 3+ minutes average session time
- **Scenario creation**: 40%+ of users create at least 1 scenario
- **Return usage**: 30%+ return within 30 days
- **Mobile usage**: 40%+ of sessions on mobile

### Business Metrics
- **Completion rate**: 70%+ of users who start finish calculation
- **Export rate**: 20%+ export their data
- **Progress tracking**: 15%+ create at least one snapshot
- **Feature satisfaction**: 4.5+ out of 5 (if survey implemented)

---

## Notes for Implementation

### Best Practices
- **Commit strategy**: Commit after each task completion with clear message
- **Testing approach**: Write tests alongside or before components (TDD recommended for calculations)
- **Code review**: Self-review before marking task complete
- **Performance**: Profile calculations and chart rendering early
- **Accessibility**: Test with keyboard and screen reader regularly, not just at end

### Dependencies
- **External libraries**:
  - recharts (for FI curve chart) - already in project or add
  - uuid (for unique IDs) - already in project or use timestamp-based
- **Existing patterns**:
  - CalculatorContext pattern
  - UI components (Card, Input, Button, etc.)
  - Currency formatting utilities

### Common Pitfalls to Avoid
- Don't forget to handle 0 interest rate case (simple sum, not compound)
- Don't forget to handle 0 actualHourlyWage case (no life energy display)
- Don't create infinite loop in auto-recalculation useEffect
- Don't exceed localStorage quota (limit scenarios and snapshots)
- Don't forget ARIA labels and keyboard navigation
- Don't assume Icelandic text is correct without native speaker review
- Don't skip mobile testing until the end

### Development Environment
- **Node version**: Check project requirements
- **Package manager**: npm or yarn (check project)
- **Testing**: Vitest (already configured)
- **Type checking**: TypeScript strict mode
- **Linting**: ESLint (follow project rules)

---

## Tasks Review Checklist

- [x] All requirements covered by tasks
- [x] Tasks sequenced logically (foundation → integration → UI → visualization → polish)
- [x] Each task has clear objective and acceptance criteria
- [x] Each task has realistic time estimate
- [x] Requirements traceability maintained throughout
- [x] Testing strategy comprehensive (unit, integration, E2E)
- [x] Total time estimate reasonable (28-34 hours)
- [x] Dependencies clearly identified
- [x] Risks identified with mitigation strategies
- [x] Definition of Done clear and measurable
- [x] Success metrics defined

**Implementation Ready**: YES

**Next Step**: Begin implementation with Epic 1, Task 1.1 (Define TypeScript Types)

---

## Quick Reference

### File Structure Created
```
src/
├── types/
│   └── calculator.ts (MODIFY - add FI types)
├── lib/
│   ├── constants/
│   │   ├── fi.ts (NEW)
│   │   └── icelandic.ts (NEW)
│   ├── calculations/
│   │   ├── fi.ts (NEW)
│   │   ├── scenarios.ts (NEW)
│   │   ├── snapshots.ts (NEW)
│   │   └── __tests__/
│   │       ├── fi.test.ts (NEW)
│   │       ├── scenarios.test.ts (NEW)
│   │       └── snapshots.test.ts (NEW)
│   └── utils/
│       ├── dateFormatters.ts (NEW)
│       ├── fiValidators.ts (NEW)
│       └── __tests__/
│           ├── dateFormatters.test.ts (NEW)
│           └── fiValidators.test.ts (NEW)
├── context/
│   └── CalculatorContext.tsx (MODIFY)
├── hooks/
│   └── useFICurveData.ts (NEW)
├── components/
│   └── fi-calculator/
│       ├── FIInputsSection.tsx (NEW)
│       ├── SavingsRateSlider.tsx (NEW)
│       ├── FIResultsDisplay.tsx (NEW)
│       ├── LifeEnergyDisplay.tsx (NEW)
│       ├── MarginalImpactPanel.tsx (NEW)
│       ├── SavingsRateCalculator.tsx (NEW)
│       ├── FICurveChart.tsx (NEW)
│       ├── ScenarioComparison.tsx (NEW)
│       ├── ScenarioCard.tsx (NEW)
│       ├── SaveScenarioDialog.tsx (NEW)
│       ├── WhatIfExplorer.tsx (NEW)
│       ├── ProgressTracker.tsx (NEW)
│       ├── ProgressChart.tsx (NEW)
│       └── __tests__/
│           ├── FIInputsSection.test.tsx (NEW)
│           ├── SavingsRateSlider.test.tsx (NEW)
│           ├── FIResultsDisplay.test.tsx (NEW)
│           ├── FICurveChart.test.tsx (NEW)
│           ├── ScenarioComparison.test.tsx (NEW)
│           ├── WhatIfExplorer.test.tsx (NEW)
│           ├── ProgressTracker.test.tsx (NEW)
│           ├── e2e/
│           │   └── savings-rate-flow.test.tsx (NEW)
│           └── accessibility.test.tsx (NEW)
└── app/
    └── sparnadarhlutfall/
        └── page.tsx (NEW)
```

### Key Constants
- `DEFAULT_FI_INPUTS`: Initial values
- `FI_CONSTANTS`: Limits and work hours
- `ICELANDIC_MONTHS`: Month names
- `FI_STRINGS`: All UI text
- `QUICK_WHAT_IF_PRESETS`: What-if scenarios

### Key Functions
- `calculateYearsToFI()`: Core FI calculation
- `calculateFIResults()`: Complete results object
- `generateFICurveData()`: Chart data
- `createScenario()`: New scenario
- `createSnapshot()`: Progress snapshot
- `formatIcelandicDate()`: Date formatting
- `validateFIInputs()`: Input validation
