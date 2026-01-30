# Baseline Comparison Components

## Location
- `apps/peninganaedalifid/src/components/currentExpenses/BaselineComparisonView.tsx`
- `apps/peninganaedalifid/src/components/currentExpenses/TierMatchIndicator.tsx`
- `apps/peninganaedalifid/src/components/currentExpenses/CategoryComparisonTable.tsx`
- `apps/peninganaedalifid/src/components/currentExpenses/OverspendingHighlights.tsx`

## Purpose
Provides UI components for displaying baseline comparison data in the Current Expense Report feature. These components show how a user's actual expenses compare to their planned expense baseline across three tiers (Barebones/Comfortable/Deluxe).

## Exports

### BaselineComparisonView
Main container component that orchestrates all comparison displays.

**Props**: `BaselineComparisonViewProps`
- `baselineComparison: BaselineComparisonData | null` - Comparison data or null if no baseline exists

**Behavior**:
- Shows empty state with link to expense baseline tool if no comparison data
- Renders TierMatchIndicator showing closest tier match
- Renders OverspendingHighlights for categories over budget
- Renders CategoryComparisonTable with detailed breakdown

### TierMatchIndicator
Visual display of which spending tier matches the user's current expenses.

**Props**: `TierMatchIndicatorProps`
- `baselineComparison: BaselineComparisonData` - Comparison data with tier info

**Features**:
- Three tier buttons (Lágmark/Þægilegt/Lúxus) with icons
- Highlights closest matching tier with visual emphasis
- Shows current total vs tier total comparison
- Displays difference (positive or negative) with percentage
- Interpretation messages for significant differences (>10%)
- Color-coded tier cards (amber, blue, purple)

### CategoryComparisonTable
Detailed table comparing each expense category.

**Props**: `CategoryComparisonTableProps`
- `baselineComparison: BaselineComparisonData` - Comparison data with categories

**Features**:
- Table columns: Category | Current | Baseline | Difference | Status
- Status badges: Over (red), Under (green), Match (neutral)
- Color-coded rows based on status
- Sorted by absolute difference (largest first)
- Shows percentage differences
- Summary footer with counts per status
- Responsive table layout

### OverspendingHighlights
Alert-style warnings for categories exceeding budget.

**Props**: `OverspendingHighlightsProps`
- `baselineComparison: BaselineComparisonData` - Comparison data

**Features**:
- Success message when all categories within budget
- Warning alert when categories are over budget
- Shows total overspending amount
- Lists top 3 overspending categories
- Sorted by highest overspending first
- Context-specific suggestions based on category type
- Links to relevant calculators (subscriptions, commute, housing)
- General actionable suggestions

## Key Functionality

### Tier Matching Logic
- Compares current total to all three tier totals
- Identifies closest tier by smallest absolute difference
- Calculates percentage difference for interpretation
- Shows visual feedback with color-coded displays

### Category Status Classification
- **Over**: Current > Baseline AND difference > 10%
- **Under**: Current < Baseline AND difference > 10%
- **Match**: Absolute difference <= 10%

### Smart Suggestions
Provides targeted recommendations based on:
- **Subscriptions (askriftir)**: Links to Subscription Burn Meter
- **Transport (samgongur)**: Links to Commute Calculator
- **Housing (husnaedi)**: Links to Housing Calculator
- **General**: Line item review, trend analysis, baseline updates

## Dependencies
- `@/types/currentExpenses` - BaselineComparisonData, CategoryComparison types
- `@/types/expenseBaseline` - ExpenseTier type
- `@/components/ui/Card` - Card, CardHeader, CardContent
- `@/components/ui/Alert` - Alert component for warnings
- `@/lib/utils/formatting` - formatCurrency helper
- `@/lib/utils` - cn utility for className merging

## Tests
- **Location**: apps/peninganaedalifid/tests/components/currentExpenses/
- **Files**:
  - BaselineComparisonView.test.tsx (6 tests)
  - TierMatchIndicator.test.tsx (15 tests)
  - CategoryComparisonTable.test.tsx (12 tests)
  - OverspendingHighlights.test.tsx (13 tests)
- **Coverage**: Component rendering, tier highlighting, sorting, status badges, suggestions, empty states

## Integration
- Used by: Current Expense Report feature main page
- Uses: Baseline comparison data from `compareToBaseline()` function
- Part of: Epic 5 - Baseline Comparison View

## UI/UX Design

### Color Scheme
**Tier Colors**:
- Barebones: Amber (bg-amber-50, border-amber-200)
- Comfortable: Blue (bg-blue-50, border-blue-200)
- Deluxe: Purple (bg-purple-50, border-purple-200)

**Status Colors**:
- Over: Danger/Red (bg-danger-50, text-danger-800)
- Under: Success/Green (bg-success-50, text-success-800)
- Match: Neutral/Gray (bg-neutral-50, text-neutral-800)

### Icelandic Text
All UI text is in Icelandic:
- "Samanburður við útgjaldaáætlun" - Comparison to expense plan
- "Núverandi útgjöld" - Current expenses
- "Yfir áætlun" - Over budget
- "Undir áætlun" - Under budget
- "Passes" - Matches
- "Tillögur" - Suggestions

### Responsive Design
- Grid layout for tier buttons (3 columns)
- Responsive table with horizontal scroll on mobile
- Card-based layout for easy scanning
- Alert components for important warnings

## Related
- Implements: Requirements REQ-5.x from specs/current-expense-report/current-expense-report-requirements.md
- Part of: specs/current-expense-report/current-expense-report-design.md Epic 5
- Uses data from: context/modules/CurrentExpenseCalculations.md (compareToBaseline function)
