# Snowball Visualization Components

## Location
- `apps/peninganaedalifid/src/components/snowball/SnowballChart.tsx`
- `apps/peninganaedalifid/src/components/snowball/MonthlyBreakdown.tsx`
- `apps/peninganaedalifid/src/components/snowball/index.ts` (updated)

## Purpose
Provides visualization components for the Interest Savings Snowball Calculator, including debt comparison charts and detailed monthly breakdowns.

## Exports

### SnowballChart Component
- **Purpose**: Visualizes debt balance comparison and cumulative interest savings across all three scenarios
- **Props**: `{ results: SnowballResults }`
- **Features**:
  - Debt balance comparison chart (4 lines: base, snowball to loan, snowball to invest debt, investment balance)
  - Cumulative interest savings chart
  - Color-coded scenarios (gray, blue, red, green)
  - Custom tooltips with formatted ISK values
  - Responsive containers
  - Axis labels in Icelandic

### MonthlyBreakdown Component
- **Purpose**: Displays detailed month-by-month table for selected scenario
- **Props**: `{ results: SnowballResults, actualHourlyWage?: number }`
- **Features**:
  - Scenario selector dropdown (Base / Snowball to Loan / Snowball to Investment)
  - Collapsible/expandable card
  - Summary totals (payments, interest, principal, savings)
  - Life energy totals when wage provided
  - Default shows first 12 months, "Show All" button to expand
  - Conditional columns based on scenario (investment balance, interest savings, extra from savings)
  - Color-coded legend
  - Icelandic number formatting
  - Horizontal scroll on mobile

## Key Functionality

### SnowballChart
1. **Data Transformation**: Transforms `MonthlyRow[]` into chart-friendly format
2. **Dual Charts**: Renders two separate charts (debt balance, cumulative savings)
3. **Recharts Integration**: Uses LineChart, Line, XAxis, YAxis, Tooltip, Legend components
4. **Formatting**: Y-axis shows millions (M), tooltips show full ISK amounts

### MonthlyBreakdown
1. **Scenario Selection**: Switches between base, snowball-to-loan, snowball-to-invest views
2. **Dynamic Columns**: Shows/hides columns based on selected scenario
3. **Pagination**: Defaults to 12 months, expands to show all
4. **Totals Calculation**: Aggregates payments, interest, principal, savings
5. **Life Energy Display**: Converts totals to life energy hours when wage available

## Dependencies
- `recharts` - Chart library (LineChart, XAxis, YAxis, etc.)
- `@/types/snowball` - SnowballResults, MonthlyRow types
- `@/lib/utils/formatters` - formatCurrency, formatNumber
- `@/components/ui/Card` - Card, CardHeader, CardContent
- `@/components/ui/Button` - Button
- `@/components/ui/Select` - Select dropdown

## Tests
- Location:
  - `apps/peninganaedalifid/src/components/snowball/__tests__/SnowballChart.test.tsx` (7 tests)
  - `apps/peninganaedalifid/src/components/snowball/__tests__/MonthlyBreakdown.test.tsx` (14 tests)
- Coverage:
  - SnowballChart: Rendering both charts, tooltips, data transformation, empty state
  - MonthlyBreakdown: Expand/collapse, scenario switching, pagination, column visibility, totals, life energy

## Integration
- Used by: SnowballCalculatorPage (when implemented)
- Uses: MonthlyRow data from calculateSnowball() function
- Part of: Interest Savings Snowball Calculator feature

## Related
- Implements: Tasks 5.1, 5.2, 5.3 from specs/interest-savings-snowball/tasks-interest-savings-snowball.md
- Follows patterns from: ComparisonChart.tsx, AmortizationSchedule.tsx
- Part of: specs/interest-savings-snowball/design-interest-savings-snowball.md

## Implementation Notes
- **Task 5.1**: Debt balance comparison chart shows 4 lines with color coding matching design specs
- **Task 5.2**: Cumulative interest savings chart uses purple/indigo (#8b5cf6) for consistency
- **Task 5.3**: Monthly breakdown table uses Select component pattern, supports all 3 scenarios
- All text in Icelandic
- Responsive design with horizontal scroll for tables on mobile
- Recharts mocked in tests to avoid DOM measurement issues
- Uses existing UI component patterns (Card, Button, Select)
