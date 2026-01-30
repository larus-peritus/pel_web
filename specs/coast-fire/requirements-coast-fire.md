# Requirements: Coast FIRE Calculator

## Overview

**Feature**: Coast FIRE Calculator (Ró FIRE Reiknivél)
**Category**: FIRE Planning Tool (3.2)
**Dependencies**: Expense Baseline Tool (2.1.11), Actual Hourly Wage Calculator

## Problem Statement

Users pursuing Financial Independence need to know **when their investments can "coast" to FI** without additional contributions. Coast FIRE represents a critical milestone where:
1. You've saved enough that compound growth alone will reach your FI number by target retirement age
2. You can stop prioritizing savings and reduce work intensity
3. You gain psychological freedom even before full FI

Without a Coast FIRE calculator:
- Users don't know when they've reached this milestone
- Over-saving continues unnecessarily
- Opportunities for career flexibility are missed
- Life energy continues to be exchanged for savings that aren't needed

The Coast FIRE Calculator provides clear answers about when current investments will grow to meet FI goals, enabling informed decisions about work and lifestyle changes.

## User Stories

### US-1: Calculate Coast FIRE Date
**As a** user with existing investments
**I want to** know when my current balance will grow to my FI number
**So that** I can plan when I can stop saving and "coast"

**Acceptance Criteria (EARS Format)**:
- WHEN the user enters current investment balance, target FI number, expected return, and target retirement age, the system SHALL calculate the Coast FIRE date
- WHEN displaying results, the system SHALL show the age/date when coasting begins
- IF user has already reached Coast FIRE, the system SHALL display "You are already coasting!" message
- WHEN showing the Coast FIRE date, the system SHALL display it in both age and calendar date

### US-2: See Investment Growth Projection
**As a** user planning for Coast FIRE
**I want to** visualize how my investments grow to my FI number
**So that** I can understand the compound growth trajectory

**Acceptance Criteria (EARS Format)**:
- WHEN Coast FIRE is calculated, the system SHALL display a line chart showing investment growth from current age to target retirement age
- WHEN displaying the chart, the system SHALL mark the Coast FIRE milestone clearly
- WHERE the user hovers over the chart, the system SHALL show balance at that age
- IF target FI number changes, the system SHALL update the chart immediately

### US-3: Use Expense Baseline for FI Number
**As a** user who has completed the Expense Baseline Tool
**I want to** automatically calculate my FI number from my expense tier
**So that** I don't have to manually enter my target expenses

**Acceptance Criteria (EARS Format)**:
- WHEN the user has a saved expense baseline, the system SHALL offer to use it for FI number calculation
- WHEN displaying tier options, the system SHALL show all three tiers (Barebones/Comfortable/Deluxe) with their FI numbers
- IF the user selects a tier, the system SHALL calculate FI number as annual expenses × multiplier (25x default)
- WHEN the expense baseline changes, the system SHALL update the FI number automatically

### US-4: Explore Different Scenarios
**As a** user evaluating Coast FIRE strategies
**I want to** test different return rates and target ages
**So that** I can understand the sensitivity and plan conservatively

**Acceptance Criteria (EARS Format)**:
- WHEN adjusting expected return rate, the system SHALL recalculate Coast FIRE date in real-time
- WHEN adjusting target retirement age, the system SHALL show how much more (or less) is needed to coast
- WHERE the system displays scenarios, it SHALL show at minimum three return rates (conservative/moderate/optimistic)
- IF inputs make Coast FIRE impossible (e.g., return too low, timeline too short), the system SHALL show clear messaging about the gap

### US-5: Understand Life Energy Impact
**As a** user thinking in terms of life energy
**I want to** see Coast FIRE in work hours not just dollars
**So that** I can make meaningful decisions about work-life balance

**Acceptance Criteria (EARS Format)**:
- WHEN actual hourly wage is available, the system SHALL display current investments in work hours
- WHEN showing the gap to Coast FIRE, the system SHALL display it in both ISK and life energy hours
- WHERE the user sees Coast FIRE results, the system SHALL show "hours of work saved" from compound growth
- IF actual hourly wage is not available, the system SHALL prompt to calculate it first

### US-6: Compare Coast FIRE vs Full FI
**As a** user planning my FIRE journey
**I want to** see the difference between Coast FIRE and Full FI dates
**So that** I can understand the trade-offs

**Acceptance Criteria (EARS Format)**:
- WHEN calculating Coast FIRE, the system SHALL also display the "current trajectory" FI date (if continuing to save)
- WHEN showing both dates, the system SHALL highlight the time difference in years/months
- WHERE both scenarios are shown, the system SHALL explain what each means for work and lifestyle
- IF continuing to save, the system SHALL show annual contribution required for Full FI timeline

### US-7: Adjust FI Multiplier
**As a** user with different risk tolerance
**I want to** adjust the FI multiplier (25x vs 30x vs custom)
**So that** I can plan based on my personal safety margin

**Acceptance Criteria (EARS Format)**:
- WHEN entering FI number, the system SHALL offer preset multipliers (25x, 30x) and custom option
- WHEN displaying multiplier options, the system SHALL explain what each means (e.g., 25x = 4% withdrawal, 30x = 3.33% withdrawal)
- IF the user selects a multiplier, the system SHALL recalculate FI number and Coast FIRE date
- WHERE multiplier impacts results significantly, the system SHALL show comparison of outcomes

## Functional Requirements

### FR-1: Core Calculation
- FR-1.1: Calculate future value using compound growth formula: FV = PV × (1 + r)^t
- FR-1.2: Determine Coast FIRE date by solving for t when FV equals FI number
- FR-1.3: Support annual compounding (default) with option for monthly compounding
- FR-1.4: Calculate years until Coast FIRE with precision to months
- FR-1.5: Handle edge cases: already coasting, impossible scenarios, negative returns

### FR-2: FI Number Integration
- FR-2.1: Allow manual FI number input with currency formatting
- FR-2.2: Integrate with Expense Baseline Tool to fetch tier-based expenses
- FR-2.3: Calculate FI number as: annual expenses × multiplier
- FR-2.4: Support preset multipliers: 25x (4% rule), 30x (3.33% rule), custom
- FR-2.5: Display breakdown: monthly expenses → annual expenses → FI number

### FR-3: Scenario Analysis
- FR-3.1: Provide sliders for: expected return rate (0-15%), target retirement age (40-80)
- FR-3.2: Show three return scenarios side-by-side:
  - Conservative: 5% real return
  - Moderate: 7% real return (default)
  - Optimistic: 9% real return
- FR-3.3: Display sensitivity table showing how Coast FIRE date changes with return rate
- FR-3.4: Allow comparison of different FI number targets

### FR-4: Visualization
- FR-4.1: Line chart showing investment growth from current age to target retirement age
- FR-4.2: Mark Coast FIRE milestone on the chart
- FR-4.3: Show FI number target line
- FR-4.4: Display current balance starting point
- FR-4.5: Highlight "coasting period" (between Coast FIRE and Full FI) in different color

### FR-5: Life Energy Display
- FR-5.1: Convert current investments to work hours (balance ÷ actual hourly wage)
- FR-5.2: Show gap to Coast FIRE in work hours
- FR-5.3: Display "passive hours earned" from compound growth
- FR-5.4: Calculate total life energy saved by reaching Coast FIRE vs continuing full savings

### FR-6: Results Summary
- FR-6.1: Display Coast FIRE status: "Already Coasting" or "Coast at age X (YYYY-MM-DD)"
- FR-6.2: Show current investment balance and FI number target
- FR-6.3: Calculate and display:
  - Years until Coast FIRE
  - Amount needed to reach Coast FIRE
  - Projected balance at target retirement age
  - Time saved vs continuing to save to Full FI
- FR-6.4: Provide plain-language summary in Icelandic

### FR-7: Data Persistence
- FR-7.1: Save Coast FIRE inputs to localStorage
- FR-7.2: Load saved values on page load
- FR-7.3: Include in global export/import functionality
- FR-7.4: Update automatically when Expense Baseline changes (if using baseline for FI number)

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 50ms
- Chart rendering shall complete in < 300ms
- Slider adjustments shall update results in real-time (< 100ms)

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (500.000 kr)
- Percentage values shown with 1-2 decimal places
- Age displayed in years and months
- Mobile-responsive design with touch-friendly sliders
- Clear educational content explaining Coast FIRE concept

### NFR-3: Accuracy
- Use precise compound interest formulas
- Handle floating-point precision correctly
- Validate that target retirement age > current age
- Validate that expected return is reasonable (warn if >12% or <0%)
- Account for time with month-level precision

### NFR-4: Accessibility
- All inputs shall have proper labels and aria attributes
- Chart shall have text alternative describing key points
- Color coding shall not be the only means of conveying information
- Keyboard navigation shall work throughout
- Screen reader compatible

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Default retirement age: 67 (Icelandic retirement age)
- Return rate guidance based on Icelandic investment options
- Educational content mentioning lífeyrissjóður context

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library
- Must work without user account (privacy-first)
- Must handle users without Expense Baseline gracefully
- Calculations must be transparent (show formulas used)

## Out of Scope

- Historical market data analysis
- Monte Carlo simulations (Phase 2 feature)
- Tax optimization recommendations
- Specific investment product recommendations
- Inflation adjustments (assumes real returns)

## Success Criteria

1. User can calculate Coast FIRE date in < 2 minutes
2. Integration with Expense Baseline Tool works seamlessly
3. Scenarios help users understand return rate sensitivity
4. Life energy display provides meaningful context
5. Results are mathematically accurate to within 0.1%
6. Educational content makes Coast FIRE concept clear

## Glossary

| Term | Icelandic | Definition |
|------|-----------|------------|
| Coast FIRE | Ró FIRE | When investments will grow to FI without additional contributions |
| FI Number | FI Tala | Target nest egg for financial independence |
| Target Retirement Age | Eftirlaunaaldur | Age when user plans to retire |
| Expected Return | Væntanleg ávöxtun | Assumed annual investment return rate (real, after inflation) |
| Multiplier | Margfaldari | Factor applied to annual expenses (25x, 30x) to determine FI number |
| Real Return | Raunávöxtun | Return after accounting for inflation |
| Compound Growth | Samsett vöxtur | Investment growth where returns earn returns |
| Coasting Period | Rótímabil | Time between Coast FIRE and Full FI where no additional saving needed |

## Default Icelandic Values

| Input | Default Value | Notes |
|-------|---------------|-------|
| Expected Return (Conservative) | 5% | Based on diversified bond/stock mix |
| Expected Return (Moderate) | 7% | Historical real return average |
| Expected Return (Optimistic) | 9% | Equity-heavy allocation |
| Target Retirement Age | 67 | Icelandic retirement age |
| FI Multiplier | 25x | Standard 4% withdrawal rule |
| Current Age | 30 | Placeholder, user must enter |

## Calculation Examples

### Example 1: Already Coasting
- Current Age: 35
- Current Investments: 50,000,000 kr
- FI Number: 60,000,000 kr (25x × 200,000 kr/month × 12)
- Target Retirement Age: 67
- Expected Return: 7%

**Calculation**:
- Future Value at 67: 50,000,000 × (1.07)^32 = 423,078,500 kr
- Result: **Already Coasting!** (Current balance will grow to far exceed FI number)

### Example 2: Needs More Time
- Current Age: 30
- Current Investments: 10,000,000 kr
- FI Number: 75,000,000 kr (25x × 250,000 kr/month × 12)
- Target Retirement Age: 65
- Expected Return: 7%

**Calculation**:
- Solve: 75,000,000 = 10,000,000 × (1.07)^t
- t = ln(7.5) / ln(1.07) = 29.6 years
- Coast FIRE Age: 30 + 29.6 = 59.6 years (59 years, 7 months)
- Coast FIRE Date: Born 1994 → Coast at 2053-07

### Example 3: Currently Impossible
- Current Age: 50
- Current Investments: 5,000,000 kr
- FI Number: 60,000,000 kr
- Target Retirement Age: 60
- Expected Return: 7%

**Calculation**:
- Future Value at 60: 5,000,000 × (1.07)^10 = 9,835,757 kr
- Gap: 60,000,000 - 9,835,757 = 50,164,243 kr
- Result: **Cannot coast with current parameters**
- Suggestions: Increase return rate, delay retirement, reduce FI number, or continue saving

## Validation Rules

### Input Validation
- Current age: 18-100 years
- Current investments: ≥ 0 kr
- FI number: > 0 kr
- Expected return: -10% to 15% (warn if outside 3-10%)
- Target retirement age: Current age + 1 to 100 years
- FI multiplier: 20-40x (custom allows outside range with warning)

### Calculation Validation
- If t (years to coast) > 100: Show "effectively impossible" message
- If t < 0: Show "already coasting" message
- If return rate × years < ln(FI/current): Show "impossible to coast" message
- If FI number > projected value at target age: Show gap and suggest changes

## Edge Cases

1. **Already Coasting**: Current balance already grows to exceed FI number
   - Show celebratory message
   - Show projected balance at retirement
   - Suggest considering earlier retirement or reduced work

2. **Impossible to Coast**: Cannot reach FI number with current parameters
   - Show the gap clearly
   - Offer suggestions: increase return (how?), delay retirement (to when?), reduce FI number (to what?)
   - Show "continue saving" path as alternative

3. **Very Long Timeline**: Coast FIRE date is >40 years away
   - Note that long-term projections are uncertain
   - Suggest reviewing inputs
   - Emphasize flexibility needed

4. **Negative Returns**: User enters negative expected return
   - Allow but warn clearly
   - Useful for conservative scenario planning
   - Show what this means in plain language

5. **No Expense Baseline**: User hasn't set up expense baseline
   - Prompt to create one OR
   - Allow manual FI number entry
   - Show benefits of using expense baseline

## Integration Points

### With Expense Baseline Tool
- Fetch user's expense tiers (barebones, comfortable, deluxe)
- Calculate FI numbers for each tier automatically
- Update when expense baseline changes
- Allow switching between tiers to see different scenarios

### With Actual Hourly Wage
- Fetch actual hourly wage for life energy calculations
- Convert investment balances to work hours
- Show "hours saved" by coasting
- Prompt to calculate if not available

### With Calculator Context
- Use shared current age input
- Share FI number across FIRE calculators
- Emit events when Coast FIRE status changes
- Persist to shared localStorage

## User Flow

### First-Time User Flow
1. Land on Coast FIRE Calculator page
2. See educational intro: "What is Coast FIRE?"
3. Check if expense baseline exists:
   - **Yes**: Show tier selector, auto-populate FI number
   - **No**: Prompt to create baseline OR enter FI number manually
4. Enter current investment balance
5. Enter current age
6. See immediate results with default assumptions
7. Adjust sliders (return rate, target age) to explore scenarios
8. Review chart showing growth trajectory
9. Optionally see life energy display (if AWH available)
10. Save results (automatic)

### Returning User Flow
1. Load saved inputs automatically
2. Update FI number if expense baseline changed
3. Show updated Coast FIRE status
4. Offer to adjust scenarios
5. Show progress (if current investments increased)

## Related Features

- **FI Number Builder** (3.5): Provides target FI number
- **Expense Baseline Tool** (2.1.11): Provides expense tiers for FI calculation
- **Barista FIRE Planner** (3.3): Alternative path if Coast FIRE shows need for gap income
- **Retirement Date Simulator** (3.4): More complex withdrawal planning after reaching Coast FIRE

## Educational Content Needed

### "What is Coast FIRE?" Explainer
- Definition in plain Icelandic
- Why it matters (freedom milestone)
- How it differs from Full FI and Barista FIRE
- Real-world example with ISK amounts

### Return Rate Guidance
- What is "real return" (after inflation)?
- Conservative vs moderate vs optimistic scenarios
- Icelandic context: lífeyrissjóður typical returns
- Why conservative planning is wise

### Multiplier Explanation
- What 25x means (4% withdrawal rule)
- Why 30x is more conservative
- Trinity Study reference (simplified)
- Adjusting for personal risk tolerance

### "What If I Can't Coast Yet?"
- Continue saving (traditional path)
- Reduce FI number (adjust lifestyle expectations)
- Delay retirement (more time for growth)
- Increase returns (caution about risk)
- Combination approaches

## Accessibility Requirements

### Screen Reader Support
- Chart must announce key data points
- Sliders must announce current value and range
- Results must be announced when updated
- Status messages (already coasting, impossible, etc.) must be assertive

### Keyboard Navigation
- Tab through all inputs in logical order
- Sliders adjustable with arrow keys
- Enter key submits/calculates
- Focus indicators clearly visible

### Visual Requirements
- Minimum contrast ratio 4.5:1 for all text
- Chart lines distinguishable without color alone
- Status indicators use icons + text + color
- Text remains readable at 200% zoom

### Mobile Accessibility
- Touch targets minimum 44x44 pixels
- Sliders usable on touch screens
- Chart pinch-to-zoom enabled
- Form inputs trigger appropriate keyboards (numeric for numbers)

---

**Requirements Phase Complete: Ready for Design Phase**
