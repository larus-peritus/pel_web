# ScenarioComparisonChart Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/ScenarioComparisonChart.tsx`

## Purpose
Visual horizontal bar chart comparing FI numbers across all three expense tiers, providing an intuitive graphical representation of how different lifestyle choices impact FI targets.

## Component Type
Presentational component (chart visualization)

## Exports
- `ScenarioComparisonChart` - Main chart component
- `ScenarioComparisonChartProps` - Component props interface

## Key Functionality
- **Horizontal bar chart**: Three bars representing three expense tiers
- **Color-coded bars**: Uses expense baseline colors (amber/green/purple)
- **Interactive tooltips**: Hover to see detailed breakdown
- **Selected tier highlighting**: Border stroke on selected tier's bar
- **Responsive sizing**: Adapts to container width
- **Value labels**: FI numbers displayed on or near bars
- **Legend**: Color-coded legend with tier names

## Props Interface
```typescript
interface ScenarioComparisonChartProps {
  scenarios: ScenarioComparisonResult;  // FI numbers for all three tiers
  selectedTier: ExpenseTier;             // Currently selected tier
  multiplier: number;                    // Multiplier used in title/tooltip
}
```

## Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ Myndræn samanburður                                 │
│ FI-tölur á milli útgjaldaþrepa                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Lágmarks   ████████████ 90.000.000 kr              │
│                                                     │
│ Þægilegt   ████████████████████████ 187.200.000 kr │
│            (selected - thicker border)              │
│                                                     │
│ Lúxus      ████████████████████████████████████... │
│            ...████ 360.000.000 kr                   │
│                                                     │
│  Legend: ■ Lágmarks  ■ Þægilegt (valið)  ■ Lúxus   │
└─────────────────────────────────────────────────────┘
```

## Dependencies
- **Charting**: recharts (BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer)
- **UI Components**: Card, CardHeader, CardContent from `@/components/ui/Card`
- **Utilities**: formatCurrency, formatNumber from `@/lib/utils/formatters`
- **Constants**: TIER_LABELS, TIER_COLORS from `@/lib/constants/expenseBaseline`
- **Types**: ScenarioComparisonResult from `@/types/fiNumber`

## Chart Configuration

### Bar Chart Properties
- **Layout**: Vertical (horizontal bars)
- **Orientation**: Left-to-right bars
- **Bar radius**: Rounded right edge [0, 8, 8, 0]
- **Animation**: 500ms duration
- **Margin**: { top: 10, right: 150, bottom: 10, left: 10 }

### Axis Configuration
- **X-Axis**: FI numbers formatted in millions (e.g., "90M kr")
- **Y-Axis**: Tier labels (Lágmarks, Þægilegt, Lúxus)
- **Width**: Y-axis 100px for tier labels

### Color Mapping
```typescript
const colorMap = {
  'bg-amber-500': '#f59e0b',   // Barebones
  'bg-green-500': '#10b981',    // Comfortable
  'bg-purple-500': '#8b5cf6',   // Deluxe
};
```

### Selected Tier Styling
- **Stroke**: Same color as bar
- **Stroke width**: 3px
- **Opacity**: 1.0 (vs 0.85 for unselected)

## Tooltip Content
```
┌────────────────────────────┐
│ ● Þægilegt  [Valið]        │
│                            │
│ Árleg útgjöld: 6.240.000 kr│
│ Margfaldari:   30x         │
│ ──────────────────────────│
│ FI-tala:      187.200.000 kr│
└────────────────────────────┘
```

## Features

### 1. Responsive Container
- Uses recharts ResponsiveContainer
- Width: 100% of parent
- Fixed height: 300px
- Adapts to mobile/tablet/desktop

### 2. Value Formatting
- **Large numbers**: 187M kr
- **Medium numbers**: 15.2M kr
- **Small numbers**: 1.53M kr
- Icelandic "M kr" suffix

### 3. Bar Labels
- **Wide bars (>150px)**: Label inside bar (white text, right-aligned)
- **Narrow bars (<150px)**: Label outside bar (dark text, left-aligned)
- Dynamic positioning for readability

### 4. Legend
- Horizontal flex layout
- Color square + tier name
- "(valið)" indicator for selected tier
- Centered below chart

## Usage Example
```typescript
import { ScenarioComparisonChart } from '@/components/fiNumber';

<ScenarioComparisonChart
  scenarios={scenarios}
  selectedTier="comfortable"
  multiplier={30}
/>
```

## Integration
- **Used by**: FINumberBuilderCalculator (displayed alongside ScenarioComparison table)
- **Complements**: ScenarioComparison component (table version)
- **Data source**: calculateScenarioComparison() from fiNumber calculations

## Chart Data Transformation
```typescript
// Input: ScenarioComparisonResult
// Output: ChartDataPoint[]
interface ChartDataPoint {
  tier: ExpenseTier;
  tierLabel: string;
  fiNumber: number;
  annualExpenses: number;
  color: string;
  isSelected: boolean;
}
```

## Tests
- **Location**: `tests/components/fiNumber/ScenarioComparisonChart.test.tsx`
- **Coverage**: 16 tests covering rendering, data prep, visual states, accessibility
- **Key test areas**:
  - Chart component rendering
  - Legend rendering
  - Selected tier highlighting
  - Data preparation/transformation
  - Different multipliers
  - Edge cases (same FI numbers, very large numbers)
  - Responsive container
- **Mocking**: recharts components mocked for test environment

## Implementation Notes
- useMemo for chart data preparation (performance optimization)
- Custom tooltip component for rich hover experience
- Custom bar label renderer for conditional positioning
- X-axis formatter converts to millions for readability
- Y-axis shows full tier labels
- Cell component for per-bar styling

## Accessibility
- Semantic Card structure
- Descriptive title and subtitle
- Info text explaining chart purpose
- Color not sole indicator (labels + tooltips)
- Tooltip provides same info as visual

## Icelandic Text
All text is in Icelandic:
- "Myndræn samanburður" (Visual comparison)
- "FI-tölur á milli útgjaldaþrepa" (FI numbers between expense tiers)
- "Árleg útgjöld" (Annual expenses)
- "Margfaldari" (Multiplier)
- "FI-tala" (FI number)
- "Grafið sýnir..." (The chart shows...)

## Related Modules
- **ScenarioComparison**: Table version of same data
- **CategoryBreakdownChart**: Similar recharts pattern for expense categories
- **FINumberCalculations**: Calculates scenario comparison data
- **TIER_COLORS**: Color scheme from expense baseline

## Performance Considerations
- useMemo prevents unnecessary recalculation
- ResponsiveContainer handles resize efficiently
- Animation limited to 500ms
- Minimal re-renders with proper dependencies

## Future Enhancements
- Add click interaction to select tier from chart
- Animate bar transitions when multiplier changes
- Add horizontal line showing user's current savings
- Vertical orientation option for narrow screens
- Export chart as PNG/SVG
