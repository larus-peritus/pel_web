# TierToggle Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/TierToggle.tsx`

## Purpose
Toggle control for switching between expense tiers (Lágmarks/Þægilegt/Lúxus) to recalculate FIRE scenarios.

## Features
- **Three Tier Buttons**: Barebones, Comfortable, Deluxe
- **Amount Display**: Shows ISK amount for each tier
- **Active Highlighting**: Active tier has distinct styling and checkmark
- **Auto-Disable**: Disables when all tiers have same value
- **Color-Coded**: Amber (barebones), Green (comfortable), Purple (deluxe)
- **Instant Feedback**: Calls onChange immediately on selection

## Props
```typescript
interface TierToggleProps {
  activeTier: ExpenseTier;
  onTierChange: (tier: ExpenseTier) => void;
  tiers: {
    barebones: number;
    comfortable: number;
    deluxe: number;
  };
  disabled?: boolean;
}
```

## Tier Options
```typescript
{
  id: 'barebones',
  label: 'Lágmarks',
  description: 'Sparsamt',
  colors: amber theme
},
{
  id: 'comfortable',
  label: 'Þægilegt',
  description: 'Venjulegt',
  colors: green theme
},
{
  id: 'deluxe',
  label: 'Lúxus',
  description: 'Glæsilegt',
  colors: purple theme
}
```

## States
- **Active**: Selected tier - bold, darker background, checkmark icon
- **Inactive**: Non-selected tiers - lighter background, hover effect
- **Disabled**: When `disabled=true` or all tiers equal - opacity 60%, no interaction

## Visual Elements
- **Checkmark Icon**: SVG check circle on active tier (top-right)
- **Label**: Tier name in bold
- **Description**: Subtitle text
- **Amount**: ISK formatted value

## Help Text
- Normal: "Veldu útgjaldaprofíl til að sjá mismunandi FIRE markmið"
- All Same: "Þú hefur ekki sett upp mismunandi útgjaldaprofíl. Farðu í Grunnútgjöld til að búa til mismunandi profíla."

## Accessibility
- **ARIA**: `aria-pressed` on buttons, `aria-label` with tier name and amount
- **Label Element**: Proper `<label>` for component
- **Screen Reader**: Announces selection changes via `role="status"`
- **Keyboard**: Full keyboard navigation and focus rings

## Grid Layout
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 0.5rem;
```

Responsive: Maintains 3 columns on all screen sizes (buttons stack internally if needed).

## Tests
- Location: `tests/components/fireTypes/TierToggle.test.tsx`
- Coverage: Rendering, active state, interaction, disabled state, accessibility

## Dependencies
- `@/types/expenseBaseline` - ExpenseTier type
- `@/lib/utils/formatters` - formatCurrency()

## Integration
- Used by ComparisonSection when expense baseline exists
- Triggers recalculation of all FIRE types via onTierChange

## Task
Task 4.3: Create TierToggle Component
Epic 4: Comparison Table
FIRE Type Explorer Feature
