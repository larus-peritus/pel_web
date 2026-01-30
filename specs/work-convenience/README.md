# Work Convenience Tracker - Complete Specification

**Status**: Complete Spec-Driven Development Workflow
**Date**: 2025-01-20
**Feature**: Vinnuthreytukostnadur (Work Convenience Tracker)
**App**: peninganaedalifid.is (Icelandic FIRE/Life Energy Calculator)

## Overview

The Work Convenience Tracker helps users understand the true cost of "tired tax" - the convenience spending that happens when you're too exhausted from work to cook, take public transit, or make smart decisions.

## Purpose

Track and analyze convenience purchases made due to work exhaustion:
- Quick logging of convenience expenses
- See impact annualized (monthly → yearly → life energy)
- Compare workday vs off-day spending
- Set goals and track progress
- Categories: food delivery, taxi, prepared meals, restaurants, impulse purchases

## Documents

### 1. Requirements (requirements.md)
**Status**: Complete
**Language**: Icelandic
**Format**: EARS (Easy Approach to Requirements Syntax)

**Contents**:
- 6 User Stories with EARS acceptance criteria
- Input/Output specifications
- Calculation formulas
- Non-functional requirements
- Icelandic context (Wolt, Hreyfill, 10-11, etc.)

**Key Requirements**:
- NS-1: Quick expense logging
- NS-2: See annualized impact
- NS-3: Compare workday vs off-day spending
- NS-4: Category breakdown
- NS-5: Goal setting and tracking
- NS-6: Quick-add presets for common services

### 2. Design (design.md)
**Status**: Complete
**Language**: Icelandic
**Format**: Technical architecture and component design

**Contents**:
- System architecture (client-only, localStorage)
- Component hierarchy (7 main components)
- Data models (TypeScript interfaces)
- Calculation algorithms
- Error handling strategy
- Testing strategy
- Design decisions with rationale

**Key Components**:
- ConvenienceExpenseTracker (main)
- QuickAddExpense (quick logging)
- ExpenseList (expense history)
- WorkdayComparison (workday vs weekend analysis)
- CategoryBreakdown (category statistics)
- GoalProgress (goal tracking)

**Key Calculations**:
- Weekly/Monthly/Annual totals
- Life energy hours (using actualHourlyWage)
- Workday premium = (avgWorkday - avgWeekend) × 52 weeks × 5 days
- Goal progress and savings

### 3. Tasks (tasks.md)
**Status**: Complete
**Language**: Icelandic
**Format**: Implementation tasks organized by epics

**Contents**:
- 20 tasks organized into 7 epics
- Dependencies and sequencing
- Time estimates (total: 46.5 hours)
- Acceptance criteria for each task
- Testing requirements
- Priority breakdown (Must/Should/Could Have)

**7 Epics**:
1. **Grunnur Gogn og Utreikningar** (Foundation Data & Calculations) - 5 klst
2. **Context og Stada Stjornun** (Context & State Management) - 2 klst
3. **UI Ihlutir - Grunnur** (Core UI Components) - 8 klst
4. **UI Ihlutir - Analytics** (Analytics Components) - 8 klst
5. **Samthetting og Polish** (Integration & Polish) - 3 klst
6. **Profanir og Gagnaoryggi** (Testing & Data Safety) - 14 klst
7. **Adgengi og Polish** (Accessibility & Polish) - 5.5 klst

## Implementation Phases

### Phase 1: Foundation (7 hours)
- TypeScript types
- Date utilities (weekday detection)
- Calculation engine
- Context integration

### Phase 2: Core UI (11 hours)
- QuickAddExpense component
- ExpenseList component
- ExpenseItem component

### Phase 3: Analytics (8 hours)
- WorkdayComparison component
- CategoryBreakdown component
- GoalProgress component

### Phase 4: Integration (3 hours)
- Main tracker component
- Add to app page

### Phase 5: Testing (14 hours)
- Unit tests for calculations
- Component tests
- Integration tests
- E2E tests
- Validation

### Phase 6: Polish (5.5 hours)
- Accessibility audit
- Mobile optimization
- Final cleanup

## Key Features

### Quick Logging
- Preset dropdown with common Icelandic services
- Auto-detect workday vs weekend (Mon-Fri vs Sat-Sun)
- Manual override for holidays/vacation
- One-click logging

### Workday Analysis
Visual comparison showing:
- Average workday spending: 3,200 kr
- Average weekend spending: 800 kr
- Difference: 2,400 kr/day
- Annual impact: 124,800 kr/year

### Life Energy Impact
Convert expenses to time:
- 18,000 kr/month = 9.5 hours/month
- 216,000 kr/year = 57.1 days/year

### Goal Tracking
- Set monthly spending target
- Visual progress bar
- Savings calculation (if goal met)
- Annual savings projection

## Icelandic Context

### Common Presets
**Heimsending (Delivery)**:
- Wolt: 4,500 kr
- AHA: 3,800 kr
- Dominos: 3,200 kr

**Leigubill (Taxi)**:
- Hreyfill short: 2,000 kr
- Hreyfill medium: 3,500 kr
- Hreyfill long: 5,000 kr

**Tilbuinn matur (Prepared meals)**:
- 10-11: 1,500 kr
- Bonus: 1,800 kr
- Netto: 2,200 kr

**Mathus (Restaurants)**:
- Skyndibit: 2,500 kr
- Casual: 4,000 kr

### Categories
1. Heimsending (delivery)
2. Leigubill (taxi)
3. Tilbuinn matur (prepared)
4. Mathus (restaurant)
5. Kaup i vinnu (impulse purchases)
6. Annat (other)

## Technical Architecture

### Client-Only Design
- No server calls
- All data in localStorage
- Privacy-first approach
- Export/import functionality

### Integration
- Uses existing CalculatorContext
- Shares actualHourlyWage with main calculator
- Same localStorage system
- Unified export/import

### Dependencies
- React + TypeScript
- Tailwind CSS
- date-fns (lightweight date library)
- Existing UI components (Card, Button, Input, Select)

## Success Criteria

### Must Have (MVP)
- All 6 user stories implemented
- EARS acceptance criteria met
- Workday vs weekend comparison
- Goal tracking
- Quick-add presets
- Icelandic language throughout

### Should Have
- Unit test coverage >80%
- Component tests for all UI
- E2E tests for critical flows
- WCAG 2.1 AA compliance
- Mobile-optimized

### Could Have
- Animations and transitions
- Advanced filtering
- Trend analysis
- AI suggestions

## File Locations

```
/Users/larusperitus/Documents/code/peritus/pel_web/specs/work-convenience/
├── README.md (this file)
├── requirements.md (complete)
├── design.md (complete)
└── tasks.md (complete)
```

## Next Steps

1. **Review all three documents**
   - Requirements: Verify EARS acceptance criteria
   - Design: Review architecture and components
   - Tasks: Confirm sequencing and estimates

2. **Begin implementation**
   - Start with Epic 1 (Foundation)
   - Follow task dependencies
   - Track progress in tasks.md

3. **Reference during development**
   - Use requirements for acceptance testing
   - Use design for technical decisions
   - Use tasks for implementation sequence

## Traceability

Every task traces back to:
- Specific requirements (NS-1 through NS-6)
- Design components and calculations
- Acceptance criteria

Every design decision includes:
- Context and problem
- Options considered
- Chosen solution with rationale
- Implications and trade-offs

## Notes

- **Language**: All UI in Icelandic (requirements, design, and tasks in Icelandic)
- **Currency**: ISK (Icelandic Króna)
- **Context**: Part of FIRE/Life Energy Calculator app
- **Complexity**: Simple feature with clear scope
- **Dependency**: Requires Actual Hourly Wage Calculator

## Quality Assurance

- EARS format for all acceptance criteria
- Complete traceability requirements → design → tasks
- Time estimates for all tasks
- Testing strategy defined
- Accessibility requirements specified
- Error handling documented
- Icelandic translations provided

---

**Complete Specification Created**: 2025-01-20
**Total Estimated Implementation Time**: 46.5 hours
**Ready for Development**: Yes
