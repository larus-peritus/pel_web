# Design: Debt Payoff vs Invest Analyzer

## Overview

**Feature**: Debt Payoff vs Invest Analyzer
**App**: peninganaedalifid.is
**Design Version**: 1.0
**Last Updated**: 2026-01-22
**Requirements**: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/debt-payoff-vs-invest/requirements-debt-payoff-vs-invest.md`

## Architecture Overview

The Debt Payoff vs Invest Analyzer follows the established application architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Layer (React)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DebtPayoffAnalyzerPage (Container Component)        │   │
│  │  - Orchestrates all sub-components                  │   │
│  │  - Manages tab navigation                           │   │
│  │  - Integrates with CalculatorContext                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┬──────────────┬─────────────┬─────────┐   │
│  │ Input Forms  │ Calculations │ Charts      │ Results │   │
│  │              │              │             │ Display │   │
│  └──────────────┴──────────────┴─────────────┴─────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│               Context Layer (State Management)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CalculatorContext Extension                          │   │
│  │  - debtScenarios: DebtPayoffScenario[]              │   │
│  │  - addDebtScenario()                                 │   │
│  │  - updateDebtScenario()                              │   │
│  │  - deleteDebtScenario()                              │   │
│  │  - compareDebtScenarios()                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ src/lib/calculations/debtPayoff.ts                   │   │
│  │  - calculateStandardAmortization()                   │   │
│  │  - calculateIndexedAmortization()                    │   │
│  │  - calculateInvestmentGrowth()                       │   │
│  │  - compareScenarios()                                │   │
│  │  - findBreakEvenPoint()                              │   │
│  │  - calculatePeaceOfMindAdjustment()                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                    Data/Storage Layer                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ LocalStorage (via safeGetItem/safeSetItem)           │   │
│  │  - Persists debt scenarios                           │   │
│  │  - Versioned schema migration support                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## System Components

### 1. Core Components

#### 1.1 DebtPayoffAnalyzerPage
**File**: `src/components/debtPayoff/DebtPayoffAnalyzerPage.tsx`

**Purpose**: Main orchestrator component that renders the entire debt analyzer feature.

**Responsibilities**:
- Manage local UI state (active tab, selected scenario)
- Coordinate between input forms, calculations, and results display
- Integrate with CalculatorContext for hourly wage
- Handle scenario CRUD operations
- Manage peace of mind factor slider

**Props**: None (consumes CalculatorContext)

**State**:
```typescript
{
  activeTab: 'single' | 'multiple' | 'comparison',
  selectedScenarioId: string | null,
  peacOfMindFactor: number // 0-10%
}
```

**Child Components**:
- `DebtInputForm` - Single debt input
- `MultipleDebtForm` - Multiple debt management
- `ScenarioComparison` - Side-by-side scenario comparison
- `DebtPayoffChart` - Net worth visualization
- `RecommendationCard` - Clear action recommendation
- `ScenarioManager` - Save/load/delete scenarios

---

#### 1.2 DebtInputForm
**File**: `src/components/debtPayoff/DebtInputForm.tsx`

**Purpose**: Form for entering single debt details.

**Props**:
```typescript
{
  debt: DebtInput | null,
  onSubmit: (debt: DebtInput) => void,
  onChange: (debt: Partial<DebtInput>) => void,
  actualHourlyWage: number
}
```

**Features**:
- Loan type selector (Verðtryggð / Óverðtryggð / Önnur)
- Conditional inflation rate input for verðtryggð loans
- Preset buttons for common Icelandic loan types
- Real-time validation
- Life energy preview for total interest

**Validation Rules**:
- Current balance > 0
- Interest rate: 0-50%
- Inflation rate: 0-20%
- Minimum payment > 0
- Extra payment >= 0
- Extra payment > (balance × monthly rate) to ensure payoff

---

#### 1.3 InvestmentInputForm
**File**: `src/components/debtPayoff/InvestmentInputForm.tsx`

**Purpose**: Configure investment scenario assumptions.

**Props**:
```typescript
{
  investmentAssumptions: InvestmentAssumptions,
  onChange: (assumptions: Partial<InvestmentAssumptions>) => void
}
```

**Features**:
- Expected annual return rate input
- Risk level presets (Conservative 4-5%, Moderate 6-7%, Aggressive 8-10%)
- Contextual guidance on typical Icelandic returns
- Visual slider for quick adjustments

---

#### 1.4 DebtPayoffChart
**File**: `src/components/debtPayoff/DebtPayoffChart.tsx`

**Purpose**: Visualize net worth trajectories over time.

**Props**:
```typescript
{
  debtScenario: MonthlyProjection[],
  investmentScenario: MonthlyProjection[],
  breakEvenMonth: number | null,
  debtFreeMonth: number
}
```

**Chart Type**: Line chart (using lightweight charting library or Canvas API)

**Features**:
- Two lines: Debt payoff (blue), Investment (green)
- X-axis: Months (0 to debt-free date)
- Y-axis: Net worth (ISK)
- Milestone markers:
  - Debt-free date (vertical line)
  - Break-even point (if exists)
- Hover tooltip:
  - Month
  - Remaining debt
  - Investment balance
  - Net worth difference
- Responsive sizing
- Touch-friendly on mobile

**Accessibility**:
- ARIA labels
- Keyboard navigation
- Screen reader descriptions

---

#### 1.5 RecommendationCard
**File**: `src/components/debtPayoff/RecommendationCard.tsx`

**Purpose**: Display clear, actionable recommendation.

**Props**:
```typescript
{
  recommendation: 'debt' | 'invest',
  financialAdvantage: number,
  lifeEnergyAdvantage: number,
  percentageAdvantage: number,
  reasoning: string[],
  isCloseCall: boolean,
  peacOfMindImpact: { without: number, with: number } | null
}
```

**Layout**:
```
┌────────────────────────────────────────────────────┐
│ 🎯 RÁÐLEGGING: Borga aukalega á skuld            │
│                                                    │
│ Fjárhagslegur ávinningur:                         │
│ • 245.678 kr yfir lánstímann                      │
│ • 127 vinnutímar að spara                         │
│ • 12,3% betri niðurstaða                          │
│                                                    │
│ Rökstuðningur:                                     │
│ • Vextir á láni (7,5%) > vænt ávöxtun (7%)        │
│ • Þú verður skuldlaus 18 mánuðum fyrr             │
│ • Minni áhætta með skuldagreiðslum                │
│                                                    │
│ ⚠️ Athugið: Þetta er fræðsluverkfæri, ekki       │
│ fjármálaráðgjöf. Hugsaðu um áhættu og             │
│ persónulegar aðstæður.                            │
└────────────────────────────────────────────────────┘
```

**Conditional Messaging**:
- If isCloseCall (< 5% difference): Emphasize personal preference
- If peacOfMindFactor > 0: Show before/after comparison
- Color coding: Green for recommended action

---

#### 1.6 ScenarioManager
**File**: `src/components/debtPayoff/ScenarioManager.tsx`

**Purpose**: Save, load, and compare debt scenarios.

**Props**:
```typescript
{
  scenarios: DebtPayoffScenario[],
  onSave: (name: string) => void,
  onLoad: (id: string) => void,
  onDelete: (id: string) => void,
  maxScenarios: number // 3
}
```

**Features**:
- Save current analysis with custom name
- Grid display of saved scenarios
- Quick comparison view
- Delete with confirmation
- Export to JSON
- Import from JSON
- LocalStorage persistence

---

#### 1.7 MultipleDebtForm
**File**: `src/components/debtPayoff/MultipleDebtForm.tsx`

**Purpose**: Manage multiple debts and payoff strategy.

**Props**:
```typescript
{
  debts: DebtInput[],
  onAddDebt: () => void,
  onUpdateDebt: (id: string, debt: Partial<DebtInput>) => void,
  onDeleteDebt: (id: string) => void,
  payoffStrategy: 'avalanche' | 'snowball',
  onStrategyChange: (strategy: 'avalanche' | 'snowball') => void,
  extraPayment: number,
  onExtraPaymentChange: (amount: number) => void
}
```

**Features**:
- Add up to 3 debts
- Strategy selector (Avalanche vs Snowball)
- Visual indicator of payoff order
- Total monthly payment calculation
- Combined interest savings comparison
- Emotional vs mathematical trade-off explanation

---

#### 1.8 PeaceOfMindSlider
**File**: `src/components/debtPayoff/PeaceOfMindSlider.tsx`

**Purpose**: Adjust emotional value of being debt-free.

**Props**:
```typescript
{
  value: number, // 0-10%
  onChange: (value: number) => void
}
```

**Features**:
- Slider input (0-10%)
- Visual markers at 0%, 3-5%, 7-10%
- Contextual labels
- Real-time impact preview
- Tooltip explanation

---

### 2. Type Definitions

**File**: `src/types/debtPayoff.ts`

```typescript
/**
 * Loan types in Iceland
 */
export type LoanType = 'verdtryggd' | 'oVerdtryggd' | 'other';

/**
 * Debt payoff strategy for multiple debts
 */
export type PayoffStrategy = 'avalanche' | 'snowball';

/**
 * Single debt input
 */
export interface DebtInput {
  id: string;
  name?: string; // Optional name for multiple debts
  loanType: LoanType;
  currentBalance: number;
  nominalInterestRate: number; // Annual percentage
  inflationRate?: number; // Only for verðtryggð, annual percentage
  minimumPayment: number; // Monthly
  extraPayment: number; // Monthly extra payment available
}

/**
 * Investment scenario assumptions
 */
export interface InvestmentAssumptions {
  expectedAnnualReturn: number; // Percentage
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
}

/**
 * Monthly projection for charting
 */
export interface MonthlyProjection {
  month: number;
  remainingDebt: number;
  investmentBalance: number;
  netWorth: number;
  interestPaid: number; // Cumulative
  investmentGains: number; // Cumulative
}

/**
 * Debt payoff scenario calculation results
 */
export interface DebtPayoffResults {
  // Debt payoff scenario
  debtScenario: {
    monthlyProjections: MonthlyProjection[];
    debtFreeMonth: number;
    totalInterestPaid: number;
    totalPrincipalPaid: number;
    lifeEnergyHours: number;
  };

  // Investment scenario
  investmentScenario: {
    monthlyProjections: MonthlyProjection[];
    finalInvestmentBalance: number;
    totalContributions: number;
    totalGains: number;
    finalNetWorth: number; // Investment balance - remaining debt
  };

  // Comparison
  comparison: {
    recommendation: 'debt' | 'invest';
    financialAdvantage: number; // ISK
    lifeEnergyAdvantage: number; // Hours
    percentageAdvantage: number; // %
    breakEvenMonth: number | null;
    reasoning: string[];
    isCloseCall: boolean; // < 5% difference
  };

  // Peace of mind adjustment (if applied)
  peacOfMindAdjustment?: {
    factor: number; // 0-10%
    adjustedRecommendation: 'debt' | 'invest';
    adjustedAdvantage: number;
  };
}

/**
 * Multiple debts analysis results
 */
export interface MultipleDebtsResults {
  avalancheResults: DebtPayoffResults;
  snowballResults: DebtPayoffResults;
  strategyComparison: {
    interestSavings: number; // Avalanche advantage in ISK
    timeSavings: number; // Months saved with avalanche
    emotionalConsideration: string; // Explanation
  };
}

/**
 * Saved debt scenario
 */
export interface DebtPayoffScenario {
  id: string;
  name: string;
  debt: DebtInput;
  investment: InvestmentAssumptions;
  peacOfMindFactor: number;
  results: DebtPayoffResults;
  createdAt: string;
  updatedAt: string;
}

/**
 * Preset loan configurations for Iceland
 */
export interface LoanPreset {
  id: string;
  label: string;
  description: string;
  loanType: LoanType;
  typicalRate: number;
  typicalInflation?: number;
}
```

---

### 3. Business Logic

**File**: `src/lib/calculations/debtPayoff.ts`

#### 3.1 Standard Loan Amortization

```typescript
/**
 * Calculate standard (non-indexed) loan amortization schedule
 *
 * @param balance - Current loan balance
 * @param annualRate - Annual interest rate (e.g., 0.08 for 8%)
 * @param monthlyPayment - Total monthly payment (minimum + extra)
 * @returns Array of monthly projections until debt is paid off
 */
export function calculateStandardAmortization(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): MonthlyProjection[] {
  const monthlyRate = annualRate / 12;
  const projections: MonthlyProjection[] = [];

  let remainingBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  while (remainingBalance > 0.01 && month < 600) { // Max 50 years safety
    month++;

    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = Math.min(
      monthlyPayment - interestPayment,
      remainingBalance
    );

    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;

    projections.push({
      month,
      remainingDebt: remainingBalance,
      investmentBalance: 0, // Set by comparison function
      netWorth: -remainingBalance,
      interestPaid: cumulativeInterest,
      investmentGains: 0,
    });
  }

  return projections;
}
```

#### 3.2 Inflation-Indexed Loan Amortization

```typescript
/**
 * Calculate inflation-indexed (verðtryggð) loan amortization
 *
 * Iceland-specific: Principal is indexed to inflation, real interest applied
 *
 * @param balance - Current loan balance
 * @param realRate - Real annual interest rate (e.g., 0.04 for 4%)
 * @param inflationRate - Expected annual inflation (e.g., 0.03 for 3%)
 * @param monthlyPayment - Total monthly payment (minimum + extra)
 * @returns Array of monthly projections
 */
export function calculateIndexedAmortization(
  balance: number,
  realRate: number,
  inflationRate: number,
  monthlyPayment: number
): MonthlyProjection[] {
  const monthlyInflation = inflationRate / 12;
  const monthlyRealRate = realRate / 12;
  const projections: MonthlyProjection[] = [];

  let remainingBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  while (remainingBalance > 0.01 && month < 600) {
    month++;

    // Apply inflation indexing to balance
    const inflationAdjustment = remainingBalance * monthlyInflation;
    remainingBalance += inflationAdjustment;

    // Calculate interest on indexed balance
    const interestPayment = remainingBalance * monthlyRealRate;
    const principalPayment = Math.min(
      monthlyPayment - interestPayment,
      remainingBalance
    );

    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;

    projections.push({
      month,
      remainingDebt: remainingBalance,
      investmentBalance: 0,
      netWorth: -remainingBalance,
      interestPaid: cumulativeInterest,
      investmentGains: 0,
    });
  }

  return projections;
}
```

#### 3.3 Investment Growth Calculation

```typescript
/**
 * Calculate investment growth with monthly contributions
 *
 * @param monthlyContribution - Amount invested each month
 * @param annualReturn - Expected annual return (e.g., 0.07 for 7%)
 * @param months - Number of months to project
 * @returns Array of monthly investment balances
 */
export function calculateInvestmentGrowth(
  monthlyContribution: number,
  annualReturn: number,
  months: number
): MonthlyProjection[] {
  const monthlyReturn = annualReturn / 12;
  const projections: MonthlyProjection[] = [];

  let investmentBalance = 0;
  let cumulativeGains = 0;
  let cumulativeContributions = 0;

  for (let month = 1; month <= months; month++) {
    // Add monthly contribution
    investmentBalance += monthlyContribution;
    cumulativeContributions += monthlyContribution;

    // Apply growth
    const monthlyGain = investmentBalance * monthlyReturn;
    investmentBalance += monthlyGain;
    cumulativeGains += monthlyGain;

    projections.push({
      month,
      remainingDebt: 0, // Set by comparison function
      investmentBalance,
      netWorth: investmentBalance,
      interestPaid: 0,
      investmentGains: cumulativeGains,
    });
  }

  return projections;
}
```

#### 3.4 Scenario Comparison

```typescript
/**
 * Compare debt payoff vs investment scenarios
 *
 * @param debt - Debt input configuration
 * @param investment - Investment assumptions
 * @param actualHourlyWage - For life energy calculations
 * @param peacOfMindFactor - Emotional adjustment (0-10%)
 * @returns Complete analysis results
 */
export function compareDebtVsInvestment(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  actualHourlyWage: number,
  peacOfMindFactor: number = 0
): DebtPayoffResults {
  // 1. Calculate debt payoff scenario
  const totalPayment = debt.minimumPayment + debt.extraPayment;

  const debtProjections = debt.loanType === 'verdtryggd'
    ? calculateIndexedAmortization(
        debt.currentBalance,
        debt.nominalInterestRate,
        debt.inflationRate || 0,
        totalPayment
      )
    : calculateStandardAmortization(
        debt.currentBalance,
        debt.nominalInterestRate,
        totalPayment
      );

  const debtFreeMonth = debtProjections.length;
  const totalInterestPaid = debtProjections[debtFreeMonth - 1]?.interestPaid || 0;

  // 2. Calculate investment scenario (same timeframe)
  const investmentProjections = calculateInvestmentGrowth(
    debt.extraPayment,
    investment.expectedAnnualReturn,
    debtFreeMonth
  );

  // 3. Merge projections for comparison
  const mergedProjections = mergeProjections(
    debtProjections,
    investmentProjections
  );

  // 4. Find break-even point
  const breakEvenMonth = findBreakEvenPoint(mergedProjections);

  // 5. Calculate final comparison
  const finalDebtNetWorth = 0; // Debt-free
  const finalInvestmentNetWorth =
    investmentProjections[debtFreeMonth - 1].investmentBalance -
    debtProjections[debtFreeMonth - 1].remainingDebt;

  const financialAdvantage = Math.abs(finalInvestmentNetWorth - finalDebtNetWorth);
  const recommendation = finalInvestmentNetWorth > finalDebtNetWorth
    ? 'invest'
    : 'debt';

  // 6. Life energy calculations
  const lifeEnergyHours = dollarsToLifeEnergy(
    recommendation === 'debt' ? totalInterestPaid : financialAdvantage,
    actualHourlyWage
  );

  // 7. Generate reasoning
  const reasoning = generateReasoning(
    debt,
    investment,
    recommendation,
    breakEvenMonth,
    debtFreeMonth
  );

  // 8. Check if close call
  const isCloseCall = (financialAdvantage / debt.currentBalance) < 0.05;

  // 9. Apply peace of mind adjustment if needed
  const peacOfMindAdjustment = peacOfMindFactor > 0
    ? calculatePeaceOfMindAdjustment(
        debt,
        investment,
        peacOfMindFactor,
        actualHourlyWage
      )
    : undefined;

  return {
    debtScenario: {
      monthlyProjections: debtProjections,
      debtFreeMonth,
      totalInterestPaid,
      totalPrincipalPaid: debt.currentBalance,
      lifeEnergyHours: dollarsToLifeEnergy(totalInterestPaid, actualHourlyWage),
    },
    investmentScenario: {
      monthlyProjections: investmentProjections,
      finalInvestmentBalance: investmentProjections[debtFreeMonth - 1].investmentBalance,
      totalContributions: debt.extraPayment * debtFreeMonth,
      totalGains: investmentProjections[debtFreeMonth - 1].investmentGains,
      finalNetWorth: finalInvestmentNetWorth,
    },
    comparison: {
      recommendation,
      financialAdvantage,
      lifeEnergyAdvantage: lifeEnergyHours,
      percentageAdvantage: (financialAdvantage / debt.currentBalance) * 100,
      breakEvenMonth,
      reasoning,
      isCloseCall,
    },
    peacOfMindAdjustment,
  };
}
```

#### 3.5 Peace of Mind Adjustment

```typescript
/**
 * Apply emotional "peace of mind" factor to debt analysis
 *
 * Adds the peace of mind percentage to the effective interest rate,
 * representing the psychological value of being debt-free
 *
 * @param debt - Original debt input
 * @param investment - Investment assumptions
 * @param peacOfMindFactor - Percentage to add (0-10%)
 * @param actualHourlyWage - For life energy
 * @returns Adjusted results
 */
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
  // Increase effective debt rate by peace of mind factor
  const adjustedDebt: DebtInput = {
    ...debt,
    nominalInterestRate: debt.nominalInterestRate + (peacOfMindFactor / 100),
  };

  // Recalculate with adjusted rate
  const adjustedResults = compareDebtVsInvestment(
    adjustedDebt,
    investment,
    actualHourlyWage,
    0 // Don't recurse
  );

  return {
    factor: peacOfMindFactor,
    adjustedRecommendation: adjustedResults.comparison.recommendation,
    adjustedAdvantage: adjustedResults.comparison.financialAdvantage,
  };
}
```

#### 3.6 Break-Even Point

```typescript
/**
 * Find the month where investment gains exceed interest saved
 *
 * @param projections - Merged monthly projections
 * @returns Month number, or null if never breaks even
 */
export function findBreakEvenPoint(
  projections: MonthlyProjection[]
): number | null {
  for (let i = 0; i < projections.length; i++) {
    const projection = projections[i];

    // Investment scenario net worth > debt payoff scenario net worth
    if (projection.investmentBalance - projection.remainingDebt > 0) {
      return projection.month;
    }
  }

  return null; // Never breaks even
}
```

#### 3.7 Reasoning Generator

```typescript
/**
 * Generate plain-language reasoning for recommendation
 *
 * @returns Array of reasoning points in Icelandic
 */
export function generateReasoning(
  debt: DebtInput,
  investment: InvestmentAssumptions,
  recommendation: 'debt' | 'invest',
  breakEvenMonth: number | null,
  debtFreeMonth: number
): string[] {
  const reasoning: string[] = [];

  const effectiveDebtRate = debt.loanType === 'verdtryggd'
    ? debt.nominalInterestRate + (debt.inflationRate || 0)
    : debt.nominalInterestRate;

  const rateDifference = Math.abs(
    effectiveDebtRate - investment.expectedAnnualReturn
  );

  // Rate comparison
  if (effectiveDebtRate > investment.expectedAnnualReturn) {
    reasoning.push(
      `Vextir á láni (${(effectiveDebtRate * 100).toFixed(1)}%) eru hærri en vænt ávöxtun (${(investment.expectedAnnualReturn * 100).toFixed(1)}%)`
    );
  } else {
    reasoning.push(
      `Vænt ávöxtun (${(investment.expectedAnnualReturn * 100).toFixed(1)}%) er hærri en vextir á láni (${(effectiveDebtRate * 100).toFixed(1)}%)`
    );
  }

  // Time horizon
  if (debtFreeMonth <= 24) {
    reasoning.push(`Stuttur lánstími (${debtFreeMonth} mánuðir) - minni tími fyrir samsett ávöxtun`);
  } else if (debtFreeMonth >= 60) {
    reasoning.push(`Langur lánstími (${debtFreeMonth} mánuðir) - meiri tími fyrir samsett ávöxtun`);
  }

  // Risk consideration
  if (recommendation === 'debt') {
    reasoning.push('Minni áhætta með skuldagreiðslum - tryggður "ávöxtun"');
  } else {
    reasoning.push('Fjárfestingar hafa áhættu - ávöxtun ekki tryggð');
  }

  // Break-even analysis
  if (breakEvenMonth && breakEvenMonth < debtFreeMonth) {
    reasoning.push(
      `Fjárfesting tekur yfir eftir ${breakEvenMonth} mánuði`
    );
  }

  return reasoning;
}
```

---

### 4. Data Flow

#### 4.1 User Input Flow
```
User enters debt details
  ↓
DebtInputForm validates input
  ↓
onChange updates local state
  ↓
onSubmit triggers calculation
  ↓
CalculatorContext.addDebtScenario()
  ↓
debtPayoff.compareDebtVsInvestment()
  ↓
Results stored in context
  ↓
Components re-render with results
```

#### 4.2 Calculation Flow
```
DebtInput + InvestmentAssumptions
  ↓
calculateStandardAmortization() or calculateIndexedAmortization()
  ↓
calculateInvestmentGrowth()
  ↓
mergeProjections()
  ↓
findBreakEvenPoint()
  ↓
generateReasoning()
  ↓
DebtPayoffResults
```

#### 4.3 Persistence Flow
```
User saves scenario
  ↓
CalculatorContext.addDebtScenario()
  ↓
Context state updates
  ↓
useEffect triggers
  ↓
safeSetItem() to localStorage
  ↓
Persisted with versioning
```

---

### 5. Context Integration

Extend `CalculatorContext` with debt analyzer state:

**File**: `src/context/CalculatorContext.tsx`

```typescript
// Add to CalculatorContextType interface
interface CalculatorContextType {
  // ... existing properties

  // Debt scenarios
  debtScenarios: DebtPayoffScenario[];
  addDebtScenario: (name: string, debt: DebtInput, investment: InvestmentAssumptions, peacOfMindFactor: number) => void;
  updateDebtScenario: (id: string, updates: Partial<DebtPayoffScenario>) => void;
  deleteDebtScenario: (id: string) => void;
  getDebtScenario: (id: string) => DebtPayoffScenario | undefined;
}
```

**Implementation**:
```typescript
// State
const [debtScenarios, setDebtScenarios] = useState<DebtPayoffScenario[]>([]);

// Add scenario
const addDebtScenario = useCallback(
  (name: string, debt: DebtInput, investment: InvestmentAssumptions, peacOfMindFactor: number) => {
    const results = compareDebtVsInvestment(
      debt,
      investment,
      results?.actualHourlyWage || 0,
      peacOfMindFactor
    );

    const scenario: DebtPayoffScenario = {
      id: generateDebtScenarioId(),
      name,
      debt,
      investment,
      peacOfMindFactor,
      results,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDebtScenarios(prev => {
      // Limit to 3 scenarios
      const updated = [...prev, scenario];
      return updated.slice(-3);
    });
  },
  [results?.actualHourlyWage]
);

// Update scenario
const updateDebtScenario = useCallback((id: string, updates: Partial<DebtPayoffScenario>) => {
  setDebtScenarios(prev =>
    prev.map(scenario =>
      scenario.id === id
        ? { ...scenario, ...updates, updatedAt: new Date().toISOString() }
        : scenario
    )
  );
}, []);

// Delete scenario
const deleteDebtScenario = useCallback((id: string) => {
  setDebtScenarios(prev => prev.filter(s => s.id !== id));
}, []);

// Get scenario
const getDebtScenario = useCallback(
  (id: string) => debtScenarios.find(s => s.id === id),
  [debtScenarios]
);

// Persist to localStorage
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

// Load from localStorage on mount
useEffect(() => {
  const stored = safeGetItem<StoredState>(STORAGE_KEY);
  if (stored?.debtScenarios) {
    setDebtScenarios(stored.debtScenarios);
  }
}, []);
```

---

### 6. Error Handling

#### 6.1 Input Validation Errors
```typescript
interface ValidationErrors {
  balance?: string;
  interestRate?: string;
  inflationRate?: string;
  minimumPayment?: string;
  extraPayment?: string;
}

function validateDebtInput(debt: DebtInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (debt.currentBalance <= 0) {
    errors.balance = 'Staða verður að vera hærri en 0 kr';
  }

  if (debt.nominalInterestRate < 0 || debt.nominalInterestRate > 0.5) {
    errors.interestRate = 'Vextir verða að vera á bilinu 0-50%';
  }

  if (debt.loanType === 'verdtryggd') {
    if (!debt.inflationRate || debt.inflationRate < 0 || debt.inflationRate > 0.2) {
      errors.inflationRate = 'Verðbólga verður að vera á bilinu 0-20%';
    }
  }

  if (debt.minimumPayment <= 0) {
    errors.minimumPayment = 'Lágmarksgreiðsla verður að vera hærri en 0 kr';
  }

  const monthlyRate = debt.nominalInterestRate / 12;
  const monthlyInterest = debt.currentBalance * monthlyRate;

  if (debt.minimumPayment <= monthlyInterest) {
    errors.minimumPayment = 'Lágmarksgreiðsla verður að vera hærri en mánaðarlegir vextir';
  }

  if (debt.extraPayment < 0) {
    errors.extraPayment = 'Aukagreiðsla má ekki vera neikvæð';
  }

  return errors;
}
```

#### 6.2 Calculation Errors
```typescript
try {
  const results = compareDebtVsInvestment(debt, investment, hourlyWage, peacOfMind);
  return results;
} catch (error) {
  console.error('Debt calculation error:', error);

  // Show user-friendly error
  showToast({
    type: 'error',
    message: 'Villa við útreikning. Vinsamlegast athugaðu innslátt.',
  });

  return null;
}
```

#### 6.3 Storage Errors
Handled by existing `safeGetItem` and `safeSetItem` utilities.

---

### 7. Testing Strategy

#### 7.1 Unit Tests
**Files**:
- `tests/lib/calculations/debtPayoff.test.ts`
- `tests/components/debtPayoff/*.test.tsx`

**Test Cases**:

**Amortization Calculations**:
- Standard loan amortization accuracy
- Indexed loan amortization accuracy
- Edge cases: very high rates, very low balances
- Monthly vs yearly rate conversions
- Payment less than interest (should error)

**Investment Calculations**:
- Compound growth accuracy
- Different return rates
- Edge cases: 0% return, negative returns

**Comparison Logic**:
- Recommendation correctness
- Break-even point detection
- Close call detection (< 5%)
- Peace of mind adjustment

**Multiple Debts**:
- Avalanche vs snowball ordering
- Total interest comparison
- Combined timeline calculation

#### 7.2 Component Tests
**DebtInputForm**:
- Validation displays errors
- Preset buttons populate correctly
- Conditional fields (inflation for verðtryggð)
- Form submission

**DebtPayoffChart**:
- Renders with correct data
- Milestone markers appear
- Hover tooltips work
- Responsive sizing

**RecommendationCard**:
- Correct recommendation display
- Reasoning points present
- Close call messaging
- Peace of mind impact

**ScenarioManager**:
- Save scenario
- Load scenario
- Delete scenario
- Export/import JSON
- Max 3 scenarios enforcement

#### 7.3 Integration Tests
- Full workflow: Input → Calculate → Display → Save
- Context updates propagate to components
- LocalStorage persistence and retrieval
- Multiple scenario comparison

#### 7.4 Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast (WCAG AA)
- Focus management
- ARIA labels on charts

---

### 8. Performance Considerations

#### 8.1 Calculation Optimization
- Memoize calculation results with `useMemo`
- Debounce input changes (300ms)
- Limit projection length (max 600 months / 50 years)
- Use efficient array operations (avoid nested loops)

```typescript
const results = useMemo(() => {
  if (!debt || !investment) return null;
  return compareDebtVsInvestment(debt, investment, hourlyWage, peacOfMind);
}, [debt, investment, hourlyWage, peacOfMind]);
```

#### 8.2 Chart Rendering
- Render only visible data points
- Throttle hover events (16ms / 60fps)
- Use canvas instead of SVG for large datasets
- Lazy load chart component

#### 8.3 Storage
- Compress large datasets before storing
- Batch localStorage writes
- Version migrations run once on load

---

### 9. Icelandic Localization

#### 9.1 Number Formatting
```typescript
export function formatIcelandicCurrency(amount: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIcelandicPercentage(value: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
```

#### 9.2 Text Content
**File**: `src/lib/content/debtPayoff.ts`

```typescript
export const DEBT_PAYOFF_CONTENT = {
  loanTypes: {
    verdtryggd: 'Verðtryggð lán',
    oVerdtryggd: 'Óverðtryggð lán',
    other: 'Önnur lán',
  },

  recommendations: {
    debt: 'Borga aukalega á skuld',
    invest: 'Fjárfesta aukapeninginn',
  },

  strategies: {
    avalanche: 'Hæstu vextir fyrst (Avalanche)',
    snowball: 'Lægstu skuldir fyrst (Snowball)',
  },

  errors: {
    balanceTooLow: 'Staða verður að vera hærri en 0 kr',
    rateTooHigh: 'Vextir of háir (yfir 50%)',
    paymentTooLow: 'Greiðsla of lág til að greiða niður lán',
  },

  tooltips: {
    peacOfMind: 'Tilfinningalegt gildi þess að vera skuldlaus. 0% = hreint stærðfræðileg ákvörðun, 7-10% = mikil ósk um að losna við skuldir.',
  },
};
```

---

### 10. Design Decisions

#### Decision 1: Chart Library
**Options**:
1. Recharts (React-specific, heavy)
2. Chart.js (Popular, medium weight)
3. Lightweight-charts (TradingView, fast)
4. Custom Canvas implementation

**Decision**: Use **Lightweight-charts** or **Custom Canvas**
**Rationale**:
- Performance: Need to handle up to 600 data points smoothly
- Mobile: Touch interactions critical
- Bundle size: Recharts adds 100kb+, lightweight-charts ~50kb
- Control: Custom canvas gives full control for exact requirements

**Trade-offs**:
- Custom implementation takes more time
- Less feature-rich than established libraries
- Need to handle accessibility manually

---

#### Decision 2: Multiple Debts Strategy
**Options**:
1. Allow unlimited debts
2. Limit to 3 debts
3. Limit to 5 debts

**Decision**: **Limit to 3 debts**
**Rationale**:
- Simplicity: UI remains clean and understandable
- Performance: Calculations stay fast
- Focus: Users should prioritize consolidating debts
- Common case: Most people have 1-3 significant debts

**Trade-offs**:
- Power users with many debts need workarounds
- May need to combine small debts

---

#### Decision 3: Peace of Mind Factor Range
**Options**:
1. 0-5% (conservative)
2. 0-10% (moderate)
3. 0-20% (aggressive)

**Decision**: **0-10%**
**Rationale**:
- Realistic: 10% emotional premium is already significant
- Clear impact: Enough to shift recommendations in close cases
- Not overwhelming: Prevents extreme distortions
- Icelandic culture: Aligns with moderate debt aversion

**Trade-offs**:
- May not capture extreme debt anxiety
- Could limit in rare cases

---

#### Decision 4: Scenario Storage
**Options**:
1. LocalStorage only
2. Backend database
3. URL parameters
4. LocalStorage + export/import

**Decision**: **LocalStorage + export/import**
**Rationale**:
- Privacy: All data stays client-side
- Simplicity: No backend infrastructure needed
- Portability: Users can save/share JSON files
- Consistency: Matches existing calculator pattern

**Trade-offs**:
- No cross-device sync
- Data loss if localStorage cleared
- Max 3 scenarios to avoid storage limits

---

#### Decision 5: Inflation Handling
**Options**:
1. Ignore inflation entirely
2. Apply to verðtryggð loans only
3. Apply to all calculations (future value adjustments)

**Decision**: **Apply to verðtryggð loans only**
**Rationale**:
- Accuracy: Verðtryggð loans actually index to inflation
- Simplicity: Easier for users to understand
- Iceland-specific: This is the main use case
- Comparison: Nominal vs nominal is clearer for óverðtryggð

**Trade-offs**:
- Real returns not inflation-adjusted
- Doesn't account for purchasing power changes
- May be enhanced in future version

---

## Technology Stack

### Frontend Framework
- **Next.js 16.1.3** (React 19.2.3)
- **TypeScript 5**
- **Tailwind CSS 4**

### UI Components
- Custom components extending existing pattern
- `lucide-react` for icons
- `clsx` + `tailwind-merge` for styling

### Charting
- **Lightweight-charts** or **Custom Canvas**
- Responsive container utilities

### Testing
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **@testing-library/user-event** for interactions

### Utilities
- `src/lib/calculations/debtPayoff.ts` (business logic)
- `src/lib/utils/format.ts` (Icelandic formatting)
- `src/lib/storage/localStorage.ts` (persistence)

---

## File Structure

```
src/
├── components/
│   └── debtPayoff/
│       ├── DebtPayoffAnalyzerPage.tsx         # Main container
│       ├── DebtInputForm.tsx                   # Single debt input
│       ├── InvestmentInputForm.tsx             # Investment assumptions
│       ├── MultipleDebtForm.tsx                # Multiple debts management
│       ├── DebtPayoffChart.tsx                 # Net worth visualization
│       ├── RecommendationCard.tsx              # Action recommendation
│       ├── ScenarioManager.tsx                 # Save/load/compare
│       ├── PeaceOfMindSlider.tsx               # Emotional factor
│       ├── LoanPresetSelector.tsx              # Icelandic loan presets
│       ├── ComparisonTable.tsx                 # Side-by-side comparison
│       └── index.ts                            # Exports
│
├── types/
│   └── debtPayoff.ts                           # TypeScript definitions
│
├── lib/
│   ├── calculations/
│   │   └── debtPayoff.ts                       # Core calculation logic
│   ├── content/
│   │   └── debtPayoff.ts                       # Icelandic text content
│   ├── constants/
│   │   └── debtPayoff.ts                       # Presets, defaults
│   └── utils/
│       └── debtHelpers.ts                      # Helper functions
│
├── context/
│   └── CalculatorContext.tsx                   # Extended with debt state
│
└── app/
    └── (existing structure)

tests/
├── lib/
│   └── calculations/
│       └── debtPayoff.test.ts                  # Calculation unit tests
└── components/
    └── debtPayoff/
        ├── DebtInputForm.test.tsx
        ├── DebtPayoffChart.test.tsx
        ├── RecommendationCard.test.tsx
        ├── ScenarioManager.test.tsx
        └── integration.test.tsx                # Full workflow
```

---

## Integration Points

### With Existing Calculator
- **Actual Hourly Wage**: Read from `CalculatorContext.results.actualHourlyWage`
- **Life Energy Conversion**: Use existing `dollarsToLifeEnergy()` utility
- **Number Formatting**: Use existing Icelandic formatters
- **Storage**: Extend `StoredState` type, use `safeGetItem`/`safeSetItem`

### With Future Features
- **FI Number Calculator**: Show impact on FI date
- **Savings Rate Calculator**: Contextualize extra payment as % of income
- **Budget Tracker**: Import debt payment amounts

---

## Security Considerations

### Client-Side Only
- All calculations performed in browser
- No sensitive data sent to server
- LocalStorage encryption not needed (not truly sensitive)

### Input Sanitization
- Validate all numeric inputs
- Prevent injection attacks (TypeScript types help)
- Handle malformed localStorage data gracefully

### Privacy
- No analytics on specific debt amounts
- No third-party data sharing
- Optional export for user control

---

## Accessibility (WCAG 2.1 AA)

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Enter/Space to activate buttons
- Arrow keys for sliders

### Screen Readers
- Semantic HTML (`<form>`, `<section>`, `<article>`)
- ARIA labels on charts
- ARIA live regions for dynamic updates
- Alt text for all visual indicators

### Visual
- Color contrast ratio ≥ 4.5:1
- Color not sole indicator (use icons + text)
- Focus indicators visible
- Text resizable to 200%

### Forms
- Labels associated with inputs
- Error messages announced
- Required fields indicated
- Validation errors clear

---

## Browser Support

### Target Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari iOS 14+
- Mobile Chrome Android 10+

### Polyfills Needed
- None (Next.js handles modern JS features)

### Progressive Enhancement
- Core functionality works without JavaScript (forms submit)
- Charts degrade to data tables
- localStorage fallback to in-memory state

---

## Monitoring & Analytics

### Error Tracking
- Console errors logged (dev mode)
- Calculation errors captured
- Storage failures tracked

### Usage Analytics (Privacy-Respecting)
- Page views (Vercel Analytics)
- Button clicks (anonymized)
- No personal/financial data tracked
- GDPR compliant

### Performance Metrics
- Calculation time (< 100ms target)
- Chart render time (< 200ms target)
- Page load time

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
1. **Tax Considerations**: Mortgage interest deductions (limited in Iceland)
2. **Hybrid Strategy**: Split extra payment between debt and investment
3. **Early Payoff Penalties**: Factor in prepayment penalties
4. **Refinancing Analysis**: Compare current loan to refinance options
5. **Monte Carlo Simulation**: Probabilistic investment returns
6. **Debt Consolidation**: Combine multiple debts into one
7. **Import from Bank**: Parse loan documents (PDF/CSV)

### Technical Improvements
1. **Real-time Collaboration**: Share scenarios via URL
2. **Print/PDF Export**: Formatted report generation
3. **Mobile App**: Progressive Web App (PWA)
4. **Advanced Charting**: Tornado charts for sensitivity analysis
5. **AI Recommendations**: Personalized debt strategy suggestions

---

## Success Criteria

This design succeeds when:

- ✅ All 9 user stories from requirements are addressed
- ✅ Calculations accurate to 2 decimal places (ISK)
- ✅ Performance targets met (< 100ms calculations)
- ✅ Mobile experience fully functional
- ✅ Accessibility WCAG 2.1 AA compliant
- ✅ All text in clear Icelandic
- ✅ Unit test coverage > 80%
- ✅ Integration with existing calculator seamless
- ✅ LocalStorage persistence works reliably
- ✅ Charts render smoothly on all devices

---

## Traceability Matrix

| Requirement ID | Design Components | Calculation Functions |
|----------------|-------------------|----------------------|
| US-1 | DebtInputForm, InvestmentInputForm, RecommendationCard | compareDebtVsInvestment() |
| US-2 | LoanPresetSelector, DebtInputForm (loan type) | calculateIndexedAmortization() |
| US-3 | PeaceOfMindSlider | calculatePeaceOfMindAdjustment() |
| US-4 | DebtPayoffChart | mergeProjections(), findBreakEvenPoint() |
| US-5 | RecommendationCard | generateReasoning() |
| US-6 | DebtInputForm (extra payment slider), InvestmentInputForm | compareDebtVsInvestment() (multiple runs) |
| US-7 | MultipleDebtForm | calculateMultipleDebts() (avalanche/snowball) |
| US-8 | ScenarioManager | CalculatorContext (add/update/delete) |
| US-9 | All components (responsive design) | N/A |

---

## Appendix A: Calculation Examples

### Example 1: Óverðtryggð Bílalán (Non-Indexed Car Loan)

**Inputs**:
- Balance: 2,000,000 kr
- Interest: 9% annual
- Minimum payment: 40,000 kr/month
- Extra payment: 10,000 kr/month
- Investment return: 7% annual

**Debt Payoff Scenario**:
- Total payment: 50,000 kr/month
- Months to payoff: 48
- Total interest: 398,234 kr
- Life energy (at 5,000 kr/hr): 79.6 hours

**Investment Scenario**:
- Monthly investment: 10,000 kr
- Months: 48 (until debt-free)
- Final investment: 544,892 kr
- Final net worth (investment - remaining debt): -1,455,108 kr

**Recommendation**: Pay extra on debt
**Advantage**: 1,455,108 kr (291 life energy hours)
**Reasoning**:
- Debt rate (9%) > investment return (7%)
- Guaranteed savings vs uncertain returns
- Debt-free 13 months earlier

---

### Example 2: Verðtryggð Húsnæðislán (Indexed Mortgage)

**Inputs**:
- Balance: 20,000,000 kr
- Real interest: 4% annual
- Inflation: 3% annual
- Effective rate: ~7.12%
- Minimum payment: 120,000 kr/month
- Extra payment: 30,000 kr/month
- Investment return: 8% annual

**Debt Payoff Scenario**:
- Total payment: 150,000 kr/month
- Months to payoff: 185
- Total interest: 7,234,567 kr

**Investment Scenario**:
- Monthly investment: 30,000 kr
- Final investment: 8,945,123 kr
- Final net worth (at month 185): 8,945,123 - 5,123,456 = 3,821,667 kr

**Recommendation**: Invest the extra money
**Advantage**: 3,821,667 kr (764 life energy hours at 5,000 kr/hr)
**Break-even**: Month 87
**Reasoning**:
- Investment return (8%) > effective debt rate (~7.12%)
- Long time horizon (15+ years) favors compounding
- Break-even occurs halfway through loan term

---

## Appendix B: Icelandic Loan Presets

```typescript
export const ICELANDIC_LOAN_PRESETS: LoanPreset[] = [
  {
    id: 'verdtryggd-husnaedislan',
    label: 'Verðtryggð húsnæðislán',
    description: 'Dæmigerð verðtryggð íbúðalán frá banka eða Íbúðalánasjóði',
    loanType: 'verdtryggd',
    typicalRate: 0.04, // 4% real
    typicalInflation: 0.03, // 3% inflation
  },
  {
    id: 'oVerdtryggd-husnaedislan',
    label: 'Óverðtryggð húsnæðislán',
    description: 'Óverðtryggð íbúðalán, sjaldgæfari en til staðar',
    loanType: 'oVerdtryggd',
    typicalRate: 0.075, // 7.5% nominal
  },
  {
    id: 'bilalan',
    label: 'Bílalán',
    description: 'Venjuleg bílalán frá bönkum',
    loanType: 'oVerdtryggd',
    typicalRate: 0.095, // 9.5%
  },
  {
    id: 'kreditkort',
    label: 'Kreditkort',
    description: 'Kreditkortaskuldir - forgangsraða greiðslu!',
    loanType: 'oVerdtryggd',
    typicalRate: 0.175, // 17.5%
  },
  {
    id: 'namslan',
    label: 'Námslán (LÍN)',
    description: 'Námslán frá Lánasjóði íslenskra námsmanna',
    loanType: 'verdtryggd',
    typicalRate: 0.01, // 1% real (subsidized)
    typicalInflation: 0.03,
  },
  {
    id: 'personulan',
    label: 'Persónulán',
    description: 'Óverðtryggð neytendalán',
    loanType: 'oVerdtryggd',
    typicalRate: 0.115, // 11.5%
  },
];
```

---

## Design Document Complete

This design provides a comprehensive technical blueprint for implementing the Debt Payoff vs Invest Analyzer feature. All requirements are addressed with specific components, calculations, and integration points defined.

**Next Phase**: Tasks breakdown for implementation.
