# Tasks: Current Expense Report

## Document Information

- **Feature Name**: Current Expense Report (Rauntímaútgjöld)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-current-expense-report.md
- **Design**: design-current-expense-report.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build foundational types and calculations first, then implement UI in feature slices (editor → dashboard → comparison → integration).

**Rationale**:
- Types and calculations can be tested independently
- Category editor provides core data entry functionality
- Dashboard adds visualization and insights
- Comparison and recommendations build on existing data
- Integration API enables other calculators to consume data

**Sequence**:
1. Foundation: Types, constants, calculations
2. State: CalculatorContext integration with persistence
3. Editor UI: Category accordion with line item editing
4. Dashboard UI: Summary, charts, top expenses
5. Comparison: Baseline comparison view
6. Recommendations: Smart recommendation engine
7. Integration: API for other calculators
8. Polish: Accessibility, testing, page integration

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (6-12 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Epic 3 (Editor UI) and Epic 4 (Dashboard UI) can be parallelized after Epic 2
- Epic 5 (Comparison) and Epic 6 (Recommendations) require Epics 2-4
- Epic 7 (Integration) requires Epics 2-6
- Epic 8 (Testing) and Epic 9 (Page) run after all features complete

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

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for current expense data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/currentExpenses.ts` (new)

**Functionality**:
```typescript
// Define types for:
- LineItem (id, label, amount, isRecurring, notes)
- ExpenseCategory (id, name, icon, lineItems, isCustom, isHidden, order)
- CurrentExpenseReport (categories, lastUpdated, version)
- CategoryBreakdown (categoryId, name, total, percentage, lifeEnergyHours, lineItemCount)
- LineItemSummary (for top expenses)
- LifeEnergyBreakdown (totalMonthly, totalAnnual, categoryHours, lineItemHours)
- BaselineComparisonData (closestTier, difference, categoryComparisons)
- Recommendation (type, title, message, actionUrl, priority)
- CurrentExpenseResults (totals, breakdown, lifeEnergy, recommendations, baselineComparison)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-3 (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors

---

#### Task 1.2: Create Default Categories Configuration

**Objective**: Define the 11 default Icelandic expense categories with suggested line items.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/constants/currentExpenses.ts` (new)

**Functionality**:
```typescript
// Define constants:
- DEFAULT_CURRENT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[]
  (11 categories with Icelandic names, icons, suggested line items)
- CATEGORY_COLORS: Record<string, string> (for UI styling)
- CURRENT_EXPENSE_VERSION: number
- RECOMMENDATION_THRESHOLDS: { subscription, commute, housing, baselineDiff }
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-1.1, US-2

**Acceptance Criteria**:
- [ ] All 11 categories defined with Icelandic names
- [ ] Suggested line items include common Icelandic vendors
- [ ] Icons and color schemes assigned
- [ ] Recommendation thresholds configurable
- [ ] Exportable for use in UI

---

#### Task 1.3: Implement Core Calculation Functions

**Objective**: Create pure functions for totals, percentages, life energy, and top expenses.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/currentExpenses.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateTotalExpenses(categories): { monthly, annual }
- calculateCategoryTotals(categories): Record<string, number>
- calculateCategoryBreakdown(categories, totalMonthly, actualHourlyWage): CategoryBreakdown[]
- calculateLifeEnergy(categories, totalMonthly, actualHourlyWage): LifeEnergyBreakdown | null
- getTopExpenses(categories, limit, actualHourlyWage): LineItemSummary[]

// Helper functions:
- getCategoryTotal(category): number
- getLineItemLifeEnergy(lineItem, actualHourlyWage): number | null
```

**Tests**:
- `/tests/lib/calculations/currentExpenses.test.ts` (new)
  - Test totals with various line items
  - Test hidden category exclusion
  - Test life energy with/without AWH
  - Test category breakdown accuracy
  - Test top expenses sorting

**Requirements Addressed**: FR-3.1-3.5, US-3

**Acceptance Criteria**:
- [ ] All calculation functions implemented
- [ ] Pure functions (no side effects)
- [ ] Handles edge cases (empty arrays, zero values, no AWH)
- [ ] Unit tests pass with >90% coverage

---

#### Task 1.4: Implement Baseline Comparison Logic

**Objective**: Create function to compare current expenses against expense baseline.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/currentExpenses.ts` (modify)

**Functionality**:
```typescript
// Implement:
- compareToBaseline(currentExpenses, expenseBaseline): BaselineComparisonData | null
  - Find closest tier
  - Calculate difference
  - Compare categories
  - Identify overspending/underspending
```

**Tests**:
- Add tests to `/tests/lib/calculations/currentExpenses.test.ts`
  - Test tier matching
  - Test category comparisons
  - Test with null baseline

**Requirements Addressed**: FR-3.6, US-4

**Acceptance Criteria**:
- [ ] Correctly identifies closest tier
- [ ] Calculates category-level differences
- [ ] Handles null baseline gracefully
- [ ] Unit tests pass

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage current expense state with persistence.

**Duration**: 5-7 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for current expenses
- CRUD operations for line items and categories
- LocalStorage persistence
- Integration API methods

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add current expense state and results to context.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add currentExpenses to StoredState)

**Functionality**:
```typescript
// Add to context state:
- currentExpenses: CurrentExpenseReport | null
- currentExpenseResults: CurrentExpenseResults | null

// Add to context type:
- updateCurrentExpenses: (expenses: Partial<CurrentExpenseReport>) => void
- addLineItem: (categoryId: string, lineItem: Omit<LineItem, 'id'>) => void
- updateLineItem: (categoryId: string, lineItemId: string, updates: Partial<LineItem>) => void
- deleteLineItem: (categoryId: string, lineItemId: string) => void
- addCustomCategory: (category: Omit<ExpenseCategory, 'id' | 'lineItems'>) => void
- removeCategory: (categoryId: string) => void
- toggleCategoryVisibility: (categoryId: string) => void
- clearCurrentExpenses: () => void
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-7.1, FR-7.2

**Acceptance Criteria**:
- [ ] State added to CalculatorContext
- [ ] Results auto-calculated on state change
- [ ] TypeScript types updated
- [ ] No breaking changes to existing context

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for expense management.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateCurrentExpenses: Merge partial updates
- addLineItem: Add new line item with unique ID
- updateLineItem: Update specific line item
- deleteLineItem: Remove line item from category
- addCustomCategory: Create new custom category
- removeCategory: Remove custom category (cannot remove defaults)
- toggleCategoryVisibility: Hide/show categories
- clearCurrentExpenses: Remove all data
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-1.2-1.5, FR-2.1-2.6

**Acceptance Criteria**:
- [ ] All actions implemented with useCallback
- [ ] Immutable state updates
- [ ] Auto-recalculate results after each action
- [ ] Line item ID generation unique (nanoid or uuid)

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load current expenses from localStorage.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load currentExpenses on mount (with migration if needed)
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-7.1-7.5, NFR-1

**Acceptance Criteria**:
- [ ] Loads expenses on mount
- [ ] Debounced auto-save (500ms)
- [ ] Included in export/import
- [ ] Schema migration support

---

#### Task 2.4: Implement Integration API

**Objective**: Create API methods for other calculators to access expense data.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/lib/calculations/currentExpenses.ts` (add helper functions)

**Functionality**:
```typescript
// API methods:
- getCurrentExpenses: () => CurrentExpenseReport | null
- getExpensesByCategory: (categoryId: string) => ExpenseCategory | null
- getSubscriptions: () => LineItem[] // All recurring + subscription category
- getCommuteExpenses: () => number // Total from transport
- getHousingExpenses: () => number // Total from housing
- hasCurrentExpenses: () => boolean

// Helper calculation functions:
- extractSubscriptions(expenses): LineItem[]
- extractCommuteExpenses(expenses): number
- extractHousingExpenses(expenses): number
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-5.1-5.6, US-5

**Acceptance Criteria**:
- [ ] All API methods exposed via context
- [ ] Returns correct data for each category
- [ ] Handles null expenses gracefully
- [ ] Subscription extraction includes recurring items from all categories

---

### EPIC 3: Category Editor UI

**Objective**: Create accordion-based category editor for line item entry.

**Duration**: 8-10 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Category accordion component
- Line item row component
- Add line item functionality
- Add custom category functionality

---

#### Task 3.1: Create CategoryExpenseEditor Container ✅ Completed 2026-01-23

**Objective**: Main container for category accordion interface.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CategoryExpenseEditor.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Render accordion for all visible categories
- Track expanded/collapsed state per category
- Display category totals in headers
- Provide add custom category button
- Show/hide hidden categories section
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-2.1, FR-2.2, US-1

**Acceptance Criteria**:
- [x] Renders all categories as accordions
- [x] Category totals displayed in headers
- [x] Expand/collapse works smoothly
- [x] Add custom category button present
- [x] Responsive layout

**Implementation Notes**:
- Created CategoryExpenseEditor.tsx with accordion interface
- Implemented expand/collapse state management with Set<string>
- Added expand all/collapse all controls
- Integrated with CalculatorContext for data access
- Displays category totals, percentages, and life energy hours

---

#### Task 3.2: Create CategoryAccordion Component ✅ Completed 2026-01-23

**Objective**: Single category accordion with header and expandable content.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CategoryAccordion.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Category header (icon, name, total, percentage, life energy)
- Expand/collapse button
- Expandable content area for line items
- "Add line item" button
- Category total summary
- Accessible accordion pattern (ARIA)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-2.1, FR-2.3, NFR-3

**Acceptance Criteria**:
- [x] Header shows icon, name, total, percentage
- [x] Life energy displayed when AWH available
- [x] Expand/collapse animation smooth
- [x] Accessible keyboard navigation
- [x] ARIA attributes correct

**Implementation Notes**:
- Created CategoryAccordion.tsx with accessible accordion pattern
- Header displays icon, name, total, percentage, and life energy
- Smooth expand/collapse animation with CSS transitions
- Full ARIA support (aria-expanded, aria-controls, role="region")
- Line item count display
- Integration with LineItemRow and AddLineItemButton components

---

#### Task 3.3: Create LineItemRow Component ✅ Completed 2026-01-23

**Objective**: Single line item row with inline editing.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/LineItemRow.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Editable label (text input)
- Currency input for amount
- Life energy display (if AWH available)
- Recurring checkbox (for subscriptions)
- Notes field (optional, expandable)
- Delete button
- Inline validation
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-2.2, FR-2.4, US-3

**Acceptance Criteria**:
- [x] Inline editing for label and amount
- [x] Life energy updates in real-time
- [x] Recurring checkbox functional
- [x] Delete confirmation (for non-empty items)
- [x] Input validation

**Implementation Notes**:
- Created LineItemRow.tsx with inline editing capabilities
- Click-to-edit label with auto-focus and select
- CurrencyInput component for amount editing
- Real-time life energy display based on AWH
- Recurring checkbox with Icelandic label "Fastur"
- Delete confirmation dialog
- Auto-save on blur with validation
- Keyboard shortcuts (Enter to save, Escape to cancel)

---

#### Task 3.4: Create AddLineItemButton Component ✅ Completed 2026-01-23

**Objective**: Button and inline form for adding new line items.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/AddLineItemButton.tsx` (new)

**Functionality**:
```typescript
// Component features:
- "Add line item" button
- Inline form appears on click
- Label and amount inputs
- Recurring checkbox
- Save/Cancel buttons
- Auto-focus on label input
- Validation before save
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-2.3, FR-1.2

**Acceptance Criteria**:
- [x] Inline form appears on button click
- [x] Auto-focuses label input
- [x] Validation prevents empty labels
- [x] Cancel resets form
- [x] Save adds item and closes form

**Implementation Notes**:
- Created AddLineItemButton.tsx with toggle form interface
- Displays suggested line items from category configuration
- Quick add buttons for common expenses (top 5 suggestions)
- Auto-focus on label input when form opens
- Validation with error messages in Icelandic
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Filters out already-used suggested line items
- Clean form state management

---

#### Task 3.5: Create AddCustomCategoryModal Component ✅ Completed 2026-01-23

**Objective**: Modal for adding a completely custom category.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/AddCustomCategoryModal.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Modal dialog
- Category name input
- Icon picker (emoji or preset)
- Initial line items (optional)
- Validation (name required)
- Save/Cancel buttons
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-1.3, US-2

**Acceptance Criteria**:
- [x] Modal opens and closes properly
- [x] Name input required
- [x] Icon picker works (emoji or preset)
- [x] Can optionally add initial line items
- [x] Validation before save
- [x] Closes and adds category on save

**Implementation Notes**:
- Created AddCustomCategoryModal.tsx with full modal pattern
- 30 preset emoji icons for quick selection
- Custom emoji text input option
- Name validation with duplicate checking
- Backdrop click to close
- Keyboard support (Escape to close)
- Full ARIA support (role="dialog", aria-modal, aria-labelledby)
- Responsive design with max-height scrolling
- Clean error handling with Alert component

---

### EPIC 4: Dashboard UI

**Objective**: Create visual summary dashboard with charts and insights.

**Duration**: 7-9 hours

**Dependencies**: Epic 2 complete (can run parallel with Epic 3)

**Deliverables**:
- Dashboard container
- Quick stats display
- Category breakdown chart
- Top expenses list
- Recommendation panel (basic)

---

#### Task 4.1: Create ExpenseDashboard Container

**Objective**: Main container for dashboard summary view.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/ExpenseDashboard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Grid layout for sub-components
- Quick stats section
- Charts section
- Top expenses section
- Recommendations section
- Toggle to editor view button
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-4.1, FR-4.2

**Acceptance Criteria**:
- [ ] Responsive grid layout
- [ ] All sub-components rendered
- [ ] Toggle to editor view works
- [ ] Loading states handled

---

#### Task 4.2: Create QuickStats Component

**Objective**: Display key statistics in card format.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/QuickStats.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Total monthly expenses card
- Total annual expenses card
- Life energy total card (if AWH available)
- Top category card (highest spending)
- Color-coded cards
- Responsive grid
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-4.1, FR-4.2, US-3

**Acceptance Criteria**:
- [ ] Four stat cards displayed
- [ ] Life energy shown when AWH available
- [ ] Top category highlighted
- [ ] Responsive 2x2 or 4x1 grid
- [ ] Formatted Icelandic numbers

---

#### Task 4.3: Create CategoryBreakdownChart Component

**Objective**: Pie/donut chart showing category distribution.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CategoryBreakdownChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Donut chart with category percentages
- Category legend with colors
- Interactive hover (show amount and %)
- Responsive sizing
- Uses recharts or similar library
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-4.3, FR-4.4

**Acceptance Criteria**:
- [ ] Donut chart renders correctly
- [ ] Shows category percentages
- [ ] Legend with category names and colors
- [ ] Interactive hover states
- [ ] Responsive sizing

---

#### Task 4.4: Create TopExpensesList Component

**Objective**: Display top 10 expense line items.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/TopExpensesList.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of top 10 line items by amount
- Shows category, label, amount, life energy
- Ranked numbering (1-10)
- Click to jump to category (optional)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-4.5

**Acceptance Criteria**:
- [ ] Lists top 10 expenses
- [ ] Shows category icon and name
- [ ] Displays amount and life energy
- [ ] Ranked numbering
- [ ] Responsive list layout

---

#### Task 4.5: Create RecommendationPanel Component

**Objective**: Display smart recommendations based on expense patterns.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/RecommendationPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display 1-4 recommendations
- Priority-based ordering (high, medium, low)
- Recommendation card with icon, title, message
- Action button (link to calculator)
- Dismissable recommendations (local state)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: FR-6.1-FR-6.5, US-6

**Acceptance Criteria**:
- [ ] Shows top 3-4 recommendations
- [ ] Priority-based ordering
- [ ] Clear title and message
- [ ] Action button links to calculator
- [ ] Dismissable (local state, not persisted)

---

### EPIC 5: Baseline Comparison View

**Objective**: Create comparison view showing current vs. planned baseline.

**Duration**: 4-6 hours

**Dependencies**: Epics 2, 3, 4 complete

**Deliverables**:
- Baseline comparison container
- Tier match indicator
- Category comparison table
- Overspending highlights

---

#### Task 5.1: Create BaselineComparisonView Container

**Objective**: Main container for baseline comparison display.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/BaselineComparisonView.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Tier match indicator (which tier is closest)
- Overall difference display
- Category comparison table
- Overspending/underspending highlights
- Conditional rendering (only if baseline exists)
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-4, FR-3.6

**Acceptance Criteria**:
- [ ] Shows closest tier match
- [ ] Displays overall difference
- [ ] Category table shows all comparisons
- [ ] Highlights over/under spending
- [ ] Graceful handling when no baseline

---

#### Task 5.2: Create TierMatchIndicator Component

**Objective**: Visual indicator showing which tier current spending matches.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/currentExpenses/TierMatchIndicator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Three tier buttons (Barebones/Comfortable/Deluxe)
- Current tier highlighted
- Current total displayed
- Difference from tier shown (+ over / - under)
- Tier colors from expense baseline
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-4

**Acceptance Criteria**:
- [ ] Three tiers displayed
- [ ] Closest tier highlighted
- [ ] Current total shown
- [ ] Difference calculated and displayed
- [ ] Color-coded tiers

---

#### Task 5.3: Create CategoryComparisonTable Component

**Objective**: Table comparing current vs. baseline per category.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CategoryComparisonTable.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Table rows: one per category
- Columns: Category, Current, Baseline, Difference, Status
- Status indicator (over/under/match)
- Color coding (red for over, green for under)
- Sort by difference (biggest over/under first)
- Responsive table
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-4

**Acceptance Criteria**:
- [ ] All categories listed
- [ ] Current vs. baseline amounts shown
- [ ] Difference calculated
- [ ] Status indicator (over/under/match)
- [ ] Color coding for quick identification
- [ ] Responsive table layout

---

#### Task 5.4: Create OverspendingHighlights Component

**Objective**: Highlighted section for categories exceeding baseline.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/OverspendingHighlights.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Alert-style section
- Lists categories overspending
- Shows amount over for each
- Suggestion to review category
- "Update baseline" prompt if many categories over
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: US-4, US-6

**Acceptance Criteria**:
- [ ] Lists overspending categories
- [ ] Shows overspend amount
- [ ] Provides actionable suggestions
- [ ] Alert styling for visibility

---

### EPIC 6: Recommendation Engine

**Objective**: Implement smart recommendation generation logic.

**Duration**: 3-5 hours

**Dependencies**: Epics 2-5 complete

**Deliverables**:
- Recommendation generator function
- Recommendation logic for each calculator
- Threshold configuration

---

#### Task 6.1: Implement Recommendation Generator

**Objective**: Create function to analyze expenses and generate recommendations.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/currentExpenses.ts` (add recommendation logic)

**Functionality**:
```typescript
// Implement:
- generateRecommendations(expenses, results, baseline): Recommendation[]
  - Subscription recommendation (if subscriptions > 10k)
  - Commute recommendation (if transport > 30k)
  - Housing recommendation (if housing > 30% of total)
  - Baseline update recommendation (if diff > 50k)
- Priority calculation based on thresholds
- Recommendation ID generation
```

**Tests**:
- Add tests to `/tests/lib/calculations/currentExpenses.test.ts`
  - Test each recommendation type
  - Test threshold logic
  - Test priority assignment
  - Test with null baseline

**Requirements Addressed**: FR-6.1-FR-6.5, US-6

**Acceptance Criteria**:
- [ ] All four recommendation types implemented
- [ ] Thresholds configurable
- [ ] Priority correctly assigned
- [ ] Returns sorted recommendations
- [ ] Unit tests pass

---

#### Task 6.2: Create Recommendation Configuration

**Objective**: Externalize recommendation thresholds and messages.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/constants/currentExpenses.ts` (modify)

**Functionality**:
```typescript
// Add to constants:
- RECOMMENDATION_THRESHOLDS: {
    subscription: { medium: 10000, high: 20000 },
    commute: { medium: 30000, high: 50000 },
    housingPercentage: { medium: 30, high: 40 },
    baselineDifference: { medium: 50000, high: 100000 },
  }
- RECOMMENDATION_MESSAGES: {
    subscription: { title, message, actionLabel },
    commute: { title, message, actionLabel },
    housing: { title, message, actionLabel },
    baseline: { title, message, actionLabel },
  }
```

**Tests**: N/A (configuration)

**Requirements Addressed**: FR-6.1-FR-6.5

**Acceptance Criteria**:
- [ ] Thresholds externalized
- [ ] Messages in Icelandic
- [ ] Easy to update thresholds
- [ ] Messages include placeholders for dynamic values

---

#### Task 6.3: Integrate Recommendations into Results

**Objective**: Ensure recommendations are calculated and included in results.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/calculations/currentExpenses.ts` (modify)
- `/src/context/CalculatorContext.tsx` (verify integration)

**Functionality**:
```typescript
// Update calculateCurrentExpenseResults:
- Call generateRecommendations at end
- Include recommendations in CurrentExpenseResults
- Ensure recommendations update when expenses change
```

**Tests**: Integration tests in Epic 8

**Requirements Addressed**: FR-6.1-FR-6.5

**Acceptance Criteria**:
- [ ] Recommendations generated on calculation
- [ ] Included in results object
- [ ] Update when expenses change
- [ ] No performance impact

---

### EPIC 7: Integration API and Hooks

**Objective**: Create custom hooks and finalize integration API for other calculators.

**Duration**: 3-4 hours

**Dependencies**: Epics 2-6 complete

**Deliverables**:
- Custom hooks for consuming current expenses
- Helper functions for extracting specific data
- Integration API documentation

---

#### Task 7.1: Create Integration Hooks

**Objective**: Custom hooks for easy consumption of current expense data.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/hooks/useCurrentExpenses.ts` (new)

**Functionality**:
```typescript
// Hooks:
- useCurrentExpenses(): { expenses, results, hasExpenses }
- useExpensesByCategory(categoryId): ExpenseCategory | null
- useSubscriptionData(): { subscriptions, total, count }
- useCommuteData(): { expenses, total }
- useHousingData(): { expenses, total, percentage }
```

**Tests**:
- `/tests/hooks/useCurrentExpenses.test.tsx` (new)
  - Test each hook
  - Test with null data
  - Test data updates

**Requirements Addressed**: FR-5.1-FR-5.5, US-5

**Acceptance Criteria**:
- [ ] All hooks implemented
- [ ] Return correct values
- [ ] Handle null expenses gracefully
- [ ] Hooks memoized for performance
- [ ] Tests pass

---

#### Task 7.2: Create Helper Functions for Data Extraction

**Objective**: Helper functions for extracting specific expense data.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/calculations/currentExpenses.ts` (add helpers)

**Functionality**:
```typescript
// Implement helpers:
- extractSubscriptions(expenses): LineItem[]
  - From subscription category
  - From recurring items in utilities
  - From recurring items in other categories
- extractCommuteExpenses(expenses): number
  - Total from transport category
- extractHousingExpenses(expenses): number
  - Total from housing category
- extractCategoryExpenses(expenses, categoryId): number
  - Generic category total extractor
```

**Tests**:
- Add tests to `/tests/lib/calculations/currentExpenses.test.ts`

**Requirements Addressed**: FR-5.2-FR-5.5

**Acceptance Criteria**:
- [ ] All helper functions implemented
- [ ] Correctly extract data from categories
- [ ] Handle missing categories
- [ ] Unit tests pass

---

#### Task 7.3: Document Integration API

**Objective**: Create clear documentation for other calculators to use the API.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/docs/current-expense-integration.md` (new)

**Functionality**:
```markdown
# Current Expense Report Integration API

## Available Hooks
- useCurrentExpenses()
- useSubscriptionData()
- useCommuteData()
- useHousingData()

## Context Methods
- getCurrentExpenses()
- getExpensesByCategory()
- getSubscriptions()
- getCommuteExpenses()
- getHousingExpenses()

## Usage Examples
[Code examples for each calculator type]

## Data Structures
[Type definitions]
```

**Tests**: N/A (documentation)

**Requirements Addressed**: US-5

**Acceptance Criteria**:
- [ ] All hooks documented
- [ ] Usage examples provided
- [ ] Type definitions included
- [ ] Clear and concise

---

### EPIC 8: Testing and Quality Assurance

**Objective**: Comprehensive testing and quality assurance.

**Duration**: 6-8 hours

**Dependencies**: Epics 1-7 complete

**Deliverables**:
- Unit tests for calculations
- Component tests
- Integration tests
- Accessibility audit

---

#### Task 8.1: Unit Tests for Calculations

**Objective**: Comprehensive unit tests for calculation functions.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/lib/calculations/currentExpenses.test.ts` (expand)

**Tests**:
- calculateTotalExpenses with various line items
- calculateCategoryBreakdown accuracy
- calculateLifeEnergy with/without AWH
- getTopExpenses sorting and limiting
- compareToBaseline tier matching
- generateRecommendations logic
- Edge cases: empty arrays, zero values, negative values

**Requirements Addressed**: All calculation requirements

**Acceptance Criteria**:
- [ ] All calculation functions tested
- [ ] Edge cases covered
- [ ] >90% coverage for calculation module

---

#### Task 8.2: Component Tests

**Objective**: Testing React components with React Testing Library.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/tests/components/currentExpenses/*.test.tsx` (new)

**Tests**:
- CategoryExpenseEditor accordion expand/collapse
- LineItemRow inline editing
- AddLineItemButton form submission
- QuickStats display
- CategoryBreakdownChart rendering
- TopExpensesList sorting
- RecommendationPanel display and dismiss
- BaselineComparisonView conditionals

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [ ] Key components tested
- [ ] User interactions covered
- [ ] Validation tested
- [ ] Conditional rendering tested

---

#### Task 8.3: Integration Tests

**Objective**: Test integration with CalculatorContext.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/integration/currentExpenses.test.tsx` (new)

**Tests**:
- Context state updates correctly
- LocalStorage persistence works
- Export/import includes current expenses
- API methods return correct values
- Results auto-calculate
- Recommendations generate on calculation
- Event emission on updates

**Requirements Addressed**: FR-5, FR-7

**Acceptance Criteria**:
- [ ] Context integration tested
- [ ] Persistence verified
- [ ] API methods work correctly
- [ ] Event system tested

---

#### Task 8.4: Accessibility Audit

**Objective**: Verify WCAG 2.1 AA compliance.

**Duration**: 1.5 hours

**Checklist**:
- [ ] All inputs have labels
- [ ] ARIA attributes correct
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Accordion pattern accessible
- [ ] Charts have text alternatives

**Requirements Addressed**: NFR-3

**Acceptance Criteria**:
- [ ] No accessibility violations in axe
- [ ] Keyboard navigation complete
- [ ] Screen reader friendly

---

### EPIC 9: Main Page and Integration

**Objective**: Create the main page component and integrate into app navigation.

**Duration**: 3-4 hours

**Dependencies**: Epics 3-7 complete

**Deliverables**:
- Main calculator page component
- Route page
- Navigation integration
- Educational content

---

#### Task 9.1: Create CurrentExpenseReportCalculator Main Component

**Objective**: Main page component that orchestrates dashboard/editor views.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CurrentExpenseReportCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Toggle between dashboard and editor views
- Educational intro section (collapsible)
- AWH warning if not available
- Baseline comparison section (if baseline exists)
- View mode state management
```

**Tests**: Component tests in Epic 8

**Requirements Addressed**: All top-level requirements

**Acceptance Criteria**:
- [ ] View toggle works (dashboard/editor)
- [ ] Educational intro collapsible
- [ ] AWH warning shown when needed
- [ ] Baseline comparison conditional
- [ ] Responsive layout

---

#### Task 9.2: Create Route Page

**Objective**: Next.js page component for the current expense route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/rauntimautgjold/page.tsx` (new)

**Functionality**:
```typescript
// Page component:
- CalculatorProvider wrapper
- Suspense boundary
- CurrentExpenseReportCalculator component
- Metadata for SEO (Icelandic)
- Hero section with description
```

**Tests**: N/A (covered by integration tests)

**Requirements Addressed**: N/A (routing)

**Acceptance Criteria**:
- [ ] Route works at /rauntimautgjold
- [ ] Wrapped in CalculatorProvider
- [ ] Loading fallback shown
- [ ] SEO metadata in Icelandic

---

#### Task 9.3: Add to Calculator Navigation

**Objective**: Add current expense report to the calculator tab navigation.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to EXPENSE_CALCULATORS array:
{
  id: 'rauntimautgjold',
  name: 'Rauntímaútgjöld',
  description: 'Fylgstu með nákvæmum útgjöldum þínum með nákvæmum línulið.',
  icon: '📊',
  available: true,
}

// Add to ExpenseContent:
if (selectedCalculator === 'rauntimautgjold') {
  return <CurrentExpenseReportContent ... />;
}
```

**Tests**: N/A (manual testing)

**Requirements Addressed**: Navigation integration

**Acceptance Criteria**:
- [ ] Appears in Expense calculators list
- [ ] Icon and description correct
- [ ] Navigation works
- [ ] Content wrapper follows existing pattern

---

#### Task 9.4: Create Educational Content

**Objective**: Create collapsible educational section explaining the tool.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/currentExpenses/CurrentExpenseReportCalculator.tsx` (modify)

**Functionality**:
```typescript
// Educational section:
- What is Current Expense Report
- How it differs from Expense Baseline
- How to use it effectively
- Integration with other calculators
- Privacy notice
```

**Tests**: N/A (content)

**Requirements Addressed**: User education

**Acceptance Criteria**:
- [ ] Clear explanation in Icelandic
- [ ] Distinction from baseline explained
- [ ] Usage tips provided
- [ ] Privacy notice included
- [ ] Collapsible for space saving

---

## 3. Implementation Schedule

### Phase 1: Foundation (Days 1-2)
- Epic 1: Types, constants, calculations

### Phase 2: State & Core UI (Days 3-5)
- Epic 2: CalculatorContext integration
- Epic 3: Category Editor UI (parallel start)
- Epic 4: Dashboard UI (parallel start)

### Phase 3: Comparison & Recommendations (Days 6-7)
- Epic 5: Baseline Comparison View
- Epic 6: Recommendation Engine

### Phase 4: Integration & Polish (Days 8-10)
- Epic 7: Integration API and Hooks
- Epic 8: Testing and QA
- Epic 9: Main page and routing
- Final review and adjustments

---

## 4. Risk Mitigation

### Risk 1: Data Entry Burden
**Mitigation**: Pre-populate suggested line items, allow quick add of common items, provide templates.

### Risk 2: Integration Complexity
**Mitigation**: Clean API with clear contracts, event-driven updates, graceful null handling.

### Risk 3: Performance with Many Line Items
**Mitigation**: Memoized calculations, debounced inputs, virtualized lists for >50 items.

### Risk 4: Recommendation Accuracy
**Mitigation**: Configurable thresholds, user testing, feedback loop for threshold tuning.

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
- [ ] Integration with context verified

---

**Tasks Phase Complete: Ready for Implementation**
