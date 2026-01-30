# Design: FatFIRE Planner

## Document Information

- **Feature Name**: FatFIRE Planner (Lúxus FIRE Áætlun)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-fat-fire.md

---

## 1. System Overview

### 1.1 Purpose

The FatFIRE Planner helps users plan luxurious early retirement without lifestyle compromise. It calculates FI numbers with comfortable safety margins (30x multiplier), builds lifestyle wish lists, integrates splurge budgets, and projects timelines to abundant financial independence. The calculator emphasizes premium Icelandic living costs and abundance mindset.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements
- Premium visual design (gold/amber accents)

### 1.3 Key Design Principles

1. **Abundance Mindset**: No compromise on lifestyle quality
2. **Comprehensive Planning**: Wish lists + splurge budgets + base expenses
3. **Conservative Safety**: 30x multiplier default (3.33% withdrawal rate)
4. **Icelandic Premium Context**: Reykjavík 101/105 living, international travel
5. **Scenario-Driven**: Compare "Keep Everything" vs "Optimized Deluxe" vs "Custom"
6. **Life Energy Aware**: Convert FI number and timeline to work hours
7. **Integration-First**: Leverages Deluxe tier from Expense Baseline

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Expense Input    │  │ Wish List Builder│  │ Timeline Display     │  │
│  │ (Deluxe Tier)    │  │ (Premium Items)  │  │ (Milestones)         │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  fatFire: FatFireState                                          │   │
│  │    - baseDeluxeExpenses: number (from baseline)                 │   │
│  │    - wishList: WishListItem[]                                   │   │
│  │    - splurgeBudget: number                                      │   │
│  │    - fiMultiplier: number (default 30)                          │   │
│  │    - currentSavings: number                                     │   │
│  │    - monthlySavingsRate: number                                 │   │
│  │    - expectedReturn: number (default 6%)                        │   │
│  │    - scenarios: FatFireScenario[]                               │   │
│  │  fatFireResults: FatFireResults                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration with:                                               │   │
│  │    - expenseBaseline (Deluxe tier)                              │   │
│  │    - actualHourlyWage (life energy)                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ FI Number         │  │ Timeline          │  │ Life Energy       │  │
│  │ Calculator        │  │ Projector         │  │ Converter         │  │
│  │ (Base+Wish+Splurge)│  │ (to FatFIRE)      │  │ (Work Hours)      │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Scenario          │  │ Wish List         │  │ Splurge Budget    │  │
│  │ Comparison        │  │ Manager           │  │ Calculator        │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Expense Baseline  │  │ FI Number         │  │
│  │ Manager           │  │ Integration       │  │ Builder           │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
FatFireCalculator (Page Component)
├── EducationalIntro (Collapsible)
│   ├── WhatIsFatFIRE
│   ├── SafetyMarginExplainer
│   └── IcelandicPremiumContext
│
├── ExpenseInputSection
│   ├── DeluxeTierDisplay (from baseline)
│   │   ├── BaseDeluxeExpenses
│   │   ├── CategoryBreakdown
│   │   └── EditDeluxeButton
│   ├── WishListBuilder
│   │   ├── WishListItem (repeatable)
│   │   │   ├── ItemName
│   │   │   ├── AnnualCost
│   │   │   ├── Priority (must-have/nice-to-have)
│   │   │   └── CategorySelector
│   │   ├── AddWishListItemButton
│   │   └── WishListSummary
│   └── SplurgeBudgetInput
│       ├── AnnualAmountInput
│       ├── MonthlyWeeklyEquivalent
│       └── ExampleUsesDisplay
│
├── FINumberSection
│   ├── MultiplierSelector (25x | 30x | 33x | custom)
│   ├── TotalExpenseBreakdown
│   │   ├── BaseDeluxe (X kr/year)
│   │   ├── WishList (Y kr/year)
│   │   ├── SplurgeBudget (Z kr/year)
│   │   └── Total (W kr/year)
│   ├── FINumberDisplay (W × Multiplier)
│   └── SafetyMarginExplainer
│
├── TimelineSection
│   ├── SavingsInputs
│   │   ├── CurrentSavingsInput
│   │   ├── MonthlySavingsRateInput
│   │   ├── ExpectedReturnSlider (default 6%)
│   │   └── CurrentAgeInput
│   ├── TimelineResults
│   │   ├── YearsToFatFIRE
│   │   ├── FatFIREAge
│   │   ├── CalendarDate
│   │   └── MilestoneMarkers (25%, 50%, 75%, 100%)
│   └── TimelineChart
│       ├── GrowthProjectionLine
│       ├── FINumberTarget
│       ├── MilestoneMarkers
│       └── CurrentProgress
│
├── ScenarioComparisonSection
│   ├── ScenarioList
│   │   ├── CurrentLifestyleScenario (actual spending)
│   │   ├── OptimizedDeluxeScenario (baseline deluxe)
│   │   └── CustomScenario (user-defined)
│   ├── ComparisonTable
│   │   ├── FINumber column
│   │   ├── YearsToFatFIRE column
│   │   ├── MonthlySavingsRequired column
│   │   └── LifestyleTradeoffs column
│   └── ComparisonChart
│
├── LifeEnergySection (if AWH available)
│   ├── FINumberInHours
│   ├── TimelineInWorkYears
│   ├── ComparisonToLeanFIRE
│   └── TradeoffExplainer
│
└── KeyInsights (Plain language summary)
    ├── MainTakeaway
    ├── TimelineExpectation
    ├── LifestylePreservation
    └── NextStepsRecommendation
```

### 2.3 Data Flow

**Initial Load Flow:**
```
Page Load → Load from localStorage → Check for Expense Baseline Deluxe tier
                                              ↓
                                    ┌─────────┴──────────┐
                                    ↓                    ↓
                            Deluxe Exists          No Deluxe
                                    ↓                    ↓
                        Load Base Expenses    Prompt to Create Baseline
                                    ↓                    ↓
                            Load Wish List       Show Manual Input Option
                                    ↓                    ↓
                        Load Splurge Budget              │
                                    ↓                    │
                                    └────────┬───────────┘
                                             ↓
                                  Calculate Total Annual Expenses
                                             ↓
                                  Calculate FI Number (× Multiplier)
                                             ↓
                                  Calculate Timeline (if savings entered)
                                             ↓
                                  Display Results
```

**User Interaction Flow:**
```
User Adjusts Expense/Wish/Splurge → Validate → Update Total Expenses
                                                        ↓
                                              Recalculate FI Number
                                                        ↓
                                              Recalculate Timeline
                                                        ↓
                                              Update All Displays
                                                        ↓
                                              Debounced Save to localStorage
```

**Scenario Comparison Flow:**
```
User Creates Multiple Scenarios → Calculate for Each:
    ├── Total expenses
    ├── FI number
    ├── Years to FatFIRE
    ├── Monthly savings required
    └── Lifestyle trade-offs
         ↓
Display Side-by-Side Comparison
         ↓
Highlight Differences (time, cost, lifestyle)
```

---

## 3. Component Design

### 3.1 FatFireCalculator (Main Component)

**Responsibility**: Page-level container and state coordinator

**Interface:**
```typescript
interface FatFireCalculatorProps {
  // No props - gets data from CalculatorContext
}

interface FatFireCalculatorState {
  showEducation: boolean; // Collapsible intro
  selectedScenario: string; // active scenario ID for chart display
}
```

**Key Features:**
- Loads saved state from context
- Detects if expense baseline exists
- Coordinates calculations across all sections
- Manages localStorage persistence
- Premium visual theme (gold/amber accents)

---

### 3.2 DeluxeTierDisplay Component

**Responsibility**: Display and edit base deluxe expenses from baseline

**Interface:**
```typescript
interface DeluxeTierDisplayProps {
  baseDeluxeExpenses: number; // monthly ISK from baseline
  categories: ExpenseCategoryBreakdown[]; // category detail
  onEdit: () => void; // navigate to expense baseline
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Grunnútgjöld (Lúxus þrep)                              │
│                                                         │
│  Heildar lúxusútgjöld:    1.000.000 kr/mán             │
│                          12.000.000 kr/ár              │
│                                                         │
│  Útgjaldaflokkur:                                       │
│  • Húsnæði:               300.000 kr  (101/105 eða jafngildi) │
│  • Matur:                 100.000 kr  (veitingar, premium) │
│  • Samgöngur:              70.000 kr  (premium ökutæki)   │
│  • Ferðalög:               50.000 kr  (600.000 kr/ár)    │
│  • Skemmtun:               80.000 kr  (upplifanir, áhugamál)│
│  • Persónulegt:            50.000 kr  (premium umhirða)   │
│  • Annað:                  50.000 kr                      │
│                                                         │
│  [Breyta lúxusútgjöldum]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Displays base monthly deluxe expenses
- Shows category breakdown with Icelandic premium context
- Links to expense baseline for editing
- Auto-syncs when baseline changes

---

### 3.3 WishListBuilder Component

**Responsibility**: Create and manage lifestyle wish list

**Interface:**
```typescript
interface WishListBuilderProps {
  wishList: WishListItem[];
  onAddItem: (item: Omit<WishListItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<WishListItem>) => void;
  onDeleteItem: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface WishListItem {
  id: string;
  name: string;
  annualCost: number; // ISK per year
  priority: 'must-have' | 'nice-to-have';
  category: WishListCategory;
  notes?: string;
}

type WishListCategory =
  | 'premium-housing'
  | 'international-travel'
  | 'premium-healthcare'
  | 'luxury-experiences'
  | 'high-end-dining'
  | 'premium-vehicles'
  | 'hobby-collections'
  | 'other';
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Lífsstílsóskarlisti                                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ⭐ Alþjóðleg ferðalög (2-3 sinnum á ári)         │  │
│  │    Flokkur: Alþjóðleg ferðalög                  │  │
│  │    Kostnaður: 1.500.000 kr/ár                   │  │
│  │    Forgangur: [●] Nauðsynlegt  [ ] Gott-að-hafa│  │
│  │    [✏️] [🗑️]                                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Premium íbúð í 101/105                           │  │
│  │    Flokkur: Premium húsnæði                     │  │
│  │    Kostnaður: 600.000 kr/ár (viðbót)           │  │
│  │    Forgangur: [●] Nauðsynlegt  [ ] Gott-að-hafa│  │
│  │    [✏️] [🗑️]                                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  [+ Bæta við óskum]                                    │
│                                                         │
│  📊 Samtals óskarlisti:                                │
│  • Nauðsynlegt:        2.100.000 kr/ár                │
│  • Gott-að-hafa:         500.000 kr/ár                │
│  • Alls:               2.600.000 kr/ár                │
│                                                         │
│  💡 Áhrif á FI tölu: +78.000.000 kr (30x margfaldari)│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Add/edit/delete wish list items
- Category selector with Icelandic premium categories
- Priority toggle (must-have includes in base FI, nice-to-have shown separately)
- Annual cost input per item
- Notes field for context
- Drag-and-drop reordering
- Summary showing total by priority
- Impact on FI number calculated

---

### 3.4 SplurgeBudgetInput Component

**Responsibility**: Input and explain splurge budget

**Interface:**
```typescript
interface SplurgeBudgetInputProps {
  annualSplurgeBudget: number;
  onUpdate: (budget: number) => void;
  baseExpenses: number; // for percentage calculation
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Aukaútgjaldaáætlun (Splurge Budget)                    │
│                                                         │
│  Árlegt:                                                │
│  ┌─────────────────────────────┐                       │
│  │ 2.000.000                kr │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  Jafngildir:                                            │
│  • Mánaðarlega:    166.667 kr                          │
│  • Vikulega:        38.462 kr                          │
│                                                         │
│  Dæmi um notkun:                                        │
│  • Óvænt alþjóðleg ferðalög                           │
│  • Premium upplifanir (tónleikar, viðburðir)          │
│  • Lúxuskaup án áætlunar                              │
│  • Gjafir til ættingja/vina                           │
│  • "Af því að ég vil" útgjöld                         │
│                                                         │
│  Hlutfall af grunnútgjöldum: 16,7%                     │
│  Status: ✅ Rausnarlegt en raunhæft                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Annual splurge budget input
- Monthly/weekly equivalent calculated
- Example uses displayed
- Percentage of base expenses shown
- Status indicator (modest/comfortable/generous)
- Warning if >30% of base expenses

---

### 3.5 FINumberSection Component

**Responsibility**: Display FI number calculation with multiplier options

**Interface:**
```typescript
interface FINumberSectionProps {
  baseDeluxeExpenses: number; // annual
  wishListTotal: number; // annual must-have
  splurgeBudget: number; // annual
  fiMultiplier: number;
  onMultiplierChange: (multiplier: number) => void;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  FI Tala (með þæglegum öryggismörkum)                   │
│                                                         │
│  Margfaldari:                                           │
│  [ ] 28x (3,57% withdrawal)                            │
│  [●] 30x (3,33% withdrawal) - Mælt með fyrir FatFIRE   │
│  [ ] 33x (3,03% withdrawal) - Mjög íhaldssamt          │
│  [ ] Sérsniðið: [__] x                                 │
│                                                         │
│  Árleg útgjöld:                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Grunnútgjöld (lúxus):    12.000.000 kr         │  │
│  │ Óskarlisti (nauðsynlegt):  2.100.000 kr        │  │
│  │ Aukaútgjaldaáætlun:        2.000.000 kr        │  │
│  │ ────────────────────────────────────────        │  │
│  │ Samtals á ári:            16.100.000 kr        │  │
│  │                         (1.341.667 kr/mán)     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗│
│  ║  FI TALA                                          ║│
│  ║  483.000.000 kr                                   ║│
│  ║  (16.100.000 × 30)                                ║│
│  ╚═══════════════════════════════════════════════════╝│
│                                                         │
│  💡 Með 30x margfaldara geturðu tekið út 3,33% á ári │
│     með mjög miklu öryggi. FatFIRE notar hærri       │
│     margfaldara til að tryggja þægindi og           │
│     lífsstílsvernd.                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Multiplier selector (28x, 30x, 33x, custom)
- Total annual expense breakdown
- FI number calculation displayed prominently
- Safety margin explanation
- Warning if multiplier <28x for FatFIRE
- Monthly equivalent shown

---

### 3.6 TimelineSection Component

**Responsibility**: Calculate and display timeline to FatFIRE

**Interface:**
```typescript
interface TimelineSectionProps {
  fiNumber: number;
  currentSavings: number;
  monthlySavingsRate: number;
  expectedReturn: number;
  currentAge: number | null;
  onSavingsChange: (savings: number) => void;
  onSavingsRateChange: (rate: number) => void;
  onReturnChange: (returnRate: number) => void;
  onAgeChange: (age: number | null) => void;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Tímalína til FatFIRE                                   │
│                                                         │
│  Núverandi sparnaður:                                   │
│  ┌─────────────────────────────┐                       │
│  │ 50.000.000               kr │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  Mánaðarlegur sparnaður:                                │
│  ┌─────────────────────────────┐                       │
│  │ 500.000                  kr │                       │
│  └─────────────────────────────┘                       │
│                                                         │
│  Vænt ávöxtun (raunveruleg):                            │
│  [●────────○─────────] 6,0%  (íhaldssamt 5% | bjartsýnt 7%)│
│                                                         │
│  Núverandi aldur: [40] ára  (valfrjálst)                │
│                                                         │
│  ╔═══════════════════════════════════════════════════╗│
│  ║  Þú nærð FatFIRE eftir 18 ár og 6 mánuði         ║│
│  ║  við 58 ára aldur (2044-07-15)                   ║│
│  ╚═══════════════════════════════════════════════════╝│
│                                                         │
│  Áfangar:                                               │
│  • 25% FI (120,75M kr):  4 ár, 9 mán  (2031)           │
│  • 50% FI (241,50M kr): 10 ár, 2 mán  (2036)           │
│  • 75% FI (362,25M kr): 14 ár, 8 mán  (2040)           │
│  • 100% FI (483,00M kr): 18 ár, 6 mán (2044) ⭐        │
│                                                         │
│  [View Timeline Chart]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Current savings input
- Monthly savings rate input
- Expected return slider (conservative/moderate/optimistic presets)
- Current age input (optional)
- Years to FatFIRE calculation
- FatFIRE age and calendar date
- Milestone markers (25%, 50%, 75%, 100% FI)
- Timeline chart toggle

---

### 3.7 TimelineChart Component

**Responsibility**: Visualize savings growth to FatFIRE

**Interface:**
```typescript
interface TimelineChartProps {
  currentSavings: number;
  fiNumber: number;
  monthlySavingsRate: number;
  expectedReturn: number;
  currentAge: number | null;
  milestones: MilestoneData[];
}

interface MilestoneData {
  percentage: number; // 25, 50, 75, 100
  amount: number; // ISK
  yearsFromNow: number;
  age: number | null;
  date: Date;
}
```

**Visual Layout:**
```
Balance (kr)
    │
500M│                                         ___----**** ⭐ FatFIRE
    │                                   __---*
450M│                             __---*
    │                       __---*  ╱ 75%
400M│                 __---*      │
    │           __---*            │
350M│     __---*                  │
    │  *                          │
300M│ │                           │
    │ │       50%                 │
250M│ │       │                   │
    │ │       │                   │
200M│ │       │                   │
    │ │   25% │                   │
150M│ │   │   │                   │
    │ │   │   │                   │
100M│ │   │   │                   │
    │ │   │   │                   │
 50M│ *───┼───┼───────────────────┤ Current
    ├─┼───┼───┼───┬───────┬───────┬─→ Year
    Nú  5  10  15   20     25     30
       2031 2036 2040    2050
```

**Features:**
- Growth projection line showing compound growth
- FI number target line (horizontal)
- Milestone markers (25%, 50%, 75%, 100%)
- Current savings starting point
- Hover tooltip showing exact balance at any point
- Age axis (if current age provided)
- Responsive design
- Mobile-friendly (pinch-to-zoom)

---

### 3.8 ScenarioComparisonSection Component

**Responsibility**: Compare multiple FatFIRE expense scenarios

**Interface:**
```typescript
interface ScenarioComparisonSectionProps {
  scenarios: FatFireScenario[];
  onAddScenario: (scenario: Omit<FatFireScenario, 'id'>) => void;
  onDeleteScenario: (id: string) => void;
  currentSavings: number;
  monthlySavingsRate: number;
  expectedReturn: number;
}

interface FatFireScenario {
  id: string;
  name: string;
  baseExpenses: number; // annual
  wishListTotal: number; // annual
  splurgeBudget: number; // annual
  fiMultiplier: number;
}

interface ScenarioResults {
  scenarioId: string;
  fiNumber: number;
  yearsToFatFIRE: number;
  monthlySavingsRequired: number;
  lifestyleDescription: string;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  Samanburður á Sviðsmyndum                                               │
│                                                                          │
│  ┌────────────┬──────────────┬────────────┬─────────────┬──────────┐   │
│  │ Sviðsmynd  │ FI Tala      │ Ár til     │ Sparnaður   │ Lífsstíll│   │
│  │            │              │ FatFIRE    │ þörf/mán    │          │   │
│  ├────────────┼──────────────┼────────────┼─────────────┼──────────┤   │
│  │ Núverandi  │ 600.000.000  │ 24,3 ár    │ 650.000 kr  │ Halda    │   │
│  │ lífsstíll  │      kr      │            │             │ öllu     │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  │ Lúxus      │ 483.000.000  │ 18,6 ár ⭐ │ 500.000 kr  │ Fínstillt│   │
│  │ (fínstillt)│      kr      │            │             │ lúxus    │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  │ Sérsniðið  │ 540.000.000  │ 21,2 ár    │ 575.000 kr  │ Miðlungs │   │
│  │            │      kr      │            │             │          │   │
│  │ ────────────────────────────────────────────────────────────────│   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ⭐ = Ráðlögð sviðsmynd                                                 │
│                                                                          │
│  💡 "Lúxus (fínstillt)" sviðsmyndin er 5,7 ár hraðari en                │
│     "Núverandi lífsstíll" og sparar þér 150.000 kr/mán í               │
│     sparnaði, en þú heldur áfram að lifa í lúxus.                      │
│                                                                          │
│  [Bar Chart Comparison]                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Presets: "Current Lifestyle", "Optimized Deluxe", "Custom"
- Table showing FI number, years, monthly savings, lifestyle
- Highlight differences (time, cost, trade-offs)
- Bar chart visualization
- Add/delete custom scenarios
- Recommendations based on comparison

---

### 3.9 LifeEnergySection Component

**Responsibility**: Display FatFIRE in life energy terms

**Interface:**
```typescript
interface LifeEnergySectionProps {
  fiNumber: number;
  yearsToFatFIRE: number;
  actualHourlyWage: number | null;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ⏱️ LÍFSORKA - Vinnustundir                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  FI tala í vinnustundum:                             │
│  483.000.000 kr = 193.200 vinnustundir              │
│  (≈ 92,9 ár af vinnudögum)                          │
│                                                      │
│  Vinnuár til FatFIRE:                                │
│  18,6 ár × 2.080 klst/ár = 38.688 vinnustundir     │
│                                                      │
│  🎯 Samanburður við LeanFIRE:                       │
│  • LeanFIRE: 93.000.000 kr = 37.200 klst (17,9 ár) │
│  • FatFIRE: 483.000.000 kr = 193.200 klst (92,9 ár)│
│  • Viðbót: 156.000 klst (75 ár af vinnu)           │
│                                                      │
│  💡 Skipting:                                        │
│     FatFIRE krefst 75 ára af viðbótar vinnu en     │
│     veitir þér fullt lífsstílsfrelsi án málamiðlana.│
│     Þú ert að vinna fyrir LÍFSGÆÐI, ekki aðeins    │
│     lifun.                                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- FI number in work hours (FI ÷ AWH)
- Timeline in work years (years × 2080 hours/year)
- Comparison to LeanFIRE (show additional work required)
- Trade-off explanation (lifestyle vs. time)
- Prompt if AWH not available

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * FatFIRE Types
 */

export interface FatFireState {
  // Expenses
  baseDeluxeExpenses: number; // monthly ISK from baseline
  wishList: WishListItem[];
  splurgeBudget: number; // annual ISK
  fiMultiplier: number; // default 30

  // Savings
  currentSavings: number;
  monthlySavingsRate: number;
  expectedReturn: number; // default 0.06 (6%)
  currentAge: number | null;

  // Scenarios
  scenarios: FatFireScenario[];

  // Metadata
  lastUpdated: Date;
  version: number;
}

export interface WishListItem {
  id: string;
  name: string;
  annualCost: number; // ISK
  priority: 'must-have' | 'nice-to-have';
  category: WishListCategory;
  notes?: string;
  order: number;
}

export type WishListCategory =
  | 'premium-housing'
  | 'international-travel'
  | 'premium-healthcare'
  | 'luxury-experiences'
  | 'high-end-dining'
  | 'premium-vehicles'
  | 'hobby-collections'
  | 'other';

export interface FatFireScenario {
  id: string;
  name: string;
  baseExpenses: number; // annual
  wishListTotal: number; // annual
  splurgeBudget: number; // annual
  fiMultiplier: number;
}

export interface FatFireResults {
  // Total expenses
  baseDeluxeAnnual: number;
  wishListMustHave: number;
  wishListNiceToHave: number;
  splurgeBudgetAnnual: number;
  totalAnnualExpenses: number; // base + must-have + splurge
  totalMonthlyExpenses: number;

  // FI number
  fiNumber: number; // totalAnnual × multiplier

  // Timeline
  yearsToFatFIRE: number | null;
  monthsToFatFIRE: number | null;
  fatFIREAge: number | null;
  fatFIREDate: Date | null;
  milestones: Milestone[];

  // Scenarios
  scenarioResults: ScenarioResult[];

  // Life energy
  lifeEnergy: FatFireLifeEnergy | null;

  // Metadata
  calculatedAt: Date;
}

export interface Milestone {
  percentage: number; // 25, 50, 75, 100
  amount: number; // ISK
  yearsFromNow: number;
  monthsFromNow: number;
  age: number | null;
  date: Date;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioName: string;
  fiNumber: number;
  yearsToFatFIRE: number;
  monthsToFatFIRE: number;
  monthlySavingsRequired: number;
  lifestyleDescription: string;
  compareToOptimized: string; // "faster", "slower", "same"
}

export interface FatFireLifeEnergy {
  fiNumberInHours: number;
  timelineInWorkYears: number;
  timelineInHours: number;
  comparisonToLeanFIRE: {
    leanFINumber: number;
    leanHours: number;
    leanYears: number;
    additionalHours: number;
    additionalYears: number;
  };
}
```

### 4.2 Constants

```typescript
/**
 * FatFIRE Constants
 */

export const FATFIRE_DEFAULTS = {
  fiMultiplier: 30, // 3.33% withdrawal rate
  expectedReturn: 0.06, // 6% real return
  splurgeBudget: 2000000, // 2M ISK/year

  // Icelandic premium defaults (monthly)
  premiumHousing: 300000,
  premiumFood: 100000,
  premiumTransport: 70000,
  premiumTravel: 50000, // 600k annual / 12
  premiumEntertainment: 80000,
  premiumPersonal: 50000,
  premiumOther: 50000,

  // Preset splurge budgets
  splurgePresets: {
    modest: 1000000, // 1M/year
    comfortable: 2000000, // 2M/year
    generous: 3000000, // 3M/year
  },

  // Multiplier options
  multiplierOptions: [
    { value: 28, label: '28x (3,57% withdrawal)', description: 'Minimum fyrir FatFIRE' },
    { value: 30, label: '30x (3,33% withdrawal)', description: 'Mælt með' },
    { value: 33, label: '33x (3,03% withdrawal)', description: 'Mjög íhaldssamt' },
  ],

  // Return rate presets
  returnPresets: {
    conservative: 0.05, // 5%
    moderate: 0.06, // 6%
    optimistic: 0.07, // 7%
  },
};

export const WISH_LIST_CATEGORIES: { value: WishListCategory; label: string; example: string }[] = [
  { value: 'premium-housing', label: 'Premium Húsnæði', example: '101/105 íbúð, coastal property' },
  { value: 'international-travel', label: 'Alþjóðleg Ferðalög', example: '2-3 ferðir á ári' },
  { value: 'premium-healthcare', label: 'Premium Heilsugæsla', example: 'Einkaspítali, alþjóðleg umönnun' },
  { value: 'luxury-experiences', label: 'Lúxus Upplifanir', example: 'Tónleikar, viðburðir, sérferðir' },
  { value: 'high-end-dining', label: 'Veitingastaðir', example: 'Fínn matur reglulega' },
  { value: 'premium-vehicles', label: 'Premium Ökutæki', example: 'Tesla, luxury bifreið' },
  { value: 'hobby-collections', label: 'Áhugamál/Safnanir', example: 'Vín, list, tónlist' },
  { value: 'other', label: 'Annað', example: 'Annað lífsstílsatriði' },
];
```

### 4.3 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // FatFIRE
  fatFire: FatFireState | null;
  fatFireResults: FatFireResults | null;

  // FatFIRE Actions
  updateFatFire: (state: Partial<FatFireState>) => void;
  setSplurgeBudget: (budget: number) => void;
  setFIMultiplier: (multiplier: number) => void;
  addWishListItem: (item: Omit<WishListItem, 'id' | 'order'>) => void;
  updateWishListItem: (id: string, updates: Partial<WishListItem>) => void;
  deleteWishListItem: (id: string) => void;
  reorderWishList: (fromIndex: number, toIndex: number) => void;
  addFatFireScenario: (scenario: Omit<FatFireScenario, 'id'>) => void;
  deleteFatFireScenario: (id: string) => void;
  clearFatFire: () => void;

  // FatFIRE API (for other calculators)
  getFatFINumber: () => number | null;
  getYearsToFatFIRE: () => number | null;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  fatFire?: {
    baseDeluxeExpenses: number;
    wishList: StoredWishListItem[];
    splurgeBudget: number;
    fiMultiplier: number;
    currentSavings: number;
    monthlySavingsRate: number;
    expectedReturn: number;
    currentAge: number | null;
    scenarios: StoredFatFireScenario[];
    lastUpdated: string; // ISO date string
    version: number;
  };
}

interface StoredWishListItem {
  id: string;
  name: string;
  annualCost: number;
  priority: 'must-have' | 'nice-to-have';
  category: WishListCategory;
  notes?: string;
  order: number;
}

interface StoredFatFireScenario {
  id: string;
  name: string;
  baseExpenses: number;
  wishListTotal: number;
  splurgeBudget: number;
  fiMultiplier: number;
}
```

---

## 5. Calculation Logic

### 5.1 FI Number Calculator

**File**: `/src/lib/calculations/fatFire.ts`

```typescript
/**
 * Calculate total annual expenses
 */
export const calculateTotalAnnualExpenses = (
  baseDeluxeMonthly: number,
  wishListMustHave: number, // annual
  splurgeBudget: number // annual
): number => {
  const baseDeluxeAnnual = baseDeluxeMonthly * 12;
  return baseDeluxeAnnual + wishListMustHave + splurgeBudget;
};

/**
 * Calculate FI number with multiplier
 */
export const calculateFINumber = (
  totalAnnualExpenses: number,
  fiMultiplier: number
): number => {
  return totalAnnualExpenses * fiMultiplier;
};

/**
 * Calculate wish list totals by priority
 */
export const calculateWishListTotals = (
  wishList: WishListItem[]
): { mustHave: number; niceToHave: number; total: number } => {
  const mustHave = wishList
    .filter(item => item.priority === 'must-have')
    .reduce((sum, item) => sum + item.annualCost, 0);

  const niceToHave = wishList
    .filter(item => item.priority === 'nice-to-have')
    .reduce((sum, item) => sum + item.annualCost, 0);

  return {
    mustHave,
    niceToHave,
    total: mustHave + niceToHave,
  };
};
```

### 5.2 Timeline Calculator

```typescript
/**
 * Calculate years to FatFIRE
 */
export const calculateYearsToFatFIRE = (
  currentSavings: number,
  fiNumber: number,
  monthlySavingsRate: number,
  annualReturnRate: number
): number | null => {
  if (currentSavings <= 0 || fiNumber <= 0 || monthlySavingsRate < 0) {
    return null;
  }

  // Already at FatFIRE
  if (currentSavings >= fiNumber) {
    return 0;
  }

  // If no savings rate and current savings < FI, impossible
  if (monthlySavingsRate === 0) {
    // Only growth can reach FI (Coast FIRE formula)
    const yearsViaGrowth = Math.log(fiNumber / currentSavings) / Math.log(1 + annualReturnRate);
    return yearsViaGrowth > 100 ? null : yearsViaGrowth;
  }

  // Standard calculation with savings + growth
  let balance = currentSavings;
  let months = 0;

  while (balance < fiNumber && months < 1200) { // max 100 years
    const monthlyGrowth = balance * (annualReturnRate / 12);
    balance += monthlySavingsRate + monthlyGrowth;
    months++;
  }

  if (months >= 1200) return null; // unreachable

  return months / 12;
};

/**
 * Calculate milestones (25%, 50%, 75%, 100% FI)
 */
export const calculateMilestones = (
  currentSavings: number,
  fiNumber: number,
  monthlySavingsRate: number,
  annualReturnRate: number,
  currentAge: number | null
): Milestone[] => {
  const milestones: Milestone[] = [];
  const percentages = [25, 50, 75, 100];

  for (const percentage of percentages) {
    const targetAmount = (fiNumber * percentage) / 100;

    if (currentSavings >= targetAmount) {
      // Already reached
      milestones.push({
        percentage,
        amount: targetAmount,
        yearsFromNow: 0,
        monthsFromNow: 0,
        age: currentAge,
        date: new Date(),
      });
      continue;
    }

    const yearsToMilestone = calculateYearsToFatFIRE(
      currentSavings,
      targetAmount,
      monthlySavingsRate,
      annualReturnRate
    );

    if (yearsToMilestone === null) {
      continue;
    }

    const yearsFloor = Math.floor(yearsToMilestone);
    const monthsRemainder = Math.round((yearsToMilestone - yearsFloor) * 12);
    const milestoneDate = new Date();
    milestoneDate.setFullYear(milestoneDate.getFullYear() + yearsFloor);
    milestoneDate.setMonth(milestoneDate.getMonth() + monthsRemainder);

    milestones.push({
      percentage,
      amount: targetAmount,
      yearsFromNow: yearsFloor,
      monthsFromNow: monthsRemainder,
      age: currentAge ? currentAge + yearsFloor : null,
      date: milestoneDate,
    });
  }

  return milestones;
};
```

### 5.3 Scenario Calculator

```typescript
/**
 * Calculate results for a scenario
 */
export const calculateScenarioResult = (
  scenario: FatFireScenario,
  currentSavings: number,
  monthlySavingsRate: number,
  expectedReturn: number
): ScenarioResult => {
  const totalAnnual = scenario.baseExpenses + scenario.wishListTotal + scenario.splurgeBudget;
  const fiNumber = totalAnnual * scenario.fiMultiplier;

  const yearsToFatFIRE = calculateYearsToFatFIRE(
    currentSavings,
    fiNumber,
    monthlySavingsRate,
    expectedReturn
  );

  const yearsFloor = yearsToFatFIRE !== null ? Math.floor(yearsToFatFIRE) : 0;
  const monthsRemainder = yearsToFatFIRE !== null
    ? Math.round((yearsToFatFIRE - yearsFloor) * 12)
    : 0;

  // Calculate required monthly savings to reach FI in target time (if user wants to adjust)
  const monthlySavingsRequired = calculateRequiredMonthlySavings(
    currentSavings,
    fiNumber,
    20, // assume 20 year target
    expectedReturn
  );

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    fiNumber,
    yearsToFatFIRE: yearsFloor,
    monthsToFatFIRE: monthsRemainder,
    monthlySavingsRequired,
    lifestyleDescription: generateLifestyleDescription(scenario),
    compareToOptimized: 'same', // calculated separately
  };
};

/**
 * Calculate required monthly savings for target timeline
 */
export const calculateRequiredMonthlySavings = (
  currentSavings: number,
  fiNumber: number,
  targetYears: number,
  annualReturnRate: number
): number => {
  const gap = fiNumber - currentSavings;
  if (gap <= 0) return 0;

  const months = targetYears * 12;
  const monthlyRate = annualReturnRate / 12;

  // Future value of annuity formula solving for PMT
  // FV = PMT × [(1 + r)^n - 1] / r
  // Also account for growth of current savings: FV_current = PV × (1 + r)^n
  const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, months);
  const additionalNeeded = fiNumber - futureValueOfCurrentSavings;

  if (additionalNeeded <= 0) return 0;

  const pmt = additionalNeeded / (
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  );

  return pmt;
};

/**
 * Generate lifestyle description for scenario
 */
const generateLifestyleDescription = (scenario: FatFireScenario): string => {
  const monthlyExpenses = (scenario.baseExpenses + scenario.wishListTotal + scenario.splurgeBudget) / 12;

  if (monthlyExpenses >= 1200000) {
    return 'Mjög lúxuslífsstíll';
  } else if (monthlyExpenses >= 1000000) {
    return 'Lúxuslífsstíll';
  } else if (monthlyExpenses >= 800000) {
    return 'Þægilegur premium lífsstíll';
  } else {
    return 'Premium lífsstíll';
  }
};
```

### 5.4 Life Energy Calculator

```typescript
/**
 * Calculate life energy for FatFIRE
 */
export const calculateFatFireLifeEnergy = (
  fiNumber: number,
  yearsToFatFIRE: number,
  actualHourlyWage: number | null,
  leanFINumber: number // for comparison
): FatFireLifeEnergy | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  const fiNumberInHours = fiNumber / actualHourlyWage;
  const timelineInWorkYears = yearsToFatFIRE;
  const timelineInHours = yearsToFatFIRE * 2080; // 2080 work hours/year

  // Comparison to LeanFIRE
  const leanHours = leanFINumber / actualHourlyWage;
  const leanYears = leanHours / 2080;
  const additionalHours = fiNumberInHours - leanHours;
  const additionalYears = additionalHours / 2080;

  return {
    fiNumberInHours,
    timelineInWorkYears,
    timelineInHours,
    comparisonToLeanFIRE: {
      leanFINumber,
      leanHours,
      leanYears,
      additionalHours,
      additionalYears,
    },
  };
};
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate all FatFIRE results
 */
export const calculateFatFireResults = (
  state: FatFireState,
  actualHourlyWage: number | null,
  leanFINumber: number // for life energy comparison
): FatFireResults => {
  const wishListTotals = calculateWishListTotals(state.wishList);
  const baseDeluxeAnnual = state.baseDeluxeExpenses * 12;
  const totalAnnualExpenses = calculateTotalAnnualExpenses(
    state.baseDeluxeExpenses,
    wishListTotals.mustHave,
    state.splurgeBudget
  );
  const fiNumber = calculateFINumber(totalAnnualExpenses, state.fiMultiplier);

  const yearsToFatFIRE = calculateYearsToFatFIRE(
    state.currentSavings,
    fiNumber,
    state.monthlySavingsRate,
    state.expectedReturn
  );

  const yearsFloor = yearsToFatFIRE !== null ? Math.floor(yearsToFatFIRE) : null;
  const monthsRemainder = yearsToFatFIRE !== null
    ? Math.round((yearsToFatFIRE - yearsFloor!) * 12)
    : null;

  const fatFIREAge = state.currentAge && yearsFloor !== null
    ? state.currentAge + yearsFloor
    : null;

  const fatFIREDate = yearsToFatFIRE !== null ? (() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearsFloor!);
    date.setMonth(date.getMonth() + monthsRemainder!);
    return date;
  })() : null;

  const milestones = calculateMilestones(
    state.currentSavings,
    fiNumber,
    state.monthlySavingsRate,
    state.expectedReturn,
    state.currentAge
  );

  const scenarioResults = state.scenarios.map(scenario =>
    calculateScenarioResult(
      scenario,
      state.currentSavings,
      state.monthlySavingsRate,
      state.expectedReturn
    )
  );

  const lifeEnergy = yearsToFatFIRE !== null
    ? calculateFatFireLifeEnergy(fiNumber, yearsToFatFIRE, actualHourlyWage, leanFINumber)
    : null;

  return {
    baseDeluxeAnnual,
    wishListMustHave: wishListTotals.mustHave,
    wishListNiceToHave: wishListTotals.niceToHave,
    splurgeBudgetAnnual: state.splurgeBudget,
    totalAnnualExpenses,
    totalMonthlyExpenses: totalAnnualExpenses / 12,
    fiNumber,
    yearsToFatFIRE: yearsFloor,
    monthsToFatFIRE: monthsRemainder,
    fatFIREAge,
    fatFIREDate,
    milestones,
    scenarioResults,
    lifeEnergy,
    calculatedAt: new Date(),
  };
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool (Deluxe Tier)

**Data Access Pattern:**
```typescript
const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();

// Check if Deluxe tier exists
if (!hasExpenseBaseline()) {
  return (
    <Alert variant="info">
      <p>FatFIRE áætlun þarf útgjaldagrunn með lúxusþrepi</p>
      <Button as="a" href="/utgjaldareiknivel">
        Setja upp útgjaldagrunn
      </Button>
    </Alert>
  );
}

// Get Deluxe tier expenses
const deluxeMonthly = getExpenseByTier('deluxe');
const deluxeCategories = expenseBaseline?.tiers.deluxe.categories;

// Update FatFIRE state with Deluxe expenses
useEffect(() => {
  if (deluxeMonthly) {
    updateFatFire({ baseDeluxeExpenses: deluxeMonthly });
  }
}, [deluxeMonthly]);
```

**Auto-Sync on Baseline Changes:**
```typescript
useEffect(() => {
  // When expense baseline Deluxe tier changes, update FatFIRE base expenses
  const deluxeMonthly = getExpenseByTier('deluxe');
  if (deluxeMonthly && fatFire?.baseDeluxeExpenses !== deluxeMonthly) {
    updateFatFire({ baseDeluxeExpenses: deluxeMonthly });
    showToast({
      type: 'info',
      message: 'Lúxusútgjöld uppfærð frá útgjaldagrunni',
    });
  }
}, [expenseBaseline?.tiers.deluxe]);
```

### 6.2 Integration with Actual Hourly Wage

**Data Access Pattern:**
```typescript
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// Pass to life energy calculations
const lifeEnergy = calculateFatFireLifeEnergy(
  fiNumber,
  yearsToFatFIRE,
  actualHourlyWage,
  leanFINumber
);

// Show life energy section only if AWH available
{actualHourlyWage && lifeEnergy ? (
  <LifeEnergySection lifeEnergy={lifeEnergy} />
) : (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorku túlkun</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

### 6.3 Integration with FI Number Builder

**Data Sharing Pattern:**
```typescript
// FatFIRE exports its FI number for use by other calculators
interface CalculatorContextType {
  // ... existing
  getFatFINumber: () => number | null;
}

// Implementation
const getFatFINumber = useCallback(() => {
  if (!fatFireResults) return null;
  return fatFireResults.fiNumber;
}, [fatFireResults]);
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateFatFireInputs = (state: FatFireState): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Base expenses validation
  if (state.baseDeluxeExpenses <= 0) {
    errors.push('Lúxusútgjöld verða að vera stærri en 0');
  }

  if (state.baseDeluxeExpenses < 700000) {
    warnings.push('Lúxusútgjöld undir 700.000 kr/mán eru venjulega ekki FatFIRE');
  }

  // Splurge budget validation
  if (state.splurgeBudget < 0) {
    errors.push('Aukaútgjaldaáætlun getur ekki verið neikvæð');
  }

  const annualBase = state.baseDeluxeExpenses * 12;
  if (state.splurgeBudget > annualBase * 0.5) {
    warnings.push('Aukaútgjaldaáætlun er mjög há (>50% af grunnútgjöldum)');
  }

  // FI multiplier validation
  if (state.fiMultiplier < 25 || state.fiMultiplier > 40) {
    errors.push('FI margfaldari verður að vera á milli 25 og 40');
  }

  if (state.fiMultiplier < 28) {
    warnings.push('FatFIRE notar venjulega 30x+ margfaldara fyrir þægindi');
  }

  // Savings validation
  if (state.currentSavings < 0) {
    errors.push('Sparnaður getur ekki verið neikvæður');
  }

  if (state.monthlySavingsRate < 0) {
    errors.push('Sparnaður á mánuði getur ekki verið neikvæður');
  }

  // Expected return validation
  if (state.expectedReturn < 0 || state.expectedReturn > 0.15) {
    errors.push('Vænt ávöxtun verður að vera á milli 0% og 15%');
  }

  if (state.expectedReturn < 0.04 || state.expectedReturn > 0.09) {
    warnings.push('Vænt ávöxtun utan venjulegs bils (4-9%)');
  }

  // Current age validation
  if (state.currentAge !== null && (state.currentAge < 18 || state.currentAge > 100)) {
    errors.push('Aldur verður að vera á milli 18 og 100 ára');
  }

  // Wish list validation
  state.wishList.forEach(item => {
    if (item.annualCost < 0) {
      errors.push(`Óskir "${item.name}" hefur neikvæðan kostnað`);
    }
    if (item.annualCost > 50000000) {
      warnings.push(`Óskir "${item.name}" hefur mjög háan kostnað (>50M kr/ár)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};
```

### 7.2 Missing Dependencies Handling

```typescript
// No Deluxe tier in expense baseline
if (!hasExpenseBaseline() || !getExpenseByTier('deluxe')) {
  return (
    <Alert variant="warning">
      <h3>Lúxusþrep vantar</h3>
      <p>
        FatFIRE áætlun krefst lúxusþreps í útgjaldagrunni. Þú getur:
      </p>
      <ul>
        <li>Farið í útgjaldagrunninn og bætt við lúxusþrepi</li>
        <li>Eða slegið inn lúxusútgjöld handvirkt hér</li>
      </ul>
      <Button as="a" href="/utgjaldareiknivel">
        Opna Útgjaldagrunn
      </Button>
    </Alert>
  );
}

// Optional: No AWH (not blocking)
{!actualHourlyWage && (
  <Alert variant="info">
    <p>
      Reiknaðu raunverulegt tímakaup þitt til að sjá FatFIRE í lífsorku
      (vinnustundum). Þetta er valfrjálst en gefur áhugaverða sýn.
    </p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

### 7.3 Timeline Calculation Edge Cases

```typescript
// Already at or past FatFIRE
if (currentSavings >= fiNumber) {
  return {
    ...results,
    yearsToFatFIRE: 0,
    monthsToFatFIRE: 0,
    fatFIREAge: currentAge,
    fatFIREDate: new Date(),
    message: 'Til hamingju! Þú hefur þegar náð FatFIRE!',
  };
}

// Very long timeline (>40 years)
if (yearsToFatFIRE && yearsToFatFIRE > 40) {
  return {
    ...results,
    warning: 'Mjög langur tími til FatFIRE (>40 ár). Íhugaðu að:',
    suggestions: [
      'Auka mánaðarlegan sparnað',
      'Minnka útgjaldaþrep (Þægilt í stað Lúxus)',
      'Skoða Coast FIRE eða Barista FIRE sem valkosti',
      'Fresta FatFIRE og miða við Coast FIRE í bili',
    ],
  };
}

// Insufficient savings rate (negative or zero progress)
if (monthlySavingsRate === 0 && currentSavings < fiNumber) {
  return {
    ...results,
    warning: 'Með 0 kr sparnaði á mánuði muntu aldrei ná FatFIRE',
    suggestion: 'Þú þarft að auka sparnað eða skoða Coast FIRE',
  };
}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Lúxus FIRE Áætlun                          [Premium Theme]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  [EducationalIntro - Collapsible]                              │
│                                                                │
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │ ExpenseInputSection     │  │ FINumberSection            │ │
│  │                         │  │                            │ │
│  │ • Deluxe tier display   │  │ • Multiplier selector      │ │
│  │ • Wish list builder     │  │ • Expense breakdown        │ │
│  │ • Splurge budget        │  │ • FI number display        │ │
│  └─────────────────────────┘  └────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ TimelineSection                                          │ │
│  │ • Savings inputs                                         │ │
│  │ • Timeline results                                       │ │
│  │ • Timeline chart                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ScenarioComparisonSection                                │ │
│  │ • Scenario list                                          │ │
│  │ • Comparison table                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ LifeEnergySection (if AWH available)                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ KeyInsights                                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Mobile Layout:**
- Stack all sections vertically
- Educational intro collapsed by default
- Wish list items in cards (one per row)
- Scenario comparison horizontal scroll or tabs
- Timeline chart scales to width

### 8.2 Premium Visual Theme

```typescript
const FATFIRE_COLORS = {
  primary: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-900',
    accent: 'bg-gradient-to-r from-amber-500 to-yellow-500',
  },
  secondary: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-900',
    accent: 'bg-yellow-500',
  },
  premium: {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
    border: 'border-amber-400',
    text: 'text-amber-950',
    accent: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    accent: 'bg-green-500',
  },
};

// Typography
const PREMIUM_TYPOGRAPHY = {
  heading: 'font-serif text-4xl font-bold text-amber-900',
  subheading: 'font-serif text-2xl font-semibold text-amber-800',
  body: 'font-sans text-base text-gray-800',
  label: 'font-sans text-sm font-medium text-gray-700',
  accent: 'font-serif italic text-amber-700',
};
```

### 8.3 Responsive Breakpoints

**Mobile (<640px):**
- Single column layout
- Wish list items full width
- Scenarios in tabs
- Timeline chart 300px height
- Collapsibles closed by default

**Tablet (640px-1024px):**
- Two-column for some sections
- Full-width timeline chart (400px)
- Scenario comparison full width

**Desktop (>1024px):**
- Full layout as shown
- Wish list builder with drag-and-drop
- Wide timeline chart (500px)
- Side-by-side expense and FI sections

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `fatFire.test.ts` - Calculation logic
- `FatFireCalculator.test.tsx` - Main component
- `WishListBuilder.test.tsx` - Wish list management
- `TimelineChart.test.tsx` - Chart component

**Test Coverage:**
```typescript
describe('calculateFINumber', () => {
  it('calculates FI number with 30x multiplier', () => {
    expect(calculateFINumber(16100000, 30)).toBe(483000000);
  });

  it('includes wish list must-have in total expenses', () => {
    const wishListTotals = calculateWishListTotals([
      { id: '1', priority: 'must-have', annualCost: 2100000, /* ... */ },
      { id: '2', priority: 'nice-to-have', annualCost: 500000, /* ... */ },
    ]);
    expect(wishListTotals.mustHave).toBe(2100000);
    expect(wishListTotals.niceToHave).toBe(500000);
  });
});

describe('calculateYearsToFatFIRE', () => {
  it('calculates years with savings and growth', () => {
    const years = calculateYearsToFatFIRE(
      50000000, // current savings
      483000000, // FI number
      500000, // monthly savings
      0.06 // 6% return
    );
    expect(years).toBeGreaterThan(15);
    expect(years).toBeLessThan(25);
  });

  it('returns 0 when already at FatFIRE', () => {
    expect(calculateYearsToFatFIRE(500000000, 483000000, 500000, 0.06)).toBe(0);
  });

  it('returns null for unrealistic timelines', () => {
    expect(calculateYearsToFatFIRE(1000000, 483000000, 10000, 0.02)).toBeNull();
  });
});

describe('calculateMilestones', () => {
  it('generates milestones at 25%, 50%, 75%, 100%', () => {
    const milestones = calculateMilestones(
      50000000,
      483000000,
      500000,
      0.06,
      40
    );
    expect(milestones).toHaveLength(4);
    expect(milestones[0].percentage).toBe(25);
    expect(milestones[0].amount).toBe(120750000); // 25% of 483M
  });
});
```

### 9.2 Integration Testing

```typescript
describe('FatFIRE Integration', () => {
  it('integrates with expense baseline Deluxe tier', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up expense baseline with Deluxe tier
    act(() => {
      result.current.updateExpenseBaseline({
        tiers: {
          deluxe: {
            monthlyTotal: 1000000,
            categories: mockDeluxeCategories,
          },
        },
      });
    });

    // Initialize FatFIRE
    act(() => {
      result.current.updateFatFire({
        baseDeluxeExpenses: 1000000,
        splurgeBudget: 2000000,
        fiMultiplier: 30,
      });
    });

    const results = result.current.fatFireResults;
    expect(results?.baseDeluxeAnnual).toBe(12000000); // 1M * 12
    expect(results?.fiNumber).toBe(420000000); // (12M + 2M) * 30
  });

  it('integrates with AWH for life energy', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set AWH
    act(() => {
      result.current.updateInputs({ actualHourlyWage: 2500 });
    });

    // Set FatFIRE
    act(() => {
      result.current.updateFatFire({
        baseDeluxeExpenses: 1000000,
        currentSavings: 50000000,
        monthlySavingsRate: 500000,
      });
    });

    const results = result.current.fatFireResults;
    expect(results?.lifeEnergy).not.toBeNull();
    expect(results?.lifeEnergy?.fiNumberInHours).toBeGreaterThan(0);
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on all inputs', () => {
    const { getByLabelText } = render(<FatFireCalculator />);

    expect(getByLabelText(/sparnaður/i)).toBeInTheDocument();
    expect(getByLabelText(/aukaútgjaldaáætlun/i)).toBeInTheDocument();
    expect(getByLabelText(/margfaldari/i)).toBeInTheDocument();
  });

  it('wish list items have proper structure', () => {
    const { getAllByRole } = render(<WishListBuilder wishList={mockWishList} />);

    const items = getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);

    items.forEach(item => {
      expect(item).toHaveAccessibleName();
    });
  });

  it('timeline chart has text alternative', () => {
    const { getByRole } = render(<TimelineChart {...mockProps} />);

    const chart = getByRole('img', { name: /tímalína/i });
    expect(chart).toHaveAccessibleDescription();
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive FatFIRE calculations
const fatFireResults = useMemo(() => {
  if (!fatFire || !fatFire.baseDeluxeExpenses) return null;
  return calculateFatFireResults(fatFire, actualHourlyWage, leanFINumber);
}, [fatFire, actualHourlyWage, leanFINumber]);

// Debounce wish list updates
const debouncedUpdateWishList = useMemo(
  () => debounce((id: string, updates: Partial<WishListItem>) => {
    updateWishListItem(id, updates);
  }, 300),
  [updateWishListItem]
);
```

### 10.2 Performance Budget

- FI number calculation: <50ms
- Timeline calculation: <100ms
- Scenario comparison (3 scenarios): <200ms
- Chart rendering: <300ms
- Page load: <2 seconds

---

## 11. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Define Luxurious Lifestyle | DeluxeTierDisplay, WishListBuilder, SplurgeBudgetInput | Deluxe tier + wish list + splurge |
| **US-2**: Calculate FI with Margin | FINumberSection, MultiplierSelector | 30x default multiplier |
| **US-3**: Plan Splurge Budget | SplurgeBudgetInput | Annual budget with examples |
| **US-4**: Create Wish List | WishListBuilder | Repeatable items with priority |
| **US-5**: Calculate Timeline | TimelineSection, TimelineChart | Years to FatFIRE with milestones |
| **US-6**: Compare Scenarios | ScenarioComparisonSection | Multiple scenario support |
| **US-7**: Premium Icelandic Costs | DeluxeTierDisplay, IcelandicPremiumContext | 300k housing, 600k/yr travel |
| **US-8**: Visualize Life Energy | LifeEnergySection | AWH conversion |
| **US-9**: Lifestyle Preservation | WishListBuilder (must-have priority) | Lock must-have items |
| **US-10**: Educational Content | EducationalIntro | What is FatFIRE explainer |
| **FR-1**: FI Calculation | calculateFINumber() | (Base + Wish + Splurge) × Multiplier |
| **FR-2**: Deluxe Integration | Expense baseline integration | Auto-load Deluxe tier |
| **FR-3**: Wish List Builder | WishListBuilder component | CRUD + reorder |
| **FR-4**: Splurge Budget | SplurgeBudgetInput | Annual with breakdown |
| **FR-5**: Timeline Projections | calculateYearsToFatFIRE() | Milestones + age + date |
| **FR-6**: Scenario Comparison | ScenarioComparisonSection | Side-by-side table |
| **FR-7**: Life Energy | calculateFatFireLifeEnergy() | Hours + years + comparison |
| **FR-8**: Visualization | TimelineChart | Growth curve with milestones |
| **FR-9**: Educational Content | EducationalIntro, tooltips | Explainers and guidance |
| **FR-10**: Data Persistence | CalculatorContext, localStorage | Auto-save with debounce |

---

## 12. Implementation Risks and Mitigations

### Risk 1: Complex Wish List Management

**Risk**: Drag-and-drop, CRUD operations, priority toggles could be error-prone.

**Mitigation**:
- Use established drag-and-drop library (react-dnd or similar)
- Comprehensive state validation
- Unit tests for all CRUD operations
- Fallback: manual ordering (up/down buttons) if drag-and-drop fails

### Risk 2: Deluxe Tier Dependency

**Risk**: User may not have Deluxe tier set up, blocking FatFIRE planner.

**Mitigation**:
- Detect missing Deluxe tier early
- Prominent prompt to create Deluxe tier
- Fallback: Manual expense input option
- Link to expense baseline with Deluxe tier guidance

### Risk 3: Timeline Calculation Complexity

**Risk**: With wish list, splurge, and scenarios, calculations could be slow.

**Mitigation**:
- Memoize all calculations
- Debounce input changes (300-500ms)
- Limit scenarios to 5 maximum
- Performance budget: <200ms for all calculations

### Risk 4: Premium Visual Theme Consistency

**Risk**: Gold/amber theme might clash with existing design system.

**Mitigation**:
- Use consistent color palette across components
- Test contrast ratios for accessibility (WCAG AA)
- Premium feel with subtle accents, not overwhelming
- User testing to ensure theme feels aspirational, not gaudy

---

## 13. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Integration points documented

### Feasibility
- [x] Uses existing technology stack
- [x] Integrates with existing CalculatorContext
- [x] Leverages Expense Baseline Deluxe tier
- [x] Follows established patterns from Coast/Barista FIRE
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Icelandic premium context (Reykjavík, travel)
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized
- [x] Premium visual design defined

### Integration
- [x] Consumes Expense Baseline Deluxe tier
- [x] Integrates AWH for life energy
- [x] Exports FI number for other calculators
- [x] Clear integration patterns documented
- [x] Auto-sync on baseline changes

---

**Design Phase Complete: Ready for Tasks Breakdown**
