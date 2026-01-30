# Requirements: Interest Savings Snowball Calculator

## Overview

**Feature**: Interest Savings Snowball Calculator (Vaxtasparnaður Snjóboltareiknivél)
**Category**: Savings Calculator (2.2.8)
**Dependencies**: Actual Hourly Wage Calculator, Debt Payoff vs Invest Analyzer

## Problem Statement

When users make extra payments on a loan, they reduce the principal, which means the next month's interest charge is lower. This creates a savings opportunity - but users don't realize they can:
1. Add this interest savings to next month's payment (snowball effect on debt)
2. Invest the interest savings (building wealth from debt reduction)

Users need to see the compound effect of consistently reinvesting these small interest savings over the life of the loan.

## User Stories

### US-1: Compare Snowball Strategies
**As a** user with a loan and extra money to pay
**I want to** compare different strategies for handling my interest savings
**So that** I can maximize the value of my extra payments

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters loan details and extra payment amount, the system SHALL calculate three scenarios: base case, snowball to loan, and snowball to investment
- WHEN displaying results, the system SHALL show the difference in months to debt-free for each scenario
- WHEN displaying results, the system SHALL show total wealth created (debt eliminated + investments) for each scenario
- IF the user has entered their actual hourly wage, the system SHALL display all monetary differences in life energy hours

### US-2: Visualize Snowball Effect Over Time
**As a** user trying to understand compound effects
**I want to** see a visual chart comparing scenarios over time
**So that** I can understand how small savings compound

**Acceptance Criteria (EARS Format)**:
- WHEN results are calculated, the system SHALL display a line chart showing all three scenarios
- WHEN hovering over the chart, the system SHALL show detailed values for that month
- WHERE the chart shows debt balance, the system SHALL use red coloring
- WHERE the chart shows investment balance, the system SHALL use green coloring

### US-3: Understand Interest Savings Month-by-Month
**As a** user wanting to understand the mechanics
**I want to** see a detailed breakdown of interest savings each month
**So that** I can verify the calculations and understand the snowball effect

**Acceptance Criteria (EARS Format)**:
- WHEN viewing detailed breakdown, the system SHALL show for each month: interest with base payment, interest with snowball, and the difference (savings)
- WHEN the snowball is applied to the loan, the system SHALL show the increasing extra payment amount each month
- WHEN the snowball is invested, the system SHALL show the growing investment balance

### US-4: Receive Clear Recommendation
**As a** user unsure which strategy to choose
**I want to** receive a clear recommendation with reasoning
**So that** I can make an informed decision

**Acceptance Criteria (EARS Format)**:
- WHEN all scenarios are calculated, the system SHALL provide a recommendation based on total value created
- WHEN providing a recommendation, the system SHALL explain the reasoning in plain language
- IF the difference between strategies is less than 5%, the system SHALL indicate it's a "close call" and emphasize personal preference

### US-5: Navigate from Debt Payoff Calculator
**As a** user viewing the Debt Payoff vs Invest calculator
**I want to** easily access the Snowball Calculator
**So that** I can explore advanced debt payoff strategies

**Acceptance Criteria (EARS Format)**:
- WHEN viewing the Debt Payoff vs Invest calculator, the system SHALL display a link/reference to the Snowball Calculator
- WHEN navigating to the Snowball Calculator, the system SHALL pre-fill loan details if available from the previous calculator

## Functional Requirements

### FR-1: Loan Input
- FR-1.1: Accept original loan amount (ISK)
- FR-1.2: Accept current balance (ISK)
- FR-1.3: Accept annual interest rate (%)
- FR-1.4: Accept loan term in months
- FR-1.5: Accept remaining payments
- FR-1.6: Accept loan type (verðtryggð or óverðtryggð)
- FR-1.7: Accept payment method (annuity or linear) for óverðtryggð loans
- FR-1.8: Accept inflation rate for verðtryggð loans

### FR-2: Extra Payment Input
- FR-2.1: Accept monthly extra payment amount (ISK)
- FR-2.2: Display extra payment in life energy hours (if actual hourly wage available)

### FR-3: Investment Assumptions
- FR-3.1: Accept expected annual investment return (%)
- FR-3.2: Default to 7% (historical average)

### FR-4: Scenario Calculations
- FR-4.1: Calculate **Scenario 1 (Base Case)**: Extra payment applied to loan, savings not reinvested
- FR-4.2: Calculate **Scenario 2 (Snowball to Loan)**: Extra payment + accumulated interest savings applied to loan each month
- FR-4.3: Calculate **Scenario 3 (Snowball to Investment)**: Extra payment to loan, interest savings invested monthly
- FR-4.4: Track month-by-month for all scenarios: balance, payment, interest, principal, cumulative savings

### FR-5: Output Metrics
- FR-5.1: Display months to debt-free for each scenario
- FR-5.2: Display total interest paid for each scenario
- FR-5.3: Display total investment value for Scenario 3
- FR-5.4: Display total wealth created (debt eliminated + investments)
- FR-5.5: Display all values in life energy hours when actual hourly wage is available

### FR-6: Visualization
- FR-6.1: Display line chart comparing debt balance over time for all scenarios
- FR-6.2: Display line chart showing cumulative interest savings
- FR-6.3: Display chart showing investment growth (Scenario 3)

### FR-7: Cross-Calculator Integration
- FR-7.1: Accept pre-filled data from Debt Payoff vs Invest calculator
- FR-7.2: Provide link from Debt Payoff calculator to this calculator

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 500ms for loans up to 600 months
- Charts shall render within 1 second

### NFR-2: Usability
- All monetary values shall be formatted with Icelandic number formatting (e.g., 1.000.000 kr)
- Life energy values shall be displayed prominently with "klst" suffix
- Results shall include plain-language explanations, not just numbers

### NFR-3: Accessibility
- All charts shall have text alternatives for screen readers
- Color choices shall meet WCAG contrast requirements
- Form inputs shall have proper labels and help text

### NFR-4: Privacy
- All calculations shall be performed client-side
- No data shall be sent to servers
- Data shall persist in localStorage only

### NFR-5: Icelandic Context
- Support both verðtryggð (indexed) and óverðtryggð (non-indexed) loans
- Use Icelandic labels and explanations
- Currency in ISK

## Constraints

- Must integrate with existing Debt Payoff vs Invest calculator
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)

## Out of Scope

- Multiple debts simultaneously (future enhancement)
- Tax implications of investment gains
- Automatic data import from banks
- Push notifications or reminders

## Success Criteria

1. User can calculate all three scenarios with accurate results
2. Visualization clearly shows the compound effect over time
3. Life energy display helps user understand real impact
4. Clear recommendation helps user decide
5. Seamless navigation from Debt Payoff calculator

## Glossary

| Term | Definition |
|------|------------|
| Snowball Effect | The compounding benefit of reinvesting savings |
| Interest Savings | The reduction in monthly interest when principal decreases |
| Verðtryggð lán | Inflation-indexed loan (principal adjusts with inflation) |
| Óverðtryggð lán | Non-indexed loan (fixed principal, variable or fixed rate) |
| Life Energy | Work hours required to earn an amount (amount ÷ actual hourly wage) |
| Jafnar afborganir | Annuity payment method (equal total payments) |
| Jafnar höfuðstólsgreiðslur | Linear payment method (equal principal payments) |
