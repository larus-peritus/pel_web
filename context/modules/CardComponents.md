# Card Components

## Location
`apps/peninganaedalifid/src/components/ui/Card.tsx`

## Purpose
Provides reusable card container components for displaying grouped content with consistent styling, padding, and structure. Cards can be used to organize information, forms, or actions in visually distinct sections.

## Exports

### Main Components
- `Card` - Container component with elevation or outline styling
- `CardHeader` - Header section for titles and subtitles
- `CardContent` - Main content area
- `CardFooter` - Footer section for actions and buttons

### Types
- `CardProps` - Props for Card component
- `CardHeaderProps` - Props for CardHeader component
- `CardContentProps` - Props for CardContent component
- `CardFooterProps` - Props for CardFooter component

## Key Functionality

### Card Variants
- **Elevated**: White background with subtle shadow and border (default)
- **Outlined**: White background with prominent 2px border, no shadow

### Consistent Styling
- Border radius: rounded-xl (12px)
- Padding: 1.5rem (24px) horizontal, 1rem (16px) vertical
- Header/Footer separators: 1px border in neutral-200
- Footer includes flex layout with 0.5rem gap for buttons

### Component Structure
```tsx
<Card variant="elevated">
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Dependencies
- `@/lib/utils/cn` - Class name merging utility
- `react` - React framework

## Tests
- Location: Not yet created (tests to be added separately)
- Coverage: Pending

## Integration
- Used by: Various feature components requiring grouped content display
- Uses: cn() utility for class name merging

## Related
- Implements: Requirements F11 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 2: Base UI Components)
- Dependencies: Task F3 (Tailwind Theme), Task F4 (Utility Functions)

## Implementation Details

### Tailwind Classes Used
- Layout: `px-6`, `py-4`, `flex`, `gap-2`
- Borders: `border`, `border-2`, `border-t`, `border-b`, `border-neutral-200`
- Styling: `bg-white`, `rounded-xl`, `shadow-sm`

### Customization
All components accept `className` prop for additional styling via Tailwind classes. The `cn()` utility ensures proper class merging without conflicts.

### Accessibility
- Semantic HTML structure using div elements
- No specific ARIA roles (cards are presentational containers)
- Accepts all standard HTML div attributes via spread props
