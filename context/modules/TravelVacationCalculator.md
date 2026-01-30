# Travel/Vacation Cost Calculator

## Location
`apps/peninganaedalifid/src/components/travelVacation/`
`apps/peninganaedalifid/src/lib/calculations/travelVacation.ts`
`apps/peninganaedalifid/src/types/travelVacation.ts`

## Purpose
Helps users understand the TRUE cost of travel in terms of life energy (hours of life) and opportunity cost. Implements "Your Money or Your Life" philosophy for vacation planning.

## Key Features

### 1. Complete Cost Analysis
- Total trip cost with breakdown by category
- Life energy cost (hours of work required)
- Opportunity cost (future value if invested)
- Staycation comparison (optional)
- FI impact calculation (optional)

### 2. Trip Presets
Three common trip types for quick setup:
- Helgarferð til Evrópu (3-4 days)
- Viku sumarhús á Íslandi (7 days)
- Tveggja vikna langhryðjuferð (14 days)

### 3. Six Cost Categories
- Transportation (flights, etc.)
- Accommodation
- Food (per day)
- Activities/Entertainment
- Local transport
- Other expenses

## Exports

### Types (`src/types/travelVacation.ts`)
- `TripInput` - Complete trip input data
- `TripCalculationResult` - All calculation results
- `TravelVacationState` - Component state
- `TripPreset` - Preset configuration
- Constants: `DEFAULT_SETTINGS`, `TRIP_PRESETS`, `STORAGE_KEY`

### Calculation Functions (`src/lib/calculations/travelVacation.ts`)
- `calculateTotalCost()` - Total cost with breakdown
- `calculateLifeEnergyCost()` - Hours of work required
- `calculateOpportunityCost()` - Future value projections
- `calculateStaycationComparison()` - Home vs travel comparison
- `calculateFIImpact()` - Impact on FI timeline
- `calculateTripResult()` - Master calculation function
- `compareTrips()` - Multi-trip comparison (future)
- `applyPreset()` - Apply preset to create trip

### Components (`src/components/travelVacation/`)
- `TravelVacationPage` - Main page component
- `TripInputSection` - Trip details and cost inputs
- `CostInputs` - Six cost category inputs
- `PresetSelector` - Preset selection UI
- `TotalCostCard` - Total cost display
- `LifeEnergyCard` - Life energy cost display
- `OpportunityCostCard` - Future value display
- `StaycationComparisonCard` - Staycation comparison (conditional)
- `FIImpactCard` - FI impact display (conditional)

### Storage (`src/lib/utils/travelVacationStorage.ts`)
- `saveToLocalStorage()` - Persist state
- `loadFromLocalStorage()` - Load saved state
- `clearLocalStorage()` - Clear data

### Validation (`src/lib/utils/travelVacationValidation.ts`)
- `validateTripInput()` - Validate trip data
- `validateSettings()` - Validate settings

## Key Functionality

### Cost Calculations
```typescript
// Total cost = sum of all categories + (food per day × days)
Total = Transportation + Accommodation + (FoodPerDay × Days) +
        Activities + LocalTransport + Other
```

### Life Energy
```typescript
// Hours = Total Cost / Actual Hourly Wage
// Formatted as "X vikur og Y dagar"
```

### Opportunity Cost
```typescript
// Future Value = PV × (1 + r)^n
// Where r = expected return rate (default 7%)
// Calculated for 10, 20, and 30 years
```

### Staycation Comparison
```typescript
// Additional Cost = Trip Cost - (Staycation Daily Cost × Days)
// Shows extra cost to travel vs stay home
```

### FI Impact
```typescript
// Delay = Total Cost / Annual Savings
// Converts to months/years
// Shows trips per year that delays FI by 1 month
```

## Dependencies
- React (UI framework)
- Existing UI components (Card, Input, NumberInput, Button, etc.)
- CalculatorContext (for actualHourlyWage and FI data)
- formatCurrency (from utils/formatters)
- localStorage (for persistence)
- useDebounce hook (for save debouncing)

## Integration
- Uses actualHourlyWage from CalculatorContext
- Optionally uses FI data from CalculatorContext
- Saves state to localStorage with key 'travelVacation_state'
- All calculations are client-side only

## Testing
Unit tests created for:
- All calculation functions
- Validation functions
- Component rendering
- localStorage operations

## Implementation Status
Completed in Phase 2.1.5 - All core features implemented:
- Epic 1: Core Calculation Engine ✅
- Epic 2: Data Layer and Validation ✅
- Epic 3: Basic UI Components ✅
- Epic 4: Main Page Integration (partial) ✅

Future enhancements (not yet implemented):
- Epic 5: Comparison Mode (2-3 trip comparison)
- Epic 6: Polish and Testing (accessibility audit, mobile optimization)

## Related
- Implements: Requirements from specs/travel-vacation/requirements.md
- Based on: Design from specs/travel-vacation/design.md
- Tasks: specs/travel-vacation/tasks.md
- Uses: Actual Hourly Wage Calculator for wage data
