# Pension-Aware FIRE Calculator Page

## Location
`src/app/lifeyristengd-fire/page.tsx` (Server Component)
`src/app/lifeyristengd-fire/LifeyristengdFIREClient.tsx` (Client Component)

## Purpose
Next.js page route that provides access to the Pension-Aware FIRE Calculator at `/lifeyristengd-fire`. Implements server-side metadata for SEO and wraps the calculator in a client component with proper state management.

## Route
`/lifeyristengd-fire`

## Metadata (SEO)
- **Title**: "Lífeyristengd FIRE Reiknivél | Peningaæðalífið"
- **Description**: "Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins. Sjáðu hvernig séreign, lífeyrissjóður og TR lífeyrir hafa áhrif á sparnaðarþörf þína."
- **Keywords**: FIRE, FI, fjárhagslegt frelsi, lífeyrir, séreign, lífeyrissjóður, TR, ellilífeyrir, eftirlaunaáætlun, Ísland
- **Open Graph**: Enhanced social media preview with calculator description

## Architecture

### Server Component (page.tsx)
- Exports metadata for SEO
- Renders the client component wrapper
- No client-side JavaScript in the page component itself

### Client Component (LifeyristengdFIREClient.tsx)
- Wraps calculator in `CalculatorProvider` for state management
- Includes `Suspense` boundary with loading fallback
- Renders `PensionAwareFIRECalculator` main component
- Adds privacy notice section at bottom

## Key Features

### Loading State
- Custom loading fallback with skeleton UI
- Blue/indigo gradient matching calculator theme
- Responsive skeleton layout (hero + content sections)

### Privacy Notice
- Displayed at bottom of page
- Explains that calculations happen in browser
- Data stored locally, never sent to server

### State Management Integration
- Wrapped in `CalculatorProvider`
- Provides context to entire calculator tree
- Enables localStorage persistence
- Manages expense baseline integration

## Component Structure
```tsx
<CalculatorProvider>
  <Suspense fallback={<LoadingFallback />}>
    <PensionAwareFIRECalculator />
    <section> {/* Privacy Notice */} </section>
  </Suspense>
</CalculatorProvider>
```

## Dependencies

### Internal Dependencies
- `@/context/CalculatorContext` - State management
- `@/components/pensionAwareFire` - Main calculator component
- `@/components/layout/Container` - Layout wrapper

### Next.js Features
- App Router (Next.js 13+)
- Server Components for metadata
- Client Components for interactivity
- Suspense boundaries for loading states

## Testing
- Location: `tests/app/lifeyristengd-fire/page.test.tsx`
- 5 tests passing
- Coverage:
  - CalculatorProvider rendering
  - PensionAwareFIRECalculator integration
  - Privacy notice display
  - Container layout usage
  - Suspense boundary presence

## Test Coverage
- Component rendering: ✅
- Privacy notice: ✅
- State management wrapper: ✅
- Layout components: ✅
- Loading fallback: ✅

## Integration

### Calculator Hub
- Will be added in Task 8.2 (navigation integration)
- Badge: "Nýtt" (New)
- Category: FIRE calculators

### URL Structure
- Route: `/lifeyristengd-fire`
- Path translates to: "Pension-Connected FIRE" in Icelandic

## Related

### Implements
- Task 7.2 from `specs/tasks-pension-aware-fire.md`
- Requirements: NFR-4 (User Experience) from `specs/requirements-pension-aware-fire.md`

### Uses
- Main Component: `src/components/pensionAwareFire/PensionAwareFIRECalculator.tsx`
- Context: `context/modules/PensionAwareFIRECalculator.md`

### Pattern
Follows the same server/client component split pattern as:
- `src/app/eftirlaunahermir/page.tsx` (Retirement Simulator)
- Other calculator pages in the app

## User Experience

### First Load
1. Server renders metadata (instant SEO)
2. Client component hydrates
3. Loading fallback shows while React initializes
4. Calculator loads with default state or restored state from localStorage

### Performance
- Metadata available immediately (SSR)
- Calculator code split for optimal loading
- Suspense prevents blocking on initial load
- State hydrates from localStorage on mount

## Privacy & Security
- All calculations client-side
- No server requests for calculation data
- localStorage used for persistence (client-only)
- Privacy notice prominently displayed

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels inherited from calculator component
- Keyboard navigation supported

## Browser Support
- Modern browsers (ES2020+)
- Requires JavaScript for calculator functionality
- Graceful degradation with loading states

## Implementation Notes

### 2026-01-30 - Initial Implementation
- Created server component with metadata export
- Created client wrapper with CalculatorProvider
- Added Suspense boundary with loading fallback
- Implemented 5 comprehensive tests (all passing)
- No TypeScript compilation errors
- Route accessible at `/lifeyristengd-fire`

### Design Decisions
- **Server/Client Split**: Metadata on server, interactivity on client (optimal for SEO + UX)
- **Suspense Boundary**: Prevents blank screen during hydration
- **Loading Skeleton**: Matches calculator theme (blue/indigo gradient)
- **Privacy Notice**: Consistent with other calculator pages

## Future Enhancements
- Will be added to navigation in Task 8.2
- May add breadcrumbs for navigation context
- Could add social sharing features
- Potential for calculator hub integration
