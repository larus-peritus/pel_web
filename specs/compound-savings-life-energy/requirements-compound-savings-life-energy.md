# Requirements: Compound Savings Life Energy Calculator

## Document Information

- **Feature Name**: Compound Savings Life Energy Calculator
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec Orchestrator
- **Stakeholders**: FIRE seekers in Iceland, regular savers, financial planners
- **App**: peninganaedalifid (Icelandic FIRE Calculator)
- **Feature ID**: 2.2.3

## Introduction

The Compound Savings Life Energy Calculator helps users visualize how regular savings grow over time, expressed both in Icelandic Kronur (ISK) and in "life energy" hours. By showing the compound growth of savings translated into hours of life, users gain powerful motivation to save regularly and understand the true long-term benefit of consistent saving habits.

### Feature Summary

An interactive calculator that shows future value of monthly savings with compound interest, displaying results in both ISK and life energy hours, with special support for Icelandic verðtryggð (inflation-indexed) savings accounts.

### Business Value

- **Motivates Saving**: Visualizing compound growth in life energy terms provides emotional connection to savings goals
- **Educates Users**: Demonstrates the power of compound interest in relatable terms (hours of life)
- **Supports FIRE Planning**: Helps users understand how regular savings accelerate financial independence
- **Icelandic Context**: Addresses local savings options (verðtryggð accounts) and typical interest rates

### Scope

**In Scope**:
- Monthly savings amount input with ISK currency
- Interest rate configuration (including verðtryggð presets)
- Time horizon selection (1-50 years)
- Future value calculation in ISK
- Life energy equivalent calculation (hours/days/years)
- Compound growth visualization (chart)
- "Interest earned" shown separately in both ISK and life energy
- Comparison of multiple savings scenarios (up to 3)
- Integration with existing calculator's Actual Hourly Wage
- localStorage persistence and export/import support
- Fully Icelandic UI

**Out of Scope**:
- Tax calculations or implications
- Actual investment portfolio management
- Real-time interest rate feeds
- Automatic savings transfers or banking integration
- Retirement age calculations (covered by other features)
- Withdrawal strategies or drawdown planning

## Requirements

### Requirement 1: Savings Scenario Configuration

**User Story:** As a FIRE seeker, I want to configure monthly savings scenarios with different amounts and interest rates, so that I can explore various savings strategies and their long-term impact.

#### Acceptance Criteria

1. WHEN user accesses the Compound Savings calculator THEN system SHALL display an input form with fields for monthly savings amount (ISK), annual interest rate (%), and time horizon (years)

2. WHEN user enters monthly savings amount THEN system SHALL accept values from 1,000 ISK to 1,000,000 ISK

3. WHEN user enters interest rate THEN system SHALL accept values from 0% to 20% with up to 2 decimal places

4. WHEN user enters time horizon THEN system SHALL accept values from 1 to 50 years

5. IF user selects a verðtryggð preset THEN system SHALL auto-populate interest rate with typical Icelandic inflation-indexed rate (3.0%)

6. IF user selects a regular savings account preset THEN system SHALL auto-populate interest rate with typical Icelandic savings rate (1.5%)

7. WHEN user modifies any input value THEN system SHALL recalculate results in real-time (within 100ms)

8. WHILE user is entering numeric values THEN system SHALL format ISK amounts with thousand separators and 0 decimal places

#### Additional Details
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Existing CalculatorContext, CurrencyInput component
- **Assumptions**: Users understand basic savings concepts and interest rates

### Requirement 2: Future Value Calculation

**User Story:** As a regular saver, I want to see how much my monthly savings will grow to in the future, so that I understand the monetary outcome of my savings plan.

#### Acceptance Criteria

1. WHEN user provides valid inputs (monthly amount, rate, time) THEN system SHALL calculate future value using compound interest formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P = monthly payment, r = monthly rate, n = total months

2. WHEN system calculates future value THEN system SHALL separately calculate total contributions (monthly amount × months) and total interest earned (future value - total contributions)

3. WHEN displaying future value THEN system SHALL show amounts in ISK with thousand separators and 0 decimal places

4. IF interest rate is 0% THEN system SHALL calculate future value as simple sum of contributions (no compound interest)

5. WHEN calculation completes THEN system SHALL display three values: total future value (ISK), total contributions (ISK), and total interest earned (ISK)

6. IF any input is invalid or missing THEN system SHALL display validation message in Icelandic without performing calculation

#### Additional Details
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage from main calculator (for life energy conversion)
- **Assumptions**: Standard compound interest calculation applies; monthly compounding frequency

### Requirement 3: Life Energy Conversion

**User Story:** As a life energy conscious person, I want to see my future savings translated into hours of my life, so that I can understand the true personal value of my savings effort.

#### Acceptance Criteria

1. WHEN future value is calculated AND Actual Hourly Wage is available THEN system SHALL convert future value ISK to life energy hours using formula: hours = futureValue / actualHourlyWage

2. WHEN life energy hours are calculated THEN system SHALL display formatted result using existing formatLifeEnergy() function (e.g., "5 ár, 3 mánuðir, 2 vikur")

3. WHEN interest earned is calculated THEN system SHALL separately convert interest-only amount to life energy hours and display as "Lífsorka aflað af vöxtum" (Life energy earned from interest)

4. IF Actual Hourly Wage is not available (no main calculator data) THEN system SHALL display message "Sláðu inn launaupplýsingar í aðalreiknivélina til að sjá lífsorku" (Enter wage info in main calculator to see life energy)

5. WHEN displaying life energy THEN system SHALL show both total life energy (from full future value) and interest-earned life energy separately

6. WHILE Actual Hourly Wage changes in main calculator THEN system SHALL automatically recalculate all life energy values within 100ms

#### Additional Details
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: results.actualHourlyWage from CalculatorContext, formatLifeEnergy utility
- **Assumptions**: User has completed main calculator; actualHourlyWage is positive number

### Requirement 4: Compound Growth Visualization

**User Story:** As a visual learner, I want to see a chart showing how my savings grow over time, so that I can understand the acceleration effect of compound interest.

#### Acceptance Criteria

1. WHEN savings scenario is configured THEN system SHALL generate a line chart with years on x-axis and accumulated value (ISK) on y-axis

2. WHEN generating chart data THEN system SHALL calculate values for each year from year 1 to final time horizon

3. WHEN displaying chart THEN system SHALL show two distinct areas or lines: total contributions (principal) and total value (principal + interest)

4. WHEN chart renders THEN system SHALL use color coding: primary color for total value line, neutral color for contributions-only line

5. IF time horizon exceeds 20 years THEN system SHALL show data points at 2-year intervals to maintain chart readability

6. WHEN user hovers over chart data point THEN system SHALL display tooltip showing year, accumulated ISK value, and accumulated life energy hours

7. WHEN chart displays THEN system SHALL include Icelandic labels for axes ("Ár" for years, "Virði (kr)" for value)

8. IF screen width is below 768px (mobile) THEN system SHALL render responsive chart with adjusted dimensions and simplified labels

#### Additional Details
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Chart library (existing pattern from other calculators)
- **Assumptions**: Users benefit from visual representation; chart enhances understanding

### Requirement 5: Icelandic Savings Context

**User Story:** As an Icelandic saver, I want to see savings options specific to Iceland (like verðtryggð accounts), so that I can make realistic plans based on local banking options.

#### Acceptance Criteria

1. WHEN user accesses interest rate input THEN system SHALL provide preset buttons for common Icelandic savings types

2. WHEN system provides presets THEN system SHALL include at minimum: "Verðtryggt" (3.0%), "Venjulegur sparnaður" (1.5%), and "Hávaxtasparnaður" (2.5%)

3. WHEN user clicks preset button THEN system SHALL populate interest rate field with preset value and mark button as selected

4. WHEN displaying preset buttons THEN system SHALL use Icelandic labels and include brief tooltip explanation (e.g., "Verðtryggt: Vextir + verðbólga")

5. IF user manually enters rate that matches a preset THEN system SHALL highlight corresponding preset button

6. WHEN showing calculation results THEN system SHALL include explanatory text about verðtryggð if that preset is selected

#### Additional Details
- **Priority**: Medium
- **Complexity**: Low
- **Dependencies**: Button and Tooltip UI components
- **Assumptions**: Preset rates reflect realistic 2026 Icelandic banking conditions; rates may need periodic updates

### Requirement 6: Scenario Comparison

**User Story:** As someone evaluating savings strategies, I want to compare up to 3 different savings scenarios side-by-side, so that I can choose the best approach for my situation.

#### Acceptance Criteria

1. WHEN user creates a savings scenario THEN system SHALL provide option to "Save Scenario" with a user-provided name

2. WHEN user saves scenario THEN system SHALL store configuration (monthly amount, rate, time horizon) with unique ID and timestamp

3. IF user attempts to save more than 3 scenarios THEN system SHALL display message "Þú getur aðeins vistað 3 sviðsmyndir. Eyddu einni til að búa til nýja." (You can only save 3 scenarios. Delete one to create new.)

4. WHEN multiple scenarios are saved THEN system SHALL display comparison table showing: scenario name, monthly amount, interest rate, time horizon, future value ISK, future value life energy

5. WHEN comparison table displays THEN system SHALL highlight scenario with highest future value using success color (green)

6. WHEN user clicks scenario in comparison THEN system SHALL load that scenario's parameters into the input form

7. WHEN user deletes scenario THEN system SHALL remove it from comparison and localStorage without confirmation dialog (undo not required)

8. IF only one scenario exists THEN system SHALL hide comparison table and show message to create more scenarios for comparison

#### Additional Details
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: localStorage, scenario management pattern from existing features
- **Assumptions**: 3 scenarios sufficient for most comparison needs; users can delete and recreate as needed

### Requirement 7: Data Persistence and Export

**User Story:** As a privacy-conscious user, I want my savings scenarios saved locally and exportable, so that I can keep my financial data private while maintaining a backup.

#### Acceptance Criteria

1. WHEN user creates or modifies savings scenario THEN system SHALL save to localStorage within 500ms using existing storage pattern

2. WHEN user returns to calculator THEN system SHALL restore all saved scenarios from localStorage on page load

3. WHEN user exports calculator data (existing export button) THEN system SHALL include all savings scenarios in exported JSON file

4. WHEN user imports calculator data (existing import function) THEN system SHALL restore savings scenarios from JSON if present

5. IF localStorage data is corrupted or invalid THEN system SHALL log error to console and initialize with empty scenarios array without blocking UI

6. WHEN saving to localStorage THEN system SHALL include schema version number for future migration compatibility

7. WHILE user has unsaved changes THEN system SHALL auto-save after 500ms debounce period (matching existing pattern)

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Existing localStorage utilities (safeGetItem, safeSetItem), CalculatorContext export/import
- **Assumptions**: Users value privacy; localStorage is available and functional

### Requirement 8: Integration with Main Calculator

**User Story:** As a calculator user, I want the savings calculator to automatically use my Actual Hourly Wage, so that I don't have to enter my wage information multiple times.

#### Acceptance Criteria

1. WHEN Compound Savings calculator loads THEN system SHALL retrieve results.actualHourlyWage from CalculatorContext

2. WHEN actualHourlyWage value changes in main calculator THEN system SHALL automatically recalculate all life energy displays within 100ms

3. IF actualHourlyWage is 0 or undefined THEN system SHALL display ISK values only with informational message to complete main calculator

4. WHEN user has not completed main calculator THEN system SHALL show prominent link/button to navigate to main calculator tab

5. WHEN system uses actualHourlyWage THEN system SHALL display current wage value somewhere on screen (e.g., "Reiknað með launum: 4.850 kr/klst")

6. IF user is in Compound Savings calculator AND main calculator inputs change THEN system SHALL maintain user's savings scenario inputs while updating only life energy calculations

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: CalculatorContext, results.actualHourlyWage, useCalculator hook
- **Assumptions**: Main calculator is primary entry point; users typically complete it before using specialized calculators

### Requirement 9: User Interface and Navigation

**User Story:** As a mobile user, I want a responsive, touch-friendly interface for the savings calculator, so that I can use it comfortably on my phone.

#### Acceptance Criteria

1. WHEN calculator renders THEN system SHALL use responsive layout that adapts to screen widths from 320px to 1920px

2. WHEN on mobile (< 768px) THEN system SHALL stack input fields vertically with full-width buttons

3. WHEN on desktop (≥ 768px) THEN system SHALL use multi-column layout for inputs and side-by-side scenario comparison

4. WHEN user navigates to Compound Savings calculator THEN system SHALL display as a new tab in existing CalculatorTabsNav component

5. WHEN calculator tab is selected THEN system SHALL show active state using existing tab styling pattern

6. WHEN rendering form inputs THEN system SHALL use existing UI components (CurrencyInput, NumberInput, Button, Card) for consistency

7. WHEN displaying results THEN system SHALL use Card components with appropriate elevation and spacing matching app design system

8. IF screen reader is active THEN system SHALL provide ARIA labels in Icelandic for all form controls and dynamic content updates

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Existing UI components, CalculatorTabsNav, responsive grid system
- **Assumptions**: Majority of users access on mobile; accessibility is important for inclusivity

## Non-Functional Requirements

### Performance Requirements

1. WHEN user modifies any input value THEN system SHALL recalculate and update display within 100ms for responsive feel

2. WHEN calculator page loads THEN system SHALL restore from localStorage and render initial view within 500ms

3. WHEN generating chart with 50 data points THEN system SHALL render complete visualization within 300ms

4. WHEN Actual Hourly Wage changes in main calculator THEN system SHALL propagate updates to Compound Savings calculator within 100ms

### Security Requirements

1. WHEN storing scenarios in localStorage THEN system SHALL NOT include personally identifiable information beyond user-chosen scenario names

2. WHEN exporting data THEN system SHALL create JSON file that contains only calculator data without authentication tokens or session info

3. IF user clears browser data THEN system SHALL handle missing localStorage gracefully without errors or data corruption

### Usability Requirements

1. WHEN user encounters error (invalid input) THEN system SHALL display clear Icelandic error message adjacent to relevant input field

2. WHEN displaying large numbers THEN system SHALL use Icelandic number formatting (thousand separators, appropriate decimal places)

3. WHEN showing tooltips or help text THEN system SHALL use plain Icelandic language avoiding financial jargon where possible

4. WHEN user performs action (save, delete) THEN system SHALL provide visual feedback (button state change, success message) within 50ms

5. IF calculation cannot be performed THEN system SHALL explain why in user-friendly Icelandic (e.g., missing main calculator data)

### Reliability Requirements

1. WHEN localStorage quota is exceeded THEN system SHALL display warning message and allow user to delete old scenarios

2. WHEN calculation involves extreme values (very high amounts or long time horizons) THEN system SHALL handle potential overflow gracefully and display reasonable maximum values

3. IF component throws error during render THEN system SHALL use error boundary to show fallback UI without crashing entire app

### Accessibility Requirements

1. WHEN form inputs are focused THEN system SHALL display visible focus indicators meeting WCAG 2.1 AA contrast requirements

2. WHEN dynamic content updates (calculation results) THEN system SHALL announce changes to screen readers using ARIA live regions

3. WHEN providing color-coded information (chart, highlights) THEN system SHALL also use text labels or patterns for color-blind users

## Constraints and Assumptions

### Technical Constraints

- Must use React Context (CalculatorContext) for state management, consistent with existing app architecture
- Must use localStorage for persistence (no backend database)
- Must work in modern browsers (Chrome, Firefox, Safari, Edge) from last 2 years
- Must use existing UI component library (no new design system)
- Must integrate with existing Next.js App Router structure
- Chart rendering must use existing chart library pattern from other calculators

### Business Constraints

- All UI text must be in Icelandic language
- Interest rate presets must reflect realistic Icelandic banking conditions
- Feature must be completed as standalone calculator (no backend API development)
- Must not collect or transmit user financial data (privacy-first approach)
- Development time estimated at 12-16 hours total implementation

### Assumptions

- Users have basic understanding of compound interest concept
- Actual Hourly Wage from main calculator is reasonably accurate (user-provided)
- Typical Icelandic savings interest rates remain stable (2024-2026 range)
- Users primarily access calculator on mobile devices
- localStorage is available and enabled in user browsers
- Users save scenarios for comparison purposes, not long-term storage (accepting risk of browser data loss)
- Monthly compounding frequency is acceptable approximation for all account types

## Success Criteria

### Definition of Done

- [ ] All acceptance criteria for Requirements 1-9 are met
- [ ] Non-functional requirements (performance, security, usability, reliability, accessibility) are satisfied
- [ ] Integration with CalculatorContext and Actual Hourly Wage is functional
- [ ] localStorage persistence and export/import work correctly
- [ ] All UI text is in Icelandic with correct grammar
- [ ] Responsive design tested on mobile (320px-768px) and desktop (769px-1920px)
- [ ] Unit tests cover calculation functions (compound interest, life energy conversion)
- [ ] Integration tests verify CalculatorContext integration and localStorage persistence
- [ ] Manual testing confirms chart renders correctly with various time horizons
- [ ] Accessibility audit passes (keyboard navigation, screen reader, color contrast)

### Acceptance Metrics

- Calculation accuracy: Future value matches financial calculator results within 1 ISK
- Performance: All calculations complete within 100ms on mid-range device
- Usability: Users can create and compare 3 scenarios within 2 minutes
- Accessibility: WCAG 2.1 AA compliance verified with automated and manual testing
- Mobile responsiveness: All features usable on 320px width screen
- Data persistence: 100% of scenarios successfully saved and restored from localStorage

### User Validation

- Users can explain what verðtryggð means after using preset
- Users understand "life energy earned from interest" concept
- Users report chart visualization helps understand compound growth
- Users successfully export and re-import their scenarios

## Glossary

| Term | Definition |
|------|------------|
| **Lífsorka (Life Energy)** | Hours of life required to earn money, calculated as amount ÷ actual hourly wage |
| **Actual Hourly Wage** | True hourly earning power after accounting for time and money expenses related to work |
| **Verðtryggt / Verðtryggð** | Inflation-indexed; Icelandic savings accounts where interest rate adjusts with inflation |
| **Framtíðarvirði (Future Value)** | Total value of savings after compound interest over time period |
| **Vaxtavextir (Compound Interest)** | Interest calculated on both principal and accumulated interest from previous periods |
| **Höfuðstóll (Principal)** | Original amount saved; total contributions without interest |
| **Vextir (Interest)** | Earnings from savings; difference between future value and principal |
| **Sviðsmynd (Scenario)** | Saved configuration of savings parameters for comparison purposes |

---

## Requirements Review Checklist

### Completeness
- [x] All user stories have clear roles, features, and benefits
- [x] All acceptance criteria use EARS format (WHEN/IF/WHILE/WHERE...SHALL)
- [x] Non-functional requirements cover performance, security, usability, reliability, accessibility
- [x] Constraints and assumptions are documented
- [x] Success criteria are measurable
- [x] Glossary defines all domain-specific terms

### Quality
- [x] Requirements are testable and verifiable
- [x] Requirements are unambiguous and specific
- [x] Acceptance criteria avoid implementation details
- [x] User stories focus on user value, not technical solution
- [x] Non-functional requirements have quantifiable metrics

### EARS Compliance
- [x] WHEN clauses describe triggering events
- [x] IF clauses describe preconditions
- [x] WHILE clauses describe continuous behaviors
- [x] WHERE clauses describe contextual conditions
- [x] SHALL indicates mandatory system behavior consistently

### Integration
- [x] Dependencies on existing systems identified (CalculatorContext, localStorage, UI components)
- [x] Integration points clearly specified (Actual Hourly Wage, export/import)
- [x] Data flow between components documented
- [x] Context-specific requirements included (Icelandic language, banking practices)

### Traceability
- [x] Each requirement has unique identifier (Requirement 1-9)
- [x] Priority and complexity assessed for each requirement
- [x] Dependencies between requirements noted
- [x] Requirements traced to success criteria

---

**Next Phase**: [Design Phase](design-compound-savings-life-energy.md) - Create technical architecture based on these requirements
