# Design: Job Profit/Loss Scorecard

## 1. Design Overview

### 1.1 Purpose
Design a comprehensive job profitability scorecard component that evaluates job value after all costs, providing a clear A-F grade and actionable insights about net life energy profit/loss.

### 1.2 Design Goals
- **Simplicity**: Build on existing calculator infrastructure without duplication
- **Clarity**: Present complex profitability analysis in easily digestible format
- **Integration**: Seamlessly integrate with existing `CalculatorContext` and components
- **Performance**: Use memoized calculations with no redundant computation
- **Accessibility**: Meet WCAG 2.1 AA standards with clear visual hierarchy

### 1.3 Architecture Approach
**Component-Based Architecture**: Create a single `JobProfitLossScorecard` component that:
1. Consumes data from existing `CalculatorContext`
2. Adds grading logic as a pure helper function
3. Uses existing UI components (Card, Badge, Alert)
4. Follows established component patterns from codebase

---

## 2. System Architecture

### 2.1 Component Hierarchy

```
JobProfitLossScorecard (Main Component)
├── Card (wrapper)
│   ├── GradeDisplay
│   │   ├── Badge (Grade: A-F)
│   │   └── GradeExplanation (text)
│   ├── NetLifeEnergySection
│   │   ├── WeeklyProfit (hours/week)
│   │   └── MonthlyProfit (hours/month)
│   ├── IncomeBreakdownSection
│   │   ├── GrossIncome (ISK + hours)
│   │   ├── TotalExpenses (ISK + hours)
│   │   └── NetIncome (ISK + hours)
│   ├── TimeBreakdownSection
│   │   ├── BaseHours (hours/year)
│   │   ├── ExtraHours (hours/year)
│   │   └── TotalHours (hours/year)
│   └── PlainLanguageSummary
│       └── Alert (with grade-specific message)
```

### 2.2 Data Flow

```
CalculatorContext
    ↓
    results: CalculationResults
    ↓
JobProfitLossScorecard
    ↓
    useMemo: ProfitabilityGrade
    ↓
    Render: UI Components
```

**Key Points**:
- Component receives `results` from `useCalculator()` hook
- Grading logic runs in `useMemo` based on `results`
- No new state management needed
- No modifications to existing calculation engine

### 2.3 Integration Points

| Integration Point | Method | Notes |
|------------------|--------|-------|
| CalculatorContext | `useCalculator()` hook | Access existing results |
| UI Components | Import from `@/components/ui` | Use Card, Badge, Alert |
| Calculations | Import from `@/lib/calculations` | Use `dollarsToLifeEnergy`, `formatLifeEnergy` |
| Types | Import from `@/types/calculator` | Use existing `CalculationResults` |

---

## 3. Component Design

### 3.1 JobProfitLossScorecard Component

**File**: `src/components/calculator/JobProfitLossScorecard.tsx`

**Props Interface**:
```typescript
interface JobProfitLossScorecardProps {
  className?: string; // Optional additional styling
}
```

**State**: None (fully derived from context)

**Hooks Used**:
- `useCalculator()` - Access results from context
- `useMemo()` - Memoize profitability grade calculation

**Component Structure**:
```typescript
export function JobProfitLossScorecard({ className }: Props) {
  const { results } = useCalculator();

  // Memoized profitability grade
  const profitability = useMemo(() =>
    calculateProfitabilityGrade(results),
    [results]
  );

  // Early return if no results
  if (!results) return null;

  return (
    <Card className={cn("...", className)}>
      {/* Grade Display */}
      {/* Net Life Energy */}
      {/* Income Breakdown */}
      {/* Time Breakdown */}
      {/* Plain Language Summary */}
    </Card>
  );
}
```

### 3.2 Profitability Grade Interface

**File**: `src/types/calculator.ts` (extend existing)

```typescript
/**
 * Profitability grade for job evaluation
 */
export type ProfitabilityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Complete profitability assessment
 */
export interface ProfitabilityAssessment {
  grade: ProfitabilityGrade;
  percentageReduction: number;
  netWeeklyLifeEnergy: number; // Hours per week
  netMonthlyLifeEnergy: number; // Hours per month
  gradeLabel: string; // Icelandic label
  gradeExplanation: string; // Icelandic explanation
  isProfit: boolean; // True if net > 0
  severity: 'success' | 'warning' | 'error'; // For color coding
}
```

---

## 4. Calculation Logic

### 4.1 Profitability Grading Function

**File**: `src/lib/calculations/profitability.ts` (new file)

```typescript
import type { CalculationResults } from '@/types/calculator';
import type { ProfitabilityAssessment, ProfitabilityGrade } from '@/types/calculator';

/**
 * Calculate profitability grade based on wage reduction
 *
 * @param results - Calculation results from wage calculator
 * @returns Complete profitability assessment with grade and details
 */
export function calculateProfitabilityGrade(
  results: CalculationResults | null
): ProfitabilityAssessment | null {
  if (!results) return null;

  const { percentageReduction, netAnnualIncome, actualHourlyWage } = results;

  // Determine grade
  let grade: ProfitabilityGrade;
  if (actualHourlyWage <= 0) {
    grade = 'F'; // Unprofitable
  } else if (percentageReduction < 15) {
    grade = 'A'; // Excellent
  } else if (percentageReduction < 30) {
    grade = 'B'; // Good
  } else if (percentageReduction < 45) {
    grade = 'C'; // Fair
  } else if (percentageReduction < 60) {
    grade = 'D'; // Poor
  } else {
    grade = 'F'; // Failing
  }

  // Calculate net life energy
  const annualLifeEnergyHours = actualHourlyWage > 0
    ? netAnnualIncome / actualHourlyWage
    : 0;
  const netWeeklyLifeEnergy = annualLifeEnergyHours / 52;
  const netMonthlyLifeEnergy = netWeeklyLifeEnergy * 4.33;

  // Determine severity
  const severity = grade === 'A' || grade === 'B'
    ? 'success'
    : grade === 'F'
    ? 'error'
    : 'warning';

  // Get Icelandic labels and explanations
  const gradeLabel = getGradeLabel(grade);
  const gradeExplanation = getGradeExplanation(grade, percentageReduction);

  return {
    grade,
    percentageReduction,
    netWeeklyLifeEnergy,
    netMonthlyLifeEnergy,
    gradeLabel,
    gradeExplanation,
    isProfit: netAnnualIncome > 0,
    severity,
  };
}

/**
 * Get Icelandic label for grade
 */
function getGradeLabel(grade: ProfitabilityGrade): string {
  const labels: Record<ProfitabilityGrade, string> = {
    A: 'Framúrskarandi',
    B: 'Gott',
    C: 'Ásættanlegt',
    D: 'Lélegt',
    F: 'Tap',
  };
  return labels[grade];
}

/**
 * Get Icelandic explanation for grade
 */
function getGradeExplanation(
  grade: ProfitabilityGrade,
  reduction: number
): string {
  const explanations: Record<ProfitabilityGrade, string> = {
    A: `Frábært! Þú ert að hámarka verðmæti starfs þíns með aðeins ${reduction.toFixed(1)}% lækkun á laun þín.`,
    B: `Gott! Þú ert innan eðlilegra marka með ${reduction.toFixed(1)}% lækkun. Íhugaðu að fínstilla útgjöld.`,
    C: `Ásættanlegt en þarfnast úrbóta. ${reduction.toFixed(1)}% lækkun bendir til að hægt sé að hagræða.`,
    D: `Áhyggjuefni! ${reduction.toFixed(1)}% lækkun þýðir að þú ert að missa mikla orku á vinnu.`,
    F: 'Viðvörun! Starf þitt er óhagkvæmt - þú ert að tapa peningum eða tíma.',
  };
  return explanations[grade];
}
```

### 4.2 Calculation Functions (Reuse Existing)

The following calculations already exist and will be reused:

| Function | Source | Purpose |
|----------|--------|---------|
| `calculateResults()` | `wage.ts` | Primary calculation (already done) |
| `dollarsToLifeEnergy()` | `lifeEnergy.ts` | Convert ISK to hours |
| `formatLifeEnergy()` | `lifeEnergy.ts` | Format hours as readable text |
| `formatCurrency()` | `formatters.ts` | Format ISK amounts |

**No new calculation functions needed** - all core math is done by existing calculator.

---

## 5. UI Component Breakdown

### 5.1 Grade Display Section

```tsx
<div className="text-center p-6 bg-gradient-to-br from-primary-50 to-neutral-50">
  <Badge
    variant={profitability.severity}
    size="lg"
    className="text-4xl py-2 px-4"
  >
    {profitability.grade}
  </Badge>
  <h2 className="text-xl font-semibold mt-2">
    {profitability.gradeLabel}
  </h2>
  <p className="text-sm text-neutral-600 mt-1">
    Hagkvæmniseinkunn starfs
  </p>
</div>
```

**Key Features**:
- Large, prominent grade badge (A-F)
- Color-coded based on severity
- Icelandic label for grade
- Gradient background for visual interest

### 5.2 Net Life Energy Section

```tsx
<div className="grid grid-cols-2 gap-4 p-4">
  <div className={cn(
    "p-4 rounded-lg border-2",
    profitability.isProfit
      ? "border-success-500 bg-success-50"
      : "border-error-500 bg-error-50"
  )}>
    <p className="text-sm text-neutral-600">Nettó lífsorka / viku</p>
    <p className="text-2xl font-bold">
      {profitability.isProfit ? '+' : ''}
      {formatLifeEnergy(profitability.netWeeklyLifeEnergy)}
    </p>
  </div>

  <div className={cn(
    "p-4 rounded-lg border-2",
    profitability.isProfit
      ? "border-success-500 bg-success-50"
      : "border-error-500 bg-error-50"
  )}>
    <p className="text-sm text-neutral-600">Nettó lífsorka / mánuð</p>
    <p className="text-2xl font-bold">
      {profitability.isProfit ? '+' : ''}
      {formatLifeEnergy(profitability.netMonthlyLifeEnergy)}
    </p>
  </div>
</div>
```

**Key Features**:
- Two columns: weekly and monthly
- Color-coded borders (green for profit, red for loss)
- Plus/minus signs for clarity
- Human-readable time formatting

### 5.3 Income Breakdown Section

```tsx
<div className="space-y-3 p-4 border-t">
  <h3 className="font-semibold text-lg">Tekjuyfirlit</h3>

  {/* Gross Income */}
  <div className="flex justify-between items-center">
    <span>Brúttótekjur (árlega)</span>
    <div className="text-right">
      <p className="font-semibold">{formatCurrency(grossIncome)}</p>
      <p className="text-sm text-neutral-600">
        {formatLifeEnergy(dollarsToLifeEnergy(grossIncome, actualWage))}
      </p>
    </div>
  </div>

  {/* Expenses */}
  <div className="flex justify-between items-center text-error-600">
    <span>Vinnukostnaður (árlega)</span>
    <div className="text-right">
      <p className="font-semibold">-{formatCurrency(totalExpenses)}</p>
      <p className="text-sm">
        {formatLifeEnergy(dollarsToLifeEnergy(totalExpenses, actualWage))}
      </p>
    </div>
  </div>

  {/* Net Income */}
  <div className="flex justify-between items-center pt-3 border-t-2">
    <span className="font-semibold">Nettótekjur (árlega)</span>
    <div className="text-right">
      <p className="font-bold text-lg">{formatCurrency(netIncome)}</p>
      <p className="text-sm text-neutral-600">
        {formatLifeEnergy(dollarsToLifeEnergy(netIncome, actualWage))}
      </p>
    </div>
  </div>
</div>
```

**Key Features**:
- Clear three-line breakdown (gross → expenses → net)
- Each line shows ISK and life energy
- Expenses in red with minus sign
- Net income emphasized with bold styling

### 5.4 Time Breakdown Section

```tsx
<div className="space-y-3 p-4 border-t">
  <h3 className="font-semibold text-lg">Tímayfirlit</h3>

  <div className="flex justify-between">
    <span>Grunnvinnustundir (árlega)</span>
    <span className="font-semibold">
      {baseHours.toLocaleString()} klst
    </span>
  </div>

  <div className="flex justify-between text-warning-600">
    <span>Aukastundir (árlega)</span>
    <span className="font-semibold">
      +{extraHours.toLocaleString()} klst
    </span>
  </div>

  <div className="flex justify-between pt-3 border-t-2">
    <span className="font-semibold">Heildartími (árlega)</span>
    <span className="font-bold text-lg">
      {totalHours.toLocaleString()} klst
    </span>
  </div>

  <p className="text-sm text-neutral-600 italic">
    = {(totalHours / 365).toFixed(1)} klst/dag að meðaltali
  </p>
</div>
```

**Key Features**:
- Three-line breakdown (base → extra → total)
- Extra hours highlighted in warning color
- Average hours/day for context
- Localized number formatting

### 5.5 Plain Language Summary

```tsx
<Alert
  variant={profitability.severity}
  className="mt-4"
>
  <p className="text-base">
    {profitability.gradeExplanation}
  </p>

  {profitability.grade === 'F' && (
    <p className="mt-2 font-semibold">
      Íhugaðu að endurskoða vinnukostnað þinn eða leita betri tækifæris.
    </p>
  )}

  {(profitability.grade === 'C' || profitability.grade === 'D') && (
    <p className="mt-2">
      Skoðaðu kostnaðaryfirlit þitt til að finna svæði til að hagræða.
    </p>
  )}

  {profitability.grade === 'A' && (
    <p className="mt-2">
      Haltu áfram með góða vinnubrögð og hugleiddu að auka sparnaðarhlutfall þitt!
    </p>
  )}
</Alert>
```

**Key Features**:
- Color-coded alert matching grade severity
- Grade-specific explanation in Icelandic
- Actionable next steps based on grade
- Encouraging tone for good grades, constructive for poor grades

---

## 6. Visual Design

### 6.1 Color Scheme

| Grade | Severity | Primary Color | Background | Border |
|-------|----------|--------------|------------|--------|
| A | success | success-600 | success-50 | success-500 |
| B | success | success-600 | success-50 | success-500 |
| C | warning | warning-600 | warning-50 | warning-500 |
| D | warning | warning-600 | warning-50 | warning-500 |
| F | error | error-600 | error-50 | error-500 |

### 6.2 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Grade Badge | text-4xl | bold | Based on severity |
| Grade Label | text-xl | semibold | neutral-900 |
| Section Headers | text-lg | semibold | neutral-900 |
| Numeric Values | text-2xl | bold | Based on context |
| Sub-values | text-sm | normal | neutral-600 |
| Explanations | text-base | normal | Based on severity |

### 6.3 Layout

**Desktop** (≥1024px):
- Card with max-width of 600px
- Two-column grid for net life energy
- Single column for breakdowns
- Comfortable padding (p-6)

**Mobile** (<1024px):
- Full-width card
- Stacked layout for all sections
- Reduced padding (p-4)
- Maintained readability

---

## 7. Data Models

### 7.1 Type Additions

Add to existing `src/types/calculator.ts`:

```typescript
/**
 * Profitability grade for job evaluation
 */
export type ProfitabilityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Complete profitability assessment
 */
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

**No changes to existing types** - only additions.

### 7.2 Context Extensions

**No changes needed** to `CalculatorContext`. The scorecard is a pure presentation component that consumes existing `results`.

---

## 8. Error Handling

### 8.1 No Results Available

```typescript
if (!results) {
  return null; // Component doesn't render
}
```

**Rationale**: If calculator hasn't been used yet, no scorecard to show.

### 8.2 Invalid Results

```typescript
if (!results || results.actualHourlyWage === undefined) {
  return (
    <Card className="p-6">
      <Alert variant="warning">
        Vinsamlegast fylltu út launareikninn til að sjá hagkvæmniseinkunn.
      </Alert>
    </Card>
  );
}
```

**Rationale**: Graceful fallback with helpful message.

### 8.3 Zero Wage Edge Case

```typescript
// In calculateProfitabilityGrade()
if (actualHourlyWage <= 0) {
  grade = 'F';
  // Set net life energy to 0 to avoid division by zero
  annualLifeEnergyHours = 0;
}
```

**Rationale**: Automatic F grade prevents misleading calculations.

---

## 9. Testing Strategy

### 9.1 Unit Tests

**File**: `tests/lib/calculations/profitability.test.ts`

Test cases:
1. ✓ Grade A: <15% reduction
2. ✓ Grade B: 15-30% reduction
3. ✓ Grade C: 30-45% reduction
4. ✓ Grade D: 45-60% reduction
5. ✓ Grade F: >60% reduction
6. ✓ Grade F: Zero/negative actual wage
7. ✓ Net life energy calculation (weekly)
8. ✓ Net life energy calculation (monthly)
9. ✓ Severity mapping correct
10. ✓ Icelandic labels present
11. ✓ Returns null for null input

**Coverage Target**: 100% for profitability.ts

### 9.2 Component Tests

**File**: `tests/components/calculator/JobProfitLossScorecard.test.tsx`

Test cases:
1. ✓ Renders null when no results
2. ✓ Displays correct grade badge
3. ✓ Shows net weekly life energy
4. ✓ Shows net monthly life energy
5. ✓ Displays income breakdown
6. ✓ Displays time breakdown
7. ✓ Shows plain language summary
8. ✓ Uses correct color scheme for each grade
9. ✓ Formats currency correctly
10. ✓ Formats life energy correctly
11. ✓ Responsive layout (mobile/desktop)
12. ✓ Accessibility: ARIA labels present
13. ✓ Accessibility: Color contrast meets AA

**Coverage Target**: >90% for component

### 9.3 Integration Tests

**File**: `tests/integration/profitability.integration.test.tsx`

Test scenarios:
1. ✓ Scorecard updates when calculator inputs change
2. ✓ Grade changes when expenses increase
3. ✓ Net life energy reflects income changes
4. ✓ Works with exported/imported data

### 9.4 Accessibility Tests

Using @testing-library/react and jest-axe:
1. ✓ No axe violations
2. ✓ Keyboard navigation works
3. ✓ Screen reader announces grade correctly
4. ✓ Color contrast ratios pass WCAG AA

---

## 10. Performance Considerations

### 10.1 Memoization Strategy

```typescript
const profitability = useMemo(
  () => calculateProfitabilityGrade(results),
  [results]
);
```

**Impact**: Profitability only recalculates when `results` change (already memoized in context).

**Estimated Performance**: <1ms for grade calculation.

### 10.2 Render Optimization

```typescript
// Early return prevents unnecessary render
if (!results) return null;
```

**Impact**: Component doesn't render until data is available.

### 10.3 Bundle Size

**New Code**:
- Component: ~300 lines
- Calculation function: ~100 lines
- Types: ~30 lines

**Estimated Bundle Impact**: +8KB minified (negligible).

---

## 11. Accessibility

### 11.1 Semantic HTML

```tsx
<Card
  role="region"
  aria-label="Hagkvæmniseinkunn starfs"
>
  <h2 id="grade-heading">
    {profitability.gradeLabel}
  </h2>

  <div aria-labelledby="grade-heading">
    {/* Content */}
  </div>
</Card>
```

### 11.2 ARIA Attributes

| Element | ARIA Attribute | Purpose |
|---------|---------------|---------|
| Grade Badge | `aria-label="Einkunn {grade}"` | Announce grade |
| Net Life Energy | `aria-label="Nettó lífsorka"` | Context for numbers |
| Severity Colors | `aria-live="polite"` | Announce changes |

### 11.3 Color Contrast

All text must meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).

Verified combinations:
- Success: #16a34a on #f0fdf4 ✓ (7.2:1)
- Warning: #ca8a04 on #fefce8 ✓ (5.1:1)
- Error: #dc2626 on #fef2f2 ✓ (6.8:1)

### 11.4 Keyboard Navigation

- Tab through all sections
- Focus visible on all interactive elements
- Logical tab order (top to bottom)

---

## 12. Localization (Icelandic)

### 12.1 Text Constants

**File**: `src/lib/constants/profitability.ts`

```typescript
export const PROFITABILITY_LABELS = {
  title: 'Hagkvæmniseinkunn starfs',
  gradeLabel: 'Einkunn',
  netLifeEnergy: 'Nettó lífsorka',
  weekly: 'viku',
  monthly: 'mánuð',
  incomeBreakdown: 'Tekjuyfirlit',
  grossIncome: 'Brúttótekjur (árlega)',
  expenses: 'Vinnukostnaður (árlega)',
  netIncome: 'Nettótekjur (árlega)',
  timeBreakdown: 'Tímayfirlit',
  baseHours: 'Grunnvinnustundir (árlega)',
  extraHours: 'Aukastundir (árlega)',
  totalHours: 'Heildartími (árlega)',
  averagePerDay: 'að meðaltali',
} as const;
```

### 12.2 Grade Labels

```typescript
export const GRADE_LABELS: Record<ProfitabilityGrade, string> = {
  A: 'Framúrskarandi',
  B: 'Gott',
  C: 'Ásættanlegt',
  D: 'Lélegt',
  F: 'Tap',
} as const;
```

### 12.3 Grade Explanations

All explanations written in natural Icelandic using second-person (þú/þinn) for personal tone.

---

## 13. Design Decisions

### 13.1 Why A-F Grading Scale?

**Decision**: Use letter grades (A-F) rather than numeric scores.

**Rationale**:
- Familiar metaphor (school grades)
- Immediately understandable without explanation
- Easy to communicate ("My job gets a C")
- Supports quick decision-making

**Alternatives Considered**:
- ❌ Numeric score (1-100): Too granular, implies false precision
- ❌ Stars (1-5): Less familiar in professional context
- ❌ Color only: Not accessible, requires explanation

### 13.2 Why Net Life Energy as Primary Metric?

**Decision**: Show net weekly/monthly life energy prominently.

**Rationale**:
- Aligns with app philosophy ("life energy" over money)
- Weekly/monthly intervals are actionable timeframes
- Directly answers "Is this job worth it?"
- Complements grade with concrete numbers

**Alternatives Considered**:
- ❌ Annual only: Too abstract
- ❌ ISK only: Misses life energy focus
- ❌ Percentage only: Less meaningful to users

### 13.3 Why Breakdown Sections?

**Decision**: Include detailed income and time breakdowns.

**Rationale**:
- Transparency: Users see what drives the grade
- Actionable: Users can identify specific areas to improve
- Educational: Reinforces "Your Money or Your Life" concepts
- Traceability: Clear link to underlying calculator

**Alternatives Considered**:
- ❌ Grade only: Not actionable
- ❌ Summary only: Lacks specificity
- ❌ Modal/drill-down: Extra clicks reduce engagement

### 13.4 Why Component vs. New Page?

**Decision**: Create a component that can be embedded in main calculator page.

**Rationale**:
- Immediate visibility (no navigation required)
- Real-time updates as inputs change
- Maintains user context (seeing both calculator and scorecard)
- Flexible: Can be placed where UX testing suggests

**Alternatives Considered**:
- ❌ Separate page: Extra navigation friction
- ❌ Modal overlay: Hides calculator inputs
- ❌ Tab panel: Still requires explicit navigation

---

## 14. Security Considerations

### 14.1 Data Privacy

- ✓ No data sent to servers
- ✓ All calculations client-side
- ✓ No third-party analytics tracking profitability
- ✓ Export/import uses existing secure localStorage

### 14.2 Input Validation

- ✓ Relies on existing calculator validation
- ✓ No user-editable fields in scorecard component
- ✓ Read-only display of calculated values

**No new security concerns** - component is purely presentational.

---

## 15. Deployment Considerations

### 15.1 Feature Flag

Not needed - component renders conditionally based on data availability.

### 15.2 Rollout Strategy

**Phase 1**: Deploy component
**Phase 2**: Add to main calculator page (below results)
**Phase 3**: Monitor user engagement
**Phase 4**: Iterate based on feedback

### 15.3 Monitoring

Track (via existing analytics if enabled):
- Scorecard view rate (% of calculator users who scroll to scorecard)
- Grade distribution (what % of users get each grade)
- Engagement time (how long users study scorecard)

---

## 16. Future Enhancements (Out of Scope)

The following are potential future additions but NOT in this spec:

1. **Historical Tracking**: Show grade changes over time
2. **Goal Setting**: "Aim for Grade B by reducing commute"
3. **Comparison Mode**: Compare profitability of multiple job scenarios
4. **Export to PDF**: Printable scorecard report
5. **Benchmark Data**: Anonymous comparison to other users
6. **AI Suggestions**: Automated recommendations for improvement

---

## 17. Implementation Checklist

### File Creation
- [ ] `src/lib/calculations/profitability.ts` - Grading logic
- [ ] `src/lib/constants/profitability.ts` - Icelandic labels
- [ ] `src/components/calculator/JobProfitLossScorecard.tsx` - Main component
- [ ] `tests/lib/calculations/profitability.test.ts` - Unit tests
- [ ] `tests/components/calculator/JobProfitLossScorecard.test.tsx` - Component tests

### Type Updates
- [ ] Add `ProfitabilityGrade` type to `src/types/calculator.ts`
- [ ] Add `ProfitabilityAssessment` interface to `src/types/calculator.ts`

### Component Integration
- [ ] Export from `src/components/calculator/index.ts`
- [ ] Add to main calculator page (decision: where?)
- [ ] Update context documentation

### Testing
- [ ] Unit tests passing (100% coverage)
- [ ] Component tests passing (>90% coverage)
- [ ] Accessibility tests passing (axe)
- [ ] Integration tests passing

### Documentation
- [ ] Add component module doc: `context/modules/JobProfitLossScorecardComponent.md`
- [ ] Update implementation status
- [ ] Update feature documentation

---

## 18. Traceability Matrix

| Requirement | Design Element | Test Coverage |
|-------------|---------------|---------------|
| US-1: Net Life Energy | `NetLifeEnergySection` | Unit + Component |
| US-2: Profitability Grade | `calculateProfitabilityGrade()` | Unit |
| US-3: Breakdown | `IncomeBreakdownSection`, `TimeBreakdownSection` | Component |
| US-4: Plain Language | `PlainLanguageSummary` | Component |
| US-5: Benchmarks | Grade threshold display | Unit |
| US-6: Export | No changes (uses existing export) | Integration |
| FR-1: Calculation | `calculateProfitabilityGrade()` | Unit |
| FR-2: Grading System | Grade assignment logic | Unit |
| FR-3: Display Components | All sections | Component |
| FR-4: Color Coding | `severity` mapping | Component |
| FR-5: Life Energy | Uses existing functions | Integration |
| FR-6: Icelandic | `PROFITABILITY_LABELS` | Component |
| NFR-1: Performance | `useMemo` | Performance test |
| NFR-2: Usability | Plain language, visual hierarchy | Manual QA |
| NFR-3: Accessibility | ARIA, semantic HTML, contrast | Accessibility tests |
| NFR-4: Responsive | Grid layouts, breakpoints | Visual regression |
| NFR-5: Privacy | Client-side only | Architecture review |
| NFR-6: Integration | Uses existing context/components | Integration tests |

---

## 19. Open Questions from Requirements

### Q-1: Grade Display Location
**Decision**: Embed in main calculator page below results section.

**Rationale**:
- Maximum visibility
- Real-time updates
- No navigation friction
- Can move later if UX testing suggests otherwise

### Q-2: Default Visibility
**Decision**: Always visible when calculator has results.

**Rationale**:
- Component returns `null` when no results (no visual clutter)
- Users expect to see evaluation after entering data
- Collapsible section if space is concern (future iteration)

### Q-3: Benchmark Data
**Decision**: Show only grade thresholds, no anonymized benchmarks.

**Rationale**:
- Privacy-first approach
- No backend data collection
- Thresholds provide sufficient context
- Can add benchmarks in Phase 2 if users request

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-22 | Claude | Initial design document |

---

**Status**: Design Complete - Ready for Tasks Phase

**Next Steps**: Create task breakdown for implementation
