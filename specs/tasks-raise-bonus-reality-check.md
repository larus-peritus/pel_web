# Tasks: Raise/Bonus Reality Check

**Feature ID**: 2.3.2
**Status**: Draft
**Created**: 2026-01-22
**Requirements**: `requirements-raise-bonus-reality-check.md`
**Design**: `design-raise-bonus-reality-check.md`

---

## Implementation Strategy

**Approach**: Foundation-First
**Rationale**: Build core tax and FI calculation engines first (independently testable), then layer on UI components that consume these calculations.

**Sequencing Principles**:
1. Data layer → Calculation logic → Components
2. Core functionality → Enhanced features
3. Each task is independently testable
4. Tasks respect dependencies (no blockers)

**Task Sizing**: 2-6 hours each
**Total Estimate**: ~32-48 hours (4-6 days)

---

## Task Hierarchy

### Epic 1: Foundation (Types & Constants)
- Task 1.1: Type Definitions
- Task 1.2: Tax Constants & Municipality Data

### Epic 2: Calculation Engine
- Task 2.1: Icelandic Tax Calculator
- Task 2.2: FI Timeline Calculator
- Task 2.3: Raise Results Orchestrator
- Task 2.4: Summary & Warning Generator

### Epic 3: Validation & Utilities
- Task 3.1: Input Validation
- Task 3.2: Formatting Utilities

### Epic 4: Core Components
- Task 4.1: RaiseForm Component
- Task 4.2: RaiseSummary Component
- Task 4.3: ComparisonTable Component
- Task 4.4: RaiseCalculator Container

### Epic 5: Integration
- Task 5.1: Extend CalculatorContext
- Task 5.2: Storage Integration
- Task 5.3: Main App Integration

### Epic 6: Testing & Polish
- Task 6.1: Comprehensive Testing
- Task 6.2: Accessibility Audit
- Task 6.3: Documentation

---

## Epic 1: Foundation (Types & Constants)

### Task 1.1: Type Definitions

**Objective**: Create TypeScript type definitions for all raise-related data structures

**Files to Create**:
- `src/types/raise.ts`

**Functionality**:
- Define `Municipality` interface
- Define `TaxConfig` and `TaxBracket` interfaces
- Define `RaiseInputs` interface with FI context
- Define `TaxResults`, `FIResults`, `LifeEnergyResults` interfaces
- Define `RaiseResults` and `BonusResults` interfaces
- Define `RaiseSummary` interface
- Define `RaiseScenario` interface
- Define `ComparisonMetric` interface
- Export all types

**Tests**:
- TypeScript compilation succeeds
- All types properly exported
- No circular dependencies

**Requirements Traceability**:
- REQ-CALC-001: Tax calculation types
- REQ-CALC-002: FI calculation types
- REQ-CALC-003: Life energy types
- REQ-CALC-004: Bonus types
- REQ-CALC-005: Scenario types

**Acceptance Criteria**:
- ✅ All interfaces defined with JSDoc comments
- ✅ Types align with design document
- ✅ Barrel export from `src/types/index.ts`

**Estimated Time**: 2 hours

---

### Task 1.2: Tax Constants & Municipality Data

**Objective**: Create constant data for Icelandic tax system and municipalities

**Files to Create**:
- `src/lib/constants/icelandicTax.ts`

**Functionality**:
- Define `TAX_CONFIG_2026` constant with:
  - Personal credit (70,950 kr/month)
  - National tax brackets
  - Pension rates (4% employee, 8% employer)
- Define `MUNICIPALITIES` array with top 20 municipalities:
  - Reykjavík (14.48%)
  - Kópavogur (13.13%)
  - Seltjarnarnes (13.13%)
  - Garðabær (12.53%)
  - Hafnarfjörður (13.68%)
  - Reykjanesbær (14.45%)
  - Mosfellsbær (13.31%)
  - Akranes (14.52%)
  - Akureyri (14.52%)
  - ...and 11 more
  - "Annað" option for manual override
- Define `FI_DEFAULTS` constant (7% return, 4% SWR, 50 weeks/year)

**Tests**:
- Verify all tax rates are current (2026)
- Verify municipality count (20 + manual option)
- Verify FI defaults match 4% rule

**Requirements Traceability**:
- US-6: Icelandic tax nuances
- Section 11: Icelandic Tax Context

**Acceptance Criteria**:
- ✅ Tax config verified against Skatturinn.is
- ✅ Municipality rates verified against Samband Íslenskra Sveitarfélaga
- ✅ Constants exported and importable

**Estimated Time**: 2 hours (including research/verification)

---

## Epic 2: Calculation Engine

### Task 2.1: Icelandic Tax Calculator

**Objective**: Implement accurate Icelandic income tax calculations

**Files to Create**:
- `src/lib/calculations/icelandicTax.ts`
- `src/lib/calculations/__tests__/icelandicTax.test.ts`

**Functionality**:
- `calculateIcelandicTax(grossAnnual, utsvarRate, includePension, taxConfig): TaxResults`
  - Deduct employee pension if enabled (4%)
  - Calculate taxable income
  - Apply progressive national tax brackets
  - Apply flat municipal tax (útsvar)
  - Apply personal tax credit (70,950 kr/month max)
  - Calculate net income
  - Calculate effective tax rate
- `calculateMarginalRate(monthlyIncome, utsvarRate, taxConfig): number`
  - Find applicable tax bracket
  - Return marginal rate (national + municipal)
- Helper functions:
  - `findTaxBracket(monthlyIncome, brackets): TaxBracket`
  - `calculateNationalTax(monthlyTaxable, brackets): number`

**Tests** (15+ test cases):
1. Low income (below personal credit)
2. Middle income (first bracket)
3. High income (second bracket)
4. Income at bracket boundary
5. With and without pension deduction
6. Different útsvar rates (12%, 14%, 15%)
7. Edge cases: zero income, negative income (should error)
8. Marginal rate calculation accuracy
9. Tax credit application (doesn't exceed total tax)
10. Multiple bracket crossing

**Requirements Traceability**:
- REQ-CALC-001: After-tax calculation
- NFR-001: Accuracy
- US-6: Icelandic tax nuances

**Acceptance Criteria**:
- ✅ All tax calculations accurate to ISK (no rounding errors until final display)
- ✅ Marginal rates correctly identify bracket
- ✅ Personal credit never exceeds total tax
- ✅ Test coverage >95%

**Estimated Time**: 4 hours

---

### Task 2.2: FI Timeline Calculator

**Objective**: Calculate years to financial independence using compound interest math

**Files to Create**:
- `src/lib/calculations/fiCalculations.ts`
- `src/lib/calculations/__tests__/fiCalculations.test.ts`

**Functionality**:
- `calculateYearsToFI(annualExpenses, annualSavings, currentPortfolio, expectedReturn): number`
  - Calculate FI number (25× annual expenses)
  - Use logarithmic formula for compound growth
  - Handle edge cases (already FI, negative savings)
  - Return fractional years
- `calculateFINumber(annualExpenses): number`
  - Simple 25× multiplication for 4% rule
- `calculateFutureValue(principal, annualContribution, years, rate): number`
  - Compound interest with contributions
  - Used for bonus vs raise comparison
- `compareFIImpact(currentNetAnnual, proposedNetAnnual, fiContext): FIResults`
  - Calculate years to FI for both scenarios
  - Calculate acceleration in months
  - Calculate annual savings difference
  - Return complete FI comparison

**Tests** (12+ test cases):
1. Zero starting portfolio, positive savings
2. Existing portfolio, positive savings
3. Already at FI (return 0)
4. Negative savings (return Infinity)
5. Zero savings (return Infinity)
6. Very high savings rate (< 1 year to FI)
7. Low savings rate (> 30 years to FI)
8. Future value with no contributions
9. Future value with contributions
10. FI comparison with acceleration
11. FI comparison with delay (lifestyle inflation)
12. Edge case: FI number = current portfolio

**Requirements Traceability**:
- REQ-CALC-002: FI date impact
- US-2: FI timeline impact
- US-5: Lifestyle inflation warning

**Acceptance Criteria**:
- ✅ Years to FI formula matches "Your Money or Your Life" methodology
- ✅ Edge cases handled gracefully (no crashes)
- ✅ Compound interest calculations accurate
- ✅ Test coverage >90%

**Estimated Time**: 4 hours

---

### Task 2.3: Raise Results Orchestrator

**Objective**: Orchestrate all calculations and produce complete raise analysis

**Files to Create**:
- `src/lib/calculations/raiseCalculations.ts`
- `src/lib/calculations/__tests__/raiseCalculations.test.ts`

**Functionality**:
- `calculateRaiseResults(inputs, actualHourlyWage): RaiseResults`
  - Get útsvar rate from municipality or custom input
  - Calculate tax for current salary (using icelandicTax.ts)
  - Calculate tax for proposed salary
  - Calculate income differences (gross and net)
  - Calculate effective tax rate on increase
  - If FI context provided, calculate FI impact (using fiCalculations.ts)
  - Calculate life energy results:
    - Current true hourly wage = currentNetAnnual / (currentWorkHours × 50)
    - Proposed true hourly wage = proposedNetAnnual / (proposedWorkHours × 50)
    - Hourly wage change and percentage
    - Annual life energy gain from FI acceleration
  - Generate summary and warnings
- `calculateBonusResults(inputs, actualHourlyWage): BonusResults`
  - Extend raise calculation with bonus-specific logic
  - Calculate after-tax bonus (marginal rate)
  - Calculate equivalent annual raise
  - 5-year comparison (investing bonus vs raise savings)
  - Determine better option
- Helper: `getUtsvarRate(inputs): number`
  - Lookup municipality or use custom rate

**Tests** (10+ test cases):
1. Basic raise calculation (no FI context)
2. Raise with FI context
3. Raise with work hours change
4. Raise crossing tax bracket
5. Small raise (< 5%) → warning
6. Large raise (> 30%) → high tax warning
7. Bonus calculation
8. Bonus vs raise comparison
9. Zero actualHourlyWage → error handling
10. Lifestyle inflation scenario (savings rate drops)

**Requirements Traceability**:
- REQ-CALC-001, REQ-CALC-002, REQ-CALC-003, REQ-CALC-004
- US-1, US-2, US-3, US-4

**Acceptance Criteria**:
- ✅ Complete results object with all fields populated
- ✅ Correct delegation to tax and FI calculators
- ✅ Life energy calculations use existing `lifeEnergy.ts`
- ✅ Test coverage >85%

**Estimated Time**: 5 hours

---

### Task 2.4: Summary & Warning Generator

**Objective**: Generate plain language Icelandic summaries and contextual warnings

**Files to Create**:
- `src/lib/calculations/raiseSummary.ts`
- `src/lib/calculations/__tests__/raiseSummary.test.ts`

**Functionality**:
- `generateRaiseSummary(results, inputs): RaiseSummary`
  - Create headline: "Þú færð X kr/mánuð aukalega eftir skatta"
  - If FI impact: "FI dagsetning færist X mánuðum nær/fjær"
  - Life energy: "Þetta er jafngildir X klukkustundum af frelsi á ári"
  - Hourly wage: "Raunveruleg tímakaup þín hækka/lækka um X kr"
- `generateWarnings(results, inputs): string[]`
  - High tax rate warning (>40%): "XX% af hækkuninni fer í skatta"
  - Small increase warning (<5%): "Lítil raunveruleg hækkun - athugaðu heildarlaun"
  - Negative hourly wage warning: "Tímakaup þín lækka þrátt fyrir launahækkun"
  - Lifestyle inflation warning (if savings rate drops): "Varúð: Lífsstílsverðbólga - engin FI ávinningur"
  - Tax bracket warning: "Hækkunin færir þig í hærra skattþrep (XX% jaðarskattur)"
  - FI delay warning (if acceleration is negative): "Þetta seinkir FI dagsetningu þinni"

**Tests** (8+ test cases):
1. Standard raise summary
2. Raise with FI acceleration
3. Raise with FI delay
4. High tax rate warning
5. Small increase warning
6. Negative hourly wage warning
7. Multiple warnings
8. Bonus summary

**Requirements Traceability**:
- Section 9: UI/UX Requirements - Plain Language Summary
- NFR-003: Localization

**Acceptance Criteria**:
- ✅ All summaries in grammatically correct Icelandic
- ✅ Warnings trigger at correct thresholds
- ✅ Summary is concise (< 100 characters per line)
- ✅ Test coverage >90%

**Estimated Time**: 3 hours

---

## Epic 3: Validation & Utilities

### Task 3.1: Input Validation

**Objective**: Validate raise inputs with helpful Icelandic error messages

**Files to Create**:
- `src/lib/validation/raiseValidation.ts`
- `src/lib/validation/__tests__/raiseValidation.test.ts`

**Functionality**:
- `validateRaiseInputs(inputs): RaiseValidationResult`
  - Validate current gross annual (> 0)
  - Validate proposed gross annual (> 0, ≠ current)
  - Validate custom útsvar (12-15% if provided)
  - Validate work hours (1-100)
  - Validate FI context if provided:
    - Annual expenses > 0
    - Savings rate 0-100%
    - Portfolio ≥ 0
    - Expected return 0-20%
  - Validate bonus amount if mode = bonus (> 0)
  - Return errors map with field keys and Icelandic messages

**Tests** (12+ test cases):
1. Valid inputs (no errors)
2. Zero current salary → error
3. Negative salary → error
4. Equal salaries → error
5. Invalid útsvar (< 12%) → error
6. Invalid útsvar (> 15%) → error
7. Invalid work hours → error
8. Invalid FI context fields → errors
9. Missing bonus amount in bonus mode → error
10. Valid FI context (no errors)
11. Multiple errors at once
12. Edge case: boundary values (exactly 12%, 15%, etc.)

**Requirements Traceability**:
- All REQ-CALC requirements validation sections
- Section 7: Constraints and Assumptions

**Acceptance Criteria**:
- ✅ All validation rules from design implemented
- ✅ Error messages in Icelandic
- ✅ Returns all errors, not just first
- ✅ Test coverage >95%

**Estimated Time**: 2 hours

---

### Task 3.2: Formatting Utilities

**Objective**: Create Icelandic number formatting utilities

**Files to Create**:
- `src/lib/utils/icelandicFormat.ts`
- `src/lib/utils/__tests__/icelandicFormat.test.ts`

**Functionality**:
- `formatISK(amount: number): string`
  - Format with dot thousand separator
  - No decimals
  - " kr" suffix
  - Example: "1.234.567 kr"
- `formatPercent(value: number): string`
  - Format with comma decimal separator
  - 0-1 decimal places
  - "%" suffix
  - Example: "42,5%"
- `formatDuration(months: number): string`
  - Format as "X ár Y mánuðir"
  - Handle singular/plural
  - Examples: "1 ár", "2 ár 3 mánuðir", "8 mánuðir"
- `formatHours(hours: number): string`
  - Reuse existing `formatLifeEnergy()` from lifeEnergy.ts
  - Or create wrapper with Icelandic labels

**Tests** (10+ test cases):
1. Format small ISK amount (< 1000)
2. Format large ISK amount (> 1M)
3. Format negative ISK (edge case)
4. Format percent with decimal
5. Format whole percent
6. Format duration years only
7. Format duration months only
8. Format duration years + months
9. Format negative duration (edge case)
10. Format hours (various ranges)

**Requirements Traceability**:
- NFR-003: Localization
- Section 12: Localization - Number Formatting

**Acceptance Criteria**:
- ✅ ISK formatting matches Icelandic standards
- ✅ Percent uses comma (not period) for decimals
- ✅ Duration has proper singular/plural grammar
- ✅ Test coverage >90%

**Estimated Time**: 2 hours

---

## Epic 4: Core Components

### Task 4.1: RaiseForm Component

**Objective**: Create input form for raise/bonus calculations

**Files to Create**:
- `src/components/raise/RaiseForm.tsx`
- `src/components/raise/__tests__/RaiseForm.test.tsx`

**Functionality**:
- Controlled form with React state
- Sections:
  1. Mode toggle (Raise | Bonus radio buttons)
  2. Current Situation:
     - Gross annual salary (CurrencyInput)
     - Work hours per week (number input)
     - Municipality (select dropdown)
     - Custom útsvar (number input, if municipality = "Annað")
  3. Proposed Situation:
     - Gross annual salary OR bonus amount (CurrencyInput)
     - Work hours per week (number input with "Same as current" checkbox)
  4. FI Context (collapsible accordion):
     - Annual expenses (CurrencyInput)
     - Savings rate (Slider 0-100%)
     - Current portfolio (CurrencyInput)
     - Expected return (number input, default 7%)
- Real-time validation with debounce (300ms)
- Display inline errors below fields
- Calculate and submit on button click
- Cancel button (if editing)

**Props**:
```typescript
interface RaiseFormProps {
  initialInputs?: RaiseInputs;
  onSubmit: (inputs: RaiseInputs, results: RaiseResults) => void;
  onCancel: () => void;
  actualHourlyWage: number;
}
```

**Tests** (12+ test cases):
1. Render with default values
2. Render with initialInputs (edit mode)
3. Mode toggle switches UI
4. Municipality selection updates útsvar
5. "Same hours" checkbox works
6. FI context accordion toggles
7. Validation errors display
8. Submit with valid data calls onSubmit
9. Submit with invalid data shows errors
10. Cancel button calls onCancel
11. Debounced validation works
12. Zero actualHourlyWage shows alert

**Requirements Traceability**:
- Section 9: UI/UX Requirements - Form Layout
- US-1, US-2, US-3, US-4

**Acceptance Criteria**:
- ✅ All form fields render correctly
- ✅ Validation provides immediate feedback
- ✅ Mobile-responsive (inputs stack on small screens)
- ✅ Accessible (labels, ARIA attributes)

**Estimated Time**: 6 hours

---

### Task 4.2: RaiseSummary Component

**Objective**: Display raise calculation results in plain language

**Files to Create**:
- `src/components/raise/RaiseSummary.tsx`
- `src/components/raise/__tests__/RaiseSummary.test.tsx`

**Functionality**:
- Display headline summary (bold, large)
- Display key metrics in grid:
  - After-tax monthly increase
  - Effective tax rate on increase
  - FI acceleration (if applicable)
  - Annual savings increase (if applicable)
  - True hourly wage change
  - Life energy gain (hours/year)
- Collapsible "Tax Breakdown" accordion:
  - Current tax vs Proposed tax comparison table
  - Show national tax, municipal tax, personal credit, net
- Display warnings (Alert component with warning variant)
- Support expanded/collapsed states (for accordion in scenario list)

**Props**:
```typescript
interface RaiseSummaryProps {
  scenario: RaiseScenario;
  isExpanded?: boolean;
}
```

**Tests** (8+ test cases):
1. Render with complete results
2. Render without FI impact
3. Render warnings
4. Render without warnings
5. Tax breakdown accordion toggles
6. Metric cards display correct values
7. Formatting uses Icelandic format
8. Icons render for each metric

**Requirements Traceability**:
- Section 9: UI/UX Requirements - Results Display
- US-1, US-2, US-3

**Acceptance Criteria**:
- ✅ Results display in plain Icelandic
- ✅ Metrics use semantic HTML (not just divs)
- ✅ Warnings are visually distinct
- ✅ Responsive on mobile

**Estimated Time**: 4 hours

---

### Task 4.3: ComparisonTable Component

**Objective**: Display 2-4 scenarios side-by-side with best values highlighted

**Files to Create**:
- `src/components/raise/ComparisonTable.tsx`
- `src/components/raise/__tests__/ComparisonTable.test.tsx`

**Functionality**:
- Render responsive table (horizontal scroll on mobile)
- Columns: Metric name | Scenario 1 | Scenario 2 | Scenario 3 | Scenario 4
- Rows (metrics):
  - Scenario name (editable on click)
  - Gross annual salary
  - Net monthly income
  - After-tax monthly gain
  - FI acceleration (if applicable)
  - True hourly wage
  - Work hours per week
- Highlight best value per row:
  - Higher is better: net income, after-tax gain, FI acceleration, hourly wage
  - Lower is better: work hours
- Green background + icon for best value
- Handle 2, 3, or 4 scenarios (responsive column count)

**Props**:
```typescript
interface ComparisonTableProps {
  scenarios: RaiseScenario[];  // 2-4 scenarios
}
```

**Tests** (8+ test cases):
1. Render with 2 scenarios
2. Render with 4 scenarios
3. Best values highlighted correctly
4. Responsive on mobile (scrolls)
5. Scenario names editable
6. Handle missing FI data (shows "N/A")
7. Formatting uses Icelandic format
8. Empty scenarios array (edge case)

**Requirements Traceability**:
- Section 9: UI/UX Requirements - Scenario Comparison View
- US-5: Compare multiple scenarios

**Acceptance Criteria**:
- ✅ Table is readable on mobile (horizontal scroll)
- ✅ Best values clearly highlighted
- ✅ All metrics display with correct formatting
- ✅ Accessible (th/td elements, proper headers)

**Estimated Time**: 4 hours

---

### Task 4.4: RaiseCalculator Container

**Objective**: Main container component integrating all raise sub-components

**Files to Create**:
- `src/components/raise/RaiseCalculator.tsx`
- `src/components/raise/index.ts` (barrel export)
- `src/components/raise/__tests__/RaiseCalculator.test.tsx`

**Functionality**:
- Tab navigation (Scenarios | Comparison)
- Scenarios view:
  - "Add Scenario" button (disabled if 4 scenarios exist)
  - Scenario accordion list:
    - Collapsed: Show scenario name + RaiseSummary
    - Expanded: Show RaiseForm for editing
  - Delete scenario with confirmation
  - Duplicate scenario action
- Comparison view:
  - Show ComparisonTable (only if 2+ scenarios)
  - If < 2 scenarios: Show message "Bættu við að minnsta kosti 2 atburðarásum til að bera saman"
- Alert if actualHourlyWage === 0:
  - "Vinsamlegast reiknaðu þitt raunverulega tímakaup fyrst"
  - Link to main calculator

**Props**:
```typescript
interface RaiseCalculatorProps {
  className?: string;
}
```

**State**:
```typescript
const [viewMode, setViewMode] = useState<'scenarios' | 'comparison'>('scenarios');
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingScenario, setEditingScenario] = useState<RaiseScenario | null>(null);
```

**Integration**:
```typescript
const {
  raiseScenarios,
  addRaiseScenario,
  updateRaiseScenario,
  deleteRaiseScenario,
  duplicateRaiseScenario,
  results,  // For actualHourlyWage
} = useCalculator();
```

**Tests** (10+ test cases):
1. Render empty state (0 scenarios)
2. Add first scenario
3. Edit existing scenario
4. Delete scenario (with confirmation)
5. Duplicate scenario
6. Switch tabs (scenarios ↔ comparison)
7. Comparison disabled with < 2 scenarios
8. Max 4 scenarios (add button disabled)
9. Wage alert shows if actualHourlyWage = 0
10. Accordion expand/collapse

**Requirements Traceability**:
- Section 2: System Architecture - Component Hierarchy
- US-5: Compare multiple scenarios
- REQ-CALC-005: Scenario comparison

**Acceptance Criteria**:
- ✅ All sub-components integrate smoothly
- ✅ State management is clean (no prop drilling)
- ✅ Follows existing calculator pattern (Commute, Housing)
- ✅ Accessible navigation (keyboard, screen reader)

**Estimated Time**: 5 hours

---

## Epic 5: Integration

### Task 5.1: Extend CalculatorContext

**Objective**: Add raise scenario management to CalculatorContext

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
- Add state: `raiseScenarios: RaiseScenario[]`
- Add methods:
  - `addRaiseScenario(inputs, results, name)`
  - `updateRaiseScenario(id, inputs, results)`
  - `deleteRaiseScenario(id)`
  - `duplicateRaiseScenario(id)`
- Export methods in context value
- Load raise scenarios from localStorage on mount
- Save raise scenarios to localStorage on change

**Tests**:
- Extend existing CalculatorContext tests
- Test each new method
- Test persistence (load/save)

**Requirements Traceability**:
- REQ-CALC-005: Scenario comparison
- Section 6: Context Integration

**Acceptance Criteria**:
- ✅ Methods follow existing pattern (commute/housing scenarios)
- ✅ State updates trigger re-renders
- ✅ Persistence works (survives page reload)

**Estimated Time**: 3 hours

---

### Task 5.2: Storage Integration

**Objective**: Integrate raise scenarios into export/import system

**Files to Modify**:
- `src/lib/storage/exportImport.ts`
- `src/types/calculator.ts` (extend StoredState)

**Functionality**:
- Add `raiseScenarios?: RaiseScenario[]` to StoredState interface
- Update `exportData()` to include raise scenarios
- Update `importData()` to handle raise scenarios
- Backward compatibility: Optional field (existing exports still work)

**Tests**:
- Export includes raise scenarios
- Import loads raise scenarios
- Import without raise scenarios doesn't crash
- Version migration (if needed)

**Requirements Traceability**:
- NFR-004: Privacy (export/import)
- Section 10: Testing Strategy

**Acceptance Criteria**:
- ✅ Export JSON includes raise scenarios
- ✅ Import from JSON restores raise scenarios
- ✅ Backward compatible with existing exports

**Estimated Time**: 2 hours

---

### Task 5.3: Main App Integration

**Objective**: Add RaiseCalculator to main app navigation/pages

**Files to Modify/Create**:
- `src/app/raise-calculator/page.tsx` (new page)
- `src/components/layout/Navigation.tsx` (add link)

**Functionality**:
- Create Next.js page at `/raise-calculator`
- Add page metadata (title, description in Icelandic)
- Render RaiseCalculator component wrapped in PageLayout
- Add navigation link in main menu
- Add to app sitemap/navigation

**Tests**:
- Page renders without errors
- Navigation link works
- Page metadata correct
- Mobile navigation includes link

**Requirements Traceability**:
- Section 1: Design Overview - Architecture Summary
- App Plan: Feature 2.3.2

**Acceptance Criteria**:
- ✅ Page accessible at /raise-calculator
- ✅ Navigation includes "Launahækkun" or similar Icelandic label
- ✅ Page follows existing layout pattern

**Estimated Time**: 2 hours

---

## Epic 6: Testing & Polish

### Task 6.1: Comprehensive Testing

**Objective**: Ensure all components and calculations are thoroughly tested

**Files to Create/Update**:
- All `__tests__` files created in previous tasks
- Integration test file: `tests/integration/raiseCalculator.test.tsx`

**Functionality**:
- Run all unit tests (aim for >90% coverage)
- Create integration test:
  1. Load page
  2. Add first scenario (valid inputs)
  3. See results
  4. Save scenario
  5. Add second scenario
  6. Switch to comparison tab
  7. Verify comparison table
  8. Edit first scenario
  9. Delete second scenario
  10. Export data
  11. Import data
- Test edge cases:
  - Zero actualHourlyWage
  - Max scenarios (4)
  - Invalid inputs
  - Storage quota exceeded
- Test accessibility:
  - Keyboard navigation
  - Screen reader announcements
  - Focus management

**Requirements Traceability**:
- Section 10: Testing Strategy
- All NFR requirements

**Acceptance Criteria**:
- ✅ All unit tests passing
- ✅ Integration test passing
- ✅ Code coverage >90%
- ✅ No TypeScript errors
- ✅ No console errors in dev mode

**Estimated Time**: 4 hours

---

### Task 6.2: Accessibility Audit

**Objective**: Ensure WCAG 2.1 AA compliance

**Files to Check**:
- All component files in `src/components/raise/`

**Functionality**:
- Run automated accessibility checks (axe-core)
- Manual checks:
  - Keyboard navigation (tab order, enter/space)
  - Screen reader testing (VoiceOver/NVDA)
  - Color contrast (4.5:1 for text, 3:1 for UI)
  - Focus indicators visible
  - Form labels and error messages
  - ARIA attributes correct
- Fix any issues found

**Requirements Traceability**:
- NFR-006: Accessibility
- Section 11: Accessibility

**Acceptance Criteria**:
- ✅ No automated accessibility violations
- ✅ Full keyboard navigation works
- ✅ Screen reader can complete full workflow
- ✅ Color contrast meets WCAG AA

**Estimated Time**: 3 hours

---

### Task 6.3: Documentation

**Objective**: Document the feature for developers and users

**Files to Create**:
- `src/components/raise/README.md`
- Update: `docs/features/raise-calculator.md`
- Update: `CHANGELOG.md`

**Functionality**:
- Component README:
  - Purpose and overview
  - Usage examples
  - Props documentation
  - Architecture notes
- Feature docs:
  - User guide (Icelandic)
  - How to use each section
  - Interpreting results
  - FAQ
- Changelog entry:
  - Feature: Raise/Bonus Reality Check
  - List new components
  - Note dependencies

**Requirements Traceability**:
- Section 16: Success Metrics

**Acceptance Criteria**:
- ✅ README explains component architecture
- ✅ User docs in Icelandic
- ✅ Changelog updated

**Estimated Time**: 2 hours

---

## Summary

### Task Count by Epic
- Epic 1: Foundation - 2 tasks (4 hours)
- Epic 2: Calculation Engine - 4 tasks (16 hours)
- Epic 3: Validation & Utilities - 2 tasks (4 hours)
- Epic 4: Core Components - 4 tasks (19 hours)
- Epic 5: Integration - 3 tasks (7 hours)
- Epic 6: Testing & Polish - 3 tasks (9 hours)

**Total**: 18 tasks, 59 hours (~7-8 days)

### Dependency Graph
```
Epic 1 (Foundation)
  ↓
Epic 2 (Calculations) + Epic 3 (Validation)
  ↓
Epic 4 (Components)
  ↓
Epic 5 (Integration)
  ↓
Epic 6 (Testing & Polish)
```

### Critical Path
1. Task 1.1 (Types) → Task 1.2 (Constants)
2. Task 2.1 (Tax Calc) → Task 2.2 (FI Calc) → Task 2.3 (Orchestrator)
3. Task 4.1 (Form) → Task 4.2 (Summary) → Task 4.4 (Container)
4. Task 5.1 (Context) → Task 5.3 (App Integration)
5. Task 6.1 (Testing) → Task 6.2 (A11y) → Task 6.3 (Docs)

### Parallel Work Opportunities
- Tasks 2.1 and 2.2 can be worked on simultaneously (different files, no overlap)
- Tasks 3.1 and 3.2 can be parallel
- Tasks 4.1, 4.2, 4.3 can be developed in parallel once Epic 2 is complete
- Epic 6 tasks can overlap (testing while polishing)

### Recommended Sprint Plan

**Sprint 1 (16 hours)**: Foundation + Calculations
- Day 1: Tasks 1.1, 1.2, 2.1
- Day 2: Tasks 2.2, 2.3
- Day 3: Tasks 2.4, 3.1, 3.2

**Sprint 2 (20 hours)**: Components
- Day 4: Task 4.1
- Day 5: Tasks 4.2, 4.3
- Day 6: Task 4.4

**Sprint 3 (16 hours)**: Integration + Testing
- Day 7: Tasks 5.1, 5.2
- Day 8: Tasks 5.3, 6.1
- Day 9: Tasks 6.2, 6.3

---

## Testing Checkpoints

After each epic:

**Epic 1**: Verify types compile, constants importable
**Epic 2**: All calculation tests pass, manual verification against real tax scenarios
**Epic 3**: Validation catches all invalid inputs, formatting matches Icelandic standards
**Epic 4**: Components render, forms submit, results display correctly
**Epic 5**: Full app workflow works, data persists
**Epic 6**: All tests pass, accessibility verified, docs complete

---

## Definition of Done

A task is complete when:
- ✅ Code written and follows project conventions
- ✅ TypeScript types are correct (no `any`)
- ✅ Tests written and passing (unit + integration)
- ✅ Code reviewed (self-review minimum)
- ✅ Documentation updated (inline comments + README)
- ✅ Accessibility verified (if UI component)
- ✅ Requirements traced (comments reference REQ-XXX)
- ✅ No console errors or warnings
- ✅ Committed to version control

---

**Document Status**: ✅ Complete
**Ready for**: Implementation
**Estimated Timeline**: 7-9 working days
**Risk Level**: Low (established patterns, clear requirements)
