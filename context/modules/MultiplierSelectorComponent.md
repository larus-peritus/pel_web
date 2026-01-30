# MultiplierSelector Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/MultiplierSelector.tsx`

## Purpose
React component for selecting FI (Financial Independence) number multiplier. Allows users to choose from standard multipliers (25x, 30x, 33x) or use a custom value (20x-50x range). Displays withdrawal rates, badge indicators, and Icelandic context warnings.

## Exports

### `MultiplierSelector`
Main component for multiplier selection interface.

**Props:**
- `multiplier: number` - Current multiplier value (25, 30, 33, or custom)
- `onMultiplierChange: (multiplier: number) => void` - Callback when multiplier changes
- `className?: string` - Additional CSS classes

### Internal Components

#### `MultiplierButton`
Individual button for standard multiplier selection with badge indicator.

**Props:**
- `multiplier: StandardMultiplier` - The multiplier value (25 | 30 | 33)
- `isSelected: boolean` - Whether this multiplier is currently selected
- `onClick: () => void` - Click handler

## Key Functionality

### Standard Multiplier Buttons
- Three buttons for 25x, 30x, and 33x multipliers
- Each shows withdrawal rate (e.g., "4,0% úttekt" for 25x)
- Badge indicators:
  - 25x: Warning badge "Áhættusamt" (risky for Iceland)
  - 30x: Success badge "Mælt með" (recommended for Iceland)
  - 33x: Info badge "Varfærið" (conservative)
- Selected button highlighted with primary color and ring

### Custom Multiplier Slider
- Slider for range 20x-50x (from `MULTIPLIER_RANGE`)
- Shows current value with withdrawal rate
- "Í notkun" / "Nota sérsniðið" toggle button
- Dynamic value display with Icelandic number formatting

### Icelandic Context Warning
- Displays warning when multiplier < 28 (from `MULTIPLIER_WARNING_THRESHOLD`)
- Explains Iceland's higher inflation (3-4% vs US 2-3%)
- Recommends 30x or 33x for safer FI
- Warning icon and amber color scheme

### Collapsible Explanation Section
- Expandable educational content about multipliers
- Explains:
  - What is a multiplier?
  - What is withdrawal rate?
  - Why 30x is recommended for Iceland
  - Trinity Study reference (1998)
  - Icelandic inflation context

## Visual Design

### Layout
- Card component with elevated variant
- Header with title and subtitle
- Three-column grid for standard multiplier buttons (responsive)
- Slider section with labels and value display
- Warning alert (conditional)
- Collapsible explanation with chevron icon

### Color Scheme
- Primary blue for selected button
- Warning amber for 25x badge and warning alert
- Success green for 30x badge
- Info blue for 33x badge
- Neutral gray for unselected buttons

### Responsive Behavior
- Grid adapts on mobile (3 columns maintained but smaller)
- Slider fills full width
- Text wraps appropriately
- Touch-friendly button sizes

## Dependencies

### UI Components
- `Card`, `CardHeader`, `CardContent` - Card layout structure
- `Button` - Standard multiplier buttons
- `Slider` - Custom multiplier input
- `Badge` - Multiplier indicators
- `cn` - Class name utility

### Constants (from `@/lib/constants/fiNumber`)
- `STANDARD_MULTIPLIERS` - Array [25, 30, 33]
- `MULTIPLIER_RANGE` - Min/max for custom (20-50)
- `MULTIPLIER_DESCRIPTIONS` - Icelandic descriptions
- `MULTIPLIER_WITHDRAWAL_RATES` - Withdrawal rate for each standard multiplier
- `getWithdrawalRate()` - Calculate withdrawal rate from multiplier
- `isStandardMultiplier()` - Check if multiplier is standard
- `needsMultiplierWarning()` - Check if warning needed (< 28)

### Types (from `@/types/fiNumber`)
- `StandardMultiplier` - Type: 25 | 30 | 33

## State Management

### Local State
- `showExplanation: boolean` - Controls explanation section visibility
- `useCustom: boolean` - Whether custom slider is active
- `customValue: number` - Custom slider value (persisted when switching modes)

### Behavior
- Clicking standard button deactivates custom mode
- Clicking "Nota sérsniðið" activates custom mode with last custom value
- Switching back to standard defaults to 30x (recommended)
- Slider changes immediately activate custom mode

## Icelandic Context

### Conservative Multiplier Recommendation
- Default recommended: 30x (vs US standard 25x)
- Rationale: Iceland's higher historical inflation (3-4% annual)
- Warning threshold: < 28x triggers alert

### Icelandic Text
- All labels, descriptions, and explanations in Icelandic
- Number formatting uses comma for decimals (e.g., "3,33%")
- Cultural context: References Icelandic inflation history

## Accessibility

### ARIA Attributes
- `aria-pressed` on multiplier buttons (indicates selected state)
- `aria-expanded` on explanation toggle
- `aria-controls` links toggle to explanation content
- `aria-label` on slider ("Sérsniðinn margfaldari")

### Keyboard Navigation
- All buttons keyboard accessible
- Slider supports arrow keys
- Focus indicators on all interactive elements

### Screen Reader Support
- Semantic HTML structure
- Descriptive labels and button text
- Hidden decorative icons with `aria-hidden="true"`

## Integration

### Used In
- `FINumberBuilderCalculator` - Main FI number calculator page

### Consumes
- FI Number constants from constants file
- Standard UI components from component library
- StandardMultiplier type from types file

## Testing Coverage
Component tests to be written in Task 7.2 (see `specs/fi-number-builder/tasks-fi-number-builder.md`)

Expected tests:
- Three standard buttons render correctly
- Withdrawal rates displayed correctly
- Badges shown with correct variants
- Custom slider works (20-50 range)
- Warning appears when multiplier < 28
- Explanation section expands/collapses
- Switching between standard and custom modes
- Value formatting (Icelandic)

## Implementation Notes

### Icelandic-First Design
Component prioritizes Icelandic context over US FIRE conventions:
- 30x as recommended default (not 25x)
- Warning badge on 25x (too aggressive for Iceland)
- Educational content explains why Iceland differs from US

### User Experience
- Visual feedback: Selected button highlighted with ring
- Badge system: Quick visual indicator of safety level
- Dual input methods: Preset buttons for convenience, slider for precision
- Educational content: Helps users understand choices
- Smart mode switching: Preserves custom value when toggling

### Performance
- Memoization not needed (simple component, no expensive calculations)
- Controlled inputs for immediate feedback
- Local state for UI-only concerns (explanation visibility)

## Related
- Implements: FR-1.2-1.5, US-2, NFR-5 from `specs/fi-number-builder/requirements-fi-number-builder.md`
- Part of: Epic 3, Task 3.3 in `specs/fi-number-builder/tasks-fi-number-builder.md`
- Design: Section 3.3 in `specs/fi-number-builder/design-fi-number-builder.md`
