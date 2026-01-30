# ScenarioManager Component

## Location
`apps/peninganaedalifid/src/components/calculator/ScenarioManager.tsx`

## Purpose
UI component for managing saved calculation scenarios. Allows users to save up to 3 different calculation scenarios for comparison, load previously saved scenarios, and delete scenarios they no longer need.

## Component Details

### ScenarioManager
Interactive component for scenario management with save, load, and delete functionality.

**Features:**
- Save current calculator state as named scenario
- Display list of saved scenarios
- Load scenario to restore inputs
- Delete scenarios
- Enforce 3-scenario maximum limit
- Show actual wage for each scenario
- Input validation for scenario names
- Keyboard shortcuts (Enter to save, Escape to cancel)

## UI Structure

### Header Section
- Title: "Saved Scenarios"
- Description: "Compare up to 3 different scenarios"
- Badge showing count (e.g., "2/3")

### Save Section
**Initial State:**
- Primary button: "Save Current as Scenario"
- Shows "Enter income to save scenario" when no results
- Shows "Maximum scenarios reached" when at limit

**Naming State:**
- Text input for scenario name
- Save button (disabled if name empty/whitespace)
- Cancel button
- Keyboard support:
  - Enter: Save scenario
  - Escape: Cancel naming

### Scenario List Section
**Empty State:**
- "No saved scenarios yet. Save your current calculation to compare later."

**With Scenarios:**
- Each scenario shows:
  - Scenario name (bold)
  - Actual hourly wage (formatted currency)
  - Load button (secondary)
  - Delete button (secondary, danger-colored)

## State Management

### Local State
- `newScenarioName`: string - Input value for new scenario name
- `isNaming`: boolean - Controls display of naming form

### Context Integration
Uses `useCalculator` hook to access:
- `results`: Current calculation results (null check for save button)
- `scenarios`: Array of saved scenarios
- `saveCurrentAsScenario(name)`: Save current state
- `loadScenario(id)`: Load scenario by ID
- `deleteScenario(id)`: Delete scenario by ID

## User Interactions

### Save Scenario Flow
1. User clicks "Save Current as Scenario"
2. Input form appears with autofocus
3. User enters scenario name
4. User clicks Save or presses Enter
5. Scenario saved via context
6. Form resets to initial state

### Load Scenario Flow
1. User clicks "Load" on a scenario
2. Context loads scenario inputs
3. Calculator recalculates results

### Delete Scenario Flow
1. User clicks "Delete" on a scenario
2. Scenario removed from context
3. UI updates to show remaining scenarios

## Validation Rules

### Save Button Enabled When:
- Results exist (income entered)
- Scenario count < 3

### Save Name Button Enabled When:
- Name is not empty
- Name is not only whitespace

### Name Trimming
- Leading/trailing whitespace removed before saving

## Styling

### Card Layout
- Variant: outlined
- Contains CardHeader and CardContent

### Scenario Items
- Background: neutral-50
- Border: neutral-200
- Rounded: lg
- Padding: 3 (12px)

### Delete Button
- Variant: secondary
- Text color: danger-600
- Hover: danger-50 background

## Accessibility

### Keyboard Support
- Tab navigation through all buttons
- Enter key saves scenario
- Escape key cancels naming
- Autofocus on input when naming starts

### ARIA Attributes
- Button states (enabled/disabled)
- Input placeholder provides example
- Clear button labels ("Load", "Delete", "Save", "Cancel")

## Dependencies

### UI Components
- `Card`, `CardHeader`, `CardContent` from @/components/ui/Card
- `Button` from @/components/ui/Button
- `Input` from @/components/ui/Input
- `Badge` from @/components/ui/Badge

### Utilities
- `formatCurrency` from @/lib/utils
- `cn` from @/lib/utils

### Context
- `useCalculator` from @/context/CalculatorContext

### Types
- Scenario type from @/types/calculator

## Testing

**Location:** `tests/components/calculator/ScenarioManager.test.tsx`

**Coverage:** 18 tests, all passing

**Test Categories:**
1. **Rendering** (3 tests)
   - Basic component render
   - Header and badge display
   - Empty state display

2. **Save Button States** (3 tests)
   - Enabled when results exist
   - Disabled when no results
   - Disabled at max scenarios

3. **Naming Form** (6 tests)
   - Form appears on button click
   - Save with valid name
   - Whitespace trimming
   - Save button disabled for empty name
   - Enter key saves
   - Escape key cancels

4. **Cancel Functionality** (2 tests)
   - Cancel button works
   - Form resets after save

5. **Scenario Display** (2 tests)
   - List renders scenarios
   - Count badge updates

6. **Scenario Actions** (2 tests)
   - Load button calls loadScenario
   - Delete button calls deleteScenario

## Integration

### Used By
- Main calculator page (when implemented)
- Scenario comparison views

### Uses
- CalculatorContext for all scenario operations
- UI components for consistent styling

## Related

### Implements
- Requirement SC.1: Save current inputs as scenario (up to 3)
- Requirement SC.2: Load saved scenario
- Requirement SC.3: Delete scenario
- From `specs/actual-hourly-wage-calculator/requirements.md`

### Part Of
- Task 22: Implement Scenario Management
- From `specs/actual-hourly-wage-calculator/tasks.md`

### Supports
- Task 23: Scenario Comparison View
- Will provide scenarios to compare

## Implementation Notes

### Maximum Scenarios
- Hardcoded to 3 scenarios via `MAX_SCENARIOS` constant
- Context enforces this limit in `saveCurrentAsScenario`
- UI prevents save button when at limit

### Scenario Display
- Shows actual hourly wage (most important metric)
- Formatted as currency with 2 decimal places
- Includes "/hr" suffix for clarity

### UX Decisions
- Autofocus on input for quick scenario naming
- Keyboard shortcuts for power users
- Clear disabled states with explanatory text
- Delete button danger-colored to prevent accidents
- Whitespace trimming prevents empty-looking names

### Performance
- No expensive calculations (data from context)
- Simple list rendering
- No debouncing needed (operations are fast)

## Future Enhancements

Potential improvements for future tasks:
1. Scenario editing (rename scenarios)
2. Scenario notes/descriptions
3. Scenario timestamps display
4. Scenario duplication
5. Export/import scenarios separately
6. Scenario comparison preview in list
7. Drag-to-reorder scenarios
8. Confirmation dialog for delete
9. Undo delete functionality
10. Scenario tags/categories
