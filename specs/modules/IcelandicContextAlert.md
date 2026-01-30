# IcelandicContextAlert

## Location
`apps/peninganaedalifid/src/components/fiNumber/IcelandicContextAlert.tsx`

## Purpose
Displays a contextual warning alert when the user selects a multiplier that may be too aggressive for the Icelandic context. Educates users about Iceland-specific factors that require more conservative FI planning. Implements Task 7.2 from Epic 7 of the FI Number Builder feature.

## Exports
- `IcelandicContextAlert` - React component displaying conditional warning
- `IcelandicContextAlertProps` - TypeScript interface for component props

## Key Functionality

### Conditional Rendering
- Only shows when multiplier < 28 (MULTIPLIER_WARNING_THRESHOLD)
- Automatically hides when multiplier is 28 or above
- Can be dismissed by user (dismissible by default)
- State persists during session (uses local state)

### Warning Content
- **Selected multiplier display**: Shows user's current choice with withdrawal rate
- **Risk explanation**: Three key reasons why low multiplier is risky for Iceland:
  1. **Higher inflation** (3-4% vs US 2-3%)
  2. **Currency risk** (ISK volatility)
  3. **Smaller market** (limited domestic options)
- **Recommendation**: Clear guidance to use 30x-33x multiplier
- **Benefits explanation**: Why conservative approach ensures longevity

### Interactive Elements
- **Learn More button**: Optional callback to link to educational content
- **Dismiss button**: Close alert (only shows if dismissible=true)
- **Warning styling**: Amber color scheme with appropriate icons

## Dependencies

### UI Components
- `Alert` from `@/components/ui/Alert`
- `Button` from `@/components/ui/Button`

### Constants
- `MULTIPLIER_WARNING_THRESHOLD` from `@/lib/constants/fiNumber` (value: 28)

### React
- `useState` for dismiss state management

## Usage Example

```tsx
import { IcelandicContextAlert } from '@/components/fiNumber/IcelandicContextAlert';

function MultiplierSelector({ multiplier, onMultiplierChange }) {
  const scrollToEducation = () => {
    document.getElementById('educational-panel')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Multiplier selection UI */}

      {/* Show warning if multiplier is too low */}
      <IcelandicContextAlert
        multiplier={multiplier}
        onLearnMore={scrollToEducation}
      />
    </div>
  );
}
```

## Props

```typescript
interface IcelandicContextAlertProps {
  /** Current multiplier value */
  multiplier: number;
  /** Callback when user wants to see educational content */
  onLearnMore?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the alert can be dismissed (default: true) */
  dismissible?: boolean;
}
```

## Implementation Details

### Threshold Logic
- Uses `MULTIPLIER_WARNING_THRESHOLD` constant (28)
- Returns null immediately if multiplier >= 28
- Returns null if dismissed and dismissible=true
- Ensures no unnecessary rendering

### Calculation Display
- Displays multiplier with "x" suffix (e.g., "25x")
- Calculates withdrawal rate: `(1 / multiplier) * 100`
- Formats withdrawal rate with Icelandic decimal separator (comma)
- Uses `.toFixed(2)` for consistent two decimal places

### Visual Design
- Warning variant with amber color scheme
- Warning icon (triangle with exclamation)
- Nested information boxes for structured content
- Success-colored recommendation box for clear guidance
- Responsive text sizing

### Accessibility
- Uses Alert component's built-in role="alert"
- Proper ARIA attributes via Alert component
- Dismiss button has accessible label
- Icons have aria-hidden attribute
- Semantic heading structure (h3 for title)

## Tests
- Location: `apps/peninganaedalifid/tests/components/fiNumber/IcelandicContextAlert.test.tsx`
- Coverage: 26 tests, all passing
- Test categories:
  - Conditional rendering (threshold, dismiss behavior)
  - Content verification (multiplier, withdrawal rate, reasons)
  - Learn more action (callback, button presence)
  - Accessibility (role, labels, semantic structure)
  - Visual states (styling, custom classes)
  - Edge cases (fractional multipliers, formatting)
  - Integration (threshold constant, multiplier changes)

## Integration Points

### With MultiplierSelector
```tsx
// In MultiplierSelector component
<div className="space-y-4">
  {/* Multiplier buttons and slider */}

  {/* Contextual warning */}
  <IcelandicContextAlert
    multiplier={multiplier}
    onLearnMore={() => setShowEducationalPanel(true)}
  />
</div>
```

### With FINumberBuilderCalculator
```tsx
// In main calculator
<div className="calculator-content">
  <MultiplierSelector
    multiplier={multiplier}
    onMultiplierChange={handleMultiplierChange}
  />

  {/* Educational panel to link to */}
  <EducationalPanel id="educational-panel" />
</div>
```

## Related Components
- `MultiplierSelector` - Where alert is typically rendered
- `EducationalPanel` - Learn more destination
- `Alert` - Base UI component

## Requirements Fulfilled
- **FR-4.2**: Warning when using 25x multiplier about Iceland's inflation
- **FR-4.3**: Educational content about Icelandic inflation history
- **FR-4.4**: Optional pension income input (context)
- **US-3**: Adjust for Icelandic context (warnings and recommendations)
- **NFR-2**: Usability (clear feedback)

## Design Decisions

### Why 28 as threshold?
- 25x (4% rule) is standard US approach
- 30x (3.33%) is recommended for Iceland
- 28 provides 2-point buffer before warning
- Allows 27x without being too aggressive

### Why dismissible by default?
- Users may understand risks after first view
- Reduces alert fatigue
- State persists during session
- Can be made permanent with `dismissible={false}`

### Why nested information boxes?
- Separates "problem" (risks) from "solution" (recommendation)
- Color-coding aids comprehension (warning amber, success green)
- Visual hierarchy guides reading flow
- Makes content scannable

## Best Practices
- Always pass `onLearnMore` callback for better UX
- Place near multiplier selection for context
- Don't make permanently dismissible across sessions (keep user informed)
- Use consistent threshold with MultiplierSelector warnings

## Future Enhancements
- Add localStorage for cross-session dismiss state
- Include link to inflation data sources
- Add "Don't show again" checkbox
- Show different message for very low multipliers (<20)
- Include visual chart comparing Iceland vs US inflation
