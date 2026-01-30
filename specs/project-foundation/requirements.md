# Requirements: Project Foundation

## Overview

**Feature**: Project Foundation
**App**: peninganaedalifid.is
**Priority**: Phase 1 - Foundation (Before MVP Features)

This document covers the foundational requirements for the project including setup, base UI components, layout, and data persistence.

---

## Part 1: Project Setup

### US-F1: Next.js Project Structure
**As a** developer,
**I want** a well-structured Next.js project with TypeScript and Tailwind,
**So that** I can efficiently build and maintain the application.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** use Next.js 14+ with App Router.
2. **The system shall** use TypeScript with strict mode enabled.
3. **The system shall** use Tailwind CSS for styling.
4. **The system shall** have ESLint and Prettier configured.
5. **The system shall** be deployable to Vercel with zero configuration.
6. **The system shall** have a clear directory structure following Next.js conventions.

### US-F2: Development Environment
**As a** developer,
**I want** a productive development environment,
**So that** I can develop efficiently with fast feedback.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** support hot module replacement (HMR).
2. **The system shall** show TypeScript errors inline.
3. **The system shall** have a `dev` script that starts the development server.
4. **The system shall** have a `build` script that creates a production build.
5. **The system shall** have a `test` script that runs the test suite.

---

## Part 2: Base UI Components

### US-F3: Input Components
**As a** user,
**I want** consistent, accessible input fields,
**So that** I can easily enter data into the calculators.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a `TextInput` component with label, error state, and help text support.
2. **The system shall** provide a `CurrencyInput` component that formats currency on blur and accepts numeric input.
3. **The system shall** provide a `NumberInput` component with min/max validation.
4. **The system shall** provide a `Select` component for dropdown selections.
5. **The system shall** provide a `Slider` component for range inputs.
6. **All input components shall** support disabled state.
7. **All input components shall** support required indicator.
8. **All input components shall** have visible focus states.
9. **All input components shall** be keyboard accessible.

### US-F4: Button Components
**As a** user,
**I want** clear, interactive buttons,
**So that** I can take actions in the application.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a `Button` component with primary, secondary, and ghost variants.
2. **The system shall** provide size options: small, medium, large.
3. **All buttons shall** have hover, active, and focus states.
4. **All buttons shall** support disabled state.
5. **All buttons shall** support loading state with spinner.
6. **All buttons shall** be keyboard accessible (Enter/Space to activate).

### US-F5: Card Components
**As a** user,
**I want** content organized in clear visual containers,
**So that** I can understand the interface structure.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a `Card` component with consistent padding and border radius.
2. **The system shall** provide a `CardHeader` component for titles.
3. **The system shall** provide a `CardContent` component for body content.
4. **The system shall** provide a `CardFooter` component for actions.
5. **Cards shall** support elevated and outlined variants.

### US-F6: Feedback Components
**As a** user,
**I want** clear feedback for my actions,
**So that** I understand the result of my interactions.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide an `Alert` component for success, error, warning, and info messages.
2. **The system shall** provide a `Toast` component for temporary notifications.
3. **The system shall** provide a `Tooltip` component for additional context on hover/focus.
4. **The system shall** provide a `Badge` component for status indicators.

### US-F7: Layout Components
**As a** user,
**I want** a consistent page layout,
**So that** I can easily navigate the site.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a `Header` component with site branding and navigation.
2. **The system shall** provide a `Footer` component with links and privacy notice.
3. **The system shall** provide a `Container` component for max-width content.
4. **The system shall** provide a `Section` component for vertical spacing.
5. **The layout shall** be responsive from 320px to 1920px+ viewports.

---

## Part 3: Data Persistence

### US-F8: Local Storage Persistence
**As a** user,
**I want** my data saved automatically in my browser,
**So that** I don't lose my work between sessions.

**Acceptance Criteria (EARS Format)**:

1. **When** data is modified, **the system shall** automatically save to localStorage within 1 second.
2. **When** the user returns to the site, **the system shall** automatically load saved data.
3. **If** localStorage is full or unavailable, **the system shall** show a warning but continue to function.
4. **The system shall** use a versioned data schema to support future migrations.
5. **The system shall** not store any data on external servers (privacy-first).

### US-F9: Data Export
**As a** user,
**I want** to export my data as a file,
**So that** I can back it up or transfer it to another device.

**Acceptance Criteria (EARS Format)**:

1. **When** the user clicks "Export Data", **the system shall** download a JSON file.
2. **The exported file shall** contain all user inputs and saved scenarios.
3. **The exported file shall** include a version number and export timestamp.
4. **The file name shall** include the date (e.g., `peninganaedalifid-backup-2024-01-15.json`).

### US-F10: Data Import
**As a** user,
**I want** to import data from a backup file,
**So that** I can restore my data on a new device.

**Acceptance Criteria (EARS Format)**:

1. **When** the user selects a JSON file for import, **the system shall** validate the file format.
2. **If** the file is valid, **the system shall** load all data and show a success message.
3. **If** the file is invalid, **the system shall** show an error message and not modify existing data.
4. **The system shall** handle version differences gracefully (migrate old formats).
5. **Before importing, the system shall** warn the user that existing data will be replaced.

### US-F11: Data Reset
**As a** user,
**I want** to clear all my saved data,
**So that** I can start fresh or remove my information.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** provide a "Reset All Data" function.
2. **Before resetting, the system shall** require user confirmation.
3. **When** reset is confirmed, **the system shall** clear all localStorage data.
4. **After reset, the system shall** reload with default values.

---

## Part 4: Design System

### US-F12: Color Palette
**As a** user,
**I want** a visually cohesive color scheme,
**So that** the interface is pleasant and easy to understand.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** use a primary color for interactive elements and branding.
2. **The system shall** use semantic colors for success (green), warning (amber), error (red), and info (blue).
3. **The system shall** meet WCAG 2.1 AA contrast ratios (4.5:1 for text).
4. **The system shall** support both light mode (dark mode is out of scope for MVP).

### US-F13: Typography
**As a** user,
**I want** readable, hierarchical text,
**So that** I can easily scan and understand content.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** use a legible sans-serif font (system font stack or Inter).
2. **The system shall** define heading sizes (h1-h4) with clear hierarchy.
3. **The system shall** use a base font size of 16px for body text.
4. **The system shall** use appropriate line heights (1.5 for body, 1.2 for headings).
5. **Inputs shall** use minimum 16px font to prevent iOS zoom.

### US-F14: Spacing
**As a** developer,
**I want** consistent spacing tokens,
**So that** the interface has visual rhythm.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** use a spacing scale based on 4px increments.
2. **The system shall** define standard component padding (16px, 24px).
3. **The system shall** define standard section margins (24px, 48px).

---

---

## Part 5: Advertising & Analytics

### US-F15: Google AdSense Support
**As a** site owner,
**I want** to display Google AdSense advertisements,
**So that** I can monetize the website traffic.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** support Google AdSense script loading.
2. **The system shall** provide designated ad placement zones in the layout:
   - Header banner (below navigation)
   - Sidebar ad slots (on desktop)
   - In-content ad slots (between sections)
   - Footer banner (above footer)
3. **The system shall** load ads asynchronously to not block page rendering.
4. **The system shall** handle ad blockers gracefully (no errors, layout doesn't break).
5. **The system shall** support responsive ad units that adapt to screen size.
6. **If** ads fail to load, **the system shall** collapse the ad container to avoid empty space.

### US-F16: Traffic Analytics
**As a** site owner,
**I want** to track visitor traffic and behavior,
**So that** I can understand how users interact with the site.

**Acceptance Criteria (EARS Format)**:

1. **The system shall** support Google Analytics 4 (GA4) integration.
2. **The system shall** track page views automatically on route changes.
3. **The system shall** support custom event tracking for:
   - Calculator usage (calculations performed)
   - Export/import actions
   - Scenario saves
4. **The system shall** respect user privacy:
   - Support for cookie consent (if required by jurisdiction)
   - No tracking of personal financial data entered
5. **The system shall** load analytics asynchronously to not impact performance.

### US-F17: Cookie Consent (Optional)
**As a** user,
**I want** to control cookie usage,
**So that** my privacy preferences are respected.

**Acceptance Criteria (EARS Format)**:

1. **If** the site uses tracking cookies, **the system shall** show a cookie consent banner on first visit.
2. **When** the user accepts cookies, **the system shall** enable analytics and ad personalization.
3. **When** the user declines cookies, **the system shall** disable non-essential tracking.
4. **The system shall** remember the user's consent preference.

---

## Non-Functional Requirements

### Performance
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Total Bundle Size: < 100KB gzipped (initial load)
- Ad scripts must load asynchronously and not block rendering

### Browser Support
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome for Android (latest)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader compatible
- Reduced motion support

### Security
- No external data transmission
- No third-party tracking
- Content Security Policy headers
- HTTPS only (enforced by Vercel)

---

## Dependencies

- None (this is the foundation)

## Dependents

- Actual Hourly Wage Calculator (requires all foundation components)
- All future features
