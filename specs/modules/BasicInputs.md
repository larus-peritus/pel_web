# BasicInputs Component

## Location
`src/components/pensionAwareFire/BasicInputs.tsx`

## Purpose
Provides the basic financial input interface for the Pension-Aware FIRE Calculator, allowing users to enter age, expenses, savings, and investment return information.

## Features

### Input Fields
- **Current Age**: NumberInput (18-70 years)
- **Target Retirement Age**: Slider (current age + 1 to 80 years)
- **Monthly Expenses**: CurrencyInput with tier selector or manual entry
- **Current Savings**: CurrencyInput (0-500M ISK)
- **Monthly Savings**: CurrencyInput (0-2M ISK)
- **Investment Return**: Slider (0-15%, default 5%)

### Expense Baseline Integration
- **Automatic Detection**: Shows success alert when expense baseline is available
- **Tier Selection**: Three-tier selector (Barebones, Comfortable, Deluxe) when baseline connected
- **Visual Feedback**: Icons and descriptions for each tier
- **Manual Override**: Can switch between baseline and manual expense entry
- **Smart Defaults**: Falls back to reasonable defaults when baseline not available

### User Experience
- **Blue/Indigo Theme**: Matches pension planning color scheme
- **Gradient Background**: Visual distinction from other calculator sections
- **Responsive Grid**: 2-column layout on desktop, stacks on mobile
- **Summary Box**: Real-time display of key values (age, retirement age, expenses, years to retirement)
- **Clear Labels**: All labels in Icelandic with helpful tooltips
- **Validation**: Enforces minimum retirement age (current age + 1)

## Integration

### Context API
Uses `useCalculator()` hook to access:
- `pensionAwareFire` - Current state
- `updatePensionAwareFireState` - State update function
- `expenseBaselineResults` - Expense tier data (if available)

### State Updates
All inputs trigger `updatePensionAwareFireState()` with partial updates:
```typescript
updatePensionAwareFireState({
  currentAge: 40,
  targetRetirementAge: 60,
  monthlyExpenses: 300_000,
  // ... other fields
});
```

### Expense Source Logic
- When baseline available and selected:
  - Shows tier selector (Barebones/Comfortable/Deluxe)
  - Auto-populates expenses from selected tier
  - Sets `expenseSource: 'baseline'` and `expenseTier` in state
- When manual mode:
  - Shows CurrencyInput for direct entry
  - Sets `expenseSource: 'manual'` in state
  - Provides toggle to switch back to baseline

## Component Structure

### Header
- Title: "Grunnupplýsingar"
- Subtitle explaining the section

### Expense Baseline Status Alert
- Success: When baseline connected (green)
- Info: When baseline not available (blue)
- Includes link to expense baseline calculator

### Age Inputs Grid
- Current age (NumberInput)
- Target retirement age (Slider with year markers)

### Monthly Expenses Section
- Tier selector (when baseline mode)
  - Three cards with icon, amount, description
  - Visual selection indicator (checkmark + border)
  - Shows tier name and monthly amount
- Manual input (when manual mode)
  - CurrencyInput with validation
  - Toggle to switch to baseline

### Savings Section
- Current savings (CurrencyInput)
- Monthly savings rate (CurrencyInput)

### Investment Return
- Slider with percentage display
- Help text with typical range (5-7%)

### Summary Box
- Current age and retirement age
- Monthly expenses
- Years to retirement (calculated)

## Validation

### Age Constraints
- Current age: 18-70 (from `PENSION_INPUT_RANGES`)
- Retirement age: currentAge + 1 to 80
- Enforced via `handleCurrentAgeChange` logic

### Expense Constraints
- Monthly expenses: 100,000 - 2,000,000 ISK
- Validated by CurrencyInput component

### Savings Constraints
- Current savings: 0 - 500,000,000 ISK
- Monthly savings: 0 - 2,000,000 ISK
- Validated by CurrencyInput component

### Return Constraints
- Investment return: 0% - 15%
- Default: 5%
- Validated by Slider component

## Tier Options

### Barebones (Lágmark)
- Icon: 🍃
- Description: "Lágmarksútgjöld"
- Default: 240,000 ISK (or from baseline)

### Comfortable (Þægilegt)
- Icon: 😊
- Description: "Þægileg lífsgæði"
- Default: 300,000 ISK (or from baseline)

### Deluxe (Lúxus)
- Icon: 👑
- Description: "Ríkuleg lífsgæði"
- Default: 400,000 ISK (or from baseline)

## Dependencies

### UI Components
- `Card` - Container with gradient background
- `CurrencyInput` - ISK input with formatting
- `NumberInput` - Integer input with validation
- `Slider` - Range input with visual feedback
- `Select` - Dropdown selector (not used, could enhance tier selection)
- `Alert` - Status messages for baseline connection

### Context
- `useCalculator` - Access to calculator state and update functions

### Constants
- `PENSION_INPUT_RANGES` - Validation ranges for all inputs
- `PENSION_AWARE_DEFAULTS` - Default values

### Types
- `ExpenseTier` - Type for tier selection ('barebones' | 'comfortable' | 'deluxe')

## Testing

### Test Coverage (21 tests, all passing)
- **Rendering** (3 tests)
  - All input fields render correctly
  - Default values displayed
  - Returns null when state is null
- **Expense Baseline Integration** (5 tests)
  - Success alert when baseline connected
  - Info alert when baseline not available
  - Tier selector displays correctly
  - Selected tier highlighted
  - Tier selection updates state
- **Age Inputs** (3 tests)
  - Current age updates
  - Retirement age constraint enforcement
  - Target retirement age updates
- **Expense Inputs** (2 tests)
  - Manual expense entry
  - Toggle between baseline and manual
- **Savings Inputs** (2 tests)
  - Current savings updates
  - Monthly savings updates
- **Investment Return** (2 tests)
  - Return rate updates
  - Percentage display correct
- **Summary Box** (2 tests)
  - Summary values correct
  - Years to retirement calculated
- **Validation** (2 tests)
  - Age constraints respected
  - Expense constraints respected

### Test File
`tests/components/pensionAwareFire/BasicInputs.test.tsx`

## Implementation Notes

### Pattern Consistency
Follows the same patterns as LeanFIRE's LeanFIREInputs component:
- Expense baseline integration
- Tier selection with visual cards
- Grid layout for inputs
- Summary box at bottom
- Alert for baseline status

### Icelandic Localization
All user-facing text in Icelandic:
- Input labels (Núverandi aldur, Markaldur starfsloka, etc.)
- Help text and descriptions
- Tier names (Lágmark, Þægilegt, Lúxus)
- Summary labels

### State Synchronization
- Local state for `selectedTier` (UI only)
- Context state for all persistent data
- `useEffect` syncs tier selection with context on mount

### Edge Cases Handled
- Null state (component returns null)
- Missing baseline (shows info alert, uses defaults)
- Age validation (retirement always > current)
- Zero values allowed for savings

## Used By
- `PensionAwareFIRECalculator` (Epic 7, Task 7.1 - planned)

## Related Modules
- Types: `context/modules/PensionAwareFireTypes.md`
- Constants: `context/modules/PensionAwareFireConstants.md`
- Context: `context/modules/PensionAwareFireContext.md`
- Feature: `context/features/pension-aware-fire.md`

## Future Enhancements
1. **Historical Data**: Show how expenses have changed over time
2. **Inflation Adjustment**: Auto-adjust expenses for future years
3. **Comparison Mode**: Show all three tiers side-by-side
4. **Quick Presets**: Common scenarios (single/couple, urban/rural)
5. **Export**: Save inputs to share or compare later
