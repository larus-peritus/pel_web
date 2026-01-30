# Commute Types

## Location
`src/types/calculator.ts` (lines 186-318)

## Purpose
Provides comprehensive TypeScript type definitions for the Commute Cost Calculator feature, including all input types, result types, preset types, and supporting interfaces.

## Exports

### Core Types

- `type CommuteMethod = 'car' | 'transit' | 'bike' | 'walk' | 'remote'` - Union type for commute methods
- `const COMMUTE_METHOD_LABELS: Record<CommuteMethod, string>` - Icelandic labels for each commute method

### Input Types

- `interface CarCommuteDetails` - Car-specific inputs (fuel type, price, consumption, parking, tolls, depreciation, insurance, maintenance, inspection)
- `interface TransitCommuteDetails` - Transit-specific inputs (ticket type, costs)
- `interface ActiveCommuteDetails` - Bike/walk inputs (maintenance cost)
- `interface CommuteInputs` - Main input interface with conditional detail types based on method

### Result Types

- `interface CommuteCostBreakdownItem` - Individual cost breakdown item for charts
- `interface CommuteResults` - Complete calculation results including:
  - Cost breakdown (direct, indirect, total, yearly)
  - Time breakdown (minutes, hours, days)
  - Life energy calculations (from time, from money, total)
  - FI impact (future value at 5, 10, 20 years)
  - Cost breakdown array for charts

### Scenario Types

- `interface CommuteScenario` - Saved commute scenario for comparison (includes inputs, results, metadata)
- `interface CommutePreset` - Preset scenario template for quick setup

## Key Functionality

### Conditional Types
The `CommuteInputs` interface uses conditional properties based on the selected `commuteMethod`:
- If `car`: requires `car?: CarCommuteDetails`
- If `transit`: requires `transit?: TransitCommuteDetails`
- If `bike` or `walk`: requires `active?: ActiveCommuteDetails`
- If `remote`: no additional properties required

### Integration with StoredState
Extended the existing `StoredState` interface to include:
- `commuteScenarios: CommuteScenario[]` - Array of up to 4 saved commute scenarios

## Dependencies

### Internal
- Extends existing `StoredState` interface
- Used by commute calculation functions
- Used by commute components (future implementation)

### External
None - pure TypeScript type definitions

## Integration

### Used by
- `src/lib/calculations/commute.ts` - Calculation functions
- Future commute components (forms, summaries, comparisons)

### Uses
- `StoredState` interface (extended to include commute scenarios)

## Related

- Implements: Requirements NS-1 through NS-6 from `specs/vinnuferdakostnadur/requirements.md`
- Part of: `specs/vinnuferdakostnadur/design.md` - Data Models section
- See also: `context/modules/CommuteCalculations.md` for calculation implementations

## Design Decisions

1. **Conditional Types**: Using optional properties (car?, transit?, active?) rather than discriminated unions to keep the type system simple and allow partial state during form filling

2. **Icelandic Labels**: Labels are defined as constants alongside types for easy access throughout the application

3. **Comprehensive Results**: `CommuteResults` includes all calculation outputs to minimize re-calculation needs

4. **FI Impact**: Includes multiple time horizons (5, 10, 20 years) to give users different perspectives on long-term impact

5. **Max 4 Scenarios**: Limited to 4 scenarios for comparison UI manageability (enforced at application level, not type level)

## Notes

- All monetary values are in ISK (Icelandic króna)
- All distances are in kilometers
- All times are in minutes (for inputs) or hours (for results)
- Fuel consumption uses standard units: L/100km for gas/diesel, kWh/100km for electric
- All user-facing labels and text are in Icelandic
