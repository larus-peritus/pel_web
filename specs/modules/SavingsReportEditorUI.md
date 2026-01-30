# Savings Report Editor UI Components

## Overview
Editor UI components for the Savings Report (Sparnaðarskýrsla) feature. Provides a category-by-category editing interface with input fields for balance, monthly contribution, target amounts, and notes.

## Location
`src/components/savingsReport/`

## Components

### SavingsEditor
**File**: `SavingsEditor.tsx` (166 lines)

**Purpose**: Main container component for editing savings categories

**Features**:
- Tracks expanded/collapsed state per category (useState with Record<string, boolean>)
- Displays category accordions sorted by order
- Expand all / collapse all controls
- Hidden categories section (shows categories where isHidden=true)
- Gets categories from useCalculator() context

**Key Functionality**:
- `handleToggleCategory(categoryId)` - Toggle individual category expansion
- `handleExpandAll()` - Expand all visible categories
- `handleCollapseAll()` - Collapse all categories
- `handleCategoryUpdate()` - Update category data via context
- `handleToggleVisibility()` - Toggle category hidden state

**Dependencies**:
- `@/context/CalculatorContext` - For savings report state
- `@/components/ui/Button` - For action buttons
- `./CategoryAccordion` - For individual category display

### CategoryAccordion
**File**: `CategoryAccordion.tsx` (205 lines)

**Purpose**: Single savings category with expandable details

**Props**:
- `category: SavingsCategory` - The category to display
- `isExpanded: boolean` - Whether accordion is expanded
- `onToggle: () => void` - Toggle expand/collapse
- `actualHourlyWage: number | null` - For life energy calculations
- `onChange: (data: Partial<SavingsCategoryData>) => void` - Update category data
- `onToggleVisibility: () => void` - Toggle hide/show

**Features**:
- Accordion header with icon, name, balance total, expand indicator (chevron)
- Expandable content with input fields
- Uses BalanceInput, ContributionInput, TargetInput, NotesInput
- Hide/show category button with icon

**Key Functionality**:
- Header shows summary when collapsed (balance + contribution)
- Smooth expand/collapse animation with border color transition
- All input fields integrated with onChange callback
- Visual feedback for hidden state (reduced opacity)

### BalanceInput
**File**: `BalanceInput.tsx` (67 lines)

**Purpose**: Currency input for current balance with life energy display

**Props**:
- `value: number` - Current balance in ISK
- `onChange: (value: number) => void` - Callback when balance changes
- `actualHourlyWage: number | null` - For life energy calculation
- `categoryId: string` - For unique input ID

**Features**:
- Uses CurrencyInput component from @/components/ui
- Label: "Núverandi staða"
- Shows life energy in hours when AWH available: "(X klst)"
- Helper text when AWH not available

**Calculations**:
- Life energy hours = balance / actualHourlyWage

### ContributionInput
**File**: `ContributionInput.tsx` (67 lines)

**Purpose**: Currency input for monthly contribution with life energy display

**Props**:
- `value: number` - Monthly contribution in ISK
- `onChange: (value: number) => void` - Callback when contribution changes
- `actualHourlyWage: number | null` - For life energy calculation
- `categoryId: string` - For unique input ID

**Features**:
- Uses CurrencyInput component
- Label: "Mánaðarleg framlög"
- Shows life energy: "(X klst/mán)" when AWH available
- Helper text when AWH not available

**Calculations**:
- Life energy hours per month = monthlyContribution / actualHourlyWage

### TargetInput
**File**: `TargetInput.tsx` (150 lines)

**Purpose**: Optional currency input for target amount with progress display

**Props**:
- `currentBalance: number` - Current balance in ISK
- `value?: number` - Target amount (undefined if not set)
- `onChange: (value: number | undefined) => void` - Callback when target changes
- `actualHourlyWage: number | null` - For life energy calculation
- `categoryId: string` - For unique input ID

**Features**:
- Optional CurrencyInput for target amount
- Label: "Markmið (valfrjálst)"
- Progress bar showing current balance vs target
- Percentage display
- Remaining amount: "Á eftir: X kr (Y klst)"
- Goal reached indicator with success icon

**Calculations**:
- Progress percentage = (currentBalance / target) * 100 (capped at 100%)
- Remaining amount = target - currentBalance
- Remaining life energy = remaining / actualHourlyWage

**Progress Bar Colors**:
- Red (< 50%)
- Amber (50-74%)
- Primary blue (75-99%)
- Green (≥ 100%)

### NotesInput
**File**: `NotesInput.tsx` (61 lines)

**Purpose**: Optional textarea for category notes

**Props**:
- `value?: string` - Notes text
- `onChange: (value: string | undefined) => void` - Callback when notes change
- `categoryId: string` - For unique input ID

**Features**:
- Textarea for notes
- Label: "Athugasemdir (valfrjálst)"
- Placeholder: "Bættu við athugasemdum..."
- Resizable textarea (min-height 80px)
- Helper text with examples

**Key Functionality**:
- Stores undefined if empty, otherwise stores trimmed text
- Accessible with proper labels and aria attributes

## Testing
Component tests to be added in Epic 6 (Task 6.2).

## Integration
All components integrate with CalculatorContext for state management:
- `savingsReport` - Current savings report data
- `updateSavingsCategory()` - Update category data
- `toggleSavingsCategoryVisibility()` - Toggle category visibility
- `results.actualHourlyWage` - For life energy calculations

## Accessibility
All components follow accessibility best practices:
- Proper labels with htmlFor attributes
- ARIA attributes (aria-label, aria-expanded, aria-controls)
- Keyboard navigation support
- Screen reader friendly
- Proper focus indicators

## Icelandic Text
All UI text is in Icelandic:
- "Núverandi staða" - Current balance
- "Mánaðarleg framlög" - Monthly contributions
- "Markmið (valfrjálst)" - Target (optional)
- "Athugasemdir (valfrjálst)" - Notes (optional)
- "Opna alla" - Expand all
- "Loka öllum" - Collapse all
- "Faldir flokkar" - Hidden categories
- "Fela flokk" - Hide category
- "Sýna flokk" - Show category

## Related
- Implements: Requirements US-1, US-2, US-3, US-4, US-7 from specs/savings-report/requirements-savings-report.md
- Part of: Epic 3 from specs/savings-report/tasks-savings-report.md
- Uses types from: context/modules/SavingsReportTypes.md
- Integrates with: context/modules/SavingsReportContext.md
