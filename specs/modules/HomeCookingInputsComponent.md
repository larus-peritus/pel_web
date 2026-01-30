# HomeCookingInputs Component

## Location
`src/components/mealCost/HomeCookingInputs.tsx`

## Purpose
Input component for tracking home cooking expenses including groceries and time investment.

## Component Type
Controlled component with props interface.

## Props
```typescript
interface HomeCookingInputsProps {
  data: HomeCookingData;
  onChange: (data: HomeCookingData) => void;
  actualHourlyWage: number;
}
```

## Key Functionality
- **Grocery Cost**: Monthly grocery bill input
- **Household Size**: Number of people (min 1)
- **Time Tracking**: Shopping and cooking hours per week
- **Calculated Values**: Cost per person, time cost breakdown
- **Wage Integration**: Uses actualHourlyWage for time cost calculations

## Input Fields

1. **Mánaðarlegur matvörukostnaður** (Monthly Grocery Cost)
   - CurrencyInput
   - Help text explains it's total household grocery bill

2. **Fjöldi í heimili** (Household Size)
   - NumberInput with min: 1
   - Shows calculated cost per person

3. **Innkaupatími á viku** (Shopping Hours/Week)
   - NumberInput with step: 0.5
   - Min: 0, Max: 40

4. **Eldunartími á viku** (Cooking Hours/Week)
   - NumberInput with step: 0.5
   - Min: 0, Max: 40
   - Includes prep, cooking, and cleanup

## Calculated Displays

### Cost Per Person
Shows when `householdSize > 0`:
- Formula: `monthlyGroceryCost / householdSize`
- Displayed in primary-50 background section

### Time Cost Breakdown
Shows when `totalWeeklyHours > 0` and `actualHourlyWage > 0`:
- Total weekly hours (shopping + cooking)
- Hourly wage
- Weekly time cost (hours × wage)
- Formula display for transparency

### Warning Messages
Shows when `actualHourlyWage === 0`:
- Orange warning box
- Message: "Vinsamlegast fylltu út raunverulegt tímakaup í aðalreiknivélinni til að sjá tímakostnað."

## Dependencies
- `@/components/ui/Card` - Layout container
- `@/components/ui/NumberInput` - Numeric inputs
- `@/components/ui/CurrencyInput` - Grocery cost input
- `@/lib/utils/formatters` - formatCurrency, formatHourlyCurrency
- `@/types/calculator` - HomeCookingData type

## Layout
- Card with elevated variant
- Vertical stacking of all inputs
- Calculated value sections with distinct backgrounds
- Responsive padding and spacing

## Tests
- Location: `tests/components/mealCost/HomeCookingInputs.test.tsx`
- Coverage: 25 tests covering all scenarios
- Tests: Input validation, calculations, edge cases, warnings

## Integration
- Part of Meal Cost Calculator feature
- Receives `actualHourlyWage` from CalculatorContext
- Data flows up via onChange callback

## Accessibility
- All inputs have proper labels
- Help text explains each field
- ARIA attributes via UI components
- Keyboard navigation support

## Edge Cases Handled
- Zero household size (hides cost per person)
- Zero wage (shows warning, hides time cost)
- Zero hours (hides time cost breakdown)
- Decimal hour values (0.5 step)

## Related
- Implements: Requirements NS-4
- Part of: `specs/matkostnadur/design.md`
- Complements: EatingOutInputs component
