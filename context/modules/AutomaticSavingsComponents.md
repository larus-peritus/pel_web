# Automatic Savings Impact Calculator - UI Components

## Location
`apps/peninganaedalifid/src/components/automaticSavings/`

## Purpose
UI components for the Automatic Savings Impact Calculator feature, implementing the "Pay Yourself First" philosophy from "Your Money or Your Life". Allows users to visualize the long-term impact of automatic, periodic savings with compound interest.

## Components

### AutomaticSavingsCalculator
Main container component that orchestrates the entire automatic savings feature.

**Location**: `AutomaticSavingsCalculator.tsx`

**Features**:
- Integrates with CalculatorContext for actualHourlyWage
- Manages savings input state
- Real-time calculation updates using useMemo
- 10 & 20 year comparison display (conditional)
- Responsive layout with Card-based UI

**Props**: None (uses context)

**Key Functionality**:
- State management for SavingsInputs
- Memoized calculation results
- Conditional comparison display for non-10/20 year periods
- Integration with life energy calculations

### SavingsInputForm
Comprehensive input form for all savings parameters.

**Location**: `SavingsInputForm.tsx`

**Features**:
- Monthly savings amount (CurrencyInput)
- Frequency selector (weekly, biweekly, monthly, custom)
- Custom frequency input (conditional)
- Time period in years
- Expected return rate (default 7%)
- Inflation adjustment toggle
- Inflation rate input (conditional)

**Props**:
```typescript
interface SavingsInputFormProps {
  inputs: SavingsInputs;
  onInputsChange: (inputs: Partial<SavingsInputs>) => void;
}
```

**Validation**:
- Uses SAVINGS_RANGES from constants
- Min/max enforcement via input components
- Conditional visibility for custom frequency and inflation rate

### SavingsSummary
Results display component showing calculation outcomes.

**Location**: `SavingsSummary.tsx`

**Features**:
- Future value card with principal/growth breakdown
- Real value display (if inflation enabled)
- Life energy metrics (if actualHourlyWage available)
  - Hours contributed
  - Hours earned passively
  - Total life energy value
  - Freedom months (if available)
- Warning alert if no wage calculated
- Key insight message

**Props**:
```typescript
interface SavingsSummaryProps {
  results: SavingsResults;
  actualHourlyWage?: number;
  years: number;
  monthlyAmount: number;
}
```

**Display Logic**:
- Conditional life energy section based on wage availability
- Dynamic key insight generation
- Color-coded values (primary, success)
- Responsive grid layouts

## Integration

### CalculatorContext
- Reads `actualHourlyWage` from context
- Does NOT persist to localStorage yet (future enhancement)
- Real-time updates when wage changes

### Calculation Functions
Uses `/lib/calculations/automaticSavings.ts`:
- `calculateSavingsResults()` - Main calculation orchestrator
- Returns complete SavingsResults with all metrics

### Constants
Uses `/lib/constants/savings.ts`:
- `DEFAULT_SAVINGS_INPUTS` - Initial state
- `FREQUENCY_OPTIONS` - Frequency choices
- `SAVINGS_RANGES` - Input validation ranges
- `SAVINGS_PRESETS` - Quick preset values (future use)

### Types
Uses `/types/savings.ts`:
- `SavingsInputs` - Input data structure
- `SavingsResults` - Output data structure
- `FrequencyKey` - Frequency type
- `YearlyBreakdown` - Chart data (future use)

## Page Integration

### CalculatorPageContent.tsx
Added to "Áhrif sparnaðar" (Savings Impact) tab:
- Calculator selection grid entry
- `AutomaticSavingsCalculatorContent` wrapper component
- Back button navigation
- Hero section with description

**Entry in SAVINGS_CALCULATORS**:
```typescript
{
  id: 'sjalfvirkur-sparnadur',
  name: 'Sjálfvirkur sparnaður',
  description: 'Sjáðu langtímaáhrif þess að setja upp sjálfvirkan sparnað.',
  icon: '🤖',
  available: true,
}
```

## Styling
- Tailwind CSS classes
- Card-based layout (elevated and outlined variants)
- Primary color scheme for emphasis
- Success color for growth/gains
- Info alerts for missing data
- Responsive design (grid layouts adjust on mobile)

## User Flow

1. User navigates to "Áhrif sparnaðar" tab
2. Selects "Sjálfvirkur sparnaður" from calculator grid
3. Sees pre-filled default values (10,000 kr/month, 7% return, 10 years)
4. Adjusts inputs:
   - Monthly amount
   - Frequency (weekly/biweekly/monthly/custom)
   - Years
   - Return rate
   - Optional: Enable inflation adjustment
5. Results update in real-time:
   - Future value, principal, growth
   - Life energy metrics (if wage calculated)
   - Freedom months
6. Optional: View 10 & 20 year comparison

## Requirements Fulfilled

From `requirements-automatic-savings-impact.md`:
- NS-1: Calculate future value with compound interest
- NS-2: Show life energy impact (hours worked indirectly)
- NS-4: Multiple frequency options
- NS-6: Inflation adjustment (optional)
- NS-1.3: 10 & 20 year comparison display

## Testing
- Manual testing recommended
- Test cases:
  - Different monthly amounts
  - All frequency options (including custom)
  - With/without actualHourlyWage
  - With/without inflation adjustment
  - Edge cases (0%, very high rates, long periods)

## Future Enhancements
(From spec, out of MVP scope):
- localStorage persistence
- Scenario comparison mode
- Preset selection buttons
- Educational content cards
- Interactive charts (yearlyBreakdown)
- Freedom months calculation with expenses
- "What if" increment strategies

## Dependencies
- React, Next.js 14
- Existing UI components (Card, CurrencyInput, NumberInput, Select, Alert)
- CalculatorContext
- Calculation functions
- Type definitions

## Files Created
1. `src/components/automaticSavings/AutomaticSavingsCalculator.tsx`
2. `src/components/automaticSavings/SavingsInputForm.tsx`
3. `src/components/automaticSavings/SavingsSummary.tsx`
4. `src/components/automaticSavings/index.ts`

## Related Documentation
- Requirements: `specs/automatic-savings-impact/requirements-automatic-savings-impact.md`
- Design: `specs/automatic-savings-impact/design-automatic-savings-impact.md`
- Tasks: `specs/automatic-savings-impact/tasks-automatic-savings-impact.md`
- Types: `context/modules/SavingsTypes.md` (if created)
- Calculations: `context/modules/AutomaticSavingsCalculations.md` (if created)
