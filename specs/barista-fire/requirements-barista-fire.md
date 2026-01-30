# Requirements: Barista FIRE Planner

## Overview

**Feature**: Barista FIRE Planner (Barista FIRE Áætlun)
**Category**: FIRE Strategy Calculator (2.3)
**Dependencies**: FI Number Calculator, Expense Baseline Tool

## Problem Statement

Users interested in semi-retirement (Barista FIRE) need to understand:
1. How much part-time income is required to cover the gap between savings and full FI
2. When they can transition to part-time work
3. How healthcare and pension considerations affect the calculation in Iceland
4. The impact of different expense tiers on required part-time income
5. How many years of part-time work reduces their full FI timeline

Without a Barista FIRE calculator:
- Users can't quantify the income needed for semi-retirement
- Healthcare concerns prevent US-based FIRE strategies from working in Iceland
- Pension fund implications are unclear
- Gap period planning is guesswork
- Life energy trade-offs between full-time and part-time work are invisible

The Barista FIRE Planner provides a specialized calculator for planning semi-retirement with part-time income, adapted for Iceland's universal healthcare and mandatory pension system.

## User Stories

### US-1: Calculate Required Part-Time Income

**As a** user planning for Barista FIRE
**I want to** calculate the minimum part-time income needed to cover my expenses
**So that** I can understand when I can transition to semi-retirement

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters their current savings, the system SHALL calculate the gap between savings and full FI
- WHEN the user selects an expense tier from their baseline, the system SHALL calculate required annual income to cover the gap
- WHEN displaying required income, the system SHALL show both annual ISK and monthly ISK amounts
- IF the user has entered actual hourly wage, the system SHALL display required work hours per week/month/year
- WHERE the gap is negative (savings exceed FI number), the system SHALL indicate the user has achieved Coast FIRE

### US-2: Plan Gap Period Duration

**As a** user evaluating Barista FIRE
**I want to** see how many years of part-time work I need before full retirement
**So that** I can decide if this strategy makes sense for me

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters planned part-time income, the system SHALL calculate when they reach their FI number
- WHEN showing the gap period, the system SHALL display years and months until full FI
- WHEN calculating, the system SHALL account for continued investment growth during the gap period
- IF the part-time income exceeds expenses, the system SHALL show accelerated FI timeline
- WHERE part-time income exactly equals expenses, the system SHALL show Coast FIRE timeline

### US-3: Compare Multiple Part-Time Scenarios

**As a** user exploring options
**I want to** compare different part-time income scenarios side by side
**So that** I can choose the right balance of work and freedom

**Acceptance Criteria (EARS Format)**:
- WHEN viewing scenarios, the system SHALL allow creating multiple part-time income options
- WHEN comparing scenarios, the system SHALL show required hours, gap duration, and life energy for each
- WHEN modifying a scenario, the system SHALL update all calculations in real-time
- IF scenarios use different expense tiers, the system SHALL clearly indicate which tier applies to each

### US-4: Understand Icelandic-Specific Considerations

**As a** user in Iceland
**I want to** see how Iceland's healthcare and pension systems affect my Barista FIRE plan
**So that** I can plan accurately for my local context

**Acceptance Criteria (EARS Format)**:
- WHEN displaying healthcare considerations, the system SHALL explain that Iceland has universal healthcare
- WHEN calculating pension contributions, the system SHALL account for mandatory 16% contribution (12% employer + 4% employee)
- WHEN showing part-time income scenarios, the system SHALL indicate net income after pension contributions
- IF the user works part-time, the system SHALL note they continue building pension benefits

### US-5: Visualize Life Energy Trade-Offs

**As a** user thinking in life energy terms
**I want to** see the work hours required for different Barista FIRE scenarios
**So that** I can evaluate the lifestyle trade-offs

**Acceptance Criteria (EARS Format)**:
- WHEN actual hourly wage is available, the system SHALL display required work hours per week for part-time income
- WHEN comparing to current full-time work, the system SHALL show the reduction in work hours
- WHEN showing gap period, the system SHALL display total life energy hours over the gap period
- IF the user changes their target expense tier, the system SHALL recalculate required work hours

### US-6: Integrate with Expense Baseline

**As a** user who has defined an expense baseline
**I want to** select which tier I want to maintain during Barista FIRE
**So that** calculations use my actual planned expenses

**Acceptance Criteria (EARS Format)**:
- WHEN the expense baseline exists, the system SHALL display a tier selector
- WHEN a tier is selected, the system SHALL use that tier's expenses for all calculations
- IF no expense baseline exists, the system SHALL prompt the user to create one first
- WHERE the user manually overrides expenses, the system SHALL use the override instead of baseline

## Functional Requirements

### FR-1: Gap Calculation

- FR-1.1: Calculate current FI number based on selected expense tier (annual expenses × 25)
- FR-1.2: Calculate gap between current savings and FI number
- FR-1.3: Calculate minimum part-time income needed to cover annual expenses
- FR-1.4: Calculate remaining years to FI with part-time income and continued growth
- FR-1.5: Account for investment returns during gap period (configurable rate, default 5%)

### FR-2: Part-Time Income Scenarios

- FR-2.1: Support multiple named scenarios (e.g., "20 hours/week", "Consulting", "Freelance")
- FR-2.2: Allow input of gross annual income or work hours per week
- FR-2.3: Calculate net income after 16% mandatory pension contribution
- FR-2.4: Calculate savings rate if part-time income exceeds expenses
- FR-2.5: Show acceleration factor (how much faster/slower than Coast FIRE)

### FR-3: Timeline Projections

- FR-3.1: Calculate years and months to full FI for each scenario
- FR-3.2: Show current age and projected FI age
- FR-3.3: Display cumulative life energy hours over gap period
- FR-3.4: Project final nest egg at full FI (with growth)
- FR-3.5: Compare gap period timeline to traditional full-time FIRE timeline

### FR-4: Icelandic Context

- FR-4.1: Display note that Iceland has universal healthcare (no employer insurance needed)
- FR-4.2: Calculate mandatory pension contributions (16% total)
- FR-4.3: Note that part-time work continues to build lífeyrissjóður (pension fund) benefits
- FR-4.4: Use Icelandic ISK currency formatting
- FR-4.5: All UI text in Icelandic

### FR-5: Integration with Expense Baseline

- FR-5.1: Load expense baseline from CalculatorContext
- FR-5.2: Display TierSelector component if baseline exists
- FR-5.3: Use selected tier's annual expenses for FI number calculation
- FR-5.4: Fall back to manual expense input if no baseline exists
- FR-5.5: Highlight which expense tier is active in calculations

### FR-6: Integration with Life Energy

- FR-6.1: Load actual hourly wage from CalculatorContext
- FR-6.2: Convert required income to work hours per week/month/year
- FR-6.3: Calculate total life energy cost of gap period
- FR-6.4: Compare part-time hours to current full-time hours
- FR-6.5: Prompt to calculate actual hourly wage if not available

### FR-7: Visualization

- FR-7.1: Timeline chart showing path to full FI with part-time income
- FR-7.2: Comparison chart of different scenarios side by side
- FR-7.3: Visual indication of gap period vs. full retirement period
- FR-7.4: Work hours per week visualization (bar chart or gauge)
- FR-7.5: Color-coded scenarios for easy differentiation

### FR-8: Data Persistence

- FR-8.1: Save Barista FIRE scenarios to localStorage
- FR-8.2: Load saved scenarios on page load
- FR-8.3: Include scenarios in export/import data functions
- FR-8.4: Support deleting individual scenarios
- FR-8.5: Auto-save when scenarios change (debounced)

## Non-Functional Requirements

### NFR-1: Performance

- Calculations shall complete in < 100ms
- Page shall load in < 2 seconds
- Real-time updates when changing scenarios (< 50ms)
- LocalStorage operations shall be debounced (500ms)

### NFR-2: Usability

- All monetary values formatted with Icelandic number formatting (e.g., 500.000 kr)
- Life energy displayed with "klst" (hours) suffix
- Clear distinction between gross and net income
- Timeline shown in years and months (e.g., "3 ár og 7 mánuðir")
- Mobile-responsive design
- Accessible form inputs with proper labels

### NFR-3: Accessibility

- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG contrast requirements
- Keyboard navigation shall work throughout
- Screen reader compatible
- Charts shall have text alternatives

### NFR-4: Privacy

- All data stored client-side only
- No data sent to servers
- Export/import for user data portability
- Clear privacy notice

### NFR-5: Icelandic Context

- All UI text in Icelandic
- Currency in ISK
- Consider Icelandic work culture (part-time is less common but growing)
- Pension system accurately modeled (lífeyrissjóður)
- Healthcare note explains universal coverage

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Must gracefully handle missing expense baseline or actual hourly wage
- Cannot include tax optimization advice (legal constraints)

## Out of Scope

- Detailed tax calculations (complex and individualized)
- Pension fund withdrawal strategies
- Healthcare cost modeling (covered universally)
- Asset allocation advice
- Specific job recommendations or income sources
- Geographic arbitrage (moving to lower cost areas)
- Multiple currency support (ISK only)

## Success Criteria

1. User can calculate required part-time income in < 5 minutes
2. Clear understanding of gap period duration for different scenarios
3. Icelandic context (healthcare, pension) properly explained
4. Integration with expense baseline provides accurate calculations
5. Life energy visualization helps users evaluate lifestyle trade-offs
6. Users can compare multiple scenarios easily
7. Foundation for understanding when semi-retirement is achievable

## Glossary

| Term | Definition |
|------|------------|
| Barista FIRE | Semi-retirement strategy where part-time income covers living expenses while investments grow to full FI |
| Gap Period | Time between leaving full-time work and achieving full financial independence |
| Coast FIRE | Point where investments will grow to FI without additional contributions (part-time income only covers expenses) |
| FI Number | Target nest egg for financial independence (annual expenses × 25) |
| Part-Time Income | Income earned during gap period (after mandatory pension contributions) |
| Life Energy | Work hours required to earn income (amount ÷ actual hourly wage) |
| Lífeyrissjóður | Icelandic pension fund with mandatory contributions |
| Net Income | Income after mandatory pension contributions (16% total) |
| Acceleration Factor | How much part-time savings accelerate or delay full FI timeline |

## Icelandic Healthcare and Pension Context

### Universal Healthcare

Iceland has universal healthcare coverage (Sjúkratryggingar Íslands), which is NOT tied to employment:
- All residents have healthcare coverage regardless of employment status
- No need to maintain employer health insurance during part-time work
- This is a major difference from US Barista FIRE strategies (which focus on health insurance)
- Part-time workers have the same healthcare access as full-time workers

### Mandatory Pension Contributions

Iceland has mandatory pension contributions that apply to part-time work:
- **Employer contribution**: 12% of gross salary
- **Employee contribution**: 4% of gross salary
- **Total**: 16% of gross salary goes to lífeyrissjóður
- These contributions continue during part-time work
- Pension benefits are based on lifetime contributions
- Part-time work builds pension benefits (proportional to earnings)

### Work Culture Notes

- Part-time professional work less common than in some countries
- But growing trend, especially in creative/knowledge work
- Freelance and consulting more flexible
- Remote work opportunities increasing
- "Hlutastarf" (part-time) typically 50-80% of full-time

## Default Assumptions

These defaults can be overridden by user:

| Parameter | Default Value | Rationale |
|-----------|---------------|-----------|
| Investment Return Rate | 5% | Conservative real return (after inflation) |
| Safe Withdrawal Rate | 4% | Standard (25x expenses for FI number) |
| Pension Contribution | 16% | Mandatory Iceland rate (12% employer + 4% employee) |
| Current Full-Time Hours | 40 hours/week | Standard Icelandic work week |

## Example Scenarios

### Scenario 1: Coast FIRE (Break-Even)
- Current savings: 25,000,000 kr
- FI Number (Comfortable): 13,000,000 kr (520,000 kr/mån × 12 × 25)
- User already at Coast FIRE
- Part-time income only needs to cover expenses: 520,000 kr/mån
- Gap period depends on investment growth to full FI number

### Scenario 2: 50% Part-Time
- Current savings: 8,000,000 kr
- FI Number (Comfortable): 13,000,000 kr
- Gap: 5,000,000 kr
- Part-time income (50%): 300,000 kr/mån gross → 252,000 kr/mån net (after pension)
- Gap period: Needs additional savings since net income < expenses
- User needs to calculate sustainable timeline

### Scenario 3: Consulting (Above Expenses)
- Current savings: 10,000,000 kr
- FI Number (Barebones): 7,500,000 kr (250,000 kr/mån × 12 × 25)
- Part-time income: 400,000 kr/mán gross → 336,000 kr/mán net
- Expenses (Barebones): 250,000 kr/mán
- Savings: 86,000 kr/mán
- Accelerated FI timeline: Gap period shorter than Coast FIRE

## Requirements Traceability Matrix

| Requirement | User Story | Priority | Testable |
|-------------|------------|----------|----------|
| FR-1.1 | US-1 | High | Yes |
| FR-1.2 | US-1 | High | Yes |
| FR-1.3 | US-1 | High | Yes |
| FR-1.4 | US-2 | High | Yes |
| FR-1.5 | US-2 | High | Yes |
| FR-2.1 | US-3 | High | Yes |
| FR-2.2 | US-1, US-5 | High | Yes |
| FR-2.3 | US-4 | High | Yes |
| FR-2.4 | US-2 | Medium | Yes |
| FR-2.5 | US-2 | Medium | Yes |
| FR-3.1 | US-2 | High | Yes |
| FR-3.2 | US-2 | Medium | Yes |
| FR-3.3 | US-5 | Medium | Yes |
| FR-3.4 | US-2 | Medium | Yes |
| FR-3.5 | US-2 | Low | Yes |
| FR-4.1 | US-4 | High | Yes |
| FR-4.2 | US-4 | High | Yes |
| FR-4.3 | US-4 | Medium | Yes |
| FR-4.4 | US-4 | High | Yes |
| FR-4.5 | US-4 | High | Yes |
| FR-5.1-5.5 | US-6 | High | Yes |
| FR-6.1-6.5 | US-5 | Medium | Yes |
| FR-7.1-7.5 | US-2, US-3 | Low | Manual |
| FR-8.1-8.5 | - | Medium | Yes |

## Validation Checklist

Requirements are considered complete when:
- [x] All user stories have EARS format acceptance criteria
- [x] Functional requirements are specific and testable
- [x] Non-functional requirements have measurable targets
- [x] Icelandic context (healthcare, pension) documented
- [x] Integration points identified (expense baseline, life energy)
- [x] Success criteria defined
- [x] Out of scope items listed
- [x] Glossary includes all domain terms
- [x] Example scenarios provided
- [x] Traceability matrix complete

---

**Requirements Phase Complete**

This requirements document defines the Barista FIRE Planner with:
- 6 user stories with EARS acceptance criteria
- 8 functional requirement categories (39 specific requirements)
- 5 non-functional requirement categories
- Icelandic-specific healthcare and pension context
- Integration with expense baseline and life energy calculators
- Clear success criteria and validation metrics

Ready for Design Phase approval.
