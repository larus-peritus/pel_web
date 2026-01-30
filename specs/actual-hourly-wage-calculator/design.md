# Design: Actual Hourly Wage Calculator

## Overview

**Feature**: Actual Hourly Wage Calculator
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Pages      │  │  Components  │  │    Hooks       │   │  │
│  │  │              │  │              │  │                │   │  │
│  │  │ - Calculator │  │ - InputForm  │  │ - useWageCalc  │   │  │
│  │  │ - Results    │  │ - Results    │  │ - useStorage   │   │  │
│  │  │ - Compare    │  │ - Charts     │  │ - usePresets   │   │  │
│  │  └──────┬───────┘  │ - Presets    │  └────────────────┘   │  │
│  │         │          └──────────────┘                        │  │
│  │         │                                                  │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │              Calculation Engine                     │   │  │
│  │  │  (Pure functions - no side effects)                 │   │  │
│  │  │  - calculateActualWage()                            │   │  │
│  │  │  - calculateLifeEnergy()                            │   │  │
│  │  │  - generateBreakdown()                              │   │  │
│  │  └──────┬─────────────────────────────────────────────┘   │  │
│  │         │                                                  │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │              Data Layer                             │   │  │
│  │  │  - Context Provider (app state)                     │   │  │
│  │  │  - localStorage adapter                             │   │  │
│  │  │  - JSON export/import                               │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
apps/peninganaedalifid/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home/Calculator page
│   │   ├── globals.css               # Global styles
│   │   └── compare/
│   │       └── page.tsx              # Scenario comparison page
│   │
│   ├── components/
│   │   ├── ui/                       # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── Select.tsx
│   │   │
│   │   ├── calculator/               # Calculator-specific components
│   │   │   ├── IncomeInputs.tsx
│   │   │   ├── ExpenseInputs.tsx
│   │   │   ├── TimeInputs.tsx
│   │   │   ├── PresetSelector.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   ├── BreakdownChart.tsx
│   │   │   ├── TimeChart.tsx
│   │   │   ├── LifeEnergyConverter.tsx
│   │   │   └── PlainLanguageSummary.tsx
│   │   │
│   │   └── layout/                   # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   │
│   ├── lib/
│   │   ├── calculations/             # Pure calculation functions
│   │   │   ├── wage.ts
│   │   │   ├── lifeEnergy.ts
│   │   │   └── breakdown.ts
│   │   │
│   │   ├── storage/                  # Data persistence
│   │   │   ├── localStorage.ts
│   │   │   └── exportImport.ts
│   │   │
│   │   ├── presets/                  # Preset configurations
│   │   │   └── index.ts
│   │   │
│   │   └── utils/                    # Utilities
│   │       ├── formatters.ts
│   │       └── validators.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useWageCalculator.ts
│   │   ├── useLocalStorage.ts
│   │   └── usePresets.ts
│   │
│   ├── context/                      # React Context
│   │   └── CalculatorContext.tsx
│   │
│   └── types/                        # TypeScript types
│       └── index.ts
│
├── public/
│   └── ...
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Data Models

### Core Types

```typescript
// types/index.ts

/**
 * User's income inputs
 */
export interface IncomeInputs {
  grossAnnualIncome: number;      // Annual salary before taxes
  workHoursPerWeek: number;       // Standard work hours (default: 40)
  weeksWorkedPerYear: number;     // Weeks worked (default: 50)
  additionalIncome: number;       // Bonuses, etc. (default: 0)
}

/**
 * Work-related money expenses (annual amounts)
 */
export interface MoneyExpenses {
  commute: number;                // Gas, transit, parking, tolls, wear
  clothing: number;               // Work-specific clothing
  meals: number;                  // Lunches, coffee, snacks
  decompression: number;          // "Retail therapy", unwinding costs
  childcareDelta: number;         // Extra childcare due to work
  other: number;                  // Tools, dues, education, etc.
}

/**
 * Work-related time expenses (weekly hours)
 */
export interface TimeExpenses {
  commute: number;                // Round-trip weekly total
  gettingReady: number;           // Extra prep time for work
  decompression: number;          // Time to "recover" from work
  workIllness: number;            // Weekly average of sick time
}

/**
 * Complete calculator input state
 */
export interface CalculatorInputs {
  income: IncomeInputs;
  moneyExpenses: MoneyExpenses;
  timeExpenses: TimeExpenses;
}

/**
 * Calculation results
 */
export interface CalculationResults {
  nominalHourlyWage: number;
  actualHourlyWage: number;
  percentageReduction: number;

  netAnnualIncome: number;
  totalMoneyExpenses: number;

  baseWeeklyHours: number;
  totalWeeklyHours: number;
  totalExtraHours: number;

  annualLifeEnergyHours: number;  // Total hours devoted to work per year

  // Breakdown for charts
  expenseBreakdown: ExpenseBreakdownItem[];
  timeBreakdown: TimeBreakdownItem[];
}

/**
 * Individual expense item for breakdown display
 */
export interface ExpenseBreakdownItem {
  category: string;
  label: string;
  amount: number;
  lifeEnergyHours: number;        // Hours of life this costs
  percentage: number;              // % of total expenses
}

/**
 * Individual time item for breakdown display
 */
export interface TimeBreakdownItem {
  category: string;
  label: string;
  hoursPerWeek: number;
  hoursPerYear: number;
  percentage: number;              // % of total time
}

/**
 * Saved scenario for comparison
 */
export interface Scenario {
  id: string;
  name: string;
  inputs: CalculatorInputs;
  results: CalculationResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Preset configuration
 */
export interface Preset {
  id: string;
  category: 'commute' | 'clothing' | 'meals';
  label: string;
  description: string;
  values: Partial<MoneyExpenses & TimeExpenses>;
}

/**
 * Complete app state stored in localStorage
 */
export interface StoredState {
  version: number;                 // For migration handling
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  lastUpdated: string;
}
```

### Default Values

```typescript
// lib/defaults.ts

export const DEFAULT_INCOME: IncomeInputs = {
  grossAnnualIncome: 0,
  workHoursPerWeek: 40,
  weeksWorkedPerYear: 50,
  additionalIncome: 0,
};

export const DEFAULT_MONEY_EXPENSES: MoneyExpenses = {
  commute: 0,
  clothing: 0,
  meals: 0,
  decompression: 0,
  childcareDelta: 0,
  other: 0,
};

export const DEFAULT_TIME_EXPENSES: TimeExpenses = {
  commute: 0,
  gettingReady: 0,
  decompression: 0,
  workIllness: 0,
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  income: DEFAULT_INCOME,
  moneyExpenses: DEFAULT_MONEY_EXPENSES,
  timeExpenses: DEFAULT_TIME_EXPENSES,
};
```

## Component Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Header                                                [Export] │
│  peninganaedalifid.is - Your Life Energy Calculator            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Hero Section                                            │   │
│  │  "What's your ACTUAL hourly wage?"                       │   │
│  │  Brief explanation of the concept                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  Input Section          │  │  Results Section            │  │
│  │                         │  │                             │  │
│  │  [Presets] ────────────▶│  │  ┌───────────────────────┐  │  │
│  │                         │  │  │ ACTUAL HOURLY WAGE    │  │  │
│  │  Income                 │  │  │      $XX.XX           │  │  │
│  │  ├ Gross Annual        │  │  │ vs nominal $YY.YY     │  │  │
│  │  ├ Hours/Week          │  │  │ (ZZ% reduction)       │  │  │
│  │  └ Weeks/Year          │  │  └───────────────────────┘  │  │
│  │                         │  │                             │  │
│  │  Money Expenses         │  │  Plain Language Summary     │  │
│  │  ├ Commute             │  │  "A $100 purchase costs    │  │
│  │  ├ Clothing            │  │   you X hours of life..."  │  │
│  │  ├ Meals               │  │                             │  │
│  │  ├ Decompression       │  │  ┌───────────────────────┐  │  │
│  │  ├ Childcare           │  │  │ Income Breakdown      │  │  │
│  │  └ Other               │  │  │ [Waterfall Chart]     │  │  │
│  │                         │  │  └───────────────────────┘  │  │
│  │  Time Expenses          │  │                             │  │
│  │  ├ Commute             │  │  ┌───────────────────────┐  │  │
│  │  ├ Getting Ready       │  │  │ Time Breakdown        │  │  │
│  │  ├ Decompression       │  │  │ [Pie Chart]           │  │  │
│  │  └ Work Illness        │  │  └───────────────────────┘  │  │
│  │                         │  │                             │  │
│  │  [Save Scenario]        │  │  [Life Energy Converter]   │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Expense Impact Rankings                                 │   │
│  │  Sorted by life-energy cost (highest first)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Footer - Privacy notice, About, Book reference                │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────┐
│  Header        [Menu]   │
├─────────────────────────┤
│                         │
│  Hero Section           │
│  (condensed)            │
│                         │
├─────────────────────────┤
│  Results (sticky top)   │
│  ┌───────────────────┐  │
│  │ ACTUAL: $XX.XX    │  │
│  │ vs $YY.YY (-ZZ%)  │  │
│  └───────────────────┘  │
├─────────────────────────┤
│                         │
│  [Presets ▼]            │
│                         │
│  Income Section         │
│  [Expandable]           │
│                         │
│  Money Expenses         │
│  [Expandable]           │
│                         │
│  Time Expenses          │
│  [Expandable]           │
│                         │
├─────────────────────────┤
│                         │
│  Plain Language         │
│  Summary                │
│                         │
│  Charts                 │
│  [Scrollable]           │
│                         │
│  Impact Rankings        │
│                         │
├─────────────────────────┤
│  [Save] [Export]        │
├─────────────────────────┤
│  Footer                 │
└─────────────────────────┘
```

### Key Components

#### ResultsDisplay
```typescript
interface ResultsDisplayProps {
  results: CalculationResults | null;
  isCalculating: boolean;
}
```
- Shows actual vs nominal wage
- Percentage reduction badge
- Animates on value change
- Shows loading state while calculating

#### LifeEnergyConverter
```typescript
interface LifeEnergyConverterProps {
  actualHourlyWage: number;
}
```
- Input field for dollar amount
- Shows "X hours of life energy"
- Common amount quick buttons ($50, $100, $500, $1000)

#### BreakdownChart
```typescript
interface BreakdownChartProps {
  breakdown: ExpenseBreakdownItem[];
  totalGross: number;
  totalNet: number;
}
```
- Waterfall chart showing gross → expenses → net
- Hover/tap for details
- Color-coded by category

#### PresetSelector
```typescript
interface PresetSelectorProps {
  category: 'commute' | 'clothing' | 'meals';
  onSelect: (preset: Preset) => void;
  currentValues: Partial<MoneyExpenses & TimeExpenses>;
}
```
- Dropdown or button group
- Shows which preset matches current values
- Custom option always available

## Calculation Engine

### Core Functions

```typescript
// lib/calculations/wage.ts

/**
 * Calculate nominal hourly wage (simple division)
 */
export function calculateNominalWage(income: IncomeInputs): number {
  const totalAnnualIncome = income.grossAnnualIncome + income.additionalIncome;
  const totalAnnualHours = income.workHoursPerWeek * income.weeksWorkedPerYear;

  if (totalAnnualHours === 0) return 0;
  return totalAnnualIncome / totalAnnualHours;
}

/**
 * Calculate total money expenses
 */
export function calculateTotalMoneyExpenses(expenses: MoneyExpenses): number {
  return Object.values(expenses).reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate total extra time (weekly hours)
 */
export function calculateTotalExtraTime(time: TimeExpenses): number {
  return Object.values(time).reduce((sum, val) => sum + val, 0);
}

/**
 * Calculate actual hourly wage
 */
export function calculateActualWage(inputs: CalculatorInputs): number {
  const { income, moneyExpenses, timeExpenses } = inputs;

  // Net income after work expenses
  const totalIncome = income.grossAnnualIncome + income.additionalIncome;
  const totalExpenses = calculateTotalMoneyExpenses(moneyExpenses);
  const netIncome = totalIncome - totalExpenses;

  // Total time investment
  const baseWeeklyHours = income.workHoursPerWeek;
  const extraWeeklyHours = calculateTotalExtraTime(timeExpenses);
  const totalWeeklyHours = baseWeeklyHours + extraWeeklyHours;
  const totalAnnualHours = totalWeeklyHours * income.weeksWorkedPerYear;

  if (totalAnnualHours === 0) return 0;
  return netIncome / totalAnnualHours;
}

/**
 * Calculate complete results
 */
export function calculateResults(inputs: CalculatorInputs): CalculationResults {
  const nominalWage = calculateNominalWage(inputs.income);
  const actualWage = calculateActualWage(inputs);

  const percentageReduction = nominalWage > 0
    ? ((nominalWage - actualWage) / nominalWage) * 100
    : 0;

  const totalExpenses = calculateTotalMoneyExpenses(inputs.moneyExpenses);
  const totalIncome = inputs.income.grossAnnualIncome + inputs.income.additionalIncome;
  const netIncome = totalIncome - totalExpenses;

  const baseHours = inputs.income.workHoursPerWeek;
  const extraHours = calculateTotalExtraTime(inputs.timeExpenses);
  const totalHours = baseHours + extraHours;
  const annualHours = totalHours * inputs.income.weeksWorkedPerYear;

  return {
    nominalHourlyWage: nominalWage,
    actualHourlyWage: actualWage,
    percentageReduction,
    netAnnualIncome: netIncome,
    totalMoneyExpenses: totalExpenses,
    baseWeeklyHours: baseHours,
    totalWeeklyHours: totalHours,
    totalExtraHours: extraHours,
    annualLifeEnergyHours: annualHours,
    expenseBreakdown: generateExpenseBreakdown(inputs.moneyExpenses, actualWage),
    timeBreakdown: generateTimeBreakdown(inputs.timeExpenses, baseHours, inputs.income.weeksWorkedPerYear),
  };
}
```

### Life Energy Functions

```typescript
// lib/calculations/lifeEnergy.ts

/**
 * Convert dollars to life energy hours
 */
export function dollarsToLifeEnergy(dollars: number, actualWage: number): number {
  if (actualWage <= 0) return 0;
  return dollars / actualWage;
}

/**
 * Format life energy as human-readable string
 */
export function formatLifeEnergy(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  if (hours < 24) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
    }
    return `${wholeHours}h ${minutes}m`;
  }

  const days = Math.floor(hours / 8); // 8-hour work days
  const remainingHours = Math.round(hours % 8);
  if (remainingHours === 0) {
    return `${days} work day${days !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''} ${remainingHours}h`;
}
```

## State Management

### Calculator Context

```typescript
// context/CalculatorContext.tsx

interface CalculatorContextType {
  // Current inputs
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
  updateIncome: (income: Partial<IncomeInputs>) => void;
  updateMoneyExpenses: (expenses: Partial<MoneyExpenses>) => void;
  updateTimeExpenses: (time: Partial<TimeExpenses>) => void;

  // Calculation results (derived from inputs)
  results: CalculationResults | null;

  // Scenarios
  scenarios: Scenario[];
  saveCurrentAsScenario: (name: string) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetAll: () => void;

  // Presets
  applyPreset: (preset: Preset) => void;
}
```

### Hooks

```typescript
// hooks/useWageCalculator.ts
export function useWageCalculator(inputs: CalculatorInputs): CalculationResults;

// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void];

// hooks/usePresets.ts
export function usePresets(category: PresetCategory): {
  presets: Preset[];
  detectCurrentPreset: (values: Partial<MoneyExpenses & TimeExpenses>) => Preset | null;
};
```

## Presets Configuration

```typescript
// lib/presets/index.ts

export const COMMUTE_PRESETS: Preset[] = [
  {
    id: 'commute-none',
    category: 'commute',
    label: 'Remote / No Commute',
    description: 'Work from home, no commute costs',
    values: {
      commute: 0,        // money
    },
  },
  {
    id: 'commute-short',
    category: 'commute',
    label: 'Short Commute',
    description: '< 15 min each way, low costs',
    values: {
      commute: 1200,     // ~$100/mo for gas/transit
    },
  },
  {
    id: 'commute-medium',
    category: 'commute',
    label: 'Medium Commute',
    description: '15-30 min each way',
    values: {
      commute: 3000,     // ~$250/mo
    },
  },
  {
    id: 'commute-long',
    category: 'commute',
    label: 'Long Commute',
    description: '30-60 min each way',
    values: {
      commute: 6000,     // ~$500/mo
    },
  },
  {
    id: 'commute-very-long',
    category: 'commute',
    label: 'Very Long Commute',
    description: '> 60 min each way, high costs',
    values: {
      commute: 10000,    // ~$830/mo
    },
  },
];

export const CLOTHING_PRESETS: Preset[] = [
  {
    id: 'clothing-casual',
    category: 'clothing',
    label: 'Casual',
    description: 'Minimal work-specific clothing needed',
    values: { clothing: 200 },
  },
  {
    id: 'clothing-business-casual',
    category: 'clothing',
    label: 'Business Casual',
    description: 'Some professional clothing required',
    values: { clothing: 800 },
  },
  {
    id: 'clothing-professional',
    category: 'clothing',
    label: 'Professional/Formal',
    description: 'Suits, formal wear required',
    values: { clothing: 2000 },
  },
  {
    id: 'clothing-uniform',
    category: 'clothing',
    label: 'Uniform Provided',
    description: 'Employer provides work clothing',
    values: { clothing: 0 },
  },
];

export const MEAL_PRESETS: Preset[] = [
  {
    id: 'meals-bring',
    category: 'meals',
    label: 'Bring Lunch',
    description: 'Pack lunch most days',
    values: { meals: 500 },
  },
  {
    id: 'meals-occasional',
    category: 'meals',
    label: 'Occasional Buying',
    description: 'Buy lunch 1-2 times per week',
    values: { meals: 1500 },
  },
  {
    id: 'meals-daily',
    category: 'meals',
    label: 'Buy Daily',
    description: 'Buy lunch most work days',
    values: { meals: 3500 },
  },
  {
    id: 'meals-provided',
    category: 'meals',
    label: 'Meals Provided',
    description: 'Employer provides meals',
    values: { meals: 0 },
  },
];
```

## Styling

### Design Tokens

```css
/* Tailwind config extension */

colors: {
  /* Primary - Trust, Calm */
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },

  /* Accent - Energy, Action */
  accent: {
    50: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },

  /* Success - Positive outcomes */
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },

  /* Warning - Attention needed */
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },

  /* Danger - Negative, costs */
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },

  /* Neutral - Text, backgrounds */
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
}
```

### Component Styling Patterns

```typescript
// Consistent card styling
const cardStyles = "bg-white rounded-xl shadow-sm border border-neutral-200 p-6";

// Input styling
const inputStyles = "w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base";

// Primary button
const primaryButtonStyles = "px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium transition-colors";

// Result highlight
const resultHighlightStyles = "text-4xl font-bold text-primary-700";
```

## Error Handling

### Input Validation

```typescript
// lib/utils/validators.ts

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateInputs(inputs: CalculatorInputs): ValidationResult {
  const errors: Record<string, string> = {};

  // Income validation
  if (inputs.income.grossAnnualIncome < 0) {
    errors['income.grossAnnualIncome'] = 'Income must be positive';
  }

  if (inputs.income.workHoursPerWeek < 1 || inputs.income.workHoursPerWeek > 100) {
    errors['income.workHoursPerWeek'] = 'Hours must be between 1 and 100';
  }

  if (inputs.income.weeksWorkedPerYear < 1 || inputs.income.weeksWorkedPerYear > 52) {
    errors['income.weeksWorkedPerYear'] = 'Weeks must be between 1 and 52';
  }

  // Expense validation (all must be >= 0)
  Object.entries(inputs.moneyExpenses).forEach(([key, value]) => {
    if (value < 0) {
      errors[`moneyExpenses.${key}`] = 'Expenses cannot be negative';
    }
  });

  // Time validation (all must be >= 0 and reasonable)
  Object.entries(inputs.timeExpenses).forEach(([key, value]) => {
    if (value < 0) {
      errors[`timeExpenses.${key}`] = 'Time cannot be negative';
    }
    if (value > 40) {
      errors[`timeExpenses.${key}`] = 'Time seems unusually high';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### Storage Error Handling

```typescript
// lib/storage/localStorage.ts

export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Failed to read ${key} from localStorage:`, e);
    return defaultValue;
  }
}

export function safeSetItem(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`Failed to write ${key} to localStorage:`, e);
    return false;
  }
}
```

## Testing Strategy

### Unit Tests
- All calculation functions (wage.ts, lifeEnergy.ts, breakdown.ts)
- Validators
- Formatters
- Preset detection

### Integration Tests
- Calculator context state management
- Storage save/load cycle
- Export/import cycle

### Component Tests
- Input components accept and display values correctly
- Results display updates on input change
- Charts render with correct data
- Presets apply correct values

### E2E Tests
- Complete flow: Enter inputs → See results → Save → Reload → Results preserved
- Export → Import → Values restored
- Mobile responsive behavior

## Accessibility

### Keyboard Navigation
- All inputs focusable via Tab
- Enter submits where appropriate
- Escape closes modals/dropdowns

### Screen Reader Support
- ARIA labels on all inputs
- Live regions for results updates
- Chart descriptions provided

### Visual Accessibility
- Minimum contrast ratio 4.5:1
- Focus indicators visible
- No color-only information (icons/text accompany colors)

## Performance Considerations

### Calculation Optimization
- Calculations are synchronous and fast (no async needed)
- Results memoized based on inputs
- Debounce input changes (300ms) before recalculating

### Rendering Optimization
- Charts lazy loaded
- Results component memoized
- Input sections use controlled components with local state

### Bundle Size
- Tree-shake chart library
- Lazy load comparison page
- Keep initial bundle < 100KB gzipped
