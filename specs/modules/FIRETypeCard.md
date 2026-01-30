# FIRETypeCard Component

## Location
`src/components/fireTypes/FIRETypeCard.tsx`

## Purpose
Displays a single FIRE type with comprehensive information including name, description, personalized calculations, pros/cons, and action buttons. Responsive card component with color-coded visual design matching each FIRE type.

## Key Features
- Icon, name (Icelandic + English subtitle)
- Tagline and description
- Personalized numbers (FI number, time to FI, expenses, progress) when calculation data available
- "Ideal for" candidates (first 3 items)
- Expandable pros/cons and detailed information
- "Learn more" and "Select this type" action buttons
- Visual color coding per FIRE type (amber, green, cyan, purple, pink)
- Responsive card layout
- Recommendation badges (rank 1-3)
- Selected state indicator
- Type-specific data display (BaristaFIRE, CoastFIRE)

## Exports
- `FIRETypeCard` - Main component

## Props
```typescript
interface FIRETypeCardProps {
  definition: FIRETypeDefinition;      // FIRE type definition from constants
  calculation?: FIRECalculation;        // Personalized calculations (optional)
  isSelected?: boolean;                 // Selected state
  isRecommended?: boolean;              // Show recommendation badge
  rank?: number;                        // Recommendation rank (1-5)
  onSelect?: (typeId: string) => void;  // Selection callback
  onLearnMore?: (typeId: string) => void; // Learn more callback
}
```

## Helper Functions
- `formatISK(amount: number)` - Formats ISK currency in Icelandic format
- `formatYears(years: number | null)` - Formats years/months duration to readable Icelandic string

## Color Schemes
Supports 5 color schemes matching FIRE types:
- Amber (LeanFIRE)
- Green (RegularFIRE)
- Cyan (CoastFIRE)
- Purple (BaristaFIRE)
- Pink (FatFIRE)

## Expandable Details
- Pros (with green checkmarks)
- Cons (with red X marks)
- "Not for" list
- Toggled via "Sjá ítarlegar upplýsingar" / "Sjá minna" button

## Dependencies
- `@/components/ui/Card` - Card components
- `@/components/ui/Button` - Action buttons
- `@/components/ui/Badge` - Recommendation badges
- `@/types/fireTypes` - Type definitions
- `lucide-react` - Icons (ChevronDown, ChevronUp, Check)

## Tests
- Location: tests/components/fireTypes/FIRETypeCard.test.tsx
- Coverage: 31 tests covering rendering, calculations, recommendations, selection, expandable details, callbacks, edge cases

## Related
- Implements: Epic 3, Task 3.1 (specs/fire-type-explorer/)
- Used by: FIRETypeDefinitionsSection
- Uses: FIRE_TYPE_DEFINITIONS from lib/constants/fireTypes
