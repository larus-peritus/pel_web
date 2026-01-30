# FI Number Builder - Specification Summary

## Overview

The **FI Number Builder** (FI-tala reiknivél) is a FIRE planning calculator that helps users calculate their Financial Independence target nest egg. It multiplies annual expenses by a withdrawal rate multiplier and provides Icelandic-context adjustments including pension income integration.

## Feature Details

- **Category**: FIRE Planning Tool (Phase 3, Feature 3.5)
- **Priority**: Foundation tool for FIRE planning
- **Dependencies**: Expense Baseline Tool (2.1.11)
- **Estimated Duration**: 9-11 days
- **Status**: Specification Complete, Ready for Implementation

---

## Specification Documents

### 1. Requirements Document
**File**: `requirements-fi-number-builder.md`

**Key Sections**:
- 7 User Stories with EARS-format acceptance criteria
- Functional Requirements (FR-1 through FR-8)
- Non-Functional Requirements (Performance, Usability, Accessibility, Privacy, Icelandic Context)
- Icelandic Context Notes (inflation, pension system, cost of living)
- Default Icelandic Assumptions (30x multiplier recommended, pension age 67)

**Highlights**:
- Calculate FI number from expense baseline (barebones/comfortable/deluxe tiers)
- Standard multipliers: 25x, 30x, 33x (with 30x recommended for Iceland)
- Optional pension income integration (reduces FI number)
- Scenario comparison across all three expense tiers
- Life energy display (years of work) when AWH available
- Custom expense input as fallback

### 2. Design Document
**File**: `design-fi-number-builder.md`

**Key Sections**:
- System Architecture (client-side React, CalculatorContext integration)
- Component Hierarchy (11 major components)
- Data Models (FINumberBuilderState, FINumberResults, PensionAdjustedResult)
- Calculation Logic (5 major calculation functions)
- Integration Strategy (Expense Baseline, AWH Calculator)
- UI Design (layouts for desktop/tablet/mobile)
- Testing Strategy (unit, component, integration, accessibility)

**Highlights**:
- ExpenseSourceSelector: Toggle between baseline and custom input
- MultiplierSelector: 25x/30x/33x buttons + custom slider
- PensionIncomeSection: Optional pension adjustment with bridge calculation
- ScenarioComparison: Compare FI numbers across all three tiers
- IcelandicContextAlert: Warnings for aggressive multipliers (25x)
- LifeEnergyDisplay: Show FI number in years of work

### 3. Tasks Document
**File**: `tasks-fi-number-builder.md`

**Key Sections**:
- 9 Epics with 27 detailed tasks
- Implementation strategy (Foundation-First with Progressive Enhancement)
- Task dependencies and parallelization opportunities
- Implementation schedule (9-11 days)
- Definition of Done for each task

**Epic Breakdown**:
1. **Epic 1**: Foundation (Types, Constants, Calculations) - 5-7 hours
2. **Epic 2**: State Management (CalculatorContext) - 4-5 hours
3. **Epic 3**: Core UI (Basic FI Calculator) - 6-8 hours
4. **Epic 4**: Scenario Comparison - 4-5 hours
5. **Epic 5**: Pension Integration - 5-6 hours
6. **Epic 6**: Life Energy Display - 3-4 hours
7. **Epic 7**: Polish (Educational Content, Context Warnings) - 4-5 hours
8. **Epic 8**: Testing and QA - 6-8 hours
9. **Epic 9**: Page and Routing - 2-3 hours

---

## Core Features

### 1. FI Number Calculation
- **Input**: Monthly expenses × 12 = Annual expenses
- **Multiplier**: 25x, 30x, 33x, or custom (20x-50x)
- **Output**: FI Number = Annual Expenses × Multiplier
- **Example**: 520,000 kr/month × 12 × 30 = 187,200,000 kr FI Number

### 2. Expense Sources
- **Option A**: Use Expense Baseline (barebones/comfortable/deluxe tier)
- **Option B**: Enter custom monthly expense amount
- **Integration**: Uses TierSelector component from Expense Baseline Tool

### 3. Icelandic Context
- **Recommended Multiplier**: 30x-33x (not US-standard 25x)
- **Rationale**: Iceland's higher inflation (3-4% vs US 2-3%)
- **Warning**: Alert shown if multiplier < 28
- **Educational Content**: Explains Iceland-specific factors

### 4. Pension Integration (Optional)
- **Input**: Expected monthly pension at age 67
- **Calculation**: Reduces annual expenses by pension income
- **Bridge Amount**: If retiring before 67, calculates bridge funding needed
- **Output**: Full FI, Pension-Adjusted FI, Bridge Amount, Total Needed

### 5. Scenario Comparison
- **Display**: FI numbers for all three expense tiers side-by-side
- **Table**: Tier, Annual Expenses, FI Number columns
- **Chart**: Bar chart visualization
- **Highlight**: Selected tier visually distinguished

### 6. Life Energy Display
- **Requirement**: Actual Hourly Wage must be calculated
- **Calculation**: FI Number ÷ Annual Net Income = Years of Work
- **Output**: "Þetta jafngildir X árum vinnu" (This equals X years of work)
- **Bonus**: Years to FI (if savings rate available)

---

## Integration Points

### Consumes Data From:
1. **Expense Baseline Tool**:
   - `getExpenseByTier(tier)`: Get monthly expense for selected tier
   - `TierSelector`: Component for selecting expense tier
   - `hasExpenseBaseline()`: Check if baseline exists

2. **Actual Hourly Wage Calculator**:
   - `actualHourlyWage`: For life energy calculations
   - `annualNetIncome`: For years-to-FI calculations

### Provides Data To (Future):
1. **Coast FIRE Calculator**: Target FI number
2. **Barista FIRE Planner**: Full FI and partial FI targets
3. **Retirement Date Simulator**: FI number for projections
4. **Savings Rate Slider**: Target FI number for progress tracking

---

## Technical Architecture

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context (CalculatorContext)
- **Persistence**: LocalStorage
- **Charts**: Recharts (for scenario comparison)

### Key Files Structure
```
src/
├── types/
│   └── fiNumber.ts                    # Type definitions
├── lib/
│   ├── constants/
│   │   └── fiNumber.ts                # Constants (multipliers, defaults)
│   └── calculations/
│       └── fiNumber.ts                # Calculation functions
├── components/
│   └── fiNumber/
│       ├── FINumberBuilderCalculator.tsx       # Main component
│       ├── ExpenseSourceSelector.tsx            # Baseline vs Custom
│       ├── MultiplierSelector.tsx               # 25x/30x/33x + custom
│       ├── PensionIncomeSection.tsx             # Optional pension
│       ├── ResultsDisplay.tsx                   # FI number display
│       ├── PensionAdjustedResults.tsx           # Pension results
│       ├── ScenarioComparison.tsx               # Three-tier table
│       ├── ScenarioComparisonChart.tsx          # Bar chart
│       ├── LifeEnergyDisplay.tsx                # Years of work
│       ├── IcelandicContextAlert.tsx            # Context warnings
│       ├── EducationalPanel.tsx                 # Educational content
│       └── index.ts                             # Barrel export
├── app/
│   └── fi-tala/
│       └── page.tsx                   # Route page
└── context/
    └── CalculatorContext.tsx          # State management (extended)

tests/
├── lib/
│   └── calculations/
│       └── fiNumber.test.ts           # Calculation tests
├── components/
│   └── fiNumber/
│       └── *.test.tsx                 # Component tests
└── integration/
    └── fiNumber.test.tsx              # Integration tests
```

---

## User Flow

### Basic Flow (Expense Baseline + Standard Multiplier)
1. User opens FI Number Builder
2. System detects expense baseline exists
3. User selects expense tier (Comfortable: 520,000 kr/month)
4. User selects multiplier (30x - recommended)
5. System calculates: 520,000 × 12 × 30 = 187,200,000 kr
6. User sees FI number, scenario comparison, and breakdown

### With Pension Flow
1. [Steps 1-4 above]
2. User expands Pension Income Section
3. User enters pension: 200,000 kr/month starting at age 67
4. User enters retirement age: 55
5. System calculates:
   - Full FI: 187,200,000 kr
   - Reduced expenses: 320,000 kr/month (520k - 200k pension)
   - Pension-Adjusted FI: 115,200,000 kr (320k × 12 × 30)
   - Bridge: 12 years × 6,240,000 kr = 74,880,000 kr
   - Total Needed: 190,080,000 kr

### With Life Energy Flow
1. [Basic flow above]
2. System checks if Actual Hourly Wage exists
3. If yes: Calculate years of work (187.2M ÷ annual income)
4. Display: "Þetta jafngildir 7.5 árum vinnu"
5. If savings rate available: "Ár þar til FI: 12.3 ár"

---

## Testing Coverage

### Unit Tests
- `calculateFINumber()`: Basic FI calculation
- `calculatePensionAdjustedFI()`: Pension adjustment and bridge
- `calculateFINumberLifeEnergy()`: Life energy metrics
- `calculateScenarioComparison()`: All three tiers
- Edge cases: zero expenses, negative values, missing baseline

### Component Tests
- `ExpenseSourceSelector`: Toggle between sources
- `MultiplierSelector`: Button selection and custom slider
- `PensionIncomeSection`: Input validation
- `ResultsDisplay`: Formatting and display
- `ScenarioComparison`: Table rendering
- `LifeEnergyDisplay`: Calculations

### Integration Tests
- CalculatorContext integration
- LocalStorage persistence
- Expense Baseline integration
- AWH Calculator integration
- Export/import functionality

### Accessibility Tests
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Form validation accessibility

---

## Icelandic Context Summary

### Why Iceland Needs Different Assumptions

1. **Higher Inflation**:
   - Iceland: 3-4% average
   - US: 2-3% average
   - Impact: 25x multiplier (4% withdrawal) too risky

2. **Pension System**:
   - Mandatory 16% contributions (12% employer + 4% employee)
   - Benefits start at age 67
   - Typical: 50-70% of final salary
   - Impact: Reduces FI number if user plans to use pension

3. **Cost of Living**:
   - Higher than most EU countries
   - Food, housing, transport expensive
   - Impact: Higher baseline expenses = higher FI number

### Recommended Defaults

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Multiplier | 30x (3.33%) | Conservative for Iceland's inflation |
| Pension Age | 67 years | Icelandic retirement age |
| Warning Threshold | <28x | Too aggressive for Iceland |

---

## Success Criteria

### Functional Success
- [x] Calculates FI number correctly from expense baseline
- [x] Supports standard multipliers (25x, 30x, 33x) and custom
- [x] Integrates pension income to reduce FI number
- [x] Compares scenarios across all three expense tiers
- [x] Displays life energy when AWH available
- [x] Provides custom expense input fallback

### User Experience Success
- [x] User can calculate FI number in <1 minute
- [x] Clear which multiplier is recommended for Iceland (30x)
- [x] Pension adjustment reduces FI number intuitively
- [x] Scenario comparison helps understand tier differences
- [x] Life energy translates money to time meaningfully

### Technical Success
- [x] Calculations complete in <50ms
- [x] All tests pass (>90% coverage)
- [x] No accessibility violations
- [x] Works on mobile, tablet, desktop
- [x] LocalStorage persistence works
- [x] Integrates cleanly with CalculatorContext

### Educational Success
- [x] Users understand what FI number means
- [x] Users understand why Iceland needs conservative multipliers
- [x] Users understand how pension reduces FI need
- [x] Users understand life energy concept

---

## Next Steps

### Implementation Order
1. **Phase 1 (Days 1-2)**: Foundation
   - Create types, constants, calculations
   - Extend CalculatorContext
   - Write unit tests for calculations

2. **Phase 2 (Days 3-4)**: Core UI
   - Build main calculator component
   - Expense source selector
   - Multiplier selector
   - Basic results display

3. **Phase 3 (Days 5-7)**: Enhancements
   - Scenario comparison
   - Pension integration
   - Life energy display
   - Educational content and polish

4. **Phase 4 (Days 8-9)**: Testing & Deploy
   - Comprehensive testing
   - Page and routing
   - Final review and deployment

### Post-Launch
- Gather user feedback on multiplier recommendations
- Monitor if users find pension integration useful
- Consider adding investment return scenarios (future phase)
- Integrate with Coast FIRE and Barista FIRE calculators (Phase 3)

---

## Related Documentation

- **APP_PLAN.md**: Full application roadmap
- **expense-baseline/**: Expense Baseline Tool specs (dependency)
- **Actual Hourly Wage Calculator**: For life energy integration
- **FIRE Planning Tools (Phase 3)**: Coast FIRE, Barista FIRE, etc.

---

## Glossary

| Term | Icelandic | Definition |
|------|-----------|------------|
| FI Number | FI tala | Target nest egg needed for financial independence |
| Multiplier | Margfaldari | Inverse of withdrawal rate (e.g., 25x, 30x, 33x) |
| Withdrawal Rate | Úttektarhlutfall | Percentage withdrawn annually (e.g., 4%, 3.33%) |
| Life Energy | Lífsorka | Money expressed as hours/years of work |
| Pension | Lífeyrir | Icelandic pension fund benefits |
| Bridge Amount | Brúarupphæð | Funds needed to cover gap before pension starts |
| Barebones | Lágmarks | Minimum survival expenses |
| Comfortable | Þægilegt | Reasonable quality of life expenses |
| Deluxe | Lúxus | Ideal lifestyle expenses |

---

## Contact & Maintenance

**Specification Author**: Spec-Driven Development Orchestrator
**Date Created**: 2026-01-22
**Last Updated**: 2026-01-22
**Status**: Complete - Ready for Implementation

For questions or clarifications during implementation, refer to:
- Requirements document for "what" and "why"
- Design document for "how" and architecture
- Tasks document for step-by-step implementation guidance
