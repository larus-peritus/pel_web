# Requirements: Pension-Aware FIRE Calculator

## Feature Overview

**Feature Name:** Pension-Aware FIRE Calculator (Lífeyristengd FIRE Reiknivél)
**Feature ID:** 2.1.15
**Version:** 1.0
**Status:** Draft
**Created:** 2026-01-30

### Problem Statement

Traditional FIRE calculators assume you need 25-30x annual expenses saved forever. This leads to significant "over-saving" in Iceland because:

1. **Séreign (Private Pension)** becomes accessible at age 60
2. **Lífeyrissjóður (Occupational Pension)** typically starts at 62-67
3. **TR Ellilífeyrir (State Pension)** starts at 67 with means-testing

A 35-year-old saving aggressively might calculate they need 144M kr to retire at 52, when they actually only need ~35-40M kr to bridge the gap until pensions kick in.

### Solution

Create a calculator that shows the **true FI number** by breaking retirement into phases and accounting for expected pension income at each phase.

---

## User Stories

### US-1: Phase-Based Retirement Planning
**As a** early retirement planner in Iceland
**I want to** see my retirement broken into distinct phases (pre-60, 60-67, 67+)
**So that** I can understand exactly what I need to save for each period

**Acceptance Criteria (EARS Format):**
- WHEN the user enters their current age and target retirement age, the system SHALL display distinct funding phases with clear age boundaries
- IF the target retirement age is before 60, the system SHALL show a "gap period" requiring full self-funding
- IF the target retirement age is between 60-67, the system SHALL factor in séreign availability
- WHEN displaying phases, the system SHALL show the duration in years for each phase

### US-2: Pension Income Estimation
**As a** user planning for early retirement
**I want to** input my expected pension amounts from different sources
**So that** I can see how much my pensions will cover in later phases

**Acceptance Criteria (EARS Format):**
- WHEN the user enters expected lífeyrissjóður amount, the system SHALL use this for age 67+ calculations
- WHEN the user enters expected séreign balance, the system SHALL calculate monthly withdrawals for the 60-67 bridge
- WHEN the user enters expected TR eligibility, the system SHALL estimate TR after means-testing against lífeyrissjóður
- IF the user doesn't know their pension amounts, the system SHALL provide reasonable Icelandic defaults with explanation

### US-3: True FI Number Calculation
**As a** LeanFIRE/FIRE enthusiast
**I want to** see my actual required savings accounting for future pensions
**So that** I don't over-save and can retire earlier or work less

**Acceptance Criteria (EARS Format):**
- WHEN calculating the FI number, the system SHALL subtract the present value of future pension income from the traditional FI number
- WHEN displaying results, the system SHALL show both "Traditional FI" and "Pension-Adjusted FI" for comparison
- WHEN the pension-adjusted FI is significantly lower, the system SHALL highlight the savings difference
- IF pension income exceeds expenses in later phases, the system SHALL show surplus and suggest lower savings targets

### US-4: Gap Period Bridge Calculator
**As a** someone retiring before 60
**I want to** know exactly how much I need to bridge the gap until pensions start
**So that** I can plan my savings target precisely

**Acceptance Criteria (EARS Format):**
- WHEN the retirement age is before 60, the system SHALL calculate the bridge fund needed for the gap period
- WHEN calculating the bridge, the system SHALL account for investment returns during the drawdown period
- WHEN displaying the bridge calculation, the system SHALL show year-by-year breakdown
- IF the user has existing séreign, the system SHALL factor this into the 60-67 bridge period

### US-5: Retirement Timeline Visualization
**As a** visual learner
**I want to** see a timeline or chart of my retirement phases
**So that** I can easily understand when different income sources kick in

**Acceptance Criteria (EARS Format):**
- WHEN results are calculated, the system SHALL display a visual timeline showing all phases
- WHEN displaying the timeline, the system SHALL use color coding to distinguish income sources
- WHEN hovering over timeline sections, the system SHALL show detailed breakdown of that phase
- WHILE viewing the timeline, the system SHALL clearly mark the current age and target retirement age

### US-6: Integration with Expense Baseline
**As a** user who has already set up my expense baseline
**I want to** use my existing expense data for calculations
**So that** I don't have to re-enter my monthly expenses

**Acceptance Criteria (EARS Format):**
- WHEN the user has expense baseline data, the system SHALL auto-populate monthly expenses from barebones tier
- WHEN expense baseline exists, the system SHALL allow switching between tiers (barebones/comfortable/deluxe)
- IF no expense baseline exists, the system SHALL allow manual expense entry with helpful defaults
- WHEN expenses change, the system SHALL recalculate all phases automatically

### US-7: Scenario Comparison
**As a** someone exploring different retirement options
**I want to** compare different retirement ages and expense levels
**So that** I can find the optimal balance for my situation

**Acceptance Criteria (EARS Format):**
- WHEN the user changes retirement age, the system SHALL instantly recalculate and update all displays
- WHEN displaying results, the system SHALL show how each year earlier/later affects required savings
- IF the user wants to compare scenarios, the system SHALL allow saving/naming up to 3 scenarios for side-by-side comparison
- WHEN comparing scenarios, the system SHALL highlight the key differences (required savings, gap period, surplus/deficit)

---

## Functional Requirements

### FR-1: Input Parameters
The calculator SHALL accept the following inputs:
- Current age (18-70)
- Target retirement age (current age + 1 to 80)
- Monthly expenses (from baseline or manual entry)
- Current savings/investments
- Monthly savings rate
- Expected investment return rate (default 5%)
- Expected lífeyrissjóður monthly amount at 67
- Expected séreign balance at 60
- Expected TR eligibility (yes/no/partial)

### FR-2: Phase Calculations
The system SHALL calculate for each phase:
- **Phase 1 (Retirement to 60):** Full self-funding from savings
- **Phase 2 (60-67):** Séreign withdrawals + remaining savings
- **Phase 3 (67+):** Lífeyrissjóður + TR + remaining séreign/savings

### FR-3: Present Value Calculations
The system SHALL:
- Calculate present value of future pension streams
- Use configurable discount rate (default: investment return rate)
- Account for inflation adjustment option

### FR-4: Output Display
The system SHALL display:
- Traditional FI number (without pension consideration)
- Pension-Adjusted FI number (true requirement)
- Savings difference ("you're over-saving by X kr")
- Time to FI with current savings rate
- Phase-by-phase breakdown with income sources
- Visual timeline

### FR-5: Icelandic Pension Defaults
The system SHALL provide Iceland-specific defaults:
- Séreign access age: 60
- Lífeyrissjóður standard age: 67 (early option: 62)
- TR eligibility age: 67
- TR means-testing rules (simplified)
- Typical lífeyrissjóður range: 200-400k/month
- Typical séreign accumulation estimates

---

## Non-Functional Requirements

### NFR-1: Performance
- Calculations SHALL complete within 100ms
- UI SHALL remain responsive during calculations
- No perceptible lag when adjusting sliders

### NFR-2: Usability
- Interface SHALL be fully in Icelandic
- Complex pension concepts SHALL have explanatory tooltips
- Educational content SHALL explain the "over-saving" problem
- Mobile-responsive design

### NFR-3: Accuracy
- Calculations SHALL use proper present value formulas
- TR means-testing SHALL follow current Icelandic rules
- Disclaimer SHALL note this is an estimate, not financial advice

### NFR-4: Integration
- SHALL integrate with existing CalculatorContext
- SHALL reuse existing UI components (Card, CurrencyInput, etc.)
- SHALL follow existing code patterns and styling

---

## Constraints

### Technical Constraints
- Must work within existing Next.js/React architecture
- Must use existing UI component library
- State management via CalculatorContext

### Business Constraints
- Must clearly disclaim this is not financial advice
- Must link to official TR calculator for accurate TR estimates
- Must note that pension rules can change

### Regulatory Constraints
- No personal data storage (localStorage only)
- Clear disclaimers about estimate nature

---

## Success Criteria

1. **User Understanding:** Users can explain why their pension-adjusted FI is lower than traditional FI
2. **Actionable Results:** Users know exactly how much to save for each retirement phase
3. **Reduced Anxiety:** Users who were "over-saving" feel relief and can adjust plans
4. **Integration:** Calculator seamlessly uses expense baseline data when available
5. **Educational Value:** Users learn about the Icelandic pension system phases

---

## Out of Scope (v1.0)

- Detailed tax calculations
- Inflation-adjusted projections (future version)
- Monte Carlo simulations for pension returns
- Integration with actual pension fund data (API)
- Multiple currency support
- Spouse/couple calculations (future version)

---

## Dependencies

- Expense Baseline Tool (2.1.11) - for expense data
- TR Means-Test Calculator (shared component) - for TR estimates
- LeanFIRE Calculator - similar patterns and components
- CalculatorContext - state management

---

## Glossary

| Term | Icelandic | Description |
|------|-----------|-------------|
| Séreign | Séreignarsparnaður | Private pension savings, accessible from age 60 |
| Lífeyrissjóður | Lífeyrissjóður | Occupational pension fund, typically 62-67 |
| TR | Tryggingastofnun | State pension (Ellilífeyrir), from age 67 |
| FI Number | FI-tala | Financial Independence target amount |
| Gap Period | Biðtími | Years between early retirement and pension access |
| Means-Testing | Tekjutengd skerðing | TR reduction based on other income |
