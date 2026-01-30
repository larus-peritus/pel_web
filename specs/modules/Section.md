# Section Component

## Location
`apps/peninganaedalifid/src/components/layout/Section.tsx`

## Purpose
Provides consistent vertical spacing and optional headers for major page sections. Ensures clean visual separation between different content areas.

## Exports
- `function Section(props: SectionProps)` - Main section component with optional title and description

## Key Functionality
- Consistent vertical spacing (`py-8` mobile, `py-12` desktop)
- Optional section title (h2 heading)
- Optional section description (paragraph text)
- Custom className support via `cn()` utility
- Clean section separation for page organization

## Props Interface
```typescript
interface SectionProps {
  children: React.ReactNode;
  title?: string;          // Optional section title
  description?: string;    // Optional section description
  className?: string;      // Additional CSS classes
}
```

## Usage Example
```tsx
import { Section } from '@/components/layout/Section';

// Basic section with content only
<Section>
  <div>Content here</div>
</Section>

// Section with title and description
<Section
  title="Calculator Results"
  description="Your actual hourly wage and life energy calculations"
>
  <ResultsDisplay />
</Section>

// Section with custom styling
<Section className="bg-white" title="Overview">
  <OverviewContent />
</Section>
```

## Styling
- Vertical padding: `py-8` (mobile), `py-12` (medium and up)
- Title: `text-2xl font-bold text-neutral-900 mb-2`
- Description: `text-neutral-600 text-base`
- Header spacing: `mb-6` when title or description present

## Dependencies
- `@/lib/utils/cn` - Class name merging utility

## Integration
- Used by: Page layouts for section organization
- Part of: Layout component family (Container, Header, Footer, Section)

## Related
- Implements: Requirements F-RL-002 (Responsive layout system) from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md - Part 3: Layout Components
- Task: F20 from specs/project-foundation/tasks.md

## Accessibility
- Uses semantic `<section>` element
- Proper heading hierarchy with `<h2>` for titles
- Text contrast meets WCAG guidelines (neutral-900 on white, neutral-600 for descriptions)
