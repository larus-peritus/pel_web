# PageLayout

## Location
`apps/peninganaedalifid/src/components/layout/PageLayout.tsx`

## Purpose
Provides a consistent page layout component with designated ad placement zones. Enables flexible ad configuration per page while maintaining responsive behavior and graceful handling of ad availability.

## Exports
- `interface PageLayoutProps` - TypeScript interface for component props
- `function PageLayout` - Main layout component with ad zones

## Key Functionality

### Layout Structure
- **Header Ad Zone**: Optional full-width ad banner below navigation
- **Main Content Area**: Flexible content area with optional sidebar
- **Sidebar Ad Zones**: Two ad slots (desktop only, hidden on mobile)
- **Footer Ad Zone**: Optional full-width ad banner above footer

### Responsive Behavior
- **Mobile (< 1024px)**: Single column layout, sidebar hidden
- **Desktop (≥ 1024px)**: Two-column layout with 300px fixed-width sidebar
- Sidebar ads use sticky positioning for better viewability
- All ad units use responsive formats

### Ad Zone Configuration
All ad zones are optional and controlled via props:
- `showHeaderAd`: Toggle header banner ad (default: false)
- `showSidebarAds`: Toggle sidebar ad slots (default: false)
- `showFooterAd`: Toggle footer banner ad (default: false)

### Ad Slot IDs
- Header banner: `"header-banner"` (horizontal format)
- Sidebar primary: `"sidebar-primary"` (rectangle format, 300x250)
- Sidebar secondary: `"sidebar-secondary"` (vertical format, 300x600)
- Footer banner: `"footer-banner"` (horizontal format)

Note: These are placeholder slot IDs and should be replaced with actual Google AdSense slot IDs when configured.

## Props

```typescript
interface PageLayoutProps {
  children: React.ReactNode;        // Main content to render
  showHeaderAd?: boolean;            // Show header ad zone (default: false)
  showSidebarAds?: boolean;          // Show sidebar ads (default: false)
  showFooterAd?: boolean;            // Show footer ad zone (default: false)
  className?: string;                // Additional CSS classes
}
```

## Dependencies
- `@/lib/utils` - cn() utility for className merging
- `@/lib/env` - Environment configuration for AdSense enablement
- `@/components/ads/AdUnit` - Ad unit component for rendering ads
- `@/components/layout/Container` - Container component for max-width content

## Integration
- Uses Container component for consistent max-width and padding
- Uses AdUnit component for all ad placements
- Checks `env.adsense.isEnabled` before rendering any ad zones
- Gracefully handles missing AdSense configuration (ads simply don't render)

## Usage Example

```tsx
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/layout/Section';

export default function CalculatorPage() {
  return (
    <PageLayout showHeaderAd showSidebarAds showFooterAd>
      <Section title="Life Energy Calculator">
        {/* Calculator content */}
      </Section>

      <Section title="Your Results">
        {/* Results content */}
      </Section>
    </PageLayout>
  );
}
```

## Styling Notes
- Uses Tailwind CSS 4 utility classes
- Sidebar has fixed width of 300px on desktop (standard ad size)
- Ad containers have subtle borders and background for visual separation
- Sticky positioning on sidebar for better ad viewability during scroll
- Responsive gap of 32px (gap-8) between content and sidebar

## Implementation Details
- Ad zones only render when `env.adsense.isEnabled` is true
- Each ad zone is wrapped in a semantic container with appropriate styling
- Sidebar uses `sticky top-4` for scroll-aware positioning
- Main content uses `flex-1 min-w-0` for proper flex behavior and text truncation
- Header and footer ad zones use full-width containers with neutral backgrounds

## Related
- Implements: Requirements US-F15 (Google AdSense Support) from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 6: Advertising & Analytics)
- Complements: Task F29 (AdSense Integration)
- Uses: Task F19 (Container Component)
