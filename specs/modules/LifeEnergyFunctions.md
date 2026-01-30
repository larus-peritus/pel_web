# Life Energy Functions

## Location
`apps/peninganaedalifid/src/lib/calculations/lifeEnergy.ts`

## Purpose
Implements life energy conversion functions based on "Your Money or Your Life" philosophy - converting dollar amounts to time (hours of life energy) and formatting them in human-readable formats.

## Exports
- `function dollarsToLifeEnergy(dollars: number, actualWage: number): number` - Converts dollar amounts to hours of life energy
- `function formatLifeEnergy(hours: number): string` - Formats hours into human-readable strings with adaptive units
- `function formatDollarsAsLifeEnergy(dollars: number, actualWage: number): string` - Convenience function combining conversion and formatting

## Key Functionality

### Dollar to Life Energy Conversion
- Converts dollar amounts to hours based on actual hourly wage
- Handles edge cases: zero/negative wage returns 0, negative dollars returns 0
- Pure function with no side effects

### Life Energy Formatting
Adaptive formatting based on duration:
- **< 1 hour**: Shows minutes (e.g., "30 minutes", "1 minute")
- **1-24 hours**: Shows hours and minutes (e.g., "5h 30m", "3 hours")
- **> 24 hours**: Shows work days (8-hour days) and hours (e.g., "3 days 4h", "2 work days")

Features:
- Proper singular/plural handling ("1 minute" vs "2 minutes")
- Rounding to nearest minute for clarity
- Negative hours handled gracefully (returns "0 minutes")

### Convenience Function
- `formatDollarsAsLifeEnergy()` combines conversion and formatting in one call
- Useful for UI components that need to display dollar amounts as life energy

## Dependencies
- No external dependencies
- Pure TypeScript/JavaScript math functions

## Tests
- Location: `apps/peninganaedalifid/tests/lib/calculations/lifeEnergy.test.ts`
- Coverage: 30 test cases covering:
  - Dollar conversion with various wages (zero, negative, fractional)
  - Formatting edge cases (negative, zero, fractional hours)
  - Singular/plural grammar handling
  - All three time range formats (minutes, hours+minutes, days+hours)
  - Convenience function integration
  - All tests passing

## Integration
- Used by: Results display components, expense breakdown calculations
- Uses: None (pure functions)
- Exported via: `src/lib/calculations/index.ts`

## Related
- Implements: Requirements from specs/actual-hourly-wage-calculator/requirements.md (REQ-4.1, REQ-4.2)
- Part of: specs/actual-hourly-wage-calculator/design.md (Life Energy Functions section)
- Complements: `wage.ts` (provides the actual wage values used in conversion)
