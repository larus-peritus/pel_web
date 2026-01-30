# Storage Adapter

## Location
`apps/peninganaedalifid/src/lib/storage/localStorage.ts`

## Purpose
Provides safe wrapper functions for browser localStorage with comprehensive error handling and SSR (Server-Side Rendering) compatibility. All functions gracefully handle cases where localStorage is unavailable or throws errors (quota exceeded, privacy mode, etc.).

## Exports

### `safeGetItem<T>(key: string): T | null`
Safely reads and parses JSON from localStorage.

**Features**:
- Generic type support for type-safe retrieval
- SSR-safe: returns null when window is undefined
- Handles missing keys (returns null)
- Catches JSON parse errors
- Logs warnings on failure

**Example**:
```typescript
import { safeGetItem } from '@/lib/storage';

const userData = safeGetItem<UserData>('user_data');
if (userData) {
  console.log(userData.name);
}
```

### `safeSetItem(key: string, value: unknown): boolean`
Safely stringifies and writes to localStorage.

**Features**:
- Accepts any JSON-serializable value
- SSR-safe: returns false when window is undefined
- Catches quota exceeded errors
- Catches serialization errors
- Returns boolean success indicator
- Logs warnings on failure

**Example**:
```typescript
import { safeSetItem } from '@/lib/storage';

const success = safeSetItem('user_data', { name: 'John', age: 30 });
if (!success) {
  console.error('Failed to save user data');
}
```

### `safeRemoveItem(key: string): boolean`
Safely removes item from localStorage.

**Features**:
- SSR-safe: returns false when window is undefined
- Catches removal errors
- Returns boolean success indicator
- Logs warnings on failure

**Example**:
```typescript
import { safeRemoveItem } from '@/lib/storage';

const success = safeRemoveItem('user_data');
if (success) {
  console.log('User data cleared');
}
```

## Key Functionality
- **SSR Compatibility**: All functions check for `typeof window !== 'undefined'` before accessing localStorage
- **Error Handling**: All localStorage operations wrapped in try-catch blocks
- **Type Safety**: Generic type parameter for `safeGetItem` provides compile-time type checking
- **Silent Failures**: Returns null/false on errors rather than throwing, allowing graceful degradation
- **Debug Logging**: Console warnings help with debugging while not breaking the application

## Dependencies
- None (uses browser native localStorage API)

## Tests
- Location: Tests will be created separately as per task specification
- Coverage: Will include SSR scenarios, error handling, JSON parsing, quota exceeded errors

## Integration
- Used by: `useLocalStorage` hook (Task F21)
- Used by: Export/Import functions (Task F23)
- Uses: Browser localStorage API

## Error Scenarios Handled
1. **SSR Environment**: Returns null/false when `window` is undefined
2. **localStorage Unavailable**: Returns null/false if localStorage doesn't exist
3. **Quota Exceeded**: Returns false when storage quota is exceeded
4. **Invalid JSON**: Returns null if stored data cannot be parsed
5. **Privacy Mode**: Handles browsers in privacy mode where localStorage may throw
6. **Serialization Errors**: Returns false if value cannot be JSON stringified

## Related
- Implements: Requirement F-REQ-7 (localStorage with error handling) from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 4: Data Persistence)
- Task: F22 in specs/project-foundation/tasks.md

## Implementation Notes
- All functions are pure and have no side effects beyond localStorage operations
- Console warnings help with debugging but don't expose sensitive data
- The adapter follows the principle of defensive programming
- Designed for use in Next.js App Router with both client and server components
