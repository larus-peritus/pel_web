# Quick Edit Mode UI Components

## Overview
Quick Edit Mode components for the Expense Baseline Tool, enabling returning users to quickly modify their expense baseline without going through the wizard flow.

## Components

### QuickEditModeContainer
**Location**: `src/components/expenseBaseline/QuickEditModeContainer.tsx`

**Purpose**: Main container for quick edit mode with tier tab selection

**Features**:
- Three tier tabs (Lágmarks | Þægilegt | Lúxus)
- Active tier state management
- Total display for active tier
- "Start fresh" button to switch to wizard mode
- Responsive layout

**Props**:
```typescript
interface QuickEditModeContainerProps {
  onStartWizard: () => void; // Reset and start wizard
}
```

**Requirements**: FR-5.5, US-1

---

### TierTabSelector
**Location**: `src/components/expenseBaseline/TierTabSelector.tsx`

**Purpose**: Tab selector for switching between the three expense tiers

**Features**:
- Three tabs with tier-specific colors (Amber/Green/Purple)
- Shows monthly total per tier
- Active state indication with visual styling
- ARIA tabs pattern for accessibility
- Mobile-friendly (full width, stacks vertically)

**Props**:
```typescript
interface TierTabSelectorProps {
  activeTier: ExpenseTier;
  onSelectTier: (tier: ExpenseTier) => void;
}
```

**Integration**:
- Uses `expenseBaselineResults` from `useCalculator()` hook
- Uses `TIER_LABELS` and `TIER_COLORS` from constants

**Requirements**: NFR-2 (visual distinction)

---

### CategoryEditList
**Location**: `src/components/expenseBaseline/CategoryEditList.tsx`

**Purpose**: List of editable category rows for the selected tier

**Features**:
- Maps over visible categories (sorted by order)
- Renders CategoryEditRow for each category
- Add custom category button
- Show/hide hidden categories section (collapsible)
- Proper ordering of categories

**Props**:
```typescript
interface CategoryEditListProps {
  activeTier: ExpenseTier;
}
```

**State**:
- `isAddModalOpen`: Controls AddCustomCategoryModal visibility
- `showHiddenCategories`: Toggles hidden categories section

**Integration**:
- Uses `expenseBaseline` from context for category data
- Uses `toggleCategoryVisibility` for show/hide functionality

**Requirements**: FR-1.2, FR-1.3, US-5

---

### CategoryEditRow
**Location**: `src/components/expenseBaseline/CategoryEditRow.tsx`

**Purpose**: Single category row with inline editing for the active tier

**Features**:
- Category icon and name display
- CurrencyInput for current tier value
- Life energy display (if AWH available) - shows hours required
- Hide button for default categories
- Delete button for custom categories

**Props**:
```typescript
interface CategoryEditRowProps {
  category: ExpenseCategory;
  activeTier: ExpenseTier;
}
```

**Life Energy Calculation**:
- Retrieves `lifeEnergy.perCategory[category.id][activeTier]` from results
- Only displayed when `actualHourlyWage > 0`
- Formatted as "X.X klst" using `formatNumber(hours, 1)`

**Integration**:
- Uses `updateCategoryValues()` for value changes
- Uses `toggleCategoryVisibility()` for hiding default categories
- Uses `removeCategory()` for deleting custom categories

**Requirements**: US-4, US-5

---

### AddCustomCategoryModal
**Location**: `src/components/expenseBaseline/AddCustomCategoryModal.tsx`

**Purpose**: Modal dialog for adding a new custom expense category

**Features**:
- Category name input (max 50 characters)
- Icon picker with 20 preset emojis + custom input
- Three tier value inputs (Barebones, Comfortable, Deluxe)
- Validation (name required, values >= 0)
- Save/Cancel buttons
- Keyboard shortcuts (Escape to close)

**Props**:
```typescript
interface AddCustomCategoryModalProps {
  onClose: () => void;
}
```

**Preset Icons**:
```typescript
const PRESET_ICONS = [
  '🏠', '🍽️', '🚗', '🏥', '🛡️', '💡', '👤', '🎬', '💰', '📦',
  '🎓', '✈️', '🎮', '📱', '🏋️', '🐕', '🎨', '📚', '🚀', '☕',
];
```

**Validation**:
- Name required and trimmed
- All tier values must be >= 0
- Error messages displayed in Icelandic

**Integration**:
- Uses `addCustomCategory(name, icon, values)` from context

**Requirements**: FR-1.2, US-5

---

## EPIC 4 Completion

**Tasks Implemented**:
1. Task 4.1: QuickEditModeContainer - Main container component
2. Task 4.2: TierTabSelector - Tier tab switching
3. Task 4.3: CategoryEditList - Category list management
4. Task 4.4: CategoryEditRow - Individual category editing
5. Task 4.5: AddCustomCategoryModal - Custom category creation

**Files Created**:
- `src/components/expenseBaseline/QuickEditModeContainer.tsx` (65 lines)
- `src/components/expenseBaseline/TierTabSelector.tsx` (97 lines)
- `src/components/expenseBaseline/CategoryEditList.tsx` (115 lines)
- `src/components/expenseBaseline/CategoryEditRow.tsx` (136 lines)
- `src/components/expenseBaseline/AddCustomCategoryModal.tsx` (234 lines)
- `src/components/expenseBaseline/index.ts` (barrel export)
- `src/types/expenseBaseline.ts` (updated with TierColorScheme interface)

**Total Lines of Code**: ~650 lines

**Integration Points**:
- All components use `useCalculator()` hook for state and actions
- Uses existing UI components (Button, CurrencyInput, Card, Alert)
- Uses constants from `@/lib/constants/expenseBaseline`
- Uses types from `@/types/expenseBaseline`
- Uses formatters from `@/lib/utils`

**Testing**:
- TypeScript compilation successful (no errors in EPIC 4 components)
- All required context methods exist and are properly typed
- Components follow existing patterns from other features

**Accessibility**:
- ARIA tabs pattern in TierTabSelector
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modal
- Screen reader friendly

**All text in Icelandic**: Yes, per requirements
