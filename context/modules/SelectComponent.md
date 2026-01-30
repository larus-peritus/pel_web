# Select Component

## Location
`apps/peninganaedalifid/src/components/ui/Select.tsx`

## Purpose
Provides an accessible, customizable dropdown select component for forms with consistent styling and controlled state management.

## Exports
- `interface SelectOption` - Type definition for select options with value, label, and optional description
- `interface SelectProps` - Component props interface extending HTML select attributes
- `const Select` - Main Select component (React.forwardRef)

## Key Functionality
- **Label Support**: Optional label with required indicator (asterisk)
- **Controlled Component**: Uses value/onChange pattern for state management
- **Placeholder**: Optional disabled placeholder option
- **Error State**: Displays error message with proper ARIA attributes
- **Custom Styling**: Native select with custom dropdown arrow icon
- **Accessibility**:
  - Unique ID generation using React.useId()
  - aria-invalid for error states
  - aria-describedby for error messages
  - Keyboard navigation (native select)
  - Required field indicator with aria-label

## Component Interface

```typescript
interface SelectOption {
  value: string;
  label: string;
  description?: string;  // Reserved for future use
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  // Plus all standard HTML select attributes
}
```

## Styling Features
- Consistent with Input component design
- Tailwind CSS classes for responsive design
- Custom dropdown arrow icon (SVG)
- Focus ring with primary color
- Error state with danger color
- Disabled state styling
- Smooth transitions

## Usage Example

```typescript
import { Select } from '@/components/ui/Select';

function MyForm() {
  const [country, setCountry] = useState('');

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' }
  ];

  return (
    <Select
      label="Country"
      placeholder="Select a country"
      options={countryOptions}
      value={country}
      onChange={setCountry}
      required
      error={error}
    />
  );
}
```

## Dependencies
- `react` - Core React library, forwardRef, useId
- `@/lib/utils` - cn() function for class name merging

## Integration
- Used by: Form components throughout the application
- Matches styling of: Input, CurrencyInput, NumberInput components
- Part of: UI component library

## Design Decisions
- **Native Select**: Uses native HTML `<select>` element for maximum accessibility and keyboard support
- **Custom Arrow**: appearance-none with custom SVG icon for consistent cross-browser styling
- **Controlled Only**: Does not support uncontrolled mode to ensure predictable state management
- **Error Over Help Text**: Shows either error or help text, not both (error takes precedence)
- **Single Select**: Designed for single-select use cases (multi-select would be separate component)

## Related
- Implements: Requirement F9 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (UI Components section)
- Styled with: Tailwind Theme (context/modules/TailwindTheme.md)
- Uses: Utility Functions (context/modules/UtilityFunctions.md)

## Testing Considerations
- Test option rendering from array
- Test placeholder behavior (disabled state)
- Test error state display
- Test required indicator
- Test onChange callback
- Test accessibility attributes
- Test disabled state
- Test keyboard navigation
