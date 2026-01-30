# Design: LeanFIRE Planner

## Document Information

- **Feature Name**: LeanFIRE Planner (Lágmarks FIRE Skipuleggjandi)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-lean-fire.md

---

## 1. System Overview

### 1.1 Purpose

The LeanFIRE Planner helps users plan for minimal-expense early retirement by analyzing barebones living costs, comparing geographic options within Iceland, modeling expense reduction scenarios, and providing personalized frugality optimization. It focuses on the extreme frugality path to FI with Iceland-specific cost realities.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- Recharts for data visualization
- No backend/server requirements

### 1.3 Key Design Principles

1. **Barebones Focus**: Emphasize minimum viable expenses (not comfortable/deluxe)
2. **Iceland-Specific**: Geographic arbitrage within Iceland, not international
3. **Scenario-Driven**: Compare multiple expense reduction scenarios
4. **Personalized Optimization**: Frugality tips based on user's actual expenses
5. **Visual Trade-Offs**: Clear visualization of sacrifice vs timeline impact
6. **Realistic**: Use actual Icelandic minimum costs, not theoretical extremes
7. **Privacy-First**: All calculations client-side, data stored locally

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Minimum FI       │  │ Geographic        │  │ Expense Reduction   │  │
│  │ Calculator       │  │ Comparison        │  │ Scenarios           │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  leanFire: LeanFireState                                        │   │
│  │    - selectedLocation: 'reykjavik' | 'landsbyggd' | 'custom'    │   │
│  │    - barebonesExpenses: CategoryExpenses                        │   │
│  │    - fiMultiplier: 25 | 30                                      │   │
│  │    - reductionScenarios: ReductionScenario[]                    │   │
│  │  leanFireResults: LeanFireResults                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration:                                                    │   │
│  │    - expenseBaseline (barebones tier)                           │   │
│  │    - actualHourlyWage (life energy)                             │   │
│  │    - currentSavings (FI timeline)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Minimum FI        │  │ Geographic        │  │ Reduction         │  │
│  │ Calculator        │  │ Comparator        │  │ Scenario Engine   │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Frugality         │  │ Trade-Off         │  │ Timeline          │  │
│  │ Optimizer         │  │ Visualizer        │  │ Projector         │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data & Constants Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Iceland Cost      │  │ Frugality Tips    │  │ Expense Baseline  │  │
│  │ Defaults          │  │ Database          │  │ Integration       │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
LeanFireCalculator (Page Component)
├── MinimumFISummary
│   ├── BarebonesExpensesDisplay (from baseline or defaults)
│   ├── FINumberCalculator (barebones annual × multiplier)
│   ├── MultiplierSelector (25x | 30x)
│   └── LifeEnergyDisplay (if AWH available)
│
├── GeographicComparisonPanel
│   ├── LocationSelector (Reykjavík | Landsbyggð | Custom)
│   ├── CostBreakdownTable
│   │   ├── CategoryRow (Housing, Food, Transport, etc.)
│   │   ├── ReykjavikColumn
│   │   ├── LandsbyggdColumn
│   │   └── DifferenceColumn
│   ├── FINumberComparison
│   │   ├── ReykjavikFI
│   │   ├── LandsbyggdFI
│   │   └── SavingsAmount
│   ├── TimelineComparison
│   │   └── YearsMonthsSaved
│   └── ProsConsLists
│       ├── UrbanProsCons
│       └── RuralProsCons
│
├── ExpenseReductionScenarios
│   ├── ScenarioBuilder
│   │   ├── CategorySelector (which category to reduce)
│   │   ├── ReductionLevelSlider (10%, 25%, 50%, eliminate)
│   │   ├── CurrentExpenseDisplay
│   │   └── NewExpenseDisplay
│   ├── ActiveScenariosList
│   │   ├── ScenarioCard (repeatable)
│   │   │   ├── ScenarioSummary (category, reduction, savings)
│   │   │   ├── ImpactMetrics (FI number change, timeline change)
│   │   │   ├── EfficiencyRating (months saved per 10k kr)
│   │   │   └── RemoveButton
│   │   └── AddScenarioButton
│   ├── CumulativeImpact
│   │   ├── TotalExpenseReduction
│   │   ├── NewFINumber
│   │   ├── NewTimeline
│   │   └── TotalMonthsSaved
│   └── ScenarioRanking
│       └── SortedByEfficiency
│
├── FrugalityOptimizer
│   ├── ExpenseAnalysis
│   │   ├── CurrentVsMinimum (per category)
│   │   └── HighSpendCategories
│   ├── PersonalizedTips
│   │   ├── TipCard (repeatable)
│   │   │   ├── TipTitle
│   │   │   ├── TipDescription (actionable, Iceland-specific)
│   │   │   ├── PotentialSavings (ISK/month)
│   │   │   ├── TimelineImpact (months saved)
│   │   │   └── ImplementButton (updates expense)
│   │   └── SortByImpact
│   └── IcelandicResources
│       ├── ShoppingTips (Bónus, Krónan)
│       ├── TransportTips (Strætó, cycling)
│       └── FreeTips (libraries, nature)
│
├── LifestyleTradeOffChart
│   ├── ExpenseVsTimelineChart (Recharts)
│   │   ├── TradeOffCurve (expense level → years to FI)
│   │   ├── BarebonesMarker
│   │   ├── ComfortableMarker
│   │   ├── DeluxeMarker
│   │   ├── UserCurrentPosition
│   │   └── InteractiveHover (click for details)
│   └── LifeEnergyCost (work years for each lifestyle)
│
├── IcelandicContextPanel
│   ├── UniversalHealthcareNote
│   ├── SeasonalWorkOpportunities
│   ├── RuralHousingRealities
│   ├── TransportationConsiderations
│   └── SafetyNetAvailability
│
└── EducationalPanel (Collapsible)
    ├── WhatIsLeanFIRE
    ├── LeanFIREVsRegularFIRE
    ├── GeographicArbitrageExplainer
    ├── FrugalityVsSacrifice
    └── FAQSection
```

### 2.3 Data Flow

**Initial Load Flow:**
```
Page Load → Check for Expense Baseline
                    ↓
        ┌───────────┴──────────┐
        ↓                      ↓
   Has Baseline         No Baseline
        ↓                      ↓
Load Barebones Tier   Use Iceland Defaults
        ↓                      ↓
        └──────────┬───────────┘
                   ↓
         Calculate Minimum FI Number
                   ↓
         Load Location (default: Reykjavík)
                   ↓
         Load Saved Scenarios (if any)
                   ↓
         Display Results
```

**Scenario Creation Flow:**
```
User Selects Category → Choose Reduction Level → Preview Impact
                                                        ↓
                                                 Calculate New:
                                                  - Monthly expenses
                                                  - Annual expenses
                                                  - FI number
                                                  - Years to FI
                                                  - Months saved
                                                        ↓
                                                 Show Efficiency Rating
                                                        ↓
                                                 User Confirms → Add to Active Scenarios
                                                        ↓
                                                 Recalculate Cumulative Impact
```

**Geographic Comparison Flow:**
```
User Selects Location → Load Cost Profile → Calculate Differences
                                                    ↓
                                    Break Down by Category
                                                    ↓
                                    Calculate FI Number Difference
                                                    ↓
                                    Calculate Timeline Difference
                                                    ↓
                                    Display Pros/Cons
                                                    ↓
                                    Update Charts
```

---

## 3. Component Design

### 3.1 LeanFireCalculator (Main Component)

**Responsibility**: Page-level container and calculation orchestrator

**Interface:**
```typescript
interface LeanFireCalculatorProps {
  // No props - gets data from CalculatorContext
}
```

**Key Features:**
- Detects expense baseline existence
- Loads barebones tier or defaults
- Orchestrates all calculations
- Coordinates display sections

---

### 3.2 MinimumFISummary Component

**Responsibility**: Display minimum FI number based on barebones expenses

**Interface:**
```typescript
interface MinimumFISummaryProps {
  barebonesMonthly: number;
  barebonesAnnual: number;
  fiMultiplier: 25 | 30;
  fiNumber: number;
  onMultiplierChange: (multiplier: 25 | 30) => void;
  actualHourlyWage: number | null;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Lágmarks FI Tala (Minimum FI Number)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Lágmarks útgjöld (Barebones):                          │
│  • Mánaðarlega: 250.000 kr                             │
│  • Árlega: 3.000.000 kr                                │
│                                                         │
│  FI Margfaldari:                                        │
│  ○ 25x (4% withdrawal)  ● 30x (3.33% withdrawal)       │
│                                                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃  LÁGMARKS FI TALA: 90.000.000 kr               ┃    │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│                                                         │
│  Útreikningur: 250.000 kr × 12 × 30 = 90.000.000 kr   │
│                                                         │
│  💡 Þetta er LÁGMARKIÐ sem þú þarft til að hætta      │
│     að vinna. Lífsorka: 36.000 klst (17,3 ár vinnu)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Display barebones monthly/annual expenses
- Multiplier selector (25x or 30x)
- Calculate and display minimum FI number
- Show calculation breakdown
- Life energy display (if AWH available)
- Emphasize this is MINIMUM (not comfortable)

---

### 3.3 GeographicComparisonPanel Component

**Responsibility**: Compare living costs between Reykjavík and rural Iceland

**Interface:**
```typescript
interface GeographicComparisonPanelProps {
  currentLocation: 'reykjavik' | 'landsbyggd' | 'custom';
  onLocationChange: (location: LocationType) => void;
  fiMultiplier: 25 | 30;
  currentSavings: number | null;
}

interface LocationCosts {
  location: 'reykjavik' | 'landsbyggd';
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  insurance: number;
  utilities: number;
  personal: number;
  entertainment: number;
  other: number;
  total: number;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  🗺️ Staðsetning Samanburður (Geographic Comparison)             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Veldu staðsetningu:                                            │
│  ● Reykjavík    ○ Landsbyggð    ○ Sérsniðið                    │
│                                                                  │
│  ┌────────────┬──────────────┬────────────┬──────────────┐     │
│  │ Flokkur    │  Reykjavík   │ Landsbyggð │  Mismunur    │     │
│  ├────────────┼──────────────┼────────────┼──────────────┤     │
│  │ Húsnæði    │  140.000 kr  │  80.000 kr │ -60.000 kr ↓ │     │
│  │ Matur      │   35.000 kr  │  32.000 kr │  -3.000 kr ↓ │     │
│  │ Samgöngur  │   12.000 kr  │  25.000 kr │ +13.000 kr ↑ │     │
│  │ Heilsa     │    3.000 kr  │   3.000 kr │      0 kr    │     │
│  │ Tryggingar │    5.000 kr  │   8.000 kr │  +3.000 kr ↑ │     │
│  │ Veitur     │   25.000 kr  │  30.000 kr │  +5.000 kr ↑ │     │
│  │ Persónuleg │    8.000 kr  │   8.000 kr │      0 kr    │     │
│  │ Afþreying  │    5.000 kr  │   3.000 kr │  -2.000 kr ↓ │     │
│  │ Annað      │    7.000 kr  │  11.000 kr │  +4.000 kr ↑ │     │
│  ├────────────┼──────────────┼────────────┼──────────────┤     │
│  │ SAMTALS    │  240.000 kr  │ 200.000 kr │ -40.000 kr ↓ │     │
│  └────────────┴──────────────┴────────────┴──────────────┘     │
│                                                                  │
│  FI Tala Samanburður (30x):                                     │
│  • Reykjavík: 86.400.000 kr                                     │
│  • Landsbyggð: 72.000.000 kr                                    │
│  • Sparnaður: 14.400.000 kr (16,7% minni FI tala)              │
│                                                                  │
│  Tímalína Mismunur:                                             │
│  • Með núverandi sparnaði (25.000.000 kr):                     │
│    - Reykjavík: 19,2 ár til FI                                 │
│    - Landsbyggð: 14,7 ár til FI                                │
│    - Sparað: 4,5 ár! 🎯                                        │
│                                                                  │
│  ┌────────────────────────┬───────────────────────────┐        │
│  │ Reykjavík Kostir       │ Landsbyggð Kostir         │        │
│  ├────────────────────────┼───────────────────────────┤        │
│  │ ✓ Almenningssamgöngur  │ ✓ Ódýrara húsnæði        │        │
│  │ ✓ Fleiri störf         │ ✓ Minni FI tala          │        │
│  │ ✓ Félagsleg starfsemi  │ ✓ Náttúran nálæg         │        │
│  │ ✓ Menningartilboð      │ ✓ Rólegra samfélög       │        │
│  │                        │ ✓ Einfaldari lífsstíll    │        │
│  │                        │                           │        │
│  │ Reykjavík Gallar       │ Landsbyggð Gallar         │        │
│  ├────────────────────────┼───────────────────────────┤        │
│  │ ✗ Dýrt húsnæði        │ ✗ Bíll nauðsynlegur      │        │
│  │ ✗ Hærri lífskostnaður  │ ✗ Færri störf            │        │
│  │ ✗ Meiri þéttleiki     │ ✗ Færri þjónustur        │        │
│  │                        │ ✗ Vetrarerfiðir          │        │
│  └────────────────────────┴───────────────────────────┘        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Location selector (Reykjavík, Landsbyggð, Custom)
- Category-by-category cost breakdown
- Visual indicators (↑ higher, ↓ lower)
- FI number comparison
- Timeline comparison (if current savings known)
- Pros/cons lists for each location
- Highlight net savings amount

---

### 3.4 ExpenseReductionScenarios Component

**Responsibility**: Model "what if I cut X?" expense reduction scenarios

**Interface:**
```typescript
interface ExpenseReductionScenariosProps {
  baselineExpenses: CategoryExpenses;
  scenarios: ReductionScenario[];
  onAddScenario: (scenario: ReductionScenario) => void;
  onRemoveScenario: (id: string) => void;
  fiMultiplier: 25 | 30;
  currentSavings: number | null;
}

interface ReductionScenario {
  id: string;
  name: string;
  category: ExpenseCategory;
  currentAmount: number;
  reductionPercent: number; // 10, 25, 50, 100
  newAmount: number;
  savings: number;
  fiNumberImpact: number;
  timelineImpact: number; // months saved
  efficiency: number; // months saved per 10k kr cut
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ✂️ Útgjaldaminnkun Sviðsmyndir (Expense Reduction Scenarios)    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bæta við sviðsmynd:                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Flokkur: [Dropdown: Húsnæði ▼]                             │ │
│  │ Núverandi: 140.000 kr/mán                                   │ │
│  │                                                             │ │
│  │ Minnkun: ○ 10%  ○ 25%  ● 50%  ○ Útrýma                    │ │
│  │ Nýtt: 70.000 kr/mán                                        │ │
│  │ Sparnaður: 70.000 kr/mán (840.000 kr/ári)                  │ │
│  │                                                             │ │
│  │ [Bæta við sviðsmynd]                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Virkar Sviðsmyndir:                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Húsnæði: -50% (70.000 kr/mán)            [🗑️]          │ │
│  │    Sparnaður: 70.000 kr/mán                                │ │
│  │    FI Tala: -25.200.000 kr (30x)                           │ │
│  │    Tími sparaður: 7,8 mánuðir                              │ │
│  │    Skilvirkni: 1,11 mán/10k kr ⭐⭐⭐                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 2. Samgöngur: -100% (0 kr/mán)              [🗑️]          │ │
│  │    Sparnaður: 12.000 kr/mán                                │ │
│  │    FI Tala: -4.320.000 kr (30x)                            │ │
│  │    Tími sparaður: 1,3 mánuðir                              │ │
│  │    Skilvirkni: 1,08 mán/10k kr ⭐⭐⭐                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Samanlagt Áhrif:                                               │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ Heildar útgjaldaminnkun: 82.000 kr/mán (984.000 kr/ári) ┃ │
│  ┃ Nýjar útgjöld: 158.000 kr/mán                           ┃ │
│  ┃ Ný FI tala: 56.880.000 kr (30x)                         ┃ │
│  ┃ Tími sparaður: 9,1 mánuðir                              ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                                  │
│  Sviðsmyndir raðað eftir skilvirkni:                           │
│  1. Húsnæði -50%: 1,11 mán/10k kr                              │
│  2. Samgöngur -100%: 1,08 mán/10k kr                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Category dropdown selector
- Reduction level slider (10%, 25%, 50%, 100%)
- Preview new amount and savings
- Add scenario button
- Active scenarios list with metrics
- Efficiency rating (⭐⭐⭐ = best)
- Cumulative impact calculation
- Ranking by efficiency
- Remove scenario button per item

---

### 3.5 FrugalityOptimizer Component

**Responsibility**: Generate personalized frugality tips based on user's expenses

**Interface:**
```typescript
interface FrugalityOptimizerProps {
  currentExpenses: CategoryExpenses;
  minimumExpenses: CategoryExpenses; // Iceland barebones
  onImplementTip: (tip: FrugalityTip) => void;
}

interface FrugalityTip {
  id: string;
  category: ExpenseCategory;
  title: string;
  description: string; // Actionable, Iceland-specific
  potentialSavings: number; // ISK per month
  timelineImpact: number; // months saved
  difficulty: 'easy' | 'moderate' | 'hard';
  icelandicResources?: string[]; // e.g., ["Bónus", "Krónan"]
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  💡 Sparneytn Ráðleggingar (Frugality Optimization)              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Útgjaldagreining:                                              │
│  ┌────────────┬──────────┬──────────┬──────────────┐           │
│  │ Flokkur    │ Núverandi│ Lágmarks │ Offramboð    │           │
│  ├────────────┼──────────┼──────────┼──────────────┤           │
│  │ Matur      │ 50.000 kr│ 35.000 kr│ +15.000 kr ⚠ │           │
│  │ Afþreying  │ 20.000 kr│  5.000 kr│ +15.000 kr ⚠ │           │
│  │ Húsnæði    │ 140.000  │ 140.000  │      0 kr ✓  │           │
│  └────────────┴──────────┴──────────┴──────────────┘           │
│                                                                  │
│  Ráðleggingar (raðað eftir áhrifum):                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Skipta um matvöruverslun                    [Framkvæma] │ │
│  │    🥬 Matur                                                │ │
│  │                                                             │ │
│  │    Kaupa eingöngu í Bónus eða Krónan í stað dýrari        │ │
│  │    verslana. Skipuleggja máltíðir og kaupa í lausu.       │ │
│  │                                                             │ │
│  │    Mögulegur sparnaður: 12.000 kr/mán                      │ │
│  │    Tími sparaður: 3,6 mánuðir                              │ │
│  │    Erfiðleiki: ▓░░ Auðvelt                                │ │
│  │    Auðlindir: Bónus, Krónan, Hagkaup útsala               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 2. Nota ókeypis afþreyingu                     [Framkvæma] │ │
│  │    🎭 Afþreying                                            │ │
│  │                                                             │ │
│  │    Nýta bókasöfn, göngu- og hjólaleiðir, ókeypis        │ │
│  │    tónleika, Listasafn Íslands (ókeypis á þriðjudögum).   │ │
│  │                                                             │ │
│  │    Mögulegur sparnaður: 15.000 kr/mán                      │ │
│  │    Tími sparaður: 4,5 mánuðir                              │ │
│  │    Erfiðleiki: ▓▓░ Í meðallagi                           │ │
│  │    Auðlindir: Borgarbókasafn, Náttúra Íslands            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 3. Skipta í Strætó + hjól                      [Framkvæma] │ │
│  │    🚌 Samgöngur                                            │ │
│  │                                                             │ │
│  │    Selja bíl, kaupa Strætó mánaðarkort (12.000 kr) og    │ │
│  │    notað hjól fyrir stutta ferða. Sparar bensín,          │ │
│  │    tryggingar, viðhald.                                    │ │
│  │                                                             │ │
│  │    Mögulegur sparnaður: 35.000 kr/mán                      │ │
│  │    Tími sparaður: 10,5 mánuðir                             │ │
│  │    Erfiðleiki: ▓▓▓ Erfitt (þarf góða skipulagningu)      │ │
│  │    Auðlindir: Strætó, Samtök notaðra hjóla               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Compare current vs minimum per category
- Identify high-spend categories
- Generate personalized tips (Iceland-specific)
- Show potential savings per tip
- Calculate timeline impact
- Difficulty rating
- Iceland-specific resources (stores, services)
- Implement button (updates expenses)
- Sort by impact (biggest timeline improvement first)

---

### 3.6 LifestyleTradeOffChart Component

**Responsibility**: Visualize expense level vs years to FI trade-off

**Interface:**
```typescript
interface LifestyleTradeOffChartProps {
  currentSavings: number | null;
  currentAge: number | null;
  savingsRate: number | null;
  investmentReturn: number; // default 5-7%
  actualHourlyWage: number | null;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  📊 Lífsstíll vs Tímalína (Lifestyle Trade-Off Chart)            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Years to FI                                                     │
│  30 ┤                                                            │
│     │                                             ● Deluxe       │
│  25 ┤                                    ╱─────●                 │
│     │                              ╱─────                        │
│  20 ┤                        ╱─────                              │
│     │                  ╱─────     ● Comfortable                 │
│  15 ┤            ╱─────                                          │
│     │      ╱─────                                                │
│  10 ┤╱─────                                                      │
│     ●────────────────────────────────────────────→              │
│   5 ┤ Barebones        ★ YOU ARE HERE                           │
│     │                                                            │
│     └─────┬─────┬─────┬─────┬─────┬─────┬─────→                │
│         200k  400k  600k  800k  1M   1.2M                        │
│                Monthly Expenses (kr)                             │
│                                                                  │
│  Lífsorka kostnaður (Life Energy Cost):                         │
│  • Lágmarks (250k/mán): 17,3 ár vinnu                          │
│  • Þægilegt (520k/mán): 36,0 ár vinnu (+18,7 ár!)              │
│  • Lúxus (1M/mán): 69,2 ár vinnu (+51,9 ár!)                   │
│                                                                  │
│  💡 Hver 100.000 kr minnkun í mánaðarlegum útgjöldum           │
│     sparar þér ~6,9 ár af vinnu.                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Curve showing expense → years to FI relationship
- Mark barebones, comfortable, deluxe points
- Show user's current position (if data available)
- Interactive hover (click for expense breakdown)
- Life energy cost display for each lifestyle
- Highlight impact of expense changes
- Educational insight about trade-offs

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * LeanFIRE Types
 */

export interface LeanFireState {
  // Location
  selectedLocation: 'reykjavik' | 'landsbyggd' | 'custom';
  customLocationExpenses?: CategoryExpenses;

  // Barebones expenses (from baseline or defaults)
  barebonesExpenses: CategoryExpenses;
  expenseSource: 'baseline' | 'default' | 'custom';

  // FI calculation
  fiMultiplier: 25 | 30;

  // Reduction scenarios
  reductionScenarios: ReductionScenario[];

  // Current savings (optional, for timeline calc)
  currentSavings: number | null;
  currentAge: number | null;
  savingsRate: number | null;
  investmentReturn: number; // default 0.05 (5%)

  // Metadata
  lastUpdated: Date;
  version: number;
}

export interface CategoryExpenses {
  housing: number;
  food: number;
  transport: number;
  healthcare: number;
  insurance: number;
  utilities: number;
  personal: number;
  entertainment: number;
  other: number;
}

export interface ReductionScenario {
  id: string;
  name: string;
  category: keyof CategoryExpenses;
  currentAmount: number;
  reductionPercent: 10 | 25 | 50 | 100;
  newAmount: number;
  monthlySavings: number;
  annualSavings: number;
  fiNumberImpact: number;
  timelineImpact: number; // months saved
  efficiency: number; // months saved per 10k kr
  order: number;
}

export interface LeanFireResults {
  // Minimum FI Number
  barebonesMonthly: number;
  barebonesAnnual: number;
  minimumFINumber: number;
  fiMultiplier: 25 | 30;

  // Geographic comparison (if applicable)
  locationComparison?: GeographicComparison;

  // Reduction scenarios impact
  totalReductions: number; // total monthly savings from scenarios
  newMonthlyExpenses: number;
  newFINumber: number;
  totalMonthsSaved: number;

  // Timeline (if current savings known)
  yearsToFI?: number;
  monthsToFI?: number;

  // Frugality tips
  frugalityTips: FrugalityTip[];

  // Life energy (if AWH available)
  lifeEnergy?: {
    minimumFIInHours: number;
    minimumFIInYears: number;
    comfortableFIInYears: number;
    deluxeFIInYears: number;
  };
}

export interface GeographicComparison {
  reykjavik: LocationProfile;
  landsbyggd: LocationProfile;
  differences: CategoryExpenses; // positive = more expensive in Reykjavík
  fiNumberDifference: number;
  timelineDifference?: number; // months saved by choosing rural
  netSavings: number; // total monthly difference
}

export interface LocationProfile {
  location: 'reykjavik' | 'landsbyggd';
  expenses: CategoryExpenses;
  totalMonthly: number;
  totalAnnual: number;
  fiNumber: number;
  pros: string[];
  cons: string[];
}

export interface FrugalityTip {
  id: string;
  category: keyof CategoryExpenses;
  title: string;
  description: string;
  potentialSavings: number; // ISK per month
  timelineImpact: number; // months saved
  difficulty: 'easy' | 'moderate' | 'hard';
  icelandicResources?: string[];
  implemented: boolean;
}
```

### 4.2 Constants

```typescript
/**
 * LeanFIRE Constants
 */

export const LEANFIRE_DEFAULTS = {
  fiMultiplier: 30, // More conservative for LeanFIRE
  investmentReturn: 0.05, // 5% real return (conservative)
};

// Iceland barebones expenses (monthly ISK)
export const ICELAND_BAREBONES_REYKJAVIK: CategoryExpenses = {
  housing: 140000,
  food: 35000,
  transport: 12000,
  healthcare: 3000,
  insurance: 5000,
  utilities: 25000,
  personal: 8000,
  entertainment: 5000,
  other: 7000,
  // Total: 240,000 kr/month
};

export const ICELAND_BAREBONES_LANDSBYGGD: CategoryExpenses = {
  housing: 80000,
  food: 32000,
  transport: 25000, // Car needed
  healthcare: 3000,
  insurance: 8000, // Higher (car + homeowner's)
  utilities: 30000, // Higher (distance, heating)
  personal: 8000,
  entertainment: 3000,
  other: 11000,
  // Total: 200,000 kr/month
};

export const LOCATION_PROS_CONS = {
  reykjavik: {
    pros: [
      'Almenningssamgöngur (public transit)',
      'Fleiri störf (more jobs)',
      'Félagsleg starfsemi (social activities)',
      'Menningartilboð (cultural offerings)',
      'Nálægð við þjónustu (proximity to services)',
    ],
    cons: [
      'Dýrt húsnæði (expensive housing)',
      'Hærri lífskostnaður (higher cost of living)',
      'Meiri þéttleiki (higher density)',
      'Minni rými (less space)',
    ],
  },
  landsbyggd: {
    pros: [
      'Ódýrara húsnæði (cheaper housing)',
      'Minni FI tala (lower FI number)',
      'Náttúran nálæg (nature nearby)',
      'Rólegra samfélög (quieter communities)',
      'Einfaldari lífsstíll (simpler lifestyle)',
      'Meira rými (more space)',
    ],
    cons: [
      'Bíll nauðsynlegur (car required)',
      'Færri störf (fewer jobs)',
      'Færri þjónustur (fewer services)',
      'Vetrarerfiðir (difficult winters)',
      'Fjarlægð frá heilbrigðisþjónustu (distance from healthcare)',
    ],
  },
};

export const FRUGALITY_TIPS_DATABASE: Omit<FrugalityTip, 'id' | 'potentialSavings' | 'timelineImpact' | 'implemented'>[] = [
  // Housing
  {
    category: 'housing',
    title: 'Deila íbúð með herbergisfélaga',
    description: 'Deila íbúð getur sparað 40-60% af húsnæðiskostnaði. Íhugaðu að leita að áreiðanlegum herbergisfélaga á Facebook "Húsnæði til leigu" hópum.',
    difficulty: 'moderate',
    icelandicResources: ['Facebook: Húsnæði til leigu', 'Bland.is'],
  },
  {
    category: 'housing',
    title: 'Flytja í landsbyggð',
    description: 'Húsnæðiskostnaður getur verið 40-50% lægri utan höfuðborgarsvæðisins. Íhugaðu Akureyri, Reykjanesbær, eða smærri bæi.',
    difficulty: 'hard',
    icelandicResources: ['Fasteignir.is', 'Landleit.is'],
  },
  {
    category: 'housing',
    title: 'Langtímaleiga með afslætti',
    description: 'Semja um langtíma leigusamning (2+ ár) fyrir lægra verð. Margir leigusalar gefa afslátt fyrir öryggi.',
    difficulty: 'easy',
  },

  // Food
  {
    category: 'food',
    title: 'Versla bara í Bónus og Krónan',
    description: 'Þetta eru ódýrustu matvöruverslanirnar á Íslandi. Forðastu 10-11 og smærri verslanir nema í neyðartilvikum. Sparar 20-30%.',
    difficulty: 'easy',
    icelandicResources: ['Bónus', 'Krónan'],
  },
  {
    category: 'food',
    title: 'Skipuleggja máltíðir og kaupa í lausu',
    description: 'Gera máltíðaáætlun fyrir vikuna og kaupa í lausu minnkar matarsóun og sparar 15-25%. Nota Matur.is fyrir uppskriftir.',
    difficulty: 'moderate',
    icelandicResources: ['Matur.is', 'Matarsóun.is'],
  },
  {
    category: 'food',
    title: 'Minnka kjötneyslu',
    description: 'Kjöt er dýrast. Nota fleiri baunir, linsu, egg fyrir prótein. Getur sparað 8.000-12.000 kr/mán.',
    difficulty: 'easy',
  },
  {
    category: 'food',
    title: 'Koma með mat í vinnuna',
    description: 'Kaupa hádegismat úti kostar 2.000-3.000 kr/dag = 40.000-60.000 kr/mán. Heima unninn sparar 90% af þessu.',
    difficulty: 'easy',
  },

  // Transport
  {
    category: 'transport',
    title: 'Nota Strætó í stað bíls',
    description: 'Strætó mánaðarkort kostar 12.000 kr. Bíll kostar 40.000+ kr/mán (bensín, tryggingar, viðhald). Sparar 28.000+ kr/mán.',
    difficulty: 'hard',
    icelandicResources: ['Straeto.is'],
  },
  {
    category: 'transport',
    title: 'Hjóla þegar hægt er',
    description: 'Hjól er ókeypis eftir upphafskostnað. Hjólastígar góðir í Reykjavík. Sækja notað hjól á Facebook Marketplace.',
    difficulty: 'moderate',
    icelandicResources: ['Facebook Marketplace', 'Samtök notaðra hjóla'],
  },
  {
    category: 'transport',
    title: 'Kaupa notaðan bíl í staðinn fyrir nýjan',
    description: 'Notaður bíll (5-10 ára) er 50-70% ódýrari en nýr. Sparar bæði í kaupverði og tryggingum.',
    difficulty: 'easy',
    icelandicResources: ['Bilasolur.is', 'Bland.is bílar'],
  },

  // Entertainment
  {
    category: 'entertainment',
    title: 'Nota bókasöfn í stað að kaupa bækur/kvikmyndir',
    description: 'Borgarbókasafn er ókeypis með aðgang að bókum, tónlist, kvikmyndum, tímaritum. Sparar 5.000-10.000 kr/mán.',
    difficulty: 'easy',
    icelandicResources: ['Borgarbókasafn Reykjavíkur', 'Landsbókasafn'],
  },
  {
    category: 'entertainment',
    title: 'Ókeypis félagsleg starfsemi',
    description: 'Göngutúrar, útivist, ókeypis tónleikar, listsýningar, spjallhópar. Náttúra Íslands er besta ókeypis afþreyingin.',
    difficulty: 'easy',
    icelandicResources: ['Listasafn Íslands (ókeypis þriðjudaga)', 'Þjóðminjasafnið'],
  },
  {
    category: 'entertainment',
    title: 'Hætta við streymisþjónustur',
    description: 'Netflix, HBO, Spotify, osfrv geta kostað 10.000+ kr/mán. Nota ókeypis valkosti eða deila reikningum.',
    difficulty: 'moderate',
  },

  // Personal
  {
    category: 'personal',
    title: 'Kaupa notað í stað nýtt',
    description: 'Föt, húsgögn, raftæki á Facebook Marketplace, Bland.is, eða rauða krossinn. Sparar 50-80%.',
    difficulty: 'easy',
    icelandicResources: ['Facebook Marketplace', 'Bland.is', 'Rauði krossinn'],
  },
  {
    category: 'personal',
    title: 'Klippa hár heima',
    description: 'Hárklippingar kosta 5.000-8.000 kr. Kaupa klippivél (10.000 kr einu sinni) eða láta vini klippa.',
    difficulty: 'moderate',
  },

  // Utilities
  {
    category: 'utilities',
    title: 'Bera saman internet þjónustur',
    description: 'Síminn, Nova, Vodafone hafa mismunandi verð. Kanna hvort ódýrari pakki nægir. Sparar 2.000-5.000 kr/mán.',
    difficulty: 'easy',
    icelandicResources: ['Samkeppniseftirlitið - Verðberi'],
  },
  {
    category: 'utilities',
    title: 'Lækka hita og spara rafmagn',
    description: 'Rafmagn er ódýrt á Íslandi en samt sparnaður mögulegur. Lækka hita um 1-2°C, slökkva ljós, tæki.',
    difficulty: 'easy',
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

  // LeanFIRE
  leanFire: LeanFireState | null;
  leanFireResults: LeanFireResults | null;

  // LeanFIRE Actions
  updateLeanFire: (state: Partial<LeanFireState>) => void;
  setLocation: (location: 'reykjavik' | 'landsbyggd' | 'custom') => void;
  addReductionScenario: (scenario: Omit<ReductionScenario, 'id' | 'order'>) => void;
  removeReductionScenario: (id: string) => void;
  implementFrugalityTip: (tipId: string) => void;
  resetLeanFire: () => void;

  // LeanFIRE API
  getMinimumFINumber: () => number;
  getBarebonesExpenses: () => CategoryExpenses;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  leanFire?: {
    selectedLocation: 'reykjavik' | 'landsbyggd' | 'custom';
    customLocationExpenses?: CategoryExpenses;
    barebonesExpenses: CategoryExpenses;
    expenseSource: 'baseline' | 'default' | 'custom';
    fiMultiplier: 25 | 30;
    reductionScenarios: ReductionScenario[];
    currentSavings: number | null;
    currentAge: number | null;
    savingsRate: number | null;
    investmentReturn: number;
    lastUpdated: string; // ISO date string
    version: number;
  };
}
```

---

## 5. Calculation Logic

### 5.1 Minimum FI Number Calculator

**File**: `/src/lib/calculations/leanFire.ts`

```typescript
/**
 * Calculate minimum FI number from barebones expenses
 */
export const calculateMinimumFINumber = (
  barebonesMonthly: number,
  fiMultiplier: 25 | 30
): number => {
  const barebonesAnnual = barebonesMonthly * 12;
  return barebonesAnnual * fiMultiplier;
};

/**
 * Calculate total monthly expenses from category breakdown
 */
export const calculateTotalMonthly = (
  expenses: CategoryExpenses
): number => {
  return Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
};
```

### 5.2 Geographic Comparison Calculator

```typescript
/**
 * Compare costs between locations
 */
export const compareLocations = (
  reykjavikExpenses: CategoryExpenses,
  landsbyggdExpenses: CategoryExpenses,
  fiMultiplier: 25 | 30,
  currentSavings: number | null,
  savingsRate: number | null,
  investmentReturn: number
): GeographicComparison => {
  const reykjavikTotal = calculateTotalMonthly(reykjavikExpenses);
  const landsbyggdTotal = calculateTotalMonthly(landsbyggdExpenses);

  const reykjavikFI = calculateMinimumFINumber(reykjavikTotal, fiMultiplier);
  const landsbyggdFI = calculateMinimumFINumber(landsbyggdTotal, fiMultiplier);

  // Calculate differences per category
  const differences: CategoryExpenses = {} as CategoryExpenses;
  for (const key of Object.keys(reykjavikExpenses) as Array<keyof CategoryExpenses>) {
    differences[key] = reykjavikExpenses[key] - landsbyggdExpenses[key];
  }

  const netSavings = reykjavikTotal - landsbyggdTotal;
  const fiNumberDifference = reykjavikFI - landsbyggdFI;

  // Timeline difference (if current savings known)
  let timelineDifference: number | undefined;
  if (currentSavings !== null && savingsRate !== null) {
    const reykjavikTimeline = calculateYearsToFI(
      currentSavings,
      reykjavikFI,
      savingsRate,
      investmentReturn
    );
    const landsbyggdTimeline = calculateYearsToFI(
      currentSavings,
      landsbyggdFI,
      savingsRate,
      investmentReturn
    );
    timelineDifference = (reykjavikTimeline - landsbyggdTimeline) * 12; // months
  }

  return {
    reykjavik: {
      location: 'reykjavik',
      expenses: reykjavikExpenses,
      totalMonthly: reykjavikTotal,
      totalAnnual: reykjavikTotal * 12,
      fiNumber: reykjavikFI,
      pros: LOCATION_PROS_CONS.reykjavik.pros,
      cons: LOCATION_PROS_CONS.reykjavik.cons,
    },
    landsbyggd: {
      location: 'landsbyggd',
      expenses: landsbyggdExpenses,
      totalMonthly: landsbyggdTotal,
      totalAnnual: landsbyggdTotal * 12,
      fiNumber: landsbyggdFI,
      pros: LOCATION_PROS_CONS.landsbyggd.pros,
      cons: LOCATION_PROS_CONS.landsbyggd.cons,
    },
    differences,
    fiNumberDifference,
    timelineDifference,
    netSavings,
  };
};
```

### 5.3 Reduction Scenario Calculator

```typescript
/**
 * Calculate impact of expense reduction scenario
 */
export const calculateReductionImpact = (
  category: keyof CategoryExpenses,
  currentAmount: number,
  reductionPercent: 10 | 25 | 50 | 100,
  fiMultiplier: 25 | 30,
  currentSavings: number | null,
  currentFINumber: number,
  savingsRate: number | null,
  investmentReturn: number
): Omit<ReductionScenario, 'id' | 'name' | 'order'> => {
  const newAmount = currentAmount * (1 - reductionPercent / 100);
  const monthlySavings = currentAmount - newAmount;
  const annualSavings = monthlySavings * 12;
  const fiNumberImpact = annualSavings * fiMultiplier;

  // Timeline impact (if current savings known)
  let timelineImpact = 0;
  if (currentSavings !== null && savingsRate !== null) {
    const oldTimeline = calculateYearsToFI(
      currentSavings,
      currentFINumber,
      savingsRate,
      investmentReturn
    );
    const newFINumber = currentFINumber - fiNumberImpact;
    const newTimeline = calculateYearsToFI(
      currentSavings,
      newFINumber,
      savingsRate,
      investmentReturn
    );
    timelineImpact = (oldTimeline - newTimeline) * 12; // months
  }

  // Efficiency: months saved per 10k kr cut
  const efficiency = monthlySavings > 0 ? timelineImpact / (monthlySavings / 10000) : 0;

  return {
    category,
    currentAmount,
    reductionPercent,
    newAmount,
    monthlySavings,
    annualSavings,
    fiNumberImpact,
    timelineImpact,
    efficiency,
  };
};

/**
 * Calculate cumulative impact of multiple scenarios
 */
export const calculateCumulativeImpact = (
  scenarios: ReductionScenario[],
  baselineExpenses: CategoryExpenses,
  fiMultiplier: 25 | 30
): {
  totalReductions: number;
  newMonthlyExpenses: number;
  newFINumber: number;
  totalMonthsSaved: number;
} => {
  const totalReductions = scenarios.reduce(
    (sum, s) => sum + s.monthlySavings,
    0
  );

  const baseTotal = calculateTotalMonthly(baselineExpenses);
  const newMonthlyExpenses = baseTotal - totalReductions;
  const newFINumber = calculateMinimumFINumber(newMonthlyExpenses, fiMultiplier);

  const totalMonthsSaved = scenarios.reduce(
    (sum, s) => sum + s.timelineImpact,
    0
  );

  return {
    totalReductions,
    newMonthlyExpenses,
    newFINumber,
    totalMonthsSaved,
  };
};
```

### 5.4 Frugality Tips Generator

```typescript
/**
 * Generate personalized frugality tips
 */
export const generateFrugalityTips = (
  currentExpenses: CategoryExpenses,
  minimumExpenses: CategoryExpenses,
  fiMultiplier: 25 | 30,
  currentSavings: number | null,
  currentFINumber: number,
  savingsRate: number | null,
  investmentReturn: number
): FrugalityTip[] => {
  const tips: FrugalityTip[] = [];

  // Identify high-spend categories
  const highSpendCategories: Array<keyof CategoryExpenses> = [];
  for (const key of Object.keys(currentExpenses) as Array<keyof CategoryExpenses>) {
    if (currentExpenses[key] > minimumExpenses[key] * 1.1) { // 10% margin
      highSpendCategories.push(key);
    }
  }

  // Generate tips for high-spend categories
  highSpendCategories.forEach(category => {
    const categoryTips = FRUGALITY_TIPS_DATABASE.filter(t => t.category === category);

    categoryTips.forEach(tipTemplate => {
      const potentialSavings = Math.min(
        currentExpenses[category] - minimumExpenses[category],
        estimateSavingsForTip(tipTemplate, currentExpenses[category])
      );

      // Calculate timeline impact
      let timelineImpact = 0;
      if (currentSavings !== null && savingsRate !== null && potentialSavings > 0) {
        const annualSavings = potentialSavings * 12;
        const fiReduction = annualSavings * fiMultiplier;
        const oldTimeline = calculateYearsToFI(
          currentSavings,
          currentFINumber,
          savingsRate,
          investmentReturn
        );
        const newTimeline = calculateYearsToFI(
          currentSavings,
          currentFINumber - fiReduction,
          savingsRate,
          investmentReturn
        );
        timelineImpact = (oldTimeline - newTimeline) * 12; // months
      }

      tips.push({
        id: `${category}-${tipTemplate.title}`,
        ...tipTemplate,
        potentialSavings,
        timelineImpact,
        implemented: false,
      });
    });
  });

  // Sort by timeline impact (biggest first)
  tips.sort((a, b) => b.timelineImpact - a.timelineImpact);

  return tips;
};

/**
 * Estimate savings for a specific tip
 */
function estimateSavingsForTip(
  tip: Omit<FrugalityTip, 'id' | 'potentialSavings' | 'timelineImpact' | 'implemented'>,
  currentCategoryExpense: number
): number {
  // Rough estimates based on tip type
  const savingsEstimates: Record<string, number> = {
    'Versla bara í Bónus og Krónan': currentCategoryExpense * 0.25,
    'Skipuleggja máltíðir og kaupa í lausu': currentCategoryExpense * 0.20,
    'Koma með mat í vinnuna': 40000, // Fixed amount
    'Nota Strætó í stað bíls': 28000,
    'Hjóla þegar hægt er': 20000,
    'Nota bókasöfn í stað að kaupa bækur/kvikmyndir': 7000,
    'Hætta við streymisþjónustur': 10000,
    // ... more estimates
  };

  return savingsEstimates[tip.title] || currentCategoryExpense * 0.15;
}
```

### 5.5 Timeline Calculator (Shared)

```typescript
/**
 * Calculate years to FI (shared utility)
 */
export const calculateYearsToFI = (
  currentSavings: number,
  fiNumber: number,
  savingsRate: number, // Percentage of income saved
  investmentReturn: number
): number => {
  if (currentSavings >= fiNumber) return 0;

  // Simplified calculation (assumes savings rate based on expenses)
  // More complex version would use actual income and savings
  const annualSavings = savingsRate * 12; // This is simplified

  // Use compound interest with annual contributions
  let years = 0;
  let balance = currentSavings;

  while (balance < fiNumber && years < 100) {
    balance = balance * (1 + investmentReturn) + annualSavings;
    years++;
  }

  return years;
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

**Data Access Pattern:**
```typescript
// In LeanFireCalculator component
const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();

// Check if baseline exists and has barebones tier
if (!hasExpenseBaseline() || !expenseBaseline?.tiers?.barebones) {
  return (
    <BaselinePrompt
      message="LeanFIRE skipuleggjandinn þarf lágmarks útgjaldagrunn"
      linkUrl="/utgjaldareiknivel"
      buttonText="Setja upp útgjaldagrunn"
      tierFocus="barebones"
    />
  );
}

// Get barebones expenses
const barebonesMonthly = expenseBaseline.tiers.barebones.total;
const barebonesBreakdown = expenseBaseline.tiers.barebones.categories;
```

### 6.2 Integration with Actual Hourly Wage

**Data Access Pattern:**
```typescript
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// Calculate life energy for minimum FI
if (actualHourlyWage) {
  const minimumFIInHours = minimumFINumber / actualHourlyWage;
  const minimumFIInYears = minimumFIInHours / 2080; // Work hours per year
}
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateLocation = (location: string): ValidationResult => {
  if (!['reykjavik', 'landsbyggd', 'custom'].includes(location)) {
    return { valid: false, error: 'Ógild staðsetning' };
  }
  return { valid: true };
};

const validateReductionScenario = (
  scenario: Partial<ReductionScenario>
): ValidationResult => {
  if (!scenario.category) {
    return { valid: false, error: 'Flokkur verður að vera valinn' };
  }

  if (scenario.reductionPercent && ![10, 25, 50, 100].includes(scenario.reductionPercent)) {
    return { valid: false, error: 'Ógild minnkun prósenta' };
  }

  if (scenario.newAmount && scenario.newAmount < 0) {
    return { valid: false, error: 'Nýja upphæðin getur ekki verið neikvæð' };
  }

  return { valid: true };
};
```

### 7.2 Missing Dependencies

```typescript
// No expense baseline
if (!hasExpenseBaseline()) {
  return (
    <BaselinePrompt
      message="LeanFIRE þarf útgjaldagrunn (lágmarks þrep)"
      linkUrl="/utgjaldareiknivel"
      tierFocus="barebones"
    />
  );
}

// No current savings for timeline
if (!currentSavings) {
  return (
    <Alert variant="info">
      <p>Settu inn núverandi sparnað til að sjá tímalínu til FI</p>
    </Alert>
  );
}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Lágmarks FIRE Skipuleggjandi              [Export] [Reset]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  │
│  │ MinimumFISummary         │  │ GeographicComparison     │  │
│  │ (Minimum FI Number)      │  │ (Location Comparison)    │  │
│  └──────────────────────────┘  └──────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ExpenseReductionScenarios                                │ │
│  │ (What if I cut X?)                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ FrugalityOptimizer                                       │ │
│  │ (Personalized tips)                                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ LifestyleTradeOffChart                                   │ │
│  │ (Expense vs Timeline)                                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ IcelandicContextPanel (Collapsible)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
- Stack all sections vertically
- Minimum FI Summary first
- Geographic Comparison second (tabs for locations)
- Expense Reduction third
- Frugality Optimizer fourth
- Trade-off chart fifth (simplified)
- Context panel last (collapsed)

### 8.2 Color Coding

```typescript
const LEANFIRE_COLORS = {
  barebones: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    accent: 'bg-emerald-500',
  },
  savings: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-600',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
  location: {
    reykjavik: 'bg-blue-100',
    landsbyggd: 'bg-purple-100',
  },
};
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `leanFire.test.ts` - Calculation logic
- `LeanFireCalculator.test.tsx` - Main component
- `GeographicComparisonPanel.test.tsx` - Location comparison

**Test Coverage:**
```typescript
// leanFire.test.ts
describe('calculateMinimumFINumber', () => {
  it('calculates 25x correctly', () => {
    expect(calculateMinimumFINumber(250000, 25)).toBe(75000000);
  });

  it('calculates 30x correctly', () => {
    expect(calculateMinimumFINumber(250000, 30)).toBe(90000000);
  });
});

describe('compareLocations', () => {
  it('shows rural savings correctly', () => {
    const comparison = compareLocations(
      ICELAND_BAREBONES_REYKJAVIK,
      ICELAND_BAREBONES_LANDSBYGGD,
      30,
      null,
      null,
      0.05
    );

    expect(comparison.netSavings).toBe(40000); // 240k - 200k
    expect(comparison.fiNumberDifference).toBe(14400000); // 40k × 12 × 30
  });
});
```

---

## 10. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Minimum FI Number | MinimumFISummary | calculateMinimumFINumber() |
| **US-2**: Geographic Comparison | GeographicComparisonPanel | compareLocations() |
| **US-3**: Expense Reduction | ExpenseReductionScenarios | calculateReductionImpact() |
| **US-4**: Frugality Optimization | FrugalityOptimizer | generateFrugalityTips() |
| **US-5**: Lifestyle Trade-Offs | LifestyleTradeOffChart | Trade-off curve visualization |
| **US-6**: Icelandic Context | IcelandicContextPanel | Iceland-specific constants and tips |
| **FR-1**: Minimum FI Calc | calculateMinimumFINumber() | Core calculation function |
| **FR-2**: Geographic Comparison | compareLocations() | Location cost profiles |
| **FR-3**: Reduction Scenarios | calculateReductionImpact() | Scenario modeling |
| **FR-4**: Frugality Engine | generateFrugalityTips() | Tips database + personalization |
| **FR-5**: Trade-Off Viz | LifestyleTradeOffChart | Recharts curve |
| **FR-6**: Icelandic Context | ICELAND_BAREBONES_*, LOCATION_PROS_CONS | Iceland constants |

---

## 11. Implementation Risks and Mitigations

### Risk 1: Complex Frugality Tips Personalization

**Risk**: Generating truly personalized tips is complex.

**Mitigation**:
- Start with rule-based system (if expense > minimum, suggest tip)
- Use templates with variable savings estimates
- Allow user feedback to improve suggestions
- Phase 2: ML-based personalization

### Risk 2: Geographic Data Accuracy

**Risk**: Iceland cost data may become outdated.

**Mitigation**:
- Source data from Statistics Iceland (Hagstofa)
- Allow user overrides (custom location)
- Provide last-updated date
- Regular review and updates (quarterly)

### Risk 3: Trade-Off Chart Complexity

**Risk**: Expense vs timeline curve calculation is complex.

**Mitigation**:
- Use simplified model initially
- Provide clear assumptions
- Make interactive features optional
- Focus on relative comparisons, not absolute precision

---

## 12. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed
- [x] Iceland-specific data included
- [x] Integration points documented

### Feasibility
- [x] Uses existing technology stack
- [x] Integrates with existing CalculatorContext
- [x] Leverages Expense Baseline API
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Iceland context prioritized
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] Consumes Expense Baseline API (barebones tier)
- [x] Integrates AWH for life energy
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
