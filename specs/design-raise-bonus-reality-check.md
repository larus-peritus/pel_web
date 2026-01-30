# Design: Raise/Bonus Reality Check

**Feature ID**: 2.3.2
**Status**: Draft
**Created**: 2026-01-22
**Requirements**: `requirements-raise-bonus-reality-check.md`

---

## 1. Design Overview

### Architecture Summary
The Raise/Bonus Reality Check feature follows the established calculator pattern used in Commute, Housing, and Meal Cost calculators. It's a client-side React component with TypeScript type safety, localStorage persistence, and Icelandic tax calculations.

### Key Design Decisions

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| **Tax Engine Location** | External API, Static data, Calculated | Calculated with static rates | No Icelandic tax API exists; calculation is straightforward |
| **Municipality Data** | Hardcoded list, API, User input | Hybrid: Common list + manual override | Balances UX (quick select) with flexibility |
| **FI Calculation** | New module, Extend existing, External library | New dedicated module | Reusable across future features |
| **Scenario Storage** | Same as calculator state, Separate key | Separate localStorage key | Isolated data, easier to export/clear |
| **Comparison View** | Modal, Separate page, Inline tabs | Inline tabs (like Commute) | Consistent UX pattern |
| **Bonus Mode** | Separate calculator, Toggle in form | Toggle in form | Simpler UX, shared logic |

---

## 2. System Architecture

### Component Hierarchy
```
RaiseCalculator (Main Container)
├── TabNavigation (Scenarios | Comparison)
├── ScenarioList (When tab=Scenarios)
│   ├── AddScenarioButton (max 4)
│   └── ScenarioAccordion[]
│       ├── ScenarioSummary (collapsed view)
│       └── RaiseForm (expanded/editing)
│           ├── CurrentSituationSection
│           ├── ProposedSituationSection
│           └── FIContextSection (collapsible)
├── ComparisonView (When tab=Comparison)
│   ├── ComparisonTable
│   └── RecommendationPanel
└── WageAlert (if actualHourlyWage === 0)
```

### Data Flow
```
User Input (RaiseForm)
    ↓
Validation (raiseValidation.ts)
    ↓
Tax Calculation (icelandicTax.ts)
    ↓
FI Calculation (fiCalculations.ts)
    ↓
Life Energy Calculation (lifeEnergy.ts - existing)
    ↓
Results Aggregation (raiseCalculations.ts)
    ↓
Results Display (RaiseSummary)
    ↓
Scenario Storage (localStorage via CalculatorContext)
```

### Module Dependencies
```
raiseCalculations.ts
├── icelandicTax.ts (NEW - tax engine)
├── fiCalculations.ts (NEW - FI math)
├── lifeEnergy.ts (EXISTING - reuse)
└── types/raise.ts (NEW - type definitions)

RaiseCalculator.tsx
├── CalculatorContext.tsx (EXTEND - add raise methods)
├── RaiseForm.tsx (NEW)
├── RaiseSummary.tsx (NEW)
├── ComparisonTable.tsx (NEW)
└── ui components (EXISTING - Button, Card, etc.)
```

---

## 3. Data Models

### Type Definitions
Located in: `src/types/raise.ts`

```typescript
/**
 * Municipality with name and útsvar rate
 */
export interface Municipality {
  code: string;           // e.g., "0000" for Reykjavík
  name: string;           // e.g., "Reykjavík"
  utsvarRate: number;     // e.g., 14.48 (percentage)
}

/**
 * Icelandic tax configuration for a given year
 */
export interface TaxConfig {
  year: number;                    // e.g., 2026
  personalCreditMonthly: number;   // e.g., 70950 ISK/month
  nationalTaxBrackets: TaxBracket[];
  pensionRates: {
    employeeMin: number;           // e.g., 0.04 (4%)
    employerMin: number;           // e.g., 0.08 (8%)
  };
}

/**
 * Tax bracket definition
 */
export interface TaxBracket {
  upToMonthly: number | null;      // null = no upper limit
  rate: number;                    // e.g., 0.3174 (31.74%)
}

/**
 * Raise/bonus calculation inputs
 */
export interface RaiseInputs {
  // Basic income comparison
  currentGrossAnnual: number;      // ISK
  proposedGrossAnnual: number;     // ISK

  // Tax context
  municipality?: string;           // Municipality code (e.g., "0000")
  customUtsvarRate?: number;       // Manual override (12-15%)
  includePension: boolean;         // Default: true

  // Time investment (optional)
  currentWorkHoursWeek: number;    // Default: 40
  proposedWorkHoursWeek?: number;  // Optional if unchanged

  // FI context (optional for FI calculations)
  fiContext?: FIContext;

  // Calculation mode
  mode: 'raise' | 'bonus';         // Default: 'raise'
  bonusAmount?: number;            // Required if mode='bonus'
}

/**
 * FI (Financial Independence) context for timeline calculations
 */
export interface FIContext {
  annualExpenses: number;          // ISK/year
  savingsRate: number;             // Percentage (0-100)
  currentPortfolio: number;        // ISK
  expectedReturn: number;          // Percentage (default: 7%)
}

/**
 * Tax calculation results
 */
export interface TaxResults {
  grossAnnual: number;
  taxableIncome: number;           // After pension deduction
  nationalTax: number;
  municipalTax: number;
  totalTax: number;
  personalCredit: number;
  netTax: number;                  // Total tax - credit
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;        // Percentage
}

/**
 * FI timeline calculation results
 */
export interface FIResults {
  fiNumber: number;                // Annual expenses × 25
  currentYearsToFI: number;        // Years with current income
  proposedYearsToFI: number;       // Years with proposed income
  accelerationMonths: number;      // Difference in months (negative = delay)
  currentAnnualSavings: number;    // ISK/year
  proposedAnnualSavings: number;   // ISK/year
  savingsDifferenceAnnual: number; // ISK/year increase
}

/**
 * Life energy calculation results
 */
export interface LifeEnergyResults {
  currentTrueHourlyWage: number;   // ISK/hour (after expenses/extra time)
  proposedTrueHourlyWage: number;  // ISK/hour
  hourlyWageChange: number;        // ISK/hour difference
  hourlyWageChangePercent: number; // Percentage change
  annualLifeEnergyGain: number;    // Hours of freedom per year
  fiLifeEnergyYears: number;       // Years of life energy gained via FI acceleration
}

/**
 * Complete raise calculation results
 */
export interface RaiseResults {
  // Tax calculations
  currentTax: TaxResults;
  proposedTax: TaxResults;

  // Income difference
  grossIncreaseAnnual: number;
  grossIncreaseMonthly: number;
  netIncreaseAnnual: number;
  netIncreaseMonthly: number;
  effectiveTaxRateOnIncrease: number;

  // FI impact (optional - null if no FI context)
  fiImpact?: FIResults;

  // Life energy analysis
  lifeEnergy: LifeEnergyResults;

  // Plain language summary
  summary: RaiseSummary;
  warnings: string[];
}

/**
 * Plain language summary
 */
export interface RaiseSummary {
  headline: string;                // e.g., "Þú færð 45.000 kr/mánuð aukalega eftir skatta"
  fiImpact?: string;               // e.g., "FI dagsetning færist 8 mánuðum nær"
  lifeEnergyImpact: string;        // e.g., "Þetta er jafngildir 240 klukkustundum af frelsi á ári"
  hourlyWageChange: string;        // e.g., "Raunveruleg tímakaup þín hækka um 350 kr"
}

/**
 * Bonus-specific calculation results
 */
export interface BonusResults extends RaiseResults {
  bonusNetAmount: number;          // After-tax bonus value
  equivalentRaiseAnnual: number;   // What annual raise = this bonus
  fiveYearComparison: {
    bonusInvested: number;         // FV of bonus at 7% over 5 years
    raiseInvested: number;         // FV of raise savings at 7% over 5 years
    betterOption: 'bonus' | 'raise' | 'similar';
  };
}

/**
 * Saved raise scenario
 */
export interface RaiseScenario {
  id: string;                      // UUID
  name: string;                    // User-defined (max 50 chars)
  inputs: RaiseInputs;
  results: RaiseResults;
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
  isCurrent?: boolean;             // Optional marker
}

/**
 * Comparison metric for table display
 */
export interface ComparisonMetric {
  label: string;                   // Icelandic label
  getValue: (scenario: RaiseScenario) => number | string;
  format: 'currency' | 'percentage' | 'number' | 'duration';
  highlightBest?: boolean;         // Whether to highlight best value
  sortOrder?: 'asc' | 'desc';      // For determining "best"
}
```

### Constants File
Located in: `src/lib/constants/icelandicTax.ts`

```typescript
/**
 * 2026 Icelandic tax configuration
 */
export const TAX_CONFIG_2026: TaxConfig = {
  year: 2026,
  personalCreditMonthly: 70950,  // 851,400 kr/year
  nationalTaxBrackets: [
    {
      upToMonthly: 488666,         // ~5,864,000 kr/year
      rate: 0.3174,                // 31.74% average on lower bracket
    },
    {
      upToMonthly: null,           // No upper limit
      rate: 0.4624,                // 46.24% marginal on top bracket
    },
  ],
  pensionRates: {
    employeeMin: 0.04,             // 4%
    employerMin: 0.08,             // 8%
  },
};

/**
 * Common Icelandic municipalities with útsvar rates (2026)
 */
export const MUNICIPALITIES: Municipality[] = [
  { code: '0000', name: 'Reykjavík', utsvarRate: 14.48 },
  { code: '1000', name: 'Kópavogur', utsvarRate: 13.13 },
  { code: '1100', name: 'Seltjarnarnes', utsvarRate: 13.13 },
  { code: '1300', name: 'Garðabær', utsvarRate: 12.53 },
  { code: '1400', name: 'Hafnarfjörður', utsvarRate: 13.68 },
  { code: '1604', name: 'Reykjanesbær', utsvarRate: 14.45 },
  { code: '2000', name: 'Mosfellsbær', utsvarRate: 13.31 },
  { code: '3000', name: 'Akranes', utsvarRate: 14.52 },
  { code: '6000', name: 'Akureyri', utsvarRate: 14.52 },
  // ... (add more as needed)
  { code: 'other', name: 'Annað (handfært)', utsvarRate: 14.0 }, // Manual override option
];

/**
 * Default FI calculation assumptions
 */
export const FI_DEFAULTS = {
  expectedReturn: 7.0,             // 7% annual return
  safeWithdrawalRate: 4.0,         // 4% SWR (25x expenses)
  weeksPerYear: 50,                // Standard work year
};
```

---

## 4. Calculation Engine Design

### Tax Calculation Module
File: `src/lib/calculations/icelandicTax.ts`

```typescript
/**
 * Calculate Icelandic income tax for a given gross annual income
 *
 * @param grossAnnual - Gross annual income in ISK
 * @param utsvarRate - Municipal tax rate (percentage, e.g., 14.48)
 * @param includePension - Whether to deduct pension (default: true)
 * @param taxConfig - Tax configuration (default: 2026 config)
 * @returns Complete tax calculation results
 */
export function calculateIcelandicTax(
  grossAnnual: number,
  utsvarRate: number,
  includePension: boolean = true,
  taxConfig: TaxConfig = TAX_CONFIG_2026
): TaxResults;

/**
 * Calculate marginal tax rate at a specific income level
 * Useful for understanding effective rate on raise
 *
 * @param monthlyIncome - Monthly income in ISK
 * @param utsvarRate - Municipal tax rate
 * @param taxConfig - Tax configuration
 * @returns Marginal tax rate as percentage
 */
export function calculateMarginalRate(
  monthlyIncome: number,
  utsvarRate: number,
  taxConfig: TaxConfig = TAX_CONFIG_2026
): number;

/**
 * Find which tax bracket applies to a given monthly income
 */
function findTaxBracket(
  monthlyIncome: number,
  brackets: TaxBracket[]
): TaxBracket;

/**
 * Calculate national income tax using progressive brackets
 */
function calculateNationalTax(
  monthlyTaxableIncome: number,
  brackets: TaxBracket[]
): number;
```

**Algorithm: Progressive Tax Calculation**
```
1. Deduct employee pension (if enabled):
   taxableIncome = grossAnnual × (1 - 0.04)

2. Convert to monthly:
   monthlyTaxable = taxableIncome / 12

3. Calculate national tax (progressive):
   For each bracket:
     taxableInBracket = min(monthlyTaxable, bracket.upTo) - previousBracket.upTo
     taxForBracket = taxableInBracket × bracket.rate
   nationalTaxMonthly = sum(taxForBracket)

4. Calculate municipal tax (flat):
   municipalTaxMonthly = monthlyTaxable × (utsvarRate / 100)

5. Apply personal credit:
   totalTaxMonthly = nationalTaxMonthly + municipalTaxMonthly
   creditMonthly = min(totalTaxMonthly, personalCreditMonthly)
   netTaxMonthly = totalTaxMonthly - creditMonthly

6. Calculate net income:
   netMonthly = monthlyTaxable - netTaxMonthly
   netAnnual = netMonthly × 12

7. Calculate effective rate:
   effectiveTaxRate = (netTaxMonthly × 12) / grossAnnual × 100
```

### FI Calculation Module
File: `src/lib/calculations/fiCalculations.ts`

```typescript
/**
 * Calculate years to financial independence
 *
 * @param annualExpenses - Annual spending in ISK
 * @param annualSavings - Annual savings in ISK
 * @param currentPortfolio - Current portfolio value in ISK
 * @param expectedReturn - Expected annual return (percentage, e.g., 7)
 * @returns Years to FI (can be fractional)
 */
export function calculateYearsToFI(
  annualExpenses: number,
  annualSavings: number,
  currentPortfolio: number,
  expectedReturn: number = 7
): number;

/**
 * Calculate FI number (25x annual expenses for 4% rule)
 */
export function calculateFINumber(annualExpenses: number): number;

/**
 * Calculate future value with annual contributions
 *
 * @param principal - Starting amount
 * @param annualContribution - Yearly contribution
 * @param years - Number of years
 * @param rate - Annual return rate (percentage)
 */
export function calculateFutureValue(
  principal: number,
  annualContribution: number,
  years: number,
  rate: number
): number;

/**
 * Compare FI impact between two income scenarios
 */
export function compareFIImpact(
  currentNetAnnual: number,
  proposedNetAnnual: number,
  fiContext: FIContext
): FIResults;
```

**Algorithm: Years to FI**
```
FI Number = Annual Expenses × 25 (4% safe withdrawal rule)

If Current Portfolio >= FI Number:
  Return 0 (already FI)

Annual Savings = Net Annual Income × (Savings Rate / 100)

Years to FI = ln((FI Number × r / Annual Savings) + 1) / ln(1 + r)

Where:
  r = Expected Return / 100
  ln = natural logarithm

Edge cases:
  - If Annual Savings ≤ 0: Return Infinity
  - If FI Number ≤ Current Portfolio: Return 0
```

### Raise Calculation Orchestrator
File: `src/lib/calculations/raiseCalculations.ts`

```typescript
/**
 * Calculate complete raise analysis
 *
 * Orchestrates tax, FI, and life energy calculations
 */
export function calculateRaiseResults(
  inputs: RaiseInputs,
  actualHourlyWage: number  // From main calculator
): RaiseResults;

/**
 * Calculate bonus-specific analysis
 */
export function calculateBonusResults(
  inputs: RaiseInputs,
  actualHourlyWage: number
): BonusResults;

/**
 * Generate plain language summary in Icelandic
 */
export function generateRaiseSummary(
  results: RaiseResults,
  inputs: RaiseInputs
): RaiseSummary;

/**
 * Generate warnings based on calculation results
 *
 * Examples:
 * - High effective tax rate (>40%)
 * - Lifestyle inflation risk (savings rate drops)
 * - Negative hourly wage change despite raise
 * - Small real increase (<5%)
 */
export function generateWarnings(
  results: RaiseResults,
  inputs: RaiseInputs
): string[];
```

---

## 5. Component Design

### RaiseCalculator (Main Container)
File: `src/components/raise/RaiseCalculator.tsx`

**Responsibilities**:
- Manage view state (scenarios vs comparison)
- Integrate with CalculatorContext for actualHourlyWage
- Handle scenario CRUD operations
- Render tab navigation

**Props**:
```typescript
interface RaiseCalculatorProps {
  className?: string;
}
```

**State**:
```typescript
const [viewMode, setViewMode] = useState<'scenarios' | 'comparison'>('scenarios');
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingScenario, setEditingScenario] = useState<RaiseScenario | null>(null);
```

**Integration**:
```typescript
const {
  raiseScenarios,           // From extended CalculatorContext
  addRaiseScenario,
  updateRaiseScenario,
  deleteRaiseScenario,
  duplicateRaiseScenario,
  results,                  // For actualHourlyWage
} = useCalculator();
```

**Layout**:
```tsx
<Card>
  {actualHourlyWage === 0 && <WageAlert />}

  <TabNavigation>
    <Tab active={viewMode === 'scenarios'}>Atburðarásir</Tab>
    <Tab active={viewMode === 'comparison'}>Samanburður</Tab>
  </TabNavigation>

  {viewMode === 'scenarios' && (
    <ScenarioList
      scenarios={raiseScenarios}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
    />
  )}

  {viewMode === 'comparison' && (
    <ComparisonView scenarios={raiseScenarios} />
  )}
</Card>
```

### RaiseForm (Input Form)
File: `src/components/raise/RaiseForm.tsx`

**Responsibilities**:
- Collect user inputs
- Validate inputs in real-time
- Calculate results on submit
- Handle municipality selection
- Toggle between raise/bonus modes

**Props**:
```typescript
interface RaiseFormProps {
  initialInputs?: RaiseInputs;  // For editing existing scenario
  onSubmit: (inputs: RaiseInputs, results: RaiseResults) => void;
  onCancel: () => void;
  actualHourlyWage: number;
}
```

**Sections**:
1. **Mode Toggle**: Raise | Bonus (radio buttons)
2. **Current Situation**:
   - Gross annual salary (ISK input)
   - Work hours per week (number input, default 40)
   - Municipality dropdown OR manual útsvar %
3. **Proposed Situation**:
   - Gross annual salary (ISK input) OR Bonus amount (if mode=bonus)
   - Work hours per week (number input, "Same as current" checkbox)
4. **FI Context** (Collapsible, optional):
   - Annual expenses (ISK)
   - Savings rate (% slider, 0-100%)
   - Current portfolio (ISK)
   - Expected return (% input, default 7%)

**Validation Rules**:
```typescript
const validationRules = {
  currentGrossAnnual: { min: 1, required: true },
  proposedGrossAnnual: { min: 1, required: true, notEqual: 'currentGrossAnnual' },
  customUtsvarRate: { min: 12, max: 15 },
  currentWorkHoursWeek: { min: 1, max: 100 },
  proposedWorkHoursWeek: { min: 1, max: 100 },
  savingsRate: { min: 0, max: 100 },
  expectedReturn: { min: 0, max: 20 },
};
```

**Submit Handler**:
```typescript
const handleSubmit = () => {
  const validation = validateRaiseInputs(inputs);
  if (!validation.isValid) {
    setErrors(validation.errors);
    return;
  }

  const results = inputs.mode === 'bonus'
    ? calculateBonusResults(inputs, actualHourlyWage)
    : calculateRaiseResults(inputs, actualHourlyWage);

  onSubmit(inputs, results);
};
```

### RaiseSummary (Results Display)
File: `src/components/raise/RaiseSummary.tsx`

**Responsibilities**:
- Display calculation results in plain language
- Show breakdown of tax impact, FI impact, life energy
- Highlight warnings

**Props**:
```typescript
interface RaiseSummaryProps {
  scenario: RaiseScenario;
  isExpanded?: boolean;  // For accordion view
}
```

**Layout**:
```tsx
<div className="space-y-6">
  {/* Headline Summary */}
  <div className="text-xl font-bold text-primary">
    {scenario.results.summary.headline}
  </div>

  {/* Key Metrics Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <MetricCard
      label="Eftir skatta/mánuð"
      value={formatCurrency(scenario.results.netIncreaseMonthly)}
      icon={<TrendingUp />}
    />
    <MetricCard
      label="Skatthlutfall á hækkun"
      value={formatPercentage(scenario.results.effectiveTaxRateOnIncrease)}
      icon={<Receipt />}
    />
    {scenario.results.fiImpact && (
      <>
        <MetricCard
          label="FI hraðun"
          value={`${scenario.results.fiImpact.accelerationMonths} mánuðir`}
          icon={<Calendar />}
        />
        <MetricCard
          label="Aukin sparing/ár"
          value={formatCurrency(scenario.results.fiImpact.savingsDifferenceAnnual)}
          icon={<PiggyBank />}
        />
      </>
    )}
    <MetricCard
      label="Raunveruleg tímakaup"
      value={`${formatCurrency(scenario.results.lifeEnergy.hourlyWageChange)}/klst`}
      icon={<Clock />}
    />
    <MetricCard
      label="Lífsorkuávinningur"
      value={`${Math.round(scenario.results.lifeEnergy.annualLifeEnergyGain)} klst/ári`}
      icon={<Zap />}
    />
  </div>

  {/* Detailed Breakdown (Collapsible) */}
  <Accordion title="Tax Breakdown">
    <TaxBreakdown
      current={scenario.results.currentTax}
      proposed={scenario.results.proposedTax}
    />
  </Accordion>

  {/* Warnings */}
  {scenario.results.warnings.length > 0 && (
    <Alert variant="warning">
      <ul>
        {scenario.results.warnings.map(w => <li key={w}>{w}</li>)}
      </ul>
    </Alert>
  )}
</div>
```

### ComparisonTable (Scenario Comparison)
File: `src/components/raise/ComparisonTable.tsx`

**Responsibilities**:
- Display 2-4 scenarios side-by-side
- Highlight best values per metric
- Responsive horizontal scroll on mobile

**Props**:
```typescript
interface ComparisonTableProps {
  scenarios: RaiseScenario[];
}
```

**Metrics Displayed**:
```typescript
const metrics: ComparisonMetric[] = [
  {
    label: 'Heildarlaun',
    getValue: (s) => formatCurrency(s.inputs.proposedGrossAnnual),
    format: 'currency',
  },
  {
    label: 'Nettó/mánuð',
    getValue: (s) => formatCurrency(s.results.proposedTax.netMonthly),
    format: 'currency',
    highlightBest: true,
    sortOrder: 'desc',
  },
  {
    label: 'Aukning eftir skatta',
    getValue: (s) => formatCurrency(s.results.netIncreaseMonthly),
    format: 'currency',
    highlightBest: true,
    sortOrder: 'desc',
  },
  {
    label: 'FI hraðun',
    getValue: (s) => s.results.fiImpact?.accelerationMonths || 'N/A',
    format: 'duration',
    highlightBest: true,
    sortOrder: 'desc',
  },
  {
    label: 'Tímakaup',
    getValue: (s) => formatCurrency(s.results.lifeEnergy.proposedTrueHourlyWage),
    format: 'currency',
    highlightBest: true,
    sortOrder: 'desc',
  },
  {
    label: 'Vinnustundir/viku',
    getValue: (s) => s.inputs.proposedWorkHoursWeek || s.inputs.currentWorkHoursWeek,
    format: 'number',
    highlightBest: true,
    sortOrder: 'asc',  // Less is better
  },
];
```

**Highlight Logic**:
```typescript
function getBestValueIndices(
  scenarios: RaiseScenario[],
  metric: ComparisonMetric
): Set<number> {
  const values = scenarios.map(s => metric.getValue(s));
  const numericValues = values.map(v => typeof v === 'number' ? v : -Infinity);

  const best = metric.sortOrder === 'desc'
    ? Math.max(...numericValues)
    : Math.min(...numericValues);

  return new Set(
    numericValues
      .map((v, i) => v === best ? i : -1)
      .filter(i => i !== -1)
  );
}
```

---

## 6. Context Integration

### Extend CalculatorContext
File: `src/context/CalculatorContext.tsx`

**New State**:
```typescript
const [raiseScenarios, setRaiseScenarios] = useState<RaiseScenario[]>([]);
```

**New Methods**:
```typescript
/**
 * Add a new raise scenario
 */
const addRaiseScenario = useCallback(
  (inputs: RaiseInputs, results: RaiseResults, name: string) => {
    const scenario: RaiseScenario = {
      id: generateUUID(),
      name,
      inputs,
      results,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRaiseScenarios(prev => [...prev, scenario]);
  },
  []
);

/**
 * Update existing raise scenario
 */
const updateRaiseScenario = useCallback(
  (id: string, inputs: RaiseInputs, results: RaiseResults) => {
    setRaiseScenarios(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, inputs, results, updatedAt: new Date().toISOString() }
          : s
      )
    );
  },
  []
);

/**
 * Delete raise scenario
 */
const deleteRaiseScenario = useCallback((id: string) => {
  setRaiseScenarios(prev => prev.filter(s => s.id !== id));
}, []);

/**
 * Duplicate raise scenario
 */
const duplicateRaiseScenario = useCallback((id: string) => {
  setRaiseScenarios(prev => {
    const original = prev.find(s => s.id === id);
    if (!original) return prev;

    const duplicate: RaiseScenario = {
      ...original,
      id: generateUUID(),
      name: `${original.name} (afrit)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return [...prev, duplicate];
  });
}, []);
```

**StoredState Extension**:
```typescript
export interface StoredState {
  // ... existing fields
  raiseScenarios?: RaiseScenario[];  // Optional for backward compatibility
}
```

---

## 7. Validation Design

### Input Validation
File: `src/lib/validation/raiseValidation.ts`

```typescript
export interface RaiseValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate raise inputs
 */
export function validateRaiseInputs(
  inputs: RaiseInputs
): RaiseValidationResult {
  const errors: Record<string, string> = {};

  // Current salary
  if (inputs.currentGrossAnnual <= 0) {
    errors.currentGrossAnnual = 'Núverandi laun verða að vera hærri en 0';
  }

  // Proposed salary
  if (inputs.proposedGrossAnnual <= 0) {
    errors.proposedGrossAnnual = 'Ný laun verða að vera hærri en 0';
  }

  // Must be different
  if (inputs.currentGrossAnnual === inputs.proposedGrossAnnual) {
    errors.proposedGrossAnnual = 'Ný laun verða að vera ólík núverandi launum';
  }

  // Útsvar validation
  if (inputs.customUtsvarRate) {
    if (inputs.customUtsvarRate < 12 || inputs.customUtsvarRate > 15) {
      errors.customUtsvarRate = 'Útsvar verður að vera á milli 12% og 15%';
    }
  }

  // Work hours
  if (inputs.currentWorkHoursWeek < 1 || inputs.currentWorkHoursWeek > 100) {
    errors.currentWorkHoursWeek = 'Vinnustundir verða að vera á milli 1 og 100';
  }

  if (inputs.proposedWorkHoursWeek) {
    if (inputs.proposedWorkHoursWeek < 1 || inputs.proposedWorkHoursWeek > 100) {
      errors.proposedWorkHoursWeek = 'Vinnustundir verða að vera á milli 1 og 100';
    }
  }

  // FI context validation (if provided)
  if (inputs.fiContext) {
    const fi = inputs.fiContext;

    if (fi.annualExpenses <= 0) {
      errors['fiContext.annualExpenses'] = 'Árleg útgjöld verða að vera hærri en 0';
    }

    if (fi.savingsRate < 0 || fi.savingsRate > 100) {
      errors['fiContext.savingsRate'] = 'Sparnaðarhlutfall verður að vera á milli 0% og 100%';
    }

    if (fi.currentPortfolio < 0) {
      errors['fiContext.currentPortfolio'] = 'Núverandi eignasafn getur ekki verið neikvætt';
    }

    if (fi.expectedReturn < 0 || fi.expectedReturn > 20) {
      errors['fiContext.expectedReturn'] = 'Vænt ávöxtun verður að vera á milli 0% og 20%';
    }
  }

  // Bonus mode validation
  if (inputs.mode === 'bonus') {
    if (!inputs.bonusAmount || inputs.bonusAmount <= 0) {
      errors.bonusAmount = 'Bónus upphæð verður að vera hærri en 0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

---

## 8. Error Handling

### Error Categories

1. **Input Validation Errors**
   - Display inline with form fields
   - Red border + error message below input
   - Prevent form submission until resolved

2. **Calculation Errors**
   - Should not occur with proper validation
   - Fallback: Display generic error alert
   - Log to console for debugging

3. **Storage Errors**
   - localStorage quota exceeded
   - Display toast notification
   - Offer to export/clear old scenarios

4. **Municipality Lookup Errors**
   - Fallback to manual útsvar input
   - Display info message

### Error Messages (Icelandic)

```typescript
export const ERROR_MESSAGES = {
  INVALID_SALARY: 'Laun verða að vera hærri en 0',
  SALARIES_EQUAL: 'Ný laun verða að vera ólík núverandi launum',
  INVALID_UTSVAR: 'Útsvar verður að vera á milli 12% og 15%',
  INVALID_HOURS: 'Vinnustundir verða að vera á milli 1 og 100',
  INVALID_SAVINGS_RATE: 'Sparnaðarhlutfall verður að vera á milli 0% og 100%',
  STORAGE_FULL: 'Ekki nægt pláss. Vinsamlegast eyddu gömlum atburðarásum.',
  MAX_SCENARIOS: 'Hámark 4 atburðarásir. Eyddu einni til að bæta við nýrri.',
  WAGE_REQUIRED: 'Vinsamlegast reiknaðu þitt raunverulega tímakaup fyrst.',
};
```

---

## 9. Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Memoize expensive calculations (FI years, tax brackets)
   - Use `useMemo` for computed values
   - Use `useCallback` for event handlers

2. **Debouncing**
   - Debounce real-time validation (300ms)
   - Debounce FI calculations in optional section (500ms)

3. **Lazy Loading**
   - Load comparison view only when tab active
   - Defer chart rendering until visible

4. **Data Structure**
   - Keep scenarios array max size 4 (bounded memory)
   - Store results with inputs (avoid recalculation on load)

### Performance Targets

- **Form Validation**: < 50ms
- **Tax Calculation**: < 20ms
- **FI Calculation**: < 30ms
- **Complete Raise Calc**: < 100ms
- **Comparison Table Render**: < 200ms
- **localStorage Save**: < 50ms

---

## 10. Testing Strategy

### Unit Tests

**Tax Calculations** (`icelandicTax.test.ts`):
- Test cases for each tax bracket
- Validate personal credit application
- Test marginal rate calculations
- Edge cases: zero income, very high income
- Pension inclusion/exclusion

**FI Calculations** (`fiCalculations.test.ts`):
- Test years to FI formula
- Edge cases: already FI, negative savings
- Test FI number calculation (25x rule)
- Future value calculations

**Raise Calculations** (`raiseCalculations.test.ts`):
- Complete raise calculation flow
- Bonus vs raise comparison
- Warning generation
- Plain language summary generation

### Integration Tests

**RaiseForm** (`RaiseForm.test.tsx`):
- Form validation
- Municipality selection
- FI context toggle
- Submit with valid/invalid data
- Mode switching (raise/bonus)

**RaiseSummary** (`RaiseSummary.test.tsx`):
- Results display
- Metric formatting
- Warning display
- Collapsible sections

**ComparisonTable** (`ComparisonTable.test.tsx`):
- Multi-scenario display
- Best value highlighting
- Responsive behavior

### End-to-End Tests

**Complete User Flow**:
1. Add first scenario
2. Enter current salary (6M ISK)
3. Enter proposed salary (6.5M ISK)
4. Select Reykjavík municipality
5. Submit → See results
6. Save scenario
7. Add second scenario (different salary)
8. Switch to comparison tab
9. Verify best values highlighted
10. Export scenarios

---

## 11. Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- Tab order: Form fields → Buttons → Tab navigation → Scenario cards
- Enter to submit forms
- Space to toggle checkboxes/radios
- Arrow keys for sliders

**Screen Reader Support**:
- All inputs have `<label>` elements
- Error messages use `aria-describedby`
- Results announced with `aria-live="polite"`
- Metric cards have semantic structure

**Color Contrast**:
- Text: 4.5:1 minimum contrast
- Icons: 3:1 minimum contrast
- Highlighted values: Don't rely on color alone (use icons/borders)

**Focus Indicators**:
- Visible focus ring on all interactive elements
- Custom focus styles match brand

---

## 12. Localization

### Icelandic Language

**Form Labels**:
```typescript
export const FORM_LABELS = {
  currentSituation: 'Núverandi staða',
  proposedSituation: 'Ný staða',
  fiContext: 'FI samhengi',
  grossAnnualSalary: 'Heildarlaun á ári (brúttó)',
  workHoursPerWeek: 'Vinnustundir á viku',
  municipality: 'Sveitarfélag',
  customUtsvar: 'Handvirkt útsvar (%)',
  annualExpenses: 'Árleg útgjöld',
  savingsRate: 'Sparnaðarhlutfall (%)',
  currentPortfolio: 'Núverandi eignasafn',
  expectedReturn: 'Vænt ávöxtun (%)',
  mode: 'Tegund',
  raiseMode: 'Launahækkun',
  bonusMode: 'Bónus',
};
```

**Result Labels**:
```typescript
export const RESULT_LABELS = {
  afterTaxMonthly: 'Eftir skatta/mánuð',
  afterTaxAnnual: 'Eftir skatta/ári',
  effectiveTaxRate: 'Skatthlutfall á hækkun',
  fiAcceleration: 'FI hraðun',
  trueHourlyWage: 'Raunveruleg tímakaup',
  lifeEnergyGain: 'Lífsorkuávinningur',
  yearsToFI: 'Ár til FI',
  annualSavings: 'Árleg sparing',
};
```

### Number Formatting

```typescript
/**
 * Format ISK currency
 * Examples: 1.234.567 kr, 45.000 kr
 */
export function formatISK(amount: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' kr';
}

/**
 * Format percentage
 * Examples: 42,5%, 7%
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}
```

---

## 13. Future Enhancements (v2+)

### Potential Features

1. **Multi-Year Projection**
   - Project salary growth over 5-10 years
   - Compound effect on FI timeline
   - Lifestyle inflation modeling

2. **Total Compensation Calculator**
   - Include benefits (health insurance, etc.)
   - Stock options valuation
   - Pension matching beyond minimum

3. **Career Path Optimizer**
   - Compare different career trajectories
   - Factor in promotion timelines
   - Industry benchmarking

4. **Tax Optimization Suggestions**
   - Equity savings account recommendations
   - Pension contribution optimization
   - Deduction opportunities

5. **Share/Export Features**
   - Generate shareable URLs (data in hash)
   - PDF export with charts
   - CSV export for spreadsheet analysis

6. **Historical Tax Data**
   - Calculate with past tax years
   - Show historical comparisons
   - Track tax law changes

---

## 14. Open Design Questions

1. **Municipality Dropdown**:
   - Show all 79 municipalities or top 20 + "Other"?
   - Decision: Top 20 + manual override for simplicity

2. **Pension Toggle**:
   - Always include or make it optional?
   - Decision: Default ON with toggle (most users want it included)

3. **FI Context Placement**:
   - Main form or separate section?
   - Decision: Collapsible section in form (optional but accessible)

4. **Comparison Table on Mobile**:
   - Horizontal scroll or stack vertically?
   - Decision: Horizontal scroll (preserves table structure)

5. **Scenario Limit**:
   - 4 scenarios (like Commute) or more?
   - Decision: 4 max (keeps comparison readable)

---

## 15. Dependencies and Integration

### Internal Dependencies
- ✅ `CalculatorContext.tsx` - Extend with raise methods
- ✅ `lifeEnergy.ts` - Reuse for life energy calculations
- ✅ `exportImport.ts` - Extend for raise scenario export
- ✅ UI Components - Button, Card, Alert, Badge, etc.

### New Modules Required
- ❌ `icelandicTax.ts` - Tax calculation engine
- ❌ `fiCalculations.ts` - FI timeline calculations
- ❌ `raiseCalculations.ts` - Raise orchestrator
- ❌ `raiseValidation.ts` - Input validation
- ❌ `types/raise.ts` - Type definitions

### External Dependencies
- No new npm packages required
- Uses existing: React, TypeScript, Tailwind, lucide-react

---

## 16. Success Metrics

### Technical Metrics
- [ ] All unit tests passing (>90% coverage)
- [ ] All integration tests passing
- [ ] Performance targets met (< 100ms calculations)
- [ ] Zero TypeScript errors
- [ ] WCAG 2.1 AA compliant

### User Experience Metrics
- [ ] Form validation provides helpful errors
- [ ] Results display in plain Icelandic
- [ ] Comparison table highlights best options clearly
- [ ] Mobile experience is fully functional
- [ ] Scenarios persist across sessions

### Business Metrics
- [ ] Accurate tax calculations (verified against real scenarios)
- [ ] FI calculations match manual calculations
- [ ] Users can make informed career decisions

---

**Document Status**: ✅ Complete
**Next Step**: Tasks Phase
**Reviewers**: Development Team, UX Designer, Icelandic Tax Expert
