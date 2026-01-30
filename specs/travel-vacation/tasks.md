# Verkefnalisti: Ferða- og Frístundakostnaðarreiknivél (Travel/Vacation Cost Calculator)

## Yfirlit

**Eiginleiki**: Ferða- og Frístundakostnaðarreiknivél
**Tengist**:
- Kröfur: `/specs/travel-vacation/requirements.md`
- Hönnun: `/specs/travel-vacation/design.md`

**Áætlaður heildartími**: 18-22 klukkustundir

## Útfærslurstefna

Við notum **Foundation-First með Feature Slices** nálgun:
1. Byrja með core calculation logic (auðvelt að prófa)
2. Byggja basic UI components
3. Bæta við forstillingum (user-friendly feature)
4. Bæta við advanced features (comparison, staycation, FI impact)
5. Polera og test

Þessi röð tryggir að við höfum alltaf virkandi útgáfu og getum shipped early ef nauðsynlegt.

---

## Epic 1: Core Calculation Engine

**Markmið**: Útfæra alla útreikningavirkni með unit tests.

**Tími**: 5-6 klukkustundir

**Áhrif**: Þetta er grunnurinn - án þessa virkar ekkert annað.

---

### Verkefni 1.1: Data Models og Types

**Áætlaður tími**: 0.5 klst

**Skrár til að búa til/breyta**:
- `src/types/travelVacation.types.ts` (ný)

**Virkni**:
1. Búa til allar TypeScript interfaces úr design document:
   - `TripCosts`
   - `TripDetails`
   - `TripInput`
   - `TravelCalculationSettings`
   - `TotalCostBreakdown`
   - `LifeEnergyCost`
   - `FutureValueResult`
   - `OpportunityCost`
   - `StaycationComparison`
   - `FIImpact`
   - `TripCalculationResult`
   - `TripComparison`
   - `TripPreset`
   - `TravelVacationState`
   - `RequiredCalculatorData`

2. Skilgreina constants:
   - `DEFAULT_SETTINGS`
   - `INITIAL_TRIP_INPUT`
   - `INITIAL_STATE`
   - `TRIP_PRESETS` (3 forstillingar)
   - `STORAGE_KEY`

3. Skilgreina validation types:
   - `ValidationResult` interface

**Prófanir**:
- Ekki beinar prófanir (type definitions)
- TypeScript compiler validation

**Kröfur sem uppfylltar**: Grunnur fyrir allar kröfur

**Gátlisti**:
- [ ] Allar interfaces skilgreindar samkvæmt hönnun
- [ ] JSDoc comments fyrir allar interfaces
- [ ] TRIP_PRESETS með raunhæfum gildum
- [ ] Constants exported
- [ ] TypeScript compiles án villna

---

### Verkefni 1.2: Total Cost Calculation

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/utils/travelVacationCalculations.ts` (ný)
- `src/utils/travelVacationCalculations.test.ts` (ný)

**Virkni**:
1. Útfæra `calculateTotalCost()`:
   - Sum all cost categories
   - Calculate food total (foodPerDay × days)
   - Calculate cost per day
   - Return TotalCostBreakdown

2. Útfæra `formatCurrency()` helper:
   - Format ISK með thousands separators
   - Return "X.XXX.XXX kr"

**Prófanir**:
```typescript
// Test cases:
- Typical trip costs calculated correctly
- Food total = foodPerDay × days
- Cost per day = total / days
- Zero costs handled correctly
- formatCurrency formats með kommu
```

**Kröfur sem uppfylltar**: NS-1 (hluti)

**Gátlisti**:
- [ ] calculateTotalCost() útfært
- [ ] formatCurrency() helper
- [ ] Öll unit tests pass
- [ ] JSDoc comments

---

### Verkefni 1.3: Life Energy Calculation

**Áætlaður tími**: 1.5 klst

**Skrár til að breyta**:
- `src/utils/travelVacationCalculations.ts`
- `src/utils/travelVacationCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateLifeEnergyCost()`:
   - Calculate totalHours = totalCost / actualHourlyWage
   - Calculate workDays, workWeeks
   - Calculate hoursPerTripDay
   - Call formatLifeEnergy helper

2. Útfæra `formatLifeEnergy()` helper:
   - Convert hours to weeks/days/hours
   - Icelandic formatting
   - Handle singular/plural ("vika" vs "vikur")

**Prófanir**:
```typescript
// Test cases:
- 285k trip @ 4500/hr = 63.3 hours
- Correctly formats to "X vikur og Y dagar"
- Hours per trip day calculated correctly
- Zero wage throws error
- Small trips show only hours/days
- Large trips show weeks + days
```

**Kröfur sem uppfylltar**: NS-1 (lífsorgu útreikningur)

**Gátlisti**:
- [ ] calculateLifeEnergyCost() útfært
- [ ] formatLifeEnergy() með íslensku plural logic
- [ ] Edge cases handled
- [ ] Öll unit tests pass

---

### Verkefni 1.4: Opportunity Cost Calculation

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/utils/travelVacationCalculations.ts`
- `src/utils/travelVacationCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateFutureValue()`:
   - Formula: PV × (1 + r)^n
   - Input: presentValue, rate, years
   - Return: future value

2. Útfæra `calculateOpportunityCost()`:
   - Loop through futureValueYears [10, 20, 30]
   - Calculate FV fyrir hvert
   - Calculate opportunityCostPerDay (20 year FV / days)
   - Format með formatCurrency
   - Return OpportunityCost

**Prófanir**:
```typescript
// Test cases:
- 285k @ 7% for 10 years = 560,688 kr
- 285k @ 0% for 10 years = 285,000 kr
- All three periods return correct values
- Opportunity cost per day calculated correctly
```

**Kröfur sem uppfylltar**: NS-2

**Gátlisti**:
- [ ] calculateFutureValue() með réttri formúlu
- [ ] calculateOpportunityCost() útfært
- [ ] Opportunity cost per day reiknað
- [ ] Öll unit tests pass
- [ ] Niðurstöður passa við Excel

---

### Verkefni 1.5: Staycation Comparison Calculation

**Áætlaður tími**: 0.5 klst

**Skrár til að breyta**:
- `src/utils/travelVacationCalculations.ts`
- `src/utils/travelVacationCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateStaycationComparison()`:
   - Calculate staycationTotalCost = dailyCost × days
   - Calculate additionalCostToTravel = tripCost - staycationCost
   - Calculate additionalLifeEnergyHours
   - Format summary text í íslensku

**Prófanir**:
```typescript
// Test cases:
- 285k trip, 3k/day staycation = 270k additional
- Additional life energy hours correct
- Summary text formatted correctly
- Zero staycation cost handled
```

**Kröfur sem uppfylltar**: NS-4

**Gátlisti**:
- [ ] calculateStaycationComparison() útfært
- [ ] Summary text í íslensku
- [ ] Öll unit tests pass

---

### Verkefni 1.6: FI Impact Calculation

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/utils/travelVacationCalculations.ts`
- `src/utils/travelVacationCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateFIImpact()`:
   - Check if fiData exists and valid
   - Return undefined if not
   - Calculate delayYears = totalCost / annualSavings
   - Convert to days and months
   - Calculate tripsPerMonthDelay
   - Format með formatDelay helper

2. Útfæra `formatDelay()` helper:
   - Convert months to years/months
   - Icelandic formatting
   - Handle singular/plural

**Prófanir**:
```typescript
// Test cases:
- 285k trip, 1.5M savings = ~2.3 months delay
- tripsPerMonthDelay calculated correctly
- No fiData returns undefined
- Zero savings returns undefined
- formatDelay handles all ranges
```

**Kröfur sem uppfylltar**: NS-5

**Gátlisti**:
- [ ] calculateFIImpact() útfært
- [ ] formatDelay() helper
- [ ] tripsPerMonthDelay calculation
- [ ] Handles missing data gracefully
- [ ] Öll unit tests pass

---

### Verkefni 1.7: Master Calculation Functions

**Áætlaður tími**: 1.5 klst

**Skrár til að breyta**:
- `src/utils/travelVacationCalculations.ts`
- `src/utils/travelVacationCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateTripResult()`:
   - Validate inputs (actualHourlyWage, days > 0)
   - Call calculateTotalCost()
   - Call calculateLifeEnergyCost()
   - Call calculateOpportunityCost()
   - Call calculateStaycationComparison() (if enabled)
   - Call calculateFIImpact() (if data available)
   - Return complete TripCalculationResult

2. Útfæra `compareTrips()`:
   - Take array of TripInput (2-3 items)
   - Calculate result for each
   - Find cheapestTripIndex
   - Calculate maxLifeEnergyDifference
   - Calculate savingsWithCheapest
   - Return TripComparison

3. Útfæra `applyPreset()`:
   - Take TripPreset
   - Calculate midpoint fyrir alla cost ranges
   - Return TripInput með fylltum gildum

**Prófanir**:
```typescript
// Integration tests:
- Full calculation with all valid data
- Calculation without FI data (fiImpact undefined)
- Calculation without staycation (undefined)
- Throws error if actualHourlyWage missing
- Throws error if days <= 0
- compareTrips identifies cheapest correctly
- compareTrips calculates savings correctly
- applyPreset fills midpoint values
```

**Kröfur sem uppfylltar**: NS-1, NS-2, NS-3, NS-4, NS-5 (completion)

**Gátlisti**:
- [ ] calculateTripResult() útfært
- [ ] compareTrips() útfært
- [ ] applyPreset() útfært
- [ ] Error handling fyrir invalid inputs
- [ ] Integration tests pass
- [ ] Öll calculation logic tested

---

## Epic 2: Data Layer og Validation

**Markmið**: localStorage persistence og input validation.

**Tími**: 2-3 klukkustundir

**Áhrif**: Gerir kleift að vista útreikninga og tryggja valid inputs.

---

### Verkefni 2.1: Validation Functions

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/utils/travelVacationValidation.ts` (ný)
- `src/utils/travelVacationValidation.test.ts` (ný)

**Virkni**:
1. Útfæra `validateTripInput()`:
   - Check days between 1-90
   - Check name length <= 100 if present
   - Check at least one cost > 0
   - Return ValidationResult með íslensku error messages

2. Útfæra `validateSettings()`:
   - Check expectedReturnRate between 0-15%
   - Check staycationDailyCost >= 0
   - Return ValidationResult

**Prófanir**:
```typescript
// Test cases:
- Valid input passes
- Days = 0 fails
- Days > 90 fails
- Name too long fails
- All costs = 0 fails (warning)
- Return rate < 0% fails
- Return rate > 15% fails
- Negative staycation cost fails
```

**Kröfur sem uppfylltar**: Input validation fyrir NS-1, NS-4

**Gátlisti**:
- [ ] validateTripInput() útfært
- [ ] validateSettings() útfært
- [ ] Öll tests pass
- [ ] Error messages í íslensku

---

### Verkefni 2.2: localStorage Persistence

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/utils/travelVacationStorage.ts` (ný)
- `src/utils/travelVacationStorage.test.ts` (ný)

**Virkni**:
1. Útfæra `saveToLocalStorage()`:
   - Serialize TravelVacationState to JSON
   - Save with key 'travelVacation_state'
   - Handle errors gracefully

2. Útfæra `loadFromLocalStorage()`:
   - Load from localStorage
   - Parse JSON
   - Return null if not found or error
   - Validate loaded data structure

3. Útfæra `clearLocalStorage()`:
   - Remove key from localStorage

**Prófanir**:
```typescript
// Test cases (with mock localStorage):
- Save and load state successfully
- Load returns null if no data
- Load returns null if invalid JSON
- Clear removes data
- Handles localStorage quota errors
```

**Kröfur sem uppfylltar**: NS-6

**Gátlisti**:
- [ ] saveToLocalStorage() útfært
- [ ] loadFromLocalStorage() útfært
- [ ] clearLocalStorage() útfært
- [ ] Error handling robust
- [ ] Tests með mock localStorage

---

## Epic 3: Basic UI Components

**Markmið**: Byggja basic UI til að sýna eina ferð.

**Tími**: 5-6 klukkustundir

**Áhrif**: Notendur geta notað basic virkni (single trip).

---

### Verkefni 3.1: Shared UI Components (ef ekki til)

**Áætlaður tími**: 1 klst (ef búa þarf til)

**Skrár til að búa til/breyta**:
- `src/components/common/Card.tsx` (búa til ef ekki til)
- `src/components/common/FormField.tsx` (búa til ef ekki til)
- `src/components/common/BigNumber.tsx` (búa til ef ekki til)
- `src/components/common/Badge.tsx` (búa til ef ekki til)

**Virkni**:
Nota existing components frá öðrum reiknivélum eða búa til ef vantar.

**Gátlisti**:
- [ ] Allir nauðsynlegir shared components til staðar
- [ ] Consistent styling með Tailwind
- [ ] Accessible

---

### Verkefni 3.2: CostInputs Component

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/CostInputs.tsx` (ný)
- `src/components/travelVacation/CostInputs.test.tsx` (ný)

**Virkni**:
1. Render input fields fyrir alla 6 kostnaðarliði:
   - Transportation (með plane icon)
   - Accommodation (með hotel icon)
   - Food per day (með restaurant icon, sýna heildar)
   - Activities (með activity icon)
   - Local transport (með car icon)
   - Other

2. Real-time total preview at bottom

3. Props interface:
   - `costs: TripCosts`
   - `days: number`
   - `onCostsChange: (costs: TripCosts) => void`

**Prófanir**:
```typescript
// Tests:
- Renders all 6 input fields
- onChange callbacks fire correctly
- Food total calculated (foodPerDay × days)
- Total preview updates
- Icons displayed
```

**Kröfur sem uppfylltar**: NS-1 (cost inputs)

**Gátlisti**:
- [ ] Component renders með öllum fields
- [ ] Icons fyrir hvern flokk
- [ ] Real-time total preview
- [ ] Tests pass

---

### Verkefni 3.3: TripInputSection Component

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/TripInputSection.tsx` (ný)
- `src/components/travelVacation/TripInputSection.test.tsx` (ný)

**Virkni**:
1. Render Card með:
   - Trip details inputs (name, days, destination)
   - CostInputs component
   - Settings (return rate, staycation toggle)

2. Props interface:
   - `trip: TripInput`
   - `settings: TravelCalculationSettings`
   - `onTripChange`
   - `onSettingsChange`
   - `onApplyPreset` (fyrir núna dummy, útfært í Epic 4)

3. Validation feedback display

**Prófanir**:
```typescript
// Tests:
- Renders all sections
- Trip details onChange works
- Settings onChange works
- Validation errors displayed
- Staycation toggle shows/hides daily cost input
```

**Kröfur sem uppfylltar**: NS-1 input section

**Gátlisti**:
- [ ] Component renders correctly
- [ ] All inputs working
- [ ] Validation integrated
- [ ] Tests pass

---

### Verkefni 3.4: Result Cards Components

**Áætlaður tími**: 2 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/TotalCostCard.tsx` (ný)
- `src/components/travelVacation/LifeEnergyCard.tsx` (ný)
- `src/components/travelVacation/OpportunityCostCard.tsx` (ný)
- `src/components/travelVacation/StaycationComparisonCard.tsx` (ný)
- `src/components/travelVacation/FIImpactCard.tsx` (ný)
- Corresponding test files

**Virkni**:

**TotalCostCard**:
- Display total cost as BigNumber
- Display cost per day
- Display breakdown list (collapsible eða expandable)

**LifeEnergyCard**:
- Display total hours as BigNumber
- Display formatted string (weeks/days)
- Display hours per trip day
- Help text með útskýringu

**OpportunityCostCard**:
- Display future values fyrir 10, 20, 30 ár
- Display opportunity cost per day
- Insight text

**StaycationComparisonCard**:
- Display staycation total cost
- Display additional cost to travel
- Display additional life energy hours
- Summary text (jákvæð framsetning)

**FIImpactCard**:
- Display delay months as BigNumber
- Display delay in work days
- Display trips per month delay
- Positive framing text

**Prófanir**:
```typescript
// For each card:
- Renders with mock data
- Displays all metrics correctly
- Formatting correct (currency, hours)
- Icelandic text
- Conditional rendering (StaycationCard, FIImpactCard)
```

**Kröfur sem uppfylltar**: NS-1, NS-2, NS-4, NS-5 (output)

**Gátlisti**:
- [ ] Allir 5 cards útfærðir
- [ ] Correct data displayed
- [ ] Íslensku textar
- [ ] Tests pass fyrir alla
- [ ] Accessible

---

## Epic 4: Main Page Integration og Forstillingar

**Markmið**: Tengja allt saman og bæta við forstillingum.

**Tími**: 3-4 klukkustundir

**Áhrif**: Functional single trip calculator með forstillingum.

---

### Verkefni 4.1: PresetSelector Component

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/PresetSelector.tsx` (ný)
- `src/components/travelVacation/PresetSelector.test.tsx` (ný)

**Virkni**:
1. Display grid af 3 preset cards:
   - Helgarferð til Evrópu
   - Viku sumarhús á Íslandi
   - Tveggja vikna langhryðjuferð

2. Each card shows:
   - Name
   - Description
   - Typical days
   - Estimated total cost range

3. onClick handler calls onSelect með preset

4. Props:
   - `presets: TripPreset[]`
   - `onSelect: (preset: TripPreset) => void`

**Prófanir**:
```typescript
// Tests:
- Renders all 3 presets
- Each card displays correct info
- onClick fires with correct preset
- Responsive grid layout
```

**Kröfur sem uppfylltar**: NS-7

**Gátlisti**:
- [ ] Component renders með TRIP_PRESETS
- [ ] Cards clickable
- [ ] Estimated ranges displayed
- [ ] Tests pass
- [ ] Responsive design

---

### Verkefni 4.2: TravelVacationPage Component

**Áætlaður tími**: 2.5 klst

**Skrár til að búa til/breyta**:
- `src/pages/TravelVacationPage.tsx` (ný)
- `src/pages/TravelVacationPage.test.tsx` (ný)

**Virkni**:
1. State management:
   - useState fyrir TravelVacationState
   - useState fyrir TripCalculationResult

2. Load calculatorData from CalculatorContext:
   - useContext fyrir CalculatorContext
   - Extract actualHourlyWage, fiData

3. Load/save localStorage:
   - useEffect on mount: loadFromLocalStorage
   - useEffect on state change: debounced saveToLocalStorage

4. Calculate results:
   - useEffect when trip/settings change
   - Call calculateTripResult
   - Update result state

5. Handle preset application:
   - handleApplyPreset calls applyPreset()
   - Updates mainTrip state

6. Render structure:
   - PageHeader
   - Warning if no actualHourlyWage
   - PresetSelector
   - TripInputSection
   - TripResultsSection (5 cards)
   - Clear button

**Prófanir**:
```typescript
// Integration tests:
- Loads from localStorage on mount
- Calculates results on input change
- Saves to localStorage (debounced)
- Shows warning if no actualHourlyWage
- Preset application fills form
- Clear button clears state
```

**Kröfur sem uppfylltar**: NS-1, NS-2, NS-4, NS-5, NS-6, NS-7 (integration)

**Gátlisti**:
- [ ] State management working
- [ ] localStorage integration
- [ ] Calculations triggered correctly
- [ ] All components render
- [ ] Preset application works
- [ ] Tests pass

---

### Verkefni 4.3: Routing og Navigation

**Áætlaður tími**: 0.5 klst

**Skrár til að breyta**:
- `src/App.tsx` (eða router config)
- `src/components/Navigation.tsx`

**Virkni**:
1. Bæta við route fyrir `/travel-vacation`
2. Bæta við navigation link í aðalnavigation
3. Breadcrumbs ef notað

**Gátlisti**:
- [ ] Route skilgreindur
- [ ] Navigation link virkar
- [ ] Link á íslensku
- [ ] Breadcrumbs (if applicable)

---

## Epic 5: Comparison Feature

**Markmið**: Bæta við samanburðarvirkni.

**Tími**: 3-4 klukkustundir

**Áhrif**: Power users geta borið saman marga ferðavalkosti.

---

### Verkefni 5.1: ComparisonToggle Component

**Áætlaður tími**: 0.5 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/ComparisonToggle.tsx` (ný)

**Virkni**:
1. Toggle button/switch:
   - Label: "Bera saman ferðavalkosti"
   - Boolean state
   - onChange callback

2. Help text

**Gátlisti**:
- [ ] Component renders
- [ ] Toggle works
- [ ] Accessible

---

### Verkefni 5.2: TripOptionInput Component

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/TripOptionInput.tsx` (ný)
- `src/components/travelVacation/TripOptionInput.test.tsx` (ný)

**Virkni**:
1. Condensed input fyrir eina ferð:
   - Name, days
   - All 6 cost categories (smaller format)
   - Remove button (ef ekki disabled)

2. Props:
   - `label: string`
   - `trip: TripInput`
   - `onChange: (trip: TripInput) => void`
   - `onRemove?: () => void`
   - `disabled?: boolean`

**Prófanir**:
```typescript
// Tests:
- Renders all fields
- onChange works
- Remove button shown if onRemove provided
- Disabled state works
```

**Gátlisti**:
- [ ] Component renders með condensed layout
- [ ] All inputs working
- [ ] Remove functionality
- [ ] Tests pass

---

### Verkefni 5.3: ComparisonSection Component

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/ComparisonSection.tsx` (ný)
- `src/components/travelVacation/ComparisonSection.test.tsx` (ný)

**Virkni**:
1. Display main trip (disabled TripOptionInput)
2. Up to 2 additional TripOptionInputs
3. "Bæta við valkosti" button (if < 2)
4. Handle add/remove trips

**Prófanir**:
```typescript
// Tests:
- Main trip displayed (disabled)
- Can add trip (up to 2 extras)
- Can remove trip
- Add button hidden when 2 extras
```

**Kröfur sem uppfylltar**: NS-3 input

**Gátlisti**:
- [ ] Displays up to 3 trips
- [ ] Add/remove working
- [ ] Tests pass

---

### Verkefni 5.4: ComparisonResultsSection Component

**Áætlaður tími**: 2 klst

**Skrár til að búa til/breyta**:
- `src/components/travelVacation/ComparisonResultsSection.tsx` (ný)
- `src/components/travelVacation/ComparisonResultsSection.test.tsx` (ný)

**Virkni**:
1. Responsive comparison table:
   - Header með trip names + cheapest badge
   - Rows: Lengd, Heildarkostnaður, Lífsorgu klst, Kostnaður á dag, Tækifæriskostnaður
   - Responsive: stacks on mobile, side-by-side on desktop

2. ComparisonInsights section:
   - Savings with cheapest option
   - Max difference in life energy
   - Positive messaging

**Prófanir**:
```typescript
// Tests:
- Table renders with all trips
- Cheapest badged correctly
- All metrics displayed
- Insights show correct savings
- Responsive behavior
```

**Kröfur sem uppfylltar**: NS-3 output

**Gátlisti**:
- [ ] Table renders correctly
- [ ] Cheapest highlighted
- [ ] All metrics shown
- [ ] Responsive design
- [ ] Tests pass

---

### Verkefni 5.5: Integrate Comparison into Main Page

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/pages/TravelVacationPage.tsx`

**Virkni**:
1. Add showComparison state
2. Add comparisonTrips to state
3. Add comparison result state
4. Calculate comparison when enabled:
   - Call compareTrips()
   - Update comparison state

5. Render ComparisonToggle, ComparisonSection, ComparisonResultsSection

6. Save/load comparison state í localStorage

**Prófanir**:
- Integration test fyrir comparison flow
- localStorage persistence

**Kröfur sem uppfylltar**: NS-3 (completion)

**Gátlisti**:
- [ ] Toggle shows/hides comparison
- [ ] Comparison calculates correctly
- [ ] Results displayed
- [ ] Persisted í localStorage
- [ ] Integration tests pass

---

## Epic 6: Polish og Testing

**Markmið**: Fínpússa, accessibility, og full test coverage.

**Tími**: 2-3 klukkustundir

**Áhrif**: Production-ready quality.

---

### Verkefni 6.1: Accessibility Audit

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- Allir components með accessibility issues

**Virkni**:
1. Keyra með screen reader (VoiceOver/NVDA)
2. Keyboard navigation testing
3. Add ARIA labels þar sem nauðsynlegt
4. Color contrast check

**Gátlisti**:
- [ ] Screen reader tested
- [ ] Keyboard navigation working
- [ ] ARIA labels added
- [ ] Color contrast AA
- [ ] No accessibility errors

---

### Verkefni 6.2: Mobile Responsive Testing

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- Components með responsive issues

**Virkni**:
1. Test á mobile viewports (320px, 375px, 768px)
2. Fix layout issues:
   - Cards stack correctly
   - Form fields full-width
   - Comparison table scrolls/stacks
   - Cost inputs readable

3. Touch targets adequate (44x44px minimum)

**Gátlisti**:
- [ ] Works on small phones
- [ ] Works on tablets
- [ ] No horizontal scroll
- [ ] Touch targets adequate
- [ ] Comparison table responsive

---

### Verkefni 6.3: Error Handling og Edge Cases

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- Calculation functions
- Components

**Virkni**:
1. Graceful error handling:
   - Display user-friendly errors
   - Log technical errors to console
   - Never crash the app

2. Edge cases:
   - Very short trips (1 day)
   - Very long trips (90 days)
   - Very small costs
   - Very large costs
   - Missing optional data
   - localStorage full
   - Invalid JSON í localStorage

3. User feedback:
   - Loading states if needed
   - Clear error messages í íslensku

**Gátlisti**:
- [ ] All edge cases handled
- [ ] Errors don't crash
- [ ] User-friendly messages
- [ ] Console errors logged
- [ ] Tests cover edge cases

---

### Verkefni 6.4: Final Integration Testing

**Áætlaður tími**: 1 klst

**Skrár til að búa til**:
- `src/pages/TravelVacationPage.integration.test.tsx`

**Virkni**:
1. Full user flows:
   - Apply preset, see results
   - Manual input trip, see results
   - Enable comparison, add trips, see comparison
   - Enable staycation, see comparison
   - Clear data, verify cleared
   - Reload page, verify persistence

2. Cross-feature integration:
   - Verify actualHourlyWage from context
   - Verify FI data from context

**Prófanir**:
```typescript
// Test scenarios:
- Complete happy path (single trip)
- Complete happy path (comparison)
- Preset application flow
- Staycation comparison flow
- localStorage persistence
- Missing actualHourlyWage warning
```

**Gátlisti**:
- [ ] All user flows tested
- [ ] Integration tests pass
- [ ] No regressions
- [ ] Performance acceptable

---

## Verkröðun og Dependency Graf

```
Epic 1: Core Calculation Engine (can work in parallel)
├── Task 1.1: Data Models ━━━━━━┐
├── Task 1.2: Total Cost         │
├── Task 1.3: Life Energy        │
├── Task 1.4: Opportunity Cost   │
├── Task 1.5: Staycation Calc    │
├── Task 1.6: FI Impact          │
└── Task 1.7: Master Functions   │
                                 │
Epic 2: Data Layer               │
├── Task 2.1: Validation ────────┤
└── Task 2.2: localStorage       │
                                 │
Epic 3: Basic UI ◄───────────────┘
├── Task 3.1: Shared Components (if needed)
├── Task 3.2: CostInputs
├── Task 3.3: TripInputSection
└── Task 3.4: Result Cards (5 cards)

Epic 4: Main Page & Presets ◄─── (depends on Epic 1-3)
├── Task 4.1: PresetSelector
├── Task 4.2: Main Page Component
└── Task 4.3: Routing

Epic 5: Comparison (depends on Epic 4 complete)
├── Task 5.1: Toggle
├── Task 5.2: TripOptionInput
├── Task 5.3: ComparisonSection
├── Task 5.4: ComparisonResults
└── Task 5.5: Integration

Epic 6: Polish (depends on all epics)
├── Task 6.1: Accessibility
├── Task 6.2: Responsive
├── Task 6.3: Error Handling
└── Task 6.4: Integration Tests
```

---

## Incremental Delivery Strategy

### Milestone 1: Basic Calculator (after Epic 1-4)

**Shippable**: Yes

**Features**:
- Single trip calculation
- Life energy + opportunity cost + FI impact + staycation
- Trip presets for quick setup
- localStorage persistence

**What's missing**: Comparison feature

**Value**: Fully functional for most use cases

---

### Milestone 2: Full Feature (after Epic 5)

**Shippable**: Yes

**Features**:
- Everything from M1
- Comparison mode (2-3 trip options)
- Side-by-side comparison

**What's missing**: Final polish

**Value**: Complete feature set

---

### Milestone 3: Production Ready (after Epic 6)

**Shippable**: Production

**Features**:
- Everything from M2
- Full accessibility
- Mobile optimized
- Robust error handling
- Complete test coverage

**Value**: Production quality

---

## Testing Strategy Summary

### Unit Tests

- All calculation functions (Epic 1)
- Validation functions (Epic 2)
- Helper functions (formatters)

**Coverage target**: 90%+ fyrir calculation logic

### Component Tests

- All React components (Epic 3, 4, 5)
- Props rendering
- Event handlers
- Conditional rendering

**Coverage target**: 80%+ fyrir components

### Integration Tests

- Main page flows (Epic 4, 6)
- localStorage integration
- Context integration
- Preset application flow
- Comparison flow

**Coverage target**: Critical paths covered

### Manual Tests

- Accessibility (Epic 6)
- Responsive design (Epic 6)
- Cross-browser compatibility
- Real device testing

---

## Áhættumat

### Lítil áhætta

- Calculation logic (well-defined, mathematical)
- localStorage (standard browser API)
- UI components (using existing patterns)

### Meðal áhætta

- Comparison table responsive design (complex layout)
- Icelandic plural formatting (many edge cases)
- Preset values accuracy (need validation from real users)
- localStorage quota limits (large state with comparisons)

### Áhættuminnkun

- Test responsive early and often
- Extensive tests fyrir formatters
- Preset disclaimer (estimates only)
- Handle localStorage errors gracefully

---

## Árangursviðmið

### Virkni

- [ ] Öll útreikningar framleiða réttar niðurstöður
- [ ] Forstillingar fylla út rétt
- [ ] Samanburður virkar með 1-3 valkostum
- [ ] Staycation samanburður virkar
- [ ] localStorage persistence áreiðanleg
- [ ] Virkar án actualHourlyWage (shows warning)

### Gæði

- [ ] 90%+ test coverage fyrir calculations
- [ ] 80%+ test coverage fyrir components
- [ ] Engar accessibility violations
- [ ] Passes Lighthouse audit (90+ scores)

### Notendaupplifun

- [ ] Intuitive UI (tested með user)
- [ ] Forstillingar hjálpa notendum
- [ ] Responsive á öllum devices
- [ ] Fast (<100ms calculation updates)
- [ ] Clear error messages
- [ ] Jákvæður tónn - ekki guilt-tripping

### Code Quality

- [ ] TypeScript strict mode
- [ ] ESLint/Prettier compliant
- [ ] JSDoc fyrir allar public functions
- [ ] Component props documented

---

## Framtíðar Útvíkkun (Utan Scope)

Þessi verkefni eru **ekki** hluti af MVP en skráð til framtíðar:

1. **Ferðasaga**: Vista allar ferðir og sjá mynstur yfir tíma
2. **Árleg ferðaáætlun**: "Ég vil fara á X ferðir á ári - hvernig passar það?"
3. **"Var þetta þess virði?" review**: 3-6 mánuðum eftir ferð
4. **Ferðasparnunartól**: Reikna mánaðarlegan sparnað til draumaferðar
5. **Live price integration**: Kalla á booking APIs (með privacy)
6. **Currency conversion**: Automatic gjaldeyriskostnaður
7. **Seasonal pricing**: Sýna hvernig verð breytist eftir árstíma
8. **CO2 footprint**: Umhverfisáhrif ferðar (optional)

---

## Samantekt

**Heildaráætlun**: 18-22 klukkustundir

**Epics**:
1. Core Calculation Engine: 5-6 klst
2. Data Layer: 2-3 klst
3. Basic UI: 5-6 klst
4. Main Page & Presets: 3-4 klst
5. Comparison Feature: 3-4 klst
6. Polish og Testing: 2-3 klst

**Delivery Milestones**:
- M1 (Basic Calculator): After Epic 1-4 (shippable)
- M2 (Full Feature): After Epic 5 (shippable)
- M3 (Production): After Epic 6 (production-ready)

**Key Features**:
- Single trip calculator með lífsorgu og tækifæriskostnaði
- 3 trip presets fyrir íslenska ferðalanga
- Staycation samanburður
- FI impact calculation
- Comparison mode fyrir 2-3 valkosti
- localStorage persistence

**Success Criteria**:
- All requirements met
- High test coverage
- Accessible and responsive
- Production quality code
- Jákvæð notendaupplifun

Þetta er tilbúið til að byrja implementation.
