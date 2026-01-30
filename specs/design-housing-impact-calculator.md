# Design: Housing Impact Calculator (Húsnæðiskostnaðarmælir)

## Overview

**Feature Name:** Housing Impact Calculator
**Version:** 1.0
**Status:** Draft
**Created:** 2026-01-20
**Requirements:** [requirements-housing-impact-calculator.md](./requirements-housing-impact-calculator.md)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Page Component                            │
│                    app/husnaedi/page.tsx                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HousingCalculator.tsx                          │
│              (Main container with tab navigation)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Yfirlit  │  │ Leiga vs │  │Endurfjár-│  │Niðurflut-│        │
│  │(Overview)│  │  Kaup    │  │  mögnun  │  │  ningur  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Input Forms   │     │ Calculations  │     │ Display       │
│ Components    │     │ (lib/)        │     │ Components    │
└───────────────┘     └───────────────┘     └───────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CalculatorContext                             │
│            (actualHourlyWage, state management)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
app/husnaedi/page.tsx
└── HousingCalculator.tsx (main container)
    ├── Tab Navigation
    ├── Tab: Yfirlit (Overview)
    │   ├── HousingTypeSelector.tsx (rent vs own)
    │   ├── MortgageInputs.tsx (for owners)
    │   │   ├── LoanTypeSelector.tsx (verðtryggt/óverðtryggt)
    │   │   ├── LoanDetailsForm.tsx
    │   │   └── FixedVariableRateForm.tsx
    │   ├── RentInputs.tsx (for renters)
    │   ├── PropertyCostsInputs.tsx (taxes, insurance, maintenance)
    │   └── HousingCostBreakdown.tsx (results display)
    │       ├── LostMoneyChart.tsx
    │       └── LifeEnergyDisplay.tsx
    ├── Tab: Leiga vs Kaup (Rent vs Buy)
    │   ├── RentVsBuyInputs.tsx
    │   ├── RentVsBuyComparison.tsx
    │   └── EquityProjectionChart.tsx
    ├── Tab: Endurfjármögnun (Refinance)
    │   ├── CurrentLoanSummary.tsx
    │   ├── RefinanceInputs.tsx
    │   └── RefinanceImpactDisplay.tsx
    └── Tab: Niðurflutningur (Downsizing)
        ├── CurrentPropertyInputs.tsx
        ├── TargetPropertyInputs.tsx
        └── DownsizingImpactDisplay.tsx
```

---

## Data Models

### Core Types (to add to types/calculator.ts)

```typescript
// ============================================================================
// HOUSING IMPACT CALCULATOR TYPES
// ============================================================================

/**
 * Icelandic loan types
 */
export type IcelandicLoanType = 'verdtryggt' | 'overdtryggt';

/**
 * Interest rate structure
 */
export type InterestRateStructure = 'fixed' | 'variable' | 'fixed_then_variable';

/**
 * Icelandic labels for loan types
 */
export const LOAN_TYPE_LABELS: Record<IcelandicLoanType, string> = {
  verdtryggt: 'Verðtryggt lán',
  overdtryggt: 'Óverðtryggt lán',
};

/**
 * Icelandic labels for rate structures
 */
export const RATE_STRUCTURE_LABELS: Record<InterestRateStructure, string> = {
  fixed: 'Fastir vextir',
  variable: 'Breytilegir vextir',
  fixed_then_variable: 'Fastir síðan breytilegir',
};

/**
 * Mortgage/loan details for Icelandic loans
 */
export interface MortgageData {
  loanType: IcelandicLoanType;

  // Principal
  originalPrincipal: number;      // Original loan amount (höfuðstóll)
  currentPrincipal: number;       // Current principal (after inflation for verðtryggt)

  // Interest rate structure
  rateStructure: InterestRateStructure;
  interestRate: number;           // Current/fixed interest rate (%)

  // For fixed_then_variable structure
  fixedRatePeriodYears?: number;  // Years with fixed rate
  fixedRateRemaining?: number;    // Years remaining in fixed period
  expectedVariableRate?: number;  // Expected rate after fixed period (%)

  // Loan term
  loanTermYears: number;          // Total loan term
  remainingYears: number;         // Years remaining

  // For verðtryggt loans
  inflationRateAssumption?: number; // Expected annual inflation (%)

  // Payment info
  monthlyPayment?: number;        // Can be calculated or entered
}

/**
 * Rental details
 */
export interface RentalData {
  monthlyRent: number;            // Mánaðarleiga (ISK)
  annualRentIncrease: number;     // Expected annual increase (%)
  utilitiesIncluded: boolean;     // Whether utilities are in rent
  estimatedUtilities?: number;    // If not included, monthly estimate
}

/**
 * Property ownership costs (beyond mortgage)
 */
export interface PropertyCosts {
  propertyValue: number;          // Fasteignamat (ISK)
  annualPropertyTax: number;      // Fasteignagjöld (ISK/year)
  annualInsurance: number;        // Tryggingar (ISK/year)
  annualMaintenance: number;      // Viðhald (ISK/year)
  monthlyHOAFees?: number;        // Húsfélagsgjöld if applicable
}

/**
 * Housing situation type
 */
export type HousingType = 'owner' | 'renter';

/**
 * Complete housing data
 */
export interface HousingData {
  housingType: HousingType;
  mortgage?: MortgageData;        // For owners
  rental?: RentalData;            // For renters
  propertyCosts?: PropertyCosts;  // For owners
}

/**
 * Monthly cost breakdown for a mortgage
 */
export interface MortgagePaymentBreakdown {
  principal: number;              // Goes to equity
  interest: number;               // Lost money
  totalPayment: number;
}

/**
 * Complete housing cost breakdown
 */
export interface HousingCostBreakdown {
  // Monthly costs
  monthlyMortgagePayment: number;
  monthlyPrincipal: number;       // Equity building
  monthlyInterest: number;        // Lost
  monthlyPropertyTax: number;     // Lost
  monthlyInsurance: number;       // Lost
  monthlyMaintenance: number;     // Lost
  monthlyHOAFees: number;         // Lost
  monthlyRent: number;            // Lost (if renting)
  monthlyUtilities: number;       // Lost

  // Totals
  totalMonthly: number;
  totalLostMonthly: number;       // All non-equity costs
  totalEquityMonthly: number;     // Principal only

  // Annual
  totalYearly: number;
  totalLostYearly: number;
  totalEquityYearly: number;

  // Life energy (hours)
  lifeEnergyLostMonthly: number;
  lifeEnergyLostYearly: number;
  lifeEnergyTotalMonthly: number;
  lifeEnergyTotalYearly: number;

  // Breakdown items for charts
  breakdownItems: HousingCostItem[];
}

/**
 * Individual cost item for breakdown display
 */
export interface HousingCostItem {
  category: string;
  label: string;                  // Icelandic label
  monthlyAmount: number;
  yearlyAmount: number;
  isLostMoney: boolean;           // true = lost, false = equity
  percentage: number;             // % of total monthly
  lifeEnergyHours: number;        // Monthly hours
}

/**
 * Rent vs Buy comparison results
 */
export interface RentVsBuyComparison {
  // Monthly comparison
  rentMonthlyTotal: number;
  buyMonthlyTotal: number;
  buyMonthlyLost: number;
  monthlyDifference: number;      // Positive = rent cheaper

  // Equity projections
  equityAfter5Years: number;
  equityAfter10Years: number;
  equityAfter20Years: number;

  // Opportunity cost (if renting and investing difference)
  investmentAfter5Years: number;
  investmentAfter10Years: number;
  investmentAfter20Years: number;

  // Break-even analysis
  breakEvenYears: number | null;  // null if never breaks even

  // Life energy comparison
  rentLifeEnergyMonthly: number;
  buyLifeEnergyLostMonthly: number;

  // Recommendation
  recommendation: string;         // Icelandic text
}

/**
 * Refinance analysis results
 */
export interface RefinanceAnalysis {
  // Current loan summary
  currentMonthlyPayment: number;
  currentMonthlyInterest: number;
  currentTotalInterestRemaining: number;

  // New loan summary
  newMonthlyPayment: number;
  newMonthlyInterest: number;
  newTotalInterest: number;

  // Savings
  monthlyPaymentChange: number;   // Negative = savings
  monthlyInterestChange: number;
  totalInterestSaved: number;

  // Break-even
  refinancingCosts: number;
  breakEvenMonths: number;

  // Life energy impact
  lifeEnergyMonthlyChange: number;
  lifeEnergySavedOverTerm: number;

  // Warnings
  warnings: string[];             // e.g., "Loan term extended"
}

/**
 * Downsizing analysis results
 */
export interface DownsizingAnalysis {
  // Current property
  currentPropertyValue: number;
  currentEquity: number;
  currentMonthlyLost: number;

  // Target property
  targetPropertyValue: number;
  targetMonthlyLost: number;

  // Transaction
  sellingCosts: number;
  netProceeds: number;
  equityFreed: number;

  // Savings
  monthlyLostChange: number;      // Negative = savings
  yearlyLostChange: number;

  // Investment potential
  freedEquityFutureValue10Years: number;
  freedEquityFutureValue20Years: number;

  // Life energy
  lifeEnergyMonthlyChange: number;
  lifeEnergyYearlyChange: number;
}

/**
 * Housing scenario for saving/comparing
 */
export interface HousingScenario {
  id: string;
  name: string;
  housingData: HousingData;
  breakdown: HousingCostBreakdown;
  createdAt: string;
  updatedAt: string;
}
```

### State Management

Extend the existing `CalculatorContext` to include housing data:

```typescript
// Add to CalculatorContext
interface CalculatorContextValue {
  // ... existing fields ...

  // Housing calculator
  housingData: HousingData;
  updateHousingData: (data: Partial<HousingData>) => void;
  housingBreakdown: HousingCostBreakdown | null;
  housingScenarios: HousingScenario[];
  saveHousingScenario: (name: string) => void;
  deleteHousingScenario: (id: string) => void;
}

// Add to StoredState
interface StoredState {
  // ... existing fields ...
  housingData?: HousingData;
  housingScenarios?: HousingScenario[];
}
```

---

## Component Specifications

### HousingCalculator.tsx (Main Container)

**Responsibilities:**
- Tab navigation between 4 main views
- Integration with CalculatorContext
- Display actualHourlyWage warning if not set

**Props:**
```typescript
interface HousingCalculatorProps {
  className?: string;
}
```

**State:**
```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'rentVsBuy' | 'refinance' | 'downsize'>('overview');
```

### MortgageInputs.tsx

**Responsibilities:**
- Collect all mortgage details
- Handle verðtryggt vs óverðtryggt differences
- Handle fixed-then-variable rate structure

**Props:**
```typescript
interface MortgageInputsProps {
  data: MortgageData;
  onChange: (data: MortgageData) => void;
}
```

**Conditional Rendering:**
- Show inflation rate field only for verðtryggt
- Show fixed period fields only for fixed_then_variable structure
- Calculate and display estimated monthly payment

### HousingCostBreakdown.tsx

**Responsibilities:**
- Display complete cost breakdown
- Show lost money vs equity clearly
- Convert to life energy hours

**Visual Design:**
- Stacked bar chart showing lost vs equity
- Color coding: Red/orange for lost, green for equity
- Large life energy display at top

---

## Calculation Functions

### File: lib/calculations/housing.ts

```typescript
/**
 * Calculate monthly mortgage payment (standard amortization)
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number;

/**
 * Calculate payment breakdown (principal vs interest) for a specific payment
 */
export function calculatePaymentBreakdown(
  remainingPrincipal: number,
  annualRate: number,
  termYears: number,
  paymentNumber: number
): MortgagePaymentBreakdown;

/**
 * Calculate verðtryggt loan with inflation adjustment
 */
export function calculateVerdtryggtPayment(
  currentPrincipal: number,
  annualRate: number,
  remainingYears: number,
  inflationRate: number
): {
  monthlyPayment: number;
  estimatedNextYearPayment: number;
};

/**
 * Calculate total interest over remaining loan term
 */
export function calculateTotalInterestRemaining(
  principal: number,
  annualRate: number,
  remainingYears: number,
  loanType: IcelandicLoanType,
  inflationRate?: number
): number;

/**
 * Generate complete housing cost breakdown
 */
export function calculateHousingBreakdown(
  housingData: HousingData,
  actualHourlyWage: number
): HousingCostBreakdown;

/**
 * Compare rent vs buy scenarios
 */
export function compareRentVsBuy(
  rentalData: RentalData,
  mortgageData: MortgageData,
  propertyCosts: PropertyCosts,
  downPayment: number,
  actualHourlyWage: number,
  appreciationRate?: number
): RentVsBuyComparison;

/**
 * Analyze refinance impact
 */
export function analyzeRefinance(
  currentMortgage: MortgageData,
  newMortgage: MortgageData,
  refinancingCosts: number,
  actualHourlyWage: number
): RefinanceAnalysis;

/**
 * Analyze downsizing impact
 */
export function analyzeDownsizing(
  currentHousing: HousingData,
  targetPropertyValue: number,
  targetMortgage: MortgageData | null,
  sellingCosts: number,
  actualHourlyWage: number
): DownsizingAnalysis;

/**
 * Project equity over time
 */
export function projectEquity(
  mortgageData: MortgageData,
  propertyCosts: PropertyCosts,
  years: number,
  appreciationRate?: number
): number[];

/**
 * Calculate future value of monthly savings if invested
 */
export function calculateInvestmentAlternative(
  monthlySavings: number,
  years: number,
  annualReturn: number
): number;
```

### Amortization Formulas

**Standard Monthly Payment:**
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]

Where:
- M = monthly payment
- P = principal
- r = monthly interest rate (annual / 12)
- n = total number of payments (years * 12)
```

**Interest Portion of Payment:**
```
Interest = Remaining Principal * Monthly Rate
Principal = Payment - Interest
```

**Verðtryggt Adjustment:**
```
New Principal = Previous Principal * (1 + monthly_inflation_rate)
Payment recalculated each month based on adjusted principal
```

---

## UI/UX Design

### Tab Structure

| Tab | Icelandic | Purpose |
|-----|-----------|---------|
| 1 | Yfirlit | Current housing cost overview |
| 2 | Leiga vs Kaup | Rent vs buy comparison |
| 3 | Endurfjármögnun | Refinance analysis |
| 4 | Niðurflutningur | Downsizing analysis |

### Color Coding

- **Lost Money:** `bg-warning-50`, `text-warning-700`, `border-warning-200`
- **Equity Building:** `bg-success-50`, `text-success-700`, `border-success-200`
- **Neutral/Total:** `bg-neutral-50`, `text-neutral-700`
- **Life Energy:** `bg-primary-50`, `text-primary-700`

### Input Defaults (Icelandic Market 2026)

```typescript
const DEFAULT_MORTGAGE_DATA: MortgageData = {
  loanType: 'verdtryggt',
  originalPrincipal: 50000000,    // 50M ISK
  currentPrincipal: 50000000,
  rateStructure: 'fixed_then_variable',
  interestRate: 4.5,              // Typical verðtryggt rate
  fixedRatePeriodYears: 5,
  fixedRateRemaining: 5,
  expectedVariableRate: 5.5,
  loanTermYears: 40,
  remainingYears: 40,
  inflationRateAssumption: 5,     // 5% inflation
};

const DEFAULT_PROPERTY_COSTS: PropertyCosts = {
  propertyValue: 80000000,        // 80M ISK
  annualPropertyTax: 400000,      // ~0.5% of value
  annualInsurance: 120000,        // ~0.15% of value
  annualMaintenance: 800000,      // ~1% of value
};

const DEFAULT_RENTAL_DATA: RentalData = {
  monthlyRent: 350000,            // 350k ISK/month
  annualRentIncrease: 5,          // 5% annual increase
  utilitiesIncluded: false,
  estimatedUtilities: 25000,
};
```

---

## Error Handling

### Validation Rules

```typescript
const HOUSING_VALIDATION = {
  principal: { min: 0, max: 500000000 },      // 0 - 500M ISK
  interestRate: { min: 0, max: 30 },          // 0-30%
  loanTerm: { min: 1, max: 50 },              // 1-50 years
  propertyValue: { min: 0, max: 1000000000 }, // 0 - 1B ISK
  rent: { min: 0, max: 2000000 },             // 0 - 2M ISK/month
  inflationRate: { min: 0, max: 20 },         // 0-20%
};
```

### Error Messages (Icelandic)

```typescript
const HOUSING_ERROR_MESSAGES = {
  principalRequired: 'Vinsamlegast sláðu inn höfuðstól láns',
  interestRateInvalid: 'Vextir verða að vera á milli 0% og 30%',
  loanTermInvalid: 'Lánstími verður að vera á milli 1 og 50 ára',
  propertyValueRequired: 'Vinsamlegast sláðu inn fasteignamat',
  rentRequired: 'Vinsamlegast sláðu inn mánaðarleigu',
  noHourlyWage: 'Vinsamlegast reiknaðu raunverulegt tímakaup fyrst',
};
```

---

## Testing Strategy

### Unit Tests

1. **Calculation tests:**
   - Monthly payment calculation accuracy
   - Verðtryggt inflation adjustment
   - Interest vs principal breakdown
   - Total interest over loan term
   - Rent vs buy comparison logic
   - Refinance break-even calculation

2. **Validation tests:**
   - All input validation rules
   - Edge cases (zero values, max values)

### Integration Tests

1. **Component rendering with different housing types**
2. **Tab navigation and state persistence**
3. **Context integration for actualHourlyWage**
4. **Scenario save/load functionality**

### Test Data

```typescript
const TEST_SCENARIOS = {
  verdtryggtLoan: {
    loanType: 'verdtryggt',
    currentPrincipal: 40000000,
    interestRate: 4.5,
    remainingYears: 30,
    inflationRateAssumption: 5,
  },
  overdtryggtLoan: {
    loanType: 'overdtryggt',
    currentPrincipal: 40000000,
    interestRate: 8.5,
    remainingYears: 30,
  },
  typicalRent: {
    monthlyRent: 300000,
    annualRentIncrease: 5,
  },
};
```

---

## File Structure

```
src/
├── app/
│   └── husnaedi/
│       └── page.tsx                    # Housing calculator page
├── components/
│   └── housing/
│       ├── index.ts                    # Barrel export
│       ├── HousingCalculator.tsx       # Main container
│       ├── HousingTypeSelector.tsx     # Rent vs Own selector
│       ├── MortgageInputs.tsx          # Mortgage form
│       ├── LoanTypeSelector.tsx        # Verðtryggt/Óverðtryggt
│       ├── RentInputs.tsx              # Rental form
│       ├── PropertyCostsInputs.tsx     # Taxes, insurance, maintenance
│       ├── HousingCostBreakdown.tsx    # Results display
│       ├── LostMoneyChart.tsx          # Visual breakdown
│       ├── RentVsBuyComparison.tsx     # Comparison view
│       ├── RefinanceInputs.tsx         # Refinance form
│       ├── RefinanceImpactDisplay.tsx  # Refinance results
│       ├── DownsizingInputs.tsx        # Downsizing form
│       └── DownsizingImpactDisplay.tsx # Downsizing results
├── lib/
│   ├── calculations/
│   │   └── housing.ts                  # All housing calculations
│   ├── constants/
│   │   └── housing.ts                  # Defaults and presets
│   └── validation/
│       └── housing.ts                  # Input validation
└── types/
    └── calculator.ts                   # Add housing types
```

---

## Dependencies

### Existing (reuse)
- CalculatorContext
- Card, Input, NumberInput, Select, Button, Alert components
- formatCurrency, formatLifeEnergy utilities
- calculateFutureValue function

### New (none required)
- No new external dependencies needed

---

## Key Design Decisions

### D1: Separate Lost Money vs Equity
**Decision:** Prominently separate and color-code lost money (interest, taxes, etc.) from equity building (principal)
**Rationale:** This is the core insight of the calculator - users need to clearly see what money is "gone" vs building wealth

### D2: Support Both Icelandic Loan Types
**Decision:** Full support for verðtryggt and óverðtryggt loans with their specific calculations
**Rationale:** These are fundamentally different loan structures that require different math

### D3: Fixed-Then-Variable Modeling
**Decision:** Allow users to model loans with fixed rates that become variable
**Rationale:** This is a common loan structure in Iceland and users need to understand future cost changes

### D4: Conservative Defaults
**Decision:** Use conservative inflation (5%) and no property appreciation by default
**Rationale:** Avoid encouraging speculation; let users opt-in to appreciation assumptions

### D5: Life Energy Integration
**Decision:** Show all costs in life energy hours alongside ISK amounts
**Rationale:** Core app principle - money = life energy

---

## Traceability Matrix

| Requirement | Design Component |
|-------------|------------------|
| US-1 | HousingCostBreakdown.tsx, calculateHousingBreakdown() |
| US-2 | MortgageInputs.tsx, LoanTypeSelector.tsx, MortgageData type |
| US-3 | RentInputs.tsx, RentalData type |
| US-4 | RentVsBuyComparison.tsx, compareRentVsBuy() |
| US-5 | RefinanceInputs.tsx, RefinanceImpactDisplay.tsx, analyzeRefinance() |
| US-6 | DownsizingInputs.tsx, DownsizingImpactDisplay.tsx, analyzeDownsizing() |
| US-7 | LifeEnergyDisplay in all views, lifeEnergy fields in all types |
| US-8 | HousingScenario type, scenario management in context |
