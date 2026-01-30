# Feature: Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)

## Overview
A calculator that shows the true FI number needed for early retirement in Iceland by accounting for the three-tier pension system (Séreign at 60, Lífeyrissjóður at 62-67, TR at 67). Breaks retirement into phases and shows how much less users need to save compared to traditional FIRE approaches.

## Status
In Progress - Epic 1-7 Complete, Epic 8 Pending (14/18 tasks complete)

## Architecture
Based on phase-based retirement planning with three distinct periods:
1. Gap Period (retirement to 60) - fully self-funded
2. Séreign Bridge (60 to 67) - private pension + savings
3. Full Pension (67+) - all pension sources active

### Key Components (Planned)
- Types: PensionAwareFireState, RetirementPhase, PensionAwareFireResults
- Constants: Icelandic pension system parameters
- Calculations: Phase calculations, present value, FI number adjustments
- State: CalculatorContext integration
- Components: Input forms, timeline visualization, phase breakdown, scenario comparison
- Page: /lifeyristengd-fire route

## Modules

### Completed
- PensionAwareFireTypes - context/modules/PensionAwareFireTypes.md
  - Complete type system (359 lines)
  - All pension inputs modeled
  - Phase structure defined
  - Results and warnings types
  - Scenario comparison types

- PensionAwareFireConstants - context/modules/PensionAwareFireConstants.md
  - Icelandic pension system constants (522 lines)
  - Default values for all inputs
  - Validation ranges
  - Phase colors (4 variants)
  - Warning thresholds
  - 18 helper functions
  - 85 tests (all passing)

- PensionAwareFireCalculations - context/modules/PensionAwareFireCalculations.md
  - Phase calculation engine (842 lines)
  - Main orchestrator (calculateRetirementPhases)
  - Phase calculators (Gap, Bridge, Full Pension)
  - Income & funding calculations
  - TR means-testing (calculateTREstimate, helpers)
  - Séreign projections (calculateProjectedSereign, withdrawal strategy)
  - Present value calculations (complete Epic 3)
  - 119 tests (all passing)
  - Tasks 3.1, 3.2, 3.3, 3.4 complete

- BasicInputs - context/modules/BasicInputs.md
  - Basic financial inputs component (382 lines)
  - Six input fields (age, retirement age, expenses, savings, monthly savings, return)
  - Expense baseline integration with tier selector
  - Blue/indigo gradient theme with summary box
  - 21 tests (all passing)
  - Task 5.1 complete

- PensionEducationalIntro - context/modules/PensionEducationalIntro.md
  - Educational intro component (454 lines)
  - Four comprehensive sections (Why FI too high, Pension system, Three phases, Example)
  - Collapsible sections with expand/collapse all
  - Concrete example showing 106M ISK savings (144M → 38M)
  - Blue/indigo color scheme
  - 21 tests (all passing)
  - Task 5.3 complete

- PensionInputs - context/modules/PensionInputs.md
  - Pension-specific input component (565 lines)
  - Three collapsible sections (Lífeyrissjóður, Séreign, TR)
  - Live séreign projection at age 60
  - Auto-calculated TR estimate with means-testing visualization
  - Quick-fill button with typical values
  - Blue/indigo/purple color scheme
  - 34 tests (all passing)
  - Task 5.2 complete

- PhaseTimeline - context/modules/PhaseTimeline.md
  - Phase timeline visualization component (407 lines)
  - Horizontal timeline bar (desktop) from current age to 90
  - Stacked cards (mobile) for responsive layout
  - Color-coded phases (blue: working, red: gap, amber: séreign bridge, green: full pension)
  - Age markers at key transition points (current, retirement, 60, 67, 90)
  - Duration and funding display for each phase
  - Interactive tooltips with phase details
  - Keyboard navigation and full accessibility support
  - 27 tests (all passing)
  - Task 6.1 complete

- FINumberComparison - context/modules/FINumberComparison.md
  - FI number comparison component (167 lines)
  - Two-column visual comparison (Traditional FI → Pension-Adjusted FI)
  - Savings highlight box (amount, percentage, years earlier)
  - Green success styling with gradient backgrounds
  - Arrow connector (horizontal desktop, vertical mobile)
  - Edge case handling for minimal difference (≤100k ISK)
  - 24 tests (all passing)
  - Task 6.2 complete

- PhaseBreakdown - context/modules/PhaseBreakdown.md
  - Phase breakdown component (419 lines)
  - Detailed view of each retirement phase
  - Income sources breakdown (savings, returns, pensions)
  - Expenses display with monthly total
  - Surplus/deficit indicators (green/red alerts)
  - Funding requirements (start/end balances)
  - Collapsible phase cards with expand/collapse all
  - Color-coded borders (red for gap, amber for bridge, green for full)
  - Transfer text for phase chaining
  - 29 tests (all passing)
  - Task 6.3 complete

- ScenarioComparison - context/modules/PensionScenarioComparison.md
  - Scenario comparison component (427 lines)
  - Save and compare up to 3 retirement scenarios side-by-side
  - Comparison table with 4 key metrics (FI needed, gap years, time to FI, surplus)
  - Best value highlighting (green background, checkmark indicators)
  - Delete scenarios with two-click confirmation (resets after 3 seconds)
  - Empty state with call to action
  - Max 3 scenarios enforcement with message
  - Modal interface for naming scenarios (Enter key support)
  - Blue/green/amber color scheme
  - 52 tests passing (1 skipped timer test)
  - Task 6.4 complete

### Completed (continued)
- PensionAwareFIREPage - context/modules/PensionAwareFIREPage.md
  - Server/client component split (51 lines + 61 lines)
  - Metadata for SEO
  - CalculatorProvider wrapper
  - Suspense boundary with loading skeleton
  - Privacy notice section
  - 5 tests (all passing)

### In Progress
None - Ready for Epic 8 (Polish & Testing)

### Planned
- Main calculator assembly & page (Epic 7)
- Polish & testing (Epic 8)

## Dependencies

### Internal Dependencies
- Expense Baseline Tool (for expense data integration)
- CalculatorContext (state management)
- UI Components (Card, CurrencyInput, Slider, etc.)

### External Dependencies
None (all calculations in-app)

## Testing

### Unit Tests
- [x] Constants - 85 tests passing (Epic 2)
  - All pension ages verified (60, 62, 67)
  - TR means-testing parameters accurate
  - Default values reasonable
  - All helper functions tested
- [x] Calculation functions - 119 tests passing (Epic 3 - complete)
  - [x] Phase calculations (Task 3.1) - 51 tests
  - [x] Present value calculations (Task 3.2) - 25 tests
  - [x] TR means-testing (Task 3.3) - 28 tests
  - [x] Séreign projections (Task 3.4) - 15 tests

### Component Tests
- [x] Educational intro - 21 tests passing (Epic 5 - complete)
  - [x] PensionEducationalIntro (Task 5.3) - 21 tests
- [x] Input components (Epic 5 - complete) - 55 tests passing
  - [x] BasicInputs (Task 5.1) - 21 tests
  - [x] PensionInputs (Task 5.2) - 34 tests
- [x] Results components (Epic 6 - partial) - 24 tests passing
  - [x] FINumberComparison (Task 6.2) - 24 tests
- [ ] Main calculator (Epic 7)

### Integration Tests
- [ ] Full flow (Epic 8)

## Implementation Notes

### 2026-01-30 - Task 1.1 Complete (Epic 1)
- Created comprehensive type definitions (359 lines)
- All types from design document implemented
- TypeScript compilation successful
- Module documentation created
- Ready for constants and calculation implementation

### 2026-01-30 - Task 2.1 Complete (Epic 2)
- Implemented all Icelandic pension system constants (522 lines)
- All pension ages verified: 60 (séreign), 62-72 (lífeyrissjóður), 67 (TR)
- TR means-testing accurate: 36,500 ISK exemption, 45% reduction rate
- Default values appropriate for Iceland: 300k expenses, 5% return, 30x multiplier
- Complete validation ranges for all inputs
- Phase color scheme (working: blue, gap: red, bridge: amber, full: green)
- 18 helper functions (validation, formatting, phase detection)
- 85 comprehensive tests (all passing)
- Educational examples showing 105.5M ISK savings (144M → 38.5M)
- Ready for calculation engine implementation

### 2026-01-30 - Task 3.3 Complete (Epic 3)
- Enhanced TREstimate type with isFullTR and isZeroTR boolean flags
- Implemented calculateTREstimate() - Full TR calculation with detailed breakdown
- Implemented calculateIncomeAboveExemption() - Helper for means-testing
- Implemented calculateTRReduction() - Helper for reduction calculation
- Verified TR rules: 36,500 ISK exemption, 45% reduction rate, 380k max TR
- Confirmed séreign withdrawals do NOT count against TR means-testing
- Full TR detection: lífeyrissjóður below 36,500 ISK
- Zero TR detection: lífeyrissjóður above ~880k ISK
- Handles manual TR overrides (capped at max, floored at zero)
- Added 28 comprehensive tests (79 total tests, all passing)
- Tests cover: boundary conditions, typical scenarios, edge cases
- Matches existing TRMeansTestCalculator logic for compatibility
- Ready for UI integration in Epic 5

### 2026-01-30 - Task 3.4 Complete (Epic 3)
- Implemented calculateProjectedSereign() - Full séreign projection with breakdown
- Implemented calculateSereignWithdrawal60to67() - Optimal withdrawal strategy for bridge
- Enhanced calculateProjectedSereign() to check if lífeyrissjóður starts during bridge (60-67)
- Projection features:
  - Projects balance to age 60 with compound growth and employer match
  - Handles three retirement scenarios (before 60, at 60, after 60)
  - Contributions stop at retirement or 60 (whichever comes first)
  - Pure growth continues from retirement to 60 if retiring early
- Withdrawal strategy:
  - Even withdrawal over 7-year bridge period (60-67)
  - Accounts for other income during bridge (lífeyrissjóður if starts before 67)
  - Month-by-month simulation for accuracy
  - Continued investment growth during withdrawals
  - Sustainable withdrawal rate using PV annuity formula: PV × [r / (1 - (1 + r)^-n)]
- Edge cases: Zero balance, no shortfall, zero return, already past 60
- Added 15 comprehensive tests (94 total tests, all passing)
- Tests cover: All retirement scenarios, withdrawal strategies, edge cases
- Ready for UI integration in Epic 5 (PensionInputs will show live projection)

### 2026-01-30 - Task 5.1 Complete (Epic 5)
- Created BasicInputs component (382 lines)
- Six input fields implemented:
  - Current age (18-70, NumberInput)
  - Target retirement age (currentAge+1 to 80, Slider)
  - Monthly expenses (CurrencyInput with tier selector)
  - Current savings (0-500M ISK, CurrencyInput)
  - Monthly savings (0-2M ISK, CurrencyInput)
  - Investment return (0-15%, Slider with 5% default)
- Expense baseline integration:
  - Auto-detects expense baseline availability
  - Three-tier selector (Barebones 🍃, Comfortable 😊, Deluxe 👑)
  - Visual selection feedback (checkmark, border highlight, shadow)
  - Toggle between baseline and manual entry
  - Success/info alerts for connection status
- UI design:
  - Blue/indigo gradient background (pension theme)
  - Responsive 2-column grid layout
  - Real-time summary box (age, retirement age, expenses, years to FI)
  - Clear Icelandic labels with help text
- Validation:
  - Age constraint: retirement age always > current age
  - All inputs respect PENSION_INPUT_RANGES
- Created 21 comprehensive tests (all passing)
- Test coverage: Rendering, baseline integration, age inputs, expense modes, savings, return, summary, validation
- Context documentation: context/modules/BasicInputs.md
- Follows LeanFIREInputs pattern adapted for pension-aware context
- Ready for integration with PensionInputs (Task 5.2)

### 2026-01-30 - Task 5.2 Complete (Epic 5)
- Created PensionInputs component (565 lines)
- Three collapsible sections with distinct color themes:
  1. Lífeyrissjóður (blue) - Occupational pension inputs with age 62-72 selection
  2. Séreign (indigo) - Private pension with live projection at age 60
  3. TR (purple) - Auto-calculated state pension with means-testing visualization
- Live projection features:
  - Séreign balance at 60 calculated via calculateProjectedSereign()
  - TR estimate with means-testing via calculateTREstimate()
  - Updates automatically as inputs change
- Interactive features:
  - Quick-fill button with typical values (average scenario)
  - Collapsible sections (all expanded by default)
  - Employer match slider with live percentage display
  - Badge indicators (Full TR, Zero TR)
- Educational content:
  - Help text for each section
  - TR means-testing explanation with official link (TR.is)
  - Typical value ranges
- Created 34 comprehensive tests (all passing)
- Test coverage: All inputs, live updates, collapsibility, quick-fill, accessibility
- Context documentation: context/modules/PensionInputs.md
- All labels in Icelandic
- Integrates with CalculatorContext (Task 4.1)
- Uses calculation functions from Tasks 3.3 & 3.4
- Ready for integration into main calculator (Task 7.1)

### 2026-01-30 - Task 5.3 Complete (Epic 5)
- Created PensionEducationalIntro component (454 lines)
- Four comprehensive educational sections:
  1. Why traditional FIRE is too high (explains 25-30x over-saving)
  2. Icelandic pension system (Séreign, Lífeyrissjóður, TR with accurate details)
  3. Three retirement phases (Gap, Bridge, Full - color coded)
  4. Concrete example showing 106M ISK savings (144M → 38M = 73% reduction)
- Interactive features: Collapsible card, individual section expansion, expand/collapse all, dismiss
- Blue/indigo color scheme matching pension/planning theme
- Content accuracy: All pension ages, TR means-testing rules, séreign exclusion verified
- Full accessibility: ARIA labels, keyboard navigation, semantic HTML
- Created 21 comprehensive tests (all passing)
- Test coverage: Rendering, collapsible behavior, section expansion, content accuracy, accessibility
- Context documentation: context/modules/PensionEducationalIntro.md
- Follows LeanFIRE EducationalIntro pattern with pension-specific content
- Ready for integration into main calculator (Task 7.1)

### 2026-01-30 - Task 6.4 Complete (Epic 6)
- Created ScenarioComparison component (427 lines)
- Comparison table features:
  - Save current scenario with custom name (modal interface)
  - Display up to 3 scenarios side-by-side
  - Four key metrics per scenario (FI needed, gap years, time to FI, surplus at 90)
  - Best value highlighting (green background and checkmark)
  - Delete scenarios with two-click confirmation
  - Max 3 scenarios enforcement with message
- Empty state:
  - Informative placeholder when no scenarios saved
  - Call to action when results available
  - Warning when no results available yet
- UI design:
  - Blue/indigo gradient save button
  - Green highlighting for best values
  - Amber warning for max scenarios
  - Red confirmation for delete
  - Responsive table with horizontal scroll
  - Legend explaining highlighting system
  - Info box with comparison tips
- Data persistence:
  - Uses CalculatorContext (savePensionScenario, deletePensionScenario)
  - Persists to localStorage automatically
  - Scenarios include snapshot of inputs + results
- Created 52 comprehensive tests (all passing, 1 skipped)
- Test coverage: Empty state, save, display, delete, max scenarios, accessibility, legend
- Context documentation: context/modules/PensionScenarioComparison.md
- All labels in Icelandic
- Formats ISK with millions (formatISK helper)
- Edge cases: Null values, negative surplus, only 1 scenario, no highlighting
- Ready for integration into main calculator (Task 7.1)

### 2026-01-30 - Task 6.2 Complete (Epic 6)
- Created FINumberComparison component (167 lines)
- Visual comparison features:
  - Two-column layout with arrow connector (horizontal on desktop, vertical on mobile)
  - Traditional FI in gray/neutral styling, Pension-Adjusted FI in green success styling
  - Large 3xl-4xl font sizes for dramatic visual impact
  - Green gradient with ring effect on pension-adjusted column
- Savings highlight box:
  - Amount saved in ISK (large, bold display)
  - Percentage reduction (rounded to whole number, e.g., "73% minni!")
  - Years earlier retirement possible (conditional, 1 decimal)
  - Green gradient background with prominent border and shadow
  - Explanation text about pension benefit
- Edge case handling:
  - 100,000 ISK threshold for "significant difference"
  - Alternative blue info box for minimal difference (retiring at 67+)
  - Conditional rendering for years earlier (only when > 0 and not null)
- Number formatting:
  - Uses formatCurrency() with Icelandic separators (periods)
  - formatPercentage() with 0 decimals for percentages
  - toFixed(1) for years (1 decimal place)
- Responsive design:
  - Desktop: Side-by-side columns with horizontal arrow
  - Mobile: Stacked columns with rotated arrow
- Created 24 comprehensive tests (all passing)
- Test coverage: Rendering, formatting, calculations, edge cases, visual styling, content
- Context documentation: context/modules/FINumberComparison.md
- All text in Icelandic
- Ready for integration into main calculator (Task 7.1)

### 2026-01-30 - Task 7.2 Complete (Epic 7)
- Created Next.js page route at /lifeyristengd-fire
- Two-file architecture:
  - page.tsx (51 lines) - Server component with metadata
  - LifeyristengdFIREClient.tsx (61 lines) - Client component with state
- Metadata implementation:
  - Title: "Lífeyristengd FIRE Reiknivél | Peningaæðalífið"
  - Description: Comprehensive SEO description about pension-aware FI
  - Keywords: FIRE, FI, lífeyrir, séreign, lífeyrissjóður, TR, ellilífeyrir
  - Open Graph tags for social sharing
- Client component features:
  - CalculatorProvider wrapper for global state
  - Suspense boundary with custom loading skeleton
  - Blue/indigo gradient loading theme (matches calculator)
  - Privacy notice section at bottom
- Loading state skeleton:
  - Hero section skeleton (badge + title + subtitle)
  - Content area skeleton (inputs + results grid)
  - Responsive layout (desktop/mobile)
  - Animate-pulse for loading effect
- Created 5 comprehensive tests (all passing)
- Test coverage: Provider, calculator, privacy notice, layout, Suspense
- Context documentation: context/modules/PensionAwareFIREPage.md
- No TypeScript compilation errors
- Route accessible at /lifeyristengd-fire
- Pattern: Follows eftirlaunahermir page structure (server/client split)
- Ready for Task 8.2 (Navigation integration)

### Design Decisions
- **Phase-Based Model**: Discrete phases align with pension access dates (easier to understand)
- **Present Value Approach**: Use investment return as discount rate (simpler, represents opportunity cost)
- **Simplified TR**: Link to official calculator for accuracy (TR rules are complex and change)
- **Even Séreign Withdrawal**: Default strategy from 60-67 (can be enhanced in v2)

### Icelandic Context
- All monetary amounts in ISK
- Pension ages: 60 (Séreign), 62-67 (Lífeyrissjóður), 67 (TR)
- FI multiplier: 30x (Icelandic context, more conservative)
- Life expectancy: 90 (for calculations)

## Progress Tracking

### Epic 1: Foundation Types ✅ COMPLETE (1/1 tasks)
- [x] Task 1.1: Create Type Definitions - 2026-01-30

### Epic 2: Constants & Defaults ✅ COMPLETE (1/1 tasks)
- [x] Task 2.1: Create Constants File - 2026-01-30

### Epic 3: Calculation Engine ✅ COMPLETE (4/4 tasks)
- [x] Task 3.1: Phase Calculation Functions - 2026-01-30
- [x] Task 3.2: Present Value Calculations - 2026-01-30
- [x] Task 3.3: TR Means-Testing Integration - 2026-01-30
- [x] Task 3.4: Séreign Projection Functions - 2026-01-30

### Epic 4: State Management ✅ COMPLETE (1/1 tasks)
- [x] Task 4.1: Context Integration - 2026-01-30
  - Implemented: src/context/CalculatorContext.tsx (+200 lines)
  - Storage: STORAGE_KEY constant added to src/lib/constants/pensionAwareFire.ts
  - Context: context/modules/PensionAwareFireContext.md
  - State initializes with defaults
  - Updates trigger automatic recalculation
  - State persists to localStorage
  - Scenarios can be saved/deleted (max 3)
  - Integration with expense baseline

### Epic 5: Core Input Components ✅ COMPLETE (3/3 tasks)
- [x] Task 5.1: BasicInputs Component - 2026-01-30
- [x] Task 5.2: PensionInputs Component - 2026-01-30
- [x] Task 5.3: PensionEducationalIntro Component - 2026-01-30

### Epic 6: Results Components (1/4 tasks)
- [ ] Task 6.1: PhaseTimeline Component
- [x] Task 6.2: FINumberComparison Component - 2026-01-30
- [ ] Task 6.3: PhaseBreakdown Component
- [ ] Task 6.4: ScenarioComparison Component

### Epic 7: Main Calculator & Page (2/2 tasks) - COMPLETE
- [x] Task 7.1: PensionAwareFIRECalculator Main Component - 2026-01-30
- [x] Task 7.2: Create Page Route - 2026-01-30

### Epic 8: Polish & Testing (0/2 tasks)
- [ ] Task 8.1: Unit Tests for Calculations
- [ ] Task 8.2: Add to Navigation & Calculator Hub

## Success Metrics
- [ ] Users understand why pension-adjusted FI is lower than traditional FI
- [ ] Users know exactly how much to save for each retirement phase
- [ ] Calculator seamlessly uses expense baseline data
- [ ] Educational content clarifies Icelandic pension system
- [ ] Mobile responsive and accessible
- [ ] No console errors
- [ ] Unit tests pass

## Related Documentation
- Requirements: specs/requirements-pension-aware-fire.md
- Design: specs/design-pension-aware-fire.md
- Tasks: specs/tasks-pension-aware-fire.md
