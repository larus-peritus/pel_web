# CommuteCalculator

## Location
`apps/peninganaedalifid/src/components/commute/CommuteCalculator.tsx`

## Purpose
Main container component that orchestrates all commute cost calculation features. Provides a complete UI for managing multiple commute scenarios, comparing them, and viewing their impact on life energy.

## Component Details

### Props
```typescript
interface CommuteCalculatorProps {
  className?: string;
}
```

### Features
- **Scenario Management**: Create, edit, delete, and duplicate up to 4 commute scenarios
- **Accordion Pattern**: Expandable/collapsible scenario list, similar to SubscriptionBurnMeter
- **Dual View Modes**: Toggle between "Atburðarásir" (scenarios list) and "Samanburður" (comparison view)
- **Form Integration**: Inline form for adding/editing scenarios with CommuteForm component
- **Summary Display**: Shows CommuteSummary when scenario is expanded
- **Comparison Display**: Shows CommuteComparison when in comparison mode
- **Validation**: Enforces max 4 scenarios limit, shows appropriate warnings
- **Empty States**: Helpful prompts when no scenarios exist or comparison view needs more scenarios

### State Management
Uses CalculatorContext via `useCalculator()` hook:
- `commuteScenarios`: Array of all scenarios
- `addCommuteScenario()`: Create new scenario
- `updateCommuteScenario()`: Modify existing scenario
- `deleteCommuteScenario()`: Remove scenario
- `duplicateCommuteScenario()`: Copy scenario
- `results?.actualHourlyWage`: For life energy calculations

### Local State
- `viewMode`: Toggle between 'scenarios' | 'comparison'
- `isFormOpen`: Controls form visibility
- `editingScenario`: Tracks scenario being edited
- `expandedScenarios`: Set of expanded scenario IDs
- `deletingScenarioId`: Tracks scenario pending deletion (for confirmation)

### User Actions
1. **Add Scenario**: Click "Bæta við atburðarás" button (disabled at 4 scenarios)
2. **Edit Scenario**: Click edit icon on scenario card
3. **Delete Scenario**: Click delete icon, confirm in inline confirmation dialog
4. **Duplicate Scenario**: Click copy icon (disabled at 4 scenarios)
5. **Expand/Collapse**: Click anywhere on scenario header
6. **Switch Views**: Use tabs to toggle between scenarios list and comparison

### Warnings and Validation
- Shows alert if `actualHourlyWage === 0` with link to main calculator
- Shows info alert when 4 scenarios exist
- Disables "Add" button at 4 scenarios
- Disables "Duplicate" button at 4 scenarios
- Shows error alert on save/duplicate failures
- Requires minimum 2 scenarios for comparison view

## Dependencies
- `useCalculator()` - from CalculatorContext
- `CommuteForm` - for scenario input
- `CommuteSummary` - for scenario results display
- `CommuteComparison` - for multi-scenario comparison
- `Button`, `Card`, `Alert` - UI components
- `lucide-react` icons - ChevronDown, ChevronUp, Edit, Trash2, Copy

## Key Functionality
- **Accordion Interaction**: Click header to expand/collapse, action buttons stop propagation
- **Delete Confirmation**: Inline confirmation dialog prevents accidental deletion
- **Form Modes**: Supports both 'add' and 'edit' modes
- **Error Handling**: Try-catch blocks with user-friendly alert messages
- **View Persistence**: Automatically switches to scenarios view when adding new scenario

## Integration
- **Used by**: `CommuteCalculatorContent` in CalculatorPageContent.tsx
- **Uses**: CommuteForm, CommuteSummary, CommuteComparison components
- **Context**: Integrated with CalculatorContext for state management

## Related
- Implements: Task 6.1 from specs/vinnuferdakostnadur/tasks.md
- Pattern follows: SubscriptionBurnMeter component
- Part of: Vinnuferðakostnaður (Commute Cost Calculator) feature

## Implementation Notes
- All text in Icelandic
- Follows exact pattern from SubscriptionBurnMeter for consistency
- Accordion pattern provides compact view with expandable details
- Inline confirmation for destructive actions improves UX
- Empty states guide users on next steps
- Responsive design considerations in child components
