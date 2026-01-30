# Childcare UI Components

## Overview
Complete UI implementation for the Childcare & Education Cost Calculator, providing an intuitive interface for tracking and analyzing childcare expenses.

## Location
`apps/peninganaedalifid/src/components/childcare/`

## Components

### 1. DaycareSection.tsx
**Purpose**: Leikskóli (daycare) expense input

**Features**:
- Municipal vs private daycare type selector
- Monthly cost input
- Months per year (9-12)
- Number of children
- Add/edit/delete daycare items
- Real-time cost calculation and display

**Exports**: `DaycareSection`

### 2. AfterSchoolSection.tsx
**Purpose**: Frístund (after-school care) expense input

**Features**:
- Monthly cost input
- Months per year (9-12, winter vs full year)
- Number of children
- Add/edit/delete afterschool items
- Automatic naming based on months (winter vs full year)

**Exports**: `AfterSchoolSection`

### 3. ActivitiesSection.tsx
**Purpose**: Tónlistarskóli og tímar (activities, music school, sports) expense input

**Features**:
- Custom activity name input
- Activity type categorization (Tónlist, Íþróttir, Dans, etc.)
- Monthly cost input
- Months per year (1-12)
- Number of children
- Quick presets (Tónlistarskóli, Knattspyrna, Handbolti, Sund, Dans)
- Category badges with color coding
- Add/edit/delete activity items

**Exports**: `ActivitiesSection`

### 4. TutoringSection.tsx
**Purpose**: Einkakennsla (tutoring) expense input

**Features**:
- Subject/topic input
- Hourly rate input
- Hours per month input
- Number of children
- Real-time monthly cost calculation display
- Add/edit/delete tutoring items

**Exports**: `TutoringSection`

### 5. UniversitySavingsSection.tsx
**Purpose**: Háskólasparnaður (university savings planning)

**Features**:
- Current child age input
- University starting age input
- Cost per year input
- Years in university input
- Expected return rate selector (3%, 5%, 7%)
- Future value projection using FV formula
- Monthly payment calculation
- Savings vs no-interest comparison
- Visual projection display

**Exports**: `UniversitySavingsSection`

### 6. CategoryBreakdown.tsx
**Purpose**: Summary and visualization of all childcare expenses

**Features**:
- Total monthly and yearly costs
- Life energy calculation (hours worked)
- Category breakdown with progress bars
- Sorted by cost (highest first)
- Category-specific colors
- Item count per category
- University savings summary (if applicable)
- Insights section with key metrics

**Exports**: `CategoryBreakdown`

### 7. ChildcareCalculator.tsx
**Purpose**: Main container component that orchestrates all childcare sections

**Features**:
- Accordion layout for all sections
- Summary card with quick stats
- Quick add presets for common items
- 2-column layout (sections on left, summary on right)
- Empty state with helpful hints
- Section icons and item counts
- Responsive design (mobile-friendly)
- Sticky summary on desktop

**Exports**: `ChildcareCalculator`

### 8. index.ts
Barrel export file for all childcare components

## Integration

### CalculatorContext
All components use the following context methods:
- `childcareItems` - Array of all childcare items
- `childcareSummary` - Computed summary with totals and breakdowns
- `addChildcareItem` - Add new item
- `updateChildcareItem` - Update existing item
- `deleteChildcareItem` - Delete item
- `results.actualHourlyWage` - For life energy calculations

### Navigation
Added to `CalculatorPageContent.tsx`:
- New calculator in EXPENSE_CALCULATORS array
- ID: `bornauppeldi`
- Name: "Barna- og menntakostnaður"
- Icon: 👶
- Route handler: `ChildcareCalculatorContent`

## UI Patterns

### Form Inputs
- Uses `NumberInput` for numeric values with step controls
- Uses `Select` for predefined options (daycare type, return rate)
- Uses `Input` for text fields (activity names, subjects)
- All inputs have labels, help text, and validation

### Item Display
- Each section shows list of existing items
- Items display: name, cost breakdown, total cost
- Edit/Delete buttons for each item
- Color-coded by category in breakdown view

### Layout
- Card-based design with headers
- Form sections in neutral-50 background
- Summary sections in primary-50 background
- Responsive grid layouts
- Consistent spacing and typography

## Icelandic UI Text
All interface text is in Icelandic:
- Labels: "Leikskóli", "Frístund", "Tónlistarskóli og tímar", etc.
- Buttons: "Bæta við", "Uppfæra", "Hætta við", "Breyta", "Eyða"
- Units: "kr/mán", "kr/ár", "klst", "ár", "mán"
- Help text and descriptions in Icelandic

## Styling
- Tailwind CSS classes throughout
- Primary color for highlights and CTAs
- Neutral colors for backgrounds and text
- Success, warning, danger variants for badges and states
- Consistent border-radius and shadows from design system

## Dependencies
- React hooks (useState)
- UI components: Card, Button, Input, NumberInput, Select, Badge
- Context: CalculatorContext
- Types: ChildcareItem, ChildcareCategory
- Utils: formatCurrency, generateChildcareId, calculateUniversitySavings
- Constants: COMMON_CHILDCARE_ITEMS

## Related Files
- Types: `src/types/childcare.ts`
- Calculations: `src/lib/calculations/childcare.ts`
- Context: `src/context/CalculatorContext.tsx`
- Navigation: `src/components/calculator/CalculatorPageContent.tsx`
