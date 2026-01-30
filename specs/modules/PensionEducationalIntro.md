# PensionEducationalIntro Component

## Location
`src/components/pensionAwareFire/PensionEducationalIntro.tsx`

## Purpose
Educational introduction component that explains why traditional FIRE calculations over-estimate savings needs in Iceland due to the three-tier pension system. Provides comprehensive education about séreign, lífeyrissjóður, and TR ellilífeyrir, along with concrete examples showing significant savings (106M ISK in the example).

## Exports
- `interface PensionEducationalIntroProps` - Component props interface
- `function PensionEducationalIntro` - Main component

## Props

```typescript
interface PensionEducationalIntroProps {
  /** Whether the intro is collapsed */
  collapsed: boolean;
  /** Callback when user toggles collapsed state */
  onToggle: () => void;
  /** Callback when user dismisses the intro */
  onDismiss: () => void;
  /** Optional className for styling */
  className?: string;
}
```

## Key Functionality

### Educational Sections

The component presents four comprehensive sections:

#### 1. "Af hverju hefðbundin FIRE-tala er of há" (Why traditional FIRE is too high)
- Explains traditional 25-30x multiplier approach
- Highlights how it ignores Icelandic pension system
- Shows the "over-saving" problem
- Visual alerts explaining the issue

#### 2. "Íslenska lífeyriskerfið" (The Icelandic pension system)
- **Séreign (60+ ára)**: Private pension, NOT means-tested, accessible from age 60
- **Lífeyrissjóður (62-67+ ára)**: Occupational pension, starts between 62-67
- **TR Ellilífeyrir (67+ ára)**: State pension, means-tested (45% reduction above 36,500 ISK/month)
- Includes important note that séreign withdrawals don't count against TR

#### 3. "Þrjú stig eftirlaunaáætlunar" (Three phases of retirement planning)
- **Stig 1: Gap tímabil** (Retirement → 60): Fully self-funded period
- **Stig 2: Séreign brú** (60-67): Bridge period with private pension help
- **Stig 3: Fullur lífeyrir** (67+): Full pension period with all sources active
- Color-coded to match phase visualization (red → amber → green)

#### 4. "Dæmi: Hvernig þetta sparar milljónir" (Example: How this saves millions)
- Concrete example: Jón, 35 years old, retiring at 50
- Traditional FI: 144,000,000 ISK (30x × 400k/month expenses)
- Pension-Adjusted FI: 38,000,000 ISK
- **Savings: 106,000,000 ISK (73% less!)**
- Detailed breakdown of all three phases

### Interactive Features

- **Collapsible Main Card**: Can be collapsed/expanded via header
- **Section Expansion**: Each of 4 sections can be individually expanded/collapsed
- **Expand/Collapse All**: Buttons to quickly show or hide all sections
- **Dismiss Forever**: Allows users to hide the intro permanently (via callback)
- **Starts Collapsed**: All sections collapsed by default for cleaner initial view

### Styling & Theme

- **Blue/Indigo Color Scheme**: Matches pension/planning theme
  - Blue accents for general content
  - Indigo for insights
  - Red for gap phase
  - Amber for bridge phase
  - Green for full pension phase
- **Border**: 2px blue-200 border
- **Card Shadow**: Medium shadow for depth
- **Gradient Backgrounds**: Used in example section for visual appeal

## Dependencies

### Internal
- `@/components/ui/Card` - Card and CardContent
- `@/components/ui/Button` - Action buttons
- `@/components/ui/Alert` - Info alerts
- `@/lib/utils` - cn utility and formatCurrency

### External
- React (useState for section expansion state)

## Tests

- **Location**: `tests/components/pensionAwareFire/PensionEducationalIntro.test.tsx`
- **Test Suites**: 7 (Rendering, Collapsible Behavior, Section Expansion, Dismiss Functionality, Content Accuracy, Accessibility, Footer Note)
- **Tests**: 21 total, all passing
- **Coverage**:
  - Rendering with collapsed/expanded states
  - Toggle functionality
  - Individual section expansion/collapse
  - Expand all / collapse all
  - Dismiss callback
  - Content accuracy (pension system info, phases, example calculations)
  - Accessibility (ARIA attributes, labels, controls)
  - Footer disclaimer display

## Integration

### Used By
- Will be used by `PensionAwareFIRECalculator` main component (Task 7.1)

### Uses
- UI components (Card, Button, Alert)
- Utility functions (cn, formatCurrency)

## Design Pattern

Follows the same collapsible educational intro pattern as:
- `src/components/leanFire/EducationalIntro.tsx`

Key differences:
- Blue/indigo theme (vs green for LeanFIRE)
- Focus on pension system education (vs lifestyle education)
- Concrete savings example (106M ISK)
- More technical content about pension means-testing

## Content Accuracy

All information verified against:
- Icelandic pension system documentation
- TR means-testing rules (36,500 ISK exemption, 45% reduction rate)
- Pension ages (60 for séreign, 62-67 for lífeyrissjóður, 67 for TR)
- Example calculations match design document

## Accessibility

- Proper ARIA labels for all interactive elements
- aria-expanded attributes for collapsible sections
- aria-controls linking buttons to content sections
- Role attributes for decorative icons
- Semantic HTML (h2, h3, ul, li)
- Keyboard navigable (all buttons)

## Related

- **Implements**: Requirements NFR-2 from `specs/requirements-pension-aware-fire.md`
- **Part of**: Epic 5 (Core Input Components) from `specs/tasks-pension-aware-fire.md`
- **Task**: 5.3 - PensionEducationalIntro Component
- **Feature Design**: `specs/design-pension-aware-fire.md`

## Notes

- Starts with all sections collapsed by default (different from LeanFIRE which starts expanded)
- Example shows 73% reduction in FI number - this dramatic difference is key to user understanding
- Séreign exclusion from TR means-testing is highlighted as it's a common misconception
- All monetary amounts use formatCurrency for consistent ISK formatting
- Footer includes disclaimer about simplified models and need for professional advice
