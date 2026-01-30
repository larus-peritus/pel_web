# FatFIRE Constants

## Location
`apps/peninganaedalifid/src/lib/constants/fatFire.ts`

## Purpose
Provides all constants, defaults, and configuration values for the FatFIRE Planner (Lúxus FIRE Áætlun). FatFIRE represents Financial Independence with a luxurious lifestyle and no compromise - using higher multipliers (30x), premium expense assumptions, and abundance mindset.

## Exports

### Constants

- `FATFIRE_DEFAULTS` - Default calculation parameters
  - `MULTIPLIER: 30` - Default FI multiplier (3.33% withdrawal rate)
  - `EXPECTED_RETURN: 0.06` - Expected annual return (6% real)
  - `BASE_MONTHLY_EXPENSES: 700_000` - Premium Icelandic lifestyle baseline
  - `SPLURGE_BUDGET_ANNUAL: 2_000_000` - Default annual splurge budget
  - `PREMIUM_HOUSING_MONTHLY: 300_000` - Reykjavík 101/105 housing
  - `INTERNATIONAL_TRAVEL_ANNUAL: 600_000` - Travel from remote Iceland

- `MULTIPLIER_OPTIONS` - FI multiplier presets (28x, 30x, 33x)
  - Each with label, withdrawal rate, description, and explanation
  - 30x is default (highest safety margin for FatFIRE)

- `RETURN_PRESETS` - Expected return rate options
  - Conservative (5%), Moderate (6%), Optimistic (7%)
  - All real returns after inflation

- `SPLURGE_PRESETS` - Annual splurge budget guidance
  - Modest (1M ISK), Comfortable (2M ISK), Generous (3M ISK)
  - Includes monthly/weekly equivalents and examples

- `WISH_LIST_CATEGORIES` - Premium lifestyle categories (8 categories)
  - Premium housing, international travel, premium healthcare
  - Luxury experiences, high-end dining, premium vehicles
  - Hobby/collections, other
  - Each with Icelandic labels, icons, examples, default costs

- `PREMIUM_COLORS` - Gold/amber color theme
  - Primary gold tones, amber accents, warm backgrounds
  - Chart gradient colors for premium feel

- `FATFIRE_LIMITS` - Validation constraints
  - Multiplier range (25-40, warn if <28)
  - Return rate range (0-15%, warn outside 4-8%)
  - Splurge budget limits (warn if >30% of base)
  - Wish list limits (max 50 items, warn if >3x base)
  - Timeline and age limits

- `MILESTONE_PERCENTAGES` - [25, 50, 75, 100]

- `MILESTONE_LABELS` - Icelandic milestone labels
  - "25% FI - Fyrsta fjórðungur"
  - "50% FI - Helmingi náð"
  - "75% FI - Þrír fjórðu"
  - "100% FI - FatFIRE náð! 🎉"

- `DEFAULT_DELUXE_EXPENSES` - Icelandic premium expense breakdown
  - Housing: 300k, Food: 100k, Transport: 70k
  - Entertainment: 80k, Personal: 50k, Healthcare: 30k
  - Other: 50k, Travel: 50k (monthly allocation)
  - Total: ~700k ISK/month

- `FATFIRE_TOOLTIPS` - Educational content keys
  - Explanations for multiplier, splurge budget, wish list
  - Icelandic premium context, abundance mindset philosophy

### Helper Functions

- `getWishListCategory(id: string)` - Get category config by ID
- `getMultiplierOption(value: number)` - Get multiplier option by value
- `getReturnPreset(value: number)` - Get return preset by value
- `getSplurgePreset(value: number)` - Get splurge preset by value
- `getTotalDefaultDeluxeExpenses()` - Calculate total default expenses
- `isFatFireMultiplier(multiplier: number)` - Check if multiplier ≥28x
- `isRealisticReturnRate(rate: number)` - Check if return rate is 4-8%
- `isExcessiveSplurgeBudget(annual, baseMonthly)` - Check if splurge >30% of base
- `isAggressiveWishList(wishListMonthly, baseMonthly)` - Check if wish list >3x base

## Key Functionality

- Premium defaults for Icelandic deluxe lifestyle (700k/month base)
- Higher safety multiplier (30x vs standard 25x) for FatFIRE security
- 8 wish list categories with Icelandic context and examples
- Splurge budget presets for spontaneous luxury spending
- Gold/amber premium color theme for aspirational UI
- Comprehensive validation limits and warnings
- Helper functions for configuration lookups and validation

## FatFIRE Philosophy

- **Abundance Mindset**: No compromise on lifestyle quality
- **Safety Margin**: 30x multiplier (3.33% withdrawal) for extra security
- **Premium Living**: Realistic Icelandic deluxe costs (101/105, international travel)
- **Splurge Budget**: Annual allocation for guilt-free spontaneous luxury
- **Wish List**: Build lifestyle dreams into FI planning

## Icelandic Context

- Housing costs reflect premium Reykjavík areas (101/105)
- International travel budget accounts for Iceland's remote location
- All labels and tooltips in Icelandic
- Realistic premium costs for Icelandic market

## Dependencies

- Imports `WishListCategoryConfig` from `@/types/fatFire`
- No runtime dependencies

## Tests

N/A (constants only, no computation)

## Integration

- Used by FatFIRE calculation functions
- Used by FatFIRE UI components for defaults and validation
- Provides premium color theme for styling
- Educational tooltips displayed throughout FatFIRE UI

## Related

- Implements: Requirements FR-1.2, FR-1.3, FR-3.1, FR-4.2 from specs/fat-fire/requirements-fat-fire.md
- Part of: Epic 1 (Foundation) from specs/fat-fire/tasks-fat-fire.md
- Related types: `apps/peninganaedalifid/src/types/fatFire.ts`
- Used by: FatFIRE calculation functions (Task 1.3-1.5)
- Used by: FatFIRE UI components (Epic 3-9)

## Implementation Notes

- Date: 2026-01-29
- All constants use Icelandic naming and context
- Premium defaults based on Reykjavík market research
- Multiplier default (30x) higher than standard FIRE (25x) for safety
- Splurge budget concept unique to FatFIRE (not in other calculators)
- Gold/amber color theme distinguishes FatFIRE from other tools
- Helper functions simplify validation and lookup throughout codebase
