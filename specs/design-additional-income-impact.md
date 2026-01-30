# Design: Additional Income Impact Calculator

## Overview

**Feature**: Additional Income Impact Calculator (2.3.3)
**App**: peninganaedalifid.is
**Requirements**: [requirements-additional-income-impact.md](./requirements-additional-income-impact.md)

This design document describes the technical architecture for a calculator that evaluates side income opportunities by accounting for marginal taxes, new expenses, additional time costs, and impact on FI timeline. The system helps users determine the true "net hourly rate" of additional work and compare it to their current actual hourly wage.

**Key Design Principles**:
1. Reuse patterns from Actual Hourly Wage Calculator
2. Client-side only (privacy-first, no backend)
3. Integration with existing calculator context
4. Icelandic tax system awareness
5. Plain language outputs with life-energy framing

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Application (Next.js)                 │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Pages      │  │  Components  │  │    Hooks       │   │  │
│  │  │              │  │              │  │                │   │  │
│  │  │ - Additional │  │ - InputForm  │  │ - useAdditional│   │  │
│  │  │   Income     │  │ - Results    │  │   Income       │   │  │
│  │  │   Page       │  │ - Tax Detail │  │ - useTaxCalc   │   │  │
│  │  │              │  │ - Comparison │  │ - useOpportunity│  │  │
│  │  └──────┬───────┘  │ - Presets    │  │   Comparison   │   │  │
│  │         │          └──────────────┘  └────────────────┘   │  │
│  │         │                                                  │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │         Additional Income Calculation Engine        │   │  │
│  │  │  (Pure functions - no side effects)                 │   │  │
│  │  │  - calculateMarginalTax()                           │   │  │
│  │  │  - calculateNetHourlyRate()                         │   │  │
│  │  │  - calculateFIImpact()                              │   │  │
│  │  │  - generateComparison()                             │   │  │
│  │  │  - generateRecommendation()                         │   │  │
│  │  └──────┬─────────────────────────────────────────────┘   │  │
│  │         │                                                  │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │              Data Layer                             │   │  │
│  │  │  - AdditionalIncomeContext (state)                  │   │  │
│  │  │  - Integrates with CalculatorContext (actual wage)  │   │  │
│  │  │  - localStorage adapter (opportunities)             │   │  │
│  │  │  - JSON export/import                               │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   ├── additional-income/
│   │   │   └── page.tsx                # Additional Income calculator page
│   │   └── ...
│   │
│   ├── components/
│   │   ├── additional-income/          # Feature-specific components
│   │   │   ├── AdditionalIncomeInputs.tsx
│   │   │   ├── NewExpenseInputs.tsx
│   │   │   ├── AdditionalTimeInputs.tsx
│   │   │   ├── FIImpactInputs.tsx
│   │   │   ├── TaxBreakdown.tsx
│   │   │   ├── NetRateDisplay.tsx
│   │   │   ├── ComparisonDisplay.tsx
│   │   │   ├── RecommendationSummary.tsx
│   │   │   ├── OpportunityPresets.tsx
│   │   │   ├── OpportunityComparison.tsx
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── additionalIncome.ts    # Net rate calculations
│   │   │   ├── tax.ts                 # Icelandic tax calculations
│   │   │   ├── fiImpact.ts            # FI timeline calculations
│   │   │   └── index.ts
│   │   │
│   │   ├── presets/
│   │   │   ├── opportunityPresets.ts  # Side income presets
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/
│   │   │   └── opportunities.ts       # Opportunity persistence
│   │   │
│   │   └── utils/
│   │       └── recommendations.ts     # Recommendation logic
│   │
│   ├── hooks/
│   │   ├── useAdditionalIncome.ts     # Main calculator hook
│   │   ├── useTaxCalculator.ts        # Tax calculation hook
│   │   ├── useOpportunityComparison.ts # Compare opportunities
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── AdditionalIncomeContext.tsx # State management
│   │   └── ...
│   │
│   └── types/
│       ├── additionalIncome.ts        # Type definitions
│       └── index.ts
```

## Data Models

### Core Types

```typescript
// types/additionalIncome.ts

/**
 * Additional income opportunity inputs
 */
export interface AdditionalIncomeInputs {
  // From core calculator (auto-loaded)
  currentActualWage: number;         // ISK/hour
  currentAnnualIncome: number;       // ISK (gross)

  // Additional income details
  grossHourlyRate: number;           // ISK/hour offered
  hoursPerWeek: number;              // 1-60
  weeksPerYear: number;              // 1-52 (default 50)
  oneTimeBonus: number;              // ISK (sign-on bonus, etc.)

  // New expenses (annual)
  newExpenses: NewExpenses;

  // Additional time costs (weekly hours)
  additionalTime: AdditionalTime;

  // FI planning (optional)
  fiInputs?: FIInputs;
}

/**
 * New expenses incurred by additional work
 */
export interface NewExpenses {
  transportation: number;            // Annual ISK
  equipment: number;                 // One-time or annual ISK
  meals: number;                     // Annual ISK
  childcare: number;                 // Annual ISK
  other: number;                     // Annual ISK
}

/**
 * Additional time investments (weekly hours)
 */
export interface AdditionalTime {
  commute: number;                   // Hours/week
  preparation: number;               // Hours/week
  recovery: number;                  // Hours/week (fatigue)
}

/**
 * FI planning inputs (optional)
 */
export interface FIInputs {
  currentNetWorth: number;           // ISK
  fiNumber: number;                  // ISK (25x annual expenses)
  currentSavingsRate: number;        // % (0-100)
}

/**
 * Calculation results
 */
export interface AdditionalIncomeResults {
  // Core calculations
  grossAnnualIncome: number;         // ISK
  marginalTax: number;               // ISK
  marginalTaxRate: number;           // % (actual rate on additional income)
  totalNewExpenses: number;          // ISK
  netAnnualIncome: number;           // ISK after tax and expenses

  // Time calculations
  billableHours: number;             // Annual hours (hours/week * weeks)
  additionalHours: number;           // Annual extra hours
  totalAnnualHours: number;          // Billable + additional

  // Rates
  grossHourlyRate: number;           // ISK/hour (input)
  netHourlyRate: number;             // ISK/hour after all costs
  percentageReduction: number;       // % reduction from gross to net

  // Comparison
  actualWageDifference: number;      // ISK/hour (net - actual wage)
  actualWageDifferencePercent: number; // %

  // Monthly income
  monthlyNetIncome: number;          // ISK/month

  // FI impact (if FI inputs provided)
  fiImpact?: FIImpact;

  // Breakdown for display
  taxBreakdown: TaxBreakdown;
  expenseBreakdown: ExpenseBreakdownItem[];

  // Recommendation
  recommendation: Recommendation;
}

/**
 * Tax calculation breakdown
 */
export interface TaxBreakdown {
  currentTaxBracket: TaxBracket;
  newIncomeTaxBracket: TaxBracket;
  currentTotalTax: number;           // ISK
  newTotalTax: number;               // ISK
  marginalTax: number;               // ISK (difference)
  marginalRate: number;              // % (effective rate on additional income)
  bracketJump: boolean;              // True if additional income causes bracket jump
}

/**
 * Icelandic tax bracket
 */
export interface TaxBracket {
  min: number;                       // ISK
  max: number | null;                // ISK (null = no cap)
  rate: number;                      // % (combined útsvar + ríkisskattur)
  label: string;                     // e.g., "Low bracket (31.45%)"
}

/**
 * Expense breakdown item
 */
export interface ExpenseBreakdownItem {
  category: string;
  label: string;
  amount: number;                    // ISK
  lifeEnergyHours: number;           // Hours (amount / currentActualWage)
  percentage: number;                // % of gross additional income
}

/**
 * FI timeline impact
 */
export interface FIImpact {
  currentYearsToFI: number;
  newYearsToFI: number;
  monthsSaved: number;               // Positive = faster FI
  currentAnnualSavings: number;      // ISK
  newAnnualSavings: number;          // ISK
  impactCategory: 'minimal' | 'moderate' | 'significant'; // <6mo, 6-24mo, >24mo
}

/**
 * Recommendation based on results
 */
export interface Recommendation {
  verdict: 'excellent' | 'good' | 'modest' | 'poor' | 'negative';
  summary: string;                   // Plain language summary
  reasons: string[];                 // Bullet points
  considerations: string[];          // Non-financial factors to consider
  color: 'success' | 'warning' | 'error' | 'neutral';
}

/**
 * Saved opportunity for comparison
 */
export interface Opportunity {
  id: string;
  name: string;
  inputs: AdditionalIncomeInputs;
  results: AdditionalIncomeResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Opportunity preset
 */
export interface OpportunityPreset {
  id: string;
  label: string;
  description: string;
  category: 'overtime' | 'freelance' | 'retail' | 'delivery' | 'tutoring';
  values: Partial<AdditionalIncomeInputs>;
}

/**
 * localStorage state
 */
export interface AdditionalIncomeStoredState {
  version: number;
  currentInputs: AdditionalIncomeInputs;
  opportunities: Opportunity[];      // Max 5
  lastUpdated: string;
}
```

### Default Values

```typescript
// lib/defaults.ts (extension)

export const DEFAULT_ADDITIONAL_INCOME_INPUTS: AdditionalIncomeInputs = {
  currentActualWage: 0,              // Auto-loaded from CalculatorContext
  currentAnnualIncome: 0,            // Auto-loaded from CalculatorContext
  grossHourlyRate: 0,
  hoursPerWeek: 0,
  weeksPerYear: 50,
  oneTimeBonus: 0,
  newExpenses: {
    transportation: 0,
    equipment: 0,
    meals: 0,
    childcare: 0,
    other: 0,
  },
  additionalTime: {
    commute: 0,
    preparation: 0,
    recovery: 0,
  },
  fiInputs: undefined,               // Optional
};

export const DEFAULT_FI_INPUTS: FIInputs = {
  currentNetWorth: 0,
  fiNumber: 0,
  currentSavingsRate: 0,
};
```

## Component Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header - peninganaedalifid.is                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Hero Section                                            │   │
│  │  "Is This Side Hustle Worth Your Time?"                 │   │
│  │  Brief explanation + link to Actual Wage Calculator     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────────────┐  ┌────────────────────────────────┐ │
│  │  Input Section        │  │  Results Section               │ │
│  │                       │  │                                 │ │
│  │  [Opportunity Presets]│  │  ┌──────────────────────────┐  │ │
│  │                       │  │  │ NET HOURLY RATE          │  │ │
│  │  Current Work Info    │  │  │    X,XXX kr              │  │ │
│  │  ├ Actual wage (auto)│  │  │ vs gross Y,YYY kr        │  │ │
│  │  └ Annual income     │  │  │ (ZZ% reduction)          │  │ │
│  │                       │  │  └──────────────────────────┘  │ │
│  │  Additional Income    │  │                                 │ │
│  │  ├ Gross rate        │  │  Tax Breakdown                  │ │
│  │  ├ Hours/week        │  │  ├ Current bracket: X%          │ │
│  │  ├ Weeks/year        │  │  ├ Marginal rate: Y%           │ │
│  │  └ Bonus             │  │  └ Tax on additional: Z kr     │ │
│  │                       │  │                                 │ │
│  │  New Expenses         │  │  Comparison to Current Work    │ │
│  │  ├ Transportation    │  │  ├ Current: X kr/hr            │ │
│  │  ├ Equipment         │  │  ├ Additional: Y kr/hr         │ │
│  │  ├ Meals             │  │  ├ Difference: ±Z kr (+W%)     │ │
│  │  ├ Childcare         │  │  └ [Success/Warning indicator] │ │
│  │  └ Other             │  │                                 │ │
│  │                       │  │  Monthly Net Income             │ │
│  │  Additional Time      │  │  X,XXX kr/month                │ │
│  │  ├ Commute           │  │                                 │ │
│  │  ├ Preparation       │  │  FI Impact (if provided)       │ │
│  │  └ Recovery          │  │  ├ Saves X months              │ │
│  │                       │  │  └ [Impact indicator]          │ │
│  │  FI Planning (opt)    │  │                                 │ │
│  │  ├ Net worth         │  │  Plain Language Summary         │ │
│  │  ├ FI number         │  │  "Working X hrs/week nets..."  │ │
│  │  └ Savings rate      │  │  [Recommendation]              │ │
│  │                       │  │                                 │ │
│  │  [Save Opportunity]   │  │  [Life Energy Converter]       │ │
│  └───────────────────────┘  └────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Opportunity Comparison (if multiple saved)             │   │
│  │  Side-by-side comparison of up to 5 saved opportunities│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Footer - Privacy notice, Disclaimers                           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

#### NetRateDisplay

```typescript
interface NetRateDisplayProps {
  results: AdditionalIncomeResults | null;
  isCalculating: boolean;
}
```

- Shows net hourly rate prominently
- Displays gross rate for comparison
- Shows percentage reduction badge
- Color-coded based on comparison to actual wage:
  - Success (green): Net rate > actual wage
  - Warning (yellow): Net rate 70-100% of actual wage
  - Error (red): Net rate < 70% of actual wage

#### TaxBreakdown

```typescript
interface TaxBreakdownProps {
  taxBreakdown: TaxBreakdown;
}
```

- Shows current tax bracket
- Shows marginal tax rate on additional income
- Highlights if additional income causes bracket jump
- Displays total marginal tax in ISK
- Includes disclaimer about tax estimate accuracy

#### ComparisonDisplay

```typescript
interface ComparisonDisplayProps {
  currentActualWage: number;
  netHourlyRate: number;
  difference: number;
  differencePercent: number;
}
```

- Side-by-side comparison of current actual wage vs additional income net rate
- Visual bar chart showing relative rates
- Success/warning/error indicator
- Contextual message based on comparison

#### RecommendationSummary

```typescript
interface RecommendationSummaryProps {
  recommendation: Recommendation;
  results: AdditionalIncomeResults;
}
```

- Plain language summary of whether opportunity is worthwhile
- Verdict badge (excellent/good/modest/poor/negative)
- Bullet points with key reasons
- Non-financial considerations section
- Call to action based on verdict

#### OpportunityPresets

```typescript
interface OpportunityPresetsProps {
  onSelectPreset: (preset: OpportunityPreset) => void;
}
```

- Buttons for common side income types:
  - Overtime at current job
  - Remote freelance work
  - Part-time retail/service
  - Delivery/rideshare
  - Tutoring/teaching
- Applies typical values for Iceland
- Shows description of preset assumptions

#### OpportunityComparison

```typescript
interface OpportunityComparisonProps {
  opportunities: Opportunity[];
  onLoad: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
}
```

- Table or card grid comparing saved opportunities
- Columns: Name, Gross Rate, Net Rate, Hours/Week, Monthly Net, FI Impact
- Highlights best opportunity on each metric
- Click to load opportunity into calculator
- Delete button for each opportunity

## Calculation Engine

### Tax Calculation Functions

```typescript
// lib/calculations/tax.ts

/**
 * Icelandic tax brackets (2024 - Reykjavík rates)
 * Source: RSK (Ríkisskattstjóri)
 */
export const ICELANDIC_TAX_BRACKETS: TaxBracket[] = [
  {
    min: 0,
    max: 419_838,
    rate: 31.45,                     // útsvar ~14.5% + ríkisskattur 22.5% - persónuafsláttur
    label: 'Low bracket (31.45%)',
  },
  {
    min: 419_839,
    max: 1_133_796,
    rate: 37.95,
    label: 'Middle bracket (37.95%)',
  },
  {
    min: 1_133_797,
    max: 2_023_604,
    rate: 46.25,
    label: 'Upper-middle bracket (46.25%)',
  },
  {
    min: 2_023_605,
    max: null,
    rate: 46.25,
    label: 'High bracket (46.25%)',
  },
];

/**
 * Calculate total Icelandic tax for a given income
 *
 * Simplification: Uses progressive brackets without accounting for
 * persónuafsláttur, barnabætur, or municipality-specific útsvar variations.
 */
export function calculateIcelandicTax(income: number): number {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of ICELANDIC_TAX_BRACKETS) {
    const bracketMax = bracket.max ?? Infinity;
    const bracketMin = bracket.min;
    const bracketWidth = bracketMax - bracketMin;

    if (remainingIncome <= 0) break;

    const incomeInBracket = Math.min(remainingIncome, bracketWidth);
    const taxInBracket = incomeInBracket * (bracket.rate / 100);

    tax += taxInBracket;
    remainingIncome -= incomeInBracket;
  }

  return tax;
}

/**
 * Calculate marginal tax on additional income
 */
export function calculateMarginalTax(
  currentIncome: number,
  additionalIncome: number
): { marginalTax: number; marginalRate: number; breakdown: TaxBreakdown } {
  const currentTax = calculateIcelandicTax(currentIncome);
  const newTotalIncome = currentIncome + additionalIncome;
  const newTax = calculateIcelandicTax(newTotalIncome);

  const marginalTax = newTax - currentTax;
  const marginalRate = (marginalTax / additionalIncome) * 100;

  const currentBracket = getTaxBracket(currentIncome);
  const newBracket = getTaxBracket(newTotalIncome);
  const bracketJump = currentBracket.rate !== newBracket.rate;

  return {
    marginalTax,
    marginalRate,
    breakdown: {
      currentTaxBracket: currentBracket,
      newIncomeTaxBracket: newBracket,
      currentTotalTax: currentTax,
      newTotalTax: newTax,
      marginalTax,
      marginalRate,
      bracketJump,
    },
  };
}

/**
 * Get tax bracket for income level
 */
export function getTaxBracket(income: number): TaxBracket {
  for (const bracket of ICELANDIC_TAX_BRACKETS) {
    const bracketMax = bracket.max ?? Infinity;
    if (income >= bracket.min && income <= bracketMax) {
      return bracket;
    }
  }

  // Fallback to highest bracket
  return ICELANDIC_TAX_BRACKETS[ICELANDIC_TAX_BRACKETS.length - 1];
}
```

### Additional Income Calculation Functions

```typescript
// lib/calculations/additionalIncome.ts

/**
 * Calculate net hourly rate from additional income opportunity
 */
export function calculateNetHourlyRate(
  inputs: AdditionalIncomeInputs
): AdditionalIncomeResults {
  // Gross additional income
  const billableHours = inputs.hoursPerWeek * inputs.weeksPerYear;
  const grossAnnualIncome = inputs.grossHourlyRate * billableHours + inputs.oneTimeBonus;

  // Marginal tax calculation
  const { marginalTax, marginalRate, breakdown: taxBreakdown } = calculateMarginalTax(
    inputs.currentAnnualIncome,
    grossAnnualIncome
  );

  // Total new expenses
  const totalNewExpenses =
    inputs.newExpenses.transportation +
    inputs.newExpenses.equipment +
    inputs.newExpenses.meals +
    inputs.newExpenses.childcare +
    inputs.newExpenses.other;

  // Net annual income
  const netAnnualIncome = grossAnnualIncome - marginalTax - totalNewExpenses;

  // Total time investment
  const additionalHours = (
    inputs.additionalTime.commute +
    inputs.additionalTime.preparation +
    inputs.additionalTime.recovery
  ) * inputs.weeksPerYear;

  const totalAnnualHours = billableHours + additionalHours;

  // Net hourly rate
  const netHourlyRate = totalAnnualHours > 0 ? netAnnualIncome / totalAnnualHours : 0;
  const percentageReduction = ((inputs.grossHourlyRate - netHourlyRate) / inputs.grossHourlyRate) * 100;

  // Comparison to actual wage
  const actualWageDifference = netHourlyRate - inputs.currentActualWage;
  const actualWageDifferencePercent =
    inputs.currentActualWage > 0
      ? (actualWageDifference / inputs.currentActualWage) * 100
      : 0;

  // Monthly income
  const monthlyNetIncome = netAnnualIncome / 12;

  // Expense breakdown
  const expenseBreakdown = generateExpenseBreakdown(
    inputs.newExpenses,
    inputs.currentActualWage,
    grossAnnualIncome
  );

  // FI impact (if inputs provided)
  const fiImpact = inputs.fiInputs
    ? calculateFIImpact(inputs.fiInputs, netAnnualIncome)
    : undefined;

  // Generate recommendation
  const recommendation = generateRecommendation({
    netHourlyRate,
    grossHourlyRate: inputs.grossHourlyRate,
    actualWageDifference,
    actualWageDifferencePercent,
    totalNewExpenses,
    grossAnnualIncome,
    fiImpact,
  });

  return {
    grossAnnualIncome,
    marginalTax,
    marginalTaxRate: marginalRate,
    totalNewExpenses,
    netAnnualIncome,
    billableHours,
    additionalHours,
    totalAnnualHours,
    grossHourlyRate: inputs.grossHourlyRate,
    netHourlyRate,
    percentageReduction,
    actualWageDifference,
    actualWageDifferencePercent,
    monthlyNetIncome,
    fiImpact,
    taxBreakdown,
    expenseBreakdown,
    recommendation,
  };
}

/**
 * Generate expense breakdown for display
 */
function generateExpenseBreakdown(
  expenses: NewExpenses,
  actualWage: number,
  grossIncome: number
): ExpenseBreakdownItem[] {
  const categories: Array<{ key: keyof NewExpenses; label: string }> = [
    { key: 'transportation', label: 'Transportation' },
    { key: 'equipment', label: 'Equipment/Tools' },
    { key: 'meals', label: 'Additional Meals' },
    { key: 'childcare', label: 'Extra Childcare' },
    { key: 'other', label: 'Other Expenses' },
  ];

  return categories
    .map(({ key, label }) => ({
      category: key,
      label,
      amount: expenses[key],
      lifeEnergyHours: actualWage > 0 ? expenses[key] / actualWage : 0,
      percentage: grossIncome > 0 ? (expenses[key] / grossIncome) * 100 : 0,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}
```

### FI Impact Calculation

```typescript
// lib/calculations/fiImpact.ts

/**
 * Calculate FI timeline impact from additional income
 */
export function calculateFIImpact(
  fiInputs: FIInputs,
  netAdditionalIncome: number
): FIImpact {
  const { currentNetWorth, fiNumber, currentSavingsRate } = fiInputs;

  // Current annual savings (estimate)
  const currentAnnualIncome = currentNetWorth > 0 ? currentNetWorth / 10 : 0; // Rough estimate
  const currentAnnualSavings = currentAnnualIncome * (currentSavingsRate / 100);

  // New annual savings (including additional income)
  const newAnnualSavings = currentAnnualSavings + netAdditionalIncome;

  // Years to FI (simplified - no compound interest)
  const currentYearsToFI =
    currentAnnualSavings > 0
      ? (fiNumber - currentNetWorth) / currentAnnualSavings
      : Infinity;

  const newYearsToFI =
    newAnnualSavings > 0
      ? (fiNumber - currentNetWorth) / newAnnualSavings
      : Infinity;

  const yearsSaved = currentYearsToFI - newYearsToFI;
  const monthsSaved = yearsSaved * 12;

  // Impact category
  let impactCategory: 'minimal' | 'moderate' | 'significant';
  if (Math.abs(monthsSaved) < 6) {
    impactCategory = 'minimal';
  } else if (Math.abs(monthsSaved) < 24) {
    impactCategory = 'moderate';
  } else {
    impactCategory = 'significant';
  }

  return {
    currentYearsToFI,
    newYearsToFI,
    monthsSaved,
    currentAnnualSavings,
    newAnnualSavings,
    impactCategory,
  };
}
```

### Recommendation Generation

```typescript
// lib/utils/recommendations.ts

interface RecommendationInputs {
  netHourlyRate: number;
  grossHourlyRate: number;
  actualWageDifference: number;
  actualWageDifferencePercent: number;
  totalNewExpenses: number;
  grossAnnualIncome: number;
  fiImpact?: FIImpact;
}

/**
 * Generate recommendation based on calculation results
 */
export function generateRecommendation(
  inputs: RecommendationInputs
): Recommendation {
  const {
    netHourlyRate,
    grossHourlyRate,
    actualWageDifference,
    actualWageDifferencePercent,
    totalNewExpenses,
    grossAnnualIncome,
    fiImpact,
  } = inputs;

  // Determine verdict
  let verdict: Recommendation['verdict'];
  let color: Recommendation['color'];
  let summary: string;
  const reasons: string[] = [];

  if (netHourlyRate <= 0) {
    verdict = 'negative';
    color = 'error';
    summary = "This opportunity costs you money. Avoid unless there are compelling non-financial benefits.";
    reasons.push(`Net rate is negative (expenses exceed income after taxes)`);
  } else if (actualWageDifferencePercent < -50) {
    verdict = 'poor';
    color = 'error';
    summary = "This opportunity significantly undervalues your time compared to your current work.";
    reasons.push(`Net rate is ${Math.abs(actualWageDifferencePercent).toFixed(0)}% lower than your actual wage`);
  } else if (actualWageDifferencePercent < -15) {
    verdict = 'modest';
    color = 'warning';
    summary = "Modest financial benefit. Worth considering if you enjoy the work or gain valuable skills.";
    reasons.push(`Net rate is ${Math.abs(actualWageDifferencePercent).toFixed(0)}% lower than your actual wage`);
  } else if (actualWageDifferencePercent < 15) {
    verdict = 'good';
    color = 'warning';
    summary = "Reasonable opportunity. Similar value to your current work per hour.";
    reasons.push(`Net rate is similar to your actual wage (±${Math.abs(actualWageDifferencePercent).toFixed(0)}%)`);
  } else if (actualWageDifferencePercent >= 15 && actualWageDifferencePercent < 50) {
    verdict = 'good';
    color = 'success';
    summary = "Good opportunity. Pays better than your current work per hour.";
    reasons.push(`Net rate is ${actualWageDifferencePercent.toFixed(0)}% higher than your actual wage`);
  } else {
    verdict = 'excellent';
    color = 'success';
    summary = "Excellent opportunity. Significantly better pay than your current work.";
    reasons.push(`Net rate is ${actualWageDifferencePercent.toFixed(0)}% higher than your actual wage`);
  }

  // Add expense context
  const expensePercentage = (totalNewExpenses / grossAnnualIncome) * 100;
  if (expensePercentage > 50) {
    reasons.push(`Warning: Expenses consume ${expensePercentage.toFixed(0)}% of gross income`);
  } else if (expensePercentage > 25) {
    reasons.push(`Expenses are ${expensePercentage.toFixed(0)}% of gross income`);
  } else {
    reasons.push(`Low expense overhead (${expensePercentage.toFixed(0)}% of gross)`);
  }

  // Add FI impact
  if (fiImpact) {
    if (fiImpact.impactCategory === 'significant') {
      reasons.push(`Significant FI impact: ${fiImpact.monthsSaved.toFixed(0)} months earlier`);
    } else if (fiImpact.impactCategory === 'moderate') {
      reasons.push(`Moderate FI impact: ${fiImpact.monthsSaved.toFixed(0)} months earlier`);
    } else {
      reasons.push(`Minimal FI impact: ${fiImpact.monthsSaved.toFixed(0)} months earlier`);
    }
  }

  // Non-financial considerations (always include)
  const considerations = [
    "Skill development and learning opportunities",
    "Career advancement and networking",
    "Personal fulfillment and enjoyment",
    "Work-life balance and stress levels",
    "Flexibility and autonomy",
    "Long-term career trajectory",
  ];

  return {
    verdict,
    summary,
    reasons,
    considerations,
    color,
  };
}
```

## State Management

### AdditionalIncomeContext

```typescript
// context/AdditionalIncomeContext.tsx

interface AdditionalIncomeContextType {
  // Current inputs
  inputs: AdditionalIncomeInputs;
  setInputs: (inputs: AdditionalIncomeInputs) => void;
  updateAdditionalIncome: (fields: Partial<AdditionalIncomeInputs>) => void;
  updateNewExpenses: (expenses: Partial<NewExpenses>) => void;
  updateAdditionalTime: (time: Partial<AdditionalTime>) => void;
  updateFIInputs: (fi: Partial<FIInputs> | undefined) => void;

  // Calculation results (derived from inputs)
  results: AdditionalIncomeResults | null;

  // Opportunities (saved scenarios)
  opportunities: Opportunity[];
  saveCurrentAsOpportunity: (name: string) => void;
  loadOpportunity: (id: string) => void;
  deleteOpportunity: (id: string) => void;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetAll: () => void;

  // Integration with CalculatorContext
  loadCurrentWageData: () => void;  // Load actual wage from CalculatorContext
}
```

**Implementation notes**:
- Auto-loads `currentActualWage` and `currentAnnualIncome` from `CalculatorContext` on mount
- Recalculates `results` automatically when `inputs` change (useMemo)
- Debounced auto-save to localStorage (500ms delay)
- Max 5 opportunities enforced
- Export/import compatible with main calculator

### Custom Hooks

```typescript
// hooks/useAdditionalIncome.ts
export function useAdditionalIncome(
  inputs: AdditionalIncomeInputs
): AdditionalIncomeResults | null;

// hooks/useTaxCalculator.ts
export function useTaxCalculator(
  currentIncome: number,
  additionalIncome: number
): TaxBreakdown;

// hooks/useOpportunityComparison.ts
export function useOpportunityComparison(
  opportunities: Opportunity[]
): {
  bestNetRate: Opportunity | null;
  bestMonthlyIncome: Opportunity | null;
  bestFIImpact: Opportunity | null;
};
```

## Presets Configuration

```typescript
// lib/presets/opportunityPresets.ts

export const OPPORTUNITY_PRESETS: OpportunityPreset[] = [
  {
    id: 'overtime-current',
    label: 'Overtime at Current Job',
    description: 'Extra hours at current employer, same tax withholding',
    category: 'overtime',
    values: {
      grossHourlyRate: 0,            // User should fill based on their rate × 1.5
      hoursPerWeek: 5,
      weeksPerYear: 50,
      newExpenses: {
        transportation: 0,           // Same commute
        equipment: 0,
        meals: 50000,                // Some extra meals (10k/mo × 5 mo)
        childcare: 0,
        other: 0,
      },
      additionalTime: {
        commute: 0,                  // Same commute
        preparation: 0,
        recovery: 2,                 // Fatigue recovery
      },
    },
  },
  {
    id: 'freelance-remote',
    label: 'Remote Freelance Work',
    description: 'Work from home, flexible hours',
    category: 'freelance',
    values: {
      grossHourlyRate: 5000,         // Typical Icelandic freelance rate
      hoursPerWeek: 10,
      weeksPerYear: 50,
      newExpenses: {
        transportation: 0,           // No commute
        equipment: 30000,            // Computer, software (one-time)
        meals: 0,
        childcare: 0,
        other: 10000,                // Internet, coworking
      },
      additionalTime: {
        commute: 0,
        preparation: 1,              // Setup time
        recovery: 1,
      },
    },
  },
  {
    id: 'retail-parttime',
    label: 'Part-Time Retail/Service',
    description: 'Hourly retail or service work',
    category: 'retail',
    values: {
      grossHourlyRate: 1800,         // Typical Icelandic retail wage
      hoursPerWeek: 15,
      weeksPerYear: 50,
      newExpenses: {
        transportation: 150000,      // Commute (~12.5k/mo)
        equipment: 5000,             // Work clothes
        meals: 60000,                // Eating out (5k/mo)
        childcare: 0,
        other: 0,
      },
      additionalTime: {
        commute: 5,                  // Weekly commute hours
        preparation: 1,
        recovery: 2,
      },
    },
  },
  {
    id: 'delivery-rideshare',
    label: 'Delivery/Rideshare',
    description: 'App-based delivery or rideshare',
    category: 'delivery',
    values: {
      grossHourlyRate: 2500,         // Gross before car costs
      hoursPerWeek: 12,
      weeksPerYear: 50,
      newExpenses: {
        transportation: 250000,      // Fuel, insurance, depreciation
        equipment: 0,
        meals: 40000,                // Eating out
        childcare: 0,
        other: 20000,                // Phone plan, app fees
      },
      additionalTime: {
        commute: 0,                  // Driving is the work
        preparation: 2,              // Car prep, refueling
        recovery: 1,
      },
    },
  },
  {
    id: 'tutoring-teaching',
    label: 'Tutoring/Teaching',
    description: 'Private lessons or tutoring',
    category: 'tutoring',
    values: {
      grossHourlyRate: 4500,         // Typical tutoring rate
      hoursPerWeek: 8,
      weeksPerYear: 40,              // School year only
      newExpenses: {
        transportation: 80000,       // Travel to students
        equipment: 10000,            // Materials
        meals: 0,
        childcare: 0,
        other: 5000,
      },
      additionalTime: {
        commute: 3,
        preparation: 2,              // Lesson planning
        recovery: 0,
      },
    },
  },
];
```

## Error Handling

### Input Validation

```typescript
// lib/utils/validators.ts (extension)

export function validateAdditionalIncomeInputs(
  inputs: AdditionalIncomeInputs
): ValidationResult {
  const errors: Record<string, string> = {};

  // Current data validation
  if (inputs.currentActualWage <= 0) {
    errors['currentActualWage'] = 'Please calculate your Actual Hourly Wage first';
  }

  if (inputs.currentAnnualIncome <= 0) {
    errors['currentAnnualIncome'] = 'Annual income must be positive';
  }

  // Additional income validation
  if (inputs.grossHourlyRate < 0) {
    errors['grossHourlyRate'] = 'Hourly rate cannot be negative';
  }

  if (inputs.hoursPerWeek < 0 || inputs.hoursPerWeek > 60) {
    errors['hoursPerWeek'] = 'Hours must be between 0 and 60 per week';
  }

  if (inputs.weeksPerYear < 1 || inputs.weeksPerYear > 52) {
    errors['weeksPerYear'] = 'Weeks must be between 1 and 52';
  }

  // Expense validation
  Object.entries(inputs.newExpenses).forEach(([key, value]) => {
    if (value < 0) {
      errors[`newExpenses.${key}`] = 'Expenses cannot be negative';
    }
  });

  // Time validation
  Object.entries(inputs.additionalTime).forEach(([key, value]) => {
    if (value < 0) {
      errors[`additionalTime.${key}`] = 'Time cannot be negative';
    }
    if (value > 40) {
      errors[`additionalTime.${key}`] = 'Time seems unusually high (max 40 hrs/week)';
    }
  });

  // FI inputs validation (if provided)
  if (inputs.fiInputs) {
    if (inputs.fiInputs.currentNetWorth < 0) {
      errors['fiInputs.currentNetWorth'] = 'Net worth cannot be negative';
    }
    if (inputs.fiInputs.fiNumber <= 0) {
      errors['fiInputs.fiNumber'] = 'FI number must be positive';
    }
    if (inputs.fiInputs.currentSavingsRate < 0 || inputs.fiInputs.currentSavingsRate > 100) {
      errors['fiInputs.currentSavingsRate'] = 'Savings rate must be between 0 and 100%';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

## Testing Strategy

### Unit Tests

**Calculation Functions**:
- `calculateIcelandicTax()`: Test each tax bracket, edge cases
- `calculateMarginalTax()`: Test bracket jumps, marginal vs average rate
- `calculateNetHourlyRate()`: Test various scenarios (high/low expenses, time costs)
- `calculateFIImpact()`: Test FI date calculations
- `generateRecommendation()`: Test all verdict categories

**Test Cases**:
```typescript
// High-value opportunity
test('overtime at 1.5x rate is excellent', () => {
  // Setup inputs with overtime at 1.5× current rate
  // Expect: 'excellent' or 'good' verdict
});

// Poor opportunity
test('low-wage side job with high expenses is poor', () => {
  // Setup: Low hourly rate, high commute/expenses
  // Expect: 'poor' or 'negative' verdict
});

// Tax bracket jump
test('additional income causing bracket jump shows warning', () => {
  // Setup: Income near bracket boundary
  // Expect: bracketJump = true, higher marginal rate
});
```

### Integration Tests

- AdditionalIncomeContext state management
- Integration with CalculatorContext (loading actual wage)
- localStorage save/load cycle
- Opportunity export/import

### Component Tests

- Input components update context correctly
- Results display updates on input change
- Tax breakdown displays correctly
- Recommendation changes based on inputs
- Opportunity comparison highlights best options

### E2E Tests

- Complete flow: Enter inputs → See results → Save opportunity
- Compare multiple opportunities
- Export → Import → Data restored
- Mobile responsive behavior

## Accessibility

### ARIA Labels

- All inputs have descriptive labels
- Tax breakdown uses `aria-describedby` for explanations
- Recommendation verdict uses `role="status"` for screen readers
- Comparison table uses proper table semantics

### Keyboard Navigation

- All inputs focusable via Tab
- Preset buttons keyboard accessible
- Opportunity comparison keyboard navigable
- Modal dialogs (if any) trap focus

### Visual Accessibility

- Minimum contrast ratio 4.5:1
- Color not the only indicator (icons + text for success/warning/error)
- Focus indicators visible
- Text resizable to 200% without loss of functionality

## Performance Considerations

### Calculation Optimization

- All calculations synchronous and fast (<100ms)
- Results memoized based on inputs (useMemo)
- Debounce input changes (300ms) before recalculating

### Rendering Optimization

- Components memoized with React.memo where appropriate
- Opportunity comparison lazy-loaded
- Presets loaded asynchronously if large dataset

### Bundle Size

- Reuse existing components from Actual Hourly Wage Calculator
- Tax calculation is pure JavaScript (no external libraries)
- Keep initial bundle addition < 30KB gzipped

## Design Decisions

### Decision: Simplified Tax Calculation

**Context**: Icelandic tax system is complex (útsvar varies by municipality, persónuafsláttur, barnabætur, pension contributions).

**Options Considered**:
1. **Simplified tax brackets (chosen)**
   - Pros: Fast, client-side, no API dependencies
   - Cons: Not perfectly accurate for all users
   - Risk: Users may rely on estimates for important decisions

2. **External tax API**
   - Pros: More accurate, up-to-date
   - Cons: Requires backend, privacy concerns, API costs, complexity
   - Risk: API downtime, data leakage

**Decision**: Simplified tax brackets with clear disclaimers

**Rationale**: For a privacy-first calculator, client-side is essential. Tax estimates are "close enough" for decision-making. Prominent disclaimers remind users to consult tax professionals.

**Implications**:
- Include disclaimer on every tax display
- Update tax brackets annually (manual process)
- Consider adding municipality selector in future (optional)

**Requirements Addressed**: REQ-2, Non-functional privacy requirements

---

### Decision: Max 5 Opportunities

**Context**: Users want to compare multiple side income opportunities.

**Options Considered**:
1. **No limit**
   - Pros: Maximum flexibility
   - Cons: UI clutter, localStorage bloat, comparison overwhelm

2. **Limit to 3**
   - Pros: Simple comparison
   - Cons: May not be enough for thorough evaluation

3. **Limit to 5 (chosen)**
   - Pros: Balances flexibility with usability
   - Cons: Arbitrary number

**Decision**: Limit to 5 opportunities

**Rationale**: 5 opportunities allows comprehensive comparison without overwhelming UI. Most users evaluate 2-3 options; 5 provides headroom.

**Implications**:
- Display count badge (e.g., "3/5 saved")
- Disable "Save" button when limit reached
- Provide clear messaging

**Requirements Addressed**: REQ-8

---

### Decision: No Real-Time FI Calculation Integration

**Context**: FI timeline calculation requires multiple inputs (net worth, FI number, savings rate).

**Options Considered**:
1. **Optional FI inputs (chosen)**
   - Pros: Flexible, no dependencies
   - Cons: Users must re-enter FI data

2. **Integration with future FI Number Calculator**
   - Pros: Seamless, auto-filled
   - Cons: Tight coupling, dependency on Phase 3 feature

**Decision**: Optional FI inputs that user can fill manually

**Rationale**: Phase 2 feature shouldn't depend on Phase 3. Users who care about FI impact will fill in 3 fields. Future integration can auto-fill when FI calculator exists.

**Implications**:
- FI inputs section is collapsible/optional
- Clear labeling: "Optional: See FI timeline impact"
- If FI calculator is built later, add auto-fill hook

**Requirements Addressed**: REQ-4

---

## Requirements Traceability

### REQ-1: Evaluate Side Income Opportunity

**Architecture**:
- AdditionalIncomeContext manages all inputs and results
- calculateNetHourlyRate() performs core calculation

**Components**:
- AdditionalIncomeInputs, NewExpenseInputs, AdditionalTimeInputs
- NetRateDisplay shows final result

**Data Models**:
- AdditionalIncomeInputs, AdditionalIncomeResults

**Testing**:
- Unit tests for calculateNetHourlyRate()
- Integration tests for full calculation flow

---

### REQ-2: Understand Tax Impact

**Architecture**:
- tax.ts module handles Icelandic tax calculations
- calculateMarginalTax() computes marginal rate

**Components**:
- TaxBreakdown component displays tax details

**Data Models**:
- TaxBreakdown, TaxBracket

**Testing**:
- Unit tests for each tax bracket
- Test bracket jump detection

---

### REQ-3: Account for New Expenses

**Architecture**:
- NewExpenses type captures all expense categories
- generateExpenseBreakdown() creates display data

**Components**:
- NewExpenseInputs with preset options
- Expense breakdown display in results

**Data Models**:
- NewExpenses, ExpenseBreakdownItem

**Testing**:
- Test expense totaling
- Test life-energy conversion

---

### REQ-4: See FI Timeline Impact

**Architecture**:
- fiImpact.ts module calculates FI timeline changes
- Optional integration with user's FI data

**Components**:
- FIImpactInputs (optional section)
- FI impact display in results

**Data Models**:
- FIInputs, FIImpact

**Testing**:
- Unit tests for FI calculations
- Test impact categorization (minimal/moderate/significant)

---

### REQ-5: Compare to Actual Hourly Wage

**Architecture**:
- Integration with CalculatorContext to load actual wage
- Comparison calculation in calculateNetHourlyRate()

**Components**:
- ComparisonDisplay shows side-by-side comparison
- Visual indicator (success/warning/error)

**Data Models**:
- Uses actualWageDifference fields in results

**Testing**:
- Test comparison display logic
- Test indicator color logic

---

### REQ-6: Plain Language Summary

**Architecture**:
- generateRecommendation() produces plain language output
- Verdict categorization logic

**Components**:
- RecommendationSummary displays summary and verdict

**Data Models**:
- Recommendation type

**Testing**:
- Test each verdict category
- Test recommendation message generation

---

### REQ-7: Preset Scenarios

**Architecture**:
- opportunityPresets.ts defines common scenarios
- Presets auto-populate inputs

**Components**:
- OpportunityPresets component

**Data Models**:
- OpportunityPreset type

**Testing**:
- Test preset application
- Test each preset loads correctly

---

### REQ-8: Save and Compare Opportunities

**Architecture**:
- AdditionalIncomeContext manages opportunities array
- localStorage persistence

**Components**:
- OpportunityComparison displays side-by-side
- Highlight best on each metric

**Data Models**:
- Opportunity type

**Testing**:
- Test save/load/delete
- Test comparison highlighting

---

### REQ-9: Mobile-Friendly Experience

**Architecture**:
- Responsive Tailwind classes
- Touch-friendly input sizing

**Components**:
- All components use responsive breakpoints
- Sticky result header on mobile

**Testing**:
- Test on mobile viewports (320px+)
- Test touch interactions

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Draft - Ready for Review
