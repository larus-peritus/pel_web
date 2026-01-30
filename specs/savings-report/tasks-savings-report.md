# Tasks: Savings Report (Sparnaðarskýrsla)

## Document Information

- **Feature Name**: Savings Report (Sparnaðarskýrsla)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development
- **Requirements**: requirements-savings-report.md
- **Design**: design-savings-report.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build foundational types and calculations first, then implement UI in feature slices (editor → dashboard → integration).

**Rationale**:
- Types and calculations can be tested independently
- Editor mode provides core data entry functionality
- Dashboard mode adds visualization and insights
- Integration API enables other calculators to use savings data

**Sequence**:
1. Foundation: Types, constants, calculations
2. State: CalculatorContext integration with persistence
3. Editor UI: Category accordion editing interface
4. Dashboard UI: Summary display with charts
5. Integration: API methods for other calculators
6. Polish: Accessibility, testing, main page

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-10 hours each)
- **Tasks**: Specific, actionable work items (1-4 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Epic 3 (Editor) and Epic 4 (Dashboard) can be parallelized after Epic 2
- Epic 5 (Integration) requires Epics 2-4 complete

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types, Constants, and Calculations

**Objective**: Create type definitions, default category configuration, and pure calculation functions.

**Duration**: 5-7 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Default categories configuration
- Pure calculation functions
- Unit tests for calculations

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for savings report data.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/types/savingsReport.ts` (new)

**Functionality**:
```typescript
// Define types for:
- SavingsCategoryConfig (id, name, icon, description, order)
- SavingsCategoryData (balance, monthlyContribution, targetAmount?, notes?)
- SavingsCategory (config + data + isHidden)
- SavingsReport (categories, lastUpdated, version)
- CategoryBreakdown (calculated breakdown per category)
- SavingsRateContext (rate, level, messageIs, fiEstimateYears)
- SavingsReportResults (totals, rate, breakdown, lifeEnergy)
```

**Tests**: N/A (types only)

**Requirements Addressed**: FR-1, FR-2 (foundational)

**Acceptance Criteria**:
- [x] All types exported from single file
- [x] JSDoc comments for each interface
- [x] Consistent with existing calculator types
- [x] No TypeScript errors

**Status**: COMPLETED 2026-01-23
**Files Created**:
- src/types/savingsReport.ts (157 lines)
**Context**: context/modules/SavingsReportTypes.md

---

#### Task 1.2: Create Default Categories Configuration

**Objective**: Define the 7 default Icelandic savings categories with constants.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/lib/constants/savingsReport.ts` (new)

**Functionality**:
```typescript
// Define constants:
- SAVINGS_REPORT_VERSION: number
- DEFAULT_SAVINGS_CATEGORIES: SavingsCategoryConfig[]
  (7 categories with Icelandic names, icons, descriptions)
- SAVINGS_CATEGORY_COLORS: Record<string, ColorScheme>
- SAVINGS_CHART_COLORS: string[]
- SAVINGS_RATE_THRESHOLDS: threshold definitions
- SAVINGS_RATE_MESSAGES: Record<level, message>
```

**Tests**: N/A (constants only)

**Requirements Addressed**: FR-1.1, FR-1.2

**Acceptance Criteria**:
- [x] All 7 categories defined with Icelandic names
- [x] Icons and descriptions in Icelandic
- [x] Savings rate thresholds and messages defined
- [x] Exportable for use in components

**Status**: COMPLETED 2026-01-23
**Files Created**:
- src/lib/constants/savingsReport.ts (167 lines)
**Context**: context/modules/SavingsReportConstants.md

---

#### Task 1.3: Implement Core Calculation Functions

**Objective**: Create pure functions for totals, savings rate, life energy, and category breakdown.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/savingsReport.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateTotalSavings(categories): number
- calculateTotalMonthlyContribution(categories): number
- calculateAnnualContribution(monthly): number
- calculateSavingsRate(contribution, income): number | null
- getSavingsRateContext(rate): SavingsRateContext | null
- calculateSavingsLifeEnergy(balance, contribution, awh): LifeEnergy | null
- calculateCategoryBreakdown(categories, totals, awh): CategoryBreakdown[]
- calculateSavingsReportResults(report, awh, income): SavingsReportResults
```

**Tests**:
- `/tests/lib/calculations/savingsReport.test.ts` (new)
  - Test totals with various categories
  - Test hidden category exclusion
  - Test savings rate calculation
  - Test life energy with/without AWH
  - Test savings rate context thresholds

**Requirements Addressed**: FR-3.1-3.7, US-5, US-6

**Acceptance Criteria**:
- [x] All calculation functions implemented
- [x] Pure functions (no side effects)
- [x] Handles edge cases (empty categories, zero values, no AWH)
- [x] Unit tests pass with >90% coverage

**Status**: COMPLETED 2026-01-23
**Files Created**:
- src/lib/calculations/savingsReport.ts (295 lines)
- tests/lib/calculations/savingsReport.test.ts (406 lines, 49 tests passing)
**Context**: context/modules/SavingsReportCalculations.md

---

### EPIC 2: State Management - CalculatorContext Integration

**Objective**: Extend CalculatorContext to manage savings report state with persistence.

**Duration**: 4-5 hours

**Dependencies**: Epic 1 complete

**Deliverables**:
- Context state for savings report
- CRUD operations for categories
- LocalStorage persistence
- API methods for other calculators

---

#### Task 2.1: Extend CalculatorContext State

**Objective**: Add savings report state and results to context.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to add savingsReport to StoredState)

**Functionality**:
```typescript
// Add to context state:
- savingsReport: SavingsReport | null
- savingsReportResults: SavingsReportResults | null

// Add to context type:
- updateSavingsReport: (report: Partial<SavingsReport>) => void
- updateSavingsCategory: (categoryId: string, data: Partial<SavingsCategoryData>) => void
- toggleSavingsCategoryVisibility: (categoryId: string) => void
- clearSavingsReport: () => void
```

**Tests**: Integration tests in Epic 6

**Requirements Addressed**: FR-5.1, FR-5.2

**Acceptance Criteria**:
- [x] State added to CalculatorContext
- [x] Results auto-calculated on state change
- [x] TypeScript types updated
- [x] No breaking changes to existing context

**Status**: COMPLETED 2026-01-26
**Files Modified**:
- src/context/CalculatorContext.tsx (lines 303, 397-414)
- src/types/calculator.ts (lines 190-208)
**Context**: context/modules/SavingsReportContext.md

---

#### Task 2.2: Implement Context Actions

**Objective**: Create all CRUD operations for savings report management.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Implement actions:
- updateSavingsReport: Merge partial updates
- updateSavingsCategory: Update specific category's data
- toggleSavingsCategoryVisibility: Hide/show categories
- clearSavingsReport: Remove all data
- initializeSavingsReport: Create with default categories
```

**Tests**: Integration tests in Epic 6

**Requirements Addressed**: FR-1.4

**Acceptance Criteria**:
- [x] All actions implemented with useCallback
- [x] Immutable state updates
- [x] Auto-recalculate results after each action
- [x] Initialize with default categories when needed

**Status**: COMPLETED 2026-01-26
**Files Modified**:
- src/context/CalculatorContext.tsx (lines 1423-1514)
**Context**: context/modules/SavingsReportContext.md

---

#### Task 2.3: Implement LocalStorage Persistence

**Objective**: Save and load savings report from localStorage.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// Persistence:
- Load savingsReport on mount (with migration if needed)
- Auto-save on changes (debounced 500ms)
- Include in exportData/importData functions
- Add to resetAll function
```

**Tests**: Integration tests in Epic 6

**Requirements Addressed**: FR-5.1-5.4, NFR-1

**Acceptance Criteria**:
- [x] Loads savings on mount
- [x] Debounced auto-save (500ms)
- [x] Included in export/import
- [x] Schema migration support

**Status**: COMPLETED 2026-01-26
**Files Modified**:
- src/context/CalculatorContext.tsx (mount: 510-516, save: 555-561, export: 1665-1671, import: 1766-1773, reset: 1818)
- src/types/calculator.ts (StoredState interface: 190-208)
**Context**: context/modules/SavingsReportContext.md

---

#### Task 2.4: Implement Integration API

**Objective**: Create API methods for other calculators to access savings data.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)

**Functionality**:
```typescript
// API methods:
- getSavingsReport: () => SavingsReport | null
- getTotalSavings: () => number
- getTotalMonthlyContribution: () => number
- getSavingsRate: () => number | null
- hasSavingsReport: () => boolean
```

**Tests**: Integration tests in Epic 6

**Requirements Addressed**: FR-6.1-6.5, US-3

**Acceptance Criteria**:
- [x] All API methods exposed via context
- [x] Returns correct values
- [x] Handles null savings gracefully
- [x] Ready for FI calculator integration

**Status**: COMPLETED 2026-01-26
**Files Modified**:
- src/context/CalculatorContext.tsx (API functions: 1516-1554, context value: 1938-1949)
**Context**: context/modules/SavingsReportContext.md

---

### EPIC 3: Editor UI

**Objective**: Create category-by-category editing interface.

**Duration**: 6-8 hours

**Dependencies**: Epic 2 complete

**Deliverables**:
- Editor container component
- Category accordion component
- Input fields for balance, contribution, target, notes
- Expand/collapse controls

---

#### Task 3.1: Create SavingsEditor Container Component

**Objective**: Main container for editing savings categories.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/SavingsEditor.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Track expanded/collapsed state per category
- Display category accordions sorted by order
- Expand all / collapse all controls
- Hidden categories section
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: FR-1.3, US-1

**Acceptance Criteria**:
- [x] Manages accordion state for all categories
- [x] Expand/collapse all buttons work
- [x] Categories sorted by order
- [x] Shows hidden categories section when applicable

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/SavingsEditor.tsx (166 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

#### Task 3.2: Create CategoryAccordion Component

**Objective**: Single savings category with expandable details.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/CategoryAccordion.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Accordion header (icon, name, balance total, expand indicator)
- Expandable content with input fields
- Balance input with life energy display
- Contribution input with life energy display
- Optional target input with progress bar
- Optional notes textarea
- Hide category button
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-1, US-2, US-3, US-4, US-7

**Acceptance Criteria**:
- [x] Accordion opens/closes correctly
- [x] All input fields functional
- [x] Life energy shown when AWH available
- [x] Progress bar shown when target set
- [x] Hide button works

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/CategoryAccordion.tsx (205 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

#### Task 3.3: Create BalanceInput Component

**Objective**: Currency input for balance with life energy display.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/savingsReport/BalanceInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- CurrencyInput for balance (ISK)
- Label: "Núverandi staða"
- Life energy display (X klst) when AWH available
- Validation (non-negative)
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-2, FR-2.1

**Acceptance Criteria**:
- [x] CurrencyInput with proper formatting
- [x] Life energy calculated and displayed
- [x] Validation prevents negative values
- [x] Accessible labels

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/BalanceInput.tsx (67 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

#### Task 3.4: Create ContributionInput Component

**Objective**: Currency input for monthly contribution with life energy display.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/savingsReport/ContributionInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- CurrencyInput for contribution (ISK/month)
- Label: "Mánaðarleg framlög"
- Life energy display (X klst/mán) when AWH available
- Validation (non-negative)
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-3, FR-2.2

**Acceptance Criteria**:
- [x] CurrencyInput with proper formatting
- [x] Monthly life energy calculated
- [x] Validation prevents negative values
- [x] Accessible labels

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/ContributionInput.tsx (67 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

#### Task 3.5: Create TargetInput Component

**Objective**: Optional currency input for target amount with progress display.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/TargetInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- CurrencyInput for target (ISK) - optional
- Label: "Markmið (valfrjálst)"
- Progress bar showing current vs target
- Percentage display
- Remaining amount display
- Life energy for remaining (when AWH available)
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-4, FR-2.3, FR-3.5, FR-3.6

**Acceptance Criteria**:
- [x] Optional input (can be empty)
- [x] Progress bar renders correctly
- [x] Percentage and remaining calculated
- [x] Handles target < balance case

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/TargetInput.tsx (150 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

#### Task 3.6: Create NotesInput Component

**Objective**: Optional textarea for category notes.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/NotesInput.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Textarea for notes
- Label: "Athugasemdir (valfrjálst)"
- Character count (optional)
- Placeholder text
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-7, FR-2.4

**Acceptance Criteria**:
- [x] Textarea with proper styling
- [x] Persists notes correctly
- [x] Accessible label

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/NotesInput.tsx (61 lines)
**Context**: context/modules/SavingsReportEditorUI.md

---

### EPIC 4: Dashboard UI

**Objective**: Create visual summary display with stats and charts.

**Duration**: 5-7 hours

**Dependencies**: Epic 2 complete (can run parallel with Epic 3)

**Deliverables**:
- Dashboard container
- Quick stats cards
- Category breakdown chart
- Savings progress list
- Savings rate insights

---

#### Task 4.1: Create SavingsDashboard Container Component

**Objective**: Main container for dashboard view.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/savingsReport/SavingsDashboard.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Header with edit button
- QuickStats section
- CategoryBreakdownChart
- SavingsProgressList (categories with targets)
- SavingsRateInsights
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: FR-4.1-4.5

**Acceptance Criteria**:
- [x] Renders all sub-components ✅
- [x] Edit button switches to editor mode ✅
- [x] Responsive layout ✅
- [x] Shows empty state when no data ✅

**Status**: COMPLETED 2026-01-26
**Files**: src/components/savingsReport/SavingsDashboard.tsx (113 lines)
**Tests**: tests/components/savingsReport/SavingsDashboard.test.tsx (16 tests passing)
**Context**: context/modules/SavingsDashboard.md

---

#### Task 4.2: Create QuickStats Component

**Objective**: Summary stat cards at top of dashboard.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/QuickStats.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Total savings card
- Monthly contribution card
- Savings rate card (if income available)
- Life energy card (if AWH available)
- Responsive grid layout
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: FR-4.1-4.3, US-5, US-6

**Acceptance Criteria**:
- [x] Four stat cards displayed ✅
- [x] Conditional rendering for rate/life energy ✅
- [x] Proper ISK formatting ✅
- [x] Responsive 4→2→1 column layout ✅

**Status**: COMPLETED 2026-01-26
**Files**: src/components/savingsReport/QuickStats.tsx (95 lines)
**Tests**: tests/components/savingsReport/QuickStats.test.tsx (16 tests passing)
**Context**: context/modules/SavingsDashboard.md

---

#### Task 4.3: Create CategoryBreakdownChart Component

**Objective**: Pie/donut chart showing balance distribution.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/CategoryBreakdownChart.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Pie/donut chart (using recharts or similar)
- Category colors matching constants
- Legend with category names and percentages
- Interactive hover states
- Responsive sizing
```

**Tests**: Visual testing (manual)

**Requirements Addressed**: FR-4.4

**Acceptance Criteria**:
- [x] Chart renders correctly ✅
- [x] Colors match category colors ✅
- [x] Legend shows percentages ✅
- [x] Handles zero values gracefully ✅

**Status**: COMPLETED 2026-01-26
**Files**: src/components/savingsReport/CategoryBreakdownChart.tsx (171 lines)
**Tests**: tests/components/savingsReport/CategoryBreakdownChart.test.tsx (10 tests passing)
**Context**: context/modules/SavingsDashboard.md

---

#### Task 4.4: Create SavingsProgressList Component

**Objective**: Progress bars for categories with targets.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/SavingsProgressList.tsx` (new)

**Functionality**:
```typescript
// Component features:
- List of categories that have targets
- Progress bar per category
- Current amount vs target display
- Remaining amount display
- Life energy for remaining
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-4, FR-3.5, FR-3.6

**Acceptance Criteria**:
- [x] Only shows categories with targets ✅
- [x] Progress bars render correctly ✅
- [x] Shows remaining amount ✅
- [x] Empty state if no targets set ✅

**Status**: COMPLETED 2026-01-26
**Files**: src/components/savingsReport/SavingsProgressList.tsx (127 lines)
**Tests**: tests/components/savingsReport/SavingsProgressList.test.tsx (15 tests passing)
**Context**: context/modules/SavingsDashboard.md

---

#### Task 4.5: Create SavingsRateInsights Component

**Objective**: Contextual savings rate information and FI estimate.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/savingsReport/SavingsRateInsights.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Large savings rate display
- Context message based on rate level
- FI timeline estimate (when applicable)
- Link to improve (if low rate)
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: US-5, FR-3.4

**Acceptance Criteria**:
- [x] Shows rate with context message ✅
- [x] Icelandic messages ✅
- [x] FI estimate when appropriate ✅
- [x] Handles missing income gracefully ✅

**Status**: COMPLETED 2026-01-26
**Files**: src/components/savingsReport/SavingsRateInsights.tsx (120 lines)
**Tests**: tests/components/savingsReport/SavingsRateInsights.test.tsx (19 tests passing)
**Context**: context/modules/SavingsDashboard.md

---

### EPIC 5: Main Component and Integration

**Objective**: Create main calculator component and integrate with routing.

**Duration**: 4-5 hours

**Dependencies**: Epics 3-4 complete

**Deliverables**:
- Main SavingsReportCalculator component
- Educational intro section
- View mode toggle
- Route page
- Navigation integration

---

#### Task 5.1: Create SavingsReportCalculator Main Component

**Objective**: Main page component that orchestrates dashboard/editor modes.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/SavingsReportCalculator.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Detect mode (editor if no data, dashboard if exists)
- View mode toggle (dashboard/editor)
- Educational intro (collapsible)
- AWH warning if not calculated
- Render appropriate mode container
```

**Tests**: Component tests in Task 6.2

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [x] Auto-detects appropriate mode ✅
- [x] Toggle between modes works ✅
- [x] Educational intro collapsible ✅
- [x] AWH warning shown when needed ✅
- [x] Responsive layout ✅

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/SavingsReportCalculator.tsx (157 lines)
**Context**: context/modules/SavingsReportCalculator.md

---

#### Task 5.2: Create Component Barrel Export

**Objective**: Export all savings report components from single entry point.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/savingsReport/index.ts` (new)

**Functionality**:
```typescript
// Export all public components:
export { SavingsReportCalculator } from './SavingsReportCalculator';
export { SavingsDashboard } from './SavingsDashboard';
export { SavingsEditor } from './SavingsEditor';
// Export types
export type { ... } from ...
```

**Tests**: N/A

**Requirements Addressed**: N/A (organization)

**Acceptance Criteria**:
- [x] All public components exported ✅
- [x] No circular dependencies ✅
- [x] Clean import paths ✅

**Status**: COMPLETED 2026-01-26
**Files Created**: src/components/savingsReport/index.ts (23 lines)

---

#### Task 5.3: Create Route Page

**Objective**: Next.js page component for the savings report route.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/sparnadarskyrsla/page.tsx` (new)

**Functionality**:
```typescript
// Page component:
- Suspense boundary
- SavingsReportCalculator component
- Metadata for SEO
- Privacy note section
```

**Tests**: N/A (covered by integration tests)

**Requirements Addressed**: N/A (routing)

**Acceptance Criteria**:
- [x] Route works at /sparnadarskyrsla ✅
- [x] Loading fallback shown ✅
- [x] SEO metadata set ✅

**Status**: COMPLETED 2026-01-26
**Files Created**: src/app/sparnadarskyrsla/page.tsx (85 lines)
**Route**: /sparnadarskyrsla accessible and functional

---

#### Task 5.4: Add to Calculator Navigation

**Objective**: Add savings report to the calculator tab navigation.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/components/calculator/CalculatorPageContent.tsx` (modify)

**Functionality**:
```typescript
// Add to SAVINGS_CALCULATORS array (or appropriate array):
{
  id: 'sparnadarskyrsla',
  name: 'Sparnaðarskýrsla',
  description: 'Fylgstu með sparnaðinum þínum í einum stað.',
  icon: '💰',
  available: true,
}

// Add to appropriate Content component
```

**Tests**: N/A (manual testing)

**Requirements Addressed**: N/A (navigation)

**Acceptance Criteria**:
- [x] Appears in calculator navigation ✅
- [x] Icon and description correct ✅
- [x] Navigation works ✅

**Status**: COMPLETED 2026-01-26
**Files Modified**: src/components/calculator/CalculatorPageContent.tsx
**Navigation**: Added to SAVINGS_CALCULATORS array, appears in "Sparnaður" tab

---

### EPIC 6: Testing and Quality Assurance

**Objective**: Comprehensive testing and quality assurance.

**Duration**: 5-6 hours

**Dependencies**: Epics 1-5 complete

**Deliverables**:
- Unit tests for calculations
- Component tests
- Integration tests
- Accessibility audit

---

#### Task 6.1: Unit Tests for Calculations

**Objective**: Comprehensive unit tests for calculation functions.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/lib/calculations/savingsReport.test.ts` (new)

**Tests**:
- calculateTotalSavings with various inputs
- calculateTotalMonthlyContribution accuracy
- calculateSavingsRate with/without income
- getSavingsRateContext threshold tests
- calculateSavingsLifeEnergy with/without AWH
- calculateCategoryBreakdown accuracy
- Edge cases: empty arrays, zero values, hidden categories

**Requirements Addressed**: All calculation requirements

**Acceptance Criteria**:
- [ ] All calculation functions tested
- [ ] Edge cases covered
- [ ] >90% coverage for calculation module

---

#### Task 6.2: Component Tests

**Objective**: Testing React components with React Testing Library.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/tests/components/savingsReport/*.test.tsx` (new)

**Tests**:
- SavingsReportCalculator mode detection
- SavingsEditor accordion behavior
- CategoryAccordion expand/collapse
- QuickStats conditional rendering
- Input validation
- Form submission

**Requirements Addressed**: All UI requirements

**Acceptance Criteria**:
- [ ] Key components tested
- [ ] User interactions covered
- [ ] Validation tested

---

#### Task 6.3: Integration Tests

**Objective**: Test integration with CalculatorContext.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/tests/integration/savingsReport.test.tsx` (new)

**Tests**:
- Context state updates correctly
- LocalStorage persistence works
- Export/import includes savings
- API methods return correct values
- Results auto-calculate
- Integration with AWH

**Requirements Addressed**: FR-5, FR-6

**Acceptance Criteria**:
- [ ] Context integration tested
- [ ] Persistence verified
- [ ] API methods work correctly

---

#### Task 6.4: Accessibility Audit

**Objective**: Verify WCAG 2.1 AA compliance.

**Duration**: 1 hour

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

## 3. Implementation Schedule

### Phase 1: Foundation (Day 1)
- Epic 1: Types, constants, calculations

### Phase 2: State & Core UI (Days 2-4)
- Epic 2: CalculatorContext integration
- Epic 3: Editor UI (parallel start)
- Epic 4: Dashboard UI (parallel start)

### Phase 3: Integration & Polish (Days 5-6)
- Epic 5: Main component and routing
- Epic 6: Testing and QA

### Phase 4: Review (Day 7)
- Final review and adjustments
- Documentation update

---

## 4. File Structure Summary

```
src/
├── types/
│   └── savingsReport.ts                    # Task 1.1
│
├── lib/
│   ├── constants/
│   │   └── savingsReport.ts                # Task 1.2
│   │
│   └── calculations/
│       └── savingsReport.ts                # Task 1.3
│
├── context/
│   └── CalculatorContext.tsx               # Tasks 2.1-2.4 (modify)
│
├── components/
│   └── savingsReport/
│       ├── index.ts                        # Task 5.2
│       ├── SavingsReportCalculator.tsx     # Task 5.1
│       ├── SavingsDashboard.tsx            # Task 4.1
│       ├── SavingsEditor.tsx               # Task 3.1
│       ├── CategoryAccordion.tsx           # Task 3.2
│       ├── BalanceInput.tsx                # Task 3.3
│       ├── ContributionInput.tsx           # Task 3.4
│       ├── TargetInput.tsx                 # Task 3.5
│       ├── NotesInput.tsx                  # Task 3.6
│       ├── QuickStats.tsx                  # Task 4.2
│       ├── CategoryBreakdownChart.tsx      # Task 4.3
│       ├── SavingsProgressList.tsx         # Task 4.4
│       └── SavingsRateInsights.tsx         # Task 4.5
│
└── app/
    └── sparnadarskyrsla/
        └── page.tsx                        # Task 5.3

tests/
├── lib/
│   └── calculations/
│       └── savingsReport.test.ts           # Task 6.1
│
├── components/
│   └── savingsReport/
│       └── *.test.tsx                      # Task 6.2
│
└── integration/
    └── savingsReport.test.tsx              # Task 6.3
```

---

## 5. Risk Mitigation

### Risk 1: Complex State with Multiple Categories
**Mitigation**: Keep state flat, use immutable updates, test thoroughly.

### Risk 2: Chart Library Integration
**Mitigation**: Use recharts (already in project) or simple CSS-based charts as fallback.

### Risk 3: Performance with Many Categories
**Mitigation**: Memoize calculations, use virtualization if needed (unlikely with 7 categories).

### Risk 4: AWH/Income Not Available
**Mitigation**: Design all features to work without AWH/income, enhance when available.

---

## 6. Definition of Done

Each task is complete when:
- [ ] Code implemented and compiles without errors
- [ ] Unit tests pass (where applicable)
- [ ] Accessibility requirements met
- [ ] Icelandic text used for all UI
- [ ] Code reviewed or self-reviewed
- [ ] No console errors or warnings
- [ ] Responsive on mobile, tablet, desktop

---

## 7. Task Dependencies Diagram

```
Epic 1 (Foundation)
  └── Task 1.1 → Task 1.2 → Task 1.3

Epic 2 (State) [depends on Epic 1]
  └── Task 2.1 → Task 2.2 → Task 2.3 → Task 2.4

Epic 3 (Editor) [depends on Epic 2]        Epic 4 (Dashboard) [depends on Epic 2]
  └── Task 3.1                                └── Task 4.1
       └── Task 3.2                                └── Task 4.2
            ├── Task 3.3                           └── Task 4.3
            ├── Task 3.4                           └── Task 4.4
            ├── Task 3.5                           └── Task 4.5
            └── Task 3.6

                    ↓                                      ↓
                    └────────────────────┬─────────────────┘
                                         ↓
                                   Epic 5 (Integration)
                                     └── Task 5.1 → Task 5.2 → Task 5.3 → Task 5.4

                                                     ↓
                                              Epic 6 (Testing)
                                                └── Tasks 6.1-6.4
```

---

**Tasks Phase Complete: Ready for Implementation**
