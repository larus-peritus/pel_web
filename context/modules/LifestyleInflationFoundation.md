# Lifestyle Inflation Detector - Foundation

## Location
- `apps/peninganaedalifid/src/types/calculator.ts` (updated)
- `apps/peninganaedalifid/src/lib/constants/spendingCategories.ts` (created)
- `apps/peninganaedalifid/src/lib/utils/periodHelpers.ts` (created)
- `apps/peninganaedalifid/src/lib/calculations/lifestyleInflation.ts` (created)
- `apps/peninganaedalifid/src/lib/utils/validators.ts` (updated)
- `apps/peninganaedalifid/src/lib/defaults.ts` (updated)

## Purpose
Foundation layer for the Lifestyle Inflation Detector feature, providing TypeScript types, constants, helper functions, and core calculation logic.

## Implementation Status
**Epic 1: Foundation & Data Models** - PARTIALLY COMPLETE (5/7 tasks done)

### Completed Tasks

#### Task 1.1: TypeScript Types & Interfaces - DONE
Added comprehensive TypeScript types to `calculator.ts`:
- `SpendingCategory` - 9 spending categories (housing, food, transportation, etc.)
- `SpendingData` - Monthly spending amounts by category
- `Period` - Time period with income and spending data
- `InflationScore` - Health score levels (healthy, caution, warning, critical)
- `ChangeSeverity` - Category change severity levels
- `CategoryChange` - Details of change in one category
- `FIImpact` - Financial Independence impact calculations
- `SalaryUtilization` - How salary increases are utilized
- `InflationAlert` - Alert/warning structure
- `InflationAnalysis` - Complete analysis results
- Updated `StoredState` to include optional `periods: Period[]`

#### Task 1.2: Spending Category Constants - DONE
Created `spendingCategories.ts` with:
- `SPENDING_CATEGORY_LABELS` - Icelandic labels for all 9 categories
- `SPENDING_CATEGORY_DESCRIPTIONS` - Icelandic descriptions
- `SPENDING_CATEGORIES` - Array for iteration
- Helper functions: `getAllCategories()`, `getCategoryLabel()`, `getCategoryDescription()`

#### Task 1.3: Default Values & Helpers - DONE
Created `periodHelpers.ts` with:
- `DEFAULT_SPENDING` - Empty spending data (all zeros)
- `getEmptySpending()` - Returns fresh empty spending
- `getTotalSpending()` - Calculate total spending from SpendingData
- `createDefaultPeriod()` - Create period with basic info
- `formatPeriodName()` - Format "Janúar 2024" or "Árið 2024"
- `comparePeriods()` - Sort periods (newest first)
- `generatePeriodId()` - Generate unique period ID
- Month names in Icelandic

Updated `defaults.ts` to re-export period helpers.

#### Task 1.4: Core Calculation Functions - DONE
Created `lifestyleInflation.ts` with comprehensive calculation functions:

**Scoring Functions:**
- `calculateInflationScore()` - Returns health score from lifestyle creep %
- `calculateChangeSeverity()` - Returns severity from change %

**Analysis Functions:**
- `analyzeCategoryChanges()` - Analyze each spending category
- `detectQuietUpgrades()` - Find small increases that add up
- `calculateFIImpact()` - Calculate FI delay and future value lost
- `calculateSalaryUtilization()` - Analyze how raise was used

**Alert Generation:**
- `getSuggestionsForCategory()` - Category-specific actionable suggestions
- `generateAlerts()` - Create alerts based on analysis
- `generateAlertId()` - Unique alert IDs

**Main Analysis:**
- `analyzeInflation()` - Main analysis function comparing two periods
- `createEmptyAnalysis()` - Empty analysis for first period

All functions properly handle edge cases (no comparison period, zero wage, etc.)

#### Task 1.6: Input Validation - DONE
Updated `validators.ts` with:
- `validatePeriod()` - Validate period data
  - Name: not empty, max 100 chars
  - Year: 2020-2030
  - Month: 1-12 or null
  - Income: >= 0
  - Spending: delegates to validateSpending()
- `validateSpending()` - Validate spending data
  - All values >= 0
  - Sanity check: not > 10,000,000 ISK
  - Icelandic error messages

### Remaining Tasks in Epic 1

#### Task 1.5: Main Analysis Function - DONE (included in 1.4)
The `analyzeInflation()` function was implemented as part of Task 1.4.

#### Task 1.7: Update StoredState Schema - PARTIALLY DONE
- Added `periods?: Period[]` to `StoredState` interface
- **TODO**: Update CalculatorContext to manage periods
- **TODO**: Add migration logic if needed
- **TODO**: Test localStorage persistence

## Key Functionality

### Spending Categories (9 total)
1. **Húsnæði** (housing) - Leiga/veð, rafmagn, hiti, internet
2. **Matur** (food) - Matvörur, veitingastaðir, kaffihús
3. **Samgöngur** (transportation) - Bensín, strætó, bílaviðhald
4. **Áskriftir** (subscriptions) - Netflix, Spotify, líkamsrækt
5. **Þægindi** (convenience) - Matur heim, taxi, skyndikaupur
6. **Fatnaður** (clothing) - Föt, skór, fylgihlutir
7. **Skemmtun** (entertainment) - Kvikmyndir, tónleikar, tölvuleikir
8. **Heilsa** (health) - Lyfseðlar, sjúkraþjálfun, tannlæknir
9. **Annað** (other) - Gjafir, heimilisbúnaður, dýrahald

### Inflation Score Thresholds
- **Healthy** (0-5%): Útgjöld stöðug eða minnka
- **Caution** (5-15%): Smávægileg lífsstílsverðbólga
- **Warning** (15-30%): Umtalsverð lífsstílsverðbólga
- **Critical** (30%+): Alvarleg lífsstílsverðbólga

### Change Severity Levels
- **Decrease**: < 0%
- **Stable**: 0-5%
- **Minor**: 5-15%
- **Moderate**: 15-30%
- **Major**: 30%+

### FI Impact Calculations
- Increased annual expenses (monthly change × 12)
- Increased FI target (annual expenses × 25, based on 4% rule)
- FI delay in years and months
- Lost future value at 7% return over 10 and 20 years

### Salary Utilization Status
- **Healthy**: 0-30% of raise spent on lifestyle
- **Acceptable**: 30-50%
- **Concerning**: 50-80%
- **Critical**: 80%+

## Dependencies
- `@/types/calculator` - All TypeScript types
- `@/lib/calculations/lifeEnergy` - Life energy conversions
- `@/lib/calculations/subscriptions` - Future value calculations (reused)
- `@/lib/utils/formatters` - Currency formatting

## Integration Points
- **CalculatorContext** - Will provide periods and inflationAnalysis
- **localStorage** - Periods stored with other calculator data
- **actualHourlyWage** - Used for life energy calculations

## Tests
**Status**: Not yet implemented

**Planned tests** (from tasks.md):
- Unit tests for all calculation functions
- Unit tests for validators
- Unit tests for helper functions
- Integration tests for Context operations
- E2E tests for full workflows

## Related Specifications
- Requirements: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/lifestyle-inflation/requirements.md`
- Design: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/lifestyle-inflation/design.md`
- Tasks: `/Users/larusperitus/Documents/code/peritus/pel_web/specs/lifestyle-inflation/tasks.md`

## Next Steps
1. **Fix build errors** - Context type mismatches need to be resolved
2. **Complete Epic 1** - Update CalculatorContext with periods management
3. **Epic 2** - Period Management (CRUD operations and UI components)
4. **Epic 3** - Analysis Engine integration
5. **Epic 4** - Dashboard UI components
6. **Epic 5** - Data visualization (charts)
7. **Epic 6** - Alerts & suggestions system
8. **Epic 7** - Polish & optimization

## Notes
- All calculations are client-side only
- Currency is ISK (Icelandic Króna)
- UI text is in Icelandic
- Follows existing patterns from other calculator features
- Integrates with existing CalculatorContext for actualHourlyWage
