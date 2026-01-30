# Requirements: Current Expense Report

## Overview

**Feature**: Current Expense Report (Rauntímaútgjöld)
**Category**: Expense Tracking (2.2.1)
**Dependencies**:
- Actual Hourly Wage Calculator (for life energy)
- CalculatorContext (for data integration)

## Problem Statement

Users planning for FIRE need to understand their CURRENT spending patterns to make informed decisions about their financial future. Without granular expense tracking:
1. Users can't identify where money is actually going
2. Expense optimization efforts lack data-driven focus
3. Other calculators (Subscription Burn, Commute, Housing) lack accurate input data
4. Gap analysis between planned baseline (Expense Baseline Tool) and actual spending is impossible
5. Life energy calculations are theoretical without real expense data

The Current Expense Report provides detailed tracking of actual monthly expenses with granular line items, life energy calculations, and integration with other calculators.

**Key Distinction from Expense Baseline Tool**:
- **Expense Baseline** = Planning tool with three tiers (Barebones/Comfortable/Deluxe) - "What WOULD I spend?"
- **Current Expense Report** = Tracking tool for actual current spending - "What DO I spend now?"

## User Stories

### US-1: Track Current Expenses in Granular Detail
**As a** user who wants to understand my spending patterns
**I want to** track my actual monthly expenses with detailed line items per category
**So that** I can see exactly where my money is going and identify optimization opportunities

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the Current Expense Report, the system SHALL display a comprehensive expense input interface organized by Icelandic expense categories
- WHEN entering expenses for a category, the system SHALL allow detailed line items (e.g., "Bónus groceries", "Krónan", "Coffee shops")
- WHEN all categories are completed, the system SHALL calculate total monthly and annual expenses
- IF the user has entered their actual hourly wage, the system SHALL display expenses in life energy (work hours)
- WHEN viewing results, the system SHALL show category breakdown with percentages and totals

### US-2: Use Realistic Icelandic Expense Categories with Granular Line Items
**As a** user in Iceland
**I want to** track expenses using Icelandic categories with common vendor-specific line items
**So that** I can quickly input my expenses without creating everything from scratch

**Acceptance Criteria (EARS Format)**:
- WHEN displaying expense categories, the system SHALL use Icelandic labels matching real-world spending patterns
- WHEN showing subcategories, the system SHALL include common Icelandic vendors (Bónus, Krónan, Síminn, Strætó, etc.)
- WHERE the user has specific recurring expenses, the system SHALL allow adding custom line items per category
- IF a category is not relevant, the system SHALL allow hiding it from the interface

### US-3: See Life Energy Cost Per Category
**As a** user who thinks in terms of life energy
**I want to** see how many work hours each expense category costs me
**So that** I can prioritize which expenses to reduce based on time traded

**Acceptance Criteria (EARS Format)**:
- WHEN actual hourly wage is available, the system SHALL display each category's monthly cost in work hours
- WHEN viewing individual line items, the system SHALL show work hours cost per item
- WHEN comparing categories, the system SHALL highlight which categories consume the most life energy
- IF actual hourly wage is not set, the system SHALL prompt the user to calculate it first

### US-4: Compare Current Spending vs. Planned Baseline
**As a** user who has created an expense baseline
**I want to** compare my actual current spending against my planned baseline tiers
**So that** I can see if I'm on track or overspending

**Acceptance Criteria (EARS Format)**:
- WHEN the user has both current expenses and expense baseline set up, the system SHALL display a comparison view
- WHEN viewing comparison, the system SHALL show which tier (Barebones/Comfortable/Deluxe) the current spending most closely matches
- WHERE current expenses exceed planned baseline, the system SHALL highlight overspending categories
- IF current expenses are significantly different, the system SHALL suggest updating the baseline

### US-5: Feed Data to Other Calculators
**As a** user of multiple FIRE calculators on this site
**I want to** have my actual expense data automatically available to other calculators
**So that** I don't have to manually extract and re-enter data everywhere

**Acceptance Criteria (EARS Format)**:
- WHEN other calculators (Subscription Burn Meter, Commute Calculator, Housing Calculator) load, the system SHALL offer to use actual expense data
- WHEN the Subscription Burn Meter opens, it SHALL be pre-populated with subscription data from Current Expense Report
- WHEN the Commute Calculator opens, it SHALL have access to actual commute expenses
- IF the user changes current expenses, the system SHALL update dependent calculators automatically

### US-6: Get Personalized Optimization Recommendations
**As a** user looking to optimize spending
**I want to** receive smart recommendations based on my actual expense patterns
**So that** I can take targeted actions to reduce expenses

**Acceptance Criteria (EARS Format)**:
- WHEN viewing expense results, the system SHALL analyze patterns and provide actionable recommendations
- WHERE subscriptions are high, the system SHALL suggest using the Subscription Burn Meter
- WHERE commute costs are significant, the system SHALL recommend the Commute Calculator
- WHERE housing is a large percentage (>30%), the system SHALL point to the Housing Calculator

## Functional Requirements

### FR-1: Granular Expense Categories
- FR-1.1: Support these default categories with Icelandic labels:
  - **Húsnæði (Housing)**: Leiga/húsnæðislán, fasteignagjöld, húseigendatrygging, viðhald, íbúðafélagsgjöld
  - **Matur (Food)**:
    - Matvöruinnkaup: Bónus, Krónan, Hagkaup, Nettó
    - Veitingastaðir: Regular dining out, delivery/takeout
    - Kaffihús: Coffee shops, snacks
    - Vinnuhádegismatur: Work lunches
  - **Samgöngur (Transport)**:
    - Bíll: Car payment/lease, fuel, insurance, parking, tolls
    - Almenningssamgöngur: Strætó pass, taxi
    - Viðhald: Maintenance, repairs
    - Hjól: Bike maintenance
  - **Veitur (Utilities)**:
    - Rafmagn: Orkuveita Reykjavíkur or other
    - Hiti/vatn: Hitaveita, water
    - Internet: Síminn, Vodafone, Nova
    - Sími: Mobile phone plan
    - Streymi: Netflix, Spotify, etc.
  - **Áskriftir (Subscriptions)**: Netflix, Spotify, gym, newspapers, software, gaming, etc.
  - **Heilsa (Healthcare)**: Lyf, tannlæknir, sjónlæknir, sálfræðingur, supplements
  - **Tryggingar (Insurance)**: Líftrygging, örorkutrygging, ferðatrygging, gæludýratrygging
  - **Persónuleg (Personal)**: Fatnaður, snyrtivörur, hárgreiðsla, persónuleg umhirða
  - **Afþreying (Entertainment)**: Kvikmyndir, tónleikar, íþróttir, félagslíf, áhugamál
  - **Börn (Children)**: IF applicable - leikskóli, skólagjöld, tómstundir, barnafatnaður
  - **Annað (Other)**: Gjafir, góðgerðarframlög, ýmislegt

- FR-1.2: Allow adding custom line items within each category
- FR-1.3: Allow adding completely custom categories
- FR-1.4: Allow hiding/showing default categories based on relevance
- FR-1.5: Support editing and deleting custom line items

### FR-2: Expense Input Interface
- FR-2.1: Provide category-by-category input interface
- FR-2.2: Show common line items per category with amount inputs
- FR-2.3: Allow "Add line item" within each category
- FR-2.4: Display running total per category as items are entered
- FR-2.5: Support monthly or annual entry (with auto-conversion)
- FR-2.6: Provide quick copy from previous month (if historical data exists)

### FR-3: Calculations
- FR-3.1: Calculate total monthly expenses (sum of all line items)
- FR-3.2: Calculate total annual expenses (monthly × 12)
- FR-3.3: Calculate category totals and percentages
- FR-3.4: Calculate life energy per category (hours/month) when AWH available
- FR-3.5: Calculate life energy per line item when displaying details
- FR-3.6: Calculate comparison to expense baseline (if exists)

### FR-4: Dashboard and Visualization
- FR-4.1: Display total monthly/annual expenses prominently
- FR-4.2: Show life energy cost (total hours per month) when AWH available
- FR-4.3: Display category breakdown with percentages
- FR-4.4: Provide pie/donut chart for category distribution
- FR-4.5: Show top expense categories and line items
- FR-4.6: Display comparison to baseline (if available)

### FR-5: Data Integration API
- FR-5.1: Expose `getCurrentExpenses()` returning all expense data
- FR-5.2: Expose `getExpensesByCategory(category)` returning specific category data
- FR-5.3: Expose `getSubscriptions()` returning all subscription line items for Subscription Burn Meter
- FR-5.4: Expose `getCommuteExpenses()` returning transport/commute costs
- FR-5.5: Expose `getHousingExpenses()` returning all housing-related costs
- FR-5.6: Emit events when expense data changes for real-time updates

### FR-6: Smart Recommendations
- FR-6.1: Analyze expense patterns and suggest relevant calculators
- FR-6.2: Identify high-cost subscriptions and recommend Subscription Burn Meter
- FR-6.3: Identify high commute costs and recommend Commute Calculator
- FR-6.4: Identify high housing costs (>30% of total) and recommend Housing Calculator
- FR-6.5: Compare to baseline and suggest adjustments if significant deviation

### FR-7: Data Persistence
- FR-7.1: Save current expense report to localStorage
- FR-7.2: Load saved expenses on page load
- FR-7.3: Support export as JSON for backup
- FR-7.4: Support import from JSON file
- FR-7.5: Track last updated date
- FR-7.6: Optional: Support multiple months of historical data

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 100ms
- Page shall load in < 2 seconds
- LocalStorage operations shall be debounced (500ms)
- Dashboard charts shall render in < 300ms

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (e.g., 45.000 kr)
- Life energy displayed with "klst" suffix
- Clear visual distinction between categories using icons
- Mobile-responsive design with touch-friendly inputs
- Accessible form inputs with proper labels
- Inline editing for quick updates

### NFR-3: Accessibility
- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG 2.1 AA contrast requirements
- Keyboard navigation shall work throughout
- Screen reader compatible
- Form validation messages accessible

### NFR-4: Privacy
- All data stored client-side only
- No data sent to servers
- Export/import for user data portability
- Clear privacy notice

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Common Icelandic vendors pre-populated
- Realistic expense categories for Iceland

## Constraints

- Must integrate with existing CalculatorContext
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Must provide clean API for other calculators to consume data
- Must distinguish clearly from Expense Baseline Tool

## Out of Scope

- Automatic bank transaction import
- Multi-month historical tracking (v1.0)
- Budget enforcement/alerts
- Bill reminders
- Receipt scanning/OCR
- Shared household expense splitting
- Currency conversion for foreign expenses

## Success Criteria

1. User can enter detailed monthly expenses in < 15 minutes
2. Expense data is accessible from other calculators via integration API
3. Life energy display helps users understand true cost of expenses
4. Recommendations successfully guide users to relevant calculators
5. Comparison to baseline (when available) provides actionable insights
6. User can track exact spending in granular detail

## Glossary

| Term | Definition |
|------|------------|
| Current Expense Report | User's actual current monthly spending with detailed line items |
| Line Item | Specific expense entry within a category (e.g., "Bónus groceries: 25,000 kr") |
| Life Energy | Work hours required to earn an amount (amount ÷ actual hourly wage) |
| Expense Baseline | Planned spending at three tiers (from Expense Baseline Tool) |
| Granular Tracking | Detailed expense tracking with specific vendors/items vs. category totals |
| Integration API | Methods exposed for other calculators to access expense data |

## Example Expense Structure

```
Matur (Food): 85,000 kr (34 klst/mán)
├─ Bónus groceries: 30,000 kr
├─ Krónan groceries: 20,000 kr
├─ Veitingastaðir: 25,000 kr
├─ Coffee shops: 8,000 kr
└─ Vinnuhádegismatur: 2,000 kr

Samgöngur (Transport): 45,000 kr (18 klst/mán)
├─ Car payment: 30,000 kr
├─ Fuel: 12,000 kr
├─ Insurance: 2,500 kr
└─ Parking: 500 kr

Áskriftir (Subscriptions): 15,000 kr (6 klst/mán)
├─ Netflix: 2,990 kr
├─ Spotify: 1,190 kr
├─ Gym (World Class): 10,900 kr
└─ Morgunblaðið: 1,500 kr
```

## Integration with Other Calculators

### Subscription Burn Meter
- Pulls all line items from "Áskriftir" category
- Can pull streaming subscriptions from "Veitur > Streymi"
- Shows total subscription burn rate with life energy

### Commute Calculator
- Pulls data from "Samgöngur" category
- Extracts commute-specific costs (fuel, Strætó, parking)
- Compares current commute cost vs. alternatives

### Housing Calculator
- Pulls all "Húsnæði" expenses
- Calculates housing cost as percentage of total income
- Compares rent vs. mortgage scenarios using actual data

## Requirements Traceability

| Requirement ID | User Story | Priority | Complexity |
|----------------|------------|----------|------------|
| FR-1.1 | US-1, US-2 | High | Medium |
| FR-1.2-1.5 | US-1, US-2 | High | Medium |
| FR-2.1-2.6 | US-1 | High | Medium |
| FR-3.1-3.6 | US-1, US-3, US-4 | High | Low |
| FR-4.1-4.6 | US-1, US-3, US-4 | High | Medium |
| FR-5.1-5.6 | US-5 | High | Medium |
| FR-6.1-6.5 | US-6 | Medium | Low |
| FR-7.1-7.6 | US-1 | High | Low |

## Assumptions

1. Users will manually enter expenses (no bank import in v1.0)
2. Users understand the difference between Current Expense Report (actual) and Expense Baseline (planned)
3. Most users will enter monthly data, not annual
4. Life energy calculations are meaningful to FIRE-focused users
5. Users want granular detail to identify optimization opportunities

## Dependencies on Other Features

**Required**:
- Actual Hourly Wage Calculator (for life energy calculations)
- CalculatorContext (for state management)

**Optional Enhancement**:
- Expense Baseline Tool (for comparison features)
- Subscription Burn Meter (to receive subscription data)
- Commute Calculator (to receive commute data)
- Housing Calculator (to receive housing data)

## Future Enhancements (Post-v1.0)

1. Multi-month historical tracking with trends
2. Budget vs. actual comparison per category
3. Export to CSV/Excel
4. Expense templates for common scenarios
5. Recurring expense auto-population
6. Mobile app for on-the-go expense entry
7. Bank transaction import (if privacy model changes)
