# Alert Component

## Location
`apps/peninganaedalifid/src/components/ui/Alert.tsx`

## Purpose
Provides a reusable alert message component for displaying feedback to users with different severity levels (success, error, warning, info).

## Exports
- `function Alert` - React component for displaying alert messages
- `interface AlertProps` - TypeScript interface for component props

## Key Functionality
- Four variant styles: success, error, warning, info
- Optional title for alert messages
- Optional dismiss button with onDismiss callback
- Icon for each variant using inline SVG
- Proper ARIA role="alert" for accessibility
- Consistent styling with Tailwind CSS theme colors
- Class name merging using cn() utility

## Props

### AlertProps
```typescript
{
  variant: 'success' | 'error' | 'warning' | 'info';  // Required: Alert type
  title?: string;                                      // Optional: Alert title
  children: React.ReactNode;                           // Required: Alert content
  onDismiss?: () => void;                             // Optional: Dismiss handler
  className?: string;                                  // Optional: Additional classes
}
```

## Styling
- Uses Tailwind CSS 4 theme colors defined in globals.css
- Success: `success-50`, `success-600`, `success-800`, `success-200`
- Error: `danger-50`, `danger-600`, `danger-800`, `danger-200`
- Warning: `warning-50`, `warning-600`, `warning-800`, `warning-200`
- Info: `primary-50`, `primary-600`, `primary-800`, `primary-200`
- Rounded corners, border, padding consistent with design system
- Hover and focus states for dismiss button

## Dependencies
- `@/lib/utils/cn` - Class name merging utility
- `react` - React library
- Tailwind CSS theme colors

## Usage Example
```typescript
import { Alert } from '@/components/ui/Alert';

// Basic alert
<Alert variant="success">
  Your data has been saved successfully.
</Alert>

// Alert with title
<Alert variant="error" title="Error">
  Failed to load data. Please try again.
</Alert>

// Dismissible alert
<Alert
  variant="warning"
  title="Warning"
  onDismiss={() => console.log('Dismissed')}
>
  This action cannot be undone.
</Alert>

// Alert with custom className
<Alert variant="info" className="mb-4">
  New features are now available!
</Alert>
```

## Accessibility
- Proper `role="alert"` for screen readers
- Icons have `aria-hidden="true"` (decorative)
- Dismiss button has `aria-label="Dismiss alert"`
- Keyboard accessible (focus states, button activation)
- Color is not the only indicator (icons + text)

## Integration
- Part of UI components foundation
- Can be used throughout the application for user feedback
- Complements Toast component for temporary notifications
- Follows design system color palette

## Related
- Implements: Requirements US-F6 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 2: Base UI Components)
- Task: F12 from specs/project-foundation/tasks.md
