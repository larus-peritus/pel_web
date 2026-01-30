# Savings Report Context Integration

## Location
`src/context/CalculatorContext.tsx` (Epic 2 integration)

## Purpose
Provides state management, persistence, and integration API for the Savings Report (Sparnaðarskýrsla) feature.

## State Management

### State Properties
```typescript
savingsReport: SavingsReport | null
savingsReportResults: SavingsReportResults | null
```

- `savingsReport`: User's savings data (categories with balances, contributions, targets)
- `savingsReportResults`: Auto-calculated results (totals, rates, life energy, breakdowns)

### Auto-Calculation
Results are automatically recalculated via `useMemo` when:
- `savingsReport` changes
- `actualHourlyWage` changes (from wage calculator)
- `netAnnualIncome` changes (for savings rate calculation)

## Context Actions

### CRUD Operations

**updateSavingsReport(report: Partial<SavingsReport>)**
- Merges partial updates into savings report
- Creates new report if none exists
- Updates `lastUpdated` timestamp
- Auto-saves to localStorage (debounced)

**updateSavingsCategory(categoryId: string, data: Partial<SavingsCategoryData>)**
- Updates a specific category's data (balance, contribution, target, notes)
- Preserves other category properties
- Updates `lastUpdated` timestamp
- Triggers auto-calculation of results

**toggleSavingsCategoryVisibility(categoryId: string)**
- Toggles `isHidden` flag for a category
- Hidden categories excluded from calculations
- Allows users to customize which categories they use

**clearSavingsReport()**
- Removes all savings data
- Sets `savingsReport` to null
- Clears from localStorage

**initializeSavingsReport()**
- Creates new report with default categories
- All categories start with 0 balance and 0 contribution
- Uses `DEFAULT_SAVINGS_CATEGORIES` from constants
- Sets version to 1

## Integration API

Methods for other calculators to access savings data:

**getSavingsReport(): SavingsReport | null**
- Returns current savings report
- Used by FI calculators to access complete savings data

**getTotalSavings(): number**
- Returns total balance across all categories
- Returns 0 if no savings report
- Uses calculated results for performance

**getTotalMonthlyContribution(): number**
- Returns total monthly contribution across all categories
- Returns 0 if no savings report
- Used for savings rate calculations

**getSavingsRate(): number | null**
- Returns savings rate as percentage (0-100+)
- Returns null if income unavailable or no savings report
- Calculated as: (monthly contribution / monthly gross income) * 100

**hasSavingsReport(): boolean**
- Checks if savings report exists and has categories
- Used to determine if user has set up savings tracking

## Persistence

### LocalStorage

**Auto-save (debounced 500ms)**
```typescript
savingsReport: {
  categories: [...],
  lastUpdated: "2026-01-26T...",
  version: 1
}
```

**Loading on Mount**
- Reads from localStorage during initialization
- Converts `lastUpdated` string to Date object
- Falls back to null if not found

**Export/Import**
- Included in full data export (JSON file)
- Restored during import
- Version field supports future migrations

**Reset**
- `resetAll()` clears savings report to null
- Part of complete calculator reset

## Integration with Other Features

### Actual Hourly Wage Calculator
```typescript
const actualHourlyWage = results?.actualHourlyWage ?? null;
```
- Used to calculate life energy (work hours) for savings
- Displayed in category breakdowns
- Shows "X klst" (X hours) next to ISK amounts

### Income Data
```typescript
const grossMonthlyIncome = results?.netAnnualIncome / 12;
```
- Used to calculate savings rate percentage
- Formula: (monthly contribution / monthly income) * 100
- Enables contextual savings rate messages

### FI Calculators
- FI Number calculator can access `getTotalSavings()` for current net worth
- Coast FIRE calculator can use `getSavingsRate()` for projections
- Savings rate context provides FI timeline estimates

## Data Flow

```
User Input (Category Editor)
    ↓
updateSavingsCategory()
    ↓
savingsReport state updated
    ↓
useMemo recalculates results
    ↓
savingsReportResults updated
    ↓
UI displays new totals/rates
    ↓
debounced save to localStorage
```

## Calculation Details

### Total Savings
Sum of all non-hidden category balances

### Total Monthly Contribution
Sum of all non-hidden category monthly contributions

### Savings Rate
```typescript
(totalMonthlyContribution / grossMonthlyIncome) * 100
```
- Requires income to be set
- Returns null if income is 0 or unavailable

### Life Energy
```typescript
balance / actualHourlyWage = hours
monthlyContribution / actualHourlyWage = hours per month
```
- Requires actual hourly wage to be calculated
- Returns null if AWH unavailable

### Category Breakdown
- Sorted by balance (highest first)
- Percentage of total calculated
- Life energy per category (if AWH available)

## Error Handling

**Calculation Errors**
```typescript
try {
  return calculateSavingsReportResults(...);
} catch (error) {
  console.error('Error calculating savings report results:', error);
  return null;
}
```

**Graceful Degradation**
- Works without AWH (life energy shows as unavailable)
- Works without income (savings rate not calculated)
- Hidden categories automatically excluded

## TypeScript Types

### Core Types
- `SavingsReport` - Complete report structure
- `SavingsReportResults` - Calculated results
- `SavingsCategory` - Single category with data
- `SavingsCategoryData` - User-entered values
- `SavingsRateContext` - Contextual message and FI estimate

### Context Type Extension
```typescript
interface CalculatorContextType {
  // ... existing properties

  // Savings Report
  savingsReport: SavingsReport | null;
  savingsReportResults: SavingsReportResults | null;
  updateSavingsReport: (report: Partial<SavingsReport>) => void;
  updateSavingsCategory: (categoryId: string, data: Partial<SavingsCategoryData>) => void;
  toggleSavingsCategoryVisibility: (categoryId: string) => void;
  clearSavingsReport: () => void;
  initializeSavingsReport: () => void;
  getSavingsReport: () => SavingsReport | null;
  getTotalSavings: () => number;
  getTotalMonthlyContribution: () => number;
  getSavingsRate: () => number | null;
  hasSavingsReport: () => boolean;
}
```

## Usage Examples

### Initialize Savings Report
```typescript
const { initializeSavingsReport } = useCalculator();
initializeSavingsReport(); // Creates with default categories
```

### Update Category Data
```typescript
const { updateSavingsCategory } = useCalculator();
updateSavingsCategory('neydarsjodur', {
  balance: 1500000,
  monthlyContribution: 50000,
  targetAmount: 2000000,
  notes: '6 mánaða neyðarsjóður'
});
```

### Access in FI Calculator
```typescript
const { getSavingsReport, getTotalSavings, getSavingsRate } = useCalculator();

const report = getSavingsReport();
const totalSavings = getTotalSavings();
const savingsRate = getSavingsRate();

if (savingsRate !== null && savingsRate >= 50) {
  // User has excellent savings rate
}
```

### Check Results
```typescript
const { savingsReportResults } = useCalculator();

if (savingsReportResults) {
  console.log('Total Savings:', savingsReportResults.totalSavings);
  console.log('Savings Rate:', savingsReportResults.savingsRate);
  console.log('Life Energy:', savingsReportResults.lifeEnergy);
}
```

## Performance Considerations

**Memoization**
- Results calculation is memoized
- Only recalculates when dependencies change
- Efficient for frequent UI updates

**Debounced Saves**
- LocalStorage writes debounced by 500ms
- Prevents excessive I/O on rapid updates
- Matches pattern used for other features

**Callback Optimization**
- All action functions wrapped in `useCallback`
- Prevents unnecessary re-renders
- Stable references for child components

## Testing Strategy

**Unit Tests**
- Test each action function independently
- Verify state updates are immutable
- Check edge cases (null values, missing data)

**Integration Tests**
- Test auto-calculation trigger
- Verify localStorage persistence
- Check integration with AWH and income

**E2E Tests**
- User enters savings data
- Verify calculations update
- Check data persists across sessions

## Related Modules

- `SavingsReportTypes.md` - TypeScript type definitions
- `SavingsReportConstants.md` - Default categories and messages
- `SavingsReportCalculations.md` - Pure calculation functions

## Requirements Fulfilled

- FR-5.1: Save savings report to localStorage
- FR-5.2: Load saved report on page load
- FR-5.3: Export savings data as part of full data export
- FR-5.4: Import savings data from backup file
- FR-6.1-6.5: Integration API for other calculators
- NFR-1: Debounced localStorage (500ms)

## Implementation Date
2026-01-26

## Status
Complete - Epic 2 (Tasks 2.1-2.4) implemented
