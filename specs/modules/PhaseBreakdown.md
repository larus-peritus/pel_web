# PhaseBreakdown Component

## Location
`src/components/pensionAwareFire/PhaseBreakdown.tsx`

## Purpose
Displays detailed breakdown of each retirement phase in the Pension-Aware FIRE calculator. Shows income sources, expenses, surplus/deficit, and funding requirements for each phase with collapsible cards for clean navigation.

## Component Type
React Client Component (UI Display)

## Props
```typescript
interface PhaseBreakdownProps {
  phases: RetirementPhase[];  // Array of retirement phases to display
  className?: string;          // Optional styling
}
```

## Key Features

### 1. Phase Card Display
- Each retirement phase rendered as a color-coded card
- Phase number, name (Icelandic), age range, and duration
- Border and header colors match phase type:
  - **Gap phase**: Red/Orange (self-funded danger)
  - **Séreign bridge**: Amber (partial coverage)
  - **Full pension**: Green (full coverage)

### 2. Income Sources Breakdown
For each phase, displays all applicable income sources:
- **Sparnaður úttekt** (Savings withdrawal)
- **Ávöxtun** (Investment returns - with ~ prefix)
- **Séreign** (Private pension)
- **Lífeyrissjóður** (Occupational pension)
- **TR** (State pension)
- **Samtals** (Total monthly income)

Zero-value sources are hidden for clarity.

### 3. Expenses Display
- **Mánaðarleg** (Monthly expenses)
- **Samtals** (Total - same as monthly for consistency)

### 4. Surplus/Deficit Indicator
Visual alerts for monthly cash flow:
- **Green indicator** (Afgangur): When income > expenses, shows surplus amount
- **Red indicator** (Halli): When income < expenses, shows deficit amount
- No indicator when balanced

### 5. Funding Requirements
- **Þörf í upphafi stigs**: Required funding at start of phase (blue)
- **Staða í lok stigs**: Remaining balance at end of phase (green if positive)
- Shows "(flutt í næsta stig)" for non-final phases with remainder

### 6. Collapsible Functionality
- All phase cards expanded by default
- Click header to toggle individual phase
- **"Opna öll"** button to expand all phases
- **"Loka öllum"** button to collapse all phases
- Smooth expand/collapse transitions

## Visual Design

### Color Coding
Matches PhaseTimeline component for consistency:
```typescript
Gap Phase:
  Border: border-red-300
  Header: bg-gradient-to-r from-red-50 to-orange-50

Séreign Bridge:
  Border: border-amber-300
  Header: bg-gradient-to-r from-amber-50 to-yellow-50

Full Pension:
  Border: border-green-300
  Header: bg-gradient-to-r from-green-50 to-emerald-50
```

### Layout
- **Desktop**: Two-column grid for income/expenses side-by-side
- **Mobile**: Single column stack (responsive)
- **Spacing**: Clean padding, clear visual hierarchy
- **Icons**: Chevron for expand/collapse, checkmark for surplus, warning for deficit

## Icelandic Labels
All UI text in Icelandic:
- Stig 1/2/3 (Phase 1/2/3)
- Biðtími (Gap Period)
- Séreign-brú (Séreign Bridge)
- Fullur lífeyrir (Full Pension)
- Tekjur (Income)
- Útgjöld (Expenses)
- Sparnaður úttekt (Savings withdrawal)
- Ávöxtun (Investment returns)
- Samtals (Total)
- Afgangur (Surplus)
- Halli (Deficit)
- Þörf í upphafi stigs (Required at start)
- Staða í lok stigs (Balance at end)
- Fjármögnunarþörf (Funding requirements)
- Opna öll (Expand all)
- Loka öllum (Collapse all)

## State Management
Internal state only:
- `expandedPhases: Set<string>` - Tracks which phase IDs are expanded
- No context integration needed (pure display component)

## Dependencies
- `@/components/ui/Card` - Card, CardHeader, CardContent
- `@/lib/utils` - cn (classname utility), formatCurrency
- `@/types/pensionAwareFire` - RetirementPhase type

## Tests
- **Location**: `tests/components/pensionAwareFire/PhaseBreakdown.test.tsx`
- **Coverage**: 29 tests (all passing)
- **Test Categories**:
  - Rendering (3 tests) - Empty state, single phase, multiple phases
  - Collapsible Behavior (5 tests) - Individual toggle, expand/collapse all
  - Income Sources Display (5 tests) - All sources, correct per phase, zero hiding
  - Expenses Display (1 test) - Monthly display
  - Surplus/Deficit Indicators (3 tests) - Surplus green, deficit red, zero handling
  - Funding Requirements (4 tests) - Start/end balances, transfer text
  - Visual Styling (4 tests) - Border colors, header gradients per phase
  - Accessibility (3 tests) - Semantic HTML, ARIA, button types
  - Integration (1 test) - Funding chain across all phases

## Edge Cases Handled
1. **Empty phases array**: Shows "Engar eftirlaunafasar til að sýna."
2. **Zero income sources**: Hidden from display
3. **Final phase**: No "flutt í næsta stig" text
4. **Zero surplus**: No surplus indicator shown
5. **Balanced cash flow**: Neither surplus nor deficit shown
6. **Large numbers**: Properly formatted with formatCurrency

## Integration
- **Used by**: PensionAwareFIRECalculator (future Task 7.1)
- **Data source**: `pensionAwareFireResults.phases` from CalculatorContext
- **Coordinates with**: PhaseTimeline (uses same color scheme)

## Accessibility
- Semantic HTML structure (headings, sections)
- ARIA labels on icons (`aria-hidden="true"` for decorative)
- Button `type="button"` to prevent form submission
- Keyboard navigation support
- Clear visual hierarchy

## Related
- Implements: Requirements US-1, US-4 from `specs/requirements-pension-aware-fire.md`
- Part of: Epic 6 - Results Components in `specs/tasks-pension-aware-fire.md`
- Task 6.3: PhaseBreakdown Component (completed 2026-01-30)
- Design: Phase breakdown visualization from `specs/design-pension-aware-fire.md`

## Performance
- Pure component (no external data fetching)
- Efficient re-renders (only when phases prop changes)
- Collapsible to reduce DOM size for better performance

## Future Enhancements (Not in MVP)
- Export phase data as CSV/PDF
- Detailed hover tooltips with calculations
- Year-by-year breakdown toggle
- Inflation-adjusted values option
- Print-optimized view
