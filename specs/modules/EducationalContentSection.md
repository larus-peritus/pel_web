# EducationalContentSection Component

## Location
`apps/peninganaedalifid/src/components/fireTypes/EducationalContentSection.tsx`

## Purpose
Container component organizing all FIRE educational content with tabbed navigation, print functionality, and collapsible sections.

## Exports
- `EducationalContentSection` - React component for educational content container
- `EducationalContentSectionProps` - TypeScript interface for component props

## Key Functionality
- **Collapsible Main Section**: Expandable "Fræðsluefni" section
- **Tabbed Navigation**: 3 tabs for different content types
- **Print-Friendly**: Dedicated print button and print-optimized layout
- **Smart Tab Management**: Conditionally enables/disables based on context
- **External Resources**: Quick links footer to FIRE communities
- **Responsive Design**: Works on all screen sizes
- **Logical Hierarchy**: Clear heading structure and organization

## Props Interface
```typescript
interface EducationalContentSectionProps {
  selectedFireType?: FIRETypeId | null; // Optional selected FIRE type
  className?: string;                     // Optional CSS classes
}
```

## Tab Structure
### 1. Ítarlegar upplýsingar (Details)
- Icon: 📖
- Component: `DetailedExplanation`
- Enabled: Only when selectedFireType is provided
- Disabled state: Shows tooltip "Veldu FIRE tegund fyrst"
- Content: Full details about specific FIRE type

### 2. Algengar spurningar (FAQ)
- Icon: ❓
- Component: `FAQSection`
- Always enabled
- Default active when no FIRE type selected
- Content: 14 frequently asked questions

### 3. Orðalisti (Glossary)
- Icon: 📚
- Component: `GlossarySection`
- Always enabled
- Content: 18 FIRE terminology terms

## Features
### Print Functionality
- Print button in action bar
- Calls `window.print()` on click
- Print-only content shows all sections simultaneously
- Page breaks between major sections
- Print-specific styles:
  - `.print:hidden` - Hide on print
  - `.print:block` - Show on print
  - `.print:shadow-none` - Remove shadows
  - `.print:bg-white` - White backgrounds
  - `.page-break-before` - Page break control

### Tab Management
- Active tab state management
- Conditional tab enabling based on props
- Visual indication of active tab (indigo-600 border)
- Smooth transitions between tabs
- `aria-current="page"` for active tab

### Footer Quick Links
- Mr. Money Mustache - Getting Started
- r/FIREyFI - Íslenskt FIRE samfélag
- r/financialindependence FAQ
- Mad Fientist - Advanced Strategies
- All links open in new tab with security attributes

## State Management
- `isExpanded` (boolean) - Controls main section visibility
- `activeTab` ('details' | 'glossary' | 'faq') - Current active tab
- Default tab logic:
  - If selectedFireType exists → 'details'
  - If no selectedFireType → 'faq'

## Dependencies
- `@/components/ui/Card` - Container component
- `@/components/ui/Button` - Print button
- `@/lib/utils` - cn utility
- `./DetailedExplanation` - Details tab content
- `./GlossarySection` - Glossary tab content
- `./FAQSection` - FAQ tab content
- `@/types/fireTypes` - FIRETypeId type

## Component Structure
```
<Card>
  <Header (collapsible)>
    Title + Description
    Expand/Collapse Icon
  </Header>

  {isExpanded && (
    <>
      <ActionBar>
        Helper Text
        Print Button
      </ActionBar>

      <TabNavigation>
        Details Tab (conditional)
        FAQ Tab
        Glossary Tab
      </TabNavigation>

      <TabContent>
        {activeTab === 'details' && <DetailedExplanation />}
        {activeTab === 'faq' && <FAQSection />}
        {activeTab === 'glossary' && <GlossarySection />}
      </TabContent>

      <PrintOnlyContent>
        All sections for comprehensive print
      </PrintOnlyContent>

      <Footer>
        Quick Links to Resources
      </Footer>
    </>
  )}
</Card>
```

## Tests
- Location: `src/components/fireTypes/__tests__/EducationalContentSection.test.tsx`
- Coverage: 25 tests, all passing
- Tests include:
  - Collapsed/expanded states
  - Default tab selection logic
  - Tab navigation
  - Tab enabling/disabling
  - Component rendering in tabs
  - Print button functionality
  - External resource links
  - ARIA attributes
  - Tooltip display
  - Prop changes handling
  - Tab state persistence
  - Heading hierarchy

## Print Behavior
### On Screen
- Only active tab content visible
- Print button available
- Tab navigation visible

### On Print
- All sections expanded and visible
- Tab navigation hidden
- Print button hidden
- Page breaks between sections
- Clean, professional layout

## Accessibility
- Proper role="navigation" for tabs
- role="tabpanel" for content areas
- aria-expanded for collapsible header
- aria-controls linking tabs to content
- aria-current="page" for active tab
- aria-disabled for disabled tabs
- Semantic heading hierarchy (h2 → h3 → h4)

## Styling
- Gradient header (indigo-50 to indigo-100)
- Tab underline for active state (indigo-600)
- Smooth transitions (duration-200)
- Responsive design
- Print-specific CSS

## Animation
- fadeIn animation for tab content
- 0.3s ease-out transition
- Translateebringing/opacity animation

## Integration
- Parent of: DetailedExplanation, GlossarySection, FAQSection
- Part of: Epic 8 (Educational Content)
- Used in: FIRE Type Explorer main page
- Implements: Requirements from specs/fire-type-explorer/requirements-fire-type-explorer.md

## Related Components
- DetailedExplanation - Details tab content
- GlossarySection - Glossary tab content
- FAQSection - FAQ tab content
- Card - Container component
- Button - Print button

## Usage Example
```tsx
// With selected FIRE type (shows details tab)
<EducationalContentSection selectedFireType="regularfire" />

// Without selected FIRE type (shows FAQ tab)
<EducationalContentSection />

// With custom className
<EducationalContentSection
  selectedFireType="coastfire"
  className="mt-8"
/>
```

## External Resources Provided
1. **r/FIREyFI**: Icelandic FIRE community on Reddit
2. **Mr. Money Mustache**: Getting Rich from Zero to Hero
3. **r/FI FAQ**: Comprehensive financial independence guide
4. **Mad Fientist**: Advanced FIRE strategies and tax optimization

## Notes
- JSX warning about `jsx` and `global` props (from styled-jsx) is expected and harmless
- Component handles missing selectedFireType gracefully
- Tab state persists through expand/collapse cycles
- Print functionality works across all browsers
