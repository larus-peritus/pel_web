# Expense Baseline Main Page Components

## Overview

Main page orchestration components for the Expense Baseline Calculator. Provides mode detection, routing integration, and navigation setup.

## Components

### ExpenseBaselineCalculator (Main Component)

**Location**: `src/components/expenseBaseline/ExpenseBaselineCalculator.tsx`

**Purpose**: Page-level orchestrator that manages wizard/edit modes based on user's baseline status.

**Features**:
- Auto-detects mode: wizard if no baseline (or `wizardCompleted !== true`), edit if exists
- Mode toggle button ("Byrja aftur" to switch to wizard mode)
- Educational intro section (collapsible) explaining three-tier system
- Renders WizardModeContainer or QuickEditModeContainer based on mode
- Shows ResultsSummarySection below when baseline exists
- AWH warning when not available

**State Management**:
```typescript
const [mode, setMode] = useState<ViewMode>(() => {
  return expenseBaseline?.wizardCompleted ? 'quickEdit' : 'wizard';
});
```

**Key Handlers**:
- `handleWizardComplete()` - Converts wizard values to ExpenseCategory array, updates context, switches to quick edit
- `handleWizardCancel()` - Returns to quick edit if baseline exists
- `handleStartWizard()` - Switches from quick edit to wizard mode

**Integration**:
- Uses `useCalculator()` hook for state access
- Reads: `expenseBaseline`, `expenseBaselineResults`, `results` (for AWH)
- Updates: `updateExpenseBaseline()` to save completed wizard

**Requirements**: FR-5.1, FR-5.5

---

### Route Page

**Location**: `src/app/utgjaldareiknivel/page.tsx`

**Purpose**: Next.js route page for `/utgjaldareiknivel`

**Features**:
- CalculatorProvider wrapper for state management
- Suspense boundary with loading fallback
- Hero section with title and description
- Main content section with ExpenseBaselineCalculator
- Privacy notice section

**SEO**:
- H1: "Útgjaldagrunnur"
- Description: "Skilgreindu mánaðarleg útgjöld þín á þremur stigum"
- Tagline: "Grunnurinn að öllum FIRE-útreikningum þínum"

---

### Calculator Navigation Integration

**Location**: `src/components/calculator/CalculatorPageContent.tsx`

**Modifications**:
1. Added to `EXPENSE_CALCULATORS` array as **first item**:
```typescript
{
  id: 'utgjaldareiknivel',
  name: 'Útgjaldagrunnur',
  description: 'Skilgreindu útgjöld þín á þremur stigum - Lágmarks, Þægilegt, og Lúxus.',
  icon: '📊',
  available: true,
}
```

2. Added `ExpenseBaselineContent` component wrapper following existing pattern:
```typescript
function ExpenseBaselineContent({ onBack }: ExpenseBaselineContentProps) {
  // Hero section with back button
  // Renders ExpenseBaselineCalculator in Section/Container
}
```

3. Added condition in `ExpenseImpactContent`:
```typescript
if (selectedCalculator === 'utgjaldareiknivel') {
  return <ExpenseBaselineContent onBack={() => onSelectCalculator(null)} />;
}
```

**Integration**: Appears in "Áhrif útgjalda" (Expense Impact) tab as first calculator option

---

## File Structure

```
src/
├── components/
│   ├── expenseBaseline/
│   │   ├── ExpenseBaselineCalculator.tsx  (NEW - Main orchestrator)
│   │   ├── WizardModeContainer.tsx        (Epic 3)
│   │   ├── QuickEditModeContainer.tsx     (Epic 4)
│   │   ├── ResultsSummarySection.tsx      (Epic 5)
│   │   └── index.ts                       (Updated barrel export)
│   └── calculator/
│       └── CalculatorPageContent.tsx      (Modified - Added integration)
└── app/
    └── utgjaldareiknivel/
        └── page.tsx                       (NEW - Route page)
```

## User Flow

### First-Time User
1. Navigate to `/utgjaldareiknivel` or select from calculator grid
2. See educational intro explaining three-tier system
3. Auto-directed to wizard mode
4. Complete 11-step wizard (10 categories + summary)
5. Wizard saves and switches to quick edit mode
6. See results summary below edit interface

### Returning User
1. Navigate to calculator
2. See quick edit mode immediately (no wizard)
3. Can edit any tier inline
4. "Byrja aftur" button available to restart wizard
5. See results summary below

## Integration Points

### With Context
- Reads: `expenseBaseline`, `expenseBaselineResults`, `results.actualHourlyWage`
- Writes: `updateExpenseBaseline()` on wizard completion

### With Other Components
- WizardModeContainer - For first-time setup
- QuickEditModeContainer - For returning users
- ResultsSummarySection - For displaying results
- TierSelector - Embedded in other calculators (Epic 6)

### With Routing
- Standalone route: `/utgjaldareiknivel`
- Embedded in calculator hub: `/` (Áhrif útgjalda tab)

## Requirements Fulfilled

- **Task 8.1**: ExpenseBaselineCalculator main component ✅
  - Mode detection ✅
  - Mode toggle ✅
  - Educational intro ✅
  - Conditional rendering ✅

- **Task 8.2**: Route page ✅
  - CalculatorProvider wrapper ✅
  - Suspense boundary ✅
  - Hero section ✅
  - Privacy notice ✅

- **Task 8.3**: Calculator navigation ✅
  - Added to EXPENSE_CALCULATORS (first item) ✅
  - Content wrapper component ✅
  - Routing condition ✅

## Implementation Notes

### Mode Detection Logic
```typescript
// Initial mode based on wizard completion
const [mode, setMode] = useState<ViewMode>(() => {
  return expenseBaseline?.wizardCompleted ? 'quickEdit' : 'wizard';
});
```

### Wizard Completion Handler
```typescript
// Converts Record<string, TierValues> to ExpenseCategory[]
const categories: ExpenseCategory[] = DEFAULT_EXPENSE_CATEGORIES.map(
  (config, index) => ({
    id: config.id,
    name: config.nameIs,
    icon: config.icon,
    values: categoryValues[config.id] || config.defaults,
    isCustom: false,
    isHidden: false,
    order: index,
  })
);

updateExpenseBaseline({
  categories,
  lastUpdated: new Date(),
  wizardCompleted: true,
  version: 1,
});

setMode('quickEdit');
```

### Educational Content
- Collapsible details section explaining three tiers
- Color-coded tier descriptions (Amber/Green/Purple)
- Can be dismissed via X button
- Uses `showEducation` state (default: true)

### AWH Warning
- Shown when `actualHourlyWage` is null/0 AND baseline exists
- Info alert variant
- Encourages user to calculate AWH for life energy features

## Testing Strategy

### Manual Testing
1. **First-time flow**:
   - Navigate to `/utgjaldareiknivel`
   - Verify wizard appears
   - Complete wizard
   - Verify switch to quick edit
   - Verify results appear

2. **Returning user flow**:
   - With existing baseline, visit page
   - Verify quick edit appears
   - Verify results shown
   - Click "Byrja aftur"
   - Verify wizard appears

3. **Navigation integration**:
   - Go to calculator hub
   - Click "Áhrif útgjalda" tab
   - Verify "Útgjaldagrunnur" is first
   - Click it
   - Verify calculator loads

4. **Educational content**:
   - Verify intro section appears
   - Expand/collapse details
   - Click X to dismiss
   - Verify doesn't reappear

### Edge Cases
- No AWH set → warning appears
- Incomplete wizard → stays in wizard mode
- Cancel wizard with existing baseline → returns to quick edit
- Cancel wizard without baseline → stays in wizard

## Related Files

- Epic 3: `WizardModeContainer.tsx`, `WizardProgress.tsx`, `CategoryWizardStep.tsx`, `WizardSummaryStep.tsx`, `WizardNavigation.tsx`
- Epic 4: `QuickEditModeContainer.tsx`, `TierTabSelector.tsx`, `CategoryEditList.tsx`, `CategoryEditRow.tsx`, `AddCustomCategoryModal.tsx`
- Epic 5: `ResultsSummarySection.tsx`, `TierComparisonDisplay.tsx`, `CategoryBreakdownChart.tsx`, `LifeEnergyComparison.tsx`, `TierDifferenceTable.tsx`
- Types: `src/types/expenseBaseline.ts`
- Constants: `src/lib/constants/expenseBaseline.ts`

## Future Enhancements

- Add keyboard shortcut to toggle mode (e.g., Cmd+W for wizard)
- Add tour/tutorial overlay for first-time users
- Add progress save for wizard (can resume later)
- Add export baseline to share with other calculators
- Add comparison to national averages (if data available)
