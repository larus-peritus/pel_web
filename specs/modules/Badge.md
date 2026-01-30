# Badge Component

## Location
`src/components/ui/Badge.tsx`

## Purpose
Provides a compact badge/tag component for displaying status indicators, labels, and categorical information inline with text or other content.

## Exports
- `function Badge` - Main badge component with variant and size support
- `interface BadgeProps` - TypeScript interface for component props

## Key Functionality
- **Variants**: Supports 5 semantic color variants:
  - `success` - Green badge for positive states
  - `warning` - Orange badge for cautionary states
  - `danger` - Red badge for error/critical states
  - `info` - Blue badge (using primary colors) for informational content
  - `neutral` - Gray badge for neutral/default states
- **Sizes**: Two size options:
  - `sm` - Small badge (12px text, compact padding)
  - `md` - Medium badge (14px text, default)
- **Inline Display**: Uses `inline-flex` for seamless integration with text
- **Styling**: Rounded corners, subtle borders, and semantic background colors using theme palette

## Component Props
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';  // Default: 'md'
  children: React.ReactNode;
  className?: string;  // Optional additional CSS classes
}
```

## Implementation Details
- Uses `cn()` utility from `@/lib/utils/cn` for class name merging
- Supports custom className prop for additional styling flexibility
- Renders as a `<span>` element for inline usage
- Uses Tailwind CSS 4 theme colors defined in `globals.css`:
  - `success-*` for success variant
  - `warning-*` for warning variant
  - `danger-*` for danger variant
  - `primary-*` for info variant
  - `neutral-*` for neutral variant
- Border color uses opacity (`/20`) for subtle visual distinction

## Dependencies
- `@/lib/utils/cn` - Class name merging utility (Task F4)
- Tailwind CSS 4 theme colors (Task F3)
- React

## Usage Example
```tsx
import { Badge } from '@/components/ui/Badge';

// Success badge
<Badge variant="success">Active</Badge>

// Warning badge
<Badge variant="warning" size="sm">Pending</Badge>

// Danger badge with custom styling
<Badge variant="danger" className="ml-2">Error</Badge>

// Info badge
<Badge variant="info">New Feature</Badge>

// Neutral badge
<Badge variant="neutral" size="sm">Draft</Badge>
```

## Integration
- Used by: Will be used by calculator components for status indicators, scenario labels, etc.
- Uses: cn() utility function, Tailwind theme colors

## Related
- Implements: Requirements from `specs/project-foundation/requirements.md`
- Part of: `specs/project-foundation/design.md` - Part 2: Base UI Components
- Task: F15 from `specs/project-foundation/tasks.md`
