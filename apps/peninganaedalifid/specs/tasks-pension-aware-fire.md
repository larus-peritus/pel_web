# Implementation Tasks: Pension-Aware FIRE Calculator

## Task Overview

**Feature Name:** Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)
**Feature ID:** 2.1.15
**Version:** 1.0
**Created:** 2026-01-30
**Requirements:** specs/requirements-pension-aware-fire.md
**Design:** specs/design-pension-aware-fire.md

**Sequencing Strategy:** Foundation-first (types → constants → calculations → state → components → page)

---

## Epic Summary

| Epic | Name | Tasks | Dependencies |
|------|------|-------|--------------|
| E1 | Foundation Types | 1 | None |
| E2 | Constants & Defaults | 1 | E1 |
| E3 | Calculation Engine | 4 | E1, E2 |
| E4 | State Management | 1 | E1, E3 |
| E5 | Core Input Components | 3 | E4 |
| E6 | Results Components | 4 | E3, E4 |
| E7 | Main Calculator & Page | 2 | E5, E6 |
| E8 | Polish & Testing | 2 | E7 |

**Total Tasks:** 18

---

## Epic 1: Foundation Types

### Task 1.1: Create Type Definitions

**Objective:** Define all TypeScript interfaces for the pension-aware FIRE calculator

**File:** `src/types/pensionAwareFire.ts`

**Requirements Traced:** US-1, US-2, US-3, FR-1, FR-2

**Implementation Details:**
```typescript
// Types to define:
- PensionAwareFireState (all inputs)
- RetirementPhase (single phase data)
- PensionAwareFireResults (all outputs)
- PlanWarning (validation warnings)
- SavedScenario (for comparison feature)
- LifeyrissjodurInput, SereignInput, TRInput (sub-types)
```

**Acceptance Criteria:**
- [x] All types from design document are implemented
- [x] Types are properly exported
- [x] JSDoc comments explain each interface
- [x] No TypeScript errors

**Estimated Complexity:** Small

**Status:** ✅ Completed 2026-01-30
- Implemented: src/types/pensionAwareFire.ts (359 lines)
- Context: context/modules/PensionAwareFireTypes.md
- TypeScript: No compilation errors

---

## Epic 2: Constants & Defaults

### Task 2.1: Create Constants File

**Objective:** Define Icelandic pension system constants and calculator defaults

**File:** `src/lib/constants/pensionAwareFire.ts`

**Dependencies:** Task 1.1

**Requirements Traced:** FR-5, NFR-4

**Implementation Details:**
```typescript
// Constants to define:
- PENSION_AWARE_DEFAULTS (default input values)
- ICELANDIC_PENSION_SYSTEM (ages, amounts, rates)
- PENSION_INPUT_RANGES (validation ranges)
- PHASE_COLORS (for timeline visualization)
- WARNING_THRESHOLDS (when to show warnings)
```

**Acceptance Criteria:**
- [ ] All pension ages correct (60, 62, 67)
- [ ] TR means-testing rates accurate
- [ ] Default values are reasonable for Iceland
- [ ] Input ranges allow valid scenarios

**Estimated Complexity:** Small

---

## Epic 3: Calculation Engine

### Task 3.1: Phase Calculation Functions

**Objective:** Implement functions to calculate retirement phases

**File:** `src/lib/calculations/pensionAwareFire.ts`

**Dependencies:** Task 1.1, Task 2.1

**Requirements Traced:** US-1, US-4, FR-2

**Implementation Details:**
```typescript
// Functions to implement:
- calculateRetirementPhases(state): RetirementPhase[]
- calculateGapPhase(state): RetirementPhase
- calculateSereignBridgePhase(state, previousPhases): RetirementPhase
- calculateFullPensionPhase(state, previousPhases): RetirementPhase
- calculatePhaseIncome(phase, state): IncomeBreakdown
- calculatePhaseFunding(phase, state): number
```

**Acceptance Criteria:**
- [ ] Returns 3 phases for retirement before 60
- [ ] Returns 2 phases for retirement 60-66
- [ ] Returns 1 phase for retirement at 67+
- [ ] Each phase has correct income sources
- [ ] Funding requirements chain correctly between phases

**Estimated Complexity:** Medium

---

### Task 3.2: Present Value Calculations

**Objective:** Implement present value calculations for future pension streams

**File:** `src/lib/calculations/pensionAwareFire.ts`

**Dependencies:** Task 3.1

**Requirements Traced:** US-3, FR-3

**Implementation Details:**
```typescript
// Functions to implement:
- calculatePresentValueOfPension(monthly, startAge, currentAge, endAge, rate): number
- calculatePresentValueOfAllPensions(state): PensionPresentValues
- calculateTraditionalFI(state): number
- calculatePensionAdjustedFI(state): number
- calculateBridgeFundingNeeds(state): number
```

**Acceptance Criteria:**
- [ ] Present value formula is mathematically correct
- [ ] Handles edge cases (pension already started, zero amounts)
- [ ] Pension-adjusted FI is always <= traditional FI
- [ ] Results match hand calculations for test cases

**Estimated Complexity:** Medium

---

### Task 3.3: TR Means-Testing Integration

**Objective:** Calculate TR pension with means-testing based on lífeyrissjóður

**File:** `src/lib/calculations/pensionAwareFire.ts`

**Dependencies:** Task 3.1

**Requirements Traced:** US-2, FR-5

**Implementation Details:**
```typescript
// Functions to implement:
- calculateTRWithMeansTesting(state): TREstimate
- calculateIncomeAboveExemption(lifeyrissjodur): number
- calculateTRReduction(incomeAboveExemption): number

// Reuse logic from existing TRMeansTestCalculator where possible
```

**Acceptance Criteria:**
- [ ] Full TR when lífeyrissjóður below exemption
- [ ] Correct reduction rate (45%) applied
- [ ] Zero TR when income exceeds threshold
- [ ] Results match existing TRMeansTestCalculator

**Estimated Complexity:** Small

---

### Task 3.4: Séreign Projection Functions

**Objective:** Project séreign balance at 60 and calculate withdrawal strategy

**File:** `src/lib/calculations/pensionAwareFire.ts`

**Dependencies:** Task 3.1

**Requirements Traced:** US-2, US-4

**Implementation Details:**
```typescript
// Functions to implement:
- calculateProjectedSereign(state): SereignProjection
- projectSereignGrowth(current, monthlyContrib, employerMatch, years, rate): number
- calculateSereignWithdrawal60to67(balance, monthlyExpenses, otherIncome): number
```

**Acceptance Criteria:**
- [ ] Compound growth calculation correct
- [ ] Employer match included in projections
- [ ] Withdrawal strategy covers gap to 67
- [ ] Handles zero séreign gracefully

**Estimated Complexity:** Small

---

## Epic 4: State Management

### Task 4.1: Context Integration

**Objective:** Add pension-aware FIRE state to CalculatorContext

**File:** `src/context/CalculatorContext.tsx`

**Dependencies:** Task 1.1, Task 3.1-3.4

**Requirements Traced:** NFR-4

**Implementation Details:**
```typescript
// Add to CalculatorContext:
- pensionAwareFire: PensionAwareFireState | null
- pensionAwareFireResults: PensionAwareFireResults | null
- updatePensionAwareFireState(updates)
- initializePensionAwareFire()
- savePensionScenario(name)
- deletePensionScenario(id)

// Add localStorage persistence
// Add result calculation on state change
```

**Acceptance Criteria:**
- [ ] State initializes with defaults
- [ ] Updates trigger recalculation
- [ ] State persists to localStorage
- [ ] Scenarios can be saved/deleted
- [ ] No TypeScript errors in context

**Estimated Complexity:** Medium

---

## Epic 5: Core Input Components

### Task 5.1: BasicInputs Component

**Objective:** Create component for age, expenses, and savings inputs

**File:** `src/components/pensionAwareFire/BasicInputs.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-6, FR-1

**Implementation Details:**
```typescript
// Component features:
- Current age input (NumberInput)
- Target retirement age input (NumberInput or Slider)
- Monthly expenses (CurrencyInput)
- Expense source toggle (baseline vs manual)
- Tier selector when baseline available
- Current savings (CurrencyInput)
- Monthly savings rate (CurrencyInput)
- Investment return slider

// Integration:
- Auto-populate from expenseBaselineResults
- Show info alert when baseline connected
```

**Acceptance Criteria:**
- [ ] All inputs render correctly
- [ ] Validation prevents invalid inputs
- [ ] Expense baseline integration works
- [ ] Tier selector shows correct values
- [ ] Updates flow to context

**Estimated Complexity:** Medium

---

### Task 5.2: PensionInputs Component

**Objective:** Create component for pension-specific inputs (3 sources)

**File:** `src/components/pensionAwareFire/PensionInputs.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-2, FR-1

**Implementation Details:**
```typescript
// Three collapsible sections:

// A. Lífeyrissjóður
- Expected monthly amount (CurrencyInput)
- Start age selector (62-70)
- Help text with typical ranges

// B. Séreign
- Current balance (CurrencyInput)
- Monthly contribution (CurrencyInput)
- Employer match % (Slider or NumberInput)
- Projected balance at 60 (calculated display)

// C. TR Ellilífeyrir
- Expect full TR toggle
- Auto-calculated estimate display
- Link to TRMeansTestCalculator
- Link to official TR calculator

// "Use typical values" quick-fill button
```

**Acceptance Criteria:**
- [ ] All three pension sections render
- [ ] Collapsible sections work
- [ ] Séreign projection updates live
- [ ] TR estimate updates when lífeyrissjóður changes
- [ ] Quick-fill populates reasonable defaults

**Estimated Complexity:** Medium

---

### Task 5.3: PensionEducationalIntro Component

**Objective:** Create collapsible educational content about pension-aware FI

**File:** `src/components/pensionAwareFire/PensionEducationalIntro.tsx`

**Dependencies:** None (can be done in parallel)

**Requirements Traced:** NFR-2

**Implementation Details:**
```typescript
// Collapsible card with sections:
1. "Af hverju hefðbundin FIRE-tala er of há"
   - Traditional 25-30x assumes no pension
   - In Iceland, pensions cover significant portion

2. "Íslenska lífeyriskerfið"
   - Séreign (60+)
   - Lífeyrissjóður (62-67)
   - TR (67+, means-tested)

3. "Þrjú stig eftirlaunaáætlunar"
   - Gap period explanation
   - Bridge period explanation
   - Full pension period explanation

4. "Dæmi: Hvernig þetta sparar milljónir"
   - Concrete example with numbers
   - 144M traditional vs 38M adjusted

// Same pattern as LeanFIRE EducationalIntro
```

**Acceptance Criteria:**
- [ ] Starts collapsed by default
- [ ] Expand/collapse works smoothly
- [ ] Content is accurate and helpful
- [ ] Dismiss button works
- [ ] Styling matches other educational intros

**Estimated Complexity:** Small

---

## Epic 6: Results Components

### Task 6.1: PhaseTimeline Component

**Objective:** Create visual timeline showing retirement phases

**File:** `src/components/pensionAwareFire/PhaseTimeline.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-5

**Implementation Details:**
```typescript
// Visual timeline with:
- Horizontal bar showing life from current age to 90
- Color-coded sections for each phase
- Age markers (current, retirement, 60, 67)
- Duration labels for each phase
- Funding requirements per phase

// Interactions:
- Hover/click shows phase details
- Responsive design (stacks on mobile)

// Color scheme:
- Working: Blue
- Gap (self-funded): Red/Orange
- Séreign bridge: Amber
- Full pension: Green
```

**Acceptance Criteria:**
- [ ] Timeline renders correctly for all scenarios
- [ ] Colors match phase types
- [ ] Hover shows details
- [ ] Responsive on mobile
- [ ] Handles edge cases (retirement at 60, 67, etc.)

**Estimated Complexity:** Medium

---

### Task 6.2: FINumberComparison Component

**Objective:** Show traditional vs pension-adjusted FI numbers

**File:** `src/components/pensionAwareFire/FINumberComparison.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-3

**Implementation Details:**
```typescript
// Two-column display:
- Left: Traditional FI (30x expenses)
- Right: Pension-Adjusted FI (actual need)
- Arrow connecting them

// Highlight box:
- Savings difference (kr)
- Years earlier retirement possible
- Percentage reduction

// Visual emphasis on the savings
```

**Acceptance Criteria:**
- [ ] Both FI numbers display correctly
- [ ] Savings difference calculated correctly
- [ ] Years earlier calculation accurate
- [ ] Visually emphasizes the benefit
- [ ] Handles case where they're equal (rare)

**Estimated Complexity:** Small

---

### Task 6.3: PhaseBreakdown Component

**Objective:** Show detailed income/expense breakdown per phase

**File:** `src/components/pensionAwareFire/PhaseBreakdown.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-1, US-4

**Implementation Details:**
```typescript
// Card for each phase showing:
- Phase name and duration
- Income sources breakdown
  - Savings withdrawal
  - Investment returns
  - Séreign (if applicable)
  - Lífeyrissjóður (if applicable)
  - TR (if applicable)
  - Total income
- Monthly expenses
- Surplus/deficit
- Required funding at start
- Remaining at end

// Expandable/collapsible cards
// Summary row at bottom with totals
```

**Acceptance Criteria:**
- [ ] All phases display correctly
- [ ] Income sources accurate per phase
- [ ] Funding chain is clear
- [ ] Surplus/deficit highlighted
- [ ] Collapsible for cleaner view

**Estimated Complexity:** Medium

---

### Task 6.4: ScenarioComparison Component

**Objective:** Allow saving and comparing up to 3 scenarios

**File:** `src/components/pensionAwareFire/ScenarioComparison.tsx`

**Dependencies:** Task 4.1

**Requirements Traced:** US-7

**Implementation Details:**
```typescript
// Features:
- "Save current scenario" button with name input
- Table comparing saved scenarios
- Columns: FI needed, Gap years, Time to FI, Surplus
- Delete scenario button
- Max 3 scenarios enforced
- Highlight differences between scenarios

// Storage:
- Scenarios saved in state (and localStorage)
- Each scenario captures inputs + results snapshot
```

**Acceptance Criteria:**
- [ ] Can save scenario with custom name
- [ ] Table displays up to 3 scenarios
- [ ] Can delete scenarios
- [ ] Comparison highlights key differences
- [ ] Persists across page reloads

**Estimated Complexity:** Medium

---

## Epic 7: Main Calculator & Page

### Task 7.1: PensionAwareFIRECalculator Main Component

**Objective:** Create main container component orchestrating all sub-components

**File:** `src/components/pensionAwareFire/PensionAwareFIRECalculator.tsx`

**Dependencies:** Task 5.1-5.3, Task 6.1-6.4

**Requirements Traced:** All US, NFR-4

**Implementation Details:**
```typescript
// Component structure:
- Hero section with title and badge
- Educational intro (collapsible)
- Expense baseline status alert
- BasicInputs
- PensionInputs
- Results section (conditional on hasResults):
  - FINumberComparison
  - PhaseTimeline
  - PhaseBreakdown
  - ScenarioComparison

// State management:
- Initialize state on mount
- Track intro collapsed/dismissed state

// Props:
- onBack?: () => void (for calculator hub integration)
```

**Acceptance Criteria:**
- [ ] All components render in correct order
- [ ] Results show only when calculated
- [ ] Loading state handled
- [ ] Back button works when provided
- [ ] Styling consistent with other calculators

**Estimated Complexity:** Medium

---

### Task 7.2: Create Page Route

**Objective:** Create the Next.js page for the calculator

**File:** `src/app/lifeyristengd-fire/page.tsx`

**Dependencies:** Task 7.1

**Requirements Traced:** NFR-4

**Implementation Details:**
```typescript
// Page setup:
- Import PensionAwareFIRECalculator
- Add metadata (title, description)
- Wrap in CalculatorProvider if needed

// Metadata:
title: "Lífeyristengd FIRE Reiknivél | Peningaæðalífið"
description: "Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins"
```

**Acceptance Criteria:**
- [ ] Page accessible at /lifeyristengd-fire
- [ ] Metadata renders correctly
- [ ] Calculator initializes properly
- [ ] No hydration errors

**Estimated Complexity:** Small

---

## Epic 8: Polish & Testing

### Task 8.1: Unit Tests for Calculations

**Objective:** Write comprehensive tests for calculation functions

**File:** `tests/lib/calculations/pensionAwareFire.test.ts`

**Dependencies:** Task 3.1-3.4

**Requirements Traced:** NFR-3

**Implementation Details:**
```typescript
// Test suites:
describe('calculateRetirementPhases')
  - 3 phases for early retirement
  - 2 phases for 60-66 retirement
  - 1 phase for 67+ retirement
  - Correct phase durations

describe('calculatePresentValueOfPension')
  - Mathematical accuracy
  - Edge cases (zero, negative)

describe('calculatePensionAdjustedFI')
  - Always <= traditional FI
  - Matches expected values

describe('calculateTRWithMeansTesting')
  - Full TR below exemption
  - Correct reduction
  - Zero TR above threshold

describe('calculateProjectedSereign')
  - Compound growth correct
  - Employer match included
```

**Acceptance Criteria:**
- [ ] All calculation functions have tests
- [ ] Edge cases covered
- [ ] Tests pass
- [ ] Coverage > 80%

**Estimated Complexity:** Medium

---

### Task 8.2: Add to Navigation & Calculator Hub

**Objective:** Integrate calculator into site navigation

**Files:**
- Navigation component (add link)
- Calculator hub/index (add card)
- Any relevant sidebars

**Dependencies:** Task 7.2

**Requirements Traced:** NFR-4

**Implementation Details:**
```typescript
// Add to calculator list/hub:
- Card with icon, title, description
- Link to /lifeyristengd-fire
- Badge: "Nýtt" (New)

// Navigation:
- Add to FIRE calculators dropdown/section
```

**Acceptance Criteria:**
- [ ] Calculator accessible from navigation
- [ ] Card displays in calculator hub
- [ ] Links work correctly
- [ ] Consistent with other calculator entries

**Estimated Complexity:** Small

---

## Task Dependency Graph

```
E1: Types
    └── Task 1.1 ─────────────────────────────────────────┐
                                                          │
E2: Constants                                             │
    └── Task 2.1 ◄── Task 1.1                            │
                                                          │
E3: Calculations                                          │
    ├── Task 3.1 ◄── Task 1.1, 2.1                       │
    ├── Task 3.2 ◄── Task 3.1                            │
    ├── Task 3.3 ◄── Task 3.1                            │
    └── Task 3.4 ◄── Task 3.1                            │
                                                          │
E4: State                                                 │
    └── Task 4.1 ◄── Task 1.1, 3.1-3.4 ──────────────────┤
                                                          │
E5: Input Components                                      │
    ├── Task 5.1 ◄── Task 4.1                            │
    ├── Task 5.2 ◄── Task 4.1                            │
    └── Task 5.3 (parallel - no deps)                    │
                                                          │
E6: Results Components                                    │
    ├── Task 6.1 ◄── Task 4.1                            │
    ├── Task 6.2 ◄── Task 4.1                            │
    ├── Task 6.3 ◄── Task 4.1                            │
    └── Task 6.4 ◄── Task 4.1                            │
                                                          │
E7: Main & Page                                           │
    ├── Task 7.1 ◄── Task 5.1-5.3, 6.1-6.4               │
    └── Task 7.2 ◄── Task 7.1                            │
                                                          │
E8: Polish                                                │
    ├── Task 8.1 ◄── Task 3.1-3.4                        │
    └── Task 8.2 ◄── Task 7.2                            │
```

---

## Implementation Order (Recommended)

**Batch 1 (Foundation):**
1. Task 1.1: Types
2. Task 2.1: Constants

**Batch 2 (Calculations):**
3. Task 3.1: Phase calculations
4. Task 3.2: Present value calculations
5. Task 3.3: TR means-testing
6. Task 3.4: Séreign projections

**Batch 3 (State + Educational):**
7. Task 4.1: Context integration
8. Task 5.3: Educational intro (parallel)

**Batch 4 (Input Components):**
9. Task 5.1: Basic inputs
10. Task 5.2: Pension inputs

**Batch 5 (Results Components):**
11. Task 6.1: Phase timeline
12. Task 6.2: FI comparison
13. Task 6.3: Phase breakdown
14. Task 6.4: Scenario comparison

**Batch 6 (Assembly):**
15. Task 7.1: Main calculator
16. Task 7.2: Page route

**Batch 7 (Polish):**
17. Task 8.1: Unit tests
18. Task 8.2: Navigation integration

---

## Verification Checklist

After implementation, verify:

- [ ] Calculator loads at /lifeyristengd-fire
- [ ] Educational intro explains the concept clearly
- [ ] Basic inputs work and validate
- [ ] Pension inputs populate and calculate
- [ ] Phase timeline displays correctly for various ages
- [ ] FI comparison shows meaningful savings
- [ ] Phase breakdown shows all income sources
- [ ] Scenarios can be saved and compared
- [ ] State persists across page reloads
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Unit tests pass
- [ ] Accessible via navigation

---

## Notes for Implementation

1. **Reuse patterns** from LeanFIRE calculator where possible
2. **Educational content** is critical - users need to understand the concept
3. **Disclaimers** must be clear - this is an estimate, not financial advice
4. **TR calculation** should link to official calculator for accuracy
5. **Test with real scenarios** - the 35-year-old example from requirements
