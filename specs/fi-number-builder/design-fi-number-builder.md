# Design: FI Number Builder

## Document Information

- **Feature Name**: FI Number Builder (FI-tala reiknivél)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-fi-number-builder.md

---

## 1. System Overview

### 1.1 Purpose

The FI Number Builder is a FIRE planning calculator that helps users calculate their Financial Independence target nest egg. It multiplies annual expenses by a withdrawal rate multiplier (25x, 30x, 33x, or custom) and provides Icelandic-context adjustments including pension income integration.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Foundation Integrator**: Consumes Expense Baseline, outputs for other FIRE tools
2. **Icelandic-First**: Conservative multipliers (30x-33x), pension integration, inflation warnings
3. **Scenario-Driven**: Compare multiple expense tiers and multipliers simultaneously
4. **Life Energy Aware**: Show FI number in years of work when AWH available
5. **Flexible Input**: Works with expense baseline OR custom input
6. **Educational**: Explain why Iceland needs different assumptions than US
7. **Privacy-First**: All calculations client-side, data stored locally

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Expense Source   │  │ Multiplier       │  │ Pension Income       │  │
│  │ Selector         │  │ Selector         │  │ (Optional)           │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  fiNumberBuilder: FINumberBuilderState                           │   │
│  │    - expenseSource: 'baseline' | 'custom'                        │   │
│  │    - selectedTier: ExpenseTier | null                            │   │
│  │    - customMonthlyExpense: number | null                         │   │
│  │    - multiplier: number (25, 30, 33, or custom)                  │   │
│  │    - pensionMonthlyIncome: number | null                         │   │
│  │    - targetRetirementAge: number | null                          │   │
│  │  fiNumberResults: FINumberResults                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ FI Number         │  │ Pension-Adjusted  │  │ Scenario          │  │
│  │ Calculator        │  │ FI Calculator     │  │ Comparison        │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│  ┌───────────────────┐  ┌───────────────────┐                        │  │
│  │ Life Energy       │  │ Bridge Amount     │                        │  │
│  │ Calculator        │  │ Calculator        │                        │  │
│  └───────────────────┘  └───────────────────┘                        │  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Expense Baseline  │  │ AWH Calculator    │  │
│  │ Manager           │  │ Integration       │  │ Integration       │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
FINumberBuilderCalculator (Page Component)
├── ExpenseSourceSelector
│   ├── BaselineOption (if baseline exists)
│   │   └── TierSelector (imported from expense baseline)
│   └── CustomExpenseOption
│       └── CurrencyInput (monthly expense)
│
├── MultiplierSelector
│   ├── StandardMultiplierButtons (25x, 30x, 33x)
│   │   ├── MultiplierButton (25x) [with warning badge]
│   │   ├── MultiplierButton (30x) [recommended]
│   │   └── MultiplierButton (33x)
│   ├── CustomMultiplierSlider
│   └── MultiplierExplanation (collapsible)
│
├── PensionIncomeSection (Optional, collapsible)
│   ├── PensionIncomeInput
│   ├── RetirementAgeInput
│   └── PensionExplanation
│
├── ResultsDisplay
│   ├── MainFINumber (large display)
│   ├── ExpenseBreakdown
│   │   ├── MonthlyExpenses
│   │   ├── AnnualExpenses
│   │   └── MultiplierUsed
│   ├── PensionAdjustedFINumber (if pension entered)
│   │   ├── FullFI
│   │   ├── PensionAdjustedFI
│   │   └── BridgeAmount (if retirement age < 67)
│   ├── LifeEnergyDisplay (if AWH available)
│   │   ├── YearsOfWork
│   │   └── YearsToFI (if savings rate available)
│   └── ResultsSummaryCard
│
├── ScenarioComparison (if expense baseline exists)
│   ├── ComparisonTable
│   │   ├── BarebonesRow
│   │   ├── ComfortableRow
│   │   └── DeluxeRow
│   └── ComparisonChart (bar chart)
│
├── IcelandicContextAlert
│   ├── InflationWarning (if 25x selected)
│   └── ConservativeRecommendation
│
└── EducationalPanel (Collapsible)
    ├── WhatIsFINumber
    ├── WithdrawalRateExplainer
    ├── IcelandicFactors
    └── FAQSection
```

### 2.3 Data Flow

**Calculation Flow:**
```
User Input (Expense + Multiplier) → Validation → Calculate FI Number
                                         ↓
                            Check for Pension Income
                                         ↓
                           ┌─────────────┴─────────────┐
                           ↓                           ↓
                    No Pension                    Has Pension
                           ↓                           ↓
                    Basic FI Number      Calculate Pension-Adjusted FI
                           ↓                           ↓
                    Display Results      Display Both + Bridge (if early)
```

**Scenario Comparison Flow:**
```
Expense Baseline Exists → Get All Three Tiers
                ↓
     For Each Tier: Calculate FI Number
                ↓
     Display Comparison Table + Chart
                ↓
     Highlight Selected Tier
```

---

## 3. Component Design

### 3.1 FINumberBuilderCalculator (Main Component)

**Responsibility**: Page-level container and calculation orchestrator

**Interface:**
```typescript
interface FINumberBuilderCalculatorProps {
  // No props - gets data from CalculatorContext
}

// Internal state managed via CalculatorContext
```

**Key Features:**
- Detects if expense baseline exists
- Orchestrates calculations
- Coordinates display sections
- Handles localStorage persistence

---

### 3.2 ExpenseSourceSelector Component

**Responsibility**: Toggle between expense baseline and custom input

**Interface:**
```typescript
interface ExpenseSourceSelectorProps {
  hasBaseline: boolean;
  expenseSource: 'baseline' | 'custom';
  onSourceChange: (source: 'baseline' | 'custom') => void;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Veldu útgjaldauppruna:                                 │
│                                                         │
│  ○ Nota útgjaldagrunn                                   │
│     [Tier Selector Component if baseline exists]       │
│                                                         │
│  ● Slá inn sérsniðin útgjöld                            │
│     ┌─────────────────────────────┐                    │
│     │ 450.000                  kr │  á mánuði          │
│     └─────────────────────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Logic:**
- If no baseline exists, auto-select 'custom'
- If baseline exists, default to 'baseline' with 'comfortable' tier
- Validate custom input: 0 < expense < 10,000,000 ISK/month

---

### 3.3 MultiplierSelector Component

**Responsibility**: Select withdrawal rate multiplier

**Interface:**
```typescript
interface MultiplierSelectorProps {
  multiplier: number;
  onMultiplierChange: (multiplier: number) => void;
  customMultiplier: number | null;
  onCustomMultiplierChange: (multiplier: number) => void;
}

type StandardMultiplier = 25 | 30 | 33;
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Veldu FI margfaldara:                                  │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  25x ⚠️  │  │  30x ⭐  │  │   33x    │             │
│  │ (4,0%)   │  │ (3,33%)  │  │  (3,0%)  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       ○             ●             ○                    │
│                                                         │
│  ☑ Sérsniðið:  [Slider: 20x ──●── 50x]                │
│                                                         │
│  ℹ️ Við mælum með 30x-33x fyrir Ísland vegna          │
│     hærri verðbólgu.                                   │
│                                                         │
│  [Frekari útskýringar ▼]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Three standard buttons with withdrawal rate shown
- Warning badge on 25x (too aggressive for Iceland)
- Star badge on 30x (recommended)
- Custom slider (20x-50x range)
- Collapsible explanation section

---

### 3.4 PensionIncomeSection Component

**Responsibility**: Optional pension income and retirement age inputs

**Interface:**
```typescript
interface PensionIncomeSectionProps {
  pensionMonthlyIncome: number | null;
  onPensionIncomeChange: (income: number | null) => void;
  targetRetirementAge: number | null;
  onRetirementAgeChange: (age: number | null) => void;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 Lífeyrissjóður (valfrjálst)                [✕]      │
│                                                         │
│  Ef þú ætlar að fá lífeyri frá lífeyrissjóði er hægt  │
│  að lækka FI töluna þína.                              │
│                                                         │
│  Vænt lífeyrisgreiðsla á mánuði (frá 67 ára aldri):   │
│  ┌─────────────────────────────┐                       │
│  │ 250.000                  kr │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  Markmið eftirlaunaaldur:                              │
│  ┌─────────────────────────────┐                       │
│  │ 55                     ára  │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  ⚠️ Þú þarft brúarupphæð til að ná frá 55 til 67 ára  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Collapsible section (closed by default)
- Pension income input (ISK/month)
- Retirement age input (default: 67)
- Warning if retirement age < 67 (bridge needed)
- Explanation of how pension reduces FI number

---

### 3.5 ResultsDisplay Component

**Responsibility**: Display calculated FI number and breakdowns

**Interface:**
```typescript
interface ResultsDisplayProps {
  fiNumber: number;
  monthlyExpenses: number;
  annualExpenses: number;
  multiplier: number;
  hasPension: boolean;
  pensionAdjustedFI?: number;
  bridgeAmount?: number;
  lifeEnergy?: FINumberLifeEnergy;
}

interface FINumberLifeEnergy {
  yearsOfWork: number;
  yearsToFI?: number; // if savings rate available
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                   FI TALA ÞÍN                           │
│                                                         │
│               15.600.000 kr                             │
│                                                         │
│  ───────────────────────────────────────────────────   │
│                                                         │
│  📊 Útreikningur:                                       │
│  • Mánaðarleg útgjöld:      520.000 kr                 │
│  • Árleg útgjöld:         6.240.000 kr                 │
│  • Margfaldari:                  30x                   │
│  • FI tala:              15.600.000 kr                 │
│                                                         │
│  🎯 Lífsorka:                                           │
│  • Þetta jafngildir:        6,2 árum vinnu             │
│  • Ár þar til FI:          15,3 ár (miðað við núv.    │
│                            sparnaðarhlutfall)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**With Pension:**
```
┌─────────────────────────────────────────────────────────┐
│  💰 Full FI (án lífeyris):       15.600.000 kr        │
│  🎯 Lífeyris-aðlöguð FI:          8.400.000 kr        │
│                                                         │
│  🌉 Brúarupphæð (55-67 ára):      7.488.000 kr        │
│                                                         │
│  ═══ Þú þarft samanlagt:         15.888.000 kr ═══     │
│                                                         │
│  ℹ️ Brúarupphæð dekkar útgjöld þín frá 55 til 67 ára  │
│     Eftir 67 ára þekur lífeyrir hluta af útgjöldum.   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.6 ScenarioComparison Component

**Responsibility**: Compare FI numbers across expense tiers

**Interface:**
```typescript
interface ScenarioComparisonProps {
  expenseBaseline: ExpenseBaseline;
  multiplier: number;
  selectedTier: ExpenseTier;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Samanburður á FI tölum (30x margfaldari)              │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ Stig         Árleg útgjöld    FI tala         │    │
│  ├────────────────────────────────────────────────┤    │
│  │ Lágmarks     3.000.000 kr     9.000.000 kr    │    │
│  │ ──────────────────────────────────────────     │    │
│  │                                                │    │
│  │ Þægilegt     6.240.000 kr    15.600.000 kr ⭐ │    │
│  │ ──────────────────────────────────────────────│    │
│  │                                                │    │
│  │ Lúxus       12.000.000 kr    30.000.000 kr    │    │
│  │ ──────────────────────────────────────────────│    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  [Bar Chart Visualization]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Three-row comparison table
- Highlight selected tier
- Bar chart visualization
- Shows annual expenses and FI number for each tier
- Updates in real-time when multiplier changes

---

### 3.7 IcelandicContextAlert Component

**Responsibility**: Warnings and recommendations for Icelandic context

**Interface:**
```typescript
interface IcelandicContextAlertProps {
  multiplier: number;
}
```

**Visual Layout (25x selected):**
```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Varúð: 25x margfaldari gæti verið of árásargjarn   │
│                                                         │
│  Vegna hærri verðbólgu á Íslandi mælum við með að     │
│  nota 30x eða 33x margfaldara fyrir öruggari FI.      │
│                                                         │
│  📊 Söguleg verðbólga:                                  │
│  • Ísland: ~3-4% á ári                                 │
│  • Bandaríkin: ~2-3% á ári                             │
│                                                         │
│  [Lesa meira um íslenskt samhengi]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Logic:**
- Show warning if multiplier < 28
- Show recommendation for 30x-33x
- Explain Iceland's inflation history
- Link to educational content

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * FI Number Builder Types
 */

export type ExpenseSource = 'baseline' | 'custom';

export interface FINumberBuilderState {
  // Expense source
  expenseSource: ExpenseSource;
  selectedTier: ExpenseTier | null; // if using baseline
  customMonthlyExpense: number | null; // if using custom

  // Multiplier
  multiplier: number; // 25, 30, 33, or custom
  customMultiplier: number | null; // if custom selected

  // Pension (optional)
  pensionMonthlyIncome: number | null;
  targetRetirementAge: number | null;

  // Metadata
  lastUpdated: Date;
}

export interface FINumberResults {
  // Basic FI calculation
  monthlyExpenses: number;
  annualExpenses: number;
  multiplier: number;
  withdrawalRate: number; // e.g., 0.04 for 25x
  fiNumber: number;

  // Pension adjustments (if applicable)
  hasPension: boolean;
  pensionAdjusted?: {
    pensionMonthlyIncome: number;
    pensionAnnualIncome: number;
    reducedAnnualExpenses: number;
    pensionAdjustedFI: number;
    targetRetirementAge: number;
    pensionStartAge: number; // 67
    bridgeYears: number; // years before pension starts
    bridgeAmount: number; // funds needed for bridge period
    totalNeeded: number; // bridge + pension-adjusted FI
  };

  // Life energy (if AWH available)
  lifeEnergy?: {
    actualHourlyWage: number;
    annualNetIncome: number;
    yearsOfWork: number; // fiNumber / annualNetIncome
    yearsToFI?: number; // if savings rate available
  };

  // Scenario comparison (if baseline exists)
  scenarios?: {
    barebones: ScenarioResult;
    comfortable: ScenarioResult;
    deluxe: ScenarioResult;
  };
}

export interface ScenarioResult {
  tier: ExpenseTier;
  monthlyExpenses: number;
  annualExpenses: number;
  fiNumber: number;
  difference?: {
    isk: number; // difference from selected tier
    percentage: number;
  };
}
```

### 4.2 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // FI Number Builder
  fiNumberBuilder: FINumberBuilderState | null;
  fiNumberResults: FINumberResults | null;

  // FI Number Builder Actions
  updateFINumberBuilder: (state: Partial<FINumberBuilderState>) => void;
  setExpenseSource: (source: ExpenseSource, tier?: ExpenseTier) => void;
  setCustomExpense: (amount: number) => void;
  setMultiplier: (multiplier: number) => void;
  setPensionIncome: (income: number | null, retirementAge?: number | null) => void;
  clearFINumberBuilder: () => void;

  // FI Number Builder API (for other calculators)
  getFINumber: (tier?: ExpenseTier) => number;
  hasFINumber: () => boolean;
}
```

### 4.3 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  fiNumberBuilder?: {
    expenseSource: ExpenseSource;
    selectedTier: ExpenseTier | null;
    customMonthlyExpense: number | null;
    multiplier: number;
    customMultiplier: number | null;
    pensionMonthlyIncome: number | null;
    targetRetirementAge: number | null;
    lastUpdated: string; // ISO date string
  };
}
```

---

## 5. Calculation Logic

### 5.1 Basic FI Number Calculation

**File**: `/src/lib/calculations/fiNumber.ts`

```typescript
/**
 * Calculate basic FI number
 */
export const calculateFINumber = (
  monthlyExpenses: number,
  multiplier: number
): number => {
  const annualExpenses = monthlyExpenses * 12;
  return annualExpenses * multiplier;
};

/**
 * Calculate withdrawal rate from multiplier
 */
export const calculateWithdrawalRate = (multiplier: number): number => {
  return 1 / multiplier;
};

/**
 * Get monthly expenses from source
 */
export const getMonthlyExpenses = (
  expenseSource: ExpenseSource,
  customExpense: number | null,
  expenseBaseline: ExpenseBaseline | null,
  selectedTier: ExpenseTier | null
): number => {
  if (expenseSource === 'custom' && customExpense !== null) {
    return customExpense;
  }

  if (expenseSource === 'baseline' && expenseBaseline && selectedTier) {
    return getExpenseByTier(expenseBaseline, selectedTier);
  }

  return 0;
};
```

### 5.2 Pension-Adjusted FI Calculation

```typescript
/**
 * Calculate pension-adjusted FI number
 */
export const calculatePensionAdjustedFI = (
  annualExpenses: number,
  multiplier: number,
  pensionMonthlyIncome: number,
  targetRetirementAge: number,
  pensionStartAge: number = 67
): PensionAdjustedResult => {
  const pensionAnnualIncome = pensionMonthlyIncome * 12;
  const reducedAnnualExpenses = Math.max(0, annualExpenses - pensionAnnualIncome);
  const pensionAdjustedFI = reducedAnnualExpenses * multiplier;

  // Calculate bridge amount
  const bridgeYears = Math.max(0, pensionStartAge - targetRetirementAge);
  const bridgeAmount = bridgeYears * annualExpenses;

  const totalNeeded = bridgeAmount + pensionAdjustedFI;

  return {
    pensionMonthlyIncome,
    pensionAnnualIncome,
    reducedAnnualExpenses,
    pensionAdjustedFI,
    targetRetirementAge,
    pensionStartAge,
    bridgeYears,
    bridgeAmount,
    totalNeeded,
  };
};
```

### 5.3 Life Energy Calculation

```typescript
/**
 * Calculate life energy metrics for FI number
 */
export const calculateFINumberLifeEnergy = (
  fiNumber: number,
  actualHourlyWage: number,
  annualHours: number,
  currentSavings: number = 0,
  annualSavings: number = 0
): FINumberLifeEnergy => {
  const annualNetIncome = actualHourlyWage * annualHours;
  const yearsOfWork = fiNumber / annualNetIncome;

  let yearsToFI: number | undefined;
  if (annualSavings > 0) {
    const remainingNeeded = fiNumber - currentSavings;
    yearsToFI = remainingNeeded / annualSavings;
  }

  return {
    actualHourlyWage,
    annualNetIncome,
    yearsOfWork,
    yearsToFI,
  };
};
```

### 5.4 Scenario Comparison Calculation

```typescript
/**
 * Calculate FI numbers for all three expense tiers
 */
export const calculateScenarioComparison = (
  expenseBaseline: ExpenseBaseline,
  multiplier: number,
  selectedTier: ExpenseTier
): ScenarioComparisonResult => {
  const tiers: ExpenseTier[] = ['barebones', 'comfortable', 'deluxe'];

  const scenarios: Record<ExpenseTier, ScenarioResult> = {} as any;
  const selectedFI = calculateFINumber(
    getExpenseByTier(expenseBaseline, selectedTier),
    multiplier
  );

  for (const tier of tiers) {
    const monthlyExpenses = getExpenseByTier(expenseBaseline, tier);
    const annualExpenses = monthlyExpenses * 12;
    const fiNumber = calculateFINumber(monthlyExpenses, multiplier);

    scenarios[tier] = {
      tier,
      monthlyExpenses,
      annualExpenses,
      fiNumber,
      difference: {
        isk: fiNumber - selectedFI,
        percentage: ((fiNumber - selectedFI) / selectedFI) * 100,
      },
    };
  }

  return {
    barebones: scenarios.barebones,
    comfortable: scenarios.comfortable,
    deluxe: scenarios.deluxe,
  };
};
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate all FI number results
 */
export const calculateFINumberResults = (
  state: FINumberBuilderState,
  expenseBaseline: ExpenseBaseline | null,
  actualHourlyWage: number | null,
  annualHours: number | null
): FINumberResults => {
  // Get monthly expenses
  const monthlyExpenses = getMonthlyExpenses(
    state.expenseSource,
    state.customMonthlyExpense,
    expenseBaseline,
    state.selectedTier
  );

  const annualExpenses = monthlyExpenses * 12;
  const multiplier = state.multiplier;
  const withdrawalRate = calculateWithdrawalRate(multiplier);
  const fiNumber = calculateFINumber(monthlyExpenses, multiplier);

  // Build results
  const results: FINumberResults = {
    monthlyExpenses,
    annualExpenses,
    multiplier,
    withdrawalRate,
    fiNumber,
    hasPension: false,
  };

  // Add pension adjustment if applicable
  if (
    state.pensionMonthlyIncome &&
    state.pensionMonthlyIncome > 0 &&
    state.targetRetirementAge
  ) {
    results.hasPension = true;
    results.pensionAdjusted = calculatePensionAdjustedFI(
      annualExpenses,
      multiplier,
      state.pensionMonthlyIncome,
      state.targetRetirementAge
    );
  }

  // Add life energy if AWH available
  if (actualHourlyWage && annualHours) {
    results.lifeEnergy = calculateFINumberLifeEnergy(
      fiNumber,
      actualHourlyWage,
      annualHours
    );
  }

  // Add scenario comparison if baseline exists
  if (
    state.expenseSource === 'baseline' &&
    expenseBaseline &&
    state.selectedTier
  ) {
    results.scenarios = calculateScenarioComparison(
      expenseBaseline,
      multiplier,
      state.selectedTier
    );
  }

  return results;
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

**Data Access Pattern:**
```typescript
// In FINumberBuilderCalculator component
const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();

// Check if baseline exists
if (!hasExpenseBaseline()) {
  return <BaselinePrompt />;
}

// Use TierSelector component
import { TierSelector } from '@/components/expenseBaseline';

<TierSelector
  selectedTier={selectedTier}
  onSelectTier={handleTierSelect}
  showExpenseAmount
/>
```

### 6.2 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**
```typescript
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;
const annualHours = results?.actualAnnualHours || null;

// Show life energy section only if AWH available
{actualHourlyWage && (
  <LifeEnergyDisplay fiNumber={fiNumber} actualHourlyWage={actualHourlyWage} />
)}
```

### 6.3 API for Other Calculators (Coast FIRE, Barista FIRE)

```typescript
// Exposed via CalculatorContext
const { getFINumber, hasFINumber } = useCalculator();

// Get FI number for specific tier
const fiNumber = getFINumber('comfortable');

// Check if FI number has been set
if (!hasFINumber()) {
  return <SetupFINumberPrompt />;
}
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateExpenseInput = (expense: number): ValidationResult => {
  if (expense <= 0) {
    return { valid: false, error: 'Útgjöld verða að vera jákvæð' };
  }

  if (expense > 10000000) {
    return {
      valid: false,
      error: 'Útgjöld virðast óraunhæf (> 10M kr/mán)',
      warning: true,
    };
  }

  return { valid: true };
};

const validateMultiplier = (multiplier: number): ValidationResult => {
  if (multiplier < 20 || multiplier > 50) {
    return { valid: false, error: 'Margfaldari verður að vera á milli 20x og 50x' };
  }

  if (multiplier < 25) {
    return {
      valid: true,
      warning: 'Mjög árásargjarn margfaldari - mikil áhætta',
    };
  }

  return { valid: true };
};

const validatePensionIncome = (
  pensionIncome: number,
  monthlyExpenses: number
): ValidationResult => {
  if (pensionIncome < 0) {
    return { valid: false, error: 'Lífeyrir getur ekki verið neikvæður' };
  }

  if (pensionIncome >= monthlyExpenses) {
    return {
      valid: true,
      warning: 'Lífeyrir dekkar öll útgjöld þín - þú þarft ekki FI!',
    };
  }

  return { valid: true };
};
```

### 7.2 Missing Dependencies Handling

```typescript
// No expense baseline
if (!hasExpenseBaseline() && expenseSource === 'baseline') {
  return (
    <BaselinePrompt
      message="Til að nota útgjaldagrunn verður þú að setja hann upp fyrst"
      linkUrl="/utgjaldareiknivel"
      buttonText="Setja upp útgjaldagrunn"
    />
  );
}

// No AWH for life energy
{!actualHourlyWage && (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá FI töluna í árum vinnu</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  FI-tala reiknivél                               [🔄 Export]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │ Expense Source Selector │  │ Multiplier Selector        │ │
│  │ (Left Column)           │  │ (Right Column)             │ │
│  │                         │  │                            │ │
│  │ • Baseline/Custom       │  │ • 25x / 30x / 33x         │ │
│  │ • Tier Selector         │  │ • Custom slider            │ │
│  │                         │  │ • Explanation              │ │
│  └─────────────────────────┘  └────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Pension Income Section (Collapsible)                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Results Display (Large Card)                             │ │
│  │ • FI Number (big display)                                │ │
│  │ • Expense breakdown                                      │ │
│  │ • Pension-adjusted (if applicable)                       │ │
│  │ • Life energy (if AWH available)                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Scenario Comparison (if baseline exists)                 │ │
│  │ • Table with all three tiers                             │ │
│  │ • Bar chart                                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Icelandic Context Alert (if needed)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Educational Panel (Collapsible)                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
- Stack all sections vertically
- Expense source selector first
- Multiplier selector second
- Results third
- Scenario comparison fourth (horizontal scroll table)
- Collapsibles closed by default

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- Single column layout
- Multiplier buttons stack vertically
- Comparison table scrolls horizontally
- Collapsibles default closed

**Tablet (640px-1024px):**
- Two-column grid for inputs
- Full-width results and comparison
- Multiplier buttons in row

**Desktop (>1024px):**
- Full layout as shown above
- Wider comparison chart
- Side-by-side input sections

### 8.3 Color Coding System

```typescript
const FI_NUMBER_COLORS = {
  primary: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    accent: 'bg-blue-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    accent: 'bg-amber-500',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    accent: 'bg-green-500',
  },
  pension: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    accent: 'bg-purple-500',
  },
};

// Multiplier badges
const MULTIPLIER_COLORS = {
  25: 'bg-amber-100 text-amber-800 border-amber-300', // Warning
  30: 'bg-green-100 text-green-800 border-green-300', // Recommended
  33: 'bg-blue-100 text-blue-800 border-blue-300', // Conservative
};
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `fiNumber.test.ts` - Calculation logic
- `FINumberBuilderCalculator.test.tsx` - Main component
- `MultiplierSelector.test.tsx` - Multiplier selection
- `PensionIncomeSection.test.tsx` - Pension calculations

**Test Coverage:**
```typescript
// fiNumber.test.ts
describe('calculateFINumber', () => {
  it('calculates basic FI number correctly', () => {
    expect(calculateFINumber(500000, 30)).toBe(180000000);
  });

  it('handles different multipliers', () => {
    expect(calculateFINumber(500000, 25)).toBe(150000000);
    expect(calculateFINumber(500000, 33)).toBe(198000000);
  });
});

describe('calculatePensionAdjustedFI', () => {
  it('reduces FI number when pension covers expenses', () => {
    const result = calculatePensionAdjustedFI(
      6000000, // 500k/month annual
      30,      // multiplier
      200000,  // 200k pension/month
      55       // retire at 55
    );

    expect(result.reducedAnnualExpenses).toBe(3600000); // 6M - 2.4M pension
    expect(result.pensionAdjustedFI).toBe(108000000); // 3.6M * 30
    expect(result.bridgeYears).toBe(12); // 67 - 55
    expect(result.bridgeAmount).toBe(72000000); // 12 * 6M
  });

  it('handles retirement after pension age', () => {
    const result = calculatePensionAdjustedFI(6000000, 30, 200000, 70);
    expect(result.bridgeYears).toBe(0);
    expect(result.bridgeAmount).toBe(0);
  });
});

describe('calculateScenarioComparison', () => {
  it('compares all three tiers', () => {
    const scenarios = calculateScenarioComparison(mockBaseline, 30, 'comfortable');

    expect(scenarios.barebones.fiNumber).toBe(90000000); // 250k * 12 * 30
    expect(scenarios.comfortable.fiNumber).toBe(187200000); // 520k * 12 * 30
    expect(scenarios.deluxe.fiNumber).toBe(360000000); // 1M * 12 * 30
  });
});
```

### 9.2 Integration Testing

```typescript
describe('FINumberBuilder Integration', () => {
  it('persists state to localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.setMultiplier(30);
      result.current.setCustomExpense(500000);
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain('"multiplier":30');
      expect(stored).toContain('"customMonthlyExpense":500000');
    });
  });

  it('integrates with expense baseline', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up expense baseline first
    act(() => {
      result.current.updateExpenseBaseline(mockBaseline);
    });

    // Use in FI number builder
    act(() => {
      result.current.setExpenseSource('baseline', 'comfortable');
      result.current.setMultiplier(30);
    });

    const fiNumber = result.current.fiNumberResults?.fiNumber;
    expect(fiNumber).toBe(187200000); // 520k * 12 * 30
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on multiplier buttons', () => {
    const { getByRole } = render(<MultiplierSelector />);

    expect(getByRole('button', { name: /25x.*4,0%/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /30x.*3,33%/i })).toBeInTheDocument();
  });

  it('announces FI number changes to screen readers', () => {
    const { getByRole } = render(<ResultsDisplay fiNumber={15000000} />);

    const liveRegion = getByRole('status');
    expect(liveRegion).toHaveTextContent(/FI tala.*15\.000\.000/i);
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive calculations
const fiNumberResults = useMemo(() => {
  if (!fiNumberBuilder) return null;
  return calculateFINumberResults(
    fiNumberBuilder,
    expenseBaseline,
    actualHourlyWage,
    annualHours
  );
}, [fiNumberBuilder, expenseBaseline, actualHourlyWage, annualHours]);

// Debounce custom expense input
const debouncedSetCustomExpense = useMemo(
  () => debounce((amount: number) => {
    setCustomExpense(amount);
  }, 300),
  [setCustomExpense]
);
```

### 10.2 Performance Budget

- Calculation time: <50ms
- Multiplier change response: <100ms
- Scenario comparison update: <150ms
- Page load: <2 seconds

---

## 11. Localization (Icelandic)

### 11.1 Text Content

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'FI-tala reiknivél',
  subtitle: 'Reiknaðu markmið þitt fyrir fjárhagslegt frelsi',

  // Expense source
  expenseSource: {
    title: 'Veldu útgjaldauppruna',
    baseline: 'Nota útgjaldagrunn',
    custom: 'Slá inn sérsniðin útgjöld',
    customPlaceholder: 'Mánaðarleg útgjöld',
  },

  // Multiplier
  multiplier: {
    title: 'Veldu FI margfaldara',
    standard25: '25x (4,0% úttekt)',
    standard30: '30x (3,33% úttekt)',
    standard33: '33x (3,0% úttekt)',
    custom: 'Sérsniðið',
    recommended: 'Mælt með fyrir Ísland',
    warning: 'Varúð: Of árásargjarn fyrir Ísland',
  },

  // Pension
  pension: {
    title: 'Lífeyrissjóður',
    subtitle: 'Valfrjálst - lækkar FI töluna þína',
    monthlyIncome: 'Vænt lífeyrisgreiðsla á mánuði',
    retirementAge: 'Markmið eftirlaunaaldur',
    fullFI: 'Full FI (án lífeyris)',
    pensionAdjustedFI: 'Lífeyris-aðlöguð FI',
    bridgeAmount: 'Brúarupphæð',
    bridgeExplanation: 'Upphæð sem þarf til að ná frá {earlyAge} til {pensionAge} ára',
  },

  // Results
  results: {
    yourFINumber: 'FI TALA ÞÍN',
    calculation: 'Útreikningur',
    monthlyExpenses: 'Mánaðarleg útgjöld',
    annualExpenses: 'Árleg útgjöld',
    multiplier: 'Margfaldari',
    fiNumber: 'FI tala',
    lifeEnergy: 'Lífsorka',
    yearsOfWork: 'Þetta jafngildir {years} árum vinnu',
    yearsToFI: 'Ár þar til FI',
  },

  // Scenario comparison
  scenarios: {
    title: 'Samanburður á FI tölum',
    tier: 'Stig',
    annualExpenses: 'Árleg útgjöld',
    fiNumber: 'FI tala',
  },

  // Warnings
  warnings: {
    inflation25x: 'Vegna hærri verðbólgu á Íslandi mælum við með 30x eða 33x margfaldara',
    noPension: 'Þú þarft ekki FI - lífeyrir þinn dekur öll útgjöld!',
    highExpenses: 'Útgjöld virðast óraunhæf há',
  },

  // Educational
  education: {
    whatIsFI: 'Hvað er FI tala?',
    whatIsFIExplanation: 'FI talan er sú upphæð sem þú þarft að hafa sparað til að...',
    withdrawalRate: 'Hvað er úttektarhlutfall?',
    icelandicFactors: 'Íslenskt samhengi',
  },
};
```

### 11.2 Number Formatting

```typescript
const formatFINumber = (amount: number): string => {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' kr';
};
// Example: 15.600.000 kr

const formatWithdrawalRate = (rate: number): string => {
  return (rate * 100).toFixed(2) + '%';
};
// Example: 3,33%

const formatYears = (years: number): string => {
  return years.toFixed(1) + ' ár';
};
// Example: 15,3 ár
```

---

## 12. Technical Decisions

### 12.1 Standard Multipliers: 25x, 30x, 33x

**Decision**: Offer three preset multipliers with 30x as default/recommended

**Rationale**:
- 25x (4% rule) is US-standard but risky for Iceland
- 30x (3.33% rule) is conservative and Iceland-appropriate
- 33x (3% rule) is very conservative for safety-conscious users
- Custom option for advanced users

**Alternatives Considered**:
- Slider only: Rejected (presets provide guidance)
- Just 25x (US standard): Rejected (doesn't account for Icelandic context)

### 12.2 Pension Integration

**Decision**: Optional pension income input with bridge calculation

**Rationale**:
- Most Icelanders have lífeyrissjóður
- Pension reduces needed FI number significantly
- Bridge amount critical for early retirement planning
- Makes calculator more relevant for Iceland

**Implementation**:
- Optional/collapsible (not all users plan to use pension)
- Defaults to age 67 (Icelandic pension age)
- Calculates two FI numbers: full and pension-adjusted

### 12.3 Expense Source: Baseline vs Custom

**Decision**: Offer both options with baseline as default

**Rationale**:
- Baseline provides structured, thoughtful expense planning
- Custom allows quick experimentation or users without baseline
- Flexibility serves both power users and newcomers

### 12.4 Life Energy Integration

**Decision**: Optional display when AWH available

**Rationale**:
- Core "life energy" philosophy of the app
- Helps users understand FI in time terms
- Not required for basic FI calculation
- Graceful degradation when AWH unavailable

---

## 13. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Calculate from Baseline | ExpenseSourceSelector, TierSelector | Integration with expense baseline API |
| **US-2**: Standard Multipliers | MultiplierSelector | Three buttons (25x/30x/33x) + custom |
| **US-3**: Icelandic Adjustments | IcelandicContextAlert | Warning for 25x, recommend 30x-33x |
| **US-4**: Compare Scenarios | ScenarioComparison | Table + chart for all three tiers |
| **US-5**: Life Energy Display | LifeEnergyDisplay | Years of work, years to FI |
| **US-6**: Custom Expense Input | CustomExpenseInput | Fallback if no baseline |
| **US-7**: Pension Adjustment | PensionIncomeSection | Pension input + bridge calculation |
| **FR-1**: FI Calculation | calculateFINumber() | Annual expenses × multiplier |
| **FR-2**: Expense Sources | ExpenseSourceSelector | Baseline or custom toggle |
| **FR-3**: Scenario Comparison | calculateScenarioComparison() | Three-tier calculation |
| **FR-4**: Icelandic Context | IcelandicContextAlert | Warnings and recommendations |
| **FR-5**: Pension Integration | calculatePensionAdjustedFI() | Reduced expenses + bridge |
| **FR-6**: Life Energy | calculateFINumberLifeEnergy() | FI ÷ annual income |

---

## 14. Implementation Risks and Mitigations

### Risk 1: Missing Expense Baseline

**Risk**: User tries to use baseline but hasn't set it up.

**Mitigation**:
- Detect baseline absence early
- Show BaselinePrompt component
- Fallback to custom input option
- Link to expense baseline setup

### Risk 2: Unrealistic Pension Assumptions

**Risk**: User enters optimistic pension income.

**Mitigation**:
- Validate pension income < monthly expenses
- Show warning if pension covers 100%+ of expenses
- Educational content about typical pension rates
- Clearly label as "expected" pension

### Risk 3: Multiplier Confusion

**Risk**: Users don't understand multiplier vs withdrawal rate.

**Mitigation**:
- Show both (e.g., "30x (3,33% úttekt)")
- Educational tooltips
- Collapsible explanation section
- Highlight recommended multiplier

### Risk 4: Bridge Amount Surprise

**Risk**: Users don't realize early retirement needs bridge funding.

**Mitigation**:
- Clear visual separation: Full FI vs Pension-Adjusted vs Bridge
- Warning when retirement age < 67
- Explanation of bridge concept
- Total amount prominently displayed

---

## 15. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Accessibility implementation planned

### Feasibility
- [x] Uses existing technology stack
- [x] Integrates with existing CalculatorContext
- [x] Leverages Expense Baseline API
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Icelandic context prioritized (30x-33x multipliers)
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] Consumes Expense Baseline API
- [x] Uses TierSelector component
- [x] Integrates AWH for life energy
- [x] Exposes FI number API for future calculators
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
