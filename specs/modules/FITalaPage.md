# FI-tala Page (Route Component)

## Location
`apps/peninganaedalifid/src/app/fi-tala/page.tsx`

## Purpose
Next.js App Router page component for the FI Number Builder Calculator. Creates the `/fi-tala` route with proper provider wrapping, suspense boundaries, and SEO metadata.

## Route Information
- **Path**: `/fi-tala`
- **Title**: FI-tala reiknivél | Peningana Edal Ifið
- **Description**: Reiknaðu þína FI-tölu (fjárhagslegt sjálfstæði) byggt á útgjöldum og margfaldara

## Component Structure

### Main Export
`FITalaPage` - Default export page component

### Key Features
1. **CalculatorProvider Wrapper**
   - Ensures calculator context is available
   - Manages shared state across components

2. **Suspense Boundary**
   - Loading fallback with skeleton UI
   - Smooth loading experience

3. **FINumberBuilderCalculator**
   - Main calculator component
   - Includes its own hero section

4. **Privacy Notice**
   - Icelandic privacy statement
   - Emphasizes client-side calculations

### Loading Fallback
- Animated pulse skeleton
- 3 placeholder elements (heading, subtitle, content)
- Container with proper sizing

## SEO Metadata
```typescript
{
  title: 'FI-tala reiknivél | Peningana Edal Ifið',
  description: 'Reiknaðu þína FI-tölu (fjárhagslegt sjálfstæði) byggt á útgjöldum og margfaldara'
}
```

## Dependencies
- `@/context/CalculatorContext` - Calculator state management
- `@/components/fiNumber/FINumberBuilderCalculator` - Main calculator
- `@/components/layout/Container` - Layout wrapper

## Integration
- Part of: FI Number Builder feature (Epic 9)
- Implements: Task 9.1 from specs/fi-number-builder/tasks-fi-number-builder.md
- Related routes: `/utgjaldareiknivel` (Expense Baseline)

## Pattern
Follows the same structure as other calculator routes:
- `utgjaldareiknivel/page.tsx` - Expense Baseline
- `sparnadarskyrsla/page.tsx` - Savings Report
- Similar provider wrapping and suspense pattern

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy (handled by nested component)
- Loading state announced to screen readers

## Performance
- Client-side rendering with 'use client'
- Suspense boundary prevents layout shift
- Component code-split via dynamic import

## Related Files
- Main calculator: `src/components/fiNumber/FINumberBuilderCalculator.tsx`
- Context: `src/context/CalculatorContext.tsx`
- Types: `src/types/fiNumber.ts`
- Navigation: `src/components/calculator/CalculatorPageContent.tsx`
