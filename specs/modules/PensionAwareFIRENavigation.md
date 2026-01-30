# Pension-Aware FIRE Calculator Navigation Integration

## Location
- `src/components/calculator/CalculatorPageContent.tsx` (FIRE_CALCULATORS array, lines 378-400)
- Route: `/lifeyristengd-fire` (standalone page)
- Calculator Hub: Main page calculator hub under "FIRE" tab

## Purpose
Integration of the Pension-Aware FIRE Calculator into the site's navigation system, making it discoverable through the main calculator hub.

## Implementation Details

### Calculator Entry
Added to `FIRE_CALCULATORS` array:
```typescript
{
  id: 'lifeyristengd-fire',
  name: 'Lífeyristengd FIRE',
  description: 'Reiknaðu raunverulega FI-tölu með tilliti til íslenska lífeyriskerfisins.',
  icon: '🎯',
  available: true,
}
```

### Import Statement
```typescript
import { PensionAwareFIRECalculator } from '@/components/pensionAwareFire';
```

### Conditional Rendering
Added to `FireImpactContent` function:
```typescript
if (selectedCalculator === 'lifeyristengd-fire') {
  return (
    <PensionAwareFIREContent onBack={() => onSelectCalculator(null)} />
  );
}
```

### Content Component
```typescript
interface PensionAwareFIREContentProps {
  onBack: () => void;
}

function PensionAwareFIREContent({ onBack }: PensionAwareFIREContentProps) {
  return <PensionAwareFIRECalculator onBack={onBack} />;
}
```

## Navigation Flow

1. User visits main page (`/`)
2. Clicks on "FIRE" tab in calculator hub
3. Sees "Lífeyristengd FIRE" card with icon 🎯
4. Clicks card → navigates to calculator
5. Calculator renders with back button
6. Back button returns to calculator hub

## Alternative Access
Calculator is also accessible directly via route:
- URL: `/lifeyristengd-fire`
- Standalone page with full calculator functionality

## Position in Hub
The calculator appears as the last entry in the FIRE calculators section, after:
1. FI-tala reiknivél
2. FIRE Leiðarvísir
3. Sjálfvirkt FIRE (Coast FIRE)
4. Kaffiþjóna FIRE (Barista FIRE)
5. Eftirlaunahermir
6. Lágmarks FIRE (Lean FIRE)
7. Lúxus FIRE (Fat FIRE)
8. **Lífeyristengd FIRE** ← NEW

## Integration Points

### With CalculatorContext
The calculator uses the shared CalculatorContext for state management, allowing integration with:
- Expense Baseline Tool (for monthly expenses)
- Life Energy calculations
- Data persistence (localStorage)

### With Other Calculators
- Can be used alongside FI Number Builder
- Complements Retirement Simulator
- Shares expense baseline with Lean/Fat FIRE calculators

## Testing

### Manual Testing Checklist
- Calculator card displays in FIRE tab
- Icon and description are correct
- Click navigates to calculator
- Calculator loads without errors
- Back button returns to hub
- Direct URL `/lifeyristengd-fire` works
- State persists across navigation

## Related Files
- Calculator Component: `src/components/pensionAwareFire/PensionAwareFIRECalculator.tsx`
- Page Route: `src/app/lifeyristengd-fire/page.tsx`
- Context: `src/context/CalculatorContext.tsx`
- Navigation Hub: `src/components/calculator/CalculatorPageContent.tsx`

## Metadata
- Implemented: 2026-01-30
- Task: Task 8.2 from specs/tasks-pension-aware-fire.md
- Status: Complete
- No TypeScript errors
- Consistent with existing calculator patterns
