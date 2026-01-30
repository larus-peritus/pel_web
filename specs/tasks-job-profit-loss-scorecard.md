# Tasks: Job Profit/Loss Scorecard

## Implementation Overview

### Sequencing Strategy
**Foundation-First Approach**: Build from types → calculations → component → integration

**Rationale**:
- Types establish contract
- Pure calculation functions are independently testable
- Component depends on both types and calculations
- Integration is final step

**Total Estimated Time**: 12-14 hours across 8 tasks

---

## Task Hierarchy

### Epic 1: Type System & Constants (2 hours)
- Task 1: Add TypeScript types
- Task 2: Create Icelandic text constants

### Epic 2: Calculation Engine (3 hours)
- Task 3: Implement profitability grading logic
- Task 4: Write calculation unit tests

### Epic 3: UI Component (5 hours)
- Task 5: Create JobProfitLossScorecard component
- Task 6: Implement component sub-sections
- Task 7: Write component tests

### Epic 4: Integration & Polish (2-3 hours)
- Task 8: Integrate into calculator page and test

---

## Tasks

### Task 1: Add TypeScript Types
**Epic**: Type System & Constants
**Estimated Time**: 1 hour
**Priority**: High (Blocker for all other tasks)
**Dependencies**: None

**Objective**:
Add new TypeScript types for profitability assessment to existing type system.

**Files to Modify**:
- `src/types/calculator.ts` (add new interfaces)

**Functionality**:
1. Add `ProfitabilityGrade` type union
2. Add `ProfitabilityAssessment` interface
3. Ensure types export properly
4. No breaking changes to existing types

**New Types**:
```typescript
export type ProfitabilityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface ProfitabilityAssessment {
  grade: ProfitabilityGrade;
  percentageReduction: number;
  netWeeklyLifeEnergy: number;
  netMonthlyLifeEnergy: number;
  gradeLabel: string;
  gradeExplanation: string;
  isProfit: boolean;
  severity: 'success' | 'warning' | 'error';
}
```

**Testing**:
- [ ] TypeScript compiles with no errors
- [ ] New types exportable from `@/types/calculator`
- [ ] No impact on existing calculator functionality

**Requirements Traceability**:
- FR-2: Profitability Grading System (defines grade levels)
- US-2: Understand Job Profitability Grade

**Acceptance Criteria**:
- ✓ Types added to calculator.ts
- ✓ Zero TypeScript compilation errors
- ✓ Types align with design spec exactly

---

### Task 2: Create Icelandic Text Constants
**Epic**: Type System & Constants
**Estimated Time**: 1 hour
**Priority**: High
**Dependencies**: None

**Objective**:
Create constant objects for all Icelandic text labels used in the scorecard.

**Files to Create**:
- `src/lib/constants/profitability.ts`

**Functionality**:
1. Create `PROFITABILITY_LABELS` constant with all UI text
2. Create `GRADE_LABELS` constant mapping grades to Icelandic labels
3. Create `GRADE_EXPLANATIONS` constant mapping grades to explanations
4. Export all constants with `as const` assertion for type safety

**Text Constants Needed**:
- Section titles (e.g., "Hagkvæmniseinkunn starfs")
- Field labels (e.g., "Nettó lífsorka")
- Time units (e.g., "viku", "mánuð")
- Grade labels (e.g., "Framúrskarandi", "Gott")
- Grade explanations (full sentences for each grade)

**Testing**:
- [ ] All constants defined
- [ ] TypeScript types inferred correctly with `as const`
- [ ] No missing translations (all text in Icelandic)

**Requirements Traceability**:
- FR-6: Icelandic Localization
- US-4: See Plain Language Summary

**Acceptance Criteria**:
- ✓ Constants file created
- ✓ All text in natural Icelandic
- ✓ Type-safe with `as const`
- ✓ No hard-coded strings in component code

---

### Task 3: Implement Profitability Grading Logic
**Epic**: Calculation Engine
**Estimated Time**: 2 hours
**Priority**: High (Blocker for component)
**Dependencies**: Task 1 (types)

**Objective**:
Create pure function that calculates profitability grade and assessment details from calculation results.

**Files to Create**:
- `src/lib/calculations/profitability.ts`
- `src/lib/calculations/index.ts` (update barrel export)

**Functionality**:
1. Implement `calculateProfitabilityGrade()` main function
2. Implement `getGradeLabel()` helper
3. Implement `getGradeExplanation()` helper
4. Calculate net life energy (weekly and monthly)
5. Map grade to severity level
6. Handle edge cases (null input, zero wage)

**Grade Assignment Logic**:
```typescript
// From design spec
if (actualHourlyWage <= 0) → F
else if (percentageReduction < 15) → A
else if (percentageReduction < 30) → B
else if (percentageReduction < 45) → C
else if (percentageReduction < 60) → D
else → F
```

**Net Life Energy Calculation**:
```typescript
annualLifeEnergyHours = netAnnualIncome / actualHourlyWage
netWeeklyLifeEnergy = annualLifeEnergyHours / 52
netMonthlyLifeEnergy = netWeeklyLifeEnergy * 4.33
```

**Testing**:
See Task 4 (unit tests run alongside this task)

**Requirements Traceability**:
- FR-1: Net Life Energy Calculation
- FR-2: Profitability Grading System
- FR-4: Color Coding System

**Acceptance Criteria**:
- ✓ Function returns `ProfitabilityAssessment` interface
- ✓ Grade assignment matches specification exactly
- ✓ Net life energy calculated correctly
- ✓ Returns null for null input
- ✓ Handles zero wage gracefully (F grade, 0 life energy)
- ✓ All text from constants file (no hard-coding)

---

### Task 4: Write Calculation Unit Tests
**Epic**: Calculation Engine
**Estimated Time**: 1 hour
**Priority**: High
**Dependencies**: Task 3 (profitability logic)

**Objective**:
Achieve 100% test coverage for profitability calculation logic.

**Files to Create**:
- `tests/lib/calculations/profitability.test.ts`

**Test Cases**:
1. **Grade Assignment**:
   - ✓ Grade A: 10% reduction → expects 'A'
   - ✓ Grade B: 20% reduction → expects 'B'
   - ✓ Grade C: 35% reduction → expects 'C'
   - ✓ Grade D: 50% reduction → expects 'D'
   - ✓ Grade F: 70% reduction → expects 'F'
   - ✓ Grade F: Zero actual wage → expects 'F'
   - ✓ Grade F: Negative actual wage → expects 'F'

2. **Net Life Energy**:
   - ✓ Positive net income: calculates correctly
   - ✓ Zero net income: returns 0 life energy
   - ✓ Negative net income with positive wage: negative life energy
   - ✓ Weekly calculation: annual / 52
   - ✓ Monthly calculation: weekly * 4.33

3. **Severity Mapping**:
   - ✓ Grade A → 'success'
   - ✓ Grade B → 'success'
   - ✓ Grade C → 'warning'
   - ✓ Grade D → 'warning'
   - ✓ Grade F → 'error'

4. **Edge Cases**:
   - ✓ Null input → returns null
   - ✓ Undefined actualHourlyWage → returns null
   - ✓ Boundary conditions (14.9%, 15%, 29.9%, 30%, etc.)

5. **Icelandic Text**:
   - ✓ Grade labels are in Icelandic
   - ✓ Explanations are in Icelandic
   - ✓ Uses constants (not hard-coded)

**Coverage Target**: 100%

**Testing Framework**: Vitest (matching existing tests)

**Requirements Traceability**:
- All FR and US requirements tested through calculation logic

**Acceptance Criteria**:
- ✓ All 20+ tests passing
- ✓ 100% code coverage on profitability.ts
- ✓ Edge cases handled correctly
- ✓ Matches design spec behavior exactly

---

### Task 5: Create JobProfitLossScorecard Component
**Epic**: UI Component
**Estimated Time**: 2 hours
**Priority**: High
**Dependencies**: Tasks 1-4 (types, constants, calculations)

**Objective**:
Create main component shell with basic structure and integration with CalculatorContext.

**Files to Create**:
- `src/components/calculator/JobProfitLossScorecard.tsx`
- `src/components/calculator/index.ts` (update barrel export)

**Functionality**:
1. Set up component props interface
2. Integrate with `useCalculator()` hook
3. Implement `useMemo` for profitability calculation
4. Handle null results state (return null)
5. Create main Card wrapper
6. Add basic component structure (sections as placeholders)

**Component Structure**:
```tsx
export function JobProfitLossScorecard({ className }: Props) {
  const { results } = useCalculator();

  const profitability = useMemo(
    () => calculateProfitabilityGrade(results),
    [results]
  );

  if (!results || !profitability) return null;

  return (
    <Card className={cn("max-w-2xl", className)}>
      {/* Grade Display - implemented in Task 6 */}
      {/* Net Life Energy - implemented in Task 6 */}
      {/* Income Breakdown - implemented in Task 6 */}
      {/* Time Breakdown - implemented in Task 6 */}
      {/* Plain Language Summary - implemented in Task 6 */}
    </Card>
  );
}
```

**Testing**:
- [ ] Component renders without errors
- [ ] Returns null when no results
- [ ] useMemo properly memoizes
- [ ] Integrates with CalculatorContext

**Requirements Traceability**:
- NFR-1: Performance (useMemo)
- NFR-6: Integration (CalculatorContext)

**Acceptance Criteria**:
- ✓ Component file created
- ✓ Proper TypeScript typing
- ✓ Hooks integrated correctly
- ✓ Memoization working
- ✓ Null state handled
- ✓ Exported from barrel file

---

### Task 6: Implement Component Sub-Sections
**Epic**: UI Component
**Estimated Time**: 2.5 hours
**Priority**: High
**Dependencies**: Task 5 (component shell)

**Objective**:
Implement all five display sections within the scorecard component.

**Files to Modify**:
- `src/components/calculator/JobProfitLossScorecard.tsx`

**Functionality**:
Implement each section following design spec:

1. **Grade Display Section** (30 min):
   - Large badge with grade letter
   - Icelandic grade label
   - Gradient background
   - Color-coded by severity

2. **Net Life Energy Section** (30 min):
   - Two-column grid (weekly/monthly)
   - Color-coded borders (green profit, red loss)
   - Plus/minus signs
   - Life energy formatting

3. **Income Breakdown Section** (30 min):
   - Three-line breakdown (gross → expenses → net)
   - ISK and life energy for each line
   - Expenses in red with minus
   - Net income emphasized

4. **Time Breakdown Section** (30 min):
   - Three-line breakdown (base → extra → total)
   - Extra hours in warning color
   - Average hours/day calculation
   - Localized number formatting

5. **Plain Language Summary** (30 min):
   - Alert component with severity color
   - Grade-specific explanation
   - Actionable next steps
   - Encouraging/constructive tone

**UI Components Used**:
- Card (wrapper)
- Badge (grade display)
- Alert (summary)
- Existing utility functions (formatCurrency, formatLifeEnergy)

**Responsive Design**:
- Desktop: Two-column grid for net life energy
- Mobile: Stacked layout

**Testing**:
Testing is in Task 7, but manual verification during implementation.

**Requirements Traceability**:
- US-1: Net Life Energy (Section 2)
- US-2: Grade Display (Section 1)
- US-3: Breakdown (Sections 3 & 4)
- US-4: Plain Language (Section 5)
- FR-3: Display Components
- FR-4: Color Coding
- NFR-4: Mobile Responsiveness

**Acceptance Criteria**:
- ✓ All 5 sections implemented
- ✓ Matches design spec styling exactly
- ✓ Uses design system colors
- ✓ All text from constants file
- ✓ Responsive layout works
- ✓ Accessibility attributes present

---

### Task 7: Write Component Tests
**Epic**: UI Component
**Estimated Time**: 1.5 hours
**Priority**: High
**Dependencies**: Task 6 (component implementation)

**Objective**:
Achieve >90% test coverage for JobProfitLossScorecard component with comprehensive functional and accessibility tests.

**Files to Create**:
- `tests/components/calculator/JobProfitLossScorecard.test.tsx`

**Test Categories**:

1. **Rendering Tests** (6 tests):
   - ✓ Returns null when no results
   - ✓ Returns null when results but profitability calculation fails
   - ✓ Renders all sections when valid results
   - ✓ Grade badge displays correct letter
   - ✓ Grade label shows correct Icelandic text
   - ✓ Color coding matches grade severity

2. **Data Display Tests** (8 tests):
   - ✓ Net weekly life energy displayed correctly
   - ✓ Net monthly life energy displayed correctly
   - ✓ Gross income shows ISK and life energy
   - ✓ Expenses show ISK and life energy with minus
   - ✓ Net income shows ISK and life energy
   - ✓ Base hours displayed
   - ✓ Extra hours displayed with warning color
   - ✓ Total hours displayed

3. **Conditional Rendering Tests** (4 tests):
   - ✓ Profit border green when positive net
   - ✓ Loss border red when negative net
   - ✓ Grade A shows encouraging message
   - ✓ Grade F shows warning message

4. **Accessibility Tests** (5 tests):
   - ✓ No axe violations
   - ✓ Proper heading hierarchy (h2, h3)
   - ✓ ARIA labels present on key elements
   - ✓ Color contrast meets WCAG AA
   - ✓ Semantic HTML structure

5. **Integration Tests** (3 tests):
   - ✓ Updates when calculator inputs change
   - ✓ useMemo prevents unnecessary recalculation
   - ✓ Works with different profitability grades

**Testing Tools**:
- @testing-library/react
- @testing-library/user-event
- jest-axe (accessibility)
- Vitest

**Coverage Target**: >90%

**Requirements Traceability**:
- NFR-3: Accessibility
- NFR-4: Mobile Responsiveness
- All US and FR requirements

**Acceptance Criteria**:
- ✓ All 26+ tests passing
- ✓ >90% code coverage
- ✓ No axe accessibility violations
- ✓ All edge cases handled
- ✓ Integration with context tested

---

### Task 8: Integrate into Calculator Page and Test
**Epic**: Integration & Polish
**Estimated Time**: 2-3 hours
**Priority**: High
**Dependencies**: Tasks 5-7 (component complete)

**Objective**:
Add JobProfitLossScorecard to main calculator page, verify integration, and perform end-to-end testing.

**Files to Modify**:
- `src/app/page.tsx` (add scorecard to layout)
- `context/IMPLEMENTATION_STATUS.md` (update status)

**Functionality**:

1. **Add to Calculator Page** (45 min):
   - Import JobProfitLossScorecard
   - Place below main calculator results section
   - Ensure proper spacing and layout
   - Verify responsive behavior

2. **Create Module Documentation** (30 min):
   - Create `context/modules/JobProfitLossScorecardComponent.md`
   - Document component API
   - Document integration points
   - Include usage examples

3. **End-to-End Testing** (45 min):
   - Test with various input scenarios
   - Verify all grades display correctly (A-F)
   - Test profit and loss scenarios
   - Verify edge cases (zero wage, high expenses)
   - Test export/import includes profitability

4. **Visual QA** (30 min):
   - Check desktop layout (1024px+)
   - Check tablet layout (768px-1023px)
   - Check mobile layout (<768px)
   - Verify color scheme consistency
   - Check typography and spacing

**Integration Points to Verify**:
- [ ] CalculatorContext integration working
- [ ] Real-time updates when inputs change
- [ ] Correct data flow from calculator
- [ ] Export/import preserves data
- [ ] No performance degradation

**Testing Scenarios**:
1. **Excellent Job (Grade A)**:
   - High income, low expenses, minimal extra time
   - Expect: Green styling, positive message

2. **Average Job (Grade B/C)**:
   - Moderate income, typical expenses
   - Expect: Mixed styling, suggestions

3. **Poor Job (Grade D)**:
   - High expenses or lots of extra time
   - Expect: Warning styling, concern messages

4. **Failing Job (Grade F)**:
   - Expenses exceed income OR very high time costs
   - Expect: Red styling, critical warnings

5. **Edge Cases**:
   - Zero income → F grade
   - Zero expenses → High grade
   - Remote work (no commute) → Better grade

**Documentation Updates**:
- [ ] Update `IMPLEMENTATION_STATUS.md`
- [ ] Update feature tracker (mark 2.3.1 complete)
- [ ] Create module documentation
- [ ] Add to component index

**Requirements Traceability**:
- All requirements validated through integration testing
- US-6: Export Scorecard Results
- NFR-5: Data Privacy (verify no external calls)

**Acceptance Criteria**:
- ✓ Scorecard integrated into calculator page
- ✓ Real-time updates working
- ✓ All test scenarios pass
- ✓ Responsive on all screen sizes
- ✓ No console errors or warnings
- ✓ Performance acceptable (<100ms render)
- ✓ Documentation complete
- ✓ Ready for production deployment

---

## Testing Summary

### Unit Tests
- **File**: `tests/lib/calculations/profitability.test.ts`
- **Coverage**: 100% for profitability.ts
- **Count**: 20+ tests

### Component Tests
- **File**: `tests/components/calculator/JobProfitLossScorecard.test.tsx`
- **Coverage**: >90% for component
- **Count**: 26+ tests

### Integration Tests
- **Method**: Manual E2E testing in Task 8
- **Scenarios**: 5 test scenarios covering all grade levels

### Accessibility Tests
- **Tool**: jest-axe
- **Standard**: WCAG 2.1 AA
- **Coverage**: All interactive elements

**Total Test Count**: 46+ automated tests + 5 manual scenarios

---

## Implementation Sequence

```
Day 1 (4 hours):
├─ Task 1: TypeScript types (1h) ✓
├─ Task 2: Icelandic constants (1h) ✓
└─ Task 3 + 4: Calculation logic + tests (2h) ✓

Day 2 (5 hours):
├─ Task 5: Component shell (2h) ✓
└─ Task 6: Sub-sections (2.5h) ✓
└─ Task 7: Component tests (1.5h) ✓ (start)

Day 3 (3 hours):
├─ Task 7: Component tests (finish) ✓
└─ Task 8: Integration + QA (2-3h) ✓
```

**Total Time**: 12-14 hours across 3 days (or 2 days if full-time focus)

---

## Dependencies Graph

```
Task 1 (Types)
  ↓
Task 3 (Calculation Logic) → Task 4 (Calc Tests)
  ↓                              ↓
Task 2 (Constants) ──────────────┘
  ↓
Task 5 (Component Shell)
  ↓
Task 6 (Sub-Sections)
  ↓
Task 7 (Component Tests)
  ↓
Task 8 (Integration & QA)
```

**Critical Path**: 1 → 3 → 5 → 6 → 8 (10 hours minimum)

**Parallel Work Possible**:
- Task 2 can be done alongside Task 3
- Task 4 can be written alongside Task 3

---

## Risk Assessment

### Low Risk
- ✓ Using existing calculation engine (no new math)
- ✓ Using existing component patterns (familiar)
- ✓ Clear requirements and design

### Medium Risk
- ⚠️ Icelandic translations accuracy (Task 2)
  - **Mitigation**: Review with native speaker if available
- ⚠️ Grade threshold calibration (Task 3)
  - **Mitigation**: Based on "Your Money or Your Life" research

### No High Risks Identified

---

## Success Criteria (All Tasks Complete)

### Functionality
- [ ] All 5 profitability grades (A-F) display correctly
- [ ] Net life energy calculations accurate
- [ ] Income and time breakdowns match calculator
- [ ] Plain language summaries appropriate for each grade
- [ ] Component updates in real-time

### Quality
- [ ] 100% test coverage on calculation logic
- [ ] >90% test coverage on component
- [ ] Zero TypeScript errors
- [ ] Zero console warnings
- [ ] No accessibility violations

### Integration
- [ ] Seamless integration with CalculatorContext
- [ ] Works with existing export/import
- [ ] No performance degradation
- [ ] Responsive on all screen sizes

### Documentation
- [ ] Module documentation complete
- [ ] Implementation status updated
- [ ] All code comments in English
- [ ] All user-facing text in Icelandic

---

## Post-Implementation

### Optional Future Tasks (Not in Scope)
These are potential enhancements but NOT required for completion:

1. **Collapsible Sections**: Allow users to expand/collapse breakdown sections
2. **Grade History**: Track grade changes over time
3. **Comparison Mode**: Compare profitability of multiple jobs
4. **Print View**: CSS for print-friendly scorecard
5. **Tooltips**: Add explanatory tooltips on hover

### Monitoring After Launch
- User engagement with scorecard
- Distribution of grades (are most users B/C as expected?)
- Feedback on Icelandic text quality
- Performance metrics (render time)

---

## Traceability to Requirements

| Requirement | Implemented In | Tested In |
|-------------|---------------|-----------|
| US-1: Net Life Energy | Task 6 (Section 2) | Task 7 |
| US-2: Profitability Grade | Task 3, 6 (Section 1) | Task 4, 7 |
| US-3: Comprehensive Breakdown | Task 6 (Sections 3, 4) | Task 7 |
| US-4: Plain Language Summary | Task 6 (Section 5) | Task 7 |
| US-5: Benchmarks | Task 6 (grade thresholds) | Task 7 |
| US-6: Export | Task 8 (verify existing export) | Task 8 |
| FR-1: Net Life Energy Calc | Task 3 | Task 4 |
| FR-2: Grading System | Task 3 | Task 4 |
| FR-3: Display Components | Task 6 | Task 7 |
| FR-4: Color Coding | Task 6 | Task 7 |
| FR-5: Life Energy Conversion | Task 6 (reuse existing) | Task 7 |
| FR-6: Icelandic | Task 2 | Task 7 |
| NFR-1: Performance | Task 5 (useMemo) | Task 8 |
| NFR-2: Usability | Task 6 | Task 8 |
| NFR-3: Accessibility | Task 6, 7 | Task 7 |
| NFR-4: Responsive | Task 6 | Task 8 |
| NFR-5: Privacy | Architecture (no changes) | Task 8 |
| NFR-6: Integration | Task 5, 8 | Task 8 |

**Coverage**: 100% of requirements traced to implementation and testing.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Claude | Initial task breakdown |

---

**Status**: Tasks Complete - Ready for Implementation

**Next Step**: Begin Task 1 (TypeScript Types)
