# RecommendationsSection Component

## Location
`src/components/fireTypes/RecommendationsSection.tsx`

## Purpose
Main orchestration component for displaying FIRE type recommendations. Checks if sufficient data exists, generates recommendations, and presents them in a hierarchical layout with the top recommendation prominently displayed and alternatives shown in a grid.

## Component Type
Container/orchestration component with state management (useMemo) and conditional rendering logic.

## Props

```typescript
interface RecommendationsSectionProps {
  calculations: {                    // All FIRE type calculations
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  } | null;
  userInputs: UserFinancialInputs | null; // User financial data (for validation)
  onSelectType: (fireTypeId: string) => void; // Callback when user selects a type
  onGoToInputs?: () => void;         // Optional callback to scroll to inputs
  className?: string;                // Optional custom className
}
```

## Key Features

### Data Validation
- Checks if user has provided minimum required data
- Validates age, income, savings, and expenses
- Identifies which specific inputs are missing
- Accepts 0 for currentSavings as valid (starting from zero is OK)

### Recommendation Generation
- Uses `useMemo` to memoize recommendations based on calculations
- Calls `calculateFIRERecommendations()` to score and rank FIRE types
- Splits recommendations into top (1st) and alternatives (2nd-4th)

### Conditional Display
Shows different content based on data availability:
1. **No Data**: NoRecommendationAlert with missing inputs
2. **Has Data**: Full recommendations layout

## Minimum Required Data

The component checks these fields in `userInputs`:

| Field | Requirement |
|-------|------------|
| age | > 0 |
| grossAnnualIncome | > 0 |
| currentSavings | >= 0 |
| monthlyExpenses | > 0 |

Note: `monthlySavings` is checked for missing inputs list but not for minimum data validation.

## Layout Structure

### Section Header (Always Shown)
```
┌─────────────────────────────────────┐
│  Ráðleggingar fyrir þig            │
│  (Section title + description)      │
└─────────────────────────────────────┘
```

### If No Data or No Recommendations
```
┌─────────────────────────────────────┐
│  NoRecommendationAlert              │
│  - Missing inputs                   │
│  - Examples                         │
│  - Education                        │
└─────────────────────────────────────┘
```

### If Has Data and Recommendations
```
┌─────────────────────────────────────┐
│  Methodology Explanation Box        │
│  "Hvernig reiknum við út skorin?"   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Top Recommendation                 │
│  (Larger RecommendationCard)        │
│  isTopRecommendation={true}         │
└─────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┐
│ Alternative │ Alternative │ Alternative │
│    Card     │    Card     │    Card     │
│  (Grid 1-3 cards, responsive)         │
└─────────────┴─────────────┴─────────────┘

┌─────────────────────────────────────┐
│  Reminder Context Box               │
│  "Mundu..."                         │
└─────────────────────────────────────┘
```

## Responsive Grid

Alternative recommendations use responsive grid:
- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3 columns (lg:grid-cols-3)

## Content Sections

### 1. Methodology Explanation
- Blue info box with chart icon (📊)
- Explains scoring criteria:
  - Feasibility of goal
  - Timeline to achievement
  - Required lifestyle sacrifice
  - Match with current circumstances
- Brief, non-technical language

### 2. Top Recommendation
- "🌟 Besta valkosturinn fyrir þig" heading
- Single RecommendationCard with `isTopRecommendation={true}`
- Most prominent display with ring border

### 3. Alternative Recommendations
- "🔍 Aðrir valkostir" heading
- Descriptive text encouraging exploration
- Grid of 2-3 RecommendationCards
- Only shown if alternatives exist

### 4. Reminder Context
- Neutral gray box
- Reminds users:
  - Recommendations based on current data
  - Can change goals later
  - No "wrong" choice
  - Find what works for **them**

## Data Flow

```
User Provides Inputs
        ↓
RecommendationsSection receives:
  - calculations (all 5 FIRE types)
  - userInputs (for validation)
        ↓
hasMinimumData() checks inputs
        ↓
   ┌────┴────┐
   ↓         ↓
Not enough   Enough data
   data         ↓
   ↓      calculateFIRERecommendations()
   ↓         ↓
   ↓      Split into top + alternatives
   ↓         ↓
Show NoRecommendationAlert  Show recommendations
```

## State Management

### useMemo Hook
```typescript
const recommendations = useMemo(() => {
  if (!hasData || !calculations) return null;
  return calculateFIRERecommendations(calculations);
}, [hasData, calculations]);
```

Memoization ensures:
- Recommendations only recalculated when inputs change
- Prevents unnecessary re-renders
- Performance optimization for expensive calculations

## Helper Functions

### hasMinimumData(inputs)
Validates that user has provided essential data:
```typescript
return (
  inputs.age > 0 &&
  inputs.grossAnnualIncome > 0 &&
  inputs.currentSavings >= 0 &&
  inputs.monthlyExpenses > 0
);
```

### getMissingInputs(inputs)
Returns array of missing input identifiers for NoRecommendationAlert:
```typescript
const missing: string[] = [];
if (inputs.age <= 0) missing.push('age');
// ... etc
return missing;
```

## Accessibility

- Semantic `<section>` element
- Proper heading hierarchy (h2 → h3)
- Descriptive headings with emojis (have aria-label)
- All interactive elements keyboard accessible
- Color not sole indicator (text labels provided)

## Dependencies

### Child Components
- NoRecommendationAlert
- RecommendationCard

### Calculations
- calculateFIRERecommendations()

### Types
- FIRERecommendation
- FIRECalculation
- UserFinancialInputs
- FIRETypeId

### React Hooks
- useMemo (for memoization)

## Tests
Location: `tests/components/fireTypes/RecommendationsSection.test.tsx`

Coverage:
- ✅ Section header rendering
- ✅ With sufficient data (all sections)
- ✅ Without sufficient data (alert shown)
- ✅ Missing data detection (age, income, expenses)
- ✅ Go to inputs callback
- ✅ Select type callback
- ✅ Recommendations generation and memoization
- ✅ Missing inputs detection (all types)
- ✅ currentSavings=0 handled as valid
- ✅ Styling and layout (className, semantic HTML)
- ✅ Edge cases (null calculations, null inputs, both null)
- ✅ Accessibility (heading hierarchy, keyboard navigation)
- ✅ Content completeness

30 tests, all passing.

## Usage Example

```tsx
import { RecommendationsSection } from '@/components/fireTypes';

function FIRETypeExplorerPage() {
  const { fireTypePreferences, selectFIREType } = useCalculatorContext();

  const handleSelectType = (fireTypeId: string) => {
    selectFIREType(fireTypeId);
    // Navigate to next section or show confirmation
  };

  const handleGoToInputs = () => {
    document.getElementById('fire-inputs')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <RecommendationsSection
      calculations={fireTypePreferences.calculations}
      userInputs={fireTypePreferences.userInputs}
      onSelectType={handleSelectType}
      onGoToInputs={handleGoToInputs}
    />
  );
}
```

## Integration Points

### Data Sources
- CalculatorContext: fireTypePreferences.calculations
- CalculatorContext: fireTypePreferences.userInputs

### Callbacks
- onSelectType: Updates selected FIRE type in context
- onGoToInputs: Scrolls to inputs section

### Related Components
- InputsSection: Provides the user data
- RecommendationCard: Displays individual recommendations
- NoRecommendationAlert: Handles insufficient data state

## Error Handling

Gracefully handles:
- `null` calculations → Shows NoRecommendationAlert
- `null` userInputs → Shows NoRecommendationAlert
- Invalid/incomplete userInputs → Shows NoRecommendationAlert with specific missing inputs
- Empty recommendations array → Shows NoRecommendationAlert
- No top recommendation → Shows NoRecommendationAlert

## Performance Considerations

- **Memoization**: Recommendations only recalculated when dependencies change
- **Conditional Rendering**: Expensive components only rendered when needed
- **Lazy Evaluation**: Recommendations not calculated until data is valid

## Design Philosophy

The component follows a "progressive disclosure" approach:
1. Start with educational content (when no data)
2. Progress to personalized recommendations (when data provided)
3. Maintain encouraging, non-judgmental tone throughout
4. Always provide next steps (CTA buttons)

## Related Components
- RecommendationCard: Individual recommendation display
- NoRecommendationAlert: No data state
- InputsSection: Data collection

## Epic
Part of Epic 6: Recommendations Section - FIRE Type Explorer

## Next Steps
After this component, users typically:
1. Review top recommendation in detail
2. Compare alternatives
3. Select a FIRE type to explore further
4. Navigate to detailed FIRE type page or timeline visualization
