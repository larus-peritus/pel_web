# SubscriptionList Component

## Location
`apps/peninganaedalifid/src/components/subscriptions/SubscriptionList.tsx`

## Purpose
Displays all user subscriptions in a grouped, organized list with controls for toggling active state, editing, and deleting subscriptions.

## Key Features

### Display
- Groups subscriptions by category (sorted by total cost, highest first)
- Shows category headers with Icelandic labels and monthly totals
- Displays subscription name, cost, and category for each item
- Shows "Óvirk" badge for inactive subscriptions
- Inactive subscriptions displayed with 50% opacity

### Interactions
- **Toggle Switch**: Activate/deactivate subscriptions
- **Edit Button**: Triggers onEdit callback with subscription data
- **Delete Button**: Shows confirmation dialog before deletion
- **Delete Confirmation**: Modal dialog prevents accidental deletions

### Layout
- Responsive design (mobile-friendly)
- Empty state when no subscriptions exist
- Category color coding (matches CategoryBreakdown):
  - Streaming: Blue
  - Software: Purple
  - Fitness: Green
  - News: Orange
  - Gaming: Red
  - Other: Gray

## Component Structure

### Props Interface
```typescript
interface SubscriptionListProps {
  onEdit: (subscription: Subscription) => void;
  className?: string;
}
```

### Context Integration
Uses `useCalculator()` hook to access:
- `subscriptions`: Array of all subscriptions
- `subscriptionSummary`: Category grouping and totals
- `toggleSubscription(id)`: Toggle active/inactive state
- `deleteSubscription(id)`: Remove a subscription

### State Management
- Local state for delete confirmation dialog
- Groups subscriptions using memoized computation
- Sorts categories by cost (from subscriptionSummary)
- Sorts subscriptions alphabetically within each category (Icelandic collation)

## Subcomponents

### ToggleSwitch
Inline toggle component for subscription active state:
- Green background when active
- Gray background when inactive
- Smooth transitions (200ms)
- Proper ARIA attributes (role="switch", aria-checked)
- Keyboard accessible with focus ring

## Text Content (Icelandic)

| English | Icelandic |
|---------|-----------|
| My Subscriptions | Mínar áskriftir |
| No subscriptions registered | Engar áskriftir skráðar |
| Add your first subscription above | Bættu við fyrstu áskriftinni þinni hér að ofan |
| Inactive | Óvirk |
| Edit | Breyta (✏️) |
| Delete | Eyða (🗑️) |
| Delete subscription? | Eyða áskrift? |
| Are you sure you want to delete | Ertu viss um að þú viljir eyða |
| Cancel | Hætta við |

## Data Flow

1. **Load**: Fetches subscriptions and summary from CalculatorContext
2. **Group**: Uses `subscriptionSummary.byCategory` for category order
3. **Display**: Renders grouped list with category headers
4. **Toggle**: Calls `toggleSubscription(id)` directly
5. **Edit**: Passes subscription object to parent via onEdit prop
6. **Delete**: Shows confirmation, then calls `deleteSubscription(id)`

## Dependencies
- `@/context/CalculatorContext`: State management
- `@/components/ui/Card`: Container component
- `@/components/ui/Button`: Action buttons
- `@/components/ui/Badge`: Status indicator
- `@/lib/utils/formatters`: formatCurrency for ISK display
- `@/lib/calculations/subscriptions`: SUBSCRIPTION_CATEGORY_LABELS
- `@/lib/utils`: cn utility for className merging

## Tests
- **Location**: `tests/components/subscriptions/SubscriptionList.test.tsx`
- **Coverage**: 25 tests covering:
  - Rendering (empty state, grouped display, category headers)
  - Toggle functionality (activation, ARIA labels)
  - Edit functionality (callback invocation)
  - Delete functionality (confirmation dialog, cancel, confirm)
  - Sorting (categories by cost, subscriptions alphabetically)
  - Accessibility (ARIA labels, keyboard support)
  - Edge cases (null summary, missing categories)

## Integration
- Part of Subscription Burn Meter feature
- Used alongside:
  - `SubscriptionForm`: For adding/editing subscriptions
  - `SubscriptionSummary`: For displaying totals
  - `SubscriptionCategoryBreakdown`: For category visualization

## Accessibility

### ARIA Attributes
- Toggle switches have `role="switch"` and `aria-checked`
- Edit/delete buttons have descriptive `aria-label`
- Category totals use semantic headings (h3)

### Keyboard Support
- All interactive elements keyboard accessible
- Focus visible with ring indicator
- Tab navigation follows logical order
- Enter/Space activate buttons and switches

### Screen Reader Support
- Descriptive labels for all controls
- Status badges properly announced
- Dialog has proper heading structure

## Related
- Implements: Requirements from `specs/subscription-burn-meter-requirements.md`
- Design: `specs/subscription-burn-meter-design.md`
- Part of Task: Subscription component implementation
