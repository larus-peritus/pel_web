# Snowball Calculation Engine

## Location
`apps/peninganaedalifid/src/lib/calculations/snowball.ts`

## Purpose
Core calculation engine for the Interest Savings Snowball Calculator. Compares three debt payoff scenarios to demonstrate the compound effect of reinvesting interest savings:

1. **Base case**: Minimum payment only (no extra payment)
2. **Snowball to loan**: Minimum + extra payment, PLUS accumulated interest savings applied to loan
3. **Snowball to investment**: Minimum + extra payment, interest savings invested monthly

## Exports

### Functions

- `calculateBasePayment(loan: SnowballLoanInput): number`
  - Calculates base monthly payment for a loan
  - Supports verðtryggð (indexed) loans with annuity method
  - Supports óverðtryggð loans with annuity or linear payment methods
  - Handles edge cases (zero interest, zero term)

- `calculateSnowball(input: SnowballInput): SnowballResults`
  - Main calculation engine that processes all three scenarios in parallel
  - Runs month-by-month simulation until all scenarios paid off (max 600 months)
  - Handles inflation adjustment for verðtryggð loans each month
  - Calculates interest savings as: base interest - scenario interest
  - Builds complete monthly schedule with all scenario data
  - Returns comprehensive results with summaries and recommendation

## Key Functionality

### Payment Calculation
- **Annuity formula**: `P = L * [r(1+r)^n] / [(1+r)^n - 1]`
  - Equal payments each month
  - Used for verðtryggð loans and óverðtryggð annuity loans

- **Linear formula**: `P = (L / n) + (balance * r)`
  - Equal principal payments, decreasing total
  - Used for óverðtryggð linear loans

### Monthly Simulation Loop
1. Apply inflation adjustment (if verðtryggð)
2. Calculate base case (minimum payment only)
3. Calculate interest savings (base interest - scenario interest)
4. Apply snowball to loan (extra + accumulated savings)
5. Apply snowball to investment (extra payment, invest savings)
6. Record month data
7. Update balances
8. Continue until all paid off or max months reached

### Results Building
- Finds payoff month for each scenario (first month with zero balance)
- Sums total interest paid for each scenario
- Sums total payments for each scenario
- Converts to life energy hours if wage provided
- Determines best scenario by total wealth created
- Sets `isCloseCall` flag if scenarios within 5% of each other
- Generates Icelandic reasoning explaining recommendation

### Recommendation Logic
- Compares total wealth created across scenarios
- Sorts by wealth created (descending)
- Best = highest wealth created
- Close call = best and second-best within 5%
- Calculates life energy difference (best - worst)
- Generates context-aware Icelandic explanation

## Dependencies
- `@/types/snowball` - TypeScript types for all data structures
- `@/lib/constants/snowball` - Constants (MAX_PROJECTION_MONTHS, MIN_BALANCE_THRESHOLD, CLOSE_CALL_THRESHOLD)

## Algorithm Details

### Interest Savings Concept
The "snowball effect" emerges from making extra payments:
- Extra payment reduces balance faster
- Lower balance = less interest charged
- Interest savings = what you would have paid - what you actually paid
- Savings can be reinvested (to loan or investment)

### Example (simplified)
Month 1:
- Base: 1M balance × 1% rate = 10k interest
- Snowball: 1M balance × 1% rate = 10k interest (same)
- Savings: 0 (same balance)

Month 2:
- Base: 990k balance × 1% = 9.9k interest (only minimum paid)
- Snowball: 980k balance × 1% = 9.8k interest (extra payment reduced balance)
- Savings: 0.1k (snowball has lower balance)

Month 3:
- Savings continue to accumulate as snowball scenarios have progressively lower balances

### Edge Cases Handled
- Zero interest rate: `payment = principal / months`
- Zero term: returns 0 payment
- Zero loan amount: returns 0 payment
- Very long loans: caps at 600 months (50 years)
- Inflation indexing: compounds monthly for verðtryggð loans
- Missing wage: life energy values set to 0

## Testing
- Location: `apps/peninganaedalifid/src/lib/calculations/__tests__/snowball.test.ts`
- Coverage: 24 unit tests, all passing
- Tests cover:
  - Payment calculations (annuity, linear, indexed)
  - All three scenarios execute correctly
  - Snowball to loan pays off faster than base
  - Snowball to investment creates investment balance
  - Interest rate vs investment return comparisons
  - Verðtryggð loans with inflation
  - Edge cases (high/low rates, zero extra payment, long terms)
  - Life energy calculations
  - Recommendation logic
  - Monthly schedule completeness

## Integration
- Used by: SnowballCalculatorPage component (pending implementation)
- Part of: specs/interest-savings-snowball/design-interest-savings-snowball.md
- Implements: Requirements REQ-FR-1 through REQ-FR-5 from requirements-interest-savings-snowball.md

## Performance
- Calculations complete in < 100ms for typical loans (verified)
- Maximum 600 iterations prevents infinite loops
- Efficient month-by-month processing
- All scenarios calculated in parallel (single pass)

## Related
- Implements: Tasks 2.1-2.4 from specs/interest-savings-snowball/tasks-interest-savings-snowball.md
- Similar to: `src/lib/calculations/debtPayoff.ts` (debt analyzer)
- Context: context/modules/SnowballCalculatorFoundation.md (types and constants)
