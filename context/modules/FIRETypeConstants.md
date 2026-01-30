# FIRE Type Constants

## Location
`apps/peninganaedalifid/src/lib/constants/fireTypes.ts`

## Purpose
Complete configuration file defining all five FIRE (Financial Independence, Retire Early) types with comprehensive Icelandic information, examples, and visual styling for the FIRE Type Explorer feature.

## Overview
This module provides the foundational data for the FIRE Type Explorer, including detailed definitions for:
- **LeanFIRE** (Sparsamt FIRE): Minimal expenses, earliest retirement
- **RegularFIRE** (Venjulegt FIRE): Comfortable expenses, standard approach
- **CoastFIRE** (Sjálfvirkt FIRE): Let investments grow, work covers current expenses
- **BaristaFIRE** (Hálfstöðvar FIRE): Part-time work in retirement
- **FatFIRE** (Lúxus FIRE): Premium lifestyle, higher target

## Exports

### Main Configuration
- `FIRE_TYPE_DEFINITIONS: readonly FIRETypeDefinition[]` - Array of all five FIRE type definitions with complete metadata
- `FIRE_TYPE_ORDER: readonly FIRETypeId[]` - Display order for FIRE types
- `DEFAULT_FIRE_TYPE: FIRETypeId` - Default FIRE type (regularfire)
- `FIRE_TYPE_COLORS: Record<FIRETypeId, {...}>` - Tailwind color schemes for each type

### Helper Functions
- `getFIRETypeDefinition(id: FIRETypeId): FIRETypeDefinition` - Get definition by ID
- `getFIRETypeColors(id: FIRETypeId)` - Get color scheme by ID
- `isTierBasedFIREType(id: FIRETypeId): boolean` - Check if type maps to expense tier
- `getTierBasedFIRETypes(): FIRETypeDefinition[]` - Get LeanFIRE, RegularFIRE, FatFIRE
- `getSpecialFIRETypes(): FIRETypeDefinition[]` - Get CoastFIRE, BaristaFIRE

## Key Data Structures

### Each FIRE Type Definition Includes
1. **Identity**
   - `id`: FIRETypeId identifier
   - `nameIs`: Icelandic name
   - `nameEn`: English name
   - `tagline`: Short Icelandic tagline
   - `icon`: Emoji icon

2. **Description**
   - `description`: Full Icelandic description (3-4 sentences)
   - `expenseTier`: Mapped expense tier (barebones/comfortable/deluxe or null)
   - `multiplier`: FI multiplier (25x or 30x)

3. **Characteristics**
   - `pros`: Array of advantages (Icelandic)
   - `cons`: Array of disadvantages (Icelandic)
   - `bestFor`: Who should use this approach (Icelandic)
   - `notFor`: Who should avoid this approach (Icelandic)

4. **Examples**
   - `examples`: Array of FIREExample objects with:
     - `title`: Example scenario title
     - `description`: Detailed scenario description
     - `monthlyExpenses`: Example monthly expenses (ISK)
     - `fiNumber`: Example FI number (ISK)

5. **Visual Styling**
   - `color`: Tailwind color name (amber/green/cyan/purple/pink)

## FIRE Type Details

### LeanFIRE (Sparsamt FIRE)
- **Tier**: Barebones
- **Multiplier**: 25x
- **Icon**: 🔥
- **Color**: Amber
- **Example**: 250,000 kr/month → 75M kr FI number
- **Best for**: Those willing to live frugally for earliest retirement

### RegularFIRE (Venjulegt FIRE)
- **Tier**: Comfortable
- **Multiplier**: 30x
- **Icon**: 🎯
- **Color**: Green
- **Example**: 520,000 kr/month → 156M kr FI number
- **Best for**: Most people wanting balanced approach

### CoastFIRE (Sjálfvirkt FIRE)
- **Tier**: null (special calculation)
- **Multiplier**: 30x
- **Icon**: 🏖️
- **Color**: Cyan
- **Example**: Save 30M early, let it grow to 156M by 67
- **Best for**: Young people (<35) who save early

### BaristaFIRE (Hálfstöðvar FIRE)
- **Tier**: null (special calculation)
- **Multiplier**: 30x
- **Icon**: ☕
- **Color**: Purple
- **Example**: 90M saved (60% of full) + part-time work
- **Best for**: Those who enjoy work but want flexibility

### FatFIRE (Lúxus FIRE)
- **Tier**: Deluxe
- **Multiplier**: 30x
- **Icon**: 💎
- **Color**: Pink
- **Example**: 1,000,000 kr/month → 300M kr FI number
- **Best for**: High earners wanting premium lifestyle

## Icelandic Context Adaptations

### Realistic ISK Amounts
All examples use realistic Icelandic amounts:
- LeanFIRE: 250k-350k/month
- RegularFIRE: 450k-520k/month
- FatFIRE: 1M-1.2M/month

### Conservative Multipliers
Uses 30x as default (vs US standard 25x) to account for Iceland's higher inflation history.

### Icelandic Examples
All examples reference:
- Icelandic cities (Reykjavík, Akureyri)
- Local lifestyle (sumarhús, Þingvallavatn, etc.)
- Icelandic pension system context

## Color Schemes

Each FIRE type has consistent color scheme with Tailwind classes:

```typescript
{
  bg: 'bg-{color}-50',        // Light background
  border: 'border-{color}-300', // Border color
  text: 'text-{color}-900',    // Text color
  accent: 'bg-{color}-500',    // Accent/badge color
  hover: 'hover:bg-{color}-100' // Hover state
}
```

## Dependencies
- `@/types/fireTypes` - TypeScript type definitions

## Integration
- Used by: FIRE Type Explorer UI components (cards, comparison, timeline)
- Provides: Static configuration data for all FIRE type displays
- Part of: Epic 1 (Foundation) from tasks-fire-type-explorer.md

## Related
- Implements: FR-1.1, FR-1.2 from requirements-fire-type-explorer.md
- Part of: design-fire-type-explorer.md Section 4.2
- Task: Task 1.2 from tasks-fire-type-explorer.md

## Testing
N/A (constants only, no unit tests required)

## Notes
- All text in Icelandic for end users
- English names included for reference/debugging
- Immutable (readonly arrays) for data integrity
- Comprehensive helper functions for safe access
- Type-safe with TypeScript
