# Savings Report Types

## Location
`apps/peninganaedalifid/src/types/savingsReport.ts`

## Purpose
TypeScript type definitions for the Savings Report feature. Defines all interfaces for savings categories, reports, calculations, and results.

## Exports

### Configuration Types

- `SavingsCategoryConfig` - Immutable configuration for a savings category (id, name, icon, description, order)
- `SavingsCategoryData` - Mutable user data (balance, monthlyContribution, targetAmount?, notes?)
- `SavingsCategory` - Full category (extends Config with data and isHidden)

### Report Types

- `SavingsReport` - Complete report (categories, lastUpdated, version)

### Calculation Result Types

- `SavingsRateLevel` - Type union: 'critical' | 'low' | 'moderate' | 'good' | 'excellent' | 'exceptional'
- `SavingsRateContext` - Context message with rate, level, messageIs, and fiEstimateYears
- `SavingsLifeEnergy` - Life energy in hours (totalBalanceHours, totalContributionHoursPerMonth, totalContributionHoursPerYear)
- `CategoryBreakdown` - Per-category breakdown with percentages and life energy
- `SavingsReportResults` - Complete calculation results

## Key Types

### SavingsCategory Structure
```typescript
{
  // Config (immutable)
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  
  // User data (mutable)
  data: {
    balance: number;
    monthlyContribution: number;
    targetAmount?: number;
    notes?: string;
  };
  
  // Display state
  isHidden: boolean;
}
```

### SavingsReportResults Structure
Contains all calculated values:
- Totals (savings, monthly contribution, annual contribution)
- Savings rate and context
- Category breakdown
- Life energy calculations

## Dependencies

None - pure type definitions

## Related

- Implements: Type requirements from specs/savings-report/design-savings-report.md
- Part of: Task 1.1 from specs/savings-report/tasks-savings-report.md
- Used by: All Savings Report components and calculations

## Design Decisions

### Separation of Config and Data
Config properties (id, name, icon) are separated from user data (balance, contribution) to make it clear what's immutable vs. mutable.

### Optional Fields
targetAmount and notes are optional to allow users to skip fields they don't need.

### Nullable Results
Results that depend on external data (AWH, income) are nullable to distinguish between "zero" and "not calculated".
