# Requirements: Actual Hourly Wage Calculator

## Overview

**Feature**: Actual Hourly Wage Calculator
**App**: peninganaedalifid.is
**Priority**: MVP (Phase 1 Core Feature)
**Book Reference**: "Your Money or Your Life" by Vicki Robin, Chapter 2

## Problem Statement

Most people think of their hourly wage as their salary divided by hours worked. However, this ignores:
- **Money costs of working**: Commuting, work clothes, meals out, decompression spending, childcare
- **Time costs of working**: Commute time, getting ready, decompression time, work-related illness recovery

The *actual* hourly wage is often 40-60% lower than the nominal hourly wage. Without knowing this true number, people cannot make informed decisions about whether purchases and lifestyle choices are worth the life energy (time) they cost.

## User Stories

### US-1: Calculate Actual Hourly Wage
**As a** person wanting to understand my true relationship with money and time,
**I want to** input my income and work-related costs (time and money),
**So that** I can see my actual hourly wage after all work-related expenses.

**Acceptance Criteria (EARS Format)**:

1. **When** the user enters their gross annual income, **the system shall** display the value and use it as the starting point for calculations.

2. **When** the user enters their standard work hours per week (default: 40), **the system shall** use this as the base time investment.

3. **When** the user enters work-related money expenses (commute, clothing, meals, decompression, childcare delta, other), **the system shall** subtract these from gross income to calculate net work income.

4. **When** the user enters work-related time expenses (commute, getting ready, decompression, illness recovery), **the system shall** add these to base work hours to calculate total time investment.

5. **When** all required inputs are provided, **the system shall** calculate actual hourly wage as: (Gross Income - Work Expenses) / (Base Hours + Extra Time Hours × Weeks Worked).

6. **The system shall** display the actual hourly wage prominently with a comparison to the nominal hourly wage.

7. **The system shall** show the percentage reduction from nominal to actual wage.

---

### US-2: See Detailed Breakdown
**As a** user who wants to understand what's affecting my actual wage,
**I want to** see a visual breakdown of where my money and time go,
**So that** I can identify the biggest drains on my life energy.

**Acceptance Criteria (EARS Format)**:

1. **When** the calculation is complete, **the system shall** display a breakdown chart showing:
   - Gross income
   - Each expense category and its annual cost
   - Net income after expenses

2. **When** the calculation is complete, **the system shall** display a time breakdown showing:
   - Base work hours per week
   - Each time expense category and its weekly hours
   - Total hours per week devoted to work

3. **The system shall** rank expense categories by impact (highest first).

4. **The system shall** show each expense as both a dollar amount and "hours of life energy" based on the calculated actual wage.

---

### US-3: Understand Results in Plain Language
**As a** user who may not be financially sophisticated,
**I want to** see my results explained in plain, actionable language,
**So that** I understand what the numbers mean for my life.

**Acceptance Criteria (EARS Format)**:

1. **When** the calculation is complete, **the system shall** display a plain-language summary including:
   - "Your actual hourly wage is $X.XX"
   - "This is Y% less than your nominal wage of $Z.ZZ"
   - "Every dollar you spend costs you [time] of your life"

2. **The system shall** provide context comparisons such as:
   - "A $100 purchase costs you X hours of life energy"
   - "Your commute alone costs you X hours per week / Y hours per year"

3. **The system shall** avoid jargon and use conversational language throughout.

---

### US-4: Save and Load Profiles
**As a** returning user,
**I want to** save my inputs and load them later,
**So that** I don't have to re-enter everything each time I visit.

**Acceptance Criteria (EARS Format)**:

1. **When** the user clicks "Save Profile", **the system shall** store all inputs to browser localStorage.

2. **When** the user returns to the site, **the system shall** automatically load their saved profile if one exists.

3. **When** the user clicks "Export Data", **the system shall** download a JSON file containing all their inputs.

4. **When** the user uploads a JSON file via "Import Data", **the system shall** load all inputs from the file.

5. **The system shall** allow users to clear saved data with a "Reset" function.

6. **If** localStorage is unavailable, **the system shall** still function but notify the user that data won't persist.

---

### US-5: Use Presets for Common Scenarios
**As a** user who wants to quickly estimate without entering every detail,
**I want to** select from presets for common work scenarios,
**So that** I can get a quick approximation.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide presets for commute scenarios:
   - No commute (remote work)
   - Short commute (< 15 min, low cost)
   - Medium commute (15-30 min, moderate cost)
   - Long commute (30-60 min, high cost)
   - Very long commute (> 60 min, very high cost)

2. **The system shall** provide presets for work clothing:
   - Casual (minimal cost)
   - Business casual (moderate cost)
   - Professional/formal (high cost)
   - Uniform provided (no cost)

3. **The system shall** provide presets for meal habits:
   - Bring lunch daily (minimal cost)
   - Buy lunch occasionally (moderate cost)
   - Buy lunch daily (high cost)
   - Meals provided at work (no cost)

4. **When** a user selects a preset, **the system shall** populate the relevant fields with typical values.

5. **The system shall** allow users to override preset values with custom inputs.

---

### US-6: Compare Multiple Scenarios
**As a** user considering job changes or lifestyle changes,
**I want to** compare my actual hourly wage under different scenarios,
**So that** I can make informed decisions about changes.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** allow users to save the current calculation as a named scenario.

2. **The system shall** allow users to create up to 3 scenarios for comparison.

3. **When** multiple scenarios exist, **the system shall** display them side-by-side with key metrics:
   - Actual hourly wage
   - Total weekly time investment
   - Annual net income

4. **The system shall** highlight the scenario with the highest actual hourly wage.

---

### US-7: Mobile-Responsive Experience
**As a** user accessing the site from my phone,
**I want to** have a fully functional mobile experience,
**So that** I can use the calculator anywhere.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** be fully functional on screens 320px and wider.

2. **The system shall** use touch-friendly input controls (large tap targets, appropriate input types).

3. **The system shall** adapt chart displays for mobile screens (scrollable or stacked as appropriate).

4. **The system shall** maintain readability with appropriate font sizes (minimum 16px for inputs to prevent iOS zoom).

---

## Input Specifications

### Income Inputs
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Gross Annual Income | Currency | - | Required, > 0 | Before taxes |
| Work Hours/Week | Number | 40 | 1-100 | Standard work hours |
| Weeks Worked/Year | Number | 50 | 1-52 | Account for vacation |
| Additional Income (bonus, etc.) | Currency | 0 | >= 0 | Annual total |

### Money Expense Inputs (Annual)
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Commute Costs | Currency | 0 | >= 0 | Gas, transit, parking, tolls, wear |
| Work Clothing | Currency | 0 | >= 0 | Clothes bought for work |
| Work Meals | Currency | 0 | >= 0 | Lunches, coffee, snacks at work |
| Decompression Spending | Currency | 0 | >= 0 | "Retail therapy", unwinding costs |
| Childcare Delta | Currency | 0 | >= 0 | Extra childcare due to work |
| Other Work Expenses | Currency | 0 | >= 0 | Tools, dues, education, etc. |

### Time Expense Inputs (Weekly Hours)
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Commute Time | Number | 0 | 0-40 | Round-trip weekly total |
| Getting Ready Time | Number | 0 | 0-20 | Extra prep time for work |
| Decompression Time | Number | 0 | 0-20 | Time to "recover" from work |
| Work Illness Time | Number | 0 | 0-10 | Weekly average of sick days |

## Calculation Formulas

### Nominal Hourly Wage
```
Nominal Hourly Wage = Gross Annual Income / (Work Hours/Week × Weeks Worked/Year)
```

### Net Work Income
```
Net Work Income = Gross Annual Income - (Sum of all Money Expenses)
```

### Total Weekly Time Investment
```
Total Weekly Hours = Work Hours/Week + Commute Time + Getting Ready Time + Decompression Time + Work Illness Time
```

### Actual Hourly Wage
```
Actual Hourly Wage = Net Work Income / (Total Weekly Hours × Weeks Worked/Year)
```

### Life Energy Cost
```
Life Energy Cost (hours) = Purchase Price / Actual Hourly Wage
```

## Output Specifications

### Primary Output
- **Actual Hourly Wage**: Displayed prominently, formatted as currency with 2 decimals
- **Nominal Hourly Wage**: Shown for comparison
- **Percentage Reduction**: How much lower actual is vs nominal

### Secondary Outputs
- **Life Energy Converter**: "A $X purchase costs Y hours of your life"
- **Annual Life Energy**: Total hours worked (including hidden time) per year
- **Expense Impact Rankings**: Each expense shown as hours of life energy

### Visualizations
- **Income Waterfall Chart**: Shows gross → expenses → net
- **Time Pie Chart**: Shows where work-related time goes
- **Comparison Bar Chart**: Nominal vs Actual wage visual

## Non-Functional Requirements

### Performance
- Page load: < 2 seconds on 3G connection
- Calculation: < 100ms after input change
- No server round-trips for calculations (client-side only)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader compatible
- Color contrast ratios met

### Privacy
- No data sent to server
- All calculations client-side
- Clear data export/import for user control
- No tracking beyond basic analytics (if any)

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari and Chrome

## Dependencies

- None (this is the foundation feature)

## Future Enhancements (Out of Scope for MVP)

- Tax bracket awareness (show after-tax actual wage)
- Currency localization (ISK, EUR, etc.)
- Historical tracking of wage changes over time
- Integration with other calculators on the site
- Sharing results (anonymized)
