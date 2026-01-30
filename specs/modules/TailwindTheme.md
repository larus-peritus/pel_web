# Tailwind Theme Configuration

## Location
`apps/peninganaedalifid/src/app/globals.css`

## Purpose
Defines custom design tokens for the Tailwind CSS 4 configuration using the @theme directive. Provides a consistent color palette and typography system for the entire application.

## Configuration

### Color Palette

**Primary Colors (Blue)**
- 50-900: Complete blue color scale from lightest to darkest
- Used for: Interactive elements, branding, primary actions

**Success Colors (Green)**
- 50, 500, 600: Green color variants
- Used for: Success messages, positive feedback, confirmation states

**Warning Colors (Amber)**
- 50, 500, 600: Amber/orange color variants
- Used for: Warning messages, caution states, important notices

**Danger Colors (Red)**
- 50, 500, 600: Red color variants
- Used for: Error messages, destructive actions, critical alerts

### Typography

**Font Family**
- Sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- Provides clean, modern typography with excellent fallback support

## Usage

Colors can be used with Tailwind utility classes:

```tsx
// Backgrounds
<div className="bg-primary-500">Primary background</div>
<div className="bg-success-50">Success light background</div>

// Text
<p className="text-primary-600">Primary text</p>
<p className="text-danger-500">Error text</p>

// Borders
<div className="border border-warning-500">Warning border</div>

// Font
<p className="font-sans">Uses Inter font family</p>
```

## Design Decisions

1. **Tailwind CSS 4 Approach**: Uses the new @theme directive in CSS instead of JavaScript config
2. **Limited Color Scales**: Success, warning, and danger only have 3 shades (50, 500, 600) to keep the palette focused
3. **Primary Full Scale**: Primary color has full 50-900 scale for maximum flexibility
4. **System Font Fallbacks**: Comprehensive font stack ensures text renders well on all platforms

## Related Files
- `src/app/globals.css` - Theme configuration
- `src/app/page.tsx` - Color test page (temporary)

## Integration
- Used by: All UI components will use these color tokens
- Part of: Project Foundation (Task F3)

## Implements
- US-F12: Color Palette (from requirements)
- US-F13: Typography (from requirements)

## Notes
- Colors meet WCAG 2.1 AA contrast ratios
- Font family uses Inter for primary sans-serif
- Theme is configured for Tailwind CSS 4.x
- No traditional tailwind.config.ts file needed
