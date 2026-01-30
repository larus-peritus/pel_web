# Timeline Visualization Components

## Location
`src/components/fireTypes/`

## Purpose
Epic 7 components that visualize FIRE timelines and milestones in an interactive, responsive SVG-based timeline.

## Components

### TimelineAxis
**File**: `TimelineAxis.tsx`

SVG-based timeline axis showing age and year progression.

**Features**:
- Horizontal (desktop) / Vertical (mobile) orientation support
- Age labels at 5-year intervals
- Calendar year labels below ages
- Current position marker ("Núna" / "Now")
- Optional subtle grid lines
- Crisp SVG rendering
- Fully responsive

**Props**:
- `orientation?: 'horizontal' | 'vertical'` - Timeline orientation (default: horizontal)
- `startAge: number` - Starting age for timeline
- `endAge: number` - Ending age for timeline
- `currentAge: number` - User's current age
- `showGrid?: boolean` - Whether to show background grid lines (default: true)
- `className?: string` - Additional CSS classes

**Usage**:
```tsx
<TimelineAxis
  orientation="horizontal"
  startAge={25}
  endAge={67}
  currentAge={32}
  showGrid={true}
/>
```

---

### MilestoneMarker
**File**: `MilestoneMarker.tsx`

Interactive milestone marker positioned on timeline.

**Features**:
- FIRE type icon (emoji) display
- Positioned based on age/years
- Age + year labels
- Interactive hover states
- Click to activate/show tooltip
- Color-coded by FIRE type
- "Achieved" state with checkmark and glow
- Fully keyboard accessible
- ARIA labeled

**Props**:
- `fireTypeId: FIRETypeId` - FIRE type identifier
- `age: number` - Age when milestone is reached
- `year: number` - Calendar year of milestone
- `position: number` - Position on timeline (0-100%)
- `isAchieved?: boolean` - Whether milestone is already achieved
- `onClick?: () => void` - Click handler
- `onHover?: (hovered: boolean) => void` - Hover handler
- `isActive?: boolean` - Whether marker is currently active
- `orientation?: 'horizontal' | 'vertical'` - Matches parent timeline
- `className?: string` - Additional CSS classes

**FIRE Type Icons**:
- LeanFIRE: 🔥 (amber)
- RegularFIRE: 🎯 (green)
- CoastFIRE: 🏖️ (cyan)
- BaristaFIRE: ☕ (purple)
- FatFIRE: 💎 (pink)

**Usage**:
```tsx
<MilestoneMarker
  fireTypeId="regularfire"
  age={52}
  year={2046}
  position={65}
  isAchieved={false}
  onClick={() => setActiveTooltip(true)}
/>
```

---

### MilestoneTooltip
**File**: `MilestoneTooltip.tsx`

Detailed information tooltip for timeline milestones.

**Features**:
- FIRE type name and icon
- Age and calendar year display
- Nest egg amount (formatted ISK)
- Years remaining countdown (if not achieved)
- "Náð!" badge for achieved milestones
- Optional description text
- Smart positioning (avoids edges)
- Click outside to dismiss
- ESC key to dismiss
- Animated entrance

**Props**:
- `fireTypeId: FIRETypeId` - FIRE type
- `age: number` - Age at milestone
- `year: number` - Calendar year
- `nestEggAmount: number` - Amount in ISK
- `yearsRemaining: number | null` - Years until achieved (null if achieved)
- `isAchieved: boolean` - Achievement status
- `description?: string` - Optional description
- `markerPosition: number` - Position of marker (0-100%) for smart positioning
- `isVisible: boolean` - Visibility state
- `onDismiss: () => void` - Dismiss handler
- `className?: string` - Additional CSS classes

**Smart Positioning**:
- Marker at 0-30%: Tooltip on right
- Marker at 70-100%: Tooltip on left
- Marker at 30-70%: Tooltip on top

**Currency Formatting**:
- Billions: `1.5 ma. kr`
- Millions: `156 m. kr`
- Thousands: `750 þ. kr`

**Usage**:
```tsx
<MilestoneTooltip
  fireTypeId="regularfire"
  age={52}
  year={2046}
  nestEggAmount={156_000_000}
  yearsRemaining={20}
  isAchieved={false}
  description="Full fjármálafrelsi með þægilegum lífsstíl"
  markerPosition={65}
  isVisible={true}
  onDismiss={() => setShowTooltip(false)}
/>
```

---

### TimelineVisualization
**File**: `TimelineVisualization.tsx`

Complete timeline visualization orchestrating all components.

**Features**:
- TimelineAxis as base layer
- All MilestoneMarkers positioned correctly
- Current position highlighted
- Timeline legend (FIRE type colors)
- Responsive orientation (auto, horizontal, vertical)
- Scrollable for long timelines
- Optional progress path visualization
- Interactive tooltip management
- Timeline summary cards

**Props**:
- `timelines: Partial<Record<FIRETypeId, FIRETimeline>>` - Timeline data
- `currentAge: number` - User's current age
- `selectedTypes?: FIRETypeId[]` - Types to display (default: all)
- `orientation?: 'auto' | 'horizontal' | 'vertical'` - Responsive orientation
- `showLegend?: boolean` - Show type legend (default: true)
- `showProgressPath?: boolean` - Show progress gradient (default: true)
- `className?: string` - Additional CSS classes

**Auto-Calculated Features**:
- Timeline bounds (min/max age with padding)
- Milestone positions based on years
- Breakpoint detection for mobile/desktop
- Active tooltip state management

**Usage**:
```tsx
<TimelineVisualization
  timelines={{
    leanfire: leanTimeline,
    regularfire: regularTimeline,
    fatfire: fatTimeline,
  }}
  currentAge={32}
  selectedTypes={['regularfire', 'fatfire']}
  showLegend={true}
  showProgressPath={true}
/>
```

---

### TimelineSection
**File**: `TimelineSection.tsx`

Full section component with header, estimates, and help text.

**Features**:
- Section header "Tímalína til FIRE"
- Completion estimates (optimistic/realistic/pessimistic)
- Scenario selection buttons
- TimelineVisualization component
- Help text with instructions
- Link to adjust inputs
- Empty state handling
- Responsive design

**Props**:
- `timelines: Partial<Record<FIRETypeId, FIRETimeline>> | null` - Timeline data
- `userInputs: UserFinancialInputs | null` - User financial data
- `selectedTypes?: FIRETypeId[]` - Types to display
- `onAdjustInputs?: () => void` - Callback to edit inputs
- `className?: string` - Additional CSS classes

**Completion Estimates**:
- **Optimistic**: Earliest FIRE type (e.g., LeanFIRE)
- **Realistic**: Median FIRE type (e.g., RegularFIRE)
- **Pessimistic**: Latest FIRE type (e.g., FatFIRE)

**Empty State**:
Shows when `timelines` or `userInputs` is null, with call-to-action button.

**Usage**:
```tsx
<TimelineSection
  timelines={allTimelines}
  userInputs={inputs}
  selectedTypes={['regularfire']}
  onAdjustInputs={() => navigateToInputs()}
/>
```

## Dependencies
- React 18+
- `@/types/fireTypes` - FIRETimeline, FIRETypeId, UserFinancialInputs
- `@/lib/constants/fireTypes` - FIRE_TYPE_DEFINITIONS, getFIRETypeColors
- `@/lib/utils` - cn() utility
- `@/components/ui/Card` - Card, CardHeader, CardContent

## Key Functionality

### SVG Timeline Rendering
- Crisp, scalable graphics
- No pixelation at any zoom level
- Efficient rendering with minimal DOM

### Responsive Design
- Desktop: Horizontal timeline (800x80 viewBox)
- Mobile: Vertical timeline (120x600 viewBox)
- Auto-detection with window resize listener

### Interactive Features
- Click markers to show tooltip
- Hover for visual feedback
- Keyboard navigation (Tab, Enter, Space, ESC)
- Click outside to dismiss tooltips

### Smart Positioning
Tooltips automatically position to avoid viewport edges:
- Left markers → Right tooltip
- Right markers → Left tooltip
- Center markers → Top tooltip

### Accessibility
- All markers have ARIA labels
- Keyboard focusable
- Screen reader friendly
- Semantic HTML structure

## Tests
- **Location**: `src/components/fireTypes/__tests__/`
- **Files**:
  - `TimelineAxis.test.tsx` - 35+ tests
  - `MilestoneMarker.test.tsx` - 40+ tests
  - `TimelineSection.test.tsx` - 30+ tests
- **Coverage**: All props, states, interactions, edge cases

### Test Categories
1. **Rendering**: Component structure, ARIA labels, initial state
2. **Styling**: Color schemes, active states, achieved states
3. **Interactions**: Click, hover, keyboard navigation
4. **Responsiveness**: Orientation changes, positioning
5. **Edge Cases**: Extreme ages, empty data, achieved milestones
6. **Accessibility**: Keyboard navigation, focus management, ARIA

## Integration

### With FIRE Type Explorer
```tsx
import { TimelineSection } from '@/components/fireTypes';

function FIREExplorer() {
  const { fireTypeResults } = useCalculatorContext();

  return (
    <TimelineSection
      timelines={fireTypeResults?.timelines || null}
      userInputs={fireTypeResults?.inputs || null}
      selectedTypes={['regularfire', 'leanfire']}
      onAdjustInputs={() => router.push('/inputs')}
    />
  );
}
```

### Standalone Timeline
```tsx
import { TimelineVisualization } from '@/components/fireTypes';

function QuickTimeline({ timelines, age }: Props) {
  return (
    <TimelineVisualization
      timelines={timelines}
      currentAge={age}
      showLegend={true}
      orientation="auto"
    />
  );
}
```

## Related
- **Types**: `src/types/fireTypes.ts` (FIRETimeline, TimelineMilestone)
- **Calculations**: `src/lib/calculations/fireTypes.ts` (generateFIRETimeline)
- **Constants**: `src/lib/constants/fireTypes.ts` (FIRE_TYPE_COLORS)
- **Epic**: Epic 7 - Timeline Visualization
- **Requirements**: FIRE Type Explorer - Visualization Requirements

## Implementation Notes

### Performance Optimizations
- SVG rendering is hardware-accelerated
- useState for tooltip to avoid re-rendering entire timeline
- useCallback for event handlers
- Memoized position calculations

### Browser Support
- Modern browsers with SVG support
- CSS transforms for positioning
- Flexbox and Grid for layout
- No IE11 support needed

### Future Enhancements
- Animated progress along timeline
- Drag to adjust milestones
- Export timeline as image
- Print-friendly view
- Multiple milestone markers per type (25%, 50%, 75%, 100%)

## Icelandic Terminology
- **Tímalína**: Timeline
- **Núna**: Now
- **ára**: years old
- **Náð!**: Achieved!
- **Bjartsýn**: Optimistic
- **Raunhæf**: Realistic
- **Varfærn**: Pessimistic
- **Uppsöfnuð eign**: Accumulated wealth/nest egg
- **Tími eftir**: Time remaining
