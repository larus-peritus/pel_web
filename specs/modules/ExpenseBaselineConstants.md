# Expense Baseline Constants

## Location
`src/lib/constants/expenseBaseline.ts`

## Purpose
Default expense categories and configuration constants for the Expense Baseline Tool with realistic Icelandic ISK values.

## Key Exports

### DEFAULT_EXPENSE_CATEGORIES
```typescript
const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[]
```
Array of 10 default Icelandic expense categories with defaults that sum to:
- Barebones: 250,000 kr/month
- Comfortable: 520,000 kr/month  
- Deluxe: 1,000,000 kr/month

**Categories:**
1. Húsnæði (Housing) - 🏠
2. Matur (Food) - 🍽️
3. Samgöngur (Transport) - 🚗
4. Heilsa (Healthcare) - 🏥
5. Tryggingar (Insurance) - 🛡️
6. Veitur (Utilities) - 💡
7. Persónuleg (Personal) - 👤
8. Afþreying (Entertainment) - 🎬
9. Sparnaður (Savings) - 💰
10. Annað (Other) - 📦

### TIER_LABELS
```typescript
const TIER_LABELS: Record<ExpenseTier, string> = {
  barebones: 'Lágmarks',
  comfortable: 'Þægilegt',
  deluxe: 'Lúxus'
}
```
Icelandic labels for the three tiers.

### TIER_DESCRIPTIONS
```typescript
const TIER_DESCRIPTIONS: Record<ExpenseTier, string>
```
Icelandic descriptions explaining each tier level.

### TIER_COLORS
```typescript
const TIER_COLORS: Record<ExpenseTier, TierColorScheme>
```
Tailwind CSS color schemes for visual tier distinction:
- Barebones: Amber tones
- Comfortable: Green tones
- Deluxe: Purple tones

### DEFAULT_CATEGORY_ORDER
```typescript
const DEFAULT_CATEGORY_ORDER: Record<string, number>
```
Default display order (0-9) for consistent category presentation.

### EXPENSE_BASELINE_VERSION
```typescript
const EXPENSE_BASELINE_VERSION = 1
```
Schema version for data migrations.

## Validation

The file includes a development-mode verification function that ensures the category defaults sum to the required totals. Any mismatch triggers a console warning.

## Related
- Implements: Requirements US-2, FR-1.1, FR-2.4 from specs/expense-baseline/requirements-expense-baseline.md
- Uses types from: src/types/expenseBaseline.ts
- Part of: EPIC 1 - Foundation (Tasks 1.1-1.2)
