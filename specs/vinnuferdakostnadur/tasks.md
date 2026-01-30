# Implementation Tasks: Vinnuferðakostnaður (Commute Cost Calculator)

## Overview

This document breaks down the implementation of the Vinnuferðakostnaður (Commute Cost Calculator) feature into actionable tasks. The feature enables users to calculate the true cost of their commute - not just fuel costs, but also time, indirect car costs, and impact on financial independence (FI).

**Key Features:**
- Support for 5 commute methods: Car, Public Transit, Bike, Walk, Remote
- Comprehensive cost calculations (direct + indirect for cars)
- Life energy calculations (time + money as hours of life)
- Future value (FI impact) projections at 7% return
- Comparison of up to 4 different commute scenarios
- Preset scenarios for common Icelandic commute routes
- Integration with actualHourlyWage from main calculator
- localStorage persistence

**Requirements Coverage:**
- NS-1: Enter commute information
- NS-2: See real monetary cost
- NS-3: See life energy cost
- NS-4: See FI impact
- NS-5: Compare commute options
- NS-6: Quick presets for common routes

**Total Tasks:** 24 tasks across 6 major components

## Implementation Strategy

**Chosen Strategy:** Hybrid (Foundation + Feature Slice)

**Rationale:** This feature builds on existing infrastructure (CalculatorContext, UI components) but introduces new domain logic (commute calculations). The hybrid approach allows us to:

1. **Start with Foundation** (Tasks 1-2): Create types and calculations first to ensure correctness
2. **Build Core Feature** (Tasks 3-5): Implement validation, context extensions, and localStorage
3. **Build UI Components** (Tasks 6-7): Form and summary components for single scenario
4. **Add Comparison** (Task 8): Multi-scenario comparison UI
5. **Add Convenience** (Task 9): Preset selector for quick setup
6. **Integration** (Task 10): Wire everything together in main container
7. **Testing** (Tasks 11-12): Comprehensive unit and component tests

**Sequencing Logic:**
- Bottom-up: Pure functions (types, calculations) before components
- Dependencies respected: Forms need validation, summary needs calculations
- Early value: Single scenario works before comparison
- Testing integrated: Unit tests after calculations, component tests after UI

**Parallel Opportunities:**
- Tasks 6 and 7 can be done in parallel (both depend on 1-5 but not each other)
- Task 9 can be done in parallel with task 8
- Testing tasks can be distributed across developers

## Task List

### Epic 1: Foundation - Types and Data Models

- [x] 1.1 Create TypeScript types and interfaces ✅ Completed 2026-01-20
  - Implemented: All commute-related TypeScript types in `src/types/calculator.ts`
  - Implemented: `CommuteScenario`, `CommuteInputs`, `CommuteResults`, `CommuteCostBreakdownItem`
  - Implemented: `CarCommuteDetails`, `TransitCommuteDetails`, `ActiveCommuteDetails`
  - Implemented: `CommuteMethod` type union and `COMMUTE_METHOD_LABELS` constant
  - Implemented: `CommutePreset` type for preset scenarios
  - Implemented: Extended `StoredState` to include `commuteScenarios: CommuteScenario[]`
  - Note: CalculatorContextType extension deferred to Task 3.2
  - Tests: TypeScript compilation passes, no errors
  - Context: context/modules/CommuteTypes.md
  - Requirements: NS-1, NS-2, NS-3, NS-4, NS-5, NS-6
  - Actual time: 2 hours

### Epic 2: Calculation Logic

- [x] 2.1 Implement core calculation functions ✅ Completed 2026-01-20
  - Implemented: `src/lib/calculations/commute.ts` with all calculation functions
  - Implemented: `calculateCommuteResults(inputs, actualHourlyWage)` main function
  - Implemented: Helper functions:
    - `calculateCarCosts()` - fuel/electric, parking, tolls, depreciation, insurance, maintenance, inspection
    - `calculateTransitCosts()` - monthly pass or per-ride calculations
    - `calculateActiveCosts()` - bike/walk maintenance
    - `calculateTimeCosts()` - time per month/year in minutes/hours/days
    - `calculateLifeEnergyCosts()` - time + money as life energy hours
    - Reused: `calculateFutureValue()` from subscriptions for 5, 10, 20 year projections
    - Implemented: Cost breakdown creation with percentages
  - Implemented: `generateCommuteId()` for unique scenario IDs
  - Implemented: Edge case handling (division by zero, remote work all zeros)
  - Tests: tests/lib/calculations/commute.test.ts (19 tests, all passing)
  - Context: context/modules/CommuteCalculations.md
  - Requirements: NS-2, NS-3, NS-4
  - Actual time: 3 hours

- [x] 2.2 Create preset scenarios data ✅ Completed 2026-01-20
  - Implemented: `COMMUTE_PRESETS` constant array (11 presets)
  - Implemented: Car presets (6): Kópavogur, Hafnarfjörður, Garðabær (electric), Mosfellsbær, Akranes, Selfoss (diesel)
  - Implemented: Transit presets (2): Strætó monthly (10,500 kr), Strætó per-ride (550 kr)
  - Implemented: Active presets (2): Bike short (<5km), Bike medium (5-10km)
  - Implemented: Remote preset (1): 100% remote work
  - Implemented: Realistic defaults: Fuel prices (350/340/30 kr), consumption (8/7/20)
  - Implemented: Default car costs (depreciation: 35,000 kr, insurance: 15,000 kr, maintenance: 10,000 kr, inspection: 12,000 kr/2yr)
  - Tests: Preset validation in commute.test.ts
  - Context: context/modules/CommuteCalculations.md
  - Requirements: NS-6
  - Actual time: 1 hour

### Epic 3: Validation and Business Logic

- [x] 3.1 Implement input validation functions ✅ Completed 2026-01-20
  - Implemented: `src/lib/validation/commute.ts` with validation functions
  - Implemented: `validateCommuteInputs(inputs)` with comprehensive validation
  - Implemented: Basic field validation (distanceKm: 0-200, daysPerWeek: 1-7, timeMinutesOneWay: 0-300)
  - Implemented: Conditional validation based on commuteMethod
  - Implemented: All error messages in Icelandic
  - Implemented: `validateScenarioName()` function (1-50 characters)
  - Tests: tests/lib/validation/commute.test.ts (22 tests, all passing)
  - Context: context/modules/CommuteValidation.md
  - Requirements: NS-1
  - Actual time: 2 hours

- [x] 3.2 Extend CalculatorContext for commute scenarios ✅ Completed 2026-01-20
  - Implemented: `commuteScenarios: CommuteScenario[]` state in CalculatorContext
  - Implemented: `addCommuteScenario(scenario)` - validates max 4, generates ID, calculates results
  - Implemented: `updateCommuteScenario(id, updates)` - recalculates results on update
  - Implemented: `deleteCommuteScenario(id)` - removes scenario
  - Implemented: `duplicateCommuteScenario(id)` - creates copy with new ID
  - Implemented: Auto-recalculation when actualHourlyWage changes
  - Implemented: Error messages in Icelandic
  - Context: context/modules/CalculatorContext.md (updated)
  - Requirements: NS-1, NS-5
  - Actual time: 2 hours

- [x] 3.3 Implement localStorage persistence for commute scenarios ✅ Completed 2026-01-20
  - Implemented: Extended localStorage save/load to include `commuteScenarios`
  - Implemented: 500ms debounce auto-save (integrated with existing pattern)
  - Implemented: Load commute scenarios on mount with backwards compatibility
  - Implemented: Export/Import includes commute scenarios
  - Implemented: resetAll() clears commute scenarios
  - Implemented: Uses existing `safeSetItem` and `safeGetItem` for error handling
  - Requirements: NS-1.7
  - Actual time: <1 hour (integrated with 3.2)

### Epic 4: Form Components

- [x] 4.1 Create CommuteForm component ✅ Completed 2026-01-20
  - Implemented: src/components/commute/CommuteForm.tsx (558 lines)
  - Implemented: Dynamic form with conditional fields based on commuteMethod
  - Implemented: Basic fields (always shown): name, distanceKm, daysPerWeek, commuteMethod, timeMinutesOneWay
  - Implemented: Conditional fields:
    - Car: fuelType, fuelPrice, fuelConsumption, parkingCostPerDay, tollsPerDay, monthlyDepreciation, monthlyInsurance, monthlyMaintenance, inspectionCost
    - Transit: ticketType, monthlyCost/costPerRide
    - Bike/Walk: monthlyMaintenanceCost
    - Remote: informational message (no extra fields)
  - Implemented: CommutePresetSelector integration at top of form (add mode only)
  - Implemented: Real-time validation with Icelandic error messages
  - Implemented: Dual mode support (add/edit)
  - Implemented: Props: `mode: 'add' | 'edit'`, `scenario?: CommuteScenario`, `onSave`, `onCancel`
  - Tests: tests/components/commute/CommuteForm.test.tsx (36 tests, all passing)
  - Context: context/modules/CommuteFormComponent.md
  - Requirements: NS-1, NS-6
  - Actual time: 3 hours

- [x] 4.2 Create CommutePresetSelector component ✅ Completed 2026-01-20
  - Implemented: src/components/commute/CommutePresetSelector.tsx (115 lines)
  - Implemented: Dropdown/select for preset scenarios
  - Implemented: Group presets by category with emoji headers (🚗 Bíll, 🚌 Strætó, 🚴 Hjól/Ganga, 🏠 Fjarvinnu)
  - Implemented: 11 preset scenarios for common Icelandic routes
  - Implemented: onSelect callback to populate parent form
  - Implemented: Auto-reset after selection for repeated use
  - Implemented: Props: `onSelect: (preset: CommutePreset) => void`
  - Tests: tests/components/commute/CommutePresetSelector.test.tsx (13 tests, all passing)
  - Context: context/modules/CommutePresetSelector.md
  - Requirements: NS-6
  - Actual time: 1 hour

- [x] Barrel export created ✅
  - File: src/components/commute/index.ts
  - Exports: CommuteForm, CommuteFormProps, CommutePresetSelector, CommutePresetSelectorProps

### Epic 5: Display Components

- [x] 5.1 Create CommuteSummary component ✅ Completed 2026-01-20
  - Implemented: src/components/commute/CommuteSummary.tsx (285 lines)
  - Implemented: Comprehensive results display with cost, time, life energy, and FI impact sections
  - Implemented: Cost breakdown with percentages for car scenarios (fuel, parking, tolls, depreciation, insurance, maintenance, inspection)
  - Implemented: Color-coded sections (primary for costs, warning for time/life energy, success for FI impact)
  - Implemented: Conditional rendering (indirect costs for cars only, life energy when actualHourlyWage > 0)
  - Implemented: Warning alert when actualHourlyWage === 0
  - Implemented: Impactful message when life energy > 40 hours/month
  - Implemented: Car cost warning about indirect expenses
  - Tests: tests/components/commute/CommuteSummary.test.tsx (21 tests, all passing)
  - Context: context/modules/CommuteSummary.md
  - Requirements: NS-2, NS-3, NS-4
  - All text in Icelandic
  - Actual time: 3 hours

- [x] 5.2 Create CommuteComparison component ✅ Completed 2026-01-20
  - Implemented: src/components/commute/CommuteComparison.tsx (331 lines)
  - Implemented: Side-by-side comparison of 2-4 scenarios with automatic best/worst identification
  - Implemented: Desktop table view (≥1024px) with columns: Name, Method (icon), Monthly Cost, Time/month, Life Energy/month, FV (10 yr), Difference
  - Implemented: Mobile card view (<1024px) with stacked scenario cards
  - Implemented: Method icons (🚗 🚌 🚴 🚶 🏠)
  - Implemented: Color-coded badges (green for best, red for worst)
  - Implemented: Savings message: "Með því að skipta úr [worst] yfir í [best] sparar þú X kr og Y klst á mánuði"
  - Implemented: Empty state for < 2 scenarios
  - Implemented: Conditional life energy column (hidden when actualHourlyWage === 0)
  - Tests: tests/components/commute/CommuteComparison.test.tsx (27 tests, all passing)
  - Context: context/modules/CommuteComparison.md
  - Requirements: NS-5
  - Responsive design with mobile-first approach
  - All text in Icelandic
  - Actual time: 3 hours

### Epic 6: Integration and Main Container

- [x] 6.1 Create CommuteCalculator main container component ✅ Completed 2026-01-20
  - Implemented: `src/components/commute/CommuteCalculator.tsx` (540 lines)
  - Implemented: Main container that orchestrates all child components
  - Implemented: Accordion pattern for scenario list (following SubscriptionBurnMeter pattern)
  - Implemented: Features:
    - Expandable/collapsible scenario list with visual indicators
    - "Bæta við atburðarás" button (disabled when 4 scenarios exist)
    - Delete scenario with inline confirmation dialog
    - Duplicate scenario action (disabled at 4 scenarios)
    - Toggle between "Atburðarásir" and "Samanburður" views with tabs
    - Alert if actualHourlyWage === 0 with link to main calculator
    - Info alert when max scenarios reached
  - Implemented: CalculatorContext integration via `useCalculator()` hook
  - Implemented: Accordion items show CommuteForm (editing) or CommuteSummary (expanded)
  - Implemented: Local state management for view mode, form, expanded scenarios, deletion confirmation
  - Implemented: Error handling with user-friendly alerts
  - Implemented: Empty states for no scenarios and comparison with < 2 scenarios
  - Implemented: All UI text in Icelandic
  - Updated: `src/components/commute/index.ts` barrel export
  - Tests: Manual testing required (component rendering, CRUD operations, view toggle)
  - Context: context/modules/CommuteCalculator.md
  - Requirements: NS-1, NS-5
  - Actual time: 2 hours

- [x] 6.2 Add commute calculator to main app navigation/routing ✅ Completed 2026-01-20
  - Implemented: Updated `src/components/calculator/CalculatorPageContent.tsx`
  - Implemented: Added CommuteCalculator import
  - Implemented: Changed EXPENSE_CALCULATORS 'vinnuferdir' from `available: false` to `available: true`
  - Implemented: Added CommuteCalculatorContent component with back button
  - Implemented: Integrated CommuteCalculatorContent into ExpenseImpactContent routing
  - Implemented: Follows exact pattern as SubscriptionCalculatorContent and MealCostCalculatorContent
  - Implemented: Hero section with title, description, and back button
  - Implemented: CommuteCalculator wrapped in Section/Container layout
  - Tests: Manual testing required (navigation, calculator loads correctly)
  - Requirements: All NS requirements (integration)
  - Actual time: 30 minutes

### Epic 7: Testing

- [ ] 7.1 Write unit tests for calculations and validation
  - Create `/lib/calculations/__tests__/commute.test.ts`
  - Test coverage target: 100% for calculation functions
  - Test suites:
    - `calculateCarCosts()` - gasoline, diesel, electric, indirect costs, parking, tolls
    - `calculateTransitCosts()` - monthly pass, per-ride
    - `calculateActiveCosts()` - bike, walk
    - `calculateTimeCosts()` - minutes to hours/days conversion
    - `calculateLifeEnergyCosts()` - time + money, division by zero handling
    - `calculateFutureValue()` - 5, 10, 20 year projections
    - `createCostBreakdown()` - percentages and labels
  - Create `/lib/validation/__tests__/commute.test.ts`
  - Test all validation rules: distance, days, time, conditional fields, error messages
  - Run tests: `npm test commute.test.ts`
  - Requirements: NS-2, NS-3, NS-4 (calculation correctness)
  - Estimated time: 3-4 hours

- [ ] 7.2 Write component tests
  - Create component test files in `/components/commute/__tests__/`
  - Test CommuteForm:
    - Rendering basic and conditional fields
    - Preset selection and auto-fill
    - Validation and error display
    - Form submission (onSave, onCancel)
  - Test CommuteSummary:
    - Cost display (direct, indirect, breakdown)
    - Time display with Icelandic formatting
    - Life energy display and conditional rendering
    - FI impact display
  - Test CommuteComparison:
    - Comparison table with 2-4 scenarios
    - Best/worst identification and color coding
    - Savings calculation
    - Responsive layout (desktop vs mobile)
    - Empty state
  - Test CommuteCalculator:
    - Scenario CRUD operations
    - Max 4 scenarios enforcement
    - View toggle (scenarios/comparison)
    - actualHourlyWage warning
  - Coverage target: 80%+
  - Run tests: `npm test -- --coverage`
  - Requirements: All NS requirements (UI correctness)
  - Estimated time: 4-5 hours

- [ ] 7.3 Manual testing and accessibility audit
  - Manual test all user flows:
    - Create first scenario (with and without preset)
    - Edit existing scenario
    - Delete scenario (with confirmation)
    - Compare 2-4 scenarios
    - All commute methods (car, transit, bike, walk, remote)
  - Test responsive design on Desktop (1440px), Tablet (768px), Mobile (375px)
  - Test browser compatibility: Chrome, Firefox, Safari, Edge (latest 2 versions)
  - Accessibility audit:
    - Run axe DevTools for automated checks
    - Keyboard-only navigation test (Tab, Enter, Escape)
    - Screen reader test with VoiceOver (macOS) or NVDA (Windows)
    - Color contrast verification (all text ≥4.5:1)
    - Focus indicators visible
    - Error messages accessible (aria-describedby, role="alert")
  - Test Icelandic content: currency formatting (50.000 kr), all labels/messages
  - Test edge cases: 0km distance, 200km distance, actualHourlyWage=0, localStorage full
  - Document any bugs found
  - Requirements: Non-functional requirements (accessibility, performance, UX)
  - Estimated time: 2-3 hours

- [ ] 7.4 Performance testing
  - Test calculation performance: ensure < 50ms for all calculations
  - Test rendering performance: ensure < 100ms for scenario switching
  - Test with 4 scenarios loaded: ensure no lag or jank
  - Test localStorage operations: ensure debounce working (500ms)
  - Test on older devices (if available): 5-year-old laptop, mobile device
  - Use Chrome DevTools Performance tab for profiling
  - Document any performance issues
  - Requirements: Performance requirements
  - Estimated time: 1-2 hours

## Dependencies

### Task Dependencies

**Sequential Dependencies:**
- Task 2.1 depends on 1.1 (calculations need types)
- Task 2.2 depends on 1.1 (presets need types)
- Task 3.1 depends on 1.1 (validation needs types)
- Task 3.2 depends on 1.1, 2.1, 3.1 (context needs types, calculations, validation)
- Task 3.3 depends on 1.1, 3.2 (persistence needs types and context)
- Task 4.1 depends on 1.1, 3.1, 4.2 (form needs types, validation, preset selector)
- Task 4.2 depends on 1.1, 2.2 (preset selector needs types and preset data)
- Task 5.1 depends on 1.1, 2.1 (summary needs types and calculations)
- Task 5.2 depends on 1.1, 2.1 (comparison needs types and calculations)
- Task 6.1 depends on 3.2, 4.1, 5.1, 5.2 (container needs all child components)
- Task 6.2 depends on 6.1 (routing needs main container)
- Task 7.1 depends on 2.1, 3.1 (tests need implementation)
- Task 7.2 depends on 4.1, 4.2, 5.1, 5.2, 6.1 (component tests need components)
- Task 7.3 depends on 6.2 (manual testing needs full integration)
- Task 7.4 depends on 6.2 (performance testing needs full integration)

**Parallel Opportunities:**
- Tasks 2.1 and 2.2 can be done in parallel (both depend only on 1.1)
- Tasks 4.1 and 5.1 can be done in parallel after 1.1, 2.1, 3.1 are complete
- Tasks 4.1 and 5.2 can be done in parallel after 1.1, 2.1, 3.1 are complete
- Tasks 5.1 and 5.2 can be done in parallel (both depend on 1.1, 2.1)
- Tasks 7.1 and 7.2 can be done in parallel (different test types)
- Tasks 7.3 and 7.4 can be done in parallel (both integration-level tests)

**Critical Path:**
1.1 → 2.1 → 3.1 → 3.2 → 4.1 → 6.1 → 6.2 → 7.3

This represents the minimum sequence needed to get a working feature. Other tasks can happen in parallel with this path.

## Notes

### Implementation Guidelines

**Code Organization:**
- All new types go in existing `/types/calculator.ts` (extend existing file)
- Calculations in new `/lib/calculations/commute.ts`
- Validation in new `/lib/validation/commute.ts`
- Components in new `/components/commute/` directory
- Tests alongside implementation files in `__tests__/` subdirectories

**Reusable Code:**
This feature reuses significant infrastructure from the existing app:
- `CalculatorContext` for state management (extend, don't replace)
- `formatCurrency()`, `formatNumber()`, `formatLifeEnergy()` utilities
- `calculateFutureValue()` function (already exists for subscriptions)
- UI components: `Card`, `Input`, `Select`, `Button`, `Alert`, `Dialog`
- localStorage patterns from existing features

**Icelandic Content:**
All user-facing text must be in Icelandic:
- Form labels and placeholders
- Error messages
- Button text
- Section headings
- Help text and tooltips
- Currency format: "50.000 kr" (period as thousands separator, space before kr)

**Accessibility Requirements:**
- All inputs must have associated `<label>` elements
- Error messages must use `aria-describedby` and `role="alert"`
- Buttons must be keyboard-accessible (Tab, Enter, Space)
- Focus indicators must be visible
- Color contrast ≥4.5:1 for all text
- Screen reader tested with VoiceOver or NVDA

**Testing Strategy:**
- Write unit tests as you implement calculations (Task 7.1 can happen alongside 2.1)
- Write component tests as you build components (Task 7.2 can happen alongside 4.x, 5.x)
- Manual testing and accessibility audit should happen last (Tasks 7.3, 7.4)
- Aim for 85%+ overall code coverage

### Worktree Consideration

**Not Recommended** for this feature.

This is a moderate-sized feature that integrates tightly with existing infrastructure (CalculatorContext, UI components, utilities). Working in the main branch allows for:
- Easier integration with CalculatorContext
- Immediate access to existing UI components and utilities
- Simpler testing against actual app environment
- No complexity of syncing changes between branches

A worktree would be more appropriate for:
- Larger features requiring significant infrastructure changes
- Features that might destabilize the main app during development
- Parallel development by multiple team members
- Experimental features with uncertain implementation

For this feature, standard branch workflow is sufficient.

### Common Pitfalls to Avoid

1. **Don't duplicate formatting functions**: Reuse existing `formatCurrency()` etc.
2. **Don't hardcode colors**: Use Tailwind color system for consistency
3. **Don't skip validation**: Every input must be validated before calculation
4. **Don't forget edge cases**: Handle division by zero, missing actualHourlyWage, etc.
5. **Don't skip accessibility**: ARIA labels and keyboard navigation are required, not optional
6. **Don't use English text**: All user-facing text must be Icelandic
7. **Don't exceed 4 scenarios**: Enforce limit in both validation and UI

### Development Tips

**Start Simple:**
- Get a basic car scenario working end-to-end before adding all commute methods
- Test calculations manually with known values before writing tests
- Build UI incrementally: form first, then summary, then comparison

**Debugging:**
- Use browser DevTools React extension to inspect CalculatorContext state
- Add console.log in calculations during development (remove before commit)
- Test localStorage with DevTools Application tab

**Performance:**
- Calculations should be fast enough without memoization
- Use React.memo() only if profiling shows re-render issues
- The 500ms debounce on auto-save prevents localStorage thrashing

### Reference Files

**Design patterns to follow:**
- Look at Subscription Burn Meter for accordion pattern examples
- Check existing validation functions for error message patterns
- Review CalculatorContext for state management patterns

**Key design decisions:**
- See `design.md` section "Hönnunarákvarðanir" for architectural decisions
- Maximum 4 scenarios (explained in design doc)
- Hybrid implementation strategy (foundation first, then features)

### Success Criteria

The feature is complete when:
- All 18 implementation tasks (1.1 - 6.2) are done
- All 4 testing tasks (7.1 - 7.4) pass
- User can create, edit, delete, and compare commute scenarios
- All calculations are accurate (verified by unit tests)
- UI is responsive on desktop, tablet, and mobile
- Accessibility audit passes (WCAG 2.1 AA)
- All user-facing text is in Icelandic
- localStorage persistence works correctly
- Integration with CalculatorContext is seamless

**Ready for production when:**
- Code review completed
- All tests passing
- Manual testing completed on all target browsers
- Accessibility verified with screen reader
- Performance meets requirements (<50ms calculations, <100ms renders)
- Documentation updated (if applicable)
