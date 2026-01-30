# Feature: Coast FIRE Calculator (Ró FIRE Reiknivél)

## Overview
Coast FIRE (Ró FIRE) calculator helps users determine when their current investments will grow to meet their FI number without additional contributions, allowing them to "coast" to financial independence.

## Status
🔄 In Progress - Epic 7 Complete (24/29 tasks complete)

**Progress by Epic:**
- ✅ Epic 1: Foundation - Types, Constants, Core Calculations (4/4 tasks)
- ✅ Epic 2: State Management - CalculatorContext Integration (3/3 tasks)
- ✅ Epic 3: Basic UI - Input Forms and Results Display (6/6 tasks)
- ✅ Epic 4: Visualization - Growth Projection Chart (4/4 tasks)
- ⏳ Epic 5: Advanced Features - Scenarios and Life Energy (0/3 tasks)
- ✅ Epic 6: Integration with Expense Baseline and AWH (3/3 tasks)
- ✅ Epic 7: Educational Content and Polish (4/4 tasks) **[NEWLY COMPLETED]**
- ⏳ Epic 8: Main Page and Routing (0/3 tasks)

## Architecture

### Core Calculations
**Location**: `src/lib/calculations/coastFire.ts`
- `calculateFutureValue()`: Compound interest projection
- `calculateCoastFINumber()`: Present value for Coast FIRE
- `calculateYearsToCoast()`: Time to reach Coast FIRE
- `calculateGapToCoast()`: ISK needed to start coasting
- `calculateCoastFIREStatus()`: Determine coasting/future/impossible
- `calculateScenarioResults()`: Run multiple return scenarios
- `calculateGrowthProjection()`: Year-by-year data for charts
- `calculateLifeEnergy()`: Convert ISK to work hours/years
- `calculateCoastFIREResult()`: Master orchestrator

### State Management
**Location**: `src/context/CalculatorContext.tsx`
- `coastFireState`: Input state with persistence
- `coastFireResults`: Auto-calculated results (memoized)
- Actions: `updateCoastFireState()`, `setCoastSelectedTier()`, `initializeCoastFireState()`
- Integration with expense baseline and AWH

### Components

#### Input Components
- **CoastFIREInputs** (`src/components/coastFire/CoastFIREInputs.tsx`)
  - Current age, investments, retirement age
  - Expected return rate slider
  - FI number input with baseline integration
  - Validation and error display

#### Results Components
- **CoastFIREResults** (`src/components/coastFire/CoastFIREResults.tsx`)
  - Orchestrates all result displays
  - Coast FIRE age and date
  - Gap to coast (if not coasting)
  - Projected balance at retirement
  - Plain language summary

- **CoastFIREStatus** (`src/components/coastFire/CoastFIREStatus.tsx`)
  - Status card (coasting/future/impossible)
  - Color-coded by status
  - Key metrics display

#### Visualization Components
- **GrowthProjectionChart** (`src/components/coastFire/GrowthProjectionChart.tsx`) ✅ NEW
  - Line chart showing investment growth trajectory
  - FI number target line (blue dashed)
  - Coast FIRE milestone marker (amber)
  - Retirement age milestone (purple)
  - Coasting period shading (amber area)
  - Interactive tooltips with Icelandic formatting
  - Status-based insights below chart

#### Container Components
- **CoastFIRECalculator** (`src/components/coastFire/CoastFIRECalculator.tsx`)
  - Main page component
  - Educational intro (collapsible)
  - Coordinates inputs and results
  - Loading and error states

- **CoastFIRECard** (`src/components/coastFire/CoastFIRECard.tsx`)
  - Dashboard card for calculator hub
  - Quick status overview
  - Link to full calculator

#### Integration Components
- **BaselineChangeNotification** (`src/components/coastFire/BaselineChangeNotification.tsx`) ✅ NEW
  - Displays notification when expense baseline changes
  - Shows new FI number and change amount/percentage
  - Auto-dismiss after 5 seconds (configurable)
  - Quick link to expense baseline tool
  - Color-coded change indicators

- **LifeEnergyDisplay** (`src/components/coastFire/LifeEnergyDisplay.tsx`)
  - Displays Coast FIRE in work hours/years
  - Integrated with AWH from context (Task 6.3)
  - Shows prompt to calculate AWH if not available
  - Current investments, gap, passive hours, hours saved

## Modules

### Foundation Modules
- **Types**: `src/types/coastFire.ts` - Complete TypeScript definitions
- **Constants**: `src/lib/constants/coastFire.ts` - Icelandic defaults, scenarios, colors
- **Calculations**: `src/lib/calculations/coastFire.ts` - Pure calculation functions
- **Context**: Integrated into `src/context/CalculatorContext.tsx`

### UI Modules
- **CoastFIREInputs**: Input form component
- **CoastFIREResults**: Results display orchestrator
- **CoastFIREStatus**: Status card component
- **CoastFIRECard**: Dashboard card component
- **GrowthProjectionChart**: Visualization component ✅ NEW

### Context Documentation
- `context/modules/CoastFireConstants.md` - Constants module
- `context/modules/CoastFireCalculations.md` - Calculations module
- `context/modules/CoastFireContext.md` - Context integration
- `context/modules/GrowthProjectionChart.md` - Chart component ✅ NEW

## Dependencies

### External Libraries
- `recharts@^3.7.0` - Chart visualization (already installed)
- React context for state management
- localStorage for persistence

### Internal Dependencies
- Expense Baseline: For FI number calculation from lifestyle tiers
- Actual Hourly Wage: For life energy calculations (future)
- Shared UI components: Card, Button, Alert, etc.
- Formatting utilities: `formatCurrency()`, `formatNumber()`

## Testing

### Unit Tests
- ✅ Calculation functions: `src/lib/calculations/__tests__/coastFire.test.ts` (53 tests, 100% coverage)
- ✅ Component tests: `src/components/coastFire/__tests__/CoastFIREStatus.test.tsx`

### Visual Tests (Manual)
- ✅ Chart rendering with different scenarios
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Status-based UI variations

### Integration Tests
- ⏳ Context state updates
- ⏳ Expense baseline integration
- ⏳ LocalStorage persistence
- ⏳ Auto-update on baseline changes

## Implementation Notes

### Epic 4: Visualization - Completed 2026-01-29

**Task 4.1-4.4: GrowthProjectionChart Component** ✅
- Combined all visualization tasks into single comprehensive component
- Implemented line chart with Recharts library
- Features:
  - Investment growth projection line (green, solid)
  - FI number target line (blue, dashed, horizontal)
  - Current age milestone (green dot, labeled "Nú")
  - Coast FIRE age milestone (amber vertical line with label)
  - Retirement age milestone (purple dot, labeled "Starfslok")
  - Coasting period shading (amber area between coast age and retirement)
  - Interactive tooltips showing age and balance
  - Status-based insight messages below chart
  - Chart legend with explanations
  - Responsive design with min dimensions (300x320)
  - ARIA labels for accessibility
- All text in Icelandic
- Y-axis auto-scales with padding
- Formatting: ISK values in millions/thousands
- Integration: Added to CoastFIREResults component
- Export: Added to barrel export (index.ts)
- Context: Module documentation created
- Performance: Data generation memoized
- Files:
  - Created: `src/components/coastFire/GrowthProjectionChart.tsx` (409 lines)
  - Modified: `src/components/coastFire/CoastFIREResults.tsx` (added chart integration)
  - Modified: `src/components/coastFire/CoastFIRECalculator.tsx` (updated props)
  - Modified: `src/components/coastFire/index.ts` (added export)
  - Created: `context/modules/GrowthProjectionChart.md`

### Epic 7: Educational Content and Polish (Complete 2026-01-29)

**Task 7.1: Enhanced EducationalIntro Component** ✅
- Created comprehensive educational component with collapsible sections
- Features:
  - Clear explanation of Coast FIRE concept (Icelandic)
  - Visual example with Sara (30 years old, realistic numbers)
  - 5 key benefits listed with checkmarks
  - 5 common misconceptions addressed with corrections
  - Collapsible sections for each topic
  - Links to 4 related calculators (Expense Baseline, FI Number, AWH, FIRE Explorer)
  - Expand/collapse all functionality
  - Dismissible with localStorage persistence
  - "Show again" functionality
- Implementation: `src/components/coastFire/EducationalIntro.tsx` (446 lines)
- Tests: `__tests__/EducationalIntro.test.tsx` (327 lines, 30+ test cases)
- Context: `context/modules/EducationalIntro.md`
- Integration: Updated CoastFIRECalculator to use enhanced intro

**Task 7.2: Return Rate and Multiplier Guidance** ✅
- Added comprehensive guidance for return rate slider
- Features:
  - Tooltip with historical context explanation
  - Historical return data box:
    * S&P 500 (1926-2023): ~7% real returns
    * Icelandic pension funds: 6-8% real returns
    * 60/40 portfolio: ~5-6% real returns
    * Conservative advice: 4-5% real returns
  - Impact visualization showing doubling time at different rates
  - Rule of 72 explanation
- Added FI multiplier guidance
- Features:
  - Tooltip explaining what multiplier means
  - Detailed explanation box with:
    * 25x (4% rule) - Trinity Study results
    * 30x (3.33% rule) - Conservative for Iceland
    * 33x (3% rule) - Very conservative
  - Impact comparison showing FI numbers at different multipliers
  - Example with 500,000 ISK monthly expenses
- Implementation: Updated CoastFIREInputs.tsx
- All tooltips and guidance in Icelandic

**Task 7.3: Accessibility Features** ✅
- Enhanced screen reader support
- Features:
  - aria-live region for results announcements
  - Announces status changes (coasting/future/impossible)
  - Proper ARIA labels on all interactive elements
  - aria-pressed on toggle buttons
  - aria-labelledby for grouped form sections
  - role="region" and role="group" for semantic structure
  - All buttons have descriptive aria-labels
  - Proper heading hierarchy (h2, h3)
- Keyboard navigation improvements
- Features:
  - All interactive elements keyboard accessible
  - Proper tab order maintained
  - Focus indicators on all buttons
  - aria-expanded for collapsible sections
  - aria-controls linking sections to buttons
- Color contrast verified (WCAG AA compliant)
- Implementation: Updated CoastFIREResults.tsx and CoastFIREInputs.tsx
- Form semantics: Added role="form" and aria-label

**Task 7.4: Testing and Documentation** ✅
- Created comprehensive test suite for EducationalIntro
- Test coverage (30+ test cases):
  - ✅ Rendering with all sections
  - ✅ Collapsing/expanding intro
  - ✅ Individual section expansion
  - ✅ Expand/collapse all functionality
  - ✅ Dismissal callback
  - ✅ All educational content present
  - ✅ ARIA attributes validation
  - ✅ Keyboard accessibility
  - ✅ Related calculator links
  - ✅ Edge cases and error handling
- Created module documentation: `context/modules/EducationalIntro.md`
- Updated barrel export: Added EducationalIntro to index.ts
- Updated feature documentation: This file

**Files Created/Modified:**
- Created: `src/components/coastFire/EducationalIntro.tsx` (446 lines)
- Created: `__tests__/EducationalIntro.test.tsx` (327 lines)
- Created: `context/modules/EducationalIntro.md` (full documentation)
- Modified: `src/components/coastFire/CoastFIRECalculator.tsx` (enhanced intro integration)
- Modified: `src/components/coastFire/CoastFIREInputs.tsx` (added guidance and accessibility)
- Modified: `src/components/coastFire/CoastFIREResults.tsx` (added screen reader announcements)
- Modified: `src/components/coastFire/index.ts` (added EducationalIntro export)
- Modified: `context/features/coast-fire-calculator.md` (this file)

**Testing:**
- ✅ EducationalIntro: 30+ test cases covering all functionality
- ✅ Accessibility: ARIA attributes validated
- ✅ Keyboard navigation: All components keyboard accessible
- ✅ Screen reader: Announcements working correctly
- ✅ Guidance tooltips: Displaying correctly
- ✅ Educational content: All sections rendering

**Design Decisions:**
1. **Comprehensive Education**: Addressed all common misconceptions upfront
2. **Realistic Example**: Used achievable numbers for Icelandic context (Sara, 30 years)
3. **Historical Context**: Provided real data for return rate expectations
4. **Multiplier Guidance**: Explained Trinity Study and Icelandic considerations
5. **Accessibility First**: Added ARIA before visual polish
6. **Screen Reader Announcements**: Dynamic updates announced to assistive tech
7. **Collapsible Sections**: Users control information density
8. **Permanent Dismissal**: Users can hide but restore intro

### Design Decisions (Updated)
1. **Combined Implementation**: Merged Tasks 4.1-4.4 into single component for better cohesion
2. **Color Scheme**: Green (growth), Blue (FI target), Amber (coast), Purple (retirement)
3. **Milestone Strategy**: Used ReferenceLine and ReferenceDot for clear markers
4. **Area Shading**: ReferenceArea for coasting period highlights the "coast to retirement" phase
5. **Status Messages**: Context-aware insights below chart based on calculation status
6. **Responsive**: Chart adapts to container with minimum dimensions for mobile
7. **Educational First**: Comprehensive guidance provided before users input data (Epic 7)
8. **Accessibility Priority**: WCAG 2.1 AA compliant with full screen reader support (Epic 7)

### Patterns Followed
- Consistent with existing chart components (SnowballChart, ComparisonChart)
- Recharts ResponsiveContainer for responsive sizing
- Custom tooltips with Icelandic formatting
- Memoized data generation for performance
- Status-based conditional rendering

### Epic 6: Integration with Expense Baseline and AWH (Complete 2026-01-29)

**Task 6.1: Expense Baseline Integration** ✅
- Already implemented in CoastFIREInputs component
- Features:
  - Toggle between manual FI number and baseline calculation
  - Tier selector (barebones/comfortable/deluxe) with Icelandic labels
  - FI multiplier selector (25x, 30x, custom)
  - Auto-calculation on tier/multiplier change
  - Visual breakdown showing calculation (monthly × 12 × multiplier)
  - Prompt to set up baseline if not available
- Implementation: Lines 59-119 of CoastFIREInputs.tsx
- useEffect hook recalculates FI number when tier/multiplier changes

**Task 6.2: Auto-Update on Baseline Changes** ✅
- Created BaselineChangeNotification component
- Added change detection logic to CoastFIRECalculator
- Features:
  - Detects baseline lastUpdated timestamp changes
  - Shows notification with new FI number
  - Displays change amount and percentage
  - Color-coded: amber for increases, green for decreases
  - Auto-dismiss after 5 seconds (configurable)
  - Quick link to expense baseline tool
  - Manual dismiss option
- Implementation:
  - Component: `src/components/coastFire/BaselineChangeNotification.tsx`
  - Integration: Updated CoastFIRECalculator with useEffect and useRef
  - Tests: `__tests__/BaselineChangeNotification.test.tsx` (comprehensive)
  - Documentation: `context/modules/BaselineChangeNotification.md`

**Task 6.3: AWH Integration for Life Energy** ✅
- Integrated LifeEnergyDisplay into CoastFIREResults
- Connected to actualHourlyWage from CalculatorContext
- Features:
  - Displays life energy metrics when AWH available
  - Shows work hours/years for current investments
  - Shows gap to Coast FIRE in life energy terms
  - Shows passive hours earned from compound growth
  - Shows hours saved by coasting vs continuing to save
  - Displays AWH prompt if not available (link to AWH calculator)
  - All text in Icelandic with proper formatting
- Implementation:
  - Modified CoastFIREResults to accept and pass actualHourlyWage
  - Modified CoastFIRECalculator to pass AWH from results
  - LifeEnergyDisplay already existed, now fully integrated
  - Calculation logic in coastFire.ts handles AWH → life energy conversion

**Files Created/Modified:**
- Created: `src/components/coastFire/BaselineChangeNotification.tsx` (131 lines)
- Created: `src/components/coastFire/__tests__/BaselineChangeNotification.test.tsx` (421 lines)
- Created: `context/modules/BaselineChangeNotification.md` (full documentation)
- Modified: `src/components/coastFire/CoastFIRECalculator.tsx` (added notification logic)
- Modified: `src/components/coastFire/CoastFIREResults.tsx` (added AWH prop, integrated LifeEnergyDisplay)
- Modified: `src/components/coastFire/index.ts` (added BaselineChangeNotification export)
- Modified: `context/features/coast-fire-calculator.md` (updated status)

**Testing:**
- ✅ BaselineChangeNotification: 15+ test cases covering all functionality
- ✅ Integration points tested via component interaction
- ✅ Change detection logic validated
- ✅ AWH passthrough verified

**Design Decisions:**
1. **Change Detection**: Used lastUpdated timestamp comparison + useRef to track previous state
2. **Notification UX**: Non-intrusive, auto-dismissing, with manual options
3. **Color Coding**: Amber for FI increases (needs more savings), green for decreases (less needed)
4. **AWH Integration**: Pass-through pattern - calculator gets from context, passes to results to display
5. **LifeEnergy Display**: Component already existed, just needed proper prop connection

## Next Steps

### Epic 5: Advanced Features - Scenarios and Life Energy
- Task 5.1: Create ScenarioComparisonTable Component
- Task 5.2: Create LifeEnergyDisplay Component
- Task 5.3: Create ActionSuggestionsPanel Component

### Epic 6: Integration (COMPLETE ✅)
- ✅ Task 6.1: Implement Expense Baseline Integration
- ✅ Task 6.2: Implement Auto-Update on Baseline Changes
- ✅ Task 6.3: Implement AWH Integration for Life Energy

### Epic 7: Educational Content and Polish (COMPLETE ✅)
- ✅ Task 7.1: Enhanced EducationalIntro Component
- ✅ Task 7.2: Return Rate and Multiplier Guidance
- ✅ Task 7.3: Accessibility Features
- ✅ Task 7.4: Testing and Documentation

### Epic 8: Routing
- Task 8.1: Create Route Page
- Task 8.2: Add to Calculator Navigation
- Task 8.3: Component Barrel Export (already done)

## Related Documentation
- Requirements: `specs/coast-fire/requirements-coast-fire.md`
- Design: `specs/coast-fire/design-coast-fire.md`
- Tasks: `specs/coast-fire/tasks-coast-fire.md`
- Implementation Status: `context/IMPLEMENTATION_STATUS.md`
