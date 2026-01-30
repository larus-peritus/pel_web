# Button Component

## Location
`src/components/ui/Button.tsx`

## Purpose
Reusable button component with multiple variants, sizes, loading states, and full accessibility support.

## Exports
- `Button` - Polymorphic button component with forwardRef support
- `ButtonProps` - TypeScript interface for button props

## Key Functionality
- **Variants**: primary, secondary, ghost, danger
- **Sizes**: sm (small), md (medium), lg (large)
- **Loading State**: Shows spinner and disables interaction when `isLoading={true}`
- **Disabled State**: Visual and functional disabled state with reduced opacity
- **Accessibility**: Proper ARIA attributes (`aria-busy`, `aria-disabled`)
- **Keyboard Support**: Full keyboard navigation and focus management
- **Focus Management**: Visible focus ring with 2px offset using Tailwind classes

## Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}
```

## Styling Details

### Variants
- **primary**: Blue background, white text, hover darkens
- **secondary**: White background, bordered, subtle hover
- **ghost**: Transparent background, hover shows light gray
- **danger**: Red background, white text, hover darkens

### Sizes
- **sm**: px-3 py-1.5 text-sm (compact)
- **md**: px-4 py-2 text-base (default)
- **lg**: px-6 py-3 text-lg (prominent)

### States
- **Loading**: Shows animated spinner, disables interaction
- **Disabled**: 60% opacity, cursor-not-allowed
- **Hover**: Smooth color transitions (200ms)
- **Focus**: 2px ring with offset, variant-specific color

## Dependencies
- `clsx` - Conditional class names
- `tailwind-merge` - Tailwind class conflict resolution via `cn()` utility
- `@/lib/utils` - Provides `cn()` function for class merging

## Component Features
- **ForwardRef**: Supports ref forwarding for parent component control
- **Type Safety**: Full TypeScript support with exported interfaces
- **Spinner**: Built-in SVG spinner with animation
- **Class Merging**: Uses `cn()` utility for proper Tailwind class merging
- **Extensible**: Accepts custom className for additional styling

## Integration
- Uses: `cn()` from `@/lib/utils`
- Uses: Tailwind theme colors (primary-*, danger-*, neutral-*)
- Part of: UI component library (`src/components/ui/`)

## Usage Example
```typescript
// Basic usage
<Button variant="primary" size="md">
  Click Me
</Button>

// Loading state
<Button variant="primary" isLoading>
  Saving...
</Button>

// Disabled state
<Button variant="secondary" disabled>
  Unavailable
</Button>

// Custom className
<Button variant="ghost" className="w-full">
  Full Width Button
</Button>
```

## Related
- Implements: Requirements F5 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Button Component section)
- Task: F5 in specs/project-foundation/tasks.md
