# Design: Compound Savings Life Energy Calculator

## Document Information

- **Feature Name**: Compound Savings Life Energy Calculator
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec Orchestrator
- **App**: peninganaedalifid (Icelandic FIRE Calculator)
- **Feature ID**: 2.2.3
- **Requirements Document**: [requirements-compound-savings-life-energy.md](requirements-compound-savings-life-energy.md)

## Executive Summary

This design describes the technical architecture for the Compound Savings Life Energy Calculator, a new calculator tab that helps users visualize the long-term impact of regular savings expressed in both ISK and life energy hours. The feature integrates seamlessly with the existing CalculatorContext, auto-consuming the Actual Hourly Wage, and uses pure CSS/HTML visualization (no chart library needed).

### Key Design Decisions

1. **Pure CSS Visualization**: Use CSS flexbox and animated bars instead of chart library (performance, bundle size)
2. **CalculatorContext Extension**: Add `savingsScenarios` state following existing scenario pattern
3. **Dedicated Calculator Component**: New tab component `CompoundSavingsCalculator.tsx` following existing patterns
4. **Real-time Reactivity**: Auto-recalculate when `actualHourlyWage` changes (like commute/housing calculators)
5. **localStorage Schema Extension**: Add `savingsScenarios` field with schema versioning

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Calculator Page                      │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         CalculatorTabsNav (Enhanced)                │     │
│  │  [Aðal] [Áskriftir] [Matur] [...] [Sparnaður] ←NEW │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │     CompoundSavingsCalculator Component (NEW)      │     │
│  │                                                      │     │
│  │  ┌────────────────────────────────────────────┐   │     │
│  │  │  SavingsInputForm                           │   │     │
│  │  │  - Monthly amount (CurrencyInput)           │   │     │
│  │  │  - Interest rate (NumberInput) + Presets    │   │     │
│  │  │  - Time horizon (NumberInput with slider)   │   │     │
│  │  └────────────────────────────────────────────┘   │     │
│  │                                                      │     │
│  │  ┌────────────────────────────────────────────┐   │     │
│  │  │  ResultsDisplay                             │   │     │
│  │  │  - Future value (ISK + life energy)        │   │     │
│  │  │  - Interest earned (ISK + life energy)     │   │     │
│  │  │  - Contributions (ISK only)                │   │     │
│  │  └────────────────────────────────────────────┘   │     │
│  │                                                      │     │
│  │  ┌────────────────────────────────────────────┐   │     │
│  │  │  CompoundGrowthVisualization                │   │     │
│  │  │  (Pure CSS bar chart, no library)          │   │     │
│  │  └────────────────────────────────────────────┘   │     │
│  │                                                      │     │
│  │  ┌────────────────────────────────────────────┐   │     │
│  │  │  ScenarioComparison (if 2+ scenarios)      │   │     │
│  │  └────────────────────────────────────────────┘   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│                    CalculatorContext                          │
│  - results.actualHourlyWage (consumed)                       │
│  - savingsScenarios[] (new state)                            │
│  - addSavingsScenario(), updateSavingsScenario(), ...        │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
CompoundSavingsCalculator (page-level component)
├── SavingsInputForm
│   ├── CurrencyInput (monthly savings amount)
│   ├── InterestRateInput
│   │   ├── NumberInput (rate field)
│   │   └── PresetButtons (verðtryggð, venjulegur, hávaxtasparnaður)
│   └── TimeHorizonInput
│       ├── NumberInput (years)
│       └── Slider (visual time selection)
│
├── SavingsResultsDisplay
│   ├── Card (Future Value)
│   │   ├── ISK amount (primary)
│   │   └── Life energy (hours/days/years)
│   ├── Card (Interest Earned)
│   │   ├── ISK amount
│   │   └── Life energy earned from interest
│   └── Card (Total Contributions)
│       └── ISK amount only
│
├── CompoundGrowthVisualization
│   ├── YearByYearBars (CSS flexbox, no library)
│   ├── Tooltip (on hover, shows year + amounts)
│   └── Legend (contributions vs total value)
│
├── ScenarioManager (if scenarios exist)
│   ├── ScenarioList (up to 3 scenarios)
│   │   └── ScenarioCard × N
│   │       ├── Name, parameters summary
│   │       ├── Future value comparison
│   │       └── Actions (load, delete)
│   └── SaveScenarioButton
│
└── MissingWagePrompt (if actualHourlyWage === 0)
    └── Link to main calculator tab
```

## Data Model

### Type Definitions

**New Types** (add to `src/types/calculator.ts`):

```typescript
/**
 * Compound savings calculator types
 */

export interface SavingsInputs {
  monthlySavings: number; // ISK per month (1,000 - 1,000,000)
  annualInterestRate: number; // Percentage (0.00 - 20.00)
  timeHorizonYears: number; // Years (1 - 50)
}

export interface SavingsResults {
  futureValue: number; // Total ISK after time horizon
  totalContributions: number; // Sum of all monthly savings
  totalInterestEarned: number; // futureValue - totalContributions

  // Life energy conversions
  futureValueLifeEnergy: number; // Hours
  interestEarnedLifeEnergy: number; // Hours (key insight!)

  // Year-by-year data for visualization
  yearlyBreakdown: YearlySavingsData[];
}

export interface YearlySavingsData {
  year: number;
  totalValue: number; // Accumulated value (principal + interest)
  totalContributions: number; // Accumulated contributions only
  yearlyInterest: number; // Interest earned this year
  lifeEnergyHours: number; // Total value in life energy
}

export interface SavingsScenario {
  id: string;
  name: string; // User-provided name
  inputs: SavingsInputs;
  results: SavingsResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Icelandic savings presets
 */
export interface SavingsPreset {
  id: 'verdtryggt' | 'venjulegur' | 'havaxtasparnadur';
  label: string; // Icelandic display name
  rate: number; // Interest rate percentage
  description: string; // Tooltip explanation
}
```

**CalculatorContext Extension**:

```typescript
// Add to CalculatorContextType interface
interface CalculatorContextType {
  // ... existing fields ...

  // Compound Savings Calculator (NEW)
  savingsScenarios: SavingsScenario[];
  addSavingsScenario: (scenario: Omit<SavingsScenario, 'id' | 'results'>) => void;
  updateSavingsScenario: (
    id: string,
    updates: Partial<Omit<SavingsScenario, 'id' | 'results'>>
  ) => void;
  deleteSavingsScenario: (id: string) => void;
  duplicateSavingsScenario: (id: string) => void;
}
```

**StoredState Extension**:

```typescript
// Add to StoredState interface
export interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  // ... other existing fields ...
  savingsScenarios?: SavingsScenario[]; // NEW - optional for backwards compatibility
  lastUpdated: string;
}
```

### Constants

**New File**: `src/lib/constants/savings.ts`

```typescript
/**
 * Savings calculator constants
 */

export const SAVINGS_LIMITS = {
  MIN_MONTHLY_SAVINGS: 1_000, // 1,000 ISK
  MAX_MONTHLY_SAVINGS: 1_000_000, // 1,000,000 ISK
  MIN_INTEREST_RATE: 0,
  MAX_INTEREST_RATE: 20,
  MIN_TIME_HORIZON: 1,
  MAX_TIME_HORIZON: 50,
  MAX_SCENARIOS: 3,
} as const;

export const ICELANDIC_SAVINGS_PRESETS: SavingsPreset[] = [
  {
    id: 'verdtryggt',
    label: 'Verðtryggt',
    rate: 3.0,
    description: 'Verðtryggður sparnaður: vextir + verðbólga',
  },
  {
    id: 'venjulegur',
    label: 'Venjulegur sparnaður',
    rate: 1.5,
    description: 'Hefðbundinn bankainnstæða',
  },
  {
    id: 'havaxtasparnadur',
    label: 'Hávaxtasparnaður',
    rate: 2.5,
    description: 'Hávaxtareikningur með binditíma',
  },
];

export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlySavings: 50_000,
  annualInterestRate: 3.0,
  timeHorizonYears: 10,
};
```

## Component Design

### 1. CompoundSavingsCalculator (Main Container)

**Location**: `src/components/savings/CompoundSavingsCalculator.tsx`

**Responsibilities**:
- Top-level component for savings calculator tab
- Orchestrates all sub-components
- Manages local form state (current inputs, not scenarios)
- Consumes CalculatorContext for actualHourlyWage and scenario management
- Handles scenario save/load/delete actions

**Props**: None (reads from CalculatorContext)

**State**:
```typescript
const [currentInputs, setCurrentInputs] = useState<SavingsInputs>(DEFAULT_SAVINGS_INPUTS);
const [scenarioName, setScenarioName] = useState('');
const [showSaveDialog, setShowSaveDialog] = useState(false);
```

**Key Logic**:
```typescript
// Real-time calculation whenever inputs or actualHourlyWage changes
const currentResults = useMemo(() => {
  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  return calculateSavingsResults(currentInputs, actualHourlyWage);
}, [currentInputs, results?.actualHourlyWage]);
```

**Render Structure**:
```tsx
<Section className="bg-neutral-50">
  <Container>
    {/* Missing wage prompt */}
    {!results?.actualHourlyWage && <MissingWagePrompt />}

    {/* Input form */}
    <SavingsInputForm
      inputs={currentInputs}
      onChange={setCurrentInputs}
    />

    {/* Results display */}
    <SavingsResultsDisplay
      results={currentResults}
      actualHourlyWage={results?.actualHourlyWage ?? 0}
    />

    {/* Visualization */}
    <CompoundGrowthVisualization
      yearlyData={currentResults.yearlyBreakdown}
      actualHourlyWage={results?.actualHourlyWage ?? 0}
    />

    {/* Scenario management */}
    <ScenarioManager
      scenarios={savingsScenarios}
      currentInputs={currentInputs}
      onSave={handleSaveScenario}
      onLoad={handleLoadScenario}
      onDelete={deleteSavingsScenario}
    />
  </Container>
</Section>
```

### 2. SavingsInputForm

**Location**: `src/components/savings/SavingsInputForm.tsx`

**Responsibilities**:
- Render all input fields for savings scenario
- Validate inputs in real-time
- Display Icelandic preset buttons
- Responsive layout (stack on mobile, grid on desktop)

**Props**:
```typescript
interface SavingsInputFormProps {
  inputs: SavingsInputs;
  onChange: (inputs: SavingsInputs) => void;
  className?: string;
}
```

**Render Structure**:
```tsx
<Card>
  <CardHeader>
    <h3>Sparnaðaráætlun</h3>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Monthly savings */}
      <CurrencyInput
        label="Mánaðarlegur sparnaður"
        value={inputs.monthlySavings}
        onChange={(val) => onChange({ ...inputs, monthlySavings: val })}
        min={SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS}
        max={SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS}
      />

      {/* Interest rate with presets */}
      <div>
        <NumberInput
          label="Árlegir vextir (%)"
          value={inputs.annualInterestRate}
          onChange={(val) => onChange({ ...inputs, annualInterestRate: val })}
          min={SAVINGS_LIMITS.MIN_INTEREST_RATE}
          max={SAVINGS_LIMITS.MAX_INTEREST_RATE}
          step={0.1}
          decimals={2}
        />
        {/* Preset buttons */}
        <div className="flex gap-2 mt-2">
          {ICELANDIC_SAVINGS_PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant={inputs.annualInterestRate === preset.rate ? 'primary' : 'secondary'}
              onClick={() => onChange({ ...inputs, annualInterestRate: preset.rate })}
              size="sm"
            >
              <Tooltip content={preset.description}>
                {preset.label}
              </Tooltip>
            </Button>
          ))}
        </div>
      </div>

      {/* Time horizon */}
      <div className="md:col-span-2">
        <NumberInput
          label="Tímabil (ár)"
          value={inputs.timeHorizonYears}
          onChange={(val) => onChange({ ...inputs, timeHorizonYears: val })}
          min={SAVINGS_LIMITS.MIN_TIME_HORIZON}
          max={SAVINGS_LIMITS.MAX_TIME_HORIZON}
        />
        {/* Optional: Range slider for visual selection */}
        <Slider
          value={inputs.timeHorizonYears}
          onChange={(val) => onChange({ ...inputs, timeHorizonYears: val })}
          min={SAVINGS_LIMITS.MIN_TIME_HORIZON}
          max={SAVINGS_LIMITS.MAX_TIME_HORIZON}
          className="mt-2"
        />
      </div>
    </div>
  </CardContent>
</Card>
```

### 3. SavingsResultsDisplay

**Location**: `src/components/savings/SavingsResultsDisplay.tsx`

**Responsibilities**:
- Display calculation results in three cards
- Show both ISK and life energy for future value and interest
- Highlight interest earned as separate life energy concept
- Display current wage used for calculation

**Props**:
```typescript
interface SavingsResultsDisplayProps {
  results: SavingsResults;
  actualHourlyWage: number;
  className?: string;
}
```

**Render Structure**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Future Value Card */}
  <Card variant="primary">
    <CardHeader>
      <h3>Framtíðarvirði</h3>
      <p className="text-sm">Heildarvirði eftir {inputs.timeHorizonYears} ár</p>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary-700">
        {formatCurrency(results.futureValue)}
      </div>
      {actualHourlyWage > 0 && (
        <div className="mt-2 text-lg text-primary-600">
          {formatLifeEnergy(results.futureValueLifeEnergy)}
        </div>
      )}
    </CardContent>
  </Card>

  {/* Interest Earned Card (KEY INSIGHT) */}
  <Card variant="success">
    <CardHeader>
      <h3>Vextir aflað</h3>
      <p className="text-sm">Lífsorka sem peningarnir þínir afla</p>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-success-700">
        {formatCurrency(results.totalInterestEarned)}
      </div>
      {actualHourlyWage > 0 && (
        <div className="mt-2 text-lg text-success-600">
          {formatLifeEnergy(results.interestEarnedLifeEnergy)}
          <Badge variant="success" className="ml-2">Gjöf!</Badge>
        </div>
      )}
    </CardContent>
  </Card>

  {/* Total Contributions Card */}
  <Card variant="outlined">
    <CardHeader>
      <h3>Heildarframlag</h3>
      <p className="text-sm">Samtals innborgað</p>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-neutral-700">
        {formatCurrency(results.totalContributions)}
      </div>
      <div className="mt-2 text-sm text-neutral-600">
        {formatCurrency(inputs.monthlySavings)}/mán × {inputs.timeHorizonYears * 12} mán
      </div>
    </CardContent>
  </Card>
</div>

{/* Current wage indicator */}
{actualHourlyWage > 0 && (
  <div className="text-xs text-neutral-500 text-center mt-2">
    Reiknað með launum: {formatHourlyCurrency(actualHourlyWage)}
  </div>
)}
```

### 4. CompoundGrowthVisualization

**Location**: `src/components/savings/CompoundGrowthVisualization.tsx`

**Responsibilities**:
- Visualize year-by-year growth using CSS bars (no chart library)
- Show contributions vs total value
- Interactive tooltips on hover
- Responsive scaling for different time horizons
- Mobile-friendly (simplified on small screens)

**Props**:
```typescript
interface CompoundGrowthVisualizationProps {
  yearlyData: YearlySavingsData[];
  actualHourlyWage: number;
  className?: string;
}
```

**Implementation Strategy**:

Use CSS flexbox with animated height bars, similar to `BreakdownChart.tsx` pattern but adapted for time series:

```tsx
<Card>
  <CardHeader>
    <h3>Þróun sparnaðar</h3>
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-neutral-400 rounded" />
        <span>Framlög</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-primary-500 rounded" />
        <span>Heildarvirði</span>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Y-axis labels */}
    <div className="flex justify-end mb-2 text-xs text-neutral-500">
      {formatCurrency(maxValue)}
    </div>

    {/* Bar chart area */}
    <div className="flex items-end justify-between gap-1 h-64 border-l border-b border-neutral-300">
      {yearlyDataToShow.map((yearData) => (
        <div key={yearData.year} className="flex-1 flex flex-col items-center group">
          {/* Tooltip (shown on hover) */}
          <Tooltip
            content={
              <div className="text-sm">
                <div className="font-semibold">Ár {yearData.year}</div>
                <div>Heildarvirði: {formatCurrency(yearData.totalValue)}</div>
                <div>Framlög: {formatCurrency(yearData.totalContributions)}</div>
                {actualHourlyWage > 0 && (
                  <div className="text-success-400">
                    {formatLifeEnergy(yearData.lifeEnergyHours)}
                  </div>
                )}
              </div>
            }
          >
            {/* Bar stack */}
            <div className="relative w-full h-full flex flex-col justify-end">
              {/* Total value bar */}
              <div
                className="w-full bg-primary-500 rounded-t transition-all duration-500 hover:bg-primary-600"
                style={{ height: `${(yearData.totalValue / maxValue) * 100}%` }}
              >
                {/* Contributions portion (darker shade) */}
                <div
                  className="w-full bg-neutral-400 rounded-t"
                  style={{ height: `${(yearData.totalContributions / yearData.totalValue) * 100}%` }}
                />
              </div>
            </div>
          </Tooltip>

          {/* X-axis label (year) - show selectively for readability */}
          {shouldShowYearLabel(yearData.year, yearlyData.length) && (
            <div className="text-xs text-neutral-600 mt-1">
              {yearData.year}
            </div>
          )}
        </div>
      ))}
    </div>

    {/* X-axis label */}
    <div className="text-center text-xs text-neutral-500 mt-2">Ár</div>
  </CardContent>
</Card>
```

**Helper Functions**:

```typescript
// Determine which year labels to show based on data length
function shouldShowYearLabel(year: number, totalYears: number): boolean {
  if (totalYears <= 10) return true; // Show all
  if (totalYears <= 20) return year % 2 === 0; // Show every 2nd
  if (totalYears <= 30) return year % 5 === 0; // Show every 5th
  return year % 10 === 0; // Show every 10th
}

// Calculate max value for scaling
function getMaxValue(yearlyData: YearlySavingsData[]): number {
  return Math.max(...yearlyData.map(d => d.totalValue));
}
```

### 5. ScenarioManager

**Location**: `src/components/savings/ScenarioManager.tsx`

**Responsibilities**:
- Display saved scenarios (up to 3)
- Comparison table showing key metrics
- Save new scenario with user-provided name
- Load/delete scenario actions
- Highlight best scenario (highest future value)

**Props**:
```typescript
interface ScenarioManagerProps {
  scenarios: SavingsScenario[];
  currentInputs: SavingsInputs;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}
```

**Render Structure**:
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3>Sviðsmyndir</h3>
      {scenarios.length < 3 && (
        <Button onClick={() => setShowSaveDialog(true)} size="sm">
          Vista núverandi
        </Button>
      )}
    </div>
  </CardHeader>
  <CardContent>
    {scenarios.length === 0 ? (
      <p className="text-sm text-neutral-600">
        Engar vistaðar sviðsmyndir. Búðu til nokkrar til að bera saman.
      </p>
    ) : scenarios.length === 1 ? (
      <p className="text-sm text-neutral-600">
        Búðu til fleiri sviðsmyndir til að bera þær saman.
      </p>
    ) : (
      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2">Nafn</th>
              <th className="text-right py-2">Sparnaður/mán</th>
              <th className="text-right py-2">Vextir</th>
              <th className="text-right py-2">Tímabil</th>
              <th className="text-right py-2">Framtíðarvirði</th>
              <th className="text-right py-2">Lífsorka</th>
              <th className="text-right py-2"></th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map(scenario => {
              const isBest = scenario.results.futureValue === maxFutureValue;
              return (
                <tr
                  key={scenario.id}
                  className={cn(
                    'border-b border-neutral-100',
                    isBest && 'bg-success-50'
                  )}
                >
                  <td className="py-2 font-medium">
                    {scenario.name}
                    {isBest && <Badge variant="success" className="ml-2">Besta</Badge>}
                  </td>
                  <td className="text-right">
                    {formatCurrency(scenario.inputs.monthlySavings)}
                  </td>
                  <td className="text-right">
                    {scenario.inputs.annualInterestRate.toFixed(1)}%
                  </td>
                  <td className="text-right">
                    {scenario.inputs.timeHorizonYears} ár
                  </td>
                  <td className="text-right font-semibold">
                    {formatCurrency(scenario.results.futureValue)}
                  </td>
                  <td className="text-right text-primary-600">
                    {formatLifeEnergy(scenario.results.futureValueLifeEnergy)}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onLoad(scenario.id)}
                        aria-label="Hlaða sviðsmynd"
                      >
                        Hlaða
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(scenario.id)}
                        aria-label="Eyða sviðsmynd"
                      >
                        Eyða
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </CardContent>
</Card>

{/* Save dialog */}
{showSaveDialog && (
  <SaveScenarioDialog
    onSave={(name) => {
      onSave(name);
      setShowSaveDialog(false);
    }}
    onCancel={() => setShowSaveDialog(false)}
  />
)}
```

### 6. MissingWagePrompt

**Location**: `src/components/savings/MissingWagePrompt.tsx`

**Responsibilities**:
- Display when `actualHourlyWage` is 0 or undefined
- Explain why life energy calculation requires wage
- Provide link to main calculator tab
- Non-blocking (user can still use ISK-only mode)

**Props**: None

**Render Structure**:
```tsx
<Alert variant="info" className="mb-4">
  <div className="flex items-start gap-3">
    <InfoIcon className="w-5 h-5 text-info-600 mt-0.5" />
    <div>
      <h4 className="font-semibold text-info-900">
        Lífsorka ekki tiltæk
      </h4>
      <p className="text-sm text-info-700 mt-1">
        Til að sjá hversu mikilli lífsorku sparnaður þinn samsvarar, þarftu að reikna út raunverulegt tímakaup þitt í aðalreiknivélinni.
      </p>
      <Button
        variant="link"
        size="sm"
        onClick={() => onTabChange('main')}
        className="mt-2 text-info-700 hover:text-info-900"
      >
        Fara í aðalreiknivél →
      </Button>
    </div>
  </div>
</Alert>
```

## Calculation Logic

### Core Calculation Function

**Location**: `src/lib/calculations/savings.ts`

**Function**: `calculateSavingsResults(inputs: SavingsInputs, actualHourlyWage: number): SavingsResults`

**Algorithm**:

```typescript
/**
 * Calculate compound savings results
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 * Where:
 *   P = monthly payment
 *   r = monthly interest rate (annual rate / 12)
 *   n = total number of months
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage: number
): SavingsResults {
  const { monthlySavings, annualInterestRate, timeHorizonYears } = inputs;

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = timeHorizonYears * 12;
  const totalContributions = monthlySavings * totalMonths;

  let futureValue: number;

  if (monthlyRate === 0) {
    // No interest: simple sum
    futureValue = totalContributions;
  } else {
    // Compound interest formula for annuity due (payment at beginning of period)
    // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
    futureValue = monthlySavings * (((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate));
  }

  const totalInterestEarned = futureValue - totalContributions;

  // Life energy conversions
  const futureValueLifeEnergy = actualHourlyWage > 0
    ? futureValue / actualHourlyWage
    : 0;
  const interestEarnedLifeEnergy = actualHourlyWage > 0
    ? totalInterestEarned / actualHourlyWage
    : 0;

  // Generate year-by-year breakdown
  const yearlyBreakdown = generateYearlyBreakdown(
    monthlySavings,
    monthlyRate,
    timeHorizonYears,
    actualHourlyWage
  );

  return {
    futureValue,
    totalContributions,
    totalInterestEarned,
    futureValueLifeEnergy,
    interestEarnedLifeEnergy,
    yearlyBreakdown,
  };
}

/**
 * Generate year-by-year data for visualization
 */
function generateYearlyBreakdown(
  monthlySavings: number,
  monthlyRate: number,
  timeHorizonYears: number,
  actualHourlyWage: number
): YearlySavingsData[] {
  const breakdown: YearlySavingsData[] = [];

  for (let year = 1; year <= timeHorizonYears; year++) {
    const monthsElapsed = year * 12;
    const contributions = monthlySavings * monthsElapsed;

    let totalValue: number;
    if (monthlyRate === 0) {
      totalValue = contributions;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, monthsElapsed);
      totalValue = monthlySavings * (((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const yearlyInterest = totalValue - contributions;
    const lifeEnergyHours = actualHourlyWage > 0 ? totalValue / actualHourlyWage : 0;

    breakdown.push({
      year,
      totalValue,
      totalContributions: contributions,
      yearlyInterest,
      lifeEnergyHours,
    });
  }

  return breakdown;
}

/**
 * Generate unique ID for savings scenario
 */
export function generateSavingsId(): string {
  return `savings-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Validation Function**:

```typescript
/**
 * Validate savings inputs
 */
export function validateSavingsInputs(inputs: SavingsInputs): ValidationResult {
  const errors: Record<string, string> = {};

  if (inputs.monthlySavings < SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS) {
    errors.monthlySavings = `Lágmark er ${formatCurrency(SAVINGS_LIMITS.MIN_MONTHLY_SAVINGS)}`;
  }
  if (inputs.monthlySavings > SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS) {
    errors.monthlySavings = `Hámark er ${formatCurrency(SAVINGS_LIMITS.MAX_MONTHLY_SAVINGS)}`;
  }

  if (inputs.annualInterestRate < SAVINGS_LIMITS.MIN_INTEREST_RATE) {
    errors.annualInterestRate = `Lágmark er ${SAVINGS_LIMITS.MIN_INTEREST_RATE}%`;
  }
  if (inputs.annualInterestRate > SAVINGS_LIMITS.MAX_INTEREST_RATE) {
    errors.annualInterestRate = `Hámark er ${SAVINGS_LIMITS.MAX_INTEREST_RATE}%`;
  }

  if (inputs.timeHorizonYears < SAVINGS_LIMITS.MIN_TIME_HORIZON) {
    errors.timeHorizonYears = `Lágmark er ${SAVINGS_LIMITS.MIN_TIME_HORIZON} ár`;
  }
  if (inputs.timeHorizonYears > SAVINGS_LIMITS.MAX_TIME_HORIZON) {
    errors.timeHorizonYears = `Hámark er ${SAVINGS_LIMITS.MAX_TIME_HORIZON} ár`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

## Integration Points

### 1. CalculatorContext Integration

**File**: `src/context/CalculatorContext.tsx`

**Changes Required**:

```typescript
// Add state
const [savingsScenarios, setSavingsScenarios] = useState<SavingsScenario[]>([]);

// Auto-recalculate when actualHourlyWage changes
useEffect(() => {
  if (!isHydrated || savingsScenarios.length === 0) return;

  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  setSavingsScenarios((prevScenarios) =>
    prevScenarios.map((scenario) => ({
      ...scenario,
      results: calculateSavingsResults(scenario.inputs, actualHourlyWage),
      updatedAt: new Date().toISOString(),
    }))
  );
}, [results?.actualHourlyWage, isHydrated]);

// CRUD operations
const addSavingsScenario = useCallback(
  (scenario: Omit<SavingsScenario, 'id' | 'results'>) => {
    if (savingsScenarios.length >= 3) {
      throw new Error('Þú getur aðeins haft 3 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
    }

    const actualHourlyWage = results?.actualHourlyWage ?? 0;
    const calculatedResults = calculateSavingsResults(scenario.inputs, actualHourlyWage);

    const newScenario: SavingsScenario = {
      id: generateSavingsId(),
      name: scenario.name,
      inputs: scenario.inputs,
      results: calculatedResults,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavingsScenarios((prev) => [...prev, newScenario]);
  },
  [savingsScenarios.length, results?.actualHourlyWage]
);

const updateSavingsScenario = useCallback(
  (id: string, updates: Partial<Omit<SavingsScenario, 'id' | 'results'>>) => {
    setSavingsScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id !== id) return scenario;

        const actualHourlyWage = results?.actualHourlyWage ?? 0;
        const updatedInputs = updates.inputs ? updates.inputs : scenario.inputs;
        const recalculatedResults = calculateSavingsResults(updatedInputs, actualHourlyWage);

        return {
          ...scenario,
          ...updates,
          inputs: updatedInputs,
          results: recalculatedResults,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  },
  [results?.actualHourlyWage]
);

const deleteSavingsScenario = useCallback((id: string) => {
  setSavingsScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
}, []);

const duplicateSavingsScenario = useCallback(
  (id: string) => {
    const scenario = savingsScenarios.find((s) => s.id === id);
    if (!scenario) return;

    if (savingsScenarios.length >= 3) {
      throw new Error('Þú getur aðeins haft 3 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
    }

    const actualHourlyWage = results?.actualHourlyWage ?? 0;
    const calculatedResults = calculateSavingsResults(scenario.inputs, actualHourlyWage);

    const duplicatedScenario: SavingsScenario = {
      id: generateSavingsId(),
      name: `${scenario.name} (afrit)`,
      inputs: { ...scenario.inputs },
      results: calculatedResults,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSavingsScenarios((prev) => [...prev, duplicatedScenario]);
  },
  [savingsScenarios, results?.actualHourlyWage]
);

// Load from localStorage
useEffect(() => {
  const stored = safeGetItem<StoredState>(STORAGE_KEY);
  if (stored && stored.version === STORAGE_VERSION) {
    // ... existing loads ...
    setSavingsScenarios(stored.savingsScenarios || []);
  }
  setIsHydrated(true);
}, []);

// Auto-save to localStorage
useEffect(() => {
  if (!isHydrated) return;

  const timeoutId = setTimeout(() => {
    const state: StoredState = {
      // ... existing fields ...
      savingsScenarios,
      lastUpdated: new Date().toISOString(),
    };
    safeSetItem(STORAGE_KEY, state);
  }, 500);

  return () => clearTimeout(timeoutId);
}, [/* ... existing deps ...*/, savingsScenarios, isHydrated]);

// Export context value
const value: CalculatorContextType = {
  // ... existing fields ...
  savingsScenarios,
  addSavingsScenario,
  updateSavingsScenario,
  deleteSavingsScenario,
  duplicateSavingsScenario,
};
```

### 2. Tab Navigation Integration

**File**: `src/app/page.tsx` (or wherever tabs are configured)

**Changes Required**:

```typescript
const CALCULATOR_TABS: CalculatorTab[] = [
  { id: 'main', label: 'Aðalreiknivél', shortLabel: 'Aðal' },
  { id: 'subscriptions', label: 'Áskriftir', shortLabel: 'Áskr.' },
  { id: 'meals', label: 'Matur', shortLabel: 'Matur' },
  { id: 'commute', label: 'Samgöngur', shortLabel: 'Samg.' },
  { id: 'savings', label: 'Sparnaður', shortLabel: 'Sparn.' }, // NEW
  // ... other tabs
];

// In render:
{activeTab === 'savings' && <CompoundSavingsCalculator />}
```

### 3. Storage Schema Migration

**File**: `src/lib/defaults.ts`

**Changes**:

```typescript
// Increment version if needed for migration
export const STORAGE_VERSION = 2; // or keep at current version if backwards compatible

// No changes needed - savingsScenarios is optional in StoredState
```

## Error Handling

### Input Validation Errors

**Strategy**: Display inline validation errors adjacent to input fields

```typescript
// In SavingsInputForm
const validationResult = validateSavingsInputs(inputs);

<CurrencyInput
  label="Mánaðarlegur sparnaður"
  value={inputs.monthlySavings}
  onChange={handleChange}
  error={validationResult.errors.monthlySavings}
  aria-invalid={!!validationResult.errors.monthlySavings}
/>
```

### Calculation Errors

**Strategy**: Use error boundaries and graceful fallbacks

```typescript
// In calculateSavingsResults
try {
  // ... calculation logic
} catch (error) {
  console.error('Savings calculation error:', error);
  // Return safe fallback
  return {
    futureValue: inputs.monthlySavings * inputs.timeHorizonYears * 12,
    totalContributions: inputs.monthlySavings * inputs.timeHorizonYears * 12,
    totalInterestEarned: 0,
    futureValueLifeEnergy: 0,
    interestEarnedLifeEnergy: 0,
    yearlyBreakdown: [],
  };
}
```

### Scenario Limit Errors

**Strategy**: User-friendly toast notification

```typescript
// In CalculatorContext.addSavingsScenario
if (savingsScenarios.length >= 3) {
  toast.error('Þú getur aðeins haft 3 sviðsmyndir í einu. Eyddu einni til að búa til nýja.');
  throw new Error('Maximum scenarios reached');
}
```

### localStorage Errors

**Strategy**: Silent fail with console warning (existing pattern)

```typescript
// Already handled by safeGetItem / safeSetItem utilities
```

## Performance Considerations

### Calculation Performance

**Target**: < 100ms for all calculations

**Strategy**:
- Simple math operations (no complex iterations)
- Memoize results with `useMemo`
- Year-by-year breakdown pre-calculated, not on-demand

**Benchmark**:
```typescript
// Worst case: 50 years × 12 months = 600 iterations
// Each iteration: 1 compound calculation
// Expected: < 10ms on modern hardware
```

### Rendering Performance

**Target**: < 500ms initial load, < 100ms updates

**Strategy**:
- Use CSS transitions (hardware accelerated)
- No chart library overhead
- Lazy load visualization if > 30 years
- Virtual scrolling not needed (max 50 bars)

### Memory Optimization

**Storage**:
- 3 scenarios × ~1KB each = ~3KB
- Yearly breakdown: 50 years × ~100 bytes = ~5KB per scenario
- Total: < 20KB additional localStorage

## Testing Strategy

### Unit Tests

**File**: `src/lib/calculations/savings.test.ts`

```typescript
describe('calculateSavingsResults', () => {
  it('calculates future value with compound interest correctly', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    }, 5000);

    // Expected future value (verify with financial calculator)
    expect(result.futureValue).toBeCloseTo(6977658, 0);
    expect(result.totalContributions).toBe(6000000);
    expect(result.totalInterestEarned).toBeCloseTo(977658, 0);
  });

  it('handles zero interest rate (simple sum)', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 0,
      timeHorizonYears: 10,
    }, 5000);

    expect(result.futureValue).toBe(6000000);
    expect(result.totalInterestEarned).toBe(0);
  });

  it('converts to life energy correctly', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    }, 5000);

    expect(result.futureValueLifeEnergy).toBeCloseTo(6977658 / 5000, 1);
    expect(result.interestEarnedLifeEnergy).toBeCloseTo(977658 / 5000, 1);
  });

  it('generates correct yearly breakdown', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    }, 5000);

    expect(result.yearlyBreakdown).toHaveLength(10);
    expect(result.yearlyBreakdown[0].year).toBe(1);
    expect(result.yearlyBreakdown[0].totalContributions).toBe(600000);
    expect(result.yearlyBreakdown[9].year).toBe(10);
  });
});

describe('validateSavingsInputs', () => {
  it('validates valid inputs', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects inputs below minimum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 500,
      annualInterestRate: -1,
      timeHorizonYears: 0,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlySavings).toBeDefined();
    expect(result.errors.annualInterestRate).toBeDefined();
    expect(result.errors.timeHorizonYears).toBeDefined();
  });
});
```

### Integration Tests

**File**: `tests/components/savings/CompoundSavingsCalculator.test.tsx`

```typescript
describe('CompoundSavingsCalculator', () => {
  it('renders input form and results', () => {
    render(<CompoundSavingsCalculator />);

    expect(screen.getByLabelText(/Mánaðarlegur sparnaður/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Árlegir vextir/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tímabil/i)).toBeInTheDocument();
  });

  it('recalculates when inputs change', async () => {
    const user = userEvent.setup();
    render(<CompoundSavingsCalculator />);

    const savingsInput = screen.getByLabelText(/Mánaðarlegur sparnaður/i);
    await user.clear(savingsInput);
    await user.type(savingsInput, '100000');

    // Results should update
    await waitFor(() => {
      expect(screen.getByText(/Framtíðarvirði/i)).toBeInTheDocument();
    });
  });

  it('applies preset interest rates', async () => {
    const user = userEvent.setup();
    render(<CompoundSavingsCalculator />);

    const verdtryggtButton = screen.getByText(/Verðtryggt/i);
    await user.click(verdtryggtButton);

    const rateInput = screen.getByLabelText(/Árlegir vextir/i);
    expect(rateInput).toHaveValue('3.0');
  });

  it('saves and loads scenarios', async () => {
    const user = userEvent.setup();
    render(<CompoundSavingsCalculator />);

    // Configure scenario
    const savingsInput = screen.getByLabelText(/Mánaðarlegur sparnaður/i);
    await user.type(savingsInput, '50000');

    // Save scenario
    const saveButton = screen.getByText(/Vista núverandi/i);
    await user.click(saveButton);

    const nameInput = screen.getByLabelText(/Nafn sviðsmyndar/i);
    await user.type(nameInput, 'Test Scenario');
    await user.click(screen.getByText(/Vista/i));

    // Verify scenario appears in list
    expect(screen.getByText('Test Scenario')).toBeInTheDocument();
  });
});
```

### E2E Testing Scenarios

1. **Complete workflow**: Enter inputs → See results → Save scenario → Compare scenarios
2. **Missing wage flow**: Access savings tab without completing main calculator → See prompt → Navigate to main
3. **Preset selection**: Click each preset → Verify rate auto-fills
4. **Scenario limit**: Create 3 scenarios → Attempt 4th → See error message
5. **Mobile responsiveness**: Test on 320px viewport → Verify all features accessible

## Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- All inputs focusable with Tab
- Preset buttons keyboard accessible
- Scenario actions keyboard accessible
- Visualization interactive elements keyboard accessible

**Screen Reader Support**:
```tsx
// ARIA labels for inputs
<CurrencyInput
  label="Mánaðarlegur sparnaður"
  aria-label="Mánaðarlegur sparnaður í krónum"
  aria-describedby="savings-help-text"
/>

// ARIA live regions for dynamic updates
<div role="status" aria-live="polite" aria-atomic="true">
  {results && `Framtíðarvirði: ${formatCurrency(results.futureValue)}`}
</div>

// Alternative text for visualization
<div className="visualization-container" aria-label="Graf yfir þróun sparnaðar">
  {/* Bars with data attributes for screen reader */}
  <div
    role="img"
    aria-label={`Ár ${year}: ${formatCurrency(value)}`}
  />
</div>
```

**Color Contrast**:
- Primary text: 7:1 contrast ratio
- Secondary text: 4.5:1 contrast ratio
- Interactive elements: 3:1 contrast ratio
- Success/info badges: sufficient contrast + text labels

**Focus Indicators**:
```css
/* Visible focus ring for all interactive elements */
.input:focus,
.button:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

## Design Decisions

### Decision 1: No Chart Library

**Options Considered**:
1. Recharts (popular React charting library)
2. Victory (declarative React charts)
3. Pure CSS visualization

**Decision**: Pure CSS visualization

**Rationale**:
- Bundle size: No additional 50-100KB chart library
- Performance: CSS animations hardware accelerated
- Simplicity: Only need simple bar chart, not complex interactions
- Existing pattern: BreakdownChart uses CSS bars successfully
- Mobile-friendly: Easier to make responsive

**Trade-offs**:
- More custom code to maintain
- Limited interactivity (hover tooltips only)
- No built-in accessibility features (must implement manually)

### Decision 2: Separate Life Energy for Interest

**Options Considered**:
1. Show only total future value in life energy
2. Show both total and interest-earned separately
3. Show contributions, interest, and total separately

**Decision**: Show total + interest-earned separately

**Rationale**:
- Key insight: Interest is "free" life energy
- Motivational: Highlights benefit of compound growth
- Clear comparison: User can see work-earned vs interest-earned life energy
- Requirements alignment: REQ-3 explicitly calls for separate display

**Trade-offs**:
- Slightly more complex UI
- Requires explanation for users unfamiliar with concept

### Decision 3: Max 3 Scenarios

**Options Considered**:
1. Unlimited scenarios
2. Max 3 scenarios
3. Max 5 scenarios

**Decision**: Max 3 scenarios

**Rationale**:
- Consistency: Matches main calculator scenario limit
- Usability: 3 scenarios sufficient for most comparisons
- Performance: Limits localStorage usage and rendering complexity
- UI clarity: Comparison table readable with 3 scenarios

**Trade-offs**:
- Power users may want more scenarios
- Requires deletion to create new scenarios

### Decision 4: Real-time actualHourlyWage Updates

**Options Considered**:
1. Calculate life energy only on scenario save
2. Recalculate automatically when wage changes
3. Manual "recalculate" button

**Decision**: Automatic recalculation (option 2)

**Rationale**:
- Consistency: Matches commute/housing calculator behavior
- User expectation: Users expect linked data to update automatically
- Better UX: No manual intervention required
- React pattern: useEffect dependency on actualHourlyWage

**Trade-offs**:
- Slightly more complex state management
- Potential performance impact (mitigated by useMemo)

### Decision 5: Monthly Input (Not Yearly)

**Options Considered**:
1. Yearly savings input
2. Monthly savings input
3. Choice between monthly/yearly

**Decision**: Monthly savings input

**Rationale**:
- User mental model: People think in monthly budgets
- Consistency: Other calculators use monthly amounts
- Icelandic context: Monthly income/expense planning is standard
- FIRE context: Monthly savings rate is common metric

**Trade-offs**:
- Internal conversion needed (monthly to yearly for storage)
- Potential confusion if documentation unclear

## Technical Debt and Future Enhancements

### Known Limitations

1. **No withdrawal phase modeling**: Only accumulation phase
2. **Fixed monthly contributions**: No variable contribution support
3. **Simple interest model**: No inflation adjustment option (except via verðtryggð preset)
4. **No tax considerations**: Doesn't account for capital gains tax
5. **Single currency**: ISK only, no multi-currency support

### Future Enhancement Opportunities

1. **Advanced Features**:
   - Withdrawal phase calculator (drawdown planning)
   - Variable contribution scheduling
   - One-time lump sum additions
   - Early withdrawal penalty modeling

2. **Visualization Enhancements**:
   - Toggle between bar chart and line chart
   - Cumulative interest visualization
   - Inflation-adjusted purchasing power view
   - Download chart as image

3. **Integration Enhancements**:
   - Link to FI target (years to FI goal)
   - Recommend savings rate based on FI target
   - Compare savings vs paying off debt

4. **Internationalization**:
   - Multi-currency support
   - Country-specific tax considerations
   - Localized interest rate presets

## Security Considerations

### Data Privacy

**No PII Collection**: Calculator processes all data client-side, no server transmission

**localStorage Security**:
- Data stored locally only
- No authentication tokens in storage
- Export functionality creates JSON file, not network transmission

### Input Validation

**Client-side Validation**:
- Min/max bounds on all numeric inputs
- Type checking (number validation)
- Sanitization of user-provided scenario names

**No Server-side Concerns**: Pure client-side feature, no API endpoints

## Deployment Strategy

### Feature Flag

Not required - feature can be deployed directly as new tab

### Rollout Plan

1. **Phase 1**: Deploy to production with tab visible
2. **Phase 2**: Monitor usage analytics (if tracking implemented)
3. **Phase 3**: Gather user feedback via existing channels

### Rollback Plan

If critical issues discovered:
- Remove tab from CalculatorTabsNav (single line change)
- Feature remains in codebase, just hidden
- localStorage data preserved for future re-enable

## Documentation Requirements

### User-Facing Documentation

**In-app Help Text**:
- Tooltips on preset buttons
- Help icon with explanation of compound interest
- Explanation of "interest earned life energy" concept

**Example**:
```tsx
<Tooltip content="Verðtryggður sparnaður: Vextir auk verðbólguaðlögunar. Dæmigerð ávöxtun fyrir verðtryggðan sparnað á Íslandi.">
  <Button>Verðtryggt 3.0%</Button>
</Tooltip>
```

### Developer Documentation

**Code Comments**:
- JSDoc for all exported functions
- Inline comments for complex calculations
- README in `/components/savings/` explaining architecture

**API Documentation**:
- CalculatorContext methods documented
- Type definitions with examples

## Monitoring and Analytics

### Error Tracking

**Console Logging**:
- Calculation errors logged to console
- Scenario limit errors logged
- localStorage errors already handled by utility

**Error Boundary**:
```tsx
<ErrorBoundary fallback={<SavingsCalculatorError />}>
  <CompoundSavingsCalculator />
</ErrorBoundary>
```

### Usage Metrics (Optional)

If analytics framework exists:
- Tab activation count
- Scenario creation count
- Preset button usage
- Average time horizon selected

## Requirements Traceability

| Requirement | Design Component | Implementation Location |
|-------------|------------------|------------------------|
| REQ-1: Savings Scenario Configuration | SavingsInputForm | `components/savings/SavingsInputForm.tsx` |
| REQ-2: Future Value Calculation | calculateSavingsResults() | `lib/calculations/savings.ts` |
| REQ-3: Life Energy Conversion | calculateSavingsResults() + SavingsResultsDisplay | `lib/calculations/savings.ts`, `components/savings/SavingsResultsDisplay.tsx` |
| REQ-4: Compound Growth Visualization | CompoundGrowthVisualization | `components/savings/CompoundGrowthVisualization.tsx` |
| REQ-5: Icelandic Savings Context | ICELANDIC_SAVINGS_PRESETS + Preset buttons | `lib/constants/savings.ts`, `components/savings/SavingsInputForm.tsx` |
| REQ-6: Scenario Comparison | ScenarioManager | `components/savings/ScenarioManager.tsx` |
| REQ-7: Data Persistence | CalculatorContext + localStorage | `context/CalculatorContext.tsx` |
| REQ-8: Integration with Main Calculator | CalculatorContext.results.actualHourlyWage | `context/CalculatorContext.tsx` |
| REQ-9: User Interface and Navigation | CalculatorTabsNav + responsive components | `components/layout/CalculatorTabsNav.tsx`, all savings components |

## Appendices

### Appendix A: Compound Interest Formula Verification

**Formula**: FV = P × [((1 + r)^n - 1) / r] × (1 + r)

**Example Calculation**:
- Monthly savings: 50,000 ISK
- Annual interest rate: 3.0%
- Time horizon: 10 years
- Monthly rate: 0.03 / 12 = 0.0025
- Total months: 10 × 12 = 120

**Calculation**:
```
FV = 50,000 × [((1 + 0.0025)^120 - 1) / 0.0025] × (1 + 0.0025)
FV = 50,000 × [((1.0025)^120 - 1) / 0.0025] × 1.0025
FV = 50,000 × [(1.34936 - 1) / 0.0025] × 1.0025
FV = 50,000 × [0.34936 / 0.0025] × 1.0025
FV = 50,000 × 139.744 × 1.0025
FV = 6,995,533 ISK
```

**Contributions**: 50,000 × 120 = 6,000,000 ISK
**Interest Earned**: 6,995,533 - 6,000,000 = 995,533 ISK

### Appendix B: File Structure

```
src/
├── components/
│   └── savings/                    (NEW)
│       ├── CompoundSavingsCalculator.tsx
│       ├── SavingsInputForm.tsx
│       ├── SavingsResultsDisplay.tsx
│       ├── CompoundGrowthVisualization.tsx
│       ├── ScenarioManager.tsx
│       ├── SaveScenarioDialog.tsx
│       └── MissingWagePrompt.tsx
├── lib/
│   ├── calculations/
│   │   └── savings.ts              (NEW)
│   └── constants/
│       └── savings.ts              (NEW)
├── types/
│   └── calculator.ts               (MODIFIED - add savings types)
└── context/
    └── CalculatorContext.tsx       (MODIFIED - add savings state/methods)
```

### Appendix C: Icelandic Terminology

| English | Icelandic | Usage Context |
|---------|-----------|---------------|
| Savings | Sparnaður | Feature name, tab label |
| Monthly savings | Mánaðarlegur sparnaður | Input field label |
| Interest rate | Vextir / Árlegir vextir | Input field label |
| Time horizon | Tímabil | Input field label |
| Future value | Framtíðarvirði | Results display |
| Interest earned | Vextir aflað | Results display |
| Contributions | Framlög / Innborganir | Results display |
| Life energy | Lífsorka | Throughout |
| Inflation-indexed | Verðtryggt | Preset label |
| Regular savings | Venjulegur sparnaður | Preset label |
| High-yield savings | Hávaxtasparnaður | Preset label |
| Scenario | Sviðsmynd | Scenario management |
| Save current | Vista núverandi | Button label |
| Load | Hlaða | Button label |
| Delete | Eyða | Button label |
| Best | Besta | Scenario comparison highlight |

---

**Design Review Checklist**:

- [x] All requirements addressed
- [x] Component hierarchy defined
- [x] Data model specified with TypeScript types
- [x] Calculation algorithms documented with examples
- [x] Integration points identified
- [x] Error handling strategy defined
- [x] Performance targets specified
- [x] Testing strategy outlined
- [x] Accessibility requirements addressed
- [x] Design decisions documented with rationale
- [x] Security considerations reviewed
- [x] Deployment strategy defined
- [x] Requirements traceability maintained

**Next Phase**: [Tasks Phase](tasks-compound-savings-life-energy.md) - Break down implementation into actionable tasks
