# Tasks: Housing Impact Calculator (Húsnæðiskostnaðarmælir)

## Overview

**Feature Name:** Housing Impact Calculator
**Version:** 1.0
**Status:** Ready for Implementation
**Created:** 2026-01-20
**Requirements:** [requirements-housing-impact-calculator.md](./requirements-housing-impact-calculator.md)
**Design:** [design-housing-impact-calculator.md](./design-housing-impact-calculator.md)

---

## Implementation Strategy

**Approach:** Foundation-first with feature slices

1. Types and constants (foundation)
2. Core calculation functions (foundation)
3. Basic UI components (feature slice: Overview)
4. Rent vs Buy feature (feature slice)
5. Refinance feature (feature slice)
6. Downsizing feature (feature slice)
7. Integration and polish

**Estimated Tasks:** 18 tasks across 5 epics

---

## Epic 1: Foundation (Types, Constants, Calculations)

### Task 1.1: Add Housing Types to calculator.ts

**Objective:** Define all TypeScript types for the housing calculator

**Files:**
- `src/types/calculator.ts`

**Implementation:**
1. Add `IcelandicLoanType` and `InterestRateStructure` types
2. Add `LOAN_TYPE_LABELS` and `RATE_STRUCTURE_LABELS` constants
3. Add `MortgageData` interface with all fields for verðtryggt/óverðtryggt
4. Add `RentalData` interface
5. Add `PropertyCosts` interface
6. Add `HousingData` interface (combines mortgage, rental, property costs)
7. Add `HousingCostBreakdown` and `HousingCostItem` interfaces
8. Add `RentVsBuyComparison` interface
9. Add `RefinanceAnalysis` interface
10. Add `DownsizingAnalysis` interface
11. Add `HousingScenario` interface
12. Update `StoredState` to include `housingData` and `housingScenarios`

**Testing:**
- TypeScript compilation passes
- All types are exported correctly

**Requirements Traced:** US-1, US-2, US-3, US-4, US-5, US-6, US-8

---

### Task 1.2: Create Housing Constants

**Objective:** Define default values and presets for Icelandic market

**Files:**
- `src/lib/constants/housing.ts` (new)

**Implementation:**
1. Create `DEFAULT_MORTGAGE_DATA` with verðtryggt defaults
2. Create `DEFAULT_RENTAL_DATA` with typical Reykjavík rent
3. Create `DEFAULT_PROPERTY_COSTS` with typical percentages
4. Create `HOUSING_VALIDATION` rules (min/max values)
5. Create `HOUSING_ERROR_MESSAGES` in Icelandic
6. Add market reference values (typical interest rates, etc.)

**Testing:**
- All constants export correctly
- Values are reasonable for Icelandic market

**Requirements Traced:** US-2, NFR-2

---

### Task 1.3: Create Core Calculation Functions

**Objective:** Implement mortgage and housing cost calculations

**Files:**
- `src/lib/calculations/housing.ts` (new)

**Implementation:**
1. Implement `calculateMonthlyPayment()` - standard amortization formula
2. Implement `calculatePaymentBreakdown()` - principal vs interest split
3. Implement `calculateVerdtryggtPayment()` - inflation-adjusted calculation
4. Implement `calculateTotalInterestRemaining()` - total interest over term
5. Implement `calculateHousingBreakdown()` - complete cost breakdown
6. Add helper: `monthlyToYearly()`, `yearlyToMonthly()`
7. Export all functions

**Testing:**
- Unit tests for payment calculations
- Verify against known amortization tables
- Test verðtryggt inflation adjustment

**Requirements Traced:** US-1, US-2, NFR-3

---

### Task 1.4: Create Comparison Calculation Functions

**Objective:** Implement rent vs buy, refinance, and downsizing calculations

**Files:**
- `src/lib/calculations/housing.ts` (extend)

**Implementation:**
1. Implement `compareRentVsBuy()` - full comparison with projections
2. Implement `analyzeRefinance()` - refinance impact with break-even
3. Implement `analyzeDownsizing()` - equity and savings analysis
4. Implement `projectEquity()` - equity over time projection
5. Implement `calculateInvestmentAlternative()` - opportunity cost

**Testing:**
- Unit tests for each comparison function
- Edge cases: zero down payment, same rates, etc.

**Requirements Traced:** US-4, US-5, US-6

---

### Task 1.5: Create Housing Validation Functions

**Objective:** Implement input validation for housing forms

**Files:**
- `src/lib/validation/housing.ts` (new)

**Implementation:**
1. Implement `validateMortgageData()` - all mortgage field validation
2. Implement `validateRentalData()` - rental field validation
3. Implement `validatePropertyCosts()` - property cost validation
4. Implement `validateHousingData()` - complete validation
5. Return Icelandic error messages

**Testing:**
- Test all validation rules
- Test error message generation

**Requirements Traced:** US-2, US-3, NFR-2

---

## Epic 2: Core UI Components

### Task 2.1: Create HousingTypeSelector Component

**Objective:** Component to switch between renter and owner modes

**Files:**
- `src/components/housing/HousingTypeSelector.tsx` (new)

**Implementation:**
1. Two large buttons/cards: "Eigandi" (Owner) and "Leigjandi" (Renter)
2. Visual indication of selected type
3. Call onChange when selection changes
4. Clear existing data warning if switching types

**Props:**
```typescript
interface HousingTypeSelectorProps {
  value: HousingType;
  onChange: (type: HousingType) => void;
}
```

**Testing:**
- Renders both options
- Selection changes call onChange
- Visual feedback on selection

**Requirements Traced:** US-1, US-3

---

### Task 2.2: Create LoanTypeSelector Component

**Objective:** Component to select verðtryggt vs óverðtryggt

**Files:**
- `src/components/housing/LoanTypeSelector.tsx` (new)

**Implementation:**
1. Radio buttons or segmented control
2. Labels: "Verðtryggt lán", "Óverðtryggt lán"
3. Brief explanation of each type in help text
4. Icelandic labels throughout

**Props:**
```typescript
interface LoanTypeSelectorProps {
  value: IcelandicLoanType;
  onChange: (type: IcelandicLoanType) => void;
}
```

**Testing:**
- Both options render
- Selection works correctly

**Requirements Traced:** US-2

---

### Task 2.3: Create MortgageInputs Component

**Objective:** Complete mortgage input form with conditional fields

**Files:**
- `src/components/housing/MortgageInputs.tsx` (new)

**Implementation:**
1. LoanTypeSelector integration
2. Principal inputs (original + current for verðtryggt)
3. Interest rate structure selector (fixed/variable/fixed_then_variable)
4. Interest rate input
5. Conditional: fixed period fields for fixed_then_variable
6. Loan term and remaining years
7. Conditional: inflation rate for verðtryggt
8. Calculated monthly payment display
9. Use existing NumberInput, CurrencyInput, Select components

**Props:**
```typescript
interface MortgageInputsProps {
  data: MortgageData;
  onChange: (data: MortgageData) => void;
}
```

**Testing:**
- All fields render correctly
- Conditional fields show/hide appropriately
- Validation feedback works

**Requirements Traced:** US-2

---

### Task 2.4: Create RentInputs Component

**Objective:** Rental cost input form

**Files:**
- `src/components/housing/RentInputs.tsx` (new)

**Implementation:**
1. Monthly rent input (CurrencyInput)
2. Annual rent increase percentage
3. Utilities included checkbox
4. Conditional: estimated utilities if not included
5. Help text explaining 100% is "lost money"

**Props:**
```typescript
interface RentInputsProps {
  data: RentalData;
  onChange: (data: RentalData) => void;
}
```

**Testing:**
- All fields render
- Conditional utilities field works

**Requirements Traced:** US-3

---

### Task 2.5: Create PropertyCostsInputs Component

**Objective:** Property ownership costs input form

**Files:**
- `src/components/housing/PropertyCostsInputs.tsx` (new)

**Implementation:**
1. Property value input (fasteignamat)
2. Annual property tax (fasteignagjöld)
3. Annual insurance
4. Annual maintenance budget
5. Optional: monthly HOA fees (húsfélagsgjöld)
6. Auto-calculate suggestions based on property value (0.5% tax, etc.)
7. Help text explaining these are all "lost money"

**Props:**
```typescript
interface PropertyCostsInputsProps {
  data: PropertyCosts;
  onChange: (data: PropertyCosts) => void;
}
```

**Testing:**
- All fields render
- Auto-suggest works

**Requirements Traced:** US-1

---

### Task 2.6: Create HousingCostBreakdown Component

**Objective:** Display complete cost breakdown with lost vs equity visualization

**Files:**
- `src/components/housing/HousingCostBreakdown.tsx` (new)

**Implementation:**
1. Summary card with total monthly/yearly costs
2. Large "Lost Money" vs "Equity" display
3. Breakdown list with each cost category
4. Color coding: red/orange for lost, green for equity
5. Life energy hours display for each item
6. Percentage of total for each item
7. Use existing Card component

**Props:**
```typescript
interface HousingCostBreakdownProps {
  breakdown: HousingCostBreakdown;
  actualHourlyWage: number;
}
```

**Testing:**
- All categories display
- Colors correct for lost vs equity
- Life energy calculations correct

**Requirements Traced:** US-1, US-7

---

### Task 2.7: Create LostMoneyChart Component

**Objective:** Visual chart showing lost money breakdown

**Files:**
- `src/components/housing/LostMoneyChart.tsx` (new)

**Implementation:**
1. Horizontal stacked bar chart
2. Each cost category as a segment
3. Color-coded by category
4. Hover/click to see details
5. Legend with labels and amounts
6. Use simple CSS/Tailwind (no chart library needed for MVP)

**Props:**
```typescript
interface LostMoneyChartProps {
  items: HousingCostItem[];
  totalLost: number;
  totalEquity: number;
}
```

**Testing:**
- Chart renders all segments
- Proportions are correct
- Interactive elements work

**Requirements Traced:** US-1

---

## Epic 3: Main Calculator Container

### Task 3.1: Create HousingCalculator Main Component

**Objective:** Main container with tab navigation

**Files:**
- `src/components/housing/HousingCalculator.tsx` (new)

**Implementation:**
1. Tab navigation: Yfirlit, Leiga vs Kaup, Endurfjármögnun, Niðurflutningur
2. Integration with CalculatorContext for actualHourlyWage
3. Warning alert if actualHourlyWage is 0
4. State management for current housing data
5. Calculate breakdown when inputs change
6. Pass data to child components

**Props:**
```typescript
interface HousingCalculatorProps {
  className?: string;
}
```

**Testing:**
- Tab navigation works
- Context integration works
- Warning displays when appropriate

**Requirements Traced:** US-1, US-7

---

### Task 3.2: Create Housing Page

**Objective:** Next.js page for the housing calculator

**Files:**
- `src/app/husnaedi/page.tsx` (new)

**Implementation:**
1. Page metadata with Icelandic title/description
2. PageLayout wrapper with ad zones
3. Section with Container
4. HousingCalculator component
5. Brief introduction text

**Testing:**
- Page renders at /husnaedi
- Layout is consistent with other pages

**Requirements Traced:** All

---

### Task 3.3: Update Context for Housing Data

**Objective:** Add housing data to CalculatorContext

**Files:**
- `src/context/CalculatorContext.tsx`

**Implementation:**
1. Add `housingData` state
2. Add `updateHousingData` function
3. Add `housingBreakdown` computed value
4. Add `housingScenarios` state
5. Add `saveHousingScenario`, `deleteHousingScenario` functions
6. Update localStorage persistence

**Testing:**
- State updates work
- Persistence works across page reloads

**Requirements Traced:** US-8

---

### Task 3.4: Create Component Barrel Export

**Objective:** Create index.ts for housing components

**Files:**
- `src/components/housing/index.ts` (new)

**Implementation:**
1. Export all housing components
2. Export types if any component-specific types

**Testing:**
- All imports work from `@/components/housing`

**Requirements Traced:** N/A (code organization)

---

## Epic 4: Feature - Rent vs Buy Comparison

### Task 4.1: Create RentVsBuyInputs Component

**Objective:** Input form for rent vs buy comparison

**Files:**
- `src/components/housing/RentVsBuyInputs.tsx` (new)

**Implementation:**
1. Two-column layout: Rent side, Buy side
2. Rent side: RentInputs component
3. Buy side: Property value, down payment, MortgageInputs, PropertyCostsInputs
4. Down payment as amount or percentage
5. Optional: property appreciation rate input

**Props:**
```typescript
interface RentVsBuyInputsProps {
  rentalData: RentalData;
  mortgageData: MortgageData;
  propertyCosts: PropertyCosts;
  downPayment: number;
  appreciationRate?: number;
  onRentalChange: (data: RentalData) => void;
  onMortgageChange: (data: MortgageData) => void;
  onPropertyCostsChange: (data: PropertyCosts) => void;
  onDownPaymentChange: (value: number) => void;
  onAppreciationChange?: (value: number) => void;
}
```

**Testing:**
- Both columns render
- All inputs work

**Requirements Traced:** US-4

---

### Task 4.2: Create RentVsBuyComparison Component

**Objective:** Display rent vs buy comparison results

**Files:**
- `src/components/housing/RentVsBuyComparison.tsx` (new)

**Implementation:**
1. Side-by-side monthly cost comparison
2. "Lost money" comparison prominently displayed
3. Equity projection display (5, 10, 20 years)
4. Investment alternative display (if renting and investing)
5. Break-even analysis if applicable
6. Life energy comparison
7. Recommendation text

**Props:**
```typescript
interface RentVsBuyComparisonProps {
  comparison: RentVsBuyComparison;
  actualHourlyWage: number;
}
```

**Testing:**
- All comparison data displays
- Recommendation is appropriate

**Requirements Traced:** US-4

---

## Epic 5: Features - Refinance & Downsizing

### Task 5.1: Create RefinanceInputs Component

**Objective:** Input form for refinance analysis

**Files:**
- `src/components/housing/RefinanceInputs.tsx` (new)

**Implementation:**
1. Current loan summary display (read from housing data)
2. New loan inputs: type, rate, term
3. Refinancing costs input
4. Compare button to trigger analysis

**Props:**
```typescript
interface RefinanceInputsProps {
  currentMortgage: MortgageData;
  newMortgage: MortgageData;
  refinancingCosts: number;
  onNewMortgageChange: (data: MortgageData) => void;
  onRefinancingCostsChange: (value: number) => void;
}
```

**Testing:**
- Current loan displays correctly
- New loan inputs work

**Requirements Traced:** US-5

---

### Task 5.2: Create RefinanceImpactDisplay Component

**Objective:** Display refinance analysis results

**Files:**
- `src/components/housing/RefinanceImpactDisplay.tsx` (new)

**Implementation:**
1. Payment change display (savings or increase)
2. Interest savings over loan term
3. Break-even point calculation
4. Warnings (e.g., extended term)
5. Life energy impact
6. Recommendation

**Props:**
```typescript
interface RefinanceImpactDisplayProps {
  analysis: RefinanceAnalysis;
  actualHourlyWage: number;
}
```

**Testing:**
- All analysis data displays
- Warnings show when appropriate

**Requirements Traced:** US-5

---

### Task 5.3: Create DownsizingInputs Component

**Objective:** Input form for downsizing analysis

**Files:**
- `src/components/housing/DownsizingInputs.tsx` (new)

**Implementation:**
1. Current property summary (from housing data)
2. Target property value input
3. Selling costs input (or percentage default)
4. New loan inputs (if any)
5. Compare button

**Props:**
```typescript
interface DownsizingInputsProps {
  currentHousing: HousingData;
  targetPropertyValue: number;
  targetMortgage: MortgageData | null;
  sellingCosts: number;
  onTargetValueChange: (value: number) => void;
  onTargetMortgageChange: (data: MortgageData | null) => void;
  onSellingCostsChange: (value: number) => void;
}
```

**Testing:**
- Current property displays
- Target inputs work
- Optional mortgage toggle works

**Requirements Traced:** US-6

---

### Task 5.4: Create DownsizingImpactDisplay Component

**Objective:** Display downsizing analysis results

**Files:**
- `src/components/housing/DownsizingImpactDisplay.tsx` (new)

**Implementation:**
1. Equity freed display
2. Monthly cost change
3. Future value of freed equity (10, 20 years)
4. Life energy savings
5. Summary recommendation

**Props:**
```typescript
interface DownsizingImpactDisplayProps {
  analysis: DownsizingAnalysis;
  actualHourlyWage: number;
}
```

**Testing:**
- All analysis data displays
- Future value calculations correct

**Requirements Traced:** US-6

---

## Task Dependency Graph

```
Task 1.1 (Types)
    │
    ├── Task 1.2 (Constants)
    │
    └── Task 1.3 (Core Calculations)
            │
            ├── Task 1.4 (Comparison Calculations)
            │
            └── Task 1.5 (Validation)
                    │
    ┌───────────────┴───────────────┐
    │                               │
Task 2.1-2.7 (UI Components)    Task 3.3 (Context)
    │                               │
    └───────────────┬───────────────┘
                    │
            Task 3.1 (Main Calculator)
                    │
            Task 3.2 (Page)
                    │
            Task 3.4 (Barrel Export)
                    │
    ┌───────────────┼───────────────┐
    │               │               │
Task 4.1-4.2    Task 5.1-5.2    Task 5.3-5.4
(Rent vs Buy)   (Refinance)     (Downsizing)
```

---

## Implementation Order

### Phase 1: Foundation (Tasks 1.1-1.5)
Must complete before any UI work.

### Phase 2: Core UI (Tasks 2.1-2.7, 3.3, 3.4)
Can be done in parallel after foundation.

### Phase 3: Main Container (Tasks 3.1, 3.2)
Depends on Phase 2.

### Phase 4: Feature Slices (Tasks 4.1-4.2, 5.1-5.4)
Can be done in parallel after Phase 3.

---

## Verification Checklist

After all tasks complete:

- [ ] All types compile without errors
- [ ] All calculations match expected results
- [ ] Page loads at /husnaedi
- [ ] Owner flow: enter mortgage → see breakdown
- [ ] Renter flow: enter rent → see breakdown
- [ ] Rent vs Buy: comparison displays correctly
- [ ] Refinance: break-even calculation works
- [ ] Downsizing: equity freed calculation works
- [ ] Life energy displays when actualHourlyWage is set
- [ ] Warning shows when actualHourlyWage is 0
- [ ] All text is in Icelandic
- [ ] Responsive design works on mobile
- [ ] Data persists in localStorage

---

## Notes

- Tasks can be implemented by builder-agent one at a time
- Consider creating a worktree for parallel development
- Run `npm run build` after each task to verify no type errors
- Test on actual Icelandic loan scenarios for accuracy
