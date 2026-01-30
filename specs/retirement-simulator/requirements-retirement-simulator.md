# Requirements: Retirement Date Simulator

## Overview

**Feature**: Retirement Date Simulator (Eftirlaunadagsetningarhermir)
**Category**: FIRE Planning Tool (3.4)
**Dependencies**: Expense Baseline Tool, Savings data, Current portfolio value, Actual Hourly Wage Calculator

## Problem Statement

Users planning for financial independence need to understand how different retirement dates impact their success probability and portfolio sustainability. Without a retirement simulator:
1. Users can't see how retiring 1-2 years earlier or later affects their financial security
2. Success probability calculations are missing from decision-making
3. Portfolio projections don't account for sequence-of-returns risk
4. Icelandic-specific retirement age considerations (60 for lífeyrissjóður, 67 for ellilífeyrir) aren't modeled
5. Users can't quantify the cost of retiring earlier vs working longer

The Retirement Date Simulator provides Monte Carlo or deterministic projections showing success rates, portfolio trajectories, and flexibility analysis for different retirement dates.

## User Stories

### US-1: Compare Different Retirement Dates
**As a** user planning for FIRE
**I want to** compare retiring at different ages (e.g., 55, 60, 65, 67)
**So that** I can understand the trade-offs between retiring earlier vs working longer

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters a target retirement date, the system SHALL display success probability and portfolio projections
- WHEN comparing multiple retirement dates, the system SHALL show side-by-side success rates
- WHEN the user adjusts retirement date sliders, the system SHALL recalculate results in real-time
- IF portfolio runs out before life expectancy, the system SHALL highlight the shortfall clearly

### US-2: See Success Probability with Monte Carlo Simulation
**As a** user concerned about market volatility
**I want to** see success probability based on thousands of market scenarios
**So that** I can make informed decisions accounting for uncertainty

**Acceptance Criteria (EARS Format)**:
- WHEN running simulations, the system SHALL use Monte Carlo methodology with at least 1,000 scenarios
- WHEN displaying results, the system SHALL show percentage of scenarios where portfolio lasts until life expectancy
- WHEN showing projections, the system SHALL display median, 25th percentile, and 75th percentile trajectories
- WHERE success rate is below 80%, the system SHALL display warnings with recommendations

### US-3: Understand Icelandic Retirement System Impact
**As a** user in Iceland
**I want to** see how lífeyrissjóður (age 60+) and ellilífeyrir (age 67+) affect my retirement plan
**So that** I can factor in Iceland-specific retirement income sources

**Acceptance Criteria (EARS Format)**:
- WHEN the user reaches age 60 in simulations, the system SHALL optionally include lífeyrissjóður withdrawals
- WHEN the user reaches age 67 in simulations, the system SHALL optionally include ellilífeyrir income
- WHEN calculating success probability, the system SHALL account for these additional income sources
- IF the user hasn't entered pension data, the system SHALL provide typical Icelandic pension estimates

### US-4: Evaluate Withdrawal Strategy Impact
**As a** user planning retirement withdrawals
**I want to** compare different withdrawal strategies (4% rule, variable spending, guardrails)
**So that** I can choose the approach that balances security and lifestyle

**Acceptance Criteria (EARS Format)**:
- WHEN selecting a withdrawal strategy, the system SHALL apply that methodology to all simulations
- WHEN using the 4% rule, the system SHALL withdraw 4% of initial portfolio (inflation-adjusted) annually
- WHEN using variable spending, the system SHALL adjust withdrawals based on portfolio performance
- WHERE guardrails are enabled, the system SHALL reduce spending if portfolio drops below thresholds

### US-5: See Portfolio Projections Over Time
**As a** user visualizing retirement
**I want to** see how my portfolio balance changes year-by-year
**So that** I can understand when I might run out of money or have surplus

**Acceptance Criteria (EARS Format)**:
- WHEN viewing projections, the system SHALL display a chart showing portfolio balance from retirement to life expectancy
- WHEN displaying multiple scenarios, the system SHALL show percentile bands (25th, 50th, 75th)
- WHEN portfolio depletes in some scenarios, the system SHALL show when and how often this occurs
- IF portfolio grows significantly, the system SHALL highlight potential for legacy or increased spending

### US-6: Analyze Flexibility and Buffer
**As a** user wanting financial security
**I want to** see how much flexibility I have in my retirement plan
**So that** I can understand my margin of safety

**Acceptance Criteria (EARS Format)**:
- WHEN displaying results, the system SHALL show "years of buffer" (how many years I could retire earlier and still succeed)
- WHEN showing flexibility, the system SHALL calculate spending adjustment tolerance (e.g., "can increase spending by 15%")
- WHEN retirement date changes, the system SHALL show impact on buffer and flexibility
- IF buffer is negative, the system SHALL show how many more years of work are needed

## Functional Requirements

### FR-1: Retirement Date Input
- FR-1.1: Allow user to select target retirement date (or age)
- FR-1.2: Support current age input for age-based calculations
- FR-1.3: Provide slider for easy retirement date comparison (+/- 5 years)
- FR-1.4: Show life expectancy assumption (default: 90-95 years, user-adjustable)
- FR-1.5: Display years until retirement and years in retirement

### FR-2: Portfolio and Savings Input
- FR-2.1: Accept current portfolio balance input
- FR-2.2: Accept monthly/annual savings amount until retirement
- FR-2.3: Support pulling savings data from other calculators
- FR-2.4: Allow expected return rate input (default: 7% real return)
- FR-2.5: Allow inflation rate input (default: 3%)
- FR-2.6: Support different asset allocation scenarios

### FR-3: Expense Input
- FR-3.1: Pull expense baseline from Expense Baseline Tool if available
- FR-3.2: Allow manual monthly expense input if baseline not set
- FR-3.3: Support expense adjustments in retirement (e.g., 80% of working expenses)
- FR-3.4: Allow different expense levels over time (e.g., higher early retirement spending)

### FR-4: Icelandic Retirement System Integration
- FR-4.1: Optional lífeyrissjóður (pension fund) withdrawal input starting at age 60
- FR-4.2: Optional ellilífeyrir (state pension) income input starting at age 67
- FR-4.3: Provide typical Icelandic pension estimates if user doesn't have exact figures
- FR-4.4: Support verðtryggð (inflation-indexed) pension calculations
- FR-4.5: Display pension income clearly in projections

### FR-5: Simulation Engine
- FR-5.1: Monte Carlo simulation with minimum 1,000 scenarios (5,000 recommended)
- FR-5.2: Deterministic projection option for quick calculations
- FR-5.3: Use historical market return distributions or configurable parameters
- FR-5.4: Account for sequence-of-returns risk
- FR-5.5: Run simulations efficiently (< 2 seconds for 1,000 scenarios)

### FR-6: Withdrawal Strategy Options
- FR-6.1: 4% Rule: Fixed percentage withdrawal (inflation-adjusted)
- FR-6.2: Variable Spending: Adjust withdrawals based on portfolio performance
- FR-6.3: Guardrails: Increase/decrease spending based on portfolio thresholds
- FR-6.4: Custom: User-defined withdrawal pattern
- FR-6.5: Display withdrawal amounts in ISK and life energy hours

### FR-7: Success Probability Calculation
- FR-7.1: Calculate percentage of scenarios where portfolio lasts until life expectancy
- FR-7.2: Display success rate with clear visual indicators (green >90%, yellow 75-90%, red <75%)
- FR-7.3: Show breakdown of failure scenarios (when portfolio depletes)
- FR-7.4: Calculate "years of success" (median age when portfolio depletes in failure scenarios)

### FR-8: Portfolio Projections
- FR-8.1: Display median portfolio trajectory over time
- FR-8.2: Show 25th and 75th percentile bands
- FR-8.3: Highlight best-case (95th percentile) and worst-case (5th percentile) scenarios
- FR-8.4: Show portfolio depletion points in failure scenarios
- FR-8.5: Display annual withdrawals alongside portfolio balance

### FR-9: Flexibility Analysis
- FR-9.1: Calculate "years of buffer" (how many years earlier retirement is possible with >80% success)
- FR-9.2: Calculate spending flexibility (how much expenses can increase with same success rate)
- FR-9.3: Show "additional years needed" if success rate is too low
- FR-9.4: Display sensitivity analysis (impact of +/- 1% return rate)

### FR-10: Comparison Mode
- FR-10.1: Support side-by-side comparison of 2-3 retirement dates
- FR-10.2: Show success rate difference between scenarios
- FR-10.3: Display portfolio trajectory overlay for multiple scenarios
- FR-10.4: Highlight recommended retirement date based on target success rate

### FR-11: Life Energy Integration
- FR-11.1: If Actual Hourly Wage is available, display retirement expenses in work hours
- FR-11.2: Show "years of life energy gained" by retiring earlier
- FR-11.3: Calculate "additional work hours needed" to improve success rate
- FR-11.4: Display trade-offs in life energy terms (1 more year working vs X% higher success rate)

## Non-Functional Requirements

### NFR-1: Performance
- Monte Carlo simulations (1,000 scenarios) shall complete in < 2 seconds
- Monte Carlo simulations (5,000 scenarios) shall complete in < 5 seconds
- UI updates shall respond within 100ms when adjusting inputs
- Chart rendering shall complete in < 500ms

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (500.000 kr)
- Success probability displayed prominently with color coding
- Portfolio projections chart interactive with tooltips
- Mobile-responsive design for chart visualization
- Clear explanations of assumptions and methodology

### NFR-3: Accuracy
- Monte Carlo simulations use realistic return distributions
- Inflation adjustments applied consistently
- Sequence-of-returns risk properly modeled
- Pension income calculations accurate for Icelandic system
- Results match industry-standard retirement calculators

### NFR-4: Transparency
- All assumptions clearly stated (return rate, inflation, life expectancy)
- Methodology explained (Monte Carlo vs deterministic)
- Disclaimers about not being financial advice
- Sources cited for default values (e.g., historical market returns)

### NFR-5: Accessibility
- Chart data available in table format for screen readers
- ARIA labels for all interactive elements
- Keyboard navigation for retirement date slider
- Color-blind friendly success rate indicators

### NFR-6: Privacy
- All calculations performed client-side
- No portfolio data sent to servers
- Simulation results not stored (recalculated on demand)

### NFR-7: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Pension system terminology accurate (lífeyrissjóður, ellilífeyrir)
- Age 60 and 67 milestones highlighted for Icelandic users

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Monte Carlo calculations must run in browser (no backend required)
- Must be accessible from FIRE Planning section

## Out of Scope

- Tax optimization strategies (separate calculator)
- Social Security claiming age strategies (US-specific)
- Required Minimum Distributions (US-specific)
- Healthcare cost projections (separate calculator)
- Estate planning and legacy goals
- Part-time work income in retirement (Barista FIRE is separate calculator)

## Success Criteria

1. User can see success probability for target retirement date in < 5 seconds
2. Monte Carlo simulations provide realistic confidence intervals
3. Icelandic pension system integration accurate and helpful
4. Portfolio projections clearly show risk of running out of money
5. Flexibility analysis helps users understand margin of safety
6. Comparison mode enables informed decision-making about retirement timing

## Assumptions

- Users have basic understanding of retirement planning concepts
- Users understand that simulations are projections, not guarantees
- Market returns follow historical patterns (or user-adjusted parameters)
- Life expectancy estimates are reasonable (90-95 years)
- Inflation remains within historical ranges (2-4%)
- Users have entered expense data or can estimate retirement expenses

## Glossary

| Term | Definition |
|------|------------|
| Retirement Date | Target date to stop working and begin living off portfolio |
| Success Probability | Percentage of scenarios where portfolio lasts until life expectancy |
| Monte Carlo Simulation | Running thousands of scenarios with random market returns to assess outcomes |
| Portfolio Depletion | When portfolio balance reaches zero |
| Sequence-of-Returns Risk | Risk that poor market returns early in retirement harm long-term portfolio sustainability |
| Withdrawal Rate | Percentage of portfolio withdrawn annually for living expenses |
| 4% Rule | Withdraw 4% of initial portfolio (inflation-adjusted) each year |
| Variable Spending | Adjust withdrawals based on portfolio performance |
| Guardrails | Pre-defined spending increase/decrease triggers based on portfolio thresholds |
| Lífeyrissjóður | Icelandic pension fund (withdrawal possible at age 60) |
| Ellilífeyrir | Icelandic state pension (available at age 67) |
| Life Expectancy | Expected age of death (default: 90-95 years) |
| Buffer | Additional years retirement could be moved earlier with acceptable success rate |
| Flexibility | Ability to increase spending or retire earlier while maintaining target success rate |

## Icelandic Retirement Age Milestones

| Age | Milestone | Description |
|-----|-----------|-------------|
| 60 | Lífeyrissjóður | Early withdrawal from pension fund possible |
| 65 | Typical Retirement | Traditional retirement age in Iceland |
| 67 | Ellilífeyrir | State pension eligibility begins |
| 70 | Delayed Pension | Higher ellilífeyrir if delayed past 67 |

## Default Simulation Parameters

| Parameter | Default Value | Range |
|-----------|---------------|-------|
| Expected Real Return | 7% | 4-10% |
| Inflation Rate | 3% | 2-4% |
| Life Expectancy | 92 years | 85-100 years |
| Scenarios (Monte Carlo) | 1,000 | 1,000-10,000 |
| Return Volatility | 18% | 10-25% |
| Target Success Rate | 85% | 75-95% |
| Withdrawal Rate (4% Rule) | 4% | 3-5% |

## Withdrawal Strategy Comparison

| Strategy | Description | Best For | Complexity |
|----------|-------------|----------|------------|
| 4% Rule | Fixed 4% of initial portfolio (inflation-adjusted) annually | Simple planning, predictable spending | Low |
| Variable Spending | Withdraw X% of current portfolio each year | Risk tolerance, flexible lifestyle | Medium |
| Guardrails | Adjust spending when portfolio crosses thresholds | Balance between fixed and variable | High |
| Custom | User-defined withdrawal pattern | Specific needs (e.g., higher spending early retirement) | Custom |

## References

- **Book**: "Your Money or Your Life" by Vicki Robin (Chapter 9: Financial Independence)
- **Research**: Trinity Study on safe withdrawal rates
- **Tool**: cFIREsim and similar retirement calculators
- **Icelandic**: Lífeyrissjóður regulations and ellilífeyrir schedules
