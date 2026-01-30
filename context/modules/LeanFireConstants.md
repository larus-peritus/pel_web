# LeanFIRE Constants Module

## Location
`apps/peninganaedalifid/src/lib/constants/leanFire.ts`

## Purpose
Provides Iceland-specific barebones expense defaults, FI multiplier options, reduction percentage configurations, comprehensive frugality tip database, and location comparison data for the LeanFIRE (Lágmarks FIRE) Planner calculator.

## Overview
This module is the foundation of the LeanFIRE calculator, containing all static data and configuration needed to help users plan for minimal-expense early retirement in Iceland. It includes realistic cost estimates for both urban (Reykjavík) and rural (Landsbyggð) living, comprehensive frugality tips adapted for Iceland, and helper functions for accessing this data.

## Exports

### Constants

#### Default Barebones Expenses
- `DEFAULT_BAREBONES_REYKJAVIK: CategoryExpenses` - Monthly barebones living costs in Reykjavík (240,000 ISK/month)
  - Housing: 120,000 ISK (shared apartment or studio)
  - Food: 40,000 ISK (budget grocery shopping)
  - Transport: 12,000 ISK (Strætó bus pass)
  - Healthcare: 5,000 ISK (co-pays after universal coverage)
  - Insurance: 8,000 ISK (basic renters insurance)
  - Utilities: 25,000 ISK (electricity, internet, phone)
  - Personal: 10,000 ISK (hygiene, secondhand clothing)
  - Entertainment: 15,000 ISK (free/low-cost activities)
  - Other: 5,000 ISK (buffer)

- `DEFAULT_BAREBONES_LANDSBYGGD: CategoryExpenses` - Monthly barebones living costs in rural Iceland (200,000 ISK/month)
  - 40,000 ISK/month cheaper than Reykjavík
  - Lower housing (80,000 ISK) but higher transport (20,000 ISK for car)
  - Reflects rural cost realities

#### FI Multiplier Options
- `FI_MULTIPLIER_OPTIONS: Array<{value, label, description, withdrawalRate, recommended}>` - Array of 2 multiplier options:
  - 25x (4% withdrawal rate) - US standard, not recommended for Iceland
  - 30x (3.33% withdrawal rate) - Recommended for Iceland's higher inflation

- `DEFAULT_FI_MULTIPLIER: FIMultiplier` - Default value of 30 (conservative for Iceland)

#### Reduction Percentage Options
- `REDUCTION_PERCENTAGE_OPTIONS: Array<{value, label, description}>` - 4 standard reduction levels:
  - 10% - Small reduction (easy to implement)
  - 25% - Medium reduction (requires some effort)
  - 50% - Large reduction (significant changes)
  - 100% - Eliminate category entirely

#### Location Comparison Data
- `LOCATION_PROS_CONS: {reykjavik, landsbyggd}` - Comprehensive pros/cons lists in Icelandic
  - Reykjavík: 7 pros (better job opportunities, public transit, amenities), 6 cons (expensive housing, consumption temptations)
  - Landsbyggð: 6 pros (cheaper housing, peaceful, nature access), 7 cons (fewer jobs, car necessary, limited services)

#### Frugality Tip Database
- `FRUGALITY_TIP_TEMPLATES: Array<{category, title, description, difficulty, potentialSavingsRange, icelandicResources}>` - 30+ Iceland-specific frugality tips:
  - **Housing tips** (5): Share apartment, move to rural areas, long-term leases, utilities included, smaller space
  - **Food tips** (7): Shop at Bónus/Krónan, cook at home, meal planning, buy in bulk, pack lunch, drink water, store brands
  - **Transport tips** (5): Use Strætó/bicycle, buy used car, combine errands, carpool, cheaper gas stations
  - **Entertainment tips** (5): Use libraries, enjoy nature, cancel subscriptions, free events, home gatherings
  - **Personal tips** (4): Buy secondhand clothing (Sparisjóður, Rauði krossinn), DIY haircuts, make own products, 30-day wait rule
  - **Utilities tips** (3): Compare providers, lower thermostat, simpler phone plan
  - **Healthcare/Insurance tips** (2): Use primary care, minimize insurance coverage

#### Default Values and Ranges
- `LEANFIRE_DEFAULTS: {fiMultiplier, investmentReturn, selectedLocation, version}` - Default settings
- `LEANFIRE_RANGES: {monthlyExpenses, currentSavings, currentAge, savingsRate, investmentReturn}` - Validation ranges

### Helper Functions

- `getDefaultBarebonesExpenses(location)` - Get barebones expenses for Reykjavík or Landsbyggð
- `getTotalMonthly(expenses)` - Sum all expense categories to get total monthly cost
- `getFIMultiplierDetails(multiplier)` - Get full details object for a multiplier value
- `getReductionPercentageDetails(percent)` - Get full details object for a reduction percentage
- `getTipsForCategory(category)` - Filter tips by expense category
- `estimateTipSavings(tip, currentExpense)` - Estimate savings for a tip based on current expense level

## Key Functionality

### Iceland-Specific Cost Reality
- Based on actual Statistics Iceland data and LeanFIRE practitioner experience
- Reykjavík costs 20% higher than rural areas (240k vs 200k ISK/month)
- Housing is the biggest cost differential (120k vs 80k)
- Transport costs flip (Reykjavík: bus 12k, Landsbyggð: car 20k)
- Utilities cheaper in rural areas (20k vs 25k)

### Conservative FI Planning
- Recommends 30x multiplier (3.33% withdrawal) vs US standard 25x (4%)
- Accounts for Iceland's historically higher inflation (3-4% vs US 2-3%)
- Provides both options but clearly marks 30x as recommended

### Comprehensive Frugality Guidance
- 30+ actionable tips covering all major expense categories
- Each tip includes:
  - Difficulty level (easy/moderate/hard)
  - Realistic savings range
  - Iceland-specific resources (store names, services)
  - Actionable descriptions in Icelandic
- Tips reference actual Icelandic businesses:
  - Bónus, Krónan, Costco (groceries)
  - Sparisjóður, Rauði krossinn (secondhand)
  - Strætó (public transit)
  - Various service providers

### Location Trade-offs
- Balanced pros/cons for both locations
- Acknowledges Reykjavík advantages (jobs, services, culture)
- Highlights rural benefits (cost, peace, nature)
- Realistic about rural challenges (car necessary, limited services)

### Savings Estimation
- `estimateTipSavings()` adapts to user's current expense level
- Uses midpoint of savings range for typical cases
- Adjusts downward for already-low expenses
- Prevents unrealistic savings estimates

## Integration Points

### Used By
- LeanFIRE calculation functions (Epic 1, Task 1.4)
- CalculatorContext state initialization (Epic 2)
- All LeanFIRE UI components (Epics 3-8)
- Geographic comparison panel
- Frugality optimizer
- Expense reduction scenarios

### Dependencies
- `@/types/leanFire` - All TypeScript type definitions

## Testing

### Test File
`apps/peninganaedalifid/src/lib/constants/__tests__/leanFire.test.ts`

### Test Coverage
46 unit tests covering:
- Barebones expense totals (Reykjavík: 240k, Landsbyggð: 200k)
- All expense categories present and positive
- Realistic housing cost ranges
- FI multiplier options (2 options, 30x recommended)
- Reduction percentage options (4 levels)
- Location pros/cons data presence
- Frugality tip database (30+ tips, all categories, valid difficulty levels)
- Iceland-specific resources presence
- Default values and ranges
- All helper function logic
- Edge cases (zero expenses, low expenses)

All tests passing (46/46).

## Design Decisions

### Why 30x Default Multiplier?
Iceland's inflation history is higher than the US, making the 4% rule (25x) more risky. The 30x multiplier (3.33% withdrawal rate) provides more conservative cushion.

### Why Two Locations Only?
LeanFIRE focuses on clear binary choice: urban convenience vs rural savings. Adding more locations would complicate decision-making without significant benefit.

### Why Icelandic-Specific Tips?
Generic frugality tips don't translate to Iceland's unique market:
- Limited discount store options (Bónus/Krónan dominant)
- Car necessary outside Reykjavík
- Universal healthcare changes medical savings strategies
- Unique secondhand ecosystem (Sparisjóður, Rauði krossinn)

### Why Potential Savings Ranges?
Savings vary widely based on current expense level. Ranges acknowledge this reality while providing rough guidance.

## Icelandic Context

All user-facing text in Icelandic:
- "Lágmarks FIRE" (LeanFIRE)
- "Landsbyggð" (rural areas outside capital region)
- "Úttektarhlutfall" (withdrawal rate)
- Full Icelandic pros/cons lists
- All tip titles and descriptions in Icelandic

References actual Icelandic businesses, services, and cultural context.

## Implementation Notes

### Data Sources
- Statistics Iceland cost of living data
- Actual Icelandic LeanFIRE practitioner budgets
- Current market rates for housing, transport, food (2024-2026)
- Icelandic financial independence community insights

### Maintenance
Update cost estimates annually or when major price changes occur (inflation, housing market shifts).

### Extensibility
- Easy to add new locations (custom option available)
- Tip database can be expanded with more categories or tips
- Helper functions support future calculations

## Related Modules
- `leanFire.ts` (calculation functions - Epic 1, Task 1.4)
- `CalculatorContext.tsx` (state management - Epic 2)
- LeanFIRE UI components (Epics 3-8)

## Version
1.0 - Initial implementation (2026-01-29)
