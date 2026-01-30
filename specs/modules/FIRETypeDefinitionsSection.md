# FIRETypeDefinitionsSection Component

## Location
`src/components/fireTypes/FIRETypeDefinitionsSection.tsx`

## Purpose
Main section displaying all FIRE type definitions in a responsive grid. Orchestrates the display of all 5 FIRE type cards with optional personalized calculations, recommendations, and selection handling.

## Key Features
- Section header with title and description
- Info alert when calculations/recommendations provided
- Responsive grid layout (1/2/3 columns based on screen size)
- All 5 FIRE type cards rendered
- Automatic sorting by recommendation rank
- Card selection handling
- Link to comparison section (optional)
- Educational note about choosing FIRE types

## Exports
- `FIRETypeDefinitionsSection` - Main component

## Props
```typescript
interface FIRETypeDefinitionsSectionProps {
  calculations?: Record<FIRETypeId, FIRECalculation>;  // Personalized calculations
  recommendations?: FIRERecommendation[];              // Recommendation rankings
  selectedType?: FIRETypeId | null;                    // Currently selected type
  onSelectType?: (typeId: FIRETypeId) => void;        // Selection callback
  onLearnMore?: (typeId: FIRETypeId) => void;          // Learn more callback
  onViewComparison?: () => void;                       // Comparison link callback
  showComparisonLink?: boolean;                        // Show comparison link (default: false)
}
```

## Internal Logic
- `getRecommendationForType(typeId)` - Finds recommendation for a specific type
- `isRecommended(typeId)` - Checks if type is recommended (rank 1-3)
- `getRank(typeId)` - Gets recommendation rank for a type
- Sorts definitions by recommendation rank when recommendations provided

## Layout
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Cards sorted by recommendation rank (top recommendations first)
- Educational note at bottom
- Optional comparison link button

## Dependencies
- `@/components/fireTypes/FIRETypeCard` - Individual FIRE type cards
- `@/components/ui/Alert` - Info alert
- `@/components/ui/Button` - Comparison link button
- `@/lib/constants/fireTypes` - FIRE_TYPE_DEFINITIONS
- `@/types/fireTypes` - Type definitions

## Tests
- Location: tests/components/fireTypes/FIRETypeDefinitionsSection.test.tsx
- Coverage: 24 tests covering rendering, calculations, recommendations, selection, callbacks, comparison link, accessibility

## Related
- Implements: Epic 3, Task 3.2 (specs/fire-type-explorer/)
- Uses: FIRETypeCard component
- Uses: FIRE_TYPE_DEFINITIONS from lib/constants/fireTypes
