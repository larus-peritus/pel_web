# Tasks: Compound Savings Life Energy Calculator

## Document Information

- **Feature Name**: Compound Savings Life Energy Calculator
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec Orchestrator
- **App**: peninganaedalifid (Icelandic FIRE Calculator)
- **Feature ID**: 2.2.3
- **Requirements Document**: [requirements-compound-savings-life-energy.md](requirements-compound-savings-life-energy.md)
- **Design Document**: [design-compound-savings-life-energy.md](design-compound-savings-life-energy.md)

## Implementation Strategy

**Strategy**: Foundation-First with Feature Slices

**Rationale**:
1. Build calculation engine first (foundation)
2. Add CalculatorContext integration (foundation)
3. Build UI components incrementally (feature slices)
4. Each slice delivers working functionality
5. Enable incremental testing and validation

**Estimated Total Time**: 12-14 hours

## Task Hierarchy

### Epic 1: Foundation - Types, Constants, and Calculations
**Goal**: Establish data model and calculation engine
**Time**: 3-4 hours

- Task 1.1: Define TypeScript types and interfaces
- Task 1.2: Create constants and presets
- Task 1.3: Implement core calculation functions
- Task 1.4: Write calculation unit tests

### Epic 2: CalculatorContext Integration
**Goal**: Integrate savings feature into global state management
**Time**: 2-3 hours

- Task 2.1: Extend CalculatorContext with savings state
- Task 2.2: Implement CRUD operations for scenarios
- Task 2.3: Add localStorage persistence
- Task 2.4: Add auto-recalculation on wage change
- Task 2.5: Write context integration tests

### Epic 3: Core UI Components
**Goal**: Build primary user interface components
**Time**: 4-5 hours

- Task 3.1: Create SavingsInputForm component
- Task 3.2: Create SavingsResultsDisplay component
- Task 3.3: Create MissingWagePrompt component
- Task 3.4: Create main CompoundSavingsCalculator component
- Task 3.5: Write component unit tests

### Epic 4: Visualization and Scenarios
**Goal**: Add visualization and scenario management
**Time**: 2-3 hours

- Task 4.1: Create CompoundGrowthVisualization component
- Task 4.2: Create ScenarioManager component
- Task 4.3: Create SaveScenarioDialog component
- Task 4.4: Write visualization and scenario tests

### Epic 5: Integration and Polish
**Goal**: Integrate with app, add accessibility, and polish UX
**Time**: 1-2 hours

- Task 5.1: Add savings tab to navigation
- Task 5.2: Implement accessibility features
- Task 5.3: Add Icelandic translations and tooltips
- Task 5.4: Write E2E integration tests
- Task 5.5: Manual testing and bug fixes

---

## Epic 1: Foundation - Types, Constants, and Calculations

### Task 1.1: Define TypeScript types and interfaces

**Objective**: Create all TypeScript type definitions for the savings calculator feature

**Files to Modify**:
- `src/types/calculator.ts`

**Functionality**:
- Add `SavingsInputs` interface
- Add `SavingsResults` interface
- Add `YearlySavingsData` interface
- Add `SavingsScenario` interface
- Add `SavingsPreset` interface
- Update `StoredState` interface to include `savingsScenarios?` field
- Update `CalculatorContextType` interface with savings methods (placeholder - will implement in Epic 2)

**Acceptance Criteria**:
- [ ] All savings types defined with JSDoc comments
- [ ] Types export correctly from `calculator.ts`
- [ ] No TypeScript errors in type definitions
- [ ] All fields have appropriate types (no `any`)

**Tests**:
- Type checking passes (`npm run type-check`)

**Requirements Traceability**: REQ-1, REQ-2, REQ-3, REQ-6

**Estimated Time**: 45 minutes

**Code Outline**:
```typescript
// Add to src/types/calculator.ts

/**
 * Compound savings calculator inputs
 */
export interface SavingsInputs {
  monthlySavings: number; // ISK per month (1,000 - 1,000,000)
  annualInterestRate: number; // Percentage (0.00 - 20.00)
  timeHorizonYears: number; // Years (1 - 50)
}

/**
 * Compound savings calculation results
 */
export interface SavingsResults {
  futureValue: number;
  totalContributions: number;
  totalInterestEarned: number;
  futureValueLifeEnergy: number; // Hours
  interestEarnedLifeEnergy: number; // Hours
  yearlyBreakdown: YearlySavingsData[];
}

/**
 * Year-by-year savings data for visualization
 */
export interface YearlySavingsData {
  year: number;
  totalValue: number;
  totalContributions: number;
  yearlyInterest: number;
  lifeEnergyHours: number;
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

/**
 * Icelandic savings presets
 */
export interface SavingsPreset {
  id: 'verdtryggt' | 'venjulegur' | 'havaxtasparnadur';
  label: string;
  rate: number;
  description: string;
}

// Update StoredState
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
  carOwnershipScenarios?: import('./car-ownership').CarOwnershipScenario[];
  childcareItems?: import('./childcare').ChildcareItem[];
  savingsScenarios?: SavingsScenario[]; // NEW
  lastUpdated: string;
}
```

---

### Task 1.2: Create constants and presets

**Objective**: Define all constants and Icelandic savings presets

**Files to Create**:
- `src/lib/constants/savings.ts`

**Functionality**:
- Define `SAVINGS_LIMITS` constant (min/max values)
- Define `ICELANDIC_SAVINGS_PRESETS` array
- Define `DEFAULT_SAVINGS_INPUTS` constant
- Export all constants

**Acceptance Criteria**:
- [ ] All limits defined with appropriate values
- [ ] Three Icelandic presets defined (verðtryggt, venjulegur, hávaxtasparnaður)
- [ ] Default inputs use realistic values
- [ ] All constants properly typed and exported

**Tests**:
- Import constants in test file and verify values
- Type checking passes

**Requirements Traceability**: REQ-1, REQ-5

**Estimated Time**: 30 minutes

**Code Template**:
```typescript
// src/lib/constants/savings.ts

import type { SavingsPreset, SavingsInputs } from '@/types/calculator';

/**
 * Savings calculator limits
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

/**
 * Icelandic savings account presets
 */
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

/**
 * Default savings inputs
 */
export const DEFAULT_SAVINGS_INPUTS: SavingsInputs = {
  monthlySavings: 50_000,
  annualInterestRate: 3.0,
  timeHorizonYears: 10,
};
```

---

### Task 1.3: Implement core calculation functions

**Objective**: Implement compound interest calculations and validation

**Files to Create**:
- `src/lib/calculations/savings.ts`

**Functionality**:
- Implement `calculateSavingsResults(inputs, actualHourlyWage)` function
- Implement `generateYearlyBreakdown()` helper function
- Implement `validateSavingsInputs(inputs)` function
- Implement `generateSavingsId()` function
- Add error handling for edge cases (zero interest, overflow, etc.)
- Add JSDoc comments with examples

**Acceptance Criteria**:
- [ ] `calculateSavingsResults` returns correct future value (within 1 ISK)
- [ ] Zero interest rate handled correctly (simple sum)
- [ ] Life energy conversion correct when wage provided
- [ ] Life energy returns 0 when wage is 0
- [ ] Yearly breakdown has correct number of entries
- [ ] Validation catches all invalid inputs
- [ ] Function handles edge cases gracefully

**Tests**:
- Unit tests in Task 1.4

**Requirements Traceability**: REQ-2, REQ-3

**Estimated Time**: 2 hours

**Code Template**:
```typescript
// src/lib/calculations/savings.ts

import type {
  SavingsInputs,
  SavingsResults,
  YearlySavingsData,
  ValidationResult
} from '@/types/calculator';
import { SAVINGS_LIMITS } from '@/lib/constants/savings';
import { formatCurrency } from '@/lib/utils/formatters';

/**
 * Calculate compound savings results
 *
 * Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
 *
 * @param inputs - Savings scenario inputs
 * @param actualHourlyWage - User's actual hourly wage for life energy conversion
 * @returns Complete savings calculation results
 *
 * @example
 * const result = calculateSavingsResults({
 *   monthlySavings: 50000,
 *   annualInterestRate: 3.0,
 *   timeHorizonYears: 10
 * }, 5000);
 * // Returns: { futureValue: 6995533, totalContributions: 6000000, ... }
 */
export function calculateSavingsResults(
  inputs: SavingsInputs,
  actualHourlyWage: number
): SavingsResults {
  try {
    const { monthlySavings, annualInterestRate, timeHorizonYears } = inputs;

    const monthlyRate = annualInterestRate / 100 / 12;
    const totalMonths = timeHorizonYears * 12;
    const totalContributions = monthlySavings * totalMonths;

    let futureValue: number;

    if (monthlyRate === 0) {
      // No interest: simple sum
      futureValue = totalContributions;
    } else {
      // Compound interest formula (annuity due)
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
  } catch (error) {
    console.error('Savings calculation error:', error);
    // Return safe fallback
    const totalContributions = inputs.monthlySavings * inputs.timeHorizonYears * 12;
    return {
      futureValue: totalContributions,
      totalContributions,
      totalInterestEarned: 0,
      futureValueLifeEnergy: 0,
      interestEarnedLifeEnergy: 0,
      yearlyBreakdown: [],
    };
  }
}

/**
 * Generate year-by-year breakdown for visualization
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

/**
 * Generate unique ID for savings scenario
 */
export function generateSavingsId(): string {
  return `savings-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

### Task 1.4: Write calculation unit tests

**Objective**: Comprehensive unit tests for all calculation functions

**Files to Create**:
- `src/lib/calculations/savings.test.ts`

**Functionality**:
- Test `calculateSavingsResults` with various inputs
- Test zero interest rate case
- Test life energy conversion
- Test yearly breakdown generation
- Test input validation
- Test edge cases (very large values, very long time horizons)

**Acceptance Criteria**:
- [ ] All calculation tests pass
- [ ] Test coverage > 90% for savings.ts
- [ ] Edge cases covered (0 interest, 0 wage, max values)
- [ ] Validation tests cover all error cases

**Tests**:
- Run test suite: `npm test savings.test.ts`

**Requirements Traceability**: REQ-2, REQ-3

**Estimated Time**: 1 hour

**Code Template**:
```typescript
// src/lib/calculations/savings.test.ts

import { describe, it, expect } from 'vitest';
import {
  calculateSavingsResults,
  validateSavingsInputs,
  generateSavingsId
} from './savings';

describe('calculateSavingsResults', () => {
  it('calculates future value with compound interest correctly', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    }, 5000);

    expect(result.futureValue).toBeCloseTo(6995533, 0);
    expect(result.totalContributions).toBe(6000000);
    expect(result.totalInterestEarned).toBeCloseTo(995533, 0);
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

    expect(result.futureValueLifeEnergy).toBeCloseTo(6995533 / 5000, 1);
    expect(result.interestEarnedLifeEnergy).toBeCloseTo(995533 / 5000, 1);
  });

  it('returns 0 life energy when wage is 0', () => {
    const result = calculateSavingsResults({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    }, 0);

    expect(result.futureValueLifeEnergy).toBe(0);
    expect(result.interestEarnedLifeEnergy).toBe(0);
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

  it('handles very long time horizons', () => {
    const result = calculateSavingsResults({
      monthlySavings: 10000,
      annualInterestRate: 5.0,
      timeHorizonYears: 50,
    }, 5000);

    expect(result.futureValue).toBeGreaterThan(0);
    expect(result.yearlyBreakdown).toHaveLength(50);
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

  it('rejects monthlySavings below minimum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 500,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlySavings).toBeDefined();
  });

  it('rejects monthlySavings above maximum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 2000000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.monthlySavings).toBeDefined();
  });

  it('rejects negative interest rate', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: -1,
      timeHorizonYears: 10,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.annualInterestRate).toBeDefined();
  });

  it('rejects time horizon below minimum', () => {
    const result = validateSavingsInputs({
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 0,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.timeHorizonYears).toBeDefined();
  });
});

describe('generateSavingsId', () => {
  it('generates unique IDs', () => {
    const id1 = generateSavingsId();
    const id2 = generateSavingsId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^savings-\d+-[a-z0-9]+$/);
  });
});
```

---

## Epic 2: CalculatorContext Integration

### Task 2.1: Extend CalculatorContext with savings state

**Objective**: Add savings state and type definitions to CalculatorContext

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
- Add `savingsScenarios` state to `CalculatorProvider`
- Update `CalculatorContextType` interface with savings methods
- Initialize `savingsScenarios` as empty array
- Export types properly

**Acceptance Criteria**:
- [ ] `savingsScenarios` state initialized
- [ ] Context type includes all savings methods (placeholder implementations OK)
- [ ] No TypeScript errors
- [ ] Context compiles without breaking existing functionality

**Tests**:
- Existing tests still pass
- Type checking passes

**Requirements Traceability**: REQ-6, REQ-7

**Estimated Time**: 30 minutes

**Code Changes**:
```typescript
// In src/context/CalculatorContext.tsx

// Add import
import type { SavingsScenario } from '@/types/calculator';
import { calculateSavingsResults, generateSavingsId } from '@/lib/calculations/savings';

// Update CalculatorContextType interface
interface CalculatorContextType {
  // ... existing fields ...

  // Compound Savings Calculator
  savingsScenarios: SavingsScenario[];
  addSavingsScenario: (scenario: Omit<SavingsScenario, 'id' | 'results'>) => void;
  updateSavingsScenario: (
    id: string,
    updates: Partial<Omit<SavingsScenario, 'id' | 'results'>>
  ) => void;
  deleteSavingsScenario: (id: string) => void;
  duplicateSavingsScenario: (id: string) => void;
}

// Add state in CalculatorProvider
const [savingsScenarios, setSavingsScenarios] = useState<SavingsScenario[]>([]);
```

---

### Task 2.2: Implement CRUD operations for scenarios

**Objective**: Implement add, update, delete, and duplicate operations

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
- Implement `addSavingsScenario` with 3-scenario limit check
- Implement `updateSavingsScenario` with recalculation
- Implement `deleteSavingsScenario`
- Implement `duplicateSavingsScenario` with limit check
- Add error handling for limit exceeded

**Acceptance Criteria**:
- [ ] `addSavingsScenario` creates scenario with calculated results
- [ ] Maximum 3 scenarios enforced with Icelandic error message
- [ ] `updateSavingsScenario` recalculates results
- [ ] `deleteSavingsScenario` removes scenario
- [ ] `duplicateSavingsScenario` creates copy with " (afrit)" suffix

**Tests**:
- Context integration tests in Task 2.5

**Requirements Traceability**: REQ-6

**Estimated Time**: 1.5 hours

**Code Template**:
```typescript
// Add to CalculatorProvider

const addSavingsScenario = useCallback(
  (scenario: Omit<SavingsScenario, 'id' | 'results'>) => {
    if (savingsScenarios.length >= 3) {
      console.warn('Maximum 3 savings scenarios allowed');
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
    if (!scenario) {
      console.warn('Scenario not found:', id);
      return;
    }

    if (savingsScenarios.length >= 3) {
      console.warn('Maximum 3 savings scenarios allowed');
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
```

---

### Task 2.3: Add localStorage persistence

**Objective**: Save and load savings scenarios from localStorage

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
- Add `savingsScenarios` to load from localStorage on mount
- Add `savingsScenarios` to auto-save useEffect
- Add `savingsScenarios` to exportData function
- Add `savingsScenarios` to importData function
- Add `savingsScenarios` to resetAll function

**Acceptance Criteria**:
- [ ] Scenarios load from localStorage on mount
- [ ] Scenarios auto-save after 500ms debounce
- [ ] Scenarios included in export JSON
- [ ] Scenarios restored from import JSON
- [ ] Scenarios cleared on resetAll

**Tests**:
- Context integration tests in Task 2.5

**Requirements Traceability**: REQ-7

**Estimated Time**: 45 minutes

**Code Changes**:
```typescript
// Load from localStorage on mount
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
}, [
  /* ... existing deps ...*/,
  savingsScenarios,
  isHydrated
]);

// Export
const exportDataHandler = useCallback(() => {
  const state: StoredState = {
    // ... existing fields ...
    savingsScenarios,
    lastUpdated: new Date().toISOString(),
  };
  // ... rest of export logic
}, [/* ... existing deps ...*/, savingsScenarios]);

// Import
const importDataHandler = useCallback(async (file: File) => {
  // ... existing import logic ...
  setSavingsScenarios(data.savingsScenarios || []);
  // ...
}, []);

// Reset
const resetAll = useCallback(() => {
  // ... existing resets ...
  setSavingsScenarios([]);
}, []);
```

---

### Task 2.4: Add auto-recalculation on wage change

**Objective**: Automatically recalculate all savings scenarios when actualHourlyWage changes

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
- Add useEffect that watches `results?.actualHourlyWage`
- Recalculate all scenarios when wage changes
- Only run after hydration complete
- Update `updatedAt` timestamp

**Acceptance Criteria**:
- [ ] useEffect triggers when actualHourlyWage changes
- [ ] All scenarios recalculated with new wage
- [ ] Recalculation only runs after hydration
- [ ] No infinite loops or performance issues

**Tests**:
- Context integration tests in Task 2.5

**Requirements Traceability**: REQ-8

**Estimated Time**: 30 minutes

**Code Template**:
```typescript
// Auto-recalculate savings results when actualHourlyWage changes
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
```

---

### Task 2.5: Write context integration tests

**Objective**: Test CalculatorContext savings functionality

**Files to Create**:
- `tests/context/CalculatorContext.savings.test.tsx`

**Functionality**:
- Test adding scenarios
- Test scenario limit enforcement
- Test updating scenarios
- Test deleting scenarios
- Test duplicating scenarios
- Test auto-recalculation on wage change
- Test localStorage persistence

**Acceptance Criteria**:
- [ ] All context tests pass
- [ ] Scenario limit enforced correctly
- [ ] CRUD operations work correctly
- [ ] Auto-recalculation tested
- [ ] localStorage integration tested

**Tests**:
- Run test suite: `npm test CalculatorContext.savings.test.tsx`

**Requirements Traceability**: REQ-6, REQ-7, REQ-8

**Estimated Time**: 1 hour

**Code Template**:
```typescript
// tests/context/CalculatorContext.savings.test.tsx

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import type { SavingsInputs } from '@/types/calculator';

describe('CalculatorContext - Savings', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CalculatorProvider>{children}</CalculatorProvider>
  );

  const testScenario: Omit<SavingsScenario, 'id' | 'results'> = {
    name: 'Test Savings',
    inputs: {
      monthlySavings: 50000,
      annualInterestRate: 3.0,
      timeHorizonYears: 10,
    },
  };

  it('adds savings scenario', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.addSavingsScenario(testScenario);
    });

    expect(result.current.savingsScenarios).toHaveLength(1);
    expect(result.current.savingsScenarios[0].name).toBe('Test Savings');
    expect(result.current.savingsScenarios[0].results.futureValue).toBeGreaterThan(0);
  });

  it('enforces max 3 scenarios', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.addSavingsScenario(testScenario);
      result.current.addSavingsScenario({ ...testScenario, name: 'Scenario 2' });
      result.current.addSavingsScenario({ ...testScenario, name: 'Scenario 3' });
    });

    expect(result.current.savingsScenarios).toHaveLength(3);

    expect(() => {
      act(() => {
        result.current.addSavingsScenario({ ...testScenario, name: 'Scenario 4' });
      });
    }).toThrow();
  });

  it('updates scenario', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    let scenarioId: string;
    act(() => {
      result.current.addSavingsScenario(testScenario);
      scenarioId = result.current.savingsScenarios[0].id;
    });

    act(() => {
      result.current.updateSavingsScenario(scenarioId!, {
        name: 'Updated Name',
      });
    });

    expect(result.current.savingsScenarios[0].name).toBe('Updated Name');
  });

  it('deletes scenario', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    let scenarioId: string;
    act(() => {
      result.current.addSavingsScenario(testScenario);
      scenarioId = result.current.savingsScenarios[0].id;
    });

    act(() => {
      result.current.deleteSavingsScenario(scenarioId!);
    });

    expect(result.current.savingsScenarios).toHaveLength(0);
  });

  it('duplicates scenario', () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    let scenarioId: string;
    act(() => {
      result.current.addSavingsScenario(testScenario);
      scenarioId = result.current.savingsScenarios[0].id;
    });

    act(() => {
      result.current.duplicateSavingsScenario(scenarioId!);
    });

    expect(result.current.savingsScenarios).toHaveLength(2);
    expect(result.current.savingsScenarios[1].name).toBe('Test Savings (afrit)');
  });

  // More tests for auto-recalculation, localStorage, etc.
});
```

---

## Epic 3: Core UI Components

### Task 3.1: Create SavingsInputForm component

**Objective**: Build input form for savings scenario configuration

**Files to Create**:
- `src/components/savings/SavingsInputForm.tsx`

**Functionality**:
- Render CurrencyInput for monthly savings
- Render NumberInput for interest rate
- Render preset buttons for Icelandic savings types
- Render NumberInput + Slider for time horizon
- Real-time validation with error display
- Responsive layout (stack on mobile, grid on desktop)
- Tooltips on presets

**Acceptance Criteria**:
- [ ] All inputs render correctly
- [ ] Preset buttons populate interest rate
- [ ] Active preset highlighted
- [ ] Validation errors display inline
- [ ] Mobile responsive (stacks vertically)
- [ ] Keyboard accessible

**Tests**:
- Component tests in Task 3.5

**Requirements Traceability**: REQ-1, REQ-5

**Estimated Time**: 1.5 hours

**Code Template**:
```typescript
// src/components/savings/SavingsInputForm.tsx

'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { SAVINGS_LIMITS, ICELANDIC_SAVINGS_PRESETS } from '@/lib/constants/savings';
import { validateSavingsInputs } from '@/lib/calculations/savings';
import type { SavingsInputs } from '@/types/calculator';
import { cn } from '@/lib/utils';

interface SavingsInputFormProps {
  inputs: SavingsInputs;
  onChange: (inputs: SavingsInputs) => void;
  className?: string;
}

export function SavingsInputForm({ inputs, onChange, className }: SavingsInputFormProps) {
  const validationResult = validateSavingsInputs(inputs);

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          Sparnaðaráætlun
        </h3>
        <p className="text-sm text-neutral-600">
          Stilltu mánaðarlegan sparnað, vexti og tímabil
        </p>
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
            error={validationResult.errors.monthlySavings}
            aria-invalid={!!validationResult.errors.monthlySavings}
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
              error={validationResult.errors.annualInterestRate}
              aria-invalid={!!validationResult.errors.annualInterestRate}
            />
            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {ICELANDIC_SAVINGS_PRESETS.map((preset) => (
                <Tooltip key={preset.id} content={preset.description}>
                  <Button
                    variant={inputs.annualInterestRate === preset.rate ? 'primary' : 'secondary'}
                    onClick={() => onChange({ ...inputs, annualInterestRate: preset.rate })}
                    size="sm"
                    type="button"
                  >
                    {preset.label}
                  </Button>
                </Tooltip>
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
              error={validationResult.errors.timeHorizonYears}
              aria-invalid={!!validationResult.errors.timeHorizonYears}
            />
            {/* Optional slider for visual selection */}
            <Slider
              value={inputs.timeHorizonYears}
              onChange={(val) => onChange({ ...inputs, timeHorizonYears: val })}
              min={SAVINGS_LIMITS.MIN_TIME_HORIZON}
              max={SAVINGS_LIMITS.MAX_TIME_HORIZON}
              step={1}
              className="mt-2"
              aria-label="Tímabil í árum"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Task 3.2: Create SavingsResultsDisplay component

**Objective**: Display calculation results in three cards (future value, interest, contributions)

**Files to Create**:
- `src/components/savings/SavingsResultsDisplay.tsx`

**Functionality**:
- Three Card components: Future Value, Interest Earned, Total Contributions
- Display ISK amounts prominently
- Display life energy (hours) when wage available
- Highlight interest earned life energy with success badge
- Show current wage used for calculation
- Responsive grid layout

**Acceptance Criteria**:
- [ ] Three cards render with correct data
- [ ] ISK amounts formatted with Icelandic separators
- [ ] Life energy formatted using formatLifeEnergy()
- [ ] Interest earned highlighted with success color
- [ ] Current wage displayed at bottom
- [ ] Mobile responsive (stacks vertically)

**Tests**:
- Component tests in Task 3.5

**Requirements Traceability**: REQ-2, REQ-3

**Estimated Time**: 1 hour

**Code Template** (see design document, section 5.3 for full code)

---

### Task 3.3: Create MissingWagePrompt component

**Objective**: Display informational alert when actualHourlyWage is not available

**Files to Create**:
- `src/components/savings/MissingWagePrompt.tsx`

**Functionality**:
- Render Alert component with info variant
- Explain why wage is needed
- Provide button/link to main calculator
- Non-blocking (doesn't prevent calculator use)

**Acceptance Criteria**:
- [ ] Alert renders with info styling
- [ ] Clear Icelandic explanation
- [ ] Link to main calculator tab functional
- [ ] Accessible (screen reader friendly)

**Tests**:
- Component tests in Task 3.5

**Requirements Traceability**: REQ-8

**Estimated Time**: 30 minutes

**Code Template** (see design document, section 5.6 for full code)

---

### Task 3.4: Create main CompoundSavingsCalculator component

**Objective**: Main page-level component orchestrating all sub-components

**Files to Create**:
- `src/components/savings/CompoundSavingsCalculator.tsx`

**Functionality**:
- Manage local state for current inputs
- Consume CalculatorContext for actualHourlyWage and scenarios
- Real-time calculation with useMemo
- Render all sub-components (InputForm, ResultsDisplay, etc.)
- Handle scenario save/load/delete
- Responsive layout

**Acceptance Criteria**:
- [ ] All sub-components render
- [ ] Real-time calculation on input change
- [ ] Scenario actions work correctly
- [ ] Missing wage prompt shows when appropriate
- [ ] Layout responsive

**Tests**:
- Component tests in Task 3.5

**Requirements Traceability**: ALL (orchestrator component)

**Estimated Time**: 1.5 hours

**Code Template** (see design document, section 5.1 for full code)

---

### Task 3.5: Write component unit tests

**Objective**: Unit tests for all core UI components

**Files to Create**:
- `tests/components/savings/SavingsInputForm.test.tsx`
- `tests/components/savings/SavingsResultsDisplay.test.tsx`
- `tests/components/savings/MissingWagePrompt.test.tsx`
- `tests/components/savings/CompoundSavingsCalculator.test.tsx`

**Functionality**:
- Test component rendering
- Test input changes and callbacks
- Test validation error display
- Test preset button functionality
- Test results display with/without wage
- Test missing wage prompt display

**Acceptance Criteria**:
- [ ] All component tests pass
- [ ] Test coverage > 80%
- [ ] User interactions tested (clicks, inputs)
- [ ] Edge cases covered

**Tests**:
- Run test suite: `npm test savings/*.test.tsx`

**Requirements Traceability**: REQ-1 through REQ-9

**Estimated Time**: 1 hour

---

## Epic 4: Visualization and Scenarios

### Task 4.1: Create CompoundGrowthVisualization component

**Objective**: Pure CSS bar chart visualization of compound growth

**Files to Create**:
- `src/components/savings/CompoundGrowthVisualization.tsx`

**Functionality**:
- Render year-by-year bars using CSS flexbox
- Stack contributions (darker) and total value (lighter)
- Interactive tooltips on hover showing year, amounts, life energy
- Responsive scaling for different time horizons
- Mobile-friendly (simplified labels)
- Legend showing contributions vs total value

**Acceptance Criteria**:
- [ ] Bars render correctly for all years
- [ ] Stacked bars show contributions vs interest
- [ ] Tooltips display on hover
- [ ] Year labels selectively shown based on time horizon
- [ ] Mobile responsive (readable on small screens)
- [ ] Smooth CSS transitions

**Tests**:
- Component tests in Task 4.4

**Requirements Traceability**: REQ-4

**Estimated Time**: 2 hours

**Code Template** (see design document, section 5.4 for detailed implementation)

---

### Task 4.2: Create ScenarioManager component

**Objective**: Manage and compare saved savings scenarios

**Files to Create**:
- `src/components/savings/ScenarioManager.tsx`

**Functionality**:
- Display list of saved scenarios (0-3)
- Comparison table with key metrics
- Highlight best scenario (highest future value)
- Load scenario button (populates form)
- Delete scenario button
- Save current scenario button
- Handle 0, 1, 2, 3 scenario states with appropriate messaging

**Acceptance Criteria**:
- [ ] Scenario list displays all scenarios
- [ ] Comparison table readable and informative
- [ ] Best scenario highlighted
- [ ] Load action populates form
- [ ] Delete action removes scenario
- [ ] Save button triggers dialog
- [ ] Appropriate messaging for 0-3 scenarios

**Tests**:
- Component tests in Task 4.4

**Requirements Traceability**: REQ-6

**Estimated Time**: 1.5 hours

**Code Template** (see design document, section 5.5 for full code)

---

### Task 4.3: Create SaveScenarioDialog component

**Objective**: Modal dialog for naming and saving current scenario

**Files to Create**:
- `src/components/savings/SaveScenarioDialog.tsx`

**Functionality**:
- Modal dialog with input field for scenario name
- Save and Cancel buttons
- Validation (name required, max length)
- Keyboard accessible (Escape to close, Enter to save)
- Focus management (auto-focus name input)

**Acceptance Criteria**:
- [ ] Dialog renders as modal overlay
- [ ] Name input auto-focused
- [ ] Save button calls onSave with name
- [ ] Cancel button calls onCancel
- [ ] Escape key closes dialog
- [ ] Enter key saves (when valid)
- [ ] Accessible (ARIA labels, roles)

**Tests**:
- Component tests in Task 4.4

**Requirements Traceability**: REQ-6

**Estimated Time**: 45 minutes

**Code Template**:
```typescript
// src/components/savings/SaveScenarioDialog.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface SaveScenarioDialogProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SaveScenarioDialog({ onSave, onCancel }: SaveScenarioDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Nafn má ekki vera tómt');
      return;
    }
    if (name.length > 50) {
      setError('Nafn má ekki vera lengra en 50 stafir');
      return;
    }
    onSave(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50"
      onClick={onCancel}
      role="dialog"
      aria-labelledby="dialog-title"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="dialog-title" className="text-lg font-semibold text-neutral-900 mb-4">
          Vista sviðsmynd
        </h3>

        <Input
          label="Nafn sviðsmyndar"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          error={error}
          autoFocus
          placeholder="t.d. Grunnspörn, Hámarksspörn"
        />

        <div className="flex gap-2 mt-6 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Hætta við
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Vista
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 4.4: Write visualization and scenario tests

**Objective**: Unit tests for visualization and scenario components

**Files to Create**:
- `tests/components/savings/CompoundGrowthVisualization.test.tsx`
- `tests/components/savings/ScenarioManager.test.tsx`
- `tests/components/savings/SaveScenarioDialog.test.tsx`

**Functionality**:
- Test visualization rendering with different data
- Test tooltip display
- Test scenario manager with 0-3 scenarios
- Test load/delete actions
- Test save dialog input and validation

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] Edge cases covered (0 scenarios, max scenarios)
- [ ] User interactions tested

**Tests**:
- Run test suite: `npm test savings/Compound*.test.tsx savings/Scenario*.test.tsx savings/Save*.test.tsx`

**Requirements Traceability**: REQ-4, REQ-6

**Estimated Time**: 1 hour

---

## Epic 5: Integration and Polish

### Task 5.1: Add savings tab to navigation

**Objective**: Integrate savings calculator into main app navigation

**Files to Modify**:
- `src/app/page.tsx` (or wherever tabs are configured)
- `src/components/layout/CalculatorTabsNav.tsx` (if needed)

**Functionality**:
- Add "Sparnaður" tab to CALCULATOR_TABS array
- Add conditional render for savings calculator
- Ensure tab ordering makes sense
- Update any tab-related constants

**Acceptance Criteria**:
- [ ] "Sparnaður" tab appears in navigation
- [ ] Tab click shows CompoundSavingsCalculator
- [ ] Tab active state works correctly
- [ ] Tab order logical
- [ ] Mobile label appropriate ("Sparn.")

**Tests**:
- Manual testing (tab switching)

**Requirements Traceability**: REQ-9

**Estimated Time**: 30 minutes

**Code Changes**:
```typescript
// In src/app/page.tsx or similar

import { CompoundSavingsCalculator } from '@/components/savings/CompoundSavingsCalculator';

const CALCULATOR_TABS: CalculatorTab[] = [
  { id: 'main', label: 'Aðalreiknivél', shortLabel: 'Aðal' },
  { id: 'subscriptions', label: 'Áskriftir', shortLabel: 'Áskr.' },
  { id: 'meals', label: 'Matur', shortLabel: 'Matur' },
  { id: 'commute', label: 'Samgöngur', shortLabel: 'Samg.' },
  { id: 'savings', label: 'Sparnaður', shortLabel: 'Sparn.' }, // NEW
  // ... other tabs
];

// In render logic
{activeTab === 'savings' && <CompoundSavingsCalculator />}
```

---

### Task 5.2: Implement accessibility features

**Objective**: Ensure WCAG 2.1 AA compliance

**Files to Modify**:
- All savings component files

**Functionality**:
- Add ARIA labels to all inputs
- Add ARIA live regions for dynamic updates
- Add keyboard navigation support
- Add focus indicators
- Add alternative text for visualizations
- Add screen reader announcements
- Test with keyboard only
- Test with screen reader

**Acceptance Criteria**:
- [ ] All inputs have ARIA labels
- [ ] Dynamic results announced to screen readers
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators (2px outline)
- [ ] Color contrast meets 4.5:1 minimum
- [ ] Visualization has text alternative

**Tests**:
- Manual keyboard navigation testing
- Screen reader testing (VoiceOver on Mac)
- Automated accessibility audit (if tool available)

**Requirements Traceability**: REQ-9, Accessibility requirements

**Estimated Time**: 1 hour

**Code Examples**:
```typescript
// ARIA live region in SavingsResultsDisplay
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {results && `Framtíðarvirði reiknað: ${formatCurrency(results.futureValue)}`}
</div>

// ARIA label for visualization
<div
  className="visualization-container"
  role="img"
  aria-label={`Graf sem sýnir þróun sparnaðar yfir ${inputs.timeHorizonYears} ár`}
>
  {/* Bars */}
</div>

// Focus styles in CSS
.input:focus,
.button:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

### Task 5.3: Add Icelandic translations and tooltips

**Objective**: Complete Icelandic UI with helpful tooltips

**Files to Modify**:
- All savings component files

**Functionality**:
- Add tooltips to preset buttons (already in design)
- Add help tooltip explaining compound interest
- Add tooltip on "interest earned life energy" explaining concept
- Verify all text is Icelandic
- Verify grammar and clarity

**Acceptance Criteria**:
- [ ] All UI text in Icelandic
- [ ] Tooltips on preset buttons
- [ ] Help text explaining compound interest
- [ ] Tooltip on interest earned explaining concept
- [ ] All tooltips keyboard accessible

**Tests**:
- Manual review of all text
- Native Icelandic speaker review (if available)

**Requirements Traceability**: REQ-5, Usability requirements

**Estimated Time**: 30 minutes

**Code Additions**:
```typescript
// Help tooltip explaining compound interest
<Tooltip content="Vaxtavextir: Vextir eru reiknaðir af bæði höfuðstól og uppsöfnuðum vöxtum. Þetta gerir sparnaðinn þinn að vaxa hraðar með tímanum.">
  <InfoIcon className="w-4 h-4 text-neutral-500 cursor-help" />
</Tooltip>

// Tooltip on interest earned life energy
<Tooltip content="Þetta er lífsorka sem peningarnir þínir afla fyrir þig með vöxtum - án þess að þú þurfir að vinna fyrir því!">
  <Badge variant="success">Gjöf!</Badge>
</Tooltip>
```

---

### Task 5.4: Write E2E integration tests

**Objective**: End-to-end tests for complete user workflows

**Files to Create**:
- `tests/e2e/savings-calculator.test.tsx` (or use existing E2E framework)

**Functionality**:
- Test complete workflow: navigate to tab → enter inputs → see results → save scenario → compare
- Test preset button workflow
- Test missing wage flow
- Test scenario limit
- Test scenario deletion

**Acceptance Criteria**:
- [ ] Complete workflow test passes
- [ ] Preset workflow test passes
- [ ] Missing wage flow test passes
- [ ] Scenario limit test passes
- [ ] Scenario CRUD test passes

**Tests**:
- Run E2E suite: `npm test e2e`

**Requirements Traceability**: ALL

**Estimated Time**: 1 hour

**Code Template**:
```typescript
// tests/e2e/savings-calculator.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalculatorProvider } from '@/context/CalculatorContext';
import App from '@/app/page';

describe('Savings Calculator E2E', () => {
  it('complete workflow: configure → save → compare', async () => {
    const user = userEvent.setup();
    render(
      <CalculatorProvider>
        <App />
      </CalculatorProvider>
    );

    // Navigate to savings tab
    const savingsTab = screen.getByText(/Sparnaður/i);
    await user.click(savingsTab);

    // Configure scenario
    const savingsInput = screen.getByLabelText(/Mánaðarlegur sparnaður/i);
    await user.clear(savingsInput);
    await user.type(savingsInput, '50000');

    // Click preset
    const verdtryggtButton = screen.getByText(/Verðtryggt/i);
    await user.click(verdtryggtButton);

    // Verify results appear
    await waitFor(() => {
      expect(screen.getByText(/Framtíðarvirði/i)).toBeInTheDocument();
    });

    // Save scenario
    const saveButton = screen.getByText(/Vista núverandi/i);
    await user.click(saveButton);

    const nameInput = screen.getByLabelText(/Nafn sviðsmyndar/i);
    await user.type(nameInput, 'Test Scenario');

    const confirmButton = screen.getByText(/^Vista$/i);
    await user.click(confirmButton);

    // Verify scenario in list
    await waitFor(() => {
      expect(screen.getByText('Test Scenario')).toBeInTheDocument();
    });
  });

  // More E2E tests...
});
```

---

### Task 5.5: Manual testing and bug fixes

**Objective**: Comprehensive manual testing and bug fixing

**Files to Modify**:
- Any files with bugs discovered

**Functionality**:
- Test all features on desktop (Chrome, Firefox, Safari)
- Test all features on mobile (iOS Safari, Android Chrome)
- Test with different viewport sizes (320px - 1920px)
- Test keyboard navigation
- Test screen reader (VoiceOver or NVDA)
- Test localStorage persistence (save, reload, verify)
- Test export/import functionality
- Test edge cases (0 interest, max values, etc.)
- Fix any bugs discovered

**Acceptance Criteria**:
- [ ] All features work on desktop browsers
- [ ] All features work on mobile browsers
- [ ] Responsive at all viewport sizes
- [ ] Keyboard navigation functional
- [ ] Screen reader accessible
- [ ] localStorage persistence works
- [ ] Export/import works
- [ ] No console errors
- [ ] All bugs fixed

**Tests**:
- Manual testing checklist

**Requirements Traceability**: ALL

**Estimated Time**: 1.5 hours

**Testing Checklist**:
```markdown
## Manual Testing Checklist

### Desktop (Chrome, Firefox, Safari)
- [ ] Navigate to savings tab
- [ ] Enter all inputs (savings, rate, horizon)
- [ ] Click each preset button
- [ ] Verify results update in real-time
- [ ] Verify life energy displays (after completing main calculator)
- [ ] Verify visualization renders correctly
- [ ] Save 3 scenarios
- [ ] Attempt to save 4th (verify error)
- [ ] Load scenario
- [ ] Delete scenario
- [ ] Export data (verify JSON includes savings)
- [ ] Import data (verify scenarios restore)

### Mobile (iOS Safari, Android Chrome)
- [ ] All desktop tests on mobile
- [ ] Verify responsive layout (vertical stacking)
- [ ] Verify touch targets adequate (44×44px minimum)
- [ ] Verify no horizontal scroll
- [ ] Verify visualization readable

### Keyboard Navigation
- [ ] Tab through all inputs
- [ ] Focus indicators visible
- [ ] Enter key saves dialog
- [ ] Escape key closes dialog
- [ ] Arrow keys work on slider

### Screen Reader (VoiceOver or NVDA)
- [ ] All labels announced
- [ ] Results changes announced
- [ ] Interactive elements accessible
- [ ] Visualization has alternative text

### Edge Cases
- [ ] 0% interest rate
- [ ] 50-year time horizon
- [ ] Maximum savings amount
- [ ] Missing actualHourlyWage (prompt displays)
- [ ] Refresh page (localStorage persists)
```

---

## Implementation Sequence

**Recommended Order**:

1. **Week 1, Day 1-2**: Epic 1 (Foundation)
   - Task 1.1: Types (45 min)
   - Task 1.2: Constants (30 min)
   - Task 1.3: Calculations (2 hours)
   - Task 1.4: Tests (1 hour)

2. **Week 1, Day 3**: Epic 2 (CalculatorContext)
   - Task 2.1: Extend context (30 min)
   - Task 2.2: CRUD operations (1.5 hours)
   - Task 2.3: localStorage (45 min)
   - Task 2.4: Auto-recalculation (30 min)
   - Task 2.5: Context tests (1 hour)

3. **Week 1, Day 4-5**: Epic 3 (Core UI)
   - Task 3.1: InputForm (1.5 hours)
   - Task 3.2: ResultsDisplay (1 hour)
   - Task 3.3: MissingWagePrompt (30 min)
   - Task 3.4: Main component (1.5 hours)
   - Task 3.5: Component tests (1 hour)

4. **Week 2, Day 1**: Epic 4 (Visualization & Scenarios)
   - Task 4.1: Visualization (2 hours)
   - Task 4.2: ScenarioManager (1.5 hours)
   - Task 4.3: SaveDialog (45 min)
   - Task 4.4: Tests (1 hour)

5. **Week 2, Day 2**: Epic 5 (Integration & Polish)
   - Task 5.1: Tab navigation (30 min)
   - Task 5.2: Accessibility (1 hour)
   - Task 5.3: Translations (30 min)
   - Task 5.4: E2E tests (1 hour)
   - Task 5.5: Manual testing (1.5 hours)

**Total Time**: 12-14 hours over 2 weeks (part-time)

---

## Definition of Done

**Feature is complete when**:

- [ ] All 19 tasks completed and checked off
- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing checklist 100% complete
- [ ] Code reviewed (self or peer)
- [ ] No console errors in browser
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Documentation complete (code comments, JSDoc)
- [ ] Responsive design verified on all breakpoints
- [ ] Icelandic text reviewed for grammar/clarity
- [ ] Performance targets met (< 100ms calculations)
- [ ] localStorage persistence verified
- [ ] Export/import functionality verified
- [ ] All requirements traced and satisfied

---

## Risk Mitigation

### Risks and Mitigation Strategies

**Risk 1: Calculation accuracy issues**
- Mitigation: Extensive unit tests with known values, verify against financial calculator
- Contingency: Use established financial formula library if custom implementation fails

**Risk 2: Performance issues with large time horizons**
- Mitigation: Benchmark calculations, optimize if needed
- Contingency: Limit time horizon to 30 years instead of 50

**Risk 3: CSS visualization doesn't work cross-browser**
- Mitigation: Test early on all browsers, use flexbox (well-supported)
- Contingency: Use simple table format instead of bars

**Risk 4: localStorage size limits exceeded**
- Mitigation: Monitor storage usage, 3-scenario limit keeps size small
- Contingency: Add storage cleanup utility

**Risk 5: Accessibility issues discovered late**
- Mitigation: Implement accessibility from start (Task 5.2), test early
- Contingency: Budget extra time for fixes

---

## Success Metrics

**Quantitative**:
- Code coverage: > 85%
- Performance: All calculations < 100ms
- Accessibility: WCAG 2.1 AA compliance (no violations)
- Bundle size impact: < 20KB additional

**Qualitative**:
- User can complete workflow without confusion
- Visualization clearly shows compound growth
- Life energy concept understood
- Icelandic UI feels natural

---

## Notes for Implementation

**Best Practices**:
- Commit after each task completion
- Write tests before or alongside components (TDD optional but recommended)
- Run full test suite before moving to next epic
- Test on mobile device early (Epic 3, Task 3.4)
- Get Icelandic text reviewed by native speaker if possible

**Dependencies**:
- No external library dependencies (feature uses existing UI components)
- Requires existing CalculatorContext pattern understanding
- Requires understanding of existing component patterns (Card, Input, etc.)

**Common Pitfalls to Avoid**:
- Don't forget to handle 0 interest rate case
- Don't forget to handle 0 actualHourlyWage case
- Don't create infinite loop in auto-recalculation useEffect
- Don't exceed localStorage quota (3 scenarios should be fine)
- Don't forget ARIA labels and keyboard navigation

---

**Tasks Review Checklist**:

- [x] All requirements covered by tasks
- [x] Tasks sequenced logically (foundation → integration → UI → polish)
- [x] Each task has clear objective and acceptance criteria
- [x] Each task has realistic time estimate
- [x] Requirements traceability maintained
- [x] Testing strategy comprehensive
- [x] Total time estimate reasonable (12-14 hours)
- [x] Definition of Done clear and measurable

**Implementation Ready**: YES

**Next Step**: Begin implementation with Epic 1, Task 1.1
