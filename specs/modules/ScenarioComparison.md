# ScenarioComparison Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/ScenarioComparison.tsx`

## Purpose
Displays a comparison of FI numbers across all three expense tiers (barebones, comfortable, deluxe) using the same multiplier, allowing users to see how different lifestyle choices affect their FI target.

## Component Type
Presentational component (UI-only, no state management)

## Exports
- `ScenarioComparison` - Main component
- `ScenarioComparisonProps` - Component props interface

## Key Functionality
- **Three-tier comparison**: Shows FI numbers for all expense tiers simultaneously
- **Selected tier highlighting**: Visually highlights the currently selected tier
- **Difference calculation**: Shows ISK and percentage differences from selected tier
- **Responsive design**: Desktop table view, mobile card view
- **Interactive selection**: Optional callback to select a different tier
- **Color-coded tiers**: Uses expense baseline color scheme (amber/green/purple)

## Props Interface
```typescript
interface ScenarioComparisonProps {
  scenarios: ScenarioComparisonResult;    // FI numbers for all three tiers
  selectedTier: ExpenseTier;               // Currently selected tier
  multiplier: number;                      // Multiplier used for calculations
  onTierSelect?: (tier: ExpenseTier) => void; // Optional tier selection callback
}
```

## Visual Layout

### Desktop (Table View)
```
┌─────────────────────────────────────────────────────────────┐
│ Samanburður á FI-tölum                                      │
│ Hvernig mismunandi útgjaldaþrep hafa áhrif...              │
├─────────────────────────────────────────────────────────────┤
│ Útgjaldaþrep │ Árleg útgjöld │ FI-tala      │ Mismunur    │
├──────────────┼───────────────┼──────────────┼─────────────┤
│ Lágmarks     │ 3.000.000 kr  │ 90.000.000   │ -96M (-51%) │
│ Þægilegt ✓   │ 6.240.000 kr  │ 187.200.000  │ —           │
│ Lúxus        │ 12.000.000 kr │ 360.000.000  │ +172M (+92%)│
└─────────────────────────────────────────────────────────────┘
```

### Mobile (Card View)
```
┌─────────────────────┐
│ Lágmarks            │
│ Árleg: 3.000.000 kr │
│ FI: 90.000.000 kr   │
│ Mismunur: -96M      │
└─────────────────────┘
```

## Dependencies
- **UI Components**: Card, CardHeader, CardContent from `@/components/ui/Card`
- **Utilities**: formatCurrency, formatNumber from `@/lib/utils/formatters`
- **Constants**: TIER_LABELS, TIER_COLORS from `@/lib/constants/expenseBaseline`
- **Styling**: cn utility from `@/lib/utils`
- **Types**: ScenarioComparisonResult, ScenarioResult from `@/types/fiNumber`

## Features

### 1. Responsive Design
- **Desktop**: Full table with 4 columns
- **Mobile**: Stacked cards, one per tier
- Automatic layout switching via Tailwind classes

### 2. Color Coding
Uses expense baseline color scheme:
- **Barebones**: Amber (amber-50, amber-300, amber-800)
- **Comfortable**: Green (green-50, green-300, green-800)
- **Deluxe**: Purple (purple-50, purple-300, purple-800)

### 3. Difference Display
- **Positive difference**: +172.800.000 kr (+92,3%)
- **Negative difference**: -96.000.000 kr (-51,6%)
- **Zero difference**: ±0 kr
- **Selected tier**: Em dash (—)

### 4. Accessibility
- Proper table structure with semantic HTML
- Row role and tabIndex when interactive
- Keyboard navigation (Enter/Space to select)
- Visual focus indicators

## Usage Example
```typescript
import { ScenarioComparison } from '@/components/fiNumber';

// Basic usage (read-only)
<ScenarioComparison
  scenarios={scenarios}
  selectedTier="comfortable"
  multiplier={30}
/>

// With tier selection
<ScenarioComparison
  scenarios={scenarios}
  selectedTier="comfortable"
  multiplier={30}
  onTierSelect={(tier) => handleTierSelect(tier)}
/>
```

## Integration
- **Used by**: FINumberBuilderCalculator (main FI number page)
- **Uses**: Expense baseline color constants and tier labels
- **Data source**: calculateScenarioComparison() from fiNumber calculations

## Tests
- **Location**: `tests/components/fiNumber/ScenarioComparison.test.tsx`
- **Coverage**: 25 tests covering rendering, interaction, formatting, accessibility
- **Key test areas**:
  - Rendering all three tiers
  - Highlighting selected tier
  - Displaying differences correctly
  - Responsive layout switching
  - Keyboard navigation
  - Color coding
  - Edge cases (zero differences, different selected tiers)

## Implementation Notes
- Uses hidden md:block for desktop table, md:hidden for mobile cards
- Conditional styling based on `isSelected` boolean
- Difference calculation handled by parent (calculateScenarioComparison)
- Optional interactivity via onTierSelect prop
- Icelandic number formatting via formatCurrency/formatNumber

## Related Modules
- **ScenarioComparisonChart**: Visual chart version of this comparison
- **ExpenseSourceSelector**: Provides tier selection UI
- **FINumberCalculations**: Calculates scenario comparison data
- **TierSelector**: Expense baseline tier selection component

## Icelandic Text
All text is in Icelandic:
- "Samanburður á FI-tölum" (Comparison of FI numbers)
- "Útgjaldaþrep" (Expense tier)
- "Árleg útgjöld" (Annual expenses)
- "FI-tala" (FI number)
- "Mismunur" (Difference)
- "Valið" (Selected)

## Future Enhancements
- Add animation for tier switching
- Hover tooltips with additional details
- Export comparison as image/PDF
- Add comparison of multiple multipliers simultaneously
