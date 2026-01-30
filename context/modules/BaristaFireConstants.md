# Barista FIRE Constants

## Location
`apps/peninganaedalifid/src/lib/constants/baristaFire.ts`

## Purpose
Provides all constants, default values, and configuration for the Barista FIRE Planner calculator. Includes Icelandic-specific pension rates, part-time work presets, validation ranges, and helper functions.

## Exports

### Core Constants

#### `ICELANDIC_PENSION_RATES`
Mandatory lífeyrissjóður (pension fund) contributions in Iceland:
- `TOTAL: 0.16` (16% total)
- `EMPLOYER: 0.12` (12% employer contribution)
- `EMPLOYEE: 0.04` (4% employee contribution)

#### `NET_INCOME_MULTIPLIER`
Multiplier to calculate net income from gross (0.84 after 16% pension deduction)

#### `BARISTA_FIRE_DEFAULTS`
Default values for calculator initialization:
- `INVESTMENT_RETURN_RATE: 0.05` (5% real annual return)
- `PENSION_CONTRIBUTION_RATE: 0.16`
- `EMPLOYER_PENSION_RATE: 0.12`
- `EMPLOYEE_PENSION_RATE: 0.04`
- `FULL_TIME_HOURS_PER_WEEK: 40`
- `CURRENT_SAVINGS: 0`
- `SELECTED_TIER: null`
- `CUSTOM_MONTHLY_EXPENSE: null`
- `CURRENT_AGE: null`
- `MAX_SCENARIOS: 5`

### Part-Time Work Presets

#### `PART_TIME_PRESETS`
Three Icelandic part-time work arrangements:
1. **20 klst/viku** - Hálft starf (50% full-time)
2. **30 klst/viku** - 75% starf (75% full-time)
3. **Ráðgjöf/Freelance** - Sveigjanleg vinna (62.5% full-time)

### Validation Ranges

#### `WORK_HOUR_LIMITS`
- `MIN: 1` - Minimum hours per week
- `MAX: 40` - Maximum hours per week
- `WARNING_THRESHOLD: 35` - Approaching full-time

#### `HOURLY_WAGE_LIMITS`
- `MIN: 500` ISK/hour
- `MAX: 50,000` ISK/hour
- `MINIMUM_WAGE: 1,500` ISK/hour (Iceland minimum)
- `UNREALISTIC_THRESHOLD: 20,000` ISK/hour

#### `FI_MULTIPLIER_OPTIONS`
Three standard multipliers with Icelandic context:
- **25x** - 4.0% withdrawal (aggressive, not recommended for Iceland)
- **30x** - 3.33% withdrawal (recommended for Iceland)
- **33x** - 3.0% withdrawal (conservative)

#### `RETURN_RATE_RANGE`
- `MIN: 0` - No growth
- `MAX: 0.15` - 15% (very aggressive)
- `WARNING_THRESHOLD: 0.1` - 10%
- `DEFAULT: 0.05` - 5%

#### `AGE_RANGE`
- `MIN: 18` - Young adult
- `MAX: 100` - Approaching traditional retirement
- `PENSION_AGE: 67` - Iceland pension start age

#### `SAVINGS_RANGE`
- `MIN: 0` ISK
- `MAX: 100,000,000` ISK (100M sanity check)

#### `ANNUAL_INCOME_RANGE`
- `MIN: 100,000` ISK/year (very part-time)
- `MAX: 30,000,000` ISK/year (full-time+)
- `LOW_INCOME_THRESHOLD: 1,000,000` ISK/year

### UI Labels

#### `TIER_LABELS`
Icelandic labels for expense tiers:
- `barebones: 'Lágmarksútgjöld'`
- `comfortable: 'Þægileg útgjöld'`
- `deluxe: 'Lúxusútgjöld'`

#### `TIER_DESCRIPTIONS`
Brief descriptions for each tier

### Timeline & Calculation Defaults

#### `TIMELINE_DEFAULTS`
- `MAX_MONTHS: 600` (50 years max projection)
- `MIN_BALANCE_THRESHOLD: 0.01` (treat as zero)
- `MONTHS_PER_YEAR: 12`

#### `SCENARIO_VALIDATION`
- `MAX_NAME_LENGTH: 100`
- `MIN_NAME_LENGTH: 1`
- `DEFAULT_NAME_PREFIX: 'Sviðsmynd'`

#### `LIFE_ENERGY_DEFAULTS`
- `HOURS_PER_DAY: 24`
- `WORKING_DAYS_PER_WEEK: 5`
- `WORKING_WEEKS_PER_YEAR: 47` (accounting for Iceland's 5 weeks vacation)

### Icelandic Context Messages

#### `ICELANDIC_CONTEXT`
Educational messages about Iceland-specific factors:
- `HEALTHCARE` - Universal healthcare message
- `PENSION` - Pension contribution message
- `WORK_CULTURE` - Part-time work culture message

## Helper Functions

### Income Calculations
- `calculateNetIncome(grossIncome)` - Apply 16% pension deduction
- `calculateGrossIncome(netIncome)` - Reverse pension deduction

### Validation Helpers
- `isApproachingFullTime(hoursPerWeek)` - Check if approaching 40 hours
- `isUnrealisticWage(hourlyWage)` - Check wage reasonableness
- `isUnrealisticReturn(returnRate)` - Check return rate reasonableness
- `isApproachingPensionAge(age)` - Check if within 5 years of age 67
- `isValidSavings(savings)` - Validate savings range
- `isValidAnnualIncome(annualIncome)` - Validate income range
- `isValidWorkHours(hoursPerWeek)` - Validate hours range
- `isValidReturnRate(returnRate)` - Validate return rate range
- `isValidAge(age)` - Validate age range

### Lookup Helpers
- `getPresetByHours(hoursPerWeek)` - Find matching preset
- `getMultiplierOption(multiplier)` - Find matching FI multiplier
- `isAtMaxScenarios(scenarioCount)` - Check scenario limit

### Utility
- `generateDefaultScenarioName(index)` - Create default scenario name

## Key Features

### Icelandic-First Design
All constants and presets reflect Icelandic context:
- Universal healthcare (no employment requirement)
- Mandatory 16% pension contributions
- 5 weeks standard vacation
- Icelandic minimum wage (~1,500 ISK/hour)
- Higher recommended FI multiplier (30x vs US 25x)

### Comprehensive Validation
Includes validation ranges for all inputs:
- Savings (0 to 100M ISK)
- Annual income (100k to 30M ISK)
- Work hours (1 to 40 per week)
- Return rates (0% to 15%)
- Ages (18 to 100)
- Hourly wages (500 to 50k ISK)

### Helper Functions
15+ helper functions for common operations:
- Income conversions (gross ↔ net)
- Validation checks
- Preset lookups
- Warning thresholds

## Dependencies
- `@/types/baristaFire` - ExpenseTier type

## Integration
Used by:
- Barista FIRE calculation functions (Epic 1, Task 1.3)
- Barista FIRE UI components (Epic 3+)
- Validation utilities (Epic 2)

## Related
- Implements: Task 1.2 from specs/barista-fire/tasks-barista-fire.md
- Part of: Epic 1 (Foundation) in Barista FIRE Planner
- Depends on: context/modules/BaristaFireTypes.md (types)

## Notes
- All monetary values in ISK (Icelandic króna)
- All text in Icelandic for user-facing labels
- Net income multiplier (0.84) accounts for 16% pension
- 30x multiplier recommended for Iceland vs US standard 25x
- Part-time work culture less common in Iceland, freelance/consulting more flexible
