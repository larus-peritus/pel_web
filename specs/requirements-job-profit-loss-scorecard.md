# Requirements: Job Profit/Loss Scorecard

## 1. Feature Overview

### 1.1 Purpose
The Job Profit/Loss Scorecard helps users evaluate whether their job is truly profitable after accounting for all work-related costs (money and time). It provides a clear, graded assessment of job profitability expressed in both ISK and life energy terms.

### 1.2 User Need
Users need to see if their job is worth the total investment of time and money after all expenses are deducted. This goes beyond the Actual Hourly Wage Calculator by providing a comprehensive scorecard with actionable insights about net weekly/monthly life energy gains and an overall profitability grade.

### 1.3 Dependencies
- Actual Hourly Wage Calculator (2.3.1 uses its methodology and calculation engine)
- Existing calculation functions (`calculateResults`, `dollarsToLifeEnergy`)
- Existing type system (`CalculatorInputs`, `CalculationResults`)

### 1.4 Icelandic Context
- All currency in ISK (Icelandic króna)
- All text labels in Icelandic
- Realistic Icelandic work patterns (40 hrs/week, 50 weeks/year typical)
- Local expense categories (Strætó for transit, etc.)

### 1.5 Book Reference
Based on "Your Money or Your Life" by Vicki Robin, Chapter 2 methodology, extended with profitability grading system.

---

## 2. User Stories

### US-1: See Net Life Energy Profit/Loss
**As a** FIRE-pursuing worker
**I want to** see my net weekly and monthly "life energy" after all work costs
**So that** I can understand if my job is truly profitable or if I'm working at a loss

**Acceptance Criteria:**
- WHEN calculator has valid inputs THEN system SHALL display net weekly life energy hours
- WHEN calculator has valid inputs THEN system SHALL display net monthly life energy hours
- WHEN net life energy is positive THEN system SHALL show it as profit with success styling
- WHEN net life energy is negative THEN system SHALL show it as loss with warning/error styling
- WHEN net life energy is zero or near-zero THEN system SHALL show it as break-even with neutral styling

### US-2: Understand Job Profitability Grade
**As a** user evaluating my job
**I want to** see a clear profitability grade (A-F) for my job
**So that** I can quickly assess my job's value without analyzing raw numbers

**Acceptance Criteria:**
- WHEN actual hourly wage is calculated THEN system SHALL assign a profitability grade (A, B, C, D, or F)
- WHEN grade is A (excellent) THEN system SHALL show success color and positive message
- WHEN grade is B (good) THEN system SHALL show success color with caution about optimization
- WHEN grade is C (fair) THEN system SHALL show warning color and suggest improvements
- WHEN grade is D (poor) THEN system SHALL show warning color and highlight serious concerns
- WHEN grade is F (loss) THEN system SHALL show error color and indicate job is unprofitable
- WHEN grade is assigned THEN system SHALL display clear explanation of what the grade means

### US-3: View Comprehensive Breakdown
**As a** user analyzing my work profitability
**I want to** see a detailed breakdown of income, expenses, and time costs
**So that** I can identify specific areas where my job is costing me life energy

**Acceptance Criteria:**
- WHEN scorecard is displayed THEN system SHALL show gross annual income
- WHEN scorecard is displayed THEN system SHALL show total annual work expenses
- WHEN scorecard is displayed THEN system SHALL show net annual income (gross - expenses)
- WHEN scorecard is displayed THEN system SHALL show base work hours per year
- WHEN scorecard is displayed THEN system SHALL show extra work-related hours per year
- WHEN scorecard is displayed THEN system SHALL show total annual work hours
- WHEN scorecard is displayed THEN system SHALL show all values in both ISK and life energy hours

### US-4: See Plain Language Summary
**As a** user who may not be financially literate
**I want to** see a plain language explanation of my job profitability
**So that** I can understand the implications without financial jargon

**Acceptance Criteria:**
- WHEN scorecard is displayed THEN system SHALL provide conversational explanation in Icelandic
- WHEN profitability is excellent (A) THEN system SHALL explain user is maximizing value
- WHEN profitability is poor (D/F) THEN system SHALL explain user may be losing money/time
- WHEN profitability is average (B/C) THEN system SHALL suggest optimization opportunities
- WHEN explanation is shown THEN it SHALL use "you/your" pronouns and avoid jargon
- WHEN explanation is shown THEN it SHALL relate findings to life energy and FIRE goals

### US-5: Compare Against Benchmarks
**As a** user evaluating my job
**I want to** see how my job profitability compares to typical benchmarks
**So that** I can understand if my situation is normal or requires attention

**Acceptance Criteria:**
- WHEN profitability grade is calculated THEN system SHALL show threshold percentages for each grade
- WHEN scorecard displays THEN system SHALL indicate what percentage reduction is considered typical (15-30%)
- WHEN user's reduction is extreme (>50%) THEN system SHALL highlight this as unusual
- WHEN user's reduction is minimal (<10%) THEN system SHALL acknowledge this as exceptional

### US-6: Export Scorecard Results
**As a** user tracking my progress over time
**I want to** export my job profitability scorecard
**So that** I can review changes when I adjust my work situation

**Acceptance Criteria:**
- WHEN export button is clicked THEN system SHALL include profitability grade in export
- WHEN export button is clicked THEN system SHALL include net life energy values in export
- WHEN export button is clicked THEN system SHALL include breakdown details in export
- WHEN export is created THEN it SHALL be in JSON format matching existing export structure

---

## 3. Functional Requirements

### FR-1: Net Life Energy Calculation
**WHEN** system has valid calculation results
**THEN** system **SHALL** calculate net weekly life energy as: (net annual income / actual hourly wage) / 52
**AND** system **SHALL** calculate net monthly life energy as: net weekly life energy × 4.33

### FR-2: Profitability Grading System
**WHEN** system calculates actual hourly wage
**THEN** system **SHALL** assign grade based on percentage reduction from nominal wage:
- Grade A: reduction < 15% (Excellent - minimal loss)
- Grade B: reduction 15-30% (Good - typical range)
- Grade C: reduction 30-45% (Fair - optimization needed)
- Grade D: reduction 45-60% (Poor - serious concerns)
- Grade F: reduction > 60% OR actual wage ≤ 0 (Failing - unprofitable)

### FR-3: Scorecard Display Components
**WHEN** scorecard is rendered
**THEN** system **SHALL** display the following sections:
1. Profitability grade with color-coded badge
2. Net life energy profit/loss (weekly and monthly)
3. Income breakdown (gross, expenses, net)
4. Time breakdown (base hours, extra hours, total)
5. Plain language summary
6. Grade explanation

### FR-4: Color Coding System
**WHEN** displaying profitability information
**THEN** system **SHALL** use the following color scheme:
- Success (green): Grades A/B, positive net life energy
- Warning (yellow/orange): Grades C/D
- Error (red): Grade F, negative net life energy
- Neutral (gray): Break-even scenarios

### FR-5: Life Energy Conversion
**WHEN** displaying monetary values in scorecard
**THEN** system **SHALL** convert ISK amounts to life energy hours using actual hourly wage
**AND** system **SHALL** use existing `dollarsToLifeEnergy()` function
**AND** system **SHALL** format time using existing `formatLifeEnergy()` function

### FR-6: Icelandic Localization
**WHEN** scorecard is displayed
**THEN** system **SHALL** use Icelandic text for:
- Grade labels (e.g., "Einkunnir", "Hagnaður", "Tap")
- Section headers
- Plain language explanations
- Time units (tímar, dagar, vikur)

---

## 4. Non-Functional Requirements

### NFR-1: Performance
**WHEN** user views scorecard
**THEN** system **SHALL** render within 100ms
**AND** system **SHALL** use memoized calculations from existing `CalculatorContext`
**AND** system **SHALL NOT** perform redundant calculations

### NFR-2: Usability
**WHEN** scorecard is displayed
**THEN** system **SHALL** be understandable without financial background
**AND** system **SHALL** use plain language throughout
**AND** system **SHALL** provide clear visual hierarchy with grade prominently displayed

### NFR-3: Accessibility
**WHEN** scorecard is rendered
**THEN** system **SHALL** meet WCAG 2.1 AA standards
**AND** system **SHALL** use semantic HTML with proper heading hierarchy
**AND** system **SHALL** provide ARIA labels for color-coded elements
**AND** system **SHALL** ensure color contrast ratios meet accessibility requirements

### NFR-4: Mobile Responsiveness
**WHEN** scorecard is viewed on mobile
**THEN** system **SHALL** stack sections vertically
**AND** system **SHALL** maintain readability with appropriate font sizes
**AND** system **SHALL** ensure touch targets are at least 44x44px

### NFR-5: Data Privacy
**WHEN** scorecard is used
**THEN** system **SHALL NOT** send data to external servers
**AND** system **SHALL** rely entirely on client-side calculations
**AND** system **SHALL** use existing localStorage persistence

### NFR-6: Integration
**WHEN** scorecard component is implemented
**THEN** it **SHALL** integrate with existing `CalculatorContext`
**AND** it **SHALL** use existing calculation functions without modification
**AND** it **SHALL** follow existing component patterns (Card, Alert, Badge)

---

## 5. Business Rules

### BR-1: Grade Threshold Ranges
The profitability grade thresholds are based on typical work-cost patterns from "Your Money or Your Life":
- Most workers see 15-30% reduction (Grade B)
- <15% reduction is exceptional (Grade A)
- >45% reduction indicates serious efficiency issues (Grade D)
- >60% or negative actual wage means job is unprofitable (Grade F)

### BR-2: Break-Even Definition
A job is considered "break-even" when:
- Net annual income is within ±5% of zero, OR
- Actual hourly wage is within ±ISK 100 of zero

### BR-3: Negative Profitability
IF actual hourly wage ≤ 0 THEN job is automatically graded F regardless of percentage reduction.

### BR-4: Time-Only Costs
IF monetary expenses are zero BUT time costs are high THEN grade reflects the time inefficiency through reduced actual hourly wage.

---

## 6. Constraints

### C-1: Technical Constraints
- Must use existing `CalculationResults` type from calculator
- Must integrate with existing `CalculatorContext`
- Must follow existing component architecture (React, TypeScript, Tailwind)
- Must not duplicate calculation logic

### C-2: Design Constraints
- Must use existing design system colors and components
- Must match existing calculator UI patterns
- Must maintain consistency with other calculators

### C-3: Language Constraints
- All user-facing text must be in Icelandic
- Grade letters (A-F) are universal and not translated

---

## 7. Assumptions

### A-1: Calculation Assumptions
- Actual Hourly Wage Calculator is implemented and functioning
- User has entered valid income, expense, and time data
- Calculation results are available in `CalculatorContext`

### A-2: User Assumptions
- Users understand the concept of "life energy" from existing calculator
- Users are familiar with A-F grading system
- Users want actionable feedback, not just raw numbers

### A-3: Data Assumptions
- Work patterns follow typical Icelandic norms (40 hrs/week, 50 weeks/year)
- Expenses are annualized correctly by existing calculator
- Time inputs are weekly averages

---

## 8. Success Criteria

### SC-1: User Understanding
- Users can explain what their profitability grade means without re-reading documentation
- Users can identify the primary factor reducing their job profitability

### SC-2: Actionable Insights
- Users with Grade C or lower can identify at least one specific expense to reduce
- Users can articulate how improving their grade would impact their FIRE timeline

### SC-3: Integration Quality
- Scorecard updates in real-time when calculator inputs change
- Scorecard performance does not degrade page load time
- Scorecard data persists with existing export/import functionality

### SC-4: Accessibility
- Scorecard passes automated accessibility testing (axe DevTools)
- Screen reader users can navigate and understand all scorecard information
- Color-blind users can distinguish profitability levels through text and icons

---

## 9. Out of Scope

The following are explicitly NOT included in this feature:

- Historical tracking of profitability grades over time
- Comparison of multiple job scenarios (different from scenario comparison which already exists)
- Automated recommendations for expense reduction
- Integration with external job market data or salary benchmarks
- Predictive analysis of future profitability
- Social features (sharing grades, benchmarking against other users)

---

## 10. Open Questions

### Q-1: Grade Display Location
Where should the scorecard be displayed?
- Option A: New dedicated section on main calculator page
- Option B: Separate tab/page accessible from calculator
- Option C: Modal overlay triggered by button
**Decision needed**: Choose display pattern

### Q-2: Default Visibility
Should the scorecard be:
- Option A: Always visible when calculator has results
- Option B: Hidden by default, revealed by toggle
- Option C: Shown only after user completes all inputs
**Decision needed**: Determine default state

### Q-3: Benchmark Data
Should we display anonymized benchmark data?
- Option A: Show average reduction percentages for Iceland
- Option B: Only show grade thresholds
- Option C: Allow users to optionally see benchmarks
**Decision needed**: Privacy vs. context trade-off

---

## 11. Validation Checklist

- [ ] All user stories have clear EARS acceptance criteria
- [ ] All functional requirements are testable
- [ ] Non-functional requirements specify measurable targets
- [ ] Business rules are documented with rationale
- [ ] Constraints are clearly identified
- [ ] Assumptions are stated and reasonable
- [ ] Success criteria are measurable
- [ ] Out of scope items prevent feature creep
- [ ] Icelandic language requirement is consistent throughout
- [ ] Integration with existing Actual Hourly Wage Calculator is clear

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Claude | Initial requirements document |

---

**Status**: Requirements Complete - Ready for Design Phase
