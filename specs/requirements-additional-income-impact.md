# Requirements: Additional Income Impact Calculator

## Overview

**Feature**: Additional Income Impact Calculator (2.3.3)
**App**: peninganaedalifid.is (Peningarnir og Æða Lífið)
**Priority**: Phase 2 - Salary & Income Calculators
**Book Reference**: "Your Money or Your Life" by Vicki Robin - Evaluating income opportunities

## Problem Statement

When considering side income opportunities (overtime hours, side hustles, freelance work, part-time jobs), people often evaluate only the gross hourly rate offered. However, they fail to account for:

- **Tax impact**: Additional income may push into higher tax brackets (marginal tax rate)
- **New expenses**: Transportation to second job, equipment, childcare, meals away from home
- **Hidden time costs**: Commute to second job, preparation time, fatigue recovery
- **Opportunity cost**: Time away from rest, family, hobbies, or job searching
- **Impact on FI timeline**: How additional income affects financial independence date

The true "net hourly rate" after taxes and expenses is often significantly lower than the advertised rate. Without understanding this, people may accept side income opportunities that actually worsen their life-energy balance or have minimal impact on their FI journey.

## User Stories

### US-1: Evaluate Side Income Opportunity

**As a** person considering additional income (overtime, side hustle, part-time work),
**I want to** calculate the true net hourly rate after taxes and new expenses,
**So that** I can decide whether the opportunity is worth my time and energy.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user enters their current income and tax information, **the system SHALL** use this as the baseline for tax bracket calculations.

2. **WHEN** the user enters the offered hourly rate for additional income, **the system SHALL** display this as the gross hourly rate.

3. **WHEN** the user enters expected hours per week for additional work, **the system SHALL** calculate annual additional income.

4. **WHEN** the user enters new expenses incurred (transportation, equipment, meals, childcare), **the system SHALL** subtract these from additional gross income.

5. **WHEN** the user enters additional time expenses (commute, preparation, recovery), **the system SHALL** add these to billable hours to calculate total time investment.

6. **WHEN** all required inputs are provided, **the system SHALL** calculate the net hourly rate as: (Additional Income - Marginal Taxes - New Expenses) / (Billable Hours + Additional Time).

7. **WHEN** calculation is complete, **the system SHALL** display the net hourly rate prominently with comparison to the gross hourly rate.

8. **WHEN** calculation is complete, **the system SHALL** show the percentage reduction from gross to net rate.

---

### US-2: Understand Tax Impact

**As a** user evaluating additional income,
**I want to** see how marginal tax rates affect my take-home from side income,
**So that** I understand the true after-tax value of the opportunity.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user enters their current annual income, **the system SHALL** determine their current tax bracket.

2. **WHEN** the user enters additional income amount, **the system SHALL** calculate the marginal tax rate (the rate on the additional income, not average rate).

3. **WHEN** marginal tax calculation is complete, **the system SHALL** display:
   - Current tax bracket and rate
   - Marginal tax bracket and rate for additional income
   - Total taxes on additional income
   - After-tax additional income

4. **IF** additional income pushes into a higher tax bracket, **the system SHALL** show a warning indicator and explain the bracket jump.

5. **WHERE** user is in Iceland, **the system SHALL** use Icelandic tax brackets (útsvar + ríkisskattur).

6. **WHEN** displaying tax information, **the system SHALL** include a disclaimer: "Tax calculations are estimates. Consult a tax professional for accurate advice."

---

### US-3: Account for New Expenses

**As a** user,
**I want to** track all new expenses created by additional income work,
**So that** I don't overlook costs that reduce my true earnings.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user enters new expense categories, **the system SHALL** accept inputs for:
   - Transportation costs (fuel, transit, parking)
   - Equipment and tools required
   - Additional meals away from home
   - Childcare for additional hours
   - Other work-related expenses

2. **WHEN** the user selects a transportation preset (none, bike, car, transit), **the system SHALL** auto-populate typical Icelandic transportation costs.

3. **WHEN** new expenses are entered, **the system SHALL** show the annual total of new expenses.

4. **WHEN** expenses exceed 50% of gross additional income, **the system SHALL** display a warning: "Expenses are consuming more than half of your additional income."

5. **WHEN** displaying expense breakdown, **the system SHALL** show each expense category as both ISK amount and hours of life energy (based on actual hourly wage from core calculator).

---

### US-4: See FI Timeline Impact

**As a** FIRE-focused user,
**I want to** see how additional income affects my financial independence date,
**So that** I can evaluate whether the opportunity accelerates my FI goals meaningfully.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user has defined FI inputs (FI number, current savings rate, current net worth), **the system SHALL** calculate current FI date.

2. **WHEN** the user calculates net additional income, **the system SHALL** recalculate FI date with additional savings included.

3. **WHEN** FI date calculation is complete, **the system SHALL** display:
   - FI date without additional income
   - FI date with additional income
   - Time saved (months/years earlier FI is reached)

4. **IF** additional income accelerates FI date by less than 6 months, **the system SHALL** show a neutral indicator suggesting limited impact.

5. **IF** additional income accelerates FI date by 6-24 months, **the system SHALL** show a positive indicator.

6. **IF** additional income accelerates FI date by 24+ months, **the system SHALL** show a strong positive indicator.

7. **WHEN** displaying FI impact, **the system SHALL** show the "exchange rate": "Working X hours per week moves FI date Y months earlier."

---

### US-5: Compare to Actual Hourly Wage

**As a** user who has calculated their actual hourly wage,
**I want to** compare the net rate from additional income to my current actual wage,
**So that** I can see if the side opportunity is better or worse than my current work.

**Acceptance Criteria (EARS Format)**:

1. **IF** the user has calculated their actual hourly wage in the core calculator, **the system SHALL** load this value automatically.

2. **WHEN** net hourly rate is calculated, **the system SHALL** display a side-by-side comparison:
   - Current job actual hourly wage
   - Additional income net hourly rate
   - Difference (ISK and %)

3. **IF** additional income net rate is higher than actual wage, **the system SHALL** show a success indicator: "This side income pays better than your current work per hour."

4. **IF** additional income net rate is lower than actual wage, **the system SHALL** show a warning: "This side income pays less per hour than your current job."

5. **IF** additional income net rate is lower by more than 30%, **the system SHALL** show an error indicator: "This side income significantly undervalues your time."

6. **WHEN** comparison is shown, **the system SHALL** include context: "Consider non-monetary factors: flexibility, skill building, enjoyment, career advancement."

---

### US-6: Plain Language Summary

**As a** user who wants clear guidance,
**I want to** receive a plain-language summary of whether the opportunity is worth it,
**So that** I can make an informed decision without doing mental math.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** all calculations are complete, **the system SHALL** display a summary section with:
   - "Your net hourly rate is X kr after taxes and expenses"
   - "This is Y% less than the advertised rate of Z kr"
   - "You'll work A hours per week for B kr per month net"
   - "This moves your FI date C months earlier"
   - Clear recommendation based on metrics

2. **IF** net rate is positive and FI impact is meaningful (>6 months), **the system SHALL** recommend: "This opportunity appears worthwhile based on financial metrics alone."

3. **IF** net rate is positive but FI impact is minimal (<6 months), **the system SHALL** recommend: "Modest financial benefit. Consider if non-financial factors (skills, enjoyment, networking) make it worthwhile."

4. **IF** net rate is very low (below 50% of actual wage), **the system SHALL** recommend: "Consider carefully. Your time may be better spent resting, family time, or seeking higher-value opportunities."

5. **IF** net rate is negative (expenses exceed income), **the system SHALL** recommend: "This opportunity costs you money. Only pursue if there are strong non-financial benefits."

6. **WHEN** displaying recommendation, **the system SHALL** acknowledge non-monetary factors: "Remember: Financial metrics aren't everything. Consider: skill development, career advancement, personal fulfillment, networking, enjoyment."

---

### US-7: Preset Scenarios

**As a** user who wants quick estimates,
**I want to** select from common side income scenarios,
**So that** I can get quick ballpark estimates without entering every detail.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** provide presets for common side income types:
   - Overtime at current employer (no new commute, same tax withholding)
   - Freelance remote work (no commute, equipment costs, tax withholding considerations)
   - Part-time retail/service (commute required, minimal equipment, lower rate)
   - Delivery/rideshare (car costs, fuel, depreciation, flexible hours)
   - Tutoring/teaching (minimal expenses, flexible location)

2. **WHEN** the user selects a preset, **the system SHALL** populate:
   - Typical hourly rate range for Iceland
   - Common expense categories and amounts
   - Typical time commitments
   - Common tax considerations

3. **WHEN** a preset is applied, **the system SHALL** allow the user to customize all values.

4. **WHEN** a preset is selected, **the system SHALL** display a description of assumptions made.

---

### US-8: Save and Compare Opportunities

**As a** user evaluating multiple opportunities,
**I want to** save and compare different side income scenarios,
**So that** I can choose the best option.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user clicks "Save This Opportunity", **the system SHALL** save the current inputs and results as a named scenario.

2. **THE system SHALL** allow saving up to 5 opportunities for comparison.

3. **WHEN** multiple opportunities are saved, **the system SHALL** display them side-by-side with key metrics:
   - Opportunity name
   - Gross hourly rate
   - Net hourly rate
   - Weekly hours required
   - Monthly net income
   - FI date impact

4. **WHEN** displaying comparisons, **the system SHALL** highlight the opportunity with:
   - Highest net hourly rate
   - Highest monthly net income
   - Greatest FI impact

5. **WHEN** the user selects an opportunity from comparison, **the system SHALL** load those inputs into the calculator.

---

### US-9: Mobile-Friendly Experience

**As a** user comparing opportunities on-the-go,
**I want to** use the calculator on my mobile device,
**So that** I can evaluate offers in real-time.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** be fully functional on screens 320px and wider.

2. **THE system SHALL** use touch-friendly controls (minimum 44px tap targets).

3. **WHEN** on mobile, **the system SHALL** stack sections vertically for readability.

4. **WHEN** on mobile, **the system SHALL** use larger font sizes (minimum 16px for inputs to prevent iOS zoom).

5. **WHEN** on mobile, **the system SHALL** provide a sticky header with key result (net hourly rate).

---

## Input Specifications

### Current Income Inputs (from Actual Hourly Wage Calculator)

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Actual Hourly Wage | Currency | (auto-loaded) | > 0 | From core calculator |
| Current Annual Income | Currency | (auto-loaded) | > 0 | For tax bracket calculation |
| Current Tax Bracket | Percentage | (calculated) | 0-50% | Icelandic effective tax rate |

### Additional Income Inputs

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Gross Hourly Rate Offered | Currency | - | Required, > 0 | Advertised rate |
| Hours Per Week | Number | - | Required, 1-60 | Realistic cap at 60 |
| Weeks Per Year | Number | 50 | 1-52 | Account for time off |
| One-Time Setup Bonus | Currency | 0 | >= 0 | Sign-on bonus, if any |

### New Expense Inputs (Annual or setup costs)

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Transportation Costs | Currency | 0 | >= 0 | Fuel, transit, parking (annual) |
| Equipment/Tools | Currency | 0 | >= 0 | One-time or annual |
| Additional Meals | Currency | 0 | >= 0 | Annual eating out costs |
| Childcare Delta | Currency | 0 | >= 0 | Extra childcare annual cost |
| Other Expenses | Currency | 0 | >= 0 | Miscellaneous |

### Additional Time Inputs (Weekly Hours)

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Commute Time | Number | 0 | 0-20 | Hours per week round-trip |
| Preparation Time | Number | 0 | 0-10 | Getting ready, setup |
| Recovery/Fatigue Time | Number | 0 | 0-20 | Extra rest needed |

### FI Planning Inputs (Optional)

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Current Net Worth | Currency | 0 | >= 0 | Optional - for FI calculation |
| FI Number (Target) | Currency | 0 | >= 0 | Optional - 25x annual expenses |
| Current Savings Rate | Percentage | 0 | 0-100% | Optional - % of income saved |

## Calculation Formulas

### Marginal Tax Calculation (Icelandic System)

```
Current Tax = calculateTax(currentAnnualIncome)
Tax With Additional = calculateTax(currentAnnualIncome + additionalAnnualIncome)
Marginal Tax = (Tax With Additional - Current Tax)
Marginal Tax Rate = Marginal Tax / additionalAnnualIncome
```

**Icelandic Tax Brackets (2024)** - Simplified for estimation:
- 0 - 419,838 kr: 31.45% (útsvar ~14.5% + ríkisskattur 22.5% - persónuafsláttur offset)
- 419,839 - 1,133,796 kr: 37.95%
- 1,133,797 - 2,023,604 kr: 46.25%
- Above 2,023,604 kr: 46.25%

**Note**: Actual rates vary by municipality (útsvar). This calculator uses Reykjavík rates as baseline.

### Net Additional Income

```
Gross Additional Income = Hourly Rate × Hours Per Week × Weeks Per Year
Marginal Taxes = Gross Additional Income × Marginal Tax Rate
Total New Expenses = Sum of all new expense categories
Net Additional Income = Gross Additional Income - Marginal Taxes - Total New Expenses + One-Time Bonus
```

### Total Time Investment

```
Billable Hours = Hours Per Week × Weeks Per Year
Additional Time = (Commute + Preparation + Recovery) × Weeks Per Year
Total Annual Hours = Billable Hours + Additional Time
```

### Net Hourly Rate

```
Net Hourly Rate = Net Additional Income / Total Annual Hours
```

### Comparison to Current Work

```
Rate Difference (ISK) = Net Hourly Rate - Actual Hourly Wage
Rate Difference (%) = ((Net Hourly Rate - Actual Hourly Wage) / Actual Hourly Wage) × 100
```

### FI Timeline Impact (if FI inputs provided)

```
Current Annual Savings = Current Income × Savings Rate
New Annual Savings = Current Annual Savings + Net Additional Income
Years to FI (Current) = (FI Number - Current Net Worth) / Current Annual Savings
Years to FI (With Additional) = (FI Number - Current Net Worth) / New Annual Savings
Time Saved = Years to FI (Current) - Years to FI (With Additional)
```

**Simplification**: This assumes constant returns and no market volatility. Real FI calculation is more complex.

## Output Specifications

### Primary Output

- **Net Hourly Rate**: Displayed prominently, formatted as ISK with 0 decimals
- **Gross Hourly Rate**: Shown for comparison
- **Percentage Reduction**: How much lower net is vs gross
- **Success/Warning/Error Indicator**: Visual cue based on outcome

### Secondary Outputs

- **Marginal Tax Breakdown**: Show tax calculations clearly
- **Expense Breakdown**: Each expense as ISK and life-energy hours
- **Time Investment**: Total hours per week and per year
- **Monthly Net Income**: Net additional income per month
- **Comparison to Current Work**: Side-by-side with actual hourly wage
- **FI Impact** (if applicable): Months/years earlier to FI

### Plain Language Summary

Example outputs based on scenarios:

**Good Opportunity**:
```
Your net hourly rate is 3,200 kr after taxes and expenses (vs 4,000 kr gross).
Working 10 hours per week nets you 128,000 kr per month.
This is 12% higher than your current actual wage of 2,850 kr.
This opportunity moves your FI date 18 months earlier.

✓ Recommendation: This appears worthwhile based on financial metrics.
```

**Marginal Opportunity**:
```
Your net hourly rate is 2,100 kr after taxes and expenses (vs 3,000 kr gross).
Working 8 hours per week nets you 67,200 kr per month.
This is 15% lower than your current actual wage of 2,850 kr.
This opportunity moves your FI date 4 months earlier.

⚠ Recommendation: Modest benefit. Worth it if you enjoy the work or gain valuable skills.
```

**Poor Opportunity**:
```
Your net hourly rate is 1,400 kr after taxes and expenses (vs 3,500 kr gross).
Working 15 hours per week nets you 84,000 kr per month.
This is 51% lower than your current actual wage of 2,850 kr.
This opportunity moves your FI date 8 months earlier.

⚠ Warning: Your time is significantly undervalued here. Consider if non-financial factors justify this.
```

## Non-Functional Requirements

### Performance

1. **WHEN** user inputs change, **the system SHALL** recalculate results within 100ms.

2. **WHEN** the page loads, **the system SHALL** render the calculator within 2 seconds on a 3G connection.

3. **THE system SHALL** perform all calculations client-side (no server round-trips).

### Usability

1. **THE system SHALL** pre-fill inputs from Actual Hourly Wage Calculator when available.

2. **WHEN** user enters invalid data, **the system SHALL** display specific, actionable error messages.

3. **THE system SHALL** use Icelandic króna (kr) formatting throughout (e.g., "12.345 kr" for thousands).

4. **THE system SHALL** provide help text/tooltips for complex fields.

### Accessibility

1. **THE system SHALL** meet WCAG 2.1 AA standards.

2. **THE system SHALL** be keyboard navigable.

3. **THE system SHALL** be screen reader compatible with proper ARIA labels.

4. **THE system SHALL** maintain minimum 4.5:1 color contrast ratios.

### Privacy

1. **THE system SHALL** store all data in browser localStorage only (no server transmission).

2. **THE system SHALL** support data export to JSON file (user owns data).

3. **THE system SHALL** include clear privacy notice about local-only storage.

### Localization (Future)

1. **THE system SHALL** use Icelandic króna (kr) as default currency.

2. **THE system SHALL** use Icelandic tax brackets and rates.

3. **THE system SHALL** provide Icelandic-specific presets (e.g., Strætó costs, typical wages).

4. **Future**: Support for other currencies and tax systems.

## Dependencies

### Required

- **Actual Hourly Wage Calculator** (Feature 1.3): Provides baseline actual hourly wage for comparison
- **Tax Bracket Data**: Icelandic tax tables (2024, with annual updates)

### Optional

- **FI Number Calculator** (Future Phase 3): If available, auto-fill FI inputs
- **Savings Rate Calculator** (Future Phase 2.2): If available, auto-fill savings rate

## Constraints and Assumptions

### Constraints

1. **Tax Complexity**: Icelandic tax system is complex (útsvar varies by municipality, persónuafsláttur, barnabætur). Calculator uses simplified estimates.

2. **Individual Variation**: Everyone's tax situation is unique. Calculator assumes standard employee taxation.

3. **FI Calculation Simplicity**: FI timeline assumes linear savings, constant returns, no market volatility.

4. **Client-Side Only**: No backend for complex tax calculations or real-time bracket updates.

### Assumptions

1. **User has completed Actual Hourly Wage Calculator**: Core wage already calculated.

2. **Additional income is W-2 equivalent** (employee, not contractor): Taxes withheld, not self-employment.

3. **User understands "marginal" vs "average" tax rate**: Or calculator explains it clearly.

4. **Tax rates remain constant**: No mid-year changes or policy updates during user's evaluation.

5. **Expense estimates are user-provided and reasonable**: Calculator doesn't verify accuracy.

6. **User can identify "new" expenses**: Distinguishes existing expenses from additional ones caused by side income.

## Success Criteria

### Functional Success

- [ ] User can calculate net hourly rate accurately
- [ ] Tax calculations reflect Icelandic marginal tax rates
- [ ] All expense categories are tracked
- [ ] Comparison to actual hourly wage is clear
- [ ] FI timeline impact is calculated (when inputs provided)
- [ ] Plain language summary provides actionable guidance
- [ ] Presets provide quick estimates for common scenarios
- [ ] Data persists across sessions

### User Success

- [ ] User understands whether opportunity is worthwhile within 2 minutes
- [ ] User can compare multiple opportunities side-by-side
- [ ] User recognizes hidden costs (taxes, expenses, time)
- [ ] User makes more informed decisions about side income

### Quality Success

- [ ] Calculations match manual verification
- [ ] Mobile experience is smooth
- [ ] No accessibility violations
- [ ] Privacy is maintained (local-only data)

## Out of Scope (Future Enhancements)

- Advanced tax scenarios (self-employment, deductions, credits)
- Multi-currency support
- Integration with external tax APIs for real-time rates
- Employer benefits comparison (health insurance, retirement matching)
- Time-value-of-money calculations (present value of future earnings)
- Skill acquisition value estimation
- Career advancement probability modeling
- Burnout risk assessment based on total hours worked

## Disclaimers Required

**The system SHALL** display prominent disclaimers:

1. **Tax Disclaimer**: "Tax calculations are estimates for educational purposes. Actual taxes depend on your complete financial situation. Consult a tax professional (endurskoðandi eða löggiltur endurskoðandi) for accurate tax advice."

2. **Financial Advice Disclaimer**: "This calculator provides general information only, not financial, tax, or legal advice. Seek qualified professional advice for your specific situation."

3. **FI Calculation Disclaimer** (if FI features used): "FI timeline estimates assume constant returns and savings rates, which is unrealistic. Markets fluctuate, life changes happen. Use as rough guide only."

4. **Decision Disclaimer**: "Financial metrics are just one factor. Consider health, relationships, personal fulfillment, skill development, and career goals when evaluating opportunities."

---

## Requirements Traceability

| Requirement ID | User Story | Priority | Complexity |
|----------------|------------|----------|------------|
| REQ-1 | US-1: Evaluate Side Income | High | Medium |
| REQ-2 | US-2: Understand Tax Impact | High | Medium |
| REQ-3 | US-3: Account for New Expenses | High | Medium |
| REQ-4 | US-4: See FI Timeline Impact | Medium | Medium |
| REQ-5 | US-5: Compare to Actual Hourly Wage | High | Simple |
| REQ-6 | US-6: Plain Language Summary | High | Medium |
| REQ-7 | US-7: Preset Scenarios | Medium | Simple |
| REQ-8 | US-8: Save and Compare | Medium | Medium |
| REQ-9 | US-9: Mobile-Friendly | High | Medium |

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Draft - Ready for Review
