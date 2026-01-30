# Work Convenience Tracker (Vinnuþreytukostnaður)

## Overview
The Work Convenience Tracker helps users track and analyze "exhaustion tax" - expenses incurred due to work exhaustion that wouldn't exist otherwise (food delivery, taxis, impulse purchases, etc.).

## Implementation Status
**Status**: Core functionality complete (Epic 1-5 complete)
**Date**: 2026-01-20

### Completed Components
- Epic 1: TypeScript types, date utilities, calculation functions
- Epic 2: CalculatorContext integration with CRUD functions
- Epic 3: UI components (QuickAddExpense, ExpenseList, ExpenseItem)
- Epic 4: Analytics components (WorkdayComparison, CategoryBreakdown, GoalProgress)
- Epic 5: Main tracker and app integration

### Remaining Work
- Epic 6: Testing (unit tests, integration tests, E2E tests)
- Epic 7: Accessibility audit and polish

## Location

### Core Logic
- **Types**: `apps/peninganaedalifid/src/types/calculator.ts`
- **Calculations**: `apps/peninganaedalifid/src/lib/calculations/convenienceExpenses.ts`
- **Date Utils**: `apps/peninganaedalifid/src/lib/utils/dateUtils.ts`

### UI Components
- **Main Component**: `apps/peninganaedalifid/src/components/convenience/ConvenienceExpenseTracker.tsx`
- **Quick Add**: `apps/peninganaedalifid/src/components/convenience/QuickAddExpense.tsx`
- **Expense List**: `apps/peninganaedalifid/src/components/convenience/ExpenseList.tsx`
- **Expense Item**: `apps/peninganaedalifid/src/components/convenience/ExpenseItem.tsx`
- **Workday Comparison**: `apps/peninganaedalifid/src/components/convenience/WorkdayComparison.tsx`
- **Category Breakdown**: `apps/peninganaedalifid/src/components/convenience/CategoryBreakdown.tsx`
- **Goal Progress**: `apps/peninganaedalifid/src/components/convenience/GoalProgress.tsx`
- **Barrel Export**: `apps/peninganaedalifid/src/components/convenience/index.ts`

### Integration
- **Context**: `apps/peninganaedalifid/src/context/CalculatorContext.tsx` (CRUD functions added)
- **App Page**: `apps/peninganaedalifid/src/components/calculator/CalculatorPageContent.tsx` (expense calculator added)

## Key Features

### Data Model

#### ConvenienceExpense
```typescript
interface ConvenienceExpense {
  id: string;
  amount: number;
  category: ConvenienceCategory;
  date: string; // ISO date
  isWorkday: boolean;
  note?: string;
}
```

#### Categories
- `delivery` - Heimsending (Wolt, AHA, etc.)
- `taxi` - Leigubíll (Hreyfill, Bolt, etc.)
- `prepared` - Tilbúinn matur (10-11, Bónus, etc.)
- `restaurant` - Mathús
- `impulse` - Kaup í vinnu (impulse purchases)
- `other` - Annað

#### ConvenienceGoal
```typescript
interface ConvenienceGoal {
  monthlyTarget: number; // ISK/month
  startDate: string; // ISO date
}
```

### Calculation Functions

#### `calculateExpenseSummary(expenses, actualHourlyWage)`
Returns comprehensive summary:
- Weekly, monthly, annualized totals (ISK)
- Life energy costs (hours/days)
- Workday vs weekend averages
- Category breakdown with percentages

#### `calculateWorkdayComparison(expenses)`
Analyzes spending patterns:
- Average per workday vs weekend day
- Difference and percentage
- Annual impact (260 workdays)

#### `calculateGoalProgress(goal, currentMonthly, actualHourlyWage)`
Tracks goal achievement:
- Progress percentage
- Savings (if on track)
- Annual savings projection

### UI Components

#### QuickAddExpense
- Preset selector with 13 common Icelandic services
- Custom amount input with ISK formatting
- Auto-detected workday (Mon-Fri) with manual override
- Date picker (default: today, max: today)
- Optional note field (max 200 chars)
- Form reset after submission

#### ExpenseList
- Grouped by date (newest first)
- Filterable: all, workdays only, weekends only
- Show 7 by default with "Show more" button
- Empty state message
- Responsive mobile layout

#### ExpenseItem
- Displays amount, category badge, workday badge
- Relative date formatting ("Í dag", "Í gær", etc.)
- Edit and delete buttons
- Delete confirmation (2-tap pattern)
- Category color coding

#### WorkdayComparison
- Horizontal bar chart comparing workday vs weekend spending
- Average per day for each type
- Difference highlighted
- Annual impact calculation
- Warning alert if difference > 1000 ISK/day

#### CategoryBreakdown
- Progress bars for each category
- Sorted by total (highest first)
- Shows count, total, percentage
- Average per occurrence
- Category color coding

#### GoalProgress
- Set/edit/delete monthly spending goal
- Progress bar with percentage
- Success message when on track (shows savings)
- Warning when over goal
- Annual savings projection

#### ConvenienceExpenseTracker (Main)
- Hero section with explanation
- Warning if actualHourlyWage not set
- 2-column layout (desktop), stacked (mobile)
- Left: QuickAdd + ExpenseList
- Right: Summary cards + Goal + Analytics
- Summary cards: Week, Month, Year (annualized)

### Context Integration

Added to CalculatorContext:
```typescript
// State
convenienceExpenses: ConvenienceExpense[];
expenseSummary: ConvenienceExpenseSummary | null;
convenienceGoal: ConvenienceGoal | undefined;

// CRUD Functions
addConvenienceExpense(expense: Omit<ConvenienceExpense, 'id'>): void;
updateConvenienceExpense(id: string, updates: Partial<ConvenienceExpense>): void;
deleteConvenienceExpense(id: string): void;

// Goal Management
setConvenienceGoal(goal: ConvenienceGoal): void;
deleteConvenienceGoal(): void;
```

### Storage
- Persisted in localStorage via CalculatorContext
- Included in export/import functionality
- Debounced writes (500ms)

## Icelandic Presets

13 common convenience expenses with realistic ISK amounts:
- Wolt heimsending (4,500 kr)
- AHA heimsending (3,800 kr)
- Dominos pizza (3,200 kr)
- Hreyfill heim frá vinnu (3,500 kr)
- Hreyfill stuttt (2,000 kr)
- Hreyfill langt (5,000 kr)
- Bolt (2,500 kr)
- 10-11 tilbúinn matur (1,500 kr)
- Bónus tilbúinn matur (1,800 kr)
- Nettó tilbúinn matur (2,200 kr)
- Skyndibitastaður (2,500 kr)
- Mathús hádegi (4,000 kr)
- Netkaup (3,000 kr)
- Verslunarkaup (2,000 kr)

## Key Insights

### Workday Tax Analysis
The tracker's key insight is comparing workday vs weekend spending to reveal the "exhaustion tax":
- If workday average is 3,200 kr and weekend is 800 kr
- Difference: 2,400 kr/workday
- Annual impact: 2,400 × 260 = 624,000 kr/year

### Life Energy Conversion
All amounts are converted to life energy using actualHourlyWage:
- 4,500 kr delivery at 2,000 kr/hour = 2.25 hours of life
- Makes financial decisions more tangible

### Goal Tracking
Users can set monthly spending limits and track progress:
- Visual progress bar
- Celebration when on track
- Projected annual savings

## Technical Details

### Dependencies
- React hooks: useState, useMemo, useCallback
- Context: useCalculator() hook
- UI components: Card, Button, Select, CurrencyInput, Input, Badge, Alert, Tooltip
- Utils: formatRelativeDate, isWeekday, groupExpensesByDate
- Calculations: calculateExpenseSummary, calculateWorkdayComparison, calculateGoalProgress

### Performance
- useMemo for expensive calculations
- Debounced localStorage writes
- Efficient filtering and sorting

### Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader friendly
- Focus indicators
- Error messages

### Responsive Design
- Mobile-first approach
- 2-column grid on desktop (lg:grid-cols-3)
- Stacked layout on mobile
- Touch-friendly buttons (min 44px)

## Future Enhancements (Not Implemented)

### Epic 6: Testing
- Unit tests for calculation functions
- Unit tests for date utilities
- Component tests with React Testing Library
- Integration tests for Context
- E2E tests with Playwright

### Epic 7: Accessibility & Polish
- WCAG 2.1 AA compliance audit
- Screen reader testing
- Keyboard navigation audit
- Mobile optimization
- Animation polish

### Potential Features (Out of Scope)
- Edit expense functionality (currently only delete)
- Multiple goals per category
- Trend graphs over time
- Export to CSV
- Custom categories
- Budget alerts/notifications

## Related Specifications
- Requirements: `specs/work-convenience/requirements.md`
- Design: `specs/work-convenience/design.md`
- Tasks: `specs/work-convenience/tasks.md`

## Notes
- All UI text in Icelandic
- Currency formatted as ISK (Icelandic króna)
- Dates use Icelandic format and relative time
- Client-side only (no backend)
- Privacy-first (localStorage only)
