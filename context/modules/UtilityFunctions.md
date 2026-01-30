# Utility Functions

## Location
- `apps/peninganaedalifid/src/lib/utils/cn.ts`
- `apps/peninganaedalifid/src/lib/utils/formatters.ts`
- `apps/peninganaedalifid/src/lib/utils/index.ts`

## Purpose
Provides essential utility functions for the application including class name merging and number formatting.

## Exports

### Class Name Utility (cn.ts)
- `function cn(...inputs: ClassValue[])` - Merges class names with Tailwind CSS conflict resolution using clsx and tailwind-merge

### Formatters (formatters.ts)
- `function formatCurrency(amount: number, currency = 'USD'): string` - Formats numbers as currency with locale-specific formatting
- `function formatPercentage(value: number, decimals = 1): string` - Formats numbers as percentage strings with configurable decimal places
- `function formatNumber(value: number): string` - Formats numbers with thousand separators

## Key Functionality

### cn() Function
- Combines multiple class name inputs (strings, arrays, objects)
- Resolves Tailwind CSS conflicts (e.g., `p-4` vs `p-8`)
- Handles conditional classes
- Filters out falsy values
- Uses clsx for class name combining and tailwind-merge for conflict resolution

### formatCurrency()
- Uses Intl.NumberFormat for locale-aware currency formatting
- Default currency: USD
- Fixed 2 decimal places
- Supports negative numbers
- Handles large numbers with proper thousand separators

### formatPercentage()
- Configurable decimal places (default: 1)
- Appends '%' symbol
- Uses toFixed() for rounding

### formatNumber()
- Uses Intl.NumberFormat for locale-aware number formatting
- Adds thousand separators
- Preserves decimal places

## Dependencies
- `clsx` - Class name utility for conditional classes
- `tailwind-merge` - Resolves Tailwind CSS class conflicts

## Tests
- Location: apps/peninganaedalifid/tests/lib/utils/
- Files:
  - `cn.test.ts` - Tests for class name merging utility
  - `formatters.test.ts` - Tests for number formatting functions
- Coverage:
  - cn: Handles strings, arrays, objects, conditional classes, Tailwind conflicts, edge cases
  - formatCurrency: Default USD, custom currencies, negatives, large numbers, rounding
  - formatPercentage: Custom decimals, negatives, whole numbers, rounding
  - formatNumber: Thousand separators, decimals, negatives, large numbers

## Integration
- Used by: All UI components for class name management
- Uses: clsx and tailwind-merge libraries
- Available through barrel export: `import { cn, formatCurrency, formatPercentage, formatNumber } from '@/lib/utils'`

## Related
- Implements: Requirements from specs/project-foundation-requirements.md
- Part of: specs/project-foundation-design.md
- Task: F4 from specs/project-foundation-tasks.md

## Implementation Notes
- The cn() utility is essential for Tailwind CSS class management in React components
- Formatters use Intl API for proper internationalization support
- All utilities are pure functions with no side effects
- Comprehensive test coverage ensures reliability
