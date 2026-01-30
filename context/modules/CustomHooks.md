# Custom Hooks

## Location
- `apps/peninganaedalifid/src/hooks/useWageCalculator.ts`
- `apps/peninganaedalifid/src/hooks/usePresets.ts`
- `apps/peninganaedalifid/src/hooks/useDebounce.ts`
- `apps/peninganaedalifid/src/hooks/index.ts` (barrel export)

## Purpose
Custom React hooks for calculator functionality, providing reusable logic for wage calculations, preset management, and debouncing.

## Exports

### useWageCalculator Hook

**Function**: `useWageCalculator(inputs: CalculatorInputs): CalculationResults | null`

Calculates wage results from inputs with memoization.

**Features**:
- Returns memoized calculation results
- Updates only when inputs change
- Returns null if income is zero or negative
- Pure function - no side effects

**Usage**:
```tsx
const inputs = { income, moneyExpenses, timeExpenses };
const results = useWageCalculator(inputs);

if (!results) {
  return <div>Enter your income to see results</div>;
}

return <div>Actual wage: ${results.actualHourlyWage}</div>;
```

### usePresets Hook

**Function**: `usePresets(category, currentValues, onApply): UsePresetsReturn`

Manages preset selection and detection for commute, clothing, and meals.

**Parameters**:
- `category`: PresetCategory - 'commute' | 'clothing' | 'meals'
- `currentValues`: Partial<MoneyExpenses & TimeExpenses> - Current values to match against
- `onApply`: (preset: Preset) => void - Callback when preset is applied

**Returns**:
- `presets`: Preset[] - Available presets for category
- `currentPreset`: Preset | null - Currently matching preset
- `applyPreset`: (preset: Preset) => void - Function to apply preset
- `isCustom`: boolean - True if values don't match any preset

**Usage**:
```tsx
const { presets, currentPreset, applyPreset, isCustom } = usePresets(
  'commute',
  inputs.moneyExpenses,
  (preset) => {
    updateMoneyExpense('commute', preset.values.commute || 0);
  }
);

return (
  <div>
    {presets.map(preset => (
      <button
        key={preset.id}
        onClick={() => applyPreset(preset)}
        className={currentPreset?.id === preset.id ? 'active' : ''}
      >
        {preset.label}
      </button>
    ))}
  </div>
);
```

### useDebounce Hook

**Function**: `useDebounce<T>(value: T, delay?: number): T`

Debounces a value by the specified delay (default 300ms).

**Parameters**:
- `value`: T - Value to debounce
- `delay`: number - Delay in milliseconds (default: 300)

**Returns**:
- Debounced value

**Usage**:
```tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  // Only runs after user stops typing for 500ms
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

## Key Functionality

### useWageCalculator
- Memoizes calculation results using useMemo
- Returns null for invalid inputs (zero/negative income)
- Delegates to calculateResults from @/lib/calculations
- Re-calculates only when inputs reference changes

### usePresets
- Memoizes preset list by category
- Detects current preset from values
- Provides stable applyPreset callback
- Flags custom values when no preset matches

### useDebounce
- Generic hook supporting any type
- Cleans up timer on unmount
- Resets timer on rapid changes
- Updates state after delay expires

## Dependencies
- React (useMemo, useCallback, useState, useEffect)
- @/types/calculator (TypeScript types)
- @/lib/calculations (calculateResults)
- @/lib/presets (getPresetsByCategory, detectPreset)

## Tests

### useWageCalculator Tests
- Location: `tests/hooks/useWageCalculator.test.ts`
- Coverage: 13 tests
- Test cases:
  - Returns null for zero/negative income
  - Calculates results for valid income
  - Calculates correct nominal and actual wage
  - Handles money and time expenses
  - Memoizes results correctly
  - Re-calculates on input changes
  - Includes additional income
  - Provides breakdown data

### usePresets Tests
- Location: `tests/hooks/usePresets.test.tsx`
- Coverage: 15 tests
- Test cases:
  - Returns presets for each category
  - Detects current preset when values match
  - Detects custom values
  - Calls onApply callback
  - Memoizes presets
  - Updates on value changes
  - Handles empty values
  - Stable callback reference

### useDebounce Tests
- Location: `tests/hooks/useDebounce.test.ts`
- Coverage: 12 tests
- Test cases:
  - Returns initial value immediately
  - Debounces value changes
  - Uses default 300ms delay
  - Resets timer on rapid changes
  - Handles custom delays
  - Works with various types (string, number, object, boolean, null/undefined)
  - Cleans up on unmount
  - Handles zero delay
  - Handles multiple rapid updates

**All tests passing**: 40/40

## Integration

### Used by
- Calculator components (will consume these hooks)
- Preset selector components
- Input components with debouncing needs

### Uses
- CalculatorTypes (type definitions)
- Calculation engine (wage, breakdown functions)
- Presets configuration
- React hooks

## Related
- Implements: Task 10 from `specs/actual-hourly-wage-calculator/tasks.md`
- Part of: Actual Hourly Wage Calculator feature
- Supports: Component layer with reusable logic
- Related modules:
  - CalculatorContext.md (will use these hooks)
  - CalculatorTypes.md (type definitions)
  - PresetsConfiguration.md (preset data)

## Implementation Notes
- All hooks use 'use client' directive for Next.js
- Proper memoization prevents unnecessary recalculations
- usePresets provides stable callback references
- useDebounce uses fake timers in tests with act()
- Generic useDebounce supports any value type
- Created: 2026-01-19
