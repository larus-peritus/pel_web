# Savings Report Constants

## Location
`apps/peninganaedalifid/src/lib/constants/savingsReport.ts`

## Purpose
Default configurations and constant values for the Savings Report feature. Includes category definitions, color schemes, and savings rate thresholds.

## Exports

### Version

- `SAVINGS_REPORT_VERSION` - Schema version (currently 1) for migrations

### Category Configuration

- `DEFAULT_SAVINGS_CATEGORIES` - Array of 7 default categories with Icelandic names:
  1. Neyðarsjóður (Emergency Fund) 🛡️
  2. Skammtímasparnaður (Short-term Savings) 📅
  3. Langtímasparnaður (Long-term Savings) 🎯
  4. Fjárfestingar (Investments) 📈
  5. Lífeyrissjóður (Pension) 🏖️
  6. Sérstakur sjóður (Special Purpose) ⭐
  7. Annað (Other) 📦

### Color Schemes

- `SAVINGS_CATEGORY_COLORS` - Tailwind CSS classes for each category
- `SAVINGS_CHART_COLORS` - Hex colors for pie/donut charts

### Savings Rate Configuration

- `SAVINGS_RATE_THRESHOLDS` - Threshold definitions for rate levels
  - critical: < 10%
  - low: 10-20%
  - moderate: 20-30%
  - good: 30-50%
  - excellent: 50-70%
  - exceptional: 70%+

- `SAVINGS_RATE_MESSAGES` - Icelandic messages and FI estimates for each level

## Key Functionality

### Default Categories
7 categories covering most common Icelandic savings types, ordered by typical priority.

### Color Consistency
Each category has consistent colors across UI components and charts using emerald, blue, purple, amber, teal, pink, and gray.

### Savings Rate Feedback
Messages provide context and motivation in Icelandic with realistic FI timeline estimates.

## Dependencies

- `@/types/savingsReport` - Type definitions

## Related

- Implements: FR-1 from specs/savings-report/requirements-savings-report.md
- Part of: Task 1.2 from specs/savings-report/tasks-savings-report.md
- Used by: Calculations, components

## Design Decisions

### Icelandic-First
All names and messages in Icelandic to match local context and terminology.

### Fixed Categories
7 categories provide good coverage without overwhelming users. Categories can be hidden if not used.

### Emoji Icons
Universal emoji icons work across all platforms and don't require custom icon libraries.
