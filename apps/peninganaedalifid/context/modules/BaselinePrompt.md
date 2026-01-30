# BaselinePrompt Component

## Location
`src/components/expenseBaseline/BaselinePrompt.tsx`

## Purpose
Alert component that prompts users to set up their expense baseline before using calculators that depend on it (FI Number, Savings Rate, etc.).

## Component Type
Integration Component (EPIC 6)

## Props Interface
```typescript
interface BaselinePromptProps {
  message?: string;
  linkTo?: string;
  buttonText?: string;
  onSetup?: () => void;
}
```

## Key Features
- Info alert variant (blue background)
- Clear Icelandic message explaining the need for expense baseline
- Educational text about three-tier system
- Button linking to expense baseline setup page
- Customizable message, link, and button text
- Optional callback instead of navigation

## Usage Examples

### Default Usage
```tsx
// Simple usage with defaults
<BaselinePrompt />
```

### Custom Message
```tsx
<BaselinePrompt
  message="Þú þarft að setja upp útgjaldagrunn til að reikna FI töluna þína"
  buttonText="Fara í uppsetningu"
/>
```

### With Callback (for programmatic navigation)
```tsx
<BaselinePrompt
  onSetup={() => router.push('/utgjaldareiknivel')}
/>
```

### In Calculator Context
```tsx
import { useExpenseBaseline, BaselinePrompt } from '@/components/expenseBaseline';

function FINumberCalculator() {
  const { hasBaseline } = useExpenseBaseline();

  if (!hasBaseline) {
    return <BaselinePrompt />;
  }

  return <div>{/* Calculator UI */}</div>;
}
```

## Default Props
- `message`: "Þú hefur ekki sett upp útgjaldagrunn"
- `linkTo`: "/utgjaldareiknivel"
- `buttonText`: "Setja upp útgjaldagrunn"

## Content
The alert includes:
1. Main message (customizable)
2. Educational paragraph explaining:
   - Expense baseline is foundation of FIRE plan
   - Three-tier system (Lágmarks, Þægilegt, Lúxus)
   - How it's used in other calculators
3. Call-to-action button

## Integration
- Used by: FI Number Calculator, Savings Rate Calculator (future)
- Imports: Alert from @/components/ui/Alert, Button from @/components/ui/Button

## Styling
- Alert component with info variant (primary blue colors)
- Button with primary variant and small size
- Spacing between elements using space-y-3

## Accessibility
- Alert role for screen readers
- Descriptive link/button text
- Clear hierarchy with message and explanation
- Keyboard accessible

## Tests
- Location: `tests/components/expenseBaseline/BaselinePrompt.test.tsx`
- Coverage: 10 tests
  - Default rendering
  - Custom message/button text
  - Link URL (default and custom)
  - Educational text display
  - Callback functionality
  - Link vs callback behavior

## Related Components
- TierSelector - Tier selection component
- useExpenseBaseline - Hook to check if baseline exists
- Alert - UI component for displaying messages

## Design Notes
- Message should be empowering, not blocking
- Educational tone to help users understand value
- Quick action button for immediate setup
- Supports both link navigation and programmatic routing
