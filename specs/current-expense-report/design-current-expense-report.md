# Design: Current Expense Report

## Document Information

- **Feature Name**: Current Expense Report (Rauntímaútgjöld)
- **Version**: 1.0
- **Date**: 2026-01-23
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-current-expense-report.md

---

## 1. System Overview

### 1.1 Purpose

The Current Expense Report is a granular expense tracking tool that enables users to record their ACTUAL current monthly spending with detailed line items. Unlike the Expense Baseline Tool (which plans spending at three tiers), this tool tracks real-world expenses to help users understand where their money goes, calculate life energy costs, and feed accurate data to other calculators.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Granular Detail**: Line-item tracking within categories for maximum insight
2. **Integration Hub**: Designed to feed data to Subscription Burn, Commute, Housing calculators
3. **Life Energy Focus**: Every expense shown in work hours when AWH available
4. **Privacy-First**: All data stored locally, no server transmission
5. **Quick Entry**: Inline editing and category organization for efficient data entry
6. **Smart Recommendations**: Pattern analysis suggests relevant calculators
7. **Icelandic-First**: Real vendor names and expense categories for Iceland

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Category Editor  │  │ Dashboard/       │  │ Comparison View      │  │
│  │ (Line Items)     │  │ Summary          │  │ (vs. Baseline)       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  currentExpenses: CurrentExpenseReport                              ││
│  │    - categories: ExpenseCategory[]                                  ││
│  │    - lastUpdated: Date                                              ││
│  │  currentExpenseResults: CurrentExpenseResults                       ││
│  │    - totals, categoryBreakdown, lifeEnergy, recommendations         ││
│  └─────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Integration API:                                                   ││
│  │    - getCurrentExpenses(): CurrentExpenseReport                     ││
│  │    - getExpensesByCategory(category): CategoryData                  ││
│  │    - getSubscriptions(): LineItem[]                                 ││
│  │    - getCommuteExpenses(): number                                   ││
│  │    - getHousingExpenses(): number                                   ││
│  └─────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Total Calculator  │  │ Life Energy       │  │ Recommendation    │  │
│  │                   │  │ Calculator        │  │ Engine            │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│  ┌───────────────────┐  ┌───────────────────┐                          │
│  │ Category Totals   │  │ Baseline          │                          │
│  │                   │  │ Comparison        │                          │
│  └───────────────────┘  └───────────────────┘                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Data Persistence Layer                                │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ LocalStorage      │  │ Export/Import     │  │ Event Emitter     │  │
│  │ Manager           │  │ Functions         │  │ (for integrations)│  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
CurrentExpenseReportCalculator (Page Component)
├── ExpenseReportHeader
│   ├── TotalDisplay (Monthly/Annual)
│   ├── LifeEnergyDisplay (if AWH available)
│   └── LastUpdatedTimestamp
│
├── ExpenseDashboard (Summary View)
│   ├── QuickStats
│   │   ├── TotalExpenses
│   │   ├── TopCategory
│   │   └── LifeEnergyTotal
│   ├── CategoryBreakdownChart (Pie/Donut)
│   ├── TopExpensesList (Top 10 line items)
│   ├── BaselineComparison (if baseline exists)
│   └── RecommendationPanel
│
├── CategoryExpenseEditor (Detailed Input)
│   ├── CategoryAccordion
│   │   ├── CategoryHeader (Icon, Name, Total, % of budget)
│   │   ├── LineItemList
│   │   │   ├── LineItemRow (vendor/item, amount, life energy)
│   │   │   │   ├── ItemLabel (editable)
│   │   │   │   ├── CurrencyInput
│   │   │   │   ├── LifeEnergyDisplay
│   │   │   │   └── DeleteButton
│   │   │   └── AddLineItemButton
│   │   └── CategoryTotalDisplay
│   └── AddCustomCategoryButton
│
├── BaselineComparisonView (if baseline exists)
│   ├── TierMatchIndicator (which tier matches current spending)
│   ├── CategoryComparisonTable
│   ├── OverspendingHighlights
│   └── SuggestedAdjustments
│
└── RecommendationPanel
    ├── SubscriptionRecommendation (if subscriptions > threshold)
    ├── CommuteRecommendation (if transport > threshold)
    ├── HousingRecommendation (if housing > 30%)
    └── BaselineUpdateRecommendation (if significant deviation)
```

### 2.3 Data Flow

**Input Flow:**
```
User enters line item → Validation → Local State Update → Debounced Save
                                        ↓
                           Recalculate Totals & Results → UI Update
                                        ↓
                         Analyze Patterns → Generate Recommendations
                                        ↓
                              Emit Change Event → Notify Integrations
```

**Integration Flow:**
```
Other Calculator Loads → useCurrentExpenses() → getCurrentExpenses()
                                                      ↓
                                           Check if data exists
                                                      ↓
                                  ┌───────────────────┴─────────────────┐
                                  ↓                                     ↓
                            Data Found                            No Data
                                  ↓                                     ↓
                    Extract relevant expenses             Prompt to set up
                    (subscriptions, commute, etc.)
                                  ↓
                          Use in calculator
```

---

## 3. Component Design

### 3.1 CurrentExpenseReportCalculator (Main Component)

**Responsibility**: Page-level container and view coordinator

**Interface:**
```typescript
interface CurrentExpenseReportCalculatorProps {
  // No props - gets data from CalculatorContext
}

type ViewMode = 'dashboard' | 'edit' | 'comparison';
```

**Key Features:**
- Toggles between dashboard summary and detailed category editor
- Coordinates calculations across all categories
- Handles localStorage persistence
- Displays recommendations based on expense patterns

---

### 3.2 CategoryExpenseEditor Component

**Responsibility**: Main interface for entering and editing expense line items

**Interface:**
```typescript
interface CategoryExpenseEditorProps {
  categories: ExpenseCategory[];
  onUpdateLineItem: (categoryId: string, lineItemId: string, updates: Partial<LineItem>) => void;
  onAddLineItem: (categoryId: string, lineItem: Omit<LineItem, 'id'>) => void;
  onDeleteLineItem: (categoryId: string, lineItemId: string) => void;
  onAddCustomCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  actualHourlyWage: number | null;
}

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  lineItems: LineItem[];
  total: number; // Calculated from line items
  isCustom: boolean;
  isHidden: boolean;
  order: number;
}

interface LineItem {
  id: string;
  label: string; // "Bónus groceries", "Netflix", etc.
  amount: number; // Monthly ISK
  isRecurring: boolean; // For subscriptions
  notes?: string; // Optional notes
}
```

**Visual Layout (Accordion):**
```
┌─────────────────────────────────────────────────────────┐
│  🏠 Húsnæði                    150.000 kr  (60 klst)    │ ▼
├─────────────────────────────────────────────────────────┤
│  Leiga                                                   │
│  ┌─────────────────────┐  ┌─────────┐  [🗑️]            │
│  │ 120.000          kr │  48 klst                       │
│  └─────────────────────┘                                │
│                                                          │
│  Fasteignagjöld                                          │
│  ┌─────────────────────┐  ┌─────────┐  [🗑️]            │
│  │  20.000          kr │  8 klst                        │
│  └─────────────────────┘                                │
│                                                          │
│  Húseigendatrygging                                      │
│  ┌─────────────────────┐  ┌─────────┐  [🗑️]            │
│  │  10.000          kr │  4 klst                        │
│  └─────────────────────┘                                │
│                                                          │
│  [+ Bæta við línu]                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🍽️ Matur                       85.000 kr  (34 klst)    │ ▶
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 ExpenseDashboard Component

**Responsibility**: Visual summary and analytics of expense data

**Interface:**
```typescript
interface ExpenseDashboardProps {
  results: CurrentExpenseResults;
  actualHourlyWage: number | null;
  expenseBaseline: ExpenseBaseline | null; // For comparison
}

interface CurrentExpenseResults {
  totalMonthly: number;
  totalAnnual: number;
  categoryBreakdown: CategoryBreakdown[];
  topExpenses: LineItemSummary[]; // Top 10 line items
  lifeEnergy: LifeEnergyBreakdown | null;
  recommendations: Recommendation[];
  baselineComparison: BaselineComparisonData | null;
}

interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  lifeEnergyHours: number | null;
}

interface LineItemSummary {
  categoryName: string;
  label: string;
  amount: number;
  lifeEnergyHours: number | null;
}

interface LifeEnergyBreakdown {
  totalMonthlyHours: number;
  totalAnnualHours: number;
  categoryHours: Record<string, number>; // categoryId -> hours
}

interface Recommendation {
  type: 'subscription' | 'commute' | 'housing' | 'baseline';
  title: string;
  message: string;
  actionUrl: string;
  actionLabel: string;
  priority: 'high' | 'medium' | 'low';
}

interface BaselineComparisonData {
  closestTier: 'barebones' | 'comfortable' | 'deluxe';
  difference: number; // ISK difference from closest tier
  overspendingCategories: string[]; // Category IDs
  underspendingCategories: string[]; // Category IDs
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Rauntímaútgjöld - Yfirlit                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Mánaðarútgjöld  │  │ Lífsorka        │              │
│  │  450.000 kr     │  │  180 klst/mán   │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                          │
│  Top útgjöld:                                            │
│  1. 🏠 Leiga: 120.000 kr (48 klst)                      │
│  2. 🚗 Car payment: 30.000 kr (12 klst)                 │
│  3. 🍽️ Bónus groceries: 30.000 kr (12 klst)            │
│  ...                                                     │
│                                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Category Breakdown (Pie Chart)                   │ │
│  │  [Visual pie chart showing category %]            │ │
│  └───────────────────────────────────────────────────┘ │
│                                                          │
│  Tillögur:                                               │
│  ⚠️ Áskriftir eru 3,3% af útgjöldum (15.000 kr)        │
│     → Skoða Subscription Burn Meter til að fínstilla    │
│                                                          │
│  ℹ️ Húsnæði er 33% af útgjöldum                         │
│     → Skoða Housing Calculator fyrir valmöguleika       │
└─────────────────────────────────────────────────────────┘
```

---

### 3.4 BaselineComparisonView Component

**Responsibility**: Compare current expenses to planned baseline

**Interface:**
```typescript
interface BaselineComparisonViewProps {
  currentExpenses: CurrentExpenseReport;
  expenseBaseline: ExpenseBaseline;
  comparison: BaselineComparisonData;
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Samanburður við Útgjaldagrunn                          │
├─────────────────────────────────────────────────────────┤
│  Núverandi útgjöld þín passa best við:                  │
│                                                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │ Lágmarks  │  │ Þægilegt  │  │  Lúxus    │          │
│  │ 250.000   │  │ 520.000   │  │ 1.000.000 │          │
│  └───────────┘  └───────────┘  └───────────┘          │
│       ○              ●              ○                    │
│                  (450.000 kr)                            │
│                  70.000 kr undir                         │
│                                                          │
│  Flokkar sem fara yfir áætlun:                          │
│  • Matur: +15.000 kr (áætlun: 70.000, raunverulegt: 85.000) │
│  • Afþreying: +10.000 kr (áætlun: 40.000, raunverulegt: 50.000) │
│                                                          │
│  Flokkar sem eru undir áætlun:                          │
│  • Samgöngur: -5.000 kr (áætlun: 50.000, raunverulegt: 45.000) │
└─────────────────────────────────────────────────────────┘
```

---

### 3.5 RecommendationPanel Component

**Responsibility**: Display smart recommendations based on expense patterns

**Interface:**
```typescript
interface RecommendationPanelProps {
  recommendations: Recommendation[];
  onDismiss: (recommendationId: string) => void;
}
```

**Recommendation Logic:**

```typescript
function generateRecommendations(
  expenses: CurrentExpenseReport,
  baseline: ExpenseBaseline | null,
  totals: CurrentExpenseResults
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Subscription recommendation
  const subscriptions = getSubscriptions(expenses);
  const subscriptionTotal = subscriptions.reduce((sum, item) => sum + item.amount, 0);
  if (subscriptionTotal > 10000) {
    recommendations.push({
      type: 'subscription',
      title: 'Áskriftir eru verulegur hluti útgjalda',
      message: `Þú ert að eyða ${formatCurrency(subscriptionTotal)} í áskriftir á mánuði. Subscription Burn Meter getur hjálpað þér að fínstilla.`,
      actionUrl: '/subscription-burn-meter',
      actionLabel: 'Greina áskriftir',
      priority: subscriptionTotal > 20000 ? 'high' : 'medium',
    });
  }

  // Commute recommendation
  const commuteCosts = getCommuteExpenses(expenses);
  if (commuteCosts > 30000) {
    recommendations.push({
      type: 'commute',
      title: 'Samgöngur eru há í útgjöldum',
      message: `Samgöngukostnaður er ${formatCurrency(commuteCosts)} á mánuði. Athugaðu valkosti með Commute Calculator.`,
      actionUrl: '/commute-calculator',
      actionLabel: 'Greina samgöngur',
      priority: commuteCosts > 50000 ? 'high' : 'medium',
    });
  }

  // Housing recommendation
  const housingCosts = getHousingExpenses(expenses);
  const housingPercentage = (housingCosts / totals.totalMonthly) * 100;
  if (housingPercentage > 30) {
    recommendations.push({
      type: 'housing',
      title: 'Húsnæði er stór hluti útgjalda',
      message: `Húsnæði er ${housingPercentage.toFixed(1)}% af útgjöldum. Housing Calculator getur hjálpað með greiningu.`,
      actionUrl: '/housing-calculator',
      actionLabel: 'Greina húsnæði',
      priority: housingPercentage > 40 ? 'high' : 'medium',
    });
  }

  // Baseline comparison recommendation
  if (baseline) {
    const comparison = compareToBaseline(expenses, baseline);
    if (Math.abs(comparison.difference) > 50000) {
      recommendations.push({
        type: 'baseline',
        title: 'Verulegur munur á raunverulegum útgjöldum og áætlun',
        message: `Núverandi útgjöld eru ${formatCurrency(Math.abs(comparison.difference))} ${comparison.difference > 0 ? 'yfir' : 'undir'} áætlun. Íhugaðu að uppfæra útgjaldagrunn.`,
        actionUrl: '/expense-baseline',
        actionLabel: 'Uppfæra útgjaldagrunn',
        priority: Math.abs(comparison.difference) > 100000 ? 'high' : 'medium',
      });
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
```

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Current Expense Report Types
 */

export interface LineItem {
  id: string; // Unique ID
  label: string; // "Bónus groceries", "Netflix", etc.
  amount: number; // Monthly ISK
  isRecurring: boolean; // True for subscriptions
  notes?: string; // Optional user notes
}

export interface ExpenseCategory {
  id: string; // Unique identifier
  name: string; // Icelandic display name
  icon: string; // Emoji icon
  lineItems: LineItem[];
  isCustom: boolean; // User-created category
  isHidden: boolean; // Hidden from display
  order: number; // Display order
}

export interface CurrentExpenseReport {
  categories: ExpenseCategory[];
  lastUpdated: Date;
  version: number; // Schema version for migrations
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  total: number;
  percentage: number;
  lifeEnergyHours: number | null;
  lineItemCount: number;
}

export interface LineItemSummary {
  categoryId: string;
  categoryName: string;
  lineItemId: string;
  label: string;
  amount: number;
  lifeEnergyHours: number | null;
  isRecurring: boolean;
}

export interface LifeEnergyBreakdown {
  totalMonthlyHours: number;
  totalAnnualHours: number;
  categoryHours: Record<string, number>; // categoryId -> hours
  lineItemHours: Record<string, number>; // lineItemId -> hours
}

export interface BaselineComparisonData {
  closestTier: 'barebones' | 'comfortable' | 'deluxe';
  currentTotal: number;
  tierTotal: number;
  difference: number; // ISK difference from closest tier
  differencePercentage: number;
  categoryComparisons: CategoryComparison[];
}

export interface CategoryComparison {
  categoryId: string;
  categoryName: string;
  currentAmount: number;
  baselineAmount: number;
  difference: number;
  status: 'over' | 'under' | 'match'; // Over/under/within 10%
}

export interface Recommendation {
  id: string;
  type: 'subscription' | 'commute' | 'housing' | 'baseline';
  title: string;
  message: string;
  actionUrl: string;
  actionLabel: string;
  priority: 'high' | 'medium' | 'low';
  dismissable: boolean;
}

export interface CurrentExpenseResults {
  totalMonthly: number;
  totalAnnual: number;
  categoryBreakdown: CategoryBreakdown[];
  topExpenses: LineItemSummary[]; // Top 10 by amount
  lifeEnergy: LifeEnergyBreakdown | null;
  recommendations: Recommendation[];
  baselineComparison: BaselineComparisonData | null;
}
```

### 4.2 Default Categories Configuration

```typescript
export const DEFAULT_CURRENT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[] = [
  {
    id: 'husnaedi',
    name: 'Húsnæði',
    icon: '🏠',
    suggestedLineItems: [
      'Leiga/húsnæðislán',
      'Fasteignagjöld',
      'Húseigendatrygging',
      'Viðhald',
      'Íbúðafélagsgjöld',
    ],
  },
  {
    id: 'matur',
    name: 'Matur',
    icon: '🍽️',
    suggestedLineItems: [
      'Bónus groceries',
      'Krónan',
      'Hagkaup',
      'Veitingastaðir',
      'Kaffihús',
      'Vinnuhádegismatur',
      'Delivery/takeout',
    ],
  },
  {
    id: 'samgongur',
    name: 'Samgöngur',
    icon: '🚗',
    suggestedLineItems: [
      'Bílakostnaður/leiga',
      'Eldsneyti',
      'Bifreiðatrygging',
      'Bílastæði',
      'Strætó pass',
      'Viðhald/viðgerðir',
    ],
  },
  {
    id: 'veitur',
    name: 'Veitur',
    icon: '💡',
    suggestedLineItems: [
      'Rafmagn (Orkuveita)',
      'Hiti/vatn',
      'Internet (Síminn/Vodafone/Nova)',
      'Farsími',
      'Netflix',
      'Spotify',
      'Aðrir streymisþjónustur',
    ],
  },
  {
    id: 'askriftir',
    name: 'Áskriftir',
    icon: '📱',
    suggestedLineItems: [
      'Líkamsræktarstöð',
      'Dagblöð/tímarit',
      'Software/apps',
      'Gaming (PlayStation Plus, Xbox, etc.)',
      'Cloud storage',
      'Aðrar áskriftir',
    ],
  },
  {
    id: 'heilsa',
    name: 'Heilsa',
    icon: '🏥',
    suggestedLineItems: [
      'Lyf',
      'Tannlæknir',
      'Sjónlæknir',
      'Sálfræðingur/meðferð',
      'Bætiefni',
    ],
  },
  {
    id: 'tryggingar',
    name: 'Tryggingar',
    icon: '🛡️',
    suggestedLineItems: [
      'Líftrygging',
      'Örorkutrygging',
      'Ferðatrygging',
      'Gæludýratrygging',
    ],
  },
  {
    id: 'personuleg',
    name: 'Persónuleg',
    icon: '👤',
    suggestedLineItems: [
      'Fatnaður',
      'Snyrtivörur',
      'Hárgreiðsla',
      'Persónuleg umhirða',
    ],
  },
  {
    id: 'afthreying',
    name: 'Afþreying',
    icon: '🎬',
    suggestedLineItems: [
      'Kvikmyndir',
      'Tónleikar',
      'Íþróttir',
      'Félagslíf',
      'Áhugamál',
      'Ferðalög',
    ],
  },
  {
    id: 'born',
    name: 'Börn',
    icon: '👶',
    suggestedLineItems: [
      'Leikskóli',
      'Skólagjöld',
      'Tómstundir',
      'Barnafatnaður',
      'Barnabækur/leikföng',
    ],
  },
  {
    id: 'annad',
    name: 'Annað',
    icon: '📦',
    suggestedLineItems: [
      'Gjafir',
      'Góðgerðarframlög',
      'Ýmislegt',
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

  // Current Expense Report
  currentExpenses: CurrentExpenseReport | null;
  currentExpenseResults: CurrentExpenseResults | null;

  // Current Expense Report Actions
  updateCurrentExpenses: (expenses: Partial<CurrentExpenseReport>) => void;
  addLineItem: (categoryId: string, lineItem: Omit<LineItem, 'id'>) => void;
  updateLineItem: (categoryId: string, lineItemId: string, updates: Partial<LineItem>) => void;
  deleteLineItem: (categoryId: string, lineItemId: string) => void;
  addCustomCategory: (category: Omit<ExpenseCategory, 'id' | 'lineItems'>) => void;
  removeCategory: (categoryId: string) => void;
  toggleCategoryVisibility: (categoryId: string) => void;
  clearCurrentExpenses: () => void;

  // Integration API (for other calculators)
  getCurrentExpenses: () => CurrentExpenseReport | null;
  getExpensesByCategory: (categoryId: string) => ExpenseCategory | null;
  getSubscriptions: () => LineItem[]; // All recurring line items + subscription category
  getCommuteExpenses: () => number; // Total from transport category
  getHousingExpenses: () => number; // Total from housing category
  hasCurrentExpenses: () => boolean;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  currentExpenses?: {
    categories: StoredExpenseCategory[];
    lastUpdated: string; // ISO date string
    version: number;
  };
}

interface StoredExpenseCategory {
  id: string;
  name: string;
  icon: string;
  lineItems: StoredLineItem[];
  isCustom: boolean;
  isHidden: boolean;
  order: number;
}

interface StoredLineItem {
  id: string;
  label: string;
  amount: number;
  isRecurring: boolean;
  notes?: string;
}
```

---

## 5. Calculation Logic

### 5.1 Total Calculator

**File**: `/src/lib/calculations/currentExpenses.ts`

```typescript
/**
 * Calculate total expenses from all categories
 */
export const calculateTotalExpenses = (
  categories: ExpenseCategory[]
): { monthly: number; annual: number } => {
  const activeCategories = categories.filter(c => !c.isHidden);

  const monthly = activeCategories.reduce((sum, category) => {
    const categoryTotal = category.lineItems.reduce(
      (lineSum, item) => lineSum + item.amount,
      0
    );
    return sum + categoryTotal;
  }, 0);

  return {
    monthly,
    annual: monthly * 12,
  };
};

/**
 * Calculate category totals
 */
export const calculateCategoryTotals = (
  categories: ExpenseCategory[]
): Record<string, number> => {
  const totals: Record<string, number> = {};

  for (const category of categories.filter(c => !c.isHidden)) {
    totals[category.id] = category.lineItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }

  return totals;
};
```

### 5.2 Category Breakdown Calculator

```typescript
/**
 * Calculate category breakdown with percentages
 */
export const calculateCategoryBreakdown = (
  categories: ExpenseCategory[],
  totalMonthly: number,
  actualHourlyWage: number | null
): CategoryBreakdown[] => {
  const activeCategories = categories.filter(c => !c.isHidden);

  return activeCategories.map(category => {
    const total = category.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const percentage = totalMonthly > 0 ? (total / totalMonthly) * 100 : 0;
    const lifeEnergyHours = actualHourlyWage && actualHourlyWage > 0
      ? total / actualHourlyWage
      : null;

    return {
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      total,
      percentage,
      lifeEnergyHours,
      lineItemCount: category.lineItems.length,
    };
  }).sort((a, b) => b.total - a.total); // Sort by total descending
};
```

### 5.3 Life Energy Calculator

```typescript
/**
 * Calculate life energy breakdown
 */
export const calculateLifeEnergy = (
  categories: ExpenseCategory[],
  totalMonthly: number,
  actualHourlyWage: number | null
): LifeEnergyBreakdown | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  const categoryHours: Record<string, number> = {};
  const lineItemHours: Record<string, number> = {};

  const activeCategories = categories.filter(c => !c.isHidden);

  for (const category of activeCategories) {
    let categoryTotal = 0;
    for (const lineItem of category.lineItems) {
      const hours = lineItem.amount / actualHourlyWage;
      lineItemHours[lineItem.id] = hours;
      categoryTotal += hours;
    }
    categoryHours[category.id] = categoryTotal;
  }

  return {
    totalMonthlyHours: totalMonthly / actualHourlyWage,
    totalAnnualHours: (totalMonthly * 12) / actualHourlyWage,
    categoryHours,
    lineItemHours,
  };
};
```

### 5.4 Top Expenses Calculator

```typescript
/**
 * Get top N expenses across all categories
 */
export const getTopExpenses = (
  categories: ExpenseCategory[],
  limit: number,
  actualHourlyWage: number | null
): LineItemSummary[] => {
  const allLineItems: LineItemSummary[] = [];

  const activeCategories = categories.filter(c => !c.isHidden);

  for (const category of activeCategories) {
    for (const lineItem of category.lineItems) {
      allLineItems.push({
        categoryId: category.id,
        categoryName: category.name,
        lineItemId: lineItem.id,
        label: lineItem.label,
        amount: lineItem.amount,
        lifeEnergyHours: actualHourlyWage && actualHourlyWage > 0
          ? lineItem.amount / actualHourlyWage
          : null,
        isRecurring: lineItem.isRecurring,
      });
    }
  }

  return allLineItems
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
};
```

### 5.5 Baseline Comparison Calculator

```typescript
/**
 * Compare current expenses to expense baseline
 */
export const compareToBaseline = (
  currentExpenses: CurrentExpenseReport,
  expenseBaseline: ExpenseBaseline
): BaselineComparisonData | null => {
  if (!expenseBaseline) return null;

  const currentTotal = calculateTotalExpenses(currentExpenses.categories).monthly;
  const baselineTotals = calculateTierTotals(expenseBaseline.categories);

  // Find closest tier
  const tiers: Array<{ tier: ExpenseTier; total: number }> = [
    { tier: 'barebones', total: baselineTotals.barebones },
    { tier: 'comfortable', total: baselineTotals.comfortable },
    { tier: 'deluxe', total: baselineTotals.deluxe },
  ];

  const closest = tiers.reduce((prev, curr) =>
    Math.abs(curr.total - currentTotal) < Math.abs(prev.total - currentTotal)
      ? curr
      : prev
  );

  const difference = currentTotal - closest.total;
  const differencePercentage = (difference / closest.total) * 100;

  // Category-level comparisons
  const categoryComparisons: CategoryComparison[] = [];
  const currentCategoryTotals = calculateCategoryTotals(currentExpenses.categories);

  for (const baselineCategory of expenseBaseline.categories) {
    const currentAmount = currentCategoryTotals[baselineCategory.id] || 0;
    const baselineAmount = baselineCategory.values[closest.tier];
    const categoryDiff = currentAmount - baselineAmount;
    const categoryDiffPercent = baselineAmount > 0
      ? (Math.abs(categoryDiff) / baselineAmount) * 100
      : 0;

    let status: 'over' | 'under' | 'match';
    if (categoryDiffPercent < 10) {
      status = 'match';
    } else if (categoryDiff > 0) {
      status = 'over';
    } else {
      status = 'under';
    }

    categoryComparisons.push({
      categoryId: baselineCategory.id,
      categoryName: baselineCategory.name,
      currentAmount,
      baselineAmount,
      difference: categoryDiff,
      status,
    });
  }

  return {
    closestTier: closest.tier,
    currentTotal,
    tierTotal: closest.total,
    difference,
    differencePercentage,
    categoryComparisons,
  };
};
```

### 5.6 Recommendation Generator

```typescript
/**
 * Generate recommendations based on expense patterns
 */
export const generateRecommendations = (
  currentExpenses: CurrentExpenseReport,
  results: CurrentExpenseResults,
  expenseBaseline: ExpenseBaseline | null
): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Subscription recommendation
  const subscriptions = getSubscriptions(currentExpenses);
  const subscriptionTotal = subscriptions.reduce((sum, item) => sum + item.amount, 0);
  if (subscriptionTotal > 10000) {
    recommendations.push({
      id: 'sub-recommendation',
      type: 'subscription',
      title: 'Áskriftir eru verulegur hluti útgjalda',
      message: `Þú ert að eyða ${formatCurrency(subscriptionTotal)} í áskriftir á mánuði. Subscription Burn Meter getur hjálpað þér að fínstilla.`,
      actionUrl: '/subscription-burn-meter',
      actionLabel: 'Greina áskriftir',
      priority: subscriptionTotal > 20000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Commute recommendation
  const commuteCosts = getCommuteExpenses(currentExpenses);
  if (commuteCosts > 30000) {
    recommendations.push({
      id: 'commute-recommendation',
      type: 'commute',
      title: 'Samgöngur eru há í útgjöldum',
      message: `Samgöngukostnaður er ${formatCurrency(commuteCosts)} á mánuði. Athugaðu valkosti með Commute Calculator.`,
      actionUrl: '/commute-calculator',
      actionLabel: 'Greina samgöngur',
      priority: commuteCosts > 50000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Housing recommendation
  const housingCosts = getHousingExpenses(currentExpenses);
  const housingPercentage = (housingCosts / results.totalMonthly) * 100;
  if (housingPercentage > 30) {
    recommendations.push({
      id: 'housing-recommendation',
      type: 'housing',
      title: 'Húsnæði er stór hluti útgjalda',
      message: `Húsnæði er ${housingPercentage.toFixed(1)}% af útgjöldum. Housing Calculator getur hjálpað með greiningu.`,
      actionUrl: '/housing-calculator',
      actionLabel: 'Greina húsnæði',
      priority: housingPercentage > 40 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Baseline comparison recommendation
  if (expenseBaseline && results.baselineComparison) {
    const { difference } = results.baselineComparison;
    if (Math.abs(difference) > 50000) {
      recommendations.push({
        id: 'baseline-recommendation',
        type: 'baseline',
        title: 'Verulegur munur á raunverulegum útgjöldum og áætlun',
        message: `Núverandi útgjöld eru ${formatCurrency(Math.abs(difference))} ${difference > 0 ? 'yfir' : 'undir'} áætlun. Íhugaðu að uppfæra útgjaldagrunn.`,
        actionUrl: '/expense-baseline',
        actionLabel: 'Uppfæra útgjaldagrunn',
        priority: Math.abs(difference) > 100000 ? 'high' : 'medium',
        dismissable: true,
      });
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};
```

### 5.7 Integration API Helpers

```typescript
/**
 * Get all subscriptions (recurring line items)
 */
export const getSubscriptions = (
  expenses: CurrentExpenseReport
): LineItem[] => {
  const subscriptions: LineItem[] = [];

  // Get from Subscriptions category
  const subscriptionCategory = expenses.categories.find(c => c.id === 'askriftir');
  if (subscriptionCategory) {
    subscriptions.push(...subscriptionCategory.lineItems);
  }

  // Get streaming services from Utilities category
  const utilitiesCategory = expenses.categories.find(c => c.id === 'veitur');
  if (utilitiesCategory) {
    const streamingItems = utilitiesCategory.lineItems.filter(item =>
      item.isRecurring && (
        item.label.toLowerCase().includes('netflix') ||
        item.label.toLowerCase().includes('spotify') ||
        item.label.toLowerCase().includes('stream')
      )
    );
    subscriptions.push(...streamingItems);
  }

  // Get all other recurring items
  for (const category of expenses.categories) {
    if (category.id !== 'askriftir' && category.id !== 'veitur') {
      const recurringItems = category.lineItems.filter(item => item.isRecurring);
      subscriptions.push(...recurringItems);
    }
  }

  return subscriptions;
};

/**
 * Get total commute expenses
 */
export const getCommuteExpenses = (
  expenses: CurrentExpenseReport
): number => {
  const transportCategory = expenses.categories.find(c => c.id === 'samgongur');
  if (!transportCategory) return 0;

  return transportCategory.lineItems.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Get total housing expenses
 */
export const getHousingExpenses = (
  expenses: CurrentExpenseReport
): number => {
  const housingCategory = expenses.categories.find(c => c.id === 'husnaedi');
  if (!housingCategory) return 0;

  return housingCategory.lineItems.reduce((sum, item) => sum + item.amount, 0);
};
```

### 5.8 Main Calculation Orchestrator

```typescript
/**
 * Calculate all current expense results
 */
export const calculateCurrentExpenseResults = (
  expenses: CurrentExpenseReport,
  actualHourlyWage: number | null,
  expenseBaseline: ExpenseBaseline | null
): CurrentExpenseResults => {
  const { monthly: totalMonthly, annual: totalAnnual } = calculateTotalExpenses(
    expenses.categories
  );

  const categoryBreakdown = calculateCategoryBreakdown(
    expenses.categories,
    totalMonthly,
    actualHourlyWage
  );

  const topExpenses = getTopExpenses(expenses.categories, 10, actualHourlyWage);

  const lifeEnergy = calculateLifeEnergy(
    expenses.categories,
    totalMonthly,
    actualHourlyWage
  );

  const baselineComparison = expenseBaseline
    ? compareToBaseline(expenses, expenseBaseline)
    : null;

  const results: CurrentExpenseResults = {
    totalMonthly,
    totalAnnual,
    categoryBreakdown,
    topExpenses,
    lifeEnergy,
    baselineComparison,
    recommendations: [], // Will be populated next
  };

  const recommendations = generateRecommendations(
    expenses,
    results,
    expenseBaseline
  );

  results.recommendations = recommendations;

  return results;
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**
```typescript
// In CurrentExpenseReportCalculator component
const { results, currentExpenses, currentExpenseResults } = useCalculator();

// Get actual hourly wage
const actualHourlyWage = results?.actualHourlyWage || null;

// Life energy displayed when AWH available
{actualHourlyWage && currentExpenseResults?.lifeEnergy && (
  <LifeEnergyDisplay
    lifeEnergy={currentExpenseResults.lifeEnergy}
  />
)}
```

**Missing AWH Handling:**
```typescript
{!actualHourlyWage && (
  <Alert variant="info">
    <p>Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorku útgjöld</p>
    <Button as="a" href="/">
      Opna Raunverulegt Tímakaup Reiknivél
    </Button>
  </Alert>
)}
```

### 6.2 Integration with Expense Baseline Tool

**Usage Pattern:**
```typescript
// In CurrentExpenseReportCalculator
const { expenseBaseline, currentExpenses, currentExpenseResults } = useCalculator();

// Show comparison if both exist
{expenseBaseline && currentExpenses && currentExpenseResults?.baselineComparison && (
  <BaselineComparisonView
    comparison={currentExpenseResults.baselineComparison}
    currentExpenses={currentExpenses}
    expenseBaseline={expenseBaseline}
  />
)}

// Prompt if baseline doesn't exist
{!expenseBaseline && (
  <Alert variant="info">
    <p>Búðu til útgjaldagrunn til að bera saman raunveruleg útgjöld við áætlun</p>
    <Button as="a" href="/expense-baseline">
      Setja upp útgjaldagrunn
    </Button>
  </Alert>
)}
```

### 6.3 Integration with Subscription Burn Meter

**Usage Pattern:**
```typescript
// In Subscription Burn Meter Calculator
function SubscriptionBurnMeter() {
  const { getCurrentExpenses, getSubscriptions } = useCalculator();

  const currentExpenses = getCurrentExpenses();
  const [useActualData, setUseActualData] = useState(true);

  useEffect(() => {
    if (useActualData && currentExpenses) {
      const subscriptions = getSubscriptions();
      // Pre-populate with actual subscription data
      setSubscriptionData(subscriptions);
    }
  }, [useActualData, currentExpenses]);

  return (
    <div>
      {currentExpenses && (
        <Toggle
          label="Nota gögn úr Current Expense Report"
          checked={useActualData}
          onChange={setUseActualData}
        />
      )}
      {/* Rest of component */}
    </div>
  );
}
```

### 6.4 Integration with Commute Calculator

**Usage Pattern:**
```typescript
// In Commute Calculator
function CommuteCalculator() {
  const { getCommuteExpenses, hasCurrentExpenses } = useCalculator();

  const actualCommuteCost = hasCurrentExpenses() ? getCommuteExpenses() : null;

  return (
    <div>
      {actualCommuteCost !== null && (
        <Alert variant="info">
          <p>Núverandi samgöngukostnaður þinn: {formatCurrency(actualCommuteCost)}/mán</p>
          <p>Notum þessi gögn til að bera saman við aðra valkosti.</p>
        </Alert>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

### 6.5 Event Emission for Real-time Updates

```typescript
// In CalculatorContext
const updateLineItem = useCallback((
  categoryId: string,
  lineItemId: string,
  updates: Partial<LineItem>
) => {
  setCurrentExpenses(prev => {
    if (!prev) return prev;

    const updated = {
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              lineItems: cat.lineItems.map(item =>
                item.id === lineItemId ? { ...item, ...updates } : item
              ),
            }
          : cat
      ),
      lastUpdated: new Date(),
    };

    // Emit event for other calculators
    window.dispatchEvent(new CustomEvent('currentExpensesUpdated', {
      detail: { expenses: updated }
    }));

    return updated;
  });
}, []);
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateLineItem = (lineItem: Partial<LineItem>): ValidationResult => {
  // Check for negative values
  if (lineItem.amount !== undefined && lineItem.amount < 0) {
    return { valid: false, error: 'Upphæð getur ekki verið neikvæð' };
  }

  // Check for empty label
  if (lineItem.label !== undefined && lineItem.label.trim() === '') {
    return { valid: false, error: 'Lýsing þarf að vera útfyllt' };
  }

  // Check for reasonable amount
  if (lineItem.amount !== undefined && lineItem.amount > 10000000) {
    return {
      valid: false,
      error: 'Upphæð virðist óeðlilega há. Vinsamlegast staðfestu.',
      warning: true,
    };
  }

  return { valid: true };
};
```

### 7.2 LocalStorage Errors

```typescript
const saveCurrentExpenses = (expenses: CurrentExpenseReport) => {
  try {
    const currentState = safeGetItem<StoredState>(STORAGE_KEY) || {};
    safeSetItem(STORAGE_KEY, {
      ...currentState,
      currentExpenses: {
        categories: expenses.categories,
        lastUpdated: expenses.lastUpdated.toISOString(),
        version: expenses.version,
      },
    });
  } catch (error) {
    console.error('Failed to save current expenses:', error);
    showToast({
      type: 'warning',
      message: 'Gat ekki vistað útgjöld - breytingar tapast þegar vafra er lokað',
    });
  }
};
```

### 7.3 Migration for Schema Changes

```typescript
const migrateCurrentExpenses = (stored: any): CurrentExpenseReport => {
  const version = stored.version || 1;

  // Migration from v1 to v2 (example: add isRecurring field)
  if (version < 2) {
    stored.categories = stored.categories.map((cat: any) => ({
      ...cat,
      lineItems: cat.lineItems.map((item: any) => ({
        ...item,
        isRecurring: item.isRecurring ?? false,
      })),
    }));
    stored.version = 2;
  }

  return stored as CurrentExpenseReport;
};
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Dashboard View:**
```
┌─────────────────────────────────────────────────────────────┐
│  Rauntímaútgjöld                          [✏️ Breyta]       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ Mánaðarútgjöld  │  │ Ársútgjöld      │  │ Lífsorka     ││
│  │  450.000 kr     │  │  5.400.000 kr   │  │  180 klst    ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                              │
│  Top 10 útgjöld:                                             │
│  1. 🏠 Leiga: 120.000 kr (48 klst)                          │
│  2. 🚗 Car payment: 30.000 kr (12 klst)                     │
│  3. 🍽️ Bónus groceries: 30.000 kr (12 klst)                │
│  4. 💡 Rafmagn: 25.000 kr (10 klst)                         │
│  5. 🍽️ Veitingastaðir: 25.000 kr (10 klst)                 │
│  ...                                                         │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Category Breakdown                                   │ │
│  │  [Pie chart showing percentages]                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
│  Tillögur:                                                   │
│  ⚠️ Húsnæði er 33% af útgjöldum                             │
│     → Skoða Housing Calculator fyrir valmöguleika           │
│  ℹ️ Áskriftir eru 15.000 kr/mán (6 klst)                    │
│     → Skoða Subscription Burn Meter til að fínstilla        │
└─────────────────────────────────────────────────────────────┘
```

**Editor View (Accordion-based):**
```
┌─────────────────────────────────────────────────────────────┐
│  Rauntímaútgjöld - Breyta                [📊 Yfirlit]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🏠 Húsnæði                     150.000 kr (60 klst)    ▼   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Leiga                                                 │ │
│  │  ┌─────────────────┐  48 klst  [🗑️]                   │ │
│  │  │ 120.000      kr │                                   │ │
│  │  └─────────────────┘                                   │ │
│  │                                                         │ │
│  │  Fasteignagjöld                                        │ │
│  │  ┌─────────────────┐  8 klst   [🗑️]                   │ │
│  │  │  20.000      kr │                                   │ │
│  │  └─────────────────┘                                   │ │
│  │                                                         │ │
│  │  Húseigendatrygging                                    │ │
│  │  ┌─────────────────┐  4 klst   [🗑️]                   │ │
│  │  │  10.000      kr │                                   │ │
│  │  └─────────────────┘                                   │ │
│  │                                                         │ │
│  │  [+ Bæta við línu]                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🍽️ Matur                        85.000 kr (34 klst)    ▶   │
│                                                              │
│  🚗 Samgöngur                    45.000 kr (18 klst)    ▶   │
│                                                              │
│  ...                                                         │
│                                                              │
│  [+ Bæta við flokki]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- Dashboard: Stacked cards, single column
- Editor: Full-width accordions, simplified layout
- Charts: Simplified donut chart

**Tablet (640px-1024px):**
- Dashboard: Two-column layout for stats
- Editor: Full-width accordions with better spacing
- Charts: Full donut chart with legend

**Desktop (>1024px):**
- Dashboard: Three-column stats, sidebar for charts
- Editor: Accordions with inline editing
- Charts: Full visualization with details

### 8.3 Color Coding System

```typescript
const CATEGORY_COLORS: Record<string, string> = {
  husnaedi: 'text-blue-600 bg-blue-50 border-blue-200',
  matur: 'text-green-600 bg-green-50 border-green-200',
  samgongur: 'text-orange-600 bg-orange-50 border-orange-200',
  veitur: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  askriftir: 'text-purple-600 bg-purple-50 border-purple-200',
  heilsa: 'text-red-600 bg-red-50 border-red-200',
  tryggingar: 'text-teal-600 bg-teal-50 border-teal-200',
  personuleg: 'text-pink-600 bg-pink-50 border-pink-200',
  afthreying: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  born: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  annad: 'text-gray-600 bg-gray-50 border-gray-200',
};
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `currentExpenses.test.ts` - Calculation logic
- `currentExpenseRecommendations.test.ts` - Recommendation engine
- `CurrentExpenseReportCalculator.test.tsx` - Main component

**Test Coverage:**
```typescript
describe('calculateTotalExpenses', () => {
  it('sums all line items across categories', () => {
    const categories: ExpenseCategory[] = [
      {
        id: 'husnaedi',
        name: 'Húsnæði',
        icon: '🏠',
        lineItems: [
          { id: '1', label: 'Rent', amount: 120000, isRecurring: true },
          { id: '2', label: 'Insurance', amount: 10000, isRecurring: true },
        ],
        isCustom: false,
        isHidden: false,
        order: 1,
      },
      {
        id: 'matur',
        name: 'Matur',
        icon: '🍽️',
        lineItems: [
          { id: '3', label: 'Groceries', amount: 50000, isRecurring: false },
        ],
        isCustom: false,
        isHidden: false,
        order: 2,
      },
    ];

    const result = calculateTotalExpenses(categories);

    expect(result.monthly).toBe(180000);
    expect(result.annual).toBe(2160000);
  });

  it('excludes hidden categories', () => {
    const categories: ExpenseCategory[] = [
      {
        id: 'husnaedi',
        lineItems: [{ id: '1', label: 'Rent', amount: 120000, isRecurring: true }],
        isHidden: false,
        // ...
      },
      {
        id: 'born',
        lineItems: [{ id: '2', label: 'Daycare', amount: 50000, isRecurring: true }],
        isHidden: true, // Hidden
        // ...
      },
    ];

    const result = calculateTotalExpenses(categories);

    expect(result.monthly).toBe(120000); // Only housing
  });
});

describe('generateRecommendations', () => {
  it('recommends Subscription Burn Meter when subscriptions > 10k', () => {
    // Test implementation
  });

  it('recommends Housing Calculator when housing > 30%', () => {
    // Test implementation
  });
});
```

### 9.2 Integration Testing

```typescript
describe('CurrentExpenseReport Integration', () => {
  it('persists expenses to localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addLineItem('husnaedi', {
        label: 'Rent',
        amount: 120000,
        isRecurring: true,
      });
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain('Rent');
      expect(stored).toContain('120000');
    });
  });

  it('exposes getSubscriptions for other calculators', () => {
    // Test implementation
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on line item inputs', () => {
    const { getByLabelText } = render(<CategoryExpenseEditor />);

    expect(getByLabelText(/bæta við línu/i)).toBeInTheDocument();
  });

  it('accordion is keyboard navigable', async () => {
    // Test implementation
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive calculations
const currentExpenseResults = useMemo(() => {
  if (!currentExpenses) return null;
  return calculateCurrentExpenseResults(
    currentExpenses,
    actualHourlyWage,
    expenseBaseline
  );
}, [currentExpenses, actualHourlyWage, expenseBaseline]);

// Debounce line item updates
const debouncedUpdateLineItem = useMemo(
  () => debounce((categoryId: string, lineItemId: string, updates: Partial<LineItem>) => {
    updateLineItem(categoryId, lineItemId, updates);
  }, 300),
  [updateLineItem]
);
```

### 10.2 Rendering Performance

```typescript
// Memoize line item rows
const LineItemRow = React.memo(({ lineItem, onUpdate, onDelete }: Props) => {
  // ...
});

// Virtualize if many line items (>50 total)
{totalLineItems > 50 && (
  <VirtualizedList items={allLineItems} renderItem={renderLineItemRow} />
)}
```

### 10.3 Performance Budget

- Calculation time: <100ms
- Input response: <50ms
- Chart rendering: <300ms
- Accordion expand/collapse: <200ms

---

## 11. Accessibility Implementation

### 11.1 ARIA Implementation

```typescript
// Category accordion
<div role="region" aria-labelledby={`category-${category.id}-header`}>
  <h3 id={`category-${category.id}-header`}>
    <button
      aria-expanded={expanded}
      aria-controls={`category-${category.id}-content`}
    >
      {category.icon} {category.name}
    </button>
  </h3>

  <div id={`category-${category.id}-content`} hidden={!expanded}>
    {/* Line items */}
  </div>
</div>

// Line item input
<label htmlFor={`line-item-${lineItem.id}`}>
  {lineItem.label}
</label>
<CurrencyInput
  id={`line-item-${lineItem.id}`}
  value={lineItem.amount}
  onChange={handleChange}
  aria-describedby={`line-item-${lineItem.id}-life-energy`}
/>
<span id={`line-item-${lineItem.id}-life-energy`} className="sr-only">
  {lifeEnergyHours && `${lifeEnergyHours} klst/mán`}
</span>
```

---

## 12. Technical Decisions

### 12.1 Granular Line Items vs. Category Totals

**Decision**: Use line-item tracking within categories

**Rationale**:
- Provides maximum insight into spending patterns
- Enables identification of specific optimization opportunities
- Allows feeding detailed data to other calculators
- Supports recommendation engine with specific data

**Trade-offs**:
- More data entry required
- Slightly more complex data structure

### 12.2 Accordion vs. Tabbed Interface

**Decision**: Use accordion-based category editor

**Rationale**:
- Natural organization by category
- All categories visible at once (overview)
- Minimal scrolling to access any category
- Familiar pattern for users

### 12.3 Dashboard + Editor Split

**Decision**: Separate dashboard (summary) and editor (detailed input)

**Rationale**:
- Dashboard provides quick insights without data entry clutter
- Editor optimized for efficient data entry
- Clear mental model for users
- Better mobile experience

### 12.4 Integration via Context API

**Decision**: Expose data through CalculatorContext with helper methods

**Rationale**:
- Consistent with existing architecture
- Type-safe access to data
- Event emission for real-time updates
- Simple API for other calculators

---

## 13. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Granular Expense Tracking | CategoryExpenseEditor with LineItem structure | Category accordion with line item rows |
| **US-2**: Icelandic Categories | DEFAULT_CURRENT_EXPENSE_CATEGORIES | 11 pre-defined categories with Icelandic vendors |
| **US-3**: Life Energy Per Category | calculateLifeEnergy() | Hours displayed per line item and category total |
| **US-4**: Compare to Baseline | BaselineComparisonView, compareToBaseline() | Tier match indicator + category comparison table |
| **US-5**: Feed Data to Other Calculators | Integration API (getSubscriptions, getCommuteExpenses, etc.) | Context methods for data access |
| **US-6**: Smart Recommendations | RecommendationPanel, generateRecommendations() | Pattern analysis with actionable suggestions |
| **FR-1**: Granular Categories | ExpenseCategory with LineItem[] | 11 categories, custom line items supported |
| **FR-2**: Expense Input Interface | CategoryExpenseEditor | Accordion-based category editor |
| **FR-3**: Calculations | currentExpenses.ts calculation functions | Totals, life energy, baseline comparison |
| **FR-4**: Dashboard | ExpenseDashboard | Stats, charts, top expenses, recommendations |
| **FR-5**: Data Integration API | Context integration methods | getCurrentExpenses(), getSubscriptions(), etc. |
| **FR-6**: Smart Recommendations | generateRecommendations() | 4 recommendation types with priorities |

---

## 14. Implementation Risks and Mitigations

### Risk 1: Too Much Data Entry

**Risk**: Users may find entering all line items tedious.

**Mitigation**:
- Pre-populate suggested line items per category
- Allow quick "Add common items" for each category
- Support import from CSV (future)
- Provide templates for common scenarios

### Risk 2: Integration Complexity

**Risk**: Multiple calculators depending on Current Expense data may create tight coupling.

**Mitigation**:
- Clean API with clear contracts
- Event-driven updates instead of polling
- Graceful handling when data not available
- Each calculator can function independently

### Risk 3: Recommendation Overload

**Risk**: Too many recommendations may overwhelm users.

**Mitigation**:
- Limit to top 3-4 recommendations
- Priority-based sorting
- Dismissable recommendations
- Show only actionable recommendations

### Risk 4: Performance with Many Line Items

**Risk**: Rendering/calculating with 100+ line items may slow down.

**Mitigation**:
- Virtualized lists for long item lists
- Memoized calculations
- Debounced inputs
- Lazy loading of collapsed categories

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
- [x] Integration hooks designed
- [x] Event system for real-time updates
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
