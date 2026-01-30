# NoRecommendationAlert Component

## Location
`src/components/fireTypes/NoRecommendationAlert.tsx`

## Purpose
Displays an informative alert when FIRE type recommendations cannot be generated due to insufficient user data. Guides users to provide necessary information and educates them about the FIRE concept while they haven't completed inputs.

## Component Type
Presentational component with optional interaction handler (button onClick).

## Props

```typescript
interface NoRecommendationAlertProps {
  missingInputs: string[];      // List of missing input identifiers
  onGoToInputs?: () => void;    // Optional callback to scroll/navigate to inputs section
  showExamples?: boolean;       // Whether to show example recommendations (default: true)
  className?: string;           // Optional custom className
}
```

## Key Features

### Main Alert Section
- Info variant alert with friendly, encouraging tone
- Explanation of why more information is needed
- List of missing inputs with Icelandic labels
- Call-to-action button (if onGoToInputs provided)

### Example Recommendations Section (Optional)
- Preview of what users will see after completing inputs
- 3 example FIRE types (Venjulegt, CoastFIRE, BaristaFIRE)
- Visual cards showing type icon, name, and description
- "Besti valkosturinn" badge on first example
- Tip about providing more information for better accuracy

### Educational Section
- "Hvað er FIRE?" heading
- FIRE acronym explanation
- List of all 5 FIRE types with icons and brief descriptions
- Encouraging closing message

## Missing Input Labels

The component maps internal input identifiers to user-friendly Icelandic labels:

| Input ID | Icelandic Label |
|----------|----------------|
| age | Aldur þinn |
| income | Árstekjur |
| currentSavings | Núverandi sparnaður |
| monthlyExpenses | Mánaðarleg útgjöld |
| monthlySavings | Mánaðarlegur sparnaður |

Unknown input types are displayed as-is (fallback).

## Example Recommendations

Three pre-defined examples shown when `showExamples=true`:

1. **Venjulegt FIRE** (🌱)
   - "Jafnvægi milli lífsstíls og sparnaðar"
   - Shows "Besti valkosturinn" badge

2. **CoastFIRE** (🏖️)
   - "Láttu fjárfestingar vaxa á meðan þú vinnur"

3. **BaristaFIRE** (☕)
   - "Hálftímavinna í stað fulls starfs"

## Layout Structure

```
Container (space-y-6)
├── Main Alert (info variant)
│   ├── Title: "Við þurfum meiri upplýsingar"
│   ├── Explanation paragraph
│   ├── Missing Inputs List (if any)
│   └── CTA Button (if onGoToInputs provided)
├── Example Section (if showExamples)
│   ├── Header + description
│   ├── Example Cards (3)
│   └── Tip box
└── Educational Section
    ├── "Hvað er FIRE?" heading
    ├── FIRE acronym explanation
    ├── 5 FIRE types list
    └── Closing message
```

## Tone and Language

All text is in Icelandic with a **friendly, encouraging tone**:
- Uses "þig" (you) for personal connection
- Avoids technical jargon
- Explains concepts clearly
- Encourages action without pressure
- Shows empathy ("við hjálpum þér")

## Styling

### Color Schemes
- Main alert: Primary blue (info variant)
- Example section: Gradient from neutral to primary
- Tip box: Primary blue background
- Educational section: White with neutral border

### Responsive Design
- Button: Full width on mobile, auto width on desktop (sm:w-auto)
- Cards stack on mobile, side-by-side on larger screens
- Proper spacing and padding for all screen sizes

## Accessibility

- Semantic HTML (headings, lists, paragraphs)
- Alert has proper info variant styling
- Button is keyboard accessible
- Emoji icons have role="img" with aria-label
- Proper heading hierarchy (h3 for sections, h4 for cards)

## Dependencies

### UI Components
- Alert (info variant)
- Button (primary variant)

### Utilities
- cn (className utility)

## Tests
Location: `tests/components/fireTypes/NoRecommendationAlert.test.tsx`

Coverage:
- ✅ Rendering of all sections
- ✅ Missing inputs display (single, multiple, all types)
- ✅ Empty missing inputs handling
- ✅ Call-to-action button (presence, onClick)
- ✅ Example recommendations (show/hide)
- ✅ Educational section
- ✅ Styling and layout
- ✅ Content completeness
- ✅ Accessibility (headings, keyboard navigation, emoji labels)
- ✅ Edge cases (unknown inputs, many inputs)

28 tests, all passing.

## Usage Example

```tsx
import { NoRecommendationAlert } from '@/components/fireTypes';

function MyComponent() {
  const missingInputs = ['age', 'income', 'monthlyExpenses'];

  const handleGoToInputs = () => {
    // Scroll to inputs section
    document.getElementById('inputs-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <NoRecommendationAlert
      missingInputs={missingInputs}
      onGoToInputs={handleGoToInputs}
      showExamples={true}
    />
  );
}
```

## Integration Points

### Used By
- RecommendationsSection: Shows this when no data or no recommendations

### Calls
- onGoToInputs callback (if provided): Typically scrolls to inputs section

## Content Strategy

The component serves three purposes:

1. **Inform**: Tell user why they can't see recommendations yet
2. **Guide**: Show what's missing and how to provide it
3. **Educate**: Teach about FIRE while they're reading

This prevents a frustrating "empty state" and turns it into an educational opportunity.

## Related Components
- RecommendationCard: What user will see after completing inputs
- RecommendationsSection: Parent component that conditionally shows this
- InputsSection: Where user provides the missing data

## Epic
Part of Epic 6: Recommendations Section - FIRE Type Explorer
