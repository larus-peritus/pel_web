# ResultsDisplay Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/ResultsDisplay.tsx`

## Purpose
Display the calculated FI number prominently with a detailed breakdown showing monthly expenses, annual expenses, multiplier, and withdrawal rate. This is the main results display component for the FI Number Builder feature.

## Exports
- `ResultsDisplay` (React component) - Main results display component
- `ResultsDisplayProps` (TypeScript interface) - Props interface for the component

## Key Functionality

### Display States
- **Loading State**: Shows animated skeleton loaders for hero and breakdown sections
- **No Results State**: Displays empty state with icon and prompt when FI number is null or 0
- **Results State**: Shows full FI number display with detailed breakdown
- **Pension Mode**: Renders PensionAdjustedResults component when pension data exists (Epic 5)
- **Life Energy Mode**: Shows LifeEnergyDisplay when AWH is available (Epic 6)
- **AWH Prompt**: Displays AWHPrompt when AWH is not available (Epic 6)

### Hero FI Number Display
- Large, bold display of FI number (text-4xl to text-6xl responsive)
- Gradient background (primary-50 → primary-100 → success-50)
- Icelandic text: "Þín FI-tala"
- Descriptive subtitle explaining what the FI number represents
- Shadow and border for prominence

### Breakdown Card
- **Monthly Expenses**: Shows monthly expense amount with description
- **Annual Expenses**: Displays monthly × 12 calculation
- **Multiplier**: Shows the multiplier used (e.g., 30x)
- **Withdrawal Rate**: Displays the withdrawal percentage (e.g., 3.33%)
- **Formula Display**: Visual representation of calculation (Annual × Multiplier = FI Number)

### Number Formatting
- Uses `formatCurrency()` for all ISK amounts
- Uses `formatNumber()` for multiplier (0 decimals)
- Uses `formatPercentage()` for withdrawal rate (2 decimals)
- Icelandic thousands separator (period): 180.000.000 kr

### Responsive Design
- Hero section: 8-12 padding (mobile to desktop)
- Text sizes: responsive (text-4xl → text-5xl → text-6xl)
- Breakdown layout: Stack on mobile, side-by-side on larger screens
- Flexible layout for all screen sizes

## Props Interface

```typescript
interface ResultsDisplayProps {
  fiNumber: number | null;                          // The calculated FI number
  monthlyExpenses: number;                          // Monthly expenses amount
  annualExpenses: number;                           // Annual expenses (monthly × 12)
  multiplier: number;                               // FI multiplier (e.g., 25, 30, 33)
  withdrawalRate: number;                           // Withdrawal rate percentage (e.g., 3.33)
  isLoading?: boolean;                              // Optional loading state
  pensionAdjusted?: PensionAdjustedResult | null;   // Pension data (Epic 5)
  lifeEnergy?: FINumberLifeEnergy | null;           // Life energy metrics (Epic 6)
  currentSavings?: number;                          // Current savings for progress (Epic 6)
  showAWHPrompt?: boolean;                          // Whether to show AWH prompt (Epic 6)
}
```

## Dependencies
- `@/components/ui/Card` - Card, CardHeader, CardContent components
- `@/lib/utils/formatters` - formatCurrency, formatNumber, formatPercentage utilities
- `@/components/fiNumber/PensionAdjustedResults` - Pension mode display (Epic 5)
- `@/components/fiNumber/LifeEnergyDisplay` - Life energy display (Epic 6)
- `@/components/fiNumber/AWHPrompt` - AWH calculator prompt (Epic 6)
- `@/types/fiNumber` - PensionAdjustedResult, FINumberLifeEnergy types
- React

## Tests
- Location: `apps/peninganaedalifid/tests/components/fiNumber/ResultsDisplay.test.tsx`
- Coverage: 30 tests covering all states, formatting, responsiveness, and accessibility
- Test categories:
  - Display States (loading, no results, full results)
  - FI Number Display (formatting, prominence, visual hierarchy)
  - Expense Breakdown (all four breakdown items)
  - Calculation Formula (display and updates)
  - Responsive Design (text sizes, layouts)
  - Icelandic Formatting (number formatting, text language)
  - Visual Hierarchy (gradients, cards, separation)
  - Edge Cases (large/small numbers, decimal multipliers)
  - Accessibility (headings, labels, helper text)

## Integration
- Used by: FINumberBuilderCalculator (main calculator component) - to be implemented
- Uses: Card component system, formatting utilities

## Related
- Implements: Requirements FR-1, US-1 from `specs/fi-number-builder/requirements-fi-number-builder.md`
- Part of: Task 3.4 in `specs/fi-number-builder/tasks-fi-number-builder.md`
- Feature: FI Number Builder (FIRE Planning Tool)

## Visual Design
- Primary color palette for FI number (primary-700, primary-900)
- Success color for withdrawal rate (success-700)
- Neutral colors for breakdown labels (neutral-800, neutral-600)
- Gradient hero section with border for visual impact
- Clear visual hierarchy with borders, spacing, and typography

## Accessibility
- Proper heading hierarchy (h3 for breakdown heading)
- Descriptive labels for all values
- Helper text for clarity
- Empty state with clear messaging
- Loading state with skeleton loaders

## Usage Example

```tsx
import { ResultsDisplay } from '@/components/fiNumber';

function MyComponent() {
  return (
    <ResultsDisplay
      fiNumber={180000000}
      monthlyExpenses={500000}
      annualExpenses={6000000}
      multiplier={30}
      withdrawalRate={3.33}
    />
  );
}
```

## Implementation Notes
- All text is in Icelandic per app requirements
- Numbers use Icelandic formatting (period as thousands separator)
- Component is responsive and mobile-first
- Visual hierarchy emphasizes the FI number as the hero element
- Breakdown provides clear understanding of how FI number was calculated
- Formula display helps users understand the simple calculation
- Loading and empty states provide good UX for all scenarios

## Updates

### Epic 5: Pension Integration (2026-01-29)
- Added `pensionAdjusted` prop for pension mode
- Conditional rendering: shows PensionAdjustedResults when pension data exists
- Falls back to basic results display when no pension data
- Clean integration without breaking existing functionality

### Epic 6: Life Energy Display (2026-01-29)
- Added `lifeEnergy`, `currentSavings`, and `showAWHPrompt` props
- Conditional rendering: shows LifeEnergyDisplay when AWH available
- Shows AWHPrompt when AWH not available (encourages AWH calculation)
- Seamless integration with existing pension and basic display modes
- All sections clearly separated for easy understanding

## Completed
- Implemented: 2026-01-29
- Pension Mode: Added 2026-01-29 (Epic 5)
- Life Energy Mode: Added 2026-01-29 (Epic 6)
- Tests: All 30 tests passing
- Status: Complete with pension and life energy integration ready
