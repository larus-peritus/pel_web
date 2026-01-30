# SubscriptionCategoryBreakdown Component

## Location
`apps/peninganaedalifid/src/components/subscriptions/SubscriptionCategoryBreakdown.tsx`

## Purpose
Displays a visual breakdown of subscriptions organized by category, showing the count, total cost, and percentage of total spending for each category.

## Exports
- `function SubscriptionCategoryBreakdown` - Main component
- `interface SubscriptionCategoryBreakdownProps` - Component props

## Key Functionality
- Displays subscription categories sorted by cost (highest first)
- Shows count of subscriptions per category (with proper Icelandic singular/plural)
- Shows total monthly cost for each category
- Renders progress bars showing percentage of total spending
- Color-coded categories with icons
- Filters out categories with no subscriptions
- Gracefully handles null/empty states

## Props
```typescript
interface SubscriptionCategoryBreakdownProps {
  className?: string; // Optional CSS classes
}
```

## Data Source
- Uses `useCalculator()` hook to access `subscriptionSummary.byCategory`
- Categories are pre-sorted by cost in the summary (highest first)
- Each category includes: category type, label, totalMonthly, count

## Category Mapping

### Colors
- **streaming** (Streymi): Blue - `bg-blue-500`, `text-blue-700`
- **software** (Hugbúnaður): Purple - `bg-purple-500`, `text-purple-700`
- **fitness** (Líkamsrækt): Green - `bg-green-500`, `text-green-700`
- **news** (Fréttir): Orange - `bg-orange-500`, `text-orange-700`
- **gaming** (Tölvuleikir): Red - `bg-red-500`, `text-red-700`
- **other** (Annað): Gray - `bg-gray-500`, `text-gray-700`

### Icons
- **streaming**: 🎬 (U+1F3AC)
- **software**: 💻 (U+1F4BB)
- **fitness**: 💪 (U+1F4AA)
- **news**: 📰 (U+1F4F0)
- **gaming**: 🎮 (U+1F3AE)
- **other**: 📋 (U+1F4CB)

## Layout
- Uses Card component with header and content sections
- Header: "Kostnaður eftir flokkum" (Cost by category)
- Content: List of categories with progress bars
- Each category row shows:
  - Icon + Category label + Count + Total cost
  - Progress bar with percentage

## Percentage Calculation
```
percentage = (category.totalMonthly / total) * 100
```
- Rounded to whole number (0 decimals)
- Handles 0 total gracefully (shows 0%)

## Text (Icelandic)
- Title: "Kostnaður eftir flokkum"
- Count: "X áskrift" (singular) or "X áskriftir" (plural)
- Currency: Uses `formatCurrency()` for ISK formatting

## Accessibility
- Progress bars have proper ARIA attributes:
  - `role="progressbar"`
  - `aria-valuenow`: Current percentage (rounded)
  - `aria-valuemin="0"`
  - `aria-valuemax="100"`
  - `aria-label`: Describes category and percentage in Icelandic
- Icons are decorative (`aria-hidden="true"`)

## Dependencies
- `@/context/CalculatorContext` - For subscriptionSummary data
- `@/components/ui/Card` - Card, CardHeader, CardContent
- `@/lib/utils/formatters` - formatCurrency for ISK
- `@/lib/utils` - cn() for className merging
- `@/types/calculator` - SubscriptionCategory type

## Tests
- Location: `apps/peninganaedalifid/tests/components/subscriptions/SubscriptionCategoryBreakdown.test.tsx`
- Coverage: 17 tests covering:
  - Null/empty state rendering
  - Category display with labels and counts
  - Singular/plural Icelandic text
  - Progress bar percentages and ARIA
  - Edge cases (0 total, large numbers, 100%)
  - Custom className application
  - Filtering of empty categories

## Integration
- Used by: Subscription Burn Meter feature
- Part of: specs/subscription-burn-meter/tasks.md (Task 7)
- Implements: NS-4 from requirements (categorize subscriptions)

## Related
- Implements: Requirements NS-4 from `specs/subscription-burn-meter/requirements.md`
- Part of: `specs/subscription-burn-meter/design.md`
- Works with: CalculatorContext for subscription data

## Design Decisions
1. **Auto-filtering**: Categories with count=0 are automatically filtered out
2. **Responsive**: Progress bars flex to fill available width
3. **Color consistency**: Each category has consistent color throughout app
4. **Percentage rounding**: Whole numbers for cleaner display
5. **Null handling**: Returns null instead of empty state message (parent handles)
6. **Animation**: Progress bars have 500ms transition for smooth updates

## Usage Example
```tsx
import { SubscriptionCategoryBreakdown } from '@/components/subscriptions';

function SubscriptionPage() {
  return (
    <div>
      <SubscriptionCategoryBreakdown />
    </div>
  );
}
```

## Visual Layout
```
┌──────────────────────────────────────┐
│ Kostnaður eftir flokkum              │
│                                      │
│ 🎬 Streymi (4 áskriftir)  8.969 kr   │
│ ████████████████░░░░░ 57%            │
│                                      │
│ 💪 Líkamsrækt (1 áskrift) 6.990 kr   │
│ ███████████░░░░░░░░░░ 45%            │
│                                      │
│ 💻 Hugbúnaður (2 áskriftir) 1.448 kr │
│ ███░░░░░░░░░░░░░░░░░░ 9%             │
└──────────────────────────────────────┘
```

## Implementation Date
2026-01-20

## Status
✅ Complete and tested
