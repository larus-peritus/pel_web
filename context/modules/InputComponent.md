# Input Component

## Location
`apps/peninganaedalifid/src/components/ui/Input.tsx`

## Purpose
Provides a reusable, accessible text input component with label, error handling, help text, and required indicators for form building throughout the application.

## Exports
- `interface InputProps` - TypeScript interface extending React.InputHTMLAttributes<HTMLInputElement>
- `const Input` - Forwarded ref React component for text inputs

## Key Functionality

### Features
- **Label Support**: Optional label with automatic htmlFor association
- **Error State**: Error message display with red styling and error icon
- **Help Text**: Optional descriptive text below the input
- **Required Indicator**: Red asterisk (*) shown when `required` prop is true
- **Disabled State**: Visual feedback for disabled inputs with cursor and background changes
- **Accessible**: Proper ARIA attributes (aria-invalid, aria-describedby)

### Props
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;       // Optional label text
  error?: string;       // Error message (overrides helpText when present)
  helpText?: string;    // Help text shown when no error
}
```

### Styling
- Base: Full width, rounded corners (lg), border, padding (px-4 py-3)
- Focus: Ring effect with primary-500 color (or danger-500 when error)
- Error: Red border and ring (danger-500)
- Disabled: Gray background (neutral-100), not-allowed cursor
- Transitions: Smooth color transitions (200ms)

### Accessibility
- Automatic unique ID generation using React.useId()
- Proper label-to-input association via `htmlFor` and `id`
- `aria-invalid` set to "true" when error is present
- `aria-describedby` linking to error/help text for screen readers
- Error messages have `role="alert"` for immediate announcement
- Required fields marked visually (*) and semantically (required attribute)

## Dependencies
- `react` - ForwardRef, useId hook
- `@/lib/utils` - cn() function for class name merging

## Tests
- Location: To be created separately
- Expected coverage:
  - Renders with label
  - Renders with error state
  - Renders with help text
  - Shows required indicator
  - Handles disabled state
  - ARIA attributes are correct
  - ID generation works

## Integration
- Used by: Form components, specialized input components (CurrencyInput, NumberInput)
- Uses: cn() utility from @/lib/utils
- Theme colors: primary, danger, neutral from globals.css

## Related
- Implements: Requirements from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 2: Base UI Components - Input Component)
- Task: F6 from specs/project-foundation/tasks.md

## Implementation Notes
- Implemented: 2026-01-19
- Uses React.forwardRef for ref forwarding to the input element
- Automatically generates unique IDs if not provided
- Error message takes precedence over help text when both are present
- Follows Tailwind CSS 4 @theme configuration for colors
- All standard HTML input attributes are supported via spread props
