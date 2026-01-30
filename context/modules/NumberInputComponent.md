# NumberInput Component

## Location
`apps/peninganaedalifid/src/components/ui/NumberInput.tsx`

## Purpose
Provides a specialized number input component with min/max validation, optional stepper buttons, keyboard increment/decrement support, and automatic value clamping for numeric form fields.

## Exports
- `interface NumberInputProps` - TypeScript interface extending React.InputHTMLAttributes but with controlled value/onChange pattern
- `const NumberInput` - Forwarded ref React component for number inputs

## Key Functionality

### Features
- **Min/Max Validation**: Validates input against min/max bounds on blur
- **Automatic Clamping**: Clamps values to min/max range when exceeded
- **Step Increment**: Supports configurable step size for increments
- **Optional Stepper Buttons**: Visual up/down buttons when `showStepper` is true
- **Keyboard Support**: Arrow up/down keys increment/decrement the value
- **Error Display**: Shows validation errors for out-of-range values
- **Label Support**: Optional label with automatic htmlFor association
- **Help Text**: Optional descriptive text below the input
- **Required Indicator**: Red asterisk (*) shown when `required` prop is true
- **Disabled State**: Visual feedback for disabled inputs
- **Accessible**: Proper ARIA attributes (aria-invalid, aria-describedby, aria-label)

### Props
```typescript
interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;           // Optional label text
  error?: string;           // External error message
  helpText?: string;        // Help text shown when no error
  value: number;            // Controlled value (required)
  onChange: (value: number) => void;  // Change handler (required)
  min?: number;             // Minimum allowed value
  max?: number;             // Maximum allowed value
  step?: number;            // Increment/decrement step size (default: 1)
  showStepper?: boolean;    // Show stepper buttons (default: false)
}
```

### Behavior

#### Validation
- On blur, validates value against min/max bounds
- Shows inline error message if value is out of range
- Automatically clamps value to min/max when out of bounds
- Clears validation error when user starts typing

#### Stepper Buttons
- Up button: Increments by step amount (disabled at max)
- Down button: Decrements by step amount (disabled at min)
- Buttons respect disabled state
- Each button has aria-label for accessibility

#### Keyboard Support
- Arrow Up: Increments value by step (respects max)
- Arrow Down: Decrements value by step (respects min)
- Works even when stepper buttons are hidden

### Styling
- Extends base Input component styling
- Full width, rounded corners (lg), border, padding (px-4 py-3)
- Focus: Ring effect with primary-500 color (or danger-500 when error)
- Error: Red border and ring (danger-500)
- Disabled: Gray background (neutral-100), not-allowed cursor
- Stepper buttons: Positioned absolutely on the right side
- Extra right padding (pr-12) when stepper is visible
- Transitions: Smooth color transitions

### Accessibility
- Automatic unique ID generation using React.useId()
- Proper label-to-input association via `htmlFor` and `id`
- `aria-invalid` set to "true" when error is present
- `aria-describedby` linking to error/help text for screen readers
- `aria-label` on stepper buttons ("Increment value", "Decrement value")
- Error messages have `role="alert"` for immediate announcement
- Required fields marked visually (*) and semantically (required attribute)
- Stepper buttons disabled state communicated to screen readers

## Dependencies
- `react` - ForwardRef, useId, useState, useEffect hooks
- `@/lib/utils` - cn() function for class name merging

## Tests
- Location: To be created separately
- Expected coverage:
  - Renders with label and value
  - Handles onChange when typing
  - Validates min/max on blur
  - Clamps value to min/max
  - Shows validation error for out-of-range values
  - Increments/decrements with keyboard arrows
  - Increments/decrements with stepper buttons
  - Disables stepper buttons at min/max
  - Respects disabled state
  - Handles step configuration
  - ARIA attributes are correct
  - Shows/hides stepper buttons based on prop

## Integration
- Used by: Calculator forms, numeric configuration components
- Extends: Input component styling patterns
- Uses: cn() utility from @/lib/utils
- Theme colors: primary, danger, neutral from globals.css

## Related
- Implements: Requirements from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 2: Base UI Components - NumberInput Component)
- Task: F8 from specs/project-foundation/tasks.md
- Depends on: Task F6 (Input component)

## Implementation Notes
- Implemented: 2026-01-19
- Uses React.forwardRef for ref forwarding to the input element
- Automatically generates unique IDs if not provided
- Combines external error prop with internal validation error
- External error takes precedence over validation error
- Stepper buttons use inline SVG icons (chevron up/down)
- Prevents default behavior on arrow key presses to avoid page scroll
- Handles edge cases: empty input, minus sign for negative numbers
- Type is fixed to "number" for HTML5 number input features
- Follows Tailwind CSS 4 @theme configuration for colors
