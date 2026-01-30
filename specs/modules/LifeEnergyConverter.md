# LifeEnergyConverter Component

## Location
`apps/peninganaedalifid/src/components/calculator/LifeEnergyConverter.tsx`

## Purpose
Interactive component that converts dollar amounts to life energy hours, helping users understand the true time cost of purchases. This is a key concept from "Your Money or Your Life" - showing how every dollar represents time from your life.

## Exports
- `LifeEnergyConverter` - Main component

## Key Functionality

### Dollar-to-Time Conversion
- Accepts dollar amount input (default: $100)
- Converts to life energy hours using actual hourly wage
- Displays human-readable time format (minutes, hours, or work days)
- Updates instantly as amount changes

### Quick Amount Buttons
- Predefined amounts: $50, $100, $500, $1000
- Visual highlighting of active selection
- One-click access to common purchase amounts
- Helps users quickly evaluate typical purchases

### User Experience
- Clean card-based layout with outlined variant
- Real-time calculation using useMemo for performance
- Clear result display with contextual messaging
- Graceful handling of edge cases (no results, zero wage)

## Component Structure

```tsx
<Card variant="outlined">
  <CardHeader>
    - Title and description
  </CardHeader>
  <CardContent>
    - CurrencyInput for amount entry
    - Quick amount button grid
    - Highlighted result display
  </CardContent>
</Card>
```

## Dependencies
- **React**: useState, useMemo hooks
- **@/context/CalculatorContext**: useCalculator for results data
- **@/lib/calculations**: dollarsToLifeEnergy, formatLifeEnergy
- **@/components/ui/CurrencyInput**: Dollar amount input
- **@/components/ui/Button**: Quick amount selectors
- **@/components/ui/Card**: Container and layout components

## State Management
- **Local State**: `amount` (number, default 100)
- **Context State**: `results` from CalculatorContext
- **Computed State**: `lifeEnergyHours` (memoized calculation)

## Integration
- Used by: Calculator results page/dashboard
- Requires: CalculatorContext with valid results
- Returns null when results are unavailable

## User Interactions
1. **Manual Entry**: Type any dollar amount
2. **Quick Select**: Click preset amount button
3. **Instant Feedback**: See life energy calculation update

## Display Logic
- **< 1 hour**: Shows as minutes (e.g., "45 minutes")
- **1-24 hours**: Shows hours and minutes (e.g., "3h 30m")
- **> 24 hours**: Shows work days (8-hour days) and hours (e.g., "2 days 4h")

## Edge Cases
- **No results**: Component returns null
- **Zero wage**: Shows "0 minutes"
- **Negative amounts**: Handled by lifeEnergy calculation (returns 0)
- **Custom amounts**: Deselects quick buttons

## Tests
- Location: `tests/components/calculator/LifeEnergyConverter.test.tsx`
- Coverage: 21 tests, all passing
- Test Categories:
  - Rendering (4 tests)
  - Default State (2 tests)
  - Life Energy Calculation (6 tests)
  - Quick Amount Buttons (5 tests)
  - Manual Input (2 tests)
  - Result Display (2 tests)
  - Accessibility (2 tests)

## Styling
- **Card**: Outlined variant for visual distinction
- **Result Display**: Primary-50 background with primary-700 text
- **Active Button**: Primary variant (blue)
- **Inactive Button**: Secondary variant (white with border)
- **Layout**: Flexbox with gap-2 for button grid, space-y-4 for vertical spacing

## Related
- Implements: Requirement CAL-010 (Life Energy Conversion) from `specs/actual-hourly-wage-calculator/requirements.md`
- Part of: Results/Analytics section from `specs/actual-hourly-wage-calculator/design.md`
- Task: Task 17 from `specs/actual-hourly-wage-calculator/tasks.md`

## Implementation Notes
- Uses memoization to prevent unnecessary recalculations
- Leverages existing life energy utility functions for consistency
- Follows "Your Money or Your Life" methodology
- Designed to create "aha moments" about purchase costs
- Mobile-friendly with responsive button layout
