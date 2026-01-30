# Design: Barista FIRE Planner

## Document Information

- **Feature Name**: Barista FIRE Planner (Barista FIRE Áætlun)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-barista-fire.md

---

## 1. System Overview

### 1.1 Purpose

The Barista FIRE Planner is a FIRE strategy calculator that helps users plan semi-retirement with part-time income. It calculates the gap between current savings and full FI, determines required part-time income, and projects the timeline to full financial independence. The calculator is adapted for Iceland's universal healthcare and mandatory pension system.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Strategy Calculator**: Builds on FI Number and Expense Baseline foundations
2. **Scenario-Driven**: Compare multiple part-time income scenarios side by side
3. **Icelandic-First**: Universal healthcare note, mandatory pension contributions (16%)
4. **Life Energy Aware**: Convert required income to work hours when AWH available
5. **Timeline Focused**: Clear visualization of gap period to full FI
6. **Integration-Ready**: Leverages expense baseline and FI number calculators
7. **Privacy-First**: All calculations client-side, data stored locally

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Current Savings  │  │ Scenario Builder │  │ Timeline Display     │  │
│  │ Input            │  │ (Multiple)       │  │ (Gap Period)         │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  baristaFire: BaristaFireState                                   │   │
│  │    - currentSavings: number                                      │   │
│  │    - selectedTier: ExpenseTier                                   │   │
│  │    - investmentReturnRate: number (default 5%)                   │   │
│  │    - scenarios: BaristaFireScenario[]                            │   │
│  │  baristaFireResults: BaristaFireResults                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration with:                                               │   │
│  │    - expenseBaseline (tier expenses)                             │   │
│  │    - fiNumberResults (FI target)                                 │   │
│  │    - actualHourlyWage (life energy)                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Gap Calculator    │  │ Timeline          │  │ Life Energy       │  │
│  │                   │  │ Projector         │  │ Calculator        │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Pension           │  │ Scenario          │  │ Acceleration      │  │
│  │ Contribution      │  │ Comparison        │  │ Factor            │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Expense Baseline  │  │ FI Number         │  │
│  │ Manager           │  │ Integration       │  │ Integration       │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
BaristaFireCalculator (Page Component)
├── CurrentSavingsInput
│   ├── CurrencyInput (current savings)
│   ├── ExpenseSourceSelector (tier selector or custom)
│   └── InvestmentReturnRateInput (default 5%)
│
├── GapSummaryCard
│   ├── CurrentSavingsDisplay
│   ├── FINumberDisplay
│   ├── GapAmountDisplay
│   └── StatusIndicator (Coast FIRE if gap ≤ 0)
│
├── ScenarioBuilder
│   ├── ScenarioList
│   │   ├── ScenarioCard (repeatable)
│   │   │   ├── ScenarioHeader (name, edit, delete)
│   │   │   ├── IncomeInputSection
│   │   │   │   ├── GrossIncomeInput (annual or monthly)
│   │   │   │   └── WorkHoursInput (optional, converts to income)
│   │   │   ├── NetIncomeDisplay (after 16% pension)
│   │   │   ├── RequiredWorkHoursDisplay (if AWH available)
│   │   │   ├── GapPeriodDisplay (years and months to FI)
│   │   │   └── LifeEnergyDisplay (total hours over gap)
│   │   └── AddScenarioButton
│   └── ScenarioComparisonTable
│       ├── ComparisonTableHeader
│       ├── ComparisonRow (per scenario)
│       └── ComparisonChart (bar chart or timeline)
│
├── TimelineVisualization
│   ├── TimelineChart (savings growth over time)
│   ├── GapPeriodIndicator
│   ├── FullFIMarker
│   └── CurrentAgeProjection
│
├── IcelandicContextPanel
│   ├── HealthcareNote (universal coverage)
│   ├── PensionContributionExplainer (16% mandatory)
│   ├── PartTimeWorkCulture
│   └── LífeyrissjóðurBenefits
│
└── EducationalPanel (Collapsible)
    ├── WhatIsBaristaFIRE
    ├── CoastFIREExplainer
    ├── GapPeriodStrategy
    └── FAQSection
```

### 2.3 Data Flow

**Calculation Flow:**
```
User Inputs (Savings + Tier + Scenarios) → Validation → Calculate Gap
                                                ↓
                                        Calculate FI Number
                                                ↓
                           ┌────────────────────┴────────────────────┐
                           ↓                                         ↓
                    No Gap (Coast FIRE)               Gap Exists
                           ↓                                         ↓
                Show Coast Timeline            Calculate Required Income
                           ↓                                         ↓
                Display Results                 For Each Scenario:
                                               - Net income (after pension)
                                               - Gap period duration
                                               - Life energy hours
                                               - Acceleration factor
                                                ↓
                                        Display Comparison Table
```

**Scenario Comparison Flow:**
```
Multiple Scenarios → Calculate for Each:
    ├── Timeline to FI
    ├── Required work hours
    ├── Net savings rate
    └── Acceleration vs Coast FIRE
         ↓
Display Side-by-Side Comparison
         ↓
Highlight Best/Worst scenarios
```

---

## 3. Component Design

### 3.1 BaristaFireCalculator (Main Component)

**Responsibility**: Page-level container and calculation orchestrator

**Interface:**
```typescript
interface BaristaFireCalculatorProps {
  // No props - gets data from CalculatorContext
}

// Internal state managed via CalculatorContext
```

**Key Features:**
- Detects if expense baseline and FI number exist
- Orchestrates all calculations
- Coordinates display sections
- Handles localStorage persistence

---

### 3.2 CurrentSavingsInput Component

**Responsibility**: Input current savings, expense tier, and assumptions

**Interface:**
```typescript
interface CurrentSavingsInputProps {
  currentSavings: number;
  onSavingsChange: (savings: number) => void;
  selectedTier: ExpenseTier;
  onTierChange: (tier: ExpenseTier) => void;
  investmentReturnRate: number;
  onReturnRateChange: (rate: number) => void;
  hasExpenseBaseline: boolean;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Núverandi sparnaður og markmið                         │
│                                                         │
│  Núverandi sparnaður:                                   │
│  ┌─────────────────────────────┐                       │
│  │ 10.000.000               kr │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  Útgjaldaþrep (frá útgjaldagrunni):                     │
│  [TierSelector Component]                              │
│  Valið: Þægilegt (520.000 kr/mán)                      │
│                                                         │
│  Vænt ávöxtun fjárfestinga:                             │
│  ┌─────────────────────────────┐                       │
│  │ 5,0                       % │  á ári                │
│  └─────────────────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Current savings input (ISK)
- Tier selector (if baseline exists) or custom expense input
- Investment return rate slider (1%-15%, default 5%)
- Real-time validation

---

### 3.3 GapSummaryCard Component

**Responsibility**: Display gap between current savings and FI target

**Interface:**
```typescript
interface GapSummaryCardProps {
  currentSavings: number;
  fiNumber: number;
  gap: number;
  isCoastFIRE: boolean;
  monthlyExpenses: number;
  annualExpenses: number;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 FI Bil (Gap) Yfirlit                                │
│                                                         │
│  Núverandi sparnaður:        10.000.000 kr             │
│  FI tala (markmið):          15.600.000 kr             │
│  ─────────────────────────────────────────             │
│  BIL:                         5.600.000 kr             │
│                                                         │
│  ℹ️ Þú þarft 5.600.000 kr til viðbótar til að ná      │
│     fullri fjárhagslegu sjálfstæði.                    │
│                                                         │
│  Með hlutastarfi geturðu:                              │
│  • Þekkt útgjöld þín (520.000 kr/mán)                 │
│  • Látið sparnaðinn þinn vaxa (5% á ári)              │
│  • Náð FI á færri árum en með fullri vinnu             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**With Coast FIRE:**
```
┌─────────────────────────────────────────────────────────┐
│  ✅ Coast FIRE Náð!                                     │
│                                                         │
│  Núverandi sparnaður:        16.000.000 kr             │
│  FI tala (markmið):          15.600.000 kr             │
│  ─────────────────────────────────────────             │
│  YFIRMAGN:                      400.000 kr             │
│                                                         │
│  🎉 Þú hefur náð Coast FIRE!                           │
│                                                         │
│  Sparnaður þinn mun vaxa í fullt FI án frekari        │
│  innlagna. Þú þarft bara að dekka útgjöld þín með     │
│  hlutastarfi á meðan.                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Logic:**
- If gap ≤ 0: Display Coast FIRE status
- If gap > 0: Display required additional savings
- Show monthly expenses for context
- Explain Barista FIRE strategy briefly

---

### 3.4 ScenarioBuilder Component

**Responsibility**: Create and manage multiple part-time income scenarios

**Interface:**
```typescript
interface ScenarioBuilderProps {
  scenarios: BaristaFireScenario[];
  onAddScenario: () => void;
  onUpdateScenario: (id: string, updates: Partial<BaristaFireScenario>) => void;
  onDeleteScenario: (id: string) => void;
  monthlyExpenses: number;
  actualHourlyWage: number | null;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Hlutastarf Sviðsmyndir                                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Sviðsmynd 1: "20 klst/viku"          [✏️] [🗑️]  │  │
│  │                                                 │  │
│  │ Brúttó tekjur (á ári):                          │  │
│  │ ┌─────────────────────────────┐                 │  │
│  │ │ 3.600.000                kr │                 │  │
│  │ └─────────────────────────────┘                 │  │
│  │ eða 300.000 kr/mán                              │  │
│  │                                                 │  │
│  │ Nettó tekjur (eftir lífeyri): 252.000 kr/mán   │  │
│  │ (16% lífeyrisframlag dregið frá)                │  │
│  │                                                 │  │
│  │ Vinnutímar: ~20 klst/viku (ef tímakaup 2.500)  │  │
│  │                                                 │  │
│  │ ⏱️ Bil tímabil: 7 ár og 3 mánuðir              │  │
│  │ 🎯 FI aldur: 48 ára                             │  │
│  │ ⚡ Lífsorka: 7.280 klst yfir bil tímabilið      │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Sviðsmynd 2: "Ráðgjöf"               [✏️] [🗑️]  │  │
│  │ ...                                             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  [+ Bæta við sviðsmynd]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Multiple named scenarios
- Gross income input (annual or monthly)
- Net income calculation (after 16% pension)
- Required work hours (if AWH available)
- Gap period timeline (years + months)
- Life energy total over gap period
- Edit/delete buttons per scenario

---

### 3.5 ScenarioCard Component

**Responsibility**: Single scenario with inputs and results

**Interface:**
```typescript
interface ScenarioCardProps {
  scenario: BaristaFireScenario;
  onUpdate: (updates: Partial<BaristaFireScenario>) => void;
  onDelete: () => void;
  monthlyExpenses: number;
  gapPeriodResults: GapPeriodResults;
  actualHourlyWage: number | null;
}
```

**Features:**
- Scenario name input
- Gross annual income input
- Net income display (after pension)
- Work hours calculation (income ÷ hourly wage ÷ 52 weeks)
- Gap period display (from results)
- Projected FI age
- Total life energy over gap
- Edit mode toggle
- Delete confirmation

---

### 3.6 ScenarioComparisonTable Component

**Responsibility**: Side-by-side comparison of all scenarios

**Interface:**
```typescript
interface ScenarioComparisonTableProps {
  scenarios: BaristaFireScenario[];
  results: BaristaFireScenarioResults[];
  monthlyExpenses: number;
  actualHourlyWage: number | null;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Samanburður á Sviðsmyndum                                               │
│                                                                          │
│  ┌────────────┬──────────────┬────────────┬─────────────┬──────────┐   │
│  │ Sviðsmynd  │ Brúttó tekjur│ Vinnutími  │ Bil tímabil │ Lífsorka │   │
│  ├────────────┼──────────────┼────────────┼─────────────┼──────────┤   │
│  │ 20 klst    │ 3.600.000 kr │ 20 klst/v  │ 7,3 ár      │ 7.280 h  │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  │ Ráðgjöf    │ 4.800.000 kr │ 27 klst/v  │ 5,1 ár      │ 7.140 h  │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  │ Coast FIRE │ 6.240.000 kr │ 35 klst/v  │ 8,7 ár  ⭐  │ 15.792 h │   │
│  │            │ (aðeins útg.)│            │ (engin sp.) │          │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ⭐ = Coast FIRE viðmið (bara dekka útgjöld, engin viðbótarsparnað)    │
│                                                                          │
│  [Bar Chart Visualization]                                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Table with columns: Name, Gross Income, Work Hours, Gap Period, Life Energy
- Highlight Coast FIRE baseline (income = expenses)
- Highlight best scenario (shortest gap period)
- Bar chart showing gap period comparison
- Mobile: horizontal scroll or stack cards

---

### 3.7 TimelineVisualization Component

**Responsibility**: Chart showing savings growth to full FI

**Interface:**
```typescript
interface TimelineVisualizationProps {
  currentSavings: number;
  fiNumber: number;
  scenarios: BaristaFireScenarioResults[];
  investmentReturnRate: number;
  currentAge: number | null;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Tímalína til Full FI                                   │
│                                                         │
│  Sparnaður (kr)                                         │
│  20M ┤                                        ⭐ FI     │
│      │                                    ╱             │
│  15M ┤                               ╱────              │
│      │                          ╱────                   │
│  10M ┤ ●────────────────────────  (Núverandi)           │
│      │                                                  │
│   5M ┤                                                  │
│      │                                                  │
│      └─────┬─────┬─────┬─────┬─────┬─────┬────         │
│          Núna   2år   4år   6år   8år  10år            │
│                                                         │
│  Sviðsmynd: "20 klst/viku"                              │
│  ● Núverandi sparnaður: 10.000.000 kr                  │
│  ⭐ FI markmið: 15.600.000 kr                          │
│  📅 Áætlaður tími: 7,3 ár                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Line chart showing savings growth over time
- Current savings marked
- FI number marked
- Gap period shaded
- Scenario selector dropdown
- Shows projected age at FI (if current age entered)
- Investment growth curve visualization

---

### 3.8 IcelandicContextPanel Component

**Responsibility**: Explain Icelandic-specific considerations

**Interface:**
```typescript
interface IcelandicContextPanelProps {
  // No props - static educational content
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🇮🇸 Íslenskt Samhengi                                   │
│                                                         │
│  ✅ Almenn Heilbrigðisþjónusta                          │
│  Ísland hefur alhliða heilbrigðisþjónustu sem er EKKI  │
│  tengd við starf. Þú þarft ekki að hafa áhyggjur af    │
│  sjúkratryggingu ef þú vinnur hlutastarf.              │
│                                                         │
│  💰 Lífeyrissjóður (16% skylda)                         │
│  • 12% vinnuveitandi + 4% þú = 16% samtals             │
│  • Áfram greiðslur í hlutastarfi                       │
│  • Byggir upp lífeyrisrétt þinn                        │
│  • Allar tekjur í reiknivélinni eru NETTÓ eftir        │
│    lífeyrisframlag                                     │
│                                                         │
│  👷 Hlutastarf á Íslandi                                │
│  • Hlutastarf minna algengt en í sumum löndum          │
│  • En vaxandi, sérstaklega í skapandi/þekkingar vinnu  │
│  • Sjálfstætt starfandi og ráðgjöf sveigjanlegri       │
│  • "Hlutastarf" venjulega 50-80% af fullu starfi       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Healthcare explanation (universal coverage)
- Pension contribution breakdown (16%)
- Note that pension continues in part-time
- Work culture context
- Collapsible sections for details

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Barista FIRE Types
 */

export interface BaristaFireState {
  // Current financial status
  currentSavings: number; // ISK
  selectedTier: ExpenseTier | null; // from expense baseline
  customMonthlyExpense: number | null; // if no baseline

  // Assumptions
  investmentReturnRate: number; // default 0.05 (5%)
  currentAge: number | null; // optional for age projections

  // Scenarios
  scenarios: BaristaFireScenario[];

  // Metadata
  lastUpdated: Date;
  version: number;
}

export interface BaristaFireScenario {
  id: string; // unique ID
  name: string; // user-defined name
  grossAnnualIncome: number; // ISK per year
  netAnnualIncome: number; // after 16% pension (calculated)
  workHoursPerWeek: number | null; // optional input
  order: number; // display order
}

export interface BaristaFireResults {
  // Gap calculation
  fiNumber: number;
  currentSavings: number;
  gap: number; // fiNumber - currentSavings
  isCoastFIRE: boolean; // gap <= 0

  // Expenses
  monthlyExpenses: number;
  annualExpenses: number;

  // Scenarios
  scenarioResults: BaristaFireScenarioResult[];

  // Coast FIRE baseline
  coastFIRETimeline: TimelineProjection; // income = expenses, no savings
}

export interface BaristaFireScenarioResult {
  scenarioId: string;
  scenarioName: string;

  // Income
  grossAnnualIncome: number;
  netAnnualIncome: number; // after 16% pension
  netMonthlyIncome: number;

  // Savings
  monthlySavings: number; // net income - expenses
  annualSavings: number;
  savingsRate: number; // (savings / net income)

  // Timeline
  yearsToFI: number;
  monthsToFI: number; // fractional months
  projectedFIAge: number | null; // if current age provided
  finalNestEgg: number; // projected at FI

  // Life energy (if AWH available)
  lifeEnergy?: {
    hoursPerWeek: number;
    hoursPerMonth: number;
    hoursPerYear: number;
    totalHoursOverGap: number;
    percentageOfFullTime: number; // compared to 40hr/week
  };

  // Comparison
  accelerationFactor: number; // vs Coast FIRE timeline
  compareToCoastFIRE: string; // "faster", "slower", "same"
}

export interface TimelineProjection {
  yearsToFI: number;
  monthsToFI: number;
  dataPoints: TimelineDataPoint[];
}

export interface TimelineDataPoint {
  year: number;
  month: number;
  age: number | null;
  savings: number;
  additionalSavings: number; // from income - expenses
  investmentGrowth: number;
}
```

### 4.2 Constants

```typescript
/**
 * Barista FIRE Constants
 */

export const BARISTA_FIRE_DEFAULTS = {
  investmentReturnRate: 0.05, // 5% real return
  pensionContributionRate: 0.16, // 16% total (12% employer + 4% employee)
  employerPensionRate: 0.12, // 12%
  employeePensionRate: 0.04, // 4%
  fullTimeHoursPerWeek: 40, // Icelandic standard
};

export const SCENARIO_PRESETS = [
  {
    name: '20 klst/viku',
    description: 'Hálft starf',
    hoursPerWeek: 20,
  },
  {
    name: '30 klst/viku',
    description: '75% starf',
    hoursPerWeek: 30,
  },
  {
    name: 'Ráðgjöf/Freelance',
    description: 'Sveigjanleg vinna',
    hoursPerWeek: 25,
  },
];
```

### 4.3 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // Barista FIRE
  baristaFire: BaristaFireState | null;
  baristaFireResults: BaristaFireResults | null;

  // Barista FIRE Actions
  updateBaristaFire: (state: Partial<BaristaFireState>) => void;
  setCurrentSavings: (savings: number) => void;
  setInvestmentReturnRate: (rate: number) => void;
  setCurrentAge: (age: number | null) => void;
  addScenario: (scenario: Omit<BaristaFireScenario, 'id' | 'order'>) => void;
  updateScenario: (id: string, updates: Partial<BaristaFireScenario>) => void;
  deleteScenario: (id: string) => void;
  clearBaristaFire: () => void;

  // Barista FIRE API (for other calculators)
  getGapAmount: () => number;
  isCoastFIRE: () => boolean;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  baristaFire?: {
    currentSavings: number;
    selectedTier: ExpenseTier | null;
    customMonthlyExpense: number | null;
    investmentReturnRate: number;
    currentAge: number | null;
    scenarios: StoredBaristaFireScenario[];
    lastUpdated: string; // ISO date string
    version: number;
  };
}

interface StoredBaristaFireScenario {
  id: string;
  name: string;
  grossAnnualIncome: number;
  netAnnualIncome: number;
  workHoursPerWeek: number | null;
  order: number;
}
```

---

## 5. Calculation Logic

### 5.1 Gap Calculator

**File**: `/src/lib/calculations/baristaFire.ts`

```typescript
/**
 * Calculate gap between current savings and FI number
 */
export const calculateGap = (
  currentSavings: number,
  fiNumber: number
): number => {
  return Math.max(0, fiNumber - currentSavings);
};

/**
 * Check if user has reached Coast FIRE
 */
export const isCoastFIRE = (
  currentSavings: number,
  fiNumber: number
): boolean => {
  return currentSavings >= fiNumber;
};

/**
 * Calculate minimum annual income to cover expenses
 */
export const calculateMinimumAnnualIncome = (
  annualExpenses: number
): number => {
  // Gross income needed to net annual expenses after 16% pension
  return annualExpenses / (1 - BARISTA_FIRE_DEFAULTS.pensionContributionRate);
};
```

### 5.2 Pension Contribution Calculator

```typescript
/**
 * Calculate net income after mandatory pension contributions
 */
export const calculateNetIncome = (
  grossIncome: number
): number => {
  const pensionDeduction = grossIncome * BARISTA_FIRE_DEFAULTS.pensionContributionRate;
  return grossIncome - pensionDeduction;
};

/**
 * Calculate required gross income to achieve target net income
 */
export const calculateRequiredGrossIncome = (
  targetNetIncome: number
): number => {
  return targetNetIncome / (1 - BARISTA_FIRE_DEFAULTS.pensionContributionRate);
};
```

### 5.3 Timeline Projector

```typescript
/**
 * Project timeline to full FI with part-time income
 */
export const calculateTimelineToFI = (
  currentSavings: number,
  fiNumber: number,
  netAnnualIncome: number,
  annualExpenses: number,
  investmentReturnRate: number
): TimelineProjection => {
  const annualSavings = netAnnualIncome - annualExpenses;

  if (annualSavings <= 0 && currentSavings < fiNumber) {
    // Not sustainable - spending more than earning
    // Only investment growth can reach FI (Coast FIRE path)
    return calculateCoastFIRETimeline(currentSavings, fiNumber, investmentReturnRate);
  }

  const dataPoints: TimelineDataPoint[] = [];
  let savings = currentSavings;
  let year = 0;
  let month = 0;

  while (savings < fiNumber) {
    // Monthly calculation for precision
    const monthlyInvestmentGrowth = savings * (investmentReturnRate / 12);
    const monthlySavings = annualSavings / 12;

    dataPoints.push({
      year,
      month,
      age: null, // populated later if currentAge provided
      savings,
      additionalSavings: monthlySavings,
      investmentGrowth: monthlyInvestmentGrowth,
    });

    savings += monthlySavings + monthlyInvestmentGrowth;
    month++;

    if (month === 12) {
      month = 0;
      year++;
    }

    // Safety: max 100 years
    if (year > 100) break;
  }

  const yearsToFI = year + month / 12;
  const monthsToFI = month;

  return {
    yearsToFI,
    monthsToFI,
    dataPoints,
  };
};

/**
 * Coast FIRE timeline (no additional savings, only growth)
 */
export const calculateCoastFIRETimeline = (
  currentSavings: number,
  fiNumber: number,
  investmentReturnRate: number
): TimelineProjection => {
  // FV = PV * (1 + r)^t
  // t = ln(FV/PV) / ln(1 + r)

  const yearsToFI = Math.log(fiNumber / currentSavings) / Math.log(1 + investmentReturnRate);
  const monthsToFI = Math.round((yearsToFI - Math.floor(yearsToFI)) * 12);

  // Generate data points
  const dataPoints: TimelineDataPoint[] = [];
  let savings = currentSavings;

  for (let year = 0; year <= Math.ceil(yearsToFI); year++) {
    for (let month = 0; month < 12; month++) {
      if (savings >= fiNumber) break;

      const monthlyGrowth = savings * (investmentReturnRate / 12);

      dataPoints.push({
        year,
        month,
        age: null,
        savings,
        additionalSavings: 0, // no savings in Coast FIRE
        investmentGrowth: monthlyGrowth,
      });

      savings += monthlyGrowth;
    }
  }

  return {
    yearsToFI: Math.floor(yearsToFI),
    monthsToFI,
    dataPoints,
  };
};
```

### 5.4 Life Energy Calculator

```typescript
/**
 * Calculate life energy for a scenario
 */
export const calculateScenarioLifeEnergy = (
  netAnnualIncome: number,
  actualHourlyWage: number,
  yearsToFI: number
): BaristaFireScenarioResult['lifeEnergy'] => {
  // Annual hours to earn net income (after pension contributions)
  const annualHours = netAnnualIncome / actualHourlyWage;
  const hoursPerWeek = annualHours / 52;
  const hoursPerMonth = annualHours / 12;
  const totalHoursOverGap = annualHours * yearsToFI;
  const percentageOfFullTime = (hoursPerWeek / BARISTA_FIRE_DEFAULTS.fullTimeHoursPerWeek) * 100;

  return {
    hoursPerWeek,
    hoursPerMonth,
    hoursPerYear: annualHours,
    totalHoursOverGap,
    percentageOfFullTime,
  };
};
```

### 5.5 Scenario Comparison

```typescript
/**
 * Calculate acceleration factor compared to Coast FIRE
 */
export const calculateAccelerationFactor = (
  scenarioYearsToFI: number,
  coastFIREYearsToFI: number
): number => {
  if (coastFIREYearsToFI === 0) return 1;
  return coastFIREYearsToFI / scenarioYearsToFI;
};

/**
 * Compare scenario to Coast FIRE baseline
 */
export const compareToCoastFIRE = (
  accelerationFactor: number
): string => {
  if (accelerationFactor > 1.1) return 'faster'; // 10% faster
  if (accelerationFactor < 0.9) return 'slower'; // 10% slower
  return 'same';
};
```

### 5.6 Main Calculation Orchestrator

```typescript
/**
 * Calculate all Barista FIRE results
 */
export const calculateBaristaFireResults = (
  state: BaristaFireState,
  fiNumber: number,
  annualExpenses: number,
  actualHourlyWage: number | null,
  currentAge: number | null
): BaristaFireResults => {
  const gap = calculateGap(state.currentSavings, fiNumber);
  const isCoast = isCoastFIRE(state.currentSavings, fiNumber);

  // Calculate Coast FIRE baseline
  const coastFIRETimeline = calculateCoastFIRETimeline(
    state.currentSavings,
    fiNumber,
    state.investmentReturnRate
  );

  // Calculate results for each scenario
  const scenarioResults: BaristaFireScenarioResult[] = state.scenarios.map(scenario => {
    const netAnnualIncome = scenario.netAnnualIncome;
    const netMonthlyIncome = netAnnualIncome / 12;
    const monthlySavings = netMonthlyIncome - (annualExpenses / 12);
    const annualSavings = monthlySavings * 12;
    const savingsRate = netAnnualIncome > 0 ? (annualSavings / netAnnualIncome) : 0;

    // Timeline projection
    const timeline = calculateTimelineToFI(
      state.currentSavings,
      fiNumber,
      netAnnualIncome,
      annualExpenses,
      state.investmentReturnRate
    );

    const yearsToFI = Math.floor(timeline.yearsToFI);
    const monthsToFI = timeline.monthsToFI;
    const projectedFIAge = currentAge ? currentAge + yearsToFI : null;
    const finalNestEgg = timeline.dataPoints[timeline.dataPoints.length - 1]?.savings || fiNumber;

    // Life energy (if AWH available)
    let lifeEnergy: BaristaFireScenarioResult['lifeEnergy'] = undefined;
    if (actualHourlyWage && actualHourlyWage > 0) {
      lifeEnergy = calculateScenarioLifeEnergy(
        netAnnualIncome,
        actualHourlyWage,
        timeline.yearsToFI
      );
    }

    // Acceleration factor
    const accelerationFactor = calculateAccelerationFactor(
      timeline.yearsToFI,
      coastFIRETimeline.yearsToFI
    );
    const compareToCoast = compareToCoastFIRE(accelerationFactor);

    return {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      grossAnnualIncome: scenario.grossAnnualIncome,
      netAnnualIncome,
      netMonthlyIncome,
      monthlySavings,
      annualSavings,
      savingsRate,
      yearsToFI,
      monthsToFI,
      projectedFIAge,
      finalNestEgg,
      lifeEnergy,
      accelerationFactor,
      compareToCoastFIRE: compareToCoast,
    };
  });

  return {
    fiNumber,
    currentSavings: state.currentSavings,
    gap,
    isCoastFIRE: isCoast,
    monthlyExpenses: annualExpenses / 12,
    annualExpenses,
    scenarioResults,
    coastFIRETimeline,
  };
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

**Data Access Pattern:**
```typescript
// In BaristaFireCalculator component
const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();

// Check if baseline exists
if (!hasExpenseBaseline()) {
  return (
    <BaselinePrompt
      message="Barista FIRE reiknivélin þarf útgjaldagrunn til að reikna FI töluna þína"
      linkUrl="/utgjaldareiknivel"
      buttonText="Setja upp útgjaldagrunn"
    />
  );
}

// Use TierSelector component
import { TierSelector } from '@/components/expenseBaseline';

<TierSelector
  selectedTier={selectedTier}
  onSelectTier={handleTierSelect}
  showExpenseAmount
/>

// Get monthly expenses
const monthlyExpenses = getExpenseByTier(selectedTier);
const annualExpenses = monthlyExpenses * 12;
```

### 6.2 Integration with FI Number Calculator

**Data Access Pattern:**
```typescript
const { fiNumberResults, getFINumber, hasFINumber } = useCalculator();

// Check if FI number has been calculated
if (!hasFINumber()) {
  return (
    <Alert variant="info">
      <p>Þú þarft fyrst að reikna FI töluna þína</p>
      <Button as="a" href="/fi-tala">
        Opna FI Tala Reiknivél
      </Button>
    </Alert>
  );
}

// Get FI number for selected tier
const fiNumber = getFINumber(selectedTier);
```

### 6.3 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**
```typescript
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// Show life energy section only if AWH available
{actualHourlyWage && scenarioResult.lifeEnergy && (
  <LifeEnergyDisplay lifeEnergy={scenarioResult.lifeEnergy} />
)}

// Prompt if not available
{!actualHourlyWage && (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá vinnustundir</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateCurrentSavings = (savings: number): ValidationResult => {
  if (savings < 0) {
    return { valid: false, error: 'Sparnaður getur ekki verið neikvæður' };
  }

  if (savings > 1000000000) {
    return {
      valid: false,
      error: 'Sparnaður virðist óraunhæfur (> 1 milljarður kr)',
      warning: true,
    };
  }

  return { valid: true };
};

const validateInvestmentReturnRate = (rate: number): ValidationResult => {
  if (rate < 0 || rate > 0.15) {
    return { valid: false, error: 'Ávöxtun verður að vera á milli 0% og 15%' };
  }

  if (rate < 0.02) {
    return {
      valid: true,
      warning: 'Mjög lág ávöxtun - ávöxtun undir verðbólgu',
    };
  }

  if (rate > 0.10) {
    return {
      valid: true,
      warning: 'Mjög há ávöxtun - ekki raunhæf til lengri tíma',
    };
  }

  return { valid: true };
};

const validateGrossIncome = (
  grossIncome: number,
  monthlyExpenses: number
): ValidationResult => {
  if (grossIncome <= 0) {
    return { valid: false, error: 'Tekjur verða að vera jákvæðar' };
  }

  const netAnnualIncome = calculateNetIncome(grossIncome);
  const annualExpenses = monthlyExpenses * 12;

  if (netAnnualIncome < annualExpenses * 0.5) {
    return {
      valid: true,
      warning: 'Tekjur dekka minna en helming útgjalda - mjög löng biltímabil',
    };
  }

  return { valid: true };
};
```

### 7.2 Missing Dependencies Handling

```typescript
// No expense baseline
if (!hasExpenseBaseline()) {
  return (
    <BaselinePrompt
      message="Barista FIRE þarf útgjaldagrunn til að reikna FI töluna þína"
      linkUrl="/utgjaldareiknivel"
      buttonText="Setja upp útgjaldagrunn"
    />
  );
}

// No FI number
if (!hasFINumber()) {
  return (
    <Alert variant="info">
      <p>Þú þarft fyrst að reikna FI töluna þína</p>
      <Button as="a" href="/fi-tala">
        Opna FI Tala Reiknivél
      </Button>
    </Alert>
  );
}

// No AWH for life energy (optional)
{!actualHourlyWage && (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá vinnustundir</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

### 7.3 Timeline Calculation Edge Cases

```typescript
// Unsustainable scenario (spending > earning)
if (netAnnualIncome < annualExpenses && currentSavings < fiNumber) {
  return {
    ...scenarioResult,
    yearsToFI: Infinity,
    monthsToFI: 0,
    warning: 'Óhaldbar sviðsmynd - tekjur dekka ekki útgjöld',
    compareToCoastFIRE: 'slower',
  };
}

// Already at or past FI
if (currentSavings >= fiNumber) {
  return {
    ...scenarioResult,
    yearsToFI: 0,
    monthsToFI: 0,
    message: 'Þú hefur þegar náð FI!',
  };
}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Barista FIRE Áætlun                             [🔄 Export]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │ CurrentSavingsInput     │  │ GapSummaryCard             │ │
│  │ (Left Column)           │  │ (Right Column)             │ │
│  │                         │  │                            │ │
│  │ • Savings input         │  │ • Current savings          │ │
│  │ • Tier selector         │  │ • FI number                │ │
│  │ • Return rate           │  │ • Gap amount               │ │
│  └─────────────────────────┘  │ • Coast FIRE status        │ │
│                                └────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ IcelandicContextPanel (Collapsible)                      │ │
│  │ • Healthcare note                                        │ │
│  │ • Pension contributions                                  │ │
│  │ • Work culture                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ScenarioBuilder                                          │ │
│  │ ┌──────────────────────────────────────────────────────┐ │ │
│  │ │ Scenario 1: [Name]                         [✏️] [🗑️] │ │ │
│  │ │ • Gross income input                                 │ │ │
│  │ │ • Net income display                                 │ │ │
│  │ │ • Work hours (if AWH)                                │ │ │
│  │ │ • Gap period timeline                                │ │ │
│  │ │ • Life energy total                                  │ │ │
│  │ └──────────────────────────────────────────────────────┘ │ │
│  │ [+ Bæta við sviðsmynd]                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ScenarioComparisonTable                                  │ │
│  │ • Side-by-side comparison                                │ │
│  │ • Bar chart visualization                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ TimelineVisualization                                    │ │
│  │ • Savings growth chart                                   │ │
│  │ • Gap period shaded                                      │ │
│  │ • FI target marked                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ EducationalPanel (Collapsible)                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
- Stack all sections vertically
- Current savings input first
- Gap summary second
- Icelandic context third (collapsed)
- Scenarios fourth (one per card)
- Comparison table fifth (horizontal scroll)
- Timeline chart sixth
- Educational panel last (collapsed)

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- Single column layout
- Scenario cards stack vertically
- Comparison table scrolls horizontally
- Timeline chart scales to width
- Collapsibles closed by default

**Tablet (640px-1024px):**
- Two-column grid for inputs
- Full-width scenarios
- Comparison table full width
- Timeline chart wider

**Desktop (>1024px):**
- Full layout as shown above
- Side-by-side input sections
- Wider comparison table
- Larger timeline chart

### 8.3 Color Coding System

```typescript
const BARISTA_FIRE_COLORS = {
  gap: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
  coastFIRE: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-500',
  },
  scenario: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    accent: 'bg-blue-600',
  },
  warning: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-900',
    accent: 'bg-red-500',
  },
};

// Scenario differentiation colors
const SCENARIO_PALETTE = [
  'bg-blue-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-orange-100',
  'bg-teal-100',
];
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `baristaFire.test.ts` - Calculation logic
- `BaristaFireCalculator.test.tsx` - Main component
- `ScenarioBuilder.test.tsx` - Scenario management
- `TimelineVisualization.test.tsx` - Chart component

**Test Coverage:**
```typescript
// baristaFire.test.ts
describe('calculateGap', () => {
  it('calculates gap correctly', () => {
    expect(calculateGap(10000000, 15600000)).toBe(5600000);
  });

  it('returns 0 for Coast FIRE', () => {
    expect(calculateGap(16000000, 15600000)).toBe(0);
  });
});

describe('calculateNetIncome', () => {
  it('deducts 16% pension correctly', () => {
    expect(calculateNetIncome(100000)).toBe(84000);
  });
});

describe('calculateTimelineToFI', () => {
  it('calculates years to FI with positive savings', () => {
    const timeline = calculateTimelineToFI(
      10000000, // current savings
      15600000, // FI number
      7200000,  // net annual income (600k/month)
      6240000,  // annual expenses (520k/month)
      0.05      // 5% return
    );

    expect(timeline.yearsToFI).toBeGreaterThan(0);
    expect(timeline.yearsToFI).toBeLessThan(15);
  });

  it('uses Coast FIRE timeline when income = expenses', () => {
    const timeline = calculateTimelineToFI(
      10000000,
      15600000,
      6240000, // net income = expenses
      6240000,
      0.05
    );

    // Should match Coast FIRE (only growth, no savings)
    expect(timeline.dataPoints.every(dp => dp.additionalSavings === 0)).toBe(true);
  });
});

describe('calculateScenarioLifeEnergy', () => {
  it('calculates work hours correctly', () => {
    const lifeEnergy = calculateScenarioLifeEnergy(
      6240000, // net annual income
      2500,    // actual hourly wage
      7.3      // years to FI
    );

    expect(lifeEnergy.hoursPerYear).toBe(2496); // 6240000 / 2500
    expect(lifeEnergy.hoursPerWeek).toBeCloseTo(48, 0);
    expect(lifeEnergy.totalHoursOverGap).toBeCloseTo(18220.8, 0);
  });
});
```

### 9.2 Integration Testing

```typescript
describe('BaristaFire Integration', () => {
  it('persists state to localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.setCurrentSavings(10000000);
      result.current.addScenario({
        name: 'Test Scenario',
        grossAnnualIncome: 3600000,
        netAnnualIncome: 3024000,
        workHoursPerWeek: 20,
      });
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain('"currentSavings":10000000');
      expect(stored).toContain('"name":"Test Scenario"');
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

    // Use in Barista FIRE
    act(() => {
      result.current.updateBaristaFire({
        selectedTier: 'comfortable',
        currentSavings: 10000000,
      });
    });

    const results = result.current.baristaFireResults;
    expect(results?.annualExpenses).toBe(6240000); // 520k * 12
  });

  it('integrates with FI number calculator', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up FI number
    act(() => {
      result.current.updateFINumberBuilder({
        expenseSource: 'baseline',
        selectedTier: 'comfortable',
        multiplier: 30,
      });
    });

    // Use in Barista FIRE
    const fiNumber = result.current.getFINumber('comfortable');
    expect(fiNumber).toBe(187200000); // 520k * 12 * 30
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on scenario inputs', () => {
    const { getByLabelText } = render(<ScenarioCard scenario={mockScenario} />);

    expect(getByLabelText(/brúttó tekjur/i)).toBeInTheDocument();
    expect(getByLabelText(/nafn.*sviðsmynd/i)).toBeInTheDocument();
  });

  it('announces timeline changes to screen readers', () => {
    const { getByRole } = render(<TimelineVisualization />);

    const liveRegion = getByRole('status');
    expect(liveRegion).toHaveTextContent(/ár.*til.*FI/i);
  });

  it('timeline chart has text alternative', () => {
    const { getByRole } = render(<TimelineVisualization />);

    const chart = getByRole('img', { name: /tímalína/i });
    expect(chart).toHaveAccessibleDescription();
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive timeline calculations
const baristaFireResults = useMemo(() => {
  if (!baristaFire || !fiNumber || !annualExpenses) return null;
  return calculateBaristaFireResults(
    baristaFire,
    fiNumber,
    annualExpenses,
    actualHourlyWage,
    baristaFire.currentAge
  );
}, [baristaFire, fiNumber, annualExpenses, actualHourlyWage]);

// Debounce scenario income inputs
const debouncedUpdateScenario = useMemo(
  () => debounce((id: string, updates: Partial<BaristaFireScenario>) => {
    updateScenario(id, updates);
  }, 300),
  [updateScenario]
);
```

### 10.2 Performance Budget

- Calculation time: <100ms (even with 10 scenarios)
- Timeline chart rendering: <200ms
- Scenario input response: <50ms
- Page load: <2 seconds

---

## 11. Localization (Icelandic)

### 11.1 Text Content

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'Barista FIRE Áætlun',
  subtitle: 'Skipuleggðu hálfan starfslok með hlutastarfi',

  // Current savings
  currentSavings: {
    title: 'Núverandi sparnaður og markmið',
    savingsLabel: 'Núverandi sparnaður',
    tierLabel: 'Útgjaldaþrep',
    returnRateLabel: 'Vænt ávöxtun fjárfestinga',
    perYear: 'á ári',
  },

  // Gap summary
  gap: {
    title: 'FI Bil (Gap) Yfirlit',
    currentSavings: 'Núverandi sparnaður',
    fiNumber: 'FI tala (markmið)',
    gap: 'BIL',
    youNeed: 'Þú þarft {amount} til viðbótar til að ná fullri fjárhagslegu sjálfstæði',
    withPartTime: 'Með hlutastarfi geturðu',
    coverExpenses: 'Þekkt útgjöld þín ({amount})',
    letGrow: 'Látið sparnaðinn þinn vaxa ({rate}% á ári)',
    reachFaster: 'Náð FI á færri árum en með fullri vinnu',
    coastFIRE: 'Coast FIRE Náð!',
    coastFIREMessage: 'Þú hefur náð Coast FIRE! Sparnaður þinn mun vaxa í fullt FI án frekari innlagna.',
  },

  // Scenarios
  scenarios: {
    title: 'Hlutastarf Sviðsmyndir',
    addScenario: 'Bæta við sviðsmynd',
    scenarioName: 'Nafn sviðsmyndar',
    grossIncome: 'Brúttó tekjur (á ári)',
    netIncome: 'Nettó tekjur (eftir lífeyri)',
    pensionDeduction: '16% lífeyrisframlag dregið frá',
    workHours: 'Vinnutímar',
    hoursPerWeek: 'klst/viku',
    gapPeriod: 'Bil tímabil',
    fiAge: 'FI aldur',
    lifeEnergy: 'Lífsorka',
    totalHoursOverGap: 'klst yfir bil tímabilið',
    deleteConfirm: 'Ertu viss um að þú viljir eyða þessari sviðsmynd?',
  },

  // Comparison
  comparison: {
    title: 'Samanburður á Sviðsmyndum',
    scenario: 'Sviðsmynd',
    grossIncome: 'Brúttó tekjur',
    workTime: 'Vinnutími',
    gapPeriod: 'Bil tímabil',
    lifeEnergy: 'Lífsorka',
    coastBaseline: 'Coast FIRE viðmið (bara dekka útgjöld, engin viðbótarsparnað)',
    faster: 'Hraðari en Coast FIRE',
    slower: 'Hægari en Coast FIRE',
    same: 'Sama og Coast FIRE',
  },

  // Timeline
  timeline: {
    title: 'Tímalína til Full FI',
    currentSavings: 'Núverandi sparnaður',
    fiTarget: 'FI markmið',
    estimatedTime: 'Áætlaður tími',
    years: 'ár',
    months: 'mánuðir',
    scenario: 'Sviðsmynd',
  },

  // Icelandic context
  icelandicContext: {
    title: 'Íslenskt Samhengi',
    healthcareTitle: 'Almenn Heilbrigðisþjónusta',
    healthcareText: 'Ísland hefur alhliða heilbrigðisþjónustu sem er EKKI tengd við starf. Þú þarft ekki að hafa áhyggjur af sjúkratryggingu ef þú vinnur hlutastarf.',
    pensionTitle: 'Lífeyrissjóður (16% skylda)',
    pensionEmployer: 'vinnuveitandi',
    pensionEmployee: 'þú',
    pensionTotal: 'samtals',
    pensionContinues: 'Áfram greiðslur í hlutastarfi',
    pensionBenefits: 'Byggir upp lífeyrisrétt þinn',
    pensionNote: 'Allar tekjur í reiknivélinni eru NETTÓ eftir lífeyrisframlag',
    workCultureTitle: 'Hlutastarf á Íslandi',
    workCulture1: 'Hlutastarf minna algengt en í sumum löndum',
    workCulture2: 'En vaxandi, sérstaklega í skapandi/þekkingar vinnu',
    workCulture3: 'Sjálfstætt starfandi og ráðgjöf sveigjanlegri',
    workCulture4: '"Hlutastarf" venjulega 50-80% af fullu starfi',
  },

  // Educational
  education: {
    whatIsBaristaFIRE: 'Hvað er Barista FIRE?',
    whatIsCoastFIRE: 'Hvað er Coast FIRE?',
    gapPeriodStrategy: 'Bil Tímabil Stefna',
    faq: 'Algengar Spurningar',
  },

  // Validation
  validation: {
    negativeSavings: 'Sparnaður getur ekki verið neikvæður',
    unrealisticSavings: 'Sparnaður virðist óraunhæfur',
    negativeIncome: 'Tekjur verða að vera jákvæðar',
    lowIncome: 'Tekjur dekka minna en helming útgjalda - mjög löng biltímabil',
    invalidReturnRate: 'Ávöxtun verður að vera á milli 0% og 15%',
    lowReturnRate: 'Mjög lág ávöxtun - ávöxtun undir verðbólgu',
    highReturnRate: 'Mjög há ávöxtun - ekki raunhæf til lengri tíma',
    unsustainable: 'Óhaldbar sviðsmynd - tekjur dekka ekki útgjöld',
  },

  // Prompts
  prompts: {
    noBaseline: 'Barista FIRE þarf útgjaldagrunn til að reikna FI töluna þína',
    setupBaseline: 'Setja upp útgjaldagrunn',
    noFINumber: 'Þú þarft fyrst að reikna FI töluna þína',
    calculateFINumber: 'Opna FI Tala Reiknivél',
    noAWH: 'Reiknaðu raunverulegt tímakaup þitt til að sjá vinnustundir',
    calculateAWH: 'Opna Raunverulegt Tímakaup Reiknivél',
  },
};
```

### 11.2 Number Formatting

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' kr';
};
// Example: 5.600.000 kr

const formatPercentage = (rate: number): string => {
  return (rate * 100).toFixed(1) + '%';
};
// Example: 5,0%

const formatHours = (hours: number): string => {
  return hours.toFixed(1) + ' klst';
};
// Example: 7.280,0 klst

const formatTimeline = (years: number, months: number): string => {
  if (years === 0) {
    return `${months} mánuðir`;
  }
  if (months === 0) {
    return `${years} ár`;
  }
  return `${years} ár og ${months} mánuðir`;
};
// Example: 7 ár og 3 mánuðir
```

---

## 12. Technical Decisions

### 12.1 Scenario-Based Approach

**Decision**: Allow multiple named scenarios rather than single calculation

**Rationale**:
- Users want to explore different part-time options
- Side-by-side comparison helps decision making
- Named scenarios make it easy to reference ("20 hours/week")
- Aligns with "Your Money or Your Life" exploration philosophy

**Alternatives Considered**:
- Single scenario only: Rejected (users need comparison)
- Unlimited scenarios: Rejected (UI clutter, use 5 max)

### 12.2 Timeline Calculation with Monthly Precision

**Decision**: Calculate timeline month-by-month rather than annually

**Rationale**:
- More accurate timeline projections
- Handles investment growth correctly (compounding monthly)
- Provides better granularity for short gap periods
- Only minor performance impact

**Implementation**:
- Monthly data points for chart smoothness
- Monthly compounding for investment growth
- Display in years + months for readability

### 12.3 Mandatory 16% Pension Contribution

**Decision**: Always deduct 16% from gross income (not optional)

**Rationale**:
- Mandatory in Iceland by law
- Consistent with actual part-time work reality
- Prevents unrealistic net income calculations
- Educational: users learn about true take-home pay

**Implementation**:
- Gross income input
- Net income calculated automatically (gross × 0.84)
- Clear display of pension deduction
- Educational note about lífeyrissjóður benefits

### 12.4 Coast FIRE as Baseline

**Decision**: Always calculate Coast FIRE timeline as comparison baseline

**Rationale**:
- Coast FIRE is minimum viable strategy (income = expenses)
- Provides context for other scenarios
- Highlights acceleration factor of additional savings
- Educational: shows benefit of earning above expenses

**Implementation**:
- Coast FIRE timeline always calculated
- Displayed in comparison table
- Used to calculate acceleration factors
- Clearly labeled "Coast FIRE viðmið"

---

## 13. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Calculate Required Income | CurrentSavingsInput, GapSummaryCard | calculateGap(), calculateMinimumAnnualIncome() |
| **US-2**: Gap Period Duration | TimelineVisualization, ScenarioCard | calculateTimelineToFI() |
| **US-3**: Compare Scenarios | ScenarioComparisonTable | Multiple BaristaFireScenario support |
| **US-4**: Icelandic Considerations | IcelandicContextPanel | 16% pension, healthcare note |
| **US-5**: Life Energy Trade-Offs | LifeEnergyDisplay | calculateScenarioLifeEnergy() |
| **US-6**: Integrate Expense Baseline | TierSelector integration | getExpenseByTier() API |
| **FR-1**: Gap Calculation | calculateGap(), isCoastFIRE() | Gap = FI - Savings |
| **FR-2**: Part-Time Scenarios | ScenarioBuilder, ScenarioCard | BaristaFireScenario array |
| **FR-3**: Timeline Projections | calculateTimelineToFI() | Monthly data points, age projections |
| **FR-4**: Icelandic Context | IcelandicContextPanel, calculateNetIncome() | 16% pension, healthcare, ISK |
| **FR-5**: Expense Baseline Integration | ExpenseSourceSelector, TierSelector | Integration API |
| **FR-6**: Life Energy Integration | calculateScenarioLifeEnergy() | AWH integration |
| **FR-7**: Visualization | TimelineVisualization, ScenarioComparisonChart | Charts and timelines |
| **FR-8**: Data Persistence | CalculatorContext, localStorage | Auto-save scenarios |

---

## 14. Implementation Risks and Mitigations

### Risk 1: Missing FI Number or Expense Baseline

**Risk**: User hasn't set up prerequisites.

**Mitigation**:
- Detect missing dependencies early
- Show prominent prompts with links
- Explain why each is needed
- Graceful degradation (custom expense input as fallback)

### Risk 2: Unsustainable Scenarios

**Risk**: User enters income lower than expenses.

**Mitigation**:
- Validate and warn user
- Show timeline as "infinity" or "unsustainable"
- Explain need for income ≥ expenses
- Suggest increasing income or lowering expense tier

### Risk 3: Timeline Calculation Complexity

**Risk**: Monthly precision calculation might be slow with many scenarios.

**Mitigation**:
- Limit scenarios to 5 maximum
- Memoize calculations
- Use Web Workers if needed (unlikely)
- Performance budget: <100ms for all scenarios

### Risk 4: Chart Performance on Mobile

**Risk**: Timeline chart might be slow on low-end mobile devices.

**Mitigation**:
- Reduce data points for mobile (every 3 months instead of monthly)
- Use lightweight charting library (recharts)
- Debounce chart re-renders
- Progressive enhancement: text fallback if chart fails

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
- [x] Leverages Expense Baseline and FI Number APIs
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Icelandic context prioritized (healthcare, pension)
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] Consumes Expense Baseline API
- [x] Consumes FI Number API
- [x] Integrates AWH for life energy
- [x] Uses TierSelector component
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
