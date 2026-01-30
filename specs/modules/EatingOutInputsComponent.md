# EatingOutInputs Component

## Location
`src/components/mealCost/EatingOutInputs.tsx`

## Purpose
Input component for tracking eating out expenses across 5 meal categories (breakfast, lunch, dinner, coffee/drinks, fast food).

## Component Type
Controlled component with props interface.

## Props
```typescript
interface EatingOutInputsProps {
  data: EatingOutData;
  onChange: (data: EatingOutData) => void;
}
```

## Key Functionality
- **Meal Categories**: 5 categories (breakfast, lunch, dinner, coffee, fast food)
- **Input Fields**: Each category has count (0-21 per week) and cost inputs
- **Price Presets**: Dropdown selectors with realistic Icelandic meal prices
- **Validation**: Real-time validation (meals 0-21, costs > 0)
- **Icelandic Labels**: All text in Icelandic

## Input Fields

### Per Category
1. Count per week (0-21 validation)
2. Price preset selector
3. Cost per meal (CurrencyInput)

### Categories
1. **Morgunverður** (Breakfast): 3 price presets (1,500-3,500 kr)
2. **Hádegisverður** (Lunch): 4 price presets (1,800-4,500 kr)
3. **Kvöldverður** (Dinner): 4 price presets (2,000-10,000 kr)
4. **Kaffi / Drykkir** (Coffee): 3 price presets (400-1,000 kr)
5. **Skyndibiti** (Fast Food): 3 price presets (1,500-2,500 kr)

## Dependencies
- `@/components/ui/Card` - Layout container
- `@/components/ui/NumberInput` - Count inputs
- `@/components/ui/CurrencyInput` - Cost inputs
- `@/components/ui/Select` - Price preset dropdowns
- `@/lib/constants/mealCost` - MEAL_PRICE_PRESETS
- `@/types/calculator` - EatingOutData type

## Layout
- Card with elevated variant
- Grid layout: 3 columns on desktop (count, preset, cost)
- Stacks to single column on mobile
- 6 sections with clear headings

## Tests
- Location: `tests/components/mealCost/EatingOutInputs.test.tsx`
- Coverage: 17 tests covering all input scenarios
- Validation: Count range, price presets, onChange handlers

## Integration
- Part of Meal Cost Calculator feature
- Works with `useCalculator` context (via parent component)
- Data flows up via onChange callback

## Accessibility
- All inputs have proper labels
- Help text for validation ranges
- ARIA attributes via UI components
- Keyboard navigation support

## Related
- Implements: Requirements NS-1, NS-2, NS-3, NS-8
- Part of: `specs/matkostnadur/design.md`
- Complements: HomeCookingInputs component
