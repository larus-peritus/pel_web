# FINumberBuilderCalculator Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/FINumberBuilderCalculator.tsx`

## Purpose
Main page-level container component for the FI Number Builder calculator. Orchestrates the calculation of a user's Financial Independence (FI) target nest egg by coordinating child components and integrating with the Expense Baseline Tool and Actual Hourly Wage Calculator.

## Component Type
Client-side React component ('use client')

## Key Features

### Core Functionality
- **FI Number Calculation**: Calculates target nest egg using annual expenses × multiplier
- **Expense Source Integration**: Supports both expense baseline (barebones/comfortable/deluxe) and custom input
- **Standard Multipliers**: Offers 25x, 30x, 33x multipliers plus custom range (20-50)
- **Icelandic Context**: Conservative 30x-33x multipliers recommended (vs US standard 25x)
- **Responsive Layout**: Two-column desktop, stacked mobile layout

### Icelandic Adaptation
- Default multiplier: 30x (3.33% withdrawal rate) vs US standard 25x (4% rule)
- Warning alert when multiplier < 28x (too aggressive for Iceland's inflation)
- Educational content about Iceland's higher historical inflation (3-4% vs US 2-3%)
- Pension integration considerations (lífeyrissjóður)

### Layout Structure
1. **Hero Section**: Title, subtitle with gradient background
2. **Main Calculator Section**: Two-column grid (inputs left, results right)
   - Input column: Expense source, multiplier selector, pension section (placeholders for Epic 3-5)
   - Results column: FI number display, life energy metrics, AWH prompt
3. **Scenario Comparison Section**: Three-tier comparison (conditional, Epic 4)
4. **Educational Content Section**: FI concepts, Icelandic context, examples
5. **Warning Alert Section**: Conditional alert for aggressive multipliers (<28x)

## Props
None - Gets data from CalculatorContext via `useCalculator()` hook

## Dependencies

### Context Data
- `fiNumberBuilder`: FINumberBuilderState | null - User configuration
- `fiNumberResults`: FINumberResults | null - Calculated results
- `expenseBaseline`: ExpenseBaseline | null - Expense baseline data
- `actualHourlyWage`: number | null - For life energy calculations

### Components Used
- `Container` from `@/components/layout/Container`
- `Section` from `@/components/layout/Section`
- `Card` from `@/components/ui/Card`
- `Alert` from `@/components/ui/Alert`

### Future Child Components (to be added)
- `ExpenseSourceSelector` (Task 3.2) - Toggle baseline/custom, tier selector
- `MultiplierSelector` (Task 3.3) - Standard buttons and custom slider
- `ResultsDisplay` (Task 3.4) - FI number display with breakdown
- `PensionIncomeSection` (Epic 5) - Optional pension integration
- `ScenarioComparison` (Epic 4) - Three-tier comparison table/chart
- `LifeEnergyDisplay` (Epic 6) - Years of work display
- `AWHPrompt` (Epic 6) - Link to AWH calculator

## State Management
All state managed via `CalculatorContext`:
- No local component state
- Reads from context: `fiNumberBuilder`, `fiNumberResults`, `expenseBaseline`, `actualHourlyWage`
- Updates via context actions (to be consumed by child components in future tasks)

## Conditional Rendering Logic

### Missing Dependencies
```typescript
const hasBaseline = expenseBaseline !== null;
const hasAWH = actualHourlyWage !== null && actualHourlyWage > 0;
```

- **No baseline**: Shows info alert explaining baseline benefits, allows custom input fallback
- **No AWH**: Shows info alert prompting user to calculate AWH for life energy display
- **No results**: Shows placeholder card with instructions to get started

### Results Display
- Only shows results section when `fiNumberBuilder && fiNumberResults` exist
- Scenario comparison section only shows when `fiNumberResults?.scenarios` exists
- Warning alert only shows when `multiplier < 28`

## Responsive Design

### Desktop (>= 1024px)
- Two-column grid: inputs left (40%), results right (60%)
- Full-width sections for comparison and education
- Side-by-side input cards

### Mobile (< 1024px)
- Single column stacked layout
- Input section first, results second
- Full-width cards

## Educational Content

### Topics Covered
1. **What is FI Number**: Definition and FIRE movement context
2. **How It's Calculated**: Formula explanation with multiplier details
3. **Icelandic Context**: Why Iceland needs different assumptions
   - Higher inflation (3-4% vs 2-3% in US)
   - Lífeyrissjóður system (16% contributions)
   - Smaller, more volatile market
4. **Example Calculation**: Practical example with 500k ISK/month expenses

### Multiplier Explanations
- **25x (4% rule)**: US standard, potentially too aggressive for Iceland
- **30x (3.33% rule)**: Recommended for Iceland (higher safety margin)
- **33x (3% rule)**: Conservative approach for extra security

## Icelandic Context Warning

### Trigger Condition
`fiNumberBuilder?.multiplier < 28`

### Warning Content
- Alert variant: warning (amber styling)
- Shows current multiplier and withdrawal rate
- Explains Iceland's higher inflation vs US
- Recommends 30x or 33x multipliers
- Lists historical inflation comparisons

## Integration Points

### From Expense Baseline Tool
- `expenseBaseline` data for tier selection
- Used by ExpenseSourceSelector (future Task 3.2)
- Powers scenario comparison (future Epic 4)

### From Actual Hourly Wage Calculator
- `actualHourlyWage` for life energy calculations
- Used by LifeEnergyDisplay (future Epic 6)
- Optional - graceful degradation if unavailable

### For Future Calculators
- FI number output consumed by:
  - Coast FIRE Calculator
  - Barista FIRE Calculator
  - Savings Rate Calculator
  - Retirement Date Simulator

## Accessibility Features
- Semantic HTML structure with proper headings
- Alert components with appropriate ARIA roles
- Clear visual hierarchy with sections
- Responsive spacing and contrast

## Performance Considerations
- No local state or complex calculations in this component
- All calculations performed in CalculatorContext (memoized)
- Lazy rendering of conditional sections
- Minimal re-renders (only on context data changes)

## Future Enhancements

### Epic 3 (Core UI)
- Task 3.2: Add ExpenseSourceSelector component
- Task 3.3: Add MultiplierSelector component
- Task 3.4: Add ResultsDisplay component

### Epic 4 (Scenario Comparison)
- Add ScenarioComparison component with table/chart

### Epic 5 (Pension Integration)
- Add PensionIncomeSection component
- Add PensionAdjustedResults display

### Epic 6 (Life Energy)
- Add LifeEnergyDisplay component
- Add AWHPrompt component

### Epic 7 (Polish)
- Add EducationalPanel with collapsible sections
- Add IcelandicContextAlert component (replace inline alert)
- Add input validation UI

## Testing Strategy

### Unit Tests (Future)
- Conditional rendering based on data availability
- Warning alert trigger conditions
- Responsive layout breakpoints

### Integration Tests (Future)
- Context data consumption
- Missing dependency handling
- Educational content display

### Accessibility Tests (Future)
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance

## Related Files
- Types: `src/types/fiNumber.ts`
- Calculations: `src/lib/calculations/fiNumber.ts`
- Constants: `src/lib/constants/fiNumber.ts`
- Context: `src/context/CalculatorContext.tsx`

## Requirements Fulfilled
- **US-1**: Calculate from Baseline - Structure ready for integration
- **US-6**: Custom Expense Input - Fallback path for no baseline
- **FR-1**: FI Calculation - Orchestration layer ready
- **FR-4**: Icelandic Context - Warning alerts and educational content
- **FR-7**: Educational Content - Comprehensive explanation section
- **NFR-2**: Usability - Clear visual hierarchy and responsive design
- **NFR-5**: Icelandic Context - All text in Icelandic, Iceland-specific recommendations

## Implementation Status
- ✅ Task 3.1: Create FINumberBuilderCalculator Main Component - COMPLETE
- 🔄 Task 3.2-3.4: Child components - TO DO (placeholders in place)
- 🔄 Epic 4-7: Enhancements - TO DO (structure ready)

## Notes
- Component follows existing patterns from EmergencyFundCalculator and DebtPayoffPage
- Uses placeholder cards for child components (to be added in subsequent tasks)
- All text in Icelandic per NFR-5
- Conservative Iceland-first approach (30x default vs US 25x)
- Graceful degradation when dependencies (baseline, AWH) unavailable
