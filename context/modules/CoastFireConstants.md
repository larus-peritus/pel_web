# Coast FIRE Constants Module

## Location
`apps/peninganaedalifid/src/lib/constants/coastFire.ts`

## Purpose
Provides all constant values, default configurations, and Icelandic-specific settings for the Coast FIRE (Ró FIRE) Calculator. Centralizes configuration for return rate scenarios, validation rules, status messages, and action suggestions.

## Key Features
- Return rate scenario definitions (Conservative 4%, Moderate 6%, Optimistic 8%)
- Default ages and multipliers (Icelandic retirement age 67, recommended 25x multiplier)
- Comprehensive validation ranges and error messages
- Action suggestion templates for impossible scenarios
- Status messages and color schemes
- Chart visualization defaults
- Helper functions for validation and configuration

## Exports

### Constants

#### Age Defaults
- `COAST_FIRE_AGES`: Default ages (current: 30, retirement: 67, min: 18, max: 100)
- `AGE_LIMITS`: Validation ranges for current age and retirement age

#### Return Rates
- `RETURN_RATE_SCENARIOS`: Three scenarios (conservative: 4%, moderate: 6%, optimistic: 8%)
- `DEFAULT_RETURN_RATE`: 6% (moderate scenario)
- `RETURN_RATE_RANGE`: Min -10%, Max 15%, warnings below 3% or above 10%

#### Scenario Labels
- `SCENARIO_LABELS`: Icelandic names (Íhaldssöm, Miðlungs, Bjartsýn)
- `SCENARIO_DESCRIPTIONS`: Descriptions with percentages and portfolio types

#### FI Multipliers
- `FI_MULTIPLIER_DEFAULTS`: Standard (25), Conservative (30), Very Conservative (33), Min (20), Max (40)

#### Input Ranges
- `INVESTMENT_RANGE`: 0 to 10 billion ISK
- `FI_NUMBER_RANGE`: 1 to 10 billion ISK

#### Default Values
- `COAST_FIRE_DEFAULTS`: Initial state for calculator (age 30, retirement 67, 6% return, 25x multiplier)

#### Calculation Constants
- `CALCULATION_CONSTANTS`: Compounding frequency (annual), work hours per year (2080), max projection (100 years), close call threshold (5%)

#### Action Suggestions
- `ACTION_SUGGESTIONS`: Templates for four suggestion types (delay retirement, reduce FI, increase return, continue saving)
- Each includes title, description template, calculation template, and feasibility thresholds

#### Chart Defaults
- `CHART_DEFAULTS`: Height (400px), mobile height (300px), max data points (100)
- `STATUS_COLORS`: Tailwind classes for each status (coasting: green, future: blue, impossible: amber)
- `CHART_COLORS`: Colors for projection lines, milestones, and scenario lines

#### Messages
- `VALIDATION_ERRORS`: 12 error messages in Icelandic
- `VALIDATION_WARNINGS`: 8 warning messages in Icelandic
- `STATUS_MESSAGES`: User-facing messages for each status (coasting, future, impossible)

### Helper Functions

#### Scenario Helpers
- `getScenarioConfig(type: ScenarioType)`: Returns full config (name, description, rate, color) for scenario type
- `getAllScenarios()`: Returns array of all three scenario configurations

#### Validation Helpers
- `needsReturnRateWarning(rate: number)`: Returns true if rate < 3% or > 10%
- `isVeryLongTimeline(years: number)`: Returns true if > 40 years
- `isEffectivelyImpossible(years: number | null)`: Returns true if null or > 100 years
- `isValidCurrentAge(age: number)`: Validates age between 18-100
- `isValidRetirementAge(retirementAge: number, currentAge: number)`: Validates retirement age > current age and within limits
- `isValidReturnRate(rate: number)`: Validates rate between -10% and 15%
- `isValidInvestmentAmount(amount: number)`: Validates amount between 0 and 10 billion
- `isValidFINumber(fiNumber: number)`: Validates FI number between 1 and 10 billion
- `isValidMultiplier(multiplier: number)`: Validates multiplier between 20x and 40x

#### UI Helpers
- `getStatusColors(status)`: Returns Tailwind color classes for status
- `getChartSampleInterval(yearSpan: number)`: Calculates optimal data point sampling to stay under 100 points

## Key Functionality

### Return Rate Scenarios
Three pre-defined scenarios for scenario comparison:
- **Conservative (4%)**: Bond-heavy portfolio with some stocks
- **Moderate (6%)**: Balanced portfolio (default)
- **Optimistic (8%)**: Stock-heavy portfolio

All returns are REAL (inflation-adjusted), not nominal.

### Default Values
Icelandic-specific defaults:
- Retirement age: 67 (lífeyrissjóður start age)
- FI multiplier: 25x (4% withdrawal rate)
- Expected return: 6% real
- Current age: 30 (placeholder)

### Action Suggestions
When Coast FIRE is impossible, provides four types of actionable suggestions:
1. **Delay Retirement**: Calculate required retirement age
2. **Reduce FI Number**: Calculate achievable FI number
3. **Increase Return**: Calculate required return rate (with risk warning)
4. **Continue Saving**: Calculate monthly savings needed

Each suggestion includes:
- Icelandic title and description
- Calculation template with placeholders
- Feasibility rating (easy/moderate/difficult) based on thresholds

### Validation
Comprehensive validation with two levels:
- **Errors**: Blocking issues (age out of range, negative investments, missing FI number)
- **Warnings**: Non-blocking concerns (very high/low returns, long timelines, zero investments)

All messages in Icelandic with clear explanations.

### Chart Configuration
Optimized for performance:
- Limits data points to 100 for responsive rendering
- Auto-samples at intervals for long timelines
- Separate heights for desktop (400px) and mobile (300px)
- Color-coded by status and scenario

## Dependencies
- `../../types/coastFire`: ScenarioType type definition

## Integration
Used by:
- Coast FIRE calculation functions (for defaults and validation)
- Coast FIRE input components (for ranges and defaults)
- Coast FIRE results display (for status messages and colors)
- Coast FIRE chart component (for visualization config)
- Coast FIRE validation utilities (for error/warning messages)

## Design Decisions

### Icelandic Context
- Retirement age 67 reflects lífeyrissjóður (Icelandic pension system)
- Real returns (inflation-adjusted) to account for Iceland's historically higher inflation
- Conservative return assumptions (4-8%) appropriate for Icelandic market

### Return Rate Scenarios
- 4%: Very conservative, appropriate for pre-retirement or low-risk portfolios
- 6%: Historical long-term average for balanced portfolios
- 8%: Optimistic but historically achievable with equity-heavy allocation

### Multiplier Defaults
- 25x standard aligns with 4% withdrawal rule (Trinity Study)
- 30x conservative option (3.33% withdrawal) recommended for Iceland
- Range 20-40x covers most reasonable scenarios

### Action Suggestions
Four suggestion types cover main adjustment levers:
1. Time (delay retirement)
2. Goal (reduce FI number)
3. Risk (increase return)
4. Savings (continue contributing)

Feasibility ratings help users understand difficulty of each path.

### Validation Philosophy
- **Permissive**: Allow wide ranges (even negative returns) for scenario exploration
- **Informative**: Provide warnings for unusual values
- **Educational**: Explain why values are concerning
- **Blocking**: Only error on clearly invalid inputs (negative age, missing required fields)

## Testing Considerations
- Validation helpers have clear boolean returns (easy to test)
- All constants are immutable (readonly/as const)
- Helper functions are pure (no side effects)
- Message templates use consistent {placeholder} syntax

## Implementation Notes
- All monetary values in ISK (Icelandic króna)
- All percentages stored as numbers (6 = 6%, not 0.06)
- All Icelandic text uses proper characters (ð, þ, á, etc.)
- Template strings use {placeholder} syntax for dynamic values
- Color values use hex for chart colors, Tailwind classes for status colors

## Related Modules
- `CoastFireTypes.md`: Type definitions this module references
- `FINumberConstants.md`: Similar pattern for FI Number Builder
- `FatFireConstants.md`: Similar pattern for FatFIRE Planner

## Status
**Complete** - All constants defined, helper functions implemented, TypeScript compilation verified.

Created: 2026-01-29
Last Updated: 2026-01-29
