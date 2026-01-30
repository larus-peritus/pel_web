# SubscriptionSummary Component

## Location
`apps/peninganaedalifid/src/components/subscriptions/SubscriptionSummary.tsx`

## Purpose
Display a comprehensive summary of all user subscriptions, showing total costs, life energy impact, and future value calculations. Part of the Subscription Burn Meter feature.

## Exports
- `SubscriptionSummary` - Main component displaying subscription summary card
- `SubscriptionSummaryProps` - TypeScript interface for component props

## Key Functionality

### Cost Display
- Shows total monthly cost in ISK format (e.g., "15.678 kr")
- Shows total yearly cost in ISK format
- Uses gradient background for visual emphasis
- Two-column responsive grid layout

### Life Energy Calculations
- Displays life energy cost per month in hours/minutes
- Displays life energy cost per year in hours or days
- Automatically converts to days when >= 24 hours (8-hour workdays)
- Only shows when actual hourly wage is available

### Future Value Projections
- Shows potential value if invested for 10 years at 7% return
- Shows potential value if invested for 20 years at 7% return
- Includes disclaimer about 7% annual return rate
- Color-coded with success variant (green) to emphasize opportunity cost

### Warning States
- Shows alert when actual hourly wage is not calculated
- Prompts user to complete wage calculator first
- Warning uses Alert component with Icelandic text

### Conditional Rendering
- Returns null if no subscriptions exist
- Returns null if total monthly cost is 0
- Hides life energy section when wage is unavailable
- Hides future value section when wage is unavailable

## Props

```typescript
interface SubscriptionSummaryProps {
  className?: string; // Optional additional CSS classes
}
```

## Dependencies

### Context
- `useCalculator()` from `@/context/CalculatorContext`
  - Gets `subscriptionSummary` data
  - Gets `results` for actualHourlyWage validation

### UI Components
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `Alert` from `@/components/ui/Alert`

### Utilities
- `formatCurrency()` from `@/lib/utils` - ISK formatting with periods as thousands separators
- `formatNumber()` from `@/lib/utils` - Number formatting with Icelandic conventions
- `formatLifeEnergy()` from `@/lib/calculations/lifeEnergy` - Converts hours to human-readable time

## Styling

### Card Structure
- Elevated variant with gradient header
- Header: `bg-gradient-to-r from-warning-50 to-primary-50`
- Organized sections with border separators

### Color Coding
- **Primary blue**: Monthly/yearly costs
- **Warning yellow**: Life energy costs
- **Success green**: Future value projections

### Responsive Design
- Grid layout: 1 column mobile, 2 columns desktop (md:)
- Padding and spacing optimized for mobile and desktop

## Text (All in Icelandic)
- "Heildaráskriftir" - Total subscriptions (header)
- "Mánaðarlega" - Monthly
- "Árlega" - Yearly
- "Lífsorka kostnaður" - Life energy cost
- "Lífsorka á mánuði" - Life energy per month
- "Lífsorka á ári" - Life energy per year
- "Ef fjárfest í staðinn" - If invested instead
- "Ef fjárfest í 10 ár" - If invested for 10 years
- "Ef fjárfest í 20 ár" - If invested for 20 years
- "Miðað við 7% ársávöxtun" - Based on 7% annual return
- "Fylltu fyrst út Raunverulegt Tímakaup reiknivélina til að sjá lífsorku kostnað" - Fill out the wage calculator first to see life energy cost
- "dagur/dagar" - day/days
- "klukkustundir" - hours
- "mínútur" - minutes

## Data Flow

```
CalculatorContext
  ↓ subscriptionSummary
  ├─→ totalMonthly → formatCurrency()
  ├─→ totalYearly → formatCurrency()
  ├─→ lifeEnergyHoursPerMonth → formatLifeEnergy()
  ├─→ lifeEnergyHoursPerYear → formatNumber() + days conversion
  ├─→ futureValueIn10Years → formatCurrency()
  └─→ futureValueIn20Years → formatCurrency()

  ↓ results
  └─→ actualHourlyWage → validation (> 0 check)
```

## Tests
- Location: `tests/components/subscriptions/SubscriptionSummary.test.tsx`
- Coverage: 20 tests, all passing
- Test categories:
  - No subscriptions state (null rendering)
  - Warning message display
  - Monthly/yearly cost display
  - Life energy calculations and formatting
  - Future value projections
  - Conditional rendering logic
  - Header and styling
  - Edge cases (large/small amounts)

## Integration

### Used By
- Subscription Burn Meter page/section
- Dashboard summary views (potential)

### Uses
- CalculatorContext for subscription summary data
- CalculatorContext for actual wage validation
- Card components for layout
- Alert component for warnings
- Formatting utilities for Icelandic number display
- Life energy utilities for time formatting

## Related
- Implements: Requirements SBM-REQ-002, SBM-REQ-003, SBM-REQ-004 from subscription-burn-meter-requirements.md
- Part of: Subscription Burn Meter feature (specs/subscription-burn-meter-design.md)
- Complements: SubscriptionForm, SubscriptionList components
- Data source: calculateSubscriptionSummary() from @/lib/calculations/subscriptions

## Implementation Notes
- Component is "client-side" (`'use client'` directive)
- Uses early return pattern for conditional rendering
- Optimized for performance (minimal re-renders)
- Fully accessible with semantic HTML
- Mobile-first responsive design
- Icelandic locale throughout
