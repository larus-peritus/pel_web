# TierSelector Component

## Location
`src/components/expenseBaseline/TierSelector.tsx`

## Purpose
Embeddable tier selector component for choosing between three expense tiers (Barebones, Comfortable, Deluxe). Designed to be used in other calculators like FI Number and Savings Rate.

## Component Type
Standalone Integration Component (EPIC 6)

## Props Interface
```typescript
interface TierSelectorProps {
  selectedTier: ExpenseTier | null;
  onSelectTier: (tier: ExpenseTier) => void;
  showExpenseAmount?: boolean;
  compact?: boolean;
  disabled?: boolean;
  tierExpenses?: {
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
}
```

## Key Features
- Three tier radio buttons (Lágmarks, Þægilegt, Lúxus)
- Optional expense amount display
- Compact mode for sidebar usage
- Disabled state support
- Accessible radio group pattern (ARIA compliant)
- Color-coded tiers (Amber for Barebones, Green for Comfortable, Purple for Deluxe)
- Works standalone without accessing context directly

## Usage Examples

### Basic Usage
```tsx
const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');

<TierSelector
  selectedTier={selectedTier}
  onSelectTier={setSelectedTier}
/>
```

### With Expense Amounts
```tsx
<TierSelector
  selectedTier={selectedTier}
  onSelectTier={setSelectedTier}
  showExpenseAmount
  tierExpenses={{ barebones: 250000, comfortable: 520000, deluxe: 1000000 }}
/>
```

### Compact Mode
```tsx
<TierSelector
  selectedTier={selectedTier}
  onSelectTier={setSelectedTier}
  compact
/>
```

### With Custom Hook
```tsx
import { useSelectedTier } from '@/components/expenseBaseline';

const [tier, setTier, monthlyExpense] = useSelectedTier('comfortable');

<TierSelector
  selectedTier={tier}
  onSelectTier={setTier}
  showExpenseAmount
  tierExpenses={expenseBaselineResults?.totals}
/>
```

## Integration
- Used by: FI Number Calculator, Savings Rate Calculator (future)
- Imports: TIER_LABELS, TIER_COLORS from @/lib/constants/expenseBaseline
- Utilities: formatCurrency from @/lib/utils/formatters

## Styling
- Three-column grid on desktop (sm:grid-cols-3)
- Single column on mobile and compact mode
- Radio indicator with colored border when selected
- Hover and focus states for accessibility
- Smooth transitions (300ms)

## Accessibility
- Role: radiogroup with radio buttons
- ARIA: aria-label, aria-checked attributes
- Keyboard: Full keyboard navigation support
- Screen readers: Proper labeling and state announcements

## Tests
- Location: `tests/components/expenseBaseline/TierSelector.test.tsx`
- Coverage: 11 tests
  - Rendering all three tiers
  - Expense amount display toggle
  - Selection callback
  - ARIA attributes
  - Compact/responsive layouts
  - Disabled state
  - Radiogroup accessibility

## Related Components
- BaselinePrompt - Alert for missing baseline
- useSelectedTier - Hook for tier state management
- useExpenseByTier - Hook for expense lookup

## Design Notes
- Tier colors match design spec: Amber (Barebones), Green (Comfortable), Purple (Deluxe)
- Expense amounts formatted with Icelandic number format (e.g., "250.000 kr/mán")
- Component is fully controlled (parent manages state)
- Can work without expense baseline (tierExpenses prop is optional)
