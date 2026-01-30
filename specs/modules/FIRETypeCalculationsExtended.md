# FIRE Type Calculations - Extended Functions

## Location
`apps/peninganaedalifid/src/lib/calculations/fireTypes.ts`

## Purpose
Extended calculation functions for FIRE Type Explorer, including timeline generation, required savings rate calculations, and helper functions for recommendations.

## Exports

### Timeline Calculations
- `calculateRequiredSavingsRate(fiNumber, currentNetWorth, annualIncome, yearsAvailable, expectedReturn): number | null` - Iteratively solves for savings rate needed to reach FI within timeframe
- `generateFIRETimeline(calculation, currentAge): FIRETimeline` - Generates complete timeline with 5 milestones (0%, 25%, 50%, 75%, 100%) and projected yearly path

### Recommendation Helpers
- `generateActionSteps(calculation): string[]` - Creates 3-5 specific, actionable steps for pursuing a FIRE type (Icelandic)
- `generateTimelineString(calculation): string` - Human-readable timeline summary (e.g., "12 ár og 6 mánuðir (aldur 52)")
- `generateObstacles(calculation, inputs): string[]` - Identifies 1-4 potential challenges and obstacles (Icelandic)

## Key Functionality

### Required Savings Rate Calculation
Uses binary search algorithm to find the savings rate needed to reach FI within a target timeframe:
- Iterates with 0.01% tolerance
- Returns null if impossible even at 100% savings
- Returns 0 if already at FI number
- Handles edge cases (zero income, zero time available)

### Timeline Generation
Creates detailed timeline visualization data:
- **Milestones**: 5 checkpoints (Byrjun, 25%, Hálfnað, 75%, FIRE náð!)
- **Projected Path**: Yearly net worth snapshots up to 30 years or FI achievement
- **Progress Tracking**: Marks which milestones are already reached
- **Date Calculations**: Projects future dates for each milestone

### Action Steps
Type-specific actionable steps in Icelandic:
- **LeanFIRE**: Focus on expense reduction, minimalist lifestyle
- **RegularFIRE**: Maintain lifestyle, increase savings, index funds
- **CoastFIRE**: If coasting → reduce work; if not → save aggressively now
- **BaristaFIRE**: Plan for part-time work, calculate hours needed
- **FatFIRE**: Focus on high income, aggressive investing

Maximum 5 steps per type for clarity.

### Timeline Strings
Human-readable Icelandic summaries:
- "Þú ert þegar búin/n að ná FIRE!" (already achieved)
- "Ekki hægt að ná með núverandi sparnaði" (impossible)
- "12 ár og 6 mánuðir (aldur 52)" (normal case with age)
- "8 mánuðir" (less than 1 year)

### Obstacle Identification
Warns about potential challenges:
- High savings rate required (>50%)
- Long timeline (>20 years)
- Late retirement age (>65)
- Type-specific obstacles (e.g., LeanFIRE expense requirements)
- Low starting net worth (<10% progress)

Maximum 4 obstacles for conciseness.

## Dependencies
- `@/types/fireTypes` - Type definitions
- Existing calculation functions from same file (calculateYearsToFI, etc.)

## Tests
- Location: `src/lib/calculations/__tests__/fireTypes.test.ts`
- Coverage: 31 additional tests for new functions
- Total test count: 89 tests (all passing)

### Test Categories
1. **Required Savings Rate** (6 tests)
   - Achievable goals
   - Already at FI
   - Impossible scenarios
   - Edge cases (zero years, zero income)
   - Timeframe sensitivity

2. **Timeline Generation** (6 tests)
   - 5 milestone structure
   - Progress tracking
   - Icelandic labels
   - Projected path generation
   - Already achieved handling

3. **Action Steps** (6 tests)
   - All 5 FIRE types
   - Type-specific content
   - Maximum 5 steps limit

4. **Timeline Strings** (5 tests)
   - Normal timelines
   - Already achieved
   - Impossible scenarios
   - Age inclusion
   - Sub-year handling

5. **Obstacles** (8 tests)
   - High savings rate detection
   - Long timeline warnings
   - Late age warnings
   - Type-specific obstacles (all 5 types)
   - Maximum 4 obstacles limit
   - Low net worth detection

## Integration
- Used by: Recommendation engine (calculateFIRERecommendations)
- Uses: Core calculation functions (calculateYearsToFI, calculateFINumber)
- Part of: Epic 1 (Foundation) tasks 1.4, 1.5, 1.6

## Related
- Implements: Requirements FR-2.6, FR-4.1-4.3, FR-5.1-5.2 from specs/fire-type-explorer/requirements-fire-type-explorer.md
- Part of: specs/fire-type-explorer/design-fire-type-explorer.md
- Complements: FIRETypeCalculations.md (basic calculations), FIRETypeConstants.md (definitions)

## Implementation Notes
- All functions are pure (no side effects)
- Comprehensive edge case handling
- Icelandic language for all user-facing strings
- Binary search for savings rate provides efficient O(log n) solution
- Timeline projection uses simplified linear interpolation for performance
- Maximum limits prevent UI clutter (5 steps, 4 obstacles)

## Performance Considerations
- Binary search converges in ~7-10 iterations typically
- Timeline path limited to 30 years max
- No heavy computations (all O(1) or O(log n))

## Future Enhancements
- More sophisticated timeline projection (compound growth simulation)
- Inflation adjustment in timeline strings
- Localization support for English version
- Personalized obstacle prioritization based on user profile
