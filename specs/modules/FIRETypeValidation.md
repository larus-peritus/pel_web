# FIRE Type Input Validation

## Location
`apps/peninganaedalifid/src/lib/validation/fireTypes.ts`

## Purpose
Validates user financial inputs and FIRE assumptions before calculations to ensure data quality and provide helpful feedback in Icelandic.

## Exports

### Functions

#### `validateUserInputs(inputs: Partial<UserFinancialInputs>): FIREInputValidationResult`
Validates all user financial inputs against defined limits and rules.

**Validates:**
- `currentAge`: 18-80 years
- `targetRetirementAge`: 25-90 years, must be greater than current age
- `currentNetWorth`: >= 0, <= 10 billion ISK
- `annualIncome`: > 0, <= 500 million ISK
- `annualSavings`: >= 0, <= 100 million ISK, <= annual income
- `savingsRate`: 0-100%
- `monthlyExpenses`: All tiers 50k-5M ISK, proper ordering (barebones < comfortable < deluxe)

**Returns:**
```typescript
{
  isValid: boolean,
  errors: Array<{field: string, message: string}>,
  warnings: Array<{field: string, message: string}>
}
```

**Error Examples (Icelandic):**
- "Aldur verður að vera að minnsta kosti 18 ára"
- "Markaldur verður að vera hærri en núverandi aldur"
- "Árlegur sparnaður getur ekki verið hærri en árstekjur"

**Warning Examples (Icelandic):**
- "Þú ert að byrja seint - íhugaðu að tala við fjármálaráðgjafa" (age > 60)
- "Lágar tekjur - FIRE markmið geta verið erfið að ná" (income < 2M ISK)
- "Mjög hátt sparnaðarhlutfall - gakktu úr skugga um að lífsgæði þín séu viðunandi" (savings rate > 70%)

#### `validateAssumptions(assumptions: Partial<FIREAssumptions>): FIREInputValidationResult`
Validates FIRE calculation assumptions.

**Validates:**
- `withdrawalRate`: 2-10% (warns if > 5% or < 3%)
- `expectedGrowthRate`: 0-15% (warns if > 10% or < 4%)
- `inflationRate`: 0-10% (warns if > 5%)
- `pensionAge`: 55-75 years (warns if not 67)
- `pensionMonthlyEstimate`: >= 0, warns if > 1M ISK
- Cross-field: Real return (growth - inflation) >= 1%

**Returns:**
Same structure as `validateUserInputs`

**Error Examples (Icelandic):**
- "Úttektarhlutfall verður að vera að minnsta kosti 2%"
- "Vænt ávöxtun getur ekki verið neikvæð"
- "Verðbólga yfir 10% er óraunhæf til lengri tíma"

**Warning Examples (Icelandic):**
- "Úttektarhlutfall yfir 5% gæti verið áhættusamt til lengri tíma"
- "Vænt ávöxtun yfir 10% er bjartsýn - íhugaðu varfærnari spá"
- "Raunávöxtun (ávöxtun - verðbólga) er mjög lág - íhugaðu að breyta forsendum"

## Key Features

### Validation Types
1. **Errors**: Blocking issues that prevent calculation
2. **Warnings**: Informational guidance for unusual but valid inputs

### Icelandic Messages
All error and warning messages are in Icelandic for user-facing display, with clear and helpful guidance.

### Cross-Field Validation
- Savings cannot exceed income
- Target age must be greater than current age
- Real return (growth - inflation) validation
- Expense tier ordering validation

### Partial Input Support
Both functions accept partial inputs, only validating provided fields. This allows:
- Progressive validation during form filling
- Validating individual field updates
- Flexible validation in different UI contexts

## Usage Example

```typescript
import { validateUserInputs, validateAssumptions } from '@/lib/validation/fireTypes';

// Validate user inputs
const inputs = {
  currentAge: 35,
  targetRetirementAge: 50,
  currentNetWorth: 10_000_000,
  annualIncome: 8_000_000,
  annualSavings: 3_000_000,
  savingsRate: 37.5,
};

const result = validateUserInputs(inputs);

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
  // Display errors to user
}

if (result.warnings.length > 0) {
  console.warn('Validation warnings:', result.warnings);
  // Display warnings to user
}

// Validate assumptions
const assumptions = {
  withdrawalRate: 0.04,
  expectedGrowthRate: 0.06,
  inflationRate: 0.025,
  pensionAge: 67,
};

const assumptionResult = validateAssumptions(assumptions);
```

## Validation Limits

Uses `FIRE_INPUT_LIMITS` from `@/types/fireTypes`:
- Age: 18-80
- Target age: 25-90
- Net worth: 0-10B ISK
- Income: 0-500M ISK
- Savings: 0-100M ISK
- Savings rate: 0-100%
- Expenses: 50k-5M ISK monthly

## Tests

Location: `apps/peninganaedalifid/src/lib/validation/__tests__/fireTypes.test.ts`

Coverage: 62 tests covering:
- Age validation (4 tests)
- Target retirement age validation (5 tests)
- Net worth validation (4 tests)
- Annual income validation (4 tests)
- Annual savings validation (5 tests)
- Savings rate validation (5 tests)
- Monthly expenses validation (5 tests)
- Complete user inputs validation (3 tests)
- Withdrawal rate validation (5 tests)
- Expected growth rate validation (5 tests)
- Inflation rate validation (4 tests)
- Pension age validation (4 tests)
- Pension monthly estimate validation (4 tests)
- Cross-field validation (2 tests)
- Complete assumptions validation (3 tests)

All tests passing with 100% coverage of validation logic.

## Integration

### Used By
- FIRE Type Explorer UI components (Epic 3+)
- User financial input forms
- Assumptions control panels
- API endpoints (future)

### Dependencies
- `@/types/fireTypes` - Type definitions and limits

## Related Modules
- FIRETypeExplorerContext.md - Context state management
- FIRETypeCalculations.md - Calculation functions using validated inputs
- FIRETypeConstants.md - FIRE type definitions

## Future Enhancements
- Real-time validation during input
- Async validation for external data sources
- Customizable validation rules
- Additional cross-field validations
- Validation rule localization for other languages
