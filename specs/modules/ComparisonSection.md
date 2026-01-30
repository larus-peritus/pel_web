# ComparisonSection Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/ComparisonSection.tsx`

## Purpose
Main orchestration component for the comparison view. Handles responsive switching, tier selection, and insights display.

## Features
- **Responsive Display**: Automatically switches between ComparisonTable (desktop) and ComparisonCards (mobile)
- **Tier Toggle Integration**: Shows TierToggle when expense baseline exists with different tiers
- **Export Functionality**: Export comparison data as JSON file
- **Insights Section**: Shows fastest, easiest, and highest nest egg FIRE types
- **Missing Baseline Alert**: Shows alert with link when no expense baseline configured

## Props
```typescript
interface ComparisonSectionProps {
  calculations: Record<FIRETypeId, FIRECalculation>;
  userInputs: UserFinancialInputs;
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
  onTierChange?: (tier: ExpenseTier) => void;
  hasExpenseBaseline?: boolean;
  onNavigateToBaseline?: () => void;
}
```

## Section Structure
1. **Header**: Title + description + export button
2. **Alert** (conditional): Shows if no expense baseline
3. **Tier Toggle** (conditional): Shows if baseline exists and tiers differ
4. **Comparison View**: Table (desktop) or Cards (mobile)
5. **Insights Card**: Key findings about FIRE types

## Responsive Breakpoint
- **Desktop** (≥768px): ComparisonTable
- **Mobile** (<768px): ComparisonCards
- Uses window resize listener with state management

## Export Feature
Creates JSON file with:
```json
{
  "generatedAt": "ISO date",
  "activeTier": "comfortable",
  "calculations": [
    {
      "fireType": "leanfire",
      "fiNumber": 75000000,
      "monthlyExpenses": 250000,
      "yearsToFI": 12.5,
      "targetAge": 50,
      "effortLevel": "high",
      "feasibility": 75,
      "currentProgress": 20
    },
    // ... other types
  ]
}
```

Filename format: `fire-samanburður-YYYY-MM-DD.json`

## Insights Calculation
**Fljótasta leiðin** (Fastest):
- Type with lowest `yearsToFI`
- Shows years in format "X,X ár"
- Green badge with checkmark icon

**Auðveldasta leiðin** (Easiest):
- Type with lowest effort level
- Shows "krefst minnstu fórnar"
- Blue badge with star icon

**Stærsta markmiðið** (Highest):
- Type with highest `fiNumber`
- Shows "þarfnast mest sparnaðar"
- Purple badge with money icon

## Missing Baseline Handling
When `hasExpenseBaseline=false`:
- Shows Alert with info variant
- Message: "Engin útgjaldaprofíll til staðar"
- Button: "Búa til profíl" (calls onNavigateToBaseline)
- TierToggle hidden

## Tests
- Location: `tests/components/fireTypes/ComparisonSection.test.tsx`
- Coverage: Structure, expense baseline integration, responsive behavior, export, insights, child component integration

## Dependencies
- `@/types/fireTypes` - FIRE types
- `@/types/expenseBaseline` - ExpenseTier type
- `@/components/ui/Card` - Card components
- `@/components/ui/Button` - Button component
- `@/components/ui/Alert` - Alert component
- `./ComparisonTable` - Desktop view
- `./ComparisonCards` - Mobile view
- `./TierToggle` - Tier selector

## Integration
- Main comparison component used in FIRE Type Explorer page
- Coordinates all sub-components for comparison view
- Manages tier state and responsive layout switching

## Task
Task 4.4: Create ComparisonSection Component
Epic 4: Comparison Table
FIRE Type Explorer Feature
