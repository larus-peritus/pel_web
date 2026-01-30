# Snowball Calculator Foundation

## Location
- Types: `apps/peninganaedalifid/src/types/snowball.ts`
- Constants: `apps/peninganaedalifid/src/lib/constants/snowball.ts`

## Purpose
Provides foundational TypeScript types and constants for the Interest Savings Snowball Calculator (Vaxtasparnaður Snjóboltareiknivél). This feature helps users understand the compound effect of reinvesting interest savings from extra loan payments.

## Exports

### Types (src/types/snowball.ts)

#### Type Aliases
- `type LoanType = 'verdtryggd' | 'oVerdtryggd'` - Icelandic loan types (indexed vs non-indexed)
- `type PaymentMethod = 'annuity' | 'linear'` - Payment calculation methods

#### Interfaces
- `interface SnowballLoanInput` - Single loan parameters
  - originalLoanAmount: number
  - currentBalance: number
  - annualInterestRate: number
  - loanTermMonths: number
  - remainingPayments: number
  - loanType: LoanType
  - paymentMethod?: PaymentMethod
  - inflationRate?: number

- `interface SnowballInput` - Complete calculator input
  - loan: SnowballLoanInput
  - extraPayment: number
  - expectedInvestmentReturn: number
  - actualHourlyWage?: number

- `interface MonthlyRow` - Detailed monthly breakdown across all scenarios
  - month: number
  - Base case fields (baseOpeningBalance, basePayment, baseInterest, basePrincipal, baseClosingBalance)
  - Snowball-to-loan fields (snowballLoanOpeningBalance, snowballLoanPayment, snowballLoanExtraFromSavings, etc.)
  - Snowball-to-investment fields (snowballInvestOpeningBalance, snowballInvestmentBalance, snowballInvestmentContribution, etc.)
  - Comparison fields (interestSavingsThisMonth, cumulativeInterestSavings)

- `interface ScenarioSummary` - High-level scenario results
  - monthsToPayoff: number
  - totalInterestPaid: number
  - totalPayments: number
  - finalInvestmentBalance: number
  - totalWealthCreated: number
  - lifeEnergyHours: object with totalInterest, totalPayments, investmentGains, netBenefit

- `interface SnowballResults` - Complete calculation results
  - monthlySchedule: MonthlyRow[]
  - baseCase: ScenarioSummary
  - snowballToLoan: ScenarioSummary
  - snowballToInvestment: ScenarioSummary
  - recommendation: object with bestScenario, isCloseCall, reasoning, lifeEnergyDifference

### Constants (src/lib/constants/snowball.ts)

#### Values
- `DEFAULT_INVESTMENT_RETURN = 0.07` - 7% annual return (historical stock market average)
- `MAX_PROJECTION_MONTHS = 600` - 50 years maximum (safety limit)
- `MIN_BALANCE_THRESHOLD = 0.01` - Consider debt paid off below this amount
- `CLOSE_CALL_THRESHOLD = 0.05` - 5% difference = close call
- `DEFAULT_LOAN_INPUT: SnowballLoanInput` - Typical 30M ISK indexed mortgage
- `DEFAULT_EXTRA_PAYMENT = 10_000` - 10,000 ISK/month
- `TYPICAL_INFLATION_RATE = 0.05` - 5% inflation for Iceland
- `INVESTMENT_RETURN_RANGE` - Min (0%), max (50%), warning threshold (20%)
- `INTEREST_RATE_RANGE` - Min (0%), max (100%)

#### Helper Functions
- `getDefaultLoanInput()` - Returns copy of DEFAULT_LOAN_INPUT
- `isInvestmentReturnUnrealistic(annualReturn)` - Checks if return > 20%
- `isLoanTermVeryLong(termMonths)` - Checks if term > 600 months

## Key Functionality

### Three-Scenario Comparison
The calculator compares three approaches:
1. **Base Case**: Extra payment only, no snowball effect
2. **Snowball to Loan**: Interest savings reinvested in loan payments
3. **Snowball to Investment**: Interest savings invested separately

### Life Energy Integration
All monetary values can be converted to life energy hours using actualHourlyWage, following "Your Money or Your Life" philosophy.

### Close Call Detection
When scenarios differ by less than 5%, the recommendation acknowledges this is a personal choice rather than a clear winner.

## Dependencies
- TypeScript (type definitions only)
- No runtime dependencies

## Integration
- Used by: Calculation engine (to be implemented in Task 2.1-2.4)
- Uses: None (foundation layer)
- Follows patterns from: src/types/debtPayoff.ts, src/lib/constants/debtPayoff.ts

## Related
- Implements: Requirements REQ-FR-1, REQ-FR-2, REQ-FR-3, REQ-FR-3.2, REQ-NFR-1
- Part of: specs/interest-savings-snowball/design-interest-savings-snowball.md
- Tasks: Foundation Tasks 1.1 (types) and 1.2 (constants)

## Design Decisions

### Why separate loan types?
Verðtryggð (indexed) loans require inflation adjustment each month, while óverðtryggð loans do not. This distinction is critical for accurate calculations in Iceland.

### Why track three scenarios in parallel?
Easier to compare visually and ensures consistent calculation methodology across all scenarios.

### Why include life energy in summary?
Core to app's philosophy - helps users understand financial decisions in terms of time/freedom rather than just money.

### Why 5% close call threshold?
Balances between acknowledging meaningful differences vs recognizing when personal preference should dominate over small mathematical advantages.

## Testing Strategy
- Type checking: TypeScript compilation ensures type safety
- Constants validation: Will be tested indirectly through calculation engine tests
- No unit tests needed for pure type definitions

## Notes
- All monetary values in ISK (Icelandic króna)
- All rates as decimals (0.07 = 7%)
- All UI text will be in Icelandic
- Designed to handle up to 50-year projections (600 months)
