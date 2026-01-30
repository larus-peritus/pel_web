# ComparisonCards Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/ComparisonCards.tsx`

## Purpose
Mobile-optimized card-based view for comparing all FIRE types with expandable details.

## Features
- **Stacked Cards**: One card per FIRE type, vertically stacked
- **Expandable Details**: Tap "Sjá meira" to expand card with full metrics
- **Effort Progress Bars**: Horizontal progress bars showing effort level
- **Touch-Friendly**: Large touch targets optimized for mobile
- **Type-Specific Data**: Shows CoastFIRE and BaristaFIRE specific info when expanded
- **Color-Coded Headers**: Each card header uses FIRE type color scheme

## Props
```typescript
interface ComparisonCardsProps {
  calculations: Record<FIRETypeId, FIRECalculation>;
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
}
```

## Card Structure
**Always Visible:**
- Icon + Name + Tagline
- Nest Egg amount
- Years to FI
- Effort level progress bar
- Expand/collapse button

**Expanded View:**
- Monthly expenses
- Savings rate (if calculable)
- Current progress percentage
- Amount remaining to FI
- Target age at FI
- CoastFIRE data (coast FI number, coasting status)
- BaristaFIRE data (part-time income needed, savings vs full FIRE)

## Interaction
- **Select**: Click card header to select FIRE type
- **Expand**: Click "Sjá meira" button to expand details
- **Collapse**: Click "Sjá minna" to collapse
- **Single Expansion**: Only one card can be expanded at a time

## Effort Indicator
Horizontal progress bar with color coding:
- Low (green): 25% filled
- Moderate (yellow): 50% filled
- High (orange): 75% filled
- Extreme (red): 100% filled

## Accessibility
- Proper heading hierarchy (h3 for card titles)
- `aria-expanded` on expand/collapse buttons
- Screen reader announcements for selection
- ARIA labels on progress bars

## Tests
- Location: `tests/components/fireTypes/ComparisonCards.test.tsx`
- Coverage: Card structure, metrics display, expand/collapse, type-specific data, selection

## Dependencies
- `@/types/fireTypes` - Type definitions
- `@/lib/constants/fireTypes` - FIRE type definitions
- `@/lib/utils/formatters` - ISK formatting
- `@/components/ui/Card` - Card components

## Integration
- Used by ComparisonSection on mobile (<768px width)
- Complements ComparisonTable for desktop view

## Task
Task 4.2: Create ComparisonCards Component (Mobile)
Epic 4: Comparison Table
FIRE Type Explorer Feature
