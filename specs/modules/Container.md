# Container Component

## Location
`apps/peninganaedalifid/src/components/layout/Container.tsx`

## Purpose
Provides a responsive max-width container component for centering and constraining content width with consistent horizontal padding.

## Exports
- `function Container` - Container component with size variants
- `interface ContainerProps` - TypeScript props interface

## Key Functionality
- **Size Variants**: Four max-width options (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Centered Content**: Uses `mx-auto` to center content horizontally
- **Responsive Padding**: Adaptive horizontal padding (px-4 on mobile, sm:px-6 on small screens, lg:px-8 on large screens)
- **Class Merging**: Supports custom className prop with cn() utility for Tailwind class merging
- **Full Width**: Uses `w-full` to ensure container spans available width before max-width constraint

## Size Reference
| Size | Max Width | Use Case |
|------|-----------|----------|
| sm   | 640px     | Narrow content (forms, articles) |
| md   | 768px     | Standard content |
| lg   | 1024px    | Wide content (default) |
| xl   | 1280px    | Full-width layouts |

## Usage Example
```tsx
import { Container } from '@/components/layout/Container';

// Default (lg)
<Container>
  <h1>Content</h1>
</Container>

// With size variant
<Container size="sm">
  <form>...</form>
</Container>

// With custom className
<Container className="py-8">
  <div>Custom spacing</div>
</Container>
```

## Props
```typescript
interface ContainerProps {
  children: React.ReactNode;  // Content to render inside container
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Max-width variant (default: 'lg')
  className?: string;  // Additional Tailwind classes
}
```

## Dependencies
- `cn` from `@/lib/utils` - For Tailwind class merging
- React - For component and children types

## Tailwind Classes Used
- `max-w-[640px]`, `max-w-[768px]`, `max-w-[1024px]`, `max-w-[1280px]` - Size constraints
- `mx-auto` - Horizontal centering
- `w-full` - Full width before max-width constraint
- `px-4` - Base horizontal padding (1rem)
- `sm:px-6` - Small screen padding (1.5rem at 640px+)
- `lg:px-8` - Large screen padding (2rem at 1024px+)

## Integration
- Used by: Layout components, page templates
- Part of: Layout component system

## Related
- Implements: Requirement FR8 (Responsive Layout Support) from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 3: Layout Components)
- Task: F19 from specs/project-foundation/tasks.md

## Implementation Notes
- Uses Tailwind CSS 4 arbitrary value syntax `max-w-[XXXpx]` for precise breakpoints
- Default size is `lg` (1024px) for standard content width
- Responsive padding follows standard mobile-first Tailwind breakpoint pattern
- Can be nested with other layout components (Header, Footer, Section)
