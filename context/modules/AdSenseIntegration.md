# AdSense Integration

## Location
- `apps/peninganaedalifid/src/components/ads/AdSenseScript.tsx`
- `apps/peninganaedalifid/src/components/ads/AdUnit.tsx`
- `apps/peninganaedalifid/src/components/ads/index.ts`

## Purpose
Provides Google AdSense integration components for monetization through display advertising.

## Exports
- `AdSenseScript` - Component to load AdSense script in document head
- `AdUnit` - Component to render individual ad units
- `AdUnitProps` - TypeScript interface for AdUnit props

## Key Functionality

### AdSenseScript Component
- Loads Google AdSense script using Next.js Script component
- Uses `strategy="afterInteractive"` for optimal performance
- Only renders if `env.adsense.isEnabled` is true
- Loads script with client ID from `env.adsense.id`
- Async and cross-origin enabled for security

### AdUnit Component
- Renders individual ad placement with `<ins>` element
- Props:
  - `slot: string` - Ad slot ID from AdSense dashboard
  - `format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'` - Ad format type (default: 'auto')
  - `className?: string` - Additional CSS classes
- Graceful ad blocker handling via try-catch
- Automatic collapse if ad fails to load (CSS-based)
- Only renders if AdSense is enabled
- Pushes to `adsbygoogle` queue on mount
- Full-width responsive ads by default

## Dependencies
- Next.js `next/script` - For optimal script loading
- `@/lib/env` - Environment configuration
- `@/lib/utils` - cn() utility for class merging
- React (useEffect, useRef) - For client-side ad initialization

## Tests
Tests will be handled separately (not included in this task).

## Integration
- Used by: Layout components for ad placement zones (F30)
- Uses: Environment configuration (env.adsense.id, env.adsense.isEnabled)
- Related to: PageLayout component, Cookie Consent (F31)

## Usage Example

### In Root Layout
```typescript
import { AdSenseScript } from '@/components/ads';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <AdSenseScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Individual Ad Placements
```typescript
import { AdUnit } from '@/components/ads';

export function HomePage() {
  return (
    <div>
      {/* Header banner ad */}
      <AdUnit slot="1234567890" format="horizontal" className="mb-4" />

      {/* Main content */}
      <main>...</main>

      {/* Sidebar ad */}
      <aside>
        <AdUnit slot="0987654321" format="rectangle" />
      </aside>
    </div>
  );
}
```

## Design Patterns
- Client components (use client directive) for browser-only code
- Conditional rendering based on environment configuration
- Graceful degradation when ads fail to load
- SSR-safe with useEffect for client-side initialization
- Type-safe with TypeScript interfaces

## Ad Placement Recommendations
From design document:
- Header zone: 728x90 / Responsive banner
- Sidebar zones: 300x250 or 300x600 (desktop only)
- In-content zones: Between major sections
- Footer zone: 728x90 / Responsive banner
- Mobile: 320x100 responsive banners, no sidebar

## Related
- Implements: Requirements F29 from specs/project-foundation/tasks.md
- Part of: specs/project-foundation/design.md (Part 6: Advertising & Analytics)
- Depends on: Environment Configuration (F32)
- Enables: Page Layout with Ad Zones (F30)
