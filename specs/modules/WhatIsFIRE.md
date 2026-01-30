# WhatIsFIRE Component

## Location
`src/components/fireTypes/WhatIsFIRE.tsx`

## Purpose
Educational introduction to the FIRE movement and FIRE Type Explorer tool. Provides context about FIRE, why users should explore different types, and how to use the tool. Collapsible/expandable with dismissible functionality and localStorage persistence.

## Key Features
- Brief FIRE movement introduction
- "Why explore FIRE types" section with 3 key reasons
- "How to use this tool" section with 4 numbered steps
- Key principle explanation (25-30x annual expenses rule)
- Collapsible/expandable accordion
- Dismissible with localStorage preference
- "Show info again" functionality
- CTA button to collapse content
- Gradient orange/amber visual design
- Responsive layout

## Exports
- `WhatIsFIRE` - Main component

## Props
```typescript
interface WhatIsFIREProps {
  defaultExpanded?: boolean;  // Start expanded or collapsed (default: true)
  onDismiss?: () => void;     // Callback when dismissed
}
```

## localStorage Key
`fireExplorer_whatIsFIRE_dismissed` - Stores "true" when user dismisses component

## State Management
- `isExpanded` - Controls accordion expansion
- `isDismissed` - Controls visibility (hidden when dismissed)

## Functions
- `handleDismiss()` - Saves preference to localStorage and hides component
- `handleShowAgain()` - Clears localStorage preference and shows component expanded
- localStorage operations wrapped in try/catch for error handling

## Content Sections
1. Introduction: What FIRE is and the goal of freedom to choose
2. Why explore FIRE types:
   - No one right path
   - Realistic goals
   - Flexibility
3. How to use this tool:
   - Step 1: Review types
   - Step 2: Enter your numbers
   - Step 3: Compare options
   - Step 4: Choose your path
4. Key Principle: 25-30x annual expenses, 3-4% safe withdrawal rate

## Error Handling
All localStorage operations (getItem, setItem, removeItem) wrapped in try/catch with console.warn fallback. Component continues to function even if localStorage fails.

## Dependencies
- `@/components/ui/Alert` - Key principle alert
- `@/components/ui/Button` - CTA button
- `lucide-react` - Icons (ChevronDown, ChevronUp, X, Flame, Target, Map, TrendingUp)

## Tests
- Location: tests/components/fireTypes/WhatIsFIRE.test.tsx
- Coverage: 36 tests covering rendering, expansion, content, dismiss functionality, localStorage, CTA, accessibility, edge cases

## Related
- Implements: Epic 3, Task 3.4 (specs/fire-type-explorer/)
- Displayed at: Top of FIRE Type Explorer page
- Educational companion to: FIRETypeDefinitionsSection
