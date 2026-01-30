# Requirements: Raise/Bonus Reality Check

**Feature ID**: 2.3.2
**Status**: Draft
**Created**: 2026-01-22
**App**: Peningana eða lífið (peninganaedalifid.is)

---

## 1. Executive Summary

### Purpose
Help Icelandic employees understand the TRUE value of salary increases (raises, bonuses, job offers) by calculating after-tax gain, impact on FI timeline, and life energy cost. Prevents the common trap of overestimating income changes by revealing the actual take-home increase after Iceland's progressive tax system.

### Key Value Proposition
- **For Job Seekers**: Evaluate competing offers based on real take-home pay and FI impact
- **For Employees**: Understand if a raise justifies extra effort/commute/stress
- **For Career Decisions**: Compare salary increases to lifestyle cost increases

### Context
This feature is part of the "Your Money or Your Life FIRE Calculator" suite (Section 2.3 - Decision Tools). It builds on existing infrastructure for life energy calculations and adds Icelandic tax awareness.

---

## 2. User Stories

### US-1: Evaluate Job Offer
**As a** job seeker
**I want to** compare my current salary to a job offer's salary after taxes
**So that** I can make informed decisions based on real take-home increase, not inflated gross numbers

**Acceptance Criteria** (EARS format):
- **WHEN** user enters current gross annual salary and proposed gross annual salary **THEN** system SHALL calculate after-tax difference in ISK
- **WHEN** user enters municipal tax rate (útsvar) **THEN** system SHALL apply both national tax brackets AND municipal tax to income calculations
- **WHEN** calculation completes **THEN** system SHALL display "You'll earn X kr more per month after taxes" in plain language
- **IF** difference is less than 10% **THEN** system SHALL display warning "Small real increase - consider total compensation"

### US-2: Understand FI Timeline Impact
**As a** FIRE-focused employee
**I want to** see how a raise affects my years-to-FI
**So that** I can prioritize career moves that accelerate financial independence

**Acceptance Criteria**:
- **WHEN** user inputs current and proposed salary **THEN** system SHALL calculate impact on FI date in years and months
- **WHEN** user specifies savings rate (% of income saved) **THEN** system SHALL use savings rate to calculate FI impact
- **WHEN** FI calculation shows acceleration **THEN** system SHALL display "This moves your FI date X months earlier"
- **IF** raise is fully lifestyle-inflated (savings rate stays same absolute amount) **THEN** system SHALL warn "No FI benefit - lifestyle inflation detected"

### US-3: See Life Energy Cost of Earning More
**As a** user evaluating work-life balance
**I want to** see raise value expressed in life energy (hours of life)
**So that** I can decide if extra money justifies extra time/stress

**Acceptance Criteria**:
- **WHEN** user enters additional hours per week required for higher salary **THEN** system SHALL calculate cost in annual life energy hours
- **WHEN** calculation includes extra time **THEN** system SHALL show "true hourly wage increase" (accounting for extra hours worked)
- **WHEN** displaying results **THEN** system SHALL show life energy gain as "X extra hours of freedom per year"
- **IF** extra hours reduce actual hourly wage **THEN** system SHALL warn "Effective pay decrease despite raise"

### US-4: Evaluate Bonus vs Raise
**As a** employee choosing between compensation structures
**I want to** compare one-time bonus to equivalent annual raise
**So that** I can negotiate for the option with better long-term value

**Acceptance Criteria**:
- **WHEN** user selects "bonus" option **THEN** system SHALL calculate one-time after-tax amount
- **WHEN** user selects "raise" option **THEN** system SHALL calculate annualized after-tax gain over 5 years
- **WHEN** comparing both **THEN** system SHALL show FI impact of investing bonus vs raise savings
- **WHEN** displaying results **THEN** system SHALL state "A X kr raise equals Y kr/year, worth Z kr bonus at 7% over 5 years"

### US-5: Compare Multiple Scenarios
**As a** user with multiple job offers or raise options
**I want to** save and compare up to 4 scenarios side-by-side
**So that** I can make data-driven career decisions

**Acceptance Criteria**:
- **WHEN** user completes a calculation **THEN** system SHALL offer "Save as scenario" button
- **WHEN** user saves scenario **THEN** system SHALL allow naming (max 50 characters, Icelandic characters supported)
- **IF** user has 2+ saved scenarios **THEN** system SHALL display comparison table with key metrics
- **WHEN** displaying comparison **THEN** system SHALL highlight scenario with best after-tax gain, FI impact, and hourly wage

### US-6: Account for Icelandic Tax Nuances
**As a** Icelandic taxpayer
**I want to** accurate calculations using Iceland's tax system
**So that** results reflect my actual tax situation

**Acceptance Criteria**:
- **WHEN** calculating taxes **THEN** system SHALL use 2026 Icelandic tax brackets (37.74% up to X kr, 46.24% above)
- **WHEN** user enters municipality **THEN** system SHALL apply correct útsvar rate (12-15% based on location)
- **WHEN** calculating income changes **THEN** system SHALL account for personal tax credit (persónuafsláttur ~70,950 kr/month)
- **WHEN** income crosses tax bracket boundary **THEN** system SHALL apply marginal tax rates correctly
- **IF** calculation uses pension contributions **THEN** system SHALL apply minimum 4% employee + 8% employer contributions

---

## 3. Functional Requirements

### REQ-CALC-001: After-Tax Calculation
**Priority**: Critical
**Description**: Calculate net income increase after all Icelandic taxes

**Details**:
- Input: Current gross annual income (ISK)
- Input: Proposed gross annual income (ISK)
- Input: Municipality (for útsvar lookup) OR manual útsvar % (12-15%)
- Output: Monthly after-tax difference (ISK)
- Output: Annual after-tax difference (ISK)
- Output: Effective tax rate on increase (percentage)

**Formula**:
```
1. Calculate current net = Current gross - (National tax + Útsvar - Tax credit)
2. Calculate proposed net = Proposed gross - (National tax + Útsvar - Tax credit)
3. After-tax gain = Proposed net - Current net
```

**Validation**:
- Current income > 0 ISK
- Proposed income > 0 ISK
- Proposed income ≠ Current income (must be different)
- Útsvar rate: 12-15%
- Municipality selection from predefined list OR manual override

### REQ-CALC-002: FI Date Impact
**Priority**: High
**Description**: Calculate impact on financial independence timeline

**Details**:
- Input: Current annual expenses (ISK)
- Input: Current savings rate (% of net income)
- Input: Current portfolio value (ISK, optional)
- Input: Expected investment return (%, default 7%)
- Output: Years to FI with current salary
- Output: Years to FI with proposed salary
- Output: Difference in months/years

**Formula**:
```
FI Number = Annual Expenses × 25 (4% rule)
Years to FI = log((FI Number × r) / (Annual Savings) + 1) / log(1 + r)
Where r = Expected return rate
```

**Assumptions Display**:
- 4% safe withdrawal rate
- Expenses stay constant (no lifestyle inflation)
- Investment returns compound annually
- Savings rate applies to raise proportionally

### REQ-CALC-003: Life Energy Analysis
**Priority**: High
**Description**: Express raise value in time units (hours of life)

**Details**:
- Input: Current work hours per week
- Input: Proposed work hours per week (if changing)
- Input: Current actual hourly wage (from main calculator)
- Output: Annual life energy gain (hours)
- Output: True hourly wage change (accounting for time change)
- Output: Life energy years gained toward FI

**Formula**:
```
Current annual hours = Current weekly hours × 50 weeks
Proposed annual hours = Proposed weekly hours × 50 weeks
True hourly wage = (After-tax annual income) / (Annual work hours + extra time)
Life energy gain = (FI years saved) × 2000 hours/year
```

### REQ-CALC-004: Bonus vs Raise Comparison
**Priority**: Medium
**Description**: Compare one-time bonus to equivalent recurring raise

**Details**:
- Input: Bonus amount (gross ISK)
- Input: Equivalent raise amount (gross annual ISK)
- Input: Time horizon (default 5 years)
- Output: After-tax bonus value
- Output: 5-year cumulative after-tax raise value
- Output: Future value of investing each option
- Output: Recommendation based on FI impact

**Formula**:
```
Bonus net = Bonus gross × (1 - Marginal tax rate)
Raise cumulative = Raise annual net × Years
Bonus invested = FV(Bonus net, years, 7%)
Raise invested = FV(Raise annual net × 0.5, years, 7%)
  (Assumes 50% of raise is saved)
```

**Tax Note**: Bonuses taxed at marginal rate in Iceland

### REQ-CALC-005: Scenario Comparison
**Priority**: Medium
**Description**: Save and compare multiple income scenarios

**Details**:
- Storage: Up to 4 saved scenarios
- Data: Scenario name, all inputs, calculated results, timestamp
- Display: Side-by-side comparison table
- Metrics: After-tax gain, FI impact, hourly wage, life energy cost

**Comparison Table Columns**:
- Scenario name
- Gross income
- Net monthly income
- After-tax gain vs current
- Years to FI
- FI acceleration (months)
- True hourly wage
- Annual life energy cost

---

## 4. Non-Functional Requirements

### NFR-001: Accuracy
**Description**: Tax calculations must reflect Icelandic tax law
**Requirement**: All tax rates and brackets verified against Skatturinn.is for 2026
**Validation**: Test calculations against real tax scenarios

### NFR-002: Performance
**Description**: Instant results for responsive UX
**Requirement**: All calculations complete in < 100ms
**Validation**: Performance tests with various input ranges

### NFR-003: Localization
**Description**: Full Icelandic language support
**Requirement**: All labels, messages, errors in Icelandic with ISK formatting
**Details**:
- Currency: ISK with dot thousands separator (e.g., "1.234.567 kr")
- Decimals: Whole numbers only for ISK
- Dates: DD.MM.YYYY format
- Labels: Icelandic terminology (laun, bónus, skattur, etc.)

### NFR-004: Privacy
**Description**: No server-side data storage
**Requirement**: All calculations client-side, localStorage only
**Details**:
- No salary data sent to server
- Export/import as JSON for data portability
- Clear data button for shared devices

### NFR-005: Mobile Responsiveness
**Description**: Fully functional on mobile devices
**Requirement**: Touch-friendly inputs, readable results on 375px+ screens
**Details**:
- Comparison table scrolls horizontally on mobile
- Number inputs with appropriate keyboards (numeric)
- Forms stack vertically on small screens

### NFR-006: Accessibility
**Description**: WCAG 2.1 AA compliance
**Requirement**: Screen reader support, keyboard navigation, color contrast
**Details**:
- All form inputs have labels
- Results announced to screen readers
- Focus management for modal dialogs
- Error messages associated with fields

---

## 5. Constraints and Assumptions

### Constraints
1. **Tax Data**: Must manually update tax brackets annually (no API available from Skatturinn)
2. **Municipality Data**: Útsvar rates may change; require manual updates
3. **No Historical Data**: Calculator shows current tax situation, not historical
4. **Pension Simplification**: Assumes standard 4%/8% contribution, ignores union-specific rates
5. **No Tax Optimization**: Doesn't account for deductions beyond personal credit

### Assumptions
1. **User Income**: Assumes employee income (wages/salary), not self-employment
2. **Tax Residency**: User is Icelandic tax resident for full year
3. **Standard Deductions**: Only personal tax credit applied, no special deductions
4. **Savings Behavior**: User maintains savings rate % on increased income
5. **Investment Returns**: 7% annual real return (after inflation)
6. **Work Weeks**: Standard 50 weeks/year (2 weeks unpaid time off)
7. **FI Calculation**: 4% safe withdrawal rate (25× annual expenses)
8. **No Debt Changes**: Raise doesn't trigger debt paydown changes

### Out of Scope (v1)
- Tax-advantaged accounts (equity savings accounts)
- Self-employment tax calculations
- Multi-year salary projection
- Benefits valuation (health insurance, stock options)
- Lifestyle inflation modeling
- Part-time/variable hour calculations
- Spousal/family income coordination

---

## 6. Success Criteria

### Must Have (v1)
- [x] Accurate Icelandic tax calculations (national + útsvar)
- [x] After-tax income difference in ISK
- [x] FI date impact in years/months
- [x] Life energy gain/cost in hours
- [x] Plain language summary
- [x] Save up to 4 scenarios
- [x] Comparison table view
- [x] Mobile responsive
- [x] Full Icelandic localization

### Should Have (v2)
- [ ] Bonus vs Raise comparison mode
- [ ] Municipality dropdown (vs manual útsvar)
- [ ] Pension contribution toggle
- [ ] Export scenarios to PDF
- [ ] Share link (with data in URL, no backend)

### Could Have (v3)
- [ ] Total compensation calculator (salary + benefits)
- [ ] Career path projector (multi-year raises)
- [ ] Industry salary benchmarks
- [ ] Cost-of-living adjustment calculator

---

## 7. Dependencies

### Internal Dependencies
- **Existing Calculator Infrastructure**: Leverages CalculatorContext, life energy functions, storage utilities
- **Tax Calculation Module**: NEW - must create Icelandic tax engine
- **FI Calculation Module**: NEW - must create FI timeline calculator
- **Scenario Manager**: Extend existing pattern from Commute/Housing calculators

### External Dependencies
- **Tax Data Source**: Skatturinn.is (manual data entry, no API)
- **Municipal Tax Rates**: Samband Íslenskra Sveitarfélaga (manual data entry)

### Technical Stack
- React 18+ with TypeScript
- Next.js 14+
- Tailwind CSS for styling
- Recharts for visualizations (optional for v1)
- localStorage for persistence

---

## 8. Data Models (Preview)

```typescript
interface RaiseInputs {
  currentGrossAnnual: number;      // ISK
  proposedGrossAnnual: number;     // ISK
  municipality?: string;           // Dropdown selection
  customUtsvarRate?: number;       // Manual override (12-15%)
  currentWorkHoursWeek: number;    // Hours/week
  proposedWorkHoursWeek?: number;  // Optional if changing

  // FI calculation inputs (optional)
  annualExpenses?: number;         // ISK
  savingsRate?: number;            // Percentage (0-100)
  currentPortfolio?: number;       // ISK
  expectedReturn?: number;         // Percentage (default 7%)
}

interface RaiseResults {
  // Tax calculations
  currentNetAnnual: number;
  proposedNetAnnual: number;
  afterTaxGainMonthly: number;
  afterTaxGainAnnual: number;
  effectiveTaxRateOnIncrease: number;

  // FI impact
  currentYearsToFI?: number;
  proposedYearsToFI?: number;
  fiAccelerationMonths?: number;

  // Life energy
  trueHourlyWageChange: number;
  annualLifeEnergyGain: number;   // Hours

  // Plain language summary
  summary: string;
  warnings: string[];
}

interface RaiseScenario {
  id: string;
  name: string;
  inputs: RaiseInputs;
  results: RaiseResults;
  createdAt: string;
  updatedAt: string;
}
```

---

## 9. UI/UX Requirements

### Form Layout
1. **Current Situation Section**
   - Current gross annual salary (ISK)
   - Current net monthly income (calculated from main calculator)
   - Current work hours per week
   - Municipality selection OR manual útsvar %

2. **Proposed Situation Section**
   - Proposed gross annual salary (ISK)
   - Proposed work hours per week (if changing)
   - "Same hours" quick-fill button

3. **FI Context Section** (Collapsible/Optional)
   - Annual expenses (ISK)
   - Current savings rate (%)
   - Current portfolio value (ISK)
   - Expected return (% with 7% default)

### Results Display

#### Primary Results (Always Shown)
```
After-Tax Monthly Increase
+ X.XXX kr/mánuður

After-Tax Annual Increase
+ X.XXX kr/ári

Effective Tax Rate on Increase
XX%
```

#### FI Impact (If FI inputs provided)
```
FI Date Impact
Current Path: X.X ár to FI
New Path: Y.Y ár to FI
Acceleration: Z months earlier

This is worth X extra years of freedom
```

#### Life Energy Analysis
```
True Hourly Wage
Current: X kr/klst
Proposed: Y kr/klst
Change: +Z kr/klst (+W%)

Annual Life Energy Impact
This raise buys you X hours of freedom per year
(Equal to Y work days or Z work weeks)
```

#### Plain Language Summary
```
In plain language:
You'll take home an extra 45.000 kr per month after taxes.
This moves your FI date 8 months earlier.
Your real hourly wage increases by 350 kr (from 2.800 to 3.150 kr).
This is worth 240 hours of freedom per year.

⚠ Watch out:
- 38% of the raise goes to taxes
- If you lifestyle-inflate by this amount, you'll delay FI instead
```

### Scenario Comparison View
Side-by-side table (max 4 scenarios):

| Metric | Current | Offer A | Offer B | Offer C |
|--------|---------|---------|---------|---------|
| Gross Annual | 6.000.000 | 6.500.000 | 6.800.000 | 6.300.000 |
| Net Monthly | 343.000 | 372.000 | 392.000 | 356.000 |
| Monthly Gain | - | +29.000 | +49.000 | +13.000 |
| FI Acceleration | - | 6 months | 11 months | 3 months |
| Hourly Wage | 2.800 | 3.050 | 3.200 | 2.900 |
| Work Hours/Week | 40 | 40 | 45 | 40 |

**Highlight best option** per metric with green background

---

## 10. Test Scenarios

### TS-1: Basic Raise Calculation
**Given**: Current 6,000,000 kr/year, Proposed 6,500,000 kr/year, 14% útsvar
**When**: User submits calculation
**Then**: System shows ~29,000 kr/month after-tax gain
**And**: Effective tax rate ~42% on increase

### TS-2: Tax Bracket Jump
**Given**: Current 8,500,000 kr/year (below top bracket), Proposed 9,500,000 kr/year (above top bracket)
**When**: User submits calculation
**Then**: System applies 37.74% to income below threshold, 46.24% above
**And**: Shows higher effective tax rate than TS-1

### TS-3: FI Acceleration
**Given**: Current 6M kr/year, Proposed 7M kr/year, 60% savings rate, 3M portfolio
**When**: User submits with FI inputs
**Then**: System shows years to FI decrease
**And**: Displays FI acceleration in months

### TS-4: Pay Cut for Less Hours
**Given**: Current 6M kr/year, 40 hrs/week, Proposed 5M kr/year, 32 hrs/week
**When**: User submits calculation
**Then**: System shows negative salary change but possibly positive hourly wage
**And**: Calculates life energy impact

### TS-5: Lifestyle Inflation Warning
**Given**: 500,000 kr raise, savings rate drops from 50% to 40%
**When**: User submits calculation
**Then**: System warns about FI delay despite raise

### TS-6: No Change
**Given**: Current = Proposed salary
**When**: User submits
**Then**: System shows validation error "Salaries must be different"

### TS-7: Municipality Variations
**Given**: Same salary change, different municipalities (12% vs 15% útsvar)
**When**: User compares scenarios
**Then**: System shows different net outcomes based on útsvar

---

## 11. Icelandic Tax Context (2026)

### National Income Tax Brackets
- **0 - 488,666 kr/month**: 31.48% (average)
- **Above 488,666 kr/month**: 37.74% (lower bracket) + 46.24% (top bracket marginal)

**Note**: Exact brackets updated annually by Skatturinn

### Municipal Tax (Útsvar)
Range: 12.00% - 14.95%
Common rates:
- Reykjavík: 14.48%
- Kópavogur: 13.13%
- Hafnarfjörður: 13.68%
- Akureyri: 14.52%

### Personal Tax Credit (Persónuafsláttur)
~70,950 kr/month (851,400 kr/year for 2026)
Applied to reduce total tax liability

### Pension Contributions
- Employee: Minimum 4% (deducted pre-tax)
- Employer: Minimum 8% (added to compensation)
- Union agreements may require higher rates

### Tax Calculation Example
```
Gross monthly: 500,000 kr
- Employee pension (4%): -20,000 kr
Taxable income: 480,000 kr

National tax (37.74%): 181,152 kr
Municipal tax (14%): 67,200 kr
Total tax: 248,352 kr
- Personal credit: -70,950 kr
Net tax: 177,402 kr

Net income: 480,000 - 177,402 = 302,598 kr
+ Employer pension (8%): +40,000 kr (not in paycheck)
```

---

## 12. Open Questions

1. **Pension Toggle**: Should users be able to exclude pension from calculations?
2. **Municipality Dropdown**: Full list (79 municipalities) or most common 20?
3. **Tax Year**: Show calculations for current year only, or allow historical?
4. **Benefits**: Include any benefits valuation in v1 or defer to v2?
5. **Sharing**: URL-based sharing vs export-only?
6. **Multi-Income**: Support multiple income sources or single-employer only?

---

## 13. Traceability

This requirements document drives:
- **Design Document**: `design-raise-bonus-reality-check.md` (architecture, components, data flow)
- **Tasks Document**: `tasks-raise-bonus-reality-check.md` (implementation breakdown)
- **Tests**: All requirements map to specific test cases
- **Code**: All features traceable to requirements via REQ-XXX identifiers

---

**Document Status**: ✅ Complete
**Next Step**: Design Phase
**Owner**: Development Team
**Stakeholders**: Product, UX, Icelandic Tax Expert (for validation)
