# Design: Savings Report (Sparnaðarskýrsla)

## Document Information

- **Feature Name**: Savings Report (Sparnaðarskýrsla)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development
- **Requirements Document**: requirements-savings-report.md

---

## 1. System Overview

### 1.1 Purpose

The Savings Report is a savings tracking tool that complements the Current Expense Report. It enables users to track their savings across multiple categories, including current balances and monthly contributions. This data integrates with other calculators for FI planning, savings rate calculations, and life energy visualization.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Mirror Current Expense Report Pattern**: Consistent UX with expense tracking
2. **Category-Centric**: Organize savings by purpose/category
3. **Dual Tracking**: Track both balances (what you have) and contributions (what you add)
4. **Integration-Ready**: Exposes API for FI calculators
5. **Privacy-First**: All data stored locally
6. **Icelandic-First**: Local terminology and ISK currency
7. **Life Energy Aware**: Show savings in work hours when AWH available

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Dashboard View   │  │ Editor View      │  │ Summary Display      │  │
│  │ (Overview)       │  │ (Edit Categories)│  │ (Totals/Charts)      │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  savingsReport: SavingsReport                                    │   │
│  │    - categories: SavingsCategory[]                               │   │
│  │    - lastUpdated: Date                                           │   │
│  │    - version: number                                             │   │
│  │  savingsReportResults: SavingsReportResults                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration API:                                                │   │
│  │    - getSavingsReport(): SavingsReport                           │   │
│  │    - getTotalSavings(): number                                   │   │
│  │    - getTotalMonthlyContribution(): number                       │   │
│  │    - getSavingsRate(): number | null                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Total Calculator  │  │ Savings Rate      │  │ Life Energy       │  │
│  │ (balances/contri) │  │ Calculator        │  │ Calculator        │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐                          │
│  │ LocalStorage      │  │ Export/Import     │                          │
│  │ Manager           │  │ Functions         │                          │
│  └───────────────────┘  └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
SavingsReportCalculator (Page Component)
├── EducationalIntro (Collapsible)
│   ├── WhatIsSavingsReport
│   ├── HowToUse
│   └── PrivacyNote
│
├── AWHWarning (if no actual hourly wage)
│
├── ViewModeToggle
│   ├── DashboardButton
│   └── EditorButton
│
├── SavingsDashboard (when viewMode === 'dashboard')
│   ├── QuickStats
│   │   ├── TotalSavingsCard
│   │   ├── MonthlyContributionCard
│   │   ├── SavingsRateCard (if income available)
│   │   └── LifeEnergyCard (if AWH available)
│   │
│   ├── CategoryBreakdownChart
│   │   └── PieChart (balance distribution)
│   │
│   ├── SavingsProgressList
│   │   └── CategoryProgressCard (for each with target)
│   │       ├── ProgressBar
│   │       ├── CurrentAmount
│   │       └── RemainingAmount
│   │
│   └── SavingsRateInsights
│       ├── RateDisplay
│       ├── FITimelineEstimate
│       └── ContextMessage
│
├── SavingsEditor (when viewMode === 'editor')
│   ├── CategoryAccordion (for each category)
│   │   ├── CategoryHeader
│   │   │   ├── Icon
│   │   │   ├── Name
│   │   │   ├── Balance Display
│   │   │   └── Monthly Display
│   │   │
│   │   └── CategoryDetails (expanded)
│   │       ├── BalanceInput
│   │       │   ├── CurrencyInput
│   │       │   └── LifeEnergyDisplay
│   │       ├── ContributionInput
│   │       │   ├── CurrencyInput
│   │       │   └── LifeEnergyDisplay
│   │       ├── TargetInput (optional)
│   │       │   ├── CurrencyInput
│   │       │   └── ProgressDisplay
│   │       └── NotesInput (optional)
│   │
│   ├── HiddenCategoriesSection
│   │   └── ShowHiddenButton
│   │
│   └── ExportImportButtons
│
└── index.ts (barrel export)
```

### 2.3 Data Flow

**Input Flow (Editor Mode):**
```
Category Input → Validation → CalculatorContext → Debounced LocalStorage
                                    ↓
                           Recalculate Results → UI Update
```

**Integration Flow:**
```
FI Calculator Load → useCalculator() → getSavingsReport()
                                            ↓
                              Check if savings data exists
                                            ↓
                              ┌─────────────┴─────────────┐
                              ↓                           ↓
                        Data Found                   No Data
                              ↓                           ↓
                    Use in FI calculations      Prompt to set up savings
```

---

## 3. Component Design

### 3.1 SavingsReportCalculator (Main Component)

**Responsibility**: Page-level container and view mode coordinator

**Interface:**
```typescript
interface SavingsReportCalculatorProps {
  // No props - gets data from CalculatorContext
}

type ViewMode = 'dashboard' | 'editor';

// View mode determined by:
// - 'dashboard' if savingsReport has data
// - 'editor' if no data or user clicks edit
```

**Key Features:**
- Detects if user has existing savings (show Dashboard) or not (show Editor)
- Provides toggle between modes
- Shows AWH warning if not calculated
- Educational intro section (collapsible)

---

### 3.2 SavingsDashboard Component

**Responsibility**: Visual summary of savings data

**Interface:**
```typescript
interface SavingsDashboardProps {
  results: SavingsReportResults;
  actualHourlyWage: number | null;
  monthlyNetIncome: number | null;
  onToggleToEditor: () => void;
}
```

**Sub-components:**

1. **QuickStats**: Four stat cards showing totals
2. **CategoryBreakdownChart**: Pie chart of balance distribution
3. **SavingsProgressList**: Progress bars for categories with targets
4. **SavingsRateInsights**: Contextual savings rate information

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Sparnaðarskýrsla - Yfirlit                  [Breyta →]    │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐│
│  │ Samtals   │  │ Mánaðar-  │  │ Sparnaðar-│  │ Lífsorka ││
│  │ sparnaður │  │ framlag   │  │ hlutfall  │  │ (klst)   ││
│  │ 12.5M kr  │  │ 350.000 kr│  │ 28%       │  │ 5.000 klst│
│  └───────────┘  └───────────┘  └───────────┘  └──────────┘│
├─────────────────────────────────────────────────────────────┤
│  Skipting sparnaðar (eftir stöðu)                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │        [Pie Chart - Balance Distribution]            │  │
│  │   🛡️ Neyðarsjóður: 15%                              │  │
│  │   📈 Fjárfestingar: 45%                              │  │
│  │   🏖️ Lífeyrissjóður: 30%                            │  │
│  │   📦 Annað: 10%                                      │  │
│  └─────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Framvinda markmiða                                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 🛡️ Neyðarsjóður                    1.5M / 2M (75%) │  │
│  │ ████████████████████░░░░░░                           │  │
│  │ Á eftir: 500.000 kr (200 klst)                      │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📅 Sumarfrí                         250k / 500k (50%)│  │
│  │ ████████████░░░░░░░░░░░░░░░░                         │  │
│  │ Á eftir: 250.000 kr (100 klst)                      │  │
│  └─────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Sparnaðarhlutfall: 28%                                     │
│  "Þú sparar um það bil 3,4 mánuði af vinnu á ári.          │
│   Með þessum hraða gætirðu náð fjárhagsfrelsi á 20 árum."  │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 SavingsEditor Component

**Responsibility**: Category-by-category editing interface

**Interface:**
```typescript
interface SavingsEditorProps {
  className?: string;
}
```

**Features:**
- Accordion interface for all savings categories
- Track expanded/collapsed state per category
- Display category totals in headers
- Hide/show categories
- Export/import functionality

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Sparnaðarflokkar                                           │
│  Smelltu á flokk til að bæta við eða breyta sparnaði        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 🛡️ Neyðarsjóður                      1.500.000 kr ▼│  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │   Núverandi staða                                   │  │
│  │   ┌─────────────────────────────────────┐          │  │
│  │   │ 1.500.000                        kr │  600 klst│  │
│  │   └─────────────────────────────────────┘          │  │
│  │                                                     │  │
│  │   Mánaðarleg framlög                               │  │
│  │   ┌─────────────────────────────────────┐          │  │
│  │   │ 50.000                           kr │  20 klst │  │
│  │   └─────────────────────────────────────┘          │  │
│  │                                                     │  │
│  │   Markmið (valfrjálst)                             │  │
│  │   ┌─────────────────────────────────────┐          │  │
│  │   │ 2.000.000                        kr │          │  │
│  │   └─────────────────────────────────────┘          │  │
│  │   Framvinda: 75% (500.000 kr eftir)                │  │
│  │                                                     │  │
│  │   Athugasemdir (valfrjálst)                        │  │
│  │   ┌─────────────────────────────────────┐          │  │
│  │   │ 6 mánaða neyðarsjóður miðað við...  │          │  │
│  │   └─────────────────────────────────────┘          │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 📈 Fjárfestingar                      5.600.000 kr ▶│  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ... (more categories)                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.4 CategoryAccordion Component

**Responsibility**: Single savings category with expandable details

**Interface:**
```typescript
interface CategoryAccordionProps {
  category: SavingsCategory;
  isExpanded: boolean;
  onToggle: () => void;
  actualHourlyWage: number | null;
  onChange: (updates: Partial<SavingsCategoryData>) => void;
}
```

**Features:**
- Accordion header with icon, name, balance total
- Expandable content with input fields
- Life energy display when AWH available
- Progress display when target set

---

### 3.5 QuickStats Component

**Responsibility**: Summary stat cards at top of dashboard

**Interface:**
```typescript
interface QuickStatsProps {
  results: SavingsReportResults;
  actualHourlyWage: number | null;
  monthlyNetIncome: number | null;
}
```

**Cards:**
1. Total Savings (Samtals sparnaður)
2. Monthly Contribution (Mánaðarleg framlög)
3. Savings Rate (Sparnaðarhlutfall) - only if income available
4. Life Energy (Lífsorka) - only if AWH available

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Savings Report Types
 * File: /src/types/savingsReport.ts
 */

/**
 * Configuration for a savings category
 */
export interface SavingsCategoryConfig {
  id: string;                    // Unique identifier
  name: string;                  // Icelandic display name
  icon: string;                  // Emoji icon
  description: string;           // Icelandic description/help text
  order: number;                 // Display order
}

/**
 * Data for a single savings category
 */
export interface SavingsCategoryData {
  balance: number;               // Current balance in ISK
  monthlyContribution: number;   // Monthly contribution in ISK
  targetAmount?: number;         // Optional target amount in ISK
  notes?: string;                // Optional user notes
}

/**
 * Full savings category (config + data)
 */
export interface SavingsCategory extends SavingsCategoryConfig {
  data: SavingsCategoryData;
  isHidden: boolean;             // Hidden from display
}

/**
 * Complete savings report
 */
export interface SavingsReport {
  categories: SavingsCategory[];
  lastUpdated: Date;
  version: number;               // Schema version for migrations
}

/**
 * Category breakdown for display
 */
export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  balance: number;
  monthlyContribution: number;
  balancePercentage: number;     // Percentage of total balance
  contributionPercentage: number; // Percentage of total contribution
  lifeEnergyBalance: number | null;
  lifeEnergyContribution: number | null;
  targetAmount?: number;
  progressPercentage?: number;
  remainingToTarget?: number;
}

/**
 * Savings rate context message
 */
export interface SavingsRateContext {
  rate: number;                  // Percentage 0-100
  level: 'low' | 'average' | 'good' | 'great' | 'excellent';
  messageIs: string;             // Icelandic message
  fiEstimateYears: number | null; // Rough FI estimate
}

/**
 * Complete calculation results
 */
export interface SavingsReportResults {
  totalBalance: number;          // Sum of all balances
  totalMonthlyContribution: number; // Sum of all contributions
  totalAnnualContribution: number;  // Monthly * 12
  savingsRate: number | null;    // Percentage if income available
  savingsRateContext: SavingsRateContext | null;
  categoryBreakdown: CategoryBreakdown[];
  lifeEnergy: {
    totalBalanceHours: number;
    totalMonthlyHours: number;
    totalAnnualHours: number;
  } | null;
  categoriesWithTargets: number; // Count of categories with targets
  averageProgress: number | null; // Average progress across targets
}
```

### 4.2 Default Categories Configuration

```typescript
/**
 * File: /src/lib/constants/savingsReport.ts
 */

export const SAVINGS_REPORT_VERSION = 1;

export const DEFAULT_SAVINGS_CATEGORIES: SavingsCategoryConfig[] = [
  {
    id: 'neydarsjodur',
    name: 'Neyðarsjóður',
    icon: '🛡️',
    description: '3-6 mánaða útgjöld í varasjóði fyrir óvænt atvik',
    order: 1,
  },
  {
    id: 'skammtima',
    name: 'Skammtímasparnaður',
    icon: '📅',
    description: 'Markmið innan 2 ára - frí, bíll, húsgögn, o.fl.',
    order: 2,
  },
  {
    id: 'langtima',
    name: 'Langtímasparnaður',
    icon: '🎯',
    description: 'Markmið yfir 2 ár - útborgun, menntun, stærri kaup',
    order: 3,
  },
  {
    id: 'fjarfestingar',
    name: 'Fjárfestingar',
    icon: '📈',
    description: 'Hlutabréf, sjóðir, ETF, og aðrar fjárfestingar',
    order: 4,
  },
  {
    id: 'lifeyrissjodur',
    name: 'Lífeyrissjóður',
    icon: '🏖️',
    description: 'Lífeyrissjóðir, þ.m.t. mótframlag vinnuveitanda',
    order: 5,
  },
  {
    id: 'serstakur',
    name: 'Sérstakur sjóður',
    icon: '⭐',
    description: 'Sérsniðið markmið sem þú skilgreinir sjálf/ur',
    order: 6,
  },
  {
    id: 'annad',
    name: 'Annað',
    icon: '📦',
    description: 'Ýmis sparnaður sem fellur ekki undir aðra flokka',
    order: 7,
  },
];

/**
 * Category colors for charts and UI
 */
export const SAVINGS_CATEGORY_COLORS: Record<string, string> = {
  neydarsjodur: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  skammtima: 'text-blue-600 bg-blue-50 border-blue-200',
  langtima: 'text-purple-600 bg-purple-50 border-purple-200',
  fjarfestingar: 'text-amber-600 bg-amber-50 border-amber-200',
  lifeyrissjodur: 'text-teal-600 bg-teal-50 border-teal-200',
  serstakur: 'text-pink-600 bg-pink-50 border-pink-200',
  annad: 'text-gray-600 bg-gray-50 border-gray-200',
};

/**
 * Chart colors for pie/donut charts
 */
export const SAVINGS_CHART_COLORS = [
  '#10b981', // emerald-500 - neydarsjodur
  '#3b82f6', // blue-500 - skammtima
  '#8b5cf6', // purple-500 - langtima
  '#f59e0b', // amber-500 - fjarfestingar
  '#14b8a6', // teal-500 - lifeyrissjodur
  '#ec4899', // pink-500 - serstakur
  '#6b7280', // gray-500 - annad
];

/**
 * Savings rate thresholds and messages
 */
export const SAVINGS_RATE_THRESHOLDS = {
  low: { max: 10, level: 'low' as const },
  average: { max: 20, level: 'average' as const },
  good: { max: 30, level: 'good' as const },
  great: { max: 50, level: 'great' as const },
  excellent: { max: 100, level: 'excellent' as const },
};

export const SAVINGS_RATE_MESSAGES: Record<string, { messageIs: string; fiYears: number | null }> = {
  low: {
    messageIs: 'Lágmarks sparnaður - íhugaðu að auka sparnaðinn til að ná fjárhagsfrelsi fyrr.',
    fiYears: null,
  },
  average: {
    messageIs: 'Góður grunnur - þetta er í kringum meðaltal Íslendinga.',
    fiYears: 40,
  },
  good: {
    messageIs: 'Mjög gott! Þú ert á góðri leið til fjárhagsfrelsis.',
    fiYears: 25,
  },
  great: {
    messageIs: 'Framúrskarandi! Með þessum hraða gætirðu náð FI á 15-20 árum.',
    fiYears: 17,
  },
  excellent: {
    messageIs: 'Ótrúlegt! Þú ert á hraðri leið til fjárhagsfrelsis, mögulega innan 10-15 ára.',
    fiYears: 12,
  },
};
```

### 4.3 CalculatorContext Integration

```typescript
/**
 * Add to existing CalculatorContextType
 */
interface CalculatorContextType {
  // ... existing properties

  // Savings Report
  savingsReport: SavingsReport | null;
  savingsReportResults: SavingsReportResults | null;

  // Savings Report Actions
  updateSavingsReport: (report: Partial<SavingsReport>) => void;
  updateSavingsCategory: (categoryId: string, data: Partial<SavingsCategoryData>) => void;
  toggleSavingsCategoryVisibility: (categoryId: string) => void;
  clearSavingsReport: () => void;

  // Savings Report API (for other calculators)
  getSavingsReport: () => SavingsReport | null;
  getTotalSavings: () => number;
  getTotalMonthlyContribution: () => number;
  getSavingsRate: () => number | null;
  hasSavingsReport: () => boolean;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  savingsReport?: {
    categories: StoredSavingsCategory[];
    lastUpdated: string; // ISO date string
    version: number;
  };
}

interface StoredSavingsCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  data: SavingsCategoryData;
  isHidden: boolean;
}
```

---

## 5. Calculation Logic

### 5.1 Total Calculations

**File**: `/src/lib/calculations/savingsReport.ts`

```typescript
/**
 * Calculate total savings (sum of all balances)
 */
export function calculateTotalSavings(categories: SavingsCategory[]): number {
  return categories
    .filter(c => !c.isHidden)
    .reduce((sum, c) => sum + c.data.balance, 0);
}

/**
 * Calculate total monthly contribution
 */
export function calculateTotalMonthlyContribution(categories: SavingsCategory[]): number {
  return categories
    .filter(c => !c.isHidden)
    .reduce((sum, c) => sum + c.data.monthlyContribution, 0);
}

/**
 * Calculate annual contribution
 */
export function calculateAnnualContribution(monthlyContribution: number): number {
  return monthlyContribution * 12;
}
```

### 5.2 Savings Rate Calculator

```typescript
/**
 * Calculate savings rate as percentage of net income
 * @param monthlyContribution Total monthly savings
 * @param monthlyNetIncome Net income after taxes
 * @returns Percentage 0-100 or null if no income
 */
export function calculateSavingsRate(
  monthlyContribution: number,
  monthlyNetIncome: number | null
): number | null {
  if (!monthlyNetIncome || monthlyNetIncome <= 0) return null;
  return (monthlyContribution / monthlyNetIncome) * 100;
}

/**
 * Get savings rate context with message and FI estimate
 */
export function getSavingsRateContext(rate: number | null): SavingsRateContext | null {
  if (rate === null) return null;

  let level: SavingsRateContext['level'];
  if (rate < SAVINGS_RATE_THRESHOLDS.low.max) {
    level = 'low';
  } else if (rate < SAVINGS_RATE_THRESHOLDS.average.max) {
    level = 'average';
  } else if (rate < SAVINGS_RATE_THRESHOLDS.good.max) {
    level = 'good';
  } else if (rate < SAVINGS_RATE_THRESHOLDS.great.max) {
    level = 'great';
  } else {
    level = 'excellent';
  }

  const message = SAVINGS_RATE_MESSAGES[level];

  return {
    rate,
    level,
    messageIs: message.messageIs,
    fiEstimateYears: message.fiYears,
  };
}
```

### 5.3 Life Energy Calculator

```typescript
/**
 * Calculate life energy (work hours) for savings
 */
export function calculateSavingsLifeEnergy(
  totalBalance: number,
  totalMonthlyContribution: number,
  actualHourlyWage: number | null
): SavingsReportResults['lifeEnergy'] | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  return {
    totalBalanceHours: totalBalance / actualHourlyWage,
    totalMonthlyHours: totalMonthlyContribution / actualHourlyWage,
    totalAnnualHours: (totalMonthlyContribution * 12) / actualHourlyWage,
  };
}
```

### 5.4 Category Breakdown Calculator

```typescript
/**
 * Calculate breakdown per category
 */
export function calculateCategoryBreakdown(
  categories: SavingsCategory[],
  totalBalance: number,
  totalContribution: number,
  actualHourlyWage: number | null
): CategoryBreakdown[] {
  const activeCategories = categories.filter(c => !c.isHidden);

  return activeCategories.map(category => {
    const { balance, monthlyContribution, targetAmount } = category.data;

    const balancePercentage = totalBalance > 0
      ? (balance / totalBalance) * 100
      : 0;

    const contributionPercentage = totalContribution > 0
      ? (monthlyContribution / totalContribution) * 100
      : 0;

    const lifeEnergyBalance = actualHourlyWage
      ? balance / actualHourlyWage
      : null;

    const lifeEnergyContribution = actualHourlyWage
      ? monthlyContribution / actualHourlyWage
      : null;

    const progressPercentage = targetAmount && targetAmount > 0
      ? Math.min((balance / targetAmount) * 100, 100)
      : undefined;

    const remainingToTarget = targetAmount && targetAmount > balance
      ? targetAmount - balance
      : undefined;

    return {
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      balance,
      monthlyContribution,
      balancePercentage,
      contributionPercentage,
      lifeEnergyBalance,
      lifeEnergyContribution,
      targetAmount,
      progressPercentage,
      remainingToTarget,
    };
  }).sort((a, b) => b.balance - a.balance); // Sort by balance descending
}
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate complete savings report results
 */
export function calculateSavingsReportResults(
  report: SavingsReport,
  actualHourlyWage: number | null,
  monthlyNetIncome: number | null
): SavingsReportResults {
  const { categories } = report;

  // Calculate totals
  const totalBalance = calculateTotalSavings(categories);
  const totalMonthlyContribution = calculateTotalMonthlyContribution(categories);
  const totalAnnualContribution = calculateAnnualContribution(totalMonthlyContribution);

  // Calculate savings rate
  const savingsRate = calculateSavingsRate(totalMonthlyContribution, monthlyNetIncome);
  const savingsRateContext = getSavingsRateContext(savingsRate);

  // Calculate breakdown
  const categoryBreakdown = calculateCategoryBreakdown(
    categories,
    totalBalance,
    totalMonthlyContribution,
    actualHourlyWage
  );

  // Calculate life energy
  const lifeEnergy = calculateSavingsLifeEnergy(
    totalBalance,
    totalMonthlyContribution,
    actualHourlyWage
  );

  // Calculate target stats
  const categoriesWithTargets = categories.filter(
    c => !c.isHidden && c.data.targetAmount && c.data.targetAmount > 0
  ).length;

  const categoriesWithProgress = categoryBreakdown.filter(c => c.progressPercentage !== undefined);
  const averageProgress = categoriesWithProgress.length > 0
    ? categoriesWithProgress.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) / categoriesWithProgress.length
    : null;

  return {
    totalBalance,
    totalMonthlyContribution,
    totalAnnualContribution,
    savingsRate,
    savingsRateContext,
    categoryBreakdown,
    lifeEnergy,
    categoriesWithTargets,
    averageProgress,
  };
}
```

---

## 6. Integration Strategy

### 6.1 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**
```typescript
// In SavingsReportCalculator component
const { results, savingsReport, savingsReportResults } = useCalculator();

// Get actual hourly wage
const actualHourlyWage = results?.actualHourlyWage || null;

// Life energy displayed when AWH available
{actualHourlyWage && savingsReportResults?.lifeEnergy && (
  <LifeEnergyDisplay
    balanceHours={savingsReportResults.lifeEnergy.totalBalanceHours}
    monthlyHours={savingsReportResults.lifeEnergy.totalMonthlyHours}
  />
)}
```

### 6.2 Integration with Income Data

**Getting Monthly Net Income:**
```typescript
// Monthly net income from calculator results
const monthlyNetIncome = results?.netAnnualIncome
  ? results.netAnnualIncome / 12
  : null;

// Or from inputs if available
const monthlyNetIncome = inputs?.income?.netMonthlyIncome ?? null;
```

### 6.3 Integration with FI Calculators

**Usage Pattern:**
```typescript
// In FI Number Calculator or Coast FIRE Calculator
function FICalculator() {
  const { getSavingsReport, getTotalSavings, getSavingsRate } = useCalculator();

  const savingsReport = getSavingsReport();
  const totalSavings = getTotalSavings();
  const savingsRate = getSavingsRate();

  // Use in FI calculations
  const currentNetWorth = totalSavings;
  const annualSavings = getTotalMonthlyContribution() * 12;

  // Calculate years to FI
  const yearsToFI = calculateYearsToFI(currentNetWorth, annualSavings, fiNumber);
}
```

---

## 7. User Interface Design

### 7.1 Layout Structure

**Mobile (<640px):**
- Single column layout
- Stacked stat cards
- Full-width category accordions
- Chart below stats

**Tablet (640px-1024px):**
- Two-column stat cards
- Category accordions with side-by-side inputs
- Chart beside stats

**Desktop (>1024px):**
- Four stat cards in row
- Two-column layout (categories | chart/insights)
- Full feature display

### 7.2 Responsive Design

**Dashboard Mobile:**
```
┌─────────────────────────────┐
│ Samtals sparnaður           │
│ 12.500.000 kr               │
├─────────────────────────────┤
│ Mánaðarleg framlög          │
│ 350.000 kr                  │
├─────────────────────────────┤
│ Sparnaðarhlutfall           │
│ 28%                         │
├─────────────────────────────┤
│ [Pie Chart]                 │
│                             │
├─────────────────────────────┤
│ Framvinda markmiða          │
│ [Progress Cards...]         │
└─────────────────────────────┘
```

### 7.3 Color Coding

```typescript
const CATEGORY_COLORS = {
  neydarsjodur: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'bg-emerald-500',
  },
  skammtima: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
  },
  // ... etc
};
```

---

## 8. Error Handling Strategy

### 8.1 Input Validation

```typescript
const validateCategoryData = (data: SavingsCategoryData): ValidationResult => {
  // Check for negative values
  if (data.balance < 0) {
    return { valid: false, error: 'Staða getur ekki verið neikvæð' };
  }

  if (data.monthlyContribution < 0) {
    return { valid: false, error: 'Framlög geta ekki verið neikvæð' };
  }

  if (data.targetAmount !== undefined && data.targetAmount < 0) {
    return { valid: false, error: 'Markmið getur ekki verið neikvætt' };
  }

  return { valid: true };
};
```

### 8.2 Missing Data Handling

```typescript
// Missing AWH
{!actualHourlyWage && (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup til að sjá sparnaðinn í lífsorku</p>
    <Button href="/">Opna tímakaups reiknivél</Button>
  </Alert>
)}

// Missing income for savings rate
{!monthlyNetIncome && (
  <div className="text-neutral-500">
    Sparnaðarhlutfall reiknast þegar mánaðartekjur eru skráðar
  </div>
)}
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `savingsReport.test.ts` - Calculation logic
- `SavingsReportCalculator.test.tsx` - Main component
- `SavingsEditor.test.tsx` - Editor component
- `SavingsDashboard.test.tsx` - Dashboard component

**Test Coverage:**

```typescript
// savingsReport.test.ts
describe('calculateTotalSavings', () => {
  it('sums all non-hidden category balances', () => {
    const categories = [
      { id: 'a', data: { balance: 1000000, monthlyContribution: 50000 }, isHidden: false },
      { id: 'b', data: { balance: 500000, monthlyContribution: 25000 }, isHidden: false },
    ];

    const total = calculateTotalSavings(categories as SavingsCategory[]);
    expect(total).toBe(1500000);
  });

  it('excludes hidden categories', () => {
    const categories = [
      { id: 'a', data: { balance: 1000000, monthlyContribution: 50000 }, isHidden: false },
      { id: 'b', data: { balance: 500000, monthlyContribution: 25000 }, isHidden: true },
    ];

    const total = calculateTotalSavings(categories as SavingsCategory[]);
    expect(total).toBe(1000000);
  });
});

describe('calculateSavingsRate', () => {
  it('calculates percentage correctly', () => {
    const rate = calculateSavingsRate(100000, 500000);
    expect(rate).toBe(20);
  });

  it('returns null when no income', () => {
    const rate = calculateSavingsRate(100000, null);
    expect(rate).toBeNull();
  });
});
```

### 9.2 Integration Testing

```typescript
describe('SavingsReport Integration', () => {
  it('persists savings to localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateSavingsCategory('neydarsjodur', { balance: 1000000 });
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain('1000000');
    });
  });
});
```

---

## 10. Accessibility Implementation

### 10.1 ARIA Implementation

```typescript
// Category accordion
<div
  role="region"
  aria-labelledby={`category-${category.id}-header`}
>
  <button
    id={`category-${category.id}-header`}
    aria-expanded={isExpanded}
    aria-controls={`category-${category.id}-content`}
    onClick={onToggle}
  >
    {category.icon} {category.name}
  </button>

  <div
    id={`category-${category.id}-content`}
    role="region"
    hidden={!isExpanded}
  >
    {/* Content */}
  </div>
</div>

// Input labels
<label htmlFor={`${category.id}-balance`}>
  Núverandi staða - {category.name}
</label>
<CurrencyInput
  id={`${category.id}-balance`}
  value={data.balance}
  aria-describedby={`${category.id}-balance-help`}
/>
<span id={`${category.id}-balance-help`} className="sr-only">
  Sláðu inn núverandi stöðu í krónum
</span>
```

### 10.2 Keyboard Navigation

**Editor Mode:**
- Tab: Move between inputs and buttons
- Enter: Toggle accordion open/close
- Escape: Close expanded accordion

---

## 11. Localization (Icelandic)

### 11.1 Text Content

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'Sparnaðarskýrsla',
  subtitle: 'Fylgstu með sparnaðinum þínum í einum stað',

  // View modes
  viewModes: {
    dashboard: 'Yfirlit',
    editor: 'Breyta',
  },

  // Stats
  stats: {
    totalSavings: 'Samtals sparnaður',
    monthlyContribution: 'Mánaðarleg framlög',
    annualContribution: 'Árleg framlög',
    savingsRate: 'Sparnaðarhlutfall',
    lifeEnergy: 'Lífsorka',
  },

  // Category labels
  categories: {
    balance: 'Núverandi staða',
    monthlyContribution: 'Mánaðarleg framlög',
    targetAmount: 'Markmið',
    notes: 'Athugasemdir',
    progress: 'Framvinda',
    remaining: 'Á eftir',
  },

  // Actions
  actions: {
    edit: 'Breyta',
    save: 'Vista',
    cancel: 'Hætta við',
    expandAll: 'Opna alla',
    collapseAll: 'Loka öllum',
    hide: 'Fela',
    show: 'Sýna',
  },

  // Messages
  messages: {
    noData: 'Enginn sparnaður skráður enn',
    startTracking: 'Byrjaðu að skrá sparnaðinn þinn',
    noAWH: 'Reiknaðu raunverulegt tímakaup til að sjá lífsorku',
    noIncome: 'Skráðu tekjur til að sjá sparnaðarhlutfall',
  },

  // Educational
  educational: {
    whatIs: 'Hvað er Sparnaðarskýrsla?',
    description: 'Sparnaðarskýrsla hjálpar þér að halda utan um allan sparnaðinn þinn á einum stað.',
    privacy: 'Öll gögn eru geymd á tækinu þínu. Engar upplýsingar eru sendar á netþjóna.',
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

// Example: 12.500.000 kr

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value) + '%';
};

// Example: 28% or 75,5%

const formatLifeEnergy = (hours: number): string => {
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(hours) + ' klst';
};

// Example: 5.000 klst
```

---

## 12. Technical Decisions

### 12.1 Pattern Match with Current Expense Report

**Decision**: Follow the same UI/UX pattern as Current Expense Report

**Rationale**:
- Users familiar with expense tracking will understand savings tracking
- Consistent code patterns reduce maintenance
- Shared components where possible (CurrencyInput, CategoryAccordion pattern)

### 12.2 Category-Based Structure

**Decision**: Fixed set of 7 default categories (not user-customizable initially)

**Rationale**:
- Covers most common savings types
- Simpler implementation for v1
- Can add custom categories in future version
- Hide functionality provides flexibility

### 12.3 Dual Tracking (Balance + Contribution)

**Decision**: Track both current balance and monthly contribution separately

**Rationale**:
- Balance shows "where you are"
- Contribution shows "where you're going"
- Both needed for FI calculations
- Savings rate requires contribution data

---

## 13. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Track by Category | SavingsCategory type, CategoryAccordion | 7 default categories with balance/contribution |
| **US-2**: Track Balances | SavingsCategoryData.balance | CurrencyInput per category |
| **US-3**: Track Contributions | SavingsCategoryData.monthlyContribution | CurrencyInput per category |
| **US-4**: Optional Targets | SavingsCategoryData.targetAmount | Optional CurrencyInput with progress display |
| **US-5**: Savings Rate | calculateSavingsRate() | QuickStats card with context message |
| **US-6**: Life Energy | calculateSavingsLifeEnergy() | Hours display when AWH available |
| **US-7**: Notes | SavingsCategoryData.notes | TextArea per category |
| **FR-1**: Categories | DEFAULT_SAVINGS_CATEGORIES | 7 categories with Icelandic names |
| **FR-3**: Calculations | savingsReport.ts | Total, rate, life energy functions |
| **FR-4**: Summary Display | SavingsDashboard | QuickStats, Charts, Insights |
| **FR-5**: Persistence | CalculatorContext | localStorage with debounce |
| **FR-6**: Integration | Context API methods | getSavingsReport(), getTotalSavings(), etc. |

---

## 14. Implementation Risks and Mitigations

### Risk 1: Complex State Management

**Risk**: Managing multiple categories with balance/contribution/target may become complex.

**Mitigation**:
- Use immutable state updates
- Clear separation of data and UI state
- Unit tests for all state transitions

### Risk 2: AWH Integration Timing

**Risk**: User may set up savings before calculating AWH.

**Mitigation**:
- Life energy shown as "N/A" without AWH
- Prompt to calculate AWH
- Auto-recalculate when AWH becomes available

### Risk 3: Income Data Availability

**Risk**: Savings rate requires income data which may not be set.

**Mitigation**:
- Clear messaging when income unavailable
- Link to set up income
- Feature works without income (just no rate calculation)

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
- [x] Follows established patterns
- [x] Performance requirements achievable

### Quality
- [x] Privacy-first design maintained
- [x] Icelandic localization complete
- [x] Accessibility compliant (WCAG 2.1 AA)
- [x] Error handling comprehensive
- [x] User experience optimized

### Integration
- [x] API defined for other calculators
- [x] Clear integration patterns documented
- [x] Follows Current Expense Report pattern

---

**Design Phase Complete: Ready for Tasks Breakdown**
