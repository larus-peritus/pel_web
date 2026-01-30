# Húsnæðiskostnaðarreiknivél (Housing Impact Calculator)

## Overview

Complete specification for the Housing Impact Calculator feature (Calculator 2.1.4) for peninganaedalifid.is.

**Feature Purpose:** Help users understand the true cost of housing decisions (rent vs buy, mortgage terms, refinancing) in terms of money, life energy, and long-term FI impact.

**Icelandic Context:** Supports Icelandic-specific mortgage types (verðtryggð and óverðtryggð lán) and typical Icelandic housing costs.

## Specification Documents

### 1. Requirements (requirements.md)

**Status:** Complete
**Format:** EARS-format acceptance criteria in Icelandic

**Coverage:**
- NS-1: Enter housing information (rental, owned with loan, owned paid off)
- NS-2: See real monthly and yearly cost
- NS-3: See life energy cost
- NS-4: See FI impact (future value)
- NS-5: Compare housing options (up to 4 scenarios)
- NS-6: Rent vs buy analysis
- NS-7: Refinance analysis

**Key Features:**
- Support for 3 housing types: Leiguhúsnæði, Eignarhúsnæði með láni, Eignarhúsnæði greitt upp
- Support for 2 loan types: Verðtryggð lán (indexed), Óverðtryggð lán (non-indexed)
- Comprehensive cost calculations including utilities, property tax, insurance, maintenance
- Life energy calculations (money as hours of life)
- Future value projections at 7% return (5, 10, 20 years)
- Dedicated rent vs buy comparison
- Refinance impact analysis

### 2. Design (design.md)

**Status:** Complete
**Architecture:** Client-side React with TypeScript, CalculatorContext integration

**Key Components:**
- HousingCalculator (main container)
- HousingForm (conditional fields based on housing type)
- HousingSummary (detailed results display)
- HousingComparison (side-by-side comparison)
- RentVsBuyAnalysis (dedicated rent vs buy component)
- RefinanceAnalysis (optional, for loan comparisons)

**Data Models:**
- HousingScenario (main entity)
- HousingInputs (with discriminated union: RentalDetails, LoanDetails, OwnedPaidOffDetails)
- HousingResults (comprehensive results with loan info, life energy, FV)

**Key Design Decisions:**
1. Extend CalculatorContext (consistent with Subscription and Commute patterns)
2. Maximum 4 scenarios (UX best practice)
3. Two loan types (indexed and non-indexed for Icelandic market)
4. Simplified indexed loan formula (interest + inflation) for client-side calculation
5. Dedicated rent vs buy analysis component

**Testing Strategy:**
- 100% unit test coverage for calculations
- 80%+ component test coverage
- Integration tests for CalculatorContext
- E2E tests for critical flows
- Accessibility testing (WCAG 2.1 AA)
- Performance testing (<50ms calculations)

### 3. Tasks (tasks.md)

**Status:** Complete
**Total Tasks:** 26 tasks across 8 epics
**Implementation Strategy:** Hybrid (Foundation + Feature Slice)

**Epic Breakdown:**
1. **Foundation** (1 task): TypeScript types and data models
2. **Calculation Logic** (3 tasks): Loan calculations, cost calculations, comparison functions
3. **Validation** (3 tasks): Input validation, CalculatorContext extensions, localStorage
4. **Form Component** (2 tasks): HousingForm with conditional fields, barrel export
5. **Display Components** (3 tasks): HousingSummary, HousingComparison, barrel export
6. **Special Analysis** (3 tasks): RentVsBuyAnalysis, RefinanceAnalysis, barrel export
7. **Integration** (3 tasks): HousingCalculator container, barrel export, app routing
8. **Testing** (4 tasks): Unit tests, component tests, manual testing, performance testing

**Critical Path:** 1.1 → 2.1 → 2.2 → 3.1 → 3.2 → 4.1 → 7.1 → 7.3 → 8.3

**Parallel Opportunities:**
- Calculation tasks can be parallelized
- Display components can be built in parallel
- Analysis components can be built in parallel
- Testing can be distributed

## File Locations

All specification files are located in:
```
/Users/larusperitus/Documents/code/peritus/pel_web/specs/housing-impact/
```

**Files:**
- `requirements.md` - Complete requirements with EARS format
- `design.md` - Architecture, components, data models, testing strategy
- `tasks.md` - 26 implementation tasks with dependencies
- `README.md` - This file

## Key Icelandic Concepts

### Loan Types
- **Verðtryggð lán** (indexed loans): Vextir + verðbólga, common in Iceland
- **Óverðtryggð lán** (non-indexed loans): Bara vextir, higher nominal rates

### Housing Costs
- **Fasteignagjöld**: Property taxes
- **Húseigendatrygging**: Homeowner's insurance
- **Viðhaldskostnaður**: Maintenance costs
- **Félagsgjöld**: HOA fees (for apartments)
- **Húsaleiga**: Rent

### Loan Calculations
- Standard amortization for óverðtryggð lán
- Simplified indexed calculation: (vextir + verðbólga) for verðtryggð lán
- Default inflation assumption: 3.5% per year

## Implementation Guidance

### Start With
1. Review all three spec documents
2. Begin with Epic 1: TypeScript types (Task 1.1)
3. Follow the task sequence for dependencies
4. Reference design.md for architectural decisions

### Key Patterns to Follow
- Commute Calculator for accordion pattern
- Subscription Burn Meter for comparison patterns
- Existing CalculatorContext for state management
- Existing validation for error message patterns

### Testing Approach
- Unit tests alongside calculations (can parallelize)
- Component tests alongside UI components (can parallelize)
- Manual testing after full integration
- Accessibility audit last

### Estimated Timeline
- Foundation: 2-3 hours
- Calculations: 8-11 hours
- Validation & Context: 4-6 hours
- Form Component: 4-5 hours
- Display Components: 6-8 hours
- Analysis Components: 4-5 hours (2-3 if skip RefinanceAnalysis)
- Integration: 4-5 hours
- Testing: 10-13 hours

**Total Estimate:** 42-56 hours (1-1.5 weeks full-time)

## Success Criteria

The specification is complete when:
- [x] Requirements document with EARS format acceptance criteria
- [x] Design document with architecture, components, data models
- [x] Tasks document with sequenced implementation tasks
- [x] All documents in Icelandic where user-facing
- [x] Traceability between requirements, design, and tasks
- [x] Clear implementation guidance

The implementation is complete when:
- [ ] All 26 tasks completed
- [ ] All tests passing (unit, component, integration)
- [ ] Manual testing completed
- [ ] Accessibility audit passed
- [ ] Performance requirements met
- [ ] Code review completed

## Next Steps

1. Review all three specification documents
2. Ask questions or request clarifications if needed
3. Begin implementation with Task 1.1
4. Follow task sequence respecting dependencies
5. Parallelize where indicated for efficiency

## References

- **App Plan:** /Users/larusperitus/Documents/code/peritus/pel_web/specs/APP_PLAN.md
- **Similar Features:** Commute Calculator, Subscription Burn Meter
- **Patterns:** /Users/larusperitus/Documents/code/peritus/pel_web/specs/vinnuferdakostnadur/

## Document History

- **2026-01-20:** Initial complete specification created
  - Requirements: 7 user stories, EARS format, Icelandic
  - Design: Full architecture, 6 components, data models, testing strategy
  - Tasks: 26 tasks, 8 epics, sequenced with dependencies
