# Toast System

## Location
- `src/context/ToastContext.tsx` - Toast context provider and hook
- `src/components/ui/Toast.tsx` - Toast UI components

## Purpose
Provides a global toast notification system for displaying temporary success, error, warning, and info messages to users. The system manages toast state centrally via React Context and displays notifications in a fixed container at the bottom-right of the screen.

## Exports

### ToastContext (`src/context/ToastContext.tsx`)
- `ToastProvider` - Context provider component that wraps the app
- `useToast()` - Hook to access toast functions
- `Toast` - TypeScript interface for toast objects
- `ToastOptions` - TypeScript interface for adding toasts

### Toast Component (`src/components/ui/Toast.tsx`)
- `ToastContainer` - Main container component that renders all toasts

## Key Functionality

### Toast Management
- **Add Toast**: `addToast({ variant, message, duration })`
- **Remove Toast**: `removeToast(id)` - Called automatically or manually
- **Auto-dismiss**: Toasts automatically remove after duration (default 5000ms)
- **Stacking**: Multiple toasts stack vertically with spacing

### Variants
- `success` - Green colors, checkmark icon
- `error` - Red colors, X icon
- `warning` - Yellow/orange colors, warning triangle icon
- `info` - Blue colors, info circle icon

### Features
- Unique ID generation using `Math.random()`
- Fade in/out animations using CSS transitions
- Manual dismiss button on each toast
- Fixed positioning (bottom-right corner)
- Responsive on mobile and desktop

## Usage Example

```typescript
import { useToast } from '@/context/ToastContext';

function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast({
      variant: 'success',
      message: 'Your data has been saved!',
      duration: 5000 // optional, defaults to 5000ms
    });
  };

  const handleError = () => {
    addToast({
      variant: 'error',
      message: 'Something went wrong. Please try again.',
      duration: 7000 // custom duration
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Save</button>
      <button onClick={handleError}>Test Error</button>
    </div>
  );
}
```

## Dependencies
- `react` - Context, state management, hooks
- `@/lib/utils` - `cn()` function for class name merging
- Tailwind CSS - Styling with theme colors

## Integration

### In Root Layout
```typescript
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
```

## Accessibility
- `role="alert"` on each toast
- `aria-live="polite"` on individual toasts
- `aria-live="assertive"` on toast container
- `aria-label="Dismiss notification"` on dismiss buttons
- `aria-hidden="true"` on decorative icons

## Styling
- Uses theme colors from `globals.css` (primary, success, warning, danger)
- Consistent with Alert component styling
- Transition duration: 300ms for smooth animations
- Shadow-lg for elevation
- Rounded-lg corners
- Max-width: 384px (24rem)

## Testing Considerations
- Test toast addition and removal
- Test auto-dismiss timing
- Test manual dismiss
- Test multiple toasts stacking
- Test animation states
- Test accessibility attributes

## Related
- Implements: Requirements F13 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Toast System section)
- Similar to: Alert component (shared icons and color scheme)
