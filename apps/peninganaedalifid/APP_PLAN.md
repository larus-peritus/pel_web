# App Plan: Peningarnir og Æða Lífið (peninganaedalifid.is)

## Vision

A privacy-first FIRE (Financial Independence, Retire Early) web application that helps users understand the true cost of their work and spending in terms of "life energy" (hours of their life). Inspired by the principles in "Your Money or Your Life" by Vicki Robin.

**Core Philosophy**: Every dollar you spend represents time from your life. By calculating your *actual* hourly wage (after work-related expenses and time), you can make informed decisions about whether purchases and lifestyle choices are worth the life energy they cost.

## Target Users

- **Primary**: People exploring or pursuing FIRE (Financial Independence, Retire Early)
- **Secondary**: Anyone wanting to understand their true relationship between time, money, and life satisfaction
- **Tertiary**: Financial educators, coaches, and book club groups studying "Your Money or Your Life"

## Core Value Proposition

Transform abstract financial concepts into concrete, actionable insights expressed in plain language ("This costs you 14 work-hours per month") with complete transparency about assumptions and calculations.

## Key UX Principles

1. **Plain Language Outputs**: "This costs you 14 work-hours per month" not just "$X"
2. **Annualized Numbers Everywhere**: Monthly → Yearly → Years-to-FI impact
3. **Assumption Transparency**: Every result shows what inputs drove it
4. **Privacy-First**: No account required; export/import local files
5. **Life Energy Units**: Goals and costs expressed in hours, not just dollars

## Platform & Technology

| Layer | Choice |
|-------|--------|
| Platform | Web (Vercel) |
| Frontend | React (with TypeScript) |
| Styling | Tailwind CSS |
| Backend | Node.js API routes (Vercel serverless) |
| State | Local state + localStorage (privacy-first) |
| Data Export | JSON file import/export |
| Database | None initially (client-side only) |

---

## Feature Breakdown

### Phase 1: MVP - Actual Hourly Wage Calculator ✅

**Goal**: Launch with the core calculator that demonstrates the site's value proposition.

#### 1.1 Actual Hourly Wage Calculator ⭐ (MVP) ✅
- **User Need**: Understand true hourly wage after work-related costs and time
- **Complexity**: Medium
- **Dependencies**: None (foundation feature)
- **Book Reference**: Chapter 2 of "Your Money or Your Life"

**Calculation includes**:
- Gross income inputs (salary, bonuses, benefits value)
- Work-related expenses (commute, clothing, meals, decompression costs, childcare delta)
- Work-related time (commute, getting ready, decompression, work-related illness)
- Output: True hourly wage with breakdown

**Features**:
- Saved presets (commute mode, work wardrobe tier, meal habits)
- Visual breakdown chart
- "What this means" plain-language summary
- Export/import capability

---

### Phase 2: Core Calculators & True Cost Tools

**Goal**: Expand the "life energy" concept to common spending decisions. Organized into three categories: expense calculators, savings calculators, and salary/income calculators.

---

#### 2.1 Expense-Based Calculators ✅

Tools that analyze recurring expenses and their impact on life energy and FI.

##### 2.1.1 Subscription Burn Meter ✅
- **User Need**: See subscription impact on FI timeline
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Output**: Total monthly subs → life energy cost + future value if invested
- **Status**: Implemented

##### 2.1.2 Commute Cost Analyzer ✅
- **User Need**: Understand true cost of commuting decisions
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage (for time valuation)
- **Inputs**: Fuel + depreciation + parking + insurance delta + time + stress slider
- **Output**: Cost per commute in dollars and life-hours
- **Icelandic Context**: Strætó pricing, common routes (Reykjavík, Akureyri, etc.)

##### 2.1.3 Meal Cost Calculator ✅
- **User Need**: Compare home cooking vs eating out in life energy terms
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Eating out frequency/cost, grocery spending, cooking time
- **Output**: Monthly cost comparison + life energy + FI impact
- **Icelandic Context**: Local restaurant/grocery price presets

##### 2.1.4 Housing Impact Calculator ✅
- **User Need**: Understand true cost of housing decisions (rent vs buy, mortgage terms)
- **Complexity**: Medium-High
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Rent OR mortgage (principal, interest rate, term), property taxes, maintenance, insurance
- **Output**: Monthly housing cost in life energy, total interest paid, opportunity cost analysis
- **Features**: Rent vs buy comparison, refinance impact, downsizing scenarios
- **Icelandic Context**: Icelandic mortgage structures, verðtryggð lán (inflation-indexed loans)

##### 2.1.5 Travel/Vacation Impact Calculator ✅
- **User Need**: See true cost of travel in life energy terms
- **Complexity**: Simple-Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Flight costs, accommodation, daily expenses, trip duration
- **Output**: Total trip cost in life energy hours, FI date impact, comparison scenarios
- **Icelandic Context**: Common destinations from Iceland (Europe, USA), seasonal pricing

##### 2.1.6 One-Time Purchase Decision Tool ✅
- **User Need**: Evaluate large purchases in life-energy terms
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Output**: Hours of life energy + opportunity cost at expected return (7% default)
- **Examples**: New car, furniture, electronics, home improvements

##### 2.1.7 Car Ownership Cost Calculator ✅
- **User Need**: Total cost of car ownership beyond just commute
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Purchase price/loan, insurance, fuel, maintenance, depreciation, parking
- **Output**: True monthly cost in ISK and life energy, comparison with alternatives
- **Icelandic Context**: High import taxes, fuel prices, bifreiðagjald

##### 2.1.8 Childcare/Education Cost Calculator ✅
- **User Need**: Plan for childcare and education expenses
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Daycare, after-school, activities, tutoring, university savings
- **Output**: Monthly and annual costs in life energy, planning scenarios
- **Icelandic Context**: Leikskóli pricing, frístund costs

##### 2.1.9 Work Convenience Spending Tracker ✅
- **User Need**: See impact of "tired tax" spending
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Example**: "I bought lunch because I was tired" → annualized impact

##### 2.1.10 Lifestyle Inflation Detector ✅
- **User Need**: Catch "quiet upgrades" before they compound
- **Complexity**: Medium
- **Dependencies**: Historical spending data (user-entered)
- **Flags**: Delivery increases, convenience spending, small recurring additions

##### 2.1.11 Expense Baseline Tool
- **User Need**: Define spending levels clearly for FIRE planning and other calculators
- **Complexity**: Medium
- **Dependencies**: None (foundation tool for other calculators)
- **Flow**: Guided builder for "barebones / comfortable / deluxe" budgets
- **Icelandic Context**: Local expense categories and realistic ranges (ISK)
- **Core Purpose**: Other calculators (FI Number, Savings Rate, Coast FIRE, etc.) can fetch user's expense layout
- **Categories**: Housing, Food, Transport, Healthcare, Insurance, Utilities, Personal, Entertainment, Savings
- **Features**:
  - Three tier system (Barebones/Comfortable/Deluxe)
  - Customizable categories with Icelandic defaults
  - Monthly and annual views
  - Export baseline for use in other calculators
  - Life energy breakdown per category

##### 2.1.12 Current Expense Report (Núverandi Útgjaldaskýrsla)
- **User Need**: Track ACTUAL current expenses in granular detail, see where money goes, understand life energy cost
- **Complexity**: Medium-High
- **Dependencies**: Actual Hourly Wage (for life energy calculations)
- **Distinction from Expense Baseline**: Baseline = "What WOULD I spend?" (planning tiers), Report = "What DO I spend now?" (actual tracking)
- **Flow**: Step-by-step wizard capturing all expense categories with detailed line items
- **Granular Categories**:
  - Húsnæði: Rent/mortgage, fasteignagjöld, húseigendatrygging, viðhald, íbúðafélagsgjöld
  - Matur: Groceries (Bónus/Krónan), dining out, coffee, delivery, work lunches
  - Samgöngur: Car payment, fuel, insurance, parking, Strætó, bike
  - Veitur: Electricity, heating, water, internet, phone, streaming
  - Áskriftir: Netflix, Spotify, gym, newspapers, software
  - Heilsa: Medications, dental, vision, supplements
  - And more...
- **Dashboard Features**:
  - Total monthly/annual expenses with life energy cost
  - Category breakdown with charts
  - Percentage of income analysis
  - Smart recommendations ("Optimize subscriptions with X calculator")
- **Data Integration API**:
  - `getCurrentExpenses()` - all expense data
  - `getSubscriptions()` - feeds Subscription Burn Meter
  - `getCommuteExpenses()` - feeds Commute Calculator
  - Other calculators can "pull from expense report" or use custom input
- **Core Purpose**: Central data source for all expense-related calculators

---

#### 2.2 Savings Calculators

Tools that help users understand and optimize their savings and FI path.

##### 2.2.1 Savings Rate Slider
- **User Need**: See savings rate impact on FI date
- **Complexity**: Medium
- **Dependencies**: FI Number (or input)
- **Output**: "Each 1% savings rate changes FI date by X"
- **Features**: Interactive slider with real-time FI date updates

##### 2.2.2 "Cut 10.000 kr" Impact Cards
- **User Need**: See concrete impact of spending cuts
- **Complexity**: Simple
- **Dependencies**: Savings Rate, Actual Hourly Wage
- **Output**: FI date shift + life energy regained per category cut
- **Features**: Category-specific cards (subscriptions, dining, transport, etc.)
- **Icelandic Context**: 10.000 kr increments (≈$100 equivalent)

##### 2.2.3 Compound Savings Life Energy Calculator
- **User Need**: See how regular savings grow over time in life energy terms
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Monthly savings amount, interest rate, time horizon
- **Output**: Future value in ISK + equivalent life energy hours saved, compound growth visualization
- **Features**: Compare different savings rates, show "life energy earned" from interest alone
- **Icelandic Context**: Typical Icelandic savings account rates, verðtryggð options

##### 2.2.4 Emergency Fund Freedom Meter
- **User Need**: Understand emergency fund in meaningful terms beyond just ISK
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage, monthly expenses
- **Inputs**: Current emergency fund balance, monthly essential expenses
- **Output**: "Months of freedom" (runway), life energy hours of security, risk rating
- **Features**: Target recommendations (3/6/12 months), progress tracker
- **Icelandic Context**: Local cost-of-living considerations

##### 2.2.5 Debt Payoff vs Invest Analyzer
- **User Need**: Decide whether to pay off debt or invest extra money
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Debt balance, interest rate, investment expected return, extra payment amount
- **Output**: Life energy cost comparison, break-even analysis, emotional vs mathematical recommendation
- **Features**: Side-by-side scenarios, "peace of mind" factor slider
- **Icelandic Context**: Typical Icelandic loan rates (verðtryggð lán vs óverðtryggð)

##### 2.2.6 Savings Goal Life Energy Tracker
- **User Need**: Track progress toward specific savings goals in work hours
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Goal name, target amount, current saved, monthly contribution
- **Output**: Progress in %, ISK, and life energy hours; time to goal; "work hours remaining"
- **Features**: Multiple goals, milestone celebrations, visual progress bar
- **Examples**: "Útborgun á húsnæði", "Ferðasjóður", "Nýr bíll"

##### 2.2.7 Automatic Savings Impact Calculator
- **User Need**: See long-term impact of "set and forget" automatic transfers
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Inputs**: Auto-transfer amount, frequency, expected return, time horizon
- **Output**: Future value, total contributions vs growth, life energy "earned" passively
- **Features**: "Pay yourself first" philosophy, habit formation emphasis
- **Key Insight**: "By automating X kr/month, you'll have Y months of freedom in Z years"

##### 2.2.8 Interest Savings Snowball Calculator
- **User Need**: See the compounding effect of reinvesting interest savings from extra loan payments
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage, Debt Payoff vs Invest Analyzer
- **Book Reference**: Compound effect / "Snowball" method
- **Core Concept**: When you pay extra on a loan, next month's interest is lower. That interest savings can be:
  - **Option A**: Added to next month's loan payment (accelerates debt payoff even faster)
  - **Option B**: Invested instead (builds wealth from the savings)

**Inputs**:
- Loan details (balance, rate, term, remaining payments)
- Extra monthly payment amount
- Investment expected return (for Option B)

**Outputs**:
- **Scenario 1**: Base case (just extra payment, no snowball)
- **Scenario 2**: Snowball to loan (reinvest savings into loan)
- **Scenario 3**: Snowball to investment (reinvest savings into investment)
- Comparison of all three scenarios in life energy hours
- Time to debt-free for each scenario
- Total wealth created (debt eliminated + investments) for each scenario

**Key Insights**:
- "By reinvesting your interest savings into the loan, you'll be debt-free X months earlier"
- "By investing your interest savings instead, you'll have X kr in investments when debt-free"
- Shows the power of compound effects working in your favor

**Visualization**:
- Line chart comparing all three scenarios over time
- Life energy breakdown for each approach
- Clear recommendation with reasoning

**Icelandic Context**: Works with both verðtryggð and óverðtryggð loans
**Cross-Reference**: Links to/from Debt Payoff vs Invest Analyzer (2.2.5)

---

#### 2.3 Salary & Income Calculators

Tools that analyze income, job profitability, and income changes.

##### 2.3.1 Job Profit/Loss Scorecard
- **User Need**: See if a job is truly profitable after all costs
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage Calculator (uses its methodology)
- **Output**: Net weekly/monthly "life energy" after costs, profitability grade (A-F)

##### 2.3.2 Raise/Bonus Reality Check
- **User Need**: Understand true value of income changes
- **Complexity**: Medium
- **Dependencies**: Tax bracket awareness, FI date calculation
- **Output**: After-tax gain + FI date shift + life energy change
- **Icelandic Context**: Icelandic tax brackets, útsvar considerations

##### 2.3.3 Additional Income Impact Calculator
- **User Need**: Evaluate side income opportunities (overtime, side hustles, part-time work)
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage, Tax brackets
- **Inputs**: Additional hours, hourly rate, new expenses incurred
- **Output**: Net hourly rate after taxes and expenses, FI date impact
- **Question Answered**: "Is this side job worth my time?"

##### 2.3.4 Job Offer Comparison Tool
- **User Need**: Compare multiple job offers beyond just salary
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage methodology
- **Inputs**: Salary, benefits, commute, hours expected, stress level
- **Output**: Side-by-side actual hourly wage comparison
- **Features**: Factor in non-monetary benefits (flexibility, growth, etc.)

---

### Phase 3: FIRE Planning Tools

**Goal**: Help users plan their path to financial independence with advanced planning scenarios.

#### 3.1 FIRE Type Explorer
- **User Need**: Understand different FIRE paths
- **Complexity**: Medium
- **Dependencies**: FI Number, Savings Rate
- **Scenarios**: LeanFIRE vs CoastFIRE vs BaristaFIRE vs FatFIRE
- **Features**: Side-by-side comparison, toggle scenarios, personalized recommendations

#### 3.2 Coast FIRE Calculator
- **User Need**: Calculate when investments can "coast" to FI
- **Complexity**: Medium
- **Dependencies**: Current investments, expected return
- **Output**: Age/date when you can stop saving and still reach FI
- **Features**: Different target ages, return rate sensitivity

#### 3.3 Barista FIRE Planner
- **User Need**: Plan for semi-retirement with part-time income
- **Complexity**: Medium
- **Dependencies**: FI Number, expense projections
- **Output**: Required part-time income to cover gaps, healthcare considerations

#### 3.4 Retirement Date Simulator
- **User Need**: See impact of different retirement dates
- **Complexity**: Medium
- **Dependencies**: All savings and expense data
- **Output**: Success probability, portfolio projections, flexibility analysis

#### 3.5 FI Number Builder
- **User Need**: Calculate target nest egg
- **Complexity**: Simple
- **Dependencies**: Expense Baseline Tool (2.1.11)
- **Inputs**: Target expenses × multiplier (25x, 30x, custom)
- **Features**: Tweakable assumptions, scenario comparison, pulls from Expense Baseline

#### 3.6 LeanFIRE Planner
- **User Need**: Plan for minimal-expense early retirement
- **Complexity**: Medium
- **Dependencies**: Expense Baseline Tool, FI Number Builder
- **Focus**: Barebones tier living, geographic arbitrage, frugality optimization
- **Output**: Minimum viable FI number, timeline to LeanFIRE, lifestyle trade-offs
- **Features**: Expense reduction scenarios, "what if I cut X?" analysis, frugality tips
- **Icelandic Context**: Realistic minimum living costs in Iceland, rural vs urban comparison

#### 3.7 FatFIRE Planner
- **User Need**: Plan for luxurious early retirement without lifestyle compromise
- **Complexity**: Medium
- **Dependencies**: Expense Baseline Tool, FI Number Builder
- **Focus**: Deluxe tier living, lifestyle preservation, abundance mindset
- **Output**: Comfortable FI number with margin, timeline to FatFIRE, lifestyle goals
- **Features**: Lifestyle wish list builder, "keep everything" scenarios, splurge budget planning
- **Icelandic Context**: Premium living costs in Iceland, travel budget, luxury considerations

---

### Phase 4: Time, Energy & Happiness Accounting

**Goal**: Extend beyond money to time and fulfillment tracking.

#### 4.1 Time Budget Dashboard
- **User Need**: See where time actually goes
- **Complexity**: Medium
- **Dependencies**: None
- **Tracking**: Work, commute, chores, sleep, leisure
- **Output**: Reclaim opportunity highlights

#### 4.2 Chore ROI Calculator
- **User Need**: Decide what to outsource
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Question**: "Should I outsource cleaning?" based on true wage + happiness value

#### 4.3 Stress Tax Slider
- **User Need**: Account for job stress in calculations
- **Complexity**: Simple
- **Dependencies**: Actual Hourly Wage
- **Feature**: User-controlled subjective cost that adjusts "true wage"
- **Transparency**: Clearly labeled as subjective input

#### 4.4 "Enough" Meter
- **User Need**: Define and track personal "enough"
- **Complexity**: Medium
- **Dependencies**: None
- **Flow**: Guided exercise to define spending and time "enough"
- **Feature**: Track drift from defined "enough" over time

---

### Phase 5: Safety & Transition Planning

**Goal**: Help users plan for security and life transitions.

#### 5.1 Emergency Fund Planner
- **User Need**: Right-size emergency fund
- **Complexity**: Medium
- **Dependencies**: Expense Baseline
- **Outputs**: Target months + "time-to-replace-income" risk rating

#### 5.2 Burn Rate & Runway Calculator
- **User Need**: Plan for self-employment/semi-retirement transition
- **Complexity**: Simple
- **Dependencies**: Expense data
- **Output**: How long current savings lasts at current/projected burn

#### 5.3 Big Expense Sinking Funds
- **User Need**: Plan for predictable large expenses
- **Complexity**: Simple
- **Dependencies**: None
- **Categories**: Car replacement, travel, home maintenance
- **Feature**: Keeps "annual surprises" honest in budget

#### 5.4 Insurance Coverage Checklist
- **User Need**: Understand coverage gaps
- **Complexity**: Simple
- **Dependencies**: None
- **Scope**: Planning tool (not quotes) - what you have, what gaps mean
- **Disclaimer**: Clear "not insurance advice" messaging

---

### Phase 6: Investment & Withdrawal Tools

**Goal**: Educational tools for managing investments (with clear disclaimers).

#### 6.1 Simple Portfolio Tracker
- **User Need**: Track balances without linking accounts
- **Complexity**: Medium
- **Dependencies**: None
- **Privacy**: Manual input only, no brokerage linking
- **Buckets**: Taxable, retirement, cash, other

#### 6.2 Withdrawal Strategy Sandbox
- **User Need**: Understand withdrawal approaches
- **Complexity**: Complex
- **Dependencies**: Portfolio data
- **Comparisons**: 4% rule vs variable spending vs guardrails
- **Disclaimer**: Educational only, not financial advice

#### 6.3 Sequence-of-Returns Demo
- **User Need**: Understand timing risk
- **Complexity**: Medium
- **Dependencies**: None
- **Feature**: Interactive chart showing why buffers matter
- **Purpose**: Education, not prediction

#### 6.4 Tax-Aware Drawdown Planner
- **User Need**: Plan withdrawal order
- **Complexity**: Complex
- **Dependencies**: Portfolio Tracker
- **Features**: Rough brackets + withdrawal order scenarios
- **Disclaimer**: Prominent "consult tax professional" messaging

---

### Phase 7: Behavior & Habit Features

**Goal**: Features that create ongoing engagement and behavior change.

#### 7.1 Weekly "1 Change" Challenge
- **User Need**: Actionable small steps
- **Complexity**: Simple
- **Dependencies**: Various calculators
- **Feature**: Pick one tweak, see annual + FI-date impact

#### 7.2 Life Energy Goal System
- **User Need**: Frame goals in meaningful terms
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage
- **Innovation**: Goals as "hours/week reclaimed" not just money saved

#### 7.3 Decision Journal
- **User Need**: Learn from past decisions
- **Complexity**: Simple
- **Dependencies**: None
- **Flow**: Log big spending decisions → later reflect on happiness impact

#### 7.4 Milestone Badges
- **User Need**: Celebrate progress meaningfully
- **Complexity**: Simple
- **Dependencies**: Various trackers
- **Innovation**: Not just net worth—"commute hours eliminated," "subscriptions halved," etc.

---

### Phase 8: Content & Playbooks

**Goal**: Educational content that complements the tools.

#### 8.1 Personal Playbooks
- **User Need**: Step-by-step guides for common goals
- **Complexity**: Content + Simple UI
- **Dependencies**: Relevant calculators
- **Examples**: "Reduce car dependence," "Cut food spend without misery," "Downsize plan"

#### 8.2 Case Studies
- **User Need**: Learn from others' transformations
- **Complexity**: Content
- **Dependencies**: None
- **Format**: Anonymized "before/after" spending + true hourly wage transformations

#### 8.3 Interactive Checklists
- **User Need**: Prepare for major transitions
- **Complexity**: Simple
- **Dependencies**: None
- **Examples**: "Prep for sabbatical," "Prep for quitting," "First year of semi-retirement"

---

### Phase 9: Community Features (Future)

**Goal**: Optional social features that add value without compromising privacy.

#### 9.1 Anonymous Benchmarks
- **User Need**: Contextual comparison
- **Complexity**: Medium (requires backend)
- **Privacy**: Aggregate only, no individual data exposed
- **Comparison**: Spending categories by household type and location band

#### 9.2 Scenario Sharing
- **User Need**: Share plans for feedback
- **Complexity**: Medium
- **Dependencies**: FI planning tools
- **Privacy**: Share links without revealing identity

#### 9.3 Local Groups Directory
- **User Need**: Find community
- **Complexity**: Simple
- **Dependencies**: None (curated list)
- **Format**: Simple directory of FIRE meetups/groups

---

## Implementation Sequence

### 🚀 Phase 1: Foundation & MVP ✅
**Focus**: Get the core calculator live and validate the concept

| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 1.0 | Project Setup (React/Vercel) ✅ | [x] | [x] |
| 1.1 | Core UI Components & Layout ✅ | [x] | [x] |
| 1.2 | Data Persistence (localStorage + export/import) ✅ | [x] | [x] |
| 1.3 | Actual Hourly Wage Calculator ✅ | [x] | [x] |

### 📊 Phase 2: Core Calculators
**Focus**: Build the "true cost" toolkit with expense, savings, and income tools

#### 2.1 Expense-Based Calculators ✅
| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 2.1.1 | Subscription Burn Meter ✅ | [x] | [x] |
| 2.1.2 | Commute Cost Analyzer ✅ | [x] | [x] |
| 2.1.3 | Meal Cost Calculator ✅ | [x] | [x] |
| 2.1.4 | Housing Impact Calculator ✅ | [x] | [x] |
| 2.1.5 | Travel/Vacation Impact ✅ | [x] | [x] |
| 2.1.6 | One-Time Purchase Tool ✅ | [x] | [x] |
| 2.1.7 | Car Ownership Cost ✅ | [x] | [x] |
| 2.1.8 | Childcare/Education Cost ✅ | [x] | [x] |
| 2.1.9 | Work Convenience Tracker ✅ | [x] | [x] |
| 2.1.10 | Lifestyle Inflation Detector ✅ | [x] | [x] |
| 2.1.11 | Expense Baseline Tool | [x] | [x] |
| 2.1.12 | Current Expense Report | [x] | [x] |

#### 2.2 Savings Calculators
| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 2.2.1 | Savings Rate Slider | [x] | [x] |
| 2.2.2 | "Cut 10.000 kr" Impact Cards | [x] | [x] |
| 2.2.3 | Compound Savings Life Energy Calculator | [x] | [x] |
| 2.2.4 | Emergency Fund Freedom Meter | [x] | [x] |
| 2.2.5 | Debt Payoff vs Invest Analyzer | [x] | [x] |
| 2.2.6 | Savings Goal Life Energy Tracker | [x] | [x] |
| 2.2.7 | Automatic Savings Impact Calculator | [x] | [x] |
| 2.2.8 | Interest Savings Snowball Calculator | [ ] | [ ] |

#### 2.3 Salary & Income Calculators
| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 2.3.1 | Job Profit/Loss Scorecard | [x] | [ ] |
| 2.3.2 | Raise/Bonus Reality Check | [ ] | [ ] |
| 2.3.3 | Additional Income Impact | [ ] | [ ] |
| 2.3.4 | Job Offer Comparison | [ ] | [ ] |

### 🎯 Phase 3: FIRE Planning
**Focus**: Advanced FI planning and scenarios

| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 3.1 | FIRE Type Explorer | [x] | [ ] |
| 3.2 | Coast FIRE Calculator | [x] | [ ] |
| 3.3 | Barista FIRE Planner | [x] | [ ] |
| 3.4 | Retirement Date Simulator | [x] | [ ] |
| 3.5 | FI Number Builder | [x] | [ ] |
| 3.6 | LeanFIRE Planner | [x] | [ ] |
| 3.7 | FatFIRE Planner | [x] | [ ] |

### ⏱️ Phase 4: Time & Energy
**Focus**: Beyond money

| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 4.1 | Time Budget Dashboard | [ ] | [ ] |
| 4.2 | Chore ROI Calculator | [ ] | [ ] |
| 4.3 | Stress Tax Slider | [ ] | [ ] |
| 4.4 | "Enough" Meter | [ ] | [ ] |

### 🛡️ Phase 5: Safety Planning
**Focus**: Security and transitions

| Order | Feature | Spec Status | Impl Status |
|-------|---------|-------------|-------------|
| 5.1 | Emergency Fund Planner | [ ] | [ ] |
| 5.2 | Burn Rate & Runway | [ ] | [ ] |
| 5.3 | Sinking Funds Planner | [ ] | [ ] |
| 5.4 | Insurance Checklist | [ ] | [ ] |

### 📈 Phase 6-9: Advanced Features
**Focus**: Investment tools, behavior features, content, community

*Detailed planning for these phases after Phase 5 completion.*

---

## Data Architecture (Privacy-First)

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌─────────────────────────────────────────────┐   │
│  │              React App                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │   │
│  │  │ Calcs   │  │ UI      │  │ Data Store  │  │   │
│  │  │ Engine  │  │ Comps   │  │ (Context)   │  │   │
│  │  └─────────┘  └─────────┘  └──────┬──────┘  │   │
│  │                                    │         │   │
│  │                           ┌────────▼───────┐ │   │
│  │                           │  localStorage  │ │   │
│  │                           └────────┬───────┘ │   │
│  └────────────────────────────────────┼─────────┘   │
│                                       │             │
│                              ┌────────▼───────┐     │
│                              │  JSON Export   │     │
│                              │  (Download)    │     │
│                              └────────────────┘     │
└─────────────────────────────────────────────────────┘

No server-side data storage in Phase 1-5.
All calculations client-side.
User owns their data via export files.
```

---

## Shared Data Model (Core)

```typescript
interface UserProfile {
  // Actual Hourly Wage inputs (core data reused everywhere)
  grossAnnualIncome: number;
  workHoursPerWeek: number;
  workWeeksPerYear: number;

  // Work-related expenses (annual)
  commuteExpenses: number;
  workClothing: number;
  workMeals: number;
  decompressionCosts: number;
  childcareDelta: number;
  otherWorkExpenses: number;

  // Work-related time (weekly hours)
  commuteTime: number;
  gettingReadyTime: number;
  decompressionTime: number;
  workRelatedIllnessTime: number;

  // Calculated
  actualHourlyWage: number;  // Derived

  // FI Planning
  targetMonthlyExpenses?: number;
  currentSavingsRate?: number;
  currentNetWorth?: number;
  expectedReturnRate?: number;
  fiMultiplier?: number;  // 25x, 30x, etc.
}
```

---

## Next Steps

### Immediate: Create specs for MVP features

```bash
# 1. Foundation specs
/spec-workflow project-setup
/spec-workflow core-ui-components
/spec-workflow data-persistence

# 2. MVP feature spec
/spec-workflow actual-hourly-wage-calculator
```

### After MVP Launch
1. Gather user feedback
2. Prioritize Phase 2 features based on demand
3. Create specs for next batch
4. Iterate

---

## Success Metrics

### MVP Success Criteria
- [x] Calculator produces accurate results matching book methodology ✅
- [x] Data persists across browser sessions ✅
- [x] Export/import works reliably ✅
- [x] Mobile-responsive design ✅
- [ ] Page loads in < 2 seconds
- [ ] Core Web Vitals all green

### Engagement Metrics (Future)
- Return visitor rate
- Export file usage
- Feature adoption rates
- User feedback sentiment

---

## Disclaimers Required

All financial tools will include appropriate disclaimers:
- "For educational purposes only"
- "Not financial, tax, or legal advice"
- "Consult qualified professionals for personal advice"
- "Past performance doesn't guarantee future results" (investment tools)
- "Calculations are estimates based on your inputs"
