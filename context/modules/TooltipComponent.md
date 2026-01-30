# Tooltip Component

## Location
`apps/peninganaedalifid/src/components/ui/Tooltip.tsx`

## Purpose
Provides a reusable tooltip component for displaying additional context or help text on hover/focus. Shows after a configurable delay and supports multiple positioning options.

## Exports
- `function Tooltip` - React component for displaying tooltips
- `interface TooltipProps` - TypeScript interface for component props

## Key Functionality
- Shows on hover/focus after configurable delay (default 200ms)
- Supports four position options: top, right, bottom, left
- Dismisses on mouse leave/blur
- Accessible with aria-describedby attribute
- CSS-only positioning using absolute/relative
- Smooth fade-in animation
- Arrow indicator pointing to trigger element
- Automatic unique ID generation for ARIA
- Cleanup of timeout on unmount

## Props

### TooltipProps
```typescript
{
  content: string;                                         // Required: Tooltip text content
  children: React.ReactNode;                               // Required: Element to attach tooltip to
  position?: 'top' | 'right' | 'bottom' | 'left';         // Optional: Tooltip position (default: 'top')
  delay?: number;                                          // Optional: Show delay in ms (default: 200)
  className?: string;                                      // Optional: Additional tooltip classes
}
```

## Styling
- Dark background: `bg-neutral-900`
- White text: `text-white`
- Rounded corners: `rounded-lg`
- Shadow: `shadow-lg`
- Small text: `text-sm`
- Padding: `px-3 py-2`
- Arrow using CSS borders (4px)
- Fade-in and zoom animation on show
- Z-index: `z-50` to appear above other content

## Positioning
- **Top**: Appears above trigger, centered horizontally
- **Right**: Appears to the right of trigger, centered vertically
- **Bottom**: Appears below trigger, centered horizontally
- **Left**: Appears to the left of trigger, centered vertically
- Uses CSS transforms for precise positioning
- Arrow automatically positioned based on tooltip position

## Dependencies
- `@/lib/utils/cn` - Class name merging utility
- `react` - React library and hooks (useState, useRef, useEffect)
- Tailwind CSS for styling and animations

## Usage Example
```typescript
import { Tooltip } from '@/components/ui/Tooltip';

// Basic tooltip (top position, default delay)
<Tooltip content="This is helpful information">
  <button>Hover me</button>
</Tooltip>

// Right positioned tooltip
<Tooltip content="Additional context" position="right">
  <span>?</span>
</Tooltip>

// Custom delay (500ms)
<Tooltip content="This appears after 500ms" delay={500}>
  <div>Trigger element</div>
</Tooltip>

// Bottom positioned with custom class
<Tooltip
  content="Custom styled tooltip"
  position="bottom"
  className="bg-primary-600"
>
  <button>Custom tooltip</button>
</Tooltip>

// With icon
<Tooltip content="Help text for this field">
  <svg className="w-4 h-4" aria-label="Help">
    <circle cx="12" cy="12" r="10" />
  </svg>
</Tooltip>
```

## Accessibility
- Proper `role="tooltip"` attribute
- `aria-describedby` on trigger element links to tooltip ID
- Unique ID generated using Math.random()
- Keyboard accessible via focus/blur events
- Trigger element has `tabIndex={0}` for keyboard focus
- Arrow is decorative (`aria-hidden="true"` implied)
- Tooltip hidden from pointer events to prevent interference

## Behavior
- **Show trigger**: Mouse enter OR focus on trigger element
- **Hide trigger**: Mouse leave OR blur on trigger element
- **Delay**: Configurable delay before showing (prevents accidental triggers)
- **Cleanup**: Timeout cleared on hide or component unmount
- **Animation**: Smooth fade-in and zoom effect
- **Non-interactive**: `pointer-events-none` prevents tooltip from blocking clicks

## Technical Details
- Client component (`'use client'`) for interactivity
- Uses `useState` for visibility tracking
- Uses `useRef` for timeout management and tooltip DOM reference
- Uses `useEffect` for cleanup on unmount
- Timeout pattern prevents tooltip from showing on quick mouse-over
- Position calculated using Tailwind utility classes
- Arrow created using CSS border trick (transparent borders)

## Integration
- Part of UI components foundation
- Used throughout the application for contextual help
- Works with any trigger element (buttons, icons, text, etc.)
- Complements form inputs for field-level help
- Can be nested in other components

## Related
- Implements: Requirements US-F8 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 2: Base UI Components)
- Task: F14 from specs/project-foundation/tasks.md
