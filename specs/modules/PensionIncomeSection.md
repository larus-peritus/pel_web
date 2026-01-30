# PensionIncomeSection Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/PensionIncomeSection.tsx`

## Purpose
Collapsible section for entering pension income and retirement age in the FI Number Builder. Allows users to factor in expected lífeyrissjóður (pension fund) payments to reduce their required FI number.

## Component Type
UI Component - Form Section

## Exports
- `export const PensionIncomeSection: React.FC<PensionIncomeSectionProps>`
- `export interface PensionIncomeSectionProps`

## Key Functionality

### Collapsible Interface
- Closed by default to keep UI clean
- Toggle open/close by clicking header
- Updates description text based on state (open/closed)
- Smooth expand/collapse animation

### Pension Income Input
- CurrencyInput for monthly pension amount (ISK)
- Validates pension is less than monthly expenses
- Range validation (0 - 1,000,000 ISK/month)
- Real-time error and warning feedback

### Retirement Age Input
- NumberInput for target retirement age
- Default value: 67 (Icelandic pension start age)
- Range validation (40-80 years)
- Step increment: 1 year

### Validation System
**Errors (blocking)**:
- Negative pension income
- Pension exceeds monthly expenses
- Pension over maximum (1M ISK/month)
- Age below minimum (40 years)
- Age above maximum (80 years)

**Warnings (non-blocking)**:
- Pension very high (> 80% of expenses)
- Pension very low (< 50,000 ISK)
- Very early retirement (< 50 years)
- Late retirement (> 70 years)

### Early Retirement Warning
- Displays alert if retirement age < 67
- Shows bridge period in years
- Explains need for extra savings
- Uses warning color scheme (yellow/orange)

### Clear Functionality
- Shows clear button when pension data exists
- Resets both pension income and retirement age
- Clears all validation errors

## Props Interface

```typescript
interface PensionIncomeSectionProps {
  pensionMonthlyIncome: number | null;
  targetRetirementAge: number | null;
  monthlyExpenses: number;
  onPensionIncomeChange: (income: number | null) => void;
  onRetirementAgeChange: (age: number | null) => void;
  className?: string;
}
```

## State Management
- `isOpen`: Controls collapsible state (useState)
- `pensionError`: Error message for pension input
- `pensionWarning`: Warning message for pension input
- `ageError`: Error message for age input
- `ageWarning`: Warning message for age input

## Dependencies

### UI Components
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `CurrencyInput` from `@/components/ui/CurrencyInput`
- `NumberInput` from `@/components/ui/NumberInput`
- `Alert` from `@/components/ui/Alert`
- `Button` from `@/components/ui/Button`

### Utilities
- `cn` from `@/lib/utils` - Class name merging

### Constants
- `PENSION_START_AGE` (67) from `@/lib/constants/fiNumber`
- `RETIREMENT_AGE_RANGE` (40-80) from `@/lib/constants/fiNumber`
- `PENSION_INCOME_RANGE` (0-1M) from `@/lib/constants/fiNumber`

## Icelandic Context
- **Lífeyrissjóður**: Iceland's pension fund system
- **Pension Start Age**: 67 years (standard retirement age in Iceland)
- **Early Retirement**: Common in Iceland for financially independent individuals
- **Bridge Period**: Gap between early retirement and pension start (unique consideration)
- All text in Icelandic

## Accessibility Features
- Collapsible button has `aria-expanded` attribute
- Inputs have clear labels
- Error messages linked to inputs
- Keyboard navigation support
- Focus management on expand/collapse

## Visual Design
- Card component with outlined variant
- Clickable header for collapsing
- Chevron icon indicates expand/collapse state
- Info alert explains pension benefit
- Warning alert for early retirement
- Color-coded feedback (errors vs warnings)

## Usage Example

```tsx
<PensionIncomeSection
  pensionMonthlyIncome={200000}
  targetRetirementAge={55}
  monthlyExpenses={500000}
  onPensionIncomeChange={(income) => updateState({ pensionMonthlyIncome: income })}
  onRetirementAgeChange={(age) => updateState({ targetRetirementAge: age })}
/>
```

## Tests
Location: `apps/peninganaedalifid/tests/components/fiNumber/PensionIncomeSection.test.tsx`

Coverage:
- Rendering (closed/open states)
- Collapsible behavior (toggle, description updates)
- Pension income validation (negative, too high, valid)
- Retirement age validation (range, valid)
- Early retirement warning (shows/hides correctly)
- Clear functionality (button display, clear action)
- Accessibility (labels, ARIA attributes)

All 24 tests passing.

## Related
- Implements: FR-5.1, FR-5.4 from specs/fi-number-builder/requirements-fi-number-builder.md
- Part of: Epic 5 (Pension Integration) in specs/fi-number-builder/tasks-fi-number-builder.md
- Used by: FINumberBuilderCalculator component
- Calculates: Used with calculatePensionAdjustedFI from FINumberCalculations module
