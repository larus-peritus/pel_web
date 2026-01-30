# FIRE Type Explorer - CalculatorContext Integration

## Location
- `apps/peninganaedalifid/src/context/CalculatorContext.tsx`
- `apps/peninganaedalifid/src/types/calculator.ts`
- `apps/peninganaedalifid/src/types/fireTypes.ts`

## Purpose
Extend CalculatorContext to manage FIRE Type Explorer state, allowing users to:
- Select a preferred FIRE type
- Customize calculation assumptions
- Toggle UI preferences
- Persist selections across sessions

## Implementation (Task 2.1 Complete)

### 1. Type Definitions Added

**In `/src/types/calculator.ts`:**
```typescript
export interface StoredState {
  // ... existing fields ...
  fireTypePreferences?: import('./fireTypes').StoredFIRETypePreferences;
}
```

### 2. State Variables Added

**In `CalculatorContext.tsx`:**
```typescript
const [fireTypePreferences, setFireTypePreferences] = useState<FIRETypePreferences | null>(null);
```

### 3. Context Interface Extended

**Added to `CalculatorContextType`:**
- `fireTypePreferences: FIRETypePreferences | null`
- `updateFIRETypePreferences(prefs: Partial<FIRETypePreferences>): void`
- `setSelectedType(type: FIRETypeId | null): void`
- `setCustomAssumptions(assumptions: Partial<FIREAssumptions>): void`
- `toggleShowAllTypes(): void`
- `toggleExpandedSection(sectionId: string): void`
- `clearFIRETypePreferences(): void`
- `initializeFIRETypePreferences(): void`
- `getFIRETypePreferences(): FIRETypePreferences | null`
- `hasFIRETypePreferences(): boolean`

### 4. Actions Implemented

**All functions use `useCallback` for optimization:**

#### `updateFIRETypePreferences(updates)`
- Merges partial updates into preferences
- Initializes if preferences don't exist
- Updates `lastUpdated` timestamp

#### `setSelectedType(type)`
- Sets the user's selected FIRE type
- Initializes preferences if needed
- Updates timestamp

#### `setCustomAssumptions(assumptions)`
- Updates custom calculation assumptions
- Merges with existing assumptions
- Handles initialization

#### `toggleShowAllTypes()`
- Toggles between showing all types vs recommended only
- Initializes with default if needed

#### `toggleExpandedSection(sectionId)`
- Manages accordion/collapsible section state
- Adds/removes section from expanded array

#### `clearFIRETypePreferences()`
- Resets all preferences to null

#### `initializeFIRETypePreferences()`
- Creates new preferences with default values:
  - selectedType: null
  - customAssumptions: {}
  - showAllTypes: true
  - expandedSections: []
  - lastUpdated: new Date()

#### Integration API

**`getFIRETypePreferences()`**
- Returns current preferences object

**`hasFIRETypePreferences()`**
- Checks if preferences exist

### 5. LocalStorage Persistence

#### Load on Mount (useEffect)
```typescript
if (stored.fireTypePreferences) {
  setFireTypePreferences({
    selectedType: stored.fireTypePreferences.selectedType,
    customAssumptions: stored.fireTypePreferences.customAssumptions,
    showAllTypes: stored.fireTypePreferences.showAllTypes,
    expandedSections: stored.fireTypePreferences.expandedSections,
    lastUpdated: new Date(stored.fireTypePreferences.lastUpdated),
  });
}
```

#### Auto-save (Debounced 500ms)
- Added `fireTypePreferences` to dependencies array
- Serializes to `StoredFIRETypePreferences` format
- Saves to localStorage via `safeSetItem`

#### Manual Save (`saveToStorage`)
- Includes fireTypePreferences in state object
- Converts Date to ISO string for storage

#### Load (`loadFromStorage`)
- Deserializes from localStorage
- Converts ISO string back to Date
- Handles missing data gracefully

#### Export (`exportDataHandler`)
- Includes fireTypePreferences in JSON export
- Same serialization as save

#### Import (`importDataHandler`)
- Restores from JSON file
- Same deserialization as load

#### Reset (`resetAll`)
- Clears fireTypePreferences with `setFireTypePreferences(null)`

### 6. Context Value Object

Added to the `value` object before persistence functions:
```typescript
fireTypePreferences,
updateFIRETypePreferences,
setSelectedType,
setCustomAssumptions,
toggleShowAllTypes,
toggleExpandedSection,
clearFIRETypePreferences,
initializeFIRETypePreferences,
getFIRETypePreferences,
hasFIRETypePreferences,
```

## Dependencies

**Types Used:**
- `FIRETypePreferences` from `@/types/fireTypes`
- `StoredFIRETypePreferences` from `@/types/fireTypes`
- `FIRETypeId` from `@/types/fireTypes`
- `FIREAssumptions` from `@/types/fireTypes`
- `DEFAULT_FIRE_ASSUMPTIONS` from `@/types/fireTypes`

## Integration Points

### Used By
- FIRE Type Explorer UI components (to be implemented in Epic 3-7)
- Other FIRE calculators can check user's selected type
- Main calculator page can show FIRE type preference

### Uses
- ExpenseBaseline (for monthly expense data in calculations)
- CalculatorContext results (for actualHourlyWage in life energy conversions)

## Storage Format

**localStorage key:** `'life-energy-calculator'` (shared with other features)

**Stored format:**
```typescript
{
  fireTypePreferences: {
    selectedType: 'regularfire' | null,
    customAssumptions: {
      withdrawalRate?: number,
      expectedGrowthRate?: number,
      inflationRate?: number,
      pensionAge?: number,
      pensionMonthlyEstimate?: number | null
    },
    showAllTypes: boolean,
    expandedSections: string[],
    lastUpdated: string  // ISO 8601
  }
}
```

## Requirements Fulfilled

- ✅ **Task 2.1:** Extend CalculatorContext State
  - ✅ Add FIRETypePreferences to StoredState interface
  - ✅ Add FIRE Type Explorer initial state to context
  - ✅ Add FIRE Type Explorer actions (all 8 functions)
  - ✅ Add localStorage persistence (load, save, export, import, reset)

## Next Steps

- **Task 2.2:** Implement Context Actions (integrate with calculations)
- **Task 2.3:** Implement LocalStorage Persistence (✅ Already complete)
- **Task 2.4:** Implement Input Validation

## Testing

**Manual Testing:**
1. Open app and verify preferences initialize correctly
2. Set selected type and verify persistence
3. Toggle showAllTypes and verify state updates
4. Expand/collapse sections and verify state
5. Export/import data and verify preferences preserved
6. Reset all and verify preferences cleared

**Integration Testing:**
- Verify preferences persist across page reloads
- Verify export includes FIRE Type preferences
- Verify import restores FIRE Type preferences
- Verify reset clears preferences

## Performance Notes

- All action functions use `useCallback` for optimization
- Auto-save is debounced (500ms) to prevent excessive writes
- State updates are immutable (spread operators)
- No unnecessary re-renders (proper dependency arrays)

## Backwards Compatibility

- `fireTypePreferences` is optional in `StoredState`
- Missing preferences handled gracefully with `|| null`
- No breaking changes to existing features
- Safe to use with older localStorage data

