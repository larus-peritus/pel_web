# One-Time Purchase Decision Tool

## Location
`apps/peninganaedalifid/src/app/one-time-purchase/page.tsx`

## Purpose
Helps users evaluate large purchases in terms of:
- Life energy cost (hours of work required)
- Opportunity cost (future value if invested)
- FI impact (delay on financial independence timeline)

Based on "Your Money or Your Life" philosophy.

## Key Files Created

### Types
- `src/types/oneTimePurchase.types.ts`
  - All TypeScript interfaces for purchase calculations
  - Default settings and initial state
  - Storage key constants

### Calculation Engine
- `src/lib/calculations/oneTimePurchaseCalculations.ts`
  - `calculateLifeEnergyCost()` - Converts price to work hours
  - `formatLifeEnergy()` - Formats hours in Icelandic (vikur, dagar, klukkustundir)
  - `calculateFutureValue()` - Compound interest calculation
  - `calculateFutureValues()` - Future values for multiple time periods
  - `calculateFIImpact()` - Impact on FI timeline (optional)
  - `calculatePurchaseResult()` - Master calculation function
  - `compareOptions()` - Compares 2-3 purchase options

### Validation
- `src/lib/utils/oneTimePurchaseValidation.ts`
  - `validatePurchaseInput()` - Validates purchase price and name
  - `validateSettings()` - Validates calculation settings

### Storage
- `src/lib/storage/oneTimePurchaseStorage.ts`
  - `saveToLocalStorage()` - Persists state
  - `loadFromLocalStorage()` - Loads saved state
  - `clearLocalStorage()` - Clears saved data

### UI Components
- `src/app/one-time-purchase/page.tsx`
  - Main page component
  - Purchase input form
  - Results display (life energy, opportunity cost, FI impact)
  - Comparison mode (up to 3 options)
  - localStorage integration with debouncing

## Exports

### Calculation Functions
```typescript
export function calculateLifeEnergyCost(
  purchasePrice: number,
  actualHourlyWage: number
): LifeEnergyCost

export function calculatePurchaseResult(
  input: PurchaseInput,
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings
): PurchaseCalculationResult

export function compareOptions(
  options: PurchaseInput[],
  userData: RequiredUserData,
  settings: PurchaseCalculationSettings
): PurchaseComparison
```

### Types
```typescript
export interface PurchaseInput {
  price: number;
  name?: string;
}

export interface PurchaseCalculationResult {
  input: PurchaseInput;
  lifeEnergyCost: LifeEnergyCost;
  futureValues: FutureValueResult[];
  fiImpact?: FIImpact;
}
```

## Key Functionality

### Life Energy Calculation
- Converts purchase price to work hours using actualHourlyWage
- Formats output in weeks/days/hours with proper Icelandic singular/plural
- Examples: "2 vikur", "1 vika og 3 dagar", "5.5 klukkustundir"

### Future Value Calculation
- Uses compound interest formula: FV = PV × (1 + r)^n
- Default rate: 7% annual return
- Default periods: 10, 20, 30 years
- User-adjustable return rate (0-15%)

### FI Impact (Optional)
- Calculates delay on FI timeline if user has FI data
- Simple model: delay = purchasePrice / annualSavings
- Displays in months with Icelandic formatting

### Comparison Mode
- Compare up to 3 purchase options side-by-side
- Highlights cheapest option
- Shows life energy hours and 20-year future value

## Dependencies
- React 18+ (hooks: useState, useEffect)
- CalculatorContext (for actualHourlyWage)
- UI Components: Card, Button, Alert, CurrencyInput, Input, NumberInput
- localStorage (for persistence with 500ms debounce)

## Integration
- **Requires**: Actual Hourly Wage Calculator (provides actualHourlyWage)
- **Uses**: CalculatorContext to get user's actual hourly wage
- **Optional**: FI data from context for FI impact calculations
- **Persisted**: localStorage with key 'oneTimePurchase_state'

## Tests
All calculation logic has comprehensive unit tests:
- **41 tests** for calculations (oneTimePurchaseCalculations.test.ts)
- **15 tests** for validation (oneTimePurchaseValidation.test.ts)
- **11 tests** for storage (oneTimePurchaseStorage.test.ts)
- **Total: 67 tests**, all passing

### Test Coverage
- Life energy calculation and formatting
- Future value calculations (10/20/30 years)
- FI impact calculations
- Input validation (price, name, settings)
- localStorage persistence and error handling
- Comparison logic (2-3 options)
- Edge cases (zero/negative values, missing data)

## UI Features
- **Icelandic Interface**: All text in Icelandic
- **Real-time Calculations**: Updates as user types (debounced)
- **Warning for Missing Data**: Shows alert if actualHourlyWage not set
- **Responsive Layout**: Works on mobile and desktop
- **Comparison Toggle**: Show/hide comparison mode
- **Clear Functionality**: Reset all inputs and localStorage

## Related
- Implements: Requirements from `specs/one-time-purchase/requirements.md`
- Follows: Design from `specs/one-time-purchase/design.md`
- Tasks: `specs/one-time-purchase/tasks.md`

## Implementation Status
- Core Engine: Complete (Epic 1: Tasks 1.1-1.5)
- Data Layer: Complete (Epic 2: Tasks 2.1-2.2)
- Basic UI: Complete (Epic 3-4: Main page with all features)
- Comparison: Complete (Epic 5: Integrated into main page)
- Testing: 67/67 unit tests passing

## Future Enhancements
Phase 2 (not in MVP):
- Recurring costs (monthly payments, insurance)
- Purchase history tracking
- Post-purchase review ("Was it worth it?")
- Charts for opportunity cost visualization
- Advanced FI integration with precise timeline calculations
