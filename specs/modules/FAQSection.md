# FAQSection Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/FAQSection.tsx`

## Purpose
Frequently Asked Questions section with 14 comprehensive questions and answers about FIRE in Icelandic context.

## Exports
- `FAQSection` - React component for FIRE FAQ
- `FAQSectionProps` - TypeScript interface for component props

## Key Functionality
- **14 FAQ Items**: Comprehensive coverage of FIRE questions
- **Accordion Format**: Expandable Q&A for easy navigation
- **Searchable**: Real-time search across questions and answers
- **Categorized**: Questions organized into 5 categories
- **External Links**: Related resources where appropriate
- **Iceland-Specific**: Tailored answers for Icelandic context
- **Beginner-Friendly**: Clear, accessible language

## Props Interface
```typescript
interface FAQSectionProps {
  className?: string; // Optional additional CSS classes
}
```

## FAQ Categories
1. **basics** (Grunnatriði) - Foundation concepts
2. **types** (FIRE tegundir) - Different FIRE approaches
3. **iceland** (FIRE á Íslandi) - Iceland-specific topics
4. **strategy** (Stefnumótun) - Planning and execution
5. **concerns** (Algengar áhyggjur) - Common worries and obstacles

## All 14 Questions
1. **Hvað er FIRE hreyfingin?** (basics)
2. **Hvaða FIRE tegund hentar mér best?** (types)
3. **Hvað er munurinn á LeanFIRE og FatFIRE?** (types)
4. **Er 4% reglan örugg á Íslandi?** (iceland) - with Trinity Study link
5. **Hvernig reikna ég FI-töluna mína?** (basics)
6. **Hvað er CoastFIRE og hvernig virkar það?** (types) - with Coast FIRE calculator link
7. **Get ég náð FIRE með lágar tekjur?** (concerns)
8. **Hversu mikið ætti ég að spara?** (strategy)
9. **Hvenær er ég tilbúinn til að hætta að vinna?** (strategy)
10. **Hvað gerist ef markaðurinn hrynur?** (concerns) - with sequence risk link
11. **Hvernig fjárfesti ég á Íslandi fyrir FIRE?** (iceland)
12. **Hvað með lífeyrissjóðinn minn?** (iceland)
13. **Er FIRE bara fyrir ríka?** (concerns)
14. **Hvað ef ég vil eignast börn?** (concerns)

## Features
### Search Functionality
- Real-time filter across:
  - Question text
  - Answer text
- Case-insensitive search
- Result count display
- "No results" message

### Category Badges
- Displayed when question is collapsed
- Color-coded by category
- Shows which topic area each question belongs to

### Related Links
- External resources embedded in answers
- Open in new tab (target="_blank")
- Security (rel="noopener noreferrer")
- Examples:
  - Trinity Study PDF
  - Coast FIRE calculator
  - Sequence of returns risk explanation
  - r/FIREyFI and r/financialindependence

## Data Structure
```typescript
interface FAQItem {
  question: string;
  answer: string;
  relatedLinks?: Array<{ text: string; url: string }>;
  category?: 'basics' | 'types' | 'iceland' | 'strategy' | 'concerns';
}
```

## Iceland-Specific Content
- **4% rule adaptation**: Recommends 3.5% for Iceland due to higher inflation
- **Lífeyrissjóður integration**: Explains how pension funds fit into FIRE
- **ISK investment options**: Mentions Birtu/Stefni and Landsbréf funds
- **Tax considerations**: Addresses Icelandic tax system
- **Frítekjumark**: Explains tax-free income threshold

## Dependencies
- `@/components/ui/Card` - Container component
- `@/lib/utils` - cn utility function
- React hooks: useState for state management

## State Management
- `expandedQuestions` (Set<number>) - Tracks which questions are open
- `searchTerm` (string) - Current search/filter value
- Multiple questions can be expanded simultaneously

## Tests
- Location: `src/components/fireTypes/__tests__/FAQSection.test.tsx`
- Coverage: 23 tests, all passing
- Tests include:
  - All 14 questions present
  - Expand/collapse functionality
  - Multiple simultaneous expansion
  - Search/filter functionality
  - Category badges display
  - Related links rendering
  - Iceland-specific questions
  - FIRE type coverage
  - Strategy and concern questions
  - External link attributes
  - ARIA accessibility

## Integration
- Used by: EducationalContentSection component
- Part of: Epic 8 (Educational Content)
- Implements: Requirements from specs/fire-type-explorer/requirements-fire-type-explorer.md

## Accessibility
- Proper ARIA attributes (aria-expanded, aria-controls, aria-label)
- Semantic HTML (button elements for accordion headers)
- Role="region" for expanded answers
- Keyboard navigable accordion

## Styling
- Gradient header (green-50 to green-100)
- Color-coded expansion state (green-300 border when open)
- Category badge styling (neutral-100 background)
- Search icon with visual indicator
- Responsive spacing

## Helper Text
Footer includes links to:
- r/FIREyFI (Icelandic FIRE community)
- r/financialindependence (International FIRE community)
- Displays only when not searching

## Related Components
- EducationalContentSection - Parent container
- DetailedExplanation - Complementary educational content
- GlossarySection - Complementary educational content
