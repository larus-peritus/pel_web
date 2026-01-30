# Module: SavingsReportCalculator (Main Component)

## Location
`apps/peninganaedalifid/src/components/savingsReport/SavingsReportCalculator.tsx`

## Purpose
Main orchestration component for the Savings Report feature. Manages view mode switching between dashboard and editor, provides educational content, and handles initial state detection.

## Component: SavingsReportCalculator

Main component that coordinates all savings report functionality.

### Features
1. **Auto-detects initial mode**
   - Shows editor if no savings data exists
   - Shows dashboard if data exists
   - Calls `hasSavingsReport()` to check

2. **View mode toggle**
   - "Yfirlit" (Dashboard) button
   - "Breyta" (Editor) button
   - Switches between `SavingsDashboard` and `SavingsEditor`

3. **Educational intro section**
   - Collapsible card with success gradient background
   - Explains savings tracking concept
   - Describes life energy integration
   - Can be dismissed by user

4. **AWH warning**
   - Alert shown when actual hourly wage not calculated
   - Directs user to "Tímakaup" tab
   - Warning style with amber colors

5. **Empty state handling**
   - Shows when no data exists
   - Displays 💰 icon and message
   - "Byrja að skrá sparnað" button
   - Calls `initializeSavingsReport()` when clicked

### Props
None - uses `useCalculator()` hook internally

### State
- `viewMode`: 'dashboard' | 'editor' - Current view mode
- `showIntro`: boolean - Whether to show educational intro

### Integration with Context
Uses `useCalculator()` hook to access:
- `hasSavingsReport()` - Check if data exists
- `initializeSavingsReport()` - Initialize with default categories
- `results.actualHourlyWage` - Check if AWH is calculated

### Rendered Components
- `SavingsEditor` - When in editor mode and data exists
- `SavingsDashboard` - When in dashboard mode and data exists
- Empty state card - When no data exists

## Route Integration

**File**: `src/app/sparnadarskyrsla/page.tsx`

### Page Structure
```typescript
- CalculatorProvider wrapper
- Hero section with title and description
- SavingsReportCalculator component
- Privacy notice section
```

### Metadata
- Title: "Sparnaðarskýrsla | Peningana eða lífið"
- Description: Focus on savings tracking and savings rate

## Navigation Integration

**File**: `src/components/calculator/CalculatorPageContent.tsx`

### Changes Made
1. Added to `SAVINGS_CALCULATORS` array:
   ```typescript
   {
     id: 'sparnadarskyrsla',
     name: 'Sparnaðarskýrsla',
     description: 'Fylgstu með sparnaðinum þínum í mismunandi flokkum...',
     icon: '💰',
     available: true,
   }
   ```

2. Added conditional rendering in `SavingsImpactContent`:
   ```typescript
   if (selectedCalculator === 'sparnadarskyrsla') {
     return <SavingsReportCalculatorContent onBack={...} />
   }
   ```

3. Created `SavingsReportCalculatorContent` wrapper:
   - Back button to return to calculator list
   - Hero section with title and description
   - Container with `SavingsReportCalculator`

### Navigation Flow
```
Main Page
  └─> Sparnaður Tab
       └─> Click "Sparnaðarskýrsla" card
            └─> SavingsReportCalculatorContent
                 └─> SavingsReportCalculator
                      ├─> SavingsDashboard (if data exists)
                      └─> SavingsEditor (edit mode or no data)
```

## Barrel Export

**File**: `src/components/savingsReport/index.ts`

Exports all public components:
- `SavingsReportCalculator` - Main component
- `SavingsDashboard` - Dashboard view
- `SavingsEditor` - Editor view
- All sub-components (for direct access if needed)

## User Experience Flow

### First-time User (No Data)
1. Sees educational intro explaining savings tracking
2. Sees AWH warning if not calculated
3. Sees empty state with "Byrja að skrá sparnað" button
4. Clicks button → initializes with 7 default categories
5. Shows `SavingsEditor` with all categories

### Returning User (Has Data)
1. Sees educational intro (can dismiss)
2. Sees AWH warning if applicable
3. Automatically shows `SavingsDashboard`
4. Can click "Breyta" to switch to `SavingsEditor`
5. Can click "Yfirlit" to return to `SavingsDashboard`

## Styling

### Color Scheme
- **Educational intro**: Success gradient (success-50 to primary-50)
- **AWH warning**: Warning colors (amber)
- **View toggle buttons**: Primary/secondary variants
- **Empty state**: Centered card with large icon

### Responsive Design
- Toggle buttons: Flex layout, wraps on mobile
- Cards: Full width on mobile, constrained on desktop
- Educational intro: Flexible layout with dismiss button

## Implementation Notes

### Key Decisions
1. **Auto-detect mode**: Provides better UX than always starting in editor
2. **Collapsible intro**: Reduces clutter for returning users
3. **AWH warning**: Critical for life energy feature
4. **Empty state**: Clear call-to-action for new users

### Dependencies
- `useCalculator` hook from CalculatorContext
- UI components: `Card`, `Button`, `Alert`
- Child components: `SavingsEditor`, `SavingsDashboard`

### Future Enhancements
Potential improvements:
- Remember user's preferred view mode (localStorage)
- Tutorial overlay for first-time users
- Quick actions in dashboard view
- Export/import buttons in main component

## Related Documentation
- Epic 5 Tasks: specs/savings-report/tasks-savings-report.md (Tasks 5.1-5.4)
- Editor UI: context/modules/SavingsReportEditorUI.md
- Dashboard UI: context/modules/SavingsDashboard.md
- Context Integration: context/modules/SavingsReportContext.md

## Status
✅ Complete - Implemented 2026-01-26
- Task 5.1: SavingsReportCalculator main component (157 lines)
- Task 5.2: Barrel export created
- Task 5.3: Route page created at /sparnadarskyrsla
- Task 5.4: Navigation integration complete
- Build: TypeScript compilation successful, 0 errors
