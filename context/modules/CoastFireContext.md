# Coast FIRE Calculator - Context Integration

## Location
- `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
- `apps/peninganaedalifid/src/types/calculator.ts`

## Purpose
Extends CalculatorContext with Coast FIRE Calculator state management, enabling users to calculate when their current investments will grow to meet their FI number without additional contributions.

## State Structure

### CoastFIREState
```typescript
{
  currentAge: number;                    // User's current age (18-100)
  currentInvestments: number;            // Current investment balance (ISK)
  targetRetirementAge: number;           // Desired retirement age
  expectedReturn: number;                // Expected annual return rate (%)
  fiNumber: number | null;               // Target FI number (ISK)
  fiNumberSource: 'manual' | 'baseline'; // How FI number was determined
  selectedTier: ExpenseTier | null;      // Selected tier if using baseline
  fiMultiplier: number;                  // Multiplier (25x, 30x, etc.)
  birthDate?: string;                    // Optional ISO date string
  lastUpdated: string;                   // ISO timestamp
  version: number;                       // Schema version
}
```

### CoastFIREResult
Calculated results include:
- Status: 'coasting' | 'future' | 'impossible'
- Coast FIRE age and date
- Years to Coast FIRE
- Gap to Coast FIRE (ISK needed)
- Projected balance at retirement
- Scenario comparisons (conservative/moderate/optimistic)
- Life energy metrics (if actualHourlyWage available)

## Context API

### State
- `coastFireState: CoastFIREState | null` - Current Coast FIRE inputs
- `coastFireResults: CoastFIREResult | null` - Calculated results (auto-computed)

### Actions

#### State Management
- `updateCoastFireState(state: Partial<CoastFIREState>)` - Update state partially
- `initializeCoastFireState()` - Initialize with defaults
- `clearCoastFireState()` - Clear all Coast FIRE data

#### Input Setters
- `setCoastCurrentAge(age: number)` - Set current age
- `setCoastCurrentInvestments(amount: number)` - Set current investments
- `setCoastTargetRetirementAge(age: number)` - Set target retirement age
- `setCoastExpectedReturn(rate: number)` - Set expected return rate

#### FI Number Management
- `setCoastFINumber(amount: number | null)` - Set FI number manually
- `setCoastFINumberSource(source: FINumberSource)` - Set source (manual/baseline)
- `setCoastSelectedTier(tier: ExpenseTier | null)` - Set expense tier (auto-calculates FI number)
- `setCoastFIMultiplier(multiplier: number)` - Set FI multiplier (recalculates if using baseline)

#### Integration API
- `getCoastFireState()` - Get current state
- `hasCoastFireState()` - Check if state exists with valid FI number

## Calculations

Coast FIRE results are automatically computed via `useMemo` whenever:
- `coastFireState` changes
- `expenseBaseline` changes (for FI number calculation)
- `results.actualHourlyWage` changes (for life energy metrics)

Calculation function: `calculateCoastFIREResult(coastFireState, actualHourlyWage, expenseBaseline)`

## Integration with Expense Baseline

When user selects an expense tier:
1. Fetches monthly expenses from Expense Baseline Tool
2. Calculates annual expenses (monthly × 12)
3. Applies FI multiplier (e.g., 25x, 30x)
4. Sets FI number automatically
5. Marks source as 'baseline'

When FI multiplier changes:
- If using baseline: Recalculates FI number automatically
- If manual: Updates multiplier only

## LocalStorage Persistence

### Saved Data
Coast FIRE state is saved to localStorage with:
- Key: `STORAGE_KEY` (from @/lib/defaults)
- Field: `coastFire?: CoastFIREState`
- Auto-save: Debounced 500ms after any change

### Loading
On mount, loads `stored.coastFire` and restores:
- All input fields
- lastUpdated as string (stored format)

### Reset
`resetAll()` clears coastFireState to null

## Dependencies

### Types
- `CoastFIREState` from `@/types/coastFire`
- `CoastFIREResult` from `@/types/coastFire`
- `FINumberSource` from `@/types/coastFire`
- `ExpenseTier` from `@/types/expenseBaseline`

### Calculations
- `calculateCoastFIREResult()` from `@/lib/calculations/coastFire`

### Constants
- `COAST_FIRE_DEFAULTS` from `@/lib/constants/coastFire`

### Helpers
- `getExpenseByTierHelper()` from `@/lib/calculations/expenseBaseline`

## Usage Example

```typescript
import { useCalculator } from '@/context/CalculatorContext';

function CoastFirePage() {
  const {
    coastFireState,
    coastFireResults,
    setCoastCurrentAge,
    setCoastCurrentInvestments,
    setCoastSelectedTier,
    hasCoastFireState,
  } = useCalculator();

  // Initialize if needed
  useEffect(() => {
    if (!hasCoastFireState()) {
      initializeCoastFireState();
    }
  }, []);

  // Set inputs
  const handleAgeChange = (age: number) => {
    setCoastCurrentAge(age);
  };

  // Use expense baseline
  const handleTierSelect = (tier: ExpenseTier) => {
    setCoastSelectedTier(tier); // Auto-calculates FI number
  };

  // Access results
  const status = coastFireResults?.status; // 'coasting' | 'future' | 'impossible'
  const coastAge = coastFireResults?.coastFireAge;
  const yearsToCoast = coastFireResults?.yearsToCoast;

  return (
    <div>
      {/* Render UI with state and results */}
    </div>
  );
}
```

## Implementation Notes

### Smart FI Number Calculation
The `setCoastSelectedTier` function intelligently:
1. Checks if expense baseline exists
2. Fetches monthly expenses for selected tier
3. Calculates FI number using current multiplier
4. Updates both tier and FI number atomically
5. Sets source to 'baseline'

### Smart Multiplier Update
The `setCoastFIMultiplier` function:
1. Updates multiplier value
2. If using baseline: Recalculates FI number with new multiplier
3. If manual: Just updates multiplier (preserves manual FI number)

### Auto-Recalculation
Results are automatically recalculated when:
- Any input changes (currentAge, currentInvestments, etc.)
- Expense baseline changes (if using baseline for FI number)
- Actual hourly wage changes (affects life energy calculations)

### Performance
- Calculations use `useMemo` to avoid unnecessary recomputation
- LocalStorage saves are debounced (500ms)
- Results calculation is fast (<20ms per requirements)

## Testing Considerations

When testing Coast FIRE context:
1. Test state initialization
2. Test each setter function
3. Test tier selection with FI number auto-calculation
4. Test multiplier changes with baseline recalculation
5. Test persistence (save/load/reset)
6. Test integration with expense baseline
7. Test life energy calculation with/without AWH

## Related Documentation
- Types: `/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/src/types/coastFire.ts`
- Calculations: `/Users/larusperitus/Documents/code/peritus/pel_web/context/modules/CoastFireCalculations.md`
- Constants: `/Users/larusperitus/Documents/code/peritus/pel_web/context/modules/CoastFireConstants.md`
- Requirements: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/coast-fire/requirements-coast-fire.md`
- Design: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/coast-fire/design-coast-fire.md`
- Tasks: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/coast-fire/tasks-coast-fire.md`

## Implements
- Task 2.1 from `specs/coast-fire/tasks-coast-fire.md`
- FR-7 (Data Persistence) from `specs/coast-fire/requirements-coast-fire.md`
