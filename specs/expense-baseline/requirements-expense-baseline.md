# Requirements: Expense Baseline Tool

## Overview

**Feature**: Expense Baseline Tool (Útgjaldagrunnur)
**Category**: Expense Calculator (2.1.11)
**Dependencies**: None (foundation tool for other calculators)

## Problem Statement

Users planning for FIRE need to clearly define their spending levels, but most don't have a structured way to categorize and tier their expenses. Without a clear expense baseline:
1. FI Number calculations are guesswork
2. Coast FIRE and other planning tools lack accurate inputs
3. Users can't easily compare "barebones survival" vs "comfortable" vs "ideal" lifestyles
4. Life energy calculations for expenses lack context

The Expense Baseline Tool provides a guided builder for creating three spending tiers (Barebones/Comfortable/Deluxe) that other calculators can reference.

## User Stories

### US-1: Define Three Spending Tiers
**As a** user planning for financial independence
**I want to** define my expenses at three different levels (barebones, comfortable, deluxe)
**So that** I can understand the range of FI numbers I'm working toward

**Acceptance Criteria (EARS Format)**:
- WHEN the user opens the Expense Baseline Tool, the system SHALL display a guided builder with three spending tiers
- WHEN entering expenses for a category, the system SHALL allow different amounts for barebones, comfortable, and deluxe tiers
- WHEN all categories are completed, the system SHALL calculate and display total monthly/annual expenses for each tier
- IF the user has entered their actual hourly wage, the system SHALL display expenses in life energy hours per tier

### US-2: Use Icelandic Expense Categories
**As a** user in Iceland
**I want to** see expense categories with realistic Icelandic defaults
**So that** I can quickly build a baseline without researching typical costs

**Acceptance Criteria (EARS Format)**:
- WHEN displaying expense categories, the system SHALL use Icelandic labels and descriptions
- WHEN showing default values, the system SHALL use realistic ISK amounts based on Icelandic cost of living
- WHERE the user hasn't entered custom values, the system SHALL show suggested ranges for each tier based on Icelandic averages

### US-3: Export Baseline for Other Calculators
**As a** user of multiple FIRE calculators on this site
**I want to** have my expense baseline automatically available to other calculators
**So that** I don't have to re-enter my expenses everywhere

**Acceptance Criteria (EARS Format)**:
- WHEN the user saves their expense baseline, the system SHALL store it in localStorage
- WHEN other calculators (FI Number, Savings Rate, Coast FIRE) load, the system SHALL offer to use the saved expense baseline
- WHEN viewing results in other calculators, the system SHALL show which expense tier is being used
- IF the user changes their baseline, the system SHALL prompt to update dependent calculators

### US-4: View Life Energy Breakdown
**As a** user who thinks in terms of life energy
**I want to** see how many work hours each expense category costs
**So that** I can prioritize which expenses to cut or keep

**Acceptance Criteria (EARS Format)**:
- WHEN the actual hourly wage is available, the system SHALL display each category's cost in work hours
- WHEN displaying life energy, the system SHALL show monthly and annual work hours per category
- WHEN comparing tiers, the system SHALL highlight the life energy difference between tiers
- IF actual hourly wage is not set, the system SHALL prompt the user to calculate it first

### US-5: Customize Categories
**As a** user with unique expense patterns
**I want to** add, remove, or modify expense categories
**So that** my baseline reflects my actual spending structure

**Acceptance Criteria (EARS Format)**:
- WHEN viewing categories, the system SHALL allow adding custom categories
- WHEN viewing default categories, the system SHALL allow hiding irrelevant ones
- WHEN modifying categories, the system SHALL preserve customizations across sessions
- IF a custom category is added, the system SHALL prompt for amounts in all three tiers

## Functional Requirements

### FR-1: Expense Categories
- FR-1.1: Support these default categories with Icelandic labels:
  - Húsnæði (Housing): rent/mortgage, property tax, insurance, maintenance
  - Matur (Food): groceries, dining out, coffee/snacks
  - Samgöngur (Transport): car payment, fuel, insurance, public transit
  - Heilsa (Healthcare): insurance, medications, dental, vision
  - Tryggingar (Insurance): life, disability, other
  - Veitur (Utilities): electricity, water, heating, internet, phone
  - Persónuleg (Personal): clothing, grooming, personal care
  - Afþreying (Entertainment): subscriptions, hobbies, travel, social
  - Sparnaður (Savings): emergency fund contribution, retirement, investments
  - Annað (Other): miscellaneous, unexpected
- FR-1.2: Allow custom categories with user-defined names
- FR-1.3: Allow hiding/showing default categories
- FR-1.4: Support subcategories for detailed tracking

### FR-2: Three-Tier System
- FR-2.1: Define **Barebones** (Lágmarks): Minimum needed to survive
- FR-2.2: Define **Comfortable** (Þægilegt): Reasonable quality of life
- FR-2.3: Define **Deluxe** (Lúxus): Ideal lifestyle without worrying
- FR-2.4: Provide Icelandic default ranges for each tier:
  - Barebones: 250,000-350,000 kr/month total
  - Comfortable: 400,000-600,000 kr/month total
  - Deluxe: 700,000-1,000,000+ kr/month total
- FR-2.5: Allow users to override any default value

### FR-3: Calculations
- FR-3.1: Calculate total monthly expenses per tier
- FR-3.2: Calculate total annual expenses per tier
- FR-3.3: Calculate percentage breakdown by category
- FR-3.4: Calculate life energy (work hours) per category when wage available
- FR-3.5: Calculate difference between tiers in ISK and work hours

### FR-4: Data Persistence
- FR-4.1: Save expense baseline to localStorage
- FR-4.2: Load saved baseline on page load
- FR-4.3: Export baseline as JSON for backup
- FR-4.4: Import baseline from JSON file
- FR-4.5: Provide API for other calculators to access baseline

### FR-5: Guided Builder Flow
- FR-5.1: Step-by-step wizard for first-time users
- FR-5.2: Progress indicator showing completion status
- FR-5.3: Category-by-category input with help text
- FR-5.4: Summary review before saving
- FR-5.5: Quick edit mode for returning users

### FR-6: Integration with Other Calculators
- FR-6.1: Expose `getExpenseBaseline()` function for other calculators
- FR-6.2: Emit events when baseline changes
- FR-6.3: Provide tier selector component for other calculators to embed
- FR-6.4: Support "Use my baseline" button in FI Number, Savings Rate, etc.

## Non-Functional Requirements

### NFR-1: Performance
- Calculations shall complete in < 100ms
- Page shall load in < 2 seconds
- LocalStorage operations shall be debounced (500ms)

### NFR-2: Usability
- All monetary values formatted with Icelandic number formatting (e.g., 500.000 kr)
- Life energy displayed with "klst" suffix
- Clear visual distinction between three tiers (color coding)
- Mobile-responsive design
- Accessible form inputs with proper labels

### NFR-3: Accessibility
- All inputs shall have proper labels and aria attributes
- Color choices shall meet WCAG contrast requirements
- Keyboard navigation shall work throughout
- Screen reader compatible

### NFR-4: Privacy
- All data stored client-side only
- No data sent to servers
- Export/import for user data portability

### NFR-5: Icelandic Context
- All UI text in Icelandic
- Currency in ISK
- Default values based on Icelandic cost of living
- Support for Icelandic-specific expense categories

## Constraints

- Must integrate with existing calculator context (CalculatorProvider)
- Must use existing UI component library
- Must follow existing code patterns and architecture
- Must work without user account (privacy-first)
- Must be the first calculator shown in Expense tab (foundation tool)

## Out of Scope

- Automatic bank import
- Historical expense tracking over time
- Budget enforcement/alerts
- Bill reminders
- Receipt scanning

## Success Criteria

1. User can define expenses at three tiers in < 10 minutes
2. Expense baseline is accessible from other calculators
3. Life energy display helps users understand true cost
4. Icelandic defaults make setup faster for local users
5. Foundation for FI Number and other FIRE planning tools

## Glossary

| Term | Definition |
|------|------------|
| Expense Baseline | User's defined spending levels across categories |
| Barebones (Lágmarks) | Minimum expenses needed to survive |
| Comfortable (Þægilegt) | Reasonable quality of life expenses |
| Deluxe (Lúxus) | Ideal lifestyle expenses |
| Life Energy | Work hours required to earn an amount (amount ÷ actual hourly wage) |
| FI Number | Target nest egg for financial independence |
| Tier | One of the three spending levels (Barebones/Comfortable/Deluxe) |

## Default Icelandic Expense Ranges (Monthly)

| Category | Barebones | Comfortable | Deluxe |
|----------|-----------|-------------|--------|
| Húsnæði | 120,000 kr | 200,000 kr | 350,000 kr |
| Matur | 40,000 kr | 70,000 kr | 120,000 kr |
| Samgöngur | 15,000 kr | 40,000 kr | 80,000 kr |
| Heilsa | 5,000 kr | 15,000 kr | 30,000 kr |
| Tryggingar | 5,000 kr | 15,000 kr | 25,000 kr |
| Veitur | 20,000 kr | 35,000 kr | 50,000 kr |
| Persónuleg | 10,000 kr | 25,000 kr | 50,000 kr |
| Afþreying | 10,000 kr | 40,000 kr | 100,000 kr |
| Sparnaður | 20,000 kr | 60,000 kr | 150,000 kr |
| Annað | 5,000 kr | 20,000 kr | 45,000 kr |
| **Samtals** | **250,000 kr** | **520,000 kr** | **1,000,000 kr** |
