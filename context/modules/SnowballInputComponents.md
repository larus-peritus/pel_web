# Snowball Calculator Input Components

## Overview

This module contains the three input card components for the Interest Savings Snowball Calculator: LoanInputCard, ExtraPaymentCard, and InvestmentCard. These components provide user-friendly forms for collecting all necessary data to calculate the snowball effect of reinvesting interest savings from extra loan payments.

## Location

- `/apps/peninganaedalifid/src/components/snowball/LoanInputCard.tsx`
- `/apps/peninganaedalifid/src/components/snowball/ExtraPaymentCard.tsx`
- `/apps/peninganaedalifid/src/components/snowball/InvestmentCard.tsx`
- `/apps/peninganaedalifid/src/components/snowball/index.ts` (barrel export)

## Purpose

Provide comprehensive input forms for the Snowball Calculator that:
- Collect all loan parameters with conditional fields based on loan type
- Display extra payment amounts with life energy equivalents
- Guide users to realistic investment return assumptions
- Include validation, help text, and warnings in Icelandic

## Components

### LoanInputCard

**Exports**: `LoanInputCard` component

**Props**:
```typescript
interface LoanInputCardProps {
  loan: SnowballLoanInput;
  onChange: (loan: SnowballLoanInput) => void;
  errors?: Partial<Record<keyof SnowballLoanInput, string>>;
}
```

**Key Features**:
- Loan type selector (verðtryggð / óverðtryggð)
- Original loan amount and current balance inputs
- Annual interest rate input (real rate for indexed, nominal for non-indexed)
- Conditional fields:
  - Inflation rate for verðtryggð loans (default 5%)
  - Payment method selector for óverðtryggð loans (annuity/linear)
- Loan term and remaining payments inputs
- Automatic field resets when switching loan types
- Contextual help text based on loan type
- Icelandic labels and explanations

**Dependencies**:
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `CurrencyInput` from `@/components/ui/CurrencyInput`
- `NumberInput` from `@/components/ui/NumberInput`
- `Select` from `@/components/ui/Select`
- Types from `@/types/snowball`
- Constants from `@/lib/constants/snowball`

### ExtraPaymentCard

**Exports**: `ExtraPaymentCard` component

**Props**:
```typescript
interface ExtraPaymentCardProps {
  value: number;
  onChange: (value: number) => void;
  actualHourlyWage?: number;
  error?: string;
}
```

**Key Features**:
- Monthly extra payment input (ISK)
- Life energy equivalent display when actualHourlyWage provided
- Adaptive life energy formatting (minutes, hours, days+hours)
- Warning when actualHourlyWage is missing
- Explanation of what extra payment means
- How extra payment creates interest savings
- Purple-themed life energy display with clock icon
- Icelandic labels and help text

**Dependencies**:
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `CurrencyInput` from `@/components/ui/CurrencyInput`
- `formatNumber` from `@/lib/utils/formatters`

### InvestmentCard

**Exports**: `InvestmentCard` component

**Props**:
```typescript
interface InvestmentCardProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}
```

**Key Features**:
- Expected annual investment return input (percentage)
- Default value of 7% (historical stock market average)
- Informational message when using default value
- Warning when return exceeds 20% (unrealistic)
- Investment strategy guidance (conservative, moderate, aggressive)
- Historical return data (S&P 500, MSCI World, Iceland)
- Disclaimer about past performance
- Min/max validation (0-50%)
- Icelandic labels and comprehensive help text

**Dependencies**:
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/Card`
- `NumberInput` from `@/components/ui/NumberInput`
- `Alert` from `@/components/ui/Alert`
- Constants and helpers from `@/lib/constants/snowball`

## Key Functionality

### LoanInputCard
- **Loan Type Switching**: Automatically sets/clears conditional fields based on loan type
- **Field Validation**: Error display for all fields via errors prop
- **Help Text**: Context-aware explanations for each loan type
- **Icelandic Context**: Specific to Icelandic loan types and terminology

### ExtraPaymentCard
- **Life Energy Conversion**: Converts ISK amount to work hours using actualHourlyWage
- **Adaptive Formatting**: Shows minutes for < 1 hour, hours+minutes for < 24 hours, days+hours for ≥ 24 hours
- **Missing Wage Handling**: Shows warning instead of life energy when wage not available
- **Educational Content**: Explains what happens with extra payments and snowball effect

### InvestmentCard
- **Default Guidance**: Shows helpful info when using recommended 7% return
- **Reality Check**: Warns users about unrealistically high returns (> 20%)
- **Strategy Tiers**: Provides examples of returns by investment strategy (4-5% conservative, 6-8% moderate, 9-12% aggressive)
- **Historical Context**: Real data from major indices with caveats about past performance
- **Validation**: Enforces 0-50% range with helper function for unrealistic detection

## Integration

- Used by main SnowballCalculatorPage component
- Integrates with CalculatorContext for actualHourlyWage
- Follows same patterns as DebtPayoffPage input components
- Reuses existing UI components (CurrencyInput, NumberInput, Select, Card)
- All text in Icelandic with cultural context (ISK, Icelandic loan types)

## Related

- Implements: Requirements FR-1, FR-2, FR-3 from `specs/interest-savings-snowball/requirements-interest-savings-snowball.md`
- Part of: Design from `specs/interest-savings-snowball/design-interest-savings-snowball.md`
- Completes: Tasks 3.1, 3.2, 3.3 from `specs/interest-savings-snowball/tasks-interest-savings-snowball.md`
- Depends on: Types from `src/types/snowball.ts`
- Depends on: Constants from `src/lib/constants/snowball.ts`
- Depends on: UI components from `src/components/ui/`

## Usage Example

```tsx
import {
  LoanInputCard,
  ExtraPaymentCard,
  InvestmentCard,
} from '@/components/snowball';

function SnowballCalculatorPage({ actualHourlyWage = 0 }) {
  const [loan, setLoan] = useState<SnowballLoanInput>(getDefaultLoanInput());
  const [extraPayment, setExtraPayment] = useState(10_000);
  const [investmentReturn, setInvestmentReturn] = useState(0.07);

  return (
    <div>
      <LoanInputCard loan={loan} onChange={setLoan} />
      <ExtraPaymentCard
        value={extraPayment}
        onChange={setExtraPayment}
        actualHourlyWage={actualHourlyWage}
      />
      <InvestmentCard
        value={investmentReturn}
        onChange={setInvestmentReturn}
      />
    </div>
  );
}
```

## Testing Considerations

- Test conditional field display based on loan type
- Test automatic field resets when switching loan types
- Test life energy calculations with various wage values
- Test life energy formatting for edge cases (< 1 hour, exactly 24 hours, > 100 days)
- Test warning display for missing wage and unrealistic returns
- Test input validation (min/max ranges)
- Test all help text displays correctly
- Test Icelandic formatting of numbers and labels

## Design Notes

- Purple theme for life energy displays (consistent with app theme)
- Blue theme for informational alerts
- Yellow theme for warnings
- Green theme for historical data/success cases
- All monetary values in ISK with Icelandic number formatting
- Responsive grid layout (stacks on mobile, 2 columns on desktop)
- Accessible with proper labels, ARIA attributes, and error handling
- Icons from Heroicons for visual clarity
