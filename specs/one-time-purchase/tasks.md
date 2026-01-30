# Verkefnalisti: Einstakskaupaverkfæri (One-Time Purchase Decision Tool)

## Yfirlit

**Eiginleiki**: Einstakskaupaverkfæri
**Tengist**:
- Kröfur: `/specs/one-time-purchase/requirements.md`
- Hönnun: `/specs/one-time-purchase/design.md`

**Áætlaður heildartími**: 16-20 klukkustundir

## Útfærslurstefna

Við notum **Foundation-First** nálgun:
1. Byrja með core calculation logic (einfalt að prófa)
2. Byggja basic UI components
3. Bæta við advanced features (comparison, FI impact)
4. Polera og test

Þessi röð tryggir að við höfum alltaf virkandi útgáfu og getum shipped early ef nauðsynlegt.

---

## Epic 1: Core Calculation Engine

**Markmið**: Útfæra alla útreikningavirkni með unit tests.

**Tími**: 4-5 klukkustundir

**Áhrif**: Þetta er grunnurinn - án þessa virkar ekkert annað.

---

### Verkefni 1.1: Data Models og Types

**Áætlaður tími**: 0.5 klst

**Skrár til að búa til/breyta**:
- `src/types/oneTimePurchase.types.ts` (ný)

**Virkni**:
1. Búa til allar TypeScript interfaces úr design document:
   - `PurchaseInput`
   - `PurchaseCalculationSettings`
   - `LifeEnergyCost`
   - `FutureValueResult`
   - `FIImpact`
   - `PurchaseCalculationResult`
   - `PurchaseComparison`
   - `OneTimePurchaseState`
   - `RequiredUserData`

2. Skilgreina constants:
   - `DEFAULT_SETTINGS`
   - `INITIAL_STATE`
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
- [ ] Constants exported
- [ ] TypeScript compiles án villna

---

### Verkefni 1.2: Life Energy Calculation

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/utils/oneTimePurchaseCalculations.ts` (ný)
- `src/utils/oneTimePurchaseCalculations.test.ts` (ný)

**Virkni**:
1. Útfæra `calculateLifeEnergyCost()`:
   - Input: purchasePrice, actualHourlyWage
   - Calculate totalHours, workDays, workWeeks
   - Call formatLifeEnergy helper

2. Útfæra `formatLifeEnergy()` helper:
   - Convert hours to weeks/days/hours
   - Return Icelandic formatted string
   - Handle singular/plural correctly ("vika" vs "vikur")

3. Edge cases:
   - Very small purchases (< 1 hour)
   - Very large purchases (years of work)
   - Zero or negative wages (throw error)

**Prófanir**:
```typescript
// Test cases to implement:
- Typical purchase (2M kr @ 4500 kr/hr) = 444.4 hours
- Exactly 1 week (180k kr @ 4500 kr/hr) = 40 hours
- Exactly 2 weeks = "2 vikur" (not "2 vikur og 0 dagar")
- Small purchase (< 8 hours) shows only hours
- Large purchase shows weeks + days
- Zero wage throws error
- Negative wage throws error
```

**Kröfur sem uppfylltar**: NS-1 (hluti)

**Gátlisti**:
- [ ] calculateLifeEnergyCost() útfært
- [ ] formatLifeEnergy() útfært
- [ ] Öll unit tests skrif og pass
- [ ] Edge cases handled
- [ ] JSDoc comments

---

### Verkefni 1.3: Future Value Calculation

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/utils/oneTimePurchaseCalculations.ts`
- `src/utils/oneTimePurchaseCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateFutureValue()`:
   - Formula: PV × (1 + r)^n
   - Input: presentValue, annualReturnRate, years
   - Return: future value

2. Útfæra `calculateFutureValues()`:
   - Loop through futureValueYears array
   - Call calculateFutureValue for each
   - Format results með formatCurrency
   - Return array of FutureValueResult

3. Búa til `formatCurrency()` helper:
   - Format ISK með thousands separators
   - Round to 0 decimals
   - Return "X.XXX.XXX kr"

**Prófanir**:
```typescript
// Test cases:
- 2M kr @ 7% for 10 years = 3,933,778 kr
- 2M kr @ 0% for 10 years = 2,000,000 kr (no growth)
- 1M kr @ 10% for 20 years = 6,727,500 kr
- Test all three periods [10, 20, 30] return correct array
- formatCurrency formats correctly with separators
```

**Kröfur sem uppfylltar**: NS-2

**Gátlisti**:
- [ ] calculateFutureValue() útfært með réttri formúlu
- [ ] calculateFutureValues() útfært
- [ ] formatCurrency() helper
- [ ] Öll unit tests pass
- [ ] Niðurstöður passa við Excel/calculator

---

### Verkefni 1.4: FI Impact Calculation

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/utils/oneTimePurchaseCalculations.ts`
- `src/utils/oneTimePurchaseCalculations.test.ts`

**Virkni**:
1. Útfæra `calculateFIImpact()`:
   - Check if fiData exists and valid
   - Return undefined if not
   - Calculate delayYears = purchasePrice / annualSavings
   - Convert to days and months
   - Format með formatDelay helper

2. Útfæra `formatDelay()` helper:
   - Convert months to years/months
   - Icelandic formatting
   - Handle singular/plural
   - Examples: "3 mánuðir", "1 ár og 8 mánuðir", "2 ár"

**Prófanir**:
```typescript
// Test cases:
- 2M kr purchase, 1.2M annual savings = 20 months delay
- 600k purchase, 1.2M annual savings = 6 months
- 2.4M purchase, 1.2M annual savings = 2 years
- No fiData returns undefined
- Zero annualSavings returns undefined
- formatDelay handles singular/plural correctly
```

**Kröfur sem uppfylltar**: NS-4

**Gátlisti**:
- [ ] calculateFIImpact() útfært
- [ ] formatDelay() helper
- [ ] Handles missing/invalid data gracefully
- [ ] Öll unit tests pass
- [ ] Accurate calculations

---

### Verkefni 1.5: Master Calculation Function

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/utils/oneTimePurchaseCalculations.ts`
- `src/utils/oneTimePurchaseCalculations.test.ts`

**Virkni**:
1. Útfæra `calculatePurchaseResult()`:
   - Validate inputs (actualHourlyWage required, price > 0)
   - Call calculateLifeEnergyCost()
   - Call calculateFutureValues()
   - Call calculateFIImpact() (optional)
   - Return complete PurchaseCalculationResult

2. Útfæra `compareOptions()`:
   - Take array of PurchaseInput (2-3 items)
   - Calculate result for each
   - Find cheapest option index
   - Calculate maxLifeEnergyDifference
   - Return PurchaseComparison

**Prófanir**:
```typescript
// Integration tests:
- Full calculation with all valid data
- Full calculation without FI data (fiImpact undefined)
- Throws error if actualHourlyWage missing
- Throws error if price <= 0
- compareOptions correctly identifies cheapest
- compareOptions calculates difference correctly
```

**Kröfur sem uppfylltar**: NS-1, NS-2, NS-3, NS-4 (completion)

**Gátlisti**:
- [ ] calculatePurchaseResult() útfært
- [ ] compareOptions() útfært
- [ ] Error handling fyrir invalid inputs
- [ ] Integration tests pass
- [ ] Öll calculation logic tested

---

## Epic 2: Data Layer og State Management

**Markmið**: localStorage persistence og validation.

**Tími**: 2-3 klukkustundir

**Áhrif**: Gerir kleift að vista útreikninga og sækja userData.

---

### Verkefni 2.1: Validation Functions

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/utils/oneTimePurchaseValidation.ts` (ný)
- `src/utils/oneTimePurchaseValidation.test.ts` (ný)

**Virkni**:
1. Útfæra `validatePurchaseInput()`:
   - Check price > 0
   - Check price < 1 billion (sanity)
   - Check name length <= 100 if present
   - Return ValidationResult

2. Útfæra `validateSettings()`:
   - Check expectedReturnRate between 0-15%
   - Return ValidationResult

**Prófanir**:
```typescript
// Test cases:
- Valid input passes
- Zero price fails
- Negative price fails
- Extremely high price (> 1B) fails
- Name too long (> 100 chars) fails
- Return rate < 0% fails
- Return rate > 15% fails
- Return rate = 7% passes
```

**Kröfur sem uppfylltar**: Input validation fyrir NS-1

**Gátlisti**:
- [ ] validatePurchaseInput() útfært
- [ ] validateSettings() útfært
- [ ] Öll tests pass
- [ ] Meaningful error messages í íslensku

---

### Verkefni 2.2: localStorage Persistence

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/utils/oneTimePurchaseStorage.ts` (ný)
- `src/utils/oneTimePurchaseStorage.test.ts` (ný)

**Virkni**:
1. Útfæra `saveToLocalStorage()`:
   - Serialize OneTimePurchaseState to JSON
   - Save with key 'oneTimePurchase_state'
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

**Kröfur sem uppfylltar**: NS-5

**Gátlisti**:
- [ ] saveToLocalStorage() útfært
- [ ] loadFromLocalStorage() útfært
- [ ] clearLocalStorage() útfært
- [ ] Error handling robust
- [ ] Tests með mock localStorage

---

## Epic 3: Basic UI Components

**Markmið**: Byggja basic UI til að sýna eitt kaup.

**Tími**: 5-6 klukkustundir

**Áhrif**: Notendur geta notað basic virkni.

---

### Verkefni 3.1: Shared UI Primitives

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/components/common/Card.tsx` (búa til ef ekki til)
- `src/components/common/FormField.tsx` (búa til ef ekki til)
- `src/components/common/BigNumber.tsx` (ný)
- `src/components/common/Alert.tsx` (búa til ef ekki til)

**Virkni**:
1. **Card component** (ef ekki til):
   - CardHeader, CardBody subcomponents
   - Support fyrir icons
   - Tailwind styling

2. **FormField component** (ef ekki til):
   - Labels, inputs, help text
   - Error display
   - Support fyrir number, text inputs
   - Prefix/suffix support

3. **BigNumber component** (ný):
   - Display large number með unit
   - Styling for primary metric
   - Props: value, unit, label (optional)

4. **Alert component** (ef ekki til):
   - Variants: error, warning, info, success
   - AlertTitle subcomponent

**Prófanir**:
- Snapshot tests fyrir hvern component
- Props rendering correctly

**Kröfur sem uppfylltar**: UI grunnur

**Gátlisti**:
- [ ] Allir 4 components útfærðir
- [ ] Consistent styling með Tailwind
- [ ] Accessible (keyboard, screen reader)
- [ ] Component tests
- [ ] Reusable og vel skjalað

---

### Verkefni 3.2: PurchaseInputSection Component

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/PurchaseInputSection.tsx` (ný)
- `src/components/oneTimePurchase/PurchaseInputSection.test.tsx` (ný)

**Virkni**:
1. Render Card með form fields:
   - Kaupverð (number input, ISK)
   - Lýsing (text input, optional)
   - Vænt ávöxtun (number input, 0-15%, default 7%)

2. Props interface:
   - `purchase: PurchaseInput`
   - `settings: PurchaseCalculationSettings`
   - `onPurchaseChange: (purchase: PurchaseInput) => void`
   - `onSettingsChange: (settings: PurchaseCalculationSettings) => void`

3. Validation feedback:
   - Show errors from validation
   - Red border on invalid fields

4. Help text:
   - Explain ávöxtunarkrafa

**Prófanir**:
```typescript
// Component tests:
- Renders all form fields
- onChange callbacks fired with correct values
- Validation errors displayed
- Help text visible
- Accessible form labels
```

**Kröfur sem uppfylltar**: NS-1 input

**Gátlisti**:
- [ ] Component renders correctly
- [ ] Form fields working
- [ ] Validation integrated
- [ ] Help text íslensku
- [ ] Tests pass
- [ ] Accessible

---

### Verkefni 3.3: LifeEnergyCard Component

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/LifeEnergyCard.tsx` (ný)
- `src/components/oneTimePurchase/LifeEnergyCard.test.tsx` (ný)

**Virkni**:
1. Display life energy cost:
   - BigNumber fyrir totalHours
   - Secondary display fyrir formattedString
   - HelpText með skýringu

2. Icon: Clock icon

3. Styling: Highlight sem primary result

**Prófanir**:
```typescript
// Tests:
- Displays totalHours correctly
- Displays formatted string
- Shows help text
- Accessible
```

**Kröfur sem uppfylltar**: NS-1 output

**Gátlisti**:
- [ ] Component renders með mock data
- [ ] All display elements present
- [ ] Íslensku textar
- [ ] Tests pass

---

### Verkefni 3.4: OpportunityCostCard Component

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/OpportunityCostCard.tsx` (ný)
- `src/components/oneTimePurchase/OpportunityCostCard.test.tsx` (ný)

**Virkni**:
1. Display future values fyrir öll tímabil:
   - Loop through futureValues array
   - Row fyrir hvert (year + formatted value)
   - Help text að útskýra concept

2. Icon: Trending up icon

3. Insight text at bottom

**Prófanir**:
```typescript
// Tests:
- Displays all 3 future value rows
- Formats values correctly
- Shows help text
```

**Kröfur sem uppfylltar**: NS-2 output

**Gátlisti**:
- [ ] Component renders
- [ ] Future values displayed correctly
- [ ] Help text explains concept
- [ ] Tests pass

---

### Verkefni 3.5: FIImpactCard Component (Conditional)

**Áætlaður tími**: 1 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/FIImpactCard.tsx` (ný)
- `src/components/oneTimePurchase/FIImpactCard.test.tsx` (ný)

**Virkni**:
1. Display FI impact:
   - BigNumber fyrir delayMonths
   - Secondary fyrir additionalWorkHours
   - Positive framing text

2. Icon: Calendar icon

3. Conditional rendering:
   - Bara sýnt ef fiImpact exists

**Prófanir**:
```typescript
// Tests:
- Displays delay months
- Displays work hours
- Shows positive framing text
- Renders null if no fiImpact
```

**Kröfur sem uppfylltar**: NS-4 output

**Gátlisti**:
- [ ] Component renders with data
- [ ] Returns null if no data
- [ ] Positive tone í texta
- [ ] Tests pass

---

## Epic 4: Main Page Integration

**Markmið**: Tengja allt saman í working page.

**Tími**: 3-4 klukkustundir

**Áhrif**: Functional single purchase calculator live.

---

### Verkefni 4.1: OneTimePurchasePage Component

**Áætlaður tími**: 2 klst

**Skrár til að búa til/breyta**:
- `src/pages/OneTimePurchasePage.tsx` (ný)
- `src/pages/OneTimePurchasePage.test.tsx` (ný)

**Virkni**:
1. State management:
   - useState fyrir OneTimePurchaseState
   - useState fyrir PurchaseCalculationResult

2. Load userData from context:
   - useContext fyrir UserProfile
   - Extract actualHourlyWage, fiData

3. Load/save localStorage:
   - useEffect on mount: loadFromLocalStorage
   - useEffect on state change: debounced saveToLocalStorage

4. Calculate results:
   - useEffect when inputs change
   - Call calculatePurchaseResult
   - Update results state

5. Render structure:
   - Warning if no actualHourlyWage
   - PurchaseInputSection
   - Results section (3 cards)
   - Clear button

**Prófanir**:
```typescript
// Integration tests:
- Loads from localStorage on mount
- Calculates results on input change
- Saves to localStorage (debounced)
- Shows warning if no actualHourlyWage
- Clear button clears state and localStorage
```

**Kröfur sem uppfylltar**: NS-1, NS-2, NS-4, NS-5 (integration)

**Gátlisti**:
- [ ] State management working
- [ ] localStorage integration
- [ ] Calculations triggered correctly
- [ ] All components render
- [ ] Warning message working
- [ ] Tests pass

---

### Verkefni 4.2: Routing og Navigation

**Áætlaður tími**: 0.5 klst

**Skrár til að breyta**:
- `src/App.tsx` (eða router config file)
- `src/components/Navigation.tsx` (bæta við link)

**Virkni**:
1. Bæta við route fyrir `/one-time-purchase`
2. Bæta við navigation link í aðalnavigation
3. Breadcrumbs ef notað

**Prófanir**:
- Manual: Navigate to page works
- Link visible í navigation

**Kröfur sem uppfylltar**: Aðgengi að eiginleika

**Gátlisti**:
- [ ] Route skilgreindur
- [ ] Navigation link virkar
- [ ] Breadcrumbs (ef applicable)
- [ ] Link á íslensku

---

### Verkefni 4.3: Missing Data Warning Component

**Áætlaður tími**: 0.5 klst

**Skrár til að búa til/breyta**:
- `src/components/common/MissingDataWarning.tsx` (ný eða nota existing)

**Virkni**:
1. Display warning Alert:
   - Variant: warning
   - Message customizable
   - Link til að fara á required page

2. Props:
   - `message: string`
   - `linkTo: string`
   - `linkText?: string`

**Prófanir**:
- Renders með mock props
- Link works

**Kröfur sem uppfylltar**: User guidance

**Gátlisti**:
- [ ] Component renders
- [ ] Link navigates correctly
- [ ] Accessible
- [ ] Íslensku textar

---

### Verkefni 4.4: Debounce Integration

**Áætlaður tími**: 0.5 klst

**Skrár til að breyta**:
- `src/pages/OneTimePurchasePage.tsx`

**Virkni**:
1. Install `use-debounce` library (ef ekki til)
2. Nota `useDebouncedCallback` fyrir localStorage save
3. Set 500ms delay
4. Ensure cleanup on unmount

**Prófanir**:
- Manual: Verify localStorage not written on every keystroke
- Verify saved efter 500ms pause

**Kröfur sem uppfylltar**: Performance optimization

**Gátlisti**:
- [ ] use-debounce installed
- [ ] Debounced save working
- [ ] No performance issues
- [ ] Cleanup handled

---

## Epic 5: Comparison Feature

**Markmið**: Bæta við samanburðarvirkni.

**Tími**: 3-4 klukkustundir

**Áhrif**: Power users geta borið saman marga valkosti.

---

### Verkefni 5.1: ComparisonToggle Component

**Áætlaður tími**: 0.5 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/ComparisonToggle.tsx` (ný)

**Virkni**:
1. Toggle button/switch:
   - Label: "Bera saman valkosti"
   - Boolean state
   - onChange callback

2. Help text explaining feature

**Prófanir**:
- Renders correctly
- Toggle fires onChange

**Kröfur sem uppfylltar**: UI fyrir NS-3

**Gátlisti**:
- [ ] Component renders
- [ ] Toggle works
- [ ] Accessible
- [ ] Íslensku textar

---

### Verkefni 5.2: ComparisonSection Component

**Áætlaður tími**: 1.5 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/ComparisonSection.tsx` (ný)
- `src/components/oneTimePurchase/ComparisonSection.test.tsx` (ný)

**Virkni**:
1. Display main purchase (disabled, label "Valkostur 1")
2. Up to 2 additional option inputs:
   - Name + price fields
   - Remove button
3. "Bæta við valkosti" button (if < 2 extra options)
4. State management fyrir comparisonOptions array

**Prófanir**:
```typescript
// Tests:
- Main purchase displayed (disabled)
- Can add option (up to 2)
- Can remove option
- Add button hidden when 2 options
- onChange callbacks fire correctly
```

**Kröfur sem uppfylltar**: NS-3 input

**Gátlisti**:
- [ ] Input fields working
- [ ] Add/remove buttons
- [ ] Limit to 3 total options
- [ ] Tests pass

---

### Verkefni 5.3: ComparisonResultsSection Component

**Áætlaður tími**: 2 klst

**Skrár til að búa til/breyta**:
- `src/components/oneTimePurchase/ComparisonResultsSection.tsx` (ný)
- `src/components/oneTimePurchase/ComparisonResultsSection.test.tsx` (ný)

**Virkni**:
1. Table layout:
   - Header row með option names
   - Badge á cheapest option
   - Rows: Kaupverð, Lífsorgu klst, Framtíðarvirði (20 ár)

2. ComparisonInsight component:
   - Highlight savings between cheapest and most expensive
   - Positive framing

3. Responsive:
   - Stack vertically on mobile
   - Side-by-side on desktop

**Prófanir**:
```typescript
// Tests:
- Table renders with all options
- Cheapest option badged correctly
- All values displayed
- Insight shows correct savings
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

### Verkefni 5.4: Integrate Comparison into Main Page

**Áætlaður tími**: 1 klst

**Skrár til að breyta**:
- `src/pages/OneTimePurchasePage.tsx`

**Virkni**:
1. Add showComparison state
2. Add comparisonOptions to state
3. Add comparisonResults state
4. Calculate comparison results when enabled:
   - Call compareOptions()
   - Update comparisonResults

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
1. Keyra með screen reader (VoiceOver/NVDA):
   - Test navigation
   - All labels readable
   - Results announced

2. Keyboard navigation:
   - Tab order logical
   - Focus indicators visible
   - Can operate without mouse

3. ARIA labels:
   - Add aria-label þar sem nauðsynlegt
   - aria-describedby fyrir help text
   - role attributes

4. Color contrast:
   - Check all text meets AA standards
   - Fix any issues

**Prófanir**:
- Manual testing með assistive tech
- Automated: axe-core eða Lighthouse

**Kröfur sem uppfylltar**: Accessibility NFRs

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
1. Test á mobile viewports:
   - 320px (small phones)
   - 375px (iPhone)
   - 768px (tablets)

2. Fix layout issues:
   - Cards stack correctly
   - Form fields full-width
   - Table scrolls/stacks on mobile
   - No horizontal scroll

3. Touch targets:
   - Buttons minimum 44x44px
   - Easy to tap on mobile

**Prófanir**:
- Manual testing á device/emulator
- Chrome DevTools device mode

**Kröfur sem uppfylltar**: UI/UX NFRs

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
   - Very small purchases
   - Very large purchases
   - Missing optional data
   - localStorage full
   - Invalid JSON í localStorage

3. User feedback:
   - Loading states (ef nauðsynlegt)
   - Success confirmations
   - Clear error messages í íslensku

**Prófanir**:
- Test all identified edge cases
- Verify error messages

**Kröfur sem uppfylltar**: Robustness

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
- `src/pages/OneTimePurchasePage.integration.test.tsx`

**Virkni**:
1. Full user flows:
   - Enter purchase, see results
   - Enable comparison, add options, see comparison
   - Clear data, verify cleared
   - Reload page, verify persistence

2. Cross-feature integration:
   - Verify actualHourlyWage from context used correctly
   - Verify FI data from context used correctly

**Prófanir**:
```typescript
// Integration test scenarios:
- Complete happy path (single purchase)
- Complete happy path (comparison)
- Missing actualHourlyWage path
- localStorage persistence across reload
- Clear functionality
```

**Kröfur sem uppfylltar**: All requirements validated

**Gátlisti**:
- [ ] All user flows tested
- [ ] Integration tests pass
- [ ] No regressions
- [ ] Performance acceptable

---

## Verkröðun og Dependency Graf

```
Epic 1: Core Calculation Engine (can work in parallel)
├── Task 1.1: Data Models ━━━┐
├── Task 1.2: Life Energy    │
├── Task 1.3: Future Value   │
├── Task 1.4: FI Impact      │
└── Task 1.5: Master Func    │
                             │
Epic 2: Data Layer           │
├── Task 2.1: Validation ────┤
└── Task 2.2: localStorage   │
                             │
Epic 3: Basic UI ◄───────────┘
├── Task 3.1: UI Primitives ━━┐
├── Task 3.2: Input Section   │
├── Task 3.3: Life Energy Card│
├── Task 3.4: Opportunity Card│
└── Task 3.5: FI Impact Card  │
                              │
Epic 4: Main Page ◄───────────┘
├── Task 4.1: Main Page Component
├── Task 4.2: Routing
├── Task 4.3: Warning Component
└── Task 4.4: Debounce

Epic 5: Comparison (depends on Epic 4 complete)
├── Task 5.1: Toggle
├── Task 5.2: Comparison Section
├── Task 5.3: Results Section
└── Task 5.4: Integration

Epic 6: Polish (depends on all epics)
├── Task 6.1: Accessibility
├── Task 6.2: Responsive
├── Task 6.3: Error Handling
└── Task 6.4: Integration Tests
```

## Incremental Delivery Strategy

### Milestone 1: Basic Calculator (after Epic 1-4)
**Shippable**: Yes
**Features**:
- Single purchase calculation
- Life energy + opportunity cost
- FI impact (if data available)
- localStorage persistence

**What's missing**: Comparison feature

---

### Milestone 2: Full Feature (after Epic 5)
**Shippable**: Yes
**Features**:
- Everything from M1
- Comparison mode (2-3 options)

**What's missing**: Final polish

---

### Milestone 3: Production Ready (after Epic 6)
**Shippable**: Production
**Features**:
- Everything from M2
- Full accessibility
- Mobile optimized
- Robust error handling
- Complete test coverage

---

## Testing Strategy Summary

### Unit Tests
- All calculation functions (Epic 1)
- Validation functions (Epic 2)
- Helper functions (formatters)

**Coverage target**: 90%+ fyrir calculation logic

### Component Tests
- All React components (Epic 3, 5)
- Props rendering
- Event handlers
- Conditional rendering

**Coverage target**: 80%+ fyrir components

### Integration Tests
- Main page flows (Epic 4, 6)
- localStorage integration
- Context integration

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
- localStorage quota limits (unlikely but possible)

### Áhættuminnkun
- Test responsive early and often
- Extensive tests fyrir formatters
- Handle localStorage errors gracefully

---

## Árangursviðmið

### Virkni
- [ ] Öll útreikningar framleiða réttar niðurstöður
- [ ] Samanburður virkar með 1-3 valkostum
- [ ] localStorage persistence áreiðanleg
- [ ] Virkar án actualHourlyWage (shows warning)

### Gæði
- [ ] 90%+ test coverage fyrir calculations
- [ ] 80%+ test coverage fyrir components
- [ ] Engar accessibility violations
- [ ] Passes Lighthouse audit (90+ scores)

### Notendaupplifun
- [ ] Intuitive UI (tested með user)
- [ ] Responsive á öllum devices
- [ ] Fast (<100ms calculation updates)
- [ ] Clear error messages

### Code Quality
- [ ] TypeScript strict mode
- [ ] ESLint/Prettier compliant
- [ ] JSDoc fyrir allar public functions
- [ ] Component props documented

---

## Framtíðar Útvíkkun (Utan Scope)

Þessi verkefni eru **ekki** hluti af MVP en skráð til framtíðar:

1. **Purchase History**: Vista öll stórkaup í sögu
2. **Post-Purchase Review**: "Var þetta þess virði?" eftir X mánuði
3. **Charts**: Visual graph fyrir opportunity cost over time
4. **Recurring Costs**: Bæta við mánaðarlegum kostnaði (fjármögnun, tryggingar)
5. **Advanced FI Integration**: Nákvæmari FI date calculation með compound interest

---

## Samantekt

**Heildaráætlun**: 16-20 klukkustundir

**Epics**:
1. Core Calculation Engine: 4-5 klst
2. Data Layer: 2-3 klst
3. Basic UI: 5-6 klst
4. Main Page Integration: 3-4 klst
5. Comparison Feature: 3-4 klst
6. Polish og Testing: 2-3 klst

**Delivery Milestones**:
- M1 (Basic Calculator): After Epic 1-4 (shippable)
- M2 (Full Feature): After Epic 5 (shippable)
- M3 (Production): After Epic 6 (production-ready)

**Success Criteria**:
- All requirements met
- High test coverage
- Accessible and responsive
- Production quality code

Þetta er tilbúið til að byrja implementation.
