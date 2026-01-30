# Design: Expense Baseline Tool

## Document Information

- **Feature Name**: Expense Baseline Tool (Útgjaldagrunnur)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Requirements Document**: requirements-expense-baseline.md

---

## 1. System Overview

### 1.1 Purpose

The Expense Baseline Tool is the foundation calculator for the FIRE planning suite. It enables users to define their monthly expenses at three spending tiers (Barebones/Comfortable/Deluxe) across multiple categories. This baseline serves as the input for FI Number calculations, savings rate analysis, and other FIRE planning tools.

### 1.2 Architecture Style

**Client-Side React Application**
- Next.js with App Router
- TypeScript for type safety
- React Context for state management (CalculatorContext)
- LocalStorage for data persistence
- No backend/server requirements

### 1.3 Key Design Principles

1. **Foundation Tool**: Designed to be consumed by other calculators
2. **Three-Tier Philosophy**: Aligns with "Your Money or Your Life" tiered lifestyle planning
3. **Privacy-First**: All data stored locally, no server transmission
4. **Guided Experience**: Step-by-step wizard for easy setup
5. **Quick Edit Mode**: Returning users can edit directly without wizard
6. **Integration-Ready**: Exposes API for other calculators to consume
7. **Icelandic-First**: Local categories and realistic ISK defaults

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ Wizard Mode      │  │ Quick Edit Mode  │  │ Summary Display      │  │
│  │ (First-time)     │  │ (Returning)      │  │ (Results)            │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘  │
└───────────┼──────────────────────┼──────────────────────┼───────────────┘
            │                      │                      │
            ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CalculatorContext (State Layer)                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  expenseBaseline: ExpenseBaseline                                │   │
│  │    - categories: ExpenseCategory[]                               │   │
│  │    - customCategories: ExpenseCategory[]                         │   │
│  │    - hiddenCategories: string[]                                  │   │
│  │    - lastUpdated: Date                                           │   │
│  │  expenseBaselineResults: ExpenseBaselineResults                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Integration API:                                                │   │
│  │    - getExpenseBaseline(): ExpenseBaseline                       │   │
│  │    - getExpenseByTier(tier): number                              │   │
│  │    - getTierSelector(): TierSelectorComponent                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Calculation Engine                                  │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│  │ Total Calculator  │  │ Life Energy       │  │ Percentage        │  │
│  │ (per tier)        │  │ Calculator        │  │ Breakdown         │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘  │
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
ExpenseBaselineCalculator (Page Component)
├── WizardModeContainer (First-time users)
│   ├── WizardProgress (Step indicator)
│   ├── CategoryWizardStep
│   │   ├── CategoryHeader (Icon, Name, Description)
│   │   ├── TierInputGroup
│   │   │   ├── CurrencyInput (Barebones)
│   │   │   ├── CurrencyInput (Comfortable)
│   │   │   └── CurrencyInput (Deluxe)
│   │   └── DefaultValueHint
│   ├── WizardNavigation (Back/Next/Skip)
│   └── WizardSummaryStep
│       ├── TierSummaryCard (Barebones)
│       ├── TierSummaryCard (Comfortable)
│       ├── TierSummaryCard (Deluxe)
│       └── ConfirmButton
│
├── QuickEditModeContainer (Returning users)
│   ├── TierTabSelector (Barebones | Comfortable | Deluxe)
│   ├── CategoryEditList
│   │   ├── CategoryEditRow
│   │   │   ├── CategoryLabel
│   │   │   ├── CurrencyInput
│   │   │   └── LifeEnergyDisplay (if AWH available)
│   │   └── AddCustomCategoryButton
│   ├── HiddenCategoriesManager
│   └── TierTotalsDisplay
│
├── ResultsSummarySection
│   ├── TierComparisonChart (Bar chart comparing tiers)
│   ├── CategoryBreakdownChart (Pie/donut per tier)
│   ├── LifeEnergyComparison (Work hours per tier)
│   └── TierDifferenceTable (ISK and hours diff between tiers)
│
├── TierSelector (Embeddable component for other calculators)
│   ├── TierButton (Barebones)
│   ├── TierButton (Comfortable)
│   └── TierButton (Deluxe)
│
└── EducationalPanel (Collapsible)
    ├── ThreeTierExplainer
    ├── CategoryDescriptions
    └── FAQSection
```

### 2.3 Data Flow

**Input Flow (Wizard Mode):**
```
Category Step → Tier Inputs → Validation → Local State → Next Step
                                               ↓
Final Step → Review → Confirm → CalculatorContext → LocalStorage
```

**Input Flow (Quick Edit Mode):**
```
Category Input → Validation → CalculatorContext → Debounced LocalStorage
                                    ↓
                           Recalculate Results → UI Update
```

**Integration Flow:**
```
Other Calculator Load → useCalculator() → getExpenseBaseline()
                                              ↓
                                    Check if baseline exists
                                              ↓
                              ┌───────────────┴───────────────┐
                              ↓                               ↓
                        Baseline Found                  No Baseline
                              ↓                               ↓
                    Show TierSelector              Prompt to set up baseline
                              ↓
                    User selects tier → getExpenseByTier(tier) → Use value
```

---

## 3. Component Design

### 3.1 ExpenseBaselineCalculator (Main Component)

**Responsibility**: Page-level container and mode coordinator

**Interface:**
```typescript
interface ExpenseBaselineCalculatorProps {
  // No props - gets data from CalculatorContext
}

// Determined from state
type ViewMode = 'wizard' | 'quickEdit';

// View mode is determined by:
// - 'wizard' if no baseline exists or user clicks "Start Fresh"
// - 'quickEdit' if baseline exists
```

**Key Features:**
- Detects if user has existing baseline (show Quick Edit) or not (show Wizard)
- Provides toggle between modes
- Coordinates calculations across all categories
- Handles localStorage persistence

---

### 3.2 WizardModeContainer Component

**Responsibility**: Guide first-time users through category-by-category setup

**Interface:**
```typescript
interface WizardModeContainerProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface WizardState {
  currentStep: number; // 0-10 (10 categories + summary)
  values: Record<string, TierValues>;
  skippedCategories: string[];
}

interface TierValues {
  barebones: number;
  comfortable: number;
  deluxe: number;
}
```

**Step Flow:**
1. Introduction (Step 0)
2. Húsnæði - Housing (Step 1)
3. Matur - Food (Step 2)
4. Samgöngur - Transport (Step 3)
5. Heilsa - Healthcare (Step 4)
6. Tryggingar - Insurance (Step 5)
7. Veitur - Utilities (Step 6)
8. Persónuleg - Personal (Step 7)
9. Afþreying - Entertainment (Step 8)
10. Sparnaður - Savings (Step 9)
11. Annað - Other (Step 10)
12. Summary & Confirm (Step 11)

**Features:**
- Progress bar showing completion
- Back/Next/Skip navigation
- Pre-filled with Icelandic defaults (user can modify or accept)
- "Use defaults" quick action per category
- Validation before proceeding

---

### 3.3 CategoryWizardStep Component

**Responsibility**: Single category input in wizard mode

**Interface:**
```typescript
interface CategoryWizardStepProps {
  category: ExpenseCategoryConfig;
  values: TierValues;
  onChange: (values: TierValues) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface ExpenseCategoryConfig {
  id: string;
  nameIs: string; // Icelandic name
  nameEn: string; // English name (for reference)
  icon: string; // Emoji
  description: string; // Icelandic help text
  defaults: TierValues; // Icelandic default values
  subcategories?: string[]; // Optional subcategories
}
```

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  🏠 Húsnæði (Housing)                                   │
│  Leiga, húsnæðislán, fasteignagjöld, viðhald           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Lágmarks (Barebones)                                   │
│  ┌─────────────────────────────┐                       │
│  │ 120.000                  kr │  ← Default: 120.000   │
│  └─────────────────────────────┘                       │
│                                                         │
│  Þægilegt (Comfortable)                                 │
│  ┌─────────────────────────────┐                       │
│  │ 200.000                  kr │  ← Default: 200.000   │
│  └─────────────────────────────┘                       │
│                                                         │
│  Lúxus (Deluxe)                                         │
│  ┌─────────────────────────────┐                       │
│  │ 350.000                  kr │  ← Default: 350.000   │
│  └─────────────────────────────┘                       │
│                                                         │
│  [← Til baka]    [Nota sjálfgefið]    [Næsta →]        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.4 QuickEditModeContainer Component

**Responsibility**: Tabbed editing interface for returning users

**Interface:**
```typescript
interface QuickEditModeContainerProps {
  onStartWizard: () => void; // Reset and start wizard
}

interface QuickEditState {
  activeTier: 'barebones' | 'comfortable' | 'deluxe';
  expandedCategory: string | null;
}
```

**Features:**
- Three tabs for each tier
- Inline editing of all categories
- Add custom categories
- Hide/show default categories
- Real-time totals as you type
- Life energy display per category (if AWH available)

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  [Lágmarks]  [Þægilegt]  [Lúxus]        Total: 520.000 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🏠 Húsnæði              ┌─────────────┐  (80 klst)    │
│                          │ 200.000  kr │               │
│                          └─────────────┘               │
│  🍽️ Matur                ┌─────────────┐  (28 klst)    │
│                          │  70.000  kr │               │
│                          └─────────────┘               │
│  🚗 Samgöngur            ┌─────────────┐  (16 klst)    │
│                          │  40.000  kr │               │
│                          └─────────────┘               │
│  ...                                                    │
│                                                         │
│  [+ Bæta við flokki]                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.5 TierSelector Component (Embeddable)

**Responsibility**: Reusable component for other calculators to select a tier

**Interface:**
```typescript
interface TierSelectorProps {
  selectedTier: ExpenseTier | null;
  onSelectTier: (tier: ExpenseTier) => void;
  showExpenseAmount?: boolean; // Show monthly expense for each tier
  compact?: boolean; // Smaller version for sidebar usage
  disabled?: boolean;
}

type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';
```

**Usage Example (in FI Number Calculator):**
```typescript
function FINumberCalculator() {
  const { expenseBaseline } = useCalculator();
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');

  const monthlyExpenses = expenseBaseline
    ? getExpenseByTier(expenseBaseline, selectedTier)
    : 0;

  return (
    <div>
      <TierSelector
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        showExpenseAmount
      />
      {/* Use monthlyExpenses in FI calculations */}
    </div>
  );
}
```

**Visual Layout:**
```
┌───────────────────────────────────────────────────────────┐
│  Veldu útgjaldagrunn:                                     │
│                                                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐            │
│  │ Lágmarks  │  │ Þægilegt  │  │  Lúxus    │            │
│  │ 250.000   │  │ 520.000   │  │ 1.000.000 │            │
│  │  kr/mán   │  │  kr/mán   │  │   kr/mán  │            │
│  └───────────┘  └───────────┘  └───────────┘            │
│       ○              ●              ○                    │
└───────────────────────────────────────────────────────────┘
```

---

### 3.6 ResultsSummarySection Component

**Responsibility**: Visual summary of expense baseline with charts

**Interface:**
```typescript
interface ResultsSummarySectionProps {
  baseline: ExpenseBaseline;
  results: ExpenseBaselineResults;
  actualHourlyWage: number | null;
}
```

**Sub-components:**

1. **TierComparisonChart**: Horizontal bar chart comparing total expenses per tier
2. **CategoryBreakdownChart**: Pie/donut chart showing category distribution (with tier toggle)
3. **LifeEnergyComparison**: Work hours required per tier per month/year
4. **TierDifferenceTable**: Shows difference between tiers in ISK and hours

---

## 4. Data Models

### 4.1 Core Data Types

```typescript
/**
 * Expense Baseline Types
 */

export type ExpenseTier = 'barebones' | 'comfortable' | 'deluxe';

export interface TierValues {
  barebones: number; // ISK monthly
  comfortable: number; // ISK monthly
  deluxe: number; // ISK monthly
}

export interface ExpenseCategory {
  id: string; // Unique identifier
  name: string; // Icelandic display name
  icon: string; // Emoji icon
  values: TierValues;
  isCustom: boolean; // User-created category
  isHidden: boolean; // Hidden from display
  order: number; // Display order
}

export interface ExpenseBaseline {
  categories: ExpenseCategory[];
  lastUpdated: Date;
  wizardCompleted: boolean; // Has user completed wizard at least once
  version: number; // Schema version for migrations
}

export interface ExpenseBaselineResults {
  // Totals per tier
  totals: TierValues;

  // Annual totals
  annualTotals: TierValues;

  // Percentage breakdown per category per tier
  percentageBreakdown: Record<string, TierValues>; // category id -> percentages

  // Life energy (null if AWH not available)
  lifeEnergy: {
    monthly: TierValues; // Work hours per month
    annual: TierValues; // Work hours per year
    perCategory: Record<string, TierValues>; // category id -> hours
  } | null;

  // Tier differences
  tierDifferences: {
    bareToComfortable: { isk: number; hours: number | null };
    comfortableToDeluxe: { isk: number; hours: number | null };
    bareToDeluxe: { isk: number; hours: number | null };
  };

  // Category count
  categoryCount: number;
  activeCategories: number; // Non-hidden
}
```

### 4.2 Default Categories Configuration

```typescript
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[] = [
  {
    id: 'husnaedi',
    nameIs: 'Húsnæði',
    nameEn: 'Housing',
    icon: '🏠',
    description: 'Leiga, húsnæðislán, fasteignagjöld, viðhald, húseigendatrygging',
    defaults: { barebones: 120000, comfortable: 200000, deluxe: 350000 },
    subcategories: ['Leiga/afborgun', 'Fasteignagjöld', 'Viðhald', 'Trygging'],
  },
  {
    id: 'matur',
    nameIs: 'Matur',
    nameEn: 'Food',
    icon: '🍽️',
    description: 'Matvöruinnkaup, veitingastaðir, kaffi, sælgæti',
    defaults: { barebones: 40000, comfortable: 70000, deluxe: 120000 },
    subcategories: ['Matvörur', 'Veitingastaðir', 'Kaffi/sælgæti'],
  },
  {
    id: 'samgongur',
    nameIs: 'Samgöngur',
    nameEn: 'Transport',
    icon: '🚗',
    description: 'Bílakostnaður, eldsneyti, tryggingar, almenningssamgöngur',
    defaults: { barebones: 15000, comfortable: 40000, deluxe: 80000 },
    subcategories: ['Bílakaup/leiga', 'Eldsneyti', 'Trygging', 'Strætó'],
  },
  {
    id: 'heilsa',
    nameIs: 'Heilsa',
    nameEn: 'Healthcare',
    icon: '🏥',
    description: 'Sjúkratryggingar, lyf, tannlækningar, sjónlækningar',
    defaults: { barebones: 5000, comfortable: 15000, deluxe: 30000 },
    subcategories: ['Lyf', 'Tannlækningar', 'Sjónlækningar', 'Annað'],
  },
  {
    id: 'tryggingar',
    nameIs: 'Tryggingar',
    nameEn: 'Insurance',
    icon: '🛡️',
    description: 'Líftrygging, örorkutrygging, aðrar persónutryggingar',
    defaults: { barebones: 5000, comfortable: 15000, deluxe: 25000 },
    subcategories: ['Líftrygging', 'Örorkutrygging', 'Annað'],
  },
  {
    id: 'veitur',
    nameIs: 'Veitur',
    nameEn: 'Utilities',
    icon: '💡',
    description: 'Rafmagn, vatn, hiti, internet, sími',
    defaults: { barebones: 20000, comfortable: 35000, deluxe: 50000 },
    subcategories: ['Rafmagn', 'Hiti/vatn', 'Internet', 'Sími'],
  },
  {
    id: 'personuleg',
    nameIs: 'Persónuleg',
    nameEn: 'Personal',
    icon: '👤',
    description: 'Fatnaður, snyrtivörur, persónuleg umhirða',
    defaults: { barebones: 10000, comfortable: 25000, deluxe: 50000 },
    subcategories: ['Fatnaður', 'Snyrtivörur', 'Hárgreiðsla'],
  },
  {
    id: 'afthreying',
    nameIs: 'Afþreying',
    nameEn: 'Entertainment',
    icon: '🎬',
    description: 'Áskriftir, áhugamál, ferðalög, félagslíf',
    defaults: { barebones: 10000, comfortable: 40000, deluxe: 100000 },
    subcategories: ['Streym/áskriftir', 'Áhugamál', 'Ferðalög', 'Félagslíf'],
  },
  {
    id: 'sparnadur',
    nameIs: 'Sparnaður',
    nameEn: 'Savings',
    icon: '💰',
    description: 'Neyðarsjóður, eftirlaunasjóður, fjárfestingar',
    defaults: { barebones: 20000, comfortable: 60000, deluxe: 150000 },
    subcategories: ['Neyðarsjóður', 'Lífeyrissjóður', 'Fjárfestingar'],
  },
  {
    id: 'annad',
    nameIs: 'Annað',
    nameEn: 'Other',
    icon: '📦',
    description: 'Ýmislegt, óvænt útgjöld, gjafir',
    defaults: { barebones: 5000, comfortable: 20000, deluxe: 45000 },
    subcategories: ['Ýmislegt', 'Óvænt', 'Gjafir'],
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

  // Expense Baseline
  expenseBaseline: ExpenseBaseline | null;
  expenseBaselineResults: ExpenseBaselineResults | null;

  // Expense Baseline Actions
  updateExpenseBaseline: (baseline: Partial<ExpenseBaseline>) => void;
  updateCategoryValues: (categoryId: string, values: Partial<TierValues>) => void;
  addCustomCategory: (name: string, icon: string, values: TierValues) => void;
  removeCategory: (categoryId: string) => void;
  toggleCategoryVisibility: (categoryId: string) => void;
  resetToDefaults: () => void;
  clearExpenseBaseline: () => void;

  // Expense Baseline API (for other calculators)
  getExpenseBaseline: () => ExpenseBaseline | null;
  getExpenseByTier: (tier: ExpenseTier) => number;
  hasExpenseBaseline: () => boolean;
}
```

### 4.4 LocalStorage Schema

```typescript
/**
 * Stored State (extends existing StoredState)
 */
interface StoredState {
  // ... existing properties

  expenseBaseline?: {
    categories: StoredExpenseCategory[];
    lastUpdated: string; // ISO date string
    wizardCompleted: boolean;
    version: number;
  };
}

interface StoredExpenseCategory {
  id: string;
  name: string;
  icon: string;
  values: TierValues;
  isCustom: boolean;
  isHidden: boolean;
  order: number;
}
```

---

## 5. Calculation Logic

### 5.1 Total Calculator

**File**: `/src/lib/calculations/expenseBaseline.ts`

```typescript
/**
 * Calculate total expenses per tier
 */
export const calculateTierTotals = (
  categories: ExpenseCategory[]
): TierValues => {
  const activeCategories = categories.filter(c => !c.isHidden);

  return {
    barebones: activeCategories.reduce((sum, c) => sum + c.values.barebones, 0),
    comfortable: activeCategories.reduce((sum, c) => sum + c.values.comfortable, 0),
    deluxe: activeCategories.reduce((sum, c) => sum + c.values.deluxe, 0),
  };
};

/**
 * Calculate annual totals
 */
export const calculateAnnualTotals = (monthlyTotals: TierValues): TierValues => ({
  barebones: monthlyTotals.barebones * 12,
  comfortable: monthlyTotals.comfortable * 12,
  deluxe: monthlyTotals.deluxe * 12,
});
```

### 5.2 Percentage Breakdown Calculator

```typescript
/**
 * Calculate percentage each category represents of total
 */
export const calculatePercentageBreakdown = (
  categories: ExpenseCategory[],
  totals: TierValues
): Record<string, TierValues> => {
  const result: Record<string, TierValues> = {};

  const activeCategories = categories.filter(c => !c.isHidden);

  for (const category of activeCategories) {
    result[category.id] = {
      barebones: totals.barebones > 0
        ? (category.values.barebones / totals.barebones) * 100
        : 0,
      comfortable: totals.comfortable > 0
        ? (category.values.comfortable / totals.comfortable) * 100
        : 0,
      deluxe: totals.deluxe > 0
        ? (category.values.deluxe / totals.deluxe) * 100
        : 0,
    };
  }

  return result;
};
```

### 5.3 Life Energy Calculator

```typescript
/**
 * Calculate life energy (work hours) for expenses
 * Requires actual hourly wage from main calculator
 */
export const calculateLifeEnergy = (
  totals: TierValues,
  categories: ExpenseCategory[],
  actualHourlyWage: number | null
): ExpenseBaselineResults['lifeEnergy'] | null => {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  const activeCategories = categories.filter(c => !c.isHidden);

  // Monthly hours per tier
  const monthly: TierValues = {
    barebones: totals.barebones / actualHourlyWage,
    comfortable: totals.comfortable / actualHourlyWage,
    deluxe: totals.deluxe / actualHourlyWage,
  };

  // Annual hours
  const annual: TierValues = {
    barebones: monthly.barebones * 12,
    comfortable: monthly.comfortable * 12,
    deluxe: monthly.deluxe * 12,
  };

  // Per category
  const perCategory: Record<string, TierValues> = {};
  for (const category of activeCategories) {
    perCategory[category.id] = {
      barebones: category.values.barebones / actualHourlyWage,
      comfortable: category.values.comfortable / actualHourlyWage,
      deluxe: category.values.deluxe / actualHourlyWage,
    };
  }

  return { monthly, annual, perCategory };
};
```

### 5.4 Tier Difference Calculator

```typescript
/**
 * Calculate differences between tiers
 */
export const calculateTierDifferences = (
  totals: TierValues,
  actualHourlyWage: number | null
): ExpenseBaselineResults['tierDifferences'] => {
  const iskBareToComf = totals.comfortable - totals.barebones;
  const iskConfToDeluxe = totals.deluxe - totals.comfortable;
  const iskBareToDeluxe = totals.deluxe - totals.barebones;

  return {
    bareToComfortable: {
      isk: iskBareToComf,
      hours: actualHourlyWage ? iskBareToComf / actualHourlyWage : null,
    },
    comfortableToDeluxe: {
      isk: iskConfToDeluxe,
      hours: actualHourlyWage ? iskConfToDeluxe / actualHourlyWage : null,
    },
    bareToDeluxe: {
      isk: iskBareToDeluxe,
      hours: actualHourlyWage ? iskBareToDeluxe / actualHourlyWage : null,
    },
  };
};
```

### 5.5 Main Calculation Orchestrator

```typescript
/**
 * Calculate all expense baseline results
 */
export const calculateExpenseBaselineResults = (
  baseline: ExpenseBaseline,
  actualHourlyWage: number | null
): ExpenseBaselineResults => {
  const { categories } = baseline;

  // Calculate totals
  const totals = calculateTierTotals(categories);
  const annualTotals = calculateAnnualTotals(totals);

  // Calculate breakdowns
  const percentageBreakdown = calculatePercentageBreakdown(categories, totals);

  // Calculate life energy
  const lifeEnergy = calculateLifeEnergy(totals, categories, actualHourlyWage);

  // Calculate tier differences
  const tierDifferences = calculateTierDifferences(totals, actualHourlyWage);

  // Count categories
  const activeCategories = categories.filter(c => !c.isHidden);

  return {
    totals,
    annualTotals,
    percentageBreakdown,
    lifeEnergy,
    tierDifferences,
    categoryCount: categories.length,
    activeCategories: activeCategories.length,
  };
};
```

### 5.6 Helper Functions for Other Calculators

```typescript
/**
 * Get monthly expense for a specific tier
 * Used by FI Number, Savings Rate, and other calculators
 */
export const getExpenseByTier = (
  baseline: ExpenseBaseline,
  tier: ExpenseTier
): number => {
  const totals = calculateTierTotals(baseline.categories);
  return totals[tier];
};

/**
 * Get annual expense for a specific tier
 */
export const getAnnualExpenseByTier = (
  baseline: ExpenseBaseline,
  tier: ExpenseTier
): number => {
  return getExpenseByTier(baseline, tier) * 12;
};

/**
 * Check if user has set up expense baseline
 */
export const hasExpenseBaseline = (baseline: ExpenseBaseline | null): boolean => {
  if (!baseline) return false;
  return baseline.wizardCompleted;
};
```

---

## 6. Integration Strategy

### 6.1 Integration with Actual Hourly Wage Calculator

**Data Access Pattern:**
```typescript
// In ExpenseBaselineCalculator component
const { results, expenseBaseline, expenseBaselineResults } = useCalculator();

// Get actual hourly wage
const actualHourlyWage = results?.actualHourlyWage || null;

// Life energy displayed when AWH available
{actualHourlyWage && expenseBaselineResults?.lifeEnergy && (
  <LifeEnergyDisplay
    lifeEnergy={expenseBaselineResults.lifeEnergy}
    tier={selectedTier}
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

### 6.2 Integration with Other Calculators (FI Number, Savings Rate, etc.)

**Usage Pattern:**
```typescript
// In FI Number Calculator
function FINumberCalculator() {
  const { expenseBaseline, getExpenseByTier, hasExpenseBaseline } = useCalculator();
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');

  // Check if baseline exists
  if (!hasExpenseBaseline()) {
    return (
      <Alert variant="info">
        <p>Þú þarft fyrst að setja upp útgjaldagrunn</p>
        <Button as="a" href="/utgjaldareiknivel">
          Setja upp útgjaldagrunn
        </Button>
      </Alert>
    );
  }

  // Get expense for selected tier
  const monthlyExpenses = getExpenseByTier(selectedTier);
  const annualExpenses = monthlyExpenses * 12;

  // Calculate FI Number (25x annual expenses)
  const fiNumber = annualExpenses * 25;

  return (
    <div>
      <TierSelector
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        showExpenseAmount
      />
      <div>FI Tala: {formatCurrency(fiNumber)}</div>
    </div>
  );
}
```

### 6.3 Event Emission for Real-time Updates

```typescript
// In CalculatorContext
const updateCategoryValues = useCallback((categoryId: string, values: Partial<TierValues>) => {
  setExpenseBaseline(prev => {
    if (!prev) return prev;

    const updated = {
      ...prev,
      categories: prev.categories.map(c =>
        c.id === categoryId ? { ...c, values: { ...c.values, ...values } } : c
      ),
      lastUpdated: new Date(),
    };

    // Emit event for other calculators
    window.dispatchEvent(new CustomEvent('expenseBaselineUpdated', {
      detail: { baseline: updated }
    }));

    return updated;
  });
}, []);
```

### 6.4 TierSelector Embedding

```typescript
// Exported from expense baseline components
export { TierSelector } from '@/components/expenseBaseline/TierSelector';

// Other calculators can import and use
import { TierSelector } from '@/components/expenseBaseline';

// In their component
<TierSelector
  selectedTier={tier}
  onSelectTier={setTier}
  showExpenseAmount
/>
```

---

## 7. Error Handling Strategy

### 7.1 Input Validation

```typescript
const validateTierValues = (values: TierValues): ValidationResult => {
  // Check for negative values
  if (values.barebones < 0 || values.comfortable < 0 || values.deluxe < 0) {
    return { valid: false, error: 'Útgjöld geta ekki verið neikvæð' };
  }

  // Check logical order (barebones <= comfortable <= deluxe)
  if (values.barebones > values.comfortable) {
    return {
      valid: false,
      error: 'Lágmarks ætti að vera lægra en Þægilegt',
      warning: true
    };
  }

  if (values.comfortable > values.deluxe) {
    return {
      valid: false,
      error: 'Þægilegt ætti að vera lægra en Lúxus',
      warning: true
    };
  }

  return { valid: true };
};
```

### 7.2 LocalStorage Errors

```typescript
const saveExpenseBaseline = (baseline: ExpenseBaseline) => {
  try {
    const currentState = safeGetItem<StoredState>(STORAGE_KEY) || {};
    safeSetItem(STORAGE_KEY, {
      ...currentState,
      expenseBaseline: {
        categories: baseline.categories,
        lastUpdated: baseline.lastUpdated.toISOString(),
        wizardCompleted: baseline.wizardCompleted,
        version: baseline.version,
      },
    });
  } catch (error) {
    console.error('Failed to save expense baseline:', error);
    showToast({
      type: 'warning',
      message: 'Gat ekki vistað útgjaldagrunn - breytingar tapast þegar vafra er lokað',
    });
  }
};
```

### 7.3 Migration for Schema Changes

```typescript
const migrateExpenseBaseline = (stored: any): ExpenseBaseline => {
  const version = stored.version || 1;

  // Migration from v1 to v2 (example)
  if (version < 2) {
    // Add new fields, transform data, etc.
    stored.categories = stored.categories.map((c: any) => ({
      ...c,
      order: c.order ?? DEFAULT_CATEGORY_ORDER[c.id] ?? 999,
    }));
    stored.version = 2;
  }

  return stored as ExpenseBaseline;
};
```

---

## 8. User Interface Design

### 8.1 Layout Structure

**Wizard Mode Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Útgjaldagrunnur - Leiðsögn                                 │
│  Skref 3 af 11: Samgöngur                                   │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  27%         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  🚗 Samgöngur                                       │  │
│  │  Bílakostnaður, eldsneyti, tryggingar, strætó      │  │
│  │                                                     │  │
│  │  Lágmarks                                           │  │
│  │  ┌─────────────────────────────────────┐           │  │
│  │  │ 15.000                           kr │           │  │
│  │  └─────────────────────────────────────┘           │  │
│  │  Sjálfgefið: 15.000 kr                             │  │
│  │                                                     │  │
│  │  Þægilegt                                           │  │
│  │  ┌─────────────────────────────────────┐           │  │
│  │  │ 40.000                           kr │           │  │
│  │  └─────────────────────────────────────┘           │  │
│  │  Sjálfgefið: 40.000 kr                             │  │
│  │                                                     │  │
│  │  Lúxus                                              │  │
│  │  ┌─────────────────────────────────────┐           │  │
│  │  │ 80.000                           kr │           │  │
│  │  └─────────────────────────────────────┘           │  │
│  │  Sjálfgefið: 80.000 kr                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [← Til baka]  [Nota sjálfgefið]  [Sleppa]  [Næsta →]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Quick Edit Mode Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Útgjaldagrunnur                        [Byrja aftur ↺]    │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┬───────────────┬───────────────┐        │
│  │  Lágmarks    │   Þægilegt    │    Lúxus     │         │
│  │  250.000 kr  │   520.000 kr  │  1.000.000 kr │         │
│  └───────────────┴───────────────┴───────────────┘        │
│                    Selected: ○●○                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠 Húsnæði                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐│
│  │ 120.000      kr │  │ 200.000      kr │  │ 350.000  kr ││
│  └─────────────────┘  └─────────────────┘  └─────────────┘│
│  48 klst              80 klst              140 klst        │
│                                                             │
│  🍽️ Matur                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐│
│  │  40.000      kr │  │  70.000      kr │  │ 120.000  kr ││
│  └─────────────────┘  └─────────────────┘  └─────────────┘│
│  16 klst              28 klst              48 klst         │
│                                                             │
│  ... (more categories)                                      │
│                                                             │
│  [+ Bæta við flokki]                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Responsive Breakpoints

**Mobile (<640px):**
- Wizard: Full-width inputs, stacked vertically
- Quick Edit: One tier per row (select tier via tabs, show one at a time)

**Tablet (640px-1024px):**
- Wizard: Side-by-side tier inputs
- Quick Edit: Three tiers visible but compact

**Desktop (>1024px):**
- Full layouts as shown above
- Category breakdown charts in sidebar

### 8.3 Color Coding System

```typescript
const TIER_COLORS = {
  barebones: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    accent: 'bg-amber-500',
  },
  comfortable: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    accent: 'bg-green-500',
  },
  deluxe: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-800',
    accent: 'bg-purple-500',
  },
};

// Category icons use their respective emoji
const CATEGORY_ICONS: Record<string, string> = {
  husnaedi: '🏠',
  matur: '🍽️',
  samgongur: '🚗',
  heilsa: '🏥',
  tryggingar: '🛡️',
  veitur: '💡',
  personuleg: '👤',
  afthreying: '🎬',
  sparnadur: '💰',
  annad: '📦',
};
```

---

## 9. Testing Strategy

### 9.1 Unit Testing

**Test Files:**
- `expenseBaseline.test.ts` - Calculation logic
- `ExpenseBaselineCalculator.test.tsx` - Main component
- `CategoryWizardStep.test.tsx` - Wizard step component
- `TierSelector.test.tsx` - Embeddable selector

**Test Coverage:**

```typescript
// expenseBaseline.test.ts
describe('calculateTierTotals', () => {
  it('sums all non-hidden categories', () => {
    const categories = [
      { id: 'a', values: { barebones: 100, comfortable: 200, deluxe: 300 }, isHidden: false },
      { id: 'b', values: { barebones: 50, comfortable: 100, deluxe: 150 }, isHidden: false },
    ];

    const totals = calculateTierTotals(categories as ExpenseCategory[]);

    expect(totals.barebones).toBe(150);
    expect(totals.comfortable).toBe(300);
    expect(totals.deluxe).toBe(450);
  });

  it('excludes hidden categories', () => {
    const categories = [
      { id: 'a', values: { barebones: 100, comfortable: 200, deluxe: 300 }, isHidden: false },
      { id: 'b', values: { barebones: 50, comfortable: 100, deluxe: 150 }, isHidden: true },
    ];

    const totals = calculateTierTotals(categories as ExpenseCategory[]);

    expect(totals.barebones).toBe(100);
  });
});

describe('calculateLifeEnergy', () => {
  it('calculates hours when AWH provided', () => {
    const totals = { barebones: 250000, comfortable: 520000, deluxe: 1000000 };
    const categories: ExpenseCategory[] = [];

    const lifeEnergy = calculateLifeEnergy(totals, categories, 2500);

    expect(lifeEnergy?.monthly.barebones).toBe(100);
    expect(lifeEnergy?.monthly.comfortable).toBe(208);
    expect(lifeEnergy?.monthly.deluxe).toBe(400);
  });

  it('returns null when no AWH', () => {
    const totals = { barebones: 250000, comfortable: 520000, deluxe: 1000000 };
    const lifeEnergy = calculateLifeEnergy(totals, [], null);

    expect(lifeEnergy).toBeNull();
  });
});
```

### 9.2 Integration Testing

```typescript
describe('ExpenseBaselineCalculator Integration', () => {
  it('persists baseline to localStorage', async () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateCategoryValues('husnaedi', { comfortable: 180000 });
    });

    // Wait for debounced save
    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain('180000');
    });
  });

  it('exposes getExpenseByTier for other calculators', () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    // Set up baseline
    act(() => {
      result.current.updateExpenseBaseline({
        wizardCompleted: true,
        categories: DEFAULT_EXPENSE_CATEGORIES.map(c => ({
          ...c,
          values: c.defaults,
          isCustom: false,
          isHidden: false,
          order: 0,
        })),
      });
    });

    const comfortable = result.current.getExpenseByTier('comfortable');
    expect(comfortable).toBe(520000);
  });
});
```

### 9.3 Accessibility Testing

```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels on tier inputs', () => {
    const { getByLabelText } = render(<CategoryWizardStep category={mockCategory} />);

    expect(getByLabelText(/lágmarks.*húsnæði/i)).toBeInTheDocument();
    expect(getByLabelText(/þægilegt.*húsnæði/i)).toBeInTheDocument();
    expect(getByLabelText(/lúxus.*húsnæði/i)).toBeInTheDocument();
  });

  it('wizard steps are keyboard navigable', async () => {
    const { getByText, getByRole } = render(<WizardModeContainer />);

    // Tab to Next button
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    const nextButton = getByRole('button', { name: /næsta/i });
    expect(nextButton).toHaveFocus();
  });
});
```

---

## 10. Performance Considerations

### 10.1 Calculation Optimization

```typescript
// Memoize expensive calculations
const expenseBaselineResults = useMemo(() => {
  if (!expenseBaseline) return null;
  return calculateExpenseBaselineResults(expenseBaseline, actualHourlyWage);
}, [expenseBaseline, actualHourlyWage]);

// Debounce inputs to reduce recalculations
const debouncedUpdateCategory = useMemo(
  () => debounce((categoryId: string, values: TierValues) => {
    updateCategoryValues(categoryId, values);
  }, 300),
  [updateCategoryValues]
);
```

### 10.2 Rendering Performance

```typescript
// Memoize category list items
const CategoryEditRow = React.memo(({ category, onUpdate }: Props) => {
  // ...
});

// Use virtualization for many custom categories
{categories.length > 20 && (
  <VirtualizedList items={categories} renderItem={renderCategoryRow} />
)}
```

### 10.3 Performance Budget

- Calculation time: <100ms
- Input response: <50ms
- Wizard step transitions: <200ms
- Chart rendering: <300ms

---

## 11. Accessibility Implementation

### 11.1 ARIA Implementation

```typescript
// Wizard progress
<div
  role="progressbar"
  aria-valuenow={currentStep}
  aria-valuemin={0}
  aria-valuemax={totalSteps}
  aria-label={`Skref ${currentStep + 1} af ${totalSteps + 1}`}
>

// Tier input group
<fieldset>
  <legend className="sr-only">Útgjöld fyrir {category.name}</legend>

  <div>
    <label htmlFor={`${category.id}-barebones`}>
      Lágmarks - {category.name}
    </label>
    <CurrencyInput
      id={`${category.id}-barebones`}
      value={values.barebones}
      onChange={...}
      aria-describedby={`${category.id}-barebones-help`}
    />
    <span id={`${category.id}-barebones-help`} className="sr-only">
      Sjálfgefið: {formatCurrency(defaults.barebones)}
    </span>
  </div>

  {/* Similar for comfortable and deluxe */}
</fieldset>

// Tier selector
<div role="radiogroup" aria-label="Veldu útgjaldagrunn">
  {TIERS.map(tier => (
    <button
      key={tier}
      role="radio"
      aria-checked={selectedTier === tier}
      onClick={() => onSelectTier(tier)}
    >
      {TIER_LABELS[tier]}
    </button>
  ))}
</div>
```

### 11.2 Keyboard Navigation

**Wizard Mode:**
- Tab: Move between inputs and buttons
- Enter: Submit/advance step
- Escape: Cancel/close modal
- Arrow keys: Navigate within tier selector

**Quick Edit Mode:**
- Tab: Move between category inputs
- Arrow Up/Down: Move between categories
- 1/2/3: Quick switch between tier tabs

---

## 12. Localization (Icelandic)

### 12.1 Text Content

```typescript
const TRANSLATIONS = {
  // Page headers
  title: 'Útgjaldagrunnur',
  subtitle: 'Skilgreindu útgjöld þín á þremur stigum',

  // Tiers
  tiers: {
    barebones: 'Lágmarks',
    bareBonesDescription: 'Lágmarksþörf til að lifa af',
    comfortable: 'Þægilegt',
    comfortableDescription: 'Þægileg lífsgæði',
    deluxe: 'Lúxus',
    deluxeDescription: 'Kjöraðstæður án áhyggjum',
  },

  // Wizard
  wizard: {
    intro: 'Við munum leiðbeina þér í gegnum hvern útgjaldaflokk.',
    stepLabel: 'Skref {current} af {total}',
    next: 'Næsta',
    back: 'Til baka',
    skip: 'Sleppa',
    useDefault: 'Nota sjálfgefið',
    finish: 'Ljúka',
    startFresh: 'Byrja aftur',
  },

  // Quick Edit
  quickEdit: {
    addCategory: 'Bæta við flokki',
    hideCategory: 'Fela flokk',
    showHidden: 'Sýna falda flokka',
    total: 'Samtals',
  },

  // Results
  results: {
    monthly: 'á mánuði',
    annually: 'á ári',
    lifeEnergy: 'Lífsorka',
    hoursPerMonth: 'klst/mán',
    hoursPerYear: 'klst/ár',
    tierDifference: 'Munur á stigum',
  },

  // Validation
  validation: {
    negative: 'Útgjöld geta ekki verið neikvæð',
    orderWarning: '{lower} ætti að vera lægra en {higher}',
  },

  // Integration
  integration: {
    noBaseline: 'Þú hefur ekki sett upp útgjaldagrunn',
    setupBaseline: 'Setja upp útgjaldagrunn',
    selectTier: 'Veldu útgjaldagrunn',
  },
};
```

### 12.2 Number Formatting

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' kr';
};

// Example: 520.000 kr

const formatLifeEnergy = (hours: number): string => {
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(hours) + ' klst';
};

// Example: 208 klst
```

---

## 13. Technical Decisions

### 13.1 Three-Tier System

**Decision**: Use fixed three tiers (Barebones/Comfortable/Deluxe)

**Rationale**:
- Aligns with "Your Money or Your Life" philosophy
- Simple mental model for users
- Enables meaningful FI Number ranges
- Easy integration with other calculators

**Alternatives Considered**:
- Custom number of tiers: Rejected (too complex)
- Sliders instead of tiers: Rejected (loses tier semantics)

### 13.2 Wizard vs. Direct Edit

**Decision**: Offer both modes with smart detection

**Rationale**:
- First-time users benefit from guidance
- Returning users want quick edits
- Wizard ensures complete baseline
- Direct edit saves time

**Implementation**:
- Show wizard if `wizardCompleted === false`
- Show direct edit if `wizardCompleted === true`
- Allow switching between modes

### 13.3 Default Values

**Decision**: Use hardcoded Icelandic defaults with annual review

**Rationale**:
- Provides good starting point for users
- Based on actual Icelandic cost of living
- Easy to update
- No external dependencies

### 13.4 Integration API

**Decision**: Use React Context + Custom Events

**Rationale**:
- Context provides synchronous access
- Events enable loose coupling
- Works with existing architecture
- No external state management needed

---

## 14. Design Traceability to Requirements

| Requirement | Design Component | Implementation |
|-------------|------------------|----------------|
| **US-1**: Three Spending Tiers | TierValues type, WizardModeContainer | Three-input groups per category |
| **US-2**: Icelandic Categories | DEFAULT_EXPENSE_CATEGORIES | 10 pre-defined categories with ISK defaults |
| **US-3**: Export Baseline | CalculatorContext API, TierSelector | getExpenseBaseline(), getExpenseByTier() |
| **US-4**: Life Energy Breakdown | calculateLifeEnergy() | Hours per category when AWH available |
| **US-5**: Customize Categories | addCustomCategory(), toggleCategoryVisibility() | Add/hide categories in Quick Edit mode |
| **FR-1**: Expense Categories | ExpenseCategory type | 10 defaults + custom support |
| **FR-2**: Three-Tier System | ExpenseTier, TierValues | Barebones/Comfortable/Deluxe throughout |
| **FR-3**: Calculations | expenseBaseline.ts | Totals, percentages, life energy, differences |
| **FR-4**: Data Persistence | CalculatorContext, localStorage | Auto-save with debounce, export/import |
| **FR-5**: Guided Builder | WizardModeContainer | 11-step wizard with progress |
| **FR-6**: Integration | getExpenseByTier(), TierSelector | API + embeddable component |

---

## 15. Implementation Risks and Mitigations

### Risk 1: Complex State Management

**Risk**: Managing categories, tiers, and custom items may become complex.

**Mitigation**:
- Use immutable state updates
- Clear separation between wizard state and persisted state
- Unit tests for all state transitions

### Risk 2: AWH Integration Timing

**Risk**: User may set up baseline before calculating AWH.

**Mitigation**:
- Life energy shown as "N/A" without AWH
- Prompt to calculate AWH
- Auto-recalculate when AWH becomes available

### Risk 3: Mobile Wizard UX

**Risk**: Multi-step wizard may be tedious on mobile.

**Mitigation**:
- "Use all defaults" quick action
- Progress saving (can resume later)
- Skip option per category

### Risk 4: Migration of Existing Data

**Risk**: Schema changes may break existing saved baselines.

**Mitigation**:
- Version field in stored data
- Migration function on load
- Fallback to defaults if migration fails

---

## 16. Design Review Checklist

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
- [x] TierSelector component designed
- [x] Event system for real-time updates
- [x] Clear integration patterns documented

---

**Design Phase Complete: Ready for Tasks Breakdown**
