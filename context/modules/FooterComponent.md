# Footer Component

## Location
`apps/peninganaedalifid/src/components/layout/Footer.tsx`

## Purpose
Displays the site footer with privacy statement, book attribution, and version information. Provides transparency about data privacy and credits the source material.

## Exports
- `function Footer({ className }: FooterProps)` - Footer component

## Key Functionality
- Displays privacy statement: "Your data stays on your device. We never see your financial information."
- Shows book attribution: "Inspired by Your Money or Your Life by Vicki Robin"
- Displays version number from environment configuration
- Supports custom className for styling overrides
- Uses cn() utility for class name merging
- Minimal, clean design with proper text hierarchy

## Props
```typescript
interface FooterProps {
  className?: string;  // Optional additional CSS classes
}
```

## Dependencies
- `@/lib/utils` - cn() utility for class name merging
- `@/lib/env` - env object for app version

## Styling
- Tailwind CSS v4 utility classes
- Responsive container with max-width
- Text hierarchy with different neutral shades:
  - Privacy statement: neutral-700, font-medium
  - Book attribution: neutral-500
  - Version: neutral-400, text-xs
- Border-top separator
- Vertical spacing with py-8
- Horizontal spacing with px-4

## Integration
- Used by: Root layout (when implemented in Task F24)
- Uses: UtilityFunctions module, EnvironmentConfig module

## Related
- Implements: Requirement REQ-FOUNDATION-15 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 3: Layout Components)
- Task: F18 from specs/project-foundation/tasks.md
