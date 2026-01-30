# Design: "Cut 10.000 kr" Impact Cards

## Overview

**Feature**: "Cut 10.000 kr" Impact Cards (2.2.2)
**App**: peninganaedalifid.is
**Requirements**: [requirements-cut-10000kr-impact.md](./requirements-cut-10000kr-impact.md)

### Summary

The "Cut 10.000 kr" Impact Cards feature transforms abstract spending cuts into concrete, visual insights. Users see category-specific cards displaying:
- FI date acceleration (months/years earlier to financial independence)
- Life energy reclaimed (hours of life back per month/year)
- Future value if invested (10-year and 20-year projections at 7%)

This motivates informed spending cuts by making impact tangible and personal.

### Core Design Principles

1. **Visual-First**: Cards are the primary UI - colorful, engaging, information-dense
2. **Real-Time Updates**: All calculations update instantly as user adjusts cut amount
3. **Client-Only**: All computation client-side, data stored in localStorage
4. **Icelandic Context**: Category examples, terminology, and formatting tailored for Iceland
5. **Progressive Enhancement**: Works without FI inputs (shows life energy + future value), enhanced with FI data (shows timeline impact)

### Key Components

- **CutImpactCards**: Main container component orchestrating the feature
- **CutAmountSelector**: Slider/input for adjusting monthly cut amount (1.000 - 100.000 kr)
- **ImpactCard**: Individual category card showing all metrics
- **SortControls**: Buttons to sort cards by different criteria
- **ImpactCalculations**: Pure functions for all calculation logic

### Technology Stack

- **React** + **TypeScript**: UI components with type safety
- **Context API**: Share actual hourly wage, FI inputs from main calculator
- **useMemo**: Memoize expensive calculations
- **Tailwind CSS**: Styling with gradient backgrounds for impact levels
- **localStorage**: Persist cut amount and sort preferences

### Key Calculations

```typescript
// Life Energy
lifeEnergyHours = monthlyCutAmount / actualHourlyWage

// Future Value (compound interest)
FV = monthlyCutAmount × ((1 + r)^n - 1) / r
// where r = 0.07/12, n = months (120 or 240)

// FI Date Shift
currentYearsToFI = (fiNumber - netWorth) / currentAnnualSavings
newYearsToFI = (fiNumber - netWorth) / (currentAnnualSavings + annualCut)
fiDateShift = currentYearsToFI - newYearsToFI
```

### Design Decisions

Five key decisions shaped this design:

1. **Fixed 6 categories** (not user-customizable): Simplicity for MVP
2. **7% fixed return rate**: Standard FIRE assumption, no user adjustment
3. **Card-based UI** (not table): More engaging, mobile-friendly
4. **Real-time recalculation**: Slider changes update all cards instantly
5. **Gradient color coding**: Visual feedback on impact levels

---

## Architecture

### System Overview

The Impact Cards feature is a read-mostly component that consumes data from the Actual Hourly Wage Calculator and optionally from FI planning inputs. It performs pure calculations client-side and stores minimal user preferences (cut amount, sort order) in localStorage.

**Core principle**: No network requests, no external APIs. All calculations deterministic and instant.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                React Application                           │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           CalculatorContext (Shared State)           │ │  │
│  │  │  - actualHourlyWage                                  │ │  │
│  │  │  - savingsRate (optional)                            │ │  │
│  │  │  - fiNumber (optional)                               │ │  │
│  │  │  - currentNetWorth (optional)                        │ │  │
│  │  │  - localStorage sync                                 │ │  │
│  │  └────────────────┬─────────────────────────────────────┘ │  │
│  │                   │                                        │  │
│  │  ┌────────────────▼─────────────────────────────────────┐ │  │
│  │  │         CutImpactCards (Main Component)              │ │  │
│  │  │  ┌───────────────────────────────────────────────┐   │ │  │
│  │  │  │ CutAmountSelector                             │   │ │  │
│  │  │  │ - Slider (1.000 - 100.000 kr)                 │   │ │  │
│  │  │  │ - Current amount display                      │   │ │  │
│  │  │  └───────────────┬───────────────────────────────┘   │ │  │
│  │  │                  │                                    │ │  │
│  │  │  ┌───────────────▼───────────────────────────────┐   │ │  │
│  │  │  │ SortControls                                  │   │ │  │
│  │  │  │ [FI áhrif] [Lífsorka] [Framtíðarvirði] [...] │   │ │  │
│  │  │  └───────────────┬───────────────────────────────┘   │ │  │
│  │  │                  │                                    │ │  │
│  │  │  ┌───────────────▼───────────────────────────────┐   │ │  │
│  │  │  │ ImpactCard Grid (6 cards)                     │   │ │  │
│  │  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │ │  │
│  │  │  │  │ Áskriftir│  │Veitinga- │  │Samgöngur │    │   │ │  │
│  │  │  │  │          │  │staðir    │  │          │    │   │ │  │
│  │  │  │  │ FI: 8mán │  │ FI: 6mán │  │ FI: 10mán│    │   │ │  │
│  │  │  │  │ LE: 5.3h │  │ LE: 5.3h │  │ LE: 5.3h │    │   │ │  │
│  │  │  │  │ FV: 1.7M │  │ FV: 1.7M │  │ FV: 1.7M │    │   │ │  │
│  │  │  │  └──────────┘  └──────────┘  └──────────┘    │   │ │  │
│  │  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │ │  │
│  │  │  │  │ Verslanir│  │Skemmtun  │  │  Annað   │    │   │ │  │
│  │  │  │  │ ...      │  │ ...      │  │  ...     │    │   │ │  │
│  │  │  │  └──────────┘  └──────────┘  └──────────┘    │   │ │  │
│  │  │  └───────────────────────────────────────────────┘   │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         Calculation Engine (Pure Functions)          │ │  │
│  │  │  - calculateLifeEnergy()                             │ │  │
│  │  │  - calculateFutureValue()                            │ │  │
│  │  │  - calculateFIDateShift()                            │ │  │
│  │  │  - rankCategoriesByImpact()                          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         Data Layer (localStorage)                    │ │  │
│  │  │  - cutAmount: 10000                                  │ │  │
│  │  │  - sortOrder: 'fi-impact'                            │ │  │
│  │  │  - lastUpdated: timestamp                            │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User loads page** → Restore cut amount and sort order from localStorage
2. **Component mounts** → Read actualHourlyWage and optional FI inputs from Context
3. **User adjusts slider** → Update cutAmount state → Trigger recalculation
4. **Calculation runs** → For each of 6 categories:
   - Calculate life energy hours
   - Calculate future values (10yr, 20yr)
   - Calculate FI date shift (if FI inputs available)
5. **Results rendered** → 6 ImpactCards displayed with color-coded gradients
6. **User changes sort** → Reorder cards with smooth animation
7. **User leaves page** → Save cutAmount and sortOrder to localStorage

**Performance optimization**: All calculations wrapped in `useMemo` with dependencies on cutAmount, actualHourlyWage, and FI inputs.

### Integration Points

**With Actual Hourly Wage Calculator**:
- Reads `results.actualHourlyWage` from Context
- If not available, shows: "Reiknaðu raunverulegt tímakaup þitt fyrst"

**With FI Planning (Future)**:
- Optionally reads `savingsRate`, `fiNumber`, `currentNetWorth` from Context
- If not available, hides FI date shift, shows only life energy and future value

**With localStorage**:
- Saves `cutImpactSettings: { cutAmount, sortOrder, lastUpdated }`
- Integrates with main app export/import

---

## Components and Interfaces

### Component Hierarchy

```
CutImpactCards
├── CutAmountSelector
│   └── Slider
├── SortControls
│   └── Button (×4)
├── ImpactCardGrid
│   └── ImpactCard (×6)
│       ├── CategoryHeader
│       ├── FIImpactDisplay (conditional)
│       ├── LifeEnergyDisplay
│       ├── FutureValueDisplay
│       └── ExamplesText
└── MissingDataNotice (conditional)
```

---

### 1. CutImpactCards (Main Container)

**Purpose**: Orchestrate the entire feature, manage state, coordinate child components.

**Responsibilities**:
- Load cut amount and sort order from localStorage
- Read actualHourlyWage and FI inputs from Context
- Manage cutAmount state
- Manage sortOrder state
- Calculate impact metrics for all 6 categories
- Render child components
- Save settings to localStorage on change (debounced 500ms)

**Public Interface**:
```typescript
interface CutImpactCardsProps {
  className?: string;
}

const CutImpactCards: React.FC<CutImpactCardsProps> = ({ className }) => {
  // Implementation
};
```

**State**:
```typescript
const [cutAmount, setCutAmount] = useState<number>(10000); // ISK
const [sortOrder, setSortOrder] = useState<SortOrder>('fi-impact');
```

**Context Usage**:
```typescript
const {
  results,           // { actualHourlyWage }
  savingsRate,       // optional
  fiNumber,          // optional
  currentNetWorth,   // optional
} = useCalculator();
```

**Calculations** (via useMemo):
```typescript
const categoryImpacts = useMemo(() => {
  return CATEGORIES.map(category => ({
    ...category,
    lifeEnergy: calculateLifeEnergy(cutAmount, actualHourlyWage),
    futureValue10: calculateFutureValue(cutAmount, 10),
    futureValue20: calculateFutureValue(cutAmount, 20),
    fiDateShift: fiInputsAvailable
      ? calculateFIDateShift(cutAmount, savingsRate, fiNumber, currentNetWorth)
      : null,
  })).sort(by(sortOrder));
}, [cutAmount, actualHourlyWage, savingsRate, fiNumber, currentNetWorth, sortOrder]);
```

**Rendering Logic**:
```typescript
// If actual hourly wage not available
if (!actualHourlyWage || actualHourlyWage <= 0) {
  return <MissingDataNotice type="hourlyWage" />;
}

// Normal render
return (
  <section className={className}>
    <header>
      <h2>Draga úr um {formatISK(cutAmount)} á mánuði</h2>
      <p>Sjáðu hversu miklu skiptir að draga úr útgjöldum í mismunandi flokkum</p>
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
      sortOrder={sortOrder}
    />
  </section>
);
```

---

### 2. CutAmountSelector

**Purpose**: Allow user to adjust monthly cut amount with visual feedback.

**Responsibilities**:
- Display current cut amount prominently
- Render slider (1.000 - 100.000 kr)
- Handle slider value changes
- Display min/max labels
- Format ISK values

**Public Interface**:
```typescript
interface CutAmountSelectorProps {
  value: number;           // Current cut amount in ISK
  onChange: (value: number) => void;
  min: number;             // e.g., 1000
  max: number;             // e.g., 100000
  step: number;            // e.g., 1000
}
```

**Implementation**:
```typescript
const CutAmountSelector: React.FC<CutAmountSelectorProps> = ({
  value,
  onChange,
  min,
  max,
  step,
}) => {
  return (
    <div className="cut-amount-selector">
      <label htmlFor="cut-amount-slider">
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

**Styling Notes**:
- Large, readable amount display (2rem font size)
- Custom-styled slider track (Tailwind slider overrides)
- Touch-friendly on mobile (min height 44px)

---

### 3. SortControls

**Purpose**: Let user change how cards are sorted.

**Responsibilities**:
- Display 4 sort buttons (FI impact, Life energy, Future value, Alphabetical)
- Highlight active sort option
- Trigger sort change

**Public Interface**:
```typescript
type SortOrder = 'fi-impact' | 'life-energy' | 'future-value' | 'alphabetical';

interface SortControlsProps {
  currentSort: SortOrder;
  onSortChange: (order: SortOrder) => void;
}
```

**Implementation**:
```typescript
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

---

### 4. ImpactCard

**Purpose**: Display impact metrics for one spending category.

**Responsibilities**:
- Show category icon and name
- Display FI date shift (if available) with color-coded impact level
- Display life energy (hours/month, hours/year, days/year)
- Display future values (10yr, 20yr)
- Show category examples
- Apply gradient background based on impact level

**Public Interface**:
```typescript
interface CategoryImpact {
  id: string;                    // e.g., 'subscriptions'
  nameIs: string;                // e.g., 'Áskriftir'
  icon: string;                  // e.g., '📺'
  examples: string;              // e.g., 't.d. Netflix, Spotify...'
  lifeEnergy: LifeEnergyMetrics; // { hoursPerMonth, hoursPerYear, daysPerYear }
  futureValue10: number;         // ISK
  futureValue20: number;         // ISK
  fiDateShift: FIDateShift | null; // { months, impactLevel } or null
}

interface ImpactCardProps {
  impact: CategoryImpact;
  cutAmount: number;             // For display context
}
```

**Implementation**:
```typescript
const ImpactCard: React.FC<ImpactCardProps> = ({ impact, cutAmount }) => {
  const impactLevel = impact.fiDateShift?.impactLevel || 'none';
  const gradientClass = getGradientClass(impactLevel);

  return (
    <article className={`impact-card ${gradientClass}`}>
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

// Helper: Determine gradient based on impact level
function getGradientClass(level: ImpactLevel): string {
  switch (level) {
    case 'very-high': return 'gradient-green-strong';
    case 'high': return 'gradient-green';
    case 'moderate': return 'gradient-blue';
    case 'low': return 'gradient-gray';
    case 'none': return 'gradient-neutral';
  }
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│ [📺] Áskriftir                     │  ← Header
│                                     │
│ DRAGA ÚR UM 10.000 KR/MÁN          │  ← Headline
│                                     │
│ 📅 FI ÁHRIF                        │  ← FI Impact (conditional)
│   8 mánuðum fyrr                    │
│   [●●●●●○○○○○] Mikil áhrif         │
│                                     │
│ ⏰ LÍFSORKA                        │  ← Life Energy
│   5,3 klst/mán • 63,6 klst/ári     │
│   (2,7 dagar/ári)                   │
│                                     │
│ 💰 EF FJÁRFEST                     │  ← Future Value
│   Eftir 10 ár: 1.730.849 kr        │
│   Eftir 20 ár: 5.024.312 kr        │
│                                     │
│ t.d. Netflix, Spotify, líkamsrækt  │  ← Footer examples
└─────────────────────────────────────┘
```

---

### 5. FIImpactDisplay

**Purpose**: Show FI date shift with visual impact indicator.

**Public Interface**:
```typescript
type ImpactLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'none';

interface FIImpactDisplayProps {
  months: number;              // e.g., 8
  impactLevel: ImpactLevel;    // e.g., 'moderate'
}
```

**Implementation**:
```typescript
const FIImpactDisplay: React.FC<FIImpactDisplayProps> = ({
  months,
  impactLevel,
}) => {
  const formatted = formatMonths(months); // "8 mánuðum fyrr" or "2 ár og 3 mánuðum fyrr"
  const indicator = getImpactIndicator(impactLevel);

  return (
    <div className="fi-impact">
      <div className="section-label">
        <span className="icon">📅</span>
        <span>FI ÁHRIF</span>
      </div>

      <div className="fi-shift">{formatted}</div>

      <div className="impact-indicator">
        {indicator.bars}
        <span className="impact-label">{indicator.label}</span>
      </div>
    </div>
  );
};

// Helper: Get visual indicator
function getImpactIndicator(level: ImpactLevel) {
  const indicators = {
    'very-high': { bars: '●●●●●●●●●●', label: 'Mjög mikil áhrif' },
    'high': { bars: '●●●●●●●○○○', label: 'Mikil áhrif' },
    'moderate': { bars: '●●●●●○○○○○', label: 'Miðlungs áhrif' },
    'low': { bars: '●●○○○○○○○○', label: 'Lítil áhrif' },
    'none': { bars: '○○○○○○○○○○', label: 'Minni áhrif' },
  };
  return indicators[level];
}

// Helper: Format months
function formatMonths(months: number): string {
  if (months < 1) return 'Minni áhrif';
  if (months < 12) return `${months} mánuðum fyrr`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) return `${years} ár${years > 1 ? 'um' : 'i'} fyrr`;
  return `${years} ár${years > 1 ? 'um' : 'i'} og ${remainingMonths} mánuðum fyrr`;
}
```

---

### 6. LifeEnergyDisplay

**Purpose**: Show life energy reclaimed in hours and days.

**Public Interface**:
```typescript
interface LifeEnergyDisplayProps {
  hoursPerMonth: number;    // e.g., 5.3
  hoursPerYear: number;     // e.g., 63.6
  daysPerYear: number | null; // e.g., 2.7 (if >= 24 hours)
}
```

**Implementation**:
```typescript
const LifeEnergyDisplay: React.FC<LifeEnergyDisplayProps> = ({
  hoursPerMonth,
  hoursPerYear,
  daysPerYear,
}) => {
  return (
    <div className="life-energy">
      <div className="section-label">
        <span className="icon">⏰</span>
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

---

### 7. FutureValueDisplay

**Purpose**: Show future value if cut amount is invested.

**Public Interface**:
```typescript
interface FutureValueDisplayProps {
  value10Years: number;     // ISK, e.g., 1730849
  value20Years: number;     // ISK, e.g., 5024312
}
```

**Implementation**:
```typescript
const FutureValueDisplay: React.FC<FutureValueDisplayProps> = ({
  value10Years,
  value20Years,
}) => {
  return (
    <div className="future-value">
      <div className="section-label">
        <span className="icon">💰</span>
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

---

### 8. ImpactCardGrid

**Purpose**: Lay out impact cards in responsive grid, handle animation.

**Public Interface**:
```typescript
interface ImpactCardGridProps {
  impacts: CategoryImpact[];
  sortOrder: SortOrder;
}
```

**Implementation**:
```typescript
const ImpactCardGrid: React.FC<ImpactCardGridProps> = ({
  impacts,
  sortOrder,
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
          cutAmount={impact.cutAmount}
        />
      ))}
    </div>
  );
};
```

**Grid Layout** (Tailwind):
```css
.impact-card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .impact-card-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .impact-card-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

---

### 9. MissingDataNotice

**Purpose**: Show helpful message when required data is missing.

**Public Interface**:
```typescript
interface MissingDataNoticeProps {
  type: 'hourlyWage' | 'fiInputs';
}
```

**Implementation**:
```typescript
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

---

## Data Models

### Core Types

```typescript
/**
 * Spending category definition
 */
interface CategoryDefinition {
  id: string;              // e.g., 'subscriptions'
  nameIs: string;          // Icelandic name: 'Áskriftir'
  icon: string;            // Emoji icon: '📺'
  examples: string;        // Examples: 't.d. Netflix, Spotify, líkamsrækt'
}

/**
 * Life energy metrics
 */
interface LifeEnergyMetrics {
  hoursPerMonth: number;    // e.g., 5.3
  hoursPerYear: number;     // e.g., 63.6
  daysPerYear: number | null; // e.g., 2.7 (if >= 24 hours) or null
}

/**
 * FI date shift result
 */
interface FIDateShift {
  months: number;           // e.g., 8 (how many months earlier)
  impactLevel: ImpactLevel; // Visual indicator level
}

type ImpactLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'none';

/**
 * Complete category impact calculation
 */
interface CategoryImpact extends CategoryDefinition {
  lifeEnergy: LifeEnergyMetrics;
  futureValue10: number;     // ISK after 10 years at 7%
  futureValue20: number;     // ISK after 20 years at 7%
  fiDateShift: FIDateShift | null; // null if FI inputs not available
}

/**
 * Sort order options
 */
type SortOrder = 'fi-impact' | 'life-energy' | 'future-value' | 'alphabetical';

/**
 * Settings persisted to localStorage
 */
interface CutImpactSettings {
  cutAmount: number;        // ISK, e.g., 10000
  sortOrder: SortOrder;     // e.g., 'fi-impact'
  lastUpdated: string;      // ISO timestamp
}
```

---

### Category Definitions

```typescript
// lib/data/categories.ts

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
```

---

## Calculation Logic

All calculation logic is in pure functions, separated from UI components.

### File: `lib/calculations/cutImpact.ts`

```typescript
/**
 * Calculate life energy reclaimed by cutting spending
 */
export function calculateLifeEnergy(
  monthlyCutAmount: number,
  actualHourlyWage: number
): LifeEnergyMetrics {
  if (actualHourlyWage <= 0) {
    return { hoursPerMonth: 0, hoursPerYear: 0, daysPerYear: null };
  }

  const hoursPerMonth = monthlyCutAmount / actualHourlyWage;
  const hoursPerYear = hoursPerMonth * 12;
  const daysPerYear = hoursPerYear >= 24 ? hoursPerYear / 24 : null;

  return {
    hoursPerMonth,
    hoursPerYear,
    daysPerYear,
  };
}

/**
 * Calculate future value of monthly savings at compound interest
 *
 * FV = PMT × ((1 + r)^n - 1) / r
 *
 * @param monthlyAmount - Amount saved per month (ISK)
 * @param years - Number of years (e.g., 10 or 20)
 * @param annualRate - Annual return rate (default 0.07 for 7%)
 */
export function calculateFutureValue(
  monthlyAmount: number,
  years: number,
  annualRate: number = 0.07
): number {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    // No growth
    return monthlyAmount * months;
  }

  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(futureValue);
}

/**
 * Calculate how much earlier FI date is reached by cutting spending
 *
 * @param monthlyCutAmount - Amount cut per month (ISK)
 * @param currentSavingsRate - Current savings rate (0-1, e.g., 0.3 for 30%)
 * @param fiNumber - Target FI number (25x annual expenses, ISK)
 * @param currentNetWorth - Current net worth (ISK)
 * @param grossAnnualIncome - Gross annual income (ISK)
 */
export function calculateFIDateShift(
  monthlyCutAmount: number,
  currentSavingsRate: number,
  fiNumber: number,
  currentNetWorth: number,
  grossAnnualIncome: number
): FIDateShift | null {
  // Validate inputs
  if (
    currentSavingsRate <= 0 ||
    fiNumber <= 0 ||
    currentNetWorth < 0 ||
    grossAnnualIncome <= 0
  ) {
    return null;
  }

  // Current annual savings
  const currentAnnualSavings = grossAnnualIncome * currentSavingsRate;

  // New annual savings with cut
  const annualCut = monthlyCutAmount * 12;
  const newAnnualSavings = currentAnnualSavings + annualCut;

  // Amount needed to reach FI
  const amountNeeded = fiNumber - currentNetWorth;

  if (amountNeeded <= 0) {
    // Already at FI
    return { months: 0, impactLevel: 'none' };
  }

  // Years to FI (simplified linear model)
  const yearsToFICurrent = amountNeeded / currentAnnualSavings;
  const yearsToFIWithCut = amountNeeded / newAnnualSavings;

  // Date shift
  const yearsSaved = yearsToFICurrent - yearsToFIWithCut;
  const monthsSaved = Math.round(yearsSaved * 12);

  // Determine impact level
  const impactLevel = getImpactLevel(monthsSaved);

  return {
    months: Math.max(0, monthsSaved),
    impactLevel,
  };
}

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
 * Calculate all impact metrics for a category
 */
export function calculateCategoryImpact(
  category: CategoryDefinition,
  cutAmount: number,
  actualHourlyWage: number,
  fiInputs?: {
    savingsRate: number;
    fiNumber: number;
    currentNetWorth: number;
    grossAnnualIncome: number;
  }
): CategoryImpact {
  const lifeEnergy = calculateLifeEnergy(cutAmount, actualHourlyWage);
  const futureValue10 = calculateFutureValue(cutAmount, 10);
  const futureValue20 = calculateFutureValue(cutAmount, 20);

  const fiDateShift = fiInputs
    ? calculateFIDateShift(
        cutAmount,
        fiInputs.savingsRate,
        fiInputs.fiNumber,
        fiInputs.currentNetWorth,
        fiInputs.grossAnnualIncome
      )
    : null;

  return {
    ...category,
    lifeEnergy,
    futureValue10,
    futureValue20,
    fiDateShift,
  };
}

/**
 * Calculate impacts for all categories
 */
export function calculateAllCategoryImpacts(
  categories: CategoryDefinition[],
  cutAmount: number,
  actualHourlyWage: number,
  fiInputs?: {
    savingsRate: number;
    fiNumber: number;
    currentNetWorth: number;
    grossAnnualIncome: number;
  }
): CategoryImpact[] {
  return categories.map(category =>
    calculateCategoryImpact(category, cutAmount, actualHourlyWage, fiInputs)
  );
}

/**
 * Sort categories by specified order
 */
export function sortCategoryImpacts(
  impacts: CategoryImpact[],
  sortOrder: SortOrder
): CategoryImpact[] {
  const sorted = [...impacts];

  switch (sortOrder) {
    case 'fi-impact':
      sorted.sort((a, b) => {
        const aMonths = a.fiDateShift?.months ?? -1;
        const bMonths = b.fiDateShift?.months ?? -1;
        return bMonths - aMonths; // Descending
      });
      break;

    case 'life-energy':
      sorted.sort((a, b) =>
        b.lifeEnergy.hoursPerYear - a.lifeEnergy.hoursPerYear
      );
      break;

    case 'future-value':
      sorted.sort((a, b) =>
        b.futureValue20 - a.futureValue20
      );
      break;

    case 'alphabetical':
      sorted.sort((a, b) =>
        a.nameIs.localeCompare(b.nameIs, 'is')
      );
      break;
  }

  return sorted;
}
```

---

## Error Handling

### Input Validation

```typescript
// Validate cut amount
function validateCutAmount(amount: number): ValidationResult {
  if (amount < 1000) {
    return {
      valid: false,
      error: 'Upphæð verður að vera að minnsta kosti 1.000 kr',
    };
  }

  if (amount > 100000) {
    return {
      valid: false,
      error: 'Upphæð má ekki vera hærri en 100.000 kr',
    };
  }

  if (amount % 1000 !== 0) {
    return {
      valid: false,
      error: 'Upphæð verður að vera í 1.000 kr þrepum',
    };
  }

  return { valid: true };
}
```

### Error States

**1. Missing Actual Hourly Wage**
- **Detection**: `actualHourlyWage <= 0` or `undefined`
- **Response**: Display MissingDataNotice with link to Actual Hourly Wage Calculator
- **User Message**: "Reiknaðu raunverulegt tímakaup þitt fyrst til að sjá lífsorku áhrif"
- **Logging**: None (expected state)

**2. Missing FI Inputs**
- **Detection**: `fiNumber <= 0` or `savingsRate <= 0`
- **Response**: Hide FI date shift section, show only life energy and future value
- **User Message**: Subtle note: "Settu upp FI markmið til að sjá tímalínu áhrif"
- **Logging**: None (expected state)

**3. localStorage Unavailable**
- **Detection**: `safeSetItem()` returns false
- **Response**: Feature still works, settings just not persisted
- **User Message**: Toast notification: "Ekki tókst að vista stillingar. Þær týnast þegar þú lokar glugganum."
- **Logging**: `console.warn('localStorage unavailable')`

**4. Calculation Error**
- **Detection**: Exception in calculation function
- **Response**: Show generic error card: "Ekki tókst að reikna áhrif"
- **User Message**: "Það kom upp villa við útreikning. Vinsamlegast reyndu aftur."
- **Logging**: `console.error('Calculation error:', error)`

---

## Testing Strategy

### Unit Tests

**File**: `tests/lib/calculations/cutImpact.test.ts`

```typescript
describe('calculateLifeEnergy', () => {
  it('calculates hours correctly', () => {
    const result = calculateLifeEnergy(10000, 2000);
    expect(result.hoursPerMonth).toBe(5);
    expect(result.hoursPerYear).toBe(60);
    expect(result.daysPerYear).toBe(2.5);
  });

  it('handles low hourly wage', () => {
    const result = calculateLifeEnergy(10000, 500);
    expect(result.hoursPerMonth).toBe(20);
    expect(result.hoursPerYear).toBe(240);
    expect(result.daysPerYear).toBe(10);
  });

  it('returns null for daysPerYear if < 24 hours', () => {
    const result = calculateLifeEnergy(3000, 2000);
    expect(result.hoursPerYear).toBe(18);
    expect(result.daysPerYear).toBeNull();
  });
});

describe('calculateFutureValue', () => {
  it('calculates 10-year FV correctly at 7%', () => {
    const result = calculateFutureValue(10000, 10, 0.07);
    expect(result).toBeCloseTo(1730849, 0);
  });

  it('calculates 20-year FV correctly at 7%', () => {
    const result = calculateFutureValue(10000, 20, 0.07);
    expect(result).toBeCloseTo(5243929, 0);
  });

  it('handles 0% return rate', () => {
    const result = calculateFutureValue(10000, 10, 0);
    expect(result).toBe(1200000); // 10,000 * 12 * 10
  });
});

describe('calculateFIDateShift', () => {
  it('calculates months saved correctly', () => {
    const result = calculateFIDateShift(
      10000,         // monthly cut
      0.3,           // 30% savings rate
      10000000,      // 10M ISK FI number
      1000000,       // 1M current net worth
      4000000        // 4M annual income
    );

    expect(result).not.toBeNull();
    expect(result!.months).toBeGreaterThan(0);
  });

  it('returns null for invalid inputs', () => {
    const result = calculateFIDateShift(10000, 0, 10000000, 1000000, 4000000);
    expect(result).toBeNull();
  });

  it('assigns correct impact level', () => {
    // Should be 'moderate' for this scenario
    const result = calculateFIDateShift(10000, 0.3, 10000000, 1000000, 4000000);
    expect(result?.impactLevel).toBe('moderate');
  });
});

describe('sortCategoryImpacts', () => {
  it('sorts by FI impact descending', () => {
    const impacts = [
      { /* ... */ fiDateShift: { months: 5, impactLevel: 'moderate' } },
      { /* ... */ fiDateShift: { months: 12, impactLevel: 'high' } },
      { /* ... */ fiDateShift: { months: 2, impactLevel: 'low' } },
    ] as CategoryImpact[];

    const sorted = sortCategoryImpacts(impacts, 'fi-impact');
    expect(sorted[0].fiDateShift?.months).toBe(12);
    expect(sorted[2].fiDateShift?.months).toBe(2);
  });
});
```

### Component Tests

**File**: `tests/components/cut-impact/CutImpactCards.test.tsx`

```typescript
describe('CutImpactCards', () => {
  it('renders all 6 category cards', () => {
    render(
      <CalculatorProvider>
        <CutImpactCards />
      </CalculatorProvider>
    );

    expect(screen.getAllByRole('article')).toHaveLength(6);
  });

  it('shows missing data notice if actual hourly wage not available', () => {
    // Mock context with no actualHourlyWage
    render(
      <CalculatorProvider>
        <CutImpactCards />
      </CalculatorProvider>
    );

    expect(screen.getByText(/raunverulegt tímakaup vantar/i)).toBeInTheDocument();
  });

  it('updates all cards when cut amount changes', async () => {
    render(
      <CalculatorProvider>
        <CutImpactCards />
      </CalculatorProvider>
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 20000 } });

    await waitFor(() => {
      expect(screen.getByText(/20\.000 kr/)).toBeInTheDocument();
    });
  });
});

describe('ImpactCard', () => {
  it('displays FI impact when available', () => {
    const impact: CategoryImpact = {
      id: 'subscriptions',
      nameIs: 'Áskriftir',
      icon: '📺',
      examples: 't.d. Netflix',
      lifeEnergy: { hoursPerMonth: 5, hoursPerYear: 60, daysPerYear: 2.5 },
      futureValue10: 1730849,
      futureValue20: 5243929,
      fiDateShift: { months: 8, impactLevel: 'moderate' },
    };

    render(<ImpactCard impact={impact} cutAmount={10000} />);

    expect(screen.getByText(/8 mánuðum fyrr/)).toBeInTheDocument();
  });

  it('hides FI impact when not available', () => {
    const impact: CategoryImpact = {
      /* ... */
      fiDateShift: null,
    };

    render(<ImpactCard impact={impact} cutAmount={10000} />);

    expect(screen.queryByText(/FI ÁHRIF/)).not.toBeInTheDocument();
  });
});
```

### Integration Tests

**File**: `tests/integration/cutImpact.test.tsx`

```typescript
describe('Cut Impact Cards - Full Flow', () => {
  it('completes user flow: adjust cut amount → see updated impacts', async () => {
    // Setup: User has calculated actual hourly wage
    const { getByRole, getAllByRole } = render(
      <CalculatorProvider initialState={{ actualHourlyWage: 2000 }}>
        <CutImpactCards />
      </CalculatorProvider>
    );

    // Step 1: Verify initial state (10,000 kr default)
    expect(screen.getByText(/10\.000 kr/)).toBeInTheDocument();

    // Step 2: Adjust cut amount to 20,000 kr
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: 20000 } });

    // Step 3: Verify all cards updated
    await waitFor(() => {
      const cards = getAllByRole('article');
      cards.forEach(card => {
        expect(card).toHaveTextContent(/20\.000 kr/);
      });
    });

    // Step 4: Change sort order
    const sortButton = screen.getByText(/Lífsorka/);
    fireEvent.click(sortButton);

    // Step 5: Verify reordering occurred
    await waitFor(() => {
      expect(sortButton).toHaveClass('active');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test('User can explore spending cut impact', async ({ page }) => {
  await page.goto('/');

  // Navigate to Cut Impact Cards
  await page.click('text=Draga úr útgjöldum');

  // Verify default cut amount
  await expect(page.locator('text=10.000 kr')).toBeVisible();

  // Adjust cut amount
  const slider = page.locator('input[type="range"]');
  await slider.fill('25000');

  // Verify cards updated
  await expect(page.locator('text=25.000 kr').first()).toBeVisible();

  // Change sort order
  await page.click('text=Framtíðarvirði');

  // Verify sort changed (first card should have highest 20-year FV)
  const firstCard = page.locator('article').first();
  await expect(firstCard).toContainText(/Eftir 20 ár/);
});
```

---

## Design Decisions

### Decision 1: Fixed 6 Categories (Not User-Customizable)

**Context**: Users might have unique spending categories beyond the default 6.

**Options Considered**:

1. **Allow custom categories** (user-defined)
   - Pros: Flexibility, personalized to user's life
   - Cons: Complex UX, harder to provide meaningful examples, onboarding friction
   - Risk: Most users won't use it, adds significant complexity

2. **Fixed 6 categories** (CHOSEN)
   - Pros: Simple, fast to use, covers 90% of spending, clear examples
   - Cons: Might not fit everyone's spending perfectly
   - Risk: Low - "Other" category provides escape hatch

**Decision**: Use fixed 6 categories for MVP

**Rationale**:
- 6 categories cover most discretionary spending for most users
- Simple UX requires zero configuration
- Easier to provide Icelandic examples and icons
- "Other" category handles edge cases
- Can add custom categories in future if users request it

**Consequences**:
- Simpler codebase (no category CRUD)
- Faster development
- Easier to test
- Better onboarding (users see cards immediately)

**Requirements Satisfied**: REQ-1, REQ-6

---

### Decision 2: 7% Fixed Return Rate (Not User-Adjustable)

**Context**: Future value calculations require an expected return rate assumption.

**Options Considered**:

1. **User-adjustable rate**
   - Pros: Flexibility, conservative users can use 5%, optimistic can use 10%
   - Cons: More UI complexity, risk of unrealistic expectations
   - Risk: Users pick overly optimistic rates (12%+)

2. **Fixed 7% with disclaimer** (CHOSEN)
   - Pros: Simple, standard FIRE community assumption, clear disclaimer
   - Cons: Not accurate for all market conditions/asset mixes
   - Risk: Low if disclaimer is prominent

3. **Multiple scenarios (5%, 7%, 10%)**
   - Pros: Shows range of outcomes
   - Cons: Too much information, decision paralysis
   - Risk: Cluttered UI

**Decision**: Use fixed 7% annual return

**Rationale**:
- 7% is widely accepted in FIRE community (historical S&P 500 average, inflation-adjusted)
- Simplifies MVP - no extra UI needed
- Clear disclaimer: "Miðað við 7% ársávöxtun"
- Tooltip explains: "7% er sögulegt meðaltal hlutabréfavísitölu"
- Can add adjustability later if users request

**Consequences**:
- Simpler UI (no rate selector)
- Consistent messaging
- Easier to explain and understand
- Future enhancement: Add rate selector in settings

**Requirements Satisfied**: REQ-5

---

### Decision 3: Card-Based UI (Not Table)

**Context**: Need to display 6 categories with multiple metrics each.

**Options Considered**:

1. **Table layout**
   - Pros: Compact, easy to scan horizontally
   - Cons: Poor mobile experience, less visually engaging, harder to show examples
   - Risk: Users skip over as "boring spreadsheet"

2. **Card-based grid** (CHOSEN)
   - Pros: Visual, mobile-friendly, engaging, room for examples and icons
   - Cons: Takes more vertical space
   - Risk: Minimal - modern web UI pattern

**Decision**: Use card-based grid layout

**Rationale**:
- Cards are mobile-first (stack vertically)
- More engaging with icons, colors, gradients
- Room for category examples
- Easier to scan on any device
- Modern, expected UI pattern

**Consequences**:
- Responsive grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- Color-coded gradients for impact levels
- Each card is self-contained
- Better accessibility (each card is `<article>`)

**Requirements Satisfied**: REQ-6, REQ-8, REQ-10

---

### Decision 4: Real-Time Recalculation (Not Debounced Submission)

**Context**: User adjusts cut amount slider - when to recalculate?

**Options Considered**:

1. **Debounced recalculation** (wait until user stops dragging)
   - Pros: Fewer calculations, less CPU usage
   - Cons: Delayed feedback, feels sluggish
   - Risk: Poor UX

2. **Real-time recalculation** (CHOSEN)
   - Pros: Instant feedback, feels responsive
   - Cons: More frequent calculations
   - Risk: Low - calculations are fast (<10ms)

**Decision**: Recalculate in real-time (throttled to 100ms max)

**Rationale**:
- Modern web expectation: sliders update instantly
- Calculations are deterministic and fast
- Better UX: user sees impact immediately
- Throttle at 100ms prevents excessive renders

**Consequences**:
- Use `useMemo` with cutAmount as dependency
- Throttle slider onChange to max 10 updates/sec
- Smooth, responsive feel
- Acceptable CPU usage (6 cards × 4 calculations = 24 operations)

**Requirements Satisfied**: REQ-2, NFR-Performance

---

### Decision 5: Gradient Color Coding for Impact Levels

**Context**: Need visual feedback on FI impact magnitude.

**Options Considered**:

1. **Solid color coding** (green/yellow/red)
   - Pros: Clear, familiar traffic light metaphor
   - Cons: Harsh, binary, less modern
   - Risk: Accessibility issues with red/green colorblind

2. **Gradient backgrounds** (CHOSEN)
   - Pros: Modern, visually appealing, smooth transitions, accessible
   - Cons: Slightly more complex CSS
   - Risk: Minimal

3. **Indicator bars only** (no background color)
   - Pros: Subtle
   - Cons: Less impactful visually
   - Risk: Users miss impact level

**Decision**: Use gradient backgrounds with indicator bars

**Rationale**:
- Gradients are modern and engaging
- Color + text label ensures accessibility
- Smooth impact levels (very-high → high → moderate → low → none)
- Combined with indicator bars (●●●●●●) for redundancy

**Color Scheme**:
- Very High: Green gradient (🟢)
- High: Green-blue gradient
- Moderate: Blue gradient (🔵)
- Low: Gray-blue gradient
- None: Gray gradient (⚪)

**Consequences**:
- Define Tailwind gradient utilities
- Ensure WCAG AA contrast ratios
- Provide text labels alongside colors
- Support `prefers-reduced-motion`

**Requirements Satisfied**: REQ-10, NFR-Accessibility

---

## Traceability to Requirements

### REQ-1: See Impact Cards by Category

**Design Components**:
- `CutImpactCards` main container
- `ImpactCard` for each category
- `CATEGORIES` constant with 6 defined categories
- `ImpactCardGrid` for layout

**Calculations**:
- `calculateAllCategoryImpacts()` generates all 6 cards
- Each card shows FI shift, life energy, future value

**Testing**:
- Unit test: Verify 6 categories returned
- Component test: Render all 6 cards
- E2E test: Verify all cards visible

---

### REQ-2: Customize Cut Amount

**Design Components**:
- `CutAmountSelector` with slider (1.000 - 100.000 kr)
- State: `cutAmount` in CutImpactCards
- Real-time recalculation via `useMemo`

**Validation**:
- Min: 1.000 kr
- Max: 100.000 kr
- Step: 1.000 kr

**Testing**:
- Unit test: Validate cut amount range
- Component test: Slider updates state
- Integration test: All cards update on change

---

### REQ-3: See Life Energy Reclaimed

**Design Components**:
- `LifeEnergyDisplay` component
- `calculateLifeEnergy()` function

**Calculations**:
- Hours/month = cutAmount / actualHourlyWage
- Hours/year = hours/month × 12
- Days/year = hours/year / 24 (if >= 24)

**Testing**:
- Unit test: Verify calculation accuracy
- Component test: Display formats correctly

---

### REQ-4: See FI Date Shift

**Design Components**:
- `FIImpactDisplay` component (conditional)
- `calculateFIDateShift()` function
- Impact level indicator (●●●●●○○○○○)

**Calculations**:
- Years to FI (current) vs (with cut)
- Months saved
- Impact level assignment

**Testing**:
- Unit test: Verify FI date math
- Component test: Conditional rendering
- Integration test: With and without FI inputs

---

### REQ-5: See Future Value of Cuts

**Design Components**:
- `FutureValueDisplay` component
- `calculateFutureValue()` function
- Tooltip explaining 7% assumption

**Calculations**:
- Compound interest formula
- 10-year and 20-year projections

**Testing**:
- Unit test: Verify FV formula accuracy
- Component test: Display both 10yr and 20yr

---

### REQ-6: Compare Multiple Categories

**Design Components**:
- `ImpactCardGrid` with responsive grid
- `SortControls` for reordering
- `sortCategoryImpacts()` function

**Sorting Options**:
- FI impact (default)
- Life energy
- Future value
- Alphabetical

**Testing**:
- Unit test: Sort logic for each order
- Component test: Grid layout responsive
- E2E test: User changes sort, cards reorder

---

### REQ-7: Icelandic Context and Presets

**Design Components**:
- `CATEGORIES` with Icelandic names and examples
- Icelandic UI text throughout
- ISK formatting utilities

**Localization**:
- All category names in Icelandic
- Realistic Icelandic examples
- ISK number formatting (periods for thousands)

**Testing**:
- Unit test: Verify Icelandic text
- Visual test: Verify formatting

---

### REQ-8: Mobile-Optimized Experience

**Design Components**:
- Responsive grid (1/2/3 columns)
- Touch-friendly controls (44px min)
- 16px minimum font size
- Collapsible cards on mobile (optional)

**Breakpoints**:
- < 768px: 1 column
- 768-1024px: 2 columns
- > 1024px: 3 columns

**Testing**:
- Visual test: Test on 320px, 768px, 1024px, 1440px
- E2E test: Mobile browser, tablet, desktop

---

### REQ-9: Data Persistence and Sharing

**Design Components**:
- localStorage integration
- `CutImpactSettings` interface
- Debounced save (500ms)

**Data Stored**:
- cutAmount
- sortOrder
- lastUpdated timestamp

**Testing**:
- Integration test: Save and restore settings
- E2E test: Persist across page reloads

---

### REQ-10: Visual Clarity and Engagement

**Design Components**:
- Icons for categories
- Gradient backgrounds
- Bold typography for key metrics
- Hover effects (desktop)
- Smooth animations

**Accessibility**:
- WCAG 2.1 AA contrast ratios
- `prefers-reduced-motion` support
- Text alternatives for icons

**Testing**:
- Accessibility test: Axe DevTools
- Visual test: Contrast ratios
- E2E test: Hover effects work

---

## Summary

The "Cut 10.000 kr" Impact Cards design provides:

1. **Visual, engaging interface** - Card-based layout with icons, gradients, and clear metrics
2. **Real-time feedback** - Instant recalculation as user adjusts cut amount
3. **Comprehensive metrics** - FI impact, life energy, future value for each category
4. **Mobile-first** - Responsive grid, touch-friendly, 16px minimum text
5. **Privacy-first** - All calculations client-side, data in localStorage
6. **Icelandic context** - Local examples, terminology, formatting

**Next Steps**: Proceed to Tasks phase to break down implementation into actionable steps.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Ready for Tasks Phase
**Next Steps**: Create tasks document with implementation breakdown
