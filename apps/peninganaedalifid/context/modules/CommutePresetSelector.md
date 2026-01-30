# CommutePresetSelector Component

## Location
`src/components/commute/CommutePresetSelector.tsx`

## Purpose
Dropdown selector component for choosing from preset commute scenarios, enabling quick form population with common Icelandic commute routes.

## Exports
- `CommutePresetSelector` - Dropdown component
- `CommutePresetSelectorProps` - TypeScript interface for component props

## Key Functionality
- **Grouped Presets**: Organizes presets by category (car, transit, active, remote)
- **Category Headers**: Disabled option elements serving as visual group headers with emojis
- **Preset Selection**: Calls onSelect callback with full preset data
- **Auto-reset**: Value resets to blank after selection for repeated use
- **11 Presets**: Covers common Icelandic commute scenarios

## Component Interface

```typescript
interface CommutePresetSelectorProps {
  onSelect: (preset: CommutePreset) => void;
  className?: string;
}
```

## Preset Categories
1. **Car (🚗)**: 6 presets
   - Kópavogur ↔ Reykjavík (10 km, gasoline)
   - Hafnarfjörður ↔ Reykjavík (12 km, gasoline)
   - Garðabær ↔ Reykjavík (8 km, electric)
   - Mosfellsbær ↔ Reykjavík (15 km, gasoline)
   - Akranes ↔ Reykjavík (50 km, gasoline)
   - Selfoss ↔ Reykjavík (60 km, diesel)

2. **Transit (🚌)**: 2 presets
   - Strætó - Mánaðarkort (10,500 kr/month)
   - Strætó - Stakir farmiðar (550 kr/ride)

3. **Active (🚴)**: 2 presets
   - Hjólreiðar - stutt vegalengd (<5 km)
   - Hjólreiðar - miðlungs vegalengd (5-10 km)

4. **Remote (🏠)**: 1 preset
   - Fjarvinnu - 100%

## Dependencies
- **UI Components**: Select
- **Constants**: COMMUTE_PRESETS from @/lib/calculations/commute
- **Types**: CommutePreset

## Options Structure
- Placeholder option: "-- Veldu forstillingu --"
- Category headers: Disabled options with emoji icons
- Preset options: Indented with 2 spaces for visual hierarchy

## Behavior
1. User selects a preset from dropdown
2. Component calls `onSelect(preset)` with full preset data
3. Parent component (CommuteForm) populates form fields
4. Select value resets to "" for next selection

## Tests
- **Location**: tests/components/commute/CommutePresetSelector.test.tsx
- **Coverage**: 13 tests covering:
  - Rendering and labeling
  - Help text display
  - Category headers
  - All preset categories
  - Selection callback
  - Disabled header handling
  - Custom className

## Usage Example

```tsx
<CommutePresetSelector
  onSelect={(preset) => {
    // Populate form with preset values
    setDistanceKm(preset.inputs.distanceKm);
    setDaysPerWeek(preset.inputs.daysPerWeek);
    // ... populate other fields
  }}
/>
```

## Integration
- Used by: CommuteForm component
- Data from: COMMUTE_PRESETS constant array
- Calls: onSelect callback with selected preset

## Related
- Implements: Task 4.2 from specs/vinnuferdakostnadur/tasks.md
- Part of: Commute Cost Calculator feature
- Data source: @/lib/calculations/commute (COMMUTE_PRESETS)
