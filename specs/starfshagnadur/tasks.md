# Implementation Tasks: Starfshagnaðarmælir (Job Profit/Loss Scorecard)

## Overview

**Feature**: Starfshagnaðarmælir (Job Profit/Loss Scorecard)
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)
**Design**: [design.md](./design.md)

The Job Profit/Loss Scorecard helps users evaluate whether their job is truly profitable by tracking all job-related income, expenses, and time costs. It calculates a "real hourly wage" after all expenses and shows a profitability score to help users make informed career decisions.

## Implementation Strategy

**Strategy**: Hybrid (Foundation-First + Feature-Slice)

**Rationale**:
1. Start with foundation (types, calculations, constants) to establish data models
2. Build core feature slice (income/expenses/time input + basic results display)
3. Expand with advanced features (breakdowns, scenarios, recommendations)
4. This allows early validation while maintaining solid architecture

**Sequencing**:
```
Foundation (Types + Calculations)
  → Core Input Forms + Basic Results
  → Context Integration + Storage
  → UI Components (Breakdowns, Scenarios)
  → Advanced Features (Recommendations)
  → Testing + Polish
```

**Estimated Timeline**: 9-11 major components, approximately 35-45 implementation tasks

## Prerequisites

Before starting these tasks:
- [x] Project is initialized (Next.js + React + TypeScript + Tailwind)
- [x] Base UI components exist (Input, Button, Card, Select)
- [x] CalculatorContext is in place
- [x] localStorage hooks are implemented
- [x] Actual Hourly Wage calculator is implemented (provides actualHourlyWage)

## Task List

### 1. Foundation - TypeScript Types and Interfaces

#### 1.1 Create Job Profit Type Definitions
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: None
**Time Estimate**: 2-3 hours

**Objective**: Define all TypeScript interfaces and types for job profit feature in a new dedicated file.

**Implementation Details**:
- Create `src/types/jobProfit.ts`
- Define `JobProfitIncome` interface (grossAnnualSalary, annualBonuses, benefitsValue)
- Define `JobProfitExpense` interface with id, name, annualCost, category
- Define `JobExpenseCategory` type (clothing, meals, equipment, education, membership, other)
- Define `JobProfitTime` interface (weeklyWorkHours, weeklyUnpaidOvertime, daily time fields in minutes)
- Define `JobProfitResults` interface (income totals, expenses, net income, hours, wages, profitability)
- Define `ProfitabilityLevel` type (excellent, good, fair, poor, loss)
- Define breakdown interfaces: `JobExpenseBreakdownItem`, `JobTimeBreakdownItem`
- Define `JobTimeCategory` type (work, overtime, prep, recovery, commute)
- Define `JobProfitScenario` interface
- Define `ScenarioType` type (current, partTime75, partTime50, otherJob, selfEmployed)
- Define root `JobProfitData` interface containing all data

**Acceptance Criteria**:
- [ ] All interfaces match design specification
- [ ] Types are exported and accessible
- [ ] No TypeScript compilation errors
- [ ] Proper JSDoc comments on all interfaces

**Testing**:
- Type compilation check
- Import check from other files

**Requirements Traceability**: NS-1, NS-2, NS-3, NS-4, NS-5, NS-6, NS-7

**Files to Create**:
- `src/types/jobProfit.ts` (new file, ~150-200 lines)

---

#### 1.2 Update Shared Calculator Types
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 1.1
**Time Estimate**: 1 hour

**Objective**: Update existing calculator types to include job profit data in the storage schema.

**Implementation Details**:
- Update `src/types/calculator.ts`
- Update `StoredState` interface to include `jobProfitData?: JobProfitData` (optional for backward compatibility)
- Bump version number to 2 in storage schema
- Ensure backward compatibility with version 1 data

**Acceptance Criteria**:
- [ ] StoredState includes jobProfitData field
- [ ] Field is optional (for migration compatibility)
- [ ] No breaking changes to existing types
- [ ] Version field updated to 2

**Testing**:
- Type checking
- Existing code still compiles

**Requirements Traceability**: NS-1 through NS-7 (storage requirements)

**Files to Modify**:
- `src/types/calculator.ts` (update existing)

---

### 2. Foundation - Calculation Functions

#### 2.1 Create Default Values and Constants
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 1.1
**Time Estimate**: 1-2 hours

**Objective**: Define default values, category labels, and expense presets for job profit calculations.

**Implementation Details**:
- Create/update `src/lib/defaults.ts`
- Define `DEFAULT_JOB_PROFIT_INCOME` (all zeros)
- Define `DEFAULT_JOB_PROFIT_TIME` (40 hour work week, zeros for extras)
- Define `DEFAULT_JOB_PROFIT_DATA` with targetHourlyWage of 1500 ISK (minimum wage)
- Create `src/lib/constants/jobProfit.ts` for constants
- Define `JOB_EXPENSE_CATEGORY_LABELS` mapping category keys to Icelandic labels
- Define `JOB_TIME_CATEGORY_LABELS` for time categories
- Define `JOB_EXPENSE_PRESETS` array with common Icelandic job expenses (10+ presets)
- Include presets for: work clothing, lunch out, work equipment, training courses, union dues, professional licenses

**Acceptance Criteria**:
- [ ] All default values match design specification
- [ ] Category labels are in Icelandic
- [ ] Expense presets reflect Icelandic market (ISK amounts)
- [ ] At least 10 useful expense presets
- [ ] Constants are exported and typed

**Testing**:
- Import and use constants in test file
- Verify preset values are reasonable

**Requirements Traceability**: NS-1, NS-2 (presets), all user stories (defaults)

**Files to Create/Modify**:
- `src/lib/defaults.ts` (update existing)
- `src/lib/constants/jobProfit.ts` (new file)

---

#### 2.2 Implement Core Calculation Functions
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 1.1, 2.1
**Time Estimate**: 3-4 hours

**Objective**: Implement pure calculation functions for income, expenses, time, and hourly wage calculations.

**Implementation Details**:
- Create `src/lib/calculations/jobProfit.ts`
- Implement `calculateTotalIncome(income: JobProfitIncome): number`
  - Sum grossAnnualSalary + annualBonuses + benefitsValue
- Implement `calculateTotalExpenses(expenses: JobProfitExpense[]): number`
  - Sum all expense annualCost values
- Implement `calculateNetIncome(totalIncome, totalExpenses): number`
  - Return totalIncome - totalExpenses (can be negative)
- Implement `calculateTotalWeeklyHours(time: JobProfitTime): number`
  - Convert daily minutes to weekly hours (multiply by 5 work days)
  - Sum all time components
- Implement `calculateNominalHourlyWage(totalIncome, weeklyWorkHours): number`
  - Divide annual income by (weeklyWorkHours * 52)
- Implement `calculateActualHourlyWage(netIncome, totalWeeklyHours): number`
  - Divide net income by (totalWeeklyHours * 52)
- Implement helper functions for ID generation
- All functions must be pure (no side effects)
- Handle edge cases (division by zero, negative values)

**Acceptance Criteria**:
- [ ] All calculation functions implemented
- [ ] Functions are pure (no side effects)
- [ ] Formulas match requirements specification exactly
- [ ] Edge cases handled (0 hours, 0 income, etc.)
- [ ] Functions properly typed with TypeScript
- [ ] JSDoc comments on all functions

**Testing**:
- Unit tests for each calculation function
- Test edge cases (zeros, negatives)
- Test with realistic Icelandic salary/expense data

**Requirements Traceability**: NS-4 (calculations), all calculation formulas from requirements

**Files to Create**:
- `src/lib/calculations/jobProfit.ts` (new file, ~200-250 lines)

---

#### 2.3 Implement Profitability Score Calculations
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.2
**Time Estimate**: 2-3 hours

**Objective**: Implement profitability scoring and level determination functions.

**Implementation Details**:
- Add to `src/lib/calculations/jobProfit.ts`
- Implement `calculateProfitabilityScore(actualWage, targetWage): number`
  - Return (actualWage / targetWage) * 100
  - Handle division by zero (return 0)
- Implement `getProfitabilityLevel(score: number): ProfitabilityLevel`
  - excellent: >= 125%
  - good: 100-124%
  - fair: 75-99%
  - poor: 50-74%
  - loss: < 50%
- Implement `getProfitabilityColor(level: ProfitabilityLevel): string`
  - Return Tailwind color classes for each level
- Implement `getProfitabilityMessage(level: ProfitabilityLevel): string`
  - Return Icelandic message for each level

**Acceptance Criteria**:
- [ ] Profitability score calculated correctly
- [ ] Level thresholds match design specification
- [ ] Color coding matches design (green/yellow/red)
- [ ] Messages in Icelandic
- [ ] Edge cases handled

**Testing**:
- Unit tests for score calculation
- Test all profitability level boundaries
- Test color/message mappings

**Requirements Traceability**: NS-5 (profitability score)

**Files to Modify**:
- `src/lib/calculations/jobProfit.ts` (add functions)

---

#### 2.4 Implement Breakdown Calculations
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.2
**Time Estimate**: 2-3 hours

**Objective**: Implement functions to calculate expense and time breakdowns by category.

**Implementation Details**:
- Add to `src/lib/calculations/jobProfit.ts`
- Implement `calculateExpenseBreakdown(expenses: JobProfitExpense[]): JobExpenseBreakdownItem[]`
  - Group expenses by category
  - Calculate total amount per category
  - Calculate percentage of total
  - Count number of items per category
  - Sort by amount (highest first)
  - Map to Icelandic labels
- Implement `calculateTimeBreakdown(time: JobProfitTime): JobTimeBreakdownItem[]`
  - Calculate hours per week for each time category
  - Calculate percentage of total time
  - Map to Icelandic labels
  - Sort by hours (highest first)
- Handle empty arrays gracefully

**Acceptance Criteria**:
- [ ] Expense breakdown groups correctly by category
- [ ] Time breakdown calculates all time components
- [ ] Percentages sum to 100%
- [ ] Items sorted by size (largest first)
- [ ] Labels in Icelandic
- [ ] Empty arrays handled

**Testing**:
- Unit tests with various expense combinations
- Test percentage calculations
- Test sorting
- Test empty cases

**Requirements Traceability**: NS-6 (breakdowns)

**Files to Modify**:
- `src/lib/calculations/jobProfit.ts` (add functions)

---

#### 2.5 Implement Main Results Calculation
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.2, 2.3, 2.4
**Time Estimate**: 2-3 hours

**Objective**: Implement the main calculation function that combines all calculations into complete results.

**Implementation Details**:
- Add to `src/lib/calculations/jobProfit.ts`
- Implement `calculateJobProfitability(data: JobProfitData): JobProfitResults`
  - Call all calculation functions
  - Assemble complete JobProfitResults object
  - Include all totals, wages, breakdowns
  - Calculate profitability score and level
  - Handle incomplete data (missing values)
- Function should be the main entry point for all calculations
- Must be pure and performant (no expensive operations)

**Acceptance Criteria**:
- [ ] Main calculation function implemented
- [ ] Returns complete JobProfitResults
- [ ] All sub-calculations called correctly
- [ ] Results are accurate
- [ ] Performance is good (<50ms for typical data)
- [ ] Handles incomplete data gracefully

**Testing**:
- Integration test with complete data
- Test with partial data
- Performance test
- Accuracy test with known values

**Requirements Traceability**: All calculation requirements (NS-4, NS-5, NS-6)

**Files to Modify**:
- `src/lib/calculations/jobProfit.ts` (add main function)

---

### 3. Context Integration and State Management

#### 3.1 Update CalculatorContext Interface
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 1.1, 1.2, 2.5
**Time Estimate**: 1-2 hours

**Objective**: Extend CalculatorContext type definitions to include job profit state and methods.

**Implementation Details**:
- Update `src/context/CalculatorContext.tsx` (type definitions only)
- Add to `CalculatorContextType` interface:
  - `jobProfitData: JobProfitData`
  - `jobProfitResults: JobProfitResults | null`
  - `updateJobProfitIncome: (income: Partial<JobProfitIncome>) => void`
  - `addJobExpense: (expense: Omit<JobProfitExpense, 'id'>) => void`
  - `updateJobExpense: (id: string, updates: Partial<JobProfitExpense>) => void`
  - `deleteJobExpense: (id: string) => void`
  - `updateJobProfitTime: (time: Partial<JobProfitTime>) => void`
  - `updateTargetHourlyWage: (wage: number) => void`
  - `addJobScenario: (scenario: Omit<JobProfitScenario, 'id' | 'createdAt'>) => void`
  - `deleteJobScenario: (id: string) => void`

**Acceptance Criteria**:
- [ ] All job profit methods added to context type
- [ ] Types are correct and complete
- [ ] No TypeScript errors
- [ ] Documentation comments added

**Testing**:
- Type checking passes
- Context interface is complete

**Requirements Traceability**: All user stories (NS-1 through NS-8)

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (type definitions section)

---

#### 3.2 Implement Job Profit State Management
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.1
**Time Estimate**: 3-4 hours

**Objective**: Add job profit state and methods to CalculatorProvider implementation.

**Implementation Details**:
- Update `src/context/CalculatorContext.tsx` (provider implementation)
- Add `jobProfitData` state with `DEFAULT_JOB_PROFIT_DATA` initial value
- Implement all CRUD methods for income, expenses, time
- Implement `addJobExpense` with ID generation
- Implement `updateJobExpense` with immutable updates
- Implement `deleteJobExpense` with filtering
- Implement scenario management methods
- Ensure all updates trigger re-renders
- Maintain immutability in all state updates

**Acceptance Criteria**:
- [ ] jobProfitData state added
- [ ] All CRUD methods implemented
- [ ] Methods update state immutably
- [ ] State changes trigger re-renders
- [ ] ID generation works for expenses
- [ ] No mutation of state

**Testing**:
- Test each CRUD method
- Test immutability
- Test ID generation
- Test state updates trigger renders

**Requirements Traceability**: NS-1, NS-2, NS-3, NS-7

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (provider implementation)

---

#### 3.3 Add Computed Results to Context
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.2, 2.5
**Time Estimate**: 2 hours

**Objective**: Add computed job profit results using useMemo for performance.

**Implementation Details**:
- Update `src/context/CalculatorContext.tsx`
- Add `jobProfitResults` using `useMemo`
- Call `calculateJobProfitability(jobProfitData)` in memo
- Depend on jobProfitData in dependency array
- Memoize to prevent unnecessary recalculations
- Handle null/undefined cases

**Acceptance Criteria**:
- [ ] jobProfitResults computed with useMemo
- [ ] Results update when jobProfitData changes
- [ ] No unnecessary recalculations
- [ ] Results accessible from context
- [ ] Performance is good

**Testing**:
- Test results update on data change
- Test memoization (results don't recalc unnecessarily)
- Performance test

**Requirements Traceability**: NS-4, NS-5, NS-6 (results display)

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (add useMemo)

---

#### 3.4 Implement localStorage Persistence
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.2, 3.3
**Time Estimate**: 2-3 hours

**Objective**: Add job profit data to localStorage save/load functionality with 500ms debounce.

**Implementation Details**:
- Update `src/context/CalculatorContext.tsx` (localStorage section)
- Add jobProfitData to localStorage save in `useEffect`
- Include jobProfitData in debounced save (500ms delay)
- Update load function to read jobProfitData
- Implement migration from version 1 to version 2
- If jobProfitData is missing, use DEFAULT_JOB_PROFIT_DATA
- Update version number in stored data

**Acceptance Criteria**:
- [ ] jobProfitData saved to localStorage
- [ ] Data loaded on context initialization
- [ ] 500ms debounce on auto-save
- [ ] Migration from v1 to v2 works
- [ ] Defaults used for missing data
- [ ] No data loss

**Testing**:
- Test save/load cycle
- Test migration from v1 data
- Test debounce timing
- Test with missing jobProfitData

**Requirements Traceability**: Non-functional requirements (data storage)

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (localStorage hooks)

---

#### 3.5 Update Export/Import Functionality
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 3.4
**Time Estimate**: 1-2 hours

**Objective**: Include job profit data in export/import JSON functionality.

**Implementation Details**:
- Update `src/context/CalculatorContext.tsx` (export/import section)
- Add jobProfitData to `exportData()` function output
- Update JSON structure to include jobProfitData
- Update `importData()` to read jobProfitData from JSON
- Handle backward compatibility (JSON without jobProfitData)
- Update `resetAll()` to reset jobProfitData to defaults

**Acceptance Criteria**:
- [ ] Export includes jobProfitData
- [ ] Import reads jobProfitData
- [ ] Backward compatible with old exports
- [ ] resetAll clears job profit data
- [ ] JSON structure is valid

**Testing**:
- Test export/import cycle
- Test import of old JSON without jobProfitData
- Test resetAll

**Requirements Traceability**: Non-functional (data export/import)

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (export/import methods)

---

### 4. Core UI Components - Input Forms

#### 4.1 Create JobProfitIncomeForm Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 3.3, UI components
**Time Estimate**: 2-3 hours

**Objective**: Build form component for income input (salary, bonuses, benefits).

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitIncomeForm.tsx`
- Use Card layout for form container
- Add Input for grossAnnualSalary (required, ISK, > 0)
- Add Input for annualBonuses (ISK, >= 0)
- Add Input for benefitsValue (ISK, >= 0)
- Use `formatCurrency` for display
- Call `updateJobProfitIncome` on change
- Add field labels in Icelandic
- Add help text explaining each field
- Real-time validation with error messages
- Responsive layout

**Acceptance Criteria**:
- [ ] All three income fields present
- [ ] Validation works (required, positive numbers)
- [ ] Updates context on change
- [ ] Error messages in Icelandic
- [ ] Currency formatting
- [ ] Accessible (labels, ARIA)
- [ ] Responsive design

**Testing**:
- Component render test
- Input change test
- Validation test
- Context update test
- Accessibility test

**Requirements Traceability**: NS-1 (income input)

**Files to Create**:
- `src/components/jobProfit/JobProfitIncomeForm.tsx` (new, ~100-150 lines)

---

#### 4.2 Create JobProfitExpenseForm Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.3, UI components
**Time Estimate**: 3-4 hours

**Objective**: Build modal form for adding/editing individual expenses with preset support.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitExpenseForm.tsx`
- Support two modes: 'add' and 'edit'
- Add preset dropdown for common expenses (use JOB_EXPENSE_PRESETS)
- Add Input for expense name (required, max 100 chars)
- Add Input for annual cost (required, ISK, > 0)
- Add Select for category (6 categories with Icelandic labels)
- When preset selected, auto-fill name, cost, category
- Allow editing of preset values
- Add "Save" and "Cancel" buttons
- Validation for all fields
- Modal or card layout
- Call addJobExpense or updateJobExpense on save

**Acceptance Criteria**:
- [ ] Both add and edit modes work
- [ ] Preset dropdown populated and functional
- [ ] Auto-fill works when preset selected
- [ ] All fields validated
- [ ] Saves to context correctly
- [ ] Cancel works
- [ ] Accessible
- [ ] Icelandic labels and messages

**Testing**:
- Test add mode
- Test edit mode
- Test preset selection
- Test validation
- Test save/cancel
- Test accessibility

**Requirements Traceability**: NS-2 (expense input with presets)

**Files to Create**:
- `src/components/jobProfit/JobProfitExpenseForm.tsx` (new, ~200-250 lines)

---

#### 4.3 Create JobProfitExpenseList Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 4.2
**Time Estimate**: 3-4 hours

**Objective**: Display list of all expenses with edit/delete functionality and category totals.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitExpenseList.tsx`
- Get expenses from context
- Display each expense in Card with name, cost, category
- Add Edit button (opens JobProfitExpenseForm in edit mode)
- Add Delete button with confirmation dialog
- Show empty state when no expenses
- Display category breakdown summary
- Sort by annual cost (highest first)
- Format currency with ISK formatting
- Show category icons/colors
- Responsive grid layout
- Add "Add Expense" button at top

**Acceptance Criteria**:
- [ ] Lists all expenses from context
- [ ] Edit opens form with expense data
- [ ] Delete removes expense (with confirmation)
- [ ] Empty state displayed when needed
- [ ] Category totals shown
- [ ] Sorted by cost
- [ ] Add button works
- [ ] Responsive
- [ ] Accessible

**Testing**:
- Render with expenses
- Render empty state
- Test edit flow
- Test delete with confirmation
- Test add button
- Test sorting
- Accessibility test

**Requirements Traceability**: NS-2 (expense management)

**Files to Create**:
- `src/components/jobProfit/JobProfitExpenseList.tsx` (new, ~200-250 lines)

---

#### 4.4 Create JobProfitTimeForm Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.3, UI components
**Time Estimate**: 3-4 hours

**Objective**: Build form for all time-related inputs with hour/minute conversion.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitTimeForm.tsx`
- Use Card layout
- Add Input for weeklyWorkHours (required, > 0, hours)
- Add Input for weeklyUnpaidOvertime (>= 0, hours)
- Add Input for dailyPrepTimeMinutes (>= 0, minutes)
- Add Input for dailyRecoveryTimeMinutes (>= 0, minutes)
- Add Input for dailyCommuteTimeMinutes (>= 0, minutes)
- Show computed total weekly hours (read-only display)
- Show comparison: "Official: 40 hrs, Actual: 56 hrs"
- Real-time validation
- Help text explaining each time category
- Call updateJobProfitTime on change
- Icelandic labels and help text

**Acceptance Criteria**:
- [ ] All five time fields present
- [ ] Minute fields accept minutes
- [ ] Total weekly hours computed and displayed
- [ ] Comparison shown (official vs actual)
- [ ] Validation works
- [ ] Updates context on change
- [ ] Help text clear
- [ ] Accessible
- [ ] Responsive

**Testing**:
- Component render test
- Input change test
- Total calculation test
- Validation test
- Context update test
- Accessibility test

**Requirements Traceability**: NS-3 (time input)

**Files to Create**:
- `src/components/jobProfit/JobProfitTimeForm.tsx` (new, ~150-200 lines)

---

### 5. Core UI Components - Results Display

#### 5.1 Create JobProfitabilityDisplay Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.3, UI components
**Time Estimate**: 3-4 hours

**Objective**: Display main profitability results with color-coded score.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitabilityDisplay.tsx`
- Get jobProfitResults from context
- Display key metrics in Card layout:
  - Actual hourly wage (large, prominent)
  - Nominal hourly wage (for comparison)
  - Wage reduction (ISK and %)
  - Total annual income
  - Total annual expenses
  - Net annual income
  - Total weekly hours
- Display profitability score with color coding:
  - Green: >= 100%
  - Yellow: 75-99%
  - Red: < 75%
- Show profitability level text ("Excellent", "Fair", etc. in Icelandic)
- Warning message if net income is negative
- Use gradient backgrounds for emphasis
- Large, readable numbers
- Currency and number formatting

**Acceptance Criteria**:
- [ ] All key metrics displayed
- [ ] Actual vs nominal wage comparison clear
- [ ] Profitability score color-coded correctly
- [ ] Warning shown for negative income
- [ ] Numbers formatted correctly (ISK)
- [ ] Visual hierarchy clear
- [ ] Responsive
- [ ] Accessible

**Testing**:
- Render test with positive profitability
- Render test with negative profitability
- Test color coding at boundaries
- Test formatting
- Accessibility test

**Requirements Traceability**: NS-4 (hourly wage), NS-5 (profitability score)

**Files to Create**:
- `src/components/jobProfit/JobProfitabilityDisplay.tsx` (new, ~200-250 lines)

---

#### 5.2 Create JobProfitBreakdownCharts Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 3.3, UI components
**Time Estimate**: 3-4 hours

**Objective**: Display visual breakdowns of expenses and time by category.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitBreakdownCharts.tsx`
- Get expenseBreakdown and timeBreakdown from jobProfitResults
- Create two sections: Expense Breakdown and Time Breakdown
- For each breakdown item, show:
  - Category label (Icelandic)
  - Amount (ISK for expenses, hours for time)
  - Percentage of total
  - Visual progress bar (CSS-based, no external libraries)
- Sort items by size (largest first)
- Color-code categories
- Show tooltips with exact values on hover
- Responsive layout (stack on mobile)
- Use Card layout for each section

**Acceptance Criteria**:
- [ ] Both expense and time breakdowns shown
- [ ] Progress bars show correct percentages
- [ ] Items sorted by size
- [ ] Categories color-coded
- [ ] Labels in Icelandic
- [ ] Tooltips work
- [ ] Responsive
- [ ] No external chart libraries needed
- [ ] Accessible

**Testing**:
- Render test with breakdown data
- Test sorting
- Test percentage calculations
- Test responsive behavior
- Accessibility test

**Requirements Traceability**: NS-6 (breakdowns)

**Files to Create**:
- `src/components/jobProfit/JobProfitBreakdownCharts.tsx` (new, ~250-300 lines)

---

### 6. Advanced Features

#### 6.1 Implement Scenario Calculation Logic
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.5
**Time Estimate**: 2-3 hours

**Objective**: Add scenario generation and calculation functions to calculation library.

**Implementation Details**:
- Add to `src/lib/calculations/jobProfit.ts`
- Implement `generatePartTimeScenario(data: JobProfitData, percentage: 0.75 | 0.50): JobProfitScenario`
  - Multiply income by percentage
  - Multiply time by percentage
  - Multiply expenses by percentage (estimated)
  - Calculate results
  - Return scenario object
- Implement `generateCustomScenario(data: Partial<JobProfitData>, name: string, type: ScenarioType): JobProfitScenario`
  - Allow custom income/expense/time values
  - Calculate results
  - Return scenario object
- Implement `compareScenarios(baseline: JobProfitResults, scenario: JobProfitResults): ScenarioComparison`
  - Calculate differences in ISK and percentages
  - Return comparison object

**Acceptance Criteria**:
- [ ] Part-time scenarios calculate correctly (75%, 50%)
- [ ] Custom scenarios work with user input
- [ ] Comparison shows differences
- [ ] All functions are pure
- [ ] Edge cases handled

**Testing**:
- Unit test for 75% scenario
- Unit test for 50% scenario
- Unit test for custom scenario
- Unit test for comparison
- Test with edge cases

**Requirements Traceability**: NS-7 (scenario comparison)

**Files to Modify**:
- `src/lib/calculations/jobProfit.ts` (add scenario functions)

---

#### 6.2 Create JobProfitScenarioComparison Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: High
**Dependencies**: 6.1, 3.3
**Time Estimate**: 4-5 hours

**Objective**: Build UI for creating and comparing job scenarios side-by-side.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitScenarioComparison.tsx`
- Display current job as baseline (left column)
- Add scenario selector dropdown (part-time 75%, part-time 50%, other job, self-employed)
- When scenario type selected, generate scenario and show in right column
- For custom scenarios, show input form for new values
- Display side-by-side comparison:
  - Income comparison
  - Expense comparison
  - Time comparison
  - Hourly wage comparison
  - Profitability score comparison
- Show differences in ISK and percentages
- Color-code improvements (green) and declines (red)
- Allow saving scenario for later review
- Show up to 3 saved scenarios
- Delete saved scenarios

**Acceptance Criteria**:
- [ ] Scenario selector works
- [ ] Pre-set scenarios (75%, 50%) auto-calculate
- [ ] Custom scenarios allow input
- [ ] Side-by-side comparison displayed
- [ ] Differences calculated correctly
- [ ] Color coding works
- [ ] Can save scenarios (max 3)
- [ ] Can delete scenarios
- [ ] Responsive
- [ ] Accessible

**Testing**:
- Test scenario selection
- Test auto-calculation for presets
- Test custom input
- Test comparison display
- Test save/delete
- Test max 3 scenarios limit
- Accessibility test

**Requirements Traceability**: NS-7 (scenario comparison)

**Files to Create**:
- `src/components/jobProfit/JobProfitScenarioComparison.tsx` (new, ~350-400 lines)

---

#### 6.3 Implement Recommendation Logic
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.5
**Time Estimate**: 3 hours

**Objective**: Create intelligent recommendation engine based on job profit data.

**Implementation Details**:
- Add to `src/lib/calculations/jobProfit.ts`
- Implement `generateRecommendations(results: JobProfitResults, expenses: JobProfitExpense[], time: JobProfitTime): Recommendation[]`
- Recommendation rules (per NS-8):
  - If lunch expenses > 30% of total → suggest bringing lunch from home
  - If recovery time > 2 hrs/day → suggest job may be too stressful
  - If unpaid overtime > 10 hrs/week → suggest negotiating higher pay
  - If commute time > 1 hr/day → suggest finding closer job or remote work
  - If actual hourly wage < 0 → suggest finding new job
- Each recommendation includes:
  - Title (Icelandic)
  - Description (Icelandic)
  - Estimated impact (ISK or hours)
  - Priority (high, medium, low)
- Sort recommendations by estimated impact (highest first)
- Return array of Recommendation objects

**Acceptance Criteria**:
- [ ] All 5 recommendation rules implemented
- [ ] Recommendations in Icelandic
- [ ] Impact estimates calculated
- [ ] Sorted by impact
- [ ] Only applicable recommendations shown
- [ ] Edge cases handled

**Testing**:
- Test each recommendation rule
- Test with data that triggers multiple recommendations
- Test sorting
- Test with no recommendations needed
- Test impact calculations

**Requirements Traceability**: NS-8 (recommendations)

**Files to Modify**:
- `src/lib/calculations/jobProfit.ts` (add recommendation logic)
- `src/types/jobProfit.ts` (add Recommendation interface)

---

#### 6.4 Create JobProfitRecommendations Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 6.3
**Time Estimate**: 2-3 hours

**Objective**: Display personalized recommendations to improve job profitability.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitRecommendations.tsx`
- Get recommendations from recommendation logic
- Display each recommendation in Alert/Card component
- Show priority indicator (icon or color)
- Display title, description, and estimated impact
- Sort by priority/impact
- Use different alert styles for priority levels
- Show empty state if no recommendations ("Your job looks great!")
- Expandable/collapsible details for each recommendation

**Acceptance Criteria**:
- [ ] Recommendations displayed
- [ ] Sorted by priority/impact
- [ ] Priority visually indicated
- [ ] Impact shown clearly
- [ ] Empty state works
- [ ] Expandable details work
- [ ] Accessible
- [ ] Responsive

**Testing**:
- Render with recommendations
- Render empty state
- Test sorting
- Test expand/collapse
- Accessibility test

**Requirements Traceability**: NS-8 (recommendations display)

**Files to Create**:
- `src/components/jobProfit/JobProfitRecommendations.tsx` (new, ~150-200 lines)

---

### 7. Dashboard Integration

#### 7.1 Create JobProfitDashboard Component
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 4.1, 4.3, 4.4, 5.1, 5.2, 6.2, 6.4
**Time Estimate**: 3-4 hours

**Objective**: Build main dashboard that integrates all job profit components.

**Implementation Details**:
- Create `src/components/jobProfit/JobProfitDashboard.tsx`
- Use tab-based or accordion navigation for sections:
  1. Income & Expenses (JobProfitIncomeForm + JobProfitExpenseList)
  2. Time Investment (JobProfitTimeForm)
  3. Results & Analysis (JobProfitabilityDisplay + JobProfitBreakdownCharts)
  4. Scenarios (JobProfitScenarioComparison)
  5. Recommendations (JobProfitRecommendations)
- Show progress indicator (how many sections completed)
- Display guidance for new users
- Show loading states while calculating
- Handle errors gracefully
- Responsive layout (stack on mobile, multi-column on desktop)
- Save scroll position when switching tabs

**Acceptance Criteria**:
- [ ] All sub-components integrated
- [ ] Tab/accordion navigation works
- [ ] Progress tracking shown
- [ ] Guidance for new users
- [ ] Loading states displayed
- [ ] Error handling works
- [ ] Responsive
- [ ] Accessible (keyboard navigation, ARIA)

**Testing**:
- Integration test with all components
- Test navigation between sections
- Test with empty data
- Test with complete data
- Accessibility test
- Responsive test

**Requirements Traceability**: All user stories (integration)

**Files to Create**:
- `src/components/jobProfit/JobProfitDashboard.tsx` (new, ~300-350 lines)
- `src/components/jobProfit/index.ts` (barrel export for all components)

---

#### 7.2 Add Job Profit Route to App
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: 7.1
**Time Estimate**: 1 hour

**Objective**: Integrate Job Profit Dashboard into main app navigation and routing.

**Implementation Details**:
- Add route to Next.js app (e.g., `/starfshagnadur` or `/job-profit`)
- Create page component that renders JobProfitDashboard
- Add navigation link to main menu/navigation
- Add icon for navigation (briefcase or chart icon)
- Update meta tags for SEO (Icelandic title and description)
- Ensure CalculatorProvider wraps the page

**Acceptance Criteria**:
- [ ] Route accessible
- [ ] Page renders dashboard
- [ ] Navigation link works
- [ ] Icon displayed
- [ ] Meta tags set
- [ ] Context available

**Testing**:
- Test route navigation
- Test page render
- Test navigation link

**Requirements Traceability**: General feature access

**Files to Create/Modify**:
- `src/app/starfshagnadur/page.tsx` (new page)
- Navigation component (add link)

---

### 8. Testing

#### 8.1 Write Unit Tests for Calculations
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 2.2, 2.3, 2.4, 2.5, 6.1, 6.3
**Time Estimate**: 4-5 hours

**Objective**: Comprehensive unit tests for all calculation functions.

**Implementation Details**:
- Create `__tests__/lib/calculations/jobProfit.test.ts`
- Test all calculation functions:
  - calculateTotalIncome
  - calculateTotalExpenses
  - calculateNetIncome
  - calculateTotalWeeklyHours
  - calculateNominalHourlyWage
  - calculateActualHourlyWage
  - calculateProfitabilityScore
  - getProfitabilityLevel
  - calculateExpenseBreakdown
  - calculateTimeBreakdown
  - calculateJobProfitability (integration)
  - Scenario generation functions
  - Recommendation generation
- Test edge cases:
  - Zero values
  - Negative net income
  - Empty expense arrays
  - Division by zero protection
- Test with realistic Icelandic data
- Aim for >90% code coverage

**Acceptance Criteria**:
- [ ] All calculation functions tested
- [ ] Edge cases covered
- [ ] Realistic test data used
- [ ] >90% code coverage
- [ ] All tests pass
- [ ] Tests are well-documented

**Testing Focus**:
- Correctness of calculations
- Edge case handling
- Performance

**Requirements Traceability**: All calculation requirements

**Files to Create**:
- `__tests__/lib/calculations/jobProfit.test.ts` (new, ~400-500 lines)

---

#### 8.2 Write Component Tests for Forms
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 4.1, 4.2, 4.3, 4.4
**Time Estimate**: 4-5 hours

**Objective**: Test all form components with React Testing Library.

**Implementation Details**:
- Create component test files:
  - `__tests__/components/jobProfit/JobProfitIncomeForm.test.tsx`
  - `__tests__/components/jobProfit/JobProfitExpenseForm.test.tsx`
  - `__tests__/components/jobProfit/JobProfitExpenseList.test.tsx`
  - `__tests__/components/jobProfit/JobProfitTimeForm.test.tsx`
- Test rendering
- Test user interactions (input changes, button clicks)
- Test validation
- Test context updates
- Test error states
- Test accessibility (labels, ARIA attributes)
- Mock context as needed

**Acceptance Criteria**:
- [ ] All form components tested
- [ ] User interactions tested
- [ ] Validation tested
- [ ] Context integration tested
- [ ] Accessibility tested
- [ ] All tests pass

**Testing Focus**:
- User experience
- Form validation
- Context integration

**Requirements Traceability**: NS-1, NS-2, NS-3 (input forms)

**Files to Create**:
- Multiple test files (~150-200 lines each)

---

#### 8.3 Write Component Tests for Display Components
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 5.1, 5.2, 6.2, 6.4
**Time Estimate**: 3-4 hours

**Objective**: Test all display/results components.

**Implementation Details**:
- Create component test files:
  - `__tests__/components/jobProfit/JobProfitabilityDisplay.test.tsx`
  - `__tests__/components/jobProfit/JobProfitBreakdownCharts.test.tsx`
  - `__tests__/components/jobProfit/JobProfitScenarioComparison.test.tsx`
  - `__tests__/components/jobProfit/JobProfitRecommendations.test.tsx`
- Test rendering with various data
- Test color coding
- Test formatting
- Test empty states
- Test accessibility
- Mock results data as needed

**Acceptance Criteria**:
- [ ] All display components tested
- [ ] Rendering with various data tested
- [ ] Color coding tested
- [ ] Formatting tested
- [ ] Empty states tested
- [ ] Accessibility tested
- [ ] All tests pass

**Testing Focus**:
- Data display
- Visual feedback
- Edge cases

**Requirements Traceability**: NS-4, NS-5, NS-6, NS-7, NS-8

**Files to Create**:
- Multiple test files (~100-150 lines each)

---

#### 8.4 Write Integration Tests
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: 7.1, 8.1, 8.2, 8.3
**Time Estimate**: 3-4 hours

**Objective**: End-to-end integration tests for complete user flows.

**Implementation Details**:
- Create `__tests__/integration/jobProfit.test.tsx`
- Test complete user flows:
  - Add income → Add expenses → Add time → See results
  - Edit expense → Results update
  - Create scenario → Compare with baseline
  - Generate recommendations
- Test context integration
- Test localStorage persistence
- Test export/import
- Test reset functionality
- Use realistic user interactions

**Acceptance Criteria**:
- [ ] Complete user flows tested
- [ ] Context integration tested
- [ ] localStorage tested
- [ ] Export/import tested
- [ ] All tests pass
- [ ] Tests simulate real usage

**Testing Focus**:
- End-to-end functionality
- Data persistence
- User workflows

**Requirements Traceability**: All user stories (integration)

**Files to Create**:
- `__tests__/integration/jobProfit.test.tsx` (new, ~300-400 lines)

---

### 9. Polish and Documentation

#### 9.1 Accessibility Audit and Fixes
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Medium
**Dependencies**: All UI components
**Time Estimate**: 3-4 hours

**Objective**: Ensure all components meet WCAG 2.1 AA accessibility standards.

**Implementation Details**:
- Run accessibility audit tools (axe, Lighthouse)
- Test with screen reader (VoiceOver on Mac)
- Test keyboard navigation (Tab, Enter, Escape)
- Ensure all inputs have labels
- Ensure all interactive elements are keyboard accessible
- Check color contrast ratios (>= 4.5:1)
- Add ARIA labels where needed
- Add focus indicators
- Test with keyboard only (no mouse)
- Fix any issues found

**Acceptance Criteria**:
- [ ] All components pass axe audit
- [ ] Lighthouse accessibility score >= 95
- [ ] Full keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] No accessibility violations

**Testing Focus**:
- Keyboard accessibility
- Screen reader compatibility
- Visual accessibility

**Requirements Traceability**: Non-functional (accessibility)

**Files to Modify**:
- Various component files (add ARIA, fix contrast, etc.)

---

#### 9.2 Responsive Design Testing and Fixes
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: All UI components
**Time Estimate**: 2-3 hours

**Objective**: Ensure all components work well on all screen sizes.

**Implementation Details**:
- Test on mobile (<640px)
- Test on tablet (640px-1024px)
- Test on desktop (>1024px)
- Fix layout issues
- Ensure touch targets are large enough on mobile (44px minimum)
- Test forms on mobile (input sizes, keyboard behavior)
- Test charts/graphs on small screens
- Ensure text is readable on all sizes
- Test navigation on mobile

**Acceptance Criteria**:
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop
- [ ] Touch targets adequate
- [ ] Forms usable on mobile
- [ ] No horizontal scrolling
- [ ] Text readable on all sizes

**Testing Focus**:
- Mobile experience
- Tablet experience
- Layout flexibility

**Requirements Traceability**: Non-functional (responsive design)

**Files to Modify**:
- Various component files (CSS/Tailwind adjustments)

---

#### 9.3 Performance Optimization
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: All components
**Time Estimate**: 2 hours

**Objective**: Ensure calculations update quickly and app feels responsive.

**Implementation Details**:
- Profile calculation performance
- Ensure main calculation completes in <50ms
- Optimize useMemo dependencies
- Add debouncing where needed (already have 500ms for localStorage)
- Lazy load heavy components if needed
- Check bundle size
- Optimize re-renders with React.memo if needed
- Run Lighthouse performance audit

**Acceptance Criteria**:
- [ ] Calculations complete in <50ms
- [ ] No unnecessary re-renders
- [ ] Lighthouse performance score >= 90
- [ ] App feels responsive
- [ ] No performance regressions

**Testing Focus**:
- Calculation speed
- Render performance
- Bundle size

**Requirements Traceability**: Non-functional (performance)

**Files to Modify**:
- Various files (add React.memo, optimize calculations)

---

#### 9.4 Create Feature Documentation
**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Complexity**: Simple
**Dependencies**: All tasks complete
**Time Estimate**: 2-3 hours

**Objective**: Document the Job Profit feature for developers and users.

**Implementation Details**:
- Create `docs/features/job-profit.md`
- Document feature overview
- Document architecture
- Document component structure
- Document calculation formulas
- Document data models
- Add code examples
- Document testing approach
- Add troubleshooting section
- Create user guide in Icelandic (in-app help)

**Acceptance Criteria**:
- [ ] Developer documentation complete
- [ ] Architecture documented
- [ ] Calculations documented
- [ ] Code examples included
- [ ] User guide in Icelandic
- [ ] Troubleshooting section added

**Requirements Traceability**: Documentation requirement

**Files to Create**:
- `docs/features/job-profit.md` (new)
- In-app help content (in components)

---

## Dependencies

### Critical Path
```
Types (1.1, 1.2)
  → Calculations (2.1-2.5)
  → Context (3.1-3.5)
  → Core UI (4.1-4.4, 5.1-5.2)
  → Dashboard (7.1-7.2)
```

### Parallel Work Opportunities
- After foundation is complete (tasks 1-2), UI components can be built in parallel
- Testing can begin once components are built
- Documentation can be written alongside development

### External Dependencies
- Requires existing UI components (Input, Button, Card, Select)
- Requires existing CalculatorContext
- Requires existing localStorage utilities
- Requires Actual Hourly Wage calculator (for baseline comparison)

### Key Milestones
1. **Foundation Complete** (after 2.5): All calculations working
2. **Context Integration Complete** (after 3.5): Data flows end-to-end
3. **Core UI Complete** (after 5.2): Basic feature functional
4. **Advanced Features Complete** (after 6.4): Full feature set
5. **Testing Complete** (after 8.4): Feature ready for production
6. **Polish Complete** (after 9.4): Feature production-ready

## Notes

### Implementation Approach
This feature follows a **Hybrid implementation strategy** combining foundation-first with iterative feature development. We start with solid data models and calculations, then build the core user experience, and finally add advanced features.

### Worktree Consideration
**Recommendation**: Consider using a worktree for this feature.

This is a substantial feature with 35+ tasks touching multiple layers of the application. A worktree would provide:
- Isolated development environment
- Safe experimentation with advanced features (scenarios, recommendations)
- Parallel development if multiple developers work on this
- Easy rollback if needed

To create a worktree:
```bash
/create_worktree starfshagnadur
```

However, worktrees are **optional**. Many features implement fine in the main branch. Use your judgment based on team size and development approach.

### Icelandic Language Requirements
All user-facing text must be in Icelandic:
- Form labels and help text
- Error messages
- Category labels
- Recommendation text
- Help documentation

### Testing Strategy
- **Unit tests**: All calculation functions (>90% coverage)
- **Component tests**: All UI components (user interactions, validation)
- **Integration tests**: Complete user flows
- **Accessibility tests**: WCAG 2.1 AA compliance
- **Performance tests**: Calculation speed (<50ms)

### Key Technical Decisions
1. **Extend CalculatorContext**: Job profit data integrated into existing context (not separate)
2. **Pure Functions**: All calculations are pure functions for easy testing
3. **Client-Side Only**: No server calls, all calculations in browser
4. **500ms Debounce**: Auto-save to localStorage after 500ms of inactivity
5. **Version 2 Migration**: Storage schema updated with backward compatibility

### Common Pitfalls to Avoid
- Don't mutate state directly (use immutable updates)
- Don't skip accessibility testing (required for WCAG compliance)
- Don't skip edge case testing (zero values, negative income)
- Don't forget Icelandic translations
- Don't add external dependencies unnecessarily (use existing UI components)

### Performance Targets
- Calculation time: <50ms for typical data
- Initial render: <100ms
- Lighthouse performance: >=90
- Lighthouse accessibility: >=95

### Future Enhancements (Out of Scope)
These are not part of the MVP but documented for future consideration:
- Historical tracking (track changes over time)
- Charts showing wage changes over time
- Comparison with other users (anonymous aggregates)
- Direct bank integration for automatic expense tracking
- Tax calculations
- Family-related costs (childcare due to work)
- Health cost calculations
- AI-powered recommendations

---

**Total Tasks**: 35 tasks across 9 major components
**Estimated Time**: 80-100 hours (2-3 weeks for one developer)
**Complexity Distribution**:
- Simple: 12 tasks
- Medium: 19 tasks
- High: 4 tasks

**Next Steps After Approval**:
1. Review and approve this task breakdown
2. (Optional) Create worktree with `/create_worktree starfshagnadur`
3. Begin with Task 1.1 (TypeScript types)
4. Follow sequential order for foundation tasks
5. Parallelize UI component development where possible
