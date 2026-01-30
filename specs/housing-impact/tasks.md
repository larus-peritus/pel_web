# Implementation Tasks: Húsnæðiskostnaður (Housing Impact Calculator)

## Overview

This document breaks down the implementation of the Húsnæðiskostnaður (Housing Impact Calculator) feature into actionable tasks. The feature enables users to calculate the true cost of housing - rent vs buy, loan interest impact, life energy cost, and long-term FI impact.

**Key Features:**
- Support for 3 housing types: Rental, Owned with Loan, Owned Paid Off
- Support for 2 Icelandic loan types: Verðtryggð (indexed) and Óverðtryggð (non-indexed)
- Comprehensive cost calculations (rent/loan + property tax + insurance + maintenance + utilities)
- Life energy calculations (monthly cost as hours of life)
- Future value (FI impact) projections at 7% return
- Comparison of up to 4 different housing scenarios
- Dedicated "Rent vs Buy" analysis when applicable
- Refinance analysis when comparing loan scenarios
- Integration with actualHourlyWage from main calculator
- localStorage persistence

**Requirements Coverage:**
- NS-1: Enter housing information
- NS-2: See real monthly and yearly cost
- NS-3: See life energy cost
- NS-4: See FI impact
- NS-5: Compare housing options
- NS-6: Rent vs buy analysis
- NS-7: Refinance analysis

**Total Tasks:** 26 tasks across 7 major components

## Implementation Strategy

**Chosen Strategy:** Hybrid (Foundation + Feature Slice)

**Rationale:** This feature builds on existing infrastructure (CalculatorContext, UI components, calculation utilities) but introduces new domain logic (housing costs, loan calculations for Icelandic indexed/non-indexed loans). The hybrid approach allows us to:

1. **Start with Foundation** (Tasks 1-2): Create types and calculation functions first to ensure correctness
2. **Build Core Feature** (Tasks 3-5): Implement validation, context extensions, and localStorage
3. **Build UI Components** (Tasks 6-8): Form, summary, and comparison components
4. **Add Special Analysis** (Tasks 9-10): Rent vs buy and refinance analysis components
5. **Integration** (Task 11): Wire everything together in main container
6. **Testing** (Tasks 12-13): Comprehensive unit and component tests

**Sequencing Logic:**
- Bottom-up: Pure functions (types, calculations) before components
- Dependencies respected: Forms need validation, summary needs calculations
- Early value: Single scenario works before comparison
- Testing integrated: Unit tests after calculations, component tests after UI

**Parallel Opportunities:**
- Tasks 6, 7, 8 can be done in parallel (all depend on 1-5 but not each other)
- Tasks 9 and 10 can be done in parallel
- Testing tasks can be distributed across developers

## Task List

### Epic 1: Foundation - Types and Data Models

#### Task 1.1: Create TypeScript types and interfaces

**Objective:** Define all TypeScript types for housing calculator

**Files to create/modify:**
- `/types/calculator.ts` (extend existing file)

**Functionality:**
- [ ] `HousingScenario` interface (id, name, inputs, results, createdAt, updatedAt, isCurrent)
- [ ] `HousingInputs` type with discriminated union based on `housingType`
- [ ] `HousingType` type union: 'rental' | 'owned_with_loan' | 'owned_paid_off'
- [ ] `RentalDetails` interface (monthlyRent, heatIncluded, electricityIncluded, costs)
- [ ] `LoanDetails` interface with `loanType` discriminator
- [ ] `LoanType` type union: 'indexed' | 'non_indexed'
- [ ] `OwnedPaidOffDetails` interface (estimatedPropertyValue optional, ownership costs)
- [ ] `HousingResults` interface (cost breakdown, loanInfo optional, life energy, FV)
- [ ] `HOUSING_TYPE_LABELS` constant (Icelandic labels)
- [ ] `LOAN_TYPE_LABELS` constant (Icelandic labels)
- [ ] Extend `StoredState` interface to include `housingScenarios: HousingScenario[]`
- [ ] Extend `CalculatorContextType` (deferred to Task 3.2)

**Tests:**
- TypeScript compilation passes
- No type errors

**Requirements:** NS-1, NS-2, NS-3, NS-4, NS-5, NS-6, NS-7

**Dependencies:** None

**Estimated time:** 2-3 hours

---

### Epic 2: Calculation Logic

#### Task 2.1: Implement loan calculation functions

**Objective:** Create loan calculation functions for Icelandic indexed and non-indexed loans

**Files to create:**
- `/lib/calculations/housing.ts`

**Functionality:**
- [ ] `calculateLoanPayment(loanDetails: LoanDetails): LoanInfo`
  - For non-indexed loans: Standard amortization formula
  - For indexed loans: Simplified (interest + inflation) formula
  - Return monthlyPayment, totalPaymentsOverLife, totalInterestPaid, interestPercentage
- [ ] Helper: `calculateStandardLoan(principal, annualRate, termYears)` - standard amortization
- [ ] Helper: `calculateIndexedLoan(principal, annualRate, inflation, termYears)` - indexed loan
- [ ] Handle edge cases: Very short/long terms, high interest rates, 0% inflation

**Tests:**
- Unit tests: Standard loan calculation with known values
- Unit tests: Indexed loan calculation with known values
- Unit tests: Edge cases (1 year, 40 years, high rates, 0% inflation)

**Requirements:** NS-2.2

**Dependencies:** Task 1.1

**Estimated time:** 3-4 hours

---

#### Task 2.2: Implement housing cost calculation functions

**Objective:** Calculate total housing costs for all housing types

**Files to modify:**
- `/lib/calculations/housing.ts`

**Functionality:**
- [ ] `calculateHousingResults(inputs: HousingInputs, actualHourlyWage: number): HousingResults`
  - Main function that routes to specific calculators
- [ ] `calculateRentalCosts(rental: RentalDetails): CostBreakdown`
  - Monthly rent + heat (if not included) + electricity (if not included)
- [ ] `calculateOwnedWithLoanCosts(loan: LoanDetails): CostBreakdown`
  - Loan payment (from Task 2.1) + property tax/12 + insurance/12 + maintenance/12 + HOA + heat + electricity
- [ ] `calculateOwnedPaidOffCosts(ownedPaidOff: OwnedPaidOffDetails): CostBreakdown`
  - Property tax/12 + insurance/12 + maintenance/12 + HOA + heat + electricity
  - Optional opportunity cost if estimatedPropertyValue provided
- [ ] `calculateLifeEnergy(monthlyCost: number, actualHourlyWage: number)`
  - Monthly hours, yearly hours, yearly days, work days, work weeks
  - Handle division by zero (return 0)
- [ ] Reuse `calculateFutureValue()` for 5, 10, 20 year projections

**Tests:**
- Unit tests: Rental cost calculation
- Unit tests: Owned with loan cost calculation
- Unit tests: Owned paid off cost calculation
- Unit tests: Life energy calculation
- Unit tests: Division by zero handling

**Requirements:** NS-2, NS-3, NS-4

**Dependencies:** Task 1.1, Task 2.1

**Estimated time:** 3-4 hours

---

#### Task 2.3: Implement comparison and analysis functions

**Objective:** Create helper functions for comparing scenarios and rent vs buy analysis

**Files to modify:**
- `/lib/calculations/housing.ts`

**Functionality:**
- [ ] `identifyBestAndWorst(scenarios: HousingScenario[])`
  - Return indices of cheapest and most expensive scenarios
- [ ] `calculateSavings(scenario1: HousingScenario, scenario2: HousingScenario)`
  - Monthly savings, yearly savings, life energy savings
- [ ] `calculateRentVsBuyBreakeven(rentalScenario: HousingScenario, ownedScenario: HousingScenario)`
  - Simplified breakeven calculation (years until owned is cheaper)
- [ ] `calculateRefinanceSavings(currentLoan: HousingScenario, newLoan: HousingScenario, refinanceCost: number)`
  - Monthly savings, total interest savings, breakeven months
- [ ] `generateHousingId()` - unique ID generator

**Tests:**
- Unit tests: Best/worst identification
- Unit tests: Savings calculation
- Unit tests: Rent vs buy breakeven
- Unit tests: Refinance analysis

**Requirements:** NS-5, NS-6, NS-7

**Dependencies:** Task 1.1, Task 2.2

**Estimated time:** 2-3 hours

---

### Epic 3: Validation and Business Logic

#### Task 3.1: Implement input validation functions

**Objective:** Validate all housing inputs with Icelandic error messages

**Files to create:**
- `/lib/validation/housing.ts`

**Functionality:**
- [ ] `validateHousingInputs(inputs: Partial<HousingInputs>): ValidationResult`
  - Validate housingType required
  - Conditional validation based on housingType
- [ ] `validateRentalDetails(rental: Partial<RentalDetails>)`
  - monthlyRent: > 0, <= 1,000,000
  - Heat/electricity costs: >= 0 (required if not included)
- [ ] `validateLoanDetails(loan: Partial<LoanDetails>)`
  - totalLoanAmount: > 0, <= 500,000,000
  - annualInterestRate: > 0, <= 20
  - loanTermYears: 1-40, integer
  - annualInflationRate: required if indexed, > 0, <= 20
  - All ownership costs: >= 0
- [ ] `validateOwnedPaidOffDetails(ownedPaidOff: Partial<OwnedPaidOffDetails>)`
  - estimatedPropertyValue: optional, >= 0
  - All ownership costs: >= 0
- [ ] `validateScenarioName(name: string)` - 1-50 characters
- [ ] All error messages in Icelandic

**Tests:**
- Unit tests: All validation rules
- Unit tests: Conditional validation
- Unit tests: Error messages in Icelandic

**Requirements:** NS-1

**Dependencies:** Task 1.1

**Estimated time:** 2-3 hours

---

#### Task 3.2: Extend CalculatorContext for housing scenarios

**Objective:** Add housing scenario management to CalculatorContext

**Files to modify:**
- `/context/CalculatorContext.tsx` (or relevant context file)
- `/types/calculator.ts`

**Functionality:**
- [ ] Add `housingScenarios: HousingScenario[]` to state
- [ ] `addHousingScenario(scenario: Omit<HousingScenario, 'id' | 'results'>)`
  - Validate max 4 scenarios
  - Generate ID
  - Calculate results using calculateHousingResults()
  - Add to state
  - Throw error if >= 4 scenarios (Icelandic message)
- [ ] `updateHousingScenario(id: string, updates: Partial<HousingScenario>)`
  - Recalculate results on update
- [ ] `deleteHousingScenario(id: string)`
  - Remove scenario
- [ ] `duplicateHousingScenario(id: string)`
  - Create copy with new ID
- [ ] Auto-recalculation when actualHourlyWage changes
- [ ] Export CalculatorContextType with housing methods

**Tests:**
- Integration tests: Add/update/delete/duplicate scenarios
- Integration tests: Max 4 scenarios enforcement
- Integration tests: Auto-recalculation on actualHourlyWage change

**Requirements:** NS-1, NS-5

**Dependencies:** Task 1.1, Task 2.2, Task 3.1

**Estimated time:** 2-3 hours

---

#### Task 3.3: Implement localStorage persistence for housing scenarios

**Objective:** Extend localStorage save/load to include housing scenarios

**Files to modify:**
- `/context/CalculatorContext.tsx` (or relevant file)

**Functionality:**
- [ ] Extend StoredState save to include `housingScenarios`
- [ ] Extend load to include `housingScenarios` with backwards compatibility
- [ ] 500ms debounce auto-save (integrated with existing pattern)
- [ ] Export/Import includes housing scenarios
- [ ] resetAll() clears housing scenarios
- [ ] Use existing `safeSetItem` and `safeGetItem` for error handling

**Tests:**
- Integration tests: Save/load housing scenarios
- Integration tests: Backwards compatibility
- Integration tests: Export/import

**Requirements:** NS-1.6

**Dependencies:** Task 3.2

**Estimated time:** <1 hour (integrated with 3.2)

---

### Epic 4: Form Component

#### Task 4.1: Create HousingForm component

**Objective:** Build dynamic form for housing input with conditional fields

**Files to create:**
- `/components/housing/HousingForm.tsx`

**Functionality:**
- [ ] Props: `mode: 'add' | 'edit'`, `scenario?: HousingScenario`, `onSave`, `onCancel`
- [ ] **Step 1: Housing type selector** (rental, owned_with_loan, owned_paid_off)
- [ ] **Conditional rendering based on housingType:**
  - **Rental fields:**
    - monthlyRent (number input)
    - heatIncluded (checkbox)
    - electricityIncluded (checkbox)
    - monthlyHeatCost (number, hidden if included)
    - monthlyElectricityCost (number, hidden if included)
  - **Owned with loan fields:**
    - loanType selector (indexed, non_indexed)
    - totalLoanAmount (number)
    - annualInterestRate (number, %)
    - loanTermYears (number)
    - annualInflationRate (number, %, shown only if indexed)
    - annualPropertyTax (number)
    - annualHomeInsurance (number)
    - annualMaintenanceCost (number)
    - monthlyHOAFees (number)
    - monthlyHeatCost (number)
    - monthlyElectricityCost (number)
  - **Owned paid off fields:**
    - estimatedPropertyValue (number, optional)
    - annualPropertyTax (number)
    - annualHomeInsurance (number)
    - annualMaintenanceCost (number)
    - monthlyHOAFees (number)
    - monthlyHeatCost (number)
    - monthlyElectricityCost (number)
- [ ] Real-time validation with error display
- [ ] Save/Cancel buttons
- [ ] All labels in Icelandic

**Tests:**
- Component tests: Renders housing type selector
- Component tests: Conditional field rendering for each type
- Component tests: Loan type conditional (indexed/non-indexed)
- Component tests: Validation and error display
- Component tests: Form submission

**Requirements:** NS-1

**Dependencies:** Task 1.1, Task 3.1

**Estimated time:** 4-5 hours

---

#### Task 4.2: Create barrel export

**Objective:** Export housing components for easy importing

**Files to create:**
- `/components/housing/index.ts`

**Functionality:**
- [ ] Export HousingForm and HousingFormProps
- [ ] Export other components as they are created

**Requirements:** All

**Dependencies:** Task 4.1

**Estimated time:** <15 minutes

---

### Epic 5: Display Components

#### Task 5.1: Create HousingSummary component

**Objective:** Display comprehensive results for a single housing scenario

**Files to create:**
- `/components/housing/HousingSummary.tsx`

**Functionality:**
- [ ] Props: `scenario: HousingScenario`, `actualHourlyWage: number`, `className?`
- [ ] **Cost section:**
  - Monthly housing payment (rent or loan)
  - Monthly breakdown (property tax, insurance, maintenance, HOA, heat, electricity)
  - Total monthly cost (emphasized)
  - Total yearly cost
- [ ] **Loan info section** (if owned_with_loan):
  - Monthly loan payment
  - Total interest paid over life
  - Interest percentage of total payments
  - Warning if interest > 40%
  - Warning for indexed loans about inflation
- [ ] **Life energy section:**
  - Monthly hours
  - Yearly hours, days, work days, work weeks
  - Impactful message if > 160 hours/month
  - Warning if actualHourlyWage === 0
- [ ] **FI impact section:**
  - Future value 5, 10, 20 years
  - Impactful messaging about opportunity cost
- [ ] **Opportunity cost section** (if owned_paid_off with estimatedPropertyValue):
  - Monthly opportunity cost
  - Explanation message
- [ ] Color-coded sections (primary, warning, success)
- [ ] All text in Icelandic

**Tests:**
- Component tests: Cost display for rental
- Component tests: Cost display for loan
- Component tests: Loan info display
- Component tests: Life energy display
- Component tests: FI impact display
- Component tests: Opportunity cost display
- Component tests: Warnings display

**Requirements:** NS-2, NS-3, NS-4

**Dependencies:** Task 1.1, Task 2.2

**Estimated time:** 3-4 hours

---

#### Task 5.2: Create HousingComparison component

**Objective:** Side-by-side comparison of 2-4 housing scenarios

**Files to create:**
- `/components/housing/HousingComparison.tsx`

**Functionality:**
- [ ] Props: `scenarios: HousingScenario[]`, `actualHourlyWage: number`, `className?`
- [ ] Empty state for < 2 scenarios
- [ ] **Desktop table view** (≥1024px):
  - Columns: Name, Type (icon), Monthly Cost, Life Energy/month, FV (10 yr), Total Interest (if loan), Difference
  - Color-coded badges (green=best, red=worst)
- [ ] **Mobile card view** (<1024px):
  - Stacked scenario cards with same information
- [ ] Identify best and worst scenarios
- [ ] Calculate savings message: "Með því að skipta úr [worst] yfir í [best]..."
- [ ] Conditional life energy column (hidden if actualHourlyWage === 0)
- [ ] All text in Icelandic

**Tests:**
- Component tests: Empty state
- Component tests: Desktop table rendering
- Component tests: Mobile card rendering
- Component tests: Best/worst identification
- Component tests: Savings calculation
- Component tests: Responsive layout

**Requirements:** NS-5

**Dependencies:** Task 1.1, Task 2.2, Task 2.3

**Estimated time:** 3-4 hours

---

#### Task 5.3: Update housing barrel export

**Objective:** Export new display components

**Files to modify:**
- `/components/housing/index.ts`

**Functionality:**
- [ ] Export HousingSummary and HousingSummaryProps
- [ ] Export HousingComparison and HousingComparisonProps

**Requirements:** NS-2, NS-3, NS-4, NS-5

**Dependencies:** Task 5.1, Task 5.2

**Estimated time:** <5 minutes

---

### Epic 6: Special Analysis Components

#### Task 6.1: Create RentVsBuyAnalysis component

**Objective:** Dedicated component for rent vs buy comparison

**Files to create:**
- `/components/housing/RentVsBuyAnalysis.tsx`

**Functionality:**
- [ ] Props: `rentalScenarios: HousingScenario[]`, `ownedScenarios: HousingScenario[]`, `actualHourlyWage: number`, `className?`
- [ ] Select cheapest rental and cheapest owned scenario for comparison
- [ ] **Monthly cost comparison:**
  - Rental monthly cost
  - Owned monthly cost
  - Difference (highlighted)
- [ ] **Breakeven calculation:**
  - Years until owned is cheaper (simplified)
  - Explanation of breakeven
- [ ] **Pros and cons lists:**
  - Rental: Sveigjanleiki, lægri upphafskostnaður, enginn viðhald
  - Owned: Eigið fé safnast, langtímastöðugleiki, hægt að endurbæta
- [ ] **Future value comparison:**
  - FV of monthly difference if invested
- [ ] **Disclaimer:**
  - "Þessi greining miðast eingöngu við fjárhagslegan kostnað..."
- [ ] All text in Icelandic

**Tests:**
- Component tests: Renders when rental and owned present
- Component tests: Selects cheapest scenarios
- Component tests: Monthly cost comparison
- Component tests: Breakeven calculation
- Component tests: Pros/cons display
- Component tests: Disclaimer

**Requirements:** NS-6

**Dependencies:** Task 1.1, Task 2.2, Task 2.3

**Estimated time:** 2-3 hours

---

#### Task 6.2: Create RefinanceAnalysis component (Optional)

**Objective:** Show refinance analysis when comparing loan scenarios

**Files to create:**
- `/components/housing/RefinanceAnalysis.tsx`

**Functionality:**
- [ ] Props: `currentLoanScenario: HousingScenario`, `newLoanScenario: HousingScenario`, `refinanceCost?: number`, `className?`
- [ ] Input for refinance cost (optional, default 0)
- [ ] **Current vs New loan comparison:**
  - Monthly payment
  - Total interest
  - Difference
- [ ] **Savings calculation:**
  - Monthly savings
  - Total interest savings
  - Breakeven months (if refinance cost provided)
- [ ] **Recommendation:**
  - "Endurfjármögnun borgar sig eftir X mánuði"
  - Warning if refinance cost is high
- [ ] All text in Icelandic

**Tests:**
- Component tests: Renders comparison
- Component tests: Savings calculation
- Component tests: Breakeven calculation
- Component tests: High cost warning

**Requirements:** NS-7

**Dependencies:** Task 1.1, Task 2.2, Task 2.3

**Estimated time:** 2 hours (Optional - can defer to future)

---

#### Task 6.3: Update housing barrel export

**Objective:** Export analysis components

**Files to modify:**
- `/components/housing/index.ts`

**Functionality:**
- [ ] Export RentVsBuyAnalysis and RentVsBuyAnalysisProps
- [ ] Export RefinanceAnalysis and RefinanceAnalysisProps (if implemented)

**Requirements:** NS-6, NS-7

**Dependencies:** Task 6.1, Task 6.2

**Estimated time:** <5 minutes

---

### Epic 7: Integration and Main Container

#### Task 7.1: Create HousingCalculator main container component

**Objective:** Main container that orchestrates all child components

**Files to create:**
- `/components/housing/HousingCalculator.tsx`

**Functionality:**
- [ ] Props: `className?`
- [ ] Use `useCalculator()` hook for context access
- [ ] **Accordion pattern for scenario list** (following Commute pattern):
  - Expandable/collapsible scenarios
  - Show HousingForm when editing, HousingSummary when expanded
  - Delete with inline confirmation
  - Duplicate action (disabled at 4 scenarios)
- [ ] **"Bæta við sviðsmynd" button** (disabled when 4 scenarios exist)
- [ ] **View toggle: "Sviðsmyndir" vs "Samanburður"**
- [ ] **Alert if actualHourlyWage === 0** with link to main calculator
- [ ] **Info alert when max scenarios reached**
- [ ] **Trigger RentVsBuyAnalysis** when >= 1 rental and >= 1 owned_with_loan
- [ ] **Trigger RefinanceAnalysis** (optional) when 2 owned_with_loan with different rates
- [ ] **Empty states:**
  - No scenarios: "Búðu til fyrstu sviðsmynd..."
  - Comparison with < 2: "Búðu til að minnsta kosti 2 sviðsmyndir..."
- [ ] Local state management for view mode, form, expanded scenarios, deletion confirmation
- [ ] Error handling with user-friendly alerts
- [ ] All UI text in Icelandic

**Tests:**
- Component tests: Renders scenario list
- Component tests: Add/edit/delete/duplicate actions
- Component tests: Max scenarios enforcement
- Component tests: View toggle
- Component tests: actualHourlyWage warning
- Component tests: Rent vs buy trigger logic
- Manual tests: CRUD operations, navigation

**Requirements:** All NS requirements (integration)

**Dependencies:** Tasks 3.2, 4.1, 5.1, 5.2, 6.1

**Estimated time:** 3-4 hours

---

#### Task 7.2: Update housing barrel export (final)

**Objective:** Export main container

**Files to modify:**
- `/components/housing/index.ts`

**Functionality:**
- [ ] Export HousingCalculator and HousingCalculatorProps

**Requirements:** All

**Dependencies:** Task 7.1

**Estimated time:** <5 minutes

---

#### Task 7.3: Add housing calculator to main app navigation/routing

**Objective:** Integrate housing calculator into main app

**Files to modify:**
- `/components/calculator/CalculatorPageContent.tsx` (or relevant routing file)

**Functionality:**
- [ ] Import HousingCalculator
- [ ] Update EXPENSE_CALCULATORS config to set housing-impact `available: true`
- [ ] Create HousingCalculatorContent component (following Commute pattern):
  - Hero section with title, description, back button
  - HousingCalculator wrapped in Section/Container layout
- [ ] Integrate into ExpenseImpactContent routing
- [ ] Verify navigation works

**Tests:**
- Manual tests: Navigation to housing calculator
- Manual tests: Calculator loads and renders correctly
- Manual tests: Back button navigation

**Requirements:** All NS requirements (integration)

**Dependencies:** Task 7.2

**Estimated time:** 30-45 minutes

---

### Epic 8: Testing

#### Task 8.1: Write unit tests for calculations and validation

**Objective:** 100% test coverage for calculation and validation functions

**Files to create:**
- `/lib/calculations/__tests__/housing.test.ts`
- `/lib/validation/__tests__/housing.test.ts`

**Functionality:**
- [ ] **Loan calculation tests:**
  - Standard loan (known values, edge cases)
  - Indexed loan (known values, different inflation rates, 0% inflation)
  - Edge cases (1 year, 40 years, high rates)
- [ ] **Cost calculation tests:**
  - Rental costs (with/without included utilities)
  - Owned with loan costs (all components)
  - Owned paid off costs (with/without opportunity cost)
  - Life energy calculations (with/without actualHourlyWage)
  - Future value calculations
- [ ] **Comparison tests:**
  - Best/worst identification
  - Savings calculation
  - Rent vs buy breakeven
  - Refinance analysis
- [ ] **Validation tests:**
  - All field validations
  - Conditional validations
  - Error messages in Icelandic
- [ ] Run: `npm test housing.test.ts`

**Requirements:** All (calculation correctness)

**Dependencies:** Tasks 2.1, 2.2, 2.3, 3.1

**Estimated time:** 4-5 hours

---

#### Task 8.2: Write component tests

**Objective:** 80%+ test coverage for React components

**Files to create:**
- `/components/housing/__tests__/HousingForm.test.tsx`
- `/components/housing/__tests__/HousingSummary.test.tsx`
- `/components/housing/__tests__/HousingComparison.test.tsx`
- `/components/housing/__tests__/RentVsBuyAnalysis.test.tsx`
- `/components/housing/__tests__/HousingCalculator.test.tsx`

**Functionality:**
- [ ] **HousingForm tests:**
  - Renders housing type selector
  - Conditional rendering for each type
  - Loan type conditional (indexed/non-indexed)
  - Validation and error display
  - Form submission (onSave, onCancel)
- [ ] **HousingSummary tests:**
  - Cost display for rental
  - Cost display for loan (with loan info)
  - Life energy display (with/without actualHourlyWage)
  - FI impact display
  - Opportunity cost display
  - Warnings display (indexed, high interest)
- [ ] **HousingComparison tests:**
  - Empty state
  - Table rendering with 2-4 scenarios
  - Best/worst identification
  - Savings calculation
  - Responsive layout (desktop/mobile)
- [ ] **RentVsBuyAnalysis tests:**
  - Renders when applicable
  - Monthly cost comparison
  - Breakeven calculation
  - Pros/cons display
  - Disclaimer
- [ ] **HousingCalculator tests:**
  - Scenario CRUD operations
  - Max 4 scenarios enforcement
  - View toggle
  - actualHourlyWage warning
  - Rent vs buy trigger
- [ ] Run: `npm test -- --coverage`

**Requirements:** All (UI correctness)

**Dependencies:** Tasks 4.1, 5.1, 5.2, 6.1, 7.1

**Estimated time:** 5-6 hours

---

#### Task 8.3: Manual testing and accessibility audit

**Objective:** Verify full user experience and accessibility compliance

**Manual test flows:**
1. [ ] Create first rental scenario
2. [ ] Create owned with loan scenario (non-indexed)
3. [ ] Create owned with loan scenario (indexed)
4. [ ] Create owned paid off scenario
5. [ ] Edit existing scenario
6. [ ] Delete scenario (with confirmation)
7. [ ] Compare 2-4 scenarios
8. [ ] Verify rent vs buy analysis appears
9. [ ] All housing types and loan types

**Responsive design:**
- [ ] Desktop (1440px) - all features work
- [ ] Tablet (768px) - layout adapts
- [ ] Mobile (375px) - stacked layout, touch-friendly

**Browser compatibility:**
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

**Accessibility audit:**
- [ ] Run axe DevTools for automated checks
- [ ] Keyboard-only navigation test
- [ ] Screen reader test (VoiceOver or NVDA)
- [ ] Color contrast verification (≥4.5:1)
- [ ] Focus indicators visible
- [ ] Error messages accessible

**Icelandic content:**
- [ ] All labels in Icelandic
- [ ] Currency formatting (50.000 kr)
- [ ] Numbers formatted correctly
- [ ] Error messages in Icelandic

**Edge cases:**
- [ ] actualHourlyWage = 0
- [ ] Very high loan (>100,000,000 kr)
- [ ] Very high interest (>10%)
- [ ] Very long loan term (>30 years)
- [ ] 0% inflation for indexed loan
- [ ] localStorage full
- [ ] Corrupt localStorage data

**Document any bugs found**

**Requirements:** Non-functional requirements (accessibility, performance, UX)

**Dependencies:** Task 7.3

**Estimated time:** 3-4 hours

---

#### Task 8.4: Performance testing

**Objective:** Verify performance meets requirements

**Tests:**
- [ ] Loan calculation performance: < 50ms
- [ ] Housing results calculation performance: < 50ms
- [ ] Rendering performance: < 100ms for scenario switching
- [ ] With 4 scenarios loaded: ensure no lag or jank
- [ ] localStorage operations: ensure debounce working (500ms)
- [ ] Test on older devices (if available): 5-year-old laptop, mobile device
- [ ] Use Chrome DevTools Performance tab for profiling
- [ ] Document any performance issues

**Requirements:** Performance requirements

**Dependencies:** Task 7.3

**Estimated time:** 1-2 hours

---

## Dependencies

### Task Dependencies

**Sequential Dependencies:**
- Task 2.1 depends on 1.1 (loan calculations need types)
- Task 2.2 depends on 1.1, 2.1 (cost calculations need types and loan functions)
- Task 2.3 depends on 1.1, 2.2 (comparison needs types and results)
- Task 3.1 depends on 1.1 (validation needs types)
- Task 3.2 depends on 1.1, 2.2, 3.1 (context needs types, calculations, validation)
- Task 3.3 depends on 3.2 (persistence needs context)
- Task 4.1 depends on 1.1, 3.1 (form needs types and validation)
- Task 4.2 depends on 4.1 (barrel export needs form)
- Task 5.1 depends on 1.1, 2.2 (summary needs types and calculations)
- Task 5.2 depends on 1.1, 2.2, 2.3 (comparison needs types, calculations, comparison functions)
- Task 5.3 depends on 5.1, 5.2 (barrel export needs components)
- Task 6.1 depends on 1.1, 2.2, 2.3 (rent vs buy needs types and functions)
- Task 6.2 depends on 1.1, 2.2, 2.3 (refinance needs types and functions)
- Task 6.3 depends on 6.1, 6.2 (barrel export needs components)
- Task 7.1 depends on 3.2, 4.1, 5.1, 5.2, 6.1 (container needs all child components)
- Task 7.2 depends on 7.1 (barrel export needs container)
- Task 7.3 depends on 7.2 (routing needs exported container)
- Task 8.1 depends on 2.1, 2.2, 2.3, 3.1 (tests need implementation)
- Task 8.2 depends on 4.1, 5.1, 5.2, 6.1, 7.1 (component tests need components)
- Task 8.3 depends on 7.3 (manual testing needs full integration)
- Task 8.4 depends on 7.3 (performance testing needs full integration)

**Parallel Opportunities:**
- Tasks 2.1, 2.2, 2.3 can be done in parallel after 1.1 (different calculation domains)
- Tasks 4.1, 5.1, 5.2 can be done in parallel after 1.1, 2.2, 3.1 are complete
- Tasks 6.1 and 6.2 can be done in parallel (independent analysis components)
- Tasks 8.1 and 8.2 can be done in parallel (different test types)
- Tasks 8.3 and 8.4 can be done in parallel (both integration-level tests)

**Critical Path:**
1.1 → 2.1 → 2.2 → 3.1 → 3.2 → 4.1 → 7.1 → 7.3 → 8.3

This represents the minimum sequence needed to get a working feature. Other tasks can happen in parallel with this path.

---

## Notes

### Implementation Guidelines

**Code Organization:**
- All new types go in existing `/types/calculator.ts` (extend existing file)
- Calculations in new `/lib/calculations/housing.ts`
- Validation in new `/lib/validation/housing.ts`
- Components in new `/components/housing/` directory
- Tests alongside implementation files in `__tests__/` subdirectories

**Reusable Code:**
This feature reuses significant infrastructure from the existing app:
- `CalculatorContext` for state management (extend, don't replace)
- `formatCurrency()`, `formatNumber()`, `formatLifeEnergy()` utilities
- `calculateFutureValue()` function (already exists for subscriptions and commute)
- `dollarsToLifeEnergy()` function
- UI components: `Card`, `Input`, `Select`, `Button`, `Alert`, `Dialog`, `Checkbox`
- localStorage patterns from existing features

**Icelandic Content:**
All user-facing text must be in Icelandic:
- Form labels and placeholders
- Error messages
- Button text
- Section headings
- Help text and tooltips
- Currency format: "50.000 kr" (period as thousands separator, space before kr)
- Loan type labels: "Verðtryggt lán", "Óverðtryggt lán"
- Housing type labels: "Leiguhúsnæði", "Eignarhúsnæði með láni", "Eignarhúsnæði greitt upp"

**Accessibility Requirements:**
- All inputs must have associated `<label>` elements
- Error messages must use `aria-describedby` and `role="alert"`
- Buttons must be keyboard-accessible (Tab, Enter, Space)
- Focus indicators must be visible
- Color contrast ≥4.5:1 for all text
- Screen reader tested with VoiceOver or NVDA

**Testing Strategy:**
- Write unit tests as you implement calculations (Task 8.1 can happen alongside 2.x)
- Write component tests as you build components (Task 8.2 can happen alongside 4.x, 5.x, 6.x, 7.x)
- Manual testing and accessibility audit should happen last (Tasks 8.3, 8.4)
- Aim for 85%+ overall code coverage

---

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

---

### Common Pitfalls to Avoid

1. **Don't duplicate formatting functions**: Reuse existing `formatCurrency()` etc.
2. **Don't hardcode colors**: Use Tailwind color system for consistency
3. **Don't skip validation**: Every input must be validated before calculation
4. **Don't forget edge cases**: Handle division by zero, missing actualHourlyWage, very high values
5. **Don't skip accessibility**: ARIA labels and keyboard navigation are required, not optional
6. **Don't use English text**: All user-facing text must be Icelandic
7. **Don't exceed 4 scenarios**: Enforce limit in both validation and UI
8. **Don't oversimplify loan calculations**: Test with real values to ensure accuracy

---

### Development Tips

**Start Simple:**
- Get a basic rental scenario working end-to-end before adding loan types
- Test loan calculations manually with known values before writing tests
- Build UI incrementally: form first, then summary, then comparison

**Loan Calculation Tips:**
- Standard loan formula: `P * (r * (1+r)^n) / ((1+r)^n - 1)` where r is monthly rate
- Indexed loan (simplified): Use `(interest + inflation)` as combined rate
- Test with real Icelandic loan examples to verify accuracy
- Consider using online loan calculators for verification

**Debugging:**
- Use browser DevTools React extension to inspect CalculatorContext state
- Add console.log in calculations during development (remove before commit)
- Test localStorage with DevTools Application tab
- Verify loan calculations with pen and paper or spreadsheet

**Performance:**
- Loan calculations should be fast enough without memoization
- Use React.memo() only if profiling shows re-render issues
- The 500ms debounce on auto-save prevents localStorage thrashing

---

### Reference Files

**Design patterns to follow:**
- Look at Commute Calculator for accordion pattern examples
- Check existing validation functions for error message patterns
- Review CalculatorContext for state management patterns
- Study Subscription Burn Meter for comparison patterns

**Key design decisions:**
- See `design.md` section "Hönnunarákvarðanir" for architectural decisions
- Maximum 4 scenarios (explained in design doc)
- Two loan types support (indexed and non-indexed)
- Hybrid implementation strategy (foundation first, then features)

**Loan calculation formulas:**
- See requirements.md for detailed loan formulas
- Standard amortization formula documented
- Indexed loan simplified approach explained
- Example calculations provided for verification

---

### Success Criteria

The feature is complete when:
- [ ] All 26 implementation tasks are done
- [ ] User can create, edit, delete, and compare housing scenarios
- [ ] All three housing types work (rental, owned with loan, owned paid off)
- [ ] Both loan types work (indexed, non-indexed)
- [ ] All calculations are accurate (verified by unit tests)
- [ ] Rent vs buy analysis appears when applicable
- [ ] UI is responsive on desktop, tablet, and mobile
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] All user-facing text is in Icelandic
- [ ] localStorage persistence works correctly
- [ ] Integration with CalculatorContext is seamless

**Ready for production when:**
- [ ] Code review completed
- [ ] All tests passing (unit, component, integration)
- [ ] Manual testing completed on all target browsers
- [ ] Accessibility verified with screen reader
- [ ] Performance meets requirements (<50ms calculations, <100ms renders)
- [ ] Loan calculations verified against real examples
- [ ] Documentation updated (if applicable)

---

## Implementation Status

**Completed Tasks:** 0/26

**Current Phase:** Foundation (Epic 1)

**Next Task:** 1.1 - Create TypeScript types and interfaces

**Blockers:** None

**Notes:** Ready to start implementation following the task sequence.
