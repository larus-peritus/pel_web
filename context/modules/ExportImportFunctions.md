# Export/Import Functions

## Location
`apps/peninganaedalifid/src/lib/storage/exportImport.ts`

## Purpose
Provides data export and import functionality for backing up and restoring application state. Supports version management and safe data migrations between schema versions.

## Exports

### Types
- `interface StoredState` - Application state structure that can be persisted and exported
  - `version: string` - Schema version for migrations (e.g., '1.0.0')
  - `exportedAt?: string` - ISO timestamp of when data was exported
  - `appVersion?: string` - Application version at time of export
  - Future fields will be added as features are implemented (calculator data, scenarios, etc.)

### Functions

#### `exportData(data: StoredState): void`
Exports all data as a downloadable JSON file.

**Features:**
- Creates JSON blob from data
- Adds version and exportedAt timestamp metadata
- Triggers browser download with filename format: `life-energy-data-{date}.json`
- Automatically includes app version from environment
- Handles blob cleanup after download

**Example:**
```ts
const state: StoredState = { version: '1.0.0' };
exportData(state); // Downloads life-energy-data-2026-01-19.json
```

#### `importData(file: File): Promise<StoredState>`
Imports and validates data from a JSON file.

**Features:**
- Reads file as text using FileReader API
- Parses JSON with error handling
- Validates structure using isValidStoredState type guard
- Migrates data to current version if needed
- Returns validated and migrated state

**Error Cases:**
- Throws clear error if file cannot be read
- Throws clear error if JSON parsing fails
- Throws clear error if validation fails with helpful message

**Example:**
```ts
const file = event.target.files[0];
try {
  const state = await importData(file);
  console.log('Data imported successfully:', state);
} catch (error) {
  console.error('Import failed:', error.message);
}
```

#### `isValidStoredState(data: unknown): data is StoredState`
Type guard to validate stored state structure.

**Validation Rules:**
- Must be a non-null object
- Must have `version` field that is a non-empty string
- Optional fields (exportedAt, appVersion) must be strings if present
- Provides TypeScript type narrowing

**Example:**
```ts
const data = JSON.parse(fileContents);
if (isValidStoredState(data)) {
  // TypeScript now knows data is StoredState
  console.log(data.version);
}
```

#### `migrateState(data: StoredState): StoredState`
Migrates data from older versions to current version.

**Features:**
- Compares version numbers (semantic versioning)
- Only migrates if data is from older version
- Returns unchanged data if already current or newer
- Updates version field to current version after migration
- Preserves all existing data during migration

**Migration Strategy:**
- Currently uses version '1.0.0' as baseline
- Future migrations will be added as conditional blocks
- Each migration step documented inline

**Example:**
```ts
const oldData: StoredState = { version: '0.9.0' };
const newData = migrateState(oldData);
console.log(newData.version); // '1.0.0'
```

## Key Functionality

### Export Process
1. Add metadata (exportedAt timestamp, appVersion)
2. Ensure version is set to current or provided version
3. Convert to JSON with 2-space indentation for readability
4. Create Blob with correct MIME type
5. Generate filename with current date
6. Trigger download via temporary anchor element
7. Clean up object URL

### Import Process
1. Read file using FileReader API
2. Parse JSON string
3. Validate structure with type guard
4. Migrate to current version if needed
5. Return validated data or throw descriptive error

### Version Management
- Uses semantic versioning (MAJOR.MINOR.PATCH)
- Current version: '1.0.0'
- Version comparison logic for migration decisions
- Preserves backward compatibility

## Dependencies
- Browser FileReader API (client-side only)
- Browser Blob and URL APIs (client-side only)
- process.env.NEXT_PUBLIC_APP_VERSION (optional)

## Integration

### Used by
- Will be used by Header component for export/import buttons
- Will be used by data management features

### Uses
- No internal dependencies (standalone module)
- Exported from `src/lib/storage/index.ts` for clean imports

## Error Handling

### Export Errors
- No explicit error handling needed (browser download cannot fail silently)
- If export fails, user simply won't get download

### Import Errors
- File read errors: "Failed to read file. Please try again."
- JSON parse errors: "Failed to parse file. The file may be corrupted or not a valid JSON file."
- Validation errors: "Invalid file format. Please select a valid backup file exported from this application."
- Unknown errors: "An unexpected error occurred while importing data"

All errors are user-friendly and actionable.

## Testing Considerations

**Unit Tests (to be created separately):**
- Test isValidStoredState with valid data
- Test isValidStoredState with invalid data (null, missing version, wrong types)
- Test migrateState preserves data for current version
- Test migrateState updates version field
- Test exportData generates correct filename format
- Test importData with valid JSON file
- Test importData error handling (invalid JSON, invalid structure)

**Integration Tests:**
- Test full export → import cycle
- Test migration from mock older version

## Related
- Implements: Requirements US-F9, US-F10 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 4: Data Persistence - Export/Import)
- Complements: context/modules/StorageAdapter.md (localStorage wrapper functions)

## Implementation Notes

### Design Decisions
1. **Filename Format:** Uses ISO date format (YYYY-MM-DD) for sortability
2. **Version as String:** Semantic versioning uses strings for flexibility
3. **Promise-based Import:** Async API for FileReader compatibility
4. **Type Guard Pattern:** Provides runtime validation with TypeScript integration
5. **Explicit Error Messages:** User-facing errors are clear and actionable

### Future Extensions
- Support for partial exports (specific features only)
- Compression for large datasets
- Encryption for sensitive data (if needed)
- Multiple file format support (CSV, XML)
- Cloud backup integration (optional)

### Browser Compatibility
- FileReader API: Supported in all modern browsers
- Blob API: Supported in all modern browsers
- Object URL: Supported in all modern browsers
- Download attribute: Supported in all modern browsers (IE 10+)

No polyfills needed for target browser list.
