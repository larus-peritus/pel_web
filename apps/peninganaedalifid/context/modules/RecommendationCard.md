# RecommendationCard Component

## Location
`src/components/fireTypes/RecommendationCard.tsx`

## Purpose
Displays a single FIRE type recommendation with comprehensive information including score, confidence, reasoning, action steps, timeline, and obstacles. Used within the RecommendationsSection to show personalized FIRE type recommendations to users.

## Component Type
Presentational component with interaction handlers (button onClick).

## Props

```typescript
interface RecommendationCardProps {
  recommendation: FIRERecommendation;    // Recommendation data with score, confidence, reasons
  calculation: FIRECalculation;          // Full calculation data for this FIRE type
  onSelect: (fireTypeId: string) => void; // Callback when user selects this type
  isTopRecommendation?: boolean;         // Whether this is the top recommendation (larger display)
  className?: string;                    // Optional custom className
}
```

## Key Features

### Visual Elements
- FIRE type name, icon, and color-coded styling
- Score display (0-100) with percentage
- Confidence level badge (high/medium/low)
- Ranking badges for top 3 (gold/silver/bronze)
- Type-specific color accents throughout card

### Content Sections
1. **Timeline Summary**: Human-readable timeline string (e.g., "12 ár" or age-based)
2. **Reasoning List**: Why this type fits the user (bullet points)
3. **Action Steps**: Numbered list of concrete next steps
4. **Obstacles/Warnings**: Potential challenges and considerations

### Interactions
- "Velja þessa leið" (Select this path) button
- Hover effects on card
- Ring border for top recommendation

## Data Sources

### From Props
- `recommendation`: FIRERecommendation from calculateFIRERecommendations()
- `calculation`: FIRECalculation from calculateAllFIRETypes()

### From Constants
- `getFIRETypeDefinition()`: Type metadata (name, tagline, icon)
- `getFIRETypeColors()`: Color scheme for the FIRE type

### From Calculations
- `generateActionSteps()`: Type-specific action steps
- `generateTimelineString()`: Human-readable timeline
- `generateObstacles()`: Potential warnings

## Visual Hierarchy

### Top Recommendation (isTopRecommendation=true)
- Ring border (ring-2 ring-primary-500)
- Larger button (lg size)
- More prominent shadow on hover

### Regular Recommendations
- Standard card styling
- Medium button size
- Standard hover effects

## Ranking Badges

| Rank | Badge | Label | Variant |
|------|-------|-------|---------|
| 1 | 🥇 | Besta valkosturinn | success |
| 2 | 🥈 | Góður valkostur | info |
| 3 | 🥉 | Sæmilegur valkostur | warning |
| 4+ | None | N/A | N/A |

## Confidence Levels

| Confidence | Badge Label | Variant |
|------------|-------------|---------|
| high | Mikil vissa | success |
| medium | Miðlungs vissa | warning |
| low | Lítil vissa | neutral |

## Color Schemes

Each FIRE type has its own color scheme applied via Tailwind classes:
- **LeanFIRE**: Amber (bg-amber-50, text-amber-900, border-amber-300)
- **RegularFIRE**: Green (bg-green-50, text-green-900, border-green-300)
- **CoastFIRE**: Cyan (bg-cyan-50, text-cyan-900, border-cyan-300)
- **BaristaFIRE**: Purple (bg-purple-50, text-purple-900, border-purple-300)
- **FatFIRE**: Pink (bg-pink-50, text-pink-900, border-pink-300)

## Layout Structure

```
Card (elevated variant)
├── CardHeader (type-specific color, border-left accent)
│   ├── Icon + Name + Tagline
│   └── Ranking Badge (if top 3)
├── CardContent
│   ├── Score + Confidence
│   ├── Timeline Summary (if available)
│   ├── Reasoning List
│   ├── Action Steps (numbered)
│   └── Obstacles/Warnings (if any)
└── CardFooter
    └── Select Button
```

## Accessibility

- Semantic HTML structure (headings, lists, buttons)
- Emoji icons have aria-label attributes
- Button has proper role and is keyboard accessible
- Color is not the only indicator (text labels provided)
- Progress indicators use proper list elements

## Dependencies

### UI Components
- Card, CardHeader, CardContent, CardFooter
- Badge
- Button

### Utilities
- cn (className utility)

### Types
- FIRERecommendation
- FIRECalculation
- FIRETypeId

### Functions
- getFIRETypeDefinition()
- getFIRETypeColors()
- generateActionSteps()
- generateTimelineString()
- generateObstacles()

## Tests
Location: `tests/components/fireTypes/RecommendationCard.test.tsx`

Coverage:
- ✅ Rendering of all elements
- ✅ Ranking badges (1st, 2nd, 3rd, 4+)
- ✅ Confidence levels (high, medium, low)
- ✅ Content sections (reasoning, action steps, obstacles)
- ✅ Top recommendation styling
- ✅ onClick interactions
- ✅ Different FIRE types
- ✅ Edge cases (no reasons, zero score, perfect score)
- ✅ Accessibility (buttons, emoji labels)

27 tests, all passing.

## Usage Example

```tsx
import { RecommendationCard } from '@/components/fireTypes';

function MyComponent() {
  const handleSelect = (fireTypeId: string) => {
    console.log('Selected:', fireTypeId);
  };

  return (
    <RecommendationCard
      recommendation={topRecommendation}
      calculation={calculations[topRecommendation.fireTypeId]}
      onSelect={handleSelect}
      isTopRecommendation={true}
    />
  );
}
```

## Related Components
- NoRecommendationAlert: Shown when no recommendations available
- RecommendationsSection: Orchestrates display of multiple cards

## Related Calculations
- calculateFIRERecommendations(): Generates recommendations
- generateActionSteps(): Creates action steps list
- generateTimelineString(): Formats timeline display
- generateObstacles(): Identifies potential challenges

## Epic
Part of Epic 6: Recommendations Section - FIRE Type Explorer
