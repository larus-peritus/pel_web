# GlossarySection Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/GlossarySection.tsx`

## Purpose
Alphabetical glossary of FIRE-related terminology in Icelandic with English translations and comprehensive definitions.

## Exports
- `GlossarySection` - React component for FIRE terminology glossary
- `GlossarySectionProps` - TypeScript interface for component props

## Key Functionality
- **18 FIRE Terms**: Comprehensive list of essential FIRE vocabulary
- **Bilingual Terms**: Icelandic terms with English translations in parentheses
- **Searchable**: Real-time search/filter across terms, English names, and definitions
- **Alphabetically Sorted**: Icelandic alphabetical order using localeCompare
- **Related Terms**: Cross-references to connected concepts
- **Collapsible**: Collapsed by default to save space
- **Clear Definitions**: Jargon-free explanations in Icelandic
- **Helper Text**: Usage guidance for search functionality

## Props Interface
```typescript
interface GlossarySectionProps {
  className?: string; // Optional additional CSS classes
}
```

## Glossary Terms
1. **4% reglan** (4% Rule)
2. **BaristaFIRE** (Barista FIRE)
3. **CoastFIRE** (Coast FIRE)
4. **FatFIRE** (Fat FIRE)
5. **FI-tala** (FI Number)
6. **FIRE** (Financial Independence, Retire Early)
7. **Fjármálafrelsi** (Financial Independence)
8. **Hrein eign** (Net Worth)
9. **LeanFIRE** (Lean FIRE)
10. **Lífsstílsverðbólga** (Lifestyle Inflation)
11. **Óvirkar tekjur** (Passive Income)
12. **Samsettar vextir** (Compound Interest)
13. **Sequence of Returns Risk** (Sequence of Returns Risk)
14. **Sparnaðarhlutfall** (Savings Rate)
15. **SWR** (Safe Withdrawal Rate)
16. **Trinity-rannsóknin** (Trinity Study)
17. **Úttektarhlutfall** (Withdrawal Rate)
18. **Vísitölusjóður** (Index Fund)

## Features
### Search/Filter
- Searches across:
  - Icelandic term
  - English term
  - Full definition text
- Real-time filtering as user types
- Result count display
- "No results" message for empty searches

### Related Terms
- Cross-references between related concepts
- Displayed as colored badges
- Examples:
  - 4% reglan → Trinity-rannsóknin, Úttektarhlutfall, SWR
  - FIRE → FI-tala, Sparnaðarhlutfall, Fjármálafrelsi
  - CoastFIRE → Samsettar vextir, FIRE, FI-tala

## Data Structure
```typescript
interface GlossaryTerm {
  term: string;          // Icelandic term
  termEn: string;        // English term
  definition: string;     // Full definition in Icelandic
  relatedTerms?: string[]; // Optional array of related terms
}
```

## Dependencies
- `@/components/ui/Card` - Container component
- `@/lib/utils` - cn utility function
- React hooks: useState for state management

## State Management
- `isExpanded` (boolean) - Controls overall section expansion
- `searchTerm` (string) - Current search/filter value
- Filter logic: Case-insensitive search across all text fields

## Tests
- Location: `src/components/fireTypes/__tests__/GlossarySection.test.tsx`
- Coverage: 17 tests, all passing
- Tests include:
  - Collapsed/expanded state
  - Search functionality
  - Bilingual term display
  - Related terms display
  - Alphabetical sorting
  - Required FIRE terms present
  - ARIA accessibility
  - Custom className application

## Integration
- Used by: EducationalContentSection component
- Part of: Epic 8 (Educational Content)
- Implements: Requirements from specs/fire-type-explorer/requirements-fire-type-explorer.md

## Accessibility
- Proper ARIA attributes (aria-expanded, aria-controls)
- Semantic HTML (dt/dd for definition lists)
- Label for search input (sr-only for screen readers)
- Keyboard navigable

## Styling
- Gradient header (primary-50 to primary-100)
- Search icon with visual indicator
- Badge-style related terms
- Responsive spacing and typography

## Related Components
- EducationalContentSection - Parent container
- DetailedExplanation - Complementary educational content
- FAQSection - Complementary educational content
