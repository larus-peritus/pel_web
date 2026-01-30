# AWHPrompt Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/AWHPrompt.tsx`

## Purpose
Prompts users to calculate their Actual Hourly Wage (AWH) to unlock the life energy display feature in the FI Number Builder. Explains the benefits of AWH calculation and provides a link to the AWH calculator.

## Component Type
React functional component (promotional/informational component)

## Props
None - component is self-contained

## Key Functionality

### Display Features
- **Info Alert**: Blue info-style alert explaining benefits
- **Benefits List**: Four key benefits of calculating AWH
- **Action Buttons**: Primary CTA to AWH calculator, secondary dismiss button
- **Expandable Details**: Collapsible section explaining AWH concept
- **Dismissible**: Can be permanently dismissed during session

### User Interactions
- **Calculate AWH**: Links to `/raunverulegt-timakaup` (AWH calculator)
- **Dismiss Options**:
  - X button in alert header
  - "Ekki núna" (Not now) button
- **Learn More**: Expandable `<details>` section with detailed explanation

## State Management
- `isDismissed` - Local state (useState) tracks if user dismissed the prompt
- When dismissed, component returns `null` and is removed from DOM

## Dependencies

### Internal
- `@/components/ui/Alert` - Alert component for info-style messaging
- `next/link` - Link component for navigation

### External
- React - useState hook for dismiss state

## Styling
- Info variant alert (primary blue color scheme)
- Highlighted benefits box with primary-100 background
- Responsive button layout (stacks on mobile, row on desktop)
- Hover and focus states on interactive elements
- Smooth transitions on state changes

## Accessibility
- Alert has proper `role="alert"` for screen readers
- Dismiss button has `aria-label="Dismiss alert"`
- All buttons keyboard navigable
- Focus visible styles on interactive elements
- Semantic HTML with proper heading hierarchy

## Integration

### Used By
- `ResultsDisplay` component (conditionally when AWH not available)

### Navigation
- Links to `/raunverulegt-timakaup` page (AWH calculator)

## Related
- Implements: Requirement US-5 from specs/fi-number-builder/requirements-fi-number-builder.md
- Part of: Epic 6 (Life Energy Display) in specs/fi-number-builder/tasks-fi-number-builder.md
- Complements: `LifeEnergyDisplay` component (unlocks that feature)

## Testing
- Location: tests/components/fiNumber/AWHPrompt.test.tsx
- Coverage: 22 test cases covering rendering, dismissal, expandable details, styling, accessibility, and navigation
- All tests passing

## Example Usage

```tsx
{/* Show AWH prompt if AWH is not available */}
{!lifeEnergy && fiNumber > 0 && (
  <AWHPrompt />
)}
```

## Educational Content

### Main Message
Explains how AWH calculation enables seeing FI number in terms of life energy (years of work)

### Benefits Highlighted
1. How many years of work FI number represents
2. How many years remaining to reach FI
3. Visual progress toward financial independence
4. Motivational messages based on progress

### Detailed Explanation (Expandable)
- Definition of Actual Hourly Wage (AWH)
- Reference to "Your Money or Your Life" book
- Explanation of work-related expenses and time
- Insight that AWH is typically 20-40% lower than expected

## Implementation Notes
- Dismissal is session-based (reappears on page reload)
- All text in Icelandic for app consistency
- Primary action (Calculate AWH) visually prominent
- Secondary action (Not now) less visually prominent
- Details section collapsed by default to avoid overwhelming

## Design Decisions
- Made dismissible to respect user choice
- Included detailed explanation for curious users
- Used info variant (not warning) to avoid alarm
- Emphasized benefits before asking for action
- Provided "Not now" option to reduce pressure

## Future Enhancements
- Store dismissal state in localStorage for persistence
- Add "Don't show again" checkbox option
- Track conversion rate (how many click through)
- A/B test different messaging approaches
- Add testimonials about AWH usefulness
