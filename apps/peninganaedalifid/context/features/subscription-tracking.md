# Feature: Subscription Tracking

## Overview
A comprehensive subscription tracking system that allows users to manage recurring expenses and see their impact on life energy. Users can add, edit, delete, and toggle subscriptions, view totals by category, and see how much life energy their subscriptions consume.

## Status
✅ Complete - All core components implemented

Completed components:
1. ✅ SubscriptionForm - Add/edit subscription form with presets
2. ✅ SubscriptionList - List view with toggle, edit, delete
3. ✅ SubscriptionSummary - Total costs and life energy metrics
4. ✅ SubscriptionCategoryBreakdown - Visual breakdown by category
5. ✅ SubscriptionBurnMeter - Main orchestration component

## Architecture

### Component Hierarchy
```
SubscriptionBurnMeter (Main Container)
├── SubscriptionForm (Add/Edit Modal)
├── Left Column
│   └── SubscriptionList
│       └── Individual subscription items
│           ├── Toggle switch
│           ├── Edit button
│           └── Delete button
└── Right Column
    ├── SubscriptionSummary
    │   ├── Monthly/yearly totals
    │   ├── Life energy impact
    │   └── Future value projections
    └── SubscriptionCategoryBreakdown
        └── Category breakdown chart
```

### Layout Strategy
- **Desktop (lg+)**: 2-column grid layout
  - Left: SubscriptionList
  - Right: SubscriptionSummary + SubscriptionCategoryBreakdown (stacked)
- **Mobile**: Single column, all components stacked
- Form appears inline above list when open

## Modules

### Main Component
- **SubscriptionBurnMeter** - `context/modules/SubscriptionBurnMeter.md`
  - Main orchestration component
  - Manages form open/close state
  - Coordinates all subcomponents

### Subcomponents
- **SubscriptionForm** - `context/modules/SubscriptionForm.md`
  - Add/edit subscription form
  - Quick presets for common subscriptions
  - Validation and error handling

- **SubscriptionList** - `context/modules/SubscriptionList.md`
  - Displays subscriptions grouped by category
  - Toggle active/inactive state
  - Edit and delete operations
  - Delete confirmation dialog

- **SubscriptionSummary** - `context/modules/SubscriptionSummaryComponent.md`
  - Total monthly/yearly costs
  - Life energy hours calculation
  - Future value projections (10/20 years)

- **SubscriptionCategoryBreakdown** - `context/modules/SubscriptionCategoryBreakdown.md`
  - Visual breakdown by category
  - Color-coded categories
  - Percentage distribution

## Dependencies

### External
- React (useState, hooks)
- Tailwind CSS (styling)

### Internal
- `@/context/CalculatorContext` - State management
- `@/components/ui/*` - UI components (Button, Card, Input, Select, Badge)
- `@/lib/calculations/subscriptions` - Calculation logic
- `@/lib/utils/formatters` - Formatting utilities
- `@/types/calculator` - Type definitions

## Data Flow

### State Management
State is managed in CalculatorContext:
- `subscriptions: Subscription[]` - Array of user subscriptions
- `subscriptionSummary: SubscriptionSummary | null` - Calculated summary
- `addSubscription(data)` - Add new subscription
- `updateSubscription(id, updates)` - Update existing subscription
- `deleteSubscription(id)` - Delete subscription
- `toggleSubscription(id)` - Toggle active/inactive

### Persistence
- Subscriptions automatically saved to localStorage via CalculatorContext
- Auto-save debounced (500ms)
- Loaded on mount

## Testing

### Unit Tests
- **SubscriptionBurnMeter**: `tests/components/subscriptions/SubscriptionBurnMeter.test.tsx`
  - 11 tests, all passing
  - Tests rendering, form behavior, layout, accessibility

- **SubscriptionForm**: `tests/components/subscriptions/SubscriptionForm.test.tsx`
  - Tests add/edit modes, validation, quick presets

- **SubscriptionList**: `tests/components/subscriptions/SubscriptionList.test.tsx`
  - Tests grouping, toggle, delete, empty state

- **SubscriptionSummary**: `tests/components/subscriptions/SubscriptionSummary.test.tsx`
  - Tests calculation display, empty state

- **SubscriptionCategoryBreakdown**: `tests/components/subscriptions/SubscriptionCategoryBreakdown.test.tsx`
  - Tests category breakdown, percentages

### Integration Points
- Works with CalculatorContext for state management
- Integrates with actual hourly wage calculation for life energy metrics
- Exports to JSON as part of app state

## User Experience

### Key Features
1. **Easy Entry**: Quick presets for common Icelandic subscriptions
2. **Visual Feedback**: See immediate impact on totals when adding/toggling
3. **Life Energy Context**: Shows how subscriptions translate to work hours
4. **Future Impact**: Projections show opportunity cost over 10/20 years
5. **Category Organization**: Auto-grouped by category, sorted by cost
6. **Mobile Friendly**: Responsive layout, touch-friendly controls

### Icelandic Language
All text in Icelandic:
- "Áskriftakostnaðarmælir" (Subscription Cost Meter)
- "Bæta við áskrift" (Add subscription)
- "Breyta áskrift" (Edit subscription)
- Category labels in Icelandic
- Form fields in Icelandic
- Error messages in Icelandic

## Implementation Notes

### Completed: 2026-01-20
All 5 core components implemented and tested.

### Design Decisions
1. **Inline form vs modal**: Chose inline form for better UX on mobile
2. **Toggle vs checkbox**: Toggle switch more intuitive for active/inactive state
3. **Delete confirmation**: Modal dialog prevents accidental deletions
4. **Category colors**: Consistent across list and breakdown chart
5. **Empty state**: Provides clear CTA for first subscription

### Future Enhancements (Optional)
- Export subscriptions to CSV
- Import from bank statements
- Recurring cost trends over time
- Subscription renewal reminders
- Compare to Icelandic averages
