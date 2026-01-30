# BaselineChangeNotification Component

## Location
`src/components/coastFire/BaselineChangeNotification.tsx`

## Purpose
Displays a notification when expense baseline changes affect Coast FIRE results. Provides user feedback about automatic recalculation and allows users to review changes or dismiss the notification.

## Component Type
Alert/Notification UI Component

## Exports
- `BaselineChangeNotification` - Main notification component
- `BaselineChangeNotificationProps` - TypeScript interface for props

## Props Interface

```typescript
interface BaselineChangeNotificationProps {
  selectedTier: ExpenseTier;           // Which tier is currently selected
  newFINumber: number;                 // New FI number calculated from baseline
  previousFINumber: number | null;     // Previous FI number (for comparison)
  onDismiss: () => void;               // Callback when notification is dismissed
  autoDismissMs?: number;              // Auto-dismiss after milliseconds (default 5000)
  className?: string;                  // Optional CSS classes
}
```

## Key Functionality

### Display Features
- Shows notification header "Útgjaldagrunnur uppfærður"
- Displays selected tier label in Icelandic (Lágmarks/Þægileg/Lúxus)
- Shows new FI number with currency formatting
- Calculates and displays change amount and percentage
- Color-coded change indicators:
  - Amber (warning) for increases
  - Green (success) for decreases
- Shows "hækkaði" (increased) or "lækkaði" (decreased) based on change direction

### User Actions
- "Skoða útgjaldagrunn" button - Navigate to expense baseline tool
- "Í lagi" button - Dismiss notification
- Close button (from Alert component) - Dismiss notification
- Auto-dismiss timer (default 5 seconds)

### Change Calculation
- Compares previous and new FI numbers
- Calculates absolute change amount
- Calculates percentage change
- Determines direction (increase/decrease)
- Handles null previous value gracefully

## Dependencies

### Internal Components
- `@/components/ui/Alert` - Base alert component with styling
- `@/components/ui/Button` - Button components for actions

### Utilities
- `@/lib/utils` - `formatCurrency()` for ISK formatting

### Types
- `@/types/expenseBaseline` - `ExpenseTier` type

## Usage Example

```tsx
import { BaselineChangeNotification } from '@/components/coastFire';

function CoastFIRECalculator() {
  const [showNotification, setShowNotification] = useState(false);
  const [previousFI, setPreviousFI] = useState<number | null>(null);

  return (
    <>
      {showNotification && (
        <BaselineChangeNotification
          selectedTier="comfortable"
          newFINumber={100_000_000}
          previousFINumber={previousFI}
          onDismiss={() => {
            setShowNotification(false);
            setPreviousFI(newFINumber);
          }}
          autoDismissMs={5000}
        />
      )}
    </>
  );
}
```

## Integration Points

### Used By
- `CoastFIRECalculator` - Main calculator page component
  - Detects expense baseline changes via `useEffect`
  - Tracks previous FI number in state
  - Shows notification when baseline updates

### Integration Logic
```typescript
// In CoastFIRECalculator
const prevExpenseBaselineRef = useRef(expenseBaseline);

useEffect(() => {
  if (
    coastFireState?.fiNumberSource === 'baseline' &&
    coastFireState.selectedTier &&
    expenseBaseline
  ) {
    const prevBaseline = prevExpenseBaselineRef.current;

    // Check if baseline actually changed (not just initial load)
    if (
      prevBaseline &&
      prevBaseline.lastUpdated !== expenseBaseline.lastUpdated
    ) {
      setShowBaselineNotification(true);
      setPreviousFINumber(coastFireState.fiNumber);
    }

    prevExpenseBaselineRef.current = expenseBaseline;
  }
}, [expenseBaseline, coastFireState]);
```

## Visual Design

### Layout
- Alert container with info variant (blue theme)
- Rounded corners with padding
- Responsive spacing

### Content Sections
1. **Header**: Title and description
2. **Data Display**: Tier, new FI number, change amount (if applicable)
3. **Actions**: Two buttons side by side
4. **Auto-dismiss message**: Small text at bottom

### Color Scheme
- Background: Blue-50 (info theme)
- Text: Blue-800/900
- Change indicators:
  - Increases: Amber-700
  - Decreases: Green-700
- Buttons: Secondary variant

## Behavior

### Auto-Dismiss Timer
- Default: 5000ms (5 seconds)
- Can be customized via `autoDismissMs` prop
- Set to 0 to disable auto-dismiss
- Timer clears on manual dismiss
- Timer clears on component unmount

### Change Detection Logic
- Only shows change section if `previousFINumber` is not null
- Calculates change as: `newFINumber - previousFINumber`
- Determines direction by sign of change
- Calculates percentage as: `Math.abs(change / previousFINumber * 100)`

### Tier Labels
```typescript
const labels: Record<ExpenseTier, string> = {
  barebones: 'Lágmarks',
  comfortable: 'Þægileg',
  deluxe: 'Lúxus',
};
```

## Testing

### Test File
`src/components/coastFire/__tests__/BaselineChangeNotification.test.tsx`

### Test Coverage
- ✅ Display content (title, tier, FI number, change)
- ✅ User interactions (dismiss buttons, navigation)
- ✅ Auto-dismiss behavior (timer, cleanup)
- ✅ Change calculation (increase, decrease, percentage)
- ✅ Styling and color coding (amber/green based on direction)
- ✅ Accessibility (ARIA roles, keyboard navigation)
- ✅ Edge cases (large numbers, identical values, null previous)

### Key Test Cases
1. Renders notification with correct Icelandic labels
2. Shows tier label correctly for all three tiers
3. Formats FI number with currency formatting
4. Calculates and displays change percentage
5. Uses correct color for increases (amber) and decreases (green)
6. Dismisses on button click
7. Auto-dismisses after specified time
8. Clears timer on unmount
9. Navigates to expense baseline tool
10. Handles null previous FI number

## Accessibility Features

- Alert role for screen readers
- Keyboard-accessible buttons
- Clear action labels in Icelandic
- Semantic HTML structure
- Color is not the only indicator (text labels included)

## Performance Considerations

- Lightweight component with minimal state
- Uses React timer hooks (useEffect cleanup)
- No expensive calculations
- Currency formatting is memoized in utility function

## Icelandic Language

All text is in Icelandic:
- "Útgjaldagrunnur uppfærður" - Expense baseline updated
- "FI-talan þín hefur verið uppfærð sjálfkrafa" - Your FI number has been updated automatically
- "Lífsstíll" - Lifestyle
- "Ný FI-tala" - New FI number
- "Breyting" - Change
- "hækkaði" - increased
- "lækkaði" - decreased
- "Skoða útgjaldagrunn" - View expense baseline
- "Í lagi" - OK

## Related Documentation

- Component: `src/components/coastFire/CoastFIRECalculator.tsx`
- Component: `src/components/coastFire/CoastFIREInputs.tsx` (baseline integration)
- Epic 6, Task 6.2: Auto-Update on Baseline Changes
- Context: Expense Baseline (`context/modules/ExpenseBaseline.md`)
- Feature: Coast FIRE Calculator (`context/features/coast-fire-calculator.md`)

## Implementation Notes

### Epic 6, Task 6.2 Implementation
- Created: 2026-01-29
- Purpose: Notify users when expense baseline changes affect Coast FIRE
- Integration: Detects baseline changes via lastUpdated timestamp
- User Experience: Non-intrusive, auto-dismissing notification
- Persistence: Previous FI number tracked in component state

### Design Decisions
1. **Auto-dismiss**: Default 5 seconds balances visibility and non-intrusiveness
2. **Color coding**: Amber for increases (potential concern), green for decreases (good news)
3. **Change display**: Both absolute ISK and percentage for context
4. **Action buttons**: Quick access to baseline tool and dismiss
5. **Timer cleanup**: Proper React cleanup to prevent memory leaks

### Future Enhancements
- Option to persist dismiss state (don't show again)
- Animation on appear/disappear
- Sound notification (optional, with user preference)
- Link to specific tier in expense baseline tool
- History of baseline changes

## Patterns Followed

- Consistent with Alert component patterns in codebase
- Follows Icelandic naming conventions
- Uses existing UI components (Button, Alert)
- TypeScript strict typing
- Comprehensive test coverage
- Proper cleanup in useEffect hooks
