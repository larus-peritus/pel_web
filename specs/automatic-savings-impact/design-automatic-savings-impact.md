# Hönnun: Sjálfvirk sparnaðaráhrif reiknivél

## Yfirlit

**Eiginleiki**: Sjálfvirk sparnaðaráhrif reiknivél (Automatic Savings Impact Calculator)
**App**: peninganaedalifid.is
**Tæknigrunnur**: Next.js 16, React 19, TypeScript, Tailwind CSS

Þessi hönnun lýsir tæknilegri framkvæmd á sjálfvirkri sparnaðaráhrifa reiknivél sem sýnir notendum langtíma áhrif sjálfvirks sparnaðar með samsettum vöxtum og tengir við lífsorku hugtakið úr "Your Money or Your Life".

## Arkitektúr Yfirlit

### Kerfishönnun

```
┌─────────────────────────────────────────────────────────────┐
│                    AutomaticSavingsCalculator                │
│                    (Next.js Client Component)                │
└───────────┬─────────────────────────────────────────────────┘
            │
            ├─► CalculatorContext (React Context)
            │   └─► actualHourlyWage, results
            │
            ├─► SavingsInputs (Component)
            │   ├─► CurrencyInput (monthly amount)
            │   ├─► SelectInput (frequency)
            │   ├─► NumberInput (years, return rate)
            │   └─► Toggle (inflation adjustment)
            │
            ├─► calculateSavingsResults (Pure Function)
            │   ├─► calculateFutureValue()
            │   ├─► calculateLifeEnergyHours()
            │   ├─► calculateInflationAdjustment()
            │   └─► calculateFIMonths()
            │
            ├─► SavingsSummary (Component)
            │   ├─► Summary cards (FV, principal, growth)
            │   ├─► Life energy metrics
            │   └─► Key insight message
            │
            ├─► ComparisonMode (Component)
            │   ├─► ScenarioSelector (presets + custom)
            │   ├─► Side-by-side comparison
            │   └─► Difference highlights
            │
            ├─► SavingsChart (Component)
            │   ├─► Line chart (FV over time)
            │   ├─► Stacked area (principal vs interest)
            │   └─► recharts or similar library
            │
            └─► EducationalContent (Component)
                ├─► "Pay Yourself First" info
                ├─► Compound interest explanation
                └─── "Start small" encouragement
```

### Integreringar

```
┌──────────────────────────────────────────────────────────┐
│                    Data Flow                              │
└──────────────────────────────────────────────────────────┘

1. Actual Hourly Wage Calculator (Existing)
   ├─► Provides: actualHourlyWage
   ├─► Provides: netAnnualIncome
   └─► Used for: Life energy calculations

2. localStorage (Client-side)
   ├─► Save: Automatic savings inputs
   ├─► Save: User's scenarios (comparison)
   └─► Part of: Unified StoredState object

3. Export/Import (Existing)
   └─► Includes: Automatic savings data
```

## Íhlutaarkitektúr

### 1. Aðal íhlutir (Components)

#### 1.1 AutomaticSavingsCalculator (Aðal íhlutir)
**Staðsetning**: `src/components/savings/AutomaticSavingsCalculator.tsx`
**Tegund**: Client Component ('use client')
**Ábyrgð**:
- Stýrir öllu input stöðu
- Keyrir útreikninga með useMemo
- Sameinar undirhluta
- Talar við CalculatorContext fyrir actualHourlyWage

**Props**: Engin (sjálfstæður íhlutur)

**State**:
```typescript
interface SavingsState {
  // Basic inputs
  monthlyAmount: number;          // ISK per month (default: 10000)
  frequency: FrequencyKey;        // 'weekly' | 'biweekly' | 'monthly' | 'custom'
  customFrequency?: number;       // Times per year (if 'custom')
  years: number;                  // Default: 10
  returnRate: number;             // % (default: 7)

  // Inflation adjustment
  adjustForInflation: boolean;    // Default: false
  inflationRate: number;          // % (default: 2.5)

  // Comparison mode
  comparisonMode: boolean;        // Default: false
  scenario1: SavingsInputs;
  scenario2: SavingsInputs;
}
```

**Helstu aðferðir**:
- `handleAmountChange(value: number): void`
- `handleFrequencyChange(freq: FrequencyKey): void`
- `handleYearsChange(years: number): void`
- `toggleInflation(): void`
- `toggleComparisonMode(): void`

---

#### 1.2 SavingsInputs (Input Form)
**Staðsetning**: `src/components/savings/SavingsInputs.tsx`
**Tegund**: Client Component
**Ábyrgð**: Allt input fyrir sparnað

**Props**:
```typescript
interface SavingsInputsProps {
  amount: number;
  frequency: FrequencyKey;
  customFrequency?: number;
  years: number;
  returnRate: number;
  adjustForInflation: boolean;
  inflationRate: number;
  onAmountChange: (value: number) => void;
  onFrequencyChange: (freq: FrequencyKey) => void;
  onCustomFrequencyChange: (times: number) => void;
  onYearsChange: (years: number) => void;
  onReturnRateChange: (rate: number) => void;
  onInflationToggle: () => void;
  onInflationRateChange: (rate: number) => void;
}
```

**Innihald**:
- CurrencyInput fyrir `monthlyAmount` (slider + input)
- SelectInput fyrir `frequency`
- NumberInput fyrir `customFrequency` (ef 'custom')
- NumberInput fyrir `years` (slider + input)
- NumberInput fyrir `returnRate`
- Toggle fyrir `adjustForInflation`
- NumberInput fyrir `inflationRate` (ef virkt)

---

#### 1.3 SavingsSummary (Results Display)
**Staðsetning**: `src/components/savings/SavingsSummary.tsx`
**Tegund**: Client Component
**Ábyrgð**: Sýnir útreikninga á læsilegum hátt

**Props**:
```typescript
interface SavingsSummaryProps {
  results: SavingsResults;
  actualHourlyWage?: number;
}
```

**Innihald**:
```
┌────────────────────────────────────────┐
│ FRAMTÍÐARVERÐMÆTI EFTIR 10 ÁR         │
│ 1.730.850 kr                           │
│                                        │
│ Heildarinnborganir: 1.200.000 kr       │
│ Heildarvöxtur: 530.850 kr (44%)        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ LÍFSORKA ÁHRIF (ef tímakaup skilgreint)│
│                                        │
│ Klukkustundir settar inn: 600 klst     │
│ Klukkustundir unnar óbeint: 265 klst   │
│ Heildar lífsorku: 865 klst             │
│                                        │
│ Frelsismánuðir: 34 mánuðir             │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ LYKILINNSÝN                            │
│ "Með því að sjálfvirka 10.000 kr á     │
│  mánuði muntu hafa 34 mánuði af frelsi │
│  eftir 10 ár"                          │
└────────────────────────────────────────┘
```

---

#### 1.4 ComparisonMode (Scenario Comparison)
**Staðsetning**: `src/components/savings/ComparisonMode.tsx`
**Tegund**: Client Component
**Ábyrgð**: Bera saman tvær sparnaðaraðstæður

**Props**:
```typescript
interface ComparisonModeProps {
  scenario1: SavingsInputs & { results: SavingsResults };
  scenario2: SavingsInputs & { results: SavingsResults };
  onScenario1Change: (inputs: Partial<SavingsInputs>) => void;
  onScenario2Change: (inputs: Partial<SavingsInputs>) => void;
  presets: SavingsPreset[];
  actualHourlyWage?: number;
}
```

**Innihald**:
- Side-by-side input controls
- Preset buttons (5.000 kr, 10.000 kr, 25.000 kr, 50.000 kr)
- Difference highlights:
  - FV difference
  - Freedom months difference
  - Life energy difference

---

#### 1.5 SavingsChart (Visualization)
**Staðsetning**: `src/components/savings/SavingsChart.tsx`
**Tegund**: Client Component
**Ábyrgð**: Graf yfir vöxt yfir tíma

**Props**:
```typescript
interface SavingsChartProps {
  results: SavingsResults;
  yearsToShow: number;
}
```

**Gröf**:
- Line chart: Framtíðarverðmæti yfir árin
- Stacked area chart: Höfuðstóll vs vextir
- X-ás: Ár (0 to yearsToShow)
- Y-ás: ISK amount
- Tooltip: Sýnir nákvæmar tölur

**Bókasafn**: Nota `recharts` (already used in project via dependencies)

---

#### 1.6 EducationalContent (Fræðsluefni)
**Staðsetning**: `src/components/savings/EducationalContent.tsx`
**Tegund**: Client Component
**Ábyrgð**: Fræðsluefni um sparnað

**Innihald**:
```
┌──────────────────────────────────────────┐
│ ℹ️ BORGAÐU ÞÉR FYRST                     │
│                                          │
│ Sjálfvirkar millifærslur fjarlægja       │
│ ákvörðunarþreytu. Þú þarft ekki að       │
│ "muna eftir" að spara - kerfið gerir    │
│ það fyrir þig.                           │
│                                          │
│ [Lesa meira um Pay Yourself First]       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 💪 KRAFTUR SAMSETTRAR ÁVÖXTUNAR          │
│                                          │
│ Vextir af vöxtum gera kraftaverk.        │
│ Eftir 20 ár geta vextir verið MEIRI      │
│ en upphaflegar innborganir.              │
│                                          │
│ [Sjá dæmi]                               │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 🌱 BYRJA SMÁTT - BYRJA NÚNA             │
│                                          │
│ Betra að byrja með 1.000 kr en að        │
│ bíða eftir "fullkominni upphæð".         │
│ Tíminn er mikilvægasti þátturinn.       │
│                                          │
│ [Reikna áhrif 1.000 kr/mán]             │
└──────────────────────────────────────────┘
```

---

### 2. Types & Interfaces

**Staðsetning**: `src/types/savings.ts`

```typescript
/**
 * Frequency of automatic savings
 */
export type FrequencyKey = 'weekly' | 'biweekly' | 'monthly' | 'custom';

/**
 * Frequency configuration
 */
export interface FrequencyOption {
  key: FrequencyKey;
  label: string;              // Icelandic label
  timesPerYear: number;       // How many times per year
}

/**
 * Savings inputs
 */
export interface SavingsInputs {
  monthlyAmount: number;      // ISK per month
  frequency: FrequencyKey;
  customFrequency?: number;   // Required if frequency === 'custom'
  years: number;              // 1-50
  returnRate: number;         // % (0-20)
  adjustForInflation: boolean;
  inflationRate: number;      // % (0-10)
}

/**
 * Savings calculation results
 */
export interface SavingsResults {
  // Future value
  futureValue: number;              // Total future value
  totalContributions: number;        // Total money contributed (principal)
  totalGrowth: number;               // Total interest earned
  growthPercentage: number;          // Growth as % of total

  // Life energy (only if actualHourlyWage provided)
  lifeEnergyContributed?: number;    // Hours spent earning contributions
  lifeEnergyEarnedPassively?: number;// Hours "earned" from interest
  totalLifeEnergy?: number;          // Total life energy value
  freedomMonths?: number;            // Months of freedom

  // Inflation-adjusted (only if adjustForInflation === true)
  realValue?: number;                // Inflation-adjusted future value

  // Breakdown for charts
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * Yearly breakdown for charting
 */
export interface YearlyBreakdown {
  year: number;                      // 0 to years
  principal: number;                 // Cumulative principal at this year
  growth: number;                    // Cumulative growth at this year
  futureValue: number;               // Total FV at this year
  realValue?: number;                // Inflation-adjusted (if applicable)
}

/**
 * Preset scenario for quick comparisons
 */
export interface SavingsPreset {
  id: string;
  label: string;                     // "5.000 kr/mán", "10.000 kr/mán"
  monthlyAmount: number;
  frequency: FrequencyKey;
  years: number;
}

/**
 * Saved savings scenario
 */
export interface SavingsScenario {
  id: string;
  name: string;
  inputs: SavingsInputs;
  results: SavingsResults;
  createdAt: string;
  updatedAt: string;
}
```

---

### 3. Útreikningsvirki (Calculation Logic)

**Staðsetning**: `src/lib/calculations/savings.ts`

```typescript
/**
 * Calculate future value of periodic savings using compound interest
 *
 * Formula: FV = PMT × ((1 + r)^n - 1) / r
 *
 * @param payment - Payment amount per period
 * @param rate - Interest rate per period (decimal)
 * @param periods - Number of payment periods
 * @returns Future value
 */
export function calculateFutureValue(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) {
    // No interest: FV = payment × periods
    return payment * periods;
  }

  return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/**
 * Calculate savings results
 *
 * @param inputs - Savings inputs
 * @param actualHourlyWage - Optional actual hourly wage for life energy
 * @param monthlyExpenses - Optional monthly expenses for freedom months
 * @returns Complete savings results
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage?: number,
  monthlyExpenses?: number
): SavingsResults {
  // Determine frequency
  const timesPerYear = inputs.frequency === 'custom'
    ? (inputs.customFrequency ?? 12)
    : FREQUENCY_OPTIONS.find(f => f.key === inputs.frequency)!.timesPerYear;

  // Calculate per-period values
  const paymentPerPeriod = inputs.monthlyAmount * (12 / timesPerYear);
  const ratePerPeriod = inputs.returnRate / 100 / timesPerYear;
  const totalPeriods = inputs.years * timesPerYear;

  // Future value
  const futureValue = calculateFutureValue(
    paymentPerPeriod,
    ratePerPeriod,
    totalPeriods
  );

  // Principal and growth
  const totalContributions = paymentPerPeriod * totalPeriods;
  const totalGrowth = futureValue - totalContributions;
  const growthPercentage = (totalGrowth / futureValue) * 100;

  // Inflation adjustment
  let realValue: number | undefined;
  if (inputs.adjustForInflation) {
    realValue = futureValue / Math.pow(1 + inputs.inflationRate / 100, inputs.years);
  }

  // Life energy calculations
  let lifeEnergyContributed: number | undefined;
  let lifeEnergyEarnedPassively: number | undefined;
  let totalLifeEnergy: number | undefined;
  let freedomMonths: number | undefined;

  if (actualHourlyWage && actualHourlyWage > 0) {
    lifeEnergyContributed = totalContributions / actualHourlyWage;
    lifeEnergyEarnedPassively = totalGrowth / actualHourlyWage;
    totalLifeEnergy = futureValue / actualHourlyWage;

    if (monthlyExpenses && monthlyExpenses > 0) {
      freedomMonths = futureValue / monthlyExpenses;
    }
  }

  // Yearly breakdown for charting
  const yearlyBreakdown = calculateYearlyBreakdown(
    paymentPerPeriod,
    ratePerPeriod,
    timesPerYear,
    inputs.years,
    inputs.adjustForInflation ? inputs.inflationRate : undefined
  );

  return {
    futureValue,
    totalContributions,
    totalGrowth,
    growthPercentage,
    lifeEnergyContributed,
    lifeEnergyEarnedPassively,
    totalLifeEnergy,
    freedomMonths,
    realValue,
    yearlyBreakdown,
  };
}

/**
 * Calculate yearly breakdown for charting
 */
function calculateYearlyBreakdown(
  paymentPerPeriod: number,
  ratePerPeriod: number,
  timesPerYear: number,
  years: number,
  inflationRate?: number
): YearlyBreakdown[] {
  const breakdown: YearlyBreakdown[] = [];

  for (let year = 0; year <= years; year++) {
    const periods = year * timesPerYear;
    const fv = periods === 0
      ? 0
      : calculateFutureValue(paymentPerPeriod, ratePerPeriod, periods);
    const principal = paymentPerPeriod * periods;
    const growth = fv - principal;

    let realValue: number | undefined;
    if (inflationRate !== undefined && year > 0) {
      realValue = fv / Math.pow(1 + inflationRate / 100, year);
    }

    breakdown.push({
      year,
      principal,
      growth,
      futureValue: fv,
      realValue,
    });
  }

  return breakdown;
}
```

**Prófunarfall** (vitest):
```typescript
// src/lib/calculations/savings.test.ts
describe('calculateSavingsResults', () => {
  it('calculates correct FV for 10k/month, 7%, 10 years', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    // Expected: ~1,730,850 kr
    expect(results.futureValue).toBeCloseTo(1730850, -2);
    expect(results.totalContributions).toBe(1200000);
    expect(results.totalGrowth).toBeCloseTo(530850, -2);
  });

  it('calculates life energy when actualHourlyWage provided', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs, 2000);

    expect(results.lifeEnergyContributed).toBe(600); // 1,200,000 / 2,000
    expect(results.lifeEnergyEarnedPassively).toBeCloseTo(265, 0); // ~530,850 / 2,000
  });
});
```

---

### 4. Sjálfgefin gildi og fastar

**Staðsetning**: `src/lib/constants/savings.ts`

```typescript
/**
 * Frequency options
 */
export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { key: 'weekly', label: 'Vikulega', timesPerYear: 52 },
  { key: 'biweekly', label: 'Á tveggja vikna fresti', timesPerYear: 26 },
  { key: 'monthly', label: 'Mánaðarlega', timesPerYear: 12 },
  { key: 'custom', label: 'Sérsniðin', timesPerYear: 12 }, // User defines
];

/**
 * Preset scenarios
 */
export const SAVINGS_PRESETS: SavingsPreset[] = [
  {
    id: 'small',
    label: '5.000 kr/mán',
    monthlyAmount: 5000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'medium',
    label: '10.000 kr/mán',
    monthlyAmount: 10000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'large',
    label: '25.000 kr/mán',
    monthlyAmount: 25000,
    frequency: 'monthly',
    years: 10,
  },
  {
    id: 'xlarge',
    label: '50.000 kr/mán',
    monthlyAmount: 50000,
    frequency: 'monthly',
    years: 10,
  },
];

/**
 * Default savings inputs
 */
export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlyAmount: 10000,
  frequency: 'monthly',
  years: 10,
  returnRate: 7,
  adjustForInflation: false,
  inflationRate: 2.5,
};

/**
 * Input validation ranges
 */
export const SAVINGS_RANGES = {
  monthlyAmount: { min: 1000, max: 10_000_000, step: 1000 },
  years: { min: 1, max: 50, step: 1 },
  returnRate: { min: 0, max: 20, step: 0.5 },
  inflationRate: { min: 0, max: 10, step: 0.1 },
  customFrequency: { min: 1, max: 365, step: 1 },
};
```

---

### 5. localStorage Integration

**Uppfærsla á StoredState** (`src/types/calculator.ts`):
```typescript
export interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  commuteScenarios: CommuteScenario[];
  housingScenarios?: HousingScenario[];
  mealCostData?: MealCostData;
  periods?: Period[];
  convenienceExpenses?: ConvenienceExpense[];
  convenienceGoal?: ConvenienceGoal;
  carOwnershipScenarios?: CarOwnershipScenario[];
  childcareItems?: ChildcareItem[];

  // NEW: Automatic savings data
  savingsInputs?: SavingsInputs;
  savingsScenarios?: SavingsScenario[]; // For comparison mode

  lastUpdated: string;
}
```

**Vistun/hleðsla**: Nota núverandi `localStorage` pattern í appinu.

---

### 6. UI íhlutir (Reusable)

Nota núverandi íhluti úr `src/components/ui/`:
- `Card, CardHeader, CardContent, CardFooter` - Container
- `CurrencyInput` - ISK input með slider
- `NumberInput` - Number input
- `SelectInput` - Dropdown
- `Toggle` - Boolean toggle
- `Badge` - Labels/tags
- `Alert` - Warnings/info
- `Button` - Actions

**Nýir íhlutir sem þarf að búa til**:
- `ProgressBar` - Fyrir hlutfall vaxtar
- `Tooltip` - Fyrir útskýringar (ef ekki til)

---

## Gagnaflæði

### 1. Initialization
```
User loads page
  ↓
AutomaticSavingsCalculator mounts
  ↓
Load from localStorage (if exists)
  ↓
Initialize with DEFAULT_SAVINGS_INPUTS (if no saved data)
  ↓
Read actualHourlyWage from CalculatorContext
  ↓
Calculate initial results (useMemo)
  ↓
Render UI
```

### 2. User interaction
```
User changes input (e.g., monthly amount)
  ↓
State updates (useState)
  ↓
useMemo recalculates results
  ↓
UI re-renders with new results
  ↓
Debounce (300ms)
  ↓
Save to localStorage
```

### 3. Comparison mode
```
User toggles comparison mode
  ↓
Initialize scenario1 with current inputs
  ↓
Initialize scenario2 with preset (or copy of scenario1)
  ↓
Render side-by-side inputs
  ↓
Calculate both scenarios independently
  ↓
Show differences
```

---

## Öryggi & Persónuvernd

### Client-side only
- Allt geymt í localStorage
- Engin gögn send á netþjón
- Engar API köll

### Validation
- Validate all inputs on change
- Clamp values to allowed ranges
- Show error messages for invalid inputs

### Data persistence
- Save to localStorage on every change (debounced)
- Include in export/import functionality
- Version migrations if schema changes

---

## Aðgengi (WCAG 2.1 AA)

### Keyboard navigation
- Tab order: inputs → buttons → charts
- Enter/Space to activate buttons
- Arrow keys for sliders
- Escape to close modals/tooltips

### Screen readers
- Semantic HTML (headings, labels, sections)
- ARIA labels for all inputs
- ARIA live regions for results updates
- Alt text for charts (describe trend)

### Visual
- Color contrast ≥ 4.5:1 for text
- Focus indicators on all interactive elements
- Don't rely on color alone (use icons/patterns)
- Chart patterns in addition to colors (for colorblind users)

---

## Afköst

### Calculation performance
- Pure functions (no side effects)
- Memoized results (useMemo)
- Target: < 50ms for all calculations
- No network requests (client-side only)

### Rendering performance
- Debounce slider changes (300ms)
- Virtual scrolling if many scenarios (unlikely in MVP)
- Lazy load charts if heavy

### Bundle size
- Use existing dependencies (recharts via Next.js)
- Tree-shake unused code
- No new heavy libraries

---

## Prófunarstefna

### Unit tests (Vitest)
**Staðsetning**: `src/lib/calculations/savings.test.ts`
- Test `calculateFutureValue()` with known inputs
- Test edge cases (0%, 0 years, huge numbers)
- Test inflation adjustment
- Test life energy calculations
- Test yearly breakdown generation

**Coverage target**: 100% of calculation functions

### Integration tests (React Testing Library)
**Staðsetning**: `src/components/savings/AutomaticSavingsCalculator.test.tsx`
- Test input changes update results
- Test frequency switching
- Test inflation toggle
- Test comparison mode
- Test preset application
- Test CalculatorContext integration

### Manual testing
- Test all inputs with real data
- Verify formulas with hand calculations
- Test on mobile (responsive)
- Test accessibility (keyboard, screen reader)
- Cross-browser testing (Chrome, Firefox, Safari)

---

## Hönnunarákvarðanir

### 1. Afhverju client-side only?
**Ákvarðanir**: Allir útreikningar á client-side, engin backend
**Valmöguleikar**:
- A) Client-side only (valið)
- B) Backend API fyrir útreikninga
- C) Edge functions fyrir útreikninga

**Rökstuðningur**:
- Einföld stærðfræði (engin þörf á backend)
- Betri persónuvernd (engin gögn send á netþjón)
- Betri afköst (engin network latency)
- Samræmi við núverandi app arkitektúr
- Lower cost (no server resources)

**Fórnir**: Engar (þetta er best choice fyrir þetta use case)

---

### 2. Recharts fyrir myndrit
**Ákvarðun**: Nota recharts fyrir charts
**Valmöguleikar**:
- A) recharts (valið)
- B) Chart.js
- C) D3.js
- D) Custom SVG

**Rökstuðningur**:
- Next.js friendly (React components)
- Good accessibility support
- Stacked area charts built-in
- Responsive by default
- Already in dependency tree (likely via Next.js)

**Fórnir**: Bundle size aðeins stærri en custom SVG (en acceptable)

---

### 3. Frequency implementation
**Ákvarðun**: Support weekly, biweekly, monthly, custom
**Valmöguleikar**:
- A) Only monthly (einfaldast)
- B) Weekly, biweekly, monthly (common)
- C) Weekly, biweekly, monthly, custom (valið)

**Rökstuðningur**:
- NS-4 krefst frequency samanburðar
- Custom gerir notanda kleift að prófa "every paycheck"
- Lítill viðbótarkostnaður í útfærslu
- Flexibility án complexity

**Fórnir**: Aðeins flóknara UI (en vel manageable)

---

### 4. Comparison mode design
**Ákvarðun**: Side-by-side með presets
**Valmöguleikar**:
- A) Overlay comparison (same chart, two lines)
- B) Side-by-side (valið)
- C) Tabbed comparison

**Rökstuðningur**:
- Easier to see differences at a glance
- Can show inputs and results together
- Presets make it fast to explore
- Mobile: stack vertically

**Fórnir**: Takes more vertical space (but worth it)

---

### 5. Life energy dependency
**Ákvarðun**: Optional enhancement (gracefully degrade if no actualHourlyWage)
**Valmöguleikar**:
- A) Required (block if no wage)
- B) Optional with warning (valið)
- C) Completely independent

**Rökstuðningur**:
- Some users may want just FV calculation
- Warning nudges them to fill out wage calculator
- Graceful degradation is better UX
- Aligns with NS-2 acceptance criteria

**Fórnir**: Engar (best of both worlds)

---

## Raknihæfi við kröfur

| Kröfur ID | Hönnunarþáttur | Staðsetning |
|-----------|----------------|-------------|
| NS-1 | `calculateFutureValue()` | `src/lib/calculations/savings.ts` |
| NS-1.1 | Default `returnRate: 7` | `src/lib/constants/savings.ts` |
| NS-1.2 | `SavingsSummary` component | `src/components/savings/SavingsSummary.tsx` |
| NS-1.3 | Default 10 & 20 years display | `AutomaticSavingsCalculator` (show both) |
| NS-1.4 | `useMemo` + debounce 300ms | `AutomaticSavingsCalculator` |
| NS-1.5 | Input validation | `src/lib/utils/validators.ts` |
| NS-2 | `calculateLifeEnergyHours()` | `src/lib/calculations/savings.ts` |
| NS-2.1 | Life energy display | `SavingsSummary` |
| NS-2.2 | Key insight message | `SavingsSummary` |
| NS-2.3 | Conditional rendering | `SavingsSummary` (if no wage) |
| NS-2.4 | Warning Alert | `SavingsSummary` |
| NS-3 | `ComparisonMode` component | `src/components/savings/ComparisonMode.tsx` |
| NS-3.1 | Side-by-side scenarios | `ComparisonMode` |
| NS-3.2 | Real-time slider updates | `useMemo` |
| NS-3.3 | Difference display | `ComparisonMode` |
| NS-3.4 | `SAVINGS_PRESETS` | `src/lib/constants/savings.ts` |
| NS-4 | `frequency` input | `SavingsInputs` |
| NS-4.1 | `FREQUENCY_OPTIONS` | `src/lib/constants/savings.ts` |
| NS-4.2 | Recalculate on frequency change | `calculateSavingsResults()` |
| NS-4.3 | FV comparison | `ComparisonMode` |
| NS-4.4 | Educational note | `EducationalContent` |
| NS-5 | `EducationalContent` component | `src/components/savings/EducationalContent.tsx` |
| NS-5.1 | Info boxes | `EducationalContent` |
| NS-5.2 | Encouragement message | `EducationalContent` |
| NS-5.3 | "Start small" calculator | `SavingsSummary` (always shows results) |
| NS-6 | `adjustForInflation` toggle | `SavingsInputs` |
| NS-6.1 | Dual display (nominal + real) | `SavingsSummary` |
| NS-6.2 | Default 2.5% inflation | `DEFAULT_SAVINGS_INPUTS` |
| NS-6.3 | Custom inflation input | `SavingsInputs` |
| NS-6.4 | Explanation note | `SavingsSummary` |

---

## Framtíðarútvíkkun

Eftirfarandi er **UTAN gildissviðs fyrir MVP** en hönnunin ætti að leyfa þessa útvíkkun:

### 1. Goal-based calculator ("Hvenær næ ég X?")
- Reverse calculation: Given target amount, calculate time needed
- Input: Target amount, monthly savings
- Output: Years and months to goal
- **Hönnunargæði**: Bæta við `calculateTimeToGoal()` í `savings.ts`

### 2. FI Number integration
- Link to FI Number from app plan
- Show "% of FI Number" reached
- **Hönnunargæði**: Add `fiNumber` prop to `SavingsSummary`

### 3. Scenario modeling
- Optimistic/realistic/pessimistic return rates
- Bull/bear market scenarios
- **Hönnunargæði**: Add `scenarios` array to state

### 4. Tax advantages
- Model lífeyrissjóður contributions
- Show tax savings
- **Hönnunargæði**: Add `taxBenefit` field to calculations

### 5. "What if" automations
- "What if I increase by 1000 kr/year?"
- Automatic increments
- **Hönnunargæði**: Add `incrementStrategy` to inputs

---

## Skráaruppbygging

```
src/
├── components/
│   └── savings/
│       ├── AutomaticSavingsCalculator.tsx   # Main component
│       ├── SavingsInputs.tsx                # Input form
│       ├── SavingsSummary.tsx               # Results display
│       ├── ComparisonMode.tsx               # Scenario comparison
│       ├── SavingsChart.tsx                 # Visualization
│       ├── EducationalContent.tsx           # Info boxes
│       └── index.ts                         # Barrel export
├── lib/
│   ├── calculations/
│   │   ├── savings.ts                       # Core calculation logic
│   │   └── savings.test.ts                  # Unit tests
│   └── constants/
│       └── savings.ts                       # Defaults & presets
└── types/
    └── savings.ts                           # TypeScript types
```

---

## Samantekt

Þessi hönnun uppfyllir allar kröfur úr requirements-automatic-savings-impact.md:
- ✅ 6 notendafrásagnir með EARS samþykktarviðmiðum
- ✅ Formúlur staðfestar með dæmum
- ✅ Integrerast við núverandi Actual Hourly Wage Calculator
- ✅ localStorage persistence
- ✅ Export/import compatibility
- ✅ WCAG 2.1 AA aðgengi
- ✅ < 50ms calculation performance
- ✅ Farsímavænt (Tailwind responsive)
- ✅ Icelandic context (ISK, verðbólga, lífeyrir)
- ✅ YMOYL philosophy (lífsorka, Pay Yourself First)

**Næsta skref**: Búa til tasks document með Implementation plan.
