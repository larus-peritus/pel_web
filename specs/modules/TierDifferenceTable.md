# TierDifferenceTable Component

## Location
`src/components/expenseBaseline/TierDifferenceTable.tsx`

## Purpose
Displays differences between tiers in ISK and work hours with responsive table/card layout. Shows three comparison rows.

## Exports
- `TierDifferenceTable` - Tier difference comparison table component

## Props
```typescript
interface TierDifferenceTableProps {
  results: ExpenseBaselineResults;  // Results with tier differences
}
```

## Key Functionality
- **Three Comparisons**:
  1. Lágmarks → Þægilegt (Barebones to Comfortable)
  2. Þægilegt → Lúxus (Comfortable to Deluxe)
  3. Lágmarks → Lúxus (Barebones to Deluxe - highlighted)
- **ISK Difference**: Monthly ISK cost of upgrading
- **Hours Difference**: Work hours cost of upgrading (when AWH available)
- **Responsive Layout**: Table on desktop, cards on mobile
- **Largest Difference**: Insight message showing which upgrade costs most

## Data Structure
Internal `DifferenceRow` interface:
```typescript
interface DifferenceRow {
  label: string;           // "Lágmarks → Þægilegt"
  fromTier: string;        // "Lágmarks"
  toTier: string;          // "Þægilegt"
  fromColor: string;       // "text-amber-700"
  toColor: string;         // "text-green-700"
  iskDifference: number;   // ISK difference
  hoursDifference: number | null;  // Hours or null
}
```

## Visual Design
- **Desktop Table** (≥768px):
  - Three columns: Uppfærsla, Munur (kr/mán), Munur (klst/mán)
  - Border between rows
  - Last row (Bare→Deluxe) in bold
- **Mobile Cards** (<768px):
  - Stacked card view with tier arrows
  - ISK and hours as separate rows within each card
  - Last card has primary border (border-2 border-primary-200)

## Conditional Rendering
- Hours column shows "—" when `hoursDifference === null`
- Footnote shown when `results.lifeEnergy === null`
- Mobile/desktop views switch at md breakpoint (768px)

## Color Coding
- **Barebones**: text-amber-700
- **Comfortable**: text-green-700
- **Deluxe**: text-purple-700

## Dependencies
- Card, CardHeader, CardContent from @/components/ui/Card
- formatCurrency, formatNumber from @/lib/utils/formatters

## Tests
- Implicitly tested via ResultsSummarySection tests
- Should test responsive breakpoints and null hours handling

## Integration
- Used by: ResultsSummarySection
- Displays: tierDifferences from ExpenseBaselineResults

## Related
- Implements: Task 5.5 from tasks-expense-baseline.md
- Part of: EPIC 5 - Results Summary Display
- Requirements: FR-3.5 (tier differences)
