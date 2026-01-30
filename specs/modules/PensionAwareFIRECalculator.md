# PensionAwareFIRECalculator

## Location
`src/components/pensionAwareFire/PensionAwareFIRECalculator.tsx`

## Purpose
Main container component that orchestrates all sub-components for the Pension-Aware FIRE calculator. Manages page layout, state initialization, and conditional rendering of results sections.

## Exports
- `function PensionAwareFIRECalculator(props: PensionAwareFIRECalculatorProps)` - Main calculator page component
- `interface PensionAwareFIRECalculatorProps` - Component props

## Key Functionality
- Hero section with badge, title, and subtitle in Icelandic
- Optional back button for calculator hub integration
- Educational intro component (collapsible, starts collapsed, dismissible)
- Expense baseline status alerts (info when not connected, success when connected)
- Orchestrates all input and results components
- Conditional results rendering (only shows when calculations are complete)
- State initialization on mount if needed
- Loading state handling

## Component Structure

```
PensionAwareFIRECalculator
├── Hero Section
│   ├── Back button (optional)
│   ├── Badge (🎯 Lífeyristengd FIRE)
│   ├── Title
│   └── Subtitle
├── Main Content Container
│   ├── Educational Intro (collapsible/dismissible)
│   ├── Expense Baseline Status Alert
│   ├── BasicInputs
│   ├── PensionInputs
│   └── Results Section (conditional)
│       ├── FINumberComparison
│       ├── PhaseTimeline
│       ├── PhaseBreakdown
│       └── ScenarioComparison
```

## Props

```typescript
interface PensionAwareFIRECalculatorProps {
  /** Optional callback for back button (enables calculator hub integration) */
  onBack?: () => void;
}
```

## State Management

### Context Integration
```typescript
const {
  pensionAwareFire,              // Current state
  pensionAwareFireResults,        // Calculated results
  initializePensionAwareFire,    // Initialize with defaults
  expenseBaselineResults,         // For expense integration
} = useCalculator();
```

### Local State
```typescript
const [introCollapsed, setIntroCollapsed] = useState(true);  // Educational intro starts collapsed
const [introDismissed, setIntroDismissed] = useState(false); // Track dismissal
```

## Conditional Rendering

### Results Section
Only renders when `pensionAwareFireResults !== null`:
- FINumberComparison (traditional vs pension-adjusted)
- PhaseTimeline (visual timeline)
- PhaseBreakdown (detailed phase-by-phase view)
- ScenarioComparison (compare up to 3 scenarios)

### Expense Baseline Alerts
- **No baseline**: Info alert with link to expense baseline calculator
- **Has baseline**: Success alert indicating automatic connection

## Styling

### Color Scheme
- **Background**: Blue gradient (`from-blue-50 via-white to-neutral-50`)
- **Hero**: Blue-indigo-purple gradient (`from-blue-100 via-indigo-50 to-purple-50`)
- **Badge**: Blue (`bg-blue-600`)
- **Back button**: Blue hover effect

### Layout
- **Container**: Max-width with responsive padding
- **Spacing**: Consistent `space-y-8` between sections
- **Responsive**: Works on desktop and mobile

## Dependencies
- `@/context/CalculatorContext` - State management
- `@/components/layout/Container` - Layout wrapper
- `@/components/ui/Alert` - Status alerts
- `./PensionEducationalIntro` - Educational content
- `./BasicInputs` - Age, expenses, savings inputs
- `./PensionInputs` - Pension-specific inputs
- `./PhaseTimeline` - Visual timeline
- `./FINumberComparison` - FI number comparison
- `./PhaseBreakdown` - Phase details
- `./ScenarioComparison` - Scenario comparison

## Tests
- **Location**: `tests/components/pensionAwareFire/PensionAwareFIRECalculator.test.tsx`
- **Coverage**: 23 tests, all passing
- **Test Suites**:
  - Loading State (2 tests)
  - Hero Section (3 tests)
  - Educational Intro (4 tests)
  - Expense Baseline Status (2 tests)
  - Input Components (2 tests)
  - Results Section (3 tests)
  - State Management (2 tests)
  - Accessibility (2 tests)
  - Styling (3 tests)

## Integration

### Used by
- Page route: `src/app/lifeyristengd-fire/page.tsx` (to be created in Task 7.2)
- Calculator hub/index (to be added in Task 8.2)

### Uses
All pension-aware FIRE sub-components:
- PensionEducationalIntro (Task 5.3)
- BasicInputs (Task 5.1)
- PensionInputs (Task 5.2)
- PhaseTimeline (Task 6.1)
- FINumberComparison (Task 6.2)
- PhaseBreakdown (Task 6.3)
- ScenarioComparison (Task 6.4)

## Related
- **Implements**: All user stories from `specs/requirements-pension-aware-fire.md`
- **Part of**: `specs/design-pension-aware-fire.md`
- **Task**: Task 7.1 from `specs/tasks-pension-aware-fire.md`
- **Pattern**: Follows `src/components/leanFire/LeanFIRECalculator.tsx` structure

## Icelandic Content

### Hero Section
- **Badge**: "Lífeyristengd FIRE" (Pension-Linked FIRE)
- **Title**: "Lífeyristengd FIRE Reiknivél" (Pension-Aware FIRE Calculator)
- **Subtitle**: "Reiknaðu raunverulega FI-tölu þína með tilliti til íslenska lífeyriskerfisins"
  (Calculate your real FI number considering the Icelandic pension system)
- **Back button**: "Til baka í FIRE reiknivélalista" (Back to FIRE calculator list)

### Alerts
- **No baseline title**: "Sjálfgefin gildi notuð" (Default values used)
- **Has baseline title**: "Tengd við útgjaldagrunnlínu" (Connected to expense baseline)

## Implementation Notes

### Loading State
Shows animated skeleton while state initializes:
```tsx
<div className="animate-pulse space-y-4">
  <div className="mx-auto h-12 w-96 rounded bg-gray-200" />
  <div className="mx-auto h-6 w-[500px] rounded bg-gray-200" />
</div>
```

### State Initialization
Automatically calls `initializePensionAwareFire()` if state is null:
```tsx
useEffect(() => {
  if (!pensionAwareFire) {
    initializePensionAwareFire();
  }
}, [pensionAwareFire, initializePensionAwareFire]);
```

### Educational Intro Behavior
- Starts collapsed by default
- Can be expanded/collapsed
- Can be dismissed (removes from DOM)
- Dismissal is component-local (not persisted)

## Status
✅ **Completed** - 2026-01-30
- Component implemented (197 lines)
- Barrel export created
- Tests written and passing (23 tests)
- Documentation created
- All acceptance criteria met
