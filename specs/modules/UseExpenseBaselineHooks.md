# useExpenseBaseline Hooks

## Location
`src/hooks/useExpenseBaseline.ts`

## Purpose
Custom React hooks for consuming expense baseline data from CalculatorContext. Provides easy access to baseline state, tier selection management, and expense lookup.

## Hooks

### 1. useExpenseBaseline()

Access expense baseline data and results from context.

**Return Type:**
```typescript
interface UseExpenseBaselineReturn {
  baseline: ExpenseBaseline | null;
  results: ExpenseBaselineResults | null;
  hasBaseline: boolean;
}
```

**Usage:**
```tsx
function MyComponent() {
  const { baseline, results, hasBaseline } = useExpenseBaseline();

  if (!hasBaseline) {
    return <BaselinePrompt />;
  }

  return <div>Total: {results?.totals.comfortable}</div>;
}
```

---

### 2. useSelectedTier(initialTier)

Manage selected tier state with automatic expense lookup.

**Parameters:**
- `initialTier: ExpenseTier` - Initial tier selection (default: 'comfortable')

**Return Type:**
```typescript
[
  selectedTier: ExpenseTier,
  setSelectedTier: (tier: ExpenseTier) => void,
  expense: number
]
```

**Usage:**
```tsx
function FINumberCalculator() {
  const [tier, setTier, monthlyExpense] = useSelectedTier('comfortable');

  const annualExpense = monthlyExpense * 12;
  const fiNumber = annualExpense * 25;

  return (
    <div>
      <TierSelector selectedTier={tier} onSelectTier={setTier} />
      <p>FI Number: {formatCurrency(fiNumber)}</p>
    </div>
  );
}
```

**Features:**
- Returns tuple like useState but with expense amount
- Automatically looks up expense for selected tier
- Memoized for performance
- Returns 0 if no baseline exists

---

### 3. useExpenseByTier(tier)

Get expense amount for a specific tier.

**Parameters:**
- `tier: ExpenseTier` - The tier to get expense for

**Return Type:**
- `number` - Monthly expense amount (0 if no baseline)

**Usage:**
```tsx
function ExpenseDisplay() {
  const bareExpense = useExpenseByTier('barebones');
  const comfExpense = useExpenseByTier('comfortable');
  const deluxeExpense = useExpenseByTier('deluxe');

  return (
    <div>
      <p>Barebones: {formatCurrency(bareExpense)}</p>
      <p>Comfortable: {formatCurrency(comfExpense)}</p>
      <p>Deluxe: {formatCurrency(deluxeExpense)}</p>
    </div>
  );
}
```

**Features:**
- Memoized to avoid recalculation
- Returns 0 if no baseline set
- Safe to use before baseline is created

## Integration

All hooks use `useCalculator()` from CalculatorContext:
- `expenseBaseline` - State
- `expenseBaselineResults` - Calculated results
- `getExpenseByTier(tier)` - Expense lookup function
- `hasExpenseBaseline()` - Existence check function

## Performance

All hooks use `useMemo` to optimize:
- `useExpenseBaseline` - Memoizes return object
- `useSelectedTier` - Memoizes expense lookup
- `useExpenseByTier` - Memoizes result

Re-computation only occurs when dependencies change:
- Tier selection changes
- Baseline data changes
- Expense values update

## Tests
- Location: `tests/hooks/useExpenseBaseline.test.tsx`
- Coverage: 13 tests across all three hooks
  - Null baseline handling
  - Structure validation
  - State management
  - Memoization
  - Integration between hooks

## Related
- Components: TierSelector, BaselinePrompt
- Context: CalculatorContext
- Types: ExpenseTier, ExpenseBaseline, ExpenseBaselineResults

## Design Pattern

These hooks follow the "Custom Hook" pattern:
1. **Abstraction** - Hide context complexity
2. **Reusability** - Use in multiple components
3. **Composition** - Combine with other hooks
4. **Type Safety** - Full TypeScript support

Example combining hooks:
```tsx
function Calculator() {
  const { hasBaseline } = useExpenseBaseline();
  const [tier, setTier, expense] = useSelectedTier();
  const bareExpense = useExpenseByTier('barebones');

  // Use all three together...
}
```
