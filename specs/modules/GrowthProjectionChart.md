# GrowthProjectionChart Module

## Location
`src/components/coastFire/GrowthProjectionChart.tsx`

## Purpose
Visualizes Coast FIRE investment growth trajectory from current age to retirement age. Shows compound growth projection, FI number target, Coast FIRE milestone markers, and the coasting period where no additional contributions are needed.

## Component Type
React Client Component (Recharts visualization)

## Props Interface
```typescript
interface GrowthProjectionChartProps {
  result: CoastFIREResult;           // Complete calculation results
  currentAge: number;                 // User's current age
  targetRetirementAge: number;        // Target retirement age
  currentInvestments: number;         // Current investment balance (ISK)
  fiNumber: number;                   // FI number target (ISK)
  expectedReturn: number;             // Expected annual return rate (%)
}
```

## Key Features

### Chart Elements
1. **Growth Projection Line** (green, solid)
   - Shows investment balance growth from current age to retirement
   - Calculated using compound interest formula
   - Smooth monotone curve
   - Active dot on hover

2. **FI Number Target Line** (blue, dashed)
   - Horizontal reference line at FI number value
   - Shows the financial independence target
   - Labeled "FI-markmið"

3. **Milestone Markers**
   - **Current Age** (green dot): Starting point labeled "Nú"
   - **Coast FIRE Age** (amber vertical line): When Coast FIRE is achieved
   - **Retirement Age** (purple dot): End point labeled "Starfslok"

4. **Coasting Period Shading** (amber area)
   - Shaded area between Coast age and retirement age
   - Labeled "Ró tímabil"
   - Only shown when status is 'coasting' or 'future'

### Interactive Features
- **Custom Tooltip**: Shows age and balance on hover with Icelandic formatting
- **Responsive Design**: Adapts to container size with min dimensions (300x320)
- **Smooth Animations**: 1000ms animation duration for line rendering
- **Touch Support**: Works on mobile devices

### Accessibility
- ARIA label describing the chart purpose and data range
- Keyboard navigable through Recharts built-in support
- High contrast colors for visibility

## Data Generation
Uses `calculateFutureValue()` from `@/lib/calculations/coastFire` to generate year-by-year projections:

```typescript
for (let yearOffset = 0; yearOffset <= totalYears; yearOffset++) {
  const age = currentAge + yearOffset;
  const balance = calculateFutureValue(currentInvestments, expectedReturn, yearOffset);
  data.push({ age, balance, fiNumber });
}
```

## Icelandic Text
All labels and messages in Icelandic:
- "Vöxtur fjárfestinga yfir tíma" - Investment growth over time
- "Aldur (ár)" - Age (years)
- "Fjárfestingar (ISK)" - Investments (ISK)
- "Áætluð fjárfesting" - Projected investment
- "Ró tímabil" - Coasting period
- "Ró aldur" - Coast age

## Status-Based Insights
Displays contextual message based on Coast FIRE status:
- **Coasting**: Green success message with celebration emoji
- **Future**: Blue info message with timeline to Coast FIRE
- **Impossible**: Amber warning with suggestions

## Chart Legend
Below chart, displays explanations for:
- Green line: Growth projection with expected return rate
- Blue dashed line: FI target number
- Amber shading: Coasting period (if applicable)
- Amber vertical line: Coast FIRE age milestone

## Y-Axis Formatting
Automatically formats ISK values:
- `>= 1,000,000`: Shows as "X.XM" (millions)
- `>= 1,000`: Shows as "Xþ" (thousands)
- `< 1,000`: Shows as whole number

Y-axis domain automatically calculated with 10% padding above/below data range.

## Exports
```typescript
export function GrowthProjectionChart(props: GrowthProjectionChartProps): JSX.Element
export type GrowthProjectionChartProps
```

## Dependencies
- `recharts`: Chart library (LineChart, XAxis, YAxis, etc.)
- `@/types/coastFire`: TypeScript types
- `@/lib/utils/formatters`: Currency formatting
- `@/lib/calculations/coastFire`: Compound interest calculations

## Integration
Used by `CoastFIREResults` component to visualize calculation results:

```typescript
<GrowthProjectionChart
  result={result}
  currentAge={coastFireState.currentAge}
  targetRetirementAge={coastFireState.targetRetirementAge}
  currentInvestments={coastFireState.currentInvestments}
  fiNumber={coastFireState.fiNumber}
  expectedReturn={coastFireState.expectedReturn}
/>
```

## Performance
- Chart data memoized with `useMemo` to prevent unnecessary recalculations
- Y-axis domain pre-calculated and memoized
- Efficient data point generation (one point per year)

## Testing
Visual testing recommended:
- Test with different age ranges (short/long timelines)
- Test with various FI numbers (above/below current balance)
- Test all three statuses (coasting, future, impossible)
- Test responsive behavior on mobile/tablet/desktop
- Test tooltip formatting and hover behavior

## Visual Design
- Colors follow Coast FIRE theme:
  - Green (#22c55e): Growth line, current age marker
  - Blue (#3b82f6): FI target line
  - Amber (#f59e0b): Coast FIRE milestone, coasting period
  - Purple (#8b5cf6): Retirement age marker
- Consistent with other chart components (SnowballChart, ComparisonChart)

## Related
- Implements: Requirements FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-4.5 from specs/coast-fire/requirements-coast-fire.md
- Part of: specs/coast-fire/design-coast-fire.md (Visualization section)
- Epic 4: Visualization - Growth Projection Chart
- Tasks: 4.1 (Setup), 4.2 (Data & Lines), 4.3 (Milestones), 4.4 (Interactivity)
