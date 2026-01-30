# Requirements: Savings Report (Sparnaðarskýrsla)

## Overview

**Feature**: Savings Report (Sparnaðarskýrsla)
**Category**: Savings Tracker (Foundation for FI planning)
**Dependencies**: CalculatorContext (for Actual Hourly Wage integration)

## Problem Statement

Users planning for Financial Independence need to track not just their expenses, but also their savings across multiple categories. Currently, there's no structured way to:
1. Track current balances across different savings categories (emergency fund, investments, pension, etc.)
2. Track monthly contributions to each savings category
3. Calculate savings rate when combined with income data
4. Provide savings data to FI planning calculators

The Savings Report complements the Current Expense Report by giving users a complete picture of their financial state - both what they spend and what they save.

## User Stories

### US-1: Track Savings by Category
**As a** user planning for financial independence
**I want to** track my savings across different categories (emergency fund, investments, pension, etc.)
**So that** I can see my complete savings picture in one place

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the Savings Report, the system SHALL display savings categories with Icelandic names
- WHEN viewing a category, the system SHALL show current balance and monthly contribution
- WHEN all categories have data, the system SHALL calculate total savings and total monthly contribution
- IF the user has calculated their actual hourly wage, the system SHALL display savings in life energy (work hours)

### US-2: Track Current Balances
**As a** user
**I want to** record how much I currently have saved in each category
**So that** I know my total current savings position

**Acceptance Criteria (EARS Format)**:
- WHEN entering a balance, the system SHALL accept ISK amounts
- WHEN viewing balances, the system SHALL display formatted ISK values
- WHERE a balance is entered, the system SHALL include it in total savings calculation
- IF the user has their actual hourly wage, the system SHALL show balance as work hours equivalent

### US-3: Track Monthly Contributions
**As a** user
**I want to** record how much I contribute to each savings category monthly
**So that** I can see my total monthly savings rate

**Acceptance Criteria (EARS Format)**:
- WHEN entering a contribution, the system SHALL accept ISK amounts per month
- WHEN viewing contributions, the system SHALL display monthly totals
- WHERE monthly income is available, the system SHALL calculate savings rate percentage
- IF savings rate exceeds standard thresholds, the system SHALL display contextual feedback

### US-4: Set Optional Target Amounts
**As a** user with savings goals
**I want to** set target amounts for specific savings categories
**So that** I can track my progress toward those goals

**Acceptance Criteria (EARS Format)**:
- WHEN viewing a category, the system SHALL allow setting an optional target amount
- WHERE a target is set, the system SHALL display progress percentage
- WHERE a target is set, the system SHALL show remaining amount needed
- IF the user has their actual hourly wage, the system SHALL show remaining in work hours

### US-5: Calculate Savings Rate
**As a** user tracking my FI progress
**I want to** see my savings rate as a percentage of income
**So that** I can understand how fast I'm progressing toward FI

**Acceptance Criteria (EARS Format)**:
- WHEN monthly income is available from the calculator context, the system SHALL calculate savings rate
- WHEN displaying savings rate, the system SHALL show percentage of monthly income
- WHERE savings rate is calculated, the system SHALL provide context (e.g., "You save X months per year of work")
- IF savings rate cannot be calculated (no income), the system SHALL display explanation and prompt

### US-6: View Life Energy Equivalent
**As a** user who thinks in terms of life energy
**I want to** see my savings expressed in work hours
**So that** I can understand the true value of my savings

**Acceptance Criteria (EARS Format)**:
- WHEN actual hourly wage is available, the system SHALL display balances in work hours
- WHEN actual hourly wage is available, the system SHALL display contributions in work hours per month
- WHERE targets are set, the system SHALL show remaining target in work hours
- IF actual hourly wage is not set, the system SHALL prompt user to calculate it first

### US-7: Add Notes to Categories
**As a** user with specific savings details
**I want to** add notes to savings categories
**So that** I can remember important details (account numbers, goals, etc.)

**Acceptance Criteria (EARS Format)**:
- WHEN viewing a category, the system SHALL allow adding optional notes
- WHEN notes exist, the system SHALL display them in the category detail
- WHERE notes are entered, the system SHALL preserve them across sessions

## Functional Requirements

### FR-1: Savings Categories
- FR-1.1: Support these default categories with Icelandic labels:
  - Neyðarsjóður (Emergency Fund) - 3-6 month expenses buffer
  - Skammtímasparnaður (Short-term Savings) - Goals < 2 years
  - Langtímasparnaður (Long-term Savings) - Goals > 2 years
  - Fjárfestingar (Investments) - Stocks, funds, ETFs
  - Lífeyrissjóður (Pension/Retirement) - Including employer contributions
  - Sérstakur sjóður (Special Purpose) - Custom user-defined goals
  - Annað (Other) - Miscellaneous savings
- FR-1.2: Each category shall have a unique ID, name, and icon
- FR-1.3: Categories shall be displayed in a consistent order
- FR-1.4: Allow hiding categories that don't apply to the user

### FR-2: Data Capture Per Category
- FR-2.1: Capture current balance (ISK)
- FR-2.2: Capture monthly contribution (ISK)
- FR-2.3: Capture optional target amount (ISK)
- FR-2.4: Capture optional notes/description (text)
- FR-2.5: All monetary values shall be stored in ISK

### FR-3: Calculations
- FR-3.1: Calculate total current savings (sum of all balances)
- FR-3.2: Calculate total monthly contribution (sum of all contributions)
- FR-3.3: Calculate total annual contribution (monthly * 12)
- FR-3.4: Calculate savings rate when income available (monthly contribution / monthly net income * 100)
- FR-3.5: Calculate progress percentage for categories with targets (balance / target * 100)
- FR-3.6: Calculate remaining to target (target - balance)
- FR-3.7: Calculate life energy equivalents when actual hourly wage available

### FR-4: Summary Display
- FR-4.1: Display total savings across all categories
- FR-4.2: Display total monthly contribution
- FR-4.3: Display savings rate percentage (if calculable)
- FR-4.4: Display category breakdown (percentage of total per category)
- FR-4.5: Display life energy totals (if AWH available)

### FR-5: Data Persistence
- FR-5.1: Save savings report to localStorage
- FR-5.2: Load saved report on page load
- FR-5.3: Export savings data as part of full data export
- FR-5.4: Import savings data from backup file
- FR-5.5: Provide API for other calculators to access savings data

### FR-6: Integration with Other Calculators
- FR-6.1: Expose `getSavingsReport()` function for other calculators
- FR-6.2: Expose `getTotalSavings()` function
- FR-6.3: Expose `getTotalMonthlyContribution()` function
- FR-6.4: Expose `getSavingsRate()` function
- FR-6.5: Make data available for FI Number and Coast FIRE calculators

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 100ms
- Page shall load in < 2 seconds
- LocalStorage operations shall be debounced (500ms)

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (e.g., 5.000.000 kr)
- Life energy displayed with "klst" suffix
- Clear visual representation of savings categories
- Mobile-responsive design
- Accessible form inputs with proper labels

### NFR-3: Accessibility
- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG contrast requirements
- Keyboard navigation shall work throughout
- Screen reader compatible

### NFR-4: Privacy
- All data stored client-side only
- No data sent to servers
- Export/import for user data portability

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Default category descriptions in Icelandic
- Category icons using emoji for universal recognition

## Constraints

- Must integrate with existing calculator context (CalculatorProvider)
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Should follow same pattern as Current Expense Report for consistency

## Out of Scope

- Automatic bank import/sync
- Historical tracking over time (time series)
- Investment performance tracking
- Individual stock/fund tracking
- Account aggregation
- Retirement projections (separate calculator)

## Success Criteria

1. User can track savings across 7 categories in < 5 minutes
2. Savings data is accessible from FI planning calculators
3. Savings rate calculation helps users understand FI timeline impact
4. Life energy display provides motivational context
5. Pattern matches Current Expense Report for familiar UX

## Glossary

| Term | Definition |
|------|------------|
| Sparnaðarskýrsla | Savings Report - the feature being built |
| Neyðarsjóður | Emergency Fund - 3-6 months of expenses |
| Skammtímasparnaður | Short-term Savings - goals within 2 years |
| Langtímasparnaður | Long-term Savings - goals beyond 2 years |
| Fjárfestingar | Investments - stocks, funds, ETFs |
| Lífeyrissjóður | Pension/Retirement fund |
| Sérstakur sjóður | Special Purpose fund - custom goals |
| Annað | Other - miscellaneous savings |
| Sparnaðarhlutfall | Savings Rate - percentage of income saved |
| Lífsorka | Life Energy - work hours equivalent |
| Markmið | Target - goal amount for a category |

## Default Savings Categories with Icons

| Category ID | Icelandic Name | Icon | Description |
|-------------|----------------|------|-------------|
| neydarsjodur | Neyðarsjóður | 🛡️ | 3-6 mánaða útgjöld í varasjóði |
| skammtima | Skammtímasparnaður | 📅 | Markmið innan 2 ára (frí, bíll, o.fl.) |
| langtima | Langtímasparnaður | 🎯 | Markmið yfir 2 ár |
| fjarfestingar | Fjárfestingar | 📈 | Hlutabréf, sjóðir, ETF |
| lifeyrissjodur | Lífeyrissjóður | 🏖️ | Þ.m.t. mótframlag vinnuveitanda |
| serstakur | Sérstakur sjóður | ⭐ | Sérsniðin markmið |
| annad | Annað | 📦 | Ýmis sparnaður |

## Savings Rate Context (Icelandic)

| Rate Range | Icelandic Message |
|------------|-------------------|
| 0-10% | Lágmarks sparnaður - íhugaðu að auka |
| 10-20% | Góður grunnur - meðaltal landsmanna |
| 20-30% | Mjög gott - á góðri leið til fjárhagsfrelsis |
| 30-50% | Framúrskarandi - FI innan 15-20 ára |
| 50%+ | Hámarks sparnaður - FI innan 10-15 ára |
