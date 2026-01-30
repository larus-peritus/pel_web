# FIRE Type Explorer - User Inputs Components

## Overview
Epic 5 components for collecting user financial data and calculation assumptions for the FIRE Type Explorer feature.

## Components

### UserFinancialInputs
**Location**: `src/components/fireTypes/UserFinancialInputs.tsx`

Form component for collecting user financial data needed for FIRE calculations.

**Features**:
- Age input (18-100 years) with validation
- Current net worth input (ISK, using CurrencyInput)
- Monthly income input (ISK, using CurrencyInput)
- Monthly savings input (ISK, using CurrencyInput)
- Target retirement age input (optional)
- Real-time validation feedback in Icelandic
- Automatic savings rate calculation and display
- Auto-save to context with 500ms debounce
- Integration with expense baseline tool
- Accessible form with proper labels and help text

**Validation**:
- Uses `validateUserInputs` from `@/lib/validation/fireTypes`
- Shows errors inline per field
- Shows warnings for edge cases (late start, low income, etc.)
- Prevents invalid state with proper constraints

**State Management**:
- Local state for immediate UI updates
- Debounced save to CalculatorContext
- Integrates with `updateFIRETypePreferences`
- Reads from `expenseBaseline` for monthly expenses

**Dependencies**:
- `@/context/CalculatorContext`
- `@/lib/validation/fireTypes`
- `@/types/fireTypes`
- `@/components/ui/CurrencyInput`
- `@/components/ui/NumberInput`
- `@/components/ui/Card`
- `@/components/ui/Alert`

---

### AssumptionsControls
**Location**: `src/components/fireTypes/AssumptionsControls.tsx`

Collapsible advanced settings component for FIRE calculation assumptions.

**Features**:
- Collapsible section (closed by default)
- Withdrawal rate slider (3-5%, default 4%, step 0.1%)
- Growth rate slider (4-8%, default 6%, step 0.25%)
- Live value display with formatting
- Reset to defaults button
- Help text and examples for each assumption
- Real-time validation with warnings
- Custom vs default indicator badge
- Real return calculation display (growth - inflation)
- Rule of 72 calculation example

**Validation**:
- Uses `validateAssumptions` from `@/lib/validation/fireTypes`
- Shows warnings for extreme values
- Validates cross-field constraints (real return)

**State Management**:
- Reads from `fireTypePreferences.customAssumptions`
- Updates via `updateFIREAssumptions`
- Reset via `resetFIREAssumptions`
- Falls back to `DEFAULT_FIRE_ASSUMPTIONS`

**Dependencies**:
- `@/context/CalculatorContext`
- `@/lib/validation/fireTypes`
- `@/types/fireTypes`
- `@/components/ui/Slider`
- `@/components/ui/Card`
- `@/components/ui/Alert`
- `@/components/ui/Button`

---

### ExpenseBaselineStatus
**Location**: `src/components/fireTypes/ExpenseBaselineStatus.tsx`

Status indicator component showing expense baseline availability and providing quick access.

**Features**:
- Visual status indicator (success/warning)
- Shows selected tier and monthly expenses
- Displays all three tiers (barebones, comfortable, deluxe)
- Link to expense baseline tool (`/utgjaldareiknivel`)
- Color-coded tier display with icons
- Call-to-action button when missing
- Tier summary cards with ISK formatting

**Display States**:
1. **No Baseline**: Warning alert with explanation and "Create Baseline" button
2. **Has Baseline**: Success card with selected tier, all tier summaries, and "Edit Baseline" button

**Tier Formatting**:
- Barebones: 🥉 Lágmarks (amber)
- Comfortable: 🥈 Þægileg (green)
- Deluxe: 🥇 Lúxus (purple)

**State Management**:
- Reads from `expenseBaseline` in CalculatorContext
- Read-only component (links to external tool)

**Dependencies**:
- `@/context/CalculatorContext`
- `@/components/ui/Card`
- `@/components/ui/Alert`
- `@/components/ui/Button`
- `next/link`

---

### InputsSection
**Location**: `src/components/fireTypes/InputsSection.tsx`

Main orchestration component that combines all input components with clear visual hierarchy.

**Structure**:
1. Section header with title and description
2. ExpenseBaselineStatus (priority display)
3. UserFinancialInputs (main form)
4. AssumptionsControls (collapsible advanced settings)
5. Help section with tips

**Features**:
- Clear visual hierarchy
- Proper spacing (space-y-6)
- Semantic HTML (section, headings)
- Help section with tips for accuracy
- Responsive layout
- All text in Icelandic

**Help Tips**:
- Create expense baseline for accurate results
- Calculate actual hourly wage for better insights
- Be honest about current savings rate
- Consider target retirement age carefully

**Dependencies**:
- `./ExpenseBaselineStatus`
- `./UserFinancialInputs`
- `./AssumptionsControls`

---

## Data Flow

```
User Input → Local State → Validation → Debounced Save → CalculatorContext
                                ↓
                          Error/Warning Display
```

1. User enters financial data
2. Component validates inputs in real-time
3. Shows errors/warnings inline
4. Debounces save (500ms) to context
5. Context persists to localStorage
6. Calculation components read from context

## Integration Points

### With CalculatorContext
- Reads: `expenseBaseline`, `fireTypePreferences`, `actualHourlyWage`
- Writes: `updateFIRETypePreferences`, `updateFIREAssumptions`, `resetFIREAssumptions`

### With Validation
- All inputs validated via `validateUserInputs` and `validateAssumptions`
- Errors prevent calculations
- Warnings inform user but allow proceeding

### With Expense Baseline
- ExpenseBaselineStatus shows if baseline exists
- UserFinancialInputs reads monthly expenses from baseline
- Links to `/utgjaldareiknivel` for creation/editing

## Testing

### Test Files
- `tests/components/fireTypes/UserFinancialInputs.test.tsx` (21 tests)
- `tests/components/fireTypes/AssumptionsControls.test.tsx` (29 tests)
- `tests/components/fireTypes/ExpenseBaselineStatus.test.tsx` (16 tests)
- `tests/components/fireTypes/InputsSection.test.tsx` (15 tests)

### Test Coverage
- Rendering and display
- Input changes and updates
- Validation (errors and warnings)
- State management integration
- Accessibility
- Help text and examples
- Responsive design

## Accessibility

### ARIA Attributes
- All inputs have proper labels
- Required fields marked with asterisk and `required` attribute
- Error messages linked via `aria-describedby`
- Help text linked via `aria-describedby`
- Collapsible sections use `aria-expanded` and `aria-controls`

### Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order follows visual flow
- Sliders support arrow keys
- Buttons and links have focus styles

### Screen Reader Support
- Semantic HTML structure
- Descriptive labels
- Error announcements
- Help text available

## Styling

### Color Schemes
- Primary: Blue for informational elements
- Success: Green for positive states
- Warning: Yellow/Amber for warnings
- Danger: Red for errors
- Neutral: Gray for secondary text

### Responsive Design
- Mobile-first approach
- Stacks vertically on mobile
- Grid layout for tier cards
- Proper spacing at all breakpoints

## Future Enhancements
- [ ] Save multiple scenarios
- [ ] Import data from financial accounts
- [ ] Historical tracking of inputs over time
- [ ] Bulk edit for assumptions
- [ ] Preset profiles (conservative, balanced, aggressive)
- [ ] Compare inputs with national averages

## Related Modules
- FIRETypeCalculations.md - Uses these inputs for calculations
- FIREValidation.md - Validation logic
- CalculatorContext.md - State management
- ExpenseBaselineTool.md - Expense data source
