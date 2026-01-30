# Commute Validation

## Location
`src/lib/validation/commute.ts`

## Purpose
Provides comprehensive input validation for the Commute Cost Calculator with all error messages in Icelandic.

## Exports

### Types
- `CommuteValidationResult` - Validation result interface with isValid flag and errors record

### Functions
- `validateCommuteInputs(inputs: Partial<CommuteInputs>)` - Validates all commute input fields with conditional validation based on commute method
- `validateScenarioName(name: string)` - Validates scenario name (1-50 characters)

## Key Functionality

### Basic Field Validation
- **distanceKm**: Must be 0-200 km
- **daysPerWeek**: Must be 1-7 (integer)
- **timeMinutesOneWay**: Must be 0-300 minutes
- **commuteMethod**: Must be valid enum value

### Conditional Validation by Commute Method

**Car (`commuteMethod === 'car'`)**:
- Requires `car` object
- `fuelType`: Must be 'gasoline', 'diesel', or 'electric'
- `fuelPrice`: Must be > 0 and < 1000 kr
- `fuelConsumption`: Must be > 0 and < 50
- All costs (parking, tolls, depreciation, insurance, maintenance, inspection): Must be >= 0

**Transit (`commuteMethod === 'transit'`)**:
- Requires `transit` object
- `ticketType`: Must be 'monthly' or 'per_ride'
- If monthly: `monthlyCost` required and > 0
- If per-ride: `costPerRide` required and > 0

**Active (`commuteMethod === 'bike' | 'walk'`)**:
- Requires `active` object
- `monthlyMaintenanceCost`: Must be >= 0

**Remote (`commuteMethod === 'remote'`)**:
- No additional validation (only basic fields)

## Dependencies
- `@/types/calculator` - CommuteInputs type

## Tests
- Location: `tests/lib/validation/commute.test.ts`
- Coverage: 22 tests covering all validation rules
- All tests passing

## Integration
- Used by: Commute form components (future)
- Part of: Commute Cost Calculator feature (Epic 3)

## Error Messages
All error messages are in Icelandic as per app requirements:
- "Fjarlægð er nauðsynleg"
- "Dagar á viku verða að vera að minnsta kosti 1"
- "Eldsneytisverð verður að vera hærra en 0"
- "Heiti má ekki vera tómt"
- etc.

## Related
- Implements: Requirements NS-1 from vinnuferdakostnadur/requirements.md
- Part of: Epic 3 (Validation and Context Integration)
- Task: 3.1 from vinnuferdakostnadur/tasks.md
