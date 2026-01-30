# FIRETypeDetailModal Component

## Location
`src/components/fireTypes/FIRETypeDetailModal.tsx`

## Purpose
Full-screen modal dialog showing comprehensive details about a specific FIRE type. Includes all information from definitions plus real-world examples, common pitfalls, and learning resources.

## Key Features
- Full FIRE type details (name, tagline, description)
- Icon and color-coded header
- Pros and cons sections with icons
- "Best for" and "Not for" sections
- Real-world Icelandic examples with ISK amounts
- Common pitfalls for each FIRE type
- Learning resources (mostly English but applicable to Iceland)
- Close functionality (X button, footer button, overlay click, Escape key)
- Body scroll prevention when modal open
- Mobile-friendly responsive layout
- Keyboard accessible (Tab, Escape)

## Exports
- `FIRETypeDetailModal` - Main component

## Props
```typescript
interface FIRETypeDetailModalProps {
  definition: FIRETypeDefinition | null;  // FIRE type definition (null = don't render)
  onClose: () => void;                     // Close callback
}
```

## Helper Functions
- `formatISK(amount: number)` - Formats ISK currency

## Data Sources
Hardcoded educational content for each FIRE type:
- `PITFALLS` - Common pitfalls mapped by FIRE type ID
- `RESOURCES` - Learning resources mapped by FIRE type ID

## Pitfalls Covered
- LeanFIRE: Underestimating costs, social isolation, inflation, health costs
- RegularFIRE: Time needed, lifestyle inflation, optimistic returns, taxes
- CoastFIRE: Part-time work costs, growth expectations, job stability
- BaristaFIRE: Part-time work stress, job availability, wage differences
- FatFIRE: Continued lifestyle inflation, investment risk, market protection

## Resources
- Reddit communities (r/leanfire, r/financialindependence, r/coastfire, etc.)
- Blogs (Mr. Money Mustache, Mad Fientist, etc.)
- Books (Your Money or Your Life, The Simple Path to Wealth, etc.)
- Podcasts and tools

## Close Mechanisms
1. X button in header (aria-label="Loka")
2. "Loka" button in footer
3. Clicking overlay background
4. Pressing Escape key

## Body Scroll Management
- Sets `document.body.style.overflow = 'hidden'` when modal opens
- Resets to `'unset'` when modal closes or unmounts
- Cleanup in useEffect

## Dependencies
- `@/components/ui/Button` - Close button
- `@/components/ui/Badge` - Tagline badge
- `@/types/fireTypes` - Type definitions
- `lucide-react` - Icons (X, AlertTriangle, BookOpen, Users, TrendingUp)

## Tests
- Location: tests/components/fireTypes/FIRETypeDetailModal.test.tsx
- Coverage: 39 tests covering rendering, sections, close functionality, body overflow, color schemes, accessibility, responsive layout

## Related
- Implements: Epic 3, Task 3.3 (specs/fire-type-explorer/)
- Triggered by: FIRETypeCard "Learn more" button
- Uses: FIRE_TYPE_DEFINITIONS from lib/constants/fireTypes
