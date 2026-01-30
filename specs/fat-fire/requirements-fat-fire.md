# Requirements: FatFIRE Planner

## Overview

**Feature**: FatFIRE Planner (Lúxus FIRE Áætlun)
**Category**: FIRE Planning Tool (3.1)
**Dependencies**: Expense Baseline Tool (2.1.11), FI Number Builder (3.5)

## Problem Statement

Users pursuing luxurious early retirement (FatFIRE) need specialized planning tools that account for abundant lifestyle without compromise. Traditional FIRE calculators focus on minimalism and frugality, leaving FatFIRE aspirants without guidance on:
1. Planning for premium lifestyle costs (700,000-1,000,000+ kr/month in Iceland)
2. Building "keep everything" scenarios that preserve current lifestyle quality
3. Incorporating splurge budgets for spontaneous luxury (travel, experiences, premium goods)
4. Calculating comfortable FI numbers with safety margins (30-33x multiplier)
5. Creating lifestyle wish lists and mapping them to financial requirements
6. Understanding the timeline to abundant retirement

Without a FatFIRE planner:
- Users underestimate the FI number needed for deluxe living
- Safety margins are inadequate for lifestyle preservation
- Splurge budgets aren't factored into planning
- Premium Icelandic living costs (housing in 101/105, international travel) are ignored
- Life energy required for abundance mindset is unclear
- Timeline expectations are unrealistic

The FatFIRE Planner provides specialized tools for planning luxurious early retirement with lifestyle preservation, abundance mindset, and comfortable safety margins adapted for Iceland's premium cost of living.

## User Stories

### US-1: Define Luxurious Lifestyle Goals

**As a** user pursuing FatFIRE
**I want to** define my ideal luxurious lifestyle without compromise
**So that** I can calculate the FI number needed for abundant retirement

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the FatFIRE Planner, the system SHALL display the Deluxe tier from their expense baseline
- WHEN defining lifestyle goals, the system SHALL provide a wish list builder for premium categories (housing, travel, experiences, luxury goods)
- WHEN adding wish list items, the system SHALL prompt for annual cost estimates
- IF the user hasn't created an expense baseline, the system SHALL guide them to create one focused on the Deluxe tier
- WHERE wish list items are added, the system SHALL add them to the total annual expenses

### US-2: Calculate Comfortable FI Number with Margin

**As a** user seeking financial security with abundance
**I want to** calculate my FI number with a comfortable safety margin
**So that** I never worry about running out of money in retirement

**Acceptance Criteria (EARS Format)**:
- WHEN calculating FI number, the system SHALL default to 30x multiplier (3.33% withdrawal rate)
- WHEN displaying multiplier options, the system SHALL offer 30x (conservative), 33x (very conservative), and custom options
- WHEN showing FI number, the system SHALL explain the safety margin: "With 30x, you can withdraw 3.33% annually with very high confidence"
- IF the user selects a multiplier below 28x, the system SHALL warn: "FatFIRE typically uses higher multipliers for security and comfort"
- WHERE the FI number is calculated, the system SHALL include base deluxe expenses + wish list items + splurge budget

### US-3: Plan Splurge Budget

**As a** user with an abundance mindset
**I want to** include a splurge budget for spontaneous luxury
**So that** I can enjoy guilt-free spending without impacting my FI plan

**Acceptance Criteria (EARS Format)**:
- WHEN setting up splurge budget, the system SHALL prompt for annual amount (e.g., 1,000,000-3,000,000 kr/year)
- WHEN displaying splurge budget, the system SHALL show examples: "International travel, spontaneous purchases, premium experiences, luxury gifts"
- WHEN calculating total expenses, the system SHALL add splurge budget to base expenses
- IF splurge budget exceeds 20% of base expenses, the system SHALL note: "Generous splurge budget! This adds flexibility."
- WHERE splurge budget is shown, the system SHALL convert to monthly/weekly amounts for context

### US-4: Create Lifestyle Wish List

**As a** user planning abundant retirement
**I want to** create a detailed wish list of lifestyle elements I want to keep or add
**So that** I ensure my FI number supports my ideal life

**Acceptance Criteria (EARS Format)**:
- WHEN creating wish list, the system SHALL provide categories: Premium Housing, International Travel, Premium Healthcare, Luxury Experiences, High-End Dining, Premium Vehicles, Hobby/Collection Budgets, Other
- WHEN adding items, the system SHALL prompt for: item name, annual cost, priority (must-have/nice-to-have)
- WHEN viewing wish list, the system SHALL show total annual cost and impact on FI number
- IF wish list is empty, the system SHALL suggest starting with: "What does your ideal week look like? What experiences do you want?"
- WHERE items are marked "must-have," the system SHALL include in base FI number; "nice-to-have" shown separately

### US-5: Calculate Timeline to FatFIRE

**As a** user with FatFIRE goals
**I want to** see realistic timeline projections for reaching my comfortable FI number
**So that** I can set expectations and plan accordingly

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters current savings and savings rate, the system SHALL calculate years to FatFIRE
- WHEN displaying timeline, the system SHALL show: current age, FatFIRE age, years until FatFIRE, calendar date
- WHEN showing projections, the system SHALL use conservative growth assumptions (5-7% real return)
- IF timeline exceeds 20 years, the system SHALL suggest: "Consider hybrid strategies: Coast FIRE, Barista FIRE, or adjusted expense tiers"
- WHERE savings rate is insufficient, the system SHALL calculate required monthly savings to hit target date

### US-6: Compare "Keep Everything" Scenarios

**As a** user who doesn't want to sacrifice lifestyle
**I want to** see scenarios where I keep my current spending level vs. optimized deluxe spending
**So that** I can decide whether to adjust lifestyle or save longer

**Acceptance Criteria (EARS Format)**:
- WHEN creating scenarios, the system SHALL offer: "Current Lifestyle" (import actual spending), "Optimized Deluxe" (expense baseline deluxe tier), "Custom"
- WHEN comparing scenarios, the system SHALL show side-by-side: FI number, years to FatFIRE, monthly savings required
- WHEN displaying "Current Lifestyle," the system SHALL note: "This preserves everything you currently spend"
- IF "Current Lifestyle" significantly exceeds "Optimized Deluxe," the system SHALL suggest: "Review expenses—you may be able to reach FatFIRE faster"
- WHERE scenarios differ by >30%, the system SHALL highlight the lifestyle trade-offs

### US-7: Understand Premium Icelandic Living Costs

**As a** user in Iceland pursuing FatFIRE
**I want to** see realistic estimates for deluxe living in Iceland
**So that** my planning accounts for local premium costs

**Acceptance Criteria (EARS Format)**:
- WHEN viewing default deluxe expenses, the system SHALL show Icelandic premium ranges: housing (250,000-450,000 kr/month in 101/105), dining (80,000-150,000 kr/month), travel (300,000-800,000 kr/year international)
- WHEN calculating travel budget, the system SHALL note: "Iceland is remote—international travel is expensive but essential for many FatFIRE lifestyles"
- WHEN showing housing, the system SHALL display: "Premium locations: Reykjavík 101/105, coastal properties, or equivalent mortgage-free value"
- IF the user selects housing <200,000 kr/month, the system SHALL note: "This may be below premium housing in Reykjavík"
- WHERE healthcare is shown, the system SHALL note: "Iceland has universal healthcare, but private insurance and international care may apply"

### US-8: Visualize Life Energy to Abundance

**As a** user thinking in life energy terms
**I want to** see how many work hours are required to achieve FatFIRE
**So that** I can evaluate whether the trade-off is worth it

**Acceptance Criteria (EARS Format)**:
- WHEN actual hourly wage is available, the system SHALL display FI number in work hours
- WHEN showing timeline, the system SHALL show total life energy hours over the savings period
- WHEN comparing to LeanFIRE or standard FIRE, the system SHALL show: "FatFIRE requires X more years of work but preserves lifestyle completely"
- IF actual hourly wage is not available, the system SHALL prompt to calculate it first
- WHERE life energy exceeds 80,000 hours (40+ years), the system SHALL suggest: "Very long timeline—consider Coast FIRE or Barista FIRE to reduce active working years"

### US-9: Plan for Premium Lifestyle Preservation

**As a** user committed to lifestyle quality
**I want to** ensure my plan preserves all elements I value
**So that** I don't sacrifice what makes life enjoyable

**Acceptance Criteria (EARS Format)**:
- WHEN reviewing lifestyle elements, the system SHALL prompt: "What do you refuse to give up? Premium dining, travel, hobbies, living location?"
- WHEN these are defined, the system SHALL lock them as "must-have" in calculations
- WHEN showing FI number, the system SHALL break down: "Your FI number includes: base living (X kr), premium elements (Y kr), splurge budget (Z kr)"
- IF must-have items total >60% of expenses, the system SHALL note: "Your lifestyle priorities are clear! This is what FatFIRE is about."
- WHERE trade-offs are needed, the system SHALL suggest adjusting "nice-to-have" items first

### US-10: Access Educational Content on FatFIRE

**As a** user new to FatFIRE concepts
**I want to** learn about the FatFIRE philosophy and strategy
**So that** I understand the abundance mindset and planning approach

**Acceptance Criteria (EARS Format)**:
- WHEN opening the planner, the system SHALL provide a collapsible "What is FatFIRE?" section
- WHEN explaining FatFIRE, the system SHALL contrast with LeanFIRE and standard FIRE: "FatFIRE = no lifestyle compromise, comfortable margins, abundance mindset"
- WHEN showing examples, the system SHALL use realistic Icelandic scenarios
- IF the user is exploring from LeanFIRE/standard FIRE, the system SHALL explain: "FatFIRE requires more savings but offers complete lifestyle freedom"
- WHERE the system provides tips, it SHALL include: "FatFIRE suits high earners, dual income households, and those who love their lifestyle"

## Functional Requirements

### FR-1: FI Number Calculation with Premium Multipliers

- FR-1.1: Calculate FI number using formula: (Base Deluxe Expenses + Wish List + Splurge Budget) × Multiplier
- FR-1.2: Default multiplier: 30x (3.33% withdrawal rate)
- FR-1.3: Support multipliers: 28x (3.57%), 30x (3.33%), 33x (3.03%), custom (25-40x range)
- FR-1.4: Display FI number breakdown: base (X kr), wish list (Y kr), splurge (Z kr), total (W kr), multiplier (Mx), FI number (W × M kr)
- FR-1.5: Recalculate automatically when any component changes

### FR-2: Deluxe Expense Baseline Integration

- FR-2.1: Load Deluxe tier from expense baseline if it exists
- FR-2.2: If no baseline exists, prompt to create one with focus on Deluxe tier
- FR-2.3: Display current deluxe tier expenses with categories
- FR-2.4: Allow direct editing of deluxe expenses within planner
- FR-2.5: Sync changes back to expense baseline
- FR-2.6: Provide Icelandic premium defaults:
  - Housing: 300,000 kr/month (premium Reykjavík or mortgage equivalent)
  - Food: 100,000 kr/month (dining out, premium groceries, delivery)
  - Transport: 70,000 kr/month (premium vehicle, maintenance, parking)
  - Travel: 600,000 kr/year (international trips, spontaneous travel)
  - Entertainment: 80,000 kr/month (subscriptions, experiences, hobbies)
  - Personal: 50,000 kr/month (premium grooming, clothing, wellness)
  - Other: 50,000 kr/month (miscellaneous luxury)

### FR-3: Lifestyle Wish List Builder

- FR-3.1: Support categories: Premium Housing, International Travel, Premium Healthcare, Luxury Experiences, High-End Dining, Premium Vehicles, Hobby/Collection Budgets, Other
- FR-3.2: For each item: name (text), annual cost (ISK), priority (must-have/nice-to-have), notes (optional)
- FR-3.3: Calculate total wish list cost (annual)
- FR-3.4: Show impact on FI number: "Adding X kr/year to expenses increases FI number by Y kr"
- FR-3.5: Allow reordering, editing, deleting items
- FR-3.6: Persist wish list to localStorage
- FR-3.7: Distinguish must-have (included in base FI) vs nice-to-have (shown separately)

### FR-4: Splurge Budget Planning

- FR-4.1: Accept annual splurge budget amount (ISK)
- FR-4.2: Suggest typical ranges: 1,000,000 kr (modest), 2,000,000 kr (comfortable), 3,000,000+ kr (generous)
- FR-4.3: Show monthly/weekly equivalents: "X kr/year = Y kr/month = Z kr/week"
- FR-4.4: Display example uses: "Spontaneous trips, luxury purchases, premium gifts, surprise experiences"
- FR-4.5: Calculate percentage of base expenses
- FR-4.6: Add to total annual expenses for FI number calculation
- FR-4.7: Optional: track "splurge categories" for more detail

### FR-5: Timeline Projections

- FR-5.1: Input: current savings, monthly savings rate, expected return (default 6% real)
- FR-5.2: Calculate years to reach FI number
- FR-5.3: Display: current age, FatFIRE age, years to FatFIRE, calendar date
- FR-5.4: Show milestone markers: 25% FI, 50% FI, 75% FI, 100% FI
- FR-5.5: Project nest egg value over time with growth
- FR-5.6: Show total contributions vs. growth breakdown
- FR-5.7: Option to adjust target FatFIRE date and calculate required savings

### FR-6: Scenario Comparison

- FR-6.1: Support up to 3 named scenarios
- FR-6.2: Preset scenarios:
  - "Current Lifestyle": user inputs current monthly spending
  - "Optimized Deluxe": uses expense baseline deluxe tier
  - "Custom": fully customizable
- FR-6.3: For each scenario, calculate: FI number, years to FatFIRE, monthly savings required
- FR-6.4: Display side-by-side comparison table
- FR-6.5: Highlight differences: time difference, FI number difference, lifestyle trade-offs
- FR-6.6: Allow switching between scenarios
- FR-6.7: Save all scenarios to localStorage

### FR-7: Life Energy Calculations

- FR-7.1: Load actual hourly wage from CalculatorContext
- FR-7.2: Convert FI number to total work hours required
- FR-7.3: Show work hours over savings period
- FR-7.4: Display work years equivalent (hours / 2080)
- FR-7.5: Compare to LeanFIRE/standard FIRE work hours
- FR-7.6: Show trade-off: "FatFIRE requires X more years but preserves lifestyle"
- FR-7.7: If AWH not available, prompt to calculate with link to AWH calculator

### FR-8: Visualization

- FR-8.1: Expense breakdown pie chart: base deluxe + wish list + splurge budget
- FR-8.2: Timeline chart: path to FatFIRE with milestones (25%, 50%, 75%, 100% FI)
- FR-8.3: Scenario comparison chart: side-by-side FI numbers and timelines
- FR-8.4: Progress gauge: current FI percentage
- FR-8.5: Color scheme: gold/amber tones for luxury feel
- FR-8.6: Mobile-responsive charts

### FR-9: Educational Content

- FR-9.1: Collapsible "What is FatFIRE?" section explaining:
  - FatFIRE definition and philosophy
  - Difference from LeanFIRE/standard FIRE
  - Abundance mindset vs. frugality mindset
  - Who FatFIRE suits best
  - Realistic expectations
- FR-9.2: Tooltips explaining:
  - 30x multiplier rationale
  - Splurge budget concept
  - Wish list vs. base expenses
  - Icelandic premium costs context
- FR-9.3: Inline suggestions:
  - "Consider Coast FIRE if timeline too long"
  - "Review high expense categories for optimization"
  - "Build wish list thoughtfully—quality over quantity"

### FR-10: Data Persistence

- FR-10.1: Save to localStorage:
  - Wish list items
  - Splurge budget
  - Selected multiplier
  - Scenarios (up to 3)
  - Current savings, savings rate
  - Last updated timestamp
- FR-10.2: Load saved state on page load
- FR-10.3: Include in global export/import functions
- FR-10.4: Auto-save with debounce (500ms)
- FR-10.5: Support "reset to defaults" function

## Non-Functional Requirements

### NFR-1: Performance

- All calculations shall complete in < 100ms
- Charts shall render in < 300ms
- Real-time updates when changing inputs (< 50ms)
- LocalStorage operations shall be debounced (500ms)
- Page shall load in < 2 seconds

### NFR-2: Usability

- All monetary values formatted with Icelandic number formatting (e.g., 500.000 kr)
- Life energy displayed with "klst" (hours) suffix
- Timeline shown in years and months (e.g., "12 ár og 3 mánuðir")
- Premium/luxury visual theme (gold accents, refined typography)
- Clear distinction between must-have and nice-to-have items
- Mobile-responsive design
- Accessible form inputs with proper labels
- Tooltips for educational content
- Plain language Icelandic throughout

### NFR-3: Accuracy

- FI number calculations accurate to within 0.1%
- Timeline projections use realistic growth assumptions
- Compound interest calculations precise
- Life energy conversions mathematically correct
- Icelandic expense defaults based on current market data

### NFR-4: Accessibility

- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG 2.1 AA contrast requirements (4.5:1)
- Keyboard navigation shall work throughout
- Screen reader compatible
- Charts shall have text alternatives
- Focus indicators clearly visible
- Touch targets minimum 44x44 pixels on mobile

### NFR-5: Icelandic Context

- All UI text in Icelandic
- Currency in ISK with proper formatting
- Default expense values reflect Icelandic premium costs
- Retirement age default: 67 (Icelandic retirement age, but FatFIRE typically earlier)
- Educational content mentions Icelandic context (universal healthcare, lífeyrissjóður)
- Travel budget accounts for Iceland's remote location

### NFR-6: Visual Design

- Luxury/premium aesthetic (gold/amber accent colors)
- Refined typography (serif or elegant sans-serif)
- Generous whitespace
- High-quality iconography
- Celebratory tone (abundance mindset)
- Aspirational but realistic messaging

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library (can extend with premium styling)
- Must work without user account (privacy-first)
- Must use Deluxe tier from Expense Baseline Tool
- Must handle users without Expense Baseline (prompt to create)
- Calculations must be transparent (show formulas used)

## Out of Scope

- Tax optimization strategies (complex, varies by situation)
- Investment allocation recommendations (not financial advice)
- Specific luxury purchase recommendations
- Real estate investment analysis
- International tax planning
- Historical market data analysis
- Monte Carlo simulations (Phase 2 feature)

## Success Criteria

1. User can define luxurious lifestyle with wish list in < 15 minutes
2. FI number calculated with comfortable margin (30x default)
3. Timeline projections realistic and achievable
4. Splurge budget integrated seamlessly
5. Educational content makes FatFIRE philosophy clear
6. Icelandic premium costs accurately reflected
7. Visual design feels aspirational and premium
8. Integration with Expense Baseline Tool works seamlessly
9. Life energy calculations provide meaningful context
10. Scenario comparison helps decision-making

## Glossary

| Term | Icelandic | Definition |
|------|-----------|------------|
| FatFIRE | Lúxus FIRE | Financial Independence with luxurious lifestyle, no compromise |
| LeanFIRE | Sparnaður FIRE | Minimalist Financial Independence |
| Splurge Budget | Aukaútgjaldaáætlun | Annual budget for spontaneous luxury spending |
| Wish List | Óskarlisti | List of lifestyle elements to preserve or add |
| Must-Have | Nauðsynlegt | Essential lifestyle elements (included in base FI) |
| Nice-to-Have | Gott-að-hafa | Optional lifestyle elements (shown separately) |
| Abundance Mindset | Gnægðarhugsun | Philosophy of living fully without sacrifice |
| Premium Living | Lúxuslíf | High-quality lifestyle without financial worry |
| Safety Margin | Öryggismörk | Extra cushion in FI number (30x vs 25x multiplier) |
| Lifestyle Preservation | Lífsstílsvernd | Maintaining current quality of life in retirement |

## Default Icelandic FatFIRE Values

| Parameter | Default Value | Notes |
|-----------|---------------|-------|
| FI Multiplier | 30x | 3.33% withdrawal rate for safety |
| Expected Return (Conservative) | 5% | Real return for projections |
| Expected Return (Moderate) | 6% | Real return for projections |
| Expected Return (Optimistic) | 7% | Real return for projections |
| Housing (Premium) | 300,000 kr/month | Reykjavík 101/105 or equivalent |
| Food (Deluxe) | 100,000 kr/month | Fine dining, premium groceries |
| Travel (Annual) | 600,000 kr/year | International trips from Iceland |
| Splurge Budget (Typical) | 2,000,000 kr/year | Spontaneous luxury |
| Total Deluxe Expenses | 1,000,000 kr/month | Comfortable premium living |
| FatFIRE Target Age | 50-55 years | Earlier than standard retirement |

## Validation Rules

### Input Validation

- Current savings: ≥ 0 kr
- Monthly savings rate: ≥ 0 kr
- Expected return: 0-15% (warn if outside 4-8%)
- FI multiplier: 25-40x (warn if <28x for FatFIRE)
- Splurge budget: 0-10,000,000 kr/year (warn if >50% of base expenses)
- Wish list item cost: 0-50,000,000 kr/year per item
- Current age: 18-100 years
- Target FatFIRE age: Current age + 1 to 100 years

### Calculation Validation

- FI number must be > 0
- Timeline must be calculable (savings rate sufficient)
- If timeline >40 years, suggest reviewing goals
- If monthly savings required exceeds reasonable income, flag as unrealistic
- If splurge budget >50% of base expenses, suggest reviewing
- If wish list total >3x base expenses, note as "very aggressive FatFIRE"

## Edge Cases

1. **Already FatFIRE**: Current savings exceed FI number
   - Show celebratory message
   - Display: "You've reached FatFIRE! Consider when to retire."
   - Suggest reviewing withdrawal strategies

2. **Timeline Too Long**: >25 years to FatFIRE
   - Flag as potentially unrealistic
   - Suggest: Coast FIRE, Barista FIRE, or adjusting expense tier
   - Show comparison: "Standard FIRE in X years vs FatFIRE in Y years"

3. **Insufficient Savings Rate**: Can't reach FatFIRE with current savings
   - Calculate required monthly savings
   - If unrealistic, suggest: "Consider Barista FIRE or delaying FatFIRE age"
   - Show gap clearly

4. **No Expense Baseline**: User hasn't created baseline
   - Prompt to create Expense Baseline Tool first
   - Offer to proceed with manual input
   - Show benefits of using baseline

5. **Wish List Exceeds Base**: Wish list costs more than base expenses
   - This is valid for FatFIRE (lifestyle additions)
   - Confirm: "Your wish list is ambitious! This is true FatFIRE planning."
   - Show total clearly

6. **Very High Splurge Budget**: >30% of base expenses
   - Valid but noteworthy
   - Note: "Generous splurge budget increases FI number significantly"
   - Show impact clearly

## Integration Points

### With Expense Baseline Tool

- Fetch Deluxe tier expenses
- Allow editing deluxe expenses in-place
- Sync changes back to baseline
- React to baseline updates
- Offer to create baseline if missing

### With FI Number Builder

- Share calculated FI number
- Use as input to other calculators
- Consistent multiplier approach
- Cross-reference results

### With Actual Hourly Wage

- Fetch AWH for life energy calculations
- Convert FI number and timeline to work hours
- Show life energy trade-offs
- Prompt to calculate if not available

### With Calculator Context

- Use shared current age, savings data
- Emit FatFIRE status events
- Persist to shared localStorage
- Coordinate with other FIRE calculators

## User Flow

### First-Time User Flow

1. Land on FatFIRE Planner page
2. See educational intro: "What is FatFIRE?"
3. Check if Expense Baseline exists:
   - **Yes**: Load Deluxe tier automatically
   - **No**: Prompt to create baseline OR enter expenses manually
4. Review/edit base deluxe expenses
5. Build lifestyle wish list (optional but recommended)
6. Set splurge budget
7. Review total annual expenses
8. Select FI multiplier (default 30x)
9. See FI number calculated with breakdown
10. Enter current savings and monthly savings rate
11. See timeline projection with milestones
12. Optionally create scenarios for comparison
13. Review life energy (if AWH available)
14. Save plan automatically

### Returning User Flow

1. Load saved FatFIRE plan
2. See updated calculations if expense baseline changed
3. Review timeline progress
4. Adjust wish list or splurge budget as needed
5. Compare scenarios if created
6. Track progress toward FatFIRE

## Related Features

- **Expense Baseline Tool** (2.1.11): Provides Deluxe tier expenses
- **FI Number Builder** (3.5): Shares FI number calculation approach
- **Coast FIRE Calculator** (3.2): Alternative if FatFIRE timeline too long
- **Barista FIRE Planner** (3.3): Hybrid strategy option
- **Retirement Date Simulator** (3.4): Post-FatFIRE planning

## Educational Content Needed

### "What is FatFIRE?" Explainer

- Definition: Financial Independence with luxurious lifestyle, no compromise
- Philosophy: Abundance mindset, lifestyle preservation, comfortable margins
- Contrast with LeanFIRE: No frugality required, keep premium lifestyle
- Who it suits: High earners, dual income, those who love their lifestyle
- Realistic expectations: Requires more savings, longer timeline, but complete freedom
- Icelandic context: Premium living in Reykjavík, international travel, quality of life

### Safety Margin (30x Multiplier) Explanation

- Why 30x vs 25x: Lower withdrawal rate (3.33% vs 4%) for extra security
- Historical data: 30x provides very high confidence in perpetual withdrawals
- FatFIRE philosophy: Comfort and abundance require margin
- Trade-off: Longer savings period but much lower stress in retirement
- Option to customize based on risk tolerance

### Splurge Budget Concept

- Purpose: Spontaneous luxury without guilt or calculation
- Typical uses: Impromptu travel, luxury purchases, premium experiences, generous gifts
- Why it matters: Abundance mindset includes flexibility
- How to set: 5-15% of base expenses typical, 15-30% generous
- Integration: Added to annual expenses, increases FI number proportionally

### Lifestyle Wish List Philosophy

- Purpose: Ensure FI number supports desired life
- Must-have vs nice-to-have: Prioritization approach
- Quality over quantity: Focus on what truly matters
- Examples: Premium housing, international travel, hobbies, experiences
- Icelandic context: Premium Reykjavík living, escape from remote location

### "What if Timeline Too Long?"

- Alternative strategies: Coast FIRE, Barista FIRE
- Expense tier adjustment: Move to Comfortable tier
- Hybrid approaches: Partial FatFIRE elements
- Income optimization: Increase earnings potential
- Delayed FatFIRE: Plan for later FatFIRE age

## Accessibility Requirements

### Screen Reader Support

- Chart data announced with key milestones
- FI number breakdown announced clearly
- Wish list items read in logical order
- Status updates announced (e.g., "FI number updated")
- Scenario comparison table navigable

### Keyboard Navigation

- Tab through all inputs in logical order
- Wish list reorderable with keyboard
- Charts zoomable/pannable with keyboard
- Scenarios switchable with keyboard
- Enter key submits/calculates

### Visual Requirements

- Minimum contrast ratio 4.5:1 (even with gold accents)
- Charts distinguishable without color alone (patterns, labels)
- Status indicators use icons + text + color
- Text remains readable at 200% zoom
- Premium styling doesn't compromise accessibility

### Mobile Accessibility

- Touch targets minimum 44x44 pixels
- Charts pinch-to-zoom enabled
- Form inputs trigger appropriate keyboards
- Wish list items easy to reorder on touch
- Scenarios swipeable on mobile

---

**Requirements Phase Complete: Ready for Design Phase**
