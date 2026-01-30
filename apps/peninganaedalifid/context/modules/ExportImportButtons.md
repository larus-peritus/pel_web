# ExportImportButtons Component

## Location
`apps/peninganaedalifid/src/components/calculator/ExportImportButtons.tsx`

## Purpose
Provides UI controls for exporting calculator data to JSON file, importing data from JSON file, and resetting all calculator data.

## Exports
- `function ExportImportButtons` - Component providing data management buttons

## Key Functionality
- Export current calculator state to date-stamped JSON file
- Import calculator state from JSON file with validation
- Reset all data to defaults
- File input handling with hidden input element
- Error handling for invalid import files

## Dependencies
- `@/context/CalculatorContext` - For exportData, importData, resetAll functions
- `@/components/ui/Button` - For action buttons
- `@/components/ui/Card` - For container layout
- React hooks: useRef for file input reference

## UI Features
- Three action buttons: Export, Import, Reset
- Hidden file input triggered by Import button
- Card container with outlined variant
- Reset button styled with error color to indicate destructive action
- File input accepts only .json files

## Integration
- Used by: Main calculator page (src/app/page.tsx)
- Uses: CalculatorContext for all data operations
- Part of: Calculator components barrel export

## Tests
- Location: tests/components/calculator/ExportImportButtons.test.tsx
- Coverage: 13 tests covering rendering, export, import, reset, styling, and accessibility

## Related
- Implements: Task 24 from specs/actual-hourly-wage-calculator/tasks.md
- Part of: Actual Hourly Wage Calculator feature
- Works with: CalculatorContext for state persistence
