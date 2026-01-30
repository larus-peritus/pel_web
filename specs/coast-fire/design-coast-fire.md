# Design: Coast FIRE Calculator

## Document Information

- **Feature Name**: Coast FIRE Calculator (Ró FIRE Reiknivél)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-coast-fire.md

---

## 1. System Overview

### 1.1 Purpose

The Coast FIRE Calculator helps users determine when their current investments will grow to meet their Financial Independence number without additional contributions. It provides scenario analysis, visual projections, and integration with the Expense Baseline Tool to enable informed decisions about work-life balance and career flexibility.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- Recharts for data visualization
- No backend/server requirements

### 1.3 Key Design Principles

1. **Clear Milestone Communication**: Make Coast FIRE date and status immediately obvious
2. **Scenario Exploration**: Enable easy comparison of different assumptions
3. **Integration-First**: Seamlessly use Expense Baseline and AWH data
4. **Visual Understanding**: Chart shows growth trajectory and milestones
5. **Conservative Planning**: Emphasize multiple scenarios and uncertainty
6. **Educational**: Help users understand compound growth and Coast FIRE concept
7. **Icelandic-First**: Local context, currency, and retirement age defaults

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Input Section    │  │ Results Display  │  │ Scenario Comparison  │  │
│  │ (Form)           │  │ (Status+Chart)   │  │ (Side-by-side)       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  coastFire: CoastFIREState                                      │   │
│  │    - currentAge: number                                         │   │
│  │    - currentInvestments: number                                 │   │
│  │    - fiNumber: number | null                                    │   │
│  │    - fiNumberSource: 'manual' | 'baseline'                      │   │
│  │    - selectedTier: ExpenseTier | null                           │   │
│  │    - fiMultiplier: number (25, 30, custom)                      │   │
│  │    - expectedReturn: number (%)                                 │   │
│  │    - targetRetirementAge: number                                │   │
│  │  coastFireResults: CoastFIREResults | null                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration:                                                   │   │
│  │    - useExpenseBaseline() - fetch FI number from tiers          │   │
│  │    - useActualHourlyWage() - life energy calculations           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Coast FIRE Date   │  │ Growth Projection │  │ Life Energy       │  │
│  │ Calculator        │  │ Generator         │  │ Converter         │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Export/Import     │  │ Expense Baseline  │  │
│  │ Manager           │  │ Functions         │  │ Integration       │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
CoastFIRECalculator (Page Component)
├── EducationalIntro (Collapsible)
│   ├── CoastFIREExplainer
│   └── ReturnRateGuidance
│
├── InputSection
│   ├── FINumberInput
│   │   ├── ManualInput (CurrencyInput)
│   │   └── BaselineSelector (if baseline exists)
│   │       ├── TierSelector (reuse from Expense Baseline)
│   │       └── MultiplierSelector (25x | 30x | custom)
│   ├── CurrentInvestmentsInput (CurrencyInput)
│   ├── AgeInputGroup
│   │   ├── CurrentAgeInput
│   │   └── TargetRetirementAgeInput
│   └── ExpectedReturnSlider (with scenarios)
│
├── ResultsSection
│   ├── CoastFIREStatusCard
│   │   ├── StatusIndicator (Already Coasting | Coast at Age X | Impossible)
│   │   ├── CoastFIREDate (age + calendar date)
│   │   ├── GapToCoast (if not yet coasting)
│   │   └── ProjectedBalance (at target retirement age)
│   │
│   ├── GrowthProjectionChart
│   │   ├── LineChart (Recharts)
│   │   ├── CurrentBalanceLine
│   │   ├── ProjectedGrowthLine
│   │   ├── FINumberTargetLine
│   │   ├── CoastFIREMilestone (marker)
│   │   └── HoverTooltip (balance at age)
│   │
│   ├── ScenarioComparisonTable
│   │   ├── ConservativeScenario (5%)
│   │   ├── ModerateScenario (7%)
│   │   ├── OptimisticScenario (9%)
│   │   └── ComparisonColumns (Coast Age, Gap, Projected Balance)
│   │
│   └── LifeEnergyDisplay (if AWH available)
│       ├── InvestmentsInHours (current balance)
│       ├── GapInHours (to Coast FIRE)
│       ├── PassiveHoursEarned (from compound growth)
│       └── WorkHoursSaved (vs continuing to save)
│
├── ActionSuggestionsPanel (if cannot coast)
│   ├── IncreaseReturnSuggestion
│   ├── DelayRetirementSuggestion
│   ├── ReduceFINumberSuggestion
│   └── ContinueSavingSuggestion
│
└── KeyInsights (Plain language summary)
    ├── MainTakeaway
    ├── TimelineExplanation
    └── NextStepsRecommendation
```

### 2.3 Data Flow

**Initial Load Flow:**
```
Page Load → Load from localStorage → Check for Expense Baseline
                                              ↓
                                    ┌─────────┴──────────┐
                                    ↓                    ↓
                            Baseline Exists        No Baseline
                                    ↓                    ↓
                        Show Tier Selector    Show Manual Input
                                    ↓                    ↓
                        Calculate FI Number   User Enters FI Number
                                    ↓                    ↓
                                    └────────┬───────────┘
                                             ↓
                                  Fetch Current Investments
                                             ↓
                                  Run Coast FIRE Calculation
                                             ↓
                                  Display Results + Chart
```

**User Interaction Flow:**
```
User Adjusts Input → Validate Input → Update State → Recalculate Results
                                                            ↓
                                                   Update Chart Data
                                                            ↓
                                                   Update Results Display
                                                            ↓
                                              Debounced Save to localStorage
```

**Scenario Comparison Flow:**
```
User Changes Return Rate → Calculate for 3 Scenarios (Conservative/Moderate/Optimistic)
                                             ↓
                                  Generate Comparison Table
                                             ↓
                                  Update Chart with Multiple Lines
                                             ↓
                                  Highlight Selected Scenario
```

---

## 3. Component Design

### 3.1 CoastFIRECalculator (Main Component)

**Responsibility**: Page-level container and state coordinator

**Interface:**
```typescript
interface CoastFIRECalculatorProps {
  // No props - gets data from CalculatorContext
}

interface CoastFIRECalculatorState {
  showEducation: boolean; // Collapsible intro
  selectedScenario: 'conservative' | 'moderate' | 'optimistic';
}
```

**Key Features:**
- Loads saved state from context
- Coordinates calculations across all inputs
- Manages localStorage persistence
- Handles expense baseline integration

---

### 3.2 FINumberInput Component

**Responsibility**: Handle FI number entry (manual or from baseline)

**Interface:**
```typescript
interface FINumberInputProps {
  fiNumber: number | null;
  fiNumberSource: 'manual' | 'baseline';
  selectedTier: ExpenseTier | null;
  fiMultiplier: number;
  onFINumberChange: (value: number, source: 'manual' | 'baseline') => void;
  onTierChange: (tier: ExpenseTier) => void;
  onMultiplierChange: (multiplier: number) => void;
}

interface FINumberInputState {
  useBaseline: boolean; // Toggle between manual and baseline
}
```

**Features:**
- Toggle between manual input and baseline selector
- If baseline exists, show "Use my expense baseline" button
- Display tier selector with three options (Barebones, Comfortable, Deluxe)
- Show calculated FI number: `annual expenses × multiplier`
- Multiplier selector with presets (25x, 30x) and custom input
- Educational tooltip explaining multipliers

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  FI Tala (Financial Independence Number)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Nota útgjaldagrunn]  OR  [Slá inn handvirkt]         │
│                                                         │
│  (If using baseline)                                    │
│  Veldu útgjaldaþrep:                                    │
│    ○ Lágmarks (250.000 kr/mán)    → 75.000.000 kr     │
│    ● Þægilegt (520.000 kr/mán)    → 156.000.000 kr    │
│    ○ Lúxus (1.000.000 kr/mán)     → 300.000.000 kr    │
│                                                         │
│  Margfaldari:                                           │
│    ○ 25x (4% withdrawal)                                │
│    ● 30x (3.33% withdrawal)                             │
│    ○ Sérsniðið: [__] x                                 │
│                                                         │
│  (If manual)                                            │
│  FI Tala:                                               │
│  ┌─────────────────────────────────────┐               │
│  │ 156.000.000                      kr │               │
│  └─────────────────────────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 CoastFIREStatusCard Component

**Responsibility**: Display Coast FIRE status and key results

**Interface:**
```typescript
interface CoastFIREStatusCardProps {
  status: 'coasting' | 'future' | 'impossible';
  coastFireAge: number | null; // Age when coasting begins
  coastFireDate: Date | null; // Calendar date
  yearsToCoast: number | null;
  gapToCoast: number | null; // ISK needed to reach Coast FIRE
  projectedBalance: number; // Balance at target retirement age
  currentAge: number;
  targetAge: number;
}
```

**Status Display Logic:**

```typescript
function determineStatus(results: CoastFIREResults): CoastFIREStatus {
  if (results.coastFireAge <= results.currentAge) {
    return {
      type: 'coasting',
      message: 'Þú ert nú þegar í Ró FIRE!',
      icon: '🎉',
      color: 'green'
    };
  }

  if (results.coastFireAge > results.targetRetirementAge) {
    return {
      type: 'impossible',
      message: 'Ró FIRE ekki mögulegt með þessum forsendum',
      icon: '⚠️',
      color: 'amber'
    };
  }

  return {
    type: 'future',
    message: `Þú getur farið í Ró við ${results.coastFireAge} ára aldur`,
    icon: '🎯',
    color: 'blue'
  };
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────┐
│  🎯 RÓ FIRE STAÐA                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ╔══════════════════════════════════════════════╗  │
│  ║  Þú getur farið í Ró við 45 ára aldur        ║  │
│  ║  (2041-07-15)                                ║  │
│  ╚══════════════════════════════════════════════╝  │
│                                                      │
│  📊 Núverandi staða                                  │
│  • Fjárfestingar:        25.000.000 kr              │
│  • FI Tala:              156.000.000 kr             │
│  • Bil að Ró FIRE:       15.342.000 kr              │
│  • Ár þangað til Ró:     10 ár, 5 mánuðir          │
│                                                      │
│  🚀 Spá við eftirlaunaaldur (67 ára)                │
│  • Áætluð staða:         412.000.000 kr             │
│  • Umfram FI Tala:       256.000.000 kr             │
│                                                      │
│  💡 Þetta þýðir:                                     │
│  Ef þú hættir að leggja til við 45 ára aldur,      │
│  munu fjárfestingar þínar vaxa til að ná FI Tölunni│
│  við 67 ára aldur með 7% ávöxtun.                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.4 GrowthProjectionChart Component

**Responsibility**: Visualize investment growth trajectory

**Interface:**
```typescript
interface GrowthProjectionChartProps {
  currentAge: number;
  currentBalance: number;
  fiNumber: number;
  coastFireAge: number | null;
  targetRetirementAge: number;
  expectedReturn: number;
  scenarioData: ScenarioProjection[]; // For multiple lines
}

interface ScenarioProjection {
  scenario: 'conservative' | 'moderate' | 'optimistic';
  returnRate: number;
  dataPoints: ChartDataPoint[];
}

interface ChartDataPoint {
  age: number;
  balance: number;
  year: number;
}
```

**Chart Configuration:**
```typescript
const chartConfig = {
  width: '100%',
  height: 400,
  margin: { top: 20, right: 30, bottom: 40, left: 80 },

  lines: {
    projectedGrowth: {
      color: '#10b981', // Green
      strokeWidth: 3,
      label: 'Áætluð staða'
    },
    fiNumberTarget: {
      color: '#3b82f6', // Blue
      strokeWidth: 2,
      strokeDasharray: '5 5',
      label: 'FI Tala'
    }
  },

  markers: {
    currentAge: {
      color: '#6b7280', // Gray
      label: 'Nú'
    },
    coastFire: {
      color: '#f59e0b', // Amber
      label: 'Ró FIRE'
    },
    targetRetirement: {
      color: '#8b5cf6', // Purple
      label: 'Markmið eftirlaunaaldur'
    }
  },

  areas: {
    coastingPeriod: {
      fill: '#fef3c7', // Light amber
      opacity: 0.3,
      label: 'Rótímabil'
    }
  }
};
```

**Visual Layout:**
```
Balance (kr)
    │
400M│                                         ___----****
    │                                   __---*
350M│                             __---*
    │                       __---*
300M│                 __---*
    │           __---*
250M├─ ─ ─ ─ ─*─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ← FI Tala (156M)
    │       *
200M│    *              [Rótímabil]
    │  *
150M│ *
    │*│
100M│ │
    ├─┼────────┬───────┬───────┬───────┬─→ Age
    30 35     45      55      65      70
       │       │                       │
       Nú   Ró FIRE            Markmið eftirlaunaaldur
```

**Interactive Features:**
- Hover to show exact balance at any age
- Click to toggle scenario lines (conservative/moderate/optimistic)
- Pinch-to-zoom on mobile
- Highlight coasting period with shaded area

---

### 3.5 ScenarioComparisonTable Component

**Responsibility**: Show side-by-side scenario comparisons

**Interface:**
```typescript
interface ScenarioComparisonTableProps {
  currentAge: number;
  currentBalance: number;
  fiNumber: number;
  targetRetirementAge: number;
  scenarios: CoastFIREScenario[];
}

interface CoastFIREScenario {
  name: string; // 'Íhaldssöm' | 'Miðlungs' | 'Bjartsýn'
  returnRate: number;
  coastFireAge: number | null;
  yearsToCoast: number | null;
  gapToCoast: number | null;
  projectedBalance: number;
  status: 'coasting' | 'future' | 'impossible';
}
```

**Visual Layout:**
```
┌───────────────────────────────────────────────────────────────────────┐
│  SVIÐSMYNDIR - Mismunandi ávöxtunartölur                             │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┬──────────────┬──────────────┬──────────────┐       │
│  │             │  Íhaldssöm   │   Miðlungs   │   Bjartsýn   │       │
│  │             │     (5%)     │     (7%)     │     (9%)     │       │
│  ├─────────────┼──────────────┼──────────────┼──────────────┤       │
│  │ Ró aldur    │  Ómögulegt   │   45 ára     │   41 ára     │       │
│  │ Ár þangað   │      -       │  10 ár, 5m   │   6 ár, 2m   │       │
│  │ Bil að Ró   │  45.000.000  │ 15.342.000   │  Þú ert nú   │       │
│  │             │      kr      │      kr      │  þegar í Ró! │       │
│  │ Áætl. við   │ 203.000.000  │ 412.000.000  │ 875.000.000  │       │
│  │ 67 ára      │      kr      │      kr      │      kr      │       │
│  │ Umfram FI   │  47.000.000  │ 256.000.000  │ 719.000.000  │       │
│  └─────────────┴──────────────┴──────────────┴──────────────┘       │
│                                                                       │
│  💡 Ráðlegging: Notaðu íhaldssömu spána til að skipuleggja           │
│     í öryggisskyni, en fylgstu með miðlungsávöxtun til að meta       │
│     framvindu.                                                        │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

### 3.6 LifeEnergyDisplay Component

**Responsibility**: Convert results to life energy hours

**Interface:**
```typescript
interface LifeEnergyDisplayProps {
  currentInvestments: number;
  gapToCoast: number | null;
  projectedGrowth: number; // Compound growth from current to FI
  actualHourlyWage: number | null;
}
```

**Calculations:**
```typescript
const investmentsInHours = currentInvestments / actualHourlyWage;
const gapInHours = gapToCoast / actualHourlyWage;
const passiveHoursEarned = projectedGrowth / actualHourlyWage;

// If user continued to save to Full FI manually
const yearsToFullFI = calculateYearsToFI(currentInvestments, fiNumber, savingsRate);
const totalHoursIfSaving = yearsToFullFI * 2080; // Work hours per year
const hoursSavedByCoasting = totalHoursIfSaving - passiveHoursEarned;
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ⏱️ LÍFSORKA - Vinnustundir                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Núverandi fjárfestingar:                            │
│  25.000.000 kr = 10.000 vinnustundir                │
│  (≈ 4,8 ár af vinnudögum)                           │
│                                                      │
│  Bil að Ró FIRE:                                     │
│  15.342.000 kr = 6.137 vinnustundir                 │
│  (≈ 3,0 ár af vinnudögum)                           │
│                                                      │
│  Óvirk vinnustundir fram til FI:                    │
│  387.000.000 kr = 154.800 vinnustundir              │
│  (Samsett vöxtur frá Ró til eftirlaunaaldurs)       │
│                                                      │
│  🎯 Sparað með því að fara í Ró:                    │
│  Þú sparar 68.000 vinnustundir (≈ 33 ár af vinnu)  │
│  með því að láta samsettan vöxt vinna fyrir þig    │
│  í stað þess að leggja til sjálfur.                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 3.7 ActionSuggestionsPanel Component

**Responsibility**: Provide actionable suggestions when Coast FIRE not achievable

**Interface:**
```typescript
interface ActionSuggestionsPanelProps {
  currentAge: number;
  currentBalance: number;
  fiNumber: number;
  targetRetirementAge: number;
  expectedReturn: number;
  gap: number; // Amount short
  projectedBalance: number; // What they'll actually have
}

interface Suggestion {
  type: 'increase-return' | 'delay-retirement' | 'reduce-fi' | 'continue-saving';
  title: string;
  description: string;
  calculation: string;
  feasibility: 'easy' | 'moderate' | 'difficult';
}
```

**Suggestion Generation Logic:**
```typescript
function generateSuggestions(props: ActionSuggestionsPanelProps): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Suggestion 1: Delay Retirement
  const yearsNeeded = calculateYearsNeeded(
    props.currentBalance,
    props.fiNumber,
    props.expectedReturn
  );
  suggestions.push({
    type: 'delay-retirement',
    title: 'Fresta eftirlaunum',
    description: `Við að fresta til ${props.currentAge + yearsNeeded} ára aldurs`,
    calculation: `${yearsNeeded - (props.targetRetirementAge - props.currentAge)} ár viðbótar`,
    feasibility: yearsNeeded < 70 ? 'moderate' : 'difficult'
  });

  // Suggestion 2: Reduce FI Number
  const achievableFI = calculateFutureValue(
    props.currentBalance,
    props.expectedReturn,
    props.targetRetirementAge - props.currentAge
  );
  suggestions.push({
    type: 'reduce-fi',
    title: 'Minnka FI Tölu',
    description: `Lækka markmið í ${formatCurrency(achievableFI)}`,
    calculation: `${formatCurrency(props.fiNumber - achievableFI)} kr minna`,
    feasibility: achievableFI > (props.fiNumber * 0.7) ? 'easy' : 'difficult'
  });

  // Suggestion 3: Increase Return (with caution)
  const requiredReturn = calculateRequiredReturn(
    props.currentBalance,
    props.fiNumber,
    props.targetRetirementAge - props.currentAge
  );
  suggestions.push({
    type: 'increase-return',
    title: 'Auka ávöxtun (áhætta)',
    description: `Þú þarft ${requiredReturn.toFixed(1)}% ávöxtun`,
    calculation: `${(requiredReturn - props.expectedReturn).toFixed(1)}% hærri`,
    feasibility: requiredReturn < 10 ? 'moderate' : 'difficult'
  });

  // Suggestion 4: Continue Saving
  const monthlySavingsNeeded = calculateMonthlySavings(
    props.currentBalance,
    props.fiNumber,
    props.expectedReturn,
    props.targetRetirementAge - props.currentAge
  );
  suggestions.push({
    type: 'continue-saving',
    title: 'Halda áfram að spara',
    description: `Leggja til ${formatCurrency(monthlySavingsNeeded)}/mánuð`,
    calculation: `Ná FI við ${props.targetRetirementAge} ára aldur`,
    feasibility: 'moderate'
  });

  return suggestions;
}
```

**Visual Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ⚠️ RÓ FIRE EKKI MÖGULEGT - Tillögur                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Bil: 45.000.000 kr                                 │
│  Áætluð staða: 111.000.000 kr (af 156.000.000 kr)  │
│                                                      │
│  Tillögur til að ná Ró FIRE:                        │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ 🕐 Fresta eftirlaunum                      │     │
│  │    Við að fresta til 72 ára aldurs        │     │
│  │    +5 ár viðbótar                          │     │
│  │    Erfiðleiki: ▓▓▒░░ Í meðallagi          │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ 📉 Minnka FI Tölu                          │     │
│  │    Lækka markmið í 111.000.000 kr         │     │
│  │    45.000.000 kr minna                     │     │
│  │    Erfiðleiki: ▓▒░░░ Auðvelt              │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ 📈 Auka ávöxtun (áhætta)                  │     │
│  │    Þú þarft 11.2% ávöxtun                 │     │
│  │    +4.2% hærri (mikil áhætta!)            │     │
│  │    Erfiðleiki: ▓▓▓▓▒ Erfitt               │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ 💰 Halda áfram að spara                    │     │
│  │    Leggja til 95.000 kr/mánuð             │     │
│  │    Ná FI við 67 ára aldur                 │     │
│  │    Erfiðleiki: ▓▓▒░░ Í meðallagi          │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  💡 Ráðlegging: Skoða samsetningu af tillögum      │
│     (t.d. fresta 2 ár + auka ávöxtun lítillega).   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Coast FIRE Types
 */

export interface CoastFIREState {
  // Inputs
  currentAge: number;
  currentInvestments: number; // ISK
  fiNumber: number | null; // ISK
  fiNumberSource: 'manual' | 'baseline';
  selectedTier: ExpenseTier | null; // If using baseline
  fiMultiplier: number; // 25, 30, or custom
  expectedReturn: number; // Percentage (7 = 7%)
  targetRetirementAge: number; // Age

  // Metadata
  lastUpdated: Date;
  version: number; // Schema version
}

export interface CoastFIREResults {
  // Status
  status: 'coasting' | 'future' | 'impossible';
  coastFireAge: number | null; // Age when coasting begins (null if impossible)
  coastFireDate: Date | null; // Calendar date
  yearsToCoast: number | null; // Years until Coast FIRE (fractional)

  // Financial projections
  gapToCoast: number | null; // ISK needed to reach Coast FIRE today (null if coasting)
  projectedBalance: number; // Balance at target retirement age
  compoundGrowth: number; // Total growth from current to target age

  // Scenario comparisons
  scenarios: ScenarioResult[];

  // Life energy (null if AWH not available)
  lifeEnergy: CoastFIRELifeEnergy | null;

  // Calculations metadata
  calculatedAt: Date;
  assumptions: CalculationAssumptions;
}

export interface ScenarioResult {
  name: string; // 'Íhaldssöm' | 'Miðlungs' | 'Bjartsýn'
  returnRate: number; // Percentage
  status: 'coasting' | 'future' | 'impossible';
  coastFireAge: number | null;
  yearsToCoast: number | null;
  gapToCoast: number | null;
  projectedBalance: number;
  compoundGrowth: number;
}

export interface CoastFIRELifeEnergy {
  // Current state
  investmentsInHours: number; // Current balance in work hours
  gapInHours: number | null; // Gap to Coast FIRE in work hours

  // Future projections
  passiveHoursEarned: number; // Work hours equivalent of compound growth
  totalWorkYearsRepresented: number; // passiveHoursEarned / 2080

  // Comparison
  hoursSavedByCoasting: number | null; // vs continuing to save manually
  yearsSavedByCoasting: number | null; // hoursSavedByCoasting / 2080
}

export interface CalculationAssumptions {
  currentAge: number;
  currentInvestments: number;
  fiNumber: number;
  expectedReturn: number;
  targetRetirementAge: number;
  fiMultiplier: number;
  compoundingFrequency: 'annual' | 'monthly'; // Default annual
  realVsNominal: 'real'; // Always real (after inflation)
}

export interface ChartDataPoint {
  age: number;
  year: number;
  balance: number;
  scenario?: 'conservative' | 'moderate' | 'optimistic';
}
```

### 4.2 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // Coast FIRE
  coastFire: CoastFIREState | null;
  coastFireResults: CoastFIREResults | null;

  // Coast FIRE Actions
  updateCoastFire: (state: Partial<CoastFIREState>) => void;
  setFINumberFromBaseline: (tier: ExpenseTier, multiplier: number) => void;
  resetCoastFire: () => void;

  // Coast FIRE API (for other calculators)
  getCoastFIREStatus: () => 'coasting' | 'future' | 'impossible' | null;
  getCoastFIREAge: () => number | null;
}
```

### 4.3 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  coastFire?: {
    currentAge: number;
    currentInvestments: number;
    fiNumber: number | null;
    fiNumberSource: 'manual' | 'baseline';
    selectedTier: string | null; // 'barebones' | 'comfortable' | 'deluxe'
    fiMultiplier: number;
    expectedReturn: number;
    targetRetirementAge: number;
    lastUpdated: string; // ISO date string
    version: number;
  };
}
```

---

## 5. Calculation Logic

### 5.1 Coast FIRE Date Calculator

**File**: `/src/lib/calculations/coastFire.ts`

```typescript
/**
 * Calculate future value using compound interest
 */
export const calculateFutureValue = (
  principal: number,
  annualReturnRate: number,
  years: number,
  compoundingFrequency: 'annual' | 'monthly' = 'annual'
): number => {
  const rate = annualReturnRate / 100;

  if (compoundingFrequency === 'annual') {
    return principal * Math.pow(1 + rate, years);
  } else {
    // Monthly compounding
    const monthlyRate = rate / 12;
    const months = years * 12;
    return principal * Math.pow(1 + monthlyRate, months);
  }
};

/**
 * Calculate years needed to reach target with compound growth
 * Solves: target = principal × (1 + r)^t for t
 */
export const calculateYearsToCoastFIRE = (
  currentBalance: number,
  fiNumber: number,
  annualReturnRate: number
): number | null => {
  if (currentBalance <= 0 || fiNumber <= 0) return null;
  if (annualReturnRate <= -100) return null; // Invalid return

  const rate = annualReturnRate / 100;

  // If already at or above FI number
  if (currentBalance >= fiNumber) return 0;

  // If return rate is 0 or negative, can't reach target through growth
  if (rate <= 0) return null;

  // Solve for t: fiNumber = currentBalance × (1 + r)^t
  // t = ln(fiNumber / currentBalance) / ln(1 + r)
  const ratio = fiNumber / currentBalance;
  const years = Math.log(ratio) / Math.log(1 + rate);

  // Sanity check: if years > 100, effectively impossible
  return years > 100 ? null : years;
};

/**
 * Calculate Coast FIRE age
 */
export const calculateCoastFIREAge = (
  currentAge: number,
  yearsToCoast: number | null
): number | null => {
  if (yearsToCoast === null) return null;
  return currentAge + yearsToCoast;
};

/**
 * Calculate Coast FIRE date (calendar)
 */
export const calculateCoastFIREDate = (
  birthDate: Date,
  coastFireAge: number | null
): Date | null => {
  if (coastFireAge === null) return null;

  const date = new Date(birthDate);
  date.setFullYear(birthDate.getFullYear() + coastFireAge);
  return date;
};

/**
 * Calculate gap to Coast FIRE (how much more needed)
 */
export const calculateGapToCoastFIRE = (
  currentBalance: number,
  targetRetirementAge: number,
  currentAge: number,
  fiNumber: number,
  annualReturnRate: number
): number | null => {
  const yearsToRetirement = targetRetirementAge - currentAge;

  // Calculate how much is needed TODAY to reach FI number at target age
  // PV = FV / (1 + r)^t
  const rate = annualReturnRate / 100;
  const requiredToday = fiNumber / Math.pow(1 + rate, yearsToRetirement);

  const gap = requiredToday - currentBalance;

  // If gap is negative or zero, already coasting
  return gap > 0 ? gap : 0;
};
```

### 5.2 Scenario Generator

```typescript
/**
 * Generate multiple scenario projections
 */
export const generateScenarios = (
  currentAge: number,
  currentBalance: number,
  fiNumber: number,
  targetRetirementAge: number
): ScenarioResult[] => {
  const scenarios: Array<{ name: string; rate: number }> = [
    { name: 'Íhaldssöm', rate: 5 },
    { name: 'Miðlungs', rate: 7 },
    { name: 'Bjartsýn', rate: 9 }
  ];

  return scenarios.map(({ name, rate }) => {
    const yearsToCoast = calculateYearsToCoastFIRE(currentBalance, fiNumber, rate);
    const coastFireAge = yearsToCoast !== null ? currentAge + yearsToCoast : null;

    let status: 'coasting' | 'future' | 'impossible';
    if (yearsToCoast === 0) {
      status = 'coasting';
    } else if (coastFireAge && coastFireAge <= targetRetirementAge) {
      status = 'future';
    } else {
      status = 'impossible';
    }

    const projectedBalance = calculateFutureValue(
      currentBalance,
      rate,
      targetRetirementAge - currentAge
    );

    const gapToCoast = status === 'impossible'
      ? calculateGapToCoastFIRE(currentBalance, targetRetirementAge, currentAge, fiNumber, rate)
      : null;

    return {
      name,
      returnRate: rate,
      status,
      coastFireAge,
      yearsToCoast,
      gapToCoast,
      projectedBalance,
      compoundGrowth: projectedBalance - currentBalance
    };
  });
};
```

### 5.3 Chart Data Generator

```typescript
/**
 * Generate chart data points for visualization
 */
export const generateChartData = (
  currentAge: number,
  targetRetirementAge: number,
  currentBalance: number,
  annualReturnRate: number
): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = [];
  const currentYear = new Date().getFullYear();

  for (let age = currentAge; age <= targetRetirementAge; age++) {
    const yearsFromNow = age - currentAge;
    const balance = calculateFutureValue(currentBalance, annualReturnRate, yearsFromNow);

    dataPoints.push({
      age,
      year: currentYear + yearsFromNow,
      balance
    });
  }

  return dataPoints;
};

/**
 * Generate multi-scenario chart data
 */
export const generateMultiScenarioChartData = (
  currentAge: number,
  targetRetirementAge: number,
  currentBalance: number
): Record<string, ChartDataPoint[]> => {
  return {
    conservative: generateChartData(currentAge, targetRetirementAge, currentBalance, 5),
    moderate: generateChartData(currentAge, targetRetirementAge, currentBalance, 7),
    optimistic: generateChartData(currentAge, targetRetirementAge, currentBalance, 9)
  };
};
```

### 5.4 Life Energy Calculator

```typescript
/**
 * Calculate life energy metrics for Coast FIRE
 */
export const calculateCoastFIRELifeEnergy = (
  currentBalance: number,
  gapToCoast: number | null,
  compoundGrowth: number,
  actualHourlyWage: number | null
): CoastFIRELifeEnergy | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  const investmentsInHours = currentBalance / actualHourlyWage;
  const gapInHours = gapToCoast !== null ? gapToCoast / actualHourlyWage : null;
  const passiveHoursEarned = compoundGrowth / actualHourlyWage;
  const totalWorkYearsRepresented = passiveHoursEarned / 2080; // 2080 work hours/year

  // Estimate hours saved vs continuing to save manually
  // This is a simplified calculation; could be enhanced
  const hoursSavedByCoasting = passiveHoursEarned * 0.8; // Rough estimate
  const yearsSavedByCoasting = hoursSavedByCoasting / 2080;

  return {
    investmentsInHours,
    gapInHours,
    passiveHoursEarned,
    totalWorkYearsRepresented,
    hoursSavedByCoasting,
    yearsSavedByCoasting
  };
};
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate all Coast FIRE results
 */
export const calculateCoastFIREResults = (
  state: CoastFIREState,
  actualHourlyWage: number | null
): CoastFIREResults => {
  const {
    currentAge,
    currentInvestments,
    fiNumber,
    expectedReturn,
    targetRetirementAge
  } = state;

  if (!fiNumber || fiNumber <= 0) {
    throw new Error('FI Number required for Coast FIRE calculation');
  }

  // Calculate primary scenario
  const yearsToCoast = calculateYearsToCoastFIRE(currentInvestments, fiNumber, expectedReturn);
  const coastFireAge = yearsToCoast !== null ? currentAge + yearsToCoast : null;

  let status: 'coasting' | 'future' | 'impossible';
  if (yearsToCoast === 0) {
    status = 'coasting';
  } else if (coastFireAge && coastFireAge <= targetRetirementAge) {
    status = 'future';
  } else {
    status = 'impossible';
  }

  const coastFireDate = null; // Would need birthDate from user profile

  const gapToCoast = status !== 'coasting'
    ? calculateGapToCoastFIRE(currentInvestments, targetRetirementAge, currentAge, fiNumber, expectedReturn)
    : null;

  const projectedBalance = calculateFutureValue(
    currentInvestments,
    expectedReturn,
    targetRetirementAge - currentAge
  );

  const compoundGrowth = projectedBalance - currentInvestments;

  // Generate scenarios
  const scenarios = generateScenarios(currentAge, currentInvestments, fiNumber, targetRetirementAge);

  // Calculate life energy
  const lifeEnergy = calculateCoastFIRELifeEnergy(
    currentInvestments,
    gapToCoast,
    compoundGrowth,
    actualHourlyWage
  );

  return {
    status,
    coastFireAge,
    coastFireDate,
    yearsToCoast,
    gapToCoast,
    projectedBalance,
    compoundGrowth,
    scenarios,
    lifeEnergy,
    calculatedAt: new Date(),
    assumptions: {
      currentAge,
      currentInvestments,
      fiNumber,
      expectedReturn,
      targetRetirementAge,
      fiMultiplier: state.fiMultiplier,
      compoundingFrequency: 'annual',
      realVsNominal: 'real'
    }
  };
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

**Data Access Pattern:**
```typescript
// In CoastFIRECalculator component
const { expenseBaseline, getExpenseByTier } = useCalculator();

const handleTierSelect = (tier: ExpenseTier) => {
  const monthlyExpenses = getExpenseByTier(tier);
  const annualExpenses = monthlyExpenses * 12;
  const fiNumber = annualExpenses * fiMultiplier;

  updateCoastFire({
    fiNumber,
    fiNumberSource: 'baseline',
    selectedTier: tier
  });
};
```

**Baseline Availability Check:**
```typescript
const hasBaseline = expenseBaseline?.wizardCompleted === true;

{hasBaseline ? (
  <BaselineFINumberSelector
    tiers={expenseBaseline.tiers}
    onSelectTier={handleTierSelect}
  />
) : (
  <ManualFINumberInput
    value={coastFire.fiNumber}
    onChange={handleManualFINumber}
    promptToCreateBaseline
  />
)}
```

**Auto-Update on Baseline Changes:**
```typescript
useEffect(() => {
  if (coastFire.fiNumberSource === 'baseline' && coastFire.selectedTier) {
    // Recalculate FI number when baseline changes
    const monthlyExpenses = getExpenseByTier(coastFire.selectedTier);
    const annualExpenses = monthlyExpenses * 12;
    const fiNumber = annualExpenses * coastFire.fiMultiplier;

    updateCoastFire({ fiNumber });
  }
}, [expenseBaseline, coastFire.selectedTier, coastFire.fiMultiplier]);
```

### 6.2 Integration with Actual Hourly Wage

**AWH Access Pattern:**
```typescript
const { results } = useCalculator();
const actualHourlyWage = results?.actualHourlyWage || null;

// Pass to life energy calculations
const lifeEnergy = calculateCoastFIRELifeEnergy(
  currentInvestments,
  gapToCoast,
  compoundGrowth,
  actualHourlyWage
);
```

**Missing AWH Handling:**
```typescript
{!actualHourlyWage ? (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorku túlkun</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
) : (
  <LifeEnergyDisplay
    currentInvestments={currentInvestments}
    gapToCoast={gapToCoast}
    compoundGrowth={compoundGrowth}
    actualHourlyWage={actualHourlyWage}
  />
)}
```

### 6.3 Cross-Calculator Integration

**Sharing FI Number:**
```typescript
// Coast FIRE sets FI number that other calculators can use
// E.g., Barista FIRE Planner, Full FI Calculator

interface CalculatorContextType {
  // Shared FI number across FIRE calculators
  sharedFINumber: number | null;
  setSharedFINumber: (value: number) => void;
}

// In Coast FIRE
useEffect(() => {
  if (coastFire.fiNumber) {
    setSharedFINumber(coastFire.fiNumber);
  }
}, [coastFire.fiNumber]);
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateCoastFIREInputs = (state: CoastFIREState): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Age validation
  if (state.currentAge < 18 || state.currentAge > 100) {
    errors.push('Aldur verður að vera á bilinu 18-100 ára');
  }

  if (state.targetRetirementAge <= state.currentAge) {
    errors.push('Eftirlaunaaldur verður að vera hærri en núverandi aldur');
  }

  if (state.targetRetirementAge > 100) {
    warnings.push('Eftirlaunaaldur yfir 100 ár er óvenjulegur');
  }

  // Investment validation
  if (state.currentInvestments < 0) {
    errors.push('Fjárfestingar geta ekki verið neikvæðar');
  }

  if (state.currentInvestments === 0) {
    warnings.push('Með 0 kr í fjárfestingum muntu aldrei ná Ró FIRE án þess að leggja til');
  }

  // FI Number validation
  if (!state.fiNumber || state.fiNumber <= 0) {
    errors.push('FI Tala verður að vera stærri en 0');
  }

  // Return rate validation
  if (state.expectedReturn < -10 || state.expectedReturn > 15) {
    errors.push('Ávöxtunarkrafa verður að vera á bilinu -10% til 15%');
  }

  if (state.expectedReturn < 3 || state.expectedReturn > 10) {
    warnings.push('Ávöxtunarkrafa utan venjulegs bils (3-10%)');
  }

  if (state.expectedReturn <= 0) {
    warnings.push('Með 0% eða neikvæða ávöxtun muntu ekki ná Ró FIRE');
  }

  // FI Multiplier validation
  if (state.fiMultiplier < 20 || state.fiMultiplier > 40) {
    warnings.push('Margfaldari utan venjulegs bils (20-40x)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};
```

### 7.2 Calculation Error Handling

```typescript
const safeCalculateCoastFIRE = (
  state: CoastFIREState,
  actualHourlyWage: number | null
): CoastFIREResults | null => {
  try {
    // Validate inputs first
    const validation = validateCoastFIREInputs(state);
    if (!validation.valid) {
      console.error('Coast FIRE validation failed:', validation.errors);
      showToast({
        type: 'error',
        message: validation.errors[0] || 'Ógild innsláttur'
      });
      return null;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      showToast({
        type: 'warning',
        message: validation.warnings[0]
      });
    }

    // Perform calculation
    return calculateCoastFIREResults(state, actualHourlyWage);

  } catch (error) {
    console.error('Coast FIRE calculation error:', error);
    showToast({
      type: 'error',
      message: 'Villa kom upp við útreikning. Vinsamlegast athugaðu innsláttinn.'
    });
    return null;
  }
};
```

### 7.3 Edge Case Handling

```typescript
// Handle "already coasting" scenario
if (yearsToCoast === 0) {
  return {
    status: 'coasting',
    coastFireAge: currentAge,
    message: 'Til hamingju! Þú ert nú þegar í Ró FIRE!',
    details: `Núverandi fjárfestingar (${formatCurrency(currentBalance)}) munu vaxa ` +
             `í ${formatCurrency(projectedBalance)} við ${targetRetirementAge} ára aldur, ` +
             `sem er umfram FI Tölu þína (${formatCurrency(fiNumber)}).`
  };
}

// Handle "impossible" scenario
if (coastFireAge > targetRetirementAge || yearsToCoast === null) {
  return {
    status: 'impossible',
    coastFireAge: null,
    message: 'Ró FIRE ekki mögulegt með þessum forsendum',
    details: `Fjárfestingar munu vaxa í ${formatCurrency(projectedBalance)} ` +
             `við ${targetRetirementAge} ára aldur, sem er minna en FI Tala ` +
             `(${formatCurrency(fiNumber)}). Bil: ${formatCurrency(gap)}.`,
    suggestions: generateSuggestions(state)
  };
}

// Handle very long timeline
if (yearsToCoast > 40) {
  showToast({
    type: 'info',
    message: 'Langtímaspá (>40 ár) er mjög óviss. Íhugaðu að breyta forsendum.'
  });
}
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Desktop Layout (>1024px):**
```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Ró FIRE Reiknivél"                                │
│  Educational Intro (collapsible)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────┐  ┌──────────────────────────────┐  │
│  │  Input Section     │  │  Results Section             │  │
│  │  (Sticky)          │  │                              │  │
│  │                    │  │  ┌────────────────────────┐  │  │
│  │  • FI Number       │  │  │ Coast FIRE Status Card │  │  │
│  │  • Investments     │  │  └────────────────────────┘  │  │
│  │  • Ages            │  │                              │  │
│  │  • Return Rate     │  │  ┌────────────────────────┐  │  │
│  │                    │  │  │ Growth Chart           │  │  │
│  └────────────────────┘  │  │                        │  │  │
│                          │  └────────────────────────┘  │  │
│                          │                              │  │
│                          │  ┌────────────────────────┐  │  │
│                          │  │ Scenario Comparison    │  │  │
│                          │  └────────────────────────┘  │  │
│                          │                              │  │
│                          │  ┌────────────────────────┐  │  │
│                          │  │ Life Energy (if AWH)   │  │  │
│                          │  └────────────────────────┘  │  │
│                          └──────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Key Insights (plain language summary)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout (<768px):**
```
┌───────────────────────────────┐
│  Header                       │
│  Educational Intro (compact)  │
├───────────────────────────────┤
│  Input Section                │
│  • FI Number                  │
│  • Investments                │
│  • Ages                       │
│  • Return Rate                │
├───────────────────────────────┤
│  Results Section              │
│  • Status Card                │
│  • Chart (scrollable)         │
│  • Scenarios (tabs)           │
│  • Life Energy                │
├───────────────────────────────┤
│  Key Insights                 │
└───────────────────────────────┘
```

### 8.2 Color Coding System

```typescript
const COAST_FIRE_COLORS = {
  status: {
    coasting: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      accent: 'bg-green-500'
    },
    future: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      accent: 'bg-blue-500'
    },
    impossible: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-800',
      accent: 'bg-amber-500'
    }
  },

  scenarios: {
    conservative: '#ef4444', // Red
    moderate: '#3b82f6',     // Blue (default)
    optimistic: '#10b981'    // Green
  },

  chart: {
    projectedGrowth: '#10b981',  // Green
    fiNumberLine: '#3b82f6',     // Blue
    currentBalance: '#6b7280',   // Gray
    coastingPeriod: '#fef3c7',   // Light amber (area fill)
    coastMilestone: '#f59e0b'    // Amber (marker)
  }
};
```

### 8.3 Responsive Breakpoints

**Mobile (<640px):**
- Single column layout
- Stacked input/results
- Compact chart (300px height)
- Scenario tabs instead of table

**Tablet (640px-1024px):**
- Two-column layout for some sections
- Full-size chart (400px height)
- Scenario table (compact)

**Desktop (>1024px):**
- Full sidebar + main layout
- Large chart (500px height)
- Full scenario comparison table

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `coastFire.test.ts` - Calculation logic
- `CoastFIRECalculator.test.tsx` - Main component
- `GrowthProjectionChart.test.tsx` - Chart component

**Test Coverage:**

```typescript
// coastFire.test.ts
describe('calculateYearsToCoastFIRE', () => {
  it('calculates correct years for standard scenario', () => {
    const years = calculateYearsToCoastFIRE(10000000, 75000000, 7);
    expect(years).toBeCloseTo(29.6, 1);
  });

  it('returns 0 when already coasting', () => {
    const years = calculateYearsToCoastFIRE(80000000, 75000000, 7);
    expect(years).toBe(0);
  });

  it('returns null for impossible scenarios', () => {
    const years = calculateYearsToCoastFIRE(1000000, 75000000, -2);
    expect(years).toBeNull();
  });

  it('handles edge case of 0% return', () => {
    const years = calculateYearsToCoastFIRE(10000000, 75000000, 0);
    expect(years).toBeNull();
  });
});

describe('generateScenarios', () => {
  it('generates three scenarios with different returns', () => {
    const scenarios = generateScenarios(30, 10000000, 75000000, 67);

    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].name).toBe('Íhaldssöm');
    expect(scenarios[0].returnRate).toBe(5);
    expect(scenarios[1].returnRate).toBe(7);
    expect(scenarios[2].returnRate).toBe(9);
  });

  it('handles impossible scenarios correctly', () => {
    const scenarios = generateScenarios(60, 5000000, 60000000, 65);

    const conservativeScenario = scenarios.find(s => s.name === 'Íhaldssöm');
    expect(conservativeScenario?.status).toBe('impossible');
  });
});
```

### 9.2 Integration Testing

```typescript
describe('CoastFIRECalculator Integration', () => {
  it('uses expense baseline when available', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider
    });

    // Set up expense baseline
    act(() => {
      result.current.updateExpenseBaseline({
        wizardCompleted: true,
        categories: mockCategories
      });
    });

    // Select tier in Coast FIRE
    act(() => {
      result.current.setFINumberFromBaseline('comfortable', 25);
    });

    expect(result.current.coastFire?.fiNumber).toBe(520000 * 12 * 25);
    expect(result.current.coastFire?.fiNumberSource).toBe('baseline');
  });

  it('calculates life energy when AWH available', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider
    });

    // Set AWH
    act(() => {
      result.current.updateInputs({ actualHourlyWage: 2500 });
    });

    // Set Coast FIRE inputs
    act(() => {
      result.current.updateCoastFire({
        currentInvestments: 25000000,
        // ... other inputs
      });
    });

    expect(result.current.coastFireResults?.lifeEnergy).not.toBeNull();
    expect(result.current.coastFireResults?.lifeEnergy?.investmentsInHours).toBe(10000);
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on all inputs', () => {
    const { getByLabelText } = render(<CoastFIRECalculator />);

    expect(getByLabelText(/núverandi aldur/i)).toBeInTheDocument();
    expect(getByLabelText(/núverandi fjárfestingar/i)).toBeInTheDocument();
    expect(getByLabelText(/fi tala/i)).toBeInTheDocument();
  });

  it('announces status changes to screen readers', async () => {
    const { getByRole } = render(<CoastFIRECalculator />);

    // Change inputs to trigger calculation
    const investmentsInput = getByRole('spinbutton', { name: /fjárfestingar/i });
    await userEvent.type(investmentsInput, '50000000');

    // Check for status announcement
    const statusRegion = getByRole('status');
    expect(statusRegion).toHaveTextContent(/þú ert nú þegar í ró fire/i);
  });

  it('chart has text alternative', () => {
    const { getByRole } = render(<GrowthProjectionChart {...mockProps} />);

    const chart = getByRole('img', { name: /growth projection/i });
    expect(chart).toHaveAttribute('aria-label');
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive calculations
const coastFireResults = useMemo(() => {
  if (!coastFire || !coastFire.fiNumber) return null;
  return calculateCoastFIREResults(coastFire, actualHourlyWage);
}, [coastFire, actualHourlyWage]);

// Memoize chart data generation
const chartData = useMemo(() => {
  if (!coastFire) return [];
  return generateChartData(
    coastFire.currentAge,
    coastFire.targetRetirementAge,
    coastFire.currentInvestments,
    coastFire.expectedReturn
  );
}, [coastFire?.currentAge, coastFire?.targetRetirementAge, coastFire?.currentInvestments, coastFire?.expectedReturn]);
```

### 10.2 Debouncing User Input

```typescript
// Debounce slider changes
const debouncedUpdateReturn = useMemo(
  () => debounce((value: number) => {
    updateCoastFire({ expectedReturn: value });
  }, 150),
  [updateCoastFire]
);

// Debounce text input changes
const debouncedUpdateInvestments = useMemo(
  () => debounce((value: number) => {
    updateCoastFire({ currentInvestments: value });
  }, 300),
  [updateCoastFire]
);
```

### 10.3 Chart Rendering Performance

```typescript
// Use ResponsiveContainer for efficient resizing
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={chartData}>
    {/* Chart configuration */}
  </LineChart>
</ResponsiveContainer>

// Limit data points for performance
const optimizedChartData = useMemo(() => {
  const yearSpan = targetRetirementAge - currentAge;

  // If span > 50 years, sample every 2 years
  if (yearSpan > 50) {
    return chartData.filter((_, index) => index % 2 === 0);
  }

  return chartData;
}, [chartData, targetRetirementAge, currentAge]);
```

---

## 11. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Calculate Coast FIRE Date | calculateYearsToCoastFIRE(), CoastFIREStatusCard | Core calculation + status display |
| **US-2**: Investment Growth Projection | GrowthProjectionChart, generateChartData() | Recharts line chart with milestones |
| **US-3**: Use Expense Baseline | FINumberInput with BaselineSelector | Integration with expense baseline context |
| **US-4**: Explore Scenarios | ScenarioComparisonTable, generateScenarios() | Multiple return rate calculations |
| **US-5**: Life Energy Impact | LifeEnergyDisplay, calculateCoastFIRELifeEnergy() | AWH-based hour conversions |
| **US-6**: Compare Coast vs Full FI | CoastFIREStatusCard, KeyInsights | Side-by-side timeline comparison |
| **US-7**: Adjust FI Multiplier | FINumberInput with MultiplierSelector | 25x/30x/custom multiplier options |
| **FR-1**: Core Calculation | coastFire.ts calculation functions | Compound interest formulas |
| **FR-2**: FI Number Integration | setFINumberFromBaseline() | Expense baseline integration |
| **FR-3**: Scenario Analysis | ScenarioComparisonTable | Conservative/Moderate/Optimistic |
| **FR-4**: Visualization | GrowthProjectionChart | Recharts with markers and areas |
| **FR-5**: Life Energy Display | LifeEnergyDisplay | Hours and years conversions |
| **FR-6**: Results Summary | CoastFIREStatusCard, KeyInsights | Status + plain language summary |
| **FR-7**: Data Persistence | CalculatorContext, localStorage | Auto-save with debounce |

---

## 12. Implementation Risks and Mitigations

### Risk 1: Complex Chart Interactions

**Risk**: Chart may be difficult to implement with all interactive features (hover, zoom, scenarios).

**Mitigation**:
- Use Recharts library (battle-tested)
- Start with basic chart, add features incrementally
- Test on multiple devices early
- Have fallback: simple table view if chart fails

### Risk 2: FI Number Integration Complexity

**Risk**: Syncing with Expense Baseline across updates could lead to stale data.

**Mitigation**:
- Use `useEffect` to watch for baseline changes
- Clear indication when using baseline vs manual
- Prompt user when baseline updates ("Your FI number changed, recalculate?")
- Store both source and value

### Risk 3: Scenario Calculation Performance

**Risk**: Calculating 3+ scenarios with chart data could be slow.

**Mitigation**:
- Memoize all calculations
- Calculate scenarios in parallel (Promise.all if async)
- Limit chart data points for long timelines
- Show loading indicator if >100ms

### Risk 4: Edge Case Display

**Risk**: "Impossible" scenarios need clear, actionable messaging.

**Mitigation**:
- Comprehensive ActionSuggestionsPanel
- Clear calculations showing the gap
- Realistic suggestions with feasibility ratings
- Link to related calculators (Barista FIRE, etc.)

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
- [x] Uses existing technology stack (React, TypeScript, Recharts)
- [x] Integrates with existing CalculatorContext
- [x] Follows established patterns from other calculators
- [x] Performance requirements achievable (<50ms calculations)

### Quality
- [x] Privacy-first design maintained (client-side only)
- [x] Icelandic localization complete
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] Expense Baseline integration designed
- [x] AWH integration designed
- [x] Context state management defined
- [x] Cross-calculator sharing planned

---

**Design Phase Complete: Ready for Tasks Breakdown**
