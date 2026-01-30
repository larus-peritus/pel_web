# Requirements: Savings Rate Slider

## Overview

**Feature**: Savings Rate Slider
**App**: peninganaedalifid.is
**Priority**: Phase 2.2 (Savings Calculators)
**Category**: Core FIRE Planning Tool
**Book Reference**: "Your Money or Your Life" by Vicki Robin (Chapter 9 - Financial Independence)

## Problem Statement

Most people don't understand the dramatic impact that savings rate has on their path to financial independence. The relationship is non-linear and counterintuitive: increasing your savings rate from 10% to 20% doesn't just cut your working years in half—it's often more dramatic than that due to compound effects.

Without seeing this relationship visually and being able to interact with it, people:
- Underestimate the power of small savings rate increases
- Don't realize how close they might be to financial independence
- Can't see the trade-offs between current lifestyle and future freedom
- Miss opportunities to make informed decisions about spending vs saving

The Savings Rate Slider makes this abstract concept concrete by showing: "Each additional 1% you save changes your FI date by X months/years."

## User Stories

### US-1: See Impact of Savings Rate on FI Date

**As a** person working toward financial independence,
**I want to** adjust a savings rate slider and immediately see how it affects my FI date,
**So that** I can understand the relationship between saving more now and achieving freedom sooner.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user enters or calculates their FI number, **the system SHALL** use this as the target for FI date calculations.

2. **WHEN** the user enters their current annual income (after work expenses), **the system SHALL** use this for savings calculations.

3. **WHEN** the user enters their current annual expenses, **the system SHALL** calculate the default savings rate as (Income - Expenses) / Income × 100.

4. **WHEN** the user moves the savings rate slider, **the system SHALL** update the FI date calculation in real-time (within 100ms).

5. **WHEN** the system calculates FI date, **the system SHALL** display both:
   - Absolute date (e.g., "Ágúst 2035")
   - Years/months from today (e.g., "9 ár og 3 mánuðir")

6. **WHEN** savings rate changes, **the system SHALL** show the change in FI date from the previous savings rate (e.g., "2 ár fyrr" / "2 years earlier").

7. **IF** the user already has a current net worth, **the system SHALL** factor this into years-to-FI calculations.

8. **IF** the user's current savings rate already achieves FI, **the system SHALL** display "Þú hefur náð fjármálafrelsi!" ("You have reached financial independence!").

9. **IF** inputs result in negative savings (expenses exceed income), **the system SHALL** display a warning: "Útgjöld eru hærri en tekjur" ("Expenses exceed income").

10. **WHEN** the user adjusts the expected return rate (default: 7%), **the system SHALL** recalculate years to FI using the new rate.

---

### US-2: See Marginal Impact of Savings Rate Changes

**As a** user evaluating spending decisions,
**I want to** see exactly how much each 1% savings rate change affects my FI timeline,
**So that** I can make informed trade-offs between current spending and future freedom.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the system displays FI date, **the system SHALL** also display "Impact per 1%" showing months/years change per 1% savings rate adjustment.

2. **WHEN** savings rate is below 50%, **the system SHALL** calculate and display impact for common increments:
   - +1% savings rate change
   - +5% savings rate change
   - +10% savings rate change

3. **WHEN** the user adjusts the slider, **the system SHALL** highlight the change from baseline savings rate in a contrasting color.

4. **WHERE** marginal impact is less than 1 month per 1%, **the system SHALL** display impact in weeks (e.g., "3 vikur fyrr per 1%").

5. **WHERE** marginal impact is greater than 1 year per 1%, **the system SHALL** display impact in years and months (e.g., "1 ár og 4 mánuðir fyrr per 1%").

6. **WHEN** savings rate approaches 100%, **the system SHALL** show diminishing returns visually (curve flattening).

---

### US-3: Understand Savings Rate in Life Energy Terms

**As a** user who thinks in terms of life energy,
**I want to** see savings rate impact expressed in work-hours saved or added,
**So that** I can relate abstract percentages to concrete time from my life.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the system calculates FI date, **the system SHALL** convert years to FI into total work-hours remaining using actual hourly wage.

2. **WHEN** savings rate changes, **the system SHALL** display work-hours saved or added:
   - In hours (if < 1,000 hours)
   - In work-days (if 1,000-10,000 hours, assuming 8-hour days)
   - In work-years (if > 10,000 hours, assuming 2,000 hours/year)

3. **WHEN** displaying work-hours impact, **the system SHALL** include a plain-language summary:
   - "Með 5% meiri sparnaði sparar þú X vinnuár" ("By saving 5% more, you save X work-years")
   - "Hver 1% sparar þér Y vinnudaga" ("Each 1% saves you Y work-days")

4. **IF** actual hourly wage is not available, **the system SHALL** prompt user to calculate it or enter manually.

5. **WHEN** showing life energy impact, **the system SHALL** make it clear this is based on current hourly wage: "Miðað við núverandi tímakaup: X kr/klst" ("Based on current hourly wage: X ISK/hour").

---

### US-4: Visualize Savings Rate vs. Years to FI Relationship

**As a** visual learner,
**I want to** see a chart showing the relationship between savings rate and years to FI,
**So that** I can intuitively understand the non-linear relationship.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the calculator loads with valid inputs, **the system SHALL** display a curve chart showing savings rate (x-axis) vs. years to FI (y-axis).

2. **WHEN** the user moves the slider, **the system SHALL** mark the current position on the curve with a highlighted point or line.

3. **WHEN** displaying the chart, **the system SHALL** include reference points:
   - Current savings rate (marked clearly)
   - 50% savings rate (common FIRE target)
   - User's target savings rate (if set)

4. **WHERE** the user is on mobile, **the system SHALL** display a simplified version of the chart that remains readable on small screens.

5. **WHEN** the user taps/hovers over points on the curve, **the system SHALL** show tooltip with exact savings rate and years to FI.

6. **IF** chart cannot be displayed (e.g., invalid inputs), **the system SHALL** show table view instead with key savings rate milestones.

---

### US-5: Compare Savings Rate Scenarios

**As a** person evaluating life changes,
**I want to** compare different savings rate scenarios side-by-side,
**So that** I can evaluate options like job changes, downsizing, or lifestyle adjustments.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user clicks "Bæta við atburðarás" ("Add Scenario"), **the system SHALL** save the current inputs and results as a named scenario.

2. **WHEN** the user creates a scenario, **the system SHALL** prompt for a name (e.g., "Núverandi staða", "Eftir flutning", "Með aukavinnu").

3. **WHEN** multiple scenarios exist, **the system SHALL** display them in a comparison table showing:
   - Scenario name
   - Savings rate
   - FI date
   - Years to FI
   - Difference from baseline

4. **WHEN** user has more than one scenario, **the system SHALL** highlight the scenario with earliest FI date in green.

5. **WHEN** user deletes a scenario, **the system SHALL** ask for confirmation before removing.

6. **IF** user creates more than 4 scenarios, **the system SHALL** display a message: "Hámark 4 atburðarásir" ("Maximum 4 scenarios") and prevent creation of additional scenarios.

7. **WHEN** comparing scenarios, **the system SHALL** show difference in life energy hours between scenarios.

---

### US-6: Explore "What If" Questions

**As a** user planning financial changes,
**I want to** quickly test "what if" questions about income and expense changes,
**So that** I can see how life decisions affect my FI timeline.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the calculator displays, **the system SHALL** include quick-adjust buttons for common scenarios:
   - "Hvað ef ég lækka útgjöld um 10%?" ("What if I reduce expenses by 10%?")
   - "Hvað ef ég auka tekjur um 20%?" ("What if I increase income by 20%?")
   - "Hvað ef ég hætti í vinnunni núna?" ("What if I quit work now?")

2. **WHEN** user clicks a quick-adjust button, **the system SHALL** temporarily adjust inputs and show the impact on FI date.

3. **WHEN** in quick-adjust mode, **the system SHALL** display "Tímabundin skoðun" ("Temporary view") banner with option to "Keep" or "Cancel".

4. **WHEN** user clicks "Keep" on temporary adjustment, **the system SHALL** save the adjusted values as the new baseline.

5. **WHEN** user clicks "Cancel" on temporary adjustment, **the system SHALL** revert to previous values.

6. **WHERE** quick adjustments would create invalid scenarios (e.g., negative savings), **the system SHALL** display appropriate warning.

---

### US-7: Track Progress Toward FI

**As a** returning user tracking progress,
**I want to** see how my actual savings rate and FI date have changed over time,
**So that** I can measure progress and stay motivated.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** user saves calculation results, **the system SHALL** optionally store a timestamped snapshot with:
   - Date
   - Savings rate
   - FI date projection
   - Current net worth (if entered)

2. **WHEN** user has multiple snapshots, **the system SHALL** display progress chart showing FI date estimates over time.

3. **WHEN** displaying progress, **the system SHALL** show:
   - Trend line (improving, stable, declining)
   - Latest FI date projection
   - Change from first snapshot

4. **IF** FI date is moving earlier (good progress), **the system SHALL** display encouraging message: "Vel gert! Þú ert X mánuðum nær markmiðinu" ("Well done! You are X months closer to your goal").

5. **IF** FI date is moving later (regression), **the system SHALL** display supportive message with suggestions: "Athugnið útgjöld eða sparnaðarhlutfall" ("Review expenses or savings rate").

6. **WHEN** user exports data, **the system SHALL** include all historical snapshots in JSON export.

7. **WHEN** user imports data, **the system SHALL** restore historical snapshots if present.

---

### US-8: Mobile-Responsive Experience

**As a** user accessing the calculator from my phone,
**I want to** have a fully functional mobile experience,
**So that** I can explore savings scenarios anywhere.

**Acceptance Criteria (EARS Format)**:

1. **WHERE** user is on screen width < 768px, **the system SHALL** stack input and results sections vertically.

2. **WHERE** user is on mobile, **the system SHALL** make the slider large enough for easy touch interaction (minimum 44px touch target).

3. **WHERE** user is on mobile, **the system SHALL** display simplified chart optimized for small screens.

4. **WHEN** user interacts with slider on mobile, **the system SHALL** provide haptic feedback if device supports it.

5. **WHERE** user is on mobile, **the system SHALL** use bottom sheet or modal for scenario comparisons instead of side-by-side view.

6. **WHEN** keyboard appears on mobile (input focus), **the system SHALL** ensure results remain visible or easily scrollable.

7. **WHERE** user is on iOS, **the system SHALL** use minimum 16px font size for inputs to prevent automatic zoom.

---

## Input Specifications

### Required Inputs

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| FI Number | Currency | - | > 0 | Target nest egg (can be calculated or manual) |
| Annual Income (Net) | Currency | - | > 0 | After work expenses |
| Annual Expenses | Currency | - | > 0 | Annual spending |
| Current Net Worth | Currency | 0 | >= 0 | Optional, improves accuracy |
| Expected Return Rate | Percentage | 7% | 0-15% | Annual investment return |
| Current Savings Rate | Percentage | Calculated | 0-100% | Auto-calculated but adjustable |

### Slider Input

| Field | Type | Range | Step | Default | Notes |
|-------|------|-------|------|---------|-------|
| Savings Rate | Slider + Number | 0-100% | 1% | Calculated | Primary interaction |

### Optional Inputs

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Target Savings Rate | Percentage | - | 0-100% | For goal setting |
| Actual Hourly Wage | Currency | From calculator | > 0 | For life energy conversion |
| FI Multiplier | Number | 25 | 20-40 | For FI number calculation |

## Output Specifications

### Primary Outputs

**FI Date Display**:
- Absolute date: "Ágúst 2035"
- Relative time: "9 ár og 3 mánuðir"
- Change from baseline: "+2 ár" or "-6 mánuðir"

**Savings Rate Impact**:
- Per 1%: "Hver 1% sparar þér 4 mánuði"
- Per 5%: "5% meiri sparnaður: 1 ár og 8 mánuðir fyrr"
- Per 10%: "10% meiri sparnaður: 3 ár og 2 mánuðir fyrr"

**Life Energy Conversion**:
- Total work-hours to FI: "18,400 vinnustundir eftir"
- Impact per 1%: "Hver 1% sparar 920 vinnustundir"
- In work-years: "4.6 vinnuár eftir"

### Secondary Outputs

**Progress Metrics**:
- Current position on FI path: "43% á leið að markmiði"
- Monthly savings amount: "420,000 kr/mánuði"
- Years until CoastFI: "2 ár" (if applicable)

**Scenario Comparison Table**:

| Scenario | Savings Rate | FI Date | Years to FI | vs. Baseline |
|----------|--------------|---------|-------------|--------------|
| Núverandi | 35% | Júlí 2034 | 8.5 ár | Baseline |
| +10% sparnaður | 45% | Jan 2031 | 5.2 ár | -3.3 ár |
| Eftir flutning | 50% | Ágúst 2029 | 3.7 ár | -4.8 ár |

### Visualizations

**Savings Rate Curve**:
- X-axis: Savings rate (0-100%)
- Y-axis: Years to FI (0-40 years)
- Current position marked
- Reference lines at 25%, 50%, 75% savings rates

**Progress Timeline** (if snapshots exist):
- X-axis: Date
- Y-axis: Projected FI date
- Trend line showing improvement/decline

## Calculation Formulas

### Years to FI Calculation

**Without existing net worth**:
```
Years to FI = ln(1 + (FI Number × Return Rate) / (Annual Income × Savings Rate)) / ln(1 + Return Rate)
```

**With existing net worth**:
```
Years to FI = ln((FI Number - Net Worth × (1 + Return Rate)) / (Annual Income × Savings Rate × -1)) / ln(1 + Return Rate)
```

Simplified approximation (for display):
```
Annual Savings = Annual Income × (Savings Rate / 100)
Gap to Fill = FI Number - Current Net Worth
Years to FI ≈ Gap to Fill / (Annual Savings × (1 + Return Rate/2))
```

### Savings Rate
```
Savings Rate = ((Annual Income - Annual Expenses) / Annual Income) × 100
```

### FI Number (if calculated)
```
FI Number = Annual Expenses × FI Multiplier
```

### Life Energy Conversion
```
Total Work-Hours to FI = Years to FI × Work Weeks per Year × Work Hours per Week
Life Energy Saved per 1% = (Hours at Current Rate - Hours at Current+1%)
```

## Non-Functional Requirements

### Performance

1. **WHEN** user moves slider, **the system SHALL** update calculations and display within 100ms.

2. **WHEN** page loads, **the system SHALL** render initial view within 2 seconds on 3G connection.

3. **WHEN** chart renders, **the system SHALL** complete rendering within 500ms.

4. **WHEN** user switches between scenarios, **the system SHALL** update display within 200ms.

### Usability

1. **WHEN** displaying numbers, **the system SHALL** use Icelandic number formatting (e.g., "10.000" not "10,000").

2. **WHEN** showing currency, **the system SHALL** use "kr" suffix and Icelandic formatting.

3. **WHEN** user makes invalid input, **the system SHALL** display clear, actionable error message in Icelandic.

4. **WHEN** displaying FI dates, **the system SHALL** use Icelandic month names.

5. **WHEN** calculation is in progress, **the system SHALL** show loading indicator if computation takes > 200ms.

### Accessibility

1. **WHEN** user navigates with keyboard, **the system SHALL** provide clear focus indicators on all interactive elements.

2. **WHEN** slider value changes, **the system SHALL** announce new value to screen readers.

3. **WHEN** displaying charts, **the system SHALL** provide text alternative describing the data.

4. **WHERE** colors convey meaning (e.g., good/bad scenarios), **the system SHALL** also use icons or text labels.

5. **WHEN** displaying interactive elements, **the system SHALL** maintain minimum contrast ratio of 4.5:1 (WCAG AA).

6. **WHEN** user increases font size, **the system SHALL** maintain layout and functionality up to 200% zoom.

### Privacy

1. **WHEN** user enters financial data, **the system SHALL** store data only in browser localStorage (no server transmission).

2. **WHEN** user exports data, **the system SHALL** generate JSON file locally (client-side only).

3. **WHEN** user clears data, **the system SHALL** completely remove all stored information from localStorage.

4. **IF** localStorage is unavailable, **the system SHALL** function but notify user that data won't persist between sessions.

### Reliability

1. **IF** calculation results in mathematical error (division by zero, overflow), **the system SHALL** display user-friendly error message.

2. **WHEN** user inputs result in FI timeline > 100 years, **the system SHALL** display: "Markmiðið virðist vera mjög langt í burtu. Athugaðu útgjöld eða sparnaðarhlutfall." ("Goal seems very far away. Review expenses or savings rate.")

3. **WHEN** browser loses focus during input, **the system SHALL** preserve partially entered data.

4. **IF** localStorage quota is exceeded, **the system SHALL** remove oldest snapshots automatically and notify user.

## Dependencies

### Required Dependencies

1. **Actual Hourly Wage Calculator** (Feature 1.1)
   - Provides `actualHourlyWage` value
   - Used for life energy calculations
   - Status: ✅ Implemented

2. **Calculator Context** (Project Foundation)
   - Provides shared state management
   - Handles localStorage persistence
   - Status: ✅ Implemented

### Optional Dependencies

1. **FI Number Builder** (Feature 3.5)
   - Future integration for calculated FI number
   - Status: ⏳ Future (Phase 3)
   - Workaround: Manual FI number input

### Data Dependencies

**From Actual Hourly Wage Calculator**:
- `actualHourlyWage: number` - For life energy conversion
- `grossAnnualIncome: number` - For income calculations

**From User Input** (new data for this feature):
- `targetMonthlyExpenses: number` - For FI number calculation
- `currentSavingsRate: number` - Baseline savings rate
- `currentNetWorth: number` - Optional, improves accuracy
- `expectedReturnRate: number` - Investment return assumption
- `fiMultiplier: number` - For FI number calculation

## Constraints and Assumptions

### Constraints

1. **Client-Side Only**: All calculations must be performed in browser (no backend required)
2. **Privacy-First**: No data transmission to servers
3. **Browser Compatibility**: Must work in Chrome, Firefox, Safari, Edge (last 2 versions)
4. **Mobile Support**: Must be fully functional on screens 320px and wider
5. **Icelandic Language**: All UI text in Icelandic
6. **Currency**: ISK only (initial version)

### Assumptions

1. **Expected Return Rate**: Default 7% is reasonable for diversified investment portfolio
2. **FI Multiplier**: 25x (4% rule) is standard starting point
3. **Inflation**: Not explicitly modeled in initial version (can add later)
4. **Tax Impact**: Calculations use after-tax income (user responsibility to input correctly)
5. **Investment Behavior**: Assumes consistent monthly investment of savings
6. **Expense Stability**: Assumes expenses remain constant in real terms
7. **Income Stability**: Assumes income remains constant in real terms
8. **No Debt**: Does not model debt payoff strategies (separate feature)

### Technical Assumptions

1. LocalStorage available and quota sufficient (5-10MB typical)
2. JavaScript enabled in browser
3. Modern browser with ES6+ support
4. Device has sufficient memory for chart rendering

## Success Criteria

### User Success Metrics

1. **User understands relationship** between savings rate and FI date within 5 minutes of interaction
2. **User can experiment** with different savings rates and see immediate impact
3. **User can relate** abstract savings percentages to concrete life energy (work-hours/years)
4. **User can compare** multiple scenarios to inform decisions
5. **User can track** progress over time if they return to calculator

### Technical Success Metrics

1. **Calculations accurate** to within 1% of mathematical formula
2. **Performance fast**: Updates within 100ms on standard devices
3. **No data loss**: LocalStorage persists reliably between sessions
4. **Accessible**: WCAG 2.1 AA compliant
5. **Mobile functional**: Works smoothly on 320px+ screens
6. **Export/import** works without data corruption

### Business Success Metrics

1. **Feature adoption**: 60%+ of users who complete Actual Hourly Wage calculation try Savings Rate Slider
2. **Engagement**: Average session time > 3 minutes
3. **Return usage**: 30%+ of users return to calculator within 30 days
4. **Data export**: 20%+ of users export their scenarios

## Out of Scope (Future Enhancements)

The following are explicitly **not** included in this initial version:

1. **Tax modeling**: Advanced tax bracket awareness and optimization
2. **Inflation adjustment**: Real vs. nominal return modeling
3. **Multiple currencies**: Support for USD, EUR, etc.
4. **Variable expenses**: Modeling expense changes in retirement
5. **Social security**: Iceland pension system integration
6. **Debt payoff**: Combined debt + FIRE planning
7. **Monte Carlo simulation**: Sequence of returns risk modeling
8. **Auto-sync**: Automatic connection to bank accounts
9. **Community features**: Comparing against other users
10. **Detailed investment allocation**: Asset allocation recommendations
11. **Coast/Barista FIRE**: Advanced FIRE variations (Phase 3)
12. **Healthcare costs**: Specific modeling for healthcare in retirement

These may be added in future phases based on user feedback and priority.

---

## Summary

This Savings Rate Slider feature will enable users to:
- ✅ Interactively explore how savings rate affects their FI timeline
- ✅ See concrete impact of each 1% savings rate change
- ✅ Understand savings in life energy terms (work-hours/years saved)
- ✅ Compare multiple savings rate scenarios
- ✅ Track progress toward FI over time
- ✅ Make informed decisions about spending vs. saving trade-offs

The feature builds on the foundation of the Actual Hourly Wage Calculator, uses privacy-first localStorage, and maintains the app's focus on plain language and life energy concepts.
