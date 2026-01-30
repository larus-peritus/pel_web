# Snowball Results Display Components

## Location
- `apps/peninganaedalifid/src/components/snowball/ScenarioSummary.tsx`
- `apps/peninganaedalifid/src/components/snowball/RecommendationCard.tsx`

## Purpose
Visual display components for the Interest Savings Snowball Calculator results. Shows three-scenario comparison and provides intelligent recommendations to help users choose the best debt payoff strategy.

## Exports

### ScenarioSummary Component
**File**: `src/components/snowball/ScenarioSummary.tsx`

Displays three cards side-by-side comparing all debt payoff scenarios:
1. **Grunnur** (Base case) - Gray theme - Extra payment only
2. **Snjóbolti → Lán** (Snowball to loan) - Blue theme - Savings applied to loan
3. **Snjóbolti → Fjárfesting** (Snowball to investment) - Green theme - Savings invested

**Props**:
```typescript
interface ScenarioSummaryProps {
  results: SnowballResults;
}
```

**Features**:
- Responsive grid layout (1 column mobile, 3 columns desktop)
- Color-coded cards with themed borders and backgrounds
- Displays key metrics per scenario:
  - Months to payoff
  - Total interest paid
  - Total payments
  - Final investment balance (snowball-to-investment only)
  - Total wealth created (highlighted)
  - Life energy savings (purple, "klst" suffix)
- Icelandic number formatting (period separator)
- Conditional rendering (investment balance, life energy)

**Internal Component**:
- `Stat`: Reusable stat display with label, value, optional suffix, formatting, colors

### RecommendationCard Component
**File**: `src/components/snowball/RecommendationCard.tsx`

Displays intelligent recommendation based on calculated results.

**Props**:
```typescript
interface RecommendationCardProps {
  recommendation: SnowballResults['recommendation'];
}
```

**Features**:
- Displays best scenario name prominently (Icelandic)
- Shows "Jafntefli - persónuleg val" badge for close calls (isCloseCall=true)
- Displays reasoning as plain-language Icelandic text (supports multiline)
- Prominent purple panel showing life energy difference
- "X klst meira frítíma á ævinni" messaging
- Conditional border colors:
  - Green (`border-success-300`) for clear recommendation
  - Yellow (`border-warning-300`) for close call
- Close call explanation panel (appears when isCloseCall=true)

**Scenario Name Mapping**:
```typescript
{
  base: 'Grunnur (aukagreiðsla eingöngu)',
  snowballLoan: 'Snjóbolti á lán',
  snowballInvest: 'Snjóbolti í fjárfestingu'
}
```

## Key Functionality

### ScenarioSummary
- **Three-card comparison**: Each scenario displayed in separate card
- **Color theming**: Visual differentiation using color schemes
  - Gray for neutral base case
  - Blue for loan-focused strategy
  - Green for investment-focused strategy
- **Responsive layout**: Stacks on mobile, grid on desktop
- **Conditional display**: Shows investment balance only when > 0, life energy only when wage provided
- **Highlighted metrics**: Total wealth created in shaded box
- **Formatted values**: All currency in Icelandic format (e.g., "500.000 kr")

### RecommendationCard
- **Best scenario display**: Large, bold text showing recommended approach
- **Close call detection**: Badge appears when scenarios within 5% of each other
- **Reasoning display**: Multi-line Icelandic explanation with context
- **Life energy impact**: Prominent purple panel with hours saved
- **Visual feedback**: Border color changes based on recommendation confidence
- **Educational messaging**: Close call explanation encourages personal choice

## Dependencies
- `@/types/snowball` - SnowballResults, ScenarioSummary types
- `@/lib/utils/formatters` - formatCurrency() for Icelandic formatting
- `@/components/ui/Card` - Card, CardHeader, CardContent components
- `@/components/ui/Badge` - Badge component for close call indicator

## Testing
**Location**:
- `tests/components/snowball/ScenarioSummary.test.tsx` (10 tests, all passing)
- `tests/components/snowball/RecommendationCard.test.tsx` (12 tests, all passing)

**Coverage**:
- ScenarioSummary tests:
  - All three scenario cards render
  - Correct months to payoff displayed
  - Icelandic number formatting (period separator)
  - Investment balance only in snowball-to-investment
  - Total wealth created in all scenarios
  - Life energy with "klst" suffix
  - Correct border colors applied
  - Scenario subtitles displayed
  - Zero life energy handled gracefully
  - Responsive grid layout
- RecommendationCard tests:
  - Best scenario name displayed
  - Reasoning text displayed
  - Life energy difference with "klst" suffix
  - Close call badge shown/hidden correctly
  - Close call explanation shown when appropriate
  - Green border for clear recommendation
  - Yellow border for close call
  - All three scenario names mapped correctly
  - Zero life energy handled gracefully
  - Multiline reasoning formatted correctly
  - Header and content sections render

## Integration
- Used by: SnowballCalculatorPage (pending implementation)
- Receives data from: calculateSnowball() function in snowball.ts
- Part of: specs/interest-savings-snowball/design-interest-savings-snowball.md
- Implements: Tasks 4.1-4.2 from tasks-interest-savings-snowball.md

## UI/UX Patterns

### Color Scheme
- **Gray** (neutral-xxx): Base case, no special strategy
- **Blue** (primary-xxx): Loan-focused, debt elimination priority
- **Green** (success-xxx): Investment-focused, wealth building
- **Purple** (purple-xxx): Life energy metrics
- **Yellow** (warning-xxx): Close call, requires user judgment

### Typography
- Card titles: `text-lg font-bold`
- Scenario subtitles: `text-sm text-neutral-600`
- Stat labels: `text-sm text-neutral-600`
- Stat values: `text-xl font-semibold`
- Recommendation title: `text-xl font-bold`
- Best scenario name: `text-2xl font-bold`
- Life energy hours: `text-3xl font-bold`

### Spacing
- Card gap: `gap-6`
- Internal card spacing: `space-y-4`
- Purple panel padding: `p-6`
- Stat highlighting: `bg-neutral-50 p-3 rounded-lg`

### Responsive Behavior
- Mobile: Single column, cards stack vertically
- Desktop: Three columns side-by-side
- All text remains readable at all sizes
- Touch targets appropriately sized

## Accessibility
- All text uses semantic HTML
- Color is not the only indicator (text labels present)
- Contrast ratios meet WCAG AA standards
- Card structure clear with headers and content sections
- Badge provides additional context beyond color

## Related
- Implements: Requirements REQ-US-1, REQ-US-4, REQ-FR-5, REQ-NFR-2
- Similar patterns: DebtPayoffPage result cards
- Context: context/modules/SnowballCalculationEngine.md (data source)
- Context: context/modules/SnowballCalculatorFoundation.md (types)
