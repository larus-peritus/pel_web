# Requirements: Job Offer Comparison Tool

**Feature ID**: 2.3.4
**Feature Name**: Job Offer Comparison Tool
**App**: peninganaedalifid (Peningana eða lífið)
**Created**: 2026-01-22
**Status**: Draft

---

## 1. Feature Overview

### 1.1 Purpose

Enable users to compare multiple job offers holistically by calculating and visualizing the true "life energy" cost of each position, accounting for salary, benefits, commute time, work hours, stress levels, and other factors beyond base compensation.

### 1.2 User Value

**Primary Value**: Users can make informed career decisions by understanding which job offer provides the best actual hourly wage and overall life quality when all factors are considered.

**Secondary Value**: Aligns with the app's core philosophy of helping users understand work in terms of "life energy" (hours of their life) rather than just monetary compensation.

### 1.3 Scope

**In Scope**:
- Comparison of 2-5 job offers simultaneously
- Calculation of actual hourly wage for each offer
- Side-by-side visualization of key metrics
- Factor in Icelandic-specific employment benefits (vacation days, pension contributions, lunch benefits, etc.)
- Include non-monetary factors (commute time, flexibility, stress level, growth opportunities)
- Export/import comparison data
- Assumption transparency (show all inputs used in calculations)
- Annualized impact calculations
- Life energy representation of differences

**Out of Scope**:
- Job search or job board integration
- Automated salary data fetching
- Tax calculation integration (handled by Actual Hourly Wage methodology)
- Employer reviews or ratings
- Historical job offer tracking over time
- Sharing comparisons with others

### 1.4 Dependencies

- **Actual Hourly Wage methodology** (Must be implemented first or in parallel)
- Privacy-first data storage (local storage, no backend)
- Export/import functionality (app-wide feature)

---

## 2. User Stories

### 2.1 Primary User Stories

**US-1: Compare Multiple Job Offers**
> As a job seeker evaluating multiple offers,
> I want to input details of each job offer and see a side-by-side comparison,
> So that I can make an informed decision based on actual value to my life, not just salary numbers.

**US-2: Calculate True Hourly Wage**
> As a user comparing job offers,
> I want the tool to calculate the actual hourly wage for each offer (including hidden time costs),
> So that I can understand the real value of my time at each job.

**US-3: Factor in Non-Monetary Benefits**
> As a user evaluating career options,
> I want to include non-monetary factors like flexibility, stress level, and growth opportunities in the comparison,
> So that I can see the holistic impact on my life quality.

**US-4: Understand Life Energy Impact**
> As a user making career decisions,
> I want to see differences between offers expressed in life energy (hours/days of my life),
> So that I can grasp the real-world impact of choosing one offer over another.

**US-5: Save and Revisit Comparisons**
> As a user evaluating offers over time,
> I want to save my comparison and return to it later,
> So that I can refine my inputs and make a decision when ready.

### 2.2 Secondary User Stories

**US-6: Export Comparison**
> As a user who wants to discuss my options with family,
> I want to export my job offer comparison,
> So that I can share the analysis or keep it for records.

**US-7: Icelandic Employment Specifics**
> As an Icelandic employee,
> I want the tool to understand Icelandic employment norms (pension %, vacation days, lunch benefits),
> So that the comparison is accurate for my local context.

**US-8: Transparent Assumptions**
> As a detail-oriented user,
> I want to see all assumptions and inputs used in the comparison calculations,
> So that I can trust the results and adjust inputs if needed.

---

## 3. Acceptance Criteria (EARS Format)

### 3.1 Core Functionality

**AC-1: Job Offer Input**
> **WHEN** a user creates a new job offer comparison,
> **THEN** the system SHALL allow the user to add between 2 and 5 job offers.

**AC-2: Offer Details Entry**
> **WHEN** a user adds a job offer to the comparison,
> **THEN** the system SHALL prompt for:
> - Offer name/title (text, required)
> - Annual gross salary (ISK, required)
> - Expected weekly work hours (number, default: 40)
> - Vacation days per year (number, default: 24 for Iceland)
> - Commute time (minutes per day, default: 0)
> - Pension contribution percentage (default: 11.5% for Iceland)
> - Other monetary benefits (ISK per year, optional)
> - Flexibility rating (1-5 scale, optional)
> - Stress level (1-5 scale, optional)
> - Growth opportunities (1-5 scale, optional)
> - Additional notes (text, optional)

**AC-3: Actual Hourly Wage Calculation**
> **WHEN** a user enters job offer details,
> **THEN** the system SHALL calculate the actual hourly wage using the Actual Hourly Wage methodology, which includes:
> - Annual gross salary divided by actual work hours (accounting for vacation)
> - Commute time added to work hours
> - Any unpaid overhead time factored in
> - Benefits monetized and added to compensation

**AC-4: Side-by-Side Comparison Display**
> **WHEN** a user has entered 2 or more job offers,
> **THEN** the system SHALL display a side-by-side comparison showing:
> - Offer name/title
> - Annual gross salary (ISK)
> - Actual hourly wage (ISK/hour)
> - Total annual hours required (work + commute)
> - Total annual "life energy" cost (hours)
> - Difference from best offer (in ISK/hour and hours/year)
> - Non-monetary factor scores (if entered)
> - Overall ranking indicator

**AC-5: Life Energy Representation**
> **WHEN** viewing the comparison,
> **THEN** the system SHALL express differences in "life energy" terms:
> - "Choosing Offer B over Offer A costs you 120 extra hours per year"
> - "Offer A gives you 15 more days per year of your life back"
> - Annualized impact expressed in hours, days, and weeks

**AC-6: Assumption Transparency**
> **WHEN** viewing calculation results,
> **THEN** the system SHALL display a collapsible "Assumptions" section showing:
> - All inputs used for each offer
> - Calculation methodology
> - Default values applied (if any)
> - Link to Actual Hourly Wage methodology explanation

### 3.2 Data Management

**AC-7: Local Data Storage**
> **WHEN** a user creates or modifies a job offer comparison,
> **THEN** the system SHALL save the data to local storage automatically (privacy-first, no backend required).

**AC-8: Comparison Persistence**
> **WHEN** a user returns to the app,
> **THEN** the system SHALL load their most recent job offer comparison (if any exists).

**AC-9: Export Functionality**
> **WHEN** a user clicks "Export Comparison",
> **THEN** the system SHALL generate a downloadable JSON file containing all offer details and calculations.

**AC-10: Import Functionality**
> **WHEN** a user uploads a previously exported comparison file,
> **THEN** the system SHALL load the offers and display the comparison.

### 3.3 Icelandic Context

**AC-11: Icelandic Defaults**
> **WHEN** a user creates a new job offer,
> **THEN** the system SHALL pre-populate Icelandic employment defaults:
> - Vacation days: 24 days/year
> - Pension contribution: 11.5% (employer + employee combined)
> - Work week: 40 hours

**AC-12: Icelandic Benefit Types**
> **WHEN** entering benefits,
> **THEN** the system SHALL provide options for common Icelandic benefits:
> - Lunch benefits (dagpeningugleði)
> - Car allowance (bílastyrður)
> - Phone allowance (símastyrður)
> - Health insurance (sjúkratrygging)
> - Additional pension contribution beyond mandatory

**AC-13: Language Support**
> **WHEN** viewing the comparison,
> **THEN** the system SHALL display labels and outputs in Icelandic by default, with English as secondary option.

### 3.4 User Experience

**AC-14: Plain Language Outputs**
> **WHEN** displaying results,
> **THEN** the system SHALL use plain language:
> - "This offer costs you 250 hours per year" (not just "ISK 2,500,000")
> - "You'll work 2,080 hours per year at this job" (explicit clarity)
> - "The commute alone costs you 10 hours per week"

**AC-15: Visual Comparison**
> **WHEN** viewing the comparison,
> **THEN** the system SHALL provide visual indicators:
> - Color coding (green for best, yellow for middle, red for worst on key metrics)
> - Bar charts or visual length comparisons for life energy differences
> - Clear "Winner" or "Best Value" indicator

**AC-16: Responsive Comparison Layout**
> **IF** a user views the comparison on a mobile device,
> **THEN** the system SHALL display offers in a vertically stacked layout with swipe navigation.
>
> **IF** a user views the comparison on desktop,
> **THEN** the system SHALL display offers in a horizontal side-by-side layout.

**AC-17: Input Validation**
> **WHEN** a user enters offer details,
> **THEN** the system SHALL validate:
> - Salary is a positive number
> - Hours per week is between 1 and 168
> - Vacation days is between 0 and 365
> - Commute time is between 0 and 480 minutes
> - Ratings (1-5 scales) are within range

**AC-18: Editing Existing Offers**
> **WHEN** a user clicks "Edit" on an existing offer in the comparison,
> **THEN** the system SHALL allow modification of all fields and recalculate the comparison immediately.

**AC-19: Removing Offers**
> **WHEN** a user clicks "Remove" on an offer,
> **THEN** the system SHALL remove it from the comparison and update the display (minimum 2 offers required for comparison).

### 3.5 Non-Monetary Factor Handling

**AC-20: Optional Non-Monetary Factors**
> **WHEN** a user enters non-monetary factors,
> **THEN** the system SHALL display them in the comparison WITHOUT forcing them to affect the actual hourly wage calculation (keep monetary and qualitative separate).

**AC-21: Factor Weighting Guidance**
> **WHEN** a user views non-monetary factors in the comparison,
> **THEN** the system SHALL provide guidance on interpreting them:
> - "These factors don't change your hourly wage but affect your overall life quality"
> - Visual separation between monetary and non-monetary comparisons

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-1: Calculation Speed**
> **WHEN** a user enters or modifies offer details,
> **THEN** the system SHALL recalculate and update the comparison within 200ms.

**NFR-2: Offline Capability**
> **WHEN** a user accesses the comparison tool without internet,
> **THEN** the system SHALL function fully (except for initial app load if not cached).

### 4.2 Usability

**NFR-3: Input Simplicity**
> **WHEN** a user adds a job offer,
> **THEN** the system SHALL require only 2 mandatory fields (name and salary) with all others having sensible defaults.

**NFR-4: Comparison Clarity**
> **WHEN** viewing the comparison,
> **THEN** the system SHALL make the "best overall value" offer immediately obvious (within 3 seconds of viewing).

**NFR-5: Mobile Usability**
> **WHEN** using the tool on mobile devices,
> **THEN** the system SHALL ensure all inputs and comparisons are fully accessible and readable without horizontal scrolling.

### 4.3 Privacy and Security

**NFR-6: Local-Only Storage**
> **WHEN** a user creates job offer comparisons,
> **THEN** the system SHALL store ALL data exclusively in browser local storage (no server transmission).

**NFR-7: Data Portability**
> **WHEN** a user exports their comparison,
> **THEN** the exported file SHALL be in a human-readable, open format (JSON) that can be imported into other tools if desired.

### 4.4 Accessibility

**NFR-8: Keyboard Navigation**
> **WHEN** a user navigates the comparison tool via keyboard,
> **THEN** the system SHALL support full functionality without requiring a mouse.

**NFR-9: Screen Reader Support**
> **WHEN** a user accesses the comparison with a screen reader,
> **THEN** the system SHALL provide clear labels and descriptions for all fields and results.

### 4.5 Maintainability

**NFR-10: Methodology Decoupling**
> **WHEN** the Actual Hourly Wage calculation methodology changes,
> **THEN** the system SHALL isolate that logic in a separate module/function for easy updates.

---

## 5. Constraints and Assumptions

### 5.1 Technical Constraints

**TC-1**: Next.js framework (already in use)
**TC-2**: No backend required (local-first architecture)
**TC-3**: Browser local storage for persistence (5-10MB typical limit)
**TC-4**: Must work offline after initial load

### 5.2 Business Constraints

**BC-1**: Icelandic market primary focus (with potential for other markets)
**BC-2**: Privacy-first philosophy (no user accounts, no data collection)
**BC-3**: Free to use (no monetization requirements in MVP)

### 5.3 Assumptions

**A-1**: Users understand basic employment terms (salary, benefits, vacation days)
**A-2**: Users can estimate their own commute times and stress levels
**A-3**: The Actual Hourly Wage methodology exists and can be referenced/reused
**A-4**: Users are comparing offers for similar roles (not comparing doctor vs. barista)
**A-5**: Annual salary is gross (before tax), as tax is handled by Actual Hourly Wage methodology
**A-6**: Users have access to detailed offer letters with benefit information
**A-7**: Maximum 5 offers is sufficient for most users' decision-making needs
**A-8**: Icelandic employment law defaults are stable (24 vacation days, 11.5% pension standard)

---

## 6. Success Metrics

**SM-1: Completion Rate**
- Target: 70% of users who start a comparison complete it (enter at least 2 offers with full details)

**SM-2: Comparison Usefulness**
- Target: Users report the comparison "changed my perspective" or "helped me decide" (qualitative feedback)

**SM-3: Feature Retention**
- Target: 40% of users who create a comparison return to refine it or create another comparison within 30 days

**SM-4: Export Usage**
- Target: 20% of completed comparisons result in an export (indicates value worth saving)

---

## 7. Open Questions

**Q-1**: Should we allow users to add custom benefit categories beyond the predefined Icelandic ones?
**Resolution Needed By**: Design phase
**Impact**: Medium (affects UI complexity)

**Q-2**: How do we handle offers with variable compensation (commission, bonuses)?
**Resolution Needed By**: Design phase
**Impact**: Medium (may need additional input fields or guidance)

**Q-3**: Should non-monetary factors (stress, flexibility, growth) be weighted numerically, or remain qualitative?
**Resolution Needed By**: Design phase
**Impact**: Medium (affects how we present "overall winner")

**Q-4**: Do we need to handle offers with different pay periods (hourly vs. annual salary)?
**Resolution Needed By**: Design phase
**Impact**: Low (can normalize to annual in most cases)

**Q-5**: Should we provide templates for common job types (e.g., "Typical Office Job", "Service Industry") with pre-filled defaults?
**Resolution Needed By**: Tasks phase
**Impact**: Low (nice-to-have, not MVP critical)

---

## 8. Requirements Validation Checklist

- [x] All requirements use EARS format (WHEN/IF/WHILE/WHERE... THEN... SHALL)
- [x] Each requirement is testable and verifiable
- [x] Requirements are uniquely identified (AC-1, NFR-1, etc.)
- [x] User stories follow "As a... I want... So that..." format
- [x] Non-functional requirements are measurable
- [x] Dependencies are clearly stated
- [x] Scope boundaries are defined (in/out of scope)
- [x] Icelandic context requirements are included
- [x] Privacy-first principle is maintained
- [x] Life energy mental model is reflected
- [x] Assumptions are documented
- [x] Open questions are identified
- [x] Success metrics are defined

---

## 9. Requirements Traceability

This requirements document will be referenced by:
- **Design Document**: `design-job-offer-comparison.md`
- **Tasks Document**: `tasks-job-offer-comparison.md`
- **Implementation Status**: To be tracked in `apps/peninganaedalifid/context/IMPLEMENTATION_STATUS.md`

All design decisions and implementation tasks must trace back to specific requirements listed in this document.

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Requirements Agent | Initial requirements document created |

---

**Document Status**: Ready for Design Phase
**Next Step**: Create design document (`design-job-offer-comparison.md`) that addresses all requirements listed above.
