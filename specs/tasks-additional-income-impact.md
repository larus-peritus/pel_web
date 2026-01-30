# Tasks: Additional Income Impact Calculator

## Overview

**Feature**: Additional Income Impact Calculator (2.3.3)
**App**: peninganaedalifid.is
**Requirements**: [requirements-additional-income-impact.md](./requirements-additional-income-impact.md)
**Design**: [design-additional-income-impact.md](./design-additional-income-impact.md)

## Implementation Strategy

**Strategy**: Foundation-First (Hybrid)

**Rationale**: This feature builds on the existing Actual Hourly Wage Calculator foundation. We'll create core calculation functions first (tax, net rate), then build components that integrate with existing CalculatorContext, and finally add feature-specific UI components.

**Sequence**:
1. Setup types and data structures
2. Build calculation engine (tax, net rate, FI impact)
3. Create presets configuration
4. Build React context for state management
5. Create input components
6. Create results display components
7. Build opportunity comparison features
8. Integrate with main app
9. Testing and refinement

## Prerequisites

Before starting these tasks, ensure:
- [ ] Actual Hourly Wage Calculator is complete and functional
- [ ] CalculatorContext exists and is accessible
- [ ] Base UI components available (Input, Button, Card, Select)
- [ ] Testing infrastructure is set up (Vitest, React Testing Library)

---

## Task 1: Create TypeScript Types

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: None

### Description

Define all TypeScript interfaces and types for the additional income calculator feature.

### Acceptance Criteria

- [ ] All types from design.md are implemented
- [ ] Types are exported via barrel export
- [ ] No TypeScript errors
- [ ] Types integrate with existing calculator types

### Implementation Steps

1. Create `src/types/additionalIncome.ts`
2. Add `AdditionalIncomeInputs` interface
3. Add `NewExpenses` interface
4. Add `AdditionalTime` interface
5. Add `FIInputs` interface
6. Add `AdditionalIncomeResults` interface
7. Add `TaxBreakdown` interface
8. Add `TaxBracket` interface
9. Add `ExpenseBreakdownItem` interface (may reuse from calculator.ts)
10. Add `FIImpact` interface
11. Add `Recommendation` interface
12. Add `Opportunity` interface
13. Add `OpportunityPreset` interface
14. Add `AdditionalIncomeStoredState` interface
15. Update `src/types/index.ts` barrel export

### Files to Create/Modify

- `src/types/additionalIncome.ts` (create)
- `src/types/index.ts` (update with exports)

### Requirements

- Requirements: REQ-1, REQ-2, REQ-3, REQ-4, REQ-8

---

## Task 2: Create Tax Calculation Module

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 1

### Description

Implement Icelandic tax calculation functions including marginal tax rate calculation.

### Acceptance Criteria

- [ ] Tax brackets defined for Icelandic system (2024)
- [ ] `calculateIcelandicTax()` calculates total tax correctly
- [ ] `calculateMarginalTax()` calculates marginal tax on additional income
- [ ] `getTaxBracket()` identifies correct bracket for income level
- [ ] Bracket jump detection works
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/lib/calculations/tax.ts`
2. Define `ICELANDIC_TAX_BRACKETS` constant with 2024 rates:
   - 0 - 419,838 kr: 31.45%
   - 419,839 - 1,133,796 kr: 37.95%
   - 1,133,797 - 2,023,604 kr: 46.25%
   - Above 2,023,604 kr: 46.25%
3. Implement `calculateIcelandicTax(income: number): number`
   - Progressive bracket calculation
   - Return total tax
4. Implement `calculateMarginalTax(currentIncome: number, additionalIncome: number): { marginalTax, marginalRate, breakdown }`
   - Calculate tax on current income
   - Calculate tax on current + additional
   - Compute difference (marginal tax)
   - Detect bracket jump
5. Implement `getTaxBracket(income: number): TaxBracket`
   - Find appropriate bracket for income level
6. Add comprehensive unit tests
7. Add JSDoc documentation

### Files to Create/Modify

- `src/lib/calculations/tax.ts` (create)
- `tests/lib/calculations/tax.test.ts` (create)
- `src/lib/calculations/index.ts` (update exports)

### Test Cases

```typescript
// Test each bracket
test('calculates tax in low bracket', () => {
  expect(calculateIcelandicTax(400000)).toBeCloseTo(125800);
});

// Test bracket jump
test('detects bracket jump', () => {
  const result = calculateMarginalTax(400000, 100000);
  expect(result.breakdown.bracketJump).toBe(true);
});

// Test marginal vs average rate
test('marginal rate higher than average rate when jumping brackets', () => {
  const result = calculateMarginalTax(400000, 100000);
  const averageRate = (result.breakdown.newTotalTax / 500000) * 100;
  expect(result.marginalRate).toBeGreaterThan(averageRate);
});
```

### Requirements

- Requirements: REQ-2

---

## Task 3: Create Additional Income Calculation Module

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 1, Task 2

### Description

Implement core calculation functions for net hourly rate from additional income.

### Acceptance Criteria

- [ ] `calculateNetHourlyRate()` returns complete results
- [ ] Gross income calculation correct
- [ ] Marginal tax deduction correct
- [ ] Expense deduction correct
- [ ] Time accounting correct (billable + additional)
- [ ] Net rate calculation correct
- [ ] Comparison to actual wage correct
- [ ] Expense breakdown generated
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/lib/calculations/additionalIncome.ts`
2. Implement `calculateNetHourlyRate(inputs: AdditionalIncomeInputs): AdditionalIncomeResults`
   - Calculate gross annual income (rate × hours × weeks + bonus)
   - Call `calculateMarginalTax()` for tax
   - Sum total new expenses
   - Calculate net annual income (gross - tax - expenses)
   - Calculate total time investment (billable + additional hours)
   - Calculate net hourly rate (net income / total hours)
   - Calculate percentage reduction
   - Compare to actual wage
   - Calculate monthly net income
   - Generate expense breakdown
   - Call `calculateFIImpact()` if FI inputs provided
   - Call `generateRecommendation()`
   - Return complete results
3. Implement `generateExpenseBreakdown(expenses: NewExpenses, actualWage: number, grossIncome: number): ExpenseBreakdownItem[]`
   - Map each expense category
   - Calculate life energy hours
   - Calculate percentage of gross income
   - Filter out zero expenses
   - Sort by amount descending
4. Add unit tests
5. Add JSDoc documentation

### Files to Create/Modify

- `src/lib/calculations/additionalIncome.ts` (create)
- `tests/lib/calculations/additionalIncome.test.ts` (create)
- `src/lib/calculations/index.ts` (update exports)

### Test Cases

```typescript
// Basic calculation
test('calculates net rate correctly', () => {
  const inputs = {
    currentActualWage: 2500,
    currentAnnualIncome: 5000000,
    grossHourlyRate: 3000,
    hoursPerWeek: 10,
    weeksPerYear: 50,
    oneTimeBonus: 0,
    newExpenses: { transportation: 50000, equipment: 0, meals: 0, childcare: 0, other: 0 },
    additionalTime: { commute: 2, preparation: 0, recovery: 1 },
  };
  const results = calculateNetHourlyRate(inputs);
  expect(results.netHourlyRate).toBeGreaterThan(0);
  expect(results.netHourlyRate).toBeLessThan(inputs.grossHourlyRate);
});

// High expenses scenario
test('high expenses reduce net rate significantly', () => {
  const inputs = { /* ... */ newExpenses: { transportation: 800000, /* ... */ } };
  const results = calculateNetHourlyRate(inputs);
  expect(results.percentageReduction).toBeGreaterThan(50);
});
```

### Requirements

- Requirements: REQ-1, REQ-3, REQ-5

---

## Task 4: Create FI Impact Calculation Module

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 1

### Description

Implement FI timeline impact calculations showing how additional income affects financial independence date.

### Acceptance Criteria

- [ ] `calculateFIImpact()` calculates years to FI
- [ ] Months saved calculation correct
- [ ] Impact categorization works (minimal/moderate/significant)
- [ ] Handles edge cases (undefined FI inputs, zero savings)
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/lib/calculations/fiImpact.ts`
2. Implement `calculateFIImpact(fiInputs: FIInputs, netAdditionalIncome: number): FIImpact`
   - Calculate current annual savings (income × savings rate)
   - Calculate new annual savings (current + additional)
   - Calculate years to FI without additional income
   - Calculate years to FI with additional income
   - Calculate months saved
   - Categorize impact (<6mo = minimal, 6-24mo = moderate, >24mo = significant)
   - Return FIImpact object
3. Add edge case handling:
   - Zero savings rate → Infinity years to FI
   - Negative net additional income → Longer FI timeline
   - Already at FI → Zero years
4. Add unit tests
5. Add JSDoc documentation

### Files to Create/Modify

- `src/lib/calculations/fiImpact.ts` (create)
- `tests/lib/calculations/fiImpact.test.ts` (create)
- `src/lib/calculations/index.ts` (update exports)

### Test Cases

```typescript
test('calculates FI impact correctly', () => {
  const fiInputs = {
    currentNetWorth: 1000000,
    fiNumber: 10000000,
    currentSavingsRate: 30,
  };
  const netAdditionalIncome = 500000;
  const impact = calculateFIImpact(fiInputs, netAdditionalIncome);
  expect(impact.monthsSaved).toBeGreaterThan(0);
  expect(impact.newYearsToFI).toBeLessThan(impact.currentYearsToFI);
});

test('categorizes significant impact correctly', () => {
  const impact = calculateFIImpact(/* large additional income */, 2000000);
  expect(impact.impactCategory).toBe('significant');
});
```

### Requirements

- Requirements: REQ-4

---

## Task 5: Create Recommendation Generation Module

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 1, Task 4

### Description

Implement logic to generate plain-language recommendations based on calculation results.

### Acceptance Criteria

- [ ] `generateRecommendation()` returns appropriate verdict
- [ ] Verdict categories work: excellent, good, modest, poor, negative
- [ ] Summary text is clear and actionable
- [ ] Reasons list key factors
- [ ] Considerations include non-financial factors
- [ ] Color coding matches verdict
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/lib/utils/recommendations.ts`
2. Implement `generateRecommendation(inputs: RecommendationInputs): Recommendation`
   - Determine verdict based on:
     - Net rate vs actual wage difference (primary factor)
     - Expense percentage of gross income
     - FI impact (if available)
   - Generate summary text based on verdict
   - Create reasons list with key metrics
   - Add non-financial considerations
   - Assign color (success/warning/error/neutral)
   - Return Recommendation object
3. Define verdict logic:
   - `excellent`: Net rate >50% higher than actual wage
   - `good`: Net rate 15-50% higher than actual wage
   - `modest`: Net rate ±15% of actual wage
   - `poor`: Net rate 15-50% lower than actual wage
   - `negative`: Net rate ≤0 or >50% lower than actual wage
4. Add unit tests for each verdict category
5. Add JSDoc documentation

### Files to Create/Modify

- `src/lib/utils/recommendations.ts` (create)
- `tests/lib/utils/recommendations.test.ts` (create)
- `src/lib/utils/index.ts` (update exports if exists)

### Test Cases

```typescript
test('recommends excellent for high net rate', () => {
  const recommendation = generateRecommendation({
    netHourlyRate: 4000,
    grossHourlyRate: 4500,
    actualWageDifference: 1500,
    actualWageDifferencePercent: 60,
    totalNewExpenses: 50000,
    grossAnnualIncome: 2000000,
  });
  expect(recommendation.verdict).toBe('excellent');
  expect(recommendation.color).toBe('success');
});

test('recommends poor for low net rate', () => {
  const recommendation = generateRecommendation({
    netHourlyRate: 1000,
    actualWageDifference: -1500,
    actualWageDifferencePercent: -60,
    /* ... */
  });
  expect(recommendation.verdict).toBe('poor');
  expect(recommendation.color).toBe('error');
});
```

### Requirements

- Requirements: REQ-6

---

## Task 6: Create Opportunity Presets Configuration

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 1

### Description

Define preset configurations for common side income scenarios in Iceland.

### Acceptance Criteria

- [ ] 5 opportunity presets defined
- [ ] Each preset has realistic Icelandic values
- [ ] Presets cover: overtime, freelance, retail, delivery, tutoring
- [ ] Helper functions for preset selection
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/lib/presets/opportunityPresets.ts`
2. Define `OPPORTUNITY_PRESETS: OpportunityPreset[]` with 5 presets:
   - **Overtime at Current Job**: 1.5× rate, no new commute, some fatigue
   - **Remote Freelance Work**: ~5000 kr/hr, equipment costs, no commute
   - **Part-Time Retail/Service**: ~1800 kr/hr, commute, meals
   - **Delivery/Rideshare**: ~2500 kr/hr, high car costs
   - **Tutoring/Teaching**: ~4500 kr/hr, travel to students, prep time
3. Add helper functions:
   - `getPresetById(id: string): OpportunityPreset | undefined`
   - `getPresetsByCategory(category: string): OpportunityPreset[]`
4. Add comprehensive JSDoc with Iceland-specific context
5. Add unit tests
6. Update barrel export

### Files to Create/Modify

- `src/lib/presets/opportunityPresets.ts` (create)
- `tests/lib/presets/opportunityPresets.test.ts` (create)
- `src/lib/presets/index.ts` (update exports)

### Requirements

- Requirements: REQ-7

---

## Task 7: Create Additional Income Context

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: High
**Dependencies**: Task 1-6

### Description

Create React context for managing additional income calculator state, integrating with CalculatorContext.

### Acceptance Criteria

- [ ] Context provides all inputs and setters
- [ ] Context auto-loads actual wage from CalculatorContext
- [ ] Results auto-calculate when inputs change
- [ ] Opportunity CRUD functions work (max 5)
- [ ] Persistence to localStorage works
- [ ] Export/import functionality works
- [ ] Debounced auto-save implemented
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/context/AdditionalIncomeContext.tsx`
2. Define `AdditionalIncomeContextType` interface
3. Create `AdditionalIncomeProvider` component:
   - State for `inputs` using `useState`
   - State for `opportunities` array
   - `useCalculator()` hook to access CalculatorContext
   - Auto-load actual wage and annual income on mount
   - `useMemo` for calculated results (call `calculateNetHourlyRate`)
   - Implement input update functions (updateAdditionalIncome, updateNewExpenses, etc.)
   - Implement opportunity CRUD:
     - `saveCurrentAsOpportunity(name: string)` - max 5
     - `loadOpportunity(id: string)` - load inputs from saved opportunity
     - `deleteOpportunity(id: string)`
   - Implement persistence:
     - `saveToStorage()` - localStorage
     - `loadFromStorage()` - on mount
     - Debounced auto-save (500ms)
     - `exportData()` - download JSON
     - `importData(file: File)` - validate and load
     - `resetAll()` - clear everything
4. Create `useAdditionalIncome()` hook for consuming context
5. Add error handling and validation
6. Add comprehensive tests

### Files to Create/Modify

- `src/context/AdditionalIncomeContext.tsx` (create)
- `tests/context/AdditionalIncomeContext.test.tsx` (create)
- `context/modules/AdditionalIncomeContext.md` (documentation)

### Requirements

- Requirements: REQ-1, REQ-8

---

## Task 8: Create Custom Hooks

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create reusable custom hooks for additional income calculations and comparisons.

### Acceptance Criteria

- [ ] `useAdditionalIncome()` hook returns results from inputs
- [ ] `useTaxCalculator()` hook returns tax breakdown
- [ ] `useOpportunityComparison()` hook identifies best opportunities
- [ ] All hooks properly memoized
- [ ] Unit tests written and passing

### Implementation Steps

1. Create `src/hooks/useAdditionalIncome.ts`
   - Accept inputs, return memoized results
   - Call `calculateNetHourlyRate()` inside `useMemo`
2. Create `src/hooks/useTaxCalculator.ts`
   - Accept current income and additional income
   - Return tax breakdown using `calculateMarginalTax()`
3. Create `src/hooks/useOpportunityComparison.ts`
   - Accept opportunities array
   - Return best opportunity for each metric:
     - Highest net rate
     - Highest monthly income
     - Greatest FI impact
   - Use `useMemo` for performance
4. Update `src/hooks/index.ts` barrel export
5. Add comprehensive tests

### Files to Create/Modify

- `src/hooks/useAdditionalIncome.ts` (create)
- `src/hooks/useTaxCalculator.ts` (create)
- `src/hooks/useOpportunityComparison.ts` (create)
- `src/hooks/index.ts` (update exports)
- `tests/hooks/useAdditionalIncome.test.ts` (create)
- `tests/hooks/useTaxCalculator.test.ts` (create)
- `tests/hooks/useOpportunityComparison.test.ts` (create)

### Requirements

- Requirements: REQ-1, REQ-2, REQ-8

---

## Task 9: Create Additional Income Inputs Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7, base UI components

### Description

Create component for inputting additional income details (gross rate, hours, weeks, bonus).

### Acceptance Criteria

- [ ] Displays all additional income fields
- [ ] Uses appropriate input types (currency, number)
- [ ] Shows validation errors
- [ ] Updates context on change
- [ ] Accessible (labels, ARIA)
- [ ] Responsive layout

### Implementation Steps

1. Create `src/components/additional-income/AdditionalIncomeInputs.tsx`
2. Add input for gross hourly rate (CurrencyInput)
3. Add input for hours per week (NumberInput, 0-60)
4. Add input for weeks per year (NumberInput, 1-52, default 50)
5. Add input for one-time bonus (CurrencyInput, optional)
6. Connect to AdditionalIncomeContext via `useAdditionalIncome()`
7. Add validation error display
8. Style with Tailwind (Card layout)
9. Add help text/tooltips
10. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/AdditionalIncomeInputs.tsx` (create)
- `src/components/additional-income/index.ts` (create barrel export)
- `tests/components/additional-income/AdditionalIncomeInputs.test.tsx` (create)

### Requirements

- Requirements: REQ-1

---

## Task 10: Create New Expense Inputs Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7, Task 6, base UI components

### Description

Create component for inputting new expenses incurred by additional work.

### Acceptance Criteria

- [ ] Displays all expense fields
- [ ] Shows total new expenses
- [ ] Provides transportation preset options
- [ ] Shows validation errors
- [ ] Updates context on change
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/NewExpenseInputs.tsx`
2. Add expense fields (all CurrencyInput):
   - Transportation costs
   - Equipment/tools
   - Additional meals
   - Extra childcare
   - Other expenses
3. Add total expenses display in header
4. Optional: Add transportation preset selector (bike, car, transit, none)
5. Add warning if expenses > 50% of gross income
6. Connect to context
7. Style with Card layout
8. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/NewExpenseInputs.tsx` (create)
- `tests/components/additional-income/NewExpenseInputs.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-3

---

## Task 11: Create Additional Time Inputs Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 7, base UI components

### Description

Create component for inputting additional time costs (commute, preparation, recovery).

### Acceptance Criteria

- [ ] Displays all time fields (weekly hours)
- [ ] Shows total additional hours
- [ ] Shows validation errors
- [ ] Updates context on change
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/AdditionalTimeInputs.tsx`
2. Add time fields (all NumberInput, 0-40 hrs/week, step 0.5):
   - Commute time
   - Preparation time
   - Recovery/fatigue time
3. Add total additional hours display in header
4. Connect to context
5. Style with Card layout
6. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/AdditionalTimeInputs.tsx` (create)
- `tests/components/additional-income/AdditionalTimeInputs.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-1

---

## Task 12: Create FI Impact Inputs Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 7, base UI components

### Description

Create optional component for FI planning inputs (collapsible/expandable section).

### Acceptance Criteria

- [ ] Section is collapsible
- [ ] Displays FI input fields when expanded
- [ ] Shows help text explaining FI impact
- [ ] Updates context on change
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/FIImpactInputs.tsx`
2. Add collapsible Card with "Optional: See FI Timeline Impact" header
3. Add FI input fields:
   - Current net worth (CurrencyInput)
   - FI number/target (CurrencyInput)
   - Current savings rate (NumberInput, 0-100%)
4. Add help text explaining what FI impact shows
5. Connect to context
6. Style collapsed/expanded states
7. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/FIImpactInputs.tsx` (create)
- `tests/components/additional-income/FIImpactInputs.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-4

---

## Task 13: Create Net Rate Display Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create component to display the calculated net hourly rate prominently.

### Acceptance Criteria

- [ ] Shows net hourly rate prominently
- [ ] Shows gross hourly rate for comparison
- [ ] Shows percentage reduction badge
- [ ] Color-coded based on comparison to actual wage
- [ ] Shows loading state
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/NetRateDisplay.tsx`
2. Display net hourly rate (large, prominent - text-5xl or text-6xl)
3. Display gross hourly rate (smaller, for comparison)
4. Display percentage reduction badge
5. Add color coding:
   - Success (green): Net > actual wage
   - Warning (yellow): Net 70-100% of actual wage
   - Error (red): Net < 70% of actual wage
6. Handle null/loading states
7. Add smooth transitions
8. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/NetRateDisplay.tsx` (create)
- `tests/components/additional-income/NetRateDisplay.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-1, REQ-5

---

## Task 14: Create Tax Breakdown Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create component to display tax calculation breakdown clearly.

### Acceptance Criteria

- [ ] Shows current tax bracket
- [ ] Shows marginal tax rate on additional income
- [ ] Highlights bracket jump if applicable
- [ ] Shows total marginal tax in ISK
- [ ] Includes tax disclaimer
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/TaxBreakdown.tsx`
2. Display current tax bracket and rate
3. Display marginal tax rate on additional income
4. If bracket jump, show warning badge
5. Display total marginal tax amount
6. Add tax disclaimer text (small, bottom of component)
7. Style with Card (outlined or elevated)
8. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/TaxBreakdown.tsx` (create)
- `tests/components/additional-income/TaxBreakdown.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-2

---

## Task 15: Create Comparison Display Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create component to compare additional income net rate with current actual wage.

### Acceptance Criteria

- [ ] Shows current actual wage
- [ ] Shows additional income net rate
- [ ] Shows difference (ISK and %)
- [ ] Visual bar chart comparison
- [ ] Success/warning/error indicator
- [ ] Contextual message

### Implementation Steps

1. Create `src/components/additional-income/ComparisonDisplay.tsx`
2. Display current actual wage (from CalculatorContext)
3. Display additional income net rate
4. Display difference in ISK and percentage
5. Add visual comparison (bar chart or side-by-side bars)
6. Add indicator based on comparison
7. Add contextual message (e.g., "This pays better than your current work")
8. Style with Card
9. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/ComparisonDisplay.tsx` (create)
- `tests/components/additional-income/ComparisonDisplay.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-5

---

## Task 16: Create Recommendation Summary Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create component to display plain-language recommendation summary.

### Acceptance Criteria

- [ ] Shows verdict badge (excellent/good/modest/poor/negative)
- [ ] Displays summary text
- [ ] Lists key reasons
- [ ] Shows non-financial considerations
- [ ] Color-coded appropriately
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/RecommendationSummary.tsx`
2. Display verdict badge with color coding
3. Display summary paragraph
4. Display reasons as bullet list
5. Display non-financial considerations section
6. Add appropriate icons for verdict
7. Style with Card (gradient background based on verdict)
8. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/RecommendationSummary.tsx` (create)
- `tests/components/additional-income/RecommendationSummary.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-6

---

## Task 17: Create Opportunity Presets Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 6, Task 7

### Description

Create component to select from preset opportunity scenarios.

### Acceptance Criteria

- [ ] Displays preset buttons for each scenario
- [ ] Shows preset description on hover/tap
- [ ] Applies preset values to inputs
- [ ] Allows customization after preset applied
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/OpportunityPresets.tsx`
2. Display preset buttons (5 presets)
3. Add tooltips/descriptions for each preset
4. Handle preset selection (call context.applyPreset or similar)
5. Show which preset is active (if any)
6. Style as button group or card with buttons
7. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/OpportunityPresets.tsx` (create)
- `tests/components/additional-income/OpportunityPresets.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-7

---

## Task 18: Create Opportunity Comparison Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: High
**Dependencies**: Task 7, Task 8

### Description

Create component to display and compare saved opportunities side-by-side.

### Acceptance Criteria

- [ ] Shows up to 5 saved opportunities
- [ ] Displays key metrics for each
- [ ] Highlights best opportunity on each metric
- [ ] Allows loading opportunity into calculator
- [ ] Allows deleting opportunity
- [ ] Responsive (stacks on mobile)
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/OpportunityComparison.tsx`
2. Use `useOpportunityComparison()` hook to identify best opportunities
3. Display opportunities as table or card grid:
   - Opportunity name
   - Gross hourly rate
   - Net hourly rate
   - Hours per week
   - Monthly net income
   - FI impact (if available)
4. Highlight best on each metric (background color or badge)
5. Add "Load" button for each opportunity
6. Add "Delete" button for each opportunity
7. Make responsive (table → cards on mobile)
8. Add empty state if no opportunities saved
9. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/OpportunityComparison.tsx` (create)
- `tests/components/additional-income/OpportunityComparison.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-8

---

## Task 19: Create Opportunity Manager Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 7

### Description

Create component to save current inputs as a named opportunity.

### Acceptance Criteria

- [ ] Allows naming and saving current opportunity
- [ ] Shows count of saved opportunities (X/5)
- [ ] Disables save when limit reached
- [ ] Shows list of saved opportunities
- [ ] Provides delete functionality
- [ ] Accessible

### Implementation Steps

1. Create `src/components/additional-income/OpportunityManager.tsx`
2. Add input for opportunity name
3. Add "Save Opportunity" button
4. Show count badge (e.g., "3/5 saved")
5. Disable save button when 5 opportunities saved
6. Display list of saved opportunities with delete buttons
7. Connect to context CRUD functions
8. Style with Card
9. Add validation (non-empty name, unique names)
10. Add unit tests

### Files to Create/Modify

- `src/components/additional-income/OpportunityManager.tsx` (create)
- `tests/components/additional-income/OpportunityManager.test.tsx` (create)
- `src/components/additional-income/index.ts` (update)

### Requirements

- Requirements: REQ-8

---

## Task 20: Create Additional Income Page

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: High
**Dependencies**: Task 9-19

### Description

Assemble all components into the main additional income calculator page.

### Acceptance Criteria

- [ ] All input sections displayed
- [ ] All results sections displayed
- [ ] Opportunity presets accessible
- [ ] Opportunity comparison visible
- [ ] Save/export functionality works
- [ ] Responsive layout
- [ ] Accessible
- [ ] SEO metadata added

### Implementation Steps

1. Create `src/app/additional-income/page.tsx`
2. Wrap with `AdditionalIncomeProvider`
3. Add hero section:
   - Title: "Is This Side Hustle Worth Your Time?"
   - Brief explanation
   - Link to Actual Hourly Wage Calculator (if not completed)
4. Layout left column (inputs):
   - OpportunityPresets
   - Current work info display (auto-loaded, read-only)
   - AdditionalIncomeInputs
   - NewExpenseInputs
   - AdditionalTimeInputs
   - FIImpactInputs (collapsible, optional)
   - OpportunityManager
5. Layout right column (results):
   - NetRateDisplay
   - TaxBreakdown
   - ComparisonDisplay
   - Monthly net income display
   - FI impact display (if inputs provided)
   - RecommendationSummary
6. Add OpportunityComparison section below (full width)
7. Add export/import buttons
8. Add footer with disclaimers
9. Make responsive (stack columns on mobile)
10. Add SEO metadata
11. Add page-level loading states

### Files to Create/Modify

- `src/app/additional-income/page.tsx` (create)
- `src/app/additional-income/layout.tsx` (create if needed)

### Requirements

- Requirements: All REQ-1 through REQ-9

---

## Task 21: Add Navigation Link

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 20

### Description

Add link to additional income calculator from main navigation and related pages.

### Acceptance Criteria

- [ ] Link added to main navigation (if exists)
- [ ] Link added to Actual Hourly Wage Calculator page
- [ ] Link added to salary calculators section
- [ ] Links accessible and labeled correctly

### Implementation Steps

1. Add link to main navigation component
2. Add "Next: Additional Income Impact" link on Actual Hourly Wage page
3. Add to calculator index/overview page (if exists)
4. Ensure link text is descriptive
5. Test navigation flow

### Files to Create/Modify

- `src/components/layout/Navigation.tsx` (update)
- `src/app/page.tsx` (update if needed)
- Other navigation files as needed

### Requirements

- Requirements: General usability

---

## Task 22: Write Unit Tests

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 2-6

### Description

Ensure comprehensive unit test coverage for all calculation functions.

### Acceptance Criteria

- [ ] 100% coverage of calculation functions
- [ ] Edge cases tested
- [ ] All tests passing
- [ ] Test documentation added

### Implementation Steps

1. Review existing tests from Task 2-6
2. Add edge case tests:
   - Zero values
   - Negative net income
   - Very high expenses
   - Bracket boundary conditions
   - Infinity/undefined handling
3. Add integration tests for calculation flow
4. Run coverage report
5. Document test scenarios

### Files to Create/Modify

- All `tests/lib/calculations/*.test.ts` files
- Coverage report generation

### Requirements

- Requirements: All calculation requirements

---

## Task 23: Write Component Tests

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 9-19

### Description

Write comprehensive tests for React components.

### Acceptance Criteria

- [ ] All components have render tests
- [ ] Interaction tests for inputs
- [ ] Context integration tests
- [ ] Accessibility tests
- [ ] All tests passing

### Implementation Steps

1. Review existing tests from Task 9-19
2. Add interaction tests (input changes, button clicks)
3. Add context integration tests
4. Add accessibility tests (ARIA, keyboard navigation)
5. Add snapshot tests where appropriate
6. Run test suite

### Files to Create/Modify

- All `tests/components/additional-income/*.test.tsx` files

### Requirements

- Requirements: All component requirements

---

## Task 24: Write E2E Tests

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 20

### Description

Write end-to-end tests for critical user flows.

### Acceptance Criteria

- [ ] Complete calculation flow tested
- [ ] Preset application tested
- [ ] Save/load opportunity tested
- [ ] Export/import tested
- [ ] Mobile flow tested
- [ ] All tests passing

### Implementation Steps

1. Set up Playwright or Cypress
2. Write test: Enter inputs → See results → Verify recommendation
3. Write test: Apply preset → Customize → Save opportunity
4. Write test: Save opportunity → Reload page → Load opportunity
5. Write test: Export data → Import → Verify restoration
6. Write test: Mobile viewport flow
7. Configure CI to run E2E tests

### Files to Create/Modify

- `e2e/additional-income.spec.ts` (create)
- CI configuration

### Requirements

- Requirements: All requirements (end-to-end validation)

---

## Task 25: Optimize Performance

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 20

### Description

Optimize for fast load times and smooth interaction.

### Acceptance Criteria

- [ ] Calculations complete in < 100ms
- [ ] Page load < 2s on 3G
- [ ] No unnecessary re-renders
- [ ] Lighthouse score > 90

### Implementation Steps

1. Add debounce to input changes (300ms)
2. Memoize calculation results
3. Lazy load OpportunityComparison if not used
4. Optimize bundle size
5. Run Lighthouse audit
6. Fix performance issues
7. Add performance monitoring

### Files to Create/Modify

- Various files for optimization

### Requirements

- Non-functional requirements (performance)

---

## Task 26: Add Accessibility Features

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 20

### Description

Ensure WCAG 2.1 AA compliance.

### Acceptance Criteria

- [ ] All inputs have labels
- [ ] Focus indicators visible
- [ ] Color contrast meets 4.5:1
- [ ] Screen reader compatible
- [ ] Keyboard navigable
- [ ] ARIA labels appropriate

### Implementation Steps

1. Audit all components for accessibility
2. Add ARIA labels where needed
3. Ensure focus states visible
4. Test with screen reader (VoiceOver/NVDA)
5. Test keyboard-only navigation
6. Check color contrast ratios
7. Fix any violations

### Files to Create/Modify

- Various component files (accessibility updates)

### Requirements

- Non-functional requirements (accessibility)

---

## Task 27: Implement Mobile Responsive Layout

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: Task 20

### Description

Ensure all components work well on mobile devices.

### Acceptance Criteria

- [ ] Works on 320px+ screens
- [ ] Touch-friendly inputs (44px+ tap targets)
- [ ] No horizontal scroll
- [ ] Sticky result header on mobile
- [ ] Charts/comparisons adapted for mobile

### Implementation Steps

1. Test all components at mobile breakpoints
2. Update layouts with responsive Tailwind classes
3. Make inputs touch-friendly (min 16px font for iOS)
4. Add sticky NetRateDisplay on mobile
5. Optimize OpportunityComparison for mobile (card layout)
6. Test on real mobile devices

### Files to Create/Modify

- Various component files (responsive updates)

### Requirements

- Requirements: REQ-9

---

## Task 28: Add Documentation

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: Task 1-27

### Description

Create user-facing and developer documentation.

### Acceptance Criteria

- [ ] User guide written
- [ ] Calculator methodology explained
- [ ] Tax calculation methodology documented
- [ ] API documentation for functions
- [ ] Context documentation in context/modules/

### Implementation Steps

1. Create user guide in app (help section or modal)
2. Document tax calculation methodology
3. Add JSDoc to all public functions
4. Create module documentation in context/modules/
5. Update main README if needed

### Files to Create/Modify

- `context/modules/AdditionalIncomeContext.md` (already done in Task 7)
- `context/modules/TaxCalculations.md` (create)
- `context/modules/OpportunityComparison.md` (create)
- User-facing help content

### Requirements

- General documentation requirements

---

## Summary

| Task | Description | Complexity | Dependencies |
|------|-------------|------------|--------------|
| 1 | TypeScript Types | Simple | None |
| 2 | Tax Calculation Module | Medium | 1 |
| 3 | Additional Income Calculation | Medium | 1, 2 |
| 4 | FI Impact Calculation | Medium | 1 |
| 5 | Recommendation Generation | Medium | 1, 4 |
| 6 | Opportunity Presets | Simple | 1 |
| 7 | Additional Income Context | High | 1-6 |
| 8 | Custom Hooks | Medium | 7 |
| 9 | Additional Income Inputs | Medium | 7 |
| 10 | New Expense Inputs | Medium | 6, 7 |
| 11 | Additional Time Inputs | Simple | 7 |
| 12 | FI Impact Inputs | Simple | 7 |
| 13 | Net Rate Display | Medium | 7 |
| 14 | Tax Breakdown | Medium | 7 |
| 15 | Comparison Display | Medium | 7 |
| 16 | Recommendation Summary | Medium | 7 |
| 17 | Opportunity Presets Component | Simple | 6, 7 |
| 18 | Opportunity Comparison | High | 7, 8 |
| 19 | Opportunity Manager | Medium | 7 |
| 20 | Additional Income Page | High | 9-19 |
| 21 | Navigation Link | Simple | 20 |
| 22 | Unit Tests | Medium | 2-6 |
| 23 | Component Tests | Medium | 9-19 |
| 24 | E2E Tests | Medium | 20 |
| 25 | Performance Optimization | Simple | 20 |
| 26 | Accessibility Features | Medium | 20 |
| 27 | Mobile Responsive Layout | Medium | 20 |
| 28 | Documentation | Simple | 1-27 |

**Total Tasks**: 28

**Critical Path**: 1 → 2 → 3 → 4/5/6 → 7 → 8 → 9-19 → 20 → 21-28

**Estimated Total Time**: 120-150 hours

**Parallel Work Opportunities**:
- Tasks 4, 5, 6 can be done in parallel after Task 3
- Tasks 9-19 (components) can be parallelized after Task 7
- Tasks 22-28 (testing, polish) can overlap with component development

## Notes

### Integration with Existing Calculator

This feature heavily integrates with the Actual Hourly Wage Calculator:
- Auto-loads `currentActualWage` from CalculatorContext
- Auto-loads `currentAnnualIncome` from CalculatorContext
- Reuses existing UI components (Input, Button, Card, etc.)
- Follows same privacy-first, localStorage approach
- Uses similar calculation engine patterns

### Tax Calculation Disclaimer

Every display of tax information must include the disclaimer:
"Tax calculations are estimates for educational purposes. Actual taxes depend on your complete financial situation. Consult a tax professional for accurate advice."

### Optional Worktree

Worktrees are optional for this feature. It can be implemented directly in the main branch alongside the Actual Hourly Wage Calculator.

Consider worktree if:
- Parallel development with another team member
- Want to experiment with complex calculations safely
- Need isolated testing environment

### Future Enhancements (Not in Scope)

These are explicitly out of scope but may be added later:
- Real-time tax API integration
- Municipality-specific útsvar selector
- Self-employment tax calculations
- Compound interest in FI calculations
- Burnout risk assessment based on total hours
- Career advancement probability modeling

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Draft - Ready for Implementation
