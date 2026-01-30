# FINumberComparison Component

## Location
`src/components/pensionAwareFire/FINumberComparison.tsx`

## Purpose
Visually displays the dramatic difference between Traditional FI and Pension-Adjusted FI numbers, emphasizing the savings benefit of pension-aware retirement planning in Iceland.

## Features

### Visual Comparison
- **Two-Column Layout**: Side-by-side comparison of Traditional FI vs Pension-Adjusted FI
- **Arrow Connector**: Visual flow indicator showing the adjustment (desktop: horizontal, mobile: vertical)
- **Large Bold Numbers**: 3xl-4xl font size for maximum visual impact
- **Color-Coded Styling**:
  - Traditional FI: Gray/neutral (generic approach)
  - Pension-Adjusted FI: Green gradient with ring (success/smart approach)

### Savings Highlight Box
- **Amount Saved**: Large display of ISK savings difference
- **Percentage Reduction**: Shows percentage reduction (e.g., "73% minni!")
- **Years Earlier**: Optional display of how many years earlier retirement is possible
- **Green Gradient Background**: Prominent success styling to emphasize benefit
- **Explanation Text**: Educational content about why savings are lower

### Edge Case Handling
- **Minimal Difference Detection**: Threshold of 100,000 ISK
- **Alternative Message**: Shows different content when retiring at 67+ (minimal difference)
- **Conditional Rendering**: Years earlier only shown when > 0 and not null

## Props

```typescript
interface FINumberComparisonProps {
  /** Traditional FI number (25-30x expenses, no pension consideration) (ISK) */
  traditionalFI: number;

  /** Pension-adjusted FI number (what you actually need) (ISK) */
  pensionAdjustedFI: number;

  /** Amount saved by using pension-aware approach (ISK) */
  savings: number;

  /** Percentage reduction in required savings (0-100) */
  savingsPercent: number;

  /** Years earlier you can retire with pension-aware planning (optional) */
  yearsEarlier?: number | null;
}
```

## Visual Design

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    FI-tölu samanburður                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐         ┌─────────────────────┐        │
│  │  Hefðbundin FI      │    →    │  Lífeyristengd FI   │        │
│  │  144.000.000 kr     │         │  38.500.000 kr      │        │
│  │  (30x árleg útgjöld)│         │  (raunveruleg þörf) │        │
│  └─────────────────────┘         └─────────────────────┘        │
│                                   [Green with ring]             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Þú sparar: 105.500.000 kr                             │    │
│  │  (73% minni!)                                          │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │  Eða getur hætt 8.5 árum fyrr!                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│  [Green gradient background with prominent border]             │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout
- Columns stack vertically
- Arrow rotates 90 degrees (points down)
- Same content, optimized for narrow screens

## Color Scheme

### Traditional FI Column
- Background: `bg-white dark:bg-gray-800`
- Border: `border-gray-300 dark:border-gray-600`
- Text: `text-gray-900 dark:text-white`
- Subtle shadow for depth

### Pension-Adjusted FI Column
- Background: `bg-gradient-to-br from-green-50 to-emerald-50`
- Dark mode: `from-green-950/40 to-emerald-950/40`
- Border: `border-green-500 dark:border-green-600`
- Ring: `ring-green-200 dark:ring-green-800`
- Text: `text-green-900 dark:text-green-100`
- Emphasized with shadow and ring

### Savings Box
- Background: `bg-gradient-to-br from-green-100 to-emerald-100`
- Dark mode: `from-green-900/40 to-emerald-900/40`
- Border: `border-green-600 dark:border-green-500`
- Heavy shadow for prominence
- Dividers: `border-green-300 dark:border-green-700`

### Arrow Connector
- Color: `text-blue-600 dark:text-blue-400`
- Size: 4xl (large and clear)
- Positioned absolutely on desktop

## Content Structure

### Header
- Title: "FI-tölu samanburður"
- Subtitle: "Hefðbundin FIRE vs. Lífeyristengd FIRE"

### Traditional FI Display
- Label: "Hefðbundin FI"
- Amount: Formatted with Icelandic separators
- Explanation: "(30x árleg útgjöld)"

### Pension-Adjusted FI Display
- Label: "Lífeyristengd FI"
- Amount: Formatted with Icelandic separators
- Explanation: "(raunveruleg þörf)"

### Savings Highlight (when difference > 100k ISK)
- "Þú sparar:" label
- Savings amount (large, bold)
- Percentage reduction (e.g., "73% minni!")
- Years earlier (conditional, with divider)
- Explanation paragraph

### Edge Case Content (when difference ≤ 100k ISK)
- Blue info box
- Message: "Þar sem þú ætlar að hætta nálægt 67 ára aldri..."
- Explains why difference is minimal

### Help Text (Footer)
- Defines "Hefðbundin FI"
- Defines "Lífeyristengd FI"
- Lists pension sources included

## Formatting

### Numbers
Uses `formatCurrency()` from `@/lib/utils/formatters`:
- Icelandic thousand separators (periods)
- No decimals for amounts
- " kr" suffix
- Example: "144.000.000 kr"

### Percentages
Uses `formatPercentage()` with 0 decimals:
- Rounded to whole number
- Example: "73%"

### Years
Displays with 1 decimal using `toFixed(1)`:
- Example: "8.5 árum fyrr"

## Integration

### Data Source
Receives all props from parent (likely PensionAwareFIRECalculator):
- `traditionalFI` from `pensionAwareFireResults.traditionalFINumber`
- `pensionAdjustedFI` from `pensionAwareFireResults.pensionAdjustedFINumber`
- `savings` from `pensionAwareFireResults.savingsDifference`
- `savingsPercent` from `pensionAwareFireResults.savingsPercentageReduction`
- `yearsEarlier` from `pensionAwareFireResults.yearsEarlierRetirement`

### Usage Example
```tsx
import { FINumberComparison } from '@/components/pensionAwareFire/FINumberComparison';

<FINumberComparison
  traditionalFI={144_000_000}
  pensionAdjustedFI={38_500_000}
  savings={105_500_000}
  savingsPercent={73.3}
  yearsEarlier={8.5}
/>
```

## Dependencies

### UI Components
- `Card` - Container with gradient background

### Utilities
- `formatCurrency` - ISK formatting with Icelandic separators
- `formatPercentage` - Percentage formatting

## Testing

### Test Coverage (24 tests, all passing)

**Rendering (5 tests)**
- All sections render correctly
- Years earlier shown when provided
- Years earlier hidden when null/undefined/zero

**Number Formatting (5 tests)**
- Traditional FI formatted correctly
- Pension-adjusted FI formatted correctly
- Savings amount formatted correctly
- Percentage formatted to 0 decimals
- Years formatted to 1 decimal

**Calculations (2 tests)**
- Savings difference displayed correctly
- Percentage reduction displayed correctly

**Edge Cases (6 tests)**
- Minimal difference (≤100k): Shows alternative message
- Just over threshold (>100k): Shows savings box
- Very large FI numbers handled
- Small FI numbers handled
- Fractional years rounded correctly
- Negative years not displayed

**Visual Styling (3 tests)**
- Green success styling on pension-adjusted column
- Gradient background on savings box
- Arrow connector present

**Content (3 tests)**
- Explanation text displayed
- Help text explaining both FI types
- Edge case explanation for minimal difference

### Test File
`tests/components/pensionAwareFire/FINumberComparison.test.tsx`

## Implementation Notes

### Threshold Logic
The component uses a 100,000 ISK threshold to determine "significant difference":
```typescript
const hasSignificantDifference = savings > 100_000;
```

This prevents showing a dramatic "savings" display for cases where the user is retiring near age 67 and both FI numbers are nearly equal.

### Responsive Design
- **Desktop (md+)**: Two-column grid with horizontal arrow
- **Mobile**: Stacked layout with vertical (rotated) arrow
- Arrow uses `transform: rotate(90deg)` on mobile

### Dark Mode
All colors have dark mode variants:
- Uses Tailwind's `dark:` prefix
- Maintains visual hierarchy in both modes
- Green success theme preserved in dark mode

### Accessibility
- Semantic HTML structure
- Clear heading hierarchy
- Sufficient color contrast
- Bold text for emphasis
- Clear visual hierarchy

### Years Earlier Logic
Only displays if:
1. Not null/undefined
2. Greater than 0

This prevents showing confusing messages like "0 years earlier" or negative values.

### Icelandic Localization
All text in Icelandic:
- "Þú sparar" (You save)
- "minni" (less)
- "árum fyrr" (years earlier)
- "raunveruleg þörf" (actual need)

## Performance

### Component Weight
- Lightweight: No state or effects
- Pure presentational component
- Fast rendering with simple conditionals

### Optimization
- No unnecessary re-renders (no internal state)
- Minimal DOM updates
- CSS-based styling (no JS animations)

## Used By
- `PensionAwareFIRECalculator` (Epic 7, Task 7.1 - planned)

## Related Modules
- Types: `context/modules/PensionAwareFireTypes.md`
- Calculations: `context/modules/PensionAwareFireCalculations.md`
- Feature: `context/features/pension-aware-fire.md`

## Future Enhancements

1. **Animation**: Animate numbers on first render (count-up effect)
2. **Comparison Toggle**: Show/hide traditional FI to focus on pension-adjusted
3. **Detailed Breakdown**: Expand to show where savings come from
4. **Export**: Generate shareable image of comparison
5. **Interactive Sliders**: Adjust assumptions to see impact on savings
6. **Historical Comparison**: Show how numbers have changed over time
7. **Goal Tracking**: Show progress toward pension-adjusted FI number

## Success Metrics
- Users immediately understand the benefit of pension-aware planning
- Visual impact drives engagement with the calculator
- Clear communication of savings magnitude
- Edge cases handled gracefully without confusion
