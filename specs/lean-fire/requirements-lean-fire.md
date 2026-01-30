# Requirements: LeanFIRE Planner

## Overview

**Feature**: LeanFIRE Planner (Lágmarks FIRE Skipuleggjandi)
**Category**: FIRE Strategy Calculator (2.3)
**Dependencies**: Expense Baseline Tool (Barebones tier focus), FI Number Builder

## Problem Statement

Users interested in minimal-expense early retirement (LeanFIRE) need to understand:
1. What their true minimum viable expenses are (barebones survival)
2. How geographic arbitrage affects their timeline (rural vs urban Iceland)
3. What lifestyle sacrifices are required for extremely early retirement
4. How expense reduction scenarios impact their FI number and timeline
5. What frugality optimizations provide the biggest return on freedom

Without a LeanFIRE planner:
- Users can't quantify the impact of extreme frugality
- Geographic cost differences in Iceland remain invisible
- "What if I cut X?" questions are guesswork
- Minimum viable FI numbers are overestimated
- Frugality tips are generic, not personalized to their situation

The LeanFIRE Planner provides scenario-based expense reduction analysis, geographic cost comparison, and personalized frugality recommendations adapted for Iceland's cost structure.

## User Stories

### US-1: Calculate Minimum Viable FI Number

**As a** user pursuing LeanFIRE
**I want to** calculate my absolute minimum FI number based on barebones expenses
**So that** I can see the lowest possible retirement target

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the LeanFIRE Planner, the system SHALL display barebones expenses from their expense baseline
- WHEN showing barebones expenses, the system SHALL calculate minimum FI number (annual barebones × 25 or 30)
- WHERE the user hasn't completed expense baseline, the system SHALL show Icelandic minimum living costs (250,000-350,000 kr/month)
- IF the user selects a different multiplier, the system SHALL recalculate minimum FI number
- WHEN displaying FI number, the system SHALL show it in both total ISK and life energy hours (if AWH available)

### US-2: Compare Rural vs Urban Living Costs

**As a** user considering geographic arbitrage within Iceland
**I want to** compare barebones living costs in Reykjavík vs rural areas (landsbyggð)
**So that** I can see how relocation impacts my FI timeline

**Acceptance Criteria (EARS Format)**:
- WHEN the user selects location comparison, the system SHALL display side-by-side cost breakdowns for Reykjavík and rural Iceland
- WHEN showing location costs, the system SHALL highlight key differences (housing, transport, food)
- WHERE costs differ significantly, the system SHALL show percentage savings for rural living
- IF the user switches location, the system SHALL recalculate FI number and timeline to FIRE
- WHEN displaying timeline impact, the system SHALL show years/months saved by choosing rural location

### US-3: Run Expense Reduction Scenarios

**As a** user exploring extreme frugality
**I want to** model "what if I cut X?" scenarios for different expense categories
**So that** I can see which cuts give the biggest FI timeline improvement

**Acceptance Criteria (EARS Format)**:
- WHEN the user selects a category to cut, the system SHALL show current expense and reduction options (10%, 25%, 50%, eliminate)
- WHEN a reduction is applied, the system SHALL recalculate total monthly expenses, FI number, and timeline to FIRE
- WHERE multiple reductions are active, the system SHALL show cumulative impact on FI timeline
- IF a reduction creates unsustainably low expenses, the system SHALL warn the user
- WHEN displaying results, the system SHALL rank reductions by "months saved per 10,000 kr cut"

### US-4: Optimize Frugality with Personalized Tips

**As a** user committed to extreme frugality
**I want to** see personalized frugality tips based on my current expense baseline
**So that** I can identify overlooked savings opportunities

**Acceptance Criteria (EARS Format)**:
- WHEN the system analyzes expenses, it SHALL identify categories spending above Icelandic LeanFIRE minimums
- WHEN showing frugality tips, the system SHALL provide specific, actionable recommendations for each high-spend category
- WHERE tips reference Icelandic resources, the system SHALL include links or names (e.g., Bónus, Krónan for groceries)
- IF the user implements a tip, the system SHALL allow updating expenses and show new timeline
- WHEN prioritizing tips, the system SHALL sort by "impact on FI timeline" (most months saved first)

### US-5: Visualize Lifestyle Trade-Offs

**As a** user evaluating LeanFIRE feasibility
**I want to** see clear visualizations of lifestyle trade-offs vs timeline impact
**So that** I can make informed decisions about sacrifice vs speed to FI

**Acceptance Criteria (EARS Format)**:
- WHEN viewing trade-offs, the system SHALL display a chart showing expense level (X-axis) vs years to FI (Y-axis)
- WHEN showing scenarios, the system SHALL mark barebones, comfortable, and deluxe lifestyles on the chart
- WHERE user hovers on the chart, the system SHALL show detailed expense breakdown for that point
- IF the user adjusts expenses, the system SHALL update their position on the trade-off curve
- WHEN comparing lifestyles, the system SHALL show life energy cost difference in work years

### US-6: Understand Icelandic LeanFIRE Context

**As a** user planning LeanFIRE in Iceland
**I want to** understand Iceland-specific considerations for minimal living
**So that** my plan is realistic for the local cost structure

**Acceptance Criteria (EARS Format)**:
- WHEN displaying Icelandic context, the system SHALL explain universal healthcare impact (healthcare costs minimal)
- WHEN showing minimum expenses, the system SHALL reference seasonal work opportunities in Iceland
- WHERE housing options are discussed, the system SHALL mention rural property costs and rental options
- IF the user is considering rural living, the system SHALL note transportation limitations in remote areas
- WHEN providing context, the system SHALL use realistic Icelandic minimum values (250,000-350,000 kr/month total)

## Functional Requirements

### FR-1: Minimum FI Number Calculation

- FR-1.1: Calculate minimum FI number based on barebones tier from expense baseline
- FR-1.2: Support FI multipliers: 25x (4% withdrawal) and 30x (3.33% withdrawal)
- FR-1.3: Display FI number breakdown: monthly barebones × 12 × multiplier
- FR-1.4: Show FI number in ISK and life energy hours (if AWH available)
- FR-1.5: Recalculate automatically when barebones expenses change

### FR-2: Geographic Cost Comparison

- FR-2.1: Provide default barebones cost profiles for:
  - Reykjavík (capital): 320,000-350,000 kr/month
  - Landsbyggð (rural): 250,000-280,000 kr/month
- FR-2.2: Break down cost differences by category:
  - Housing (biggest difference: -40% rural)
  - Transport (varies: car needed in rural, public transit in city)
  - Food (slight difference: -10% rural with local sources)
  - Utilities (similar or higher in rural due to distance)
- FR-2.3: Calculate FI number difference between locations
- FR-2.4: Calculate timeline difference (years/months saved)
- FR-2.5: Display pros/cons list for each location

### FR-3: Expense Reduction Scenarios

- FR-3.1: Allow selecting categories to reduce:
  - Housing (downsize, roommates, move)
  - Food (meal prep, cheaper stores, reduce dining out)
  - Transport (bike, public transit, eliminate car)
  - Entertainment (free activities, library, outdoors)
  - Personal spending (minimize, DIY, secondhand)
- FR-3.2: Provide reduction options per category:
  - 10% reduction
  - 25% reduction
  - 50% reduction
  - Eliminate (if possible)
- FR-3.3: Calculate cumulative impact of multiple reductions
- FR-3.4: Show updated FI number and timeline for each scenario
- FR-3.5: Rank scenarios by "efficiency" (months saved per 10,000 kr cut)

### FR-4: Frugality Optimization Engine

- FR-4.1: Compare user's expenses to Icelandic LeanFIRE minimums
- FR-4.2: Identify high-spend categories (above LeanFIRE minimum)
- FR-4.3: Generate personalized frugality tips:
  - Housing: specific cheaper areas, housing co-ops, long-term rentals
  - Food: Bónus, Krónan, meal planning, bulk buying
  - Transport: Strætó bus pass, cycling, used cars vs new
  - Entertainment: free museums, hiking, library resources
- FR-4.4: Calculate ISK savings per tip
- FR-4.5: Calculate timeline impact per tip (months saved)
- FR-4.6: Sort tips by impact (biggest timeline improvement first)

### FR-5: Lifestyle Trade-Off Visualization

- FR-5.1: Create chart showing expense level vs years to FI curve
- FR-5.2: Mark three lifestyle points:
  - Barebones (LeanFIRE): minimum viable expenses
  - Comfortable: moderate quality of life
  - Deluxe: full lifestyle without sacrifices
- FR-5.3: Show user's current position on the curve
- FR-5.4: Interactive: click to see expense details for any point
- FR-5.5: Display life energy cost (work years) for each lifestyle level

### FR-6: Icelandic Context Panel

- FR-6.1: Display Iceland-specific LeanFIRE considerations:
  - Universal healthcare (major advantage over US LeanFIRE)
  - Seasonal work opportunities (tourism, agriculture)
  - Rural housing options and costs
  - Transportation realities (car needed in rural, buses in city)
  - Community resources (libraries, community centers)
- FR-6.2: Provide realistic minimum expense ranges for Iceland
- FR-6.3: Explain pension system impact (16% continues even in LeanFIRE)
- FR-6.4: Note safety net availability (unemployment, disability)

### FR-7: Integration with Expense Baseline

- FR-7.1: Load barebones tier from expense baseline
- FR-7.2: Use baseline categories for reduction scenarios
- FR-7.3: Auto-update when baseline changes
- FR-7.4: Fall back to Icelandic defaults if no baseline
- FR-7.5: Prompt to create baseline if missing

### FR-8: Data Persistence and Export

- FR-8.1: Save LeanFIRE scenarios to localStorage
- FR-8.2: Include in global export/import functions
- FR-8.3: Auto-save scenario changes (debounced)
- FR-8.4: Support deleting scenarios
- FR-8.5: Track scenario history for comparison

## Non-Functional Requirements

### NFR-1: Performance

- Calculations shall complete in < 100ms
- Chart rendering shall complete in < 300ms
- Scenario switching shall update in < 50ms
- LocalStorage operations shall be debounced (500ms)

### NFR-2: Usability

- All monetary values formatted with Icelandic number formatting (e.g., 250.000 kr)
- Timeline shown in years and months (e.g., "3 ár og 7 mánuðir")
- Reduction percentages clear and easy to adjust
- Mobile-responsive design
- Frugality tips actionable and specific

### NFR-3: Accessibility

- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG contrast requirements
- Chart shall have text alternative
- Keyboard navigation shall work throughout
- Screen reader compatible

### NFR-4: Privacy

- All data stored client-side only
- No data sent to servers
- Export/import for user data portability
- Clear privacy notice

### NFR-5: Icelandic Context

- All UI text in Icelandic
- Currency in ISK
- Expense defaults based on Icelandic minimums
- Geographic options reflect Iceland (not US/international)
- Resources and tips specific to Iceland

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Must handle missing expense baseline gracefully
- Cannot provide financial advice (legal constraints)

## Out of Scope

- International geographic arbitrage (Iceland only)
- Specific investment recommendations
- Tax optimization strategies
- Detailed budget tracking over time
- Bill payment reminders
- Automatic expense import from banks

## Success Criteria

1. User can calculate minimum FI number in < 2 minutes
2. Geographic comparison shows realistic Iceland cost differences
3. Expense reduction scenarios immediately update FI timeline
4. Frugality tips are specific and actionable for Iceland
5. Lifestyle trade-offs are clearly visualized
6. Integration with expense baseline works seamlessly
7. Users understand minimum viable living in Iceland

## Glossary

| Term | Icelandic | Definition |
|------|-----------|------------|
| LeanFIRE | Lágmarks FIRE | Financial Independence with minimal expenses (barebones living) |
| Barebones | Lágmarks | Minimum expenses needed to survive |
| Geographic Arbitrage | Landfræðileg hagræðing | Moving to lower cost area to reduce expenses |
| Landsbyggð | Landsbyggð | Rural Iceland (outside Reykjavík area) |
| FI Number | FI Tala | Target nest egg for financial independence |
| Expense Reduction | Útgjaldaminnkun | Cutting expenses to reduce FI number |
| Frugality Optimization | Sparneytn | Finding maximum savings opportunities |
| Life Energy | Lífsorka | Work hours required to earn money |

## Icelandic Minimum Living Costs (Barebones)

### Reykjavík (Urban) Barebones: 320,000-350,000 kr/month

| Category | Minimum | Notes |
|----------|---------|-------|
| Húsnæði (Housing) | 140,000 kr | Shared apartment, long-term rental, or studio |
| Matur (Food) | 35,000 kr | Bónus/Krónan, meal prep, minimal dining out |
| Samgöngur (Transport) | 12,000 kr | Strætó bus pass or cycling (no car) |
| Heilsa (Healthcare) | 3,000 kr | Minimal co-pays, universal coverage |
| Tryggingar (Insurance) | 5,000 kr | Basic renter's insurance |
| Veitur (Utilities) | 25,000 kr | Electricity, internet, phone (minimal plan) |
| Persónuleg (Personal) | 8,000 kr | Basic clothing, toiletries |
| Afþreying (Entertainment) | 5,000 kr | Library, free activities, hiking |
| Annað (Other) | 7,000 kr | Buffer for unexpected |
| **Samtals** | **240,000 kr** | Ultra-lean, requires discipline |

### Landsbyggð (Rural) Barebones: 250,000-280,000 kr/month

| Category | Minimum | Notes |
|----------|---------|-------|
| Húsnæði (Housing) | 80,000 kr | Lower rural rents or owned outright |
| Matur (Food) | 32,000 kr | Local sources, bulk buying, gardening |
| Samgöngur (Transport) | 25,000 kr | Car needed (fuel, insurance, maintenance) |
| Heilsa (Healthcare) | 3,000 kr | Same universal coverage |
| Tryggingar (Insurance) | 8,000 kr | Homeowner's, car insurance |
| Veitur (Utilities) | 30,000 kr | Higher heating, same internet/phone |
| Persónuleg (Personal) | 8,000 kr | Same as urban |
| Afþreying (Entertainment) | 3,000 kr | More free nature access |
| Annað (Other) | 11,000 kr | Larger buffer (remoteness) |
| **Samtals** | **200,000 kr** | Very lean, car dependency trade-off |

**Key Differences**:
- Housing: 60,000 kr/month savings (rural)
- Transport: 13,000 kr/month MORE (car needed)
- Net savings: ~40,000 kr/month (~480,000 kr/year = 12M kr less FI number at 25x)

## Default Expense Reduction Scenarios

### Scenario Templates

**Housing Reductions**:
- 10%: Negotiate rent, find cheaper neighborhood
- 25%: Downsize significantly, share apartment
- 50%: Move to rural, house-sit, live-in property management
- Eliminate: Not viable (housing required)

**Food Reductions**:
- 10%: Switch to Bónus/Krónan exclusively, reduce waste
- 25%: Meal prep all meals, buy in bulk, eliminate dining out
- 50%: Ultra-frugal (rice, beans, seasonal), community gardens
- Eliminate: Not viable (food required)

**Transport Reductions**:
- 10%: Reduce car usage, combine trips
- 25%: Sell car, use Strætó + occasional rental/taxi
- 50%: Bike + bus only, no car
- 100%: Bike only (urban only, not viable in rural)

**Entertainment Reductions**:
- 10%: Cancel some subscriptions, use free alternatives
- 25%: All free entertainment (library, hiking, free events)
- 50%: Minimal spending, focus on nature/reading
- 100%: Zero entertainment budget (extreme)

**Personal Spending Reductions**:
- 10%: Buy less, use what you have
- 25%: Secondhand only, DIY when possible
- 50%: Extreme minimalism, repair everything
- 75%: Near-zero personal spending (haircuts at home, etc.)

## Frugality Tips Database (Iceland-Specific)

### Housing
- Long-term rentals (cheaper than short-term)
- Housing co-ops (búsetukaupasamvinnufélög)
- House-sitting opportunities
- Consider Akureyri, Reykjanesbær (cheaper than Reykjavík)
- Winter rentals in summer tourist areas

### Food
- Shop at Bónus and Krónan (cheapest groceries)
- Buy seasonal produce
- Join food co-ops or buying clubs
- Use Matur.is for meal planning
- Reduce meat consumption
- Bring lunch to work (saves 30,000 kr/month)

### Transport
- Strætó monthly pass: 12,000 kr (unlimited bus)
- Cycling infrastructure good in Reykjavík
- Car-sharing services (cheaper than ownership)
- Samtök bicycles for used bikes
- Consider e-bike (saves on car)

### Entertainment
- Free museums on certain days
- National library resources (books, movies, music)
- Hiking and nature (Iceland's best free entertainment)
- Community centers (félagsmiðstöðvar)
- Free events at universities

### Utilities
- Energy-saving tips (Iceland has cheap electricity)
- Compare internet/phone providers (Nova, Síminn)
- Consider mobile-only (no landline internet)

## Requirements Traceability Matrix

| Requirement | User Story | Priority | Testable |
|-------------|------------|----------|----------|
| FR-1.1 | US-1 | High | Yes |
| FR-1.2 | US-1 | High | Yes |
| FR-1.3 | US-1 | Medium | Yes |
| FR-1.4 | US-1 | Medium | Yes |
| FR-1.5 | US-1 | Medium | Yes |
| FR-2.1-2.5 | US-2 | High | Yes |
| FR-3.1-3.5 | US-3 | High | Yes |
| FR-4.1-4.6 | US-4 | Medium | Yes |
| FR-5.1-5.5 | US-5 | Medium | Manual |
| FR-6.1-6.4 | US-6 | Low | Yes |
| FR-7.1-7.5 | US-1 | High | Yes |
| FR-8.1-8.5 | - | Medium | Yes |

## Validation Checklist

Requirements are considered complete when:
- [x] All user stories have EARS format acceptance criteria
- [x] Functional requirements are specific and testable
- [x] Non-functional requirements have measurable targets
- [x] Icelandic context documented (geographic, costs, resources)
- [x] Integration points identified (expense baseline, FI number, AWH)
- [x] Success criteria defined
- [x] Out of scope items listed
- [x] Glossary includes all domain terms
- [x] Default expense ranges provided for Iceland
- [x] Frugality tips database included
- [x] Traceability matrix complete

---

**Requirements Phase Complete**

This requirements document defines the LeanFIRE Planner with:
- 6 user stories with EARS acceptance criteria
- 8 functional requirement categories (42 specific requirements)
- 5 non-functional requirement categories
- Iceland-specific expense minimums for urban and rural living
- Geographic arbitrage comparison framework
- Expense reduction scenario system
- Frugality optimization engine
- Clear success criteria and validation metrics

Ready for Design Phase approval.
