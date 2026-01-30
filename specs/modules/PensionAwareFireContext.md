# Pension-Aware FIRE Context Integration

## Location
`src/context/CalculatorContext.tsx`

## Purpose
Adds state management and persistence for the Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél) to the global CalculatorContext. This integration allows the calculator to maintain state across page navigations and persist data to localStorage.

## State Variables

### `pensionAwareFire: PensionAwareFireState | null`
Current state of the Pension-Aware FIRE calculator, including:
- Basic financial inputs (age, expenses, savings)
- Pension inputs (lífeyrissjóður, séreign, TR)
- Saved scenarios for comparison

### `pensionAwareFireResults: PensionAwareFireResults | null`
Calculated results derived from the state, including:
- Traditional vs pension-adjusted FI numbers
- Retirement phases with income breakdown
- Timeline projections
- Pension projections (séreign and TR)
- Viability warnings

## Functions

### State Management

#### `updatePensionAwareFireState(updates: Partial<PensionAwareFireState>): void`
Updates the state with partial data. Creates initial state with defaults if none exists.

**Example:**
```typescript
updatePensionAwareFireState({
  currentAge: 35,
  targetRetirementAge: 55,
  monthlyExpenses: 300_000
});
```

#### `initializePensionAwareFire(): void`
Initializes the calculator with default values. If expense baseline exists, automatically populates monthly expenses from the comfortable tier.

#### `clearPensionAwareFire(): void`
Clears all Pension-Aware FIRE data from state.

### Scenario Management

#### `savePensionScenario(name: string): void`
Saves current state and results as a named scenario for comparison. Maximum of 3 scenarios allowed.

**Example:**
```typescript
savePensionScenario("Bjartsýn áætlun");
```

#### `deletePensionScenario(id: string): void`
Removes a saved scenario by ID.

### Integration API

#### `getPensionAwareFireState(): PensionAwareFireState | null`
Returns the current state (for integration with other calculators).

#### `hasPensionAwareFire(): boolean`
Checks if Pension-Aware FIRE state exists.

## Results Calculation

Results are automatically recalculated whenever `pensionAwareFire` state changes using `useMemo`. The calculation includes:

1. **Retirement Phases**: Breaks retirement into phases based on pension availability
   - Gap phase (before age 60)
   - Séreign bridge phase (60-67)
   - Full pension phase (67+)

2. **FI Numbers**:
   - Traditional FI: 30x annual expenses (no pension considered)
   - Pension-Adjusted FI: Actual need accounting for future pensions

3. **Timeline**:
   - Years to traditional FI
   - Years to pension-adjusted FI
   - Years earlier retirement possible

4. **Pension Projections**:
   - Séreign balance at 60 and monthly withdrawal
   - TR estimate with means-testing

## LocalStorage Persistence

### Storage Key
`'pensionAwareFire_state'` (from `PENSION_AWARE_STORAGE_KEY`)

### Saved on State Change
State is automatically persisted to localStorage whenever `pensionAwareFire` changes (via `useEffect`).

### Loaded on Mount
State is loaded from localStorage when the context hydrates. Date strings are converted back to Date objects.

### Migration Support
State includes a `version` field for future migrations. Current version: 1.

## Integration with Expense Baseline

When `initializePensionAwareFire()` is called and an expense baseline exists:
- `expenseSource` is set to `'baseline'`
- `expenseTier` is set to `'comfortable'`
- `monthlyExpenses` is populated from `expenseBaselineResults.totals.comfortable`

This allows seamless integration between the Expense Baseline tool and Pension-Aware FIRE calculator.

## Dependencies

### Types
- `PensionAwareFireState` - Complete input state
- `PensionAwareFireResults` - Calculation results
- `SavedScenario` - Scenario comparison data

### Calculation Functions
- `calculateRetirementPhases()` - Phases with income breakdown
- `calculateTraditionalFI()` - Traditional FI number (30x expenses)
- `calculatePensionAdjustedFI()` - Pension-adjusted FI number
- `calculateProjectedSereign()` - Séreign projections
- `calculateTREstimate()` - TR with means-testing

### Constants
- `PENSION_AWARE_DEFAULTS` - Default input values
- `DEFAULT_LIFEYRISSJODUR` - Default lífeyrissjóður inputs
- `DEFAULT_SEREIGN` - Default séreign inputs
- `DEFAULT_TR` - Default TR inputs
- `PENSION_AWARE_STORAGE_KEY` - LocalStorage key

## Used By
- Future: `src/components/pensionAwareFire/PensionAwareFIRECalculator.tsx`
- Future: `src/app/lifeyristengd-fire/page.tsx`

## Related Modules
- Types: `context/modules/PensionAwareFireTypes.md`
- Constants: `context/modules/PensionAwareFireConstants.md`
- Calculations: `context/modules/PensionAwareFireCalculations.md`
- Feature: `context/features/pension-aware-fire.md`

## Implementation Notes

### Pattern Consistency
Follows the same patterns as LeanFIRE and CoastFIRE state management:
- State variable with setter
- Results computed with useMemo
- Update function with partial updates
- Initialize function with defaults
- Clear function
- Integration API (get/has)
- LocalStorage persistence via useEffect

### Error Handling
Calculation errors are caught and logged to console. Results return `null` on error to prevent UI crashes.

### Performance
Results are memoized with `useMemo` to avoid unnecessary recalculations. Only recalculate when `pensionAwareFire` state changes.

## Testing

Manual testing checklist:
- [x] State initializes with defaults
- [x] State updates trigger recalculation
- [x] Results include all required fields
- [x] No TypeScript compilation errors
- [ ] State persists to localStorage (requires browser testing)
- [ ] State loads from localStorage on mount (requires browser testing)
- [ ] Scenarios can be saved/deleted (requires UI testing)
- [ ] Integration with expense baseline works (requires UI testing)

## Future Enhancements

1. **Validation**: Add input validation before calculation
2. **Warnings**: Expand warning system for edge cases
3. **History**: Track state changes for undo/redo
4. **Export**: Add CSV/JSON export for scenarios
5. **Comparison**: Enhanced scenario comparison visualization
