# Task 2.1 Implementation Summary: Extend CalculatorContext for FatFIRE

## Completed

### 1. Updated StoredState Interface
**File**: `apps/peninganaedalifid/src/types/calculator.ts`
**Lines**: ~210-211

Added FatFIRE state to StoredState interface:
```typescript
// FatFIRE Planner (Lúxus FIRE Áætlun)
fatFireState?: import('./fatFire').StoredFatFireState; // FatFIRE state (optional for backwards compatibility)
```

### 2. Added FatFIRE Imports
**File**: `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
**Lines**: ~115-125

Added necessary imports:
```typescript
import type {
  FatFireState,
  StoredFatFireState,
  WishListItem,
  StoredWishListItem,
  FatFireScenario,
  FatFireResults,
} from '@/types/fatFire';
import { calculateFatFireResults } from '@/lib/calculations/fatFire';
import { FATFIRE_DEFAULTS } from '@/lib/constants/fatFire';
```

### 3. Added FatFIRE Context Interface
**File**: `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
**Lines**: ~276-296

Added complete FatFIRE interface to CalculatorContextType:
```typescript
// FatFIRE Planner
fatFireState: FatFireState | null;
fatFireResults: FatFireResults | null;
updateFatFireState: (updates: Partial<FatFireState>) => void;
addWishListItem: (item: Omit<WishListItem, 'id' | 'createdAt'>) => void;
updateWishListItem: (id: string, updates: Partial<Omit<WishListItem, 'id' | 'createdAt'>>) => void;
removeWishListItem: (id: string) => void;
setSplurgeBudget: (amount: number) => void;
addScenario: (scenario: Omit<FatFireScenario, 'id'>) => void;
removeScenario: (id: string) => void;
clearFatFireState: () => void;
initializeFatFireState: () => void;
// Integration API
getFatFireState: () => FatFireState | null;
hasFatFireState: () => boolean;
```

### 4. Added FatFIRE State Variable
**File**: `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
**Line**: ~353

Added state variable:
```typescript
const [fatFireState, setFatFireState] = useState<FatFireState | null>(null);
```

### 5. Added FatFIRE Results Calculation
**File**: `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
**Lines**: ~430-447

Added useMemo hook for calculating FatFIRE results:
```typescript
// Calculate FatFIRE results whenever state or actual wage changes
const fatFireResults = useMemo(() => {
  if (!fatFireState) return null;

  const actualHourlyWage = results?.actualHourlyWage ?? null;
  const annualNetIncome = results?.netAnnualIncome ?? null;

  try {
    return calculateFatFireResults(
      fatFireState,
      expenseBaseline,
      actualHourlyWage,
      annualNetIncome
    );
  } catch (error) {
    console.error('Error calculating FatFIRE results:', error);
    return null;
  }
}, [fatFireState, expenseBaseline, results?.actualHourlyWage, results?.netAnnualIncome]);
```

## Remaining: Function Implementations

### Functions to Add
**Location**: After `hasSavingsReport` function (line ~1657) and before `saveToStorage` function

The implementation code is provided in `FATFIRE_CONTEXT_FUNCTIONS.txt`. These functions need to be added:

1. `initializeFatFireState()` - Initialize FatFIRE state with defaults
2. `updateFatFireState()` - Update FatFIRE state with partial data
3. `addWishListItem()` - Add a wish list item
4. `updateWishListItem()` - Update an existing wish list item
5. `removeWishListItem()` - Remove a wish list item
6. `setSplurgeBudget()` - Set annual splurge budget
7. `addScenario()` - Add a scenario for comparison (max 5)
8. `removeScenario()` - Remove a scenario
9. `clearFatFireState()` - Clear all FatFIRE state
10. `getFatFireState()` - Get FatFIRE state (integration API)
11. `hasFatFireState()` - Check if FatFIRE state exists

### Persistence Operations to Add

#### 1. saveToStorage - Add FatFIRE State
**Location**: Inside `saveToStorage` function after `savingsReport` (line ~1657)

Add after savingsReport serialization:
```typescript
fatFireState: fatFireState
  ? {
      useExpenseBaseline: fatFireState.useExpenseBaseline,
      selectedTier: fatFireState.selectedTier,
      customMonthlyExpense: fatFireState.customMonthlyExpense,
      wishListItems: fatFireState.wishListItems.map(item => ({
        id: item.id,
        category: item.category,
        name: item.name,
        monthlyCost: item.monthlyCost,
        priority: item.priority,
        description: item.description,
        createdAt: item.createdAt.toISOString(),
      })),
      splurgeBudgetAnnual: fatFireState.splurgeBudgetAnnual,
      multiplier: fatFireState.multiplier,
      customMultiplier: fatFireState.customMultiplier,
      currentSavings: fatFireState.currentSavings,
      expectedReturnRate: fatFireState.expectedReturnRate,
      annualSavings: fatFireState.annualSavings,
      scenarios: fatFireState.scenarios,
      lastUpdated: fatFireState.lastUpdated.toISOString(),
    }
  : undefined,
```

And update the dependency array to include `fatFireState`.

#### 2. loadFromStorage - Load FatFIRE State
**Location**: Inside initial `useEffect` (line ~510) and `loadFromStorage` function (line ~1730)

Add after savingsReport loading:
```typescript
// Load FatFIRE state
if (stored.fatFireState) {
  setFatFireState({
    useExpenseBaseline: stored.fatFireState.useExpenseBaseline,
    selectedTier: stored.fatFireState.selectedTier,
    customMonthlyExpense: stored.fatFireState.customMonthlyExpense,
    wishListItems: stored.fatFireState.wishListItems.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
    })),
    splurgeBudgetAnnual: stored.fatFireState.splurgeBudgetAnnual,
    multiplier: stored.fatFireState.multiplier,
    customMultiplier: stored.fatFireState.customMultiplier,
    currentSavings: stored.fatFireState.currentSavings,
    expectedReturnRate: stored.fatFireState.expectedReturnRate,
    annualSavings: stored.fatFireState.annualSavings,
    scenarios: stored.fatFireState.scenarios,
    lastUpdated: new Date(stored.fatFireState.lastUpdated),
  });
}
```

#### 3. exportDataHandler - Include FatFIRE State
**Location**: Inside `exportDataHandler` function (line ~1747)

Add same serialization as in saveToStorage (see above).

#### 4. importDataHandler - Load FatFIRE State
**Location**: Inside `importDataHandler` function (line ~1799)

Add same loading logic as in loadFromStorage (see above).

#### 5. resetAll - Clear FatFIRE State
**Location**: Inside `resetAll` function (line ~1905)

Add:
```typescript
setFatFireState(null);
```

#### 6. Context Value - Export Functions
**Location**: Inside `value` object (line ~1960+)

Add after savingsReport exports:
```typescript
// FatFIRE Planner
fatFireState,
fatFireResults,
updateFatFireState,
addWishListItem,
updateWishListItem,
removeWishListItem,
setSplurgeBudget,
addScenario,
removeScenario,
clearFatFireState,
initializeFatFireState,
getFatFireState,
hasFatFireState,
```

## Next Steps

1. Manually insert the function implementations from `FATFIRE_CONTEXT_FUNCTIONS.txt` into `CalculatorContext.tsx` after line 1659 (after `hasSavingsReport`)

2. Update persistence functions (`saveToStorage`, `loadFromStorage`, `exportDataHandler`, `importDataHandler`, `resetAll`) with FatFIRE state handling

3. Add FatFIRE exports to the context value object

4. Test the implementation:
   - Initialize FatFIRE state
   - Add/update/remove wish list items
   - Set splurge budget
   - Add/remove scenarios
   - Save/load from localStorage
   - Export/import data

## Testing Checklist

- [ ] `initializeFatFireState()` creates state with defaults
- [ ] `updateFatFireState()` updates partial state
- [ ] `addWishListItem()` adds items with unique IDs
- [ ] `updateWishListItem()` updates existing items
- [ ] `removeWishListItem()` removes items by ID
- [ ] `setSplurgeBudget()` updates splurge budget
- [ ] `addScenario()` adds scenarios (max 5)
- [ ] `removeScenario()` removes scenarios by ID
- [ ] `clearFatFireState()` clears all state
- [ ] `getFatFireState()` returns current state
- [ ] `hasFatFireState()` returns true when state exists
- [ ] State persists to localStorage
- [ ] State loads from localStorage on mount
- [ ] State exports with all data
- [ ] State imports correctly
- [ ] State clears on resetAll
- [ ] FatFIRE results calculate correctly

## Files Modified

1. `apps/peninganaedalifid/src/types/calculator.ts` - Added fatFireState to StoredState
2. `apps/peninganaedalifid/src/context/CalculatorContext.tsx` - Added FatFIRE state management (partial)

## Files to Create (Future Tasks)

From task breakdown:
- Epic 3: UI Components for expense input and wish list
- Epic 4: Wish list builder components
- Epic 5: Splurge budget and FI number components
- Epic 6: Timeline components and charts
- Epic 7: Scenario comparison components
- Epic 8: Life energy integration components
- Epic 9: Educational content and polish

## Requirements Addressed

- FR-10.1: Save to localStorage (partial - needs persistence code)
- FR-10.2: Load saved state on page load (partial - needs loading code)
- FR-10.3: Include in global export/import functions (partial - needs export/import code)
- FR-10.4: Auto-save with debounce (handled by existing useEffect with 500ms debounce)
- FR-10.5: Support "reset to defaults" function (partial - needs resetAll update)

## Notes

- FatFIRE state is optional in StoredState for backwards compatibility
- Wish list items have unique IDs generated with timestamp + random string
- Scenarios are limited to max 5 to prevent UI clutter
- All monetary values in ISK (Icelandic króna)
- All timestamps stored as ISO strings in localStorage
- Date objects reconstructed when loading from storage
