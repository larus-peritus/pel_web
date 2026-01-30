# Cut 10.000 kr Impact Cards Feature

## Location
`apps/peninganaedalifid/src/components/cut-impact/`
`apps/peninganaedalifid/src/lib/calculations/cutImpact.ts`
`apps/peninganaedalifid/src/lib/data/categories.ts`
`apps/peninganaedalifid/src/types/cutImpact.ts`
`apps/peninganaedalifid/src/app/cut-impact/page.tsx`

## Purpose
Displays category-specific impact cards showing what happens when you cut spending by a customizable amount (default 10.000 kr/month). Shows FI date acceleration, life energy reclaimed, and future value if invested.

## Exports

### Types (`src/types/cutImpact.ts`)
- `CategoryDefinition` - Spending category with Icelandic name and examples
- `LifeEnergyMetrics` - Hours/days reclaimed per month/year
- `ImpactLevel` - Visual indicator level (very-high, high, moderate, low, none)
- `FIDateShift` - Months earlier to FI + impact level
- `CategoryImpact` - Complete impact for one category
- `SortOrder` - Sort options (fi-impact, life-energy, future-value, alphabetical)
- `CutImpactSettings` - Settings for localStorage
- `FIInputs` - Optional FI planning inputs

### Data (`src/lib/data/categories.ts`)
- `CATEGORIES` - Array of 6 spending categories with Icelandic labels
- `getCategoryById()` - Helper to find category by ID

### Calculations (`src/lib/calculations/cutImpact.ts`)
- `calculateLifeEnergy()` - Converts cut amount to hours/days of life
- `calculateFutureValue()` - Compound interest calculation for 10/20 years
- `calculateFIDateShift()` - Calculates months earlier to FI
- `calculateCategoryImpact()` - Master function for one category
- `calculateAllCategoryImpacts()` - Calculates all 6 categories
- `sortCategoryImpacts()` - Sorts by specified order
- `getImpactIndicator()` - Visual bars and label
- `getGradientClass()` - Tailwind gradient for impact level
- `formatMonths()` - Icelandic month/year formatting

### Components (`src/components/cut-impact/`)
- `CutImpactCards` - Main container component
- `ImpactCard` - Individual category card
- `CutAmountSelector` - Slider for adjusting cut amount
- `SortControls` - Buttons for sorting cards
- `ImpactCardGrid` - Responsive grid layout
- `LifeEnergyDisplay` - Shows hours/days reclaimed
- `FutureValueDisplay` - Shows 10/20 year projections
- `FIImpactDisplay` - Shows FI date shift
- `MissingDataNotice` - Warning when data missing

## Key Functionality

### Life Energy Calculation
- **Formula**: `cutAmount / actualHourlyWage`
- Shows hours per month, hours per year
- Shows days per year if >= 24 hours
- Returns null for days if < 24 hours annually

### Future Value Calculation
- **Formula**: `FV = PMT × ((1 + r)^n - 1) / r`
- Uses 7% annual return (fixed)
- Monthly compounding
- Projects 10 and 20 years

### FI Date Shift Calculation
- **Linear model**: Years to FI = (FI Number - Net Worth) / Annual Savings
- Compares current savings vs savings with cut
- Converts to months
- Assigns impact level based on months saved
- Returns null if FI inputs not available

### Impact Levels
- **very-high**: 36+ months (3+ years)
- **high**: 12-36 months (1-3 years)
- **moderate**: 3-12 months
- **low**: 1-3 months
- **none**: < 1 month

### Gradient Color Coding
- very-high: Green gradient (from-green-400 to-green-600)
- high: Green-blue gradient (from-green-300 to-blue-500)
- moderate: Blue gradient (from-blue-300 to-blue-500)
- low: Gray gradient (from-gray-200 to-gray-400)
- none: Light gray gradient (from-gray-100 to-gray-300)

## Dependencies
- `@/context/CalculatorContext` - Provides actualHourlyWage from results
- `@/lib/utils/formatters` - ISK formatting
- `@/lib/storage/localStorage` - Settings persistence
- `@/components/ui/Tooltip` - Info tooltips
- `@/components/ui/Alert` - Missing data warnings

## Tests
- Location: `tests/lib/calculations/cutImpact.test.ts`
- Coverage: 24 unit tests, all passing
- Tests: Life energy, future value, FI date shift, sorting, formatting

## Integration

### With CalculatorContext
- Reads `results.actualHourlyWage`
- Shows warning if not available
- Optional FI inputs (not yet in context for MVP)

### localStorage Persistence
- Key: `cutImpactSettings`
- Saves: cutAmount, sortOrder, lastUpdated
- Loads on mount
- Saves on change (debounced via useEffect)

### Page Route
- Route: `/cut-impact`
- File: `apps/peninganaedalifid/src/app/cut-impact/page.tsx`
- Wraps CutImpactCards with actualHourlyWage from context

## Categories (Icelandic)

1. **Áskriftir** (📺)
   - Examples: Netflix, Spotify, líkamsrækt

2. **Veitingastaðir** (🍽️)
   - Examples: hádegisverður, kaffihús, kvöldverður

3. **Samgöngur** (🚗)
   - Examples: eldsneyti, bílastæði, Strætó

4. **Verslanir** (🛍️)
   - Examples: föt, raftæki, húsgögn

5. **Skemmtun** (🎉)
   - Examples: bíó, tónleikar, ferðalög

6. **Annað** (📦)
   - Examples: fötþvottur, tómstundir, gjafir

## Responsive Design
- Mobile (< 768px): 1-column grid
- Tablet (768-1024px): 2-column grid
- Desktop (> 1024px): 3-column grid

## Accessibility
- Semantic HTML (article, header, footer)
- ARIA labels on controls
- Keyboard navigable slider
- Screen reader friendly
- Color + text indicators (not just color)

## Implementation Notes
- All calculations are pure functions
- Real-time updates (no debouncing)
- useMemo for performance
- SSR-safe localStorage access
- Graceful degradation (works without FI inputs)
- Fixed 7% return rate (not user-adjustable in MVP)
- Fixed 6 categories (not user-customizable in MVP)

## Future Enhancements (Out of Scope for MVP)
- FI inputs integration with CalculatorContext
- Custom categories
- Variable return rates
- Export/import settings
- Comparison mode (multiple cut amounts)
- Combined cuts (multiple categories)
- Gamification (badges, progress tracking)

## Related
- Implements: Requirements from `specs/cut-10000kr-impact/requirements-cut-10000kr-impact.md`
- Part of: Design from `specs/cut-10000kr-impact/design-cut-10000kr-impact.md`
- Tasks from: `specs/cut-10000kr-impact/tasks-cut-10000kr-impact.md`

## Status
✅ Implemented: 2026-01-22
- All foundation tasks complete (Types, Categories, Calculations)
- All UI components complete
- Main page complete
- Tests complete (24 tests passing)
- Ready for integration testing
