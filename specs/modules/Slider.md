# Slider Component

## Location
`src/components/ui/Slider.tsx`

## Purpose
Range slider input component with customizable range, optional value display, custom formatting, and full accessibility support for selecting numeric values.

## Exports
- `Slider` - Range input component with forwardRef support
- `SliderProps` - TypeScript interface for slider props

## Key Functionality
- **Range Control**: Configurable min, max, and step values
- **Label Support**: Optional label with required indicator
- **Value Display**: Optional value display with custom formatting
- **Custom Formatting**: formatValue prop for custom value presentation (e.g., currency, percentage)
- **Visual Feedback**: Gradient track showing progress from min to current value
- **Accessibility**: Full keyboard support (arrow keys), ARIA attributes
- **Custom Styling**: Styled track and thumb using Tailwind CSS
- **Responsive Design**: Works across all screen sizes

## Props Interface
```typescript
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}
```

## Styling Details

### Track
- **Height**: 0.5rem (h-2)
- **Background**: Gradient from primary-600 (filled) to neutral-200 (unfilled)
- **Shape**: Fully rounded (rounded-full)
- **Visual Fill**: Percentage-based gradient showing current value position

### Thumb
- **Size**: 1.25rem (5x5)
- **Background**: primary-600 with white border
- **Shape**: Fully rounded (rounded-full)
- **Shadow**: Subtle shadow for depth
- **Hover**: Scales to 110%, darkens to primary-700
- **Active**: Scales to 105%, darkens to primary-800
- **Focus**: 2px ring with primary-500 color and offset

### States
- **Default**: Blue thumb on gray track with gradient fill
- **Hover**: Thumb enlarges slightly and darkens
- **Focus**: Visible focus ring for keyboard navigation
- **Active/Dragging**: Slight scale reduction for tactile feedback
- **Disabled**: 50% opacity, neutral-400 thumb, cursor-not-allowed

## Dependencies
- `tailwind-merge` - Tailwind class conflict resolution via `cn()` utility
- `@/lib/utils` - Provides `cn()` function for class merging
- Native HTML5 range input for core functionality

## Component Features
- **ForwardRef**: Supports ref forwarding for parent component control
- **Type Safety**: Full TypeScript support with exported interfaces
- **Keyboard Accessible**: Native range input provides arrow key support
- **ARIA Compliant**: Proper aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
- **Cross-browser**: Separate styling for webkit and Firefox browsers
- **Class Merging**: Uses `cn()` utility for proper Tailwind class merging
- **Extensible**: Accepts custom className for additional styling

## Browser Compatibility
- **Webkit (Chrome, Safari, Edge)**: Custom styling via ::-webkit-slider-thumb and ::-webkit-slider-runnable-track
- **Firefox**: Custom styling via ::-moz-range-thumb and ::-moz-range-track
- **Fallback**: Native range input works in all browsers even without custom styling

## Integration
- Uses: `cn()` from `@/lib/utils`
- Uses: Tailwind theme colors (primary-*, neutral-*, danger-*)
- Part of: UI component library (`src/components/ui/`)

## Usage Examples
```typescript
// Basic usage
<Slider
  min={0}
  max={100}
  value={value}
  onChange={setValue}
  label="Volume"
/>

// With value display
<Slider
  min={0}
  max={100}
  step={5}
  value={value}
  onChange={setValue}
  label="Progress"
  showValue
/>

// With custom formatting (currency)
<Slider
  min={0}
  max={10000}
  step={100}
  value={salary}
  onChange={setSalary}
  label="Annual Salary"
  showValue
  formatValue={(val) => `$${val.toLocaleString()}`}
/>

// With custom formatting (percentage)
<Slider
  min={0}
  max={100}
  value={percent}
  onChange={setPercent}
  label="Tax Rate"
  showValue
  formatValue={(val) => `${val}%`}
/>

// Required field
<Slider
  min={1}
  max={10}
  value={rating}
  onChange={setRating}
  label="Rating"
  required
  showValue
/>
```

## Accessibility Features
- Native keyboard support (left/right arrows, page up/down, home/end)
- Proper ARIA attributes for screen readers
- Label association with htmlFor/id
- Required indicator with aria-label
- aria-valuetext provides formatted value for screen readers
- Focus visible states for keyboard navigation

## Related
- Implements: Requirements F10 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Slider Component section)
- Task: F10 in specs/project-foundation/tasks.md
