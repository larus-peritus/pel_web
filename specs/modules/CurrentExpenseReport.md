# Current Expense Report

## Location
- `/src/context/CalculatorContext.tsx` (state management)
- `/src/lib/calculations/currentExpenses.ts` (calculation logic)
- `/src/types/currentExpenses.ts` (type definitions)

## Purpose
Manages state and calculations for the Current Expense Report feature, which tracks actual monthly expenses with granular line items per category. Unlike the Expense Baseline Tool (which plans spending at three tiers), this tool tracks real-world expenses to help users understand where their money goes, calculate life energy costs, and feed accurate data to other calculators.

## State Management

### State Variables
```typescript
currentExpenses: CurrentExpenseReport | null
currentExpenseResults: CurrentExpenseResults | null
```

### CurrentExpenseReport Structure
```typescript
{
  categories: ExpenseCategory[];
  lastUpdated: Date;
  version: number;
}
```

### ExpenseCategory Structure
```typescript
{
  id: string;
  name: string;
  icon: string;
  lineItems: LineItem[];
  isCustom: boolean;
  isHidden: boolean;
  order: number;
}
```

### LineItem Structure
```typescript
{
  id: string;
  label: string;
  amount: number;
  isRecurring: boolean;
  notes?: string;
}
```

## Exported Functions

### State Mutation Functions

#### `updateCurrentExpenses(expenses: Partial<CurrentExpenseReport>): void`
Updates current expenses with partial data.

#### `addCurrentExpenseLineItem(categoryId: string, lineItem: Omit<LineItem, 'id'>): void`
Adds a new line item to a category. Auto-generates unique ID.

**Example:**
```typescript
addCurrentExpenseLineItem('husnaedi', {
  label: 'Leiga',
  amount: 120000,
  isRecurring: true,
  notes: 'Monthly rent'
});
```

#### `updateCurrentExpenseLineItem(categoryId: string, lineItemId: string, updates: Partial<LineItem>): void`
Updates a specific line item within a category.

**Example:**
```typescript
updateCurrentExpenseLineItem('husnaedi', 'line-123', {
  amount: 125000
});
```

#### `deleteCurrentExpenseLineItem(categoryId: string, lineItemId: string): void`
Removes a line item from a category.

#### `addCurrentExpenseCategory(category: Omit<ExpenseCategory, 'id' | 'lineItems'>): void`
Adds a custom expense category.

**Example:**
```typescript
addCurrentExpenseCategory({
  name: 'Gæludýr',
  icon: '🐕',
  isCustom: true,
  isHidden: false,
  order: 99
});
```

#### `removeCurrentExpenseCategory(categoryId: string): void`
Removes a custom category. Cannot remove default categories.

#### `toggleCurrentExpenseCategoryVisibility(categoryId: string): void`
Shows/hides a category from calculations and display.

#### `clearCurrentExpenses(): void`
Removes all current expense data.

### Integration API Functions

#### `getCurrentExpenses(): CurrentExpenseReport | null`
Returns the full current expense report.

#### `getExpensesByCategory(categoryId: string): ExpenseCategory | null`
Returns expenses for a specific category.

**Example:**
```typescript
const housingExpenses = getExpensesByCategory('husnaedi');
```

#### `getSubscriptions(): LineItem[]`
Returns all subscription line items (recurring items from subscription category, streaming services from utilities, and all other recurring items).

**Example:**
```typescript
const subscriptions = getSubscriptions();
// Returns: [{ label: 'Netflix', amount: 2990, isRecurring: true, ... }, ...]
```

#### `getCommuteExpenses(): number`
Returns total monthly commute/transport expenses.

**Example:**
```typescript
const commuteTotal = getCommuteExpenses(); // Returns: 45000
```

#### `getHousingExpenses(): number`
Returns total monthly housing expenses.

**Example:**
```typescript
const housingTotal = getHousingExpenses(); // Returns: 150000
```

#### `hasCurrentExpenses(): boolean`
Checks if current expenses data exists.

## Calculation Functions

### `calculateTotalExpenses(categories: ExpenseCategory[]): { monthly: number; annual: number }`
Calculates total monthly and annual expenses from all visible categories.

### `calculateCategoryBreakdown(categories, totalMonthly, actualHourlyWage): CategoryBreakdown[]`
Calculates per-category totals, percentages, and life energy hours. Returns sorted by total descending.

### `calculateLifeEnergy(categories, totalMonthly, actualHourlyWage): LifeEnergyBreakdown | null`
Calculates life energy (work hours) for all expenses. Returns null if actualHourlyWage not available.

### `getTopExpenses(categories, limit, actualHourlyWage): LineItemSummary[]`
Returns top N expense line items sorted by amount.

### `compareToBaseline(currentExpenses, expenseBaseline): BaselineComparisonData | null`
Compares current expenses to expense baseline, finds closest tier, and identifies over/underspending categories.

### `generateRecommendations(currentExpenses, results, expenseBaseline): Recommendation[]`
Analyzes expense patterns and generates smart recommendations:
- Subscription optimization (if > 10,000 kr/month)
- Commute optimization (if > 30,000 kr/month)
- Housing analysis (if > 30% of total)
- Baseline update suggestion (if significant deviation)

### `extractSubscriptions(expenses): LineItem[]`
Extracts all recurring line items across categories.

### `extractCommuteExpenses(expenses): number`
Extracts total from transport category.

### `extractHousingExpenses(expenses): number`
Extracts total from housing category.

### `extractCategoryExpenses(expenses, categoryId): number`
Generic category total extractor.

## Key Functionality

### Auto-Calculation
Results are automatically recalculated when:
- Current expenses change
- Actual hourly wage changes (affects life energy)
- Expense baseline changes (affects comparison)

### LocalStorage Persistence
- Loads current expenses on mount
- Auto-saves changes with 500ms debounce
- Included in export/import functions
- Supports schema versioning for migrations

### Life Energy Integration
When actual hourly wage is available:
- Every expense shows work hours cost
- Category totals show life energy
- Top expenses ranked by both amount and hours

### Baseline Comparison
When expense baseline exists:
- Identifies which tier (Barebones/Comfortable/Deluxe) current spending matches
- Highlights overspending and underspending categories
- Calculates difference from closest tier

## Dependencies
- **Required**: Actual Hourly Wage Calculator (for life energy calculations)
- **Optional**: Expense Baseline Tool (for comparison features)

## Integration Points

### Used By
- Subscription Burn Meter (pulls subscription data via `getSubscriptions()`)
- Commute Calculator (pulls commute costs via `getCommuteExpenses()`)
- Housing Calculator (pulls housing costs via `getHousingExpenses()`)

### Uses
- Actual Hourly Wage from main calculator results
- Expense Baseline for comparison features

## Example Usage

### Adding Expenses
```typescript
const { addCurrentExpenseLineItem } = useCalculator();

// Add housing expense
addCurrentExpenseLineItem('husnaedi', {
  label: 'Leiga',
  amount: 120000,
  isRecurring: true
});

// Add grocery expense
addCurrentExpenseLineItem('matur', {
  label: 'Bónus groceries',
  amount: 30000,
  isRecurring: false,
  notes: 'Weekly shopping'
});
```

### Accessing Results
```typescript
const { currentExpenseResults } = useCalculator();

if (currentExpenseResults) {
  const { totalMonthly, totalAnnual, lifeEnergy, recommendations } = currentExpenseResults;

  console.log(`Monthly: ${totalMonthly} kr`);
  console.log(`Annual: ${totalAnnual} kr`);

  if (lifeEnergy) {
    console.log(`Life energy: ${lifeEnergy.totalMonthlyHours} hours/month`);
  }

  recommendations.forEach(rec => {
    console.log(`Recommendation: ${rec.title}`);
  });
}
```

### Integration with Other Calculators
```typescript
const { getSubscriptions, getCommuteExpenses } = useCalculator();

// In Subscription Burn Meter
const subscriptions = getSubscriptions();
// Pre-populate with actual subscription data

// In Commute Calculator
const actualCommuteCost = getCommuteExpenses();
// Compare against alternative scenarios
```

## Testing
- Unit tests: `/tests/lib/calculations/currentExpenses.test.ts`
- Coverage: >90% for calculation functions
- Edge cases: empty arrays, zero values, missing AWH, null baseline

## Related Files
- Types: `/src/types/currentExpenses.ts`
- Calculations: `/src/lib/calculations/currentExpenses.ts`
- Context: Part of `/src/context/CalculatorContext.tsx`

## Implementation Status
- Epic 1 (Foundation): Complete
  - Task 1.1: Type definitions - Complete
  - Task 1.3: Calculation functions - Complete
- Epic 2 (State Management): Complete
  - Task 2.1: CalculatorContext state - Complete
  - Task 2.2: Context actions - Complete
  - Task 2.3: LocalStorage persistence - Complete
  - Task 2.4: Integration API - Complete

## Notes
- All monetary values in ISK (Icelandic Króna)
- Life energy calculations require actual hourly wage
- Baseline comparison requires expense baseline to be set
- Line item IDs are auto-generated using timestamp + random string
- Custom categories can be added/removed; default categories can only be hidden
- Auto-save debounced to 500ms to prevent excessive writes
