# CurrencyInput

## Location
`apps/peninganaedalifid/src/components/ui/CurrencyInput.tsx`

## Purpose
Specialized input component for currency values that provides a seamless user experience by showing formatted currency when not editing and raw numbers while editing.

## Exports
- `interface CurrencyInputProps` - TypeScript props interface
- `const CurrencyInput` - React component (forwardRef)

## Key Functionality
- **Dual Display Mode**: Shows formatted currency (e.g., "$1,234.56") when blurred, raw number when focused
- **Smart Input Validation**: Accepts only numeric characters and decimal point while editing
- **Paste Formatting**: Automatically strips formatting from pasted content (e.g., "$1,234.56" → "1234.56")
- **Controlled Component**: Works with value/onChange pattern for external state management
- **Currency Support**: Configurable currency code (defaults to USD)
- **Accessibility**: Full ARIA support, proper labels, error messages
- **Base Input Extension**: Uses same styling and patterns as base Input component

## Props
```typescript
interface CurrencyInputProps {
  value: number;              // Controlled value (numeric)
  onChange: (value: number) => void;  // Callback with numeric value
  label?: string;             // Optional label text
  error?: string;             // Error message
  helpText?: string;          // Help text
  currency?: string;          // Currency code (default: 'USD')
  disabled?: boolean;         // Disabled state
  placeholder?: string;       // Placeholder text
  required?: boolean;         // Required field indicator
  // ... extends InputHTMLAttributes
}
```

## Usage Example
```tsx
import { CurrencyInput } from '@/components/ui/CurrencyInput';

function MonthlyExpenses() {
  const [rent, setRent] = useState(1500);

  return (
    <CurrencyInput
      label="Monthly Rent"
      value={rent}
      onChange={setRent}
      required
      helpText="Enter your monthly rent amount"
    />
  );
}
```

## Behavior Details

### Focus State
- **Focused**: Shows raw number (e.g., "1234.56") for easy editing
- **Blurred**: Shows formatted currency (e.g., "$1,234.56")

### Input Validation
- Only allows digits (0-9) and decimal point (.)
- Prevents multiple decimal points
- Updates parent component with numeric value on every change

### Paste Handling
- Intercepts paste events
- Strips all non-numeric characters except decimal point
- Validates resulting value before accepting
- Prevents invalid paste content

### Currency Formatting
- Uses `formatCurrency` utility from `@/lib/utils/formatters`
- Supports any valid Intl.NumberFormat currency code
- Always shows 2 decimal places in formatted mode

## Dependencies
- `react` - Component framework
- `@/lib/utils/cn` - Class name utility
- `@/lib/utils/formatters` - formatCurrency function

## Accessibility Features
- Proper label association via htmlFor/id
- Required field indicator (asterisk)
- ARIA attributes:
  - `aria-invalid` for error state
  - `aria-describedby` linking to help text and error messages
  - `role="alert"` on error messages
- Unique IDs generated via React.useId()
- Help text and error messages properly linked

## Styling
- Extends base Input component styles
- Tailwind CSS classes for responsive design
- Error state styling (red border, red text)
- Disabled state styling (gray background, not-allowed cursor)
- Focus ring with primary color
- Smooth transitions on state changes

## Integration
- Designed to work with base Input component patterns
- Follows same accessibility and styling conventions
- Can be used anywhere numeric currency input is needed
- Ref forwarding supported for advanced use cases

## Related
- Implements: Requirements F7 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (CurrencyInput Component)
- Task: F7 in specs/project-foundation/tasks.md
- Depends on: Input component (F6), Utility functions (F4), Tailwind theme (F3)

## Implementation Notes
- Uses controlled component pattern exclusively (no uncontrolled mode)
- State management via React.useState for focus tracking and input value
- Effect hook synchronizes external value changes with internal display
- Input mode set to "decimal" for mobile keyboards
- Placeholder defaults to formatted zero in the selected currency
