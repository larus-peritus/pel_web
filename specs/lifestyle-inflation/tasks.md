# Verkefni: Lífsstílsverðbólguskynjarinn

## Yfirlit

**Eiginleiki**: Lífsstílsverðbólguskynjarinn (Lifestyle Inflation Detector)
**Forrit**: peninganaedalifid.is
**Kröfuskjal**: [requirements.md](./requirements.md)
**Hönnunarskjal**: [design.md](./design.md)

## Útfærslumáti

### Valin stefna: Foundation-First með Incremental Feature Delivery

**Rökstuðningur**:
- Verkefnið byggir á traustum grunni (Context, localStorage, UI íhlutir)
- Gagnalíkön og útreikningar eru kjarninn - verða að vera réttir fyrst
- Hægt að afhendsla virka eiginleika í skrefum (skrá → greina → viðvaranir → gröf)
- Hver skref er prófanlegt og afhentur verðmæti

### Skrefaskipting

1. **Foundation**: Gagnalíkön, tegundir, útreikningsföll
2. **Core CRUD**: Tímabilastjórnun (skrá, breyta, eyða)
3. **Analysis Engine**: Greiningarföll og FI áhrif
4. **Basic UI**: Einfaldir íhlutir fyrir skráningu og skoðun
5. **Visualization**: Gröf og myndrænar framsetningar
6. **Alerts & Suggestions**: Viðvörunarkerfi
7. **Polish**: Farsímaoptimering, aðgengi, prófanir

## Verkþættir (Epics)

### Epic 1: Foundation & Data Models
**Markmið**: Búa til gagnalíkön, tegundir, og grunnútreikningsföll

**Áætlaður tími**: 2-3 vinnudagar

**Árangur**: TypeScript tegundir skilgreindar, grunnútreikningar virka, prófanir passa

---

### Epic 2: Period Management (CRUD)
**Markmið**: Leyfa notendum að skrá, skoða, breyta og eyða tímabilum með útgjöldum

**Áætlaður tími**: 3-4 vinnudagar

**Árangur**: Notendur geta skráð tímabil með útgjöldum, gögn vistuð í localStorage

---

### Epic 3: Inflation Analysis Engine
**Markmið**: Útreikningavél sem greinir lífsstílsverðbólgu og FI áhrif

**Áætlaður tími**: 3-4 vinnudagar

**Árangur**: Sjálfvirk greining keyrir, FI áhrif reiknuð rétt, prófanir passa

---

### Epic 4: Dashboard & Comparison UI
**Markmið**: Aðal dashboard sem sýnir yfirlit og samanburð

**Áætlaður tími**: 3-4 vinnudagar

**Árangur**: Notendur sjá yfirlit, geta borið saman tímabil, litakóðað skor sýnt

---

### Epic 5: Data Visualization (Charts)
**Markmið**: Línurit, súlurit og þróunargröf

**Áætlaður tími**: 3-4 vinnudagar

**Árangur**: Þrjú gröf virka, responsive, interactive

---

### Epic 6: Alerts & Suggestions System
**Markmið**: Viðvaranir og tillögur byggðar á greiningu

**Áætlaður tími**: 2-3 vinnudagar

**Árangur**: Sjálfvirkar viðvaranir birtast, tillögur fyrir hvern flokk

---

### Epic 7: Polish & Optimization
**Markmið**: Farsímaoptimering, aðgengi, performance, E2E prófanir

**Áætlaður tími**: 2-3 vinnudagar

**Árangur**: Fullnaður eiginleiki, prófaður á öllum tækjum, aðgengi uppfyllt

---

## Nákvæm verkefnalýsing

---

## Epic 1: Foundation & Data Models

### Task 1.1: TypeScript Types & Interfaces
**Markmið**: Skilgreina allar TypeScript tegundir fyrir eiginleikann

**Skrár**:
- `src/types/calculator.ts` (uppfæra)

**Virkni**:
- Bæta við Period interface
- Bæta við SpendingData interface
- Bæta við SpendingCategory type
- Bæta við InflationAnalysis interface
- Bæta við CategoryChange interface
- Bæta við FIImpact interface
- Bæta við SalaryUtilization interface
- Bæta við InflationAlert interface
- Bæta við InflationScore type
- Uppfæra StoredState með periods: Period[]

**Prófanir**:
- Type-checking passar (tsc --noEmit)
- Engar TypeScript villur

**Tilvísun í kröfur**: NS-1, NS-2, NS-3, NS-5, NS-7

**Áætlaður tími**: 2-3 klst

---

### Task 1.2: Spending Category Constants
**Markmið**: Skilgreina flokka með íslensku merki og lýsingum

**Skrár**:
- `src/lib/constants/spendingCategories.ts` (ný)

**Virkni**:
- SPENDING_CATEGORY_LABELS: Record<SpendingCategory, string>
- SPENDING_CATEGORY_DESCRIPTIONS: Record<SpendingCategory, string>
- SPENDING_CATEGORIES array fyrir iteration
- Helper föll: getAllCategories(), getCategoryLabel(), getCategoryDescription()

**Prófanir**:
- Unit test: Allir flokkar hafa íslenskt merki
- Unit test: Allir flokkar hafa lýsingu

**Tilvísun í kröfur**: NS-1, NS-4

**Áætlaður tími**: 1 klst

---

### Task 1.3: Default Values & Helpers
**Markmið**: Búa til sjálfgefin gildi og hjálparföll

**Skrár**:
- `src/lib/defaults.ts` (uppfæra)
- `src/lib/utils/periodHelpers.ts` (ný)

**Virkni**:
- DEFAULT_SPENDING: SpendingData (öll gildi = 0)
- createDefaultPeriod(name, year, month?) → Omit<Period, 'id'>
- getEmptySpending() → SpendingData
- getTotalSpending(spending) → number
- formatPeriodName(month?, year) → string (t.d. "Janúar 2024")
- comparePeriods(a, b) → number (fyrir röðun)

**Prófanir**:
- Unit test: sjálfgefin gildi rétt
- Unit test: getTotalSpending() reiknar rétt
- Unit test: formatPeriodName() formatterar rétt

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 2 klst

---

### Task 1.4: Core Calculation Functions
**Markmið**: Útfæra grunnútreikningsföll fyrir lífsstílsverðbólgu

**Skrár**:
- `src/lib/calculations/lifestyleInflation.ts` (ný)

**Virkni**:
- calculateInflationScore(lifestyleCreep) → InflationScore
- calculateChangeSeverity(changePercent) → severity
- analyzeCategoryChanges(current, comparison, wage?) → CategoryChange[]
- detectQuietUpgrades(categoryChanges) → CategoryChange[]
- calculateFIImpact(monthlyChange, income) → FIImpact
- calculateSalaryUtilization(incomeIncrease, expenseIncrease) → SalaryUtilization

**Prófanir**:
- Unit test: calculateInflationScore() með öllum sviðum (0-5%, 5-15%, 15-30%, 30%+)
- Unit test: analyzeCategoryChanges() reiknar rétt breytingar
- Unit test: detectQuietUpgrades() finnur réttar "þöglar uppfærslur"
- Unit test: calculateFIImpact() reiknar FI seinkun rétt
- Unit test: calculateSalaryUtilization() flokkar rétt (healthy/acceptable/concerning/critical)

**Tilvísun í kröfur**: NS-2, NS-3, NS-7

**Áætlaður tími**: 4-6 klst

---

### Task 1.5: Main Analysis Function
**Markmið**: Útfæra aðal analyzeInflation() fallið

**Skrár**:
- `src/lib/calculations/lifestyleInflation.ts` (uppfæra)

**Virkni**:
- analyzeInflation(current, comparison, wage?) → InflationAnalysis
- Reikna heildarbreytingar (spending, income)
- Reikna lífsstílsskrið
- Kalla á analyzeCategoryChanges()
- Kalla á detectQuietUpgrades()
- Kalla á calculateFIImpact()
- Kalla á calculateSalaryUtilization()
- Búa til tóma greining ef ekkert samanburðartímabil

**Prófanir**:
- Unit test: Fyrsta tímabilið (engin greining)
- Unit test: Tvö tímabil með auknum útgjöldum
- Unit test: Tvö tímabil með minnkandi útgjöldum
- Unit test: Útgjöld aukast meira en tekjur (lífsstílsverðbólga)
- Unit test: Útgjöld aukast minna en tekjur (heilbrigt)

**Tilvísun í kröfur**: NS-2, NS-3, NS-7

**Áætlaður tími**: 3-4 klst

---

### Task 1.6: Input Validation
**Markmið**: Staðfesting á öllum inntökum

**Skrár**:
- `src/lib/utils/validators.ts` (uppfæra)

**Virkni**:
- validatePeriod(period) → ValidationResult
  - Nafn: ekki tómt, max 100 stafir
  - Ár: 2020-2030
  - Mánuður: 1-12 eða null
  - Tekjur: >= 0
  - Útgjöld: öll >= 0
- validateSpending(spending) → ValidationResult
  - Öll gildi >= 0
  - Ekkert gildi > 10.000.000 (sanity check)

**Prófanir**:
- Unit test: Gilt tímabil samþykkt
- Unit test: Tómt nafn hafnað
- Unit test: Ógilt ár hafnað
- Unit test: Neikvæð útgjöld hafnuð

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 2 klst

---

### Task 1.7: Update StoredState Schema
**Markmið**: Uppfæra StoredState til að innihalda periods

**Skrár**:
- `src/types/calculator.ts` (uppfæra)
- `src/lib/storage/localStorage.ts` (uppfæra)

**Virkni**:
- Bæta við periods: Period[] í StoredState
- Uppfæra version number (t.d. 1 → 2)
- Migration logic ef gömul útgáfa
- Export/import styður Period[]

**Prófanir**:
- Integration test: Vista periods í localStorage
- Integration test: Hlaða periods úr localStorage
- Integration test: Migration frá útgáfu 1 → 2

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 2-3 klst

---

## Epic 2: Period Management (CRUD)

### Task 2.1: Update CalculatorContext
**Markmið**: Bæta við periods og CRUD aðferðum í Context

**Skrár**:
- `src/context/CalculatorContext.tsx` (uppfæra)

**Virkni**:
- State: periods: Period[]
- addPeriod(period: Omit<Period, 'id'>) → void
- updatePeriod(id: string, updates: Partial<Period>) → void
- deletePeriod(id: string) → void
- getPeriodById(id: string) → Period | undefined
- Derived state: inflationAnalysis (useMemo)
  - Bera saman nýjasta tímabil við fyrra
  - Keyrir analyzeInflation() sjálfkrafa

**Prófanir**:
- Integration test: addPeriod() bætir við
- Integration test: updatePeriod() uppfærir
- Integration test: deletePeriod() eyðir
- Integration test: inflationAnalysis uppfærst sjálfkrafa

**Tilvísun í kröfur**: NS-1, NS-2

**Áætlaður tími**: 3-4 klst

---

### Task 2.2: PeriodForm Component
**Markmið**: Eyðublað til að skrá eða breyta tímabili

**Skrár**:
- `src/components/lifestyle-inflation/PeriodForm.tsx` (ný)

**Virkni**:
- Props: mode ('add' | 'edit'), period?, onSave, onCancel
- Inntak: nafn, mánuður (dropdown 1-12 eða "Árleg"), ár (dropdown 2020-2030), tekjur
- Real-time validation með villuboðum
- Sjálfgefið nafn: "Janúar 2024" eða "Árið 2024"
- Vista → kalla onSave með period gögnum
- Hætta við → kalla onCancel

**Prófanir**:
- Component test: Form renderar rétt
- Component test: Validation virkar
- Component test: onSave kallað með réttum gögnum
- Component test: Edit mode fyllir út gildi

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 3-4 klst

---

### Task 2.3: ExpenseTracker Component
**Markmið**: Skrá útgjöld fyrir tímabil, flokkað

**Skrár**:
- `src/components/lifestyle-inflation/ExpenseTracker.tsx` (ný)

**Virkni**:
- Props: period, onSave, onCancel
- Sýna alla 9 flokka með CategoryInput
- Reikna heildarsummu sjálfkrafa (real-time)
- Sýna lífsorgu kostnað fyrir heildarsummu (ef actualHourlyWage þekkt)
- Validation: öll gildi >= 0
- Vista → uppfæra period.spending í Context

**Prófanir**:
- Component test: Allir flokkar sýndir
- Component test: Heildarsamtala rétt
- Component test: onSave kallað með réttum gögnum
- Component test: Validation hindrar neikvæð gildi

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 3-4 klst

---

### Task 2.4: CategoryInput Component
**Markmið**: Inntak fyrir einn útgjaldaflokk

**Skrár**:
- `src/components/lifestyle-inflation/CategoryInput.tsx` (ný)

**Virkni**:
- Props: category, value, onChange, actualHourlyWage?
- Label: Íslenskt heiti + lýsing (tooltip eða smátexti)
- CurrencyInput íhlutur (endurnýttur)
- Sýna lífsorgu kostnað við hlið (ef actualHourlyWage)
  - T.d. "80.000 kr → 42 klst/mán"
- Real-time validation

**Prófanir**:
- Component test: Label rétt
- Component test: onChange kallað
- Component test: Lífsorga birt ef wage þekkt
- Component test: Lífsorga falin ef wage ekki þekkt

**Tilvísun í kröfur**: NS-1, NS-2

**Áætlaður tími**: 2 klst

---

### Task 2.5: PeriodManager Component
**Markmið**: Lista og stjórna öllum tímabilum

**Skrár**:
- `src/components/lifestyle-inflation/PeriodManager.tsx` (ný)

**Virkni**:
- Props: periods, onSelectPeriod, onDeletePeriod, onAddPeriod
- Listi af öllum tímabilum, raðað eftir dagsetningu (nýjast fyrst)
- Hver tímabil:
  - Nafn og dagsetning
  - Heildarsumma útgjalda
  - Tekjur
  - Aðgerðir: Skoða, Breyta, Eyða
- Tómur ástand: "Engin tímabil enn. Bættu við fyrsta tímabilinu þínu!"
- Staðfesting fyrir eyðingu

**Prófanir**:
- Component test: Tómur ástand sýndur
- Component test: Listi renderar rétt
- Component test: Eyðingarstaðfesting birt
- Component test: Aðgerðir kalla rétt föll

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 3 klst

---

### Task 2.6: Period CRUD Flow (Integration)
**Markmið**: Heildstætt flæði fyrir skráningu og stjórnun tímabila

**Skrár**:
- `src/app/lifestyle-inflation/page.tsx` (ný)

**Virkni**:
- Nota CalculatorContext til að sækja periods
- Modal/dialog fyrir PeriodForm
- Modal/dialog fyrir ExpenseTracker
- PeriodManager sem aðal listi
- Flæði: Bæta við → PeriodForm → Vista → ExpenseTracker → Vista útgjöld → Sjá í lista

**Prófanir**:
- E2E test: Skrá nýtt tímabil
- E2E test: Breyta tímabili
- E2E test: Eyða tímabili
- E2E test: localStorage vistuð rétt

**Tilvísun í kröfur**: NS-1

**Áætlaður tími**: 3-4 klst

---

## Epic 3: Inflation Analysis Engine

### Task 3.1: Alert Generation System
**Markmið**: Búa til viðvaranir byggðar á greiningu

**Skrár**:
- `src/lib/calculations/lifestyleInflation.ts` (uppfæra)

**Virkni**:
- generateAlerts(lifestyleCreep, categoryChanges, fiImpact, salaryUtilization?) → InflationAlert[]
- Heildarviðvaranir:
  - critical: lifestyleCreep > 30%
  - warning: lifestyleCreep > 15%
- Flokkasértækar viðvaranir:
  - critical: changePercent > 30%
  - warning: changePercent > 15%
- Launahækkunar viðvaranir:
  - critical: utilizationPercent > 80%
  - warning: utilizationPercent > 50%
- Hver viðvörun inniheldur: message, detail, fiImpact, suggestions[]

**Prófanir**:
- Unit test: Engar viðvaranir ef heilbrigt
- Unit test: Viðvörun fyrir alvarlega lífsstílsverðbólgu
- Unit test: Flokkasértæk viðvörun
- Unit test: Launahækkunar viðvörun

**Tilvísun í kröfur**: NS-5

**Áætlaður tími**: 3-4 klst

---

### Task 3.2: Category Suggestions
**Markmið**: Tillögur fyrir hvern flokk

**Skrár**:
- `src/lib/calculations/lifestyleInflation.ts` (uppfæra)

**Virkni**:
- getSuggestionsForCategory(category) → string[]
- Skilgreina tillögur fyrir hvern flokk (a.m.k. 3 tillögur hver)
- Íslenskar tillögur sem eru raunhæfar og aðgerðamiðaðar
- Housing: Ódýrara húsnæði, lægri vextir, minni rafmagnsnotkun
- Food: Elda heima, skipuleggja máltíðir, kaupa í lausu
- Transportation: Hjólreiðar, samgöngur, sparneytni bíll
- Subscriptions: Fara yfir lista, deila með fjölskyldu, skiptast á
- Convenience: Undirbúa máltíðir, 24 klst regla, nota lista
- o.s.frv.

**Prófanir**:
- Unit test: Allar flokkar hafa a.m.k. 3 tillögur
- Unit test: Tillögur ekki tómar

**Tilvísun í kröfur**: NS-6

**Áætlaður tími**: 2 klst

---

### Task 3.3: Analysis Context Integration
**Markmið**: Sjálfvirk greining í Context með useMemo

**Skrár**:
- `src/context/CalculatorContext.tsx` (uppfæra)

**Virkni**:
- inflationAnalysis: InflationAnalysis | null
- useMemo hook:
  - Dependent: periods, actualHourlyWage
  - Ef periods.length < 2 → null
  - Annars: analyzeInflation(nýjasta, næst-nýjasta, actualHourlyWage)
- Sjálfvirk uppfærsla þegar periods eða actualHourlyWage breytast

**Prófanir**:
- Integration test: inflationAnalysis null ef < 2 tímabil
- Integration test: inflationAnalysis reiknast sjálfkrafa
- Integration test: Uppfærist þegar nýtt tímabil bætist við
- Integration test: Uppfærist þegar actualHourlyWage breytist

**Tilvísun í kröfur**: NS-2, NS-5

**Áætlaður tími**: 2 klst

---

### Task 3.4: FI Impact Calculations Polish
**Markmið**: Fínpússa FI áhrif útreikninga

**Skrár**:
- `src/lib/calculations/lifestyleInflation.ts` (uppfæra)

**Virkni**:
- Betri áætlun á árlegum sparnaði (nota currentIncome × savings rate)
- Meðhöndla edge cases:
  - Ef sparnaður neikvæður (eyðir meira en aflar) → sérstök viðvörun
  - Ef engar tekjur → ekki reikna FI áhrif
  - Ef útgjöld minnka → sýna "fyrr í FI" í stað "seinkun"
- Lífsorgu kostnaður FI seinkunar

**Prófanir**:
- Unit test: Edge cases meðhöndluð rétt
- Unit test: Minnkandi útgjöld sýna jákvæð áhrif

**Tilvísun í kröfur**: NS-3

**Áætlaður tími**: 2 klst

---

## Epic 4: Dashboard & Comparison UI

### Task 4.1: LifestyleInflationDetector Main Component
**Markmið**: Aðal dashboard íhlutur

**Skrár**:
- `src/components/lifestyle-inflation/LifestyleInflationDetector.tsx` (ný)

**Virkni**:
- Sækja periods og inflationAnalysis úr Context
- Sýna yfirlit (kort):
  - Síðasta breyting (króna og prósenta)
  - Lífsstílsskrið prósenta
  - FI seinkun (ár og mánuðir)
- Dropdown til að velja hvaða tímabil bera saman (default: 2 nýjustu)
- Placeholder ef engin tímabil: "Byrjaðu að skrá tímabil til að sjá greining"
- Placeholder ef eitt tímabil: "Skráðu annað tímabil til að sjá samanburð"

**Prófanir**:
- Component test: Placeholder sýndur ef engin tímabil
- Component test: Yfirlit sýnt ef greining til
- Component test: Velja tímabil uppfærir samanburð

**Tilvísun í kröfur**: NS-2

**Áætlaður tími**: 3-4 klst

---

### Task 4.2: InflationScoreDisplay Component
**Markmið**: Sýna heildarverðbólguskor með litakóðun

**Skrár**:
- `src/components/lifestyle-inflation/InflationScoreDisplay.tsx` (ný)

**Virkni**:
- Props: score, lifestyleCreep
- Stórt badge með lit:
  - healthy: Grænt
  - caution: Gult
  - warning: Appelsínugult
  - critical: Rautt
- Texti sem útskýrir stöðu:
  - healthy: "Heilbrigt! Útgjöld stöðug eða minnka."
  - caution: "Varkár. Lítil lífsstílsverðbólga greind."
  - warning: "Viðvörun! Umtalsverð lífsstílsverðbólga."
  - critical: "Áhyggjuefni! Alvarleg lífsstílsverðbólga."
- Sýna nákvæma lífsstílsskrið prósentu

**Prófanir**:
- Component test: Rétt litur fyrir hvern score
- Component test: Texti rétt
- Component test: Prósenta birt

**Tilvísun í kröfur**: NS-2

**Áætlaður tími**: 2 klst

---

### Task 4.3: ComparisonView Component
**Markmið**: Hlið við hlið samanburður tveggja tímabila

**Skrár**:
- `src/components/lifestyle-inflation/ComparisonView.tsx` (ný)

**Virkni**:
- Props: currentPeriod, comparisonPeriod, analysis
- Tafla með tveimur dálkum (fyrra | núverandi)
- Röð fyrir hvern flokk:
  - Flokksnafn
  - Fyrri upphæð
  - Núverandi upphæð
  - Breyting (króna og prósenta)
  - Litakóðað eftir severity (grænt/gult/rautt)
- Heildarröð neðst
- Lífsorgu kostnaður (ef actualHourlyWage þekkt)

**Prófanir**:
- Component test: Tafla renderar rétt
- Component test: Litakóðun rétt
- Component test: Lífsorga sýnd ef wage þekkt

**Tilvísun í kröfur**: NS-2, NS-4

**Áætlaður tími**: 3-4 klst

---

### Task 4.4: FIImpactCard Component
**Markmið**: Kort sem sýnir FI áhrif

**Skrár**:
- `src/components/lifestyle-inflation/FIImpactCard.tsx` (ný)

**Virkni**:
- Props: fiImpact, actualHourlyWage?
- Sýna:
  - Aukin árleg útgjöld
  - Aukin FI þörf (× 25)
  - FI seinkun (ár og mánuðir)
  - Tapað framtíðarvirði (10 ár og 20 ár)
  - Lífsorgu kostnaður (árlega)
- Tooltip með útskýringum
- Sérstök meðhöndlun ef útgjöld minnka (jákvætt!)

**Prófanir**:
- Component test: Allar tölur birtar
- Component test: Jákvæð áhrif sýnd rétt
- Component test: Lífsorga sýnd ef wage þekkt

**Tilvísun í kröfur**: NS-3

**Áætlaður tími**: 2-3 klst

---

### Task 4.5: SalaryUtilizationCard Component
**Markmið**: Sýna launahækkunar nýtingu

**Skrár**:
- `src/components/lifestyle-inflation/SalaryUtilizationCard.tsx` (ný)

**Virkni**:
- Props: utilization
- Sýna:
  - Tekjuaukning
  - Útgjaldaaukning
  - Sparnaðaraukning (difference)
  - Nýtniprósenta
  - Stöðumerking (litakóðað)
- Progress bar sem sýnir skiptingu (útgjöld vs sparnaður)
- Tillögur um betri nýtingu ef concerning/critical

**Prófanir**:
- Component test: Allar tölur birtar
- Component test: Litakóðun rétt
- Component test: Progress bar rétt

**Tilvísun í kröfur**: NS-7

**Áætlaður tími**: 2-3 klst

---

### Task 4.6: Dashboard Layout & Responsive Design
**Markmið**: Raða öllum íhlutum í dashboard

**Skrár**:
- `src/components/lifestyle-inflation/LifestyleInflationDetector.tsx` (uppfæra)

**Virkni**:
- Desktop (> 1024px):
  - Yfirlit kort efst (3 kort í röð)
  - Samanburður vinstra megin
  - FI áhrif og launahækkunar nýting hægra megin
- Tablet (768-1024px):
  - 2 dálka grid
  - Yfirlit 2 kort í röð
- Farsími (< 768px):
  - Einn dálkur
  - Collapsible sections
  - Yfirlit sticky efst

**Prófanir**:
- Component test: Layout rétt á öllum skjástærðum
- Visual regression test

**Tilvísun í kröfur**: NS-8

**Áætlaður tími**: 2-3 klst

---

## Epic 5: Data Visualization (Charts)

### Task 5.1: Setup Chart Library
**Markmið**: Velja og setja upp chart library

**Skrár**:
- `package.json` (uppfæra)
- `src/lib/charts/config.ts` (ný)

**Virkni**:
- Setja upp Recharts (eða Chart.js)
- Grunnstillingar:
  - Litapaletta (samræmi við Tailwind)
  - Default responsive behavior
  - Icelandic locale fyrir tölur
- Theme configuration

**Prófanir**:
- Integration test: Library hlaðast rétt
- Bundle size check (ekki of stór)

**Tilvísun í kröfur**: NS-4

**Áætlaður tími**: 1-2 klst

---

### Task 5.2: TrendChart Component (Line Chart)
**Markmið**: Línurit sem sýnir útgjöld vs tekjur yfir tíma

**Skrár**:
- `src/components/lifestyle-inflation/TrendChart.tsx` (ný)

**Virkni**:
- Props: periods[], actualHourlyWage?
- Þrjár línur:
  - Útgjöld (solid line, primary color)
  - Tekjur (dashed line, secondary color)
  - "Ef stöðugt" (dotted line, gray) - fyrsta tímabils útgjöld haldið fast
- X-axis: Dagsetning (mánuður/ár)
- Y-axis: Króna upphæð
- Hover tooltip: Nákvæm gildi, prósenta breyting
- Responsive: Horizontal scroll á farsíma ef mörg tímabil
- Legend

**Prófanir**:
- Component test: Graf renderar
- Component test: Þrjár línur sýndar
- Component test: Tooltip virkar

**Tilvísun í kröfur**: NS-4

**Áætlaður tími**: 4-5 klst

---

### Task 5.3: CategoryBreakdownChart Component (Bar Chart)
**Markmið**: Súlurit sem sýnir flokka, borið saman milli tímabila

**Skrár**:
- `src/components/lifestyle-inflation/CategoryBreakdownChart.tsx` (ný)

**Virkni**:
- Props: analysis
- Hlið við hlið súlur fyrir hvern flokk
- Litakóðað eftir severity:
  - decrease: Grænt
  - stable/minor: Blátt (neutral)
  - moderate: Gult
  - major: Rautt
- Raðað eftir stærð (hæst fyrst) eða alphabetically
- Hover tooltip: Nákvæm gildi, prósenta breyting
- Responsive: Horizontal scroll á farsíma

**Prófanir**:
- Component test: Súlur renderar
- Component test: Litakóðun rétt
- Component test: Tooltip virkar

**Tilvísun í kröfur**: NS-4

**Áætlaður tími**: 4-5 klst

---

### Task 5.4: Spending Distribution Pie Chart (Optional)
**Markmið**: Skífurit sem sýnir flokkadreifingu

**Skrár**:
- `src/components/lifestyle-inflation/SpendingDistributionChart.tsx` (ný)

**Virkni**:
- Props: period
- Skífurit með hlutfalli fyrir hvern flokk
- Litakóðað eftir flokki
- Hover: Prósenta og króna upphæð
- Legend
- Responsive

**Prófanir**:
- Component test: Graf renderar
- Component test: Prósentur rétt

**Tilvísun í kröfur**: NS-4

**Áætlaður tími**: 3 klst

---

### Task 5.5: Chart Integration in Dashboard
**Markmið**: Bæta gröfum við dashboard

**Skrár**:
- `src/components/lifestyle-inflation/LifestyleInflationDetector.tsx` (uppfæra)

**Virkni**:
- TrendChart í stórum section
- CategoryBreakdownChart í næsta section
- Tabs eða toggle til að skipta á milli gröf
- Loading state meðan graf render
- Placeholder ef ekki nóg gögn

**Prófanir**:
- E2E test: Gröf birtast
- E2E test: Gögn uppfærast þegar tímabil breytt

**Tilvísun í kröfur**: NS-4

**Áætlaður tími**: 2 klst

---

## Epic 6: Alerts & Suggestions System

### Task 6.1: InflationAlerts Component
**Markmið**: Lista allar viðvaranir með tillögum

**Skrár**:
- `src/components/lifestyle-inflation/InflationAlerts.tsx` (ný)

**Virkni**:
- Props: alerts[], onDismiss
- Flokka viðvaranir eftir type:
  - critical: Rauð bakgrunnur
  - warning: Gul bakgrunnur
  - info: Blá bakgrunnur
- Hver viðvörun:
  - Icon (⚠️ eða ℹ️)
  - Message (bold)
  - Detail (smátexti)
  - FI áhrif (highlighted)
  - Suggestions (bulleted list, collapsible)
  - Dismiss hnappur (ef canDismiss)
- Raðað eftir alvarleika (critical fyrst)
- Tómur ástand: "Engar viðvaranir! Útgjöld þín eru heilbrigð." (grænt)

**Prófanir**:
- Component test: Viðvaranir flokkaðar rétt
- Component test: Tillögur collapsible
- Component test: Dismiss virkar
- Component test: Tómur ástand sýndur

**Tilvísun í kröfur**: NS-5, NS-6

**Áætlaður tími**: 3-4 klst

---

### Task 6.2: Alert Dismissal Persistence
**Markmið**: Geyma hvaða viðvaranir hefur verið hafnað

**Skrár**:
- `src/context/CalculatorContext.tsx` (uppfæra)
- `src/types/calculator.ts` (uppfæra)

**Virkni**:
- Bæta við dismissedAlerts: string[] í StoredState
- dismissAlert(id: string) → bæta id við lista
- Sía út hafnaðar viðvaranir úr inflationAnalysis.alerts
- Reset valmöguleiki til að endurheimta allar viðvaranir

**Prófanir**:
- Integration test: Hafna viðvörun → fela
- Integration test: Vistað í localStorage
- Integration test: Endurheimt sýnir allar aftur

**Tilvísun í kröfur**: NS-5

**Áætlaður tími**: 2 klst

---

### Task 6.3: Proactive Suggestions Display
**Markmið**: Sýna tillögur jafnvel ef engar viðvaranir (proactive)

**Skrár**:
- `src/components/lifestyle-inflation/ProactiveSuggestions.tsx` (ný)

**Virkni**:
- Props: analysis
- Ef engar viðvaranir (heilbrigt):
  - Sýna tillögur til að halda því áfram
  - T.d. "Haltu áfram! Skipulagðu máltíðir til að halda matarkostnaði föstum."
- Ef lífsstílsverðbólga:
  - Sýna tillögur fyrir alla flokka með aukningum
- Litlar kort fyrir hverja tillögu
- Aðgerð hnappur: "Setja sem markmið" (future feature)

**Prófanir**:
- Component test: Tillögur sýndar
- Component test: Skipta á milli heilbrigt/viðvaranir

**Tilvísun í kröfur**: NS-6

**Áætlaður tími**: 2-3 klst

---

## Epic 7: Polish & Optimization

### Task 7.1: Mobile Optimization
**Markmið**: Farsímavæn upplifun

**Skrár**:
- Allir íhlutir (uppfæra stíl)

**Virkni**:
- Touch targets > 44px
- Swipe gesture fyrir tímabilaskoðun (optional)
- Collapsible sections á farsíma
- Horizontal scroll fyrir gröf
- Sticky yfirlit efst
- Viðeigandi input types (number, date)
- Talnalyklaborð fyrir upphæðir

**Prófanir**:
- E2E test á farsíma viewport (375px, 414px)
- Touch interaction test
- Keyboard behavior test

**Tilvísun í kröfur**: NS-8

**Áætlaður tími**: 3-4 klst

---

### Task 7.2: Accessibility Audit & Fixes
**Markmið**: WCAG 2.1 AA samræmi

**Skrár**:
- Allir íhlutir (uppfæra ARIA)

**Virkni**:
- ARIA labels á öllum form inputs
- ARIA live regions fyrir dynamic uppfærslur
- Keyboard navigation (Tab, Enter, Space, Escape)
- Focus indicators sýnilegir
- Litakóðun með textamerki (ekki bara litur)
- Screen reader testing
- Skip links
- Semantic HTML (header, main, section, nav)

**Prófanir**:
- Automated accessibility testing (axe, Lighthouse)
- Manual screen reader testing (VoiceOver, NVDA)
- Keyboard-only navigation test

**Tilvísun í kröfur**: Kröfur sem ekki tengjast virkni - Aðgengi

**Áætlaður tími**: 3-4 klst

---

### Task 7.3: Performance Optimization
**Markmið**: Fljótlegur og smooth eiginleiki

**Skrár**:
- Allir íhlutir (memoization)

**Virkni**:
- useMemo fyrir dýra útreikninga
- React.memo fyrir íhluti
- Lazy loading fyrir gröf
- Debounce á localStorage vistun (500ms)
- Code splitting (dynamic imports)
- Bundle size optimization

**Prófanir**:
- Lighthouse performance score > 90
- Time to Interactive < 3s
- Render time < 100ms fyrir input changes

**Tilvísun í kröfur**: Kröfur sem ekki tengjast virkni - Afköst

**Áætlaður tími**: 2-3 klst

---

### Task 7.4: Error Handling & Edge Cases
**Markmið**: Robust villumeðhöndlun

**Skrár**:
- Allir íhlutir og föll

**Virkni**:
- localStorage full → sýna viðvörun, bjóða export
- Vantar actualHourlyWage → sýna skilaboð, leyfa samt virkni
- Engin tímabil → onboarding skilaboð
- Eitt tímabil → hvatning til að skrá annað
- Division by zero → meðhöndla í útreikningum
- Invalid data → validation og villuboð
- Network issues (ef einhver API í framtíð) → retry logic

**Prófanir**:
- Unit test: Edge cases meðhöndluð
- Integration test: Villuboð birtast
- E2E test: Endurheimt frá villu

**Tilvísun í kröfur**: Villumeðhöndlun

**Áætlaður tími**: 2-3 klst

---

### Task 7.5: Comprehensive Testing
**Markmið**: Full test coverage

**Skrár**:
- Allar test skrár

**Virkni**:
- Unit tests fyrir öll útreikningsföll (> 90% coverage)
- Component tests fyrir alla íhluti (> 80% coverage)
- Integration tests fyrir Context og flæði
- E2E tests fyrir öll aðalflæði:
  - Skrá tímabil
  - Sjá greining
  - Fá viðvaranir
  - Skoða gröf
- Visual regression tests
- Performance tests

**Prófanir**:
- Test coverage report: Overall > 80%
- Allir tests passa

**Tilvísun í kröfur**: Prófunarstefna

**Áætlaður tími**: 4-5 klst

---

### Task 7.6: Documentation
**Markmið**: Skjalfesta eiginleikann

**Skrár**:
- `README.md` fyrir lifestyle-inflation (í möppunni)
- JSDoc comments á öllum exported föllum
- Storybook stories (optional)

**Virkni**:
- README með:
  - Yfirlit yfir eiginleika
  - Hvernig á að nota
  - Arkitektúr yfirlit
  - Testing leiðbeiningar
- JSDoc fyrir allar tegundir og föll
- Inline comments fyrir flókna rökfræði

**Tilvísun í kröfur**: N/A (góð venja)

**Áætlaður tími**: 2 klst

---

### Task 7.7: Final Integration & Polish
**Markmið**: Samþætta við aðalforrit og fínpússa

**Skrár**:
- `src/app/page.tsx` (uppfæra með link)
- Navigation íhlutir

**Virkni**:
- Bæta við "Lífsstílsverðbólguskynir" í navigation
- Link frá aðalsíðu
- Breadcrumbs
- SEO metadata
- Open Graph tags
- Favicon update (ef þarf)

**Prófanir**:
- E2E test: Navigation virkar
- SEO audit
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

**Tilvísun í kröfur**: Almennar

**Áætlaður tími**: 2 klst

---

## Samantekt

### Heildaráætlun

| Epic | Verkefni | Áætlaður tími |
|------|----------|---------------|
| 1. Foundation & Data Models | 7 tasks | 2-3 dagar |
| 2. Period Management (CRUD) | 6 tasks | 3-4 dagar |
| 3. Inflation Analysis Engine | 4 tasks | 3-4 dagar |
| 4. Dashboard & Comparison UI | 6 tasks | 3-4 dagar |
| 5. Data Visualization (Charts) | 5 tasks | 3-4 dagar |
| 6. Alerts & Suggestions System | 3 tasks | 2-3 dagar |
| 7. Polish & Optimization | 7 tasks | 2-3 dagar |
| **HEILDARTÍMI** | **38 tasks** | **18-25 vinnudagar** |

### Forgangsröðun

**Must-Have (MVP)**:
- Epic 1: Foundation (nauðsynlegt)
- Epic 2: Period Management (kjarninn)
- Epic 3: Analysis Engine (gildi)
- Epic 4: Dashboard UI (notendaupplifun)

**Should-Have**:
- Epic 5: Visualization (mikilvægt en ekki nauðsynlegt fyrir MVP)
- Epic 6: Alerts & Suggestions (virðisauki)

**Nice-to-Have**:
- Epic 7: Polish (gott að hafa en má gera eftir launch)

### Milestone Áætlun

**Milestone 1: Foundation Complete** (Vika 1)
- Epics 1-2 lokið
- Notendur geta skráð tímabil með útgjöldum
- Gögn vistuð í localStorage

**Milestone 2: Analysis Working** (Vika 2)
- Epic 3 lokið
- Sjálfvirk greining keyrir
- FI áhrif reiknuð

**Milestone 3: MVP Complete** (Vika 3)
- Epic 4 lokið
- Dashboard virkar
- Samanburður sýndur
- Greining birt

**Milestone 4: Full Feature** (Vika 4)
- Epics 5-6 lokið
- Gröf virka
- Viðvaranir og tillögur virka

**Milestone 5: Production Ready** (Vika 5)
- Epic 7 lokið
- Prófanir allar lokið
- Aðgengi uppfyllt
- Farsímavænt

### Áhættumat

| Áhætta | Líkur | Áhrif | Mótvægi |
|--------|-------|-------|---------|
| Chart library integration flókið | Miðlungs | Há | Velja einfaldan library (Recharts), research fyrst |
| Performance issues með mörg tímabil | Lág | Miðlungs | useMemo, virtualization ef þarf |
| Flóknar útreikningar rangt | Lág | Há | Ítarlegar unit tests, manual verification |
| Mobile UX ekki góð | Miðlungs | Miðlungs | Mobile-first design, early testing |
| localStorage full | Lág | Lág | Export feature, warningar |

### Góð venja

**Eftir hvern Epic**:
- Code review
- Run full test suite
- Manual testing á öllum vöfrum
- Performance check
- Git commit með ítarlegri skilaboðum

**Eftir hvern Milestone**:
- Demo fyrir stakeholders (ef við á)
- Feedback gathering
- Adjust priorities ef þarf

**Fyrir Production**:
- Full regression testing
- Accessibility audit
- Performance audit
- Security check
- Backup plan ef vandamál

---

## Rekjanleiki við hönnun

### Gagnalíkön → Tasks
- Period, SpendingData, InflationAnalysis → Task 1.1
- Validation → Task 1.6
- StoredState uppfærsla → Task 1.7

### Útreikningar → Tasks
- Core calculations → Task 1.4, 1.5
- FI impact → Task 3.4
- Alerts generation → Task 3.1
- Suggestions → Task 3.2

### Íhlutir → Tasks
- PeriodForm → Task 2.2
- ExpenseTracker → Task 2.3
- CategoryInput → Task 2.4
- PeriodManager → Task 2.5
- LifestyleInflationDetector → Task 4.1
- InflationScoreDisplay → Task 4.2
- ComparisonView → Task 4.3
- FIImpactCard → Task 4.4
- SalaryUtilizationCard → Task 4.5
- TrendChart → Task 5.2
- CategoryBreakdownChart → Task 5.3
- InflationAlerts → Task 6.1

### Samþætting → Tasks
- Context uppfærsla → Task 2.1, 3.3
- localStorage → Task 1.7
- Dashboard layout → Task 4.6
- Chart integration → Task 5.5

### Gæði → Tasks
- Mobile optimization → Task 7.1
- Accessibility → Task 7.2
- Performance → Task 7.3
- Error handling → Task 7.4
- Testing → Task 7.5

---

## Næstu skref

1. **Forgangsraða**: Ákveða hvort MVP nægir eða þarf fullan eiginleika
2. **Sprintaskipulag**: Skipuleggja tasks í 1-2 vikna sprints
3. **Úthluta**: Úthluta tasks til developers
4. **Byrja á Epic 1**: Foundation er nauðsynlegur grunnur
5. **Iterative delivery**: Afhendsla eftir hvern milestone
6. **Continuous feedback**: Prófa með raunverulegum notendum snemma

---

**Áætlað byrjunar dagsetning**: [TBD]
**Áætlað lokadagsetning (MVP)**: [TBD + 3 vikur]
**Áætlað lokadagsetning (Full)**: [TBD + 5 vikur]
