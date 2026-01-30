# Results Display Component

## Location
`apps/peninganaedalifid/src/components/calculator/ResultsDisplay.tsx`

## Purpose
Main results display component that shows the calculated actual hourly wage prominently, compares it to the nominal wage, and displays the percentage reduction with color-coded severity indicators.

## Exports
- `ResultsDisplay` - React component (no props, uses CalculatorContext)

## Key Functionality

### Main Results Display
- **Actual Hourly Wage**: Displayed prominently in large text (text-5xl/text-6xl)
- **Nominal Hourly Wage**: Shown for comparison in smaller text
- **Percentage Reduction**: Displayed as a color-coded badge
- **Reduction Amount**: Shows dollar amount of reduction per hour

### State Handling

#### Loading State (isHydrated = false)
- Shows animated skeleton loader
- Gradient background with pulse animation
- Two skeleton bars: one for title, one for wage

#### No Results State (results = null)
- Displays prompt message: "Enter your income to see your actual hourly wage"
- Clean, centered text layout

#### Results State (results exists)
- Full results display with all components
- Smooth transitions on value changes (300ms duration)

### Badge Color Coding
Dynamic badge variant based on percentage reduction:
- **Success** (green): < 15% reduction (low impact)
- **Warning** (yellow): 15-30% reduction (medium impact)
- **Danger** (red): > 30% reduction (high impact)

### Insight Message
When `percentageReduction > 0`, displays:
- "Work expenses and extra time reduce your wage by $X.XX per hour"
- Dollar amount shown in danger-600 color for emphasis
- Hidden when there's no reduction

## Component Structure

```tsx
<Card variant="elevated" className="bg-gradient-to-br from-primary-50 to-white">
  <CardHeader>
    <h2>Your Actual Hourly Wage</h2>
  </CardHeader>
  <CardContent>
    {/* Main wage display */}
    <div>
      <p className="text-5xl md:text-6xl">{actualHourlyWage}</p>
      <p className="text-sm">per hour</p>
    </div>

    {/* Comparison row */}
    <div className="flex">
      <div>
        <p>Nominal wage</p>
        <p>{nominalHourlyWage}</p>
      </div>
      <Badge variant={badgeVariant}>-{percentageReduction}%</Badge>
    </div>

    {/* Insight message (conditional) */}
    {percentageReduction > 0 && (
      <p>Work expenses and extra time reduce your wage by ${reduction} per hour</p>
    )}
  </CardContent>
</Card>
```

## Dependencies

### Internal
- `@/context/CalculatorContext` - useCalculator hook for accessing results
- `@/components/ui/Card` - Card, CardHeader, CardContent components
- `@/components/ui/Badge` - Badge component for percentage display
- `@/lib/utils` - formatCurrency formatter

### External
- `react` - React library (client component)

## Usage

```tsx
import { ResultsDisplay } from '@/components/calculator';

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <ResultsDisplay />
    </CalculatorProvider>
  );
}
```

Note: Must be used within a CalculatorProvider.

## Styling Details

### Typography
- **Actual Wage**: text-5xl (mobile), text-6xl (desktop), font-bold, text-primary-700
- **"per hour" label**: text-sm, text-neutral-500
- **Nominal Wage label**: text-sm, text-neutral-500
- **Nominal Wage value**: text-xl, font-semibold, text-neutral-700
- **Insight message**: text-sm, text-neutral-600
- **Reduction amount**: font-semibold, text-danger-600

### Layout
- Gradient background: bg-gradient-to-br from-primary-50 to-white
- Vertical spacing: space-y-4 on main content
- Centered text alignment throughout
- Responsive flex layout for comparison row
- Gap-4 between nominal wage and badge

### Animations
- Transition on actual wage: transition-all duration-300
- Skeleton pulse animation: animate-pulse
- Smooth value changes when inputs update

## Data Flow

1. **Context Access**: Component calls `useCalculator()` hook
2. **State Check**: Evaluates `isHydrated` and `results`
3. **Conditional Render**: Shows appropriate state (loading/no-results/results)
4. **Badge Calculation**: Determines variant based on percentageReduction
5. **Formatting**: Applies formatCurrency to all dollar amounts
6. **Display**: Renders formatted results with appropriate styling

## Calculation Dependencies

Relies on CalculationResults from context containing:
- `nominalHourlyWage`: number
- `actualHourlyWage`: number
- `percentageReduction`: number

All values calculated by the calculation engine and provided via context.

## Tests
- Location: `tests/components/calculator/ResultsDisplay.test.tsx`
- Coverage: 23 tests covering:
  - Loading state rendering
  - No results state rendering
  - Results display with all elements
  - Badge variant logic (success, warning, danger)
  - Edge cases (0%, 15%, 30%, 100% reduction)
  - Currency formatting (2 decimal places)
  - Percentage formatting (1 decimal place)
  - Insight message conditional display
  - Styling and layout classes
  - Gradient background application
  - Transition classes for animations

## Accessibility

- **Semantic HTML**: Uses h2 for heading, proper paragraph tags
- **Color Independence**: Text labels accompany color-coded badges
- **Readable Text**: High contrast ratios for all text
- **Responsive**: Text sizes adjust for mobile/desktop

## Integration
- Used by: Calculator page/layout
- Uses: CalculatorContext for state, UI components, formatters

## Related
- Implements: Requirement R-UI-001 (Results Display) from specs/actual-hourly-wage-calculator/requirements.md
- Part of: specs/actual-hourly-wage-calculator/design.md (Results Display Component section)
- Task: Task 15 from specs/actual-hourly-wage-calculator/tasks.md
