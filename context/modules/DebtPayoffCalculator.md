# Debt Payoff vs Invest Analyzer

## Location
- Types: `apps/peninganaedalifid/src/types/debtPayoff.ts`
- Calculations: `apps/peninganaedalifid/src/lib/calculations/debtPayoff.ts`
- Constants: `apps/peninganaedalifid/src/lib/constants/debtPayoff.ts`
- Content: `apps/peninganaedalifid/src/lib/content/debtPayoff.ts`
- Validation: `apps/peninganaedalifid/src/lib/utils/debtValidation.ts`
- Helpers: `apps/peninganaedalifid/src/lib/utils/debtScenarioHelpers.ts`
- Components: `apps/peninganaedalifid/src/components/debtPayoff/`
- Page: `apps/peninganaedalifid/src/app/debt-payoff/page.tsx`

## Purpose
Helps users make informed decisions about whether to pay extra on debt or invest the money, considering both mathematical returns and emotional factors (peace of mind from being debt-free).

## Key Features

### 1. Icelandic Loan Types Support
- **Verðtryggð lán** (inflation-indexed loans): Principal indexed to inflation, real interest applied
- **Óverðtryggð lán** (non-indexed loans): Standard fixed-rate amortization
- **Önnur lán** (other loans): Generic loan category

### 2. Core Calculations

#### Standard Amortization
- Function: `calculateStandardAmortization(balance, annualRate, monthlyPayment)`
- Monthly interest rate: `annualRate / 12`
- Calculates month-by-month until debt is paid off
- Safety limit: 600 months (50 years)

#### Inflation-Indexed Amortization
- Function: `calculateIndexedAmortization(balance, realRate, inflationRate, monthlyPayment)`
- Applies monthly inflation to principal FIRST
- Then applies real interest rate
- Iceland-specific implementation for verðtryggð loans

#### Investment Growth
- Function: `calculateInvestmentGrowth(monthlyContribution, annualReturn, months)`
- Compound growth with monthly contributions
- Tracks contributions separately from gains
- Monthly compounding

### 3. Scenario Comparison
- Function: `compareDebtVsInvestment(debt, investment, actualHourlyWage, peacOfMindFactor)`
- Calculates both debt payoff and investment scenarios
- Finds break-even point (when investment overtakes)
- Generates Icelandic reasoning for recommendation
- Detects "close calls" (< 5% difference)

### 4. Peace of Mind Factor
- Range: 0-10%
- Adds to effective debt interest rate
- Represents emotional value of being debt-free
- 0% = pure mathematical decision
- 7-10% = strong preference for debt-free status

### 5. Icelandic Loan Presets
Six common loan types in Iceland:
1. **Verðtryggð húsnæðislán** - 4% real + 3% inflation
2. **Óverðtryggð húsnæðislán** - 7.5% nominal
3. **Bílalán** - 9.5%
4. **Kreditkort** - 17.5%
5. **Námslán (LÍN)** - 1% real (subsidized)
6. **Persónulán** - 11.5%

## Type System

### DebtInput
```typescript
interface DebtInput {
  id: string;
  name?: string;
  loanType: 'verdtryggd' | 'oVerdtryggd' | 'other';
  currentBalance: number;
  nominalInterestRate: number;
  inflationRate?: number;
  minimumPayment: number;
  extraPayment: number;
}
```

### InvestmentAssumptions
```typescript
interface InvestmentAssumptions {
  expectedAnnualReturn: number;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
}
```

### DebtPayoffResults
Complete results including:
- Debt scenario projections
- Investment scenario projections
- Comparison with recommendation
- Optional peace of mind adjustment

## Validation

### Debt Validation Rules
- Balance: > 0 kr, < 100M kr
- Interest rate: 0-50%
- Inflation rate: 0-20% (if verðtryggð)
- Minimum payment: > monthly interest
- Extra payment: ≥ 0, < 1M kr/month
- Name: ≤ 50 characters

### Investment Validation Rules
- Expected return: 0-20% annually
- Risk level: conservative/moderate/aggressive

## Icelandic Content

All UI text in Icelandic:
- Loan type labels
- Field labels
- Error messages
- Tooltips
- Recommendation text
- Reasoning generation

### Helper Functions
- `formatMonthsText(months)` - "1 mánuði", "2 árum og 3 mánuðum"
- `formatLifeEnergyText(hours)` - "5 dagar og 3 vinnutímar"

## Components

### DebtPayoffPage
Main orchestrator component with:
- Preset selector (6 Icelandic loan types)
- Debt input form
- Investment assumptions form
- Peace of mind slider
- Results display with recommendation
- Comparison cards (debt vs investment)

## Integration

### CalculatorContext
- Extends `StoredState` with `debtScenarios?: DebtPayoffScenario[]`
- Max 3 scenarios
- localStorage persistence
- Backwards compatible (optional field)

### Calculations Export
All functions exported from `@/lib/calculations/debtPayoff`:
- `calculateStandardAmortization()`
- `calculateIndexedAmortization()`
- `calculateInvestmentGrowth()`
- `findBreakEvenPoint()`
- `generateReasoning()`
- `calculatePeaceOfMindAdjustment()`
- `compareDebtVsInvestment()`

## Performance

### Optimization
- Calculations complete in < 100ms (target)
- Safety limit prevents infinite loops (600 months max)
- Minimum balance threshold: 0.01 kr

### Efficiency
- Monthly projections calculated once
- Memoized results in component
- No unnecessary re-renders

## Implementation Status

### Completed (Epic 1 & 2 - Core Foundation)
- ✅ Type definitions (`debtPayoff.ts`)
- ✅ StoredState extension (backwards compatible)
- ✅ Icelandic loan presets and constants
- ✅ Icelandic content and text
- ✅ Standard amortization calculations
- ✅ Inflation-indexed amortization
- ✅ Investment growth calculations
- ✅ Scenario comparison logic
- ✅ Peace of mind adjustment
- ✅ Break-even point detection
- ✅ Reasoning generator (Icelandic)
- ✅ Validation functions
- ✅ Scenario helper functions
- ✅ Basic UI component (DebtPayoffPage)
- ✅ Next.js page route

### Pending (Future Enhancements)
- ⏳ Chart visualization (DebtPayoffChart)
- ⏳ Detailed comparison table
- ⏳ Scenario save/load/delete
- ⏳ Multiple debt support (avalanche/snowball)
- ⏳ Export/import functionality
- ⏳ Comprehensive unit tests
- ⏳ Integration with CalculatorContext
- ⏳ localStorage persistence
- ⏳ Mobile optimization
- ⏳ Accessibility audit

## Related Features
- Actual Hourly Wage Calculator (provides actualHourlyWage)
- Life Energy conversion (dollarsToLifeEnergy)
- Number formatting (formatCurrency, formatPercentage)

## Book Reference
Based on "Your Money or Your Life" by Vicki Robin, applying life energy principles to debt decisions.

## Testing

### Test Files Needed
- `debtPayoff.test.ts` - Calculation functions
- `debtValidation.test.ts` - Validation logic
- `debtScenarioHelpers.test.ts` - Helper functions
- `DebtPayoffPage.test.tsx` - Component tests

### Test Coverage Target
- 80%+ unit test coverage
- All calculation paths tested
- Edge cases handled
- Icelandic text validated

## Example Usage

```typescript
import { compareDebtVsInvestment } from '@/lib/calculations/debtPayoff';

const debt: DebtInput = {
  id: 'car-loan',
  loanType: 'oVerdtryggd',
  currentBalance: 2_000_000,
  nominalInterestRate: 0.09,
  minimumPayment: 40_000,
  extraPayment: 10_000,
};

const investment: InvestmentAssumptions = {
  expectedAnnualReturn: 0.07,
  riskLevel: 'moderate',
};

const results = compareDebtVsInvestment(
  debt,
  investment,
  5000, // actualHourlyWage
  3 // peacOfMindFactor (3%)
);

console.log(results.comparison.recommendation); // 'debt' or 'invest'
console.log(results.comparison.reasoning); // Icelandic reasoning
```

## Notes
- All financial amounts in ISK (króna)
- All interest rates as decimals (0.08 = 8%)
- All text in Icelandic
- Client-side only (no server calculations)
- Privacy-focused (no data sent to server)
- Backwards compatible with existing features
