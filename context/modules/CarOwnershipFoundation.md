# Car Ownership Cost Calculator - Foundation

## Location
- Types: `apps/peninganaedalifid/src/types/car-ownership.ts`
- Validation: `apps/peninganaedalifid/src/lib/validation/car.ts`
- Defaults: `apps/peninganaedalifid/src/lib/defaults/car.ts`
- Calculations: `apps/peninganaedalifid/src/lib/calculations/car.ts`
- Presets: `apps/peninganaedalifid/src/lib/presets/car.ts`

## Purpose
Complete foundation for the Car Ownership Cost Calculator including types, validation, calculation logic, default values, and preset scenarios for common Icelandic cars.

## Exports

### Types (`types/car-ownership.ts`)
- `CarOwnershipScenario` - Complete scenario with inputs and results
- `CarOwnershipInputs` - User input data
- `CarOwnershipResults` - Calculated results
- `FinancingDetails` - Loan/financing information
- `CarCostBreakdownItem` - Individual cost category for charts
- `CarPreset` - Preset configuration
- `FUEL_TYPE_LABELS` - Icelandic labels for fuel types
- `CAR_CATEGORY_LABELS` - Icelandic labels for car categories

### Validation (`lib/validation/car.ts`)
- `validateCarOwnershipInputs(inputs)` - Validates all car ownership inputs
  - Returns `{ isValid: boolean, errors: Record<string, string>, warnings?: Record<string, string> }`
  - Icelandic error messages
  - Comprehensive validation rules for all fields
  - Conditional financing validation
  - Warning messages for edge cases

### Defaults (`lib/defaults/car.ts`)
- `DEFAULT_CAR_INPUTS` - Default values for an average car in Iceland
- `DEFAULT_FUEL_PRICES` - Typical Icelandic fuel prices
- `TYPICAL_FUEL_CONSUMPTION` - Consumption ranges by fuel type
- `TYPICAL_ANNUAL_COSTS` - Annual costs by car category
- `getDefaultFuelPrice(fuelType)` - Helper for fuel pricing
- `getTypicalFuelConsumption(fuelType)` - Helper for consumption
- `getTypicalAnnualCosts(category)` - Helper for annual costs

### Calculations (`lib/calculations/car.ts`)
- `calculateFuelCost()` - Monthly fuel cost calculation
- `calculateDirectMonthlyCost()` - Direct costs (fuel, parking, tolls)
- `calculateLoanPayment()` - Monthly loan payment using standard formula
- `calculateTotalInterest()` - Total interest paid over loan term
- `calculateDepreciation()` - Monthly depreciation (linear or market-based)
- `calculateIndirectMonthlyCost()` - Indirect costs (depreciation, insurance, etc.)
- `calculateLifeEnergy()` - Life energy cost in hours
- `calculateCarFutureValue()` - Future value at 7% return (5, 10, 20 years)
- `generateCostBreakdown()` - Cost breakdown for charts
- `calculateCarOwnershipResults()` - **Main calculation function**

### Presets (`lib/presets/car.ts`)
- `CAR_PRESETS` - Array of 5 preset car scenarios:
  1. Small gasoline car (Toyota Yaris) - 2.5M ISK
  2. Medium gasoline car (Toyota Corolla) - 4M ISK
  3. SUV (Toyota RAV4) - 7M ISK
  4. Electric car (Tesla/Nissan Leaf) - 5M ISK
  5. Old car (>15 years) - 800k ISK
- `getPresetById(id)` - Get preset by ID
- `getPresetsByCategory(category)` - Get presets by category

## Key Functionality

### Calculation Logic
1. **Direct Monthly Costs**:
   - Fuel: `(monthlyKm * fuelConsumption / 100) * fuelPrice`
   - Parking: Monthly parking cost
   - Tolls: Monthly toll cost
   - Loan: Monthly payment if financing

2. **Indirect Monthly Costs**:
   - Depreciation: Linear over estimated lifetime or based on current market value
   - Insurance: Annual / 12
   - Registration tax (bifreiðagjald): Annual / 12
   - Inspection: Biannual cost / 24
   - Maintenance: Annual / 12
   - Tires: Cost / (years between replacement * 12)

3. **Total Monthly Cost**: Direct + Loan + Indirect

4. **Life Energy**: Total cost / actualHourlyWage

5. **Future Value**: Monthly cost invested at 7% annual return

### Validation Rules
- Purchase price: > 0
- Estimated lifetime: 0 < years <= 30
- Monthly km: 0 < km <= 10,000 (warning > 5,000)
- Financing (if hasFinancing = true):
  - Loan amount: > 0
  - Interest rate: 0 < rate <= 30% (warning > 15%)
  - Loan term: 0 < years <= 15
  - Warning if downPayment + loanAmount ≠ purchasePrice (±5%)
- Fuel consumption: 0 < consumption <= 50 (warning > 20)
- Fuel price: 0 < price <= 1,000
- All costs: >= 0

### Icelandic Context
- Default fuel prices: Gasoline 300 kr/L, Diesel 290 kr/L, Electric 30 kr/kWh
- Default biannual inspection: 12,000 ISK
- Realistic insurance ranges: 100,000-200,000 ISK/year
- Registration tax varies by car type (electric cars: ~6,600 ISK/year)
- All error messages and labels in Icelandic

## Dependencies
- None (pure calculation functions)
- TypeScript types from `@/types/car-ownership`

## Tests
- **Validation**: 43 tests (all passing)
  - All validation rules
  - Conditional financing validation
  - Edge cases and warnings
  - Icelandic error messages

- **Defaults**: 23 tests (all passing)
  - Default values validation
  - Icelandic labels
  - Helper functions
  - Data quality checks

- **Calculations**: 38 tests (all passing)
  - All calculation functions
  - Integration test with complete results
  - Edge cases (zero values, division by zero)
  - Performance test (< 100ms)

- **Presets**: 28 tests (all passing)
  - All 5 presets validate
  - Preset characteristics (prices, consumption, costs)
  - Calculation integration
  - Helper functions
  - Data quality checks

**Total: 132 tests, all passing**

## Integration
- Used by: CalculatorContext (pending Epic 4)
- Uses: None (foundation layer)

## Performance
- All calculations complete in < 100ms (verified by tests)
- Pure functions, no side effects
- Efficient cost breakdown generation with sorting

## Related
- Implements: Requirements NS-1 to NS-7 from `specs/car-ownership/requirements.md`
- Part of: `specs/car-ownership/design.md`
- Tasks completed:
  - Task 1.1: TypeScript types
  - Task 1.2: Validation functions
  - Task 1.3: Default values and constants
  - Epic 2 (all tasks): Calculation functions
  - Task 3.1: Car presets

## Implementation Notes
- 2026-01-20: Completed Epic 1 (Foundation), Epic 2 (Calculations), and Epic 3 (Presets)
- All core calculation and validation logic complete and tested
- Ready for CalculatorContext integration (Epic 4)
- Icelandic-first design with realistic values for Iceland
- Linear depreciation model chosen for simplicity and clarity
- Supports optional currentMarketValue for more accurate depreciation
- Loan payment uses standard amortization formula
- Future value calculations use 7% annual return (standard FI assumption)
