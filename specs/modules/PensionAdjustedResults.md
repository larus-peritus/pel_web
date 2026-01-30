# PensionAdjustedResults Component

## Location
`apps/peninganaedalifid/src/components/fiNumber/PensionAdjustedResults.tsx`

## Purpose
Displays FI number calculation results when pension income is included. Shows three-section breakdown: Full FI number, pension-adjusted FI number, and bridge amount (for early retirement). This component replaces basic results display when pension data exists.

## Component Type
UI Component - Results Display

## Exports
- `export const PensionAdjustedResults: React.FC<PensionAdjustedResultsProps>`
- `export interface PensionAdjustedResultsProps`

## Key Functionality

### Hero Total Display
- Prominently shows total needed (bridge + pension-adjusted FI)
- Large, bold hero section with gradient background (success colors)
- Clear description of what the total represents
- Savings badge showing reduction from full FI
- Percentage savings calculation

### Three-Section Breakdown

#### Section 1: Full FI Number (Reference)
- Shows full FI without pension consideration
- Gray/neutral color scheme (reference point)
- "Viðmiðun" (Reference) badge
- Explanation text

#### Section 2: Pension-Adjusted FI
- Shows reduced FI number accounting for pension income
- Green/success color scheme (positive outcome)
- "Eftir 67 ára" (After age 67) badge
- Displays pension monthly/annual income
- Shows reduced annual expenses after pension
- Shows multiplier used

#### Section 3: Bridge Amount (Conditional)
- Only shown if retirement age < pension start age (67)
- Yellow/warning color scheme (additional requirement)
- Shows bridge years count as badge
- Calculates funds needed for gap period
- Explanation of bridge concept

### Calculation Formula Display
- Shows total calculation formula
- Different format based on whether bridge exists:
  - **No bridge**: "Pension-adjusted FI = X"
  - **With bridge**: "Bridge + Pension-adjusted = Total"
- Monospace font for formula clarity

### Visual Hierarchy
- Clear section separation with borders and backgrounds
- Color-coded sections (gray, green, yellow)
- Large numbers for key amounts
- Small descriptive text
- Badge indicators for section types

## Props Interface

```typescript
interface PensionAdjustedResultsProps {
  fullFINumber: number;
  pensionAdjusted: PensionAdjustedResult;
  multiplier: number;
  withdrawalRate: number;
  className?: string;
}
```

## PensionAdjustedResult Type

```typescript
interface PensionAdjustedResult {
  pensionMonthlyIncome: number;
  pensionAnnualIncome: number;
  reducedAnnualExpenses: number;
  pensionAdjustedFI: number;
  targetRetirementAge: number;
  pensionStartAge: number;
  bridgeYears: number;
  bridgeAmount: number;
  totalNeeded: number;
}
```

## Calculations Performed

### Savings from Pension
```typescript
savingsFromPension = fullFINumber - pensionAdjustedFI
savingsPercentage = (savingsFromPension / fullFINumber) * 100
```

### Bridge Needed Check
```typescript
needsBridge = bridgeYears > 0 && bridgeAmount > 0
```

## Dependencies

### UI Components
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `Badge` from `@/components/ui/Badge`

### Utilities
- `formatCurrency` from `@/lib/utils/formatters` - ISK formatting
- `formatNumber` from `@/lib/utils/formatters` - Number formatting
- `cn` from `@/lib/utils` - Class name merging

### Types
- `PensionAdjustedResult` from `@/types/fiNumber`

## Color Scheme

### Hero Section
- Gradient: `from-success-50 via-success-100 to-primary-50`
- Border: `border-success-200`
- Text: `text-success-700` (label), `text-success-900` (value)

### Full FI Section (Reference)
- Background: `bg-neutral-50`
- Border: `border-neutral-200`
- Badge: `variant="neutral"`

### Pension-Adjusted Section
- Background: `bg-success-50`
- Border: `border-success-300` (2px)
- Badge: `variant="success"`

### Bridge Section
- Background: `bg-warning-50`
- Border: `border-warning-300` (2px)
- Badge: `variant="warning"`

## Responsive Design
- Flexible grid layouts
- Text size adjusts (text-2xl → text-3xl)
- Stack on mobile (sm:flex-row)
- Padding adjusts (p-5 → p-8 → p-12)

## Icelandic Text
All text in Icelandic:
- "Heildarþörf með lífeyri" - Total needed with pension
- "Lífeyrisaðlöguð FI-tala" - Pension-adjusted FI number
- "Brúarsparnaður" - Bridge savings
- "Sparnaður" - Savings
- "Viðmiðun" - Reference
- "Eftir 67 ára" - After age 67

## Usage Example

```tsx
<PensionAdjustedResults
  fullFINumber={180000000}
  pensionAdjusted={{
    pensionMonthlyIncome: 200000,
    pensionAnnualIncome: 2400000,
    reducedAnnualExpenses: 3600000,
    pensionAdjustedFI: 108000000,
    targetRetirementAge: 55,
    pensionStartAge: 67,
    bridgeYears: 12,
    bridgeAmount: 72000000,
    totalNeeded: 180000000,
  }}
  multiplier={30}
  withdrawalRate={0.0333}
/>
```

## Number Formatting
- Currency: Icelandic format (e.g., "180.000.000 kr")
- Numbers: Icelandic format with comma for decimals (e.g., "40,0%")
- Large numbers: Dots as thousand separators

## Tests
Location: `apps/peninganaedalifid/tests/components/fiNumber/PensionAdjustedResults.test.tsx`

Coverage:
- Rendering (all sections, hero display)
- Full FI section (reference display)
- Pension-adjusted section (details, income display)
- Bridge section (conditional display, early retirement)
- Savings display (badge, percentage)
- Calculation formula (with/without bridge)
- Visual elements (colors, badges)
- Edge cases (large amounts, zero bridge, very early retirement)
- Number formatting (Icelandic currency, percentages)

All 28 tests passing.

## Integration
- Used by: `ResultsDisplay` component (conditional rendering when pension data exists)
- Data from: `calculatePensionAdjustedFI` from `@/lib/calculations/fiNumber`
- Replaces: Basic results display when `hasPension === true`

## Related
- Implements: FR-5.2, FR-5.3, FR-5.5 from specs/fi-number-builder/requirements-fi-number-builder.md
- Part of: Epic 5 (Pension Integration) in specs/fi-number-builder/tasks-fi-number-builder.md
- Depends on: PensionAdjustedResult type from FINumberTypes module
- Uses calculations from: FINumberCalculations module (calculatePensionAdjustedFI, calculateBridgeAmount)
