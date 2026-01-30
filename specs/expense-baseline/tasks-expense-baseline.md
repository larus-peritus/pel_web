# Tasks: Expense Baseline Tool

## Document Information

- **Feature Name**: Expense Baseline Tool (Útgjaldagrunnur)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-expense-baseline.md
- **Design**: design-expense-baseline.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build foundational types and calculations first, then implement UI in feature slices (wizard → quick edit → results → integration).

**Rationale**:
- Types and calculations can be tested independently
- Wizard mode provides complete guided experience
- Quick edit mode adds value for returning users
- Integration API enables other calculators to use baseline

**Sequence**:
1. Foundation: Types, constants, calculations
2. State: CalculatorContext integration with persistence
3. Wizard UI: Step-by-step guided builder
4. Quick Edit UI: Tabbed category editor
5. Results: Summary display with charts
6. Integration: TierSelector component and API
7. Polish: Accessibility, testing, educational content

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-10 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Epic 3 (Wizard) and Epic 4 (Quick Edit) can be parallelized after Epic 2
- Epic 6 (Integration) requires Epics 2-4 complete

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Calculations

**Objective**: Create type definitions, default category configuration, and pure calculation functions.

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Default categories configuration
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions ✅ Completed 2026-01-22

**Objective**: Define TypeScript interfaces and types for expense baseline data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/expenseBaseline.ts` (new)

**Functionality**:
```typescript
// Define types for:
- ExpenseTier ('barebones' | 'comfortable' | 'deluxe')
- TierValues (barebones, comfortable, deluxe numbers)
- ExpenseCategory (id, name, icon, values, isCustom, isHidden, order)
- ExpenseCategoryConfig (defaults with subcategories)
- ExpenseBaseline (categories, lastUpdated, wizardCompleted, version)
- ExpenseBaselineResults (totals, annualTotals, percentageBreakdown, lifeEnergy, tierDifferences)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-2 (foundational)

**Acceptance Criteria**:
- [x] All types exported from single file
- [x] JSDoc comments for each interface
- [x] Consistent with existing calculator types
- [x] No TypeScript errors

**Implemented**:
- src/types/expenseBaseline.ts (144 lines)
- All core types: ExpenseTier, TierValues, ExpenseCategory, ExpenseBaseline
- Results types: ExpenseBaselineResults, LifeEnergyBreakdown, TierDifferences
- Storage types: StoredExpenseBaseline, StoredExpenseCategory
- UI types: TierColorScheme, TierValuesValidationResult, ExpenseBaselineViewMode
- Context: context/modules/ExpenseBaselineTypes.md

---

#### Task 1.2: Create Default Categories Configuration ✅ Completed 2026-01-22

**Objective**: Define the 10 default Icelandic expense categories with defaults.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/constants/expenseBaseline.ts` (new)

**Functionality**:
```typescript
// Define constants:
- DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[]
  (10 categories with Icelandic names, icons, descriptions, defaults)
- TIER_LABELS: Record<ExpenseTier, string>
- TIER_COLORS: Record<ExpenseTier, ColorScheme>
- EXPENSE_BASELINE_VERSION: number
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-1.1, FR-2.4, US-2

**Acceptance Criteria**:
- [x] All 10 categories defined with ISK defaults
- [x] Total defaults match: 250k (bare), 520k (comf), 1M (deluxe)
- [x] Icons and descriptions in Icelandic
- [x] Exportable for use in wizard and UI

**Implemented**:
- src/lib/constants/expenseBaseline.ts (215 lines)
- DEFAULT_EXPENSE_CATEGORIES: 10 categories (Húsnæði, Matur, Samgöngur, Heilsa, Tryggingar, Veitur, Persónuleg, Afþreying, Sparnaður, Annað)
- TIER_LABELS and TIER_DESCRIPTIONS (Icelandic)
- TIER_COLORS with Tailwind CSS color schemes (Amber/Green/Purple)
- DEFAULT_CATEGORY_ORDER for consistent display
- Development-mode totals verification
- Verified: Totals sum to 250,000 kr (bare), 520,000 kr (comf), 1,000,000 kr (deluxe)
- Context: context/modules/ExpenseBaselineConstants.md

---

#### Task 1.3: Implement Core Calculation Functions

**Objective**: Create pure functions for totals, percentages, life energy, and differences.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/expenseBaseline.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateTierTotals(categories): TierValues
- calculateAnnualTotals(monthlyTotals): TierValues
- calculatePercentageBreakdown(categories, totals): Record<string, TierValues>
- calculateLifeEnergy(totals, categories, actualHourlyWage): LifeEnergyResults | null
- calculateTierDifferences(totals, actualHourlyWage): TierDifferences
- calculateExpenseBaselineResults(baseline, actualHourlyWage): ExpenseBaselineResults
// Helper functions:
- getExpenseByTier(baseline, tier): number
- getAnnualExpenseByTier(baseline, tier): number
- hasExpenseBaseline(baseline): boolean
```

**Tests**:
- `/tests/lib/calculations/expenseBaseline.test.ts` (new)
  - Test totals with various categories
  - Test hidden category exclusion
  - Test life energy with/without AWH
  - Test percentage breakdown accuracy

**Requirements Addressed**: FR-3.1-3.5, US-4

**Acceptance Criteria**:
- [ ] All calculation functions implemented
- [ ] Pure functions (no side effects)
- [ ] Handles edge cases (empty categories, zero values, no AWH)
- [ ] Unit tests pass with >90% coverage

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage expense baseline state with persistence.

**Duration**: 4-6 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for expense baseline
- CRUD operations for categories
- LocalStorage persistence
- API methods for other calculators

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add expense baseline state and results to context.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add expenseBaseline to StoredState)

**Functionality**:
```typescript
// Add to context state:
- expenseBaseline: ExpenseBaseline | null
- expenseBaselineResults: ExpenseBaselineResults | null

// Add to context type:
- updateExpenseBaseline: (baseline: Partial<ExpenseBaseline>) => void
- updateCategoryValues: (categoryId: string, values: Partial<TierValues>) => void
- addCustomCategory: (name: string, icon: string, values: TierValues) => void
- removeCategory: (categoryId: string) => void
- toggleCategoryVisibility: (categoryId: string) => void
- resetToDefaults: () => void
- clearExpenseBaseline: () => void
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-4.1, FR-4.2, US-3

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] Results auto-calculated on state change
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for expense baseline management.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateExpenseBaseline: Merge partial updates
- updateCategoryValues: Update specific category's tier values
- addCustomCategory: Create new category with unique ID
- removeCategory: Remove custom category (cannot remove defaults)
- toggleCategoryVisibility: Hide/show default categories
- resetToDefaults: Reset all to DEFAULT_EXPENSE_CATEGORIES
- clearExpenseBaseline: Remove all data
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-1.2, FR-1.3, US-5

**Acceptance Criteria**:
- [ ] All actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Auto-recalculate results after each action
- [ ] Custom category ID generation unique

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load expense baseline from localStorage.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load expenseBaseline on mount (with migration if needed)
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-4.1-4.4, NFR-1

**Acceptance Criteria**:
- [ ] Loads baseline on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Schema migration support

---

#### Task 2.4: Implement Integration API

**Objective**: Create API methods for other calculators to access baseline.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// API methods:
- getExpenseBaseline: () => ExpenseBaseline | null
- getExpenseByTier: (tier: ExpenseTier) => number
- hasExpenseBaseline: () => boolean
```

**Tests**: Integration tests in Epic 7

**Requirements Addressed**: FR-6.1, FR-6.4, US-3

**Acceptance Criteria**:
- [ ] All API methods exposed via context
- [ ] Returns correct values for each tier
- [ ] Handles null baseline gracefully

---

### EPIC 3: Wizard Mode UI

**Objective**: Create step-by-step guided builder for first-time users.

**Duration**: 8-10 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Wizard container component
- Progress indicator
- Category step component
- Summary step component
- Navigation controls

---

#### Task 3.1: Create WizardModeContainer Component ✅ Completed 2026-01-22

**Objective**: Main container for wizard flow with state management.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/WizardModeContainer.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Track currentStep (0-11)
- Track draft values per category
- Track skipped categories
- Handle step navigation
- Handle completion (save to context)
- Handle cancellation
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.1, FR-5.4, US-1

**Acceptance Criteria**:
- [x] Manages 12 steps (intro + 10 categories + summary)
- [x] Preserves draft values during navigation
- [x] Saves to context on completion
- [x] Resets on cancellation

**Implemented**:
- src/components/expenseBaseline/WizardModeContainer.tsx (150 lines)
- Step tracking with state (currentStep, values, skippedCategories)
- Navigation handlers (handleNext, handleBack, handleSkip, handleGoToStep)
- Initialization with default values from constants
- Conditional rendering (category steps vs summary step)
- Cancel button always available
- Context: context/modules/WizardModeUI.md

---

#### Task 3.2: Create WizardProgress Component ✅ Completed 2026-01-22

**Objective**: Visual progress indicator for wizard steps.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/expenseBaseline/WizardProgress.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Progress bar showing completion percentage
- Step count display ("Skref 3 af 11")
- Current category name
- Accessible (aria-valuenow, etc.)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.2

**Acceptance Criteria**:
- [x] Visual progress bar
- [x] Step count label
- [x] ARIA attributes for accessibility
- [x] Responsive design

**Implemented**:
- src/components/expenseBaseline/WizardProgress.tsx (58 lines)
- Progress bar with dynamic width (0-100%)
- Step counter with 1-indexed display
- Current category name display
- ARIA progressbar with proper attributes
- Screen reader percentage announcement
- Context: context/modules/WizardModeUI.md

---

#### Task 3.3: Create CategoryWizardStep Component ✅ Completed 2026-01-22

**Objective**: Single category input step with three tier inputs.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/CategoryWizardStep.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Category header (icon, name, description)
- Three CurrencyInput fields (barebones, comfortable, deluxe)
- Default value hints
- "Use defaults" button
- Validation (warn if barebones > comfortable > deluxe)
- Help text/tooltip with subcategories
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.3, US-1, US-2

**Acceptance Criteria**:
- [x] Three tier inputs per category
- [x] Icelandic labels and defaults shown
- [x] Validation warnings (not blocking)
- [x] "Use defaults" quick action works

**Implemented**:
- src/components/expenseBaseline/CategoryWizardStep.tsx (150 lines)
- Category header with icon, name, description, subcategories
- Three CurrencyInput fields (Lágmarks, Þægilegt, Lúxus)
- Default value hints via helpText prop
- "Nota sjálfgefin gildi" button
- Validation warnings (non-blocking, shown in amber alert)
- WizardNavigation integration
- Context: context/modules/WizardModeUI.md

---

#### Task 3.4: Create WizardSummaryStep Component ✅ Completed 2026-01-22

**Objective**: Summary review before saving baseline.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/WizardSummaryStep.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tier summary cards (total per tier)
- Category breakdown list
- Edit button to go back to specific category
- Confirm button to save
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.4

**Acceptance Criteria**:
- [x] Shows totals for all three tiers
- [x] Lists all categories with values
- [x] Can navigate back to edit
- [x] Confirm saves to context

**Implemented**:
- src/components/expenseBaseline/WizardSummaryStep.tsx (180 lines)
- Three tier summary cards with color coding
- Monthly and annual totals
- Category breakdown list with all values
- Edit button per category (navigates to step)
- Back and "Vista útgjaldagrunn" buttons
- Help text about future editing
- Context: context/modules/WizardModeUI.md

---

#### Task 3.5: Create WizardNavigation Component ✅ Completed 2026-01-22

**Objective**: Navigation controls for wizard steps.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/expenseBaseline/WizardNavigation.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Back button (disabled on first step)
- Skip button (for optional categories)
- Next button / Finish button (on last step)
- Keyboard shortcuts (Enter for next)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.1

**Acceptance Criteria**:
- [x] Proper navigation flow
- [x] Disabled states appropriate
- [x] Keyboard accessible
- [x] Clear button labels

**Implemented**:
- src/components/expenseBaseline/WizardNavigation.tsx (62 lines)
- Back button (hidden on first step)
- Skip button (always visible)
- Next button (text changes: "Næsta" / "Áfram í yfirlit")
- canProceed prop for validation control
- Enter key shortcut for next
- Responsive layout with flexbox
- Context: context/modules/WizardModeUI.md

---

### EPIC 4: Quick Edit Mode UI

**Objective**: Create tabbed editing interface for returning users.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete (can run parallel with Epic 3)

**Deliverables**:
- Quick edit container
- Tier tab selector
- Category edit list
- Add/hide category controls

---

#### Task 4.1: Create QuickEditModeContainer Component

**Objective**: Main container for quick edit with tier tabs.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/QuickEditModeContainer.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tier tabs (Lágmarks | Þægilegt | Lúxus)
- Active tier state
- Total display for active tier
- "Start fresh" button to switch to wizard
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.5, US-1

**Acceptance Criteria**:
- [ ] Three clickable tier tabs
- [ ] Shows totals for selected tier
- [ ] Can switch to wizard mode
- [ ] Responsive layout

---

#### Task 4.2: Create TierTabSelector Component

**Objective**: Tab selector for switching between tiers.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/TierTabSelector.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tabs with tier colors
- Show monthly total per tier
- Active state indication
- ARIA tabs pattern
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: NFR-2 (visual distinction)

**Acceptance Criteria**:
- [ ] Clear visual distinction between tiers
- [ ] Shows monthly total on each tab
- [ ] Accessible tab pattern
- [ ] Mobile-friendly (full width)

---

#### Task 4.3: Create CategoryEditList Component

**Objective**: List of editable category rows.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/CategoryEditList.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Map over visible categories
- Render CategoryEditRow for each
- Add custom category button
- Show/hide hidden categories section
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-1.2, FR-1.3, US-5

**Acceptance Criteria**:
- [ ] Lists all visible categories
- [ ] Add custom category button
- [ ] Hidden categories section (collapsed)
- [ ] Proper ordering of categories

---

#### Task 4.4: Create CategoryEditRow Component

**Objective**: Single category row with inline editing.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/CategoryEditRow.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Category icon and name
- CurrencyInput for current tier
- Life energy display (if AWH available)
- Hide/delete button (hide for defaults, delete for custom)
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-4, US-5

**Acceptance Criteria**:
- [ ] Inline editing with CurrencyInput
- [ ] Shows life energy when available
- [ ] Hide button for default categories
- [ ] Delete button for custom categories

---

#### Task 4.5: Create AddCustomCategoryModal Component

**Objective**: Modal for adding a new custom category.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/AddCustomCategoryModal.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Category name input
- Icon picker (emoji selector or preset icons)
- Three tier value inputs
- Validation (name required, values >= 0)
- Save/Cancel buttons
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-1.2, US-5

**Acceptance Criteria**:
- [ ] Can enter name and icon
- [ ] Three tier inputs required
- [ ] Validation before save
- [ ] Closes and adds category on save

---

### EPIC 5: Results Summary Display

**Objective**: Create visual summary with charts and comparisons.

**Duration**: 5-7 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Results summary section
- Tier comparison visualization
- Category breakdown chart
- Life energy comparison
- Tier difference table

---

#### Task 5.1: Create ResultsSummarySection Component

**Objective**: Container for all results visualizations.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/expenseBaseline/ResultsSummarySection.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Section header with totals
- Grid layout for sub-components
- Collapsible sections for mobile
- Conditional rendering based on data
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-1 (display totals)

**Acceptance Criteria**:
- [ ] Shows all three tier totals
- [ ] Responsive grid layout
- [ ] Handles missing AWH gracefully

---

#### Task 5.2: Create TierComparisonDisplay Component

**Objective**: Visual comparison of three tiers.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/TierComparisonDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tier cards side by side
- Monthly and annual totals
- Visual bar showing relative size
- Tier-specific colors
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-1, NFR-2

**Acceptance Criteria**:
- [ ] Three tier cards with totals
- [ ] Color coding per tier
- [ ] Visual scale comparison
- [ ] Mobile stack layout

---

#### Task 5.3: Create CategoryBreakdownChart Component

**Objective**: Pie/donut chart showing category distribution.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/CategoryBreakdownChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Donut chart per tier (or toggle between tiers)
- Category legend with percentages
- Interactive hover states
- Uses recharts or similar library
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-3.3

**Acceptance Criteria**:
- [ ] Pie/donut chart renders
- [ ] Shows category percentages
- [ ] Can switch between tiers
- [ ] Legend with category names

---

#### Task 5.4: Create LifeEnergyComparison Component

**Objective**: Display work hours required per tier.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/LifeEnergyComparison.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Monthly work hours per tier
- Annual work hours per tier
- Visual comparison (bars or numbers)
- Alert if AWH not available
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-4, FR-3.4

**Acceptance Criteria**:
- [ ] Shows hours for all three tiers
- [ ] Monthly and annual views
- [ ] Graceful handling when no AWH
- [ ] Link to calculate AWH

---

#### Task 5.5: Create TierDifferenceTable Component

**Objective**: Table showing differences between tiers.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/TierDifferenceTable.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Rows: Bare→Comf, Comf→Deluxe, Bare→Deluxe
- Columns: ISK difference, Hours difference
- Formatted values
- Highlight significant differences
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-3.5

**Acceptance Criteria**:
- [ ] Three comparison rows
- [ ] ISK and hours columns
- [ ] Formatted Icelandic numbers
- [ ] Responsive table

---

### EPIC 6: Integration Components

**Objective**: Create embeddable components for other calculators.

**Duration**: 4-6 hours

**Dependencies**: Epics 2-4 complete

**Deliverables**:
- TierSelector component
- Integration hooks
- Baseline prompt component

---

#### Task 6.1: Create TierSelector Component (Embeddable) ✅ Completed 2026-01-22

**Objective**: Reusable tier selector for other calculators.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/TierSelector.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tier buttons (radio-like selection)
- Optional expense amount display
- Compact mode for sidebars
- Disabled state support
- Standalone usage outside context
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-6.3

**Acceptance Criteria**:
- [x] Works as standalone component
- [x] Shows expense amounts optionally
- [x] Compact mode available
- [x] Accessible radio group pattern

**Implemented**:
- src/components/expenseBaseline/TierSelector.tsx (167 lines)
- Three tier radio buttons with color-coded styling (Amber/Green/Purple)
- Optional expense amount display with tierExpenses prop
- Compact mode for sidebar usage
- Disabled state support
- Accessible radiogroup with ARIA attributes
- Responsive grid layout (3-column on desktop, 1-column on mobile/compact)
- Tests: tests/components/expenseBaseline/TierSelector.test.tsx (11 tests, all passing)
- Context: context/modules/TierSelector.md

---

#### Task 6.2: Create BaselinePrompt Component ✅ Completed 2026-01-22

**Objective**: Alert component prompting user to set up baseline.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/expenseBaseline/BaselinePrompt.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Alert with info variant
- Message explaining need for baseline
- Button linking to baseline setup
- Can be embedded in other calculators
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: US-3

**Acceptance Criteria**:
- [x] Clear message in Icelandic
- [x] Link to expense baseline page
- [x] Consistent styling with other alerts

**Implemented**:
- src/components/expenseBaseline/BaselinePrompt.tsx (68 lines)
- Info alert variant with educational message
- Customizable message, link URL, and button text
- Optional onSetup callback for programmatic navigation
- Educational paragraph about three-tier system
- Tests: tests/components/expenseBaseline/BaselinePrompt.test.tsx (10 tests, all passing)
- Context: context/modules/BaselinePrompt.md

---

#### Task 6.3: Create Integration Hooks ✅ Completed 2026-01-22

**Objective**: Custom hooks for consuming expense baseline.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/hooks/useExpenseBaseline.ts` (new)

**Functionality**:
```typescript
// Hooks:
- useExpenseBaseline(): { baseline, results, hasBaseline }
- useSelectedTier(initialTier): [tier, setTier, expense]
- useExpenseByTier(tier): number
```

**Tests**: Hook tests in Task 7.3

**Requirements Addressed**: FR-6.1, FR-6.4

**Acceptance Criteria**:
- [x] All hooks implemented
- [x] Return correct values
- [x] Handle null baseline

**Implemented**:
- src/hooks/useExpenseBaseline.ts (115 lines)
- useExpenseBaseline() - Returns baseline, results, and hasBaseline flag
- useSelectedTier(initialTier) - Returns [tier, setTier, expense] tuple
- useExpenseByTier(tier) - Returns expense amount for specific tier
- All hooks memoized for performance
- Graceful null baseline handling (returns 0 for expenses)
- Tests: tests/hooks/useExpenseBaseline.test.tsx (13 tests, all passing)
- Context: context/modules/UseExpenseBaselineHooks.md

---

#### Task 6.4: Create Component Barrel Export ✅ Completed 2026-01-22

**Objective**: Export all expense baseline components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { ExpenseBaselineCalculator } from './ExpenseBaselineCalculator';
export { TierSelector } from './TierSelector';
export { BaselinePrompt } from './BaselinePrompt';
// Export hooks:
export { useExpenseBaseline, useSelectedTier, useExpenseByTier } from '@/hooks/useExpenseBaseline';
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [x] All public components exported
- [x] No circular dependencies
- [x] Clean import paths

**Implemented**:
- src/components/expenseBaseline/index.ts (updated)
- Exports TierSelector and BaselinePrompt components
- Exports all three hooks (useExpenseBaseline, useSelectedTier, useExpenseByTier)
- Exports TypeScript types for all components and hooks
- Clean barrel export pattern for easy importing

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

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/lib/calculations/expenseBaseline.test.ts` (new)

**Tests**:
- calculateTierTotals with various inputs
- calculateAnnualTotals accuracy
- calculatePercentageBreakdown precision
- calculateLifeEnergy with/without AWH
- calculateTierDifferences accuracy
- Edge cases: empty arrays, zero values, negative values

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
- `/tests/components/expenseBaseline/*.test.tsx` (new)

**Tests**:
- WizardModeContainer navigation flow
- CategoryWizardStep input handling
- QuickEditModeContainer tier switching
- TierSelector selection behavior
- Form validation

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [ ] Key components tested
- [ ] User interactions covered
- [ ] Validation tested

---

#### Task 7.3: Integration Tests

**Objective**: Test integration with CalculatorContext.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/integration/expenseBaseline.test.tsx` (new)

**Tests**:
- Context state updates correctly
- LocalStorage persistence works
- Export/import includes baseline
- API methods return correct values
- Results auto-calculate

**Requirements Addressed**: FR-4, FR-6

**Acceptance Criteria**:
- [ ] Context integration tested
- [ ] Persistence verified
- [ ] API methods work correctly

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

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [ ] No accessibility violations in axe
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly

---

### EPIC 8: Main Page and Routing

**Objective**: Create the main page component and integrate into app navigation.

**Duration**: 3-4 hours

**Dependencies**: Epics 3-5 complete

**Deliverables**:
- Main calculator page component
- Route page
- Navigation integration

---

#### Task 8.1: Create ExpenseBaselineCalculator Main Component ✅ Completed 2026-01-22

**Objective**: Main page component that orchestrates wizard/edit modes.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/expenseBaseline/ExpenseBaselineCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Detect mode (wizard if no baseline, edit if exists)
- Mode toggle button
- Render appropriate mode container
- Educational header section
```

**Tests**: Component tests in Task 7.2

**Requirements Addressed**: FR-5.1, FR-5.5

**Acceptance Criteria**:
- [x] Auto-detects appropriate mode
- [x] Can switch between modes
- [x] Educational intro section (collapsible)
- [x] Responsive layout

**Implemented**:
- src/components/expenseBaseline/ExpenseBaselineCalculator.tsx (195 lines)
- Mode detection based on `expenseBaseline?.wizardCompleted`
- "Byrja aftur" button to switch from quick edit to wizard
- Educational intro with collapsible details (can be dismissed)
- AWH warning when not available
- Wizard completion handler (converts values, updates context)
- Results summary shown below when baseline exists
- Context: context/modules/ExpenseBaselineMainPage.md

---

#### Task 8.2: Create Route Page ✅ Completed 2026-01-22

**Objective**: Next.js page component for the expense baseline route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/utgjaldareiknivel/page.tsx` (new)

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary
- ExpenseBaselineCalculator component
- Metadata for SEO
```

**Tests**: N/A (covered by integration tests)

**Requirements Addressed**: N/A (routing)

**Acceptance Criteria**:
- [x] Route works at /utgjaldareiknivel
- [x] Wrapped in CalculatorProvider
- [x] Loading fallback shown

**Implemented**:
- src/app/utgjaldareiknivel/page.tsx (73 lines)
- Next.js route page with CalculatorProvider wrapper
- Suspense boundary with skeleton loading fallback
- Hero section with title, description, tagline
- Main content section with ExpenseBaselineCalculator
- Privacy notice section at bottom
- Route: /utgjaldareiknivel
- SEO: "Útgjaldagrunnur - Grunnurinn að öllum FIRE-útreikningum þínum"

---

#### Task 8.3: Add to Calculator Navigation ✅ Completed 2026-01-22

**Objective**: Add expense baseline to the calculator tab navigation.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to EXPENSE_CALCULATORS array:
{
  id: 'utgjaldareiknivel',
  name: 'Útgjaldagrunnur',
  description: 'Skilgreindu útgjöld þín á þremum stigum - Lágmarks, Þægilegt, og Lúxus.',
  icon: '📊',
  available: true,
}

// Add to ExpenseContent:
if (selectedCalculator === 'utgjaldareiknivel') {
  return <ExpenseBaselineContent ... />;
}
```

**Tests**: N/A (manual testing)

**Requirements Addressed**: Constraint - must be first in Expense tab

**Acceptance Criteria**:
- [x] Appears first in Expense calculators
- [x] Icon and description correct
- [x] Navigation works

**Implemented**:
- src/components/calculator/CalculatorPageContent.tsx (modified)
- Added to EXPENSE_CALCULATORS array as FIRST item
- Calculator metadata with id, name, description, icon (📊)
- ExpenseBaselineContent wrapper component following existing pattern
- Hero section with back button
- Routing condition in ExpenseImpactContent
- Import added: `import { ExpenseBaselineCalculator } from '@/components/expenseBaseline'`
- Barrel export updated to include ExpenseBaselineCalculator
- Navigation: Appears first in "Áhrif útgjalda" (Expense Impact) tab

---

## 3. Implementation Schedule

### Phase 1: Foundation (Days 1-2)
- Epic 1: Types, constants, calculations

### Phase 2: State & Core UI (Days 3-5)
- Epic 2: CalculatorContext integration
- Epic 3: Wizard mode UI (parallel start)
- Epic 4: Quick edit mode UI (parallel start)

### Phase 3: Results & Integration (Days 6-7)
- Epic 5: Results summary display
- Epic 6: Integration components

### Phase 4: Polish & Deploy (Days 8-9)
- Epic 7: Testing and QA
- Epic 8: Main page and routing
- Final review and adjustments

---

## 4. Risk Mitigation

### Risk 1: Complex Wizard State
**Mitigation**: Keep wizard state local, only save to context on completion.

### Risk 2: Performance with Many Categories
**Mitigation**: Memoize calculations, virtualize lists if >20 categories.

### Risk 3: AWH Integration Timing
**Mitigation**: Design all components to work without AWH, enhance when available.

### Risk 4: Mobile UX for Wizard
**Mitigation**: "Use all defaults" quick action, step skipping, progress saving.

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

---

**Tasks Phase Complete: Ready for Implementation**
