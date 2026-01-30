# PhaseTimeline Component

## Location
`src/components/pensionAwareFire/PhaseTimeline.tsx`

## Purpose
Visual timeline component that displays retirement phases from current age to 90, showing the progression from working years through various pension-funded retirement phases. Provides intuitive visualization of when different pension sources become available and how much funding is needed for each phase.

## Props
```typescript
interface PhaseTimelineProps {
  phases: RetirementPhase[];      // Array of retirement phases to display
  currentAge: number;              // User's current age
  targetRetirementAge: number;     // User's target retirement age
}
```

## Key Functionality

### Timeline Visualization
- **Horizontal bar timeline** (desktop): Visual representation spanning from current age to 90
- **Stacked cards** (mobile): Responsive mobile-friendly layout
- **Age markers**: Key transition points (current age, retirement, 60, 67, 90)
- **Color-coded segments**: Each phase has distinct color based on PHASE_COLORS constant
  - Working years: Blue (accumulation phase)
  - Gap period: Red (self-funded, challenging)
  - Séreign bridge: Amber (partial pension support)
  - Full pension: Green (all pension sources active)

### Phase Information Display
- **Phase labels**: Icelandic names (Vinna, Biðtími, Séreign brú, Fullur lífeyrir)
- **Duration**: Years for each phase (e.g., "8 ár")
- **Age ranges**: Start and end age for each phase (e.g., "52-60 ára")
- **Funding requirements**: Amount needed at phase start or "Afgangur!" if no funding needed
- **Tooltips**: Hover/focus shows detailed phase information

### Interactivity
- **Click to select**: Phase segments clickable on desktop
- **Keyboard navigation**: Full keyboard support (Enter/Space to select)
- **Tooltips**: Hover tooltips with comprehensive phase details
- **ARIA labels**: Accessibility-compliant with proper labels

### Responsive Design
- **Desktop (md+)**: Horizontal timeline bar with proportional phase widths
- **Mobile**: Vertically stacked cards for better mobile readability
- **Adaptive layout**: Automatically switches based on screen size

## Edge Cases Handled

### Retirement Age Scenarios
1. **Retirement before 60**: Shows all three phases (gap, séreign-bridge, full-pension)
2. **Retirement at 60**: Shows two phases (séreign-bridge, full-pension), no gap
3. **Retirement 60-66**: Shows two phases with shorter bridge period
4. **Retirement at 67**: Shows only full-pension phase
5. **Retirement after 67**: Shows only full-pension phase starting later

### Duration Edge Cases
- **Single year phases**: Displays "1 ár" instead of "1 ár"
- **Long gap periods**: Handles very early retirement (15+ year gaps)
- **Short phases**: Handles brief transition periods

### Display Edge Cases
- **Zero funding**: Shows "Afgangur!" instead of amount
- **Large amounts**: Formats correctly with Icelandic thousands separator (period)
- **No phases**: Component gracefully handles empty phase array

## Visual Design

### Desktop Timeline (Horizontal)
```
┌────────────────────────────────────────────────────────────────┐
│  35        52              60                67              90 │
│   │         │               │                 │               │ │
│   ●━━━━━━━━━●═══════════════●─────────────────●───────────────● │
│   │  Working │   Gap Period  │  Séreign Bridge │ Full Pension │ │
│   │  17 ár   │    8 ár       │     7 ár        │   23 ár      │ │
│             │               │                 │                │
│             │  Þarf: 23M    │  Þarf: 10.5M    │  Afgangur!   │ │
└────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Stacked)
Each phase displayed as a card with:
- Color indicator dot
- Phase name and age range
- Duration
- Funding requirement

## Color Scheme
Uses `PHASE_COLORS` constant from `pensionAwareFire.ts`:
- **Working (blue)**: `bg-blue-500`, `bg-blue-100`, `text-blue-900`
- **Gap (red)**: `bg-red-500`, `bg-red-100`, `text-red-900`
- **Séreign bridge (amber)**: `bg-amber-500`, `bg-amber-100`, `text-amber-900`
- **Full pension (green)**: `bg-green-500`, `bg-green-100`, `text-green-900`

## Icelandic Labels
- **Vinna**: Working years
- **Biðtími**: Gap period (self-funded)
- **Séreign brú**: Private pension bridge (60-67)
- **Fullur lífeyrir**: Full pension (67+)
- **Þarf við upphaf**: Need at start
- **Afgangur**: Surplus (no funding needed)
- **ár**: years

## Dependencies

### Internal
- `@/components/ui/Card` - Card container
- `@/components/ui/Tooltip` - Hover tooltips
- `@/lib/constants/pensionAwareFire` - PHASE_COLORS, ICELANDIC_PENSION_SYSTEM
- `@/lib/utils/formatters` - formatCurrency
- `@/types/pensionAwareFire` - RetirementPhase type
- `@/lib/utils` - cn utility

### External
- React (useState)
- Tailwind CSS for styling

## Tests
Location: `tests/components/pensionAwareFire/PhaseTimeline.test.tsx`
Coverage: 27 tests, all passing

### Test Categories
1. **Basic Rendering** (3 tests)
   - Header and description
   - All phases displayed
   - Working years segment

2. **Age Markers** (4 tests)
   - Current age marker
   - Retirement age marker
   - Key pension ages (60, 67)
   - Age 90 marker

3. **Phase Details** (4 tests)
   - Duration display
   - Age range display
   - Required funding display
   - "Afgangur!" for zero funding

4. **Edge Cases** (6 tests)
   - Retirement at 60 (no gap)
   - Retirement at 67 (only full pension)
   - Retirement after 67
   - Very early retirement
   - Single year duration

5. **Responsive Design** (2 tests)
   - Desktop timeline bar
   - Mobile stacked cards

6. **Interactivity** (3 tests)
   - Clickable phase segments
   - Keyboard navigation
   - ARIA labels

7. **Multiple Phases** (2 tests)
   - Three-phase timeline
   - Two-phase timeline

8. **Legend and Documentation** (1 test)
   - Legend with explanation

9. **Color Coding** (1 test)
   - Correct color schemes

10. **Formatting** (2 tests)
    - Large amounts formatting
    - Zero amounts as "Afgangur!"

## Integration
- Used by: PensionAwareFIRECalculator (main calculator component, Task 7.1)
- Uses: RetirementPhase data from calculation engine (Task 3.1)
- Part of: Epic 6 - Results Components

## Accessibility
- **ARIA labels**: All interactive elements properly labeled
- **Keyboard navigation**: Full keyboard support with tabIndex
- **Tooltips**: Accessible tooltips with proper ARIA attributes
- **Semantic HTML**: Proper heading hierarchy and structure
- **Color contrast**: All color combinations meet WCAG AA standards

## Performance Considerations
- **Responsive rendering**: Different layouts for mobile/desktop
- **No heavy calculations**: All width calculations done with CSS percentages
- **Minimal re-renders**: Uses local state only for selection
- **Efficient event handlers**: Debounced where appropriate

## Future Enhancements (Post-MVP)
- Animated transitions between phases
- Draggable retirement age to see real-time updates
- Export timeline as image
- Interactive "what-if" scenarios directly on timeline
- Compare multiple scenarios overlaid
- Zoom/pan for very long timelines

## Related
- Implements: US-5 from requirements (Phase visualization)
- Part of: Task 6.1 from tasks-pension-aware-fire.md
- Depends on: Types (Task 1.1), Constants (Task 2.1), Calculations (Task 3.1)
- Related to: PhaseBreakdown (Task 6.3) - detailed numerical breakdown
