# FI Number Constants

## Location
`apps/peninganaedalifid/src/lib/constants/fiNumber.ts`

## Purpose
Provides all configuration constants, default values, and helper functions for the FI Number Builder feature. Includes standard multipliers (25x, 30x, 33x), Icelandic-specific defaults, validation ranges, and utility functions for the Financial Independence calculator.

## Exports

### Constants

#### Standard Multipliers
- `STANDARD_MULTIPLIERS: readonly [25, 30, 33]` - Three standard FI multipliers representing different withdrawal rates
- `DEFAULT_MULTIPLIER: 30` - Recommended multiplier for Iceland (more conservative than US standard 25x)

#### Range Constraints
- `MULTIPLIER_RANGE: { MIN: 20, MAX: 50 }` - Custom multiplier range
- `EXPENSE_RANGE: { MIN: 0, MAX: 10_000_000 }` - Monthly expense constraints (ISK)
- `PENSION_INCOME_RANGE: { MIN: 0, MAX: 1_000_000 }` - Monthly pension income constraints (ISK)
- `RETIREMENT_AGE_RANGE: { MIN: 40, MAX: 80 }` - Valid retirement age range

#### Icelandic Context
- `PENSION_START_AGE: 67` - Standard Icelandic retirement age for lífeyrissjóður
- `MULTIPLIER_WARNING_THRESHOLD: 28` - Show warning if multiplier is below this value
- `ICELANDIC_WARNINGS` - Educational warning messages in Icelandic

#### Labels and Descriptions
- `MULTIPLIER_LABELS: Record<StandardMultiplier, string>` - User-friendly labels (25x, 30x, 33x)
- `MULTIPLIER_DESCRIPTIONS: Record<StandardMultiplier, string>` - Icelandic descriptions with withdrawal rates
- `MULTIPLIER_WITHDRAWAL_RATES: Record<StandardMultiplier, number>` - Actual withdrawal percentages

#### Default Values
- `FI_NUMBER_DEFAULTS` - Initial state configuration
  - `EXPENSE_SOURCE: 'baseline'`
  - `MULTIPLIER: 30`
  - `CUSTOM_MULTIPLIER: null`
  - `PENSION_MONTHLY_INCOME: null`
  - `TARGET_RETIREMENT_AGE: null`
  - `CUSTOM_MONTHLY_EXPENSE: null`

#### Calculation Defaults
- `CALCULATION_DEFAULTS` - Common calculation values
  - `MONTHS_PER_YEAR: 12`
  - `PENSION_START_AGE: 67`
  - `DEFAULT_RETIREMENT_AGE: 67`

### Helper Functions

#### Withdrawal Rate Conversions
- `getWithdrawalRate(multiplier: number): number` - Convert multiplier to withdrawal rate (1 / multiplier)
- `getMultiplierFromWithdrawalRate(withdrawalRate: number): number` - Convert withdrawal rate to multiplier (1 / rate)

#### Type Checks
- `isStandardMultiplier(multiplier: number): multiplier is StandardMultiplier` - Type guard for standard multipliers
- `needsMultiplierWarning(multiplier: number): boolean` - Check if multiplier is too aggressive for Iceland

#### Validation
- `isValidMultiplier(multiplier: number): boolean` - Validate multiplier is in range (20-50)
- `isValidRetirementAge(age: number): boolean` - Validate retirement age is in range (40-80)
- `isValidMonthlyExpense(expense: number): boolean` - Validate monthly expense is in range (0-10M ISK)
- `isValidPensionIncome(income: number): boolean` - Validate pension income is in range (0-1M ISK)

## Key Functionality

### Icelandic Context Awareness
- **Conservative Multipliers**: Default 30x (3.33% withdrawal) vs US standard 25x (4%)
- **Pension Integration**: Age 67 retirement standard for lífeyrissjóður
- **Warning Threshold**: Alert users if multiplier is below 28x (too aggressive for Iceland's higher inflation)
- **Localized Messages**: All warnings and descriptions in Icelandic

### Standard vs Custom Multipliers
- Three standard options: 25x (aggressive), 30x (recommended), 33x (conservative)
- Custom slider range: 20x-50x
- Withdrawal rate labels shown for transparency (e.g., "30x (3,33% úttektarhlutfall)")

### Validation Ranges
- Monthly expenses: 0 to 10 million ISK (sanity check for unrealistic inputs)
- Retirement age: 40-80 years
- Pension income: 0 to 1 million ISK/month
- Multiplier: 20x-50x (20% to 5% withdrawal rate)

### Default Configuration
- Prefers expense baseline over custom input
- Sets 30x multiplier as default (Icelandic recommendation)
- No pension or retirement age configured initially (optional feature)

## Dependencies
- `@/types/fiNumber` - TypeScript type definitions (StandardMultiplier)

## Integration
- Used by: FI Number calculation functions, UI components (MultiplierSelector, ExpenseSourceSelector, PensionIncomeSection)
- Provides: Configuration for entire FI Number Builder feature
- Validation: All input constraints and warning logic

## Related
- Implements: Requirements FR-1.2-1.5, FR-4.1-4.4 from specs/fi-number-builder/requirements-fi-number-builder.md
- Part of: Epic 1 (Foundation) from specs/fi-number-builder/tasks-fi-number-builder.md
- Complements: apps/peninganaedalifid/src/types/fiNumber.ts (type definitions)

## Design Rationale

### Why 30x Default?
Iceland's historically higher inflation (3-4% vs US 2-3%) makes the US standard 4% rule (25x) riskier. The 3.33% withdrawal rate (30x) provides a more conservative safety margin appropriate for Icelandic conditions.

### Why Three Standard Multipliers?
- **25x**: Familiar to users from US FIRE literature, but warned as aggressive
- **30x**: Recommended middle ground for Iceland
- **33x**: Very conservative option for risk-averse users
- **Custom**: Flexibility for advanced users who understand their risk tolerance

### Why Pension Integration?
Most Icelanders contribute to lífeyrissjóður (mandatory pension fund). Factoring in expected pension income significantly reduces the FI number needed, making calculations more realistic for Icelandic users planning early retirement or partial FI.

### Why Age 67?
Standard retirement age in Iceland when lífeyrissjóður payments begin. Critical for bridge amount calculations when planning early retirement.
