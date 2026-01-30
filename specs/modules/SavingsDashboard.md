# Module: SavingsDashboard

## Location
`/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/src/components/savingsReport/`

## Purpose
Complete dashboard UI for the Savings Report feature, providing visual summary and insights of user's savings across categories.

## Exports

### Main Component
- `SavingsDashboard` - Main container for dashboard view with edit functionality

### Sub-Components
- `QuickStats` - Summary stat cards showing totals and rates
- `CategoryBreakdownChart` - Pie/donut chart showing balance distribution
- `SavingsProgressList` - Progress bars for categories with targets
- `SavingsRateInsights` - Contextual savings rate information and FI estimates

## Key Functionality

### SavingsDashboard
- Header with "Yfirlit" title and edit button (triggers onEditClick prop)
- Empty state when no savings data exists
- Orchestrates all sub-components in responsive layout
- Two-column grid for charts on large screens

### QuickStats
- Four stat cards in responsive grid (4→2→1 columns)
- Card 1: "Heildarsparnaður" (Total Savings) with primary gradient
- Card 2: "Mánaðarleg framlög" (Monthly Contribution) with success gradient
- Card 3: "Sparnaðarhlutfall" (Savings Rate %) - only if income available, amber gradient
- Card 4: "Lífsorka" (Life Energy in hours) - only if AWH available, purple gradient
- All amounts formatted in ISK with Icelandic separators

### CategoryBreakdownChart
- Donut chart using recharts library
- Shows balance distribution by category
- Uses SAVINGS_CHART_COLORS from constants (7 colors)
- Interactive tooltip with category name, balance, and percentage
- Custom legend with category icons and percentages
- Filters out categories with zero balance
- Empty state: "Enginn sparnaður skráður"

### SavingsProgressList
- Only displays categories that have targetAmount set
- Progress bar for each category (0-100%, capped at 100)
- Display includes: icon, name, current/target amounts, percentage
- Shows remaining amount with life energy hours (if AWH available)
- Completion message "✓ Náð markmiði!" when target reached
- Empty state: "Engin markmið sett" if no targets
- Categories sorted by order property

### SavingsRateInsights
- Large savings rate display with colored background based on level:
  - critical (< 10%): red (danger)
  - low (10-20%): orange (warning)
  - moderate (20-30%): yellow (amber)
  - good (30-50%): green (success)
  - excellent (50-70%): blue
  - exceptional (70%+): purple
- Context message from savingsRateContext.messageIs (in Icelandic)
- FI timeline estimate when available ("Áætluð leið til fjárhagsfrelsis")
- Missing income state: info alert with link to calculator

## Dependencies

### Internal
- `@/context/CalculatorContext` - useCalculator hook for savings data and AWH
- `@/components/ui` - Card, Button, Alert components
- `@/lib/utils/formatters` - formatCurrency, formatNumber, formatHours
- `@/lib/constants/savingsReport` - SAVINGS_CHART_COLORS
- `@/types/savingsReport` - All type definitions

### External
- `recharts` - PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
- `react` - Core React functionality

## Tests

### Location
`/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/tests/components/savingsReport/`

### Test Files (76 tests total, all passing)
- `QuickStats.test.tsx` (16 tests)
  - Basic rendering of all cards
  - Conditional rendering (rate and life energy)
  - Responsive layout
  - ISK and percentage formatting
  - Color themes for each card

- `CategoryBreakdownChart.test.tsx` (10 tests)
  - Empty state handling
  - Chart rendering with data
  - Zero balance filtering
  - Legend display with percentages
  - Color indicators and scrollable legend

- `SavingsProgressList.test.tsx` (15 tests)
  - Empty state when no targets
  - Categories with targets display
  - Progress bar rendering and width calculation
  - Remaining amount with life energy
  - Target completion state
  - Hidden category filtering

- `SavingsRateInsights.test.tsx` (19 tests)
  - Missing income state with alert
  - Savings rate display with formatting
  - Context messages for all levels
  - FI estimate display
  - Color coding by level

- `SavingsDashboard.test.tsx` (16 tests)
  - Empty state with call-to-action
  - Dashboard with data rendering
  - Edit button functionality
  - All sub-component integration
  - Responsive layout

## Integration

### Used By
- SavingsReportCalculator (Epic 5) - Main page component that toggles between dashboard and editor modes

### Uses
- CalculatorContext - Accesses savingsReport, savingsReportResults, and results (for AWH)
- All chart colors from constants
- Calculation results from Epic 1 (Foundation)

## Related
- Implements: Epic 4 (Tasks 4.1-4.5) from specs/savings-report/tasks-savings-report.md
- Requirements: FR-4.1-4.5 from specs/savings-report/requirements-savings-report.md
- Design: Dashboard View section from specs/savings-report/design-savings-report.md

## Implementation Notes

### Date: 2026-01-26
Completed Epic 4 (Dashboard UI) with all 5 components:
1. All components use Icelandic text throughout
2. Responsive design: mobile-first with breakpoints at md and lg
3. Conditional rendering for optional features (savings rate, life energy)
4. Proper empty states for all components
5. Color-coded visual feedback based on savings rate levels
6. Integration with recharts for chart visualization
7. Comprehensive test coverage (76 tests, 100% passing)
8. TypeScript compilation successful with no errors
9. Follows existing patterns from CurrentExpenses components

### Key Design Decisions
1. **Conditional Cards**: QuickStats only shows rate/life energy cards when data available
2. **Progress Filtering**: SavingsProgressList only shows categories with targets > 0
3. **Chart Filtering**: CategoryBreakdownChart filters out zero-balance categories
4. **Color System**: Six-level color coding for savings rate (critical to exceptional)
5. **Empty States**: All components have meaningful empty states with user guidance
6. **Life Energy**: All monetary displays show work hours when AWH is available
7. **Responsive Grid**: Adapts from 1→2→4 columns based on screen size
