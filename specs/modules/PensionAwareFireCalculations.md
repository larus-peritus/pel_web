# Pension-Aware FIRE Calculations Module

## Location
`src/lib/calculations/pensionAwareFire.ts`

## Purpose
Core calculation engine for the Lífeyristengd FIRE Reiknivél (Pension-Aware FIRE Calculator). This module breaks retirement into distinct phases based on Iceland's three-tier pension system and calculates the true FI number by accounting for future pension income.

## Key Concept
Traditional FIRE calculators assume you need 25-30x annual expenses saved forever. In Iceland, this leads to significant "over-saving" because three pension sources become available at different ages:
- **Séreign** (Private Pension): Age 60
- **Lífeyrissjóður** (Occupational Pension): Age 62-72 (typically 67)
- **TR Ellilífeyrir** (State Pension): Age 67 (with means-testing)

This calculator determines exactly how much you need to bridge the gap until pensions start.

## Exports

### Main Orchestrator
- **`calculateRetirementPhases(state: PensionAwareFireState): RetirementPhase[]`**
  - Main entry point that returns all retirement phases
  - Returns 3 phases for retirement before age 60
  - Returns 2 phases for retirement between 60-66
  - Returns 1 phase for retirement at 67+
  - Phases are chained - remaining funds from one phase feed into the next

### Phase Calculators
- **`calculateGapPhase(state: PensionAwareFireState): RetirementPhase`**
  - Calculates self-funded period from retirement to age 60
  - Income sources: Savings withdrawal + investment returns only
  - Most challenging phase - fully self-funded

- **`calculateSereignBridgePhase(state: PensionAwareFireState, previousPhases: RetirementPhase[]): RetirementPhase`**
  - Calculates séreign bridge period (60-67 or retirement to 67)
  - Income sources: Séreign withdrawals + remaining savings + investment returns
  - Projects séreign balance to age 60
  - Uses any remaining funds from gap phase

- **`calculateFullPensionPhase(state: PensionAwareFireState, previousPhases: RetirementPhase[]): RetirementPhase`**
  - Calculates full pension period (67 to 90)
  - Income sources: Lífeyrissjóður + TR + remaining savings + investment returns
  - Typically has surplus when pensions cover expenses
  - Uses remaining funds from previous phases

### Income & Funding Calculations
- **`calculatePhaseIncome(phase: RetirementPhaseId, state: PensionAwareFireState, availableSavings: number, availableSereign: number): PhaseIncomeSources`**
  - Calculates all income sources for a specific phase
  - Different phases have different income sources
  - Returns breakdown of savings withdrawal, investment returns, and pension sources

- **`calculatePhaseFunding(monthlyExpenses: number, monthlyIncome: number, durationYears: number, investmentReturn: number): number`**
  - Calculates required funding at start of phase
  - Uses present value of annuity formula
  - Accounts for investment returns during drawdown
  - Formula: PV = PMT × [(1 - (1 + r)^-n) / r]

### Séreign Projection Functions (Task 3.4)
- **`calculateProjectedSereign(state: PensionAwareFireState): SereignProjection`**
  - Full séreign projection with detailed breakdown
  - Projects balance to age 60 with compound growth and employer match
  - Determines optimal withdrawal strategy for 60-67 bridge period
  - Handles three retirement scenarios:
    - Retire before 60: contributions stop at retirement, then pure growth to 60
    - Retire at 60: contributions continue until 60
    - Retire after 60: contributions continue until 60
  - Returns: `{ balanceAt60, monthlyWithdrawal60to67 }`
  - Used by: Main results calculation, PensionInputs component (live projection display)

- **`calculateSereignWithdrawal60to67(balanceAt60: number, monthlyExpenses: number, otherMonthlyIncome: number, investmentReturn: number): { monthlyWithdrawal, totalWithdrawn, remainingAt67 }`**
  - Calculates optimal séreign withdrawal strategy for 60-67 bridge period
  - Uses even withdrawal strategy (simplified approach)
  - Accounts for continued investment growth during withdrawals
  - Simulates month-by-month for accuracy
  - Returns monthly withdrawal amount, total withdrawn, and remaining at 67
  - Edge cases: Zero balance, no shortfall (other income covers expenses), zero return

- **`projectSereignGrowth(currentBalance: number, monthlyContribution: number, employerMatchPercent: number, years: number, annualReturn: number): number`**
  - Projects séreign balance with contributions and growth
  - Includes employer match in total monthly contributions
  - Uses monthly compounding for accuracy
  - Used internally by calculateProjectedSereign
  - Formula: FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]

### TR Means-Testing Functions (Task 3.3)
- **`calculateTREstimate(state: PensionAwareFireState): TREstimate`**
  - Full TR means-testing calculation with detailed breakdown
  - Main public API for TR calculation
  - Returns complete estimate including amount, reduction %, income above exemption, and flags
  - Handles manual overrides and expectFullTR settings
  - Used by: UI components to display TR information and educational content

- **`calculateIncomeAboveExemption(lifeyrissjodurMonthly: number): number`**
  - Calculates income that counts against TR means-testing
  - Only lífeyrissjóður counts; séreign does NOT count
  - Exemption threshold: 36,500 ISK/month
  - Returns amount above exemption (0 if below threshold)

- **`calculateTRReduction(incomeAboveExemption: number): number`**
  - Calculates TR reduction amount based on income above exemption
  - Reduction rate: 45% of income above exemption
  - Used internally by calculateTREstimate

- **`calculateTRWithMeansTesting(lifeyrissjodurMonthly: number, expectFullTR: boolean, manualOverride: number | null): number`**
  - Legacy function that returns only TR amount (no breakdown)
  - Still used by phase calculations for simplicity
  - Exemption: 36,500 ISK/month
  - Reduction rate: 45% of income above exemption
  - Maximum TR: 380,000 ISK/month (single person)

### Present Value Calculations (Task 3.2)
- **`calculatePresentValueOfPension(monthlyAmount: number, startAge: number, currentAge: number, endAge: number, discountRate: number): number`**
  - Discounts future pension income back to today's value
  - Two-step calculation:
    1. PV of annuity at start age: `PV = PMT × [(1 - (1 + r)^-n) / r]`
    2. Discount to today: `PV_today = PV_start / (1 + r)^years_until_start`
  - Edge cases: Zero amount, pension already started, zero discount rate
  - Used to determine how much less you need to save due to future pensions

- **`calculatePresentValueOfAllPensions(state: PensionAwareFireState): { lifeyrissjodur, tr, sereign, total }`**
  - Calculates PV of all three pension sources combined
  - Lífeyrissjóður: Discounted from start age to today
  - TR: Discounted from age 67 to today (with means-testing)
  - Séreign: Projected to 60, then discounted to today
  - Returns breakdown of each source plus total
  - Shows total value of future pensions in today's ISK

- **`calculateTraditionalFI(monthlyExpenses: number, fiMultiplier: number): number`**
  - Standard FIRE calculation: Annual expenses × multiplier
  - Assumes no pension income (ignores Iceland's pension system)
  - Formula: `monthlyExpenses × 12 × fiMultiplier`
  - Typically 30x for Iceland (3.33% withdrawal rate)
  - Results in massive over-saving compared to pension-aware approach

- **`calculatePensionAdjustedFI(state: PensionAwareFireState): number`**
  - The TRUE FI number - what you actually need to save
  - Key insight: You only need to bridge the gap until pensions start
  - Sums required funding for each phase:
    - Gap period: Full self-funding
    - Bridge period: Séreign + savings gap
    - Full pension period: Usually zero or minimal
  - Phase chaining accounts for funds flowing between phases
  - Almost always MUCH less than traditional FI (often 25-40% of traditional)

- **`calculateBridgeFundingNeeds(state: PensionAwareFireState): number`**
  - Simpler conceptual wrapper around pension-adjusted FI
  - Focuses on "bridging" from retirement to full pension coverage
  - Returns same value as calculatePensionAdjustedFI
  - Makes the concept clearer: you're bridging a gap, not saving forever

## Key Functionality

### Phase Determination
Based on retirement age:
- **Before 60**: Gap → Séreign Bridge → Full Pension (3 phases)
- **60-66**: Séreign Bridge → Full Pension (2 phases)
- **67+**: Full Pension only (1 phase)

### Phase Chaining
Funds flow between phases:
1. Gap phase depletes most savings but leaves remainder
2. Bridge phase uses gap remainder + projected séreign
3. Full pension phase uses any remaining funds

### Income Source Logic
- **Gap Phase**: Only savings + investment returns
- **Séreign Bridge**: Séreign + savings + investment returns
- **Full Pension**: Lífeyrissjóður + TR + savings + investment returns

### Surplus Detection
Full pension phase typically has surplus when:
- Lífeyrissjóður + TR ≥ Monthly expenses
- Results in growing savings during retirement
- Indicates potential for earlier retirement or higher expenses

## Dependencies
- `@/types/pensionAwareFire` - All type definitions
- `@/lib/constants/pensionAwareFire` - Pension system constants (ages, rates, thresholds)

## Tests
- **Location**: `tests/lib/calculations/pensionAwareFire.test.ts`
- **Coverage**: 132 tests covering all functions (all passing) - Task 8.1 Complete
- **Test Categories**:
  - Phase determination (7 tests)
  - Gap phase calculations (5 tests)
  - Séreign bridge calculations (5 tests)
  - Full pension calculations (5 tests)
  - Income calculations (4 tests)
  - Funding calculations (6 tests)
  - Séreign projections (6 tests)
  - TR means-testing (8 tests - legacy function)
  - calculateIncomeAboveExemption (6 tests)
  - calculateTRReduction (5 tests)
  - calculateTREstimate (12 tests)
  - Integration tests (5 tests)
  - TR Means-Testing Edge Cases (5 tests)
  - **calculateProjectedSereign (7 tests - Task 3.4)**
  - **calculateSereignWithdrawal60to67 (8 tests - Task 3.4)**
  - **calculatePresentValueOfPension (8 tests - Task 3.2)**
  - **calculatePresentValueOfAllPensions (5 tests - Task 3.2)**
  - **calculateTraditionalFI (4 tests - Task 3.2)**
  - **calculatePensionAdjustedFI (4 tests - Task 3.2)**
  - **calculateBridgeFundingNeeds (2 tests - Task 3.2)**
  - **Present Value Integration Tests (2 tests - Task 3.2)**
  - **Edge Cases: Extreme Retirement Ages (4 tests - Task 8.1)**
  - **Boundary Conditions: Exact Pension Ages (5 tests - Task 8.1)**
  - **Integration: Full Calculation Flow (4 tests - Task 8.1)**

## Edge Cases Handled
- Zero duration phases
- Negative years (past pension age)
- Zero investment returns
- Zero contributions
- Income exceeding expenses
- Manual TR overrides
- Missing séreign balance
- Retirement at exact pension ages (60, 62, 67)
- Very early retirement (age 40 with 20-year gap)
- Very late retirement (age 70+ after all pensions active)
- Boundary conditions at all pension threshold ages
- High pension income scenarios (surplus throughout retirement)
- Low pension income scenarios (minimal benefit)

## Integration
- Used by: Context integration (future Task 4.1)
- Uses: Type definitions (Task 1.1), Constants (Task 2.1)

## Related
- Implements: Requirements US-1, US-2, US-3, US-4, FR-2, FR-3, FR-5 from `specs/requirements-pension-aware-fire.md`
- Part of: Epic 3 - Calculation Engine in `specs/tasks-pension-aware-fire.md`
- Task 3.1: Phase calculations (completed 2026-01-30)
- **Task 3.2: Present Value Calculations (completed 2026-01-30)**
- Task 3.3: TR Means-Testing Integration (completed 2026-01-30)
- **Task 3.4: Séreign Projection Functions (completed 2026-01-30)**
- Design: Phase calculation logic from `specs/design-pension-aware-fire.md`

## Mathematical Formulas

### Present Value of Annuity (Phase Funding)
```
PV = PMT × [(1 - (1 + r)^-n) / r]

Where:
  PMT = Monthly payment (expenses - income)
  r = Monthly return rate (annual / 12)
  n = Number of months (years × 12)
```

### Future Value with Contributions (Séreign Projection)
```
FV = PV(1 + r)^n + PMT × [((1 + r)^n - 1) / r]

Where:
  PV = Current balance
  PMT = Total monthly contribution (employee + employer match)
  r = Monthly return rate
  n = Number of months
```

### TR Means-Testing
```
TR = MAX(0, TR_MAX - REDUCTION)

REDUCTION = MAX(0, LIFEYRISSJODUR - EXEMPTION) × REDUCTION_RATE

Where:
  TR_MAX = 380,000 ISK (2024 rates)
  EXEMPTION = 36,500 ISK
  REDUCTION_RATE = 0.45 (45%)
```

### Present Value of Future Pension (Task 3.2)
```
Step 1: PV at start age
  PV_start = PMT × [(1 - (1 + r)^-n) / r]

Step 2: Discount to today
  PV_today = PV_start / (1 + r)^years_until_start

Where:
  PMT = Monthly pension amount
  r = Monthly discount rate (annual / 12)
  n = Number of months from start to end
  years_until_start = startAge - currentAge
```

### Pension-Adjusted FI Number (Task 3.2)
```
Pension_Adjusted_FI = Σ (phase.requiredAtStart - previousPhase.remainingAtEnd)

Where each phase requires funding for the gap:
  Gap Phase: Cover full expenses (no pension)
  Bridge Phase: Cover expenses minus séreign
  Full Pension Phase: Cover expenses minus (lífeyrissjóður + TR)

Traditional_FI = monthlyExpenses × 12 × 30 = ~144M ISK
Pension_Adjusted_FI = ~38M ISK (example)
Savings = ~106M ISK (~73% reduction!)
```

**TREstimate Return Type (Task 3.3):**
```typescript
interface TREstimate {
  estimatedMonthly: number;      // Final TR amount after means-testing (ISK)
  reductionPercent: number;       // % reduction (0-100)
  incomeAboveExemption: number;   // Amount above 36,500 ISK exemption
  isFullTR: boolean;              // True if receiving max TR (380,000)
  isZeroTR: boolean;              // True if TR reduced to zero
}
```

## Example Calculation Flow

For a 35-year-old retiring at 52:

1. **Gap Phase (52-60, 8 years)**
   - Required: ~23M ISK to cover 300k/month expenses
   - Remainder: ~5M ISK

2. **Séreign Bridge (60-67, 7 years)**
   - Projected séreign at 60: ~15M ISK
   - Monthly séreign withdrawal: ~180k ISK
   - Gap to fill: ~120k ISK from savings
   - Uses 5M remainder from gap

3. **Full Pension (67-90, 23 years)**
   - Lífeyrissjóður: 350k ISK/month
   - TR (after means-testing): ~220k ISK/month
   - Total pension: 570k ISK/month
   - Surplus: 270k ISK/month (expenses only 300k)

## Performance
- All calculations complete in < 1ms
- No external API calls
- Pure functions (deterministic)
- Suitable for real-time UI updates

## Future Enhancements (Not in MVP)
- Inflation adjustment options
- Variable expense scenarios
- Pension cola (cost of living adjustments)
- Partial lífeyrissjóður withdrawal strategies
- Monte Carlo simulation for uncertainty
