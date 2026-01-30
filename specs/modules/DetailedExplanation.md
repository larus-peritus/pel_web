# DetailedExplanation Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/DetailedExplanation.tsx`

## Purpose
Comprehensive educational component displaying detailed information about a specific FIRE type in Icelandic.

## Exports
- `DetailedExplanation` - React component for detailed FIRE type explanation
- `DetailedExplanationProps` - TypeScript interface for component props

## Key Functionality
- **Full FIRE Type Description**: Displays complete description in Icelandic
- **How It Works Section**: Step-by-step guide to achieving the FIRE type (8-9 steps per type)
- **When to Choose**: bestFor and notFor lists with specific audience guidance
- **Real-World Icelandic Examples**: 2 examples per type with ISK amounts
- **Common Pitfalls**: 5 type-specific warnings and mistakes to avoid
- **External Resources**: Links to FIRE community resources and articles
- **Collapsible Sections**: 7 accordion sections for organized content
- **Color-Coded UI**: Uses FIRE type color scheme (amber, green, cyan, purple, pink)
- **Print-Friendly**: All content expandable for comprehensive printing

## Props Interface
```typescript
interface DetailedExplanationProps {
  fireTypeId: FIRETypeId; // 'leanfire' | 'regularfire' | 'coastfire' | 'baristafire' | 'fatfire'
}
```

## Component Sections
1. **Description** (expanded by default): What the FIRE type is
2. **How It Works** (expanded by default): Step-by-step mechanics
3. **When to Choose**: Best for / Not for lists
4. **Real-World Examples**: Icelandic scenarios with ISK amounts
5. **Common Pitfalls**: Type-specific warnings
6. **External Resources**: Community links and articles
7. **Pros and Cons**: Summary of advantages and disadvantages

## Data Sources
- FIRE type definitions from `@/lib/constants/fireTypes`
- Dynamic content generation for:
  - How it works steps (8-9 per type)
  - Common pitfalls (5 per type)
  - External resources (3-5 per type)
- Color schemes from `getFIRETypeColors()`

## Dependencies
- `@/components/ui/Card` - Container component
- `@/lib/utils` - cn utility and formatCurrency
- `@/lib/constants/fireTypes` - FIRE type definitions and colors
- `@/types/fireTypes` - TypeScript type definitions

## State Management
- Local state for expanded sections (Set<string>)
- Default expanded: 'description' and 'howItWorks'
- Collapsible sections toggle independently

## Tests
- Location: `src/components/fireTypes/__tests__/DetailedExplanation.test.tsx`
- Coverage: 14 tests, all passing
- Tests include:
  - Rendering FIRE type name and tagline
  - Default expanded sections
  - Section toggling
  - Real-world examples display
  - Common pitfalls warnings
  - External resource links
  - Color scheme application
  - ARIA accessibility
  - Currency formatting

## Integration
- Used by: EducationalContentSection component
- Part of: Epic 8 (Educational Content)
- Implements: Requirements from specs/fire-type-explorer/requirements-fire-type-explorer.md

## Accessibility
- Proper ARIA attributes (aria-expanded, aria-controls, aria-label)
- Semantic HTML (button, dt, dd elements)
- Role="region" for expanded sections
- Screen reader friendly structure

## Related Components
- EducationalContentSection - Parent container
- GlossarySection - Complementary educational content
- FAQSection - Complementary educational content
