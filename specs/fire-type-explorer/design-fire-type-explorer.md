# Design: FIRE Type Explorer

## Document Information

- **Feature Name**: FIRE Type Explorer (FIRE Leiðarvísir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-fire-type-explorer.md

---

## 1. System Overview

### 1.1 Purpose

The FIRE Type Explorer is an educational and planning tool that helps users understand different FIRE (Financial Independence, Retire Early) strategies and compare them based on their personal financial situation. It provides personalized calculations for five FIRE types: LeanFIRE, RegularFIRE, CoastFIRE, BaristaFIRE, and FatFIRE.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for preferences persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Educational First**: Clear explanations before calculations
2. **Personalized**: Uses actual user data when available
3. **Comparative**: Side-by-side comparison as default view
4. **Visual**: Timeline and charts make concepts tangible
5. **Flexible**: Adjustable assumptions for exploration
6. **Integrated**: Pulls data from other calculators
7. **Icelandic Context**: Local examples and realistic numbers

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ FIRE Type Cards  │  │ Comparison Table │  │ Timeline Visual      │  │
│  │ (Definitions)    │  │ (Side-by-side)   │  │ (Milestone Progress) │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  fireTypePreferences: FIRETypePreferences                        │   │
│  │    - selectedType: FIREType | null                               │   │
│  │    - assumptions: FIREAssumptions                                │   │
│  │  fireTypeResults: FIRETypeResults                                │   │
│  │    - calculations: FIRECalculation[]                             │   │
│  │    - recommendations: FIRERecommendation[]                       │   │
│  │    - timeline: FIRETimeline                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Input Sources:                                                  │   │
│  │    - expenseBaseline (from Expense Baseline Tool)                │   │
│  │    - actualHourlyWage (from AWH Calculator)                      │   │
│  │    - User inputs: age, income, net worth, target age             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ FIRE Number       │  │ Timeline          │  │ Recommendation    │  │
│  │ Calculator        │  │ Calculator        │  │ Engine            │  │
│  │ (per type)        │  │ (milestones)      │  │ (ranking)         │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Export/Import     │  │ Preferences       │  │
│  │ (selected type)   │  │ Functions         │  │ Manager           │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
FIRETypeExplorer (Page Component)
├── IntroductionSection
│   ├── PageHeader (Title, description)
│   └── WhatIsFIRE (Collapsible educational content)
│
├── InputsSection (User data collection)
│   ├── ExpenseBaselineStatus (Shows if baseline exists)
│   ├── UserFinancialInputs
│   │   ├── AgeInput
│   │   ├── CurrentNetWorthInput
│   │   ├── MonthlyIncomeInput
│   │   ├── MonthlySavingsInput
│   │   └── TargetRetirementAgeInput
│   └── AssumptionsControls
│       ├── WithdrawalRateSlider (3-5%, default 4%)
│       ├── GrowthRateSlider (4-8%, default 6%)
│       └── ResetToDefaultsButton
│
├── FIRETypeDefinitionsSection
│   ├── FIRETypeCard (LeanFIRE)
│   │   ├── CardHeader (Icon, Name, Tagline)
│   │   ├── Definition (Short description)
│   │   ├── PersonalizedNumbers (if data available)
│   │   ├── IdealForList (Who should consider this)
│   │   ├── ProsList
│   │   ├── ConsList
│   │   └── LearnMoreButton (Expands details)
│   ├── FIRETypeCard (RegularFIRE)
│   ├── FIRETypeCard (CoastFIRE)
│   ├── FIRETypeCard (BaristaFIRE)
│   └── FIRETypeCard (FatFIRE)
│
├── ComparisonSection
│   ├── TierToggle (if baseline has multiple tiers)
│   ├── ComparisonTable (Desktop)
│   │   ├── TableHeader (Column names)
│   │   ├── FIRETypeRow (per type)
│   │   │   ├── TypeNameCell
│   │   │   ├── TargetNestEggCell
│   │   │   ├── MonthlyExpensesCell
│   │   │   ├── RequiredSavingsRateCell
│   │   │   ├── YearsToReachCell
│   │   │   └── EffortLevelIndicator
│   │   └── TableFooter (Notes)
│   └── ComparisonCards (Mobile)
│       └── FIREComparisonCard (per type)
│
├── RecommendationsSection
│   ├── SectionHeader
│   ├── TopRecommendationCard (Primary suggestion)
│   │   ├── TypeName
│   │   ├── Reasoning
│   │   ├── ActionSteps
│   │   ├── Timeline
│   │   └── SelectThisTypeButton
│   ├── AlternativeRecommendationCard (2-3 alternatives)
│   └── NoRecommendationAlert (if insufficient data)
│
├── TimelineSection
│   ├── TimelineVisualization
│   │   ├── TimelineAxis (horizontal/vertical)
│   │   ├── CurrentPositionMarker
│   │   ├── CoastFIREMilestone
│   │   ├── BaristaFIREMilestone
│   │   ├── RegularFIREMilestone
│   │   ├── FatFIREMilestone
│   │   └── MilestoneTooltip (on hover)
│   └── TimelineLegend
│
├── EducationalContentSection (Collapsible)
│   ├── DetailedExplanations (per FIRE type)
│   │   ├── RealWorldExample
│   │   ├── CommonPitfalls
│   │   └── Resources
│   ├── GlossarySection
│   └── FAQSection
│
└── ActionButtonsSection
    ├── AdjustExpenseBaselineButton
    ├── CalculateFINumberButton
    ├── ImproveSavingsRateButton
    └── ExportScenariosButton
```

### 2.3 Data Flow

**Initialization Flow:**
```
Page Load → Check CalculatorContext → Check Expense Baseline
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              Baseline Exists     No Baseline
                                    ↓                   ↓
                            Load Tier Data      Show Prompt + Examples
                                    ↓
                          Get User Inputs (age, income, etc.)
                                    ↓
                          Calculate All FIRE Types
                                    ↓
                          Generate Recommendations
                                    ↓
                          Render Timeline
                                    ↓
                          Display Results
```

**User Interaction Flow:**
```
User Changes Tier → Recalculate All FIRE Types → Update Display
User Adjusts Assumptions → Recalculate → Update Display
User Changes Input → Debounce → Recalculate → Update Display
User Selects FIRE Type → Save Preference → Update Context
```

---

## 3. Component Design

### 3.1 FIRETypeExplorer (Main Component)

**Responsibility**: Page-level container and orchestrator

**Interface:**
```typescript
interface FIRETypeExplorerProps {
  // No props - gets data from CalculatorContext
}

interface FIRETypeExplorerState {
  selectedTier: ExpenseTier;
  userInputs: UserFinancialInputs;
  assumptions: FIREAssumptions;
  isLoading: boolean;
}
```

**Key Features:**
- Checks for expense baseline on mount
- Coordinates calculations across all FIRE types
- Manages user input state
- Handles assumption adjustments
- Saves selected FIRE type preference

---

### 3.2 FIRETypeCard Component

**Responsibility**: Display single FIRE type with definition and personalized numbers

**Interface:**
```typescript
interface FIRETypeCardProps {
  fireType: FIREType;
  calculation: FIRECalculation | null;
  isSelected: boolean;
  onSelect: () => void;
  onLearnMore: () => void;
}

interface FIREType {
  id: string;
  nameIs: string; // Icelandic name
  nameEn: string; // English term
  icon: string; // Emoji
  tagline: string; // One sentence summary
  description: string; // Detailed explanation
  idealFor: string[]; // List of ideal candidates
  pros: string[];
  cons: string[];
  color: string; // Theme color
}

interface FIRECalculation {
  fireType: string;
  targetNestEgg: number; // ISK
  monthlyExpenses: number; // ISK
  requiredSavingsRate: number; // Percentage
  yearsToReach: number; // Years from today
  reachedAge: number; // Age when reached
  effortLevel: 'low' | 'medium' | 'high' | 'extreme';
  isFeasible: boolean;
  warnings: string[];

  // Type-specific fields
  coastPoint?: number; // Nest egg needed today for CoastFIRE
  partTimeIncome?: number; // Monthly income needed for BaristaFIRE
  partTimeHours?: number; // Weekly hours for BaristaFIRE
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🔥 Venjulegt FIRE (RegularFIRE)         [Fræðast meira]│
│  Klassískt FIRE með þægilegum lífsstíl                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Marknestur þinn: 156.000.000 kr                       │
│  Mánaðarleg útgjöld: 520.000 kr                        │
│  Sparnaðarhlutfall: 35%                                │
│  Tími til marks: 16 ár (kemst þar 56 ára)              │
│                                                         │
│  ✅ Kjörið fyrir:                                       │
│  • Fólk með hóflega launum og útgjöldum                │
│  • Þá sem vilja halda venjulegum lífsstíl              │
│  • Miðaldra einstaklinga með stöðugar tekjur           │
│                                                         │
│  👍 Kostir:                                             │
│  • Raunsær markmiði fyrir flesta                       │
│  • Þægilegur lífsstíll viðhaldið                       │
│  • Sterkur stuðningur frá FIRE samfélaginu             │
│                                                         │
│  👎 Gallar:                                             │
│  • Krefst 15-20 ára sparnaðar                          │
│  • Ekki eins fljótur og LeanFIRE                       │
│                                                         │
│  [Velja þessa áætlun]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 ComparisonTable Component

**Responsibility**: Side-by-side comparison of all FIRE types

**Interface:**
```typescript
interface ComparisonTableProps {
  calculations: FIRECalculation[];
  selectedTier: ExpenseTier;
  onTierChange: (tier: ExpenseTier) => void;
  hasMul tipleTiers: boolean;
}
```

**Desktop Layout:**
```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Samanburður FIRE Tegunda                    [Lágmarks] [Þægilegt] [Lúxus]       │
├──────────────┬─────────────┬─────────────┬─────────────┬──────────┬──────────────┤
│ FIRE Tegund  │ Marknestur  │ Mánaðarlegt │ Sparnaðar-  │ Ár til   │ Erfiðleika-  │
│              │             │ útgjöld     │ hlutfall    │ marks    │ stig         │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────┼──────────────┤
│ 🔥 Sparsamt  │ 75M kr      │ 250k kr     │ 50%         │ 10 ár    │ ●●●● Hátt    │
│ FIRE         │             │             │             │          │              │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────┼──────────────┤
│ 🎯 Venjulegt │ 156M kr     │ 520k kr     │ 35%         │ 16 ár    │ ●●○○ Miðlungs│
│ FIRE         │             │             │             │          │              │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────┼──────────────┤
│ 🏖️ Sjálfvirkt│ 50M kr      │ 0 kr (nú)   │ 0% (nú)     │ Núna!    │ ●○○○ Lágt    │
│ FIRE         │ (í dag)     │ 520k (67)   │             │          │              │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────┼──────────────┤
│ ☕ Hálfstöðv. │ 90M kr      │ 520k kr     │ 25%         │ 12 ár +  │ ●●○○ Miðlungs│
│ FIRE         │ (60%)       │ (hluta)     │             │ ½-starf  │              │
├──────────────┼─────────────┼─────────────┼─────────────┼──────────┼──────────────┤
│ 💎 Lúxus     │ 300M kr     │ 1.000k kr   │ 55%         │ 24 ár    │ ●●●● Hátt    │
│ FIRE         │             │             │             │          │              │
└──────────────┴─────────────┴─────────────┴─────────────┴──────────┴──────────────┘
```

**Mobile Layout** (Stacked Cards):
Each FIRE type becomes a card with same data, vertically stacked.

---

### 3.4 TimelineVisualization Component

**Responsibility**: Visual timeline showing FIRE milestones

**Interface:**
```typescript
interface TimelineVisualizationProps {
  timeline: FIRETimeline;
  currentAge: number;
}

interface FIRETimeline {
  currentPosition: TimelineMilestone;
  milestones: TimelineMilestone[];
}

interface TimelineMilestone {
  fireType: string;
  age: number;
  year: number;
  nestEgg: number;
  label: string;
  achieved: boolean; // If already passed
  color: string;
}
```

**Desktop Visual (Horizontal):**
```
Núna                                                           67 ára
│                                                                │
●────────────────○────────────────○──────────────────○──────────●
40 ára       CoastFIRE       BaristaFIRE      RegularFIRE    FatFIRE
              45 ára            52 ára           56 ára        64 ára
           50M kr             90M kr          156M kr       300M kr

[You are here]
```

**Mobile Visual (Vertical):**
```
┌──────────────────────────┐
│  ● Núna (40 ára)         │
│  Net worth: 20M kr       │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  ○ CoastFIRE (45 ára)    │
│  Markmið: 50M kr         │
│  Ár eftir: 5             │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  ○ BaristaFIRE (52 ára)  │
│  Markmið: 90M kr         │
│  Ár eftir: 12            │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  ○ RegularFIRE (56 ára)  │
│  Markmið: 156M kr        │
│  Ár eftir: 16            │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  ○ FatFIRE (64 ára)      │
│  Markmið: 300M kr        │
│  Ár eftir: 24            │
└──────────────────────────┘
```

---

### 3.5 RecommendationCard Component

**Responsibility**: Display personalized FIRE type recommendation

**Interface:**
```typescript
interface RecommendationCardProps {
  recommendation: FIRERecommendation;
  rank: number; // 1 = primary, 2-3 = alternatives
  onSelect: () => void;
}

interface FIRERecommendation {
  fireType: string;
  score: number; // 0-100
  reasoning: string[];
  actionSteps: string[];
  timeline: string;
  obstacles: string[];
  confidence: 'low' | 'medium' | 'high';
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  🏆 Mælt með: Venjulegt FIRE                                │
│  Passa score: 87/100   Öryggi: Hátt                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🤔 Af hverju þetta passar þér:                             │
│  • Þú hefur raunsætt sparnaðarhlutfall (35%)               │
│  • Núverandi útgjöld passa við þægilegan lífsstíl          │
│  • Aldur þinn (40 ára) gefur nóg tíma án öfga              │
│  • Markmiðið er raunhæft innan 16 ára                      │
│                                                             │
│  ✅ Næstu skref:                                            │
│  1. Haltu áfram að spara 35% af tekjum                     │
│  2. Fjárfestu í víðtækri vísitölusjóði                     │
│  3. Endurskoðaðu áætlun árlega                             │
│  4. Forðastu að auka útgjöld umfram verðbólgu              │
│                                                             │
│  ⏱️ Tímalína:                                                │
│  Þú gætir náð RegularFIRE árið 2042 (56 ára)              │
│  Með CoastFIRE valkosti árið 2031 (45 ára)                │
│                                                             │
│  ⚠️ Hugsanlegar hindranir:                                  │
│  • Verðbólga gæti aukist umfram spár                       │
│  • Markaðsniðursveifla gæti tafið áætlun 2-4 ár           │
│  • Útgjalda skrið (lifestyle creep) er stór hætta         │
│                                                             │
│  [Velja þessa FIRE áætlun]                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * FIRE Type Explorer Types
 */

export type FIRETypeId =
  | 'leanfire'
  | 'regularfire'
  | 'coastfire'
  | 'baristafire'
  | 'fatfire';

export interface FIRETypeDefinition {
  id: FIRETypeId;
  nameIs: string; // Icelandic name
  nameEn: string; // English term
  icon: string; // Emoji
  tagline: string; // Short summary
  description: string; // Detailed explanation
  idealFor: string[]; // Who should consider
  pros: string[];
  cons: string[];
  color: string; // Theme color (for UI)
  examples: FIREExample[];
}

export interface FIREExample {
  scenario: string; // "Single person in Reykjavik"
  monthlyExpenses: number;
  targetNestEgg: number;
  timeframe: string;
}

export interface FIREAssumptions {
  withdrawalRate: number; // 0.04 = 4%
  realGrowthRate: number; // 0.06 = 6%
  includesTax: boolean; // Consider Icelandic taxes
  coastFireAge: number; // Target age for CoastFIRE
  baristaFICoverage: number; // 0.5-0.7 = 50-70%
}

export interface UserFinancialInputs {
  currentAge: number;
  currentNetWorth: number; // ISK
  monthlyIncome: number; // ISK
  monthlySavings: number; // ISK
  targetRetirementAge: number;
}

export interface FIRECalculation {
  fireType: FIRETypeId;

  // Core numbers
  targetNestEgg: number; // ISK
  monthlyExpenses: number; // ISK
  annualExpenses: number; // ISK

  // Progress metrics
  currentProgress: number; // Percentage (0-100)
  yearsToReach: number;
  reachedAge: number;
  reachedYear: number;

  // Savings requirements
  requiredSavingsRate: number; // Percentage
  monthlySavingsNeeded: number; // ISK

  // Effort & feasibility
  effortLevel: 'low' | 'medium' | 'high' | 'extreme';
  isFeasible: boolean;
  feasibilityScore: number; // 0-100

  // Warnings & notes
  warnings: string[];
  notes: string[];

  // Type-specific fields
  coastFIREData?: {
    amountNeededToday: number; // ISK
    canStopSavingAt: number; // Age
    yearsUntilCoastPoint: number;
  };

  baristaFIREData?: {
    partialFIAmount: number; // ISK (e.g., 60% of full)
    partTimeIncomeNeeded: number; // ISK monthly
    estimatedWeeklyHours: number;
    workYearsRequired: number;
  };
}

export interface FIRERecommendation {
  fireType: FIRETypeId;
  rank: number; // 1 = best recommendation
  score: number; // 0-100
  confidence: 'low' | 'medium' | 'high';

  reasoning: string[]; // Why this type fits
  actionSteps: string[]; // What to do next
  timeline: string; // Expected timeline
  obstacles: string[]; // Potential challenges

  alternativeConsiderations?: string; // If close to another type
}

export interface FIRETimeline {
  currentPosition: {
    age: number;
    year: number;
    netWorth: number;
    label: string;
  };

  milestones: TimelineMilestone[];

  completionEstimate: {
    optimistic: number; // Years
    realistic: number; // Years
    pessimistic: number; // Years
  };
}

export interface TimelineMilestone {
  fireType: FIRETypeId;
  age: number;
  year: number;
  nestEgg: number;
  label: string;
  achieved: boolean;
  color: string;
  description: string;
}

export interface FIRETypeResults {
  calculations: FIRECalculation[];
  recommendations: FIRERecommendation[];
  timeline: FIRETimeline;
  calculatedAt: Date;
  basedOnTier: ExpenseTier;
}

export interface FIRETypePreferences {
  selectedType: FIRETypeId | null;
  assumptions: FIREAssumptions;
  lastUpdated: Date;
}
```

### 4.2 FIRE Type Definitions Configuration

```typescript
export const FIRE_TYPE_DEFINITIONS: FIRETypeDefinition[] = [
  {
    id: 'leanfire',
    nameIs: 'Sparsamt FIRE',
    nameEn: 'LeanFIRE',
    icon: '🔥',
    tagline: 'Lágmarksútgjöld, hámarks sparnaður',
    description: 'LeanFIRE byggir á mjög lágum útgjöldum og aggressívum sparnaði. Þú lifir á lágmarks kostnaði til að ná fjármálafrelsi fyrr.',
    idealFor: [
      'Fólk með mjög lágar þarfir',
      'Þá sem eru tilbúnir til að lifa sparlega',
      'Ungt fólk sem vill losna við vinnu fljótt',
      'Fólk með sveigjanlegan lífsstíl',
    ],
    pros: [
      'Stysta leiðin til FIRE',
      'Krefst minni nest eggs',
      'Hámarks sveigjanleiki í starfi',
      'Lærir að lifa með minna',
    ],
    cons: [
      'Krefst mikilla fórna í lífsgæðum',
      'Lítil gríðarrými fyrir óvænt útgjöld',
      'Erfitt að viðhalda til lengdar',
      'Félagslegur þrýstingur',
    ],
    color: '#f59e0b', // Amber
    examples: [
      {
        scenario: 'Einhleypur í Akureyri',
        monthlyExpenses: 250000,
        targetNestEgg: 75000000,
        timeframe: '10-12 ár með 50% sparnaðarhlutfalli',
      },
    ],
  },
  {
    id: 'regularfire',
    nameIs: 'Venjulegt FIRE',
    nameEn: 'RegularFIRE',
    icon: '🎯',
    tagline: 'Klassískt FIRE með þægilegum lífsstíl',
    description: 'Venjulegt FIRE er hin hefðbundna leið: 25x árlegt útgjöld sparað, 4% úttektarregla. Þú heldur þægilegum lífsstíl bæði fyrir og eftir FIRE.',
    idealFor: [
      'Fólk með hóflegar launum og útgjöldum',
      'Þá sem vilja halda núverandi lífsstíl',
      'Miðaldra einstaklingar með stöðugar tekjur',
      'Fjölskyldufólk með venjulegar þarfir',
    ],
    pros: [
      'Raunsær markmið fyrir flesta',
      'Þægilegur lífsstíll viðhaldinn',
      'Sterkur stuðningur frá FIRE samfélagi',
      'Vel rannsakað og prófað',
    ],
    cons: [
      'Krefst 15-20 ára sparnaðar',
      'Ekki eins fljótt og LeanFIRE',
      'Krefst aga í sparnaði',
      'Markaðs áhætta',
    ],
    color: '#10b981', // Green
    examples: [
      {
        scenario: 'Hjón í Reykjavík',
        monthlyExpenses: 520000,
        targetNestEgg: 156000000,
        timeframe: '15-18 ár með 35% sparnaðarhlutfalli',
      },
    ],
  },
  {
    id: 'coastfire',
    nameIs: 'Sjálfvirkt FIRE',
    nameEn: 'CoastFIRE',
    icon: '🏖️',
    tagline: 'Sparaðu snemma, láttu vöxt klára verkið',
    description: 'CoastFIRE þýðir að spara nægjanlegt magn snemma í lífinu og síðan láta fjárfestingarnar vaxa án þess að bæta við. Þú getur hætt að spara og bara "cost" fram að eftirlaunum.',
    idealFor: [
      'Ungt fólk (<35 ára) með góðar tekjur',
      'Þá sem eru byrjaðir að spara snemma',
      'Fólk sem vill meiri sveigjanleika í dag',
      'Þá sem njóta vinnunnar sinnar',
    ],
    pros: [
      'Minni sparnaðarþrýstingur eftir "coast point"',
      'Sveigjanleiki í starfsvali',
      'Möguleiki á að taka minni launuð störf',
      'Samsettur vöxtur gerir verkið',
    ],
    cons: [
      'Krefst mikils sparnaðar fyrstu árin',
      'Ekki alveg FIRE (vinnur ennþá)',
      'Markaðsáhætta til lengri tíma',
      'Krefst þolinmæði',
    ],
    color: '#06b6d4', // Cyan
    examples: [
      {
        scenario: '30 ára með 30M sparað',
        monthlyExpenses: 520000,
        targetNestEgg: 156000000,
        timeframe: 'Láttu 30M vaxa til 67 ára = 156M við 6% vöxt',
      },
    ],
  },
  {
    id: 'baristafire',
    nameIs: 'Hálfstöðvar FIRE',
    nameEn: 'BaristaFIRE',
    icon: '☕',
    tagline: 'Hluta FI + hlutastarf = frelsi',
    description: 'BaristaFIRE er þegar þú ert hluta fjárhagslega sjálfstæður - þú hefur nest egg sem dekkar hluta af útgjöldum, og vinnur léttara starf til að dekka restina. Best of both worlds.',
    idealFor: [
      'Fólk sem nýtur vinnunnar en vill minni álag',
      'Þá sem vilja snemmbúin "hálfgert FIRE"',
      'Fólk með sveigjanleika í starfi',
      'Þá sem vilja félagslegan þátt vinnu',
    ],
    pros: [
      'Fljótari en full FIRE',
      'Heldur félagslegum tengslum',
      'Minni sparnaðarkrafur',
      'Sveigjanleiki í vinnutíma',
      'Viðbótartekjur fyrir óvænt',
    ],
    cons: [
      'Ekki alveg frjáls',
      'Þarf að finna rétta hlutastarfið',
      'Heilsubótatrygging frá vinnuveitanda?',
      'Tekjur gætu ekki haldið í við verðbólgu',
    ],
    color: '#8b5cf6', // Purple
    examples: [
      {
        scenario: 'Með 90M sparað (60% af fullu FIRE)',
        monthlyExpenses: 520000,
        targetNestEgg: 90000000,
        timeframe: '12 ár + hlutastarf fyrir ~200k/mán',
      },
    ],
  },
  {
    id: 'fatfire',
    nameIs: 'Lúxus FIRE',
    nameEn: 'FatFIRE',
    icon: '💎',
    tagline: 'Lifa vel, engar hömlur',
    description: 'FatFIRE er FIRE án þess að draga úr lífsgæðum. Þú ert fjárhagslega sjálfstæður með háum lífsstíl - ferðalög, veitingahús, áhugamál án takmarkana.',
    idealFor: [
      'Hálaunafólk með miklar tekjur',
      'Þá sem vilja ekki gefa eftir lífsstíl',
      'Fjölskyldur með börn í dýrum skólum',
      'Fólk með dýr áhugamál',
    ],
    pros: [
      'Engar hömlur á lífsstíl',
      'Mikill púði fyrir óvænt',
      'Getur stutt börn/fjölskyldu',
      'Ferðalög og áhugamál án áhyggna',
    ],
    cons: [
      'Krefst mjög hárra tekna',
      'Tekur langan tíma (20-30 ár)',
      'Mikil sparnaðarkrafa',
      'Lífsstílaskrið hætta',
    ],
    color: '#ec4899', // Pink
    examples: [
      {
        scenario: 'Hjón með háar tekjur í Reykjavík',
        monthlyExpenses: 1000000,
        targetNestEgg: 300000000,
        timeframe: '20-25 ár með 50%+ sparnaðarhlutfalli',
      },
    ],
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

  // FIRE Type Explorer
  fireTypePreferences: FIRETypePreferences | null;
  fireTypeResults: FIRETypeResults | null;

  // FIRE Type Actions
  updateFIREAssumptions: (assumptions: Partial<FIREAssumptions>) => void;
  selectFIREType: (type: FIRETypeId) => void;
  calculateFIRETypes: (inputs: UserFinancialInputs, tier: ExpenseTier) => void;

  // FIRE Type API (for other calculators)
  getSelectedFIREType: () => FIRETypeId | null;
  getFIRECalculation: (type: FIRETypeId) => FIRECalculation | null;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  fireTypePreferences?: {
    selectedType: FIRETypeId | null;
    assumptions: FIREAssumptions;
    lastUpdated: string; // ISO date string
  };
}
```

---

## 5. Calculation Logic

### 5.1 FIRE Number Calculator

**File**: `/src/lib/calculations/fireTypes.ts`

```typescript
/**
 * Calculate target nest egg for each FIRE type
 */
export const calculateFIRENumbers = (
  expenseBaseline: ExpenseBaseline,
  tier: ExpenseTier,
  assumptions: FIREAssumptions
): Record<FIRETypeId, number> => {
  const monthlyExpenses = getExpenseByTier(expenseBaseline, tier);
  const annualExpenses = monthlyExpenses * 12;
  const multiplier = 1 / assumptions.withdrawalRate; // 25x for 4%

  return {
    leanfire: annualExpenses * multiplier, // Using barebones expenses
    regularfire: annualExpenses * multiplier, // Using comfortable expenses
    fatfire: getExpenseByTier(expenseBaseline, 'deluxe') * 12 * multiplier,
    coastfire: calculateCoastFIRENumber(
      annualExpenses * multiplier,
      assumptions.coastFireAge,
      assumptions.realGrowthRate
    ),
    baristafire: (annualExpenses * multiplier) * assumptions.baristaFICoverage,
  };
};

/**
 * Calculate CoastFIRE number (amount needed today)
 */
export const calculateCoastFIRENumber = (
  targetFINumber: number,
  targetAge: number,
  currentAge: number,
  growthRate: number
): number => {
  const yearsToGrow = targetAge - currentAge;

  // Present value: FV / (1 + r)^n
  return targetFINumber / Math.pow(1 + growthRate, yearsToGrow);
};

/**
 * Calculate BaristaFIRE part-time income needed
 */
export const calculateBaristaFIREIncome = (
  monthlyExpenses: number,
  partialNestEgg: number,
  withdrawalRate: number
): {
  partTimeIncomeNeeded: number;
  estimatedWeeklyHours: number;
} => {
  const portfolioIncome = (partialNestEgg * withdrawalRate) / 12;
  const partTimeIncomeNeeded = monthlyExpenses - portfolioIncome;

  // Assume part-time wage is 60% of full-time hourly wage
  // And average full-time wage in Iceland is ~500k/month (2,500 kr/hour)
  const estimatedHourlyWage = 1500; // Conservative ISK/hour for part-time
  const monthlyHoursNeeded = partTimeIncomeNeeded / estimatedHourlyWage;
  const estimatedWeeklyHours = (monthlyHoursNeeded / 4.33); // Average weeks per month

  return {
    partTimeIncomeNeeded,
    estimatedWeeklyHours: Math.round(estimatedWeeklyHours),
  };
};
```

### 5.2 Timeline Calculator

```typescript
/**
 * Calculate years to reach each FIRE type
 */
export const calculateYearsToFIRE = (
  targetNestEgg: number,
  currentNetWorth: number,
  monthlySavings: number,
  growthRate: number
): number => {
  if (monthlySavings <= 0) return Infinity;
  if (currentNetWorth >= targetNestEgg) return 0;

  // Future value of series formula solving for n
  // FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
  // This requires iterative solution

  let years = 0;
  let balance = currentNetWorth;
  const monthlyRate = growthRate / 12;

  while (balance < targetNestEgg && years < 100) {
    balance = balance * (1 + monthlyRate) + monthlySavings;
    years += 1/12; // Increment by month
  }

  return Math.round(years * 10) / 10; // Round to 1 decimal
};

/**
 * Generate complete timeline with all milestones
 */
export const generateFIRETimeline = (
  calculations: FIRECalculation[],
  currentAge: number
): FIRETimeline => {
  const currentYear = new Date().getFullYear();

  const milestones: TimelineMilestone[] = calculations
    .filter(calc => calc.isFeasible && calc.yearsToReach < 50)
    .sort((a, b) => a.yearsToReach - b.yearsToReach)
    .map(calc => ({
      fireType: calc.fireType,
      age: calc.reachedAge,
      year: calc.reachedYear,
      nestEgg: calc.targetNestEgg,
      label: FIRE_TYPE_DEFINITIONS.find(d => d.id === calc.fireType)?.nameIs || '',
      achieved: calc.yearsToReach <= 0,
      color: FIRE_TYPE_DEFINITIONS.find(d => d.id === calc.fireType)?.color || '#gray',
      description: `Ná ${calc.targetNestEgg.toLocaleString('is-IS')} kr`,
    }));

  return {
    currentPosition: {
      age: currentAge,
      year: currentYear,
      netWorth: calculations[0]?.currentProgress || 0,
      label: 'Þú ert hér',
    },
    milestones,
    completionEstimate: {
      optimistic: milestones[0]?.age - currentAge || 0,
      realistic: milestones[Math.floor(milestones.length / 2)]?.age - currentAge || 0,
      pessimistic: milestones[milestones.length - 1]?.age - currentAge || 0,
    },
  };
};
```

### 5.3 Recommendation Engine

```typescript
/**
 * Generate personalized FIRE recommendations
 */
export const generateRecommendations = (
  calculations: FIRECalculation[],
  inputs: UserFinancialInputs
): FIRERecommendation[] => {
  const savingsRate = inputs.monthlySavings / inputs.monthlyIncome;
  const recommendations: FIRERecommendation[] = [];

  // Score each FIRE type
  calculations.forEach(calc => {
    let score = 50; // Base score
    const reasoning: string[] = [];
    const obstacles: string[] = [];

    // Feasibility
    if (!calc.isFeasible) {
      score -= 30;
      obstacles.push('Ekki raunhæft með núverandi tekjum');
    }

    // Time to reach
    if (calc.yearsToReach < 10) {
      score += 20;
      reasoning.push('Hægt að ná fljótt');
    } else if (calc.yearsToReach > 25) {
      score -= 15;
      obstacles.push('Tekur mjög langan tíma');
    }

    // Effort level
    if (calc.effortLevel === 'low') {
      score += 15;
      reasoning.push('Lítil fórn í lífsstíl');
    } else if (calc.effortLevel === 'extreme') {
      score -= 20;
      obstacles.push('Krefst mikillar fórnar');
    }

    // Age considerations
    if (calc.fireType === 'coastfire' && inputs.currentAge < 35) {
      score += 20;
      reasoning.push('Kjörið fyrir unga með samsetta vexti');
    } else if (calc.fireType === 'coastfire' && inputs.currentAge > 50) {
      score -= 15;
      obstacles.push('Minni tími fyrir samsetta vexti');
    }

    // Savings rate alignment
    const requiredSavingsRate = calc.requiredSavingsRate / 100;
    if (Math.abs(savingsRate - requiredSavingsRate) < 0.05) {
      score += 15;
      reasoning.push('Passar vel við núverandi sparnaðarhæfni');
    } else if (savingsRate < requiredSavingsRate - 0.15) {
      score -= 10;
      obstacles.push('Krefst meiri sparnaðar en þú ert að gera');
    }

    // Specific type bonuses
    switch (calc.fireType) {
      case 'regularfire':
        score += 10; // Most balanced option
        reasoning.push('Hefðbundin og vel þekkt leið');
        break;
      case 'baristafire':
        if (savingsRate < 0.4) {
          score += 15;
          reasoning.push('Góð leið ef þú nýtur vinnunnar');
        }
        break;
      case 'leanfire':
        if (calc.monthlyExpenses < 300000) {
          score += 10;
          reasoning.push('Þú ert þegar að lifa sparlega');
        }
        break;
    }

    // Confidence level
    let confidence: 'low' | 'medium' | 'high' = 'medium';
    if (score >= 75) confidence = 'high';
    if (score < 50) confidence = 'low';

    recommendations.push({
      fireType: calc.fireType,
      rank: 0, // Will be set after sorting
      score: Math.max(0, Math.min(100, score)),
      confidence,
      reasoning: reasoning.slice(0, 4), // Top 4 reasons
      actionSteps: generateActionSteps(calc),
      timeline: generateTimelineString(calc),
      obstacles: obstacles.slice(0, 3), // Top 3 obstacles
    });
  });

  // Sort by score and assign ranks
  recommendations.sort((a, b) => b.score - a.score);
  recommendations.forEach((rec, index) => {
    rec.rank = index + 1;
  });

  return recommendations.slice(0, 3); // Top 3 recommendations
};

const generateActionSteps = (calc: FIRECalculation): string[] => {
  const steps: string[] = [];

  steps.push(`Sparaðu ${calc.monthlySavingsNeeded.toLocaleString('is-IS')} kr á mánuði`);
  steps.push('Fjárfestu í víðtækri vísitölusjóði');
  steps.push('Endurskoðaðu áætlun árlega');

  if (calc.effortLevel === 'high') {
    steps.push('Leitaðu leiða til að auka tekjur eða minnka útgjöld');
  }

  if (calc.fireType === 'coastfire') {
    steps.push('Einbeittu þér að því að spara næstu 5-7 árin');
  }

  if (calc.fireType === 'baristafire' && calc.baristaFIREData) {
    steps.push(`Skipuleggðu hlutastarf fyrir ~${calc.baristaFIREData.estimatedWeeklyHours} klst/viku`);
  }

  return steps;
};

const generateTimelineString = (calc: FIRECalculation): string => {
  if (calc.yearsToReach <= 0) {
    return 'Þú hefur þegar náð þessu marki! 🎉';
  }

  const years = Math.floor(calc.yearsToReach);
  const months = Math.round((calc.yearsToReach - years) * 12);

  let str = `Áætlaður tími: ${years} ár`;
  if (months > 0) str += ` og ${months} mánuðir`;
  str += ` (${calc.reachedAge} ára árið ${calc.reachedYear})`;

  return str;
};
```

### 5.4 Main Orchestrator

```typescript
/**
 * Calculate all FIRE types
 */
export const calculateAllFIRETypes = (
  expenseBaseline: ExpenseBaseline,
  inputs: UserFinancialInputs,
  tier: ExpenseTier,
  assumptions: FIREAssumptions
): FIRETypeResults => {
  // Get expense for selected tier
  const monthlyExpenses = getExpenseByTier(expenseBaseline, tier);
  const annualExpenses = monthlyExpenses * 12;

  // Calculate FIRE numbers for each type
  const fireNumbers = calculateFIRENumbers(expenseBaseline, tier, assumptions);

  // Calculate years to reach each type
  const calculations: FIRECalculation[] = Object.entries(fireNumbers).map(
    ([fireType, targetNestEgg]) => {
      const yearsToReach = calculateYearsToFIRE(
        targetNestEgg,
        inputs.currentNetWorth,
        inputs.monthlySavings,
        assumptions.realGrowthRate
      );

      const reachedAge = inputs.currentAge + yearsToReach;
      const reachedYear = new Date().getFullYear() + Math.round(yearsToReach);

      const currentProgress = (inputs.currentNetWorth / targetNestEgg) * 100;
      const requiredSavingsRate = calculateRequiredSavingsRate(
        targetNestEgg,
        inputs.currentNetWorth,
        inputs.monthlyIncome,
        inputs.targetRetirementAge - inputs.currentAge,
        assumptions.realGrowthRate
      );

      const effortLevel = getEffortLevel(requiredSavingsRate);
      const isFeasible = requiredSavingsRate <= 70 && yearsToReach < 50;

      const warnings: string[] = [];
      if (requiredSavingsRate > 50) warnings.push('Mjög hátt sparnaðarhlutfall');
      if (yearsToReach > 30) warnings.push('Langur tími til marks');
      if (reachedAge > 70) warnings.push('Kemst að marki eftir dæmilegur eftirlaunaaldur');

      const baseCalculation: FIRECalculation = {
        fireType: fireType as FIRETypeId,
        targetNestEgg,
        monthlyExpenses,
        annualExpenses,
        currentProgress,
        yearsToReach,
        reachedAge,
        reachedYear,
        requiredSavingsRate,
        monthlySavingsNeeded: (inputs.monthlyIncome * requiredSavingsRate) / 100,
        effortLevel,
        isFeasible,
        feasibilityScore: calculateFeasibilityScore(requiredSavingsRate, yearsToReach),
        warnings,
        notes: [],
      };

      // Add type-specific data
      if (fireType === 'coastfire') {
        const coastPoint = calculateCoastFIRENumber(
          targetNestEgg,
          inputs.targetRetirementAge,
          inputs.currentAge,
          assumptions.realGrowthRate
        );

        const yearsUntilCoastPoint = calculateYearsToFIRE(
          coastPoint,
          inputs.currentNetWorth,
          inputs.monthlySavings,
          assumptions.realGrowthRate
        );

        baseCalculation.coastFIREData = {
          amountNeededToday: coastPoint,
          canStopSavingAt: inputs.currentAge + yearsUntilCoastPoint,
          yearsUntilCoastPoint,
        };
      }

      if (fireType === 'baristafire') {
        const baristaIncome = calculateBaristaFIREIncome(
          monthlyExpenses,
          targetNestEgg,
          assumptions.withdrawalRate
        );

        baseCalculation.baristaFIREData = {
          partialFIAmount: targetNestEgg,
          partTimeIncomeNeeded: baristaIncome.partTimeIncomeNeeded,
          estimatedWeeklyHours: baristaIncome.estimatedWeeklyHours,
          workYearsRequired: Math.ceil(yearsToReach),
        };
      }

      return baseCalculation;
    }
  );

  // Generate recommendations
  const recommendations = generateRecommendations(calculations, inputs);

  // Generate timeline
  const timeline = generateFIRETimeline(calculations, inputs.currentAge);

  return {
    calculations,
    recommendations,
    timeline,
    calculatedAt: new Date(),
    basedOnTier: tier,
  };
};

const getEffortLevel = (savingsRate: number): 'low' | 'medium' | 'high' | 'extreme' => {
  if (savingsRate < 20) return 'low';
  if (savingsRate < 40) return 'medium';
  if (savingsRate < 60) return 'high';
  return 'extreme';
};

const calculateFeasibilityScore = (savingsRate: number, yearsToReach: number): number => {
  let score = 100;

  // Penalize high savings rates
  if (savingsRate > 50) score -= (savingsRate - 50) * 2;

  // Penalize long timelines
  if (yearsToReach > 20) score -= (yearsToReach - 20);

  return Math.max(0, Math.min(100, score));
};

const calculateRequiredSavingsRate = (
  targetNestEgg: number,
  currentNetWorth: number,
  monthlyIncome: number,
  yearsAvailable: number,
  growthRate: number
): number => {
  // Iterative approach to find required savings rate
  // PMT = (FV - PV(1+r)^n) / [((1+r)^n - 1) / r]

  const monthlyRate = growthRate / 12;
  const months = yearsAvailable * 12;

  const futureValueOfCurrent = currentNetWorth * Math.pow(1 + monthlyRate, months);
  const remainingNeeded = targetNestEgg - futureValueOfCurrent;

  if (remainingNeeded <= 0) return 0; // Already have enough

  // Calculate monthly payment needed
  const monthlyPayment = remainingNeeded / (
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  );

  const savingsRate = (monthlyPayment / monthlyIncome) * 100;
  return Math.round(savingsRate * 10) / 10;
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Expense Baseline Tool

```typescript
// In FIRETypeExplorer component
const { expenseBaseline, hasExpenseBaseline } = useCalculator();

// Check if baseline exists
if (!hasExpenseBaseline()) {
  return (
    <BaselinePrompt
      message="FIRE Type Explorer krefst útgjaldagrunns til að reikna persónulegar tölur"
      linkUrl="/utgjaldareiknivel"
      buttonText="Setja upp útgjaldagrunn"
    />
  );
}

// Use baseline data for calculations
const tier = selectedTier;
const monthlyExpenses = getExpenseByTier(expenseBaseline, tier);
```

### 6.2 Integration with Other Calculators

```typescript
// FI Number Calculator can link to FIRE Explorer
<Alert variant="info">
  <p>Viltu sjá mismunandi FIRE leiðir til að ná þessari tölu?</p>
  <Button as="a" href="/fire-leidarvísir">
    Kanna FIRE Tegundir
  </Button>
</Alert>

// Savings Rate Calculator can show FIRE type progress
const { fireTypePreferences } = useCalculator();
if (fireTypePreferences?.selectedType) {
  <div>
    Þú ert að stefna að: {FIRE_TYPE_DEFINITIONS.find(d => d.id === fireTypePreferences.selectedType)?.nameIs}
  </div>
}
```

### 6.3 Savings Preference

```typescript
// User can save their preferred FIRE type
const selectFIREType = useCallback((type: FIRETypeId) => {
  setFIRETypePreferences(prev => ({
    ...prev,
    selectedType: type,
    lastUpdated: new Date(),
  }));

  // Emit event for other calculators
  window.dispatchEvent(new CustomEvent('fireTypeSelected', {
    detail: { type }
  }));
}, []);
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateUserInputs = (inputs: UserFinancialInputs): ValidationResult => {
  const errors: string[] = [];

  if (inputs.currentAge < 18 || inputs.currentAge > 100) {
    errors.push('Aldur verður að vera á milli 18 og 100 ára');
  }

  if (inputs.targetRetirementAge <= inputs.currentAge) {
    errors.push('Eftirlaunaaldur verður að vera hærri en núverandi aldur');
  }

  if (inputs.currentNetWorth < 0) {
    errors.push('Hrein eign getur ekki verið neikvæð');
  }

  if (inputs.monthlyIncome <= 0) {
    errors.push('Mánaðarlegar tekjur verða að vera jákvæðar');
  }

  if (inputs.monthlySavings < 0) {
    errors.push('Mánaðarlegur sparnaður getur ekki verið neikvæður');
  }

  if (inputs.monthlySavings > inputs.monthlyIncome) {
    errors.push('Sparnaður getur ekki verið meiri en tekjur');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

### 7.2 Calculation Edge Cases

```typescript
// Handle extreme scenarios
if (yearsToReach === Infinity || yearsToReach > 100) {
  return {
    ...calculation,
    isFeasible: false,
    warnings: ['Ekki raunhæft að ná þessu marki með núverandi forsendum'],
  };
}

// Handle already achieved
if (currentNetWorth >= targetNestEgg) {
  return {
    ...calculation,
    yearsToReach: 0,
    reachedAge: currentAge,
    currentProgress: 100,
    notes: ['Til hamingju! Þú hefur þegar náð þessu marki.'],
  };
}

// Handle negative or zero savings
if (monthlySavings <= 0) {
  return {
    ...calculation,
    isFeasible: false,
    warnings: ['Enginn sparnaður - getur ekki náð FIRE án sparnaðar'],
  };
}
```

---

## 8. User Interface Design

### 8.1 Color Scheme

```typescript
const FIRE_TYPE_COLORS = {
  leanfire: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
  regularfire: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-500',
  },
  coastfire: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-300',
    text: 'text-cyan-800',
    accent: 'bg-cyan-500',
  },
  baristafire: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    accent: 'bg-purple-500',
  },
  fatfire: {
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    text: 'text-pink-800',
    accent: 'bg-pink-500',
  },
};
```

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- FIRE cards stacked vertically
- Comparison table converts to cards
- Timeline vertical
- Inputs full-width

**Tablet (640px-1024px):**
- FIRE cards 2-column grid
- Comparison table scrollable horizontally
- Timeline horizontal (scrollable)

**Desktop (>1024px):**
- FIRE cards 3-column grid (or 5-column for all types)
- Full comparison table visible
- Timeline full horizontal

---

## 9. Testing Strategy

### 9.1 Unit Testing

```typescript
// fireTypes.test.ts
describe('calculateFIRENumbers', () => {
  it('calculates correct nest eggs for each type', () => {
    const result = calculateFIRENumbers(mockBaseline, 'comfortable', mockAssumptions);

    expect(result.regularfire).toBe(156000000); // 520k × 12 × 25
    expect(result.leanfire).toBeLessThan(result.regularfire);
    expect(result.fatfire).toBeGreaterThan(result.regularfire);
  });
});

describe('calculateYearsToFIRE', () => {
  it('calculates years correctly', () => {
    const years = calculateYearsToFIRE(156000000, 20000000, 200000, 0.06);
    expect(years).toBeGreaterThan(10);
    expect(years).toBeLessThan(30);
  });

  it('returns 0 if already achieved', () => {
    const years = calculateYearsToFIRE(100000000, 150000000, 100000, 0.06);
    expect(years).toBe(0);
  });
});

describe('generateRecommendations', () => {
  it('ranks FIRE types by feasibility', () => {
    const recommendations = generateRecommendations(mockCalculations, mockInputs);

    expect(recommendations[0].rank).toBe(1);
    expect(recommendations[0].score).toBeGreaterThan(recommendations[1].score);
  });
});
```

### 9.2 Integration Testing

```typescript
describe('FIRETypeExplorer Integration', () => {
  it('calculates all types when baseline exists', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up baseline
    act(() => {
      result.current.updateExpenseBaseline(mockBaseline);
    });

    // Calculate FIRE types
    act(() => {
      result.current.calculateFIRETypes(mockInputs, 'comfortable');
    });

    expect(result.current.fireTypeResults).not.toBeNull();
    expect(result.current.fireTypeResults?.calculations).toHaveLength(5);
  });
});
```

---

## 10. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Understand FIRE Types | FIRETypeCard, FIRE_TYPE_DEFINITIONS | Detailed cards with definitions |
| **US-2**: Compare Side-by-Side | ComparisonTable | Desktop table, mobile cards |
| **US-3**: Toggle Scenarios | TierToggle, selectedTier state | Instant recalculation on tier change |
| **US-4**: Get Recommendations | RecommendationCard, generateRecommendations() | Scoring engine ranks types |
| **US-5**: Visualize Timeline | TimelineVisualization | Horizontal/vertical milestone display |
| **US-6**: Understand Trade-offs | ComparisonTable effort indicators | Effort level per type |
| **FR-1**: FIRE Definitions | FIRE_TYPE_DEFINITIONS | 5 types with complete info |
| **FR-2**: Calculations | calculateFIRENumbers(), calculate*() functions | All formulas implemented |
| **FR-3**: Comparison Display | ComparisonTable, ComparisonCards | Responsive comparison |
| **FR-4**: Recommendations | generateRecommendations() | Scoring with reasoning |
| **FR-5**: Timeline Visual | TimelineVisualization, generateFIRETimeline() | Interactive timeline |
| **FR-6**: Educational Content | EducationalContentSection | Collapsible explanations |
| **FR-7**: Integration | useCalculator(), expense baseline checks | Context integration |

---

## 11. Implementation Risks and Mitigations

### Risk 1: Complex Calculation Logic

**Risk**: Financial calculations are complex and error-prone.

**Mitigation**:
- Extensive unit tests for all calculation functions
- Reference established FIRE community calculators
- Peer review of formulas
- Clear documentation of assumptions

### Risk 2: User Confusion About FIRE Types

**Risk**: Users may not understand differences between types.

**Mitigation**:
- Clear, jargon-free explanations
- Visual icons and color coding
- Real-world examples in Icelandic context
- Progressive disclosure (details on demand)

### Risk 3: Unrealistic Expectations

**Risk**: Users may set unrealistic FIRE goals.

**Mitigation**:
- Effort level indicators
- Feasibility warnings
- Conservative default assumptions
- Clear disclaimers about projections

### Risk 4: Missing Input Data

**Risk**: Users may not have all required financial data.

**Mitigation**:
- Graceful degradation (show examples if no data)
- Clear prompts for missing inputs
- Integration with other calculators to auto-fill
- Save draft inputs across sessions

---

## 12. Design Review Checklist

### Completeness
- [x] All functional requirements addressed
- [x] All non-functional requirements addressed
- [x] Component hierarchy defined
- [x] Data models specified
- [x] Calculation logic detailed
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Educational content planned

### Feasibility
- [x] Uses existing technology stack
- [x] Integrates with existing CalculatorContext
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Accessibility compliant
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] Expense baseline integration designed
- [x] Other calculator integration planned
- [x] FIRE type selection saveable
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
