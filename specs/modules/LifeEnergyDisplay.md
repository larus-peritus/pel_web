# LifeEnergyDisplay Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/LifeEnergyDisplay.tsx`

## Purpose
Displays the FI number in terms of "life energy" (years of work) based on the user's Actual Hourly Wage (AWH). This component helps users understand their FI number in time terms rather than just money, making the concept more tangible and relatable.

## Component Type
React functional component (display component)

## Props

```typescript
interface LifeEnergyDisplayProps {
  lifeEnergy: FINumberLifeEnergy;  // Life energy metrics from calculations
  fiNumber: number;                 // The FI number in ISK
  currentSavings?: number;          // Optional current savings for progress calculation
}
```

## Key Functionality

### Display Features
- **Years of Work**: Shows FI number as years of work (FI ÷ annual net income)
- **Progress Indicators**: Visual progress bars showing progress toward FI
- **Years to FI**: Displays remaining years if savings data is available
- **Timeline Visualization**: Shows current position on journey to FI
- **Motivational Messages**: Context-aware encouragement based on progress
- **Explanation Section**: Educational content about life energy concept

### Progress Calculation
- If `yearsToFI` is available: calculates progress as `(yearsOfWork - yearsToFI) / yearsOfWork * 100`
- Progress determines color scheme:
  - >= 75%: Success green (achievement phase)
  - >= 50%: Primary blue (halfway milestone)
  - >= 25%: Warning yellow (early progress)
  - < 25%: Orange (starting phase)

### Conditional Rendering
- Only renders progress section if `yearsToFI > 0`
- Shows savings prompt if no `yearsToFI` but has `currentSavings`
- Progress bar includes percentage overlay when >= 10%

## Dependencies

### Internal
- `@/components/ui/Card` - Card, CardHeader, CardContent for layout
- `@/lib/utils/formatters` - formatNumber for Icelandic number formatting
- `@/types/fiNumber` - FINumberLifeEnergy type definition

### External
- React - useState, useEffect hooks

## Styling
- Gradient background (primary to indigo)
- Responsive design (mobile-first)
- Color-coded progress bars
- Animated transitions on progress changes
- Accessible ARIA attributes

## Accessibility
- Progress bars have proper `role="progressbar"` and ARIA attributes
- Clear visual hierarchy
- High contrast color schemes
- Screen reader friendly labels

## Integration

### Used By
- `ResultsDisplay` component (conditionally when AWH available)

### Uses
- Life energy data from `calculateFINumberLifeEnergy()` calculation
- Requires Actual Hourly Wage to be calculated first

## Related
- Implements: Requirements FR-6.1-6.4, US-5 from specs/fi-number-builder/requirements-fi-number-builder.md
- Part of: Epic 6 (Life Energy Display) in specs/fi-number-builder/tasks-fi-number-builder.md
- Based on: "Your Money or Your Life" life energy philosophy

## Testing
- Location: tests/components/fiNumber/LifeEnergyDisplay.test.tsx
- Coverage: 25 test cases covering rendering, progress calculation, motivational messages, accessibility, and edge cases
- All tests passing

## Example Usage

```tsx
<LifeEnergyDisplay
  lifeEnergy={{
    actualHourlyWage: 5000,
    annualNetIncome: 9_600_000,
    yearsOfWork: 18.75,
    yearsToFI: 12.5
  }}
  fiNumber={180_000_000}
  currentSavings={60_000_000}
/>
```

## Implementation Notes
- Years are displayed with 1 decimal place for precision
- Progress percentage uses 0 decimal places for simplicity
- Component gracefully handles missing `yearsToFI` (shows basic display)
- All text in Icelandic for consistency with app
- Encourages users to add savings data if not available

## Future Enhancements
- Add toggle to show in months instead of years
- Allow comparison with different scenarios
- Show historical progress over time
- Add celebration animations when milestones reached
