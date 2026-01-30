# Requirements: FI Number Builder

## Overview

**Feature**: FI Number Builder (FI-tala reiknivél)
**Category**: FIRE Planning Tool (3.5)
**Dependencies**: Expense Baseline Tool (2.1.11)

## Problem Statement

Users pursuing Financial Independence (FI) need to calculate their target nest egg, but most FIRE calculators use generic US-based assumptions (4% withdrawal rule) that don't account for:
1. Icelandic-specific factors (higher inflation, lífeyrissjóður/pension funds)
2. Different lifestyle spending levels (barebones vs comfortable vs ideal)
3. Various FI multipliers (25x, 30x, custom)
4. Scenario comparison and sensitivity analysis

The FI Number Builder calculates a user's target nest egg by taking their desired annual expenses and multiplying by a withdrawal rate multiplier, with Icelandic context and integration with the Expense Baseline Tool.

## User Stories

### US-1: Calculate FI Number from Expense Baseline
**As a** user planning for financial independence
**I want to** calculate my FI number using my expense baseline
**So that** I know how much I need to save before achieving FI

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the FI Number Builder, the system SHALL check if an expense baseline exists
- IF an expense baseline exists, the system SHALL offer to use barebones, comfortable, or deluxe tier expenses
- WHEN the user selects a tier, the system SHALL calculate the FI number using annual expenses × multiplier
- WHEN displaying the FI number, the system SHALL show monthly and annual expenses, multiplier used, and resulting FI number

### US-2: Use Standard FI Multipliers
**As a** user familiar with FIRE concepts
**I want to** choose from standard FI multipliers (25x, 30x, 33x)
**So that** I can quickly calculate conservative or aggressive FI numbers

**Acceptance Criteria (EARS Format)**:
- WHEN viewing multiplier options, the system SHALL display 25x (4% rule), 30x (3.33% rule), 33x (3% rule), and custom
- WHEN the user selects a standard multiplier, the system SHALL explain the withdrawal rate and safety level
- WHERE standard multipliers are shown, the system SHALL indicate which is recommended for Iceland (30x or 33x)
- WHEN calculating with 25x, the system SHALL warn that Iceland's higher inflation may make this risky

### US-3: Adjust for Icelandic Context
**As a** user living in Iceland
**I want to** see FI calculations adjusted for Icelandic inflation and pension system
**So that** my FI number is realistic for Iceland

**Acceptance Criteria (EARS Format)**:
- WHEN displaying recommendations, the system SHALL explain Iceland's historically higher inflation
- WHEN showing withdrawal rates, the system SHALL recommend 3-3.33% withdrawal rate (30x-33x multiplier) for Iceland
- IF the user has a lífeyrissjóður (pension fund), the system SHALL allow entering expected pension income
- WHEN pension income is entered, the system SHALL reduce required nest egg accordingly

### US-4: Compare Multiple Scenarios
**As a** user planning my FI strategy
**I want to** compare FI numbers across different expense tiers and multipliers
**So that** I can see the range of possibilities

**Acceptance Criteria (EARS Format)**:
- WHEN viewing scenario comparison, the system SHALL show FI numbers for all three expense tiers (barebones, comfortable, deluxe)
- WHEN multipliers are changed, the system SHALL update all three tier calculations simultaneously
- WHERE scenarios are displayed, the system SHALL show the difference between tiers in ISK and life energy hours
- WHEN comparing scenarios, the system SHALL highlight which tier the user has selected as their target

### US-5: See FI Number in Life Energy Terms
**As a** user who thinks in terms of life energy
**I want to** see my FI number expressed in years of work
**So that** I understand what achieving FI means in time terms

**Acceptance Criteria (EARS Format)**:
- WHEN the actual hourly wage is available, the system SHALL display how many years of work the FI number represents
- WHEN showing years to FI, the system SHALL assume current savings rate and annual contributions
- IF savings rate is not set, the system SHALL prompt user to estimate or link to Savings Rate calculator
- WHERE life energy is displayed, the system SHALL show both "years already worked" and "years remaining"

### US-6: Enter Custom Expense Amount
**As a** user who hasn't set up expense baseline OR wants to experiment
**I want to** enter a custom monthly expense amount
**So that** I can calculate FI number without completing the baseline

**Acceptance Criteria (EARS Format)**:
- WHEN no expense baseline exists, the system SHALL allow entering a custom monthly expense amount
- WHEN entering custom expenses, the system SHALL validate that amount is positive and reasonable (< 10M ISK/month)
- WHERE custom amount is used, the system SHALL indicate this is not from the expense baseline
- WHEN a custom amount is entered, the system SHALL still allow toggling to expense baseline if it exists

### US-7: Adjust for Pension Income
**As a** user with Icelandic pension fund (lífeyrissjóður) contributions
**I want to** factor in expected pension income
**So that** my FI number reflects the partial support from pension

**Acceptance Criteria (EARS Format)**:
- WHEN entering pension data, the system SHALL accept expected monthly pension amount starting at age 67
- WHEN pension income is entered, the system SHALL calculate reduced annual expenses (actual expenses - pension income)
- WHERE pension adjustment is shown, the system SHALL display two FI numbers: "Full FI" and "Pension-Adjusted FI"
- IF retirement age is before 67, the system SHALL calculate bridge amount needed until pension starts

## Functional Requirements

### FR-1: FI Number Calculation
- FR-1.1: Calculate FI Number = Annual Expenses × Multiplier
- FR-1.2: Support standard multipliers: 25x, 30x, 33x
- FR-1.3: Support custom multiplier range: 20x to 50x
- FR-1.4: Annual expenses calculated as Monthly Expenses × 12
- FR-1.5: Display withdrawal rate percentage alongside multiplier (e.g., 30x = 3.33%)

### FR-2: Expense Source Options
- FR-2.1: Option A: Pull from Expense Baseline (barebones/comfortable/deluxe tier)
- FR-2.2: Option B: Enter custom monthly expense amount
- FR-2.3: Toggle between expense sources without losing data
- FR-2.4: Show which source is currently active

### FR-3: Scenario Comparison
- FR-3.1: Display FI numbers for all three expense tiers simultaneously
- FR-3.2: Allow changing multiplier and update all tiers in real-time
- FR-3.3: Show difference between tiers in ISK and percentage
- FR-3.4: Highlight selected tier visually
- FR-3.5: Display scenarios in a comparison table or card layout

### FR-4: Icelandic Context Adjustments
- FR-4.1: Default multiplier recommendation: 30x (3.33% withdrawal rate)
- FR-4.2: Warning when using 25x multiplier about Iceland's inflation
- FR-4.3: Educational content about Icelandic inflation history
- FR-4.4: Optional pension income input
- FR-4.5: Calculate pension-adjusted FI number when pension income provided

### FR-5: Pension Income Integration
- FR-5.1: Input field for expected monthly pension at age 67
- FR-5.2: Calculate reduced annual expenses (actual - pension × 12)
- FR-5.3: Show two FI numbers: "Full FI" and "Pension-Adjusted FI"
- FR-5.4: If target retirement age < 67, calculate bridge amount needed
- FR-5.5: Display bridge calculation: (67 - retirement age) × annual expenses + pension-adjusted FI

### FR-6: Life Energy Display
- FR-6.1: When AWH available, calculate years of work FI number represents
- FR-6.2: Formula: FI Number ÷ (Annual Net Income)
- FR-6.3: Display as "Þetta jafngildir X árum vinnu" (This equals X years of work)
- FR-6.4: Show years needed to reach FI based on savings rate (if available)

### FR-7: Educational Content
- FR-7.1: Explain what FI Number means
- FR-7.2: Explain 4% rule origin (Trinity Study)
- FR-7.3: Explain why Iceland may need more conservative rate
- FR-7.4: Link to additional resources
- FR-7.5: Tooltip explanations for each multiplier option

### FR-8: Integration with Expense Baseline
- FR-8.1: Auto-detect if expense baseline exists
- FR-8.2: Use TierSelector component from expense baseline
- FR-8.3: Pull expense values via getExpenseByTier() API
- FR-8.4: Show "Set up baseline" prompt if baseline doesn't exist
- FR-8.5: Link to expense baseline calculator

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 50ms
- Multiplier changes shall update UI in < 100ms
- Page shall load in < 2 seconds

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (e.g., 10.500.000 kr)
- Clear visual distinction between Full FI and Pension-Adjusted FI
- Multiplier selection with radio buttons or slider
- Comparison table responsive on mobile (cards stack)

### NFR-3: Accessibility
- All inputs shall have proper labels and aria attributes
- Color-coded tiers consistent with expense baseline
- Keyboard navigation throughout
- Screen reader compatible

### NFR-4: Privacy
- All calculations client-side only
- No data sent to servers
- Pension data stored in localStorage only

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK with proper formatting
- Pension age default: 67 (Icelandic retirement age)
- Recommended multiplier: 30x-33x (not US-standard 25x)
- Educational content about Iceland-specific factors

## Constraints

- Must integrate with existing Expense Baseline Tool
- Must use existing CalculatorContext
- Must follow existing UI component patterns
- Must work without user account (privacy-first)
- Must be in FIRE Planning section of app (Phase 3)

## Out of Scope

- Investment return projections (complex financial advice)
- Tax optimization strategies
- Detailed retirement spending modeling
- Healthcare cost projections
- Social security integration (beyond basic pension)
- Real estate equity calculations

## Success Criteria

1. User can calculate FI number from expense baseline in < 30 seconds
2. Three scenarios (barebones/comfortable/deluxe) compared clearly
3. Icelandic context clearly explained
4. Pension adjustment reduces FI number appropriately
5. Life energy display helps user understand FI in time terms
6. Foundation for other FIRE planning tools (Coast FIRE, Barista FIRE)

## Glossary

| Term | Definition |
|------|------------|
| FI Number | Target nest egg needed for financial independence |
| FI (Financial Independence) | Having enough invested assets to cover living expenses indefinitely |
| Withdrawal Rate | Percentage of nest egg withdrawn annually (e.g., 4%, 3.33%) |
| Multiplier | Inverse of withdrawal rate (e.g., 25x for 4%, 30x for 3.33%) |
| 4% Rule | US-based guideline that 4% withdrawal rate is safe (25x multiplier) |
| Trinity Study | 1998 study establishing the 4% rule |
| Lífeyrissjóður | Icelandic mandatory pension fund |
| Full FI | Nest egg needed without any pension income |
| Pension-Adjusted FI | Reduced nest egg needed when pension income is factored in |
| Bridge Amount | Additional funds needed to cover gap between early retirement and pension start |

## Icelandic Context Notes

### Inflation Considerations
- Iceland's historical inflation: Average 3-4% vs US 2-3%
- More volatile inflation periods in Iceland's history
- Recommendation: 30x-33x multiplier (3-3.33% withdrawal) more conservative

### Pension System (Lífeyrissjóður)
- Mandatory contributions: 12% employer + 4% employee = 16% total
- Benefit starts at age 67
- Typical pension: 50-70% of final salary
- Reduces FI number needed if user plans to work until pension age

### Cost of Living
- Higher than many EU countries
- Food, housing, and transport expensive
- Travel to/from Iceland adds to costs
- Implications: Higher baseline expenses = higher FI number

### Currency Considerations
- ISK is volatile currency
- Some FI seekers hold international investments (EUR, USD)
- Currency risk considerations (out of scope for basic calculator)

## Default Icelandic Assumptions

| Parameter | Default Value | Rationale |
|-----------|---------------|-----------|
| Recommended Multiplier | 30x (3.33%) | Conservative for Iceland's inflation |
| Pension Start Age | 67 years | Icelandic retirement age |
| Typical Pension Rate | 60% of final expenses | Midpoint estimate |
| Warning Threshold | 25x multiplier | Too aggressive for Iceland |

## Integration Points

### From Expense Baseline Tool
- **getExpenseByTier(tier)**: Get monthly expense for selected tier
- **TierSelector**: Component for selecting expense tier
- **BaselinePrompt**: Component if baseline doesn't exist

### From Actual Hourly Wage Calculator
- **actualHourlyWage**: For life energy calculations
- **annualNetIncome**: For years-to-FI calculations

### For Future Calculators
- **FI Number output**: Used by Coast FIRE, Barista FIRE, Savings Rate
- **Target expenses**: Used by retirement planning tools
- **Pension data**: Used by retirement calculators
