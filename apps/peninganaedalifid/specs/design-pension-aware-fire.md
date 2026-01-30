# Technical Design: Pension-Aware FIRE Calculator

## Design Overview

**Feature Name:** Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)
**Feature ID:** 2.1.15
**Version:** 1.0
**Status:** Draft
**Created:** 2026-01-30
**Requirements:** specs/requirements-pension-aware-fire.md

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PensionAwareFIRECalculator                    │
│                         (Main Page Component)                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Educational  │  │   Basic      │  │    Pension Inputs        │  │
│  │ Intro        │  │   Inputs     │  │    (3 sources)           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Phase Timeline Display                     │   │
│  │   [Pre-60 Gap]  →  [60-67 Bridge]  →  [67+ Full Pension]    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ FI Number    │  │  Phase       │  │   Scenario               │  │
│  │ Comparison   │  │  Breakdown   │  │   Comparison             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CalculatorContext                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │ pensionAwareFire│  │ pensionAware    │  │ expenseBaseline     │ │
│  │ State           │  │ FireResults     │  │ Results             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Calculation Engine                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │ Phase           │  │ Present Value   │  │ FI Number           │ │
│  │ Calculator      │  │ Calculator      │  │ Adjuster            │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → State Update → Calculation Engine → Results → UI Update
     │                            │
     │                            ├── calculatePhases()
     │                            ├── calculatePresentValueOfPensions()
     │                            ├── calculateTraditionalFI()
     │                            ├── calculatePensionAdjustedFI()
     │                            └── calculateTimeToFI()
     │
     └── From expenseBaselineResults (if available)
```

---

## Component Design

### Component Hierarchy

```
src/components/pensionAwareFire/
├── PensionAwareFIRECalculator.tsx    # Main container
├── PensionEducationalIntro.tsx        # Collapsible educational content
├── BasicInputs.tsx                    # Age, expenses, savings inputs
├── PensionInputs.tsx                  # Lífeyrissjóður, séreign, TR inputs
├── PhaseTimeline.tsx                  # Visual timeline component
├── FINumberComparison.tsx             # Traditional vs Adjusted FI
├── PhaseBreakdown.tsx                 # Detailed phase-by-phase view
├── ScenarioComparison.tsx             # Compare up to 3 scenarios
└── index.ts                           # Barrel export
```

### Component Specifications

#### 1. PensionAwareFIRECalculator (Main Container)

**Purpose:** Orchestrates all sub-components and manages page layout

**Props:**
```typescript
interface PensionAwareFIRECalculatorProps {
  onBack?: () => void; // For integration in calculator hub
}
```

**State Management:**
- Uses `useCalculator()` hook for global state
- Local state for UI concerns (collapsed sections, active scenario)

**Responsibilities:**
- Initialize pension-aware state if not exists
- Coordinate data flow between components
- Handle loading and error states

---

#### 2. PensionEducationalIntro

**Purpose:** Explain the "over-saving" problem and how pensions affect FI

**Props:**
```typescript
interface PensionEducationalIntroProps {
  collapsed: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}
```

**Content Sections:**
1. "Af hverju hefðbundin FIRE-tala er of há" (Why traditional FI is too high)
2. "Íslenska lífeyriskerfið" (The Icelandic pension system)
3. "Þrjú stig eftirlaunaáætlunar" (Three phases of retirement planning)
4. "Dæmi: Hvernig þetta sparar milljónir" (Example: How this saves millions)

---

#### 3. BasicInputs

**Purpose:** Collect core financial inputs

**Props:**
```typescript
interface BasicInputsProps {
  // All handled via context
}
```

**Fields:**
| Field | Type | Range | Default |
|-------|------|-------|---------|
| currentAge | number | 18-70 | 35 |
| targetRetirementAge | number | currentAge+1 to 80 | 55 |
| monthlyExpenses | currency | 0-2,000,000 | From baseline or 300,000 |
| currentSavings | currency | 0-500,000,000 | 0 |
| monthlySavings | currency | 0-2,000,000 | 0 |
| investmentReturn | percentage | 0-15% | 5% |

**Integration:**
- Auto-populate monthlyExpenses from expenseBaselineResults if available
- Tier selector (barebones/comfortable/deluxe) when baseline exists

---

#### 4. PensionInputs

**Purpose:** Collect pension-specific inputs for all three sources

**Props:**
```typescript
interface PensionInputsProps {
  // All handled via context
}
```

**Sections:**

**A. Lífeyrissjóður (Occupational Pension)**
| Field | Type | Range | Default |
|-------|------|-------|---------|
| expectedMonthlyAmount | currency | 0-1,000,000 | 300,000 |
| startAge | number | 62-70 | 67 |

**B. Séreign (Private Pension)**
| Field | Type | Range | Default |
|-------|------|-------|---------|
| currentBalance | currency | 0-100,000,000 | 0 |
| monthlyContribution | currency | 0-500,000 | 0 |
| employerMatch | percentage | 0-15% | 2% |

**C. TR Ellilífeyrir (State Pension)**
| Field | Type | Range | Default |
|-------|------|-------|---------|
| expectFullTR | boolean | - | true |
| estimatedPercentage | percentage | 0-100% | Auto-calculated |

**Helper Features:**
- "Ekki viss?" (Not sure?) links to estimation helpers
- "Nota dæmigerð gildi" (Use typical values) quick-fill button
- TR auto-calculation based on lífeyrissjóður (means-testing)

---

#### 5. PhaseTimeline

**Purpose:** Visual representation of retirement phases

**Props:**
```typescript
interface PhaseTimelineProps {
  phases: RetirementPhase[];
  currentAge: number;
  targetRetirementAge: number;
}
```

**Visual Design:**
```
┌────────────────────────────────────────────────────────────────────┐
│  35        52              60                67              90    │
│   │         │               │                 │               │    │
│   ●━━━━━━━━━●═══════════════●─────────────────●───────────────●    │
│   │  Working │   Gap Period  │  Séreign Bridge │ Full Pension  │   │
│   │  17 ár   │    8 ár       │     7 ár        │   23+ ár      │   │
│             │               │                 │                    │
│             │  Þarf: 23M    │  Þarf: 10.5M    │  Afgangur!     │   │
└────────────────────────────────────────────────────────────────────┘
```

**Color Coding:**
- Working years: Blue
- Gap period (self-funded): Red/Orange
- Séreign bridge: Amber/Yellow
- Full pension: Green

**Interactions:**
- Click/hover on phase shows detailed breakdown
- Drag retirement age marker to adjust (optional v2)

---

#### 6. FINumberComparison

**Purpose:** Show Traditional vs Pension-Adjusted FI numbers

**Props:**
```typescript
interface FINumberComparisonProps {
  traditionalFI: number;
  pensionAdjustedFI: number;
  savings: number;
  yearsEarlier?: number;
}
```

**Display:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    FI-tölu samanburður                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │  Hefðbundin FI      │    │  Lífeyristengd FI   │            │
│  │  144.000.000 kr     │ →  │  38.500.000 kr      │            │
│  │  (30x útgjöld)      │    │  (raunþörf)         │            │
│  └─────────────────────┘    └─────────────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  💰 Þú sparar: 105.500.000 kr                           │   │
│  │  ⏰ Eða getur hætt 8.5 árum fyrr!                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 7. PhaseBreakdown

**Purpose:** Detailed view of each retirement phase

**Props:**
```typescript
interface PhaseBreakdownProps {
  phases: RetirementPhase[];
}
```

**Display per Phase:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Stig 1: Biðtími (52-60 ára)                              8 ár  │
├─────────────────────────────────────────────────────────────────┤
│  Tekjur:                           Útgjöld:                     │
│  • Sparnaður úttekt: 240.000 kr    • Mánaðarleg: 240.000 kr    │
│  • Ávöxtun: ~100.000 kr                                         │
│                                    Samtals: 240.000 kr/mán      │
│  Samtals: ~340.000 kr/mán                                       │
├─────────────────────────────────────────────────────────────────┤
│  Þörf í upphafi stigs: 23.040.000 kr                           │
│  Staða í lok stigs: ~5.000.000 kr (flutt í næsta stig)         │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 8. ScenarioComparison

**Purpose:** Compare different retirement scenarios side-by-side

**Props:**
```typescript
interface ScenarioComparisonProps {
  scenarios: SavedScenario[];
  onSaveScenario: (name: string) => void;
  onDeleteScenario: (id: string) => void;
  maxScenarios: 3;
}
```

**Display:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Atburðarásir                              [+ Vista núverandi]  │
├─────────────────────────────────────────────────────────────────┤
│           │ Snemmbúin    │ Hefðbundin   │ Varfærin            │
│           │ (hætta 50)   │ (hætta 55)   │ (hætta 60)          │
├───────────┼──────────────┼──────────────┼─────────────────────┤
│ FI þörf   │ 45.2M kr     │ 28.5M kr     │ 12.1M kr            │
│ Biðtími   │ 10 ár        │ 5 ár         │ 0 ár                │
│ Tími til  │ 12 ár        │ 8 ár         │ 5 ár                │
│ Afgangur  │ +15M kr      │ +42M kr      │ +89M kr             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Type Definitions

```typescript
// src/types/pensionAwareFire.ts

/**
 * Input state for Pension-Aware FIRE calculator
 */
export interface PensionAwareFireState {
  // Basic inputs
  currentAge: number;
  targetRetirementAge: number;
  monthlyExpenses: number;
  expenseSource: 'baseline' | 'manual';
  expenseTier: 'barebones' | 'comfortable' | 'deluxe';
  currentSavings: number;
  monthlySavings: number;
  investmentReturn: number; // decimal, e.g., 0.05 for 5%

  // Lífeyrissjóður (Occupational Pension)
  lifeyrissjodur: {
    expectedMonthlyAmount: number;
    startAge: number; // 62-70, default 67
  };

  // Séreign (Private Pension)
  sereign: {
    currentBalance: number;
    monthlyContribution: number;
    employerMatchPercent: number; // decimal
  };

  // TR (State Pension)
  tr: {
    expectFullTR: boolean;
    manualOverrideAmount: number | null; // if user wants to set manually
  };

  // Scenarios
  savedScenarios: SavedScenario[];

  // Meta
  lastUpdated: Date;
  version: number;
}

/**
 * A single retirement phase
 */
export interface RetirementPhase {
  id: 'gap' | 'sereign-bridge' | 'full-pension';
  nameIs: string;
  nameEn: string;
  startAge: number;
  endAge: number;
  durationYears: number;

  // Income sources during this phase
  incomeSources: {
    savingsWithdrawal: number; // monthly
    investmentReturns: number; // monthly average
    sereign: number; // monthly (0 if not in this phase)
    lifeyrissjodur: number; // monthly (0 if not in this phase)
    tr: number; // monthly (0 if not in this phase)
    total: number;
  };

  // Expenses
  monthlyExpenses: number;

  // Funding requirements
  requiredAtStart: number; // How much needed at start of phase
  remainingAtEnd: number; // What's left for next phase

  // Status
  isSelfFunded: boolean;
  hasSurplus: boolean;
  surplusAmount: number;
}

/**
 * Complete calculation results
 */
export interface PensionAwareFireResults {
  // FI Numbers
  traditionalFINumber: number; // 25x or 30x annual expenses
  pensionAdjustedFINumber: number; // What you actually need
  fiMultiplier: number; // 25 or 30

  // Savings comparison
  savingsDifference: number; // traditionalFI - pensionAdjustedFI
  savingsPercentageReduction: number; // How much less you need

  // Phases
  phases: RetirementPhase[];
  totalGapYears: number; // Years before any pension

  // Timeline
  yearsToTraditionalFI: number | null;
  yearsToPensionAdjustedFI: number | null;
  yearsEarlierRetirement: number | null; // How much sooner with pension-aware

  // Pension projections
  projectedSereign: {
    balanceAt60: number;
    monthlyWithdrawal60to67: number; // If withdrawn evenly
  };

  projectedTR: {
    estimatedMonthly: number;
    reductionPercent: number; // Due to means-testing
    incomeAboveExemption: number;
  };

  // End state
  estimatedSurplusAt90: number; // Legacy/buffer

  // Validation
  isViable: boolean; // Can the plan work?
  warnings: PlanWarning[];
}

/**
 * Warning about the plan
 */
export interface PlanWarning {
  severity: 'info' | 'warning' | 'error';
  code: string;
  messageIs: string;
  messageEn: string;
}

/**
 * Saved scenario for comparison
 */
export interface SavedScenario {
  id: string;
  name: string;
  createdAt: Date;
  inputs: Partial<PensionAwareFireState>;
  results: PensionAwareFireResults;
}
```

### Constants

```typescript
// src/lib/constants/pensionAwareFire.ts

export const PENSION_AWARE_DEFAULTS = {
  currentAge: 35,
  targetRetirementAge: 55,
  monthlyExpenses: 300_000,
  currentSavings: 0,
  monthlySavings: 200_000,
  investmentReturn: 0.05,
  fiMultiplier: 30,
  version: 1,
};

export const ICELANDIC_PENSION_SYSTEM = {
  // Séreign
  SEREIGN_ACCESS_AGE: 60,
  TYPICAL_SEREIGN_RETURN: 0.05,

  // Lífeyrissjóður
  LIFEYRISSJODUR_EARLY_AGE: 62,
  LIFEYRISSJODUR_STANDARD_AGE: 67,
  LIFEYRISSJODUR_LATE_AGE: 72,
  TYPICAL_LIFEYRISSJODUR_MONTHLY: 300_000,

  // TR
  TR_START_AGE: 67,
  TR_MAX_SINGLE: 380_000, // Approximate
  TR_INCOME_EXEMPTION: 36_500,
  TR_REDUCTION_RATE: 0.45,

  // Life expectancy for calculations
  ASSUMED_LIFE_EXPECTANCY: 90,
};

export const PENSION_INPUT_RANGES = {
  currentAge: { min: 18, max: 70 },
  targetRetirementAge: { min: 30, max: 80 },
  monthlyExpenses: { min: 100_000, max: 2_000_000 },
  currentSavings: { min: 0, max: 500_000_000 },
  monthlySavings: { min: 0, max: 2_000_000 },
  investmentReturn: { min: 0, max: 0.15 },
  lifeyrissjodurMonthly: { min: 0, max: 1_000_000 },
  sereignBalance: { min: 0, max: 100_000_000 },
};
```

---

## Calculation Engine

### Core Algorithms

```typescript
// src/lib/calculations/pensionAwareFire.ts

/**
 * Calculate all retirement phases based on inputs
 */
export function calculateRetirementPhases(
  state: PensionAwareFireState
): RetirementPhase[] {
  const phases: RetirementPhase[] = [];
  const { targetRetirementAge, monthlyExpenses, investmentReturn } = state;

  // Phase 1: Gap Period (retirement to 60)
  if (targetRetirementAge < 60) {
    phases.push(calculateGapPhase(state));
  }

  // Phase 2: Séreign Bridge (60 to 67)
  if (targetRetirementAge < 67) {
    phases.push(calculateSereignBridgePhase(state, phases));
  }

  // Phase 3: Full Pension (67+)
  phases.push(calculateFullPensionPhase(state, phases));

  return phases;
}

/**
 * Calculate present value of future pension stream
 */
export function calculatePresentValueOfPension(
  monthlyAmount: number,
  startAge: number,
  currentAge: number,
  endAge: number,
  discountRate: number
): number {
  const yearsUntilStart = startAge - currentAge;
  const pensionDuration = endAge - startAge;

  // Present value of annuity, discounted to today
  const monthlyRate = discountRate / 12;
  const totalMonths = pensionDuration * 12;

  // PV of annuity at start of pension
  const pvAtStart = monthlyAmount *
    ((1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate);

  // Discount back to today
  const pvToday = pvAtStart / Math.pow(1 + discountRate, yearsUntilStart);

  return pvToday;
}

/**
 * Calculate pension-adjusted FI number
 */
export function calculatePensionAdjustedFI(
  state: PensionAwareFireState
): number {
  const traditionalFI = calculateTraditionalFI(state);

  // Calculate PV of all pension streams
  const pvLifeyrissjodur = calculatePresentValueOfPension(
    state.lifeyrissjodur.expectedMonthlyAmount,
    state.lifeyrissjodur.startAge,
    state.currentAge,
    ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY,
    state.investmentReturn
  );

  const projectedTR = calculateTRWithMeansTesting(state);
  const pvTR = calculatePresentValueOfPension(
    projectedTR.estimatedMonthly,
    ICELANDIC_PENSION_SYSTEM.TR_START_AGE,
    state.currentAge,
    ICELANDIC_PENSION_SYSTEM.ASSUMED_LIFE_EXPECTANCY,
    state.investmentReturn
  );

  const projectedSereign = calculateProjectedSereign(state);
  // Séreign is already an asset, discount to PV at target retirement
  const pvSereign = projectedSereign.balanceAt60 /
    Math.pow(1 + state.investmentReturn, 60 - state.currentAge);

  // Pension-adjusted FI = what you need to bridge gaps
  // This is the key insight: you don't need 30x forever
  const pensionAdjustedFI = calculateBridgeFundingNeeds(state);

  return pensionAdjustedFI;
}

/**
 * Calculate total funding needed for all gap periods
 */
export function calculateBridgeFundingNeeds(
  state: PensionAwareFireState
): number {
  const phases = calculateRetirementPhases(state);

  // Sum up what's needed at the start of the first phase
  // Each phase calculates what it needs and what it passes to next
  return phases[0]?.requiredAtStart ?? 0;
}
```

### TR Means-Testing Calculation

```typescript
/**
 * Calculate TR pension after means-testing
 * Reuses logic from TRMeansTestCalculator
 */
export function calculateTRWithMeansTesting(
  state: PensionAwareFireState
): {
  estimatedMonthly: number;
  reductionPercent: number;
  incomeAboveExemption: number;
} {
  const { TR_MAX_SINGLE, TR_INCOME_EXEMPTION, TR_REDUCTION_RATE } =
    ICELANDIC_PENSION_SYSTEM;

  // Lífeyrissjóður counts against TR
  const countableIncome = state.lifeyrissjodur.expectedMonthlyAmount;

  if (countableIncome <= TR_INCOME_EXEMPTION) {
    return {
      estimatedMonthly: TR_MAX_SINGLE,
      reductionPercent: 0,
      incomeAboveExemption: 0,
    };
  }

  const incomeAboveExemption = countableIncome - TR_INCOME_EXEMPTION;
  const reduction = incomeAboveExemption * TR_REDUCTION_RATE;
  const estimatedMonthly = Math.max(0, TR_MAX_SINGLE - reduction);

  return {
    estimatedMonthly: Math.round(estimatedMonthly),
    reductionPercent: (1 - estimatedMonthly / TR_MAX_SINGLE) * 100,
    incomeAboveExemption,
  };
}
```

---

## State Management

### Context Integration

```typescript
// Addition to CalculatorContext.tsx

interface CalculatorContextType {
  // ... existing fields ...

  // Pension-Aware FIRE
  pensionAwareFire: PensionAwareFireState | null;
  pensionAwareFireResults: PensionAwareFireResults | null;
  updatePensionAwareFireState: (updates: Partial<PensionAwareFireState>) => void;
  initializePensionAwareFire: () => void;
  savePensionScenario: (name: string) => void;
  deletePensionScenario: (id: string) => void;
}
```

### localStorage Persistence

```typescript
const PENSION_AWARE_STORAGE_KEY = 'pensionAwareFire_state';

// Save to localStorage on state changes
// Load from localStorage on initialization
// Same pattern as other calculators
```

---

## Error Handling

### Validation Rules

| Rule | Condition | Error Message (Is) |
|------|-----------|-------------------|
| V1 | targetRetirementAge <= currentAge | "Markaldur verður að vera hærri en núverandi aldur" |
| V2 | targetRetirementAge > 80 | "Markaldur getur ekki verið hærri en 80" |
| V3 | monthlyExpenses <= 0 | "Mánaðarleg útgjöld verða að vera jákvæð" |
| V4 | monthlySavings < 0 | "Mánaðarlegur sparnaður getur ekki verið neikvæður" |
| V5 | lifeyrissjodur.startAge < 62 | "Lífeyrissjóður byrjar ekki fyrr en 62 ára" |

### Plan Warnings

| Code | Condition | Severity | Message |
|------|-----------|----------|---------|
| W1 | Gap > 15 years | warning | "Biðtími er mjög langur - íhugaðu eldri starfslok" |
| W2 | savingsRate insufficient | error | "Sparnaðarhlutfall næst ekki til að ná markmiði" |
| W3 | No pension inputs | info | "Engar lífeyrisupplýsingar - notuð sjálfgefin gildi" |
| W4 | Large surplus | info | "Þú átt eftir stóran afgang - gætir hætt fyrr" |

---

## Testing Strategy

### Unit Tests

```typescript
// tests/lib/calculations/pensionAwareFire.test.ts

describe('calculateRetirementPhases', () => {
  it('creates 3 phases for early retirement', () => {
    const state = createMockState({ targetRetirementAge: 50 });
    const phases = calculateRetirementPhases(state);
    expect(phases).toHaveLength(3);
  });

  it('creates 2 phases for retirement at 62', () => {
    const state = createMockState({ targetRetirementAge: 62 });
    const phases = calculateRetirementPhases(state);
    expect(phases).toHaveLength(2);
  });

  it('creates 1 phase for retirement at 67', () => {
    const state = createMockState({ targetRetirementAge: 67 });
    const phases = calculateRetirementPhases(state);
    expect(phases).toHaveLength(1);
  });
});

describe('calculatePensionAdjustedFI', () => {
  it('returns lower FI than traditional for early retirees', () => {
    const state = createMockState({ targetRetirementAge: 52 });
    const adjustedFI = calculatePensionAdjustedFI(state);
    const traditionalFI = calculateTraditionalFI(state);
    expect(adjustedFI).toBeLessThan(traditionalFI);
  });
});

describe('calculateTRWithMeansTesting', () => {
  it('returns full TR when lífeyrissjóður is below exemption', () => {
    const state = createMockState({
      lifeyrissjodur: { expectedMonthlyAmount: 30_000, startAge: 67 }
    });
    const result = calculateTRWithMeansTesting(state);
    expect(result.estimatedMonthly).toBe(380_000);
  });
});
```

### Component Tests

```typescript
// Test each component renders correctly
// Test user interactions update state
// Test calculations trigger on input changes
```

---

## File Structure

```
src/
├── types/
│   └── pensionAwareFire.ts              # Type definitions
├── lib/
│   ├── constants/
│   │   └── pensionAwareFire.ts          # Constants and defaults
│   └── calculations/
│       └── pensionAwareFire.ts          # Calculation functions
├── components/
│   └── pensionAwareFire/
│       ├── index.ts
│       ├── PensionAwareFIRECalculator.tsx
│       ├── PensionEducationalIntro.tsx
│       ├── BasicInputs.tsx
│       ├── PensionInputs.tsx
│       ├── PhaseTimeline.tsx
│       ├── FINumberComparison.tsx
│       ├── PhaseBreakdown.tsx
│       └── ScenarioComparison.tsx
├── app/
│   └── lifeyristengd-fire/
│       └── page.tsx                      # Route page
└── context/
    └── CalculatorContext.tsx             # State additions

tests/
└── lib/
    └── calculations/
        └── pensionAwareFire.test.ts      # Unit tests
```

---

## Design Decisions

### D1: Phase-Based vs Continuous Model
**Decision:** Use discrete phases (Gap, Bridge, Full Pension)
**Rationale:** Easier for users to understand and aligns with actual pension access dates
**Alternative:** Continuous model with gradual pension introduction

### D2: Present Value Calculations
**Decision:** Use investment return rate as discount rate
**Rationale:** Represents opportunity cost of money; keeps model simple
**Alternative:** Separate discount rate input (more complex, less intuitive)

### D3: TR Estimation
**Decision:** Simplified means-testing, link to official calculator
**Rationale:** Full TR rules are complex; provide estimate with disclaimer
**Alternative:** Full TR replication (out of scope, rules change frequently)

### D4: Séreign Withdrawal Strategy
**Decision:** Assume even withdrawal 60-67
**Rationale:** Simple default; can be adjusted in future versions
**Alternative:** Optimal withdrawal strategy (complex optimization)

---

## Dependencies

- **Internal:**
  - CalculatorContext (state management)
  - Expense Baseline (expense data)
  - TRMeansTestCalculator (reuse TR logic)
  - UI Components (Card, CurrencyInput, Slider, etc.)

- **External:**
  - None (all calculations in-app)

---

## Future Considerations (v2.0)

1. Inflation-adjusted projections
2. Monte Carlo simulation for returns
3. Spouse/couple calculations
4. Integration with pension fund portals (if APIs available)
5. Export to PDF/print
6. Optimal withdrawal strategy calculator
