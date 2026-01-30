# Implementation Tasks: Interest Savings Snowball Calculator

## Overview

This document provides a detailed task breakdown for implementing the Interest Savings Snowball Calculator (Vaxtasparnaður Snjóboltareiknivél) feature. The calculator helps users understand the compound effect of reinvesting interest savings from extra loan payments, comparing three scenarios: base case, snowball to loan, and snowball to investment.

**Feature Summary**:
- Three-scenario comparison: Base case, snowball to loan, snowball to investment
- Monthly breakdown showing how interest savings compound over time
- Visual charts comparing scenarios
- Integration with existing Debt Payoff calculator
- Life energy display for all monetary values

**Reference Documents**:
- Requirements: requirements-interest-savings-snowball.md
- Design: design-interest-savings-snowball.md

**Estimated Scope**: 18-22 tasks across 5 major components

## Implementation Strategy

**Strategy**: Hybrid (Foundation-First + Feature-Slice)

**Rationale**: This approach balances the need for a solid calculation foundation with early delivery of a working feature:

1. **Minimal Foundation** (Tasks 1-2): Set up core types and constants
2. **Calculation Engine** (Tasks 3-5): Build the heart of the feature - the snowball calculation logic
3. **Core Feature Slice** (Tasks 6-11): Deliver end-to-end working feature with input forms and basic results display
4. **Expand Components** (Tasks 12-15): Add rich visualizations and detailed breakdowns
5. **Integration & Polish** (Tasks 16-18): Connect with existing calculators and refine UX

**Benefits**:
- Core calculation logic validated early
- Working feature available mid-implementation for testing
- Can parallelize UI work once calculations are done
- Integration happens after core feature is stable

## Task List

### 1. Foundation Setup

- [x] 1.1 Create TypeScript types for snowball calculator - Completed 2026-01-22
  - Implemented: src/types/snowball.ts
  - Context: context/modules/SnowballCalculatorFoundation.md
  - Created LoanType ('verdtryggd' | 'oVerdtryggd') and PaymentMethod ('annuity' | 'linear') types
  - Defined SnowballLoanInput with originalLoanAmount, currentBalance, annualInterestRate, loanTermMonths, remainingPayments, loanType, paymentMethod, inflationRate
  - Defined SnowballInput combining loan, extraPayment, expectedInvestmentReturn, actualHourlyWage
  - Defined MonthlyRow with fields for all three scenarios (base, snowball-to-loan, snowball-to-investment)
  - Defined ScenarioSummary with monthsToPayoff, totalInterestPaid, totalPayments, finalInvestmentBalance, totalWealthCreated, lifeEnergyHours
  - Defined SnowballResults with monthlySchedule, baseCase, snowballToLoan, snowballToInvestment, recommendation
  - All interfaces include comprehensive JSDoc comments
  - Test: TypeScript compilation passes
  - Requirements: REQ-FR-1, REQ-FR-2, REQ-FR-3

- [x] 1.2 Create constants and defaults for snowball calculator - Completed 2026-01-22
  - Implemented: src/lib/constants/snowball.ts
  - Context: context/modules/SnowballCalculatorFoundation.md
  - Created DEFAULT_INVESTMENT_RETURN (0.07 = 7%)
  - Created MAX_PROJECTION_MONTHS (600)
  - Created MIN_BALANCE_THRESHOLD (0.01)
  - Created CLOSE_CALL_THRESHOLD (0.05 = 5%)
  - Created DEFAULT_LOAN_INPUT (30M ISK indexed mortgage with realistic values)
  - Created DEFAULT_EXTRA_PAYMENT (10,000 ISK)
  - Created TYPICAL_INFLATION_RATE (0.05)
  - Created INVESTMENT_RETURN_RANGE and INTEREST_RATE_RANGE
  - Included helper functions: getDefaultLoanInput(), isInvestmentReturnUnrealistic(), isLoanTermVeryLong()
  - All exports include JSDoc comments
  - Test: Constants are importable and have correct values
  - Requirements: REQ-FR-3.2, REQ-NFR-1

### 2. Calculation Engine - Core Logic

- [x] 2.1 Implement helper function to calculate base monthly payment - Completed 2026-01-22
  - Implemented: src/lib/calculations/snowball.ts
  - Context: context/modules/SnowballCalculationEngine.md
  - Created `calculateBasePayment()` function
  - Supports annuity payment calculation for verðtryggð loans
  - Supports annuity and linear payment methods for óverðtryggð loans
  - Handles edge cases (zero interest, zero term, zero loan amount)
  - Comprehensive JSDoc documentation with formula explanations
  - Unit tests: 6 tests covering all loan types and payment methods
  - Test: All payment calculations match expected values
  - Requirements: REQ-FR-1.6, REQ-FR-1.7, REQ-NFR-5

- [x] 2.2 Implement main snowball calculation engine - Completed 2026-01-22
  - Implemented: src/lib/calculations/snowball.ts
  - Context: context/modules/SnowballCalculationEngine.md
  - Implemented `calculateSnowball()` master function
  - Initializes tracking variables for all three scenarios (base, snowball-to-loan, snowball-to-investment)
  - Month-by-month loop processes all scenarios in parallel
  - Calculates interest for each scenario based on current balance
  - Applies inflation adjustment for verðtryggð loans each month (compounds monthly)
  - Tracks accumulated interest savings for snowball-to-loan scenario
  - Invests interest savings for snowball-to-investment scenario with compound returns
  - Stops when all scenarios paid off or hits max months (600)
  - Builds complete monthly schedule array with all scenario data
  - Test: Function runs without errors for standard inputs - 24 tests passing
  - Requirements: REQ-FR-4.1, REQ-FR-4.2, REQ-FR-4.3, REQ-FR-4.4

- [x] 2.3 Implement scenario summary calculations - Completed 2026-01-22
  - Implemented: src/lib/calculations/snowball.ts (buildResults() helper)
  - Context: context/modules/SnowballCalculationEngine.md
  - Calculates months to payoff for each scenario (finds first month with zero balance)
  - Calculates total interest paid for each scenario (sums all interest payments)
  - Calculates total payments for each scenario (sums all payments)
  - Calculates final investment balance for snowball-to-investment scenario
  - Calculates total wealth created (debt eliminated + investment value)
  - Converts all monetary values to life energy hours if wage provided
  - Handles empty schedule edge case gracefully
  - Test: Summary calculations verified through unit tests
  - Requirements: REQ-FR-5.1, REQ-FR-5.2, REQ-FR-5.3, REQ-FR-5.4, REQ-FR-5.5

- [x] 2.4 Implement recommendation logic - Completed 2026-01-22
  - Implemented: src/lib/calculations/snowball.ts (buildResults() and generateReasoning())
  - Tests: src/lib/calculations/__tests__/snowball.test.ts (24 tests, all passing)
  - Context: context/modules/SnowballCalculationEngine.md
  - Compares total wealth created across all three scenarios
  - Determines best scenario (highest total wealth)
  - Calculates percentage difference between best and second-best
  - Sets `isCloseCall` flag if difference < 5%
  - Implemented `generateReasoning()` function creating Icelandic explanation
  - Includes reasoning for: rate comparison, time horizon, risk, interest/time savings, investment gains, life energy impact
  - Calculates life energy difference between best and worst scenarios
  - Test: Recommendation logic tested across various inputs - all passing
  - Requirements: REQ-US-4, REQ-NFR-2

- [ ] 2.5 Write comprehensive unit tests for calculation engine
  - Create new file: `src/lib/calculations/snowball.test.ts`
  - Test base case calculates correctly (extra payment only, no snowball)
  - Test snowball-to-loan pays off faster than base case
  - Test snowball-to-investment creates more wealth when returns exceed loan rate
  - Test snowball-to-loan creates more wealth when loan rate exceeds returns
  - Test handling of verðtryggð loans with inflation
  - Test handling of óverðtryggð loans with annuity and linear payment methods
  - Test edge cases: very high interest, very low interest, zero extra payment
  - Test maximum month limit (600) prevents infinite loops
  - Test life energy calculations when wage provided
  - Test recommendation is "close call" when scenarios differ by less than 5%
  - Requirements: REQ-NFR-1, all calculation requirements

### 3. Input Components

- [x] 3.1 Create loan input card component - Completed 2026-01-22
  - Implemented: src/components/snowball/LoanInputCard.tsx
  - Context: context/modules/SnowballInputComponents.md
  - Created comprehensive loan input form with loan type selector (verðtryggð/óverðtryggð)
  - All required fields: original loan amount, current balance, annual interest rate, loan term months, remaining payments
  - Conditional fields: inflation rate for verðtryggð loans (default 5%), payment method selector for óverðtryggð loans (annuity/linear)
  - Automatic field resets when switching loan types with contextual help text
  - Uses CurrencyInput, NumberInput, and Select components with error display support
  - Full Icelandic labels with informational alert explaining loan type differences
  - Requirements: REQ-FR-1, REQ-NFR-2, REQ-NFR-5

- [x] 3.2 Create extra payment input card component - Completed 2026-01-22
  - Implemented: src/components/snowball/ExtraPaymentCard.tsx
  - Context: context/modules/SnowballInputComponents.md
  - CurrencyInput for monthly extra payment amount with life energy equivalent display
  - Adaptive life energy formatting (minutes, hours, or days+hours based on value)
  - Purple-themed life energy display with clock icon and "klst" suffix
  - Warning when actualHourlyWage missing, educational explanation of extra payment concept
  - Icelandic number formatting throughout (1.000 kr format)
  - Note: Slider not implemented (optional enhancement)
  - Requirements: REQ-FR-2, REQ-NFR-2

- [x] 3.3 Create investment assumptions card component - Completed 2026-01-22
  - Implemented: src/components/snowball/InvestmentCard.tsx
  - Implemented: src/components/snowball/index.ts (updated barrel export)
  - Context: context/modules/SnowballInputComponents.md
  - NumberInput for expected annual investment return (percentage) with default 7%
  - Informational message when using default value, warning alert when return > 20%
  - Investment strategy guidance tiers (conservative, moderate, aggressive)
  - Historical return data (S&P 500, MSCI World, Iceland) with disclaimers
  - Min/max validation (0-50%) with proper percentage formatting
  - All help text in Icelandic with comprehensive guidance
  - Requirements: REQ-FR-3

### 4. Results Display Components

- [x] 4.1 Create scenario summary comparison cards - Completed 2026-01-22
  - Implemented: src/components/snowball/ScenarioSummary.tsx
  - Tests: tests/components/snowball/ScenarioSummary.test.tsx (10 tests, all passing)
  - Context: context/modules/SnowballResultsComponents.md
  - Created ScenarioSummary component with three cards side-by-side (responsive grid)
  - Card 1 "Grunnur" with gray theme, Card 2 "Snjóbolti → Lán" with blue theme, Card 3 "Snjóbolti → Fjárfesting" with green theme
  - Shows months to payoff, total interest paid, total payments, final investment balance (conditional), total wealth created (highlighted), life energy savings (purple, "klst" suffix)
  - Features responsive layout (1 column mobile, 3 columns desktop), Icelandic formatting, conditional rendering
  - Requirements: REQ-US-1, REQ-FR-5, REQ-NFR-2

- [x] 4.2 Create recommendation card component - Completed 2026-01-22
  - Implemented: src/components/snowball/RecommendationCard.tsx
  - Tests: tests/components/snowball/RecommendationCard.test.tsx (12 tests, all passing)
  - Context: context/modules/SnowballResultsComponents.md
  - Created RecommendationCard with best scenario name prominently displayed
  - Shows "Jafntefli - persónuleg val" badge for close calls (isCloseCall=true)
  - Displays reasoning as plain-language Icelandic text (supports multiline)
  - Prominent purple panel with life energy difference ("X klst meira frítíma á ævinni")
  - Conditional border colors: green for clear recommendation, yellow for close call
  - Includes close call explanation panel encouraging personal preference
  - Requirements: REQ-US-4, REQ-NFR-2

### 5. Visualization Components

- [x] 5.1 Create debt balance comparison chart - Completed 2026-01-22
  - Implemented: src/components/snowball/SnowballChart.tsx
  - Tests: src/components/snowball/__tests__/SnowballChart.test.tsx (7 tests passing)
  - Context: context/modules/SnowballVisualizationComponents.md
  - Created LineChart with 4 lines (gray base, blue snowball-to-loan, red snowball-to-invest debt, green investment balance)
  - X-axis shows months, Y-axis shows ISK in millions with "M" suffix
  - Custom tooltips with formatted currency values, Icelandic legend, responsive container (320px height)
  - All tests passing, renders correctly with sample data
  - Requirements: REQ-US-2, REQ-FR-6.1, REQ-NFR-3

- [x] 5.2 Create cumulative interest savings chart - Completed 2026-01-22
  - Implemented: src/components/snowball/SnowballChart.tsx (updated)
  - Tests: src/components/snowball/__tests__/SnowballChart.test.tsx (7 tests passing)
  - Context: context/modules/SnowballVisualizationComponents.md
  - Added second chart section showing cumulative interest savings over time
  - Single purple line (#8b5cf6) with same axis formatting as debt chart
  - Custom tooltip, insight text showing final cumulative savings amount
  - Chart height 256px, vertical spacing between charts
  - Requirements: REQ-US-2, REQ-FR-6.2

- [x] 5.3 Create monthly breakdown table component - Completed 2026-01-22
  - Implemented: src/components/snowball/MonthlyBreakdown.tsx
  - Tests: src/components/snowball/__tests__/MonthlyBreakdown.test.tsx (14 tests passing)
  - Context: context/modules/SnowballVisualizationComponents.md
  - Collapsible Card with scenario selector dropdown (Base / Snowball to Loan / Snowball to Investment)
  - Dynamic columns: Month, Opening Balance, Payment, Interest, Principal, Closing Balance, Interest Savings (conditional), Extra from Savings (snowball-to-loan), Investment Balance (snowball-to-invest)
  - Summary row with totals (payments, interest, principal, savings), life energy totals when wage provided
  - Pagination: default 12 months, "Show All" button expands to full schedule
  - Color-coded legend, Icelandic formatting, horizontal scroll on mobile
  - Table virtualization deferred (not needed for 600 rows, performs well)
  - Requirements: REQ-US-3, REQ-NFR-1

### 6. Main Page Component

- [x] 6.1 Create main snowball calculator page component - Completed 2026-01-22
  - Implemented: src/components/snowball/SnowballCalculatorPage.tsx
  - Context: context/modules/SnowballMainPage.md
  - Set up state for loan input, extra payment, investment return using useState
  - Uses useMemo to calculate results when inputs change (automatic debouncing)
  - Renders all input cards (LoanInputCard, ExtraPaymentCard, InvestmentCard)
  - Renders results section only when inputs are valid
  - Shows validation errors prominently with Alert component
  - Receives actual hourly wage from props (passed from route page)
  - Shows warning Alert if actual hourly wage is not set
  - Test: TypeScript compilation passes, components render correctly
  - Requirements: REQ-US-1, REQ-NFR-1, REQ-NFR-4

- [x] 6.2 Layout and arrange result components - Completed 2026-01-22
  - Implemented: src/components/snowball/SnowballCalculatorPage.tsx (same file)
  - Context: context/modules/SnowballMainPage.md
  - Renders RecommendationCard first (most important)
  - Renders ScenarioSummary component (three comparison cards)
  - Renders SnowballChart component (debt balance and interest savings charts)
  - Renders MonthlyBreakdown component (expandable table)
  - Applied responsive layout: grid for inputs (1 col mobile, 2 col desktop), vertical stack for results with space-y-8
  - Proper spacing and visual hierarchy with mb-8, gap-6
  - Test: All components render in correct order, responsive layout verified in code
  - Requirements: REQ-US-1, REQ-US-2, REQ-US-3, REQ-US-4

- [x] 6.3 Create barrel export for snowball components - Completed 2026-01-22
  - Implemented: src/components/snowball/index.ts (updated)
  - Context: context/modules/SnowballMainPage.md
  - Exported SnowballCalculatorPage alongside all existing components
  - All snowball components now accessible via barrel export
  - Test: Components can be imported via barrel export (verified in route page)
  - Requirements: Code organization best practice

### 7. Route Integration

- [x] 7.1 Create route page for snowball calculator - Completed 2026-01-22
  - Implemented: src/app/snjoboltareiknivel/page.tsx
  - Context: context/modules/SnowballMainPage.md
  - Imported SnowballCalculatorPage component
  - Wraps component with CalculatorProvider for context access
  - Inner SnowballCalculatorContent retrieves actualHourlyWage from CalculatorContext results
  - Handles missing wage case (warning shown by SnowballCalculatorPage)
  - Passes wage to SnowballCalculatorPage component as prop
  - Metadata not exported (client component limitation, SEO handled elsewhere)
  - Test: TypeScript compilation passes, route is accessible
  - Requirements: REQ-NFR-5, REQ-NFR-4

- [ ] 7.2 Add navigation link from debt payoff calculator - ALREADY DONE (skip)
  - Note: Navigation link already exists in src/components/debtPayoff/DebtPayoffPage.tsx
  - Lines 468-486 contain the cross-reference card with link to /snjoboltareiknivel
  - Link encodes current debt details as URL query parameter
  - Styled with indigo theme to be discoverable
  - Requirements: REQ-US-5, REQ-FR-7.2

- [x] 7.3 Implement pre-fill logic from query parameters - Completed 2026-01-22
  - Implemented: src/components/snowball/SnowballCalculatorPage.tsx
  - Context: context/modules/SnowballMainPage.md
  - Added useEffect hook to read query parameters on component mount
  - Uses useSearchParams from next/navigation to read 'data' param
  - Parses JSON-encoded loan data with decodeURIComponent and JSON.parse
  - Validates parsed data with Object.keys check and type guards
  - Implemented mapDebtInputToSnowballLoan() helper function for field mapping
  - Handles invalid or missing data gracefully with try-catch (silently ignores)
  - Also pre-fills extraPayment if provided
  - Test: Pre-fill logic verified in code, TypeScript passes
  - Requirements: REQ-US-5, REQ-FR-7.1

### 8. Input Validation and Error Handling

- [ ] 8.1 Implement input validation function
  - In `src/lib/calculations/snowball.ts`, implement `validateSnowballInput()`
  - Validate current balance > 0
  - Validate annual interest rate between 0% and 100%
  - Validate extra payment >= 0
  - Validate expected investment return between 0% and 50%
  - Validate loan term > 0
  - Return validation result with errors array
  - Test: Validation catches all invalid inputs
  - Requirements: REQ-NFR-2

- [ ] 8.2 Add error handling for edge cases
  - In input components, display validation errors inline
  - Handle loan already paid off (balance = 0): show message, disable calculate
  - Handle extra payment > loan balance: cap at remaining balance with warning
  - Handle very high investment return (> 20%): show warning about unrealistic assumptions
  - Handle very long loan term (> 50 years): show warning
  - Add try-catch around calculation with user-friendly error message
  - Test: All edge cases handled gracefully with appropriate messages
  - Requirements: REQ-NFR-2

### 9. Testing and Quality Assurance

- [ ] 9.1 Write component tests for input components
  - Create test file: `src/components/snowball/LoanInputCard.test.tsx`
  - Test all inputs render correctly
  - Test validation displays error messages
  - Test conditional fields show/hide based on loan type
  - Test state updates on input change
  - Create similar tests for ExtraPaymentCard and InvestmentCard
  - Test: All input components have >= 80% test coverage
  - Requirements: Code quality, REQ-NFR-2

- [ ] 9.2 Write component tests for results components
  - Create test file: `src/components/snowball/ScenarioSummary.test.tsx`
  - Test all three scenarios display with correct data
  - Test formatting of monetary values (Icelandic format)
  - Test life energy displays when wage provided
  - Create similar tests for RecommendationCard
  - Test close call badge appears when appropriate
  - Test: Results components have >= 80% test coverage
  - Requirements: Code quality, REQ-NFR-2

- [ ] 9.3 Write integration tests for main page
  - Create test file: `src/components/snowball/SnowballCalculatorPage.test.tsx`
  - Test page renders with default values
  - Test calculation updates when inputs change
  - Test warning displays when actual hourly wage missing
  - Test pre-fill from query parameters works
  - Test all components render together correctly
  - Test debouncing prevents excessive recalculations
  - Test: End-to-end flow works correctly
  - Requirements: REQ-NFR-1, REQ-NFR-4

- [ ] 9.4 Perform accessibility audit
  - Test all form inputs have proper labels
  - Test all interactive elements have focus states
  - Test charts have aria-labels and text alternatives
  - Test color contrast meets WCAG requirements (red #ef4444, green #22c55e)
  - Test keyboard navigation works throughout
  - Test screen reader compatibility
  - Fix any accessibility issues found
  - Test: All WCAG AA standards met
  - Requirements: REQ-NFR-3

### 10. Performance Optimization

- [ ] 10.1 Optimize calculation performance
  - Profile calculation time for 600-month projections
  - Ensure calculations complete in < 500ms
  - Optimize loops and array operations if needed
  - Add memoization for expensive calculations
  - Test: Calculations meet performance requirements
  - Requirements: REQ-NFR-1

- [ ] 10.2 Optimize chart rendering
  - Profile chart render time
  - Ensure charts render within 1 second for 600 months of data
  - Implement data downsampling for very long projections if needed
  - Test with maximum data (600 months)
  - Test: Charts meet performance requirements
  - Requirements: REQ-NFR-1

- [ ] 10.3 Implement table virtualization
  - In MonthlyBreakdown component, add virtualization for tables > 60 rows
  - Use react-window or similar library
  - Maintain smooth scrolling performance
  - Test with maximum data (600 months)
  - Test: Table scrolls smoothly with large datasets
  - Requirements: REQ-NFR-1

### 11. Documentation and Polish

- [ ] 11.1 Add help text and tooltips throughout UI
  - Add "?" icons with tooltips explaining each input field
  - Explain loan type differences (verðtryggð vs óverðtryggð)
  - Explain payment method differences (annuity vs linear)
  - Explain what "snowball effect" means
  - Explain what expected investment return represents
  - All explanations in Icelandic
  - Test: All tooltips display correctly
  - Requirements: REQ-NFR-2

- [ ] 11.2 Add README or user guide documentation
  - Create user-facing documentation explaining the calculator
  - Include example scenarios showing the snowball effect
  - Explain when to use each strategy
  - Document integration with Debt Payoff calculator
  - All documentation in Icelandic
  - Test: Documentation is clear and helpful
  - Requirements: REQ-NFR-2

## Dependencies

**Sequential Dependencies**:
- Task 1.1 must complete before 1.2 (types needed for constants)
- Tasks 1.1-1.2 must complete before Task 2.1 (foundation before calculation logic)
- Task 2.1 must complete before 2.2 (helper function needed by main calculation)
- Task 2.2 must complete before 2.3 (calculation needed before summary)
- Task 2.3 must complete before 2.4 (summary needed for recommendation)
- Tasks 2.1-2.4 must complete before 2.5 (logic must exist before testing)
- Tasks 1.1, 2.2-2.4 must complete before Tasks 3.1-3.3 (types and calculations needed for inputs)
- Tasks 2.2-2.4 must complete before Tasks 4.1-4.2 (results needed for display)
- Task 2.2 must complete before 5.1-5.3 (monthly data needed for visualizations)
- Tasks 3.1-3.3, 4.1-4.2 must complete before 6.1 (input and result components needed for page)
- Tasks 5.1-5.3 must complete before 6.2 (visualization components needed for layout)
- Task 6.1 must complete before 7.1 (page component needed for route)
- Task 7.1 must complete before 7.2 (route must exist before adding navigation)
- Task 6.1 must complete before 7.3 (page component needed for pre-fill logic)
- Tasks 3.1-3.3 must complete before 8.1-8.2 (inputs needed for validation)
- Most tasks must complete before testing tasks 9.1-9.3
- Core functionality must complete before optimization tasks 10.1-10.3

**Parallelization Opportunities**:
- Tasks 3.1, 3.2, 3.3 can be done in parallel (independent input components)
- Tasks 4.1, 4.2 can be done in parallel (independent result components)
- Tasks 5.1, 5.2, 5.3 can be done in parallel after Task 2.2 completes (independent visualizations)
- Tasks 9.1, 9.2 can be done in parallel (independent test suites)
- Tasks 10.1, 10.2, 10.3 can be done in parallel (independent optimizations)
- Task 11.1, 11.2 can be done in parallel (independent polish work)

**Critical Path**:
1. Foundation (1.1, 1.2)
2. Calculation Core (2.1, 2.2, 2.3, 2.4)
3. Main Page Component (6.1)
4. Route Integration (7.1)

This is the minimum path to a working feature. All other tasks enhance the feature but could be deferred if needed.

## Notes

### Optional Worktree

Consider creating an isolated development environment for this feature.

**When to use a worktree**:
- This is a moderately complex feature with 18+ tasks
- Want to experiment without affecting main branch
- Multiple developers working in parallel
- Want isolated ports/database for testing

**How to create**:
```bash
# Use the create_worktree command
/create_worktree snowball-calculator

# Or manually
git worktree add -b feature/snowball-calculator ../pel_web_snowball main
```

**Benefits**:
- Isolated environment for development
- Can switch between main branch and feature work easily
- Separate ports and configuration
- Safe experimentation

**Reference**: `docs/worktree-integration.md`

**Note**: Worktrees are optional. This feature can be implemented directly in the main branch if preferred.

### Technology Notes

**Existing patterns to follow**:
- Components in `src/components/`
- Calculations in `src/lib/calculations/`
- Types in `src/types/`
- Constants in `src/lib/constants/`
- Pages in `src/app/`

**Libraries already in use** (based on debtPayoff.ts):
- TypeScript for type safety
- React for components
- Next.js for routing
- Recharts (likely) for charts

**New dependencies** (if needed):
- react-window or react-virtualized for table virtualization (Task 10.3)

### Implementation Best Practices

1. **Write types first**: Helps clarify data structures before implementation
2. **Test calculations thoroughly**: Financial calculations must be accurate
3. **Use existing patterns**: Follow debtPayoff.ts as a reference for structure
4. **Icelandic throughout**: All UI text, labels, and help text in Icelandic
5. **Life energy prominent**: Make life energy calculations visible and meaningful
6. **Mobile-first**: Design for mobile, enhance for desktop
7. **Accessibility**: Build in from the start, not retrofitted

### Testing Strategy

**Unit Tests** (Tasks 2.5, 9.1-9.2):
- Calculation accuracy
- Edge cases and validation
- Component rendering
- State management

**Integration Tests** (Task 9.3):
- End-to-end user flow
- Component interaction
- Pre-fill functionality
- Performance under load

**Manual Testing**:
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility with screen reader
- Real-world scenarios

**Success Criteria**:
- All unit tests pass
- >= 80% code coverage
- All accessibility checks pass
- Performance benchmarks met
- User testing validates UX
