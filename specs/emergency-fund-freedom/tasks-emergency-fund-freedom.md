# Tasks: Emergency Fund Freedom Meter

## Document Information

- **Feature Name**: Emergency Fund Freedom Meter (Neyðarsjóður Frelsissmælir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements**: requirements-emergency-fund-freedom.md
- **Design**: design-emergency-fund-freedom.md

---

## 1. Implementation Strategy

### 1.1 Approach: Foundation-First with Feature Slices

**Strategy**: Build foundational types and calculations first, then implement UI in feature slices (input → display → progress → integration).

**Rationale**:
- Calculations can be tested independently of UI
- Types provide contract for components
- Each slice delivers visible progress
- Integration layer added last when all pieces stable

**Sequence**:
1. Foundation: Types, calculations, utilities
2. State: CalculatorContext integration
3. Core UI: Input and basic results display
4. Enhanced UI: Progress tracker, risk rating
5. Polish: Educational content, accessibility, testing

### 1.2 Task Hierarchy

**Two Levels**:
- **Epics**: Major implementation areas (4-8 hours each)
- **Tasks**: Specific, actionable work items (2-6 hours each)

**Dependency Management**:
- Tasks within epics are generally sequential
- Some epics can be parallelized (e.g., UI components after foundation)
- Testing tasks follow implementation

---

## 2. Task Breakdown

### EPIC 1: Foundation - Types and Calculations

**Objective**: Create type definitions and pure calculation functions that form the foundation of the feature.

**Duration**: 6-8 hours

**Dependencies**: None (starting point)

**Deliverables**:
- TypeScript type definitions
- Pure calculation functions
- Unit tests for calculations
- Utility functions for formatting

---

#### Task 1.1: Create Type Definitions

**Objective**: Define TypeScript interfaces and types for emergency fund data and results.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/types/emergencyFund.ts` (new)

**Functionality**:
```typescript
// Define interfaces for:
- EmergencyFundData (balance, monthlyExpenses, lastUpdated)
- EmergencyFundResults (all calculated metrics)
- RiskRating (level, label, color, explanation, recommendation)
- TargetProgress (months, targetAmount, progress, etc.)
- ColorScheme (Tailwind classes)
- ValidationResult (valid, error)
```

**Tests**: N/A (types only)

**Requirements Addressed**: All (foundational)

**Acceptance Criteria**:
- [ ] All types exported from single file
- [ ] JSDoc comments for each interface
- [ ] Consistent with existing calculator types
- [ ] No TypeScript errors

---

#### Task 1.2: Implement Core Calculation Functions

**Objective**: Create pure functions for months of freedom, life energy hours, risk rating, and target progress.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/lib/calculations/emergencyFund.ts` (new)

**Functionality**:
```typescript
// Implement functions:
- calculateMonthsOfFreedom(balance, monthlyExpenses): number
- calculateWeeksOfFreedom(months): number
- calculateLifeEnergyHours(balance, actualHourlyWage): number | null
- hoursToWorkWeeks(hours): number
- hoursToYears(hours): number
- calculateRiskRating(months): RiskRating
- calculateTargetProgress(balance, monthlyExpenses): TargetProgress[]
- calculateEmergencyFundResults(data, actualHourlyWage): EmergencyFundResults
```

**Tests**:
- `/tests/lib/calculations/emergencyFund.test.ts` (new)
  - Test each function with typical inputs
  - Test edge cases (zero, negative, very large numbers)
  - Test null handling for AWH integration

**Requirements Addressed**: Req 2, 3, 4, 5

**Acceptance Criteria**:
- [ ] All calculation functions implemented
- [ ] Pure functions (no side effects)
- [ ] Handles edge cases gracefully
- [ ] 100% test coverage for calculations
- [ ] Risk rating thresholds correct (1, 3, 6, 12 months)

---

#### Task 1.3: Create Formatting Utilities

**Objective**: Implement Icelandic number and currency formatting functions.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/lib/utils/formatting.ts` (modify existing or create new section)

**Functionality**:
```typescript
// Add formatting functions:
- formatIcelandicCurrency(amount): string  // "300.000 kr"
- formatDecimalNumber(num, decimals): string  // "8,5"
- formatHours(hours): string  // "1.234 klukkustundir"
- formatWorkWeeks(weeks): string  // "30,9 vinnuvikur"
- formatYears(years): string  // "2,3 ár"
```

**Tests**:
- Add tests to existing formatting test file
  - Test typical numbers
  - Test very large/small numbers
  - Test decimal precision

**Requirements Addressed**: Req 2, 3, 6 (Icelandic formatting)

**Acceptance Criteria**:
- [ ] Icelandic number format (space separator, comma decimal)
- [ ] ISK currency format with "kr" suffix
- [ ] Proper pluralization handling
- [ ] All formatting tested

---

#### Task 1.4: Define Icelandic Expense Examples Constants

**Objective**: Create constant definitions for Icelandic expense presets.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/lib/constants/emergencyFund.ts` (new)

**Functionality**:
```typescript
// Define constants:
- ICELANDIC_EXPENSE_EXAMPLES (array of presets)
- EMERGENCY_FUND_TARGETS (3, 6, 12 month definitions)
- TARGET_EXPLANATIONS (Icelandic purpose text)
- RISK_RATING_TRANSLATIONS (Icelandic labels)
```

**Tests**: N/A (constants)

**Requirements Addressed**: Req 6 (Icelandic context)

**Acceptance Criteria**:
- [ ] Three expense examples defined (200k, 350k, 500k)
- [ ] All text in Icelandic
- [ ] Current date documented in comments
- [ ] Export for use in components

---

### EPIC 2: State Management Integration

**Objective**: Extend CalculatorContext to include emergency fund state and integrate with existing AWH calculator.

**Duration**: 5-6 hours

**Dependencies**: Epic 1 (types and calculations)

**Deliverables**:
- CalculatorContext extended with emergency fund state
- LocalStorage persistence
- Integration with Actual Hourly Wage
- Export/import support

---

#### Task 2.1: Extend CalculatorContext with Emergency Fund State

**Objective**: Add emergency fund state management to existing CalculatorContext.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify to import emergency fund types)

**Functionality**:
```typescript
// Add to CalculatorContextType interface:
- emergencyFundData: EmergencyFundData | null
- emergencyFundResults: EmergencyFundResults | null
- updateEmergencyFundData(data: Partial<EmergencyFundData>): void
- clearEmergencyFundData(): void

// Implement:
- useState for emergencyFundData
- useMemo for emergencyFundResults (calculated from data + AWH)
- updateEmergencyFundData callback
- clearEmergencyFundData callback
```

**Tests**:
- `/tests/context/CalculatorContext.emergencyFund.test.tsx` (new)
  - Test state updates
  - Test calculation triggering
  - Test integration with AWH results

**Requirements Addressed**: Req 1, 3 (state management, AWH integration)

**Acceptance Criteria**:
- [ ] State added to context without breaking existing functionality
- [ ] Results recalculate when data or AWH changes
- [ ] Proper TypeScript types throughout
- [ ] Tests pass

---

#### Task 2.2: Implement LocalStorage Persistence

**Objective**: Save and restore emergency fund data from localStorage.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/context/CalculatorContext.tsx` (modify)
- `/src/types/calculator.ts` (modify StoredState type)

**Functionality**:
```typescript
// Add to StoredState interface:
- emergencyFund?: { balance, monthlyExpenses, lastUpdated }

// Implement:
- useEffect to save emergencyFundData to localStorage on change
- useEffect to load emergencyFundData on mount
- Handle lastUpdated date serialization/deserialization
```

**Tests**:
- Add tests to existing localStorage test file
  - Test save on data change
  - Test load on mount
  - Test date serialization

**Requirements Addressed**: Req 7 (data persistence)

**Acceptance Criteria**:
- [ ] Data persists across page reloads
- [ ] Integrates with existing StoredState schema
- [ ] Date handling correct
- [ ] No conflicts with other calculator data

---

#### Task 2.3: Add Export/Import Support

**Objective**: Include emergency fund data in export/import functionality.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/calculator/ExportImportButtons.tsx` (modify)

**Functionality**:
```typescript
// Modify exportData():
- Include emergencyFundData in JSON export

// Modify importData():
- Restore emergencyFundData from import
- Validate data structure
- Handle missing emergencyFund field gracefully
```

**Tests**:
- Add tests to existing ExportImportButtons test file
  - Test export includes emergency fund
  - Test import restores data
  - Test import with missing field
  - Test import with invalid data

**Requirements Addressed**: Req 7 (export/import)

**Acceptance Criteria**:
- [ ] Emergency fund data included in exports
- [ ] Import restores emergency fund data correctly
- [ ] Backward compatible with old exports (no emergency fund)
- [ ] Validation prevents corrupt data

---

### EPIC 3: Core UI - Input and Results

**Objective**: Build input form and basic results display components.

**Duration**: 6-8 hours

**Dependencies**: Epic 1, Epic 2

**Deliverables**:
- EmergencyFundInputs component
- EmergencyFundResults component
- Basic validation
- Responsive layout

---

#### Task 3.1: Create EmergencyFundInputs Component

**Objective**: Build input form with validation for balance and monthly expenses.

**Duration**: 3 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/EmergencyFundInputs.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Two CurrencyInput fields (balance, monthlyExpenses)
- Real-time validation (non-negative balance, positive expenses)
- Error message display (inline, Icelandic)
- Debounced updates (300ms) to context
- Accessible labels and ARIA attributes
```

**Tests**:
- `/tests/components/emergencyFund/EmergencyFundInputs.test.tsx` (new)
  - Test input rendering
  - Test validation errors
  - Test debounced updates
  - Test accessibility (labels, ARIA)

**Requirements Addressed**: Req 1 (input collection), NFR (usability, accessibility)

**Acceptance Criteria**:
- [ ] Inputs render correctly
- [ ] Validation shows appropriate errors
- [ ] Updates debounced to prevent excessive calculations
- [ ] Keyboard accessible
- [ ] Screen reader friendly

---

#### Task 3.2: Create ExpenseExamplesSelector Component

**Objective**: Build preset selector for Icelandic expense examples.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/ExpenseExamplesSelector.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display 3 preset buttons (Lágmark, Meðaltal, Rúmlegt)
- Click to auto-populate monthlyExpenses
- Visual indication of current selection (if applicable)
- Tooltips with descriptions
```

**Tests**:
- `/tests/components/emergencyFund/ExpenseExamplesSelector.test.tsx` (new)
  - Test preset buttons render
  - Test click updates expenses
  - Test tooltip display
  - Test keyboard interaction

**Requirements Addressed**: Req 6 (Icelandic context)

**Acceptance Criteria**:
- [ ] Three presets displayed clearly
- [ ] Click updates monthly expenses
- [ ] Visual feedback on selection
- [ ] Accessible

---

#### Task 3.3: Create MonthsOfFreedomDisplay Component

**Objective**: Display primary metric (months of freedom) with color coding.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/MonthsOfFreedomDisplay.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Large, prominent display of months value
- Color coding based on risk level (red < 1, orange < 3, amber < 6, green < 12, emerald ≥ 12)
- Alternative display in weeks if < 1 month
- Plain language interpretation ("Þú getur lifað af í X mánuði")
- Smooth number transitions
```

**Tests**:
- `/tests/components/emergencyFund/MonthsOfFreedomDisplay.test.tsx` (new)
  - Test rendering with various months values
  - Test color coding at thresholds
  - Test weeks display for < 1 month
  - Test plain language text

**Requirements Addressed**: Req 2 (months calculation), Req 8 (visual design)

**Acceptance Criteria**:
- [ ] Months displayed prominently
- [ ] Correct color for each risk level
- [ ] Weeks shown when < 1 month
- [ ] Smooth transitions
- [ ] Accessible color contrast

---

#### Task 3.4: Create EmergencyFundResults Component

**Objective**: Compose results display with months, life energy (if available), and risk rating.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/EmergencyFundResults.tsx` (new)
- `/src/components/emergencyFund/LifeEnergyDisplay.tsx` (new)
- `/src/components/emergencyFund/RiskRatingCard.tsx` (new)

**Functionality**:
```typescript
// EmergencyFundResults:
- Layout container for results
- Conditional rendering (only show if data valid)
- Responsive grid/flex layout

// LifeEnergyDisplay:
- Display hours, work-weeks, years (as applicable)
- Null state: prompt to complete AWH calculator
- Icon and formatting

// RiskRatingCard:
- Badge with risk level and color
- Explanation text
- Recommendation (if applicable)
```

**Tests**:
- `/tests/components/emergencyFund/EmergencyFundResults.test.tsx` (new)
- `/tests/components/emergencyFund/LifeEnergyDisplay.test.tsx` (new)
- `/tests/components/emergencyFund/RiskRatingCard.test.tsx` (new)
  - Test rendering with complete data
  - Test rendering without AWH data
  - Test different risk levels
  - Test responsive layout

**Requirements Addressed**: Req 2, 3, 4, 8

**Acceptance Criteria**:
- [ ] All metrics display correctly
- [ ] Graceful handling of missing AWH
- [ ] Proper visual hierarchy
- [ ] Responsive across breakpoints

---

### EPIC 4: Enhanced UI - Progress and Education

**Objective**: Add target progress tracker and educational content.

**Duration**: 5-6 hours

**Dependencies**: Epic 3 (core UI)

**Deliverables**:
- TargetProgressTracker component
- EducationalPanel component
- Progress animations
- Collapsible sections

---

#### Task 4.1: Create TargetMilestone Component

**Objective**: Build individual milestone display with progress bar.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/TargetMilestone.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display months target (3, 6, or 12)
- Target amount in ISK
- Progress bar (0-100%)
- Achievement indicator (checkmark if met)
- Amount remaining (if not met)
- Purpose explanation
- Animated progress bar
- ARIA progressbar role
```

**Tests**:
- `/tests/components/emergencyFund/TargetMilestone.test.tsx` (new)
  - Test rendering for incomplete target
  - Test rendering for achieved target
  - Test progress bar width calculation
  - Test accessibility (progressbar role, aria-valuenow)

**Requirements Addressed**: Req 5 (target recommendations)

**Acceptance Criteria**:
- [ ] Progress bar animates smoothly
- [ ] Achievement clearly indicated
- [ ] Amount remaining calculated correctly
- [ ] Accessible to screen readers

---

#### Task 4.2: Create TargetProgressTracker Component

**Objective**: Compose full progress tracker with all three milestones.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/TargetProgressTracker.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Display all three TargetMilestone components
- Responsive layout (stack on mobile)
- Section header and introduction
- Celebratory message if all targets exceeded
```

**Tests**:
- `/tests/components/emergencyFund/TargetProgressTracker.test.tsx` (new)
  - Test rendering all milestones
  - Test congratulatory message when all achieved
  - Test responsive layout

**Requirements Addressed**: Req 5 (target tracking), Req 8 (visual design)

**Acceptance Criteria**:
- [ ] All three targets displayed
- [ ] Responsive on mobile/tablet/desktop
- [ ] Celebration message appears when appropriate
- [ ] Clear visual progression (3 → 6 → 12)

---

#### Task 4.3: Create EducationalPanel Component

**Objective**: Build collapsible educational content with explanations and FAQ.

**Duration**: 2 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/EducationalPanel.tsx` (new)

**Functionality**:
```typescript
// Component features:
- Collapsible/expandable panel
- Introduction to emergency funds
- Explanation of why 3/6/12 months
- Calculation methodology ("How is this calculated?")
- FAQ section
- Link to detailed guide (if exists)
- Default collapsed state
```

**Tests**:
- `/tests/components/emergencyFund/EducationalPanel.test.tsx` (new)
  - Test expand/collapse functionality
  - Test content rendering
  - Test keyboard accessibility (Enter/Space to toggle)

**Requirements Addressed**: Req 9 (educational content)

**Acceptance Criteria**:
- [ ] Content is clear and motivating
- [ ] Collapses/expands smoothly
- [ ] Default collapsed to reduce clutter
- [ ] Keyboard accessible
- [ ] All text in Icelandic

---

### EPIC 5: Main Calculator Page

**Objective**: Compose all components into main EmergencyFundCalculator page component.

**Duration**: 4-5 hours

**Dependencies**: Epic 3, Epic 4

**Deliverables**:
- EmergencyFundCalculator page component
- Routing/navigation
- Layout integration
- SEO metadata

---

#### Task 5.1: Create EmergencyFundCalculator Page Component

**Objective**: Build main page component that composes all sub-components.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/EmergencyFundCalculator.tsx` (new)
- `/src/components/emergencyFund/index.ts` (new - exports)

**Functionality**:
```typescript
// Component features:
- Use CalculatorContext for state
- Section component wrapper
- Page header with title and subtitle
- EducationalPanel (collapsible)
- Two-column layout: EmergencyFundInputs | EmergencyFundResults
- TargetProgressTracker below
- Responsive layout (stack on mobile)
- Loading states
- Empty state (no data yet)
```

**Tests**:
- `/tests/components/emergencyFund/EmergencyFundCalculator.test.tsx` (new)
  - Test rendering with no data (empty state)
  - Test rendering with data
  - Test integration with context
  - Test responsive layout

**Requirements Addressed**: Req 8 (visual design, UX), All (integration)

**Acceptance Criteria**:
- [ ] All sub-components integrated correctly
- [ ] Layout responsive across breakpoints
- [ ] Empty state helpful and clear
- [ ] Data flows correctly through context

---

#### Task 5.2: Create Next.js App Route Page

**Objective**: Set up Next.js page route for emergency fund calculator.

**Duration**: 1 hour

**Files to Create/Modify**:
- `/src/app/emergency-fund/page.tsx` (new)

**Functionality**:
```typescript
// Page features:
- Export metadata (title, description in Icelandic)
- Wrap EmergencyFundCalculator in CalculatorProvider
- Server component pattern
- Proper imports
```

**Tests**: N/A (Next.js page structure)

**Requirements Addressed**: NFR (accessibility - page title)

**Acceptance Criteria**:
- [ ] Page accessible at /emergency-fund route
- [ ] Metadata set correctly
- [ ] CalculatorProvider wraps component
- [ ] No console errors

---

#### Task 5.3: Add Navigation Link

**Objective**: Add link to emergency fund calculator in main navigation/tabs.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/components/layout/CalculatorTabsNav.tsx` (modify)
- Or relevant navigation component

**Functionality**:
```typescript
// Add navigation item:
- Label: "Neyðarsjóður" or "Frelsissmælir"
- Link: /emergency-fund
- Icon (if applicable)
- Active state styling
```

**Tests**: Update existing navigation tests

**Requirements Addressed**: NFR (usability)

**Acceptance Criteria**:
- [ ] Link appears in navigation
- [ ] Link works correctly
- [ ] Active state shows on page
- [ ] Mobile navigation includes link

---

#### Task 5.4: Add SEO and Social Metadata

**Objective**: Add comprehensive metadata for SEO and social sharing.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- `/src/app/emergency-fund/page.tsx` (modify)

**Functionality**:
```typescript
// Add metadata:
- title: "Neyðarsjóður Frelsissmælir | Peningana eða lífið"
- description: Icelandic description for search engines
- keywords: Relevant Icelandic keywords
- openGraph: OG tags for social sharing
- twitter: Twitter card metadata
```

**Tests**: N/A (metadata)

**Requirements Addressed**: NFR (discoverability)

**Acceptance Criteria**:
- [ ] All metadata fields populated
- [ ] Icelandic language tags set
- [ ] Social preview looks good (test with tools)
- [ ] No duplicate metadata warnings

---

### EPIC 6: Polish and Accessibility

**Objective**: Ensure accessibility compliance, polish animations, and handle edge cases.

**Duration**: 5-6 hours

**Dependencies**: Epic 5 (all UI complete)

**Deliverables**:
- Full WCAG 2.1 AA compliance
- Smooth animations
- Edge case handling
- Comprehensive testing

---

#### Task 6.1: Implement ARIA Labels and Keyboard Navigation

**Objective**: Ensure full keyboard accessibility and screen reader support.

**Duration**: 2.5 hours

**Files to Create/Modify**:
- All component files (review and enhance)

**Functionality**:
```typescript
// Audit and add:
- ARIA labels on all inputs
- aria-describedby for help text
- aria-invalid and aria-errormessage for validation
- role="status" aria-live="polite" for results
- role="progressbar" with aria-valuenow for progress bars
- Visible focus indicators
- Tab order logical
- Keyboard shortcuts work (Tab, Enter, Escape)
```

**Tests**:
- Add accessibility tests to each component test file
  - Test ARIA attributes present
  - Test keyboard navigation works
  - Use testing-library/user-event for keyboard simulation

**Requirements Addressed**: NFR (accessibility)

**Acceptance Criteria**:
- [ ] All interactive elements keyboard accessible
- [ ] All form inputs properly labeled
- [ ] Dynamic content announced to screen readers
- [ ] Focus indicators visible (min 2px outline)
- [ ] Tab order logical
- [ ] Passes axe accessibility scan

---

#### Task 6.2: Verify Color Contrast and Visual Accessibility

**Objective**: Ensure all color combinations meet WCAG AA contrast ratios.

**Duration**: 1 hour

**Files to Create/Modify**:
- Review all components with color coding

**Functionality**:
```
// Audit color combinations:
- Risk rating colors (text on background)
- Progress bar colors
- Error messages
- Links and buttons
- Ensure 4.5:1 ratio for normal text
- Ensure 3:1 ratio for large text (18pt+)
- Add patterns/icons where color is sole indicator
```

**Tests**:
- Manual testing with contrast checker tools
- Automated axe scan

**Requirements Addressed**: NFR (accessibility)

**Acceptance Criteria**:
- [ ] All text meets contrast requirements
- [ ] Color not sole indicator for risk levels (use icons/badges)
- [ ] Passes automated contrast checks
- [ ] Usable in high contrast mode

---

#### Task 6.3: Implement Number Animations

**Objective**: Add smooth transitions for number changes.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/src/components/emergencyFund/MonthsOfFreedomDisplay.tsx` (enhance)
- Other result display components

**Functionality**:
```typescript
// Add animations:
- Smooth transitions when months value changes
- Consider using react-spring or CSS transitions
- Easing functions for natural feel
- Avoid excessive animation (accessibility concern)
- Respect prefers-reduced-motion
```

**Tests**:
- Manual testing of transitions
- Test with prefers-reduced-motion enabled

**Requirements Addressed**: Req 8 (visual design)

**Acceptance Criteria**:
- [ ] Numbers transition smoothly (not jarring)
- [ ] Animation duration appropriate (~300ms)
- [ ] Respects prefers-reduced-motion
- [ ] Doesn't interfere with screen readers
- [ ] Performance impact minimal

---

#### Task 6.4: Edge Case Handling and Error States

**Objective**: Handle all edge cases gracefully with clear messaging.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- All components (review)
- Add error boundaries if needed

**Functionality**:
```typescript
// Handle edge cases:
- Zero balance, zero expenses
- Extremely large numbers (>1B ISK)
- Extremely small numbers (< 1 kr)
- Missing AWH data (already handled, verify)
- LocalStorage failure
- Calculation errors (try-catch)
- Invalid imported data
- Browser without JavaScript (graceful degradation message)
```

**Tests**:
- Add edge case tests to existing test files
  - Test with boundary values
  - Test with invalid data
  - Test error recovery

**Requirements Addressed**: NFR (reliability)

**Acceptance Criteria**:
- [ ] All edge cases handled without crashes
- [ ] Clear error messages in Icelandic
- [ ] User can recover from errors
- [ ] Validation prevents most edge cases
- [ ] No undefined/NaN displayed to user

---

### EPIC 7: Testing and Documentation

**Objective**: Comprehensive testing across all levels and create developer documentation.

**Duration**: 4-5 hours

**Dependencies**: Epic 6 (all implementation complete)

**Deliverables**:
- Full test coverage
- Integration tests
- Manual test plan
- Code documentation

---

#### Task 7.1: Complete Unit Test Coverage

**Objective**: Ensure all functions and components have comprehensive unit tests.

**Duration**: 2 hours

**Files to Create/Modify**:
- Review all test files created in previous tasks
- Add missing test cases

**Functionality**:
```typescript
// Ensure tests cover:
- All calculation functions (100% coverage)
- All component rendering scenarios
- All user interactions
- All validation rules
- All edge cases
- Success and error paths
```

**Tests**: Review coverage report, add missing tests

**Requirements Addressed**: All (quality assurance)

**Acceptance Criteria**:
- [ ] Test coverage ≥ 90% for calculation logic
- [ ] Test coverage ≥ 80% for components
- [ ] All critical paths tested
- [ ] All tests pass
- [ ] No console errors/warnings during tests

---

#### Task 7.2: Create Integration Tests

**Objective**: Test complete user flows end-to-end within React Testing Library.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/tests/integration/emergencyFund.integration.test.tsx` (new)

**Functionality**:
```typescript
// Integration test scenarios:
1. Complete calculation flow (input → results → targets)
2. AWH integration (set AWH, see life energy update)
3. LocalStorage persistence (enter data, reload, verify)
4. Export/import (export data, import, verify)
5. Preset selection (click preset, verify expense update)
```

**Tests**: Integration test file

**Requirements Addressed**: All (end-to-end validation)

**Acceptance Criteria**:
- [ ] All user flows tested
- [ ] Tests use CalculatorProvider wrapper
- [ ] LocalStorage mocked appropriately
- [ ] All assertions pass

---

#### Task 7.3: Manual Testing Plan and Execution

**Objective**: Create and execute manual test plan for scenarios not covered by automated tests.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- `/docs/testing/emergency-fund-manual-tests.md` (new, optional)

**Functionality**:
```
// Manual test scenarios:
1. Responsive layout (mobile/tablet/desktop)
2. Browser compatibility (Chrome, Firefox, Safari, Edge)
3. Screen reader testing (VoiceOver, NVDA)
4. Keyboard-only navigation
5. High contrast mode
6. Large text mode (200% zoom)
7. Touch interactions on mobile
8. Performance (Lighthouse audit)
```

**Tests**: Manual execution and documentation

**Requirements Addressed**: NFR (accessibility, usability, performance)

**Acceptance Criteria**:
- [ ] Responsive layout works on all breakpoints
- [ ] Works in last 2 versions of major browsers
- [ ] Keyboard navigation fully functional
- [ ] Screen reader announces all important content
- [ ] Lighthouse score ≥ 90 for accessibility
- [ ] Page load time < 2s on 3G

---

### EPIC 8: Final Review and Deployment Prep

**Objective**: Final code review, performance optimization, and deployment readiness.

**Duration**: 2-3 hours

**Dependencies**: Epic 7 (all testing complete)

**Deliverables**:
- Code review completed
- Performance optimized
- Documentation complete
- Ready for production

---

#### Task 8.1: Code Review and Cleanup

**Objective**: Review all code for quality, consistency, and best practices.

**Duration**: 1.5 hours

**Files to Create/Modify**:
- All files (review)

**Functionality**:
```
// Review checklist:
- Consistent naming conventions
- No console.logs (except intentional errors)
- No commented-out code
- TypeScript types complete (no 'any')
- Imports organized
- Components properly memoized where appropriate
- Error handling comprehensive
- Comments where needed (not excessive)
```

**Tests**: Lint check passes

**Requirements Addressed**: NFR (maintainability)

**Acceptance Criteria**:
- [ ] ESLint passes with no warnings
- [ ] TypeScript compiles with no errors
- [ ] Prettier formatting applied
- [ ] No TODOs or FIXMEs remaining
- [ ] Code follows established patterns

---

#### Task 8.2: Performance Optimization

**Objective**: Ensure optimal performance for calculations and rendering.

**Duration**: 1 hour

**Files to Create/Modify**:
- Review components for optimization opportunities

**Functionality**:
```typescript
// Optimization checks:
- useMemo for expensive calculations (verify)
- useCallback for function props (verify)
- React.memo for components that re-render unnecessarily
- Debounce applied to inputs (verify)
- No unnecessary context re-renders
- Bundle size analyzed (if needed)
```

**Tests**:
- Performance testing (Lighthouse)
- Bundle size analysis

**Requirements Addressed**: NFR (performance)

**Acceptance Criteria**:
- [ ] Calculations complete in < 100ms
- [ ] Input response time < 50ms (debounced)
- [ ] Lighthouse performance score ≥ 90
- [ ] No unnecessary re-renders (React DevTools profiler)
- [ ] Bundle size reasonable (no significant increase)

---

#### Task 8.3: Create Component Documentation

**Objective**: Document component API and usage for future developers.

**Duration**: 0.5 hours

**Files to Create/Modify**:
- Add JSDoc comments to component files (if not already present)

**Functionality**:
```typescript
// Document:
- Component purpose and usage
- Props with types and descriptions
- Example usage (if complex)
- Integration points (CalculatorContext)
```

**Tests**: N/A (documentation)

**Requirements Addressed**: NFR (maintainability)

**Acceptance Criteria**:
- [ ] All exported components documented
- [ ] Props documented with JSDoc
- [ ] Integration points clear
- [ ] Examples provided for complex components

---

## 3. Testing Summary by Epic

| Epic | Unit Tests | Integration Tests | Manual Tests |
|------|-----------|------------------|--------------|
| Epic 1 | Calculations (100% coverage) | N/A | N/A |
| Epic 2 | Context state updates | Export/import flow | LocalStorage persistence |
| Epic 3 | All UI components | Input → Results flow | Responsive layout |
| Epic 4 | Progress tracker, Education | N/A | Collapsible interaction |
| Epic 5 | Page composition | Full user flow | Navigation, routing |
| Epic 6 | Accessibility utilities | Keyboard navigation | Screen reader, contrast |
| Epic 7 | Coverage review | All critical flows | Browser compatibility |
| Epic 8 | N/A | N/A | Performance audit |

---

## 4. Implementation Timeline

### Estimated Duration

**Total**: 38-45 hours (approximately 1-2 weeks for one developer)

### Milestone Schedule

**Week 1**:
- Day 1-2: Epic 1 (Foundation)
- Day 3: Epic 2 (State Management)
- Day 4-5: Epic 3 (Core UI)

**Week 2**:
- Day 1-2: Epic 4 (Enhanced UI)
- Day 3: Epic 5 (Main Page)
- Day 4: Epic 6 (Polish)
- Day 5: Epic 7-8 (Testing & Review)

### Parallelization Opportunities

**After Epic 1 is complete**:
- Epic 2 (State) and Epic 3.1-3.2 (Input components) can be worked on in parallel
- Epic 3.3-3.4 (Result components) depend on Epic 2
- Epic 4 tasks can be parallelized after Epic 3 is complete
- Epic 6 (Accessibility) can start as soon as components exist

---

## 5. Risk Management

### High-Risk Tasks

**Task 2.1 (CalculatorContext Extension)**:
- **Risk**: Breaking existing calculator functionality
- **Mitigation**:
  - Test existing calculators after changes
  - Use TypeScript to catch breaking changes
  - Add integration tests
  - Make changes additive (no modifications to existing state)

**Task 6.1 (Accessibility)**:
- **Risk**: Missing accessibility requirements
- **Mitigation**:
  - Use automated tools (axe, Lighthouse)
  - Follow existing patterns from app
  - Test with real screen readers
  - Allocate sufficient time (2.5 hours)

### Dependencies to Monitor

**Actual Hourly Wage Calculator**:
- Life energy calculation depends on AWH being calculated
- Already designed for graceful degradation
- Can implement and test without AWH (mock data)

**Design Changes**:
- UI design may evolve during implementation
- Keep calculations decoupled from UI
- Use component composition for flexibility

---

## 6. Definition of Done

### Feature Complete When:

- [ ] All 8 epics completed
- [ ] All tasks marked complete
- [ ] All acceptance criteria met
- [ ] All tests passing (unit, integration)
- [ ] Manual test plan executed and passed
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Code review completed
- [ ] Performance benchmarks met
- [ ] No critical or high-priority bugs
- [ ] Documentation complete
- [ ] Deployed to staging and verified
- [ ] Stakeholder approval obtained

### Quality Gates:

**Code Quality**:
- ESLint: 0 errors, 0 warnings
- TypeScript: 0 errors
- Test coverage: ≥90% calculations, ≥80% components

**Performance**:
- Calculation time: <100ms
- Page load: <2s on 3G
- Lighthouse score: ≥90

**Accessibility**:
- WCAG 2.1 AA: All criteria met
- Axe scan: 0 violations
- Keyboard navigation: Fully functional
- Screen reader: All content announced

**User Experience**:
- All input validation working
- All error states handled
- Responsive on mobile/tablet/desktop
- Icelandic language throughout

---

## 7. Traceability Matrix

### Requirements to Tasks Mapping

| Requirement | Tasks |
|-------------|-------|
| Req 1: Input Collection | 1.1, 1.2, 3.1, 3.2 |
| Req 2: Months of Freedom | 1.2, 3.3 |
| Req 3: Life Energy Hours | 1.2, 2.1, 3.4 |
| Req 4: Risk Rating | 1.2, 3.4 |
| Req 5: Target Progress | 1.2, 4.1, 4.2 |
| Req 6: Icelandic Context | 1.3, 1.4, 3.2 |
| Req 7: Data Persistence | 2.2, 2.3 |
| Req 8: Visual Design | 3.3, 3.4, 4.1, 4.2, 5.1 |
| Req 9: Educational Content | 4.3 |
| Req 10: Calculator Integration | 2.1, 2.3 |

### Non-Functional Requirements to Tasks

| NFR | Tasks |
|-----|-------|
| Performance | 1.2, 6.3, 8.2 |
| Security | 2.2 (localStorage only) |
| Usability | 1.3, 3.1, 3.2, 4.3, 5.3 |
| Reliability | 2.2, 6.4 |
| Accessibility | 3.1, 6.1, 6.2, 7.3 |
| Localization | 1.3, 1.4 (all components) |

---

## 8. Post-Implementation Tasks

### After Feature Launch:

1. **User Feedback Collection**:
   - Monitor usage patterns
   - Gather user feedback on expense examples
   - Identify usability issues

2. **Performance Monitoring**:
   - Track page load times
   - Monitor calculation performance
   - Check localStorage usage

3. **Content Updates**:
   - Review Icelandic expense examples quarterly
   - Update educational content based on user questions
   - Adjust risk rating thresholds if needed

4. **Future Enhancements** (Phase 2):
   - Historical tracking
   - Scenario planning
   - Auto-populate from other calculators
   - Custom targets

---

## 9. Task Checklist

### Epic 1: Foundation
- [ ] Task 1.1: Create Type Definitions
- [ ] Task 1.2: Implement Core Calculation Functions
- [ ] Task 1.3: Create Formatting Utilities
- [ ] Task 1.4: Define Icelandic Expense Examples Constants

### Epic 2: State Management
- [ ] Task 2.1: Extend CalculatorContext with Emergency Fund State
- [ ] Task 2.2: Implement LocalStorage Persistence
- [ ] Task 2.3: Add Export/Import Support

### Epic 3: Core UI
- [ ] Task 3.1: Create EmergencyFundInputs Component
- [ ] Task 3.2: Create ExpenseExamplesSelector Component
- [ ] Task 3.3: Create MonthsOfFreedomDisplay Component
- [ ] Task 3.4: Create EmergencyFundResults Component

### Epic 4: Enhanced UI
- [ ] Task 4.1: Create TargetMilestone Component
- [ ] Task 4.2: Create TargetProgressTracker Component
- [ ] Task 4.3: Create EducationalPanel Component

### Epic 5: Main Page
- [ ] Task 5.1: Create EmergencyFundCalculator Page Component
- [ ] Task 5.2: Create Next.js App Route Page
- [ ] Task 5.3: Add Navigation Link
- [ ] Task 5.4: Add SEO and Social Metadata

### Epic 6: Polish
- [ ] Task 6.1: Implement ARIA Labels and Keyboard Navigation
- [ ] Task 6.2: Verify Color Contrast and Visual Accessibility
- [ ] Task 6.3: Implement Number Animations
- [ ] Task 6.4: Edge Case Handling and Error States

### Epic 7: Testing
- [ ] Task 7.1: Complete Unit Test Coverage
- [ ] Task 7.2: Create Integration Tests
- [ ] Task 7.3: Manual Testing Plan and Execution

### Epic 8: Final Review
- [ ] Task 8.1: Code Review and Cleanup
- [ ] Task 8.2: Performance Optimization
- [ ] Task 8.3: Create Component Documentation

---

**Tasks Phase Complete: Ready for Implementation**
