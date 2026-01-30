# Feature: Savings Report (Sparnaðarskýrsla)

## Overview
The Savings Report (Sparnaðarskýrsla) is a comprehensive savings tracking feature that complements the Current Expense Report. It enables users to track their savings across multiple categories, including current balances and monthly contributions. This data integrates with other calculators for FI planning, savings rate calculations, and life energy visualization.

## Status
In Progress - 17/27 tasks complete

**Completed Epics:**
- Epic 1: Foundation (Types, Constants, Calculations) - Complete
- Epic 2: State Management (CalculatorContext Integration) - Complete
- Epic 3: Editor UI Components - Complete (2026-01-26)
- Epic 4: Dashboard UI - Complete (2026-01-26)
- Epic 5: Main Component and Integration - Complete (2026-01-26)

**Remaining Epics:**
- Epic 6: Testing and Quality Assurance (Tasks 6.1-6.4)

## Architecture

### Data Flow
```
User Input (Editor) → CategoryAccordion → SavingsEditor
                                              ↓
                                    updateSavingsCategory()
                                              ↓
                                    CalculatorContext
                                              ↓
                                    calculateSavingsReportResults()
                                              ↓
                                    savingsReportResults
                                              ↓
                        Dashboard / Other Calculators (via API)
```

### Component Hierarchy
```
SavingsReportCalculator (Main - To be built in Epic 5)
├── EducationalIntro (collapsible)
├── ViewModeToggle (dashboard/editor)
├── SavingsEditor (Editor Mode - Epic 3 Complete ✅)
│   └── CategoryAccordion (per category)
│       ├── BalanceInput (with life energy)
│       ├── ContributionInput (with life energy)
│       ├── TargetInput (with progress bar)
│       └── NotesInput (optional)
└── SavingsDashboard (Dashboard Mode - Epic 4)
    ├── QuickStats
    ├── CategoryBreakdownChart
    ├── SavingsProgressList
    └── SavingsRateInsights
```

## Modules

### Types
- **Location**: `src/types/savingsReport.ts`
- **Documentation**: context/modules/SavingsReportTypes.md
- **Purpose**: TypeScript type definitions for all savings report data structures

### Constants
- **Location**: `src/lib/constants/savingsReport.ts`
- **Documentation**: context/modules/SavingsReportConstants.md
- **Purpose**: Default categories, colors, savings rate thresholds, and messages

### Calculations
- **Location**: `src/lib/calculations/savingsReport.ts`
- **Documentation**: context/modules/SavingsReportCalculations.md
- **Purpose**: Pure calculation functions for totals, rates, and breakdowns
- **Tests**: 49 unit tests, >90% coverage

### Context Integration
- **Location**: `src/context/CalculatorContext.tsx`
- **Documentation**: context/modules/SavingsReportContext.md
- **Purpose**: State management, persistence, and API for other calculators

### Editor UI Components (Epic 3 - Complete)
- **Location**: `src/components/savingsReport/`
- **Documentation**: context/modules/SavingsReportEditorUI.md
- **Components**:
  - SavingsEditor (166 lines) - Main editor container
  - CategoryAccordion (205 lines) - Category accordion with inputs
  - BalanceInput (67 lines) - Balance with life energy
  - ContributionInput (67 lines) - Contribution with life energy
  - TargetInput (150 lines) - Target with progress bar
  - NotesInput (61 lines) - Optional notes textarea
- **Total**: 716 lines of code
- **Status**: Build successful, 0 TypeScript errors

## Default Categories

| Icon | Name | Description |
|------|------|-------------|
| 🛡️ | Neyðarsjóður | 3-6 mánaða útgjöld í varasjóði fyrir óvænt atvik |
| 📅 | Skammtímasparnaður | Markmið innan 2 ára - frí, bíll, húsgögn, o.fl. |
| 🎯 | Langtímasparnaður | Markmið yfir 2 ár - útborgun, menntun, stærri kaup |
| 📈 | Fjárfestingar | Hlutabréf, sjóðir, ETF, og aðrar fjárfestingar |
| 🏖️ | Lífeyrissjóður | Lífeyrissjóðir, þ.m.t. mótframlag vinnuveitanda |
| ⭐ | Sérstakur sjóður | Sérsniðið markmið sem þú skilgreinir sjálf/ur |
| 📦 | Annað | Ýmis sparnaður sem fellur ekki undir aðra flokka |

## Key Features

### Category Tracking (Epic 3 - Complete)
- Track balance and monthly contribution per category
- Optional target amounts with progress tracking
- Optional notes for each category
- Hide/show categories as needed
- Expand/collapse all controls
- Color-coded progress bars

### Life Energy Integration
- Balance displayed in work hours (when AWH available)
- Monthly contribution in work hours per month
- Remaining to target in work hours
- Automatic calculation based on actual hourly wage
- Helper text when AWH not available

### Progress Tracking
- Visual progress bars for categories with targets
- Color-coded based on progress (red < 50%, amber 50-74%, blue 75-99%, green ≥ 100%)
- Percentage display
- Remaining amount calculation
- Goal reached indicator with success icon

### Savings Rate Calculation
- Automatic calculation when income available
- Percentage of gross income
- Contextual messages based on rate level
- FI timeline estimates

## Dependencies

### Required Context
- `CalculatorContext` - For state management and persistence
- `results.actualHourlyWage` - For life energy calculations
- `results.netAnnualIncome` - For savings rate calculation

### UI Components
- `CurrencyInput` from @/components/ui
- `Button` from @/components/ui
- `Card`, `CardContent`, `CardHeader` from @/components/ui (for future dashboard)

### Utilities
- `formatCurrency` - ISK formatting
- `formatNumber` - Number formatting with decimals
- `cn` - Class name utility

## Testing Strategy

### Completed Tests
- **Calculation Functions**: 49 unit tests
  - Total savings calculation
  - Monthly contribution calculation
  - Savings rate calculation with/without income
  - Life energy calculation with/without AWH
  - Category breakdown with percentages
  - Savings rate level classification
  - Edge cases (empty arrays, hidden categories, zero values)

### Pending Tests (Epic 6)
- Component tests for Editor UI
- Integration tests with CalculatorContext
- Accessibility audit
- Dashboard component tests (after Epic 4)

## Integration Points

### For Other Calculators
The Savings Report provides an API via CalculatorContext:
```typescript
const {
  getSavingsReport,          // Get complete report
  getTotalSavings,           // Get total balance
  getTotalMonthlyContribution, // Get total contribution
  getSavingsRate,            // Get savings rate percentage
  hasSavingsReport           // Check if data exists
} = useCalculator();
```

### For FI Calculators
- Current net worth = getTotalSavings()
- Annual savings = getTotalMonthlyContribution() * 12
- Savings rate = getSavingsRate() (as percentage)

## Icelandic Terminology

| English | Icelandic |
|---------|-----------|
| Savings Report | Sparnaðarskýrsla |
| Emergency Fund | Neyðarsjóður |
| Short-term Savings | Skammtímasparnaður |
| Long-term Savings | Langtímasparnaður |
| Investments | Fjárfestingar |
| Pension/Retirement | Lífeyrissjóður |
| Special Purpose | Sérstakur sjóður |
| Other | Annað |
| Current balance | Núverandi staða |
| Monthly contributions | Mánaðarleg framlög |
| Target | Markmið |
| Notes | Athugasemdir |
| Savings rate | Sparnaðarhlutfall |
| Life energy | Lífsorka |
| Progress | Framvinda |
| Remaining | Á eftir |
| Expand all | Opna alla |
| Collapse all | Loka öllum |
| Hidden categories | Faldir flokkar |
| Hide category | Fela flokk |
| Show category | Sýna flokk |

## Accessibility

All components follow WCAG 2.1 AA standards:
- Proper labels with htmlFor attributes
- ARIA attributes (aria-label, aria-expanded, aria-controls, aria-describedby)
- Keyboard navigation support
- Screen reader friendly
- Proper focus indicators
- Color contrast meets standards
- Progress bars with role="progressbar" and aria-valuenow

## Privacy

All data stored client-side only:
- LocalStorage with 500ms debounce
- No data sent to servers
- Export/import for user data portability
- Included in full app data export/import

## Implementation Notes

### Epic 3 Completion (2026-01-26)
- All 6 editor UI components implemented
- 716 lines of production code
- Full TypeScript type safety
- Build successful with 0 errors
- All text in Icelandic
- Full accessibility implementation
- Life energy integration throughout
- Progress tracking with visual feedback
- Responsive design patterns followed
- Integration with existing CalculatorContext patterns

## Next Steps

1. **Epic 4: Dashboard UI** (5-7 hours)
   - SavingsDashboard container
   - QuickStats cards (4 stat cards)
   - CategoryBreakdownChart (pie/donut chart)
   - SavingsProgressList (progress cards)
   - SavingsRateInsights (contextual information)

2. **Epic 5: Main Component and Integration** (4-5 hours)
   - SavingsReportCalculator main component
   - View mode toggle (dashboard/editor)
   - Educational intro section
   - Route page at /sparnadarskyrsla
   - Navigation integration

3. **Epic 6: Testing and QA** (5-6 hours)
   - Component tests for Editor UI
   - Integration tests with CalculatorContext
   - Accessibility audit
   - Final QA pass

## Related Documentation

- Requirements: specs/savings-report/requirements-savings-report.md
- Design: specs/savings-report/design-savings-report.md
- Tasks: specs/savings-report/tasks-savings-report.md
- Implementation Status: context/IMPLEMENTATION_STATUS.md
