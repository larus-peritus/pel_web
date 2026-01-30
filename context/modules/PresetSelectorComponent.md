# PresetSelector Component

## Location
`apps/peninganaedalifid/src/components/calculator/PresetSelector.tsx`

## Purpose
Provides UI components for selecting preset values for commute, clothing, and meals expenses. Displays all available presets as pill-style buttons and highlights the currently active preset or shows a "Custom" badge when values don't match any preset.

## Exports

### `PresetSelector`
Individual preset selector for a single category.

**Props:**
- `category: PresetCategory` - The preset category ('commute' | 'clothing' | 'meals')
- `className?: string` - Optional Tailwind classes for styling

**Features:**
- Displays category-specific label (Commute Style, Work Attire, Lunch Habits)
- Renders all presets for the category as pill buttons
- Highlights currently active preset with primary color
- Shows "Custom" badge when values don't match any preset
- Displays preset description as tooltip (title attribute)
- Applies preset values on click
- Full keyboard accessibility with focus indicators

### `PresetSelectors`
Combined preset selectors for all three categories.

**Props:**
- `className?: string` - Optional Tailwind classes for styling

**Features:**
- Displays heading and description
- Includes all three category selectors (commute, clothing, meals)
- Consistent spacing and layout

## Key Functionality

### Preset Selection
- Uses `usePresets` hook to get available presets and detect current preset
- Calls `applyPreset` from CalculatorContext when preset is clicked
- Updates calculator inputs automatically

### Visual Feedback
- Active preset: primary-100 background, primary-500 border, primary-700 text
- Inactive preset: white background, neutral-300 border, hover effect
- Custom badge: neutral-100 background, neutral-300 border, neutral-600 text
- Focus ring on keyboard navigation

### Category Labels
```typescript
const categoryLabels: Record<PresetCategory, string> = {
  commute: 'Commute Style',
  clothing: 'Work Attire',
  meals: 'Lunch Habits',
};
```

## Dependencies
- `react` - useCallback for memoized handlers
- `@/context/CalculatorContext` - useCalculator hook, applyPreset function
- `@/hooks/usePresets` - Preset selection and detection logic
- `@/lib/utils` - cn utility for class name merging
- `@/types/calculator` - PresetCategory and Preset types

## Integration
- Used by: ExpenseInputs component (to be implemented)
- Uses: CalculatorContext for state management
- Uses: usePresets hook for preset logic
- Uses: Preset configuration from lib/presets

## Tests
- Location: `tests/components/calculator/PresetSelector.test.tsx`
- Coverage: 10 tests, all passing
- Tests include:
  - Category label rendering
  - Preset list rendering
  - Custom badge display
  - Preset description tooltips
  - Click handling
  - Multiple category rendering
  - Custom className support
  - Combined selectors rendering

## Styling
- Pill-style buttons with rounded-full borders
- Flexbox layout with wrap and gap
- Responsive spacing
- Smooth transitions on hover/active states
- Accessible focus indicators (ring-2, ring-primary-500)

## Accessibility
- Semantic button elements
- `aria-pressed` attribute on preset buttons
- `title` attribute for preset descriptions
- Visible focus indicators
- Keyboard navigable
- Screen reader friendly labels

## Usage Example

```tsx
import { PresetSelector, PresetSelectors } from '@/components/calculator/PresetSelector';

// Single category selector
function CommuteSection() {
  return (
    <div>
      <h2>Commute Expenses</h2>
      <PresetSelector category="commute" />
      {/* Other commute inputs */}
    </div>
  );
}

// All presets
function ExpenseInputsSection() {
  return (
    <div>
      <PresetSelectors />
      {/* Manual input fields */}
    </div>
  );
}
```

## Related
- Implements: Requirements R14, R15 from specs/actual-hourly-wage-calculator/requirements.md
- Part of: specs/actual-hourly-wage-calculator/design.md
- Task: Task 14 from specs/actual-hourly-wage-calculator/tasks.md
