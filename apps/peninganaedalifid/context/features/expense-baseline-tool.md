# Feature: Expense Baseline Tool (Útgjaldagrunnur)

## Overview
The Expense Baseline Tool enables users to define their monthly expenses at three spending tiers (Barebones/Comfortable/Deluxe) across multiple categories. This baseline serves as the foundation for FI Number calculations, savings rate analysis, and other FIRE planning tools.

## Status
In Progress - EPIC 1 Foundation Complete (2/8 EPICs)

## Architecture
Client-side React application with TypeScript, using React Context for state management and localStorage for persistence. No backend/server requirements.

## Three-Tier Philosophy
Based on "Your Money or Your Life" lifestyle planning:
- **Barebones (Lágmarks)**: Minimum expenses needed to survive (250,000 kr/month)
- **Comfortable (Þægilegt)**: Reasonable quality of life expenses (520,000 kr/month)
- **Deluxe (Lúxus)**: Ideal lifestyle expenses without worrying (1,000,000 kr/month)

## Modules

### Types
- **ExpenseBaselineTypes** - context/modules/ExpenseBaselineTypes.md
  - Core type definitions for expense baseline data
  - ExpenseTier, TierValues, ExpenseCategory, ExpenseBaseline
  - ExpenseBaselineResults with life energy and tier differences
  - Storage and validation types

### Constants
- **ExpenseBaselineConstants** - context/modules/ExpenseBaselineConstants.md
  - 10 default Icelandic expense categories with realistic ISK values
  - Tier labels, descriptions, and color schemes
  - Category ordering and version management

## Default Categories

1. **Húsnæði (Housing)** 🏠 - 120k/200k/350k kr
2. **Matur (Food)** 🍽️ - 40k/70k/120k kr
3. **Samgöngur (Transport)** 🚗 - 15k/40k/80k kr
4. **Heilsa (Healthcare)** 🏥 - 5k/15k/30k kr
5. **Tryggingar (Insurance)** 🛡️ - 5k/15k/25k kr
6. **Veitur (Utilities)** 💡 - 20k/35k/50k kr
7. **Persónuleg (Personal)** 👤 - 10k/25k/50k kr
8. **Afþreying (Entertainment)** 🎬 - 10k/40k/100k kr
9. **Sparnaður (Savings)** 💰 - 20k/60k/150k kr
10. **Annað (Other)** 📦 - 5k/20k/45k kr

## Dependencies
- React Context (CalculatorProvider)
- Actual Hourly Wage Calculator (for life energy calculations)
- localStorage for data persistence

## Testing
- Unit tests: Calculation functions
- Component tests: React Testing Library
- Integration tests: CalculatorContext integration
- Accessibility: WCAG 2.1 AA compliance

## Implementation Notes
- 2026-01-22: Completed EPIC 1 Tasks 1.1-1.2 - Type definitions and default categories
  - All 10 categories defined with Icelandic labels
  - Totals verified: 250k (bare), 520k (comf), 1M (deluxe)
  - Color schemes for visual tier distinction
  - Ready for calculation engine implementation

## Related
- Requirements: /specs/expense-baseline/requirements-expense-baseline.md
- Design: /specs/expense-baseline/design-expense-baseline.md
- Tasks: /specs/expense-baseline/tasks-expense-baseline.md
- Integration: Will provide API for FI Number, Savings Rate, and Coast FIRE calculators
