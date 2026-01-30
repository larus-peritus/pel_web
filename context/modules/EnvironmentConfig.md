# Environment Configuration

## Location
`apps/peninganaedalifid/src/lib/env.ts`

## Purpose
Provides type-safe access to environment variables for analytics and ads configuration with conditional feature flags.

## Exports
- `const env` - Immutable configuration object with type safety

## Key Functionality
- Google Analytics 4 configuration with enabled flag
- Google AdSense configuration with enabled flag
- Application version tracking with default fallback
- Type-safe environment variable access
- Conditional feature enablement based on environment variables

## Configuration Structure

### env.ga
- `id: string | undefined` - Google Analytics tracking ID from NEXT_PUBLIC_GA_ID
- `isEnabled: boolean` - True if GA_ID is set, false otherwise

### env.adsense
- `id: string | undefined` - Google AdSense publisher ID from NEXT_PUBLIC_ADSENSE_ID
- `isEnabled: boolean` - True if ADSENSE_ID is set, false otherwise

### env.app
- `version: string` - Application version from NEXT_PUBLIC_APP_VERSION, defaults to '0.1.0'

## Environment Variables
All environment variables are defined in:
- `.env.example` - Template with placeholder values
- `.env.local` - Local overrides (gitignored)
- `src/types/env.d.ts` - TypeScript type declarations

## Dependencies
- Next.js (process.env access)

## Tests
- Location: apps/peninganaedalifid/src/lib/__tests__/env.test.ts
- Coverage:
  - Property existence verification
  - isEnabled flag logic
  - Default value handling
  - Custom value override
  - Type safety and immutability

## Integration
- Used by: Analytics components (F28), AdSense components (F29)
- Uses: Next.js environment variable system

## Usage Example
```typescript
import { env } from '@/lib/env';

// Check if analytics is enabled
if (env.ga.isEnabled) {
  initializeGA(env.ga.id);
}

// Check if ads are enabled
if (env.adsense.isEnabled) {
  loadAdSense(env.adsense.id);
}

// Get app version
console.log(`App version: ${env.app.version}`);
```

## Related
- Implements: Requirements from specs/project-foundation/tasks.md (Task F32)
- Part of: specs/project-foundation/design.md
- Enables: Google Analytics (F28), AdSense (F29), Cookie Consent (F31)
