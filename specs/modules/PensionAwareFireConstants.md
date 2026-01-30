# Pension-Aware FIRE Constants Module

## Location
`src/lib/constants/pensionAwareFire.ts`

## Purpose
Provides all constants, default values, validation ranges, and helper functions for the Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél). This module is the single source of truth for Icelandic pension system parameters and calculator configuration.

## Exports

### Core Constants

#### `PENSION_AWARE_DEFAULTS`
Default input values for the calculator, representing a typical early FIRE scenario for Iceland:
- `currentAge: 35` - Starting age
- `targetRetirementAge: 55` - Early retirement target
- `monthlyExpenses: 300_000` - Moderate monthly expenses (ISK)
- `currentSavings: 0` - Starting from scratch
- `monthlySavings: 200_000` - Healthy savings rate (ISK)
- `investmentReturn: 0.05` - 5% annual return
- `fiMultiplier: 30` - 3.33% withdrawal rate (recommended for Iceland)

#### `ICELANDIC_PENSION_SYSTEM`
Official ages, amounts, and rates for Iceland's three-tier pension system:

**Séreign (Private Pension):**
- `SEREIGN_ACCESS_AGE: 60` - When séreign becomes accessible
- `TYPICAL_SEREIGN_RETURN: 0.05` - Conservative return estimate (5%)

**Lífeyrissjóður (Occupational Pension):**
- `LIFEYRISSJODUR_EARLY_AGE: 62` - Earliest start age
- `LIFEYRISSJODUR_STANDARD_AGE: 67` - Standard retirement age
- `LIFEYRISSJODUR_LATE_AGE: 72` - Latest start age
- `TYPICAL_LIFEYRISSJODUR_MONTHLY: 300_000` - Average monthly amount (ISK)

**TR Ellilífeyrir (State Pension):**
- `TR_START_AGE: 67` - State pension start age
- `TR_MAX_SINGLE: 380_000` - Maximum monthly TR for single person (ISK)
- `TR_INCOME_EXEMPTION: 36_500` - Income threshold before reduction (ISK/month)
- `TR_REDUCTION_RATE: 0.45` - 45% reduction on income above exemption

**Life Expectancy:**
- `ASSUMED_LIFE_EXPECTANCY: 90` - Conservative estimate for calculations

#### `PENSION_INPUT_RANGES`
Validation ranges for all calculator inputs:
- Age ranges (current: 18-70, retirement: 30-80)
- Financial ranges (expenses: 100k-2M, savings: 0-500M, monthly savings: 0-2M)
- Investment return range (0-15%)
- Pension-specific ranges (lífeyrissjóður: 0-1M monthly, séreign: 0-100M balance)

#### `PHASE_COLORS`
Color scheme for retirement phase timeline visualization:
- `working` - Blue (#3B82F6) - Accumulation phase
- `gap` - Red (#EF4444) - Self-funded period (challenging)
- `sereign-bridge` - Amber (#F59E0B) - Partial pension support
- `full-pension` - Green (#10B981) - Full pension coverage

Each phase has `primary`, `light`, `dark`, and `hex` color variants.

#### `WARNING_THRESHOLDS`
Thresholds for displaying plan warnings:
- `LONG_GAP_YEARS: 15` - Warn if gap period exceeds 15 years
- `LOW_SAVINGS_RATE_PERCENT: 10` - Warn if savings rate below 10%
- `UNSUSTAINABLE_TIMELINE_MONTHS: 600` - Warn if timeline exceeds 50 years
- `HIGH_EXPENSE_RATIO: 2.0` - Warn if expenses exceed 200% of typical pension
- `LARGE_SURPLUS_ISK: 50_000_000` - Info if surplus exceeds 50M ISK
- `HIGH_TR_REDUCTION_PERCENT: 75` - Warn if TR reduced by >75%
- `VERY_EARLY_RETIREMENT_AGE: 50` - Warn for retirement before age 50
- `LATE_RETIREMENT_AGE: 65` - Warn for retirement close to pension age

### Default Pension Inputs

#### `DEFAULT_LIFEYRISSJODUR`
Default occupational pension settings:
```typescript
{
  expectedMonthlyAmount: 300_000,  // Typical amount
  startAge: 67                     // Standard age
}
```

#### `DEFAULT_SEREIGN`
Default private pension settings:
```typescript
{
  currentBalance: 0,              // No existing balance
  monthlyContribution: 0,         // No contributions
  employerMatchPercent: 0.02      // 2% match (common)
}
```

#### `DEFAULT_TR`
Default state pension settings:
```typescript
{
  expectFullTR: true,             // Assume full TR
  manualOverrideAmount: null      // Auto-calculate
}
```

### Configuration Options

#### `FI_MULTIPLIER_OPTIONS`
FI multiplier choices with Icelandic context:
- 25x (4% withdrawal, aggressive)
- 30x (3.33% withdrawal, recommended for Iceland)

#### `EMPLOYER_MATCH_OPTIONS`
Common employer match percentages (0%, 2%, 4%, 6%, 8%, 10%) with Icelandic labels.

#### `TYPICAL_PENSION_SCENARIOS`
Pre-configured scenarios for quick-fill:
- `average` - Meðalstarfsmaður (typical worker)
- `conservative` - Varkár áætlun (cautious estimate)
- `optimistic` - Bjartsýn áætlun (optimistic estimate)

#### `EDUCATIONAL_EXAMPLES`
Example calculations for educational intro:
- Traditional FIRE: 144M ISK (30x × 400k × 12)
- Pension-aware FIRE: 38.5M ISK (actual need)
- Savings: 105.5M ISK difference

### Helper Functions

#### Phase and Color Helpers
- `getPhaseColor(phaseId)` - Get color scheme for a phase
- `getPhaseDuration(startAge, endAge)` - Calculate phase length in years
- `getNumberOfPhases(retirementAge)` - Determine how many phases (1-3)

#### Validation Helpers
- `isValidRetirementAge(currentAge, targetAge)` - Validate retirement age
- `isValidLifeyrissjodurAge(age)` - Validate lífeyrissjóður start age (62-72)

#### Timeline Helpers
- `yearsUntilSereignAccess(currentAge)` - Years until age 60
- `yearsUntilLifeyrissjodur(currentAge)` - Years until age 67
- `yearsUntilTR(currentAge)` - Years until age 67

#### Phase Detection Helpers
- `willHaveGapPeriod(retirementAge)` - Check if retiring before 60
- `willHaveSereignBridge(retirementAge)` - Check if retiring before 67

#### Display Helpers
- `formatISK(amount, includeDecimals?)` - Format ISK with M suffix for millions
- `getFIMultiplierDetails(multiplier)` - Get details for 25x or 30x
- `getEmployerMatchLabel(percent)` - Get Icelandic label for match percentage

#### Scenario Helpers
- `getTypicalScenario(scenarioName)` - Get pre-configured scenario by name

## Key Functionality

### Icelandic Pension System Modeling
Accurately models Iceland's three-tier pension system:
1. **Séreign** (age 60+) - Private pension accounts
2. **Lífeyrissjóður** (age 62-72) - Occupational pension funds
3. **TR Ellilífeyrir** (age 67+) - State pension with means-testing

### Validation Ranges
Provides realistic ranges for all inputs based on Icelandic economic context:
- Minimum viable expenses (100k ISK/month)
- Maximum realistic values (prevents calculation errors)
- Age constraints aligned with pension system

### Visual Design System
Color-coded phase system for intuitive timeline visualization:
- Blue (working) → Red (gap) → Amber (bridge) → Green (full pension)
- Each color has 4 variants (primary, light, dark, hex)

### Warning System
Multi-level warning thresholds:
- **Info**: Opportunities (large surplus, could retire earlier)
- **Warning**: Concerns (long gap, high expenses)
- **Error**: Deal-breakers (insufficient savings, impossible timeline)

## Dependencies

### Internal
- `@/types/pensionAwareFire` - Type definitions for all pension-related types

### External
- None (pure TypeScript constants)

## Tests
**Location**: `tests/lib/constants/pensionAwareFire.test.ts`

**Coverage**: 85 tests covering:
- All constant values (pension ages, amounts, rates)
- Default value correctness
- Validation range boundaries
- Phase color definitions
- Warning thresholds
- All helper functions with edge cases
- Educational example calculations

**Test Highlights**:
- Verifies pension age progression (60 → 62 → 67)
- Validates TR means-testing parameters (36,500 ISK exemption, 45% reduction)
- Tests all age validation logic
- Confirms color scheme completeness
- Tests helper functions for all scenarios (early, standard, late retirement)

**Status**: All 85 tests passing ✅

## Integration

### Used By
- Calculation functions (`src/lib/calculations/pensionAwareFire.ts`)
- UI components (BasicInputs, PensionInputs, PhaseTimeline, etc.)
- Context validation and initialization
- Educational content components

### Uses
- Type definitions from `@/types/pensionAwareFire`

## Related

### Implements
- Requirements US-1, US-2, FR-1, FR-5 from `specs/requirements-pension-aware-fire.md`
- Design specifications from `specs/design-pension-aware-fire.md`

### Part of
- Task 2.1 from `specs/tasks-pension-aware-fire.md`
- Epic 2: Constants & Defaults

## Implementation Notes

### Icelandic Specifics
All pension values reflect Icelandic reality:
- Séreign accessible from age 60 (Icelandic law)
- Lífeyrissjóður ages 62-72 (standard practice)
- TR start at 67 (state pension age)
- TR means-testing at 36,500 ISK exemption with 45% reduction
- 30x multiplier recommended (vs 25x in US) due to higher inflation

### 2024 Values
TR amounts based on 2024 rates:
- Maximum single TR: 380,000 ISK/month
- Income exemption: 36,500 ISK/month
- Subject to annual government adjustments

### Conservative Estimates
All defaults use conservative assumptions:
- 5% investment return (achievable, not optimistic)
- 90-year life expectancy (longer than average)
- Typical pension amounts (not maximum)

### Helper Function Design
Helper functions follow consistent patterns:
- Years calculations return 0 for ages already passed
- Validation functions return boolean
- Display functions handle edge cases (zero, negative, very large)
- Scenario functions use typed keys (autocomplete support)

## Future Considerations

### Inflation Adjustment
Currently uses nominal values. Future versions may:
- Add inflation-adjusted projections
- Include real vs nominal return calculations
- Update TR values automatically from API

### Regional Variations
May add support for:
- Different lífeyrissjóður (pension funds have varying terms)
- Municipal pension schemes
- Special professions (police, military, etc.)

### Couple Calculations
Current implementation is single-person only. Future:
- Coupled TR calculations (different rates)
- Combined household pension planning
- Séreign inheritance/transfer rules
