# Header Component

## Location
`apps/peninganaedalifid/src/components/layout/Header.tsx`

## Purpose
Provides the main site header with branding, navigation actions, and responsive mobile menu.

## Exports
- `function Header` - Site header component with responsive navigation

## Key Functionality
- **Branding**: Displays "Life Energy Calculator" title with primary color
- **Desktop Navigation**: Shows Export and Import buttons on medium+ breakpoints
- **Mobile Menu**: Hamburger icon toggles collapsible menu on small screens
- **Responsive Design**: Adapts layout from mobile (< 768px) to desktop
- **Placeholder Actions**: Export/Import handlers log to console (to be connected to data features)

## Component Structure

### Desktop Layout (md and up)
```
┌─────────────────────────────────────────────────┐
│  Life Energy Calculator    [Export] [Import]    │
└─────────────────────────────────────────────────┘
```

### Mobile Layout (< md)
```
┌─────────────────────────────────────────────────┐
│  Life Energy Calculator                   [☰]   │
└─────────────────────────────────────────────────┘

When menu open:
┌─────────────────────────────────────────────────┐
│  Life Energy Calculator                   [X]   │
├─────────────────────────────────────────────────┤
│  [Export Button - Full Width]                   │
│  [Import Button - Full Width]                   │
└─────────────────────────────────────────────────┘
```

## Props Interface
```typescript
interface HeaderProps {
  className?: string;  // Optional additional CSS classes
}
```

## State Management
- `isMobileMenuOpen` - Boolean state controlling mobile menu visibility

## Dependencies
- `@/components/ui/Button` - Button component for actions
- `@/lib/utils` - cn() utility for class name merging
- `react` - useState hook for mobile menu state

## Styling
- Container: max-width 7xl, responsive padding
- Height: Fixed h-16 (64px)
- Background: White with bottom border
- Title: Primary-700 color, responsive font size (xl on mobile, 2xl on desktop)
- Buttons: Secondary variant, small size on desktop
- Mobile menu: Full-width buttons, medium size
- Hamburger icon: Transforms from ☰ to X when open

## Accessibility
- Semantic `<header>` and `<nav>` elements
- ARIA labels on buttons ("Export data", "Import data", "Toggle mobile menu")
- `aria-expanded` attribute on mobile menu button
- `aria-hidden` on decorative icons
- Keyboard accessible with focus states

## Responsive Breakpoints
- Mobile: < 768px (md) - Shows hamburger menu, hides desktop nav
- Desktop: >= 768px (md) - Shows desktop nav, hides hamburger menu

## Tests
Not required for this task (handled separately)

## Integration
- Used in: Root layout (`app/layout.tsx`)
- Styling: Tailwind CSS 4 theme colors from `globals.css`
- Future Integration: Export/Import handlers will connect to data persistence features (Tasks F22-F23)

## Related
- Implements: Requirement US-F7 from `specs/project-foundation/requirements.md`
- Part of: Task F17 in `specs/project-foundation/tasks.md`
- Complements: Footer component (`context/modules/FooterComponent.md`)
- Design: `specs/project-foundation/design.md` (Part 3: Layout Components)

## Implementation Notes
- Client component (uses 'use client' directive for state management)
- Placeholder handlers ready for future data export/import feature integration
- Mobile-first responsive design
- Simple toggle state for mobile menu (no animations in MVP)
