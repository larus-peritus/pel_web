# PlainLanguageSummary Component

## Location
`apps/peninganaedalifid/src/components/calculator/PlainLanguageSummary.tsx`

## Purpose
A results component that explains calculator results in plain, conversational language. Makes the "life energy" concept tangible by translating abstract wage calculations into concrete examples that users can relate to.

## Component Signature
```typescript
export function PlainLanguageSummary(): JSX.Element | null
```

## Key Features

### Conversational Explanations
- Explains actual vs nominal wage difference in plain English
- Avoids jargon and technical terminology
- Uses "you" and "your" for direct, personal tone
- Breaks down complex calculations into understandable statements

### Life Energy Examples
Provides three concrete purchase examples:
- $100 purchase cost in life energy hours
- $500 purchase cost in life energy hours
- $1,000 purchase cost in life energy hours

Uses `formatLifeEnergy()` to display hours in human-readable format:
- < 1 hour: "X minutes"
- 1-24 hours: "X hours" or "Xh Ym"
- > 24 hours: "X days Yh" (based on 8-hour work days)

### Severity-Based Styling
Card background color adapts based on wage reduction percentage:
- **Success** (< 15% reduction): Green border/background (`border-success-200 bg-success-50`)
- **Warning** (15-30% reduction): Yellow border/background (`border-warning-200 bg-warning-50`)
- **Error** (> 30% reduction): Red border/background (`border-error-200 bg-error-200`)

Higher reductions indicate more severe life energy costs.

### Conditional Content
- Only shows money expenses paragraph if `totalMoneyExpenses > 0`
- Only shows extra hours paragraph if `totalExtraHours > 0`
- Returns `null` if no results are available (component hidden)

## Implementation Details

### Dependencies
- `useCalculator` hook from CalculatorContext - provides results and inputs
- `Card`, `CardContent` from UI components - layout container
- `formatCurrency` from utils - formats dollar amounts
- `dollarsToLifeEnergy`, `formatLifeEnergy` from calculations - converts and formats life energy

### Data Flow
1. Retrieves `results` and `inputs` from CalculatorContext
2. Returns null if results not available
3. Extracts key metrics (actualHourlyWage, nominalHourlyWage, percentageReduction, etc.)
4. Calculates life energy cost for $100, $500, $1000 examples
5. Determines severity class based on reduction percentage
6. Renders formatted summary with conditional sections

### Formatting
- Currency: Uses `formatCurrency()` for consistent $X,XXX.XX format
- Percentages: `.toFixed(1)` for one decimal place (e.g., "23.5%")
- Hours: `.toFixed(1)` for weekly hours (e.g., "5.0 hours per week")
- Life Energy: `formatLifeEnergy()` for adaptive time format

## Usage Example

```typescript
import { PlainLanguageSummary } from '@/components/calculator';
import { CalculatorProvider } from '@/context/CalculatorContext';

function ResultsPage() {
  return (
    <CalculatorProvider>
      <div className="space-y-6">
        <ResultsDisplay />
        <PlainLanguageSummary />
        <Charts />
      </div>
    </CalculatorProvider>
  );
}
```

## Visual Structure

```
┌─────────────────────────────────────────────┐
│ Card (severity-colored border/background)   │
├─────────────────────────────────────────────┤
│ What This Means                             │
│                                             │
│ Your actual hourly wage is $20.00, which    │
│ is 20.0% less than your nominal wage of     │
│ $25.00.                                     │
│                                             │
│ [Conditional: Money expenses paragraph]     │
│ You spend $5,000.00 per year on work-       │
│ related expenses.                           │
│                                             │
│ [Conditional: Extra hours paragraph]        │
│ You spend an extra 5.0 hours per week on    │
│ work-related activities beyond your paid    │
│ hours.                                      │
│                                             │
│ ─────────────────────────────────────────   │
│                                             │
│ In terms of your life energy:               │
│ • A $100 purchase costs you 5 hours         │
│ • A $500 purchase costs you 3 days 1h       │
│ • A $1,000 purchase costs you 6 days 2h     │
└─────────────────────────────────────────────┘
```

## Styling Classes

### Layout
- `space-y-4` - Vertical spacing between sections
- `space-y-3` - Spacing between paragraphs
- `space-y-1` - Spacing between list items
- `text-sm` - Smaller text for examples list

### Typography
- `text-lg font-semibold` - Heading
- `text-neutral-900` - Dark text for heading and emphasis
- `text-neutral-700` - Body text color
- `font-semibold` - Bold emphasis on key numbers

### Semantic Colors
- `text-primary-700` - Actual wage (primary metric)
- `text-error-600` - Percentage reduction (negative impact)

### Divider
- `border-t border-neutral-200 pt-4 mt-4` - Separator before life energy examples

## Tests
- Location: `tests/components/calculator/PlainLanguageSummary.test.tsx`
- Coverage: 23 tests, all passing
- Tests cover:
  - Null results handling
  - Content rendering (heading, wages, percentages)
  - Conditional rendering (expenses, extra hours)
  - Life energy examples calculation and formatting
  - Severity class application (success/warning/error)
  - Conversational language verification
  - Number formatting (currency, percentage, hours)
  - Edge cases (low wage, large amounts)
  - Semantic HTML structure

## Related Components
- **ResultsDisplay** - Shows numerical results prominently
- **ExpenseRankings** - Lists expenses by life energy impact
- **LifeEnergyConverter** - Interactive dollar-to-hours converter
- **BreakdownChart** - Visual chart of expense breakdown

## Requirements Fulfilled
- **US-3.1**: Plain-language summary with actual wage and percentage comparison
- **US-3.2**: Context comparisons ($100, $500, $1000 purchase costs)
- **US-3.3**: Conversational, jargon-free language throughout

## Integration Notes
- Must be used within CalculatorProvider context
- Automatically updates when calculator inputs change (via context)
- Self-hiding when results unavailable (SSR-compatible)
- No props required (reads all data from context)

## Accessibility
- Semantic HTML: `<h3>` for heading, `<ul>/<li>` for examples
- Text-based content (no images or icons)
- High contrast text colors (neutral-700/900 on light backgrounds)
- Readable font sizes (base text, lg heading)

## Future Enhancements
- Add animation when results change
- Include commute-specific life energy cost if relevant
- Add "share this summary" functionality
- Localization support for different languages
