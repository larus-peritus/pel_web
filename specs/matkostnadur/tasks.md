# Implementation Tasks: Matkostnaðarmælir (Meal Cost Calculator)

## Document Information

- **Feature Name**: Matkostnaðarmælir (Meal Cost Calculator)
- **Version**: 1.0
- **Date**: 2026-01-20
- **Author**: Implementation Tasks Agent
- **Related Documents**:
  - Requirements: [specs/matkostnadur/requirements.md](requirements.md)
  - Design: [specs/matkostnadur/design.md](design.md)

## Overview

Matkostnaðarmælir is a client-side calculator that helps users understand the true cost of their eating habits by comparing eating out vs. home cooking. This implementation will create a comprehensive meal cost analysis tool with the following capabilities:

- Track eating out expenses across 5 meal categories (breakfast, lunch, dinner, coffee, fast food)
- Calculate home cooking costs including groceries and time investment
- Convert all costs to "life energy" (hours) using actual hourly wage
- Compare scenarios side-by-side with future value projections
- Provide 5 preset scenarios for quick comparison
- Store all data locally in localStorage with privacy-first approach

This feature integrates with the existing peninganaedalifid.is application, reusing CalculatorContext for actualHourlyWage and following established patterns from other calculators.

**Key Technical Approach**:
- Pure TypeScript calculation functions (testable, maintainable)
- React components with TypeScript for UI
- Integration with existing CalculatorContext
- localStorage for data persistence
- WCAG 2.1 AA accessibility compliance
- Responsive design (320px - 1920px+)

**Estimated Total Implementation Time**: 24-32 hours across 16 main tasks

## Implementation Strategy

**Strategy**: Hybrid (Foundation-First + Feature-Slice)

We'll use a hybrid approach that builds minimal foundation first, then implements a vertical slice of functionality, followed by expanding both foundation and features:

1. **Foundation Setup** (Tasks 1-3): Types, constants, calculation logic
   - Establishes data models and pure calculation functions
   - Enables testability from the start
   - No UI dependencies

2. **Core Feature Slice** (Tasks 4-6): Input components and basic display
   - Vertical slice: User can input data and see basic calculations
   - Validates foundation works end-to-end
   - Provides early value and testing opportunity

3. **Expand Foundation** (Tasks 7-9): Context integration and persistence
   - Integrate with CalculatorContext for actualHourlyWage
   - Add localStorage persistence
   - Complete the data layer

4. **Expand Features** (Tasks 10-13): Comparison, breakdown, presets
   - Build out rich comparison UI
   - Add preset scenarios
   - Complete the feature set

5. **Polish & Testing** (Tasks 14-16): Integration, accessibility, final validation
   - Comprehensive testing
   - Accessibility validation
   - Performance optimization

**Rationale**: This approach allows early validation of calculations while building toward complete feature. Foundation tasks are small and focused, enabling quick iteration. Feature tasks build incrementally, allowing testing at each stage.

## Task List

### Phase 1: Foundation Setup

- [x] 1. Create TypeScript type definitions and interfaces ✅ Completed 2026-01-20
- [x] 1.1 Define core data model interfaces
  - Created `MealCostData`, `EatingOutData`, `HomeCookingData` interfaces in `src/types/calculator.ts`
  - Defined `MealCostSummary`, `MealCostBreakdownItem` interfaces for calculated results
  - Defined `MealCostComparisonResults` interface for comparison data
  - Defined `MealScenarioPreset` interface for preset scenarios
  - Added comprehensive JSDoc comments for all interfaces
  - All types exported properly
  - Files: src/types/calculator.ts (lines 320-417)
  - Context: context/modules/MealCostTypes.md
  - Requirements: NS-1, NS-2, NS-3, NS-4

- [x] 1.2 Create validation schemas and type guards
  - Implemented `isValidEatingOutData()` validation function
  - Implemented `isValidHomeCookingData()` validation function
  - Added range validation (meals 0-21, costs > 0, household >= 1)
  - Validation functions integrated into calculation module
  - Unit tests: 8 validation tests in tests/lib/calculations/mealCost.test.ts
  - Requirements: All acceptance criteria validation rules

- [x] 2. Create constants and preset data ✅ Completed 2026-01-20
- [x] 2.1 Define calculation constants
  - Created `src/lib/constants/mealCost.ts` file
  - Defined `WEEKS_PER_MONTH = 4.33` constant
  - Defined `WEEKS_PER_YEAR = 52` constant
  - Defined `ANNUAL_RETURN_RATE = 0.07` for future value calculations
  - Added JSDoc explaining each constant's purpose
  - Files: src/lib/constants/mealCost.ts
  - Context: context/modules/MealCostConstants.md
  - Requirements: Design specification

- [x] 2.2 Create price presets for Icelandic context
  - Defined `MEAL_PRICE_PRESETS` object with breakfast, lunch, dinner, coffee, fastFood categories
  - Included realistic 2026 Reykjavík area prices from requirements
  - Structure: `{ label: string, value: number }[]` for each category
  - Added JSDoc with context about price sources and currency (ISK)
  - 17 total price presets across 5 categories
  - Requirements: NS-8

- [x] 2.3 Create scenario presets
  - Defined `MEAL_SCENARIO_PRESETS` array with 5 preset scenarios
  - Implemented: "Borða úti alla daga", "Venjulegur vinnandi", "Hóflega heimaeldun", "Mikil heimaeldun", "100% heimaeldun"
  - Each preset includes complete `EatingOutData` and `HomeCookingData`
  - Added descriptive names and descriptions in Icelandic
  - Validated preset data matches requirements specifications
  - Requirements: NS-7

- [x] 3. Implement pure calculation functions ✅ Completed 2026-01-20
- [x] 3.1 Create eating out calculation functions
  - Created `src/lib/calculations/mealCost.ts` file
  - Implemented `calculateEatingOutWeeklyCost(data: EatingOutData): number`
  - Formula: Sum of (meal_count × meal_cost) for all categories
  - Implemented `calculateEatingOutMonthlyCost()` using WEEKS_PER_MONTH
  - Implemented `calculateEatingOutYearlyCost()` using WEEKS_PER_YEAR
  - Implemented `generateEatingOutBreakdown()` for category breakdown
  - Unit tests: 7 eating out tests in tests/lib/calculations/mealCost.test.ts
  - Requirements: NS-1, NS-2, NS-3

- [x] 3.2 Create home cooking calculation functions
  - Implemented `calculateHomeCookingWeeklyCost(data: HomeCookingData, wage: number): number`
  - Formula: (monthlyGrocery/4.33) + (shoppingHours × wage) + (cookingHours × wage)
  - Implemented `calculateHomeCookingMonthlyCost()`
  - Implemented `calculateHomeCookingYearlyCost()`
  - Implemented `calculateCostPerPerson()` dividing by household size
  - Implemented `generateHomeCookingBreakdown()` for 3-category breakdown
  - Unit tests: 10 home cooking tests in tests/lib/calculations/mealCost.test.ts
  - Requirements: NS-4

- [x] 3.3 Create life energy calculation functions
  - Implemented `calculateLifeEnergy(cost: number, hourlyWage: number): number`
  - Formula: cost / hourlyWage = hours (uses existing dollarsToLifeEnergy)
  - Added safety check for hourlyWage = 0
  - Implemented for both monthly and yearly periods
  - Home cooking includes BOTH money AND actual time spent
  - Unit tests: 3 life energy tests with edge cases
  - Requirements: NS-5

- [x] 3.4 Create comparison and future value functions
  - Implemented `calculateEatingOutSummary()` to build complete summary object
  - Implemented `calculateHomeCookingSummary()` to build home cooking summary
  - Implemented `generateEatingOutBreakdown()` and `generateHomeCookingBreakdown()`
  - Implemented `compareEatingOutVsHome()` to generate MealCostComparisonResults
  - Reused `calculateFutureValue()` for 10/20/30 year projections
  - Generates Icelandic recommendation text based on cheaperOption
  - Unit tests: 7 comparison/summary tests
  - Files: src/lib/calculations/mealCost.ts (540 lines)
  - Tests: tests/lib/calculations/mealCost.test.ts (35 tests, all passing)
  - Context: context/modules/MealCostCalculations.md
  - Requirements: NS-5, NS-6

### Phase 2: Core Feature Slice (Input Components)

- [x] 4. Create EatingOutInputs component - Completed 2026-01-20
- [x] 4.1 Build basic component structure - Completed 2026-01-20
  - Created `src/components/mealCost/EatingOutInputs.tsx` file (325 lines)
  - Defined component props interface with proper TypeScript typing
  - Set up Card layout with section headings in Icelandic
  - Requirements: NS-1, NS-2, NS-3

- [x] 4.2 Implement meal input fields with validation - Completed 2026-01-20
  - Added input fields for breakfast, lunch, dinner (count and cost)
  - Implemented real-time validation (meals 0-21, costs > 0)
  - Added Icelandic labels and placeholders
  - Requirements: NS-1

- [x] 4.3 Implement beverage and fast food inputs - Completed 2026-01-20
  - Added coffee/drink input fields (count and cost)
  - Added fast food input fields (count and cost)
  - Applied validation pattern
  - Wrote component tests for all input scenarios (17 tests)
  - Requirements: NS-2, NS-3

- [x] 4.4 Add price preset dropdowns - Completed 2026-01-20
  - Integrated MEAL_PRICE_PRESETS for each meal category (17 presets)
  - Added Select dropdown for quick price selection
  - Allowed manual override after selecting preset
  - Displayed preset label and value together
  - Wrote tests for preset selection behavior
  - Requirements: NS-8
  - Files: src/components/mealCost/EatingOutInputs.tsx (325 lines)
  - Tests: tests/components/mealCost/EatingOutInputs.test.tsx (17 tests, all passing)
  - Context: context/modules/EatingOutInputsComponent.md

- [x] 5. Create HomeCookingInputs component - Completed 2026-01-20
- [x] 5.1 Build component structure - Completed 2026-01-20
  - Created `src/components/mealCost/HomeCookingInputs.tsx` file (175 lines)
  - Defined props with actualHourlyWage integration
  - Set up Card layout with Icelandic headings
  - Requirements: NS-4

- [x] 5.2 Implement grocery and household inputs - Completed 2026-01-20
  - Added monthly grocery cost input field (CurrencyInput component)
  - Added household size input field (min: 1)
  - Implemented validation (grocery > 0, household >= 1)
  - Added Icelandic labels and help text
  - Showed calculated "cost per person" in primary-50 section
  - Requirements: NS-4

- [x] 5.3 Implement time tracking inputs - Completed 2026-01-20
  - Added shopping hours per week input field (step 0.5)
  - Added cooking hours per week input field (step 0.5)
  - Validated hours >= 0
  - Showed calculated time cost breakdown with formula display
  - Added warning when actualHourlyWage is 0
  - Wrote component tests for all scenarios (25 tests)
  - Requirements: NS-4
  - Files: src/components/mealCost/HomeCookingInputs.tsx (175 lines)
  - Tests: tests/components/mealCost/HomeCookingInputs.test.tsx (25 tests, all passing)
  - Context: context/modules/HomeCookingInputsComponent.md
  - Barrel export: src/components/mealCost/index.ts

- [ ] 6. Create basic MealCostCalculator container
- [ ] 6.1 Build container component structure
  - Create `src/components/MealCost/MealCostCalculator.tsx` file
  - Set up component state for `mealCostData`
  - Use default values from requirements
  - Create basic layout with Card components
  - Add page heading in Icelandic
  - Requirements: All user stories

- [ ] 6.2 Integrate input components
  - Render EatingOutInputs with state binding
  - Render HomeCookingInputs with state binding
  - Pass mock actualHourlyWage for now (2000 kr/hour)
  - Implement onChange handlers for both inputs
  - Add basic two-column layout (desktop) / stacked (mobile)
  - Requirements: NS-1, NS-4

- [ ] 6.3 Add basic results display
  - Calculate and display eating out weekly/monthly/yearly totals
  - Calculate and display home cooking weekly/monthly/yearly totals
  - Use formatCurrency utility for display
  - Show calculations update in real-time as user types
  - Add basic styling with Tailwind CSS
  - Write integration tests for component interaction
  - Requirements: NS-5

### Phase 3: Expand Foundation (Context & Persistence)

- [x] 7. Integrate with CalculatorContext ✅ Completed 2026-01-20
- [x] 7.1 Update CalculatorContext interface
  - Added `mealCostData: MealCostData` to context state
  - Added `updateMealCostData(data: Partial<MealCostData>): void` method
  - Added `updateEatingOut(data: Partial<EatingOutData>): void` helper
  - Added `updateHomeCooking(data: Partial<HomeCookingData>): void` helper
  - Updated context TypeScript types
  - Files: src/context/CalculatorContext.tsx
  - Context: context/modules/MealCostContext.md
  - Requirements: Design specification

- [x] 7.2 Add memoized calculation hooks
  - Added `mealCostSummary` computed property to context
  - Uses useMemo with dependencies: mealCostData, actualHourlyWage
  - Calls compareEatingOutVsHome() for full comparison calculation
  - Includes eating out summary, home cooking summary, comparison metrics
  - Try-catch error handling for calculation failures
  - Gracefully handles wage = 0 (costs work, life energy = 0)
  - Tests: tests/context/CalculatorContext.mealCost.test.tsx (calculation tests)
  - Requirements: Performance requirement (< 50ms)

- [x] 7.3 Context integration complete
  - CalculatorContext provides all meal cost state and methods
  - Components can use `const { mealCostData, updateEatingOut, updateHomeCooking, mealCostSummary } = useCalculator()`
  - actualHourlyWage from main calculator automatically used in calculations
  - UI can check `results?.actualHourlyWage` and show warning if needed
  - All tests passing (11/11)
  - Requirements: NS-5 (actualHourlyWage dependency)

- [x] 8. Implement localStorage persistence ✅ Completed 2026-01-20
- [x] 8.1 Update StoredState interface
  - Added `mealCostData?: MealCostData` to StoredState interface
  - Optional field for backwards compatibility with existing users
  - No version change needed (graceful fallback)
  - Files: src/types/calculator.ts (StoredState interface)
  - Requirements: Privacy requirement

- [x] 8.2 Implement save/load functions
  - Updated auto-save effect to include mealCostData (500ms debounce)
  - Updated `saveToStorage()` to include mealCostData
  - Updated `loadFromLocalStorage()` to restore mealCostData
  - Fallback to DEFAULT_EATING_OUT_DATA and DEFAULT_HOME_COOKING_DATA if not found
  - Uses existing safeSetItem/safeGetItem utilities (quota handling included)
  - Tests: tests/context/CalculatorContext.mealCost.test.tsx (localStorage test)
  - Requirements: Reliability requirement

- [x] 8.3 Add export/import support
  - Updated exportDataHandler to include mealCostData in JSON export
  - Updated importDataHandler to restore mealCostData from JSON
  - Fallback to defaults if mealCostData missing in imported file
  - Existing validation and version checking applies
  - Existing toast notifications work for success/error
  - Files: src/context/CalculatorContext.tsx
  - Requirements: Privacy requirement

- [x] 9. Add error handling and edge cases ✅ Completed 2026-01-20
- [x] 9.1 Input validation ready for UI
  - Validation functions exist: isValidEatingOutData(), isValidHomeCookingData()
  - UI components can call these for inline validation
  - Validation error types ready for UI integration
  - Icelandic error messages can be added in UI layer
  - Tests: tests/lib/calculations/mealCost.test.ts (validation tests)
  - Requirements: Reliability requirement

- [x] 9.2 Handle missing actualHourlyWage gracefully
  - mealCostSummary handles wage = 0 gracefully
  - Calculations work (costs calculated correctly)
  - Life energy shows 0 when wage = 0
  - UI can check `results?.actualHourlyWage` and show Alert
  - Message can be: "Vinsamlegast fylltu út raunverulegt tímakaup í aðalreiknivélinni fyrst."
  - Tests: tests/context/CalculatorContext.mealCost.test.tsx (zero wage test)
  - Requirements: NS-5 (AC 4)

- [x] 9.3 localStorage fallback implemented
  - safeSetItem/safeGetItem utilities handle localStorage errors
  - Quota exceeded returns false, logs warning
  - SSR-safe (returns false during server-side rendering)
  - Existing utilities provide all necessary error handling
  - Tests: Covered by existing localStorage utility tests
  - Requirements: Reliability requirement

### Phase 4: Expand Features (Comparison & Presets)

- [x] 10. Create MealCostComparison component ✅ Completed 2026-01-20
- [x] 10.1 Build comparison summary view
  - Created `src/components/mealCost/MealCostComparison.tsx` file (310 lines)
  - Displays eating out vs home cooking side-by-side
  - Shows monthly and yearly totals for both options
  - Calculates and displays difference (kr and percentage)
  - Highlights cheaper option with green border and "ÓDÝRARA" badge
  - Uses elevated Card layout with gradient header
  - Requirements: NS-5

- [x] 10.2 Add life energy comparison
  - Displays life energy hours for eating out (monthly)
  - Displays life energy hours for home cooking (monthly)
  - Shows difference in life energy in dedicated section
  - Uses formatLifeEnergy() for proper formatting
  - Hides life energy when actualHourlyWage is 0
  - Requirements: NS-5

- [x] 10.3 Implement future value projections
  - Calculates and displays 10/20/30 year future value at 7% return
  - Uses calculateFutureValue() from existing utilities
  - Formats large numbers with Icelandic separators (e.g., "1.234.567 kr")
  - Shows explanatory text: "Ef þú fjárfestir X kr á mánuði með 7% árlegri ávöxtun"
  - Hides section when options are similar (not showing negative values)
  - Tested with 17 comprehensive tests
  - Requirements: NS-6

- [x] 10.4 Add recommendation text
  - Generates contextual recommendation from comparison calculation
  - Success variant (green) when home cooking is cheaper
  - Warning variant (yellow) when eating out is cheaper
  - Info variant (blue) when costs are similar
  - Displays in Alert component with appropriate styling
  - Tests verify all recommendation variants work correctly
  - Requirements: NS-5
  - Context: context/modules/MealCostComparison.md

- [x] 11. Create MealCostBreakdown component ✅ Completed 2026-01-20
- [x] 11.1 Build breakdown view for eating out
  - Created `src/components/mealCost/MealCostBreakdown.tsx` file (205 lines)
  - Props: `{ summary: MealCostSummary, type: 'eatingOut' | 'homeCooking', wage: number }`
  - Displays breakdown items in responsive table/list
  - Shows: Category | Amount (kr) | Life Energy (hours) | Percentage
  - Breakdown already sorted by calculation function (descending)
  - Uses color coding with category indicator dots
  - Requirements: NS-5 (AC 2)

- [x] 11.2 Build breakdown view for home cooking
  - Displays groceries cost line item
  - Displays shopping time cost with life energy
  - Displays cooking time cost with life energy
  - Shows total and percentages (100% at bottom)
  - Collapsible/expandable functionality for mobile with "Sýna"/"Fela" button
  - Comprehensive component tests for both breakdown types (16 tests)
  - Special note explains time cost inclusion
  - Requirements: NS-5 (AC 3)
  - Context: context/modules/MealCostBreakdown.md

- [x] 12. Create MealPresetSelector component ✅ Completed 2026-01-20
- [x] 12.1 Build preset selection interface
  - Created `src/components/mealCost/MealPresetSelector.tsx` file (390 lines)
  - Displays all 5 preset scenarios as clickable cards
  - Shows scenario name, description, and arrow icon
  - Cards use hover and focus states for better UX
  - Responsive full-width layout (stacks on mobile)
  - Requirements: NS-7

- [x] 12.2 Implement preset application logic
  - When preset clicked, calls onSelect callback with preset data
  - Parent component (MealCostCalculator) will update mealCostData
  - User can modify values after selecting preset (no lock-in)
  - No confirmation dialog (matches design simplicity)
  - Tests verify preset selection callback works correctly
  - Requirements: NS-7 (AC 2, 3)

- [x] 12.3 Create scenario comparison table
  - Displays comparison table with all 5 scenarios
  - Columns: Scenario | Monthly Cost | Life Energy | Savings vs Current | FV (20yr)
  - Calculates each scenario using current actualHourlyWage
  - Shows savings in green (positive) or red (negative)
  - Displays future value only for scenarios with positive savings
  - Responsive: Desktop table, mobile card layout
  - Toggle button shows/hides table (progressive disclosure)
  - Note explains hourly wage usage in calculations
  - Tests verify comparison calculations and rendering (16 tests)
  - Requirements: NS-7 (AC 4)
  - Context: context/modules/MealPresetSelector.md

- [ ] 13. Add responsive layout and tabs
- [ ] 13.1 Implement tab navigation
  - Add Tab component to MealCostCalculator
  - Tabs: "Innsláttur" (Inputs), "Samanburður" (Comparison), "Atburðarásir" (Scenarios)
  - Switch between input view, comparison view, and presets view
  - Remember selected tab in component state
  - Use keyboard navigation (Arrow keys, Tab)
  - Requirements: Design specification

- [ ] 13.2 Optimize mobile layout
  - Stack all components vertically on mobile (< 768px)
  - Use full width for input fields
  - Collapse breakdown tables by default on mobile
  - Hide less important columns in tables on mobile
  - Test on various mobile screen sizes (320px - 767px)
  - Requirements: Responsive requirement

- [ ] 13.3 Optimize desktop layout
  - Two-column layout for inputs (eating out | home cooking)
  - Full-width comparison and breakdown sections
  - Side-by-side comparison cards
  - Sticky navigation or quick links
  - Test on various desktop sizes (1024px - 1920px+)
  - Requirements: Responsive requirement

### Phase 5: Polish & Testing (Integration & Accessibility)

- [ ] 14. Implement comprehensive testing
- [ ] 14.1 Write calculation function unit tests
  - Test all eating out calculations with various inputs
  - Test all home cooking calculations with edge cases
  - Test life energy calculations (zero wage, high wage)
  - Test future value calculations for 10/20/30 years
  - Achieve 95%+ code coverage for calculation library
  - Use Vitest for all unit tests
  - Requirements: Testing strategy

- [ ] 14.2 Write component unit tests
  - Test EatingOutInputs with valid/invalid inputs
  - Test HomeCookingInputs with all scenarios
  - Test MealCostComparison rendering and logic
  - Test MealCostBreakdown with both types
  - Test MealPresetSelector preset selection
  - Achieve 80%+ coverage for React components
  - Use React Testing Library
  - Requirements: Testing strategy

- [ ] 14.3 Write integration tests
  - Test MealCostCalculator with full user workflow
  - Test context integration and state updates
  - Test localStorage save/load scenarios
  - Test export/import functionality
  - Test preset application and modification
  - Mock CalculatorContext appropriately
  - Requirements: Testing strategy

- [ ] 14.4 Write accessibility tests
  - Run jest-axe on all components
  - Fix any accessibility violations
  - Test keyboard navigation through all inputs
  - Test screen reader announcements
  - Validate ARIA labels and roles
  - Test color contrast ratios
  - Requirements: WCAG 2.1 AA compliance

- [ ] 15. Implement accessibility features
- [ ] 15.1 Add proper ARIA attributes
  - Add aria-label to all input fields
  - Add aria-describedby for help text
  - Add aria-invalid for validation errors
  - Add aria-live regions for dynamic updates
  - Add role attributes where needed
  - Test with screen reader (VoiceOver/NVDA)
  - Requirements: Accessibility requirement

- [ ] 15.2 Implement keyboard navigation
  - Ensure all inputs are keyboard accessible
  - Add Tab order for logical navigation
  - Support Enter to submit/update
  - Support Escape to cancel
  - Add keyboard shortcuts for tabs (Ctrl+1, Ctrl+2, etc.)
  - Test full keyboard-only workflow
  - Requirements: Accessibility requirement (AC 2)

- [ ] 15.3 Optimize for screen readers
  - Add descriptive labels to all form elements
  - Provide context for calculated values
  - Announce validation errors clearly
  - Add visually-hidden text for icons
  - Test complete workflow with screen reader
  - Document keyboard shortcuts in help text
  - Requirements: Accessibility requirement (AC 3)

- [ ] 15.4 Validate color contrast and visual design
  - Check all text meets 4.5:1 contrast ratio
  - Check headings meet 3:1 contrast ratio
  - Test with high contrast mode
  - Test with reduced motion preference
  - Ensure focus indicators are visible
  - Validate with accessibility checker tools
  - Requirements: Accessibility requirement (AC 4)

- [ ] 16. Final integration and polish
- [ ] 16.1 Add feature to app navigation
  - Add menu item for Matkostnaðarmælir in main navigation
  - Create route in Next.js App Router
  - Add feature to homepage or dashboard
  - Create descriptive link text in Icelandic
  - Test navigation from all entry points
  - Requirements: Integration requirement

- [ ] 16.2 Implement performance optimizations
  - Verify calculations complete in < 50ms
  - Optimize re-renders with React.memo where needed
  - Verify debouncing works correctly (500ms)
  - Test with large numbers and edge cases
  - Profile with React DevTools
  - Optimize bundle size if needed
  - Requirements: Performance requirement (AC 1)

- [ ] 16.3 Add Icelandic language polish
  - Review all text for correct Icelandic
  - Verify number formatting (1.000.000 format)
  - Verify currency formatting (kr)
  - Check plural forms ("1 klukkustund" vs "2 klukkustundir")
  - Ensure all error messages are in Icelandic
  - Review with native Icelandic speaker if possible
  - Requirements: Language requirement

- [ ] 16.4 Create user documentation
  - Add help text explaining life energy concept
  - Add tooltips for complex inputs
  - Create inline examples or placeholders
  - Add "How to use" section or modal
  - Document keyboard shortcuts
  - Create FAQ section if needed
  - Requirements: Usability

- [ ] 16.5 Final validation and cleanup
  - Run full test suite and fix any failures
  - Perform manual testing on all screen sizes
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices (iOS, Android)
  - Validate all requirements are met
  - Remove console.logs and debug code
  - Clean up commented code
  - Verify code follows project conventions
  - Requirements: All requirements

## Dependencies

### Critical Path

The following tasks form the critical path and must be completed sequentially:

1. **Tasks 1-3** (Foundation) → **Tasks 4-6** (Core Slice) → **Task 7** (Context Integration) → **Tasks 10-13** (Features) → **Tasks 14-16** (Testing & Polish)

### Key Dependencies

**Phase 1 Dependencies:**
- Task 1 (Types) must complete before all other tasks
- Task 2 (Constants) must complete before Task 3 (Calculations)
- Task 3 (Calculations) must complete before any component tasks

**Phase 2 Dependencies:**
- Task 4 (EatingOutInputs) requires Task 1.1, 2.2 (types and price presets)
- Task 5 (HomeCookingInputs) requires Task 1.1 (types)
- Task 6 (MealCostCalculator) requires Tasks 3, 4, 5 (calculations and input components)

**Phase 3 Dependencies:**
- Task 7 (Context Integration) requires Task 1.1 (types updated in context)
- Task 8 (localStorage) requires Task 1.1, 7.1 (types and context)
- Task 9 (Error Handling) requires Tasks 4, 5, 7 (components and context)

**Phase 4 Dependencies:**
- Task 10 (Comparison) requires Tasks 3.4, 7.2 (comparison calculations and context)
- Task 11 (Breakdown) requires Tasks 3.4, 10 (breakdown calculations)
- Task 12 (Presets) requires Tasks 2.3, 7 (preset constants and context integration)
- Task 13 (Layout) requires Tasks 4-12 (all components must exist)

**Phase 5 Dependencies:**
- Task 14 (Testing) requires all previous tasks to be testable
- Task 15 (Accessibility) requires Tasks 4-13 (all UI components)
- Task 16 (Polish) requires all previous tasks complete

### Parallel Work Opportunities

The following tasks can be worked on in parallel:

**After Task 1 completes:**
- Task 2.1 (Constants) and Task 1.2 (Validation) can parallelize

**After Task 3 completes:**
- Task 4 (EatingOutInputs) and Task 5 (HomeCookingInputs) can parallelize

**After Task 7 completes:**
- Task 8 (localStorage) and Task 9 (Error Handling) can parallelize

**After Task 9 completes:**
- Tasks 10, 11, 12 can parallelize (Comparison, Breakdown, Presets)

**After Task 13 completes:**
- Task 14 (Testing) and Task 15 (Accessibility) can parallelize partially

### External Dependencies

- **CalculatorContext**: Existing context must support extension (Task 7)
- **UI Components**: Card, Input, Select, Alert, Button components must exist
- **Utility Functions**: formatCurrency, formatNumber, formatLifeEnergy must exist
- **localStorage API**: Browser must support localStorage
- **Testing Libraries**: Vitest, React Testing Library, jest-axe must be installed

## Notes

### Development Environment

**Recommended Approach**: Work in main branch for this feature unless parallel development is needed.

**Optional Worktree**: Consider creating an isolated worktree if:
- Multiple developers working on this feature simultaneously
- Want to keep experimental work separate from main development
- Need isolated ports/database for testing

To create a worktree:
```bash
/create_worktree matkostnadur
```

Benefits:
- Isolated development environment
- Separate configuration and ports
- Safe experimentation without affecting main branch

See `docs/worktree-integration.md` for full worktree guide.

### Implementation Tips

**Testing Philosophy**:
- Write tests alongside implementation (not after)
- Start with calculation functions (pure, easy to test)
- Use TDD for complex business logic
- Test edge cases: zero values, very large numbers, invalid inputs

**Component Development**:
- Use Storybook for isolated component development
- Build components mobile-first, then enhance for desktop
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks

**Performance Considerations**:
- All calculations must complete in < 50ms
- Use React.memo for expensive components
- Debounce user input (500ms) to reduce re-renders
- Profile with React DevTools if performance issues occur

**Accessibility First**:
- Add ARIA attributes as you build components
- Test with keyboard navigation continuously
- Use semantic HTML (labels, fieldsets, legends)
- Test with screen reader early and often

### Icelandic Language Guidelines

**Number Formatting**:
- Thousands separator: period (1.000.000)
- Decimal separator: comma (1.234,56) for display
- Currency: "kr" suffix (1.500 kr)

**Plural Forms**:
- 1 klukkustund, 2 klukkustundir
- 1 dagur, 2 dagar
- 1 vika, 2 vikur
- 1 mánuður, 2 mánuðir

**Common Terms**:
- Matkostnaður = Meal cost
- Lífsorka = Life energy
- Heimaeldun = Home cooking
- Mat úti / Að borða úti = Eating out
- Sparnaður = Savings
- Framtíðarverðmæti = Future value

### File Structure

Expected file organization:
```
src/
├── types/
│   └── calculator.ts (add MealCost types)
├── lib/
│   ├── constants/
│   │   └── mealCost.ts (constants and presets)
│   └── calculations/
│       └── mealCost.ts (pure calculation functions)
├── components/
│   └── MealCost/
│       ├── MealCostCalculator.tsx (container)
│       ├── EatingOutInputs.tsx
│       ├── HomeCookingInputs.tsx
│       ├── MealCostComparison.tsx
│       ├── MealCostBreakdown.tsx
│       └── MealPresetSelector.tsx
└── __tests__/
    ├── lib/
    │   └── calculations/
    │       └── mealCost.test.ts
    └── components/
        └── MealCost/
            └── [component].test.tsx
```

### Code Style Guidelines

**TypeScript**:
- Use strict typing (no `any`)
- Define interfaces for all data structures
- Use JSDoc comments for complex functions
- Export types from centralized location

**React**:
- Functional components with hooks
- TypeScript for all props
- Use custom hooks for reusable logic
- Keep components under 200 lines

**Testing**:
- Descriptive test names: "should calculate eating out cost correctly"
- Test behavior, not implementation
- Use arrange-act-assert pattern
- Mock external dependencies appropriately

### Common Pitfalls to Avoid

1. **Division by Zero**: Always check actualHourlyWage before dividing
2. **Floating Point Math**: Use proper rounding for currency (round to nearest kr)
3. **State Updates**: Remember React state updates are async
4. **localStorage Quota**: Handle quota exceeded gracefully
5. **Validation**: Validate on both input and submission
6. **Accessibility**: Don't forget focus management and keyboard navigation
7. **Mobile Testing**: Test on real devices, not just browser DevTools
8. **Icelandic Grammar**: Verify plural forms and number formatting

### Quality Checklist

Before marking a task complete, verify:

- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] Test coverage meets targets (95% for lib, 80% for components)
- [ ] Component works on mobile and desktop
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] No console errors or warnings
- [ ] Code follows project style guide
- [ ] Icelandic text is correct
- [ ] Requirements traceability documented

### Resources

**Design Reference**: See `specs/matkostnadur/design.md` for:
- Complete data model specifications
- Calculation formulas
- UI component designs
- Integration patterns

**Requirements Reference**: See `specs/matkostnadur/requirements.md` for:
- User stories (NS-1 through NS-8)
- Acceptance criteria (EARS format)
- Non-functional requirements
- Validation rules

**Similar Features**: Reference these existing features for patterns:
- CalculatorContext usage
- localStorage persistence
- Export/import functionality
- Responsive layout patterns

### Success Metrics

This implementation is complete when:
- All 16 tasks are checked off
- All tests pass (unit, component, integration, accessibility)
- All 8 user stories are implemented and tested
- Feature works on mobile and desktop (320px - 1920px+)
- WCAG 2.1 AA compliance validated
- Performance < 50ms for all calculations
- All text in correct Icelandic
- Documentation complete
- Code reviewed and approved

**Estimated Total Time**: 24-32 hours of focused development work

Good luck with implementation!
