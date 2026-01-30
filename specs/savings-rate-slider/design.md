# Design: Savings Rate Slider

## Overview

**Feature**: Savings Rate Slider
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)
**Phase**: 2.2.1 (Savings Calculators)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Application                             │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │   Pages      │  │  Components  │  │    Hooks       │   │  │
│  │  │              │  │              │  │                │   │  │
│  │  │ - Savings    │  │ - SliderCtrl │  │ - useFICalc    │   │  │
│  │  │   Rate Page  │  │ - FIResults  │  │ - useScenario  │   │  │
│  │  │ - Scenarios  │  │ - ImpactDisp │  │ - useSnapshot  │   │  │
│  │  └──────┬───────┘  │ - FICurve    │  └────────────────┘   │  │
│  │         │          │ - Comparison │                        │  │
│  │         │          │ - WhatIf     │                        │  │
│  │         │          └──────────────┘                        │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │         FI Calculation Engine                       │   │  │
│  │  │  (Pure functions - no side effects)                 │   │  │
│  │  │  - calculateYearsToFI()                             │   │  │
│  │  │  - calculateFIDate()                                │   │  │
│  │  │  - calculateMarginalImpact()                        │   │  │
│  │  │  - calculateLifeEnergyToFI()                        │   │  │
│  │  │  - generateFICurveData()                            │   │  │
│  │  └──────┬─────────────────────────────────────────────┘   │  │
│  │         │                                                  │  │
│  │  ┌──────▼─────────────────────────────────────────────┐   │  │
│  │  │         Calculator Context                          │   │  │
│  │  │  - FI inputs state                                  │   │  │
│  │  │  - Scenarios management                             │   │  │
│  │  │  - Snapshots (progress tracking)                    │   │  │
│  │  │  - Integration with actualHourlyWage                │   │  │
│  │  │  - localStorage sync                                │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SavingsRateSliderPage
├── FIInputsSection
│   ├── FINumberInput (or FICalculator)
│   ├── IncomeInput
│   ├── ExpensesInput
│   ├── NetWorthInput (optional)
│   └── ReturnRateInput
│
├── SavingsRateSliderControl
│   ├── SliderInput (main interaction)
│   ├── NumericInput (alternative entry)
│   ├── CurrentRateIndicator
│   └── QuickAdjustButtons (+5%, +10%, etc.)
│
├── FIResultsDisplay
│   ├── FIDateDisplay (absolute + relative)
│   ├── ChangeFromBaselineIndicator
│   ├── LifeEnergyDisplay
│   └── PlainLanguageSummary
│
├── MarginalImpactPanel
│   ├── ImpactPer1Percent
│   ├── ImpactPer5Percent
│   ├── ImpactPer10Percent
│   └── CustomImpactCalculator
│
├── FICurveVisualization
│   ├── CurveChart (recharts)
│   ├── CurrentPositionMarker
│   ├── ReferenceLines (25%, 50%, 75%)
│   └── TooltipOverlay
│
├── ScenarioComparisonSection
│   ├── ScenarioList
│   │   ├── ScenarioCard (multiple)
│   │   └── AddScenarioButton
│   └── ComparisonTable
│
├── WhatIfExplorer (optional quick tests)
│   ├── WhatIfButton (multiple presets)
│   └── TemporaryResultsOverlay
│
└── ProgressTrackingSection (if snapshots exist)
    ├── ProgressChart
    ├── LatestSnapshot
    └── TrendIndicator
```

### Directory Structure

```
apps/peninganaedalifid/
├── src/
│   ├── app/
│   │   ├── sparnadarhlutfall/         # Savings rate page
│   │   │   ├── page.tsx               # Main savings rate slider page
│   │   │   └── samanburður/           # Scenario comparison page
│   │   │       └── page.tsx
│   │   └── ...
│   │
│   ├── components/
│   │   ├── fi-calculator/             # FI calculation components
│   │   │   ├── FIInputsSection.tsx
│   │   │   ├── SavingsRateSlider.tsx  # Main slider control
│   │   │   ├── FIResultsDisplay.tsx
│   │   │   ├── MarginalImpactPanel.tsx
│   │   │   ├── FICurveChart.tsx
│   │   │   ├── LifeEnergyDisplay.tsx
│   │   │   ├── ScenarioCard.tsx
│   │   │   ├── ScenarioComparison.tsx
│   │   │   ├── WhatIfExplorer.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   └── FIPlainLanguageSummary.tsx
│   │   │
│   │   └── ui/                        # Shared UI components
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── fi.ts                  # FI calculation functions
│   │   │   ├── scenarios.ts           # Scenario comparison logic
│   │   │   └── snapshots.ts           # Progress tracking logic
│   │   │
│   │   ├── utils/
│   │   │   ├── dateFormatters.ts      # Icelandic date formatting
│   │   │   └── fiValidators.ts        # FI input validation
│   │   │
│   │   └── constants/
│   │       └── fi.ts                  # FI-related constants
│   │
│   ├── hooks/
│   │   ├── useFICalculator.ts         # Main FI calculation hook
│   │   ├── useScenarios.ts            # Scenario management hook
│   │   ├── useSnapshots.ts            # Progress tracking hook
│   │   └── useFICurveData.ts          # Chart data generation hook
│   │
│   ├── context/
│   │   └── CalculatorContext.tsx      # Extended with FI state
│   │
│   └── types/
│       └── calculator.ts              # Extended with FI types
│
└── ...
```

## Data Models

### TypeScript Types

```typescript
// types/calculator.ts (additions)

/**
 * FI (Financial Independence) inputs
 */
export interface FIInputs {
  fiNumber: number;                    // Target nest egg (ISK)
  annualIncome: number;                // After work expenses (ISK)
  annualExpenses: number;              // Annual spending (ISK)
  currentNetWorth: number;             // Optional starting point (ISK)
  expectedReturnRate: number;          // Annual % (default: 7)
  fiMultiplier: number;                // 25x, 30x, etc. (default: 25)

  // Derived/calculated
  currentSavingsRate?: number;         // (Income - Expenses) / Income * 100
}

/**
 * FI calculation results
 */
export interface FIResults {
  // Primary results
  yearsToFI: number;                   // Decimal years (e.g., 8.5)
  fiDate: Date;                        // Projected FI date
  monthsToFI: number;                  // Total months (for display)

  // Marginal impact
  impactPer1Percent: {                 // Change per 1% savings rate
    months: number;
    years: number;
    workHours: number;                 // If actualHourlyWage available
  };

  impactPer5Percent: {
    months: number;
    years: number;
    workHours: number;
  };

  impactPer10Percent: {
    months: number;
    years: number;
    workHours: number;
  };

  // Life energy
  totalWorkHoursToFI: number;          // Total work-hours remaining
  totalWorkDaysToFI: number;           // Total work-days (8-hour days)
  totalWorkYearsToFI: number;          // Total work-years (2000 hours/year)

  // Progress metrics
  currentProgress: number;              // % progress to FI (0-100)
  monthlyInvestment: number;           // Monthly savings amount
  annualInvestment: number;            // Annual savings amount

  // Comparison
  changeFromBaseline?: {
    months: number;                    // Difference from baseline scenario
    years: number;
    percentage: number;
  };
}

/**
 * Savings rate scenario for comparison
 */
export interface FIScenario {
  id: string;                          // Unique identifier
  name: string;                        // User-defined name
  inputs: FIInputs;                    // Scenario inputs
  results: FIResults;                  // Calculated results
  savingsRate: number;                 // Primary differentiator
  isBaseline: boolean;                 // Is this the baseline scenario?
  createdAt: string;                   // ISO timestamp
  updatedAt: string;                   // ISO timestamp
}

/**
 * Historical snapshot for progress tracking
 */
export interface FISnapshot {
  id: string;                          // Unique identifier
  timestamp: string;                   // ISO timestamp
  savingsRate: number;                 // Savings rate at this point
  fiDate: Date;                        // FI date projection at this point
  yearsToFI: number;                   // Years to FI at this point
  currentNetWorth: number;             // Net worth at this point
  notes?: string;                      // Optional user notes
}

/**
 * FI curve data point for visualization
 */
export interface FICurveDataPoint {
  savingsRate: number;                 // X-axis value (0-100)
  yearsToFI: number;                   // Y-axis value
  monthsToFI: number;                  // For tooltip
  isCurrent: boolean;                  // Is this the current savings rate?
  isReference: boolean;                // Is this a reference point?
}

/**
 * What-if scenario (temporary adjustment)
 */
export interface WhatIfScenario {
  type: 'expense-reduction' | 'income-increase' | 'quit-work' | 'custom';
  label: string;                       // Display label
  adjustment: {
    incomeChange?: number;             // % or absolute
    expenseChange?: number;            // % or absolute
    savingsRateChange?: number;        // Direct savings rate change
  };
  result: FIResults;                   // Calculated impact
  isActive: boolean;                   // Currently being previewed
}

/**
 * Extended calculator state (additions to existing)
 */
export interface CalculatorState {
  // ... existing fields (income, expenses, actualHourlyWage, etc.)

  // FI-specific state
  fiInputs: FIInputs;
  fiResults: FIResults | null;
  scenarios: FIScenario[];
  baselineScenarioId: string | null;
  snapshots: FISnapshot[];
  whatIfScenario: WhatIfScenario | null;
}
```

### Default Values

```typescript
// lib/constants/fi.ts

export const DEFAULT_FI_INPUTS: FIInputs = {
  fiNumber: 0,                         // Must be calculated or entered
  annualIncome: 0,                     // From user
  annualExpenses: 0,                   // From user
  currentNetWorth: 0,                  // Optional
  expectedReturnRate: 7,               // 7% default
  fiMultiplier: 25,                    // 4% rule (25x expenses)
  currentSavingsRate: 0,               // Calculated
};

export const FI_CONSTANTS = {
  MIN_RETURN_RATE: 0,
  MAX_RETURN_RATE: 15,
  DEFAULT_RETURN_RATE: 7,

  MIN_FI_MULTIPLIER: 20,               // Aggressive (5% withdrawal)
  MAX_FI_MULTIPLIER: 40,               // Conservative (2.5% withdrawal)
  DEFAULT_FI_MULTIPLIER: 25,           // Standard (4% rule)

  MIN_SAVINGS_RATE: 0,
  MAX_SAVINGS_RATE: 100,

  MAX_SCENARIOS: 4,                    // Maximum comparison scenarios
  MAX_SNAPSHOTS: 100,                  // Maximum progress snapshots

  WORK_HOURS_PER_DAY: 8,
  WORK_DAYS_PER_YEAR: 250,             // 50 weeks × 5 days
  WORK_HOURS_PER_YEAR: 2000,           // 50 weeks × 40 hours
};

export const ICELANDIC_MONTHS = [
  'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
  'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
];

export const QUICK_WHAT_IF_PRESETS = [
  {
    type: 'expense-reduction',
    label: 'Hvað ef ég lækka útgjöld um 10%?',
    adjustment: { expenseChange: -10 },  // -10%
  },
  {
    type: 'expense-reduction',
    label: 'Hvað ef ég lækka útgjöld um 20%?',
    adjustment: { expenseChange: -20 },
  },
  {
    type: 'income-increase',
    label: 'Hvað ef ég auka tekjur um 20%?',
    adjustment: { incomeChange: 20 },    // +20%
  },
  {
    type: 'custom',
    label: 'Hvað ef ég hætti núna?',
    adjustment: { savingsRateChange: 0 }, // 0% savings (living off net worth)
  },
];
```

## Calculation Engine

### Core FI Calculations

```typescript
// lib/calculations/fi.ts

/**
 * Calculate years to FI using logarithmic formula
 * Based on standard FIRE mathematics
 */
export function calculateYearsToFI(
  fiNumber: number,
  annualSavings: number,
  currentNetWorth: number,
  returnRate: number
): number {
  // Handle edge cases
  if (annualSavings <= 0) {
    if (currentNetWorth >= fiNumber) return 0;
    return Infinity;
  }

  if (currentNetWorth >= fiNumber) return 0;

  const r = returnRate / 100;  // Convert percentage to decimal
  const gap = fiNumber - currentNetWorth;

  // Formula: Years = ln((FI × r / Savings) + 1) / ln(1 + r)
  // Handles compound growth of investments

  if (r === 0) {
    // No investment returns, simple division
    return gap / annualSavings;
  }

  const numerator = Math.log((fiNumber * r / annualSavings) + 1);
  const denominator = Math.log(1 + r);

  const years = numerator / denominator;

  // Sanity check
  if (!isFinite(years) || years < 0 || years > 100) {
    return Infinity;
  }

  return years;
}

/**
 * Calculate FI date from years to FI
 */
export function calculateFIDate(yearsToFI: number): Date {
  if (!isFinite(yearsToFI)) {
    // Return very far future date for display
    return new Date(2100, 0, 1);
  }

  const now = new Date();
  const millisToAdd = yearsToFI * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + millisToAdd);
}

/**
 * Calculate savings rate from income and expenses
 */
export function calculateSavingsRate(
  annualIncome: number,
  annualExpenses: number
): number {
  if (annualIncome <= 0) return 0;

  const savingsRate = ((annualIncome - annualExpenses) / annualIncome) * 100;

  // Clamp to valid range
  return Math.max(0, Math.min(100, savingsRate));
}

/**
 * Calculate annual savings from income and savings rate
 */
export function calculateAnnualSavings(
  annualIncome: number,
  savingsRate: number
): number {
  return annualIncome * (savingsRate / 100);
}

/**
 * Calculate FI number from expenses and multiplier
 */
export function calculateFINumber(
  annualExpenses: number,
  fiMultiplier: number
): number {
  return annualExpenses * fiMultiplier;
}

/**
 * Calculate marginal impact of savings rate change
 */
export function calculateMarginalImpact(
  inputs: FIInputs,
  currentYearsToFI: number,
  savingsRateChange: number,
  actualHourlyWage?: number
): { months: number; years: number; workHours: number } {
  // Calculate years to FI with adjusted savings rate
  const newSavingsRate = (inputs.currentSavingsRate || 0) + savingsRateChange;
  const newAnnualSavings = calculateAnnualSavings(inputs.annualIncome, newSavingsRate);

  const newYearsToFI = calculateYearsToFI(
    inputs.fiNumber,
    newAnnualSavings,
    inputs.currentNetWorth,
    inputs.expectedReturnRate
  );

  const yearsDifference = currentYearsToFI - newYearsToFI;
  const monthsDifference = yearsDifference * 12;

  // Calculate work hours impact
  let workHours = 0;
  if (actualHourlyWage && actualHourlyWage > 0) {
    workHours = yearsDifference * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
  }

  return {
    months: monthsDifference,
    years: yearsDifference,
    workHours,
  };
}

/**
 * Calculate complete FI results
 */
export function calculateFIResults(
  inputs: FIInputs,
  actualHourlyWage?: number,
  baselineResults?: FIResults
): FIResults {
  // Calculate savings rate if not provided
  const savingsRate = inputs.currentSavingsRate ||
    calculateSavingsRate(inputs.annualIncome, inputs.annualExpenses);

  const annualSavings = calculateAnnualSavings(inputs.annualIncome, savingsRate);
  const monthlyInvestment = annualSavings / 12;

  // Calculate years to FI
  const yearsToFI = calculateYearsToFI(
    inputs.fiNumber,
    annualSavings,
    inputs.currentNetWorth,
    inputs.expectedReturnRate
  );

  const monthsToFI = yearsToFI * 12;
  const fiDate = calculateFIDate(yearsToFI);

  // Calculate marginal impacts
  const impactPer1Percent = calculateMarginalImpact(inputs, yearsToFI, 1, actualHourlyWage);
  const impactPer5Percent = calculateMarginalImpact(inputs, yearsToFI, 5, actualHourlyWage);
  const impactPer10Percent = calculateMarginalImpact(inputs, yearsToFI, 10, actualHourlyWage);

  // Calculate life energy totals
  const totalWorkHoursToFI = yearsToFI * FI_CONSTANTS.WORK_HOURS_PER_YEAR;
  const totalWorkDaysToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_DAY;
  const totalWorkYearsToFI = totalWorkHoursToFI / FI_CONSTANTS.WORK_HOURS_PER_YEAR;

  // Calculate progress to FI
  const currentProgress = inputs.fiNumber > 0
    ? (inputs.currentNetWorth / inputs.fiNumber) * 100
    : 0;

  // Calculate change from baseline if provided
  let changeFromBaseline;
  if (baselineResults) {
    const monthsDiff = baselineResults.monthsToFI - monthsToFI;
    const yearsDiff = monthsDiff / 12;
    const percentageDiff = baselineResults.yearsToFI > 0
      ? (yearsDiff / baselineResults.yearsToFI) * 100
      : 0;

    changeFromBaseline = {
      months: monthsDiff,
      years: yearsDiff,
      percentage: percentageDiff,
    };
  }

  return {
    yearsToFI,
    fiDate,
    monthsToFI,
    impactPer1Percent,
    impactPer5Percent,
    impactPer10Percent,
    totalWorkHoursToFI,
    totalWorkDaysToFI,
    totalWorkYearsToFI,
    currentProgress,
    monthlyInvestment,
    annualInvestment: annualSavings,
    changeFromBaseline,
  };
}

/**
 * Generate FI curve data for visualization
 */
export function generateFICurveData(
  inputs: FIInputs,
  currentSavingsRate: number,
  step: number = 5
): FICurveDataPoint[] {
  const dataPoints: FICurveDataPoint[] = [];

  for (let rate = 0; rate <= 100; rate += step) {
    const annualSavings = calculateAnnualSavings(inputs.annualIncome, rate);
    const yearsToFI = calculateYearsToFI(
      inputs.fiNumber,
      annualSavings,
      inputs.currentNetWorth,
      inputs.expectedReturnRate
    );

    // Cap at 40 years for chart display
    const displayYears = Math.min(yearsToFI, 40);

    dataPoints.push({
      savingsRate: rate,
      yearsToFI: isFinite(displayYears) ? displayYears : 40,
      monthsToFI: displayYears * 12,
      isCurrent: Math.abs(rate - currentSavingsRate) < step / 2,
      isReference: rate === 25 || rate === 50 || rate === 75,
    });
  }

  return dataPoints;
}
```

### Scenario Management

```typescript
// lib/calculations/scenarios.ts

import { v4 as uuidv4 } from 'uuid';

/**
 * Create new scenario from current inputs
 */
export function createScenario(
  name: string,
  inputs: FIInputs,
  results: FIResults,
  isBaseline: boolean = false
): FIScenario {
  return {
    id: uuidv4(),
    name,
    inputs,
    results,
    savingsRate: inputs.currentSavingsRate || 0,
    isBaseline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Compare scenarios and generate comparison data
 */
export function compareScenarios(
  scenarios: FIScenario[]
): FIScenarioComparison[] {
  if (scenarios.length === 0) return [];

  // Find baseline scenario
  const baseline = scenarios.find(s => s.isBaseline) || scenarios[0];

  return scenarios.map(scenario => {
    const monthsDiff = baseline.results.monthsToFI - scenario.results.monthsToFI;
    const yearsDiff = monthsDiff / 12;

    return {
      scenario,
      vsBaseline: {
        months: monthsDiff,
        years: yearsDiff,
        percentage: baseline.results.yearsToFI > 0
          ? (yearsDiff / baseline.results.yearsToFI) * 100
          : 0,
        isBetter: monthsDiff > 0,
      },
    };
  });
}

/**
 * Find optimal savings rate scenario
 */
export function findOptimalScenario(scenarios: FIScenario[]): FIScenario | null {
  if (scenarios.length === 0) return null;

  return scenarios.reduce((optimal, current) => {
    return current.results.yearsToFI < optimal.results.yearsToFI
      ? current
      : optimal;
  });
}

interface FIScenarioComparison {
  scenario: FIScenario;
  vsBaseline: {
    months: number;
    years: number;
    percentage: number;
    isBetter: boolean;
  };
}
```

### Progress Tracking

```typescript
// lib/calculations/snapshots.ts

/**
 * Create snapshot of current FI state
 */
export function createSnapshot(
  savingsRate: number,
  fiDate: Date,
  yearsToFI: number,
  currentNetWorth: number,
  notes?: string
): FISnapshot {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    savingsRate,
    fiDate,
    yearsToFI,
    currentNetWorth,
    notes,
  };
}

/**
 * Calculate progress trend from snapshots
 */
export function calculateProgressTrend(
  snapshots: FISnapshot[]
): 'improving' | 'stable' | 'declining' | 'insufficient-data' {
  if (snapshots.length < 2) return 'insufficient-data';

  // Sort by timestamp
  const sorted = [...snapshots].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const improvement = first.yearsToFI - last.yearsToFI;

  // More than 10% improvement
  if (improvement > first.yearsToFI * 0.1) return 'improving';

  // More than 10% decline
  if (improvement < first.yearsToFI * -0.1) return 'declining';

  // Within 10% either way
  return 'stable';
}

/**
 * Calculate months closer to FI since first snapshot
 */
export function calculateProgressMonths(snapshots: FISnapshot[]): number {
  if (snapshots.length < 2) return 0;

  const sorted = [...snapshots].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // How many months closer are we?
  const improvement = (first.yearsToFI - last.yearsToFI) * 12;

  // Account for time passage
  const monthsElapsed = (new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime())
    / (1000 * 60 * 60 * 24 * 30);

  // Net improvement (closer to FI minus time that passed)
  return improvement - monthsElapsed;
}
```

## Component Design

### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header - peninganaedalifid.is                        [Export]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Sparnaðarhlutfall Reiknivél (Savings Rate Calculator)    │  │
│  │  "Sjáðu hvernig sparnaður hefur áhrif á fjármálafrelsi"   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │ INPUTS               │  │ RESULTS                         │  │
│  │                      │  │                                 │  │
│  │ FI Markmið (Target)  │  │ ┌────────────────────────────┐ │  │
│  │ □ 25.000.000 kr      │  │ │ FJÁRMÁLAFRELSI             │ │  │
│  │                      │  │ │ Ágúst 2035                 │ │  │
│  │ Árstekjur            │  │ │ (9 ár og 3 mánuðir)        │ │  │
│  │ □ 8.000.000 kr       │  │ │                            │ │  │
│  │                      │  │ │ vs. núverandi: 2 ár fyrr   │ │  │
│  │ Árleg útgjöld        │  │ └────────────────────────────┘ │  │
│  │ □ 5.000.000 kr       │  │                                 │  │
│  │                      │  │ Hver 1% sparar þér:            │  │
│  │ [Ítarefni ▼]         │  │ • 4 mánuði                     │  │
│  │  Núverandi eign      │  │ • 920 vinnustundir             │  │
│  │  □ 1.000.000 kr      │  │                                 │  │
│  │  Vænt ávöxtun        │  │ +5% = 1 ár og 8 mán. fyrr      │  │
│  │  □ 7%                │  │ +10% = 3 ár og 2 mán. fyrr     │  │
│  │                      │  │                                 │  │
│  └──────────────────────┘  └────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ SPARNAÐARHLUTFALL (Savings Rate)                          │  │
│  │                                                            │  │
│  │  [0%]────────●────────────────────────────────────[100%]  │  │
│  │              37.5%                                         │  │
│  │                                                            │  │
│  │  Núverandi: 37.5% │ Markmið: 50% (+12.5%)                 │  │
│  │                                                            │  │
│  │  [+5%]  [+10%]  [+15%]  [Skoða "Hvað ef..."]              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │ FERILL (Curve)       │  │ LÍFSORKA (Life Energy)         │  │
│  │                      │  │                                 │  │
│  │    40│              │  │ Vinnuár eftir: 9.2 ár          │  │
│  │ Ár  │●             │  │ Vinnustundir: 18.400           │  │
│  │ til │ ●            │  │                                 │  │
│  │ FI  │  ●●          │  │ Samanborið við 40% sparnaður:  │  │
│  │      │    ●●●       │  │ Þú sparar 1.840 vinnustundir  │  │
│  │     0│        ●●●●●●│  │ (= 11.5 mánaða vinna)          │  │
│  │      0%    50%  100%│  │                                 │  │
│  │      Sparnaðarhlutf.│  │ [Sjá í mánuðum] [Sjá í árum]   │  │
│  └──────────────────────┘  └────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ATBURÐARÁSIR (Scenarios)                    [+ Bæta við]  │  │
│  │                                                            │  │
│  │ Nafn          │ Sparn.│ FI dagsetning │ Mism. │ Vinna    │  │
│  │ ───────────────────────────────────────────────────────── │  │
│  │ ⭐ Núverandi  │ 37.5% │ Ágúst 2035    │   —   │ 9.2 ár   │  │
│  │ Eftir flutning│ 50%   │ Jan 2032      │ -3.7  │ 5.5 ár   │  │
│  │ Með aukavinnu │ 45%   │ Júní 2033     │ -2.2  │ 7.0 ár   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Vista] [Flytja út] [Samanburður]                             │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────┐
│  Header       [Menu]    │
├─────────────────────────┤
│ Sparnaðarhlutfall       │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ FJÁRMÁLAFRELSI      │ │
│ │ Ágúst 2035          │ │
│ │ (9 ár, 3 mán)       │ │
│ │ 2 ár fyrr ✓         │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ SPARNAÐARHLUTFALL       │
│ [0%]─────●───────[100%] │
│         37.5%           │
│ [+5%] [+10%] [+15%]     │
├─────────────────────────┤
│                         │
│ Hver 1%: 4 mánuðir      │
│ +5%: 1.7 ár fyrr        │
│ +10%: 3.2 ár fyrr       │
│                         │
├─────────────────────────┤
│ [Inntök ▼]              │
│  FI Markmið: 25M kr     │
│  Tekjur: 8M kr          │
│  Útgjöld: 5M kr         │
│  [Ítarefni...]          │
├─────────────────────────┤
│                         │
│ [Ferill 📊]             │
│ [Lífsorka ⏱]            │
│ [Atburðarásir 📋]       │
│                         │
├─────────────────────────┤
│ [Vista] [Flytja út]     │
└─────────────────────────┘
```

### Key Components

#### SavingsRateSlider Component

```typescript
interface SavingsRateSliderProps {
  value: number;                       // Current savings rate (0-100)
  onChange: (value: number) => void;   // Callback on change
  currentRate: number;                 // Default/calculated rate
  targetRate?: number;                 // Optional target
  disabled?: boolean;
  showQuickAdjust?: boolean;           // Show +5%, +10% buttons
}
```

Features:
- Large touch-friendly slider (44px minimum height)
- Dual display: slider + numeric input
- Current rate marker
- Target rate marker (if set)
- Quick adjust buttons (+5%, +10%, +15%)
- Real-time value display
- Debounced updates (100ms)

#### FIResultsDisplay Component

```typescript
interface FIResultsDisplayProps {
  results: FIResults;
  showLifeEnergy?: boolean;
  showMarginalImpact?: boolean;
  compactMode?: boolean;              // For mobile
}
```

Features:
- Large, prominent FI date display
- Icelandic date formatting
- Relative time display (X ár, Y mánuðir)
- Change indicator (vs baseline)
- Color coding (green = improvement, red = decline)
- Animated transitions on value change

#### FICurveChart Component

```typescript
interface FICurveChartProps {
  data: FICurveDataPoint[];
  currentSavingsRate: number;
  targetSavingsRate?: number;
  onPointClick?: (dataPoint: FICurveDataPoint) => void;
  height?: number;
  responsive?: boolean;
}
```

Implementation: Using recharts library
- Line chart with smooth curve
- X-axis: Savings rate (0-100%)
- Y-axis: Years to FI (0-40)
- Current position: Large highlighted dot
- Reference lines: 25%, 50%, 75% savings rates
- Tooltip on hover/tap
- Responsive sizing
- Accessibility: Keyboard navigation, ARIA labels

#### ScenarioComparison Component

```typescript
interface ScenarioComparisonProps {
  scenarios: FIScenario[];
  baselineId: string;
  onScenarioSelect?: (id: string) => void;
  onScenarioDelete?: (id: string) => void;
  onScenarioAdd?: () => void;
  maxScenarios?: number;
}
```

Features:
- Table view (desktop) / card view (mobile)
- Baseline scenario marked with star
- Color-coded differences (green = better, red = worse)
- Sort by FI date, savings rate, name
- Add scenario button
- Delete scenario with confirmation
- Load scenario into calculator

## State Management

### Calculator Context Extensions

```typescript
// context/CalculatorContext.tsx (additions)

interface CalculatorContextType {
  // ... existing context fields

  // FI-specific state
  fiInputs: FIInputs;
  setFIInputs: (inputs: FIInputs) => void;
  updateFIInputs: (partial: Partial<FIInputs>) => void;

  fiResults: FIResults | null;

  // Scenarios
  scenarios: FIScenario[];
  baselineScenarioId: string | null;
  addScenario: (name: string) => void;
  updateScenario: (id: string, updates: Partial<FIScenario>) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;
  setBaseline: (id: string) => void;

  // Snapshots (progress tracking)
  snapshots: FISnapshot[];
  addSnapshot: (notes?: string) => void;
  deleteSnapshot: (id: string) => void;
  clearSnapshots: () => void;

  // What-if exploration
  whatIfScenario: WhatIfScenario | null;
  applyWhatIf: (scenario: WhatIfScenario) => void;
  acceptWhatIf: () => void;
  cancelWhatIf: () => void;

  // Derived data
  fiCurveData: FICurveDataPoint[];
  progressTrend: 'improving' | 'stable' | 'declining' | 'insufficient-data';
}
```

### Custom Hooks

```typescript
// hooks/useFICalculator.ts

/**
 * Main FI calculation hook
 * Automatically recalculates when inputs change
 */
export function useFICalculator(
  inputs: FIInputs,
  actualHourlyWage?: number
): FIResults | null {
  return useMemo(() => {
    // Validate inputs
    if (!inputs.fiNumber || !inputs.annualIncome || !inputs.annualExpenses) {
      return null;
    }

    return calculateFIResults(inputs, actualHourlyWage);
  }, [inputs, actualHourlyWage]);
}

// hooks/useScenarios.ts

/**
 * Scenario management hook
 */
export function useScenarios() {
  const [scenarios, setScenarios] = useState<FIScenario[]>([]);
  const [baselineId, setBaselineId] = useState<string | null>(null);

  const addScenario = useCallback((name: string, inputs: FIInputs, results: FIResults) => {
    const isFirstScenario = scenarios.length === 0;
    const newScenario = createScenario(name, inputs, results, isFirstScenario);

    setScenarios(prev => [...prev, newScenario]);

    if (isFirstScenario) {
      setBaselineId(newScenario.id);
    }
  }, [scenarios]);

  // ... other scenario methods

  return {
    scenarios,
    baselineId,
    addScenario,
    // ... other methods
  };
}

// hooks/useFICurveData.ts

/**
 * Generate FI curve data for chart
 */
export function useFICurveData(
  inputs: FIInputs,
  currentSavingsRate: number
): FICurveDataPoint[] {
  return useMemo(() => {
    return generateFICurveData(inputs, currentSavingsRate);
  }, [inputs, currentSavingsRate]);
}
```

## Styling

### Design Tokens (Additions)

```typescript
// tailwind.config.ts (additions)

colors: {
  // ... existing colors

  // FI-specific colors
  fi: {
    success: '#10b981',      // Green (closer to FI)
    warning: '#f59e0b',      // Orange (attention needed)
    danger: '#ef4444',       // Red (moving away from FI)
    baseline: '#6366f1',     // Indigo (baseline scenario)
    target: '#8b5cf6',       // Purple (target savings rate)
  },
}
```

### Component Styling Patterns

```typescript
// Slider styling
const sliderStyles = {
  track: "h-3 bg-neutral-200 rounded-full",
  thumb: "h-8 w-8 bg-primary-600 rounded-full shadow-lg cursor-pointer",
  fill: "h-3 bg-primary-500 rounded-full",
  current: "absolute h-10 w-1 bg-primary-700 -translate-x-1/2",
  target: "absolute h-10 w-1 bg-fi-target -translate-x-1/2",
};

// FI date display
const fiDateStyles = {
  container: "bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200",
  date: "text-5xl font-bold text-primary-700",
  relative: "text-2xl text-primary-600 mt-2",
  change: {
    better: "text-fi-success font-semibold",
    worse: "text-fi-danger font-semibold",
    neutral: "text-neutral-600",
  },
};

// Scenario card
const scenarioCardStyles = {
  base: "bg-white rounded-lg border-2 p-4 transition-all",
  baseline: "border-fi-baseline bg-blue-50",
  optimal: "border-fi-success bg-green-50",
  normal: "border-neutral-200 hover:border-neutral-300",
  selected: "ring-2 ring-primary-500",
};
```

## Error Handling

### Input Validation

```typescript
// lib/utils/fiValidators.ts

export interface FIValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export function validateFIInputs(inputs: FIInputs): FIValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // FI Number validation
  if (inputs.fiNumber <= 0) {
    errors.fiNumber = 'FI markmið verður að vera jákvæð tala';
  }

  if (inputs.fiNumber > 1000000000) {
    warnings.fiNumber = 'FI markmið virðist vera mjög hátt';
  }

  // Income validation
  if (inputs.annualIncome <= 0) {
    errors.annualIncome = 'Árstekjur verða að vera jákvæðar';
  }

  // Expenses validation
  if (inputs.annualExpenses < 0) {
    errors.annualExpenses = 'Útgjöld geta ekki verið neikvæð';
  }

  if (inputs.annualExpenses >= inputs.annualIncome) {
    warnings.annualExpenses = 'Útgjöld eru hærri en eða jöfn tekjum (0% sparnaður)';
  }

  // Net worth validation
  if (inputs.currentNetWorth < 0) {
    errors.currentNetWorth = 'Núverandi eign getur ekki verið neikvæð';
  }

  if (inputs.currentNetWorth >= inputs.fiNumber) {
    warnings.currentNetWorth = 'Þú hefur náð fjármálafrelsi! 🎉';
  }

  // Return rate validation
  if (inputs.expectedReturnRate < FI_CONSTANTS.MIN_RETURN_RATE ||
      inputs.expectedReturnRate > FI_CONSTANTS.MAX_RETURN_RATE) {
    errors.expectedReturnRate = `Ávöxtun verður að vera á milli ${FI_CONSTANTS.MIN_RETURN_RATE}% og ${FI_CONSTANTS.MAX_RETURN_RATE}%`;
  }

  if (inputs.expectedReturnRate > 12) {
    warnings.expectedReturnRate = 'Ávöxtun yfir 12% er mjög bjartsýn';
  }

  // FI Multiplier validation
  if (inputs.fiMultiplier < FI_CONSTANTS.MIN_FI_MULTIPLIER ||
      inputs.fiMultiplier > FI_CONSTANTS.MAX_FI_MULTIPLIER) {
    errors.fiMultiplier = `Margföldun verður að vera á milli ${FI_CONSTANTS.MIN_FI_MULTIPLIER}x og ${FI_CONSTANTS.MAX_FI_MULTIPLIER}x`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}
```

### Calculation Edge Cases

```typescript
// Handle edge cases in calculations

// Case 1: Already at FI
if (currentNetWorth >= fiNumber) {
  return {
    yearsToFI: 0,
    fiDate: new Date(),
    message: 'Þú hefur náð fjármálafrelsi!',
  };
}

// Case 2: Negative savings (spending > income)
if (annualSavings <= 0) {
  return {
    yearsToFI: Infinity,
    fiDate: new Date(2100, 0, 1),
    message: 'Útgjöld eru hærri en tekjur',
    warning: true,
  };
}

// Case 3: Unrealistic timeline (>100 years)
if (yearsToFI > 100) {
  return {
    yearsToFI,
    fiDate: calculateFIDate(yearsToFI),
    message: 'Markmiðið er mjög langt í burtu. Íhugaðu að lækka útgjöld eða auka tekjur.',
    warning: true,
  };
}

// Case 4: Mathematical errors
try {
  const years = calculateYearsToFI(...);
  if (!isFinite(years) || isNaN(years)) {
    throw new Error('Ógildur útreikningur');
  }
} catch (error) {
  return {
    yearsToFI: null,
    fiDate: null,
    error: 'Villa í útreikningi. Athugaðu inntök.',
  };
}
```

## Testing Strategy

### Unit Tests

**Calculation Functions** (`lib/calculations/fi.ts`):
- `calculateYearsToFI()` with various inputs
- Edge cases: zero savings, negative savings, already at FI
- `calculateSavingsRate()` boundary conditions
- `calculateMarginalImpact()` accuracy
- `generateFICurveData()` curve shape

**Validators** (`lib/utils/fiValidators.ts`):
- All validation rules
- Error and warning messages
- Boundary conditions

**Formatters** (`lib/utils/dateFormatters.ts`):
- Icelandic date formatting
- Relative time formatting (years, months)
- Number formatting (ISK)

### Integration Tests

**useFICalculator Hook**:
- Recalculates on input changes
- Memoization works correctly
- Handles invalid inputs gracefully

**useScenarios Hook**:
- Add/update/delete scenarios
- Baseline management
- Maximum scenarios limit

**Calculator Context**:
- State updates propagate correctly
- localStorage persistence
- Export/import scenarios

### Component Tests

**SavingsRateSlider**:
- Value changes update state
- Quick adjust buttons work
- Current/target markers display correctly
- Touch-friendly on mobile

**FIResultsDisplay**:
- Displays results correctly
- Shows improvements in green, declines in red
- Handles null results gracefully
- Icelandic formatting applied

**FICurveChart**:
- Renders chart with correct data
- Current position highlighted
- Responsive to screen size
- Tooltip shows on hover/tap

**ScenarioComparison**:
- Displays all scenarios
- Sorting works
- Delete confirmation appears
- Baseline marked correctly

### E2E Tests

**Complete FI Calculation Flow**:
1. User enters FI inputs
2. System calculates and displays FI date
3. User adjusts savings rate slider
4. Results update in real-time
5. User saves scenario
6. Scenario appears in comparison table

**Scenario Comparison**:
1. Create multiple scenarios
2. Compare side-by-side
3. Load scenario into calculator
4. Delete scenario

**Progress Tracking**:
1. Create snapshot
2. Change inputs
3. Create another snapshot
4. View progress chart
5. See trend (improving/declining)

**Mobile Experience**:
1. Slider works on touch
2. Charts render correctly
3. Inputs accessible on small screens
4. Results visible while entering data

## Accessibility

### Keyboard Navigation

- All inputs: Tab order logical
- Slider: Arrow keys adjust value
- Quick adjust buttons: Enter/Space activate
- Scenario cards: Enter to load, Delete to remove
- Chart: Keyboard navigation of data points

### Screen Reader Support

```typescript
// Slider ARIA attributes
<input
  type="range"
  role="slider"
  aria-label="Sparnaðarhlutfall"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={savingsRate}
  aria-valuetext={`${savingsRate} prósent`}
/>

// Results live region
<div role="status" aria-live="polite" aria-atomic="true">
  Fjármálafrelsi: {formatFIDate(fiDate)}
</div>

// Chart alternative
<div role="img" aria-label={`Graf sem sýnir sambandið milli sparnaðarhlutfalls og ára til fjármálafrelsis. Núverandi staða: ${savingsRate}% sparnaður, ${yearsToFI} ár til fjármálafrelsis.`}>
  {/* Chart component */}
</div>
```

### Visual Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus indicators: 2px solid outline
- Color not sole indicator (icons + text for good/bad)
- Font size: 16px minimum on mobile
- Touch targets: 44px minimum

## Performance Considerations

### Calculation Optimization

```typescript
// Debounce slider updates
const debouncedCalculate = useMemo(
  () => debounce((inputs: FIInputs) => {
    const results = calculateFIResults(inputs, actualHourlyWage);
    setFIResults(results);
  }, 100),
  [actualHourlyWage]
);

// Memoize expensive calculations
const fiCurveData = useMemo(
  () => generateFICurveData(fiInputs, currentSavingsRate),
  [fiInputs, currentSavingsRate]
);

// Lazy load chart library
const FICurveChart = lazy(() => import('./FICurveChart'));
```

### Rendering Optimization

- Results display: Memoized with React.memo
- Slider component: Controlled with debounced updates
- Chart: Only re-render when data changes
- Scenario list: Virtual scrolling if > 4 scenarios

### Bundle Size

- Code split chart library (recharts)
- Lazy load scenario comparison page
- Tree-shake unused date-fns locales
- Keep FI calculator bundle < 50KB gzipped

## Integration Points

### With Actual Hourly Wage Calculator

```typescript
// Get actualHourlyWage from calculator context
const { actualHourlyWage } = useCalculatorContext();

// Use in FI calculations for life energy
const fiResults = calculateFIResults(fiInputs, actualHourlyWage);
```

### With Data Persistence

```typescript
// Save FI state to localStorage
const saveFIState = () => {
  const state = {
    fiInputs,
    scenarios,
    snapshots,
    baselineScenarioId,
  };
  localStorage.setItem('fi-calculator-state', JSON.stringify(state));
};

// Load FI state from localStorage
const loadFIState = () => {
  const saved = localStorage.getItem('fi-calculator-state');
  if (saved) {
    const state = JSON.parse(saved);
    setFIInputs(state.fiInputs);
    setScenarios(state.scenarios);
    setSnapshots(state.snapshots);
    setBaselineScenarioId(state.baselineScenarioId);
  }
};
```

### With Export/Import

```typescript
// Include FI data in export
const exportData = () => {
  const data = {
    version: 2,
    timestamp: new Date().toISOString(),

    // Existing data
    actualHourlyWage: { /* ... */ },
    subscriptions: [ /* ... */ ],

    // FI data (new)
    fiCalculator: {
      inputs: fiInputs,
      scenarios,
      snapshots,
    },
  };

  downloadJSON(data, 'peninganaedalifid-data.json');
};
```

## Icelandic Localization

### Date Formatting

```typescript
// lib/utils/dateFormatters.ts

export function formatIcelandicDate(date: Date): string {
  const month = ICELANDIC_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export function formatRelativeTime(years: number): string {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);

  const yearPart = wholeYears > 0
    ? `${wholeYears} ár`
    : '';

  const monthPart = months > 0
    ? `${months} ${months === 1 ? 'mánuður' : 'mánuðir'}`
    : '';

  return [yearPart, monthPart].filter(Boolean).join(' og ');
}
```

### Number Formatting

```typescript
// Format Icelandic numbers (10.000 not 10,000)
export function formatISK(amount: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' kr';
}
```

### UI Text Strings

```typescript
// lib/constants/icelandic.ts

export const FI_STRINGS = {
  title: 'Sparnaðarhlutfall Reiknivél',
  subtitle: 'Sjáðu hvernig sparnaður hefur áhrif á fjármálafrelsi',

  inputs: {
    fiNumber: 'FI Markmið',
    annualIncome: 'Árstekjur',
    annualExpenses: 'Árleg útgjöld',
    currentNetWorth: 'Núverandi eign',
    expectedReturn: 'Vænt ávöxtun',
    fiMultiplier: 'FI Margföldun',
  },

  results: {
    fiDate: 'Fjármálafrelsi',
    yearsToFI: 'Ár til fjármálafrelsis',
    impactPer1: 'Hver 1% sparar þér',
    lifeEnergy: 'Vinnuár eftir',
  },

  scenarios: {
    add: 'Bæta við atburðarás',
    baseline: 'Grunnlína',
    optimal: 'Besta',
    compare: 'Samanburður',
  },

  messages: {
    achieved: 'Þú hefur náð fjármálafrelsi!',
    negative: 'Útgjöld eru hærri en tekjur',
    farAway: 'Markmiðið er mjög langt í burtu',
  },
};
```

## Design Decisions

### Key Choices

**1. Slider as Primary Input**
- **Decision**: Use slider instead of numeric input as primary control
- **Rationale**: Encourages exploration and "what-if" thinking; more engaging than typing numbers
- **Trade-off**: Less precise than numeric input; mitigated by also providing numeric field

**2. Real-time Calculation Updates**
- **Decision**: Update FI date as user moves slider (with 100ms debounce)
- **Rationale**: Immediate feedback reinforces relationship between savings rate and FI timeline
- **Trade-off**: More CPU usage; acceptable given calculations are fast

**3. Life Energy Display**
- **Decision**: Always show work-hours impact alongside years/months
- **Rationale**: Aligns with app's core philosophy of relating money to time/life energy
- **Trade-off**: More complex UI; benefits outweigh complexity

**4. Maximum 4 Scenarios**
- **Decision**: Limit comparison to 4 scenarios
- **Rationale**: Prevents overwhelming comparison table; most users compare 2-3 scenarios
- **Trade-off**: Power users may want more; can export/import if needed

**5. Progress Tracking Optional**
- **Decision**: Snapshots are opt-in, not automatic
- **Rationale**: Respects user control over data collection; privacy-first
- **Trade-off**: Some users might forget to track progress; acceptable

**6. FI Number Flexibility**
- **Decision**: Allow both manual input and calculated (Expenses × Multiplier)
- **Rationale**: Serves both users who know their FI number and those learning
- **Trade-off**: More complex input section; mitigated by collapsible advanced options

**7. Icelandic-First Design**
- **Decision**: Design for Icelandic language and culture from the start
- **Rationale**: Target market is Iceland; better UX than translating English design
- **Trade-off**: More work to internationalize later; acceptable for MVP

### Options Considered but Deferred

**Monte Carlo Simulation**
- **Considered**: Show probability of FI success with variable returns
- **Deferred**: Too complex for Phase 2; Phase 6 feature
- **Reasoning**: Want to keep calculator accessible and not overwhelming

**Tax Modeling**
- **Considered**: Calculate after-tax returns and withdrawals
- **Deferred**: Requires Iceland-specific tax expertise; future enhancement
- **Reasoning**: User can input after-tax numbers manually for now

**Dynamic Expenses in Retirement**
- **Considered**: Model changing expenses (travel years, frugal later years)
- **Deferred**: Adds significant complexity; future enhancement
- **Reasoning**: Constant expenses are good first approximation

**Social Currency Integration**
- **Considered**: Allow sharing scenarios anonymously for community benchmarks
- **Deferred**: Phase 9 (Community Features)
- **Reasoning**: Want to validate single-user experience first

## Success Metrics

### Technical Metrics
- Calculation accuracy: ± 0.1% of mathematical formula
- Update latency: < 100ms (95th percentile)
- Chart render time: < 500ms
- Bundle size: < 50KB gzipped (FI calculator code)
- Accessibility score: 95+ (Lighthouse)

### User Metrics
- Feature adoption: 60%+ of Actual Hourly Wage users try FI slider
- Engagement: 3+ minutes average session time
- Scenario creation: 40%+ of users create at least 1 scenario
- Return usage: 30%+ return within 30 days
- Mobile usage: 40%+ of sessions on mobile

### Business Metrics
- Completion rate: 70%+ of users who start finish calculation
- Export rate: 20%+ export their data
- Progress tracking: 15%+ create at least one snapshot
- Feature satisfaction: 4.5+ out of 5 (if survey implemented)

---

## Summary

The Savings Rate Slider design provides:

✅ **Interactive exploration** of savings rate impact on FI timeline
✅ **Real-time feedback** with responsive slider and instant calculations
✅ **Life energy perspective** showing work-hours saved/added
✅ **Visual understanding** via FI curve chart
✅ **Scenario comparison** for evaluating life decisions
✅ **Progress tracking** with historical snapshots
✅ **Mobile-first** responsive design
✅ **Accessibility** compliant (WCAG AA)
✅ **Privacy-first** client-side calculations and localStorage
✅ **Icelandic** language and cultural considerations

This design builds on the foundation of the Actual Hourly Wage Calculator while introducing new concepts (FI planning, scenarios, progress tracking) that will support future FIRE planning features in Phase 3.
