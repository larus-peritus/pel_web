# Tasks: Debt Payoff vs Invest Analyzer

## Overview

**Feature**: Debt Payoff vs Invest Analyzer
**App**: peninganaedalifid.is
**Tasks Version**: 1.0
**Last Updated**: 2026-01-22
**Requirements**: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/debt-payoff-vs-invest/requirements-debt-payoff-vs-invest.md`
**Design**: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/debt-payoff-vs-invest/design-debt-payoff-vs-invest.md`

---

## Implementation Strategy

**Approach**: Foundation-first with incremental feature delivery

**Rationale**:
1. **Build calculation engine first** - Core business logic is independent and testable
2. **Create type system** - Ensures type safety across all components
3. **Implement base UI components** - Reusable building blocks
4. **Build feature components** - Assemble into complete feature
5. **Integrate with context** - Connect to existing app state
6. **Polish and optimize** - Performance, accessibility, UX refinements

**Estimated Total Time**: 32-38 hours

---

## Task Hierarchy

### Epic 1: Foundation & Type System (6-8 hours)
- Task 1.1: Create type definitions
- Task 1.2: Create Icelandic loan presets and constants
- Task 1.3: Set up test infrastructure

### Epic 2: Core Calculation Engine (8-10 hours)
- Task 2.1: Implement standard amortization calculations
- Task 2.2: Implement inflation-indexed amortization
- Task 2.3: Implement investment growth calculations
- Task 2.4: Implement scenario comparison logic
- Task 2.5: Implement peace of mind adjustment
- Task 2.6: Implement break-even point detection
- Task 2.7: Implement reasoning generator

### Epic 3: UI Components - Inputs (6-7 hours)
- Task 3.1: Create DebtInputForm component
- Task 3.2: Create InvestmentInputForm component
- Task 3.3: Create LoanPresetSelector component
- Task 3.4: Create PeaceOfMindSlider component
- Task 3.5: Create validation utilities

### Epic 4: UI Components - Results Display (5-6 hours)
- Task 4.1: Create RecommendationCard component
- Task 4.2: Create DebtPayoffChart component
- Task 4.3: Create ComparisonTable component
- Task 4.4: Create ScenarioManager component

### Epic 5: Context Integration (3-4 hours)
- Task 5.1: Extend CalculatorContext with debt state
- Task 5.2: Implement localStorage persistence
- Task 5.3: Add scenario CRUD operations

### Epic 6: Main Page Integration (3-4 hours)
- Task 6.1: Create DebtPayoffAnalyzerPage container
- Task 6.2: Integrate with tab navigation
- Task 6.3: Wire up all components

### Epic 7: Advanced Features (Optional) (4-5 hours)
- Task 7.1: Implement MultipleDebtForm
- Task 7.2: Implement avalanche/snowball strategies
- Task 7.3: Add export/import functionality

### Epic 8: Polish & Optimization (3-4 hours)
- Task 8.1: Accessibility audit and fixes
- Task 8.2: Performance optimization
- Task 8.3: Mobile responsiveness testing
- Task 8.4: Icelandic text review

---

## Detailed Task Breakdown

---

## EPIC 1: Foundation & Type System

**Goal**: Establish type-safe foundation for all components and calculations.

**Duration**: 6-8 hours

**Dependencies**: None

---

### Task 1.1: Create Type Definitions

**Objective**: Define all TypeScript types and interfaces for debt payoff feature.

**Files to Create**:
- `src/types/debtPayoff.ts`

**Functionality**:
```typescript
// Core types
export type LoanType = 'verdtryggd' | 'oVerdtryggd' | 'other';
export type PayoffStrategy = 'avalanche' | 'snowball';

export interface DebtInput { ... }
export interface InvestmentAssumptions { ... }
export interface MonthlyProjection { ... }
export interface DebtPayoffResults { ... }
export interface DebtPayoffScenario { ... }
export interface LoanPreset { ... }
export interface MultipleDebtsResults { ... }
```

**Tests to Write**:
- Type compilation succeeds
- No TypeScript errors in test imports

**Acceptance Criteria**:
- [x] All types defined as per design document
- [x] Types exported from module
- [x] JSDoc comments on all interfaces
- [x] No compilation errors

**Requirements Trace**: Foundation for all user stories (US-1 through US-9)

**Estimated Time**: 1.5 hours

---

### Task 1.2: Create Icelandic Loan Presets and Constants

**Objective**: Define preset configurations for common Icelandic loan types.

**Files to Create**:
- `src/lib/constants/debtPayoff.ts`
- `src/lib/content/debtPayoff.ts`

**Functionality**:
```typescript
// constants/debtPayoff.ts
export const ICELANDIC_LOAN_PRESETS: LoanPreset[] = [
  {
    id: 'verdtryggd-husnaedislan',
    label: 'Verðtryggð húsnæðislán',
    // ... (6 presets total)
  }
];

export const DEFAULT_INVESTMENT_ASSUMPTIONS = { ... };
export const RISK_LEVEL_PRESETS = { ... };

// content/debtPayoff.ts
export const DEBT_PAYOFF_CONTENT = {
  loanTypes: { ... },
  recommendations: { ... },
  errors: { ... },
  tooltips: { ... },
};
```

**Tests to Write**:
- All presets have valid data
- Content keys exist for all enum values
- Number formatting functions work correctly

**Acceptance Criteria**:
- [x] 6 Icelandic loan presets defined
- [x] All text content in Icelandic
- [x] Investment risk level presets (conservative/moderate/aggressive)
- [x] Error messages and tooltips defined
- [x] Number formatting utilities for Icelandic locale

**Requirements Trace**: US-2 (Icelandic loan types), US-5 (Icelandic text)

**Estimated Time**: 2 hours

---

### Task 1.3: Set Up Test Infrastructure

**Objective**: Configure test utilities and fixtures for debt payoff tests.

**Files to Create**:
- `tests/lib/calculations/debtPayoff.test.ts` (skeleton)
- `tests/fixtures/debtPayoff.ts`

**Functionality**:
```typescript
// fixtures/debtPayoff.ts
export const mockDebtInputs = {
  standardLoan: DebtInput,
  indexedLoan: DebtInput,
  highInterestDebt: DebtInput,
};

export const mockInvestmentAssumptions = { ... };
export const mockActualHourlyWage = 5000;
```

**Tests to Write**:
- Test fixtures load correctly
- Mock data is valid

**Acceptance Criteria**:
- [x] Test fixtures for common scenarios
- [x] Mock data covers edge cases
- [x] Vitest configuration works with new files

**Requirements Trace**: Foundation for all testing

**Estimated Time**: 1.5 hours

---

### Task 1.4: Add Debt Scenarios to StoredState Type

**Objective**: Extend existing storage types to include debt scenarios.

**Files to Modify**:
- `src/types/calculator.ts`

**Functionality**:
```typescript
export interface StoredState {
  // ... existing fields
  debtScenarios?: DebtPayoffScenario[]; // Add this
  // ... rest
}
```

**Tests to Write**:
- Type checking passes
- Backwards compatibility maintained

**Acceptance Criteria**:
- [x] debtScenarios field added to StoredState
- [x] Field is optional for backwards compatibility
- [x] Import DebtPayoffScenario type correctly

**Requirements Trace**: US-8 (scenario persistence)

**Estimated Time**: 0.5 hours

---

## EPIC 2: Core Calculation Engine

**Goal**: Implement all mathematical calculations for debt analysis.

**Duration**: 8-10 hours

**Dependencies**: Epic 1 complete

---

### Task 2.1: Implement Standard Amortization Calculations

**Objective**: Calculate standard loan amortization schedules.

**Files to Create**:
- `src/lib/calculations/debtPayoff.ts` (start)

**Functionality**:
```typescript
export function calculateStandardAmortization(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): MonthlyProjection[] {
  // Implementation per design
}

// Helper functions
function calculateMonthlyInterest(balance: number, annualRate: number): number
function calculatePrincipalPayment(payment: number, interest: number, balance: number): number
```

**Tests to Write**:
```typescript
describe('calculateStandardAmortization', () => {
  it('calculates correct payoff timeline for typical loan', () => {
    const result = calculateStandardAmortization(1000000, 0.08, 30000);
    expect(result.length).toBe(40); // Approximate
    expect(result[result.length - 1].remainingDebt).toBeLessThan(1);
  });

  it('calculates correct total interest', () => {
    const result = calculateStandardAmortization(1000000, 0.08, 30000);
    const totalInterest = result[result.length - 1].interestPaid;
    expect(totalInterest).toBeGreaterThan(0);
    expect(totalInterest).toBeLessThan(1000000); // Sanity check
  });

  it('handles edge case: payment equals interest', () => {
    // Should error or take infinite time
  });

  it('handles very low balance correctly', () => {
    const result = calculateStandardAmortization(100, 0.05, 50);
    expect(result.length).toBe(3); // Should pay off quickly
  });
});
```

**Acceptance Criteria**:
- [x] Amortization calculation accurate to 2 decimal places
- [x] Handles edge cases (low balance, high rate)
- [x] Safety limit prevents infinite loops (max 600 months)
- [x] All tests pass

**Requirements Trace**: US-1 (debt payoff calculation), US-2 (óverðtryggð loans)

**Estimated Time**: 2 hours

---

### Task 2.2: Implement Inflation-Indexed Amortization

**Objective**: Calculate verðtryggð (inflation-indexed) loan amortization.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function calculateIndexedAmortization(
  balance: number,
  realRate: number,
  inflationRate: number,
  monthlyPayment: number
): MonthlyProjection[] {
  // Implementation with inflation indexing
}
```

**Tests to Write**:
```typescript
describe('calculateIndexedAmortization', () => {
  it('applies inflation adjustment to principal', () => {
    const result = calculateIndexedAmortization(1000000, 0.04, 0.03, 50000);
    // Balance should increase each month before payment
  });

  it('calculates higher total cost vs non-indexed', () => {
    const indexed = calculateIndexedAmortization(1000000, 0.04, 0.03, 50000);
    const standard = calculateStandardAmortization(1000000, 0.04, 50000);

    const indexedInterest = indexed[indexed.length - 1].interestPaid;
    const standardInterest = standard[standard.length - 1].interestPaid;

    expect(indexedInterest).toBeGreaterThan(standardInterest);
  });

  it('handles zero inflation correctly', () => {
    const indexed = calculateIndexedAmortization(1000000, 0.04, 0, 50000);
    const standard = calculateStandardAmortization(1000000, 0.04, 50000);

    // Should be nearly identical
    expect(indexed.length).toBe(standard.length);
  });
});
```

**Acceptance Criteria**:
- [x] Inflation correctly applied to principal each month
- [x] Real interest rate applied to indexed balance
- [x] Results match Icelandic bank calculators
- [x] All tests pass

**Requirements Trace**: US-2 (verðtryggð loans)

**Estimated Time**: 2 hours

---

### Task 2.3: Implement Investment Growth Calculations

**Objective**: Calculate compound investment growth with monthly contributions.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function calculateInvestmentGrowth(
  monthlyContribution: number,
  annualReturn: number,
  months: number
): MonthlyProjection[] {
  // Compound growth calculation
}
```

**Tests to Write**:
```typescript
describe('calculateInvestmentGrowth', () => {
  it('calculates correct future value', () => {
    const result = calculateInvestmentGrowth(10000, 0.07, 120); // 10 years
    const finalBalance = result[result.length - 1].investmentBalance;

    // 10k/month at 7% for 10 years ≈ 1,750,000 kr
    expect(finalBalance).toBeGreaterThan(1700000);
    expect(finalBalance).toBeLessThan(1800000);
  });

  it('handles 0% return (no growth)', () => {
    const result = calculateInvestmentGrowth(10000, 0, 12);
    expect(result[11].investmentBalance).toBe(120000); // Just contributions
  });

  it('separates contributions from gains', () => {
    const result = calculateInvestmentGrowth(10000, 0.07, 120);
    const totalContributions = 10000 * 120;
    const totalGains = result[result.length - 1].investmentGains;

    expect(totalGains).toBeGreaterThan(0);
    expect(totalContributions + totalGains).toBeCloseTo(
      result[result.length - 1].investmentBalance,
      0
    );
  });
});
```

**Acceptance Criteria**:
- [x] Compound growth formula correctly implemented
- [x] Monthly compounding applied
- [x] Separate tracking of contributions vs gains
- [x] All tests pass

**Requirements Trace**: US-1 (investment calculation)

**Estimated Time**: 1.5 hours

---

### Task 2.4: Implement Scenario Comparison Logic

**Objective**: Compare debt payoff vs investment scenarios and generate recommendation.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function compareDebtVsInvestment(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  actualHourlyWage: number,
  peacOfMindFactor: number = 0
): DebtPayoffResults {
  // 1. Calculate both scenarios
  // 2. Merge projections
  // 3. Generate comparison
  // 4. Apply peace of mind if needed
}

function mergeProjections(
  debtProjections: MonthlyProjection[],
  investmentProjections: MonthlyProjection[]
): MonthlyProjection[]

function determineRecommendation(
  debtScenario: DebtScenarioResults,
  investmentScenario: InvestmentScenarioResults
): 'debt' | 'invest'
```

**Tests to Write**:
```typescript
describe('compareDebtVsInvestment', () => {
  it('recommends debt payoff when rate > return', () => {
    const debt: DebtInput = { ...mockStandardLoan, nominalInterestRate: 0.09 };
    const investment: InvestmentAssumptions = { expectedAnnualReturn: 0.07, riskLevel: 'moderate' };

    const result = compareDebtVsInvestment(debt, investment, 5000);
    expect(result.comparison.recommendation).toBe('debt');
  });

  it('recommends investment when return > rate', () => {
    const debt: DebtInput = { ...mockStandardLoan, nominalInterestRate: 0.04 };
    const investment: InvestmentAssumptions = { expectedAnnualReturn: 0.08, riskLevel: 'aggressive' };

    const result = compareDebtVsInvestment(debt, investment, 5000);
    expect(result.comparison.recommendation).toBe('invest');
  });

  it('flags close calls correctly', () => {
    const debt: DebtInput = { ...mockStandardLoan, nominalInterestRate: 0.07 };
    const investment: InvestmentAssumptions = { expectedAnnualReturn: 0.075, riskLevel: 'moderate' };

    const result = compareDebtVsInvestment(debt, investment, 5000);
    expect(result.comparison.isCloseCall).toBe(true);
  });

  it('calculates life energy correctly', () => {
    const result = compareDebtVsInvestment(mockStandardLoan, mockInvestment, 5000);
    expect(result.comparison.lifeEnergyAdvantage).toBeGreaterThan(0);
  });
});
```

**Acceptance Criteria**:
- [x] Correct recommendation based on math
- [x] Financial advantage calculated accurately
- [x] Life energy conversion applied
- [x] Close call detection (< 5%)
- [x] All tests pass

**Requirements Trace**: US-1 (comparison), US-5 (recommendation)

**Estimated Time**: 2 hours

---

### Task 2.5: Implement Peace of Mind Adjustment

**Objective**: Apply emotional factor to debt payoff analysis.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function calculatePeaceOfMindAdjustment(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  peacOfMindFactor: number,
  actualHourlyWage: number
): {
  factor: number;
  adjustedRecommendation: 'debt' | 'invest';
  adjustedAdvantage: number;
} {
  // Increase effective debt rate by peace of mind %
  // Recalculate with adjusted rate
}
```

**Tests to Write**:
```typescript
describe('calculatePeaceOfMindAdjustment', () => {
  it('shifts recommendation when peace of mind applied', () => {
    const debt: DebtInput = { ...mockStandardLoan, nominalInterestRate: 0.06 };
    const investment: InvestmentAssumptions = { expectedAnnualReturn: 0.07, riskLevel: 'moderate' };

    const base = compareDebtVsInvestment(debt, investment, 5000, 0);
    expect(base.comparison.recommendation).toBe('invest');

    const adjusted = compareDebtVsInvestment(debt, investment, 5000, 3); // +3%
    expect(adjusted.peacOfMindAdjustment?.adjustedRecommendation).toBe('debt');
  });

  it('does not change strong recommendations', () => {
    const debt: DebtInput = { ...mockStandardLoan, nominalInterestRate: 0.15 }; // Credit card
    const investment: InvestmentAssumptions = { expectedAnnualReturn: 0.07, riskLevel: 'moderate' };

    const adjusted = compareDebtVsInvestment(debt, investment, 5000, 5);
    expect(adjusted.peacOfMindAdjustment?.adjustedRecommendation).toBe('debt');
  });
});
```

**Acceptance Criteria**:
- [x] Peace of mind factor adds to effective rate
- [x] Recalculation produces different results
- [x] Original and adjusted results both available
- [x] All tests pass

**Requirements Trace**: US-3 (peace of mind factor)

**Estimated Time**: 1 hour

---

### Task 2.6: Implement Break-Even Point Detection

**Objective**: Find the month where investment scenario overtakes debt payoff.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function findBreakEvenPoint(
  projections: MonthlyProjection[]
): number | null {
  // Find first month where investment net worth > debt payoff net worth
}
```

**Tests to Write**:
```typescript
describe('findBreakEvenPoint', () => {
  it('finds break-even when investment overtakes', () => {
    const result = compareDebtVsInvestment(
      { ...mockStandardLoan, nominalInterestRate: 0.05 },
      { expectedAnnualReturn: 0.08, riskLevel: 'aggressive' },
      5000
    );

    expect(result.comparison.breakEvenMonth).toBeGreaterThan(0);
    expect(result.comparison.breakEvenMonth).toBeLessThan(result.debtScenario.debtFreeMonth);
  });

  it('returns null when debt always wins', () => {
    const result = compareDebtVsInvestment(
      { ...mockStandardLoan, nominalInterestRate: 0.15 },
      { expectedAnnualReturn: 0.07, riskLevel: 'moderate' },
      5000
    );

    expect(result.comparison.breakEvenMonth).toBeNull();
  });
});
```

**Acceptance Criteria**:
- [x] Break-even month correctly identified
- [x] Returns null if never breaks even
- [x] All tests pass

**Requirements Trace**: US-4 (break-even visualization)

**Estimated Time**: 1 hour

---

### Task 2.7: Implement Reasoning Generator

**Objective**: Generate plain-language explanations in Icelandic.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function generateReasoning(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  recommendation: 'debt' | 'invest',
  breakEvenMonth: number | null,
  debtFreeMonth: number
): string[] {
  // Generate 3-5 reasoning points in Icelandic
}
```

**Tests to Write**:
```typescript
describe('generateReasoning', () => {
  it('includes rate comparison', () => {
    const reasoning = generateReasoning(
      { ...mockStandardLoan, nominalInterestRate: 0.09 },
      { expectedAnnualReturn: 0.07, riskLevel: 'moderate' },
      'debt',
      null,
      48
    );

    expect(reasoning.some(r => r.includes('9'))).toBe(true);
    expect(reasoning.some(r => r.includes('7'))).toBe(true);
  });

  it('mentions break-even when applicable', () => {
    const reasoning = generateReasoning(
      mockStandardLoan,
      mockInvestment,
      'invest',
      24,
      60
    );

    expect(reasoning.some(r => r.includes('24'))).toBe(true);
  });

  it('all text is in Icelandic', () => {
    const reasoning = generateReasoning(mockStandardLoan, mockInvestment, 'debt', null, 48);

    reasoning.forEach(r => {
      expect(r).toMatch(/[ðþæöáéíóúý]/i); // Contains Icelandic characters
    });
  });
});
```

**Acceptance Criteria**:
- [x] 3-5 reasoning points generated
- [x] All text in clear Icelandic
- [x] Mentions rate comparison, time horizon, risk
- [x] All tests pass

**Requirements Trace**: US-5 (reasoning)

**Estimated Time**: 1.5 hours

---

## EPIC 3: UI Components - Inputs

**Goal**: Build input forms for debt and investment data.

**Duration**: 6-7 hours

**Dependencies**: Epic 1, Epic 2

---

### Task 3.1: Create DebtInputForm Component

**Objective**: Build form for entering single debt details.

**Files to Create**:
- `src/components/debtPayoff/DebtInputForm.tsx`
- `tests/components/debtPayoff/DebtInputForm.test.tsx`

**Functionality**:
```typescript
interface DebtInputFormProps {
  debt: DebtInput | null;
  onSubmit: (debt: DebtInput) => void;
  onChange: (debt: Partial<DebtInput>) => void;
  actualHourlyWage: number;
}

export function DebtInputForm(props: DebtInputFormProps) {
  // Form with:
  // - Loan type selector
  // - Balance input (CurrencyInput)
  // - Interest rate input
  // - Conditional inflation rate (if verðtryggð)
  // - Minimum payment input
  // - Extra payment input
  // - Validation error display
}
```

**Tests to Write**:
```typescript
describe('DebtInputForm', () => {
  it('renders all input fields', () => {
    render(<DebtInputForm {...mockProps} />);
    expect(screen.getByLabelText(/staða/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vextir/i)).toBeInTheDocument();
  });

  it('shows inflation input only for verðtryggð', () => {
    const { rerender } = render(<DebtInputForm debt={mockOVerdtryggdDebt} {...mockProps} />);
    expect(screen.queryByLabelText(/verðbólga/i)).not.toBeInTheDocument();

    rerender(<DebtInputForm debt={mockVerdtryggdDebt} {...mockProps} />);
    expect(screen.getByLabelText(/verðbólga/i)).toBeInTheDocument();
  });

  it('validates balance > 0', () => {
    render(<DebtInputForm {...mockProps} />);
    const input = screen.getByLabelText(/staða/i);

    fireEvent.change(input, { target: { value: '-1000' } });
    fireEvent.blur(input);

    expect(screen.getByText(/hærri en 0/i)).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<DebtInputForm {...mockProps} onChange={onChange} />);

    const input = screen.getByLabelText(/staða/i);
    fireEvent.change(input, { target: { value: '1000000' } });

    expect(onChange).toHaveBeenCalledWith({ currentBalance: 1000000 });
  });
});
```

**Acceptance Criteria**:
- [x] All input fields present and functional
- [x] Conditional inflation field for verðtryggð
- [x] Real-time validation with Icelandic error messages
- [x] Uses existing CurrencyInput component
- [x] All tests pass

**Requirements Trace**: US-1 (debt input), US-2 (loan types)

**Estimated Time**: 2 hours

---

### Task 3.2: Create InvestmentInputForm Component

**Objective**: Build form for investment assumptions.

**Files to Create**:
- `src/components/debtPayoff/InvestmentInputForm.tsx`
- `tests/components/debtPayoff/InvestmentInputForm.test.tsx`

**Functionality**:
```typescript
interface InvestmentInputFormProps {
  assumptions: InvestmentAssumptions;
  onChange: (assumptions: Partial<InvestmentAssumptions>) => void;
}

export function InvestmentInputForm(props: InvestmentInputFormProps) {
  // Form with:
  // - Expected return rate input/slider
  // - Risk level selector (Conservative/Moderate/Aggressive)
  // - Contextual guidance (typical Icelandic returns)
}
```

**Tests to Write**:
```typescript
describe('InvestmentInputForm', () => {
  it('renders return rate input', () => {
    render(<InvestmentInputForm {...mockProps} />);
    expect(screen.getByLabelText(/ávöxtun/i)).toBeInTheDocument();
  });

  it('updates assumptions when risk level selected', () => {
    const onChange = vi.fn();
    render(<InvestmentInputForm {...mockProps} onChange={onChange} />);

    fireEvent.click(screen.getByText(/íhaldssöm/i)); // Conservative

    expect(onChange).toHaveBeenCalledWith({
      riskLevel: 'conservative',
      expectedAnnualReturn: expect.closeTo(0.045, 1), // 4-5%
    });
  });

  it('displays contextual guidance', () => {
    render(<InvestmentInputForm {...mockProps} />);
    expect(screen.getByText(/sögulegt meðaltal/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Return rate input with slider
- [x] Risk level presets update return rate
- [x] Contextual guidance displayed
- [x] All tests pass

**Requirements Trace**: US-1 (investment input), US-6 (explore scenarios)

**Estimated Time**: 1.5 hours

---

### Task 3.3: Create LoanPresetSelector Component

**Objective**: Quick selection of common Icelandic loan types.

**Files to Create**:
- `src/components/debtPayoff/LoanPresetSelector.tsx`
- `tests/components/debtPayoff/LoanPresetSelector.test.tsx`

**Functionality**:
```typescript
interface LoanPresetSelectorProps {
  onSelect: (preset: LoanPreset) => void;
}

export function LoanPresetSelector(props: LoanPresetSelectorProps) {
  // Grid of preset buttons:
  // - Verðtryggð húsnæðislán
  // - Óverðtryggð húsnæðislán
  // - Bílalán
  // - Kreditkort
  // - Námslán
  // - Persónulán
}
```

**Tests to Write**:
```typescript
describe('LoanPresetSelector', () => {
  it('renders all preset buttons', () => {
    render(<LoanPresetSelector {...mockProps} />);
    expect(screen.getByText(/verðtryggð húsnæðislán/i)).toBeInTheDocument();
    expect(screen.getByText(/bílalán/i)).toBeInTheDocument();
  });

  it('calls onSelect with preset data', () => {
    const onSelect = vi.fn();
    render(<LoanPresetSelector onSelect={onSelect} />);

    fireEvent.click(screen.getByText(/kreditkort/i));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'kreditkort' })
    );
  });

  it('displays preset descriptions on hover', () => {
    render(<LoanPresetSelector {...mockProps} />);
    const button = screen.getByText(/námslán/i);

    fireEvent.mouseEnter(button);
    expect(screen.getByText(/lánasjóði íslenskra námsmanna/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] All 6 presets displayed
- [x] Click applies preset to form
- [x] Hover shows description
- [x] All tests pass

**Requirements Trace**: US-2 (Icelandic loan types)

**Estimated Time**: 1.5 hours

---

### Task 3.4: Create PeaceOfMindSlider Component

**Objective**: Slider for emotional debt-free value.

**Files to Create**:
- `src/components/debtPayoff/PeaceOfMindSlider.tsx`
- `tests/components/debtPayoff/PeaceOfMindSlider.test.tsx`

**Functionality**:
```typescript
interface PeaceOfMindSliderProps {
  value: number; // 0-10%
  onChange: (value: number) => void;
}

export function PeaceOfMindSlider(props: PeaceOfMindSliderProps) {
  // Slider with:
  // - Range 0-10
  // - Visual markers at 0%, 3-5%, 7-10%
  // - Labels: Stærðfræðileg / Hóflegt / Sterkt
  // - Tooltip explanation
}
```

**Tests to Write**:
```typescript
describe('PeaceOfMindSlider', () => {
  it('renders slider with correct range', () => {
    render(<PeaceOfMindSlider value={0} onChange={vi.fn()} />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
  });

  it('calls onChange with new value', () => {
    const onChange = vi.fn();
    render(<PeaceOfMindSlider value={0} onChange={onChange} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '5' } });

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('displays contextual labels', () => {
    render(<PeaceOfMindSlider value={5} onChange={vi.fn()} />);
    expect(screen.getByText(/hóflegt/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Slider with 0-10 range
- [x] Visual markers and labels
- [x] Tooltip with explanation
- [x] All tests pass

**Requirements Trace**: US-3 (peace of mind factor)

**Estimated Time**: 1 hour

---

### Task 3.5: Create Validation Utilities

**Objective**: Reusable validation functions for debt inputs.

**Files to Create**:
- `src/lib/utils/debtValidation.ts`
- `tests/lib/utils/debtValidation.test.ts`

**Functionality**:
```typescript
interface ValidationErrors {
  balance?: string;
  interestRate?: string;
  inflationRate?: string;
  minimumPayment?: string;
  extraPayment?: string;
}

export function validateDebtInput(debt: DebtInput): ValidationErrors {
  // Validate all fields
  // Return errors object
}

export function validateMinimumPayment(
  payment: number,
  balance: number,
  rate: number
): string | null {
  // Ensure payment > monthly interest
}
```

**Tests to Write**:
```typescript
describe('validateDebtInput', () => {
  it('returns no errors for valid input', () => {
    const errors = validateDebtInput(mockValidDebt);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('validates balance > 0', () => {
    const errors = validateDebtInput({ ...mockValidDebt, currentBalance: 0 });
    expect(errors.balance).toBeDefined();
  });

  it('validates interest rate 0-50%', () => {
    const errors = validateDebtInput({ ...mockValidDebt, nominalInterestRate: 0.6 });
    expect(errors.interestRate).toBeDefined();
  });

  it('validates minimum payment > monthly interest', () => {
    const errors = validateDebtInput({
      ...mockValidDebt,
      currentBalance: 1000000,
      nominalInterestRate: 0.12,
      minimumPayment: 5000, // Less than 10,000/month interest
    });
    expect(errors.minimumPayment).toBeDefined();
  });
});
```

**Acceptance Criteria**:
- [x] All validation rules implemented
- [x] Icelandic error messages
- [x] Reusable across components
- [x] All tests pass

**Requirements Trace**: US-1 (input validation)

**Estimated Time**: 1 hour

---

## EPIC 4: UI Components - Results Display

**Goal**: Build components to display calculation results and recommendations.

**Duration**: 5-6 hours

**Dependencies**: Epic 2, Epic 3

---

### Task 4.1: Create RecommendationCard Component

**Objective**: Display clear, actionable recommendation with reasoning.

**Files to Create**:
- `src/components/debtPayoff/RecommendationCard.tsx`
- `tests/components/debtPayoff/RecommendationCard.test.tsx`

**Functionality**:
```typescript
interface RecommendationCardProps {
  recommendation: 'debt' | 'invest';
  financialAdvantage: number;
  lifeEnergyAdvantage: number;
  percentageAdvantage: number;
  reasoning: string[];
  isCloseCall: boolean;
  peacOfMindImpact?: { without: number; with: number };
}

export function RecommendationCard(props: RecommendationCardProps) {
  // Display:
  // - Recommendation (bold, large)
  // - Financial advantage (ISK, hours, %)
  // - Reasoning points (bullet list)
  // - Close call warning if applicable
  // - Peace of mind impact if applicable
  // - Disclaimer
}
```

**Tests to Write**:
```typescript
describe('RecommendationCard', () => {
  it('displays debt recommendation correctly', () => {
    render(<RecommendationCard recommendation="debt" {...mockProps} />);
    expect(screen.getByText(/borga aukalega á skuld/i)).toBeInTheDocument();
  });

  it('displays invest recommendation correctly', () => {
    render(<RecommendationCard recommendation="invest" {...mockProps} />);
    expect(screen.getByText(/fjárfesta aukapeninginn/i)).toBeInTheDocument();
  });

  it('shows financial advantage in multiple formats', () => {
    render(<RecommendationCard financialAdvantage={245678} lifeEnergyAdvantage={127} {...mockProps} />);
    expect(screen.getByText(/245\.678 kr/i)).toBeInTheDocument();
    expect(screen.getByText(/127.*vinnutímar/i)).toBeInTheDocument();
  });

  it('displays reasoning points', () => {
    const reasoning = ['Point 1', 'Point 2', 'Point 3'];
    render(<RecommendationCard reasoning={reasoning} {...mockProps} />);

    reasoning.forEach(point => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });
  });

  it('shows close call warning', () => {
    render(<RecommendationCard isCloseCall={true} {...mockProps} />);
    expect(screen.getByText(/marginal/i)).toBeInTheDocument();
  });

  it('displays disclaimer', () => {
    render(<RecommendationCard {...mockProps} />);
    expect(screen.getByText(/fræðsluverkfæri/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Recommendation clearly displayed
- [x] Financial advantage in ISK, hours, %
- [x] Reasoning points as bullet list
- [x] Close call messaging
- [x] Peace of mind impact (if applicable)
- [x] Disclaimer included
- [x] All tests pass

**Requirements Trace**: US-5 (recommendation and reasoning)

**Estimated Time**: 2 hours

---

### Task 4.2: Create DebtPayoffChart Component

**Objective**: Visualize net worth trajectories over time.

**Files to Create**:
- `src/components/debtPayoff/DebtPayoffChart.tsx`
- `tests/components/debtPayoff/DebtPayoffChart.test.tsx`

**Functionality**:
```typescript
interface DebtPayoffChartProps {
  debtScenario: MonthlyProjection[];
  investmentScenario: MonthlyProjection[];
  breakEvenMonth: number | null;
  debtFreeMonth: number;
}

export function DebtPayoffChart(props: DebtPayoffChartProps) {
  // Line chart with:
  // - Two lines (debt payoff, investment)
  // - Milestone markers
  // - Hover tooltips
  // - Responsive sizing
}
```

**Tests to Write**:
```typescript
describe('DebtPayoffChart', () => {
  it('renders chart with both lines', () => {
    render(<DebtPayoffChart {...mockProps} />);
    // Check canvas/SVG rendered
    expect(screen.getByTestId('debt-chart')).toBeInTheDocument();
  });

  it('shows milestone markers', () => {
    render(<DebtPayoffChart breakEvenMonth={24} debtFreeMonth={48} {...mockProps} />);
    // Check markers present
  });

  it('displays tooltip on hover', async () => {
    render(<DebtPayoffChart {...mockProps} />);
    const chart = screen.getByTestId('debt-chart');

    fireEvent.mouseMove(chart, { clientX: 100, clientY: 100 });

    // Tooltip should appear with month/values
  });

  it('handles empty data gracefully', () => {
    render(<DebtPayoffChart debtScenario={[]} investmentScenario={[]} {...mockProps} />);
    expect(screen.getByText(/engin gögn/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Chart renders with correct data
- [x] Milestone markers appear
- [x] Hover tooltips functional
- [x] Responsive to container size
- [x] Accessible (ARIA labels, screen reader description)
- [x] All tests pass

**Requirements Trace**: US-4 (visualization)

**Estimated Time**: 2.5 hours

---

### Task 4.3: Create ComparisonTable Component

**Objective**: Side-by-side tabular comparison of scenarios.

**Files to Create**:
- `src/components/debtPayoff/ComparisonTable.tsx`
- `tests/components/debtPayoff/ComparisonTable.test.tsx`

**Functionality**:
```typescript
interface ComparisonTableProps {
  debtScenario: DebtScenarioResults;
  investmentScenario: InvestmentScenarioResults;
  comparison: ComparisonResults;
}

export function ComparisonTable(props: ComparisonTableProps) {
  // Table with rows:
  // - Debt-free month
  // - Total interest paid / investment gains
  // - Final net worth
  // - Life energy cost
  // - Recommendation
}
```

**Tests to Write**:
```typescript
describe('ComparisonTable', () => {
  it('renders comparison data', () => {
    render(<ComparisonTable {...mockProps} />);
    expect(screen.getByText(/skuldlaus mánuður/i)).toBeInTheDocument();
  });

  it('highlights recommended scenario', () => {
    render(<ComparisonTable comparison={{ recommendation: 'debt', ... }} {...mockProps} />);
    // Check that debt column is highlighted
  });

  it('formats numbers correctly', () => {
    render(<ComparisonTable {...mockProps} />);
    // Check Icelandic number format (1.234.567,89)
  });
});
```

**Acceptance Criteria**:
- [x] All key metrics displayed
- [x] Recommended scenario highlighted
- [x] Icelandic number formatting
- [x] Mobile responsive (stacks on small screens)
- [x] All tests pass

**Requirements Trace**: US-1 (comparison display)

**Estimated Time**: 1.5 hours

---

### Task 4.4: Create ScenarioManager Component

**Objective**: Save, load, and manage debt scenarios.

**Files to Create**:
- `src/components/debtPayoff/ScenarioManager.tsx`
- `tests/components/debtPayoff/ScenarioManager.test.tsx`

**Functionality**:
```typescript
interface ScenarioManagerProps {
  scenarios: DebtPayoffScenario[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  maxScenarios: number;
}

export function ScenarioManager(props: ScenarioManagerProps) {
  // UI for:
  // - Save current (modal with name input)
  // - Grid of saved scenarios
  // - Load button on each
  // - Delete button with confirmation
  // - Export/import JSON
}
```

**Tests to Write**:
```typescript
describe('ScenarioManager', () => {
  it('opens save modal when save clicked', () => {
    render(<ScenarioManager scenarios={[]} onSave={vi.fn()} {...mockProps} />);
    fireEvent.click(screen.getByText(/vista/i));

    expect(screen.getByLabelText(/heiti/i)).toBeInTheDocument();
  });

  it('calls onSave with scenario name', () => {
    const onSave = vi.fn();
    render(<ScenarioManager onSave={onSave} {...mockProps} />);

    fireEvent.click(screen.getByText(/vista/i));
    fireEvent.change(screen.getByLabelText(/heiti/i), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText(/staðfesta/i));

    expect(onSave).toHaveBeenCalledWith('Test');
  });

  it('displays saved scenarios', () => {
    render(<ScenarioManager scenarios={mockScenarios} {...mockProps} />);
    mockScenarios.forEach(s => {
      expect(screen.getByText(s.name)).toBeInTheDocument();
    });
  });

  it('prevents saving more than max scenarios', () => {
    const scenarios = [mockScenario, mockScenario, mockScenario]; // 3 scenarios
    render(<ScenarioManager scenarios={scenarios} maxScenarios={3} {...mockProps} />);

    const saveButton = screen.getByText(/vista/i);
    expect(saveButton).toBeDisabled();
  });

  it('confirms before deleting', () => {
    render(<ScenarioManager scenarios={[mockScenario]} onDelete={vi.fn()} {...mockProps} />);
    fireEvent.click(screen.getByLabelText(/eyða/i));

    expect(screen.getByText(/ertu viss/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Save modal with name input
- [x] Scenario grid display
- [x] Load and delete functionality
- [x] Max 3 scenarios enforced
- [x] Delete confirmation
- [x] Export/import (optional for MVP)
- [x] All tests pass

**Requirements Trace**: US-8 (save and compare scenarios)

**Estimated Time**: 2 hours

---

## EPIC 5: Context Integration

**Goal**: Integrate debt analyzer with existing CalculatorContext.

**Duration**: 3-4 hours

**Dependencies**: Epic 2

---

### Task 5.1: Extend CalculatorContext with Debt State

**Objective**: Add debt scenario management to context.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`
- `tests/context/CalculatorContext.debtPayoff.test.tsx` (new)

**Functionality**:
```typescript
// Add to CalculatorContextType
interface CalculatorContextType {
  // ... existing

  debtScenarios: DebtPayoffScenario[];
  addDebtScenario: (name: string, debt: DebtInput, investment: InvestmentAssumptions, peacOfMind: number) => void;
  updateDebtScenario: (id: string, updates: Partial<DebtPayoffScenario>) => void;
  deleteDebtScenario: (id: string) => void;
  getDebtScenario: (id: string) => DebtPayoffScenario | undefined;
}

// Implementation
const [debtScenarios, setDebtScenarios] = useState<DebtPayoffScenario[]>([]);

const addDebtScenario = useCallback((name, debt, investment, peacOfMind) => {
  const results = compareDebtVsInvestment(debt, investment, results?.actualHourlyWage || 0, peacOfMind);
  const scenario = { id: generateId(), name, debt, investment, peacOfMind, results, ... };
  setDebtScenarios(prev => [...prev, scenario].slice(-3)); // Max 3
}, [results?.actualHourlyWage]);

// ... other methods
```

**Tests to Write**:
```typescript
describe('CalculatorContext - Debt Scenarios', () => {
  it('adds debt scenario', () => {
    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    act(() => {
      result.current.addDebtScenario('Test', mockDebt, mockInvestment, 0);
    });

    expect(result.current.debtScenarios.length).toBe(1);
    expect(result.current.debtScenarios[0].name).toBe('Test');
  });

  it('limits to 3 scenarios', () => {
    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    act(() => {
      result.current.addDebtScenario('S1', mockDebt, mockInvestment, 0);
      result.current.addDebtScenario('S2', mockDebt, mockInvestment, 0);
      result.current.addDebtScenario('S3', mockDebt, mockInvestment, 0);
      result.current.addDebtScenario('S4', mockDebt, mockInvestment, 0);
    });

    expect(result.current.debtScenarios.length).toBe(3);
    expect(result.current.debtScenarios[0].name).toBe('S2'); // S1 dropped
  });

  it('updates debt scenario', () => {
    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    act(() => {
      result.current.addDebtScenario('Test', mockDebt, mockInvestment, 0);
    });

    const id = result.current.debtScenarios[0].id;

    act(() => {
      result.current.updateDebtScenario(id, { name: 'Updated' });
    });

    expect(result.current.debtScenarios[0].name).toBe('Updated');
  });

  it('deletes debt scenario', () => {
    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    act(() => {
      result.current.addDebtScenario('Test', mockDebt, mockInvestment, 0);
    });

    const id = result.current.debtScenarios[0].id;

    act(() => {
      result.current.deleteDebtScenario(id);
    });

    expect(result.current.debtScenarios.length).toBe(0);
  });
});
```

**Acceptance Criteria**:
- [x] Context methods implemented
- [x] Calculations use actualHourlyWage from context
- [x] Max 3 scenarios enforced
- [x] All tests pass

**Requirements Trace**: US-8 (scenario management)

**Estimated Time**: 2 hours

---

### Task 5.2: Implement LocalStorage Persistence

**Objective**: Persist debt scenarios to localStorage.

**Files to Modify**:
- `src/context/CalculatorContext.tsx`

**Functionality**:
```typescript
// Load from localStorage on mount
useEffect(() => {
  const stored = safeGetItem<StoredState>(STORAGE_KEY);
  if (stored?.debtScenarios) {
    setDebtScenarios(stored.debtScenarios);
  }
}, []);

// Save to localStorage when scenarios change
useEffect(() => {
  if (debtScenarios.length > 0) {
    const currentState = safeGetItem<StoredState>(STORAGE_KEY);
    if (currentState) {
      safeSetItem(STORAGE_KEY, {
        ...currentState,
        debtScenarios,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
}, [debtScenarios]);
```

**Tests to Write**:
```typescript
describe('Debt Scenarios - Persistence', () => {
  it('loads scenarios from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      debtScenarios: [mockScenario],
      // ... other fields
    }));

    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    expect(result.current.debtScenarios.length).toBe(1);
  });

  it('saves scenarios to localStorage on change', () => {
    const { result } = renderHook(() => useCalculatorContext(), { wrapper: CalculatorProvider });

    act(() => {
      result.current.addDebtScenario('Test', mockDebt, mockInvestment, 0);
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.debtScenarios.length).toBe(1);
  });
});
```

**Acceptance Criteria**:
- [x] Scenarios loaded on mount
- [x] Scenarios saved on change
- [x] Uses existing safeGetItem/safeSetItem
- [x] Backwards compatible (optional field)
- [x] All tests pass

**Requirements Trace**: US-8 (persistence)

**Estimated Time**: 1 hour

---

### Task 5.3: Add Scenario CRUD Operations

**Objective**: Helper functions for scenario ID generation and management.

**Files to Create**:
- `src/lib/utils/debtScenarioHelpers.ts`
- `tests/lib/utils/debtScenarioHelpers.test.ts`

**Functionality**:
```typescript
export function generateDebtScenarioId(): string {
  return `debt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function exportScenarios(scenarios: DebtPayoffScenario[]): string {
  return JSON.stringify(scenarios, null, 2);
}

export function importScenarios(json: string): DebtPayoffScenario[] {
  try {
    const parsed = JSON.parse(json);
    // Validate structure
    return parsed;
  } catch {
    throw new Error('Invalid scenario JSON');
  }
}
```

**Tests to Write**:
```typescript
describe('debtScenarioHelpers', () => {
  it('generates unique IDs', () => {
    const id1 = generateDebtScenarioId();
    const id2 = generateDebtScenarioId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^debt-/);
  });

  it('exports scenarios to JSON', () => {
    const json = exportScenarios([mockScenario]);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('imports scenarios from JSON', () => {
    const json = exportScenarios([mockScenario]);
    const imported = importScenarios(json);

    expect(imported.length).toBe(1);
    expect(imported[0].name).toBe(mockScenario.name);
  });

  it('throws on invalid JSON', () => {
    expect(() => importScenarios('invalid')).toThrow();
  });
});
```

**Acceptance Criteria**:
- [x] Unique ID generation
- [x] Export to JSON string
- [x] Import with validation
- [x] All tests pass

**Requirements Trace**: US-8 (export/import)

**Estimated Time**: 1 hour

---

## EPIC 6: Main Page Integration

**Goal**: Create main container component and integrate with app navigation.

**Duration**: 3-4 hours

**Dependencies**: Epic 3, Epic 4, Epic 5

---

### Task 6.1: Create DebtPayoffAnalyzerPage Container

**Objective**: Main orchestrator component for the debt analyzer.

**Files to Create**:
- `src/components/debtPayoff/DebtPayoffAnalyzerPage.tsx`
- `src/components/debtPayoff/index.ts`
- `tests/components/debtPayoff/DebtPayoffAnalyzerPage.test.tsx`

**Functionality**:
```typescript
export function DebtPayoffAnalyzerPage() {
  const { results, debtScenarios, addDebtScenario } = useCalculatorContext();

  const [activeTab, setActiveTab] = useState<'single' | 'comparison'>('single');
  const [currentDebt, setCurrentDebt] = useState<DebtInput | null>(null);
  const [currentInvestment, setCurrentInvestment] = useState<InvestmentAssumptions>(DEFAULT_INVESTMENT);
  const [peacOfMind, setPeacOfMind] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<DebtPayoffResults | null>(null);

  // Calculate when debt/investment/peacOfMind changes
  useEffect(() => {
    if (currentDebt && results?.actualHourlyWage) {
      const results = compareDebtVsInvestment(
        currentDebt,
        currentInvestment,
        results.actualHourlyWage,
        peacOfMind
      );
      setAnalysisResults(results);
    }
  }, [currentDebt, currentInvestment, peacOfMind, results?.actualHourlyWage]);

  return (
    <PageLayout>
      <Section>
        <h1>Borga skuld eða fjárfesta?</h1>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="single">Einstök greining</Tab>
          <Tab value="comparison">Samanburður</Tab>
        </Tabs>

        {activeTab === 'single' && (
          <>
            <LoanPresetSelector onSelect={handlePresetSelect} />
            <DebtInputForm debt={currentDebt} onChange={setCurrentDebt} />
            <InvestmentInputForm assumptions={currentInvestment} onChange={setCurrentInvestment} />
            <PeaceOfMindSlider value={peacOfMind} onChange={setPeacOfMind} />

            {analysisResults && (
              <>
                <RecommendationCard {...analysisResults.comparison} peacOfMindImpact={...} />
                <DebtPayoffChart {...analysisResults} />
                <ComparisonTable {...analysisResults} />
              </>
            )}

            <ScenarioManager
              scenarios={debtScenarios}
              onSave={handleSaveScenario}
              onLoad={handleLoadScenario}
              onDelete={deleteDebtScenario}
            />
          </>
        )}

        {activeTab === 'comparison' && (
          <ScenarioComparisonView scenarios={debtScenarios} />
        )}
      </Section>
    </PageLayout>
  );
}
```

**Tests to Write**:
```typescript
describe('DebtPayoffAnalyzerPage', () => {
  it('renders main sections', () => {
    render(<DebtPayoffAnalyzerPage />);
    expect(screen.getByText(/borga skuld eða fjárfesta/i)).toBeInTheDocument();
  });

  it('calculates results when inputs change', () => {
    render(<DebtPayoffAnalyzerPage />);

    // Fill in debt form
    // Verify results appear
  });

  it('switches between tabs', () => {
    render(<DebtPayoffAnalyzerPage />);

    fireEvent.click(screen.getByText(/samanburður/i));
    expect(screen.getByText(/scenario comparison/i)).toBeInTheDocument();
  });

  it('integrates with CalculatorContext', () => {
    // Verify actualHourlyWage used
  });
});
```

**Acceptance Criteria**:
- [x] All child components integrated
- [x] Real-time calculation on input change
- [x] Tab navigation functional
- [x] Uses actualHourlyWage from context
- [x] All tests pass

**Requirements Trace**: All user stories

**Estimated Time**: 2.5 hours

---

### Task 6.2: Integrate with Tab Navigation

**Objective**: Add debt analyzer to existing calculator tab navigation.

**Files to Modify**:
- `src/components/layout/CalculatorTabsNav.tsx` (or equivalent)
- `src/app/page.tsx` (or routing file)

**Functionality**:
```typescript
// Add new tab
const CALCULATOR_TABS = [
  // ... existing tabs
  {
    id: 'debt-payoff',
    label: 'Skuld vs Fjárfesting',
    icon: <ScaleIcon />,
    component: DebtPayoffAnalyzerPage,
  },
];
```

**Tests to Write**:
```typescript
describe('Tab Navigation - Debt Payoff', () => {
  it('renders debt payoff tab', () => {
    render(<CalculatorTabsNav />);
    expect(screen.getByText(/skuld vs fjárfesting/i)).toBeInTheDocument();
  });

  it('navigates to debt payoff page', () => {
    render(<CalculatorTabsNav />);
    fireEvent.click(screen.getByText(/skuld vs fjárfesting/i));

    expect(screen.getByText(/borga skuld eða fjárfesta/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Tab added to navigation
- [x] Icon and label in Icelandic
- [x] Navigation functional
- [x] All tests pass

**Requirements Trace**: Integration requirement

**Estimated Time**: 0.5 hours

---

### Task 6.3: Wire Up All Components

**Objective**: Connect all pieces and ensure data flows correctly.

**Files to Modify**:
- Various components for props passing

**Functionality**:
- Ensure all props correctly passed
- Verify callbacks work end-to-end
- Test full user workflow

**Tests to Write**:
```typescript
describe('Debt Payoff Analyzer - Integration', () => {
  it('completes full workflow: input -> calculate -> save', async () => {
    render(<DebtPayoffAnalyzerPage />, { wrapper: CalculatorProvider });

    // 1. Select preset
    fireEvent.click(screen.getByText(/bílalán/i));

    // 2. Adjust inputs
    fireEvent.change(screen.getByLabelText(/staða/i), { target: { value: '2000000' } });

    // 3. Set peace of mind
    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });

    // 4. Verify recommendation appears
    await waitFor(() => {
      expect(screen.getByText(/ráðlegging/i)).toBeInTheDocument();
    });

    // 5. Save scenario
    fireEvent.click(screen.getByText(/vista/i));
    fireEvent.change(screen.getByLabelText(/heiti/i), { target: { value: 'Mitt bílalán' } });
    fireEvent.click(screen.getByText(/staðfesta/i));

    // 6. Verify scenario saved
    expect(screen.getByText(/mitt bílalán/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [x] Full workflow functional
- [x] Data flows correctly between components
- [x] No console errors
- [x] Integration test passes

**Requirements Trace**: All user stories

**Estimated Time**: 1 hour

---

## EPIC 7: Advanced Features (Optional)

**Goal**: Implement multiple debt management and advanced strategies.

**Duration**: 4-5 hours

**Dependencies**: Epic 6 complete

**Note**: These tasks are optional for MVP. Can be implemented in a future iteration.

---

### Task 7.1: Implement MultipleDebtForm

**Objective**: Manage multiple debts simultaneously.

**Files to Create**:
- `src/components/debtPayoff/MultipleDebtForm.tsx`
- `tests/components/debtPayoff/MultipleDebtForm.test.tsx`

**Functionality**:
```typescript
interface MultipleDebtFormProps {
  debts: DebtInput[];
  onAddDebt: () => void;
  onUpdateDebt: (id: string, debt: Partial<DebtInput>) => void;
  onDeleteDebt: (id: string) => void;
  payoffStrategy: 'avalanche' | 'snowball';
  onStrategyChange: (strategy: 'avalanche' | 'snowball') => void;
  extraPayment: number;
  onExtraPaymentChange: (amount: number) => void;
}

export function MultipleDebtForm(props: MultipleDebtFormProps) {
  // UI for managing up to 3 debts
  // Strategy selector
  // Payoff order visualization
}
```

**Acceptance Criteria**:
- [x] Add/update/delete debts (max 3)
- [x] Strategy selector
- [x] Payoff order displayed
- [x] All tests pass

**Requirements Trace**: US-7 (multiple debts)

**Estimated Time**: 2 hours

---

### Task 7.2: Implement Avalanche/Snowball Strategies

**Objective**: Calculate payoff order and results for different strategies.

**Files to Modify**:
- `src/lib/calculations/debtPayoff.ts`

**Functionality**:
```typescript
export function calculateMultipleDebtsAvalanche(
  debts: DebtInput[],
  extraPayment: number,
  actualHourlyWage: number
): MultipleDebtsResults {
  // Sort by highest interest rate
  // Apply extra payment to highest rate first
}

export function calculateMultipleDebtsSnowball(
  debts: DebtInput[],
  extraPayment: number,
  actualHourlyWage: number
): MultipleDebtsResults {
  // Sort by lowest balance
  // Apply extra payment to smallest debt first
}

export function compareStrategies(
  avalanche: MultipleDebtsResults,
  snowball: MultipleDebtsResults
): StrategyComparison {
  // Calculate interest savings
  // Calculate time savings
  // Generate emotional consideration text
}
```

**Acceptance Criteria**:
- [x] Avalanche strategy correct
- [x] Snowball strategy correct
- [x] Strategy comparison accurate
- [x] All tests pass

**Requirements Trace**: US-7 (debt strategies)

**Estimated Time**: 2 hours

---

### Task 7.3: Add Export/Import Functionality

**Objective**: Allow users to export/import scenarios as JSON.

**Files to Modify**:
- `src/components/debtPayoff/ScenarioManager.tsx`

**Functionality**:
```typescript
function handleExport() {
  const json = exportScenarios(scenarios);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `debt-scenarios-${Date.now()}.json`;
  a.click();
}

function handleImport(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = e.target?.result as string;
    const imported = importScenarios(json);
    // Merge with existing scenarios
  };
  reader.readAsText(file);
}
```

**Acceptance Criteria**:
- [x] Export downloads JSON file
- [x] Import validates and loads JSON
- [x] Error handling for invalid files
- [x] All tests pass

**Requirements Trace**: US-8 (export/import)

**Estimated Time**: 1.5 hours

---

## EPIC 8: Polish & Optimization

**Goal**: Final refinements for production readiness.

**Duration**: 3-4 hours

**Dependencies**: Epic 6 (and optionally Epic 7) complete

---

### Task 8.1: Accessibility Audit and Fixes

**Objective**: Ensure WCAG 2.1 AA compliance.

**Files to Audit**:
- All components

**Checks**:
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus indicators
- ARIA labels
- Form labels

**Fixes**:
```typescript
// Add ARIA labels to chart
<canvas role="img" aria-label="Net worth comparison chart showing debt payoff vs investment scenarios over time" />

// Ensure keyboard navigation
<button onKeyDown={(e) => e.key === 'Enter' && handleClick()} />

// Screen reader announcements
<div role="status" aria-live="polite">
  {recommendation && `Ráðlegging: ${recommendation}`}
</div>
```

**Acceptance Criteria**:
- [x] All interactive elements keyboard accessible
- [x] Screen reader announces changes
- [x] Color contrast ≥ 4.5:1
- [x] Focus indicators visible
- [x] ARIA labels on charts
- [x] Form labels associated

**Requirements Trace**: NFR (accessibility)

**Estimated Time**: 1.5 hours

---

### Task 8.2: Performance Optimization

**Objective**: Ensure calculations and rendering meet performance targets.

**Optimizations**:
```typescript
// Memoize calculation results
const analysisResults = useMemo(() => {
  if (!currentDebt || !results?.actualHourlyWage) return null;
  return compareDebtVsInvestment(currentDebt, currentInvestment, results.actualHourlyWage, peacOfMind);
}, [currentDebt, currentInvestment, peacOfMind, results?.actualHourlyWage]);

// Debounce input changes
const debouncedDebt = useDebounce(currentDebt, 300);

// Lazy load chart
const DebtPayoffChart = lazy(() => import('./DebtPayoffChart'));

// Throttle chart hover events
const handleChartHover = useThrottle((event) => {
  // Update tooltip
}, 16); // 60fps
```

**Metrics to Measure**:
- Calculation time (target: < 100ms)
- Chart render time (target: < 200ms)
- Input responsiveness (target: < 300ms)

**Acceptance Criteria**:
- [x] Calculations complete in < 100ms
- [x] Charts render in < 200ms
- [x] Input changes debounced
- [x] No unnecessary re-renders
- [x] Bundle size reasonable

**Requirements Trace**: NFR (performance)

**Estimated Time**: 1 hour

---

### Task 8.3: Mobile Responsiveness Testing

**Objective**: Ensure full functionality on mobile devices.

**Devices to Test**:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

**Checks**:
- Forms usable on small screens
- Charts readable and interactive
- Buttons large enough (44px min)
- No horizontal scroll
- Tab navigation works
- Sliders work with touch

**Fixes**:
```css
/* Stack comparison columns on mobile */
@media (max-width: 768px) {
  .comparison-table {
    display: block;
  }

  .comparison-column {
    width: 100%;
    margin-bottom: 1rem;
  }
}

/* Touch-friendly slider */
.peace-of-mind-slider {
  height: 44px;
  touch-action: none;
}
```

**Acceptance Criteria**:
- [x] Functional on screens ≥ 320px
- [x] Touch targets ≥ 44px
- [x] Charts scrollable/zoomable on mobile
- [x] No layout issues
- [x] All features accessible

**Requirements Trace**: US-9 (mobile responsive), NFR (browser support)

**Estimated Time**: 1 hour

---

### Task 8.4: Icelandic Text Review

**Objective**: Review all Icelandic text for accuracy and clarity.

**Review Areas**:
- UI labels
- Error messages
- Tooltips
- Recommendations
- Reasoning text
- Help text

**Process**:
1. Extract all Icelandic strings to content file
2. Review for:
   - Grammar
   - Clarity
   - Tone (friendly, educational)
   - Consistency
3. Get native speaker feedback (if available)
4. Update content file

**Acceptance Criteria**:
- [x] All text in clear Icelandic
- [x] No English except technical terms (if unavoidable)
- [x] Tone consistent with existing app
- [x] Error messages helpful
- [x] Native speaker approved (if possible)

**Requirements Trace**: NFR (localization)

**Estimated Time**: 1 hour

---

## Summary

### Total Estimated Time: 32-38 hours

### Epic Breakdown:
- Epic 1: Foundation & Type System - 6-8 hours
- Epic 2: Core Calculation Engine - 8-10 hours
- Epic 3: UI Components - Inputs - 6-7 hours
- Epic 4: UI Components - Results Display - 5-6 hours
- Epic 5: Context Integration - 3-4 hours
- Epic 6: Main Page Integration - 3-4 hours
- Epic 7: Advanced Features (Optional) - 4-5 hours
- Epic 8: Polish & Optimization - 3-4 hours

### Implementation Order:
1. Epic 1 (Foundation) - Enables all other work
2. Epic 2 (Calculations) - Core business logic
3. Epic 3 (Input Components) - User data entry
4. Epic 4 (Results Components) - Display results
5. Epic 5 (Context Integration) - State management
6. Epic 6 (Page Integration) - Assemble feature
7. Epic 8 (Polish) - Production ready
8. Epic 7 (Advanced) - Optional enhancements

### Critical Path:
Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 6 → Epic 8

### Testing Coverage Target:
- Unit tests: 80%+ coverage
- Component tests: All major components
- Integration tests: Full user workflows
- Accessibility: Manual + automated audit

---

## Risk Mitigation

### Risk: Chart Performance on Mobile
**Mitigation**: Use lightweight charting library, test early on mobile devices, fallback to table view if needed.

### Risk: Calculation Complexity
**Mitigation**: Thorough unit tests, validate against known loan calculators, start simple and add complexity incrementally.

### Risk: LocalStorage Limits
**Mitigation**: Limit to 3 scenarios max, compress data if needed, provide export as backup.

### Risk: Icelandic Text Accuracy
**Mitigation**: Review with native speaker, reference existing Icelandic financial sites, keep terminology consistent with rest of app.

---

## Success Criteria

Tasks complete when:

- ✅ All acceptance criteria met for each task
- ✅ All tests passing (unit, component, integration)
- ✅ No TypeScript errors
- ✅ No console errors in production build
- ✅ Accessibility audit passes
- ✅ Performance targets met
- ✅ Mobile functionality verified
- ✅ Code review approved
- ✅ User testing successful (if applicable)

---

## Next Steps After Completion

1. **User Testing**: Gather feedback from Icelandic users
2. **Iterate**: Address user feedback and bugs
3. **Monitor**: Track usage analytics and errors
4. **Enhance**: Implement Epic 7 (Advanced Features) if valuable
5. **Expand**: Consider additional features from requirements "Future Enhancements"

---

## Traceability: Tasks → Requirements → Design

| Task ID | Design Components | Requirements |
|---------|-------------------|--------------|
| 1.1-1.4 | Type system | US-1 through US-9 (foundation) |
| 2.1 | calculateStandardAmortization() | US-1, US-2 (óverðtryggð) |
| 2.2 | calculateIndexedAmortization() | US-2 (verðtryggð) |
| 2.3 | calculateInvestmentGrowth() | US-1 (investment) |
| 2.4 | compareDebtVsInvestment() | US-1, US-5 (comparison) |
| 2.5 | calculatePeaceOfMindAdjustment() | US-3 (peace of mind) |
| 2.6 | findBreakEvenPoint() | US-4 (visualization) |
| 2.7 | generateReasoning() | US-5 (reasoning) |
| 3.1 | DebtInputForm | US-1, US-2 (debt input) |
| 3.2 | InvestmentInputForm | US-1, US-6 (investment input) |
| 3.3 | LoanPresetSelector | US-2 (Icelandic presets) |
| 3.4 | PeaceOfMindSlider | US-3 (emotional factor) |
| 4.1 | RecommendationCard | US-5 (recommendation) |
| 4.2 | DebtPayoffChart | US-4 (visualization) |
| 4.3 | ComparisonTable | US-1 (comparison display) |
| 4.4 | ScenarioManager | US-8 (scenarios) |
| 5.1-5.3 | CalculatorContext extension | US-8 (persistence) |
| 6.1-6.3 | DebtPayoffAnalyzerPage | All user stories (integration) |
| 7.1-7.2 | MultipleDebtForm, strategies | US-7 (multiple debts) |
| 8.1 | Accessibility | NFR (WCAG AA) |
| 8.2 | Performance | NFR (< 100ms calculations) |
| 8.3 | Mobile | US-9 (responsive) |
| 8.4 | Icelandic text | NFR (localization) |

---

## Task Document Complete

This tasks breakdown provides a clear, sequenced implementation plan for the Debt Payoff vs Invest Analyzer feature. All tasks are:

- **Specific**: Clear objectives and deliverables
- **Testable**: Acceptance criteria and tests defined
- **Sized**: 2-6 hour estimates per task
- **Traceable**: Links to requirements and design
- **Sequenced**: Dependencies and order specified

Ready for implementation!
