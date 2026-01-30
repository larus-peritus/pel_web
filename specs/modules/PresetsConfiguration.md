# Presets Configuration

## Location
`apps/peninganaedalifid/src/lib/presets/index.ts`

## Purpose
Provides preset configurations for common expense categories (commute, clothing, meals) to help users quickly populate their calculator with realistic values instead of starting from zero.

## Exports

### Constants
- `COMMUTE_PRESETS: Preset[]` - 5 preset levels for commute expenses (none, short, medium, long, very long)
- `CLOTHING_PRESETS: Preset[]` - 4 preset levels for work clothing expenses (uniform provided, casual, business casual, professional)
- `MEAL_PRESETS: Preset[]` - 4 preset levels for work meal expenses (provided, bring lunch, occasional buying, buy daily)

### Functions
- `getPresetsByCategory(category: PresetCategory): Preset[]` - Returns all presets for a specific category
- `getAllPresets(): Preset[]` - Returns all presets from all categories (total 13 presets)
- `detectPreset(category: PresetCategory, currentValues: Partial<MoneyExpenses & TimeExpenses>): Preset | null` - Detects which preset matches current values, returns null if no match
- `getPresetById(id: string): Preset | null` - Finds a specific preset by its ID

## Key Functionality

### Commute Presets
- **None**: $0/year - Remote work, no commute
- **Short**: $1,200/year (~$100/month) - Less than 15 min each way
- **Medium**: $3,000/year (~$250/month) - 15-30 min each way
- **Long**: $6,000/year (~$500/month) - 30-60 min each way
- **Very Long**: $10,000/year (~$830/month) - Over 60 min each way

### Clothing Presets
- **Uniform Provided**: $0/year - Employer provides clothing
- **Casual**: $200/year - Minimal work-specific clothing
- **Business Casual**: $800/year - Some professional clothing required
- **Professional**: $2,000/year - Suits and formal wear required

### Meal Presets
- **Provided**: $0/year - Employer provides meals
- **Bring Lunch**: $500/year - Pack lunch most days
- **Occasional**: $1,500/year - Buy lunch 1-2 times per week
- **Daily**: $3,500/year - Buy lunch most work days

## Dependencies
- `@/types/calculator` - Preset, PresetCategory, MoneyExpenses, TimeExpenses types

## Tests
- Location: `tests/lib/presets/index.test.ts`
- Coverage: All preset arrays, all helper functions
- Tests: 21 tests covering structure validation, category filtering, preset detection, and ID lookup

## Integration
- Used by: PresetSelector component (future), ExpenseInputs component (future)
- Part of: Actual Hourly Wage Calculator feature
- Implements: Requirements from specs/actual-hourly-wage-calculator/requirements.md

## Related
- Implements: Task 8 from specs/actual-hourly-wage-calculator/tasks.md
- Design: specs/actual-hourly-wage-calculator/design.md (Presets Configuration section)
- Types: src/types/calculator.ts

## Implementation Notes
- Presets are immutable constants
- All helper functions are pure (no side effects)
- Preset detection uses exact value matching (===)
- Returns null when no preset matches (allows for custom values)
- Values represent annual costs in cents (e.g., 1200 = $1,200/year)
