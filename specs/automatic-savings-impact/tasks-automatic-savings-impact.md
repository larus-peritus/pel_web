# Verkefni: Sjálfvirk sparnaðaráhrif reiknivél

## Yfirlit

**Eiginleiki**: Sjálfvirk sparnaðaráhrif reiknivél (Automatic Savings Impact Calculator)
**App**: peninganaedalifid.is
**Spesifikasíður**:
- Requirements: `specs/automatic-savings-impact/requirements-automatic-savings-impact.md`
- Design: `specs/automatic-savings-impact/design-automatic-savings-impact.md`

Þetta skjal brýtur niður útfærslu á sjálfvirkri sparnaðaráhrifa reiknivél í framkvæmanleg verkefni.

---

## Útfærslurstefna

**Valin stefna**: Foundation-First með Feature Slicing

**Rökstuðningur**:
1. **Foundation first**: Byrja á types, constants, og calculations (grunnur)
2. **Feature slices**: Smíða UI íhluti í sjálfstæðum "slices" sem hægt er að prófa
3. **Incremental integration**: Tengja hvern íhlut við rest of app smám saman
4. **Test-driven**: Skrifa test fyrir calculations áður en UI

**Verkefnaröð**:
```
1. Foundation (Types, Constants, Utils)
   ↓
2. Core Calculations (Pure functions + tests)
   ↓
3. Basic UI Components (Inputs, Summary)
   ↓
4. Advanced Features (Charts, Comparison, Education)
   ↓
5. Integration (Context, localStorage, Export)
   ↓
6. Polish (Accessibility, Mobile, Testing)
```

---

## Epic Yfirlit

| Epic ID | Nafn | Áætluð Tími | Forgangsröð |
|---------|------|-------------|-------------|
| E1 | Foundation & Type System | 2-3 klst | Hæst |
| E2 | Core Calculation Engine | 3-4 klst | Hæst |
| E3 | Basic UI Components | 4-6 klst | Hár |
| E4 | Advanced Features | 4-6 klst | Miðlungs |
| E5 | Integration & Persistence | 2-3 klst | Hár |
| E6 | Polish & Accessibility | 3-4 klst | Miðlungs |

**Heildar tími áætlun**: 18-26 klukkustundir

---

## Epic 1: Foundation & Type System

**Markmið**: Búa til type system, constants, og validation fyrir savings calculator

**Fylgiskjöl**: Engin (nýir skrár)

### Verkefni 1.1: Búa til TypeScript types

**Objective**: Skilgreina öll types fyrir savings calculator

**Files to create**:
- `src/types/savings.ts`

**Functionality**:
```typescript
// Export all types
export type FrequencyKey = 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface FrequencyOption {
  key: FrequencyKey;
  label: string;
  timesPerYear: number;
}

export interface SavingsInputs {
  monthlyAmount: number;
  frequency: FrequencyKey;
  customFrequency?: number;
  years: number;
  returnRate: number;
  adjustForInflation: boolean;
  inflationRate: number;
}

export interface YearlyBreakdown {
  year: number;
  principal: number;
  growth: number;
  futureValue: number;
  realValue?: number;
}

export interface SavingsResults {
  futureValue: number;
  totalContributions: number;
  totalGrowth: number;
  growthPercentage: number;
  lifeEnergyContributed?: number;
  lifeEnergyEarnedPassively?: number;
  totalLifeEnergy?: number;
  freedomMonths?: number;
  realValue?: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface SavingsPreset {
  id: string;
  label: string;
  monthlyAmount: number;
  frequency: FrequencyKey;
  years: number;
}

export interface SavingsScenario {
  id: string;
  name: string;
  inputs: SavingsInputs;
  results: SavingsResults;
  createdAt: string;
  updatedAt: string;
}
```

**Tests**: N/A (type-only file)

**Requirements traced**:
- All user stories (foundational types)

**Estimated time**: 30 minutes

**Acceptance criteria**:
- ✅ All types exported from `src/types/savings.ts`
- ✅ No TypeScript errors
- ✅ Matches design document exactly

---

### Verkefni 1.2: Búa til constants og defaults

**Objective**: Skilgreina frequency options, presets, defaults, og validation ranges

**Files to create**:
- `src/lib/constants/savings.ts`

**Functionality**:
```typescript
import type { FrequencyOption, SavingsPreset, SavingsInputs } from '@/types/savings';

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { key: 'weekly', label: 'Vikulega', timesPerYear: 52 },
  { key: 'biweekly', label: 'Á tveggja vikna fresti', timesPerYear: 26 },
  { key: 'monthly', label: 'Mánaðarlega', timesPerYear: 12 },
  { key: 'custom', label: 'Sérsniðin', timesPerYear: 12 },
];

export const SAVINGS_PRESETS: SavingsPreset[] = [
  { id: 'small', label: '5.000 kr/mán', monthlyAmount: 5000, frequency: 'monthly', years: 10 },
  { id: 'medium', label: '10.000 kr/mán', monthlyAmount: 10000, frequency: 'monthly', years: 10 },
  { id: 'large', label: '25.000 kr/mán', monthlyAmount: 25000, frequency: 'monthly', years: 10 },
  { id: 'xlarge', label: '50.000 kr/mán', monthlyAmount: 50000, frequency: 'monthly', years: 10 },
];

export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlyAmount: 10000,
  frequency: 'monthly',
  years: 10,
  returnRate: 7,
  adjustForInflation: false,
  inflationRate: 2.5,
};

export const SAVINGS_RANGES = {
  monthlyAmount: { min: 1000, max: 10_000_000, step: 1000 },
  years: { min: 1, max: 50, step: 1 },
  returnRate: { min: 0, max: 20, step: 0.5 },
  inflationRate: { min: 0, max: 10, step: 0.1 },
  customFrequency: { min: 1, max: 365, step: 1 },
};
```

**Tests**: N/A (constants only)

**Requirements traced**:
- NS-1 (default 7% return rate)
- NS-3.4 (presets: 5k, 10k, 25k, 50k)
- NS-4.1 (frequency options)
- NS-6.2 (default 2.5% inflation)

**Estimated time**: 30 minutes

**Acceptance criteria**:
- ✅ All constants exported
- ✅ FREQUENCY_OPTIONS has 4 entries
- ✅ SAVINGS_PRESETS has 4 entries
- ✅ DEFAULT_SAVINGS_INPUTS matches requirements
- ✅ SAVINGS_RANGES matches design

---

### Verkefni 1.3: Uppfæra StoredState type

**Objective**: Bæta við savings data í global StoredState

**Files to modify**:
- `src/types/calculator.ts`

**Functionality**:
Add to `StoredState` interface:
```typescript
export interface StoredState {
  // ... existing fields ...

  // NEW: Automatic savings data
  savingsInputs?: SavingsInputs;
  savingsScenarios?: SavingsScenario[];

  lastUpdated: string;
}
```

**Tests**: N/A (type-only change)

**Requirements traced**:
- Non-functional (localStorage persistence)

**Estimated time**: 15 minutes

**Acceptance criteria**:
- ✅ `savingsInputs` field added (optional)
- ✅ `savingsScenarios` field added (optional)
- ✅ No breaking changes to existing code
- ✅ No TypeScript errors

---

## Epic 2: Core Calculation Engine

**Markmið**: Útfæra allan útreikningsvirkni með einingarprófum

**Fylgiskjöl**: `design-automatic-savings-impact.md` (Section 3)

### Verkefni 2.1: Útfæra calculateFutureValue function

**Objective**: Pure function fyrir FV útreiknings með compound interest

**Files to create**:
- `src/lib/calculations/savings.ts`

**Functionality**:
```typescript
/**
 * Calculate future value of periodic savings using compound interest
 *
 * Formula: FV = PMT × ((1 + r)^n - 1) / r
 * Special case: If r = 0, then FV = PMT × n
 *
 * @param payment - Payment amount per period
 * @param rate - Interest rate per period (decimal, e.g., 0.07/12 for 7% annual monthly)
 * @param periods - Number of payment periods
 * @returns Future value
 */
export function calculateFutureValue(
  payment: number,
  rate: number,
  periods: number
): number {
  // Edge case: No interest
  if (rate === 0) {
    return payment * periods;
  }

  // Standard FV formula
  return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}
```

**Tests** (create `src/lib/calculations/savings.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { calculateFutureValue } from './savings';

describe('calculateFutureValue', () => {
  it('calculates FV with 0% interest correctly', () => {
    const fv = calculateFutureValue(10000, 0, 120);
    expect(fv).toBe(1200000); // Simply 10000 × 120
  });

  it('calculates FV for 10k/month, 7% annual, 10 years', () => {
    const payment = 10000;
    const rate = 0.07 / 12; // Monthly rate
    const periods = 10 * 12; // 120 months

    const fv = calculateFutureValue(payment, rate, periods);

    // Expected: ~1,730,850 kr
    expect(fv).toBeCloseTo(1730850, -2); // Within 100 kr
  });

  it('calculates FV for 25k/month, 7% annual, 20 years', () => {
    const payment = 25000;
    const rate = 0.07 / 12;
    const periods = 20 * 12;

    const fv = calculateFutureValue(payment, rate, periods);

    // Expected: ~13,097,201 kr
    expect(fv).toBeCloseTo(13097201, -2);
  });

  it('handles edge case: 0 periods', () => {
    const fv = calculateFutureValue(10000, 0.07/12, 0);
    expect(fv).toBe(0);
  });

  it('handles edge case: 0 payment', () => {
    const fv = calculateFutureValue(0, 0.07/12, 120);
    expect(fv).toBe(0);
  });
});
```

**Requirements traced**:
- NS-1.1 (calculate FV with default 7%)
- Requirements Appendix (Example 1, Example 2 formulas)

**Estimated time**: 1 hour

**Acceptance criteria**:
- ✅ Function implemented correctly
- ✅ All tests pass
- ✅ Edge cases handled (0%, 0 periods, 0 payment)
- ✅ Matches hand-calculated examples from requirements

---

### Verkefni 2.2: Útfæra calculateYearlyBreakdown helper

**Objective**: Generate year-by-year data fyrir charting

**Files to modify**:
- `src/lib/calculations/savings.ts`

**Functionality**:
```typescript
/**
 * Calculate yearly breakdown for charting
 *
 * @param paymentPerPeriod - Payment amount per period
 * @param ratePerPeriod - Interest rate per period (decimal)
 * @param timesPerYear - Number of periods per year
 * @param years - Total years
 * @param inflationRate - Optional annual inflation rate (%)
 * @returns Array of yearly breakdowns
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

**Tests** (add to `savings.test.ts`):
```typescript
describe('calculateYearlyBreakdown', () => {
  it('generates correct breakdown for 10 years', () => {
    const payment = 10000;
    const rate = 0.07 / 12;
    const timesPerYear = 12;
    const years = 10;

    const breakdown = calculateYearlyBreakdown(payment, rate, timesPerYear, years);

    expect(breakdown).toHaveLength(11); // 0 to 10 inclusive
    expect(breakdown[0].futureValue).toBe(0);
    expect(breakdown[10].futureValue).toBeCloseTo(1730850, -2);
  });

  it('includes inflation adjustment when provided', () => {
    const payment = 10000;
    const rate = 0.07 / 12;
    const timesPerYear = 12;
    const years = 10;
    const inflationRate = 2.5;

    const breakdown = calculateYearlyBreakdown(payment, rate, timesPerYear, years, inflationRate);

    expect(breakdown[10].realValue).toBeDefined();
    expect(breakdown[10].realValue).toBeLessThan(breakdown[10].futureValue);
    // Real value at year 10 should be ~1,351,914 kr
    expect(breakdown[10].realValue).toBeCloseTo(1351914, -2);
  });
});
```

**Requirements traced**:
- Chart visualization (for SavingsChart)
- NS-6 (inflation adjustment)

**Estimated time**: 45 minutes

**Acceptance criteria**:
- ✅ Function generates correct year-by-year data
- ✅ Includes year 0 (starting point)
- ✅ Inflation adjustment optional and correct
- ✅ All tests pass

---

### Verkefni 2.3: Útfæra calculateSavingsResults main function

**Objective**: Main calculation function sem samlar alla útreikninga

**Files to modify**:
- `src/lib/calculations/savings.ts`

**Functionality**:
```typescript
import type { SavingsInputs, SavingsResults, FrequencyKey } from '@/types/savings';
import { FREQUENCY_OPTIONS } from '@/lib/constants/savings';

/**
 * Calculate complete savings results
 *
 * @param inputs - Savings inputs
 * @param actualHourlyWage - Optional actual hourly wage for life energy calculations
 * @param monthlyExpenses - Optional monthly expenses for freedom months calculation
 * @returns Complete savings results
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage?: number,
  monthlyExpenses?: number
): SavingsResults {
  // 1. Determine frequency
  const timesPerYear = inputs.frequency === 'custom'
    ? (inputs.customFrequency ?? 12)
    : FREQUENCY_OPTIONS.find(f => f.key === inputs.frequency)!.timesPerYear;

  // 2. Calculate per-period values
  const paymentPerPeriod = inputs.monthlyAmount * (12 / timesPerYear);
  const ratePerPeriod = inputs.returnRate / 100 / timesPerYear;
  const totalPeriods = inputs.years * timesPerYear;

  // 3. Future value
  const futureValue = calculateFutureValue(paymentPerPeriod, ratePerPeriod, totalPeriods);

  // 4. Principal and growth
  const totalContributions = paymentPerPeriod * totalPeriods;
  const totalGrowth = futureValue - totalContributions;
  const growthPercentage = futureValue > 0 ? (totalGrowth / futureValue) * 100 : 0;

  // 5. Inflation adjustment
  let realValue: number | undefined;
  if (inputs.adjustForInflation && inputs.years > 0) {
    realValue = futureValue / Math.pow(1 + inputs.inflationRate / 100, inputs.years);
  }

  // 6. Life energy calculations
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

  // 7. Yearly breakdown for charting
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
```

**Tests** (add to `savings.test.ts`):
```typescript
describe('calculateSavingsResults', () => {
  it('calculates all values correctly for basic scenario', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.futureValue).toBeCloseTo(1730850, -2);
    expect(results.totalContributions).toBe(1200000);
    expect(results.totalGrowth).toBeCloseTo(530850, -2);
    expect(results.growthPercentage).toBeCloseTo(30.68, 1); // ~30.68%
    expect(results.yearlyBreakdown).toHaveLength(11);
    expect(results.lifeEnergyContributed).toBeUndefined(); // No wage provided
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
    expect(results.totalLifeEnergy).toBeCloseTo(865, 0); // ~1,730,850 / 2,000
  });

  it('calculates freedom months when expenses provided', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const monthlyExpenses = 50000;
    const results = calculateSavingsResults(inputs, 2000, monthlyExpenses);

    expect(results.freedomMonths).toBeCloseTo(34.6, 1); // ~1,730,850 / 50,000
  });

  it('calculates real value when inflation adjustment enabled', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'monthly',
      years: 10,
      returnRate: 7,
      adjustForInflation: true,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    expect(results.realValue).toBeDefined();
    expect(results.realValue).toBeCloseTo(1351914, -2); // Inflation-adjusted
    expect(results.realValue).toBeLessThan(results.futureValue);
  });

  it('handles weekly frequency correctly', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'weekly',
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    // Weekly contributions: 10000 * 12 / 52 = ~2307.69 per week
    // Should have slightly higher FV due to more frequent compounding
    expect(results.futureValue).toBeGreaterThan(1730850);
    expect(results.totalContributions).toBeCloseTo(1200000, -2); // Same total
  });

  it('handles custom frequency correctly', () => {
    const inputs: SavingsInputs = {
      monthlyAmount: 10000,
      frequency: 'custom',
      customFrequency: 24, // Every 2 weeks (biweekly)
      years: 10,
      returnRate: 7,
      adjustForInflation: false,
      inflationRate: 2.5,
    };

    const results = calculateSavingsResults(inputs);

    // Should match biweekly results
    expect(results.totalContributions).toBeCloseTo(1200000, -2);
  });
});
```

**Requirements traced**:
- NS-1 (FV calculation)
- NS-2 (life energy calculations)
- NS-4 (frequency handling)
- NS-6 (inflation adjustment)
- Requirements Appendix (Examples 1-3)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ Function implements all calculations correctly
- ✅ All tests pass (9+ test cases)
- ✅ Matches hand-calculated examples from requirements
- ✅ Handles all edge cases (no wage, no expenses, 0%, custom frequency)
- ✅ Test coverage ≥ 95%

---

## Epic 3: Basic UI Components

**Markmið**: Útfæra input form og results summary

**Fylgiskjöl**: `design-automatic-savings-impact.md` (Sections 1.1-1.3)

### Verkefni 3.1: Búa til SavingsInputs component

**Objective**: Input form fyrir alla sparnað inputs

**Files to create**:
- `src/components/savings/SavingsInputs.tsx`

**Functionality**:
```typescript
'use client';

import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { SelectInput } from '@/components/ui/SelectInput';
import { Toggle } from '@/components/ui/Toggle';
import { FREQUENCY_OPTIONS, SAVINGS_RANGES } from '@/lib/constants/savings';
import type { SavingsInputs as SavingsInputsType, FrequencyKey } from '@/types/savings';

interface SavingsInputsProps {
  inputs: SavingsInputsType;
  onInputsChange: (inputs: Partial<SavingsInputsType>) => void;
}

export function SavingsInputs({ inputs, onInputsChange }: SavingsInputsProps) {
  return (
    <div className="space-y-6">
      {/* Monthly Amount */}
      <CurrencyInput
        label="Mánaðarleg upphæð"
        value={inputs.monthlyAmount}
        onChange={(value) => onInputsChange({ monthlyAmount: value })}
        min={SAVINGS_RANGES.monthlyAmount.min}
        max={SAVINGS_RANGES.monthlyAmount.max}
        step={SAVINGS_RANGES.monthlyAmount.step}
        helpText="Hversu mikið viltu spara sjálfvirkt?"
      />

      {/* Frequency */}
      <SelectInput
        label="Tíðni"
        value={inputs.frequency}
        onChange={(value) => onInputsChange({ frequency: value as FrequencyKey })}
        options={FREQUENCY_OPTIONS.map(f => ({ value: f.key, label: f.label }))}
        helpText="Hversu oft viltu spara?"
      />

      {/* Custom Frequency (conditional) */}
      {inputs.frequency === 'custom' && (
        <NumberInput
          label="Sérsniðin tíðni (sinnum á ári)"
          value={inputs.customFrequency ?? 12}
          onChange={(value) => onInputsChange({ customFrequency: value })}
          min={SAVINGS_RANGES.customFrequency.min}
          max={SAVINGS_RANGES.customFrequency.max}
          step={SAVINGS_RANGES.customFrequency.step}
          helpText="T.d. 26 fyrir launaseðil á tveggja vikna fresti"
        />
      )}

      {/* Years */}
      <NumberInput
        label="Tímabil (ár)"
        value={inputs.years}
        onChange={(value) => onInputsChange({ years: value })}
        min={SAVINGS_RANGES.years.min}
        max={SAVINGS_RANGES.years.max}
        step={SAVINGS_RANGES.years.step}
        helpText="Hversu lengi viltu spara?"
      />

      {/* Return Rate */}
      <NumberInput
        label="Væntanleg ávöxtun (%)"
        value={inputs.returnRate}
        onChange={(value) => onInputsChange({ returnRate: value })}
        min={SAVINGS_RANGES.returnRate.min}
        max={SAVINGS_RANGES.returnRate.max}
        step={SAVINGS_RANGES.returnRate.step}
        helpText="7% er raunhæf áætlun fyrir alþjóðlega hlutabréfavísitölu"
      />

      {/* Inflation Adjustment */}
      <div className="space-y-3">
        <Toggle
          label="Leiðrétta fyrir verðbólgu"
          checked={inputs.adjustForInflation}
          onChange={(checked) => onInputsChange({ adjustForInflation: checked })}
          helpText="Sýna raunverðmæti í núverandi krónum"
        />

        {inputs.adjustForInflation && (
          <NumberInput
            label="Verðbólguprósentas (%)"
            value={inputs.inflationRate}
            onChange={(value) => onInputsChange({ inflationRate: value })}
            min={SAVINGS_RANGES.inflationRate.min}
            max={SAVINGS_RANGES.inflationRate.max}
            step={SAVINGS_RANGES.inflationRate.step}
            helpText="2.5% er sögulegt meðaltal á Íslandi"
          />
        )}
      </div>
    </div>
  );
}
```

**Tests**: Manual testing (UI component)

**Requirements traced**:
- NS-1 (amount, years inputs)
- NS-4 (frequency selector)
- NS-6 (inflation toggle)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ All inputs render correctly
- ✅ Custom frequency shows only when frequency === 'custom'
- ✅ Inflation rate shows only when adjustForInflation === true
- ✅ All inputs use correct ranges from SAVINGS_RANGES
- ✅ Help text shown for each input
- ✅ Responsive layout (mobile-friendly)

---

### Verkefni 3.2: Búa til SavingsSummary component

**Objective**: Display calculation results í læsilegu summary

**Files to create**:
- `src/components/savings/SavingsSummary.tsx`

**Functionality**:
```typescript
'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { SavingsResults } from '@/types/savings';

interface SavingsSummaryProps {
  results: SavingsResults;
  actualHourlyWage?: number;
  years: number;
  monthlyAmount: number;
}

export function SavingsSummary({
  results,
  actualHourlyWage,
  years,
  monthlyAmount,
}: SavingsSummaryProps) {
  const hasLifeEnergy = results.lifeEnergyContributed !== undefined;

  // Generate key insight message
  const keyInsight = hasLifeEnergy && results.freedomMonths
    ? `Með því að sjálfvirka ${formatCurrency(monthlyAmount)} á mánuði muntu hafa ${formatNumber(results.freedomMonths, 1)} mánuði af frelsi eftir ${years} ár`
    : `Með því að sjálfvirka ${formatCurrency(monthlyAmount)} á mánuði muntu hafa ${formatCurrency(results.futureValue)} eftir ${years} ár`;

  return (
    <div className="space-y-4">
      {/* Future Value Card */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Framtíðarverðmæti eftir {years} ár
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(results.futureValue)}
              </p>
              {results.realValue && (
                <p className="text-sm text-neutral-600 mt-1">
                  Raunverðmæti (leiðrétt fyrir verðbólgu): {formatCurrency(results.realValue)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200">
              <div>
                <p className="text-sm text-neutral-600">Heildarinnborganir</p>
                <p className="text-lg font-semibold">{formatCurrency(results.totalContributions)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Heildarvöxtur</p>
                <p className="text-lg font-semibold text-success-600">
                  {formatCurrency(results.totalGrowth)} ({formatNumber(results.growthPercentage, 1)}%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Energy Card (conditional) */}
      {hasLifeEnergy ? (
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold">Lífsorka áhrif</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Klukkustundir settar inn</p>
                <p className="text-lg font-semibold">{formatNumber(results.lifeEnergyContributed!, 0)} klst</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Klukkustundir unnar óbeint</p>
                <p className="text-lg font-semibold text-success-600">
                  {formatNumber(results.lifeEnergyEarnedPassively!, 0)} klst
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-neutral-600">Heildar lífsorku verðmæti</p>
                <p className="text-xl font-bold text-primary-600">
                  {formatNumber(results.totalLifeEnergy!, 0)} klst
                </p>
              </div>
              {results.freedomMonths && (
                <div className="col-span-2 pt-3 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600">Frelsismánuðir</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatNumber(results.freedomMonths, 1)} mánuðir
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert variant="info">
          <p className="font-medium">Fylltu fyrst út Tímakaups reiknivélina til að sjá lífsorku áhrif</p>
          <p className="text-sm mt-1">
            Farðu á &quot;Raunverulegt Tímakaup&quot; flipann til að reikna út tímakaup þitt.
          </p>
        </Alert>
      )}

      {/* Key Insight */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="py-4">
          <p className="text-lg font-medium text-neutral-900">
            💡 {keyInsight}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Tests**: Manual testing + visual regression

**Requirements traced**:
- NS-1.2 (show FV, principal, growth, %)
- NS-2 (life energy metrics)
- NS-2.2 (key insight message)
- NS-2.4 (warning if no wage)
- NS-6.1 (show real value if inflation enabled)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ All values formatted correctly with ISK
- ✅ Life energy section shows only if actualHourlyWage provided
- ✅ Warning shows if no actualHourlyWage
- ✅ Key insight message dynamically generated
- ✅ Real value shows only if adjustForInflation enabled
- ✅ Responsive grid layout
- ✅ Proper color coding (primary, success)

---

### Verkefni 3.3: Búa til AutomaticSavingsCalculator main component

**Objective**: Main container fyrir savings calculator

**Files to create**:
- `src/components/savings/AutomaticSavingsCalculator.tsx`

**Functionality**:
```typescript
'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useCalculator } from '@/context/CalculatorContext';
import { SavingsInputs } from './SavingsInputs';
import { SavingsSummary } from './SavingsSummary';
import { calculateSavingsResults } from '@/lib/calculations/savings';
import { DEFAULT_SAVINGS_INPUTS } from '@/lib/constants/savings';
import type { SavingsInputs as SavingsInputsType } from '@/types/savings';

/**
 * Automatic Savings Impact Calculator
 *
 * Helps users visualize long-term impact of automatic savings
 * with compound interest and life energy context.
 */
export function AutomaticSavingsCalculator() {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  // State
  const [inputs, setInputs] = useState<SavingsInputsType>(DEFAULT_SAVINGS_INPUTS);

  // Handle input changes
  const handleInputsChange = (updates: Partial<SavingsInputsType>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  // Calculate results (memoized)
  const savingsResults = useMemo(() => {
    // For monthlyExpenses, we could get from CalculatorContext if available
    // For MVP, we'll omit it (freedomMonths will be undefined)
    return calculateSavingsResults(
      inputs,
      actualHourlyWage > 0 ? actualHourlyWage : undefined
    );
  }, [inputs, actualHourlyWage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="py-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sjálfvirk sparnaðaráhrif reiknivél
          </h2>
          <p className="text-neutral-700">
            Sjáðu hvernig sjálfvirkur sparnaður vex yfir tíma með krafti samsettrar ávöxtunar.
            Tengdu við þitt raunverulega tímakaup til að sjá lífsorku áhrif.
          </p>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold">Sparnaðar upplýsingar</h3>
        </CardHeader>
        <CardContent>
          <SavingsInputs inputs={inputs} onInputsChange={handleInputsChange} />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <SavingsSummary
        results={savingsResults}
        actualHourlyWage={actualHourlyWage > 0 ? actualHourlyWage : undefined}
        years={inputs.years}
        monthlyAmount={inputs.monthlyAmount}
      />

      {/* Show 10 & 20 year comparison (NS-1.3) */}
      {inputs.years !== 10 && inputs.years !== 20 && (
        <Card variant="outlined">
          <CardHeader>
            <h3 className="text-lg font-semibold">Samanburður: 10 ár vs 20 ár</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Eftir 10 ár</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    calculateSavingsResults({ ...inputs, years: 10 }, actualHourlyWage > 0 ? actualHourlyWage : undefined).futureValue
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Eftir 20 ár</p>
                <p className="text-lg font-semibold text-primary-600">
                  {formatCurrency(
                    calculateSavingsResults({ ...inputs, years: 20 }, actualHourlyWage > 0 ? actualHourlyWage : undefined).futureValue
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

**Tests**: Integration test (React Testing Library)

**Requirements traced**:
- NS-1 (main calculator)
- NS-1.3 (show 10 & 20 year comparison)
- NS-1.4 (real-time updates via useMemo)
- NS-2.3 (conditional life energy display)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ Component renders without errors
- ✅ Input changes update results immediately (< 50ms)
- ✅ useMemo prevents unnecessary recalculations
- ✅ actualHourlyWage from CalculatorContext
- ✅ 10 & 20 year comparison shows when years !== 10 and !== 20
- ✅ All sections responsive

---

## Epic 4: Advanced Features

**Markmið**: Bæta við charts, comparison mode, og educational content

**Fylgiskjöl**: `design-automatic-savings-impact.md` (Sections 1.4-1.6)

### Verkefni 4.1: Búa til SavingsChart component

**Objective**: Visualization með recharts

**Files to create**:
- `src/components/savings/SavingsChart.tsx`

**Functionality**:
```typescript
'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import type { SavingsResults } from '@/types/savings';

interface SavingsChartProps {
  results: SavingsResults;
  yearsToShow: number;
}

export function SavingsChart({ results, yearsToShow }: SavingsChartProps) {
  // Prepare data for chart
  const chartData = results.yearlyBreakdown.map(item => ({
    year: item.year,
    'Höfuðstóll': item.principal,
    'Vextir': item.growth,
    'Framtíðarverðmæti': item.futureValue,
    ...(item.realValue ? { 'Raunverðmæti': item.realValue } : {}),
  }));

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold">Vöxtur yfir tíma</h3>
      </CardHeader>
      <CardContent>
        {/* Stacked Area Chart */}
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Ár', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                label={{ value: 'ISK', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Ár ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Höfuðstóll"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Vextir"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart with Real Value (if inflation enabled) */}
        {results.yearlyBreakdown[0].realValue !== undefined && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Ár', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  label={{ value: 'ISK', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Ár ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Framtíðarverðmæti"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Raunverðmæti"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Tests**: Visual testing (manual)

**Requirements traced**:
- Requirements (visual representation)
- NS-6.1 (nominal vs real value chart)

**Estimated time**: 2.5 hours

**Acceptance criteria**:
- ✅ Stacked area chart shows principal vs growth
- ✅ Line chart shows nominal vs real (if inflation enabled)
- ✅ Charts responsive (mobile & desktop)
- ✅ Tooltip shows formatted currency
- ✅ Legend clear and accessible
- ✅ Colors accessible (contrast ≥ 4.5:1)
- ✅ Patterns in addition to colors (for colorblind users)

---

### Verkefni 4.2: Búa til ComparisonMode component

**Objective**: Side-by-side scenario comparison

**Files to create**:
- `src/components/savings/ComparisonMode.tsx`

**Functionality**:
```typescript
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SavingsInputs } from './SavingsInputs';
import { calculateSavingsResults } from '@/lib/calculations/savings';
import { SAVINGS_PRESETS } from '@/lib/constants/savings';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { SavingsInputs as SavingsInputsType } from '@/types/savings';

interface ComparisonModeProps {
  actualHourlyWage?: number;
}

export function ComparisonMode({ actualHourlyWage }: ComparisonModeProps) {
  const [scenario1, setScenario1] = useState<SavingsInputsType>(SAVINGS_PRESETS[1]); // 10k
  const [scenario2, setScenario2] = useState<SavingsInputsType>(SAVINGS_PRESETS[2]); // 25k

  const results1 = calculateSavingsResults(scenario1, actualHourlyWage);
  const results2 = calculateSavingsResults(scenario2, actualHourlyWage);

  const fvDiff = results2.futureValue - results1.futureValue;
  const freedomMonthsDiff = (results2.freedomMonths ?? 0) - (results1.freedomMonths ?? 0);
  const lifeEnergyDiff = (results2.lifeEnergyEarnedPassively ?? 0) - (results1.lifeEnergyEarnedPassively ?? 0);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Card variant="outlined">
        <CardHeader>
          <h3 className="text-lg font-semibold">Fljótlegar forstillingar</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SAVINGS_PRESETS.map(preset => (
              <div key={preset.id} className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScenario1({ ...preset })}
                >
                  S1: {preset.label}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScenario2({ ...preset })}
                >
                  S2: {preset.label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario 1 */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold">Aðstæður 1</h3>
          </CardHeader>
          <CardContent>
            <SavingsInputs inputs={scenario1} onInputsChange={(updates) => setScenario1(prev => ({ ...prev, ...updates }))} />
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">Framtíðarverðmæti</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(results1.futureValue)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Scenario 2 */}
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold">Aðstæður 2</h3>
          </CardHeader>
          <CardContent>
            <SavingsInputs inputs={scenario2} onInputsChange={(updates) => setScenario2(prev => ({ ...prev, ...updates }))} />
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">Framtíðarverðmæti</p>
              <p className="text-2xl font-bold text-success-600">{formatCurrency(results2.futureValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difference Highlights */}
      <Card className="bg-primary-50 border-primary-200">
        <CardHeader>
          <h3 className="text-lg font-semibold">Mismunur</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Framtíðarverðmæti</p>
              <p className="text-xl font-bold text-primary-600">
                +{formatCurrency(fvDiff)}
              </p>
            </div>
            {actualHourlyWage && (
              <>
                <div>
                  <p className="text-sm text-neutral-600">Frelsismánuðir</p>
                  <p className="text-xl font-bold text-primary-600">
                    +{formatNumber(freedomMonthsDiff, 1)} mánuðir
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Lífsorka unnin óbeint</p>
                  <p className="text-xl font-bold text-success-600">
                    +{formatNumber(lifeEnergyDiff, 0)} klst
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Tests**: Manual testing

**Requirements traced**:
- NS-3 (comparison mode)
- NS-3.1 (side-by-side scenarios)
- NS-3.3 (difference display)
- NS-3.4 (presets)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ Two scenarios editable independently
- ✅ Preset buttons apply to both scenarios
- ✅ Differences highlighted clearly
- ✅ Responsive (stack on mobile)
- ✅ Real-time updates

---

### Verkefni 4.3: Búa til EducationalContent component

**Objective**: Fræðsluefni um "Pay Yourself First" og compound interest

**Files to create**:
- `src/components/savings/EducationalContent.tsx`

**Functionality**:
```typescript
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function EducationalContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Pay Yourself First */}
      <Card variant="outlined">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">💰 Borgaðu þér fyrst</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('payYourselfFirst')}
            >
              {expandedSection === 'payYourselfFirst' ? 'Fela' : 'Lesa meira'}
            </Button>
          </div>
        </CardHeader>
        {expandedSection === 'payYourselfFirst' && (
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p>
                &quot;Pay Yourself First&quot; þýðir að setja peninga í sparnað ÁÐUR en þú borgar
                reikninga eða eyðir í annað. Sjálfvirkar millifærslur fjarlægja ákvörðunarþreytu -
                þú þarft ekki að &quot;muna eftir&quot; að spara.
              </p>
              <ul>
                <li>Settu upp sjálfvirka millifærslu daginn eftir launadag</li>
                <li>Byrjaðu smátt (jafnvel 1.000 kr/mán) og hækkaðu smám saman</li>
                <li>Meðhöndlaðu sparnað sem &quot;reikning sem þú getur ekki sleppt&quot;</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Compound Interest */}
      <Card variant="outlined">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">💪 Kraftur samsettrar ávöxtunar</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('compoundInterest')}
            >
              {expandedSection === 'compoundInterest' ? 'Fela' : 'Lesa meira'}
            </Button>
          </div>
        </CardHeader>
        {expandedSection === 'compoundInterest' && (
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p>
                Samsett ávöxtun þýðir að þú færð vexti af vöxtunum þínum. Eftir 20 ár geta
                vextir verið MEIRI en upphaflegar innborganir þínar!
              </p>
              <p className="font-medium">Dæmi:</p>
              <ul>
                <li>10.000 kr/mán í 10 ár = 1.730.850 kr (44% vextir)</li>
                <li>10.000 kr/mán í 20 ár = 5.238.880 kr (118% vextir!)</li>
                <li>Vextirnir tvöfaldast ef þú tvöfaldar tímann</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Start Small */}
      <Card className="bg-success-50 border-success-200">
        <CardHeader>
          <h3 className="text-lg font-semibold">🌱 Byrja smátt - Byrja núna</h3>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="font-medium">
              Betra að byrja með 1.000 kr á mánuði EN núna, en bíða eftir &quot;fullkominni upphæð&quot;.
            </p>
            <p className="text-sm">
              Jafnvel 1.000 kr/mán verður að 173.085 kr eftir 10 ár (með 7% ávöxtun).
              Tíminn er mikilvægasti þátturinn í samsettri ávöxtun.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Tests**: Manual testing (content/UI component)

**Requirements traced**:
- NS-5 (educational content)
- NS-5.1 (info boxes)
- NS-5.2 (encouragement)
- NS-5.3 ("Start small" message)

**Estimated time**: 1.5 hours

**Acceptance criteria**:
- ✅ Three educational sections
- ✅ Expandable/collapsible (to avoid clutter)
- ✅ Clear Icelandic content
- ✅ Examples with actual numbers
- ✅ Encourages starting small

---

## Epic 5: Integration & Persistence

**Markmið**: Integrera við CalculatorContext, localStorage, og export/import

**Fylgiskjöl**: `design-automatic-savings-impact.md` (Section 5)

### Verkefni 5.1: Tengja við CalculatorContext

**Objective**: Sækja actualHourlyWage from existing context

**Files to modify**:
- `src/components/savings/AutomaticSavingsCalculator.tsx` (already done in 3.3)

**Functionality**: Already implemented in Task 3.3

**Tests**: Integration test

**Requirements traced**:
- NS-2.3 (integration with Actual Hourly Wage Calculator)

**Estimated time**: 30 minutes (verification only)

**Acceptance criteria**:
- ✅ actualHourlyWage from CalculatorContext
- ✅ Graceful fallback if undefined
- ✅ Updates when CalculatorContext changes

---

### Verkefni 5.2: localStorage persistence

**Objective**: Vista og hlaða savings inputs

**Files to modify**:
- `src/components/savings/AutomaticSavingsCalculator.tsx`

**Functionality**:
Add localStorage save/load:
```typescript
'use client';

import { useState, useMemo, useEffect } from 'react';
import { STORAGE_KEY } from '@/lib/defaults';
import type { StoredState } from '@/types/calculator';

export function AutomaticSavingsCalculator() {
  // ... existing code ...

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StoredState = JSON.parse(stored);
      if (data.savingsInputs) {
        setInputs(data.savingsInputs);
      }
    }
  }, []);

  // Save to localStorage on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data: StoredState = stored ? JSON.parse(stored) : { version: 1, lastUpdated: new Date().toISOString() };

      data.savingsInputs = inputs;
      data.lastUpdated = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [inputs]);

  // ... rest of component ...
}
```

**Tests**: Integration test (localStorage mock)

**Requirements traced**:
- Non-functional (persistence)

**Estimated time**: 1 hour

**Acceptance criteria**:
- ✅ Inputs saved to localStorage on change
- ✅ Inputs loaded from localStorage on mount
- ✅ Debounced 300ms to avoid excessive writes
- ✅ Merged with existing StoredState (no overwrite)
- ✅ Version handling for future migrations

---

### Verkefni 5.3: Export/Import compatibility

**Objective**: Ensure savings data exported/imported með existing functionality

**Files to modify**:
- Verify existing export/import includes `savingsInputs`

**Functionality**:
The existing export/import should automatically include `savingsInputs` since it's part of `StoredState`.

**Tests**: Manual test (export → import)

**Requirements traced**:
- Non-functional (data portability)

**Estimated time**: 30 minutes (verification)

**Acceptance criteria**:
- ✅ savingsInputs included in export JSON
- ✅ savingsInputs restored on import
- ✅ No errors if savingsInputs missing (backward compatibility)

---

## Epic 6: Polish & Accessibility

**Markmið**: Aðgengi, responsive design, og final testing

**Fylgiskjöl**: `design-automatic-savings-impact.md` (Sections 7, 8)

### Verkefni 6.1: Keyboard navigation & ARIA

**Objective**: WCAG 2.1 AA compliance

**Files to modify**:
- All components in `src/components/savings/`

**Functionality**:
Add ARIA attributes and ensure keyboard navigation:
```typescript
// Example for SavingsSummary
<div role="region" aria-label="Sparnaðarniðurstöður">
  <Card>
    <CardHeader>
      <h3 id="fv-heading">Framtíðarverðmæti eftir {years} ár</h3>
    </CardHeader>
    <CardContent aria-labelledby="fv-heading">
      <p className="text-3xl font-bold" aria-label={`Framtíðarverðmæti: ${formatCurrency(results.futureValue)}`}>
        {formatCurrency(results.futureValue)}
      </p>
    </CardContent>
  </Card>
</div>

// Ensure all buttons have aria-label
<button
  aria-label="Lesa meira um borgaðu þér fyrst"
  onClick={() => toggleSection('payYourselfFirst')}
>
  {expandedSection === 'payYourselfFirst' ? 'Fela' : 'Lesa meira'}
</button>
```

**Tests**: Manual (keyboard + screen reader)

**Requirements traced**:
- Non-functional (accessibility WCAG 2.1 AA)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ Tab order logical (inputs → results → charts)
- ✅ All interactive elements keyboard accessible
- ✅ Focus indicators visible
- ✅ ARIA labels on all inputs and outputs
- ✅ Screen reader announces updates (aria-live for results)
- ✅ Color contrast ≥ 4.5:1

---

### Verkefni 6.2: Responsive design (mobile)

**Objective**: Mobile-friendly layout

**Files to modify**:
- All components (add responsive Tailwind classes)

**Functionality**:
```typescript
// Example: Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Stacks on mobile, side-by-side on tablet+ */}
</div>

// Example: Responsive text
<h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
  Sjálfvirk sparnaðaráhrif
</h2>

// Example: Responsive chart height
<div className="h-64 md:h-80 lg:h-96">
  <ResponsiveContainer width="100%" height="100%">
    {/* Chart */}
  </ResponsiveContainer>
</div>
```

**Tests**: Manual (test on mobile, tablet, desktop)

**Requirements traced**:
- Non-functional (mobile-friendly)

**Estimated time**: 1.5 hours

**Acceptance criteria**:
- ✅ All layouts stack properly on mobile
- ✅ Text readable on small screens
- ✅ Charts resize appropriately
- ✅ No horizontal scrolling
- ✅ Touch targets ≥ 44x44px
- ✅ Tested on iOS Safari, Android Chrome

---

### Verkefni 6.3: Input validation

**Objective**: Validate all inputs og show error messages

**Files to modify**:
- `src/components/savings/SavingsInputs.tsx`

**Functionality**:
Add validation:
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const handleAmountChange = (value: number) => {
  if (value < SAVINGS_RANGES.monthlyAmount.min) {
    setErrors(prev => ({ ...prev, monthlyAmount: 'Upphæð verður að vera hærri en 1.000 kr' }));
  } else if (value > SAVINGS_RANGES.monthlyAmount.max) {
    setErrors(prev => ({ ...prev, monthlyAmount: 'Upphæð of há' }));
  } else {
    setErrors(prev => {
      const { monthlyAmount, ...rest } = prev;
      return rest;
    });
  }

  onInputsChange({ monthlyAmount: value });
};

// Show error in UI
{errors.monthlyAmount && (
  <p className="text-sm text-error-600 mt-1">{errors.monthlyAmount}</p>
)}
```

**Tests**: Unit tests for validation logic

**Requirements traced**:
- NS-1.5 (input validation)

**Estimated time**: 1 hour

**Acceptance criteria**:
- ✅ All inputs validated against SAVINGS_RANGES
- ✅ Error messages shown in Icelandic
- ✅ Invalid inputs clamped to valid range
- ✅ Error messages clear and helpful

---

### Verkefni 6.4: Integration testing

**Objective**: End-to-end test með React Testing Library

**Files to create**:
- `src/components/savings/AutomaticSavingsCalculator.test.tsx`

**Functionality**:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AutomaticSavingsCalculator } from './AutomaticSavingsCalculator';
import { CalculatorContext } from '@/context/CalculatorContext';

describe('AutomaticSavingsCalculator', () => {
  it('renders without crashing', () => {
    render(<AutomaticSavingsCalculator />);
    expect(screen.getByText(/Sjálfvirk sparnaðaráhrif/i)).toBeInTheDocument();
  });

  it('updates results when amount changes', async () => {
    render(<AutomaticSavingsCalculator />);

    const amountInput = screen.getByLabelText(/Mánaðarleg upphæð/i);
    fireEvent.change(amountInput, { target: { value: '25000' } });

    await waitFor(() => {
      // Should show updated FV
      expect(screen.getByText(/4\.327\.125 kr/i)).toBeInTheDocument();
    });
  });

  it('shows life energy when actualHourlyWage available', () => {
    const mockResults = {
      actualHourlyWage: 2000,
      // ... other results
    };

    render(
      <CalculatorContext.Provider value={{ results: mockResults }}>
        <AutomaticSavingsCalculator />
      </CalculatorContext.Provider>
    );

    expect(screen.getByText(/Lífsorka áhrif/i)).toBeInTheDocument();
  });

  it('shows warning when no actualHourlyWage', () => {
    const mockResults = {
      actualHourlyWage: 0,
    };

    render(
      <CalculatorContext.Provider value={{ results: mockResults }}>
        <AutomaticSavingsCalculator />
      </CalculatorContext.Provider>
    );

    expect(screen.getByText(/Fylltu fyrst út Tímakaups reiknivélina/i)).toBeInTheDocument();
  });
});
```

**Tests**: Comprehensive test suite

**Requirements traced**:
- All user stories (integration test)

**Estimated time**: 2 hours

**Acceptance criteria**:
- ✅ 10+ test cases covering main flows
- ✅ All tests pass
- ✅ Test coverage ≥ 80% for components
- ✅ Mock CalculatorContext properly

---

### Verkefni 6.5: Performance optimization

**Objective**: Ensure < 50ms calculation time

**Files to modify**:
- `src/lib/calculations/savings.ts` (add performance logging if needed)

**Functionality**:
Add performance measurement in development:
```typescript
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage?: number,
  monthlyExpenses?: number
): SavingsResults {
  const startTime = performance.now();

  // ... calculation logic ...

  const endTime = performance.now();
  if (process.env.NODE_ENV === 'development') {
    console.log(`Savings calculation took ${endTime - startTime}ms`);
  }

  return results;
}
```

**Tests**: Performance test

**Requirements traced**:
- Non-functional (performance < 50ms)

**Estimated time**: 30 minutes

**Acceptance criteria**:
- ✅ Calculation time < 50ms (measured)
- ✅ No unnecessary re-renders (verified with React DevTools)
- ✅ Charts render < 200ms

---

### Verkefni 6.6: Final manual testing

**Objective**: End-to-end manual test með checklist

**Files**: N/A (testing)

**Functionality**: Test all acceptance criteria from requirements

**Testing checklist**:
```
INPUTS:
- [ ] Amount slider works (1000 - 10M)
- [ ] Frequency dropdown works (4 options)
- [ ] Custom frequency shows when "Sérsniðin" selected
- [ ] Years slider works (1 - 50)
- [ ] Return rate input works (0 - 20%)
- [ ] Inflation toggle works
- [ ] Inflation rate shows when enabled

CALCULATIONS:
- [ ] FV correct for 10k/month, 7%, 10 years (~1.73M)
- [ ] FV correct for 25k/month, 7%, 20 years (~13.1M)
- [ ] Life energy shown when wage available
- [ ] Life energy hidden when no wage
- [ ] Inflation adjustment correct
- [ ] Weekly frequency higher FV than monthly

COMPARISON MODE:
- [ ] Two scenarios editable
- [ ] Presets apply correctly
- [ ] Differences calculated correctly

CHARTS:
- [ ] Stacked area chart shows principal vs growth
- [ ] Line chart shows nominal vs real (if inflation)
- [ ] Tooltips formatted correctly
- [ ] Responsive on mobile

EDUCATIONAL:
- [ ] Three sections expandable
- [ ] Content clear and helpful

ACCESSIBILITY:
- [ ] Keyboard navigation works
- [ ] Screen reader announces results
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

PERSISTENCE:
- [ ] Inputs saved to localStorage
- [ ] Inputs loaded on refresh
- [ ] Export includes savings data
- [ ] Import restores savings data

MOBILE:
- [ ] Layouts stack on mobile
- [ ] Charts readable on mobile
- [ ] Touch targets large enough
- [ ] No horizontal scroll
```

**Estimated time**: 1.5 hours

**Acceptance criteria**:
- ✅ All checklist items pass
- ✅ No critical bugs found
- ✅ Cross-browser tested (Chrome, Firefox, Safari)
- ✅ Mobile tested (iOS, Android)

---

## Samantekt & Næstu Skref

### Verkefni Samantekt

| Epic | Verkefni | Heildar tími |
|------|----------|--------------|
| E1 | Foundation (3 tasks) | 1.25 klst |
| E2 | Calculations (3 tasks) | 3.75 klst |
| E3 | Basic UI (3 tasks) | 6 klst |
| E4 | Advanced (3 tasks) | 6 klst |
| E5 | Integration (3 tasks) | 2 klst |
| E6 | Polish (6 tasks) | 8.5 klst |
| **TOTAL** | **21 tasks** | **27.5 klst** |

### Framkvæmdarröð (Recommended)

**Dagur 1** (8 klst):
- E1.1: Types (30 min)
- E1.2: Constants (30 min)
- E1.3: StoredState (15 min)
- E2.1: calculateFutureValue (1 klst)
- E2.2: calculateYearlyBreakdown (45 min)
- E2.3: calculateSavingsResults (2 klst)
- E3.1: SavingsInputs (2 klst)

**Dagur 2** (8 klst):
- E3.2: SavingsSummary (2 klst)
- E3.3: AutomaticSavingsCalculator (2 klst)
- E4.1: SavingsChart (2.5 klst)
- E5.1: CalculatorContext integration (30 min)
- E5.2: localStorage (1 klst)

**Dagur 3** (8 klst):
- E4.2: ComparisonMode (2 klst)
- E4.3: EducationalContent (1.5 klst)
- E6.1: Accessibility (2 klst)
- E6.2: Responsive design (1.5 klst)
- E6.3: Validation (1 klst)

**Dagur 4** (3.5 klst):
- E5.3: Export/Import (30 min)
- E6.4: Integration tests (2 klst)
- E6.5: Performance (30 min)
- E6.6: Final testing (1.5 klst)

### Afhending (Deliverables)

Að verkefni loknu ættu eftirfarandi skrár að vera til:

**TypeScript Types**:
- `src/types/savings.ts`

**Constants**:
- `src/lib/constants/savings.ts`

**Calculation Logic**:
- `src/lib/calculations/savings.ts`
- `src/lib/calculations/savings.test.ts`

**Components**:
- `src/components/savings/AutomaticSavingsCalculator.tsx`
- `src/components/savings/SavingsInputs.tsx`
- `src/components/savings/SavingsSummary.tsx`
- `src/components/savings/SavingsChart.tsx`
- `src/components/savings/ComparisonMode.tsx`
- `src/components/savings/EducationalContent.tsx`
- `src/components/savings/index.ts`

**Tests**:
- `src/lib/calculations/savings.test.ts` (unit tests)
- `src/components/savings/AutomaticSavingsCalculator.test.tsx` (integration tests)

### Acceptance Criteria for Complete Feature

Feature telst fullbúinn þegar:

- ✅ Allar 21 tasks lokið
- ✅ Allar tests pass (unit + integration)
- ✅ Test coverage ≥ 80%
- ✅ Allar 6 notendafrásagnir uppfylltar með EARS viðmiðum
- ✅ WCAG 2.1 AA samræmi staðfest
- ✅ Responsive á mobile og desktop
- ✅ Performance < 50ms fyrir útreikninga
- ✅ localStorage persistence virkar
- ✅ Export/import compatibility staðfest
- ✅ Manual testing checklist 100% pass

### Næstu Skref Eftir MVP

Eftirfarandi er **utan gildissviðs** fyrir MVP en getur bæst við seinna:
1. Goal-based calculator ("Hvenær næ ég X?")
2. FI Number integration
3. Scenario modeling (optimistic/pessimistic)
4. Tax advantages for lífeyrissjóður
5. "What if" increment strategies

---

**Tilvísanir**:
- Requirements: `specs/automatic-savings-impact/requirements-automatic-savings-impact.md`
- Design: `specs/automatic-savings-impact/design-automatic-savings-impact.md`
