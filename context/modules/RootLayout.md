# Root Layout

## Location
`apps/peninganaedalifid/src/app/layout.tsx`

## Purpose
Provides the root HTML structure and layout for the entire application with providers, header, and footer components.

## Structure

### HTML Document
- Sets `lang="en"` attribute on HTML element for accessibility
- Includes Geist Sans and Geist Mono font configurations
- Body includes font variables and antialiasing

### Layout Architecture
```
<html lang="en">
  <body>
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  </body>
</html>
```

## Key Features

### Flex Layout
- Uses `min-h-screen flex flex-col` for full-height layout
- Header at top (fixed height based on content)
- Main content area with `flex-1` (grows to fill available space)
- Footer at bottom (fixed height based on content)
- Ensures footer stays at bottom even with minimal content

### Provider Wrapping
- **ToastProvider**: Wraps entire app to provide toast notification context
- Enables any component to use `useToast()` hook for notifications

### Component Integration
- **Header**: Site branding and navigation with Export/Import actions
- **Footer**: Privacy statement, book attribution, version info
- Both components are responsive and consistent across all pages

## Metadata

```typescript
export const metadata: Metadata = {
  title: "Life Energy Calculator",
  description: "Calculate your actual hourly wage and understand the true cost of your work in life energy. Inspired by Your Money or Your Life by Vicki Robin.",
};
```

### SEO Properties
- Clear, descriptive title
- Comprehensive description for search engines
- Ready for Open Graph tags (future enhancement)

## Dependencies
- `@/context/ToastContext` - Toast notification provider
- `@/components/layout/Header` - Site header component
- `@/components/layout/Footer` - Site footer component
- `next/font/google` - Geist fonts
- `next` - Metadata type

## Font Configuration
- **Geist Sans**: Primary UI font (variable: `--font-geist-sans`)
- **Geist Mono**: Monospace font for code (variable: `--font-geist-mono`)
- Both fonts loaded from Google Fonts with Latin subset

## Styling
- Uses Tailwind CSS classes for layout
- Font variables applied to body for cascading
- Antialiasing enabled for smooth text rendering
- Global styles from `./globals.css`

## Related
- Implements: Requirements US-F7 (Layout Components) from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md (Part 5: Root Layout)
- Task: F24 from specs/project-foundation/tasks.md

## Usage Notes
- This is the root layout for all pages in the app
- Any page can access toast notifications via `useToast()` hook
- Layout is responsive by default (Header and Footer handle breakpoints)
- Minimum viewport height ensures proper layout on all screen sizes
