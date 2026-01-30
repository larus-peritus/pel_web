# Tasks: "Cut 10.000 kr" Impact Cards

## Overview

**Feature**: "Cut 10.000 kr" Impact Cards (2.2.2)
**App**: peninganaedalifid.is
**Requirements**: [requirements-cut-10000kr-impact.md](./requirements-cut-10000kr-impact.md)
**Design**: [design-cut-10000kr-impact.md](./design-cut-10000kr-impact.md)

## Implementation Summary

This task breakdown implements the "Cut 10.000 kr" Impact Cards feature, which displays category-specific cards showing the impact of spending cuts on:
- FI date (months/years earlier to financial independence)
- Life energy reclaimed (hours/days per month and year)
- Future value if invested (10-year and 20-year projections)

### Total Estimated Effort

- **Foundation Tasks**: 6-8 hours
- **Component Tasks**: 12-16 hours
- **Integration & Polish**: 4-6 hours
- **Testing**: 6-8 hours

**Total**: 28-38 hours (~4-5 working days)

### Implementation Strategy

**Strategy**: Foundation-First with Parallel Component Development

1. **Phase 1: Foundation** (Sequential)
   - Types and data structures
   - Calculation engine
   - Category definitions

2. **Phase 2: Core Components** (Can be parallelized)
   - Basic components (displays, selector, controls)
   - Main container component
   - Grid layout

3. **Phase 3: Integration** (Sequential)
   - Context integration
   - localStorage persistence
   - Polish and accessibility

4. **Phase 4: Testing & Documentation** (Parallel with Phase 3)
   - Unit tests
   - Component tests
   - E2E tests

---

## Prerequisites

Before starting these tasks:

- [x] Project is set up (Next.js + React + TypeScript + Tailwind)
- [x] Core UI components exist (Input, Button, Card, Slider)
- [x] localStorage hooks are available
- [x] Actual Hourly Wage Calculator is implemented (provides actualHourlyWage)
- [x] CalculatorContext is available
- [ ] Understand FIRE concepts (FI number, savings rate, life energy)

---

## Task Breakdown

### Epic 1: Foundation - Types and Calculations

Build the foundation: TypeScript types, pure calculation functions, and category definitions.

---

#### Task 1.1: Define TypeScript Types

**Priority**: High
**Estimated Time**: 1 hour
**Dependencies**: None

**Objective**: Create all TypeScript types for the Cut Impact Cards feature.

**Files to Create/Modify**:
- `src/types/cutImpact.ts` (create new)

**Functionality**:

Define types for:

```typescript
// src/types/cutImpact.ts

/**
 * Spending category definition
 */
export interface CategoryDefinition {
  id: string;              // e.g., 'subscriptions'
  nameIs: string;          // Icelandic name: 'Áskriftir'
  icon: string;            // Emoji icon: '📺'
  examples: string;        // Examples: 't.d. Netflix, Spotify, líkamsrækt'
}

/**
 * Life energy metrics
 */
export interface LifeEnergyMetrics {
  hoursPerMonth: number;    // e.g., 5.3
  hoursPerYear: number;     // e.g., 63.6
  daysPerYear: number | null; // e.g., 2.7 or null if < 24 hours
}

/**
 * Impact level for visual indicators
 */
export type ImpactLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'none';

/**
 * FI date shift result
 */
export interface FIDateShift {
  months: number;           // e.g., 8 (months earlier to FI)
  impactLevel: ImpactLevel; // Visual indicator level
}

/**
 * Complete category impact calculation
 */
export interface CategoryImpact extends CategoryDefinition {
  lifeEnergy: LifeEnergyMetrics;
  futureValue10: number;     // ISK after 10 years at 7%
  futureValue20: number;     // ISK after 20 years at 7%
  fiDateShift: FIDateShift | null; // null if FI inputs not available
}

/**
 * Sort order options
 */
export type SortOrder = 'fi-impact' | 'life-energy' | 'future-value' | 'alphabetical';

/**
 * Settings persisted to localStorage
 */
export interface CutImpactSettings {
  cutAmount: number;        // ISK, e.g., 10000
  sortOrder: SortOrder;     // e.g., 'fi-impact'
  lastUpdated: string;      // ISO timestamp
}

/**
 * FI planning inputs (optional)
 */
export interface FIInputs {
  savingsRate: number;       // 0-1, e.g., 0.3 for 30%
  fiNumber: number;          // ISK, target FI nest egg
  currentNetWorth: number;   // ISK, current assets
  grossAnnualIncome: number; // ISK, for FI date calculation
}
```

**Tests to Add**:
- Verify types compile without errors
- Verify all required properties are present

**Requirements Traceability**:
- REQ-1: CategoryDefinition, CategoryImpact
- REQ-2: CutImpactSettings, SortOrder
- REQ-3: LifeEnergyMetrics
- REQ-4: FIDateShift, ImpactLevel
- REQ-5: futureValue10, futureValue20

**Acceptance Criteria**:
- [x] All types defined in `src/types/cutImpact.ts`
- [x] Types exported and importable
- [x] No TypeScript compilation errors
- [x] Types match design specification exactly

---

#### Task 1.2: Create Category Definitions

**Priority**: High
**Estimated Time**: 30 minutes
**Dependencies**: Task 1.1

**Objective**: Define the 6 spending categories with Icelandic names and examples.

**Files to Create/Modify**:
- `src/lib/data/categories.ts` (create new)

**Functionality**:

```typescript
// src/lib/data/categories.ts

import { CategoryDefinition } from '@/types/cutImpact';

/**
 * Six main spending categories for impact analysis
 */
export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'subscriptions',
    nameIs: 'Áskriftir',
    icon: '📺',
    examples: 't.d. Netflix, Spotify, líkamsrækt',
  },
  {
    id: 'dining',
    nameIs: 'Veitingastaðir',
    icon: '🍽️',
    examples: 't.d. hádegisverður, kaffihús, kvöldverður',
  },
  {
    id: 'transportation',
    nameIs: 'Samgöngur',
    icon: '🚗',
    examples: 't.d. eldsneyti, bílastæði, Strætó',
  },
  {
    id: 'shopping',
    nameIs: 'Verslanir',
    icon: '🛍️',
    examples: 't.d. föt, raftæki, húsgögn',
  },
  {
    id: 'entertainment',
    nameIs: 'Skemmtun',
    icon: '🎉',
    examples: 't.d. bíó, tónleikar, ferðalög',
  },
  {
    id: 'other',
    nameIs: 'Annað',
    icon: '📦',
    examples: 't.d. fötþvottur, tómstundir, gjafir',
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}
```

**Tests to Add**:
- Verify 6 categories defined
- Verify all have required fields
- Verify getCategoryById works

**Requirements Traceability**:
- REQ-1: 6 category definitions
- REQ-7: Icelandic names and examples

**Acceptance Criteria**:
- [x] 6 categories defined with Icelandic names
- [x] All categories have icon, nameIs, examples
- [x] Examples are realistic for Iceland
- [x] getCategoryById helper function works

---

#### Task 1.3: Implement Calculation Functions

**Priority**: High
**Estimated Time**: 3-4 hours
**Dependencies**: Task 1.1

**Objective**: Create pure calculation functions for life energy, future value, and FI date shift.

**Files to Create/Modify**:
- `src/lib/calculations/cutImpact.ts` (create new)

**Functionality**:

Implement these functions:

1. **`calculateLifeEnergy(cutAmount, actualHourlyWage)`**
   - Returns: `LifeEnergyMetrics`
   - Calculates hours/month, hours/year, days/year

2. **`calculateFutureValue(monthlyAmount, years, annualRate = 0.07)`**
   - Returns: `number` (ISK)
   - Uses compound interest formula: `FV = PMT × ((1 + r)^n - 1) / r`

3. **`calculateFIDateShift(cutAmount, fiInputs)`**
   - Returns: `FIDateShift | null`
   - Calculates months earlier to FI
   - Assigns impact level

4. **`calculateCategoryImpact(category, cutAmount, actualHourlyWage, fiInputs?)`**
   - Returns: `CategoryImpact`
   - Combines all calculations for one category

5. **`calculateAllCategoryImpacts(categories, cutAmount, actualHourlyWage, fiInputs?)`**
   - Returns: `CategoryImpact[]`
   - Calculates for all categories

6. **`sortCategoryImpacts(impacts, sortOrder)`**
   - Returns: `CategoryImpact[]`
   - Sorts by specified order

**Key Formula**: Future Value
```typescript
const monthlyRate = annualRate / 12;
const months = years * 12;
const fv = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
return Math.round(fv);
```

**Tests to Add**:
- `calculateLifeEnergy` with various wages
- `calculateFutureValue` for 10 and 20 years
- `calculateFIDateShift` with valid/invalid inputs
- `sortCategoryImpacts` for all sort orders
- Edge cases: 0 wage, negative values, no FI inputs

**Requirements Traceability**:
- REQ-3: calculateLifeEnergy
- REQ-4: calculateFIDateShift
- REQ-5: calculateFutureValue
- REQ-6: sortCategoryImpacts

**Acceptance Criteria**:
- [x] All 6 calculation functions implemented
- [x] All functions are pure (no side effects)
- [x] All edge cases handled (zero, null, negative)
- [x] Calculations match manual verification
- [x] Unit tests achieve >90% coverage

---

#### Task 1.4: Add Impact Level Determination Logic

**Priority**: Medium
**Estimated Time**: 1 hour
**Dependencies**: Task 1.3

**Objective**: Implement logic to determine visual impact level based on FI date shift.

**Files to Modify**:
- `src/lib/calculations/cutImpact.ts`

**Functionality**:

```typescript
/**
 * Determine impact level based on months saved
 */
function getImpactLevel(months: number): ImpactLevel {
  if (months >= 36) return 'very-high';  // 3+ years
  if (months >= 12) return 'high';       // 1-3 years
  if (months >= 3) return 'moderate';    // 3-12 months
  if (months >= 1) return 'low';         // 1-3 months
  return 'none';                         // < 1 month
}

/**
 * Get visual indicator for impact level
 */
export function getImpactIndicator(level: ImpactLevel): {
  bars: string;
  label: string;
} {
  const indicators = {
    'very-high': { bars: '●●●●●●●●●●', label: 'Mjög mikil áhrif' },
    'high': { bars: '●●●●●●●○○○', label: 'Mikil áhrif' },
    'moderate': { bars: '●●●●●○○○○○', label: 'Miðlungs áhrif' },
    'low': { bars: '●●○○○○○○○○', label: 'Lítil áhrif' },
    'none': { bars: '○○○○○○○○○○', label: 'Minni áhrif' },
  };
  return indicators[level];
}

/**
 * Get gradient CSS class for impact level
 */
export function getGradientClass(level: ImpactLevel): string {
  const gradients = {
    'very-high': 'bg-gradient-to-br from-green-400 to-green-600',
    'high': 'bg-gradient-to-br from-green-300 to-blue-500',
    'moderate': 'bg-gradient-to-br from-blue-300 to-blue-500',
    'low': 'bg-gradient-to-br from-gray-200 to-gray-400',
    'none': 'bg-gradient-to-br from-gray-100 to-gray-300',
  };
  return gradients[level];
}
```

**Tests to Add**:
- Verify correct level for each months range
- Verify indicator bars and labels
- Verify gradient class mapping

**Requirements Traceability**:
- REQ-4: Visual impact indicators
- REQ-10: Gradient color coding

**Acceptance Criteria**:
- [x] Impact levels correctly assigned
- [x] Visual indicators defined
- [x] Gradient classes mapped
- [x] All helper functions tested

---

### Epic 2: UI Components

Build the React components for displaying impact cards and controls.

---

#### Task 2.1: Create LifeEnergyDisplay Component

**Priority**: High
**Estimated Time**: 1.5 hours
**Dependencies**: Task 1.1

**Objective**: Display life energy metrics in hours and days.

**Files to Create**:
- `src/components/cut-impact/LifeEnergyDisplay.tsx`

**Functionality**:

```typescript
interface LifeEnergyDisplayProps {
  hoursPerMonth: number;
  hoursPerYear: number;
  daysPerYear: number | null;
}

const LifeEnergyDisplay: React.FC<LifeEnergyDisplayProps> = ({
  hoursPerMonth,
  hoursPerYear,
  daysPerYear,
}) => {
  return (
    <div className="life-energy-section">
      <div className="section-label">
        <span className="icon" aria-hidden="true">⏰</span>
        <span>LÍFSORKA</span>
      </div>

      <div className="energy-metrics">
        <span>{hoursPerMonth.toFixed(1)} klst/mán</span>
        <span className="separator">•</span>
        <span>{hoursPerYear.toFixed(1)} klst/ári</span>
      </div>

      {daysPerYear !== null && daysPerYear >= 1 && (
        <div className="energy-days">
          ({daysPerYear.toFixed(1)} dagar/ári)
        </div>
      )}
    </div>
  );
};
```

**Styling**:
- Section label with icon (⏰)
- Metrics in flex row with separator (•)
- Days shown only if >= 1 day
- Font sizes: label 0.75rem, metrics 1rem, days 0.875rem

**Tests to Add**:
- Renders hours correctly
- Shows days when >= 24 hours
- Hides days when < 24 hours
- Formats numbers with 1 decimal

**Requirements Traceability**:
- REQ-3: Life energy display

**Acceptance Criteria**:
- [x] Displays hours/month and hours/year
- [x] Conditionally displays days/year
- [x] Uses Icelandic labels
- [x] Accessible (ARIA labels)
- [x] Responsive styling

---

#### Task 2.2: Create FutureValueDisplay Component

**Priority**: High
**Estimated Time**: 1.5 hours
**Dependencies**: Task 1.1

**Objective**: Display future value projections with tooltip.

**Files to Create**:
- `src/components/cut-impact/FutureValueDisplay.tsx`

**Functionality**:

```typescript
interface FutureValueDisplayProps {
  value10Years: number;
  value20Years: number;
}

const FutureValueDisplay: React.FC<FutureValueDisplayProps> = ({
  value10Years,
  value20Years,
}) => {
  return (
    <div className="future-value-section">
      <div className="section-label">
        <span className="icon" aria-hidden="true">💰</span>
        <span>EF FJÁRFEST</span>
        <Tooltip content="Miðað við 7% ársávöxtun með mánaðarlegum innborgunum">
          <InfoIcon />
        </Tooltip>
      </div>

      <div className="fv-row">
        <span className="fv-label">Eftir 10 ár:</span>
        <span className="fv-value">{formatISK(value10Years)}</span>
      </div>

      <div className="fv-row">
        <span className="fv-label">Eftir 20 ár:</span>
        <span className="fv-value">{formatISK(value20Years)}</span>
      </div>
    </div>
  );
};
```

**Styling**:
- Section label with icon and info tooltip
- FV rows with label and value
- Bold values with ISK formatting
- Info icon shows tooltip on hover/focus

**Tests to Add**:
- Renders both 10yr and 20yr values
- Formats ISK correctly
- Tooltip displays on hover
- Tooltip content correct

**Requirements Traceability**:
- REQ-5: Future value display

**Acceptance Criteria**:
- [x] Displays 10-year and 20-year values
- [x] ISK formatting correct (thousands separators)
- [x] Tooltip explains 7% assumption
- [x] Accessible (keyboard navigable tooltip)

---

#### Task 2.3: Create FIImpactDisplay Component

**Priority**: High
**Estimated Time**: 2 hours
**Dependencies**: Task 1.1, Task 1.4

**Objective**: Display FI date shift with visual impact indicator.

**Files to Create**:
- `src/components/cut-impact/FIImpactDisplay.tsx`

**Functionality**:

```typescript
interface FIImpactDisplayProps {
  months: number;
  impactLevel: ImpactLevel;
}

const FIImpactDisplay: React.FC<FIImpactDisplayProps> = ({
  months,
  impactLevel,
}) => {
  const formatted = formatMonths(months);
  const indicator = getImpactIndicator(impactLevel);

  return (
    <div className="fi-impact-section">
      <div className="section-label">
        <span className="icon" aria-hidden="true">📅</span>
        <span>FI ÁHRIF</span>
      </div>

      <div className="fi-shift">{formatted}</div>

      <div className="impact-indicator">
        <span className="bars" aria-hidden="true">{indicator.bars}</span>
        <span className="impact-label">{indicator.label}</span>
      </div>
    </div>
  );
};

// Helper function
function formatMonths(months: number): string {
  if (months < 1) return 'Minni áhrif';
  if (months < 12) return `${months} mánuðum fyrr`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ár${years > 1 ? 'um' : 'i'} fyrr`;
  }
  return `${years} ár${years > 1 ? 'um' : 'i'} og ${remainingMonths} mánuðum fyrr`;
}
```

**Styling**:
- Section label with icon (📅)
- Large, bold FI shift text
- Visual indicator bars with label
- Color-coordinated with impact level

**Tests to Add**:
- Format months correctly (< 12, 12-23, 24+)
- Icelandic grammar correct (ár vs árum)
- Impact indicator displays correctly
- Bars and label match impact level

**Requirements Traceability**:
- REQ-4: FI date shift display

**Acceptance Criteria**:
- [x] Displays months in Icelandic format
- [x] Shows visual indicator bars
- [x] Impact label matches level
- [x] Handles edge cases (0 months, 1 month, etc.)

---

#### Task 2.4: Create ImpactCard Component

**Priority**: High
**Estimated Time**: 2.5 hours
**Dependencies**: Task 2.1, Task 2.2, Task 2.3, Task 1.4

**Objective**: Composite component displaying all impact metrics for one category.

**Files to Create**:
- `src/components/cut-impact/ImpactCard.tsx`

**Functionality**:

```typescript
interface ImpactCardProps {
  impact: CategoryImpact;
  cutAmount: number;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ impact, cutAmount }) => {
  const gradientClass = getGradientClass(
    impact.fiDateShift?.impactLevel || 'none'
  );

  return (
    <article
      className={`impact-card ${gradientClass}`}
      aria-label={`${impact.nameIs} áhrif`}
    >
      <header className="card-header">
        <span className="category-icon" aria-hidden="true">
          {impact.icon}
        </span>
        <h3 className="category-name">{impact.nameIs}</h3>
      </header>

      <div className="cut-headline">
        Draga úr um {formatISK(cutAmount)}/mán
      </div>

      {impact.fiDateShift && (
        <FIImpactDisplay
          months={impact.fiDateShift.months}
          impactLevel={impact.fiDateShift.impactLevel}
        />
      )}

      <LifeEnergyDisplay
        hoursPerMonth={impact.lifeEnergy.hoursPerMonth}
        hoursPerYear={impact.lifeEnergy.hoursPerYear}
        daysPerYear={impact.lifeEnergy.daysPerYear}
      />

      <FutureValueDisplay
        value10Years={impact.futureValue10}
        value20Years={impact.futureValue20}
      />

      <footer className="card-footer">
        <p className="examples">{impact.examples}</p>
      </footer>
    </article>
  );
};
```

**Styling**:
- Card with gradient background based on impact level
- Rounded corners, padding, shadow
- Header with icon and category name
- Sections stacked vertically
- Footer with examples in muted text

**Tests to Add**:
- Renders all sections correctly
- Applies correct gradient class
- Conditionally renders FI impact
- Displays all metrics

**Requirements Traceability**:
- REQ-1: Category-specific cards
- REQ-10: Visual clarity

**Acceptance Criteria**:
- [x] Displays category icon, name, examples
- [x] Shows cut amount headline
- [x] Conditionally shows FI impact
- [x] Always shows life energy and future value
- [x] Applies gradient background
- [x] Accessible (semantic HTML, ARIA)

---

#### Task 2.5: Create CutAmountSelector Component

**Priority**: High
**Estimated Time**: 2 hours
**Dependencies**: Task 1.1

**Objective**: Slider control for adjusting monthly cut amount.

**Files to Create**:
- `src/components/cut-impact/CutAmountSelector.tsx`

**Functionality**:

```typescript
interface CutAmountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const CutAmountSelector: React.FC<CutAmountSelectorProps> = ({
  value,
  onChange,
  min,
  max,
  step,
}) => {
  return (
    <div className="cut-amount-selector">
      <label htmlFor="cut-amount-slider" className="selector-label">
        Mánaðarleg lækkun
      </label>

      <div className="amount-display">
        {formatISK(value)}
      </div>

      <input
        id="cut-amount-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${formatISK(value)} á mánuði`}
      />

      <div className="slider-labels">
        <span>{formatISK(min)}</span>
        <span>{formatISK(max)}</span>
      </div>
    </div>
  );
};
```

**Styling**:
- Large amount display (2rem font)
- Custom-styled slider track and thumb
- Min/max labels below slider
- Touch-friendly (min 44px height on mobile)

**Tests to Add**:
- Slider updates value on change
- Displays current amount correctly
- Min/max labels correct
- ARIA attributes present

**Requirements Traceability**:
- REQ-2: Customize cut amount

**Acceptance Criteria**:
- [x] Slider range 1.000 - 100.000 kr
- [x] Step size 1.000 kr
- [x] Displays current amount prominently
- [x] Updates on slider change
- [x] Accessible (ARIA labels, keyboard control)

---

#### Task 2.6: Create SortControls Component

**Priority**: Medium
**Estimated Time**: 1.5 hours
**Dependencies**: Task 1.1

**Objective**: Buttons for sorting categories by different criteria.

**Files to Create**:
- `src/components/cut-impact/SortControls.tsx`

**Functionality**:

```typescript
interface SortControlsProps {
  currentSort: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'fi-impact', label: 'FI áhrif' },
  { value: 'life-energy', label: 'Lífsorka' },
  { value: 'future-value', label: 'Framtíðarvirði' },
  { value: 'alphabetical', label: 'Flokki' },
];

const SortControls: React.FC<SortControlsProps> = ({
  currentSort,
  onSortChange,
}) => {
  return (
    <div className="sort-controls" role="group" aria-label="Raðunarval">
      <span className="sort-label">Raða eftir:</span>

      {SORT_OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={currentSort === option.value ? 'active' : ''}
          aria-pressed={currentSort === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
```

**Styling**:
- Horizontal button group
- Active button highlighted
- Mobile: Stack vertically or use select dropdown
- Accessible focus states

**Tests to Add**:
- Clicking button triggers onSortChange
- Active button highlighted
- ARIA pressed state correct

**Requirements Traceability**:
- REQ-6: Compare and sort categories

**Acceptance Criteria**:
- [x] 4 sort options available
- [x] Active option highlighted
- [x] Triggers sort change on click
- [x] Accessible (ARIA roles, keyboard nav)
- [x] Responsive (stacks on mobile)

---

#### Task 2.7: Create ImpactCardGrid Component

**Priority**: Medium
**Estimated Time**: 1 hour
**Dependencies**: Task 2.4

**Objective**: Responsive grid layout for impact cards.

**Files to Create**:
- `src/components/cut-impact/ImpactCardGrid.tsx`

**Functionality**:

```typescript
interface ImpactCardGridProps {
  impacts: CategoryImpact[];
  cutAmount: number;
}

const ImpactCardGrid: React.FC<ImpactCardGridProps> = ({
  impacts,
  cutAmount,
}) => {
  return (
    <div
      className="impact-card-grid"
      role="list"
      aria-label="Útgjaldaflokkar"
    >
      {impacts.map(impact => (
        <ImpactCard
          key={impact.id}
          impact={impact}
          cutAmount={cutAmount}
        />
      ))}
    </div>
  );
};
```

**Styling** (Tailwind):
```css
.impact-card-grid {
  @apply grid gap-6;
  @apply grid-cols-1;           /* Mobile: 1 column */
  @apply md:grid-cols-2;        /* Tablet: 2 columns */
  @apply lg:grid-cols-3;        /* Desktop: 3 columns */
}
```

**Tests to Add**:
- Renders all cards
- Grid layout responsive
- Cards maintain order

**Requirements Traceability**:
- REQ-6: Compare multiple categories
- REQ-8: Mobile-optimized

**Acceptance Criteria**:
- [x] Displays all category cards
- [x] Responsive: 1/2/3 column layout
- [x] Maintains card order
- [x] Accessible (role="list")

---

#### Task 2.8: Create MissingDataNotice Component

**Priority**: Medium
**Estimated Time**: 1 hour
**Dependencies**: None

**Objective**: Display helpful message when required data is missing.

**Files to Create**:
- `src/components/cut-impact/MissingDataNotice.tsx`

**Functionality**:

```typescript
interface MissingDataNoticeProps {
  type: 'hourlyWage' | 'fiInputs';
}

const MissingDataNotice: React.FC<MissingDataNoticeProps> = ({ type }) => {
  const messages = {
    hourlyWage: {
      title: 'Raunverulegt tímakaup vantar',
      description: 'Til að sjá lífsorku áhrif þarftu að reikna raunverulegt tímakaup þitt fyrst.',
      action: 'Fara í tímakaupsreiknivél',
      link: '#actual-hourly-wage',
    },
    fiInputs: {
      title: 'FI markmið ekki sett upp',
      description: 'Settu upp FI markmið til að sjá hversu miklu skiptir fyrir FI dagsetninguna.',
      action: 'Setja upp FI markmið',
      link: '#fi-planning',
    },
  };

  const msg = messages[type];

  return (
    <div className="missing-data-notice" role="alert">
      <h3>{msg.title}</h3>
      <p>{msg.description}</p>
      <a href={msg.link} className="btn-primary">
        {msg.action}
      </a>
    </div>
  );
};
```

**Styling**:
- Info box with icon
- Clear title and description
- Primary button for action
- Friendly, encouraging tone

**Tests to Add**:
- Renders correct message for each type
- Link points to correct section

**Requirements Traceability**:
- Error handling for missing data

**Acceptance Criteria**:
- [x] Shows appropriate message for each type
- [x] Links to relevant calculator
- [x] Accessible (role="alert")
- [x] Clear, actionable guidance

---

### Epic 3: Main Container and Integration

Bring together all components and integrate with Context and localStorage.

---

#### Task 3.1: Create CutImpactCards Main Component

**Priority**: High
**Estimated Time**: 3 hours
**Dependencies**: All Epic 2 tasks, Task 1.3

**Objective**: Main container component that orchestrates all child components and manages state.

**Files to Create**:
- `src/components/cut-impact/CutImpactCards.tsx`
- `src/components/cut-impact/index.ts` (barrel export)

**Functionality**:

```typescript
const CutImpactCards: React.FC = () => {
  // State
  const [cutAmount, setCutAmount] = useState<number>(10000);
  const [sortOrder, setSortOrder] = useState<SortOrder>('fi-impact');

  // Context
  const {
    results,           // { actualHourlyWage }
    savingsRate,       // optional
    fiNumber,          // optional
    currentNetWorth,   // optional
    grossAnnualIncome, // optional
  } = useCalculator();

  // Check for required data
  const actualHourlyWage = results?.actualHourlyWage || 0;

  if (actualHourlyWage <= 0) {
    return <MissingDataNotice type="hourlyWage" />;
  }

  // Calculate impacts
  const fiInputs = (savingsRate && fiNumber && grossAnnualIncome)
    ? { savingsRate, fiNumber, currentNetWorth: currentNetWorth || 0, grossAnnualIncome }
    : undefined;

  const categoryImpacts = useMemo(() => {
    const impacts = calculateAllCategoryImpacts(
      CATEGORIES,
      cutAmount,
      actualHourlyWage,
      fiInputs
    );
    return sortCategoryImpacts(impacts, sortOrder);
  }, [cutAmount, actualHourlyWage, fiInputs, sortOrder]);

  // Persist settings to localStorage
  useEffect(() => {
    const settings: CutImpactSettings = {
      cutAmount,
      sortOrder,
      lastUpdated: new Date().toISOString(),
    };
    safeSetItem('cutImpactSettings', JSON.stringify(settings));
  }, [cutAmount, sortOrder]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = safeGetItem('cutImpactSettings');
    if (saved) {
      try {
        const settings: CutImpactSettings = JSON.parse(saved);
        setCutAmount(settings.cutAmount);
        setSortOrder(settings.sortOrder);
      } catch (err) {
        console.error('Failed to load cut impact settings:', err);
      }
    }
  }, []);

  return (
    <section className="cut-impact-cards">
      <header className="section-header">
        <h2>Draga úr um {formatISK(cutAmount)} á mánuði</h2>
        <p className="subtitle">
          Sjáðu hversu miklu skiptir að draga úr útgjöldum í mismunandi flokkum
        </p>
      </header>

      <CutAmountSelector
        value={cutAmount}
        onChange={setCutAmount}
        min={1000}
        max={100000}
        step={1000}
      />

      <SortControls
        currentSort={sortOrder}
        onSortChange={setSortOrder}
      />

      <ImpactCardGrid
        impacts={categoryImpacts}
        cutAmount={cutAmount}
      />

      {!fiInputs && (
        <aside className="fi-notice">
          <p>
            💡 <strong>Ábending:</strong> Settu upp FI markmið til að sjá hversu miklu
            skiptir fyrir FI dagsetninguna þína.
          </p>
        </aside>
      )}
    </section>
  );
};
```

**Tests to Add**:
- Renders with actual hourly wage available
- Shows missing data notice without wage
- Updates on cut amount change
- Updates on sort order change
- Saves settings to localStorage
- Loads settings from localStorage

**Requirements Traceability**:
- REQ-1, REQ-2, REQ-6, REQ-9

**Acceptance Criteria**:
- [x] Orchestrates all child components
- [x] Manages cut amount and sort order state
- [x] Integrates with CalculatorContext
- [x] Persists settings to localStorage
- [x] Handles missing data gracefully
- [x] Performs all calculations via useMemo

---

#### Task 3.2: Integrate with CalculatorContext

**Priority**: High
**Estimated Time**: 1.5 hours
**Dependencies**: Task 3.1

**Objective**: Ensure Cut Impact Cards reads data from existing CalculatorContext.

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (if needed to expose FI inputs)

**Functionality**:

Verify these values are available from Context:
- `results.actualHourlyWage` ✓ (already exists)
- `savingsRate` (add if not present)
- `fiNumber` (add if not present)
- `currentNetWorth` (add if not present)
- `grossAnnualIncome` (add if not present)

If FI inputs not yet in Context, add:

```typescript
// Add to CalculatorContext
interface CalculatorContextType {
  // ... existing fields

  // FI Planning inputs (optional)
  savingsRate?: number;
  fiNumber?: number;
  currentNetWorth?: number;
  grossAnnualIncome?: number;

  // Setters
  setSavingsRate?: (rate: number) => void;
  setFINumber?: (number: number) => void;
  setCurrentNetWorth?: (worth: number) => void;
  setGrossAnnualIncome?: (income: number) => void;
}
```

**Tests to Add**:
- Cut Impact Cards reads actualHourlyWage from Context
- Optional FI inputs work when present
- Cards work without FI inputs

**Requirements Traceability**:
- Integration with existing calculator

**Acceptance Criteria**:
- [x] actualHourlyWage read from Context
- [x] FI inputs available (optional)
- [x] No duplicate data storage
- [x] Context updates trigger recalculation

---

#### Task 3.3: Add localStorage Persistence

**Priority**: Medium
**Estimated Time**: 1 hour
**Dependencies**: Task 3.1

**Objective**: Persist cut amount and sort order settings across sessions.

**Files to Modify**:
- `src/components/cut-impact/CutImpactCards.tsx` (already in Task 3.1)

**Functionality**:

Already implemented in Task 3.1:
- Save settings on cutAmount or sortOrder change
- Load settings on component mount
- Handle parsing errors gracefully

Additional: Integrate with main app export/import

**Files to Modify**:
- `src/context/CalculatorContext.tsx` (export/import methods)

```typescript
// Add to exportData
exportData() {
  // ... existing export code

  // Include cut impact settings
  const cutImpactSettings = safeGetItem('cutImpactSettings');
  if (cutImpactSettings) {
    data.cutImpactSettings = JSON.parse(cutImpactSettings);
  }

  // ...
}

// Add to importData
importData(jsonData) {
  // ... existing import code

  // Restore cut impact settings
  if (jsonData.cutImpactSettings) {
    safeSetItem('cutImpactSettings', JSON.stringify(jsonData.cutImpactSettings));
  }

  // ...
}
```

**Tests to Add**:
- Settings persist across page reload
- Export includes cut impact settings
- Import restores cut impact settings

**Requirements Traceability**:
- REQ-9: Data persistence

**Acceptance Criteria**:
- [x] Settings saved to localStorage
- [x] Settings restored on mount
- [x] Included in export/import
- [x] Errors handled gracefully

---

### Epic 4: Polish and Accessibility

Final touches for production readiness.

---

#### Task 4.1: Add Responsive Styling

**Priority**: High
**Estimated Time**: 2 hours
**Dependencies**: All component tasks

**Objective**: Ensure perfect responsive behavior on all screen sizes.

**Files to Modify**:
- All component files (add/refine Tailwind classes)
- `src/styles/cutImpact.css` (if needed for custom styles)

**Functionality**:

Mobile (< 768px):
- Single column grid
- Stacked sort buttons or select dropdown
- Touch-friendly controls (44px min)
- 16px minimum font size
- Collapsed card view optional

Tablet (768-1024px):
- 2-column grid
- Horizontal sort buttons
- Comfortable spacing

Desktop (> 1024px):
- 3-column grid
- All controls inline
- Hover effects

**Tests to Add**:
- Visual regression tests at 320px, 768px, 1024px, 1440px
- Touch target sizes >= 44px
- Text readable on all devices

**Requirements Traceability**:
- REQ-8: Mobile-optimized experience

**Acceptance Criteria**:
- [x] Works on 320px screens
- [x] Grid responsive (1/2/3 columns)
- [x] Touch targets >= 44px
- [x] Font sizes >= 16px on mobile
- [x] No horizontal scroll

---

#### Task 4.2: Ensure Accessibility Compliance

**Priority**: High
**Estimated Time**: 2 hours
**Dependencies**: All component tasks

**Objective**: Meet WCAG 2.1 AA standards.

**Files to Modify**:
- All component files (add ARIA attributes, improve semantics)

**Accessibility Checklist**:

- [x] All interactive elements keyboard accessible
- [x] Logical tab order
- [x] ARIA labels on all controls
- [x] Color contrast >= 4.5:1 for text
- [x] Color not sole indicator (use text + color)
- [x] Focus indicators visible
- [x] Screen reader announcements correct
- [x] Semantic HTML (article, section, header, footer)
- [x] Icons have text alternatives
- [x] Tooltips accessible via keyboard

**Tools**:
- axe DevTools for automated testing
- Screen reader testing (VoiceOver/NVDA)
- Keyboard-only navigation testing

**Tests to Add**:
- Automated accessibility tests (axe-core)
- Keyboard navigation test
- Screen reader test

**Requirements Traceability**:
- NFR: Accessibility (WCAG 2.1 AA)

**Acceptance Criteria**:
- [x] Zero violations in axe DevTools
- [x] Keyboard navigable
- [x] Screen reader compatible
- [x] Color contrast compliant
- [x] Focus indicators visible

---

#### Task 4.3: Add Animations and Transitions

**Priority**: Low
**Estimated Time**: 1.5 hours
**Dependencies**: Task 4.1

**Objective**: Smooth animations for better UX (respecting prefers-reduced-motion).

**Files to Modify**:
- Component files (add transition classes)
- `tailwind.config.js` (custom transitions if needed)

**Animations to Add**:

1. **Card reordering** (on sort change)
   - Smooth position transitions
   - Duration: 300ms

2. **Hover effects** (desktop only)
   - Card lift on hover
   - Subtle shadow increase

3. **Slider feedback**
   - Thumb scale on drag
   - Track fill animation

4. **Loading states** (if needed)
   - Skeleton screens while calculating

**Accessibility**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Tests to Add**:
- Animations work as expected
- prefers-reduced-motion respected

**Requirements Traceability**:
- REQ-10: Visual clarity and engagement
- NFR: Accessibility

**Acceptance Criteria**:
- [x] Smooth card reordering
- [x] Hover effects on desktop
- [x] Respects prefers-reduced-motion
- [x] No jank or flicker

---

### Epic 5: Testing

Comprehensive testing across all levels.

---

#### Task 5.1: Write Unit Tests for Calculations

**Priority**: High
**Estimated Time**: 2 hours
**Dependencies**: Task 1.3

**Objective**: Achieve >90% coverage on calculation functions.

**Files to Create**:
- `tests/lib/calculations/cutImpact.test.ts`

**Test Cases**:

```typescript
describe('calculateLifeEnergy', () => {
  test('calculates hours correctly');
  test('handles low hourly wage');
  test('returns null for daysPerYear if < 24 hours');
  test('handles zero hourly wage');
});

describe('calculateFutureValue', () => {
  test('calculates 10-year FV correctly at 7%');
  test('calculates 20-year FV correctly at 7%');
  test('handles 0% return rate');
  test('rounds to nearest ISK');
});

describe('calculateFIDateShift', () => {
  test('calculates months saved correctly');
  test('returns null for invalid inputs');
  test('assigns correct impact level');
  test('handles already at FI scenario');
});

describe('sortCategoryImpacts', () => {
  test('sorts by FI impact descending');
  test('sorts by life energy descending');
  test('sorts by future value descending');
  test('sorts alphabetically');
});
```

**Requirements Traceability**:
- All calculation requirements

**Acceptance Criteria**:
- [x] >90% code coverage
- [x] All edge cases tested
- [x] All tests passing

---

#### Task 5.2: Write Component Tests

**Priority**: High
**Estimated Time**: 3 hours
**Dependencies**: All Epic 2 tasks

**Objective**: Test all React components render and behave correctly.

**Files to Create**:
- `tests/components/cut-impact/LifeEnergyDisplay.test.tsx`
- `tests/components/cut-impact/FutureValueDisplay.test.tsx`
- `tests/components/cut-impact/FIImpactDisplay.test.tsx`
- `tests/components/cut-impact/ImpactCard.test.tsx`
- `tests/components/cut-impact/CutAmountSelector.test.tsx`
- `tests/components/cut-impact/SortControls.test.tsx`
- `tests/components/cut-impact/CutImpactCards.test.tsx`

**Test Framework**: React Testing Library + Jest

**Sample Tests**:

```typescript
describe('ImpactCard', () => {
  test('displays category icon, name, examples');
  test('shows cut amount headline');
  test('conditionally renders FI impact');
  test('always shows life energy and future value');
  test('applies correct gradient class');
});

describe('CutAmountSelector', () => {
  test('slider updates value on change');
  test('displays current amount correctly');
  test('enforces min/max constraints');
  test('ARIA attributes present');
});

describe('CutImpactCards', () => {
  test('renders all 6 category cards');
  test('shows missing data notice if no actualHourlyWage');
  test('updates all cards when cut amount changes');
  test('sorts cards on sort order change');
  test('saves settings to localStorage');
  test('loads settings from localStorage');
});
```

**Requirements Traceability**:
- All component requirements

**Acceptance Criteria**:
- [x] All components have tests
- [x] >80% component coverage
- [x] All tests passing

---

#### Task 5.3: Write Integration Tests

**Priority**: Medium
**Estimated Time**: 2 hours
**Dependencies**: Task 3.1, Task 3.2

**Objective**: Test full feature flow from user interaction to display.

**Files to Create**:
- `tests/integration/cutImpact.test.tsx`

**Test Cases**:

```typescript
describe('Cut Impact Cards - Full Flow', () => {
  test('user adjusts cut amount → cards update');
  test('user changes sort order → cards reorder');
  test('user without actualHourlyWage → sees notice');
  test('user with FI inputs → sees FI impact');
  test('user without FI inputs → sees life energy only');
  test('settings persist across page reload');
});
```

**Requirements Traceability**:
- REQ-2, REQ-6, REQ-9

**Acceptance Criteria**:
- [x] Full user flows tested
- [x] Context integration tested
- [x] localStorage persistence tested
- [x] All tests passing

---

#### Task 5.4: Write E2E Tests

**Priority**: Low
**Estimated Time**: 2 hours
**Dependencies**: Task 3.1

**Objective**: Test feature in real browser environment.

**Files to Create**:
- `e2e/cutImpact.spec.ts` (Playwright)

**Test Cases**:

```typescript
test('User can explore spending cut impact', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Draga úr útgjöldum');

  // Verify default
  await expect(page.locator('text=10.000 kr')).toBeVisible();

  // Adjust cut amount
  await page.locator('input[type="range"]').fill('25000');
  await expect(page.locator('text=25.000 kr').first()).toBeVisible();

  // Change sort
  await page.click('text=Framtíðarvirði');

  // Verify cards reordered
  const firstCard = page.locator('article').first();
  await expect(firstCard).toContainText(/Eftir 20 ár/);
});
```

**Requirements Traceability**:
- All user-facing requirements

**Acceptance Criteria**:
- [x] Key user flows tested in browser
- [x] All tests passing

---

### Epic 6: Documentation and Finalization

---

#### Task 6.1: Add Component Documentation

**Priority**: Low
**Estimated Time**: 1 hour
**Dependencies**: All component tasks

**Objective**: Document all components with JSDoc comments.

**Files to Modify**:
- All component files (add JSDoc)

**Documentation Format**:

```typescript
/**
 * Displays life energy metrics in hours per month/year and days per year
 *
 * @example
 * <LifeEnergyDisplay
 *   hoursPerMonth={5.3}
 *   hoursPerYear={63.6}
 *   daysPerYear={2.7}
 * />
 */
const LifeEnergyDisplay: React.FC<LifeEnergyDisplayProps> = ({ ... }) => {
  // ...
};
```

**Acceptance Criteria**:
- [x] All components have JSDoc
- [x] All public functions documented
- [x] Examples provided where helpful

---

#### Task 6.2: Create User Guide (Optional)

**Priority**: Low
**Estimated Time**: 1 hour
**Dependencies**: Task 3.1

**Objective**: Help text or tooltips for users.

**Files to Create**:
- Tooltips in components
- Optional: `docs/cut-impact-user-guide.md`

**Content**:
- What is life energy?
- How are FI date shifts calculated?
- Why 7% return rate?
- How to interpret impact levels

**Acceptance Criteria**:
- [x] Key concepts explained
- [x] Accessible in-app (tooltips or help icon)

---

## Implementation Checklist

### Foundation (Epic 1)
- [ ] Task 1.1: Define TypeScript Types
- [ ] Task 1.2: Create Category Definitions
- [ ] Task 1.3: Implement Calculation Functions
- [ ] Task 1.4: Add Impact Level Determination Logic

### UI Components (Epic 2)
- [ ] Task 2.1: Create LifeEnergyDisplay Component
- [ ] Task 2.2: Create FutureValueDisplay Component
- [ ] Task 2.3: Create FIImpactDisplay Component
- [ ] Task 2.4: Create ImpactCard Component
- [ ] Task 2.5: Create CutAmountSelector Component
- [ ] Task 2.6: Create SortControls Component
- [ ] Task 2.7: Create ImpactCardGrid Component
- [ ] Task 2.8: Create MissingDataNotice Component

### Integration (Epic 3)
- [ ] Task 3.1: Create CutImpactCards Main Component
- [ ] Task 3.2: Integrate with CalculatorContext
- [ ] Task 3.3: Add localStorage Persistence

### Polish (Epic 4)
- [ ] Task 4.1: Add Responsive Styling
- [ ] Task 4.2: Ensure Accessibility Compliance
- [ ] Task 4.3: Add Animations and Transitions

### Testing (Epic 5)
- [ ] Task 5.1: Write Unit Tests for Calculations
- [ ] Task 5.2: Write Component Tests
- [ ] Task 5.3: Write Integration Tests
- [ ] Task 5.4: Write E2E Tests

### Documentation (Epic 6)
- [ ] Task 6.1: Add Component Documentation
- [ ] Task 6.2: Create User Guide (Optional)

---

## Dependencies Map

```
Epic 1 (Foundation)
  Task 1.1 → Task 1.2, 1.3, 1.4
  Task 1.3 → Epic 2, Epic 3
  Task 1.4 → Task 2.3, 2.4

Epic 2 (Components)
  Task 2.1, 2.2, 2.3 → Task 2.4
  Task 2.4 → Task 2.7
  All → Task 3.1

Epic 3 (Integration)
  Task 3.1 → Task 3.2, 3.3
  Epic 2 → Epic 3

Epic 4 (Polish)
  Epic 2, Epic 3 → Epic 4

Epic 5 (Testing)
  Epic 1 → Task 5.1
  Epic 2 → Task 5.2
  Epic 3 → Task 5.3, 5.4

Epic 6 (Documentation)
  Epic 2 → Task 6.1
  Epic 3 → Task 6.2
```

---

## Critical Path

**Minimum Viable Implementation** (core functionality):

1. Task 1.1: Types
2. Task 1.2: Categories
3. Task 1.3: Calculations
4. Task 2.1, 2.2: Display components
5. Task 2.4: ImpactCard
6. Task 2.5: CutAmountSelector
7. Task 2.7: ImpactCardGrid
8. Task 3.1: CutImpactCards Main
9. Task 3.2: Context Integration
10. Task 4.1: Responsive Styling
11. Task 5.1, 5.2: Core Tests

**Total Critical Path**: ~18-22 hours

---

## Risk Mitigation

**Risk**: Calculation accuracy
- **Mitigation**: Task 5.1 includes extensive unit tests with known values

**Risk**: Performance with real-time recalculation
- **Mitigation**: useMemo, throttled slider updates (100ms)

**Risk**: Accessibility violations
- **Mitigation**: Task 4.2 dedicated to accessibility, automated testing

**Risk**: Mobile UX issues
- **Mitigation**: Task 4.1 focuses on responsive design, tested on real devices

---

## Success Criteria

Feature is complete when:

- [x] All 6 categories display with correct calculations
- [x] Cut amount adjustable from 1.000 to 100.000 kr
- [x] Real-time updates (< 100ms)
- [x] FI date shift shown when inputs available
- [x] Life energy and future value always shown
- [x] Cards sortable by 4 criteria
- [x] Settings persist across sessions
- [x] Responsive on mobile, tablet, desktop
- [x] WCAG 2.1 AA compliant
- [x] >85% test coverage
- [x] All tests passing

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Ready for Implementation
**Next Steps**: Begin with Epic 1 (Foundation) tasks
