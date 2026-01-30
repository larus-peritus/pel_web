# HomePage

## Location
`apps/peninganaedalifid/src/app/page.tsx`

## Purpose
Home page for the Life Energy Calculator application with hero section, calculator placeholder, and feature highlights.

## Exports
- `default function Home()` - Next.js page component for the home route

## Key Functionality
- Hero section with site title "Life Energy Calculator"
- Subtitle: "Discover your true hourly wage and take control of your life energy"
- Description of app purpose based on "Your Money or Your Life" by Vicki Robin
- Calculator placeholder card with "Calculator Coming Soon" message
- Three feature highlights:
  - Private & Secure: Data stays on device
  - Accurate Calculations: Factors in all work-related costs
  - Life Energy Insights: Understand purchase costs in hours worked

## Dependencies
- `@/components/layout/Container` - For responsive max-width containers
- `@/components/layout/Section` - For consistent vertical spacing
- `@/components/ui/Card` - For elevated card styling (CardContent subcomponent)

## Styling
- Uses Tailwind CSS 4 utility classes
- Theme colors from globals.css (primary, success, warning, neutral)
- Responsive design with mobile-first breakpoints (md, lg)
- Gradient background on hero: `from-primary-50 to-neutral-50`
- SVG icons for visual elements (inline, from Heroicons outline set)

## Layout Structure
1. Hero Section (gradient background)
   - Large heading with responsive text sizes
   - Subtitle and description
   - Centered content with max-width constraints

2. Calculator Placeholder Section
   - Card component with elevated variant
   - Centered content with large padding
   - Calculator icon (SVG)
   - "Coming Soon" message
   - Animated "Work in progress" indicator

3. Feature Highlights Section (white background)
   - 3-column grid on desktop (single column on mobile)
   - Icon, heading, and description for each feature
   - Color-coded icons (success, primary, warning)

## Responsive Behavior
- Text scales: 4xl → 5xl → 6xl on larger screens
- Hero padding: py-8 → py-16 on medium+
- Card padding: py-12 → py-20 on medium+
- Grid layout: single column → 3 columns at md breakpoint
- Container padding: 4 → 6 → 8 (handled by Container component)

## Accessibility
- Semantic HTML structure (h1, h2, h3 hierarchy)
- ARIA labels on decorative SVG icons (`aria-hidden="true"`)
- Proper heading structure for screen readers
- Color contrast meets WCAG standards

## Tests
- Location: N/A (per instructions, tests handled separately)
- Coverage: Page rendering, responsive layout

## Integration
- Used by: Next.js App Router as root page (/)
- Uses: Container, Section, Card components from foundation
- Part of: Project Foundation feature

## Related
- Implements: Requirement REQ-F-3 from specs/project-foundation/requirements.md
- Follows: Home page design from specs/project-foundation/design.md
- Task: F25 from specs/project-foundation/tasks.md

## Implementation Notes
- Calculator placeholder ready for future calculator component integration
- Feature highlights communicate app value proposition
- Privacy messaging prominent to build user trust
- Book attribution included in description per design requirements
