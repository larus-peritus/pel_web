# EducationalIntro Component

## Location
`src/components/coastFire/EducationalIntro.tsx`

## Purpose
Comprehensive educational introduction to Coast FIRE (Ró FIRE) with collapsible sections. Provides clear explanations, visual examples, benefits, misconceptions, and links to related calculators.

## Exports
- `EducationalIntro` - Main component with educational content
- `EducationalIntroProps` - TypeScript interface for props

## Props
```typescript
interface EducationalIntroProps {
  /** Callback when user dismisses the intro */
  onDismiss?: () => void;
  /** Whether the intro is collapsed */
  collapsed?: boolean;
  /** Callback when user toggles collapsed state */
  onToggle?: () => void;
  /** Optional className for styling */
  className?: string;
}
```

## Key Features

### Content Sections
1. **What is Coast FIRE**: Clear explanation of the concept with key takeaways
2. **Real Example**: Sara, 30 years old example with realistic Icelandic numbers
3. **Benefits**: 5 key benefits of reaching Coast FIRE
4. **Misconceptions**: 5 common misconceptions with corrections
5. **Related Calculators**: Links to 4 related tools

### Interactions
- **Collapsible Header**: Toggle entire intro
- **Individual Sections**: Expand/collapse each section independently
- **Expand/Collapse All**: Bulk operations for all sections
- **Dismissal**: Permanently hide intro (with localStorage)
- **Show Again**: Restore dismissed intro

### Educational Content

#### Example Numbers (Sara)
- Age: 30 years old
- Retirement age: 67 years old
- Current investments: 20,000,000 ISK
- FI number: 100,000,000 ISK
- Expected return: 6% annual real return
- Projected balance at 67: 161,804,065 ISK
- Status: Already in Coast FIRE

#### Benefits Listed
1. Can stop saving and use income elsewhere
2. Career flexibility (lower salary is okay)
3. Less financial stress
4. Compound growth does the work
5. Middle ground to FI

#### Misconceptions Addressed
1. "I need to quit working" → No, just don't need to save more
2. "I can withdraw now" → No, investments need to grow untouched
3. "Returns are guaranteed" → No, markets fluctuate
4. "I need to reach Coast FIRE immediately" → No, it's a milestone not a goal
5. "This works for everyone" → No, best for those with savings and long time horizon

#### Related Calculators
- Expense Baseline (`/reiknivaelir?calc=utgjaldareiknivel`)
- FI Number Calculator (`/reiknivaelir?calc=fi-tala`)
- Actual Hourly Wage (`/reiknivaelir?calc=raunveruleg-laun`)
- FIRE Type Explorer (`/reiknivaelir?calc=fire-leidarvisi`)

## State Management
- `expandedSections` - Set of section IDs that are expanded
- All sections expanded by default when intro is open
- Independent section expansion tracking

## Accessibility Features (Epic 7, Task 7.3)
- **ARIA Attributes**: `aria-expanded`, `aria-label`, `aria-controls`
- **Semantic HTML**: Proper heading hierarchy (h2, h3)
- **Keyboard Navigation**: All buttons are keyboard accessible
- **Screen Reader Support**: Clear labels and descriptions
- **Focus Management**: Proper tab order

## Styling
- **Card Layout**: Primary border with shadow
- **Collapsible Sections**: Smooth transitions
- **Color Coding**:
  - Blue for key concepts
  - Green for success/benefits
  - Amber for warnings/misconceptions
  - Purple for multiplier guidance
- **Responsive**: Adapts to mobile/tablet/desktop
- **Icons**: Emoji icons for visual appeal

## Integration
Used by:
- `CoastFIRECalculator` - Main calculator page

State persistence:
- Collapsed state via parent component
- Dismissal state via parent component

## Testing
Test file: `__tests__/EducationalIntro.test.tsx`

Coverage:
- ✅ Rendering with all sections
- ✅ Toggling collapsed state
- ✅ Individual section expansion/collapse
- ✅ Expand/collapse all functionality
- ✅ Dismissal callback
- ✅ All content present
- ✅ ARIA attributes
- ✅ Keyboard accessibility
- ✅ Related calculator links
- ✅ Edge cases

## Related Documentation
- Component: `CoastFIRECalculator.tsx`
- Epic: Epic 7, Task 7.1
- Feature: `context/features/coast-fire-calculator.md`
- Constants: `src/lib/constants/coastFire.ts`

## Design Decisions

1. **All Sections Expanded by Default**: Users see full content immediately
2. **Independent Section Control**: Users can collapse only what they don't need
3. **Realistic Example**: Sara example uses achievable numbers for Icelandic context
4. **Comprehensive Misconceptions**: Addresses all common misunderstandings
5. **Related Calculator Links**: Encourages exploration of full toolkit
6. **Permanent Dismissal**: Users can hide forever but also show again
7. **Visual Hierarchy**: Icons, colors, and layout guide user attention

## Performance
- Section state managed with Set for O(1) lookups
- Content rendered conditionally (collapsed sections not in DOM)
- No external API calls
- Memoization not needed (small component)

## Future Enhancements
- [ ] Animation for section expansion/collapse
- [ ] Tooltips on example numbers explaining calculations
- [ ] Interactive calculator within example section
- [ ] Video/animated explanation of compound growth
- [ ] Downloadable PDF guide
- [ ] Shareable link to specific section
