# EducationalPanel

## Location
`apps/peninganaedalifid/src/components/fiNumber/EducationalPanel.tsx`

## Purpose
Provides comprehensive educational content about Financial Independence (FI) concepts, withdrawal rates, and Icelandic-specific considerations. Implements Task 7.1 from Epic 7 of the FI Number Builder feature.

## Exports
- `EducationalPanel` - React component displaying collapsible educational sections
- `EducationalPanelProps` - TypeScript interface for component props

## Key Functionality

### Main Features
- **Four Collapsible Sections**: Each section can be expanded/collapsed independently
  1. "Hvað er FI-tala?" - Explains Financial Independence Number concept
  2. "Hvað er úttektarhlutfall?" - Explains withdrawal rates (4%, 3.33%, 3%)
  3. "Af hverju þarf íhaldssamara hlutfall á Íslandi?" - Iceland-specific context
  4. "Algengar spurningar" - FAQ section with external resource links

- **Educational Content**:
  - FI number formula explanation with examples
  - Trinity Study reference (4% rule origin)
  - Iceland inflation context (3-4% vs US 2-3%)
  - Currency risk and market size considerations
  - Pension system advantages in Iceland
  - Real-world examples and calculations

- **Interactive Design**:
  - Collapsible/expandable sections with smooth transitions
  - First section expanded by default for immediate value
  - Chevron icon rotation indicates section state
  - Mobile-responsive layout

- **External Resources**:
  - Links to Mr. Money Mustache (FIRE movement pioneer)
  - r/financialindependence subreddit
  - Bogleheads forum (investment wisdom)
  - All links open in new tab with security attributes

## Dependencies

### UI Components
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `cn` utility from `@/lib/utils`

### React
- `useState` for collapsible state management

## Usage Example

```tsx
import { EducationalPanel } from '@/components/fiNumber/EducationalPanel';

function FINumberBuilder() {
  return (
    <div>
      <h1>FI-tala reiknivél</h1>

      {/* Calculator components here */}

      {/* Educational content at bottom */}
      <EducationalPanel />
    </div>
  );
}
```

## Props

```typescript
interface EducationalPanelProps {
  /** Additional CSS classes */
  className?: string;
}
```

## Implementation Details

### CollapsibleSection Sub-component
- Internal component for individual collapsible sections
- Manages own expanded/collapsed state
- Accessible with proper ARIA attributes
- Smooth transitions and visual feedback

### Content Structure
Each section contains:
- Clear Icelandic headings
- Well-formatted explanatory text
- Code-style boxes for formulas
- Highlighted recommendations
- Color-coded information boxes (primary blue, warning amber, success green)

### Icelandic Context
Emphasizes Iceland-specific factors:
- **Higher inflation**: 3-4% vs US 2-3%
- **Currency risk**: ISK volatility
- **Smaller market**: Limited domestic investment options
- **Strong pension system**: Lífeyrissjóður as advantage

### Recommendations
- Recommends 30x or 33x multiplier (vs US standard 25x)
- Explains why 4% rule may be too aggressive for Iceland
- Encourages inclusion of pension income in calculations

## Tests
- Location: `apps/peninganaedalifid/tests/components/fiNumber/EducationalPanel.test.tsx`
- Coverage: 44 tests, all passing
- Test categories:
  - Rendering (headers, sections, default states)
  - Collapsible functionality (expand, collapse, multiple sections)
  - Content verification (all four sections)
  - Accessibility (ARIA attributes, semantic structure)
  - Styling (icons, custom classes, transitions)

## Related Components
- `IcelandicContextAlert` - Shows contextual warnings
- `MultiplierSelector` - Has educational explanations too
- `FINumberBuilderCalculator` - Main parent component

## Requirements Fulfilled
- **FR-7.1**: Explain what FI Number means
- **FR-7.2**: Explain 4% rule origin (Trinity Study)
- **FR-7.3**: Explain why Iceland needs more conservative rate
- **FR-7.4**: Link to additional resources
- **US-3**: Adjust for Icelandic context (educational component)

## Design Notes
- Card-based layout with outlined variant for visual distinction
- Book icon in header to indicate educational content
- First section expanded by default to provide immediate value
- Consistent with app's Icelandic-first approach
- Mobile-responsive with proper text sizing and spacing

## Future Enhancements
- Add interactive examples/calculators within sections
- Include charts showing historical inflation comparison
- Add video content or animations
- Translate to English for international users
- Track which sections users engage with most
