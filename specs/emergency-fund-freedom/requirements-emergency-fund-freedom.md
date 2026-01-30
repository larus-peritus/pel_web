# Requirements: Emergency Fund Freedom Meter

## Document Information

- **Feature Name**: Emergency Fund Freedom Meter (Neyðarsjóður Frelsissmælir)
- **Version**: 1.0
- **Date**: 2026-01-22
- **Author**: Spec-Driven Development Orchestrator
- **Stakeholders**: FIRE-focused users, financial planners, general savers in Iceland

## Introduction

The Emergency Fund Freedom Meter transforms the abstract concept of an emergency fund into concrete, meaningful metrics that users can understand and feel motivated by. Instead of simply showing a balance in ISK, it expresses financial security in terms of "months of freedom" (runway), life energy hours of protection, and actionable risk assessments.

### Feature Summary

A calculator that takes current emergency fund balance and monthly essential expenses to output meaningful security metrics: months of runway, life energy hours protected, risk rating, and progress toward recommended targets (3/6/12 months).

### Business Value

**User Benefits:**
- Transforms abstract ISK amounts into tangible security metrics
- Creates emotional connection to emergency savings through "freedom" and "life energy" framing
- Provides clear, actionable targets based on financial independence principles
- Reduces financial anxiety through concrete milestone tracking
- Motivates continued emergency fund building

**Product Benefits:**
- Differentiates from generic calculators through life energy concept
- Reinforces core "Your Money or Your Life" philosophy
- Drives engagement through progress tracking
- Complements other calculators (uses Actual Hourly Wage data)
- Supports Icelandic context with local cost-of-living considerations

### Scope

**In Scope:**
- Emergency fund balance input
- Monthly essential expenses input
- "Months of freedom" calculation (runway)
- Life energy hours of security calculation
- Risk rating system (Underfunded / Minimal / Moderate / Strong / Excellent)
- Target recommendations (3/6/12 months)
- Progress visualization toward targets
- Integration with Actual Hourly Wage calculator
- Icelandic language UI
- LocalStorage persistence
- Export/import capability
- Mobile-responsive design

**Out of Scope:**
- Automatic expense tracking from bank accounts
- Investment return projections on emergency funds
- Detailed expense categorization
- Comparison with other users (benchmarking)
- Automated alerts/notifications
- Multi-currency support (ISK only)

## Requirements

### Requirement 1: Emergency Fund Input Collection

**User Story:** As a user, I want to input my current emergency fund balance and monthly essential expenses, so that I can see how much financial security I have in meaningful terms.

#### Acceptance Criteria

1. WHEN user navigates to Emergency Fund Freedom Meter THEN system SHALL display input form for emergency fund balance in ISK
2. WHEN user navigates to Emergency Fund Freedom Meter THEN system SHALL display input form for monthly essential expenses in ISK
3. IF user enters non-numeric value in balance field THEN system SHALL display validation error "Vinsamlegast sláðu inn gilt númer"
4. IF user enters negative value in balance field THEN system SHALL display validation error "Upphæð getur ekki verið neikvæð"
5. IF user enters zero or negative value in monthly expenses field THEN system SHALL display validation error "Mánaðarlegur kostnaður verður að vera hærri en 0"
6. WHEN user enters valid values THEN system SHALL calculate and display all metrics within 100ms
7. IF user has previously saved Actual Hourly Wage data THEN system SHALL auto-populate or suggest expense estimates based on that data
8. WHEN user inputs change THEN system SHALL update all calculations in real-time

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Actual Hourly Wage calculator (for life energy calculation), localStorage system
- **Assumptions**: Users understand "essential expenses" vs total spending

---

### Requirement 2: Months of Freedom Calculation

**User Story:** As a user, I want to see how many months my emergency fund would cover, so that I can understand my financial runway in concrete time terms.

#### Acceptance Criteria

1. WHEN user enters valid emergency fund balance and monthly expenses THEN system SHALL calculate months of freedom as (balance / monthly expenses)
2. WHEN displaying months of freedom THEN system SHALL round to one decimal place
3. WHEN months value is less than 1 THEN system SHALL also display in weeks format "X vikur"
4. WHEN months value is calculated THEN system SHALL display result prominently with label "Frelsissmánuðir" (Freedom Months)
5. IF calculation results in less than 3 months THEN system SHALL display result in warning color (red/orange)
6. IF calculation results in 3-6 months THEN system SHALL display result in caution color (yellow/amber)
7. IF calculation results in 6+ months THEN system SHALL display result in success color (green)
8. WHEN displaying months THEN system SHALL include plain language interpretation "Þú getur lifað af í X mánuði með núverandi neyðarsjóði"

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Input validation (Req 1)
- **Assumptions**: Monthly expenses remain constant (acknowledged in UI)

---

### Requirement 3: Life Energy Hours Calculation

**User Story:** As a user, I want to see my emergency fund expressed in life energy hours protected, so that I can connect my savings to the actual time I've invested from my life.

#### Acceptance Criteria

1. WHEN user has valid emergency fund balance AND saved Actual Hourly Wage THEN system SHALL calculate life energy hours as (balance / actual hourly wage)
2. WHEN displaying life energy hours THEN system SHALL format large numbers with thousand separators "1.234 klukkustundir"
3. IF life energy hours exceed 1000 THEN system SHALL also display in work-weeks format "X vinnuvikur"
4. IF life energy hours exceed 8760 (1 year) THEN system SHALL also display in years format "X ár af öryggi"
5. WHEN displaying life energy hours THEN system SHALL include explanatory text "Þetta eru X klukkustundir af lífsorkuskjólinu þínu"
6. IF user has not completed Actual Hourly Wage calculator THEN system SHALL display prompt "Reiknaðu raunverulegt tímakaup þitt til að sjá lífsorkumælingu"
7. WHEN life energy data displayed THEN system SHALL include visual icon representing hours/time protection

#### Additional Details
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage calculator completed, shared data store
- **Assumptions**: User's actual hourly wage is up-to-date and accurate

---

### Requirement 4: Risk Rating Assessment

**User Story:** As a user, I want to receive a clear risk rating for my emergency fund level, so that I can understand whether my current savings are adequate.

#### Acceptance Criteria

1. WHEN months of freedom < 1 THEN system SHALL assign risk rating "Vanfjármögnuð" (Underfunded) with red indicator
2. WHEN months of freedom >= 1 AND < 3 THEN system SHALL assign risk rating "Lágmarks" (Minimal) with orange indicator
3. WHEN months of freedom >= 3 AND < 6 THEN system SHALL assign risk rating "Hóflegt" (Moderate) with amber indicator
4. WHEN months of freedom >= 6 AND < 12 THEN system SHALL assign risk rating "Sterkur" (Strong) with light green indicator
5. WHEN months of freedom >= 12 THEN system SHALL assign risk rating "Framúrskarandi" (Excellent) with dark green indicator
6. WHEN risk rating displayed THEN system SHALL include brief explanation of what rating means
7. WHEN risk rating is "Vanfjármögnuð" or "Lágmarks" THEN system SHALL include actionable recommendation
8. WHEN displaying risk rating THEN system SHALL use both color coding and text labels for accessibility

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Months of freedom calculation (Req 2)
- **Assumptions**: Standard FIRE community targets (3/6/12 months) apply to Icelandic context

---

### Requirement 5: Target Recommendations and Progress Tracking

**User Story:** As a user, I want to see recommended emergency fund targets and my progress toward them, so that I have clear goals to work toward.

#### Acceptance Criteria

1. WHEN emergency fund calculated THEN system SHALL display three target milestones: 3 months, 6 months, 12 months
2. WHEN displaying each target THEN system SHALL show target amount in ISK based on user's monthly expenses
3. WHEN displaying each target THEN system SHALL show progress percentage toward that target
4. WHEN user has reached target THEN system SHALL display checkmark or completion indicator
5. WHEN user has not reached target THEN system SHALL display amount needed to reach target "Þú vantar X kr til að ná markmiði"
6. WHEN displaying targets THEN system SHALL show visual progress bar for each milestone
7. WHEN user has exceeded all targets THEN system SHALL display congratulatory message
8. IF user's monthly expenses change THEN system SHALL update all target amounts in real-time
9. WHEN displaying targets THEN system SHALL include brief explanation of each milestone's purpose

#### Additional Details
- **Priority**: High
- **Complexity**: Medium
- **Dependencies**: Monthly expenses input (Req 1), months of freedom calculation (Req 2)
- **Assumptions**: 3/6/12 month framework is understood by FIRE-aware audience

---

### Requirement 6: Icelandic Context and Cost-of-Living Considerations

**User Story:** As an Icelandic user, I want the calculator to reflect local cost-of-living realities, so that recommendations are relevant to my situation.

#### Acceptance Criteria

1. WHEN user first accesses calculator THEN system SHALL provide example ranges for monthly essential expenses in Iceland
2. WHEN providing expense examples THEN system SHALL include categories: "Lágmark (basic needs only)", "Meðaltal (comfortable)", "Rúmlegt (generous)"
3. IF user selects expense example THEN system SHALL auto-populate monthly expenses field with suggested amount
4. WHEN displaying any text THEN system SHALL use Icelandic language throughout
5. WHEN displaying currency THEN system SHALL use ISK format with "kr" suffix
6. WHEN providing educational content THEN system SHALL reference Icelandic economic conditions where relevant
7. IF inflation or economic context is relevant THEN system SHALL include disclaimer about purchasing power changes

#### Additional Details
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: None (content/localization)
- **Assumptions**: Expense examples updated periodically to reflect real costs

---

### Requirement 7: Data Persistence and Privacy

**User Story:** As a privacy-conscious user, I want my emergency fund data saved locally and exportable, so that I maintain full control over my financial information.

#### Acceptance Criteria

1. WHEN user enters emergency fund data THEN system SHALL save to localStorage within 500ms
2. WHEN user returns to calculator THEN system SHALL load previously entered data from localStorage
3. WHEN user exports data THEN system SHALL include emergency fund data in JSON export file
4. WHEN user imports data file THEN system SHALL restore emergency fund balance and monthly expenses
5. IF localStorage is unavailable THEN system SHALL display warning message about data persistence
6. WHEN data is saved THEN system SHALL not transmit any data to external servers
7. WHEN user clears browser data THEN system SHALL lose saved calculator data (expected behavior)
8. IF import file contains invalid data THEN system SHALL display error and not overwrite existing data

#### Additional Details
- **Priority**: High
- **Complexity**: Low
- **Dependencies**: Existing localStorage infrastructure, export/import system
- **Assumptions**: Users understand browser storage limitations

---

### Requirement 8: Visual Design and User Experience

**User Story:** As a user, I want an intuitive, visually appealing interface, so that I can quickly understand my emergency fund status and feel motivated to improve it.

#### Acceptance Criteria

1. WHEN calculator loads THEN system SHALL display all input fields and results in logical visual hierarchy
2. WHEN displaying results THEN system SHALL use visual elements (progress bars, icons, color coding) to enhance understanding
3. WHEN user views on mobile device THEN system SHALL display responsive layout optimized for small screens
4. WHEN risk rating changes THEN system SHALL animate transition smoothly
5. WHEN targets are reached THEN system SHALL provide subtle celebratory visual feedback
6. WHEN displaying months of freedom THEN system SHALL use large, prominent typography
7. IF user has insufficient data THEN system SHALL display helpful prompts with clear calls-to-action
8. WHEN user hovers over information icons THEN system SHALL display tooltips with additional context
9. WHEN page loads THEN system SHALL render all elements within 2 seconds on standard connection

#### Additional Details
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Core UI component library, design system
- **Assumptions**: Follows established app design patterns for consistency

---

### Requirement 9: Educational Content and Guidance

**User Story:** As a user new to emergency fund concepts, I want clear explanations and guidance, so that I can understand why this metric matters and how to improve it.

#### Acceptance Criteria

1. WHEN user first visits calculator THEN system SHALL display brief introduction to emergency fund purpose
2. WHEN displaying risk ratings THEN system SHALL include explanation of what each level means
3. WHEN user has low emergency fund THEN system SHALL provide actionable tips for building savings
4. WHEN displaying targets THEN system SHALL explain why 3/6/12 months are recommended milestones
5. WHEN user views life energy hours THEN system SHALL include tooltip explaining the concept
6. IF user has questions THEN system SHALL provide link to detailed FAQ or guide
7. WHEN providing recommendations THEN system SHALL frame in positive, motivating language
8. WHEN displaying calculations THEN system SHALL include "How is this calculated?" expandable section

#### Additional Details
- **Priority**: Medium
- **Complexity**: Low
- **Dependencies**: Content creation
- **Assumptions**: Educational approach aligns with "Your Money or Your Life" philosophy

---

### Requirement 10: Integration with Other Calculators

**User Story:** As a user who has completed other calculators, I want the Emergency Fund Freedom Meter to use my existing data, so that I don't need to re-enter information.

#### Acceptance Criteria

1. WHEN user has completed Actual Hourly Wage calculator THEN system SHALL automatically use that wage for life energy calculation
2. IF user has saved work-related expense data THEN system SHALL optionally suggest expense estimates
3. WHEN Actual Hourly Wage data updates THEN system SHALL automatically recalculate life energy hours
4. IF Actual Hourly Wage data is missing THEN system SHALL provide link to complete that calculator
5. WHEN displaying integrated data THEN system SHALL indicate source "Notað úr raunverulegu tímakaupi"
6. IF user updates monthly expenses in this calculator THEN system SHALL save for potential use in other calculators
7. WHEN exporting data THEN system SHALL maintain references to shared data sources

#### Additional Details
- **Priority**: Medium
- **Complexity**: Medium
- **Dependencies**: Actual Hourly Wage calculator, shared data context, localStorage architecture
- **Assumptions**: Shared data model supports cross-calculator references

---

## Non-Functional Requirements

### Performance Requirements
- WHEN user enters input THEN system SHALL calculate all metrics within 100ms
- WHEN page loads THEN system SHALL render initial view within 2 seconds on 3G connection
- WHEN user interacts with UI THEN system SHALL respond with visual feedback within 50ms
- IF calculations become complex THEN system SHALL use web workers to prevent UI blocking

### Security Requirements
- WHEN storing data THEN system SHALL use browser localStorage only (no server transmission)
- WHEN exporting data THEN system SHALL create JSON file client-side without server upload
- IF browser requests permissions THEN system SHALL only request necessary permissions
- WHEN handling user data THEN system SHALL not include any tracking or analytics that compromise privacy

### Usability Requirements
- WHEN user encounters error THEN system SHALL display message in clear Icelandic with actionable guidance
- WHEN displaying numbers THEN system SHALL use Icelandic number formatting (decimal comma, space separator)
- IF user is visually impaired THEN system SHALL support screen readers with proper ARIA labels
- WHEN user navigates with keyboard THEN system SHALL support full keyboard navigation with visible focus indicators
- IF color-blind user views THEN system SHALL use patterns/icons in addition to color for risk ratings

### Reliability Requirements
- WHEN localStorage fails THEN system SHALL degrade gracefully and inform user without crashing
- IF calculation error occurs THEN system SHALL log error and display user-friendly message
- WHEN browser is closed THEN system SHALL preserve entered data for next session
- IF import file is corrupted THEN system SHALL validate and reject without data loss

### Accessibility Requirements
- WHEN page loads THEN system SHALL meet WCAG 2.1 Level AA standards
- WHEN using screen reader THEN system SHALL announce all dynamic content changes
- WHEN user increases text size THEN system SHALL scale proportionally without breaking layout
- IF high contrast mode enabled THEN system SHALL maintain readability and functionality

### Localization Requirements
- WHEN displaying text THEN system SHALL use Icelandic throughout (field labels, messages, explanations)
- WHEN formatting currency THEN system SHALL use ISK with "kr" suffix and Icelandic number format
- WHEN displaying dates THEN system SHALL use Icelandic date format (DD.MM.YYYY)
- IF error messages displayed THEN system SHALL use natural Icelandic phrasing

## Constraints and Assumptions

### Technical Constraints
- Must run entirely client-side (no backend database in Phase 1-5)
- Must work in modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Must use existing React/TypeScript/Tailwind stack
- Must integrate with existing localStorage persistence layer
- Must follow established component patterns from other calculators

### Business Constraints
- Must be free to use (no paywalls or subscriptions)
- Must maintain privacy-first approach (no user accounts required)
- Must align with "Your Money or Your Life" philosophy
- Must be production-ready for Icelandic market
- Development timeline prioritizes quality over speed

### Assumptions
- Users understand basic emergency fund concept (some education provided)
- Users can accurately estimate their monthly essential expenses
- 3/6/12 month framework is appropriate for Icelandic economic context
- Users have modern browsers with JavaScript enabled
- Actual Hourly Wage calculator will be completed before or alongside this feature
- localStorage is available and reliable in user browsers
- ISK remains stable enough that inflation adjustments are not critical for MVP

## Success Criteria

### Definition of Done
- [ ] All acceptance criteria are met for Requirements 1-10
- [ ] Calculator produces accurate results matching FIRE principles
- [ ] Icelandic language UI is complete and natural-sounding
- [ ] Mobile responsive design works on devices down to 320px width
- [ ] Accessibility standards (WCAG 2.1 AA) are met
- [ ] Data persists correctly in localStorage
- [ ] Export/import includes emergency fund data
- [ ] Visual design matches app's established style
- [ ] Educational content is clear and motivating
- [ ] Integration with Actual Hourly Wage calculator works seamlessly
- [ ] Performance benchmarks are met (< 100ms calculations, < 2s load)
- [ ] Manual testing completed on all major browsers
- [ ] User testing with 3+ Icelandic users shows positive response

### Acceptance Metrics
- Users can complete calculation in under 2 minutes
- 90%+ of users understand months of freedom metric without additional explanation
- Life energy hours display motivates users (self-reported)
- Risk rating system is clear and actionable (self-reported)
- Target progress visualization drives engagement
- No critical bugs in core calculation logic
- Mobile usability rating of 4/5 or higher
- Accessibility audit passes all WCAG 2.1 AA requirements

## Glossary

| Term | Definition |
|------|------------|
| Emergency Fund (Neyðarsjóður) | Savings set aside specifically for unexpected expenses or income loss |
| Months of Freedom (Frelsissmánuðir) | Number of months a user can cover essential expenses with current emergency fund |
| Life Energy (Lífsorka) | Time from your life invested in earning money, measured in hours worked |
| Actual Hourly Wage (Raunverulegt tímakaup) | True wage after accounting for all work-related expenses and time |
| Runway | Financial term for how long savings will last at current burn rate |
| Essential Expenses (Nauðsynlegur kostnaður) | Minimum monthly spending for basic needs (housing, food, utilities, etc.) |
| Risk Rating | Assessment of emergency fund adequacy based on months of coverage |
| FIRE | Financial Independence, Retire Early - movement/philosophy |
| ISK | Icelandic Króna (currency) |

---

## Requirements Review Checklist

### Completeness
- [x] All user stories have clear roles, features, and benefits
- [x] Each requirement has specific acceptance criteria using EARS format
- [x] Non-functional requirements are addressed (performance, security, usability, reliability, accessibility, localization)
- [x] Success criteria are defined and measurable
- [x] Icelandic context and localization addressed

### Quality
- [x] Requirements are written in active voice
- [x] Each acceptance criterion is testable
- [x] Requirements avoid implementation details (focus on what, not how)
- [x] Terminology is consistent throughout
- [x] Plain language used where possible

### EARS Format Validation
- [x] WHEN statements describe specific events or triggers
- [x] IF statements describe clear conditions or states
- [x] THEN statements use SHALL for system responses
- [x] All statements are specific and measurable

### Clarity
- [x] Requirements are unambiguous
- [x] Technical terms explained in glossary
- [x] Stakeholders can understand all requirements
- [x] No conflicting requirements exist

### Traceability
- [x] Requirements are numbered and organized logically
- [x] Dependencies between requirements are clear
- [x] Requirements link to business objectives (FIRE philosophy, privacy-first, life energy concept)
- [x] Assumptions and constraints are documented

---

**Requirements Phase Complete: Ready for Design Review**
