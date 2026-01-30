# Requirements: Debt Payoff vs Invest Analyzer

## Overview

**Feature**: Debt Payoff vs Invest Analyzer
**App**: peninganaedalifid.is
**Priority**: Phase 2.2.5 (Savings Calculators)
**Complexity**: Medium
**Book Reference**: "Your Money or Your Life" by Vicki Robin (Chapters on debt and investment strategy)

## Problem Statement

When people have extra money available, they face a common dilemma: Should they pay down debt faster or invest the money? This decision involves both mathematical calculations (interest rates, returns, compound growth) and emotional factors (peace of mind from being debt-free, stress of carrying debt).

The decision becomes particularly complex in Iceland due to:
- **Verðtryggð lán** (inflation-indexed loans) with variable real interest rates
- **Óverðtryggð lán** (non-indexed loans) with fixed rates
- Different psychological impacts of different debt types
- Opportunity cost of tying money up in debt vs. investing

Without clear analysis, people either:
1. Delay paying debt while missing high-interest costs
2. Over-prioritize debt payoff while missing investment growth opportunities
3. Feel paralyzed and do nothing

## User Stories

### US-1: Compare Debt Payoff vs Investment Scenarios
**As a** person with extra money available each month,
**I want to** compare the financial outcomes of paying extra on debt vs. investing,
**So that** I can make an informed decision about what to do with my extra money.

**Acceptance Criteria (EARS Format)**:

1. **When** the user enters debt balance, interest rate, and minimum payment, **the system shall** calculate the total interest paid and payoff timeline with minimum payments only.

2. **When** the user enters an extra payment amount, **the system shall** calculate two scenarios:
   - Scenario A: Extra payment applied to debt
   - Scenario B: Extra payment invested at expected return rate

3. **When** both scenarios are calculated, **the system shall** display side-by-side comparison showing:
   - Total interest paid (debt scenario)
   - Total investment growth (investment scenario)
   - Net worth difference at debt payoff date
   - Break-even point (when investment gains exceed interest saved)

4. **When** the user changes any input, **the system shall** recalculate results in real-time (< 100ms).

5. **The system shall** express all financial outcomes in both ISK and life energy hours (using actual hourly wage from calculator).

---

### US-2: Account for Icelandic Loan Types
**As an** Icelandic user with verðtryggð or óverðtryggð loans,
**I want to** select my loan type and have appropriate interest calculations,
**So that** I get accurate comparisons for my specific situation.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a loan type selector with options:
   - Óverðtryggð lán (non-indexed, fixed rate)
   - Verðtryggð lán (inflation-indexed)
   - Önnur lán (other/foreign loans)

2. **When** "Verðtryggð lán" is selected, **the system shall**:
   - Accept both nominal interest rate and expected inflation rate
   - Calculate real interest cost as: (1 + nominal rate) × (1 + inflation) - 1
   - Display both nominal and real interest rates clearly

3. **When** "Óverðtryggð lán" is selected, **the system shall**:
   - Accept fixed interest rate only
   - Calculate using standard amortization

4. **The system shall** provide typical rate presets:
   - Verðtryggð húsnæðislán: ~4% real + inflation
   - Óverðtryggð bílalán: ~8-12% nominal
   - Kreditkort: ~15-20% nominal

---

### US-3: Incorporate "Peace of Mind" Factor
**As a** user who values emotional well-being alongside financial optimization,
**I want to** adjust for the psychological benefit of being debt-free,
**So that** I can make a decision that accounts for both math and emotions.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a "Peace of Mind Factor" slider with range 0-10%.

2. **When** the peace of mind factor is set > 0%, **the system shall**:
   - Apply this as an "emotional interest rate" added to debt payoff benefits
   - Display explanation: "This represents the value you place on being debt-free"
   - Recalculate comparison with adjusted values

3. **The system shall** show how the peace of mind factor changes the recommendation:
   - "Without peace of mind factor: Invest wins by X kr"
   - "With Y% peace of mind factor: Pay debt wins by Z kr"

4. **The system shall** provide context for the slider:
   - 0%: Pure mathematical decision
   - 3-5%: Moderate preference for being debt-free
   - 7-10%: Strong preference for being debt-free

---

### US-4: Visualize Scenarios Over Time
**As a** visual learner,
**I want to** see charts showing how each scenario plays out over time,
**So that** I can understand the trajectories and crossover points.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** display a line chart showing net worth over time for both scenarios:
   - X-axis: Months (0 to debt payoff date)
   - Y-axis: Net worth (ISK)
   - Blue line: Debt payoff scenario
   - Green line: Investment scenario

2. **The system shall** highlight key milestones on the chart:
   - Debt-free date (debt payoff scenario)
   - Break-even point (where lines cross, if applicable)
   - Final comparison date

3. **When** the user hovers over any point on the chart, **the system shall** display:
   - Month number
   - Remaining debt (if applicable)
   - Investment balance
   - Net worth difference

4. **The system shall** provide a secondary chart showing:
   - Total interest paid vs. investment gains over time
   - Cumulative comparison

---

### US-5: Get Clear Recommendation with Reasoning
**As a** user who wants guidance,
**I want to** receive a clear recommendation with transparent reasoning,
**So that** I understand why one option is better than the other.

**Acceptance Criteria (EARS Format)**:

1. **When** scenarios are calculated, **the system shall** provide a recommendation in plain Icelandic:
   - "Borga aukalega á skuld" (Pay extra on debt) OR
   - "Fjárfesta aukapeninginn" (Invest the extra money)

2. **The system shall** display the financial advantage in multiple formats:
   - ISK difference: "Þú sparar X kr með [recommendation]"
   - Life energy difference: "Þetta samsvarar Y vinnutímum"
   - Percentage difference: "Z% betri niðurstaða"

3. **The system shall** provide reasoning including:
   - Interest rate comparison (debt rate vs. investment return)
   - Time horizon consideration
   - Risk factors
   - Break-even analysis

4. **If** the recommendation is close (< 5% difference), **the system shall**:
   - Flag this as "marginal difference"
   - Emphasize that personal preference should guide decision
   - Highlight the peace of mind factor's impact

5. **The system shall** always include disclaimer: "Þetta er fræðsluverkfæri, ekki fjármálaráðgjöf. Hugsaðu um áhættu og persónulegar aðstæður."

---

### US-6: Explore Different Scenarios
**As a** user wanting to understand my options,
**I want to** test different extra payment amounts and time horizons,
**So that** I can find the optimal strategy for my situation.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** allow users to adjust extra payment amount with:
   - Manual input field (ISK)
   - Preset buttons: 10.000 kr, 25.000 kr, 50.000 kr, 100.000 kr
   - Slider for quick adjustments

2. **The system shall** show impact of different extra payment levels:
   - Months saved on debt payoff
   - Total interest reduction
   - Investment value at debt-free date (if investing instead)

3. **When** user adjusts expected investment return rate, **the system shall**:
   - Recalculate investment scenario
   - Show sensitivity: "Each 1% change in return equals X kr difference"

4. **The system shall** provide return rate context:
   - Conservative: 4-5% (bonds, stable funds)
   - Moderate: 6-7% (balanced portfolio)
   - Aggressive: 8-10% (stock-heavy portfolio)
   - Display: "Sögulegt meðaltal hlutabréfa: ~7-8% langtíma"

---

### US-7: Account for Debt Types and Psychology
**As a** user with different types of debt,
**I want to** understand which debts to prioritize,
**So that** I can make strategic payoff decisions.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** allow comparison of multiple debts simultaneously (up to 3).

2. **When** multiple debts are entered, **the system shall**:
   - Calculate avalanche method (highest interest first)
   - Calculate snowball method (smallest balance first)
   - Show total interest saved with each method
   - Display emotional vs. mathematical trade-offs

3. **The system shall** categorize debt by type:
   - Góð skuld (Good debt): Low-interest mortgage, education loans
   - Hlutlaus skuld (Neutral debt): Car loans, moderate-rate personal loans
   - Slæm skuld (Bad debt): Credit cards, high-interest consumer loans

4. **For each debt type**, **the system shall** provide context:
   - Typical interest rates in Iceland
   - Tax deductibility (if applicable)
   - Recommended priority level

---

### US-8: Save and Compare Scenarios
**As a** user exploring different strategies,
**I want to** save multiple scenarios and compare them,
**So that** I can revisit and share my analysis.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** allow users to save current analysis as a named scenario.

2. **The system shall** allow saving up to 3 scenarios for comparison.

3. **When** multiple scenarios exist, **the system shall** display comparison table:
   - Scenario name
   - Key inputs (debt, extra payment, return rate)
   - Recommended action
   - Net worth at end
   - Winner highlighted

4. **The system shall** persist scenarios to localStorage.

5. **The system shall** allow export of scenarios to JSON file.

---

### US-9: Mobile-Responsive Experience
**As a** user accessing from mobile,
**I want to** have full functionality on small screens,
**So that** I can analyze debt decisions on the go.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** be fully functional on screens ≥ 320px width.

2. **The system shall** stack comparison columns vertically on mobile (< 768px).

3. **The system shall** use touch-friendly controls:
   - Minimum 44px tap targets
   - Slider controls optimized for touch
   - Number inputs with appropriate keyboards

4. **The system shall** display charts responsively:
   - Scrollable if needed
   - Touch-enabled zoom/pan
   - Legend repositioned for small screens

---

## Input Specifications

### Debt Inputs
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Loan Type | Select | Óverðtryggð | Required | Óverðtryggð / Verðtryggð / Önnur |
| Current Balance | Currency | - | Required, > 0 | Remaining principal |
| Interest Rate (Nominal) | Percentage | - | Required, 0-50% | Annual interest rate |
| Inflation Rate (for verðtryggð) | Percentage | 3% | 0-20% | Expected inflation |
| Minimum Payment | Currency | - | Required, > 0 | Monthly minimum |
| Extra Payment Amount | Currency | 0 | >= 0 | Additional payment available |

### Investment Inputs
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Expected Return Rate | Percentage | 7% | 0-20% | Annual investment return |
| Risk Level | Select | Moderate | - | Conservative/Moderate/Aggressive |

### Emotional Inputs
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Peace of Mind Factor | Percentage | 0% | 0-10% | Emotional value of being debt-free |

### Multiple Debts (Optional)
| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Debt 1-3 Name | Text | - | Max 50 chars | "Kreditkort", "Bílalán", etc. |
| Debt 1-3 Balance | Currency | - | > 0 | Per debt |
| Debt 1-3 Rate | Percentage | - | 0-50% | Per debt |
| Debt 1-3 Min Payment | Currency | - | > 0 | Per debt |
| Payoff Strategy | Select | Avalanche | - | Avalanche (high rate) / Snowball (low balance) |

## Calculation Formulas

### Standard Loan Amortization
```
Monthly Interest Rate = Annual Rate / 12
Number of Payments = Until balance = 0

For each month:
  Interest Paid = Remaining Balance × Monthly Interest Rate
  Principal Paid = Payment - Interest Paid
  New Balance = Remaining Balance - Principal Paid
```

### Verðtryggð Lán (Inflation-Indexed)
```
Real Interest Rate = ((1 + Nominal Rate) × (1 + Inflation Rate)) - 1
Monthly Real Rate = Real Interest Rate / 12

For each month:
  Balance Inflation Adjustment = Balance × (Inflation Rate / 12)
  Interest Paid = (Balance + Inflation Adjustment) × Monthly Real Rate
  Principal Paid = Payment - Interest Paid
  New Balance = Balance + Inflation Adjustment - Principal Paid
```

### Investment Growth
```
Monthly Return Rate = Annual Return / 12

For each month:
  Interest Earned = Balance × Monthly Return Rate
  New Balance = Balance + Monthly Investment + Interest Earned
```

### Net Worth Comparison
```
Debt Payoff Scenario Net Worth = -Remaining Debt Balance

Investment Scenario Net Worth = Investment Balance - Remaining Debt Balance

Net Worth Advantage = Investment Scenario - Debt Payoff Scenario
```

### Peace of Mind Adjustment
```
Adjusted Debt Rate = Actual Interest Rate + Peace of Mind Factor

Recalculate debt payoff benefit using adjusted rate
```

### Break-Even Point
```
Find month where:
  Investment Gains ≥ Interest Saved by Early Payoff

If break-even exists and is < debt payoff date:
  Investment wins after break-even month
Else:
  Calculate total difference at debt payoff date
```

## Output Specifications

### Primary Outputs
- **Recommendation**: "Borga aukalega á skuld" OR "Fjárfesta aukapeninginn"
- **Financial Advantage**: ISK difference, life energy hours, percentage
- **Reasoning**: Plain-language explanation (2-3 sentences)

### Debt Payoff Scenario
- Debt-free date (with/without extra payment)
- Total interest paid (with/without extra payment)
- Months saved with extra payment
- Life energy cost of total interest

### Investment Scenario
- Investment balance at debt-free date
- Total contributions
- Total investment gains
- Net worth vs. debt payoff scenario

### Comparative Metrics
- Break-even month (if applicable)
- Net worth advantage at months: 12, 24, 36, debt-free date
- Total cost comparison (interest paid vs. gains missed)
- Risk/reward summary

### Visualizations
- **Net Worth Over Time**: Line chart comparing both scenarios
- **Interest vs. Gains**: Cumulative comparison chart
- **Payoff Timeline**: Visual timeline showing key milestones
- **Sensitivity Chart**: How recommendation changes with different rates

## Non-Functional Requirements

### Performance
- Calculation: < 100ms for single debt
- Calculation: < 500ms for multiple debts with full amortization schedule
- Chart rendering: < 200ms
- Responsive to input changes (debounced 300ms)

### Accuracy
- Financial calculations accurate to 2 decimal places (ISK)
- Compound interest calculations using monthly compounding
- Amortization schedules match standard mortgage calculators

### Localization
- All UI text in Icelandic
- Number formatting: Icelandic format (1.234.567,89 kr)
- Percentage formatting: 3,5% (comma decimal separator)
- Date formatting: DD.MM.YYYY

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader compatible
- Chart descriptions provided
- Color not sole indicator of information

### Privacy
- All calculations client-side
- No data sent to server
- localStorage for persistence
- Export/import for data portability

### Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari and Chrome

## Dependencies

### Required Features
- **Actual Hourly Wage Calculator**: For life energy conversions

### Optional Enhancements
- FI Number calculator: To show impact on FI date
- Savings Rate calculator: To contextualize extra payment amount

## Icelandic Context

### Typical Loan Rates (2024)
- **Verðtryggð húsnæðislán**: 4-5% real + inflation (~3%)
- **Óverðtryggð húsnæðislán**: 7-9% nominal
- **Bílalán**: 8-12% nominal
- **Kreditkort**: 15-20% nominal
- **Námslán**: 0-2% real (government subsidized)

### Investment Return Context
- **Icelandic pension funds**: Historical ~6-8% average
- **Global stock indices**: ~7-10% long-term
- **Icelandic bonds**: 4-6%
- **Savings accounts**: 1-3%

### Cultural Considerations
- Strong cultural aversion to debt in Iceland
- High home ownership rates
- Preference for being debt-free before retirement
- Recent history of inflation (2008 crisis) influences attitudes

## User Interface Priorities

1. **Clarity over complexity**: Simple, clear comparison
2. **Action-oriented**: Clear recommendation with reasoning
3. **Educational**: Help users understand the math and factors
4. **Emotionally aware**: Acknowledge non-financial factors
5. **Icelandic-first**: Language, context, cultural fit

## Future Enhancements (Out of Scope for MVP)

- Tax considerations (mortgage interest deductions in Iceland limited)
- Early payoff penalties calculation
- Hybrid strategy (split extra payment between debt and investment)
- Monte Carlo simulation for investment returns (risk analysis)
- Integration with actual loan documents (import loan details)
- Debt consolidation scenario comparison
- Refinancing opportunity analysis

## Success Criteria

**This feature succeeds when**:
- [ ] Users can compare debt payoff vs. investment in < 2 minutes
- [ ] Results are accurate for both verðtryggð and óverðtryggð loans
- [ ] Recommendation is clear and includes reasoning
- [ ] Peace of mind factor is easy to understand and use
- [ ] Charts effectively visualize the comparison
- [ ] Mobile experience is fully functional
- [ ] All text is in clear, simple Icelandic
- [ ] Life energy conversions use actual hourly wage correctly
