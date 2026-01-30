# Calculator Context

## Location
`apps/peninganaedalifid/src/context/CalculatorContext.tsx`

## Purpose
Provides centralized state management for the Actual Hourly Wage Calculator using React Context API. Handles calculator inputs, automatic result calculation, scenario management, and data persistence.

## Exports

### Components
- `CalculatorProvider` - Context provider component that wraps the application
- `useCalculator` - Custom hook for accessing calculator context

### Types
- `CalculatorContextType` - TypeScript interface for context value

## Key Functionality

### State Management
- **Inputs State**: Manages income, money expenses, and time expenses using `useState`
- **Scenarios State**: Stores up to 3 saved scenarios for comparison
- **Subscriptions State**: Manages user's subscription list
- **Meal Cost State**: Manages eating out and home cooking data
- **Commute Scenarios State**: Stores up to 4 commute scenarios for comparison
- **Hydration State**: Tracks whether initial localStorage data has been loaded

### Automatic Calculation
- Results are calculated automatically using `useMemo` whenever inputs change
- Returns `null` when gross annual income is zero or negative
- Uses `calculateResults()` from `@/lib/calculations`

### Update Functions
- `updateIncome(updates)` - Partial update for income inputs
- `updateMoneyExpenses(updates)` - Partial update for money expenses
- `updateTimeExpenses(updates)` - Partial update for time expenses
- `setInputs(inputs)` - Complete replacement of all inputs

### Scenario Management
- `saveCurrentAsScenario(name)` - Saves current inputs and results as a named scenario
- `loadScenario(id)` - Loads a saved scenario into current inputs
- `deleteScenario(id)` - Removes a scenario from storage
- **Limit**: Maximum 3 scenarios enforced (warns in console if exceeded)

### Commute Scenario Management
- `addCommuteScenario(scenario)` - Adds a new commute scenario with calculated results
- `updateCommuteScenario(id, updates)` - Updates an existing commute scenario and recalculates
- `deleteCommuteScenario(id)` - Removes a commute scenario
- `duplicateCommuteScenario(id)` - Creates a copy of an existing scenario with new ID
- **Limit**: Maximum 4 commute scenarios enforced (throws error if exceeded)
- **Auto-recalculation**: All scenarios automatically recalculate when actualHourlyWage changes
- **Error Messages**: All errors in Icelandic (e.g., "Þú getur aðeins haft 4 sviðsmyndir í einu")

### Persistence
- **Auto-save**: Debounced (500ms) automatic save to localStorage after any change
- **Manual Save**: `saveToStorage()` - Immediate save to localStorage
- **Load**: `loadFromStorage()` - Manual load from localStorage
- **Reset**: `resetAll()` - Clears all inputs and scenarios to defaults
- **Storage Key**: `actual-hourly-wage-calculator`
- **Version**: `1` (from STORAGE_VERSION constant)

### Export/Import
- **Export**: `exportData()` - Downloads JSON file with all calculator data
  - Filename format: `life-energy-calculator-YYYY-MM-DD.json`
  - Includes current inputs, scenarios, and metadata
- **Import**: `importData(file)` - Async function to import from JSON file
  - Validates file structure and version compatibility
  - Throws errors for invalid/incompatible files
  - Updates inputs and scenarios on success

### Preset Application
- `applyPreset(preset)` - Applies a preset configuration
- Supports commute, clothing, and meals presets
- Updates money expenses based on preset category and values

## Dependencies

### Internal
- `@/types/calculator` - All calculator-related TypeScript types
- `@/lib/defaults` - Default values and constants (DEFAULT_INPUTS, STORAGE_KEY, STORAGE_VERSION)
- `@/lib/calculations` - Calculation engine (calculateResults function)
- `@/lib/calculations/subscriptions` - Subscription calculations (calculateSubscriptionSummary, generateSubscriptionId)
- `@/lib/calculations/mealCost` - Meal cost calculations (compareEatingOutVsHome, etc.)
- `@/lib/calculations/commute` - Commute calculations (calculateCommuteResults, generateCommuteId)
- `@/lib/storage/localStorage` - Safe localStorage wrapper (safeGetItem, safeSetItem)
- `@/lib/constants/mealCost` - Meal cost defaults (DEFAULT_EATING_OUT_DATA, DEFAULT_HOME_COOKING_DATA)

### External
- `react` - Context, hooks (useState, useMemo, useCallback, useEffect, useContext)

## Data Flow

1. **Component Mount**
   - Load saved state from localStorage
   - Set isHydrated to true
   - Initialize with saved inputs or defaults

2. **User Updates Input**
   - Update function called (updateIncome, updateMoneyExpenses, etc.)
   - State updated via setState
   - Results recalculated automatically (useMemo)
   - Debounced auto-save triggered (500ms delay)

3. **Saving Scenario**
   - User calls saveCurrentAsScenario(name)
   - Current inputs and results captured
   - Scenario added to scenarios array
   - Auto-save persists to localStorage

4. **Export**
   - User calls exportData()
   - Current state serialized to JSON
   - Browser downloads file automatically

5. **Import**
   - User selects file via file input
   - importData(file) called
   - File read and validated
   - State updated on success
   - Auto-save persists imported data

## Context Value Structure

```typescript
{
  // Current state
  inputs: CalculatorInputs;           // All user inputs
  results: CalculationResults | null;  // Calculated results or null
  scenarios: Scenario[];               // Saved scenarios (max 3)
  isHydrated: boolean;                // True after initial load

  // Update methods
  setInputs: (inputs) => void;
  updateIncome: (income) => void;
  updateMoneyExpenses: (expenses) => void;
  updateTimeExpenses: (time) => void;

  // Scenario methods
  saveCurrentAsScenario: (name) => void;
  loadScenario: (id) => void;
  deleteScenario: (id) => void;

  // Persistence methods
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportData: () => void;
  importData: (file) => Promise<void>;
  resetAll: () => void;

  // Preset method
  applyPreset: (preset) => void;
}
```

## Usage Example

```tsx
// In app root (app/layout.tsx or app/page.tsx)
import { CalculatorProvider } from '@/context/CalculatorContext';

export default function RootLayout({ children }) {
  return (
    <CalculatorProvider>
      {children}
    </CalculatorProvider>
  );
}

// In any child component
import { useCalculator } from '@/context/CalculatorContext';

function MyComponent() {
  const {
    inputs,
    results,
    updateIncome,
    saveCurrentAsScenario,
  } = useCalculator();

  return (
    <div>
      <p>Actual Wage: ${results?.actualHourlyWage.toFixed(2)}</p>
      <button onClick={() => updateIncome({ grossAnnualIncome: 60000 })}>
        Set Income to $60k
      </button>
      <button onClick={() => saveCurrentAsScenario('Current Job')}>
        Save Scenario
      </button>
    </div>
  );
}
```

## Error Handling

### Hook Usage Error
- Throws error if `useCalculator()` is called outside `CalculatorProvider`
- Error message: "useCalculator must be used within a CalculatorProvider"

### Import Errors
- **Invalid JSON**: Throws "Failed to parse file..."
- **Invalid Structure**: Throws "Invalid file format..."
- **Version Mismatch**: Throws "Incompatible file version..."
- **File Read Error**: Throws "Failed to read file..."

### Scenario Limit
- Logs warning to console when attempting to save 4th scenario
- Silently fails (doesn't add scenario)

## Storage Format

Saved to localStorage as JSON under key `actual-hourly-wage-calculator`:

```json
{
  "version": 1,
  "currentInputs": {
    "income": { ... },
    "moneyExpenses": { ... },
    "timeExpenses": { ... }
  },
  "scenarios": [
    {
      "id": "scenario-1234567890",
      "name": "Current Job",
      "inputs": { ... },
      "results": { ... },
      "createdAt": "2026-01-19T...",
      "updatedAt": "2026-01-19T..."
    }
  ],
  "lastUpdated": "2026-01-19T14:00:00.000Z"
}
```

## Tests
- Location: `tests/context/CalculatorContext.test.tsx`
- Coverage: 27 tests covering:
  - Provider initialization and hydration
  - All input update methods
  - Calculation result updates
  - Scenario CRUD operations
  - Manual and auto-save persistence
  - Export functionality
  - Import with validation
  - Preset application
  - Error handling

## Integration
- Used by: All calculator UI components
- Uses: Calculation engine, storage utilities, type definitions

## Performance Considerations
- **Memoization**: Results recalculated only when inputs change (useMemo)
- **Debouncing**: Auto-save debounced to 500ms to prevent excessive writes
- **Callbacks**: All update functions wrapped in useCallback to prevent re-renders

## Related
- Implements: Requirements R-CALC-001, R-CALC-002, R-CALC-003 from specs/actual-hourly-wage-calculator/requirements.md
- Part of: specs/actual-hourly-wage-calculator/design.md (State Management section)
- Task: Task 9 from specs/actual-hourly-wage-calculator/tasks.md
