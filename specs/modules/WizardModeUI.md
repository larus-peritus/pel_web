# Wizard Mode UI

## Location
- `apps/peninganaedalifid/src/components/expenseBaseline/WizardModeContainer.tsx`
- `apps/peninganaedalifid/src/components/expenseBaseline/WizardProgress.tsx`
- `apps/peninganaedalifid/src/components/expenseBaseline/CategoryWizardStep.tsx`
- `apps/peninganaedalifid/src/components/expenseBaseline/WizardSummaryStep.tsx`
- `apps/peninganaedalifid/src/components/expenseBaseline/WizardNavigation.tsx`

## Purpose
Provides step-by-step guided experience for first-time users setting up their expense baseline. Users are walked through each of the 10 expense categories one at a time, then shown a summary before confirming.

## Components

### WizardModeContainer
Main container managing wizard state and navigation flow.

**Key Features:**
- Tracks current step (0-10 for categories, 11 for summary)
- Manages draft values for all categories
- Handles navigation (next/back/skip)
- Initializes with default values
- Calls `onComplete` with final values on finish

**State:**
- `currentStep`: Current wizard step index
- `values`: Record of category ID to TierValues
- `skippedCategories`: Array of skipped category IDs

### WizardProgress
Visual progress indicator showing completion status.

**Features:**
- Progress bar (0-100%)
- Step counter ("Skref 3 af 11")
- Current category name display
- ARIA progressbar attributes for accessibility

### CategoryWizardStep
Single category input step with three tier fields.

**Features:**
- Category header (icon, name, description, subcategories)
- Three CurrencyInput fields (Lágmarks, Þægilegt, Lúxus)
- Default value hints below each input
- "Nota sjálfgefin gildi" button
- Validation warnings (non-blocking) if tiers not in ascending order
- Navigation controls

**Validation:**
- Warns if barebones > comfortable
- Warns if comfortable > deluxe
- Does not block progression (warnings only)

### WizardSummaryStep
Final review step before saving baseline.

**Features:**
- Three tier summary cards with monthly/annual totals
- Complete category breakdown list
- Edit button for each category (returns to that step)
- Back button
- "Vista útgjaldagrunn" confirm button
- Help text about future editing

**Calculations:**
- Sums all category values per tier
- Displays monthly and annual totals
- Color-coded by tier (Amber/Green/Purple)

### WizardNavigation
Reusable navigation controls for wizard steps.

**Features:**
- Back button (disabled on first step)
- Skip button (always enabled)
- Next button (text changes on last step)
- `canProceed` prop for validation
- Enter key shortcut for next

## Key Functionality

### Navigation Flow
1. User starts at category step 0 (Húsnæði)
2. Can proceed forward, go back, or skip
3. Values are preserved when navigating
4. Last category step shows "Áfram í yfirlit" button
5. Summary step shows all values and totals
6. Can edit specific categories from summary
7. Finish button calls `onComplete` with all values

### Default Values
- All categories initialized with defaults from constants
- "Nota sjálfgefin gildi" button resets current category
- Skipping keeps default values for that category

### Validation
- Non-blocking warnings if tier order incorrect
- User can still proceed with warnings
- Validation runs on each tier change

## Dependencies
- `@/types/expenseBaseline` - Type definitions
- `@/lib/constants/expenseBaseline` - Default categories and tier labels
- `@/components/ui/Card` - Card components
- `@/components/ui/CurrencyInput` - Currency input field
- `@/components/ui/Button` - Button component
- `@/lib/utils` - formatCurrency, cn utilities

## Integration
Used by main ExpenseBaselineCalculator when:
- User has no existing baseline (first time)
- User clicks "Start fresh" to reset baseline
- `wizardCompleted` flag is false

**Callback:**
```typescript
onComplete={(values: Record<string, TierValues>) => {
  // Convert to ExpenseCategory array
  // Save to context
  // Mark wizard as completed
}}
```

## Accessibility
- ARIA progressbar with value attributes
- Keyboard navigation (Enter for next)
- Proper label associations
- Screen reader announcements
- Focus management

## Styling
- Responsive design (mobile-first)
- Tier color coding (Amber/Green/Purple)
- Gradient header on category steps
- Card-based layout
- Consistent spacing and typography

## Related
- Implements: Tasks 3.1-3.5 from specs/expense-baseline/tasks-expense-baseline.md
- Part of: EPIC 3 - Wizard Mode UI
- Design: specs/expense-baseline/design-expense-baseline.md (Section 3.2-3.3)
