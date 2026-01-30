# Tasks: Project Foundation

## Overview

**Feature**: Project Foundation
**App**: peninganaedalifid.is
**Requirements**: [requirements.md](./requirements.md)
**Design**: [design.md](./design.md)

---

## Task F1: Initialize Next.js Project

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: None

### Description
Create new Next.js project with TypeScript and Tailwind CSS.

### Acceptance Criteria
- [ ] Next.js 14+ project created in `apps/peninganaedalifid`
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS installed and configured
- [ ] Project runs with `npm run dev`

### Implementation Steps

1. Navigate to `apps/` directory
2. Run `npx create-next-app@latest peninganaedalifid --typescript --tailwind --app --src-dir`
3. Verify directory structure matches design
4. Run `npm run dev` to verify project works
5. Update `tsconfig.json` with path aliases (`@/*`)

### Commands
```bash
cd apps
npx create-next-app@latest peninganaedalifid --typescript --tailwind --app --src-dir --no-eslint
cd peninganaedalifid
npm run dev
```

### Files Created
- `apps/peninganaedalifid/` (entire project structure)

---

## Task F2: Configure ESLint and Prettier

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Set up code quality tools for consistent formatting.

### Acceptance Criteria
- [x] ESLint configured with Next.js and TypeScript rules
- [x] Prettier configured
- [x] npm scripts for linting and formatting
- [ ] Editor integration works (VS Code settings) - Manual step required

### Implementation Steps

1. ✅ Install ESLint and Prettier packages
2. ✅ Update `eslint.config.mjs` configuration
3. ✅ Create `.prettierrc` configuration
4. ✅ Add npm scripts: `lint`, `lint:fix`, `format`, `format:check`
5. ⚠️ Create `.vscode/settings.json` for editor integration (manual step)

### Commands
```bash
npm install -D prettier eslint-config-prettier
```

### Files Created/Modified
- ✅ `.prettierrc` (created)
- ✅ `eslint.config.mjs` (updated with Prettier integration)
- ✅ `package.json` (updated with lint and format scripts)
- ⚠️ `.vscode/settings.json` (needs manual creation)

### Context Documentation
- context/modules/CodeQuality.md

### Manual Step Required
Create `.vscode/settings.json` with the following content:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Task F3: Configure Tailwind Theme

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Extend Tailwind configuration with custom design tokens.

### Acceptance Criteria
- [x] Custom color palette added (primary, success, warning, danger)
- [x] Custom font family configured
- [x] Configuration matches design document

### Implementation Steps

1. Update `globals.css` with custom colors using @theme directive (Tailwind 4)
2. Add font family configuration
3. Add any custom spacing if needed
4. Verify colors work in a test component

### Files Modified
- `src/app/globals.css` - Added @theme configuration with custom colors and fonts

### Files Created
- `src/app/page.tsx` - Test page to verify color implementation
- `context/modules/TailwindTheme.md` - Documentation

### Notes
- Tailwind CSS 4.x uses CSS-based configuration via @theme directive
- No traditional tailwind.config.ts file needed
- Colors verified via visual test page

---

## Task F4: Create Utility Functions

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Create essential utility functions for class name merging and number formatting.

### Acceptance Criteria
- [x] `cn()` function for className merging
- [x] Works with Tailwind classes
- [x] Unit tests pass
- [x] Number formatters created (currency, percentage, number)
- [x] Vitest testing framework configured

### Implementation Steps

1. ✅ Install `clsx` and `tailwind-merge`
2. ✅ Install `vitest` and `@vitest/ui`
3. ✅ Create `src/lib/utils/cn.ts`
4. ✅ Create `src/lib/utils/formatters.ts`
5. ✅ Export from index file
6. ✅ Configure Vitest
7. ✅ Write comprehensive unit tests

### Commands
```bash
npm install clsx tailwind-merge
npm install -D vitest @vitest/ui
```

### Files Created
- ✅ `src/lib/utils/cn.ts`
- ✅ `src/lib/utils/formatters.ts`
- ✅ `src/lib/utils/index.ts`
- ✅ `tests/lib/utils/cn.test.ts`
- ✅ `tests/lib/utils/formatters.test.ts`
- ✅ `vitest.config.ts`
- ✅ `package.json` (updated with test scripts)

### Context Documentation
- context/modules/UtilityFunctions.md

---

## Task F5: Create Button Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F3, F4

### Description
Create reusable Button component with variants.

### Acceptance Criteria
- [x] Supports primary, secondary, ghost, danger variants
- [x] Supports sm, md, lg sizes
- [x] Supports loading state with spinner
- [x] Supports disabled state
- [x] Accessible (keyboard, ARIA)

### Implementation Steps

1. ✅ Create `src/components/ui/Button.tsx`
2. ✅ Implement variant styles
3. ✅ Implement size styles
4. ✅ Add loading spinner
5. ✅ Add disabled state
6. ✅ Add proper ARIA attributes
7. ⏸️ Write component tests (deferred)

### Files Created
- ✅ `src/components/ui/Button.tsx` (99 lines)

### Files to Create Later
- `src/components/ui/Button.test.tsx` (tests handled separately)

### Context Documentation
- context/modules/Button.md

---

## Task F6: Create Input Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F3, F4

### Description
Create base text input component.

### Acceptance Criteria
- [x] Supports label
- [x] Supports error state and message
- [x] Supports help text
- [x] Supports required indicator
- [x] Supports disabled state
- [x] Accessible (labels, ARIA)

### Implementation Steps

1. ✅ Create `src/components/ui/Input.tsx`
2. ✅ Implement label rendering
3. ✅ Implement error state styling
4. ✅ Implement help text rendering
5. ✅ Add required indicator (asterisk)
6. ✅ Add proper ARIA attributes
7. ⏸️ Write component tests (to be handled separately)

### Files Created
- ✅ `src/components/ui/Input.tsx`

### Context Documentation
- context/modules/InputComponent.md

---

## Task F7: Create CurrencyInput Component

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: F6

### Description
Create specialized input for currency values.

### Acceptance Criteria
- [ ] Shows formatted currency on blur (e.g., "$1,234.56")
- [ ] Shows raw number while editing
- [ ] Handles paste with formatting
- [ ] Works with controlled value/onChange pattern
- [ ] Accessible

### Implementation Steps

1. Create `src/components/ui/CurrencyInput.tsx`
2. Implement currency formatting on blur
3. Implement raw number on focus
4. Handle paste events
5. Handle keyboard input (only numeric)
6. Extend base Input styling
7. Write component tests

### Files to Create
- `src/components/ui/CurrencyInput.tsx`
- `src/components/ui/CurrencyInput.test.tsx`

---

## Task F8: Create NumberInput Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F6

### Description
Create specialized input for numeric values with validation.

### Acceptance Criteria
- [x] Supports min/max validation
- [x] Shows validation error when out of range
- [x] Supports step increment
- [x] Optional stepper buttons
- [x] Keyboard up/down arrow support
- [x] Accessible

### Implementation Steps

1. ✅ Create `src/components/ui/NumberInput.tsx`
2. ✅ Implement min/max validation
3. ✅ Implement step functionality
4. ✅ Add stepper buttons (optional prop)
5. ✅ Handle keyboard arrows
6. ✅ Extend base Input styling
7. ⏸️ Write component tests (handled separately)

### Files Created
- ✅ `src/components/ui/NumberInput.tsx` (289 lines)

### Files to Create Later
- `src/components/ui/NumberInput.test.tsx` (tests handled separately)

### Context Documentation
- context/modules/NumberInputComponent.md

### Implementation Details
- Controlled component with value/onChange pattern (number type)
- Validates min/max on blur and shows inline error message
- Automatically clamps value to min/max when exceeded
- Optional stepper buttons with `showStepper` prop
- Keyboard arrow up/down support (works even without stepper buttons)
- Configurable step size (default: 1)
- Stepper buttons disabled at min/max bounds
- Extends Input component styling patterns
- Full accessibility with ARIA attributes and labels
- Inline SVG icons for stepper buttons (chevron up/down)
- Handles edge cases: empty input, negative numbers

---

## Task F9: Create Select Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F3, F4

### Description
Create dropdown select component.

### Acceptance Criteria
- [x] Supports label
- [x] Supports options with value/label
- [x] Supports placeholder
- [x] Supports error state
- [x] Keyboard accessible
- [x] Works with controlled value/onChange

### Implementation Steps

1. ✅ Create `src/components/ui/Select.tsx`
2. ✅ Implement native select with custom styling
3. ✅ Add label support
4. ✅ Add placeholder option
5. ✅ Add error state
6. ✅ Style to match other inputs
7. ⏭️ Write component tests (handled separately)

### Files Created
- ✅ `src/components/ui/Select.tsx` (141 lines)

### Implementation Details
- Native HTML select with custom styling for accessibility
- Controlled component with value/onChange pattern
- Custom dropdown arrow icon
- Error state styling matches Input component
- Required field indicator support
- Aria-invalid and aria-describedby for accessibility
- Unique ID generation using React.useId()
- SelectOption interface for type-safe options (value, label, optional description)
- Consistent styling with Input component using Tailwind CSS

---

## Task F10: Create Slider Component

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Medium
**Dependencies**: F3, F4

### Description
Create range slider input component.

### Acceptance Criteria
- [x] Supports min, max, step
- [x] Supports label
- [x] Optional value display
- [x] Custom value formatter
- [x] Accessible (keyboard, ARIA)

### Implementation Steps

1. ✅ Create `src/components/ui/Slider.tsx`
2. ✅ Implement range input with custom styling
3. ✅ Add label support
4. ✅ Add value display option
5. ✅ Add formatValue prop
6. ✅ Style track and thumb
7. ⏭️ Write component tests (handled separately)

### Files Created
- ✅ `src/components/ui/Slider.tsx` (170 lines)
- ✅ `context/modules/Slider.md` - Documentation

### Implementation Details
- Range slider with configurable min, max, step
- Optional label with required indicator
- Optional value display with custom formatting via formatValue prop
- Custom styled track with gradient fill showing progress
- Custom thumb with hover, active, and focus states
- Full keyboard support (arrow keys, page up/down, home/end)
- Complete ARIA attributes for screen readers
- Cross-browser support (webkit and Firefox)
- Uses cn() utility for class merging
- ForwardRef support for parent component control

### Context Documentation
- context/modules/Slider.md

---

## Task F11: Create Card Components

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: F3, F4

### Description
Create Card container components.

### Acceptance Criteria
- [ ] Card with elevated and outlined variants
- [ ] CardHeader for titles
- [ ] CardContent for body
- [ ] CardFooter for actions
- [ ] Consistent padding and border radius

### Implementation Steps

1. Create `src/components/ui/Card.tsx`
2. Implement Card with variants
3. Implement CardHeader
4. Implement CardContent
5. Implement CardFooter
6. Export all from single file
7. Write component tests

### Files to Create
- `src/components/ui/Card.tsx`
- `src/components/ui/Card.test.tsx`

---

## Task F12: Create Alert Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F3, F4

### Description
Create alert message component.

### Acceptance Criteria
- [x] Supports success, error, warning, info variants
- [x] Optional title
- [x] Optional dismiss button
- [x] Icon for each variant
- [x] Accessible (role="alert")

### Implementation Steps

1. ✅ Create `src/components/ui/Alert.tsx`
2. ✅ Implement variant styles
3. ✅ Add optional title
4. ✅ Add dismiss button with callback
5. ✅ Add icons for each variant
6. ✅ Add proper ARIA role
7. Component tests not required (separate task)

### Files Created
- ✅ `src/components/ui/Alert.tsx` (164 lines)

### Context Documentation
- context/modules/AlertComponent.md

---

## Task F13: Create Toast System

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: F3, F4

### Description
Create toast notification system with context.

### Acceptance Criteria
- [ ] ToastProvider context
- [ ] Toast component with variants
- [ ] Auto-dismiss after duration
- [ ] Manual dismiss option
- [ ] Multiple toasts stack
- [ ] useToast hook

### Implementation Steps

1. Create `src/context/ToastContext.tsx`
2. Implement ToastProvider with state
3. Implement addToast and removeToast
4. Create `src/components/ui/Toast.tsx`
5. Implement Toast component with animation
6. Create ToastContainer for positioning
7. Create useToast hook
8. Write tests

### Files to Create
- `src/context/ToastContext.tsx`
- `src/components/ui/Toast.tsx`
- `src/hooks/useToast.ts` (optional, can be in context)

---

## Task F14: Create Tooltip Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F3, F4

### Description
Create tooltip component for additional context.

### Acceptance Criteria
- [x] Shows on hover/focus after delay
- [x] Supports top, right, bottom, left positions
- [x] Dismisses on mouse leave/blur
- [x] Accessible (aria-describedby)

### Implementation Steps

1. ✅ Create `src/components/ui/Tooltip.tsx`
2. ✅ Implement hover/focus trigger
3. ✅ Implement position calculations
4. ✅ Add delay before showing
5. ✅ Add proper ARIA attributes
6. ✅ Style tooltip content
7. ⏭️ Write component tests (handled separately)

### Files Created
- ✅ `src/components/ui/Tooltip.tsx` (109 lines)

### Context Documentation
- context/modules/TooltipComponent.md

### Implementation Details
- Client component with useState, useRef, useEffect hooks
- Configurable delay (default 200ms) before showing tooltip
- Four position options: top, right, bottom, left
- CSS-only positioning using absolute/relative and transforms
- Arrow indicator using CSS border trick
- Smooth fade-in and zoom animations
- Accessible with role="tooltip" and aria-describedby
- Automatic unique ID generation for ARIA
- Cleanup of timeout on unmount
- Keyboard accessible via focus/blur events
- Non-interactive (pointer-events-none) to prevent blocking

---

## Task F15: Create Badge Component

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F3, F4

### Description
Create badge/tag component for status indicators.

### Acceptance Criteria
- [x] Supports success, warning, danger, info, neutral variants
- [x] Supports sm and md sizes
- [x] Inline display

### Implementation Steps

1. ✅ Create `src/components/ui/Badge.tsx`
2. ✅ Implement variant styles
3. ✅ Implement size styles
4. ⚠️ Write component tests (deferred - handled separately)

### Files Created
- `src/components/ui/Badge.tsx` - Badge component with 5 variants and 2 sizes
- `context/modules/Badge.md` - Component documentation

### Implementation Details
- Implemented 5 semantic variants: success, warning, danger, info, neutral
- Implemented 2 sizes: sm (12px text), md (14px text)
- Uses Tailwind CSS 4 theme colors from globals.css
- Inline display using `inline-flex` for text integration
- Subtle borders with opacity for visual distinction
- Rounded corners for modern appearance
- Uses cn() utility for class merging

---

## Task F16: Create UI Components Barrel Export

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F5-F15

### Description
Create barrel export for all UI components.

### Acceptance Criteria
- [x] All components exported from `@/components/ui`
- [x] Clean import syntax works

### Implementation Steps

1. ✅ Create `src/components/ui/index.ts`
2. ✅ Export all components
3. ✅ Verify imports work from other files
4. ✅ Create `src/components/layout/index.ts`
5. ✅ Export all layout components

### Files Created
- ✅ `src/components/ui/index.ts` - Barrel export for all UI components
- ✅ `src/components/layout/index.ts` - Barrel export for all layout components

### Context Documentation
- context/modules/UIBarrelExport.md
- context/modules/LayoutBarrelExport.md

### Implementation Details
**UI Components Exported:**
- Form Components: Button, Input, CurrencyInput, NumberInput, Select, Slider
- Container Components: Card, CardHeader, CardContent, CardFooter
- Feedback Components: Alert, Badge, ToastContainer, Tooltip

**Layout Components Exported:**
- Header, Footer, Container, Section

**Prop Types Exported:**
All component prop types are exported for external use, enabling type-safe component usage throughout the application.

**Usage Example:**
```tsx
import { Button, Input, Card } from '@/components/ui';
import { Container, Section } from '@/components/layout';
```

---

## Task F17: Create Header Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F5, F11

### Description
Create site header with branding and actions.

### Acceptance Criteria
- [x] Shows site logo/title
- [x] Shows export/import buttons (desktop)
- [x] Shows hamburger menu (mobile)
- [x] Responsive layout

### Implementation Steps

1. ✅ Create `src/components/layout/Header.tsx`
2. ✅ Add logo/title
3. ✅ Add export/import buttons
4. ✅ Add mobile hamburger menu
5. ✅ Style responsive breakpoints
6. ✅ Connect to data export/import (placeholder for now)

### Files Created
- ✅ `src/components/layout/Header.tsx` (116 lines)
  - Responsive header with "Life Energy Calculator" title
  - Desktop navigation with Export/Import buttons (md+ breakpoint)
  - Mobile hamburger menu with collapsible full-width buttons
  - Placeholder onClick handlers (console.log)
  - Client component with useState for menu toggle
  - Full accessibility (ARIA labels, semantic HTML)
  - Uses Button component and cn() utility

### Context Documentation
- context/modules/HeaderComponent.md

---

## Task F18: Create Footer Component

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F3

### Description
Create site footer with privacy notice and attribution.

### Acceptance Criteria
- [x] Shows privacy statement
- [x] Shows book attribution
- [x] Shows version number
- [x] Simple, minimal design

### Implementation Steps

1. ✅ Create `src/components/layout/Footer.tsx`
2. ✅ Add privacy statement text
3. ✅ Add book attribution
4. ✅ Add version from env variable
5. ✅ Style consistently

### Files Created
- ✅ `src/components/layout/Footer.tsx` (30 lines)

### Context Documentation
- context/modules/FooterComponent.md

### Implementation Details
- Privacy statement: "Your data stays on your device. We never see your financial information."
- Book attribution: "Inspired by Your Money or Your Life by Vicki Robin"
- Version displayed from env.app.version
- Uses cn() utility for class name merging
- Minimal design with text hierarchy (neutral-700, neutral-500, neutral-400)
- Responsive container with max-width

---

## Task F19: Create Container Component

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F3

### Description
Create max-width container component.

### Acceptance Criteria
- [x] Supports sm, md, lg, xl sizes
- [x] Centers content
- [x] Responsive padding

### Implementation Steps

1. ✅ Create `src/components/layout/Container.tsx`
2. ✅ Implement size variants
3. ✅ Add responsive padding

### Files Created
- ✅ `src/components/layout/Container.tsx` (38 lines)

### Context Documentation
- context/modules/Container.md

### Implementation Details
- Size variants: sm (640px), md (768px), lg (1024px), xl (1280px)
- Default size: lg (1024px)
- Responsive padding: px-4 (mobile), sm:px-6 (640px+), lg:px-8 (1024px+)
- Centered content: mx-auto with w-full
- Uses cn() utility for class name merging
- Supports custom className prop for additional styling

---

## Task F20: Create Section Component

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F3

### Description
Create section component for consistent vertical spacing.

### Acceptance Criteria
- [x] Consistent vertical margins
- [x] Optional title and description
- [x] Clean section separation

### Implementation Steps

1. ✅ Create `src/components/layout/Section.tsx`
2. ✅ Add vertical spacing
3. ✅ Add optional title/description rendering

### Files Created
- `src/components/layout/Section.tsx` - Section component with responsive padding and optional headers
- `context/modules/Section.md` - Component documentation

### Implementation Details
- Responsive vertical padding: `py-8` (mobile), `py-12` (medium breakpoint and up)
- Optional title prop renders as h2 with `text-2xl font-bold text-neutral-900`
- Optional description prop renders with `text-neutral-600`
- Uses `cn()` utility for class name merging
- Semantic HTML with `<section>` element
- Proper TypeScript interface exported for reuse

---

## Task F21: Create useLocalStorage Hook

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Medium
**Dependencies**: F1

### Description
Create generic hook for localStorage persistence.

### Acceptance Criteria
- [x] SSR-safe (no errors during server render)
- [x] Debounced writes
- [x] Error handling
- [x] Loading state for hydration
- [x] Type-safe with generics

### Implementation Steps

1. ✅ Create `src/hooks/useLocalStorage.ts`
2. ✅ Implement SSR check
3. ✅ Implement initial value loading
4. ✅ Implement debounced setValue
5. ✅ Implement error handling
6. ✅ Add loading state
7. ⏭️ Write unit tests (handled separately)

### Files Created
- ✅ `src/hooks/useLocalStorage.ts` (195 lines)
- ✅ `src/hooks/index.ts` (barrel export)

### Context Documentation
- context/modules/UseLocalStorageHook.md

### Implementation Details
- SSR-safe: Returns initial value during server render, loads from localStorage on client mount
- Generic type parameter: `useLocalStorage<T>(key, initialValue, options?)`
- Returns tuple: `[value, setValue, { isLoading, error }]`
- Debounced writes: 300ms default, configurable via `options.debounceMs`
- Error handling: Catches all errors, optional `options.onError` callback
- Loading state: Tracks initial hydration from localStorage
- Cleanup: Clears debounce timer on unmount, prevents state updates after unmount
- Uses `safeGetItem` and `safeSetItem` from storage adapter
- Supports updater functions: `setValue(prev => newValue)`
- Full TypeScript support with exported types

---

## Task F22: Create Storage Adapter

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Create safe localStorage wrapper functions.

### Acceptance Criteria
- [x] safeGetItem with error handling
- [x] safeSetItem with error handling
- [x] safeRemoveItem with error handling
- [x] All functions are SSR-safe

### Implementation Steps

1. ✅ Create `src/lib/storage/localStorage.ts`
2. ✅ Implement safeGetItem
3. ✅ Implement safeSetItem
4. ✅ Implement safeRemoveItem
5. ⚠️ Write unit tests (will be handled separately as per instructions)

### Files Created
- ✅ `src/lib/storage/localStorage.ts` (97 lines)
- ✅ `src/lib/storage/index.ts` (7 lines)

### Context Documentation
- context/modules/StorageAdapter.md

### Implementation Details
- All functions check `typeof window !== 'undefined'` for SSR safety
- All localStorage operations wrapped in try-catch blocks
- Generic type parameter `<T>` on safeGetItem for type safety
- Console warnings for debugging without breaking the app
- Returns null/false on errors for graceful degradation

---

## Task F23: Create Export/Import Functions

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F22

### Description
Create data export and import functionality.

### Acceptance Criteria
- [x] exportData downloads JSON file
- [x] importData reads and validates file
- [x] Version migration supported
- [x] Clear error messages for invalid files

### Implementation Steps

1. ✅ Create `src/lib/storage/exportImport.ts`
2. ✅ Implement exportData function
3. ✅ Implement importData function
4. ✅ Implement isValidStoredState validator
5. ✅ Implement migrateState function
6. ⏸️ Write unit tests (handled separately)

### Files Created
- ✅ `src/lib/storage/exportImport.ts` (234 lines)
- ✅ `src/lib/storage/index.ts` (updated to export new functions)

### Context Documentation
- context/modules/ExportImportFunctions.md

### Implementation Details
- **exportData(data)**: Creates JSON blob, adds metadata (version, exportedAt, appVersion), triggers download with filename format `life-energy-data-{date}.json`
- **importData(file)**: Reads file as text, parses JSON, validates with isValidStoredState, migrates to current version, returns StoredState or throws descriptive error
- **isValidStoredState(data)**: Type guard that validates object has version field (string), optional exportedAt and appVersion fields with correct types
- **migrateState(data)**: Compares versions using semantic versioning, migrates data to current version (1.0.0), preserves all data
- **StoredState interface**: Defines structure with version, exportedAt, appVersion, ready for future feature data fields
- All error messages are user-friendly and actionable
- Browser-only code (uses FileReader, Blob, URL APIs)

---

## Task F24: Create Root Layout

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F13, F17, F18

### Description
Set up the root layout with providers and structure.

### Acceptance Criteria
- [x] HTML lang attribute set
- [x] Proper body structure
- [x] ToastProvider wrapping app
- [x] Header and Footer included
- [x] Metadata configured

### Implementation Steps

1. ✅ Update `src/app/layout.tsx`
2. ✅ Add ToastProvider
3. ✅ Add flex layout structure
4. ✅ Add Header and Footer
5. ✅ Configure metadata (title, description, OG)
6. ✅ Add global styles if needed

### Files Modified
- ✅ `src/app/layout.tsx` (45 lines)

### Context Documentation
- context/modules/RootLayout.md

### Implementation Details
- HTML lang="en" attribute set for accessibility
- ToastProvider wraps entire app for global toast notifications
- Flex layout: min-h-screen flex flex-col structure
- Header at top, main with flex-1, Footer at bottom
- Metadata: title "Life Energy Calculator" with full description
- Maintained existing Geist font imports (geistSans, geistMono)
- Used Tailwind CSS classes for layout structure

### Additional Fixes During Implementation
- Fixed ToastContext TypeScript strict mode error (duration handling)
- Fixed CookieConsent gtag type conflicts (removed duplicate declaration)

---

## Task F25: Create Home Page Placeholder

**Status**: [x] Complete - Completed 2026-01-19
**Estimated Complexity**: Simple
**Dependencies**: F24

### Description
Create placeholder home page ready for calculator.

### Acceptance Criteria
- [x] Shows site title/hero
- [x] Shows placeholder for calculator
- [x] Responsive layout works

### Implementation Steps

1. ✅ Update `src/app/page.tsx`
2. ✅ Add hero section with title
3. ✅ Add placeholder content
4. ✅ Verify layout works

### Files Modified
- ✅ `src/app/page.tsx` (158 lines)

### Context Documentation
- context/modules/HomePage.md

### Implementation Details
- Hero section with gradient background (primary-50 to neutral-50)
- Title: "Life Energy Calculator" with responsive text sizing (4xl → 5xl → 6xl)
- Subtitle: "Discover your true hourly wage and take control of your life energy"
- Description explaining app purpose and book attribution
- Calculator placeholder card with "Coming Soon" message and calculator icon
- Animated "Work in progress" indicator with pulsing dot
- Three feature highlight cards:
  1. Private & Secure (lock icon, success color)
  2. Accurate Calculations (chart icon, primary color)
  3. Life Energy Insights (lightning icon, warning color)
- Uses Container, Section, and Card components
- Fully responsive with mobile-first breakpoints
- Inline SVG icons from Heroicons outline set
- Semantic HTML with proper heading hierarchy

---

## Task F26: Set Up Testing Framework

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Configure Vitest for unit and component testing.

### Acceptance Criteria
- [ ] Vitest installed and configured
- [ ] React Testing Library set up
- [ ] Test script works
- [ ] Coverage report works

### Implementation Steps

1. Install Vitest and related packages
2. Create `vitest.config.ts`
3. Create `src/test/setup.ts` for global setup
4. Add test scripts to package.json
5. Verify with a sample test

### Commands
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### Files to Create
- `vitest.config.ts`
- `src/test/setup.ts`

---

## Task F27: Write Foundation Tests

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
**Estimated Complexity**: Medium
**Dependencies**: F5-F23, F26

### Description
Write tests for all foundation components and utilities.

### Acceptance Criteria
- [ ] All UI components have render tests
- [ ] Storage functions have unit tests
- [ ] Hooks have unit tests
- [ ] Tests pass

### Implementation Steps

1. Write tests for each UI component
2. Write tests for storage functions
3. Write tests for useLocalStorage hook
4. Run test suite and fix any failures

### Files to Create
- Various `.test.ts` and `.test.tsx` files

---

---

## Task F28: Create Google Analytics Integration

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F1, F32

### Description
Set up Google Analytics 4 tracking.

### Acceptance Criteria
- [x] GA4 script loads via next/script
- [x] Custom event tracking hook available
- [x] No sensitive financial data tracked
- [x] Type-safe implementation

### Implementation Steps

1. ✅ Create `src/components/analytics/GoogleAnalytics.tsx`
2. ✅ Create `src/hooks/useAnalytics.ts`
3. ✅ Create barrel export `src/components/analytics/index.ts`
4. ✅ Update hooks barrel export
5. ⚠️ GA_ID already in environment variables (F32)
6. ⏭️ RouteTracker and root layout integration (separate task)

### Files Created
- ✅ `src/components/analytics/GoogleAnalytics.tsx` (39 lines)
- ✅ `src/hooks/useAnalytics.ts` (66 lines)
- ✅ `src/components/analytics/index.ts` (4 lines)

### Files Modified
- ✅ `src/hooks/index.ts` (added useAnalytics export)

### Context Documentation
- context/modules/GoogleAnalyticsIntegration.md

### Implementation Details
- GoogleAnalytics component uses next/script with strategy="afterInteractive"
- Loads gtag.js from Google CDN
- Initializes with env.ga.id from environment configuration
- Only renders if env.ga.isEnabled is true (conditional rendering)
- useAnalytics hook provides:
  - trackEvent(eventName, parameters) - type-safe event tracking
  - trackPageView(url) - manual page view tracking
- Type-safe window.gtag declaration with TypeScript
- SSR-safe implementation (checks for window object)
- Error handling for graceful degradation
- No RouteTracker component created (can be added later if needed)

---

## Task F29: Create AdSense Integration

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F1, F19

### Description
Set up Google AdSense with ad placement components.

### Acceptance Criteria
- [x] AdSense script loads asynchronously
- [x] AdUnit component renders ads
- [x] Ad blocker handled gracefully
- [x] Responsive ad formats work
- [x] Empty ad slots collapse

### Implementation Steps

1. [x] Create `src/components/ads/AdSenseScript.tsx`
2. [x] Create `src/components/ads/AdUnit.tsx`
3. [x] Add ADSENSE_ID to environment variables (already done in F32)
4. [ ] Add AdSenseScript to root layout (separate task)
5. [ ] Test with AdSense test mode (manual verification)

### Files Created
- [x] `src/components/ads/AdSenseScript.tsx` (26 lines)
- [x] `src/components/ads/AdUnit.tsx` (79 lines)
- [x] `src/components/ads/index.ts` (7 lines)

### Context Documentation
- context/modules/AdSenseIntegration.md

### Implementation Details
- AdSenseScript component loads Google AdSense script via Next.js Script component
- Uses strategy="afterInteractive" for optimal performance
- Only renders if env.adsense.isEnabled is true
- AdUnit component renders individual ad placements with <ins> element
- Props: slot (string), format ('auto'|'horizontal'|'vertical'|'rectangle'), className
- Graceful ad blocker handling with try-catch around adsbygoogle.push
- Automatic collapse via CSS if ad fails to load (min-h-0 overflow-hidden)
- Full responsive ad support with data-full-width-responsive="true"
- Client components with useEffect for browser-side initialization
- TypeScript interfaces exported for type safety

---

## Task F30: Create Page Layout with Ad Zones

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Medium
**Dependencies**: F17, F18, F19, F29

### Description
Create layout component with designated ad placement zones.

### Acceptance Criteria
- [x] Header ad zone (below nav)
- [x] Sidebar ad zones (desktop only)
- [x] In-content ad zone support
- [x] Footer ad zone
- [x] Responsive - sidebar hidden on mobile
- [x] Ad zones configurable per page

### Implementation Steps

1. ✅ Create `src/components/layout/PageLayout.tsx`
2. ✅ Add header ad zone
3. ✅ Add sidebar with ad slots (desktop)
4. ✅ Add footer ad zone
5. ✅ Make ad zones optional via props
6. ✅ Test responsive behavior

### Files Created
- ✅ `src/components/layout/PageLayout.tsx` (145 lines)

### Context Documentation
- context/modules/PageLayout.md

### Implementation Details
- Created PageLayout component with three configurable ad zones:
  - Header ad zone: Full-width banner below navigation (showHeaderAd prop)
  - Sidebar ad zones: Two ad slots (300x250, 300x600) on desktop only (showSidebarAds prop)
  - Footer ad zone: Full-width banner above footer (showFooterAd prop)
- All ad zones are optional and controlled via boolean props (default: false)
- Responsive design: sidebar hidden on mobile (< 1024px), visible on desktop (lg: breakpoint)
- Sidebar uses sticky positioning for better ad viewability during scroll
- Integration with env.adsense.isEnabled - ads only render when configured
- Uses Container component (xl size) for consistent max-width content
- Uses AdUnit component with appropriate slot IDs and formats
- Proper flex layout with main content (flex-1 min-w-0) and fixed 300px sidebar
- Ad containers styled with borders, backgrounds, and padding for visual separation
- Follows design specification from project-foundation/design.md (Part 6: Advertising & Analytics)

---

## Task F31: Create Cookie Consent Banner

**Status**: [x] Complete (2026-01-19)
**Estimated Complexity**: Simple
**Dependencies**: F5, F21

### Description
Create optional cookie consent banner for GDPR compliance.

### Acceptance Criteria
- [x] Banner shows on first visit
- [x] Accept/Decline buttons
- [x] Preference stored in localStorage
- [x] Controls analytics and ad personalization
- [x] Can be dismissed

### Implementation Steps

1. ✅ Create `src/components/CookieConsent.tsx`
2. ✅ Implement consent state management
3. ✅ Connect to analytics (disable if declined)
4. ✅ Store preference in localStorage
5. ⏭️ Add to root layout (handled separately in F24)

### Files Created
- ✅ `src/components/CookieConsent.tsx` (173 lines)
  - CookieConsent component with Accept/Decline buttons
  - getConsentStatus() function to check current consent state
  - Direct localStorage integration with key 'cookie-consent'
  - Google Analytics Consent Mode integration
  - Responsive design with smooth animations
  - Full accessibility support (ARIA attributes)

### Context Documentation
- context/modules/CookieConsent.md

### Implementation Details
- Client component with SSR-safe initialization
- Fixed position at bottom of screen with z-50
- Slide-in animation from bottom
- Stores consent as 'accepted', 'declined', or 'pending'
- Integrates with window.gtag for Google Analytics consent signals
- Responsive layout (stacked on mobile, inline on desktop)
- Uses Button component from @/components/ui/Button
- Uses cn() utility for class name merging
- TypeScript type declaration for window.gtag
- Graceful error handling for localStorage failures

---

## Task F32: Create Environment Configuration - Completed 2026-01-19

**Status**: [x] Complete
**Estimated Complexity**: Simple
**Dependencies**: F1

### Description
Set up environment variables for analytics and ads.

### Acceptance Criteria
- [x] .env.example with all required variables
- [x] .env.local in .gitignore (verified - already covered by .env*)
- [x] TypeScript types for env variables
- [x] Conditional loading based on env

### Implementation Details
- Implemented: .env.example, src/types/env.d.ts, src/lib/env.ts
- Tests: src/lib/__tests__/env.test.ts
- Context: context/modules/EnvironmentConfig.md

### Implementation Steps

1. Create `.env.example` with placeholder variables
2. Add `.env.local` to `.gitignore`
3. Create `src/types/env.d.ts` for type definitions
4. Update next.config.js if needed

### Files to Create
- `.env.example`
- `src/types/env.d.ts`

### Files to Modify
- `.gitignore`

---

## Summary

| Task | Description | Complexity | Dependencies |
|------|-------------|------------|--------------|
| F1 | Initialize Next.js Project | Simple | None |
| F2 | Configure ESLint/Prettier | Simple | F1 |
| F3 | Configure Tailwind Theme | Simple | F1 |
| F4 | Create Utility Functions | Simple | F1 |
| F5 | Create Button Component | Simple | F3, F4 |
| F6 | Create Input Component | Simple | F3, F4 |
| F7 | Create CurrencyInput | Medium | F6 |
| F8 | Create NumberInput | Medium | F6 |
| F9 | Create Select Component | Medium | F3, F4 |
| F10 | Create Slider Component | Medium | F3, F4 |
| F11 | Create Card Components | Simple | F3, F4 |
| F12 | Create Alert Component | Simple | F3, F4 |
| F13 | Create Toast System | Medium | F3, F4 |
| F14 | Create Tooltip Component | Medium | F3, F4 |
| F15 | Create Badge Component | Simple | F3, F4 |
| F16 | Create UI Barrel Export | Simple | F5-F15 |
| F17 | Create Header Component | Simple | F5, F11 |
| F18 | Create Footer Component | Simple | F3 |
| F19 | Create Container Component | Simple | F3 |
| F20 | Create Section Component | Simple | F3 |
| F21 | Create useLocalStorage Hook | Medium | F1 |
| F22 | Create Storage Adapter | Simple | F1 |
| F23 | Create Export/Import | Medium | F22 |
| F24 | Create Root Layout | Simple | F13, F17, F18 |
| F25 | Create Home Page Placeholder | Simple | F24 |
| F26 | Set Up Testing Framework | Simple | F1 |
| F27 | Write Foundation Tests | Medium | F5-F23, F26 |
| F28 | Google Analytics Integration | Simple | F1 |
| F29 | AdSense Integration | Medium | F1, F19 |
| F30 | Page Layout with Ad Zones | Medium | F17-F19, F29 |
| F31 | Cookie Consent Banner | Simple | F5, F21 |
| F32 | Environment Configuration | Simple | F1 |

**Total Tasks**: 32
**Critical Path**: F1 → F3/F4 → F5-F15 → F16 → F17-F20 → F24 → F25

---

## Implementation Order

### Phase A: Project Setup (Tasks F1-F4)
1. F1: Initialize Next.js
2. F2: ESLint/Prettier
3. F3: Tailwind Theme
4. F4: Utility Functions

### Phase B: UI Components (Tasks F5-F16)
Can be done in parallel after Phase A:
- F5: Button
- F6: Input
- F11: Card
- F12: Alert
- F15: Badge
- F9: Select

Then:
- F7: CurrencyInput (needs F6)
- F8: NumberInput (needs F6)
- F10: Slider
- F13: Toast System
- F14: Tooltip
- F16: Barrel Export (needs all UI)

### Phase C: Layout (Tasks F17-F20)
After F5 and F11:
- F17: Header
- F18: Footer
- F19: Container
- F20: Section

### Phase D: Data Persistence (Tasks F21-F23)
After F1:
- F22: Storage Adapter
- F21: useLocalStorage Hook
- F23: Export/Import

### Phase E: Assembly (Tasks F24-F25)
After Phases B, C, D:
- F24: Root Layout
- F25: Home Page

### Phase F: Testing (Tasks F26-F27)
- F26: Testing Framework (can start after F1)
- F27: Write Tests (after all components done)

### Phase G: Analytics & Ads (Tasks F28-F32)
After F1:
- F32: Environment Configuration
- F28: Google Analytics Integration

After Phase C (Layout):
- F29: AdSense Integration
- F30: Page Layout with Ad Zones
- F31: Cookie Consent Banner
