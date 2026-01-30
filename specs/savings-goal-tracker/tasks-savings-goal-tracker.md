# Verkefni: Sparnaðarmarkmið Lífsorku Mælir (Savings Goal Life Energy Tracker)

## Yfirlit Verkefna

**Eiginleiki**: Savings Goal Life Energy Tracker
**App**: peninganaedalifid.is
**Uppskiptingaraðferð**: Foundation-First (Core infrastructure → Features → Enhancements)
**Heildarverkefni**: 17 tasks í 5 epics
**Áætlaður tími**: ~50-70 klukkustundir
**Verkefnisdagsetning**: 2026-01-22

## Framkvæmdaráætlun

### Strategie: Foundation-First

**Rationale**:
- Build solid foundation (types, calculations, validations) first
- Core logic is independent and can be thoroughly tested
- UI components depend on business logic being correct
- Incremental testing at each layer
- Minimal rework if requirements clarify

### Implementation Order
1. **Epic 1**: Foundation Setup (Types, Utils, Tests)
2. **Epic 2**: Core Business Logic (Calculations, Validations, Storage)
3. **Epic 3**: React Hooks (State Management, Integration)
4. **Epic 4**: UI Components (Visual Layer)
5. **Epic 5**: Integration & Polish (E2E, Documentation)

### Dependency Flow
```
Epic 1 (Foundation)
  ↓
Epic 2 (Business Logic) ← Epic 3 (Hooks) run in parallel
  ↓                          ↓
Epic 4 (UI Components)
  ↓
Epic 5 (Integration & Testing)
```

---

## Epic 1: Foundation Setup

**Objective**: Establish TypeScript types, testing infrastructure, and utility functions

**Dependencies**: None (starting point)

**Completion Criteria**: All types defined, test infrastructure working, utilities tested

---

### Task 1.1: Define TypeScript Types and Interfaces

**Objective**: Create all TypeScript types for savings goals, calculations, and validation.

**Files to Create/Modify**:
- `src/types/savingsGoal.ts` (NEW)

**Functionality**:
1. Define `SavingsGoal` interface with all fields:
   - id, name, targetAmount, currentAmount, monthlyContribution
   - createdAt, updatedAt, completedAt (optional)
   - achievedMilestones array
   - isCompleted, sortOrder (optional)

2. Define `SavingsGoalInput` type for form data

3. Define `SavingsGoalCalculations` interface:
   - progressPercentage, hoursWorked, hoursRemaining
   - formattedHoursWorked, formattedHoursRemaining
   - monthsToGoal, estimatedCompletionDate
   - status, statusColor, nextMilestone

4. Define `SavingsSummary` interface for dashboard

5. Define utility types:
   - `SortOption`: 'progress-desc' | 'progress-asc' | 'amount-desc' | 'amount-asc' | 'time-desc' | 'time-asc' | 'manual'
   - `GoalStatus`: 'started' | 'progressing' | 'almost-there' | 'achieved'
   - `StatusColor`: 'red' | 'yellow' | 'blue' | 'green'

6. Define `ValidationResult` interface with errors object

**Tests**:
- TypeScript compilation passes
- Types are correctly exported

**Requirements Traceability**:
- NS-1: SavingsGoal, SavingsGoalInput types
- NS-2: SavingsGoalCalculations type
- NS-4: SortOption type
- NS-5: achievedMilestones field
- NS-7: SavingsSummary type

**Estimated Time**: 2 hours

---

### Task 1.2: Set Up Testing Infrastructure

**Objective**: Configure Vitest for savings goal module testing.

**Files to Create/Modify**:
- `src/lib/savingsGoal/__tests__/setup.ts` (NEW)
- Update `vitest.config.ts` if needed

**Functionality**:
1. Create test setup file with common utilities:
   - Mock localStorage
   - Mock date functions for deterministic tests
   - Sample test data factory functions

2. Create test data factories:
   - `createMockGoal(overrides)`: Returns SavingsGoal
   - `createMockCalculations(overrides)`: Returns SavingsGoalCalculations
   - `createMockSummary(overrides)`: Returns SavingsSummary

3. Create test utilities:
   - `mockActualHourlyWage(wage: number)`: Mock wage data in localStorage
   - `clearLocalStorageMock()`: Clear test storage
   - `advanceDate(days: number)`: Mock date advancement

**Tests**:
- Test setup loads correctly
- Mock factories produce valid data
- Test utilities function as expected

**Requirements Traceability**:
- All NS requirements (enables testing)

**Estimated Time**: 2 hours

---

### Task 1.3: Create Utility Functions

**Objective**: Build reusable utility functions for date handling and number formatting.

**Files to Create/Modify**:
- `src/lib/savingsGoal/utils.ts` (NEW)
- `src/lib/savingsGoal/__tests__/utils.test.ts` (NEW)

**Functionality**:
1. Date utilities:
   - `addMonths(date: Date, months: number): Date`
   - `formatDate(date: Date, format: string): string`

2. Number utilities:
   - `roundToDecimal(num: number, decimals: number): number`
   - `clamp(value: number, min: number, max: number): number`

3. Currency utilities (if not already in shared):
   - `formatISK(amount: number): string` - Format as "X.XXX.XXX kr"

4. Life energy conversion:
   - `dollarsToLifeEnergy(amount: number, hourlyWage: number): number`
     - Returns hours worked
     - Handles edge cases (zero wage, negative amounts)

**Tests**:
- `utils.test.ts`:
  - addMonths: Test adding 0, 1, 12, 24 months
  - roundToDecimal: Test various decimal places
  - clamp: Test min, max, within range
  - formatISK: Test with 0, small, large numbers
  - dollarsToLifeEnergy: Test normal case, zero wage (returns Infinity), negative amount (returns 0)

**Requirements Traceability**:
- NS-2: dollarsToLifeEnergy for life energy calculations
- NS-3: addMonths for estimated completion date

**Estimated Time**: 3 hours

---

## Epic 2: Core Business Logic

**Objective**: Implement calculation, validation, and storage logic

**Dependencies**: Epic 1 complete

**Completion Criteria**: All business logic tested and passing, no UI dependencies

---

### Task 2.1: Implement Calculation Functions

**Objective**: Build all savings goal calculation logic.

**Files to Create/Modify**:
- `src/lib/savingsGoal/calculations.ts` (NEW)
- `src/lib/savingsGoal/__tests__/calculations.test.ts` (NEW)

**Functionality**:
1. `calculateSavingsGoal(goal: SavingsGoal, actualHourlyWage: number): SavingsGoalCalculations`
   - Calculate progressPercentage (handle > 100%)
   - Calculate hoursWorked using dollarsToLifeEnergy
   - Calculate hoursRemaining (never negative)
   - Calculate monthsToGoal and estimatedCompletionDate
   - Determine status and statusColor
   - Find nextMilestone
   - Format hours using formatSavingsLifeEnergy

2. `formatSavingsLifeEnergy(hours: number): string`
   - < 8 hours: "X klukkustundir" (singular/plural)
   - 8-80 hours: "X vinnudagar"
   - >= 80 hours: "X vinnuvikur"
   - Round to 1 decimal place

3. `getGoalStatus(progressPercentage: number): GoalStatus`
   - 0-33%: 'started'
   - 34-66%: 'progressing'
   - 67-99%: 'almost-there'
   - 100%+: 'achieved'

4. `getStatusColor(status: GoalStatus): StatusColor`
   - Map status to color (red/yellow/blue/green)

5. `getNextMilestone(progressPercentage: number, achievedMilestones: number[]): number | null`
   - Find first milestone (10, 25, 50, 75, 100) not yet achieved and not passed

6. `calculateSavingsSummary(goals: SavingsGoal[], actualHourlyWage: number): SavingsSummary`
   - Filter to active goals only (isCompleted = false)
   - Sum totals
   - Calculate weighted average progress
   - Format total life energy

**Tests**:
- `calculations.test.ts`:
  - calculateSavingsGoal:
    - Normal case (25% progress)
    - Edge: 0% progress
    - Edge: 100% progress
    - Edge: Over 100% progress
    - Edge: Zero wage (Infinity hours)
    - Edge: No monthly contribution (null monthsToGoal)
  - formatSavingsLifeEnergy:
    - 5 hours → "5 klukkustundir"
    - 1 hour → "1 klukkustund" (singular)
    - 16 hours → "2 vinnudagar"
    - 8 hours → "1 vinnudagur" (singular)
    - 200 hours → "5 vinnuvikur"
    - 40 hours → "1 vinnuvika" (singular)
  - getGoalStatus: Test all 4 ranges
  - getStatusColor: Test all 4 statuses
  - getNextMilestone:
    - No milestones achieved, 5% → 10
    - 30% progress, 10 and 25 achieved → 50
    - 100% progress → null
  - calculateSavingsSummary:
    - Single goal
    - Multiple goals
    - Mix of active and completed (only count active)
    - Empty array

**Requirements Traceability**:
- NS-2: Life energy calculations and formatting
- NS-3: monthsToGoal and estimatedCompletionDate
- NS-5: Milestone detection
- NS-7: Summary calculations

**Estimated Time**: 5 hours

---

### Task 2.2: Implement Validation Functions

**Objective**: Create comprehensive input validation logic.

**Files to Create/Modify**:
- `src/lib/savingsGoal/validation.ts` (NEW)
- `src/lib/savingsGoal/__tests__/validation.test.ts` (NEW)

**Functionality**:
1. `validateSavingsGoalInput(input: SavingsGoalInput): ValidationResult`
   - Name validation:
     - Not empty (trim whitespace)
     - Max 100 characters
   - targetAmount validation:
     - > 0
     - <= 1,000,000,000 ISK
   - currentAmount validation:
     - >= 0
     - <= targetAmount
   - monthlyContribution validation:
     - >= 0
   - Return `{ isValid: boolean, errors: { field?: string } }`

2. `canAddGoal(currentGoals: SavingsGoal[]): boolean`
   - Count active goals (isCompleted = false)
   - Return true if < 5, false otherwise

**Tests**:
- `validation.test.ts`:
  - validateSavingsGoalInput:
    - Valid input → isValid: true, errors: {}
    - Empty name → name error
    - Name too long (101 chars) → name error
    - targetAmount = 0 → targetAmount error
    - targetAmount > 1B → targetAmount error
    - currentAmount < 0 → currentAmount error
    - currentAmount > targetAmount → currentAmount error
    - monthlyContribution < 0 → monthlyContribution error
    - Multiple errors simultaneously
  - canAddGoal:
    - 0 goals → true
    - 4 goals → true
    - 5 goals → false
    - 3 active + 2 completed → true (only count active)

**Requirements Traceability**:
- NS-1: Input validation for goal creation
- NS-4: Max 5 goals validation

**Estimated Time**: 3 hours

---

### Task 2.3: Implement Storage Functions

**Objective**: Create localStorage export/import functionality.

**Files to Create/Modify**:
- `src/lib/savingsGoal/storage.ts` (NEW)
- `src/lib/savingsGoal/__tests__/storage.test.ts` (NEW)

**Functionality**:
1. Constants:
   - `STORAGE_KEYS.GOALS = 'savings_goals'`
   - `STORAGE_KEYS.COMPLETED_GOALS = 'savings_goals_completed'`

2. `exportSavingsGoals(goals: SavingsGoal[]): void`
   - Create JSON with version, exportDate, goals
   - Create blob and download link
   - Filename: `sparnadarmarkmidin-YYYY-MM-DD.json`
   - Trigger download
   - Clean up URL

3. `importSavingsGoals(file: File): Promise<SavingsGoal[]>`
   - Read file as text
   - Parse JSON
   - Validate structure (has goals array)
   - Parse dates (createdAt, updatedAt, completedAt)
   - Return parsed goals array
   - Throw error with Icelandic message if invalid

**Tests**:
- `storage.test.ts`:
  - exportSavingsGoals:
    - Creates download (mock document.createElement)
    - Correct filename format
    - Valid JSON structure
  - importSavingsGoals:
    - Valid file → returns goals
    - Invalid JSON → throws error
    - Missing goals array → throws error
    - Dates parsed correctly
    - completedAt is optional

**Requirements Traceability**:
- NS-8: Export and import data functionality

**Estimated Time**: 4 hours

---

## Epic 3: React Hooks

**Objective**: Build state management hooks with localStorage persistence

**Dependencies**: Epic 1 and Epic 2 complete

**Completion Criteria**: Hooks tested, integrate with business logic, localStorage persistence working

---

### Task 3.1: Create useLocalStorage Hook (if not exists)

**Objective**: Generic localStorage hook with error handling.

**Files to Create/Modify**:
- Check if `src/hooks/useLocalStorage.ts` exists
- If not, create it (NEW)
- `src/hooks/__tests__/useLocalStorage.test.ts` (NEW if needed)

**Functionality**:
1. `useLocalStorage<T>(key: string, initialValue: T)`
   - Load from localStorage on mount
   - Return [value, setValue, { error, isLoading }]
   - Persist to localStorage on setValue
   - Handle JSON parse/stringify
   - Catch and report errors gracefully
   - Use try-catch for localStorage access (can fail in private mode)

**Tests**:
- Load initial value if localStorage empty
- Load persisted value if exists
- setValue persists to localStorage
- Handle localStorage errors (mock failure)
- Handle JSON parse errors

**Requirements Traceability**:
- NS-1: Persist goals to localStorage

**Estimated Time**: 3 hours (or 0 if already exists)

---

### Task 3.2: Create useSavingsGoals Hook

**Objective**: Main state management hook for savings goals.

**Files to Create/Modify**:
- `src/hooks/useSavingsGoals.ts` (NEW)
- `src/hooks/__tests__/useSavingsGoals.test.tsx` (NEW)

**Functionality**:
1. Load goals from localStorage using useLocalStorage
2. Load actualHourlyWage from wage calculator localStorage
3. Track sortBy preference (localStorage or state)

4. `addGoal(input: SavingsGoalInput): void`
   - Validate using validateSavingsGoalInput
   - Check canAddGoal
   - Generate unique ID (crypto.randomUUID or uuid)
   - Create SavingsGoal object with timestamps
   - Add to goals array
   - Update localStorage

5. `updateGoal(id: string, updates: Partial<SavingsGoalInput>): void`
   - Find goal by ID
   - Merge updates
   - Update updatedAt timestamp
   - Recalculate achievedMilestones if currentAmount changed
   - Update localStorage

6. `deleteGoal(id: string): void`
   - Remove from goals array
   - Update localStorage

7. `markAsCompleted(id: string): void`
   - Set isCompleted = true
   - Set completedAt = now
   - Update localStorage

8. `getCalculations(goal: SavingsGoal): SavingsGoalCalculations`
   - Call calculateSavingsGoal with actualHourlyWage
   - Return calculations

9. `getSummary(): SavingsSummary`
   - Call calculateSavingsSummary with goals and actualHourlyWage

10. Sort goals based on sortBy:
    - progress-desc/asc: Sort by progressPercentage
    - amount-desc/asc: Sort by targetAmount
    - time-desc/asc: Sort by monthsToGoal (null values last)
    - manual: Sort by sortOrder field

11. Return:
    - goals (sorted)
    - addGoal, updateGoal, deleteGoal, markAsCompleted
    - getCalculations, getSummary
    - actualHourlyWage
    - sortBy, setSortBy
    - canAddMore (boolean)

**Tests**:
- `useSavingsGoals.test.tsx`:
  - Hook initializes with empty goals
  - addGoal creates goal with correct structure
  - addGoal respects max 5 limit
  - updateGoal merges updates correctly
  - deleteGoal removes goal
  - markAsCompleted sets flags
  - getCalculations returns correct calculations
  - getSummary aggregates correctly
  - Sorting works for all sort options
  - localStorage persistence works
  - actualHourlyWage loads from calculator data

**Requirements Traceability**:
- NS-1: Create goals (addGoal)
- NS-2: Calculate life energy (getCalculations)
- NS-4: Multiple goals, sorting
- NS-6: Update/delete goals
- NS-7: Summary data

**Estimated Time**: 6 hours

---

### Task 3.3: Create useMilestoneNotification Hook

**Objective**: Detect and notify when milestones are achieved.

**Files to Create/Modify**:
- `src/hooks/useMilestoneNotification.ts` (NEW)
- `src/hooks/__tests__/useMilestoneNotification.test.tsx` (NEW)

**Functionality**:
1. Accept `goal`, `calculations`, `onMilestoneAchieved` callback

2. Track previous progress with useRef

3. useEffect:
   - Compare current progress to previous progress
   - Check each milestone (10, 25, 50, 75, 100)
   - If progress crosses milestone AND milestone not in achievedMilestones:
     - Call onMilestoneAchieved(goalId, milestone)
   - Update previous progress ref

4. Milestone detection logic:
   - previousProgress < milestone <= currentProgress
   - milestone not in goal.achievedMilestones

**Tests**:
- `useMilestoneNotification.test.tsx`:
   - No notification if no milestone crossed
   - Notification when crossing 25% for first time
   - No duplicate notification for same milestone
   - Multiple milestones crossed in one update (25% → 60%)
   - No notification if milestone already achieved

**Requirements Traceability**:
- NS-5: Milestone tracking and notifications

**Estimated Time**: 3 hours

---

## Epic 4: UI Components

**Objective**: Build all React components for the savings goal tracker

**Dependencies**: Epic 3 complete

**Completion Criteria**: All components render correctly, interactive elements work, responsive design

---

### Task 4.1: Create SavingsGoalDashboard Page

**Objective**: Main page component orchestrating the entire feature.

**Files to Create/Modify**:
- `src/app/sparnadar-markmidin/page.tsx` (NEW)
- `src/app/sparnadar-markmidin/__tests__/page.test.tsx` (NEW)

**Functionality**:
1. Use useSavingsGoals hook
2. State for showForm, editingGoal
3. Get summary data
4. Check if actualHourlyWage exists:
   - If null: Show MissingWageDataPrompt component
   - If exists: Show dashboard

5. Render structure:
   - PageLayout wrapper
   - SavingsGoalHeader (with add button)
   - SavingsSummaryCard
   - SortControls
   - SavingsGoalList
   - SavingsGoalFormModal (conditional)

6. Handle add/edit/delete actions:
   - Add: Open form with empty data
   - Edit: Open form with goal data
   - Delete: Confirm and call deleteGoal
   - Complete: Call markAsCompleted

**Tests**:
- `page.test.tsx`:
   - Shows MissingWageDataPrompt if no wage data
   - Shows dashboard if wage data exists
   - Add button opens form
   - Edit button opens form with goal data
   - Delete button shows confirmation
   - Form save calls correct hook method

**Requirements Traceability**:
- NS-1: Main interface for creating goals
- NS-4: Display multiple goals
- NS-7: Display summary

**Estimated Time**: 4 hours

---

### Task 4.2: Create Supporting UI Components (Small)

**Objective**: Build small reusable components.

**Files to Create/Modify**:
- `src/components/savingsGoal/MissingWageDataPrompt.tsx` (NEW)
- `src/components/savingsGoal/SavingsGoalHeader.tsx` (NEW)
- `src/components/savingsGoal/SortControls.tsx` (NEW)
- `src/components/savingsGoal/GoalActions.tsx` (NEW)
- `src/components/savingsGoal/__tests__/MissingWageDataPrompt.test.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SavingsGoalHeader.test.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SortControls.test.tsx` (NEW)

**Functionality**:

**MissingWageDataPrompt**:
- Show alert box with message
- Link to wage calculator page
- Icelandic text

**SavingsGoalHeader**:
- Title "Sparnaðarmarkmið"
- Export/Import buttons
- Add goal button (disabled if canAddMore = false)
- Show tooltip if max reached

**SortControls**:
- Dropdown or button group for sort options
- Options: Progress, Amount, Time to Goal, Manual
- Each with asc/desc toggle
- onChange calls setSortBy

**GoalActions**:
- Edit, Delete, Mark Complete buttons
- Icon buttons with tooltips
- Handle onClick events

**Tests**:
- Each component renders correctly
- Props work as expected
- User interactions trigger callbacks

**Requirements Traceability**:
- NS-1: Missing wage data prompt
- NS-4: Sort controls
- NS-6: Goal actions (edit, delete, complete)
- NS-8: Export/import buttons

**Estimated Time**: 4 hours

---

### Task 4.3: Create SavingsSummaryCard Component

**Objective**: Display aggregated summary of all goals.

**Files to Create/Modify**:
- `src/components/savingsGoal/SavingsSummaryCard.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SavingsSummaryCard.test.tsx` (NEW)

**Functionality**:
1. Accept `summary: SavingsSummary` prop
2. Display in card with gradient background
3. Grid layout (1 col mobile, 3 cols desktop)

4. Show:
   - Total active goals count (with icon)
   - Overall progress percentage (with icon)
   - Total hours worked (formatted, with icon)
   - Total hours remaining (formatted, with icon)
   - Total current amount (formatted ISK)
   - Total target amount (formatted ISK)

5. Use icons from Lucide React (Target, TrendingUp, CheckCircle, Clock)

**Tests**:
- `SavingsSummaryCard.test.tsx`:
   - Renders all summary data
   - Formats numbers correctly
   - Responsive layout (test class names)
   - Updates when summary prop changes

**Requirements Traceability**:
- NS-7: Display summary overview

**Estimated Time**: 3 hours

---

### Task 4.4: Create ProgressBar Component

**Objective**: Visual progress bar with milestone markers.

**Files to Create/Modify**:
- `src/components/savingsGoal/ProgressBar.tsx` (NEW)
- `src/components/savingsGoal/MilestoneMarker.tsx` (NEW)
- `src/components/savingsGoal/__tests__/ProgressBar.test.tsx` (NEW)

**Functionality**:

**ProgressBar**:
1. Accept props:
   - percentage: number
   - status: GoalStatus
   - milestones: number[]
   - achievedMilestones: number[]

2. Render:
   - Background bar (gray)
   - Progress fill (colored by status)
   - Percentage text (centered)
   - Milestone markers at positions

3. Color mapping:
   - started: red-500
   - progressing: yellow-500
   - almost-there: blue-500
   - achieved: green-500

4. Clamp percentage to 0-100 for visual display

**MilestoneMarker**:
1. Accept props: position (percentage), achieved (boolean)
2. Render vertical line at position
3. Show icon (checkmark if achieved, circle otherwise)
4. Position absolutely within progress bar

**Tests**:
- `ProgressBar.test.tsx`:
   - Renders with correct width based on percentage
   - Shows correct color for each status
   - Displays percentage text
   - Milestone markers appear at correct positions
   - Achieved milestones show checkmark

**Requirements Traceability**:
- NS-2: Visual progress indicator
- NS-5: Milestone markers

**Estimated Time**: 4 hours

---

### Task 4.5: Create SavingsGoalCard Component

**Objective**: Individual goal display card.

**Files to Create/Modify**:
- `src/components/savingsGoal/SavingsGoalCard.tsx` (NEW)
- `src/components/savingsGoal/AmountDisplay.tsx` (NEW)
- `src/components/savingsGoal/LifeEnergyDisplay.tsx` (NEW)
- `src/components/savingsGoal/TimeToGoalDisplay.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SavingsGoalCard.test.tsx` (NEW)

**Functionality**:

**SavingsGoalCard**:
1. Accept props:
   - goal: SavingsGoal
   - calculations: SavingsGoalCalculations
   - onEdit, onDelete, onMarkComplete callbacks

2. Render structure:
   - Header with name and GoalActions
   - ProgressBar
   - AmountDisplay
   - LifeEnergyDisplay
   - TimeToGoalDisplay

3. Hover shadow effect

**AmountDisplay**:
- Show "X kr af Y kr"
- Show percentage
- Format with formatISK

**LifeEnergyDisplay**:
- Show hours worked (formatted)
- Show hours remaining (formatted)
- Icons for each
- Color-code by status

**TimeToGoalDisplay**:
- If achieved: "Markmið náð! 🎉"
- If monthsToGoal > 0: "Áætlað: X mánuðir (dagsetning)"
- If monthsToGoal null: "Engin mánaðarleg innborgun"

**Tests**:
- `SavingsGoalCard.test.tsx`:
   - Renders goal name
   - Shows correct amounts
   - Displays life energy formatted
   - Shows time to goal correctly
   - Action buttons trigger callbacks

**Requirements Traceability**:
- NS-2: Display life energy progress
- NS-3: Show time to goal
- NS-5: Progress visualization
- NS-6: Edit/delete actions

**Estimated Time**: 5 hours

---

### Task 4.6: Create SavingsGoalFormModal Component

**Objective**: Form for creating and editing goals.

**Files to Create/Modify**:
- `src/components/savingsGoal/SavingsGoalFormModal.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SavingsGoalFormModal.test.tsx` (NEW)

**Functionality**:
1. Accept props:
   - goal: SavingsGoal | null (null = create mode)
   - onSave: (input: SavingsGoalInput) => void
   - onCancel: () => void

2. State:
   - formData: SavingsGoalInput
   - errors: ValidationResult['errors']

3. Initialize formData from goal prop or defaults

4. Handle form submission:
   - Validate using validateSavingsGoalInput
   - If valid: call onSave
   - If invalid: set errors state

5. Form fields:
   - Name input (text, maxLength 100)
   - Target amount (CurrencyInput)
   - Current amount (CurrencyInput)
   - Monthly contribution (CurrencyInput with help text)

6. Error display under each field

7. Buttons:
   - Submit: "Búa til markmið" or "Vista breytingar"
   - Cancel: "Hætta við"

8. Modal overlay with backdrop

**Tests**:
- `SavingsGoalFormModal.test.tsx`:
   - Renders in create mode
   - Renders in edit mode with prefilled data
   - Validation errors display
   - Valid form calls onSave
   - Cancel button calls onCancel
   - Field updates work

**Requirements Traceability**:
- NS-1: Create goal form
- NS-6: Edit goal form

**Estimated Time**: 5 hours

---

### Task 4.7: Create SavingsGoalList Component

**Objective**: List container for goal cards.

**Files to Create/Modify**:
- `src/components/savingsGoal/SavingsGoalList.tsx` (NEW)
- `src/components/savingsGoal/__tests__/SavingsGoalList.test.tsx` (NEW)

**Functionality**:
1. Accept props:
   - goals: SavingsGoal[]
   - getCalculations: (goal) => SavingsGoalCalculations
   - onEdit, onDelete, onMarkComplete callbacks

2. Render:
   - Empty state if no goals: "Engin markmið ennþá. Bættu við þínu fyrsta markmiði!"
   - Grid of SavingsGoalCard components (1 col mobile, 2 col tablet, 3 col desktop)

3. Pass calculations and callbacks to each card

4. Use useMilestoneNotification for each goal:
   - Show toast notification on milestone

**Tests**:
- `SavingsGoalList.test.tsx`:
   - Shows empty state if no goals
   - Renders correct number of cards
   - Passes props correctly to cards
   - Milestone notifications trigger (mock toast)

**Requirements Traceability**:
- NS-4: Display multiple goals
- NS-5: Milestone notifications

**Estimated Time**: 3 hours

---

## Epic 5: Integration & Polish

**Objective**: End-to-end testing, documentation, and final integration

**Dependencies**: Epic 4 complete

**Completion Criteria**: E2E tests passing, documentation complete, feature ready for deployment

---

### Task 5.1: Implement Export/Import Functionality

**Objective**: Wire up export/import buttons to storage functions.

**Files to Create/Modify**:
- Update `src/components/savingsGoal/SavingsGoalHeader.tsx`
- `src/components/savingsGoal/__tests__/exportImport.test.tsx` (NEW)

**Functionality**:
1. Export button:
   - onClick: Call exportSavingsGoals(goals)
   - Disabled if no goals

2. Import button:
   - onClick: Open file picker
   - Accept: .json files only
   - onFileSelect: Call importSavingsGoals(file)
   - On success: Merge or replace goals (user choice)
   - Show toast on success/error

3. Import merge dialog:
   - "Bæta við eða skrifa yfir?"
   - Options: "Bæta við núverandi" / "Skrifa yfir allt"

**Tests**:
- Export downloads file (mock)
- Import parses and adds goals
- Import error shows toast
- Merge vs replace logic works

**Requirements Traceability**:
- NS-8: Export and import goals

**Estimated Time**: 3 hours

---

### Task 5.2: Add Toast Notifications

**Objective**: Integrate toast notifications for user feedback.

**Files to Create/Modify**:
- Create or use existing toast system
- Add notifications throughout app

**Functionality**:
1. Toast types: success, error, info, warning

2. Notifications for:
   - Goal created: "Markmið búið til!"
   - Goal updated: "Markmið uppfært!"
   - Goal deleted: "Markmið eytt"
   - Goal completed: "🎉 Markmið náð!"
   - Milestone achieved: "🎉 Áfangi náð: X% af [name]!"
   - Import success: "X markmið flutt inn"
   - Export success: "Markmið flutt út"
   - Errors: Display error message

3. Toast position: top-right
4. Auto-dismiss: 3 seconds (5 for milestones)

**Tests**:
- Toast appears on actions
- Auto-dismisses
- Correct type and message

**Requirements Traceability**:
- NS-5: Milestone notifications
- General: User feedback

**Estimated Time**: 2 hours

---

### Task 5.3: Responsive Design Testing

**Objective**: Ensure mobile and tablet responsiveness.

**Files to Create/Modify**:
- Update component styles as needed
- Test across breakpoints

**Functionality**:
1. Test at breakpoints:
   - Mobile: 320px, 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

2. Check:
   - Layout stacks correctly on mobile
   - Touch targets >= 44px
   - Text remains readable (min 16px for inputs)
   - Buttons accessible
   - Modals fit on screen
   - Cards resize gracefully

3. Fix any layout issues

**Tests**:
- Visual regression tests (if available)
- Manual testing on devices

**Requirements Traceability**:
- NS-9: Mobile support

**Estimated Time**: 4 hours

---

### Task 5.4: Write End-to-End Tests

**Objective**: Create E2E test scenarios for complete user flows.

**Files to Create/Modify**:
- `src/app/sparnadar-markmidin/__tests__/e2e.test.tsx` (NEW)

**Functionality**:
E2E test scenarios:

1. **Complete goal creation flow**:
   - Navigate to tracker page
   - Fill out and submit form
   - Verify goal appears in list
   - Verify calculations are correct

2. **Progress tracking flow**:
   - Create goal with 0% progress
   - Update current amount to 10%
   - Verify milestone toast appears
   - Verify progress bar updates
   - Update to 25%
   - Verify new milestone toast

3. **Multi-goal management**:
   - Create 5 goals
   - Verify add button disabled
   - Sort by different criteria
   - Mark one as complete
   - Verify can add new goal
   - Verify summary updates

4. **Export/Import flow**:
   - Create 3 goals
   - Export to JSON
   - Clear localStorage
   - Import JSON
   - Verify all goals restored

5. **Edit and delete flow**:
   - Create goal
   - Edit goal (change name and amount)
   - Verify changes saved
   - Delete goal
   - Verify removed from list

**Tests**:
- All E2E scenarios pass
- No console errors
- Proper state management

**Requirements Traceability**:
- All NS requirements (complete flows)

**Estimated Time**: 6 hours

---

### Task 5.5: Accessibility Audit and Fixes

**Objective**: Ensure WCAG 2.1 AA compliance.

**Files to Create/Modify**:
- Update components with accessibility improvements

**Functionality**:
1. Keyboard navigation:
   - All interactive elements focusable
   - Tab order logical
   - Enter/Space activate buttons
   - Escape closes modals

2. Screen reader support:
   - All images have alt text
   - Form fields have labels
   - Error messages associated with fields (aria-describedby)
   - Progress bars have aria-valuenow
   - Status announcements with aria-live

3. Visual:
   - Color contrast >= 4.5:1
   - Focus indicators visible
   - Don't rely on color alone (use icons + text)
   - Text resizable to 200%

4. ARIA attributes:
   - Modal: role="dialog", aria-modal="true"
   - Form errors: aria-invalid, aria-describedby
   - Progress: role="progressbar", aria-valuenow
   - Buttons: aria-label if icon-only

5. Run automated tools:
   - axe-core
   - Lighthouse accessibility audit

**Tests**:
- Automated accessibility tests
- Manual keyboard navigation
- Screen reader testing (NVDA/VoiceOver)

**Requirements Traceability**:
- Non-functional: Accessibility requirements

**Estimated Time**: 4 hours

---

### Task 5.6: Performance Optimization

**Objective**: Ensure smooth performance with multiple goals.

**Files to Create/Modify**:
- Optimize components as needed

**Functionality**:
1. Memoization:
   - Memoize expensive calculations with useMemo
   - Memoize callbacks with useCallback
   - Use React.memo for static components

2. Lazy loading:
   - Code-split modal components
   - Lazy load form if not immediately needed

3. Optimize re-renders:
   - Prevent unnecessary re-renders with React.memo
   - Use key props correctly in lists

4. Test performance:
   - Measure with React DevTools Profiler
   - Test with 50 goals (5 active + 45 completed)
   - Ensure smooth scrolling and interactions

5. Target metrics:
   - Calculations: < 50ms
   - UI updates: < 100ms
   - Smooth 60fps animations

**Tests**:
- Performance profiling
- Load testing with many goals

**Requirements Traceability**:
- Non-functional: Performance requirements

**Estimated Time**: 3 hours

---

### Task 5.7: Documentation and User Guide

**Objective**: Create comprehensive documentation.

**Files to Create/Modify**:
- `docs/features/savings-goal-tracker.md` (NEW)
- Inline code documentation (JSDoc comments)

**Functionality**:

**Feature Documentation (`docs/features/savings-goal-tracker.md`)**:
1. Overview and purpose
2. User guide:
   - How to create a goal
   - How to track progress
   - Understanding life energy display
   - Milestone celebrations
   - Export/import data
3. Technical details:
   - Architecture overview
   - Key components
   - Data flow
   - localStorage schema
4. Troubleshooting:
   - Missing wage data
   - Import errors
   - Browser compatibility

**Inline Documentation**:
1. JSDoc comments for:
   - All exported functions
   - All React components (props)
   - Complex logic sections
   - Type definitions

2. Example:
```typescript
/**
 * Calculates all derived values for a savings goal.
 *
 * @param goal - The savings goal to calculate
 * @param actualHourlyWage - The user's actual hourly wage from wage calculator
 * @returns Calculated values including progress, life energy, and time estimates
 *
 * @example
 * const calculations = calculateSavingsGoal(myGoal, 2500);
 * console.log(calculations.formattedHoursWorked); // "5 vinnudagar"
 */
```

**Tests**:
- Documentation reviewed for completeness
- Code examples tested

**Requirements Traceability**:
- All NS requirements (documentation coverage)

**Estimated Time**: 4 hours

---

## Task Summary

### Epic 1: Foundation Setup
- Task 1.1: Define TypeScript Types (2h)
- Task 1.2: Set Up Testing Infrastructure (2h)
- Task 1.3: Create Utility Functions (3h)
**Epic 1 Total**: 7 hours

### Epic 2: Core Business Logic
- Task 2.1: Implement Calculation Functions (5h)
- Task 2.2: Implement Validation Functions (3h)
- Task 2.3: Implement Storage Functions (4h)
**Epic 2 Total**: 12 hours

### Epic 3: React Hooks
- Task 3.1: Create useLocalStorage Hook (3h or 0h if exists)
- Task 3.2: Create useSavingsGoals Hook (6h)
- Task 3.3: Create useMilestoneNotification Hook (3h)
**Epic 3 Total**: 12 hours (or 9h if useLocalStorage exists)

### Epic 4: UI Components
- Task 4.1: Create SavingsGoalDashboard Page (4h)
- Task 4.2: Create Supporting UI Components (4h)
- Task 4.3: Create SavingsSummaryCard Component (3h)
- Task 4.4: Create ProgressBar Component (4h)
- Task 4.5: Create SavingsGoalCard Component (5h)
- Task 4.6: Create SavingsGoalFormModal Component (5h)
- Task 4.7: Create SavingsGoalList Component (3h)
**Epic 4 Total**: 28 hours

### Epic 5: Integration & Polish
- Task 5.1: Implement Export/Import Functionality (3h)
- Task 5.2: Add Toast Notifications (2h)
- Task 5.3: Responsive Design Testing (4h)
- Task 5.4: Write End-to-End Tests (6h)
- Task 5.5: Accessibility Audit and Fixes (4h)
- Task 5.6: Performance Optimization (3h)
- Task 5.7: Documentation and User Guide (4h)
**Epic 5 Total**: 26 hours

---

## Total Effort Estimate

**Total Tasks**: 24 tasks across 5 epics
**Total Estimated Time**: 85 hours (or 82h if useLocalStorage exists)

**Breakdown by Epic**:
1. Foundation: 7h (8%)
2. Business Logic: 12h (14%)
3. React Hooks: 12h (14%)
4. UI Components: 28h (33%)
5. Integration & Polish: 26h (31%)

---

## Dependencies Diagram

```
Foundation Setup (Epic 1)
├── Types (1.1) ──────────────┐
├── Test Setup (1.2) ─────────┤
└── Utilities (1.3) ──────────┤
                              │
                              ▼
                   Core Business Logic (Epic 2)
                   ├── Calculations (2.1) ───┐
                   ├── Validation (2.2) ─────┤
                   └── Storage (2.3) ────────┤
                                             │
                   React Hooks (Epic 3)      │
                   ├── useLocalStorage (3.1) │
                   ├── useSavingsGoals (3.2)─┤
                   └── useMilestoneNotif(3.3)┘
                              │
                              ▼
                   UI Components (Epic 4)
                   ├── Dashboard Page (4.1) ─┐
                   ├── Small Components (4.2)│
                   ├── Summary Card (4.3) ───│
                   ├── Progress Bar (4.4) ───│
                   ├── Goal Card (4.5) ──────│
                   ├── Form Modal (4.6) ─────│
                   └── Goal List (4.7) ──────┘
                              │
                              ▼
                   Integration & Polish (Epic 5)
                   ├── Export/Import (5.1)
                   ├── Toasts (5.2)
                   ├── Responsive (5.3)
                   ├── E2E Tests (5.4)
                   ├── Accessibility (5.5)
                   ├── Performance (5.6)
                   └── Documentation (5.7)
```

---

## Implementation Strategy Notes

### Parallel Work Opportunities
- Epic 2 (Business Logic) and Epic 3 (Hooks) can be developed partially in parallel
- Task 3.1 (useLocalStorage) can start before Epic 2 completes
- Within Epic 4, some components can be built in parallel:
  - Small components (4.2) can start early
  - Cards (4.3, 4.4, 4.5) can be built simultaneously once hooks are ready

### Critical Path
1. Types (1.1) → Calculations (2.1) → useSavingsGoals (3.2) → Goal Card (4.5) → E2E Tests (5.4)
2. This is the longest dependency chain and determines minimum project duration

### Testing Strategy
- **Unit tests**: Write alongside each task (TDD approach)
- **Integration tests**: After each epic completes
- **E2E tests**: Final integration phase
- **Manual testing**: Accessibility and responsive design

### Risk Mitigation
- **Risk**: Life energy formatting may need UX adjustments
  - **Mitigation**: Get user feedback early on Task 2.1
- **Risk**: localStorage limits with many goals
  - **Mitigation**: Test with 100+ goals in Task 5.6
- **Risk**: Wage calculator integration breakage
  - **Mitigation**: Mock wage data in tests, graceful degradation

### Definition of Done (per Task)
- [ ] Code written and passing linting
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Component tests passing (if UI component)
- [ ] TypeScript types correct (no `any`)
- [ ] Code reviewed (self-review at minimum)
- [ ] Requirements traced and satisfied
- [ ] No console errors or warnings

### Definition of Done (per Epic)
- [ ] All tasks complete
- [ ] Integration tests passing
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Ready for next epic

### Definition of Done (Complete Feature)
- [ ] All epics complete
- [ ] E2E tests passing
- [ ] Accessibility audit passing
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] User guide written
- [ ] Deployed to staging
- [ ] Stakeholder approval

---

## Next Steps After Tasks Complete

1. **User Testing**: Get feedback from 3-5 users
2. **Iterate**: Address feedback and bugs
3. **Deploy**: Release to production
4. **Monitor**: Track usage and errors
5. **Future Enhancements**: Consider out-of-scope features from requirements (recurring contributions, interest calculations, goal images)

---

## Traceability Matrix

| Requirement | Tasks |
|-------------|-------|
| NS-1: Create goals | 1.1, 2.2, 3.2, 4.6, 4.1 |
| NS-2: Life energy progress | 1.1, 1.3, 2.1, 3.2, 4.5 |
| NS-3: Time to goal | 1.1, 2.1, 3.2, 4.5 |
| NS-4: Multiple goals | 1.1, 2.2, 3.2, 4.1, 4.7, 4.2 |
| NS-5: Milestones | 1.1, 2.1, 3.3, 4.4, 4.7, 5.2 |
| NS-6: Edit/delete goals | 3.2, 4.1, 4.2, 4.6 |
| NS-7: Summary | 1.1, 2.1, 3.2, 4.3 |
| NS-8: Export/import | 2.3, 4.2, 5.1 |
| NS-9: Mobile support | 4.1-4.7, 5.3 |

---

## File Structure

Expected file structure after all tasks:

```
src/
├── types/
│   └── savingsGoal.ts
├── lib/
│   └── savingsGoal/
│       ├── calculations.ts
│       ├── validation.ts
│       ├── storage.ts
│       ├── utils.ts
│       └── __tests__/
│           ├── setup.ts
│           ├── calculations.test.ts
│           ├── validation.test.ts
│           ├── storage.test.ts
│           └── utils.test.ts
├── hooks/
│   ├── useLocalStorage.ts (if created)
│   ├── useSavingsGoals.ts
│   ├── useMilestoneNotification.ts
│   └── __tests__/
│       ├── useLocalStorage.test.tsx
│       ├── useSavingsGoals.test.tsx
│       └── useMilestoneNotification.test.tsx
├── components/
│   └── savingsGoal/
│       ├── MissingWageDataPrompt.tsx
│       ├── SavingsGoalHeader.tsx
│       ├── SortControls.tsx
│       ├── GoalActions.tsx
│       ├── SavingsSummaryCard.tsx
│       ├── ProgressBar.tsx
│       ├── MilestoneMarker.tsx
│       ├── SavingsGoalCard.tsx
│       ├── AmountDisplay.tsx
│       ├── LifeEnergyDisplay.tsx
│       ├── TimeToGoalDisplay.tsx
│       ├── SavingsGoalFormModal.tsx
│       ├── SavingsGoalList.tsx
│       └── __tests__/
│           ├── MissingWageDataPrompt.test.tsx
│           ├── SavingsGoalHeader.test.tsx
│           ├── SortControls.test.tsx
│           ├── SavingsSummaryCard.test.tsx
│           ├── ProgressBar.test.tsx
│           ├── SavingsGoalCard.test.tsx
│           ├── SavingsGoalFormModal.test.tsx
│           ├── SavingsGoalList.test.tsx
│           └── exportImport.test.tsx
└── app/
    └── sparnadar-markmidin/
        ├── page.tsx
        └── __tests__/
            ├── page.test.tsx
            └── e2e.test.tsx

docs/
└── features/
    └── savings-goal-tracker.md
```

---

## Complete Specification Ready

All three phases of the specification are now complete:

1. **Requirements** (`requirements-savings-goal-tracker.md`)
2. **Design** (`design-savings-goal-tracker.md`)
3. **Tasks** (`tasks-savings-goal-tracker.md`) ← This document

The feature is ready for implementation following the task sequence outlined above.
