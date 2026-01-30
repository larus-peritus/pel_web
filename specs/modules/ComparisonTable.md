# ComparisonTable Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/ComparisonTable.tsx`

## Purpose
Desktop-optimized table view for side-by-side comparison of all FIRE types with sorting capabilities.

## Features
- **Sortable Columns**: Click any column header to sort (years to FI, nest egg, expenses, savings rate, effort)
- **Color-Coded Rows**: Each FIRE type has its own color scheme matching the brand
- **Effort Indicators**: Visual dots showing difficulty level (0-3 filled dots)
- **Clickable Rows**: Select FIRE type by clicking row (keyboard accessible)
- **Sticky Header**: Table header remains visible when scrolling
- **Active State**: Selected row highlighted with "Valið" badge

## Props
```typescript
interface ComparisonTableProps {
  calculations: Record<FIRETypeId, FIRECalculation>;
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
}
```

## Columns
1. **FIRE tegund** - Type name with icon and color
2. **Nest Egg** - Target FI number (ISK)
3. **Útgjöld/mán** - Monthly expenses (ISK)
4. **Sparnaðarhlutfall** - Savings rate (%)
5. **Ár til FIRE** - Years to reach FI
6. **Erfiðleiki** - Effort level with visual indicator

## Sorting
- Default sort: Years to FI (ascending)
- Toggle direction by clicking same column
- Sort indicator (↑/↓) shows active column and direction
- Handles null values by sorting to end (Infinity)

## Accessibility
- Proper table semantics (`<table>`, `<th scope="col">`, `<tbody>`)
- Keyboard navigation (Tab, Enter, Space)
- ARIA attributes (`role="button"`, `aria-pressed`, `aria-label`)
- Screen reader announcements for selection changes

## Styling
- Responsive table with horizontal scroll if needed
- Hover effects on rows and column headers
- Selected row: primary background color
- Sticky header with z-index for layering

## Tests
- Location: `tests/components/fireTypes/ComparisonTable.test.tsx`
- Coverage: Table structure, data display, sorting, selection, accessibility

## Dependencies
- `@/types/fireTypes` - Type definitions
- `@/lib/constants/fireTypes` - FIRE type definitions and color schemes
- `@/lib/utils/formatters` - ISK currency formatting

## Integration
- Used by ComparisonSection on desktop (>768px width)
- Complements ComparisonCards for mobile view

## Task
Task 4.1: Create ComparisonTable Component (Desktop)
Epic 4: Comparison Table
FIRE Type Explorer Feature
