# Google Analytics Integration

## Location
- `apps/peninganaedalifid/src/components/analytics/GoogleAnalytics.tsx`
- `apps/peninganaedalifid/src/hooks/useAnalytics.ts`
- `apps/peninganaedalifid/src/components/analytics/index.ts`

## Purpose
Provides Google Analytics 4 (GA4) integration for tracking page views and custom events while respecting user privacy and never tracking sensitive financial data.

## Exports

### GoogleAnalytics Component
- **Type**: Client Component
- **Description**: Loads GA4 tracking scripts using Next.js Script component with optimal loading strategy
- **Behavior**: Only renders if `env.ga.isEnabled` is true (checked via environment configuration)

### useAnalytics Hook
- **Function**: `trackEvent(eventName: string, parameters?: Record<string, any>): void`
  - Tracks custom events with optional parameters
  - Safely checks for gtag availability before calling
  - Error handling prevents crashes if gtag fails

- **Function**: `trackPageView(url: string): void`
  - Tracks page view for a specific URL path
  - Updates GA configuration with current page path
  - Error handling for graceful degradation

## Key Functionality

### Script Loading
- Uses `next/script` with `strategy="afterInteractive"` for optimal performance
- Loads gtag.js from Google's CDN
- Initializes dataLayer and gtag function
- Auto-configures with GA measurement ID from environment

### Event Tracking
- Type-safe event tracking with TypeScript
- SSR-safe (checks for window object)
- Never tracks sensitive financial data (by design)
- Graceful error handling

### Page View Tracking
- Manual page view tracking support
- Can be used with Next.js navigation events
- Respects user privacy settings

## Dependencies
- `next/script` - Next.js Script component for optimal script loading
- `@/lib/env` - Type-safe environment configuration

## Configuration

### Environment Variables
Required in `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Accessed via `env.ga.id` and `env.ga.isEnabled` from `@/lib/env`

## Integration

### In Root Layout
Add GoogleAnalytics component to enable tracking:
```tsx
import { GoogleAnalytics } from '@/components/analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
```

### In Components
Track custom events:
```tsx
import { useAnalytics } from '@/hooks';

function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('button_click', { button_name: 'export_data' });
  };
}
```

### Route Tracking
Create a RouteTracker component (future task):
```tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks';

export function RouteTracker() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
```

## Privacy Considerations
- No sensitive financial data is ever tracked
- Only tracks user interactions (button clicks, navigation)
- Respects environment-based enablement
- Can be disabled by not setting NEXT_PUBLIC_GA_ID

## Type Safety

### Window Interface Extension
The hook properly extends the Window interface with gtag types:
```typescript
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}
```

## Related
- Implements: Requirement F28 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Analytics section)
- Uses: context/modules/EnvironmentConfig.md for configuration
