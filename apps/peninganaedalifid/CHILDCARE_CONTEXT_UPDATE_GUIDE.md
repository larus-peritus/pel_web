# Childcare Calculator - CalculatorContext Update Guide

This document provides the exact code changes needed to integrate the childcare calculator into the existing CalculatorContext.

## Step 1: Update `src/types/calculator.ts`

### Add to StoredState interface (line ~133, after carOwnershipScenarios)

```typescript
childcareItems?: import('./childcare').ChildcareItem[]; // Childcare expense items (optional for backwards compatibility)
```

Full StoredState should look like:
```typescript
export interface StoredState {
  version: number;
  currentInputs: CalculatorInputs;
  scenarios: Scenario[];
  subscriptions: Subscription[];
  commuteScenarios: CommuteScenario[];
  mealCostData?: MealCostData;
  periods?: Period[];
  convenienceExpenses?: ConvenienceExpense[];
  convenienceGoal?: ConvenienceGoal;
  carOwnershipScenarios?: import('./car-ownership').CarOwnershipScenario[];
  childcareItems?: import('./childcare').ChildcareItem[]; // NEW LINE
  lastUpdated: string;
}
```

## Step 2: Update `src/context/CalculatorContext.tsx`

### 2.1: Add imports (after line 31)

```typescript
import type {
  // ... existing imports ...
  ConvenienceGoal,
} from '@/types/calculator';
// ADD THESE LINES:
import type {
  ChildcareItem,
  ChildcareSummary,
} from '@/types/childcare';
import {
  calculateChildcareSummary,
  generateChildcareId,
} from '@/lib/calculations/childcare';
```

### 2.2: Add to CalculatorContextType interface (after line ~110)

```typescript
// Convenience Expense Tracker
convenienceExpenses: ConvenienceExpense[];
expenseSummary: ConvenienceExpenseSummary | null;
convenienceGoal: ConvenienceGoal | null;
addConvenienceExpense: (expense: Omit<ConvenienceExpense, 'id'>) => void;
updateConvenienceExpense: (id: string, updates: Partial<ConvenienceExpense>) => void;
deleteConvenienceExpense: (id: string) => void;
setConvenienceGoal: (goal: ConvenienceGoal) => void;
deleteConvenienceGoal: () => void;

// ADD THESE LINES:
// Childcare & Education Calculator
childcareItems: ChildcareItem[];
childcareSummary: ChildcareSummary | null;
addChildcareItem: (item: Omit<ChildcareItem, 'id'>) => void;
updateChildcareItem: (id: string, updates: Partial<ChildcareItem>) => void;
deleteChildcareItem: (id: string) => void;
```

### 2.3: Add state variable (after line ~195, with other useState declarations)

```typescript
const [convenienceExpenses, setConvenienceExpenses] = useState<ConvenienceExpense[]>([]);
const [convenienceGoal, setConvenienceGoalState] = useState<ConvenienceGoal | null>(null);
// ADD THIS LINE:
const [childcareItems, setChildcareItems] = useState<ChildcareItem[]>([]);
const [isHydrated, setIsHydrated] = useState(false);
```

### 2.4: Add childcareSummary calculation (after expenseSummary useMemo, around line ~240)

```typescript
// Calculate expense summary
const expenseSummary = useMemo(() => {
  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  return calculateExpenseSummary(convenienceExpenses, actualHourlyWage);
}, [convenienceExpenses, results?.actualHourlyWage]);

// ADD THESE LINES:
// Calculate childcare summary
const childcareSummary = useMemo(() => {
  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  return calculateChildcareSummary(childcareItems, actualHourlyWage);
}, [childcareItems, results?.actualHourlyWage]);
```

### 2.5: Update localStorage load (in useEffect, around line ~280)

```typescript
useEffect(() => {
  const stored = safeGetItem<StoredState>(STORAGE_KEY);
  if (stored && stored.version === STORAGE_VERSION) {
    setInputs(stored.currentInputs);
    setScenarios(stored.scenarios || []);
    setSubscriptions(stored.subscriptions || []);
    if (stored.mealCostData) {
      setMealCostData(stored.mealCostData);
    }
    setCommuteScenarios(stored.commuteScenarios || []);
    setPeriods(stored.periods || []);
    setConvenienceExpenses(stored.convenienceExpenses || []);
    setConvenienceGoalState(stored.convenienceGoal || null);
    // ADD THIS LINE:
    setChildcareItems(stored.childcareItems || []);
  }
  setIsHydrated(true);
}, []);
```

### 2.6: Update localStorage save (in useEffect, around line ~300)

```typescript
useEffect(() => {
  if (!isHydrated) return;

  const timeoutId = setTimeout(() => {
    const state: StoredState = {
      version: STORAGE_VERSION,
      currentInputs: inputs,
      scenarios,
      subscriptions,
      commuteScenarios,
      mealCostData,
      periods,
      convenienceExpenses,
      convenienceGoal,
      // ADD THIS LINE:
      childcareItems,
      lastUpdated: new Date().toISOString(),
    };
    safeSetItem(STORAGE_KEY, state);
  }, 500);

  return () => clearTimeout(timeoutId);
}, [
  inputs,
  scenarios,
  subscriptions,
  commuteScenarios,
  mealCostData,
  periods,
  convenienceExpenses,
  convenienceGoal,
  childcareItems, // ADD TO DEPENDENCY ARRAY
  isHydrated,
]);
```

### 2.7: Add CRUD functions (after convenience expense functions, around line ~670)

```typescript
const deleteConvenienceGoal = useCallback(() => {
  setConvenienceGoalState(null);
}, []);

// ADD THESE FUNCTIONS:
// Childcare management
const addChildcareItem = useCallback((item: Omit<ChildcareItem, 'id'>) => {
  const newItem: ChildcareItem = {
    ...item,
    id: generateChildcareId(),
  };
  setChildcareItems((prev) => [...prev, newItem]);
}, []);

const updateChildcareItem = useCallback(
  (id: string, updates: Partial<ChildcareItem>) => {
    setChildcareItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  },
  []
);

const deleteChildcareItem = useCallback((id: string) => {
  setChildcareItems((prev) => prev.filter((item) => item.id !== id));
}, []);
```

### 2.8: Update saveToStorage function (around line ~680)

```typescript
const saveToStorage = useCallback(() => {
  const state: StoredState = {
    version: STORAGE_VERSION,
    currentInputs: inputs,
    scenarios,
    subscriptions,
    commuteScenarios,
    mealCostData,
    periods,
    convenienceExpenses,
    convenienceGoal,
    // ADD THIS LINE:
    childcareItems,
    lastUpdated: new Date().toISOString(),
  };
  safeSetItem(STORAGE_KEY, state);
}, [
  inputs,
  scenarios,
  subscriptions,
  commuteScenarios,
  mealCostData,
  periods,
  convenienceExpenses,
  convenienceGoal,
  childcareItems, // ADD TO DEPENDENCY ARRAY
]);
```

### 2.9: Update loadFromStorage function (around line ~700)

```typescript
const loadFromStorage = useCallback(() => {
  const stored = safeGetItem<StoredState>(STORAGE_KEY);
  if (stored && stored.version === STORAGE_VERSION) {
    setInputs(stored.currentInputs);
    setScenarios(stored.scenarios || []);
    setSubscriptions(stored.subscriptions || []);
    if (stored.mealCostData) {
      setMealCostData(stored.mealCostData);
    }
    setCommuteScenarios(stored.commuteScenarios || []);
    setPeriods(stored.periods || []);
    setConvenienceExpenses(stored.convenienceExpenses || []);
    setConvenienceGoalState(stored.convenienceGoal || null);
    // ADD THIS LINE:
    setChildcareItems(stored.childcareItems || []);
  }
}, []);
```

### 2.10: Update exportDataHandler function (around line ~715)

```typescript
const exportDataHandler = useCallback(() => {
  const state: StoredState = {
    version: STORAGE_VERSION,
    currentInputs: inputs,
    scenarios,
    subscriptions,
    commuteScenarios,
    mealCostData,
    periods,
    convenienceExpenses,
    convenienceGoal,
    // ADD THIS LINE:
    childcareItems,
    lastUpdated: new Date().toISOString(),
  };
  // ... rest of export logic
}, [
  inputs,
  scenarios,
  subscriptions,
  commuteScenarios,
  mealCostData,
  periods,
  convenienceExpenses,
  convenienceGoal,
  childcareItems, // ADD TO DEPENDENCY ARRAY
]);
```

### 2.11: Update importDataHandler function (around line ~755)

```typescript
// Load data
setInputs(data.currentInputs);
setScenarios(data.scenarios || []);
setSubscriptions(data.subscriptions || []);
if (data.mealCostData) {
  setMealCostData(data.mealCostData);
}
setCommuteScenarios(data.commuteScenarios || []);
setPeriods(data.periods || []);
setConvenienceExpenses(data.convenienceExpenses || []);
setConvenienceGoalState(data.convenienceGoal || null);
// ADD THIS LINE:
setChildcareItems(data.childcareItems || []);
```

### 2.12: Update resetAll function (around line ~775)

```typescript
const resetAll = useCallback(() => {
  setInputs(DEFAULT_INPUTS);
  setScenarios([]);
  setSubscriptions([]);
  setMealCostData({
    eatingOut: DEFAULT_EATING_OUT_DATA,
    homeCooking: DEFAULT_HOME_COOKING_DATA,
  });
  setCommuteScenarios([]);
  setPeriods([]);
  setConvenienceExpenses([]);
  setConvenienceGoalState(null);
  // ADD THIS LINE:
  setChildcareItems([]);
}, []);
```

### 2.13: Update value object (around line ~790)

```typescript
const value: CalculatorContextType = {
  inputs,
  setInputs,
  updateIncome,
  updateMoneyExpenses,
  updateTimeExpenses,
  results,
  scenarios,
  saveCurrentAsScenario,
  deleteScenario,
  loadScenario,
  subscriptions,
  subscriptionSummary,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  toggleSubscription,
  mealCostData,
  updateMealCostData,
  updateEatingOut,
  updateHomeCooking,
  mealCostSummary,
  commuteScenarios,
  addCommuteScenario,
  updateCommuteScenario,
  deleteCommuteScenario,
  duplicateCommuteScenario,
  convenienceExpenses,
  expenseSummary,
  convenienceGoal,
  addConvenienceExpense,
  updateConvenienceExpense,
  deleteConvenienceExpense,
  setConvenienceGoal: setConvenienceGoalHandler,
  deleteConvenienceGoal,
  // ADD THESE LINES:
  childcareItems,
  childcareSummary,
  addChildcareItem,
  updateChildcareItem,
  deleteChildcareItem,
  saveToStorage,
  loadFromStorage,
  exportData: exportDataHandler,
  importData: importDataHandler,
  resetAll,
  applyPreset,
  isHydrated,
};
```

## Step 3: Update `src/lib/calculations/index.ts`

Add export for childcare calculations:

```typescript
export * from './childcare';
```

## Verification

After making these changes:

1. Run `npm run build` to check for TypeScript errors
2. Check that types are properly imported
3. Verify localStorage persistence works
4. Test CRUD operations via console:
   ```javascript
   const { addChildcareItem } = useCalculator();
   addChildcareItem({
     category: 'daycare',
     name: 'Test Leikskóli',
     monthlyCost: 30000,
     monthsPerYear: 12,
     numberOfChildren: 1,
   });
   ```

## Next Steps

After completing Context updates:
1. Create UI components in `src/components/childcare/`
2. Create barrel export `src/components/childcare/index.ts`
3. Add page/route for the calculator
4. Write tests

## Common Issues

### File Watcher Conflicts
If Edit tool fails due to file watchers:
- Stop any running `npm run dev` processes
- Make changes
- Restart dev server

### Import Errors
If you get import errors for childcare types:
- Verify `/src/types/childcare.ts` exists
- Check that exports are correct
- Rebuild TypeScript: `npm run build`

### TypeScript Errors
If you get type mismatch errors:
- Ensure ChildcareItem import is from `@/types/childcare`
- Verify all optional fields in StoredState use `?`
- Check that all functions match the interface signatures
