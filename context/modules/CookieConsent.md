# CookieConsent Component

## Location
`apps/peninganaedalifid/src/components/CookieConsent.tsx`

## Purpose
Displays a cookie consent banner for GDPR compliance, allowing users to accept or decline analytics and personalized advertising cookies. Stores user preference in localStorage and controls Google Analytics consent mode.

## Exports

### Component
- `CookieConsent` - React component that renders the consent banner

### Functions
- `getConsentStatus(): ConsentStatus` - Returns current consent status ('accepted' | 'declined' | 'pending')

### Types
- `ConsentStatus` - Type alias for consent states: 'accepted' | 'declined' | 'pending'

## Key Functionality

### Display Logic
- Shows banner only on first visit (when consent status is 'pending')
- Hidden if user has previously accepted or declined
- SSR-safe with loading state during hydration
- Fixed position at bottom of screen
- Smooth slide-in animation

### Consent Management
- Stores preference in localStorage with key 'cookie-consent'
- Integrates with Google Analytics Consent Mode (gtag)
- Updates consent signals for analytics and ad personalization
- Accepts: Grants all consent (analytics_storage, ad_storage, ad_user_data, ad_personalization)
- Declines: Denies all consent

### User Interface
- Accept and Decline buttons using Button component
- Clear message about cookie usage and privacy
- Link to privacy information
- Responsive layout (stacked on mobile, inline on desktop)
- Accessible with ARIA attributes (role="dialog", aria-live, aria-label)

## Dependencies
- `@/components/ui/Button` - For action buttons
- `@/lib/utils` - For cn() utility
- `localStorage` - For persistence (direct usage, not useLocalStorage hook)

## Integration

### Usage in Root Layout
```tsx
import { CookieConsent } from '@/components/CookieConsent';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
```

### Checking Consent Status
```tsx
import { getConsentStatus } from '@/components/CookieConsent';

const status = getConsentStatus();
if (status === 'accepted') {
  // Initialize analytics
}
```

## Styling
- Fixed positioning at bottom of viewport (z-50)
- White background with top border and shadow
- Responsive padding and layout
- Slide-in animation from bottom
- Uses Tailwind CSS 4 theme colors

## Accessibility
- Role="dialog" for semantic meaning
- aria-live="polite" for screen reader announcements
- aria-label for context
- Keyboard accessible buttons
- Focus ring on privacy link

## Google Analytics Integration
- Uses gtag consent API if available
- Updates consent mode on accept/decline
- Gracefully handles missing gtag (no errors)
- Supports Analytics Storage, Ad Storage, Ad User Data, and Ad Personalization

## Related
- Implements: Requirement from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Cookie Consent section)
- Task: F31 from specs/project-foundation/tasks.md
- Uses: Button component (context/modules/Button.md)
- Uses: cn utility (context/modules/UtilityFunctions.md)

## Technical Notes
- Client component ('use client') for browser-only functionality
- Direct localStorage access instead of useLocalStorage hook for simplicity
- Window.gtag type declaration included for TypeScript
- No external dependencies beyond project utilities
- Minimal bundle size impact
