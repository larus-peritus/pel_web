# Design: Job Offer Comparison Tool

**Feature ID**: 2.3.4
**Feature Name**: Job Offer Comparison Tool
**App**: peninganaedalifid (Peningana eða lífið)
**Created**: 2026-01-22
**Status**: Draft
**Requirements Document**: `requirements-job-offer-comparison.md`

---

## 1. Design Overview

### 1.1 Architecture Summary

The Job Offer Comparison Tool is a client-side feature built on Next.js that enables users to compare 2-5 job offers holistically. The design emphasizes local-first architecture, modular calculation logic, and a responsive comparison interface.

**Key Architectural Principles**:
- **Local-First**: All data stored in browser localStorage, no backend required
- **Modular Calculations**: Reusable calculation modules (especially Actual Hourly Wage)
- **Component Composition**: React components for input forms, comparison view, and data management
- **Type Safety**: TypeScript for all data models and business logic
- **Responsive Design**: Mobile-first approach with adaptive layouts

### 1.2 System Context

```
┌─────────────────────────────────────────────────────────┐
│ peninganaedalifid Next.js App                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Job Offer Comparison Feature                     │  │
│  │                                                  │  │
│  │  ┌────────────────┐  ┌──────────────────────┐   │  │
│  │  │ Offer Input    │  │ Comparison Display   │   │  │
│  │  │ Components     │  │ Components          │   │  │
│  │  └────────────────┘  └──────────────────────┘   │  │
│  │           │                    │                │  │
│  │           └────────┬───────────┘                │  │
│  │                    │                            │  │
│  │  ┌─────────────────▼──────────────────────────┐ │  │
│  │  │ Comparison State Management (React)       │ │  │
│  │  └─────────────────┬──────────────────────────┘ │  │
│  │                    │                            │  │
│  │  ┌─────────────────▼──────────────────────────┐ │  │
│  │  │ Calculation Engine                        │ │  │
│  │  │ - Actual Hourly Wage Calculator           │ │  │
│  │  │ - Life Energy Calculator                  │ │  │
│  │  │ - Comparison Analyzer                     │ │  │
│  │  └─────────────────┬──────────────────────────┘ │  │
│  │                    │                            │  │
│  │  ┌─────────────────▼──────────────────────────┐ │  │
│  │  │ Data Persistence (localStorage)           │ │  │
│  │  └───────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Shared Utilities                                 │  │
│  │ - Export/Import Manager                          │  │
│  │ - i18n (Icelandic/English)                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

External:
User Browser ←→ Next.js App (client-side interaction only)
```

### 1.3 Technology Stack

**Framework & Language**:
- Next.js 14+ (App Router)
- TypeScript 5+
- React 18+

**State Management**:
- React Context API (for comparison state)
- React useState/useReducer (for form state)
- localStorage (for persistence)

**Styling**:
- CSS Modules or Tailwind CSS (to be determined based on app standards)
- Responsive design utilities

**Data Handling**:
- Zod (for runtime type validation and schema validation)
- date-fns (for date calculations if needed)

**Testing**:
- Jest (unit tests for calculations)
- React Testing Library (component tests)
- Playwright or Cypress (E2E tests)

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
JobOfferComparisonPage (Page Component)
│
├── ComparisonProvider (State Management)
│   │
│   ├── OfferInputSection
│   │   ├── AddOfferButton
│   │   ├── OfferCard (repeated 2-5 times)
│   │   │   ├── OfferFormFields
│   │   │   │   ├── BasicInfoFields (name, salary)
│   │   │   │   ├── WorkDetailsFields (hours, vacation, commute)
│   │   │   │   ├── BenefitsFields (pension, monetary benefits)
│   │   │   │   ├── NonMonetaryFactorFields (flexibility, stress, growth)
│   │   │   ├── OfferActions (Edit, Remove, Duplicate)
│   │   │   └── CalculatedPreview (live actual hourly wage)
│   │   │
│   │   └── OfferLimitMessage (shown when 5 offers reached)
│   │
│   ├── ComparisonViewSection
│   │   ├── ComparisonModeToggle (Side-by-side vs. Stacked)
│   │   ├── ComparisonTable (Desktop)
│   │   │   ├── MetricRow (repeated for each metric)
│   │   │   │   ├── MetricLabel
│   │   │   │   └── MetricValue (repeated per offer, with visual indicators)
│   │   │   └── WinnerIndicator
│   │   │
│   │   ├── ComparisonCards (Mobile)
│   │   │   └── OfferComparisonCard (repeated per offer, swipeable)
│   │   │       ├── OfferSummary
│   │   │       ├── MetricsList
│   │   │       └── RelativeComparison (vs. best offer)
│   │   │
│   │   ├── LifeEnergyVisualizer
│   │   │   ├── AnnualHoursBarChart
│   │   │   └── DifferenceExplainer (plain language)
│   │   │
│   │   └── AssumptionsPanel (collapsible)
│   │       └── AssumptionsList (per offer)
│   │
│   ├── ComparisonActions
│   │   ├── ExportButton
│   │   ├── ImportButton
│   │   ├── ResetButton
│   │   └── ShareButton (optional, for future)
│   │
│   └── EmptyState (shown when no offers)
│       └── CreateFirstOfferPrompt
```

### 2.2 Key Components Specification

#### 2.2.1 JobOfferComparisonPage

**Purpose**: Top-level page component for the comparison tool
**Route**: `/tools/job-offer-comparison` or `/verkfaeri/starfstilbod-samanburður`

**Responsibilities**:
- Render page layout and structure
- Provide ComparisonProvider for state management
- Handle page-level loading and error states
- Set page metadata (title, description for SEO)

**Props**: None (page component)

**State**: None (delegates to ComparisonProvider)

#### 2.2.2 ComparisonProvider

**Purpose**: Centralized state management for the entire comparison feature
**Type**: React Context Provider

**State Schema**:
```typescript
interface ComparisonState {
  offers: JobOffer[];
  selectedView: 'side-by-side' | 'stacked';
  showAssumptions: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
}
```

**Actions**:
- `addOffer(offer: JobOffer): void`
- `updateOffer(id: string, updates: Partial<JobOffer>): void`
- `removeOffer(id: string): void`
- `duplicateOffer(id: string): void`
- `setView(view: 'side-by-side' | 'stacked'): void`
- `toggleAssumptions(): void`
- `exportComparison(): void`
- `importComparison(file: File): void`
- `resetComparison(): void`

**Persistence**:
- Auto-save to localStorage on every state change (debounced 500ms)
- Load from localStorage on component mount
- localStorage key: `peningana-job-comparison-v1`

#### 2.2.3 OfferCard

**Purpose**: Input form for a single job offer
**State**: Local form state (controlled inputs)

**Fields**:
```typescript
interface JobOffer {
  id: string; // UUID
  name: string; // Offer title/name (required)
  salary: number; // Annual gross ISK (required)
  weeklyHours: number; // Expected weekly hours (default: 40)
  vacationDays: number; // Annual vacation days (default: 24)
  commuteMinutes: number; // Daily commute minutes (default: 0)
  pensionPercent: number; // Pension contribution % (default: 11.5)
  monetaryBenefits: MonetaryBenefit[]; // Array of benefits
  flexibility: number | null; // 1-5 scale
  stressLevel: number | null; // 1-5 scale
  growthOpportunities: number | null; // 1-5 scale
  notes: string; // Additional notes
  createdAt: Date;
  updatedAt: Date;
}

interface MonetaryBenefit {
  type: 'lunch' | 'car' | 'phone' | 'health' | 'extra-pension' | 'custom';
  label: string; // For custom benefits
  annualValue: number; // ISK per year
}
```

**Validation**:
- Zod schema validation on input change
- Real-time error messages
- Required fields: name, salary
- Salary: positive number, max 999,999,999 ISK
- Weekly hours: 1-168
- Vacation days: 0-365
- Commute: 0-480 minutes
- Pension: 0-100%
- Ratings: 1-5 or null

**Behavior**:
- Live calculation preview (actual hourly wage updates as user types)
- Expandable sections (basic info always visible, advanced fields collapsible)
- Auto-save on blur or after 1 second of no typing

#### 2.2.4 ComparisonTable / ComparisonCards

**Purpose**: Display side-by-side comparison of all offers

**Metrics Displayed** (in order):
1. **Offer Name** (header row)
2. **Annual Gross Salary** (ISK, formatted)
3. **Actual Hourly Wage** (ISK/hour, highlighted as key metric)
4. **Annual Work Hours** (includes commute)
5. **Annual "Life Energy" Cost** (hours, with days/weeks equivalent)
6. **Difference from Best Offer** (ISK/hour and hours/year)
7. **Benefits Included** (list of monetary benefits)
8. **Flexibility Rating** (if provided, visual stars)
9. **Stress Level** (if provided, visual indicator)
10. **Growth Opportunities** (if provided, visual stars)
11. **Overall Ranking** (1st, 2nd, 3rd based on actual hourly wage)

**Visual Indicators**:
- Color coding: Green (best), Yellow (middle), Red (worst) for key metrics
- Winner badge/icon on the offer with highest actual hourly wage
- Bar chart lengths proportional to values
- Clear typography hierarchy (large numbers for key metrics)

**Desktop Layout** (Side-by-Side):
```
┌─────────────┬────────────┬────────────┬────────────┐
│ Metric      │ Offer A    │ Offer B    │ Offer C    │
├─────────────┼────────────┼────────────┼────────────┤
│ Salary      │ 6,000,000  │ 5,800,000  │ 6,200,000  │
│ Hourly Wage │ 3,200 🏆   │ 2,950      │ 3,100      │
│ Hours/Year  │ 1,875      │ 1,966      │ 2,000      │
│ ...         │ ...        │ ...        │ ...        │
└─────────────┴────────────┴────────────┴────────────┘
```

**Mobile Layout** (Stacked Cards):
- Swipeable card stack, one offer per screen
- "X of Y" indicator
- Quick comparison bullets at bottom ("20 ISK/hour less than best offer")

#### 2.2.5 LifeEnergyVisualizer

**Purpose**: Translate comparison into "life energy" terms

**Visualizations**:
1. **Annual Hours Bar Chart**: Visual length shows total hours required per year
2. **Difference Explainer**: Plain language sentences
   - "Choosing Offer B over Offer A costs you 120 extra hours per year"
   - "That's equivalent to 15 full work days, or 3 work weeks"
   - "Over 5 years, that's 600 hours, or 2.5 months of your life"

**Data Calculations**:
```typescript
interface LifeEnergyComparison {
  offerId: string;
  offerName: string;
  annualHoursRequired: number; // Work + commute
  differenceFromBest: {
    hours: number;
    days: number; // Assuming 8-hour workdays
    weeks: number; // Assuming 40-hour workweeks
    fiveYearImpact: number; // Hours over 5 years
  };
  plainLanguageExplanation: string[];
}
```

#### 2.2.6 AssumptionsPanel

**Purpose**: Display all inputs and assumptions transparently

**Content** (per offer):
- All input values used (salary, hours, vacation, commute, etc.)
- Default values applied (if user didn't override)
- Link to "How we calculate actual hourly wage" methodology page
- Calculation formula breakdown

**Example Display**:
```
Offer A - Software Engineer at Company X

Inputs Used:
✓ Annual salary: 6,000,000 ISK
✓ Weekly hours: 40 (default)
✓ Vacation days: 24 (Icelandic standard)
✓ Commute: 30 minutes/day
✓ Pension: 11.5% (default)
✓ Benefits: Lunch (200,000 ISK/year), Phone (60,000 ISK/year)

Calculation:
1. Total compensation: 6,000,000 + 200,000 + 60,000 = 6,260,000 ISK
2. Work weeks per year: 52 - (24/5) = 47.2 weeks
3. Work hours per year: 47.2 × 40 = 1,888 hours
4. Commute hours per year: (30 min × 2 × 5 days × 47.2 weeks) / 60 = 236 hours
5. Total hours required: 1,888 + 236 = 2,124 hours
6. Actual hourly wage: 6,260,000 / 2,124 = 2,947 ISK/hour

[Learn more about this methodology →]
```

---

## 3. Data Models

### 3.1 TypeScript Interfaces

```typescript
// Core Data Models

interface JobOffer {
  id: string; // UUID v4
  name: string;
  salary: number; // Annual gross ISK
  weeklyHours: number;
  vacationDays: number;
  commuteMinutes: number;
  pensionPercent: number;
  monetaryBenefits: MonetaryBenefit[];
  flexibility: number | null; // 1-5
  stressLevel: number | null; // 1-5
  growthOpportunities: number | null; // 1-5
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MonetaryBenefit {
  type: BenefitType;
  label: string; // For 'custom' type
  annualValue: number; // ISK
}

type BenefitType =
  | 'lunch' // Dagpeningugleði
  | 'car' // Bílastyrður
  | 'phone' // Símastyrður
  | 'health' // Sjúkratrygging
  | 'extra-pension' // Auka lífeyrir
  | 'custom'; // User-defined

interface CalculatedMetrics {
  offerId: string;
  actualHourlyWage: number; // ISK/hour
  totalCompensation: number; // Salary + benefits, ISK
  annualWorkHours: number; // Excluding commute
  annualCommuteHours: number;
  annualTotalHours: number; // Work + commute
  lifeEnergyCost: LifeEnergyCost;
}

interface LifeEnergyCost {
  hours: number; // Annual total hours required
  days: number; // Equivalent full days (8-hour days)
  weeks: number; // Equivalent full weeks (40-hour weeks)
  monthlyHours: number; // Average monthly hours
}

interface ComparisonResult {
  offers: JobOffer[];
  metrics: CalculatedMetrics[];
  rankings: OfferRanking[];
  bestOffer: JobOffer; // Highest actual hourly wage
}

interface OfferRanking {
  offerId: string;
  rank: number; // 1, 2, 3, etc.
  scoreType: 'monetary'; // Future: 'holistic' with non-monetary factors
  differenceFromBest: {
    hourlyWageDiff: number; // ISK/hour difference
    annualHoursDiff: number; // Hours difference per year
    plainLanguage: string; // "120 hours more per year than best offer"
  };
}

interface ComparisonExport {
  version: string; // Data schema version, e.g., '1.0'
  exportedAt: Date;
  appName: 'peninganaedalifid';
  comparison: ComparisonResult;
}
```

### 3.2 Zod Validation Schemas

```typescript
import { z } from 'zod';

const MonetaryBenefitSchema = z.object({
  type: z.enum(['lunch', 'car', 'phone', 'health', 'extra-pension', 'custom']),
  label: z.string().min(1).max(100),
  annualValue: z.number().min(0).max(10_000_000),
});

const JobOfferSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Offer name is required').max(100),
  salary: z.number()
    .min(1, 'Salary must be positive')
    .max(999_999_999, 'Salary seems unrealistically high'),
  weeklyHours: z.number()
    .min(1, 'Hours must be at least 1')
    .max(168, 'Only 168 hours in a week!'),
  vacationDays: z.number()
    .min(0, 'Cannot have negative vacation')
    .max(365, 'Cannot exceed 365 days'),
  commuteMinutes: z.number()
    .min(0, 'Commute cannot be negative')
    .max(480, 'Commute seems unrealistically long'),
  pensionPercent: z.number()
    .min(0, 'Pension cannot be negative')
    .max(100, 'Pension cannot exceed 100%'),
  monetaryBenefits: z.array(MonetaryBenefitSchema).default([]),
  flexibility: z.number().min(1).max(5).nullable(),
  stressLevel: z.number().min(1).max(5).nullable(),
  growthOpportunities: z.number().min(1).max(5).nullable(),
  notes: z.string().max(1000).default(''),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ComparisonExportSchema = z.object({
  version: z.string(),
  exportedAt: z.date(),
  appName: z.literal('peninganaedalifid'),
  comparison: z.object({
    offers: z.array(JobOfferSchema).min(2).max(5),
    // ... additional validation
  }),
});
```

---

## 4. Business Logic

### 4.1 Actual Hourly Wage Calculator

**Module**: `lib/calculations/actualHourlyWage.ts`

**Core Function**:
```typescript
function calculateActualHourlyWage(offer: JobOffer): CalculatedMetrics {
  // 1. Calculate total compensation
  const totalBenefitsValue = offer.monetaryBenefits.reduce(
    (sum, benefit) => sum + benefit.annualValue,
    0
  );
  const totalCompensation = offer.salary + totalBenefitsValue;

  // 2. Calculate annual work hours
  const workWeeksPerYear = 52 - (offer.vacationDays / 5);
  const annualWorkHours = workWeeksPerYear * offer.weeklyHours;

  // 3. Calculate annual commute hours
  const commuteHoursPerDay = offer.commuteMinutes / 60;
  const annualCommuteHours = commuteHoursPerDay * 5 * workWeeksPerYear; // 5 workdays/week

  // 4. Calculate total hours required
  const annualTotalHours = annualWorkHours + annualCommuteHours;

  // 5. Calculate actual hourly wage
  const actualHourlyWage = totalCompensation / annualTotalHours;

  // 6. Calculate life energy cost
  const lifeEnergyCost: LifeEnergyCost = {
    hours: annualTotalHours,
    days: annualTotalHours / 8, // 8-hour workday
    weeks: annualTotalHours / 40, // 40-hour workweek
    monthlyHours: annualTotalHours / 12,
  };

  return {
    offerId: offer.id,
    actualHourlyWage: Math.round(actualHourlyWage), // Round to whole ISK
    totalCompensation,
    annualWorkHours,
    annualCommuteHours,
    annualTotalHours,
    lifeEnergyCost,
  };
}
```

**Edge Cases Handled**:
- Zero commute: Skip commute calculation
- Zero weekly hours: Return error (invalid offer)
- More vacation days than work days: Cap at 260 days (52 weeks × 5 days)
- Negative values: Validation prevents, but handle gracefully with error state

### 4.2 Comparison Analyzer

**Module**: `lib/calculations/comparisonAnalyzer.ts`

**Core Function**:
```typescript
function analyzeComparison(offers: JobOffer[]): ComparisonResult {
  // 1. Calculate metrics for each offer
  const metrics = offers.map(calculateActualHourlyWage);

  // 2. Rank offers by actual hourly wage (descending)
  const sorted = [...metrics].sort(
    (a, b) => b.actualHourlyWage - a.actualHourlyWage
  );

  // 3. Identify best offer
  const bestOffer = offers.find(o => o.id === sorted[0].offerId)!;

  // 4. Calculate rankings and differences
  const rankings: OfferRanking[] = metrics.map((metric, index) => {
    const rank = sorted.findIndex(m => m.offerId === metric.offerId) + 1;
    const bestMetric = sorted[0];
    const hourlyWageDiff = bestMetric.actualHourlyWage - metric.actualHourlyWage;
    const annualHoursDiff = metric.annualTotalHours - bestMetric.annualTotalHours;

    return {
      offerId: metric.offerId,
      rank,
      scoreType: 'monetary',
      differenceFromBest: {
        hourlyWageDiff,
        annualHoursDiff,
        plainLanguage: generatePlainLanguageComparison(
          hourlyWageDiff,
          annualHoursDiff,
          rank === 1
        ),
      },
    };
  });

  return {
    offers,
    metrics,
    rankings,
    bestOffer,
  };
}

function generatePlainLanguageComparison(
  hourlyDiff: number,
  hoursDiff: number,
  isBest: boolean
): string {
  if (isBest) {
    return 'This is the best value offer!';
  }

  const daysDiff = Math.round(hoursDiff / 8);
  const weeksDiff = Math.round(hoursDiff / 40);

  if (hoursDiff > 0) {
    return `Costs you ${hoursDiff} extra hours per year (${daysDiff} days or ${weeksDiff} weeks) compared to the best offer.`;
  } else {
    // Should not happen if best offer is correctly identified
    return 'Equivalent to the best offer.';
  }
}
```

### 4.3 Data Persistence

**Module**: `lib/storage/comparisonStorage.ts`

**Functions**:
```typescript
const STORAGE_KEY = 'peningana-job-comparison-v1';

function saveComparison(state: ComparisonState): void {
  const serialized = JSON.stringify({
    ...state,
    lastSaved: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, serialized);
}

function loadComparison(): ComparisonState | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    // Validate with Zod schema
    // Convert ISO strings back to Date objects
    return {
      ...parsed,
      offers: parsed.offers.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      })),
      lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
    };
  } catch (error) {
    console.error('Failed to load comparison:', error);
    return null;
  }
}

function clearComparison(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

### 4.4 Export/Import Manager

**Module**: `lib/io/exportImport.ts`

**Export Function**:
```typescript
function exportComparison(comparison: ComparisonResult): void {
  const exportData: ComparisonExport = {
    version: '1.0',
    exportedAt: new Date(),
    appName: 'peninganaedalifid',
    comparison,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `job-comparison-${format(new Date(), 'yyyy-MM-dd')}.json`;
  link.click();

  URL.revokeObjectURL(url);
}
```

**Import Function**:
```typescript
async function importComparison(file: File): Promise<ComparisonState> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  // Validate with Zod schema
  const validated = ComparisonExportSchema.parse(parsed);

  // Check version compatibility
  if (validated.version !== '1.0') {
    throw new Error(`Unsupported export version: ${validated.version}`);
  }

  // Convert to ComparisonState
  return {
    offers: validated.comparison.offers,
    selectedView: 'side-by-side',
    showAssumptions: false,
    isLoading: false,
    lastSaved: null,
  };
}
```

---

## 5. User Interface Design

### 5.1 Layout Structure

**Desktop (≥1024px)**:
```
┌────────────────────────────────────────────────────────────┐
│ Header: Job Offer Comparison Tool                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─────────────────────┐  ┌──────────────────────────────┐ │
│ │ Offer Input Section │  │ Comparison View Section      │ │
│ │                     │  │                              │ │
│ │ [+ Add Offer]       │  │ [Side-by-Side ▼] [Export]   │ │
│ │                     │  │                              │ │
│ │ ┌─────────────────┐ │  │ ┌──────────────────────────┐ │ │
│ │ │ Offer 1         │ │  │ │ Comparison Table         │ │ │
│ │ │ [Edit] [Remove] │ │  │ │                          │ │ │
│ │ └─────────────────┘ │  │ │ Metric | Offer 1 | ...   │ │ │
│ │                     │  │ │ ────────────────────────  │ │ │
│ │ ┌─────────────────┐ │  │ │ Salary | 6M ISK  | ...   │ │ │
│ │ │ Offer 2         │ │  │ │ Hourly | 3,200   | ...   │ │ │
│ │ │ [Edit] [Remove] │ │  │ │ ...    | ...      | ...   │ │ │
│ │ └─────────────────┘ │  │ └──────────────────────────┘ │ │
│ │                     │  │                              │ │
│ │ (Max 5 offers)      │  │ ┌──────────────────────────┐ │ │
│ └─────────────────────┘  │ │ Life Energy Visualizer   │ │ │
│                          │ │ [Bar Charts]             │ │ │
│                          │ └──────────────────────────┘ │ │
│                          │                              │ │
│                          │ [▼ Show Assumptions]         │ │
│                          └──────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Mobile (<768px)**:
```
┌──────────────────────────┐
│ Job Offer Comparison     │
├──────────────────────────┤
│ [+ Add Offer]            │
│                          │
│ ┌──────────────────────┐ │
│ │ Offer 1              │ │
│ │ Tech Lead at X       │ │
│ │ 6,000,000 ISK        │ │
│ │ [Expand] [Edit]      │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ Offer 2              │ │
│ │ Senior Dev at Y      │ │
│ │ 5,800,000 ISK        │ │
│ │ [Expand] [Edit]      │ │
│ └──────────────────────┘ │
│                          │
│ ─────────────────────────│
│ Comparison (2 of 2)      │
│ < [Offer 1] >            │
│                          │
│ 🏆 Best Value!           │
│ 3,200 ISK/hour           │
│ 1,875 hours/year         │
│                          │
│ [Swipe to compare]       │
│ [Export] [Reset]         │
└──────────────────────────┘
```

### 5.2 Visual Design Principles

**Typography**:
- Headlines: Bold, 1.5-2rem (offer names, section headers)
- Key metrics: Large, 1.25rem (actual hourly wage, annual hours)
- Body text: 1rem (labels, descriptions)
- Monospace: Used for ISK amounts to align digits

**Color Palette** (Icelandic-inspired):
- Primary: Blue (#0066CC) - Trust, professionalism
- Success: Green (#00A651) - Best offer indicator
- Warning: Yellow/Amber (#FFA500) - Middle offers
- Danger: Red (#D32F2F) - Worst offer indicator
- Neutral: Gray scale for backgrounds and borders
- Accent: Light blue for interactive elements

**Visual Indicators**:
- Trophy icon (🏆) for best offer
- Color-coded bars/badges (green/yellow/red)
- Star ratings for non-monetary factors
- Progress bars for life energy visualization

**Spacing**:
- Generous whitespace between offers
- Clear visual separation between input and comparison sections
- Adequate padding within cards (16-24px)

### 5.3 Interaction Patterns

**Adding an Offer**:
1. Click "+ Add Offer" button
2. Expand new empty offer card
3. Auto-focus on "Offer Name" field
4. Show required field indicators
5. Pre-fill defaults (40 hours, 24 vacation days, etc.)
6. Live preview of actual hourly wage as user types
7. Auto-save on blur or after 1 second pause

**Editing an Offer**:
1. Click "Edit" button on offer card
2. Expand all fields (if collapsed)
3. Enable editing (fields become active)
4. Live recalculation of comparison
5. "Save" confirmation (or auto-save)

**Removing an Offer**:
1. Click "Remove" button
2. Confirmation modal: "Are you sure? This cannot be undone."
3. On confirm: Remove from list, recalculate comparison
4. Minimum 2 offers required (disable Remove if only 2 left)

**Comparing Offers**:
- Desktop: Automatic side-by-side table view
- Mobile: Swipe horizontally between offer cards
- Toggle between "Monetary Only" and "Holistic" views (future)
- Expand/collapse assumptions panel

**Exporting**:
1. Click "Export" button
2. Generate JSON file
3. Auto-download with filename: `job-comparison-YYYY-MM-DD.json`
4. Success toast: "Comparison exported!"

**Importing**:
1. Click "Import" button
2. File picker opens
3. Validate file (JSON schema check)
4. Confirmation: "This will replace your current comparison. Continue?"
5. Load data, render comparison
6. Success toast: "Comparison imported!"

---

## 6. Error Handling

### 6.1 Validation Errors

**Input Validation**:
- Real-time validation on blur (not on every keystroke to avoid annoyance)
- Error messages displayed below field
- Field border turns red for invalid inputs
- Cannot save offer until all required fields are valid

**Example Error Messages**:
- "Offer name is required"
- "Salary must be a positive number"
- "Weekly hours must be between 1 and 168"
- "Commute time seems unrealistically long (max 8 hours/day)"

### 6.2 Data Errors

**localStorage Failures**:
- If localStorage is full: Display warning, offer export instead
- If localStorage is disabled: Display warning, continue in-memory only
- If corrupted data: Clear storage, start fresh, log error

**Import Errors**:
- Invalid JSON: "The file format is invalid. Please select a valid export file."
- Wrong schema version: "This file was exported from a different version. Cannot import."
- Missing required fields: "The file is missing required data. Cannot import."

### 6.3 Calculation Errors

**Division by Zero**:
- If total hours = 0 (should be prevented by validation), display: "Cannot calculate hourly wage with zero hours."

**Unrealistic Values**:
- If actual hourly wage > 50,000 ISK: Display warning: "This hourly wage seems unusually high. Please double-check your inputs."

### 6.4 UI Error States

**Empty State** (no offers):
- Display friendly message: "Add your first job offer to start comparing."
- Large "+ Add Offer" button
- Illustration or icon (optional)

**Insufficient Offers** (only 1 offer):
- Display message: "Add at least one more offer to compare."
- Disable comparison view section

**Loading State**:
- Skeleton loaders for offer cards
- Shimmer effect while loading from localStorage

**Network Offline**:
- Toast notification: "You're offline. Your comparison is saved locally."
- Disable import (requires file picker which may need network)

---

## 7. Accessibility

### 7.1 Keyboard Navigation

**Tab Order**:
1. "+ Add Offer" button
2. Offer 1 form fields (name → salary → hours → ... → save)
3. Offer 1 actions (edit, remove, duplicate)
4. Offer 2 form fields
5. Offer 2 actions
6. ... (repeat for all offers)
7. Comparison view controls (toggle view, export, import)
8. Assumptions panel toggle

**Keyboard Shortcuts** (optional):
- `Ctrl+N`: Add new offer
- `Ctrl+E`: Export comparison
- `Ctrl+I`: Import comparison
- `Escape`: Close modals/collapse panels

### 7.2 Screen Reader Support

**ARIA Labels**:
- All form fields have `aria-label` or associated `<label>`
- Buttons have descriptive labels ("Add New Offer", not just "Add")
- Comparison table uses `role="table"` with `th` and `td` elements
- Live regions for dynamic updates (`aria-live="polite"` for calculation updates)

**Focus Management**:
- When adding offer, focus moves to name field
- When opening modal, focus moves to modal
- When closing modal, focus returns to trigger button

**Semantic HTML**:
- Use `<table>` for comparison table
- Use `<form>` for offer input
- Use `<button>` for actions (not `<div>`)
- Use `<nav>` for navigation between offers (mobile)

### 7.3 Visual Accessibility

**Color Contrast**:
- Text on background: Minimum 4.5:1 ratio (WCAG AA)
- Large text (18px+): Minimum 3:1 ratio
- Color-coded indicators also use icons/patterns (not color alone)

**Font Sizes**:
- Minimum body text: 16px
- Scalable with browser zoom (use rem units)

**Focus Indicators**:
- Clear focus outline on all interactive elements
- 2px solid blue outline
- Visible on keyboard navigation, hidden on mouse click

---

## 8. Performance Considerations

### 8.1 Rendering Optimization

**React Optimization**:
- Use `React.memo` for offer cards to prevent unnecessary re-renders
- Use `useMemo` for expensive calculations (comparison analysis)
- Use `useCallback` for event handlers passed to children
- Debounce localStorage saves (500ms) to avoid excessive writes

**Lazy Loading**:
- Code-split comparison visualizations (load only when needed)
- Lazy load export/import utilities (on first use)

### 8.2 Calculation Performance

**Efficiency**:
- Calculations are O(n) where n = number of offers (max 5, so very fast)
- Memoize comparison results to avoid recalculation on unrelated state changes

**Benchmarks** (target):
- Add offer: < 50ms
- Update offer field: < 100ms (including recalculation and re-render)
- Export: < 200ms
- Import: < 500ms (includes validation)

### 8.3 Bundle Size

**Optimization**:
- Tree-shake unused utilities
- Use lightweight libraries (Zod is small, ~8KB gzipped)
- Avoid large visualization libraries if possible (use CSS/SVG for simple charts)

**Budget**:
- Feature bundle: < 50KB gzipped (including all components and logic)

---

## 9. Internationalization (i18n)

### 9.1 Language Support

**Primary**: Icelandic (is-IS)
**Secondary**: English (en-US)

**Implementation**:
- Use `next-i18next` or similar i18n library
- Extract all user-facing strings to translation files
- Locale stored in user preferences (localStorage)

**Translation Files**:
```
locales/
├── is/
│   └── job-comparison.json
└── en/
    └── job-comparison.json
```

### 9.2 Icelandic-Specific Content

**Terminology**:
- "Actual Hourly Wage" → "Raunverulegt tímakaup"
- "Life Energy" → "Lífsorka" or "Líftími"
- "Job Offer" → "Starfstilboð"
- "Comparison" → "Samanburður"

**Benefit Types**:
- Lunch benefit → "Dagpeningugleði"
- Car allowance → "Bílastyrður"
- Phone allowance → "Símastyrður"
- Pension contribution → "Lífeyrissparnaður"

**Number Formatting**:
- ISK currency: "6.000.000 kr." (Icelandic format)
- Hours: "1.875 klst." or "1.875 klukkustundir"
- Use `Intl.NumberFormat` for locale-aware formatting

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Coverage Target**: 80%+

**Test Files**:
- `actualHourlyWage.test.ts`: Test calculation accuracy, edge cases
- `comparisonAnalyzer.test.ts`: Test ranking logic, plain language generation
- `exportImport.test.ts`: Test serialization/deserialization, validation
- `storage.test.ts`: Test localStorage interactions, error handling

**Key Test Cases**:
```typescript
describe('actualHourlyWage', () => {
  it('calculates correct hourly wage for standard offer', () => {
    const offer = createMockOffer({
      salary: 6_000_000,
      weeklyHours: 40,
      vacationDays: 24,
      commuteMinutes: 0,
    });
    const result = calculateActualHourlyWage(offer);
    expect(result.actualHourlyWage).toBeCloseTo(3191, 0); // Approx
  });

  it('factors in commute time correctly', () => {
    const offerWithCommute = createMockOffer({
      salary: 6_000_000,
      weeklyHours: 40,
      vacationDays: 24,
      commuteMinutes: 60, // 1 hour/day
    });
    const offerNoCommute = createMockOffer({
      salary: 6_000_000,
      weeklyHours: 40,
      vacationDays: 24,
      commuteMinutes: 0,
    });

    const resultWithCommute = calculateActualHourlyWage(offerWithCommute);
    const resultNoCommute = calculateActualHourlyWage(offerNoCommute);

    expect(resultWithCommute.actualHourlyWage).toBeLessThan(
      resultNoCommute.actualHourlyWage
    );
    expect(resultWithCommute.annualTotalHours).toBeGreaterThan(
      resultNoCommute.annualTotalHours
    );
  });

  it('includes monetary benefits in total compensation', () => {
    const offer = createMockOffer({
      salary: 6_000_000,
      monetaryBenefits: [
        { type: 'lunch', label: 'Lunch', annualValue: 200_000 },
        { type: 'phone', label: 'Phone', annualValue: 60_000 },
      ],
    });
    const result = calculateActualHourlyWage(offer);
    expect(result.totalCompensation).toBe(6_260_000);
  });
});
```

### 10.2 Integration Tests

**Test Files**:
- `OfferCard.integration.test.tsx`: Test form submission, validation
- `ComparisonView.integration.test.tsx`: Test comparison rendering, updates
- `ExportImport.integration.test.tsx`: Test full export/import cycle

**Key Test Cases**:
- Add offer → See it in comparison
- Edit offer → Comparison updates live
- Remove offer → Comparison recalculates
- Export → Import → Verify data integrity

### 10.3 End-to-End Tests

**Tool**: Playwright or Cypress

**Test Scenarios**:
1. **Happy Path**: Add 3 offers, see comparison, export
2. **Edit Scenario**: Add offer, edit details, verify recalculation
3. **Import/Export**: Export comparison, clear data, import, verify restoration
4. **Validation**: Attempt invalid inputs, verify error messages
5. **Mobile**: Test swipe navigation, responsive layout

**Example E2E Test**:
```typescript
test('complete comparison workflow', async ({ page }) => {
  await page.goto('/tools/job-offer-comparison');

  // Add first offer
  await page.click('text=Add Offer');
  await page.fill('input[name="name"]', 'Tech Lead at X');
  await page.fill('input[name="salary"]', '6000000');
  // ... fill other fields

  // Add second offer
  await page.click('text=Add Offer');
  await page.fill('input[name="name"]', 'Senior Dev at Y');
  await page.fill('input[name="salary"]', '5800000');

  // Verify comparison appears
  await expect(page.locator('text=Comparison')).toBeVisible();
  await expect(page.locator('text=Tech Lead at X')).toBeVisible();
  await expect(page.locator('text=Senior Dev at Y')).toBeVisible();

  // Check winner indicator
  await expect(page.locator('text=🏆')).toBeVisible();

  // Export
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Export');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/job-comparison-\d{4}-\d{2}-\d{2}\.json/);
});
```

### 10.4 Accessibility Tests

**Tool**: axe-core (via jest-axe or @axe-core/playwright)

**Test Cases**:
- No accessibility violations on initial render
- No violations after adding offer
- No violations in comparison view
- Keyboard navigation works (tab through all interactive elements)

---

## 11. Design Decisions

### 11.1 Decision 1: Local-First vs. Backend Storage

**Options Considered**:
1. **Local-First** (localStorage only)
2. Backend storage with user accounts
3. Hybrid (backend optional, local primary)

**Decision**: Local-First (Option 1)

**Rationale**:
- **Privacy**: Aligns with app philosophy (no user data collection)
- **Simplicity**: No backend needed, faster to implement
- **Offline**: Works without network connection
- **Cost**: No server costs
- **User Trust**: Data never leaves their device

**Trade-offs**:
- Cannot sync across devices
- Data lost if localStorage is cleared
- Mitigated by export/import functionality

---

### 11.2 Decision 2: Maximum 5 Offers

**Options Considered**:
1. Unlimited offers
2. Maximum 5 offers
3. Maximum 3 offers

**Decision**: Maximum 5 Offers (Option 2)

**Rationale**:
- **Usability**: More than 5 offers becomes overwhelming to compare
- **Realistic**: Most users evaluate 2-4 offers in reality
- **Performance**: Keeps calculations and UI rendering fast
- **UI Constraints**: Side-by-side comparison fits on most screens with 5 columns

**Trade-offs**:
- Users with 6+ offers must prioritize (but this is rare)
- Can be increased later if user feedback demands it

---

### 11.3 Decision 3: Non-Monetary Factors as Qualitative, Not Quantitative

**Options Considered**:
1. **Qualitative display only** (show ratings, don't factor into "best offer" ranking)
2. Quantitative weighting (user assigns ISK value to flexibility, stress, etc.)
3. Weighted scoring (combine monetary + non-monetary into overall score)

**Decision**: Qualitative Display Only (Option 1)

**Rationale**:
- **Simplicity**: Avoids subjective weighting complexity
- **Clarity**: Keeps monetary comparison objective
- **User Control**: Users can mentally weigh qualitative factors themselves
- **Controversy Avoidance**: Assigning ISK value to "stress" is philosophically tricky

**Trade-offs**:
- No "holistic winner" calculation
- Users must manually consider non-monetary factors
- Future: Could add optional weighted mode as advanced feature

---

### 11.4 Decision 4: EARS Format for Requirements

**Options Considered**:
1. User stories only
2. **EARS format** (Event-driven, Augmented Requirements)
3. Gherkin (Given-When-Then)

**Decision**: EARS Format (Option 2)

**Rationale**:
- **Clarity**: WHEN/IF/THEN format is precise and testable
- **Coverage**: Handles conditional requirements well
- **Familiarity**: Aligns with app's spec-driven development methodology

**Trade-offs**:
- Slightly more verbose than user stories alone
- Requires understanding EARS syntax

---

### 11.5 Decision 5: Actual Hourly Wage Methodology Reuse

**Options Considered**:
1. **Reuse existing methodology** (import from separate module)
2. Reimplement specific to this feature
3. Simplify calculation for this feature

**Decision**: Reuse Existing Methodology (Option 1)

**Rationale**:
- **Consistency**: Same calculation across all app features
- **Maintenance**: Single source of truth for methodology
- **Trust**: Users expect consistency with other app calculations

**Trade-offs**:
- Dependency on another feature (must coordinate implementation)
- If methodology changes, all features update (pro and con)

---

## 12. Future Enhancements

### 12.1 Phase 2 Features (Post-MVP)

**FE-1: Historical Tracking**
- Save multiple comparisons over time
- View "Offer History" to see past decisions
- Compare current offers to previously rejected offers

**FE-2: Holistic Scoring Mode**
- Allow users to assign weight to non-monetary factors
- Calculate weighted "overall score" (monetary + qualitative)
- Toggle between "Monetary Only" and "Holistic" ranking

**FE-3: Customizable Benefit Types**
- Allow users to add custom benefit categories
- Save custom benefit templates for reuse

**FE-4: Scenario Analysis**
- "What if" mode: Adjust inputs to see impact
- Slider for commute time: "What if I moved closer?"
- Projection: "What does this look like over 5 years?"

**FE-5: Shareable Comparisons**
- Generate shareable link (anonymized data)
- Share with partner/family for decision-making
- Requires backend or client-side encryption

### 12.2 Technical Improvements

**TI-1: Performance Monitoring**
- Add analytics to track calculation performance
- Monitor localStorage usage

**TI-2: Advanced Visualizations**
- Interactive charts (Chart.js or Recharts)
- Animated transitions between comparisons

**TI-3: Progressive Web App (PWA)**
- Install as standalone app
- Offline-first with service worker
- Push notifications (optional reminders)

---

## 13. Design Validation

### 13.1 Requirements Coverage

| Requirement ID | Addressed in Design |
|----------------|---------------------|
| AC-1 | OfferCard component, max 5 validation |
| AC-2 | OfferFormFields, JobOffer interface |
| AC-3 | actualHourlyWage.ts module |
| AC-4 | ComparisonTable/ComparisonCards components |
| AC-5 | LifeEnergyVisualizer component |
| AC-6 | AssumptionsPanel component |
| AC-7 | comparisonStorage.ts module |
| AC-8 | loadComparison() on mount |
| AC-9 | exportComparison() function |
| AC-10 | importComparison() function |
| AC-11 | Default values in JobOffer schema |
| AC-12 | MonetaryBenefit types, Icelandic labels |
| AC-13 | i18n implementation plan |
| AC-14 | Plain language generation in comparisonAnalyzer.ts |
| AC-15 | Visual indicators in ComparisonTable |
| AC-16 | Responsive layout design |
| AC-17 | Zod schema validation |
| AC-18 | Edit mode in OfferCard |
| AC-19 | Remove offer action, min 2 validation |
| AC-20 | Non-monetary factors separate display |
| AC-21 | Guidance text in UI |
| NFR-1 | React optimization, debouncing |
| NFR-2 | localStorage, no network dependency |
| NFR-3 | Only name + salary required |
| NFR-4 | Winner indicator, clear ranking |
| NFR-5 | Mobile-first responsive design |
| NFR-6 | localStorage only, no backend |
| NFR-7 | JSON export format |
| NFR-8 | Keyboard navigation plan |
| NFR-9 | ARIA labels, semantic HTML |
| NFR-10 | Modular calculation module |

**Coverage**: 30/30 requirements addressed (100%)

### 13.2 Design Quality Checklist

- [x] All components clearly defined with responsibilities
- [x] Data models specified with TypeScript interfaces
- [x] Business logic separated from UI components
- [x] State management strategy defined (React Context)
- [x] Error handling considered for all failure modes
- [x] Accessibility requirements addressed
- [x] Performance considerations documented
- [x] Testing strategy defined (unit, integration, E2E)
- [x] Internationalization plan included
- [x] Design decisions documented with rationale
- [x] Requirements traceability maintained
- [x] Future enhancements identified

---

## 14. Implementation Notes

### 14.1 Development Sequence

**Recommended Order**:
1. Data models and TypeScript interfaces
2. Zod validation schemas
3. Actual Hourly Wage calculation module (+ tests)
4. Comparison analyzer module (+ tests)
5. localStorage persistence module (+ tests)
6. OfferCard component (input form)
7. ComparisonTable component (basic display)
8. ComparisonProvider (state management)
9. LifeEnergyVisualizer component
10. AssumptionsPanel component
11. Export/Import functionality
12. Mobile responsive layouts
13. i18n implementation
14. Accessibility enhancements
15. E2E tests
16. Performance optimization

### 14.2 Dependencies on Other Features

**Critical Dependency**:
- **Actual Hourly Wage Methodology**: Must be implemented first or in parallel
  - Can be stubbed initially with simple calculation
  - Replace with full methodology once available

**Optional Dependencies**:
- Export/Import utilities (if app-wide feature exists, reuse it)
- i18n framework (if already set up, integrate; otherwise, set up for this feature)

### 14.3 File Structure

```
app/
├── (tools)/
│   └── job-offer-comparison/
│       ├── page.tsx (JobOfferComparisonPage)
│       ├── components/
│       │   ├── ComparisonProvider.tsx
│       │   ├── OfferInputSection.tsx
│       │   ├── OfferCard.tsx
│       │   ├── OfferFormFields.tsx
│       │   ├── ComparisonViewSection.tsx
│       │   ├── ComparisonTable.tsx
│       │   ├── ComparisonCards.tsx
│       │   ├── LifeEnergyVisualizer.tsx
│       │   ├── AssumptionsPanel.tsx
│       │   └── ComparisonActions.tsx
│       ├── hooks/
│       │   ├── useComparison.ts
│       │   └── useLocalStorage.ts
│       └── __tests__/
│           ├── OfferCard.test.tsx
│           └── ComparisonView.test.tsx

lib/
├── calculations/
│   ├── actualHourlyWage.ts
│   ├── actualHourlyWage.test.ts
│   ├── comparisonAnalyzer.ts
│   └── comparisonAnalyzer.test.ts
├── storage/
│   ├── comparisonStorage.ts
│   └── comparisonStorage.test.ts
├── io/
│   ├── exportImport.ts
│   └── exportImport.test.ts
├── validation/
│   └── schemas.ts (Zod schemas)
└── types/
    └── jobOffer.ts (TypeScript interfaces)

locales/
├── is/
│   └── job-comparison.json
└── en/
    └── job-comparison.json
```

---

## 15. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Design Agent | Initial design document created |

---

**Document Status**: Ready for Tasks Phase
**Next Step**: Create tasks document (`tasks-job-offer-comparison.md`) that breaks down this design into actionable implementation tasks.
