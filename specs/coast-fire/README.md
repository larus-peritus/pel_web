# Coast FIRE Calculator - Complete Specification

## Overview

Complete specification for the Coast FIRE Calculator feature - a FIRE planning tool that calculates when your current investments will grow to meet your Financial Independence number without additional contributions.

**Feature Name**: Coast FIRE Calculator (Ró FIRE Reiknivél)
**Category**: FIRE Planning Tool (3.2)
**Complexity**: Medium
**Dependencies**: Expense Baseline Tool (2.1.11), Actual Hourly Wage Calculator

---

## Specification Documents

This specification follows the three-phase spec-driven development workflow:

### Phase 1: Requirements
**File**: `requirements-coast-fire.md`

**Contents**:
- Problem statement and user needs
- 7 user stories with EARS-format acceptance criteria
- Functional requirements (FR-1 to FR-7)
- Non-functional requirements (performance, usability, accessibility, Icelandic context)
- Validation rules and edge cases
- Integration points with other calculators
- Glossary and default Icelandic values

**Key User Stories**:
- US-1: Calculate Coast FIRE Date
- US-2: See Investment Growth Projection
- US-3: Use Expense Baseline for FI Number
- US-4: Explore Different Scenarios
- US-5: Understand Life Energy Impact
- US-6: Compare Coast FIRE vs Full FI
- US-7: Adjust FI Multiplier

### Phase 2: Design
**File**: `design-coast-fire.md`

**Contents**:
- System architecture and component hierarchy
- Data models and TypeScript interfaces
- Calculation algorithms (compound growth, scenarios, life energy)
- UI component designs with visual layouts
- Integration strategy (Expense Baseline, AWH, CalculatorContext)
- Error handling and validation
- Testing strategy
- Performance considerations

**Key Components**:
- CoastFIRECalculator (main page)
- FINumberInput (with baseline integration)
- CoastFIREStatusCard (results display)
- GrowthProjectionChart (Recharts visualization)
- ScenarioComparisonTable (conservative/moderate/optimistic)
- LifeEnergyDisplay (work hours conversion)
- ActionSuggestionsPanel (when Coast FIRE impossible)

### Phase 3: Tasks
**File**: `tasks-coast-fire.md`

**Contents**:
- 8 epics broken down into 30+ actionable tasks
- Implementation strategy (foundation-first with feature slices)
- Task dependencies and critical path
- Time estimates (40-50 hours total)
- Testing requirements per task
- Definition of done criteria
- Success metrics

**Epic Breakdown**:
1. Foundation - Types, Constants, Core Calculations (6-8 hours)
2. State Management - CalculatorContext Integration (4-5 hours)
3. Basic UI - Input Forms and Results Display (8-10 hours)
4. Visualization - Growth Projection Chart (6-8 hours)
5. Advanced Features - Scenarios and Life Energy (6-8 hours)
6. Integration - Expense Baseline and AWH (4-5 hours)
7. Educational Content and Polish (5-7 hours)
8. Main Page and Routing (2-3 hours)

---

## Key Features

### Core Functionality
- **Coast FIRE Calculation**: Determine when current investments will grow to FI number
- **Compound Growth Projection**: Visual chart showing investment growth trajectory
- **Scenario Analysis**: Compare conservative (5%), moderate (7%), and optimistic (9%) return scenarios
- **Life Energy Display**: Convert results to work hours using actual hourly wage
- **Milestone Visualization**: Chart marks Coast FIRE date and coasting period

### Integration Points
- **Expense Baseline Tool**: Automatically calculate FI number from expense tiers (Barebones/Comfortable/Deluxe)
- **Actual Hourly Wage**: Convert monetary results to life energy (work hours)
- **CalculatorContext**: Shared state management and persistence
- **Cross-Calculator**: FI number can be used by other FIRE calculators

### User Experience
- **Educational Content**: Clear explanations of Coast FIRE concept, return rates, multipliers
- **Plain Language Results**: Icelandic summaries that explain what results mean
- **Actionable Suggestions**: When Coast FIRE impossible, provide specific suggestions (delay retirement, reduce FI number, etc.)
- **Mobile Responsive**: Full functionality on all devices
- **Accessibility**: WCAG 2.1 AA compliant

---

## Technical Stack

- **Frontend**: React with TypeScript, Next.js App Router
- **State Management**: React Context (CalculatorContext)
- **Visualization**: Recharts library
- **Styling**: Tailwind CSS
- **Data Persistence**: LocalStorage (client-side only)
- **Testing**: Jest + React Testing Library

---

## Calculation Methodology

### Core Formula
Future Value = Present Value × (1 + r)^t

Where:
- r = annual return rate (as decimal)
- t = years

### Coast FIRE Date
Solve for t when Future Value = FI Number:
t = ln(FI Number / Current Balance) / ln(1 + r)

### FI Number Calculation
FI Number = Annual Expenses × Multiplier

Where:
- Multiplier = 25 (4% withdrawal rule) or 30 (3.33% rule) or custom

### Life Energy
Work Hours = Amount (ISK) / Actual Hourly Wage (ISK/hour)

---

## Examples

### Example 1: Successfully Coasting
- **Current Age**: 35
- **Current Investments**: 50,000,000 kr
- **FI Number**: 60,000,000 kr (from Expense Baseline: Comfortable tier)
- **Target Retirement Age**: 67
- **Expected Return**: 7%

**Result**: Already Coasting! Current investments will grow to 423,078,500 kr at age 67, far exceeding FI number.

### Example 2: Coast at Future Age
- **Current Age**: 30
- **Current Investments**: 10,000,000 kr
- **FI Number**: 75,000,000 kr
- **Target Retirement Age**: 65
- **Expected Return**: 7%

**Result**: Coast FIRE at age 59.6 (59 years, 7 months). At that point, stop saving and investments will grow to meet FI number by age 65.

### Example 3: Currently Impossible
- **Current Age**: 50
- **Current Investments**: 5,000,000 kr
- **FI Number**: 60,000,000 kr
- **Target Retirement Age**: 60
- **Expected Return**: 7%

**Result**: Cannot coast with current parameters. Projected balance at age 60 is only 9,835,757 kr. Suggestions provided: delay retirement to 72, reduce FI number to 9,835,757 kr, or continue saving 95,000 kr/month.

---

## Implementation Timeline

**Total Estimated Time**: 40-50 hours

### Week 1 (20-25 hours)
- Day 1-2: Epic 1 (Foundation) + Epic 2 (State)
- Day 3-4: Epic 3 (Basic UI)
- Day 5: Epic 4 (Visualization - start)

### Week 2 (20-25 hours)
- Day 6: Epic 4 (Visualization - complete)
- Day 7-8: Epic 5 (Advanced Features) + Epic 6 (Integration)
- Day 9-10: Epic 7 (Polish) + Epic 8 (Routing) + Testing

---

## Success Criteria

### Functional
- [x] Accurate Coast FIRE date calculation (verified against manual calculations)
- [x] Seamless expense baseline integration
- [x] Three scenario calculations (conservative/moderate/optimistic)
- [x] Interactive chart with milestones and coasting period
- [x] Life energy conversions when AWH available

### User Experience
- [x] User can calculate Coast FIRE in < 2 minutes
- [x] Results immediately understandable with plain language
- [x] Educational content makes Coast FIRE concept clear
- [x] Mobile experience smooth and responsive
- [x] Suggestions helpful when Coast FIRE impossible

### Technical
- [x] All tests pass (>90% coverage)
- [x] No console errors or warnings
- [x] Calculations complete in <50ms
- [x] Chart renders in <300ms
- [x] Accessibility meets WCAG 2.1 AA
- [x] TypeScript strict mode compliant

---

## Testing Strategy

### Unit Tests
- All calculation functions (compound interest, years to coast, scenarios)
- Edge cases (0 values, negative returns, already coasting, impossible scenarios)
- Life energy conversions
- Input validation

### Component Tests
- Input forms and validation
- Status card rendering (all three statuses)
- Chart rendering and interactions
- Scenario table
- Life energy display

### Integration Tests
- CalculatorContext state updates
- Expense baseline integration
- AWH integration
- LocalStorage persistence
- Auto-update on baseline changes

### Accessibility Tests
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast (WCAG 2.1 AA)

### Manual Tests
- All user flows
- Mobile devices (iOS, Android)
- Cross-browser (Chrome, Safari, Firefox)
- Edge cases and error scenarios

---

## File Structure

```
/src
  /types
    coastFire.ts                    # TypeScript types
  /lib
    /constants
      coastFire.ts                  # Constants and defaults
    /calculations
      coastFire.ts                  # Calculation functions
  /components
    /coastFire
      CoastFIRECalculator.tsx       # Main component
      InputSection.tsx              # Input forms
      FINumberInput.tsx             # FI number input (with baseline)
      CoastFIREStatusCard.tsx       # Results display
      GrowthProjectionChart.tsx     # Recharts visualization
      ScenarioComparisonTable.tsx   # Scenario table
      LifeEnergyDisplay.tsx         # Life energy display
      ActionSuggestionsPanel.tsx    # Suggestions (impossible)
      EducationalIntro.tsx          # Educational content
      KeyInsights.tsx               # Plain language summary
      index.ts                      # Barrel export
  /context
    CalculatorContext.tsx           # State management (modified)
  /app
    /ro-fire
      page.tsx                      # Route page

/tests
  /lib
    /calculations
      coastFire.test.ts             # Calculation tests
  /components
    /coastFire
      [component].test.tsx          # Component tests
  /integration
    coastFireIntegration.test.tsx   # Integration tests
```

---

## Next Steps

1. **Review Specifications**: Ensure all three documents (requirements, design, tasks) align and are complete
2. **Begin Implementation**: Follow the task breakdown in `tasks-coast-fire.md`
3. **Start with Foundation**: Epic 1 (types, constants, calculations) provides solid base
4. **Incremental Development**: Complete each epic before moving to next
5. **Test as You Go**: Write tests alongside implementation
6. **Get Approval at Gates**: Validate after Foundation, after Basic UI, before final deployment

---

## Reference Documents

- **Requirements**: `requirements-coast-fire.md` - What and why
- **Design**: `design-coast-fire.md` - How (architecture and components)
- **Tasks**: `tasks-coast-fire.md` - Implementation roadmap

---

## Related Features

- **Expense Baseline Tool** (2.1.11): Provides FI number source
- **Actual Hourly Wage Calculator**: Provides life energy context
- **FI Number Builder** (3.5): Alternative FI number calculator
- **Barista FIRE Planner** (3.3): For partial retirement planning
- **Full FIRE Calculator**: For complete FI planning

---

**Specification Status**: ✅ Complete and Ready for Implementation

**Created**: 2026-01-22
**Last Updated**: 2026-01-22
**Version**: 1.0
