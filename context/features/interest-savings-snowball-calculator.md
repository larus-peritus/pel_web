# Feature: Interest Savings Snowball Calculator

## Overview
The Interest Savings Snowball Calculator (Vaxtasparnaður Snjóboltareiknivél) helps users understand the compound effect of reinvesting interest savings from extra loan payments. It compares three scenarios side-by-side to show how different approaches to using interest savings impact total wealth creation and time to debt freedom.

## Status
In Progress - 2/18 tasks complete (Foundation complete)

## Architecture

### Data Flow
```
User Input (loan details, extra payment, investment return)
    |
    v
Calculation Engine (calculates 3 scenarios in parallel)
    |
    v
Results (monthly breakdown + scenario summaries + recommendation)
    |
    v
UI Components (charts, tables, cards, recommendation)
```

### Three Scenarios
1. **Base Case**: Extra payment only, no snowball effect
   - User makes regular payment + extra payment
   - Interest savings are not actively reinvested

2. **Snowball to Loan**: Interest savings reinvested in loan payments
   - As balance decreases, interest charged decreases
   - Accumulated interest savings applied as additional payment each month
   - Compounds to pay off loan faster

3. **Snowball to Investment**: Interest savings invested separately
   - As balance decreases, interest charged decreases
   - Interest savings invested in separate account at expected return rate
   - Creates wealth through both debt payoff and investment growth

## Modules

### Foundation (Complete)
- **Types** - context/modules/SnowballCalculatorFoundation.md
  - Location: src/types/snowball.ts
  - Exports: LoanType, PaymentMethod, SnowballLoanInput, SnowballInput, MonthlyRow, ScenarioSummary, SnowballResults

- **Constants** - context/modules/SnowballCalculatorFoundation.md
  - Location: src/lib/constants/snowball.ts
  - Exports: DEFAULT_INVESTMENT_RETURN (7%), MAX_PROJECTION_MONTHS (600), MIN_BALANCE_THRESHOLD (0.01), CLOSE_CALL_THRESHOLD (5%), DEFAULT_LOAN_INPUT, helper functions

### Calculation Engine (Not Started)
- **Core Calculations** - To be created
  - Location: src/lib/calculations/snowball.ts (planned)
  - Will include: calculateBasePayment(), calculateSnowball(), buildResults(), generateReasoning()

### UI Components (Not Started)
- **Input Components** - To be created
  - LoanInputCard, ExtraPaymentCard, InvestmentCard

- **Results Components** - To be created
  - ScenarioSummary, SnowballChart, MonthlyBreakdown, RecommendationCard

- **Main Page** - To be created
  - SnowballCalculatorPage

## Dependencies
- TypeScript (types only)
- React (for UI components, when implemented)
- Recharts or similar (for visualizations, when implemented)
- Existing patterns from debtPayoff calculator

## Testing
- **Unit Tests**: Calculation engine tests (to be written in Task 2.5)
- **Component Tests**: UI component tests (to be written in Tasks 9.1-9.3)
- **Type Safety**: TypeScript compilation ensures type safety (verified)

## Implementation Notes

### Design Principles
1. **Parallel Calculation**: All three scenarios calculated in single loop for consistency
2. **Life Energy Integration**: All monetary values convertible to hours using actualHourlyWage
3. **Icelandic Focus**: Supports verðtryggð (indexed) and óverðtryggð (non-indexed) loans
4. **Close Call Detection**: Acknowledges when difference < 5% (personal choice territory)

### Key Decisions
- **Why 7% default investment return?** Historical long-term stock market average
- **Why 600 month limit?** Prevents infinite loops, 50 years is reasonable maximum
- **Why track cumulative savings?** Shows compound effect visually over time
- **Why 5% close call threshold?** Balances meaningful differences vs personal preference

### Icelandic Loan Types
- **Verðtryggð** (indexed): Principal adjusts monthly with inflation, uses real interest rate
- **Óverðtryggð** (non-indexed): Fixed principal, uses nominal interest rate
- **Payment Methods**: Annuity (equal payments) vs Linear (equal principal payments)

## Related Specifications
- Requirements: specs/interest-savings-snowball/requirements-interest-savings-snowball.md
- Design: specs/interest-savings-snowball/design-interest-savings-snowball.md
- Tasks: specs/interest-savings-snowball/tasks-interest-savings-snowball.md

## Next Steps
1. Implement calculation engine (Tasks 2.1-2.5)
2. Create input components (Tasks 3.1-3.3)
3. Build results display (Tasks 4.1-4.2)
4. Add visualizations (Tasks 5.1-5.3)
5. Integrate into main app (Tasks 6.1-7.3)

## Progress Tracking
- Foundation: 2/2 complete (100%)
- Calculation Engine: 0/5 complete (0%)
- Input Components: 0/3 complete (0%)
- Results Display: 0/2 complete (0%)
- Visualizations: 0/3 complete (0%)
- Main Page: 0/3 complete (0%)

Total: 2/18 core tasks complete (11%)
