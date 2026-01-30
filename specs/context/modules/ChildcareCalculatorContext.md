# Childcare Calculator Context Integration

## Location
`apps/peninganaedalifid/src/context/CalculatorContext.tsx` (integrated)
`apps/peninganaedalifid/src/types/childcare.ts`
`apps/peninganaedalifid/src/lib/calculations/childcare.ts`

## Purpose
Integrates childcare and education expense tracking into the main CalculatorContext, providing state management, automatic calculations, and persistence for childcare items.

## Exports

### State
- `childcareItems: ChildcareItem[]` - Array of childcare/education expense items
- `childcareSummary: ChildcareSummary | null` - Calculated summary with totals and life energy

### CRUD Operations
- `addChildcareItem(item: Omit<ChildcareItem, 'id'>)` - Add new childcare item with auto-generated ID
- `updateChildcareItem(id: string, updates: Partial<ChildcareItem>)` - Update existing item
- `deleteChildcareItem(id: string)` - Remove item by ID

## Key Functionality

### Automatic Calculation
- Childcare summary recalculates automatically when:
  - childcareItems array changes
  - actualHourlyWage changes (from main calculator)
- Uses `useMemo` for efficient recalculation
- Life energy calculation uses `actualHourlyWage` from main calculator results

### State Management
- Childcare items stored in component state
- Debounced auto-save to localStorage (500ms delay)
- Backwards-compatible loading (childcareItems optional in StoredState)

### Persistence
- **localStorage**: Auto-saved with other calculator data
- **Export**: Included in JSON export with all calculator data
- **Import**: Loaded from JSON import files
- **Reset**: Cleared when user resets all data

## Dependencies
- `@/types/childcare` - TypeScript types for childcare items
- `@/lib/calculations/childcare` - Pure calculation functions
- React hooks: useState, useMemo, useCallback, useEffect
- Main calculator results (for actualHourlyWage)

## Tests
- Location: To be created in `tests/context/CalculatorContext-childcare.test.tsx`
- Coverage:
  - Add/update/delete operations
  - Automatic summary recalculation
  - localStorage persistence
  - Export/import functionality
  - Reset behavior

## Integration

### Used by
- Childcare UI components (to be created in Epic 2)
- Main calculator page (will display childcare summary)

### Uses
- `CalculationResults.actualHourlyWage` - For life energy calculations
- `calculateChildcareSummary()` - Pure calculation function
- `generateChildcareId()` - ID generation utility

## Related
- Implements: Task 1.3 from `specs/childcare-education/tasks.md`
- Supports: Requirements NS-1 through NS-9 from `specs/childcare-education/requirements.md`
- Part of: `specs/childcare-education/design.md` architecture

## Implementation Notes

### Design Decisions
1. **Integrated into CalculatorContext** rather than separate context
   - Shares actualHourlyWage automatically
   - Single localStorage/export/import flow
   - Consistent with subscriptions and other features

2. **Optional in StoredState** for backwards compatibility
   - Existing users won't lose data
   - Graceful fallback to empty array

3. **Life Energy calculation** handles missing wage gracefully
   - If actualHourlyWage is 0 or undefined, life energy = 0
   - User can still track ISK costs without wage

### Performance
- useMemo prevents unnecessary recalculations
- Debounced localStorage saves reduce write frequency
- CRUD operations use useCallback for stable references

### Future Enhancements
- Add validation before save
- Add toast notifications for operations
- Add undo/redo for item changes
