# useLocalStorage Hook

## Location
`apps/peninganaedalifid/src/hooks/useLocalStorage.ts`

## Purpose
Generic React hook for managing state with localStorage persistence. Provides SSR-safe, debounced, and error-handled localStorage operations with full TypeScript support.

## Exports

### Main Hook
- `useLocalStorage<T>(key, initialValue, options?)` - Custom hook for persisted state management

### Types
- `UseLocalStorageOptions` - Configuration options interface
- `UseLocalStorageReturn<T>` - Return type tuple

## Key Functionality

### Core Features
- **SSR-safe**: Returns initial value during server-side rendering without errors
- **Debounced writes**: Reduces localStorage operations with configurable delay (default 300ms)
- **Error handling**: Catches and reports localStorage errors with optional callback
- **Loading state**: Tracks initial hydration from localStorage
- **Type-safe**: Full generic type support for stored values
- **React state sync**: Immediate UI updates, debounced storage writes

### API

#### Parameters
- `key: string` - The localStorage key to use
- `initialValue: T` - The initial value if no stored value exists
- `options?: UseLocalStorageOptions` - Optional configuration
  - `debounceMs?: number` - Debounce delay in ms (default: 300)
  - `onError?: (error: Error) => void` - Error callback

#### Return Value
Returns a tuple: `[value, setValue, { isLoading, error }]`
- `value: T` - Current value
- `setValue: (value: T | ((prev: T) => T)) => void` - Setter function (supports updater functions)
- `{ isLoading: boolean; error: Error | null }` - State object

## Dependencies

### Internal
- `@/lib/storage/localStorage` - Uses `safeGetItem` and `safeSetItem`

### External
- `react` - Uses `useState`, `useEffect`, `useCallback`, `useRef`

## Usage Examples

### Basic Usage
```tsx
function MyComponent() {
  const [name, setName, { isLoading }] = useLocalStorage('user_name', 'Guest');

  if (isLoading) return <div>Loading...</div>;

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### With Custom Options
```tsx
const [settings, setSettings, { error }] = useLocalStorage(
  'app_settings',
  { theme: 'light', language: 'en' },
  {
    debounceMs: 500,
    onError: (err) => console.error('Storage error:', err),
  }
);
```

### Complex State with Updater Function
```tsx
const [items, setItems] = useLocalStorage<string[]>('todo_items', []);

// Add item using updater function
const addItem = (item: string) => {
  setItems(prev => [...prev, item]);
};
```

## Implementation Details

### Initialization Flow
1. Component mounts with initial value
2. `isLoading` is set to `true`
3. Checks for browser environment (`typeof window !== 'undefined'`)
4. Attempts to read from localStorage using `safeGetItem`
5. If value exists, updates state
6. Sets `isLoading` to `false`

### Write Flow
1. User calls `setValue` with new value or updater function
2. React state updates immediately (responsive UI)
3. Previous debounce timer is cleared
4. New timer is set (default 300ms)
5. After delay, writes to localStorage using `safeSetItem`
6. Error handling updates error state and calls `onError` callback if provided

### Cleanup
- Clears debounce timer on unmount
- Uses `isMountedRef` to prevent state updates after unmount

## Tests
Tests will be created separately as per project workflow.

Test coverage should include:
- SSR behavior (returns initial value, no errors)
- Initial value loading from localStorage
- State updates (immediate)
- Debounced writes to localStorage
- Updater function support
- Error handling
- Cleanup on unmount

## Integration

### Used by
Will be used by:
- Calculator components for persisting user inputs
- Settings/preferences components
- Any feature requiring client-side state persistence

### Uses
- `safeGetItem` from `@/lib/storage/localStorage`
- `safeSetItem` from `@/lib/storage/localStorage`

## Related
- Implements: Requirements F21 from `specs/project-foundation/requirements.md`
- Part of: `specs/project-foundation/design.md` (Data Persistence section)
- Depends on: `context/modules/StorageAdapter.md` (Storage layer)
- Exported from: `src/hooks/index.ts` (Barrel export)

## Performance Considerations

### Debouncing
- Default 300ms debounce prevents excessive localStorage writes
- Configurable via `debounceMs` option
- UI remains responsive with immediate state updates

### Memory
- Uses refs for timer and mounted state (no re-render on timer changes)
- Cleanup prevents memory leaks

### SSR
- No localStorage access during server rendering
- Graceful fallback to initial value
- Client hydration happens on mount

## Error Scenarios

### Handled Errors
- localStorage quota exceeded
- JSON parse errors (malformed stored data)
- localStorage disabled or unavailable
- Server-side rendering (graceful fallback)

### Error Reporting
- Errors set in `error` state
- Optional `onError` callback for custom handling
- Console warnings for debugging (via `safeGetItem`/`safeSetItem`)

## Notes
- Marked with `'use client'` directive for Next.js client component
- Uses TypeScript generics for full type safety
- Follows React hooks best practices (ESLint rules compliant)
- Compatible with React 18+ features (no legacy patterns)
