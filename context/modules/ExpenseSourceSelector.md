# ExpenseSourceSelector Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/ExpenseSourceSelector.tsx`

## Purpose
Component that allows users to toggle between using their expense baseline (from the Expense Baseline Tool) and entering a custom monthly expense amount for FI number calculation.

## Exports
- `ExpenseSourceSelector` - Main component
- `ExpenseSourceSelectorProps` - TypeScript interface

## Key Functionality

### Expense Source Selection
- **Radio group** with two options: "Nota útgjaldagrunn" (Use expense baseline) vs "Slá inn sérsniðin útgjöld" (Custom input)
- **Conditional rendering** based on selected source and baseline availability
- **Smart defaults**: Automatically selects "comfortable" tier when switching to baseline with no tier selected

### Baseline Mode
- Embeds `TierSelector` component when baseline exists
- Shows all three expense tiers (Lágmarks/Þægilegt/Lúxus) with amounts
- Displays warning alert with link to expense baseline setup if baseline doesn't exist
- Passes baseline expense amounts to TierSelector for display

### Custom Mode
- `CurrencyInput` for monthly expense amount
- Real-time validation:
  - Must be > 0 (shows error: "Útgjöld verða að vera jákvæð")
  - Must be <= 10M ISK (shows warning: "Útgjöld virðast óraunhæf")
- Help text: "Áætluð mánaðarleg útgjöld í ISK"

### User Guidance
- Info alert explaining benefit of using expense baseline
- Encourages users to set up baseline for scenario comparison
- All text in Icelandic

## Props Interface

```typescript
interface ExpenseSourceSelectorProps {
  expenseSource: 'baseline' | 'custom';           // Current expense source
  selectedTier: ExpenseTier | null;               // Selected tier if using baseline
  customMonthlyExpense: number;                   // Custom expense amount
  hasBaseline: boolean;                           // Whether baseline exists
  baselineExpenses?: {                            // Baseline expense amounts
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
  onSourceChange: (source: ExpenseSource) => void;      // Callback when source changes
  onTierChange: (tier: ExpenseTier) => void;            // Callback when tier changes
  onCustomExpenseChange: (amount: number) => void;      // Callback when custom expense changes
}
```

## Dependencies
- `CurrencyInput` from `@/components/ui/CurrencyInput` - For custom expense input
- `Card`, `CardContent` from `@/components/ui/Card` - For container layout
- `Alert` from `@/components/ui/Alert` - For warnings and info messages
- `TierSelector` from `@/components/expenseBaseline/TierSelector` - For tier selection
- `ExpenseTier` from `@/types/expenseBaseline` - Type for expense tiers
- `ExpenseSource` from `@/types/fiNumber` - Type for expense source

## Tests
- **Location**: `apps/peninganaedalifid/tests/components/fiNumber/ExpenseSourceSelector.test.tsx`
- **Coverage**: 22 tests, all passing
- **Test categories**:
  - Rendering (5 tests): Component rendering, conditional displays
  - User Interactions (4 tests): Radio selection, tier changes, custom input
  - Validation (3 tests): Zero value, excessive value, valid value
  - Accessibility (4 tests): ARIA attributes, radio group, labels
  - Conditional Rendering (3 tests): Hiding/showing based on state
  - Visual States (3 tests): Selected/unselected styles

## Integration
- **Used by**: FINumberBuilderCalculator (main FI Number Builder component)
- **Uses**: TierSelector from Expense Baseline Tool
- **Data flow**:
  - Receives expense source state from parent
  - Triggers callbacks on source/tier/amount changes
  - Parent (CalculatorContext) manages persistence

## Related
- **Implements**: FR-2.1-2.4 (Expense Source Options) from `specs/fi-number-builder/requirements-fi-number-builder.md`
- **Part of**: Epic 3 (Core UI) from `specs/fi-number-builder/design-fi-number-builder.md`
- **Task**: Task 3.2 from `specs/fi-number-builder/tasks-fi-number-builder.md`

## Implementation Notes

### Validation Strategy
- Validation happens on input change (real-time feedback)
- Error state stored in local component state
- Parent receives all values (including invalid ones) via callback
- Parent responsible for final validation before calculation

### Accessibility
- Radio group with proper ARIA labels
- Each radio button has `aria-checked` attribute
- Custom input has proper label association
- Error messages have `role="alert"` for screen readers
- Focus management with keyboard navigation

### Icelandic Context
- All UI text in Icelandic
- Number formatting uses Icelandic locale (period separator)
- Links to `/utgjaldareiknivel` route for baseline setup
- Culturally appropriate terminology ("Lágmarks", "Þægilegt", "Lúxus")

## Example Usage

```tsx
import { ExpenseSourceSelector } from '@/components/fiNumber/ExpenseSourceSelector';

function FINumberBuilder() {
  const [expenseSource, setExpenseSource] = useState<ExpenseSource>('baseline');
  const [selectedTier, setSelectedTier] = useState<ExpenseTier>('comfortable');
  const [customExpense, setCustomExpense] = useState(0);
  const { expenseBaseline, hasExpenseBaseline } = useCalculator();

  return (
    <ExpenseSourceSelector
      expenseSource={expenseSource}
      selectedTier={selectedTier}
      customMonthlyExpense={customExpense}
      hasBaseline={hasExpenseBaseline()}
      baselineExpenses={expenseBaseline ? {
        barebones: getExpenseByTier(expenseBaseline, 'barebones'),
        comfortable: getExpenseByTier(expenseBaseline, 'comfortable'),
        deluxe: getExpenseByTier(expenseBaseline, 'deluxe'),
      } : undefined}
      onSourceChange={setExpenseSource}
      onTierChange={setSelectedTier}
      onCustomExpenseChange={setCustomExpense}
    />
  );
}
```

## Future Enhancements
- Animation when switching between sources
- Preset custom expense amounts (e.g., "Reykjavík average", "Landsbyggð average")
- Import expense from other calculators (e.g., travel budget)
- Historical tracking of custom expense changes
