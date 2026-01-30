# Requirements: FIRE Type Explorer

## Overview

**Feature**: FIRE Type Explorer (FIRE Leiðarvísir)
**Category**: FIRE Strategy Calculator (2.2.x)
**Dependencies**: FI Number Calculator, Savings Rate Calculator, Expense Baseline Tool

## Problem Statement

Users exploring financial independence need to understand the different FIRE approaches, but many don't realize there are multiple paths to FIRE beyond the traditional "save 25x expenses and retire" model. Without clear understanding of FIRE types:
1. Users may pursue an unnecessarily extreme savings path (LeanFIRE) when alternatives exist
2. They miss opportunities like CoastFIRE or BaristaFIRE that could improve quality of life today
3. They can't compare trade-offs between different FIRE strategies
4. They don't see personalized recommendations based on their actual numbers

The FIRE Type Explorer provides a side-by-side comparison of different FIRE paths with personalized calculations, helping users choose the strategy that fits their lifestyle and goals.

## User Stories

### US-1: Understand Different FIRE Types
**As a** user exploring financial independence
**I want to** see clear definitions and comparisons of different FIRE types
**So that** I can understand which approach fits my goals and lifestyle

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens FIRE Type Explorer, the system SHALL display definitions of all FIRE types (LeanFIRE, RegularFIRE, CoastFIRE, BaristaFIRE, FatFIRE)
- WHEN viewing each FIRE type, the system SHALL show key characteristics, target audience, and lifestyle implications
- WHERE the user has expense baseline data, the system SHALL show personalized target numbers for each FIRE type
- IF the user has not set up expense baseline, the system SHALL prompt them to do so first

### US-2: Compare FIRE Types Side-by-Side
**As a** user evaluating FIRE strategies
**I want to** see all FIRE types compared in a table or grid
**So that** I can easily spot differences and trade-offs

**Acceptance Criteria (EARS Format)**:
- WHEN viewing the comparison, the system SHALL display all FIRE types in a comparable format
- WHEN displaying each type, the system SHALL show: target nest egg, monthly expenses, required savings rate, years to FIRE
- WHEN the user has actual data (income, savings, expenses), the system SHALL calculate personalized timelines
- WHERE calculations require missing data, the system SHALL show which inputs are needed

### US-3: Toggle Between Scenarios
**As a** user with different expense tiers
**I want to** toggle between my barebones, comfortable, and deluxe expense scenarios
**So that** I can see how FIRE numbers change with lifestyle choices

**Acceptance Criteria (EARS Format)**:
- WHEN expense baseline exists with three tiers, the system SHALL allow toggling between scenarios
- WHEN switching tiers, the system SHALL recalculate all FIRE type numbers instantly
- WHEN displaying results, the system SHALL highlight which tier is active
- IF only one tier has data, the system SHALL use that tier without toggle

### US-4: Get Personalized Recommendations
**As a** user with actual financial data
**I want to** see which FIRE type is recommended for my situation
**So that** I can make an informed decision about my FIRE path

**Acceptance Criteria (EARS Format)**:
- WHEN all required data is available (income, expenses, savings, age), the system SHALL provide a recommendation
- WHEN calculating recommendations, the system SHALL consider: current age, desired retirement age, savings rate, lifestyle preferences
- WHEN displaying recommendations, the system SHALL explain the rationale for each suggestion
- WHERE multiple FIRE types are feasible, the system SHALL rank them with pros/cons

### US-5: Visualize FIRE Path Timelines
**As a** visual learner
**I want to** see a timeline showing when I'd reach each FIRE type
**So that** I can understand the progression and milestones

**Acceptance Criteria (EARS Format)**:
- WHEN calculations are complete, the system SHALL display a visual timeline
- WHEN showing the timeline, the system SHALL mark: current position, CoastFIRE point, BaristaFIRE point, full FIRE point
- WHEN hovering over milestones, the system SHALL show details (age, year, nest egg size)
- IF timeline exceeds 30 years, the system SHALL suggest adjustments

### US-6: Understand Trade-offs
**As a** user choosing a FIRE strategy
**I want to** see the trade-offs between savings effort and time to FIRE
**So that** I can make conscious lifestyle decisions

**Acceptance Criteria (EARS Format)**:
- WHEN viewing each FIRE type, the system SHALL show effort level (savings rate required)
- WHEN comparing types, the system SHALL show time trade-offs (years to reach each)
- WHEN displaying trade-offs, the system SHALL include quality-of-life considerations
- WHERE BaristaFIRE or CoastFIRE is shown, the system SHALL clarify part-time work requirements

## Functional Requirements

### FR-1: FIRE Type Definitions

- FR-1.1: Support five FIRE types with Icelandic names:
  - **LeanFIRE** (Sparsamt FIRE): Minimal expenses, extreme savings
  - **RegularFIRE** (Venjulegt FIRE): Standard 25x rule with comfortable lifestyle
  - **CoastFIRE** (Sjálfvirkt FIRE): Save enough early, let compound growth finish the job
  - **BaristaFIRE** (Hálfstöðvar FIRE): Partial FI + part-time work covers shortfall
  - **FatFIRE** (Lúxus FIRE): Luxurious lifestyle in retirement

- FR-1.2: Each FIRE type SHALL include:
  - Icelandic name and English term
  - Clear definition (1-2 sentences)
  - Target nest egg calculation
  - Monthly expense level
  - Required savings rate
  - Pros and cons
  - Ideal candidate profile
  - Common misconceptions

### FR-2: FIRE Type Calculations

- FR-2.1: **LeanFIRE**: 25x barebones annual expenses
  - Example: 250,000 kr/month × 12 × 25 = 75,000,000 kr

- FR-2.2: **RegularFIRE**: 25x comfortable annual expenses
  - Example: 520,000 kr/month × 12 × 25 = 156,000,000 kr

- FR-2.3: **FatFIRE**: 25x deluxe annual expenses
  - Example: 1,000,000 kr/month × 12 × 25 = 300,000,000 kr

- FR-2.4: **CoastFIRE**: Amount needed today to grow to FI Number by target age
  - Formula: FI_Number / (1 + growth_rate)^years_remaining
  - Assumes 6% real annual returns (default, user-adjustable)

- FR-2.5: **BaristaFIRE**: Partial FI where part-time work covers living expenses
  - Target: 50-70% of full FIRE number (user-configurable percentage)
  - Part-time income required: Monthly expenses - (Portfolio × 4% / 12)

- FR-2.6: All calculations SHALL:
  - Use 4% safe withdrawal rate (user-adjustable)
  - Account for Icelandic tax implications (optional toggle)
  - Support custom growth rate assumptions
  - Respect user's target retirement age

### FR-3: Comparison Display

- FR-3.1: Side-by-side comparison table with columns:
  - FIRE Type name
  - Target nest egg
  - Monthly expenses supported
  - Required savings rate (based on current income)
  - Years to reach (based on current savings + savings rate)
  - Lifestyle description

- FR-3.2: Visual indicators:
  - Effort level (low/medium/high) for savings requirement
  - Timeline visualization (color-coded by difficulty)
  - Feasibility indicator (realistic/challenging/extreme)

- FR-3.3: Toggle controls:
  - Expense tier selector (if baseline has multiple tiers)
  - Growth rate adjuster (4-8%)
  - Withdrawal rate adjuster (3-5%)
  - Target retirement age selector

### FR-4: Personalized Recommendations

- FR-4.1: Recommendation engine considers:
  - Current age
  - Current net worth
  - Monthly savings capacity
  - Target retirement age
  - Selected expense tier
  - Risk tolerance (inferred from choices)

- FR-4.2: Recommendation logic:
  - **CoastFIRE**: If user is young (<35) with decent nest egg already
  - **BaristaFIRE**: If user enjoys work but wants reduced stress
  - **RegularFIRE**: If user has moderate savings rate (20-40%)
  - **LeanFIRE**: If user has low expenses and high savings rate (>50%)
  - **FatFIRE**: If user has high income and wants luxurious retirement

- FR-4.3: For each recommended type, provide:
  - Reasoning (why this fits the user)
  - Action steps (what to do next)
  - Timeline estimate (when they'd reach it)
  - Potential obstacles (what could go wrong)

### FR-5: Timeline Visualization

- FR-5.1: Display horizontal timeline showing:
  - Current position (today)
  - CoastFIRE milestone (when can stop contributing)
  - BaristaFIRE milestone (when can work part-time)
  - RegularFIRE milestone (full independence)
  - FatFIRE milestone (luxurious independence)

- FR-5.2: Timeline features:
  - Interactive hover for details
  - Age labels at each milestone
  - Years remaining count
  - Nest egg size at each point

- FR-5.3: Responsive design:
  - Horizontal on desktop
  - Vertical on mobile
  - Scrollable if many milestones

### FR-6: Educational Content

- FR-6.1: For each FIRE type, provide:
  - Detailed explanation (collapsible section)
  - Real-world example scenario (Icelandic context)
  - Common pitfalls to avoid
  - Resources for further learning

- FR-6.2: Glossary of terms:
  - Safe withdrawal rate (SWR)
  - Sequence of returns risk
  - Coast point
  - Barista work
  - Geographic arbitrage

- FR-6.3: FAQ section:
  - "Which FIRE type is best?"
  - "Can I switch FIRE types?"
  - "What if I don't reach FIRE by target age?"
  - "How does inflation affect these numbers?"

### FR-7: Integration with Other Calculators

- FR-7.1: Pull data from:
  - Expense Baseline Tool (three-tier expenses)
  - FI Number Calculator (target nest egg)
  - Savings Rate Calculator (current savings rate)
  - Actual Hourly Wage (for BaristaFIRE part-time calculations)

- FR-7.2: Link to related calculators:
  - "Adjust your expense baseline" button
  - "Calculate detailed FI Number" button
  - "Improve your savings rate" button

- FR-7.3: Save FIRE type preference:
  - User can mark preferred FIRE type
  - Other calculators can reference preference
  - Show progress toward chosen FIRE type

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 50ms
- Timeline rendering shall complete in < 200ms
- Tier toggling shall feel instant (<100ms)

### NFR-2: Usability
- All FIRE type names in Icelandic with English terms shown
- Clear visual distinction between FIRE types (icons, colors)
- Comparison table readable at a glance
- Mobile-responsive design (table converts to cards)
- Tooltips for unfamiliar terms

### NFR-3: Accessibility
- All interactive elements keyboard accessible
- ARIA labels for comparison table
- Color coding supplemented with icons/patterns
- Screen reader friendly explanations
- High contrast mode support

### NFR-4: Educational Quality
- Definitions must be accurate and cite sources where appropriate
- Examples must use realistic Icelandic scenarios
- No financial advice disclaimers where needed
- Balanced presentation (no bias toward one FIRE type)

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Examples use Icelandic cost of living
- Consider Icelandic pension system (optional addon)
- Reference Icelandic tax rates where relevant

## Constraints

- Must integrate with existing CalculatorContext
- Must use expense baseline data (if available)
- Must work without user account (privacy-first)
- Must handle missing data gracefully (show what's needed)
- Must not provide personalized financial advice (educational only)

## Out of Scope

- Detailed investment strategy recommendations
- Monte Carlo simulations (future feature)
- International FIRE scenarios (Geo-arbitrage)
- Tax optimization strategies
- Asset allocation recommendations
- Specific investment product suggestions

## Success Criteria

1. User can understand all five FIRE types within 5 minutes
2. Comparison table clearly shows trade-offs
3. Personalized recommendations help decision-making
4. Timeline visualization makes progress tangible
5. Users can confidently choose a FIRE path

## Glossary

| Term | Icelandic | Definition |
|------|-----------|------------|
| FIRE | FIRE (Fjármálafrelsi, Snemmbúinn Starfslok) | Financial Independence, Retire Early movement |
| LeanFIRE | Sparsamt FIRE | FIRE with minimal expenses (barebones lifestyle) |
| RegularFIRE | Venjulegt FIRE | Traditional FIRE with comfortable lifestyle |
| FatFIRE | Lúxus FIRE | FIRE with luxurious lifestyle and high expenses |
| CoastFIRE | Sjálfvirkt FIRE | Save early, then let growth finish the job |
| BaristaFIRE | Hálfstöðvar FIRE | Partial FI with part-time work covering expenses |
| Safe Withdrawal Rate (SWR) | Öruggt úttektarhlutfall | Percentage of portfolio you can withdraw annually (typically 4%) |
| FI Number | FI Tala | Target nest egg for financial independence |
| Coast Point | Sjálfvirk tímamörk | When you can stop saving and let growth finish |
| Barista Work | Hálfstöðvar vinna | Part-time work to cover partial expenses |

## FIRE Type Comparison (Default Assumptions)

| FIRE Type | Monthly Expenses | Target Nest Egg | Savings Rate | Timeline (40yr old, 500k income) |
|-----------|------------------|-----------------|--------------|----------------------------------|
| LeanFIRE | 250,000 kr | 75,000,000 kr | 50%+ | 10-12 years |
| RegularFIRE | 520,000 kr | 156,000,000 kr | 35-40% | 15-18 years |
| CoastFIRE | 520,000 kr (at 67) | ~50,000,000 kr (today) | 0% (after coast point) | Already coasting if met |
| BaristaFIRE | 520,000 kr | ~90,000,000 kr (60% of full) | 25-30% | 12-15 years + part-time |
| FatFIRE | 1,000,000 kr | 300,000,000 kr | 50%+ | 20-25 years |

## Default Calculation Assumptions

- **Safe Withdrawal Rate**: 4% (adjustable 3-5%)
- **Real Investment Returns**: 6% annually (adjustable 4-8%)
- **Inflation**: Already accounted for in "real returns"
- **Tax**: Optional toggle (assumes tax-advantaged accounts)
- **Target Retirement Age**: User-defined (default: 67 for Iceland)
- **CoastFIRE Growth Period**: From today until retirement age
- **BaristaFIRE Coverage**: Part-time work covers 40-50% of expenses

## Edge Cases to Handle

1. **No Expense Baseline**: Show example scenarios only, prompt to create baseline
2. **Unrealistic Goals**: Warn if LeanFIRE requires >70% savings rate
3. **Already FI**: Celebrate and show achieved FIRE types
4. **Negative Savings**: Cannot calculate timelines, suggest debt reduction first
5. **Very Young Users**: CoastFIRE highly favorable, emphasize compound growth
6. **Near Retirement**: Adjust expectations, focus on feasible targets
7. **High Debt**: Consider debt payoff in FIRE calculations
8. **Single Income vs Dual Income**: Recommendations differ based on household structure

## Data Dependencies

**Required from CalculatorContext**:
- `expenseBaseline` (three-tier expenses)
- `results.actualHourlyWage` (for BaristaFIRE)
- User age (if tracked)
- Current net worth (if tracked)
- Monthly income (if tracked)

**Optional Enhancements**:
- Target retirement age
- Risk tolerance
- Current savings rate
- Investment growth assumptions

## Privacy Considerations

- All calculations client-side only
- No data sent to servers
- No financial advice provided (educational tool only)
- Clear disclaimer about assumptions and limitations
- User can export/import their scenarios
