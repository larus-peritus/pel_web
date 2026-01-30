# Snowball Calculator Main Page Component

## Location
`apps/peninganaedalifid/src/components/snowball/SnowballCalculatorPage.tsx`
`apps/peninganaedalifid/src/app/snjoboltareiknivel/page.tsx`

## Purpose
Main orchestrator component for the Interest Savings Snowball Calculator feature. Manages state for all inputs, calculates results, and renders all child components in a coherent layout. Includes pre-fill logic from query parameters for integration with Debt Payoff calculator.

## Exports
- `SnowballCalculatorPage` - Main page component with state management and layout

## Key Functionality

### State Management
- **Loan Input State**: Manages `SnowballLoanInput` with all loan parameters
- **Extra Payment State**: Tracks monthly extra payment amount
- **Investment Return State**: Manages expected investment return percentage
- **Pre-fill from Query Params**: Reads `data` parameter on mount to pre-populate fields

### Input Validation
- Validates all required fields before calculation
- Shows validation error alert when inputs are invalid
- Ensures positive values for monetary amounts
- Prevents calculation with missing or invalid data

### Real-time Calculation
- Uses `useMemo` to recalculate when inputs change
- Automatic debouncing via React's memoization
- Calls `calculateSnowball()` with complete input
- Handles calculation errors gracefully with try-catch

### Layout Structure
1. **Header Section**: Title and description in Icelandic
2. **Warning Alert**: Shows if actualHourlyWage not set
3. **Input Section**: Grid layout with three input cards
   - LoanInputCard (full width)
   - ExtraPaymentCard (left column)
   - InvestmentCard (right column)
4. **Validation Errors**: Prominent error alert
5. **Results Section**: Only shown when inputs valid
   - RecommendationCard
   - ScenarioSummary (3 comparison cards)
   - SnowballChart (2 charts)
   - MonthlyBreakdown (expandable table)

### Pre-fill Logic (Task 7.3)
- Reads `data` query parameter on component mount
- Parses JSON-encoded loan data from Debt Payoff calculator
- Maps DebtInput fields to SnowballLoanInput fields
- Validates parsed data before applying to state
- Silently ignores invalid or missing data
- Helper function: `mapDebtInputToSnowballLoan()`

### Route Integration (Task 7.1)
- Next.js page at `/snjoboltareiknivel`
- Wraps SnowballCalculatorPage with CalculatorProvider
- Retrieves actualHourlyWage from CalculatorContext
- Passes wage to page component as prop

## Component Props
```typescript
interface SnowballCalculatorPageProps {
  actualHourlyWage?: number; // For life energy calculations
}
```

## Dependencies
- **Types**: `@/types/snowball` (SnowballLoanInput, SnowballInput, SnowballResults)
- **Calculations**: `@/lib/calculations/snowball` (calculateSnowball)
- **Constants**: `@/lib/constants/snowball` (defaults)
- **UI Components**: Alert, LoanInputCard, ExtraPaymentCard, InvestmentCard
- **Results Components**: ScenarioSummary, SnowballChart, RecommendationCard, MonthlyBreakdown
- **Hooks**: useState, useMemo, useEffect from React
- **Navigation**: useSearchParams from next/navigation

## Integration Points
- **CalculatorContext**: Receives actualHourlyWage from context
- **Debt Payoff Calculator**: Accepts pre-fill data via query parameter
- **All Snowball Components**: Orchestrates inputs, results, visualizations

## Responsive Design
- Mobile: Single column layout, components stack vertically
- Desktop: Two-column grid for input cards, multi-column for results
- Maximum width: 7xl (80rem)
- Proper spacing with gap-6 and space-y-8

## Error Handling
- Validates inputs before calculation
- Shows user-friendly error messages in Icelandic
- Handles missing actualHourlyWage gracefully (shows warning)
- Try-catch around calculation with console error logging
- Silently ignores invalid pre-fill data

## User Experience
- Clean, organized layout with clear visual hierarchy
- Warning alerts use yellow/orange for visibility
- Results only appear when inputs are valid
- All text in Icelandic for local users
- Responsive grid adapts to screen size

## Related
- Implements: Tasks 6.1-6.3, 7.1, 7.3 from specs/interest-savings-snowball/tasks-interest-savings-snowball.md
- Part of: specs/interest-savings-snowball/design-interest-savings-snowball.md
- Uses: All snowball input and result components
- Integrated with: Debt Payoff calculator page
