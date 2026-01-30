# SubscriptionBurnMeter Component

## Location
`src/components/subscriptions/SubscriptionBurnMeter.tsx`

## Purpose
Main orchestration component that combines all subscription subcomponents into a unified interface for tracking and managing recurring subscriptions. This is the top-level component for the subscription tracking feature.

## Exports
- `function SubscriptionBurnMeter({ className }: SubscriptionBurnMeterProps)` - Main subscription tracker component
- `interface SubscriptionBurnMeterProps` - Component props

## Key Functionality

### Component Composition
- Combines SubscriptionForm, SubscriptionList, SubscriptionSummary, and SubscriptionCategoryBreakdown
- Provides unified interface for entire subscription tracking feature
- Manages form open/close state and edit mode

### State Management
- `isFormOpen: boolean` - Controls form visibility
- `editingSubscription: Subscription | null` - Tracks which subscription is being edited

### Event Handlers
- `handleAddClick()` - Opens form in "add" mode
- `handleEditClick(subscription)` - Opens form in "edit" mode with subscription data
- `handleSave(data)` - Saves subscription (add or update via CalculatorContext)
- `handleCancel()` - Closes form without saving

### Layout Features
- **Desktop (lg+)**: 2-column grid layout
  - Left column: SubscriptionList
  - Right column: SubscriptionSummary and SubscriptionCategoryBreakdown
- **Mobile**: Single column stacked layout
- Form appears inline above list when open
- Empty state with call-to-action when no subscriptions

### User Interface Elements
- Main heading: "Áskriftakostnaðarmælir" (Subscription Cost Meter)
- Descriptive subtitle in Icelandic
- "Bæta við áskrift" button (hidden when form is open)
- Empty state card with icon and CTA

## Dependencies
- `@/context/CalculatorContext` - useCalculator() hook for subscription data and operations
- `@/components/ui/Button` - Primary action button
- `@/components/ui/Card` - Container component
- `@/components/subscriptions/SubscriptionForm` - Add/edit form
- `@/components/subscriptions/SubscriptionList` - Subscription list with controls
- `@/components/subscriptions/SubscriptionSummary` - Total cost and impact summary
- `@/components/subscriptions/SubscriptionCategoryBreakdown` - Visual category breakdown
- `@/lib/utils` - cn() utility for className merging
- `@/types/calculator` - Subscription type

## Tests
- Location: `tests/components/subscriptions/SubscriptionBurnMeter.test.tsx`
- Coverage:
  - ✅ Renders main heading and description
  - ✅ Renders "Add subscription" button
  - ✅ Shows empty state when no subscriptions
  - ✅ Opens form when add button clicked
  - ✅ Hides add button when form is open
  - ✅ Closes form on cancel
  - ✅ Renders 2-column grid layout
  - ✅ Renders SubscriptionList component
  - ✅ Has proper heading structure (h1)
  - ✅ Has accessible button labels
  - All tests passing (11/11)

## Integration

### Used by
- App pages that need subscription tracking functionality
- Dashboard pages
- Financial overview sections

### Uses
- CalculatorContext for state management (subscriptions, addSubscription, updateSubscription)
- All subscription subcomponents
- UI components (Button, Card)

## Props Interface

```typescript
interface SubscriptionBurnMeterProps {
  className?: string; // Optional CSS classes for container
}
```

## Related
- Implements: Requirements from specs/subscription-tracking-requirements.md
- Part of: specs/subscription-tracking-design.md
- Subcomponents:
  - SubscriptionForm.md
  - SubscriptionList.md
  - SubscriptionSummaryComponent.md
  - SubscriptionCategoryBreakdown.md

## Implementation Notes
- Created: 2026-01-20
- All text in Icelandic per app requirements
- Responsive design with mobile-first approach
- Form inline display (not modal overlay) for better UX
- Empty state provides clear path to first action
- Button visibility managed to avoid confusion when form is open
