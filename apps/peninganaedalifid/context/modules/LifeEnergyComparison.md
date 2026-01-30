# LifeEnergyComparison Component

## Location
`src/components/expenseBaseline/LifeEnergyComparison.tsx`

## Purpose
Displays work hours required per tier (monthly and annual) based on actual hourly wage. Shows alert if AWH is not available.

## Exports
- `LifeEnergyComparison` - Life energy hours comparison component

## Props
```typescript
interface LifeEnergyComparisonProps {
  results: ExpenseBaselineResults;     // Results with life energy data
  actualHourlyWage: number | null;     // AWH for calculations
}
```

## Key Functionality
- **Monthly Hours**: Work hours per month for each tier
- **Annual Hours**: Work hours per year for each tier
- **Work Days**: Converts annual hours to work days (8-hour days)
- **Color Coding**: Consistent tier colors throughout
- **AWH Warning**: Shows alert when actualHourlyWage is null or 0
- **Wage Display**: Shows actual hourly wage at bottom when available

## Conditional Rendering
- Shows Alert component when `!actualHourlyWage || !results.lifeEnergy`
- Shows data display when life energy is available
- Work days calculation uses useMemo for performance

## Calculations
- Monthly hours: Direct from `results.lifeEnergy.monthly`
- Annual hours: Direct from `results.lifeEnergy.annual`
- Work days: `annualHours / 8` (assuming 8-hour workdays)

## Visual Design
- **Section Headers**: "Vinnustundir á mánuði" and "Vinnustundir á ári"
- **Color Dots**: 3x3 rounded indicators for each tier
- **Right-aligned Values**: Hours displayed prominently on right
- **Secondary Info**: Work days shown in smaller text below annual hours

## Color Scheme
- **Barebones**: Amber (text-amber-900, bg-amber-500)
- **Comfortable**: Green (text-green-900, bg-green-500)
- **Deluxe**: Purple (text-purple-900, bg-purple-500)

## Dependencies
- Card, CardHeader, CardContent from @/components/ui/Card
- Alert from @/components/ui/Alert
- formatNumber from @/lib/utils/formatters
- useMemo from React

## Tests
- Implicitly tested via ResultsSummarySection tests
- Should test both AWH available and unavailable states

## Integration
- Used by: ResultsSummarySection
- Requires: actualHourlyWage from main calculator
- Displays: lifeEnergy from ExpenseBaselineResults

## Related
- Implements: Task 5.4 from tasks-expense-baseline.md
- Part of: EPIC 5 - Results Summary Display
- Requirements: US-4, FR-3.4 (life energy calculation)
