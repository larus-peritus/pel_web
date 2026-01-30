# CommuteForm Component

## Location
`src/components/commute/CommuteForm.tsx`

## Purpose
Form component for adding or editing commute scenarios with dynamic conditional fields based on the selected commute method.

## Exports
- `CommuteForm` - Main form component
- `CommuteFormProps` - TypeScript interface for component props

## Key Functionality
- **Dual Mode Support**: Add and edit modes
- **Dynamic Conditional Fields**: Shows/hides fields based on selected commute method
  - Car: Fuel type, price, consumption, parking, tolls, depreciation, insurance, maintenance, inspection
  - Transit: Ticket type (monthly/per-ride), costs
  - Bike/Walk: Maintenance costs
  - Remote: Informational message (no extra fields)
- **Preset Integration**: Includes CommutePresetSelector in add mode
- **Real-time Validation**: Client-side validation with Icelandic error messages
- **Form State Management**: React useState for all form fields
- **Accessible**: Proper labels, required indicators, help text

## Component Interface

```typescript
interface CommuteFormProps {
  mode: 'add' | 'edit';
  scenario?: CommuteScenario; // Required for edit mode
  onSave: (inputs: CommuteInputs & { name: string }) => void;
  onCancel: () => void;
}
```

## Dependencies
- **UI Components**: Input, NumberInput, Select, Button, Card
- **Validation**: validateCommuteInputs from @/lib/validation/commute
- **Types**: CommuteScenario, CommuteInputs, CommuteMethod, CommutePreset
- **Child Components**: CommutePresetSelector

## State Management
- Basic fields: name, distanceKm, daysPerWeek, commuteMethod, timeMinutesOneWay
- Car fields: fuelType, fuelPrice, fuelConsumption, parking, tolls, depreciation, insurance, maintenance, inspection
- Transit fields: ticketType, monthlyCost, costPerRide
- Active fields: monthlyMaintenanceCost
- Validation errors: errors object

## Validation
- Name: Required, 1-50 characters
- Distance: Required, 0-200 km
- Days per week: Required, 1-7
- Time: Required, 0-300 minutes
- Conditional validation based on commute method via validateCommuteInputs()

## Conditional Rendering Logic
- Preset selector: Only shown in add mode
- Car fields: Shown when commuteMethod === 'car'
  - Fuel price label changes based on fuelType (electric vs gasoline/diesel)
  - Consumption unit changes (kWh vs L)
- Transit fields: Shown when commuteMethod === 'transit'
  - monthlyCost shown when ticketType === 'monthly'
  - costPerRide shown when ticketType === 'per_ride'
- Active fields: Shown when commuteMethod === 'bike' or 'walk'
  - Help text changes based on method
- Remote: Shows success alert with informational message

## Tests
- **Location**: tests/components/commute/CommuteForm.test.tsx
- **Coverage**: 36 tests covering:
  - Add and edit mode rendering
  - Field population and defaults
  - Conditional field visibility
  - Preset selection
  - Validation
  - Form submission
  - Accessibility

## Usage Examples

### Add Mode
```tsx
<CommuteForm
  mode="add"
  onSave={(inputs) => addCommuteScenario(inputs)}
  onCancel={() => setShowForm(false)}
/>
```

### Edit Mode
```tsx
<CommuteForm
  mode="edit"
  scenario={existingScenario}
  onSave={(inputs) => updateCommuteScenario(scenario.id, inputs)}
  onCancel={() => setShowForm(false)}
/>
```

## Integration
- Used by: CommuteCalculator (parent container)
- Uses: CommutePresetSelector for quick setup
- Validates with: validateCommuteInputs() function
- Saves to: CalculatorContext via addCommuteScenario/updateCommuteScenario

## Related
- Implements: Task 4.1 from specs/vinnuferdakostnadur/tasks.md
- Part of: Commute Cost Calculator feature
- Similar to: SubscriptionForm component pattern
