# PensionScenarioComparison Module

## Location
`src/components/pensionAwareFire/ScenarioComparison.tsx`

## Purpose
Allows users to save and compare up to 3 different retirement scenarios side-by-side in a comparison table. Highlights the best values across scenarios to help users make informed decisions about their retirement planning.

## Exports
- `ScenarioComparison` (default component)

## Component Features

### 1. Save Scenarios
- Save current calculator state with custom name
- Maximum of 3 scenarios enforced
- Input validation (name required, trimmed)
- Modal interface for naming scenarios
- Persists across page reloads via CalculatorContext

### 2. Comparison Table
Displays key metrics for each saved scenario:
- **Heiti** (Name): User-provided scenario name + retirement age
- **FI þörf** (FI needed): Pension-adjusted FI number
- **Biðtími** (Gap years): Years before any pension income
- **Tími til FI** (Time to FI): Years to reach FI from current age
- **Afgangur við 90** (Surplus at 90): Estimated remaining funds

### 3. Best Value Highlighting
- Green background and text for best values in each row
- Checkmark (✓) indicator for best values
- Different criteria per metric:
  - FI needed: Lower is better
  - Gap years: Lower is better
  - Time to FI: Lower is better
  - Surplus at 90: Higher is better

### 4. Delete Scenarios
- Delete button per scenario
- Two-click confirmation required
- Confirmation resets after 3 seconds
- Visual feedback (red styling on confirmation)

### 5. Empty State
- Informative empty state when no scenarios saved
- Explanation of feature purpose
- Call to action when results available
- Warning when no results available yet

### 6. Max Scenarios Enforcement
- "Hámark náð" message when 3 scenarios saved
- Save button hidden when at max
- Configurable via `maxScenarios` prop (defaults to 3)

## Props

```typescript
interface ScenarioComparisonProps {
  maxScenarios?: number; // Default: 3
}
```

## Context Dependencies

Uses `useCalculator()` hook from CalculatorContext:
- `pensionAwareFire` - Current state with saved scenarios array
- `pensionAwareFireResults` - Current calculation results
- `savePensionScenario(name)` - Save current scenario
- `deletePensionScenario(id)` - Delete a scenario

## Data Flow

```
User Action
    ↓
Click "Vista núverandi"
    ↓
Enter scenario name
    ↓
savePensionScenario(name) → CalculatorContext
    ↓
Context saves snapshot of inputs + results
    ↓
Persists to localStorage
    ↓
Component re-renders with new scenario in table
```

## Comparison Logic

### Best Value Determination

For each metric, finds min/max across scenarios:
```typescript
// Lower is better for FI needed, gap years, time to FI
const isBetterWhenLower = key !== 'estimatedSurplusAt90';

const bestValue = isBetterWhenLower
  ? Math.min(...values)
  : Math.max(...values);
```

### Highlighting
- Cell with best value gets `text-green-600 bg-green-50` classes
- Checkmark added to best value cells
- No highlighting when only 1 scenario (nothing to compare)

## UI Design

### Color Scheme
- Primary: Blue/indigo gradient for save button
- Success: Green for best values
- Warning: Amber for max scenarios message
- Danger: Red for delete confirmation
- Info: Blue for hints and tips

### Layout
- Card container with padding
- Header with title and save button
- Responsive table (horizontal scroll on mobile)
- Alternating row hover states
- Legend explaining highlighting
- Info box with comparison tips

### Table Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  Atburðarásir                              [+ Vista núverandi]  │
├─────────────────────────────────────────────────────────────────┤
│           │ Snemmbúin    │ Hefðbundin   │ Varfærin            │
│           │ (hætta 50)   │ (hætta 55)   │ (hætta 60)          │
├───────────┼──────────────┼──────────────┼─────────────────────┤
│ FI þörf   │ 45.2M kr     │ 28.5M kr     │ 12.1M kr ✓         │
│ Biðtími   │ 10 ár        │ 5 ár         │ 0 ár ✓             │
│ Tími til  │ 12 ár        │ 8 ár         │ 5 ár ✓             │
│ Afgangur  │ +15.0M kr    │ +42.0M kr    │ +89.0M kr ✓        │
└─────────────────────────────────────────────────────────────────┘
```

## Icelandic Labels

| English | Icelandic |
|---------|-----------|
| Scenarios | Atburðarásir |
| Save current | Vista núverandi |
| Delete | Eyða |
| Confirm deletion | Staðfesta eyðingu |
| Maximum reached | Hámark náð |
| No scenarios saved | Engar atburðarásir vistaðar |
| FI needed | FI þörf |
| Gap years | Biðtími |
| Time to FI | Tími til FI |
| Surplus at 90 | Afgangur við 90 |
| Compare different retirement plans | Berðu saman mismunandi eftirlaunaáætlanir |

## Integration Points

### Saved in Context State
Each saved scenario contains:
```typescript
{
  id: string;              // Unique ID: `scenario-${timestamp}`
  name: string;            // User-provided name
  createdAt: Date;         // Creation timestamp
  inputs: Partial<PensionAwareFireState>;  // Snapshot of inputs
  results: PensionAwareFireResults;        // Snapshot of results
}
```

### LocalStorage Persistence
- Saved via `CalculatorContext.saveToStorage()`
- Restored on page load via `loadFromStorage()`
- Key: `pensionAwareFire_state` (from constants)

## Testing

### Test Coverage (52 passing tests)

**Empty State (4 tests)**
- Renders empty state correctly
- Shows/hides save button based on results availability
- Opens input modal on save click

**Save Scenario (5 tests)**
- Saves with valid name
- Saves on Enter key press
- Alerts on empty name
- Trims whitespace from name
- Closes modal on cancel

**Scenario Display (9 tests)**
- Displays all scenarios in table
- Shows all metric rows correctly
- Formats ISK amounts with millions
- Highlights best values per metric

**Delete Scenario (3 tests)**
- Shows delete button per scenario
- Requires confirmation before deleting
- Deletes after confirmation

**Max Scenarios (2 tests)**
- Shows "Hámark náð" when at max
- Respects custom maxScenarios prop

**Accessibility (2 tests)**
- Proper table structure (thead/tbody)
- Descriptive button titles

**Legend and Info (2 tests)**
- Displays legend for best values
- Shows info note about comparison

### Test File
`tests/components/pensionAwareFire/ScenarioComparison.test.tsx`

### Test Commands
```bash
# Run all tests
npm test -- ScenarioComparison.test.tsx

# Run with coverage
npm test -- ScenarioComparison.test.tsx --coverage
```

## User Interactions

### Save Flow
1. User completes calculator inputs and gets results
2. Clicks "Vista núverandi" button
3. Modal opens with name input
4. User enters scenario name (e.g., "Snemmbúin (hætta 50)")
5. Clicks "Vista" or presses Enter
6. Scenario appears in comparison table
7. Can repeat up to 3 scenarios total

### Compare Flow
1. User has 2-3 scenarios saved
2. Views comparison table
3. Identifies best values (green highlighting)
4. Compares trade-offs:
   - Earlier retirement = higher FI needed, longer gap
   - Later retirement = lower FI needed, shorter gap, more surplus

### Delete Flow
1. User hovers over scenario column
2. Clicks "Eyða" button
3. Button changes to "Staðfesta eyðingu" (red)
4. User clicks again to confirm
5. Scenario removed from table
6. Confirmation resets after 3 seconds if not clicked

## Performance Considerations

- Lightweight component (no heavy calculations)
- Best value determination: O(n×m) where n=scenarios, m=metrics (max 3×4=12 comparisons)
- Table renders efficiently with React keys
- No unnecessary re-renders (memoization not needed for 3 scenarios)

## Accessibility

- Semantic HTML table structure
- `<thead>` and `<tbody>` for screen readers
- `title` attributes on delete buttons
- Keyboard accessible (Tab navigation)
- Focus management in input modal
- Clear visual hierarchy

## Edge Cases Handled

1. **No scenarios saved**: Empty state with explanation
2. **No results yet**: Warning message in empty state
3. **Max scenarios reached**: Hide save button, show message
4. **Only 1 scenario**: No highlighting (nothing to compare)
5. **Null values**: Handled with `formatYears()` helper
6. **Negative surplus**: Red text color
7. **Empty name**: Alert prevents saving
8. **Whitespace name**: Trimmed before saving

## Future Enhancements (v2)

- Export comparison to PDF/image
- Drag-and-drop reordering of scenarios
- Scenario notes/description field
- More metrics (e.g., total contributions, net worth at retirement)
- Visual chart comparing scenarios
- Scenario editing (not just delete)
- Share scenarios via URL

## Related Components

- `BasicInputs` - Provides input data for scenarios
- `PensionInputs` - Provides pension data for scenarios
- `PhaseTimeline` - Visual representation of a single scenario
- `FINumberComparison` - Shows single scenario FI comparison

## Related Documentation

- Requirements: specs/requirements-pension-aware-fire.md (US-7)
- Design: specs/design-pension-aware-fire.md (Component 8)
- Tasks: specs/tasks-pension-aware-fire.md (Task 6.4)
- Context: context/modules/PensionAwareFireContext.md
